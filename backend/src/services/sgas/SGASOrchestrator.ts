// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS ORCHESTRATOR
 * 
 * The central coordinator for the Synthetic Governance Agent System.
 * Manages the directed deliberation graph execution across all five agent classes:
 * 
 * Execution Order:
 * 1. Decision Agents (Class I)
 * 2. Institutional Agents (Class II)
 * 3. Adversarial Agents (Class III)
 * 4. Observer Agents (Class IV)
 * 5. Meta-Governance Agents (Class V) - optional
 * 
 * All interactions are:
 * - Ordered
 * - Logged
 * - Replayable
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import {
  DecisionProposal,
  DeliberationGraph,
  DeliberationStatus,
  DeliberationPhase,
  DeliberationConfiguration,
  NodeStatus,
  EdgeType,
  DataFlowType,
  SGASAgentClass,
  DecisionAgentOutput,
  InstitutionalAgentOutput,
  AdversarialAgentOutput,
  ObserverAgentOutput,
  MetaGovernanceAgentOutput,
  InstitutionalStatus,
  DEFAULT_DELIBERATION_CONFIG,
  generateSGASId,
  hashState,
  createDeliberationNode,
  createDeliberationEdge,
} from './types.js';

import { decisionAgentsService, DecisionAgentsService } from './DecisionAgentsService.js';
import { institutionalAgentsService, InstitutionalAgentsService } from './InstitutionalAgentsService.js';
import { adversarialAgentsService, AdversarialAgentsService } from './AdversarialAgentsService.js';
import { observerAgentsService, ObserverAgentsService } from './ObserverAgentsService.js';
import { metaGovernanceAgentsService, MetaGovernanceAgentsService } from './MetaGovernanceAgentsService.js';

// =============================================================================
// SGAS ORCHESTRATOR
// =============================================================================

export interface SGASDeliberationResult {
  graph: DeliberationGraph;
  decisionOutputs: DecisionAgentOutput[];
  institutionalOutputs: InstitutionalAgentOutput[];
  adversarialOutputs: AdversarialAgentOutput[];
  observerOutputs: ObserverAgentOutput[];
  metaGovernanceOutputs: MetaGovernanceAgentOutput[];
  finalStatus: DeliberationFinalStatus;
  summary: DeliberationSummary;
}

export interface DeliberationFinalStatus {
  approved: boolean;
  blocked: boolean;
  escalationRequired: boolean;
  criticalRisks: string[];
  requiredActions: string[];
}

export interface DeliberationSummary {
  totalAgentsInvoked: number;
  totalDurationMs: number;
  consensusRecommendation: string;
  institutionalStatus: InstitutionalStatus;
  adversarialFindingsCount: number;
  anomaliesDetected: number;
  trustDelta: number;
  merkleRoot: string;
  deterministicHash: string;
}

export class SGASOrchestrator extends EventEmitter {
  private decisionService: DecisionAgentsService;
  private institutionalService: InstitutionalAgentsService;
  private adversarialService: AdversarialAgentsService;
  private observerService: ObserverAgentsService;
  private metaGovernanceService: MetaGovernanceAgentsService;

  private activeDeliberations: Map<string, DeliberationGraph> = new Map();
  private completedDeliberations: Map<string, SGASDeliberationResult> = new Map();

  constructor() {
    super();
    this.decisionService = decisionAgentsService;
    this.institutionalService = institutionalAgentsService;
    this.adversarialService = adversarialAgentsService;
    this.observerService = observerAgentsService;
    this.metaGovernanceService = metaGovernanceAgentsService;

    this.setupEventForwarding();
  }

  private setupEventForwarding(): void {
    // Forward events from all services
    const services = [
      this.decisionService,
      this.institutionalService,
      this.adversarialService,
      this.observerService,
      this.metaGovernanceService,
    ];

    for (const service of services) {
      service.on('agent:start', (data) => this.emit('agent:start', data));
      service.on('agent:complete', (data) => this.emit('agent:complete', data));
      service.on('agent:error', (data) => this.emit('agent:error', data));
    }
  }

