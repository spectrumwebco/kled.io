# Desktop and Mobile Application Architecture

## Overview

The Kled.io desktop and mobile application architecture describes the structure and components of the multi-platform applications. This document outlines the frontend and backend components, state management, and cross-platform integration.

## Platform Architecture

```mermaid
graph TD
    subgraph Platforms["Supported Platforms"]
        desktop[Desktop Applications]
        web[Web Application]
        mobile[Mobile Applications]
    end
    
    subgraph DesktopPlatforms["Desktop Platforms"]
        windows[Windows]
        macos[macOS]
        linux[Linux]
    end
    
    subgraph MobilePlatforms["Mobile Platforms"]
        ios[iOS]
        android[Android]
    end
    
    subgraph Technologies["Core Technologies"]
        tauri[Tauri v2]
        react[React]
        lynx[Lynx Family]
        spacetime[SpacetimeDB]
    end
    
    desktop --> windows
    desktop --> macos
    desktop --> linux
    mobile --> ios
    mobile --> android
    
    windows --> tauri
    macos --> tauri
    linux --> tauri
    ios --> lynx
    android --> lynx
    web --> react
    
    tauri --> react
    lynx --> react
    
    tauri --> spacetime
    lynx --> spacetime
    react --> spacetime
```

## Frontend Architecture

```mermaid
graph TD
    subgraph Frontend["Frontend Components"]
        ui[UI Components]
        state[State Management]
        routing[Routing]
        auth[Authentication]
    end
    
    subgraph UIComponents["UI Components"]
        chakra[Chakra UI]
        framer[Framer Motion]
        custom[Custom Components]
    end
    
    subgraph StateManagement["State Management"]
        context[React Context]
        hooks[Custom Hooks]
        spacetimeClient[SpacetimeDB Client]
    end
    
    ui --> chakra
    ui --> framer
    ui --> custom
    
    state --> context
    state --> hooks
    state --> spacetimeClient
    
    routing --> state
    auth --> state
```

## Backend Architecture

```mermaid
graph TD
    subgraph Backend["Backend Components"]
        spacetimeDB[SpacetimeDB]
        supabase[Supabase]
        api[API Layer]
        slack[Slack Integration]
    end
    
    subgraph SpacetimeDB["SpacetimeDB"]
        spacetimeServer[SpacetimeDB Server]
        spacetimeModels[Data Models]
        spacetimeQueries[Queries]
    end
    
    subgraph Supabase["Supabase"]
        auth[Authentication]
        storage[Storage]
        database[PostgreSQL]
    end
    
    subgraph API["API Layer"]
        rest[REST API]
        graphql[GraphQL API]
        websocket[WebSocket]
    end
    
    Backend --> Frontend
    
    spacetimeDB --> spacetimeServer
    spacetimeDB --> spacetimeModels
    spacetimeDB --> spacetimeQueries
    
    supabase --> auth
    supabase --> storage
    supabase --> database
    
    api --> rest
    api --> graphql
    api --> websocket
    
    spacetimeDB --> api
    supabase --> api
    slack --> api
```

## Tauri v2 Architecture

```mermaid
graph TD
    subgraph TauriV2["Tauri v2 Architecture"]
        core[Tauri Core]
        plugins[Plugins]
        ipc[IPC Bridge]
        webview[WebView]
    end
    
    subgraph Rust["Rust Components"]
        spacetimeServer[SpacetimeDB Server]
        daemon[Daemon Process]
        updater[Auto Updater]
        resourceWatcher[Resource Watcher]
    end
    
    subgraph JavaScript["JavaScript Components"]
        reactApp[React Application]
        apiClient[API Client]
        uiComponents[UI Components]
    end
    
    TauriV2 --> Rust
    TauriV2 --> JavaScript
    
    core --> plugins
    core --> ipc
    core --> webview
    
    plugins --> spacetimeServer
    plugins --> daemon
    plugins --> updater
    plugins --> resourceWatcher
    
    ipc --> reactApp
    webview --> reactApp
    
    reactApp --> apiClient
    reactApp --> uiComponents
```

## Lynx Family Architecture for Mobile

```mermaid
graph TD
    subgraph LynxFamily["Lynx Family Architecture"]
        lynxCore[Lynx Core]
        lynxComponents[Lynx Components]
        lynxPlatforms[Platform Adapters]
    end
    
    subgraph ReactNative["React Native"]
        rnComponents[React Native Components]
        rnNavigation[React Navigation]
        rnGestureHandler[Gesture Handler]
    end
    
    subgraph NativeModules["Native Modules"]
        iosModules[iOS Modules]
        androidModules[Android Modules]
    end
    
    LynxFamily --> ReactNative
    LynxFamily --> NativeModules
    
    lynxCore --> lynxComponents
    lynxCore --> lynxPlatforms
    
    lynxComponents --> rnComponents
    lynxPlatforms --> iosModules
    lynxPlatforms --> androidModules
    
    rnComponents --> rnNavigation
    rnComponents --> rnGestureHandler
```

## C4 Model: Container Level

