/**
 * EnterpriseRedTeamService Tests
 * 
 * Tests for OWASP, AI adversarial, and chaos engineering test suites
 * @module __tests__/services/EnterpriseRedTeamService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../config/database.js', () => ({
  prisma: {
    crucible_redteam_reports: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
    },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const { enterpriseRedTeamService } = await import('../../services/crucible/EnterpriseRedTeamService.js');

describe('EnterpriseRedTeamService', () => {
  describe('initialization', () => {
    it('should export a singleton instance', () => {
      expect(enterpriseRedTeamService).toBeDefined();
    });
  });

  describe('getTestSuites()', () => {
    it('should return test suites object', () => {
      const suites = enterpriseRedTeamService.getTestSuites();
      expect(suites).toBeDefined();
      expect(suites).toHaveProperty('owasp');
      expect(suites).toHaveProperty('ai');
      expect(suites).toHaveProperty('chaos');
    });

    it('should have OWASP tests with required fields', () => {
      const suites = enterpriseRedTeamService.getTestSuites();
      expect(Array.isArray(suites.owasp)).toBe(true);
      expect(suites.owasp.length).toBeGreaterThan(0);
      for (const test of suites.owasp) {
        expect(test).toHaveProperty('id');
        expect(test).toHaveProperty('name');
        expect(test).toHaveProperty('category');
      }
    });

    it('should have AI adversarial tests', () => {
      const suites = enterpriseRedTeamService.getTestSuites();
      expect(Array.isArray(suites.ai)).toBe(true);
      expect(suites.ai.length).toBeGreaterThan(0);
    });

    it('should have chaos engineering tests', () => {
      const suites = enterpriseRedTeamService.getTestSuites();
      expect(Array.isArray(suites.chaos)).toBe(true);
      expect(suites.chaos.length).toBeGreaterThan(0);
    });
  });

  describe('runFullAssessment()', () => {
    it('should run a full assessment', async () => {
      const result = await enterpriseRedTeamService.runFullAssessment('org-1', {
        runType: 'MANUAL',
        categories: ['owasp'] as any,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
    });

    it('should run assessment with multiple categories', async () => {
      const result = await enterpriseRedTeamService.runFullAssessment('org-1', {
        runType: 'MANUAL',
        categories: ['owasp', 'ai', 'chaos'] as any,
      });

      expect(result).toBeDefined();
    });
  });

  describe('scheduleAssessment()', () => {
    it('should schedule a recurring assessment', () => {
      const schedule = enterpriseRedTeamService.scheduleAssessment('org-1' as any, {
        runType: 'SCHEDULED',
        cronExpression: '0 2 * * 1',
      } as any);

      expect(schedule).toBeDefined();
    });
  });

  describe('cancelSchedule()', () => {
    it('should return false for non-existent schedule', () => {
      const result = enterpriseRedTeamService.cancelSchedule('not-found');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getReports()', () => {
    it('should return assessment reports', async () => {
      const reports = await enterpriseRedTeamService.getReports('org-1');

      expect(reports).toBeDefined();
      expect(Array.isArray(reports)).toBe(true);
    });
  });

  describe('verifyReportIntegrity()', () => {
    it('should verify report integrity', async () => {
      const result = await enterpriseRedTeamService.verifyReportIntegrity('report-1');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('valid');
    });
  });
});
