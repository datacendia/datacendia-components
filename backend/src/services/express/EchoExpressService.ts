// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Echo Express Service
 * 
 * Quick decision pattern insights without Council involvement.
 * Wraps Echo data access in a standalone Express-mode service
 * (separate file due to echoService.ts encoding constraints).
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ExpressDecisionInsights {
  totalDecisions: number;
  successRate: number;
  avgROI: number;
  topPatterns: Array<{ pattern: string; successRate: number; occurrences: number }>;
  agentAccuracy: Record<string, number>;
  recentOutcomes: Array<{ title: string; status: string; dollarImpact: number; date: Date }>;
  pendingCount: number;
  recommendation: string;
  mode: 'express';
}

// =============================================================================
// SERVICE
// =============================================================================

class EchoExpressService {
  /**
   * Express: Quick summary of decision patterns and insights (no Council needed)
   * Returns success rates, top patterns, agent accuracy, and pending decisions.
   */
  async getExpressDecisionInsights(organizationId: string): Promise<ExpressDecisionInsights> {
    const startTime = Date.now();

    // Pull real data from database
    const [outcomes, pendingDeliberations, weightAdjustments] = await Promise.all([
      prisma.decision_outcomes.findMany({
        where: { organization_id: organizationId },
        orderBy: { decision_date: 'desc' },
        take: 100,
      }),
      prisma.deliberations.findMany({
        where: {
          organization_id: organizationId,
          status: 'COMPLETED',
          decision_outcomes: { none: {} },
        },
        select: { id: true },
      }),
      prisma.agent_weight_history.findMany({
        where: { organization_id: organizationId },
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
    ]);

    const totalDecisions = outcomes.length;
    const successCount = outcomes.filter((o: any) => o.status === 'success').length;
    const successRate = totalDecisions > 0 ? Math.round((successCount / totalDecisions) * 100) : 0;

    // Calculate average ROI
    const roisWithValues = outcomes.filter((o: any) => o.roi != null && o.roi !== 0);
    const avgROI = roisWithValues.length > 0
      ? Math.round(roisWithValues.reduce((sum: number, o: any) => sum + (Number(o.roi) || 0), 0) / roisWithValues.length * 100) / 100
      : 0;

    // Extract patterns from outcomes
    const patternMap = new Map<string, { success: number; total: number }>();
    for (const outcome of outcomes) {
      const category = (outcome as any).category || 'general';
      const existing = patternMap.get(category) || { success: 0, total: 0 };
      existing.total++;
      if (outcome.status === 'success') existing.success++;
      patternMap.set(category, existing);
    }
    const topPatterns = Array.from(patternMap.entries())
      .map(([pattern, data]) => ({
        pattern,
        successRate: Math.round((data.success / data.total) * 100),
        occurrences: data.total,
      }))
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 5);

    // Agent accuracy from weight adjustments
    const agentAccuracy: Record<string, number> = {};
    const agentScores = new Map<string, number[]>();
    for (const adj of weightAdjustments) {
      const role = adj.agent_role || adj.agent_id;
      if (!agentScores.has(role)) agentScores.set(role, []);
      agentScores.get(role)!.push(Number(adj.new_weight) || 0.5);
    }
    for (const [agent, scores] of agentScores) {
      agentAccuracy[agent] = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
    }

    // Recent outcomes
    const recentOutcomes = outcomes.slice(0, 5).map((o: any) => ({
      title: o.decision_title || 'Untitled Decision',
      status: o.status,
      dollarImpact: Number(o.dollar_impact) || 0,
      date: o.decision_date,
    }));

    // Quick recommendation based on data
    let recommendation = 'Insufficient data for recommendations. Link more decision outcomes to build pattern intelligence.';
    if (totalDecisions >= 10) {
      if (successRate >= 75) {
        recommendation = `Strong decision track record (${successRate}% success). Continue current approach. Consider increasing decision velocity.`;
      } else if (successRate >= 50) {
        recommendation = `Moderate success rate (${successRate}%). Review failed decisions for common factors. Consider adding more deliberation time for high-stakes decisions.`;
      } else {
        recommendation = `Below-average success rate (${successRate}%). Recommend reviewing Council agent weights and decision criteria. Consider pilot programs before full commitment.`;
      }
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[Echo Express] Decision insights generated in ${durationMs}ms (${totalDecisions} decisions)`);

    return {
      totalDecisions,
      successRate,
      avgROI,
      topPatterns,
      agentAccuracy,
      recentOutcomes,
      pendingCount: pendingDeliberations.length,
      recommendation,
      mode: 'express',
    };
  }
}

export const echoExpressService = new EchoExpressService();
export default echoExpressService;
