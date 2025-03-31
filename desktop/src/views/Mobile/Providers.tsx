import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../routes';

export function MobileProviders() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setTimeout(() => {
          setProviders([
            { id: '1', name: 'AWS', status: 'Connected' },
            { id: '2', name: 'GCP', status: 'Disconnected' },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to load providers:', error);
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  const handleAddProvider = () => {
    navigate(`${Routes.PROVIDERS}/add`);
  };

  const handleProviderClick = (id: string) => {
    navigate(`${Routes.PROVIDERS}/${id}`);
  };

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Providers</Heading>
      
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
            onClick={handleAddProvider}
          >
            Add Provider
          </Button>
          
          <Box display="flex" flexDirection="column" gap={3}>
            {providers.length > 0 ? (
              providers.map((provider) => (
                <Box 
                  key={provider.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  onClick={() => handleProviderClick(provider.id)}
                >
                  <Text fontWeight="bold">{provider.name}</Text>
                  <Text fontSize="sm" color={provider.status === 'Connected' ? 'green.500' : 'gray.500'}>
                    {provider.status}
                  </Text>
                </Box>
              ))
            ) : (
              <Box p={4} borderWidth="1px" borderRadius="md" textAlign="center">
                <Text>No providers found</Text>
                <Text fontSize="sm" color="gray.500">Add your first provider to get started</Text>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
