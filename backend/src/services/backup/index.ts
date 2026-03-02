/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/backup/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CendiaBackup™ — Automated Database Backup Service
// Barrel Export
// =============================================================================

export { databaseBackupService } from './DatabaseBackupService.js';

export type {
  BackupConfig,
  BackupManifest,
  BackupStats,
} from './DatabaseBackupService.js';
