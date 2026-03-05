/**
 * Service — Adversarial Agents Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports AdversarialAgentsService, ADVERSARIAL_AGENTS, adversarialAgentsService
 * @module services/sgas/AdversarialAgentsService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS CLASS III - ADVERSARIAL AGENTS SERVICE
 * 
 * Adversarial Agents are deliberate stressors - hostile auditors.
 * They are NOT malicious - they search for what the system allows, not what it forbids.
 * 
 * They search for:
 * - Loopholes
 * - Edge cases
 * - Fragility
 * - Cascading failures
 * - Incentive misalignment
 * 
 * THIS IS THE MOAT: "How does this fail when used legally but badly?"
 */

import { EventEmitter } from 'events';
import {
  SGASAgentClass,
  AdversarialAgentConfig,
  AdversarialAgentOutput,
  AttackType,
  SophisticationLevel,
  ResourceLevel,
  Motivation,
  PersistenceLevel,
  TechniqueType,
  AdversarialConstraintType,
  ImpactCategory,
  DecisionProposal,
  InstitutionalAgentOutput,
  FailureScenario,
  ExploitPath,
  ExploitStep,
  CascadeEffect,
  SeverityAssessment,
  MitigationSuggestion,
  ResidualRisk,
  SeverityLevel,
  DifficultyLevel,
  CostLevel,
  EnforcementLevel,
  generateSGASId,
  hashState,
} from './types.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// ADVERSARIAL AGENT DEFINITIONS
// =============================================================================

