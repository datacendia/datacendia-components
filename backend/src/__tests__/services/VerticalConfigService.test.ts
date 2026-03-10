/**
 * VerticalConfigService Tests
 * @module __tests__/services/VerticalConfigService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    organization_vertical_configs: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'config-1' }),
      update: vi.fn().mockResolvedValue({ id: 'config-1' }),
    },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const mod = await import('../../services/enterprise/VerticalConfigService.js');
const service = (mod as any).verticalConfigService || (mod as any).default;

describe('VerticalConfigService', () => {
  it('should export an instance', () => {
    expect(service).toBeDefined();
  });

  describe('getServiceCatalog()', () => {
    it('should return service catalog', () => {
      const catalog = service.getServiceCatalog();
      expect(Array.isArray(catalog)).toBe(true);
      expect(catalog.length).toBeGreaterThan(0);
    });
  });

  describe('getServiceById()', () => {
    it('should return a service by ID', () => {
      const catalog = service.getServiceCatalog();
      if (catalog.length > 0) {
        const svc = service.getServiceById(catalog[0].id);
        expect(svc).toBeDefined();
      }
    });

    it('should return undefined for non-existent service', () => {
      expect(service.getServiceById('not-found')).toBeUndefined();
    });
  });

  describe('getServicesByCategory()', () => {
    it('should return services by category', () => {
      const svcs = service.getServicesByCategory('core');
      expect(Array.isArray(svcs)).toBe(true);
    });
  });

  describe('getServicesByTier()', () => {
    it('should return services by tier', () => {
      const svcs = service.getServicesByTier('foundation');
      expect(Array.isArray(svcs)).toBe(true);
    });
  });

  describe('getCoreServices()', () => {
    it('should return core services', () => {
      const svcs = service.getCoreServices();
      expect(Array.isArray(svcs)).toBe(true);
    });
  });

  describe('getVerticalTemplates()', () => {
    it('should return vertical templates', () => {
      const templates = service.getVerticalTemplates();
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
    });
  });

  describe('getVerticalById()', () => {
    it('should return a vertical by ID', () => {
      const templates = service.getVerticalTemplates();
      if (templates.length > 0) {
        const v = service.getVerticalById(templates[0].id);
        expect(v).toBeDefined();
      }
    });

    it('should return undefined for non-existent vertical', () => {
      expect(service.getVerticalById('not-found')).toBeUndefined();
    });
  });

  describe('getOrganizationConfig()', () => {
    it('should return null for non-existent org config', async () => {
      const config = await service.getOrganizationConfig('non-existent');
      expect(config).toBeNull();
    });
  });

  describe('isServiceEnabled()', () => {
    it('should check if service is enabled for org', async () => {
      const enabled = await service.isServiceEnabled('org-1', 'council');
      expect(typeof enabled).toBe('boolean');
    });
  });
});
