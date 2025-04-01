package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

func detectCommandName() string {
	execPath := os.Args[0]
	execName := filepath.Base(execPath)
	
	execName = strings.TrimSuffix(execName, filepath.Ext(execName))
	
	knownCommands := map[string]bool{
		"kled":      true,
		"kcluster":  true,
		"kledspace": true,
		"kpolicy":   true,
	}
	
	if knownCommands[execName] {
		return execName
	}
	
	return "kled"
}

func getCommandFromArgs(args []string) string {
	if len(args) == 0 {
		return ""
	}
	
	knownCommands := map[string]bool{
		"cluster": true,
		"space":   true,
		"policy":  true,
		"pro":     true,
		"version": true,
	}
	
	if knownCommands[args[0]] {
		return args[0]
	}
	
	return ""
}

func main() {
	commandName := detectCommandName()
	
	apiKey := os.Getenv("KLED_API_KEY")
	if apiKey == "" {
		apiKey = os.Getenv("KLED_TOKEN")
	}
	
	apiBaseURL := os.Getenv("KLED_API_URL")
	if apiBaseURL == "" {
		apiBaseURL = "https://api.kled.io"
	}
	
	var rootCmd *cobra.Command
	
	switch commandName {
	case "kcluster":
		rootCmd = createKClusterRootCmd(apiKey, apiBaseURL)
	case "kledspace":
		rootCmd = createKledSpaceRootCmd(apiKey, apiBaseURL)
	case "kpolicy":
		rootCmd = createKPolicyRootCmd(apiKey, apiBaseURL)
	default:
		rootCmd = createKledRootCmd(apiKey, apiBaseURL)
	}
	
	rootCmd.AddCommand(&cobra.Command{
		Use:   "version",
		Short: "Print the version",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Printf("%s v0.1.0\n", commandName)
		},
	})

	rootCmd.AddCommand(&cobra.Command{
		Use:   "version",
		Short: "Print the version of Kled",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Kled v0.1.0")
		},
	})

	spaceCmd := &cobra.Command{
		Use:   "space",
		Short: "Kubernetes workspace management",
		Long:  "KledSpace provides tools for managing Kubernetes workspaces and development environments",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}

	spaceCmd.AddCommand(
		&cobra.Command{
			Use:   "init",
			Short: "Initialize a new project",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Initializing KledSpace project...")
			},
		},
		&cobra.Command{
			Use:   "dev",
			Short: "Start development mode",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Starting KledSpace development mode...")
			},
		},
		&cobra.Command{
			Use:   "deploy",
			Short: "Deploy resources",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Deploying resources with KledSpace...")
			},
		},
	)

	clusterCmd := &cobra.Command{
		Use:   "cluster",
		Short: "Kubernetes cluster management",
		Long:  "KCluster provides tools for creating and managing Kubernetes clusters",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}

	clusterCmd.AddCommand(
		&cobra.Command{
			Use:   "create",
			Short: "Create a new cluster",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Creating KCluster cluster...")
			},
		},
		&cobra.Command{
			Use:   "connect",
			Short: "Connect to a cluster",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Connecting to KCluster cluster...")
			},
		},
		&cobra.Command{
			Use:   "delete",
			Short: "Delete a cluster",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Deleting KCluster cluster...")
			},
		},
	)

	policyCmd := &cobra.Command{
		Use:   "policy",
		Short: "Kubernetes policy management",
		Long:  "KPolicy provides tools for managing Kubernetes policies",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}

	policyCmd.AddCommand(
		&cobra.Command{
			Use:   "apply",
			Short: "Apply a policy",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Applying KPolicy policy...")
			},
		},
		&cobra.Command{
			Use:   "list",
			Short: "List policies",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Listing KPolicy policies...")
			},
		},
		&cobra.Command{
			Use:   "validate",
			Short: "Validate a policy",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Validating KPolicy policy...")
			},
		},
	)

	proCmd := &cobra.Command{
		Use:   "pro",
		Short: "Pro features",
		Long:  "Access to Kled Pro features and enterprise functionality",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}

	proCmd.AddCommand(
		&cobra.Command{
			Use:   "login",
			Short: "Login to Kled Pro",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Logging in to Kled Pro...")
			},
		},
		&cobra.Command{
			Use:   "status",
			Short: "Show subscription status",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Showing Kled Pro subscription status...")
			},
		},
	)

	if commandName == "kled" {
		rootCmd.AddCommand(spaceCmd, clusterCmd, policyCmd, proCmd)
	}

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func createKledRootCmd(apiKey, apiBaseURL string) *cobra.Command {
	return &cobra.Command{
		Use:   "kled",
		Short: "Kled - Kubernetes development and management platform",
		Long: `Kled is a comprehensive platform for Kubernetes development and management.
It combines multiple tools into a single unified CLI:
- kled cluster: Kubernetes cluster management
- kled space: Kubernetes workspace management
- kled policy: Kubernetes policy management
- kled pro: Pro features and enterprise functionality`,
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}
}

func createKClusterRootCmd(apiKey, apiBaseURL string) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "kcluster",
		Short: "Kubernetes cluster management",
		Long:  "KCluster provides tools for creating and managing Kubernetes clusters",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}
	
	cmd.AddCommand(
		&cobra.Command{
			Use:   "create",
			Short: "Create a new cluster",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Creating KCluster cluster...")
			},
		},
		&cobra.Command{
			Use:   "connect",
			Short: "Connect to a cluster",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Connecting to KCluster cluster...")
			},
		},
		&cobra.Command{
			Use:   "delete",
			Short: "Delete a cluster",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Deleting KCluster cluster...")
			},
		},
	)
	
	return cmd
}

func createKledSpaceRootCmd(apiKey, apiBaseURL string) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "kledspace",
		Short: "Kubernetes workspace management",
		Long:  "KledSpace provides tools for managing Kubernetes workspaces and development environments",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}
	
	cmd.AddCommand(
		&cobra.Command{
			Use:   "init",
			Short: "Initialize a new project",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Initializing KledSpace project...")
			},
		},
		&cobra.Command{
			Use:   "dev",
			Short: "Start development mode",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Starting KledSpace development mode...")
			},
		},
		&cobra.Command{
			Use:   "deploy",
			Short: "Deploy resources",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Deploying resources with KledSpace...")
			},
		},
	)
	
	return cmd
}

func createKPolicyRootCmd(apiKey, apiBaseURL string) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "kpolicy",
		Short: "Kubernetes policy management",
		Long:  "KPolicy provides tools for managing Kubernetes policies",
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) == 0 {
				cmd.Help()
				os.Exit(0)
			}
		},
	}
	
	cmd.AddCommand(
		&cobra.Command{
			Use:   "apply",
			Short: "Apply a policy",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Applying KPolicy policy...")
			},
		},
		&cobra.Command{
			Use:   "list",
			Short: "List policies",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Listing KPolicy policies...")
			},
		},
		&cobra.Command{
			Use:   "validate",
			Short: "Validate a policy",
			Run: func(cmd *cobra.Command, args []string) {
				fmt.Println("Validating KPolicy policy...")
			},
		},
	)
	
	return cmd
}
