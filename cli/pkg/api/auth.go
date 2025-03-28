package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

type Auth struct {
	APIKey     string    `json:"apiKey"`
	APIBaseURL string    `json:"apiBaseURL"`
	CreatedAt  time.Time `json:"createdAt"`
}

func LoadAuth() (*Auth, error) {
	configPath, err := getConfigPath()
	if err != nil {
		return nil, err
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return nil, errors.New("no authentication configuration found")
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, err
	}

	var auth Auth
	if err := json.Unmarshal(data, &auth); err != nil {
		return nil, err
	}

	if apiKey := os.Getenv("KLED_API_KEY"); apiKey != "" {
		auth.APIKey = apiKey
	}
	if apiBaseURL := os.Getenv("KLED_API_BASE_URL"); apiBaseURL != "" {
		auth.APIBaseURL = apiBaseURL
	}

	return &auth, nil
}

func SaveAuth(auth *Auth) error {
	configPath, err := getConfigPath()
	if err != nil {
		return err
	}

	configDir := filepath.Dir(configPath)
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return err
	}

	if auth.CreatedAt.IsZero() {
		auth.CreatedAt = time.Now()
	}

	data, err := json.MarshalIndent(auth, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(configPath, data, 0600)
}

func getConfigPath() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user home directory: %w", err)
	}
	return filepath.Join(home, ".kled", "config.json"), nil
}
