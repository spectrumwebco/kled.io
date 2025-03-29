# Kled.io Monorepo Architecture

## Overview

The Kled.io monorepo is structured to support a unified development environment for multiple related projects while maintaining separation of concerns. This document outlines the high-level architecture of the monorepo, the relationships between its components, and the build system flow.

## Monorepo Structure

```mermaid
graph TD
    subgraph monorepo["/repos/monorepo"]
        turbo[Turborepo Configuration]
        pnpm[pnpm-workspace.yaml]
        
        subgraph apps["apps/ directory"]
            kled[kled - Core CLI & Desktop]
            kledpro[kled-pro - Enterprise Features]
            kledio[kled.io - Public Repository]
            cisco[cisco-meraki - Network Integration]
        end
        
        subgraph packages["packages/ directory"]
            shared[Shared Components]
            ui[UI Library]
            config[Configuration]
        end
        
        subgraph mcp["mcp-servers/ directory"]
            mcpservers[MCP Server Components]
        end
    end
    
    turbo --> apps
    turbo --> packages
    pnpm --> apps
    pnpm --> packages
```

### Key Components

1. **apps/** - Contains the main application repositories:
   - **kled/** - Core CLI and desktop application (private repository)
   - **kled-pro/** - Enterprise features and extensions (private repository)
   - **kled.io/** - Public-facing repository for distribution
   - **cisco-meraki/** - Network integration components

2. **packages/** - Contains shared libraries and components:
   - Shared UI components
   - Configuration utilities
   - Common types and interfaces

3. **mcp-servers/** - Contains server components placed at the monorepo root

## Repository Relationships

```mermaid
graph TD
    subgraph Public["Public Repository"]
        kledio[kled.io]
    end
    
    subgraph Private["Private Repositories"]
        kled[kled]
        kledpro[kled-pro]
    end
    
    kled -->|CLI Implementation| kledio
    kled -->|Desktop App Source| kledio
    kledpro -->|kcluster Implementation| kledio
    kledpro -->|Enterprise Features| kled
    kledio -->|Distribution| users[End Users]
    
    kled -->|Imports API| kledpro
```

### Integration Points

1. **CLI Commands**:
   - `kled` commands implemented in the private kled repository
   - `kcluster` commands implemented in the private kled-pro repository
   - Unified CLI distributed through the public kled.io repository

2. **API Integration**:
   - kled-pro/platform provides API implementation
   - kled imports API from kled-pro/platform instead of github.com/loft-sh/api/v4

3. **Desktop Application**:
   - Source code in private kled repository
   - Built applications distributed through public kled.io repository

## Build System Flow

```mermaid
flowchart TD
    subgraph Turborepo["Turborepo Build System"]
        direction LR
        turbo[turbo.json] --> pipeline[Build Pipeline]
        pipeline --> tasks[Task Dependencies]
    end
    
    subgraph BuildProcess["Build Process"]
        direction TB
        deps[Install Dependencies] --> build[Build Packages]
        build --> test[Run Tests]
        test --> bundle[Bundle Applications]
    end
    
    subgraph Artifacts["Build Artifacts"]
        cli[CLI Binaries]
        desktop[Desktop Applications]
        mobile[Mobile Applications]
        web[Web Application]
    end
    
    Turborepo --> BuildProcess
    BuildProcess --> Artifacts
```

### Build Order

1. Install dependencies (yarn install)
2. Build shared packages
3. Build applications in dependency order:
   - SpacetimeDB server component first
   - Then desktop application components
   - CLI components
   - Web and mobile components

## C4 Model: Context Level

```mermaid
C4Context
    title System Context diagram for Kled.io

    Person(user, "End User", "A user of the Kled.io platform")
    
    System(kledSystem, "Kled.io System", "Provides workspace management capabilities")
    
    System_Ext(kubernetes, "Kubernetes", "Container orchestration platform")
    System_Ext(cloud, "Cloud Providers", "Infrastructure providers (AWS, GCP, Azure)")
    System_Ext(slack, "Slack", "Authentication and communication")
    
    Rel(user, kledSystem, "Uses")
    Rel(kledSystem, kubernetes, "Manages workspaces on")
    Rel(kledSystem, cloud, "Provisions resources on")
    Rel(kledSystem, slack, "Authenticates through")
```

## C4 Model: Container Level

```mermaid
C4Container
    title Container diagram for Kled.io System

    Person(user, "End User", "A user of the Kled.io platform")
    
    System_Boundary(kledSystem, "Kled.io System") {
        Container(cli, "CLI Tools", "Go", "Command-line interface for workspace management")
        Container(desktop, "Desktop App", "Tauri/React", "Desktop application for workspace management")
        Container(mobile, "Mobile App", "React Native", "Mobile application for workspace management")
        Container(web, "Web App", "React", "Web interface for workspace management")
        Container(api, "API", "Go", "Backend API for workspace management")
        Container(spacetime, "SpacetimeDB", "Rust", "State management database")
        Container(supabase, "Supabase", "PostgreSQL", "User authentication and API key storage")
    }
    
    System_Ext(kubernetes, "Kubernetes", "Container orchestration platform")
    System_Ext(cloud, "Cloud Providers", "Infrastructure providers")
    System_Ext(slack, "Slack", "Authentication and communication")
    
    Rel(user, cli, "Uses")
    Rel(user, desktop, "Uses")
    Rel(user, mobile, "Uses")
    Rel(user, web, "Uses")
    
    Rel(cli, api, "Makes API calls to")
    Rel(desktop, api, "Makes API calls to")
    Rel(mobile, api, "Makes API calls to")
    Rel(web, api, "Makes API calls to")
    
    Rel(api, spacetime, "Stores state in")
    Rel(api, supabase, "Authenticates users with")
    Rel(api, kubernetes, "Manages workspaces on")
    Rel(api, cloud, "Provisions resources on")
    Rel(api, slack, "Integrates with")
```

## Conclusion

The Kled.io monorepo architecture is designed to support a multi-platform application ecosystem with shared components and a unified build system. The separation between public and private repositories allows for open-source distribution while protecting proprietary code.
