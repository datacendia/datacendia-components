/**
 * CendiaRecallService Comprehensive Tests
 * 
 * Tests the full decision outcome tracking lifecycle:
 * Create tracker → Record outcomes → Calculate accuracy → Detect biases → Close with lessons
 * 
 * Every test uses real inputs and meaningful assertions.
 * FAILS IF comments explain what would break each test.
 * 
 * @module __tests__/services/CendiaRecallService.comprehensive.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

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

describe('CendiaRecallService — Decision Outcome Tracker', () => {

  // ===========================================================================
  // OUTCOME CREATION
  // ===========================================================================

  describe('createOutcomeTracker()', () => {
    // FAILS IF: createOutcomeTracker throws, or returns object without id/status/predictedOutcomes
    it('should create a tracker with correct fields for a real business decision', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-datacendia',
        'decision-hire-50-engineers',
        'Q4 Engineering Hiring Decision',
        [
          { id: 'pred-1', metric: 'team_velocity', predictedValue: 150, unit: 'story_points_per_sprint', confidence: 85, timeframe: '6_months', source: 'CTO_Agent' },
          { id: 'pred-2', metric: 'time_to_market', predictedValue: 30, unit: 'days_reduction', confidence: 70, timeframe: '6_months', source: 'VP_Engineering_Agent' },
          { id: 'pred-3', metric: 'burn_rate', predictedValue: 2500000, unit: 'usd_per_month', confidence: 95, timeframe: 'immediate', source: 'CFO_Agent' },
        ],
        'cto@datacendia.com',
        { predictedROI: 3.2, tags: ['hiring', 'engineering', 'growth'] }
      );

      expect(tracker.id).toMatch(/^recall-/);
      expect(tracker.status).toBe('tracking');
      expect(tracker.organizationId).toBe('org-datacendia');
      expect(tracker.decisionId).toBe('decision-hire-50-engineers');
      expect(tracker.title).toBe('Q4 Engineering Hiring Decision');
      expect(tracker.predictedOutcomes).toHaveLength(3);
      expect(tracker.actualOutcomes).toHaveLength(0);
      expect(tracker.trackedBy).toBe('cto@datacendia.com');
      expect(tracker.predictedROI).toBe(3.2);
      expect(tracker.tags).toContain('hiring');
      expect(tracker.decisionDate).toBeInstanceOf(Date);
      expect(tracker.trackingStartDate).toBeInstanceOf(Date);
    });

    // FAILS IF: two trackers get the same ID (broken UUID generation)
    it('should generate unique IDs for each tracker', async () => {
      const t1 = await cendiaRecallService.createOutcomeTracker('org-1', 'd-1', 'Decision A', [], 'user-1');
      const t2 = await cendiaRecallService.createOutcomeTracker('org-1', 'd-2', 'Decision B', [], 'user-1');
      expect(t1.id).not.toBe(t2.id);
    });
  });

  // ===========================================================================
  // RECORDING ACTUAL OUTCOMES
  // ===========================================================================

  describe('recordActualOutcome()', () => {
    // FAILS IF: recording actual outcome doesn't append to actualOutcomes array
    it('should record actual outcome against a tracked decision', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'decision-pricing', 'Pricing Strategy Decision',
        [{ id: 'p1', metric: 'revenue', predictedValue: 1000000, unit: 'usd', confidence: 80, timeframe: '3_months', source: 'CFO_Agent' }],
        'cfo@test.com'
      );

      const updated = await cendiaRecallService.recordActualOutcome(tracker.id, {
        metric: 'revenue',
        actualValue: 950000,
        unit: 'usd',
        measuredAt: new Date(),
        evidenceSource: 'QuickBooks Export',
        verified: true,
      });

      expect(updated.actualOutcomes).toHaveLength(1);
      expect(updated.actualOutcomes[0].metric).toBe('revenue');
      expect(updated.actualOutcomes[0].actualValue).toBe(950000);
      expect(updated.actualOutcomes[0].evidenceSource).toBe('QuickBooks Export');
      expect(updated.actualOutcomes[0].verified).toBe(true);
      expect(updated.actualOutcomes[0].id).toMatch(/^actual-/);
    });

    // FAILS IF: recording outcome for non-existent tracker doesn't throw
    it('should throw for non-existent tracker', async () => {
      await expect(
        cendiaRecallService.recordActualOutcome('nonexistent-tracker-id', {
          metric: 'revenue', actualValue: 100, unit: 'usd',
          measuredAt: new Date(), evidenceSource: 'test', verified: false,
        })
      ).rejects.toThrow('not found');
    });

    // FAILS IF: status doesn't change to 'measured' when all predictions have actuals
    it('should auto-calculate accuracy and set status to measured when all outcomes recorded', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'decision-launch', 'Product Launch',
        [
          { id: 'p1', metric: 'signups', predictedValue: 1000, unit: 'users', confidence: 75, timeframe: '1_month', source: 'Marketing_Agent' },
        ],
        'pm@test.com'
      );

      const updated = await cendiaRecallService.recordActualOutcome(tracker.id, {
        metric: 'signups', actualValue: 850, unit: 'users',
        measuredAt: new Date(), evidenceSource: 'Analytics Dashboard', verified: true,
      });

      expect(updated.status).toBe('measured');
      expect(updated.accuracyScore).toBeDefined();
      expect(typeof updated.accuracyScore).toBe('number');
      expect(updated.accuracyScore).toBeGreaterThan(0);
      expect(updated.verdict).toBeDefined();
    });
  });

  // ===========================================================================
  // ACCURACY CALCULATION
  // ===========================================================================

  describe('Accuracy Calculation', () => {
    // FAILS IF: accuracy math is wrong — predicted 1000, actual 1000 should be 100%
    it('should calculate 100% accuracy for exact prediction match', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'd-exact', 'Exact Match Test',
        [{ id: 'p1', metric: 'sales', predictedValue: 500, unit: 'units', confidence: 90, timeframe: '1_month', source: 'Sales_Agent' }],
        'test@test.com'
      );

      const result = await cendiaRecallService.recordActualOutcome(tracker.id, {
        metric: 'sales', actualValue: 500, unit: 'units',
        measuredAt: new Date(), evidenceSource: 'CRM', verified: true,
      });

      expect(result.accuracyScore).toBe(100);
      expect(result.verdict).toBe('exceeded');
    });

    // FAILS IF: accuracy doesn't decrease when actual deviates from predicted
    it('should calculate reduced accuracy for 20% deviation', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'd-deviation', 'Deviation Test',
        [{ id: 'p1', metric: 'revenue', predictedValue: 100000, unit: 'usd', confidence: 80, timeframe: '3_months', source: 'CFO' }],
        'test@test.com'
      );

      const result = await cendiaRecallService.recordActualOutcome(tracker.id, {
        metric: 'revenue', actualValue: 80000, unit: 'usd',
        measuredAt: new Date(), evidenceSource: 'Financials', verified: true,
      });

      // 20% deviation → 80% accuracy
      expect(result.accuracyScore).toBe(80);
      expect(result.verdict).toBe('met');
    });

    // FAILS IF: catastrophic miss doesn't get correct verdict
    it('should assign catastrophic verdict for >75% miss', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'd-catastrophic', 'Catastrophic Miss Test',
        [{ id: 'p1', metric: 'users', predictedValue: 10000, unit: 'count', confidence: 60, timeframe: '6_months', source: 'Growth_Agent' }],
        'test@test.com'
      );

      const result = await cendiaRecallService.recordActualOutcome(tracker.id, {
        metric: 'users', actualValue: 500, unit: 'count',
        measuredAt: new Date(), evidenceSource: 'Analytics', verified: true,
      });

      // 95% deviation → 5% accuracy → catastrophic
      expect(result.accuracyScore).toBeLessThan(25);
      expect(result.verdict).toBe('catastrophic');
    });
  });

  // ===========================================================================
  // ROI TRACKING
  // ===========================================================================

  describe('recordActualROI()', () => {
    // FAILS IF: actualROI not set, or financialImpact not calculated
    it('should record actual ROI and calculate financial impact', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'd-roi', 'ROI Test',
        [{ id: 'p1', metric: 'profit', predictedValue: 500000, unit: 'usd', confidence: 70, timeframe: '1_year', source: 'CFO' }],
        'cfo@test.com',
        { predictedROI: 2.5 }
      );

      const result = await cendiaRecallService.recordActualROI(tracker.id, 3.1);

      expect(result.actualROI).toBe(3.1);
      expect(result.financialImpact).toBeCloseTo(0.6, 1); // 3.1 - 2.5
    });

    // FAILS IF: recording ROI for non-existent tracker doesn't throw
    it('should throw for non-existent tracker', async () => {
      await expect(cendiaRecallService.recordActualROI('fake-id', 1.0)).rejects.toThrow('not found');
    });
  });

  // ===========================================================================
  // VERIFICATION & CLOSING
  // ===========================================================================

  describe('verifyOutcome()', () => {
    // FAILS IF: status doesn't change to verified, or verifiedBy not set
    it('should mark outcome as verified with verifier identity', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'd-verify', 'Verify Test', [], 'user@test.com'
      );

      const result = await cendiaRecallService.verifyOutcome(tracker.id, 'auditor@datacendia.com');

      expect(result.status).toBe('verified');
      expect(result.verifiedBy).toBe('auditor@datacendia.com');
    });
  });

  describe('closeOutcome()', () => {
    // FAILS IF: status doesn't change to closed, or lessons not stored
    it('should close outcome with lessons learned', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-1', 'd-close', 'Close Test',
        [{ id: 'p1', metric: 'efficiency', predictedValue: 30, unit: 'percent_improvement', confidence: 65, timeframe: '6_months', source: 'COO' }],
        'user@test.com',
        { tags: ['operations'] }
      );

      await cendiaRecallService.recordActualOutcome(tracker.id, {
        metric: 'efficiency', actualValue: 22, unit: 'percent_improvement',
        measuredAt: new Date(), evidenceSource: 'Operations Dashboard', verified: true,
      });

      const result = await cendiaRecallService.closeOutcome(tracker.id, [
        'Efficiency gains take longer than predicted — extend timeframes by 30%',
        'Operations team needs dedicated change management support',
      ]);

      expect(result.status).toBe('closed');
      expect(result.lessonsLearned).toHaveLength(2);
      expect(result.lessonsLearned![0]).toContain('Efficiency gains');
      expect(result.biasesDetected).toBeDefined();
      expect(Array.isArray(result.biasesDetected)).toBe(true);
    });
  });

  // ===========================================================================
  // BIAS DETECTION
  // ===========================================================================

  describe('Bias Detection', () => {
    // FAILS IF: optimism bias not detected when predictions consistently exceed actuals
    it('should detect optimism bias when predictions consistently overestimate', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-bias', 'd-optimism', 'Optimism Bias Test',
        [
          { id: 'p1', metric: 'revenue', predictedValue: 1000000, unit: 'usd', confidence: 80, timeframe: '3m', source: 'CFO' },
          { id: 'p2', metric: 'users', predictedValue: 50000, unit: 'count', confidence: 75, timeframe: '3m', source: 'Growth' },
          { id: 'p3', metric: 'retention', predictedValue: 95, unit: 'percent', confidence: 85, timeframe: '3m', source: 'Product' },
          { id: 'p4', metric: 'nps', predictedValue: 80, unit: 'score', confidence: 70, timeframe: '3m', source: 'CX' },
          { id: 'p5', metric: 'deals', predictedValue: 200, unit: 'count', confidence: 65, timeframe: '3m', source: 'Sales' },
        ],
        'test@test.com',
        { tags: ['q4-planning'] }
      );

      // Record actuals that are ALL significantly below predictions (optimism bias)
      for (const [metric, actual] of [
        ['revenue', 600000], ['users', 30000], ['retention', 70],
        ['nps', 55], ['deals', 100],
      ] as [string, number][]) {
        await cendiaRecallService.recordActualOutcome(tracker.id, {
          metric, actualValue: actual, unit: 'various',
          measuredAt: new Date(), evidenceSource: 'Dashboard', verified: true,
        });
      }

      const closed = await cendiaRecallService.closeOutcome(tracker.id, ['We were too optimistic']);

      expect(closed.biasesDetected!.length).toBeGreaterThan(0);
      const optimismBias = closed.biasesDetected!.find(b => b.type === 'optimism');
      expect(optimismBias).toBeDefined();
      expect(optimismBias!.severity).toBe('high');
      expect(optimismBias!.recommendation).toBeTruthy();
    });
  });

  // ===========================================================================
  // QUERYING
  // ===========================================================================

  describe('getOutcome()', () => {
    // FAILS IF: returns wrong tracker or null for existing tracker
    it('should retrieve a created tracker by ID', async () => {
      const tracker = await cendiaRecallService.createOutcomeTracker(
        'org-get', 'd-get', 'Get Test', [], 'user@test.com'
      );

      const retrieved = await cendiaRecallService.getOutcome(tracker.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(tracker.id);
      expect(retrieved!.title).toBe('Get Test');
    });

    // FAILS IF: returns non-null for non-existent ID
    it('should return null for non-existent tracker', async () => {
      const result = await cendiaRecallService.getOutcome('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('getOutcomes()', () => {
    // FAILS IF: doesn't filter by organization
    it('should return outcomes filtered by organization', async () => {
      await cendiaRecallService.createOutcomeTracker('org-filter-a', 'd-a', 'A', [], 'u');
      await cendiaRecallService.createOutcomeTracker('org-filter-b', 'd-b', 'B', [], 'u');

      const result = await cendiaRecallService.getOutcomes('org-filter-a');
      expect(result.outcomes.every(o => o.organizationId === 'org-filter-a')).toBe(true);
    });

    // FAILS IF: status filter doesn't work
    it('should filter by status', async () => {
      const result = await cendiaRecallService.getOutcomes('org-filter-a', { status: 'tracking' });
      expect(result.outcomes.every(o => o.status === 'tracking')).toBe(true);
    });
  });

  // ===========================================================================
  // PREDICTION ACCURACY REPORT
  // ===========================================================================

  describe('getPredictionAccuracyReport()', () => {
    // FAILS IF: report doesn't have required fields
    it('should generate accuracy report with correct structure', async () => {
      const report = await cendiaRecallService.getPredictionAccuracyReport('org-bias');

      expect(report.organizationId).toBe('org-bias');
      expect(typeof report.totalDecisions).toBe('number');
      expect(typeof report.measuredDecisions).toBe('number');
      expect(typeof report.overallAccuracy).toBe('number');
      expect(report.overallAccuracy).toBeGreaterThanOrEqual(0);
      expect(report.overallAccuracy).toBeLessThanOrEqual(100);
      expect(typeof report.accuracyByCategory).toBe('object');
      expect(typeof report.accuracyByAgent).toBe('object');
      expect(Array.isArray(report.accuracyTrend)).toBe(true);
      expect(Array.isArray(report.topBiases)).toBe(true);
      expect(typeof report.financialImpact).toBe('object');
      expect(typeof report.financialImpact.totalPredictedROI).toBe('number');
      expect(typeof report.financialImpact.totalActualROI).toBe('number');
      expect(Array.isArray(report.recommendations)).toBe(true);
    });
  });

  // ===========================================================================
  // LESSONS LEARNED
  // ===========================================================================

  describe('getLessonsLearned()', () => {
    // FAILS IF: getLessonsLearned doesn't return array
    it('should return lessons for an organization', async () => {
      const lessons = await cendiaRecallService.getLessonsLearned('org-bias');
      expect(Array.isArray(lessons)).toBe(true);
    });
  });

  describe('endorseLesson()', () => {
    // FAILS IF: endorseLesson throws for valid lesson
    it('should allow endorsing a lesson', async () => {
      const lessons = await cendiaRecallService.getLessonsLearned('org-bias');
      if (lessons.length > 0) {
        const endorsed = await cendiaRecallService.endorseLesson(lessons[0].id, 'endorser@test.com');
        expect(endorsed.endorsedBy).toContain('endorser@test.com');
      }
    });
  });
});
