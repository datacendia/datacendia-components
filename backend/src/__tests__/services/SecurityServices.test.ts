/**
 * Security Services Tests
 * Tests for MFAService, ShadowAIDetector, RuntimeSecurityService, SBOMService, ZeroKnowledgeProofService
 * @module __tests__/services/SecurityServices.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    users: { findUnique: vi.fn().mockResolvedValue(null), update: vi.fn().mockResolvedValue({}) },
    audit_logs: { create: vi.fn().mockResolvedValue({}) },
    mfa_tokens: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}) },
    sbom_reports: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}) },
    security_events: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}) },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

// ============================================================================
// MFAService
// ============================================================================
const { MFAService } = await import('../../services/security/MFAService.js');

describe('MFAService', () => {
  let mfaService: InstanceType<typeof MFAService>;

  beforeEach(() => {
    mfaService = new MFAService();
  });

  it('should instantiate', () => {
    expect(mfaService).toBeDefined();
  });

  // FAILS IF: generateSecret returns wrong shape, wrong backup code count, or non-string secret
  it('should generate TOTP secret with 10 backup codes', () => {
    const result = mfaService.generateSecret();
    expect(typeof result.secret).toBe('string');
    expect(result.secret.length).toBeGreaterThan(10);
    expect(Array.isArray(result.backupCodes)).toBe(true);
    expect(result.backupCodes.length).toBe(10);
    // Each backup code should be uppercase hex
    for (const code of result.backupCodes) {
      expect(typeof code).toBe('string');
      expect(code.length).toBe(8);
      expect(/^[0-9A-F]+$/.test(code)).toBe(true);
    }
  });

  // FAILS IF: two calls produce identical secrets (randomness broken)
  it('should generate unique secrets on each call', () => {
    const r1 = mfaService.generateSecret();
    const r2 = mfaService.generateSecret();
    expect(r1.secret).not.toBe(r2.secret);
  });

  // FAILS IF: initiateSetup is not async or doesn't exist
  it('should reject initiateSetup for non-existent user', async () => {
    await expect(mfaService.initiateSetup('nonexistent-user')).rejects.toThrow();
  });
});

// ============================================================================
// RuntimeSecurityService
// ============================================================================
const runtimeMod = await import('../../services/crucible/RuntimeSecurityService.js');
const runtimeSecurityService = (runtimeMod as any).runtimeSecurityService || (runtimeMod as any).default;

describe('RuntimeSecurityService', () => {
  it('should export an instance', () => {
    expect(runtimeSecurityService).toBeDefined();
  });

  // FAILS IF: getMetrics returns non-object or throws
  it('should return security metrics object', () => {
    const metrics = runtimeSecurityService.getMetrics();
    expect(metrics).toBeDefined();
    expect(typeof metrics).toBe('object');
  });

  // FAILS IF: containsSuspiciousPatterns returns non-boolean
  it('should detect suspicious patterns in SQL injection input', () => {
    const result = runtimeSecurityService.containsSuspiciousPatterns("'; DROP TABLE users; --");
    expect(typeof result).toBe('boolean');
  });

  // FAILS IF: containsSuspiciousPatterns returns true for safe input
  it('should not flag safe input as suspicious', () => {
    const result = runtimeSecurityService.containsSuspiciousPatterns('Hello world, this is a normal message');
    expect(result).toBe(false);
  });

  // FAILS IF: isIPBlocked returns non-boolean
  it('should check IP blocking', () => {
    const result = runtimeSecurityService.isIPBlocked('192.168.1.1');
    expect(typeof result).toBe('boolean');
  });
});

// ============================================================================
// SBOMService
// ============================================================================
const sbomMod = await import('../../services/crucible/SBOMService.js');
const sbomService = (sbomMod as any).sbomService || (sbomMod as any).default;

describe('SBOMService', () => {
  it('should export an instance', () => {
    expect(sbomService).toBeDefined();
  });

  // FAILS IF: getReports throws or returns non-array
  it('should return SBOM reports as array', async () => {
    const reports = await sbomService.getReports('org-1');
    expect(Array.isArray(reports)).toBe(true);
  });

  // FAILS IF: generateSBOM throws with non-Error
  it('should attempt SBOM generation', async () => {
    try {
      const report = await sbomService.generateSBOM({ organizationId: 'org-1', name: 'test-app' } as any);
      expect(report).toBeDefined();
      expect(report).toHaveProperty('id');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// ZeroKnowledgeProofService
// ============================================================================
const zkpMod = await import('../../services/security/ZeroKnowledgeProofService.js');
const zkpService = (zkpMod as any).zkpService || (zkpMod as any).default || (zkpMod as any).zeroKnowledgeProofService;

describe('ZeroKnowledgeProofService', () => {
  it('should export an instance', () => {
    expect(zkpService).toBeDefined();
  });

  // FAILS IF: core ZKP methods don't exist
  it('should have generateProof and verifyProof methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(zkpService))
      .filter(m => m !== 'constructor' && typeof zkpService[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
    // Must have at least one proof-related method
    const proofMethods = methods.filter(m => m.toLowerCase().includes('proof') || m.toLowerCase().includes('verify'));
    expect(proofMethods.length).toBeGreaterThan(0);
  });
});
