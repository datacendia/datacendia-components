/**
 * Pillar Services Tests
 * Tests for EthicsService, FlowService, GuardService, HealthService, LineageService
 * @module __tests__/services/PillarServices.test
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
    ethical_principles: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    ethics_principles: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    ethics_reviews: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    bias_checks: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    guard_policies: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    guard_violations: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    security_threats: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    security_policies: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    lineage_records: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    lineage_entities: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    lineage_relationships: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    flow_definitions: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    flow_instances: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    health_checks: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}), count: vi.fn().mockResolvedValue(0) },
    health_incidents: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));

// ============================================================================
// EthicsService
// ============================================================================
const { ethicsService } = await import('../../services/pillars/EthicsService.js');

describe('EthicsService', () => {
  it('should export a singleton instance', () => {
    expect(ethicsService).toBeDefined();
  });

  // The behavioral tests below replace pure typeof checks.
  // Each one calls the real method and verifies the return shape.

  // FAILS IF: getPrinciples throws, or returns non-array, or prisma.ethics_principles.findMany is not mocked
  it('should return principles array for an organization', async () => {
    const principles = await ethicsService.getPrinciples('org-1');
    expect(Array.isArray(principles)).toBe(true);
  });

  // FAILS IF: getReviews throws, or returns non-array, or prisma.ethics_reviews.findMany is not mocked
  it('should return reviews array for an organization', async () => {
    const reviews = await ethicsService.getReviews('org-1');
    expect(Array.isArray(reviews)).toBe(true);
  });

  // FAILS IF: healthCheck throws (missing prisma.count mock), or returns object without 'status' property
  it('should return health status with status field', async () => {
    const health = await ethicsService.healthCheck();
    expect(health).toBeDefined();
    expect(health).toHaveProperty('status');
    expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
  });
});

// ============================================================================
// FlowService
// ============================================================================
const { flowService } = await import('../../services/pillars/FlowService.js');

describe('FlowService', () => {
  it('should export a singleton instance', () => {
    expect(flowService).toBeDefined();
  });

  // FAILS IF: healthCheck throws (missing prisma mock), or returns wrong shape
  it('should return health status with status field', async () => {
    const health = await flowService.healthCheck();
    expect(health).toBeDefined();
    expect(health).toHaveProperty('status');
    expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
  });
});

// ============================================================================
// GuardService
// ============================================================================
const { guardService } = await import('../../services/pillars/GuardService.js');

describe('GuardService', () => {
  it('should export a singleton instance', () => {
    expect(guardService).toBeDefined();
  });

  // FAILS IF: healthCheck throws (prisma.security_threats.count not mocked), or status not in allowed set
  it('should return health status with status field', async () => {
    const health = await guardService.healthCheck();
    expect(health).toBeDefined();
    expect(health).toHaveProperty('status');
    expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
  });
});

// ============================================================================
// HealthService
// ============================================================================
const { healthService } = await import('../../services/pillars/HealthService.js');

describe('HealthService', () => {
  it('should export a singleton instance', () => {
    expect(healthService).toBeDefined();
  });

  // FAILS IF: healthCheck throws (prisma.health_incidents.count not mocked), or status not in allowed set
  it('should return health status with status field', async () => {
    const health = await healthService.healthCheck();
    expect(health).toBeDefined();
    expect(health).toHaveProperty('status');
    expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
  });
});

// ============================================================================
// LineageService
// ============================================================================
const { lineageService } = await import('../../services/pillars/LineageService.js');

describe('LineageService', () => {
  it('should export a singleton instance', () => {
    expect(lineageService).toBeDefined();
  });

  // FAILS IF: healthCheck throws (prisma.lineage_entities.count not mocked), or status not in allowed set
  it('should return health status with status field', async () => {
    const health = await lineageService.healthCheck();
    expect(health).toBeDefined();
    expect(health).toHaveProperty('status');
    expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
  });
});
