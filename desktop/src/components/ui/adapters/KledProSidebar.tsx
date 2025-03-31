import React from 'react';
import { Box, BoxProps, VStack, HStack, Text, Icon } from '@chakra-ui/react';

export interface KledProSidebarProps extends BoxProps {
  links?: Array<{
    icon: React.ElementType;
    label: string;
    href?: string;
    onClick?: () => void;
    isActive?: boolean;
  }>;
  secondaryLinks?: Array<{
    icon: React.ElementType;
    label: string;
    href?: string;
    onClick?: () => void;
    isActive?: boolean;
  }>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const KledProSidebar: React.FC<KledProSidebarProps> = ({
  links = [],
  secondaryLinks = [],
  collapsed = false,
  onToggleCollapse,
  ...props
}) => {
  return (
    <Box
      as="aside"
      h="100vh"
      w={collapsed ? "64px" : "240px"}
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      transition="width 0.2s ease-in-out"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
      {...props}
    >
      <VStack align="stretch" spacing={0} h="full">
        {/* Logo */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
          <HStack>
            <Box boxSize="32px" bg="blue.500" borderRadius="md" />
            {!collapsed && <Text fontWeight="bold">kCluster</Text>}
          </HStack>
        </Box>
        
        {/* Primary Links */}
        <VStack align="stretch" spacing={1} p={2} flex="1">
          {links.map((link, index) => (
            <HStack
              key={index}
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              bg={link.isActive ? "blue.50" : "transparent"}
              color={link.isActive ? "blue.600" : "gray.700"}
              _hover={{ bg: link.isActive ? "blue.50" : "gray.100" }}
              _dark={{
                bg: link.isActive ? "blue.900" : "transparent",
                color: link.isActive ? "blue.200" : "gray.200",
                _hover: { bg: link.isActive ? "blue.900" : "gray.700" },
              }}
              onClick={link.onClick}
            >
              <Icon as={link.icon} boxSize={5} />
              {!collapsed && <Text>{link.label}</Text>}
            </HStack>
          ))}
        </VStack>
        
        {/* Secondary Links */}
        {secondaryLinks.length > 0 && (
          <VStack align="stretch" spacing={1} p={2} borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
            {secondaryLinks.map((link, index) => (
              <HStack
                key={index}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                bg={link.isActive ? "blue.50" : "transparent"}
                color={link.isActive ? "blue.600" : "gray.700"}
                _hover={{ bg: link.isActive ? "blue.50" : "gray.100" }}
                _dark={{
                  bg: link.isActive ? "blue.900" : "transparent",
                  color: link.isActive ? "blue.200" : "gray.200",
                  _hover: { bg: link.isActive ? "blue.900" : "gray.700" },
                }}
                onClick={link.onClick}
              >
                <Icon as={link.icon} boxSize={5} />
                {!collapsed && <Text>{link.label}</Text>}
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
