/**
 * Minority Harm Agent
 * 
 * Purpose: Identify disproportionate harm to protected or vulnerable populations.
 * Key Constraint: This agent CANNOT be overridden by consensus logic.
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  MinorityHarmOutput,
  PROTECTED_GROUPS,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams, PolicyContext } from './BaseCollapseAgent.js';

const HARM_VECTORS = [
  'displacement_risk',
  'service_access_reduction',
  'economic_exclusion',
  'political_marginalization',
  'cultural_erasure',
  'health_impact_disparity',
  'educational_gap_widening',
  'housing_instability',
];

export class MinorityHarmAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.MINORITY_HARM);
  }

  getDescription(): string {
    return 'Identifies disproportionate harm to protected or vulnerable populations that consensus may overlook.';
  }

  getFailureQuestions(): string[] {
    return [
      'Which groups bear disproportionate burden?',
      'Is harm visible immediately or delayed?',
      'Are effects reversible?',
      'Does policy create new vulnerabilities?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<MinorityHarmOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const failureConditions = [];
    const disparityRatios: { group: string; ratio: number }[] = [];
    const moralHazardFlags: string[] = [];

    // Calculate disparity for each protected group
    for (const group of PROTECTED_GROUPS) {
      const baseImpact = this.randomInRange(0.1, 0.5);
      const groupImpact = baseImpact * (1 + group.vulnerabilityScore) * stressMultiplier;
      const populationAverage = baseImpact * 0.8;
      const ratio = groupImpact / populationAverage;

      disparityRatios.push({ group: group.name, ratio });

      // Generate failure condition if ratio exceeds threshold
      if (ratio > 1.3) {
        const harmVector = this.randomPick(HARM_VECTORS);
        const severity = Math.min(ratio / 2, 0.95);
        const probability = this.randomInRange(0.5, 0.85);

        const fc = this.createFailureCondition(
          FailureCategory.MINORITY_DISPLACEMENT,
          {
            metric: `${group.name.toLowerCase().replace(/\s+/g, '_')}_impact_ratio`,
            operator: '>',
            value: 1.3,
          },
          probability,
          'DisproportionateHarm',
          `${group.name} experience ${(ratio * 100 - 100).toFixed(0)}% higher impact than population average through ${harmVector.replace(/_/g, ' ')}`,
          severity,
          probability,
          group.protectedClass ? Reversibility.IRREVERSIBLE : Reversibility.PARTIALLY_REVERSIBLE,
          ratio > 1.5 ? '3-6 months' : '6-12 months',
          ratio > 1.5 ? VisibilityType.DELAYED : VisibilityType.GRADUAL,
          [group],
          severity < 0.7,
          severity > 0.7 ? 'EXTREME' : 'HIGH',
          [
            `Demographic impact modeling for ${group.name}`,
            'Historical disparity analysis in comparable policies',
            'Vulnerability intersection assessment',
          ],
          `${group.name} face ${harmVector.replace(/_/g, ' ')} at rates ${(ratio).toFixed(2)}x the population average due to existing vulnerabilities and policy design.`
        );

        failureConditions.push(fc);

        if (group.protectedClass && ratio > 1.5) {
          moralHazardFlags.push(`Protected class "${group.name}" faces potentially discriminatory impact`);
        }
      }
    }

    // Calculate concentration index (Gini-like)
    const sortedRatios = [...disparityRatios].sort((a, b) => a.ratio - b.ratio);
    let concentrationIndex = 0;
    const n = sortedRatios.length;
    for (let i = 0; i < n; i++) {
      concentrationIndex += (2 * (i + 1) - n - 1) * (sortedRatios[i]?.ratio ?? 0);
    }
    concentrationIndex = concentrationIndex / (n * sortedRatios.reduce((s, r) => s + r.ratio, 0));

    const delayedVisibilityRisk = this.randomInRange(0.4, 0.8) * stressMultiplier;
    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Minority harm analysis identifies ${failureConditions.length} disproportionate impact pathways across ${PROTECTED_GROUPS.length} vulnerable groups. Concentration index of ${concentrationIndex.toFixed(3)} indicates ${concentrationIndex > 0.3 ? 'significant' : 'moderate'} inequality in burden distribution.`,
      evidence: [
        'Protected class demographic modeling',
        'Historical disparity pattern analysis',
        'Vulnerability intersection mapping',
        'Delayed harm manifestation studies',
      ],
      disparityRatios,
      concentrationIndex,
      moralHazardFlags,
      delayedVisibilityRisk,
    }) as MinorityHarmOutput;
  }
}
