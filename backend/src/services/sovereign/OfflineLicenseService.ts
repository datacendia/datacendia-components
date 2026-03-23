/**
 * Service — Offline License Service
 *
 * Cryptographically signed license files for air-gapped, sovereign, and SCIF deployments.
 * Verifies license validity using Ed25519 signatures with NO network, NO database, NO Redis.
 *
 * How it works:
 *   1. Datacendia signs a license JWT with our Ed25519 private key (never leaves HQ)
 *   2. The signed license file (.dcl) is delivered to the customer (USB, secure transfer)
 *   3. The customer places it at DATACENDIA_LICENSE_FILE path (or /etc/datacendia/license.dcl)
 *   4. At startup, this service verifies the signature using the embedded public key
 *   5. No network call ever needed — the public key is compiled into the binary
 *
 * License file format: Base64-encoded JWT with Ed25519 signature
 * JWT payload: { sub, org, tier, pillars, seats, iat, exp, jti, hw? }
 *
 * @exports offlineLicense, OfflineLicenseService
 * @module services/sovereign/OfflineLicenseService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import * as jose from 'jose';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type OfflineLicenseTier = 'pilot' | 'foundation' | 'enterprise' | 'strategic' | 'custom';

export interface OfflineLicensePayload {
  /** Subject — organization name (human-readable) */
  sub: string;
  /** Organization ID */
  org: string;
  /** License tier */
  tier: OfflineLicenseTier;
  /** Licensed pillars */
  pillars: string[];
  /** Maximum named seats */
  seats: number;
  /** Issued at (Unix timestamp) */
  iat: number;
  /** Expiration (Unix timestamp) */
  exp: number;
  /** Unique license ID */
  jti: string;
  /** Optional hardware fingerprint for hardware-bound licenses */
  hw?: string;
  /** Issuer — always 'datacendia' */
  iss: string;
  /** License version */
  ver: number;
}

export interface OfflineLicenseStatus {
  valid: boolean;
  payload: OfflineLicensePayload | null;
  error: string | null;
  source: string | null;
  daysRemaining: number | null;
  hardwareBound: boolean;
  hardwareMatch: boolean | null;
  verifiedAt: string | null;
}

// =============================================================================
// EMBEDDED PUBLIC KEY
//
// This is Datacendia's license-signing public key (Ed25519).
// It is embedded in the binary — no network fetch needed.
// The corresponding private key NEVER leaves Datacendia HQ.
//
// To rotate: generate a new keypair, update this constant, and re-sign
// all active licenses. Old licenses remain valid until expiration.
// =============================================================================

// Placeholder — replaced during first keypair generation
// Format: Base64-encoded SPKI DER of the Ed25519 public key
const DATACENDIA_LICENSE_PUBLIC_KEY = process.env['DATACENDIA_LICENSE_PUBLIC_KEY'] || '';

// Default license file search paths (checked in order)
const LICENSE_FILE_PATHS = [
  process.env['DATACENDIA_LICENSE_FILE'] || '',
  '/etc/datacendia/license.dcl',
  '/opt/datacendia/license.dcl',
  'C:\\ProgramData\\Datacendia\\license.dcl',
  './license.dcl',
];

// =============================================================================
// SERVICE
// =============================================================================

class OfflineLicenseService {
  private _status: OfflineLicenseStatus = {
    valid: false,
    payload: null,
    error: null,
    source: null,
    daysRemaining: null,
    hardwareBound: false,
    hardwareMatch: null,
    verifiedAt: null,
  };

  private _publicKey: crypto.KeyObject | null = null;

  // ─── Initialization ───────────────────────────────────────────────────

  /**
   * Load the embedded public key. Called once at startup.
   */
  private async loadPublicKey(): Promise<crypto.KeyObject> {
    if (this._publicKey) return this._publicKey;

    if (!DATACENDIA_LICENSE_PUBLIC_KEY) {
      throw new Error(
        'No license public key configured. Set DATACENDIA_LICENSE_PUBLIC_KEY or embed it in the build.'
      );
    }

    // Import the SPKI-encoded Ed25519 public key
    const keyBuffer = Buffer.from(DATACENDIA_LICENSE_PUBLIC_KEY, 'base64');
    this._publicKey = crypto.createPublicKey({
      key: keyBuffer,
      format: 'der',
      type: 'spki',
    });

    return this._publicKey;
  }

  // ─── License File Discovery ───────────────────────────────────────────

