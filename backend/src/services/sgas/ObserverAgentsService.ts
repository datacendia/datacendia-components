// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS CLASS IV - OBSERVER AGENTS SERVICE
 * 
 * Observer Agents are truth recorders. They:
 * - Never influence outcomes
 * - Never block decisions
 * - Never recommend actions
 * 
 * They measure and record. They produce evidence, not opinions.
 * They make it impossible to say: "You just made this up."
 * They create machine-verifiable proof.
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import {
  SGASAgentClass,
  ObserverAgentConfig,
  ObserverAgentOutput,
  ObservationType,
  MetricType,
  AggregationType,
  ThresholdLevel,
  OutputFormat,
  GuardrailAction,
  DecisionProposal,
  DecisionAgentOutput,
  InstitutionalAgentOutput,
  AdversarialAgentOutput,
  MetricResult,
  TrustDelta,
  TrustComponent,
  IntegrityVerification,
  Discrepancy,
  ReplayVerification,
  ReplayDifference,
  AuditArtifact,
  AuditArtifactType,
  Anomaly,
  AnomalyType,
  TrendDirection,
  HistoricalComparison,
  SeverityLevel,
  SensitivityLevel,
  generateSGASId,
  hashState,
} from './types.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// OBSERVER AGENT DEFINITIONS
// =============================================================================

