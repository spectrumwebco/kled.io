# Kled.io CLI Tools

This directory contains the command-line tools for Kled.io:

- `kled`: Main CLI tool for workspace management
- `kcluster`: CLI tool for cluster management
- `kledspace`: CLI tool for workspace management
- `kpolicy`: CLI tool for policy management

## Building the CLI Tools

### Prerequisites

- Go 1.18 or later

### Building

```bash
# Build all CLI tools
make build

# Build individual tools
cd kled
go build
```

## Usage

### kled

```bash
kled workspace list
kled workspace create my-workspace
kled workspace delete my-workspace
```

### kcluster

```bash
kcluster list
kcluster create my-cluster
kcluster delete my-cluster
```

### kledspace

```bash
kledspace list
kledspace create my-space
kledspace delete my-space
```

### kpolicy

```bash
kpolicy list
kpolicy create my-policy
kpolicy delete my-policy
```
