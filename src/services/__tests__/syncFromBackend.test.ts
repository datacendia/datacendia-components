/**
 * Service Backend Sync Tests
 *
 * Verifies that all 7 frontend-only services correctly hydrate their internal
 * state from backend REST endpoints via their new syncFromBackend() methods.
 *
 * Each test:
 *  1. Mocks the global fetch to return a controlled response
 *  2. Invokes service.syncFromBackend()
 *  3. Asserts the service's public getters reflect the mocked backend data
 *  4. Asserts graceful fallback when backend is unavailable (fetch rejects)
 *
 * @module services/__tests__/syncFromBackend.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// IMPORTANT: services must be imported AFTER we set up the fetch mock in beforeEach,
// because their singleton constructors seed default data. We use dynamic imports.

describe('Service.syncFromBackend()', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    (globalThis as any).fetch = fetchMock;
    // Reset localStorage between tests to avoid cross-test pollution of service caches
    if (typeof localStorage !== 'undefined') localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Helper: build a successful ApiResponse-shaped fetch response.
  // The real ApiClient uses response.text() + JSON.parse, so we provide text().
  const ok = (data: unknown) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    text: async () => JSON.stringify({ success: true, data }),
  });

  const okBare = (body: unknown) => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    text: async () => JSON.stringify(body),
  });

  // ------------------------------------------------------------------------
  // WorkflowPersistenceService
  // ------------------------------------------------------------------------
  describe('WorkflowPersistenceService', () => {
    it('hydrates workflows from /workflows and populates listWorkflows()', async () => {
      const { WorkflowPersistenceService } = await import('../WorkflowPersistenceService');
      const mockWorkflow = {
        id: 'wf-sync-test',
        name: 'Synced Workflow',
        description: 'From backend',
        steps: [],
        connections: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        runCount: 0,
        status: 'ready',
        tags: [],
      };
      fetchMock.mockResolvedValueOnce(ok([mockWorkflow]));

      const n = await WorkflowPersistenceService.syncFromBackend();
      expect(n).toBe(1);
      expect(WorkflowPersistenceService.isBackendSynced()).toBe(true);
      const list = WorkflowPersistenceService.listWorkflows();
      expect(list.some(w => w.id === 'wf-sync-test' && w.name === 'Synced Workflow')).toBe(true);
    });

    it('returns 0 gracefully when backend unavailable', async () => {
      const { WorkflowPersistenceService } = await import('../WorkflowPersistenceService');
      fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      const n = await WorkflowPersistenceService.syncFromBackend();
      expect(n).toBe(0);
    });
  });

  // ------------------------------------------------------------------------
  // VetoService
  // ------------------------------------------------------------------------
  describe('VetoService', () => {
    it('hydrates decisions from /veto/decisions and populates getAllDecisions()', async () => {
      const { vetoService } = await import('../VetoService');
      const mockDecision = {
        id: 'veto-sync-test',
        title: 'Synced Veto Proposal',
        description: 'From backend',
        category: 'security',
        status: 'pending',
        submittedBy: 'user-1',
        submittedAt: '2026-01-01T00:00:00Z',
        reviews: [],
        concerns: [],
      };
      fetchMock.mockResolvedValueOnce(ok([mockDecision]));

      const n = await vetoService.syncFromBackend();
      expect(n).toBe(1);
      const all = vetoService.getAllDecisions();
      expect(all.some(d => d.id === 'veto-sync-test')).toBe(true);
      // Date normalization
      const found = all.find(d => d.id === 'veto-sync-test');
      expect(found?.submittedAt).toBeInstanceOf(Date);
    });

    it('accepts legacy response shape { decisions: [...] }', async () => {
      const { vetoService } = await import('../VetoService');
      fetchMock.mockResolvedValueOnce(okBare({
        success: true,
        decisions: [{
          id: 'veto-legacy-shape',
          title: 'Legacy shape',
          description: '',
          category: 'security',
          status: 'pending',
          submittedBy: 'user-1',
          submittedAt: '2026-01-01T00:00:00Z',
          reviews: [],
          concerns: [],
        }],
      }));
      const n = await vetoService.syncFromBackend();
      expect(n).toBe(1);
    });
  });

  // ------------------------------------------------------------------------
  // UnionService
  // ------------------------------------------------------------------------
  describe('UnionService', () => {
    it('hydrates employees from /union/employees', async () => {
      const { unionService } = await import('../UnionService');
      const mockEmployee = {
        id: 'emp-sync-test',
        name: 'Sync Test Employee',
        email: 'sync@test.com',
        department: 'eng',
        role: 'engineer',
        level: 'senior',
        startDate: '2023-01-01T00:00:00Z',
        status: 'active',
        salary: 100000,
        avgHoursPerWeek: 40,
        ptoDaysRemaining: 20,
        burnoutScore: 10,
        burnoutLevel: 'healthy',
        burnoutFactors: [],
        rightsViolations: [],
        requests: [],
        auditLog: [],
      };
      fetchMock.mockResolvedValueOnce(ok([mockEmployee]));

      const n = await unionService.syncFromBackend();
      expect(n).toBe(1);
      const all = unionService.getAllEmployees();
      expect(all.some(e => e.id === 'emp-sync-test')).toBe(true);
    });
  });

  // ------------------------------------------------------------------------
  // PersonaForgeService
  // ------------------------------------------------------------------------
  describe('PersonaForgeService', () => {
    it('hydrates personas from /persona/twins', async () => {
      const { personaForgeService } = await import('../PersonaForgeService');
      const mockPersona = {
        id: 'persona-sync-test',
        role: 'cfo',
        name: 'Synced Persona',
        status: 'ready',
        trainingProgress: 100,
        createdAt: '2026-01-01T00:00:00Z',
        lastActive: '2026-01-01T00:00:00Z',
        knowledgeCutoff: '2026-01-01T00:00:00Z',
        capabilities: [],
        interactionCount: 0,
        modelVersion: 'v1',
        trainingDatasets: [],
      };
      fetchMock.mockResolvedValueOnce(ok([mockPersona]));

      const n = await personaForgeService.syncFromBackend();
      expect(n).toBe(1);
      const all = personaForgeService.getPersonas();
      expect(all.some(p => p.id === 'persona-sync-test')).toBe(true);
    });
  });

  // ------------------------------------------------------------------------
  // EnterpriseService
  // ------------------------------------------------------------------------
  describe('EnterpriseService', () => {
    it('hydrates executives from /enterprise/regent/advisors and getExecutives() returns backend data', async () => {
      const { enterpriseService } = await import('../EnterpriseService');
      const mockExec = {
        id: 'exec-sync-test',
        role: 'cfo',
        name: 'Synced CFO',
        title: 'Chief Financial Officer',
        expertise: ['finance'],
        personality: 'analytical',
        avatarUrl: '',
        isActive: true,
        speakingStatus: 'idle',
      };
      fetchMock.mockResolvedValueOnce(okBare({ advisors: [mockExec] }));

      const n = await enterpriseService.syncFromBackend();
      expect(n).toBe(1);
      const execs = enterpriseService.getExecutives();
      expect(execs.some(e => e.id === 'exec-sync-test')).toBe(true);
    });

    it('falls back to defaults when backend returns 403 (non-admin user)', async () => {
      const { enterpriseService } = await import('../EnterpriseService');
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => JSON.stringify({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        }),
      });
      const n = await enterpriseService.syncFromBackend();
      expect(n).toBe(0);
      const execs = enterpriseService.getExecutives();
      // Default EXECUTIVES list (8 C-suite roles) still available
      expect(execs.length).toBeGreaterThan(0);
    });
  });

  // ------------------------------------------------------------------------
  // LedgerService
  // ------------------------------------------------------------------------
  describe('LedgerService', () => {
    it('hydrates entries from /ledger/entries', async () => {
      const { ledgerService } = await import('../LedgerService');
      const mockEntry = {
        id: 'entry-sync-test',
        sequence: 999,
        timestamp: '2026-01-01T00:00:00Z',
        eventType: 'decision.proposed',
        actor: { id: 'user-1', type: 'human', name: 'test' },
        payload: {},
        previousHash: '0000',
        hash: 'abc123',
        compliance: [],
        verified: false,
      };
      fetchMock
        .mockResolvedValueOnce(ok([mockEntry]))
        .mockResolvedValueOnce(ok([])); // /ledger/decisions

      const n = await ledgerService.syncFromBackend();
      expect(n).toBeGreaterThanOrEqual(1);
    });
  });

  // ------------------------------------------------------------------------
  // DecisionIntelligenceService
  // ------------------------------------------------------------------------
  describe('DecisionIntelligenceService', () => {
    it('hydrates ghost-board, pre-mortem, and pending decisions from decision-intel endpoints', async () => {
      const { decisionIntelligenceService } = await import('../DecisionIntelligenceService');

      fetchMock
        .mockResolvedValueOnce(ok([{ id: 'gb-1', runAt: '2026-01-01T00:00:00Z' }]))
        .mockResolvedValueOnce(ok([{ id: 'pm-1', analyzedAt: '2026-01-01T00:00:00Z' }]))
        .mockResolvedValueOnce(ok({ pendingDecisions: [{ id: 'pd-1', createdAt: '2026-01-01T00:00:00Z', title: 'Test', department: 'General', owner: 'Unassigned', daysStuck: 1, estimatedDailyCost: 100, totalCostAccrued: 100, priority: 'medium', status: 'Pending', blockedBy: [] }] }));

      const n = await decisionIntelligenceService.syncFromBackend();
      expect(n).toBe(3);
    });

    it('returns 0 when all backend endpoints fail', async () => {
      const { decisionIntelligenceService } = await import('../DecisionIntelligenceService');
      fetchMock
        .mockRejectedValueOnce(new Error('ECONNREFUSED'))
        .mockRejectedValueOnce(new Error('ECONNREFUSED'))
        .mockRejectedValueOnce(new Error('ECONNREFUSED'));
      const n = await decisionIntelligenceService.syncFromBackend();
      expect(n).toBe(0);
    });
  });
});
