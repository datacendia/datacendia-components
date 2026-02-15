// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SECURITY HEADERS TESTS
// Critical path coverage for security headers middleware
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

// Mock helmet
vi.mock('helmet', () => ({
  default: vi.fn(() => (_req: any, _res: any, next: any) => next()),
}));

// Mock crypto
vi.mock('crypto', () => ({
  default: {
    randomUUID: vi.fn(() => 'test-uuid-1234'),
  },
  randomUUID: vi.fn(() => 'test-uuid-1234'),
}));

import { customSecurityHeaders, strictCorsConfig } from '../../security/headers.js';

// =============================================================================
// TEST HELPERS
// =============================================================================

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    path: '/test',
    method: 'GET',
    headers: {},
    ...overrides,
  } as Request;
}

function createMockResponse(): Response & { headers: Record<string, string> } {
  const headers: Record<string, string> = {};
  const res = {
    headers,
    setHeader: vi.fn((name: string, value: string) => {
      headers[name] = value;
      return res;
    }),
    getHeader: vi.fn((name: string) => headers[name]),
  } as unknown as Response & { headers: Record<string, string> };
  return res;
}

function createMockNext(): NextFunction {
  return vi.fn();
}

// =============================================================================
// CUSTOM SECURITY HEADERS TESTS
// =============================================================================

describe('customSecurityHeaders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set Permissions-Policy header', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Permissions-Policy',
      expect.stringContaining('accelerometer=()')
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      'Permissions-Policy',
      expect.stringContaining('camera=()')
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      'Permissions-Policy',
      expect.stringContaining('microphone=()')
    );
  });

  it('should set cache control headers for API paths', () => {
    const req = createMockRequest({ path: '/api/v1/users' });
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    expect(res.setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
    expect(res.setHeader).toHaveBeenCalledWith('Expires', '0');
    expect(res.setHeader).toHaveBeenCalledWith('Surrogate-Control', 'no-store');
  });

  it('should not set cache control headers for non-API paths', () => {
    const req = createMockRequest({ path: '/static/image.png' });
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    const cacheControlCalls = (res.setHeader as any).mock.calls.filter(
      (call: any[]) => call[0] === 'Cache-Control'
    );
    expect(cacheControlCalls).toHaveLength(0);
  });

  it('should set Clear-Site-Data header on logout', () => {
    const req = createMockRequest({ 
      path: '/api/v1/auth/logout',
      method: 'POST'
    });
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Clear-Site-Data',
      '"cache", "cookies", "storage"'
    );
  });

  it('should not set Clear-Site-Data for non-logout paths', () => {
    const req = createMockRequest({ path: '/api/v1/users' });
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    const clearSiteDataCalls = (res.setHeader as any).mock.calls.filter(
      (call: any[]) => call[0] === 'Clear-Site-Data'
    );
    expect(clearSiteDataCalls).toHaveLength(0);
  });

  it('should use existing X-Request-Id if provided', () => {
    const req = createMockRequest({
      headers: { 'x-request-id': 'existing-request-id' }
    });
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'existing-request-id');
  });

  it('should generate X-Request-Id if not provided', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', 'test-uuid-1234');
  });

  it('should set X-Content-Type-Options header', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
  });

  it('should set X-Frame-Options header', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
  });

  it('should set X-XSS-Protection header', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
  });

  it('should call next()', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    customSecurityHeaders(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

// =============================================================================
// STRICT CORS CONFIG TESTS
// =============================================================================

describe('strictCorsConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('origin callback', () => {
    it('should allow requests with no origin', () => {
      const callback = vi.fn();
      strictCorsConfig.origin(undefined, callback);
      
      expect(callback).toHaveBeenCalledWith(null, true);
    });

    it('should allow origin in CORS_ORIGINS list', () => {
      process.env['CORS_ORIGINS'] = 'https://example.com,https://app.example.com';
      const callback = vi.fn();
      
      strictCorsConfig.origin('https://example.com', callback);
      
      expect(callback).toHaveBeenCalledWith(null, true);
    });

    it('should reject origin not in CORS_ORIGINS list', () => {
      process.env['CORS_ORIGINS'] = 'https://example.com';
      const callback = vi.fn();
      
      strictCorsConfig.origin('https://malicious.com', callback);
      
      expect(callback).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should reject all origins when CORS_ORIGINS is not set', () => {
      delete process.env['CORS_ORIGINS'];
      const callback = vi.fn();
      
      strictCorsConfig.origin('https://example.com', callback);
      
      expect(callback).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('should have credentials enabled', () => {
    expect(strictCorsConfig.credentials).toBe(true);
  });

  it('should allow standard HTTP methods', () => {
    expect(strictCorsConfig.methods).toContain('GET');
    expect(strictCorsConfig.methods).toContain('POST');
    expect(strictCorsConfig.methods).toContain('PUT');
    expect(strictCorsConfig.methods).toContain('PATCH');
    expect(strictCorsConfig.methods).toContain('DELETE');
    expect(strictCorsConfig.methods).toContain('OPTIONS');
  });

  it('should allow required headers', () => {
    expect(strictCorsConfig.allowedHeaders).toContain('Content-Type');
    expect(strictCorsConfig.allowedHeaders).toContain('Authorization');
    expect(strictCorsConfig.allowedHeaders).toContain('X-Request-ID');
    expect(strictCorsConfig.allowedHeaders).toContain('X-API-Key');
  });

  it('should expose rate limit headers', () => {
    expect(strictCorsConfig.exposedHeaders).toContain('X-RateLimit-Limit');
    expect(strictCorsConfig.exposedHeaders).toContain('X-RateLimit-Remaining');
    expect(strictCorsConfig.exposedHeaders).toContain('X-RateLimit-Reset');
    expect(strictCorsConfig.exposedHeaders).toContain('Retry-After');
  });

  it('should have appropriate maxAge for preflight caching', () => {
    expect(strictCorsConfig.maxAge).toBe(600); // 10 minutes
  });

  it('should use 204 for OPTIONS success status', () => {
    expect(strictCorsConfig.optionsSuccessStatus).toBe(204);
  });
});
