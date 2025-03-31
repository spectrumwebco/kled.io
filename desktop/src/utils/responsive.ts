import { usePlatform } from '../contexts/PlatformContext';

type ResponsiveSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveStyles {
  fontSize?: ResponsiveSize | Record<string, ResponsiveSize>;
  spacing?: number | Record<string, number>;
  padding?: number | Record<string, number>;
  margin?: number | Record<string, number>;
  [key: string]: any;
}

export function useResponsiveStyles(): {
  getResponsiveValue: <T>(value: T | Record<string, T>) => T;
  createResponsiveStyles: (styles: ResponsiveStyles) => Record<string, any>;
} {
  const { platform, isMobile } = usePlatform();
  
  const getResponsiveValue = <T>(value: T | Record<string, T>): T => {
    if (typeof value !== 'object' || value === null) {
      return value as T;
    }
    
    const isRecord = (val: any): val is Record<string, T> => 
      typeof val === 'object' && val !== null;
    
    if (!isRecord(value)) {
      return value;
    }
    
    if (platform in value) {
      return value[platform] as T;
    }
    
    if (isMobile && 'mobile' in value) {
      return value['mobile'] as T;
    }
    
    if (!isMobile && 'desktop' in value) {
      return value['desktop'] as T;
    }
    
    return (value['default'] as T) || (Object.values(value)[0] as T);
  };
  
  const createResponsiveStyles = (styles: ResponsiveStyles): Record<string, any> => {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(styles)) {
      result[key] = getResponsiveValue(value);
    }
    
    return result;
  };
  
  return {
    getResponsiveValue,
    createResponsiveStyles,
  };
}
