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
	case "list":
		fmt.Println("Available spaces:")
		fmt.Println("- default")
		fmt.Println("- development")
		fmt.Println("- production")
	case "create":
		if len(os.Args) < 3 {
			fmt.Println("Usage: kledspace create [name]")
			os.Exit(1)
		}
		name := os.Args[2]
		fmt.Printf("Creating space: %s\n", name)
		fmt.Println("Space created successfully")
	case "delete":
		if len(os.Args) < 3 {
			fmt.Println("Usage: kledspace delete [name]")
			os.Exit(1)
		}
		name := os.Args[2]
		fmt.Printf("Deleting space: %s\n", name)
		fmt.Println("Space deleted successfully")
	case "version":
		fmt.Println("kledspace version 0.1.0")
	case "help":
		printUsage()
	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Usage: kledspace [command]")
	fmt.Println("\nAvailable Commands:")
	fmt.Println("  list         List all spaces")
	fmt.Println("  create       Create a new space")
	fmt.Println("  delete       Delete a space")
	fmt.Println("  version      Print the version number")
	fmt.Println("  help         Help about any command")
}
