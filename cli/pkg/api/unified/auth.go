package unified

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/spectrumwebco/kled.io/cli/pkg/api"
)

var CommandSpecificEnvVars = map[string]string{
	"kled":      "KLED_API_KEY",
	"kcluster":  "KCLUSTER_API_KEY",
	"kledspace": "KLEDSPACE_API_KEY",
	"kpolicy":   "KPOLICY_API_KEY",
}

func GetAPIKey(commandName string) string {
	if envVar, exists := CommandSpecificEnvVars[commandName]; exists {
		if apiKey := os.Getenv(envVar); apiKey != "" {
			return apiKey
		}
	}

	if apiKey := os.Getenv("KLED_API_KEY"); apiKey != "" {
		return apiKey
	}

	auth, err := api.LoadAuth()
	if err == nil && auth.APIKey != "" {
		return auth.APIKey
	}

	return ""
}

func GetAPIBaseURL(commandName string) string {
	envVarName := strings.ToUpper(commandName) + "_API_BASE_URL"
	if apiBaseURL := os.Getenv(envVarName); apiBaseURL != "" {
		return apiBaseURL
	}

	if apiBaseURL := os.Getenv("KLED_API_BASE_URL"); apiBaseURL != "" {
		return apiBaseURL
	}

	auth, err := api.LoadAuth()
	if err == nil && auth.APIBaseURL != "" {
		return auth.APIBaseURL
	}

	return ""
}

func DetectCommandName() string {
	execPath := os.Args[0]
	execName := filepath.Base(execPath)
	
	execName = strings.TrimSuffix(execName, filepath.Ext(execName))
	
	for cmd := range CommandSpecificEnvVars {
		if execName == cmd {
			return cmd
		}
	}
	
	return "kled"
}
