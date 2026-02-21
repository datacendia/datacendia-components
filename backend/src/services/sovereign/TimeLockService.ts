// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA TIME-LOCKÃ¢â€žÂ¢ - CRYPTOGRAPHIC TIME-LOCK FOR EMBARGOED DECISIONS
// "Enforcing earliest-access under defined compute assumptions."
//
// Encrypts sensitive decisions with time-lock cryptography (RSA time-lock puzzles).
// Decryption requires sequential computation that cannot be parallelized.
// Suitable for M&A announcements, earnings, board decisions.
//
// SECURITY ASSUMPTIONS (operators must understand these):
// 1. Sequential Work: The puzzle requires T sequential squarings that cannot
//    be parallelized. Security depends on this property of modular squaring.
// 2. Adversary Compute: We assume adversary hardware performs at most
//    CALIBRATED_IPS squarings per second. Hardware improvements may reduce delay.
// 3. Modulus Security: RSA modulus factorization is assumed hard. If factored,
//    the puzzle can be solved instantly using phi(n).
// 4. No Time Travel: The puzzle enforces MINIMUM delay, not exact time.
//    It may be solved AFTER the target time if insufficient compute is applied.
//
// THIS IS NOT "UNBREAKABLE":
// - A sufficiently powerful adversary with faster hardware could solve earlier
// - Quantum computers would break RSA-based time-locks entirely
// - The guarantee is: "under stated assumptions, earliest access is T seconds"
//
// PARAMETER POLICY:
// - Modulus Size: 1024-bit (minimum), 2048-bit (recommended for >1 week delays)
// - Squaring Count: Calibrated to target hardware at deployment time
// - Calibration Method: Benchmark repeated squarings, measure IPS, derive T
// - Re-calibrate: After hardware upgrades or annually
// =============================================================================

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface TimeLockConfig {
  // Puzzle parameters
  defaultDifficulty: number;     // Time-lock puzzle iterations
  iterationsPerSecond: number;   // Calibrated for target hardware
  
  // Storage
  storagePath: string;
  
  // Verification
  enableWitnesses: boolean;
  minWitnesses: number;
  
  // Enterprise hardening: policy versioning
  policyVersion: string;         // e.g., "1.0.0"
  modulusBits: number;           // RSA modulus size
  calibrationDate: Date;         // When IPS was calibrated
  calibrationHardware: string;   // Hardware description for audit
}

/**
 * Time-lock envelope format for enterprise audit trail.
 * Contains all metadata needed to verify and reproduce the time-lock.
 */
export interface TimeLockEnvelope {
  version: string;               // Envelope format version
  policyVersion: string;         // Policy under which this was created
  
  // Vault reference
  vaultId: string;
  
  // Calibration metadata
  calibration: {
    iterationsPerSecond: number;
    calibrationDate: string;     // ISO date
    calibrationHardware: string;
    modulusBits: number;
  };
  
  // Puzzle parameters (for verification)
  puzzleParams: {
    modulusHash: string;         // SHA-256 of modulus (not the modulus itself)
    iterations: number;
    expectedDelaySeconds: number;
    releaseTimestamp: string;    // ISO date
  };
  
  // Cryptographic proof
  signature: string;             // Signature over envelope contents
  signedBy: string;              // Signing key identifier
  signedAt: string;              // ISO date
  
  // Warnings (transparent about limitations)
  warnings: string[];
}

export interface TimeLockVault {
  id: string;
  organizationId: string;
  createdBy: string;
  
  // Content identification
  name: string;
  description: string;
  contentType: 'decision' | 'announcement' | 'document' | 'key' | 'custom';
  
  // Encrypted content
  encryptedContent: string;     // AES-256-GCM encrypted
  contentHash: string;          // SHA-256 of original content
  
  // Time-lock puzzle
  puzzle: TimeLockPuzzle;
  
  // Release schedule
  releaseAt: Date;
  
  // Status
  status: 'locked' | 'unlocking' | 'unlocked' | 'expired' | 'revoked';
  unlockedAt?: Date;
  decryptedContent?: string;
  
  // Witnesses (optional multi-party)
  witnesses?: Witness[];
  
  // Metadata
  createdAt: Date;
  accessLog: AccessLogEntry[];
}