  /**
   * Execute a full deliberation on a proposal
   */
  async executeDeliberation(
    proposal: DecisionProposal,
    config: Partial<DeliberationConfiguration> = {},
    seed?: number
  ): Promise<SGASDeliberationResult> {
    const fullConfig: DeliberationConfiguration = {
      ...DEFAULT_DELIBERATION_CONFIG,
      ...config,
    };

    const executionSeed = seed ?? Date.now();
    const graphId = generateSGASId('delib');

    // Initialize deliberation graph
    const graph = this.initializeGraph(graphId, proposal, fullConfig, executionSeed);
    this.activeDeliberations.set(graphId, graph);

    this.emit('deliberation:start', { graphId, proposalId: proposal.id });

    const startTime = Date.now();

    try {
      // Phase 1: Decision Analysis
      graph.phase = DeliberationPhase.DECISION_ANALYSIS;
      const decisionOutputs = await this.executeDecisionPhase(proposal, graph, executionSeed);
      
      // Check if we should continue based on decision outputs
      const decisionAggregation = this.decisionService.aggregateOutputs(decisionOutputs);

      // Phase 2: Institutional Enforcement
      graph.phase = DeliberationPhase.INSTITUTIONAL_ENFORCEMENT;
      const institutionalOutputs = await this.executeInstitutionalPhase(
        proposal,
        decisionOutputs,
        graph,
        executionSeed
      );

      // Check if blocked
      const institutionalAggregation = this.institutionalService.aggregateOutputs(institutionalOutputs);
      
      // Phase 3: Adversarial Stress (even if blocked - we want to know why it would fail)
      graph.phase = DeliberationPhase.ADVERSARIAL_STRESS;
      const adversarialOutputs = await this.executeAdversarialPhase(
        proposal,
        institutionalOutputs,
        graph,
        executionSeed
      );

      const adversarialAggregation = this.adversarialService.aggregateOutputs(adversarialOutputs);

      // Phase 4: Observation & Audit
      graph.phase = DeliberationPhase.OBSERVATION_AUDIT;
      const observerOutputs = await this.executeObserverPhase(
        proposal,
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs,
        graphId,
        graph,
        executionSeed
      );

      const observerAggregation = this.observerService.aggregateOutputs(observerOutputs);

      // Phase 5: Meta-Governance (optional)
      let metaGovernanceOutputs: MetaGovernanceAgentOutput[] = [];
      if (fullConfig.includeMetaGovernance) {
        graph.phase = DeliberationPhase.META_GOVERNANCE;
        metaGovernanceOutputs = await this.executeMetaGovernancePhase(graph, executionSeed);
      }

      // Finalization
      graph.phase = DeliberationPhase.FINALIZATION;
      graph.status = DeliberationStatus.COMPLETED;
      graph.completedAt = new Date();

      // Calculate final status
      const finalStatus = this.calculateFinalStatus(
        decisionAggregation,
        institutionalAggregation,
        adversarialAggregation,
        observerAggregation
      );

      // Calculate summary
      const totalDuration = Date.now() - startTime;
      const summary = this.calculateSummary(
        graph,
        decisionAggregation,
        institutionalAggregation,
        adversarialAggregation,
        observerAggregation,
        totalDuration
      );

      // Update graph metadata
      graph.metadata.totalDurationMs = totalDuration;
      graph.metadata.totalAgentsInvoked = 
        decisionOutputs.length +
        institutionalOutputs.length +
        adversarialOutputs.length +
        observerOutputs.length +
        metaGovernanceOutputs.length;
      graph.metadata.violationsDetected = institutionalAggregation.allViolations.length;
      graph.metadata.escalationsTriggered = institutionalAggregation.escalationRequired ? 1 : 0;

      // Calculate deterministic hash
      graph.deterministicHash = this.calculateDeterministicHash(
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs,
        observerOutputs
      );

      const result: SGASDeliberationResult = {
        graph,
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs,
        observerOutputs,
        metaGovernanceOutputs,
        finalStatus,
        summary,
      };

      // Store completed deliberation
      this.completedDeliberations.set(graphId, result);
      this.activeDeliberations.delete(graphId);

      this.emit('deliberation:complete', { graphId, proposalId: proposal.id, result });

      return result;
    } catch (error) {
      graph.status = DeliberationStatus.FAILED;
      this.activeDeliberations.delete(graphId);
      this.emit('deliberation:error', { graphId, proposalId: proposal.id, error });
      throw error;
    }
  }

