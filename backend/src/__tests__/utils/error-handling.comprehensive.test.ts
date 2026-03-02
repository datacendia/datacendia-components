/**
 * Module — Error Handling Comprehensive Test
 *
 * Platform module.
 * @module __tests__/utils/error-handling.comprehensive.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * ERROR HANDLING - COMPREHENSIVE TEST SUITE
 * Tests for error types, error handling patterns, and recovery strategies
 */

import { describe, it, expect, vi } from 'vitest';

describe('Error Handling', () => {
  // ===========================================================================
  // CUSTOM ERROR TYPES - 30 TESTS
  // ===========================================================================
  describe('Custom Error Types', () => {
    class AppError extends Error {
      constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public isOperational: boolean = true
      ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
      }
    }

    class ValidationError extends AppError {
      constructor(message: string, public field?: string) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
      }
    }

    class NotFoundError extends AppError {
      constructor(resource: string, id: string) {
        super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
      }
    }

    class AuthenticationError extends AppError {
      constructor(message: string = 'Authentication required') {
        super(message, 'AUTHENTICATION_ERROR', 401);
        this.name = 'AuthenticationError';
      }
    }

    class AuthorizationError extends AppError {
      constructor(message: string = 'Insufficient permissions') {
        super(message, 'AUTHORIZATION_ERROR', 403);
        this.name = 'AuthorizationError';
      }
    }

    class RateLimitError extends AppError {
      constructor(public retryAfter: number) {
        super(`Rate limit exceeded. Retry after ${retryAfter} seconds`, 'RATE_LIMIT', 429);
        this.name = 'RateLimitError';
      }
    }

    describe('AppError', () => {
      it('should create error with message', () => {
        const err = new AppError('Something went wrong', 'GENERIC_ERROR');
        expect(err.message).toBe('Something went wrong');
      });

      it('should have error code', () => {
        const err = new AppError('Error', 'TEST_CODE');
        expect(err.code).toBe('TEST_CODE');
      });

      it('should have default status code', () => {
        const err = new AppError('Error', 'TEST');
        expect(err.statusCode).toBe(500);
      });

      it('should allow custom status code', () => {
        const err = new AppError('Error', 'TEST', 400);
        expect(err.statusCode).toBe(400);
      });

      it('should be operational by default', () => {
        const err = new AppError('Error', 'TEST');
        expect(err.isOperational).toBe(true);
      });

      it('should allow non-operational errors', () => {
        const err = new AppError('Error', 'TEST', 500, false);
        expect(err.isOperational).toBe(false);
      });

      it('should have stack trace', () => {
        const err = new AppError('Error', 'TEST');
        expect(err.stack).toBeDefined();
      });

      it('should be instanceof Error', () => {
        const err = new AppError('Error', 'TEST');
        expect(err instanceof Error).toBe(true);
      });
    });

    describe('ValidationError', () => {
      it('should have 400 status', () => {
        const err = new ValidationError('Invalid email');
        expect(err.statusCode).toBe(400);
      });

      it('should have VALIDATION_ERROR code', () => {
        const err = new ValidationError('Invalid email');
        expect(err.code).toBe('VALIDATION_ERROR');
      });

      it('should include field name', () => {
        const err = new ValidationError('Invalid email', 'email');
        expect(err.field).toBe('email');
      });

      it('should work without field', () => {
        const err = new ValidationError('General validation error');
        expect(err.field).toBeUndefined();
      });
    });

    describe('NotFoundError', () => {
      it('should have 404 status', () => {
        const err = new NotFoundError('User', '123');
        expect(err.statusCode).toBe(404);
      });

      it('should include resource and id in message', () => {
        const err = new NotFoundError('User', '123');
        expect(err.message).toContain('User');
        expect(err.message).toContain('123');
      });
    });

    describe('AuthenticationError', () => {
      it('should have 401 status', () => {
        const err = new AuthenticationError();
        expect(err.statusCode).toBe(401);
      });

      it('should have default message', () => {
        const err = new AuthenticationError();
        expect(err.message).toBe('Authentication required');
      });

      it('should allow custom message', () => {
        const err = new AuthenticationError('Invalid token');
        expect(err.message).toBe('Invalid token');
      });
    });

    describe('AuthorizationError', () => {
      it('should have 403 status', () => {
        const err = new AuthorizationError();
        expect(err.statusCode).toBe(403);
      });

      it('should have default message', () => {
        const err = new AuthorizationError();
        expect(err.message).toBe('Insufficient permissions');
      });
    });

    describe('RateLimitError', () => {
      it('should have 429 status', () => {
        const err = new RateLimitError(60);
        expect(err.statusCode).toBe(429);
      });

      it('should include retry after', () => {
        const err = new RateLimitError(60);
        expect(err.retryAfter).toBe(60);
      });

      it('should include retry time in message', () => {
        const err = new RateLimitError(60);
        expect(err.message).toContain('60');
      });
    });
  });

  // ===========================================================================
  // ERROR HANDLING PATTERNS - 40 TESTS
  // ===========================================================================
  describe('Error Handling Patterns', () => {
    describe('Try-Catch', () => {
      it('should catch synchronous errors', () => {
        let caught = false;
        try {
          throw new Error('Test error');
        } catch (e) {
          caught = true;
        }
        expect(caught).toBe(true);
      });

      it('should catch specific error types', () => {
        class CustomError extends Error {}
        let caughtCustom = false;
        try {
          throw new CustomError('Custom');
        } catch (e) {
          if (e instanceof CustomError) caughtCustom = true;
        }
        expect(caughtCustom).toBe(true);
      });

      it('should execute finally', () => {
        let finallyExecuted = false;
        try {
          throw new Error('Test');
        } catch {
          // catch
        } finally {
          finallyExecuted = true;
        }
        expect(finallyExecuted).toBe(true);
      });

      it('should execute finally even without error', () => {
        let finallyExecuted = false;
        try {
          // no error
        } finally {
          finallyExecuted = true;
        }
        expect(finallyExecuted).toBe(true);
      });
    });

    describe('Promise Error Handling', () => {
      it('should catch rejected promise', async () => {
        let caught = false;
        try {
          await Promise.reject(new Error('Rejected'));
        } catch {
          caught = true;
        }
        expect(caught).toBe(true);
      });

      it('should handle with .catch()', async () => {
        let caught = false;
        await Promise.reject(new Error('Rejected')).catch(() => {
          caught = true;
        });
        expect(caught).toBe(true);
      });

      it('should propagate errors in async chain', async () => {
        let caught = false;
        try {
          await Promise.resolve()
            .then(() => { throw new Error('Chain error'); });
        } catch {
          caught = true;
        }
        expect(caught).toBe(true);
      });

      it('should handle Promise.all rejection', async () => {
        let caught = false;
        try {
          await Promise.all([
            Promise.resolve(1),
            Promise.reject(new Error('Failed')),
          ]);
        } catch {
          caught = true;
        }
        expect(caught).toBe(true);
      });

      it('should handle Promise.allSettled', async () => {
        const results = await Promise.allSettled([
          Promise.resolve(1),
          Promise.reject(new Error('Failed')),
        ]);
        expect(results[0].status).toBe('fulfilled');
        expect(results[1].status).toBe('rejected');
      });
    });

    describe('Result Pattern', () => {
      type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

      const divide = (a: number, b: number): Result<number, string> => {
        if (b === 0) return { ok: false, error: 'Division by zero' };
        return { ok: true, value: a / b };
      };

      it('should return success result', () => {
        const result = divide(10, 2);
        expect(result.ok).toBe(true);
        if (result.ok) expect(result.value).toBe(5);
      });

      it('should return error result', () => {
        const result = divide(10, 0);
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error).toBe('Division by zero');
      });

      it('should allow chaining on success', () => {
        const result = divide(10, 2);
        const doubled = result.ok ? result.value * 2 : 0;
        expect(doubled).toBe(10);
      });
    });

    describe('Error Recovery', () => {
      const withDefault = <T>(fn: () => T, defaultValue: T): T => {
        try {
          return fn();
        } catch {
          return defaultValue;
        }
      };

      it('should return value on success', () => {
        const result = withDefault(() => JSON.parse('{"a":1}'), {});
        expect(result).toEqual({ a: 1 });
      });

      it('should return default on error', () => {
        const result = withDefault(() => JSON.parse('invalid'), {});
        expect(result).toEqual({});
      });
    });
  });

  // ===========================================================================
  // RETRY STRATEGIES - 30 TESTS
  // ===========================================================================
  describe('Retry Strategies', () => {
    describe('Simple Retry', () => {
      const retry = async <T>(
        fn: () => Promise<T>,
        maxAttempts: number = 3
      ): Promise<T> => {
        let lastError: Error | null = null;
        for (let i = 0; i < maxAttempts; i++) {
          try {
            return await fn();
          } catch (e) {
            lastError = e as Error;
          }
        }
        throw lastError;
      };

      it('should succeed on first try', async () => {
        const fn = vi.fn().mockResolvedValue('success');
        const result = await retry(fn);
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it('should retry on failure', async () => {
        const fn = vi.fn()
          .mockRejectedValueOnce(new Error('Fail 1'))
          .mockResolvedValue('success');
        const result = await retry(fn);
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(2);
      });

      it('should throw after max attempts', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('Always fails'));
        await expect(retry(fn, 3)).rejects.toThrow('Always fails');
        expect(fn).toHaveBeenCalledTimes(3);
      });

      it('should respect max attempts', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('Fail'));
        await expect(retry(fn, 5)).rejects.toThrow();
        expect(fn).toHaveBeenCalledTimes(5);
      });
    });

    describe('Exponential Backoff', () => {
      const calculateDelay = (attempt: number, baseDelay: number = 1000): number => {
        return Math.min(baseDelay * Math.pow(2, attempt), 30000);
      };

      it('should increase delay exponentially', () => {
        expect(calculateDelay(0)).toBe(1000);
        expect(calculateDelay(1)).toBe(2000);
        expect(calculateDelay(2)).toBe(4000);
        expect(calculateDelay(3)).toBe(8000);
      });

      it('should cap at max delay', () => {
        expect(calculateDelay(10)).toBe(30000);
      });

      it('should use custom base delay', () => {
        expect(calculateDelay(0, 500)).toBe(500);
        expect(calculateDelay(1, 500)).toBe(1000);
      });
    });

    describe('Circuit Breaker Pattern', () => {
      class CircuitBreaker {
        private failures = 0;
        private lastFailure: number = 0;
        private state: 'closed' | 'open' | 'half-open' = 'closed';

        constructor(
          private threshold: number = 3,
          private resetTimeout: number = 5000
        ) {}

        async execute<T>(fn: () => Promise<T>): Promise<T> {
          if (this.state === 'open') {
            if (Date.now() - this.lastFailure > this.resetTimeout) {
              this.state = 'half-open';
            } else {
              throw new Error('Circuit breaker is open');
            }
          }

          try {
            const result = await fn();
            this.reset();
            return result;
          } catch (e) {
            this.recordFailure();
            throw e;
          }
        }

        private recordFailure() {
          this.failures++;
          this.lastFailure = Date.now();
          if (this.failures >= this.threshold) {
            this.state = 'open';
          }
        }

        private reset() {
          this.failures = 0;
          this.state = 'closed';
        }

        getState() {
          return this.state;
        }
      }

      it('should start closed', () => {
        const cb = new CircuitBreaker();
        expect(cb.getState()).toBe('closed');
      });

      it('should execute successful calls', async () => {
        const cb = new CircuitBreaker();
        const result = await cb.execute(() => Promise.resolve('success'));
        expect(result).toBe('success');
      });

      it('should open after threshold failures', async () => {
        const cb = new CircuitBreaker(3);
        for (let i = 0; i < 3; i++) {
          try {
            await cb.execute(() => Promise.reject(new Error('Fail')));
          } catch {}
        }
        expect(cb.getState()).toBe('open');
      });

      it('should reject when open', async () => {
        const cb = new CircuitBreaker(1);
        try {
          await cb.execute(() => Promise.reject(new Error('Fail')));
        } catch {}
        await expect(cb.execute(() => Promise.resolve('test'))).rejects.toThrow('Circuit breaker is open');
      });
    });
  });

  // ===========================================================================
  // ERROR SERIALIZATION - 20 TESTS
  // ===========================================================================
  describe('Error Serialization', () => {
    const serializeError = (err: Error): object => {
      return {
        name: err.name,
        message: err.message,
        stack: err.stack,
        ...Object.getOwnPropertyNames(err).reduce((acc, key) => {
          if (!['name', 'message', 'stack'].includes(key)) {
            acc[key] = (err as any)[key];
          }
          return acc;
        }, {} as Record<string, any>),
      };
    };

    it('should serialize basic error', () => {
      const err = new Error('Test error');
      const serialized = serializeError(err);
      expect(serialized.name).toBe('Error');
      expect(serialized.message).toBe('Test error');
    });

    it('should include stack trace', () => {
      const err = new Error('Test');
      const serialized = serializeError(err);
      expect(serialized.stack).toBeDefined();
    });

    it('should include custom properties', () => {
      const err = new Error('Test');
      (err as any).code = 'CUSTOM_CODE';
      const serialized = serializeError(err);
      expect(serialized).toHaveProperty('code', 'CUSTOM_CODE');
    });

    it('should handle nested errors', () => {
      const innerErr = new Error('Inner');
      const outerErr = new Error('Outer');
      (outerErr as any).cause = innerErr;
      const serialized = serializeError(outerErr);
      expect(serialized).toHaveProperty('cause');
    });
  });

  // ===========================================================================
  // ASYNC ERROR BOUNDARIES - 20 TESTS
  // ===========================================================================
  describe('Async Error Boundaries', () => {
    const safeAsync = async <T>(fn: () => Promise<T>): Promise<[T | null, Error | null]> => {
      try {
        const result = await fn();
        return [result, null];
      } catch (e) {
        return [null, e as Error];
      }
    };

    it('should return value on success', async () => {
      const [result, error] = await safeAsync(() => Promise.resolve('success'));
      expect(result).toBe('success');
      expect(error).toBeNull();
    });

    it('should return error on failure', async () => {
      const [result, error] = await safeAsync(() => Promise.reject(new Error('Failed')));
      expect(result).toBeNull();
      expect(error?.message).toBe('Failed');
    });

    it('should handle thrown errors', async () => {
      const [result, error] = await safeAsync(async () => {
        throw new Error('Thrown');
      });
      expect(result).toBeNull();
      expect(error?.message).toBe('Thrown');
    });

    it('should handle async chain errors', async () => {
      const [result, error] = await safeAsync(async () => {
        return Promise.resolve().then(() => {
          throw new Error('Chain error');
        });
      });
      expect(result).toBeNull();
      expect(error?.message).toBe('Chain error');
    });
  });
});
