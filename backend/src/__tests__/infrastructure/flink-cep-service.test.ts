// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Module — Flink Cep Service Test
 *
 * Platform module.
 * @module __tests__/infrastructure/flink-cep-service.test
 */

/**
 * =============================================================================
 * FLINK CEP SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the FlinkCEPService in embedded mode (FLINK_ENABLED=false).
 * Validates: rule management, event ingestion, pattern matching, alerts, stats.
 * =============================================================================
 */

import { describe, it, expect, vi } from 'vitest';

vi.stubEnv('FLINK_ENABLED', 'false');

describe('FlinkCEPService (embedded mode)', () => {
  let flinkCEP: any;

  beforeAll(async () => {
    const mod = await import('../../services/streaming/FlinkCEPService.js');
    flinkCEP = mod.flinkCEP;
  });

  it('should report as disabled', () => {
    expect(flinkCEP.isEnabled()).toBe(false);
  });

  it('should have built-in CEP rules', () => {
    const rules = flinkCEP.getRules();
    expect(rules.length).toBeGreaterThanOrEqual(1);
  });

  it('should register custom CEP rules', () => {
    const initialCount = flinkCEP.getRules().length;
    flinkCEP.addRule({
      id: 'test-rule',
      name: 'Test Rule',
      description: 'Test pattern',
      enabled: true,
      eventTypes: ['test.event'],
      windowSec: 60,
      threshold: 3,
      condition: { type: 'count_exceeds', count: 3 },
      action: { type: 'alert', severity: 'warning', message: 'Test alert' },
      complianceFrameworks: ['SOC2'],
      priority: 10,
    });

    expect(flinkCEP.getRules().length).toBe(initialCount + 1);
  });

  it('should ingest events without error', async () => {
    const alerts = await flinkCEP.ingestEvent({
      id: 'evt-1',
      type: 'test.event',
      source: 'unit-test',
      timestamp: new Date(),
      payload: { value: 42 },
    });
    expect(Array.isArray(alerts)).toBe(true);
  });

  it('should track stats', () => {
    const stats = flinkCEP.getStats();
    expect(typeof stats.enabled).toBe('boolean');
    expect(typeof stats.mode).toBe('string');
    expect(typeof stats.totalRules).toBe('number');
    expect(typeof stats.eventsProcessed).toBe('number');
    expect(typeof stats.alertsTriggered).toBe('number');
  });

  it('should report health in embedded mode', async () => {
    const health = await flinkCEP.checkHealth();
    expect(health.enabled).toBe(false);
    expect(health.mode).toBe('embedded');
  });
});
