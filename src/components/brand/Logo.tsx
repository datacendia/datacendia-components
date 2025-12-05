/**
 * DATACENDIA BRAND LOGO
 * Uses the official logo.png from public folder
 * Represents: Sovereign Intelligence, Deliberation, Lineage, Ethics
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

// Logo aspect ratio: 746x182 = ~4.1:1
const LOGO_ASPECT_RATIO = 746 / 182;

const sizes = {
  sm: { height: 32 },
  md: { height: 40 },
  lg: { height: 48 },
  xl: { height: 64 },
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
}) => {
  const { height } = sizes[size];
  const width = Math.round(height * LOGO_ASPECT_RATIO);

  return (
    <img
      src="/logo.png"
      alt="Datacendia"
      width={width}
      height={height}
      style={{ height: `${height}px`, width: `${width}px` }}
      className={className}
    />
  );
};

// Same logo for simple contexts
export const LogoSimple: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  const width = Math.round(size * LOGO_ASPECT_RATIO);
  return (
    <img
      src="/logo.png"
      alt="Datacendia"
      width={width}
      height={size}
      style={{ height: `${size}px`, width: `${width}px` }}
      className={className}
    />
  );
};

export default Logo;
