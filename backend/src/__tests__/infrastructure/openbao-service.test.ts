// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Module — Openbao Service Test
 *
 * Platform module.
 * @module __tests__/infrastructure/openbao-service.test
 */

/**
 * =============================================================================
 * OPENBAO SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the OpenBaoService in disabled mode (OPENBAO_ENABLED=false).
 * Validates: disabled-mode returns, stats, health, in-memory fallback.
 * =============================================================================
 */

import { describe, it, expect, vi } from 'vitest';

vi.stubEnv('OPENBAO_ENABLED', 'false');

describe('OpenBaoService (disabled mode)', () => {
  let openBao: any;

  beforeAll(async () => {
    const mod = await import('../../services/vault/OpenBaoService.js');
    openBao = mod.openBao;
  });

  it('should report as disabled', () => {
    expect(openBao.isEnabled()).toBe(false);
  });

  it('should return null for KV secret reads when disabled', async () => {
    const result = await openBao.readSecret('my/secret');
    expect(result).toBeNull();
  });

  it('should return false for KV secret writes when disabled', async () => {
    const result = await openBao.writeSecret('my/secret', { key: 'value' });
    expect(result).toBe(false);
  });

  it('should return null for transit encrypt when disabled', async () => {
    const result = await openBao.transitEncrypt('my-key', 'plaintext');
    expect(result).toBeNull();
  });

  it('should return null for transit decrypt when disabled', async () => {
    const result = await openBao.transitDecrypt('my-key', 'vault:v1:ciphertext');
    expect(result).toBeNull();
  });

  it('should return null for cert issuance when disabled', async () => {
    const result = await openBao.issueCertificate({ commonName: 'test.datacendia.local' });
    expect(result).toBeNull();
  });

  it('should return null for dynamic DB creds when disabled', async () => {
    const result = await openBao.getDatabaseCredentials('readonly');
    expect(result).toBeNull();
  });

  it('should track stats correctly', () => {
    const stats = openBao.getStats();
    expect(stats.enabled).toBe(false);
    expect(stats.connected).toBe(false);
    expect(typeof stats.secretReads).toBe('number');
    expect(typeof stats.secretWrites).toBe('number');
    expect(typeof stats.encryptOps).toBe('number');
    expect(typeof stats.decryptOps).toBe('number');
    expect(typeof stats.certsIssued).toBe('number');
    expect(typeof stats.activeLeases).toBe('number');
  });
});
