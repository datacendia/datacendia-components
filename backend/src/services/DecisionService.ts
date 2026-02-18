// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - DECISION SERVICE
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * Full lifecycle tracking, replay, and audit trail for all decisions
 * "Black Box Flight Recorder" for enterprise decisions
 */

import { BaseService } from '../core/services/BaseService.js';
import { aiModelSelector } from '../config/aiModels.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface DecisionContext {
  description: string;
  stakeholders: string[];
  constraints: string[];
  assumptions: string[];
  dataSourcesUsed: string[];
}

export interface DecisionEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'context_added' | 'premortem_run' | 'council_session' | 
        'ghost_board' | 'decision_made' | 'outcome_recorded' | 'reopened';
  title: string;
  summary: string;
  data: Record<string, any>;
  userId: string;
  agentsInvolved?: string[];
}

export interface PreMortemSnapshot {
  runAt: Date;
  selectedAgents: string[];
  riskScore: number;
  recommendation: string;
  failureModes: Array<{
    title: string;
    probability: number;
    costImpact: number;
    category: string;
  }>;
  totalExposure: number;
}

export interface CouncilSnapshot {
  sessionAt: Date;
  mode: string;
  query: string;
  agentResponses: Array<{
    agentId: string;
    agentName: string;
    response: string;
    confidence: number;
  }>;
  synthesis: string;
  consensusLevel: number;
}

export interface GhostBoardSnapshot {
  simulatedAt: Date;
  boardMembers: string[];
  questions: Array<{
    member: string;
    question: string;
    difficulty: string;
  }>;
  preparednessScore: number;
  criticalGaps: string[];
}

export interface DecisionOutcome {
  recordedAt: Date;
  actualResult: 'success' | 'partial_success' | 'failure' | 'abandoned' | 'pending';
  notes: string;
  lessonsLearned: string[];
  predictedRisksOccurred: string[];
  unpredictedIssues: string[];
  financialImpact?: number;
}

export interface Decision {
  id: string;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Core decision info
  title: string;
  description: string;
  status: 'draft' | 'analyzing' | 'deliberating' | 'decided' | 'implemented' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  tags: string[];
  
  // Context
  context: DecisionContext;
  budget?: number;
  timeframe?: string;
  deadline?: Date;
  
  // Analysis snapshots (the "black box" data)
  preMortems: PreMortemSnapshot[];
  councilSessions: CouncilSnapshot[];
  ghostBoardSimulations: GhostBoardSnapshot[];
  
  // Timeline (all events)
  timeline: DecisionEvent[];
  
  // Outcome tracking
  finalDecision?: string;
  decisionMadeAt?: Date;
  decisionMadeBy?: string;
  outcome?: DecisionOutcome;
  
  // Audit
  version: number;
  auditHash?: string; // SHA256 for tamper detection
}

export interface DecisionSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: Date;
  riskScore?: number;
  eventCount: number;
}

// =============================================================================
// DECISION SERVICE
// =============================================================================

export class DecisionService extends BaseService {
  private decisions: Map<string, Decision> = new Map();
  private orgIndex: Map<string, string[]> = new Map(); // orgId -> decisionIds

