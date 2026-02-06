/**
 * Political Backlash Agent
 * 
 * Purpose: Model political weaponization of the decision.
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  PoliticalBacklashOutput,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

const OPPOSITION_FRAMINGS = [
  'Government overreach threatening individual liberty',
  'Elite capture serving special interests',
  'Incompetent bureaucracy wasting taxpayer money',
  'Out-of-touch policy ignoring real problems',
  'Radical social engineering experiment',
  'Backdoor wealth transfer to cronies',
  'Assault on traditional values and community',
  'Failed policy recycled from other jurisdictions',
];

const MEDIA_ANGLES = [
  'Human interest story of affected family',
  'Whistleblower reveals hidden costs',
  'Expert dissent from academic critics',
  'Comparative failure in neighboring region',
  'Timeline of broken promises',
  'Follow the money investigation',
  'Victim testimonials compilation',
];

export class PoliticalBacklashAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.POLITICAL_BACKLASH);
  }

  getDescription(): string {
    return 'Models how decisions can be politically weaponized by opposition forces.';
  }

  getFailureQuestions(): string[] {
    return [
      'How will opposition frame this policy?',
      'What media narratives will emerge?',
      'How does election cycle affect risk?',
      'What populist exploitation is possible?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<PoliticalBacklashOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const failureConditions = [];
    const oppositionFramings = this.randomPickMultiple(OPPOSITION_FRAMINGS, Math.floor(this.rng() * 3) + 2);
    const mediaAngles = this.randomPickMultiple(MEDIA_ANGLES, Math.floor(this.rng() * 3) + 2);

    // Election cycle amplification
    const monthsToElection = Math.floor(this.rng() * 24) + 6;
    const electionCycleAmplification = monthsToElection < 12 ? 1.5 : monthsToElection < 18 ? 1.2 : 1.0;

    for (const framing of oppositionFramings) {
      const severity = this.randomInRange(0.4, 0.8) * stressMultiplier * electionCycleAmplification;
      const probability = this.randomInRange(0.5, 0.85);

      const fc = this.createFailureCondition(
        FailureCategory.POLITICAL_WEAPONIZATION,
        {
          metric: 'opposition_narrative_adoption',
          operator: '>',
          value: 0.3,
          duration: '2 months',
        },
        probability,
        'PoliticalBacklash',
        `"${framing}" narrative gains traction, shifting public opinion against policy`,
        Math.min(severity, 0.95),
        probability,
        Reversibility.PARTIALLY_REVERSIBLE,
        `${Math.floor(this.rng() * 6) + 2} months`,
        VisibilityType.IMMEDIATE,
        this.selectAffectedGroups(2, false),
        true,
        'MEDIUM',
        [
          'Political discourse analysis',
          'Opposition research patterns',
          'Media cycle modeling',
        ],
        `The framing "${framing}" exploits ${context.policyDomain} policy vulnerabilities and has ${(probability * 100).toFixed(0)}% adoption likelihood among opposition networks.`
      );

      failureConditions.push(fc);
    }

    const populistExploitationRisk = this.randomInRange(0.4, 0.8) * stressMultiplier;
    const polarizationIndex = this.randomInRange(0.3, 0.7) * stressMultiplier;
    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Political backlash analysis identifies ${oppositionFramings.length} likely opposition framings with ${(electionCycleAmplification * 100 - 100).toFixed(0)}% election cycle amplification. Polarization index ${polarizationIndex.toFixed(2)} indicates ${polarizationIndex > 0.5 ? 'high' : 'moderate'} partisan weaponization risk.`,
      evidence: [
        'Political discourse pattern analysis',
        'Opposition messaging research',
        'Election cycle timing analysis',
        'Media narrative trajectory modeling',
      ],
      oppositionFramings,
      mediaAngles,
      electionCycleAmplification,
      populistExploitationRisk,
      polarizationIndex,
    } as any) as PoliticalBacklashOutput;
  }
}
