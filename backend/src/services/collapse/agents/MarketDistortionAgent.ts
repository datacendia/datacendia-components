// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Market Distortion Agent
 * 
 * "Does this decision distort incentives or entrench monopolies unintentionally?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class MarketDistortionAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.MARKET_DISTORTION);
  }

  getDescription(): string {
    return 'Analyzes whether policy distorts market incentives, creates rent-seeking opportunities, or entrenches monopolies.';
  }

  getFailureQuestions(): string[] {
    return [
      'Does this create barriers to entry that favor incumbents?',
      'Are there rent-seeking opportunities being created?',
      'Does this distort price signals or competition?',
      'Will this lead to market concentration over time?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const entryBarriers = this.calculateEntryBarriers(text);
    const rentSeekingOpportunity = this.calculateRentSeeking(text);
    const competitionDistortion = this.calculateCompetitionDistortion(text);

    if (entryBarriers > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.MARKET_FAILURE,
        { metric: 'entry_barriers', operator: '>', value: 0.4 },
        0.75,
        'INCUMBENT_ENTRENCHMENT',
        `${(entryBarriers * 100).toFixed(0)}% entry barrier risk - policy may protect incumbents from competition.`,
        entryBarriers * 0.8 * stressMultiplier,
        0.65,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-5 years',
        VisibilityType.GRADUAL,
        [{ name: 'New market entrants', populationShare: 0.05, vulnerabilityScore: entryBarriers, protectedClass: false },
         { name: 'Consumers', populationShare: 0.8, vulnerabilityScore: entryBarriers * 0.5, protectedClass: false }],
        true,
        'MEDIUM',
        ['Competition policy literature', 'Regulatory capture research'],
        'Barriers to entry reduce innovation and raise prices'
      ));
    }

    if (rentSeekingOpportunity > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.MARKET_FAILURE,
        { metric: 'rent_seeking', operator: '>', value: 0.5 },
        0.8,
        'RENT_SEEKING_OPPORTUNITY',
        `${(rentSeekingOpportunity * 100).toFixed(0)}% rent-seeking risk - policy creates profitable lobbying targets.`,
        rentSeekingOpportunity * 0.85 * stressMultiplier,
        0.7,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-3 years',
        VisibilityType.DELAYED,
        [{ name: 'Taxpayers and consumers', populationShare: 0.9, vulnerabilityScore: rentSeekingOpportunity * 0.6, protectedClass: false }],
        true,
        'HIGH',
        ['Public choice economics', 'Regulatory economics'],
        'Concentrated benefits and diffuse costs invite capture'
      ));
    }

    if (competitionDistortion > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.MARKET_FAILURE,
        { metric: 'competition_distortion', operator: '>', value: 0.5 },
        0.75,
        'COMPETITION_DISTORTION',
        `${(competitionDistortion * 100).toFixed(0)}% competition distortion - market signals may be corrupted.`,
        competitionDistortion * 0.8 * stressMultiplier,
        0.6,
        Reversibility.PARTIALLY_REVERSIBLE,
        '2-5 years',
        VisibilityType.GRADUAL,
        [{ name: 'Market participants', populationShare: 0.3, vulnerabilityScore: competitionDistortion, protectedClass: false }],
        true,
        'MEDIUM',
        ['Market efficiency theory', 'Price signal research'],
        'Distorted markets misallocate resources'
      ));
    }

    // Baseline: All policy interventions carry market distortion potential
    if (failureConditions.length === 0) {
      const baselineRisk = 0.1 + this.rng() * 0.1;
      failureConditions.push(this.createFailureCondition(
        FailureCategory.MARKET_FAILURE,
        { metric: 'baseline_market_distortion', operator: '>=', value: 0.1 },
        0.4,
        'LATENT_MARKET_INEFFICIENCY',
        `Any policy intervention may create unintended market inefficiencies through compliance costs or behavioral changes. Baseline distortion: ${(baselineRisk * 100).toFixed(0)}%.`,
        baselineRisk * stressMultiplier,
        0.3 + this.rng() * 0.15,
        Reversibility.REVERSIBLE,
        '1-3 years',
        VisibilityType.GRADUAL,
        this.selectAffectedGroups(2, false),
        true,
        'LOW',
        ['Regulatory economics', 'Compliance cost studies'],
        'All regulations impose transaction costs that may distort efficient allocation'
      ));
    }

    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Market distortion analysis: Entry barriers ${(entryBarriers * 100).toFixed(0)}%, ` +
        `Rent-seeking ${(rentSeekingOpportunity * 100).toFixed(0)}%, Competition distortion ${(competitionDistortion * 100).toFixed(0)}%.`,
      evidence: ['Competition economics', 'Regulatory capture literature'],
    });
  }

  private calculateEntryBarriers(text: string): number {
    let score = 0;
    if (text.includes('license') && text.includes('require')) score += 0.25;
    if (text.includes('certifi') && text.includes('mandatory')) score += 0.2;
    if (text.includes('minimum') && (text.includes('capital') || text.includes('size'))) score += 0.2;
    if (text.includes('incumbent') || text.includes('existing provider')) score += 0.15;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateRentSeeking(text: string): number {
    let score = 0;
    if (text.includes('subsidy') || text.includes('grant') || text.includes('incentive')) score += 0.25;
    if (text.includes('exclusive') || text.includes('sole provider')) score += 0.3;
    if (text.includes('procurement') && text.includes('prefer')) score += 0.2;
    if (text.includes('waiver') || text.includes('exception')) score += 0.15;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateCompetitionDistortion(text: string): number {
    let score = 0;
    if (text.includes('price') && (text.includes('control') || text.includes('cap') || text.includes('floor'))) score += 0.3;
    if (text.includes('mandate') && text.includes('purchase')) score += 0.25;
    if (text.includes('quota') || text.includes('allocation')) score += 0.2;
    return Math.min(1, score + this.rng() * 0.1);
  }
}
