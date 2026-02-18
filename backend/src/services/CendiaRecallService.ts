// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIARECALL™ - DECISION OUTCOME TRACKER
// "Close the Loop — Measure What Mattered"
//
// The missing primitive: track what ACTUALLY happened after a decision was made.
// Compares predicted outcomes vs actual results, calculates prediction accuracy,
// identifies systematic biases, and feeds learnings back into the platform.
//
// CAPABILITIES:
// - Track decision outcomes with timestamped evidence
// - Compare predicted vs actual results (quantitative + qualitative)
// - Calculate organizational prediction accuracy over time
// - Identify systematic decision-making biases
// - Generate "lessons learned" reports with actionable insights
// - Feed accuracy data back to Horizon/Predict for model improvement
// - Accountability scoring: who predicted well, who didn't
// - Decision ROI calculation with actual financial impact
// =============================================================================

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export type OutcomeStatus = 'pending' | 'tracking' | 'measured' | 'verified' | 'closed';
export type OutcomeVerdict = 'exceeded' | 'met' | 'partially_met' | 'missed' | 'catastrophic';
export type BiasType = 'optimism' | 'pessimism' | 'anchoring' | 'confirmation' | 'groupthink' | 'sunk_cost' | 'recency' | 'authority';

export interface DecisionOutcome {
  id: string;
  decisionId: string;
  organizationId: string;
  title: string;
  decisionDate: Date;
  trackingStartDate: Date;
  measurementDate?: Date;
  status: OutcomeStatus;

  // What was predicted
  predictedOutcomes: PredictedOutcome[];

  // What actually happened
  actualOutcomes: ActualOutcome[];

  // Analysis
  verdict?: OutcomeVerdict;
  accuracyScore?: number; // 0-100
  predictionDelta?: number; // % deviation from prediction
  lessonsLearned?: string[];
  biasesDetected?: DetectedBias[];

  // Financial
  predictedROI?: number;
  actualROI?: number;
  financialImpact?: number;

  // Metadata
  trackedBy: string;
  verifiedBy?: string;
  evidenceIds: string[];
  tags: string[];
}

export interface PredictedOutcome {
  id: string;
  metric: string;
  predictedValue: number | string;
  unit: string;
  confidence: number; // 0-100
  timeframe: string;
  source: string; // which service/agent made the prediction
}

export interface ActualOutcome {
  id: string;
  metric: string;
  actualValue: number | string;
  unit: string;
  measuredAt: Date;
  evidenceSource: string;
  verified: boolean;
}

export interface DetectedBias {
  type: BiasType;
  severity: 'low' | 'medium' | 'high';
  description: string;
  frequency: number; // how many times this bias appeared
  recommendation: string;
}

export interface PredictionAccuracyReport {
  organizationId: string;
  period: string;
  totalDecisions: number;
  measuredDecisions: number;
  overallAccuracy: number;
  accuracyByCategory: Record<string, number>;
  accuracyByAgent: Record<string, number>;
  accuracyTrend: { period: string; accuracy: number }[];
  topBiases: DetectedBias[];
  bestPredictors: { source: string; accuracy: number; count: number }[];
  worstPredictors: { source: string; accuracy: number; count: number }[];
  financialImpact: {
    totalPredictedROI: number;
    totalActualROI: number;
    predictionError: number;
  };
  recommendations: string[];
}

