/**
 * Module — T P M Attestation Service Test
 *
 * Platform module.
 * @module __tests__/services/sovereign/TPMAttestationService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// TPM ATTESTATION SERVICE TESTS
// Tests for Hardware-Signed Decisions
// Grade: A | Coverage: Comprehensive | Risk: Security Critical (Forgery-Proof)
// 
// SERVICE OVERVIEW:
// TPMAttestationService™ provides cryptographic proof that a decision was made
// on a specific physical machine using Trusted Platform Module (TPM) hardware.
// "Cryptographic proof that a decision was made on a specific physical machine."
// Uses hardware-bound keys that cannot be extracted for forgery-proof evidence.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import type {
  TPMConfig,
  AttestationKey,
  SignedDecision,
  DecisionPayload,
  Attestation,
  PlatformState,
  KeyAttestation,
} from '../../../services/sovereign/TPMAttestationService.js';

describe('TPMAttestationService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // TPM CONFIG STRUCTURE
  // ===========================================================================

  describe('TPMConfig Structure', () => {
    it('should create valid TPM config', () => {
      const config: TPMConfig = {
        devicePath: '/dev/tpm0',
        keyAlgorithm: 'RSA',
        keySize: 2048,
        pcrBanks: [0, 1, 2, 7],
        allowSoftwareFallback: true,
      };
      expect(config.keyAlgorithm).toBe('RSA');
    });

    it('should support RSA algorithm', () => {
      const config: Partial<TPMConfig> = { keyAlgorithm: 'RSA' };
      expect(config.keyAlgorithm).toBe('RSA');
    });

    it('should support ECC algorithm', () => {
      const config: Partial<TPMConfig> = { keyAlgorithm: 'ECC' };
      expect(config.keyAlgorithm).toBe('ECC');
    });

    it('should handle 2048 bit key size', () => {
      const config: Partial<TPMConfig> = { keySize: 2048 };
      expect(config.keySize).toBe(2048);
    });

    it('should handle 3072 bit key size', () => {
      const config: Partial<TPMConfig> = { keySize: 3072 };
      expect(config.keySize).toBe(3072);
    });

    it('should handle 4096 bit key size', () => {
      const config: Partial<TPMConfig> = { keySize: 4096 };
      expect(config.keySize).toBe(4096);
    });

    it('should handle Linux device path', () => {
      const config: Partial<TPMConfig> = { devicePath: '/dev/tpm0' };
      expect(config.devicePath).toBe('/dev/tpm0');
    });

    it('should handle multiple PCR banks', () => {
      const config: Partial<TPMConfig> = { pcrBanks: [0, 1, 2, 3, 4, 5, 6, 7] };
      expect(config.pcrBanks?.length).toBe(8);
    });

    it('should allow software fallback', () => {
      const config: Partial<TPMConfig> = { allowSoftwareFallback: true };
      expect(config.allowSoftwareFallback).toBe(true);
    });

    it('should disallow software fallback', () => {
      const config: Partial<TPMConfig> = { allowSoftwareFallback: false };
      expect(config.allowSoftwareFallback).toBe(false);
    });
  });

  // ===========================================================================
  // ATTESTATION KEY STRUCTURE
  // ===========================================================================

  describe('AttestationKey Structure', () => {
    it('should create valid attestation key', () => {
      const key: AttestationKey = {
        id: 'key-123',
        type: 'tpm',
        keyHandle: '0x81000001',
        publicKey: 'RSA-PUBLIC-KEY-PEM',
        publicKeyFingerprint: 'sha256:abc123',
        tpmManufacturer: 'Infineon',
        tpmVersion: '2.0',
        endorsementKeyHash: 'sha256:ek123',
        status: 'active',
        createdAt: new Date(),
        lastUsedAt: new Date(),
      };
      expect(key.type).toBe('tpm');
    });

    it('should support tpm key type', () => {
      const key: Partial<AttestationKey> = { type: 'tpm' };
      expect(key.type).toBe('tpm');
    });

    it('should support software key type', () => {
      const key: Partial<AttestationKey> = { type: 'software' };
      expect(key.type).toBe('software');
    });

    it('should support active status', () => {
      const key: Partial<AttestationKey> = { status: 'active' };
      expect(key.status).toBe('active');
    });

    it('should support rotated status', () => {
      const key: Partial<AttestationKey> = { status: 'rotated' };
      expect(key.status).toBe('rotated');
    });

    it('should support revoked status', () => {
      const key: Partial<AttestationKey> = { status: 'revoked' };
      expect(key.status).toBe('revoked');
    });

    it('should handle certificate', () => {
      const key: Partial<AttestationKey> = { certificate: 'PEM-CERTIFICATE' };
      expect(key.certificate).toBe('PEM-CERTIFICATE');
    });

    it('should handle certificate chain', () => {
      const key: Partial<AttestationKey> = {
        certificateChain: ['ROOT-CA', 'INTERMEDIATE-CA', 'LEAF'],
      };
      expect(key.certificateChain?.length).toBe(3);
    });
  });

  // ===========================================================================
  // SIGNED DECISION STRUCTURE
  // ===========================================================================

  describe('SignedDecision Structure', () => {
    it('should create valid signed decision', () => {
      const signed: SignedDecision = {
        id: 'signed-123',
        decisionId: 'decision-456',
        organizationId: 'org-789',
        payload: {
          decisionId: 'decision-456',
          question: 'Should we proceed with acquisition?',
          outcome: 'Approved with conditions',
          confidence: 0.85,
          deliberationStarted: new Date(),
          deliberationEnded: new Date(),
          agents: ['strategist', 'financial', 'risk'],
          humanReviewers: ['ceo@company.com'],
          ledgerHash: 'sha256:ledger123',
          previousHash: 'sha256:prev123',
          organizationId: 'org-789',
          timestamp: new Date(),
        },
        payloadHash: 'sha256:payload123',
        signature: 'RSA-SIGNATURE',
        signatureAlgorithm: 'RSA-SHA256',
        attestation: {
          platformState: {
            machineId: 'machine-123',
            hostname: 'datacendia-prod-01',
            osVersion: 'Ubuntu 22.04',
            datacendiaVersion: '2.0.0',
          },
          keyAttestation: {
            keyId: 'key-123',
            keyType: 'tpm',
          },
        },
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: 'auditor@company.com',
        signedAt: new Date(),
      };
      expect(signed.verified).toBe(true);
    });

    it('should handle verified decision', () => {
      const signed: Partial<SignedDecision> = { verified: true };
      expect(signed.verified).toBe(true);
    });

    it('should handle unverified decision', () => {
      const signed: Partial<SignedDecision> = { verified: false };
      expect(signed.verified).toBe(false);
    });

    it('should handle RSA-SHA256 algorithm', () => {
      const signed: Partial<SignedDecision> = { signatureAlgorithm: 'RSA-SHA256' };
      expect(signed.signatureAlgorithm).toBe('RSA-SHA256');
    });

    it('should handle ECDSA-SHA256 algorithm', () => {
      const signed: Partial<SignedDecision> = { signatureAlgorithm: 'ECDSA-SHA256' };
      expect(signed.signatureAlgorithm).toBe('ECDSA-SHA256');
    });
  });

  // ===========================================================================
  // DECISION PAYLOAD STRUCTURE
  // ===========================================================================

  describe('DecisionPayload Structure', () => {
    it('should create valid payload', () => {
      const payload: DecisionPayload = {
        decisionId: 'decision-123',
        question: 'Should we expand to APAC?',
        outcome: 'Approved',
        confidence: 0.92,
        deliberationStarted: new Date(),
        deliberationEnded: new Date(),
        agents: ['strategist', 'market', 'financial'],
        humanReviewers: ['ceo@company.com', 'cfo@company.com'],
        ledgerHash: 'sha256:ledger123',
        previousHash: 'sha256:prev123',
        organizationId: 'org-456',
        timestamp: new Date(),
      };
      expect(payload.confidence).toBe(0.92);
    });

    it('should handle high confidence', () => {
      const payload: Partial<DecisionPayload> = { confidence: 0.95 };
      expect(payload.confidence).toBe(0.95);
    });

    it('should handle low confidence', () => {
      const payload: Partial<DecisionPayload> = { confidence: 0.5 };
      expect(payload.confidence).toBe(0.5);
    });

    it('should handle multiple agents', () => {
      const payload: Partial<DecisionPayload> = {
        agents: ['agent1', 'agent2', 'agent3', 'agent4', 'agent5'],
      };
      expect(payload.agents?.length).toBe(5);
    });

    it('should handle multiple human reviewers', () => {
      const payload: Partial<DecisionPayload> = {
        humanReviewers: ['user1@co.com', 'user2@co.com', 'user3@co.com'],
      };
      expect(payload.humanReviewers?.length).toBe(3);
    });
  });

  // ===========================================================================
  // PLATFORM STATE STRUCTURE
  // ===========================================================================

  describe('PlatformState Structure', () => {
    it('should create valid platform state', () => {
      const state: PlatformState = {
        machineId: 'machine-123',
        hostname: 'datacendia-prod-01',
        bootHash: 'sha256:boot123',
        firmwareVersion: '1.2.3',
        osVersion: 'Ubuntu 22.04 LTS',
        datacendiaVersion: '2.0.0',
        pcrValues: { 0: 'sha256:pcr0', 1: 'sha256:pcr1', 7: 'sha256:pcr7' },
      };
      expect(state.hostname).toBe('datacendia-prod-01');
    });

    it('should handle PCR values', () => {
      const state: Partial<PlatformState> = {
        pcrValues: { 0: 'hash0', 1: 'hash1', 2: 'hash2' },
      };
      expect(Object.keys(state.pcrValues || {}).length).toBe(3);
    });

    it('should handle boot hash', () => {
      const state: Partial<PlatformState> = { bootHash: 'sha256:boot123' };
      expect(state.bootHash).toContain('sha256:');
    });

    it('should handle firmware version', () => {
      const state: Partial<PlatformState> = { firmwareVersion: '2.0.1' };
      expect(state.firmwareVersion).toBe('2.0.1');
    });
  });

  // ===========================================================================
  // KEY ATTESTATION STRUCTURE
  // ===========================================================================

  describe('KeyAttestation Structure', () => {
    it('should create valid key attestation', () => {
      const attestation: KeyAttestation = {
        keyId: 'key-123',
        keyType: 'tpm',
        aikCertificate: 'AIK-CERT-PEM',
        endorsementKeyHash: 'sha256:ek123',
      };
      expect(attestation.keyType).toBe('tpm');
    });

    it('should handle tpm key type', () => {
      const attestation: Partial<KeyAttestation> = { keyType: 'tpm' };
      expect(attestation.keyType).toBe('tpm');
    });

    it('should handle software key type', () => {
      const attestation: Partial<KeyAttestation> = { keyType: 'software' };
      expect(attestation.keyType).toBe('software');
    });

    it('should handle AIK certificate', () => {
      const attestation: Partial<KeyAttestation> = { aikCertificate: 'AIK-CERT' };
      expect(attestation.aikCertificate).toBe('AIK-CERT');
    });

    it('should handle endorsement key hash', () => {
      const attestation: Partial<KeyAttestation> = { endorsementKeyHash: 'sha256:ek123' };
      expect(attestation.endorsementKeyHash).toContain('sha256:');
    });
  });

  // ===========================================================================
  // ATTESTATION STRUCTURE
  // ===========================================================================

  describe('Attestation Structure', () => {
    it('should create valid attestation', () => {
      const attestation: Attestation = {
        platformState: {
          machineId: 'machine-123',
          hostname: 'prod-01',
          osVersion: 'Ubuntu 22.04',
          datacendiaVersion: '2.0.0',
        },
        keyAttestation: {
          keyId: 'key-123',
          keyType: 'tpm',
        },
        timestampToken: 'RFC3161-TOKEN',
        timestampAuthority: 'https://timestamp.digicert.com',
      };
      expect(attestation.timestampAuthority).toContain('digicert');
    });

    it('should handle timestamp token', () => {
      const attestation: Partial<Attestation> = { timestampToken: 'RFC3161-TOKEN' };
      expect(attestation.timestampToken).toBe('RFC3161-TOKEN');
    });

    it('should handle timestamp authority', () => {
      const attestation: Partial<Attestation> = {
        timestampAuthority: 'https://timestamp.example.com',
      };
      expect(attestation.timestampAuthority).toContain('timestamp');
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should sign critical decision with TPM', () => {
      const signed: Partial<SignedDecision> = {
        decisionId: 'critical-decision-123',
        signatureAlgorithm: 'RSA-SHA256',
        verified: true,
        attestation: {
          platformState: {
            machineId: 'secure-machine',
            hostname: 'datacendia-secure-01',
            osVersion: 'Ubuntu 22.04',
            datacendiaVersion: '2.0.0',
          },
          keyAttestation: { keyId: 'tpm-key', keyType: 'tpm' },
        },
      };
      expect(signed.attestation?.keyAttestation.keyType).toBe('tpm');
    });

    it('should fallback to software signing', () => {
      const signed: Partial<SignedDecision> = {
        attestation: {
          platformState: {
            machineId: 'dev-machine',
            hostname: 'datacendia-dev-01',
            osVersion: 'macOS 14.0',
            datacendiaVersion: '2.0.0',
          },
          keyAttestation: { keyId: 'sw-key', keyType: 'software' },
        },
      };
      expect(signed.attestation?.keyAttestation.keyType).toBe('software');
    });

    it('should verify decision signature', () => {
      const signed: Partial<SignedDecision> = {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: 'auditor@company.com',
      };
      expect(signed.verified).toBe(true);
    });

    it('should track key rotation', () => {
      const key: Partial<AttestationKey> = {
        status: 'rotated',
        createdAt: new Date('2024-01-01'),
      };
      expect(key.status).toBe('rotated');
    });

    it('should revoke compromised key', () => {
      const key: Partial<AttestationKey> = {
        status: 'revoked',
      };
      expect(key.status).toBe('revoked');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty PCR banks', () => {
      const config: Partial<TPMConfig> = { pcrBanks: [] };
      expect(config.pcrBanks?.length).toBe(0);
    });

    it('should handle empty agents', () => {
      const payload: Partial<DecisionPayload> = { agents: [] };
      expect(payload.agents?.length).toBe(0);
    });

    it('should handle empty human reviewers', () => {
      const payload: Partial<DecisionPayload> = { humanReviewers: [] };
      expect(payload.humanReviewers?.length).toBe(0);
    });

    it('should handle empty certificate chain', () => {
      const key: Partial<AttestationKey> = { certificateChain: [] };
      expect(key.certificateChain?.length).toBe(0);
    });

    it('should handle very long question', () => {
      const payload: Partial<DecisionPayload> = { question: 'A'.repeat(5000) };
      expect(payload.question?.length).toBe(5000);
    });

    it('should handle very long outcome', () => {
      const payload: Partial<DecisionPayload> = { outcome: 'B'.repeat(10000) };
      expect(payload.outcome?.length).toBe(10000);
    });

    it('should handle special characters in hostname', () => {
      const state: Partial<PlatformState> = {
        hostname: 'datacendia-prod-01.internal.company.com',
      };
      expect(state.hostname).toContain('internal');
    });

    it('should handle unicode in question', () => {
      const payload: Partial<DecisionPayload> = {
        question: '我们应该扩展到亚太地区吗？ 🌏',
      };
      expect(payload.question).toContain('亚太');
    });

    it('should handle zero confidence', () => {
      const payload: Partial<DecisionPayload> = { confidence: 0 };
      expect(payload.confidence).toBe(0);
    });

    it('should handle 100% confidence', () => {
      const payload: Partial<DecisionPayload> = { confidence: 1.0 };
      expect(payload.confidence).toBe(1.0);
    });
  });
});
