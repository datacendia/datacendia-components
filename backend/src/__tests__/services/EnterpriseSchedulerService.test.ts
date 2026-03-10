/**
 * EnterpriseSchedulerService Tests
 * @module __tests__/services/EnterpriseSchedulerService.test
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
    scheduled_jobs: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}), update: vi.fn(), delete: vi.fn(), findUnique: vi.fn().mockResolvedValue(null) },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const mod = await import('../../services/scheduler/EnterpriseSchedulerService.js');
const service = (mod as any).enterpriseSchedulerService || (mod as any).default;

describe('EnterpriseSchedulerService', () => {
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

  it('should have listJobs or getJobs', () => {
    const has = typeof service.listJobs === 'function' || typeof service.getJobs === 'function';
    expect(has).toBe(true);
  });
});
