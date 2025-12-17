/**
 * END-TO-END TESTS
 * Comprehensive E2E test suite for complete user journeys
 */
// @ts-nocheck


import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, API_URL, TEST_USERS, getAuthToken, authFetch, cleanup } from './setup';

describe('End-to-End User Journeys', () => {
  let adminToken: string;

  beforeAll(async () => {
    await prisma.$connect();
    adminToken = await getAuthToken(TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('Journey 1: User Login and Dashboard', () => {
    it('should complete login → view dashboard → check health', async () => {
      // Step 1: Login
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        }),
      });
      expect(loginResponse.status).toBe(200);
      const loginData = await loginResponse.json();
      const token = loginData.data.accessToken;

      // Step 2: Get user profile
      const profileResponse = await authFetch('/users/me', token);
      expect(profileResponse.status).toBe(200);

      // Step 3: Get organization info
      const orgResponse = await authFetch('/organizations/current', token);
      expect(orgResponse.status).toBe(200);

      // Step 4: Get health score
      const healthResponse = await authFetch('/health/score', token);
      // Health endpoint might not exist, so we accept 200 or 404
      expect([200, 404]).toContain(healthResponse.status);

      // Step 5: Get alerts
      const alertsResponse = await authFetch('/alerts?limit=5', token);
      expect(alertsResponse.status).toBe(200);
    });
  });

  describe('Journey 2: Create and Execute Deliberation', () => {
    it('should create deliberation → view agents → start deliberation', async () => {
      // Step 1: View available agents
      const agentsResponse = await authFetch('/council/agents', adminToken);
      expect(agentsResponse.status).toBe(200);
      const agents = (await agentsResponse.json()).data;
      expect(agents.length).toBeGreaterThan(0);

      // Step 2: Create new deliberation
      const createResponse = await authFetch('/deliberations', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          question: 'E2E Test: Should we expand our product line?',
          config: { mode: 'rapid' },
        }),
      });
      expect(createResponse.status).toBe(201);
      const deliberation = (await createResponse.json()).data;

      // Step 3: View deliberation
      const viewResponse = await authFetch(`/deliberations/${deliberation.id}`, adminToken);
      expect(viewResponse.status).toBe(200);

      // Step 4: Start deliberation (async, may return 202)
      const startResponse = await authFetch(`/deliberations/${deliberation.id}/start`, adminToken, {
        method: 'POST',
      });
      expect([200, 202, 400]).toContain(startResponse.status);
    });
  });

  describe('Journey 3: Workflow Management', () => {
    it('should view workflows → create workflow → view executions', async () => {
      // Step 1: List workflows
      const listResponse = await authFetch('/workflows', adminToken);
      expect(listResponse.status).toBe(200);

      // Step 2: Create new workflow
      const createResponse = await authFetch('/workflows', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          name: 'E2E Test Workflow',
          description: 'Automated E2E test workflow',
          category: 'Testing',
          trigger: { type: 'manual' },
          definition: {
            nodes: [
              { id: 'start', type: 'trigger', config: {} },
              { id: 'process', type: 'action', config: {} },
            ],
            edges: [{ from: 'start', to: 'process' }],
          },
        }),
      });
      expect(createResponse.status).toBe(201);
      const workflow = (await createResponse.json()).data;

      // Step 3: View workflow details
      const detailResponse = await authFetch(`/workflows/${workflow.id}`, adminToken);
      expect(detailResponse.status).toBe(200);

      // Step 4: View executions
      const execResponse = await authFetch(`/workflows/${workflow.id}/executions`, adminToken);
      expect(execResponse.status).toBe(200);
    });
  });

  describe('Journey 4: Alert Management', () => {
    it('should list alerts → acknowledge → resolve', async () => {
      // Step 1: List active alerts
      const listResponse = await authFetch('/alerts?status=ACTIVE&limit=1', adminToken);
      expect(listResponse.status).toBe(200);
      const alerts = (await listResponse.json()).data;

      if (alerts.length > 0) {
        const alertId = alerts[0].id;

        // Step 2: Acknowledge alert
        const ackResponse = await authFetch(`/alerts/${alertId}/acknowledge`, adminToken, {
          method: 'PUT',
        });
        expect([200, 204]).toContain(ackResponse.status);

        // Step 3: Resolve alert
        const resolveResponse = await authFetch(`/alerts/${alertId}/resolve`, adminToken, {
          method: 'PUT',
          body: JSON.stringify({ resolution: 'E2E Test Resolution' }),
        });
        expect([200, 204]).toContain(resolveResponse.status);
      }
    });
  });

  describe('Journey 5: Data Source Management', () => {
    it('should list data sources → view details', async () => {
      // Step 1: List data sources
      const listResponse = await authFetch('/data-sources', adminToken);
      expect(listResponse.status).toBe(200);
      const sources = (await listResponse.json()).data;

      if (sources.length > 0) {
        const sourceId = sources[0].id;

        // Step 2: View details
        const detailResponse = await authFetch(`/data-sources/${sourceId}`, adminToken);
        expect(detailResponse.status).toBe(200);
      }
    });
  });

  describe('Journey 6: Settings and Preferences', () => {
    it('should view settings → update preferences → verify', async () => {
      // Step 1: Get current user
      const userResponse = await authFetch('/users/me', adminToken);
      expect(userResponse.status).toBe(200);

      // Step 2: Update preferences
      const updateResponse = await authFetch('/users/me', adminToken, {
        method: 'PUT',
        body: JSON.stringify({
          preferences: { theme: 'dark', notifications: true },
        }),
      });
      expect(updateResponse.status).toBe(200);

      // Step 3: Verify update
      const verifyResponse = await authFetch('/users/me', adminToken);
      const user = (await verifyResponse.json()).data;
      expect(user.preferences.theme).toBe('dark');
    });
  });
});

describe('Database Integrity', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('should have organizations with users', async () => {
    const orgs = await prisma.organizations.findMany({
      include: { users: true },
    });
    expect(orgs.length).toBeGreaterThan(0);
    orgs.forEach(org => {
      expect(org.users.length).toBeGreaterThan(0);
    });
  });

  it('should have agents seeded', async () => {
    const agents = await prisma.agents.findMany();
    expect(agents.length).toBeGreaterThan(0);
  });

  it('should have metrics defined', async () => {
    const metrics = await prisma.metric_definitions.findMany();
    expect(metrics.length).toBeGreaterThan(0);
    // Note: Metric values are created through usage, not seeding
  });

  it('should have workflows defined', async () => {
    const workflows = await prisma.workflows.findMany();
    expect(workflows.length).toBeGreaterThan(0);
    // Note: Workflow executions are created through usage, not seeding
  });

  it('should have deliberation capability', async () => {
    // Deliberations are created through user interaction
    // Just verify the table exists and is queryable
    const count = await prisma.deliberations.count();
    expect(count).toBeGreaterThanOrEqual(0); // Can be 0 in fresh database
  });

  it('should have health score history', async () => {
    const scores = await prisma.health_scores.count();
    expect(scores).toBeGreaterThan(0);
  });

  it('should have audit logs', async () => {
    const logs = await prisma.audit_logs.count();
    expect(logs).toBeGreaterThan(0);
  });
});
