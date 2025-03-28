#!/bin/bash

# Kled.io CLI Installer
# This script detects the OS and architecture and downloads the appropriate Kled CLI binary

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL for downloads
BASE_URL="https://www.kled.io/download/files"

# Detect OS
detect_os() {
  case "$(uname -s)" in
    Linux*)     echo "linux";;
    Darwin*)    echo "darwin";;
    CYGWIN*)    echo "windows";;
    MINGW*)     echo "windows";;
    MSYS*)      echo "windows";;
    *)          echo "unknown";;
  esac
}

# Detect architecture
detect_arch() {
  case "$(uname -m)" in
    x86_64*)    echo "amd64";;
    amd64*)     echo "amd64";;
    arm64*)     echo "arm64";;
    aarch64*)   echo "arm64";;
    *)          echo "unknown";;
  esac
}

# Main installation function
install_kled() {
  echo -e "${BLUE}Kled.io CLI Installer${NC}"
  echo "Detecting your system..."
  
  OS=$(detect_os)
  ARCH=$(detect_arch)
  
  if [ "$OS" = "unknown" ] || [ "$ARCH" = "unknown" ]; then
    echo -e "${RED}Error: Could not detect your operating system or architecture.${NC}"
    echo "Please download the appropriate binary manually from https://www.kled.io/download"
    exit 1
  fi
  
  echo -e "Detected: ${GREEN}$OS/$ARCH${NC}"
  
  # Handle Windows separately
  if [ "$OS" = "windows" ]; then
    FILENAME="kled-windows-amd64.exe"
    echo -e "${YELLOW}Note: For Windows, please download the installer from https://www.kled.io/download${NC}"
    exit 0
  else
    FILENAME="kled-$OS-$ARCH"
  fi
  
  DOWNLOAD_URL="$BASE_URL/$FILENAME"
  
  echo "Downloading Kled CLI from $DOWNLOAD_URL..."
  curl -L -o kled "$DOWNLOAD_URL"
  
  echo "Making binary executable..."
  chmod +x kled
  
  echo "Installing to /usr/local/bin/kled..."
  sudo mv kled /usr/local/bin/
  
  echo -e "${GREEN}Installation complete!${NC}"
  echo "Run 'kled --version' to verify the installation."
  echo -e "${YELLOW}Note: You may need to restart your terminal for changes to take effect.${NC}"
}

# Run the installer
install_kled
