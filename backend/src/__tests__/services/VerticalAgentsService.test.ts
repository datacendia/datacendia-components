/**
 * VerticalAgentsService Tests
 * @module __tests__/services/VerticalAgentsService.test
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
    generate: vi.fn().mockResolvedValue({ response: 'Agent response' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Agent chat' } }),
  },
}));

const mod = await import('../../services/VerticalAgentsService.js');
const VerticalAgentsService = (mod as any).VerticalAgentsService;
const service = new VerticalAgentsService();

describe('VerticalAgentsService', () => {
  it('should export the class', () => {
    expect(VerticalAgentsService).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(service).toBeDefined();
  });

  it('should have getAgentsForVertical method', () => {
    expect(typeof service.getAgentsForVertical).toBe('function');
  });

  it('should have getAllAgents method', () => {
    expect(typeof service.getAllAgents).toBe('function');
  });

  it('should have getAllVerticals method', () => {
    expect(typeof service.getAllVerticals).toBe('function');
  });

  it('should have getVerticalConfig method', () => {
    expect(typeof service.getVerticalConfig).toBe('function');
  });

  it('should have getAgent method', () => {
    expect(typeof service.getAgent).toBe('function');
  });

  it('should have healthCheck method', () => {
    expect(typeof service.healthCheck).toBe('function');
  });
});
