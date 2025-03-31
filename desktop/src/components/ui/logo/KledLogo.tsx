import React from 'react';
import { cn } from "@/lib/utils";

interface KledLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  size?: 'sm' | 'md' | 'lg';
}

const KledLogo: React.FC<KledLogoProps> = ({
  className,
  variant = 'color',
  size = 'md'
}) => {
  // Size mapping
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 }
  };

  // Color mapping based on variant
  const colors = {
    light: {
      primary: '#ffffff',
      secondary: '#f0f0f0',
      accent: '#e0e0e0',
      text: '#ffffff'
    },
    dark: {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#333333',
      text: '#000000'
    },
    color: {
      primary: '#3b82f6', // blue-500
      secondary: '#10b981', // emerald-500
      accent: '#6366f1', // indigo-500
      text: '#000000'
    }
  };

  const selectedColors = colors[variant];
  const { width, height } = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 3D Cube representing AI/GPU compute */}
        <g>
          {/* Front face */}
          <polygon
            points="12,16 32,28 32,52 12,40"
            fill={selectedColors.primary}
          />
          {/* Right face */}
          <polygon
            points="32,28 52,16 52,40 32,52"
            fill={selectedColors.secondary}
          />
          {/* Top face */}
          <polygon
            points="12,16 32,4 52,16 32,28"
            fill={selectedColors.accent}
          />
        </g>

        {/* Path showing GPU acceleration / neural network connection */}
        <path
          d="M16,34 C20,30 28,33 32,38 C36,43 44,46 48,42"
          stroke={selectedColors.accent}
          strokeWidth="1.5"
          strokeDasharray="2 1"
          fill="none"
        />
      </svg>
      <span
        className={cn(
          "text-xl font-bold tracking-tight",
          variant === 'light' && "text-white",
          variant === 'dark' && "text-black",
          variant === 'color' && "text-blue-600 dark:text-blue-400"
        )}
      >
        Kled.io
      </span>
    </div>
  );
};

export { KledLogo };
