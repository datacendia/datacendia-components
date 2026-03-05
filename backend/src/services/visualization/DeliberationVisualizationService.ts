/**
 * Service — Deliberation Visualization Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports DeliberationVisualizationService, deliberationVisualizationService, AgentVisualization, Citation, DeliberationVisualizationState, DissentVisualization, TimelineEvent, VotingResults
 * @module services/visualization/DeliberationVisualizationService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA REAL-TIME DELIBERATION VISUALIZATION SERVICE
 * 
 * Provides real-time visualization data for Council deliberations:
 * - Agent avatars with speech bubbles
 * - Confidence meters changing as they debate
 * - Citation links appearing as they're added
 * - Dissent indicators flashing
 * - Final consensus animation
 * 
 * WebSocket-based streaming for live updates
 */

import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { loadServiceRecords } from '../../utils/servicePersistence.js';
// =============================================================================
// TYPES
// =============================================================================

export interface AgentVisualization {
  agentId: string;
  agentName: string;
  role: string;
  avatarUrl: string;
  position: { x: number; y: number };
  status: 'idle' | 'thinking' | 'speaking' | 'listening' | 'dissenting' | 'agreeing';
  confidenceLevel: number; // 0-100
  currentStatement?: string;
  citations: Citation[];
  dissenting: boolean;
  dissentReason?: string;
  lastActivity: Date;
}

export interface Citation {
  id: string;
  type: 'case_law' | 'statute' | 'regulation' | 'document' | 'data';
  reference: string;
  url?: string;
  addedAt: Date;
  addedBy: string;
}

export interface DeliberationVisualizationState {
  deliberationId: string;
  status: 'initializing' | 'active' | 'voting' | 'consensus' | 'concluded';
  currentRound: number;
  maxRounds: number;
  topic: string;
  startedAt: Date;
  agents: AgentVisualization[];
  citations: Citation[];
  consensusLevel: number; // 0-100
  dissents: DissentVisualization[];
  timeline: TimelineEvent[];
  currentSpeaker?: string;
  votingResults?: VotingResults;
}

