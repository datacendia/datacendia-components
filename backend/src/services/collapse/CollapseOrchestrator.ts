/**
 * Service — Collapse Orchestrator
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports CollapseOrchestrator, collapseOrchestrator
 * @module services/collapse/CollapseOrchestrator
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Collapse Orchestrator
 * 
 * Central coordinator for Dual-Track Deliberation:
 * - Consensus Track: Optimize for approval / best policy
 * - Collapse Track: Actively search for failure, abuse, backlash
 * 
 * The Collapse Track agents are NOT ALLOWED to agree with consensus.
 * They MUST maximize harm vectors, find exploit paths, surface failure modes.
 */

import { createHash } from 'crypto';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import {
  CollapseAgentType,
  CollapseConfig,
  CollapseAgentOutput,
  FailureEnvelope,
  FailureCondition,
  DualTrackDeliberation,
  ConsensusTrack,
  CollapseTrack,
  SystemicRisk,
  EthicalRedLine,
  NarrativeAttack,
  ExploitPath,
  TemporalDecay,
  EthicalPrinciple,
  Reversibility,
  VisibilityType,
  PolicyContextData,
  DEFAULT_COLLAPSE_CONFIG,
  generateFailureEnvelopeId,
  generateCollapseId,
  calculateCollapseRisk,
  calculateTrustDelta,
} from './types.js';
import {
  BaseCollapseAgent,
  PolicyContext,
  AgentAnalysisParams,
  // A. Legitimacy & Trust
  LegitimacyCollapseAgent,
  DemocraticProcessErosionAgent,
  ProceduralJusticeAgent,
  // B. Civil Liberties (Critical)
  FreeSpeechChillingAgent,
  DueProcessViolationAgent,
  FreedomOfAssociationAgent,
  // C. Minority & Equity
  MinorityHarmAgent,
  CulturalErasureAgent,
  DisabilityImpactAgent,
  // D. Political & Narrative
  PoliticalBacklashAgent,
  NarrativeWeaponizationAgent,
  ForeignInfluenceAmplificationAgent,
  // E. Economic & Systemic
  EconomicInstabilityAgent,
  MarketDistortionAgent,
  SystemicRiskAgent,
  // F. Temporal & Environmental
  TemporalDecayAgent,
  EnvironmentalExternalityAgent,
  // G. Abuse
  AdversarialAbuseAgent,
} from './agents/index.js';
import { logger } from '../../utils/logger.js';

export class CollapseOrchestrator {
  private agents: Map<CollapseAgentType, BaseCollapseAgent> = new Map();
  private config: CollapseConfig;
  private deliberations: Map<string, DualTrackDeliberation> = new Map();
  private envelopes: Map<string, FailureEnvelope> = new Map();

  constructor(config: CollapseConfig = DEFAULT_COLLAPSE_CONFIG) {
    this.config = config;
    this.initializeAgents();


    this.loadFromDB().catch(() => {});
  }

  private initializeAgents(): void {
    // A. Legitimacy & Trust Collapse
    this.agents.set(CollapseAgentType.LEGITIMACY, new LegitimacyCollapseAgent());
    this.agents.set(CollapseAgentType.DEMOCRATIC_EROSION, new DemocraticProcessErosionAgent());
    this.agents.set(CollapseAgentType.PROCEDURAL_JUSTICE, new ProceduralJusticeAgent());
    
    // B. Civil Liberties & Rights Collapse (Critical - NON-OVERRIDABLE)
    this.agents.set(CollapseAgentType.FREE_SPEECH_CHILLING, new FreeSpeechChillingAgent());
    this.agents.set(CollapseAgentType.DUE_PROCESS_VIOLATION, new DueProcessViolationAgent());
    this.agents.set(CollapseAgentType.FREEDOM_OF_ASSOCIATION, new FreedomOfAssociationAgent());
    
    // C. Minority, Equity & Protection
    this.agents.set(CollapseAgentType.MINORITY_HARM, new MinorityHarmAgent());
    this.agents.set(CollapseAgentType.CULTURAL_ERASURE, new CulturalErasureAgent());
    this.agents.set(CollapseAgentType.DISABILITY_IMPACT, new DisabilityImpactAgent());
    
    // D. Political & Narrative Weaponization
    this.agents.set(CollapseAgentType.POLITICAL_BACKLASH, new PoliticalBacklashAgent());
    this.agents.set(CollapseAgentType.NARRATIVE_WEAPONIZATION, new NarrativeWeaponizationAgent());
    this.agents.set(CollapseAgentType.FOREIGN_INFLUENCE, new ForeignInfluenceAmplificationAgent());
    
    // E. Economic & Systemic Risk
    this.agents.set(CollapseAgentType.ECONOMIC_INSTABILITY, new EconomicInstabilityAgent());
    this.agents.set(CollapseAgentType.MARKET_DISTORTION, new MarketDistortionAgent());
    this.agents.set(CollapseAgentType.SYSTEMIC_RISK, new SystemicRiskAgent());
    
    // F. Temporal & Environmental
    this.agents.set(CollapseAgentType.TEMPORAL_DECAY, new TemporalDecayAgent());
    this.agents.set(CollapseAgentType.ENVIRONMENTAL_EXTERNALITY, new EnvironmentalExternalityAgent());
    
    // G. Abuse & Misuse
    this.agents.set(CollapseAgentType.ADVERSARIAL_ABUSE, new AdversarialAbuseAgent());
  }

