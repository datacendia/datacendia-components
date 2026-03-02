/**
 * Service — Environmental Externality Agent
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports EnvironmentalExternalityAgent
 * @module services/collapse/agents/EnvironmentalExternalityAgent
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Environmental Externality Agent
 * 
 * "Does this decision create delayed ecological or sustainability harm?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class EnvironmentalExternalityAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.ENVIRONMENTAL_EXTERNALITY);
  }

  getDescription(): string {
    return 'Analyzes whether policy creates delayed ecological harm, sustainability risks, or intergenerational environmental burdens.';
  }

  getFailureQuestions(): string[] {
    return [
      'Does this externalize environmental costs to future generations?',
      'Are there hidden ecological impacts not accounted for?',
      'Does this conflict with sustainability commitments?',
      'Will this contribute to irreversible environmental degradation?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const ecologicalExternality = this.calculateEcologicalExternality(text);
    const sustainabilityConflict = this.calculateSustainabilityConflict(text);
    const intergenerationalBurden = this.calculateIntergenerationalBurden(text);

    if (ecologicalExternality > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ECOLOGICAL_HARM,
        { metric: 'ecological_externality', operator: '>', value: 0.4 },
        0.75,
        'UNPRICED_ECOLOGICAL_EXTERNALITY',
        `${(ecologicalExternality * 100).toFixed(0)}% ecological externality risk - environmental costs not internalized.`,
        ecologicalExternality * 0.85 * stressMultiplier,
        0.65,
        Reversibility.PARTIALLY_REVERSIBLE,
        '5-20 years',
        VisibilityType.GRADUAL,
        [{ name: 'Environmental communities', populationShare: 0.3, vulnerabilityScore: ecologicalExternality, protectedClass: false },
         { name: 'Future generations', populationShare: 1.0, vulnerabilityScore: ecologicalExternality * 0.8, protectedClass: true }],
        true,
        'HIGH',
        ['Environmental economics', 'Externality theory'],
        'Unpriced externalities lead to overexploitation'
      ));
    }

    if (sustainabilityConflict > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ECOLOGICAL_HARM,
        { metric: 'sustainability_conflict', operator: '>', value: 0.5 },
        0.8,
        'SUSTAINABILITY_COMMITMENT_CONFLICT',
        `${(sustainabilityConflict * 100).toFixed(0)}% sustainability conflict - policy may contradict environmental commitments.`,
        sustainabilityConflict * 0.9 * stressMultiplier,
        0.7,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-10 years',
        VisibilityType.DELAYED,
        [{ name: 'Stakeholders relying on commitments', populationShare: 0.4, vulnerabilityScore: sustainabilityConflict, protectedClass: false }],
        true,
        'MEDIUM',
        ['Climate commitments', 'SDG frameworks'],
        'Inconsistent environmental policy undermines credibility'
      ));
    }

    if (intergenerationalBurden > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ECOLOGICAL_HARM,
        { metric: 'intergenerational_burden', operator: '>', value: 0.5 },
        0.85,
        'INTERGENERATIONAL_ENVIRONMENTAL_BURDEN',
        `${(intergenerationalBurden * 100).toFixed(0)}% intergenerational burden - environmental debts passed to future generations.`,
        intergenerationalBurden * 0.95 * stressMultiplier,
        0.75,
        Reversibility.IRREVERSIBLE,
        '10-50 years',
        VisibilityType.HIDDEN,
        [{ name: 'Future generations', populationShare: 1.0, vulnerabilityScore: intergenerationalBurden, protectedClass: true }],
        false,
        'EXTREME',
        ['Intergenerational equity', 'Precautionary principle'],
        'Future generations cannot consent to burdens we impose'
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
      reasoning: `Environmental externality analysis: Ecological externality ${(ecologicalExternality * 100).toFixed(0)}%, ` +
        `Sustainability conflict ${(sustainabilityConflict * 100).toFixed(0)}%, Intergenerational burden ${(intergenerationalBurden * 100).toFixed(0)}%.`,
      evidence: ['Environmental impact assessment standards', 'Climate science'],
    });
  }

  private calculateEcologicalExternality(text: string): number {
    let score = 0.2;
    // Check for environmental considerations
    if (!text.includes('environment') && !text.includes('ecolog') && !text.includes('sustain')) score += 0.25;
    if (text.includes('develop') && !text.includes('sustainable')) score += 0.15;
    if (text.includes('industrial') || text.includes('extraction') || text.includes('resource')) score += 0.15;
    if (text.includes('environmental impact') || text.includes('assessment')) score -= 0.2;
    return Math.min(1, Math.max(0, score + this.rng() * 0.1));
  }

  private calculateSustainabilityConflict(text: string): number {
    let score = 0;
    if (text.includes('fossil') || text.includes('coal') || text.includes('oil')) score += 0.3;
    if (text.includes('expand') && (text.includes('capacity') || text.includes('production'))) score += 0.2;
    if (text.includes('exempt') && text.includes('environmental')) score += 0.3;
    if (text.includes('renewable') || text.includes('clean') || text.includes('green')) score -= 0.2;
    return Math.min(1, Math.max(0, score + this.rng() * 0.1));
  }

  private calculateIntergenerationalBurden(text: string): number {
    let score = 0.15;
    if (text.includes('long-term') && !text.includes('sustainab')) score += 0.2;
    if (text.includes('permanent') || text.includes('irreversible')) score += 0.25;
    if (text.includes('waste') || text.includes('disposal') || text.includes('storage')) score += 0.2;
    if (text.includes('future generation') || text.includes('intergenerational')) score -= 0.15;
    return Math.min(1, Math.max(0, score + this.rng() * 0.1));
  }
}