export interface TimeLockPuzzle {
  // RSA time-lock puzzle (Rivest-Shamir-Wagner)
  n: string;                    // RSA modulus (hex)
  t: number;                    // Number of squarings required
  encryptedKey: string;         // Key encrypted with puzzle
  
  // Verification
  puzzleHash: string;
  
  // Progress (if unlocking)
  progress?: number;            // 0-100
  currentIteration?: bigint;
  
  // Enterprise hardening: calibration metadata
  modulusBits: number;          // Size of RSA modulus
  calibratedIPS: number;        // Iterations/second at creation time
  expectedDelaySeconds: number; // Expected delay based on calibration
}

export interface Witness {
  id: string;
  name: string;
  publicKey: string;
  
  // Key share (Shamir's Secret Sharing)
  keyShare: string;
  shareIndex: number;
  
  // Status
  hasContributed: boolean;
  contributedAt?: Date;
}

export interface AccessLogEntry {
  timestamp: Date;
  action: 'created' | 'accessed' | 'unlock_started' | 'unlocked' | 'revoked';
  actor: string;
  details?: string;
}

export interface UnlockProgress {
  vaultId: string;
  status: 'pending' | 'computing' | 'complete' | 'failed';
  progress: number;
  estimatedTimeRemaining?: number;
  startedAt?: Date;
  completedAt?: Date;
}

// =============================================================================
// TIME-LOCK PUZZLE IMPLEMENTATION
// =============================================================================

class TimeLockPuzzleGenerator {
  /**
   * Generate a time-lock puzzle that takes approximately `seconds` to solve
   */
  static generate(params: {
    key: Buffer;
    seconds: number;
    iterationsPerSecond: number;
  }): TimeLockPuzzle {
    // Generate RSA modulus
    const { p, q, n } = this.generateRSAModulus(1024);
    
    // Calculate number of iterations
    const t = Math.floor(params.seconds * params.iterationsPerSecond);
    
    // Calculate phi(n) = (p-1)(q-1) - we need this to create the puzzle
    const phi = (p - BigInt(1)) * (q - BigInt(1));
    
    // Generate random base for repeated squaring
    const a = this.randomBigInt(n);
    
    // Calculate e = 2^t mod phi(n) (shortcut using phi)
    const e = this.modPow(BigInt(2), BigInt(t), phi);
    
    // Calculate b = a^(2^t) mod n = a^e mod n (using the shortcut)
    const b = this.modPow(a, e, n);
    
    // Encrypt the key with b
    const keyNum = BigInt('0x' + params.key.toString('hex'));
    const encryptedKeyNum = (keyNum + b) % n;
    
    return {
      n: n.toString(16),
      t,
      encryptedKey: encryptedKeyNum.toString(16),
      puzzleHash: crypto.createHash('sha256')
        .update(`${n.toString(16)}:${t}:${a.toString(16)}`)
        .digest('hex'),
      // Enterprise hardening: calibration metadata
      modulusBits: 1024,
      calibratedIPS: params.iterationsPerSecond,
      expectedDelaySeconds: params.seconds,
    };
  }

  /**
   * Solve the time-lock puzzle by repeated squaring
   */
  static async solve(
    puzzle: TimeLockPuzzle,
    onProgress?: (progress: number, iteration: bigint) => void
  ): Promise<Buffer> {
    const n = BigInt('0x' + puzzle.n);
    const t = puzzle.t;
    
    // Start with a deterministic value derived from puzzle
    let current = BigInt(2);
    
    // Perform t repeated squarings
    for (let i = 0; i < t; i++) {
      current = (current * current) % n;
      
      // Report progress periodically
      if (onProgress && i % 10000 === 0) {
        onProgress((i / t) * 100, BigInt(i));
      }
      
      // Yield to event loop periodically
      if (i % 100000 === 0) {
        await new Promise(resolve => setImmediate(resolve));
      }
    }
    
    // Decrypt the key
    const encryptedKey = BigInt('0x' + puzzle.encryptedKey);
    const key = (encryptedKey - current + n) % n;
    
    // Convert back to buffer
    const keyHex = key.toString(16).padStart(64, '0');
    return Buffer.from(keyHex, 'hex');
  }

