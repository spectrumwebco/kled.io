# Kled.io

Kled.io is an open-source platform for managing Kubernetes workspaces, clusters, and policies. It provides a unified interface for developers and DevOps teams to manage their infrastructure.

## Components

- **Desktop App**: Cross-platform desktop application for managing Kubernetes workspaces
- **Web App**: Browser-based interface with the same functionality as the desktop app
- **Mobile Apps**: iOS and Android applications for on-the-go management
- **CLI Tools**:
  - `kled`: Main CLI tool for workspace management
  - `kcluster`: CLI tool for cluster management
  - `kledspace`: CLI tool for workspace management
  - `kpolicy`: CLI tool for policy management

## Getting Started

### Desktop App

```bash
cd desktop
yarn install
yarn build
cd src-tauri
cargo build --release
```

### CLI Tools

```bash
cd cli/kled
go build
```

## Documentation

For detailed documentation, visit [https://docs.kled.io](https://docs.kled.io)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
