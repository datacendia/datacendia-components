// @ts-nocheck
// =============================================================================
// DATACENDIA DESIGN SYSTEM - UTILITIES
// =============================================================================

import { theme } from './theme';
import { clsx, type ClassValue } from 'clsx';

// =============================================================================
// CLASS NAME UTILITIES
// =============================================================================

/**
 * Combines class names using clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Creates a class name from component name and modifiers
 */
export function cx(base: string, modifiers: Record<string, boolean | undefined>): string {
  const classes = [base];
  Object.entries(modifiers).forEach(([key, value]) => {
    if (value) {
      classes.push(`${base}--${key}`);
    }
  });
  return classes.join(' ');
}

// =============================================================================
// CSS-IN-JS HELPERS
// =============================================================================

/**
 * Converts spacing value to CSS
 */
export function spacing(value: number | string): string {
  if (typeof value === 'string') return value;
  const spacingValue = theme.spacing[value as keyof typeof theme.spacing];
  return spacingValue || `${value * 0.25}rem`;
}

/**
 * Gets color from theme
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  let result: any = theme.colors;
  for (const part of parts) {
    result = result?.[part];
  }
  return result || path;
}

/**
 * Creates CSS variables from theme
 */
export function createCSSVariables(): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Colors
  Object.entries(theme.colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'object') {
      Object.entries(colorValue).forEach(([shade, hex]) => {
        variables[`--color-${colorName}-${shade}`] = hex as string;
      });
    }
  });
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });
  
  // Typography
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value;
  });
  
  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables[`--radius-${key}`] = value;
  });
  
  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });
  
  return variables;
}

// =============================================================================
// COMPONENT STYLE GENERATORS
// =============================================================================

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';

export const buttonStyles = {
  base: 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
  
  sizes: {
    xs: 'h-7 px-2 text-xs rounded',
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-11 px-6 text-base rounded-lg',
    xl: 'h-12 px-8 text-lg rounded-lg',
  } as Record<ButtonSize, string>,
  
  variants: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-50 text-neutral-700 focus:ring-primary-500',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 focus:ring-primary-500',
    link: 'bg-transparent underline-offset-4 hover:underline text-primary-600 focus:ring-primary-500 p-0 h-auto',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  } as Record<ButtonVariant, string>,
};

type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const inputStyles = {
  base: 'w-full border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed',
  
  sizes: {
    xs: 'h-7 px-2 text-xs rounded',
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-3 text-sm rounded-md',
    lg: 'h-11 px-4 text-base rounded-lg',
    xl: 'h-12 px-4 text-lg rounded-lg',
  } as Record<InputSize, string>,
  
  invalid: 'border-red-500 focus:ring-red-500 focus:border-red-500',
};

type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type BadgeColorScheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeVariant = 'solid' | 'outline' | 'subtle';

export const badgeStyles = {
  base: 'inline-flex items-center font-medium rounded-full',
  
  sizes: {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
    xl: 'px-3.5 py-1 text-base',
  } as Record<BadgeSize, string>,
  
  variants: {
    solid: {
      primary: 'bg-primary-600 text-white',
      secondary: 'bg-secondary-600 text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-amber-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      neutral: 'bg-neutral-600 text-white',
    },
    outline: {
      primary: 'border border-primary-600 text-primary-600',
      secondary: 'border border-secondary-600 text-secondary-600',
      success: 'border border-green-500 text-green-600',
      warning: 'border border-amber-500 text-amber-600',
      error: 'border border-red-500 text-red-600',
      info: 'border border-blue-500 text-blue-600',
      neutral: 'border border-neutral-600 text-neutral-600',
    },
    subtle: {
      primary: 'bg-primary-100 text-primary-700',
      secondary: 'bg-secondary-100 text-secondary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-amber-100 text-amber-700',
      error: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      neutral: 'bg-neutral-100 text-neutral-700',
    },
  } as Record<BadgeVariant, Record<BadgeColorScheme, string>>,
};

// =============================================================================
// FORMAT UTILITIES
// =============================================================================

/**
 * Formats a number with commas and decimal places
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number as currency
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a number as a percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Formats bytes to human readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats a date relative to now
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats a date
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const d = new Date(date);
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'numeric', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
  };
  return d.toLocaleDateString('en-US', optionsMap[format]);
}

/**
 * Formats a date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return `${formatDate(d)} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

// =============================================================================
// ACCESSIBILITY UTILITIES
// =============================================================================

/**
 * Generates a unique ID for accessibility
 */
let idCounter = 0;
export function generateId(prefix: string = 'dc'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Traps focus within an element (for modals)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  firstFocusable?.focus();
  
  return () => element.removeEventListener('keydown', handleKeyDown);
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

export const validators = {
  required: (value: any) => (value !== undefined && value !== null && value !== ''),
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
  min: (min: number) => (value: number) => value >= min,
  max: (max: number) => (value: number) => value <= max,
  pattern: (regex: RegExp) => (value: string) => regex.test(value),
};

// =============================================================================
// DATA TRANSFORMATION UTILITIES
// =============================================================================

/**
 * Groups an array by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts an array by a key
 */
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttles a function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
