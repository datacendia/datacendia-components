/**
 * Service — Echo Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports echoService, DecisionOutcome, PatternInsight, AgentWeightAdjustment, DecisionROIEntry, AccuracyReport, OutcomeCollectionJob, EchoSignature
 * @module services/echoService
 */

// =============================================================================
// CENDIA ECHO™ - THE DECISION OUTCOME ENGINE
// "Every decision echoes through time. We measure the echo and make the next decision better."
// 
// Turns every Council decision into a provable, dollar-attributed outcome
// that automatically retrains the Council.
// =============================================================================

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import ollama from './ollama.js';
import crypto from 'crypto';
import { recordChronosEvent } from './ChronosEventBus.js';
// =============================================================================
// TYPES
// =============================================================================

export interface DecisionOutcome {
  id: string;
  deliberationId: string;
  decisionId: string;
  decisionTitle: string;
  decisionDate: Date;
  outcomeDate: Date;
  
  // Predictions vs Actuals
  predictions: {
    revenue?: { predicted: number; actual: number; variance: number; accuracy: number };
    profit?: { predicted: number; actual: number; variance: number; accuracy: number };
    headcount?: { predicted: number; actual: number; variance: number; accuracy: number };
    risk?: { predicted: number; actual: number; variance: number; accuracy: number };
    customerSatisfaction?: { predicted: number; actual: number; variance: number; accuracy: number };
    marketShare?: { predicted: number; actual: number; variance: number; accuracy: number };
  };
  
  // Financial Attribution
  dollarImpact: number;
  roi: number;
  
  // Success Classification
  status: 'success' | 'partial' | 'failure' | 'pending' | 'inconclusive';
  confidenceScore: number;
  
  // Metadata
  councilMode: string;
  participatingAgents: string[];
  votingPattern: Record<string, 'approve' | 'reject' | 'abstain'>;
  
  // Learning Insights
  patterns: PatternInsight[];
  weightAdjustments: AgentWeightAdjustment[];
}

export interface PatternInsight {
  id: string;
  pattern: string;
  successRate: number;
  sampleSize: number;
  confidence: number;
  factors: string[];
}

export interface AgentWeightAdjustment {
  agentId: string;
  agentRole: string;
  previousWeight: number;
  newWeight: number;
  adjustment: number;
  reason: string;
  deliberationId: string;
}

export interface DecisionROIEntry {
  id: string;
  decisionTitle: string;
  decisionDate: Date;
  dollarImpact: number;
  roi: number;
  status: 'positive' | 'negative' | 'neutral';
  rank: number;
  councilMode: string;
  leadAgent: string;
}

export interface AccuracyReport {
  overallAccuracy: number;
  byCategory: Record<string, number>;
  byAgent: Record<string, number>;
  byMode: Record<string, number>;
  trend: Array<{ date: string; accuracy: number }>;
  recommendations: string[];
}

export interface OutcomeCollectionJob {
  id: string;
  organizationId: string;
  deliberationId: string;
  decisionTitle: string;
  decisionDate: Date;
  scheduledCollectionDate: Date;
  dataSourceIds: string[];
  metricKeys: string[];
  status: 'scheduled' | 'collecting' | 'awaiting_review' | 'completed' | 'failed';
  collectedData?: Record<string, number>;
  error?: string;
}

export interface EchoSignature {
  algorithm: 'SHA-256-HMAC';
  hash: string;
  dataHash: string;
  timestamp: string;
  nonce: string;
  signatureChain: string;
}

// =============================================================================
// ECHO SERVICE
// =============================================================================

class EchoService {
  private outcomeCache: Map<string, DecisionOutcome> = new Map();