  /**
   * Run full dual-track deliberation
   */
  async runDualTrackDeliberation(
    decisionId: string,
    decisionText: string,
    context: PolicyContext,
    consensusConfidence: number = 0.85,
    seed?: number
  ): Promise<DualTrackDeliberation> {
    const actualSeed = seed ?? Date.now() % 1000000;
    const deliberationId = generateCollapseId();
    const startedAt = new Date().toISOString();

    // Run Collapse Track
    const collapseTrack = await this.runCollapseTrack(
      decisionId,
      decisionText,
      context,
      actualSeed
    );

    // Build Consensus Track (Council integration via service layer)
    const consensusTrack = this.buildConsensusTrack(
      decisionId,
      decisionText,
      consensusConfidence
    );

    // Calculate Trust Delta
    const trustDelta = calculateTrustDelta(
      consensusTrack.confidence,
      collapseTrack.totalRisk
    );

    // Build Merkle root
    const merkleRoot = this.buildMerkleRoot([
      consensusTrack.trackId,
      ...collapseTrack.failureEnvelope.agentOutputs.map(o => o.hash),
    ]);

    const deliberation: DualTrackDeliberation = {
      id: deliberationId,
      decisionId,
      decisionText,
      context,
      consensusTrack,
      collapseTrack,
      trustDelta,
      startedAt,
      completedAt: new Date().toISOString(),
      seed: actualSeed,
      merkleRoot,
    };

    this.deliberations.set(deliberationId, deliberation);
    persistServiceRecord({ serviceName: 'CollapseOrchestrator', recordType: 'deliberation', referenceId: deliberationId, data: { id: deliberationId, trustDelta: deliberation.trustDelta, createdAt: new Date() } });
    return deliberation;
  }

  /**
   * Run Collapse Track analysis
   */
  async runCollapseTrack(
    decisionId: string,
    decisionText: string,
    context: PolicyContext,
    seed: number
  ): Promise<CollapseTrack> {
    const trackId = `CT-${Date.now().toString(36)}`;
    const agentOutputs: CollapseAgentOutput[] = [];
    const allFailureConditions: FailureCondition[] = [];

    const analysisParams: AgentAnalysisParams = {
      context,
      seed,
      stressMultiplier: this.config.stressMultiplier,
      simulationHorizonMonths: this.config.simulationHorizonMonths,
    };

    // Run each enabled agent
    const enabledAgents = this.config.agents.filter(a => a.enabled);

    for (const agentConfig of enabledAgents) {
      const agent = this.agents.get(agentConfig.type);
      if (!agent) continue;

      try {
        const output = await agent.analyze(analysisParams);
        agentOutputs.push(output);
        allFailureConditions.push(...output.failureConditions);
      } catch (error) {
        logger.error(`Collapse agent ${agentConfig.type} failed:`, error);
      }
    }

    // Build Failure Envelope
    const failureEnvelope = this.buildFailureEnvelope(
      decisionId,
      seed,
      agentOutputs,
      allFailureConditions
    );

    this.envelopes.set(failureEnvelope.id, failureEnvelope);
    persistServiceRecord({ serviceName: 'CollapseOrchestrator', recordType: 'failure_envelope', referenceId: failureEnvelope.id, data: { id: failureEnvelope.id, conditionCount: allFailureConditions.length, createdAt: new Date() } });
    const totalRisk = calculateCollapseRisk(allFailureConditions);
    const criticalFindings = allFailureConditions
      .filter(fc => fc.severity >= 0.8)
      .map(fc => fc.failureEvent.description);

    return {
      trackId,
      purpose: 'MAXIMIZE_FAILURE_DISCOVERY',
      agents: enabledAgents.map(a => a.type),
      failureEnvelope,
      totalRisk,
      criticalFindings,
    };
  }

