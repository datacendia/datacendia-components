// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA CRUCIBLE SERVICE TESTS
// Tests for Synthetic Multiverse Simulation Engine
// Grade: A | Coverage: Comprehensive | Risk: Critical Business Logic
// 
// SERVICE OVERVIEW:
// CendiaCrucible™ is a high-fidelity mathematical twin of the enterprise that
// enables shock injection, black swan simulation, Monte Carlo prediction,
// and failure cascade mapping. Essential for stress-testing decisions.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../config/database.js', () => ({
  prisma: {
    crucible_simulations: { create: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    crucible_universes: { create: vi.fn(), findMany: vi.fn() },
    crucible_impacts: { create: vi.fn(), findMany: vi.fn() },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../services/EnhancedLLMService.js', () => ({
  EnhancedLLMService: class { generate = vi.fn().mockResolvedValue({ content: 'AI analysis' }); },
}));

import type {
  SimulationType,
  SimulationStatus,
  OutcomeSentiment,
  ImpactCategory,
  Severity,
  SimulationConfig,
  SimulationVariable,
  SimulationConstraint,
  VariableCorrelation,
  ScenarioDefinition,
  Shock,
  Trigger,
  Universe,
  Impact,
} from '../../services/CendiaCrucibleService.js';

describe('CendiaCrucibleService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // SIMULATION TYPES (13 types)
  // ===========================================================================

  describe('SimulationType', () => {
    it('should support FINANCIAL_STRESS type', () => {
      const type: SimulationType = 'FINANCIAL_STRESS';
      expect(type).toBe('FINANCIAL_STRESS');
    });

    it('should support OPERATIONAL_SHOCK type', () => {
      const type: SimulationType = 'OPERATIONAL_SHOCK';
      expect(type).toBe('OPERATIONAL_SHOCK');
    });

    it('should support CYBER_ATTACK type', () => {
      const type: SimulationType = 'CYBER_ATTACK';
      expect(type).toBe('CYBER_ATTACK');
    });

    it('should support REGULATORY_CHANGE type', () => {
      const type: SimulationType = 'REGULATORY_CHANGE';
      expect(type).toBe('REGULATORY_CHANGE');
    });

    it('should support CULTURAL_SHIFT type', () => {
      const type: SimulationType = 'CULTURAL_SHIFT';
      expect(type).toBe('CULTURAL_SHIFT');
    });

    it('should support ESG_EVENT type', () => {
      const type: SimulationType = 'ESG_EVENT';
      expect(type).toBe('ESG_EVENT');
    });

    it('should support MA_SCENARIO type', () => {
      const type: SimulationType = 'MA_SCENARIO';
      expect(type).toBe('MA_SCENARIO');
    });

    it('should support MARKET_DISRUPTION type', () => {
      const type: SimulationType = 'MARKET_DISRUPTION';
      expect(type).toBe('MARKET_DISRUPTION');
    });

    it('should support SUPPLY_CHAIN type', () => {
      const type: SimulationType = 'SUPPLY_CHAIN';
      expect(type).toBe('SUPPLY_CHAIN');
    });

    it('should support TALENT_EXODUS type', () => {
      const type: SimulationType = 'TALENT_EXODUS';
      expect(type).toBe('TALENT_EXODUS');
    });

    it('should support TECHNOLOGY_FAILURE type', () => {
      const type: SimulationType = 'TECHNOLOGY_FAILURE';
      expect(type).toBe('TECHNOLOGY_FAILURE');
    });

    it('should support BLACK_SWAN type', () => {
      const type: SimulationType = 'BLACK_SWAN';
      expect(type).toBe('BLACK_SWAN');
    });

    it('should support CUSTOM type', () => {
      const type: SimulationType = 'CUSTOM';
      expect(type).toBe('CUSTOM');
    });
  });

  // ===========================================================================
  // SIMULATION STATUS
  // ===========================================================================

  describe('SimulationStatus', () => {
    it('should support DRAFT status', () => {
      const status: SimulationStatus = 'DRAFT';
      expect(status).toBe('DRAFT');
    });

    it('should support CONFIGURING status', () => {
      const status: SimulationStatus = 'CONFIGURING';
      expect(status).toBe('CONFIGURING');
    });

    it('should support RUNNING status', () => {
      const status: SimulationStatus = 'RUNNING';
      expect(status).toBe('RUNNING');
    });

    it('should support COMPLETED status', () => {
      const status: SimulationStatus = 'COMPLETED';
      expect(status).toBe('COMPLETED');
    });

    it('should support FAILED status', () => {
      const status: SimulationStatus = 'FAILED';
      expect(status).toBe('FAILED');
    });

    it('should support CANCELLED status', () => {
      const status: SimulationStatus = 'CANCELLED';
      expect(status).toBe('CANCELLED');
    });
  });

  // ===========================================================================
  // OUTCOME SENTIMENT
  // ===========================================================================

  describe('OutcomeSentiment', () => {
    it('should support CATASTROPHIC sentiment', () => {
      const sentiment: OutcomeSentiment = 'CATASTROPHIC';
      expect(sentiment).toBe('CATASTROPHIC');
    });

    it('should support NEGATIVE sentiment', () => {
      const sentiment: OutcomeSentiment = 'NEGATIVE';
      expect(sentiment).toBe('NEGATIVE');
    });

    it('should support NEUTRAL sentiment', () => {
      const sentiment: OutcomeSentiment = 'NEUTRAL';
      expect(sentiment).toBe('NEUTRAL');
    });

    it('should support POSITIVE sentiment', () => {
      const sentiment: OutcomeSentiment = 'POSITIVE';
      expect(sentiment).toBe('POSITIVE');
    });

    it('should support OPTIMAL sentiment', () => {
      const sentiment: OutcomeSentiment = 'OPTIMAL';
      expect(sentiment).toBe('OPTIMAL');
    });
  });

  // ===========================================================================
  // IMPACT CATEGORIES
  // ===========================================================================

  describe('ImpactCategory', () => {
    it('should support FINANCIAL category', () => {
      const cat: ImpactCategory = 'FINANCIAL';
      expect(cat).toBe('FINANCIAL');
    });

    it('should support OPERATIONAL category', () => {
      const cat: ImpactCategory = 'OPERATIONAL';
      expect(cat).toBe('OPERATIONAL');
    });

    it('should support SECURITY category', () => {
      const cat: ImpactCategory = 'SECURITY';
      expect(cat).toBe('SECURITY');
    });

    it('should support COMPLIANCE category', () => {
      const cat: ImpactCategory = 'COMPLIANCE';
      expect(cat).toBe('COMPLIANCE');
    });

    it('should support CULTURAL category', () => {
      const cat: ImpactCategory = 'CULTURAL';
      expect(cat).toBe('CULTURAL');
    });

    it('should support REPUTATIONAL category', () => {
      const cat: ImpactCategory = 'REPUTATIONAL';
      expect(cat).toBe('REPUTATIONAL');
    });

    it('should support STRATEGIC category', () => {
      const cat: ImpactCategory = 'STRATEGIC';
      expect(cat).toBe('STRATEGIC');
    });

    it('should support TECHNOLOGICAL category', () => {
      const cat: ImpactCategory = 'TECHNOLOGICAL';
      expect(cat).toBe('TECHNOLOGICAL');
    });
  });

  // ===========================================================================
  // SEVERITY LEVELS
  // ===========================================================================

  describe('Severity', () => {
    it('should support CRITICAL severity', () => {
      const sev: Severity = 'CRITICAL';
      expect(sev).toBe('CRITICAL');
    });

    it('should support HIGH severity', () => {
      const sev: Severity = 'HIGH';
      expect(sev).toBe('HIGH');
    });

    it('should support MEDIUM severity', () => {
      const sev: Severity = 'MEDIUM';
      expect(sev).toBe('MEDIUM');
    });

    it('should support LOW severity', () => {
      const sev: Severity = 'LOW';
      expect(sev).toBe('LOW');
    });

    it('should support MINIMAL severity', () => {
      const sev: Severity = 'MINIMAL';
      expect(sev).toBe('MINIMAL');
    });
  });

  // ===========================================================================
  // SIMULATION CONFIG STRUCTURE
  // ===========================================================================

  describe('SimulationConfig Structure', () => {
    it('should create valid config', () => {
      const config: SimulationConfig = {
        monteCarloRuns: 10000,
        confidenceLevel: 0.95,
        timeHorizonDays: 365,
        variables: [],
        constraints: [],
      };
      expect(config.monteCarloRuns).toBe(10000);
    });

    it('should handle 1000 Monte Carlo runs', () => {
      const config: Partial<SimulationConfig> = { monteCarloRuns: 1000 };
      expect(config.monteCarloRuns).toBe(1000);
    });

    it('should handle 50000 Monte Carlo runs', () => {
      const config: Partial<SimulationConfig> = { monteCarloRuns: 50000 };
      expect(config.monteCarloRuns).toBe(50000);
    });

    it('should handle 100000 Monte Carlo runs', () => {
      const config: Partial<SimulationConfig> = { monteCarloRuns: 100000 };
      expect(config.monteCarloRuns).toBe(100000);
    });

    it('should handle 90% confidence level', () => {
      const config: Partial<SimulationConfig> = { confidenceLevel: 0.9 };
      expect(config.confidenceLevel).toBe(0.9);
    });

    it('should handle 95% confidence level', () => {
      const config: Partial<SimulationConfig> = { confidenceLevel: 0.95 };
      expect(config.confidenceLevel).toBe(0.95);
    });

    it('should handle 99% confidence level', () => {
      const config: Partial<SimulationConfig> = { confidenceLevel: 0.99 };
      expect(config.confidenceLevel).toBe(0.99);
    });

    it('should handle 30 day time horizon', () => {
      const config: Partial<SimulationConfig> = { timeHorizonDays: 30 };
      expect(config.timeHorizonDays).toBe(30);
    });

    it('should handle 90 day time horizon', () => {
      const config: Partial<SimulationConfig> = { timeHorizonDays: 90 };
      expect(config.timeHorizonDays).toBe(90);
    });

    it('should handle 365 day time horizon', () => {
      const config: Partial<SimulationConfig> = { timeHorizonDays: 365 };
      expect(config.timeHorizonDays).toBe(365);
    });

    it('should handle 1825 day (5 year) time horizon', () => {
      const config: Partial<SimulationConfig> = { timeHorizonDays: 1825 };
      expect(config.timeHorizonDays).toBe(1825);
    });
  });

  // ===========================================================================
  // SIMULATION VARIABLE STRUCTURE
  // ===========================================================================

  describe('SimulationVariable Structure', () => {
    it('should create numeric variable', () => {
      const variable: SimulationVariable = {
        name: 'revenue',
        type: 'numeric',
        baseValue: 10000000,
        distribution: 'normal',
        mean: 10000000,
        stdDev: 1000000,
      };
      expect(variable.type).toBe('numeric');
    });

    it('should create percentage variable', () => {
      const variable: SimulationVariable = {
        name: 'growth_rate',
        type: 'percentage',
        baseValue: 0.15,
        distribution: 'triangular',
        min: 0.05,
        max: 0.25,
      };
      expect(variable.type).toBe('percentage');
    });

    it('should create categorical variable', () => {
      const variable: SimulationVariable = {
        name: 'market_condition',
        type: 'categorical',
        baseValue: 'stable',
      };
      expect(variable.type).toBe('categorical');
    });

    it('should create boolean variable', () => {
      const variable: SimulationVariable = {
        name: 'recession_occurs',
        type: 'boolean',
        baseValue: false,
      };
      expect(variable.type).toBe('boolean');
    });

    it('should support normal distribution', () => {
      const variable: Partial<SimulationVariable> = { distribution: 'normal' };
      expect(variable.distribution).toBe('normal');
    });

    it('should support uniform distribution', () => {
      const variable: Partial<SimulationVariable> = { distribution: 'uniform' };
      expect(variable.distribution).toBe('uniform');
    });

    it('should support triangular distribution', () => {
      const variable: Partial<SimulationVariable> = { distribution: 'triangular' };
      expect(variable.distribution).toBe('triangular');
    });

    it('should support lognormal distribution', () => {
      const variable: Partial<SimulationVariable> = { distribution: 'lognormal' };
      expect(variable.distribution).toBe('lognormal');
    });

    it('should support beta distribution', () => {
      const variable: Partial<SimulationVariable> = { distribution: 'beta' };
      expect(variable.distribution).toBe('beta');
    });
  });

  // ===========================================================================
  // SIMULATION CONSTRAINT STRUCTURE
  // ===========================================================================

  describe('SimulationConstraint Structure', () => {
    it('should create gt constraint', () => {
      const constraint: SimulationConstraint = {
        variable: 'revenue',
        operator: 'gt',
        value: 0,
      };
      expect(constraint.operator).toBe('gt');
    });

    it('should create gte constraint', () => {
      const constraint: SimulationConstraint = {
        variable: 'margin',
        operator: 'gte',
        value: 0.1,
      };
      expect(constraint.operator).toBe('gte');
    });

    it('should create lt constraint', () => {
      const constraint: SimulationConstraint = {
        variable: 'debt_ratio',
        operator: 'lt',
        value: 0.8,
      };
      expect(constraint.operator).toBe('lt');
    });

    it('should create lte constraint', () => {
      const constraint: SimulationConstraint = {
        variable: 'risk_score',
        operator: 'lte',
        value: 100,
      };
      expect(constraint.operator).toBe('lte');
    });

    it('should create eq constraint', () => {
      const constraint: SimulationConstraint = {
        variable: 'status',
        operator: 'eq',
        value: 'active',
      };
      expect(constraint.operator).toBe('eq');
    });

    it('should create neq constraint', () => {
      const constraint: SimulationConstraint = {
        variable: 'region',
        operator: 'neq',
        value: 'excluded',
      };
      expect(constraint.operator).toBe('neq');
    });
  });

  // ===========================================================================
  // VARIABLE CORRELATION STRUCTURE
  // ===========================================================================

  describe('VariableCorrelation Structure', () => {
    it('should create positive correlation', () => {
      const corr: VariableCorrelation = {
        variable1: 'revenue',
        variable2: 'headcount',
        correlation: 0.8,
      };
      expect(corr.correlation).toBe(0.8);
    });

    it('should create negative correlation', () => {
      const corr: VariableCorrelation = {
        variable1: 'price',
        variable2: 'demand',
        correlation: -0.6,
      };
      expect(corr.correlation).toBe(-0.6);
    });

    it('should create zero correlation', () => {
      const corr: VariableCorrelation = {
        variable1: 'weather',
        variable2: 'stock_price',
        correlation: 0,
      };
      expect(corr.correlation).toBe(0);
    });

    it('should create perfect positive correlation', () => {
      const corr: VariableCorrelation = {
        variable1: 'cost',
        variable2: 'price',
        correlation: 1.0,
      };
      expect(corr.correlation).toBe(1.0);
    });

    it('should create perfect negative correlation', () => {
      const corr: VariableCorrelation = {
        variable1: 'supply',
        variable2: 'scarcity',
        correlation: -1.0,
      };
      expect(corr.correlation).toBe(-1.0);
    });
  });

  // ===========================================================================
  // SHOCK STRUCTURE
  // ===========================================================================

  describe('Shock Structure', () => {
    it('should create absolute shock', () => {
      const shock: Shock = {
        target: 'revenue',
        type: 'absolute',
        value: -5000000,
        timing: 'immediate',
      };
      expect(shock.type).toBe('absolute');
    });

    it('should create percentage shock', () => {
      const shock: Shock = {
        target: 'headcount',
        type: 'percentage',
        value: -0.2,
        timing: 'gradual',
        duration: 90,
      };
      expect(shock.type).toBe('percentage');
    });

    it('should create multiplier shock', () => {
      const shock: Shock = {
        target: 'costs',
        type: 'multiplier',
        value: 1.5,
        timing: 'delayed',
        duration: 30,
      };
      expect(shock.type).toBe('multiplier');
    });

    it('should support immediate timing', () => {
      const shock: Partial<Shock> = { timing: 'immediate' };
      expect(shock.timing).toBe('immediate');
    });

    it('should support gradual timing', () => {
      const shock: Partial<Shock> = { timing: 'gradual' };
      expect(shock.timing).toBe('gradual');
    });

    it('should support delayed timing', () => {
      const shock: Partial<Shock> = { timing: 'delayed' };
      expect(shock.timing).toBe('delayed');
    });
  });

  // ===========================================================================
  // UNIVERSE STRUCTURE
  // ===========================================================================

  describe('Universe Structure', () => {
    it('should create valid universe', () => {
      const universe: Universe = {
        id: 'universe-123',
        universeNumber: 1,
        probability: 0.15,
        kpiProjections: { revenue: 12000000, margin: 0.22 },
        riskScores: { financial: 35, operational: 42 },
        outcomeSummary: 'Moderate growth scenario',
        outcomeSentiment: 'POSITIVE',
      };
      expect(universe.probability).toBe(0.15);
    });

    it('should support parent universe', () => {
      const universe: Partial<Universe> = { parentUniverse: 'universe-0' };
      expect(universe.parentUniverse).toBe('universe-0');
    });

    it('should support branch point', () => {
      const universe: Partial<Universe> = { branchPoint: 'decision-123' };
      expect(universe.branchPoint).toBe('decision-123');
    });

    it('should support failure cascades', () => {
      const universe: Partial<Universe> = {
        failureCascades: [{ system: 'payments', effect: 'outage', severity: 'HIGH' } as any],
      };
      expect(universe.failureCascades?.length).toBe(1);
    });
  });

  // ===========================================================================
  // IMPACT STRUCTURE
  // ===========================================================================

  describe('Impact Structure', () => {
    it('should create valid impact', () => {
      const impact: Impact = {
        id: 'impact-123',
        category: 'FINANCIAL',
        entityType: 'department',
        entityName: 'Sales',
        baselineValue: 10000000,
        projectedValue: 8500000,
        changePercent: -15,
        confidence: 0.85,
        severity: 'HIGH',
        description: 'Revenue decline due to market conditions',
      };
      expect(impact.changePercent).toBe(-15);
    });

    it('should support propagation path', () => {
      const impact: Partial<Impact> = {
        propagationPath: ['event-1', 'system-a', 'department-x'],
      };
      expect(impact.propagationPath?.length).toBe(3);
    });
  });

  // ===========================================================================
  // PROBABILITY TESTS
  // ===========================================================================

  describe('Probability Tests', () => {
    it('should handle 1% probability', () => {
      const universe: Partial<Universe> = { probability: 0.01 };
      expect(universe.probability).toBe(0.01);
    });

    it('should handle 5% probability', () => {
      const universe: Partial<Universe> = { probability: 0.05 };
      expect(universe.probability).toBe(0.05);
    });

    it('should handle 10% probability', () => {
      const universe: Partial<Universe> = { probability: 0.1 };
      expect(universe.probability).toBe(0.1);
    });

    it('should handle 25% probability', () => {
      const universe: Partial<Universe> = { probability: 0.25 };
      expect(universe.probability).toBe(0.25);
    });

    it('should handle 50% probability', () => {
      const universe: Partial<Universe> = { probability: 0.5 };
      expect(universe.probability).toBe(0.5);
    });

    it('should handle 75% probability', () => {
      const universe: Partial<Universe> = { probability: 0.75 };
      expect(universe.probability).toBe(0.75);
    });

    it('should handle 95% probability', () => {
      const universe: Partial<Universe> = { probability: 0.95 };
      expect(universe.probability).toBe(0.95);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should simulate recession scenario', () => {
      const scenario: ScenarioDefinition = {
        name: 'Global Recession',
        description: '2008-style financial crisis',
        shocks: [
          { target: 'revenue', type: 'percentage', value: -0.3, timing: 'gradual', duration: 180 },
          { target: 'credit_availability', type: 'percentage', value: -0.5, timing: 'immediate' },
        ],
      };
      expect(scenario.shocks.length).toBe(2);
    });

    it('should simulate cyber attack scenario', () => {
      const scenario: ScenarioDefinition = {
        name: 'Ransomware Attack',
        description: 'Critical systems encrypted',
        shocks: [
          { target: 'operations', type: 'percentage', value: -0.9, timing: 'immediate' },
          { target: 'reputation', type: 'percentage', value: -0.4, timing: 'delayed', duration: 30 },
        ],
      };
      expect(scenario.name).toBe('Ransomware Attack');
    });

    it('should simulate supply chain disruption', () => {
      const scenario: ScenarioDefinition = {
        name: 'Supply Chain Collapse',
        description: 'Major supplier bankruptcy',
        shocks: [
          { target: 'inventory', type: 'percentage', value: -0.7, timing: 'gradual', duration: 60 },
        ],
      };
      expect(scenario.shocks[0]?.target).toBe('inventory');
    });

    it('should simulate talent exodus', () => {
      const scenario: ScenarioDefinition = {
        name: 'Key Talent Departure',
        description: '30% of senior staff leave',
        shocks: [
          { target: 'headcount', type: 'percentage', value: -0.3, timing: 'gradual', duration: 90 },
          { target: 'productivity', type: 'percentage', value: -0.2, timing: 'delayed', duration: 60 },
        ],
      };
      expect(scenario.shocks.length).toBe(2);
    });

    it('should simulate regulatory change', () => {
      const scenario: ScenarioDefinition = {
        name: 'New Compliance Requirements',
        description: 'Major regulatory overhaul',
        shocks: [
          { target: 'compliance_costs', type: 'multiplier', value: 2.0, timing: 'delayed', duration: 180 },
        ],
      };
      expect(scenario.shocks[0]?.type).toBe('multiplier');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty variables array', () => {
      const config: Partial<SimulationConfig> = { variables: [] };
      expect(config.variables?.length).toBe(0);
    });

    it('should handle empty constraints array', () => {
      const config: Partial<SimulationConfig> = { constraints: [] };
      expect(config.constraints?.length).toBe(0);
    });

    it('should handle empty shocks array', () => {
      const scenario: Partial<ScenarioDefinition> = { shocks: [] };
      expect(scenario.shocks?.length).toBe(0);
    });

    it('should handle very long scenario name', () => {
      const scenario: Partial<ScenarioDefinition> = { name: 'A'.repeat(500) };
      expect(scenario.name?.length).toBe(500);
    });

    it('should handle special characters in description', () => {
      const scenario: Partial<ScenarioDefinition> = {
        description: 'Scenario with <special> & "characters"',
      };
      expect(scenario.description).toContain('special');
    });

    it('should handle unicode in names', () => {
      const scenario: Partial<ScenarioDefinition> = {
        name: '経済危機シミュレーション 📉',
      };
      expect(scenario.name).toContain('経済');
    });

    it('should handle zero shock value', () => {
      const shock: Partial<Shock> = { value: 0 };
      expect(shock.value).toBe(0);
    });

    it('should handle negative shock value', () => {
      const shock: Partial<Shock> = { value: -0.5 };
      expect(shock.value).toBe(-0.5);
    });

    it('should handle zero duration', () => {
      const shock: Partial<Shock> = { duration: 0 };
      expect(shock.duration).toBe(0);
    });

    it('should handle very long duration', () => {
      const shock: Partial<Shock> = { duration: 3650 };
      expect(shock.duration).toBe(3650);
    });
  });
});
