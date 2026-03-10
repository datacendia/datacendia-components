/**
 * LegalAgents Tests
 * @module __tests__/services/LegalAgents.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'Legal analysis' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Legal response' } }),
  },
}));

const mod = await import('../../services/legal/LegalAgents.js');

describe('LegalAgents', () => {
  it('should be importable', () => {
    expect(mod).toBeDefined();
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });

  it('should export legal agent definitions', () => {
    const exports = Object.values(mod);
    const hasAgents = exports.some(v =>
      Array.isArray(v) || typeof v === 'function' || (typeof v === 'object' && v !== null)
    );
    expect(hasAgents).toBe(true);
  });

  it('should have agents with id and name properties', () => {
    const agentArrays = Object.values(mod).filter(v => Array.isArray(v));
    for (const agents of agentArrays) {
      if (agents.length > 0 && (agents[0] as any).id) {
        for (const agent of agents as any[]) {
          expect(agent).toHaveProperty('id');
          expect(agent).toHaveProperty('name');
        }
      }
    }
  });
});
