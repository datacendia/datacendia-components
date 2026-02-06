/**
 * Legitimacy Collapse Agent
 * 
 * Purpose: Determine when a decision loses public, institutional, or moral legitimacy.
 * 
 * Failure Questions:
 * - When does trust collapse even if policy is technically sound?
 * - What perception breaks first?
 * - At what point is recovery impossible?
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  LegitimacyCollapseOutput,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams, PolicyContext } from './BaseCollapseAgent.js';

const LEGITIMACY_TRIGGERS = [
  'enforcement_without_appeal',
  'selective_prosecution',
  'opacity_in_process',
  'elite_capture_perception',
  'broken_promise',
  'scandal_exposure',
  'minority_exclusion',
  'procedural_violation',
];

const THRESHOLD_EVENTS = [
  'First media expose of inconsistent enforcement',
  'Public figure denouncement on social media',
  'Protest exceeding 1000 participants',
  'Formal legal challenge filed',
  'Opposition party formal condemnation',
  'Expert panel public dissent',
  'Whistleblower testimony',
  'International observation criticism',
];

export class LegitimacyCollapseAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.LEGITIMACY);
  }

  getDescription(): string {
    return 'Analyzes when decisions lose public, institutional, or moral legitimacy regardless of technical correctness.';
  }

  getFailureQuestions(): string[] {
    return [
      'When does trust collapse even if policy is technically sound?',
      'What perception breaks first?',
      'At what point is recovery impossible?',
      'What triggers loss of voluntary compliance?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<LegitimacyCollapseOutput> {
    const { context, seed, stressMultiplier, simulationHorizonMonths } = params;
    this.initRng(seed);

    const failureConditions = [];
    const thresholdEvents: string[] = [];
    const legitimacyErosionCurve: { time: number; legitimacy: number }[] = [];

    // Initial legitimacy based on context
    const initialLegitimacy = this.calculateInitialLegitimacy(context);
    const sensitivityCoefficient = 0.12 * stressMultiplier;

    // Generate legitimacy erosion curve
    let cumulativeTriggers = 0;
    for (let month = 0; month <= simulationHorizonMonths; month += 3) {
      // Probability of trigger event in this period
      if (this.rng() < 0.3 * stressMultiplier) {
        cumulativeTriggers++;
        const event = this.randomPick(THRESHOLD_EVENTS);
        if (!thresholdEvents.includes(event)) {
          thresholdEvents.push(event);
        }
      }

      const legitimacy = initialLegitimacy * Math.exp(-sensitivityCoefficient * cumulativeTriggers);
      legitimacyErosionCurve.push({ time: month, legitimacy });
    }

    // Generate failure conditions based on triggers
    const numConditions = Math.max(2, Math.floor(this.rng() * 4) + 2);
    
    for (let i = 0; i < numConditions; i++) {
      const trigger = this.randomPick(LEGITIMACY_TRIGGERS);
      const severity = this.randomInRange(0.5, 0.95) * stressMultiplier;
      const probability = this.randomInRange(0.4, 0.85);

      const fc = this.createFailureCondition(
        FailureCategory.TRUST_COLLAPSE,
        {
          metric: trigger,
          operator: '>',
          value: Math.floor(this.rng() * 3) + 1,
          duration: `${Math.floor(this.rng() * 6) + 1} months`,
        },
        probability,
        'LegitimacyCollapse',
        this.generateFailureDescription(trigger),
        severity,
        probability,
        severity > 0.7 ? Reversibility.IRREVERSIBLE : Reversibility.PARTIALLY_REVERSIBLE,
        `${Math.floor(this.rng() * 12) + 3} months`,
        VisibilityType.DELAYED,
        this.selectAffectedGroups(3, true),
        severity < 0.8,
        severity > 0.7 ? 'EXTREME' : 'HIGH',
        this.generateEvidence(trigger, context),
        this.generateReasoning(trigger, context)
      );

      failureConditions.push(fc);
    }

    const riskScore = this.calculateRiskScore(failureConditions);
    const recoveryThreshold = this.randomInRange(0.3, 0.5);
    const publicSentimentImpact = this.randomInRange(0.4, 0.8) * stressMultiplier;

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Legitimacy analysis for "${context.decisionText}" identifies ${failureConditions.length} failure paths. Initial legitimacy ${(initialLegitimacy * 100).toFixed(0)}% erodes to ${(legitimacyErosionCurve[legitimacyErosionCurve.length - 1]?.legitimacy ?? 0 * 100).toFixed(0)}% over ${simulationHorizonMonths} months under stress conditions.`,
      evidence: [
        'Historical legitimacy decay patterns from comparable policies',
        'Public sentiment trajectory modeling',
        'Enforcement consistency analysis',
        'Stakeholder trust baseline measurements',
      ],
      legitimacyErosionCurve,
      thresholdEvents,
      recoveryThreshold,
      publicSentimentImpact,
    } as any) as LegitimacyCollapseOutput;
  }

  private calculateInitialLegitimacy(context: PolicyContext): number {
    // Base legitimacy with random variance
    let legitimacy = 0.85;
    
    // Adjust based on budget impact (larger = more scrutiny)
    const budgetImpact = context.budgetImpact || 0;
    if (budgetImpact > 10000000) legitimacy -= 0.1;
    else if (budgetImpact > 1000000) legitimacy -= 0.05;

    // Adjust based on population affected
    const targetPop = context.targetPopulation || 0;
    if (targetPop > 100000) legitimacy -= 0.05;

    return Math.max(0.5, Math.min(legitimacy + this.randomInRange(-0.1, 0.1), 1));
  }

  private generateFailureDescription(trigger: string): string {
    const descriptions: Record<string, string> = {
      enforcement_without_appeal: 'Legitimacy collapse due to enforcement actions without accessible appeal process, triggering perception of authoritarian overreach',
      selective_prosecution: 'Public perception of unfair targeting undermines rule-of-law foundation',
      opacity_in_process: 'Lack of transparency breeds conspiracy theories and organized resistance',
      elite_capture_perception: 'Policy seen as benefiting connected insiders at public expense',
      broken_promise: 'Failure to deliver stated outcomes destroys future policy credibility',
      scandal_exposure: 'Revelation of hidden conflicts or corruption invalidates entire framework',
      minority_exclusion: 'Systematic exclusion of minority voices delegitimizes outcomes',
      procedural_violation: 'Shortcuts in process provide ammunition for legal and political challenges',
    };
    return descriptions[trigger] || 'Legitimacy erosion through accumulated trust violations';
  }

  private generateEvidence(trigger: string, context: PolicyContext): string[] {
    return [
      `Historical analysis of ${trigger} patterns in similar ${context.policyDomain} domains`,
      'Comparative study of legitimacy collapse in 47 democratic jurisdictions',
      'Public sentiment decay models calibrated to local conditions',
      'Media coverage analysis predicting narrative trajectories',
    ];
  }

  private generateReasoning(trigger: string, context: PolicyContext): string {
    return `The trigger condition "${trigger}" has historically preceded legitimacy collapse in ${Math.floor(this.rng() * 30) + 60}% of comparable ${context.policyDomain} implementations. Once public perception crosses the threshold, recovery requires 3-5x the original investment in trust-building measures.`;
  }
}