```mermaid
C4Container
    title Container diagram for Kled.io Desktop/Mobile Applications

    Person(user, "End User", "A user of the Kled.io platform")
    
    System_Boundary(kledSystem, "Kled.io System") {
        Container(desktop, "Desktop App", "Tauri/React", "Desktop application for workspace management")
        Container(mobile, "Mobile App", "Lynx/React", "Mobile application for workspace management")
        Container(web, "Web App", "React", "Web interface for workspace management")
        Container(api, "API", "Go", "Backend API for workspace management")
        Container(spacetime, "SpacetimeDB", "Rust", "State management database")
        Container(supabase, "Supabase", "PostgreSQL", "User authentication and API key storage")
    }
    
    System_Ext(kubernetes, "Kubernetes", "Container orchestration platform")
    System_Ext(slack, "Slack", "Authentication and communication")
    
    Rel(user, desktop, "Uses")
    Rel(user, mobile, "Uses")
    Rel(user, web, "Uses")
    
    Rel(desktop, api, "Makes API calls to")
    Rel(desktop, spacetime, "Stores state in")
    Rel(mobile, api, "Makes API calls to")
    Rel(mobile, spacetime, "Stores state in")
    Rel(web, api, "Makes API calls to")
    
    Rel(api, kubernetes, "Manages workspaces on")
    Rel(api, supabase, "Authenticates users with")
    Rel(api, slack, "Integrates with")
```

## C4 Model: Component Level for Desktop App

```mermaid
C4Component
    title Component diagram for Kled.io Desktop Application

    Container_Boundary(desktop, "Desktop Application") {
        Component(ui, "UI Layer", "React/Chakra UI", "User interface components")
        Component(state, "State Management", "React Context/Hooks", "Application state management")
        Component(tauri, "Tauri Core", "Rust", "Native desktop integration")
        Component(spacetime_client, "SpacetimeDB Client", "TypeScript", "Client for SpacetimeDB")
        Component(spacetime_server, "SpacetimeDB Server", "Rust", "Local SpacetimeDB server")
        Component(api_client, "API Client", "TypeScript", "Client for backend API")
        Component(updater, "Auto Updater", "Rust", "Handles application updates")
        Component(daemon, "Daemon Process", "Rust", "Background process manager")
    }
    
    Container(api, "Backend API", "Go", "Backend API for workspace management")
    Container(supabase, "Supabase", "PostgreSQL", "User authentication and API key storage")
    
    Rel(ui, state, "Uses")
    Rel(ui, tauri, "Interacts with")
    Rel(state, spacetime_client, "Uses")
    Rel(state, api_client, "Uses")
    Rel(tauri, spacetime_server, "Manages")
    Rel(tauri, updater, "Uses")
    Rel(tauri, daemon, "Controls")
    Rel(spacetime_client, spacetime_server, "Connects to")
    Rel(api_client, api, "Makes API calls to")
    Rel(api, supabase, "Authenticates with")
```

## Implementation Details

### Desktop Application (Tauri v2)

The desktop application is built using Tauri v2, which provides a lightweight framework for building desktop applications with web technologies. The application consists of:

1. **Frontend**: React application with Chakra UI components
2. **Backend**: Rust-based Tauri application with SpacetimeDB server

```rust
// Main Tauri application entry point
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_updater::init())
        .setup(|app| {
            // Initialize SpacetimeDB server
            let spacetime_server = SpacetimeServer::new(app.handle().clone());
            app.manage(spacetime_server);
            
            // Start daemon process
            let daemon = Daemon::new(app.handle().clone());
            app.manage(daemon);
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Mobile Application (Lynx Family)

The mobile application is built using the Lynx Family framework, which provides a cross-platform solution for building mobile applications with React:

```javascript
// Mobile application entry point
import { LynxApp } from '@lynx/core';
import { ThemeProvider } from '@chakra-ui/react';
import { SpacetimeProvider } from './spacetime';
import { ApiProvider } from './api';
import App from './App';

export default function Main() {
  return (
    <LynxApp>
      <ThemeProvider>
        <SpacetimeProvider>
          <ApiProvider>
            <App />
          </ApiProvider>
        </SpacetimeProvider>
      </ThemeProvider>
    </LynxApp>
  );
}
```

### SpacetimeDB Integration

SpacetimeDB is used for state management across all platforms:

```typescript
// SpacetimeDB client integration
import { SpacetimeDBClient } from '@spacetimedb/client';

export function useSpacetime() {
  const [client, setClient] = useState<SpacetimeDBClient | null>(null);
  
  useEffect(() => {
    const initSpacetime = async () => {
      const client = new SpacetimeDBClient({
        uri: 'http://localhost:3000',
        authToken: localStorage.getItem('authToken'),
      });
      
      await client.connect();
      setClient(client);
    };
    
    initSpacetime();
    
    return () => {
      client?.disconnect();
    };
  }, []);
  
  return client;
}
```

## Conclusion

The desktop and mobile application architecture provides a unified approach to building cross-platform applications while leveraging platform-specific capabilities. The use of SpacetimeDB for state management ensures consistency across all platforms, while the integration with Supabase provides robust authentication and storage capabilities.
