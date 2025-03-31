import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Routes } from '../../routes';

interface NavigationItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { label: 'Workspaces', route: Routes.WORKSPACES },
  { label: 'Providers', route: Routes.PROVIDERS },
  { label: 'Settings', route: Routes.SETTINGS },
];

export function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = 'white';
  const borderColor = 'gray.200';
  
  const isActive = (route: string) => {
    return location.pathname.startsWith(route);
  };
  
  return (
    <Flex 
      position="fixed" 
      bottom={0} 
      left={0} 
      right={0} 
      height="60px" 
      bg={bgColor} 
      borderTop="1px solid" 
      borderColor={borderColor}
      justifyContent="space-around"
      alignItems="center"
      zIndex={10}
    >
      {navigationItems.map((item) => (
        <Button
          key={item.route}
          variant="ghost"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="33%"
          borderRadius={0}
          color={isActive(item.route) ? 'blue.500' : 'gray.500'}
          onClick={() => navigate(item.route)}
          _hover={{ bg: 'transparent', color: 'blue.400' }}
        >
          {item.icon && <Box mb={1}>{item.icon}</Box>}
          <Text fontSize="xs">{item.label}</Text>
        </Button>
      ))}
    </Flex>
  );
}

export function MobileHeader({ title }: { title: string }) {
  const bgColor = 'white';
  const borderColor = 'gray.200';
  
  return (
    <Flex 
      position="fixed" 
      top={0} 
      left={0} 
      right={0} 
      height="60px" 
      bg={bgColor} 
      borderBottom="1px solid" 
      borderColor={borderColor}
      justifyContent="center"
      alignItems="center"
      zIndex={10}
      px={4}
    >
      <Text fontSize="lg" fontWeight="bold">{title}</Text>
    </Flex>
  );
}

export function MobileLayout({ 
  children, 
  title 
}: { 
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Box height="100vh" width="100%" position="relative">
      <MobileHeader title={title} />
      <Box 
        pt="60px" 
        pb="60px" 
        height="100%" 
        overflowY="auto"
        px={4}
      >
        {children}
      </Box>
      <MobileNavigation />
    </Box>
  );
}