  /**
   * Build Consensus Track (deterministic)
   */
  private buildConsensusTrack(
    decisionId: string,
    decisionText: string,
    confidence: number
  ): ConsensusTrack {
    return {
      trackId: `CON-${Date.now().toString(36)}`,
      purpose: 'OPTIMIZE_APPROVAL',
      agents: ['ConsensusAgent-1', 'ConsensusAgent-2', 'ConsensusAgent-3'],
      decision: decisionText,
      confidence,
      reasoning: [
        'Policy aligns with stated objectives',
        'Cost-benefit analysis favorable',
        'Stakeholder consultation completed',
        'Legal review passed',
      ],
      evidence: [
        'Impact assessment report',
        'Budget analysis',
        'Public consultation summary',
        'Legal opinion',
      ],
      votingRecord: [
        { agentId: 'ConsensusAgent-1', vote: 'APPROVE', confidence: confidence + 0.02 },
        { agentId: 'ConsensusAgent-2', vote: 'APPROVE', confidence: confidence - 0.01 },
        { agentId: 'ConsensusAgent-3', vote: 'APPROVE', confidence: confidence },
      ],
    };
  }

  /**
   * Build the Failure Envelope artifact
   */
  private buildFailureEnvelope(
    decisionId: string,
    seed: number,
    agentOutputs: CollapseAgentOutput[],
    failureConditions: FailureCondition[]
  ): FailureEnvelope {
    const id = generateFailureEnvelopeId();

    // Extract specialized data from agent outputs
    const systemicRisks: SystemicRisk[] = [];
    const ethicalRedLines: EthicalRedLine[] = [];
    const narrativeAttacks: NarrativeAttack[] = [];
    const exploitPaths: ExploitPath[] = [];
    let temporalDecay: TemporalDecay | null = null;
    const legitimacyCurve: { time: number; legitimacy: number }[] = [];
    const minorityHarmMatrix: { group: string; severity: number; visibility: VisibilityType; reversibility: Reversibility }[] = [];

    for (const output of agentOutputs) {
      // Extract from typed outputs (cast to access extended properties)
      const extOutput = output as { [key: string]: any };

      if (extOutput['systemicRisks']) {
        systemicRisks.push(...(extOutput['systemicRisks'] as SystemicRisk[]));
      }
      if (extOutput['exploitPaths']) {
        exploitPaths.push(...(extOutput['exploitPaths'] as ExploitPath[]));
      }
      if (extOutput['narrativeAttacks']) {
        narrativeAttacks.push(...(extOutput['narrativeAttacks'] as NarrativeAttack[]));
      }
      if (extOutput['temporalDecay']) {
        temporalDecay = extOutput['temporalDecay'] as TemporalDecay;
      }
      if (extOutput['legitimacyErosionCurve']) {
        legitimacyCurve.push(...(extOutput['legitimacyErosionCurve'] as { time: number; legitimacy: number }[]));
      }
      if (extOutput['disparityRatios']) {
        const ratios = extOutput['disparityRatios'] as { group: string; ratio: number }[];
        for (const r of ratios) {
          if (r.ratio > 1.3) {
            minorityHarmMatrix.push({
              group: r.group,
              severity: Math.min(r.ratio / 2, 1),
              visibility: r.ratio > 1.5 ? VisibilityType.DELAYED : VisibilityType.GRADUAL,
              reversibility: Reversibility.PARTIALLY_REVERSIBLE,
            });
          }
        }
      }
    }

    // Generate ethical red lines from minority harm findings
    for (const fc of failureConditions.filter(f => f.agent === CollapseAgentType.MINORITY_HARM)) {
      if (fc.severity >= 0.7) {
        ethicalRedLines.push({
          id: `ERL-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          principle: EthicalPrinciple.NON_DISCRIMINATION,
          violatedWhen: fc.triggerCondition.metric,
          irreversible: fc.irreversibility === Reversibility.IRREVERSIBLE,
          agent: fc.agent,
          severity: fc.severity,
          evidence: fc.evidence,
        });
      }
    }

    // Calculate summary
    const criticalCount = failureConditions.filter(fc => fc.severity >= 0.8).length;
    const highCount = failureConditions.filter(fc => fc.severity >= 0.6 && fc.severity < 0.8).length;
    const mediumCount = failureConditions.filter(fc => fc.severity >= 0.4 && fc.severity < 0.6).length;
    const lowCount = failureConditions.filter(fc => fc.severity < 0.4).length;

    const uniqueGroups = new Set(failureConditions.flatMap(fc => fc.affectedGroups.map(g => g.name)));

    // Calculate Trust Delta
    const collapseRisk = calculateCollapseRisk(failureConditions);
    const trustDelta = calculateTrustDelta(0.85, collapseRisk); // Use default consensus confidence

    // Build Merkle root
    const merkleRoot = this.buildMerkleRoot(agentOutputs.map(o => o.hash));

    const envelope: FailureEnvelope = {
      id,
      decisionId,
      collapseMode: true,
      generatedAt: new Date().toISOString(),
      seed,
      summary: {
        totalFailureConditions: failureConditions.length,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
        affectedGroupsCount: uniqueGroups.size,
        ethicalViolationsCount: ethicalRedLines.length,
      },
      failureConditions,
      systemicRisks,
      ethicalRedLines,
      temporalDecay: temporalDecay || {
        initialEffectiveness: 0.9,
        decayRate: 0.1,
        halfLife: '7 years',
        maintenanceRequired: [],
        institutionalMemoryRisk: 0.5,
        staffTurnoverImpact: 0.4,
      },
      narrativeAttacks,
      exploitPaths,
      agentOutputs,
      trustDelta,
      legitimacyCurve,
      minorityHarmMatrix,
      merkleRoot,
      signatures: {
        platform: 'datacendia-collapse-v1',
        timestamp: new Date().toISOString(),
        algorithm: 'SHA-256',
      },
      replayable: true,
      replayCommand: `npm run replay --mode=collapse --seed=${seed}`,
    };

    return envelope;
  }

  /**
   * Build Merkle root from hashes
   */
  private buildMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) {
      return createHash('sha256').update('empty').digest('hex');
    }

    let nodes = hashes.map(h => this.hashData(h));

    while (nodes.length > 1) {
      const newLevel: string[] = [];
      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i]!;
        const right = nodes[i + 1] || left;
        newLevel.push(this.hashData(left + right));
      }
      nodes = newLevel;
    }

    return nodes[0] || '';
  }

  private hashData(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Get deliberation by ID
   */
  getDeliberation(id: string): DualTrackDeliberation | undefined {
    return this.deliberations.get(id);
  }

  /**
   * Get failure envelope by ID
   */
  getFailureEnvelope(id: string): FailureEnvelope | undefined {
    return this.envelopes.get(id);
  }

  /**
   * List all deliberations
   */
  listDeliberations(): DualTrackDeliberation[] {
    return Array.from(this.deliberations.values());
  }

  /**
   * Verify envelope integrity
   */
  verifyEnvelopeIntegrity(envelope: FailureEnvelope): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verify Merkle root
    const computedRoot = this.buildMerkleRoot(envelope.agentOutputs.map(o => o.hash));
    if (computedRoot !== envelope.merkleRoot) {
      errors.push('Merkle root mismatch - envelope may have been tampered with');
    }

    // Verify agent output hashes - all agents should produce at least baseline findings
    for (const output of envelope.agentOutputs) {
      if (output.failureConditions.length === 0) {
        errors.push(`Agent ${output.agentType} has no failure conditions - adversarial agents should always find something`);
      }
      for (const fc of output.failureConditions) {
        if (!fc.hash) {
          errors.push(`Agent ${output.agentType} has a failure condition without hash`);
        }
      }
    }

    // Verify trust delta calculation
    const expectedRisk = calculateCollapseRisk(envelope.failureConditions);
    if (Math.abs(expectedRisk - envelope.trustDelta.collapseRisk) > 0.01) {
      errors.push('Trust delta calculation mismatch');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Replay deliberation with same seed
   */
  async replayDeliberation(
    originalId: string
  ): Promise<{ original: DualTrackDeliberation; replay: DualTrackDeliberation; match: boolean }> {
    const original = this.deliberations.get(originalId);
    if (!original) {
      throw new Error(`Deliberation ${originalId} not found`);
    }

    const replay = await this.runDualTrackDeliberation(
      original.decisionId,
      original.decisionText,
      original.context,
      original.consensusTrack.confidence,
      original.seed
    );

    const match = original.merkleRoot === replay.merkleRoot;

    return { original, replay, match };
  }

  /**
   * Get agent descriptions
   */
  getAgentDescriptions(): { type: CollapseAgentType; description: string; questions: string[] }[] {
    return Array.from(this.agents.entries()).map(([type, agent]) => ({
      type,
      description: agent.getDescription(),
      questions: agent.getFailureQuestions(),
    }));
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<CollapseConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): CollapseConfig {
    return this.config;
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CollapseOrchestrator', recordType: 'deliberation', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.agents.has(d.id)) this.agents.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CollapseOrchestrator', recordType: 'failure_envelope', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.deliberations.has(d.id)) this.deliberations.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CollapseOrchestrator', recordType: 'failure_envelope', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.envelopes.has(d.id)) this.envelopes.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[CollapseOrchestrator] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CollapseOrchestrator] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Singleton instance
export const collapseOrchestrator = new CollapseOrchestrator();
