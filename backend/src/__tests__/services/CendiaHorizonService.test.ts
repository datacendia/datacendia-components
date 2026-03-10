/**
 * CendiaHorizon™ Service Tests
 * 
 * Tests for predictive decision intelligence and cascade analysis
 * @module __tests__/services/CendiaHorizonService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies before import
vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../utils/servicePersistence.js', () => ({
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../services/CendiaOrbitService.js', () => {
  const mockOrbit = {
    addNode: vi.fn(),
    addEdge: vi.fn(),
    loadGraph: vi.fn(),
    getStats: vi.fn().mockReturnValue({ nodeCount: 0, edgeCount: 0 }),
    getNode: vi.fn().mockReturnValue({ name: 'TestNode' }),
    runPropagation: vi.fn().mockResolvedValue({
      runId: 'orbit-run-1',
      directImpacts: [
        { nodeId: 'n1', nodeName: 'Revenue', nodeType: 'kpi', impactScore: 0.7, confidence: 0.8, latencyDays: 30, order: 1, paths: [{ nodes: ['a', 'b'] }] },
      ],
      rippleImpacts: [
        { nodeId: 'n2', nodeName: 'Morale', nodeType: 'team', impactScore: 0.4, confidence: 0.6, latencyDays: 60, order: 2, paths: [{ nodes: ['a', 'c'] }] },
      ],
      butterflyImpacts: [
        { nodeId: 'n3', nodeName: 'Reputation', nodeType: 'brand', impactScore: 0.2, confidence: 0.3, latencyDays: 180, order: 3, paths: [{ nodes: ['a', 'd'] }] },
      ],
    }),
    findFeedbackLoops: vi.fn().mockReturnValue([]),
  };
  return {
    orbitService: mockOrbit,
    CendiaOrbitService: vi.fn().mockImplementation(() => mockOrbit),
    NodeType: {},
    EdgeType: {},
  };
});

// Import after mocks
const { cendiaHorizonService } = await import('../../services/CendiaHorizonService.js');
type CendiaHorizonServiceType = typeof cendiaHorizonService;

describe('CendiaHorizonService', () => {
  // =========================================================================
  // SERVICE INITIALIZATION
  // =========================================================================

  describe('initialization', () => {
    it('should export a singleton instance', () => {
      expect(cendiaHorizonService).toBeDefined();
    });

    it('should report available status', () => {
      const status = cendiaHorizonService.getStatus();
      expect(status).toHaveProperty('available', true);
      expect(status).toHaveProperty('simulationsCount');
      expect(typeof status.simulationsCount).toBe('number');
    });
  });

  // =========================================================================
  // HEALTH & DASHBOARD
  // =========================================================================

  describe('getHealth()', () => {
    it('should return health status', async () => {
      const health = await cendiaHorizonService.getHealth();
      expect(health.healthy).toBe(true);
      expect(health.service).toBe('CendiaHorizon');
      expect(health.timestamp).toBeInstanceOf(Date);
      expect(health.details).toHaveProperty('uptime');
      expect(health.details).toHaveProperty('memoryMB');
    });
  });

  describe('getDashboard()', () => {
    it('should return dashboard data', async () => {
      const dashboard = await cendiaHorizonService.getDashboard();
      expect(dashboard.serviceName).toBe('CendiaHorizon');
      expect(dashboard.status).toBe('operational');
      expect(typeof dashboard.recordCount).toBe('number');
      expect(dashboard.lastActivity).toBeInstanceOf(Date);
      expect(typeof dashboard.uptime).toBe('number');
      expect(typeof dashboard.metrics).toBe('object');
    });
  });

  // =========================================================================
  // ORACLE SIMULATION
  // =========================================================================

  describe('createSimulation()', () => {
    it('should create a simulation with valid query', async () => {
      const sim = await cendiaHorizonService.createSimulation({
        question: 'Should we expand into the EU market?',
        timeHorizon: '1y' as any,
        branchCount: 3,
        organizationId: 'org-1',
      });

      expect(sim).toBeDefined();
      expect(sim.id).toMatch(/^sim-/);
      expect(sim.question).toBe('Should we expand into the EU market?');
      expect(sim.status).toBe('complete');
      expect(sim.universes).toBeInstanceOf(Array);
      expect(sim.universes.length).toBeGreaterThan(0);
      expect(sim.historicalEchoes).toBeInstanceOf(Array);
      expect(sim.pivotalMoments).toBeInstanceOf(Array);
      expect(sim.recommendation).toBeDefined();
    });

    it('should generate universes with outcomes', async () => {
      const sim = await cendiaHorizonService.createSimulation({
        question: 'Should we hire 50 engineers?',
        timeHorizon: '90d' as any,
        branchCount: 4,
      });

      for (const universe of sim.universes) {
        expect(universe.id).toBeDefined();
        expect(universe.name).toBeDefined();
        expect(typeof universe.probability).toBe('number');
        expect(universe.timeline).toBeInstanceOf(Array);
        expect(universe.outcomes).toBeDefined();
        expect(universe.riskProfile).toBeDefined();
      }
    });

    it('should populate metadata', async () => {
      const sim = await cendiaHorizonService.createSimulation({
        question: 'Should we pivot to B2B?',
        timeHorizon: '180d' as any,
        branchCount: 2,
      });

      expect(sim.metadata).toBeDefined();
      expect(sim.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('getSimulation()', () => {
    it('should retrieve a created simulation', async () => {
      const sim = await cendiaHorizonService.createSimulation({
        question: 'Test retrieval',
        timeHorizon: '30d' as any,
        branchCount: 2,
      });

      const retrieved = cendiaHorizonService.getSimulation(sim.id);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(sim.id);
      expect(retrieved!.question).toBe('Test retrieval');
    });

    it('should return undefined for non-existent simulation', () => {
      const result = cendiaHorizonService.getSimulation('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllSimulations()', () => {
    it('should return array of simulations', () => {
      const all = cendiaHorizonService.getAllSimulations();
      expect(all).toBeInstanceOf(Array);
    });
  });

  // =========================================================================
  // EXPRESS FORECAST
  // =========================================================================

  describe('getExpressForecast()', () => {
    it('should return quick forecast without full simulation', async () => {
      const forecast = await cendiaHorizonService.getExpressForecast(
        'What happens if we cut marketing budget by 30%?',
        { timeHorizon: '90d' as any }
      );

      expect(forecast).toBeDefined();
      expect(forecast.question).toBe('What happens if we cut marketing budget by 30%?');
      expect(forecast.bestCase).toBeDefined();
      expect(forecast.mostLikely).toBeDefined();
      expect(forecast.worstCase).toBeDefined();
      expect(forecast.recommendation).toBeDefined();
      expect(typeof forecast.confidence).toBe('number');
    });

    it('should default timeHorizon to 90d when not specified', async () => {
      const forecast = await cendiaHorizonService.getExpressForecast('Test question');
      expect(forecast.timeHorizon).toBe('90d');
    });

    it('should include historical echoes', async () => {
      const forecast = await cendiaHorizonService.getExpressForecast('Should we acquire a competitor?');
      expect(forecast.historicalEchoes).toBeInstanceOf(Array);
    });
  });

  // =========================================================================
  // CASCADE ANALYSIS
  // =========================================================================

  describe('analyzeChange()', () => {
    it('should analyze a change and return cascade report', async () => {
      const report = await cendiaHorizonService.analyzeChange({
        id: 'change-1',
        proposedAt: new Date(),
        description: 'Replace legacy CRM with new platform',
        category: 'technology',
        affectedAssets: ['asset-crm'],
        proposedBy: 'cto@example.com',
        urgency: 'medium',
      } as any);

      expect(report).toBeDefined();
      expect(report.id).toBeDefined();
      expect(report.status).toBe('draft');
      expect(report.consequences).toBeInstanceOf(Array);
      expect(typeof report.totalRiskScore).toBe('number');
      expect(report.evidenceHash).toBeDefined();
      expect(report.evidenceHash.length).toBe(64); // SHA-256 hex
    });

    it('should generate mitigations for identified risks', async () => {
      const report = await cendiaHorizonService.analyzeChange({
        description: 'Major org restructuring',
        category: 'organizational',
        affectedAssets: ['asset-hr'],
        proposedBy: 'ceo@example.com',
        urgency: 'high',
      } as any);

      expect(report.mitigations).toBeInstanceOf(Array);
      expect(report.guardrails).toBeInstanceOf(Array);
      expect(report.alternatives).toBeInstanceOf(Array);
      expect(report.alternatives!.length).toBeGreaterThan(0);
    });

    it('should include recommendation with action', async () => {
      const report = await cendiaHorizonService.analyzeChange({
        description: 'Minor config change',
        category: 'technical',
        affectedAssets: ['asset-config'],
        proposedBy: 'dev@example.com',
        urgency: 'low',
      } as any);

      expect(report.recommendation).toBeDefined();
      expect(['proceed', 'proceed_with_caution', 'reconsider', 'reject']).toContain(report.recommendation);
      expect(report.rationale).toBeDefined();
    });
  });

  // =========================================================================
  // CASCADE REPORT MANAGEMENT
  // =========================================================================

  describe('getCascadeReport()', () => {
    it('should retrieve a cascade report by ID', async () => {
      const report = await cendiaHorizonService.analyzeChange({
        description: 'Test report retrieval',
        category: 'test',
        affectedAssets: ['asset-test'],
        proposedBy: 'test@example.com',
        urgency: 'low',
      } as any);

      const retrieved = cendiaHorizonService.getCascadeReport(report.id);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(report.id);
    });

    it('should return undefined for non-existent report', () => {
      expect(cendiaHorizonService.getCascadeReport('not-found')).toBeUndefined();
    });
  });

  describe('listCascadeReports()', () => {
    it('should return reports sorted by timestamp descending', () => {
      const reports = cendiaHorizonService.listCascadeReports();
      expect(reports).toBeInstanceOf(Array);
      for (let i = 1; i < reports.length; i++) {
        expect(reports[i - 1].timestamp.getTime()).toBeGreaterThanOrEqual(reports[i].timestamp.getTime());
      }
    });
  });

  describe('signCascadeReport()', () => {
    it('should sign a report and update status', async () => {
      const report = await cendiaHorizonService.analyzeChange({
        description: 'Test signing',
        category: 'test',
        affectedAssets: ['asset-sign'],
        proposedBy: 'test@example.com',
        urgency: 'low',
      } as any);

      await cendiaHorizonService.signCascadeReport(report.id, 'signer@example.com');

      const signed = cendiaHorizonService.getCascadeReport(report.id);
      expect(signed!.signedBy).toBe('signer@example.com');
      expect(signed!.signedAt).toBeInstanceOf(Date);
      expect(signed!.status).toBe('in_review');
    });

    it('should throw for non-existent report', async () => {
      await expect(
        cendiaHorizonService.signCascadeReport('not-found', 'signer')
      ).rejects.toThrow('Report not found');
    });
  });

  describe('updateCascadeReportStatus()', () => {
    it('should update report status', async () => {
      const report = await cendiaHorizonService.analyzeChange({
        description: 'Test status update',
        category: 'test',
        affectedAssets: ['asset-status'],
        proposedBy: 'test@example.com',
        urgency: 'low',
      } as any);

      cendiaHorizonService.updateCascadeReportStatus(report.id, 'approved');
      const updated = cendiaHorizonService.getCascadeReport(report.id);
      expect(updated!.status).toBe('approved');
    });

    it('should throw for non-existent report', () => {
      expect(() =>
        cendiaHorizonService.updateCascadeReportStatus('not-found', 'approved')
      ).toThrow('Report not found');
    });
  });

  // =========================================================================
  // GRAPH HELPERS
  // =========================================================================

  describe('graph delegation', () => {
    // FAILS IF: addNode throws or method doesn't exist
    it('should delegate addNode to orbit without throwing', () => {
      const node = { id: 'test-node', name: 'Test', type: 'kpi' as any };
      expect(() => cendiaHorizonService.addNode(node as any)).not.toThrow();
    });

    // FAILS IF: addEdge throws or method doesn't exist
    it('should delegate addEdge to orbit without throwing', () => {
      const edge = { id: 'test-edge', source: 'a', target: 'b', type: 'depends_on' as any };
      expect(() => cendiaHorizonService.addEdge(edge as any)).not.toThrow();
    });

    it('should return graph stats', () => {
      const stats = cendiaHorizonService.getGraphStats();
      expect(stats).toBeDefined();
    });

    it('should return orbit service instance', () => {
      const orbit = cendiaHorizonService.getOrbitService();
      expect(orbit).toBeDefined();
    });
  });

  // =========================================================================
  // PREDICTION ACCURACY
  // =========================================================================

  describe('getPredictionAccuracy()', () => {
    it('should return accuracy metrics for organization', async () => {
      const accuracy = await cendiaHorizonService.getPredictionAccuracy('org-1');
      expect(accuracy).toBeDefined();
      expect(typeof accuracy).toBe('object');
    });
  });

  // =========================================================================
  // SIMULATION COMPARISON
  // =========================================================================

  describe('compareSimulations()', () => {
    it('should compare two simulations', async () => {
      const sim1 = await cendiaHorizonService.createSimulation({
        question: 'Option A',
        timeHorizon: '90d' as any,
        branchCount: 2,
      });
      const sim2 = await cendiaHorizonService.createSimulation({
        question: 'Option B',
        timeHorizon: '90d' as any,
        branchCount: 2,
      });

      const comparison = await cendiaHorizonService.compareSimulations(sim1.id, sim2.id);
      expect(comparison).toBeDefined();
    });

    it('should throw for non-existent simulations', async () => {
      await expect(
        cendiaHorizonService.compareSimulations('not-found-1', 'not-found-2')
      ).rejects.toThrow();
    });
  });

  // =========================================================================
  // TIMELINE DIVERGENCE
  // =========================================================================

  describe('analyzeTimelineDivergence()', () => {
    it('should analyze divergence for a simulation', async () => {
      const sim = await cendiaHorizonService.createSimulation({
        question: 'Test divergence',
        timeHorizon: '90d' as any,
        branchCount: 3,
      });

      const divergence = await cendiaHorizonService.analyzeTimelineDivergence(sim.id);
      expect(divergence).toBeDefined();
    });

    it('should throw for non-existent simulation', async () => {
      await expect(
        cendiaHorizonService.analyzeTimelineDivergence('not-found')
      ).rejects.toThrow();
    });
  });

  // =========================================================================
  // STRATEGIC FORESIGHT DASHBOARD
  // =========================================================================

  describe('getStrategicForesightDashboard()', () => {
    it('should return foresight dashboard for org', async () => {
      const dashboard = await cendiaHorizonService.getStrategicForesightDashboard('org-1');
      expect(dashboard).toBeDefined();
    });
  });
});
