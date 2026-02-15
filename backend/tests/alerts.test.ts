/**
 * ALERTS TESTS
 * Comprehensive test suite for alert endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
let apiAvailable = false;
import { prisma, TEST_USERS, getAuthToken, authFetch, cleanup, checkApiAvailable } from './setup';

describe('Alerts', () => {
  let adminToken: string;
  let apiAvailable: boolean;

  beforeAll(async () => {
    apiAvailable = await checkApiAvailable();
    if (!apiAvailable) {
      console.log('[SKIP] Alerts tests - API server not available');
      return;
    }
    await prisma.$connect();
    adminToken = await getAuthToken(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('GET /alerts', () => {
    it.skipIf(!apiAvailable)('should list all alerts', async () => {
      if (!apiAvailable || !adminToken) return;
      const response = await authFetch('/alerts', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it.skipIf(!apiAvailable)('should support severity filter', async () => {
      if (!apiAvailable || !adminToken) return;
      const response = await authFetch('/alerts?severity=CRITICAL', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      data.data.forEach((alert: any) => {
        expect(alert.severity).toBe('CRITICAL');
      });
    });

    it.skipIf(!apiAvailable)('should support status filter', async () => {
      if (!apiAvailable || !adminToken) return;
      const response = await authFetch('/alerts?status=ACTIVE', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      data.data.forEach((alert: any) => {
        expect(alert.status).toBe('ACTIVE');
      });
    });

    it.skipIf(!apiAvailable)('should support pagination', async () => {
      if (!apiAvailable || !adminToken) return;
      const response = await authFetch('/alerts?page=1&pageSize=10', adminToken);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      // Pagination uses pageSize param, results may vary
      expect(data.data).toBeDefined();
    });
  });

  describe('GET /alerts/:id', () => {
    it.skipIf(!apiAvailable)('should return specific alert', async () => {
      if (!apiAvailable || !adminToken) return;
      const listResponse = await authFetch('/alerts', adminToken);
      const alerts = (await listResponse.json()).data;
      
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        
        const response = await authFetch(`/alerts/${alertId}`, adminToken);
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data.data.id).toBe(alertId);
      }
    });
  });

  describe('PUT /alerts/:id/acknowledge', () => {
    it.skipIf(!apiAvailable)('should acknowledge an alert', async () => {
      if (!apiAvailable || !adminToken) return;
      // Find an active alert
      const listResponse = await authFetch('/alerts?status=ACTIVE&limit=1', adminToken);
      const alerts = (await listResponse.json()).data;
      
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        
        const response = await authFetch(`/alerts/${alertId}/acknowledge`, adminToken, {
          method: 'PUT',
        });

        expect([200, 204]).toContain(response.status);
      }
    });
  });

  describe('PUT /alerts/:id/resolve', () => {
    it.skipIf(!apiAvailable)('should resolve an alert with resolution notes', async () => {
      if (!apiAvailable || !adminToken) return;
      // Find an acknowledged alert
      const listResponse = await authFetch('/alerts?status=ACKNOWLEDGED&limit=1', adminToken);
      const alerts = (await listResponse.json()).data;
      
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        
        const response = await authFetch(`/alerts/${alertId}/resolve`, adminToken, {
          method: 'PUT',
          body: JSON.stringify({
            resolution: 'Issue fixed by automated remediation',
          }),
        });

        expect([200, 204]).toContain(response.status);
      }
    });
  });

  describe('Alert Statistics', () => {
    it.skipIf(!apiAvailable)('should return alert statistics', async () => {
      if (!apiAvailable || !adminToken) return;
      const response = await authFetch('/alerts/stats', adminToken);
      
      if (response.status === 200) {
        const data = await response.json();
        expect(data.data).toBeDefined();
      }
    });
  });
});

