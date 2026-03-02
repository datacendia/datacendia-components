/**
 * Module — Keycloak Auth Test
 *
 * Platform module.
 * @module __tests__/security/KeycloakAuth.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// KEYCLOAK AUTH TESTS
// Critical path coverage for Keycloak authentication
// =============================================================================

import { describe, it, expect, vi } from 'vitest';
import {
  initKeycloak,
  getSessionMiddleware,
  protect,
  optionalAuth,
  hasRole,
  canVeto,
  canAccessCouncil,
  getOrgId,
  getKeycloak,
  type AuthenticatedRequest,
  type KeycloakUser,
} from '../../security/KeycloakAuth.js';

// =============================================================================
// KEYCLOAK INITIALIZATION TESTS
// =============================================================================

describe('KeycloakAuth', () => {
  describe('initKeycloak', () => {
    it('should initialize Keycloak instance', () => {
      const kc = initKeycloak();
      expect(kc).toBeDefined();
    });

    it('should return same instance on multiple calls', () => {
      const kc1 = initKeycloak();
      const kc2 = initKeycloak();
      expect(kc1).toBe(kc2);
    });
  });

  describe('getKeycloak', () => {
    it('should return Keycloak instance', () => {
      const kc = getKeycloak();
      expect(kc).toBeDefined();
    });
  });

  describe('getSessionMiddleware', () => {
    it('should return session middleware function', () => {
      const middleware = getSessionMiddleware();
      expect(typeof middleware).toBe('function');
    });
  });

  // ===========================================================================
  // PROTECT MIDDLEWARE TESTS
  // ===========================================================================

  describe('protect', () => {
    function createMockReq(options: {
      bypassAuth?: boolean;
      authHeader?: string;
      keycloakUser?: KeycloakUser;
    } = {}): AuthenticatedRequest {
      const req: any = {
        headers: {},
      };

      if (options.bypassAuth) {
        req.headers['x-bypass-auth'] = 'true';
      }

      if (options.authHeader) {
        req.headers.authorization = options.authHeader;
      }

      if (options.keycloakUser) {
        req.keycloakUser = options.keycloakUser;
      }

      return req;
    }

    function createMockRes(): any {
      const res: any = {
        statusCode: 200,
        jsonData: null,
        status: function(code: number) {
          this.statusCode = code;
          return this;
        },
        json: function(data: any) {
          this.jsonData = data;
          return this;
        },
      };
      return res;
    }

    it('should allow bypass in development mode', async () => {
      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      const req = createMockReq({ bypassAuth: true });
      const res = createMockRes();
      const next = vi.fn();

      const middleware = protect();
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.keycloakUser).toBeDefined();
      expect(req.keycloakUser?.roles).toContain('admin');

      process.env['NODE_ENV'] = originalEnv;
    });

    it('should reject request without bearer token', async () => {
      const req = createMockReq();
      const res = createMockRes();
      const next = vi.fn();

      const middleware = protect();
      await middleware(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res.jsonData?.error?.code).toBe('UNAUTHORIZED');
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid auth header format', async () => {
      const req = createMockReq({ authHeader: 'Basic abc123' });
      const res = createMockRes();
      const next = vi.fn();

      const middleware = protect();
      await middleware(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res.jsonData?.error?.message).toContain('No bearer token');
    });

    it('should return protect middleware for specific role', () => {
      const middleware = protect('admin');
      expect(typeof middleware).toBe('function');
    });

    it('should return protect middleware for multiple roles', () => {
      const middleware = protect(['admin', 'analyst']);
      expect(typeof middleware).toBe('function');
    });
  });

  // ===========================================================================
  // OPTIONAL AUTH MIDDLEWARE TESTS
  // ===========================================================================

  describe('optionalAuth', () => {
    function createMockReq(authHeader?: string): AuthenticatedRequest {
      const req: any = {
        headers: {},
      };

      if (authHeader) {
        req.headers.authorization = authHeader;
      }

      return req;
    }

    function createMockRes(): any {
      return {
        statusCode: 200,
        status: function(code: number) {
          this.statusCode = code;
          return this;
        },
        json: function(_data: any) {
          return this;
        },
      };
    }

    it('should continue without token', async () => {
      const req = createMockReq();
      const res = createMockRes();
      const next = vi.fn();

      const middleware = optionalAuth();
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should continue with invalid token format', async () => {
      const req = createMockReq('Basic abc123');
      const res = createMockRes();
      const next = vi.fn();

      const middleware = optionalAuth();
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should attempt to extract user with bearer token', async () => {
      const req = createMockReq('Bearer some-token');
      const res = createMockRes();
      const next = vi.fn();

      const middleware = optionalAuth();
      await middleware(req, res, next);

      // Should still call next even if token extraction fails
      expect(next).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // ROLE CHECK TESTS
  // ===========================================================================

  describe('hasRole', () => {
    function createMockReq(user?: KeycloakUser): AuthenticatedRequest {
      const req: any = { headers: {} };
      if (user) {
        req.keycloakUser = user;
      }
      return req;
    }

    const adminUser: KeycloakUser = {
      id: 'user-1',
      username: 'admin',
      email: 'admin@test.com',
      name: 'Admin User',
      roles: ['admin'],
      organizationId: 'org-1',
    };

    const analystUser: KeycloakUser = {
      id: 'user-2',
      username: 'analyst',
      email: 'analyst@test.com',
      name: 'Analyst User',
      roles: ['analyst', 'viewer'],
      organizationId: 'org-1',
    };

    it('should return false for unauthenticated request', () => {
      const req = createMockReq();
      expect(hasRole(req, 'admin')).toBe(false);
    });

    it('should return true for user with matching role', () => {
      const req = createMockReq(adminUser);
      expect(hasRole(req, 'admin')).toBe(true);
    });

    it('should return false for user without matching role', () => {
      const req = createMockReq(analystUser);
      expect(hasRole(req, 'admin')).toBe(false);
    });

    it('should check multiple roles (any match)', () => {
      const req = createMockReq(analystUser);
      expect(hasRole(req, ['admin', 'analyst'])).toBe(true);
    });

    it('should return false if no roles match', () => {
      const req = createMockReq(analystUser);
      expect(hasRole(req, ['admin', 'operator'])).toBe(false);
    });
  });

  // ===========================================================================
  // VETO CHECK TESTS
  // ===========================================================================

  describe('canVeto', () => {
    function createMockReq(user?: KeycloakUser): AuthenticatedRequest {
      const req: any = { headers: {} };
      if (user) {
        req.keycloakUser = user;
      }
      return req;
    }

    it('should return true for admin', () => {
      const req = createMockReq({
        id: 'user-1',
        username: 'admin',
        email: 'admin@test.com',
        name: 'Admin',
        roles: ['admin'],
        organizationId: 'org-1',
      });

      expect(canVeto(req)).toBe(true);
    });

    it('should return true for veto-authority', () => {
      const req = createMockReq({
        id: 'user-2',
        username: 'veto',
        email: 'veto@test.com',
        name: 'Veto Authority',
        roles: ['veto-authority'],
        organizationId: 'org-1',
      });

      expect(canVeto(req)).toBe(true);
    });

    it('should return false for analyst', () => {
      const req = createMockReq({
        id: 'user-3',
        username: 'analyst',
        email: 'analyst@test.com',
        name: 'Analyst',
        roles: ['analyst'],
        organizationId: 'org-1',
      });

      expect(canVeto(req)).toBe(false);
    });

    it('should return false for unauthenticated', () => {
      const req = createMockReq();
      expect(canVeto(req)).toBe(false);
    });
  });

  // ===========================================================================
  // COUNCIL ACCESS TESTS
  // ===========================================================================

  describe('canAccessCouncil', () => {
    function createMockReq(user?: KeycloakUser): AuthenticatedRequest {
      const req: any = { headers: {} };
      if (user) {
        req.keycloakUser = user;
      }
      return req;
    }

    it('should return true for admin', () => {
      const req = createMockReq({
        id: 'user-1',
        username: 'admin',
        email: 'admin@test.com',
        name: 'Admin',
        roles: ['admin'],
        organizationId: 'org-1',
      });

      expect(canAccessCouncil(req)).toBe(true);
    });

    it('should return true for analyst', () => {
      const req = createMockReq({
        id: 'user-2',
        username: 'analyst',
        email: 'analyst@test.com',
        name: 'Analyst',
        roles: ['analyst'],
        organizationId: 'org-1',
      });

      expect(canAccessCouncil(req)).toBe(true);
    });

    it('should return true for council-member', () => {
      const req = createMockReq({
        id: 'user-3',
        username: 'council',
        email: 'council@test.com',
        name: 'Council Member',
        roles: ['council-member'],
        organizationId: 'org-1',
      });

      expect(canAccessCouncil(req)).toBe(true);
    });

    it('should return false for viewer', () => {
      const req = createMockReq({
        id: 'user-4',
        username: 'viewer',
        email: 'viewer@test.com',
        name: 'Viewer',
        roles: ['viewer'],
        organizationId: 'org-1',
      });

      expect(canAccessCouncil(req)).toBe(false);
    });

    it('should return false for unauthenticated', () => {
      const req = createMockReq();
      expect(canAccessCouncil(req)).toBe(false);
    });
  });

  // ===========================================================================
  // ORG ID TESTS
  // ===========================================================================

  describe('getOrgId', () => {
    function createMockReq(user?: KeycloakUser): AuthenticatedRequest {
      const req: any = { headers: {} };
      if (user) {
        req.keycloakUser = user;
      }
      return req;
    }

    it('should return organization ID from user', () => {
      const req = createMockReq({
        id: 'user-1',
        username: 'test',
        email: 'test@test.com',
        name: 'Test',
        roles: ['viewer'],
        organizationId: 'my-org-123',
      });

      expect(getOrgId(req)).toBe('my-org-123');
    });

    it('should return default-org for unauthenticated', () => {
      const req = createMockReq();
      expect(getOrgId(req)).toBe('default-org');
    });

    it('should return default-org if organizationId is missing', () => {
      const req: any = {
        headers: {},
        keycloakUser: {
          id: 'user-1',
          username: 'test',
          email: 'test@test.com',
          name: 'Test',
          roles: ['viewer'],
        },
      };

      expect(getOrgId(req)).toBe('default-org');
    });
  });
});
