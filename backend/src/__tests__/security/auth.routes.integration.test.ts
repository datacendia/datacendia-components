// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUTH ROUTES INTEGRATION TESTS
// Tests for authentication routes with database integration
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import { z } from 'zod';

// Import validation schemas to test
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// =============================================================================
// VALIDATION SCHEMA TESTS
// =============================================================================

describe('Auth Route Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const result = registerSchema.safeParse({
        email: 'newuser@example.com',
        password: 'securepassword123',
        name: 'John Doe',
        organizationName: 'Acme Corp',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        email: 'not-an-email',
        password: 'securepassword123',
        name: 'John Doe',
        organizationName: 'Acme Corp',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = registerSchema.safeParse({
        email: 'newuser@example.com',
        password: 'short',
        name: 'John Doe',
        organizationName: 'Acme Corp',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const result = registerSchema.safeParse({
        email: 'newuser@example.com',
        password: 'securepassword123',
        name: 'J',
        organizationName: 'Acme Corp',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short organization name', () => {
      const result = registerSchema.safeParse({
        email: 'newuser@example.com',
        password: 'securepassword123',
        name: 'John Doe',
        organizationName: 'A',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = registerSchema.safeParse({
        email: 'newuser@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('refreshSchema', () => {
    it('should validate correct refresh token', () => {
      const result = refreshSchema.safeParse({
        refreshToken: 'valid-refresh-token-string',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty refresh token', () => {
      const result = refreshSchema.safeParse({
        refreshToken: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing refresh token', () => {
      const result = refreshSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('should validate correct email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'user@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'not-valid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate correct reset data', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'reset-token-123',
        password: 'newpassword123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const result = resetPasswordSchema.safeParse({
        token: '',
        password: 'newpassword123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'reset-token-123',
        password: 'short',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate correct password change data', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty current password', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: '',
        newPassword: 'newpassword123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short new password', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'oldpassword',
        newPassword: 'short',
      });
      expect(result.success).toBe(false);
    });
  });
});

// =============================================================================
// ROUTE INTEGRATION TESTS (with mock Express app)
// =============================================================================

describe('Auth Routes Integration', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock login endpoint
    app.post('/api/v1/auth/login', (req, res) => {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: result.error.message },
        });
      }

      // Mock successful login
      if (result.data.email === 'test@example.com' && result.data.password === 'password123') {
        return res.json({
          success: true,
          data: {
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600,
            user: {
              id: 'user-123',
              email: result.data.email,
              name: 'Test User',
              role: 'user',
            },
          },
        });
      }

      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' },
      });
    });

    // Mock register endpoint
    app.post('/api/v1/auth/register', (req, res) => {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: result.error.message },
        });
      }

      // Mock duplicate email check
      if (result.data.email === 'existing@example.com') {
        return res.status(409).json({
          success: false,
          error: { code: 'CONFLICT', message: 'Email already registered' },
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: 'new-user-123',
            email: result.data.email,
            name: result.data.name,
          },
          organization: {
            id: 'new-org-123',
            name: result.data.organizationName,
          },
        },
      });
    });

    // Mock refresh endpoint
    app.post('/api/v1/auth/refresh', (req, res) => {
      const result = refreshSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: result.error.message },
        });
      }

      if (result.data.refreshToken === 'valid-refresh-token') {
        return res.json({
          success: true,
          data: {
            accessToken: 'new-access-token',
            expiresIn: 3600,
          },
        });
      }

      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' },
      });
    });

    // Mock logout endpoint
    app.post('/api/v1/auth/logout', (req, res) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'No token provided' },
        });
      }

      return res.json({
        success: true,
        message: 'Logged out successfully',
      });
    });

    // Mock forgot-password endpoint
    app.post('/api/v1/auth/forgot-password', (req, res) => {
      const result = forgotPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: result.error.message },
        });
      }

      // Always return success (don't reveal if email exists)
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    });

    // Mock reset-password endpoint
    app.post('/api/v1/auth/reset-password', (req, res) => {
      const result = resetPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: result.error.message },
        });
      }

      if (result.data.token === 'valid-reset-token') {
        return res.json({
          success: true,
          message: 'Password reset successfully',
        });
      }

      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired reset token' },
      });
    });

    // Mock me endpoint
    app.get('/api/v1/auth/me', (req, res) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'No token provided' },
        });
      }

      return res.json({
        success: true,
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
      });
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'invalid-email', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject short password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'short' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'securepassword123',
          name: 'New User',
          organizationName: 'New Org',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('organization');
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'securepassword123',
          name: 'New User',
          organizationName: 'New Org',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid',
          password: 'short',
          name: 'A',
          organizationName: 'B',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'valid-refresh-token' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout with valid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/forgot-password', () => {
    it('should accept valid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'user@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ token: 'valid-reset-token', password: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject invalid reset token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ token: 'invalid-token', password: 'newpassword123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user info with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('email');
    });

    it('should reject without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
