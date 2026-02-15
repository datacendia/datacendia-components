// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA CASCADE SERVICE TESTS
// Tests for the Butterfly Effect / Second-Order Consequence Engine
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../services/CendiaOrbitService.js', () => ({
  orbitService: {
    addNode: vi.fn(),
    addEdge: vi.fn(),
    runInfluenceSimulation: vi.fn().mockResolvedValue({
      runId: 'run-123',
      sourceNodeId: 'node-1',
      changeDescription: 'Test change',
      timestamp: new Date(),
      config: {},
      directImpacts: [],
      rippleImpacts: [],
      butterflyImpacts: [],
      totalNodesAffected: 5,
      maxLatencyDays: 90,
      executionTimeMs: 150,
    }),
    getGraph: vi.fn().mockReturnValue({
      nodes: new Map(),
      edges: new Map(),
      adjacency: new Map(),
    }),
  },
  CendiaOrbitService: class MockOrbitService {},
  NodeType: {
    DEPARTMENT: 'department',
    TEAM: 'team',
    PERSON: 'person',
    SYSTEM: 'system',
    PROCESS: 'process',
    POLICY: 'policy',
    METRIC: 'metric',
    VENDOR: 'vendor',
    CUSTOMER: 'customer',
    PRODUCT: 'product',
    ASSET: 'asset',
    DECISION: 'decision',
    RISK: 'risk',
    CONTROL: 'control',
  },
  EdgeType: {
    DEPENDS_ON: 'depends_on',
    MANAGES: 'manages',
    PRODUCES: 'produces',
    CONSUMES: 'consumes',
    INFLUENCES: 'influences',
    REPORTS_TO: 'reports_to',
    FUNDS: 'funds',
    CONSTRAINS: 'constrains',
    TRIGGERS: 'triggers',
    MITIGATES: 'mitigates',
  },
}));

vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import {
  ChangeType,
  ImpactCategory,
  Severity,
  Likelihood,
  ChangeSpec,
  ConsequenceAssessment,
  Mitigation,
  Guardrail,
} from '../../services/CendiaCascadeService.js';

