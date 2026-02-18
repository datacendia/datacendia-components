// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * ExpressIntelligenceâ„¢ - Quick Intelligence Without Council
 * 
 * "Use services normally. Council available for complex decisions."
 * 
 * Two product paths:
 * - Express Mode (30s - 5min): LLM-generated analysis, no Council overhead
 * - Deliberative Mode (20-40min): Full Council deliberation for strategic decisions
 * 
 * Express Mode provides:
 * - Direct LLM analysis of compliance, threats, simulations
 * - Actionable remediation steps without multi-agent deliberation
 * - Quick intelligence good enough for 80% of use cases
 * - Optional escalation to Council when deeper analysis needed
 */

import { logger } from '../../utils/logger.js';
import { EnhancedLLMService } from '../EnhancedLLMService.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export type IntelligenceMode = 'express' | 'deliberative';

export interface ExpressRequest {
  organizationId: string;
  userId: string;
  query: string;
  domain: ExpressDomain;
  context?: Record<string, unknown>;
  mode?: IntelligenceMode;
}

export type ExpressDomain =
  | 'compliance'
  | 'threat_intelligence'
  | 'simulation'
  | 'risk_assessment'
  | 'legal_analysis'
  | 'financial_analysis'
  | 'operational_review'
  | 'security_audit'
  | 'general';

export interface ExpressResult {
  id: string;
  mode: IntelligenceMode;
  domain: ExpressDomain;
  query: string;
  analysis: string;
  findings: ExpressFinding[];
  recommendations: ExpressRecommendation[];
  score?: number;
  trend?: string;
  confidence: number;
  durationMs: number;
  escalationAvailable: boolean;
  timestamp: Date;
}

export interface ExpressFinding {
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  evidence?: string;
}

export interface ExpressRecommendation {
  action: string;
  priority: number;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe?: string;
}

// =============================================================================
// DOMAIN SYSTEM PROMPTS
// =============================================================================

