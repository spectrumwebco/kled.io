
export type Platform = 'windows' | 'macos' | 'web' | 'ios' | 'android';

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;

  return /Android/.test(navigator.userAgent);
}

function isMobile(): boolean {
  return isIOS() || isAndroid();
}

export function getCurrentPlatform(): Platform {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    const platform = window.navigator.platform.toLowerCase();
    if (platform.includes('win')) return 'windows';
    if (platform.includes('mac')) return 'macos';
  }
  
  return 'web';
}

export function isMobilePlatform(): boolean {
  return isMobile();
}

export function isDesktopPlatform(): boolean {
  const platform = getCurrentPlatform();

  return platform === 'windows' || platform === 'macos';
}

export function isWebPlatform(): boolean {
  return getCurrentPlatform() === 'web';
}
