# Kled.io Makefile for building unified CLI tools

.PHONY: all build clean

# Default target
all: build

# Build all CLI tools
build:
	@echo "Building unified CLI tools..."
	@mkdir -p bin
	@cd cli/kled && go build -o ../../bin/kled
	@cd cli/kcluster && go build -o ../../bin/kcluster
	@cd cli/kledspace && go build -o ../../bin/kledspace
	@cd cli/kpolicy && go build -o ../../bin/kpolicy
	@echo "Building desktop app..."
	@cd desktop && yarn build
	@echo "Build complete!"

# Cross-compile for all platforms
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
	
	# Create symlinks for individual tools
	@echo "Creating symlinks for individual tools..."
	@ln -sf kled-linux-amd64 bin/kled
	@ln -sf kled-linux-amd64 bin/kcluster
	@ln -sf kled-linux-amd64 bin/kledspace
	@ln -sf kled-linux-amd64 bin/kpolicy
	@echo "Symlinks created!"

# Build unified binary that includes all CLI tools
unified:
	@echo "Building unified CLI binary..."
	@mkdir -p bin
	# Build unified binary for each platform
	@echo "Building for Linux AMD64..."
	@GOOS=linux GOARCH=amd64 go build -o bin/kled-linux-amd64 ./cli/unified
	@echo "Building for Linux ARM64..."
	@GOOS=linux GOARCH=arm64 go build -o bin/kled-linux-arm64 ./cli/unified
	@echo "Building for macOS AMD64..."
	@GOOS=darwin GOARCH=amd64 go build -o bin/kled-darwin-amd64 ./cli/unified
	@echo "Building for macOS ARM64..."
	@GOOS=darwin GOARCH=arm64 go build -o bin/kled-darwin-arm64 ./cli/unified
	@echo "Building for Windows AMD64..."
	@GOOS=windows GOARCH=amd64 go build -o bin/kled-windows-amd64.exe ./cli/unified
	@echo "Unified build complete!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf bin/*
	@echo "Clean complete!"