  /**
   * Initialize deliberation graph
   */
  private initializeGraph(
    graphId: string,
    proposal: DecisionProposal,
    config: DeliberationConfiguration,
    seed: number
  ): DeliberationGraph {
    return {
      id: graphId,
      proposalId: proposal.id,
      createdAt: new Date(),
      status: DeliberationStatus.IN_PROGRESS,
      phase: DeliberationPhase.INITIALIZATION,
      nodes: [],
      edges: [],
      executionOrder: [],
      seed,
      deterministicHash: '',
      metadata: {
        version: '1.0.0',
        configuration: config,
        totalDurationMs: 0,
        totalAgentsInvoked: 0,
        violationsDetected: 0,
        escalationsTriggered: 0,
        humanInterventions: 0,
      },
    };
  }

  /**
   * Execute Decision Agents phase
   */
  private async executeDecisionPhase(
    proposal: DecisionProposal,
    graph: DeliberationGraph,
    seed: number
  ): Promise<DecisionAgentOutput[]> {
    const agents = this.decisionService.getAgents();
    const outputs: DecisionAgentOutput[] = [];

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]!;
      const node = createDeliberationNode(
        agent.id,
        SGASAgentClass.DECISION,
        DeliberationPhase.DECISION_ANALYSIS,
        i
      );
      node.status = NodeStatus.RUNNING;
      node.startedAt = new Date();
      node.input = proposal;
      node.inputHash = hashState(proposal);
      graph.nodes.push(node);
      graph.executionOrder.push(node.id);

