/**
 * Cryptographic Utilities Tests
 * Hash, signature, and encryption utilities
 */

import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

// Utility functions to test
const cryptoUtils = {
  sha256(data: string | Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  },

  sha512(data: string | Buffer): string {
    return crypto.createHash('sha512').update(data).digest('hex');
  },

  hmac(data: string, key: string, algorithm: 'sha256' | 'sha512' = 'sha256'): string {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
  },

  randomBytes(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  },

  generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  },

  sign(data: string, privateKey: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'base64');
  },

  verify(data: string, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'base64');
  },

  encrypt(data: string, key: Buffer, iv: Buffer): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  },

  decrypt(encrypted: string, key: Buffer, iv: Buffer): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },

  deriveKey(password: string, salt: Buffer, iterations: number = 100000): Buffer {
    return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
  },

  generateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '';
    if (hashes.length === 1) return hashes[0] ?? '';

    const newLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i] ?? '';
      const right = hashes[i + 1] ?? left;
      newLevel.push(this.sha256(left + right));
    }
    return this.generateMerkleRoot(newLevel);
  },

  constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  },
};

describe('Cryptographic Utilities', () => {
  describe('Hashing', () => {
    it('should generate consistent SHA-256 hash', () => {
      const data = 'Hello, World!';
      const hash1 = cryptoUtils.sha256(data);
      const hash2 = cryptoUtils.sha256(data);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // 256 bits = 64 hex chars
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = cryptoUtils.sha256('input1');
      const hash2 = cryptoUtils.sha256('input2');

      expect(hash1).not.toBe(hash2);
    });

    it('should hash Buffer input', () => {
      const buffer = Buffer.from('test data');
      const hash = cryptoUtils.sha256(buffer);

      expect(hash).toHaveLength(64);
    });

    it('should generate SHA-512 hash', () => {
      const hash = cryptoUtils.sha512('test');

      expect(hash).toHaveLength(128); // 512 bits = 128 hex chars
    });
  });

  describe('HMAC', () => {
    it('should generate HMAC-SHA256', () => {
      const hmac = cryptoUtils.hmac('message', 'secret-key');

      expect(hmac).toHaveLength(64);
    });

    it('should generate different HMAC with different keys', () => {
      const hmac1 = cryptoUtils.hmac('message', 'key1');
      const hmac2 = cryptoUtils.hmac('message', 'key2');

      expect(hmac1).not.toBe(hmac2);
    });

    it('should generate HMAC-SHA512', () => {
      const hmac = cryptoUtils.hmac('message', 'key', 'sha512');

      expect(hmac).toHaveLength(128);
    });

    it('should be consistent for same inputs', () => {
      const hmac1 = cryptoUtils.hmac('data', 'key');
      const hmac2 = cryptoUtils.hmac('data', 'key');

      expect(hmac1).toBe(hmac2);
    });
  });

  describe('Random Generation', () => {
    it('should generate random bytes', () => {
      const random = cryptoUtils.randomBytes(16);

      expect(random).toHaveLength(32); // 16 bytes = 32 hex chars
    });

    it('should generate unique values', () => {
      const random1 = cryptoUtils.randomBytes(16);
      const random2 = cryptoUtils.randomBytes(16);

      expect(random1).not.toBe(random2);
    });

    it('should generate correct length', () => {
      const lengths = [8, 16, 32, 64];

      for (const len of lengths) {
        const random = cryptoUtils.randomBytes(len);
        expect(random).toHaveLength(len * 2);
      }
    });
  });

  describe('Asymmetric Cryptography', () => {
    it('should generate key pair', () => {
      const { publicKey, privateKey } = cryptoUtils.generateKeyPair();

      expect(publicKey).toContain('BEGIN PUBLIC KEY');
      expect(privateKey).toContain('BEGIN PRIVATE KEY');
    });

    it('should sign data with private key', () => {
      const { privateKey } = cryptoUtils.generateKeyPair();
      const signature = cryptoUtils.sign('test data', privateKey);

      expect(signature).toBeTruthy();
      expect(signature.length).toBeGreaterThan(0);
    });

    it('should verify valid signature', () => {
      const { publicKey, privateKey } = cryptoUtils.generateKeyPair();
      const data = 'important data';
      const signature = cryptoUtils.sign(data, privateKey);

      const isValid = cryptoUtils.verify(data, signature, publicKey);
      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const { publicKey, privateKey } = cryptoUtils.generateKeyPair();
      const signature = cryptoUtils.sign('original data', privateKey);

      const isValid = cryptoUtils.verify('tampered data', signature, publicKey);
      expect(isValid).toBe(false);
    });

    it('should reject signature from different key', () => {
      const keyPair1 = cryptoUtils.generateKeyPair();
      const keyPair2 = cryptoUtils.generateKeyPair();

      const data = 'test data';
      const signature = cryptoUtils.sign(data, keyPair1.privateKey);

      const isValid = cryptoUtils.verify(data, signature, keyPair2.publicKey);
      expect(isValid).toBe(false);
    });
  });

  describe('Symmetric Encryption', () => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    it('should encrypt and decrypt data', () => {
      const plaintext = 'secret message';
      const encrypted = cryptoUtils.encrypt(plaintext, key, iv);
      const decrypted = cryptoUtils.decrypt(encrypted, key, iv);

      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertext with different IVs', () => {
      const plaintext = 'same message';
      const iv1 = crypto.randomBytes(16);
      const iv2 = crypto.randomBytes(16);

      const encrypted1 = cryptoUtils.encrypt(plaintext, key, iv1);
      const encrypted2 = cryptoUtils.encrypt(plaintext, key, iv2);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle unicode text', () => {
      const plaintext = '日本語テスト 🎉';
      const encrypted = cryptoUtils.encrypt(plaintext, key, iv);
      const decrypted = cryptoUtils.decrypt(encrypted, key, iv);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle long text', () => {
      const plaintext = 'a'.repeat(10000);
      const encrypted = cryptoUtils.encrypt(plaintext, key, iv);
      const decrypted = cryptoUtils.decrypt(encrypted, key, iv);

      expect(decrypted).toBe(plaintext);
    });
  });

  describe('Key Derivation', () => {
    it('should derive key from password', () => {
      const password = 'my-secure-password';
      const salt = crypto.randomBytes(16);
      const key = cryptoUtils.deriveKey(password, salt);

      expect(key).toHaveLength(32);
    });

    it('should produce same key with same inputs', () => {
      const password = 'test-password';
      const salt = Buffer.from('fixed-salt-value');

      const key1 = cryptoUtils.deriveKey(password, salt);
      const key2 = cryptoUtils.deriveKey(password, salt);

      expect(key1.equals(key2)).toBe(true);
    });

    it('should produce different keys with different salts', () => {
      const password = 'same-password';
      const salt1 = crypto.randomBytes(16);
      const salt2 = crypto.randomBytes(16);

      const key1 = cryptoUtils.deriveKey(password, salt1);
      const key2 = cryptoUtils.deriveKey(password, salt2);

      expect(key1.equals(key2)).toBe(false);
    });

    it('should produce different keys with different passwords', () => {
      const salt = crypto.randomBytes(16);

      const key1 = cryptoUtils.deriveKey('password1', salt);
      const key2 = cryptoUtils.deriveKey('password2', salt);

      expect(key1.equals(key2)).toBe(false);
    });
  });

  describe('Merkle Tree', () => {
    it('should compute merkle root for single hash', () => {
      const hash = cryptoUtils.sha256('data');
      const root = cryptoUtils.generateMerkleRoot([hash]);

      expect(root).toBe(hash);
    });

    it('should compute merkle root for two hashes', () => {
      const hash1 = cryptoUtils.sha256('data1');
      const hash2 = cryptoUtils.sha256('data2');
      const root = cryptoUtils.generateMerkleRoot([hash1, hash2]);

      expect(root).toBe(cryptoUtils.sha256(hash1 + hash2));
    });

    it('should compute merkle root for multiple hashes', () => {
      const hashes = ['a', 'b', 'c', 'd'].map(d => cryptoUtils.sha256(d));
      const root = cryptoUtils.generateMerkleRoot(hashes);

      expect(root).toHaveLength(64);
    });

    it('should handle odd number of hashes', () => {
      const hashes = ['a', 'b', 'c'].map(d => cryptoUtils.sha256(d));
      const root = cryptoUtils.generateMerkleRoot(hashes);

      expect(root).toHaveLength(64);
    });

    it('should return empty string for empty array', () => {
      const root = cryptoUtils.generateMerkleRoot([]);

      expect(root).toBe('');
    });

    it('should produce consistent root for same inputs', () => {
      const hashes = ['x', 'y', 'z'].map(d => cryptoUtils.sha256(d));

      const root1 = cryptoUtils.generateMerkleRoot([...hashes]);
      const root2 = cryptoUtils.generateMerkleRoot([...hashes]);

      expect(root1).toBe(root2);
    });
  });

  describe('Timing-Safe Comparison', () => {
    it('should return true for equal strings', () => {
      const result = cryptoUtils.constantTimeCompare('secret', 'secret');
      expect(result).toBe(true);
    });

    it('should return false for different strings', () => {
      const result = cryptoUtils.constantTimeCompare('secret1', 'secret2');
      expect(result).toBe(false);
    });

    it('should return false for different length strings', () => {
      const result = cryptoUtils.constantTimeCompare('short', 'longer');
      expect(result).toBe(false);
    });

    it('should handle empty strings', () => {
      const result = cryptoUtils.constantTimeCompare('', '');
      expect(result).toBe(true);
    });
  });
});
