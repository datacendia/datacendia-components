/**
 * FeatureControlService Tests
 * 
 * Tests for feature flags, agent configs, and suite management
 * @module __tests__/services/FeatureControlService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../config/database.js', () => ({
  prisma: {
    feature_flags: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'ff-1', key: 'test', enabled: true }),
      update: vi.fn().mockResolvedValue({ id: 'ff-1', key: 'test', enabled: false }),
      delete: vi.fn().mockResolvedValue({}),
    },
    tenant_feature_flags: {
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn().mockResolvedValue({}),
    },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

const mod = await import('../../services/admin/FeatureControlService.js');
const service = (mod as any).featureControlService || new (mod as any).FeatureControlService();

describe('FeatureControlService', () => {
  describe('initialization', () => {
    it('should be instantiable', () => {
      expect(service).toBeDefined();
    });
  });

  // =========================================================================
  // DB FEATURE FLAGS
  // =========================================================================

  describe('listDbFeatureFlags()', () => {
    it('should return feature flags', async () => {
      const flags = await service.listDbFeatureFlags();
      expect(Array.isArray(flags)).toBe(true);
    });

    it('should accept filters', async () => {
      const flags = await service.listDbFeatureFlags({ enabled: true });
      expect(Array.isArray(flags)).toBe(true);
    });
  });

  describe('getDbFeatureFlag()', () => {
    it('should return null for non-existent flag', async () => {
      const flag = await service.getDbFeatureFlag('non-existent');
      expect(flag).toBeNull();
    });
  });

  describe('createDbFeatureFlag()', () => {
    it('should create a feature flag', async () => {
      const flag = await service.createDbFeatureFlag({
        key: 'test-flag',
        name: 'Test Flag',
        description: 'A test feature flag',
        enabled: true,
        category: 'experimental',
      });
      expect(flag).toBeDefined();
    });
  });

  describe('updateDbFeatureFlag()', () => {
    it('should update a feature flag', async () => {
      const result = await service.updateDbFeatureFlag('test-flag', { enabled: false });
      expect(result).toBeDefined();
    });
  });

  describe('toggleDbFeatureFlag()', () => {
    it('should toggle a feature flag', async () => {
      const result = await service.toggleDbFeatureFlag('test-flag', false);
      expect(result).toBeDefined();
    });
  });

  describe('deleteDbFeatureFlag()', () => {
    it('should delete a feature flag', async () => {
      const result = await service.deleteDbFeatureFlag('test-flag');
      expect(typeof result).toBe('boolean');
    });
  });

  // =========================================================================
  // TENANT FEATURE FLAGS
  // =========================================================================

  describe('getTenantFeatureFlags()', () => {
    it('should return tenant flags as a Map', async () => {
      const flags = await service.getTenantFeatureFlags('tenant-1');
      expect(flags).toBeDefined();
    });
  });

  describe('setTenantFeatureFlag()', () => {
    it('should set a tenant feature flag', async () => {
      const result = await service.setTenantFeatureFlag('tenant-1', 'test-flag', true);
      expect(typeof result).toBe('boolean');
    });
  });

  // =========================================================================
  // FEATURE CONFIGS (IN-MEMORY)
  // =========================================================================

  describe('listFeatures()', () => {
    it('should return features', async () => {
      const features = await service.listFeatures();
      expect(Array.isArray(features)).toBe(true);
    });

    it('should accept type filter', async () => {
      const features = await service.listFeatures({ type: 'service' } as any);
      expect(Array.isArray(features)).toBe(true);
    });
  });

  describe('getFeature()', () => {
    it('should return null for non-existent feature', async () => {
      const feature = await service.getFeature('non-existent');
      expect(feature).toBeNull();
    });
  });

  describe('toggleFeature()', () => {
    it('should toggle a feature', async () => {
      const features = await service.listFeatures();
      if (features.length > 0) {
        const result = await service.toggleFeature(features[0].id, !features[0].enabled);
        expect(result).toBeDefined();
      }
    });
  });

  // =========================================================================
  // AGENT CONFIGS
  // =========================================================================

  describe('listAgents()', () => {
    it('should return agent configs', async () => {
      const agents = await service.listAgents();
      expect(Array.isArray(agents)).toBe(true);
    });
  });

  describe('getAgent()', () => {
    it('should return null for non-existent agent', async () => {
      const agent = await service.getAgent('non-existent');
      expect(agent).toBeNull();
    });
  });

  describe('toggleAgent()', () => {
    it('should toggle an agent', async () => {
      const agents = await service.listAgents();
      if (agents.length > 0) {
        const result = await service.toggleAgent(agents[0].id, !agents[0].enabled);
        expect(result).toBeDefined();
      }
    });
  });

  // =========================================================================
  // SUITE CONFIGS
  // =========================================================================

  describe('listSuites()', () => {
    it('should return suite configs', async () => {
      const suites = await service.listSuites();
      expect(Array.isArray(suites)).toBe(true);
    });
  });

  describe('getSuite()', () => {
    it('should return null for non-existent suite', async () => {
      const suite = await service.getSuite('non-existent');
      expect(suite).toBeNull();
    });
  });

  describe('toggleSuite()', () => {
    it('should toggle a suite', async () => {
      const suites = await service.listSuites();
      if (suites.length > 0) {
        const result = await service.toggleSuite(suites[0].id, !suites[0].enabled);
        expect(result).toBeDefined();
      }
    });
  });
});
