package unified_test

import (
	"os"
	"testing"

	"github.com/spectrumwebco/kled.io/cli/pkg/api/unified"
)

func TestLoadAuth(t *testing.T) {
	originalAPIKey := os.Getenv("KLED_API_KEY")
	originalAPIBaseURL := os.Getenv("KLED_API_BASE_URL")
	
	defer func() {
		os.Setenv("KLED_API_KEY", originalAPIKey)
		os.Setenv("KLED_API_BASE_URL", originalAPIBaseURL)
	}()
	
	os.Setenv("KLED_API_KEY", "test-api-key")
	os.Setenv("KLED_API_BASE_URL", "https://api.test.com")
	
	auth, err := unified.LoadAuth()
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
	
	if auth.APIKey != "test-api-key" {
		t.Errorf("Expected APIKey to be 'test-api-key', got '%s'", auth.APIKey)
	}
	
	if auth.APIBaseURL != "https://api.test.com" {
		t.Errorf("Expected APIBaseURL to be 'https://api.test.com', got '%s'", auth.APIBaseURL)
	}
	
	os.Unsetenv("KLED_API_KEY")
	os.Unsetenv("KLED_API_BASE_URL")
	
	auth, err = unified.LoadAuth()
	if err == nil {
		t.Error("Expected error when no API key is set, got nil")
	}
}

func TestIsValidAuth(t *testing.T) {
	validAuth := unified.Auth{
		APIKey:     "valid-key",
		APIBaseURL: "https://api.valid.com",
	}
	
	if !validAuth.IsValid() {
		t.Error("Expected valid auth to return true, got false")
	}
	
	invalidAuth1 := unified.Auth{
		APIKey:     "",
		APIBaseURL: "https://api.valid.com",
	}
	
	if invalidAuth1.IsValid() {
		t.Error("Expected invalid auth (no API key) to return false, got true")
	}
	
	invalidAuth2 := unified.Auth{
		APIKey:     "valid-key",
		APIBaseURL: "",
	}
	
	if invalidAuth2.IsValid() {
		t.Error("Expected invalid auth (no API base URL) to return false, got true")
	}
}
