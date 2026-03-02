/**
 * Service — Due Process Violation Agent
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports DueProcessViolationAgent
 * @module services/collapse/agents/DueProcessViolationAgent
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Due Process Violation Agent
 * 
 * "Does this decision weaken notice, hearing, or appeal rights?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class DueProcessViolationAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.DUE_PROCESS_VIOLATION);
  }

  getDescription(): string {
    return 'Analyzes whether policy weakens due process protections including automated sanctions, retroactive enforcement, or probabilistic guilt.';
  }

  getFailureQuestions(): string[] {
    return [
      'Does this allow automated sanctions without human review?',
      'Is there retroactive enforcement risk?',
      'Are probabilistic guilt thresholds being used?',
      'Is there adequate judicial review available?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const automatedSanctions = this.detectAutomatedSanctions(text);
    const retroactiveRisk = this.detectRetroactiveEnforcement(text);
    const probabilisticGuilt = this.detectProbabilisticGuilt(text);

    if (automatedSanctions > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DUE_PROCESS_DENIAL,
        { metric: 'automated_sanctions', operator: '>', value: 0.5 },
        0.85,
        'AUTOMATED_SANCTIONS_WITHOUT_REVIEW',
        `${(automatedSanctions * 100).toFixed(0)}% automated sanction risk - penalties without human judgment.`,
        automatedSanctions * 0.9 * stressMultiplier,
        0.7,
        Reversibility.PARTIALLY_REVERSIBLE,
        'Immediate',
        VisibilityType.IMMEDIATE,
        this.selectAffectedGroups(3, true),
        true,
        'MEDIUM',
        ['Mathews v. Eldridge balancing test', 'Right to human decision-maker'],
        'Algorithms cannot provide constitutional due process'
      ));
    }

    if (retroactiveRisk > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DUE_PROCESS_DENIAL,
        { metric: 'retroactive_enforcement', operator: '>', value: 0.4 },
        0.9,
        'RETROACTIVE_ENFORCEMENT',
        `${(retroactiveRisk * 100).toFixed(0)}% retroactive enforcement risk - punishing past lawful conduct.`,
        retroactiveRisk * 0.95 * stressMultiplier,
        0.8,
        Reversibility.IRREVERSIBLE,
        'Immediate',
        VisibilityType.IMMEDIATE,
        [{ name: 'Those with prior conduct', populationShare: 0.4, vulnerabilityScore: retroactiveRisk, protectedClass: true }],
        false,
        'EXTREME',
        ['Ex post facto prohibition', 'Rule of law principles'],
        'Cannot punish people for conduct that was legal when performed'
      ));
    }

    if (probabilisticGuilt > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DUE_PROCESS_DENIAL,
        { metric: 'probabilistic_guilt', operator: '>', value: 0.5 },
        0.8,
        'PROBABILISTIC_GUILT_THRESHOLD',
        `${(probabilisticGuilt * 100).toFixed(0)}% probabilistic guilt risk - sanctions based on likelihood not proof.`,
        probabilisticGuilt * 0.85 * stressMultiplier,
        0.65,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-6 months',
        VisibilityType.DELAYED,
        this.selectAffectedGroups(2, true),
        true,
        'HIGH',
        ['Presumption of innocence', 'Burden of proof standards'],
        'Statistical likelihood is not individual guilt'
      ));
    }

    // Baseline: All enforcement policies carry due process risks
    if (failureConditions.length === 0) {
      const baselineRisk = 0.1 + this.rng() * 0.1;
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DUE_PROCESS_DENIAL,
        { metric: 'baseline_due_process_risk', operator: '>=', value: 0.1 },
        0.4,
        'LATENT_DUE_PROCESS_GAP',
        `Policy lacks explicit procedural safeguards. Baseline due process risk: ${(baselineRisk * 100).toFixed(0)}%.`,
        baselineRisk * stressMultiplier,
        0.3 + this.rng() * 0.15,
        Reversibility.REVERSIBLE,
        '6-18 months',
        VisibilityType.GRADUAL,
        this.selectAffectedGroups(2, false),
        true,
        'LOW',
        ['Administrative procedure standards', 'Procedural fairness literature'],
        'Absent explicit safeguards, due process gaps emerge during implementation'
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
      reasoning: `Due process analysis: Automated sanctions ${(automatedSanctions * 100).toFixed(0)}%, ` +
        `Retroactive risk ${(retroactiveRisk * 100).toFixed(0)}%, Probabilistic guilt ${(probabilisticGuilt * 100).toFixed(0)}%.`,
      evidence: ['Constitutional due process requirements', 'Administrative procedure act'],
    });
  }

  private detectAutomatedSanctions(text: string): number {
    let score = 0;
    if (text.includes('automat') && (text.includes('sanction') || text.includes('penalty') || text.includes('fine'))) score += 0.4;
    if (text.includes('algorithm') && text.includes('enforce')) score += 0.3;
    if (!text.includes('human') && !text.includes('review') && !text.includes('appeal')) score += 0.2;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private detectRetroactiveEnforcement(text: string): number {
    let score = 0;
    if (text.includes('retroactiv')) score += 0.5;
    if (text.includes('prior') && text.includes('conduct')) score += 0.3;
    if (text.includes('effective immediately') && text.includes('past')) score += 0.2;
    return Math.min(1, score + this.rng() * 0.05);
  }

  private detectProbabilisticGuilt(text: string): number {
    let score = 0;
    if (text.includes('likelihood') || text.includes('probability')) score += 0.25;
    if (text.includes('risk score') || text.includes('risk assessment')) score += 0.3;
    if (text.includes('predict') && (text.includes('violation') || text.includes('offense'))) score += 0.25;
    return Math.min(1, score + this.rng() * 0.1);
  }
}
