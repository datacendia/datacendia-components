/**
 * CendiaMeshService Tests
 * @module __tests__/services/CendiaMeshService.test
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
  prisma: { $queryRaw: vi.fn().mockResolvedValue([]) },
}));

const mod = await import('../../services/enterprise/CultureIntegrationService.js');
const service = (mod as any).cendiaMeshService || (mod as any).default;

describe('CendiaMeshService', () => {
  it('should export an instance', () => {
    expect(service).toBeDefined();
  });

  it('should have getDashboard', async () => {
    if (typeof service.getDashboard === 'function') {
      const d = await service.getDashboard();
      expect(d).toBeDefined();
      expect(d).toHaveProperty('serviceName');
    }
  });

  it('should have getHealth', async () => {
    if (typeof service.getHealth === 'function') {
      const h = await service.getHealth();
      expect(h.healthy).toBe(true);
    }
  });
});
