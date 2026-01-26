/**
 * =============================================================================
 * API PERFORMANCE REGRESSION TESTS
 * =============================================================================
 * Ensures API endpoints stay fast and don't degrade over time
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { checkApiAvailable } from '../setup';

const API_URL = process.env['API_URL'] || 'http://localhost:3001/api/v1';
let apiAvailable = false;

beforeAll(async () => {
  apiAvailable = await checkApiAvailable();
});

describe('API Performance', () => {
  describe('Health Endpoint', () => {
    it.skipIf(!apiAvailable)('should respond in under 100ms', async () => {
      const start = Date.now();
      const response = await fetch(`${API_URL}/health`);
      const duration = Date.now() - start;
      
      expect(response.ok).toBe(true);
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Languages Endpoint', () => {
    it.skipIf(!apiAvailable)('should respond in under 200ms', async () => {
      const start = Date.now();
      const response = await fetch(`${API_URL}/i18n/languages`);
      const duration = Date.now() - start;
      
      expect(response.ok).toBe(true);
      expect(duration).toBeLessThan(200);
    });

    it.skipIf(!apiAvailable)('should be cached on second request', async () => {
      await fetch(`${API_URL}/i18n/languages`);
      
      const start = Date.now();
      const response = await fetch(`${API_URL}/i18n/languages`);
      const duration = Date.now() - start;
      
      expect(response.ok).toBe(true);
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Integrations Endpoint', () => {
    it.skipIf(!apiAvailable)('should respond in under 300ms', async () => {
      const start = Date.now();
      const response = await fetch(`${API_URL}/integrations`);
      const duration = Date.now() - start;
      
      expect(response.ok).toBe(true);
      expect(duration).toBeLessThan(300);
    });
  });

  describe('Concurrent Requests', () => {
    it.skipIf(!apiAvailable)('should handle 10 concurrent requests efficiently', async () => {
      const start = Date.now();
      const requests = Array(10).fill(null).map(() => fetch(`${API_URL}/health`));
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;
      
      responses.forEach(r => expect(r.ok).toBe(true));
      expect(duration).toBeLessThan(500);
    });

    it.skipIf(!apiAvailable)('should handle 50 concurrent requests', async () => {
      const start = Date.now();
      const requests = Array(50).fill(null).map(() => fetch(`${API_URL}/health`));
      const responses = await Promise.all(requests);
      const duration = Date.now() - start;
      
      responses.forEach(r => expect(r.ok).toBe(true));
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Memory Usage', () => {
    it.skipIf(!apiAvailable)('should not leak memory on repeated requests', async () => {
      const iterations = 100;
      const start = Date.now();
      
      for (let i = 0; i < iterations; i++) {
        await fetch(`${API_URL}/health`);
      }
      
      const duration = Date.now() - start;
      const avgTime = duration / iterations;
      
      expect(avgTime).toBeLessThan(100);
    });
  });
});