const DOMAIN_PROMPTS: Record<ExpressDomain, string> = {
  compliance: `You are an expert regulatory compliance analyst. Analyze the provided data and generate:
1. A clear compliance status assessment
2. Specific violations or gaps found
3. Prioritized remediation steps with effort estimates
4. A compliance score (0-100)
Be specific, cite frameworks, and provide actionable steps.`,

  threat_intelligence: `You are an expert threat intelligence analyst. Analyze the provided data and generate:
1. A threat landscape assessment
2. Specific threats identified with severity and probability
3. Prioritized countermeasures with implementation steps
4. An overall threat level assessment
Be specific about attack vectors and provide actionable defensive measures.`,

  simulation: `You are an expert risk simulation analyst. Analyze the provided scenario and generate:
1. Best case, most likely, and worst case outcomes with probabilities
2. Key risk factors and their impact ranges
3. Recommended actions for each scenario
4. Financial impact estimates where applicable
Be quantitative and provide confidence intervals.`,

  risk_assessment: `You are an expert risk management analyst. Analyze the provided data and generate:
1. A comprehensive risk profile
2. Specific risks identified with likelihood and impact scores
3. Risk mitigation strategies prioritized by cost-effectiveness
4. An overall risk score (0-100)
Be specific about risk interdependencies.`,

  legal_analysis: `You are an expert legal analyst. Analyze the provided data and generate:
1. Legal risk assessment
2. Specific regulatory exposure areas
3. Recommended legal actions prioritized by urgency
4. Compliance obligations and deadlines
Be specific about jurisdictions and applicable laws.`,

  financial_analysis: `You are an expert financial analyst. Analyze the provided data and generate:
1. Financial health assessment
2. Key financial risks and opportunities
3. Recommended financial actions
4. Projected financial impact of key scenarios
Be quantitative with specific figures and ranges.`,

  operational_review: `You are an expert operations analyst. Analyze the provided data and generate:
1. Operational efficiency assessment
2. Bottlenecks and failure points identified
3. Process improvement recommendations
4. Resource optimization suggestions
Be specific about metrics and measurable outcomes.`,

  security_audit: `You are an expert cybersecurity auditor. Analyze the provided data and generate:
1. Security posture assessment
2. Vulnerabilities and exposures found
3. Remediation steps prioritized by risk
4. Security score (0-100) with breakdown
Be specific about CVEs, controls, and frameworks.`,

  general: `You are an expert business analyst. Analyze the provided data and generate:
1. Key findings from the analysis
2. Specific issues or opportunities identified
3. Prioritized recommendations
4. Overall assessment score (0-100)
Be clear, specific, and actionable.`,
};

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class ExpressIntelligenceService {
  private llmService: EnhancedLLMService;

  constructor() {
    this.llmService = new EnhancedLLMService();
  }

  /**
   * Run Express analysis - quick LLM-only intelligence
   * Returns actionable findings and recommendations without Council
   */
  async analyze(request: ExpressRequest): Promise<ExpressResult> {
    const startTime = Date.now();
    const id = `express-${Date.now()}-${deterministicFloat('expressintelligence-1').toString(36).slice(2, 8)}`;

    logger.info(`[Express] Starting ${request.domain} analysis for org ${request.organizationId}`);

    const systemPrompt = DOMAIN_PROMPTS[request.domain] || DOMAIN_PROMPTS.general;

    const contextStr = request.context
      ? `\n\nContext Data:\n${JSON.stringify(request.context, null, 2)}`
      : '';

    const prompt = `${request.query}${contextStr}

Respond in JSON format:
{
  "analysis": "2-3 paragraph analysis",
  "findings": [
    {
      "title": "Finding title",
      "description": "What was found",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "category": "Category name",
      "evidence": "Supporting evidence"
    }
  ],
  "recommendations": [
    {
      "action": "Specific action to take",
      "priority": 1,
      "effort": "LOW|MEDIUM|HIGH",
      "impact": "LOW|MEDIUM|HIGH",
      "timeframe": "e.g., 1-2 weeks"
    }
  ],
  "score": 0-100,
  "trend": "improving|stable|declining",
  "confidence": 0.0-1.0
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt,
        temperature: 0.3,
        maxTokens: 1200,
        format: 'json',
      });

      const parsed = JSON.parse(response);
      const durationMs = Date.now() - startTime;

      logger.info(`[Express] Completed ${request.domain} analysis in ${durationMs}ms`);

      return {
        id,
        mode: 'express',
        domain: request.domain,
        query: request.query,
        analysis: parsed.analysis || 'Analysis completed.',
        findings: Array.isArray(parsed.findings) ? parsed.findings : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        score: typeof parsed.score === 'number' ? parsed.score : undefined,
        trend: parsed.trend || undefined,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
        durationMs,
        escalationAvailable: true,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error(`[Express] Analysis failed for ${request.domain}:`, error);

      return {
        id,
        mode: 'express',
        domain: request.domain,
        query: request.query,
        analysis: 'Express analysis encountered an error. Consider using Deliberative mode for deeper analysis.',
        findings: [],
        recommendations: [
          {
            action: 'Escalate to Council deliberation for comprehensive analysis',
            priority: 1,
            effort: 'LOW',
            impact: 'HIGH',
            timeframe: '20-40 minutes',
          },
        ],
        confidence: 0,
        durationMs: Date.now() - startTime,
        escalationAvailable: true,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Check if a request should be auto-escalated to Deliberative mode
   * based on complexity heuristics
   */
  shouldEscalate(request: ExpressRequest): { shouldEscalate: boolean; reason?: string } {
    const query = request.query.toLowerCase();

    // High-stakes keywords that benefit from Council deliberation
    const escalationKeywords = [
      'strategic', 'acquisition', 'merger', 'restructure', 'layoff',
      'lawsuit', 'litigation', 'regulatory action', 'enforcement',
      'breach', 'incident response', 'crisis',
      'board', 'fiduciary', 'shareholder',
      'multi-jurisdiction', 'cross-border',
    ];

    const matchedKeyword = escalationKeywords.find(kw => query.includes(kw));
    if (matchedKeyword) {
      return {
        shouldEscalate: true,
        reason: `Query involves "${matchedKeyword}" â€” Council deliberation recommended for multi-perspective analysis`,
      };
    }

    // Check explicit mode request
    if (request.mode === 'deliberative') {
      return { shouldEscalate: true, reason: 'Deliberative mode explicitly requested' };
    }

    return { shouldEscalate: false };
  }
}

export const expressIntelligenceService = new ExpressIntelligenceService();
