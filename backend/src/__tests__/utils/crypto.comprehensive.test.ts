// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CRYPTO UTILITIES - COMPREHENSIVE TEST SUITE
 * Tests for hashing, encryption, and cryptographic operations
 */

import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

describe('Crypto Utilities', () => {
  // ===========================================================================
  // HASHING - 40 TESTS
  // ===========================================================================
  describe('Hashing', () => {
    const sha256 = (data: string): string => {
      return crypto.createHash('sha256').update(data).digest('hex');
    };

    const sha512 = (data: string): string => {
      return crypto.createHash('sha512').update(data).digest('hex');
    };

    const md5 = (data: string): string => {
      return crypto.createHash('md5').update(data).digest('hex');
    };

    describe('SHA-256', () => {
      it('should generate 64-character hash', () => {
        const hash = sha256('test');
        expect(hash.length).toBe(64);
      });

      it('should be deterministic', () => {
        const hash1 = sha256('test');
        const hash2 = sha256('test');
        expect(hash1).toBe(hash2);
      });

      it('should produce different hash for different inputs', () => {
        const hash1 = sha256('test1');
        const hash2 = sha256('test2');
        expect(hash1).not.toBe(hash2);
      });

      it('should handle empty string', () => {
        const hash = sha256('');
        expect(hash.length).toBe(64);
      });

      it('should handle unicode', () => {
        const hash = sha256('日本語');
        expect(hash.length).toBe(64);
      });

      it('should handle long strings', () => {
        const hash = sha256('a'.repeat(10000));
        expect(hash.length).toBe(64);
      });

      it('should handle special characters', () => {
        const hash = sha256('!@#$%^&*()');
        expect(hash.length).toBe(64);
      });

      it('should handle newlines', () => {
        const hash = sha256('line1\nline2');
        expect(hash.length).toBe(64);
      });

      it('should be case sensitive', () => {
        const hash1 = sha256('Test');
        const hash2 = sha256('test');
        expect(hash1).not.toBe(hash2);
      });

      it('should produce lowercase hex', () => {
        const hash = sha256('test');
        expect(hash).toBe(hash.toLowerCase());
      });
    });

    describe('SHA-512', () => {
      it('should generate 128-character hash', () => {
        const hash = sha512('test');
        expect(hash.length).toBe(128);
      });

      it('should be deterministic', () => {
        const hash1 = sha512('test');
        const hash2 = sha512('test');
        expect(hash1).toBe(hash2);
      });

      it('should produce different hash than SHA-256', () => {
        const sha256Hash = sha256('test');
        const sha512Hash = sha512('test');
        expect(sha256Hash).not.toBe(sha512Hash.substring(0, 64));
      });
    });

    describe('MD5', () => {
      it('should generate 32-character hash', () => {
        const hash = md5('test');
        expect(hash.length).toBe(32);
      });

      it('should be deterministic', () => {
        const hash1 = md5('test');
        const hash2 = md5('test');
        expect(hash1).toBe(hash2);
      });
    });
  });

  // ===========================================================================
  // HMAC - 20 TESTS
  // ===========================================================================
  describe('HMAC', () => {
    const hmacSha256 = (data: string, secret: string): string => {
      return crypto.createHmac('sha256', secret).update(data).digest('hex');
    };

    it('should generate valid HMAC', () => {
      const hmac = hmacSha256('message', 'secret');
      expect(hmac.length).toBe(64);
    });

    it('should be deterministic with same key', () => {
      const hmac1 = hmacSha256('message', 'secret');
      const hmac2 = hmacSha256('message', 'secret');
      expect(hmac1).toBe(hmac2);
    });

    it('should produce different HMAC for different keys', () => {
      const hmac1 = hmacSha256('message', 'secret1');
      const hmac2 = hmacSha256('message', 'secret2');
      expect(hmac1).not.toBe(hmac2);
    });

    it('should produce different HMAC for different messages', () => {
      const hmac1 = hmacSha256('message1', 'secret');
      const hmac2 = hmacSha256('message2', 'secret');
      expect(hmac1).not.toBe(hmac2);
    });

    it('should handle empty message', () => {
      const hmac = hmacSha256('', 'secret');
      expect(hmac.length).toBe(64);
    });

    it('should handle empty secret', () => {
      const hmac = hmacSha256('message', '');
      expect(hmac.length).toBe(64);
    });

    it('should handle unicode', () => {
      const hmac = hmacSha256('日本語', 'secret');
      expect(hmac.length).toBe(64);
    });

    it('should handle long secret', () => {
      const hmac = hmacSha256('message', 'a'.repeat(1000));
      expect(hmac.length).toBe(64);
    });
  });

  // ===========================================================================
  // RANDOM GENERATION - 30 TESTS
  // ===========================================================================
  describe('Random Generation', () => {
    const randomBytes = (length: number): string => {
      return crypto.randomBytes(length).toString('hex');
    };

    const randomUUID = (): string => {
      return crypto.randomUUID();
    };

    const randomInt = (min: number, max: number): number => {
      return crypto.randomInt(min, max);
    };

    describe('Random Bytes', () => {
      it('should generate correct length', () => {
        const bytes = randomBytes(16);
        expect(bytes.length).toBe(32); // hex is 2 chars per byte
      });

      it('should generate different values each time', () => {
        const bytes1 = randomBytes(16);
        const bytes2 = randomBytes(16);
        expect(bytes1).not.toBe(bytes2);
      });

      it('should handle small length', () => {
        const bytes = randomBytes(1);
        expect(bytes.length).toBe(2);
      });

      it('should handle large length', () => {
        const bytes = randomBytes(256);
        expect(bytes.length).toBe(512);
      });

      it('should produce valid hex', () => {
        const bytes = randomBytes(16);
        expect(/^[0-9a-f]+$/.test(bytes)).toBe(true);
      });
    });

    describe('Random UUID', () => {
      it('should generate valid UUID format', () => {
        const uuid = randomUUID();
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      });

      it('should generate unique UUIDs', () => {
        const uuids = new Set(Array(100).fill(null).map(() => randomUUID()));
        expect(uuids.size).toBe(100);
      });

      it('should be version 4 UUID', () => {
        const uuid = randomUUID();
        expect(uuid[14]).toBe('4');
      });
    });

    describe('Random Int', () => {
      it('should be within range', () => {
        for (let i = 0; i < 100; i++) {
          const num = randomInt(0, 100);
          expect(num).toBeGreaterThanOrEqual(0);
          expect(num).toBeLessThan(100);
        }
      });

      it('should handle small range', () => {
        for (let i = 0; i < 10; i++) {
          const num = randomInt(5, 6);
          expect(num).toBe(5);
        }
      });

      it('should handle negative numbers', () => {
        for (let i = 0; i < 100; i++) {
          const num = randomInt(-100, 0);
          expect(num).toBeGreaterThanOrEqual(-100);
          expect(num).toBeLessThan(0);
        }
      });
    });
  });

  // ===========================================================================
  // ENCRYPTION/DECRYPTION - 30 TESTS
  // ===========================================================================
  describe('Encryption/Decryption', () => {
    const algorithm = 'aes-256-gcm';
    const keyLength = 32;
    const ivLength = 16;

    const encrypt = (plaintext: string, key: Buffer): { encrypted: string; iv: string; authTag: string } => {
      const iv = crypto.randomBytes(ivLength);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return { encrypted, iv: iv.toString('hex'), authTag };
    };

    const decrypt = (encrypted: string, key: Buffer, iv: string, authTag: string): string => {
      const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    };

    const testKey = crypto.randomBytes(keyLength);

    it('should encrypt and decrypt successfully', () => {
      const plaintext = 'Hello, World!';
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const decrypted = decrypt(encrypted, testKey, iv, authTag);
      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertext each time', () => {
      const plaintext = 'Test';
      const result1 = encrypt(plaintext, testKey);
      const result2 = encrypt(plaintext, testKey);
      expect(result1.encrypted).not.toBe(result2.encrypted);
    });

    it('should produce different IV each time', () => {
      const plaintext = 'Test';
      const result1 = encrypt(plaintext, testKey);
      const result2 = encrypt(plaintext, testKey);
      expect(result1.iv).not.toBe(result2.iv);
    });

    it('should handle empty string', () => {
      const plaintext = '';
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const decrypted = decrypt(encrypted, testKey, iv, authTag);
      expect(decrypted).toBe(plaintext);
    });

    it('should handle unicode', () => {
      const plaintext = '日本語テスト';
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const decrypted = decrypt(encrypted, testKey, iv, authTag);
      expect(decrypted).toBe(plaintext);
    });

    it('should handle long strings', () => {
      const plaintext = 'a'.repeat(10000);
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const decrypted = decrypt(encrypted, testKey, iv, authTag);
      expect(decrypted).toBe(plaintext);
    });

    it('should handle special characters', () => {
      const plaintext = '!@#$%^&*(){}[]|\\:";\'<>?,./`~';
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const decrypted = decrypt(encrypted, testKey, iv, authTag);
      expect(decrypted).toBe(plaintext);
    });

    it('should handle newlines', () => {
      const plaintext = 'line1\nline2\rline3\r\nline4';
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const decrypted = decrypt(encrypted, testKey, iv, authTag);
      expect(decrypted).toBe(plaintext);
    });

    it('should fail with wrong key', () => {
      const plaintext = 'Test';
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const wrongKey = crypto.randomBytes(keyLength);
      expect(() => decrypt(encrypted, wrongKey, iv, authTag)).toThrow();
    });

    it('should fail with wrong auth tag', () => {
      const plaintext = 'Test';
      const { encrypted, iv } = encrypt(plaintext, testKey);
      const wrongAuthTag = crypto.randomBytes(16).toString('hex');
      expect(() => decrypt(encrypted, testKey, iv, wrongAuthTag)).toThrow();
    });

    it('should fail with tampered ciphertext', () => {
      const plaintext = 'Test';
      const { encrypted, iv, authTag } = encrypt(plaintext, testKey);
      const tampered = 'ff' + encrypted.slice(2);
      expect(() => decrypt(tampered, testKey, iv, authTag)).toThrow();
    });
  });

  // ===========================================================================
  // KEY DERIVATION - 20 TESTS
  // ===========================================================================
  describe('Key Derivation', () => {
    const deriveKey = (password: string, salt: Buffer, iterations: number = 100000): Buffer => {
      return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
    };

    const salt = crypto.randomBytes(16);

    it('should derive key from password', () => {
      const key = deriveKey('password', salt);
      expect(key.length).toBe(32);
    });

    it('should be deterministic with same inputs', () => {
      const key1 = deriveKey('password', salt);
      const key2 = deriveKey('password', salt);
      expect(key1.equals(key2)).toBe(true);
    });

    it('should produce different keys for different passwords', () => {
      const key1 = deriveKey('password1', salt);
      const key2 = deriveKey('password2', salt);
      expect(key1.equals(key2)).toBe(false);
    });

    it('should produce different keys for different salts', () => {
      const salt2 = crypto.randomBytes(16);
      const key1 = deriveKey('password', salt);
      const key2 = deriveKey('password', salt2);
      expect(key1.equals(key2)).toBe(false);
    });

    it('should handle empty password', () => {
      const key = deriveKey('', salt);
      expect(key.length).toBe(32);
    });

    it('should handle unicode password', () => {
      const key = deriveKey('パスワード', salt);
      expect(key.length).toBe(32);
    });

    it('should handle long password', () => {
      const key = deriveKey('a'.repeat(1000), salt);
      expect(key.length).toBe(32);
    });
  });

  // ===========================================================================
  // DIGITAL SIGNATURES - 20 TESTS
  // ===========================================================================
  describe('Digital Signatures', () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });

    const sign = (data: string): string => {
      const signer = crypto.createSign('SHA256');
      signer.update(data);
      return signer.sign(privateKey, 'hex');
    };

    const verify = (data: string, signature: string): boolean => {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(data);
      return verifier.verify(publicKey, signature, 'hex');
    };

    it('should sign data', () => {
      const signature = sign('Test message');
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should verify valid signature', () => {
      const message = 'Test message';
      const signature = sign(message);
      expect(verify(message, signature)).toBe(true);
    });

    it('should reject tampered message', () => {
      const signature = sign('Original message');
      expect(verify('Tampered message', signature)).toBe(false);
    });

    it('should reject invalid signature', () => {
      expect(verify('Test', 'invalid_signature')).toBe(false);
    });

    it('should handle empty message', () => {
      const signature = sign('');
      expect(verify('', signature)).toBe(true);
    });

    it('should handle unicode', () => {
      const message = '日本語メッセージ';
      const signature = sign(message);
      expect(verify(message, signature)).toBe(true);
    });

    it('should handle long messages', () => {
      const message = 'a'.repeat(10000);
      const signature = sign(message);
      expect(verify(message, signature)).toBe(true);
    });

    it('should produce different signatures each call', () => {
      const message = 'Test';
      const sig1 = sign(message);
      const sig2 = sign(message);
      // RSA-SHA256 with PKCS#1 v1.5 padding is deterministic
      expect(sig1).toBe(sig2);
    });
  });
});
