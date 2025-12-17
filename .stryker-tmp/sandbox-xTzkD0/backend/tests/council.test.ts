/**
 * AI COUNCIL TESTS
 * Comprehensive test suite for council/deliberation endpoints
 */
// @ts-nocheck


import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, API_URL, TEST_USERS, getAuthToken, authFetch, cleanup } from './setup';

describe('AI Council', () => {
  let adminToken: string;

  beforeAll(async () => {
    await prisma.$connect();
    adminToken = await getAuthToken(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('GET /council/agents', () => {
    it('should list all council agents', async () => {
      const response = await authFetch('/council/agents', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('should include required agent fields', async () => {
      const response = await authFetch('/council/agents', adminToken);
      const data = await response.json();
      const agent = data.data[0];

      expect(agent.id).toBeDefined();
      expect(agent.code).toBeDefined();
      expect(agent.name).toBeDefined();
      expect(agent.role).toBeDefined();
    });
  });

  describe('GET /deliberations', () => {
    it('should list deliberations', async () => {
      const response = await authFetch('/deliberations', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const response = await authFetch('/deliberations?page=1&limit=5', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter by status', async () => {
      const response = await authFetch('/deliberations?status=COMPLETED', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      data.data.forEach((d: any) => {
        expect(d.status).toBe('COMPLETED');
      });
    });
  });

  describe('GET /deliberations/:id', () => {
    it('should return specific deliberation with messages', async () => {
      // First get a deliberation ID
      const listResponse = await authFetch('/deliberations', adminToken);
      const deliberations = (await listResponse.json()).data;
      
      if (deliberations.length > 0) {
        const deliberationId = deliberations[0].id;
        
        const response = await authFetch(`/deliberations/${deliberationId}`, adminToken);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data.data.id).toBe(deliberationId);
        expect(data.data.question).toBeDefined();
      }
    });

    it('should return 404 for non-existent deliberation', async () => {
      const response = await authFetch('/deliberations/non-existent-id', adminToken);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /deliberations', () => {
    it('should create new deliberation', async () => {
      const response = await authFetch('/deliberations', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          question: 'Should we implement a new pricing strategy for Q1?',
          config: { mode: 'war-room' },
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.data.question).toContain('pricing strategy');
      expect(data.data.status).toBe('PENDING');
    });

    it('should reject empty question', async () => {
      const response = await authFetch('/deliberations', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          question: '',
          config: { mode: 'war-room' },
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /deliberations/:id/start', () => {
    it('should start a pending deliberation', async () => {
      // Create a new deliberation first
      const createResponse = await authFetch('/deliberations', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          question: 'Test deliberation for starting',
          config: { mode: 'rapid' },
        }),
      });
      
      const created = await createResponse.json();
      const deliberationId = created.data.id;

      const response = await authFetch(`/deliberations/${deliberationId}/start`, adminToken, {
        method: 'POST',
      });

      expect([200, 202]).toContain(response.status);
    });
  });

  describe('Deliberation Messages', () => {
    it('should include agent messages in deliberation', async () => {
      // Get a completed deliberation
      const listResponse = await authFetch('/deliberations?status=COMPLETED&limit=1', adminToken);
      const deliberations = (await listResponse.json()).data;
      
      if (deliberations.length > 0) {
        const response = await authFetch(`/deliberations/${deliberations[0].id}`, adminToken);
        const data = await response.json();
        
        expect(data.data.messages).toBeDefined();
        if (data.data.messages.length > 0) {
          const message = data.data.messages[0];
          expect(message.content).toBeDefined();
          expect(message.phase).toBeDefined();
        }
      }
    });
  });
});
