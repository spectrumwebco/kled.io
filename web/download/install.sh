
set -e

TOOL="unified"
INSTALL_DIR="/usr/local/bin"
VERSION="latest"

while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--tool)
      TOOL="$2"
      shift 2
      ;;
    -d|--dir)
      INSTALL_DIR="$2"
      shift 2
      ;;
    -v|--version)
      VERSION="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [[ "$TOOL" != "unified" && "$TOOL" != "kled" && "$TOOL" != "kcluster" && "$TOOL" != "kledspace" && "$TOOL" != "kpolicy" ]]; then
  echo "Invalid tool: $TOOL"
  echo "Valid options: unified, kled, kcluster, kledspace, kpolicy"
  exit 1
fi

OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
  x86_64)
    GOARCH="amd64"
    ;;
  aarch64|arm64)
    GOARCH="arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

case "$OS" in
  linux)
    GOOS="linux"
    ;;
  darwin)
    GOOS="darwin"
    ;;
  msys*|mingw64|windows*)
    GOOS="windows"
    ;;
  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

if [[ "$GOOS" == "windows" ]]; then
  EXTENSION=".exe"
else
  EXTENSION=""
fi

if [[ "$TOOL" == "unified" ]]; then
  FILENAME="kled-${GOOS}-${GOARCH}${EXTENSION}"
else
  FILENAME="${TOOL}-${GOOS}-${GOARCH}${EXTENSION}"
fi

if [[ "$VERSION" == "latest" ]]; then
  DOWNLOAD_URL="https://kled.io/download/${FILENAME}"
else
  DOWNLOAD_URL="https://kled.io/download/${VERSION}/${FILENAME}"
fi

echo "Downloading $TOOL for $GOOS/$GOARCH..."
curl -fsSL "$DOWNLOAD_URL" -o "/tmp/$FILENAME"

echo "Installing to $INSTALL_DIR..."
chmod +x "/tmp/$FILENAME"

if [[ $EUID -ne 0 && ! -w "$INSTALL_DIR" ]]; then
  sudo mv "/tmp/$FILENAME" "$INSTALL_DIR/$TOOL$EXTENSION"
else
  mv "/tmp/$FILENAME" "$INSTALL_DIR/$TOOL$EXTENSION"
fi

if [[ "$TOOL" == "unified" ]]; then
  echo "Creating symlinks for CLI tools..."
  for SYMLINK in kled kcluster kledspace kpolicy; do
    if [[ $EUID -ne 0 && ! -w "$INSTALL_DIR" ]]; then
      sudo ln -sf "$INSTALL_DIR/$TOOL$EXTENSION" "$INSTALL_DIR/$SYMLINK$EXTENSION"
    else
      ln -sf "$INSTALL_DIR/$TOOL$EXTENSION" "$INSTALL_DIR/$SYMLINK$EXTENSION"
    fi
  done
fi

echo "Installation complete!"
echo "You can now use the $TOOL command."
if [[ "$TOOL" == "unified" ]]; then
  echo "The following commands are also available: kled, kcluster, kledspace, kpolicy"
fi
