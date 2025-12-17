// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - CENDIA SENTRY SERVICE
// AI output monitoring, guardrails, bias detection, and hallucination prevention
// The enforcement mechanism for CendiaEthics
// =============================================================================

import { BaseService, ServiceHealth } from '../core/services/BaseService.js';
import { cendiaAuditService } from './CendiaAuditService.js';

// =============================================================================
// TYPES
// =============================================================================

export type GuardrailType = 
  | 'content_filter'       // Block harmful content
  | 'pii_detector'         // Detect and redact PII
  | 'bias_detector'        // Detect biased outputs
  | 'hallucination_check'  // Verify factual claims
  | 'compliance_check'     // Verify regulatory compliance
  | 'ethical_review'       // Check against ethical guidelines
  | 'scope_limiter'        // Keep responses on-topic
  | 'confidence_threshold' // Reject low-confidence outputs
  | 'toxicity_filter'      // Block toxic content
  | 'financial_accuracy'   // Verify financial calculations
  | 'legal_compliance';    // Check legal requirements

export type GuardrailSeverity = 'block' | 'warn' | 'flag' | 'log';

export interface GuardrailConfig {
  type: GuardrailType;
  enabled: boolean;
  severity: GuardrailSeverity;
  threshold?: number;
  customRules?: string[];
  allowOverride?: boolean;
  requiresApproval?: boolean;
}

export interface GuardrailResult {
  guardrailType: GuardrailType;
  passed: boolean;
  severity: GuardrailSeverity;
  score: number; // 0-100, higher = more issues
  issues: GuardrailIssue[];
  suggestions?: string[];
  processingTime: number;
}

export interface GuardrailIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: { start: number; end: number };
  matchedText?: string;
  recommendation: string;
}

export interface SentryCheck {
  id: string;
  timestamp: Date;
  organizationId: string;
  userId: string;
  inputType: 'user_query' | 'agent_response' | 'decision' | 'report';
  input: string;
  output?: string;
  agentId?: string;
  modelUsed?: string;
  results: GuardrailResult[];
  overallPassed: boolean;
  overallScore: number;
  wasBlocked: boolean;
  wasModified: boolean;
  modifiedOutput?: string;
  processingTime: number;
}

export interface PIIMatch {
  type: 'email' | 'phone' | 'ssn' | 'credit_card' | 'address' | 'name' | 'dob' | 'ip_address' | 'custom';
  value: string;
  redactedValue: string;
  start: number;
  end: number;
  confidence: number;
}

export interface BiasIndicator {
  type: 'gender' | 'race' | 'age' | 'religion' | 'political' | 'socioeconomic' | 'disability';
  phrase: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  context: string;
}

// =============================================================================
// CENDIA SENTRY SERVICE
// =============================================================================

export class CendiaSentryService extends BaseService {
  private checks: Map<string, SentryCheck> = new Map();
  private guardrailConfigs: Map<string, GuardrailConfig[]> = new Map(); // org -> configs
  private blockedPatterns: Map<GuardrailType, RegExp[]> = new Map();

  constructor() {
    super({
      name: 'CendiaSentryService',
      version: '1.0.0',
      dependencies: ['CendiaAuditService'],
    });
    
    this.initializePatterns();
  }

  async initialize(): Promise<void> {
    this.logger.info('CendiaSentry Service initialized - AI guardrails active');
  }

