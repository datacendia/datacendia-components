/**
 * EnhancedLLMService Tests
 * @module __tests__/services/EnhancedLLMService.test
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
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue({ response: 'Enhanced response' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Enhanced chat' } }),
  },
}));

const mod = await import('../../services/EnhancedLLMService.js');
const EnhancedLLMService = (mod as any).EnhancedLLMService;
const service = new EnhancedLLMService();

describe('EnhancedLLMService', () => {
  it('should export the class', () => {
    expect(EnhancedLLMService).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(service).toBeDefined();
  });

  it('should have classifyQuery method', () => {
    expect(typeof service.classifyQuery).toBe('function');
  });

  it('should have selectOptimalModel method', () => {
    expect(typeof service.selectOptimalModel).toBe('function');
  });

  it('should select a model for a query', () => {
    const model = service.selectOptimalModel('What is the compliance status?');
    expect(typeof model).toBe('string');
  });

  it('should have listAvailableModels method', () => {
    expect(typeof service.listAvailableModels).toBe('function');
  });

  it('should export MODEL_CONFIGS', () => {
    expect(mod.MODEL_CONFIGS).toBeDefined();
    expect(typeof mod.MODEL_CONFIGS).toBe('object');
  });
});
