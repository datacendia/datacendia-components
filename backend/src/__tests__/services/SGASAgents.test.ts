/**
 * SGAS Agent Services Tests
 * Tests for InstitutionalAgents, ObserverAgents, AdversarialAgents, MetaGovernanceAgents, DecisionAgents
 * @module __tests__/services/SGASAgents.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeAll } from 'vitest';

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

const agentModules = [
  { name: 'InstitutionalAgentsService', path: '../../services/sgas/InstitutionalAgentsService.js' },
  { name: 'ObserverAgentsService', path: '../../services/sgas/ObserverAgentsService.js' },
  { name: 'AdversarialAgentsService', path: '../../services/sgas/AdversarialAgentsService.js' },
  { name: 'MetaGovernanceAgentsService', path: '../../services/sgas/MetaGovernanceAgentsService.js' },
  { name: 'DecisionAgentsService', path: '../../services/sgas/DecisionAgentsService.js' },
];

describe('SGAS Agent Services', () => {
  for (const agentMod of agentModules) {
    describe(agentMod.name, () => {
      let mod: Record<string, any>;

      beforeAll(async () => {
        try {
          mod = await import(agentMod.path);
        } catch (err: any) {
          mod = {};
        }
      });

      it('should be importable', () => {
        expect(mod).toBeDefined();
        expect(Object.keys(mod).length).toBeGreaterThan(0);
      });

      it('should export agent definitions or a service', () => {
        const exports = Object.values(mod);
        const hasAgents = exports.some(v =>
          Array.isArray(v) ||
          (typeof v === 'object' && v !== null && !Array.isArray(v)) ||
          typeof v === 'function'
        );
        expect(hasAgents).toBe(true);
      });

      it('should export agent presets with required fields', () => {
        // Find exported array of agents
        const agentArrays = Object.values(mod).filter(v => Array.isArray(v));
        for (const agents of agentArrays) {
          if (agents.length > 0 && agents[0].id) {
            for (const agent of agents) {
              expect(agent).toHaveProperty('id');
              expect(agent).toHaveProperty('name');
            }
          }
        }
      });
    });
  }
});
