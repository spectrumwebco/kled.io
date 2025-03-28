package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	command := os.Args[1]

	switch command {
	case "workspace":
		handleWorkspaceCommand()
	case "version":
		fmt.Println("kled version 0.1.0")
	case "help":
		printUsage()
	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Usage: kled [command]")
	fmt.Println("\nAvailable Commands:")
	fmt.Println("  workspace    Manage workspaces")
	fmt.Println("  version      Print the version number")
	fmt.Println("  help         Help about any command")
}

func handleWorkspaceCommand() {
	if len(os.Args) < 3 {
		fmt.Println("Usage: kled workspace [list|create|delete]")
		os.Exit(1)
	}

	subcommand := os.Args[2]

	switch subcommand {
	case "list":
		fmt.Println("Available workspaces:")
		fmt.Println("- default")
		fmt.Println("- development")
		fmt.Println("- production")
	case "create":
		if len(os.Args) < 4 {
			fmt.Println("Usage: kled workspace create [name]")
			os.Exit(1)
		}
		name := os.Args[3]
		fmt.Printf("Creating workspace: %s\n", name)
		fmt.Println("Workspace created successfully")
	case "delete":
		if len(os.Args) < 4 {
			fmt.Println("Usage: kled workspace delete [name]")
			os.Exit(1)
		}
		name := os.Args[3]
		fmt.Printf("Deleting workspace: %s\n", name)
		fmt.Println("Workspace deleted successfully")
	default:
		fmt.Printf("Unknown subcommand: %s\n", subcommand)
		fmt.Println("Usage: kled workspace [list|create|delete]")
		os.Exit(1)
	}
}
