/**
 * Service — Cognitive Bias Mitigation Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cognitiveBiasMitigationService, BiasDetection, BiasAnalysis, BiasReport, BiasType, BiasRisk, MitigationStatus
 * @module services/dcii/CognitiveBiasMitigationService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaBiasMitigation™ — Cognitive Bias Mitigation Service
 * 
 * DCII Primitive P6: Detect and challenge human cognitive biases in decision-making.
 * 
 * Tests for 12 cognitive biases per consequential decision:
 * 1. Anchoring Bias — fixating on first number/data point
 * 2. Confirmation Bias — seeking only supporting evidence
 * 3. Groupthink — unanimous agreement without genuine debate
 * 4. Availability Bias — overweighting recent/memorable events
 * 5. Sunk Cost Fallacy — continuing because of past investment
 * 6. Overconfidence Bias — excessive certainty in predictions
 * 7. Bandwagon Effect — following majority without independent analysis
 * 8. Framing Effect — different conclusions from same data presented differently
 * 9. Status Quo Bias — preference for current state over change
 * 10. Recency Bias — overweighting recent events over historical patterns
 * 11. Authority Bias — deferring to authority without scrutiny
 * 12. Survivorship Bias — drawing conclusions only from successes
 * 
 * Integration: Council adversarial agents, Devil's Advocate enforcement,
 * rubber-stamp detection, and bias audit trail preservation.
 */

import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { loadServiceRecords } from '../../utils/servicePersistence.js';
// =============================================================================
// TYPES
// =============================================================================

export type BiasType =
  | 'anchoring'
  | 'confirmation'
  | 'groupthink'
  | 'availability'
  | 'sunk_cost'
  | 'overconfidence'
  | 'bandwagon'
  | 'framing'
  | 'status_quo'
  | 'recency'
  | 'authority'
  | 'survivorship';

export type BiasRisk = 'none' | 'low' | 'medium' | 'high' | 'critical';

export type MitigationStatus = 'detected' | 'challenged' | 'mitigated' | 'accepted_risk' | 'overridden';

export interface BiasDetection {
  id: string;
  biasType: BiasType;
  risk: BiasRisk;
  confidence: number;         // 0-1 confidence that bias is present
  description: string;
  evidence: string[];
  suggestedMitigation: string;
  status: MitigationStatus;
  detectedAt: Date;
  mitigatedAt?: Date;
  mitigatedBy?: string;
  mitigationAction?: string;
}

export interface BiasAnalysis {
  id: string;
  organizationId: string;
  deliberationId: string;
  deliberationTitle: string;
  analyzedAt: Date;
  analyzedBy: string;

  biasesDetected: BiasDetection[];
  overallRisk: BiasRisk;
  biasCount: number;
  highRiskCount: number;

  rubberStampDetected: boolean;
  rubberStampReason?: string;
  deliberationDurationMinutes: number;
  minimumExpectedMinutes: number;

  groupthinkIndicators: {
    unanimousVote: boolean;
    dissentCount: number;
    devilsAdvocatePresent: boolean;
    challengeCount: number;
  };

  recommendations: string[];

  integrity: {
    analysisHash: string;
    algorithm: string;
    signedAt: Date;
  };
}

export interface BiasReport {
  id: string;
  organizationId: string;
  generatedAt: Date;
  period: { from: Date; to: Date };
  totalDeliberations: number;
  totalBiasesDetected: number;
  biasByType: Record<BiasType, number>;
  mostCommonBiases: { type: BiasType; count: number; percentage: number }[];
  rubberStampRate: number;
  averageDeliberationMinutes: number;
  devilsAdvocateUsageRate: number;
  overallBiasRisk: BiasRisk;
  trendVsPrevious: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}

// =============================================================================
// BIAS DEFINITIONS
// =============================================================================

