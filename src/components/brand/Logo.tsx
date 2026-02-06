/**
 * DATACENDIA BRAND LOGO
 * Minimalist text-based logo with spaced lettering
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  dark?: boolean;
}

// Logo aspect ratio for text version: 9:1
const LOGO_ASPECT_RATIO = 9;

const sizes = {
  sm: { height: 24, fontSize: 14 },
  md: { height: 32, fontSize: 18 },
  lg: { height: 40, fontSize: 22 },
  xl: { height: 56, fontSize: 28 },
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '', dark = true }) => {
  const { height, fontSize } = sizes[size];
  
  // Text-based logo matching the uploaded style
  return (
    <span
      className={className}
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: `${fontSize}px`,
        fontWeight: 300,
        letterSpacing: '0.35em',
        color: dark ? '#e8e4e0' : '#1a1a1a',
        display: 'inline-block',
        lineHeight: `${height}px`,
      }}
    >
      DATACENDIA
    </span>
  );
};

// Same logo for simple contexts
export const LogoSimple: React.FC<{ size?: number; className?: string; dark?: boolean }> = ({
  size = 40,
  className = '',
  dark = true,
}) => {
  const fontSize = Math.round(size * 0.55);
  return (
    <span
      className={className}
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: `${fontSize}px`,
        fontWeight: 300,
        letterSpacing: '0.35em',
        color: dark ? '#e8e4e0' : '#1a1a1a',
        display: 'inline-block',
        lineHeight: `${size}px`,
      }}
    >
      DATACENDIA
    </span>
  );
};

export default Logo;
