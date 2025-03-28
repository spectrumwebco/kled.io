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
	@cd cli/kled && GOOS=linux GOARCH=amd64 go build -o ../../bin/kled-linux-amd64
	# Linux ARM64
	@cd cli/kled && GOOS=linux GOARCH=arm64 go build -o ../../bin/kled-linux-arm64
	# macOS AMD64
	@cd cli/kled && GOOS=darwin GOARCH=amd64 go build -o ../../bin/kled-darwin-amd64
	# macOS ARM64
	@cd cli/kled && GOOS=darwin GOARCH=arm64 go build -o ../../bin/kled-darwin-arm64
	# Windows AMD64
	@cd cli/kled && GOOS=windows GOARCH=amd64 go build -o ../../bin/kled-windows-amd64.exe
	@echo "Cross-compilation complete!"

# Build unified binary that includes all CLI tools
unified:
	@echo "Building unified CLI binary..."
	@mkdir -p bin
	@cd cli && go build -o ../bin/kled
	@echo "Unified build complete!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf bin/*
	@echo "Clean complete!"
