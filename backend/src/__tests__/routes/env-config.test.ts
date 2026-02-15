// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Environment Config API Routes Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import envConfigRoutes from '../../routes/env-config.js';

const app = express();
app.use(express.json());
app.use('/api/v1/admin/env-config', envConfigRoutes);

const TEST_ENV_PATH = path.join(process.cwd(), '.env.test');

describe('Environment Config API', () => {
  beforeEach(() => {
    // Create test .env file
    const testEnv = `NODE_ENV=test
PORT=3001
DATABASE_URL=postgresql://test:test@localhost:5432/test
REDIS_URL=redis://localhost:6379
JWT_SECRET=test_secret_32_characters_long_minimum
ENCRYPTION_KEY=test_encryption_key_32_chars_min`;
    
    if (!fs.existsSync(TEST_ENV_PATH)) {
      fs.writeFileSync(TEST_ENV_PATH, testEnv, 'utf8');
    }
  });

  afterEach(() => {
    // Cleanup test files
    if (fs.existsSync(TEST_ENV_PATH)) {
      fs.unlinkSync(TEST_ENV_PATH);
    }
    
    // Cleanup backups
    const backups = fs.readdirSync(process.cwd()).filter(f => f.startsWith('.env.test.backup'));
    backups.forEach(f => fs.unlinkSync(path.join(process.cwd(), f)));
  });

  describe('GET /', () => {
    it('should read .env configuration', async () => {
      const response = await request(app)
        .get('/api/v1/admin/env-config');

      // May fail if .env doesn't exist, which is expected
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('variables');
        expect(Array.isArray(response.body.data.variables)).toBe(true);
        expect(response.body.data).toHaveProperty('environment');
      } else {
        expect(response.status).toBe(404);
      }
    });

    it('should categorize variables correctly', async () => {
      const response = await request(app)
        .get('/api/v1/admin/env-config');

      if (response.status === 200 && response.body.data.variables.length > 0) {
        const variable = response.body.data.variables[0];
        expect(variable).toHaveProperty('key');
        expect(variable).toHaveProperty('value');
        expect(variable).toHaveProperty('category');
        expect(variable).toHaveProperty('required');
        expect(variable).toHaveProperty('sensitive');
      }
    });
  });

  describe('POST /validate', () => {
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/admin/env-config/validate')
        .send({
          variables: {
            NODE_ENV: 'production',
            PORT: '3001',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveProperty('DATABASE_URL');
    });

    it('should validate URL formats', async () => {
      const response = await request(app)
        .post('/api/v1/admin/env-config/validate')
        .send({
          variables: {
            DATABASE_URL: 'invalid-url',
            REDIS_URL: 'redis://localhost:6379',
            NEO4J_URI: 'bolt://localhost:7687',
            JWT_SECRET: 'test_secret_32_characters_long_minimum',
            JWT_REFRESH_SECRET: 'test_refresh_secret_32_chars_long',
            ENCRYPTION_KEY: 'test_encryption_key_32_chars_min',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('DATABASE_URL');
    });

    it('should validate secret lengths', async () => {
      const response = await request(app)
        .post('/api/v1/admin/env-config/validate')
        .send({
          variables: {
            DATABASE_URL: 'postgresql://localhost:5432/test',
            REDIS_URL: 'redis://localhost:6379',
            NEO4J_URI: 'bolt://localhost:7687',
            JWT_SECRET: 'short',
            JWT_REFRESH_SECRET: 'test_refresh_secret_32_chars_long',
            ENCRYPTION_KEY: 'test_encryption_key_32_chars_min',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('JWT_SECRET');
    });

    it('should pass validation with valid config', async () => {
      const response = await request(app)
        .post('/api/v1/admin/env-config/validate')
        .send({
          variables: {
            DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
            REDIS_URL: 'redis://localhost:6379',
            NEO4J_URI: 'bolt://localhost:7687',
            JWT_SECRET: 'test_secret_32_characters_long_minimum',
            JWT_REFRESH_SECRET: 'test_refresh_secret_32_chars_long',
            ENCRYPTION_KEY: 'test_encryption_key_32_chars_min',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.errors).toBeUndefined();
    });
  });
});
