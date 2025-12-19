/**
 * Tests for retry utility with exponential backoff
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withRetry, isRetryableError } from '../utils';

describe('withRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return result on first successful attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const promise = withRetry(fn);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success');

    const promise = withRetry(fn, { maxAttempts: 3, initialDelay: 100 });
    
    // Fast-forward through all timers
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw error after max attempts', async () => {
    const error = new Error('Persistent failure');
    const fn = vi.fn().mockRejectedValue(error);

    const promise = withRetry(fn, { maxAttempts: 3, initialDelay: 100 });
    
    await vi.runAllTimersAsync();
    await expect(promise).rejects.toThrow('Persistent failure');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should respect shouldRetry function', async () => {
    const retryableError = new Error('Retryable');
    const nonRetryableError = new Error('Non-retryable');
    const fn = vi.fn().mockRejectedValue(nonRetryableError);

    const shouldRetry = (error: unknown) => {
      return error instanceof Error && error.message === 'Retryable';
    };

    const promise = withRetry(fn, { maxAttempts: 3, shouldRetry, initialDelay: 100 });
    
    await vi.runAllTimersAsync();
    await expect(promise).rejects.toThrow('Non-retryable');
    // Should only be called once because shouldRetry returns false
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry callback before each retry', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success');

    const onRetry = vi.fn();

    const promise = withRetry(fn, {
      maxAttempts: 3,
      initialDelay: 100,
      onRetry,
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error), 100);
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error), 200);
  });

  it('should use exponential backoff', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success');

    const onRetry = vi.fn();

    const promise = withRetry(fn, {
      maxAttempts: 3,
      initialDelay: 1000,
      backoffMultiplier: 2,
      onRetry,
    });

    await vi.runAllTimersAsync();
    await promise;

    // First retry after 1000ms, second retry after 2000ms
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error), 1000);
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error), 2000);
  });

  it('should respect maxDelay', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success');

    const onRetry = vi.fn();

    const promise = withRetry(fn, {
      maxAttempts: 3,
      initialDelay: 5000,
      maxDelay: 3000,
      backoffMultiplier: 2,
      onRetry,
    });

    await vi.runAllTimersAsync();
    await promise;

    // Delays should be capped at maxDelay (3000ms)
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error), 3000);
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error), 3000);
  });
});

describe('isRetryableError', () => {
  it('should return true for errors with isRetryable property set to true', () => {
    const error = { isRetryable: true };
    expect(isRetryableError(error)).toBe(true);
  });

  it('should return false for errors with isRetryable property set to false', () => {
    const error = { isRetryable: false };
    expect(isRetryableError(error)).toBe(false);
  });

  it('should return true for fetch TypeError errors', () => {
    const error = new TypeError('fetch failed');
    expect(isRetryableError(error)).toBe(true);
  });

  it('should return true for AbortError (timeout)', () => {
    const error = new Error('Timeout');
    error.name = 'AbortError';
    expect(isRetryableError(error)).toBe(true);
  });

  it('should return true for API errors with retryable codes', () => {
    const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT_ERROR', 'SERVER_ERROR', 'RATE_LIMIT_EXCEEDED'];
    
    retryableCodes.forEach((code) => {
      const error = { error: { code } };
      expect(isRetryableError(error)).toBe(true);
    });
  });

  it('should return false for API errors with non-retryable codes', () => {
    const error = { error: { code: 'AUTH_INVALID' } };
    expect(isRetryableError(error)).toBe(false);
  });

  it('should return false for unknown errors', () => {
    expect(isRetryableError(new Error('Unknown'))).toBe(false);
    expect(isRetryableError('string error')).toBe(false);
    expect(isRetryableError(null)).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });
});
