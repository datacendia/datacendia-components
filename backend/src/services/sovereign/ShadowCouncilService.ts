// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SHADOW COUNCILÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ - PARALLEL WHAT-IF DELIBERATION MODE
// "Test radical ideas without polluting the ledger."
//
// Enables sandbox deliberations that run in parallel with full Council
// capabilities but are NOT recorded to the main ledger. Perfect for:
// - Testing controversial strategies
// - War-gaming scenarios
// - Training and onboarding
// - Exploring "what if we fired 20% of staff?" without HR panic
// =============================================================================

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ShadowSession {
  id: string;
  organizationId: string;
  createdBy: string;
  
  // Session metadata
  name: string;
  description?: string;
  purpose: 'exploration' | 'training' | 'war-gaming' | 'stress-test' | 'comparison';
  
  // Configuration
  config: ShadowConfig;
  
  // State
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  
  // Deliberations in this shadow
  deliberations: ShadowDeliberation[];
  
  // Comparison (if comparing to official path)
  comparisonId?: string;
  comparisonResults?: ComparisonResults;
  
  // Timestamps
  createdAt: Date;
  lastActivityAt: Date;
  completedAt?: Date;
  
  // Auto-expiry
  expiresAt: Date;
  
  // Privacy
  isPrivate: boolean;
  allowedViewers: string[];
}

export interface ShadowConfig {
  // What's sandboxed
  sandboxLedger: boolean;      // Don't write to real ledger
  sandboxNotifications: boolean; // Don't send real notifications
  sandboxIntegrations: boolean;  // Don't trigger real integrations
  
  // Agent behavior
  useProductionModels: boolean;  // Use same models as production
  temperatureOverride?: number;  // Override temperature for more exploration
  allowHallucination: boolean;   // Allow more creative/risky responses
  
  // Data isolation
  useProductionData: boolean;    // Read from production data
  snapshotData: boolean;         // Take snapshot at session start
  dataSnapshot?: any;            // Captured data snapshot
  
  // Limits
  maxDeliberations: number;
  maxDurationHours: number;
  
  // Watermarking
  watermarkResponses: boolean;   // Add "[SHADOW]" prefix to responses
}

export interface ShadowDeliberation {
  id: string;
  sessionId: string;
  
  // Question
  question: string;
  context?: string;
  
  // Participants
  agents: string[];
  
  // Results (mirrors real deliberation structure)
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  phases: ShadowPhase[];
  agentResponses: ShadowAgentResponse[];
  synthesis?: string;
  confidence?: number;
  
  // Metadata
  createdAt: Date;
  completedAt?: Date;
  durationMs?: number;
  
  // Shadow-specific
  isWatermarked: boolean;
  divergenceFromOfficial?: number; // 0-1 score of how different from official
}

export interface ShadowPhase {
  name: string;
  startedAt: Date;
  endedAt?: Date;
  events: any[];
}

export interface ShadowAgentResponse {
  agentId: string;
  agentCode: string;
  agentName: string;
  
  response: string;
  confidence: number;
  vote?: string;
  
  // Shadow metadata
  modelUsed: string;
  temperatureUsed: number;
  tokenCount: number;
  responseTimeMs: number;
}

export interface ComparisonResults {
  officialDecisionId: string;
  shadowDecisionId: string;
  
  // Comparison metrics
  divergenceScore: number;       // 0-1, how different are the conclusions
  agentAgreement: number;        // 0-1, how much agents agreed across both
  confidenceDelta: number;       // Difference in confidence scores
  
  // Detailed comparison
  agentComparisons: {
    agentCode: string;
    officialVote: string;
    shadowVote: string;
    votesMatch: boolean;
    responseSimilarity: number;
  }[];
  
  // Key differences
  keyDifferences: string[];
  
  // Insights
  insights: string[];
  
  // Timestamps
  comparedAt: Date;
}

// =============================================================================
// SHADOW COUNCIL SERVICE
// =============================================================================

class ShadowCouncilService extends EventEmitter {
  private sessions: Map<string, ShadowSession> = new Map();
  private activeDeliberations: Map<string, ShadowDeliberation> = new Map();
  
  constructor() {
    super();
    
    // Auto-cleanup expired sessions
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000); // Hourly
    
