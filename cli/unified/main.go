package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	APIKey     string `json:"apiKey"`
	APIBaseURL string `json:"apiBaseURL"`
}

var config Config

func init() {
	configPath := getConfigPath()
	if _, err := os.Stat(configPath); err == nil {
		data, err := os.ReadFile(configPath)
		if err == nil {
			_ = json.Unmarshal(data, &config)
		}
	}

	if apiKey := os.Getenv("KLED_API_KEY"); apiKey != "" {
		config.APIKey = apiKey
	}
	if apiBaseURL := os.Getenv("KLED_API_BASE_URL"); apiBaseURL != "" {
		config.APIBaseURL = apiBaseURL
	}
}

func main() {
	execName := filepath.Base(os.Args[0])
	execName = strings.TrimSuffix(execName, filepath.Ext(execName))

	var command string
	if strings.HasPrefix(execName, "kled-") {
		if len(os.Args) < 2 {
			printUsage()
			os.Exit(1)
		}
		command = os.Args[1]
		os.Args = append(os.Args[:1], os.Args[2:]...)
	} else {
		switch execName {
		case "kled":
			command = "kled"
		case "kcluster":
			command = "kcluster"
		case "kledspace":
			command = "kledspace"
		case "kpolicy":
			command = "kpolicy"
		default:
			fmt.Printf("Unknown command: %s\n", execName)
			printUsage()
			os.Exit(1)
		}
	}

	switch command {
	case "kled":
		executeKled()
	case "kcluster":
		executeKCluster()
	case "kledspace":
		executeKledSpace()
	case "kpolicy":
		executeKPolicy()
	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Kled.io CLI - Kubernetes Workspace Management")
	fmt.Println("\nUsage:")
	fmt.Println("  kled <command> [args]")
	fmt.Println("  kcluster <command> [args]")
	fmt.Println("  kledspace <command> [args]")
	fmt.Println("  kpolicy <command> [args]")
	fmt.Println("\nOr with unified binary:")
	fmt.Println("  kled-<platform> kled <command> [args]")
	fmt.Println("  kled-<platform> kcluster <command> [args]")
	fmt.Println("  kled-<platform> kledspace <command> [args]")
	fmt.Println("  kled-<platform> kpolicy <command> [args]")
	fmt.Println("\nCommands:")
	fmt.Println("  kled         Manage Kled workspaces")
	fmt.Println("  kcluster     Manage Kubernetes clusters")
	fmt.Println("  kledspace    Manage workspace environments")
	fmt.Println("  kpolicy      Manage policies")
	fmt.Println("\nRun 'kled help' for more information on a command.")
}

func executeKled() {
	fmt.Println("Executing kled command...")
}

func executeKCluster() {
	fmt.Println("Executing kcluster command...")
}

func executeKledSpace() {
	fmt.Println("Executing kledspace command...")
}

func executeKPolicy() {
	fmt.Println("Executing kpolicy command...")
}

func getConfigPath() string {
	home, err := os.UserHomeDir()
	if err != nil {
		return ""
	}
	return filepath.Join(home, ".kled", "config.json")
}
