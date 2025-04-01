import React from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Heading } from '@chakra-ui/react';
import { Command } from '../client/command';

interface CLIInterfaceNavProps {
  onInterfaceChange?: (cliType: 'kled' | 'kcluster' | 'kledspace' | 'kpolicy') => void;
}

/**
 * Navigation component for switching between different CLI interfaces
 * Supports all 4 CLI interfaces: kled, kcluster, kledspace, kpolicy
 */
export const CLIInterfaceNav: React.FC<CLIInterfaceNavProps> = ({ onInterfaceChange }) => {
  const handleTabChange = (index: number) => {
    const cliTypes: Array<'kled' | 'kcluster' | 'kledspace' | 'kpolicy'> = [
      'kled', 'kcluster', 'kledspace', 'kpolicy'
    ];
    
    if (onInterfaceChange && index >= 0 && index < cliTypes.length) {
      onInterfaceChange(cliTypes[index]);
    }
  };

  return (
    <Box mb={4}>
      <Heading size="md" mb={2}>CLI Interfaces</Heading>
      <Tabs variant="enclosed" onChange={handleTabChange}>
        <TabList>
          <Tab>Kled</Tab>
          <Tab>Cluster</Tab>
          <Tab>Space</Tab>
          <Tab>Policy</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box>
              <Heading size="sm" mb={2}>Kled Workspace Management</Heading>
              <p>Create and manage development workspaces</p>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading size="sm" mb={2}>Kubernetes Cluster Management</Heading>
              <p>Create, connect, and manage Kubernetes clusters</p>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading size="sm" mb={2}>Kled Space Management</Heading>
              <p>Initialize, deploy, and manage application spaces</p>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading size="sm" mb={2}>Kubernetes Policy Management</Heading>
              <p>Validate, apply, and manage Kubernetes policies</p>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CLIInterfaceNav;