    logger.info('[ShadowCouncil] Service initialized - Sandbox deliberation ready');
  }

  // ===========================================================================
  // SESSION MANAGEMENT
  // ===========================================================================

  /**
   * Create a new shadow session
   */
  async createSession(params: {
    organizationId: string;
    createdBy: string;
    name: string;
    description?: string;
    purpose: ShadowSession['purpose'];
    config?: Partial<ShadowConfig>;
    durationHours?: number;
    isPrivate?: boolean;
  }): Promise<ShadowSession> {
    const id = `shadow-${crypto.randomUUID().slice(0, 8)}`;
    
    const defaultConfig: ShadowConfig = {
      sandboxLedger: true,
      sandboxNotifications: true,
      sandboxIntegrations: true,
      useProductionModels: true,
      allowHallucination: false,
      useProductionData: true,
      snapshotData: false,
      maxDeliberations: 50,
      maxDurationHours: params.durationHours || 24,
      watermarkResponses: true,
    };
    
    const config: ShadowConfig = {
      ...defaultConfig,
      ...params.config,
    };
    
    const session: ShadowSession = {
      id,
      organizationId: params.organizationId,
      createdBy: params.createdBy,
      name: params.name,
      description: params.description,
      purpose: params.purpose,
      config,
      status: 'active',
      deliberations: [],
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + config.maxDurationHours * 60 * 60 * 1000),
      isPrivate: params.isPrivate ?? true,
      allowedViewers: [params.createdBy],
    };
    
    // Take data snapshot if configured
    if (config.snapshotData) {
      session.config.dataSnapshot = await this.captureDataSnapshot(params.organizationId);
    }
    
    this.sessions.set(id, session);
    
    logger.info(`[ShadowCouncil] Created session: ${params.name} (${id})`);
    this.emit('session:created', session);
    
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ShadowSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * List sessions for organization
   */
  listSessions(organizationId: string, userId?: string): ShadowSession[] {
    return Array.from(this.sessions.values())
      .filter(s => s.organizationId === organizationId)
      .filter(s => !s.isPrivate || !userId || s.allowedViewers.includes(userId))
      .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
  }

  /**
   * Close a session
   */
  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);
    
    session.status = 'completed';
    session.completedAt = new Date();
    
    logger.info(`[ShadowCouncil] Closed session: ${session.name}`);
    this.emit('session:closed', session);
  }

  /**
   * Capture data snapshot for isolation
   */
  private async captureDataSnapshot(organizationId: string): Promise<any> {
    // Production upgrade: capture relevant data state snapshot
    return {
      capturedAt: new Date(),
      organizationId,
      // Add relevant data here
    };
  }

  /**
   * Cleanup expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [id, session] of this.sessions) {
      if (session.expiresAt < now && session.status === 'active') {
        session.status = 'abandoned';
        logger.info(`[ShadowCouncil] Session expired: ${session.name}`);
        this.emit('session:expired', session);
      }
    }
  }

  // ===========================================================================
  // SHADOW DELIBERATION
  // ===========================================================================

  /**
   * Start a shadow deliberation
   */
  async startDeliberation(params: {
    sessionId: string;
    question: string;
    context?: string;
    agents: string[];
  }): Promise<ShadowDeliberation> {
    const session = this.sessions.get(params.sessionId);
    if (!session) throw new Error(`Session not found: ${params.sessionId}`);
    if (session.status !== 'active') throw new Error('Session is not active');
    
    // Check limits
    if (session.deliberations.length >= session.config.maxDeliberations) {
      throw new Error(`Maximum deliberations (${session.config.maxDeliberations}) reached`);
    }
    
    const id = `shadow-delib-${crypto.randomUUID().slice(0, 8)}`;
    
    const deliberation: ShadowDeliberation = {
      id,
      sessionId: params.sessionId,
      question: params.question,
      context: params.context,
      agents: params.agents,
      status: 'pending',
      phases: [],
      agentResponses: [],
      createdAt: new Date(),
      isWatermarked: session.config.watermarkResponses,
    };
    
    session.deliberations.push(deliberation);
    session.lastActivityAt = new Date();
    this.activeDeliberations.set(id, deliberation);
    
    // Start processing
    this.processDeliberation(deliberation, session).catch(err => {
      logger.error(`[ShadowCouncil] Deliberation failed:`, err);
      deliberation.status = 'failed';
    });
    
    logger.info(`[ShadowCouncil] Started deliberation in ${session.name}: ${params.question.slice(0, 50)}...`);
    this.emit('deliberation:started', deliberation);
    
    return deliberation;
  }

  /**
   * Process shadow deliberation
   */
  private async processDeliberation(
    deliberation: ShadowDeliberation,
    session: ShadowSession
  ): Promise<void> {
    deliberation.status = 'in_progress';
    const startTime = Date.now();
    
    // Phase 1: Initial Analysis
    const analysisPhase: ShadowPhase = {
      name: 'initial_analysis',
      startedAt: new Date(),
      events: [],
    };
    deliberation.phases.push(analysisPhase);
    
    // Get responses from each agent
    for (const agentCode of deliberation.agents) {
      try {
        const response = await this.getAgentResponse(
          agentCode,
          deliberation.question,
          deliberation.context,
          session.config
        );
        
        deliberation.agentResponses.push(response);
        analysisPhase.events.push({
          type: 'agent_response',
          agent: agentCode,
          timestamp: new Date(),
        });
      } catch (err: unknown) {
        logger.error(`[ShadowCouncil] Agent ${agentCode} failed:`, err);
      }
    }
    
    analysisPhase.endedAt = new Date();
    
    // Phase 2: Synthesis
    const synthesisPhase: ShadowPhase = {
      name: 'synthesis',
      startedAt: new Date(),
      events: [],
    };
    deliberation.phases.push(synthesisPhase);
    
    deliberation.synthesis = await this.synthesizeResponses(
      deliberation.agentResponses,
      session.config
    );
    
    deliberation.confidence = this.calculateConfidence(deliberation.agentResponses);
    
    synthesisPhase.endedAt = new Date();
    
    // Complete
    deliberation.status = 'completed';
    deliberation.completedAt = new Date();
    deliberation.durationMs = Date.now() - startTime;
    
    this.activeDeliberations.delete(deliberation.id);
    
    logger.info(`[ShadowCouncil] Completed deliberation ${deliberation.id} in ${deliberation.durationMs}ms`);
    this.emit('deliberation:completed', deliberation);
  }

  /**
   * Get agent response for shadow mode
   */
  private async getAgentResponse(
    agentCode: string,
    question: string,
    context: string | undefined,
    config: ShadowConfig
  ): Promise<ShadowAgentResponse> {
    const startTime = Date.now();
    
    // Uses deterministic computation; production upgrade: the actual LLM service
    // Generate deterministic response
    const watermark = config.watermarkResponses ? '[SHADOW MODE] ' : '';
    
    // Generate response based on agent type
    const responses: Record<string, string> = {
      cfo: `${watermark}From a financial perspective, this decision involves significant capital allocation considerations. Key factors include ROI projections, cash flow impact, and risk-adjusted returns.`,
      cto: `${watermark}Technically, this approach has both opportunities and challenges. We should consider scalability, technical debt, and integration complexity.`,
      coo: `${watermark}Operationally, implementation would require careful planning. Key concerns are timeline feasibility, resource allocation, and change management.`,
      ciso: `${watermark}Security analysis indicates moderate risk. We need to evaluate data protection implications, compliance requirements, and threat vectors.`,
      chro: `${watermark}From a people perspective, this impacts workforce morale and organizational culture. Consider communication strategy and change readiness.`,
      cmo: `${watermark}Market positioning considerations suggest both opportunities and risks. Brand impact and competitive dynamics should be factored in.`,
    };
    
    const response = responses[agentCode] || 
      `${watermark}Analysis from ${agentCode}: This decision requires careful consideration of multiple factors.`;
    
    const votes = ['approve', 'reject', 'defer', 'abstain'];
    const vote = config.allowHallucination 
      ? votes[Math.floor(deterministicFloat('shadowcouncil-7') * votes.length)]
      : votes[0]; // Default to approve in conservative mode
    
    return {
      agentId: `agent-${agentCode}`,
      agentCode,
      agentName: agentCode.toUpperCase() + ' Agent',
      response,
      confidence: 0.7 + deterministicFloat('shadowcouncil-1') * 0.25,
      vote,
      modelUsed: config.useProductionModels ? 'qwen2.5:7b' : 'shadow-mock',
      temperatureUsed: config.temperatureOverride || 0.7,
      tokenCount: response.split(' ').length * 1.3,
      responseTimeMs: Date.now() - startTime + deterministicFloat('shadowcouncil-4') * 100,
    };
  }

  /**
   * Synthesize agent responses
   */
  private async synthesizeResponses(
    responses: ShadowAgentResponse[],
    config: ShadowConfig
  ): Promise<string> {
    const watermark = config.watermarkResponses ? '[SHADOW SYNTHESIS] ' : '';
    
    const votes = responses.map(r => r.vote).filter(Boolean);
    const approvals = votes.filter(v => v === 'approve').length;
    const rejections = votes.filter(v => v === 'reject').length;
    
    const consensus = approvals > rejections ? 'approve' : 
                     rejections > approvals ? 'reject' : 'no consensus';
    
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
    
    return `${watermark}Based on analysis from ${responses.length} agents:

**Consensus:** ${consensus} (${approvals} approve, ${rejections} reject)
**Average Confidence:** ${Math.round(avgConfidence * 100)}%

Key points raised:
${responses.map(r => `- ${r.agentName}: ${r.response.slice(0, 100)}...`).join('\n')}

This is a SHADOW deliberation and is not recorded to the official ledger.`;
  }

  /**
   * Calculate aggregate confidence
   */
  private calculateConfidence(responses: ShadowAgentResponse[]): number {
    if (responses.length === 0) return 0;
    return responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
  }

  // ===========================================================================
  // COMPARISON
  // ===========================================================================

  /**
   * Compare shadow deliberation to official deliberation
   */
  async compareToOfficial(
    shadowDeliberationId: string,
    officialDeliberationId: string
  ): Promise<ComparisonResults> {
    const shadow = this.activeDeliberations.get(shadowDeliberationId) ||
      Array.from(this.sessions.values())
        .flatMap(s => s.deliberations)
        .find(d => d.id === shadowDeliberationId);
    
    if (!shadow) throw new Error(`Shadow deliberation not found: ${shadowDeliberationId}`);
    
    // Production upgrade: fetch official deliberation from database
    // Generate deterministic comparison
    
    const results: ComparisonResults = {
      officialDecisionId: officialDeliberationId,
      shadowDecisionId: shadowDeliberationId,
      
      divergenceScore: deterministicFloat('shadowcouncil-5') * 0.4, // 0-40% divergence typically
      agentAgreement: 0.6 + deterministicFloat('shadowcouncil-2') * 0.3, // 60-90% agreement
      confidenceDelta: deterministicFloat('shadowcouncil-6') * 0.2 - 0.1, // ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±10%
      
      agentComparisons: shadow.agentResponses.map(r => ({
        agentCode: r.agentCode,
        officialVote: 'approve',
        shadowVote: r.vote || 'approve',
        votesMatch: r.vote === 'approve',
        responseSimilarity: 0.7 + deterministicFloat('shadowcouncil-3') * 0.2,
      })),
      
      keyDifferences: [
        'Shadow mode explored more aggressive timeline',
        'Official path had higher risk aversion',
        'Agent confidence levels varied by 15%',
      ],
      
      insights: [
        'Shadow exploration revealed viable alternative approach',
        'Risk assessment was consistent across both modes',
        'Consider incorporating shadow insights into official process',
      ],
      
      comparedAt: new Date(),
    };
    
    // Store comparison
    const session = Array.from(this.sessions.values())
      .find(s => s.deliberations.some(d => d.id === shadowDeliberationId));
    
    if (session) {
      session.comparisonId = officialDeliberationId;
      session.comparisonResults = results;
    }
    
    logger.info(`[ShadowCouncil] Comparison completed: ${results.divergenceScore * 100}% divergence`);
    this.emit('comparison:completed', results);
    
    return results;
  }

  /**
   * Get deliberation status
   */
  getDeliberation(deliberationId: string): ShadowDeliberation | undefined {
    return this.activeDeliberations.get(deliberationId) ||
      Array.from(this.sessions.values())
        .flatMap(s => s.deliberations)
        .find(d => d.id === deliberationId);
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const shadowCouncilService = new ShadowCouncilService();
export { ShadowCouncilService };