  /**
   * Generate RSA modulus
   */
  private static generateRSAModulus(bits: number): { p: bigint; q: bigint; n: bigint } {
    // ROADMAP: use proper prime generation
    // For now, generate pseudo-random large primes
    const halfBits = bits / 2;
    
    const p = this.generatePrime(halfBits);
    const q = this.generatePrime(halfBits);
    const n = p * q;
    
    return { p, q, n };
  }

  /**
   * Generate a pseudo-prime (simplified for demo)
   */
  private static generatePrime(bits: number): bigint {
    // Use crypto for randomness
    const bytes = Math.ceil(bits / 8);
    const buf = crypto.randomBytes(bytes);
    let num = BigInt('0x' + buf.toString('hex'));
    
    // Make odd
    num = num | BigInt(1);
    
    // Simple primality test (ROADMAP: use Miller-Rabin)
    while (!this.isProbablyPrime(num)) {
      num += BigInt(2);
    }
    
    return num;
  }

  /**
   * Simple primality test
   */
  private static isProbablyPrime(n: bigint): boolean {
    if (n < BigInt(2)) return false;
    if (n === BigInt(2)) return true;
    if (n % BigInt(2) === BigInt(0)) return false;
    
    // Check small primes
    const smallPrimes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    for (const p of smallPrimes) {
      if (n === BigInt(p)) return true;
      if (n % BigInt(p) === BigInt(0)) return false;
    }
    
    return true; // Simplified - production should use proper test
  }

  /**
   * Modular exponentiation
   */
  private static modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = BigInt(1);
    base = base % mod;
    
    while (exp > BigInt(0)) {
      if (exp % BigInt(2) === BigInt(1)) {
        result = (result * base) % mod;
      }
      exp = exp / BigInt(2);
      base = (base * base) % mod;
    }
    
    return result;
  }

  /**
   * Generate random BigInt less than max
   */
  private static randomBigInt(max: bigint): bigint {
    const bytes = Math.ceil(max.toString(16).length / 2);
    const buf = crypto.randomBytes(bytes);
    let num = BigInt('0x' + buf.toString('hex'));
    return num % max;
  }
}

// =============================================================================
// TIME-LOCK SERVICE
// =============================================================================

class TimeLockService extends EventEmitter {
  private config: TimeLockConfig;
  private vaults: Map<string, TimeLockVault> = new Map();
  private unlockingProcesses: Map<string, UnlockProgress> = new Map();
  private storagePath: string;

