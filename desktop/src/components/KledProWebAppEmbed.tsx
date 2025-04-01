import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { App as KledProApp } from '../../../../kled-pro/frontend/src/App';

interface KledProWebAppEmbedProps {
  isVisible: boolean;
}

/**
 * Component that embeds the kled-pro web app into the desktop application
 * This allows sharing UI components between web and desktop platforms
 */
export const KledProWebAppEmbed: React.FC<KledProWebAppEmbedProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <Box className="kled-pro-embed">
      <Heading size="md" mb={4}>kCluster Management</Heading>
      <Text mb={4}>Integrated kCluster management interface from kled-pro web app</Text>
      
      {/* Embed the kled-pro App component */}
      <Box className="kled-pro-app-container">
        <KledProApp />
      </Box>
    </Box>
  );
};

export default KledProWebAppEmbed;
