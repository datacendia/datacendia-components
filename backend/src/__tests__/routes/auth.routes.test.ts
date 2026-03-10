/**
 * Module — Auth Routes Test
 *
 * Platform module.
 * @module __tests__/routes/auth.routes.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUTH ROUTES VALIDATION TESTS
// Tests for authentication route input validation
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';

// Mock all dependencies to prevent database connections
vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn(), compare: vi.fn() },
  hash: vi.fn(),
  compare: vi.fn(),
}));

vi.mock('../../config/database.js', () => ({
  prisma: {
    users: { findUnique: vi.fn(), create: vi.fn() },
    organizations: { create: vi.fn() },
    sessions: { create: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
    email_verifications: { create: vi.fn() },
    audit_logs: { create: vi.fn() },
    password_resets: { findFirst: vi.fn(), deleteMany: vi.fn(), create: vi.fn() },
    $transaction: vi.fn(),
  },
  default: {
    users: { findUnique: vi.fn(), create: vi.fn() },
    organizations: { create: vi.fn() },
    sessions: { create: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
    email_verifications: { create: vi.fn() },
    audit_logs: { create: vi.fn() },
    password_resets: { findFirst: vi.fn(), deleteMany: vi.fn(), create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock('../../services/email.service.js', () => ({
  emailService: {
    sendVerificationEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  },
}));

vi.mock('../../middleware/auth.js', () => ({
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
  authenticate: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../../config/cache.js', () => ({
  cache: { get: vi.fn(), set: vi.fn(), del: vi.fn() },
}));

// Import after mocks
import authRouter from '../../routes/auth.js';
import { errorHandler } from '../../middleware/errorHandler.js';

// Test app
const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use(errorHandler);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Auth Routes Validation', () => {
  // ===========================================================================
  // LOGIN VALIDATION
  // ===========================================================================

  describe('POST /api/v1/auth/login - Validation', () => {
    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'invalid-email', password: 'validpassword123' });

      expect(response.status).toBe(400);
    });

    it('should reject short password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'short' });

      expect(response.status).toBe(400);
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ password: 'validpassword123' });

      expect(response.status).toBe(400);
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
    });

    it('should reject empty body', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  // ===========================================================================
  // REGISTER VALIDATION
  // ===========================================================================

  describe('POST /api/v1/auth/register - Validation', () => {
    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'securepassword123',
          name: 'Test User',
          organizationName: 'Test Org',
        });

      expect(response.status).toBe(400);
    });

    it('should reject short password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'short',
          name: 'Test User',
          organizationName: 'Test Org',
        });

      expect(response.status).toBe(400);
    });

    it('should reject short name', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'securepassword123',
          name: 'A',
          organizationName: 'Test Org',
        });

      expect(response.status).toBe(400);
    });

    it('should reject short organization name', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'securepassword123',
          name: 'Test User',
          organizationName: 'A',
        });

      expect([400, 429]).toContain(response.status);
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          password: 'securepassword123',
          name: 'Test User',
          organizationName: 'Test Org',
        });

      expect([400, 429]).toContain(response.status);
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          name: 'Test User',
          organizationName: 'Test Org',
        });

      expect([400, 429]).toContain(response.status);
    });

    it('should reject missing name', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'securepassword123',
          organizationName: 'Test Org',
        });

      expect([400, 429]).toContain(response.status);
    });

    it('should reject missing organization name', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'securepassword123',
          name: 'Test User',
        });

      expect([400, 429]).toContain(response.status);
    });
  });

  // ===========================================================================
  // REFRESH TOKEN VALIDATION
  // ===========================================================================

  describe('POST /api/v1/auth/refresh - Validation', () => {
    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should reject empty refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: '' });

      expect(response.status).toBe(400);
    });
  });

  // ===========================================================================
  // FORGOT PASSWORD VALIDATION
  // ===========================================================================

  describe('POST /api/v1/auth/forgot-password - Validation', () => {
    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  // ===========================================================================
  // RESET PASSWORD VALIDATION
  // ===========================================================================

  describe('POST /api/v1/auth/reset-password - Validation', () => {
    it('should reject short password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ token: 'valid-token', password: 'short' });

      expect(response.status).toBe(400);
    });

    it('should reject missing token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(400);
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ token: 'valid-token' });

      expect(response.status).toBe(400);
    });
  });
});
