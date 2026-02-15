// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUTH MIDDLEWARE SECURITY TESTS
// Critical path coverage for authentication middleware
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

// Mock dependencies before importing
vi.mock('../../config/index.js', () => ({
  config: {
    jwtSecret: 'test-secret-key-minimum-32-characters-long',
    nodeEnv: 'test',
  },
}));

vi.mock('../../config/database.js', () => ({
  prisma: {
    users: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../../config/redis.js', () => ({
  cache: {
    exists: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('jose', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jose')>();
  return {
    ...actual,
    jwtVerify: vi.fn(),
    SignJWT: vi.fn(() => ({
      setProtectedHeader: vi.fn().mockReturnThis(),
      setIssuedAt: vi.fn().mockReturnThis(),
      setExpirationTime: vi.fn().mockReturnThis(),
      sign: vi.fn().mockResolvedValue('mock-token'),
    })),
  };
});

import { authenticate, requireRole, optionalAuth } from '../../middleware/auth.js';
import { prisma } from '../../config/database.js';
import { cache } from '../../config/redis.js';
import * as jose from 'jose';

// =============================================================================
// TEST HELPERS
// =============================================================================

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    path: '/test',
    method: 'GET',
    ...overrides,
  } as Request;
}

function createMockResponse(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

function createMockNext(): NextFunction {
  return vi.fn();
}

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
  status: 'ACTIVE',
  organization_id: 'org-123',
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  preferences: {},
  organizations: {
    id: 'org-123',
    name: 'Test Org',
    slug: 'test-org',
  },
};

// =============================================================================
// AUTHENTICATE MIDDLEWARE TESTS
// =============================================================================

describe('authenticate middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject requests without authorization header', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
      message: 'No token provided',
    }));
  });

  it('should reject requests with malformed authorization header', async () => {
    const req = createMockRequest({
      headers: { authorization: 'InvalidFormat token123' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
    }));
  });

  it('should reject requests with empty Bearer token', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer ' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should reject blacklisted tokens', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: 'user-123', email: 'test@example.com', organizationId: 'org-123', role: 'admin' },
      protectedHeader: { alg: 'HS256' },
    } as any);
    vi.mocked(cache.exists).mockResolvedValue(true); // Token is blacklisted

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
      message: 'Token has been revoked',
    }));
  });

  it('should reject inactive users', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: 'user-123', email: 'test@example.com', organizationId: 'org-123', role: 'admin' },
      protectedHeader: { alg: 'HS256' },
    } as any);
    vi.mocked(cache.exists).mockResolvedValue(false);
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(prisma.users.findUnique).mockResolvedValue({
      ...mockUser,
      status: 'INACTIVE',
    } as any);

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
    }));
  });

  it('should reject deleted users', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: 'user-123', email: 'test@example.com', organizationId: 'org-123', role: 'admin' },
      protectedHeader: { alg: 'HS256' },
    } as any);
    vi.mocked(cache.exists).mockResolvedValue(false);
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(prisma.users.findUnique).mockResolvedValue({
      ...mockUser,
      deleted_at: new Date(),
    } as any);

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
    }));
  });

  it('should authenticate valid token with cached user', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: 'user-123', email: 'test@example.com', organizationId: 'org-123', role: 'admin' },
      protectedHeader: { alg: 'HS256' },
    } as any);
    vi.mocked(cache.exists).mockResolvedValue(false);
    vi.mocked(cache.get).mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      status: 'ACTIVE',
      organizationId: 'org-123',
    });

    await authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user?.id).toBe('user-123');
    expect(next).toHaveBeenCalledWith();
  });

  it('should authenticate valid token with database lookup', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: 'user-123', email: 'test@example.com', organizationId: 'org-123', role: 'admin' },
      protectedHeader: { alg: 'HS256' },
    } as any);
    vi.mocked(cache.exists).mockResolvedValue(false);
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(prisma.users.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(cache.set).mockResolvedValue(undefined);

    await authenticate(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user?.email).toBe('test@example.com');
    expect(cache.set).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it('should handle JWT verification errors', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer invalid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid token'));

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should reject user not found in database', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: 'user-123', email: 'test@example.com', organizationId: 'org-123', role: 'admin' },
      protectedHeader: { alg: 'HS256' },
    } as any);
    vi.mocked(cache.exists).mockResolvedValue(false);
    vi.mocked(cache.get).mockResolvedValue(null);
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);

    await authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
    }));
  });
});

// =============================================================================
// REQUIRE ROLE MIDDLEWARE TESTS
// =============================================================================

describe('requireRole middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access for users with required role', () => {
    const req = createMockRequest();
    req.user = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      status: 'ACTIVE',
      organizationId: 'org-123',
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: { id: 'org-123', name: 'Test Org', slug: 'test-org' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole('admin');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should allow access for users with any of multiple required roles', () => {
    const req = createMockRequest();
    req.user = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'analyst',
      status: 'ACTIVE',
      organizationId: 'org-123',
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: { id: 'org-123', name: 'Test Org', slug: 'test-org' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole('admin', 'analyst', 'operator');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should deny access for users without required role', () => {
    const req = createMockRequest();
    req.user = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'viewer',
      status: 'ACTIVE',
      organizationId: 'org-123',
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: { id: 'org-123', name: 'Test Org', slug: 'test-org' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole('admin');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 403,
    }));
  });

  it('should deny access when user is not authenticated', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    const middleware = requireRole('admin');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
    }));
  });
});

// =============================================================================
// OPTIONAL AUTH MIDDLEWARE TESTS
// =============================================================================

describe('optionalAuth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should continue without error when no token provided', async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    await optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('should continue without error when token is invalid', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer invalid-token' },
    });
    const res = createMockResponse();
    const next = createMockNext();

    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error('Invalid token'));

    await optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});
