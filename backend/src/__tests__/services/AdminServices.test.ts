/**
 * Admin Services Tests
 * Tests for SystemHealthService, TenantService, LicenseService, AdminSettingsService, UserManagementService
 * @module __tests__/services/AdminServices.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    organizations: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), delete: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    users: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), delete: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    licenses: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    audit_logs: { create: vi.fn().mockResolvedValue({}), findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    agents: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(5) },
    tenants: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(3) },
    system_alerts: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({ id: 'alert-1', severity: 'WARNING', service: 'test', message: 'Test', created_at: new Date(), acknowledged: false, resolved: false }), update: vi.fn().mockResolvedValue({}) },
    settings: { findMany: vi.fn().mockResolvedValue([]), findFirst: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), delete: vi.fn().mockResolvedValue({}) },
    $queryRaw: vi.fn().mockResolvedValue([{ '1': 1 }]),
    $transaction: vi.fn().mockImplementation((fn: any) => fn({
      organizations: { create: vi.fn().mockResolvedValue({ id: 'org-1' }), update: vi.fn().mockResolvedValue({}) },
      users: { create: vi.fn().mockResolvedValue({ id: 'user-1' }) },
    })),
  },
}));
vi.mock('../../config/index.js', () => ({
  config: { database: { url: 'postgresql://test' }, jwt: { secret: 'test-secret' } },
}));

// ============================================================================
// SystemHealthService
// ============================================================================
const { systemHealthService } = await import('../../services/admin/SystemHealthService.js');

describe('SystemHealthService', () => {
  it('should export a singleton instance', () => {
    expect(systemHealthService).toBeDefined();
  });

  it('should return system metrics', () => {
    const metrics = systemHealthService.getSystemMetrics();
    expect(metrics).toBeDefined();
    expect(metrics).toHaveProperty('cpu');
    expect(metrics).toHaveProperty('memory');
    expect(metrics.cpu).toHaveProperty('cores');
    expect(typeof metrics.memory.total).toBe('number');
  });

  it('should record API request', () => {
    expect(() => systemHealthService.recordApiRequest('/api/test', 200, 45)).not.toThrow();
  });

  it('should return API metrics', () => {
    const apiMetrics = systemHealthService.getApiMetrics();
    expect(apiMetrics).toBeDefined();
    expect(typeof apiMetrics.totalRequests24h).toBe('number');
  });

  it('should check all services', async () => {
    const services = await systemHealthService.checkAllServices();
    expect(Array.isArray(services)).toBe(true);
  });

  // FAILS IF: createAlert throws (prisma.system_alerts.create not mocked), or returns object without 'id'
  it('should create an alert with id and severity', async () => {
    const alert = await systemHealthService.createAlert('warning', 'test-service', 'Test alert');
    expect(alert).toBeDefined();
    expect(alert).toHaveProperty('id');
    expect(typeof alert.id).toBe('string');
    expect(alert).toHaveProperty('severity');
    expect(alert).toHaveProperty('message');
  });

  // FAILS IF: getActiveAlerts throws (prisma.system_alerts.findMany not mocked), or returns non-array
  it('should return active alerts as array', async () => {
    const alerts = await systemHealthService.getActiveAlerts();
    expect(Array.isArray(alerts)).toBe(true);
  });

  // FAILS IF: getDashboard throws (checkAllServices or getSystemMetrics fails), or missing overallStatus
  it('should return dashboard with overallStatus', async () => {
    const dashboard = await systemHealthService.getDashboard();
    expect(dashboard).toBeDefined();
    expect(dashboard).toHaveProperty('overallStatus');
    expect(['healthy', 'degraded', 'critical']).toContain(dashboard.overallStatus);
    expect(dashboard).toHaveProperty('services');
    expect(dashboard).toHaveProperty('system');
  });
});

// ============================================================================
// TenantService
// ============================================================================
const { tenantService } = await import('../../services/admin/TenantService.js');

describe('TenantService', () => {
  it('should export a singleton instance', () => {
    expect(tenantService).toBeDefined();
  });

  // FAILS IF: getTenant throws or returns non-null for missing ID
  it('should return null for non-existent tenant', async () => {
    const result = await tenantService.getTenant('nonexistent-id');
    expect(result).toBeNull();
  });

  // FAILS IF: listTenants throws or returns non-array
  it('should list tenants as array', async () => {
    const tenants = await tenantService.listTenants();
    expect(Array.isArray(tenants)).toBe(true);
  });

  // FAILS IF: getMetrics throws or returns non-object
  it('should return metrics object', async () => {
    const metrics = await tenantService.getMetrics();
    expect(metrics).toBeDefined();
    expect(typeof metrics).toBe('object');
  });
});

// ============================================================================
// LicenseService
// ============================================================================
const { licenseService } = await import('../../services/admin/LicenseService.js');

describe('LicenseService', () => {
  it('should export a singleton instance', () => {
    expect(licenseService).toBeDefined();
  });

  // FAILS IF: getLicense throws or returns non-null for missing ID
  it('should return null for non-existent license', async () => {
    const result = await licenseService.getLicense('nonexistent-lic');
    expect(result).toBeNull();
  });

  // FAILS IF: listLicenses throws or returns non-array
  it('should list licenses as array', async () => {
    const licenses = await licenseService.listLicenses();
    expect(Array.isArray(licenses)).toBe(true);
  });

  // FAILS IF: getMetrics throws or returns non-object
  it('should return license metrics', async () => {
    const metrics = await licenseService.getMetrics();
    expect(metrics).toBeDefined();
    expect(typeof metrics).toBe('object');
  });
});

// ============================================================================
// AdminSettingsService
// ============================================================================
const { adminSettingsService } = await import('../../services/admin/AdminSettingsService.js');

describe('AdminSettingsService', () => {
  it('should export a singleton instance', () => {
    expect(adminSettingsService).toBeDefined();
  });

  // FAILS IF: get returns truthy for non-existent key
  it('should return null/undefined for non-existent setting', async () => {
    const val = await adminSettingsService.get('nonexistent-key-xyz', 'org-1');
    expect(val == null).toBe(true);
  });

  // FAILS IF: getAll throws or returns non-array
  it('should return all settings as array', async () => {
    const all = await adminSettingsService.getAll('org-1');
    expect(Array.isArray(all)).toBe(true);
  });

  // FAILS IF: getByCategory throws or returns non-array
  it('should return settings by category', async () => {
    const cats = await adminSettingsService.getByCategory('general', 'org-1');
    expect(Array.isArray(cats)).toBe(true);
  });
});

// ============================================================================
// UserManagementService
// ============================================================================
const { userManagementService } = await import('../../services/admin/UserManagementService.js');

describe('UserManagementService', () => {
  it('should export a singleton instance', () => {
    expect(userManagementService).toBeDefined();
  });

  // FAILS IF: getUser throws or returns non-null for missing ID
  it('should return null for non-existent user', async () => {
    const user = await userManagementService.getUser('nonexistent-user');
    expect(user).toBeNull();
  });

  // FAILS IF: listUsers throws or returns non-array
  it('should list users as array', async () => {
    const users = await userManagementService.listUsers('tenant-1');
    expect(Array.isArray(users)).toBe(true);
  });

  // FAILS IF: listTeams throws or returns non-array
  it('should list teams as array', async () => {
    const teams = await userManagementService.listTeams('tenant-1');
    expect(Array.isArray(teams)).toBe(true);
  });

  // FAILS IF: listRoles throws or returns non-array
  it('should list roles as array', async () => {
    const roles = await userManagementService.listRoles('tenant-1');
    expect(Array.isArray(roles)).toBe(true);
  });

  // FAILS IF: listApiKeys throws or returns non-array
  it('should list API keys as array', async () => {
    const keys = await userManagementService.listApiKeys('tenant-1');
    expect(Array.isArray(keys)).toBe(true);
  });
});
