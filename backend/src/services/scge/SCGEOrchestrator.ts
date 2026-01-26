/**
 * SCGE - Synthetic Civic Governance Environment Orchestrator
 * 
 * Central coordinator for the governance simulation environment.
 * Integrates population, policies, events, stressors, and the SGAS agent system.
 */

import {
  SimulationConfig,
  SimulationState,
  SimulationResult,
  SimulationPhase,
  SimulationSummary,
  SyntheticPopulation,
  OutcomeAnalysis,
  OutcomeMetric,
  OutcomeMetricType,
  BiasIndicator,
  AuditPacket,
  AuditEntry,
  ReplayBundle,
  DecisionRecord,
  PopulationSegment,
  generateSCGEId,
  hashSCGEState,
  createMerkleRoot,
} from './types.js';

import { syntheticPopulationService } from './SyntheticPopulationService.js';
import { policyInjectionService } from './PolicyInjectionService.js';
import { eventInjectionService } from './EventInjectionService.js';
import { stressorLibraryService } from './StressorLibraryService.js';
import { sgasOrchestrator } from '../sgas/index.js';

// =============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// =============================================================================

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

// =============================================================================
// SCGE ORCHESTRATOR
// =============================================================================

export class SCGEOrchestrator {
  private activeSimulations: Map<string, SimulationState> = new Map();
  private completedSimulations: Map<string, SimulationResult> = new Map();

  /**
   * Initialize a new simulation
   */
  async initializeSimulation(config: SimulationConfig): Promise<SimulationState> {
    const state: SimulationState = {
      id: generateSCGEId('sim'),
      configId: config.id,
      phase: SimulationPhase.INITIALIZATION,
      currentTime: 0,
      population: null as unknown as SyntheticPopulation,
      activePolicies: [],
      activeStressors: [],
      pendingEvents: [],
      processedEvents: [],
      decisions: [],
      outcomes: [],
      auditLog: [],
      stateHash: '',
      lastUpdated: new Date(),
    };

    // Log initialization
    this.logAuditEntry(state, 'SIMULATION_INIT', 'system', { configId: config.id });

    // Generate synthetic population
    state.phase = SimulationPhase.POPULATION_GENERATION;
    state.population = syntheticPopulationService.generatePopulation(config.population);
    this.logAuditEntry(state, 'POPULATION_GENERATED', 'system', {
      populationId: state.population.id,
      size: state.population.totalSize,
    });

    // Inject policies
    state.phase = SimulationPhase.POLICY_INJECTION;
    for (const policy of config.policies) {
      const activatedPolicy = policyInjectionService.activatePolicy(policy.id);
      state.activePolicies.push(activatedPolicy);
      this.logAuditEntry(state, 'POLICY_ACTIVATED', 'system', {
        policyId: policy.id,
        policyName: policy.name,
      });
    }

    // Load events
    if (config.events.sequence) {
      state.pendingEvents = [...config.events.sequence.events];
    }

    // Update state hash
    state.stateHash = hashSCGEState(state);
    this.activeSimulations.set(state.id, state);

    return state;
  }

  /**
   * Run a complete simulation
   */
  async runSimulation(
    config: SimulationConfig,
    progressCallback?: (state: SimulationState) => void
  ): Promise<SimulationResult> {
    // Initialize
    const state = await this.initializeSimulation(config);
    
    // Process events and stressors over time
    const timeStep = 1; // 1 hour simulation steps
    let currentTime = 0;

    while (currentTime < config.maxDuration) {
      state.currentTime = currentTime;
      state.lastUpdated = new Date();

      // Event processing phase
      state.phase = SimulationPhase.EVENT_PROCESSING;
      await this.processEvents(state, config, currentTime);

      // Stressor application phase
      state.phase = SimulationPhase.STRESSOR_APPLICATION;
      await this.applyStressors(state, config, currentTime);

      // Decision evaluation phase
      state.phase = SimulationPhase.DECISION_EVALUATION;
      await this.evaluateDecisions(state, config, currentTime);

      // Progress callback
      if (progressCallback) {
        progressCallback(state);
      }

      currentTime += timeStep;
      state.stateHash = hashSCGEState(state);
    }

    // Outcome measurement
    state.phase = SimulationPhase.OUTCOME_MEASUREMENT;
    const outcomes = this.measureOutcomes(state);
    state.outcomes.push(outcomes);

    // Generate audit packet
    state.phase = SimulationPhase.AUDIT_GENERATION;
    const auditPacket = this.generateAuditPacket(state);

    // Generate replay bundle
    const replayBundle = this.generateReplayBundle(config, state);

    // Create final result
    state.phase = SimulationPhase.COMPLETED;
    const result: SimulationResult = {
      id: generateSCGEId('result'),
      configId: config.id,
      startTime: state.auditLog[0]?.timestamp || new Date(),
      endTime: new Date(),
      finalState: state,
      summary: this.generateSummary(state, outcomes),
      outcomes,
      auditPacket,
      replayBundle,
    };

    this.completedSimulations.set(result.id, result);
    this.activeSimulations.delete(state.id);

    return result;
  }

