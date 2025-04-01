import React, { createContext, useContext, useMemo } from 'react';
import { getCurrentPlatform, Platform, isMobilePlatform, isDesktopPlatform, isWebPlatform } from '../../utils/platform';

interface PlatformContextType {
  platform: Platform;
  isMobile: boolean;
  isDesktop: boolean;
  isWeb: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => {
    const platform = getCurrentPlatform();
    return {
      platform,
      isMobile: isMobilePlatform(),
      isDesktop: isDesktopPlatform(),
      isWeb: isWebPlatform(),
    };
  }, []);

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
