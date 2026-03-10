/**
 * CendiaRegentService Tests
 * @module __tests__/services/CendiaRegentService.test
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
    generate: vi.fn().mockResolvedValue('Historical analysis: proceed with caution.'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: 'Advisor response' }),
  },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    generate: vi.fn().mockResolvedValue('Historical analysis: proceed with caution. Blindspots include market timing.'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: 'Advisor response' }),
    type: 'ollama',
    isAvailable: vi.fn().mockResolvedValue(true),
    resolveModel: vi.fn().mockResolvedValue('llama3.2:3b'),
  },
}));

const mod = await import('../../services/enterprise/CendiaRegentService.js');
const service = (mod as any).cendiaRegentService || (mod as any).default;

describe('CendiaRegentService', () => {
  it('should export an instance', () => {
    expect(service).toBeDefined();
  });

  describe('getAdvisors()', () => {
    it('should return historical advisors', () => {
      const advisors = service.getAdvisors();
      expect(Array.isArray(advisors)).toBe(true);
      expect(advisors.length).toBeGreaterThan(0);
    });
  });

  describe('getAdvisor()', () => {
    it('should return advisor by id', () => {
      const advisors = service.getAdvisors();
      if (advisors.length > 0) {
        const advisor = service.getAdvisor(advisors[0].id);
        expect(advisor).toBeDefined();
      }
    });

    it('should return undefined for non-existent', () => {
      expect(service.getAdvisor('not-found')).toBeUndefined();
    });
  });

  describe('addCustomAdvisor()', () => {
    it('should add a custom advisor', () => {
      const advisor = service.addCustomAdvisor({
        name: 'Test Advisor',
        era: 'Modern',
        expertise: ['Strategy'],
        systemPrompt: 'You are a test advisor',
        perspective: 'Analytical',
      } as any);
      expect(advisor).toBeDefined();
      expect(advisor.id).toBeDefined();
    });
  });

  describe('consultCouncil()', () => {
    it('should consult the regent council and return session', async () => {
      const session = await service.consultCouncil(
        'Should we acquire a competitor?',
        'Market is consolidating, revenue $50M'
      );
      expect(session).toBeDefined();
      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('question', 'Should we acquire a competitor?');
      expect(session).toHaveProperty('advisorResponses');
      expect(Array.isArray(session.advisorResponses)).toBe(true);
      expect(session).toHaveProperty('synthesis');
      expect(typeof session.synthesis).toBe('string');
    });
  });

  describe('revealMirrorTruth()', () => {
    it('should reveal mirror truth analysis', async () => {
      const analysis = await service.revealMirrorTruth(
        'Growth strategy',
        'We are growing 40% YoY',
        'Industry average is 60% YoY'
      );
      expect(analysis).toBeDefined();
      expect(typeof analysis).toBe('object');
    });
  });

  describe('getDailyMirror()', () => {
    it('should generate daily mirror as string', async () => {
      const mirror = await service.getDailyMirror(
        ['Approved budget', 'Hired VP Sales'],
        'Revenue up 15%, churn down 2%'
      );
      expect(typeof mirror).toBe('string');
      expect(mirror.length).toBeGreaterThan(0);
    });
  });

  describe('getSessions()', () => {
    it('should return sessions', () => {
      const sessions = service.getSessions();
      expect(Array.isArray(sessions)).toBe(true);
    });
  });

  describe('getMetrics()', () => {
    it('should return metrics', () => {
      const metrics = service.getMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('getCouncilIntelligenceDashboard()', () => {
    it('should return council intelligence dashboard', () => {
      const d = service.getCouncilIntelligenceDashboard();
      expect(d).toBeDefined();
    });
  });

  describe('getAdvisorEffectivenessAnalytics()', () => {
    it('should return advisor effectiveness analytics', () => {
      const a = service.getAdvisorEffectivenessAnalytics();
      expect(a).toBeDefined();
    });
  });

  describe('getDecisionPatternIntelligence()', () => {
    it('should return decision pattern intelligence', () => {
      const p = service.getDecisionPatternIntelligence();
      expect(p).toBeDefined();
    });
  });

  describe('getMirrorTruthAggregator()', () => {
    it('should return mirror truth aggregator', () => {
      const m = service.getMirrorTruthAggregator();
      expect(m).toBeDefined();
    });
  });

  describe('getDashboard()', () => {
    it('should return dashboard', async () => {
      const d = await service.getDashboard();
      expect(d).toBeDefined();
      expect(d).toHaveProperty('serviceName');
    });
  });
});
