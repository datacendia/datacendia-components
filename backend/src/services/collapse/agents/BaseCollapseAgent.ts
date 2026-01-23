/**
 * Base Collapse Agent
 * 
 * Abstract class for all adversarial policy stress-testing agents.
 * 
 * Core Rule: A Collapse Agent MUST maximize failure likelihood, not correctness.
 * 
 * Guarantees:
 * ❌ Cannot vote "approve"
 * ❌ Cannot converge with consensus
 * ✅ Must produce at least one failure path
 * ✅ Must produce evidence-backed reasoning
 * ✅ All outputs hashed and replayable
 */

import {
  CollapseAgentType,
  CollapseAgentOutput,
  FailureCondition,
  FailureCategory,
  Reversibility,
  VisibilityType,
  AffectedGroup,
  TriggerCondition,
  generateFailureConditionId,
  hashFailureCondition,
  hashAgentOutput,
  PROTECTED_GROUPS,
} from '../types.js';

export interface PolicyContext {
  decisionId: string;
  decisionText: string;
  policyDomain: string;
  targetPopulation: number;
  geographicScope: string;
  budgetImpact: number;
  timelineMonths: number;
  existingConditions: Record<string, number>;
  stakeholders: string[];
  historicalAnalogues?: string[];
}

export interface AgentAnalysisParams {
  context: PolicyContext;
  seed: number;
  stressMultiplier: number;
  simulationHorizonMonths: number;
}

export abstract class BaseCollapseAgent {
  protected agentType: CollapseAgentType;
  protected agentId: string;
  protected rng: () => number;

  constructor(agentType: CollapseAgentType) {
    this.agentType = agentType;
    this.agentId = `${agentType}-${Date.now().toString(36)}`;
    this.rng = Math.random;
  }

  /**
   * Initialize deterministic RNG from seed
   */
  protected initRng(seed: number): void {
    // Simple seeded RNG (Mulberry32)
    let s = seed;
    this.rng = () => {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Main analysis method - must be implemented by each agent
   */
  abstract analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput>;

  /**
   * Generate a failure condition
   */
  protected createFailureCondition(
    category: FailureCategory,
    trigger: Omit<TriggerCondition, 'confidence'>,
    triggerConfidence: number,
    failureType: string,
    failureDescription: string,
    severity: number,
    probability: number,
    irreversibility: Reversibility,
    timeToManifestation: string,
    visibility: VisibilityType,
    affectedGroups: AffectedGroup[],
    mitigationPossible: boolean,
    mitigationCost: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME',
    evidence: string[],
    reasoning: string
  ): FailureCondition {
    const fc: Omit<FailureCondition, 'hash'> = {
      id: generateFailureConditionId(),
      agent: this.agentType,
      category,
      triggerCondition: { ...trigger, confidence: triggerConfidence },
      failureEvent: {
        type: failureType,
        description: failureDescription,
        cascadeRisk: severity * probability,
      },
      affectedGroups,
      severity: Math.min(Math.max(severity, 0), 1),
      probability: Math.min(Math.max(probability, 0), 1),
      irreversibility,
      timeToManifestation,
      visibility,
      mitigationPossible,
      mitigationCost,
      evidence,
      reasoning,
    };

    return {
      ...fc,
      hash: hashFailureCondition(fc),
    };
  }

  /**
   * Select random affected groups based on context
   */
  protected selectAffectedGroups(
    count: number,
    preferProtected: boolean = true
  ): AffectedGroup[] {
    const groups = [...PROTECTED_GROUPS];
    
    if (preferProtected) {
      groups.sort((a, b) => {
        if (a.protectedClass !== b.protectedClass) {
          return a.protectedClass ? -1 : 1;
        }
        return b.vulnerabilityScore - a.vulnerabilityScore;
      });
    } else {
      // Shuffle
      for (let i = groups.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        const temp = groups[i]!;
        groups[i] = groups[j]!;
        groups[j] = temp;
      }
    }

    return groups.slice(0, Math.min(count, groups.length));
  }

  /**
   * Generate random value within range using seeded RNG
   */
  protected randomInRange(min: number, max: number): number {
    return min + this.rng() * (max - min);
  }

  /**
   * Pick random item from array
   */
  protected randomPick<T>(items: T[]): T {
    return items[Math.floor(this.rng() * items.length)]!;
  }

  /**
   * Pick multiple random items from array
   */
  protected randomPickMultiple<T>(items: T[], count: number): T[] {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Calculate overall risk score from failure conditions
   */
  protected calculateRiskScore(failureConditions: FailureCondition[]): number {
    if (failureConditions.length === 0) return 0;

    // Union of risks formula
    const product = failureConditions.reduce((acc, fc) => {
      const score = fc.severity * fc.probability * fc.irreversibility;
      return acc * (1 - Math.min(score, 0.99));
    }, 1);

    return 1 - product;
  }

  /**
   * Wrap output with hash
   */
  protected finalizeOutput(
    output: Omit<CollapseAgentOutput, 'hash'>
  ): CollapseAgentOutput {
    return {
      ...output,
      hash: hashAgentOutput(output),
    };
  }

  /**
   * Get agent description
   */
  abstract getDescription(): string;

  /**
   * Get failure questions this agent answers
   */
  abstract getFailureQuestions(): string[];
}
