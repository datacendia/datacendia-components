// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Disability Impact Agent
 * 
 * "Does automation or efficiency create structural exclusion for disabled populations?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class DisabilityImpactAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.DISABILITY_IMPACT);
  }

  getDescription(): string {
    return 'Analyzes whether policy creates structural exclusion for persons with disabilities through automation, inaccessibility, or efficiency assumptions.';
  }

  getFailureQuestions(): string[] {
    return [
      'Is the system accessible to persons with various disabilities?',
      'Do automation assumptions exclude those who need accommodations?',
      'Are alternative formats and interfaces available?',
      'Does efficiency optimization disadvantage those who need more time?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const accessibilityGap = this.calculateAccessibilityGap(text);
    const automationExclusion = this.calculateAutomationExclusion(text);
    const accommodationBarrier = this.calculateAccommodationBarrier(text);

    if (accessibilityGap > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ACCESSIBILITY_EXCLUSION,
        { metric: 'accessibility_gap', operator: '>', value: 0.4 },
        0.85,
        'ACCESSIBILITY_GAP',
        `${(accessibilityGap * 100).toFixed(0)}% accessibility gap - system may exclude persons with disabilities.`,
        accessibilityGap * 0.9 * stressMultiplier,
        0.75,
        Reversibility.REVERSIBLE,
        'Immediate to 6 months',
        VisibilityType.IMMEDIATE,
        [{ name: 'Persons with disabilities', populationShare: 0.15, vulnerabilityScore: 0.85, protectedClass: true }],
        true,
        'MEDIUM',
        ['ADA requirements', 'WCAG guidelines', 'Section 508'],
        'Accessibility is a civil right, not an optional feature'
      ));
    }

    if (automationExclusion > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ACCESSIBILITY_EXCLUSION,
        { metric: 'automation_exclusion', operator: '>', value: 0.5 },
        0.8,
        'AUTOMATION_EXCLUDES_DISABLED',
        `${(automationExclusion * 100).toFixed(0)}% automation exclusion risk - automated systems may not accommodate disabilities.`,
        automationExclusion * 0.85 * stressMultiplier,
        0.7,
        Reversibility.PARTIALLY_REVERSIBLE,
        '3-12 months',
        VisibilityType.DELAYED,
        [{ name: 'Persons needing accommodations', populationShare: 0.12, vulnerabilityScore: automationExclusion, protectedClass: true }],
        true,
        'HIGH',
        ['Reasonable accommodation requirements', 'Undue burden analysis'],
        'Automation must not become a barrier to equal access'
      ));
    }

    if (accommodationBarrier > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ACCESSIBILITY_EXCLUSION,
        { metric: 'accommodation_barrier', operator: '>', value: 0.4 },
        0.75,
        'ACCOMMODATION_BARRIERS',
        `${(accommodationBarrier * 100).toFixed(0)}% accommodation barrier - requesting accommodations is difficult.`,
        accommodationBarrier * 0.8 * stressMultiplier,
        0.65,
        Reversibility.REVERSIBLE,
        'Immediate',
        VisibilityType.IMMEDIATE,
        [{ name: 'Those seeking accommodations', populationShare: 0.1, vulnerabilityScore: accommodationBarrier, protectedClass: true }],
        true,
        'LOW',
        ['Interactive accommodation process requirements'],
        'Accommodation processes must be accessible themselves'
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
      reasoning: `Disability impact analysis: Accessibility gap ${(accessibilityGap * 100).toFixed(0)}%, ` +
        `Automation exclusion ${(automationExclusion * 100).toFixed(0)}%, Accommodation barrier ${(accommodationBarrier * 100).toFixed(0)}%.`,
      evidence: ['ADA compliance requirements', 'WCAG 2.1 standards', 'UN CRPD'],
    });
  }

  private calculateAccessibilityGap(text: string): number {
    let score = 0.3; // Default assumes some gap unless explicitly addressed
    if (!text.includes('accessib') && !text.includes('disabil')) score += 0.3;
    if (text.includes('digital') && !text.includes('accessible')) score += 0.15;
    if (text.includes('online only') || text.includes('digital only')) score += 0.2;
    if (text.includes('accessib') || text.includes('wcag') || text.includes('ada')) score -= 0.3;
    return Math.min(1, Math.max(0, score + this.rng() * 0.1));
  }

  private calculateAutomationExclusion(text: string): number {
    let score = 0;
    if (text.includes('automat') && !text.includes('accommodat')) score += 0.35;
    if (text.includes('time limit') || text.includes('deadline')) score += 0.2;
    if (text.includes('self-service') && !text.includes('alternative')) score += 0.2;
    if (text.includes('captcha') || text.includes('verification')) score += 0.15;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateAccommodationBarrier(text: string): number {
    let score = 0.2;
    if (!text.includes('accommodat') && !text.includes('alternative')) score += 0.25;
    if (text.includes('standard') && text.includes('process')) score += 0.15;
    if (text.includes('documentation') && text.includes('require')) score += 0.15;
    if (text.includes('reasonable accommodation')) score -= 0.3;
    return Math.min(1, Math.max(0, score + this.rng() * 0.1));
  }
}