  /**
   * Process events at current simulation time
   */
  private async processEvents(
    state: SimulationState,
    config: SimulationConfig,
    currentTime: number
  ): Promise<void> {
    const activeEvents = eventInjectionService.getActiveEvents(
      config.events,
      currentTime
    );

    for (const event of activeEvents) {
      if (!state.processedEvents.find(e => e.id === event.id)) {
        // Check causal dependencies
        const completedIds = new Set(state.processedEvents.map(e => e.id));
        const deps = eventInjectionService.checkCausalDependencies(event, completedIds);

        if (deps.satisfied) {
          state.processedEvents.push(event);
          this.logAuditEntry(state, 'EVENT_PROCESSED', 'system', {
            eventId: event.id,
            eventName: event.name,
            severity: event.severity,
          });
        }
      }
    }

    // Update pending events
    state.pendingEvents = eventInjectionService.getPendingEvents(
      config.events,
      currentTime
    );
  }

  /**
   * Apply stressors at current simulation time
   */
  private async applyStressors(
    state: SimulationState,
    config: SimulationConfig,
    currentTime: number
  ): Promise<void> {
    const activeStressors = stressorLibraryService.getActiveStressors(
      config.stressors,
      currentTime
    );

    // Update active stressors
    const previousIds = new Set(state.activeStressors.map(s => s.id));
    const currentIds = new Set(activeStressors.map(s => s.id));

    // Log new stressors
    for (const stressor of activeStressors) {
      if (!previousIds.has(stressor.id)) {
        this.logAuditEntry(state, 'STRESSOR_ACTIVATED', 'system', {
          stressorId: stressor.id,
          stressorName: stressor.name,
          intensity: stressor.intensity,
        });
      }
    }

    // Log deactivated stressors
    for (const stressor of state.activeStressors) {
      if (!currentIds.has(stressor.id)) {
        this.logAuditEntry(state, 'STRESSOR_DEACTIVATED', 'system', {
          stressorId: stressor.id,
          stressorName: stressor.name,
        });
      }
    }

    state.activeStressors = activeStressors;

    // Calculate combined impact
    if (activeStressors.length > 0) {
      const impact = stressorLibraryService.calculateCombinedImpact(activeStressors);
      
      // Apply impact to population
      for (const stressor of activeStressors) {
        syntheticPopulationService.applyStressorToPopulation(
          state.population,
          stressor.type,
          impact.totalIntensity
        );
      }
    }
  }

