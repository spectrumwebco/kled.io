.PHONY: build clean test

# Default target
all: build

# Build all components
build: build-cli build-desktop

# Build CLI tools
build-cli:
	@echo "Building CLI tools..."
	cd cli/kled && go build -o ../../bin/kled
	cd cli/kcluster && go build -o ../../bin/kcluster
	cd cli/kledspace && go build -o ../../bin/kledspace
	cd cli/kpolicy && go build -o ../../bin/kpolicy
	@echo "CLI tools built successfully"

# Build desktop app
build-desktop:
	@echo "Building desktop app..."
	cd desktop && yarn install && yarn build
	cd desktop/src-tauri && cargo build --release
	@echo "Desktop app built successfully"

# Build web app
build-web:
	@echo "Building web app..."
	cd web && yarn install && yarn build
	@echo "Web app built successfully"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/*
	rm -rf desktop/dist
	rm -rf desktop/src-tauri/target
	rm -rf web/dist
	@echo "Clean completed"

# Run tests
test:
	@echo "Running tests..."
	cd cli/kled && go test ./...
	cd cli/kcluster && go test ./...
	cd cli/kledspace && go test ./...
	cd cli/kpolicy && go test ./...
	cd desktop && yarn test
	cd web && yarn test
	@echo "Tests completed"