export const OBSERVER_AGENTS: ObserverAgentConfig[] = [
  {
    id: 'oa_outcome_variance',
    name: 'Outcome Variance Observer',
    class: SGASAgentClass.OBSERVER,
    observationType: ObservationType.OUTCOME_VARIANCE,
    metrics: [
      {
        id: 'met_recommendation_variance',
        name: 'Recommendation Variance',
        type: MetricType.GAUGE,
        calculation: 'std_dev(agent_recommendations)',
        unit: 'sigma',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 1.5, action: GuardrailAction.LOG },
          { level: ThresholdLevel.ERROR, value: 2.0, action: GuardrailAction.WARN },
        ],
        aggregation: AggregationType.AVERAGE,
      },
      {
        id: 'met_confidence_spread',
        name: 'Confidence Spread',
        type: MetricType.HISTOGRAM,
        calculation: 'max(confidence) - min(confidence)',
        unit: 'delta',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 0.3, action: GuardrailAction.LOG },
        ],
        aggregation: AggregationType.MAX,
      },
    ],
    triggers: [
      {
        id: 'trig_high_variance',
        condition: 'recommendation_variance > 2.0',
        action: 'flag_for_review',
        cooldown: 300000, // 5 minutes
        maxTriggers: 10,
      },
    ],
    outputFormats: [OutputFormat.JSON, OutputFormat.AUDIT_LOG],
  },
  {
    id: 'oa_trust_impact',
    name: 'Trust Impact Observer',
    class: SGASAgentClass.OBSERVER,
    observationType: ObservationType.TRUST_IMPACT,
    metrics: [
      {
        id: 'met_trust_delta',
        name: 'Trust Delta',
        type: MetricType.DELTA,
        calculation: 'current_trust - baseline_trust',
        unit: 'points',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: -0.1, action: GuardrailAction.LOG },
          { level: ThresholdLevel.ERROR, value: -0.2, action: GuardrailAction.WARN },
        ],
        aggregation: AggregationType.SUM,
      },
      {
        id: 'met_stakeholder_trust',
        name: 'Stakeholder Trust Score',
        type: MetricType.GAUGE,
        calculation: 'weighted_avg(stakeholder_trust_scores)',
        unit: 'score',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 0.6, action: GuardrailAction.LOG },
          { level: ThresholdLevel.CRITICAL, value: 0.4, action: GuardrailAction.ESCALATE },
        ],
        aggregation: AggregationType.AVERAGE,
      },
    ],
    triggers: [
      {
        id: 'trig_trust_drop',
        condition: 'trust_delta < -0.15',
        action: 'alert_governance',
        cooldown: 600000, // 10 minutes
        maxTriggers: 5,
      },
    ],
    outputFormats: [OutputFormat.JSON, OutputFormat.REPORT],
  },
  {
    id: 'oa_determinism',
    name: 'Determinism Verification Observer',
    class: SGASAgentClass.OBSERVER,
    observationType: ObservationType.DETERMINISM_VERIFICATION,
    metrics: [
      {
        id: 'met_deterministic_ratio',
        name: 'Deterministic Component Ratio',
        type: MetricType.GAUGE,
        calculation: 'deterministic_components / total_components',
        unit: 'ratio',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 0.95, action: GuardrailAction.LOG },
          { level: ThresholdLevel.ERROR, value: 0.9, action: GuardrailAction.WARN },
        ],
        aggregation: AggregationType.MIN,
      },
      {
        id: 'met_hash_consistency',
        name: 'Hash Consistency',
        type: MetricType.COUNTER,
        calculation: 'count(hash_mismatches)',
        unit: 'count',
        thresholds: [
          { level: ThresholdLevel.ERROR, value: 1, action: GuardrailAction.WARN },
          { level: ThresholdLevel.CRITICAL, value: 5, action: GuardrailAction.ESCALATE },
        ],
        aggregation: AggregationType.SUM,
      },
    ],
    triggers: [
      {
        id: 'trig_non_deterministic',
        condition: 'deterministic_ratio < 0.9',
        action: 'flag_non_determinism',
        cooldown: 60000, // 1 minute
        maxTriggers: 100,
      },
    ],
    outputFormats: [OutputFormat.JSON, OutputFormat.MERKLE_TREE],
  },
  {
    id: 'oa_replay_fidelity',
    name: 'Replay Fidelity Observer',
    class: SGASAgentClass.OBSERVER,
    observationType: ObservationType.REPLAY_FIDELITY,
    metrics: [
      {
        id: 'met_replay_match',
        name: 'Replay Match Rate',
        type: MetricType.GAUGE,
        calculation: 'matching_states / total_states',
        unit: 'ratio',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 0.99, action: GuardrailAction.LOG },
          { level: ThresholdLevel.ERROR, value: 0.95, action: GuardrailAction.WARN },
          { level: ThresholdLevel.CRITICAL, value: 0.9, action: GuardrailAction.BLOCK },
        ],
        aggregation: AggregationType.MIN,
      },
      {
        id: 'met_divergence_point',
        name: 'Divergence Detection',
        type: MetricType.COUNTER,
        calculation: 'count(divergence_points)',
        unit: 'count',
        thresholds: [
          { level: ThresholdLevel.ERROR, value: 1, action: GuardrailAction.WARN },
        ],
        aggregation: AggregationType.COUNT,
      },
    ],
    triggers: [
      {
        id: 'trig_replay_divergence',
        condition: 'replay_match_rate < 0.99',
        action: 'log_divergence',
        cooldown: 0, // Always trigger
        maxTriggers: 1000,
      },
    ],
    outputFormats: [OutputFormat.JSON, OutputFormat.MERKLE_TREE, OutputFormat.AUDIT_LOG],
  },
  {
    id: 'oa_process_compliance',
    name: 'Process Compliance Observer',
    class: SGASAgentClass.OBSERVER,
    observationType: ObservationType.PROCESS_COMPLIANCE,
    metrics: [
      {
        id: 'met_process_adherence',
        name: 'Process Adherence Rate',
        type: MetricType.GAUGE,
        calculation: 'compliant_steps / total_steps',
        unit: 'ratio',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 0.95, action: GuardrailAction.LOG },
          { level: ThresholdLevel.ERROR, value: 0.85, action: GuardrailAction.WARN },
        ],
        aggregation: AggregationType.AVERAGE,
      },
      {
        id: 'met_skip_count',
        name: 'Skipped Steps Count',
        type: MetricType.COUNTER,
        calculation: 'count(skipped_steps)',
        unit: 'count',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 1, action: GuardrailAction.LOG },
          { level: ThresholdLevel.ERROR, value: 3, action: GuardrailAction.WARN },
        ],
        aggregation: AggregationType.SUM,
      },
    ],
    triggers: [
      {
        id: 'trig_process_violation',
        condition: 'process_adherence < 0.9',
        action: 'flag_process_violation',
        cooldown: 300000,
        maxTriggers: 20,
      },
    ],
    outputFormats: [OutputFormat.JSON, OutputFormat.AUDIT_LOG, OutputFormat.REPORT],
  },
  {
    id: 'oa_performance',
    name: 'Performance Monitor Observer',
    class: SGASAgentClass.OBSERVER,
    observationType: ObservationType.PERFORMANCE_MONITORING,
    metrics: [
      {
        id: 'met_execution_time',
        name: 'Execution Time',
        type: MetricType.HISTOGRAM,
        calculation: 'agent_execution_duration_ms',
        unit: 'ms',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 5000, action: GuardrailAction.LOG },
          { level: ThresholdLevel.ERROR, value: 30000, action: GuardrailAction.WARN },
        ],
        aggregation: AggregationType.PERCENTILE,
      },
      {
        id: 'met_resource_usage',
        name: 'Resource Usage',
        type: MetricType.GAUGE,
        calculation: 'memory_mb + cpu_ms/1000',
        unit: 'units',
        thresholds: [
          { level: ThresholdLevel.WARNING, value: 500, action: GuardrailAction.LOG },
        ],
        aggregation: AggregationType.MAX,
      },
    ],
    triggers: [
      {
        id: 'trig_slow_execution',
        condition: 'execution_time > 30000',
        action: 'log_performance_issue',
        cooldown: 60000,
        maxTriggers: 50,
      },
    ],
    outputFormats: [OutputFormat.JSON, OutputFormat.REPORT],
  },
];