export interface LessonLearned {
  id: string;
  decisionId: string;
  organizationId: string;
  category: string;
  lesson: string;
  impact: 'high' | 'medium' | 'low';
  applicableTo: string[];
  createdAt: Date;
  endorsedBy: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaRecallService {
  private outcomes: Map<string, DecisionOutcome> = new Map();
  private lessons: Map<string, LessonLearned> = new Map();

  constructor() {
    logger.info('CendiaRecall™: Decision Outcome Tracker initialized');
  }

  // ---------------------------------------------------------------------------
  // OUTCOME TRACKING
  // ---------------------------------------------------------------------------

  async createOutcomeTracker(
    organizationId: string,
    decisionId: string,
    title: string,
    predictedOutcomes: PredictedOutcome[],
    trackedBy: string,
    options?: {
      predictedROI?: number;
      tags?: string[];
      measurementDate?: Date;
    }
  ): Promise<DecisionOutcome> {
    const id = `recall-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    const outcome: DecisionOutcome = {
      id,
      decisionId,
      organizationId,
      title,
      decisionDate: new Date(),
      trackingStartDate: new Date(),
      measurementDate: options?.measurementDate,
      status: 'tracking',
      predictedOutcomes,
      actualOutcomes: [],
      trackedBy,
      evidenceIds: [],
      tags: options?.tags || [],
      predictedROI: options?.predictedROI,
    };

    this.outcomes.set(id, outcome);

    // Also persist to database if available
    try {
      await prisma.audit_logs.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: organizationId,
          action: 'RECALL_TRACKER_CREATED',
          resource_type: 'decision_outcome',
          resource_id: id,
          details: {
            decisionId,
            title,
            predictedOutcomeCount: predictedOutcomes.length,
            predictedROI: options?.predictedROI,
            trackedBy,
          },
          user_id: trackedBy,
          ip_address: '127.0.0.1',
        },
      });
    } catch (e) {
      logger.debug('CendiaRecall: Audit log write skipped (table may not exist)');
    }

    logger.info(`CendiaRecall: Created outcome tracker ${id} for decision ${decisionId}`);
    return outcome;
  }

  async recordActualOutcome(
    trackerId: string,
    actual: Omit<ActualOutcome, 'id'>
  ): Promise<DecisionOutcome> {
    const outcome = this.outcomes.get(trackerId);
    if (!outcome) throw new Error(`Outcome tracker ${trackerId} not found`);

    const actualOutcome: ActualOutcome = {
      ...actual,
      id: `actual-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
    };

    outcome.actualOutcomes.push(actualOutcome);

    // Auto-calculate accuracy if we have matching predictions
    if (outcome.actualOutcomes.length >= outcome.predictedOutcomes.length) {
      this.calculateAccuracy(outcome);
      outcome.status = 'measured';
    }

    this.outcomes.set(trackerId, outcome);
    logger.info(`CendiaRecall: Recorded actual outcome for ${trackerId}: ${actual.metric} = ${actual.actualValue}`);
    return outcome;
  }

  async recordActualROI(trackerId: string, actualROI: number): Promise<DecisionOutcome> {
    const outcome = this.outcomes.get(trackerId);
    if (!outcome) throw new Error(`Outcome tracker ${trackerId} not found`);

    outcome.actualROI = actualROI;
    if (outcome.predictedROI !== undefined) {
      outcome.financialImpact = actualROI - outcome.predictedROI;
    }

    this.outcomes.set(trackerId, outcome);
    logger.info(`CendiaRecall: Recorded actual ROI for ${trackerId}: ${actualROI}`);
    return outcome;
  }

  async verifyOutcome(trackerId: string, verifiedBy: string): Promise<DecisionOutcome> {
    const outcome = this.outcomes.get(trackerId);
    if (!outcome) throw new Error(`Outcome tracker ${trackerId} not found`);

    outcome.status = 'verified';
    outcome.verifiedBy = verifiedBy;
    this.outcomes.set(trackerId, outcome);

    logger.info(`CendiaRecall: Outcome ${trackerId} verified by ${verifiedBy}`);
    return outcome;
  }

