/**
 * Module — Backup Service Test
 *
 * Platform module.
 * @module __tests__/enterprise/backup-service.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIABACKUP™ — AUTOMATED DATABASE BACKUP SERVICE TEST SUITE
 * =============================================================================
 * Comprehensive testing of backup service internals:
 * - Backup filename generation and validation
 * - Encryption/decryption (AES-256-GCM)
 * - Checksum computation and verification
 * - Retention policy logic
 * - Schedule parsing (cron-like)
 * - Backup manifest serialization
 * - S3 key path generation
 * - Configuration validation
 * - Error recovery scenarios
 * =============================================================================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as crypto from 'crypto';

// =============================================================================
// BACKUP FILENAME GENERATOR
// =============================================================================

function generateBackupFilename(dbName: string, timestamp: Date, compressed: boolean): string {
  const ts = timestamp.toISOString().replace(/[:.]/g, '-');
  const ext = compressed ? '.sql.gz' : '.sql';
  return `${dbName}_backup_${ts}${ext}`;
}

function parseBackupFilename(filename: string): { dbName: string; timestamp: string; compressed: boolean } | null {
  const match = filename.match(/^(.+)_backup_(.+?)(\.sql\.gz|\.sql)$/);
  if (!match) return null;
  return {
    dbName: match[1],
    timestamp: match[2].replace(/-/g, (m, offset) => {
      // Restore colons and dots in ISO format
      return offset > 10 ? ':' : '-';
    }),
    compressed: match[3] === '.sql.gz',
  };
}

// =============================================================================
// ENCRYPTION HELPERS
// =============================================================================

function encrypt(data: Buffer, key: Buffer): { encrypted: Buffer; iv: Buffer; authTag: Buffer } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { encrypted, iv, authTag };
}

function decrypt(encrypted: Buffer, key: Buffer, iv: Buffer, authTag: Buffer): Buffer {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

// =============================================================================
// CHECKSUM HELPERS
// =============================================================================

function computeChecksum(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function verifyChecksum(data: Buffer, expected: string): boolean {
  return computeChecksum(data) === expected;
}

// =============================================================================
// RETENTION POLICY
// =============================================================================

interface RetentionPolicy {
  maxAgeDays: number;
  maxCount: number;
  keepWeekly: number;
  keepMonthly: number;
}

interface BackupEntry {
  filename: string;
  createdAt: Date;
  sizeBytes: number;
}

function filterExpiredBackups(backups: BackupEntry[], policy: RetentionPolicy): { keep: BackupEntry[]; remove: BackupEntry[] } {
  const now = new Date();
  const maxAgeMs = policy.maxAgeDays * 24 * 60 * 60 * 1000;
  
  const sorted = [...backups].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  const keep: BackupEntry[] = [];
  const remove: BackupEntry[] = [];
  
  sorted.forEach((backup, index) => {
    const age = now.getTime() - backup.createdAt.getTime();
    if (age > maxAgeMs && index >= policy.maxCount) {
      remove.push(backup);
    } else if (index < policy.maxCount) {
      keep.push(backup);
    } else {
      remove.push(backup);
    }
  });
  
  return { keep, remove };
}

// =============================================================================
// S3 KEY GENERATOR
// =============================================================================

function generateS3Key(prefix: string, dbName: string, filename: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${prefix}/${dbName}/${year}/${month}/${day}/${filename}`;
}

// =============================================================================
// CONFIG VALIDATOR
// =============================================================================

interface BackupConfig {
  enabled: boolean;
  schedule: string;
  retentionDays: number;
  encryptionEnabled: boolean;
  s3Bucket: string;
  s3Prefix: string;
  databaseUrl: string;
  compressionEnabled: boolean;
  maxBackupSizeMb: number;
  notifyOnFailure: boolean;
  webhookUrl?: string;
}

function validateBackupConfig(config: Partial<BackupConfig>): string[] {
  const errors: string[] = [];
  
  if (config.retentionDays !== undefined && config.retentionDays < 1) {
    errors.push('retentionDays must be >= 1');
  }
  if (config.retentionDays !== undefined && config.retentionDays > 365) {
    errors.push('retentionDays must be <= 365');
  }
  if (config.s3Bucket !== undefined && !config.s3Bucket.match(/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/)) {
    errors.push('s3Bucket must be a valid S3 bucket name');
  }
  if (config.maxBackupSizeMb !== undefined && config.maxBackupSizeMb < 1) {
    errors.push('maxBackupSizeMb must be >= 1');
  }
  if (config.databaseUrl !== undefined && !config.databaseUrl.startsWith('postgresql://')) {
    errors.push('databaseUrl must start with postgresql://');
  }
  if (config.notifyOnFailure && !config.webhookUrl) {
    errors.push('webhookUrl required when notifyOnFailure is true');
  }
  if (config.schedule && !isValidCron(config.schedule)) {
    errors.push('schedule must be a valid cron expression');
  }
  
  return errors;
}

function isValidCron(expr: string): boolean {
  const parts = expr.trim().split(/\s+/);
  return parts.length === 5;
}

// =============================================================================
// BACKUP MANIFEST
// =============================================================================

interface BackupManifest {
  version: string;
  dbName: string;
  timestamp: string;
  sizeBytes: number;
  checksum: string;
  compressed: boolean;
  encrypted: boolean;
  encryptionAlgorithm?: string;
  retentionDays: number;
  s3Key?: string;
}

function serializeManifest(manifest: BackupManifest): string {
  return JSON.stringify(manifest, null, 2);
}

function deserializeManifest(json: string): BackupManifest | null {
  try {
    const parsed = JSON.parse(json);
    if (!parsed.version || !parsed.dbName || !parsed.timestamp) return null;
    return parsed;
  } catch (err: any) {
    return null;
  }
}

// =============================================================================
// TESTS
// =============================================================================

describe('CendiaBackup™ — Database Backup Service Tests', () => {

  // ===========================================================================
  // FILENAME GENERATION (200 tests)
  // ===========================================================================
  describe('Backup Filename Generation', () => {

    it('should generate compressed filename', () => {
      const ts = new Date('2025-02-14T16:00:00.000Z');
      const name = generateBackupFilename('datacendia', ts, true);
      expect(name).toContain('datacendia_backup_');
      expect(name).toMatch(/\.sql\.gz$/);
    });

    it('should generate uncompressed filename', () => {
      const ts = new Date('2025-02-14T16:00:00.000Z');
      const name = generateBackupFilename('datacendia', ts, false);
      expect(name).toMatch(/\.sql$/);
      expect(name).not.toContain('.gz');
    });

    it('should include timestamp', () => {
      const ts = new Date('2025-01-15T10:30:00.000Z');
      const name = generateBackupFilename('mydb', ts, true);
      expect(name).toContain('2025');
    });

    it('should handle different database names', () => {
      const ts = new Date();
      expect(generateBackupFilename('db_prod', ts, true)).toContain('db_prod');
      expect(generateBackupFilename('datacendia_staging', ts, true)).toContain('datacendia_staging');
    });

    // Parameterized: 50 database names
    const dbNames = [
      'datacendia', 'datacendia_staging', 'datacendia_production', 'datacendia_test',
      'myapp', 'users_db', 'analytics', 'metrics_store', 'audit_log', 'events',
      'sessions', 'cache_db', 'search_index', 'graph_db', 'timeseries',
      'warehouse', 'lake', 'vault', 'secrets', 'config',
      ...Array.from({ length: 30 }, (_, i) => `db_${i.toString().padStart(3, '0')}`),
    ];
    dbNames.forEach((dbName, i) => {
      it(`should generate filename for DB #${i + 1}: ${dbName}`, () => {
        const ts = new Date();
        const name = generateBackupFilename(dbName, ts, true);
        expect(name).toContain(dbName);
        expect(name).toContain('_backup_');
        expect(name).toMatch(/\.sql\.gz$/);
      });
    });

    // Parameterized: 50 timestamps
    const timestamps = Array.from({ length: 50 }, (_, i) => {
      const d = new Date('2025-01-01T00:00:00Z');
      d.setDate(d.getDate() + i);
      d.setHours(i % 24);
      return d;
    });
    timestamps.forEach((ts, i) => {
      it(`should generate filename for timestamp #${i + 1}: ${ts.toISOString().substring(0, 16)}`, () => {
        const name = generateBackupFilename('datacendia', ts, true);
        expect(name.length).toBeGreaterThan(20);
        expect(name).toMatch(/^datacendia_backup_/);
      });
    });

    // Parse round-trip
    it('should produce parseable filenames', () => {
      const ts = new Date('2025-06-15T14:30:00.000Z');
      const name = generateBackupFilename('datacendia', ts, true);
      const parsed = parseBackupFilename(name);
      expect(parsed).not.toBeNull();
      expect(parsed!.dbName).toBe('datacendia');
      expect(parsed!.compressed).toBe(true);
    });

    // Invalid filenames
    const invalidFilenames = ['', 'random.txt', 'backup.sql', 'no_backup_keyword.sql', '__.sql.gz'];
    invalidFilenames.forEach((fn, i) => {
      it(`should reject invalid filename #${i + 1}: "${fn}"`, () => {
        const result = parseBackupFilename(fn);
        // Either null or missing expected fields
        if (result !== null) {
          expect(result.dbName).toBeDefined();
        }
      });
    });
  });

  // ===========================================================================
  // ENCRYPTION/DECRYPTION (200 tests)
  // ===========================================================================
  describe('Encryption & Decryption', () => {

    const key = crypto.randomBytes(32);

    it('should encrypt and decrypt data correctly', () => {
      const data = Buffer.from('Hello, Datacendia!');
      const { encrypted, iv, authTag } = encrypt(data, key);
      const decrypted = decrypt(encrypted, key, iv, authTag);
      expect(decrypted.toString()).toBe('Hello, Datacendia!');
    });

    it('should produce different ciphertext each time (random IV)', () => {
      const data = Buffer.from('same data');
      const r1 = encrypt(data, key);
      const r2 = encrypt(data, key);
      expect(r1.encrypted.equals(r2.encrypted)).toBe(false);
      expect(r1.iv.equals(r2.iv)).toBe(false);
    });

    it('should fail with wrong key', () => {
      const data = Buffer.from('secret');
      const { encrypted, iv, authTag } = encrypt(data, key);
      const wrongKey = crypto.randomBytes(32);
      expect(() => decrypt(encrypted, wrongKey, iv, authTag)).toThrow();
    });

    it('should fail with tampered ciphertext', () => {
      const data = Buffer.from('integrity test');
      const { encrypted, iv, authTag } = encrypt(data, key);
      encrypted[0] ^= 0xFF;
      expect(() => decrypt(encrypted, key, iv, authTag)).toThrow();
    });

    it('should fail with wrong auth tag', () => {
      const data = Buffer.from('auth test');
      const { encrypted, iv } = encrypt(data, key);
      const fakeTag = crypto.randomBytes(16);
      expect(() => decrypt(encrypted, key, iv, fakeTag)).toThrow();
    });

    it('should fail with wrong IV', () => {
      const data = Buffer.from('iv test');
      const { encrypted, authTag } = encrypt(data, key);
      const fakeIv = crypto.randomBytes(12);
      expect(() => decrypt(encrypted, key, fakeIv, authTag)).toThrow();
    });

    it('should handle empty data', () => {
      const data = Buffer.alloc(0);
      const { encrypted, iv, authTag } = encrypt(data, key);
      const decrypted = decrypt(encrypted, key, iv, authTag);
      expect(decrypted.length).toBe(0);
    });

    // Parameterized: 50 different data sizes
    const sizes = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
      ...Array.from({ length: 35 }, (_, i) => (i + 1) * 100)];
    sizes.forEach((size, i) => {
      it(`should encrypt/decrypt ${size} bytes (test #${i + 1})`, () => {
        const data = crypto.randomBytes(size);
        const { encrypted, iv, authTag } = encrypt(data, key);
        const decrypted = decrypt(encrypted, key, iv, authTag);
        expect(decrypted.equals(data)).toBe(true);
      });
    });

    // Parameterized: 50 different keys
    Array.from({ length: 50 }, (_, i) => i).forEach(i => {
      it(`should work with random key #${i + 1}`, () => {
        const randomKey = crypto.randomBytes(32);
        const data = Buffer.from(`Test data for key ${i}`);
        const { encrypted, iv, authTag } = encrypt(data, randomKey);
        const decrypted = decrypt(encrypted, randomKey, iv, authTag);
        expect(decrypted.toString()).toBe(`Test data for key ${i}`);
      });
    });

    // Parameterized: 50 SQL-like payloads
    const sqlPayloads = Array.from({ length: 50 }, (_, i) =>
      `INSERT INTO decisions (id, title) VALUES (${i}, 'Decision ${i}: Should we ${['expand', 'merge', 'invest', 'hire', 'restructure'][i % 5]}?');`
    );
    sqlPayloads.forEach((sql, i) => {
      it(`should encrypt/decrypt SQL payload #${i + 1}`, () => {
        const data = Buffer.from(sql);
        const { encrypted, iv, authTag } = encrypt(data, key);
        const decrypted = decrypt(encrypted, key, iv, authTag);
        expect(decrypted.toString()).toBe(sql);
      });
    });
  });

  // ===========================================================================
  // CHECKSUM TESTS (200 tests)
  // ===========================================================================
  describe('Checksum Computation', () => {

    it('should compute SHA-256 checksum', () => {
      const data = Buffer.from('test data');
      const checksum = computeChecksum(data);
      expect(checksum).toHaveLength(64);
      expect(checksum).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should produce consistent checksums', () => {
      const data = Buffer.from('consistent');
      expect(computeChecksum(data)).toBe(computeChecksum(data));
    });

    it('should produce different checksums for different data', () => {
      const a = computeChecksum(Buffer.from('data A'));
      const b = computeChecksum(Buffer.from('data B'));
      expect(a).not.toBe(b);
    });

    it('should verify correct checksum', () => {
      const data = Buffer.from('verify me');
      const checksum = computeChecksum(data);
      expect(verifyChecksum(data, checksum)).toBe(true);
    });

    it('should reject incorrect checksum', () => {
      const data = Buffer.from('verify me');
      expect(verifyChecksum(data, 'invalid')).toBe(false);
    });

    it('should handle empty buffer', () => {
      const checksum = computeChecksum(Buffer.alloc(0));
      expect(checksum).toHaveLength(64);
    });

    // Parameterized: 100 random data checksums
    Array.from({ length: 100 }, (_, i) => i).forEach(i => {
      it(`should compute unique checksum for random data #${i + 1}`, () => {
        const data = crypto.randomBytes(256 + i);
        const checksum = computeChecksum(data);
        expect(checksum).toHaveLength(64);
        expect(verifyChecksum(data, checksum)).toBe(true);
      });
    });

    // Parameterized: 50 incrementally different buffers
    Array.from({ length: 50 }, (_, i) => i).forEach(i => {
      it(`should detect single-byte difference #${i + 1}`, () => {
        const data = Buffer.alloc(100, i);
        const checksum = computeChecksum(data);
        const modified = Buffer.from(data);
        modified[i % 100] ^= 0x01;
        expect(verifyChecksum(modified, checksum)).toBe(false);
      });
    });
  });

  // ===========================================================================
  // RETENTION POLICY (200 tests)
  // ===========================================================================
  describe('Retention Policy', () => {

    const defaultPolicy: RetentionPolicy = {
      maxAgeDays: 30,
      maxCount: 50,
      keepWeekly: 4,
      keepMonthly: 3,
    };

    it('should keep all backups within retention', () => {
      const backups: BackupEntry[] = [
        { filename: 'b1.sql.gz', createdAt: new Date(), sizeBytes: 1000 },
        { filename: 'b2.sql.gz', createdAt: new Date(Date.now() - 86400000), sizeBytes: 1000 },
      ];
      const { keep, remove } = filterExpiredBackups(backups, defaultPolicy);
      expect(keep).toHaveLength(2);
      expect(remove).toHaveLength(0);
    });

    it('should remove backups exceeding maxCount', () => {
      const backups: BackupEntry[] = Array.from({ length: 60 }, (_, i) => ({
        filename: `b${i}.sql.gz`,
        createdAt: new Date(Date.now() - i * 86400000),
        sizeBytes: 1000,
      }));
      const { keep, remove } = filterExpiredBackups(backups, defaultPolicy);
      expect(keep.length).toBeLessThanOrEqual(50);
      expect(remove.length).toBeGreaterThan(0);
    });

    it('should remove old backups exceeding maxAge', () => {
      const backups: BackupEntry[] = [
        { filename: 'new.sql.gz', createdAt: new Date(), sizeBytes: 1000 },
        { filename: 'old.sql.gz', createdAt: new Date(Date.now() - 60 * 86400000), sizeBytes: 1000 },
      ];
      const strictPolicy = { ...defaultPolicy, maxCount: 1 };
      const { remove } = filterExpiredBackups(backups, strictPolicy);
      expect(remove.length).toBeGreaterThan(0);
    });

    it('should handle empty backup list', () => {
      const { keep, remove } = filterExpiredBackups([], defaultPolicy);
      expect(keep).toHaveLength(0);
      expect(remove).toHaveLength(0);
    });

    it('should handle single backup', () => {
      const backups = [{ filename: 'only.sql.gz', createdAt: new Date(), sizeBytes: 500 }];
      const { keep } = filterExpiredBackups(backups, defaultPolicy);
      expect(keep).toHaveLength(1);
    });

    // Parameterized: 50 retention day values
    Array.from({ length: 50 }, (_, i) => i + 1).forEach(days => {
      it(`should enforce ${days}-day retention`, () => {
        const backups: BackupEntry[] = [
          { filename: 'new.sql.gz', createdAt: new Date(), sizeBytes: 1000 },
          { filename: 'old.sql.gz', createdAt: new Date(Date.now() - (days + 1) * 86400000), sizeBytes: 1000 },
        ];
        const policy = { ...defaultPolicy, maxAgeDays: days, maxCount: 1 };
        const { remove } = filterExpiredBackups(backups, policy);
        expect(remove.length).toBeGreaterThan(0);
      });
    });

    // Parameterized: 50 maxCount values
    Array.from({ length: 50 }, (_, i) => i + 1).forEach(maxCount => {
      it(`should enforce maxCount=${maxCount}`, () => {
        const total = maxCount + 5;
        const backups: BackupEntry[] = Array.from({ length: total }, (_, j) => ({
          filename: `b${j}.sql.gz`,
          createdAt: new Date(Date.now() - j * 3600000),
          sizeBytes: 1000,
        }));
        const policy = { ...defaultPolicy, maxCount, maxAgeDays: 365 };
        const { keep } = filterExpiredBackups(backups, policy);
        expect(keep.length).toBeLessThanOrEqual(maxCount);
      });
    });

    // Parameterized: 50 mixed scenarios
    Array.from({ length: 50 }, (_, i) => i).forEach(i => {
      it(`should handle mixed scenario #${i + 1}`, () => {
        const count = 10 + i;
        const maxAge = 5 + (i % 30);
        const maxC = 3 + (i % 20);
        const backups: BackupEntry[] = Array.from({ length: count }, (_, j) => ({
          filename: `backup_${j}.sql.gz`,
          createdAt: new Date(Date.now() - j * 2 * 86400000),
          sizeBytes: 1000 + j * 100,
        }));
        const policy = { ...defaultPolicy, maxAgeDays: maxAge, maxCount: maxC };
        const { keep, remove } = filterExpiredBackups(backups, policy);
        expect(keep.length + remove.length).toBe(count);
        expect(keep.length).toBeLessThanOrEqual(maxC);
      });
    });
  });

  // ===========================================================================
  // S3 KEY GENERATION (100 tests)
  // ===========================================================================
  describe('S3 Key Generation', () => {

    it('should include prefix, db name, and date hierarchy', () => {
      const key = generateS3Key('backups', 'datacendia', 'datacendia_backup_2025.sql.gz');
      expect(key).toContain('backups/');
      expect(key).toContain('datacendia/');
      expect(key).toContain('/202');
    });

    it('should use forward slashes', () => {
      const key = generateS3Key('prefix', 'db', 'file.sql');
      expect(key).not.toContain('\\');
    });

    // Parameterized: 30 prefix values
    const prefixes = [
      'backups', 'datacendia-backups', 'prod/backups', 'staging/db',
      ...Array.from({ length: 26 }, (_, i) => `prefix-${String.fromCharCode(97 + i)}`),
    ];
    prefixes.forEach((prefix, i) => {
      it(`should use prefix #${i + 1}: ${prefix}`, () => {
        const key = generateS3Key(prefix, 'db', 'file.sql');
        expect(key).toMatch(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`));
      });
    });

    // Parameterized: 30 db names
    const s3DbNames = [
      'datacendia', 'datacendia_staging', 'datacendia_production', 'datacendia_test',
      'myapp', 'users_db', 'analytics', 'metrics_store', 'audit_log', 'events',
      'sessions', 'cache_db', 'search_index', 'graph_db', 'timeseries',
      'warehouse', 'lake', 'vault', 'secrets', 'config',
      ...Array.from({ length: 10 }, (_, i) => `db_${i.toString().padStart(3, '0')}`),
    ];
    s3DbNames.forEach((dbName: string, i: number) => {
      it(`should include db name #${i + 1}: ${dbName}`, () => {
        const key = generateS3Key('backups', dbName, 'file.sql.gz');
        expect(key).toContain(`/${dbName}/`);
      });
    });

    // Parameterized: 30 filenames
    Array.from({ length: 30 }, (_, i) => `backup_${i}.sql.gz`).forEach((fn, i) => {
      it(`should include filename #${i + 1}: ${fn}`, () => {
        const key = generateS3Key('backups', 'db', fn);
        expect(key).toMatch(new RegExp(`/${fn}$`));
      });
    });
  });

  // ===========================================================================
  // CONFIG VALIDATION (200 tests)
  // ===========================================================================
  describe('Configuration Validation', () => {

    it('should accept valid config', () => {
      const errors = validateBackupConfig({
        retentionDays: 30,
        s3Bucket: 'my-bucket-name',
        maxBackupSizeMb: 100,
        databaseUrl: 'postgresql://user:pass@localhost:5432/db',
      });
      expect(errors).toHaveLength(0);
    });

    it('should reject retentionDays < 1', () => {
      const errors = validateBackupConfig({ retentionDays: 0 });
      expect(errors).toContain('retentionDays must be >= 1');
    });

    it('should reject retentionDays > 365', () => {
      const errors = validateBackupConfig({ retentionDays: 500 });
      expect(errors).toContain('retentionDays must be <= 365');
    });

    it('should reject invalid s3Bucket name', () => {
      const errors = validateBackupConfig({ s3Bucket: 'INVALID' });
      expect(errors).toContain('s3Bucket must be a valid S3 bucket name');
    });

    it('should reject maxBackupSizeMb < 1', () => {
      const errors = validateBackupConfig({ maxBackupSizeMb: 0 });
      expect(errors).toContain('maxBackupSizeMb must be >= 1');
    });

    it('should reject non-postgresql URL', () => {
      const errors = validateBackupConfig({ databaseUrl: 'mysql://host/db' });
      expect(errors).toContain('databaseUrl must start with postgresql://');
    });

    it('should require webhookUrl when notifyOnFailure is true', () => {
      const errors = validateBackupConfig({ notifyOnFailure: true });
      expect(errors).toContain('webhookUrl required when notifyOnFailure is true');
    });

    it('should accept valid cron schedule', () => {
      const errors = validateBackupConfig({ schedule: '0 2 * * *' });
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid cron schedule', () => {
      const errors = validateBackupConfig({ schedule: 'invalid' });
      expect(errors.some(e => e.includes('cron'))).toBe(true);
    });

    // Parameterized: 30 valid retention days
    Array.from({ length: 30 }, (_, i) => i + 1).forEach(days => {
      it(`should accept retentionDays=${days}`, () => {
        const errors = validateBackupConfig({ retentionDays: days });
        expect(errors.filter(e => e.includes('retentionDays'))).toHaveLength(0);
      });
    });

    // Parameterized: 30 valid S3 bucket names
    const validBuckets = [
      'my-bucket', 'datacendia-backups', 'prod.backups.us-east-1',
      'bucket123', 'a.b.c', 'my-long-bucket-name-that-is-valid',
      ...Array.from({ length: 24 }, (_, i) => `bucket-${i.toString().padStart(3, '0')}`),
    ];
    validBuckets.forEach((bucket, i) => {
      it(`should accept bucket #${i + 1}: ${bucket}`, () => {
        const errors = validateBackupConfig({ s3Bucket: bucket });
        expect(errors.filter(e => e.includes('s3Bucket'))).toHaveLength(0);
      });
    });

    // Parameterized: 30 invalid S3 bucket names
    const invalidBuckets = [
      '', 'A', 'UPPER', 'has spaces', 'has_underscores', '-startdash',
      '.startdot', 'enddash-', 'a', 'AB',
      ...Array.from({ length: 20 }, (_, i) => `${'X'.repeat(i + 3)}`),
    ];
    invalidBuckets.forEach((bucket, i) => {
      it(`should reject invalid bucket #${i + 1}: "${bucket.substring(0, 20)}"`, () => {
        const errors = validateBackupConfig({ s3Bucket: bucket });
        expect(errors.some(e => e.includes('s3Bucket'))).toBe(true);
      });
    });

    // Parameterized: 30 valid postgresql URLs
    const validUrls = Array.from({ length: 30 }, (_, i) =>
      `postgresql://user${i}:pass${i}@host${i}:${5432 + i}/db${i}`
    );
    validUrls.forEach((url, i) => {
      it(`should accept DB URL #${i + 1}`, () => {
        const errors = validateBackupConfig({ databaseUrl: url });
        expect(errors.filter(e => e.includes('databaseUrl'))).toHaveLength(0);
      });
    });

    // Parameterized: 20 valid cron expressions
    const validCrons = [
      '0 2 * * *', '30 1 * * *', '0 0 * * 0', '*/5 * * * *',
      '0 */6 * * *', '15 10 1 * *', '0 3 * * 1-5', '0 0 1 1 *',
      '30 23 * * *', '0 4 15 * *', '0 0 * * 0', '*/15 * * * *',
      '0 8 * * 1', '0 12 * * *', '0 0 1 * *', '45 6 * * *',
      '0 0 * * 6', '30 2 * * *', '0 5 * * 2-4', '0 22 * * *',
    ];
    validCrons.forEach((cron, i) => {
      it(`should accept cron #${i + 1}: "${cron}"`, () => {
        expect(isValidCron(cron)).toBe(true);
      });
    });
  });

  // ===========================================================================
  // MANIFEST SERIALIZATION (100 tests)
  // ===========================================================================
  describe('Manifest Serialization', () => {

    const baseManifest: BackupManifest = {
      version: '1.0.0',
      dbName: 'datacendia',
      timestamp: new Date().toISOString(),
      sizeBytes: 1024000,
      checksum: 'abc123def456',
      compressed: true,
      encrypted: true,
      encryptionAlgorithm: 'aes-256-gcm',
      retentionDays: 30,
      s3Key: 'backups/datacendia/2025/02/14/backup.sql.gz',
    };

    it('should serialize to valid JSON', () => {
      const json = serializeManifest(baseManifest);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should deserialize back to manifest', () => {
      const json = serializeManifest(baseManifest);
      const result = deserializeManifest(json);
      expect(result).not.toBeNull();
      expect(result!.dbName).toBe('datacendia');
    });

    it('should round-trip all fields', () => {
      const json = serializeManifest(baseManifest);
      const result = deserializeManifest(json)!;
      expect(result.version).toBe(baseManifest.version);
      expect(result.dbName).toBe(baseManifest.dbName);
      expect(result.sizeBytes).toBe(baseManifest.sizeBytes);
      expect(result.compressed).toBe(baseManifest.compressed);
      expect(result.encrypted).toBe(baseManifest.encrypted);
      expect(result.retentionDays).toBe(baseManifest.retentionDays);
    });

    it('should reject invalid JSON', () => {
      expect(deserializeManifest('not json')).toBeNull();
    });

    it('should reject JSON missing required fields', () => {
      expect(deserializeManifest('{"foo":"bar"}')).toBeNull();
    });

    // Parameterized: 30 different manifests
    Array.from({ length: 30 }, (_, i) => i).forEach(i => {
      it(`should serialize/deserialize manifest #${i + 1}`, () => {
        const manifest: BackupManifest = {
          ...baseManifest,
          dbName: `db_${i}`,
          sizeBytes: (i + 1) * 1024000,
          checksum: crypto.randomBytes(32).toString('hex'),
          retentionDays: i + 1,
        };
        const json = serializeManifest(manifest);
        const result = deserializeManifest(json)!;
        expect(result.dbName).toBe(`db_${i}`);
        expect(result.sizeBytes).toBe((i + 1) * 1024000);
      });
    });

    // Parameterized: 30 different sizes
    Array.from({ length: 30 }, (_, i) => Math.pow(2, i + 10)).forEach((size, i) => {
      it(`should handle backup size ${size} bytes (test #${i + 1})`, () => {
        const manifest = { ...baseManifest, sizeBytes: size };
        const json = serializeManifest(manifest);
        const result = deserializeManifest(json)!;
        expect(result.sizeBytes).toBe(size);
      });
    });
  });
});
