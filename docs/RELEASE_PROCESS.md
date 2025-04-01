# Kled.io Release Process

This document outlines the release process for the Kled.io platform, including CLI tools and desktop applications.

## Overview

The Kled.io release process includes:

1. Building CLI tools for multiple platforms (Windows, macOS, Linux)
2. Building desktop applications for multiple platforms
3. Testing installers for functionality
4. Creating GitHub releases with proper artifacts
5. Verifying installation on target platforms

## Release Workflow

The release process is automated through GitHub Actions workflows in `.github/workflows/build-unified-cli.yml`. This workflow is triggered:

- Manually through the GitHub Actions UI
- Automatically when a tag with the format `v*` is pushed

## Release Artifacts

Each release includes the following artifacts:

### CLI Tools

- **Linux (AMD64/ARM64)**
  - `kled` - Main CLI tool
  - `kcluster` - Kubernetes cluster management
  - `kledspace` - Workspace management
  - `kpolicy` - Policy management

- **Windows (AMD64)**
  - `kled.exe`
  - `kcluster.exe`
  - `kledspace.exe`
  - `kpolicy.exe`

- **macOS (AMD64/ARM64)**
  - `kled`
  - `kcluster`
  - `kledspace`
  - `kpolicy`

### Desktop Applications

- **Linux**: `.deb` package and `.AppImage`
- **Windows**: `.exe` installer
- **macOS**: `.dmg` installer

## Testing Installers

### Windows Installer Testing

The Windows installer is tested during the build process using the `scripts/validate-installer.ps1` script, which:

1. Verifies the installer exists
2. Checks file size and creation time
3. Validates file signature (if signtool is available)
4. Tests extraction in silent mode
5. Verifies critical files are present

### Manual Testing

For thorough testing before release:

1. Download the installer from the GitHub release page
2. Run the installer on a clean Windows machine
3. Verify the application launches correctly
4. Test basic functionality (CLI commands, UI navigation)
5. Verify uninstallation works properly

## Creating a Release

To create a new release:

1. Update version numbers in relevant files:
   - `cli/unified/version.go`
   - `desktop/package.json`

2. Commit changes and push to the repository

3. Create and push a new tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. Monitor the GitHub Actions workflow to ensure all builds succeed

5. Verify the release on GitHub includes all expected artifacts

## Troubleshooting

If the release process fails:

1. Check GitHub Actions logs for specific errors
2. Verify all dependencies are correctly installed in the build environment
3. Test builds locally before creating a release tag
4. Ensure all required secrets are configured in the repository settings

## Windows Installation Verification

To verify Windows installation:

1. Download the `.exe` installer from the release page
2. Run the installer on a Windows machine
3. Check that the application is installed in the expected location (usually `C:\Program Files\Kled Desktop`)
4. Verify desktop shortcuts are created
5. Launch the application and ensure it runs correctly
6. Test CLI commands from Command Prompt or PowerShell
