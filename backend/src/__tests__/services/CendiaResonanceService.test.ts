/**
 * CendiaResonanceService Tests
 * @module __tests__/services/CendiaResonanceService.test
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
    generate: vi.fn().mockResolvedValue('{"sentiment": 0.7, "themes": ["growth"]}'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: 'Campaign message for Q4 strategy' }),
  },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    generate: vi.fn().mockResolvedValue('Subject: Q4 Strategy Update\n\nDear team, here are our Q4 priorities...'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: 'Campaign message' }),
    type: 'ollama',
    isAvailable: vi.fn().mockResolvedValue(true),
    resolveModel: vi.fn().mockResolvedValue('llama3.2:3b'),
  },
}));

const mod = await import('../../services/enterprise/CendiaResonanceService.js');
const service = (mod as any).cendiaResonanceService || (mod as any).default;

describe('CendiaResonanceService', () => {
  it('should export an instance', () => {
    expect(service).toBeDefined();
  });

  describe('createCampaign()', () => {
    it('should create a communication campaign', () => {
      const campaign = service.createCampaign({
        name: 'Q4 Strategy Update',
        type: 'internal',
        objectives: ['Communicate Q4 priorities', 'Align teams'],
        audiences: [{ id: 'all', name: 'all-hands', size: 500 }],
        channels: ['email', 'slack'],
      } as any);
      expect(campaign).toBeDefined();
      expect(campaign.id).toBeDefined();
      expect(campaign.name).toBe('Q4 Strategy Update');
    });
  });

  describe('generateCampaignMessage()', () => {
    it('should generate a message for a campaign', async () => {
      const campaign = service.createCampaign({
        name: 'Test Campaign',
        type: 'internal',
        objectives: ['Share updates', 'Boost morale'],
        audiences: [{ id: 'eng', name: 'engineering', size: 100 }],
        channels: ['email'],
        messages: [],
      } as any);
      const message = await service.generateCampaignMessage(
        campaign.id, 'engineering', 'email', ['Key update 1', 'Key update 2']
      );
      expect(message).toBeDefined();
      expect(typeof message).toBe('object');
      expect(message).toHaveProperty('content');
    });
  });

  describe('getCampaign()', () => {
    it('should return null for non-existent campaign', () => {
      expect(service.getCampaign('not-found')).toBeNull();
    });
  });

  describe('getActiveCampaigns()', () => {
    it('should return active campaigns', () => {
      const campaigns = service.getActiveCampaigns();
      expect(Array.isArray(campaigns)).toBe(true);
    });
  });

  describe('measureBelief()', () => {
    it('should measure belief on a topic', async () => {
      const belief = await service.measureBelief('Company direction', 'all employees');
      expect(belief).toBeDefined();
      expect(belief).toHaveProperty('topic', 'Company direction');
    });
  });

  describe('getBeliefHistory()', () => {
    it('should return belief history for topic', () => {
      const history = service.getBeliefHistory('Company direction');
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe('detectLeakPatterns()', () => {
    it('should detect leak patterns in content', async () => {
      const patterns = await service.detectLeakPatterns('Confidential: Q4 revenue targets');
      expect(Array.isArray(patterns)).toBe(true);
    });
  });

  describe('initiateCrisisResponse()', () => {
    it('should initiate a crisis response', () => {
      const crisis = service.initiateCrisisResponse(
        'data_breach',
        'high',
        'Customer data exposed in third-party breach'
      );
      expect(crisis).toBeDefined();
      expect(crisis).toHaveProperty('id');
    });
  });

  describe('generateHoldingStatement()', () => {
    it('should generate a holding statement', async () => {
      const crisis = service.initiateCrisisResponse(
        'regulatory',
        'medium',
        'New regulation announced'
      );
      const statement = await service.generateHoldingStatement(crisis.id, 'press');
      expect(statement).toBeDefined();
      expect(typeof statement).toBe('object');
      expect(statement).toHaveProperty('content');
    });
  });
});
