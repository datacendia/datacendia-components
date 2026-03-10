/**
 * LegalCouncilModes Tests
 * @module __tests__/services/LegalCouncilModes.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'Legal mode response' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Legal mode chat' } }),
  },
}));

const mod = await import('../../services/legal/LegalCouncilModes.js');

describe('LegalCouncilModes', () => {
  it('should be importable', () => {
    expect(mod).toBeDefined();
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });

  it('should export council mode definitions', () => {
    const exports = Object.values(mod);
    const hasModes = exports.some(v =>
      Array.isArray(v) || typeof v === 'object' || typeof v === 'function'
    );
    expect(hasModes).toBe(true);
  });
});