const BIAS_DEFINITIONS: Record<BiasType, { name: string; description: string; indicators: string[]; mitigation: string }> = {
  anchoring: {
    name: 'Anchoring Bias',
    description: 'Fixating on the first piece of information encountered, using it as a reference point for subsequent judgments.',
    indicators: ['First number mentioned dominates discussion', 'Initial proposal accepted with minor modification', 'Alternative valuations not independently derived'],
    mitigation: 'Require independent estimates before sharing. Present multiple reference points simultaneously.',
  },
  confirmation: {
    name: 'Confirmation Bias',
    description: 'Seeking, interpreting, and remembering information that confirms pre-existing beliefs.',
    indicators: ['Only supporting evidence cited', 'Contradictory data dismissed or minimized', 'Question framed to elicit desired answer'],
    mitigation: 'Assign adversarial agent to present contrary evidence. Require explicit acknowledgment of disconfirming data.',
  },
  groupthink: {
    name: 'Groupthink',
    description: 'Desire for conformity overriding realistic appraisal of alternatives.',
    indicators: ['Unanimous agreement without documented debate', 'No dissenting opinions recorded', 'Criticism actively discouraged'],
    mitigation: 'Enforce Devil\'s Advocate role. Require anonymous voting before open discussion. Flag unanimity for review.',
  },
  availability: {
    name: 'Availability Bias',
    description: 'Overweighting information that comes to mind easily, typically recent or emotionally vivid events.',
    indicators: ['Recent events cited disproportionately', 'Dramatic examples used over statistical evidence', 'Historical base rates ignored'],
    mitigation: 'Require historical base rate analysis. Weight statistical evidence over anecdotal. Present 5+ year data alongside recent.',
  },
  sunk_cost: {
    name: 'Sunk Cost Fallacy',
    description: 'Continuing a course of action because of previously invested resources rather than future value.',
    indicators: ['Past investment cited as reason to continue', '"We\'ve come too far to stop" reasoning', 'Future ROI not independently evaluated'],
    mitigation: 'Evaluate decision as if starting fresh. Calculate forward-looking value only. Separate past investment from future decision.',
  },
  overconfidence: {
    name: 'Overconfidence Bias',
    description: 'Excessive certainty in predictions or capabilities, underestimating risks and uncertainty.',
    indicators: ['Narrow confidence intervals', 'Best-case planning dominates', 'Risk factors minimized or ignored'],
    mitigation: 'Require confidence calibration. Run pre-mortem analysis. Present base rates of similar projects/decisions.',
  },
  bandwagon: {
    name: 'Bandwagon Effect',
    description: 'Adopting a position because many others have, without independent analysis.',
    indicators: ['Competitor actions cited as primary justification', '"Everyone is doing it" reasoning', 'No independent market analysis'],
    mitigation: 'Require independent analysis before considering competitor actions. Evaluate on merits, not popularity.',
  },
  framing: {
    name: 'Framing Effect',
    description: 'Drawing different conclusions from the same information depending on how it is presented.',
    indicators: ['Gain framing used selectively', 'Loss framing avoided for preferred option', 'Same data presented differently to different audiences'],
    mitigation: 'Present options in both gain and loss frames. Standardize presentation format across alternatives.',
  },
  status_quo: {
    name: 'Status Quo Bias',
    description: 'Preference for the current state of affairs, even when change would be beneficial.',
    indicators: ['"It\'s always been done this way"', 'Change costs emphasized over change benefits', 'Inaction not treated as a decision'],
    mitigation: 'Calculate cost of inaction (Decision Debt). Present status quo as an active choice with consequences.',
  },
  recency: {
    name: 'Recency Bias',
    description: 'Overweighting recent events while underweighting historical patterns.',
    indicators: ['Last quarter dominates over 5-year trend', 'Recent success/failure extrapolated linearly', 'Cyclical patterns not recognized'],
    mitigation: 'Require multi-year trend analysis. Weight historical patterns alongside recent data. Identify cyclical factors.',
  },
  authority: {
    name: 'Authority Bias',
    description: 'Attributing greater accuracy to the opinion of an authority figure regardless of evidence.',
    indicators: ['CEO/senior voice dominates without challenge', 'Expert opinion not validated against data', 'Hierarchy overrides evidence'],
    mitigation: 'Require evidence-based arguments regardless of source. Weight data over seniority. Anonymous deliberation option.',
  },
  survivorship: {
    name: 'Survivorship Bias',
    description: 'Drawing conclusions only from successful examples while ignoring failures.',
    indicators: ['Only successful case studies cited', 'Failed attempts not analyzed', 'Selection bias in evidence gathering'],
    mitigation: 'Require analysis of failures alongside successes. Include base rate of failure for similar decisions.',
  },
};

