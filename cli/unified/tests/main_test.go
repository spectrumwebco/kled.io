package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDetectCommandName(t *testing.T) {
	originalArgs := os.Args
	defer func() { os.Args = originalArgs }()
	
	os.Args = []string{"/usr/local/bin/kled", "arg1", "arg2"}
	cmdName := detectCommandName()
	if cmdName != "kled" {
		t.Errorf("Expected command name 'kled', got '%s'", cmdName)
	}
	
	os.Args = []string{"/usr/local/bin/kcluster", "arg1", "arg2"}
	cmdName = detectCommandName()
	if cmdName != "kcluster" {
		t.Errorf("Expected command name 'kcluster', got '%s'", cmdName)
	}
	
	os.Args = []string{"/usr/local/bin/kledspace", "arg1", "arg2"}
	cmdName = detectCommandName()
	if cmdName != "kledspace" {
		t.Errorf("Expected command name 'kledspace', got '%s'", cmdName)
	}
	
	os.Args = []string{"/usr/local/bin/kpolicy", "arg1", "arg2"}
	cmdName = detectCommandName()
	if cmdName != "kpolicy" {
		t.Errorf("Expected command name 'kpolicy', got '%s'", cmdName)
	}
	
	tempDir, err := os.MkdirTemp("", "kled-test")
	if err != nil {
		t.Fatalf("Failed to create temp directory: %v", err)
	}
	defer os.RemoveAll(tempDir)
	
	binaryPath := filepath.Join(tempDir, "kled-unified")
	if err := os.WriteFile(binaryPath, []byte("test binary"), 0755); err != nil {
		t.Fatalf("Failed to create test binary: %v", err)
	}
	
	symlinkPaths := []string{
		filepath.Join(tempDir, "kled"),
		filepath.Join(tempDir, "kcluster"),
		filepath.Join(tempDir, "kledspace"),
		filepath.Join(tempDir, "kpolicy"),
	}
	
	for _, symlinkPath := range symlinkPaths {
		if err := os.Symlink(binaryPath, symlinkPath); err != nil {
			t.Fatalf("Failed to create symlink: %v", err)
		}
	}
	
	for _, cmdName := range []string{"kled", "kcluster", "kledspace", "kpolicy"} {
		symlinkPath := filepath.Join(tempDir, cmdName)
		os.Args = []string{symlinkPath, "arg1", "arg2"}
		
		detectedCmd := detectCommandName()
		if detectedCmd != cmdName {
			t.Errorf("Expected command name '%s', got '%s'", cmdName, detectedCmd)
		}
	}
}

func TestGetCommandFromArgs(t *testing.T) {
	args := []string{"kled", "--flag", "value"}
	cmdName := getCommandFromArgs(args)
	if cmdName != "" {
		t.Errorf("Expected empty command name, got '%s'", cmdName)
	}
	
	args = []string{"kled-unified", "kcluster", "create", "--name", "test"}
	cmdName = getCommandFromArgs(args)
	if cmdName != "kcluster" {
		t.Errorf("Expected command name 'kcluster', got '%s'", cmdName)
	}
	
	args = []string{"kled-unified", "--flag", "value", "kledspace", "init"}
	cmdName = getCommandFromArgs(args)
	if cmdName != "kledspace" {
		t.Errorf("Expected command name 'kledspace', got '%s'", cmdName)
	}
}
