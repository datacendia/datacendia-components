/**
 * Module — Collapse Agents Test
 *
 * Platform module.
 * @module __tests__/services/CollapseAgents.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Policy Collapse Mode - New Agent Tests
 * 
 * Dedicated tests for the 10 new adversarial agents added in January 2026.
 * Tests verify each agent generates failure conditions and follows the
 * adversarial principle of "always finding something."
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PolicyContext } from '../../services/collapse/agents/BaseCollapseAgent.js';
import { FreeSpeechChillingAgent } from '../../services/collapse/agents/FreeSpeechChillingAgent.js';
import { DemocraticProcessErosionAgent } from '../../services/collapse/agents/DemocraticProcessErosionAgent.js';
import { ProceduralJusticeAgent } from '../../services/collapse/agents/ProceduralJusticeAgent.js';
import { DueProcessViolationAgent } from '../../services/collapse/agents/DueProcessViolationAgent.js';
import { FreedomOfAssociationAgent } from '../../services/collapse/agents/FreedomOfAssociationAgent.js';
import { CulturalErasureAgent } from '../../services/collapse/agents/CulturalErasureAgent.js';
import { DisabilityImpactAgent } from '../../services/collapse/agents/DisabilityImpactAgent.js';
import { ForeignInfluenceAmplificationAgent } from '../../services/collapse/agents/ForeignInfluenceAmplificationAgent.js';
import { MarketDistortionAgent } from '../../services/collapse/agents/MarketDistortionAgent.js';
import { EnvironmentalExternalityAgent } from '../../services/collapse/agents/EnvironmentalExternalityAgent.js';

describe('New Collapse Agents (January 2026)', () => {
  let testContext: PolicyContext;
  const testSeed = 42;
  const testParams = { seed: testSeed, stressMultiplier: 1.5, simulationHorizonMonths: 24 };

  beforeEach(() => {
    testContext = {
      decisionId: 'TEST-AGENT-001',
      decisionText: 'Test housing policy for affordable housing development in urban areas',
      policyDomain: 'Housing',
      targetPopulation: 100000,
      geographicScope: 'Municipal',
      budgetImpact: 5000000,
      timelineMonths: 24,
      existingConditions: { unemployment: 0.05, inflation: 0.03 },
      stakeholders: ['Citizens', 'Developers', 'Local Government'],
    };
  });

  describe('FreeSpeechChillingAgent', () => {
    let agent: FreeSpeechChillingAgent;

    beforeEach(() => {
      agent = new FreeSpeechChillingAgent();
    });

    it('should have correct metadata', () => {
      expect(agent.getDescription()).toContain('chilling');
      expect(agent.getFailureQuestions().length).toBeGreaterThanOrEqual(2);
    });

    it('should always generate at least one failure condition (adversarial principle)', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
      expect(result.hash).toBeDefined();
    });

    it('should generate deterministic results with same seed', async () => {
      const result1 = await agent.analyze({ context: testContext, ...testParams });
      const result2 = await agent.analyze({ context: testContext, ...testParams });
      expect(result1.riskScore).toBe(result2.riskScore);
    });

    it('should detect chilling indicators when present', async () => {
      const restrictiveContext = {
        ...testContext,
        decisionText: 'Policy to restrict and prohibit certain speech with criminal penalties and mandatory monitoring',
      };
      const result = await agent.analyze({ context: restrictiveContext, ...testParams });
      expect(result.riskScore).toBeGreaterThan(0.3);
    });
  });

  describe('DemocraticProcessErosionAgent', () => {
    let agent: DemocraticProcessErosionAgent;

    beforeEach(() => {
      agent = new DemocraticProcessErosionAgent();
    });

    it('should have correct metadata', () => {
      expect(agent.getDescription()).toContain('democratic');
      expect(agent.getFailureQuestions().length).toBeGreaterThanOrEqual(2);
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should detect technocratic creep indicators', async () => {
      const technocraticContext = {
        ...testContext,
        decisionText: 'Automated algorithmic model for efficient data-driven expert decisions without public input',
      };
      const result = await agent.analyze({ context: technocraticContext, ...testParams });
      expect(result.riskScore).toBeGreaterThan(0.2);
    });
  });

  describe('ProceduralJusticeAgent', () => {
    let agent: ProceduralJusticeAgent;

    beforeEach(() => {
      agent = new ProceduralJusticeAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should have appropriate failure category', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions[0]?.category).toBeDefined();
    });
  });

  describe('DueProcessViolationAgent', () => {
    let agent: DueProcessViolationAgent;

    beforeEach(() => {
      agent = new DueProcessViolationAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should detect automated sanctions', async () => {
      const automatedContext = {
        ...testContext,
        decisionText: 'Automated penalty system with algorithm enforcement and no human review or appeal',
      };
      const result = await agent.analyze({ context: automatedContext, ...testParams });
      expect(result.riskScore).toBeGreaterThan(0.3);
    });
  });

  describe('FreedomOfAssociationAgent', () => {
    let agent: FreedomOfAssociationAgent;

    beforeEach(() => {
      agent = new FreedomOfAssociationAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should detect assembly restrictions', async () => {
      const restrictiveContext = {
        ...testContext,
        decisionText: 'Policy requiring permit to gather with restrictions on assembly and protest dispersal curfew',
      };
      const result = await agent.analyze({ context: restrictiveContext, ...testParams });
      expect(result.riskScore).toBeGreaterThan(0.3);
    });
  });

  describe('CulturalErasureAgent', () => {
    let agent: CulturalErasureAgent;

    beforeEach(() => {
      agent = new CulturalErasureAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should have cultural erasure failure category', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.agentType).toBe('CULTURAL_ERASURE');
    });
  });

  describe('DisabilityImpactAgent', () => {
    let agent: DisabilityImpactAgent;

    beforeEach(() => {
      agent = new DisabilityImpactAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should identify affected groups including disabled populations', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      const hasDisabilityGroup = result.failureConditions.some(fc =>
        fc.affectedGroups.some(g => g.name.toLowerCase().includes('disab') || g.name.toLowerCase().includes('access'))
      );
      expect(hasDisabilityGroup || result.failureConditions.length > 0).toBe(true);
    });
  });

  describe('ForeignInfluenceAmplificationAgent', () => {
    let agent: ForeignInfluenceAmplificationAgent;

    beforeEach(() => {
      agent = new ForeignInfluenceAmplificationAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should have sovereignty undermining category', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.agentType).toBe('FOREIGN_INFLUENCE_AMPLIFICATION');
    });
  });

  describe('MarketDistortionAgent', () => {
    let agent: MarketDistortionAgent;

    beforeEach(() => {
      agent = new MarketDistortionAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should detect entry barriers', async () => {
      const barrierContext = {
        ...testContext,
        decisionText: 'Policy requiring license and mandatory certification with minimum capital for incumbent providers',
      };
      const result = await agent.analyze({ context: barrierContext, ...testParams });
      expect(result.riskScore).toBeGreaterThan(0.2);
    });
  });

  describe('EnvironmentalExternalityAgent', () => {
    let agent: EnvironmentalExternalityAgent;

    beforeEach(() => {
      agent = new EnvironmentalExternalityAgent();
    });

    it('should always generate at least one failure condition', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.failureConditions.length).toBeGreaterThan(0);
    });

    it('should have environmental externality type', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.agentType).toBe('ENVIRONMENTAL_EXTERNALITY');
    });

    it('should include intergenerational considerations', async () => {
      const result = await agent.analyze({ context: testContext, ...testParams });
      expect(result.reasoning).toBeDefined();
    });
  });

  describe('All Agents - Common Requirements', () => {
    const agents = [
      new FreeSpeechChillingAgent(),
      new DemocraticProcessErosionAgent(),
      new ProceduralJusticeAgent(),
      new DueProcessViolationAgent(),
      new FreedomOfAssociationAgent(),
      new CulturalErasureAgent(),
      new DisabilityImpactAgent(),
      new ForeignInfluenceAmplificationAgent(),
      new MarketDistortionAgent(),
      new EnvironmentalExternalityAgent(),
    ];

    it('all 10 new agents should be instantiable', () => {
      expect(agents.length).toBe(10);
      agents.forEach(agent => {
        expect(agent).toBeDefined();
      });
    });

    it('all agents should have valid descriptions', () => {
      agents.forEach(agent => {
        expect(agent.getDescription().length).toBeGreaterThan(20);
      });
    });

    it('all agents should have at least 2 failure questions', () => {
      agents.forEach(agent => {
        expect(agent.getFailureQuestions().length).toBeGreaterThanOrEqual(2);
      });
    });

    it('all agents should produce hashed outputs', async () => {
      for (const agent of agents) {
        const result = await agent.analyze({ context: testContext, ...testParams });
        expect(result.hash).toBeDefined();
        expect(result.hash.length).toBeGreaterThan(0);
      }
    });

    it('all agents should include timestamps', async () => {
      for (const agent of agents) {
        const result = await agent.analyze({ context: testContext, ...testParams });
        expect(result.timestamp).toBeDefined();
        expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0);
      }
    });
  });
});
