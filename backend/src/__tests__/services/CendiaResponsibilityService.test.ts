/**
 * CendiaResponsibilityService Tests
 * 
 * Tests for responsibility assignment and RACI matrix management
 * @module __tests__/services/CendiaResponsibilityService.test
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
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const mod = await import('../../services/CendiaResponsibilityService.js');
const CendiaResponsibilityService = (mod as any).CendiaResponsibilityService;
const service = new CendiaResponsibilityService();

describe('CendiaResponsibilityService', () => {
  it('should export the class', () => {
    expect(CendiaResponsibilityService).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(service).toBeDefined();
  });

  describe('createAccountabilityRecord()', () => {
    it('should have createAccountabilityRecord method', () => {
      expect(typeof service.createAccountabilityRecord).toBe('function');
    });
  });

  describe('recordOverride()', () => {
    it('should have recordOverride method', () => {
      expect(typeof service.recordOverride).toBe('function');
    });
  });

  describe('recordApproval()', () => {
    it('should have recordApproval method', () => {
      expect(typeof service.recordApproval).toBe('function');
    });
  });

  describe('recordRejection()', () => {
    it('should have recordRejection method', () => {
      expect(typeof service.recordRejection).toBe('function');
    });
  });

  describe('createDelegation()', () => {
    it('should have createDelegation method', () => {
      expect(typeof service.createDelegation).toBe('function');
    });
  });

  describe('getAccountabilityChain()', () => {
    it('should have getAccountabilityChain method', () => {
      expect(typeof service.getAccountabilityChain).toBe('function');
    });
  });

  describe('generateLiabilityReport()', () => {
    it('should have generateLiabilityReport method', () => {
      expect(typeof service.generateLiabilityReport).toBe('function');
    });
  });

  describe('verifyRecord()', () => {
    it('should have verifyRecord method', () => {
      expect(typeof service.verifyRecord).toBe('function');
    });
  });
});