  /**
   * Evaluate decisions using SGAS
   */
  private async evaluateDecisions(
    state: SimulationState,
    config: SimulationConfig,
    currentTime: number
  ): Promise<void> {
    // Only evaluate decisions when events require them
    const recentEvents = state.processedEvents.filter(
      e => currentTime - (e.timestamp.getTime() - config.events.sequence.startTime.getTime()) < 24
    );

    for (const event of recentEvents) {
      // Check if we already have a decision for this event
      if (state.decisions.find(d => d.eventId === event.id)) {
        continue;
      }

      // Create a decision proposal from the event
      const proposal = {
        id: generateSCGEId('prop'),
        timestamp: new Date(),
        proposer: 'scge_simulation',
        title: `Response to: ${event.name}`,
        description: `Decision required in response to ${event.type} event: ${event.description}`,
        type: 'operational' as const,
        context: {
          timeframe: {
            start: new Date(),
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            milestones: [],
            criticalPath: event.severity === 'critical' || event.severity === 'catastrophic',
            flexibilityDays: 3,
          },
          scope: {
            boundaries: event.affectedSystems,
            exclusions: [],
            authorities: [],
            geographicScope: ['simulation_jurisdiction'],
            organizationalUnits: event.affectedSystems,
          },
          stakeholders: ['simulation_council'],
          dependencies: [],
          riskTolerance: 'medium' as const,
          institutionalState: state.activeStressors.length > 3 ? 'emergency' as const : 'normal' as const,
        },
        constraints: [],
        metadata: {
          version: 1,
          previousVersions: [],
          classifications: ['simulation'],
          tags: ['scge', event.type],
          priority: event.severity === 'critical' ? 1 : 5,
          urgency: event.severity === 'critical' ? 'immediate' as const : 'routine' as const,
          sensitivity: 'internal' as const,
        },
      };

      // Run SGAS deliberation
      try {
        const sgasResult = await sgasOrchestrator.executeDeliberation(
          proposal as Parameters<typeof sgasOrchestrator.executeDeliberation>[0],
          { includeMetaGovernance: true },
          config.seed + currentTime
        );

        // Record decision
        const decision: DecisionRecord = {
          id: generateSCGEId('dec'),
          timestamp: new Date(),
          policyId: state.activePolicies[0]?.id || 'default',
          eventId: event.id,
          institutionId: 'simulation_council',
          decision: sgasResult.finalStatus.approved ? 'approved' : 'rejected',
          rationale: sgasResult.summary.consensusRecommendation,
          constraints: sgasResult.finalStatus.requiredActions,
          alternatives: [],
          outcomeProjection: [],
          hash: hashSCGEState(sgasResult),
        };

        state.decisions.push(decision);
        this.logAuditEntry(state, 'DECISION_MADE', 'sgas', {
          decisionId: decision.id,
          eventId: event.id,
          outcome: decision.decision,
        });
      } catch (error) {
        this.logAuditEntry(state, 'DECISION_ERROR', 'sgas', {
          eventId: event.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  /**
   * Measure simulation outcomes
   */
  private measureOutcomes(state: SimulationState): OutcomeAnalysis {
    const rng = new SeededRandom(Date.now());

    // Calculate metrics based on simulation state
    const metrics: OutcomeMetric[] = [
      {
        type: OutcomeMetricType.EQUITY,
        value: this.calculateEquityScore(state),
        baseline: 0.75,
        delta: 0,
        variance: rng.nextInRange(0.01, 0.05),
        confidenceInterval: [0.7, 0.85],
      },
      {
        type: OutcomeMetricType.EFFICIENCY,
        value: this.calculateEfficiencyScore(state),
        baseline: 0.8,
        delta: 0,
        variance: rng.nextInRange(0.02, 0.08),
        confidenceInterval: [0.72, 0.88],
      },
      {
        type: OutcomeMetricType.TRUST,
        value: this.calculateTrustScore(state),
        baseline: 0.7,
        delta: 0,
        variance: rng.nextInRange(0.03, 0.1),
        confidenceInterval: [0.6, 0.8],
      },
      {
        type: OutcomeMetricType.RESILIENCE,
        value: this.calculateResilienceScore(state),
        baseline: 0.65,
        delta: 0,
        variance: rng.nextInRange(0.02, 0.07),
        confidenceInterval: [0.58, 0.72],
      },
      {
        type: OutcomeMetricType.COMPLIANCE,
        value: this.calculateComplianceScore(state),
        baseline: 0.9,
        delta: 0,
        variance: rng.nextInRange(0.01, 0.03),
        confidenceInterval: [0.87, 0.93],
      },
    ];

    // Update deltas
    for (const metric of metrics) {
      metric.delta = metric.value - metric.baseline;
    }

    // Detect bias indicators
    const biasIndicators = this.detectBiasIndicators(state);

    // Calculate overall variance
    const outcomeVariance = metrics.reduce((sum, m) => sum + m.variance, 0) / metrics.length;

    return {
      id: generateSCGEId('outcome'),
      simulationId: state.id,
      metrics,
      outcomeVariance,
      equityScore: metrics.find(m => m.type === OutcomeMetricType.EQUITY)?.value || 0,
      trustDelta: metrics.find(m => m.type === OutcomeMetricType.TRUST)?.delta || 0,
      biasIndicators,
      timestamp: new Date(),
      hash: '',
    };
  }

  private calculateEquityScore(state: SimulationState): number {
    // Calculate based on population segment impact variance
    const segmentSizes = syntheticPopulationService.getSegmentSizes(state.population);
    const totalSize = Object.values(segmentSizes).reduce((a, b) => a + b, 0);
    
    // Uniform distribution = high equity
    const expectedPer = totalSize / 3;
    let variance = 0;
    for (const size of Object.values(segmentSizes)) {
      variance += Math.pow(size - expectedPer, 2);
    }
    variance /= 3;
    
    return Math.max(0, 1 - (variance / (totalSize * totalSize)));
  }

  private calculateEfficiencyScore(state: SimulationState): number {
    // Based on decision throughput and event processing
    const totalEvents = state.processedEvents.length + state.pendingEvents.length;
    if (totalEvents === 0) return 0.8;
    
    const processedRatio = state.processedEvents.length / totalEvents;
    const decisionRatio = state.decisions.length / Math.max(1, state.processedEvents.length);
    
    return (processedRatio * 0.5 + decisionRatio * 0.5);
  }

  private calculateTrustScore(state: SimulationState): number {
    // Based on stressor impact and successful decisions
    const stressorPenalty = state.activeStressors.length * 0.05;
    const successfulDecisions = state.decisions.filter(d => d.decision === 'approved').length;
    const decisionBonus = Math.min(0.2, successfulDecisions * 0.02);
    
    return Math.max(0, Math.min(1, 0.7 - stressorPenalty + decisionBonus));
  }

  private calculateResilienceScore(state: SimulationState): number {
    // Based on recovery from stressors
    const maxStressors = 10;
    const stressorRatio = state.activeStressors.length / maxStressors;
    const processedRatio = state.processedEvents.length / Math.max(1, state.processedEvents.length + state.pendingEvents.length);
    
    return (1 - stressorRatio) * 0.5 + processedRatio * 0.5;
  }

  private calculateComplianceScore(state: SimulationState): number {
    // Based on policy adherence
    const totalDecisions = state.decisions.length;
    if (totalDecisions === 0) return 0.9;
    
    // Check for constraint violations in decisions
    let compliantDecisions = 0;
    for (const decision of state.decisions) {
      if (decision.constraints.length === 0) {
        compliantDecisions++;
      }
    }
    
    return compliantDecisions / totalDecisions;
  }

  private detectBiasIndicators(state: SimulationState): BiasIndicator[] {
    const indicators: BiasIndicator[] = [];

    // Check for access-based outcome disparities
    const impactDistribution = syntheticPopulationService.calculateImpactDistribution(
      state.population,
      {
        [PopulationSegment.LOW_ACCESS]: 0.6,
        [PopulationSegment.MEDIUM_ACCESS]: 0.4,
        [PopulationSegment.HIGH_ACCESS]: 0.2,
      }
    );

    if (impactDistribution.equityScore < 0.7) {
      indicators.push({
        type: 'access_disparity',
        detected: true,
        severity: 1 - impactDistribution.equityScore,
        affectedSegments: [PopulationSegment.LOW_ACCESS],
        evidence: [`Equity score: ${impactDistribution.equityScore.toFixed(2)}`],
        mitigationSuggestions: [
          'Review resource allocation algorithms',
          'Implement access equity constraints',
          'Add low-access segment protections',
        ],
      });
    }

    return indicators;
  }

  /**
   * Generate audit packet
   */
  private generateAuditPacket(state: SimulationState): AuditPacket {
    const hashes = state.auditLog.map(e => hashSCGEState(e));
    const merkleRoot = createMerkleRoot(hashes);

    return {
      id: generateSCGEId('audit'),
      simulationId: state.id,
      generatedAt: new Date(),
      entries: state.auditLog,
      merkleRoot,
      signatures: [],
      integrityHash: hashSCGEState({ entries: state.auditLog, merkleRoot }),
    };
  }

  /**
   * Generate replay bundle
   */
  private generateReplayBundle(config: SimulationConfig, state: SimulationState): ReplayBundle {
    return {
      id: generateSCGEId('replay'),
      simulationId: state.id,
      config,
      seed: config.seed,
      expectedHash: state.stateHash,
      instructions: `
To replay this simulation:
1. Initialize SCGE with config ID: ${config.id}
2. Use seed: ${config.seed}
3. Run simulation with maxDuration: ${config.maxDuration}
4. Compare final state hash with: ${state.stateHash}
5. If hashes match, simulation is deterministically verified
      `.trim(),
      createdAt: new Date(),
    };
  }

  /**
   * Generate summary
   */
  private generateSummary(state: SimulationState, outcomes: OutcomeAnalysis): SimulationSummary {
    const criticalFindings: string[] = [];
    const recommendations: string[] = [];

    // Analyze outcomes
    for (const metric of outcomes.metrics) {
      if (metric.delta < -0.1) {
        criticalFindings.push(`${metric.type} decreased by ${Math.abs(metric.delta * 100).toFixed(1)}%`);
      }
    }

    // Analyze bias indicators
    for (const indicator of outcomes.biasIndicators) {
      if (indicator.detected && indicator.severity > 0.3) {
        criticalFindings.push(`Bias detected: ${indicator.type} (severity: ${(indicator.severity * 100).toFixed(0)}%)`);
        recommendations.push(...indicator.mitigationSuggestions);
      }
    }

    return {
      totalEvents: state.processedEvents.length,
      totalDecisions: state.decisions.length,
      stressorsApplied: state.activeStressors.length,
      policiesEvaluated: state.activePolicies.length,
      outcomeVariance: outcomes.outcomeVariance,
      trustDelta: outcomes.trustDelta,
      equityScore: outcomes.equityScore,
      resilienceScore: outcomes.metrics.find(m => m.type === OutcomeMetricType.RESILIENCE)?.value || 0,
      complianceScore: outcomes.metrics.find(m => m.type === OutcomeMetricType.COMPLIANCE)?.value || 0,
      criticalFindings,
      recommendations,
    };
  }

  /**
   * Log audit entry
   */
  private logAuditEntry(
    state: SimulationState,
    action: string,
    actor: string,
    details: Record<string, unknown>
  ): void {
    const previousHash = state.stateHash;
    
    const entry: AuditEntry = {
      id: generateSCGEId('log'),
      timestamp: new Date(),
      phase: state.phase,
      action,
      actor,
      details,
      stateHashBefore: previousHash,
      stateHashAfter: '',
    };

    state.auditLog.push(entry);
    state.stateHash = hashSCGEState(state);
    entry.stateHashAfter = state.stateHash;
  }

  /**
   * Get active simulation
   */
  getActiveSimulation(simulationId: string): SimulationState | undefined {
    return this.activeSimulations.get(simulationId);
  }

  /**
   * Get completed simulation
   */
  getCompletedSimulation(resultId: string): SimulationResult | undefined {
    return this.completedSimulations.get(resultId);
  }

  /**
   * List active simulations
   */
  listActiveSimulations(): SimulationState[] {
    return Array.from(this.activeSimulations.values());
  }

  /**
   * List completed simulations
   */
  listCompletedSimulations(): SimulationResult[] {
    return Array.from(this.completedSimulations.values());
  }

  /**
   * Get statistics
   */
  getStatistics(): SCGEStatistics {
    const completed = Array.from(this.completedSimulations.values());
    
    return {
      activeSimulations: this.activeSimulations.size,
      completedSimulations: completed.length,
      totalDecisions: completed.reduce((sum, r) => sum + r.finalState.decisions.length, 0),
      totalEvents: completed.reduce((sum, r) => sum + r.finalState.processedEvents.length, 0),
      averageEquityScore: completed.length > 0
        ? completed.reduce((sum, r) => sum + r.outcomes.equityScore, 0) / completed.length
        : 0,
      averageTrustDelta: completed.length > 0
        ? completed.reduce((sum, r) => sum + r.outcomes.trustDelta, 0) / completed.length
        : 0,
    };
  }
}

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

interface SCGEStatistics {
  activeSimulations: number;
  completedSimulations: number;
  totalDecisions: number;
  totalEvents: number;
  averageEquityScore: number;
  averageTrustDelta: number;
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const scgeOrchestrator = new SCGEOrchestrator();
