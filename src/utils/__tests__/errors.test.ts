/**
 * Error Utilities Tests
 * @module utils/__tests__/errors.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';
import { getErrorMessage, getErrorStack, isError, ensureError } from '../errors';

describe('getErrorMessage', () => {
  it('should extract message from Error', () => {
    expect(getErrorMessage(new Error('test error'))).toBe('test error');
  });

  it('should return string directly', () => {
    expect(getErrorMessage('string error')).toBe('string error');
  });

  it('should extract message from object with message property', () => {
    expect(getErrorMessage({ message: 'obj error' })).toBe('obj error');
  });

  it('should return default for unknown', () => {
    expect(getErrorMessage(42)).toBe('An unknown error occurred');
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
  });
});

describe('getErrorStack', () => {
  it('should return stack from Error', () => {
    const err = new Error('test');
    expect(getErrorStack(err)).toBeDefined();
    expect(typeof getErrorStack(err)).toBe('string');
  });

  it('should return undefined for non-Error', () => {
    expect(getErrorStack('string')).toBeUndefined();
    expect(getErrorStack(42)).toBeUndefined();
    expect(getErrorStack(null)).toBeUndefined();
  });
});

describe('isError', () => {
  it('should return true for Error instances', () => {
    expect(isError(new Error('test'))).toBe(true);
    expect(isError(new TypeError('type'))).toBe(true);
    expect(isError(new RangeError('range'))).toBe(true);
  });

  it('should return false for non-Error values', () => {
    expect(isError('string')).toBe(false);
    expect(isError(42)).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError({ message: 'not an error' })).toBe(false);
  });
});

describe('ensureError', () => {
  it('should return Error as-is', () => {
    const err = new Error('original');
    expect(ensureError(err)).toBe(err);
  });

  it('should wrap string in Error', () => {
    const result = ensureError('string error');
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('string error');
  });

  it('should wrap unknown in Error', () => {
    const result = ensureError(42);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('An unknown error occurred');
  });

  it('should wrap object with message in Error', () => {
    const result = ensureError({ message: 'obj msg' });
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('obj msg');
  });
});
