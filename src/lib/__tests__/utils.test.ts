/**
 * Lib Utils Tests
 * @module lib/__tests__/utils.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (className merge)', () => {
  it('should merge single class', () => {
    expect(cn('px-4')).toBe('px-4');
  });

  it('should merge multiple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
  });

  it('should merge tailwind conflicts', () => {
    const result = cn('px-4', 'px-8');
    expect(result).toBe('px-8');
  });

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });

  it('should handle empty call', () => {
    expect(cn()).toBe('');
  });

  it('should handle array syntax', () => {
    expect(cn(['px-4', 'py-2'])).toBe('px-4 py-2');
  });

  it('should handle object syntax', () => {
    expect(cn({ 'bg-red-500': true, 'bg-blue-500': false })).toBe('bg-red-500');
  });
});
