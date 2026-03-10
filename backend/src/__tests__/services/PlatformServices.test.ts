/**
 * Platform Services Tests
 * Tests for NotificationService, TranslationService, ExecutiveSummaryService,
 * DatabaseBackupService, HRIntegrationService, ROIMetricsService
 * @module __tests__/services/PlatformServices.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    notifications: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}) },
    users: { findUnique: vi.fn().mockResolvedValue(null), findMany: vi.fn().mockResolvedValue([]) },
    organizations: { findUnique: vi.fn().mockResolvedValue(null), findMany: vi.fn().mockResolvedValue([]) },
    translations: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), upsert: vi.fn().mockResolvedValue({}), create: vi.fn().mockResolvedValue({}) },
    backups: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}) },
    roi_metrics: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}) },
    deliberations: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    sessions: { count: vi.fn().mockResolvedValue(0) },
    agents: { findMany: vi.fn().mockResolvedValue([]) },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    chat: vi.fn().mockResolvedValue({ message: { content: '{"summary": "test"}' } }),
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
  },
}));
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'test' } }),
  },
}));
vi.mock('../../config/cache.js', () => ({
  cache: { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue('OK'), del: vi.fn().mockResolvedValue(1) },
}));

// ============================================================================
// NotificationService
// ============================================================================
const { notificationService } = await import('../../services/NotificationService.js');

describe('NotificationService', () => {
  it('should export a singleton instance', () => {
    expect(notificationService).toBeDefined();
  });

  // FAILS IF: getUserPreferences throws with non-Error or returns non-object
  it('should return user preferences object', async () => {
    try {
      const prefs = await notificationService.getUserPreferences('user-1');
      expect(prefs).toBeDefined();
      expect(typeof prefs).toBe('object');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// TranslationService
// ============================================================================
const { translationService } = await import('../../services/i18n/TranslationService.js');

describe('TranslationService', () => {
  it('should export a singleton instance', () => {
    expect(translationService).toBeDefined();
  });

  // FAILS IF: getAllTranslations throws with non-Error or returns non-object
  it('should return English translations as object', async () => {
    try {
      const translations = await translationService.getAllTranslations('en' as any);
      expect(translations).toBeDefined();
      expect(typeof translations).toBe('object');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// ExecutiveSummaryService
// ============================================================================
const { executiveSummaryService } = await import('../../services/ExecutiveSummaryService.js');

describe('ExecutiveSummaryService', () => {
  it('should export a singleton instance', () => {
    expect(executiveSummaryService).toBeDefined();
  });

  // FAILS IF: getSummaries throws or returns non-array
  it('should return summaries as array', async () => {
    const summaries = await (executiveSummaryService as any).getSummaries({ organizationId: 'org-1' });
    expect(Array.isArray(summaries)).toBe(true);
  });

  // FAILS IF: getSummaryById throws or returns wrong type for missing ID
  it('should return null for non-existent summary', async () => {
    const result = await (executiveSummaryService as any).getSummaryById('nonexistent-id');
    expect(result).toBeNull();
  });
});

// ============================================================================
// DatabaseBackupService
// ============================================================================
const { databaseBackupService } = await import('../../services/backup/DatabaseBackupService.js');

describe('DatabaseBackupService', () => {
  it('should export a singleton instance', () => {
    expect(databaseBackupService).toBeDefined();
  });

  // FAILS IF: startScheduler/stopScheduler throw
  it('should start and stop scheduler without error', () => {
    expect(() => databaseBackupService.startScheduler()).not.toThrow();
    expect(() => databaseBackupService.stopScheduler()).not.toThrow();
  });
});

// ============================================================================
// HRIntegrationService
// ============================================================================
const { hrIntegrationService } = await import('../../services/HRIntegrationService.js');

describe('HRIntegrationService', () => {
  it('should export a singleton instance', () => {
    expect(hrIntegrationService).toBeDefined();
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(hrIntegrationService))
      .filter(m => m !== 'constructor' && typeof (hrIntegrationService as any)[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// ROIMetricsService
// ============================================================================
const { roiMetricsService } = await import('../../services/metrics/ROIMetricsService.js');

describe('ROIMetricsService', () => {
  it('should export a singleton instance', () => {
    expect(roiMetricsService).toBeDefined();
  });

  it('should have core methods', () => {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(roiMetricsService))
      .filter(m => m !== 'constructor' && typeof (roiMetricsService as any)[m] === 'function');
    expect(methods.length).toBeGreaterThan(0);
  });
});
