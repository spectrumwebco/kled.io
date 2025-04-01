import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export interface KledProCardProps extends BoxProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: string | number;
}

export const KledProCard: React.FC<KledProCardProps> = ({
  children,
  variant = 'default',
  padding = 4,
  ...props
}) => {
  return (
    <Box
      p={padding}
      borderRadius="md"
      boxShadow={variant === 'elevated' ? 'md' : 'none'}
      borderWidth={variant === 'outlined' ? '1px' : '0'}
      borderColor="gray.200"
      bg="white"
      _dark={{
        bg: 'gray.800',
        borderColor: 'gray.700',
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
