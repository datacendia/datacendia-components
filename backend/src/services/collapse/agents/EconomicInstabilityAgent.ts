/**
 * Economic Instability Agent
 * 
 * Purpose: Stress-test macro and microeconomic consequences.
 * Key Insight: Assumes rational but adversarial actors.
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  EconomicInstabilityOutput,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams, PolicyContext } from './BaseCollapseAgent.js';

const ECONOMIC_TRIGGERS = [
  { metric: 'UnemploymentRate', threshold: 8.5, unit: '%' },
  { metric: 'InflationRate', threshold: 6.0, unit: '%' },
  { metric: 'HousingPriceIndex', threshold: 15, unit: '% YoY' },
  { metric: 'BusinessClosureRate', threshold: 12, unit: '% annual' },
  { metric: 'WageGrowthGap', threshold: -3, unit: '% vs inflation' },
  { metric: 'CapitalFlightIndicator', threshold: 0.7, unit: 'index' },
];

const FEEDBACK_LOOPS = [
  'Rent increase → displacement → labor shortage → wage pressure → rent increase',
  'Business closure → unemployment → reduced spending → more closures',
  'Capital flight → currency pressure → import costs → inflation → more flight',
  'Tax base erosion → service cuts → business exodus → more erosion',
  'Housing shortage → price spike → workforce departure → economic contraction',
];

const RENT_SEEKING_OPPORTUNITIES = [
  'Regulatory arbitrage through jurisdiction shopping',
  'Preferential treatment capture through lobbying',
  'Information asymmetry exploitation',
  'Barrier to entry creation for incumbents',
  'Subsidy capture by non-target beneficiaries',
];

export class EconomicInstabilityAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.ECONOMIC_INSTABILITY);
  }

  getDescription(): string {
    return 'Stress-tests macro and microeconomic consequences assuming rational but adversarial actors.';
  }

  getFailureQuestions(): string[] {
    return [
      'What feedback loops could destabilize the economy?',
      'Where are the rent-seeking opportunities?',
      'What market distortions emerge?',
      'When does capital flee?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<EconomicInstabilityOutput> {
    const { context, seed, stressMultiplier, simulationHorizonMonths } = params;
    this.initRng(seed);

    const failureConditions = [];
    const inflationFeedbackLoops = this.randomPickMultiple(FEEDBACK_LOOPS, Math.floor(this.rng() * 3) + 2);
    const rentSeekingOpportunities = this.randomPickMultiple(RENT_SEEKING_OPPORTUNITIES, Math.floor(this.rng() * 3) + 1);
    const marketDistortions: string[] = [];

    // Analyze each economic trigger
    for (const trigger of ECONOMIC_TRIGGERS) {
      const triggerProb = this.randomInRange(0.3, 0.7) * stressMultiplier;
      
      if (this.rng() < triggerProb) {
        const adjustedThreshold = trigger.threshold * (1 - (stressMultiplier - 1) * 0.2);
        const severity = this.randomInRange(0.5, 0.9);
        const probability = triggerProb;

        const fc = this.createFailureCondition(
          FailureCategory.ECONOMIC_SHOCK,
          {
            metric: trigger.metric,
            operator: trigger.threshold > 0 ? '>' : '<',
            value: adjustedThreshold,
            duration: '3 months',
          },
          probability,
          'EconomicInstability',
          `${trigger.metric} exceeding ${adjustedThreshold.toFixed(1)}${trigger.unit} triggers economic cascade affecting ${context.policyDomain} sector`,
          severity,
          probability,
          Reversibility.PARTIALLY_REVERSIBLE,
          `${Math.floor(this.rng() * 12) + 6} months`,
          VisibilityType.GRADUAL,
          this.selectAffectedGroups(4, false),
          true,
          severity > 0.7 ? 'HIGH' : 'MEDIUM',
          [
            `Economic modeling for ${trigger.metric} sensitivity`,
            'Historical analysis of comparable policy shocks',
            'Market response simulation',
          ],
          `When ${trigger.metric} crosses ${adjustedThreshold.toFixed(1)}${trigger.unit}, cascading effects through identified feedback loops amplify initial impact by estimated ${(1 + severity).toFixed(1)}x.`
        );

        failureConditions.push(fc);

        marketDistortions.push(
          `${trigger.metric} stress creates ${this.randomPick(['supply', 'demand', 'pricing'])} distortion in ${context.policyDomain} markets`
        );
      }
    }

    const laborDisplacementRisk = this.randomInRange(0.3, 0.7) * stressMultiplier;
    const capitalFlightProbability = this.randomInRange(0.2, 0.6) * stressMultiplier;
    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Economic instability analysis identifies ${failureConditions.length} trigger conditions with ${inflationFeedbackLoops.length} reinforcing feedback loops. Labor displacement risk ${(laborDisplacementRisk * 100).toFixed(0)}%, capital flight probability ${(capitalFlightProbability * 100).toFixed(0)}%.`,
      evidence: [
        'Macroeconomic stress modeling',
        'Feedback loop identification',
        'Market distortion analysis',
        'Capital movement patterns',
      ],
      inflationFeedbackLoops,
      laborDisplacementRisk,
      capitalFlightProbability,
      rentSeekingOpportunities,
      marketDistortions,
    } as any) as EconomicInstabilityOutput;
  }
}
