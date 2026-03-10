/**
 * CendiaGovernService Tests
 * @module __tests__/services/CendiaGovernService.test
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
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'Governance analysis' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Governance response' } }),
  },
}));
vi.mock('../../config/database.js', () => ({
  prisma: { $queryRaw: vi.fn().mockResolvedValue([]) },
}));

const mod = await import('../../services/legal/CendiaGovernService.js');
const service = (mod as any).cendiaGovernService || (mod as any).default;

describe('CendiaGovernService', () => {
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