export interface DissentVisualization {
  agentId: string;
  agentName: string;
  reason: string;
  severity: 'minor' | 'significant' | 'blocking';
  timestamp: Date;
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'agent_joined' | 'statement' | 'citation_added' | 'dissent' | 'agreement' | 'vote' | 'consensus' | 'round_complete';
  agentId?: string;
  agentName?: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface VotingResults {
  inFavor: string[];
  against: string[];
  abstain: string[];
  consensusReached: boolean;
  finalDecision?: string;
}

export interface VisualizationUpdate {
  type: 'agent_status' | 'statement' | 'citation' | 'dissent' | 'consensus' | 'vote' | 'round' | 'complete';
  deliberationId: string;
  timestamp: Date;
  data: unknown;
}

// =============================================================================
// AVATAR CONFIGURATIONS
// =============================================================================

const AGENT_AVATARS: Record<string, string> = {
  // Core Council Agents
  'chief': '/avatars/chief-strategy.svg',
  'cfo': '/avatars/cfo-finance.svg',
  'ciso': '/avatars/ciso-security.svg',
  'cmo': '/avatars/cmo-marketing.svg',
  'coo': '/avatars/coo-operations.svg',
  'risk': '/avatars/risk-officer.svg',
  'ethics': '/avatars/ethics-officer.svg',
  'advocate': '/avatars/devils-advocate.svg',
  
  // Legal Agents
  'matter-lead': '/avatars/legal-lead.svg',
  'research-counsel': '/avatars/legal-research.svg',
  'litigation-strategist': '/avatars/legal-litigation.svg',
  'prosecutor': '/avatars/legal-prosecutor.svg',
  'defense-attorney': '/avatars/legal-defense.svg',
  'judge': '/avatars/legal-judge.svg',
  
  // Defense Agents
  'mission-commander': '/avatars/defense-commander.svg',
  'threat-analyst': '/avatars/defense-intel.svg',
  'opsec-officer': '/avatars/defense-opsec.svg',
  'cyber-warfare-specialist': '/avatars/defense-cyber.svg',
  'acquisition-specialist': '/avatars/defense-acquisition.svg',
  'legal-advisor-ucmj': '/avatars/defense-legal.svg',
  
  // Default
  'default': '/avatars/agent-default.svg',
};

const AGENT_POSITIONS = [
  { x: 50, y: 20 },   // Top center (lead)
  { x: 20, y: 35 },   // Upper left
  { x: 80, y: 35 },   // Upper right
  { x: 10, y: 55 },   // Middle left
  { x: 90, y: 55 },   // Middle right
  { x: 25, y: 75 },   // Lower left
  { x: 75, y: 75 },   // Lower right
  { x: 50, y: 85 },   // Bottom center
  { x: 35, y: 45 },   // Inner left
  { x: 65, y: 45 },   // Inner right
  { x: 40, y: 65 },   // Inner lower left
  { x: 60, y: 65 },   // Inner lower right
];

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class DeliberationVisualizationService extends EventEmitter {
  private static instance: DeliberationVisualizationService;
  private activeVisualizations: Map<string, DeliberationVisualizationState> = new Map();

  private constructor() {
    super();
    logger.info('[CendiaLive] Deliberation VisualizationÃ¢â€žÂ¢ initialized');


    this.loadFromDB().catch(() => {});
  }

  static getInstance(): DeliberationVisualizationService {
    if (!DeliberationVisualizationService.instance) {
      DeliberationVisualizationService.instance = new DeliberationVisualizationService();
    }
    return DeliberationVisualizationService.instance;
  }

  // -------------------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------------------

  /**
   * Initialize visualization for a new deliberation
   */
  initializeVisualization(
    deliberationId: string,
    topic: string,
    agents: Array<{ id: string; name: string; role: string }>,
    maxRounds: number = 10
  ): DeliberationVisualizationState {
    const agentVisualizations: AgentVisualization[] = agents.map((agent, index) => ({
      agentId: agent.id,
      agentName: agent.name,
      role: agent.role,
      avatarUrl: AGENT_AVATARS[agent.id] ?? AGENT_AVATARS['default'] ?? '/avatars/agent-default.svg',
      position: AGENT_POSITIONS[index % AGENT_POSITIONS.length] ?? { x: 50, y: 50 },
      status: 'idle' as const,
      confidenceLevel: 50,
      citations: [],
      dissenting: false,
      lastActivity: new Date(),
    }));

    const state: DeliberationVisualizationState = {
      deliberationId,
      status: 'initializing',
      currentRound: 0,
      maxRounds,
      topic,
      startedAt: new Date(),
      agents: agentVisualizations,
      citations: [],
      consensusLevel: 0,
      dissents: [],
      timeline: [{
        id: `init-${Date.now()}`,
        timestamp: new Date(),
        type: 'agent_joined',
        content: `Deliberation initialized with ${agents.length} agents`,
        metadata: { agentCount: agents.length },
      }],
    };

    this.activeVisualizations.set(deliberationId, state);
    this.emitUpdate('agent_status', deliberationId, { status: 'initialized', agents: agentVisualizations });
    
    return state;
  }

  // -------------------------------------------------------------------------
  // REAL-TIME UPDATES
  // -------------------------------------------------------------------------

  /**
   * Update agent status (thinking, speaking, etc.)
   */
  updateAgentStatus(
    deliberationId: string,
    agentId: string,
    status: AgentVisualization['status'],
    statement?: string
  ): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    const agent = state.agents.find(a => a.agentId === agentId);
    if (!agent) return;

    // Update previous speaker to listening
    if (status === 'speaking' && state.currentSpeaker && state.currentSpeaker !== agentId) {
      const prevSpeaker = state.agents.find(a => a.agentId === state.currentSpeaker);
      if (prevSpeaker) {
        prevSpeaker.status = 'listening';
      }
    }

    agent.status = status;
    agent.lastActivity = new Date();
    
    if (statement) {
      agent.currentStatement = statement;
    }

    if (status === 'speaking') {
      state.currentSpeaker = agentId;
      state.timeline.push({
        id: `stmt-${Date.now()}`,
        timestamp: new Date(),
        type: 'statement',
        agentId,
        agentName: agent.agentName,
        content: statement || 'Speaking...',
      });
    }

    this.emitUpdate('agent_status', deliberationId, { agentId, status, statement });
  }

  /**
   * Update agent confidence level
   */
  updateConfidence(deliberationId: string, agentId: string, confidence: number): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    const agent = state.agents.find(a => a.agentId === agentId);
    if (!agent) return;

