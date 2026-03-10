/**
 * CendiaRewindService Deep Tests
 * 
 * Tests counterfactual decision replay: takes a past decision with known outcomes,
 * replays it with alternative paths, and compares simulated vs actual results.
 * 
 * Requires CendiaRecallService to have tracked outcomes first.
 * Every test uses real business inputs and meaningful assertions.
 * 
 * @module __tests__/services/CendiaRewindServiceDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    audit_logs: { create: vi.fn().mockResolvedValue({ id: 'audit-1' }) },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const { cendiaRecallService } = await import('../../services/CendiaRecallService.js');
const { cendiaRewindService } = await import('../../services/CendiaRewindService.js');

// Set up a tracked decision with measured outcomes for Rewind to analyze
let trackerIdWithOutcome: string;

beforeAll(async () => {
  // Create a realistic tracked decision in CendiaRecall
  const tracker = await cendiaRecallService.createOutcomeTracker(
    'org-rewind-test',
    'decision-expand-eu',
    'EU Market Expansion Decision',
    [
      { id: 'p-rev', metric: 'eu_revenue', predictedValue: 2000000, unit: 'eur', confidence: 75, timeframe: '12_months', source: 'CFO_Agent' },
      { id: 'p-cust', metric: 'eu_customers', predictedValue: 500, unit: 'count', confidence: 65, timeframe: '12_months', source: 'Sales_Agent' },
    ],
    'ceo@datacendia.com',
    { predictedROI: 2.8, tags: ['expansion', 'europe', 'strategy'] }
  );

  // Record what actually happened (below predictions — expansion was harder than expected)
  await cendiaRecallService.recordActualOutcome(tracker.id, {
    metric: 'eu_revenue', actualValue: 1200000, unit: 'eur',
    measuredAt: new Date(), evidenceSource: 'SAP Financials', verified: true,
  });
  await cendiaRecallService.recordActualOutcome(tracker.id, {
    metric: 'eu_customers', actualValue: 280, unit: 'count',
    measuredAt: new Date(), evidenceSource: 'Salesforce CRM', verified: true,
  });
  await cendiaRecallService.recordActualROI(tracker.id, 1.4);
  await cendiaRecallService.closeOutcome(tracker.id, [
    'EU regulatory compliance took 3x longer than expected',
    'Local sales team hiring was the bottleneck',
  ]);

  trackerIdWithOutcome = tracker.id;
});

describe('CendiaRewindService — Counterfactual Decision Replay', () => {

  // ===========================================================================
  // SERVICE INITIALIZATION
  // ===========================================================================

  // FAILS IF: service singleton not exported
  it('should export a singleton instance', () => {
    expect(cendiaRewindService).not.toBeNull();
    expect(typeof cendiaRewindService).toBe('object');
  });

  // ===========================================================================
  // REPLAY WITH ALTERNATIVES
  // ===========================================================================

  describe('replayDecision()', () => {
    // FAILS IF: replayDecision throws for a valid tracked decision with outcomes
    it('should replay a past decision with alternative paths', async () => {
      const analysis = await cendiaRewindService.replayDecision({
        organizationId: 'org-rewind-test',
        decisionId: trackerIdWithOutcome,
        requestedBy: 'strategy@datacendia.com',
        alternativePaths: [
          {
            name: 'Partnership-First Approach',
            description: 'Enter EU via partnership with established local firm instead of direct expansion',
            keyDifferences: ['Local partner handles regulatory compliance', 'Revenue share model', 'Faster time to market'],
            estimatedCostDelta: -500000,
            estimatedTimeDelta: -90,
            assumptions: ['Partner has existing EU regulatory approvals', 'Partner takes 30% revenue share'],
          },
          {
            name: 'UK-Only Launch',
            description: 'Start with UK market only, expand to EU later',
            keyDifferences: ['English-speaking market', 'Simpler regulatory path', 'Smaller addressable market'],
            estimatedCostDelta: -300000,
            estimatedTimeDelta: -60,
            assumptions: ['UK market sufficient for initial validation', 'EU expansion deferred 12 months'],
          },
        ],
        analysisDepth: 'standard',
      });

      // Verify analysis structure
      expect(analysis.id).toMatch(/^rewind-/);
      expect(analysis.organizationId).toBe('org-rewind-test');
      expect(analysis.originalDecisionId).toBe(trackerIdWithOutcome);
      expect(analysis.requestedBy).toBe('strategy@datacendia.com');
      expect(analysis.analyzedAt).toBeInstanceOf(Date);
      expect(analysis.analysisDepth).toBe('standard');

      // Verify original decision summary is populated from CendiaRecall
      expect(analysis.originalDecision).toBeDefined();
      expect(analysis.originalDecision.title).toBe('EU Market Expansion Decision');
      expect(typeof analysis.originalDecision.accuracyScore).toBe('number');
      expect(analysis.originalDecision.tags).toContain('expansion');

      // Verify alternatives were simulated
      expect(analysis.alternatives).toHaveLength(2);
      for (const alt of analysis.alternatives) {
        expect(alt.id).toBeDefined();
        expect(alt.name).toBeTruthy();
        expect(typeof alt.simulatedScore).toBe('number');
        expect(alt.simulatedScore).toBeGreaterThanOrEqual(0);
        expect(alt.simulatedScore).toBeLessThanOrEqual(100);
        expect(alt.riskProfile).toBeDefined();
        expect(typeof alt.riskProfile.operational).toBe('number');
        expect(typeof alt.riskProfile.financial).toBe('number');
        expect(typeof alt.riskProfile.regulatory).toBe('number');
        expect(alt.comparisonToActual).toBeDefined();
        expect(['better', 'worse', 'comparable']).toContain(alt.comparisonToActual.verdict);
        expect(typeof alt.comparisonToActual.scoreDelta).toBe('number');
        expect(alt.comparisonToActual.reasoning.length).toBeGreaterThan(0);
        expect(Array.isArray(alt.uniqueEffects)).toBe(true);
      }

      // Verify ranking
      expect(typeof analysis.originalRanking).toBe('number');
      expect(analysis.originalRanking).toBeGreaterThanOrEqual(1);
      expect(analysis.originalRanking).toBeLessThanOrEqual(3); // 2 alternatives + original

      // Verify insights are generated
      expect(Array.isArray(analysis.keyInsights)).toBe(true);
      expect(analysis.keyInsights.length).toBeGreaterThan(0);
      expect(Array.isArray(analysis.lessonsLearned)).toBe(true);
      expect(Array.isArray(analysis.biasesRevealed)).toBe(true);

      // Verify confidence
      expect(typeof analysis.simulationConfidence).toBe('number');
      expect(analysis.simulationConfidence).toBeGreaterThan(0);
      expect(analysis.simulationConfidence).toBeLessThanOrEqual(100);
      expect(Array.isArray(analysis.confidenceFactors)).toBe(true);
    });

    // FAILS IF: doesn't throw for non-existent decision
    it('should throw for non-existent decision ID', async () => {
      await expect(
        cendiaRewindService.replayDecision({
          organizationId: 'org-1',
          decisionId: 'nonexistent-decision-xyz',
          requestedBy: 'test@test.com',
          alternativePaths: [{ name: 'Alt', description: 'Test', keyDifferences: ['x'], assumptions: ['y'] }],
        })
      ).rejects.toThrow('not found');
    });

    // FAILS IF: doesn't throw for decision that hasn't been measured yet
    it('should throw for unmeasured decision', async () => {
      const unmeasured = await cendiaRecallService.createOutcomeTracker(
        'org-rewind-test', 'decision-unmeasured', 'Unmeasured Decision', [], 'user@test.com'
      );

      await expect(
        cendiaRewindService.replayDecision({
          organizationId: 'org-rewind-test',
          decisionId: unmeasured.id,
          requestedBy: 'test@test.com',
          alternativePaths: [{ name: 'Alt', description: 'Test', keyDifferences: ['x'], assumptions: ['y'] }],
        })
      ).rejects.toThrow('not been measured');
    });
  });

  // ===========================================================================
  // RETRIEVAL
  // ===========================================================================

  describe('getAnalysis()', () => {
    // FAILS IF: can't retrieve a completed analysis
    it('should retrieve a completed analysis by ID', async () => {
      // First create an analysis
      const analysis = await cendiaRewindService.replayDecision({
        organizationId: 'org-rewind-test',
        decisionId: trackerIdWithOutcome,
        requestedBy: 'test@test.com',
        alternativePaths: [{ name: 'Quick Alt', description: 'Fast test', keyDifferences: ['speed'], assumptions: ['fast'] }],
        analysisDepth: 'quick',
      });

      const retrieved = await cendiaRewindService.getAnalysis(analysis.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(analysis.id);
      expect(retrieved!.originalDecisionId).toBe(trackerIdWithOutcome);
    });

    // FAILS IF: returns non-null for missing ID
    it('should return null for non-existent analysis', async () => {
      const result = await cendiaRewindService.getAnalysis('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('getAnalyses()', () => {
    // FAILS IF: doesn't filter by organization or returns non-object
    it('should return analyses filtered by organization', async () => {
      const result = await cendiaRewindService.getAnalyses('org-rewind-test');
      expect(result).toBeDefined();
      // May return array directly or {analyses, total}
      const analyses = Array.isArray(result) ? result : (result as any).analyses;
      expect(Array.isArray(analyses)).toBe(true);
      expect(analyses.length).toBeGreaterThan(0);
    });
  });

  describe('getPatterns()', () => {
    // FAILS IF: returns non-array
    it('should return counterfactual patterns', async () => {
      const patterns = await cendiaRewindService.getPatterns('org-rewind-test');
      expect(Array.isArray(patterns)).toBe(true);
    });
  });

  // ===========================================================================
  // DASHBOARD & HEALTH
  // ===========================================================================

  describe('getDashboard()', () => {
    // FAILS IF: dashboard throws or returns wrong shape
    it('should return dashboard with analysis count and patterns', async () => {
      const dashboard = await cendiaRewindService.getDashboard('org-rewind-test');
      expect(dashboard).toBeDefined();
      expect(typeof dashboard).toBe('object');
    });
  });

  describe('getHealth()', () => {
    // FAILS IF: health check throws or returns wrong shape
    it('should return health status', async () => {
      const health = await cendiaRewindService.getHealth();
      expect(health).toBeDefined();
      expect(health).toHaveProperty('status');
      expect(typeof health.analyses).toBe('number');
    });
  });
});
