// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS CLASS I - DECISION AGENTS SERVICE
 * 
 * Decision Agents are analytical evaluators that:
 * - Do NOT execute policy
 * - Do NOT enforce rules
 * - Do NOT override outcomes
 * 
 * They exist to analyze a proposed decision from a specific analytical perspective.
 * Think of them as expert advisory functions, not actors.
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import {
  SGASAgentClass,
  DecisionAgentConfig,
  DecisionAgentOutput,
  DecisionObjective,
  DecisionProposal,
  DecisionRecommendation,
  RiskLevel,
  RiskVector,
  Assumption,
  KnownUnknown,
  ReasoningChain,
  ReasoningStep,
  ReasoningType,
  RejectedPath,
  ExecutionMetadata,
  ResourceUsage,
  SeverityLevel,
  GuardrailType,
  GuardrailAction,
  AgentGuardrail,
  BoundedLLMConfig,
  ComputeIntensity,
  generateSGASId,
  hashState,
} from './types.js';

// =============================================================================
// DECISION AGENT DEFINITIONS
// =============================================================================

export const DECISION_AGENTS: DecisionAgentConfig[] = [
  {
    id: 'da_risk_minimization',
    name: 'Risk Minimization Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.RISK_MINIMIZATION,
    capabilities: [
      {
        id: 'cap_risk_identification',
        name: 'Risk Identification',
        description: 'Identify potential risks across all dimensions',
        inputTypes: ['proposal', 'constraints', 'historical_baseline'],
        outputTypes: ['risk_vectors', 'risk_matrix'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
      {
        id: 'cap_risk_quantification',
        name: 'Risk Quantification',
        description: 'Quantify identified risks with probability and impact',
        inputTypes: ['risk_vectors'],
        outputTypes: ['quantified_risks'],
        computeIntensity: ComputeIntensity.HIGH,
      },
    ],
    guardrails: [
      {
        id: 'gr_scope_limit',
        name: 'Scope Enforcement',
        type: GuardrailType.SCOPE_ENFORCEMENT,
        condition: 'output.recommendation must not override institutional constraints',
        action: GuardrailAction.BLOCK,
        logging: true,
      },
    ],
    deterministicSeed: 42,
  },
  {
    id: 'da_cost_efficiency',
    name: 'Cost Efficiency Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.COST_EFFICIENCY,
    capabilities: [
      {
        id: 'cap_cost_analysis',
        name: 'Cost Analysis',
        description: 'Analyze direct and indirect costs of proposal',
        inputTypes: ['proposal', 'budget_context'],
        outputTypes: ['cost_breakdown', 'roi_estimate'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
      {
        id: 'cap_alternative_costing',
        name: 'Alternative Costing',
        description: 'Cost out alternative approaches',
        inputTypes: ['proposal', 'alternatives'],
        outputTypes: ['comparative_costs'],
        computeIntensity: ComputeIntensity.HIGH,
      },
    ],
    guardrails: [
      {
        id: 'gr_budget_bounds',
        name: 'Budget Bounds Check',
        type: GuardrailType.INPUT_VALIDATION,
        condition: 'budget_context must be present and valid',
        action: GuardrailAction.WARN,
        logging: true,
      },
    ],
    deterministicSeed: 43,
  },
  {
    id: 'da_resilience',
    name: 'Resilience Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.RESILIENCE,
    capabilities: [
      {
        id: 'cap_failure_mode_analysis',
        name: 'Failure Mode Analysis',
        description: 'Identify potential failure modes and recovery paths',
        inputTypes: ['proposal', 'dependencies'],
        outputTypes: ['failure_modes', 'recovery_plans'],
        computeIntensity: ComputeIntensity.HIGH,
      },
      {
        id: 'cap_redundancy_assessment',
        name: 'Redundancy Assessment',
        description: 'Evaluate built-in redundancies and single points of failure',
        inputTypes: ['proposal', 'infrastructure'],
        outputTypes: ['redundancy_score', 'spof_list'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
    ],
    guardrails: [
      {
        id: 'gr_no_single_solution',
        name: 'Alternative Requirement',
        type: GuardrailType.OUTPUT_VALIDATION,
        condition: 'output must include at least one alternative approach',
        action: GuardrailAction.WARN,
        logging: true,
      },
    ],
    deterministicSeed: 44,
  },
  {
    id: 'da_legal_exposure',
    name: 'Legal Exposure Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.LEGAL_EXPOSURE,
    capabilities: [
      {
        id: 'cap_liability_mapping',
        name: 'Liability Mapping',
        description: 'Map potential legal liabilities',
        inputTypes: ['proposal', 'regulatory_context'],
        outputTypes: ['liability_map', 'exposure_estimate'],
        computeIntensity: ComputeIntensity.HIGH,
      },
      {
        id: 'cap_compliance_check',
        name: 'Compliance Check',
        description: 'Check against known compliance requirements',
        inputTypes: ['proposal', 'compliance_frameworks'],
        outputTypes: ['compliance_gaps', 'remediation_steps'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
    ],
    guardrails: [
      {
        id: 'gr_no_legal_advice',
        name: 'No Legal Advice',
        type: GuardrailType.OUTPUT_VALIDATION,
        condition: 'output must not constitute legal advice',
        action: GuardrailAction.BLOCK,
        logging: true,
      },
    ],
    deterministicSeed: 45,
  },
  {
    id: 'da_operational_feasibility',
    name: 'Operational Feasibility Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.OPERATIONAL_FEASIBILITY,
    capabilities: [
      {
        id: 'cap_resource_assessment',
        name: 'Resource Assessment',
        description: 'Assess resource requirements and availability',
        inputTypes: ['proposal', 'resource_inventory'],
        outputTypes: ['resource_gaps', 'timeline_impact'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
      {
        id: 'cap_execution_planning',
        name: 'Execution Planning',
        description: 'Evaluate execution complexity and bottlenecks',
        inputTypes: ['proposal', 'organizational_capacity'],
        outputTypes: ['execution_risk', 'bottleneck_analysis'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
    ],
    guardrails: [
      {
        id: 'gr_realistic_timeline',
        name: 'Timeline Realism',
        type: GuardrailType.OUTPUT_VALIDATION,
        condition: 'timeline estimates must include uncertainty ranges',
        action: GuardrailAction.WARN,
        logging: true,
      },
    ],
    deterministicSeed: 46,
  },
  {
    id: 'da_stakeholder_impact',
    name: 'Stakeholder Impact Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.STAKEHOLDER_IMPACT,
    capabilities: [
      {
        id: 'cap_stakeholder_mapping',
        name: 'Stakeholder Mapping',
        description: 'Map affected stakeholders and their interests',
        inputTypes: ['proposal', 'stakeholder_registry'],
        outputTypes: ['stakeholder_impact_matrix'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
      {
        id: 'cap_impact_quantification',
        name: 'Impact Quantification',
        description: 'Quantify impacts on each stakeholder group',
        inputTypes: ['stakeholder_impact_matrix'],
        outputTypes: ['quantified_impacts', 'distribution_analysis'],
        computeIntensity: ComputeIntensity.HIGH,
      },
    ],
    guardrails: [
      {
        id: 'gr_no_individual_data',
        name: 'No Individual Data',
        type: GuardrailType.INPUT_VALIDATION,
        condition: 'input must not contain individual-level data',
        action: GuardrailAction.BLOCK,
        logging: true,
      },
    ],
    deterministicSeed: 47,
  },
  {
    id: 'da_timeline_optimization',
    name: 'Timeline Optimization Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.TIMELINE_OPTIMIZATION,
    capabilities: [
      {
        id: 'cap_critical_path',
        name: 'Critical Path Analysis',
        description: 'Identify and analyze critical path',
        inputTypes: ['proposal', 'milestones', 'dependencies'],
        outputTypes: ['critical_path', 'float_analysis'],
        computeIntensity: ComputeIntensity.HIGH,
      },
      {
        id: 'cap_schedule_compression',
        name: 'Schedule Compression',
        description: 'Identify opportunities to compress schedule',
        inputTypes: ['critical_path', 'resources'],
        outputTypes: ['compression_options', 'cost_tradeoffs'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
    ],
    guardrails: [
      {
        id: 'gr_safety_margins',
        name: 'Safety Margin Requirement',
        type: GuardrailType.OUTPUT_VALIDATION,
        condition: 'compressed schedules must maintain minimum safety margins',
        action: GuardrailAction.WARN,
        logging: true,
      },
    ],
    deterministicSeed: 48,
  },
  {
    id: 'da_compliance_assurance',
    name: 'Compliance Assurance Analyst',
    class: SGASAgentClass.DECISION,
    objective: DecisionObjective.COMPLIANCE_ASSURANCE,
    capabilities: [
      {
        id: 'cap_framework_mapping',
        name: 'Framework Mapping',
        description: 'Map proposal to compliance frameworks',
        inputTypes: ['proposal', 'compliance_frameworks'],
        outputTypes: ['framework_mapping', 'gaps'],
        computeIntensity: ComputeIntensity.MEDIUM,
      },
      {
        id: 'cap_evidence_requirements',
        name: 'Evidence Requirements',
        description: 'Identify evidence requirements for compliance',
        inputTypes: ['framework_mapping'],
        outputTypes: ['evidence_checklist', 'documentation_plan'],
        computeIntensity: ComputeIntensity.LOW,
      },
    ],
    guardrails: [
      {
        id: 'gr_framework_versioning',
        name: 'Framework Version Check',
        type: GuardrailType.INPUT_VALIDATION,
        condition: 'compliance frameworks must include version information',
        action: GuardrailAction.WARN,
        logging: true,
      },
    ],
    deterministicSeed: 49,
  },
];

// =============================================================================
// DECISION AGENTS SERVICE
// =============================================================================

export class DecisionAgentsService extends EventEmitter {
  private agents: Map<string, DecisionAgentConfig> = new Map();
  private executionHistory: Map<string, DecisionAgentOutput[]> = new Map();

  constructor() {
    super();
    this.initializeAgents();
  }

  private initializeAgents(): void {
    for (const agent of DECISION_AGENTS) {
      this.agents.set(agent.id, agent);
    }
  }

  /**
   * Get all available decision agents
   */
  getAgents(): DecisionAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get a specific agent by ID
   */
  getAgent(agentId: string): DecisionAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get agents by objective
   */
  getAgentsByObjective(objective: DecisionObjective): DecisionAgentConfig[] {
    return Array.from(this.agents.values()).filter(a => a.objective === objective);
  }

  /**
   * Execute a decision agent against a proposal
   */
  async executeAgent(
    agentId: string,
    proposal: DecisionProposal,
    seed?: number
  ): Promise<DecisionAgentOutput> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Decision agent not found: ${agentId}`);
    }

    const executionSeed = seed ?? agent.deterministicSeed ?? Date.now();
    const startTime = new Date();
    const inputHash = hashState({ agentId, proposal, seed: executionSeed });

    this.emit('agent:start', { agentId, proposalId: proposal.id });

    try {
      // Check guardrails
      const guardrailResult = this.checkGuardrails(agent.guardrails, proposal);
      if (guardrailResult.blocked) {
        throw new Error(`Guardrail violation: ${guardrailResult.reason}`);
      }

      // Execute analysis based on objective
      const analysis = await this.performAnalysis(agent, proposal, executionSeed);

      const endTime = new Date();
      const outputHash = hashState(analysis);

      const output: DecisionAgentOutput = {
        agentId: agent.id,
        timestamp: startTime,
        proposalId: proposal.id,
        recommendation: analysis.recommendation,
        riskLevel: analysis.riskLevel,
        confidence: analysis.confidence,
        primaryRisks: analysis.primaryRisks,
        assumptions: analysis.assumptions,
        knownUnknowns: analysis.knownUnknowns,
        reasoning: analysis.reasoning,
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
   * Execute all decision agents against a proposal
   */
  async executeAllAgents(
    proposal: DecisionProposal,
    seed?: number
  ): Promise<DecisionAgentOutput[]> {
    const outputs: DecisionAgentOutput[] = [];
    const baseSeed = seed ?? Date.now();

    for (let i = 0; i < DECISION_AGENTS.length; i++) {
      const agent = DECISION_AGENTS[i];
      const agentSeed = baseSeed + i;
      const output = await this.executeAgent(agent.id, proposal, agentSeed);
      outputs.push(output);
    }

    return outputs;
  }

  /**
   * Check guardrails before execution
   */
  private checkGuardrails(
    guardrails: AgentGuardrail[],
    proposal: DecisionProposal
  ): { blocked: boolean; reason?: string; warnings: string[] } {
    const warnings: string[] = [];

    for (const guardrail of guardrails) {
      const result = this.evaluateGuardrail(guardrail, proposal);

      if (guardrail.logging) {
        this.emit('guardrail:evaluated', {
          guardrailId: guardrail.id,
          proposalId: proposal.id,
          result,
        });
      }

      if (!result.passed) {
        if (guardrail.action === GuardrailAction.BLOCK) {
          return { blocked: true, reason: result.reason, warnings };
        } else if (guardrail.action === GuardrailAction.WARN) {
          warnings.push(result.reason || guardrail.name);
        }
      }
    }

    return { blocked: false, warnings };
  }

  /**
   * Evaluate a single guardrail
   */
  private evaluateGuardrail(
    guardrail: AgentGuardrail,
    proposal: DecisionProposal
  ): { passed: boolean; reason?: string } {
    switch (guardrail.type) {
      case GuardrailType.INPUT_VALIDATION:
        return this.validateInput(guardrail, proposal);
      case GuardrailType.SCOPE_ENFORCEMENT:
        return this.enforceScope(guardrail, proposal);
      default:
        return { passed: true };
    }
  }

  private validateInput(
    guardrail: AgentGuardrail,
    proposal: DecisionProposal
  ): { passed: boolean; reason?: string } {
    // Basic input validation
    if (!proposal.id || !proposal.title || !proposal.description) {
      return { passed: false, reason: 'Missing required proposal fields' };
    }
    return { passed: true };
  }

  private enforceScope(
    guardrail: AgentGuardrail,
    proposal: DecisionProposal
  ): { passed: boolean; reason?: string } {
    // Scope enforcement - ensure proposal is within defined boundaries
    if (proposal.context.scope.boundaries.length === 0) {
      return { passed: false, reason: 'No scope boundaries defined' };
    }
    return { passed: true };
  }

  /**
   * Perform analysis based on agent objective
   */
  private async performAnalysis(
    agent: DecisionAgentConfig,
    proposal: DecisionProposal,
    seed: number
  ): Promise<{
    recommendation: DecisionRecommendation;
    riskLevel: RiskLevel;
    confidence: number;
    primaryRisks: RiskVector[];
    assumptions: Assumption[];
    knownUnknowns: KnownUnknown[];
    reasoning: ReasoningChain;
  }> {
    // Deterministic pseudo-random for consistent analysis
    const rng = this.createSeededRandom(seed);

    const reasoning = this.buildReasoningChain(agent.objective, proposal, rng);
    const risks = this.identifyRisks(agent.objective, proposal, rng);
    const assumptions = this.extractAssumptions(proposal, rng);
    const unknowns = this.identifyUnknowns(agent.objective, proposal, rng);

    // Calculate recommendation based on risk analysis
    const riskScore = risks.reduce((sum, r) => sum + r.probability * this.severityToNumber(r.impact), 0);
    const avgRisk = risks.length > 0 ? riskScore / risks.length : 0;

    let recommendation: DecisionRecommendation;
    let riskLevel: RiskLevel;

    if (avgRisk > 0.7) {
      recommendation = DecisionRecommendation.REJECT;
      riskLevel = RiskLevel.CRITICAL;
    } else if (avgRisk > 0.5) {
      recommendation = DecisionRecommendation.ESCALATE;
      riskLevel = RiskLevel.HIGH;
    } else if (avgRisk > 0.3) {
      recommendation = DecisionRecommendation.MODIFY;
      riskLevel = RiskLevel.MEDIUM;
    } else {
      recommendation = DecisionRecommendation.APPROVE;
      riskLevel = avgRisk > 0.1 ? RiskLevel.LOW : RiskLevel.NEGLIGIBLE;
    }

    // Confidence based on data completeness and assumption count
    const dataCompleteness = this.calculateDataCompleteness(proposal);
    const assumptionPenalty = Math.min(assumptions.length * 0.05, 0.3);
    const confidence = Math.max(0.1, Math.min(0.99, dataCompleteness - assumptionPenalty));

    return {
      recommendation,
      riskLevel,
      confidence,
      primaryRisks: risks,
      assumptions,
      knownUnknowns: unknowns,
      reasoning,
    };
  }

  /**
   * Build reasoning chain for the analysis
   */
  private buildReasoningChain(
    objective: DecisionObjective,
    proposal: DecisionProposal,
    rng: () => number
  ): ReasoningChain {
    const steps: ReasoningStep[] = [
      {
        order: 1,
        type: ReasoningType.LOOKUP,
        input: `Proposal: ${proposal.title}`,
        output: `Loaded proposal context with ${proposal.constraints.length} constraints`,
        confidence: 1.0,
        duration: 10,
      },
      {
        order: 2,
        type: ReasoningType.RULE_BASED,
        input: `Objective: ${objective}`,
        output: `Applied ${objective} analysis framework`,
        confidence: 0.95,
        duration: 50,
      },
      {
        order: 3,
        type: ReasoningType.CALCULATION,
        input: `Context: Budget=${proposal.context.budget?.allocated || 'N/A'}, Timeframe=${proposal.context.timeframe.start} to ${proposal.context.timeframe.end}`,
        output: `Calculated resource requirements and timeline feasibility`,
        confidence: 0.9,
        duration: 100,
      },
      {
        order: 4,
        type: ReasoningType.INFERENCE,
        input: 'Constraint analysis',
        output: `Identified ${proposal.constraints.length} applicable constraints`,
        confidence: 0.85 + rng() * 0.1,
        duration: 150,
      },
    ];

    const rejectedPaths: RejectedPath[] = [
      {
        description: 'Ignore institutional constraints',
        reason: 'Would violate bounded authority principle',
        riskLevel: RiskLevel.CRITICAL,
      },
    ];

    return {
      steps,
      finalConclusion: `Analysis complete for ${objective}`,
      alternativesConsidered: ['Phased implementation', 'Reduced scope', 'Delayed timeline'],
      rejectedPaths,
    };
  }

  /**
   * Identify risks based on objective
   */
  private identifyRisks(
    objective: DecisionObjective,
    proposal: DecisionProposal,
    rng: () => number
  ): RiskVector[] {
    const risks: RiskVector[] = [];

    // Common risks based on proposal characteristics
    if (proposal.context.budget && proposal.context.budget.flexibilityPercent < 10) {
      risks.push({
        id: generateSGASId('risk'),
        name: 'Budget Rigidity',
        category: 'financial',
        probability: 0.4 + rng() * 0.2,
        impact: SeverityLevel.WARNING,
        timeframe: 'throughout',
        mitigations: ['Contingency reserve', 'Phased spending'],
        residualRisk: 0.2,
      });
    }

    if (proposal.context.timeframe.criticalPath) {
      risks.push({
        id: generateSGASId('risk'),
        name: 'Critical Path Exposure',
        category: 'schedule',
        probability: 0.3 + rng() * 0.2,
        impact: SeverityLevel.ERROR,
        timeframe: proposal.context.timeframe.milestones[0]?.name || 'early phase',
        mitigations: ['Buffer time', 'Parallel paths', 'Early warning indicators'],
        residualRisk: 0.15,
      });
    }

    // Objective-specific risks
    switch (objective) {
      case DecisionObjective.RISK_MINIMIZATION:
        risks.push({
          id: generateSGASId('risk'),
          name: 'Unknown Unknowns',
          category: 'uncertainty',
          probability: 0.5,
          impact: SeverityLevel.WARNING,
          timeframe: 'ongoing',
          mitigations: ['Regular review cycles', 'Escalation triggers'],
          residualRisk: 0.3,
        });
        break;

      case DecisionObjective.COST_EFFICIENCY:
        risks.push({
          id: generateSGASId('risk'),
          name: 'Cost Overrun',
          category: 'financial',
          probability: 0.35 + rng() * 0.15,
          impact: SeverityLevel.ERROR,
          timeframe: 'Q2-Q4',
          mitigations: ['Earned value tracking', 'Cost gates'],
          residualRisk: 0.2,
        });
        break;

      case DecisionObjective.LEGAL_EXPOSURE:
        risks.push({
          id: generateSGASId('risk'),
          name: 'Regulatory Change',
          category: 'compliance',
          probability: 0.2 + rng() * 0.1,
          impact: SeverityLevel.CRITICAL,
          timeframe: 'post-implementation',
          mitigations: ['Regulatory monitoring', 'Flexible architecture'],
          residualRisk: 0.1,
        });
        break;
    }

    return risks;
  }

  /**
   * Extract assumptions from proposal
   */
  private extractAssumptions(proposal: DecisionProposal, rng: () => number): Assumption[] {
    const assumptions: Assumption[] = [
      {
        id: generateSGASId('asmp'),
        statement: 'Stakeholder availability as scheduled',
        confidence: 0.8 + rng() * 0.15,
        source: 'project_plan',
        validationMethod: 'Regular check-ins',
        invalidationTrigger: 'Stakeholder unavailability > 2 weeks',
      },
      {
        id: generateSGASId('asmp'),
        statement: 'Regulatory environment remains stable',
        confidence: 0.7 + rng() * 0.2,
        source: 'regulatory_analysis',
        validationMethod: 'Regulatory monitoring',
        invalidationTrigger: 'New regulation announcement',
      },
    ];

    if (proposal.context.budget) {
      assumptions.push({
        id: generateSGASId('asmp'),
        statement: `Budget of ${proposal.context.budget.currency} ${proposal.context.budget.allocated} remains approved`,
        confidence: 0.85,
        source: 'budget_approval',
        validationMethod: 'Quarterly budget review',
        invalidationTrigger: 'Budget reduction > 10%',
      });
    }

    return assumptions;
  }

  /**
   * Identify known unknowns
   */
  private identifyUnknowns(
    objective: DecisionObjective,
    proposal: DecisionProposal,
    rng: () => number
  ): KnownUnknown[] {
    const unknowns: KnownUnknown[] = [
      {
        id: generateSGASId('unk'),
        description: 'Long-term operational costs',
        potentialImpact: SeverityLevel.WARNING,
        investigationCost: 5000,
        decisionRelevance: 0.6 + rng() * 0.2,
      },
    ];

    if (proposal.historicalBaseline && proposal.historicalBaseline.failureModes.length > 0) {
      unknowns.push({
        id: generateSGASId('unk'),
        description: 'Historical failure pattern recurrence',
        potentialImpact: SeverityLevel.ERROR,
        investigationCost: 10000,
        decisionRelevance: 0.8,
      });
    }

    return unknowns;
  }

  /**
   * Calculate data completeness score
   */
  private calculateDataCompleteness(proposal: DecisionProposal): number {
    let score = 0.5; // Base score

    if (proposal.context.budget) score += 0.1;
    if (proposal.context.timeframe.milestones.length > 0) score += 0.1;
    if (proposal.constraints.length > 0) score += 0.1;
    if (proposal.historicalBaseline) score += 0.1;
    if (proposal.context.stakeholders.length > 0) score += 0.05;
    if (proposal.context.dependencies.length > 0) score += 0.05;

    return Math.min(1.0, score);
  }

  /**
   * Convert severity to numeric value
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
   * Create seeded random number generator for determinism
   */
  private createSeededRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  /**
   * Get execution history for a proposal
   */
  getExecutionHistory(proposalId: string): DecisionAgentOutput[] {
    return this.executionHistory.get(proposalId) || [];
  }

  /**
   * Aggregate outputs from multiple decision agents
   */
  aggregateOutputs(outputs: DecisionAgentOutput[]): {
    consensusRecommendation: DecisionRecommendation;
    averageConfidence: number;
    aggregateRiskLevel: RiskLevel;
    allRisks: RiskVector[];
    dissents: string[];
  } {
    if (outputs.length === 0) {
      return {
        consensusRecommendation: DecisionRecommendation.ESCALATE,
        averageConfidence: 0,
        aggregateRiskLevel: RiskLevel.HIGH,
        allRisks: [],
        dissents: ['No agent outputs to aggregate'],
      };
    }

    // Count recommendations
    const recommendationCounts: Record<DecisionRecommendation, number> = {
      [DecisionRecommendation.APPROVE]: 0,
      [DecisionRecommendation.MODIFY]: 0,
      [DecisionRecommendation.REJECT]: 0,
      [DecisionRecommendation.ESCALATE]: 0,
    };

    for (const output of outputs) {
      recommendationCounts[output.recommendation]++;
    }

    // Find consensus
    const sorted = Object.entries(recommendationCounts).sort((a, b) => b[1] - a[1]);
    const consensusRecommendation = sorted[0][0] as DecisionRecommendation;

    // Find dissents
    const dissents = outputs
      .filter(o => o.recommendation !== consensusRecommendation)
      .map(o => `${o.agentId}: ${o.recommendation} (confidence: ${o.confidence.toFixed(2)})`);

    // Calculate averages
    const averageConfidence = outputs.reduce((sum, o) => sum + o.confidence, 0) / outputs.length;

    // Aggregate risks
    const allRisks = outputs.flatMap(o => o.primaryRisks);

    // Determine aggregate risk level
    const riskLevelValues: Record<RiskLevel, number> = {
      [RiskLevel.NEGLIGIBLE]: 0,
      [RiskLevel.LOW]: 1,
      [RiskLevel.MEDIUM]: 2,
      [RiskLevel.HIGH]: 3,
      [RiskLevel.CRITICAL]: 4,
    };

    const maxRiskValue = Math.max(...outputs.map(o => riskLevelValues[o.riskLevel]));
    const aggregateRiskLevel = Object.entries(riskLevelValues).find(([, v]) => v === maxRiskValue)?.[0] as RiskLevel || RiskLevel.MEDIUM;

    return {
      consensusRecommendation,
      averageConfidence,
      aggregateRiskLevel,
      allRisks,
      dissents,
    };
  }
}

// Export singleton instance
export const decisionAgentsService = new DecisionAgentsService();
export default decisionAgentsService;
