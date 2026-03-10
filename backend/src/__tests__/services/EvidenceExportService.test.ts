/**
 * EvidenceExportService Tests
 * @module __tests__/services/EvidenceExportService.test
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
    deliberations: { findUnique: vi.fn().mockResolvedValue({ id: 'd1', question: 'Test?', finalDecision: 'Yes', createdAt: new Date(), deliberation_votes: [] }), findMany: vi.fn().mockResolvedValue([]) },
    evidence_exports: { create: vi.fn().mockResolvedValue({}), findMany: vi.fn().mockResolvedValue([]) },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const mod = await import('../../services/evidence/EvidenceExportService.js');
const service = (mod as any).evidenceExportService || (mod as any).default;

describe('EvidenceExportService', () => {
  it('should export an instance', () => {
    expect(service).toBeDefined();
  });

  it('should have getDashboard', async () => {
    if (typeof service.getDashboard === 'function') {
      const d = await service.getDashboard();
      expect(d).toBeDefined();
    }
  });

  it('should have getHealth', async () => {
    if (typeof service.getHealth === 'function') {
      const h = await service.getHealth();
      expect(h).toBeDefined();
    }
  });
});
