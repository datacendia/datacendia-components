/**
 * CendiaCrucible™ - Monte Carlo Simulation Engine
 * 
 * Handles the core Monte Carlo simulation logic including:
 * - Random number generation with distributions
 * - Universe branching and probability calculation
 * - Variable correlation handling
 */

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import {
  SimulationConfig,
  SimulationVariable,
  ScenarioDefinition,
  DigitalTwin,
  Universe,
  OutcomeSentiment,
  FailureCascade,
  Shock,
} from './types.js';

export class MonteCarloEngine {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Date.now();
  }

  /**
   * Run Monte Carlo simulation across multiple universes
   */
  async runSimulation(
    simulationId: string,
    digitalTwin: DigitalTwin,
    scenario: ScenarioDefinition,
    config: SimulationConfig
  ): Promise<Universe[]> {
    const universes: Universe[] = [];
    const numRuns = config.monteCarloRuns || 100;

    logger.info(`[MonteCarloEngine] Starting simulation ${simulationId} with ${numRuns} universes`);

    for (let i = 0; i < numRuns; i++) {
      const universe = await this.simulateUniverse(
        i,
        digitalTwin,
        scenario,
        config
      );
      universes.push(universe);
    }

    // Normalize probabilities
    const totalProbability = universes.reduce((sum, u) => sum + u.probability, 0);
    universes.forEach(u => {
      u.probability = u.probability / totalProbability;
    });

    // Sort by probability (most likely first)
    universes.sort((a, b) => b.probability - a.probability);

    logger.info(`[MonteCarloEngine] Completed simulation with ${universes.length} universes`);

    return universes;
  }

  /**
   * Simulate a single universe
   */
  private async simulateUniverse(
    universeNumber: number,
    digitalTwin: DigitalTwin,
    scenario: ScenarioDefinition,
    config: SimulationConfig
  ): Promise<Universe> {
    const id = crypto.randomUUID();
    
    // Initialize KPI projections from digital twin
    const kpiProjections: Record<string, number> = {};
    const riskScores: Record<string, number> = {};

    // Base values from digital twin
    for (const kpi of digitalTwin.kpis) {
      kpiProjections[kpi.code] = kpi.value;
    }

    // Apply financial baselines
    kpiProjections['revenue'] = digitalTwin.financials.revenue || 0;
    kpiProjections['ebitda'] = digitalTwin.financials.ebitda || 0;
    kpiProjections['cash_flow'] = digitalTwin.financials.cashFlow || 0;

    // Apply employee baselines
    kpiProjections['headcount'] = digitalTwin.employees.totalHeadcount || 0;
    kpiProjections['engagement'] = digitalTwin.employees.engagementScore || 0;
    kpiProjections['turnover'] = digitalTwin.employees.turnoverRate || 0;

    // Apply shocks with randomness
    for (const shock of scenario.shocks) {
      const randomFactor = this.generateRandomFactor(config);
      this.applyShock(kpiProjections, shock, randomFactor);
    }

    // Apply variable correlations
    if (config.correlations) {
      this.applyCorrelations(kpiProjections, config.correlations);
    }

    // Calculate risk scores for each category
    riskScores['financial'] = this.calculateFinancialRisk(kpiProjections, digitalTwin);
    riskScores['operational'] = this.calculateOperationalRisk(kpiProjections, digitalTwin);
    riskScores['strategic'] = this.calculateStrategicRisk(kpiProjections, digitalTwin);
    riskScores['compliance'] = this.calculateComplianceRisk(kpiProjections, digitalTwin);

    // Calculate overall outcome sentiment
    const overallRisk = Object.values(riskScores).reduce((a, b) => a + b, 0) / Object.keys(riskScores).length;
    const sentiment = this.calculateSentiment(overallRisk);

    // Calculate probability based on configuration constraints
    const probability = this.calculateProbability(kpiProjections, config);

    // Detect failure cascades
    const failureCascades = this.detectFailureCascades(kpiProjections, digitalTwin, scenario);

    return {
      id,
      universeNumber,
      probability,
      kpiProjections,
      riskScores,
      outcomeSummary: this.generateOutcomeSummary(kpiProjections, riskScores, sentiment),
      outcomeSentiment: sentiment,
      failureCascades,
    };
  }

  /**
   * Generate random factor based on distribution
   */
  private generateRandomFactor(config: SimulationConfig): number {
    // Use Box-Muller transform for normal distribution
    const u1 = this.random();
    const u2 = this.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Scale to reasonable range (typically 0.5 to 1.5)
    return 1 + (z0 * 0.2);
  }

  /**
   * Seeded random number generator
   */
  private random(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  /**
   * Apply a shock to KPI projections
   */
  private applyShock(
    kpiProjections: Record<string, number>,
    shock: Shock,
    randomFactor: number
  ): void {
    const currentValue = kpiProjections[shock.target] || 0;
    let newValue: number;

    switch (shock.type) {
      case 'absolute':
        newValue = shock.value * randomFactor;
        break;
      case 'percentage':
        newValue = currentValue * (1 + (shock.value / 100) * randomFactor);
        break;
      case 'multiplier':
        newValue = currentValue * shock.value * randomFactor;
        break;
      default:
        newValue = currentValue;
    }

    kpiProjections[shock.target] = newValue;
  }

  /**
   * Apply variable correlations
   */
  private applyCorrelations(
    kpiProjections: Record<string, number>,
    correlations: { variable1: string; variable2: string; correlation: number }[]
  ): void {
    for (const corr of correlations) {
      const val1 = kpiProjections[corr.variable1];
      const val2 = kpiProjections[corr.variable2];

      if (val1 !== undefined && val2 !== undefined) {
        // Adjust val2 based on correlation with val1's deviation
        const adjustment = (val1 / (val1 || 1)) * corr.correlation * 0.1;
        kpiProjections[corr.variable2] = val2 * (1 + adjustment);
      }
    }
  }

  /**
   * Calculate financial risk score (0-100)
   */
  private calculateFinancialRisk(
    kpiProjections: Record<string, number>,
    digitalTwin: DigitalTwin
  ): number {
    const baseRevenue = digitalTwin.financials.revenue || 1;
    const projectedRevenue = kpiProjections['revenue'] || 0;
    const revenueDecline = Math.max(0, (baseRevenue - projectedRevenue) / baseRevenue * 100);

    const baseCash = digitalTwin.financials.cashFlow || 1;
    const projectedCash = kpiProjections['cash_flow'] || 0;
    const cashDecline = Math.max(0, (baseCash - projectedCash) / baseCash * 100);

    return Math.min(100, (revenueDecline * 0.6 + cashDecline * 0.4));
  }

  /**
   * Calculate operational risk score (0-100)
   */
  private calculateOperationalRisk(
    kpiProjections: Record<string, number>,
    digitalTwin: DigitalTwin
  ): number {
    let risk = 0;

    // Check for system impacts
    if (kpiProjections['system_availability'] !== undefined) {
      risk += (100 - kpiProjections['system_availability']) * 0.4;
    }

    // Check for throughput impacts
    if (kpiProjections['throughput'] !== undefined) {
      const baseThroughput = 100;
      risk += Math.max(0, (baseThroughput - kpiProjections['throughput']) / baseThroughput * 100) * 0.3;
    }

    // Check for supply impacts
    if (kpiProjections['supply_availability'] !== undefined) {
      risk += (100 - kpiProjections['supply_availability']) * 0.3;
    }

    return Math.min(100, risk);
  }

  /**
   * Calculate strategic risk score (0-100)
   */
  private calculateStrategicRisk(
    kpiProjections: Record<string, number>,
    digitalTwin: DigitalTwin
  ): number {
    let risk = 0;

    // Market share impact
    if (kpiProjections['market_share'] !== undefined) {
      risk += Math.max(0, 50 - kpiProjections['market_share']) * 0.5;
    }

    // Competitive position
    if (kpiProjections['pricing_power'] !== undefined) {
      risk += Math.max(0, 100 - kpiProjections['pricing_power']) * 0.3;
    }

    // Innovation/technology
    if (kpiProjections['core_systems'] !== undefined && kpiProjections['core_systems'] === 0) {
      risk += 30;
    }

    return Math.min(100, risk);
  }

  /**
   * Calculate compliance risk score (0-100)
   */
  private calculateComplianceRisk(
    kpiProjections: Record<string, number>,
    digitalTwin: DigitalTwin
  ): number {
    let risk = 0;

    // Security score impact
    if (kpiProjections['security_score'] !== undefined) {
      risk += Math.max(0, 100 - kpiProjections['security_score']) * 0.5;
    }

    // ESG score impact
    if (kpiProjections['esg_score'] !== undefined) {
      risk += Math.max(0, 100 - kpiProjections['esg_score']) * 0.3;
    }

    // Compliance costs increase
    if (kpiProjections['compliance_costs'] !== undefined) {
      risk += Math.min(20, kpiProjections['compliance_costs'] / 10000);
    }

    return Math.min(100, risk);
  }

  /**
   * Calculate outcome sentiment from risk score
   */
  private calculateSentiment(overallRisk: number): OutcomeSentiment {
    if (overallRisk >= 80) return 'CATASTROPHIC';
    if (overallRisk >= 60) return 'NEGATIVE';
    if (overallRisk >= 40) return 'NEUTRAL';
    if (overallRisk >= 20) return 'POSITIVE';
    return 'OPTIMAL';
  }

  /**
   * Calculate probability that this universe occurs
   */
  private calculateProbability(
    kpiProjections: Record<string, number>,
    config: SimulationConfig
  ): number {
    let probability = 1.0;

    // Check constraints
    for (const constraint of config.constraints) {
      const value = kpiProjections[constraint.variable];
      if (value === undefined) continue;

      let satisfied = true;
      switch (constraint.operator) {
        case 'gt': satisfied = value > Number(constraint.value); break;
        case 'gte': satisfied = value >= Number(constraint.value); break;
        case 'lt': satisfied = value < Number(constraint.value); break;
        case 'lte': satisfied = value <= Number(constraint.value); break;
        case 'eq': satisfied = value === Number(constraint.value); break;
        case 'neq': satisfied = value !== Number(constraint.value); break;
      }

      if (!satisfied) {
        probability *= 0.1; // Reduce probability for constraint violations
      }
    }

    // Add some randomness
    probability *= (0.5 + this.random() * 0.5);

    return probability;
  }

  /**
   * Detect failure cascades in the simulation
   */
  private detectFailureCascades(
    kpiProjections: Record<string, number>,
    digitalTwin: DigitalTwin,
    scenario: ScenarioDefinition
  ): FailureCascade[] {
    const cascades: FailureCascade[] = [];

    // Check for critical failures that could cascade
    for (const shock of scenario.shocks) {
      const projectedValue = kpiProjections[shock.target];
      
      // If a critical system is severely impacted
      if (shock.target.includes('system') && projectedValue !== undefined && projectedValue < 20) {
        const cascade = this.buildFailureCascade(shock.target, digitalTwin);
        if (cascade.affectedNodes.length > 0) {
          cascades.push(cascade);
        }
      }
    }

    return cascades;
  }

  /**
   * Build a failure cascade from a trigger point
   */
  private buildFailureCascade(trigger: string, digitalTwin: DigitalTwin): FailureCascade {
    const affectedNodes = digitalTwin.relationships
      .filter(r => r.source === trigger || r.target === trigger)
      .map((r, i) => ({
        nodeId: `node-${i}`,
        nodeName: r.source === trigger ? r.target : r.source,
        nodeType: 'system',
        impactLevel: r.strength * 100,
        timeToImpact: i * 2,
        dependencies: [],
      }));

    return {
      id: crypto.randomUUID(),
      triggerEvent: trigger,
      cascadeDepth: Math.min(affectedNodes.length, 5),
      affectedNodes,
      propagationTime: affectedNodes.length * 2,
      totalImpact: affectedNodes.reduce((sum, n) => sum + n.impactLevel, 0),
    };
  }

  /**
   * Generate human-readable outcome summary
   */
  private generateOutcomeSummary(
    kpiProjections: Record<string, number>,
    riskScores: Record<string, number>,
    sentiment: OutcomeSentiment
  ): string {
    const highestRisk = Object.entries(riskScores).sort((a, b) => b[1] - a[1])[0];
    
    const sentimentText: Record<OutcomeSentiment, string> = {
      CATASTROPHIC: 'catastrophic outcome with severe organizational impact',
      NEGATIVE: 'negative outcome requiring significant intervention',
      NEUTRAL: 'mixed outcome with manageable challenges',
      POSITIVE: 'favorable outcome with minor adjustments needed',
      OPTIMAL: 'optimal outcome with organization thriving',
    };

    return `${sentimentText[sentiment]}. Primary risk area: ${highestRisk[0]} (${Math.round(highestRisk[1])}% risk score).`;
  }
}

export default MonteCarloEngine;
