/**
 * Logger Tests
 * @module lib/__tests__/logger.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';
import { logger } from '../logger';

describe('logger', () => {
  it('should export logger object', () => {
    expect(logger).toBeDefined();
  });

  it('should have debug method', () => {
    expect(typeof logger.debug).toBe('function');
  });

  it('should have info method', () => {
    expect(typeof logger.info).toBe('function');
  });

  it('should have warn method', () => {
    expect(typeof logger.warn).toBe('function');
  });

  it('should have error method', () => {
    expect(typeof logger.error).toBe('function');
  });

  it('should not throw when called in test mode', () => {
    expect(() => logger.debug('test debug')).not.toThrow();
    expect(() => logger.info('test info')).not.toThrow();
    expect(() => logger.warn('test warn')).not.toThrow();
    expect(() => logger.error('test error')).not.toThrow();
  });

  it('should accept multiple arguments', () => {
    expect(() => logger.info('msg', { key: 'val' }, 42)).not.toThrow();
  });
});
