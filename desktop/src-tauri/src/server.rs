use crate::{spacetime_server, ui_messages, util, AppHandle, AppState};
use axum::{
    body::Body,
    extract::{
        connect_info::ConnectInfo,
        ws::{Message, WebSocket, WebSocketUpgrade},
        Path, Query, Request, State as AxumState,
    },
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::{any, delete, get, post},
    Json, Router,
};
use http::Method;
use log::{error, info, warn};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::SocketAddr;
use tauri::Manager;
use tower_http::cors::{Any, CorsLayer};

#[derive(Clone)]
struct ServerState {
    app_handle: AppHandle,
}

pub async fn setup(app_handle: &AppHandle) -> anyhow::Result<()> {
    let state = ServerState {
        app_handle: app_handle.clone(),
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any)
        .allow_origin(Any);

    let router = Router::new()
        .route("/ws", get(ws_handler))
        .route("/releases", get(releases_handler))
        .route("/child-process/signal", post(signal_handler))
        .route("/daemon/:pro_id/status", get(daemon_status_handler))
        .route("/daemon/:pro_id/restart", get(daemon_restart_handler))
        .route("/daemon-proxy/:pro_id/*path", any(daemon_proxy_handler))
        .route("/auth/slack", get(slack_auth_handler))
        .route("/auth/slack/callback", get(slack_auth_callback_handler))
        .route("/auth/status", get(auth_status_handler))
        .route("/api/keys", post(generate_api_key_handler))
        .route("/api/keys", get(list_api_keys_handler))
        .route("/api/keys/:id", delete(delete_api_key_handler))
        .route("/spacetime/status", get(spacetime_status_handler))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:25842").await?;
    info!("Listening on {}", listener.local_addr()?);
    return axum::serve(
        listener,
        router.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .map_err(anyhow::Error::from);
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SendSignalMessage {
    process_id: i32,
    signal: i32, // should match nix::sys::signal::Signal
}

async fn signal_handler(
    AxumState(_server): AxumState<ServerState>,
    Json(payload): Json<SendSignalMessage>,
) -> impl IntoResponse {
    info!(
        "received request to send signal {} to process {}",
        payload.signal,
        payload.process_id.to_string()
    );
    util::kill_process(payload.process_id as u32);

    return StatusCode::OK;
}

async fn releases_handler(AxumState(server): AxumState<ServerState>) -> impl IntoResponse {
    let state = server.app_handle.state::<AppState>();
    let releases = state.releases.lock().unwrap();
    let releases = releases.clone();

    Json(releases)
}

async fn daemon_status_handler(
    Path(pro_id): Path<String>,
    AxumState(_server): AxumState<ServerState>,
) -> impl IntoResponse {
    let state = _server.app_handle.state::<AppState>();
    let pro = state.pro.read().await;
    return match pro.find_instance(pro_id) {
        Some(pro_instance) => match pro_instance.daemon() {
            Some(daemon) => Json(daemon.status()).into_response(),
            None => StatusCode::NOT_FOUND.into_response(),
        },
        None => StatusCode::NOT_FOUND.into_response(),
    };
}

async fn daemon_restart_handler(
    Path(pro_id): Path<String>,
    AxumState(_server): AxumState<ServerState>,
) -> impl IntoResponse {
    let state = _server.app_handle.state::<AppState>();
    let mut pro = state.pro.write().await;
    return match pro.find_instance_mut(pro_id) {
        Some(pro_instance) => match pro_instance.daemon_mut() {
            Some(daemon) => {
                info!("Attempting to restart daemon");
                daemon.try_stop().await;
                return StatusCode::OK.into_response();
            }
            None => StatusCode::NOT_FOUND.into_response(),
        },
        None => StatusCode::NOT_FOUND.into_response(),
    };
}

async fn daemon_proxy_handler(
    Path((pro_id, path)): Path<(String, String)>,
    AxumState(_server): AxumState<ServerState>,
    mut req: Request<Body>,
) -> impl IntoResponse {
    let state = _server.app_handle.state::<AppState>();
    let pro = state.pro.read().await;
    return match pro.find_instance(pro_id) {
        Some(pro_instance) => match pro_instance.daemon() {
            Some(daemon) => {
                // strip `daemon-proxy/:pro_id` from path before we hand the request to the daemon
                let original_query = req.uri().query();
                let new_path_with_query = match original_query {
                    Some(query) => format!("/{}?{}", path, query),
                    None => format!("/{}", path),
                };
                let mut parts = req.uri().clone().into_parts();
                parts.path_and_query = Some(new_path_with_query.parse().expect("Invalid path"));
                let new_uri = http::Uri::from_parts(parts).expect("Failed to build new URI");
                *req.uri_mut() = new_uri;

                return match daemon.proxy_request(req).await {
                    Ok(res) => res.into_response(),
                    Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
                };
            }
            None => StatusCode::NOT_FOUND.into_response(),
        },
        None => StatusCode::NOT_FOUND.into_response(),
    };
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    headers: HeaderMap,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    AxumState(_server): AxumState<ServerState>,
) -> Response {
    let app_handle = _server.app_handle;
    let user_agent = if let Some(user_agent) = headers.get("user-agent") {
        user_agent.to_str().unwrap_or("Unknown browser")
    } else {
        "Unknown browser"
    };

    info!("`{user_agent}` at {addr} connected.");
    ws.on_upgrade(move |socket| handle_socket(socket, addr, app_handle))
}

async fn handle_socket(mut socket: WebSocket, who: SocketAddr, app_handle: AppHandle) {
    while let Some(msg) = socket.recv().await {
        if let Ok(msg) = msg {
            match msg {
                Message::Text(raw_text) => 'text: {
                    info!("Received message: {}", raw_text);
                    let json = serde_json::from_str::<ui_messages::SetupProMsg>(raw_text.as_str());
                    if let Err(err) = json {
                        warn!("Failed to parse json: {}", err);
                        // drop message
                        break 'text;
                    };

                    let payload = json.unwrap(); // we can safely unwrap here, checked for error earlier
                    ui_messages::send_ui_message(
                        app_handle.state::<AppState>(),
                        ui_messages::UiMessage::SetupPro(payload),
                        "failed to send pro setup message from server ws connection",
                    )
                    .await;
                }
                Message::Close(_) => {
                    info!("Client at {} disconnected.", who);
                    return;
                }
                _ => {
                    info!("Received non-text message: {:?}", msg);
                }
            }
        } else {
            info!("Client at {} disconnected.", who);

            return;
        }
    }
}


#[derive(Debug, Serialize, Deserialize)]
struct SlackAuthResponse {
    ok: bool,
    access_token: Option<String>,
    error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthStatus {
    authenticated: bool,
    provider: Option<String>,
    user_info: Option<UserInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserInfo {
    id: String,
    name: String,
    email: Option<String>,
    avatar: Option<String>,
}

async fn slack_auth_handler() -> impl IntoResponse {
    let client_id = std::env::var("SLACK_CLIENT_ID")
        .unwrap_or_else(|_| {
            warn!("SLACK_CLIENT_ID environment variable not set");
            "your_slack_client_id".to_string()
        });
    let redirect_uri = "http://localhost:25842/auth/slack/callback";
    let scope = "identity.basic,identity.email,identity.avatar";
    
    let auth_url = format!(
        "https://slack.com/oauth/v2/authorize?client_id={}&redirect_uri={}&scope={}",
        client_id, redirect_uri, scope
    );
    
    info!("Redirecting to Slack OAuth URL: {}", auth_url);
    
    Response::builder()
        .status(StatusCode::FOUND)
        .header("Location", auth_url)
        .body(Body::empty())
        .unwrap()
}

async fn slack_auth_callback_handler(
    Query(params): Query<HashMap<String, String>>,
    AxumState(_server): AxumState<ServerState>,
) -> impl IntoResponse {
    let code = match params.get("code") {
        Some(code) => code,
        None => {
            error!("No authorization code provided in Slack callback");
            return Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from("No authorization code provided"))
                .unwrap();
        }
    };
    
    info!("Received Slack authorization code: {}", code);
    
    let client_id = std::env::var("SLACK_CLIENT_ID")
        .unwrap_or_else(|_| {
            warn!("SLACK_CLIENT_ID environment variable not set");
            "your_slack_client_id".to_string()
        });
    let client_secret = std::env::var("SLACK_CLIENT_SECRET")
        .unwrap_or_else(|_| {
            warn!("SLACK_CLIENT_SECRET environment variable not set");
            "your_slack_client_secret".to_string()
        });
    let redirect_uri = "http://localhost:25842/auth/slack/callback";
    
    let token_request_url = format!(
        "https://slack.com/api/oauth.v2.access?code={}&client_id={}&client_secret={}&redirect_uri={}",
        code, client_id, client_secret, redirect_uri
    );
    
    let client = reqwest::Client::new();
    let response = match client.post(&token_request_url).send().await {
        Ok(resp) => resp,
        Err(e) => {
            error!("Failed to exchange code for token: {}", e);
            return Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .body(Body::from("Failed to exchange code for access token"))
                .unwrap();
        }
    };
    
    let slack_response: SlackAuthResponse = match response.json().await {
        Ok(json) => json,
        Err(e) => {
            error!("Failed to parse Slack response: {}", e);
            return Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .body(Body::from("Failed to parse Slack response"))
                .unwrap();
        }
    };
    
    if !slack_response.ok {
        error!("Slack error: {:?}", slack_response.error);
        return Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .body(Body::from(format!("Slack error: {:?}", slack_response.error)))
            .unwrap();
    }
    
    let access_token = match &slack_response.access_token {
        Some(token) => token,
        None => {
            error!("No access token in Slack response");
            return Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .body(Body::from("No access token in Slack response"))
                .unwrap();
        }
    };
    
    match get_slack_user_info(access_token).await {
        Ok(user_info) => {
            info!("Retrieved user info for: {}", user_info.name);
            
            // let state = _server.app_handle.state::<AppState>();
        },
        Err(e) => {
            error!("Failed to get user info: {}", e);
        }
    }
    
    Response::builder()
        .status(StatusCode::FOUND)
        .header("Location", "/#/auth-success")
        .body(Body::empty())
        .unwrap()
}

async fn get_slack_user_info(access_token: &str) -> Result<UserInfo, anyhow::Error> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://slack.com/api/users.identity")
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await?;
    
    let json = response.json::<serde_json::Value>().await?;
    
    if let Some(user) = json.get("user") {
        let id = user.get("id").and_then(|v| v.as_str()).unwrap_or("").to_string();
        let name = user.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string();
        let email = user.get("email").and_then(|v| v.as_str()).map(|s| s.to_string());
        let avatar = user.get("image_192").and_then(|v| v.as_str()).map(|s| s.to_string());
        
        return Ok(UserInfo {
            id,
            name,
            email,
            avatar,
        });
    }
    
    Err(anyhow::anyhow!("Could not parse user info from Slack response"))
}

async fn auth_status_handler(
    AxumState(_server): AxumState<ServerState>,
) -> impl IntoResponse {
    let _state = _server.app_handle.state::<AppState>();
    
    let status = AuthStatus {
        authenticated: true,
        provider: Some("slack".to_string()),
        user_info: Some(UserInfo {
            id: "U12345678".to_string(),
            name: "Test User".to_string(),
            email: Some("test@example.com".to_string()),
            avatar: Some("https://secure.gravatar.com/avatar/test".to_string()),
        }),
    };
    
    info!("Auth status requested, returning mock data");
    Json(status)
}


#[derive(Debug, Serialize, Deserialize)]
struct GenerateApiKeyRequest {
    name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiKeyResponse {
    id: String,
    name: String,
    key: String,
    created_at: u64,
    user_id: String,
    user_email: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ApiKeyListResponse {
    keys: Vec<ApiKeyResponse>,
}

async fn generate_api_key_handler(
    AxumState(_server): AxumState<ServerState>,
    Json(payload): Json<GenerateApiKeyRequest>,
) -> impl IntoResponse {
    let _state = _server.app_handle.state::<AppState>();
    
    let user_id = "U12345678".to_string();
    let user_email = "test@example.com".to_string();
    let _workspace_id = "W12345678".to_string();
    
    let api_key = format!("kled_{}", uuid::Uuid::new_v4().to_string().replace("-", ""));
    let id = uuid::Uuid::new_v4().to_string();
    
    
    info!("Generated API key: {} for user: {}", payload.name, user_id);
    
    let api_key_response = ApiKeyResponse {
        id,
        name: payload.name,
        key: api_key,
        created_at: std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs(),
        user_id,
        user_email,
    };
    
    Json(api_key_response)
}

async fn list_api_keys_handler(
    AxumState(_server): AxumState<ServerState>,
) -> impl IntoResponse {
    
    let keys = vec![
        ApiKeyResponse {
            id: uuid::Uuid::new_v4().to_string(),
            name: "Test API Key".to_string(),
            key: "kled_12345678901234567890".to_string(),
            created_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            user_id: "U12345678".to_string(),
            user_email: "test@example.com".to_string(),
        }
    ];
    
    Json(ApiKeyListResponse { keys })
}

async fn delete_api_key_handler(
    Path(id): Path<String>,
    AxumState(_server): AxumState<ServerState>,
) -> impl IntoResponse {
    
    info!("Deleted API key: {}", id);
    
    StatusCode::OK
}

#[derive(Debug, Serialize, Deserialize)]
struct SpacetimeStatus {
    running: bool,
    version: String,
    connected_users: u32,
}

async fn spacetime_status_handler(
    AxumState(_server): AxumState<ServerState>,
) -> impl IntoResponse {
    let spacetime_running = match spacetime_server::setup(&_server.app_handle).await {
        Ok(_) => true,
        Err(_) => false,
    };
    
    let status = SpacetimeStatus {
        running: spacetime_running,
        version: "0.1.0".to_string(),
        connected_users: 0,
    };
    
    Json(status)
}
