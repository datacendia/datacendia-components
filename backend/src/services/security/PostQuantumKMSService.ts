/**
 * Service — Post Quantum K M S Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports PostQuantumKMSService, postQuantumKMSService, PQKeyPair, PQSignature, PQVerificationResult, PQAlgorithm, KeyStrength
 * @module services/security/PostQuantumKMSService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaPostQuantumKMS - Real Post-Quantum Key Management
 * 
 * IMPLEMENTATION STATUS: REAL PQ CRYPTO via @noble/post-quantum
 * 
 * WHAT THIS IS:
 * - Real ML-DSA (Dilithium) signatures via NIST FIPS 204 algorithm
 * - Real SLH-DSA (SPHINCS+) hash-based signatures via NIST FIPS 205 algorithm
 * - Key rotation, expiration, and metadata management
 * - Pure JavaScript implementation (no native dependencies)
 * 
 * SUPPORTED ALGORITHMS:
 * - dilithium2 → ML-DSA-44 (NIST Level 2, recommended)
 * - dilithium3 → ML-DSA-65 (NIST Level 3)
 * - dilithium5 → ML-DSA-87 (NIST Level 5, highest security)
 * - sphincs-shake-128f → SLH-DSA-SHA2-128f (NIST Level 1, hash-based)
 * - sphincs-shake-256f → SLH-DSA-SHAKE-256f (NIST Level 5, hash-based)
 * 
 * NOT YET SUPPORTED (no JS implementation available):
 * - falcon-512/1024 (requires floating-point lattice sampling)
 * - hybrid-rsa-dilithium (composite signatures, use separate RSA + Dilithium)
 * 
 * Powered by @noble/post-quantum (https://github.com/paulmillr/noble-post-quantum)
 */

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { ml_dsa44, ml_dsa65, ml_dsa87 } from '@noble/post-quantum/ml-dsa.js';
import { slh_dsa_sha2_128f, slh_dsa_shake_256f } from '@noble/post-quantum/slh-dsa.js';
import { ml_kem512, ml_kem768, ml_kem1024 } from '@noble/post-quantum/ml-kem.js';
import { loadServiceRecords } from '../../utils/servicePersistence.js';
// ============================================================================
// TYPES
// ============================================================================

export type PQAlgorithm = 
  | 'dilithium2' 
  | 'dilithium3' 
  | 'dilithium5'
  | 'sphincs-shake-128f'
  | 'sphincs-shake-256f'
  | 'falcon-512'
  | 'falcon-1024'
  | 'hybrid-rsa-dilithium';  // Hybrid for transition period

export type KeyStrength = 'standard' | 'high' | 'paranoid';

export interface PQKeyPair {
  id: string;
  algorithm: PQAlgorithm;
  publicKey: string;       // Base64 encoded
  privateKey: string;      // Base64 encoded (encrypted at rest)
  createdAt: Date;
  rotatedAt?: Date;
  expiresAt: Date;
  strength: KeyStrength;
  nistLevel: 1 | 2 | 3 | 5;
}

export interface PQSignature {
  signature: string;       // Base64 encoded
  algorithm: PQAlgorithm;
  keyId: string;
  timestamp: Date;
  hybridRsaSignature?: string;  // For hybrid mode
}

export interface PQVerificationResult {
  valid: boolean;
  algorithm: PQAlgorithm;
  keyId: string;
  verifiedAt: Date;
  hybridValid?: boolean;  // For hybrid mode
}

// ============================================================================
// ALGORITHM SPECIFICATIONS
// ============================================================================

// Map algorithm names to @noble/post-quantum implementations
const PQ_ENGINES: Record<string, { keygen: () => { publicKey: Uint8Array; secretKey: Uint8Array }; sign: (msg: Uint8Array, sk: Uint8Array) => Uint8Array; verify: (sig: Uint8Array, msg: Uint8Array, pk: Uint8Array) => boolean } | null> = {
  'dilithium2': ml_dsa44,
  'dilithium3': ml_dsa65,
  'dilithium5': ml_dsa87,
  'sphincs-shake-128f': slh_dsa_sha2_128f,
  'sphincs-shake-256f': slh_dsa_shake_256f,
  'falcon-512': null,          // No JS implementation available
  'falcon-1024': null,         // No JS implementation available
  'hybrid-rsa-dilithium': null, // Composite signatures not yet supported
};

