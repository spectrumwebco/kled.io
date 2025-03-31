use spacetimedb::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[spacetimedb(table)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ApiKey {
    #[primarykey]
    pub id: String,
    pub key: String,
    pub user_id: String,
    pub created_at: u64,
    pub last_used: u64,
}

#[spacetimedb(table)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct User {
    #[primarykey]
    pub id: String,
    pub name: String,
    pub email: String,
    pub slack_id: Option<String>,
    pub created_at: u64,
}

#[spacetimedb(table)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Setting {
    #[primarykey]
    pub key: String,
    pub value: String,
}

#[spacetimedb(reducer)]
pub fn create_api_key(_ctx: ReducerContext, user_id: String) -> Result<(), String> {
    let api_key = Uuid::new_v4().to_string();
    let id = Uuid::new_v4().to_string();
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let new_key = ApiKey {
        id,
        key: api_key,
        user_id,
        created_at: now,
        last_used: now,
    };
    
    if let Err(e) = ApiKey::insert(new_key) {
        return Err(format!("Failed to insert API key: {}", e));
    }
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn validate_api_key(_ctx: ReducerContext, key: String) -> Result<(), String> {
    let api_keys: Vec<ApiKey> = ApiKey::iter()
        .filter(|k| k.key == key)
        .collect();
    
    if api_keys.is_empty() {
        return Err("Invalid API key".to_string());
    }
    
    let api_key = &api_keys[0];
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let mut updated_key = api_key.clone();
    updated_key.last_used = now;
    let id_clone = updated_key.id.clone();
    
    let _ = ApiKey::update_by_id(&id_clone, updated_key);
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn create_user(
    _ctx: ReducerContext,
    name: String,
    email: String,
    slack_id: Option<String>,
) -> Result<(), String> {
    let id = Uuid::new_v4().to_string();
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let new_user = User {
        id,
        name,
        email,
        slack_id,
        created_at: now,
    };
    
    if let Err(e) = User::insert(new_user) {
        return Err(format!("Failed to insert user: {}", e));
    }
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn get_user_by_email(_ctx: ReducerContext, email: String) -> Result<(), String> {
    let users: Vec<User> = User::iter()
        .filter(|user| user.email == email)
        .collect();
    
    if users.is_empty() {
        log::info!("No user found with email: {}", email);
    } else {
        log::info!("Found user: {:?}", users[0]);
    }
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn save_setting(_ctx: ReducerContext, key: String, value: String) -> Result<(), String> {
    let settings: Vec<Setting> = Setting::iter()
        .filter(|s| s.key == key)
        .collect();
    
    if settings.is_empty() {
        let new_setting = Setting { key, value };
        if let Err(e) = Setting::insert(new_setting) {
            return Err(format!("Failed to insert setting: {}", e));
        }
    } else {
        let mut setting = settings[0].clone();
        setting.value = value;
        let key_clone = setting.key.clone();
        let _ = Setting::update_by_key(&key_clone, setting);
    }
    
    Ok(())
}

#[spacetimedb(reducer)]
pub fn get_setting(_ctx: ReducerContext, key: String) -> Result<(), String> {
    let settings: Vec<Setting> = Setting::iter()
        .filter(|s| s.key == key)
        .collect();
    
    if settings.is_empty() {
        log::info!("No setting found with key: {}", key);
    } else {
        log::info!("Found setting: {} = {}", key, settings[0].value);
    }
    
    Ok(())
}
