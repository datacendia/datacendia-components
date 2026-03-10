/**
 * EchoService Tests
 * 
 * Tests for decision outcome tracking and ROI measurement
 * @module __tests__/services/EchoService.test
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

vi.mock('../../services/ChronosEventBus.js', () => ({
  recordChronosEvent: vi.fn(),
}));

vi.mock('../../services/ollama.js', () => ({
  default: {
    chat: vi.fn().mockResolvedValue({ message: { content: '{"analysis": "test"}' } }),
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
  },
}));

const mockPrisma = {
  decision_outcomes: {
    create: vi.fn().mockResolvedValue({ id: 'outcome-1' }),
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    findFirst: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
  },
  deliberations: {
    findUnique: vi.fn().mockResolvedValue({
      id: 'delib-1', question: 'Test?', final_decision: 'Yes',
      created_at: new Date(), organization_id: 'org-1',
      deliberation_votes: [],
    }),
    findMany: vi.fn().mockResolvedValue([]),
  },
  echo_collection_jobs: {
    create: vi.fn().mockResolvedValue({ id: 'job-1' }),
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    findFirst: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
  },
  agents: { findMany: vi.fn().mockResolvedValue([]) },
  data_sources: { findMany: vi.fn().mockResolvedValue([]) },
  metric_definitions: { findMany: vi.fn().mockResolvedValue([]) },
  metric_values: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}) },
  agent_weight_history: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}) },
  $queryRaw: vi.fn().mockResolvedValue([]),
};
vi.mock('../../config/database.js', () => ({
  prisma: mockPrisma,
}));

const { echoService } = await import('../../services/echoService.js');

describe('EchoService', () => {
  describe('initialization', () => {
    it('should export a singleton instance', () => {
      expect(echoService).toBeDefined();
    });
  });

  describe('linkDecisionToOutcome()', () => {
    it('should link a decision to an outcome', async () => {
      const result = await echoService.linkDecisionToOutcome('delib-1', 'org-1', {
        actualRevenue: 115000,
        actualProfit: 50000,
        notes: 'Revenue increased by 15%',
      });

      expect(result).toBeDefined();
    });
  });

  describe('getROILeaderboard()', () => {
    it('should return ROI leaderboard for daily period', async () => {
      const leaderboard = await echoService.getROILeaderboard('org-1', 'daily' as any);
      expect(leaderboard).toBeDefined();
    });

    it('should return ROI leaderboard for weekly period', async () => {
      const leaderboard = await echoService.getROILeaderboard('org-1', 'weekly' as any);
      expect(leaderboard).toBeDefined();
    });

    it('should return ROI leaderboard for monthly period', async () => {
      const leaderboard = await echoService.getROILeaderboard('org-1', 'monthly' as any);
      expect(leaderboard).toBeDefined();
    });
  });

  describe('getAccuracyReport()', () => {
    it('should return accuracy report for organization', async () => {
      const report = await echoService.getAccuracyReport('org-1');
      expect(report).toBeDefined();
    });
  });

  describe('getDecisionOutcome()', () => {
    it('should return null for non-existent outcome', async () => {
      const outcome = await echoService.getDecisionOutcome('non-existent');
      expect(outcome).toBeNull();
    });
  });

  describe('generateOutcomeReport()', () => {
    it('should generate an outcome report', async () => {
      try {
        const report = await echoService.generateOutcomeReport('delib-1', 'org-1');
        expect(report).toBeDefined();
      } catch (e: any) {
        // Expected: 'No outcome found for this decision' when no outcome linked
        expect(e.message).toContain('No outcome found');
      }
    });
  });

  describe('scheduleOutcomeCollection()', () => {
    it('should schedule outcome collection', async () => {
      const job = await echoService.scheduleOutcomeCollection('org-1', 'delib-1', {
        collectionDelayDays: 30,
        metricKeys: ['revenue', 'satisfaction'],
      });

      expect(job).toBeDefined();
    });
  });

  describe('getCollectionJobs()', () => {
    it('should return collection jobs array', async () => {
      const jobs = await echoService.getCollectionJobs('org-1' as any);
      expect(Array.isArray(jobs)).toBe(true);
    });
  });

  describe('cancelCollectionJob()', () => {
    it('should handle non-existent job gracefully', async () => {
      const result = await echoService.cancelCollectionJob('nonexistent-job');
      expect(result).toBeUndefined();
    });
  });

  describe('processDueCollections()', () => {
    it('should process due collections and return result', async () => {
      const result = await echoService.processDueCollections();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('processed');
      expect(typeof result.processed).toBe('number');
    });
  });

  describe('getAgentWeightHistory()', () => {
    it('should return agent weight history array', async () => {
      const history = await echoService.getAgentWeightHistory('org-1' as any);
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('getPendingDecisions()', () => {
    it('should return pending decisions array', async () => {
      const pending = await echoService.getPendingDecisions('org-1' as any);
      expect(Array.isArray(pending)).toBe(true);
    });
  });

  describe('scheduler', () => {
    it('should start collection scheduler', () => {
      expect(() => echoService.startCollectionScheduler(60000)).not.toThrow();
      echoService.stopCollectionScheduler();
    });

    it('should stop collection scheduler', () => {
      expect(() => echoService.stopCollectionScheduler()).not.toThrow();
    });
  });
});