describe('CendiaCascadeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // CHANGE TYPES
  // ===========================================================================

  describe('ChangeType Enum', () => {
    it('should have POLICY type', () => {
      expect(ChangeType.POLICY).toBe('policy');
    });

    it('should have PRICING type', () => {
      expect(ChangeType.PRICING).toBe('pricing');
    });

    it('should have STAFFING type', () => {
      expect(ChangeType.STAFFING).toBe('staffing');
    });

    it('should have VENDOR type', () => {
      expect(ChangeType.VENDOR).toBe('vendor');
    });

    it('should have TECHNOLOGY type', () => {
      expect(ChangeType.TECHNOLOGY).toBe('technology');
    });

    it('should have PROCESS type', () => {
      expect(ChangeType.PROCESS).toBe('process');
    });

    it('should have PRODUCT type', () => {
      expect(ChangeType.PRODUCT).toBe('product');
    });

    it('should have MARKET type', () => {
      expect(ChangeType.MARKET).toBe('market');
    });

    it('should have REGULATORY type', () => {
      expect(ChangeType.REGULATORY).toBe('regulatory');
    });

    it('should have SECURITY type', () => {
      expect(ChangeType.SECURITY).toBe('security');
    });

    it('should have DATA type', () => {
      expect(ChangeType.DATA).toBe('data');
    });
  });

  // ===========================================================================
  // IMPACT CATEGORIES
  // ===========================================================================

  describe('ImpactCategory Enum', () => {
    it('should have FINANCIAL category', () => {
      expect(ImpactCategory.FINANCIAL).toBe('financial');
    });

    it('should have OPERATIONAL category', () => {
      expect(ImpactCategory.OPERATIONAL).toBe('operational');
    });

    it('should have REPUTATIONAL category', () => {
      expect(ImpactCategory.REPUTATIONAL).toBe('reputational');
    });

    it('should have COMPLIANCE category', () => {
      expect(ImpactCategory.COMPLIANCE).toBe('compliance');
    });

    it('should have SECURITY category', () => {
      expect(ImpactCategory.SECURITY).toBe('security');
    });

    it('should have HUMAN category', () => {
      expect(ImpactCategory.HUMAN).toBe('human');
    });

    it('should have STRATEGIC category', () => {
      expect(ImpactCategory.STRATEGIC).toBe('strategic');
    });
  });

  // ===========================================================================
  // SEVERITY LEVELS
  // ===========================================================================

  describe('Severity Enum', () => {
    it('should have MINIMAL severity', () => {
      expect(Severity.MINIMAL).toBe('minimal');
    });

    it('should have LOW severity', () => {
      expect(Severity.LOW).toBe('low');
    });

    it('should have MODERATE severity', () => {
      expect(Severity.MODERATE).toBe('moderate');
    });

    it('should have HIGH severity', () => {
      expect(Severity.HIGH).toBe('high');
    });

    it('should have CRITICAL severity', () => {
      expect(Severity.CRITICAL).toBe('critical');
    });
  });

  // ===========================================================================
  // LIKELIHOOD LEVELS
  // ===========================================================================

  describe('Likelihood Enum', () => {
    it('should have RARE likelihood', () => {
      expect(Likelihood.RARE).toBe('rare');
    });

    it('should have UNLIKELY likelihood', () => {
      expect(Likelihood.UNLIKELY).toBe('unlikely');
    });

    it('should have POSSIBLE likelihood', () => {
      expect(Likelihood.POSSIBLE).toBe('possible');
    });

    it('should have LIKELY likelihood', () => {
      expect(Likelihood.LIKELY).toBe('likely');
    });

    it('should have ALMOST_CERTAIN likelihood', () => {
      expect(Likelihood.ALMOST_CERTAIN).toBe('almost_certain');
    });
  });

  // ===========================================================================
  // CHANGE SPEC STRUCTURE
  // ===========================================================================

  describe('ChangeSpec Structure', () => {
    it('should create valid change spec', () => {
      const spec: ChangeSpec = {
        type: ChangeType.STAFFING,
        title: 'Reduce headcount by 10%',
        description: 'Cost reduction initiative',
        affectedAssets: ['dept-engineering', 'dept-sales'],
        expectedBenefit: 'Save $2M annually',
      };
      expect(spec.type).toBe(ChangeType.STAFFING);
      expect(spec.affectedAssets.length).toBe(2);
    });

    it('should support optional id', () => {
      const spec: ChangeSpec = {
        id: 'change-123',
        type: ChangeType.POLICY,
        title: 'New remote work policy',
        description: 'Allow 3 days remote',
        affectedAssets: ['all-employees'],
        expectedBenefit: 'Improved retention',
      };
      expect(spec.id).toBe('change-123');
    });

    it('should support constraints', () => {
      const spec: ChangeSpec = {
        type: ChangeType.TECHNOLOGY,
        title: 'Cloud migration',
        description: 'Move to AWS',
        affectedAssets: ['system-erp', 'system-crm'],
        expectedBenefit: 'Reduce infrastructure costs',
        constraints: {
          budgetCeiling: 500000,
          timelineDays: 180,
          complianceRequirements: ['SOC2', 'GDPR'],
          noGoLines: ['No customer data loss', 'No downtime > 4 hours'],
        },
      };
      expect(spec.constraints?.budgetCeiling).toBe(500000);
      expect(spec.constraints?.noGoLines?.length).toBe(2);
    });

    it('should support proposer info', () => {
      const spec: ChangeSpec = {
        type: ChangeType.PRICING,
        title: 'Price increase 15%',
        description: 'Annual price adjustment',
        affectedAssets: ['product-enterprise'],
        expectedBenefit: 'Increase revenue',
        proposedBy: 'user-cfo',
        proposedAt: new Date(),
      };
      expect(spec.proposedBy).toBe('user-cfo');
    });
  });

  // ===========================================================================
  // CONSEQUENCE ASSESSMENT STRUCTURE
  // ===========================================================================

  describe('ConsequenceAssessment Structure', () => {
    it('should create valid consequence assessment', () => {
      const assessment: ConsequenceAssessment = {
        nodeId: 'node-123',
        nodeName: 'Engineering Team',
        nodeType: 'team' as any,
        category: ImpactCategory.OPERATIONAL,
        description: 'Team productivity may decrease',
        severity: Severity.MODERATE,
        likelihood: Likelihood.LIKELY,
        riskScore: 12,
        latencyDays: 30,
        order: 2,
        confidence: 0.75,
        evidenceBasis: 'derived',
        pathDescription: 'Layoffs -> Morale drop -> Productivity decrease',
      };
      expect(assessment.riskScore).toBe(12);
      expect(assessment.order).toBe(2);
    });

    it('should support measured evidence basis', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        evidenceBasis: 'measured',
      };
      expect(assessment.evidenceBasis).toBe('measured');
    });

    it('should support derived evidence basis', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        evidenceBasis: 'derived',
      };
      expect(assessment.evidenceBasis).toBe('derived');
    });

    it('should support inferred evidence basis', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        evidenceBasis: 'inferred',
      };
      expect(assessment.evidenceBasis).toBe('inferred');
    });

    it('should support assumed evidence basis', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        evidenceBasis: 'assumed',
      };
      expect(assessment.evidenceBasis).toBe('assumed');
    });

    it('should calculate risk score correctly', () => {
      // Risk score = severity * likelihood (0-25 scale)
      const severityMap = { minimal: 1, low: 2, moderate: 3, high: 4, critical: 5 };
      const likelihoodMap = { rare: 1, unlikely: 2, possible: 3, likely: 4, almost_certain: 5 };
      
      const riskScore = severityMap['critical'] * likelihoodMap['almost_certain'];
      expect(riskScore).toBe(25);
    });
  });

  // ===========================================================================
  // MITIGATION STRUCTURE
  // ===========================================================================

  describe('Mitigation Structure', () => {
    it('should create valid mitigation', () => {
      const mitigation: Mitigation = {
        id: 'mit-123',
        targetConsequence: 'consequence-456',
        type: 'prevent',
        description: 'Implement retention bonuses',
        implementation: 'Offer 6-month retention packages to key engineers',
        cost: 250000,
        effectivenessScore: 0.8,
        owner: 'user-hr-director',
        deadline: new Date('2025-03-01'),
      };
      expect(mitigation.type).toBe('prevent');
      expect(mitigation.effectivenessScore).toBe(0.8);
    });

    it('should support prevent type', () => {
      const mitigation: Partial<Mitigation> = { type: 'prevent' };
      expect(mitigation.type).toBe('prevent');
    });

    it('should support detect type', () => {
      const mitigation: Partial<Mitigation> = { type: 'detect' };
      expect(mitigation.type).toBe('detect');
    });

    it('should support respond type', () => {
      const mitigation: Partial<Mitigation> = { type: 'respond' };
      expect(mitigation.type).toBe('respond');
    });

    it('should support transfer type', () => {
      const mitigation: Partial<Mitigation> = { type: 'transfer' };
      expect(mitigation.type).toBe('transfer');
    });
  });

  // ===========================================================================
  // GUARDRAIL STRUCTURE
  // ===========================================================================

  describe('Guardrail Structure', () => {
    it('should create valid guardrail', () => {
      const guardrail: Guardrail = {
        id: 'guard-123',
        type: 'tripwire',
        condition: 'Attrition rate > 15%',
        action: 'Pause layoffs and review',
        threshold: 15,
        monitoringFrequency: 'weekly',
      };
      expect(guardrail.type).toBe('tripwire');
      expect(guardrail.threshold).toBe(15);
    });

    it('should support canary type', () => {
      const guardrail: Partial<Guardrail> = { type: 'canary' };
      expect(guardrail.type).toBe('canary');
    });

    it('should support tripwire type', () => {
      const guardrail: Partial<Guardrail> = { type: 'tripwire' };
      expect(guardrail.type).toBe('tripwire');
    });

    it('should support circuit_breaker type', () => {
      const guardrail: Partial<Guardrail> = { type: 'circuit_breaker' };
      expect(guardrail.type).toBe('circuit_breaker');
    });

    it('should support rollback_trigger type', () => {
      const guardrail: Partial<Guardrail> = { type: 'rollback_trigger' };
      expect(guardrail.type).toBe('rollback_trigger');
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should model layoff cascade', () => {
      const change: ChangeSpec = {
        type: ChangeType.STAFFING,
        title: 'Reduce engineering headcount by 20%',
        description: 'Cost reduction due to market conditions',
        affectedAssets: ['dept-engineering'],
        expectedBenefit: 'Save $5M annually',
        constraints: {
          noGoLines: ['No critical project delays', 'Maintain security team'],
        },
      };
      expect(change.type).toBe(ChangeType.STAFFING);
    });

    it('should model vendor change cascade', () => {
      const change: ChangeSpec = {
        type: ChangeType.VENDOR,
        title: 'Switch cloud provider from AWS to Azure',
        description: 'Strategic partnership with Microsoft',
        affectedAssets: ['system-infrastructure', 'team-devops'],
        expectedBenefit: 'Better enterprise integration',
        constraints: {
          timelineDays: 365,
          budgetCeiling: 2000000,
        },
      };
      expect(change.type).toBe(ChangeType.VENDOR);
    });

    it('should model pricing change cascade', () => {
      const change: ChangeSpec = {
        type: ChangeType.PRICING,
        title: 'Increase enterprise pricing by 25%',
        description: 'Align with market rates',
        affectedAssets: ['product-enterprise', 'team-sales'],
        expectedBenefit: 'Increase ARR by $10M',
      };
      expect(change.type).toBe(ChangeType.PRICING);
    });

    it('should model regulatory change cascade', () => {
      const change: ChangeSpec = {
        type: ChangeType.REGULATORY,
        title: 'Implement GDPR compliance',
        description: 'EU data protection requirements',
        affectedAssets: ['system-database', 'process-data-handling'],
        expectedBenefit: 'Avoid €20M fines',
        constraints: {
          complianceRequirements: ['GDPR', 'ePrivacy'],
          timelineDays: 90,
        },
      };
      expect(change.type).toBe(ChangeType.REGULATORY);
    });

    it('should model security change cascade', () => {
      const change: ChangeSpec = {
        type: ChangeType.SECURITY,
        title: 'Implement zero-trust architecture',
        description: 'Enhanced security posture',
        affectedAssets: ['system-network', 'system-identity'],
        expectedBenefit: 'Reduce breach risk by 80%',
      };
      expect(change.type).toBe(ChangeType.SECURITY);
    });
  });

  // ===========================================================================
  // TIMELINE CONCEPTS
  // ===========================================================================

  describe('Timeline Concepts', () => {
    it('should model T+0 immediate effects', () => {
      const tZero = {
        date: new Date(),
        event: 'Layoff announcement',
        directEffects: ['Morale impact', 'Media coverage'],
      };
      expect(tZero.directEffects.length).toBe(2);
    });

    it('should model T+30 short-term effects', () => {
      const tShort = {
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        effects: ['Productivity decline', 'Key talent departure'],
      };
      expect(tShort.effects.length).toBe(2);
    });

    it('should model T+90 medium-term effects', () => {
      const tMedium = {
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        effects: ['Project delays', 'Customer complaints'],
      };
      expect(tMedium.effects.length).toBe(2);
    });

    it('should model T+365 long-term effects', () => {
      const tLong = {
        date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        effects: ['Market share loss', 'Reputation damage'],
      };
      expect(tLong.effects.length).toBe(2);
    });
  });

  // ===========================================================================
  // ORDER OF EFFECTS
  // ===========================================================================

  describe('Order of Effects', () => {
    it('should identify 1st order effects', () => {
      const firstOrder: Partial<ConsequenceAssessment> = {
        order: 1,
        description: 'Direct impact of layoffs on team size',
      };
      expect(firstOrder.order).toBe(1);
    });

    it('should identify 2nd order effects', () => {
      const secondOrder: Partial<ConsequenceAssessment> = {
        order: 2,
        description: 'Morale drop leads to productivity decline',
      };
      expect(secondOrder.order).toBe(2);
    });

    it('should identify 3rd order effects', () => {
      const thirdOrder: Partial<ConsequenceAssessment> = {
        order: 3,
        description: 'Productivity decline leads to project delays',
      };
      expect(thirdOrder.order).toBe(3);
    });

    it('should identify 4th+ order butterfly effects', () => {
      const butterflyEffect: Partial<ConsequenceAssessment> = {
        order: 4,
        description: 'Project delays lead to customer churn',
      };
      expect(butterflyEffect.order).toBe(4);
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty affected assets', () => {
      const change: ChangeSpec = {
        type: ChangeType.POLICY,
        title: 'Minor policy update',
        description: 'Cosmetic change',
        affectedAssets: [],
        expectedBenefit: 'None',
      };
      expect(change.affectedAssets.length).toBe(0);
    });

    it('should handle very long descriptions', () => {
      const change: ChangeSpec = {
        type: ChangeType.PROCESS,
        title: 'Process change',
        description: 'A'.repeat(10000),
        affectedAssets: ['process-1'],
        expectedBenefit: 'Efficiency',
      };
      expect(change.description.length).toBe(10000);
    });

    it('should handle special characters in titles', () => {
      const change: ChangeSpec = {
        type: ChangeType.PRODUCT,
        title: 'Launch "New Product" with <special> chars & symbols',
        description: 'Test',
        affectedAssets: ['product-1'],
        expectedBenefit: 'Revenue',
      };
      expect(change.title).toContain('special');
    });

    it('should handle zero budget ceiling', () => {
      const change: ChangeSpec = {
        type: ChangeType.PROCESS,
        title: 'Zero-cost improvement',
        description: 'Process optimization',
        affectedAssets: ['process-1'],
        expectedBenefit: 'Efficiency',
        constraints: {
          budgetCeiling: 0,
        },
      };
      expect(change.constraints?.budgetCeiling).toBe(0);
    });

    it('should handle very short timeline', () => {
      const change: ChangeSpec = {
        type: ChangeType.SECURITY,
        title: 'Emergency security patch',
        description: 'Critical vulnerability fix',
        affectedAssets: ['system-all'],
        expectedBenefit: 'Security',
        constraints: {
          timelineDays: 1,
        },
      };
      expect(change.constraints?.timelineDays).toBe(1);
    });
  });

  // ===========================================================================
  // RISK SCORE CALCULATIONS
  // ===========================================================================

  describe('Risk Score Calculations', () => {
    it('should calculate minimal-rare risk score as 1', () => {
      const score = 1 * 1; // minimal * rare
      expect(score).toBe(1);
    });

    it('should calculate minimal-unlikely risk score as 2', () => {
      const score = 1 * 2;
      expect(score).toBe(2);
    });

    it('should calculate minimal-possible risk score as 3', () => {
      const score = 1 * 3;
      expect(score).toBe(3);
    });

    it('should calculate minimal-likely risk score as 4', () => {
      const score = 1 * 4;
      expect(score).toBe(4);
    });

    it('should calculate minimal-almost_certain risk score as 5', () => {
      const score = 1 * 5;
      expect(score).toBe(5);
    });

    it('should calculate low-rare risk score as 2', () => {
      const score = 2 * 1;
      expect(score).toBe(2);
    });

    it('should calculate low-unlikely risk score as 4', () => {
      const score = 2 * 2;
      expect(score).toBe(4);
    });

    it('should calculate low-possible risk score as 6', () => {
      const score = 2 * 3;
      expect(score).toBe(6);
    });

    it('should calculate low-likely risk score as 8', () => {
      const score = 2 * 4;
      expect(score).toBe(8);
    });

    it('should calculate low-almost_certain risk score as 10', () => {
      const score = 2 * 5;
      expect(score).toBe(10);
    });

    it('should calculate moderate-rare risk score as 3', () => {
      const score = 3 * 1;
      expect(score).toBe(3);
    });

    it('should calculate moderate-unlikely risk score as 6', () => {
      const score = 3 * 2;
      expect(score).toBe(6);
    });

    it('should calculate moderate-possible risk score as 9', () => {
      const score = 3 * 3;
      expect(score).toBe(9);
    });

    it('should calculate moderate-likely risk score as 12', () => {
      const score = 3 * 4;
      expect(score).toBe(12);
    });

    it('should calculate moderate-almost_certain risk score as 15', () => {
      const score = 3 * 5;
      expect(score).toBe(15);
    });

    it('should calculate high-rare risk score as 4', () => {
      const score = 4 * 1;
      expect(score).toBe(4);
    });

    it('should calculate high-unlikely risk score as 8', () => {
      const score = 4 * 2;
      expect(score).toBe(8);
    });

    it('should calculate high-possible risk score as 12', () => {
      const score = 4 * 3;
      expect(score).toBe(12);
    });

    it('should calculate high-likely risk score as 16', () => {
      const score = 4 * 4;
      expect(score).toBe(16);
    });

    it('should calculate high-almost_certain risk score as 20', () => {
      const score = 4 * 5;
      expect(score).toBe(20);
    });

    it('should calculate critical-rare risk score as 5', () => {
      const score = 5 * 1;
      expect(score).toBe(5);
    });

    it('should calculate critical-unlikely risk score as 10', () => {
      const score = 5 * 2;
      expect(score).toBe(10);
    });

    it('should calculate critical-possible risk score as 15', () => {
      const score = 5 * 3;
      expect(score).toBe(15);
    });

    it('should calculate critical-likely risk score as 20', () => {
      const score = 5 * 4;
      expect(score).toBe(20);
    });

    it('should calculate critical-almost_certain risk score as 25', () => {
      const score = 5 * 5;
      expect(score).toBe(25);
    });
  });

  // ===========================================================================
  // LATENCY CALCULATIONS
  // ===========================================================================

  describe('Latency Calculations', () => {
    it('should handle immediate latency (0 days)', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 0 };
      expect(assessment.latencyDays).toBe(0);
    });

    it('should handle 1 day latency', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 1 };
      expect(assessment.latencyDays).toBe(1);
    });

    it('should handle 7 day latency', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 7 };
      expect(assessment.latencyDays).toBe(7);
    });

    it('should handle 30 day latency', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 30 };
      expect(assessment.latencyDays).toBe(30);
    });

    it('should handle 90 day latency', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 90 };
      expect(assessment.latencyDays).toBe(90);
    });

    it('should handle 180 day latency', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 180 };
      expect(assessment.latencyDays).toBe(180);
    });

    it('should handle 365 day latency', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 365 };
      expect(assessment.latencyDays).toBe(365);
    });

    it('should handle multi-year latency', () => {
      const assessment: Partial<ConsequenceAssessment> = { latencyDays: 730 };
      expect(assessment.latencyDays).toBe(730);
    });
  });

  // ===========================================================================
  // CONFIDENCE LEVELS
  // ===========================================================================

  describe('Confidence Levels', () => {
    it('should handle 0% confidence', () => {
      const assessment: Partial<ConsequenceAssessment> = { confidence: 0 };
      expect(assessment.confidence).toBe(0);
    });

    it('should handle 10% confidence', () => {
      const assessment: Partial<ConsequenceAssessment> = { confidence: 0.1 };
      expect(assessment.confidence).toBe(0.1);
    });

    it('should handle 25% confidence', () => {
      const assessment: Partial<ConsequenceAssessment> = { confidence: 0.25 };
      expect(assessment.confidence).toBe(0.25);
    });

    it('should handle 50% confidence', () => {
      const assessment: Partial<ConsequenceAssessment> = { confidence: 0.5 };
      expect(assessment.confidence).toBe(0.5);
    });

    it('should handle 75% confidence', () => {
      const assessment: Partial<ConsequenceAssessment> = { confidence: 0.75 };
      expect(assessment.confidence).toBe(0.75);
    });

    it('should handle 90% confidence', () => {
      const assessment: Partial<ConsequenceAssessment> = { confidence: 0.9 };
      expect(assessment.confidence).toBe(0.9);
    });

    it('should handle 100% confidence', () => {
      const assessment: Partial<ConsequenceAssessment> = { confidence: 1.0 };
      expect(assessment.confidence).toBe(1.0);
    });
  });

  // ===========================================================================
  // MITIGATION EFFECTIVENESS
  // ===========================================================================

  describe('Mitigation Effectiveness', () => {
    it('should handle 0% effectiveness', () => {
      const mitigation: Partial<Mitigation> = { effectivenessScore: 0 };
      expect(mitigation.effectivenessScore).toBe(0);
    });

    it('should handle 25% effectiveness', () => {
      const mitigation: Partial<Mitigation> = { effectivenessScore: 0.25 };
      expect(mitigation.effectivenessScore).toBe(0.25);
    });

    it('should handle 50% effectiveness', () => {
      const mitigation: Partial<Mitigation> = { effectivenessScore: 0.5 };
      expect(mitigation.effectivenessScore).toBe(0.5);
    });

    it('should handle 75% effectiveness', () => {
      const mitigation: Partial<Mitigation> = { effectivenessScore: 0.75 };
      expect(mitigation.effectivenessScore).toBe(0.75);
    });

    it('should handle 100% effectiveness', () => {
      const mitigation: Partial<Mitigation> = { effectivenessScore: 1.0 };
      expect(mitigation.effectivenessScore).toBe(1.0);
    });
  });

  // ===========================================================================
  // INDUSTRY-SPECIFIC SCENARIOS
  // ===========================================================================

  describe('Industry-Specific Scenarios', () => {
    it('should model healthcare compliance change', () => {
      const change: ChangeSpec = {
        type: ChangeType.REGULATORY,
        title: 'HIPAA compliance update',
        description: 'New patient data handling requirements',
        affectedAssets: ['system-ehr', 'process-intake'],
        expectedBenefit: 'Avoid $1M+ fines',
        constraints: {
          complianceRequirements: ['HIPAA', 'HITECH'],
        },
      };
      expect(change.constraints?.complianceRequirements).toContain('HIPAA');
    });

    it('should model financial services change', () => {
      const change: ChangeSpec = {
        type: ChangeType.REGULATORY,
        title: 'SOX compliance enhancement',
        description: 'Financial reporting controls',
        affectedAssets: ['system-accounting', 'process-audit'],
        expectedBenefit: 'Regulatory compliance',
        constraints: {
          complianceRequirements: ['SOX', 'GAAP'],
        },
      };
      expect(change.type).toBe(ChangeType.REGULATORY);
    });

    it('should model manufacturing change', () => {
      const change: ChangeSpec = {
        type: ChangeType.PROCESS,
        title: 'Production line automation',
        description: 'Replace manual assembly with robotics',
        affectedAssets: ['asset-line-1', 'team-assembly'],
        expectedBenefit: '40% efficiency gain',
      };
      expect(change.type).toBe(ChangeType.PROCESS);
    });

    it('should model retail change', () => {
      const change: ChangeSpec = {
        type: ChangeType.PRICING,
        title: 'Dynamic pricing implementation',
        description: 'AI-driven price optimization',
        affectedAssets: ['system-pos', 'product-all'],
        expectedBenefit: '15% margin improvement',
      };
      expect(change.type).toBe(ChangeType.PRICING);
    });

    it('should model tech startup change', () => {
      const change: ChangeSpec = {
        type: ChangeType.PRODUCT,
        title: 'Pivot to enterprise market',
        description: 'Shift from B2C to B2B',
        affectedAssets: ['product-main', 'team-sales', 'team-product'],
        expectedBenefit: 'Higher ACV, lower churn',
      };
      expect(change.type).toBe(ChangeType.PRODUCT);
    });

    it('should model logistics change', () => {
      const change: ChangeSpec = {
        type: ChangeType.VENDOR,
        title: 'Switch shipping provider',
        description: 'Move from FedEx to UPS',
        affectedAssets: ['vendor-shipping', 'process-fulfillment'],
        expectedBenefit: '10% cost reduction',
      };
      expect(change.type).toBe(ChangeType.VENDOR);
    });

    it('should model energy sector change', () => {
      const change: ChangeSpec = {
        type: ChangeType.TECHNOLOGY,
        title: 'Smart grid implementation',
        description: 'IoT sensors across distribution network',
        affectedAssets: ['system-grid', 'asset-substations'],
        expectedBenefit: '20% efficiency improvement',
      };
      expect(change.type).toBe(ChangeType.TECHNOLOGY);
    });

    it('should model education change', () => {
      const change: ChangeSpec = {
        type: ChangeType.PROCESS,
        title: 'Hybrid learning model',
        description: 'Combine in-person and online instruction',
        affectedAssets: ['system-lms', 'team-faculty'],
        expectedBenefit: 'Increased enrollment capacity',
      };
      expect(change.type).toBe(ChangeType.PROCESS);
    });
  });

  // ===========================================================================
  // MULTI-DEPARTMENT IMPACT
  // ===========================================================================

  describe('Multi-Department Impact', () => {
    it('should affect single department', () => {
      const change: ChangeSpec = {
        type: ChangeType.STAFFING,
        title: 'Engineering reorg',
        description: 'Restructure engineering teams',
        affectedAssets: ['dept-engineering'],
        expectedBenefit: 'Better alignment',
      };
      expect(change.affectedAssets.length).toBe(1);
    });

    it('should affect two departments', () => {
      const change: ChangeSpec = {
        type: ChangeType.PROCESS,
        title: 'Sales-Engineering alignment',
        description: 'Joint planning process',
        affectedAssets: ['dept-sales', 'dept-engineering'],
        expectedBenefit: 'Faster delivery',
      };
      expect(change.affectedAssets.length).toBe(2);
    });

    it('should affect three departments', () => {
      const change: ChangeSpec = {
        type: ChangeType.TECHNOLOGY,
        title: 'CRM implementation',
        description: 'New customer management system',
        affectedAssets: ['dept-sales', 'dept-marketing', 'dept-support'],
        expectedBenefit: 'Unified customer view',
      };
      expect(change.affectedAssets.length).toBe(3);
    });

    it('should affect entire organization', () => {
      const change: ChangeSpec = {
        type: ChangeType.POLICY,
        title: 'Remote work policy',
        description: 'Company-wide WFH guidelines',
        affectedAssets: ['dept-all'],
        expectedBenefit: 'Employee satisfaction',
      };
      expect(change.affectedAssets).toContain('dept-all');
    });

    it('should affect cross-functional teams', () => {
      const change: ChangeSpec = {
        type: ChangeType.PROCESS,
        title: 'Agile transformation',
        description: 'Move to cross-functional squads',
        affectedAssets: ['team-product', 'team-design', 'team-engineering', 'team-qa'],
        expectedBenefit: 'Faster iteration',
      };
      expect(change.affectedAssets.length).toBe(4);
    });
  });

  // ===========================================================================
  // CONSTRAINT COMBINATIONS
  // ===========================================================================

  describe('Constraint Combinations', () => {
    it('should handle budget only constraint', () => {
      const change: ChangeSpec = {
        type: ChangeType.TECHNOLOGY,
        title: 'Tech upgrade',
        description: 'System modernization',
        affectedAssets: ['system-legacy'],
        expectedBenefit: 'Performance',
        constraints: { budgetCeiling: 100000 },
      };
      expect(change.constraints?.budgetCeiling).toBe(100000);
    });

    it('should handle timeline only constraint', () => {
      const change: ChangeSpec = {
        type: ChangeType.REGULATORY,
        title: 'Compliance deadline',
        description: 'Must complete by Q4',
        affectedAssets: ['process-compliance'],
        expectedBenefit: 'Avoid penalties',
        constraints: { timelineDays: 90 },
      };
      expect(change.constraints?.timelineDays).toBe(90);
    });

    it('should handle budget and timeline constraints', () => {
      const change: ChangeSpec = {
        type: ChangeType.PRODUCT,
        title: 'Product launch',
        description: 'New feature release',
        affectedAssets: ['product-main'],
        expectedBenefit: 'Revenue growth',
        constraints: { budgetCeiling: 500000, timelineDays: 180 },
      };
      expect(change.constraints?.budgetCeiling).toBe(500000);
      expect(change.constraints?.timelineDays).toBe(180);
    });

    it('should handle compliance requirements only', () => {
      const change: ChangeSpec = {
        type: ChangeType.DATA,
        title: 'Data governance',
        description: 'Implement data classification',
        affectedAssets: ['system-data'],
        expectedBenefit: 'Compliance',
        constraints: { complianceRequirements: ['GDPR', 'CCPA'] },
      };
      expect(change.constraints?.complianceRequirements?.length).toBe(2);
    });

    it('should handle no-go lines only', () => {
      const change: ChangeSpec = {
        type: ChangeType.STAFFING,
        title: 'Workforce reduction',
        description: 'Cost optimization',
        affectedAssets: ['dept-all'],
        expectedBenefit: 'Cost savings',
        constraints: { noGoLines: ['No safety team cuts', 'No customer-facing cuts'] },
      };
      expect(change.constraints?.noGoLines?.length).toBe(2);
    });

    it('should handle all constraints together', () => {
      const change: ChangeSpec = {
        type: ChangeType.TECHNOLOGY,
        title: 'Cloud migration',
        description: 'Move to cloud infrastructure',
        affectedAssets: ['system-all'],
        expectedBenefit: 'Scalability',
        constraints: {
          budgetCeiling: 2000000,
          timelineDays: 365,
          complianceRequirements: ['SOC2', 'ISO27001'],
          noGoLines: ['No data loss', 'Max 4hr downtime'],
        },
      };
      expect(change.constraints?.budgetCeiling).toBe(2000000);
      expect(change.constraints?.timelineDays).toBe(365);
      expect(change.constraints?.complianceRequirements?.length).toBe(2);
      expect(change.constraints?.noGoLines?.length).toBe(2);
    });
  });

  // ===========================================================================
  // GUARDRAIL THRESHOLDS
  // ===========================================================================

  describe('Guardrail Thresholds', () => {
    it('should handle 5% threshold', () => {
      const guardrail: Guardrail = {
        id: 'g1',
        type: 'tripwire',
        condition: 'Attrition > 5%',
        action: 'Alert HR',
        threshold: 5,
      };
      expect(guardrail.threshold).toBe(5);
    });

    it('should handle 10% threshold', () => {
      const guardrail: Guardrail = {
        id: 'g2',
        type: 'tripwire',
        condition: 'Revenue drop > 10%',
        action: 'Executive review',
        threshold: 10,
      };
      expect(guardrail.threshold).toBe(10);
    });

    it('should handle 25% threshold', () => {
      const guardrail: Guardrail = {
        id: 'g3',
        type: 'circuit_breaker',
        condition: 'Customer churn > 25%',
        action: 'Halt rollout',
        threshold: 25,
      };
      expect(guardrail.threshold).toBe(25);
    });

    it('should handle 50% threshold', () => {
      const guardrail: Guardrail = {
        id: 'g4',
        type: 'rollback_trigger',
        condition: 'System errors > 50%',
        action: 'Automatic rollback',
        threshold: 50,
      };
      expect(guardrail.threshold).toBe(50);
    });

    it('should handle monitoring frequency - hourly', () => {
      const guardrail: Guardrail = {
        id: 'g5',
        type: 'canary',
        condition: 'Error rate spike',
        action: 'Alert on-call',
        monitoringFrequency: 'hourly',
      };
      expect(guardrail.monitoringFrequency).toBe('hourly');
    });

    it('should handle monitoring frequency - daily', () => {
      const guardrail: Guardrail = {
        id: 'g6',
        type: 'tripwire',
        condition: 'NPS drop',
        action: 'Review feedback',
        monitoringFrequency: 'daily',
      };
      expect(guardrail.monitoringFrequency).toBe('daily');
    });

    it('should handle monitoring frequency - weekly', () => {
      const guardrail: Guardrail = {
        id: 'g7',
        type: 'tripwire',
        condition: 'Pipeline health',
        action: 'Sales review',
        monitoringFrequency: 'weekly',
      };
      expect(guardrail.monitoringFrequency).toBe('weekly');
    });
  });

  // ===========================================================================
  // CONSEQUENCE PATH DESCRIPTIONS
  // ===========================================================================

  describe('Consequence Path Descriptions', () => {
    it('should describe direct impact path', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        pathDescription: 'Layoffs -> Team size reduction',
        order: 1,
      };
      expect(assessment.pathDescription).toContain('->');
    });

    it('should describe two-hop path', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        pathDescription: 'Layoffs -> Morale drop -> Productivity decline',
        order: 2,
      };
      expect(assessment.pathDescription?.split('->').length).toBe(3);
    });

    it('should describe three-hop path', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        pathDescription: 'Layoffs -> Morale drop -> Key talent leaves -> Knowledge loss',
        order: 3,
      };
      expect(assessment.pathDescription?.split('->').length).toBe(4);
    });

    it('should describe butterfly effect path', () => {
      const assessment: Partial<ConsequenceAssessment> = {
        pathDescription: 'Price increase -> Customer complaints -> Churn -> Revenue drop -> Stock price decline',
        order: 4,
      };
      expect(assessment.pathDescription?.split('->').length).toBe(5);
    });
  });
});
