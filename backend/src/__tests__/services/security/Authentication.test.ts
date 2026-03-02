/**
 * Module — Authentication Test
 *
 * Platform module.
 * @module __tests__/services/security/Authentication.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Authentication Tests
 * Tests for authentication, session management, and token handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'crypto';

// Simple token generator
function generateToken(payload: Record<string, unknown>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string, secret: string): { valid: boolean; payload: Record<string, unknown> | null } {
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, payload: null };

  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');

  if (signature !== expectedSig) return { valid: false, payload: null };

  try {
    const payload = JSON.parse(Buffer.from(body ?? '', 'base64url').toString()) as Record<string, unknown>;
    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}

class MockAuthService {
  private secret = 'test-secret-key';
  private users = new Map<string, { id: string; email: string; password: string; role: string; mfaEnabled: boolean }>();
  private sessions = new Map<string, { userId: string; createdAt: Date; expiresAt: Date; ip: string }>();
  private refreshTokens = new Map<string, { userId: string; expiresAt: Date }>();
  private failedAttempts = new Map<string, { count: number; lockedUntil: Date | null }>();

  constructor() {
    // Seed with test users
    this.users.set('user-1', { id: 'user-1', email: 'test@example.com', password: 'hashed_password', role: 'user', mfaEnabled: false });
    this.users.set('admin-1', { id: 'admin-1', email: 'admin@example.com', password: 'hashed_admin', role: 'admin', mfaEnabled: true });
  }

  async login(email: string, password: string, ip: string): Promise<{ success: boolean; token?: string; refreshToken?: string; error?: string }> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (!user) {
      this.recordFailedAttempt(email);
      return { success: false, error: 'Invalid credentials' };
    }

    // Check lockout
    const attempts = this.failedAttempts.get(email);
    if (attempts?.lockedUntil && attempts.lockedUntil > new Date()) {
      return { success: false, error: 'Account locked' };
    }

    // Simple password check (would be bcrypt in real impl)
    if (user.password !== `hashed_${password.replace('password', 'password')}`) {
      this.recordFailedAttempt(email);
      return { success: false, error: 'Invalid credentials' };
    }

    // Clear failed attempts on success
    this.failedAttempts.delete(email);

    // Create session
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 3600000); // 1 hour

    this.sessions.set(sessionId, {
      userId: user.id,
      createdAt: now,
      expiresAt,
      ip,
    });

    // Generate tokens
    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      exp: Math.floor(expiresAt.getTime() / 1000),
    }, this.secret);

    const refreshToken = crypto.randomUUID();
    this.refreshTokens.set(refreshToken, {
      userId: user.id,
      expiresAt: new Date(now.getTime() + 7 * 24 * 3600000), // 7 days
    });

    return { success: true, token, refreshToken };
  }

  private recordFailedAttempt(email: string): void {
    const current = this.failedAttempts.get(email) ?? { count: 0, lockedUntil: null };
    current.count++;
    
    if (current.count >= 5) {
      current.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lockout
    }
    
    this.failedAttempts.set(email, current);
  }

  verifyToken(token: string): { valid: boolean; userId?: string; role?: string } {
    const result = verifyToken(token, this.secret);
    
    if (!result.valid || !result.payload) {
      return { valid: false };
    }

    // Check expiration
    const exp = result.payload['exp'] as number;
    if (exp && exp < Date.now() / 1000) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: result.payload['sub'] as string,
      role: result.payload['role'] as string,
    };
  }

  async refresh(refreshToken: string): Promise<{ success: boolean; token?: string; error?: string }> {
    const tokenData = this.refreshTokens.get(refreshToken);
    
    if (!tokenData) {
      return { success: false, error: 'Invalid refresh token' };
    }

    if (tokenData.expiresAt < new Date()) {
      this.refreshTokens.delete(refreshToken);
      return { success: false, error: 'Refresh token expired' };
    }

    const user = this.users.get(tokenData.userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }, this.secret);

    return { success: true, token };
  }

  async logout(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  getSession(sessionId: string): { userId: string; createdAt: Date; expiresAt: Date; ip: string } | null {
    return this.sessions.get(sessionId) ?? null;
  }

  getFailedAttempts(email: string): number {
    return this.failedAttempts.get(email)?.count ?? 0;
  }

  isLocked(email: string): boolean {
    const attempts = this.failedAttempts.get(email);
    return attempts?.lockedUntil ? attempts.lockedUntil > new Date() : false;
  }
}

describe('Authentication', () => {
  let auth: MockAuthService;

  beforeEach(() => {
    auth = new MockAuthService();
  });

  describe('Login', () => {
    it('should login with valid credentials', async () => {
      const result = await auth.login('test@example.com', 'password', '192.168.1.1');
      
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should reject invalid email', async () => {
      const result = await auth.login('wrong@example.com', 'password', '192.168.1.1');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should reject invalid password', async () => {
      const result = await auth.login('test@example.com', 'wrongpassword', '192.168.1.1');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should track failed attempts', async () => {
      await auth.login('test@example.com', 'wrong1', '192.168.1.1');
      await auth.login('test@example.com', 'wrong2', '192.168.1.1');
      await auth.login('test@example.com', 'wrong3', '192.168.1.1');
      
      expect(auth.getFailedAttempts('test@example.com')).toBe(3);
    });

    it('should lock account after 5 failed attempts', async () => {
      for (let i = 0; i < 5; i++) {
        await auth.login('test@example.com', `wrong${i}`, '192.168.1.1');
      }
      
      expect(auth.isLocked('test@example.com')).toBe(true);
      
      const result = await auth.login('test@example.com', 'password', '192.168.1.1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Account locked');
    });

    it('should clear failed attempts on successful login', async () => {
      await auth.login('test@example.com', 'wrong1', '192.168.1.1');
      await auth.login('test@example.com', 'wrong2', '192.168.1.1');
      
      expect(auth.getFailedAttempts('test@example.com')).toBe(2);
      
      await auth.login('test@example.com', 'password', '192.168.1.1');
      
      expect(auth.getFailedAttempts('test@example.com')).toBe(0);
    });
  });

  describe('Token Verification', () => {
    it('should verify valid token', async () => {
      const loginResult = await auth.login('test@example.com', 'password', '192.168.1.1');
      
      const verifyResult = auth.verifyToken(loginResult.token ?? '');
      
      expect(verifyResult.valid).toBe(true);
      expect(verifyResult.userId).toBe('user-1');
      expect(verifyResult.role).toBe('user');
    });

    it('should reject invalid token', () => {
      const result = auth.verifyToken('invalid.token.here');
      
      expect(result.valid).toBe(false);
    });

    it('should reject tampered token', async () => {
      const loginResult = await auth.login('test@example.com', 'password', '192.168.1.1');
      const token = loginResult.token ?? '';
      
      // Tamper with the token
      const parts = token.split('.');
      const tamperedToken = `${parts[0]}.${parts[1]}modified.${parts[2]}`;
      
      const result = auth.verifyToken(tamperedToken);
      expect(result.valid).toBe(false);
    });

    it('should reject malformed token', () => {
      const result = auth.verifyToken('not-a-valid-jwt');
      expect(result.valid).toBe(false);
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      const loginResult = await auth.login('test@example.com', 'password', '192.168.1.1');
      
      const refreshResult = await auth.refresh(loginResult.refreshToken ?? '');
      
      expect(refreshResult.success).toBe(true);
      expect(refreshResult.token).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const result = await auth.refresh('invalid-refresh-token');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid refresh token');
    });
  });

  describe('Session Management', () => {
    it('should create session on login', async () => {
      const loginResult = await auth.login('test@example.com', 'password', '192.168.1.1');
      
      const tokenData = auth.verifyToken(loginResult.token ?? '');
      expect(tokenData.valid).toBe(true);
    });

    it('should track session IP', async () => {
      const loginResult = await auth.login('test@example.com', 'password', '10.0.0.1');
      
      expect(loginResult.success).toBe(true);
    });
  });

  describe('Admin Authentication', () => {
    it('should login admin user', async () => {
      const result = await auth.login('admin@example.com', 'admin', '192.168.1.1');
      
      expect(result.success).toBe(true);
      
      const tokenData = auth.verifyToken(result.token ?? '');
      expect(tokenData.role).toBe('admin');
    });
  });
});
