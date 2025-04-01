import React from 'react';
import { Box, Text, Button, Heading, Flex, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../routes';
import { usePlatform } from '../../contexts/PlatformContext';

export function MobileHome() {
  const navigate = useNavigate();
  const { platform } = usePlatform();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNavigate = (route: string) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(route);
      setIsLoading(false);
    }, 300);
  };

  return (
    <Box p={4}>
      <Heading size="md">Welcome to Kled Mobile</Heading>
      <Text>Platform: {platform}</Text>
      
      {isLoading ? (
        <Flex justify="center" pt={8}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <Box mt={4}>
          <Box display="flex" flexDirection="column" gap={4}>
          <Button 
            colorScheme="blue" 
            width="100%" 
            height="60px"
            onClick={() => handleNavigate(Routes.WORKSPACES)}
          >
            Workspaces
          </Button>
          
          <Button 
            colorScheme="gray" 
            width="100%" 
            height="60px"
            onClick={() => handleNavigate(Routes.PROVIDERS)}
          >
            Providers
          </Button>
          
          <Button 
            colorScheme="gray" 
            width="100%" 
            height="60px"
            onClick={() => handleNavigate(Routes.SETTINGS)}
          >
            Settings
          </Button>
        </Box>
        </Box>
      )}
      
      <Box marginTop={6}>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Kled Mobile {platform} Edition
        </Text>
      </Box>
    </Box>
  );
}
