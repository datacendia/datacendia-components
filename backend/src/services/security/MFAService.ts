/**
 * Service — M F A Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports MFAService, mfaService
 * @module services/security/MFAService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// MFA SERVICE
// Multi-Factor Authentication with TOTP and backup codes
// =============================================================================

import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';

const prisma = new PrismaClient();

// Type for user with MFA fields (after prisma generate)
interface UserWithMFA {
  id: string;
  email: string;
  mfa_enabled: boolean;
  mfa_secret: string | null;
  mfa_backup_codes: string | null;
  mfa_enabled_at: Date | null;
}

async function createAuditLog(data: { eventType: string; userId: string; details: Record<string, unknown> }) {
  try {
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: 'system',
        action: data.eventType,
        resource_type: 'mfa',
        resource_id: data.userId,
        user_id: data.userId,
        details: JSON.stringify(data.details),
        ip_address: null,
        user_agent: null,
        created_at: new Date(),
      } as any,
    });
  } catch (error) {
    logger.error('Failed to create audit log', error);
  }
}

interface MFASetupResult {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}

interface MFAVerifyResult {
  success: boolean;
  message: string;
}

export class MFAService {
  private readonly issuer = 'Datacendia';
  private readonly encryptionKey: Buffer;

  constructor() {
    const key = process.env.MFA_ENCRYPTION_KEY || process.env.JWT_SECRET;
    if (!key && process.env.NODE_ENV === 'production') {
      throw new Error('MFA_ENCRYPTION_KEY or JWT_SECRET must be set in production');
    }
    this.encryptionKey = crypto.createHash('sha256').update(key || 'dev-only-mfa-key').digest();
  }

  /**
   * Generate a new TOTP secret for MFA setup
   */
  generateSecret(): { secret: string; backupCodes: string[] } {
    // Generate 20-byte secret for TOTP (base32 encoded = 32 chars)
    const secretBytes = crypto.randomBytes(20);
    const secret = this.base32Encode(secretBytes);

    // Generate 10 backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    return { secret, backupCodes };
  }

  /**
   * Initiate MFA setup for a user
   */
  async initiateSetup(userId: string): Promise<MFASetupResult> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, email: true, mfa_enabled: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.mfa_enabled) {
      throw new Error('MFA is already enabled for this user');
    }

    const { secret, backupCodes } = this.generateSecret();
    const otpauthUrl = `otpauth://totp/${this.issuer}:${user.email}?secret=${secret}&issuer=${this.issuer}&algorithm=SHA1&digits=6&period=30`;

    // Generate QR code data URL
    const qrCodeDataUrl = await this.generateQRCode(otpauthUrl);

    // Store encrypted secret temporarily (will be confirmed on verification)
    const encryptedSecret = this.encrypt(secret);
    const encryptedBackupCodes = this.encrypt(JSON.stringify(backupCodes));

    await prisma.users.update({
      where: { id: userId },
      data: {
        mfa_secret: encryptedSecret,
        mfa_backup_codes: encryptedBackupCodes,
        updated_at: new Date(),
      },
    });

    await createAuditLog({
      eventType: 'MFA_SETUP_INITIATED',
      userId,
      details: { email: user.email },
    });

    return {
      secret,
      otpauthUrl,
      qrCodeDataUrl,
      backupCodes,
    };
  }

  /**
   * Complete MFA setup by verifying the first code
   */
  async completeSetup(userId: string, code: string): Promise<MFAVerifyResult> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, email: true, mfa_secret: true, mfa_enabled: true },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.mfa_enabled) {
      return { success: false, message: 'MFA is already enabled' };
    }

    if (!user.mfa_secret) {
      return { success: false, message: 'MFA setup not initiated' };
    }

    const secret = this.decrypt(user.mfa_secret);
    const isValid = this.verifyTOTP(secret, code);

    if (!isValid) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Enable MFA
    await prisma.users.update({
      where: { id: userId },
      data: {
        mfa_enabled: true,
        mfa_enabled_at: new Date(),
        updated_at: new Date(),
      },
    });

    await createAuditLog({
      eventType: 'MFA_ENABLED',
      userId,
      details: { email: user.email },
    });

    return { success: true, message: 'MFA enabled successfully' };
  }

  /**
   * Verify a TOTP code for authentication
   */
  async verify(userId: string, code: string): Promise<MFAVerifyResult> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, mfa_secret: true, mfa_enabled: true, mfa_backup_codes: true },
    });

    if (!user || !user.mfa_enabled || !user.mfa_secret) {
      return { success: false, message: 'MFA not enabled for this user' };
    }

    const secret = this.decrypt(user.mfa_secret);

    // Try TOTP first
    if (this.verifyTOTP(secret, code)) {
      await createAuditLog({
        eventType: 'MFA_VERIFIED',
        userId,
        details: { method: 'totp' },
      });
      return { success: true, message: 'Verified' };
    }

    // Try backup code
    if (user.mfa_backup_codes) {
      const backupCodes: string[] = JSON.parse(this.decrypt(user.mfa_backup_codes));
      const codeIndex = backupCodes.indexOf(code.toUpperCase());

      if (codeIndex !== -1) {
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        const encryptedCodes = this.encrypt(JSON.stringify(backupCodes));

        await prisma.users.update({
          where: { id: userId },
          data: {
            mfa_backup_codes: encryptedCodes,
            updated_at: new Date(),
          },
        });

        await createAuditLog({
          eventType: 'MFA_VERIFIED',
          userId,
          details: { method: 'backup_code', remaining: backupCodes.length },
        });

        return { success: true, message: `Verified with backup code. ${backupCodes.length} codes remaining.` };
      }
    }

    await createAuditLog({
      eventType: 'MFA_FAILED',
      userId,
      details: { reason: 'invalid_code' },
    });

    return { success: false, message: 'Invalid verification code' };
  }

  /**
   * Disable MFA for a user
   */
  async disable(userId: string, verificationCode: string): Promise<MFAVerifyResult> {
    // First verify the code
    const verifyResult = await this.verify(userId, verificationCode);
    if (!verifyResult.success) {
      return { success: false, message: 'Invalid verification code' };
    }

    await prisma.users.update({
      where: { id: userId },
      data: {
        mfa_enabled: false,
        mfa_secret: null,
        mfa_backup_codes: null,
        mfa_enabled_at: null,
        updated_at: new Date(),
      },
    });

    await createAuditLog({
      eventType: 'MFA_DISABLED',
      userId,
      details: {},
    });

    return { success: true, message: 'MFA disabled successfully' };
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(userId: string, verificationCode: string): Promise<string[] | null> {
    // First verify the code
    const verifyResult = await this.verify(userId, verificationCode);
    if (!verifyResult.success) {
      return null;
    }

    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );

    const encryptedCodes = this.encrypt(JSON.stringify(backupCodes));

    await prisma.users.update({
      where: { id: userId },
      data: {
        mfa_backup_codes: encryptedCodes,
        updated_at: new Date(),
      },
    });

    await createAuditLog({
      eventType: 'MFA_BACKUP_REGENERATED',
      userId,
      details: {},
    });

    return backupCodes;
  }

  /**
   * Check if MFA is enabled for a user
   */
  async isEnabled(userId: string): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { mfa_enabled: true },
    });
    return user?.mfa_enabled ?? false;
  }

  /**
   * Get MFA status for a user
   */
  async getStatus(userId: string): Promise<{ enabled: boolean; enabledAt: Date | null; backupCodesRemaining: number }> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { mfa_enabled: true, mfa_enabled_at: true, mfa_backup_codes: true },
    });

    if (!user) {
      return { enabled: false, enabledAt: null, backupCodesRemaining: 0 };
    }

    let backupCodesRemaining = 0;
    if (user.mfa_backup_codes) {
      try {
        const codes: string[] = JSON.parse(this.decrypt(user.mfa_backup_codes));
        backupCodesRemaining = codes.length;
      } catch {
        backupCodesRemaining = 0;
      }
    }

    return {
      enabled: user.mfa_enabled,
      enabledAt: user.mfa_enabled_at,
      backupCodesRemaining,
    };
  }

  // =============================================================================
  // PRIVATE HELPERS
  // =============================================================================

  private verifyTOTP(secret: string, code: string): boolean {
    const window = 1; // Allow 1 step before/after for clock drift

    for (let i = -window; i <= window; i++) {
      const expectedCode = this.generateTOTP(secret, i);
      if (expectedCode === code) {
        return true;
      }
    }
    return false;
  }

  private generateTOTP(secret: string, offset: number = 0): string {
    const period = 30;
    const digits = 6;
    const time = Math.floor(Date.now() / 1000 / period) + offset;

    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigInt64BE(BigInt(time));

    const secretBuffer = this.base32Decode(secret);
    const hmac = crypto.createHmac('sha1', secretBuffer);
    hmac.update(timeBuffer);
    const hash = hmac.digest();

    const offset_val = hash[hash.length - 1] & 0x0f;
    const binary =
      ((hash[offset_val] & 0x7f) << 24) |
      ((hash[offset_val + 1] & 0xff) << 16) |
      ((hash[offset_val + 2] & 0xff) << 8) |
      (hash[offset_val + 3] & 0xff);

    const otp = binary % Math.pow(10, digits);
    return otp.toString().padStart(digits, '0');
  }

  private base32Encode(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;

    for (const byte of buffer) {
      value = (value << 8) | byte;
      bits += 8;

      while (bits >= 5) {
        result += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 31];
    }

    return result;
  }

  private base32Decode(str: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bytes: number[] = [];
    let bits = 0;
    let value = 0;

    for (const char of str.toUpperCase()) {
      const index = alphabet.indexOf(char);
      if (index === -1) continue;

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(bytes);
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private async generateQRCode(text: string): Promise<string> {
    // Simple QR code generation using a data URL approach
    // QR generation via qrcode library (npm install qrcode)
    // For now, return a placeholder that can be rendered by frontend QR libraries
    return `data:text/plain;base64,${Buffer.from(text).toString('base64')}`;
  }
}

// Singleton instance
export const mfaService = new MFAService();
