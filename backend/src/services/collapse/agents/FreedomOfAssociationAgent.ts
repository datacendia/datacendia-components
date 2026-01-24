/**
 * Freedom of Association Agent
 * 
 * "Does this policy discourage lawful assembly, organizing, or unionization?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class FreedomOfAssociationAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.FREEDOM_OF_ASSOCIATION);
  }

  getDescription(): string {
    return 'Analyzes whether policy discourages lawful assembly, labor organizing, or political association.';
  }

  getFailureQuestions(): string[] {
    return [
      'Does this discourage lawful assembly or protest?',
      'Are there barriers to labor organizing?',
      'Does this create chilling effects on political association?',
      'Are membership lists or affiliations tracked in ways that deter joining?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const assemblyRestriction = this.calculateAssemblyRestriction(text);
    const laborOrganizingBarrier = this.calculateLaborBarrier(text);
    const membershipTracking = this.calculateMembershipTracking(text);

    if (assemblyRestriction > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ASSOCIATION_RESTRICTION,
        { metric: 'assembly_restriction', operator: '>', value: 0.4 },
        0.8,
        'ASSEMBLY_RESTRICTION',
        `${(assemblyRestriction * 100).toFixed(0)}% assembly restriction risk - barriers to lawful gathering.`,
        assemblyRestriction * 0.85 * stressMultiplier,
        0.7,
        Reversibility.REVERSIBLE,
        'Immediate',
        VisibilityType.IMMEDIATE,
        [{ name: 'Activists and organizers', populationShare: 0.1, vulnerabilityScore: assemblyRestriction, protectedClass: true }],
        true,
        'MEDIUM',
        ['First Amendment assembly rights', 'Public forum doctrine'],
        'Assembly restrictions require narrow tailoring to significant interests'
      ));
    }

    if (laborOrganizingBarrier > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ASSOCIATION_RESTRICTION,
        { metric: 'labor_organizing_barrier', operator: '>', value: 0.4 },
        0.75,
        'LABOR_ORGANIZING_BARRIER',
        `${(laborOrganizingBarrier * 100).toFixed(0)}% labor organizing barrier - workers' collective action impeded.`,
        laborOrganizingBarrier * 0.8 * stressMultiplier,
        0.65,
        Reversibility.PARTIALLY_REVERSIBLE,
        '6-12 months',
        VisibilityType.GRADUAL,
        [{ name: 'Workers seeking to organize', populationShare: 0.3, vulnerabilityScore: laborOrganizingBarrier, protectedClass: true }],
        true,
        'MEDIUM',
        ['NLRA Section 7 rights', 'ILO conventions on freedom of association'],
        'Labor organizing is protected associational activity'
      ));
    }

    if (membershipTracking > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ASSOCIATION_RESTRICTION,
        { metric: 'membership_tracking', operator: '>', value: 0.5 },
        0.85,
        'CHILLING_MEMBERSHIP_SURVEILLANCE',
        `${(membershipTracking * 100).toFixed(0)}% membership tracking risk - surveillance deters association.`,
        membershipTracking * 0.9 * stressMultiplier,
        0.75,
        Reversibility.PARTIALLY_REVERSIBLE,
        'Immediate to 6 months',
        VisibilityType.HIDDEN,
        [{ name: 'Group members', populationShare: 0.2, vulnerabilityScore: membershipTracking, protectedClass: true }],
        true,
        'HIGH',
        ['NAACP v. Alabama (1958)', 'Associational privacy rights'],
        'Compelled disclosure of membership chills association'
      ));
    }

    // Baseline: All regulatory policies carry associational implications
    if (failureConditions.length === 0) {
      const baselineRisk = 0.1 + this.rng() * 0.12;
      failureConditions.push(this.createFailureCondition(
        FailureCategory.ASSOCIATION_RESTRICTION,
        { metric: 'baseline_association_risk', operator: '>=', value: 0.1 },
        0.4,
        'LATENT_ASSOCIATIONAL_BURDEN',
        `Policy may create incidental burdens on association through compliance requirements. Baseline risk: ${(baselineRisk * 100).toFixed(0)}%.`,
        baselineRisk * stressMultiplier,
        0.3 + this.rng() * 0.15,
        Reversibility.REVERSIBLE,
        '6-24 months',
        VisibilityType.GRADUAL,
        this.selectAffectedGroups(2, false),
        true,
        'LOW',
        ['Incidental burden doctrine', 'Association rights literature'],
        'Regulatory compliance can incidentally burden associational activities'
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
      reasoning: `Association freedom analysis: Assembly restriction ${(assemblyRestriction * 100).toFixed(0)}%, ` +
        `Labor barrier ${(laborOrganizingBarrier * 100).toFixed(0)}%, Membership tracking ${(membershipTracking * 100).toFixed(0)}%.`,
      evidence: ['First Amendment association rights', 'Labor law protections'],
    });
  }

  private calculateAssemblyRestriction(text: string): number {
    let score = 0;
    if (text.includes('permit') && text.includes('gather')) score += 0.25;
    if (text.includes('restrict') && (text.includes('assembly') || text.includes('protest'))) score += 0.3;
    if (text.includes('dispersal') || text.includes('curfew')) score += 0.2;
    if (text.includes('public safety') && text.includes('limit')) score += 0.15;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateLaborBarrier(text: string): number {
    let score = 0;
    if (text.includes('union') && (text.includes('restrict') || text.includes('limit'))) score += 0.35;
    if (text.includes('collective') && text.includes('bargain') && text.includes('prohibit')) score += 0.3;
    if (text.includes('independent contractor') && text.includes('classify')) score += 0.2;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateMembershipTracking(text: string): number {
    let score = 0;
    if (text.includes('member') && text.includes('list')) score += 0.3;
    if (text.includes('affiliation') && text.includes('disclose')) score += 0.25;
    if (text.includes('register') && (text.includes('group') || text.includes('organization'))) score += 0.25;
    return Math.min(1, score + this.rng() * 0.1);
  }
}
