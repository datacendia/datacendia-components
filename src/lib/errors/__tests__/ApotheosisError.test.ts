/**
 * Tests for ApotheosisError classes and utilities
 */

import { describe, it, expect } from 'vitest';
import {
  ApotheosisError,
  ApotheosisErrorCategory,
  ApotheosisErrorCode,
  ApotheosisNetworkError,
  ApotheosisTimeoutError,
  ApotheosisAuthError,
  ApotheosisServerError,
  ApotheosisRateLimitError,
  parseApiError,
} from '../ApotheosisError';

describe('ApotheosisError', () => {
  describe('Base ApotheosisError class', () => {
    it('should create an error with all required properties', () => {
      const error = new ApotheosisError(
        'Test error',
        ApotheosisErrorCode.UNKNOWN_ERROR,
        ApotheosisErrorCategory.UNKNOWN,
        false,
        { test: 'context' }
      );

      expect(error.message).toBe('Test error');
      expect(error.code).toBe(ApotheosisErrorCode.UNKNOWN_ERROR);
      expect(error.category).toBe(ApotheosisErrorCategory.UNKNOWN);
      expect(error.isRetryable).toBe(false);
      expect(error.context).toEqual({ test: 'context' });
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should serialize to JSON correctly', () => {
      const error = new ApotheosisError(
        'Test error',
        ApotheosisErrorCode.NETWORK_ERROR,
        ApotheosisErrorCategory.NETWORK,
        true
      );

      const json = error.toJSON();
      expect(json.name).toBe('ApotheosisError');
      expect(json.message).toBe('Test error');
      expect(json.code).toBe(ApotheosisErrorCode.NETWORK_ERROR);
      expect(json.category).toBe(ApotheosisErrorCategory.NETWORK);
      expect(json.isRetryable).toBe(true);
      expect(typeof json.timestamp).toBe('string');
    });
  });

  describe('ApotheosisNetworkError', () => {
    it('should create a network error with correct properties', () => {
      const error = new ApotheosisNetworkError('Network failed', { endpoint: '/test' });

      expect(error.message).toBe('Network failed');
      expect(error.code).toBe(ApotheosisErrorCode.NETWORK_ERROR);
      expect(error.category).toBe(ApotheosisErrorCategory.NETWORK);
      expect(error.isRetryable).toBe(true);
      expect(error.context).toEqual({ endpoint: '/test' });
    });
  });

  describe('ApotheosisTimeoutError', () => {
    it('should create a timeout error with correct properties', () => {
      const error = new ApotheosisTimeoutError('Request timed out');

      expect(error.message).toBe('Request timed out');
      expect(error.code).toBe(ApotheosisErrorCode.TIMEOUT_ERROR);
      expect(error.category).toBe(ApotheosisErrorCategory.TIMEOUT);
      expect(error.isRetryable).toBe(true);
    });
  });

  describe('ApotheosisAuthError', () => {
    it('should create an auth error with correct properties', () => {
      const error = new ApotheosisAuthError(
        'Token expired',
        ApotheosisErrorCode.AUTH_EXPIRED
      );

      expect(error.message).toBe('Token expired');
      expect(error.code).toBe(ApotheosisErrorCode.AUTH_EXPIRED);
      expect(error.category).toBe(ApotheosisErrorCategory.AUTHENTICATION);
      expect(error.isRetryable).toBe(false);
    });
  });

  describe('ApotheosisServerError', () => {
    it('should create a server error with correct properties', () => {
      const error = new ApotheosisServerError('Internal server error');

      expect(error.message).toBe('Internal server error');
      expect(error.code).toBe(ApotheosisErrorCode.SERVER_ERROR);
      expect(error.category).toBe(ApotheosisErrorCategory.SERVER);
      expect(error.isRetryable).toBe(true);
    });
  });

  describe('ApotheosisRateLimitError', () => {
    it('should create a rate limit error with retryAfter', () => {
      const error = new ApotheosisRateLimitError('Rate limit exceeded', 60);

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.code).toBe(ApotheosisErrorCode.RATE_LIMIT_EXCEEDED);
      expect(error.category).toBe(ApotheosisErrorCategory.SERVER);
      expect(error.isRetryable).toBe(true);
      expect(error.retryAfter).toBe(60);
    });
  });

  describe('parseApiError', () => {
    it('should parse fetch/network errors', () => {
      const fetchError = new TypeError('fetch failed');
      const error = parseApiError(fetchError, '/api/test');

      expect(error).toBeInstanceOf(ApotheosisNetworkError);
      expect(error.message).toContain('Network error');
      expect(error.message).toContain('/api/test');
      expect(error.isRetryable).toBe(true);
    });

    it('should parse timeout errors', () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'AbortError';
      const error = parseApiError(timeoutError, '/api/test');

      expect(error).toBeInstanceOf(ApotheosisTimeoutError);
      expect(error.message).toContain('timed out');
      expect(error.isRetryable).toBe(true);
    });

    it('should parse authentication errors', () => {
      const apiError = {
        error: { code: 'AUTH_EXPIRED', message: 'Session expired' },
      };
      const error = parseApiError(apiError, '/api/test');

      expect(error).toBeInstanceOf(ApotheosisAuthError);
      expect(error.code).toBe(ApotheosisErrorCode.AUTH_EXPIRED);
      expect(error.isRetryable).toBe(false);
    });

    it('should parse rate limit errors', () => {
      const apiError = {
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' },
      };
      const error = parseApiError(apiError, '/api/test');

      expect(error).toBeInstanceOf(ApotheosisRateLimitError);
      expect(error.isRetryable).toBe(true);
    });

    it('should parse server errors', () => {
      const apiError = {
        error: { code: 'SERVER_ERROR', message: 'Internal error' },
      };
      const error = parseApiError(apiError, '/api/test');

      expect(error).toBeInstanceOf(ApotheosisServerError);
      expect(error.isRetryable).toBe(true);
    });

    it('should handle unknown errors', () => {
      const error = parseApiError('Unknown error', '/api/test');

      expect(error).toBeInstanceOf(ApotheosisError);
      expect(error.code).toBe(ApotheosisErrorCode.UNKNOWN_ERROR);
      expect(error.message).toContain('Unknown error');
    });
  });
});
