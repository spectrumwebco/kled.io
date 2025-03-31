import React from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export interface KledProButtonProps extends ChakraButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const KledProButton: React.FC<KledProButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  return (
    <ChakraButton
      colorScheme={variant === 'primary' ? 'blue' : 'gray'}
      variant={variant === 'outline' ? 'outline' : variant === 'ghost' ? 'ghost' : 'solid'}
      size={size}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};
