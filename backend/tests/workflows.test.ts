/**
 * WORKFLOW TESTS
 * Comprehensive test suite for workflow endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
let apiAvailable = false;
import { prisma, API_URL, TEST_USERS, getAuthToken, authFetch, cleanup, checkApiAvailable } from './setup';

beforeAll(async () => {
  apiAvailable = await checkApiAvailable();
  if (!apiAvailable) console.warn('  Backend not running - skipping integration tests');
});

describe('Workflows', () => {
  let adminToken: string;

  beforeAll(async () => {
    await prisma.$connect();
    adminToken = await getAuthToken(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('GET /workflows', () => {
    it.skipIf(!apiAvailable)('should list all workflows', async () => {
      const response = await authFetch('/workflows', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it.skipIf(!apiAvailable)('should support status filter', async () => {
      const response = await authFetch('/workflows?status=ACTIVE', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      data.data.forEach((w: any) => {
        expect(w.status).toBe('ACTIVE');
      });
    });

    it.skipIf(!apiAvailable)('should support category filter', async () => {
      const response = await authFetch('/workflows?category=Finance', adminToken);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /workflows/:id', () => {
    it.skipIf(!apiAvailable)('should return specific workflow', async () => {
      const listResponse = await authFetch('/workflows', adminToken);
      const workflows = (await listResponse.json()).data;
      
      if (workflows.length > 0) {
        const workflowId = workflows[0].id;
        
        const response = await authFetch(`/workflows/${workflowId}`, adminToken);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data.data.id).toBe(workflowId);
        expect(data.data.name).toBeDefined();
        expect(data.data.definition).toBeDefined();
      }
    });
  });

  describe('POST /workflows', () => {
    it.skipIf(!apiAvailable)('should create new workflow', async () => {
      const response = await authFetch('/workflows', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Workflow',
          description: 'A test workflow for automated testing',
          category: 'Testing',
          trigger: { type: 'manual' },
          definition: {
            nodes: [
              { id: 'start', type: 'trigger', config: {} },
              { id: 'end', type: 'action', config: {} },
            ],
            edges: [
              { from: 'start', to: 'end' },
            ],
          },
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.data.name).toBe('Test Workflow');
      expect(data.data.status).toBe('DRAFT');
    });

    it.skipIf(!apiAvailable)('should reject workflow without name', async () => {
      const response = await authFetch('/workflows', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          trigger: { type: 'manual' },
          definition: { nodes: [], edges: [] },
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /workflows/:id', () => {
    it.skipIf(!apiAvailable)('should update workflow', async () => {
      const listResponse = await authFetch('/workflows', adminToken);
      const workflows = (await listResponse.json()).data;
      
      if (workflows.length > 0) {
        const workflowId = workflows[0].id;
        
        const response = await authFetch(`/workflows/${workflowId}`, adminToken, {
          method: 'PUT',
          body: JSON.stringify({
            name: 'Updated Workflow Name',
            description: 'Updated description',
          }),
        });

        expect(response.status).toBe(200);
      }
    });
  });

  describe('Workflow Executions', () => {
    it.skipIf(!apiAvailable)('should list workflow executions', async () => {
      const listResponse = await authFetch('/workflows', adminToken);
      const workflows = (await listResponse.json()).data;
      
      if (workflows.length > 0) {
        const workflowId = workflows[0].id;
        
        const response = await authFetch(`/workflows/${workflowId}/executions`, adminToken);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(Array.isArray(data.data)).toBe(true);
      }
    });

    it.skipIf(!apiAvailable)('should support execution status filter', async () => {
      const listResponse = await authFetch('/workflows', adminToken);
      const workflows = (await listResponse.json()).data;
      
      if (workflows.length > 0) {
        const workflowId = workflows[0].id;
        
        const response = await authFetch(`/workflows/${workflowId}/executions?status=COMPLETED`, adminToken);
        expect(response.status).toBe(200);
      }
    });
  });
});