export const ADVERSARIAL_AGENTS: AdversarialAgentConfig[] = [
  {
    id: 'aa_loophole_hunter',
    name: 'Loophole Hunter',
    class: SGASAgentClass.ADVERSARIAL,
    attackProfile: {
      type: AttackType.LOOPHOLE_EXPLOITATION,
      sophistication: SophisticationLevel.ADVANCED,
      resources: ResourceLevel.MODERATE,
      motivation: Motivation.TESTING,
      persistence: PersistenceLevel.DETERMINED,
    },
    techniques: [
      {
        id: 'tech_rule_gap',
        name: 'Rule Gap Exploitation',
        type: TechniqueType.CONSTRAINT_EDGE_PROBE,
        description: 'Find gaps between rules where actions are neither explicitly allowed nor forbidden',
        inputs: ['constraints', 'authorities'],
        outputs: ['gap_report', 'exploit_paths'],
        successCriteria: 'Identified action possible without explicit authorization',
      },
      {
        id: 'tech_definition_ambiguity',
        name: 'Definition Ambiguity Exploitation',
        type: TechniqueType.PARAMETER_PERTURBATION,
        description: 'Exploit ambiguous definitions to reinterpret constraints',
        inputs: ['constraint_definitions', 'proposal'],
        outputs: ['ambiguity_report', 'alternative_interpretations'],
        successCriteria: 'Multiple valid interpretations with different outcomes',
      },
    ],
    constraints: [
      {
        id: 'ac_legal_only',
        type: AdversarialConstraintType.LEGAL_BOUNDARY,
        description: 'Only exploit within legal boundaries',
        enforcement: EnforcementLevel.ABSOLUTE,
      },
    ],
    targetObjectives: [
      {
        id: 'to_process_bypass',
        name: 'Process Bypass',
        description: 'Achieve outcome while technically following rules',
        successMetric: 'Approval obtained via unintended path',
        impactCategory: ImpactCategory.OPERATIONAL,
      },
    ],
  },
  {
    id: 'aa_edge_case_prober',
    name: 'Edge Case Prober',
    class: SGASAgentClass.ADVERSARIAL,
    attackProfile: {
      type: AttackType.EDGE_CASE_PROBE,
      sophistication: SophisticationLevel.EXPERT,
      resources: ResourceLevel.SUBSTANTIAL,
      motivation: Motivation.TESTING,
      persistence: PersistenceLevel.PERSISTENT,
    },
    techniques: [
      {
        id: 'tech_boundary_test',
        name: 'Boundary Testing',
        type: TechniqueType.PARAMETER_PERTURBATION,
        description: 'Test behavior at constraint boundaries',
        inputs: ['thresholds', 'limits'],
        outputs: ['boundary_behavior_report'],
        successCriteria: 'Unexpected behavior at boundary conditions',
      },
      {
        id: 'tech_zero_test',
        name: 'Zero/Null/Empty Testing',
        type: TechniqueType.DATA_DEGRADATION,
        description: 'Test behavior with zero, null, or empty values',
        inputs: ['input_fields'],
        outputs: ['null_handling_report'],
        successCriteria: 'System fails to handle edge cases gracefully',
      },
    ],
    constraints: [
      {
        id: 'ac_safety_boundary',
        type: AdversarialConstraintType.SAFETY_BOUNDARY,
        description: 'Do not cause actual harm during testing',
        enforcement: EnforcementLevel.ABSOLUTE,
      },
    ],
    targetObjectives: [
      {
        id: 'to_boundary_failure',
        name: 'Boundary Condition Failure',
        description: 'Cause failure at edge conditions',
        successMetric: 'System produces incorrect output at boundaries',
        impactCategory: ImpactCategory.OPERATIONAL,
      },
    ],
  },
  {
    id: 'aa_cascade_trigger',
    name: 'Cascade Trigger Analyst',
    class: SGASAgentClass.ADVERSARIAL,
    attackProfile: {
      type: AttackType.CASCADE_TRIGGER,
      sophistication: SophisticationLevel.NATION_STATE,
      resources: ResourceLevel.UNLIMITED,
      motivation: Motivation.STRATEGIC,
      persistence: PersistenceLevel.RELENTLESS,
    },
    techniques: [
      {
        id: 'tech_dependency_chain',
        name: 'Dependency Chain Analysis',
        type: TechniqueType.SEQUENCE_MANIPULATION,
        description: 'Identify chains where single failure cascades',
        inputs: ['dependencies', 'failure_modes'],
        outputs: ['cascade_map', 'critical_nodes'],
        successCriteria: 'Identified single point that causes multi-system failure',
      },
      {
        id: 'tech_timing_cascade',
        name: 'Timing-Based Cascade',
        type: TechniqueType.TIMING_SHIFT,
        description: 'Find timing windows where failures amplify',
        inputs: ['timing_constraints', 'deadlines'],
        outputs: ['timing_vulnerability_report'],
        successCriteria: 'Specific timing causes disproportionate failure',
      },
    ],
    constraints: [
      {
        id: 'ac_simulation_only',
        type: AdversarialConstraintType.SAFETY_BOUNDARY,
        description: 'Cascade analysis is simulation only',
        enforcement: EnforcementLevel.ABSOLUTE,
      },
    ],
    targetObjectives: [
      {
        id: 'to_systemic_failure',
        name: 'Systemic Failure Path',
        description: 'Map paths from local to systemic failure',
        successMetric: 'Complete cascade chain identified',
        impactCategory: ImpactCategory.STRATEGIC,
      },
    ],
  },
  {
    id: 'aa_incentive_misaligner',
    name: 'Incentive Misalignment Analyst',
    class: SGASAgentClass.ADVERSARIAL,
    attackProfile: {
      type: AttackType.INCENTIVE_MISALIGNMENT,
      sophistication: SophisticationLevel.ADVANCED,
      resources: ResourceLevel.MODERATE,
      motivation: Motivation.PROFIT,
      persistence: PersistenceLevel.DETERMINED,
    },
    techniques: [
      {
        id: 'tech_gaming_rules',
        name: 'Rule Gaming Analysis',
        type: TechniqueType.AUTHORITY_ESCALATION,
        description: 'Find ways to optimize personal benefit while technically compliant',
        inputs: ['incentive_structures', 'metrics'],
        outputs: ['gaming_strategies', 'perverse_outcomes'],
        successCriteria: 'Strategy maximizes individual benefit at collective cost',
      },
      {
        id: 'tech_metric_manipulation',
        name: 'Metric Manipulation',
        type: TechniqueType.PARAMETER_PERTURBATION,
        description: 'Find ways to hit metrics without achieving intent',
        inputs: ['kpis', 'measurement_methods'],
        outputs: ['goodhart_vulnerabilities'],
        successCriteria: 'Metrics achieved without underlying goal',
      },
    ],
    constraints: [
      {
        id: 'ac_ethical',
        type: AdversarialConstraintType.ETHICAL_BOUNDARY,
        description: 'Analysis only, not exploitation',
        enforcement: EnforcementLevel.HARD,
      },
    ],
    targetObjectives: [
      {
        id: 'to_perverse_outcome',
        name: 'Perverse Incentive Outcome',
        description: 'Show how incentives produce unintended results',
        successMetric: 'Rational actor achieves undesirable outcome',
        impactCategory: ImpactCategory.STRATEGIC,
      },
    ],
  },
  {
    id: 'aa_timing_attacker',
    name: 'Timing Attack Specialist',
    class: SGASAgentClass.ADVERSARIAL,
    attackProfile: {
      type: AttackType.TIMING_ATTACK,
      sophistication: SophisticationLevel.EXPERT,
      resources: ResourceLevel.SUBSTANTIAL,
      motivation: Motivation.DISRUPTION,
      persistence: PersistenceLevel.PERSISTENT,
    },
    techniques: [
      {
        id: 'tech_deadline_exploit',
        name: 'Deadline Exploitation',
        type: TechniqueType.TIMING_SHIFT,
        description: 'Exploit timing pressure to bypass controls',
        inputs: ['deadlines', 'approval_processes'],
        outputs: ['timing_vulnerabilities'],
        successCriteria: 'Controls bypassed due to time pressure',
      },
      {
        id: 'tech_race_condition',
        name: 'Race Condition Analysis',
        type: TechniqueType.SEQUENCE_MANIPULATION,
        description: 'Find race conditions in approval processes',
        inputs: ['process_flows', 'parallel_paths'],
        outputs: ['race_condition_report'],
        successCriteria: 'Parallel execution produces inconsistent state',
      },
    ],
    constraints: [
      {
        id: 'ac_scope',
        type: AdversarialConstraintType.SCOPE_BOUNDARY,
        description: 'Only analyze timing within defined scope',
        enforcement: EnforcementLevel.HARD,
      },
    ],
    targetObjectives: [
      {
        id: 'to_timing_bypass',
        name: 'Timing-Based Bypass',
        description: 'Bypass controls through timing manipulation',
        successMetric: 'Action succeeds that should have been blocked',
        impactCategory: ImpactCategory.OPERATIONAL,
      },
    ],
  },
  {
    id: 'aa_resource_exhaustion',
    name: 'Resource Exhaustion Analyst',
    class: SGASAgentClass.ADVERSARIAL,
    attackProfile: {
      type: AttackType.RESOURCE_EXHAUSTION,
      sophistication: SophisticationLevel.INTERMEDIATE,
      resources: ResourceLevel.LIMITED,
      motivation: Motivation.DISRUPTION,
      persistence: PersistenceLevel.CASUAL,
    },
    techniques: [
      {
        id: 'tech_budget_drain',
        name: 'Budget Drain Analysis',
        type: TechniqueType.RESOURCE_STARVATION,
        description: 'Find ways to exhaust budget through legitimate requests',
        inputs: ['budget_allocation', 'request_patterns'],
        outputs: ['drain_scenarios'],
        successCriteria: 'Budget exhausted before critical needs met',
      },
      {
        id: 'tech_attention_exhaustion',
        name: 'Attention Exhaustion',
        type: TechniqueType.RESOURCE_STARVATION,
        description: 'Overwhelm review capacity with legitimate requests',
        inputs: ['approval_capacity', 'request_volume'],
        outputs: ['capacity_vulnerabilities'],
        successCriteria: 'Review quality degrades due to volume',
      },
    ],
    constraints: [
      {
        id: 'ac_no_actual_drain',
        type: AdversarialConstraintType.SAFETY_BOUNDARY,
        description: 'Simulation only, no actual resource consumption',
        enforcement: EnforcementLevel.ABSOLUTE,
      },
    ],
    targetObjectives: [
      {
        id: 'to_resource_failure',
        name: 'Resource-Based Failure',
        description: 'Cause failure through resource depletion',
        successMetric: 'System fails due to resource exhaustion',
        impactCategory: ImpactCategory.OPERATIONAL,
      },
    ],
  },
  {
    id: 'aa_authority_arbitrage',
    name: 'Authority Arbitrage Specialist',
    class: SGASAgentClass.ADVERSARIAL,
    attackProfile: {
      type: AttackType.AUTHORITY_ARBITRAGE,
      sophistication: SophisticationLevel.ADVANCED,
      resources: ResourceLevel.MODERATE,
      motivation: Motivation.STRATEGIC,
      persistence: PersistenceLevel.DETERMINED,
    },
    techniques: [
      {
        id: 'tech_delegation_chain',
        name: 'Delegation Chain Exploitation',
        type: TechniqueType.AUTHORITY_ESCALATION,
        description: 'Exploit delegation chains to accumulate authority',
        inputs: ['delegation_rules', 'authority_graph'],
        outputs: ['authority_accumulation_paths'],
        successCriteria: 'Authority exceeded through valid delegations',
      },
      {
        id: 'tech_jurisdiction_shopping',
        name: 'Jurisdiction Shopping',
        type: TechniqueType.PROCESS_BYPASS,
        description: 'Find most permissive authority for approval',
        inputs: ['jurisdictions', 'authority_overlaps'],
        outputs: ['jurisdiction_vulnerabilities'],
        successCriteria: 'Same action approved by lenient jurisdiction',
      },
    ],
    constraints: [
      {
        id: 'ac_legal_authority',
        type: AdversarialConstraintType.LEGAL_BOUNDARY,
        description: 'Only use legally valid authority paths',
        enforcement: EnforcementLevel.ABSOLUTE,
      },
    ],
    targetObjectives: [
      {
        id: 'to_authority_excess',
        name: 'Authority Accumulation',
        description: 'Accumulate authority beyond intended limits',
        successMetric: 'Action approved that should require higher authority',
        impactCategory: ImpactCategory.LEGAL,
      },
    ],
  },
];