  /**
   * Find the license file on disk. Searches well-known paths in order.
   */
  findLicenseFile(): string | null {
    for (const filePath of LICENSE_FILE_PATHS) {
      if (!filePath) continue;
      const resolved = path.resolve(filePath);
      try {
        if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
          return resolved;
        }
      } catch {
        // Permission denied or other FS error — skip
      }
    }
    return null;
  }

  /**
   * Read the license token from a file.
   */
  private readLicenseFile(filePath: string): string {
    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    // The .dcl file is either raw JWT or Base64-encoded JWT
    // Try to detect: JWTs have 3 dot-separated parts
    if (raw.split('.').length === 3) {
      return raw; // Already a JWT
    }
    // Try Base64 decode
    const decoded = Buffer.from(raw, 'base64').toString('utf-8');
    if (decoded.split('.').length === 3) {
      return decoded;
    }
    throw new Error('Invalid license file format — expected JWT or Base64-encoded JWT');
  }

  // ─── Hardware Fingerprint ─────────────────────────────────────────────

  /**
   * Generate a hardware fingerprint for this machine.
   * Used for hardware-bound licenses (optional).
   *
   * Fingerprint = SHA-256(hostname + cpuModel + totalMemory + platform + arch)
   * This is NOT cryptographically strong binding (easy to spoof),
   * but it prevents casual license sharing between machines.
   */
  getHardwareFingerprint(): string {
    const os = require('os');
    const components = [
      os.hostname(),
      os.cpus()[0]?.model || 'unknown',
      String(os.totalmem()),
      os.platform(),
      os.arch(),
    ];
    return crypto.createHash('sha256').update(components.join('|')).digest('hex').substring(0, 16);
  }

  // ─── Verification ─────────────────────────────────────────────────────

  /**
   * Verify a license JWT string. Returns the decoded payload if valid.
   * This is the core function — pure cryptographic verification, no network.
   */
  async verifyToken(token: string): Promise<OfflineLicensePayload> {
    const publicKey = await this.loadPublicKey();

    // Import as jose CryptoKey for JWT verification
    const joseKey = await jose.importSPKI(
      this.cryptoKeyToPEM(publicKey),
      'EdDSA'
    );

    // Verify the JWT signature + expiration
    const { payload } = await jose.jwtVerify(token, joseKey, {
      issuer: 'datacendia',
      algorithms: ['EdDSA'],
    });

    // Validate required fields
    const required = ['sub', 'org', 'tier', 'pillars', 'seats', 'jti', 'ver'];
    for (const field of required) {
      if (!(field in payload)) {
        throw new Error(`License JWT missing required field: ${field}`);
      }
    }

    return payload as unknown as OfflineLicensePayload;
  }

  /**
   * Convert a Node.js crypto KeyObject to PEM format for jose.
   */
  private cryptoKeyToPEM(key: crypto.KeyObject): string {
    return key.export({ type: 'spki', format: 'pem' }) as string;
  }

  /**
   * Full validation: find file → verify signature → check expiration → check hardware.
   * Called at startup when DATACENDIA_ONLINE_MODE=false.
   */
  async validate(): Promise<OfflineLicenseStatus> {
    try {
      // 1. Find the license file
      const filePath = this.findLicenseFile();
      if (!filePath) {
        this._status = {
          valid: false,
          payload: null,
          error: 'No license file found. Searched: ' + LICENSE_FILE_PATHS.filter(Boolean).join(', '),
          source: null,
          daysRemaining: null,
          hardwareBound: false,
          hardwareMatch: null,
          verifiedAt: new Date().toISOString(),
        };
        return this._status;
      }

      logger.info(`[OfflineLicense] Found license file: ${filePath}`);

      // 2. Read and verify the JWT
      const token = this.readLicenseFile(filePath);
      const payload = await this.verifyToken(token);

      // 3. Check expiration (jose already checks exp, but calculate days remaining)
      const now = Math.floor(Date.now() / 1000);
      const daysRemaining = Math.ceil((payload.exp - now) / 86400);

      // 4. Check hardware binding (if present)
      let hardwareBound = false;
      let hardwareMatch: boolean | null = null;

      if (payload.hw) {
        hardwareBound = true;
        const currentFingerprint = this.getHardwareFingerprint();
        hardwareMatch = payload.hw === currentFingerprint;

        if (!hardwareMatch) {
          this._status = {
            valid: false,
            payload,
            error: `Hardware fingerprint mismatch. License bound to '${payload.hw}', current machine is '${currentFingerprint}'`,
            source: filePath,
            daysRemaining,
            hardwareBound,
            hardwareMatch,
            verifiedAt: new Date().toISOString(),
          };
          logger.error(`[OfflineLicense] Hardware fingerprint mismatch — license rejected`);
          return this._status;
        }
      }

      // 5. Valid!
      this._status = {
        valid: true,
        payload,
        error: null,
        source: filePath,
        daysRemaining,
        hardwareBound,
        hardwareMatch,
        verifiedAt: new Date().toISOString(),
      };

      logger.info(`[OfflineLicense] ✓ License verified`);
      logger.info(`[OfflineLicense]   Organization: ${payload.sub} (${payload.org})`);
      logger.info(`[OfflineLicense]   Tier: ${payload.tier}`);
      logger.info(`[OfflineLicense]   Pillars: ${payload.pillars.join(', ')}`);
      logger.info(`[OfflineLicense]   Seats: ${payload.seats}`);
      logger.info(`[OfflineLicense]   Expires: ${new Date(payload.exp * 1000).toISOString()} (${daysRemaining} days)`);
      if (hardwareBound) {
        logger.info(`[OfflineLicense]   Hardware-bound: YES (fingerprint verified)`);
      }

      if (daysRemaining <= 30) {
        logger.warn(`[OfflineLicense] ⚠ License expires in ${daysRemaining} days — contact Datacendia for renewal`);
      }

      return this._status;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this._status = {
        valid: false,
        payload: null,
        error: `License verification failed: ${message}`,
        source: null,
        daysRemaining: null,
        hardwareBound: false,
        hardwareMatch: null,
        verifiedAt: new Date().toISOString(),
      };

      logger.error(`[OfflineLicense] ✗ Verification failed: ${message}`);
      return this._status;
    }
  }

  // ─── Runtime Queries ──────────────────────────────────────────────────

  /** Get the current offline license status */
  getStatus(): OfflineLicenseStatus {
    return { ...this._status };
  }

  /** Check if the offline license is valid */
  get isValid(): boolean {
    return this._status.valid;
  }

  /** Get the licensed tier, or null if no valid license */
  get tier(): OfflineLicenseTier | null {
    return this._status.payload?.tier || null;
  }

  /** Get the licensed pillars, or empty array */
  get pillars(): string[] {
    return this._status.payload?.pillars || [];
  }

  /** Get the licensed seat count, or 0 */
  get seats(): number {
    return this._status.payload?.seats || 0;
  }

  /** Get the organization ID from the license */
  get organizationId(): string | null {
    return this._status.payload?.org || null;
  }

  /** Check if a specific pillar is licensed */
  hasPillar(pillarId: string): boolean {
    return this.pillars.includes(pillarId);
  }

  // ─── Signing (Admin/HQ only) ──────────────────────────────────────────

  /**
   * Sign a license payload. This is only used at Datacendia HQ to generate
   * license files for customers. The private key MUST be provided.
   *
   * @param payload - The license claims to sign
   * @param privateKeyPEM - Ed25519 private key in PEM format
   * @returns Signed JWT string
   */
  static async signLicense(
    payload: Omit<OfflineLicensePayload, 'iat' | 'iss' | 'ver'>,
    privateKeyPEM: string
  ): Promise<string> {
    const privateKey = await jose.importPKCS8(privateKeyPEM, 'EdDSA');

    const now = Math.floor(Date.now() / 1000);

    const jwt = await new jose.SignJWT({
      sub: payload.sub,
      org: payload.org,
      tier: payload.tier,
      pillars: payload.pillars,
      seats: payload.seats,
      jti: payload.jti,
      ver: 1,
      ...(payload.hw ? { hw: payload.hw } : {}),
    })
      .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime(payload.exp)
      .setIssuer('datacendia')
      .sign(privateKey);

    return jwt;
  }

  /**
   * Generate a new Ed25519 keypair for license signing.
   * Returns PEM-encoded private key and Base64-encoded SPKI public key.
   *
   * The private key stays at HQ. The public key is embedded in builds.
   */
  static async generateKeypair(): Promise<{
    privateKeyPEM: string;
    publicKeyPEM: string;
    publicKeySPKIBase64: string;
  }> {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');

    const privateKeyPEM = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;
    const publicKeyPEM = publicKey.export({ type: 'spki', format: 'pem' }) as string;
    const publicKeySPKIBase64 = publicKey.export({ type: 'spki', format: 'der' }).toString('base64');

    return { privateKeyPEM, publicKeyPEM, publicKeySPKIBase64 };
  }
}

// Singleton export
export const offlineLicense = new OfflineLicenseService();
export { OfflineLicenseService };
