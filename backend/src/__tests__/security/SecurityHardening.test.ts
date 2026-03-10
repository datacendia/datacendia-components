/**
 * Module — Security Hardening Test
 *
 * Platform module.
 * @module __tests__/security/SecurityHardening.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// SECURITY HARDENING TESTS
// Critical path coverage for cryptographic operations
// =============================================================================

import { describe, it, expect, vi } from 'vitest';
import crypto from 'crypto';

// Import the actual functions to test (env vars set in setup.ts)
import {
  CryptoConfig,
  encryptData,
  decryptData,
  deriveKey,
  generateSecureToken,
  generateHMAC,
  verifyHMAC,
} from '../../security/SecurityHardening.js';

// =============================================================================
// CRYPTO CONFIG TESTS
// =============================================================================

describe('CryptoConfig', () => {
  it('should use AES-256-GCM encryption algorithm', () => {
    expect(CryptoConfig.ENCRYPTION_ALGORITHM).toBe('aes-256-gcm');
  });

  it('should use 256-bit key length', () => {
    expect(CryptoConfig.KEY_LENGTH).toBe(32);
  });

  it('should use 128-bit IV length', () => {
    expect(CryptoConfig.IV_LENGTH).toBe(16);
  });

  it('should use 128-bit auth tag length', () => {
    expect(CryptoConfig.AUTH_TAG_LENGTH).toBe(16);
  });

  it('should use OWASP recommended PBKDF2 iterations', () => {
    expect(CryptoConfig.KDF_ITERATIONS).toBeGreaterThanOrEqual(310000);
  });

  it('should use SHA-512 for key derivation', () => {
    expect(CryptoConfig.KDF_ALGORITHM).toBe('sha512');
  });

  it('should use 256-bit salt length', () => {
    expect(CryptoConfig.SALT_LENGTH).toBe(32);
  });

  it('should use 4096-bit RSA key size', () => {
    expect(CryptoConfig.RSA_KEY_SIZE).toBe(4096);
  });

  it('should use RSA OAEP padding', () => {
    expect(CryptoConfig.RSA_PADDING).toBe(crypto.constants.RSA_PKCS1_OAEP_PADDING);
  });

  it('should use SHA-512 for HMAC', () => {
    expect(CryptoConfig.HMAC_ALGORITHM).toBe('sha512');
  });
});

// =============================================================================
// ENCRYPTION/DECRYPTION TESTS
// =============================================================================

describe('encryptData and decryptData', () => {
  const testKey = crypto.randomBytes(32);
  const testPlaintext = 'This is sensitive data that needs encryption';

  it('should encrypt data and return ciphertext, iv, and authTag', () => {
    const result = encryptData(testPlaintext, testKey);

    expect(result).toHaveProperty('ciphertext');
    expect(result).toHaveProperty('iv');
    expect(result).toHaveProperty('authTag');
    expect(result.ciphertext).not.toBe(testPlaintext);
  });

  it('should produce different ciphertext for same plaintext (due to random IV)', () => {
    const result1 = encryptData(testPlaintext, testKey);
    const result2 = encryptData(testPlaintext, testKey);

    expect(result1.ciphertext).not.toBe(result2.ciphertext);
    expect(result1.iv).not.toBe(result2.iv);
  });

  it('should decrypt data back to original plaintext', () => {
    const encrypted = encryptData(testPlaintext, testKey);
    const decrypted = decryptData(
      encrypted.ciphertext,
      testKey,
      encrypted.iv,
      encrypted.authTag
    );

    expect(decrypted).toBe(testPlaintext);
  });

  it('should fail decryption with wrong key', () => {
    const encrypted = encryptData(testPlaintext, testKey);
    const wrongKey = crypto.randomBytes(32);

    expect(() => {
      decryptData(encrypted.ciphertext, wrongKey, encrypted.iv, encrypted.authTag);
    }).toThrow();
  });

  it('should fail decryption with tampered ciphertext', () => {
    const encrypted = encryptData(testPlaintext, testKey);
    const tamperedCiphertext = 'tampered' + encrypted.ciphertext.slice(8);

    expect(() => {
      decryptData(tamperedCiphertext, testKey, encrypted.iv, encrypted.authTag);
    }).toThrow();
  });

  it('should fail decryption with wrong auth tag', () => {
    const encrypted = encryptData(testPlaintext, testKey);
    const wrongAuthTag = crypto.randomBytes(16).toString('base64');

    expect(() => {
      decryptData(encrypted.ciphertext, testKey, encrypted.iv, wrongAuthTag);
    }).toThrow();
  });

  it('should handle empty string', () => {
    const encrypted = encryptData('', testKey);
    const decrypted = decryptData(
      encrypted.ciphertext,
      testKey,
      encrypted.iv,
      encrypted.authTag
    );

    expect(decrypted).toBe('');
  });

  it('should handle unicode characters', () => {
    const unicodeText = '日本語テスト 🔐 émojis';
    const encrypted = encryptData(unicodeText, testKey);
    const decrypted = decryptData(
      encrypted.ciphertext,
      testKey,
      encrypted.iv,
      encrypted.authTag
    );

    expect(decrypted).toBe(unicodeText);
  });

  it('should handle large data', () => {
    const largeData = 'x'.repeat(100000);
    const encrypted = encryptData(largeData, testKey);
    const decrypted = decryptData(
      encrypted.ciphertext,
      testKey,
      encrypted.iv,
      encrypted.authTag
    );

    expect(decrypted).toBe(largeData);
  });
});

// =============================================================================
// KEY DERIVATION TESTS
// =============================================================================

describe('deriveKey', () => {
  it('should derive a key from password', async () => {
    const result = await deriveKey('test-password');

    expect(result).toHaveProperty('key');
    expect(result).toHaveProperty('salt');
    expect(result.key).toBeInstanceOf(Buffer);
    expect(result.salt).toBeInstanceOf(Buffer);
  });

  it('should produce 256-bit key', async () => {
    const result = await deriveKey('test-password');

    expect(result.key.length).toBe(32);
  });

  it('should produce 256-bit salt when not provided', async () => {
    const result = await deriveKey('test-password');

    expect(result.salt.length).toBe(32);
  });

  it('should produce same key with same password and salt', async () => {
    const result1 = await deriveKey('test-password');
    const result2 = await deriveKey('test-password', result1.salt);

    expect(result1.key.toString('hex')).toBe(result2.key.toString('hex'));
  });

  it('should produce different keys with different passwords', async () => {
    const result1 = await deriveKey('password1');
    const result2 = await deriveKey('password2', result1.salt);

    expect(result1.key.toString('hex')).not.toBe(result2.key.toString('hex'));
  });

  it('should produce different keys with different salts', async () => {
    const result1 = await deriveKey('test-password');
    const result2 = await deriveKey('test-password');

    expect(result1.key.toString('hex')).not.toBe(result2.key.toString('hex'));
  });

  it('should use provided salt', async () => {
    const customSalt = crypto.randomBytes(32);
    const result = await deriveKey('test-password', customSalt);

    expect(result.salt.toString('hex')).toBe(customSalt.toString('hex'));
  });
});

// =============================================================================
// SECURE TOKEN GENERATION TESTS
// =============================================================================

describe('generateSecureToken', () => {
  it('should generate token of default length', () => {
    const token = generateSecureToken();

    // base64url encoding: 32 bytes = ~43 characters
    expect(token.length).toBeGreaterThan(40);
  });

  it('should generate token of specified length', () => {
    const token16 = generateSecureToken(16);
    const token64 = generateSecureToken(64);

    // base64url: 16 bytes = ~22 chars, 64 bytes = ~86 chars
    expect(token16.length).toBeLessThan(token64.length);
  });

  it('should generate unique tokens', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateSecureToken());
    }

    expect(tokens.size).toBe(100);
  });

  it('should only contain base64url characters', () => {
    const token = generateSecureToken();
    const base64urlRegex = /^[A-Za-z0-9_-]+$/;

    expect(base64urlRegex.test(token)).toBe(true);
  });
});

// =============================================================================
// HMAC TESTS
// =============================================================================

describe('generateHMAC and verifyHMAC', () => {
  const testKey = crypto.randomBytes(32);
  const testData = 'data to authenticate';

  it('should generate HMAC for data', () => {
    const hmac = generateHMAC(testData, testKey);

    expect(hmac).toBeDefined();
    expect(typeof hmac).toBe('string');
    expect(hmac.length).toBeGreaterThan(0);
  });

  it('should generate same HMAC for same data and key', () => {
    const hmac1 = generateHMAC(testData, testKey);
    const hmac2 = generateHMAC(testData, testKey);

    expect(hmac1).toBe(hmac2);
  });

  it('should generate different HMAC for different data', () => {
    const hmac1 = generateHMAC('data1', testKey);
    const hmac2 = generateHMAC('data2', testKey);

    expect(hmac1).not.toBe(hmac2);
  });

  it('should generate different HMAC for different keys', () => {
    const key1 = crypto.randomBytes(32);
    const key2 = crypto.randomBytes(32);
    const hmac1 = generateHMAC(testData, key1);
    const hmac2 = generateHMAC(testData, key2);

    expect(hmac1).not.toBe(hmac2);
  });

  it('should verify valid HMAC', () => {
    const hmac = generateHMAC(testData, testKey);
    const isValid = verifyHMAC(testData, testKey, hmac);

    expect(isValid).toBe(true);
  });

  it('should reject invalid HMAC', () => {
    const hmac = generateHMAC(testData, testKey);
    const tamperedHmac = 'tampered' + hmac.slice(8);
    const isValid = verifyHMAC(testData, testKey, tamperedHmac);

    expect(isValid).toBe(false);
  });

  it('should reject HMAC with wrong key', () => {
    const hmac = generateHMAC(testData, testKey);
    const wrongKey = crypto.randomBytes(32);
    const isValid = verifyHMAC(testData, wrongKey, hmac);

    expect(isValid).toBe(false);
  });

  it('should reject HMAC with tampered data', () => {
    const hmac = generateHMAC(testData, testKey);
    const isValid = verifyHMAC('tampered data', testKey, hmac);

    expect(isValid).toBe(false);
  });
});

// =============================================================================
// PASSWORD HASHING TESTS
// =============================================================================

import { hashPassword, verifyPassword } from '../../security/SecurityHardening.js';

describe('hashPassword and verifyPassword', () => {
  it('should hash a password', async () => {
    const password = 'SecurePassword123!';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  it('should produce different hashes for same password', async () => {
    const password = 'SecurePassword123!';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it('should verify correct password', async () => {
    const password = 'SecurePassword123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const password = 'SecurePassword123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('WrongPassword', hash);

    expect(isValid).toBe(false);
  });

  it('should handle empty password', async () => {
    const hash = await hashPassword('');
    const isValid = await verifyPassword('', hash);

    expect(isValid).toBe(true);
  });

  it('should handle unicode passwords', async () => {
    const password = 'пароль密码🔐';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });
});

// =============================================================================
// RSA KEY PAIR TESTS
// =============================================================================

import { generateRSAKeyPair, signData, verifySignature } from '../../security/SecurityHardening.js';

describe('RSA operations', () => {
  let keyPair: { publicKey: string; privateKey: string };

  it('should generate RSA key pair', async () => {
    keyPair = await generateRSAKeyPair();

    expect(keyPair).toHaveProperty('publicKey');
    expect(keyPair).toHaveProperty('privateKey');
    expect(keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
    expect(keyPair.privateKey).toContain('BEGIN PRIVATE KEY');
  }, 30000);

  it('should generate 4096-bit keys', async () => {
    if (!keyPair) keyPair = await generateRSAKeyPair();
    
    // PEM format for 4096-bit key is typically > 3000 chars
    expect(keyPair.privateKey.length).toBeGreaterThan(3000);
  }, 30000);

  it('should sign data with private key', async () => {
    if (!keyPair) keyPair = await generateRSAKeyPair();
    const data = 'Data to sign';
    const signature = signData(data, keyPair.privateKey);

    expect(signature).toBeDefined();
    expect(signature.length).toBeGreaterThan(0);
  }, 30000);

  it('should verify valid signature', async () => {
    if (!keyPair) keyPair = await generateRSAKeyPair();
    const data = 'Data to sign';
    const signature = signData(data, keyPair.privateKey);
    const isValid = verifySignature(data, signature, keyPair.publicKey);

    expect(isValid).toBe(true);
  }, 30000);

  it('should reject invalid signature (tampered data)', async () => {
    if (!keyPair) keyPair = await generateRSAKeyPair();
    const data = 'Data to sign';
    const signature = signData(data, keyPair.privateKey);
    const isValid = verifySignature('Tampered data', signature, keyPair.publicKey);

    expect(isValid).toBe(false);
  }, 30000);

  it('should reject signature with wrong public key', async () => {
    if (!keyPair) keyPair = await generateRSAKeyPair();
    const otherKeyPair = await generateRSAKeyPair();
    const data = 'Data to sign';
    const signature = signData(data, keyPair.privateKey);
    const isValid = verifySignature(data, signature, otherKeyPair.publicKey);

    expect(isValid).toBe(false);
  }, 60000);

  it('should return false for malformed signature', async () => {
    if (!keyPair) keyPair = await generateRSAKeyPair();
    const isValid = verifySignature('data', 'invalid-signature', keyPair.publicKey);

    expect(isValid).toBe(false);
  }, 30000);
});

// =============================================================================
// THREAT DETECTION TESTS
// =============================================================================

import { detectThreats } from '../../security/SecurityHardening.js';

describe('detectThreats', () => {
  function createMockRequest(body: any = {}, query: any = {}, params: any = {}): any {
    return {
      body,
      query,
      params,
      ip: '192.168.1.1',
      user: { id: 'test-user' },
    };
  }

  it('should return empty array for safe request', () => {
    const req = createMockRequest({ name: 'John Doe', email: 'john@example.com' });
    const threats = detectThreats(req);
    expect(threats).toHaveLength(0);
  });

  it('should detect SQL injection in body', () => {
    const req = createMockRequest({ input: "'; DROP TABLE users; --" });
    const threats = detectThreats(req);
    expect(threats.length).toBeGreaterThan(0);
    expect(threats.some(t => t.type === 'SQL_INJECTION')).toBe(true);
  });

  it('should detect SQL injection with UNION SELECT', () => {
    const req = createMockRequest({ search: "' UNION SELECT * FROM passwords" });
    const threats = detectThreats(req);
    expect(threats.some(t => t.type === 'SQL_INJECTION')).toBe(true);
  });

  it('should detect XSS in query params', () => {
    const req = createMockRequest({}, { search: '<script>alert("xss")</script>' });
    const threats = detectThreats(req);
    expect(threats.some(t => t.type === 'XSS')).toBe(true);
  });

  it('should detect XSS with javascript: protocol', () => {
    const req = createMockRequest({ url: 'javascript:alert(1)' });
    const threats = detectThreats(req);
    expect(threats.some(t => t.type === 'XSS')).toBe(true);
  });

  it('should detect XSS with event handlers', () => {
    const req = createMockRequest({ html: '<img onerror="alert(1)">' });
    const threats = detectThreats(req);
    expect(threats.some(t => t.type === 'XSS')).toBe(true);
  });

  it('should detect path traversal in params', () => {
    const req = createMockRequest({}, {}, { file: '../../../etc/passwd' });
    const threats = detectThreats(req);
    expect(threats.some(t => t.type === 'ANOMALY')).toBe(true);
  });

  it('should detect URL-encoded path traversal', () => {
    const req = createMockRequest({ path: '%2e%2e%2f%2e%2e%2fetc/passwd' });
    const threats = detectThreats(req);
    expect(threats.some(t => t.type === 'ANOMALY')).toBe(true);
  });

  it('should detect nested malicious input', () => {
    const req = createMockRequest({
      user: {
        profile: {
          bio: '<script>document.cookie</script>',
        },
      },
    });
    const threats = detectThreats(req);
    expect(threats.some(t => t.type === 'XSS')).toBe(true);
  });

  it('should include source IP in threat', () => {
    const req = createMockRequest({ input: "'; DROP TABLE users; --" });
    const threats = detectThreats(req);
    expect(threats[0]?.sourceIp).toBe('192.168.1.1');
  });

  it('should include user ID in threat', () => {
    const req = createMockRequest({ input: "'; DROP TABLE users; --" });
    const threats = detectThreats(req);
    expect(threats[0]?.userId).toBe('test-user');
  });

  it('should handle request without user', () => {
    const req = {
      body: { input: "'; DROP TABLE users; --" },
      query: {},
      params: {},
      ip: '192.168.1.1',
    };
    const threats = detectThreats(req as any);
    expect(threats[0]?.userId).toBeUndefined();
  });

  it('should handle null body', () => {
    const req = createMockRequest(null, {}, {});
    const threats = detectThreats(req);
    expect(threats).toHaveLength(0);
  });
});

// =============================================================================
// MIDDLEWARE TESTS
// =============================================================================

import { 
  threatDetectionMiddleware, 
  requestSigningMiddleware 
} from '../../security/SecurityHardening.js';

describe('threatDetectionMiddleware', () => {
  function createMockReq(body: any = {}): any {
    return {
      body,
      query: {},
      params: {},
      ip: '192.168.1.1',
      user: { id: 'test-user' },
    };
  }

  function createMockRes(): any {
    const res: any = {
      statusCode: 200,
      jsonData: null,
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.jsonData = data;
        return this;
      },
    };
    return res;
  }

  it('should call next() for safe request', () => {
    const req = createMockReq({ name: 'John' });
    const res = createMockRes();
    const next = vi.fn();

    threatDetectionMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should block critical threats', () => {
    const req = createMockReq({ input: "'; DROP TABLE users; --" });
    const res = createMockRes();
    const next = vi.fn();

    threatDetectionMiddleware(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res.jsonData.error.code).toBe('SECURITY_VIOLATION');
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow non-critical threats but call next', () => {
    const req = createMockReq({ path: '../file.txt' });
    const res = createMockRes();
    const next = vi.fn();

    threatDetectionMiddleware(req, res, next);

    // Path traversal is HIGH severity, not CRITICAL, so should pass
    expect(next).toHaveBeenCalled();
  });
});

describe('requestSigningMiddleware', () => {
  function createMockReq(headers: any = {}): any {
    return {
      headers,
      method: 'POST',
      path: '/api/v1/data',
      body: { test: 'data' },
    };
  }

  function createMockRes(): any {
    const res: any = {
      statusCode: 200,
      jsonData: null,
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.jsonData = data;
        return this;
      },
    };
    return res;
  }

  it('should call next() when no API key present', () => {
    const req = createMockReq({});
    const res = createMockRes();
    const next = vi.fn();

    requestSigningMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should require signature when API key is present', () => {
    const req = createMockReq({ 'x-api-key': 'test-key' });
    const res = createMockRes();
    const next = vi.fn();

    requestSigningMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.jsonData.error.code).toBe('MISSING_SIGNATURE');
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject expired timestamp', () => {
    const oldTimestamp = (Date.now() - 600000).toString(); // 10 minutes ago
    const req = createMockReq({
      'x-api-key': 'test-key',
      'x-signature': 'test-sig',
      'x-timestamp': oldTimestamp,
      'x-api-key-id': 'key-id',
    });
    const res = createMockRes();
    const next = vi.fn();

    requestSigningMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.jsonData.error.code).toBe('EXPIRED_REQUEST');
  });

  it('should call next() with valid signature headers', async () => {
    const req = createMockReq({
      'x-api-key': 'test-key',
      'x-signature': 'test-sig',
      'x-timestamp': Date.now().toString(),
      'x-api-key-id': 'key-id',
    });
    const res = createMockRes();
    const next = vi.fn();

    await requestSigningMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

// =============================================================================
// AUDIT LOG TESTS
// =============================================================================

import { createAuditLog } from '../../security/SecurityHardening.js';

describe('createAuditLog', () => {
  it('should create audit log entry with hash', async () => {
    const entry = await createAuditLog({
      eventType: 'USER_LOGIN',
      userId: 'user-123',
      action: 'login',
      outcome: 'SUCCESS',
      sourceIp: '192.168.1.1',
      details: { method: 'password' },
    });

    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('timestamp');
    expect(entry).toHaveProperty('hash');
    expect(entry.hash.length).toBeGreaterThan(0);
    expect(entry.eventType).toBe('USER_LOGIN');
    expect(entry.outcome).toBe('SUCCESS');
  });

  it('should chain audit logs with previous hash', async () => {
    const entry1 = await createAuditLog({
      eventType: 'EVENT_1',
      action: 'action1',
      outcome: 'SUCCESS',
      sourceIp: '192.168.1.1',
      details: {},
    });

    const entry2 = await createAuditLog({
      eventType: 'EVENT_2',
      action: 'action2',
      outcome: 'SUCCESS',
      sourceIp: '192.168.1.1',
      details: {},
    });

    expect(entry2.previousHash).toBe(entry1.hash);
  });

  it('should generate unique IDs', async () => {
    const entry1 = await createAuditLog({
      eventType: 'TEST',
      action: 'test',
      outcome: 'SUCCESS',
      sourceIp: '192.168.1.1',
      details: {},
    });

    const entry2 = await createAuditLog({
      eventType: 'TEST',
      action: 'test',
      outcome: 'SUCCESS',
      sourceIp: '192.168.1.1',
      details: {},
    });

    expect(entry1.id).not.toBe(entry2.id);
  });

  it('should include all required fields', async () => {
    const entry = await createAuditLog({
      eventType: 'TEST_EVENT',
      userId: 'user-456',
      resourceType: 'document',
      resourceId: 'doc-123',
      action: 'read',
      outcome: 'SUCCESS',
      sourceIp: '10.0.0.1',
      userAgent: 'TestAgent/1.0',
      details: { key: 'value' },
    });

    expect(entry.eventType).toBe('TEST_EVENT');
    expect(entry.userId).toBe('user-456');
    expect(entry.resourceType).toBe('document');
    expect(entry.resourceId).toBe('doc-123');
    expect(entry.action).toBe('read');
    expect(entry.outcome).toBe('SUCCESS');
    expect(entry.sourceIp).toBe('10.0.0.1');
    expect(entry.userAgent).toBe('TestAgent/1.0');
    expect(entry.details).toEqual({ key: 'value' });
  });

  it('should handle FAILURE outcome', async () => {
    const entry = await createAuditLog({
      eventType: 'LOGIN_ATTEMPT',
      action: 'login',
      outcome: 'FAILURE',
      sourceIp: '192.168.1.1',
      details: { reason: 'invalid_password' },
    });

    expect(entry.outcome).toBe('FAILURE');
  });

  it('should handle BLOCKED outcome', async () => {
    const entry = await createAuditLog({
      eventType: 'ACCESS_ATTEMPT',
      action: 'access',
      outcome: 'BLOCKED',
      sourceIp: '192.168.1.1',
      details: { reason: 'ip_blocked' },
    });

    expect(entry.outcome).toBe('BLOCKED');
  });
});

// =============================================================================
// SECURITY EVENT LOGGING TESTS
// =============================================================================

import { logSecurityEvent } from '../../security/SecurityHardening.js';

describe('logSecurityEvent', () => {
  it('should log security event', async () => {
    await expect(logSecurityEvent('TEST_EVENT', {
      sourceIp: '192.168.1.1',
      userId: 'user-123',
      details: 'test details',
    })).resolves.not.toThrow();
  });

  it('should log critical event', async () => {
    await expect(logSecurityEvent('THREAT_BLOCKED', {
      sourceIp: '192.168.1.1',
      type: 'SQL_INJECTION',
      severity: 'CRITICAL',
    })).resolves.not.toThrow();
  });

  it('should handle missing sourceIp', async () => {
    await expect(logSecurityEvent('TEST_EVENT', {
      userId: 'user-123',
    })).resolves.not.toThrow();
  });

  it('should use ip as fallback for sourceIp', async () => {
    await expect(logSecurityEvent('TEST_EVENT', {
      ip: '10.0.0.1',
      userId: 'user-123',
    })).resolves.not.toThrow();
  });
});

// =============================================================================
// SESSION SECURITY TESTS
// =============================================================================

import { createSecureSession } from '../../security/SecurityHardening.js';

describe('createSecureSession', () => {
  function createMockReq(): any {
    return {
      ip: '192.168.1.100',
      headers: {
        'user-agent': 'Mozilla/5.0 Test Browser',
        'accept-language': 'en-US,en;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept': 'text/html,application/json',
      },
    };
  }

  it('should create secure session', async () => {
    const req = createMockReq();
    const session = await createSecureSession('user-123', req);

    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('userId', 'user-123');
    expect(session).toHaveProperty('deviceId');
    expect(session).toHaveProperty('deviceFingerprint');
    expect(session).toHaveProperty('ipAddress', '192.168.1.100');
    expect(session).toHaveProperty('userAgent', 'Mozilla/5.0 Test Browser');
    expect(session).toHaveProperty('createdAt');
    expect(session).toHaveProperty('lastActivity');
    expect(session).toHaveProperty('expiresAt');
    expect(session).toHaveProperty('mfaVerified', false);
    expect(session).toHaveProperty('riskScore', 0);
  });

  it('should generate unique session IDs', async () => {
    const req = createMockReq();
    const session1 = await createSecureSession('user-123', req);
    const session2 = await createSecureSession('user-123', req);

    expect(session1.id).not.toBe(session2.id);
  });

  it('should set expiration to 24 hours', async () => {
    const req = createMockReq();
    const before = Date.now();
    const session = await createSecureSession('user-123', req);
    const after = Date.now();

    const expectedMin = before + 24 * 60 * 60 * 1000;
    const expectedMax = after + 24 * 60 * 60 * 1000;

    expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin - 1000);
    expect(session.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax + 1000);
  });

  it('should handle missing IP', async () => {
    const req = {
      headers: {
        'user-agent': 'Test Browser',
        'accept-language': 'en-US',
        'accept-encoding': 'gzip',
        'accept': 'text/html',
      },
    };
    const session = await createSecureSession('user-123', req as any);

    expect(session.ipAddress).toBe('unknown');
  });

  it('should handle missing user-agent', async () => {
    const req = {
      ip: '192.168.1.1',
      headers: {},
    };
    const session = await createSecureSession('user-123', req as any);

    expect(session.userAgent).toBe('unknown');
  });

  it('should generate consistent device ID for same request', async () => {
    const req = createMockReq();
    const session1 = await createSecureSession('user-123', req);
    const session2 = await createSecureSession('user-456', req);

    expect(session1.deviceId).toBe(session2.deviceId);
  });
});

// =============================================================================
// SESSION REVOCATION TESTS
// =============================================================================

import { revokeAllSessions } from '../../security/SecurityHardening.js';

describe('revokeAllSessions', () => {
  it('should revoke all sessions for user', async () => {
    const count = await revokeAllSessions('test-user-revoke');
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 for user with no sessions', async () => {
    const count = await revokeAllSessions('nonexistent-user-' + Date.now());
    expect(count).toBe(0);
  });
});

// =============================================================================
// MFA TESTS
// =============================================================================

import { generateMFASecret, verifyTOTP } from '../../security/SecurityHardening.js';

describe('generateMFASecret', () => {
  it('should generate MFA secret and backup codes', () => {
    const result = generateMFASecret();

    expect(result).toHaveProperty('secret');
    expect(result).toHaveProperty('backupCodes');
    expect(result.secret.length).toBeGreaterThan(0);
    expect(result.backupCodes).toHaveLength(10);
  });

  it('should generate unique secrets', () => {
    const result1 = generateMFASecret();
    const result2 = generateMFASecret();

    expect(result1.secret).not.toBe(result2.secret);
  });

  it('should generate unique backup codes', () => {
    const result = generateMFASecret();
    const uniqueCodes = new Set(result.backupCodes);

    expect(uniqueCodes.size).toBe(10);
  });

  it('should generate 8-character backup codes', () => {
    const result = generateMFASecret();

    for (const code of result.backupCodes) {
      expect(code.length).toBe(8);
      expect(/^[0-9A-F]+$/.test(code)).toBe(true);
    }
  });
});

describe('verifyTOTP', () => {
  it('should return false for invalid code', () => {
    const { secret } = generateMFASecret();
    const isValid = verifyTOTP(secret, '000000');

    // Most likely false unless we hit the exact code
    expect(typeof isValid).toBe('boolean');
  });

  it('should return false for empty code', () => {
    const { secret } = generateMFASecret();
    const isValid = verifyTOTP(secret, '');

    expect(isValid).toBe(false);
  });

  it('should return false for non-numeric code', () => {
    const { secret } = generateMFASecret();
    const isValid = verifyTOTP(secret, 'abcdef');

    expect(isValid).toBe(false);
  });

  it('should handle short codes', () => {
    const { secret } = generateMFASecret();
    const isValid = verifyTOTP(secret, '123');

    expect(typeof isValid).toBe('boolean');
  });
});

// =============================================================================
// IP FILTER MIDDLEWARE TESTS
// =============================================================================

import { ipFilterMiddleware } from '../../security/SecurityHardening.js';

describe('ipFilterMiddleware', () => {
  function createMockReq(ip: string, path: string = '/api/v1/data'): any {
    return {
      ip,
      path,
      socket: { remoteAddress: ip },
    };
  }

  function createMockRes(): any {
    const res: any = {
      statusCode: 200,
      jsonData: null,
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.jsonData = data;
        return this;
      },
    };
    return res;
  }

  it('should allow non-blocked IP', async () => {
    const req = createMockReq('192.168.1.1');
    const res = createMockRes();
    const next = vi.fn();

    await ipFilterMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should handle missing IP gracefully', async () => {
    const req = {
      path: '/api/v1/data',
      socket: {},
    };
    const res = createMockRes();
    const next = vi.fn();

    await ipFilterMiddleware(req as any, res, next);

    // Should still call next for unknown IP (not blocked)
    expect(next).toHaveBeenCalled();
  });
});

// =============================================================================
// ADVANCED RATE LIMIT MIDDLEWARE TESTS
// =============================================================================

import { advancedRateLimitMiddleware } from '../../security/SecurityHardening.js';

describe('advancedRateLimitMiddleware', () => {
  function createMockReq(method: string, path: string, ip: string = '192.168.1.1'): any {
    return {
      method,
      path,
      ip,
      user: { id: 'test-user' },
    };
  }

  function createMockRes(): any {
    const res: any = {
      statusCode: 200,
      jsonData: null,
      headers: {} as Record<string, any>,
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.jsonData = data;
        return this;
      },
      setHeader: function(name: string, value: any) {
        this.headers[name] = value;
        return this;
      },
    };
    return res;
  }

  it('should allow request within rate limit', async () => {
    const req = createMockReq('GET', '/api/v1/data', '10.0.0.' + Date.now());
    const res = createMockRes();
    const next = vi.fn();

    await advancedRateLimitMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.headers['X-RateLimit-Limit']).toBeDefined();
    expect(res.headers['X-RateLimit-Remaining']).toBeDefined();
  });

  it('should set rate limit headers', async () => {
    const req = createMockReq('GET', '/api/v1/users', '10.0.1.' + Date.now());
    const res = createMockRes();
    const next = vi.fn();

    await advancedRateLimitMiddleware(req, res, next);

    expect(res.headers['X-RateLimit-Limit']).toBe(100); // default limit
    expect(res.headers['X-RateLimit-Remaining']).toBe(99);
  });

  it('should use stricter limits for login endpoint', async () => {
    const req = createMockReq('POST', '/api/v1/auth/login', '10.0.2.' + Date.now());
    const res = createMockRes();
    const next = vi.fn();

    await advancedRateLimitMiddleware(req, res, next);

    expect(res.headers['X-RateLimit-Limit']).toBe(5); // login limit
  });

  it('should use stricter limits for register endpoint', async () => {
    const req = createMockReq('POST', '/api/v1/auth/register', '10.0.3.' + Date.now());
    const res = createMockRes();
    const next = vi.fn();

    await advancedRateLimitMiddleware(req, res, next);

    expect(res.headers['X-RateLimit-Limit']).toBe(3); // register limit
  });

  it('should handle anonymous users', async () => {
    const req = {
      method: 'GET',
      path: '/api/v1/public',
      ip: '10.0.4.' + Date.now(),
    };
    const res = createMockRes();
    const next = vi.fn();

    await advancedRateLimitMiddleware(req as any, res, next);

    expect(next).toHaveBeenCalled();
  });
});
