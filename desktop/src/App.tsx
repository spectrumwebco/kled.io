import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Flex, Heading, Text, Button, VStack, HStack, useToast } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/tauri';
import CLIInterfaceNav from './components/CLIInterfaceNav';

function App() {
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [currentCLIType, setCurrentCLIType] = useState<'kled' | 'kcluster' | 'kledspace' | 'kpolicy'>('kled');
  const toast = useToast();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const workspaceList = await invoke<string[]>('get_workspaces');
      setWorkspaces(workspaceList);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workspaces',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      toast({
        title: 'Error',
        description: 'Workspace name cannot be empty',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await invoke('create_workspace', { name: newWorkspaceName });
      setNewWorkspaceName('');
      loadWorkspaces();
      toast({
        title: 'Success',
        description: `Workspace "${newWorkspaceName}" created`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast({
        title: 'Error',
        description: `Failed to create workspace: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCLIInterfaceChange = (cliType: 'kled' | 'kcluster' | 'kledspace' | 'kpolicy') => {
    setCurrentCLIType(cliType);
    if (cliType === 'kled') {
      loadWorkspaces();
    }
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={6}>Kled Command Center</Heading>
        
        {/* CLI Interface Navigation */}
        <CLIInterfaceNav onInterfaceChange={handleCLIInterfaceChange} />
        
        {/* Conditional rendering based on selected CLI interface */}
        {currentCLIType === 'kled' && (
          <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
            <Box flex={1}>
              <Heading size="md" mb={4}>Workspaces</Heading>
              <VStack align="stretch" spacing={4}>
                {workspaces.length > 0 ? (
                  workspaces.map((workspace) => (
                    <Box 
                      key={workspace} 
                      p={4} 
                      borderWidth={1} 
                      borderRadius="md" 
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Text fontWeight="bold">{workspace}</Text>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500">No workspaces found</Text>
                )}
              </VStack>
            </Box>
            
            <Box flex={1}>
              <Heading size="md" mb={4}>Create Workspace</Heading>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Enter workspace name"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0'
                    }}
                  />
                </Box>
                <Button colorScheme="blue" onClick={createWorkspace}>
                  Create Workspace
                </Button>
              </VStack>
            </Box>
          </Flex>
        )}
        
        {currentCLIType === 'kcluster' && (
          <Box>
            <Heading size="md" mb={4}>Kubernetes Cluster Management</Heading>
            <Text mb={4}>Interface for managing Kubernetes clusters using kcluster commands</Text>
            {/* Import KledProWebAppEmbed component when TypeScript dependencies are resolved */}
            {/* <KledProWebAppEmbed isVisible={true} /> */}
            <Box p={4} borderWidth={1} borderRadius="md">
              <Heading size="sm" mb={2}>kCluster Features</Heading>
              <Text>• Create and manage Kubernetes clusters</Text>
              <Text>• Connect to existing clusters</Text>
              <Text>• Monitor cluster health and resources</Text>
              <Text>• Manage cluster access and permissions</Text>
            </Box>
          </Box>
        )}
        
        {currentCLIType === 'kledspace' && (
          <Box>
            <Heading size="md" mb={4}>Kled Space Management</Heading>
            <Text>Interface for managing application spaces using kledspace commands</Text>
            {/* Add space management UI components here */}
          </Box>
        )}
        
        {currentCLIType === 'kpolicy' && (
          <Box>
            <Heading size="md" mb={4}>Kubernetes Policy Management</Heading>
            <Text>Interface for managing Kubernetes policies using kpolicy commands</Text>
            {/* Add policy management UI components here */}
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;
