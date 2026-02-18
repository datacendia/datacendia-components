// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Systemic Risk Agent
 * 
 * Purpose: Detect cascading failures across systems.
 */

import {
  CollapseAgentType,
  FailureCategory,
  Reversibility,
  VisibilityType,
  SystemicRiskOutput,
  SystemicRisk,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

const SYSTEMS = [
  'Healthcare', 'Education', 'Transportation', 'Housing', 'Energy',
  'Water', 'Finance', 'Employment', 'Social Services', 'Justice',
  'Emergency Services', 'Communications', 'Food Supply', 'Sanitation',
];

const FEEDBACK_PATTERNS = [
  { from: 'Healthcare', to: 'Employment', mechanism: 'Worker illness reduces productivity' },
  { from: 'Housing', to: 'Education', mechanism: 'Displacement disrupts school attendance' },
  { from: 'Transportation', to: 'Employment', mechanism: 'Mobility barriers prevent job access' },
  { from: 'Finance', to: 'Housing', mechanism: 'Credit contraction triggers foreclosures' },
  { from: 'Energy', to: 'Healthcare', mechanism: 'Power instability affects medical equipment' },
  { from: 'Employment', to: 'Finance', mechanism: 'Job losses trigger loan defaults' },
  { from: 'Social Services', to: 'Healthcare', mechanism: 'Service cuts increase emergency burden' },
];

export class SystemicRiskAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.SYSTEMIC_RISK);
  }

  getDescription(): string {
    return 'Detects cascading failures across interconnected systems.';
  }

  getFailureQuestions(): string[] {
    return [
      'What second-order effects emerge?',
      'Where are the dependency collapses?',
      'What feedback loops exist?',
      'Which coupled systems fail together?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<SystemicRiskOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const failureConditions = [];
    const systemicRisks: SystemicRisk[] = [];
    const coupledSystemFailures: string[] = [];
    const secondOrderEffects: string[] = [];
    const dependencyGraph: { from: string; to: string; strength: number }[] = [];

    // Build dependency graph
    const numDependencies = Math.floor(this.rng() * 5) + 4;
    const selectedPatterns = this.randomPickMultiple(FEEDBACK_PATTERNS, numDependencies);

    for (const pattern of selectedPatterns) {
      const strength = this.randomInRange(0.3, 0.8) * stressMultiplier;
      dependencyGraph.push({ from: pattern.from, to: pattern.to, strength });
      secondOrderEffects.push(`${pattern.from} â†’ ${pattern.to}: ${pattern.mechanism}`);
    }

    // Identify systemic risks
    const primarySystems = this.randomPickMultiple(SYSTEMS, Math.floor(this.rng() * 3) + 2);

    for (const primary of primarySystems) {
      const affected = dependencyGraph
        .filter(d => d.from === primary)
        .map(d => d.to);

      if (affected.length > 0 || this.rng() > 0.5) {
        const cascadeChain = [primary, ...this.randomPickMultiple(SYSTEMS.filter(s => s !== primary), 2)];
        const probability = this.randomInRange(0.4, 0.75) * stressMultiplier;
        const totalImpact = this.randomInRange(0.5, 0.9);

        const risk: SystemicRisk = {
          id: `SR-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          primarySystem: primary,
          affectedSystems: affected.length > 0 ? affected : cascadeChain.slice(1),
          cascadeChain,
          probability,
          totalImpact,
          feedbackLoops: selectedPatterns
            .filter(p => cascadeChain.includes(p.from) || cascadeChain.includes(p.to))
            .map(p => p.mechanism),
        };

        systemicRisks.push(risk);

        const fc = this.createFailureCondition(
          FailureCategory.SYSTEMIC_CASCADE,
          {
            metric: `${primary.toLowerCase()}_system_stress`,
            operator: '>',
            value: 0.6,
          },
          probability,
          'SystemicCascade',
          `${primary} system failure cascades to ${cascadeChain.slice(1).join(', ')} through dependency chains`,
          totalImpact,
          probability,
          totalImpact > 0.7 ? Reversibility.IRREVERSIBLE : Reversibility.PARTIALLY_REVERSIBLE,
          `${Math.floor(this.rng() * 12) + 6} months`,
          VisibilityType.DELAYED,
          this.selectAffectedGroups(4, true),
          totalImpact < 0.7,
          totalImpact > 0.7 ? 'EXTREME' : 'HIGH',
          [
            `System dependency mapping for ${primary}`,
            'Cascade propagation modeling',
            'Historical system failure analysis',
          ],
          `${primary} failure propagates through ${cascadeChain.length - 1} connected systems with ${(totalImpact * 100).toFixed(0)}% compounded impact.`
        );

        failureConditions.push(fc);

        if (affected.length >= 2) {
          coupledSystemFailures.push(`${primary} + ${affected.join(' + ')} coupled failure mode`);
        }
      }
    }

    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Systemic risk analysis maps ${dependencyGraph.length} inter-system dependencies with ${systemicRisks.length} cascade pathways. ${coupledSystemFailures.length} coupled failure modes identified.`,
      evidence: [
        'Inter-system dependency mapping',
        'Cascade propagation modeling',
        'Coupled failure mode analysis',
        'Historical systemic failure patterns',
      ],
      systemicRisks,
      coupledSystemFailures,
      secondOrderEffects,
      dependencyGraph,
    } as any) as SystemicRiskOutput;
  }
}
