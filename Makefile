# Kled.io Makefile for building all components

.PHONY: all build cli desktop mobile web install clean

# Default target
all: build

# Build all components
build: cli desktop mobile web

# Build CLI tools
cli:
	@echo "Building CLI tools..."
	@mkdir -p bin
	@cd cli/unified && go build -o ../../bin/kled-unified
	@ln -sf kled-unified bin/kled
	@ln -sf kled-unified bin/kcluster
	@ln -sf kled-unified bin/kledspace
	@ln -sf kled-unified bin/kpolicy
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

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf bin/*
	@cd desktop && yarn clean || true
	@cd web && yarn clean || true
	@cd mobile && yarn clean || true
	@echo "Clean complete!"