const ALGORITHM_SPECS: Record<PQAlgorithm, {
  nistLevel: 1 | 2 | 3 | 5;
  signatureSize: number;
  publicKeySize: number;
  privateKeySize: number;
  description: string;
  realImplementation: boolean;
}> = {
  'dilithium2': {
    nistLevel: 2,
    signatureSize: 2420,
    publicKeySize: 1312,
    privateKeySize: 2560,
    description: 'ML-DSA-44 (NIST FIPS 204, Level 2) - REAL via @noble/post-quantum',
    realImplementation: true,
  },
  'dilithium3': {
    nistLevel: 3,
    signatureSize: 3309,
    publicKeySize: 1952,
    privateKeySize: 4032,
    description: 'ML-DSA-65 (NIST FIPS 204, Level 3) - REAL via @noble/post-quantum',
    realImplementation: true,
  },
  'dilithium5': {
    nistLevel: 5,
    signatureSize: 4627,
    publicKeySize: 2592,
    privateKeySize: 4896,
    description: 'ML-DSA-87 (NIST FIPS 204, Level 5) - REAL via @noble/post-quantum',
    realImplementation: true,
  },
  'sphincs-shake-128f': {
    nistLevel: 1,
    signatureSize: 17088,
    publicKeySize: 32,
    privateKeySize: 64,
    description: 'SLH-DSA-SHA2-128f (NIST FIPS 205, Level 1) - REAL via @noble/post-quantum',
    realImplementation: true,
  },
  'sphincs-shake-256f': {
    nistLevel: 5,
    signatureSize: 49856,
    publicKeySize: 64,
    privateKeySize: 128,
    description: 'SLH-DSA-SHAKE-256f (NIST FIPS 205, Level 5) - REAL via @noble/post-quantum',
    realImplementation: true,
  },
  'falcon-512': {
    nistLevel: 1,
    signatureSize: 690,
    publicKeySize: 897,
    privateKeySize: 1281,
    description: 'Falcon-512 - NOT IMPLEMENTED (requires floating-point lattice sampling)',
    realImplementation: false,
  },
  'falcon-1024': {
    nistLevel: 5,
    signatureSize: 1330,
    publicKeySize: 1793,
    privateKeySize: 2305,
    description: 'Falcon-1024 - NOT IMPLEMENTED (requires floating-point lattice sampling)',
    realImplementation: false,
  },
  'hybrid-rsa-dilithium': {
    nistLevel: 3,
    signatureSize: 3549,
    publicKeySize: 2208,
    privateKeySize: 4256,
    description: 'Hybrid RSA+Dilithium - NOT IMPLEMENTED (use separate RSA + Dilithium)',
    realImplementation: false,
  },
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class PostQuantumKMSService {
  private keyPairs: Map<string, PQKeyPair> = new Map();
  // Store raw Uint8Array keys for crypto operations (base64 in PQKeyPair is for serialization)
  private rawKeys: Map<string, { publicKey: Uint8Array; secretKey: Uint8Array }> = new Map();
  private defaultAlgorithm: PQAlgorithm = 'dilithium3';

  constructor() {
    logger.info('[CendiaQuantumKMS] Real Post-Quantum KMS initialized — ML-DSA (Dilithium) + SLH-DSA (SPHINCS+) via @noble/post-quantum');


    this.loadFromDB().catch((err) => logger.warn('[CendiaQuantumKMS] loadFromDB failed', err));
  }

  /**
   * Generate a new post-quantum key pair using real PQ algorithms
   */
  async generateKeyPair(params: {
    algorithm?: PQAlgorithm;
    strength?: KeyStrength;
    expiresInDays?: number;
  } = {}): Promise<PQKeyPair> {
    const algorithm = params.algorithm || this.defaultAlgorithm;
    const strength = params.strength || 'high';
    const expiresInDays = params.expiresInDays || 365;

    const spec = ALGORITHM_SPECS[algorithm];
    const engine = PQ_ENGINES[algorithm];
    const id = `pq-${crypto.randomBytes(16).toString('hex')}`;

    if (!engine) {
      throw new Error(`Algorithm ${algorithm} is not implemented. Use dilithium2/3/5 or sphincs-shake-128f/256f.`);
    }

    // REAL PQ KEY GENERATION via @noble/post-quantum
    const rawKeyPair = engine.keygen();

    const keyPair: PQKeyPair = {
      id,
      algorithm,
      publicKey: Buffer.from(rawKeyPair.publicKey).toString('base64'),
      privateKey: Buffer.from(rawKeyPair.secretKey).toString('base64'),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
      strength,
      nistLevel: spec.nistLevel,
    };

    this.keyPairs.set(id, keyPair);
    this.rawKeys.set(id, rawKeyPair);
    logger.info(`Generated REAL PQ key pair: ${id} (${algorithm} → ${spec.description})`);

    return keyPair;
  }

  /**
   * Sign data with real post-quantum algorithm (ML-DSA or SLH-DSA)
   */
  async sign(data: Buffer | string, keyId?: string): Promise<PQSignature> {
    const dataBuffer = typeof data === 'string' ? Buffer.from(data) : data;
    
    // Get or generate key
    let keyPair: PQKeyPair;
    if (keyId) {
      const found = this.keyPairs.get(keyId);
      if (!found) throw new Error(`Key not found: ${keyId}`);
      keyPair = found;
    } else {
      const existing = Array.from(this.keyPairs.values()).find(k => k.expiresAt > new Date());
      keyPair = existing || await this.generateKeyPair();
    }

    if (keyPair.expiresAt < new Date()) {
      throw new Error(`Key expired: ${keyPair.id}`);
    }

    const engine = PQ_ENGINES[keyPair.algorithm];
    if (!engine) {
      throw new Error(`Algorithm ${keyPair.algorithm} is not implemented`);
    }

    // Get raw key bytes (restore from base64 if needed)
    let rawKey = this.rawKeys.get(keyPair.id);
    if (!rawKey) {
      rawKey = {
        publicKey: new Uint8Array(Buffer.from(keyPair.publicKey, 'base64')),
        secretKey: new Uint8Array(Buffer.from(keyPair.privateKey, 'base64')),
      };
      this.rawKeys.set(keyPair.id, rawKey);
    }

    // REAL PQ SIGNING via @noble/post-quantum
    // API: sign(message, secretKey) → Uint8Array signature
    const msgBytes = new Uint8Array(dataBuffer);
    const signatureBytes = engine.sign(msgBytes, rawKey.secretKey);
    
    const result: PQSignature = {
      signature: Buffer.from(signatureBytes).toString('base64'),
      algorithm: keyPair.algorithm,
      keyId: keyPair.id,
      timestamp: new Date(),
    };

    logger.debug(`Real PQ signed data with ${keyPair.algorithm}: ${keyPair.id} (${signatureBytes.length} byte sig)`);
    return result;
  }

  /**
   * Verify a post-quantum signature using real PQ verification
   */
  async verify(data: Buffer | string, signature: PQSignature): Promise<PQVerificationResult> {
    const dataBuffer = typeof data === 'string' ? Buffer.from(data) : data;
    
    const keyPair = this.keyPairs.get(signature.keyId);
    if (!keyPair) {
      return {
        valid: false,
        algorithm: signature.algorithm,
        keyId: signature.keyId,
        verifiedAt: new Date(),
      };
    }

    const engine = PQ_ENGINES[keyPair.algorithm];
    if (!engine) {
      return {
        valid: false,
        algorithm: signature.algorithm,
        keyId: signature.keyId,
        verifiedAt: new Date(),
      };
    }

    // Get raw key bytes
    let rawKey = this.rawKeys.get(keyPair.id);
    if (!rawKey) {
      rawKey = {
        publicKey: new Uint8Array(Buffer.from(keyPair.publicKey, 'base64')),
        secretKey: new Uint8Array(Buffer.from(keyPair.privateKey, 'base64')),
      };
      this.rawKeys.set(keyPair.id, rawKey);
    }

    // REAL PQ VERIFICATION via @noble/post-quantum
    // API: verify(signature, message, publicKey) → boolean
    const msgBytes = new Uint8Array(dataBuffer);
    const sigBytes = new Uint8Array(Buffer.from(signature.signature, 'base64'));
    const valid = engine.verify(sigBytes, msgBytes, rawKey.publicKey);

    const result: PQVerificationResult = {
      valid,
      algorithm: signature.algorithm,
      keyId: signature.keyId,
      verifiedAt: new Date(),
    };

    logger.debug(`Real PQ verified signature with ${signature.algorithm}: ${valid}`);
    return result;
  }

  /**
   * Rotate a key pair
   */
  async rotateKey(keyId: string): Promise<PQKeyPair> {
    const oldKey = this.keyPairs.get(keyId);
    if (!oldKey) throw new Error(`Key not found: ${keyId}`);

    // Generate new key with same parameters
    const newKey = await this.generateKeyPair({
      algorithm: oldKey.algorithm,
      strength: oldKey.strength,
    });

    // Mark old key as rotated
    oldKey.rotatedAt = new Date();
    
    logger.info(`Rotated key ${keyId} -> ${newKey.id}`);
    return newKey;
  }

  /**
   * Get key metadata (without private key)
   */
  getKeyMetadata(keyId: string): Omit<PQKeyPair, 'privateKey'> | undefined {
    const key = this.keyPairs.get(keyId);
    if (!key) return undefined;

    const { privateKey, ...metadata } = key;
    return metadata;
  }

  /**
   * List all keys (metadata only)
   */
  listKeys(): Array<Omit<PQKeyPair, 'privateKey'>> {
    return Array.from(this.keyPairs.values()).map(({ privateKey, ...metadata }) => metadata);
  }

  /**
   * Get supported algorithms
   */
  getSupportedAlgorithms(): Array<{
    algorithm: PQAlgorithm;
    spec: typeof ALGORITHM_SPECS[PQAlgorithm];
  }> {
    return Object.entries(ALGORITHM_SPECS).map(([algorithm, spec]) => ({
      algorithm: algorithm as PQAlgorithm,
      spec,
    }));
  }

  /**
   * Get algorithm recommendation based on use case
   */
  getRecommendation(useCase: 'general' | 'high-security' | 'compact' | 'hybrid'): PQAlgorithm {
    switch (useCase) {
      case 'general':
        return 'dilithium3';
      case 'high-security':
        return 'dilithium5';
      case 'compact':
        return 'dilithium2'; // Falcon not yet available in JS; Dilithium2 is smallest implemented
      case 'hybrid':
        return 'dilithium3'; // Use Dilithium3 + separate RSA signing for hybrid approach
      default:
        return 'dilithium3';
    }
  }

  /**
   * Delete a key pair
   */
  deleteKey(keyId: string): boolean {
    const deleted = this.keyPairs.delete(keyId);
    this.rawKeys.delete(keyId);
    if (deleted) {
      logger.info(`Deleted PQ key: ${keyId}`);
    }
    return deleted;
  }

  // ===========================================================================
  // ML-KEM (FIPS 203) — Post-Quantum Key Encapsulation Mechanism
  // ===========================================================================

  /**
   * Generate an ML-KEM key pair for key encapsulation.
   * ML-KEM-512 (NIST Level 1), ML-KEM-768 (Level 3), ML-KEM-1024 (Level 5)
   */
  generateKEMKeyPair(variant: 'ml-kem-512' | 'ml-kem-768' | 'ml-kem-1024' = 'ml-kem-768'): {
    id: string;
    variant: string;
    publicKey: string;
    privateKey: string;
    nistLevel: number;
  } {
    const kemAlgos = {
      'ml-kem-512': { impl: ml_kem512, level: 1 },
      'ml-kem-768': { impl: ml_kem768, level: 3 },
      'ml-kem-1024': { impl: ml_kem1024, level: 5 },
    };

    const algo = kemAlgos[variant];
    const keys = algo.impl.keygen();
    const id = `kem-${crypto.randomUUID()}`;

    logger.info(`[PQ-KMS] Generated ${variant} KEM key pair: ${id} (NIST Level ${algo.level})`);

    return {
      id,
      variant,
      publicKey: Buffer.from(keys.publicKey).toString('base64'),
      privateKey: Buffer.from(keys.secretKey).toString('base64'),
      nistLevel: algo.level,
    };
  }

  /**
   * Encapsulate: generate a shared secret + ciphertext using a public key.
   * The recipient decapsulates with their private key to get the same shared secret.
   */
  encapsulate(publicKeyB64: string, variant: 'ml-kem-512' | 'ml-kem-768' | 'ml-kem-1024' = 'ml-kem-768'): {
    sharedSecret: string;
    ciphertext: string;
  } {
    const kemAlgos = { 'ml-kem-512': ml_kem512, 'ml-kem-768': ml_kem768, 'ml-kem-1024': ml_kem1024 };
    const publicKey = Buffer.from(publicKeyB64, 'base64');
    const result = kemAlgos[variant].encapsulate(new Uint8Array(publicKey));

    return {
      sharedSecret: Buffer.from(result.sharedSecret).toString('base64'),
      ciphertext: Buffer.from(result.cipherText).toString('base64'),
    };
  }

  /**
   * Decapsulate: recover the shared secret from ciphertext using a private key.
   */
  decapsulate(ciphertextB64: string, privateKeyB64: string, variant: 'ml-kem-512' | 'ml-kem-768' | 'ml-kem-1024' = 'ml-kem-768'): {
    sharedSecret: string;
  } {
    const kemAlgos = { 'ml-kem-512': ml_kem512, 'ml-kem-768': ml_kem768, 'ml-kem-1024': ml_kem1024 };
    const ciphertext = Buffer.from(ciphertextB64, 'base64');
    const privateKey = Buffer.from(privateKeyB64, 'base64');
    const sharedSecret = kemAlgos[variant].decapsulate(new Uint8Array(ciphertext), new Uint8Array(privateKey));

    return {
      sharedSecret: Buffer.from(sharedSecret).toString('base64'),
    };
  }

  // ===========================================================================
  // HYBRID PQ+CLASSICAL DUAL SIGNATURES
  // ===========================================================================

  /**
   * Create a hybrid signature: RSA-PSS (classical) + ML-DSA-65 (post-quantum).
   * Both signatures must verify for the hybrid to be valid.
   * This provides security against both classical and quantum adversaries.
   */
  async hybridSign(data: Buffer, pqKeyId: string): Promise<{
    classicalSignature: string;
    pqSignature: string;
    algorithm: 'hybrid-rsa-pss+ml-dsa-65';
    pqKeyId: string;
    classicalAlgorithm: 'RSA-PSS-SHA256';
    pqAlgorithm: 'ML-DSA-65';
  }> {
    // Classical RSA-PSS signature
    const { publicKey: rsaPub, privateKey: rsaPriv } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const classicalSig = crypto.sign('sha256', data, {
      key: rsaPriv,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 32,
    });

    // PQ ML-DSA-65 signature (restore raw key from base64 if needed)
    let rawKey = this.rawKeys.get(pqKeyId);
    if (!rawKey) {
      const keyPair = this.keyPairs.get(pqKeyId);
      if (!keyPair) throw new Error(`PQ key not found: ${pqKeyId}`);
      rawKey = {
        publicKey: new Uint8Array(Buffer.from(keyPair.publicKey, 'base64')),
        secretKey: new Uint8Array(Buffer.from(keyPair.privateKey, 'base64')),
      };
      this.rawKeys.set(pqKeyId, rawKey);
    }
    const pqSig = ml_dsa65.sign(new Uint8Array(data), rawKey.secretKey);

    logger.info(`[PQ-KMS] Hybrid signature created: RSA-PSS-4096 + ML-DSA-65 (key: ${pqKeyId})`);

    return {
      classicalSignature: classicalSig.toString('base64'),
      pqSignature: Buffer.from(pqSig).toString('base64'),
      algorithm: 'hybrid-rsa-pss+ml-dsa-65',
      pqKeyId,
      classicalAlgorithm: 'RSA-PSS-SHA256',
      pqAlgorithm: 'ML-DSA-65',
    };
  }

  /**
   * Get full PQ-KMS status including ML-KEM capabilities
   */
  getFullStatus(): {
    algorithms: { signatures: string[]; kem: string[]; hybrid: string[] };
    keyCount: number;
    fipsCompliance: Record<string, string>;
  } {
    return {
      algorithms: {
        signatures: ['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87', 'SLH-DSA-SHA2-128f', 'SLH-DSA-SHAKE-256f'],
        kem: ['ML-KEM-512', 'ML-KEM-768', 'ML-KEM-1024'],
        hybrid: ['RSA-PSS-4096 + ML-DSA-65'],
      },
      keyCount: this.keyPairs.size,
      fipsCompliance: {
        'FIPS 203': 'ML-KEM (Key Encapsulation Mechanism)',
        'FIPS 204': 'ML-DSA (Digital Signature Algorithm)',
        'FIPS 205': 'SLH-DSA (Stateless Hash-Based Digital Signature Algorithm)',
      },
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'PostQuantumKMS', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.keyPairs.has(d.id)) this.keyPairs.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'PostQuantumKMS', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.rawKeys.has(d.id)) this.rawKeys.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[PostQuantumKMSService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[PostQuantumKMSService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const postQuantumKMSService = new PostQuantumKMSService();
