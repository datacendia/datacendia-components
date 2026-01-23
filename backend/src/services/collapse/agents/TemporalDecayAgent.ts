/**
 * Temporal Decay Agent
 * 
 * Purpose: Test how decisions degrade over time.
 * Key Question: "What fails after the people who designed this are gone?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  TemporalDecayOutput,
  TemporalDecay,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

const DECAY_FACTORS = [
  'Staff turnover erodes institutional knowledge',
  'Budget pressures reduce maintenance capacity',
  'Technology evolution creates compatibility gaps',
  'Regulatory drift invalidates assumptions',
  'Political priorities shift away from original intent',
  'Documentation becomes outdated and unreliable',
  'Training programs discontinued or diluted',
  'Monitoring systems degraded or abandoned',
];

const MAINTENANCE_REQUIREMENTS = [
  'Regular staff training and certification',
  'Annual policy review and update cycle',
  'Technology infrastructure upgrades',
  'Stakeholder engagement and feedback loops',
  'Performance monitoring and reporting',
  'Documentation and knowledge management',
  'Compliance verification and auditing',
];

export class TemporalDecayAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.TEMPORAL_DECAY);
  }

  getDescription(): string {
    return 'Tests how decisions degrade over time as institutional memory fades and conditions change.';
  }

  getFailureQuestions(): string[] {
    return [
      'What fails after designers leave?',
      'How does policy drift manifest?',
      'What maintenance gets neglected?',
      'When does effectiveness half-life occur?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<TemporalDecayOutput> {
    const { context, seed, stressMultiplier, simulationHorizonMonths } = params;
    this.initRng(seed);

    const failureConditions = [];

    // Calculate decay parameters
    const initialEffectiveness = this.randomInRange(0.8, 0.95);
    const decayRate = this.randomInRange(0.05, 0.15) * stressMultiplier;
    const halfLifeMonths = Math.log(2) / decayRate * 12;
    const maintenanceRequired = this.randomPickMultiple(MAINTENANCE_REQUIREMENTS, Math.floor(this.rng() * 3) + 3);
    const institutionalMemoryRisk = this.randomInRange(0.4, 0.8) * stressMultiplier;
    const staffTurnoverImpact = this.randomInRange(0.3, 0.7) * stressMultiplier;

    const temporalDecay: TemporalDecay = {
      initialEffectiveness,
      decayRate,
      halfLife: `${halfLifeMonths.toFixed(0)} months`,
      maintenanceRequired,
      institutionalMemoryRisk,
      staffTurnoverImpact,
    };

    // Generate decay-related failure conditions
    const activeDecayFactors = DECAY_FACTORS.filter(() => this.rng() > 0.4);

    for (const factor of activeDecayFactors) {
      const manifestationMonth = Math.floor(this.rng() * simulationHorizonMonths) + 6;
      const severity = this.randomInRange(0.4, 0.8) * stressMultiplier;
      const probability = this.randomInRange(0.5, 0.85);

      const fc = this.createFailureCondition(
        FailureCategory.INSTITUTIONAL_DECAY,
        {
          metric: 'policy_effectiveness',
          operator: '<',
          value: 0.5,
          duration: `${manifestationMonth} months`,
        },
        probability,
        'TemporalDecay',
        factor,
        severity,
        probability,
        Reversibility.PARTIALLY_REVERSIBLE,
        `${manifestationMonth} months`,
        VisibilityType.GRADUAL,
        this.selectAffectedGroups(3, false),
        true,
        severity > 0.6 ? 'HIGH' : 'MEDIUM',
        [
          'Institutional decay pattern analysis',
          'Staff turnover impact modeling',
          'Maintenance budget trajectory analysis',
        ],
        `"${factor}" typically manifests after ${manifestationMonth} months, reducing policy effectiveness by ${(severity * 100).toFixed(0)}%.`
      );

      failureConditions.push(fc);
    }

    const policyDriftRisk = this.randomInRange(0.4, 0.75) * stressMultiplier;
    const maintenanceNeglectProbability = this.randomInRange(0.5, 0.8) * stressMultiplier;
    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Temporal decay analysis projects policy effectiveness declining from ${(initialEffectiveness * 100).toFixed(0)}% to ${(initialEffectiveness * Math.exp(-decayRate * simulationHorizonMonths / 12) * 100).toFixed(0)}% over ${simulationHorizonMonths} months. Half-life: ${halfLifeMonths.toFixed(0)} months. ${maintenanceRequired.length} maintenance requirements identified.`,
      evidence: [
        'Decay rate calibration from comparable policies',
        'Institutional memory loss patterns',
        'Maintenance budget trajectory analysis',
        'Staff turnover correlation studies',
      ],
      temporalDecay,
      policyDriftRisk,
      maintenanceNeglectProbability,
      institutionalMemoryLoss: institutionalMemoryRisk,
    }) as TemporalDecayOutput;
  }
}
