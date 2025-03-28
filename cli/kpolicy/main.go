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
		fmt.Println("Available policies:")
		fmt.Println("- default")
		fmt.Println("- security")
		fmt.Println("- compliance")
	case "create":
		if len(os.Args) < 3 {
			fmt.Println("Usage: kpolicy create [name]")
			os.Exit(1)
		}
		name := os.Args[2]
		fmt.Printf("Creating policy: %s\n", name)
		fmt.Println("Policy created successfully")
	case "delete":
		if len(os.Args) < 3 {
			fmt.Println("Usage: kpolicy delete [name]")
			os.Exit(1)
		}
		name := os.Args[2]
		fmt.Printf("Deleting policy: %s\n", name)
		fmt.Println("Policy deleted successfully")
	case "version":
		fmt.Println("kpolicy version 0.1.0")
	case "help":
		printUsage()
	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("Usage: kpolicy [command]")
	fmt.Println("\nAvailable Commands:")
	fmt.Println("  list         List all policies")
	fmt.Println("  create       Create a new policy")
	fmt.Println("  delete       Delete a policy")
	fmt.Println("  version      Print the version number")
	fmt.Println("  help         Help about any command")
}