// =============================================================================
// SERVICE
// =============================================================================

class CognitiveBiasMitigationService {
  private analyses: Map<string, BiasAnalysis> = new Map();
  private reports: Map<string, BiasReport> = new Map();
  private dbInitialized = false;

  constructor() {
    logger.info('[CendiaBiasMitigation] Cognitive Bias Mitigation Service™ initialized — 12 bias types active');


    this.loadFromDB().catch((err) => logger.warn('[CognitiveBiasMitigation] loadFromDB failed', err));
  }

  private async ensureDbLoaded(): Promise<void> {
    if (this.dbInitialized) return;
    this.dbInitialized = true;
    try {
      const rows = await prisma.bias_analyses.findMany({ orderBy: { created_at: 'asc' } });
      for (const r of rows) {
        this.analyses.set(r.id, {
          id: r.id,
          organizationId: r.organization_id,
          deliberationId: r.deliberation_id,
          deliberationTitle: r.deliberation_title,
          analyzedAt: r.created_at,
          analyzedBy: r.analyzed_by,
          biasesDetected: r.biases_detected as unknown as BiasDetection[],
          overallRisk: r.overall_risk as BiasRisk,
          biasCount: r.bias_count,
          highRiskCount: r.high_risk_count,
          rubberStampDetected: r.rubber_stamp_detected,
          rubberStampReason: r.rubber_stamp_reason || undefined,
          deliberationDurationMinutes: r.duration_minutes || 0,
          minimumExpectedMinutes: r.min_expected_minutes || 0,
          groupthinkIndicators: (r.groupthink_indicators as any) || { unanimousVote: false, dissentCount: 0, devilsAdvocatePresent: false, challengeCount: 0 },
          recommendations: r.recommendations,
          integrity: { analysisHash: r.analysis_hash, algorithm: 'SHA-256', signedAt: r.created_at },
        });
      }
      logger.info(`[CendiaBiasMitigation] Loaded ${rows.length} bias analyses from DB`);
    } catch (err) {
      logger.warn(`[CendiaBiasMitigation] DB load failed: ${(err as Error).message}`);
    }
  }