  async shutdown(): Promise<void> {
    this.logger.info('CendiaSentry Service shutting down');
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: {
        totalChecks: this.checks.size,
        activeGuardrails: this.blockedPatterns.size,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // PATTERN INITIALIZATION
  // ---------------------------------------------------------------------------

  private initializePatterns(): void {
    // PII Patterns
    this.blockedPatterns.set('pii_detector', [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, // Email
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone
      /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, // SSN
      /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, // Credit Card
      /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, // IP
    ]);

    // Toxicity Patterns
    this.blockedPatterns.set('toxicity_filter', [
      // Add patterns for toxic content (simplified for example)
      /\b(hate|kill|destroy|attack)\s+(all|every)\s+\w+/gi,
    ]);

    // Financial Accuracy Patterns (numbers that should be verified)
    this.blockedPatterns.set('financial_accuracy', [
      /\$[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|trillion))?/gi,
      /\b\d+(?:\.\d+)?%\b/g, // Percentages
      /\bROI\s*(?:of\s*)?\d+/gi,
    ]);
  }

  // ---------------------------------------------------------------------------
  // GUARDRAIL CONFIGURATION
  // ---------------------------------------------------------------------------

  /**
   * Set guardrail configuration for an organization
   */
  setGuardrailConfig(organizationId: string, configs: GuardrailConfig[]): void {
    this.guardrailConfigs.set(organizationId, configs);
    this.logger.info(`Updated guardrail config for org ${organizationId}`, { 
      configCount: configs.length 
    });
  }

  /**
   * Get default guardrail configuration
   */
  getDefaultConfig(): GuardrailConfig[] {
    return [
      { type: 'content_filter', enabled: true, severity: 'block', threshold: 0.8 },
      { type: 'pii_detector', enabled: true, severity: 'warn', threshold: 0.9 },
      { type: 'bias_detector', enabled: true, severity: 'flag', threshold: 0.7 },
      { type: 'hallucination_check', enabled: true, severity: 'flag', threshold: 0.6 },
      { type: 'toxicity_filter', enabled: true, severity: 'block', threshold: 0.9 },
      { type: 'financial_accuracy', enabled: true, severity: 'warn', threshold: 0.8 },
      { type: 'scope_limiter', enabled: true, severity: 'warn', threshold: 0.7 },
      { type: 'confidence_threshold', enabled: true, severity: 'flag', threshold: 0.5 },
    ];
  }

  // ---------------------------------------------------------------------------
  // MAIN CHECK FUNCTION
  // ---------------------------------------------------------------------------

  /**
   * Run all guardrails on content
   */
  async checkContent(params: {
    organizationId: string;
    userId: string;
    inputType: SentryCheck['inputType'];
    input: string;
    output?: string;
    agentId?: string;
    modelUsed?: string;
    context?: Record<string, any>;
  }): Promise<SentryCheck> {
    const startTime = Date.now();
    const id = `sentry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get org config or use defaults
    const configs = this.guardrailConfigs.get(params.organizationId) || this.getDefaultConfig();
    
    const results: GuardrailResult[] = [];
    const content = params.output || params.input;
    
    // Run each enabled guardrail
    for (const config of configs) {
      if (!config.enabled) continue;
      
      const result = await this.runGuardrail(config, content, params.context);
      results.push(result);
    }
    
    // Calculate overall status
    const overallScore = results.length > 0 
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length 
      : 0;
    
    const wasBlocked = results.some(r => !r.passed && r.severity === 'block');
    const hasWarnings = results.some(r => !r.passed && r.severity === 'warn');
    
    // Optionally modify output
    let modifiedOutput: string | undefined;
    let wasModified = false;
    
    if (params.output && !wasBlocked) {
      const piiResult = results.find(r => r.guardrailType === 'pii_detector');
      if (piiResult && piiResult.issues.length > 0) {
        modifiedOutput = this.redactPII(params.output);
        wasModified = modifiedOutput !== params.output;
      }
    }
    
    const check: SentryCheck = {
      id,
      timestamp: new Date(),
      organizationId: params.organizationId,
      userId: params.userId,
      inputType: params.inputType,
      input: params.input,
      output: params.output,
      agentId: params.agentId,
      modelUsed: params.modelUsed,
      results,
      overallPassed: !wasBlocked,
      overallScore,
      wasBlocked,
      wasModified,
      modifiedOutput,
      processingTime: Date.now() - startTime,
    };
    
    // Store check
    this.checks.set(id, check);
    
    // Log to audit if there were issues
    if (wasBlocked || hasWarnings) {
      await cendiaAuditService.logGuardrail({
        organizationId: params.organizationId,
        userId: params.userId,
        guardrailType: results.find(r => !r.passed)?.guardrailType || 'unknown',
        triggeredBy: params.agentId || 'user',
        inputContent: content.slice(0, 500),
        reason: results.filter(r => !r.passed).map(r => r.issues[0]?.description).join('; '),
        wasOverridden: false,
      });
    }
    
    this.incrementCounter('sentry_checks', 1);
    if (wasBlocked) this.incrementCounter('sentry_blocks', 1);
    
    return check;
  }

  // ---------------------------------------------------------------------------
  // INDIVIDUAL GUARDRAILS
  // ---------------------------------------------------------------------------

  private async runGuardrail(
    config: GuardrailConfig,
    content: string,
    context?: Record<string, any>
  ): Promise<GuardrailResult> {
    const startTime = Date.now();
    
    switch (config.type) {
      case 'pii_detector':
        return this.checkPII(content, config, startTime);
      
      case 'toxicity_filter':
        return this.checkToxicity(content, config, startTime);
      
      case 'bias_detector':
        return this.checkBias(content, config, startTime);
      
      case 'hallucination_check':
        return this.checkHallucination(content, config, context, startTime);
      
      case 'financial_accuracy':
        return this.checkFinancialAccuracy(content, config, context, startTime);
      
      case 'confidence_threshold':
        return this.checkConfidence(content, config, context, startTime);
      
      case 'scope_limiter':
        return this.checkScope(content, config, context, startTime);
      
      default:
        return {
          guardrailType: config.type,
          passed: true,
          severity: config.severity,
          score: 0,
          issues: [],
          processingTime: Date.now() - startTime,
        };
    }
  }

  /**
   * Check for PII in content
   */
  private checkPII(content: string, config: GuardrailConfig, startTime: number): GuardrailResult {
    const patterns = this.blockedPatterns.get('pii_detector') || [];
    const issues: GuardrailIssue[] = [];
    
    for (const pattern of patterns) {
      const matches = content.matchAll(new RegExp(pattern.source, pattern.flags));
      for (const match of matches) {
        const piiType = this.classifyPII(match[0]);
        issues.push({
          type: 'pii_detected',
          severity: 'high',
          description: `Potential ${piiType} detected`,
          location: { start: match.index || 0, end: (match.index || 0) + match[0].length },
          matchedText: this.maskPII(match[0]),
          recommendation: `Redact or remove ${piiType} before sharing`,
        });
      }
    }
    
    const score = Math.min(100, issues.length * 20);
    
    return {
      guardrailType: 'pii_detector',
      passed: issues.length === 0 || score < (config.threshold || 0.5) * 100,
      severity: config.severity,
      score,
      issues,
      suggestions: issues.length > 0 ? ['Consider using data masking before processing'] : undefined,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Check for toxic content
   */
  private checkToxicity(content: string, config: GuardrailConfig, startTime: number): GuardrailResult {
    const patterns = this.blockedPatterns.get('toxicity_filter') || [];
    const issues: GuardrailIssue[] = [];
    
    // Check patterns
    for (const pattern of patterns) {
      const matches = content.matchAll(new RegExp(pattern.source, pattern.flags));
      for (const match of matches) {
        issues.push({
          type: 'toxic_content',
          severity: 'critical',
          description: 'Potentially harmful content detected',
          matchedText: '[REDACTED]',
          recommendation: 'Remove or rephrase harmful content',
        });
      }
    }
    
    // Simple toxicity heuristics
    const toxicWords = ['hate', 'violence', 'harm', 'attack', 'destroy'];
    const lowerContent = content.toLowerCase();
    for (const word of toxicWords) {
      if (lowerContent.includes(word)) {
        // Check context - not toxic if discussing prevention
        if (!lowerContent.includes(`prevent ${word}`) && !lowerContent.includes(`stop ${word}`)) {
          issues.push({
            type: 'potential_toxicity',
            severity: 'medium',
            description: `Content contains word "${word}" - verify context`,
            recommendation: 'Review content for appropriateness',
          });
        }
      }
    }
    
    const score = Math.min(100, issues.filter(i => i.severity === 'critical').length * 50 + issues.filter(i => i.severity !== 'critical').length * 10);
    
    return {
      guardrailType: 'toxicity_filter',
      passed: !issues.some(i => i.severity === 'critical'),
      severity: config.severity,
      score,
      issues,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Check for bias in content
   */
  private checkBias(content: string, config: GuardrailConfig, startTime: number): GuardrailResult {
    const issues: GuardrailIssue[] = [];
    const lowerContent = content.toLowerCase();
    
    // Gender bias patterns
    const genderBiasPatterns = [
      { pattern: /\b(he|him|his)\b.*\b(leader|executive|engineer|doctor)\b/gi, type: 'gender' },
      { pattern: /\b(she|her)\b.*\b(secretary|nurse|assistant)\b/gi, type: 'gender' },
      { pattern: /\bman(kind|power|made)\b/gi, type: 'gender' },
    ];
    
    for (const { pattern, type } of genderBiasPatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: `${type}_bias`,
          severity: 'medium',
          description: `Potential ${type} bias detected in phrasing`,
          recommendation: 'Consider using gender-neutral language',
        });
      }
    }
    
    // Age bias
    if (/\b(old|elderly|young)\s+(people|workers|employees)\b/i.test(content)) {
      issues.push({
        type: 'age_bias',
        severity: 'low',
        description: 'Age-based generalization detected',
        recommendation: 'Avoid generalizing based on age',
      });
    }
    
    const score = Math.min(100, issues.length * 15);
    
    return {
      guardrailType: 'bias_detector',
      passed: score < (config.threshold || 0.7) * 100,
      severity: config.severity,
      score,
      issues,
      suggestions: issues.length > 0 ? ['Review content for inclusive language'] : undefined,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Check for potential hallucinations
   */
  private checkHallucination(
    content: string, 
    config: GuardrailConfig, 
    context?: Record<string, any>,
    startTime: number = Date.now()
  ): GuardrailResult {
    const issues: GuardrailIssue[] = [];
    
    // Patterns that suggest unverified claims
    const suspiciousPatterns = [
      { pattern: /\b(studies show|research proves|experts agree)\b/gi, reason: 'Uncited claim' },
      { pattern: /\b(always|never|everyone|no one)\b/gi, reason: 'Absolute statement' },
      { pattern: /\b(100%|guaranteed|certain)\b/gi, reason: 'Overconfident claim' },
      { pattern: /\bin \d{4}\b.*\b(will|shall)\b/gi, reason: 'Future prediction' },
    ];
    
    for (const { pattern, reason } of suspiciousPatterns) {
      const matches = content.matchAll(new RegExp(pattern.source, pattern.flags));
      for (const match of matches) {
        issues.push({
          type: 'potential_hallucination',
          severity: 'medium',
          description: `${reason}: "${match[0]}"`,
          matchedText: match[0],
          recommendation: 'Verify claim with sources or add uncertainty language',
        });
      }
    }
    
    // Check for specific numbers without sources
    const numberPattern = /\b\d+(?:\.\d+)?(?:\s*(?:million|billion|percent|%))\b/gi;
    const numbers = content.match(numberPattern) || [];
    if (numbers.length > 3 && !content.includes('source') && !content.includes('according to')) {
      issues.push({
        type: 'unverified_statistics',
        severity: 'medium',
        description: 'Multiple statistics without cited sources',
        recommendation: 'Add sources for statistical claims',
      });
    }
    
    const score = Math.min(100, issues.length * 12);
    
    return {
      guardrailType: 'hallucination_check',
      passed: score < (config.threshold || 0.6) * 100,
      severity: config.severity,
      score,
      issues,
      suggestions: issues.length > 0 ? ['Consider adding sources or qualifying statements'] : undefined,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Check financial accuracy
   */
  private checkFinancialAccuracy(
    content: string,
    config: GuardrailConfig,
    context?: Record<string, any>,
    startTime: number = Date.now()
  ): GuardrailResult {
    const issues: GuardrailIssue[] = [];
    
    // Extract financial figures
    const patterns = this.blockedPatterns.get('financial_accuracy') || [];
    const financialClaims: string[] = [];
    
    for (const pattern of patterns) {
      const matches = content.matchAll(new RegExp(pattern.source, pattern.flags));
      for (const match of matches) {
        financialClaims.push(match[0]);
      }
    }
    
    // Flag if there are many financial claims without caveats
    if (financialClaims.length > 5) {
      if (!content.toLowerCase().includes('estimate') && 
          !content.toLowerCase().includes('approximate') &&
          !content.toLowerCase().includes('projection')) {
        issues.push({
          type: 'unqualified_financial_claims',
          severity: 'medium',
          description: `${financialClaims.length} financial figures without qualification`,
          recommendation: 'Add disclaimers or qualify financial projections',
        });
      }
    }
    
    // Check for unrealistic claims
    const unrealisticPatterns = [
      /\b(?:1000|10000)%\s*(?:ROI|return|growth)/gi,
      /\bguaranteed\s*(?:return|profit|income)/gi,
    ];
    
    for (const pattern of unrealisticPatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: 'unrealistic_financial_claim',
          severity: 'high',
          description: 'Potentially unrealistic financial claim detected',
          recommendation: 'Verify and qualify financial projections',
        });
      }
    }
    
    const score = Math.min(100, issues.length * 20);
    
    return {
      guardrailType: 'financial_accuracy',
      passed: score < (config.threshold || 0.8) * 100,
      severity: config.severity,
      score,
      issues,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Check confidence threshold
   */
  private checkConfidence(
    content: string,
    config: GuardrailConfig,
    context?: Record<string, any>,
    startTime: number = Date.now()
  ): GuardrailResult {
    const issues: GuardrailIssue[] = [];
    
    // Check for uncertainty language
    const uncertaintyMarkers = [
      /\bI'm not sure\b/gi,
      /\bI don't know\b/gi,
      /\buncertain\b/gi,
      /\bpossibly\b/gi,
      /\bmaybe\b/gi,
      /\bmight be\b/gi,
    ];
    
    let uncertaintyCount = 0;
    for (const pattern of uncertaintyMarkers) {
      const matches = content.match(pattern);
      uncertaintyCount += matches?.length || 0;
    }
    
    // High uncertainty relative to content length suggests low confidence
    const contentWords = content.split(/\s+/).length;
    const uncertaintyRatio = uncertaintyCount / contentWords;
    
    if (uncertaintyRatio > 0.05) {
      issues.push({
        type: 'low_confidence_response',
        severity: 'medium',
        description: `High uncertainty ratio (${(uncertaintyRatio * 100).toFixed(1)}%)`,
        recommendation: 'Response may need expert review',
      });
    }
    
    const score = Math.min(100, uncertaintyRatio * 500);
    
    return {
      guardrailType: 'confidence_threshold',
      passed: score < (config.threshold || 0.5) * 100,
      severity: config.severity,
      score,
      issues,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Check if response stays in scope
   */
  private checkScope(
    content: string,
    config: GuardrailConfig,
    context?: Record<string, any>,
    startTime: number = Date.now()
  ): GuardrailResult {
    const issues: GuardrailIssue[] = [];
    
    // Check for off-topic indicators
    const offTopicPatterns = [
      /\bby the way\b/gi,
      /\bunrelated\s*(?:note|topic)\b/gi,
      /\bchanging the subject\b/gi,
      /\boff topic\b/gi,
    ];
    
    for (const pattern of offTopicPatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: 'potential_scope_drift',
          severity: 'low',
          description: 'Content may be drifting from topic',
          recommendation: 'Keep response focused on the original query',
        });
      }
    }
    
    // Check if query context is provided and response matches
    if (context?.originalQuery) {
      const queryWords: Set<string> = new Set(context.originalQuery.toLowerCase().split(/\W+/));
      const responseWords: Set<string> = new Set(content.toLowerCase().split(/\W+/));
      
      const overlap = Array.from(queryWords).filter(w => responseWords.has(w) && w.length > 3).length;
      const relevanceScore = overlap / queryWords.size;
      
      if (relevanceScore < 0.2) {
        issues.push({
          type: 'low_query_relevance',
          severity: 'medium',
          description: `Response may not address the original query (${(relevanceScore * 100).toFixed(0)}% relevance)`,
          recommendation: 'Ensure response directly addresses the user query',
        });
      }
    }
    
    const score = Math.min(100, issues.length * 25);
    
    return {
      guardrailType: 'scope_limiter',
      passed: score < (config.threshold || 0.7) * 100,
      severity: config.severity,
      score,
      issues,
      processingTime: Date.now() - startTime,
    };
  }

  // ---------------------------------------------------------------------------
  // UTILITIES
  // ---------------------------------------------------------------------------

  /**
   * Classify PII type
   */
  private classifyPII(match: string): string {
    if (/@/.test(match)) return 'email address';
    if (/^\d{3}[-.]?\d{3}[-.]?\d{4}$/.test(match)) return 'phone number';
    if (/^\d{3}[-]?\d{2}[-]?\d{4}$/.test(match)) return 'SSN';
    if (/^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/.test(match)) return 'credit card';
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(match)) return 'IP address';
    return 'PII';
  }

  /**
   * Mask PII for logging
   */
  private maskPII(value: string): string {
    if (value.length <= 4) return '****';
    return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
  }

  /**
   * Redact PII from content
   */
  redactPII(content: string): string {
    let redacted = content;
    const patterns = this.blockedPatterns.get('pii_detector') || [];
    
    for (const pattern of patterns) {
      redacted = redacted.replace(new RegExp(pattern.source, pattern.flags), (match) => {
        const type = this.classifyPII(match);
        return `[REDACTED ${type.toUpperCase()}]`;
      });
    }
    
    return redacted;
  }

  /**
   * Get check by ID
   */
  async getCheck(checkId: string): Promise<SentryCheck | null> {
    return this.checks.get(checkId) || null;
  }

  /**
   * Get recent checks for an organization
   */
  async getRecentChecks(organizationId: string, limit: number = 100): Promise<SentryCheck[]> {
    return Array.from(this.checks.values())
      .filter(c => c.organizationId === organizationId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get guardrail statistics
   */
  async getStatistics(organizationId: string, days: number = 30): Promise<{
    totalChecks: number;
    passRate: number;
    blockRate: number;
    issuesByType: Record<string, number>;
    averageScore: number;
  }> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const checks = Array.from(this.checks.values())
      .filter(c => c.organizationId === organizationId && c.timestamp >= cutoff);
    
    const issuesByType: Record<string, number> = {};
    for (const check of checks) {
      for (const result of check.results) {
        for (const issue of result.issues) {
          issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
        }
      }
    }
    
    return {
      totalChecks: checks.length,
      passRate: checks.length > 0 ? checks.filter(c => c.overallPassed).length / checks.length : 1,
      blockRate: checks.length > 0 ? checks.filter(c => c.wasBlocked).length / checks.length : 0,
      issuesByType,
      averageScore: checks.length > 0 ? checks.reduce((sum, c) => sum + c.overallScore, 0) / checks.length : 0,
    };
  }
}

// Export singleton
export const cendiaSentryService = new CendiaSentryService();
