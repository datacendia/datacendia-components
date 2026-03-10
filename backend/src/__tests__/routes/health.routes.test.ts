/**
 * Health Routes Deep Tests
 * 
 * Tests the /api/v1/health endpoints with supertest.
 * Covers: basic health, score, dimensions, trend, systems status.
 * 
 * @module __tests__/routes/health.routes.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../../config/database.js', () => ({
  prisma: {
    alerts: { findMany: vi.fn().mockResolvedValue([]) },
    metric_values: { findMany: vi.fn().mockResolvedValue([]) },
    data_sources: { findMany: vi.fn().mockResolvedValue([{ status: 'CONNECTED' }]) },
    workflow_executions: { findMany: vi.fn().mockResolvedValue([{ status: 'COMPLETED' }]) },
    workflows: { findMany: vi.fn().mockResolvedValue([]) },
    health_scores: { findMany: vi.fn().mockResolvedValue([]), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}) },
    metric_definitions: { findMany: vi.fn().mockResolvedValue([]) },
    $queryRaw: vi.fn().mockResolvedValue([{ '1': 1 }]),
  },
}));

vi.mock('../../config/redis.js', () => ({
  cache: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
  },
}));

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../middleware/auth.js', () => ({
  devAuth: (req: any, _res: any, next: any) => {
    req.organizationId = 'org-test';
    req.userId = 'user-test';
    next();
  },
  authenticate: (req: any, _res: any, next: any) => next(),
}));

import healthRouter from '../../routes/health.js';
import { errorHandler } from '../../middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use('/api/v1/health', healthRouter);
app.use(errorHandler);

describe('Health Routes', () => {

  // ===========================================================================
  // GET /api/v1/health
  // ===========================================================================

  describe('GET /api/v1/health', () => {
    // FAILS IF: basic health endpoint returns non-200 or missing status field
    it('should return healthy status with timestamp', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'healthy');
      expect(res.body.data).toHaveProperty('timestamp');
      expect(res.body.data).toHaveProperty('version');
      expect(res.body.data).toHaveProperty('uptime');
      expect(typeof res.body.data.uptime).toBe('number');
    });
  });

  // ===========================================================================
  // GET /api/v1/health/score
  // ===========================================================================

  describe('GET /api/v1/health/score', () => {
    // FAILS IF: score endpoint returns non-200 or missing overall score
    it('should return health score with dimension breakdown', async () => {
      const res = await request(app).get('/api/v1/health/score');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('overall');
      expect(typeof res.body.data.overall).toBe('number');
      expect(res.body.data.overall).toBeGreaterThanOrEqual(0);
      expect(res.body.data.overall).toBeLessThanOrEqual(100);
      expect(res.body.data).toHaveProperty('dimensions');
      expect(res.body.data.dimensions).toHaveProperty('data');
      expect(res.body.data.dimensions).toHaveProperty('operations');
      expect(res.body.data.dimensions).toHaveProperty('security');
      expect(res.body.data.dimensions).toHaveProperty('people');
    });

    // FAILS IF: dimension scores are out of 0-100 range
    it('should return dimension scores in 0-100 range', async () => {
      const res = await request(app).get('/api/v1/health/score');
      const dims = res.body.data.dimensions;
      for (const key of ['data', 'operations', 'security', 'people']) {
        expect(dims[key].score).toBeGreaterThanOrEqual(0);
        expect(dims[key].score).toBeLessThanOrEqual(100);
        expect(['up', 'down', 'stable']).toContain(dims[key].trend);
        expect(typeof dims[key].change).toBe('number');
      }
    });
  });

  // ===========================================================================
  // GET /api/v1/health/dimensions
  // ===========================================================================

  describe('GET /api/v1/health/dimensions', () => {
    // FAILS IF: dimensions endpoint returns non-200
    it('should return dimension details', async () => {
      const res = await request(app).get('/api/v1/health/dimensions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });

  // ===========================================================================
  // GET /api/v1/health/trend
  // ===========================================================================

  describe('GET /api/v1/health/trend', () => {
    // FAILS IF: trend endpoint returns non-200 or missing period
    it('should return health trend for default 7 days', async () => {
      const res = await request(app).get('/api/v1/health/trend');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('period');
      expect(res.body.data).toHaveProperty('scores');
      expect(Array.isArray(res.body.data.scores)).toBe(true);
    });

    // FAILS IF: custom days parameter not respected
    it('should accept custom days parameter', async () => {
      const res = await request(app).get('/api/v1/health/trend?days=30');
      expect(res.status).toBe(200);
      expect(res.body.data.period).toBe('30 days');
    });
  });

  // ===========================================================================
  // GET /api/v1/health/systems/status
  // ===========================================================================

  describe('GET /api/v1/health/systems/status', () => {
    // FAILS IF: systems status endpoint returns non-200
    it('should return system statuses', async () => {
      const res = await request(app).get('/api/v1/health/systems/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });
});
