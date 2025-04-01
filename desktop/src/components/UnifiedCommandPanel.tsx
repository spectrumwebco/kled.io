import React, { useState } from 'react';
import { Box, Heading, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { 
  SharedCommandInterface, 
  getKledCommands, 
  getKclusterCommands, 
  getKledspaceCommands, 
  getKpolicyCommands 
} from './shared/SharedCommandInterface';
import { invoke } from '@tauri-apps/api/tauri';

interface UnifiedCommandPanelProps {
  currentCLIType: 'kled' | 'kcluster' | 'kledspace' | 'kpolicy';
}

/**
 * Unified command panel component that displays commands for all CLI interfaces
 * This component uses the shared command interface to provide a consistent UI
 * across desktop and web applications
 */
export const UnifiedCommandPanel: React.FC<UnifiedCommandPanelProps> = ({ 
  currentCLIType 
}) => {
  const [commandOutput, setCommandOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const executeCommand = async (commandName: string) => {
    setIsExecuting(true);
    setCommandOutput(`Executing: ${commandName}...`);
    
    try {
      const result = await invoke('execute_cli_command', { command: commandName });
      setCommandOutput(result as string);
    } catch (error) {
      setCommandOutput(`Error executing command: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const getCommandsForType = () => {
    switch (currentCLIType) {
      case 'kled':
        return getKledCommands();
      case 'kcluster':
        return getKclusterCommands();
      case 'kledspace':
        return getKledspaceCommands();
      case 'kpolicy':
        return getKpolicyCommands();
      default:
        return getKledCommands();
    }
  };

  const getTitleForType = () => {
    switch (currentCLIType) {
      case 'kled':
        return 'Kled Workspace Commands';
      case 'kcluster':
        return 'Kubernetes Cluster Commands';
      case 'kledspace':
        return 'Application Space Commands';
      case 'kpolicy':
        return 'Kubernetes Policy Commands';
      default:
        return 'CLI Commands';
    }
  };

  return (
    <Box className="unified-command-panel">
      <SharedCommandInterface
        title={getTitleForType()}
        commands={getCommandsForType()}
        onCommandSelect={executeCommand}
      />
      
      {/* Command output display */}
      <Box mt={4} p={3} borderWidth="1px" borderRadius="md" bg="gray.50" minHeight="150px">
        <Heading size="sm" mb={2}>Command Output</Heading>
        <Box 
          fontFamily="monospace" 
          whiteSpace="pre-wrap" 
          p={2} 
          bg="black" 
          color="green.300" 
          borderRadius="md"
          minHeight="100px"
          opacity={isExecuting ? 0.7 : 1}
        >
          {commandOutput || 'No command executed yet. Select a command above to execute it.'}
        </Box>
      </Box>
    </Box>
  );
};

export default UnifiedCommandPanel;
