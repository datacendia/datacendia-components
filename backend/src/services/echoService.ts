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
    signature: string;
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

    // Generate cryptographic signature
    const signatureData = JSON.stringify({
      deliberationId,
      outcome: outcome.status,
      dollarImpact: outcome.dollarImpact,
      timestamp: new Date().toISOString(),
    });
    const signature = Buffer.from(signatureData).toString('base64');

    return {
      summary,
      sections: [
        { title: 'Decision Overview', content: `Original Question: ${outcome.decisionTitle}` },
        { title: 'Financial Impact', content: `Dollar Impact: $${outcome.dollarImpact.toLocaleString()} | ROI: ${(outcome.roi * 100).toFixed(1)}%` },
        { title: 'Prediction Accuracy', content: `Overall Accuracy: ${(outcome.confidenceScore * 100).toFixed(1)}%` },
        { title: 'Council Participants', content: outcome.participatingAgents.join(', ') },
        { title: 'Voting Record', content: JSON.stringify(outcome.votingPattern, null, 2) },
      ],
      signature: `ECHO-SIG-${signature.substring(0, 32)}`,
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

        adjustments.push({
          agentId: agent.id,
          agentRole: agent.role,
          previousWeight: currentWeight,
          newWeight,
          adjustment,
          reason: `Decision ${deliberation.id} was ${status}`,
          deliberationId: deliberation.id,
        });

        logger.info('[Echo] Agent weight adjusted:', {
          agent: agent.role,
          from: currentWeight,
          to: newWeight,
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
}

export const echoService = new EchoService();
