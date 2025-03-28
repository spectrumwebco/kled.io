#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Runtime};
use tauri::AppHandle;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Default)]
struct AppState {
    workspaces: Arc<Mutex<Vec<String>>>,
}

fn main() {
    env_logger::init();
    
    tauri::Builder::default()
        .manage(AppState::default())
        .setup(|app| {
            let app_handle = app.handle();
            
            setup_system_tray(&app_handle);
            
            initialize_workspaces(app.state::<AppState>());
            
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_updater::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_system_tray<R: Runtime>(app_handle: &AppHandle<R>) {
    log::info!("Setting up system tray");
}

async fn initialize_workspaces(state: tauri::State<'_, AppState>) {
    let mut workspaces = state.workspaces.lock().await;
    
    workspaces.push("default".to_string());
    workspaces.push("development".to_string());
    workspaces.push("production".to_string());
    
    log::info!("Initialized {} workspaces", workspaces.len());
}

#[tauri::command]
async fn get_workspaces(state: tauri::State<'_, AppState>) -> Result<Vec<String>, String> {
    let workspaces = state.workspaces.lock().await;
    Ok(workspaces.clone())
}

#[tauri::command]
async fn create_workspace(name: String, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut workspaces = state.workspaces.lock().await;
    
    if workspaces.contains(&name) {
        return Err("Workspace already exists".to_string());
    }
    
    workspaces.push(name.clone());
    log::info!("Created workspace: {}", name);
    
    Ok(())
}
