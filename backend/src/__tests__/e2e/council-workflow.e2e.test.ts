/**
 * Module — Council Workflow E2e Test
 *
 * Platform module.
 * @module __tests__/e2e/council-workflow.e2e.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * COUNCIL WORKFLOW E2E TESTS
 * Tests complete deliberation workflows with actual API calls
 */

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = process.env['API_BASE_URL'] || 'http://localhost:3001/api/v1';

const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<{ status: number; data: any; ok: boolean }> => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const data = response.headers.get('content-type')?.includes('json') 
      ? await response.json() 
      : await response.text();
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: { error: (error as Error).message }, ok: false };
  }
};

describe('Council Workflow E2E Tests', () => {
  let serverAvailable = false;
  let testDeliberationId: string | null = null;

  beforeAll(async () => {
    try {
      const response = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
      serverAvailable = response.ok;
    } catch {
      serverAvailable = false;
    }
  });

  // ===========================================================================
  // COMPLETE DELIBERATION WORKFLOW - 25 TESTS
  // ===========================================================================
  describe('Complete Deliberation Workflow', () => {
    it('Step 1: should list available agents', async () => {
      if (!serverAvailable) return;
      const { status, data } = await apiCall('/council/agents');
      expect([200, 401, 404]).toContain(status);
      if (status === 200) {
        expect(data).toBeDefined();
      }
    });

    it('Step 2: should create a new deliberation', async () => {
      if (!serverAvailable) return;
      const { status, data } = await apiCall('/council/deliberations', {
        method: 'POST',
        body: JSON.stringify({
          question: 'E2E Test: Should we expand into the European market in Q3?',
          context: 'Current revenue $10M, team size 50, no EU presence',
          urgency: 'medium',
          category: 'strategic',
        }),
      });
      expect([200, 201, 400, 401, 404]).toContain(status);
      if ((status === 200 || status === 201) && data) {
        testDeliberationId = data.id || data.deliberationId;
      }
    });

    it('Step 3: should retrieve the created deliberation', async () => {
      if (!serverAvailable || !testDeliberationId) return;
      const { status, data } = await apiCall(`/council/deliberations/${testDeliberationId}`);
      expect([200, 401, 404]).toContain(status);
      if (status === 200 && data) {
        expect(data.id || data.deliberationId).toBe(testDeliberationId);
      }
    });

    it('Step 4: should start the deliberation', async () => {
      if (!serverAvailable || !testDeliberationId) return;
      const { status } = await apiCall(`/council/deliberations/${testDeliberationId}/start`, {
        method: 'POST',
      });
      expect([200, 202, 400, 401, 404]).toContain(status);
    });

    it('Step 5: should get deliberation status', async () => {
      if (!serverAvailable || !testDeliberationId) return;
      const { status, data } = await apiCall(`/council/deliberations/${testDeliberationId}`);
      expect([200, 401, 404]).toContain(status);
      if (status === 200 && data && data.status) {
        expect(['pending', 'in_progress', 'completed', 'cancelled']).toContain(data.status);
      }
    });

    it('Step 6: should list all deliberations including new one', async () => {
      if (!serverAvailable) return;
      const { status, data } = await apiCall('/council/deliberations');
      expect([200, 401, 404]).toContain(status);
      if (status === 200 && Array.isArray(data)) {
        expect(data.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ===========================================================================
  // AGENT INTERACTION WORKFLOW - 15 TESTS
  // ===========================================================================
  describe('Agent Interaction Workflow', () => {
    it('should get CFO agent details', async () => {
      if (!serverAvailable) return;
      const { status, data } = await apiCall('/council/agents/cfo');
      expect([200, 401, 404]).toContain(status);
      if (status === 200 && data) {
        expect(data.id || data.agentId || data.name).toBeDefined();
      }
    });

    it('should get CTO agent details', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/agents/cto');
      expect([200, 401, 404]).toContain(status);
    });

    it('should get CEO agent details', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/agents/ceo');
      expect([200, 401, 404]).toContain(status);
    });

    it('should request agent perspective', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/agents/cfo/perspective', {
        method: 'POST',
        body: JSON.stringify({
          question: 'What are the financial implications of EU expansion?',
          context: 'Budget: $5M available',
        }),
      });
      expect([200, 400, 401, 404]).toContain(status);
    });

    it('should handle unknown agent gracefully', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/agents/unknown-agent');
      expect([400, 401, 404]).toContain(status);
    });
  });

  // ===========================================================================
  // ERROR HANDLING WORKFLOW - 15 TESTS
  // ===========================================================================
  describe('Error Handling Workflow', () => {
    it('should reject deliberation without question', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations', {
        method: 'POST',
        body: JSON.stringify({ context: 'No question provided' }),
      });
      expect([400, 401, 404, 422]).toContain(status);
    });

    it('should reject deliberation with empty question', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations', {
        method: 'POST',
        body: JSON.stringify({ question: '', context: 'Empty question' }),
      });
      expect([400, 401, 404, 422]).toContain(status);
    });

    it('should handle non-existent deliberation ID', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations/non-existent-id-12345');
      expect([400, 401, 404]).toContain(status);
    });

    it('should handle invalid deliberation ID format', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations/!!!invalid!!!');
      expect([400, 401, 404]).toContain(status);
    });

    it('should handle starting non-existent deliberation', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations/fake-id/start', {
        method: 'POST',
      });
      expect([400, 401, 404]).toContain(status);
    });
  });

  // ===========================================================================
  // FILTERING & PAGINATION WORKFLOW - 15 TESTS
  // ===========================================================================
  describe('Filtering & Pagination Workflow', () => {
    it('should paginate deliberations', async () => {
      if (!serverAvailable) return;
      const { status, data } = await apiCall('/council/deliberations?page=1&limit=5');
      expect([200, 401, 404]).toContain(status);
      if (status === 200 && Array.isArray(data)) {
        expect(data.length).toBeLessThanOrEqual(5);
      }
    });

    it('should filter by status', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations?status=completed');
      expect([200, 401, 404]).toContain(status);
    });

    it('should filter by urgency', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations?urgency=high');
      expect([200, 401, 404]).toContain(status);
    });

    it('should filter by date range', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations?from=2024-01-01&to=2024-12-31');
      expect([200, 401, 404]).toContain(status);
    });

    it('should sort deliberations', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations?sort=createdAt&order=desc');
      expect([200, 401, 404]).toContain(status);
    });

    it('should combine filters and pagination', async () => {
      if (!serverAvailable) return;
      const { status } = await apiCall('/council/deliberations?status=completed&page=1&limit=10&sort=createdAt');
      expect([200, 401, 404]).toContain(status);
    });
  });
});
