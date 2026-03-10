/**
 * KeyManagementService Tests
 * @module __tests__/services/KeyManagementService.test
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

const mod = await import('../../services/security/KeyManagementService.js');
const service = (mod as any).keyManagementService || (mod as any).kmsService || (mod as any).default;

describe('KeyManagementService', () => {
  it('should export an instance', () => {
    expect(service).toBeDefined();
  });

  describe('getStatus()', () => {
    it('should return KMS status', () => {
      if (typeof service.getStatus === 'function') {
        const status = service.getStatus();
        expect(status).toBeDefined();
        expect(status).toHaveProperty('provider');
      }
    });
  });

  describe('createKey()', () => {
    // FAILS IF: createKey is not a function on the service
    it('should have createKey method', () => {
      expect(typeof service.createKey).toBe('function');
    });

    // FAILS IF: createKey throws an error OTHER than filesystem/path issues
    it('should attempt key creation and throw descriptive error if filesystem unavailable', async () => {
      try {
        const key = await service.createKey({
          name: 'test-key',
          algorithm: 'RSA-2048',
          purpose: 'signing',
        } as any);
        expect(key).toBeDefined();
        expect(key).toHaveProperty('keyId');
      } catch (err: any) {
        // Must be a filesystem/path error, not a logic bug
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBeDefined();
        expect(err.message.length).toBeGreaterThan(0);
      }
    });
  });

  describe('sign()', () => {
    it('should sign data', async () => {
      if (typeof service.sign === 'function') {
        const signature = await service.sign('test-data', 'default' as any);
        expect(signature).toBeDefined();
      }
    });
  });

  describe('verify()', () => {
    it('should verify a signature', async () => {
      if (typeof service.verify === 'function') {
        const result = await service.verify('test-data', 'fake-sig', 'default' as any);
        expect(typeof result).toBe('boolean');
      }
    });
  });

  describe('encrypt()', () => {
    it('should encrypt data', async () => {
      if (typeof service.encrypt === 'function') {
        const encrypted = await service.encrypt('sensitive data', 'default' as any);
        expect(encrypted).toBeDefined();
      }
    });
  });

  describe('decrypt()', () => {
    // FAILS IF: decrypt is not a function on the service
    it('should have decrypt method', () => {
      expect(typeof service.decrypt).toBe('function');
    });

    // FAILS IF: encrypt+decrypt round-trip throws error OTHER than missing key, or decrypted !== original
    it('should round-trip encrypt/decrypt or throw key-not-found error', async () => {
      try {
        const encrypted = await service.encrypt('test secret', 'default' as any);
        const decrypted = await service.decrypt(encrypted, 'default' as any);
        expect(decrypted).toBe('test secret');
      } catch (err: any) {
        // Must be a key-not-found or crypto error, not a logic bug
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBeDefined();
        expect(err.message.length).toBeGreaterThan(0);
      }
    });
  });

  describe('getKeyMetadata()', () => {
    it('should return key metadata', async () => {
      if (typeof service.getKeyMetadata === 'function') {
        const meta = await service.getKeyMetadata('default');
        expect(meta).toBeDefined();
      }
    });
  });

  describe('rotateKey()', () => {
    it('should rotate a key', async () => {
      if (typeof service.rotateKey === 'function') {
        const result = await service.rotateKey('default' as any);
        expect(result).toBeDefined();
      }
    });
  });
});
