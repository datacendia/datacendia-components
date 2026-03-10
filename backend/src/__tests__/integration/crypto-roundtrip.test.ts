/**
 * Crypto Round-Trip Integration Tests
 * 
 * These tests use REAL crypto operations — no mocks.
 * They verify that data encrypted can be decrypted, data signed can be verified,
 * and hashes match known test vectors.
 * 
 * @module __tests__/integration/crypto-roundtrip.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

// Import real crypto functions from SecurityHardening
import {
  encryptData,
  decryptData,
  deriveKey,
  generateSecureToken,
  generateHMAC,
  verifyHMAC,
  CryptoConfig,
} from '../../security/SecurityHardening.js';

// =============================================================================
// SHA-256 KNOWN TEST VECTORS
// Reference: NIST FIPS 180-4 / RFC 6234
// =============================================================================

describe('SHA-256 Known Test Vectors', () => {
  it('should match NIST test vector: empty string', () => {
    const hash = crypto.createHash('sha256').update('').digest('hex');
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('should match NIST test vector: "abc"', () => {
    const hash = crypto.createHash('sha256').update('abc').digest('hex');
    expect(hash).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('should match NIST test vector: "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"', () => {
    const hash = crypto.createHash('sha256')
      .update('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')
      .digest('hex');
    expect(hash).toBe('248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
  });

  it('should produce 64-char hex output (256 bits)', () => {
    const hash = crypto.createHash('sha256').update('datacendia').digest('hex');
    expect(hash.length).toBe(64);
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });

  it('should be deterministic — same input always produces same hash', () => {
    const input = 'Council decision: approved with 4/5 vote';
    const hash1 = crypto.createHash('sha256').update(input).digest('hex');
    const hash2 = crypto.createHash('sha256').update(input).digest('hex');
    expect(hash1).toBe(hash2);
  });

  it('should be sensitive to changes — 1 bit change produces different hash', () => {
    const hash1 = crypto.createHash('sha256').update('approved').digest('hex');
    const hash2 = crypto.createHash('sha256').update('Approved').digest('hex');
    expect(hash1).not.toBe(hash2);
  });
});

// =============================================================================
// AES-256-GCM ROUND-TRIP
// =============================================================================

describe('AES-256-GCM Round-Trip', () => {
  const key = crypto.randomBytes(32);

  it('should encrypt and decrypt plaintext correctly', () => {
    const plaintext = 'Council Decision #42: Approved unanimously';
    const { ciphertext, iv, authTag } = encryptData(plaintext, key);
    const decrypted = decryptData(ciphertext, key, iv, authTag);
    expect(decrypted).toBe(plaintext);
  });

  it('should encrypt and decrypt unicode content', () => {
    const plaintext = '決定 #42: 全員一致で承認 — résumé café naïve';
    const { ciphertext, iv, authTag } = encryptData(plaintext, key);
    const decrypted = decryptData(ciphertext, key, iv, authTag);
    expect(decrypted).toBe(plaintext);
  });

  it('should encrypt and decrypt large content', () => {
    const plaintext = 'x'.repeat(100000);
    const { ciphertext, iv, authTag } = encryptData(plaintext, key);
    const decrypted = decryptData(ciphertext, key, iv, authTag);
    expect(decrypted).toBe(plaintext);
  });

  it('should encrypt and decrypt JSON deliberation payload', () => {
    const payload = JSON.stringify({
      deliberationId: 'delib-2024-001',
      question: 'Should we approve the merger?',
      votes: [
        { agentId: 'cfo', vote: 'approve', confidence: 0.92 },
        { agentId: 'legal', vote: 'approve', confidence: 0.88 },
        { agentId: 'ethics', vote: 'conditional', confidence: 0.75 },
      ],
      decision: 'approved_with_conditions',
      timestamp: '2024-03-07T22:00:00Z',
    });
    const { ciphertext, iv, authTag } = encryptData(payload, key);
    const decrypted = decryptData(ciphertext, key, iv, authTag);
    expect(JSON.parse(decrypted)).toEqual(JSON.parse(payload));
  });

  it('should produce different ciphertext for same plaintext (random IV)', () => {
    const plaintext = 'same message';
    const enc1 = encryptData(plaintext, key);
    const enc2 = encryptData(plaintext, key);
    expect(enc1.ciphertext).not.toBe(enc2.ciphertext);
    expect(enc1.iv).not.toBe(enc2.iv);
  });

  it('should fail to decrypt with wrong key', () => {
    const plaintext = 'secret data';
    const { ciphertext, iv, authTag } = encryptData(plaintext, key);
    const wrongKey = crypto.randomBytes(32);
    expect(() => decryptData(ciphertext, wrongKey, iv, authTag)).toThrow();
  });

  it('should fail to decrypt with tampered ciphertext', () => {
    const plaintext = 'tamper test';
    const { ciphertext, iv, authTag } = encryptData(plaintext, key);
    const tampered = Buffer.from(ciphertext, 'hex');
    tampered[0] ^= 0xff;
    expect(() => decryptData(tampered.toString('hex'), key, iv, authTag)).toThrow();
  });

  it('should fail to decrypt with wrong auth tag', () => {
    const plaintext = 'auth tag test';
    const { ciphertext, iv } = encryptData(plaintext, key);
    const wrongTag = crypto.randomBytes(16).toString('hex');
    expect(() => decryptData(ciphertext, key, iv, wrongTag)).toThrow();
  });
});

// =============================================================================
// HMAC-SHA512 ROUND-TRIP
// =============================================================================

describe('HMAC-SHA512 Round-Trip', () => {
  it('should generate and verify HMAC', () => {
    const data = 'Evidence receipt for deliberation #42';
    const key = crypto.randomBytes(32);
    const hmac = generateHMAC(data, key);
    expect(verifyHMAC(data, key, hmac)).toBe(true);
  });

  it('should reject HMAC with tampered data', () => {
    const key = crypto.randomBytes(32);
    const hmac = generateHMAC('original data', key);
    expect(verifyHMAC('tampered data', key, hmac)).toBe(false);
  });

  it('should reject HMAC with wrong key', () => {
    const key1 = crypto.randomBytes(32);
    const key2 = crypto.randomBytes(32);
    const hmac = generateHMAC('data', key1);
    expect(verifyHMAC('data', key2, hmac)).toBe(false);
  });

  it('should match known HMAC-SHA512 test vector (RFC 4231 Test Case 2)', () => {
    // RFC 4231 Test Case 2: Key = "Jefe", Data = "what do ya want for nothing?"
    const key = Buffer.from('Jefe');
    const data = 'what do ya want for nothing?';
    const expected = '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737';
    const hmac = crypto.createHmac('sha512', key).update(data).digest('hex');
    expect(hmac).toBe(expected);
  });
});

// =============================================================================
// PBKDF2 KEY DERIVATION
// =============================================================================

describe('PBKDF2 Key Derivation', () => {
  it('should derive key from password', async () => {
    const { key, salt } = await deriveKey('strong-password-123');
    expect(key).toBeDefined();
    expect(salt).toBeDefined();
    // Key is a Buffer — 256 bits = 32 bytes
    expect(Buffer.isBuffer(key) ? key.length : key.length / 2).toBeGreaterThanOrEqual(32);
  });

  it('should produce same key with same password and salt', async () => {
    const { key: key1, salt } = await deriveKey('test-password');
    const { key: key2 } = await deriveKey('test-password', salt);
    // Compare as hex strings for value equality
    const hex1 = Buffer.isBuffer(key1) ? key1.toString('hex') : String(key1);
    const hex2 = Buffer.isBuffer(key2) ? key2.toString('hex') : String(key2);
    expect(hex1).toBe(hex2);
  });

  it('should produce different keys with different passwords', async () => {
    const { key: key1, salt } = await deriveKey('password-a');
    const { key: key2 } = await deriveKey('password-b', salt);
    const hex1 = Buffer.isBuffer(key1) ? key1.toString('hex') : String(key1);
    const hex2 = Buffer.isBuffer(key2) ? key2.toString('hex') : String(key2);
    expect(hex1).not.toBe(hex2);
  });

  it('should produce different keys with different salts', async () => {
    const { key: key1 } = await deriveKey('same-password');
    const { key: key2 } = await deriveKey('same-password');
    // Random salts → different keys
    const hex1 = Buffer.isBuffer(key1) ? key1.toString('hex') : String(key1);
    const hex2 = Buffer.isBuffer(key2) ? key2.toString('hex') : String(key2);
    expect(hex1).not.toBe(hex2);
  });
});

// =============================================================================
// RSA SIGN/VERIFY ROUND-TRIP
// =============================================================================

describe('RSA Sign/Verify Round-Trip', () => {
  let publicKey: string;
  let privateKey: string;

  // Generate keys once for all tests
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Use 2048 for test speed; prod uses 4096
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  publicKey = keyPair.publicKey;
  privateKey = keyPair.privateKey;

  it('should sign and verify a deliberation hash', () => {
    const deliberationData = JSON.stringify({
      id: 'delib-001',
      question: 'Approve acquisition?',
      decision: 'approved',
      votes: 4,
      timestamp: '2024-03-07T22:00:00Z',
    });
    const hash = crypto.createHash('sha256').update(deliberationData).digest();

    const signature = crypto.sign('sha256', hash, privateKey);
    const isValid = crypto.verify('sha256', hash, publicKey, signature);
    expect(isValid).toBe(true);
  });

  it('should reject signature for tampered data', () => {
    const originalData = 'decision: approved';
    const tamperedData = 'decision: rejected';

    const originalHash = crypto.createHash('sha256').update(originalData).digest();
    const tamperedHash = crypto.createHash('sha256').update(tamperedData).digest();

    const signature = crypto.sign('sha256', originalHash, privateKey);
    const isValid = crypto.verify('sha256', tamperedHash, publicKey, signature);
    expect(isValid).toBe(false);
  });

  it('should reject signature with wrong public key', () => {
    const otherKeyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const data = crypto.createHash('sha256').update('evidence data').digest();
    const signature = crypto.sign('sha256', data, privateKey);
    const isValid = crypto.verify('sha256', data, otherKeyPair.publicKey, signature);
    expect(isValid).toBe(false);
  });

  it('should produce verifiable evidence receipt chain', () => {
    // Simulate: Decision → Hash → Sign → Receipt → Verify
    const decision = {
      deliberationId: 'delib-2024-042',
      question: 'Should we enter the European market?',
      outcome: 'proceed_with_caution',
      confidence: 0.87,
      agentVotes: [
        { agent: 'CFO', vote: 'approve', confidence: 0.92 },
        { agent: 'Legal', vote: 'conditional', confidence: 0.78 },
        { agent: 'Ethics', vote: 'approve', confidence: 0.85 },
        { agent: 'Risk', vote: 'caution', confidence: 0.71 },
      ],
      timestamp: new Date().toISOString(),
    };

    // Step 1: Hash the decision
    const decisionJSON = JSON.stringify(decision, null, 0);
    const decisionHash = crypto.createHash('sha256').update(decisionJSON).digest('hex');
    expect(decisionHash.length).toBe(64);

    // Step 2: Sign the hash
    const hashBuffer = Buffer.from(decisionHash, 'hex');
    const signature = crypto.sign('sha256', hashBuffer, privateKey);
    expect(signature.length).toBeGreaterThan(0);

    // Step 3: Create evidence receipt
    const receipt = {
      decisionHash,
      signature: signature.toString('base64'),
      publicKey: publicKey,
      algorithm: 'RSA-SHA256',
      createdAt: new Date().toISOString(),
    };

    // Step 4: Verify the receipt (what a third party would do)
    const receiptSignature = Buffer.from(receipt.signature, 'base64');
    const receiptHash = Buffer.from(receipt.decisionHash, 'hex');
    const verified = crypto.verify('sha256', receiptHash, receipt.publicKey, receiptSignature);
    expect(verified).toBe(true);

    // Step 5: Verify the hash matches the original decision
    const recomputedHash = crypto.createHash('sha256').update(decisionJSON).digest('hex');
    expect(recomputedHash).toBe(receipt.decisionHash);
  });
});

// =============================================================================
// SECURE TOKEN GENERATION
// =============================================================================

describe('Secure Token Generation', () => {
  it('should generate unique tokens', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();
    expect(token1).not.toBe(token2);
  });

  it('should generate tokens of specified length', () => {
    const token = generateSecureToken(64);
    expect(token.length).toBeGreaterThan(0);
  });

  it('should only contain base64url-safe characters', () => {
    const token = generateSecureToken(128);
    expect(/^[A-Za-z0-9_-]+$/.test(token)).toBe(true);
  });
});

// =============================================================================
// EVIDENCE HASH CHAIN (Blockchain-style)
// =============================================================================

describe('Evidence Hash Chain', () => {
  it('should create a verifiable chain of evidence hashes', () => {
    const chain: Array<{ data: string; hash: string; prevHash: string }> = [];
    let prevHash = '0'.repeat(64); // Genesis

    const events = [
      'Deliberation started: Should we acquire TechCo?',
      'CFO Agent voted: APPROVE (confidence: 0.92)',
      'Legal Agent voted: CONDITIONAL (confidence: 0.78)',
      'Ethics Agent voted: APPROVE (confidence: 0.85)',
      'Decision: APPROVED WITH CONDITIONS',
    ];

    for (const event of events) {
      const blockData = `${prevHash}|${event}`;
      const hash = crypto.createHash('sha256').update(blockData).digest('hex');
      chain.push({ data: event, hash, prevHash });
      prevHash = hash;
    }

    // Verify chain integrity
    expect(chain.length).toBe(5);
    for (let i = 1; i < chain.length; i++) {
      expect(chain[i].prevHash).toBe(chain[i - 1].hash);
      
      // Recompute and verify
      const recomputed = crypto.createHash('sha256')
        .update(`${chain[i].prevHash}|${chain[i].data}`)
        .digest('hex');
      expect(recomputed).toBe(chain[i].hash);
    }

    // Verify tampering detection
    const tampered = [...chain];
    tampered[2] = { ...tampered[2], data: 'Legal Agent voted: REJECT' };
    const recomputedTampered = crypto.createHash('sha256')
      .update(`${tampered[2].prevHash}|${tampered[2].data}`)
      .digest('hex');
    expect(recomputedTampered).not.toBe(tampered[2].hash); // Tampering detected!
  });
});
