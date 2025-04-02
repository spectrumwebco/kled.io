# Test script for Kled CLI on Windows
# This script downloads and tests the Kled CLI tools

Write-Host "Testing Kled CLI for Windows..."

# Create installation directory
$InstallDir = "$env:USERPROFILE\.kled\bin"
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null

# Download URL
$DownloadUrl = "https://github.com/spectrumwebco/kled.io/releases/download/v0.1.0/kled-windows-amd64.exe"

# Download binary
Write-Host "Downloading Kled CLI from $DownloadUrl..."
Invoke-WebRequest -Uri $DownloadUrl -OutFile "$InstallDir\kled.exe"

# Test CLI commands
Write-Host "Testing kled command..."
& "$InstallDir\kled.exe" --help

Write-Host "Testing kled cluster command..."
& "$InstallDir\kled.exe" cluster --help

Write-Host "Testing kled space command..."
& "$InstallDir\kled.exe" space --help

Write-Host "Testing kled policy command..."
& "$InstallDir\kled.exe" policy --help

Write-Host "Kled CLI test completed successfully!"
