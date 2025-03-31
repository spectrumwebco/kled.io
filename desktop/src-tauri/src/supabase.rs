use anyhow::{anyhow, Result};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use std::env;
use log::{error, info};

const SUPABASE_URL_ENV: &str = "SUPABASE_URL";
const SUPABASE_KEY_ENV: &str = "SUPABASE_KEY";

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiKey {
    pub id: String,
    pub name: String,
    pub key: String,
    pub created_at: u64,
    pub user_id: String,
    pub user_email: String,
    pub workspace_id: String,
    pub last_used: u64,
    pub usage_count: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiKeyUsage {
    pub id: String,
    pub api_key_id: String,
    pub timestamp: u64,
    pub endpoint: String,
    pub ip_address: String,
    pub user_agent: String,
    pub status_code: u16,
}

pub async fn sync_api_key(api_key: ApiKey) -> Result<()> {
    let supabase_url = env::var(SUPABASE_URL_ENV)
        .map_err(|_| anyhow!("SUPABASE_URL environment variable not set"))?;
    let supabase_key = env::var(SUPABASE_KEY_ENV)
        .map_err(|_| anyhow!("SUPABASE_KEY environment variable not set"))?;
    
    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", supabase_key))?,
    );
    
    let endpoint = format!("{}/rest/v1/api_keys", supabase_url);
    info!("Syncing API key {} to Supabase", api_key.id);
    
    let response = client
        .post(&endpoint)
        .headers(headers)
        .json(&api_key)
        .send()
        .await?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        error!("Failed to sync API key with Supabase: {} - {}", response.status(), error_text);
        return Err(anyhow!(
            "Failed to sync API key with Supabase: {} - {}",
            response.status(),
            error_text
        ));
    }
    
    info!("Successfully synced API key {} to Supabase", api_key.id);
    Ok(())
}

pub async fn sync_api_key_usage(usage: ApiKeyUsage) -> Result<()> {
    let supabase_url = env::var(SUPABASE_URL_ENV)
        .map_err(|_| anyhow!("SUPABASE_URL environment variable not set"))?;
    let supabase_key = env::var(SUPABASE_KEY_ENV)
        .map_err(|_| anyhow!("SUPABASE_KEY environment variable not set"))?;
    
    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", supabase_key))?,
    );
    
    let endpoint = format!("{}/rest/v1/api_key_usage", supabase_url);
    info!("Syncing API key usage record {} to Supabase", usage.id);
    
    let response = client
        .post(&endpoint)
        .headers(headers)
        .json(&usage)
        .send()
        .await?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        error!("Failed to sync API key usage with Supabase: {} - {}", response.status(), error_text);
        return Err(anyhow!(
            "Failed to sync API key usage with Supabase: {} - {}",
            response.status(),
            error_text
        ));
    }
    
    info!("Successfully synced API key usage record {} to Supabase", usage.id);
    Ok(())
}

pub async fn get_api_keys_for_user(user_id: &str) -> Result<Vec<ApiKey>> {
    let supabase_url = env::var(SUPABASE_URL_ENV)
        .map_err(|_| anyhow!("SUPABASE_URL environment variable not set"))?;
    let supabase_key = env::var(SUPABASE_KEY_ENV)
        .map_err(|_| anyhow!("SUPABASE_KEY environment variable not set"))?;
    
    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", supabase_key))?,
    );
    
    let endpoint = format!("{}/rest/v1/api_keys?user_id=eq.{}", supabase_url, user_id);
    info!("Fetching API keys for user {}", user_id);
    
    let response = client
        .get(&endpoint)
        .headers(headers)
        .send()
        .await?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        error!("Failed to fetch API keys from Supabase: {} - {}", response.status(), error_text);
        return Err(anyhow!(
            "Failed to fetch API keys from Supabase: {} - {}",
            response.status(),
            error_text
        ));
    }
    
    let api_keys: Vec<ApiKey> = response.json().await?;
    info!("Successfully fetched {} API keys for user {}", api_keys.len(), user_id);
    
    Ok(api_keys)
}

pub async fn delete_api_key(key_id: &str) -> Result<()> {
    let supabase_url = env::var(SUPABASE_URL_ENV)
        .map_err(|_| anyhow!("SUPABASE_URL environment variable not set"))?;
    let supabase_key = env::var(SUPABASE_KEY_ENV)
        .map_err(|_| anyhow!("SUPABASE_KEY environment variable not set"))?;
    
    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", supabase_key))?,
    );
    
    let endpoint = format!("{}/rest/v1/api_keys?id=eq.{}", supabase_url, key_id);
    info!("Deleting API key {} from Supabase", key_id);
    
    let response = client
        .delete(&endpoint)
        .headers(headers)
        .send()
        .await?;
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        error!("Failed to delete API key from Supabase: {} - {}", response.status(), error_text);
        return Err(anyhow!(
            "Failed to delete API key from Supabase: {} - {}",
            response.status(),
            error_text
        ));
    }
    
    info!("Successfully deleted API key {} from Supabase", key_id);
    Ok(())
}
