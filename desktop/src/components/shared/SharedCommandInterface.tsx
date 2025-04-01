import React from 'react';
import { Box, Heading, Text, Flex, Icon, Button } from '@chakra-ui/react';
import { FaTerminal, FaCubes, FaLayerGroup, FaShieldAlt } from 'react-icons/fa';

interface CommandProps {
  name: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
}

interface SharedCommandInterfaceProps {
  title: string;
  commands: CommandProps[];
  onCommandSelect?: (commandName: string) => void;
}

/**
 * Shared component for displaying command interfaces across desktop and web apps
 * This component can be used in both the desktop app and web app to provide
 * a consistent interface for interacting with CLI commands
 */
export const SharedCommandInterface: React.FC<SharedCommandInterfaceProps> = ({
  title,
  commands,
  onCommandSelect
}) => {
  const handleCommandClick = (commandName: string) => {
    if (onCommandSelect) {
      onCommandSelect(commandName);
    }
  };

  return (
    <Box className="shared-command-interface" p={4} borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>{title}</Heading>
      
      <Flex direction="column" gap={3}>
        {commands.map((command) => (
          <Box 
            key={command.name}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            _hover={{ bg: 'gray.50', cursor: 'pointer' }}
            onClick={() => {
              handleCommandClick(command.name);
              if (command.onClick) command.onClick();
            }}
          >
            <Flex align="center">
              <Icon as={command.icon} boxSize={5} mr={3} />
              <Box>
                <Text fontWeight="bold">{command.name}</Text>
                <Text fontSize="sm" color="gray.600">{command.description}</Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

/**
 * Predefined command sets for each CLI interface
 * These can be imported and used in both desktop and web apps
 */
export const getKledCommands = (): CommandProps[] => [
  {
    name: 'kled workspace create',
    description: 'Create a new development workspace',
    icon: FaTerminal
  },
  {
    name: 'kled workspace list',
    description: 'List all available workspaces',
    icon: FaTerminal
  },
  {
    name: 'kled workspace delete',
    description: 'Delete an existing workspace',
    icon: FaTerminal
  }
];

export const getKclusterCommands = (): CommandProps[] => [
  {
    name: 'kcluster create',
    description: 'Create a new Kubernetes cluster',
    icon: FaCubes
  },
  {
    name: 'kcluster connect',
    description: 'Connect to an existing cluster',
    icon: FaCubes
  },
  {
    name: 'kcluster list',
    description: 'List all available clusters',
    icon: FaCubes
  }
];

export const getKledspaceCommands = (): CommandProps[] => [
  {
    name: 'kledspace init',
    description: 'Initialize a new application space',
    icon: FaLayerGroup
  },
  {
    name: 'kledspace deploy',
    description: 'Deploy an application to a space',
    icon: FaLayerGroup
  },
  {
    name: 'kledspace list',
    description: 'List all available spaces',
    icon: FaLayerGroup
  }
];

export const getKpolicyCommands = (): CommandProps[] => [
  {
    name: 'kpolicy validate',
    description: 'Validate policies against a cluster',
    icon: FaShieldAlt
  },
  {
    name: 'kpolicy apply',
    description: 'Apply policies to a cluster',
    icon: FaShieldAlt
  },
  {
    name: 'kpolicy list',
    description: 'List all available policies',
    icon: FaShieldAlt
  }
];

export default SharedCommandInterface;
