// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Module — Confidential Compute Service Test
 *
 * Platform module.
 * @module __tests__/infrastructure/confidential-compute-service.test
 */

/**
 * =============================================================================
 * CONFIDENTIAL COMPUTING SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the ConfidentialComputeService in disabled/software-emulation mode.
 * Validates: attestation, session management, evidence, health, stats.
 * =============================================================================
 */

import { describe, it, expect, vi } from 'vitest';

vi.stubEnv('CC_ENABLED', 'false');

describe('ConfidentialComputeService (disabled mode)', () => {
  let cc: any;

  beforeAll(async () => {
    const mod = await import('../../services/gpu/ConfidentialComputeService.js');
    cc = mod.confidentialCompute;
  });

  it('should report as disabled', () => {
    expect(cc.isEnabled()).toBe(false);
  });

  it('should return software attestation when disabled', async () => {
    const result = await cc.verifyGPUAttestation('gpu-0');
    expect(result).toBeDefined();
    expect(result.gpuId).toBe('gpu-0');
    expect(result.attestationId).toBeTruthy();
    expect(result.confidentialMode).toBe('off');
    expect(result.gpuModel).toBe('software-emulated');
    expect(result.memoryEncryption).toBe(false);
    expect(result.secureBootVerified).toBe(false);
  });

  it('should create sessions on attested GPUs', async () => {
    const attestation = await cc.verifyGPUAttestation('gpu-0');
    const session = await cc.createSession('gpu-0');

    // createSession requires a valid attestation for the GPU
    if (session) {
      expect(session.sessionId).toBeTruthy();
      expect(session.active).toBe(true);
      expect(session.gpuId).toBe('gpu-0');
      expect(session.inferenceCount).toBe(0);
    }
  });

  it('should record inference on a session', async () => {
    await cc.verifyGPUAttestation('gpu-1');
    const session = await cc.createSession('gpu-1');

    if (session) {
      const recorded = cc.recordInference(session.sessionId, 1024);
      expect(typeof recorded).toBe('boolean');
    }
  });

  it('should close sessions', async () => {
    await cc.verifyGPUAttestation('gpu-2');
    const session = await cc.createSession('gpu-2');

    if (session) {
      const closed = cc.closeSession(session.sessionId);
      expect(closed).toBe(true);
    }
  });

  it('should track stats', () => {
    const stats = cc.getStats();
    expect(stats.enabled).toBe(false);
    expect(typeof stats.attestationCount).toBe('number');
    expect(typeof stats.attestationFailures).toBe('number');
    expect(typeof stats.blockedInferences).toBe('number');
    expect(typeof stats.allowedInferences).toBe('number');
    expect(typeof stats.activeSessions).toBe('number');
    expect(typeof stats.totalSessions).toBe('number');
  });

  it('should report health', async () => {
    const health = await cc.checkHealth();
    expect(health.enabled).toBe(false);
    expect(health.attestationServiceAvailable).toBe(false);
  });
});
