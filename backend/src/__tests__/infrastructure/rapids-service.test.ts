// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Module — Rapids Service Test
 *
 * Platform module.
 * @module __tests__/infrastructure/rapids-service.test
 */

/**
 * =============================================================================
 * RAPIDS SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the RAPIDSService in disabled/CPU-fallback mode.
 * Validates: bias analysis, graph analytics, stats, health.
 * =============================================================================
 */

import { describe, it, expect, vi } from 'vitest';

vi.stubEnv('RAPIDS_ENABLED', 'false');

describe('RAPIDSService (CPU fallback mode)', () => {
  let rapids: any;

  beforeAll(async () => {
    const mod = await import('../../services/gpu/RAPIDSService.js');
    rapids = mod.rapids;
  });

  it('should report as disabled', () => {
    expect(rapids.isEnabled()).toBe(false);
  });

  it('should run bias analysis in CPU fallback mode', async () => {
    const result = await rapids.analyzeBias({
      dataset: {
        columns: { age: 'int64', gender: 'string', outcome: 'bool' },
        rows: [
          { age: 30, gender: 'M', outcome: true },
          { age: 25, gender: 'F', outcome: true },
          { age: 45, gender: 'M', outcome: false },
          { age: 35, gender: 'F', outcome: false },
          { age: 28, gender: 'M', outcome: true },
          { age: 32, gender: 'F', outcome: true },
        ],
      },
      protectedAttributes: ['gender'],
      outcomeColumn: 'outcome',
      positiveOutcomeValue: true,
    });

    expect(result).toBeDefined();
    expect(result.analysisId).toBeTruthy();
    expect(result.accelerator).toBe('cpu');
    expect(typeof result.overallFairnessScore).toBe('number');
    expect(result.overallFairnessScore).toBeGreaterThanOrEqual(0);
    expect(result.overallFairnessScore).toBeLessThanOrEqual(100);
    expect(result.disparateImpact.length).toBeGreaterThanOrEqual(1);
    expect(result.statisticalParity.length).toBeGreaterThanOrEqual(1);
  });

  it('should track stats', () => {
    const stats = rapids.getStats();
    expect(stats.enabled).toBe(false);
    expect(stats.mode).toBe('cpu');
    expect(typeof stats.biasAnalyses).toBe('number');
    expect(typeof stats.graphAnalyses).toBe('number');
    expect(typeof stats.totalCpuTimeMs).toBe('number');
  });

  it('should report health in CPU mode', async () => {
    const health = await rapids.checkHealth();
    expect(health.enabled).toBe(false);
    expect(health.mode).toBe('cpu');
  });
});