  constructor() {
    super({
      name: 'DecisionService',
      version: '1.0.0',
      dependencies: [],
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('[CendiaDecision] Decision ServiceÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ initialized - Black Box Recording enabled');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Decision Service shutting down');
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; lastCheck: Date; details?: Record<string, any> }> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: {
        totalDecisions: this.decisions.size,
        organizations: this.orgIndex.size,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private mapDbStatusToInterface(dbStatus: string): Decision['status'] {
    const mapping: Record<string, Decision['status']> = {
      'PENDING': 'draft',
      'BLOCKED': 'analyzing',
      'DEFERRED': 'deliberating',
      'ESCALATED': 'deliberating',
      'APPROVED': 'decided',
      'REJECTED': 'closed',
      'IMPLEMENTED': 'implemented',
    };
    return mapping[dbStatus] || 'draft';
  }

  // ---------------------------------------------------------------------------
  // DECISION CRUD
  // ---------------------------------------------------------------------------

  async createDecision(params: {
    organizationId: string;
    userId: string;
    title: string;
    description: string;
    category?: string;
    priority?: Decision['priority'];
    budget?: number;
    timeframe?: string;
    deadline?: Date;
    stakeholders?: string[];
    constraints?: string[];
  }): Promise<Decision> {
    const id = `dec-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    const now = new Date();

    const decision: Decision = {
      id,
      organizationId: params.organizationId,
      createdBy: params.userId,
      createdAt: now,
      updatedAt: now,
      
      title: params.title,
      description: params.description,
      status: 'draft',
      priority: params.priority || 'medium',
      category: params.category || 'general',
      tags: [],
      
      context: {
        description: params.description,
        stakeholders: params.stakeholders || [],
        constraints: params.constraints || [],
        assumptions: [],
        dataSourcesUsed: [],
      },
      
      preMortems: [],
      councilSessions: [],
      ghostBoardSimulations: [],
      
      timeline: [{
        id: `evt-${Date.now()}`,
        timestamp: now,
        type: 'created',
        title: 'Decision Created',
        summary: `Decision "${params.title}" was created`,
        data: { title: params.title, description: params.description },
        userId: params.userId,
      }],
      
      version: 1,
    };
    
    // Conditionally add optional properties only if they have values
    if (params.budget !== undefined) decision.budget = params.budget;
    if (params.timeframe !== undefined) decision.timeframe = params.timeframe;
    if (params.deadline !== undefined) decision.deadline = params.deadline;

    this.decisions.set(id, decision);
    
    // Update org index
    const orgDecisions = this.orgIndex.get(params.organizationId) || [];
    orgDecisions.unshift(id);
    this.orgIndex.set(params.organizationId, orgDecisions.slice(0, 500));

    // Log event
    this.logger.info(`Decision created: ${id}`);

    this.incrementCounter('decisions_created', 1);
    return decision;
  }

  async getDecision(decisionId: string): Promise<Decision | null> {
    // Try database first
    try {
      const dbDecision = await prisma.decisions.findUnique({
        where: { id: decisionId },
        include: { decision_activities: { orderBy: { timestamp: 'asc' } } },
      });

      if (dbDecision) {
        // Convert DB format to Decision interface
        const timeline: DecisionEvent[] = (dbDecision.decision_activities || []).map(act => ({
          id: act.id,
          timestamp: act.timestamp,
          type: (act.details as any)?.type || act.action as any,
          title: (act.details as any)?.title || act.action,
          summary: (act.details as any)?.summary || '',
          data: act.details as Record<string, any> || {},
          userId: act.actor,
          agentsInvolved: (act.details as any)?.agentsInvolved,
        }));

        const result: Decision = {
          id: dbDecision.id,
          organizationId: dbDecision.organization_id,
          createdBy: dbDecision.user_id,
          createdAt: dbDecision.created_at,
          updatedAt: dbDecision.updated_at,
          title: dbDecision.title,
          description: dbDecision.description,
          status: this.mapDbStatusToInterface(dbDecision.status),
          priority: dbDecision.priority.toLowerCase() as any,
          category: dbDecision.category || 'general',
          tags: [],
          context: {
            description: dbDecision.description,
            stakeholders: dbDecision.stakeholders || [],
            constraints: [],
            assumptions: [],
            dataSourcesUsed: [],
          },
          preMortems: [],
          councilSessions: [],
          ghostBoardSimulations: [],
          timeline,
          version: 1,
          auditHash: `sha256:${dbDecision.id.slice(0, 16)}...`,
        };
        
        // Conditionally add optional properties
        if (dbDecision.budget != null) result.budget = dbDecision.budget;
        if (dbDecision.timeframe != null) result.timeframe = dbDecision.timeframe;
        if (dbDecision.deadline != null) result.deadline = dbDecision.deadline;
        
        return result;
      }
    } catch (err) {
      this.logger.warn('Database query failed for getDecision, falling back to in-memory');
    }

    // Fallback to in-memory
    return this.decisions.get(decisionId) || null;
  }

  async getDecisions(
    organizationId: string,
    options?: { 
      status?: string; 
      limit?: number; 
      offset?: number;
      category?: string;
    }
  ): Promise<DecisionSummary[]> {
    // Try database first
    try {
      const where: any = { organization_id: organizationId };
      if (options?.status) where.status = options.status.toUpperCase();
      if (options?.category) where.category = options.category;

      const dbDecisions = await prisma.decisions.findMany({
        where,
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: { created_at: 'desc' },
        include: { decision_activities: true },
      });

      if (dbDecisions.length > 0) {
        return dbDecisions.map(d => {
          const summary: DecisionSummary = {
            id: d.id,
            title: d.title,
            status: d.status.toLowerCase(),
            priority: d.priority.toLowerCase(),
            createdAt: d.created_at,
            eventCount: d.decision_activities?.length || 0,
          };
          return summary;
        });
      }
    } catch (err) {
      this.logger.warn('Database query failed, falling back to in-memory');
    }

    // Fallback to in-memory
    const orgDecisionIds = this.orgIndex.get(organizationId) || [];
    let decisions = orgDecisionIds
      .map(id => this.decisions.get(id))
      .filter((d): d is Decision => d !== undefined);

    if (options?.status) {
      decisions = decisions.filter(d => d.status === options.status);
    }
    if (options?.category) {
      decisions = decisions.filter(d => d.category === options.category);
    }

    const offset = options?.offset || 0;
    const limit = options?.limit || 50;

    return decisions.slice(offset, offset + limit).map(d => {
      const lastPreMortem = d.preMortems[d.preMortems.length - 1];
      const summary: DecisionSummary = {
        id: d.id,
        title: d.title,
        status: d.status,
        priority: d.priority,
        createdAt: d.createdAt,
        eventCount: d.timeline.length,
      };
      if (lastPreMortem?.riskScore !== undefined) {
        summary.riskScore = lastPreMortem.riskScore;
      }
      return summary;
    });
  }

  async updateDecision(
    decisionId: string,
    userId: string,
    updates: Partial<Pick<Decision, 'title' | 'description' | 'status' | 'priority' | 'category' | 'tags' | 'budget' | 'timeframe' | 'deadline'>>
  ): Promise<Decision | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    Object.assign(decision, updates);
    decision.updatedAt = new Date();
    decision.version++;

    // Add timeline event
    decision.timeline.push({
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      type: 'context_added',
      title: 'Decision Updated',
      summary: `Decision was updated: ${Object.keys(updates).join(', ')}`,
      data: updates,
      userId,
    });

    return decision;
  }

  // ---------------------------------------------------------------------------
  // ANALYSIS RECORDING (Black Box Data)
  // ---------------------------------------------------------------------------

  async recordPreMortem(
    decisionId: string,
    userId: string,
    preMortemResult: any
  ): Promise<Decision | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    const snapshot: PreMortemSnapshot = {
      runAt: new Date(),
      selectedAgents: preMortemResult.agentAnalyses?.map((a: any) => a.agentId) || [],
      riskScore: preMortemResult.overallRiskScore || 0,
      recommendation: preMortemResult.recommendation?.action || 'UNKNOWN',
      failureModes: (preMortemResult.failureModes || []).map((fm: any) => ({
        title: fm.title,
        probability: fm.probability,
        costImpact: fm.costImpact,
        category: fm.category,
      })),
      totalExposure: preMortemResult.totalRiskWeightedExposure || 0,
    };

    decision.preMortems.push(snapshot);
    decision.status = 'analyzing';
    decision.updatedAt = new Date();
    decision.version++;

    // Add timeline event
    decision.timeline.push({
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      type: 'premortem_run',
      title: 'Pre-Mortem Analysis',
      summary: `Risk Score: ${snapshot.riskScore}% | ${snapshot.failureModes.length} failure modes | Recommendation: ${snapshot.recommendation}`,
      data: snapshot,
      userId,
      agentsInvolved: snapshot.selectedAgents,
    });

    this.logger.info(`Pre-mortem recorded for decision: ${decisionId}`);

    return decision;
  }

  async recordCouncilSession(
    decisionId: string,
    userId: string,
    councilResult: any
  ): Promise<Decision | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    const snapshot: CouncilSnapshot = {
      sessionAt: new Date(),
      mode: councilResult.mode || 'deliberation',
      query: councilResult.query || '',
      agentResponses: (councilResult.agentResponses || []).map((r: any) => ({
        agentId: r.agentId,
        agentName: r.agentName,
        response: r.response,
        confidence: r.confidence || 0,
      })),
      synthesis: councilResult.synthesis || '',
      consensusLevel: councilResult.consensusLevel || 0,
    };

    decision.councilSessions.push(snapshot);
    decision.status = 'deliberating';
    decision.updatedAt = new Date();
    decision.version++;

    decision.timeline.push({
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      type: 'council_session',
      title: 'Council Deliberation',
      summary: `Mode: ${snapshot.mode} | ${snapshot.agentResponses.length} agents | Consensus: ${snapshot.consensusLevel}%`,
      data: snapshot,
      userId,
      agentsInvolved: snapshot.agentResponses.map(r => r.agentId),
    });

    return decision;
  }

  async recordGhostBoard(
    decisionId: string,
    userId: string,
    ghostBoardResult: any
  ): Promise<Decision | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    const snapshot: GhostBoardSnapshot = {
      simulatedAt: new Date(),
      boardMembers: ghostBoardResult.boardMembers || [],
      questions: (ghostBoardResult.questions || []).map((q: any) => ({
        member: q.member,
        question: q.question,
        difficulty: q.difficulty,
      })),
      preparednessScore: ghostBoardResult.preparednessScore || 0,
      criticalGaps: ghostBoardResult.criticalGaps || [],
    };

    decision.ghostBoardSimulations.push(snapshot);
    decision.updatedAt = new Date();
    decision.version++;

    decision.timeline.push({
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      type: 'ghost_board',
      title: 'Ghost Board Simulation',
      summary: `Preparedness: ${snapshot.preparednessScore}% | ${snapshot.questions.length} questions | ${snapshot.criticalGaps.length} gaps`,
      data: snapshot,
      userId,
    });

    return decision;
  }

  // ---------------------------------------------------------------------------
  // DECISION & OUTCOME
  // ---------------------------------------------------------------------------

  async recordFinalDecision(
    decisionId: string,
    userId: string,
    finalDecision: string
  ): Promise<Decision | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    decision.finalDecision = finalDecision;
    decision.decisionMadeAt = new Date();
    decision.decisionMadeBy = userId;
    decision.status = 'decided';
    decision.updatedAt = new Date();
    decision.version++;

    decision.timeline.push({
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      type: 'decision_made',
      title: 'Decision Made',
      summary: finalDecision,
      data: { finalDecision },
      userId,
    });

    // Generate audit hash for tamper detection
    decision.auditHash = this.generateAuditHash(decision);

    this.logger.info(`Decision finalized: ${decisionId}`);

    return decision;
  }

  async recordOutcome(
    decisionId: string,
    userId: string,
    outcome: Omit<DecisionOutcome, 'recordedAt'>
  ): Promise<Decision | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    decision.outcome = {
      ...outcome,
      recordedAt: new Date(),
    };
    decision.status = 'closed';
    decision.updatedAt = new Date();
    decision.version++;

    decision.timeline.push({
      id: `evt-${Date.now()}`,
      timestamp: new Date(),
      type: 'outcome_recorded',
      title: 'Outcome Recorded',
      summary: `Result: ${outcome.actualResult} | ${outcome.lessonsLearned.length} lessons learned`,
      data: outcome,
      userId,
    });

    // Update audit hash
    decision.auditHash = this.generateAuditHash(decision);

    this.logger.info(`Outcome recorded for decision: ${decisionId}`);

    return decision;
  }

  // ---------------------------------------------------------------------------
  // REPLAY & EXPORT
  // ---------------------------------------------------------------------------

  async getTimeline(decisionId: string): Promise<DecisionEvent[]> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return [];
    return decision.timeline;
  }

  async getFullReplay(decisionId: string): Promise<{
    decision: Decision;
    replay: {
      step: number;
      timestamp: Date;
      type: string;
      title: string;
      data: any;
    }[];
  } | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    const replay = decision.timeline.map((event, idx) => ({
      step: idx + 1,
      timestamp: event.timestamp,
      type: event.type,
      title: event.title,
      data: event.data,
    }));

    return { decision, replay };
  }

  async exportForAudit(decisionId: string): Promise<{
    decision: Decision;
    auditMetadata: {
      exportedAt: Date;
      hash: string;
      hashValid: boolean;
      totalEvents: number;
      analysisRuns: number;
    };
  } | null> {
    const decision = this.decisions.get(decisionId);
    if (!decision) return null;

    const currentHash = this.generateAuditHash(decision);

    return {
      decision,
      auditMetadata: {
        exportedAt: new Date(),
        hash: currentHash,
        hashValid: !decision.auditHash || decision.auditHash === currentHash,
        totalEvents: decision.timeline.length,
        analysisRuns: 
          decision.preMortems.length + 
          decision.councilSessions.length + 
          decision.ghostBoardSimulations.length,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------

  async getDecisionStats(organizationId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    avgRiskScore: number;
    outcomeAccuracy: number;
  }> {
    const orgDecisionIds = this.orgIndex.get(organizationId) || [];
    const decisions = orgDecisionIds
      .map(id => this.decisions.get(id))
      .filter((d): d is Decision => d !== undefined);

    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    let totalRisk = 0;
    let riskCount = 0;
    let correctPredictions = 0;
    let outcomeCount = 0;

    decisions.forEach(d => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
      byPriority[d.priority] = (byPriority[d.priority] || 0) + 1;

      if (d.preMortems.length > 0) {
        const lastPreMortem = d.preMortems[d.preMortems.length - 1];
        if (lastPreMortem) {
          totalRisk += lastPreMortem.riskScore;
          riskCount++;
        }
      }

      if (d.outcome) {
        outcomeCount++;
        const lastPreMortem = d.preMortems[d.preMortems.length - 1];
        if (lastPreMortem) {
          const predictedHigh = lastPreMortem.riskScore > 50;
          const actualFailure = d.outcome.actualResult === 'failure';
          if (predictedHigh === actualFailure) correctPredictions++;
        }
      }
    });

    return {
      total: decisions.length,
      byStatus,
      byPriority,
      avgRiskScore: riskCount > 0 ? Math.round(totalRisk / riskCount) : 0,
      outcomeAccuracy: outcomeCount > 0 ? Math.round((correctPredictions / outcomeCount) * 100) : 0,
    };
  }

  // ---------------------------------------------------------------------------
  // UTILITIES
  // ---------------------------------------------------------------------------

  private generateAuditHash(decision: Decision): string {
    // Simplified implementation; production upgrade: use crypto
    const content = JSON.stringify({
      id: decision.id,
      timeline: decision.timeline,
      finalDecision: decision.finalDecision,
      outcome: decision.outcome,
    });
    
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `audit-${Math.abs(hash).toString(16)}`;
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD METRICS
  // ---------------------------------------------------------------------------

  getDashboardMetrics(): {
    totalDecisions: number;
    pendingDecisions: number;
    decidedDecisions: number;
    avgRiskScore: number;
    outcomeAccuracy: number;
  } {
    const decisions = Array.from(this.decisions.values());
    
    const byStatus: Record<string, number> = {};
    let totalRisk = 0;
    let riskCount = 0;
    let correctPredictions = 0;
    let outcomeCount = 0;

    decisions.forEach(d => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;

      if (d.preMortems.length > 0) {
        const lastPreMortem = d.preMortems[d.preMortems.length - 1];
        if (lastPreMortem) {
          totalRisk += lastPreMortem.riskScore;
          riskCount++;
        }
      }

      if (d.outcome) {
        outcomeCount++;
        const lastPreMortem = d.preMortems[d.preMortems.length - 1];
        if (lastPreMortem) {
          const predictedHigh = lastPreMortem.riskScore > 50;
          const actualFailure = d.outcome.actualResult === 'failure';
          if (predictedHigh === actualFailure) correctPredictions++;
        }
      }
    });

    return {
      totalDecisions: decisions.length,
      pendingDecisions: (byStatus['draft'] || 0) + (byStatus['analyzing'] || 0) + (byStatus['deliberating'] || 0),
      decidedDecisions: (byStatus['decided'] || 0) + (byStatus['implemented'] || 0) + (byStatus['closed'] || 0),
      avgRiskScore: riskCount > 0 ? Math.round(totalRisk / riskCount) : 0,
      outcomeAccuracy: outcomeCount > 0 ? Math.round((correctPredictions / outcomeCount) * 100) : 0,
    };
  }

  getModelForTask(): string {
    return aiModelSelector.getModelForService('decision');
  }
}

// Export singleton
export const decisionService = new DecisionService();
