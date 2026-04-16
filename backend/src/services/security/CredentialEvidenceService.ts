/**
 * Service — Credential Evidence Service
 *
 * Captures immutable proof-at-creation records for every credential generated
 * by the platform. Solves the "proof problem" for SOC 2 CC6.1/CC6.7, HIPAA
 * §164.312(d), and NIST SP 800-63B audits.
 *
 * Each credential generation event produces a signed evidence record containing:
 * - Credential fingerprint (SHA-256 of the credential, NOT the credential itself)
 * - Entropy bits and entropy source (CSPRNG provenance)
 * - Policy snapshot frozen at creation time (algorithm, complexity, rotation, frameworks)
 * - Environment context (Node.js version, OpenSSL version, FIPS mode, hostname)
 * - Hash chain linking to previous evidence record (tamper detection)
 * - HMAC signature (non-repudiation)
 *
 * @exports CredentialEvidenceService, credentialEvidenceService
 * @module services/security/CredentialEvidenceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';
import os from 'os';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord, loadServiceRecords, countServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type CredentialType =
  | 'access_token'
  | 'refresh_token'
  | 'mfa_secret'
  | 'mfa_backup_codes'
  | 'api_key'
  | 'password_hash'
  | 'session_token'
  | 'email_verification_token'
  | 'password_reset_token'
  | 'hsm_key'
  | 'encryption_key'
  | 'signing_key'
  | 'webhook_secret'
  | 'client_secret'
  | 'service_account_key';

export interface CredentialPolicy {
  credentialType: CredentialType;
  algorithm: string;
  minEntropyBits: number;
  rotationDays: number;
  complexityRequirements: string[];
  complianceFrameworks: string[];
  retentionDays: number;
  mustExpire: boolean;
  maxLifetimeHours: number | null;
}

export interface CredentialEvidenceRecord {
  id: string;
  credentialType: CredentialType;
  credentialFingerprint: string;
  entropyBits: number;
  entropySource: string;
  generationMethod: string;
  policySnapshot: CredentialPolicy;
  environment: {
    nodeVersion: string;
    opensslVersion: string;
    fipsMode: boolean;
    hostname: string;
    platform: string;
    pid: number;
  };
  userId: string | null;
  purpose: string;
  expiresAt: string | null;
  previousEvidenceHash: string | null;
  recordHash: string;
  signature: string;
  createdAt: string;
}

export interface ChainVerificationResult {
  valid: boolean;
  totalRecords: number;
  verifiedRecords: number;
  brokenAt: number | null;
  details: string;
}

export interface CredentialEvidenceStats {
  totalRecords: number;
  byType: Record<string, number>;
  averageEntropyBits: number;
  chainIntegrity: 'intact' | 'broken' | 'empty';
  oldestRecord: string | null;
  newestRecord: string | null;
  complianceFrameworksCovered: string[];
}

// =============================================================================
// CREDENTIAL POLICIES — frozen per-type compliance requirements
// =============================================================================

const CREDENTIAL_POLICIES: CredentialPolicy[] = [
  {
    credentialType: 'access_token',
    algorithm: 'HMAC-SHA256 (JWT via jose)',
    minEntropyBits: 256,
    rotationDays: 0,
    complexityRequirements: ['JWT signed with HS256', 'Short-lived (1h default)'],
    complianceFrameworks: ['SOC2-CC6.1', 'SOC2-CC6.7', 'HIPAA-164.312(d)', 'NIST-IA-5(1)', 'ISO27001-A.9.4.2'],
    retentionDays: 90,
    mustExpire: true,
    maxLifetimeHours: 1,
  },
  {
    credentialType: 'refresh_token',
    algorithm: 'HMAC-SHA256 (JWT via jose)',
    minEntropyBits: 256,
    rotationDays: 30,
    complexityRequirements: ['JWT signed with HS256', 'Long-lived (30d default)', 'Stored as bcrypt hash'],
    complianceFrameworks: ['SOC2-CC6.1', 'SOC2-CC6.7', 'HIPAA-164.312(d)', 'NIST-IA-5(1)'],
    retentionDays: 90,
    mustExpire: true,
    maxLifetimeHours: 720,
  },
  {
    credentialType: 'mfa_secret',
    algorithm: 'TOTP (RFC 6238, HMAC-SHA1, 20-byte secret)',
    minEntropyBits: 160,
    rotationDays: 0,
    complexityRequirements: ['20 random bytes via crypto.randomBytes', 'Base32 encoded', 'AES-256-CBC encrypted at rest'],
    complianceFrameworks: ['SOC2-CC6.1', 'HIPAA-164.312(d)', 'NIST-IA-2(1)', 'NIST-IA-2(2)', 'ISO27001-A.9.4.2'],
    retentionDays: 0,
    mustExpire: false,
    maxLifetimeHours: null,
  },
  {
    credentialType: 'mfa_backup_codes',
    algorithm: 'crypto.randomBytes(4) per code, hex-encoded',
    minEntropyBits: 32,
    rotationDays: 0,
    complexityRequirements: ['10 codes × 4 random bytes each', 'AES-256-CBC encrypted at rest', 'Single-use, consumed on use'],
    complianceFrameworks: ['SOC2-CC6.1', 'HIPAA-164.312(d)', 'NIST-IA-5(1)'],
    retentionDays: 0,
    mustExpire: false,
    maxLifetimeHours: null,
  },
  {
    credentialType: 'api_key',
    algorithm: 'crypto.randomBytes(32), hex-encoded',
    minEntropyBits: 256,
    rotationDays: 90,
    complexityRequirements: ['256-bit random', 'Stored as SHA-256 hash', 'Prefix for identification'],
    complianceFrameworks: ['SOC2-CC6.1', 'SOC2-CC6.7', 'NIST-IA-5(1)', 'ISO27001-A.9.4.2'],
    retentionDays: 365,
    mustExpire: true,
    maxLifetimeHours: 2160,
  },
  {
    credentialType: 'password_hash',
    algorithm: 'bcrypt (cost factor 10)',
    minEntropyBits: 72,
    rotationDays: 90,
    complexityRequirements: ['Min 8 chars', 'bcrypt with salt', 'Cost factor 10'],
    complianceFrameworks: ['SOC2-CC6.1', 'HIPAA-164.312(d)', 'NIST-SP800-63B', 'ISO27001-A.9.4.3'],
    retentionDays: 0,
    mustExpire: false,
    maxLifetimeHours: null,
  },
  {
    credentialType: 'session_token',
    algorithm: 'crypto.randomUUID() + bcrypt hash',
    minEntropyBits: 122,
    rotationDays: 0,
    complexityRequirements: ['UUID v4 (122 bits entropy)', 'Stored as bcrypt hash in sessions table'],
    complianceFrameworks: ['SOC2-CC6.1', 'HIPAA-164.312(d)', 'NIST-IA-5(1)'],
    retentionDays: 30,
    mustExpire: true,
    maxLifetimeHours: 720,
  },
  {
    credentialType: 'email_verification_token',
    algorithm: 'crypto.randomBytes(32), hex-encoded',
    minEntropyBits: 256,
    rotationDays: 0,
    complexityRequirements: ['256-bit random', 'Single-use', '24h expiry'],
    complianceFrameworks: ['SOC2-CC6.1', 'NIST-IA-5(1)'],
    retentionDays: 7,
    mustExpire: true,
    maxLifetimeHours: 24,
  },
  {
    credentialType: 'password_reset_token',
    algorithm: 'crypto.randomBytes(32), hex-encoded',
    minEntropyBits: 256,
    rotationDays: 0,
    complexityRequirements: ['256-bit random', 'Single-use', '1h expiry'],
    complianceFrameworks: ['SOC2-CC6.1', 'HIPAA-164.312(d)', 'NIST-IA-5(1)'],
    retentionDays: 7,
    mustExpire: true,
    maxLifetimeHours: 1,
  },
  {
    credentialType: 'hsm_key',
    algorithm: 'RSA-2048/4096 | AES-256 | EC-P256/P384 (via HSMAdapter)',
    minEntropyBits: 256,
    rotationDays: 365,
    complexityRequirements: ['Hardware TRNG or crypto.generateKeyPairSync', 'Key material in HSM or software fallback', 'Non-extractable by default'],
    complianceFrameworks: ['SOC2-CC6.1', 'SOC2-CC6.7', 'HIPAA-164.312(a)(2)(iv)', 'NIST-SC-12', 'NIST-SC-13', 'FIPS-140-3', 'ISO27001-A.10.1.1'],
    retentionDays: 2555,
    mustExpire: false,
    maxLifetimeHours: null,
  },
  {
    credentialType: 'encryption_key',
    algorithm: 'AES-256-GCM (via KMS)',
    minEntropyBits: 256,
    rotationDays: 365,
    complexityRequirements: ['256-bit AES key', 'GCM mode with 96-bit IV', 'Key hierarchy: MEK → DEK'],
    complianceFrameworks: ['SOC2-CC6.1', 'HIPAA-164.312(a)(2)(iv)', 'NIST-SC-12', 'NIST-SC-13', 'ISO27001-A.10.1.1'],
    retentionDays: 2555,
    mustExpire: false,
    maxLifetimeHours: null,
  },
  {
    credentialType: 'signing_key',
    algorithm: 'EC-P256 ECDSA | RSA-PSS-SHA256',
    minEntropyBits: 256,
    rotationDays: 365,
    complexityRequirements: ['Asymmetric key pair', 'Private key protected in HSM/KMS'],
    complianceFrameworks: ['SOC2-CC6.1', 'SOC2-CC6.7', 'NIST-SC-12', 'NIST-SC-13', 'ISO27001-A.10.1.1'],
    retentionDays: 2555,
    mustExpire: false,
    maxLifetimeHours: null,
  },
  {
    credentialType: 'webhook_secret',
    algorithm: 'crypto.randomBytes(32), hex-encoded',
    minEntropyBits: 256,
    rotationDays: 180,
    complexityRequirements: ['256-bit random', 'Used for HMAC-SHA256 webhook signatures'],
    complianceFrameworks: ['SOC2-CC6.1', 'NIST-IA-5(1)'],
    retentionDays: 365,
    mustExpire: false,
    maxLifetimeHours: null,
  },
  {
    credentialType: 'client_secret',
    algorithm: 'crypto.randomBytes(32), base64url-encoded',
    minEntropyBits: 256,
    rotationDays: 90,
    complexityRequirements: ['256-bit random', 'OAuth2 client credentials', 'Stored as SHA-256 hash'],
    complianceFrameworks: ['SOC2-CC6.1', 'SOC2-CC6.7', 'NIST-IA-5(1)', 'ISO27001-A.9.4.2'],
    retentionDays: 365,
    mustExpire: true,
    maxLifetimeHours: 2160,
  },
  {
    credentialType: 'service_account_key',
    algorithm: 'EC-P256 key pair, PEM-encoded',
    minEntropyBits: 256,
    rotationDays: 90,
    complexityRequirements: ['Asymmetric key pair', 'Machine-to-machine auth', 'Private key never stored server-side'],
    complianceFrameworks: ['SOC2-CC6.1', 'SOC2-CC6.7', 'NIST-IA-5(2)', 'ISO27001-A.9.4.2'],
    retentionDays: 365,
    mustExpire: true,
    maxLifetimeHours: 2160,
  },
];

// =============================================================================
// SERVICE
// =============================================================================

export class CredentialEvidenceService {
  private signingKey: Buffer;
  private lastEvidenceHash: string | null = null;
  private inMemoryRecords: CredentialEvidenceRecord[] = [];
  private initialized = false;

  constructor() {
    const key = process.env.CREDENTIAL_EVIDENCE_KEY || process.env.JWT_SECRET || 'dev-credential-evidence-key-min32chars!';
    this.signingKey = crypto.createHash('sha256').update(key).digest();
  }

  /**
   * Load last evidence hash from DB to continue the chain.
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    try {
      const lastRecords = await loadServiceRecords({
        serviceName: 'CredentialEvidence',
        recordType: 'evidence',
        limit: 1,
        orderBy: 'desc',
      });
      if (lastRecords.length > 0) {
        const data = lastRecords[0].data as any;
        this.lastEvidenceHash = data?.recordHash || lastRecords[0].hash || null;
      }
    } catch {
      // First run — no chain yet
    }
    this.initialized = true;
  }

  /**
   * Record credential generation evidence.
   * This is the core method — called at the exact moment a credential is created.
   */
  async recordEvidence(params: {
    credentialType: CredentialType;
    credentialValue: string | Buffer;
    userId?: string | null;
    purpose: string;
    expiresAt?: Date | null;
    generationMethod?: string;
    entropyBitsOverride?: number;
  }): Promise<CredentialEvidenceRecord> {
    await this.ensureInitialized();

    const policy = this.getPolicy(params.credentialType);
    const credentialBuffer = typeof params.credentialValue === 'string'
      ? Buffer.from(params.credentialValue, 'utf-8')
      : params.credentialValue;

    // Fingerprint: SHA-256 of the credential — proves WHICH credential without storing it
    const credentialFingerprint = crypto.createHash('sha256').update(credentialBuffer).digest('hex');

    // Entropy measurement
    const entropyBits = params.entropyBitsOverride ?? this.measureEntropy(credentialBuffer);

    // Environment snapshot
    const environment = {
      nodeVersion: process.version,
      opensslVersion: this.getOpenSSLVersion(),
      fipsMode: this.checkFIPSMode(),
      hostname: os.hostname(),
      platform: `${os.platform()} ${os.arch()}`,
      pid: process.pid,
    };

    // Build evidence record
    const id = `ce-${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    const recordData = {
      id,
      credentialType: params.credentialType,
      credentialFingerprint,
      entropyBits,
      entropySource: this.getEntropySource(),
      generationMethod: params.generationMethod || policy.algorithm,
      policySnapshot: { ...policy },
      environment,
      userId: params.userId || null,
      purpose: params.purpose,
      expiresAt: params.expiresAt?.toISOString() || null,
      previousEvidenceHash: this.lastEvidenceHash,
      recordHash: '',
      signature: '',
      createdAt,
    };

    // Compute hash over all fields except recordHash and signature
    recordData.recordHash = this.computeRecordHash(recordData);

    // Sign the hash for non-repudiation
    recordData.signature = this.signRecord(recordData.recordHash);

    // Update chain pointer
    this.lastEvidenceHash = recordData.recordHash;

    // Store in memory for fast retrieval
    this.inMemoryRecords.push(recordData);

    // Persist to database (non-blocking)
    persistServiceRecord({
      serviceName: 'CredentialEvidence',
      recordType: 'evidence',
      referenceId: id,
      data: recordData,
    }).catch(err => logger.warn(`[CredentialEvidence] DB persist failed: ${(err as Error).message}`));

    logger.info(`[CredentialEvidence] Recorded: ${params.credentialType} | ${entropyBits} bits | fingerprint=${credentialFingerprint.substring(0, 12)}…`);

    return recordData;
  }

  /**
   * Get the compliance policy for a credential type.
   */
  getPolicy(credentialType: CredentialType): CredentialPolicy {
    const policy = CREDENTIAL_POLICIES.find(p => p.credentialType === credentialType);
    if (!policy) {
      return {
        credentialType,
        algorithm: 'unknown',
        minEntropyBits: 128,
        rotationDays: 90,
        complexityRequirements: ['No specific policy defined'],
        complianceFrameworks: ['SOC2-CC6.1'],
        retentionDays: 90,
        mustExpire: false,
        maxLifetimeHours: null,
      };
    }
    return { ...policy };
  }

  /**
   * Get all credential policies.
   */
  getPolicies(): CredentialPolicy[] {
    return CREDENTIAL_POLICIES.map(p => ({ ...p }));
  }

  /**
   * Retrieve evidence records with optional filters.
   */
  async getRecords(params?: {
    credentialType?: CredentialType;
    userId?: string;
    limit?: number;
  }): Promise<CredentialEvidenceRecord[]> {
    const limit = params?.limit || 100;

    // Load from DB
    const dbRecords = await loadServiceRecords({
      serviceName: 'CredentialEvidence',
      recordType: 'evidence',
      limit,
      orderBy: 'desc',
    });

    let records = dbRecords.map(r => r.data as CredentialEvidenceRecord);

    // Merge any in-memory records not yet persisted
    const dbIds = new Set(records.map(r => r.id));
    for (const mem of this.inMemoryRecords) {
      if (!dbIds.has(mem.id)) records.push(mem);
    }

    // Sort by createdAt desc
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply filters
    if (params?.credentialType) {
      records = records.filter(r => r.credentialType === params.credentialType);
    }
    if (params?.userId) {
      records = records.filter(r => r.userId === params.userId);
    }

    return records.slice(0, limit);
  }

  /**
   * Verify the integrity of the evidence chain.
   * Auditors use this to confirm no records have been tampered with or deleted.
   */
  async verifyChain(): Promise<ChainVerificationResult> {
    const allRecords = await loadServiceRecords({
      serviceName: 'CredentialEvidence',
      recordType: 'evidence',
      limit: 10000,
      orderBy: 'asc',
    });

    if (allRecords.length === 0) {
      return { valid: true, totalRecords: 0, verifiedRecords: 0, brokenAt: null, details: 'No evidence records exist yet' };
    }

    const records = allRecords.map(r => r.data as CredentialEvidenceRecord);
    let verified = 0;
    let previousHash: string | null = null;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      // 1. Verify record hash
      const computedHash = this.computeRecordHash(record);
      if (computedHash !== record.recordHash) {
        return {
          valid: false,
          totalRecords: records.length,
          verifiedRecords: verified,
          brokenAt: i,
          details: `Record ${record.id} (index ${i}): hash mismatch — record tampered`,
        };
      }

      // 2. Verify signature
      const expectedSig = this.signRecord(record.recordHash);
      if (expectedSig !== record.signature) {
        return {
          valid: false,
          totalRecords: records.length,
          verifiedRecords: verified,
          brokenAt: i,
          details: `Record ${record.id} (index ${i}): signature mismatch — signing key changed or record tampered`,
        };
      }

      // 3. Verify chain linkage (skip first record)
      if (i > 0 && record.previousEvidenceHash !== previousHash) {
        return {
          valid: false,
          totalRecords: records.length,
          verifiedRecords: verified,
          brokenAt: i,
          details: `Record ${record.id} (index ${i}): chain break — previousEvidenceHash does not match prior record`,
        };
      }

      previousHash = record.recordHash;
      verified++;
    }

    return {
      valid: true,
      totalRecords: records.length,
      verifiedRecords: verified,
      brokenAt: null,
      details: `All ${verified} records verified. Chain intact.`,
    };
  }

  /**
   * Get statistics for the credential evidence dashboard.
   */
  async getStats(): Promise<CredentialEvidenceStats> {
    const records = await this.getRecords({ limit: 10000 });

    if (records.length === 0) {
      return {
        totalRecords: 0,
        byType: {},
        averageEntropyBits: 0,
        chainIntegrity: 'empty',
        oldestRecord: null,
        newestRecord: null,
        complianceFrameworksCovered: [],
      };
    }

    const byType: Record<string, number> = {};
    let totalEntropy = 0;
    const frameworkSet = new Set<string>();

    for (const r of records) {
      byType[r.credentialType] = (byType[r.credentialType] || 0) + 1;
      totalEntropy += r.entropyBits;
      r.policySnapshot.complianceFrameworks.forEach(f => frameworkSet.add(f));
    }

    const chain = await this.verifyChain();

    return {
      totalRecords: records.length,
      byType,
      averageEntropyBits: Math.round(totalEntropy / records.length),
      chainIntegrity: chain.valid ? 'intact' : 'broken',
      oldestRecord: records[records.length - 1]?.createdAt || null,
      newestRecord: records[0]?.createdAt || null,
      complianceFrameworksCovered: Array.from(frameworkSet).sort(),
    };
  }

  /**
   * Export a complete audit package for auditors.
   */
  async exportAuditPackage(): Promise<{
    exportId: string;
    exportedAt: string;
    policies: CredentialPolicy[];
    records: CredentialEvidenceRecord[];
    chainVerification: ChainVerificationResult;
    stats: CredentialEvidenceStats;
    platformInfo: Record<string, string>;
  }> {
    const [records, chainVerification, stats] = await Promise.all([
      this.getRecords({ limit: 10000 }),
      this.verifyChain(),
      this.getStats(),
    ]);

    return {
      exportId: `cep-${crypto.randomUUID()}`,
      exportedAt: new Date().toISOString(),
      policies: this.getPolicies(),
      records,
      chainVerification,
      stats,
      platformInfo: {
        nodeVersion: process.version,
        opensslVersion: this.getOpenSSLVersion(),
        fipsMode: String(this.checkFIPSMode()),
        platform: `${os.platform()} ${os.arch()}`,
        hostname: os.hostname(),
      },
    };
  }

  // =============================================================================
  // PRIVATE HELPERS
  // =============================================================================

  /**
   * Measure Shannon entropy of a byte buffer.
   * Returns estimated bits of entropy.
   */
  private measureEntropy(data: Buffer): number {
    if (data.length === 0) return 0;

    // For cryptographically random data, entropy ≈ length × 8
    // We measure actual byte frequency distribution as a sanity check
    const freq = new Array(256).fill(0);
    for (const byte of data) freq[byte]++;

    let entropy = 0;
    const len = data.length;
    for (let i = 0; i < 256; i++) {
      if (freq[i] > 0) {
        const p = freq[i] / len;
        entropy -= p * Math.log2(p);
      }
    }

    // Shannon entropy per byte × number of bytes = total bits
    return Math.round(entropy * data.length);
  }

  /**
   * Get the entropy source description for the current platform.
   */
  private getEntropySource(): string {
    // Node.js crypto.randomBytes uses the OS CSPRNG:
    // - Linux: /dev/urandom (getrandom syscall)
    // - macOS: arc4random
    // - Windows: BCryptGenRandom (CNG)
    const platform = os.platform();
    switch (platform) {
      case 'linux': return 'Linux getrandom() / /dev/urandom (CSPRNG)';
      case 'darwin': return 'macOS arc4random (CSPRNG)';
      case 'win32': return 'Windows BCryptGenRandom (CNG CSPRNG)';
      default: return `${platform} crypto.randomBytes (CSPRNG)`;
    }
  }

  /**
   * Get OpenSSL version from Node.js process.
   */
  private getOpenSSLVersion(): string {
    try {
      return (process.versions as any).openssl || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Check if FIPS mode is enabled.
   */
  private checkFIPSMode(): boolean {
    try {
      return (crypto as any).getFips?.() === 1;
    } catch {
      return false;
    }
  }

  /**
   * Compute SHA-256 hash of a record (excluding recordHash and signature fields).
   */
  private computeRecordHash(record: CredentialEvidenceRecord): string {
    const hashInput = JSON.stringify({
      id: record.id,
      credentialType: record.credentialType,
      credentialFingerprint: record.credentialFingerprint,
      entropyBits: record.entropyBits,
      entropySource: record.entropySource,
      generationMethod: record.generationMethod,
      policySnapshot: record.policySnapshot,
      environment: record.environment,
      userId: record.userId,
      purpose: record.purpose,
      expiresAt: record.expiresAt,
      previousEvidenceHash: record.previousEvidenceHash,
      createdAt: record.createdAt,
    });
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  /**
   * HMAC-SHA256 sign a record hash for non-repudiation.
   */
  private signRecord(recordHash: string): string {
    return crypto.createHmac('sha256', this.signingKey).update(recordHash).digest('hex');
  }
}

// Singleton
export const credentialEvidenceService = new CredentialEvidenceService();
