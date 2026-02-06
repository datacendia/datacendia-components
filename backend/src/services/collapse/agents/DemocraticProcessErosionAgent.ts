/**
 * Democratic Process Erosion Agent
 * 
 * "Does this decision hollow out democratic participation even if outcomes are 'good'?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class DemocraticProcessErosionAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.DEMOCRATIC_EROSION);
  }

  getDescription(): string {
    return 'Analyzes whether policy hollows out democratic participation through automation, technocratic creep, or institutional bypass.';
  }

  getFailureQuestions(): string[] {
    return [
      'Does this over-automate discretionary authority?',
      'Are administrative decisions replacing elected oversight?',
      'Will citizens feel their participation matters less?',
      'Does this create "government by algorithm"?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const technocraticCreep = this.calculateTechnocraticCreep(text);
    const institutionalBypass = this.calculateInstitutionalBypass(text);
    const voterDisengagement = this.calculateVoterDisengagement(text, technocraticCreep);

    if (technocraticCreep > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DEMOCRATIC_HOLLOWING,
        { metric: 'technocratic_creep', operator: '>', value: 0.5 },
        0.75,
        'TECHNOCRATIC_DISPLACEMENT',
        `Technocratic creep of ${(technocraticCreep * 100).toFixed(0)}% - expert/algorithmic authority displacing democratic deliberation.`,
        technocraticCreep * 0.85 * stressMultiplier,
        0.65,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-3 years',
        VisibilityType.GRADUAL,
        [{ name: 'Non-expert citizens', populationShare: 0.85, vulnerabilityScore: technocraticCreep, protectedClass: false }],
        true,
        'MEDIUM',
        ['Technocracy critique literature', 'Democratic theory'],
        'Expertise should inform but not replace democratic choice'
      ));
    }

    if (institutionalBypass > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DEMOCRATIC_HOLLOWING,
        { metric: 'institutional_bypass', operator: '>', value: 0.5 },
        0.8,
        'INSTITUTIONAL_BYPASS',
        `Institutional bypass index of ${(institutionalBypass * 100).toFixed(0)}% - democratic institutions circumvented.`,
        institutionalBypass * stressMultiplier,
        0.75,
        Reversibility.PARTIALLY_REVERSIBLE,
        'Immediate to 1 year',
        VisibilityType.DELAYED,
        [{ name: 'Democratic institutions', populationShare: 1.0, vulnerabilityScore: institutionalBypass, protectedClass: false }],
        true,
        'HIGH',
        ['Institutional erosion studies'],
        'Bypassing institutions sets precedents that accumulate'
      ));
    }

    if (voterDisengagement > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DEMOCRATIC_HOLLOWING,
        { metric: 'voter_disengagement', operator: '>', value: 0.4 },
        0.7,
        'VOTER_DISENGAGEMENT',
        `${(voterDisengagement * 100).toFixed(0)}% risk of voter disengagement - citizens may feel participation is meaningless.`,
        voterDisengagement * 0.8 * stressMultiplier,
        0.6,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-5 years',
        VisibilityType.DELAYED,
        [{ name: 'Civic-minded citizens', populationShare: 0.4, vulnerabilityScore: voterDisengagement, protectedClass: false }],
        true,
        'HIGH',
        ['Voter turnout decline studies'],
        'Democratic legitimacy requires citizens who believe their voice matters'
      ));
    }

    // Baseline: All governance changes carry democratic process risk
    if (failureConditions.length === 0) {
      const baselineRisk = 0.12 + this.rng() * 0.12;
      failureConditions.push(this.createFailureCondition(
        FailureCategory.DEMOCRATIC_HOLLOWING,
        { metric: 'baseline_democratic_risk', operator: '>=', value: 0.1 },
        0.45,
        'LATENT_DEMOCRATIC_EROSION',
        `Any policy change without explicit democratic engagement mechanisms carries baseline erosion risk: ${(baselineRisk * 100).toFixed(0)}%.`,
        baselineRisk * stressMultiplier,
        0.35 + this.rng() * 0.15,
        Reversibility.REVERSIBLE,
        '12-24 months',
        VisibilityType.GRADUAL,
        this.selectAffectedGroups(2, false),
        true,
        'LOW',
        ['Democratic engagement literature', 'Policy implementation studies'],
        'Governance decisions shape citizen-state relationships over time'
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
      reasoning: `Democratic erosion analysis: Technocratic creep ${(technocraticCreep * 100).toFixed(0)}%, ` +
        `Institutional bypass ${(institutionalBypass * 100).toFixed(0)}%, Voter disengagement risk ${(voterDisengagement * 100).toFixed(0)}%.`,
      evidence: ['Democratic backsliding research', 'Civic engagement studies', 'Institutional erosion literature'],
    });
  }

  private calculateTechnocraticCreep(text: string): number {
    let score = 0;
    const indicators = [
      { term: 'algorithm', weight: 0.15 }, { term: 'automat', weight: 0.15 },
      { term: 'model', weight: 0.1 }, { term: 'expert', weight: 0.1 },
      { term: 'data-driven', weight: 0.12 }, { term: 'efficient', weight: 0.05 },
    ];
    for (const ind of indicators) {
      if (text.includes(ind.term)) score += ind.weight;
    }
    const democratic = ['vote', 'elect', 'citizen', 'public', 'participat'];
    if (!democratic.some(t => text.includes(t))) score += 0.15;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateInstitutionalBypass(text: string): number {
    let score = 0;
    const bypass = [
      { term: 'override', weight: 0.2 }, { term: 'exception', weight: 0.1 },
      { term: 'waiver', weight: 0.1 }, { term: 'exempt', weight: 0.1 },
      { term: 'bypass', weight: 0.2 }, { term: 'direct authority', weight: 0.15 },
    ];
    for (const ind of bypass) {
      if (text.includes(ind.term)) score += ind.weight;
    }
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateVoterDisengagement(_text: string, technocraticCreep: number): number {
    return Math.min(1, technocraticCreep * 0.8 + this.rng() * 0.1);
  }
}
