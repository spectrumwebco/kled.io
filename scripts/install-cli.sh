
set -e

OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

if [ "$ARCH" = "x86_64" ]; then
  ARCH="amd64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
  ARCH="arm64"
else
  echo "Unsupported architecture: $ARCH"
  exit 1
fi

DOWNLOAD_URL="https://github.com/spectrumwebco/kled.io/releases/download/v0.1.0"

if [ "$OS" = "linux" ]; then
  if [ "$ARCH" = "amd64" ]; then
    BINARY_URL="$DOWNLOAD_URL/kled-linux-amd64"
  elif [ "$ARCH" = "arm64" ]; then
    BINARY_URL="$DOWNLOAD_URL/kled-linux-arm64"
  fi
elif [ "$OS" = "darwin" ]; then
  if [ "$ARCH" = "amd64" ]; then
    BINARY_URL="$DOWNLOAD_URL/kled-darwin-amd64"
  elif [ "$ARCH" = "arm64" ]; then
    BINARY_URL="$DOWNLOAD_URL/kled-darwin-arm64"
  fi
else
  echo "Unsupported operating system: $OS"
  exit 1
fi

INSTALL_DIR="$HOME/.kled/bin"
mkdir -p "$INSTALL_DIR"

echo "Downloading Kled CLI from $BINARY_URL..."
curl -L "$BINARY_URL" -o "$INSTALL_DIR/kled"
chmod +x "$INSTALL_DIR/kled"

ln -sf "$INSTALL_DIR/kled" "$INSTALL_DIR/kcluster"
ln -sf "$INSTALL_DIR/kled" "$INSTALL_DIR/kledspace"
ln -sf "$INSTALL_DIR/kled" "$INSTALL_DIR/kpolicy"

if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  echo "export PATH=\$PATH:$INSTALL_DIR" >> "$HOME/.bashrc"
  echo "export PATH=\$PATH:$INSTALL_DIR" >> "$HOME/.zshrc" 2>/dev/null || true
  echo "Added $INSTALL_DIR to PATH. Please restart your shell or run 'source ~/.bashrc'"
fi

echo "Kled CLI installed successfully!"
echo "You can now use the following commands:"
echo "  - kled: Main CLI tool"
echo "  - kcluster: Kubernetes cluster management"
echo "  - kledspace: Kubernetes workspace management"
echo "  - kpolicy: Kubernetes policy management"
