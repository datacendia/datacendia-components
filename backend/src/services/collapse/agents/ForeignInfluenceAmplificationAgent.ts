/**
 * Service — Foreign Influence Amplification Agent
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports ForeignInfluenceAmplificationAgent
 * @module services/collapse/agents/ForeignInfluenceAmplificationAgent
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Foreign Influence Amplification Agent
 * 
 * "Can adversaries exploit this decision to undermine sovereignty or cohesion?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class ForeignInfluenceAmplificationAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.FOREIGN_INFLUENCE);
  }

  getDescription(): string {
    return 'Analyzes whether policy can be exploited by foreign adversaries for information warfare, lawfare, or trust sabotage.';
  }

  getFailureQuestions(): string[] {
    return [
      'Can foreign actors weaponize this policy in information campaigns?',
      'Does this create lawfare opportunities for adversaries?',
      'Will this undermine domestic cohesion in ways adversaries can exploit?',
      'Are there national security implications of policy failure?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const infoWarfareVulnerability = this.calculateInfoWarfareVulnerability(text, context);
    const lawfareExposure = this.calculateLawfareExposure(text);
    const cohesionUndermining = this.calculateCohesionUndermining(text, context);

    if (infoWarfareVulnerability > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SOVEREIGNTY_UNDERMINING,
        { metric: 'info_warfare_vulnerability', operator: '>', value: 0.4 },
        0.75,
        'INFORMATION_WARFARE_VULNERABILITY',
        `${(infoWarfareVulnerability * 100).toFixed(0)}% info warfare vulnerability - adversaries can weaponize this in disinformation.`,
        infoWarfareVulnerability * 0.85 * stressMultiplier,
        0.6,
        Reversibility.PARTIALLY_REVERSIBLE,
        'Immediate to 1 year',
        VisibilityType.DELAYED,
        [{ name: 'General public', populationShare: 1.0, vulnerabilityScore: infoWarfareVulnerability * 0.5, protectedClass: false }],
        true,
        'HIGH',
        ['Information warfare doctrine', 'Foreign influence detection'],
        'Domestic policy failures become ammunition for adversaries'
      ));
    }

    if (lawfareExposure > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SOVEREIGNTY_UNDERMINING,
        { metric: 'lawfare_exposure', operator: '>', value: 0.5 },
        0.7,
        'LAWFARE_EXPOSURE',
        `${(lawfareExposure * 100).toFixed(0)}% lawfare exposure - adversaries can exploit through legal challenges.`,
        lawfareExposure * 0.8 * stressMultiplier,
        0.55,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-3 years',
        VisibilityType.DELAYED,
        [{ name: 'Government institutions', populationShare: 0.01, vulnerabilityScore: lawfareExposure, protectedClass: false }],
        true,
        'HIGH',
        ['Lawfare tactics analysis', 'Strategic litigation patterns'],
        'Adversaries use legal systems as attack vectors'
      ));
    }

    if (cohesionUndermining > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SOVEREIGNTY_UNDERMINING,
        { metric: 'cohesion_undermining', operator: '>', value: 0.5 },
        0.8,
        'SOCIAL_COHESION_UNDERMINING',
        `${(cohesionUndermining * 100).toFixed(0)}% cohesion undermining risk - policy may deepen divisions exploitable by adversaries.`,
        cohesionUndermining * 0.9 * stressMultiplier,
        0.7,
        Reversibility.IRREVERSIBLE,
        '1-5 years',
        VisibilityType.GRADUAL,
        [{ name: 'Polarized communities', populationShare: 0.6, vulnerabilityScore: cohesionUndermining, protectedClass: false }],
        true,
        'EXTREME',
        ['Social cohesion research', 'Foreign interference patterns'],
        'Divided societies are easier targets for foreign influence'
      ));
    }

    // Baseline: All public policies present some foreign exploitation surface
    if (failureConditions.length === 0) {
      const baselineRisk = 0.12 + this.rng() * 0.1;
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SOVEREIGNTY_UNDERMINING,
        { metric: 'baseline_foreign_exploitation', operator: '>=', value: 0.1 },
        0.4,
        'LATENT_FOREIGN_EXPLOITATION_SURFACE',
        `All public policies present attack surface for adversarial narrative exploitation. Baseline exposure: ${(baselineRisk * 100).toFixed(0)}%.`,
        baselineRisk * stressMultiplier,
        0.25 + this.rng() * 0.15,
        Reversibility.REVERSIBLE,
        '6-36 months',
        VisibilityType.HIDDEN,
        this.selectAffectedGroups(2, false),
        true,
        'LOW',
        ['Information warfare doctrine', 'Adversarial narrative analysis'],
        'State adversaries monitor and exploit policy implementation gaps'
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
      reasoning: `Foreign influence analysis: Info warfare vulnerability ${(infoWarfareVulnerability * 100).toFixed(0)}%, ` +
        `Lawfare exposure ${(lawfareExposure * 100).toFixed(0)}%, Cohesion undermining ${(cohesionUndermining * 100).toFixed(0)}%.`,
      evidence: ['Foreign influence operation patterns', 'National security assessments'],
    });
  }

  private calculateInfoWarfareVulnerability(text: string, context: { policyDomain: string }): number {
    let score = 0.2;
    // Controversial domains are more vulnerable
    const sensitiveDomains = ['security', 'defense', 'election', 'health', 'immigration'];
    if (sensitiveDomains.some(d => context.policyDomain.toLowerCase().includes(d))) score += 0.25;
    if (text.includes('controversial') || text.includes('divisive')) score += 0.2;
    if (text.includes('mandatory') || text.includes('compel')) score += 0.15;
    return Math.min(1, score + this.rng() * 0.15);
  }

  private calculateLawfareExposure(text: string): number {
    let score = 0.15;
    if (text.includes('international') && (text.includes('treaty') || text.includes('agreement'))) score += 0.25;
    if (text.includes('extraterritorial') || text.includes('jurisdiction')) score += 0.2;
    if (text.includes('exception') || text.includes('waiver')) score += 0.15;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateCohesionUndermining(text: string, context: { targetPopulation: number }): number {
    let score = 0.2;
    if (text.includes('group') && (text.includes('against') || text.includes('versus'))) score += 0.25;
    if (text.includes('restrict') && text.includes('certain')) score += 0.2;
    if (context.targetPopulation > 500000) score += 0.1; // Large populations = more impact
    return Math.min(1, score + this.rng() * 0.15);
  }
}