  /**
   * Link a decision to its measured outcome
   */
  async linkDecisionToOutcome(
    deliberationId: string,
    organizationId: string,
    outcomeData: {
      actualRevenue?: number;
      actualProfit?: number;
      actualHeadcount?: number;
      actualRisk?: number;
      actualSatisfaction?: number;
      actualMarketShare?: number;
      notes?: string;
    }
  ): Promise<DecisionOutcome> {
    try {
      // Fetch the original deliberation
      const deliberation = await prisma.deliberations.findUnique({
        where: { id: deliberationId },
        include: {
          deliberation_votes: true,
        },
      });

      if (!deliberation) {
        throw new Error(`Deliberation ${deliberationId} not found`);
      }

      // Extract predictions from deliberation context
      const context = deliberation.context as any || {};
      const predictions = {
        revenue: context.predictedRevenue ? {
          predicted: context.predictedRevenue,
          actual: outcomeData.actualRevenue || 0,
          variance: (outcomeData.actualRevenue || 0) - context.predictedRevenue,
          accuracy: this.calculateAccuracy(context.predictedRevenue, outcomeData.actualRevenue || 0),
        } : undefined,
        profit: context.predictedProfit ? {
          predicted: context.predictedProfit,
          actual: outcomeData.actualProfit || 0,
          variance: (outcomeData.actualProfit || 0) - context.predictedProfit,
          accuracy: this.calculateAccuracy(context.predictedProfit, outcomeData.actualProfit || 0),
        } : undefined,
        headcount: context.predictedHeadcount ? {
          predicted: context.predictedHeadcount,
          actual: outcomeData.actualHeadcount || 0,
          variance: (outcomeData.actualHeadcount || 0) - context.predictedHeadcount,
          accuracy: this.calculateAccuracy(context.predictedHeadcount, outcomeData.actualHeadcount || 0),
        } : undefined,
        risk: context.predictedRisk ? {
          predicted: context.predictedRisk,
          actual: outcomeData.actualRisk || 0,
          variance: (outcomeData.actualRisk || 0) - context.predictedRisk,
          accuracy: this.calculateAccuracy(context.predictedRisk, outcomeData.actualRisk || 0),
        } : undefined,
        customerSatisfaction: context.predictedSatisfaction ? {
          predicted: context.predictedSatisfaction,
          actual: outcomeData.actualSatisfaction || 0,
          variance: (outcomeData.actualSatisfaction || 0) - context.predictedSatisfaction,
          accuracy: this.calculateAccuracy(context.predictedSatisfaction, outcomeData.actualSatisfaction || 0),
        } : undefined,
        marketShare: context.predictedMarketShare ? {
          predicted: context.predictedMarketShare,
          actual: outcomeData.actualMarketShare || 0,
          variance: (outcomeData.actualMarketShare || 0) - context.predictedMarketShare,
          accuracy: this.calculateAccuracy(context.predictedMarketShare, outcomeData.actualMarketShare || 0),
        } : undefined,
      };

      // Calculate dollar impact
      const dollarImpact = this.calculateDollarImpact(predictions, outcomeData);
      const roi = this.calculateROI(dollarImpact, context.estimatedCost || 0);

      // Determine success status
      const status = this.classifyOutcome(predictions, dollarImpact);

      // Get voting pattern
      const votingPattern: Record<string, 'approve' | 'reject' | 'abstain'> = {};
      for (const vote of deliberation.deliberation_votes) {
        votingPattern[vote.agent_role] = vote.vote as 'approve' | 'reject' | 'abstain';
      }

      // Calculate confidence
      const confidenceScore = this.calculateConfidence(predictions);

      // Store outcome in database
      const outcome = await prisma.decision_outcomes.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: organizationId,
          deliberation_id: deliberationId,
          decision_title: deliberation.question,
          decision_date: deliberation.created_at,
          outcome_date: new Date(),
          predictions: predictions as any,
          dollar_impact: dollarImpact,
          roi: roi,
          status: status,
          confidence_score: confidenceScore,
          council_mode: deliberation.mode || 'standard',
          participating_agents: deliberation.deliberation_votes.map(v => v.agent_role),
          voting_pattern: votingPattern as any,
          notes: outcomeData.notes,
        },
      });

      // Trigger agent weight adjustments
      const weightAdjustments = await this.calculateAgentWeightAdjustments(
        deliberation,
        status,
        confidenceScore,
        organizationId
      );

      // Identify patterns
      const patterns = await this.identifyPatterns(organizationId);

      const result: DecisionOutcome = {
        id: outcome.id,
        deliberationId: deliberationId,
        decisionId: deliberation.id,
        decisionTitle: deliberation.question,
        decisionDate: deliberation.created_at,
        outcomeDate: new Date(),
        predictions,
        dollarImpact,
        roi,
        status,
        confidenceScore,
        councilMode: deliberation.mode || 'standard',
        participatingAgents: deliberation.deliberation_votes.map(v => v.agent_role),
        votingPattern,
        patterns,
        weightAdjustments,
      };

      this.outcomeCache.set(outcome.id, result);
      logger.info('[Echo] Decision outcome linked:', { deliberationId, status, dollarImpact });

      // Record to Chronos timeline
      recordChronosEvent({
        organizationId,
        eventType: status === 'success' ? 'decision_outcome_success' : status === 'failure' ? 'decision_outcome_failure' : 'decision_outcome_linked',
        category: 'echo',
        severity: status === 'failure' ? 'high' : 'info',
        title: `Echo: ${deliberation.question?.substring(0, 60) || 'Decision'} → ${status}`,
        description: `Dollar Impact: $${dollarImpact.toLocaleString()} | ROI: ${(roi * 100).toFixed(1)}% | Accuracy: ${(confidenceScore * 100).toFixed(1)}%`,
        actorType: 'system',
        resourceType: 'decision_outcome',
        resourceId: outcome.id,
        impact: dollarImpact > 0 ? 'positive' : dollarImpact < 0 ? 'negative' : 'neutral',
        magnitude: Math.min(10, Math.ceil(Math.abs(dollarImpact) / 100000)),
        parentEventId: deliberationId,
        metadata: { dollarImpact, roi, status, confidenceScore, agents: result.participatingAgents },
      });

      return result;
    } catch (error) {
      logger.error('[Echo] Failed to link outcome:', error);
      throw error;
    }
  }

  /**
   * Get Decision ROI Leaderboard
   */
  async getROILeaderboard(
    organizationId: string,
    options: {
      limit?: number;
      period?: 'week' | 'month' | 'quarter' | 'year' | 'all';
      sortBy?: 'impact' | 'roi' | 'date';
    } = {}
  ): Promise<DecisionROIEntry[]> {
    const { limit = 50, period = 'quarter', sortBy = 'impact' } = options;

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    const outcomes = await prisma.decision_outcomes.findMany({
      where: {
        organization_id: organizationId,
        decision_date: { gte: startDate },
      },
      orderBy: sortBy === 'impact' 
        ? { dollar_impact: 'desc' }
        : sortBy === 'roi'
        ? { roi: 'desc' }
        : { decision_date: 'desc' },
      take: limit,
    });

    return outcomes.map((o, index) => ({
      id: o.id,
      decisionTitle: o.decision_title,
      decisionDate: o.decision_date,
      dollarImpact: o.dollar_impact?.toNumber() || 0,
      roi: o.roi?.toNumber() || 0,
      status: o.dollar_impact && o.dollar_impact.toNumber() > 0 
        ? 'positive' 
        : o.dollar_impact && o.dollar_impact.toNumber() < 0 
        ? 'negative' 
        : 'neutral',
      rank: index + 1,
      councilMode: o.council_mode || 'standard',
      leadAgent: (o.participating_agents as string[])?.[0] || 'Unknown',
    }));
  }

  /**
   * Get Prediction Accuracy Report
   */
  async getAccuracyReport(organizationId: string): Promise<AccuracyReport> {
    const outcomes = await prisma.decision_outcomes.findMany({
      where: { organization_id: organizationId },
      orderBy: { decision_date: 'asc' },
    });

    if (outcomes.length === 0) {
      return {
        overallAccuracy: 0,
        byCategory: {},
        byAgent: {},
        byMode: {},
        trend: [],
        recommendations: ['No decision outcomes recorded yet. Start linking decisions to outcomes.'],
      };
    }

    // Calculate overall accuracy
    const accuracies: number[] = [];
    const byCategory: Record<string, number[]> = {};
    const byAgent: Record<string, number[]> = {};
    const byMode: Record<string, number[]> = {};
    const trendData: Map<string, number[]> = new Map();

    for (const outcome of outcomes) {
      const predictions = outcome.predictions as any;
      const agents = outcome.participating_agents as string[];
      const mode = outcome.council_mode || 'standard';
      const dateKey = outcome.decision_date.toISOString().split('T')[0];

      // Extract accuracies from predictions
      for (const [category, data] of Object.entries(predictions)) {
        if (data && typeof data === 'object' && 'accuracy' in (data as any)) {
          const accuracy = (data as any).accuracy;
          accuracies.push(accuracy);
          
          if (!byCategory[category]) { byCategory[category] = []; }
          byCategory[category].push(accuracy);

          if (!trendData.has(dateKey)) { trendData.set(dateKey, []); }
          trendData.get(dateKey)!.push(accuracy);
        }
      }

      // Track by agent
      for (const agent of agents) {
        if (!byAgent[agent]) { byAgent[agent] = []; }
        byAgent[agent].push(outcome.confidence_score?.toNumber() || 0);
      }

      // Track by mode
      if (!byMode[mode]) { byMode[mode] = []; }
      byMode[mode].push(outcome.confidence_score?.toNumber() || 0);
    }

    // Calculate averages
    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const overallAccuracy = avg(accuracies);
    const categoryAccuracy = Object.fromEntries(
      Object.entries(byCategory).map(([k, v]) => [k, avg(v)])
    );
    const agentAccuracy = Object.fromEntries(
      Object.entries(byAgent).map(([k, v]) => [k, avg(v)])
    );
    const modeAccuracy = Object.fromEntries(
      Object.entries(byMode).map(([k, v]) => [k, avg(v)])
    );

    // Generate trend
    const trend = Array.from(trendData.entries())
      .map(([date, accs]) => ({ date, accuracy: avg(accs) }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Generate recommendations using AI
    const recommendations = await this.generateRecommendations(
      overallAccuracy,
      categoryAccuracy,
      agentAccuracy,
      modeAccuracy
    );

    return {
      overallAccuracy,
      byCategory: categoryAccuracy,
      byAgent: agentAccuracy,
      byMode: modeAccuracy,
      trend,
      recommendations,
    };
  }

  /**
   * Get outcome for a specific decision
   */
  async getDecisionOutcome(deliberationId: string): Promise<DecisionOutcome | null> {
    const outcome = await prisma.decision_outcomes.findFirst({
      where: { deliberation_id: deliberationId },
    });

    if (!outcome) { return null; }

    const deliberation = await prisma.deliberations.findUnique({
      where: { id: deliberationId },
      include: { deliberation_votes: true },
    });

    return {
      id: outcome.id,
      deliberationId: outcome.deliberation_id,
      decisionId: outcome.deliberation_id,
      decisionTitle: outcome.decision_title,
      decisionDate: outcome.decision_date,
      outcomeDate: outcome.outcome_date,
      predictions: outcome.predictions as any,
      dollarImpact: outcome.dollar_impact?.toNumber() || 0,
      roi: outcome.roi?.toNumber() || 0,
      status: outcome.status as any,
      confidenceScore: outcome.confidence_score?.toNumber() || 0,
      councilMode: outcome.council_mode || 'standard',
      participatingAgents: outcome.participating_agents as string[],
      votingPattern: outcome.voting_pattern as any,
      patterns: [],
      weightAdjustments: [],
    };
  }

  /**
   * Generate "Was This Right?" Report
   */
  async generateOutcomeReport(
    deliberationId: string,
    organizationId: string
  ): Promise<{
    summary: string;
    sections: Array<{ title: string; content: string }>;
    signature: EchoSignature;
    generatedAt: Date;
  }> {
    const outcome = await this.getDecisionOutcome(deliberationId);
    if (!outcome) {
      throw new Error('No outcome found for this decision');
    }

    const deliberation = await prisma.deliberations.findUnique({
      where: { id: deliberationId },
      include: { deliberation_votes: true },
    });

    // Generate report using AI
    const isOllamaAvailable = await ollama.isAvailable();
    let summary = '';

    if (isOllamaAvailable) {
      const prompt = `Generate a professional executive summary for this decision outcome report:

Decision: ${outcome.decisionTitle}
Date: ${outcome.decisionDate.toISOString()}
Status: ${outcome.status}
Dollar Impact: $${outcome.dollarImpact.toLocaleString()}
ROI: ${(outcome.roi * 100).toFixed(1)}%
Accuracy: ${(outcome.confidenceScore * 100).toFixed(1)}%

Predictions vs Actuals:
${JSON.stringify(outcome.predictions, null, 2)}

Provide a 3-4 sentence executive summary suitable for board presentation.`;

      const response = await ollama.chat([{ role: 'user', content: prompt }]);
      summary = response.content;
    } else {
      summary = `Decision "${outcome.decisionTitle}" resulted in a ${outcome.status} outcome with ` +
        `$${outcome.dollarImpact.toLocaleString()} dollar impact and ${(outcome.roi * 100).toFixed(1)}% ROI. ` +
        `Prediction accuracy was ${(outcome.confidenceScore * 100).toFixed(1)}%.`;
    }

    // Generate cryptographic signature (SHA-256 HMAC)
    const sigTimestamp = new Date().toISOString();
    const sigNonce = crypto.randomUUID();
    const signaturePayload = JSON.stringify({
      deliberationId,
      outcome: outcome.status,
      dollarImpact: outcome.dollarImpact,
      predictions: outcome.predictions,
      votingPattern: outcome.votingPattern,
      participatingAgents: outcome.participatingAgents,
      timestamp: sigTimestamp,
      nonce: sigNonce,
    });
    const dataHash = crypto.createHash('sha256').update(signaturePayload).digest('hex');
    // HMAC uses a server-side secret; throw in production if not configured
    const echoEnvKey = process.env.ECHO_SIGNING_KEY;
    if (!echoEnvKey && process.env.NODE_ENV === 'production') {
      throw new Error('ECHO_SIGNING_KEY must be set in production');
    }
    const hmacKey = echoEnvKey || crypto.createHash('sha256').update('datacendia-echo-dev-key').digest('hex');
    const hmac = crypto.createHmac('sha256', hmacKey).update(dataHash + sigTimestamp + sigNonce).digest('hex');
    // Chain: hash of previous report signature for tamper-evident sequencing
    const previousOutcomes = await prisma.decision_outcomes.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: 1,
      select: { id: true },
    });
    const previousId = previousOutcomes.length > 0 ? previousOutcomes[0].id : 'GENESIS';
    const signatureChain = crypto.createHash('sha256').update(previousId + dataHash).digest('hex');

    const echoSignature: EchoSignature = {
      algorithm: 'SHA-256-HMAC',
      hash: hmac,
      dataHash,
      timestamp: sigTimestamp,
      nonce: sigNonce,
      signatureChain,
    };

    return {
      summary,
      sections: [
        { title: 'Decision Overview', content: `Original Question: ${outcome.decisionTitle}` },
        { title: 'Financial Impact', content: `Dollar Impact: $${outcome.dollarImpact.toLocaleString()} | ROI: ${(outcome.roi * 100).toFixed(1)}%` },
        { title: 'Prediction Accuracy', content: `Overall Accuracy: ${(outcome.confidenceScore * 100).toFixed(1)}%` },
        { title: 'Council Participants', content: outcome.participatingAgents.join(', ') },
        { title: 'Voting Record', content: JSON.stringify(outcome.votingPattern, null, 2) },
      ],
      signature: echoSignature,
      generatedAt: new Date(),
    };
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  private calculateAccuracy(predicted: number, actual: number): number {
    if (predicted === 0 && actual === 0) { return 100; }
    if (predicted === 0) { return 0; }
    const error = Math.abs(actual - predicted) / Math.abs(predicted);
    return Math.max(0, Math.min(100, (1 - error) * 100));
  }

  private calculateDollarImpact(
    predictions: any,
    outcomeData: any
  ): number {
    let impact = 0;
    if (predictions.revenue?.actual) {
      impact += predictions.revenue.variance;
    }
    if (predictions.profit?.actual) {
      impact += predictions.profit.variance;
    }
    return impact;
  }

  private calculateROI(dollarImpact: number, cost: number): number {
    if (cost === 0) { return dollarImpact > 0 ? 1 : 0; }
    return dollarImpact / cost;
  }

  private classifyOutcome(predictions: any, dollarImpact: number): 'success' | 'partial' | 'failure' | 'pending' | 'inconclusive' {
    const accuracies: number[] = [];
    for (const data of Object.values(predictions)) {
      if (data && typeof data === 'object' && 'accuracy' in (data as any)) {
        accuracies.push((data as any).accuracy);
      }
    }

    if (accuracies.length === 0) { return 'inconclusive'; }

    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;

    if (avgAccuracy >= 80 && dollarImpact > 0) { return 'success'; }
    if (avgAccuracy >= 60 || dollarImpact > 0) { return 'partial'; }
    if (dollarImpact < 0) { return 'failure'; }
    return 'inconclusive';
  }

  private calculateConfidence(predictions: any): number {
    const accuracies: number[] = [];
    for (const data of Object.values(predictions)) {
      if (data && typeof data === 'object' && 'accuracy' in (data as any)) {
        accuracies.push((data as any).accuracy);
      }
    }
    if (accuracies.length === 0) { return 0; }
    return accuracies.reduce((a, b) => a + b, 0) / accuracies.length / 100;
  }

  private async calculateAgentWeightAdjustments(
    deliberation: any,
    status: string,
    confidence: number,
    organizationId: string
  ): Promise<AgentWeightAdjustment[]> {
    const adjustments: AgentWeightAdjustment[] = [];

    // Get current agent weights (global agents table)
    const agents = await prisma.agents.findMany();

    for (const vote of deliberation.deliberation_votes) {
      const agent = agents.find(a => a.role === vote.agent_role);
      if (!agent) { continue; }

      const currentWeight = (agent.model_config as any)?.weight || 1.0;
      let adjustment = 0;

      // Bayesian-style weight adjustment
      if (status === 'success') {
        if (vote.vote === 'approve') {
          adjustment = 0.05 * confidence; // Reward correct approval
        } else if (vote.vote === 'reject') {
          adjustment = -0.02 * confidence; // Small penalty for wrong rejection
        }
      } else if (status === 'failure') {
        if (vote.vote === 'approve') {
          adjustment = -0.05 * confidence; // Penalty for wrong approval
        } else if (vote.vote === 'reject') {
          adjustment = 0.03 * confidence; // Reward correct rejection
        }
      }

      if (Math.abs(adjustment) > 0.001) {
        const newWeight = Math.max(0.1, Math.min(2.0, currentWeight + adjustment));

        // Update agent weight in database
        await prisma.agents.update({
          where: { id: agent.id },
          data: {
            model_config: {
              ...(agent.model_config as any),
              weight: newWeight,
            },
          },
        });

        // Write to agent_weight_history for full audit trail
        await prisma.agent_weight_history.create({
          data: {
            id: crypto.randomUUID(),
            organization_id: organizationId,
            agent_id: agent.id,
            agent_role: agent.role,
            previous_weight: currentWeight,
            new_weight: newWeight,
            adjustment: adjustment,
            reason: `Decision ${deliberation.id} outcome was ${status} (confidence: ${(confidence * 100).toFixed(1)}%, vote: ${vote.vote})`,
            deliberation_id: deliberation.id,
          },
        });

        adjustments.push({
          agentId: agent.id,
          agentRole: agent.role,
          previousWeight: currentWeight,
          newWeight,
          adjustment,
          reason: `Decision ${deliberation.id} was ${status}`,
          deliberationId: deliberation.id,
        });

        logger.info('[Echo] Agent weight adjusted and history recorded:', {
          agent: agent.role,
          from: currentWeight,
          to: newWeight,
          historyLogged: true,
        });

        // Record to Chronos timeline
        recordChronosEvent({
          organizationId,
          eventType: 'agent_weight_adjusted',
          category: 'echo',
          severity: Math.abs(adjustment) > 0.03 ? 'medium' : 'low',
          title: `Agent Weight: ${agent.role} ${adjustment > 0 ? '↑' : '↓'} ${Math.abs(adjustment).toFixed(4)}`,
          description: `${currentWeight.toFixed(4)} → ${newWeight.toFixed(4)} | Decision ${deliberation.id} was ${status}`,
          actorType: 'system',
          resourceType: 'agent',
          resourceId: agent.id,
          impact: adjustment > 0 ? 'positive' : 'negative',
          magnitude: Math.min(10, Math.ceil(Math.abs(adjustment) * 100)),
          parentEventId: deliberation.id,
          metadata: { previousWeight: currentWeight, newWeight, adjustment, vote: vote.vote, confidence },
        });
      }
    }

    return adjustments;
  }

  private async identifyPatterns(organizationId: string): Promise<PatternInsight[]> {
    const outcomes = await prisma.decision_outcomes.findMany({
      where: { organization_id: organizationId },
      orderBy: { decision_date: 'desc' },
      take: 100,
    });

    const patterns: PatternInsight[] = [];

    // Pattern: Mode success rates
    const modeStats: Record<string, { success: number; total: number }> = {};
    for (const o of outcomes) {
      const mode = o.council_mode || 'standard';
      if (!modeStats[mode]) { modeStats[mode] = { success: 0, total: 0 }; }
      modeStats[mode].total++;
      if (o.status === 'success') { modeStats[mode].success++; }
    }

    for (const [mode, stats] of Object.entries(modeStats)) {
      if (stats.total >= 5) {
        patterns.push({
          id: crypto.randomUUID(),
          pattern: `Decisions in ${mode} mode`,
          successRate: (stats.success / stats.total) * 100,
          sampleSize: stats.total,
          confidence: Math.min(1, stats.total / 20),
          factors: ['council_mode'],
        });
      }
    }

    return patterns;
  }

  private async generateRecommendations(
    overall: number,
    byCategory: Record<string, number>,
    byAgent: Record<string, number>,
    byMode: Record<string, number>
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Low overall accuracy
    if (overall < 70) {
      recommendations.push('Overall prediction accuracy is below 70%. Consider reviewing data sources and model inputs.');
    }

    // Category-specific recommendations
    for (const [category, accuracy] of Object.entries(byCategory)) {
      if (accuracy < 60) {
        recommendations.push(`${category} predictions are underperforming (${accuracy.toFixed(1)}%). Review ${category} forecasting models.`);
      }
    }

    // Agent-specific recommendations
    const sortedAgents = Object.entries(byAgent).sort((a, b) => a[1] - b[1]);
    if (sortedAgents.length > 0 && sortedAgents[0][1] < 50) {
      recommendations.push(`Agent "${sortedAgents[0][0]}" has low accuracy (${sortedAgents[0][1].toFixed(1)}%). Consider retraining or adjusting weight.`);
    }

    // Mode-specific recommendations
    const bestMode = Object.entries(byMode).sort((a, b) => b[1] - a[1])[0];
    if (bestMode && bestMode[1] > overall + 10) {
      recommendations.push(`"${bestMode[0]}" mode has ${(bestMode[1] - overall).toFixed(1)}% higher accuracy. Consider using it more frequently.`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Decision accuracy is within acceptable ranges. Continue monitoring for trends.');
    }

    return recommendations;
  }
  // ==========================================================================
  // AUTOMATED OUTCOME COLLECTION
  // ==========================================================================

  private collectionJobs: Map<string, OutcomeCollectionJob> = new Map();
  private collectionInterval: ReturnType<typeof setInterval> | null = null;



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  /**
   * Schedule automated outcome collection for a decision.
   * After a deliberation completes, call this to auto-collect actuals
   * from connected data sources at a future date.
   */
  async scheduleOutcomeCollection(
    organizationId: string,
    deliberationId: string,
    options: {
      collectionDelayDays?: number;     // How many days after decision to collect (default: 30)
      dataSourceIds?: string[];          // Which data sources to pull actuals from
      metricKeys?: string[];             // Which metrics to collect (revenue, profit, headcount, etc.)
    } = {}
  ): Promise<OutcomeCollectionJob> {
    const { collectionDelayDays = 30, dataSourceIds = [], metricKeys = ['revenue', 'profit'] } = options;

    const deliberation = await prisma.deliberations.findUnique({
      where: { id: deliberationId },
    });

    if (!deliberation) {
      throw new Error(`Deliberation ${deliberationId} not found`);
    }

    // Check if already scheduled
    const existing = await prisma.echo_collection_jobs.findFirst({
      where: { deliberation_id: deliberationId, status: { in: ['scheduled', 'collecting'] } },
    });
    if (existing) {
      throw new Error(`Outcome collection already scheduled for deliberation ${deliberationId}`);
    }

    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + collectionDelayDays);

    const job = await prisma.echo_collection_jobs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        deliberation_id: deliberationId,
        decision_title: deliberation.question,
        decision_date: deliberation.created_at,
        scheduled_collection_date: scheduledDate,
        data_source_ids: dataSourceIds,
        metric_keys: metricKeys,
        status: 'scheduled',
      },
    });

    const collectionJob: OutcomeCollectionJob = {
      id: job.id,
      organizationId,
      deliberationId,
      decisionTitle: deliberation.question,
      decisionDate: deliberation.created_at,
      scheduledCollectionDate: scheduledDate,
      dataSourceIds,
      metricKeys,
      status: 'scheduled',
    };

    this.collectionJobs.set(job.id, collectionJob);
    logger.info('[Echo] Outcome collection scheduled:', {
      deliberationId,
      collectAt: scheduledDate.toISOString(),
      metricKeys,
      dataSourceIds,
    });

    return collectionJob;
  }

  /**
   * Get all scheduled outcome collection jobs for an organization
   */
  async getCollectionJobs(
    organizationId: string,
    options: { status?: string; limit?: number } = {}
  ): Promise<OutcomeCollectionJob[]> {
    const { status, limit = 50 } = options;

    const where: any = { organization_id: organizationId };
    if (status) { where.status = status; }

    const jobs = await prisma.echo_collection_jobs.findMany({
      where,
      orderBy: { scheduled_collection_date: 'asc' },
      take: limit,
    });

    return jobs.map((j: any) => ({
      id: j.id,
      organizationId: j.organization_id,
      deliberationId: j.deliberation_id,
      decisionTitle: j.decision_title,
      decisionDate: j.decision_date,
      scheduledCollectionDate: j.scheduled_collection_date,
      dataSourceIds: j.data_source_ids as string[],
      metricKeys: j.metric_keys as string[],
      status: j.status as OutcomeCollectionJob['status'],
      collectedData: j.collected_data as Record<string, number> | undefined,
      error: j.error || undefined,
    }));
  }

  /**
   * Cancel a scheduled collection job
   */
  async cancelCollectionJob(jobId: string): Promise<void> {
    await prisma.echo_collection_jobs.update({
      where: { id: jobId },
      data: { status: 'cancelled' },
    });
    this.collectionJobs.delete(jobId);
    logger.info('[Echo] Collection job cancelled:', { jobId });
  }

  /**
   * Process due outcome collection jobs.
   * Pulls actuals from connected data sources and creates draft outcomes
   * for human review before final linking.
   */
  async processDueCollections(): Promise<{ processed: number; failed: number }> {
    const now = new Date();
    let processed = 0;
    let failed = 0;

    const dueJobs = await prisma.echo_collection_jobs.findMany({
      where: {
        status: 'scheduled',
        scheduled_collection_date: { lte: now },
      },
      take: 50,
    });

    for (const job of dueJobs) {
      try {
        // Mark as collecting
        await prisma.echo_collection_jobs.update({
          where: { id: job.id },
          data: { status: 'collecting' },
        });

        // Collect actuals from data sources
        const collectedData = await this.collectActualsFromSources(
          job.organization_id,
          job.data_source_ids as string[],
          job.metric_keys as string[],
          job.decision_date,
        );

        // Update job with collected data — mark awaiting_review so a human confirms
        await prisma.echo_collection_jobs.update({
          where: { id: job.id },
          data: {
            status: 'awaiting_review',
            collected_data: collectedData as any,
            collected_at: now,
          },
        });

        logger.info('[Echo] Outcome data collected, awaiting review:', {
          jobId: job.id,
          deliberationId: job.deliberation_id,
          collectedData,
        });

        processed++;
      } catch (error: unknown) {
        await prisma.echo_collection_jobs.update({
          where: { id: job.id },
          data: {
            status: 'failed',
            error: (error as Error).message || 'Unknown collection error',
          },
        });
        logger.error('[Echo] Collection job failed:', { jobId: job.id, error: (error as Error).message });
        failed++;
      }
    }

    return { processed, failed };
  }

  /**
   * Approve collected data and link it as the official outcome
   */
  async approveCollectedOutcome(
    jobId: string,
    overrides?: Partial<{
      actualRevenue: number;
      actualProfit: number;
      actualHeadcount: number;
      actualRisk: number;
      actualSatisfaction: number;
      actualMarketShare: number;
      notes: string;
    }>
  ): Promise<DecisionOutcome> {
    const job = await prisma.echo_collection_jobs.findUnique({ where: { id: jobId } });
    if (!job) { throw new Error(`Collection job ${jobId} not found`); }
    if (job.status !== 'awaiting_review') {
      throw new Error(`Job ${jobId} is not awaiting review (current status: ${job.status})`);
    }

    const collected = (job.collected_data as Record<string, number>) || {};

    // Merge collected data with any manual overrides
    const outcomeData = {
      actualRevenue: overrides?.actualRevenue ?? collected.revenue,
      actualProfit: overrides?.actualProfit ?? collected.profit,
      actualHeadcount: overrides?.actualHeadcount ?? collected.headcount,
      actualRisk: overrides?.actualRisk ?? collected.risk,
      actualSatisfaction: overrides?.actualSatisfaction ?? collected.customerSatisfaction,
      actualMarketShare: overrides?.actualMarketShare ?? collected.marketShare,
      notes: overrides?.notes || `Auto-collected on ${job.collected_at?.toISOString() || 'N/A'}, approved by human reviewer`,
    };

    // Link the outcome using the core method
    const outcome = await this.linkDecisionToOutcome(
      job.deliberation_id,
      job.organization_id,
      outcomeData,
    );

    // Mark collection job as completed
    await prisma.echo_collection_jobs.update({
      where: { id: jobId },
      data: { status: 'completed' },
    });

    logger.info('[Echo] Collected outcome approved and linked:', {
      jobId,
      deliberationId: job.deliberation_id,
      status: outcome.status,
      dollarImpact: outcome.dollarImpact,
    });

    return outcome;
  }

  /**
   * Pull actual metrics from connected data sources.
   * Queries the Helm pillar (metrics) and any configured external data sources.
   */
  private async collectActualsFromSources(
    organizationId: string,
    dataSourceIds: string[],
    metricKeys: string[],
    decisionDate: Date,
  ): Promise<Record<string, number>> {
    const actuals: Record<string, number> = {};

    // Strategy 1: Pull from Helm metrics (metric_definitions + metric_values)
    try {
      for (const key of metricKeys) {
        const metricName = this.mapMetricKeyToHelmName(key);
        const metricDef = await prisma.metric_definitions.findFirst({
          where: {
            organization_id: organizationId,
            name: { contains: metricName, mode: 'insensitive' },
          },
        });

        if (metricDef) {
          const latestValue = await prisma.metric_values.findFirst({
            where: { metric_id: metricDef.id },
            orderBy: { timestamp: 'desc' },
          });
          if (latestValue && latestValue.value !== null) {
            actuals[key] = latestValue.value;
            logger.debug(`[Echo] Collected ${key} from Helm metrics: ${latestValue.value}`);
          }
        }
      }
    } catch (error) {
      logger.warn('[Echo] Failed to collect from Helm metrics:', error);
    }

    // Strategy 2: Pull from connected data sources
    if (dataSourceIds.length > 0) {
      try {
        const sources = await prisma.data_sources.findMany({
          where: {
            id: { in: dataSourceIds },
            organization_id: organizationId,
            status: 'CONNECTED',
          },
        });

        for (const source of sources) {
          const sourceConfig = source.config as any;
          const sourceMetadata = source.metadata as any;

          // Extract latest values from source metadata (data sources sync periodically)
          if (sourceMetadata?.latestMetrics) {
            for (const key of metricKeys) {
              if (sourceMetadata.latestMetrics[key] !== undefined && actuals[key] === undefined) {
                actuals[key] = sourceMetadata.latestMetrics[key];
                logger.debug(`[Echo] Collected ${key} from data source ${source.name}: ${actuals[key]}`);
              }
            }
          }
        }
      } catch (error) {
        logger.warn('[Echo] Failed to collect from data sources:', error);
      }
    }

    // Strategy 3: Pull from decision_outcomes already in the system (for related decisions)
    // This helps when partial data has been manually entered
    try {
      const recentOutcomes = await prisma.decision_outcomes.findMany({
        where: {
          organization_id: organizationId,
          decision_date: { gte: decisionDate },
        },
        orderBy: { outcome_date: 'desc' },
        take: 5,
      });

      for (const outcome of recentOutcomes) {
        const predictions = outcome.predictions as any;
        for (const key of metricKeys) {
          if (predictions?.[key]?.actual !== undefined && actuals[key] === undefined) {
            actuals[key] = predictions[key].actual;
          }
        }
      }
    } catch (error) {
      logger.warn('[Echo] Failed to collect from related outcomes:', error);
    }

    return actuals;
  }

  /**
   * Map Echo metric keys to Helm metric names
   */
  private mapMetricKeyToHelmName(key: string): string {
    const mapping: Record<string, string> = {
      revenue: 'revenue',
      profit: 'profit',
      headcount: 'headcount',
      risk: 'risk_score',
      customerSatisfaction: 'customer_satisfaction',
      marketShare: 'market_share',
    };
    return mapping[key] || key;
  }

  /**
   * Start the automated collection scheduler.
   * Runs every hour to check for due collection jobs.
   */
  startCollectionScheduler(intervalMs: number = 60 * 60 * 1000): void {
    if (this.collectionInterval) {
      logger.warn('[Echo] Collection scheduler already running');
      return;
    }

    logger.info('[Echo] Starting automated outcome collection scheduler', {
      intervalMs,
      intervalHuman: `${(intervalMs / 60000).toFixed(0)} minutes`,
    });

    // Run immediately on start
    this.processDueCollections().catch(err =>
      logger.error('[Echo] Initial collection run failed:', err)
    );

    // Then run on interval
    this.collectionInterval = setInterval(async () => {
      try {
        const result = await this.processDueCollections();
        if (result.processed > 0 || result.failed > 0) {
          logger.info('[Echo] Scheduler run complete:', result);
        }
      } catch (error) {
        logger.error('[Echo] Scheduler run failed:', error);
      }
    }, intervalMs);
  }

  /**
   * Stop the automated collection scheduler
   */
  stopCollectionScheduler(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
      logger.info('[Echo] Collection scheduler stopped');
    }
  }

  /**
   * Get weight adjustment history for an agent
   */
  async getAgentWeightHistory(
    organizationId: string,
    agentId?: string,
    limit: number = 50
  ): Promise<AgentWeightAdjustment[]> {
    const where: any = { organization_id: organizationId };
    if (agentId) { where.agent_id = agentId; }

    const history = await prisma.agent_weight_history.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return history.map(h => ({
      agentId: h.agent_id,
      agentRole: h.agent_role,
      previousWeight: h.previous_weight.toNumber(),
      newWeight: h.new_weight.toNumber(),
      adjustment: h.adjustment.toNumber(),
      reason: h.reason,
      deliberationId: h.deliberation_id || '',
    }));
  }

  /**
   * Get decisions that are pending outcome linkage (no outcome recorded yet)
   */
  async getPendingDecisions(
    organizationId: string,
    options: { olderThanDays?: number; limit?: number } = {}
  ): Promise<Array<{
    deliberationId: string;
    question: string;
    decidedAt: Date;
    daysSinceDecision: number;
    mode: string;
    hasScheduledCollection: boolean;
  }>> {
    const { olderThanDays = 7, limit = 50 } = options;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);

    // Find deliberations that have completed but don't have an outcome
    const deliberations = await prisma.deliberations.findMany({
      where: {
        organization_id: organizationId,
        status: 'COMPLETED',
        created_at: { lte: cutoff },
        decision_outcomes: { none: {} },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    // Check which have scheduled collection jobs
    const deliberationIds = deliberations.map(d => d.id);
    const scheduledJobs = await prisma.echo_collection_jobs.findMany({
      where: {
        deliberation_id: { in: deliberationIds },
        status: { in: ['scheduled', 'collecting', 'awaiting_review'] },
      },
      select: { deliberation_id: true },
    });
    const scheduledSet = new Set(scheduledJobs.map((j: any) => j.deliberation_id));

    const now = new Date();
    return deliberations.map(d => ({
      deliberationId: d.id,
      question: d.question,
      decidedAt: d.created_at,
      daysSinceDecision: Math.floor((now.getTime() - d.created_at.getTime()) / (1000 * 60 * 60 * 24)),
      mode: d.mode || 'standard',
      hasScheduledCollection: scheduledSet.has(d.id),
    }));
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'Echo', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.outcomeCache.has(d.id)) this.outcomeCache.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'Echo', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.collectionJobs.has(d.id)) this.collectionJobs.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[EchoService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[EchoService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const echoService = new EchoService();