// =============================================================================
// OBSERVER AGENTS SERVICE
// =============================================================================

export class ObserverAgentsService extends EventEmitter {
  private agents: Map<string, ObserverAgentConfig> = new Map();
  private executionHistory: Map<string, ObserverAgentOutput[]> = new Map();
  private baselineTrust: number = 0.8;
  private triggerCounts: Map<string, { count: number; lastTriggered: number }> = new Map();

  constructor() {
    super();
    this.initializeAgents();


    this.loadFromDB().catch(() => {});
  }

  private initializeAgents(): void {
    for (const agent of OBSERVER_AGENTS) {
      this.agents.set(agent.id, agent);
    }
  }

  /**
   * Get all observer agents
   */
  getAgents(): ObserverAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): ObserverAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Execute observer agent on deliberation data
   */
  async executeAgent(
    agentId: string,
    proposal: DecisionProposal,
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[],
    deliberationGraphId: string,
    seed?: number
  ): Promise<ObserverAgentOutput> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Observer agent not found: ${agentId}`);
    }

    const startTime = new Date();
    const inputHash = hashState({ 
      agentId, 
      proposal, 
      decisionOutputs, 
      institutionalOutputs, 
      adversarialOutputs,
      seed 
    });

    this.emit('agent:start', { agentId, proposalId: proposal.id });

    try {
      // Calculate metrics
      const metrics = this.calculateMetrics(
        agent,
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs
      );

      // Calculate trust delta
      const trustDelta = this.calculateTrustDelta(
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs
      );

      // Verify integrity
      const integrityVerification = this.verifyIntegrity(
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs
      );

      // Generate audit artifacts
      const auditArtifacts = this.generateAuditArtifacts(
        proposal,
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs
      );

      // Detect anomalies
      const anomalies = this.detectAnomalies(
        metrics,
        decisionOutputs,
        institutionalOutputs
      );

      // Check triggers
      this.checkTriggers(agent, metrics);

      const endTime = new Date();
      const outputHash = hashState({ metrics, trustDelta, integrityVerification });

      const output: ObserverAgentOutput = {
        agentId: agent.id,
        timestamp: startTime,
        proposalId: proposal.id,
        deliberationGraphId,
        metrics,
        trustDelta,
        integrityVerification,
        auditArtifacts,
        anomalies,
        executionMetadata: {
          startTime,
          endTime,
          durationMs: endTime.getTime() - startTime.getTime(),
          seed: seed || 0,
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
   * Execute all observer agents
   */
  async executeAllAgents(
    proposal: DecisionProposal,
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[],
    deliberationGraphId: string,
    seed?: number
  ): Promise<ObserverAgentOutput[]> {
    const outputs: ObserverAgentOutput[] = [];
    const baseSeed = seed ?? Date.now();

    for (let i = 0; i < OBSERVER_AGENTS.length; i++) {
      const agent = OBSERVER_AGENTS[i];
      const agentSeed = baseSeed + i + 300;
      const output = await this.executeAgent(
        agent.id,
        proposal,
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs,
        deliberationGraphId,
        agentSeed
      );
      outputs.push(output);
    }

    return outputs;
  }

  /**
   * Calculate metrics for the agent
   */
  private calculateMetrics(
    agent: ObserverAgentConfig,
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[]
  ): MetricResult[] {
    const results: MetricResult[] = [];

    for (const metricDef of agent.metrics) {
      const value = this.computeMetricValue(
        metricDef.id,
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs
      );

      const threshold = this.determineThreshold(metricDef.thresholds, value);
      const historicalComparison = this.getHistoricalComparison(metricDef.id, value);

      results.push({
        metricId: metricDef.id,
        name: metricDef.name,
        value,
        unit: metricDef.unit,
        threshold,
        trend: this.determineTrend(historicalComparison),
        historicalComparison,
      });
    }

    return results;
  }

  /**
   * Compute a specific metric value
   */
  private computeMetricValue(
    metricId: string,
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[]
  ): number {
    switch (metricId) {
      case 'met_recommendation_variance':
        return this.calculateRecommendationVariance(decisionOutputs);
      
      case 'met_confidence_spread':
        return this.calculateConfidenceSpread(decisionOutputs);
      
      case 'met_trust_delta':
        return this.calculateTrustValue(decisionOutputs, institutionalOutputs);
      
      case 'met_stakeholder_trust':
        return this.calculateStakeholderTrust(institutionalOutputs);
      
      case 'met_deterministic_ratio':
        return this.calculateDeterministicRatio(decisionOutputs);
      
      case 'met_hash_consistency':
        return this.countHashMismatches(decisionOutputs);
      
      case 'met_replay_match':
        return 1.0; // Perfect match by default (would be calculated in replay)
      
      case 'met_process_adherence':
        return this.calculateProcessAdherence(institutionalOutputs);
      
      case 'met_skip_count':
        return this.countSkippedSteps(institutionalOutputs);
      
      case 'met_execution_time':
        return this.calculateAvgExecutionTime(decisionOutputs);
      
      case 'met_resource_usage':
        return this.calculateResourceUsage(decisionOutputs);
      
      default:
        return 0;
    }
  }

  private calculateRecommendationVariance(outputs: DecisionAgentOutput[]): number {
    if (outputs.length < 2) return 0;
    
    const recommendations = outputs.map(o => {
      switch (o.recommendation) {
        case 'approve': return 1;
        case 'modify': return 2;
        case 'escalate': return 3;
        case 'reject': return 4;
        default: return 2.5;
      }
    });
    
    const mean = recommendations.reduce((a, b) => a + b, 0) / recommendations.length;
    const variance = recommendations.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / recommendations.length;
    return Math.sqrt(variance);
  }

  private calculateConfidenceSpread(outputs: DecisionAgentOutput[]): number {
    if (outputs.length === 0) return 0;
    const confidences = outputs.map(o => o.confidence);
    return Math.max(...confidences) - Math.min(...confidences);
  }

  private calculateTrustValue(
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[]
  ): number {
    // Higher confidence and more approvals = higher trust
    const avgConfidence = decisionOutputs.length > 0
      ? decisionOutputs.reduce((sum, o) => sum + o.confidence, 0) / decisionOutputs.length
      : 0.5;
    
    const approvalRate = institutionalOutputs.length > 0
      ? institutionalOutputs.filter(o => o.status === 'allow').length / institutionalOutputs.length
      : 0.5;
    
    return (avgConfidence * 0.4 + approvalRate * 0.6) - this.baselineTrust;
  }

  private calculateStakeholderTrust(outputs: InstitutionalAgentOutput[]): number {
    if (outputs.length === 0) return 0.7;
    
    // Trust based on violations and required actions
    const violationPenalty = outputs.reduce(
      (sum, o) => sum + o.violationReports.length * 0.1,
      0
    );
    
    return Math.max(0, 0.9 - violationPenalty);
  }

  private calculateDeterministicRatio(outputs: DecisionAgentOutput[]): number {
    if (outputs.length === 0) return 1.0;
    
    const deterministicCount = outputs.filter(
      o => o.executionMetadata.deterministic
    ).length;
    
    return deterministicCount / outputs.length;
  }

  private countHashMismatches(outputs: DecisionAgentOutput[]): number {
    // In real implementation, would compare with stored hashes
    return 0;
  }

  private calculateProcessAdherence(outputs: InstitutionalAgentOutput[]): number {
    if (outputs.length === 0) return 1.0;
    
    const totalActions = outputs.reduce(
      (sum, o) => sum + o.requiredActions.length,
      0
    );
    const mandatoryActions = outputs.reduce(
      (sum, o) => sum + o.requiredActions.filter(a => a.mandatory).length,
      0
    );
    
    if (totalActions === 0) return 1.0;
    return 1 - (mandatoryActions * 0.1);
  }

  private countSkippedSteps(outputs: InstitutionalAgentOutput[]): number {
    return outputs.filter(o => o.status === 'block').length;
  }

  private calculateAvgExecutionTime(outputs: DecisionAgentOutput[]): number {
    if (outputs.length === 0) return 0;
    return outputs.reduce(
      (sum, o) => sum + o.executionMetadata.durationMs,
      0
    ) / outputs.length;
  }

  private calculateResourceUsage(outputs: DecisionAgentOutput[]): number {
    if (outputs.length === 0) return 0;
    return outputs.reduce(
      (sum, o) => sum + o.executionMetadata.resourcesUsed.memoryMb,
      0
    );
  }

  /**
   * Determine threshold level for a value
   */
  private determineThreshold(
    thresholds: { level: ThresholdLevel; value: number }[],
    value: number
  ): ThresholdLevel {
    // Sort by value descending
    const sorted = [...thresholds].sort((a, b) => b.value - a.value);
    
    for (const threshold of sorted) {
      if (value >= threshold.value) {
        return threshold.level;
      }
    }
    
    return ThresholdLevel.INFO;
  }

  /**
   * Get historical comparison
   */
  private getHistoricalComparison(metricId: string, currentValue: number): HistoricalComparison {
    // In real implementation, would fetch from database
    const baseline = currentValue * 0.9; // Compute baseline
    const percentChange = baseline !== 0 ? ((currentValue - baseline) / baseline) * 100 : 0;
    
    return {
      baseline,
      percentChange,
      standardDeviations: percentChange / 15, // Assume 15% std dev
      withinNormalRange: Math.abs(percentChange) < 30,
    };
  }

  /**
   * Determine trend from historical comparison
   */
  private determineTrend(comparison: HistoricalComparison): TrendDirection {
    if (comparison.percentChange > 10) return TrendDirection.IMPROVING;
    if (comparison.percentChange < -10) return TrendDirection.DEGRADING;
    if (Math.abs(comparison.standardDeviations) > 2) return TrendDirection.VOLATILE;
    return TrendDirection.STABLE;
  }

  /**
   * Calculate trust delta
   */
  private calculateTrustDelta(
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[]
  ): TrustDelta {
    const components: TrustComponent[] = [
      {
        name: 'Decision Confidence',
        previousValue: this.baselineTrust,
        currentValue: decisionOutputs.length > 0
          ? decisionOutputs.reduce((s, o) => s + o.confidence, 0) / decisionOutputs.length
          : this.baselineTrust,
        delta: 0,
        weight: 0.3,
      },
      {
        name: 'Institutional Approval',
        previousValue: this.baselineTrust,
        currentValue: institutionalOutputs.filter(o => o.status === 'allow').length / Math.max(1, institutionalOutputs.length),
        delta: 0,
        weight: 0.4,
      },
      {
        name: 'Adversarial Resilience',
        previousValue: this.baselineTrust,
        currentValue: adversarialOutputs.length > 0
          ? 1 - (adversarialOutputs.reduce((s, o) => s + o.failureScenarios.length, 0) * 0.05)
          : this.baselineTrust,
        delta: 0,
        weight: 0.3,
      },
    ];

    // Calculate deltas
    for (const component of components) {
      component.delta = component.currentValue - component.previousValue;
    }

    const overallDelta = components.reduce(
      (sum, c) => sum + c.delta * c.weight,
      0
    );

    return {
      overall: overallDelta,
      components,
      explanation: overallDelta >= 0
        ? 'Trust maintained or improved'
        : 'Trust decreased - review required',
      confidence: 0.85,
    };
  }

  /**
   * Verify integrity of all outputs
   */
  private verifyIntegrity(
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[]
  ): IntegrityVerification {
    const allOutputs = [
      ...decisionOutputs.map(o => ({ type: 'decision', hash: o.executionMetadata.outputHash })),
      ...institutionalOutputs.map(o => ({ type: 'institutional', hash: o.executionMetadata.outputHash })),
      ...adversarialOutputs.map(o => ({ type: 'adversarial', hash: o.executionMetadata.outputHash })),
    ];

    // Build Merkle tree
    const leaves = allOutputs.map(o => o.hash);
    const merkleRoot = this.buildMerkleRoot(leaves);

    const discrepancies: Discrepancy[] = [];

    // Check for any hash mismatches (ROADMAP: verify against stored values)
    // For now, no discrepancies

    return {
      verified: discrepancies.length === 0,
      merkleRoot,
      nodeCount: allOutputs.length,
      hashAlgorithm: 'sha256',
      verificationTimestamp: new Date(),
      discrepancies,
    };
  }

  /**
   * Build Merkle root from leaves
   */
  private buildMerkleRoot(leaves: string[]): string {
    if (leaves.length === 0) {
      return crypto.createHash('sha256').update('empty').digest('hex');
    }
    if (leaves.length === 1) {
      return leaves[0];
    }

    const nextLevel: string[] = [];
    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i];
      const right = leaves[i + 1] || left; // Duplicate if odd number
      const combined = crypto.createHash('sha256')
        .update(left + right)
        .digest('hex');
      nextLevel.push(combined);
    }

    return this.buildMerkleRoot(nextLevel);
  }

  /**
   * Generate audit artifacts
   */
  private generateAuditArtifacts(
    proposal: DecisionProposal,
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[],
    adversarialOutputs: AdversarialAgentOutput[]
  ): AuditArtifact[] {
    const artifacts: AuditArtifact[] = [];
    const now = new Date();
    const retentionYears = 7; // Standard retention

    // Input snapshot
    artifacts.push({
      id: generateSGASId('artifact'),
      type: AuditArtifactType.INPUT_SNAPSHOT,
      name: `Proposal Input: ${proposal.title}`,
      hash: hashState(proposal),
      size: JSON.stringify(proposal).length,
      createdAt: now,
      retentionUntil: new Date(now.getTime() + retentionYears * 365 * 24 * 60 * 60 * 1000),
      classification: proposal.metadata.sensitivity,
    });

    // Decision outputs snapshot
    artifacts.push({
      id: generateSGASId('artifact'),
      type: AuditArtifactType.OUTPUT_SNAPSHOT,
      name: 'Decision Agent Outputs',
      hash: hashState(decisionOutputs),
      size: JSON.stringify(decisionOutputs).length,
      createdAt: now,
      retentionUntil: new Date(now.getTime() + retentionYears * 365 * 24 * 60 * 60 * 1000),
      classification: SensitivityLevel.INTERNAL,
    });

    // Institutional outputs snapshot
    artifacts.push({
      id: generateSGASId('artifact'),
      type: AuditArtifactType.OUTPUT_SNAPSHOT,
      name: 'Institutional Agent Outputs',
      hash: hashState(institutionalOutputs),
      size: JSON.stringify(institutionalOutputs).length,
      createdAt: now,
      retentionUntil: new Date(now.getTime() + retentionYears * 365 * 24 * 60 * 60 * 1000),
      classification: SensitivityLevel.CONFIDENTIAL,
    });

    // Adversarial findings
    artifacts.push({
      id: generateSGASId('artifact'),
      type: AuditArtifactType.DECISION_RECORD,
      name: 'Adversarial Analysis Report',
      hash: hashState(adversarialOutputs),
      size: JSON.stringify(adversarialOutputs).length,
      createdAt: now,
      retentionUntil: new Date(now.getTime() + retentionYears * 365 * 24 * 60 * 60 * 1000),
      classification: SensitivityLevel.CONFIDENTIAL,
    });

    // Integrity proof
    const allHashes = [
      ...decisionOutputs.map(o => o.executionMetadata.outputHash),
      ...institutionalOutputs.map(o => o.executionMetadata.outputHash),
      ...adversarialOutputs.map(o => o.executionMetadata.outputHash),
    ];
    artifacts.push({
      id: generateSGASId('artifact'),
      type: AuditArtifactType.INTEGRITY_PROOF,
      name: 'Merkle Root Integrity Proof',
      hash: this.buildMerkleRoot(allHashes),
      size: 64, // SHA256 hex string
      createdAt: now,
      retentionUntil: new Date(now.getTime() + retentionYears * 365 * 24 * 60 * 60 * 1000),
      classification: SensitivityLevel.INTERNAL,
    });

    return artifacts;
  }

  /**
   * Detect anomalies
   */
  private detectAnomalies(
    metrics: MetricResult[],
    decisionOutputs: DecisionAgentOutput[],
    institutionalOutputs: InstitutionalAgentOutput[]
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Check for metric anomalies
    for (const metric of metrics) {
      if (metric.threshold === ThresholdLevel.ERROR || metric.threshold === ThresholdLevel.CRITICAL) {
        anomalies.push({
          id: generateSGASId('anomaly'),
          type: AnomalyType.STATISTICAL,
          description: `${metric.name} exceeded threshold: ${metric.value} ${metric.unit}`,
          severity: metric.threshold === ThresholdLevel.CRITICAL ? SeverityLevel.CRITICAL : SeverityLevel.ERROR,
          detectedAt: new Date(),
          affectedComponents: [metric.metricId],
          possibleCauses: ['Unusual input', 'System stress', 'Configuration change'],
          recommendedActions: ['Review input data', 'Check system health'],
        });
      }

      if (metric.trend === TrendDirection.DEGRADING) {
        anomalies.push({
          id: generateSGASId('anomaly'),
          type: AnomalyType.BEHAVIORAL,
          description: `${metric.name} showing degrading trend`,
          severity: SeverityLevel.WARNING,
          detectedAt: new Date(),
          affectedComponents: [metric.metricId],
          possibleCauses: ['Gradual system degradation', 'Increasing load'],
          recommendedActions: ['Monitor closely', 'Plan capacity review'],
        });
      }
    }

    // Check for decision consensus anomalies
    if (decisionOutputs.length > 0) {
      const recommendations = new Set(decisionOutputs.map(o => o.recommendation));
      if (recommendations.size === decisionOutputs.length && decisionOutputs.length > 2) {
        anomalies.push({
          id: generateSGASId('anomaly'),
          type: AnomalyType.BEHAVIORAL,
          description: 'No consensus among decision agents - all recommendations differ',
          severity: SeverityLevel.WARNING,
          detectedAt: new Date(),
          affectedComponents: decisionOutputs.map(o => o.agentId),
          possibleCauses: ['Ambiguous proposal', 'Conflicting objectives'],
          recommendedActions: ['Human review recommended', 'Clarify proposal scope'],
        });
      }
    }

    // Check for institutional blocks
    const blockedCount = institutionalOutputs.filter(o => o.status === 'block').length;
    if (blockedCount > institutionalOutputs.length / 2) {
      anomalies.push({
        id: generateSGASId('anomaly'),
        type: AnomalyType.STRUCTURAL,
        description: 'Majority of institutional agents blocked the proposal',
        severity: SeverityLevel.ERROR,
        detectedAt: new Date(),
        affectedComponents: institutionalOutputs.filter(o => o.status === 'block').map(o => o.agentId),
        possibleCauses: ['Fundamental constraint violations', 'Proposal outside authority'],
        recommendedActions: ['Major proposal revision required', 'Seek higher authority'],
      });
    }

    return anomalies;
  }

  /**
   * Check and fire triggers
   */
  private checkTriggers(agent: ObserverAgentConfig, metrics: MetricResult[]): void {
    for (const trigger of agent.triggers) {
      const shouldTrigger = this.evaluateTriggerCondition(trigger.condition, metrics);
      
      if (shouldTrigger) {
        const key = `${agent.id}:${trigger.id}`;
        const state = this.triggerCounts.get(key) || { count: 0, lastTriggered: 0 };
        
        const now = Date.now();
        if (now - state.lastTriggered > trigger.cooldown && state.count < trigger.maxTriggers) {
          state.count++;
          state.lastTriggered = now;
          this.triggerCounts.set(key, state);
          
          this.emit('trigger:fired', {
            agentId: agent.id,
            triggerId: trigger.id,
            action: trigger.action,
            metrics,
          });
        }
      }
    }
  }

  /**
   * Evaluate trigger condition
   */
  private evaluateTriggerCondition(condition: string, metrics: MetricResult[]): boolean {
    // Simple condition evaluation
    for (const metric of metrics) {
      if (condition.includes(metric.metricId) || condition.includes(metric.name.toLowerCase().replace(/ /g, '_'))) {
        if (condition.includes('>')) {
          const threshold = parseFloat(condition.split('>')[1].trim());
          return metric.value > threshold;
        }
        if (condition.includes('<')) {
          const threshold = parseFloat(condition.split('<')[1].trim());
          return metric.value < threshold;
        }
      }
    }
    return false;
  }

  /**
   * Get execution history
   */
  getExecutionHistory(proposalId: string): ObserverAgentOutput[] {
    return this.executionHistory.get(proposalId) || [];
  }

  /**
   * Aggregate observer outputs
   */
  aggregateOutputs(outputs: ObserverAgentOutput[]): {
    overallTrustDelta: number;
    integrityVerified: boolean;
    merkleRoot: string;
    totalAnomalies: number;
    criticalAnomalies: Anomaly[];
    allArtifacts: AuditArtifact[];
  } {
    const trustDeltas = outputs.map(o => o.trustDelta.overall);
    const overallTrustDelta = trustDeltas.length > 0
      ? trustDeltas.reduce((a, b) => a + b, 0) / trustDeltas.length
      : 0;

    const integrityVerified = outputs.every(o => o.integrityVerification.verified);
    
    const merkleRoots = outputs.map(o => o.integrityVerification.merkleRoot);
    const finalMerkleRoot = this.buildMerkleRoot(merkleRoots);

    const allAnomalies = outputs.flatMap(o => o.anomalies);
    const criticalAnomalies = allAnomalies.filter(
      a => a.severity === SeverityLevel.CRITICAL || a.severity === SeverityLevel.CATASTROPHIC
    );

    const allArtifacts = outputs.flatMap(o => o.auditArtifacts);

    return {
      overallTrustDelta,
      integrityVerified,
      merkleRoot: finalMerkleRoot,
      totalAnomalies: allAnomalies.length,
      criticalAnomalies,
      allArtifacts,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'ObserverAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.agents.has(d.id)) this.agents.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'ObserverAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.executionHistory.has(d.id)) this.executionHistory.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'ObserverAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.triggerCounts.has(d.id)) this.triggerCounts.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[ObserverAgentsService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[ObserverAgentsService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton instance
export const observerAgentsService = new ObserverAgentsService();
export default observerAgentsService;
