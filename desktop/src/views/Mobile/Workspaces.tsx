import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../routes';

export function MobileWorkspaces() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        setTimeout(() => {
          setWorkspaces([
            { id: '1', name: 'Workspace 1', status: 'Running' },
            { id: '2', name: 'Workspace 2', status: 'Stopped' },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to load workspaces:', error);
        setIsLoading(false);
      }
    };

    loadWorkspaces();
  }, []);

  const handleCreateWorkspace = () => {
    navigate(`${Routes.WORKSPACES}/create`);
  };

  const handleWorkspaceClick = (id: string) => {
    navigate(`${Routes.WORKSPACES}/${id}`);
  };

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Workspaces</Heading>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={8}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <>
          <Button 
            colorScheme="blue" 
            width="100%" 
            mb={4}
            onClick={handleCreateWorkspace}
          >
            Create Workspace
          </Button>
          
          <Box display="flex" flexDirection="column" gap={3}>
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <Box 
                  key={workspace.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  onClick={() => handleWorkspaceClick(workspace.id)}
                >
                  <Text fontWeight="bold">{workspace.name}</Text>
                  <Text fontSize="sm" color={workspace.status === 'Running' ? 'green.500' : 'gray.500'}>
                    {workspace.status}
                  </Text>
                </Box>
              ))
            ) : (
              <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                <Text>No workspaces found</Text>
                <Text fontSize="sm" color="gray.500">Create your first workspace to get started</Text>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