    agent.confidenceLevel = Math.max(0, Math.min(100, confidence));
    
    // Recalculate consensus level
    const avgConfidence = state.agents.reduce((sum, a) => sum + a.confidenceLevel, 0) / state.agents.length;
    const dissentPenalty = state.dissents.length * 10;
    state.consensusLevel = Math.max(0, avgConfidence - dissentPenalty);

    this.emitUpdate('consensus', deliberationId, { 
      agentId, 
      confidence: agent.confidenceLevel,
      consensusLevel: state.consensusLevel 
    });
  }

  /**
   * Add a citation
   */
  addCitation(deliberationId: string, agentId: string, citation: Omit<Citation, 'id' | 'addedAt' | 'addedBy'>): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    const agent = state.agents.find(a => a.agentId === agentId);
    if (!agent) return;

    const fullCitation: Citation = {
      ...citation,
      id: `cite-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      addedAt: new Date(),
      addedBy: agentId,
    };

    agent.citations.push(fullCitation);
    state.citations.push(fullCitation);

    state.timeline.push({
      id: `cite-${Date.now()}`,
      timestamp: new Date(),
      type: 'citation_added',
      agentId,
      agentName: agent.agentName,
      content: `Added citation: ${citation.reference}`,
      metadata: { citation: fullCitation },
    });

    this.emitUpdate('citation', deliberationId, { agentId, citation: fullCitation });
  }

  /**
   * Register a dissent
   */
  registerDissent(
    deliberationId: string,
    agentId: string,
    reason: string,
    severity: DissentVisualization['severity'] = 'significant'
  ): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    const agent = state.agents.find(a => a.agentId === agentId);
    if (!agent) return;

    agent.dissenting = true;
    agent.dissentReason = reason;
    agent.status = 'dissenting';

    const dissent: DissentVisualization = {
      agentId,
      agentName: agent.agentName,
      reason,
      severity,
      timestamp: new Date(),
    };

    state.dissents.push(dissent);

    state.timeline.push({
      id: `dissent-${Date.now()}`,
      timestamp: new Date(),
      type: 'dissent',
      agentId,
      agentName: agent.agentName,
      content: `Dissent (${severity}): ${reason}`,
      metadata: { dissent },
    });

    // Recalculate consensus
    const dissentPenalty = state.dissents.length * 10;
    const avgConfidence = state.agents.reduce((sum, a) => sum + a.confidenceLevel, 0) / state.agents.length;
    state.consensusLevel = Math.max(0, avgConfidence - dissentPenalty);

    this.emitUpdate('dissent', deliberationId, { dissent, consensusLevel: state.consensusLevel });
  }

  /**
   * Record agreement
   */
  registerAgreement(deliberationId: string, agentId: string): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    const agent = state.agents.find(a => a.agentId === agentId);
    if (!agent) return;

    agent.status = 'agreeing';
    agent.dissenting = false;
    agent.confidenceLevel = Math.min(100, agent.confidenceLevel + 10);

    state.timeline.push({
      id: `agree-${Date.now()}`,
      timestamp: new Date(),
      type: 'agreement',
      agentId,
      agentName: agent.agentName,
      content: `${agent.agentName} agrees with the current position`,
    });

    this.emitUpdate('agent_status', deliberationId, { agentId, status: 'agreeing' });
  }

  // -------------------------------------------------------------------------
  // ROUND & VOTING
  // -------------------------------------------------------------------------

  /**
   * Advance to next round
   */
  advanceRound(deliberationId: string): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    state.currentRound++;
    state.status = state.currentRound >= state.maxRounds ? 'voting' : 'active';

    // Reset agent statuses
    state.agents.forEach(agent => {
      agent.status = 'idle';
      agent.currentStatement = '';
    });
    state.currentSpeaker = '';

    state.timeline.push({
      id: `round-${Date.now()}`,
      timestamp: new Date(),
      type: 'round_complete',
      content: `Round ${state.currentRound} of ${state.maxRounds} complete`,
      metadata: { round: state.currentRound, maxRounds: state.maxRounds },
    });

    this.emitUpdate('round', deliberationId, { 
      round: state.currentRound, 
      maxRounds: state.maxRounds,
      status: state.status 
    });
  }

  /**
   * Start voting phase
   */
  startVoting(deliberationId: string): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    state.status = 'voting';
    state.votingResults = {
      inFavor: [],
      against: [],
      abstain: [],
      consensusReached: false,
    };

    this.emitUpdate('vote', deliberationId, { phase: 'started' });
  }

  /**
   * Record a vote
   */
  recordVote(deliberationId: string, agentId: string, vote: 'favor' | 'against' | 'abstain'): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state || !state.votingResults) return;

    const agent = state.agents.find(a => a.agentId === agentId);
    if (!agent) return;

    switch (vote) {
      case 'favor':
        state.votingResults.inFavor.push(agentId);
        agent.status = 'agreeing';
        break;
      case 'against':
        state.votingResults.against.push(agentId);
        agent.status = 'dissenting';
        break;
      case 'abstain':
        state.votingResults.abstain.push(agentId);
        agent.status = 'idle';
        break;
    }

    state.timeline.push({
      id: `vote-${Date.now()}`,
      timestamp: new Date(),
      type: 'vote',
      agentId,
      agentName: agent.agentName,
      content: `${agent.agentName} voted: ${vote}`,
      metadata: { vote },
    });

    this.emitUpdate('vote', deliberationId, { agentId, vote, results: state.votingResults });
  }

  /**
   * Conclude deliberation with consensus
   */
  concludeWithConsensus(deliberationId: string, decision: string): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    state.status = 'consensus';
    state.consensusLevel = 100;
    
    if (state.votingResults) {
      state.votingResults.consensusReached = true;
      state.votingResults.finalDecision = decision;
    }

    // All agents agree
    state.agents.forEach(agent => {
      agent.status = 'agreeing';
      agent.confidenceLevel = 100;
    });

    state.timeline.push({
      id: `consensus-${Date.now()}`,
      timestamp: new Date(),
      type: 'consensus',
      content: `Consensus reached: ${decision}`,
      metadata: { decision },
    });

    this.emitUpdate('complete', deliberationId, { 
      status: 'consensus',
      decision,
      votingResults: state.votingResults 
    });
  }

  /**
   * Conclude deliberation (with or without consensus)
   */
  concludeDeliberation(deliberationId: string, decision?: string): void {
    const state = this.activeVisualizations.get(deliberationId);
    if (!state) return;

    state.status = 'concluded';

    state.timeline.push({
      id: `conclude-${Date.now()}`,
      timestamp: new Date(),
      type: 'consensus',
      content: decision ? `Deliberation concluded: ${decision}` : 'Deliberation concluded without consensus',
      metadata: { decision, hasConsensus: !!decision },
    });

    this.emitUpdate('complete', deliberationId, { 
      status: 'concluded',
      decision,
      consensusLevel: state.consensusLevel,
      votingResults: state.votingResults 
    });
  }

  // -------------------------------------------------------------------------
  // GETTERS
  // -------------------------------------------------------------------------

  /**
   * Get current visualization state
   */
  getVisualizationState(deliberationId: string): DeliberationVisualizationState | undefined {
    return this.activeVisualizations.get(deliberationId);
  }

  /**
   * Get all active visualizations
   */
  getActiveVisualizations(): string[] {
    return Array.from(this.activeVisualizations.keys());
  }

  /**
   * Get timeline for a deliberation
   */
  getTimeline(deliberationId: string): TimelineEvent[] {
    const state = this.activeVisualizations.get(deliberationId);
    return state?.timeline || [];
  }

  /**
   * Clean up completed visualization
   */
  cleanupVisualization(deliberationId: string): void {
    this.activeVisualizations.delete(deliberationId);
    logger.info(`Ã°Å¸Â§Â¹ Cleaned up visualization for deliberation ${deliberationId}`);
  }

  // -------------------------------------------------------------------------
  // EVENT EMISSION
  // -------------------------------------------------------------------------

  private emitUpdate(type: VisualizationUpdate['type'], deliberationId: string, data: unknown): void {
    const update: VisualizationUpdate = {
      type,
      deliberationId,
      timestamp: new Date(),
      data,
    };

    this.emit('visualization-update', update);
    this.emit(`deliberation:${deliberationId}`, update);
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'DeliberationVisualization', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.activeVisualizations.has(d.id)) this.activeVisualizations.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[DeliberationVisualizationService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[DeliberationVisualizationService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton
export const deliberationVisualizationService = DeliberationVisualizationService.getInstance();