  async closeOutcome(
    trackerId: string,
    lessonsLearned: string[]
  ): Promise<DecisionOutcome> {
    const outcome = this.outcomes.get(trackerId);
    if (!outcome) throw new Error(`Outcome tracker ${trackerId} not found`);

    outcome.status = 'closed';
    outcome.lessonsLearned = lessonsLearned;

    // Detect biases
    outcome.biasesDetected = this.detectBiases(outcome);

    // Store lessons
    for (const lesson of lessonsLearned) {
      const lessonId = `lesson-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;
      this.lessons.set(lessonId, {
        id: lessonId,
        decisionId: outcome.decisionId,
        organizationId: outcome.organizationId,
        category: outcome.tags[0] || 'general',
        lesson,
        impact: (outcome.accuracyScore || 50) < 40 ? 'high' : (outcome.accuracyScore || 50) < 70 ? 'medium' : 'low',
        applicableTo: outcome.tags,
        createdAt: new Date(),
        endorsedBy: [],
      });
    }

    this.outcomes.set(trackerId, outcome);
    logger.info(`CendiaRecall: Outcome ${trackerId} closed with ${lessonsLearned.length} lessons`);
    return outcome;
  }

  // ---------------------------------------------------------------------------
  // ACCURACY ANALYSIS
  // ---------------------------------------------------------------------------

  private calculateAccuracy(outcome: DecisionOutcome): void {
    const matchedPairs: { predicted: PredictedOutcome; actual: ActualOutcome }[] = [];

    for (const predicted of outcome.predictedOutcomes) {
      const actual = outcome.actualOutcomes.find(a => a.metric === predicted.metric);
      if (actual) {
        matchedPairs.push({ predicted, actual });
      }
    }

    if (matchedPairs.length === 0) {
      outcome.accuracyScore = 0;
      outcome.verdict = 'missed';
      return;
    }

    let totalAccuracy = 0;
    for (const { predicted, actual } of matchedPairs) {
      const pVal = typeof predicted.predictedValue === 'number' ? predicted.predictedValue : parseFloat(String(predicted.predictedValue)) || 0;
      const aVal = typeof actual.actualValue === 'number' ? actual.actualValue : parseFloat(String(actual.actualValue)) || 0;

      if (pVal === 0 && aVal === 0) {
        totalAccuracy += 100;
      } else if (pVal === 0) {
        totalAccuracy += 0;
      } else {
        const delta = Math.abs(pVal - aVal) / Math.abs(pVal);
        const accuracy = Math.max(0, 100 - (delta * 100));
        totalAccuracy += accuracy;
      }
    }

    outcome.accuracyScore = Math.round((totalAccuracy / matchedPairs.length) * 100) / 100;
    outcome.predictionDelta = outcome.accuracyScore - 100;

    // Determine verdict
    if (outcome.accuracyScore >= 90) outcome.verdict = 'exceeded';
    else if (outcome.accuracyScore >= 75) outcome.verdict = 'met';
    else if (outcome.accuracyScore >= 50) outcome.verdict = 'partially_met';
    else if (outcome.accuracyScore >= 25) outcome.verdict = 'missed';
    else outcome.verdict = 'catastrophic';
  }

  private detectBiases(outcome: DecisionOutcome): DetectedBias[] {
    const biases: DetectedBias[] = [];

    // Check for optimism bias (predicted better than actual)
    let optimismCount = 0;
    let pessimismCount = 0;

    for (const predicted of outcome.predictedOutcomes) {
      const actual = outcome.actualOutcomes.find(a => a.metric === predicted.metric);
      if (!actual) continue;

      const pVal = typeof predicted.predictedValue === 'number' ? predicted.predictedValue : parseFloat(String(predicted.predictedValue)) || 0;
      const aVal = typeof actual.actualValue === 'number' ? actual.actualValue : parseFloat(String(actual.actualValue)) || 0;

      if (pVal > aVal * 1.1) optimismCount++;
      if (pVal < aVal * 0.9) pessimismCount++;
    }

    if (optimismCount > outcome.predictedOutcomes.length * 0.6) {
      biases.push({
        type: 'optimism',
        severity: optimismCount > outcome.predictedOutcomes.length * 0.8 ? 'high' : 'medium',
        description: `${optimismCount} of ${outcome.predictedOutcomes.length} predictions were overly optimistic`,
        frequency: optimismCount,
        recommendation: 'Apply a pessimism correction factor of 15-20% to future predictions in this category',
      });
    }

    if (pessimismCount > outcome.predictedOutcomes.length * 0.6) {
      biases.push({
        type: 'pessimism',
        severity: pessimismCount > outcome.predictedOutcomes.length * 0.8 ? 'high' : 'medium',
        description: `${pessimismCount} of ${outcome.predictedOutcomes.length} predictions were overly pessimistic`,
        frequency: pessimismCount,
        recommendation: 'Actual results consistently exceed predictions — consider raising baseline estimates',
      });
    }

    // Check for anchoring bias (all predictions cluster around similar value)
    const numericPredictions = outcome.predictedOutcomes
      .map(p => typeof p.predictedValue === 'number' ? p.predictedValue : parseFloat(String(p.predictedValue)))
      .filter(v => !isNaN(v));

    if (numericPredictions.length >= 3) {
      const mean = numericPredictions.reduce((a, b) => a + b, 0) / numericPredictions.length;
      const variance = numericPredictions.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / numericPredictions.length;
      const cv = mean !== 0 ? Math.sqrt(variance) / Math.abs(mean) : 0;

      if (cv < 0.1) {
        biases.push({
          type: 'anchoring',
          severity: 'medium',
          description: 'Predictions cluster tightly around a central value, suggesting anchoring to an initial estimate',
          frequency: 1,
          recommendation: 'Use independent estimation techniques (e.g., Delphi method) to avoid anchoring',
        });
      }
    }

    return biases;
  }

  // ---------------------------------------------------------------------------
  // REPORTING
  // ---------------------------------------------------------------------------

  async getOutcome(trackerId: string): Promise<DecisionOutcome | null> {
    return this.outcomes.get(trackerId) || null;
  }

  async getOutcomes(
    organizationId: string,
    options?: { status?: OutcomeStatus; limit?: number; offset?: number }
  ): Promise<{ outcomes: DecisionOutcome[]; total: number }> {
    let results = Array.from(this.outcomes.values())
      .filter(o => o.organizationId === organizationId);

    if (options?.status) {
      results = results.filter(o => o.status === options.status);
    }

    const total = results.length;
    results.sort((a, b) => b.decisionDate.getTime() - a.decisionDate.getTime());

    if (options?.offset) results = results.slice(options.offset);
    if (options?.limit) results = results.slice(0, options.limit);

    return { outcomes: results, total };
  }

  async getPredictionAccuracyReport(
    organizationId: string,
    period: string = 'last-90-days'
  ): Promise<PredictionAccuracyReport> {
    const allOutcomes = Array.from(this.outcomes.values())
      .filter(o => o.organizationId === organizationId && o.status !== 'pending');

    const measuredOutcomes = allOutcomes.filter(o => o.accuracyScore !== undefined);

    // Calculate overall accuracy
    const overallAccuracy = measuredOutcomes.length > 0
      ? Math.round(measuredOutcomes.reduce((sum, o) => sum + (o.accuracyScore || 0), 0) / measuredOutcomes.length * 100) / 100
      : 0; // No measured outcomes yet

    // Accuracy by category
    const accuracyByCategory: Record<string, number> = {};
    for (const outcome of measuredOutcomes) {
      const category = outcome.tags[0] || 'uncategorized';
      if (!accuracyByCategory[category]) accuracyByCategory[category] = 0;
      accuracyByCategory[category] += outcome.accuracyScore || 0;
    }
    for (const cat in accuracyByCategory) {
      const count = measuredOutcomes.filter(o => (o.tags[0] || 'uncategorized') === cat).length;
      accuracyByCategory[cat] = Math.round(accuracyByCategory[cat] / count * 100) / 100;
    }

    // No fake baseline — return empty if no real data exists

    // Accuracy by agent/source
    const accuracyByAgent: Record<string, number> = {};
    for (const outcome of measuredOutcomes) {
      for (const pred of outcome.predictedOutcomes) {
        if (!accuracyByAgent[pred.source]) accuracyByAgent[pred.source] = 0;
        const actual = outcome.actualOutcomes.find(a => a.metric === pred.metric);
        if (actual) {
          const pVal = typeof pred.predictedValue === 'number' ? pred.predictedValue : parseFloat(String(pred.predictedValue)) || 0;
          const aVal = typeof actual.actualValue === 'number' ? actual.actualValue : parseFloat(String(actual.actualValue)) || 0;
          const delta = pVal !== 0 ? Math.abs(pVal - aVal) / Math.abs(pVal) : 0;
          accuracyByAgent[pred.source] = Math.max(0, 100 - delta * 100);
        }
      }
    }

    // Collect all biases
    const allBiases: DetectedBias[] = [];
    for (const outcome of measuredOutcomes) {
      if (outcome.biasesDetected) {
        allBiases.push(...outcome.biasesDetected);
      }
    }

    // Aggregate bias frequencies
    const biasMap = new Map<BiasType, DetectedBias>();
    for (const bias of allBiases) {
      const existing = biasMap.get(bias.type);
      if (existing) {
        existing.frequency += bias.frequency;
        if (bias.severity === 'high') existing.severity = 'high';
      } else {
        biasMap.set(bias.type, { ...bias });
      }
    }

    // Financial impact
    const totalPredictedROI = measuredOutcomes.reduce((sum, o) => sum + (o.predictedROI || 0), 0);
    const totalActualROI = measuredOutcomes.reduce((sum, o) => sum + (o.actualROI || 0), 0);

    // Accuracy trend (deterministic when no real data)
    const accuracyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthOffset = i;
      const date = new Date();
      date.setMonth(date.getMonth() - monthOffset);
      const periodLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const monthOutcomes = measuredOutcomes.filter(o => {
        const oDate = o.measurementDate || o.decisionDate;
        return oDate && oDate.getMonth() === date.getMonth() && oDate.getFullYear() === date.getFullYear();
      });
      const monthAccuracy = monthOutcomes.length > 0
        ? Math.round(monthOutcomes.reduce((sum, o) => sum + (o.accuracyScore || 0), 0) / monthOutcomes.length * 100) / 100
        : 0;
      accuracyTrend.push({
        period: periodLabel,
        accuracy: monthAccuracy,
      });
    }

    // Recommendations based on analysis
    const recommendations: string[] = [];
    if (overallAccuracy < 60) {
      recommendations.push('Overall prediction accuracy is below 60%. Consider implementing structured estimation frameworks.');
    }
    if (biasMap.has('optimism')) {
      recommendations.push('Systematic optimism bias detected. Apply a pessimism correction factor to future projections.');
    }
    if (biasMap.has('anchoring')) {
      recommendations.push('Anchoring bias detected. Use independent estimation techniques to diversify prediction inputs.');
    }
    if (overallAccuracy >= 80) {
      recommendations.push('Strong prediction accuracy. Continue current methodologies and expand to new decision categories.');
    }
    recommendations.push('Schedule quarterly Recall reviews to maintain prediction calibration.');

    return {
      organizationId,
      period,
      totalDecisions: allOutcomes.length,
      measuredDecisions: measuredOutcomes.length,
      overallAccuracy,
      accuracyByCategory,
      accuracyByAgent,
      accuracyTrend,
      topBiases: Array.from(biasMap.values()).sort((a, b) => b.frequency - a.frequency),
      bestPredictors: [],
      worstPredictors: [],
      financialImpact: {
        totalPredictedROI,
        totalActualROI,
        predictionError: totalPredictedROI !== 0 ? Math.round(Math.abs(totalPredictedROI - totalActualROI) / Math.abs(totalPredictedROI) * 10000) / 100 : 0,
      },
      recommendations,
    };
  }

  async getLessonsLearned(
    organizationId: string,
    options?: { category?: string; impact?: string; limit?: number }
  ): Promise<LessonLearned[]> {
    let results = Array.from(this.lessons.values())
      .filter(l => l.organizationId === organizationId);

    if (options?.category) results = results.filter(l => l.category === options.category);
    if (options?.impact) results = results.filter(l => l.impact === options.impact);

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (options?.limit) results = results.slice(0, options.limit);

    return results;
  }

  async endorseLesson(lessonId: string, endorsedBy: string): Promise<LessonLearned> {
    const lesson = this.lessons.get(lessonId);
    if (!lesson) throw new Error(`Lesson ${lessonId} not found`);

    if (!lesson.endorsedBy.includes(endorsedBy)) {
      lesson.endorsedBy.push(endorsedBy);
    }

    this.lessons.set(lessonId, lesson);
    return lesson;
  }

  // ---------------------------------------------------------------------------
  // DECISION FEEDBACK LOOP
  // ---------------------------------------------------------------------------

  async getFeedbackForDecisionType(
    organizationId: string,
    decisionType: string
  ): Promise<{
    historicalAccuracy: number;
    commonBiases: DetectedBias[];
    relevantLessons: LessonLearned[];
    calibrationAdvice: string;
  }> {
    const relevantOutcomes = Array.from(this.outcomes.values())
      .filter(o => o.organizationId === organizationId && o.tags.includes(decisionType) && o.status === 'closed');

    const measuredOutcomes = relevantOutcomes.filter(o => o.accuracyScore !== undefined);
    const historicalAccuracy = measuredOutcomes.length > 0
      ? Math.round(measuredOutcomes.reduce((s, o) => s + (o.accuracyScore || 0), 0) / measuredOutcomes.length * 100) / 100
      : 0; // No historical data for this decision type yet

    const commonBiases: DetectedBias[] = [];
    for (const outcome of measuredOutcomes) {
      if (outcome.biasesDetected) commonBiases.push(...outcome.biasesDetected);
    }

    const relevantLessons = Array.from(this.lessons.values())
      .filter(l => l.organizationId === organizationId && l.applicableTo.includes(decisionType))
      .slice(0, 5);

    let calibrationAdvice = '';
    if (historicalAccuracy >= 80) {
      calibrationAdvice = `Historical accuracy for "${decisionType}" decisions is strong at ${historicalAccuracy}%. Maintain current methodology.`;
    } else if (historicalAccuracy >= 60) {
      calibrationAdvice = `Historical accuracy for "${decisionType}" decisions is ${historicalAccuracy}%. Consider widening confidence intervals by 15%.`;
    } else {
      calibrationAdvice = `Historical accuracy for "${decisionType}" decisions is low at ${historicalAccuracy}%. Recommend structured estimation workshops and external validation.`;
    }

    return { historicalAccuracy, commonBiases, relevantLessons, calibrationAdvice };
  }

  // ---------------------------------------------------------------------------
  // HEALTH CHECK
  // ---------------------------------------------------------------------------

  async getHealth(): Promise<{ status: string; trackers: number; lessons: number; version: string }> {
    return {
      status: 'healthy',
      trackers: this.outcomes.size,
      lessons: this.lessons.size,
      version: '1.0.0',
    };
  }
}

export const cendiaRecallService = new CendiaRecallService();
export default cendiaRecallService;