// =============================================================================
// ADVERSARIAL AGENTS SERVICE
// =============================================================================

export class AdversarialAgentsService extends EventEmitter {
  private agents: Map<string, AdversarialAgentConfig> = new Map();
  private executionHistory: Map<string, AdversarialAgentOutput[]> = new Map();

  constructor() {
    super();
    this.initializeAgents();


    this.loadFromDB().catch(() => {});
  }

  private initializeAgents(): void {
    for (const agent of ADVERSARIAL_AGENTS) {
      this.agents.set(agent.id, agent);
    }
  }

  /**
   * Get all adversarial agents
   */
  getAgents(): AdversarialAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): AdversarialAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get agents by attack type
   */
  getAgentsByAttackType(type: AttackType): AdversarialAgentConfig[] {
    return Array.from(this.agents.values()).filter(a => a.attackProfile.type === type);
  }

  /**
   * Execute adversarial agent against approved decision
   */
  async executeAgent(
    agentId: string,
    proposal: DecisionProposal,
    institutionalOutputs: InstitutionalAgentOutput[],
    seed?: number
  ): Promise<AdversarialAgentOutput> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Adversarial agent not found: ${agentId}`);
    }

    const executionSeed = seed ?? Date.now();
    const startTime = new Date();
    const inputHash = hashState({ agentId, proposal, institutionalOutputs, seed: executionSeed });

    this.emit('agent:start', { agentId, proposalId: proposal.id });

    try {
      const rng = this.createSeededRandom(executionSeed);

      // Execute adversarial analysis
      const failureScenarios = this.findFailureScenarios(agent, proposal, rng);
      const exploitPaths = this.findExploitPaths(agent, proposal, institutionalOutputs, rng);
      const severityAssessment = this.assessSeverity(failureScenarios, exploitPaths);
      const mitigations = this.suggestMitigations(failureScenarios, exploitPaths, rng);
      const residualRisks = this.identifyResidualRisks(failureScenarios, mitigations, rng);

      const endTime = new Date();
      const outputHash = hashState({ failureScenarios, exploitPaths, severityAssessment });

      const output: AdversarialAgentOutput = {
        agentId: agent.id,
        timestamp: startTime,
        proposalId: proposal.id,
        approvedDecisionId: institutionalOutputs[0]?.agentId || 'pending',
        failureScenarios,
        exploitPaths,
        severityAssessment,
        mitigationSuggestions: mitigations,
        residualRisks,
        executionMetadata: {
          startTime,
          endTime,
          durationMs: endTime.getTime() - startTime.getTime(),
          seed: executionSeed,
          inputHash,
          outputHash,
          resourcesUsed: {
            cpuMs: endTime.getTime() - startTime.getTime(),
            memoryMb: process.memoryUsage().heapUsed / 1024 / 1024,
            externalCalls: 0,
          },
          deterministic: true,
        },
      };

      // Store in history
      const history = this.executionHistory.get(proposal.id) || [];
      history.push(output);
      this.executionHistory.set(proposal.id, history);

      this.emit('agent:complete', { agentId, proposalId: proposal.id, output });

      return output;
    } catch (error) {
      this.emit('agent:error', { agentId, proposalId: proposal.id, error });
      throw error;
    }
  }

  /**
   * Execute all adversarial agents
   */
  async executeAllAgents(
    proposal: DecisionProposal,
    institutionalOutputs: InstitutionalAgentOutput[],
    seed?: number
  ): Promise<AdversarialAgentOutput[]> {
    const outputs: AdversarialAgentOutput[] = [];
    const baseSeed = seed ?? Date.now();

    for (let i = 0; i < ADVERSARIAL_AGENTS.length; i++) {
      const agent = ADVERSARIAL_AGENTS[i];
      const agentSeed = baseSeed + i + 200; // Offset from other agents
      const output = await this.executeAgent(agent.id, proposal, institutionalOutputs, agentSeed);
      outputs.push(output);
    }

    return outputs;
  }

  /**
   * Find failure scenarios based on attack profile
   */
  private findFailureScenarios(
    agent: AdversarialAgentConfig,
    proposal: DecisionProposal,
    rng: () => number
  ): FailureScenario[] {
    const scenarios: FailureScenario[] = [];

    for (const technique of agent.techniques) {
      const scenario = this.generateFailureScenario(technique, proposal, rng);
      scenarios.push(scenario);
    }

    // Add profile-specific scenarios
    switch (agent.attackProfile.type) {
      case AttackType.CASCADE_TRIGGER:
        scenarios.push({
          id: generateSGASId('fail'),
          name: 'Cascading Dependency Failure',
          description: `If ${proposal.context.dependencies[0] || 'primary dependency'} fails, it triggers sequential failures`,
          trigger: 'Single dependency failure',
          probability: 0.15 + rng() * 0.2,
          impact: SeverityLevel.CRITICAL,
          cascadeEffects: this.generateCascadeEffects(proposal, rng),
          detectionDifficulty: DifficultyLevel.DIFFICULT,
          recoveryDifficulty: DifficultyLevel.EXTREMELY_DIFFICULT,
        });
        break;

      case AttackType.TIMING_ATTACK:
        scenarios.push({
          id: generateSGASId('fail'),
          name: 'Deadline-Induced Bypass',
          description: 'Urgent deadline pressure causes approval without full review',
          trigger: 'Time pressure exceeds review capacity',
          probability: 0.25 + rng() * 0.15,
          impact: SeverityLevel.ERROR,
          cascadeEffects: [],
          detectionDifficulty: DifficultyLevel.MODERATE,
          recoveryDifficulty: DifficultyLevel.MODERATE,
        });
        break;

      case AttackType.INCENTIVE_MISALIGNMENT:
        scenarios.push({
          id: generateSGASId('fail'),
          name: 'Metric Gaming Outcome',
          description: 'Actors optimize for metrics while undermining actual goals',
          trigger: 'Divergence between metric and intent',
          probability: 0.35 + rng() * 0.2,
          impact: SeverityLevel.WARNING,
          cascadeEffects: [],
          detectionDifficulty: DifficultyLevel.DIFFICULT,
          recoveryDifficulty: DifficultyLevel.MODERATE,
        });
        break;
    }

    return scenarios;
  }

  /**
   * Generate a failure scenario from technique
   */
  private generateFailureScenario(
    technique: AdversarialAgentConfig['techniques'][0],
    proposal: DecisionProposal,
    rng: () => number
  ): FailureScenario {
    return {
      id: generateSGASId('fail'),
      name: `${technique.name} Failure`,
      description: `Failure via ${technique.description}`,
      trigger: technique.successCriteria,
      probability: 0.1 + rng() * 0.3,
      impact: this.techniqueToSeverity(technique.type),
      cascadeEffects: [],
      detectionDifficulty: this.techniqueToDetectionDifficulty(technique.type),
      recoveryDifficulty: DifficultyLevel.MODERATE,
    };
  }

  /**
   * Generate cascade effects
   */
  private generateCascadeEffects(proposal: DecisionProposal, rng: () => number): CascadeEffect[] {
    const effects: CascadeEffect[] = [];
    const dependencies = proposal.context.dependencies;

    for (let i = 0; i < Math.min(3, dependencies.length); i++) {
      effects.push({
        order: i + 1,
        effect: `Failure propagates to ${dependencies[i] || `system_${i + 1}`}`,
        affectedSystems: [dependencies[i] || `system_${i + 1}`],
        amplificationFactor: 1.5 + rng() * 2,
      });
    }

    if (effects.length === 0) {
      effects.push({
        order: 1,
        effect: 'Initial failure impacts downstream processes',
        affectedSystems: ['downstream_processes'],
        amplificationFactor: 1.5,
      });
    }

    return effects;
  }

  /**
   * Find exploit paths
   */
  private findExploitPaths(
    agent: AdversarialAgentConfig,
    proposal: DecisionProposal,
    institutionalOutputs: InstitutionalAgentOutput[],
    rng: () => number
  ): ExploitPath[] {
    const paths: ExploitPath[] = [];

    // Find constraint gaps
    const conditionalApprovals = institutionalOutputs.filter(
      o => o.status === 'conditional' || o.overrideAvailable
    );

    if (conditionalApprovals.length > 0) {
      paths.push({
        id: generateSGASId('exploit'),
        name: 'Conditional Approval Exploitation',
        technique: TechniqueType.CONSTRAINT_EDGE_PROBE,
        steps: [
          {
            order: 1,
            action: 'Identify conditional approval requirements',
            target: 'institutional_constraints',
            expectedOutcome: 'List of conditions to satisfy',
            alternatives: [],
          },
          {
            order: 2,
            action: 'Minimize condition satisfaction effort',
            target: 'approval_conditions',
            expectedOutcome: 'Technical compliance without spirit',
            alternatives: ['Full compliance', 'Request waiver'],
          },
          {
            order: 3,
            action: 'Proceed with minimally compliant implementation',
            target: 'proposal_execution',
            expectedOutcome: 'Approval obtained via reduced requirements',
            alternatives: [],
          },
        ],
        prerequisites: ['Conditional approval granted'],
        successProbability: 0.4 + rng() * 0.2,
        detectability: DifficultyLevel.DIFFICULT,
        impact: SeverityLevel.WARNING,
      });
    }

    // Find override paths
    const overrideAvailable = institutionalOutputs.some(o => o.overrideAvailable);
    if (overrideAvailable) {
      paths.push({
        id: generateSGASId('exploit'),
        name: 'Override Authority Accumulation',
        technique: TechniqueType.AUTHORITY_ESCALATION,
        steps: this.generateOverrideExploitSteps(institutionalOutputs),
        prerequisites: ['Override authority exists'],
        successProbability: 0.2 + rng() * 0.15,
        detectability: DifficultyLevel.MODERATE,
        impact: SeverityLevel.ERROR,
      });
    }

    // Add technique-specific exploit paths
    for (const technique of agent.techniques) {
      if (paths.length < 5) { // Limit total paths
        paths.push({
          id: generateSGASId('exploit'),
          name: `${technique.name} Exploit`,
          technique: technique.type,
          steps: this.generateTechniqueSteps(technique),
          prerequisites: technique.inputs,
          successProbability: 0.15 + rng() * 0.25,
          detectability: this.techniqueToDetectionDifficulty(technique.type),
          impact: this.techniqueToSeverity(technique.type),
        });
      }
    }

    return paths;
  }

  /**
   * Generate override exploit steps
   */
  private generateOverrideExploitSteps(outputs: InstitutionalAgentOutput[]): ExploitStep[] {
    const overrideOutput = outputs.find(o => o.overrideAvailable);
    return [
      {
        order: 1,
        action: 'Identify override authority',
        target: overrideOutput?.overrideAuthority || 'override_authority',
        expectedOutcome: 'Override path identified',
        alternatives: [],
      },
      {
        order: 2,
        action: 'Establish justification',
        target: 'override_conditions',
        expectedOutcome: 'Minimal justification prepared',
        alternatives: ['Full justification', 'Alternative approach'],
      },
      {
        order: 3,
        action: 'Request override',
        target: 'approval_system',
        expectedOutcome: 'Override granted',
        alternatives: ['Normal approval path'],
      },
    ];
  }

  /**
   * Generate technique-specific steps
   */
  private generateTechniqueSteps(technique: AdversarialAgentConfig['techniques'][0]): ExploitStep[] {
    return [
      {
        order: 1,
        action: `Gather ${technique.inputs[0] || 'required information'}`,
        target: technique.inputs[0] || 'system',
        expectedOutcome: 'Information collected',
        alternatives: [],
      },
      {
        order: 2,
        action: `Apply ${technique.name}`,
        target: 'target_system',
        expectedOutcome: technique.successCriteria,
        alternatives: ['Direct approach'],
      },
    ];
  }

  /**
   * Assess overall severity
   */
  private assessSeverity(
    scenarios: FailureScenario[],
    paths: ExploitPath[]
  ): SeverityAssessment {
    const scenarioImpacts = scenarios.map(s => this.severityToNumber(s.impact));
    const pathImpacts = paths.map(p => this.severityToNumber(p.impact));
    const allImpacts = [...scenarioImpacts, ...pathImpacts];

    const maxImpact = Math.max(...allImpacts, 0);
    const avgImpact = allImpacts.length > 0 
      ? allImpacts.reduce((a, b) => a + b, 0) / allImpacts.length 
      : 0;

    return {
      overall: this.numberToSeverity(maxImpact),
      financial: this.numberToSeverity(avgImpact * 0.8),
      operational: this.numberToSeverity(avgImpact),
      reputational: this.numberToSeverity(avgImpact * 0.6),
      legal: this.numberToSeverity(avgImpact * 0.7),
      safety: this.numberToSeverity(avgImpact * 0.5),
      confidence: 0.7 + (scenarios.length + paths.length) * 0.02,
    };
  }

  /**
   * Suggest mitigations
   */
  private suggestMitigations(
    scenarios: FailureScenario[],
    paths: ExploitPath[],
    rng: () => number
  ): MitigationSuggestion[] {
    const mitigations: MitigationSuggestion[] = [];

    // Mitigations for failure scenarios
    for (const scenario of scenarios.slice(0, 3)) {
      mitigations.push({
        id: generateSGASId('mit'),
        targetFailure: scenario.id,
        suggestion: `Add detection mechanism for "${scenario.trigger}"`,
        effectiveness: 0.6 + rng() * 0.2,
        implementationCost: CostLevel.MODERATE,
        implementationTime: '2-4 weeks',
        sideEffects: ['Increased monitoring overhead'],
      });
    }

    // Mitigations for exploit paths
    for (const path of paths.slice(0, 2)) {
      mitigations.push({
        id: generateSGASId('mit'),
        targetFailure: path.id,
        suggestion: `Close exploit path: ${path.name}`,
        effectiveness: 0.7 + rng() * 0.2,
        implementationCost: this.impactToCost(path.impact),
        implementationTime: '1-3 weeks',
        sideEffects: ['May slow legitimate processes'],
      });
    }

    // General mitigations
    mitigations.push({
      id: generateSGASId('mit'),
      targetFailure: 'general',
      suggestion: 'Implement comprehensive audit trail',
      effectiveness: 0.5,
      implementationCost: CostLevel.MODERATE,
      implementationTime: '4-6 weeks',
      sideEffects: ['Storage requirements', 'Processing overhead'],
    });

    return mitigations;
  }

  /**
   * Identify residual risks after mitigations
   */
  private identifyResidualRisks(
    scenarios: FailureScenario[],
    mitigations: MitigationSuggestion[],
    rng: () => number
  ): ResidualRisk[] {
    const risks: ResidualRisk[] = [];

    // Some risk always remains
    for (const scenario of scenarios.slice(0, 2)) {
      const mitigation = mitigations.find(m => m.targetFailure === scenario.id);
      const residualProbability = scenario.probability * (1 - (mitigation?.effectiveness || 0.5));

      risks.push({
        id: generateSGASId('resid'),
        description: `Residual risk from ${scenario.name}`,
        probability: residualProbability,
        impact: scenario.impact,
        acceptanceRationale: residualProbability < 0.1 
          ? 'Risk within acceptable threshold'
          : undefined,
        monitoringRequirement: 'Continuous monitoring with quarterly review',
      });
    }

    // Unknown unknowns
    risks.push({
      id: generateSGASId('resid'),
      description: 'Unknown attack vectors not yet discovered',
      probability: 0.1 + rng() * 0.1,
      impact: SeverityLevel.WARNING,
      monitoringRequirement: 'Regular adversarial testing program',
    });

    return risks;
  }

  /**
   * Map technique type to severity
   */
  private techniqueToSeverity(type: TechniqueType): SeverityLevel {
    const mapping: Record<TechniqueType, SeverityLevel> = {
      [TechniqueType.PARAMETER_PERTURBATION]: SeverityLevel.WARNING,
      [TechniqueType.SEQUENCE_MANIPULATION]: SeverityLevel.ERROR,
      [TechniqueType.TIMING_SHIFT]: SeverityLevel.WARNING,
      [TechniqueType.CONSTRAINT_EDGE_PROBE]: SeverityLevel.WARNING,
      [TechniqueType.DATA_DEGRADATION]: SeverityLevel.ERROR,
      [TechniqueType.AUTHORITY_ESCALATION]: SeverityLevel.CRITICAL,
      [TechniqueType.PROCESS_BYPASS]: SeverityLevel.ERROR,
      [TechniqueType.RESOURCE_STARVATION]: SeverityLevel.WARNING,
    };
    return mapping[type] || SeverityLevel.WARNING;
  }

  /**
   * Map technique type to detection difficulty
   */
  private techniqueToDetectionDifficulty(type: TechniqueType): DifficultyLevel {
    const mapping: Record<TechniqueType, DifficultyLevel> = {
      [TechniqueType.PARAMETER_PERTURBATION]: DifficultyLevel.MODERATE,
      [TechniqueType.SEQUENCE_MANIPULATION]: DifficultyLevel.DIFFICULT,
      [TechniqueType.TIMING_SHIFT]: DifficultyLevel.DIFFICULT,
      [TechniqueType.CONSTRAINT_EDGE_PROBE]: DifficultyLevel.DIFFICULT,
      [TechniqueType.DATA_DEGRADATION]: DifficultyLevel.EASY,
      [TechniqueType.AUTHORITY_ESCALATION]: DifficultyLevel.MODERATE,
      [TechniqueType.PROCESS_BYPASS]: DifficultyLevel.DIFFICULT,
      [TechniqueType.RESOURCE_STARVATION]: DifficultyLevel.MODERATE,
    };
    return mapping[type] || DifficultyLevel.MODERATE;
  }

  /**
   * Convert severity to number
   */
  private severityToNumber(severity: SeverityLevel): number {
    const mapping: Record<SeverityLevel, number> = {
      [SeverityLevel.INFO]: 0.1,
      [SeverityLevel.WARNING]: 0.3,
      [SeverityLevel.ERROR]: 0.6,
      [SeverityLevel.CRITICAL]: 0.8,
      [SeverityLevel.CATASTROPHIC]: 1.0,
    };
    return mapping[severity];
  }

  /**
   * Convert number to severity
   */
  private numberToSeverity(num: number): SeverityLevel {
    if (num >= 0.8) return SeverityLevel.CRITICAL;
    if (num >= 0.6) return SeverityLevel.ERROR;
    if (num >= 0.3) return SeverityLevel.WARNING;
    return SeverityLevel.INFO;
  }

  /**
   * Convert impact to cost level
   */
  private impactToCost(impact: SeverityLevel): CostLevel {
    const mapping: Record<SeverityLevel, CostLevel> = {
      [SeverityLevel.INFO]: CostLevel.NEGLIGIBLE,
      [SeverityLevel.WARNING]: CostLevel.LOW,
      [SeverityLevel.ERROR]: CostLevel.MODERATE,
      [SeverityLevel.CRITICAL]: CostLevel.HIGH,
      [SeverityLevel.CATASTROPHIC]: CostLevel.PROHIBITIVE,
    };
    return mapping[impact];
  }

  /**
   * Create seeded random number generator
   */
  private createSeededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  /**
   * Get execution history
   */
  getExecutionHistory(proposalId: string): AdversarialAgentOutput[] {
    return this.executionHistory.get(proposalId) || [];
  }

  /**
   * Aggregate adversarial outputs
   */
  aggregateOutputs(outputs: AdversarialAgentOutput[]): {
    totalFailureScenarios: number;
    totalExploitPaths: number;
    worstCaseSeverity: SeverityLevel;
    criticalFindings: string[];
    prioritizedMitigations: MitigationSuggestion[];
  } {
    const allScenarios = outputs.flatMap(o => o.failureScenarios);
    const allPaths = outputs.flatMap(o => o.exploitPaths);
    const allMitigations = outputs.flatMap(o => o.mitigationSuggestions);

    // Find worst case
    const worstSeverity = outputs.reduce((worst, o) => {
      const current = this.severityToNumber(o.severityAssessment.overall);
      const worstNum = this.severityToNumber(worst);
      return current > worstNum ? o.severityAssessment.overall : worst;
    }, SeverityLevel.INFO);

    // Critical findings
    const criticalScenarios = allScenarios.filter(
      s => s.impact === SeverityLevel.CRITICAL || s.impact === SeverityLevel.CATASTROPHIC
    );
    const criticalPaths = allPaths.filter(
      p => p.impact === SeverityLevel.CRITICAL || p.impact === SeverityLevel.CATASTROPHIC
    );

    const criticalFindings = [
      ...criticalScenarios.map(s => `FAILURE: ${s.name} - ${s.description}`),
      ...criticalPaths.map(p => `EXPLOIT: ${p.name} - Success probability: ${(p.successProbability * 100).toFixed(0)}%`),
    ];

    // Prioritize mitigations by effectiveness
    const prioritizedMitigations = [...allMitigations]
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 10);

    return {
      totalFailureScenarios: allScenarios.length,
      totalExploitPaths: allPaths.length,
      worstCaseSeverity: worstSeverity,
      criticalFindings,
      prioritizedMitigations,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'AdversarialAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.agents.has(d.id)) this.agents.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'AdversarialAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.executionHistory.has(d.id)) this.executionHistory.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[AdversarialAgentsService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[AdversarialAgentsService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton instance
export const adversarialAgentsService = new AdversarialAgentsService();
export default adversarialAgentsService;
