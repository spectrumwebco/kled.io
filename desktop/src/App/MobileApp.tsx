import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Spinner } from "@chakra-ui/react";
import { usePlatform } from "../contexts/PlatformContext";
import { KledProvider } from "../contexts";
import { Routes } from "../routes";
import { Outlet, useLocation } from "react-router-dom";
import { MobileLayout } from "../components/MobileNavigation";

export function MobileApp() {
  const { platform } = usePlatform();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.startsWith(Routes.WORKSPACES)) return "Workspaces";
    if (path.startsWith(Routes.PROVIDERS)) return "Providers";
    if (path.startsWith(Routes.SETTINGS)) return "Settings";
    
    return "Kled";
  };

  useEffect(() => {
    const initMobileServices = async () => {
      try {
        console.log(`Initializing mobile services for ${platform} platform`);
        
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to initialize mobile services:", error);
        setIsLoading(false);
      }
    };

    initMobileServices();
  }, [platform]);

  if (isLoading) {
    return (
      <Flex height="100vh" alignItems="center" justifyContent="center" direction="column" gap={4}>
        <Spinner size="xl" color="blue.500" />
        <Text>Loading Kled Mobile...</Text>
      </Flex>
    );
  }

  return (
    <KledProvider>
      <MobileLayout title={getPageTitle()}>
        <Outlet />
      </MobileLayout>
    </KledProvider>
  );
}
