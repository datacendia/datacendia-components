/**
 * Strategic & Sovereign Services Tests
 * Tests for SynthesisEngineService, WarGamesService, EchoExpressService,
 * ExpressIntelligenceService, GnosisService, DecisionReplayTheaterService,
 * ShadowCouncilService, DeterministicReplayService, PortableInstanceService
 * @module __tests__/services/StrategicServices.test
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
    deliberations: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}) },
    deliberation_votes: { findMany: vi.fn().mockResolvedValue([]) },
    agents: { findMany: vi.fn().mockResolvedValue([]) },
    organizations: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null) },
    decision_outcomes: { findMany: vi.fn().mockResolvedValue([]) },
    audit_logs: { create: vi.fn().mockResolvedValue({}), findMany: vi.fn().mockResolvedValue([]) },
  },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    chat: vi.fn().mockResolvedValue({ message: { content: '{"analysis": "test"}' } }),
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
  },
}));
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'test' } }),
  },
}));

async function importService(path: string, possibleNames: string[]) {
  const mod = await import(path);
  for (const name of possibleNames) {
    if (mod[name]) return mod[name];
  }
  return mod.default || Object.values(mod).find((v: any) => v && typeof v === 'object' && !Array.isArray(v));
}

// ============================================================================
// SynthesisEngineService
// ============================================================================
const synthesisEngineService = await importService('../../services/strategic/SynthesisEngineService.js', ['synthesisEngineService']);

describe('SynthesisEngineService', () => {
  it('should export an instance', () => {
    expect(typeof synthesisEngineService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(synthesisEngineService))
      .filter(m => m !== 'constructor' && typeof synthesisEngineService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// WarGamesService
// ============================================================================
const warGamesService = await importService('../../services/strategic/WarGamesService.js', ['warGamesService']);

describe('WarGamesService', () => {
  it('should export an instance', () => {
    expect(typeof warGamesService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(warGamesService))
      .filter(m => m !== 'constructor' && typeof warGamesService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// EchoExpressService
// ============================================================================
const echoExpressService = await importService('../../services/express/EchoExpressService.js', ['echoExpressService']);

describe('EchoExpressService', () => {
  it('should export an instance', () => {
    expect(typeof echoExpressService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(echoExpressService))
      .filter(m => m !== 'constructor' && typeof echoExpressService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// ExpressIntelligenceService
// ============================================================================
const { expressIntelligenceService } = await import('../../services/express/ExpressIntelligenceService.js');

describe('ExpressIntelligenceService', () => {
  it('should export an instance', () => {
    expect(typeof expressIntelligenceService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(expressIntelligenceService))
      .filter(m => m !== 'constructor' && typeof (expressIntelligenceService as any)[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// GnosisService
// ============================================================================
const { gnosisService } = await import('../../services/gnosisService.js');

describe('GnosisService', () => {
  it('should export an instance', () => {
    expect(typeof gnosisService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(gnosisService))
      .filter(m => m !== 'constructor' && typeof (gnosisService as any)[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// DecisionReplayTheaterService
// ============================================================================
const { decisionReplayTheaterService } = await import('../../services/visualization/DecisionReplayTheaterService.js');

describe('DecisionReplayTheaterService', () => {
  it('should export an instance', () => {
    expect(typeof decisionReplayTheaterService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(decisionReplayTheaterService))
      .filter(m => m !== 'constructor' && typeof (decisionReplayTheaterService as any)[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// ShadowCouncilService
// ============================================================================
const shadowCouncilService = await importService('../../services/sovereign/ShadowCouncilService.js', ['shadowCouncilService']);

describe('ShadowCouncilService', () => {
  it('should export an instance', () => {
    expect(typeof shadowCouncilService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(shadowCouncilService))
      .filter(m => m !== 'constructor' && typeof shadowCouncilService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// DeterministicReplayService
// ============================================================================
const deterministicReplayService = await importService('../../services/sovereign/DeterministicReplayService.js', ['deterministicReplayService']);

describe('DeterministicReplayService', () => {
  it('should export an instance', () => {
    expect(typeof deterministicReplayService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(deterministicReplayService))
      .filter(m => m !== 'constructor' && typeof deterministicReplayService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// PortableInstanceService
// ============================================================================
const portableInstanceService = await importService('../../services/sovereign/PortableInstanceService.js', ['portableInstanceService']);

describe('PortableInstanceService', () => {
  it('should export an instance', () => {
    expect(typeof portableInstanceService).toBe('object');
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(portableInstanceService))
      .filter(m => m !== 'constructor' && typeof portableInstanceService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});
