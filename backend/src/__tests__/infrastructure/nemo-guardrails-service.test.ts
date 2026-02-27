// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * NeMo GUARDRAILS ENGINE — UNIT TESTS
 * =============================================================================
 * Tests the NeMoGuardrailsEngine in hybrid/embedded mode.
 * Validates: rail management, pre-filter evaluation, health, stats.
 * =============================================================================
 */

import { describe, it, expect, vi } from 'vitest';

vi.stubEnv('NEMO_GUARDRAILS_ENABLED', 'true');
vi.stubEnv('NEMO_GUARDRAILS_MODE', 'embedded');

describe('NeMoGuardrailsEngine (embedded mode)', () => {
  let nemoGuardrails: any;

  beforeAll(async () => {
    const mod = await import('../../services/guardrails/NeMoGuardrailsEngine.js');
    nemoGuardrails = mod.nemoGuardrails;
  });

  it('should report as enabled', () => {
    expect(nemoGuardrails.isEnabled()).toBe(true);
  });

  it('should have default rails loaded', () => {
    const rails = nemoGuardrails.getRails();
    expect(rails.length).toBeGreaterThanOrEqual(1);
  });

  it('should add custom rails', () => {
    const initialCount = nemoGuardrails.getRails().length;
    nemoGuardrails.addRail({
      id: 'custom-test-rail',
      name: 'Custom Test Rail',
      type: 'input',
      enabled: true,
      description: 'Test rail',
      severity: 'medium',
      action: 'block',
      regexPreFilter: [/test-block-pattern/i],
    });

    expect(nemoGuardrails.getRails().length).toBe(initialCount + 1);
    expect(nemoGuardrails.getRail('custom-test-rail')).toBeDefined();
  });

  it('should remove custom rails', () => {
    nemoGuardrails.addRail({
      id: 'removable-rail',
      name: 'Removable',
      type: 'output',
      enabled: true,
      description: 'Will be removed',
      severity: 'low',
      action: 'flag',
    });

    const before = nemoGuardrails.getRails().length;
    nemoGuardrails.removeRail('removable-rail');
    expect(nemoGuardrails.getRails().length).toBe(before - 1);
  });

  it('should enable/disable rails', () => {
    const rails = nemoGuardrails.getRails();
    if (rails.length > 0) {
      const firstId = rails[0].id;
      nemoGuardrails.setRailEnabled(firstId, false);
      expect(nemoGuardrails.getRail(firstId).enabled).toBe(false);
      nemoGuardrails.setRailEnabled(firstId, true);
      expect(nemoGuardrails.getRail(firstId).enabled).toBe(true);
    }
  });

  it('should evaluate input without errors', async () => {
    const result = await nemoGuardrails.evaluateInput('What is the weather today?');
    expect(result).toBeDefined();
    expect(result.overallVerdict).toBeDefined();
    expect(['allow', 'block', 'modify', 'flag', 'escalate']).toContain(result.overallVerdict);
    expect(Array.isArray(result.evaluations)).toBe(true);
  });

  it('should evaluate output without errors', async () => {
    const result = await nemoGuardrails.evaluateOutput(
      'What is 2+2?',
      'The answer is 4.',
      {}
    );
    expect(result).toBeDefined();
    expect(result.overallVerdict).toBeDefined();
  });

  it('should track stats', () => {
    const stats = nemoGuardrails.getStats();
    expect(stats.enabled).toBe(true);
    expect(stats.mode).toBe('embedded');
    expect(typeof stats.totalRails).toBe('number');
    expect(typeof stats.evaluationCount).toBe('number');
  });
});
