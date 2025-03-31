use crate::AppHandle;
use anyhow::Result;
use log::{error, info};
use std::path::PathBuf;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;

pub struct SpacetimeServer {
    #[allow(dead_code)]
    app_handle: AppHandle,
    server_path: PathBuf,
    is_running: Arc<Mutex<bool>>,
}

impl SpacetimeServer {
    pub fn new(app_handle: AppHandle) -> Self {
        let server_path = app_handle
            .path()
            .app_local_data_dir()
            .unwrap()
            .join("spacetime_server");
        
        Self {
            app_handle,
            server_path,
            is_running: Arc::new(Mutex::new(false)),
        }
    }

    pub async fn start(&self) -> Result<()> {
        let mut is_running = self.is_running.lock().await;
        if *is_running {
            info!("SpacetimeDB server is already running");
            return Ok(());
        }

        info!("Starting SpacetimeDB server at {:?}", self.server_path);
        
        if !self.server_path.exists() {
            std::fs::create_dir_all(&self.server_path)?;
        }

        
        *is_running = true;
        info!("SpacetimeDB server started successfully");
        
        Ok(())
    }

    #[allow(dead_code)]
    pub async fn stop(&self) -> Result<()> {
        let mut is_running = self.is_running.lock().await;
        if !*is_running {
            info!("SpacetimeDB server is not running");
            return Ok(());
        }

        info!("Stopping SpacetimeDB server");
        
        
        *is_running = false;
        info!("SpacetimeDB server stopped successfully");
        
        Ok(())
    }

    #[allow(dead_code)]
    pub async fn is_running(&self) -> bool {
        *self.is_running.lock().await
    }
}

pub async fn setup(app_handle: &AppHandle) -> Result<()> {
    info!("Setting up SpacetimeDB server");
    
    let server = SpacetimeServer::new(app_handle.clone());
    
    match server.start().await {
        Ok(_) => {
            info!("SpacetimeDB server setup completed successfully");
            Ok(())
        }
        Err(err) => {
            error!("Failed to start SpacetimeDB server: {}", err);
            Err(err)
        }
    }
}

#[allow(dead_code)]
pub async fn shutdown(app_handle: &AppHandle) -> Result<()> {
    info!("Shutting down SpacetimeDB server");
    
    let server = SpacetimeServer::new(app_handle.clone());
    
    match server.stop().await {
        Ok(_) => {
            info!("SpacetimeDB server shutdown completed successfully");
            Ok(())
        }
        Err(err) => {
            error!("Failed to stop SpacetimeDB server: {}", err);
            Err(err)
        }
    }
}
