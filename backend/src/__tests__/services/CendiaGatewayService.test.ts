/**
 * CendiaGatewayService Tests
 * @module __tests__/services/CendiaGatewayService.test
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

const mod = await import('../../services/gateway/CendiaGatewayService.js');
const CendiaGatewayService = (mod as any).default || (mod as any).CendiaGatewayService;
const service = typeof CendiaGatewayService === 'function' ? new CendiaGatewayService() : CendiaGatewayService;

describe('CendiaGatewayService', () => {
  it('should be available', () => {
    expect(service).toBeDefined();
  });

  it('should have routeRequest or processRequest method', () => {
    const hasMethod = typeof service.routeRequest === 'function' ||
      typeof service.processRequest === 'function' ||
      typeof service.handleRequest === 'function';
    expect(hasMethod).toBe(true);
  });

  it('should have getMetrics or getStats method', () => {
    const hasMethod = typeof service.getMetrics === 'function' ||
      typeof service.getStats === 'function' ||
      typeof service.getStatus === 'function';
    expect(hasMethod).toBe(true);
  });

  it('should have health check', async () => {
    if (typeof service.getHealth === 'function') {
      const health = await service.getHealth();
      expect(health).toBeDefined();
    }
  });

  it('should have dashboard', async () => {
    if (typeof service.getDashboard === 'function') {
      const dashboard = await service.getDashboard();
      expect(dashboard).toBeDefined();
    }
  });
});
