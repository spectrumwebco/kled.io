import React from 'react';
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { usePlatform } from '../../contexts/PlatformContext';

export function MobileSettings() {
  const { platform } = usePlatform();
  
  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Settings</Heading>
      
      <Box>
        <Flex justify="space-between" align="center" mb={3}>
          <Box>
            <Text fontWeight="medium">Dark Mode</Text>
            <Text fontSize="sm" color="gray.500">Toggle dark mode appearance</Text>
          </Box>
          <Box as="button" bg="blue.500" w="40px" h="20px" borderRadius="full" />
        </Flex>
        <Box borderBottom="1px solid" borderColor="gray.200" mb={3} />
        
        <Flex justify="space-between" align="center" mb={3}>
          <Box>
            <Text fontWeight="medium">Notifications</Text>
            <Text fontSize="sm" color="gray.500">Enable push notifications</Text>
          </Box>
          <Box as="button" bg="blue.500" w="40px" h="20px" borderRadius="full" />
        </Flex>
        <Box borderBottom="1px solid" borderColor="gray.200" mb={3} />
        
        <Flex justify="space-between" align="center" mb={3}>
          <Box>
            <Text fontWeight="medium">Auto-Update</Text>
            <Text fontSize="sm" color="gray.500">Automatically update the app</Text>
          </Box>
          <Box as="button" bg="blue.500" w="40px" h="20px" borderRadius="full" />
        </Flex>
        <Box borderBottom="1px solid" borderColor="gray.200" mb={3} />
      </Box>
      
      <Box mt={6}>
        <Text fontSize="sm" color="gray.500">
          Kled {platform} v1.0.0
        </Text>
        <Text fontSize="xs" color="gray.400" mt={1}>
          © 2025 Spectrum Web Co.
        </Text>
      </Box>
    </Box>
  );
}
