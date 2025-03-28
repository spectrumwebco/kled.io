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
		fmt.Println("Available clusters:")
		fmt.Println("- default")
		fmt.Println("- production")
	case "create":
		if len(os.Args) < 3 {
			fmt.Println("Usage: kcluster create [name]")
			os.Exit(1)
		}
		name := os.Args[2]
		fmt.Printf("Creating cluster: %s\n", name)
		fmt.Println("Cluster created successfully")
	case "delete":
		if len(os.Args) < 3 {
			fmt.Println("Usage: kcluster delete [name]")
			os.Exit(1)
		}
		name := os.Args[2]
		fmt.Printf("Deleting cluster: %s\n", name)
		fmt.Println("Cluster deleted successfully")
	case "version":
		fmt.Println("kcluster version 0.1.0")
	case "help":
		printUsage()
	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Usage: kcluster [command]")
	fmt.Println("\nAvailable Commands:")
	fmt.Println("  list         List all clusters")
	fmt.Println("  create       Create a new cluster")
	fmt.Println("  delete       Delete a cluster")
	fmt.Println("  version      Print the version number")
	fmt.Println("  help         Help about any command")
}