  constructor() {
    super();
    
    this.config = {
      defaultDifficulty: 60,         // 60 seconds default
      iterationsPerSecond: 100000,   // Calibrate based on hardware
      storagePath: process.env['TIMELOCK_STORAGE_PATH'] || '/var/datacendia/timelock',
      enableWitnesses: true,
      minWitnesses: 2,
      // Enterprise hardening: policy versioning
      policyVersion: '1.0.0',
      modulusBits: 1024,             // Minimum secure size
      calibrationDate: new Date(),   // Should be updated after benchmark
      calibrationHardware: 'default-uncalibrated',  // Should be set after benchmark
    };
    
    this.storagePath = this.config.storagePath;
    this.ensureDirectories();
    
    // Start unlock checker
    this.startUnlockChecker();
    
    logger.info('[TimeLock] Service initialized - Cryptographic embargo ready');
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Periodically check for vaults ready to unlock
   */
  private startUnlockChecker(): void {
    setInterval(async () => {
      const now = new Date();
      
      for (const vault of this.vaults.values()) {
        if (vault.status === 'locked' && vault.releaseAt <= now) {
          // Auto-start unlock if release time has passed
          this.startUnlock(vault.id).catch(err => {
            logger.error(`[TimeLock] Auto-unlock failed for ${vault.id}:`, err);
          });
        }
      }
    }, 60000); // Check every minute
  }

  // ===========================================================================
  // VAULT CREATION
  // ===========================================================================

  /**
   * Create a time-locked vault
   */
  async createVault(params: {
    organizationId: string;
    createdBy: string;
    name: string;
    description?: string;
    content: string | object;
    contentType: TimeLockVault['contentType'];
    releaseAt: Date | string;
    witnesses?: { name: string; publicKey: string }[];
  }): Promise<TimeLockVault> {
    const id = `vault-${crypto.randomUUID()}`;
    
    // Parse releaseAt if it's a string
    const releaseAtDate = typeof params.releaseAt === 'string' 
      ? new Date(params.releaseAt) 
      : params.releaseAt;
    
    // Serialize content
    const contentStr = typeof params.content === 'string' 
      ? params.content 
      : JSON.stringify(params.content);
    
    // Generate encryption key
    const encryptionKey = crypto.randomBytes(32);
    
    // Encrypt content
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
    let encryptedContent = cipher.update(contentStr, 'utf8', 'base64');
    encryptedContent += cipher.final('base64');
    const authTag = cipher.getAuthTag();
    
    // Combine iv + authTag + encrypted
    const fullEncrypted = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encryptedContent, 'base64'),
    ]).toString('base64');
    
    // Calculate time until release
    const secondsUntilRelease = Math.max(
      this.config.defaultDifficulty,
      Math.floor((releaseAtDate.getTime() - Date.now()) / 1000)
    );
    
    // Generate time-lock puzzle
    const puzzle = TimeLockPuzzleGenerator.generate({
      key: encryptionKey,
      seconds: secondsUntilRelease,
      iterationsPerSecond: this.config.iterationsPerSecond,
    });
    
    // Setup witnesses if provided
    let witnesses: Witness[] | undefined;
    if (params.witnesses && params.witnesses.length >= this.config.minWitnesses) {
      witnesses = params.witnesses.map((w, i) => ({
        id: `witness-${crypto.randomUUID().slice(0, 8)}`,
        name: w.name,
        publicKey: w.publicKey,
        keyShare: '', // Would use Shamir's Secret Sharing
        shareIndex: i,
        hasContributed: false,
      }));
    }
    
    const vault: TimeLockVault = {
      id,
      organizationId: params.organizationId,
      createdBy: params.createdBy,
      name: params.name,
      description: params.description || '',
      contentType: params.contentType,
      encryptedContent: fullEncrypted,
      contentHash: crypto.createHash('sha256').update(contentStr).digest('hex'),
      puzzle,
      releaseAt: releaseAtDate,
      status: 'locked',
      witnesses,
      createdAt: new Date(),
      accessLog: [{
        timestamp: new Date(),
        action: 'created',
        actor: params.createdBy,
      }],
    };
    
    this.vaults.set(id, vault);
    await this.persistVault(vault);
    persistServiceRecord({ serviceName: 'TimeLock', recordType: 'vault_created', referenceId: id, data: { id, releaseAt: releaseAtDate.toISOString(), status: 'locked' } });
    logger.info(`[TimeLock] Created vault ${id}: releases at ${releaseAtDate.toISOString()}`);
    this.emit('vault:created', vault);
    
    return vault;
  }

  /**
   * Persist vault to storage
   */
  private async persistVault(vault: TimeLockVault): Promise<void> {
    const filePath = path.join(this.storagePath, `${vault.id}.json`);
    
    // Don't persist decrypted content
    const toSave = { ...vault };
    delete toSave.decryptedContent;
    
    fs.writeFileSync(filePath, JSON.stringify(toSave, null, 2));
  }

  // ===========================================================================
  // UNLOCKING
  // ===========================================================================

  /**
   * Start the unlock process for a vault
   */
  async startUnlock(vaultId: string): Promise<UnlockProgress> {
    const vault = this.vaults.get(vaultId);
    if (!vault) throw new Error(`Vault not found: ${vaultId}`);
    
    if (vault.status !== 'locked') {
      throw new Error(`Vault is not locked: ${vault.status}`);
    }
    
    // Check if already unlocking
    if (this.unlockingProcesses.has(vaultId)) {
      return this.unlockingProcesses.get(vaultId)!;
    }
    
    // Check release time
    if (vault.releaseAt > new Date()) {
      throw new Error(`Vault not yet releasable. Release at: ${vault.releaseAt.toISOString()}`);
    }
    
    vault.status = 'unlocking';
    vault.accessLog.push({
      timestamp: new Date(),
      action: 'unlock_started',
      actor: 'system',
    });
    
    const progress: UnlockProgress = {
      vaultId,
      status: 'computing',
      progress: 0,
      startedAt: new Date(),
    };
    
    this.unlockingProcesses.set(vaultId, progress);
    
    // Start async unlock process
    this.processUnlock(vault, progress).catch(err => {
      logger.error(`[TimeLock] Unlock failed for ${vaultId}:`, err);
      progress.status = 'failed';
      vault.status = 'locked';
    });
    
    logger.info(`[TimeLock] Started unlock for ${vaultId}`);
    this.emit('unlock:started', { vaultId, progress });
    
    return progress;
  }

  /**
   * Process the unlock (solve time-lock puzzle)
   */
  private async processUnlock(vault: TimeLockVault, progress: UnlockProgress): Promise<void> {
    try {
      // Solve the time-lock puzzle
      const key = await TimeLockPuzzleGenerator.solve(
        vault.puzzle,
        (pct, iteration) => {
          progress.progress = Math.round(pct);
          progress.estimatedTimeRemaining = 
            ((100 - pct) / pct) * (Date.now() - progress.startedAt!.getTime()) / 1000;
          this.emit('unlock:progress', { vaultId: vault.id, progress });
        }
      );
      
      // Decrypt the content
      const encrypted = Buffer.from(vault.encryptedContent, 'base64');
      const iv = encrypted.subarray(0, 16);
      const authTag = encrypted.subarray(16, 32);
      const ciphertext = encrypted.subarray(32);
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(ciphertext);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      vault.decryptedContent = decrypted.toString('utf8');
      vault.status = 'unlocked';
      vault.unlockedAt = new Date();
      vault.accessLog.push({
        timestamp: new Date(),
        action: 'unlocked',
        actor: 'system',
      });
      
      progress.status = 'complete';
      progress.progress = 100;
      progress.completedAt = new Date();
      
      await this.persistVault(vault);
      
      logger.info(`[TimeLock] Vault ${vault.id} unlocked successfully`);
      this.emit('vault:unlocked', vault);
      
    } finally {
      this.unlockingProcesses.delete(vault.id);
    }
  }

  /**
   * Get unlock progress
   */
  getUnlockProgress(vaultId: string): UnlockProgress | undefined {
    return this.unlockingProcesses.get(vaultId);
  }

  // ===========================================================================
  // VAULT MANAGEMENT
  // ===========================================================================

  /**
   * Get vault by ID
   */
  getVault(vaultId: string): TimeLockVault | undefined {
    return this.vaults.get(vaultId);
  }

  /**
   * Get vault content (only if unlocked)
   */
  getVaultContent(vaultId: string, userId: string): string | null {
    const vault = this.vaults.get(vaultId);
    if (!vault) return null;
    
    if (vault.status !== 'unlocked') {
      vault.accessLog.push({
        timestamp: new Date(),
        action: 'accessed',
        actor: userId,
        details: 'Attempted access while locked',
      });
      return null;
    }
    
    vault.accessLog.push({
      timestamp: new Date(),
      action: 'accessed',
      actor: userId,
    });
    
    return vault.decryptedContent || null;
  }

  /**
   * List vaults for organization
   */
  listVaults(organizationId: string): TimeLockVault[] {
    return Array.from(this.vaults.values())
      .filter(v => v.organizationId === organizationId)
      .map(v => {
        // Don't include decrypted content in list
        const { decryptedContent, ...safe } = v;
        return safe as TimeLockVault;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Revoke a vault (makes content permanently inaccessible)
   */
  async revokeVault(vaultId: string, revokedBy: string): Promise<void> {
    const vault = this.vaults.get(vaultId);
    if (!vault) throw new Error(`Vault not found: ${vaultId}`);
    
    if (vault.status === 'unlocked') {
      throw new Error('Cannot revoke unlocked vault');
    }
    
    vault.status = 'revoked';
    vault.accessLog.push({
      timestamp: new Date(),
      action: 'revoked',
      actor: revokedBy,
    });
    
    await this.persistVault(vault);
    
    logger.info(`[TimeLock] Vault ${vaultId} revoked by ${revokedBy}`);
    this.emit('vault:revoked', vault);
  }

  /**
   * Get time remaining until release
   */
  getTimeUntilRelease(vaultId: string): number {
    const vault = this.vaults.get(vaultId);
    if (!vault) return -1;
    
    const remaining = vault.releaseAt.getTime() - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Check if vault is accessible
   */
  isAccessible(vaultId: string): boolean {
    const vault = this.vaults.get(vaultId);
    if (!vault) return false;
    return vault.status === 'unlocked';
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const timeLockService = new TimeLockService();
export { TimeLockService, TimeLockPuzzleGenerator };
