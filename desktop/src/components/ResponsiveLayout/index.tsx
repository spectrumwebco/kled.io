import React from 'react';
import { usePlatform } from '../../contexts/PlatformContext';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mobileComponent?: React.ReactNode;
  desktopComponent?: React.ReactNode;
}

export function ResponsiveLayout({ 
  children,
  mobileComponent,
  desktopComponent
}: ResponsiveLayoutProps) {
  const { isMobile, isDesktop } = usePlatform();
  
  if (isMobile && mobileComponent) {
    return <>{mobileComponent}</>;
  }
  
  if (isDesktop && desktopComponent) {
    return <>{desktopComponent}</>;
  }
  
  return <>{children}</>;
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  const { isMobile } = usePlatform();
  
  if (!isMobile) return null;
  
  return <>{children}</>;
}

export function DesktopOnly({ children }: { children: React.ReactNode }) {
  const { isDesktop } = usePlatform();
  
  if (!isDesktop) return null;
  
  return <>{children}</>;
}

export function WebOnly({ children }: { children: React.ReactNode }) {
  const { isWeb } = usePlatform();
  
  if (!isWeb) return null;
  
  return <>{children}</>;
}
