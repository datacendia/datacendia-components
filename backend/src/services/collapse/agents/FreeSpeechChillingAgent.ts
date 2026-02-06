/**
 * Free Speech Chilling Agent
 * 
 * "Does this decision create second-order chilling effects on lawful speech?"
 * 
 * ⚠️ NON-OVERRIDABLE in democratic jurisdictions.
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class FreeSpeechChillingAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.FREE_SPEECH_CHILLING);
  }

  getDescription(): string {
    return 'Analyzes whether a policy creates chilling effects on lawful speech through enforcement ambiguity, penalty severity, or surveillance proximity. NON-OVERRIDABLE in democratic jurisdictions.';
  }

  getFailureQuestions(): string[] {
    return [
      'Does this decision create fear of speaking on protected topics?',
      'Will enforcement ambiguity cause self-censorship?',
      'Are penalties severe enough to discourage protected expression?',
      'Does surveillance proximity suppress legitimate discourse?',
      'Will marginalized voices be disproportionately silenced?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    // Calculate chilling coefficient
    const chillingCoefficient = this.calculateChillingCoefficient(text);
    const enforcementAmbiguity = this.calculateEnforcementAmbiguity(text);
    const penaltySeverity = this.calculatePenaltySeverity(text);
    const surveillanceProximity = this.calculateSurveillanceProximity(text);

    // Main chilling effect failure
    if (chillingCoefficient > 0.3) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SPEECH_SUPPRESSION,
        { metric: 'chilling_coefficient', operator: '>', value: 0.3 },
        0.85,
        'WIDESPREAD_SELF_CENSORSHIP',
        `Policy creates ${(chillingCoefficient * 100).toFixed(0)}% chilling effect on lawful speech. Citizens will avoid protected expression due to uncertainty about consequences.`,
        Math.min(1, chillingCoefficient * 1.2 * stressMultiplier),
        0.7 + this.rng() * 0.2,
        Reversibility.PARTIALLY_REVERSIBLE,
        'Immediate to 3 months',
        VisibilityType.HIDDEN,
        this.selectAffectedGroups(3, true),
        true,
        'MEDIUM',
        ['Chilling effect doctrine (NAACP v. Alabama)', 'Self-censorship research'],
        'Speech suppression through indirect mechanisms is as harmful as direct censorship'
      ));
    }

    // Enforcement ambiguity failure
    if (enforcementAmbiguity > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SPEECH_SUPPRESSION,
        { metric: 'enforcement_ambiguity', operator: '>', value: 0.5 },
        0.8,
        'VAGUENESS_CHILLING',
        `Policy contains ${(enforcementAmbiguity * 100).toFixed(0)}% enforcement ambiguity. Vague standards create over-compliance and self-censorship.`,
        enforcementAmbiguity * 0.9 * stressMultiplier,
        0.75,
        Reversibility.REVERSIBLE,
        'Immediate',
        VisibilityType.HIDDEN,
        [{ name: 'Speakers near enforcement boundaries', populationShare: 0.3, vulnerabilityScore: enforcementAmbiguity, protectedClass: true }],
        true,
        'LOW',
        ['Void-for-vagueness doctrine', 'Overbreadth doctrine'],
        'People avoid lawful speech when rules are unclear'
      ));
    }

    // Penalty severity failure
    if (penaltySeverity > 0.6) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SPEECH_SUPPRESSION,
        { metric: 'penalty_severity', operator: '>', value: 0.6 },
        0.85,
        'DISPROPORTIONATE_PENALTY_CHILLING',
        `Penalty severity of ${(penaltySeverity * 100).toFixed(0)}% creates deterrent disproportionate to harms.`,
        penaltySeverity * stressMultiplier,
        0.8,
        Reversibility.REVERSIBLE,
        'Immediate',
        VisibilityType.DELAYED,
        [{ name: 'Risk-averse speakers', populationShare: 0.5, vulnerabilityScore: penaltySeverity, protectedClass: true }],
        true,
        'MEDIUM',
        ['Proportionality principle in speech restrictions'],
        'People self-censor to avoid asymmetric risks'
      ));
    }

    // Surveillance proximity failure
    if (surveillanceProximity > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SPEECH_SUPPRESSION,
        { metric: 'surveillance_proximity', operator: '>', value: 0.5 },
        0.8,
        'SURVEILLANCE_CHILLING',
        `Surveillance proximity of ${(surveillanceProximity * 100).toFixed(0)}% creates monitoring awareness that causes self-censorship.`,
        surveillanceProximity * 0.85 * stressMultiplier,
        0.7,
        Reversibility.PARTIALLY_REVERSIBLE,
        'Immediate to 6 months',
        VisibilityType.HIDDEN,
        [{ name: 'Privacy-conscious speakers', populationShare: 0.4, vulnerabilityScore: surveillanceProximity, protectedClass: true }],
        true,
        'HIGH',
        ['Panopticon effect research'],
        'Knowledge of being watched changes behavior regardless of enforcement'
      ));
    }

    // Prior restraint detection (most severe)
    if (this.detectsPriorRestraint(text)) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SPEECH_SUPPRESSION,
        { metric: 'prior_restraint', operator: '==', value: 1 },
        0.95,
        'PRIOR_RESTRAINT',
        'Policy requires pre-approval of speech - presumptively unconstitutional prior restraint.',
        0.95 * stressMultiplier,
        0.9,
        Reversibility.IRREVERSIBLE,
        'Immediate',
        VisibilityType.IMMEDIATE,
        [{ name: 'All speakers in affected domain', populationShare: 1.0, vulnerabilityScore: 0.95, protectedClass: true }],
        false,
        'EXTREME',
        ['Near v. Minnesota (1931)', 'NY Times v. United States (1971)'],
        'Prior restraints bear heavy presumption against constitutional validity'
      ));
    }

    // Baseline: Always assess potential for secondary chilling effects
    if (failureConditions.length === 0) {
      const baselineRisk = 0.15 + this.rng() * 0.15;
      failureConditions.push(this.createFailureCondition(
        FailureCategory.SPEECH_SUPPRESSION,
        { metric: 'baseline_chilling_risk', operator: '>=', value: 0.1 },
        0.5,
        'LATENT_CHILLING_POTENTIAL',
        `Policy implementation may create secondary chilling effects through compliance uncertainty. Baseline risk: ${(baselineRisk * 100).toFixed(0)}%.`,
        baselineRisk * stressMultiplier,
        0.4 + this.rng() * 0.2,
        Reversibility.REVERSIBLE,
        '6-12 months',
        VisibilityType.GRADUAL,
        this.selectAffectedGroups(2, true),
        true,
        'LOW',
        ['Chilling effect doctrine', 'Regulatory compliance burden studies'],
        'All policies carry latent speech implications that require monitoring'
      ));
    }

    const riskScore = Math.min(1, this.calculateRiskScore(failureConditions) * 1.2);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Free speech chilling analysis: ${(chillingCoefficient * 100).toFixed(0)}% chilling coefficient detected. ` +
        `Enforcement ambiguity: ${(enforcementAmbiguity * 100).toFixed(0)}%, Penalty severity: ${(penaltySeverity * 100).toFixed(0)}%, ` +
        `Surveillance proximity: ${(surveillanceProximity * 100).toFixed(0)}%. NON-OVERRIDABLE in democratic jurisdictions.`,
      evidence: [
        'Chilling effect doctrine (NAACP v. Alabama, Lamont v. Postmaster General)',
        'Void-for-vagueness doctrine',
        'Prior restraint precedents (Near v. Minnesota, NY Times v. US)',
      ],
    });
  }

  private calculateChillingCoefficient(text: string): number {
    let score = 0;
    const chillingIndicators = [
      { term: 'restrict', weight: 0.15 }, { term: 'prohibit', weight: 0.2 },
      { term: 'ban', weight: 0.2 }, { term: 'penalt', weight: 0.15 },
      { term: 'fine', weight: 0.1 }, { term: 'criminal', weight: 0.25 },
      { term: 'monitor', weight: 0.1 }, { term: 'report', weight: 0.08 },
    ];
    for (const ind of chillingIndicators) {
      if (text.includes(ind.term)) score += ind.weight;
    }
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateEnforcementAmbiguity(text: string): number {
    const ambiguous = ['reasonable', 'appropriate', 'may', 'harmful', 'offensive', 'problematic'];
    const clear = ['shall', 'must', 'specific', 'defined', 'enumerated'];
    const ambCount = ambiguous.filter(t => text.includes(t)).length;
    const clearCount = clear.filter(t => text.includes(t)).length;
    return Math.min(1, ((ambCount + 1) / (clearCount + 1)) * 0.3 + this.rng() * 0.1);
  }

  private calculatePenaltySeverity(text: string): number {
    let severity = 0;
    if (text.includes('criminal') || text.includes('imprison')) severity += 0.4;
    if (text.includes('fine') || text.includes('penalty')) severity += 0.2;
    if (text.includes('ban') || text.includes('prohibit')) severity += 0.15;
    if (text.includes('revok')) severity += 0.25;
    return Math.min(1, severity + this.rng() * 0.1);
  }

  private calculateSurveillanceProximity(text: string): number {
    let proximity = 0;
    if (text.includes('monitor')) proximity += 0.25;
    if (text.includes('track')) proximity += 0.2;
    if (text.includes('collect') && text.includes('data')) proximity += 0.2;
    if (text.includes('identify') || text.includes('verification')) proximity += 0.15;
    return Math.min(1, proximity + this.rng() * 0.1);
  }

  private detectsPriorRestraint(text: string): boolean {
    const indicators = ['prior approval', 'pre-publication', 'permission before', 'license to publish'];
    return indicators.some(i => text.includes(i));
  }
}
