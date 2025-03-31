use anyhow::Result;
use spacetimedb::*;
use tracing::info;

#[spacetimedb(table)]
#[derive(Clone)]
pub struct ApiKey {
    #[primarykey]
    pub id: String,
    pub name: String,
    pub key: String,
    pub created_at: u64,
    pub user_id: String,       // Slack user ID
    pub user_email: String,    // Slack user email
    pub workspace_id: String,  // Slack workspace ID
    pub last_used: u64,        // Timestamp of last usage
    pub usage_count: u64,      // Number of times the key has been used
}

#[spacetimedb(table)]
#[derive(Clone)]
pub struct ApiKeyUsage {
    #[primarykey]
    pub id: String,
    pub api_key_id: String,      // Reference to the API key
    pub timestamp: u64,          // When the key was used
    pub endpoint: String,        // Which endpoint was accessed
    pub ip_address: String,      // IP address of the request
    pub user_agent: String,      // User agent of the request
    pub status_code: u16,        // Response status code
}

#[spacetimedb(reducer)]
pub fn add_api_key(
    _ctx: ReducerContext, 
    name: String, 
    key: String,
    user_id: String,
    user_email: String,
    workspace_id: String
) -> Result<()> {
    let id = uuid::Uuid::new_v4().to_string();
    let created_at = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let name_clone = name.clone();
    
    let user_id_clone = user_id.clone();
    
    ApiKey::insert(ApiKey {
        id,
        name,
        key,
        created_at,
        user_id,
        user_email,
        workspace_id,
        last_used: created_at,
        usage_count: 0,
    })?;
    
    info!("Added new API key: {} for user: {}", name_clone, user_id_clone);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn delete_api_key(_ctx: ReducerContext, id: String) -> Result<()> {
    let deleted = ApiKey::delete_by_id(&id);
    info!("Deleted API key: {} (success: {})", id, deleted);
    Ok(())
}

#[spacetimedb(reducer)]
pub fn record_api_key_usage(
    _ctx: ReducerContext, 
    api_key_id: String,
    endpoint: String,
    ip_address: String,
    user_agent: String,
    status_code: u16
) -> Result<()> {
    let id = uuid::Uuid::new_v4().to_string();
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    ApiKeyUsage::insert(ApiKeyUsage {
        id,
        api_key_id: api_key_id.clone(),
        timestamp,
        endpoint,
        ip_address,
        user_agent,
        status_code,
    })?;
    
    if let Some(mut key) = ApiKey::filter_by_id(&api_key_id) {
        let id_clone = key.id.clone();
        key.last_used = timestamp;
        key.usage_count += 1;
        let _ = ApiKey::update_by_id(&id_clone, key);
    }
    
    Ok(())
}

fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    info!("SpacetimeDB server for Kled desktop application started");
    
    Ok(())
}
