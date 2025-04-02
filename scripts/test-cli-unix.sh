
set -e

echo "Testing Kled CLI for Unix-like systems..."

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

INSTALL_DIR="$HOME/.kled/bin"
mkdir -p "$INSTALL_DIR"

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

echo "Downloading Kled CLI from $BINARY_URL..."
curl -L "$BINARY_URL" -o "$INSTALL_DIR/kled"
chmod +x "$INSTALL_DIR/kled"

echo "Testing kled command..."
"$INSTALL_DIR/kled" --help

echo "Testing kled cluster command..."
"$INSTALL_DIR/kled" cluster --help

echo "Testing kled space command..."
"$INSTALL_DIR/kled" space --help

echo "Testing kled policy command..."
"$INSTALL_DIR/kled" policy --help

echo "Kled CLI test completed successfully!"
