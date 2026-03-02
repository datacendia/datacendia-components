/**
 * Module — Collapse Test
 *
 * Platform module.
 * @module __tests__/services/Collapse.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Policy Collapse Mode - Tests
 * 
 * Tests for the adversarial policy stress-testing system.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  DeploymentRecommendation,
  EthicalPrinciple,
  ThreatActorType,
  generateCollapseId,
  generateFailureConditionId,
  generateFailureEnvelopeId,
  hashFailureCondition,
  calculateFailureScore,
  calculateCollapseRisk,
  calculateTrustDelta,
  calculateDisparityRatio,
  calculateMinorityHarmIndex,
  calculateLegitimacyDecay,
  getSeverityLevel,
  DEFAULT_COLLAPSE_CONFIG,
  PROTECTED_GROUPS,
  ETHICAL_PRINCIPLES_DESCRIPTIONS,
} from '../../services/collapse/types.js';
import { CollapseOrchestrator } from '../../services/collapse/CollapseOrchestrator.js';
import { PolicyContext } from '../../services/collapse/agents/BaseCollapseAgent.js';

describe('Collapse Mode Types', () => {
  describe('Enums', () => {
    it('should have 18 collapse agent types', () => {
      const types = Object.values(CollapseAgentType);
      expect(types).toHaveLength(18);
      // Original 8
      expect(types).toContain('LEGITIMACY_COLLAPSE');
      expect(types).toContain('MINORITY_HARM');
      expect(types).toContain('ECONOMIC_INSTABILITY');
      expect(types).toContain('POLITICAL_BACKLASH');
      expect(types).toContain('SYSTEMIC_RISK');
      expect(types).toContain('ADVERSARIAL_ABUSE');
      expect(types).toContain('TEMPORAL_DECAY');
      expect(types).toContain('NARRATIVE_WEAPONIZATION');
      // New 10 (using actual enum values from types.ts)
      expect(types).toContain('FREE_SPEECH_CHILLING');
      expect(types).toContain('DEMOCRATIC_PROCESS_EROSION');
      expect(types).toContain('PROCEDURAL_JUSTICE');
      expect(types).toContain('DUE_PROCESS_VIOLATION');
      expect(types).toContain('FREEDOM_OF_ASSOCIATION');
      expect(types).toContain('CULTURAL_ERASURE');
      expect(types).toContain('DISABILITY_IMPACT');
      expect(types).toContain('FOREIGN_INFLUENCE_AMPLIFICATION');
      expect(types).toContain('MARKET_DISTORTION');
      expect(types).toContain('ENVIRONMENTAL_EXTERNALITY');
    });

    it('should have 18 failure categories', () => {
      const categories = Object.values(FailureCategory);
      expect(categories).toHaveLength(18);
    });

    it('should have correct reversibility values', () => {
      expect(Reversibility.REVERSIBLE).toBe(0.5);
      expect(Reversibility.PARTIALLY_REVERSIBLE).toBe(1.0);
      expect(Reversibility.IRREVERSIBLE).toBe(1.5);
    });

    it('should have 4 deployment recommendations', () => {
      const recs = Object.values(DeploymentRecommendation);
      expect(recs).toHaveLength(4);
      expect(recs).toContain('SAFE_TO_DEPLOY');
      expect(recs).toContain('DO_NOT_DEPLOY');
    });
  });

  describe('ID Generation', () => {
    it('should generate unique collapse IDs', () => {
      const id1 = generateCollapseId();
      const id2 = generateCollapseId();
      expect(id1).toMatch(/^COL-/);
      expect(id2).toMatch(/^COL-/);
      expect(id1).not.toBe(id2);
    });

    it('should generate unique failure condition IDs', () => {
      const id1 = generateFailureConditionId();
      const id2 = generateFailureConditionId();
      expect(id1).toMatch(/^FC-/);
      expect(id2).toMatch(/^FC-/);
    });

    it('should generate failure envelope IDs with year-month format', () => {
      const id = generateFailureEnvelopeId();
      expect(id).toMatch(/^FE-\d{4}-\d{2}-\d+$/);
    });
  });

  describe('Hash Functions', () => {
    it('should hash failure conditions consistently', () => {
      const fc = {
        id: 'FC-TEST',
        agent: CollapseAgentType.LEGITIMACY,
        category: FailureCategory.TRUST_COLLAPSE,
        triggerCondition: { metric: 'test', operator: '>' as const, value: 1, confidence: 0.8 },
        failureEvent: { type: 'test', description: 'test', cascadeRisk: 0.5 },
        affectedGroups: [],
        severity: 0.7,
        probability: 0.6,
        irreversibility: Reversibility.PARTIALLY_REVERSIBLE,
        timeToManifestation: '6 months',
        visibility: VisibilityType.DELAYED,
        mitigationPossible: true,
        mitigationCost: 'HIGH' as const,
        evidence: [],
        reasoning: 'test',
      };

      const hash1 = hashFailureCondition(fc);
      const hash2 = hashFailureCondition(fc);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(16);
    });
  });
});

describe('Trust Delta Calculations', () => {
  describe('calculateFailureScore', () => {
    it('should calculate failure score correctly', () => {
      const fc = {
        severity: 0.8,
        probability: 0.6,
        irreversibility: Reversibility.PARTIALLY_REVERSIBLE,
      };
      const score = calculateFailureScore(fc as any);
      expect(score).toBeCloseTo(0.8 * 0.6 * 1.0, 5);
    });

    it('should apply irreversibility multiplier', () => {
      const reversible = calculateFailureScore({
        severity: 0.5,
        probability: 0.5,
        irreversibility: Reversibility.REVERSIBLE,
      } as any);

      const irreversible = calculateFailureScore({
        severity: 0.5,
        probability: 0.5,
        irreversibility: Reversibility.IRREVERSIBLE,
      } as any);

      expect(irreversible).toBeGreaterThan(reversible);
      expect(irreversible / reversible).toBeCloseTo(3, 5);
    });
  });

  describe('calculateCollapseRisk', () => {
    it('should return 0 for empty failure conditions', () => {
      expect(calculateCollapseRisk([])).toBe(0);
    });

    it('should calculate union of risks', () => {
      const conditions = [
        { severity: 0.5, probability: 0.5, irreversibility: Reversibility.PARTIALLY_REVERSIBLE },
        { severity: 0.3, probability: 0.4, irreversibility: Reversibility.REVERSIBLE },
      ];
      const risk = calculateCollapseRisk(conditions as any);
      expect(risk).toBeGreaterThan(0);
      expect(risk).toBeLessThan(1);
    });

    it('should increase with more failure conditions', () => {
      const oneCondition = [
        { severity: 0.5, probability: 0.5, irreversibility: Reversibility.PARTIALLY_REVERSIBLE },
      ];
      const twoConditions = [
        { severity: 0.5, probability: 0.5, irreversibility: Reversibility.PARTIALLY_REVERSIBLE },
        { severity: 0.5, probability: 0.5, irreversibility: Reversibility.PARTIALLY_REVERSIBLE },
      ];

      const risk1 = calculateCollapseRisk(oneCondition as any);
      const risk2 = calculateCollapseRisk(twoConditions as any);
      expect(risk2).toBeGreaterThan(risk1);
    });
  });

  describe('calculateTrustDelta', () => {
    it('should recommend SAFE_TO_DEPLOY for high delta', () => {
      const result = calculateTrustDelta(0.9, 0.3);
      expect(result.trustDelta).toBeCloseTo(0.6, 5);
      expect(result.deploymentRecommendation).toBe(DeploymentRecommendation.SAFE_TO_DEPLOY);
    });

    it('should recommend DEPLOY_WITH_GUARDRAILS for moderate delta', () => {
      const result = calculateTrustDelta(0.8, 0.55);
      expect(result.trustDelta).toBeCloseTo(0.25, 5);
      expect(result.deploymentRecommendation).toBe(DeploymentRecommendation.DEPLOY_WITH_GUARDRAILS);
    });

    it('should recommend HIGH_RISK for low positive delta', () => {
      const result = calculateTrustDelta(0.7, 0.65);
      expect(result.trustDelta).toBeCloseTo(0.05, 5);
      expect(result.deploymentRecommendation).toBe(DeploymentRecommendation.HIGH_RISK);
    });

    it('should recommend DO_NOT_DEPLOY for negative delta', () => {
      const result = calculateTrustDelta(0.5, 0.7);
      expect(result.trustDelta).toBeCloseTo(-0.2, 5);
      expect(result.deploymentRecommendation).toBe(DeploymentRecommendation.DO_NOT_DEPLOY);
    });

    it('should include risk factors and mitigations for non-safe recommendations', () => {
      const result = calculateTrustDelta(0.6, 0.55);
      expect(result.riskFactors.length).toBeGreaterThan(0);
      expect(result.mitigationSuggestions.length).toBeGreaterThan(0);
    });
  });

  describe('calculateDisparityRatio', () => {
    it('should calculate ratio correctly', () => {
      expect(calculateDisparityRatio(0.8, 0.4)).toBe(2);
      expect(calculateDisparityRatio(0.5, 0.5)).toBe(1);
    });

    it('should handle zero population average', () => {
      expect(calculateDisparityRatio(0.5, 0)).toBe(Infinity);
      expect(calculateDisparityRatio(0, 0)).toBe(1);
    });
  });

  describe('calculateMinorityHarmIndex', () => {
    it('should return 0 for empty ratios', () => {
      expect(calculateMinorityHarmIndex([])).toBe(0);
    });

    it('should return max ratio times visibility delay', () => {
      const ratios = [
        { group: 'A', ratio: 1.5 },
        { group: 'B', ratio: 2.0 },
      ];
      expect(calculateMinorityHarmIndex(ratios, 1.0)).toBe(1); // capped at 1
    });
  });

  describe('calculateLegitimacyDecay', () => {
    it('should decay with more trigger events', () => {
      const initial = calculateLegitimacyDecay(0.9, 0);
      const after5 = calculateLegitimacyDecay(0.9, 5);
      const after10 = calculateLegitimacyDecay(0.9, 10);

      expect(after5).toBeLessThan(initial);
      expect(after10).toBeLessThan(after5);
    });

    it('should respect sensitivity coefficient', () => {
      const lowSensitivity = calculateLegitimacyDecay(0.9, 5, 0.1);
      const highSensitivity = calculateLegitimacyDecay(0.9, 5, 0.2);

      expect(highSensitivity).toBeLessThan(lowSensitivity);
    });
  });

  describe('getSeverityLevel', () => {
    it('should classify severity levels correctly', () => {
      expect(getSeverityLevel(0.9)).toBe('CRITICAL');
      expect(getSeverityLevel(0.8)).toBe('CRITICAL');
      expect(getSeverityLevel(0.7)).toBe('HIGH');
      expect(getSeverityLevel(0.6)).toBe('HIGH');
      expect(getSeverityLevel(0.5)).toBe('MEDIUM');
      expect(getSeverityLevel(0.4)).toBe('MEDIUM');
      expect(getSeverityLevel(0.3)).toBe('LOW');
    });
  });
});

describe('Default Configuration', () => {
  it('should have all 18 agents enabled by default', () => {
    expect(DEFAULT_COLLAPSE_CONFIG.agents).toHaveLength(18);
    expect(DEFAULT_COLLAPSE_CONFIG.agents.every(a => a.enabled)).toBe(true);
  });

  it('should have minority harm agent with higher weight (NON-OVERRIDABLE)', () => {
    const minorityAgent = DEFAULT_COLLAPSE_CONFIG.agents.find(
      a => a.type === CollapseAgentType.MINORITY_HARM
    );
    expect(minorityAgent?.weight).toBe(1.3);
    expect(minorityAgent?.parameters?.['nonOverridable']).toBe(true);
  });

  it('should have reasonable default thresholds', () => {
    expect(DEFAULT_COLLAPSE_CONFIG.trustDeltaThreshold).toBe(0.1);
    expect(DEFAULT_COLLAPSE_CONFIG.simulationHorizonMonths).toBe(24);
    expect(DEFAULT_COLLAPSE_CONFIG.stressMultiplier).toBe(1.5);
  });
});

describe('Protected Groups', () => {
  it('should have multiple protected groups defined', () => {
    expect(PROTECTED_GROUPS.length).toBeGreaterThan(5);
  });

  it('should have vulnerability scores between 0 and 1', () => {
    for (const group of PROTECTED_GROUPS) {
      expect(group.vulnerabilityScore).toBeGreaterThanOrEqual(0);
      expect(group.vulnerabilityScore).toBeLessThanOrEqual(1);
    }
  });

  it('should have population shares that are reasonable (groups can overlap)', () => {
    const total = PROTECTED_GROUPS.reduce((sum, g) => sum + g.populationShare, 0);
    // Groups can overlap (e.g., low-income + elderly), so total can exceed 1
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThan(3); // But shouldn't be absurdly high
  });
});

describe('Ethical Principles', () => {
  it('should have descriptions for all principles', () => {
    const principles = Object.values(EthicalPrinciple);
    for (const principle of principles) {
      expect(ETHICAL_PRINCIPLES_DESCRIPTIONS[principle]).toBeDefined();
      expect(ETHICAL_PRINCIPLES_DESCRIPTIONS[principle].length).toBeGreaterThan(10);
    }
  });
});

describe('CollapseOrchestrator', () => {
  let orchestrator: CollapseOrchestrator;
  let testContext: PolicyContext;

  beforeEach(() => {
    orchestrator = new CollapseOrchestrator();
    testContext = {
      decisionId: 'TEST-001',
      decisionText: 'Test housing policy for affordable housing development',
      policyDomain: 'Housing',
      targetPopulation: 50000,
      geographicScope: 'Municipal',
      budgetImpact: 5000000,
      timelineMonths: 24,
      existingConditions: { unemployment: 0.05, inflation: 0.03 },
      stakeholders: ['Citizens', 'Developers', 'Council'],
    };
  });

  describe('Agent Management', () => {
    it('should have all 18 agents initialized', () => {
      const descriptions = orchestrator.getAgentDescriptions();
      expect(descriptions).toHaveLength(18);
    });

    it('should provide agent descriptions and questions', () => {
      const descriptions = orchestrator.getAgentDescriptions();
      for (const agent of descriptions) {
        expect(agent.description.length).toBeGreaterThan(20);
        expect(agent.questions.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Configuration', () => {
    it('should return default configuration', () => {
      const config = orchestrator.getConfig();
      expect(config.enabled).toBe(true);
      expect(config.agents).toHaveLength(18);
    });

    it('should allow configuration updates', () => {
      orchestrator.updateConfig({ stressMultiplier: 2.0 });
      expect(orchestrator.getConfig().stressMultiplier).toBe(2.0);
    });
  });

  describe('Dual-Track Deliberation', () => {
    it('should run deliberation with deterministic seed', async () => {
      const result = await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy decision',
        testContext,
        0.85,
        12345
      );

      expect(result.id).toMatch(/^COL-/);
      expect(result.seed).toBe(12345);
      expect(result.consensusTrack.confidence).toBe(0.85);
      expect(result.collapseTrack.failureEnvelope).toBeDefined();
      expect(result.trustDelta).toBeDefined();
      expect(result.merkleRoot).toBeDefined();
    });

    it('should produce failure conditions', async () => {
      const result = await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy decision',
        testContext,
        0.85,
        12345
      );

      const envelope = result.collapseTrack.failureEnvelope;
      expect(envelope.failureConditions.length).toBeGreaterThan(0);
      expect(envelope.summary.totalFailureConditions).toBeGreaterThan(0);
    });

    it('should calculate trust delta', async () => {
      const result = await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy decision',
        testContext,
        0.9,
        12345
      );

      expect(result.trustDelta.consensusConfidence).toBe(0.9);
      expect(result.trustDelta.collapseRisk).toBeGreaterThanOrEqual(0);
      expect(result.trustDelta.collapseRisk).toBeLessThanOrEqual(1);
      expect(result.trustDelta.deploymentRecommendation).toBeDefined();
    });

    it('should store deliberation for retrieval', async () => {
      const result = await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy decision',
        testContext,
        0.85,
        12345
      );

      const retrieved = orchestrator.getDeliberation(result.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(result.id);
    });

    it('should list all deliberations', async () => {
      await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy 1',
        testContext,
        0.85,
        11111
      );
      await orchestrator.runDualTrackDeliberation(
        'TEST-002',
        'Test policy 2',
        testContext,
        0.75,
        22222
      );

      const list = orchestrator.listDeliberations();
      expect(list.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Failure Envelope', () => {
    it('should store and retrieve failure envelopes', async () => {
      const result = await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy decision',
        testContext,
        0.85,
        12345
      );

      const envelopeId = result.collapseTrack.failureEnvelope.id;
      const retrieved = orchestrator.getFailureEnvelope(envelopeId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(envelopeId);
    });

    it('should include all required envelope fields', async () => {
      const result = await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy decision',
        testContext,
        0.85,
        12345
      );

      const envelope = result.collapseTrack.failureEnvelope;
      expect(envelope.collapseMode).toBe(true);
      expect(envelope.generatedAt).toBeDefined();
      expect(envelope.seed).toBe(12345);
      expect(envelope.summary).toBeDefined();
      expect(envelope.failureConditions).toBeDefined();
      expect(envelope.trustDelta).toBeDefined();
      expect(envelope.merkleRoot).toBeDefined();
      expect(envelope.replayable).toBe(true);
      expect(envelope.replayCommand).toContain('--seed=12345');
    });
  });

  describe('Integrity Verification', () => {
    it('should verify valid envelope integrity', async () => {
      const result = await orchestrator.runDualTrackDeliberation(
        'TEST-001',
        'Test policy decision',
        testContext,
        0.85,
        12345
      );

      const envelope = result.collapseTrack.failureEnvelope;
      const verification = orchestrator.verifyEnvelopeIntegrity(envelope);
      expect(verification.errors).toHaveLength(0);
      expect(verification.valid).toBe(true);
    });
  });
});
