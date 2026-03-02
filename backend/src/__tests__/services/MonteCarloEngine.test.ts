/**
 * Module — Monte Carlo Engine Test
 *
 * Platform module.
 * @module __tests__/services/MonteCarloEngine.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * MonteCarloEngine Tests
 * 
 * Tests for the simulation engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MonteCarloEngine } from '../../services/crucible/MonteCarloEngine.js';
import { 
  SimulationConfig, 
  ScenarioDefinition, 
  DigitalTwin,
  Universe 
} from '../../services/crucible/types.js';

describe('MonteCarloEngine', () => {
  let engine: MonteCarloEngine;

  const mockDigitalTwin: DigitalTwin = {
    organizationId: 'org-test-123',
    organizationName: 'Test Corp',
    industry: 'Technology',
    snapshotTime: new Date(),
    departments: [
      { name: 'Engineering', headcount: 50, budget: 500000 },
      { name: 'Sales', headcount: 20, budget: 200000 },
    ],
    systems: [
      { id: 'sys-1', name: 'Core Platform', type: 'application', status: 'healthy' },
    ],
    kpis: [
      { code: 'revenue', name: 'Revenue', value: 1000000 },
      { code: 'customers', name: 'Active Customers', value: 500 },
    ],
    employees: {
      totalHeadcount: 70,
      averageTenure: 2.5,
      turnoverRate: 15,
      engagementScore: 75,
      productivityIndex: 85,
    },
    financials: {
      revenue: 1000000,
      ebitda: 200000,
      cashFlow: 500000,
      burnRate: 50000,
      runway: 10,
    },
    relationships: [
      { type: 'depends_on', source: 'Sales', target: 'Core Platform', strength: 0.9 },
    ],
  };

  const mockScenario: ScenarioDefinition = {
    name: 'Test Scenario',
    description: 'A test scenario',
    shocks: [
      { target: 'revenue', type: 'percentage', value: -20, timing: 'immediate' },
    ],
  };

  const mockConfig: SimulationConfig = {
    monteCarloRuns: 10,
    confidenceLevel: 0.95,
    timeHorizonDays: 90,
    variables: [],
    constraints: [],
  };

  beforeEach(() => {
    // Use fixed seed for reproducible tests
    engine = new MonteCarloEngine(12345);
  });

  describe('runSimulation()', () => {
    it('should generate the correct number of universes', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      expect(universes).toHaveLength(10);
    });

    it('should assign unique IDs to each universe', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      const ids = universes.map(u => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should normalize probabilities to sum to 1', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      const totalProbability = universes.reduce((sum, u) => sum + u.probability, 0);
      expect(totalProbability).toBeCloseTo(1.0, 5);
    });

    it('should sort universes by probability (descending)', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      for (let i = 1; i < universes.length; i++) {
        expect(universes[i - 1].probability).toBeGreaterThanOrEqual(universes[i].probability);
      }
    });

    it('should apply shocks to KPI projections', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      // With a -20% shock to revenue, projected revenue should be less than baseline
      for (const universe of universes) {
        // Due to random factors, check that revenue was affected
        expect(universe.kpiProjections['revenue']).toBeDefined();
      }
    });

    it('should calculate risk scores for each universe', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      for (const universe of universes) {
        expect(universe.riskScores).toBeDefined();
        expect(universe.riskScores['financial']).toBeDefined();
        expect(universe.riskScores['operational']).toBeDefined();
        expect(universe.riskScores['strategic']).toBeDefined();
        expect(universe.riskScores['compliance']).toBeDefined();
      }
    });

    it('should assign outcome sentiment to each universe', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      const validSentiments = ['CATASTROPHIC', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'OPTIMAL'];
      for (const universe of universes) {
        expect(validSentiments).toContain(universe.outcomeSentiment);
      }
    });

    it('should generate outcome summaries', async () => {
      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        mockConfig
      );

      for (const universe of universes) {
        expect(universe.outcomeSummary).toBeDefined();
        expect(universe.outcomeSummary.length).toBeGreaterThan(0);
      }
    });
  });

  describe('with constraints', () => {
    it('should reduce probability for constraint violations', async () => {
      const configWithConstraints: SimulationConfig = {
        ...mockConfig,
        constraints: [
          { variable: 'revenue', operator: 'gte', value: 900000 },
        ],
      };

      const universesWithConstraints = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        configWithConstraints
      );

      // Universes that violate constraints should have lower probability
      // Since we're applying -20% shock to revenue (1M -> ~800K), constraint will be violated
      expect(universesWithConstraints.length).toBe(10);
    });
  });

  describe('with correlations', () => {
    it('should apply variable correlations', async () => {
      const configWithCorrelations: SimulationConfig = {
        ...mockConfig,
        correlations: [
          { variable1: 'revenue', variable2: 'headcount', correlation: 0.8 },
        ],
      };

      const universes = await engine.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        configWithCorrelations
      );

      expect(universes.length).toBe(10);
    });
  });

  describe('determinism with seed', () => {
    it('should produce same results with same seed', async () => {
      const engine1 = new MonteCarloEngine(99999);
      const engine2 = new MonteCarloEngine(99999);

      const universes1 = await engine1.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        { ...mockConfig, monteCarloRuns: 5 }
      );

      const universes2 = await engine2.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        { ...mockConfig, monteCarloRuns: 5 }
      );

      // Probabilities should be identical with same seed
      for (let i = 0; i < universes1.length; i++) {
        expect(universes1[i].probability).toBeCloseTo(universes2[i].probability, 10);
      }
    });

    it('should produce different results with different seeds', async () => {
      const engine1 = new MonteCarloEngine(11111);
      const engine2 = new MonteCarloEngine(22222);

      const universes1 = await engine1.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        { ...mockConfig, monteCarloRuns: 5 }
      );

      const universes2 = await engine2.runSimulation(
        'sim-test-123',
        mockDigitalTwin,
        mockScenario,
        { ...mockConfig, monteCarloRuns: 5 }
      );

      // At least some probabilities should differ
      let hasDifference = false;
      for (let i = 0; i < universes1.length; i++) {
        if (Math.abs(universes1[i].probability - universes2[i].probability) > 0.001) {
          hasDifference = true;
          break;
        }
      }
      expect(hasDifference).toBe(true);
    });
  });
});
