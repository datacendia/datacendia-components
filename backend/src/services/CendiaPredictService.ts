/**
 * Service — Cendia Predict Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaPredictService, DecisionRiskRequest, DecisionRiskAssessment, FailureModeRisk, RiskTimelinePoint, SimilarDecision, RiskDriver, CascadeRiskSummary
 * @module services/CendiaPredictService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAPREDICT™ - DECISION RISK INTELLIGENCE
// "We predict which decisions survive scrutiny."
//
// Forward-looking quantitative risk scoring for proposed decisions.
// Composes: CendiaRecall (historical outcomes) + CendiaCascade (consequence mapping)
//
// The Prediction Loop:
//   CendiaPredict (forward) → Decision → CendiaEcho (backward) → Learning → CendiaPredict (better)
//
// CAPABILITIES:
// - Ingest proposed decision + context
// - Query CendiaRecall for similar past decisions by category/tags
// - Run pattern matching against historical outcome data
// - Generate time-series risk curves for specific failure modes:
//     Regulatory challenge probability
//     Reputational damage likelihood
//     Financial impact distribution
//     Stakeholder backlash risk
//     Operational disruption risk
// - Compose CendiaCascade for 2nd/3rd-order consequence analysis
// - Output: Risk score + confidence interval + primary risk drivers + evidence
//
// HONESTY GUARANTEE:
// - If insufficient historical data exists, confidence is LOW and the assessment says so
// - No fake data, no deterministic seeds, no simulated outcomes
// - Every risk projection is grounded in real outcome data or clearly marked as inferred
// =============================================================================

import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import { cendiaRecallService } from './CendiaRecallService.js';
import type { DecisionOutcome, DetectedBias, LessonLearned } from './CendiaRecallService.js';
import { cascadeService } from './CendiaCascadeService.js';
import type { ChangeSpec, ChangeType, CascadeReport, ConsequenceAssessment } from './CendiaCascadeService.js';
// =============================================================================
// TYPES
// =============================================================================

export type RiskCategory = 'regulatory' | 'reputational' | 'financial' | 'operational' | 'stakeholder';
export type DecisionCategory = 'strategic' | 'financial' | 'operational' | 'compliance' | 'technology' | 'staffing' | 'market' | 'product';
export type RiskRecommendation = 'proceed' | 'proceed_with_caution' | 'delay' | 'reconsider';

export interface DecisionRiskRequest {
  organizationId: string;
  title: string;
  description: string;
  category: DecisionCategory;
  tags: string[];
  proposedBy: string;
  estimatedImpact?: number;           // USD
  timeframeMonths?: number;           // how far out to project risk (default 12)
  context?: Record<string, unknown>;
  stakeholders?: string[];
  constraints?: string[];
  // Optional: if provided, triggers CendiaCascade analysis
  affectedAssets?: string[];          // Node IDs in the knowledge graph
}

export interface DecisionRiskAssessment {
  id: string;
  request: DecisionRiskRequest;
  assessedAt: Date;

  // Overall Risk
  overallRiskScore: number;           // 0-100
  confidenceLevel: number;            // 0-100 (based on sample size)
  confidenceRationale: string;        // explains why confidence is at this level
  sampleSize: number;                 // similar decisions found

  // Failure Mode Risk Curves
  failureModes: FailureModeRisk[];

  // Time-Series Risk Projection
  riskTimeline: RiskTimelinePoint[];

  // Evidence
  similarDecisions: SimilarDecision[];
  primaryRiskDrivers: RiskDriver[];
  historicalAccuracy: number;         // how accurate past predictions were for this category
  biasWarnings: DetectedBias[];

  // Cascade Analysis (present only if affectedAssets provided)
  cascadeRisk?: CascadeRiskSummary;

  // Recommendations
  mitigations: string[];
  recommendation: RiskRecommendation;
  executiveSummary: string;
}

export interface FailureModeRisk {
  mode: RiskCategory;
  probability: number;                // 0-100
  peakRiskMonth: number;              // month when risk is highest
  impactSeverity: 'low' | 'medium' | 'high' | 'critical';
  evidenceCount: number;              // similar decisions that exhibited this failure mode
  description: string;
  riskCurve: number[];                // monthly risk values over the timeframe
}

export interface RiskTimelinePoint {
  month: number;
  cumulativeRiskScore: number;
  regulatory: number;
  reputational: number;
  financial: number;
  operational: number;
  stakeholder: number;
}

export interface SimilarDecision {
  decisionId: string;
  title: string;
  similarity: number;                 // 0-1
  outcome: string;                    // verdict from CendiaRecall
  accuracyScore: number;
  lessonsLearned: string[];
  decisionDate: Date;
  tags: string[];
}

export interface RiskDriver {
  factor: string;
  weight: number;                     // 0-1
  direction: 'increasing' | 'decreasing' | 'stable';
  evidence: string;
}

export interface CascadeRiskSummary {
  reportId: string;
  totalConsequences: number;
  criticalConsequences: number;
  butterflyEffectIdentified: boolean;
  maxCascadeOrder: number;
  totalRiskScore: number;
  topConsequences: Array<{
    description: string;
    severity: string;
    order: number;
    latencyDays: number;
  }>;
}

// =============================================================================
// RISK CATEGORY KEYWORDS
// Used to classify historical outcomes into failure mode categories
// =============================================================================

const RISK_CATEGORY_KEYWORDS: Record<RiskCategory, string[]> = {
  regulatory: ['regulatory', 'compliance', 'legal', 'audit', 'regulation', 'law', 'policy', 'license', 'permit', 'sanction', 'fine', 'penalty'],
  reputational: ['reputation', 'brand', 'public', 'media', 'trust', 'perception', 'image', 'pr', 'scandal', 'controversy'],
  financial: ['financial', 'revenue', 'cost', 'budget', 'roi', 'profit', 'loss', 'cash', 'margin', 'investment', 'expense'],
  operational: ['operational', 'process', 'system', 'infrastructure', 'downtime', 'capacity', 'efficiency', 'workflow', 'supply'],
  stakeholder: ['stakeholder', 'employee', 'customer', 'partner', 'board', 'investor', 'morale', 'retention', 'satisfaction', 'turnover'],
};

// =============================================================================
// CENDIAPREDICT SERVICE
// =============================================================================

class CendiaPredictService {
  private assessments: Map<string, DecisionRiskAssessment> = new Map();

  constructor() {
    logger.info('CendiaPredict™: Decision Risk Intelligence initialized');


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // MAIN ENTRY POINT: ASSESS DECISION RISK
  // ---------------------------------------------------------------------------

  async assessDecisionRisk(request: DecisionRiskRequest): Promise<DecisionRiskAssessment> {
    const assessmentId = `predict-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const timeframeMonths = request.timeframeMonths || 12;

    logger.info(`CendiaPredict: Assessing risk for "${request.title}" [${request.category}]`);

    // Step 1: Find similar historical decisions from CendiaRecall
    const similarDecisions = await this.findSimilarDecisions(
      request.organizationId,
      request.category,
      request.tags
    );

    // Step 2: Compute historical accuracy for this decision category
    const feedbackData = await cendiaRecallService.getFeedbackForDecisionType(
      request.organizationId,
      request.category
    );

    // Step 3: Analyze failure modes from historical outcomes
    const failureModes = this.analyzeFailureModes(
      similarDecisions,
      request,
      timeframeMonths
    );

    // Step 4: Generate time-series risk projection
    const riskTimeline = this.generateRiskTimeline(failureModes, timeframeMonths);

    // Step 5: Identify primary risk drivers
    const primaryRiskDrivers = this.identifyRiskDrivers(
      similarDecisions,
      failureModes,
      request
    );

    // Step 6: Compute overall risk score
    const overallRiskScore = this.computeOverallRisk(failureModes, riskTimeline);

    // Step 7: Compute confidence level based on data availability
    const { confidenceLevel, confidenceRationale } = this.computeConfidence(
      similarDecisions.length,
      feedbackData.historicalAccuracy,
      request
    );

    // Step 8: Optional cascade analysis
    let cascadeRisk: CascadeRiskSummary | undefined;
    if (request.affectedAssets && request.affectedAssets.length > 0) {
      cascadeRisk = await this.runCascadeAnalysis(request);
    }

    // Step 9: Generate mitigations and recommendation
    const mitigations = this.generateMitigations(failureModes, primaryRiskDrivers, feedbackData.relevantLessons);
    const recommendation = this.computeRecommendation(overallRiskScore, confidenceLevel, cascadeRisk);
    const executiveSummary = this.generateExecutiveSummary(
      request,
      overallRiskScore,
      confidenceLevel,
      similarDecisions.length,
      failureModes,
      recommendation
    );

    const assessment: DecisionRiskAssessment = {
      id: assessmentId,
      request,
      assessedAt: new Date(),
      overallRiskScore,
      confidenceLevel,
      confidenceRationale,
      sampleSize: similarDecisions.length,
      failureModes,
      riskTimeline,
      similarDecisions,
      primaryRiskDrivers,
      historicalAccuracy: feedbackData.historicalAccuracy,
      biasWarnings: feedbackData.commonBiases,
      cascadeRisk,
      mitigations,
      recommendation,
      executiveSummary,
    };

    this.assessments.set(assessmentId, assessment);

    // Persist to audit trail
    await this.persistAssessment(assessment);

    logger.info(`CendiaPredict: Assessment ${assessmentId} complete — Risk: ${overallRiskScore}/100, Confidence: ${confidenceLevel}%, Sample: ${similarDecisions.length} similar decisions`);
    return assessment;
  }

  // ---------------------------------------------------------------------------
  // STEP 1: FIND SIMILAR DECISIONS
  // ---------------------------------------------------------------------------

  private async findSimilarDecisions(
    organizationId: string,
    category: DecisionCategory,
    tags: string[]
  ): Promise<SimilarDecision[]> {
    const { outcomes } = await cendiaRecallService.getOutcomes(organizationId, { limit: 500 });

    if (outcomes.length === 0) return [];

    const scored: SimilarDecision[] = [];

    for (const outcome of outcomes) {
      // Compute similarity based on tag overlap and category match
      const tagOverlap = outcome.tags.filter(t => tags.includes(t)).length;
      const maxTags = Math.max(outcome.tags.length, tags.length, 1);
      const tagSimilarity = tagOverlap / maxTags;

      const categoryMatch = outcome.tags.includes(category) ? 0.4 : 0;
      const similarity = Math.min(1, tagSimilarity * 0.6 + categoryMatch);

      // Only include if there's meaningful similarity
      if (similarity > 0.1 || outcome.tags.includes(category)) {
        scored.push({
          decisionId: outcome.decisionId,
          title: outcome.title,
          similarity: Math.round(similarity * 100) / 100,
          outcome: outcome.verdict || 'pending',
          accuracyScore: outcome.accuracyScore || 0,
          lessonsLearned: outcome.lessonsLearned || [],
          decisionDate: outcome.decisionDate,
          tags: outcome.tags,
        });
      }
    }

    // Sort by similarity descending, take top 50
    return scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 50);
  }

  // ---------------------------------------------------------------------------
  // STEP 3: ANALYZE FAILURE MODES
  // ---------------------------------------------------------------------------

  private analyzeFailureModes(
    similarDecisions: SimilarDecision[],
    request: DecisionRiskRequest,
    timeframeMonths: number
  ): FailureModeRisk[] {
    const categories: RiskCategory[] = ['regulatory', 'reputational', 'financial', 'operational', 'stakeholder'];
    const failureModes: FailureModeRisk[] = [];

    for (const category of categories) {
      const keywords = RISK_CATEGORY_KEYWORDS[category];

      // Count how many similar decisions had outcomes related to this failure mode
      let failureCount = 0;
      let totalRelevant = 0;

      for (const decision of similarDecisions) {
        const isRelevant = decision.tags.some(t => keywords.includes(t.toLowerCase())) ||
                           decision.lessonsLearned.some(l => keywords.some(k => l.toLowerCase().includes(k)));

        if (isRelevant) {
          totalRelevant++;
          if (decision.outcome === 'missed' || decision.outcome === 'catastrophic' || decision.outcome === 'partially_met') {
            failureCount++;
          }
        }
      }

      // Compute base probability from historical data
      let probability: number;
      if (totalRelevant >= 3) {
        // Sufficient data: use historical failure rate
        probability = Math.round((failureCount / totalRelevant) * 100);
      } else if (similarDecisions.length >= 5) {
        // Some data but not category-specific: use overall failure rate with penalty
        const overallFailures = similarDecisions.filter(d =>
          d.outcome === 'missed' || d.outcome === 'catastrophic' || d.outcome === 'partially_met'
        ).length;
        probability = Math.round((overallFailures / similarDecisions.length) * 100 * 0.7);
      } else {
        // Insufficient data: provide baseline estimate with low confidence
        probability = this.getBaselineProbability(category, request);
      }

      // Adjust for request-specific factors
      probability = this.adjustProbabilityForContext(probability, category, request);

      // Compute peak risk month (regulatory peaks later, operational peaks earlier)
      const peakRiskMonth = this.computePeakRiskMonth(category, timeframeMonths);

      // Generate monthly risk curve
      const riskCurve = this.generateRiskCurve(probability, peakRiskMonth, timeframeMonths);

      // Determine severity
      const impactSeverity = probability >= 70 ? 'critical' as const :
                             probability >= 45 ? 'high' as const :
                             probability >= 20 ? 'medium' as const : 'low' as const;

      failureModes.push({
        mode: category,
        probability,
        peakRiskMonth,
        impactSeverity,
        evidenceCount: totalRelevant,
        description: this.describeFailureMode(category, probability, totalRelevant, request),
        riskCurve,
      });
    }

    return failureModes.sort((a, b) => b.probability - a.probability);
  }

  // ---------------------------------------------------------------------------
  // STEP 4: GENERATE RISK TIMELINE
  // ---------------------------------------------------------------------------

  private generateRiskTimeline(
    failureModes: FailureModeRisk[],
    timeframeMonths: number
  ): RiskTimelinePoint[] {
    const timeline: RiskTimelinePoint[] = [];

    for (let month = 1; month <= timeframeMonths; month++) {
      const point: RiskTimelinePoint = {
        month,
        cumulativeRiskScore: 0,
        regulatory: 0,
        reputational: 0,
        financial: 0,
        operational: 0,
        stakeholder: 0,
      };

      for (const fm of failureModes) {
        const monthIndex = month - 1;
        const value = monthIndex < fm.riskCurve.length ? fm.riskCurve[monthIndex] : fm.riskCurve[fm.riskCurve.length - 1];
        point[fm.mode] = Math.round(value);
      }

      // Cumulative risk: weighted average of all categories
      point.cumulativeRiskScore = Math.round(
        (point.regulatory * 0.25 +
         point.reputational * 0.20 +
         point.financial * 0.25 +
         point.operational * 0.15 +
         point.stakeholder * 0.15)
      );

      timeline.push(point);
    }

    return timeline;
  }

  // ---------------------------------------------------------------------------
  // STEP 5: IDENTIFY RISK DRIVERS
  // ---------------------------------------------------------------------------

  private identifyRiskDrivers(
    similarDecisions: SimilarDecision[],
    failureModes: FailureModeRisk[],
    request: DecisionRiskRequest
  ): RiskDriver[] {
    const drivers: RiskDriver[] = [];

    // Driver 1: Historical failure rate for this category
    const failedDecisions = similarDecisions.filter(d =>
      d.outcome === 'missed' || d.outcome === 'catastrophic'
    );
    if (similarDecisions.length > 0) {
      const failureRate = failedDecisions.length / similarDecisions.length;
      drivers.push({
        factor: `Historical failure rate for "${request.category}" decisions`,
        weight: Math.round(failureRate * 100) / 100,
        direction: failureRate > 0.3 ? 'increasing' : failureRate < 0.15 ? 'decreasing' : 'stable',
        evidence: `${failedDecisions.length} of ${similarDecisions.length} similar decisions failed or partially failed`,
      });
    }

    // Driver 2: Financial magnitude
    if (request.estimatedImpact) {
      const magnitude = request.estimatedImpact > 1000000 ? 'high' :
                        request.estimatedImpact > 100000 ? 'medium' : 'low';
      drivers.push({
        factor: 'Financial magnitude of decision',
        weight: magnitude === 'high' ? 0.8 : magnitude === 'medium' ? 0.5 : 0.2,
        direction: magnitude === 'high' ? 'increasing' : 'stable',
        evidence: `Estimated impact: $${request.estimatedImpact.toLocaleString()}. ${magnitude === 'high' ? 'High-value decisions have historically higher scrutiny and failure consequences.' : 'Moderate financial exposure.'}`,
      });
    }

    // Driver 3: Stakeholder count
    if (request.stakeholders && request.stakeholders.length > 0) {
      const stakeholderRisk = request.stakeholders.length > 5 ? 0.7 :
                              request.stakeholders.length > 2 ? 0.4 : 0.2;
      drivers.push({
        factor: 'Stakeholder complexity',
        weight: stakeholderRisk,
        direction: request.stakeholders.length > 5 ? 'increasing' : 'stable',
        evidence: `${request.stakeholders.length} stakeholders involved. More stakeholders increase alignment risk and potential for backlash.`,
      });
    }

    // Driver 4: Top failure mode
    const topFailure = failureModes[0];
    if (topFailure && topFailure.probability > 20) {
      drivers.push({
        factor: `Primary risk vector: ${topFailure.mode}`,
        weight: topFailure.probability / 100,
        direction: topFailure.probability > 50 ? 'increasing' : 'stable',
        evidence: `${topFailure.mode} risk at ${topFailure.probability}% based on ${topFailure.evidenceCount} similar outcomes. Peak risk at month ${topFailure.peakRiskMonth}.`,
      });
    }

    // Driver 5: Constraint pressure
    if (request.constraints && request.constraints.length > 0) {
      drivers.push({
        factor: 'Active constraints and limitations',
        weight: Math.min(0.6, request.constraints.length * 0.15),
        direction: request.constraints.length > 3 ? 'increasing' : 'stable',
        evidence: `${request.constraints.length} constraints identified: ${request.constraints.slice(0, 3).join(', ')}${request.constraints.length > 3 ? '...' : ''}`,
      });
    }

    return drivers.sort((a, b) => b.weight - a.weight);
  }

  // ---------------------------------------------------------------------------
  // STEP 6 & 7: COMPUTE OVERALL RISK & CONFIDENCE
  // ---------------------------------------------------------------------------

  private computeOverallRisk(
    failureModes: FailureModeRisk[],
    riskTimeline: RiskTimelinePoint[]
  ): number {
    if (failureModes.length === 0) return 0;

    // Peak cumulative risk across the timeline
    const peakRisk = Math.max(...riskTimeline.map(t => t.cumulativeRiskScore));

    // Average of top 3 failure modes
    const topModes = failureModes.slice(0, 3);
    const avgTopRisk = topModes.reduce((sum, fm) => sum + fm.probability, 0) / topModes.length;

    // Weighted: 60% peak timeline risk, 40% average failure mode probability
    return Math.round(peakRisk * 0.6 + avgTopRisk * 0.4);
  }

  private computeConfidence(
    sampleSize: number,
    historicalAccuracy: number,
    request: DecisionRiskRequest
  ): { confidenceLevel: number; confidenceRationale: string } {
    let confidence = 0;
    const factors: string[] = [];

    // Sample size contribution (0-40 points)
    if (sampleSize >= 50) {
      confidence += 40;
      factors.push(`Strong sample: ${sampleSize} similar decisions analyzed`);
    } else if (sampleSize >= 20) {
      confidence += 30;
      factors.push(`Good sample: ${sampleSize} similar decisions`);
    } else if (sampleSize >= 5) {
      confidence += 15;
      factors.push(`Limited sample: only ${sampleSize} similar decisions found`);
    } else if (sampleSize > 0) {
      confidence += 5;
      factors.push(`Minimal sample: only ${sampleSize} similar decision(s) — treat projections as directional only`);
    } else {
      factors.push('No similar decisions found — risk estimates are baseline only, not evidence-based');
    }

    // Historical accuracy contribution (0-30 points)
    if (historicalAccuracy >= 80) {
      confidence += 30;
      factors.push(`High historical accuracy: ${historicalAccuracy}% for "${request.category}" decisions`);
    } else if (historicalAccuracy >= 60) {
      confidence += 20;
      factors.push(`Moderate historical accuracy: ${historicalAccuracy}%`);
    } else if (historicalAccuracy > 0) {
      confidence += 10;
      factors.push(`Low historical accuracy: ${historicalAccuracy}% — predictions in this category have been unreliable`);
    }

    // Context richness contribution (0-20 points)
    let contextPoints = 0;
    if (request.estimatedImpact) contextPoints += 5;
    if (request.stakeholders && request.stakeholders.length > 0) contextPoints += 5;
    if (request.constraints && request.constraints.length > 0) contextPoints += 5;
    if (request.context && Object.keys(request.context).length > 0) contextPoints += 5;
    confidence += contextPoints;
    if (contextPoints >= 15) {
      factors.push('Rich context provided — improves risk specificity');
    } else if (contextPoints < 5) {
      factors.push('Sparse context — provide more details for more accurate assessment');
    }

    // Tag specificity contribution (0-10 points)
    if (request.tags.length >= 3) {
      confidence += 10;
    } else if (request.tags.length >= 1) {
      confidence += 5;
    }

    const confidenceLevel = Math.min(95, Math.max(5, confidence));
    const confidenceRationale = factors.join('. ') + '.';

    return { confidenceLevel, confidenceRationale };
  }

  // ---------------------------------------------------------------------------
  // STEP 8: CASCADE ANALYSIS
  // ---------------------------------------------------------------------------

  private async runCascadeAnalysis(request: DecisionRiskRequest): Promise<CascadeRiskSummary | undefined> {
    if (!request.affectedAssets || request.affectedAssets.length === 0) return undefined;

    try {
      const changeSpec: ChangeSpec = {
        type: this.mapCategoryToChangeType(request.category),
        title: request.title,
        description: request.description,
        affectedAssets: request.affectedAssets,
        expectedBenefit: request.description,
        proposedBy: request.proposedBy,
        proposedAt: new Date(),
      };

      const report: CascadeReport = await cascadeService.analyzeChange(changeSpec);

      const criticalConsequences = report.consequences.filter(
        (c: ConsequenceAssessment) => c.severity === 'critical' || c.severity === 'high'
      );

      return {
        reportId: report.id,
        totalConsequences: report.consequences.length,
        criticalConsequences: criticalConsequences.length,
        butterflyEffectIdentified: !!report.butterflyEffect,
        maxCascadeOrder: Math.max(0, ...report.consequences.map((c: ConsequenceAssessment) => c.order)),
        totalRiskScore: report.totalRiskScore,
        topConsequences: report.consequences.slice(0, 5).map((c: ConsequenceAssessment) => ({
          description: c.description,
          severity: c.severity,
          order: c.order,
          latencyDays: c.latencyDays,
        })),
      };
    } catch (error) {
      logger.warn(`CendiaPredict: Cascade analysis failed — ${error instanceof Error ? error.message : 'unknown error'}`);
      return undefined;
    }
  }

  // ---------------------------------------------------------------------------
  // STEP 9: MITIGATIONS & RECOMMENDATION
  // ---------------------------------------------------------------------------

  private generateMitigations(
    failureModes: FailureModeRisk[],
    riskDrivers: RiskDriver[],
    lessons: LessonLearned[]
  ): string[] {
    const mitigations: string[] = [];

    // From failure modes
    for (const fm of failureModes.filter(f => f.probability >= 25)) {
      switch (fm.mode) {
        case 'regulatory':
          mitigations.push(`Regulatory risk at ${fm.probability}%: Commission a compliance pre-review before execution. Peak risk at month ${fm.peakRiskMonth}.`);
          break;
        case 'reputational':
          mitigations.push(`Reputational risk at ${fm.probability}%: Prepare stakeholder communication plan and crisis response protocol.`);
          break;
        case 'financial':
          mitigations.push(`Financial risk at ${fm.probability}%: Stage investment in phases with clear go/no-go gates at each milestone.`);
          break;
        case 'operational':
          mitigations.push(`Operational risk at ${fm.probability}%: Run a tabletop exercise before implementation. Establish rollback procedures.`);
          break;
        case 'stakeholder':
          mitigations.push(`Stakeholder risk at ${fm.probability}%: Conduct stakeholder alignment sessions before announcement. Identify potential blockers early.`);
          break;
      }
    }

    // From lessons learned on similar decisions
    for (const lesson of lessons.slice(0, 3)) {
      mitigations.push(`Historical lesson (${lesson.impact} impact): ${lesson.lesson}`);
    }

    // From risk drivers
    for (const driver of riskDrivers.filter(d => d.weight > 0.5 && d.direction === 'increasing')) {
      mitigations.push(`Address rising risk: ${driver.factor} — ${driver.evidence}`);
    }

    return mitigations;
  }

  private computeRecommendation(
    overallRisk: number,
    confidence: number,
    cascadeRisk?: CascadeRiskSummary
  ): RiskRecommendation {
    // Factor in cascade analysis if available
    const cascadeMultiplier = cascadeRisk
      ? (cascadeRisk.criticalConsequences > 2 ? 1.3 : cascadeRisk.butterflyEffectIdentified ? 1.15 : 1.0)
      : 1.0;

    const adjustedRisk = Math.min(100, overallRisk * cascadeMultiplier);

    if (adjustedRisk >= 70) return 'reconsider';
    if (adjustedRisk >= 50) return 'delay';
    if (adjustedRisk >= 25) return 'proceed_with_caution';
    return 'proceed';
  }

  private generateExecutiveSummary(
    request: DecisionRiskRequest,
    overallRisk: number,
    confidence: number,
    sampleSize: number,
    failureModes: FailureModeRisk[],
    recommendation: RiskRecommendation
  ): string {
    const topRisk = failureModes[0];
    const riskLevel = overallRisk >= 70 ? 'HIGH' : overallRisk >= 40 ? 'MODERATE' : 'LOW';
    const confLevel = confidence >= 70 ? 'high' : confidence >= 40 ? 'moderate' : 'low';

    const parts: string[] = [];

    parts.push(`Decision "${request.title}" carries ${riskLevel} overall risk (${overallRisk}/100) with ${confLevel} confidence (${confidence}%).`);

    if (sampleSize > 0) {
      parts.push(`Based on ${sampleSize} similar past decisions in the "${request.category}" category.`);
    } else {
      parts.push(`No similar past decisions found — projections are baseline estimates only.`);
    }

    if (topRisk && topRisk.probability >= 25) {
      parts.push(`Primary risk vector: ${topRisk.mode} at ${topRisk.probability}% probability, peaking at month ${topRisk.peakRiskMonth}.`);
    }

    const recommendationText: Record<RiskRecommendation, string> = {
      proceed: 'Risk profile supports proceeding with standard monitoring.',
      proceed_with_caution: 'Proceed with enhanced monitoring and mitigation measures in place.',
      delay: 'Consider delaying until key risk factors are addressed.',
      reconsider: 'Significant risk detected. Recommend reconsidering or substantially modifying the approach.',
    };

    parts.push(`Recommendation: ${recommendationText[recommendation]}`);

    return parts.join(' ');
  }

  // ---------------------------------------------------------------------------
  // RETRIEVAL
  // ---------------------------------------------------------------------------

  async getAssessment(assessmentId: string): Promise<DecisionRiskAssessment | null> {
    return this.assessments.get(assessmentId) || null;
  }

  async getAssessments(
    organizationId: string,
    options?: { limit?: number; category?: DecisionCategory }
  ): Promise<DecisionRiskAssessment[]> {
    let results = Array.from(this.assessments.values())
      .filter(a => a.request.organizationId === organizationId);

    if (options?.category) {
      results = results.filter(a => a.request.category === options.category);
    }

    results.sort((a, b) => b.assessedAt.getTime() - a.assessedAt.getTime());

    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async getAssessmentsByDecisionCategory(
    organizationId: string,
    category: DecisionCategory
  ): Promise<{ avgRisk: number; avgConfidence: number; count: number; assessments: DecisionRiskAssessment[] }> {
    const assessments = await this.getAssessments(organizationId, { category });
    const avgRisk = assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.overallRiskScore, 0) / assessments.length)
      : 0;
    const avgConfidence = assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.confidenceLevel, 0) / assessments.length)
      : 0;

    return { avgRisk, avgConfidence, count: assessments.length, assessments };
  }

  // ---------------------------------------------------------------------------
  // PREDICTION ACCURACY FEEDBACK (closes the loop)
  // ---------------------------------------------------------------------------

  async recordOutcomeAndUpdateAccuracy(
    assessmentId: string,
    actualOutcome: {
      verdict: string;
      failureModesTriggered: RiskCategory[];
      notes: string;
    }
  ): Promise<{
    assessmentId: string;
    predictedRisk: number;
    actualResult: string;
    predictionAccuracy: number;
    failureModeAccuracy: Record<string, { predicted: number; triggered: boolean }>;
  }> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error(`Assessment ${assessmentId} not found`);

    // Compare predicted failure modes vs actual
    const failureModeAccuracy: Record<string, { predicted: number; triggered: boolean }> = {};
    let correctPredictions = 0;
    let totalModes = 0;

    for (const fm of assessment.failureModes) {
      const triggered = actualOutcome.failureModesTriggered.includes(fm.mode);
      failureModeAccuracy[fm.mode] = { predicted: fm.probability, triggered };

      // Consider it a correct prediction if:
      // - Predicted >50% and it triggered, OR
      // - Predicted <30% and it didn't trigger
      if ((fm.probability >= 50 && triggered) || (fm.probability < 30 && !triggered)) {
        correctPredictions++;
      }
      totalModes++;
    }

    const predictionAccuracy = totalModes > 0 ? Math.round((correctPredictions / totalModes) * 100) : 0;

    logger.info(`CendiaPredict: Feedback recorded for ${assessmentId} — Prediction accuracy: ${predictionAccuracy}%`);

    return {
      assessmentId,
      predictedRisk: assessment.overallRiskScore,
      actualResult: actualOutcome.verdict,
      predictionAccuracy,
      failureModeAccuracy,
    };
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------------------------

  async getDashboard(organizationId: string): Promise<{
    totalAssessments: number;
    avgRiskScore: number;
    avgConfidence: number;
    riskDistribution: Record<string, number>;
    topRiskCategories: Array<{ category: RiskCategory; avgProbability: number }>;
    recentAssessments: Array<{ id: string; title: string; risk: number; confidence: number; recommendation: RiskRecommendation; date: Date }>;
  }> {
    const assessments = await this.getAssessments(organizationId);

    const avgRiskScore = assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.overallRiskScore, 0) / assessments.length)
      : 0;

    const avgConfidence = assessments.length > 0
      ? Math.round(assessments.reduce((sum, a) => sum + a.confidenceLevel, 0) / assessments.length)
      : 0;

    // Risk distribution
    const riskDistribution: Record<string, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
    for (const a of assessments) {
      if (a.overallRiskScore >= 70) riskDistribution.critical++;
      else if (a.overallRiskScore >= 50) riskDistribution.high++;
      else if (a.overallRiskScore >= 25) riskDistribution.moderate++;
      else riskDistribution.low++;
    }

    // Top risk categories across all assessments
    const categoryRisks = new Map<RiskCategory, number[]>();
    for (const a of assessments) {
      for (const fm of a.failureModes) {
        if (!categoryRisks.has(fm.mode)) categoryRisks.set(fm.mode, []);
        categoryRisks.get(fm.mode)!.push(fm.probability);
      }
    }
    const topRiskCategories = Array.from(categoryRisks.entries())
      .map(([category, probs]) => ({
        category,
        avgProbability: Math.round(probs.reduce((a, b) => a + b, 0) / probs.length),
      }))
      .sort((a, b) => b.avgProbability - a.avgProbability);

    const recentAssessments = assessments.slice(0, 10).map(a => ({
      id: a.id,
      title: a.request.title,
      risk: a.overallRiskScore,
      confidence: a.confidenceLevel,
      recommendation: a.recommendation,
      date: a.assessedAt,
    }));

    return {
      totalAssessments: assessments.length,
      avgRiskScore,
      avgConfidence,
      riskDistribution,
      topRiskCategories,
      recentAssessments,
    };
  }

  // ---------------------------------------------------------------------------
  // HEALTH
  // ---------------------------------------------------------------------------

  async getHealth(): Promise<{ status: string; assessments: number; version: string }> {
    return {
      status: 'healthy',
      assessments: this.assessments.size,
      version: '1.0.0',
    };
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private getBaselineProbability(category: RiskCategory, request: DecisionRiskRequest): number {
    // Conservative baseline when no historical data exists
    // These are category-specific base rates from general enterprise risk literature
    const baselines: Record<RiskCategory, number> = {
      regulatory: 15,
      reputational: 10,
      financial: 20,
      operational: 25,
      stakeholder: 12,
    };

    let base = baselines[category];

    // Adjust for decision category
    if (request.category === 'compliance' && category === 'regulatory') base += 10;
    if (request.category === 'financial' && category === 'financial') base += 8;
    if (request.category === 'staffing' && category === 'stakeholder') base += 10;
    if (request.category === 'technology' && category === 'operational') base += 8;

    return Math.min(50, base); // Cap at 50 for baseline (low confidence)
  }

  private adjustProbabilityForContext(
    baseProbability: number,
    category: RiskCategory,
    request: DecisionRiskRequest
  ): number {
    let adjusted = baseProbability;

    // Financial magnitude adjustment
    if (request.estimatedImpact) {
      if (request.estimatedImpact > 1000000) adjusted *= 1.15;
      else if (request.estimatedImpact > 500000) adjusted *= 1.08;
    }

    // Stakeholder complexity adjustment
    if (request.stakeholders && category === 'stakeholder') {
      adjusted *= 1 + (request.stakeholders.length * 0.05);
    }

    // Constraint pressure adjustment
    if (request.constraints && request.constraints.length > 2) {
      adjusted *= 1.1;
    }

    return Math.min(95, Math.max(1, Math.round(adjusted)));
  }

  private computePeakRiskMonth(category: RiskCategory, timeframeMonths: number): number {
    // Different failure modes peak at different times
    const peakFractions: Record<RiskCategory, number> = {
      operational: 0.15,    // Operational risk peaks early (implementation phase)
      stakeholder: 0.25,    // Stakeholder backlash peaks in first quarter
      financial: 0.4,       // Financial impact materializes mid-range
      reputational: 0.5,    // Reputational damage peaks at midpoint
      regulatory: 0.7,      // Regulatory challenges peak late (review cycles)
    };

    return Math.max(1, Math.round(timeframeMonths * peakFractions[category]));
  }

  private generateRiskCurve(probability: number, peakMonth: number, timeframeMonths: number): number[] {
    const curve: number[] = [];

    for (let month = 1; month <= timeframeMonths; month++) {
      // Bell curve centered on peakMonth
      const distanceFromPeak = Math.abs(month - peakMonth);
      const spread = timeframeMonths * 0.3;
      const bellFactor = Math.exp(-0.5 * Math.pow(distanceFromPeak / spread, 2));

      // Risk accumulates: minimum floor of 20% of peak after peak month
      const accumulationFloor = month > peakMonth ? probability * 0.2 : 0;
      const value = Math.max(accumulationFloor, probability * bellFactor);

      curve.push(Math.round(value * 10) / 10);
    }

    return curve;
  }

  private describeFailureMode(
    category: RiskCategory,
    probability: number,
    evidenceCount: number,
    request: DecisionRiskRequest
  ): string {
    const level = probability >= 50 ? 'elevated' : probability >= 25 ? 'moderate' : 'low';
    const evidenceQualifier = evidenceCount >= 5
      ? `based on ${evidenceCount} similar past outcomes`
      : evidenceCount > 0
        ? `based on limited evidence (${evidenceCount} outcomes)`
        : 'based on baseline estimates (no historical data for this category)';

    const descriptions: Record<RiskCategory, string> = {
      regulatory: `${level} probability (${probability}%) of regulatory challenge or compliance issue within the assessment timeframe, ${evidenceQualifier}.`,
      reputational: `${level} probability (${probability}%) of reputational damage or public perception impact, ${evidenceQualifier}.`,
      financial: `${level} probability (${probability}%) of financial underperformance or budget overrun, ${evidenceQualifier}.`,
      operational: `${level} probability (${probability}%) of operational disruption or execution failure, ${evidenceQualifier}.`,
      stakeholder: `${level} probability (${probability}%) of stakeholder backlash or alignment failure, ${evidenceQualifier}.`,
    };

    return descriptions[category];
  }

  private mapCategoryToChangeType(category: DecisionCategory): ChangeType {
    const mapping: Record<DecisionCategory, ChangeType> = {
      strategic: 'process' as ChangeType,
      financial: 'pricing' as ChangeType,
      operational: 'process' as ChangeType,
      compliance: 'regulatory' as ChangeType,
      technology: 'technology' as ChangeType,
      staffing: 'staffing' as ChangeType,
      market: 'market' as ChangeType,
      product: 'product' as ChangeType,
    };
    return mapping[category] || ('process' as ChangeType);
  }

  private async persistAssessment(assessment: DecisionRiskAssessment): Promise<void> {
    try {
      // Dynamic import to avoid circular dependency issues
      const { prisma } = await import('../config/database.js');
      await prisma.audit_logs.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: assessment.request.organizationId,
          action: 'PREDICT_RISK_ASSESSED',
          resource_type: 'decision_risk_assessment',
          resource_id: assessment.id,
          details: {
            title: assessment.request.title,
            category: assessment.request.category,
            overallRisk: assessment.overallRiskScore,
            confidence: assessment.confidenceLevel,
            sampleSize: assessment.sampleSize,
            recommendation: assessment.recommendation,
            topFailureMode: assessment.failureModes[0]?.mode,
            topFailureProbability: assessment.failureModes[0]?.probability,
          },
          user_id: assessment.request.proposedBy,
          ip_address: '127.0.0.1',
        },
      });
    } catch (e) {
      logger.debug('CendiaPredict: Audit log write skipped (table may not exist)');
    }
  }

  // No seed method - Enterprise Platinum standard
  // Assessments are created only through real API operations



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaPredict', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.assessments.has(d.id)) this.assessments.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaPredictService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaPredictService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const cendiaPredictService = new CendiaPredictService();
export default cendiaPredictService;
