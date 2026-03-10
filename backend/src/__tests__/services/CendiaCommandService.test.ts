/**
 * CendiaCommandService Tests
 * 
 * Tests for natural language command processing
 * @module __tests__/services/CendiaCommandService.test
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
    generate: vi.fn().mockResolvedValue({ response: '{"intent": "query", "entities": []}' }),
    chat: vi.fn().mockResolvedValue({ message: { content: 'Test response' } }),
  },
}));

const mod = await import('../../services/command/CendiaCommandService.js');
const CendiaCommandService = (mod as any).CendiaCommandService;
const service = new CendiaCommandService();

describe('CendiaCommandService', () => {
  it('should export the class', () => {
    expect(CendiaCommandService).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(service).toBeDefined();
  });

  describe('getAllVerticals()', () => {
    it('should return all vertical configs', () => {
      const verticals = service.getAllVerticals();
      expect(verticals).toBeDefined();
      expect(Array.isArray(verticals)).toBe(true);
    });
  });

  describe('getVerticalConfig()', () => {
    it('should return config for a known vertical', () => {
      const config = service.getVerticalConfig('financial');
      expect(config).toBeDefined();
    });
  });

  describe('getQuickActions()', () => {
    it('should return quick actions for a vertical', () => {
      const actions = service.getQuickActions('financial');
      expect(Array.isArray(actions)).toBe(true);
    });
  });

  describe('parseCommand()', () => {
    it('should parse a command string', () => {
      const intent = service.parseCommand('show deliberations', {
        userId: 'user-1',
        organizationId: 'org-1',
        verticalId: 'financial',
      } as any);
      expect(intent).toBeDefined();
    });
  });

  describe('executeCommand()', () => {
    it('should execute a command', async () => {
      const result = await service.executeCommand('show status', {
        userId: 'user-1',
        organizationId: 'org-1',
        verticalId: 'financial',
      } as any);
      expect(result).toBeDefined();
    });
  });

  describe('getSuggestions()', () => {
    it('should return suggestions for partial commands', () => {
      const suggestions = service.getSuggestions('show', {
        userId: 'user-1',
        organizationId: 'org-1',
        verticalId: 'financial',
      } as any);
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('getExecutionHistory()', () => {
    it('should return execution history', () => {
      const history = service.getExecutionHistory({
        userId: 'user-1',
        organizationId: 'org-1',
        verticalId: 'financial',
      } as any);
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('VERTICAL_CONFIGS export', () => {
    it('should export VERTICAL_CONFIGS', () => {
      expect(mod.VERTICAL_CONFIGS).toBeDefined();
    });
  });
});
