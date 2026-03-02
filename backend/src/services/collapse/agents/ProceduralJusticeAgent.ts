/**
 * Service — Procedural Justice Agent
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports ProceduralJusticeAgent
 * @module services/collapse/agents/ProceduralJusticeAgent
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Procedural Justice Agent
 * 
 * "Will affected parties perceive the process as unfair, regardless of outcome?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class ProceduralJusticeAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.PROCEDURAL_JUSTICE);
  }

  getDescription(): string {
    return 'Analyzes whether affected parties will perceive the decision-making process as fair, independent of outcomes.';
  }

  getFailureQuestions(): string[] {
    return [
      'Are appeal pathways clear and accessible?',
      'Do affected parties receive adequate notice?',
      'Is there meaningful opportunity to be heard?',
      'Are explanations provided for adverse decisions?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const noticeAdequacy = this.calculateNoticeAdequacy(text);
    const hearingOpportunity = this.calculateHearingOpportunity(text);
    const appealAccessibility = this.calculateAppealAccessibility(text);

    if (noticeAdequacy < 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.PROCEDURAL_UNFAIRNESS,
        { metric: 'notice_adequacy', operator: '<', value: 0.5 },
        0.8,
        'INADEQUATE_NOTICE',
        `Notice adequacy only ${(noticeAdequacy * 100).toFixed(0)}% - affected parties may not receive sufficient warning.`,
        (1 - noticeAdequacy) * 0.8 * stressMultiplier,
        0.7,
        Reversibility.REVERSIBLE,
        'Immediate',
        VisibilityType.DELAYED,
        this.selectAffectedGroups(2, true),
        true,
        'LOW',
        ['Due process requirements', 'Administrative procedure standards'],
        'Fair process requires adequate notice of adverse actions'
      ));
    }

    if (hearingOpportunity < 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.PROCEDURAL_UNFAIRNESS,
        { metric: 'hearing_opportunity', operator: '<', value: 0.5 },
        0.85,
        'NO_HEARING_OPPORTUNITY',
        `Hearing opportunity only ${(hearingOpportunity * 100).toFixed(0)}% - no meaningful chance to be heard.`,
        (1 - hearingOpportunity) * 0.85 * stressMultiplier,
        0.75,
        Reversibility.REVERSIBLE,
        'Immediate',
        VisibilityType.IMMEDIATE,
        this.selectAffectedGroups(3, true),
        true,
        'MEDIUM',
        ['Procedural due process', 'Right to be heard doctrine'],
        'Legitimacy requires voice, even when outcomes are unchanged'
      ));
    }

    if (appealAccessibility < 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.PROCEDURAL_UNFAIRNESS,
        { metric: 'appeal_accessibility', operator: '<', value: 0.4 },
        0.85,
        'INACCESSIBLE_APPEALS',
        `Appeal accessibility only ${(appealAccessibility * 100).toFixed(0)}% - recourse is effectively unavailable.`,
        (1 - appealAccessibility) * 0.9 * stressMultiplier,
        0.8,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-6 months',
        VisibilityType.DELAYED,
        [{ name: 'Those seeking recourse', populationShare: 0.2, vulnerabilityScore: 1 - appealAccessibility, protectedClass: true }],
        true,
        'MEDIUM',
        ['Access to justice principles', 'Administrative review requirements'],
        'No appeal pathway means no error correction'
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
      reasoning: `Procedural justice analysis: Notice ${(noticeAdequacy * 100).toFixed(0)}%, ` +
        `Hearing ${(hearingOpportunity * 100).toFixed(0)}%, Appeal ${(appealAccessibility * 100).toFixed(0)}%.`,
      evidence: ['Procedural due process doctrine', 'Administrative law standards'],
    });
  }

  private calculateNoticeAdequacy(text: string): number {
    let score = 0.3;
    if (text.includes('notice')) score += 0.25;
    if (text.includes('inform')) score += 0.2;
    if (text.includes('advise') || text.includes('notify')) score += 0.15;
    if (text.includes('days') && text.includes('before')) score += 0.1;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateHearingOpportunity(text: string): number {
    let score = 0.2;
    if (text.includes('hearing')) score += 0.3;
    if (text.includes('opportunity') && text.includes('respond')) score += 0.2;
    if (text.includes('present') && text.includes('evidence')) score += 0.15;
    if (text.includes('contest') || text.includes('challenge')) score += 0.15;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateAppealAccessibility(text: string): number {
    let score = 0.2;
    if (text.includes('appeal')) score += 0.3;
    if (text.includes('review')) score += 0.2;
    if (text.includes('reconsider')) score += 0.15;
    if (text.includes('final') && !text.includes('not final')) score -= 0.2;
    return Math.min(1, Math.max(0, score + this.rng() * 0.1));
  }
}