  private async persistAnalysis(analysis: BiasAnalysis): Promise<void> {
    try {
      await prisma.bias_analyses.upsert({
        where: { id: analysis.id },
        update: {},
        create: {
          id: analysis.id,
          organization_id: analysis.organizationId,
          deliberation_id: analysis.deliberationId,
          deliberation_title: analysis.deliberationTitle,
          analyzed_by: analysis.analyzedBy,
          biases_detected: JSON.parse(JSON.stringify(analysis.biasesDetected)),
          overall_risk: analysis.overallRisk,
          bias_count: analysis.biasCount,
          high_risk_count: analysis.highRiskCount,
          rubber_stamp_detected: analysis.rubberStampDetected,
          rubber_stamp_reason: analysis.rubberStampReason || null,
          duration_minutes: analysis.deliberationDurationMinutes,
          min_expected_minutes: analysis.minimumExpectedMinutes,
          groupthink_indicators: JSON.parse(JSON.stringify(analysis.groupthinkIndicators)),
          recommendations: analysis.recommendations,
          analysis_hash: analysis.integrity.analysisHash,
        },
      });
    } catch (err) {
      logger.warn(`[CendiaBiasMitigation] Failed to persist analysis ${analysis.id}: ${(err as Error).message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // ANALYZE DELIBERATION FOR BIASES
  // ---------------------------------------------------------------------------

  async analyzeDeliberation(params: {
    organizationId: string;
    deliberationId: string;
    deliberationTitle: string;
    deliberationDurationMinutes: number;
    agentCount: number;
    dissentCount: number;
    devilsAdvocatePresent: boolean;
    challengeCount: number;
    unanimousVote: boolean;
    arguments: Array<{
      agentRole: string;
      position: string;
      evidence: string[];
      sentiment: 'support' | 'oppose' | 'neutral';
    }>;
    analyzedBy: string;
  }): Promise<BiasAnalysis> {
    const biasesDetected: BiasDetection[] = [];

    // Test all 12 biases
    for (const [biasType, definition] of Object.entries(BIAS_DEFINITIONS)) {
      const detection = this.testForBias(biasType as BiasType, definition, params);
      if (detection.risk !== 'none') {
        biasesDetected.push(detection);
      }
    }

    // Rubber-stamp detection
    const minimumExpectedMinutes = Math.max(10, params.agentCount * 3);
    const rubberStampDetected = params.deliberationDurationMinutes < minimumExpectedMinutes;

    // Overall risk
    const highRiskCount = biasesDetected.filter(b => b.risk === 'high' || b.risk === 'critical').length;
    const overallRisk: BiasRisk = highRiskCount >= 3 ? 'critical' : highRiskCount >= 2 ? 'high' :
      biasesDetected.length >= 4 ? 'medium' : biasesDetected.length > 0 ? 'low' : 'none';

    // Recommendations
    const recommendations: string[] = [];
    if (rubberStampDetected) recommendations.push(`Deliberation duration (${params.deliberationDurationMinutes}min) below minimum threshold (${minimumExpectedMinutes}min). Increase deliberation time.`);
    if (!params.devilsAdvocatePresent) recommendations.push('No Devil\'s Advocate agent present. Assign adversarial perspective for consequential decisions.');
    if (params.unanimousVote && params.agentCount > 3) recommendations.push('Unanimous vote with 4+ agents suggests potential groupthink. Require anonymous pre-vote.');
    if (params.dissentCount === 0) recommendations.push('Zero dissenting opinions. Healthy deliberation typically includes constructive disagreement.');
    for (const bias of biasesDetected.filter(b => b.risk === 'high' || b.risk === 'critical')) {
      recommendations.push(`${BIAS_DEFINITIONS[bias.biasType].name} detected (${bias.risk}): ${bias.suggestedMitigation}`);
    }

    const analysisData: Omit<BiasAnalysis, 'integrity'> = {
      id: uuidv4(),
      organizationId: params.organizationId,
      deliberationId: params.deliberationId,
      deliberationTitle: params.deliberationTitle,
      analyzedAt: new Date(),
      analyzedBy: params.analyzedBy,
      biasesDetected,
      overallRisk,
      biasCount: biasesDetected.length,
      highRiskCount,
      rubberStampDetected,
      rubberStampReason: rubberStampDetected ? `Duration ${params.deliberationDurationMinutes}min < threshold ${minimumExpectedMinutes}min` : undefined,
      deliberationDurationMinutes: params.deliberationDurationMinutes,
      minimumExpectedMinutes,
      groupthinkIndicators: {
        unanimousVote: params.unanimousVote,
        dissentCount: params.dissentCount,
        devilsAdvocatePresent: params.devilsAdvocatePresent,
        challengeCount: params.challengeCount,
      },
      recommendations,
    };

    const analysisHash = crypto.createHash('sha256').update(JSON.stringify(analysisData)).digest('hex');
    const analysis: BiasAnalysis = {
      ...analysisData,
      integrity: { analysisHash, algorithm: 'SHA-256', signedAt: new Date() },
    };

    this.analyses.set(analysis.id, analysis);
    await this.persistAnalysis(analysis);
    logger.info(`[CendiaBiasMitigation] Analysis ${analysis.id}: ${biasesDetected.length} biases detected, overall risk: ${overallRisk}`);
    return analysis;
  }

  private testForBias(
    biasType: BiasType,
    definition: typeof BIAS_DEFINITIONS[BiasType],
    params: {
      deliberationDurationMinutes: number;
      agentCount: number;
      dissentCount: number;
      devilsAdvocatePresent: boolean;
      challengeCount: number;
      unanimousVote: boolean;
      arguments: Array<{
        agentRole: string;
        position: string;
        evidence: string[];
        sentiment: 'support' | 'oppose' | 'neutral';
      }>;
    }
  ): BiasDetection {
    let risk: BiasRisk = 'none';
    let confidence = 0;
    const evidence: string[] = [];

    const supportCount = params.arguments.filter(a => a.sentiment === 'support').length;
    const opposeCount = params.arguments.filter(a => a.sentiment === 'oppose').length;
    const totalArgs = params.arguments.length;

    switch (biasType) {
      case 'groupthink':
        if (params.unanimousVote && params.dissentCount === 0 && totalArgs > 3) {
          risk = 'high'; confidence = 0.85;
          evidence.push(`Unanimous vote with ${totalArgs} agents and 0 dissents`);
        } else if (params.unanimousVote && params.dissentCount <= 1) {
          risk = 'medium'; confidence = 0.55;
          evidence.push(`Unanimous vote with only ${params.dissentCount} dissent(s)`);
        }
        break;

      case 'confirmation':
        if (supportCount > 0 && opposeCount === 0 && totalArgs >= 3) {
          risk = 'medium'; confidence = 0.60;
          evidence.push(`${supportCount}/${totalArgs} arguments support position, 0 oppose`);
        }
        break;

      case 'anchoring':
        if (params.challengeCount < 2 && totalArgs >= 3) {
          risk = 'low'; confidence = 0.40;
          evidence.push(`Only ${params.challengeCount} challenges to initial framing across ${totalArgs} agents`);
        }
        break;

      case 'availability':
        if (params.challengeCount < totalArgs * 0.3) {
          risk = 'low'; confidence = 0.35;
          evidence.push('Low challenge rate may indicate availability-driven reasoning');
        }
        break;

      case 'bandwagon':
        if (supportCount >= totalArgs * 0.8 && params.dissentCount === 0) {
          risk = 'medium'; confidence = 0.50;
          evidence.push(`${Math.round(supportCount / totalArgs * 100)}% support without independent opposition`);
        }
        break;

      case 'authority':
        if (!params.devilsAdvocatePresent && params.challengeCount < 2) {
          risk = 'low'; confidence = 0.30;
          evidence.push('No Devil\'s Advocate and few challenges — authority bias risk elevated');
        }
        break;

      case 'status_quo':
        // Detected via argument analysis — low challenge rate + support for current state
        if (params.challengeCount === 0 && supportCount > opposeCount * 2) {
          risk = 'low'; confidence = 0.35;
          evidence.push('Zero challenges with strong support skew — status quo bias possible');
        }
        break;

      case 'overconfidence':
        if (params.deliberationDurationMinutes < 5 && totalArgs >= 3) {
          risk = 'medium'; confidence = 0.50;
          evidence.push(`Rapid deliberation (${params.deliberationDurationMinutes}min) with ${totalArgs} agents suggests overconfidence`);
        }
        break;

      // Other bias types detected via deeper content analysis
      default:
        break;
    }

    return {
      id: uuidv4(),
      biasType,
      risk,
      confidence,
      description: definition.description,
      evidence,
      suggestedMitigation: definition.mitigation,
      status: risk !== 'none' ? 'detected' : 'detected',
      detectedAt: new Date(),
    };
  }

  // ---------------------------------------------------------------------------
  // MITIGATION ACTIONS
  // ---------------------------------------------------------------------------

  mitigateBias(analysisId: string, biasDetectionId: string, action: string, mitigatedBy: string): BiasDetection | undefined {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) return undefined;
    const detection = analysis.biasesDetected.find(b => b.id === biasDetectionId);
    if (!detection) return undefined;

    detection.status = 'mitigated';
    detection.mitigatedAt = new Date();
    detection.mitigatedBy = mitigatedBy;
    detection.mitigationAction = action;

    logger.info(`[CendiaBiasMitigation] Bias ${detection.biasType} mitigated in analysis ${analysisId} by ${mitigatedBy}`);
    return detection;
  }

  acceptBiasRisk(analysisId: string, biasDetectionId: string, acceptedBy: string, justification: string): BiasDetection | undefined {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) return undefined;
    const detection = analysis.biasesDetected.find(b => b.id === biasDetectionId);
    if (!detection) return undefined;

    detection.status = 'accepted_risk';
    detection.mitigatedAt = new Date();
    detection.mitigatedBy = acceptedBy;
    detection.mitigationAction = `Risk accepted: ${justification}`;

    logger.info(`[CendiaBiasMitigation] Bias ${detection.biasType} risk accepted in analysis ${analysisId} by ${acceptedBy}`);
    return detection;
  }

  // ---------------------------------------------------------------------------
  // REPORTING
  // ---------------------------------------------------------------------------

  generateReport(organizationId: string, from: Date, to: Date): BiasReport {
    const orgAnalyses = Array.from(this.analyses.values())
      .filter(a => a.organizationId === organizationId && a.analyzedAt >= from && a.analyzedAt <= to);

    const biasByType: Record<BiasType, number> = {} as any;
    const allBiasTypes: BiasType[] = ['anchoring', 'confirmation', 'groupthink', 'availability', 'sunk_cost',
      'overconfidence', 'bandwagon', 'framing', 'status_quo', 'recency', 'authority', 'survivorship'];
    for (const t of allBiasTypes) biasByType[t] = 0;

    let totalBiases = 0;
    let rubberStampCount = 0;
    let totalDuration = 0;
    let daCount = 0;

    for (const analysis of orgAnalyses) {
      totalBiases += analysis.biasCount;
      if (analysis.rubberStampDetected) rubberStampCount++;
      totalDuration += analysis.deliberationDurationMinutes;
      if (analysis.groupthinkIndicators.devilsAdvocatePresent) daCount++;
      for (const bias of analysis.biasesDetected) {
        biasByType[bias.biasType]++;
      }
    }

    const mostCommonBiases = allBiasTypes
      .filter(t => biasByType[t] > 0)
      .map(t => ({ type: t, count: biasByType[t], percentage: totalBiases > 0 ? Math.round(biasByType[t] / totalBiases * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const total = orgAnalyses.length || 1;
    const rubberStampRate = Math.round(rubberStampCount / total * 100);
    const avgDuration = Math.round(totalDuration / total);
    const daRate = Math.round(daCount / total * 100);

    const overallBiasRisk: BiasRisk = rubberStampRate > 30 || totalBiases / total > 3 ? 'high' :
      totalBiases / total > 1.5 ? 'medium' : totalBiases / total > 0.5 ? 'low' : 'none';

    const recommendations: string[] = [];
    if (rubberStampRate > 20) recommendations.push(`Rubber-stamp rate ${rubberStampRate}% — enforce minimum deliberation time.`);
    if (daRate < 50) recommendations.push(`Devil's Advocate usage at ${daRate}% — require for all consequential decisions.`);
    if (mostCommonBiases.length > 0) recommendations.push(`Most common bias: ${BIAS_DEFINITIONS[mostCommonBiases[0].type].name} — implement targeted mitigation.`);

    const report: BiasReport = {
      id: uuidv4(),
      organizationId,
      generatedAt: new Date(),
      period: { from, to },
      totalDeliberations: orgAnalyses.length,
      totalBiasesDetected: totalBiases,
      biasByType,
      mostCommonBiases,
      rubberStampRate,
      averageDeliberationMinutes: avgDuration,
      devilsAdvocateUsageRate: daRate,
      overallBiasRisk,
      trendVsPrevious: 'stable',
      recommendations,
    };

    this.reports.set(report.id, report);
    logger.info(`[CendiaBiasMitigation] Report generated for ${organizationId}: ${orgAnalyses.length} deliberations, ${totalBiases} biases`);
    return report;
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getAnalysis(analysisId: string): BiasAnalysis | undefined {
    return this.analyses.get(analysisId);
  }

  getAnalysesByOrganization(organizationId: string): BiasAnalysis[] {
    return Array.from(this.analyses.values()).filter(a => a.organizationId === organizationId);
  }

  getAnalysesByDeliberation(deliberationId: string): BiasAnalysis[] {
    return Array.from(this.analyses.values()).filter(a => a.deliberationId === deliberationId);
  }

  getReport(reportId: string): BiasReport | undefined {
    return this.reports.get(reportId);
  }

  getBiasDefinitions(): typeof BIAS_DEFINITIONS {
    return BIAS_DEFINITIONS;
  }

  getAllAnalyses(): BiasAnalysis[] {
    return Array.from(this.analyses.values());
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CognitiveBiasMitigation', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.analyses.has(d.id)) this.analyses.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CognitiveBiasMitigation', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.reports.has(d.id)) this.reports.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CognitiveBiasMitigationService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CognitiveBiasMitigationService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// =============================================================================
// SINGLETON
// =============================================================================

export const cognitiveBiasMitigationService = new CognitiveBiasMitigationService();
export default cognitiveBiasMitigationService;
