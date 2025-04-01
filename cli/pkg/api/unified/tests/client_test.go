package unified_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/spectrumwebco/kled.io/cli/pkg/api/unified"
)

func TestNewClient(t *testing.T) {
	auth := unified.Auth{
		APIKey:     "test-key",
		APIBaseURL: "https://api.test.com",
	}
	
	client, err := unified.NewClient(auth)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
	
	if client == nil {
		t.Error("Expected client to be non-nil")
	}
	
	invalidAuth := unified.Auth{
		APIKey:     "",
		APIBaseURL: "",
	}
	
	client, err = unified.NewClient(invalidAuth)
	if err == nil {
		t.Error("Expected error with invalid auth, got nil")
	}
	
	if client != nil {
		t.Error("Expected client to be nil with invalid auth")
	}
}

func TestMakeRequest(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-API-Key") != "test-key" {
			t.Errorf("Expected X-API-Key header to be 'test-key', got '%s'", r.Header.Get("X-API-Key"))
		}
		
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"success"}`))
	}))
	defer server.Close()
	
	auth := unified.Auth{
		APIKey:     "test-key",
		APIBaseURL: server.URL,
	}
	
	client, err := unified.NewClient(auth)
	if err != nil {
		t.Fatalf("Failed to create client: %v", err)
	}
	
	resp, err := client.MakeRequest("GET", "/test", nil)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}
	
	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}
}