      try {
        const output = await this.decisionService.executeAgent(agent.id, proposal, seed + i);
        outputs.push(output);

        node.status = NodeStatus.COMPLETED;
        node.completedAt = new Date();
        node.output = output;
        node.outputHash = output.executionMetadata.outputHash;
        node.durationMs = output.executionMetadata.durationMs;
      } catch (error) {
        node.status = NodeStatus.FAILED;
        node.completedAt = new Date();
        throw error;
      }
    }

    // Create edges between decision nodes (all feed into next phase)
    for (let i = 0; i < graph.nodes.length - 1; i++) {
      const edge = createDeliberationEdge(
        graph.nodes[i]!.id,
        graph.nodes[i + 1]!.id,
        EdgeType.PARALLEL,
        DataFlowType.SUMMARY
      );
      graph.edges.push(edge);
    }

    return outputs;
  }

  /**
   * Execute Institutional Agents phase
   */
  private async executeInstitutionalPhase(
    proposal: DecisionProposal,
    decisionOutputs: DecisionAgentOutput[],
    graph: DeliberationGraph,
    seed: number
  ): Promise<InstitutionalAgentOutput[]> {
    const agents = this.institutionalService.getAgents();
    const outputs: InstitutionalAgentOutput[] = [];
    const startNodeIndex = graph.nodes.length;

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]!;
      const node = createDeliberationNode(
        agent.id,
        SGASAgentClass.INSTITUTIONAL,
        DeliberationPhase.INSTITUTIONAL_ENFORCEMENT,
        startNodeIndex + i
      );
      node.status = NodeStatus.RUNNING;
      node.startedAt = new Date();
      node.input = { proposal, decisionOutputs };
      node.inputHash = hashState({ proposal, decisionOutputs });
      graph.nodes.push(node);
      graph.executionOrder.push(node.id);

      try {
        const output = await this.institutionalService.executeAgent(
          agent.id,
          proposal,
          decisionOutputs,
          seed + 100 + i
        );
        outputs.push(output);

        node.status = NodeStatus.COMPLETED;
        node.completedAt = new Date();
        node.output = output;
        node.outputHash = output.executionMetadata.outputHash;
        node.durationMs = output.executionMetadata.durationMs;
      } catch (error) {
        node.status = NodeStatus.FAILED;
        node.completedAt = new Date();
        throw error;
      }
    }

    // Create edges from decision phase to institutional phase
    const decisionNodes = graph.nodes.filter(n => n.agentClass === SGASAgentClass.DECISION);
    const institutionalNodes = graph.nodes.filter(n => n.agentClass === SGASAgentClass.INSTITUTIONAL);

    for (const decisionNode of decisionNodes) {
      for (const instNode of institutionalNodes) {
        const edge = createDeliberationEdge(
          decisionNode.id,
          instNode.id,
          EdgeType.SEQUENTIAL,
          DataFlowType.FULL_OUTPUT
        );
        graph.edges.push(edge);
      }
    }

    return outputs;
  }

  /**
   * Execute Adversarial Agents phase
   */
  private async executeAdversarialPhase(
    proposal: DecisionProposal,
    institutionalOutputs: InstitutionalAgentOutput[],
    graph: DeliberationGraph,
    seed: number
  ): Promise<AdversarialAgentOutput[]> {
    const agents = this.adversarialService.getAgents();
    const outputs: AdversarialAgentOutput[] = [];
    const startNodeIndex = graph.nodes.length;

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]!;
      const node = createDeliberationNode(
        agent.id,
        SGASAgentClass.ADVERSARIAL,
        DeliberationPhase.ADVERSARIAL_STRESS,
        startNodeIndex + i
      );
      node.status = NodeStatus.RUNNING;
      node.startedAt = new Date();
      node.input = { proposal, institutionalOutputs };
      node.inputHash = hashState({ proposal, institutionalOutputs });
      graph.nodes.push(node);
      graph.executionOrder.push(node.id);

      try {
        const output = await this.adversarialService.executeAgent(
          agent.id,
          proposal,
          institutionalOutputs,
          seed + 200 + i
        );
        outputs.push(output);

        node.status = NodeStatus.COMPLETED;
        node.completedAt = new Date();
        node.output = output;
        node.outputHash = output.executionMetadata.outputHash;
        node.durationMs = output.executionMetadata.durationMs;
      } catch (error) {
        node.status = NodeStatus.FAILED;
        node.completedAt = new Date();
        throw error;
      }
    }

    // Create edges from institutional to adversarial
    const institutionalNodes = graph.nodes.filter(n => n.agentClass === SGASAgentClass.INSTITUTIONAL);
    const adversarialNodes = graph.nodes.filter(n => n.agentClass === SGASAgentClass.ADVERSARIAL);

    for (const instNode of institutionalNodes) {
      for (const advNode of adversarialNodes) {
        const edge = createDeliberationEdge(
          instNode.id,
          advNode.id,
          EdgeType.SEQUENTIAL,
          DataFlowType.SUMMARY
        );
        graph.edges.push(edge);
      }
    }

    return outputs;
  }

  /**
   * Execute Observer Agents phase
   */
  private async executeObserverPhase(
    proposal: DecisionProposal,
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[],
    deliberationGraphId: string,
    graph: DeliberationGraph,
    seed: number
  ): Promise<ObserverAgentOutput[]> {
    const agents = this.observerService.getAgents();
    const outputs: ObserverAgentOutput[] = [];
    const startNodeIndex = graph.nodes.length;

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]!;
      const node = createDeliberationNode(
        agent.id,
        SGASAgentClass.OBSERVER,
        DeliberationPhase.OBSERVATION_AUDIT,
        startNodeIndex + i
      );
      node.status = NodeStatus.RUNNING;
      node.startedAt = new Date();
      node.input = { proposal, decisionOutputs, institutionalOutputs, adversarialOutputs };
      node.inputHash = hashState({ proposal, decisionOutputs, institutionalOutputs, adversarialOutputs });
      graph.nodes.push(node);
      graph.executionOrder.push(node.id);

      try {
        const output = await this.observerService.executeAgent(
          agent.id,
          proposal,
          decisionOutputs,
          institutionalOutputs,
          adversarialOutputs,
          deliberationGraphId,
          seed + 300 + i
        );
        outputs.push(output);

        node.status = NodeStatus.COMPLETED;
        node.completedAt = new Date();
        node.output = output;
        node.outputHash = output.executionMetadata.outputHash;
        node.durationMs = output.executionMetadata.durationMs;
      } catch (error) {
        node.status = NodeStatus.FAILED;
        node.completedAt = new Date();
        throw error;
      }
    }

    // Create edges from all previous phases to observer
    const previousNodes = graph.nodes.filter(
      n => n.agentClass !== SGASAgentClass.OBSERVER && n.agentClass !== SGASAgentClass.META_GOVERNANCE
    );
    const observerNodes = graph.nodes.filter(n => n.agentClass === SGASAgentClass.OBSERVER);

    for (const prevNode of previousNodes) {
      for (const obsNode of observerNodes) {
        const edge = createDeliberationEdge(
          prevNode.id,
          obsNode.id,
          EdgeType.SEQUENTIAL,
          DataFlowType.AGGREGATED
        );
        graph.edges.push(edge);
      }
    }

    return outputs;
  }

  /**
   * Execute Meta-Governance Agents phase
   */
  private async executeMetaGovernancePhase(
    graph: DeliberationGraph,
    seed: number
  ): Promise<MetaGovernanceAgentOutput[]> {
    const agents = this.metaGovernanceService.getAgents();
    const outputs: MetaGovernanceAgentOutput[] = [];
    const startNodeIndex = graph.nodes.length;

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i]!;
      const node = createDeliberationNode(
        agent.id,
        SGASAgentClass.META_GOVERNANCE,
        DeliberationPhase.META_GOVERNANCE,
        startNodeIndex + i
      );
      node.status = NodeStatus.RUNNING;
      node.startedAt = new Date();
      node.inputHash = hashState({ agentId: agent.id });
      graph.nodes.push(node);
      graph.executionOrder.push(node.id);

      try {
        const output = await this.metaGovernanceService.executeAgent(agent.id, seed + 400 + i);
        outputs.push(output);

        node.status = NodeStatus.COMPLETED;
        node.completedAt = new Date();
        node.output = output;
        node.outputHash = output.executionMetadata.outputHash;
        node.durationMs = output.executionMetadata.durationMs;
      } catch (error) {
        node.status = NodeStatus.FAILED;
        node.completedAt = new Date();
        throw error;
      }
    }

    // Create edges from observer to meta-governance
    const observerNodes = graph.nodes.filter(n => n.agentClass === SGASAgentClass.OBSERVER);
    const metaNodes = graph.nodes.filter(n => n.agentClass === SGASAgentClass.META_GOVERNANCE);

    for (const obsNode of observerNodes) {
      for (const metaNode of metaNodes) {
        const edge = createDeliberationEdge(
          obsNode.id,
          metaNode.id,
          EdgeType.SEQUENTIAL,
          DataFlowType.AGGREGATED
        );
        graph.edges.push(edge);
      }
    }

    return outputs;
  }

  /**
   * Calculate final deliberation status
   */
  private calculateFinalStatus(
    decisionAgg: ReturnType<DecisionAgentsService['aggregateOutputs']>,
    institutionalAgg: ReturnType<InstitutionalAgentsService['aggregateOutputs']>,
    adversarialAgg: ReturnType<AdversarialAgentsService['aggregateOutputs']>,
    observerAgg: ReturnType<ObserverAgentsService['aggregateOutputs']>
  ): DeliberationFinalStatus {
    const blocked = institutionalAgg.overallStatus === InstitutionalStatus.BLOCK;
    const escalationRequired = institutionalAgg.escalationRequired;
    
    const approved = !blocked && 
      !escalationRequired && 
      decisionAgg.consensusRecommendation === 'approve' &&
      observerAgg.integrityVerified;

    const criticalRisks: string[] = [
      ...adversarialAgg.criticalFindings,
      ...observerAgg.criticalAnomalies.map(a => a.description),
    ];

    const requiredActions = institutionalAgg.allRequiredActions.map(a => a.action);

    return {
      approved,
      blocked,
      escalationRequired,
      criticalRisks,
      requiredActions,
    };
  }

  /**
   * Calculate deliberation summary
   */
  private calculateSummary(
    graph: DeliberationGraph,
    decisionAgg: ReturnType<DecisionAgentsService['aggregateOutputs']>,
    institutionalAgg: ReturnType<InstitutionalAgentsService['aggregateOutputs']>,
    adversarialAgg: ReturnType<AdversarialAgentsService['aggregateOutputs']>,
    observerAgg: ReturnType<ObserverAgentsService['aggregateOutputs']>,
    totalDurationMs: number
  ): DeliberationSummary {
    return {
      totalAgentsInvoked: graph.nodes.length,
      totalDurationMs,
      consensusRecommendation: decisionAgg.consensusRecommendation,
      institutionalStatus: institutionalAgg.overallStatus,
      adversarialFindingsCount: 
        adversarialAgg.totalFailureScenarios + adversarialAgg.totalExploitPaths,
      anomaliesDetected: observerAgg.totalAnomalies,
      trustDelta: observerAgg.overallTrustDelta,
      merkleRoot: observerAgg.merkleRoot,
      deterministicHash: graph.deterministicHash,
    };
  }

  /**
   * Calculate deterministic hash for the entire deliberation
   */
  private calculateDeterministicHash(
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[],
    observerOutputs: ObserverAgentOutput[]
  ): string {
    const allHashes = [
      ...decisionOutputs.map(o => o.executionMetadata.outputHash),
      ...institutionalOutputs.map(o => o.executionMetadata.outputHash),
      ...adversarialOutputs.map(o => o.executionMetadata.outputHash),
      ...observerOutputs.map(o => o.executionMetadata.outputHash),
    ];

    const combined = allHashes.join(':');
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  /**
   * Get active deliberation by ID
   */
  getActiveDeliberation(graphId: string): DeliberationGraph | undefined {
    return this.activeDeliberations.get(graphId);
  }

  /**
   * Get completed deliberation result by ID
   */
  getCompletedDeliberation(graphId: string): SGASDeliberationResult | undefined {
    return this.completedDeliberations.get(graphId);
  }

  /**
   * List all completed deliberations
   */
  listCompletedDeliberations(): SGASDeliberationResult[] {
    return Array.from(this.completedDeliberations.values());
  }

  /**
   * Get deliberation statistics
   */
  getStatistics(): {
    activeCount: number;
    completedCount: number;
    averageDurationMs: number;
    approvalRate: number;
  } {
    const completed = Array.from(this.completedDeliberations.values());
    const totalDuration = completed.reduce((sum, d) => sum + d.summary.totalDurationMs, 0);
    const approvedCount = completed.filter(d => d.finalStatus.approved).length;

    return {
      activeCount: this.activeDeliberations.size,
      completedCount: completed.length,
      averageDurationMs: completed.length > 0 ? totalDuration / completed.length : 0,
      approvalRate: completed.length > 0 ? approvedCount / completed.length : 0,
    };
  }
}

// Export singleton instance
export const sgasOrchestrator = new SGASOrchestrator();
export default sgasOrchestrator;
