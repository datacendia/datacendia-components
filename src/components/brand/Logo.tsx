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

  return (
    <img
      src="/logo.png"
      alt="Datacendia"
      height={height}
      style={{ height: `${height}px`, width: 'auto' }}
      className={className}
    />
  );
};

// Same logo for simple contexts
export const LogoSimple: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <img
      src="/logo.png"
      alt="Datacendia"
      height={size}
      style={{ height: `${size}px`, width: 'auto' }}
      className={className}
    />
  );
};

export default Logo;
