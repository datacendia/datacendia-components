/**
 * Tests — CredentialEvidenceService
 *
 * Verifies that credential generation evidence is captured correctly
 * with proper entropy measurement, policy snapshots, hash chains,
 * and HMAC signatures.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { CredentialEvidenceService } from '../../../services/security/CredentialEvidenceService.js';
import type { CredentialType, CredentialPolicy, CredentialEvidenceRecord } from '../../../services/security/CredentialEvidenceService.js';

// Use a fresh instance per test suite (isolated from singleton)
let service: CredentialEvidenceService;

beforeAll(() => {
  service = new CredentialEvidenceService();
});

// ==========================================================================
// POLICIES
// ==========================================================================
describe('Credential Policies', () => {
  it('should return all 15 credential type policies', () => {
    const policies = service.getPolicies();
    expect(policies.length).toBe(15);
  });

  it('should have compliance frameworks on every policy', () => {
    const policies = service.getPolicies();
    for (const p of policies) {
      expect(p.complianceFrameworks.length).toBeGreaterThan(0);
      expect(p.algorithm).toBeTruthy();
      expect(p.minEntropyBits).toBeGreaterThanOrEqual(32);
    }
  });

  it('should return policy for access_token with SOC2 and HIPAA frameworks', () => {
    const policy = service.getPolicy('access_token');
    expect(policy.credentialType).toBe('access_token');
    expect(policy.algorithm).toContain('HMAC-SHA256');
    expect(policy.complianceFrameworks).toContain('SOC2-CC6.1');
    expect(policy.complianceFrameworks).toContain('HIPAA-164.312(d)');
    expect(policy.mustExpire).toBe(true);
    expect(policy.maxLifetimeHours).toBe(1);
  });

  it('should return policy for mfa_secret with NIST multi-factor frameworks', () => {
    const policy = service.getPolicy('mfa_secret');
    expect(policy.credentialType).toBe('mfa_secret');
    expect(policy.minEntropyBits).toBe(160);
    expect(policy.complianceFrameworks).toContain('NIST-IA-2(1)');
  });

  it('should return policy for hsm_key with FIPS framework', () => {
    const policy = service.getPolicy('hsm_key');
    expect(policy.complianceFrameworks).toContain('FIPS-140-3');
    expect(policy.complianceFrameworks).toContain('NIST-SC-12');
  });

  it('should return a fallback policy for unknown credential type', () => {
    const policy = service.getPolicy('unknown_type' as CredentialType);
    expect(policy.credentialType).toBe('unknown_type');
    expect(policy.complianceFrameworks).toContain('SOC2-CC6.1');
  });
});

// ==========================================================================
// EVIDENCE RECORDING
// ==========================================================================
describe('Evidence Recording', () => {
  it('should record evidence for an access token', async () => {
    const record = await service.recordEvidence({
      credentialType: 'access_token',
      credentialValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test-payload.signature',
      userId: 'user-123',
      purpose: 'Login access token',
      expiresAt: new Date(Date.now() + 3600_000),
    });

    expect(record.id).toMatch(/^ce-/);
    expect(record.credentialType).toBe('access_token');
    expect(record.credentialFingerprint).toHaveLength(64); // SHA-256 hex
    expect(record.entropyBits).toBeGreaterThan(0);
    expect(record.entropySource).toBeTruthy();
    expect(record.policySnapshot.credentialType).toBe('access_token');
    expect(record.policySnapshot.complianceFrameworks.length).toBeGreaterThan(0);
    expect(record.environment.nodeVersion).toMatch(/^v\d+/);
    expect(record.environment.opensslVersion).toBeTruthy();
    expect(typeof record.environment.fipsMode).toBe('boolean');
    expect(record.environment.hostname).toBeTruthy();
    expect(record.recordHash).toHaveLength(64);
    expect(record.signature).toHaveLength(64);
    expect(record.userId).toBe('user-123');
    expect(record.expiresAt).toBeTruthy();
  });

  it('should record evidence with entropy override', async () => {
    const record = await service.recordEvidence({
      credentialType: 'mfa_secret',
      credentialValue: 'JBSWY3DPEHPK3PXP',
      userId: 'user-456',
      purpose: 'MFA TOTP secret',
      entropyBitsOverride: 160,
    });

    expect(record.entropyBits).toBe(160);
    expect(record.credentialType).toBe('mfa_secret');
  });

  it('should produce unique fingerprints for different credentials', async () => {
    const r1 = await service.recordEvidence({
      credentialType: 'api_key',
      credentialValue: 'dk_live_abc123',
      purpose: 'API key 1',
    });
    const r2 = await service.recordEvidence({
      credentialType: 'api_key',
      credentialValue: 'dk_live_xyz789',
      purpose: 'API key 2',
    });

    expect(r1.credentialFingerprint).not.toBe(r2.credentialFingerprint);
  });

  it('should produce identical fingerprint for the same credential', async () => {
    const credential = 'identical-secret-value';
    const r1 = await service.recordEvidence({
      credentialType: 'webhook_secret',
      credentialValue: credential,
      purpose: 'Test 1',
    });
    const r2 = await service.recordEvidence({
      credentialType: 'webhook_secret',
      credentialValue: credential,
      purpose: 'Test 2',
    });

    expect(r1.credentialFingerprint).toBe(r2.credentialFingerprint);
  });

  it('should never store the actual credential value', async () => {
    const secretValue = 'super-secret-api-key-never-stored';
    const record = await service.recordEvidence({
      credentialType: 'api_key',
      credentialValue: secretValue,
      purpose: 'Test secret not stored',
    });

    const serialized = JSON.stringify(record);
    expect(serialized).not.toContain(secretValue);
  });
});

// ==========================================================================
// HASH CHAIN
// ==========================================================================
describe('Hash Chain Integrity', () => {
  it('should link records via previousEvidenceHash', async () => {
    const svc = new CredentialEvidenceService();

    const r1 = await svc.recordEvidence({
      credentialType: 'session_token',
      credentialValue: 'session-1',
      purpose: 'Chain test 1',
    });

    const r2 = await svc.recordEvidence({
      credentialType: 'session_token',
      credentialValue: 'session-2',
      purpose: 'Chain test 2',
    });

    const r3 = await svc.recordEvidence({
      credentialType: 'session_token',
      credentialValue: 'session-3',
      purpose: 'Chain test 3',
    });

    // Each subsequent record links to the previous one's hash
    expect(r2.previousEvidenceHash).toBe(r1.recordHash);
    expect(r3.previousEvidenceHash).toBe(r2.recordHash);
    // All three have distinct hashes
    expect(new Set([r1.recordHash, r2.recordHash, r3.recordHash]).size).toBe(3);
  });

  it('should produce unique record hashes', async () => {
    const svc = new CredentialEvidenceService();

    const r1 = await svc.recordEvidence({
      credentialType: 'client_secret',
      credentialValue: 'cs-1',
      purpose: 'Hash uniqueness 1',
    });
    const r2 = await svc.recordEvidence({
      credentialType: 'client_secret',
      credentialValue: 'cs-2',
      purpose: 'Hash uniqueness 2',
    });

    expect(r1.recordHash).not.toBe(r2.recordHash);
    expect(r1.signature).not.toBe(r2.signature);
  });
});

// ==========================================================================
// ENVIRONMENT CAPTURE
// ==========================================================================
describe('Environment Capture', () => {
  it('should capture accurate Node.js version', async () => {
    const record = await service.recordEvidence({
      credentialType: 'encryption_key',
      credentialValue: 'test-key',
      purpose: 'Env test',
    });

    expect(record.environment.nodeVersion).toBe(process.version);
  });

  it('should capture platform info', async () => {
    const record = await service.recordEvidence({
      credentialType: 'signing_key',
      credentialValue: 'test-signing-key',
      purpose: 'Platform test',
    });

    expect(record.environment.platform).toContain(process.platform);
    expect(record.environment.pid).toBe(process.pid);
  });
});

// ==========================================================================
// RECORDS RETRIEVAL
// ==========================================================================
describe('Records Retrieval', () => {
  it('should retrieve recorded evidence from in-memory store', async () => {
    const svc = new CredentialEvidenceService();

    await svc.recordEvidence({
      credentialType: 'access_token',
      credentialValue: 'test-token-retrieval',
      userId: 'user-retrieval',
      purpose: 'Retrieval test',
    });

    const records = await svc.getRecords({ userId: 'user-retrieval' });
    expect(records.length).toBeGreaterThanOrEqual(1);
    expect(records[0].userId).toBe('user-retrieval');
  });
});

// ==========================================================================
// STATS
// ==========================================================================
describe('Statistics', () => {
  it('should compute stats with compliance frameworks covered', async () => {
    const svc = new CredentialEvidenceService();

    await svc.recordEvidence({
      credentialType: 'access_token',
      credentialValue: 'stats-test-1',
      purpose: 'Stats test',
    });
    await svc.recordEvidence({
      credentialType: 'mfa_secret',
      credentialValue: 'stats-test-2',
      purpose: 'Stats test',
      entropyBitsOverride: 160,
    });

    const stats = await svc.getStats();
    expect(stats.totalRecords).toBeGreaterThanOrEqual(2);
    expect(stats.averageEntropyBits).toBeGreaterThan(0);
    expect(stats.complianceFrameworksCovered.length).toBeGreaterThan(0);
    expect(stats.complianceFrameworksCovered).toContain('SOC2-CC6.1');
  });
});

// ==========================================================================
// AUDIT EXPORT
// ==========================================================================
describe('Audit Export', () => {
  it('should produce a complete audit package', async () => {
    const svc = new CredentialEvidenceService();

    await svc.recordEvidence({
      credentialType: 'access_token',
      credentialValue: 'export-test',
      purpose: 'Export test',
    });

    const pkg = await svc.exportAuditPackage();
    expect(pkg.exportId).toMatch(/^cep-/);
    expect(pkg.exportedAt).toBeTruthy();
    expect(pkg.policies.length).toBe(15);
    expect(pkg.records.length).toBeGreaterThanOrEqual(1);
    expect(pkg.chainVerification).toHaveProperty('valid');
    expect(pkg.stats).toHaveProperty('totalRecords');
    expect(pkg.platformInfo.nodeVersion).toBe(process.version);
  });
});
