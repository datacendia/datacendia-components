/**
 * Cendia Enterprise Services Tests
 * Tests for CendiaBrandService, CendiaBridgeService, CendiaFoundryService,
 * CendiaGlassService, CendiaGraphService, CendiaIngestService, CendiaKeyService,
 * CendiaLegacyService, CendiaMirrorService, CendiaRevenueService, CendiaVaultService,
 * CendiaVetoService, CendiaWitnessService, CendiaRecallService, CendiaRewindService
 * @module __tests__/services/CendiaEnterpriseServices.test
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
    deliberations: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null) },
    agents: { findMany: vi.fn().mockResolvedValue([]) },
    organizations: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null) },
    users: { findMany: vi.fn().mockResolvedValue([]) },
    audit_logs: { create: vi.fn().mockResolvedValue({}), findMany: vi.fn().mockResolvedValue([]) },
  },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    chat: vi.fn().mockResolvedValue({ message: { content: '{"result": "test"}' } }),
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
  },
}));
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'test' } }),
  },
}));

// Helper to safely import and test a service singleton
async function importService(path: string, possibleNames: string[]) {
  const mod = await import(path);
  for (const name of possibleNames) {
    if (mod[name]) return mod[name];
  }
  return mod.default || Object.values(mod).find((v: any) => v && typeof v === 'object' && !Array.isArray(v));
}

// ============================================================================
// CendiaBrandService
// ============================================================================
const cendiaBrandService = await importService('../../services/core/CendiaBrandService.js', ['cendiaBrandService']);

describe('CendiaBrandService', () => {
  // FAILS IF: service not exported or not an object
  it('should export an instance', () => {
    expect(cendiaBrandService).not.toBeNull();
    expect(typeof cendiaBrandService).toBe('object');
  });

  // FAILS IF: service has zero callable methods (broken export)
  it('should have at least 2 core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaBrandService))
      .filter(m => m !== 'constructor' && typeof cendiaBrandService[m] === 'function');
    expect(methods.length).toBeGreaterThanOrEqual(2);
  });

  // FAILS IF: getHealth/getDashboard throws or returns non-object
  it('should return health or dashboard as object', async () => {
    if (typeof cendiaBrandService.getHealth === 'function') {
      const h = await cendiaBrandService.getHealth();
      expect(h).not.toBeNull();
      expect(typeof h).toBe('object');
    } else if (typeof cendiaBrandService.getDashboard === 'function') {
      const d = await cendiaBrandService.getDashboard();
      expect(d).not.toBeNull();
      expect(typeof d).toBe('object');
    }
  });
});

// ============================================================================
// CendiaBridgeService
// ============================================================================
const cendiaBridgeService = await importService('../../services/legal/CendiaBridgeService.js', ['cendiaBridgeService']);

describe('CendiaBridgeService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaBridgeService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaBridgeService))
      .filter(m => m !== 'constructor' && typeof cendiaBridgeService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaFoundryService
// ============================================================================
const cendiaFoundryService = await importService('../../services/core/CendiaFoundryService.js', ['cendiaFoundryService']);

describe('CendiaFoundryService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaFoundryService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaFoundryService))
      .filter(m => m !== 'constructor' && typeof cendiaFoundryService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaGlassService
// ============================================================================
const cendiaGlassService = await importService('../../services/sovereign/CendiaGlassService.js', ['cendiaGlassService']);

describe('CendiaGlassService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaGlassService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaGlassService))
      .filter(m => m !== 'constructor' && typeof cendiaGlassService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaGraphService
// ============================================================================
const cendiaGraphService = await importService('../../services/strategic/CendiaGraphService.js', ['cendiaGraphService']);

describe('CendiaGraphService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaGraphService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaGraphService))
      .filter(m => m !== 'constructor' && typeof cendiaGraphService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaIngestService
// ============================================================================
const cendiaIngestService = await importService('../../services/strategic/CendiaIngestService.js', ['cendiaIngestService']);

describe('CendiaIngestService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaIngestService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaIngestService))
      .filter(m => m !== 'constructor' && typeof cendiaIngestService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaKeyService
// ============================================================================
const cendiaKeyService = await importService('../../services/sovereign/CendiaKeyService.js', ['cendiaKeyService']);

describe('CendiaKeyService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaKeyService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaKeyService))
      .filter(m => m !== 'constructor' && typeof cendiaKeyService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaLegacyService
// ============================================================================
const cendiaLegacyService = await importService('../../services/sovereign/CendiaLegacyService.js', ['cendiaLegacyService']);

describe('CendiaLegacyService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaLegacyService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaLegacyService))
      .filter(m => m !== 'constructor' && typeof cendiaLegacyService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaMirrorService
// ============================================================================
const cendiaMirrorService = await importService('../../services/sovereign/CendiaMirrorService.js', ['cendiaMirrorService']);

describe('CendiaMirrorService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaMirrorService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaMirrorService))
      .filter(m => m !== 'constructor' && typeof cendiaMirrorService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaRevenueService
// ============================================================================
const cendiaRevenueService = await importService('../../services/core/CendiaRevenueService.js', ['cendiaRevenueService']);

describe('CendiaRevenueService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaRevenueService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaRevenueService))
      .filter(m => m !== 'constructor' && typeof cendiaRevenueService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaVaultService
// ============================================================================
const cendiaVaultService = await importService('../../services/sovereign/CendiaVaultService.js', ['cendiaVaultService']);

describe('CendiaVaultService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaVaultService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaVaultService))
      .filter(m => m !== 'constructor' && typeof cendiaVaultService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaVetoService
// ============================================================================
const cendiaVetoService = await importService('../../services/legal/CendiaVetoService.js', ['cendiaVetoService']);

describe('CendiaVetoService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaVetoService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaVetoService))
      .filter(m => m !== 'constructor' && typeof cendiaVetoService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaWitnessService
// ============================================================================
const cendiaWitnessService = await importService('../../services/sovereign/CendiaWitnessService.js', ['cendiaWitnessService']);

describe('CendiaWitnessService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaWitnessService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaWitnessService))
      .filter(m => m !== 'constructor' && typeof cendiaWitnessService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaRecallService
// ============================================================================
const cendiaRecallService = await importService('../../services/CendiaRecallService.js', ['cendiaRecallService']);

describe('CendiaRecallService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaRecallService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaRecallService))
      .filter(m => m !== 'constructor' && typeof cendiaRecallService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CendiaRewindService
// ============================================================================
const cendiaRewindService = await importService('../../services/CendiaRewindService.js', ['cendiaRewindService']);

describe('CendiaRewindService', () => {
  it('should export an instance', () => {
    expect(typeof cendiaRewindService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(cendiaRewindService))
      .filter(m => m !== 'constructor' && typeof cendiaRewindService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});
