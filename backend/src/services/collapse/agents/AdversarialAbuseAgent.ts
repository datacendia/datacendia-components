/**
 * Adversarial Abuse Agent
 * 
 * Purpose: Assume malicious exploitation by actors who want to abuse the policy.
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  AdversarialAbuseOutput,
  ExploitPath,
  ThreatActorType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

const ATTACK_VECTORS = [
  'Regulatory capture through revolving door appointments',
  'Information asymmetry exploitation via insider knowledge',
  'Loophole chaining across jurisdictions',
  'Sybil attacks through shell organizations',
  'Timing attacks exploiting implementation gaps',
  'Social engineering of enforcement personnel',
  'Documentation fraud in compliance reporting',
  'Selective enforcement manipulation',
];

const THREAT_ACTOR_PROFILES: { type: ThreatActorType; capability: number; motivation: string }[] = [
  { type: ThreatActorType.CORRUPT_OFFICIAL, capability: 0.8, motivation: 'Personal enrichment through position abuse' },
  { type: ThreatActorType.CRIMINAL_ENTERPRISE, capability: 0.7, motivation: 'Profit through systematic exploitation' },
  { type: ThreatActorType.FOREIGN_INFLUENCE, capability: 0.6, motivation: 'Strategic destabilization or capture' },
  { type: ThreatActorType.CORPORATE_CAPTURE, capability: 0.85, motivation: 'Regulatory advantage over competitors' },
  { type: ThreatActorType.POLITICAL_OPPORTUNIST, capability: 0.65, motivation: 'Electoral advantage through manipulation' },
  { type: ThreatActorType.RENT_SEEKER, capability: 0.75, motivation: 'Extracting value without creating it' },
];

export class AdversarialAbuseAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.ADVERSARIAL_ABUSE);
  }

  getDescription(): string {
    return 'Models malicious exploitation by threat actors who will abuse the policy.';
  }

  getFailureQuestions(): string[] {
    return [
      'How would a corrupt official exploit this?',
      'What criminal opportunities does this create?',
      'How difficult is detection of abuse?',
      'What is the payoff vs effort for exploitation?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<AdversarialAbuseOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const failureConditions = [];
    const exploitPaths: ExploitPath[] = [];
    const abuseCostCurve: { effort: number; payoff: number }[] = [];

    // Analyze each threat actor
    const activeActors = THREAT_ACTOR_PROFILES.filter(() => this.rng() > 0.3);

    for (const actor of activeActors) {
      const attackVector = this.randomPick(ATTACK_VECTORS);
      const detectionDifficulty = this.randomInRange(0.4, 0.9);
      const payoff = this.randomInRange(0.3, 0.8) * actor.capability * stressMultiplier;

      const exploit: ExploitPath = {
        id: `EP-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        threatActor: actor.type,
        attackVector,
        exploitSteps: this.generateExploitSteps(actor.type, attackVector),
        detectionDifficulty,
        payoff,
        mitigation: this.generateMitigation(actor.type),
      };

      exploitPaths.push(exploit);

      const severity = payoff * (1 + detectionDifficulty) / 2;
      const probability = actor.capability * this.randomInRange(0.5, 0.8);

      const fc = this.createFailureCondition(
        FailureCategory.EXPLOITATION,
        {
          metric: `${actor.type.toLowerCase()}_exploit_opportunity`,
          operator: '>',
          value: 0.5,
        },
        probability,
        'AdversarialExploitation',
        `${actor.type.replace(/_/g, ' ')} exploits policy through ${attackVector.toLowerCase()}`,
        Math.min(severity, 0.95),
        probability,
        detectionDifficulty > 0.7 ? Reversibility.IRREVERSIBLE : Reversibility.PARTIALLY_REVERSIBLE,
        `${Math.floor(this.rng() * 12) + 3} months`,
        detectionDifficulty > 0.7 ? VisibilityType.HIDDEN : VisibilityType.DELAYED,
        this.selectAffectedGroups(3, true),
        detectionDifficulty < 0.6,
        severity > 0.7 ? 'EXTREME' : 'HIGH',
        [
          `Threat actor capability assessment for ${actor.type}`,
          'Attack surface analysis',
          'Detection feasibility study',
        ],
        `${actor.type.replace(/_/g, ' ')} has ${(actor.capability * 100).toFixed(0)}% capability to execute ${attackVector.toLowerCase()} with ${(detectionDifficulty * 100).toFixed(0)}% detection difficulty.`
      );

      failureConditions.push(fc);
    }

    // Generate cost curve
    for (let effort = 0.1; effort <= 1.0; effort += 0.1) {
      const payoff = exploitPaths.reduce((sum, ep) => {
        const effortThreshold = 1 - ep.detectionDifficulty;
        return sum + (effort >= effortThreshold ? ep.payoff : 0);
      }, 0) / Math.max(exploitPaths.length, 1);
      abuseCostCurve.push({ effort, payoff });
    }

    const totalExploitRisk = exploitPaths.reduce((sum, ep) => sum + ep.payoff * (1 - ep.detectionDifficulty), 0) / Math.max(exploitPaths.length, 1);
    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Adversarial abuse analysis identifies ${exploitPaths.length} exploit paths across ${activeActors.length} threat actor types. Total exploit risk index: ${totalExploitRisk.toFixed(3)}.`,
      evidence: [
        'Threat actor profiling',
        'Attack surface mapping',
        'Exploit path enumeration',
        'Detection feasibility assessment',
      ],
      exploitPaths,
      abuseCostCurve,
      totalExploitRisk,
    }) as AdversarialAbuseOutput;
  }

  private generateExploitSteps(actor: ThreatActorType, vector: string): string[] {
    const baseSteps = [
      'Identify policy vulnerability',
      'Establish access or influence',
      'Execute exploitation',
      'Extract value',
      'Cover tracks',
    ];
    return baseSteps.map(s => `${actor.replace(/_/g, ' ')}: ${s} via ${vector.split(' ')[0]?.toLowerCase() || 'mechanism'}`);
  }

  private generateMitigation(actor: ThreatActorType): string {
    const mitigations: Record<ThreatActorType, string> = {
      [ThreatActorType.CORRUPT_OFFICIAL]: 'Mandatory rotation, external audits, whistleblower protections',
      [ThreatActorType.CRIMINAL_ENTERPRISE]: 'Enhanced KYC, cross-agency information sharing, pattern detection',
      [ThreatActorType.FOREIGN_INFLUENCE]: 'Beneficial ownership disclosure, CFIUS-style review, transparency requirements',
      [ThreatActorType.CORPORATE_CAPTURE]: 'Revolving door restrictions, conflict of interest disclosure, public comment periods',
      [ThreatActorType.POLITICAL_OPPORTUNIST]: 'Independent oversight, sunset clauses, bipartisan implementation boards',
      [ThreatActorType.RENT_SEEKER]: 'Market-based mechanisms, competitive bidding, outcome-based contracting',
    };
    return mitigations[actor];
  }
}
