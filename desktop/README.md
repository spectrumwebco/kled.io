# Kled.io Desktop App

This directory contains the desktop application for Kled.io, built using React and Tauri.

## Getting Started

### Prerequisites

- Node.js 16 or later
- Rust 1.60 or later
- Yarn

### Installation

1. Install dependencies:

```bash
yarn install
```

2. Run the app in development mode:

```bash
yarn tauri dev
```

## Building for Production

```bash
yarn build
cd src-tauri
cargo build --release
```

This will create binaries for your current platform in the `src-tauri/target/release` directory.

## Features

- Workspace management
- Cluster management
- Policy management
- Real-time monitoring
- System tray integration
- Automatic updates
