# Kled.io Makefile for building all components

.PHONY: all build cli desktop mobile web install clean prepare-downloads

# Default target
all: build

# Build all components
build: cli desktop mobile web

# Build CLI tools
cli:
	@echo "Building CLI tools..."
	@mkdir -p bin
	@cd cli/unified && go build -o ../../bin/kled-unified
	@cp bin/kled-unified bin/kled
	@cp bin/kled-unified bin/kcluster
	@cp bin/kled-unified bin/kledspace
	@cp bin/kled-unified bin/kpolicy
	@echo "CLI tools build complete!"

# Build desktop app
desktop:
	@echo "Building desktop app..."
	@cd desktop && yarn install && yarn build
	@cd desktop/src-tauri && cargo build --release
	@echo "Desktop app build complete!"

# Build mobile apps
mobile:
	@echo "Building mobile apps..."
	@cd mobile && yarn install || true
	@echo "Mobile apps build setup complete!"

# Build web app
web:
	@echo "Building web app..."
	@cd web && yarn install && yarn build || true
	@echo "Web app build complete!"

# Cross-compile CLI for all platforms
cross-compile:
	@echo "Cross-compiling for all platforms..."
	@mkdir -p bin
	# Linux AMD64
	@cd cli/unified && GOOS=linux GOARCH=amd64 go build -o ../../bin/kled-linux-amd64
	# Linux ARM64
	@cd cli/unified && GOOS=linux GOARCH=arm64 go build -o ../../bin/kled-linux-arm64
	# macOS AMD64
	@cd cli/unified && GOOS=darwin GOARCH=amd64 go build -o ../../bin/kled-darwin-amd64
	# macOS ARM64
	@cd cli/unified && GOOS=darwin GOARCH=arm64 go build -o ../../bin/kled-darwin-arm64
	# Windows AMD64
	@cd cli/unified && GOOS=windows GOARCH=amd64 go build -o ../../bin/kled-windows-amd64.exe
	
	# Create distribution packages with unified binary
	@mkdir -p dist/linux-amd64 dist/linux-arm64 dist/darwin-amd64 dist/darwin-arm64 dist/windows-amd64
	
	# Linux AMD64
	@cp bin/kled-linux-amd64 dist/linux-amd64/kled
	@chmod +x dist/linux-amd64/kled
	
	# Linux ARM64
	@cp bin/kled-linux-arm64 dist/linux-arm64/kled
	@chmod +x dist/linux-arm64/kled
	
	# macOS AMD64
	@cp bin/kled-darwin-amd64 dist/darwin-amd64/kled
	@chmod +x dist/darwin-amd64/kled
	
	# macOS ARM64
	@cp bin/kled-darwin-arm64 dist/darwin-arm64/kled
	@chmod +x dist/darwin-arm64/kled
	
	# Windows AMD64
	@cp bin/kled-windows-amd64.exe dist/windows-amd64/kled.exe
	
	@echo "Cross-compilation complete!"

# Install CLI tools locally
install:
	@echo "Installing CLI tools..."
	@mkdir -p $(HOME)/.kled/bin
	@cp bin/kled-unified $(HOME)/.kled/bin/ || cp bin/kled-linux-amd64 $(HOME)/.kled/bin/kled-unified
	@ln -sf $(HOME)/.kled/bin/kled-unified $(HOME)/.kled/bin/kled
	@ln -sf $(HOME)/.kled/bin/kled-unified $(HOME)/.kled/bin/kcluster
	@ln -sf $(HOME)/.kled/bin/kled-unified $(HOME)/.kled/bin/kledspace
	@ln -sf $(HOME)/.kled/bin/kled-unified $(HOME)/.kled/bin/kpolicy
	@echo "export PATH=\$$PATH:\$$HOME/.kled/bin" >> $(HOME)/.bashrc
	@echo "Installation complete! Please restart your shell or run 'source ~/.bashrc'"

# Prepare downloads directory for GitHub Actions
prepare-downloads:
	@echo "Preparing downloads directory..."
	@mkdir -p web/download/files/windows/x64
	@mkdir -p web/download/files/windows/x86
	@mkdir -p web/download/files/macos/arm64
	@mkdir -p web/download/files/macos/x64
	@mkdir -p web/download/files/linux/x64
	@mkdir -p web/download/files/linux/arm64
	
	# Copy CLI artifacts
	@cp artifacts/kled-cli-linux-amd64/* web/download/files/linux/x64/ || true
	@cp artifacts/kled-cli-linux-arm64/* web/download/files/linux/arm64/ || true
	@cp artifacts/kled-cli-macos-amd64/* web/download/files/macos/x64/ || true
	@cp artifacts/kled-cli-macos-arm64/* web/download/files/macos/arm64/ || true
	@cp artifacts/kled-cli-windows/* web/download/files/windows/x64/ || true
	
	# Copy desktop artifacts
	@cp artifacts/kled-desktop-linux/* web/download/files/linux/x64/ || true
	@cp artifacts/kled-desktop-macos/* web/download/files/macos/x64/ || true
	@cp artifacts/kled-desktop-windows/* web/download/files/windows/x64/ || true
	
	@echo "Download directory prepared!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf bin/*
	@cd desktop && yarn clean || true
	@cd web && yarn clean || true
	@cd mobile && yarn clean || true
	@echo "Clean complete!"
