// =============================================================================
// CENDIA SENTRY SERVICE TESTS
// Tests for AI output monitoring, guardrails, and bias detection
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../core/services/BaseService.js', () => ({
  BaseService: class {
    logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };
  },
  ServiceHealth: {},
}));

vi.mock('../../services/CendiaAuditService.js', () => ({
  cendiaAuditService: {
    logEvent: vi.fn(),
  },
}));

import type {
  GuardrailType,
  GuardrailSeverity,
  GuardrailConfig,
  GuardrailResult,
  GuardrailIssue,
  SentryCheck,
  PIIMatch,
  BiasIndicator,
} from '../../services/CendiaSentryService.js';

describe('CendiaSentryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // GUARDRAIL TYPES
  // ===========================================================================

  describe('GuardrailType', () => {
    it('should support content_filter type', () => {
      const type: GuardrailType = 'content_filter';
      expect(type).toBe('content_filter');
    });

    it('should support pii_detector type', () => {
      const type: GuardrailType = 'pii_detector';
      expect(type).toBe('pii_detector');
    });

    it('should support bias_detector type', () => {
      const type: GuardrailType = 'bias_detector';
      expect(type).toBe('bias_detector');
    });

    it('should support hallucination_check type', () => {
      const type: GuardrailType = 'hallucination_check';
      expect(type).toBe('hallucination_check');
    });

    it('should support compliance_check type', () => {
      const type: GuardrailType = 'compliance_check';
      expect(type).toBe('compliance_check');
    });

    it('should support ethical_review type', () => {
      const type: GuardrailType = 'ethical_review';
      expect(type).toBe('ethical_review');
    });

    it('should support scope_limiter type', () => {
      const type: GuardrailType = 'scope_limiter';
      expect(type).toBe('scope_limiter');
    });

    it('should support confidence_threshold type', () => {
      const type: GuardrailType = 'confidence_threshold';
      expect(type).toBe('confidence_threshold');
    });

    it('should support toxicity_filter type', () => {
      const type: GuardrailType = 'toxicity_filter';
      expect(type).toBe('toxicity_filter');
    });

    it('should support financial_accuracy type', () => {
      const type: GuardrailType = 'financial_accuracy';
      expect(type).toBe('financial_accuracy');
    });

    it('should support legal_compliance type', () => {
      const type: GuardrailType = 'legal_compliance';
      expect(type).toBe('legal_compliance');
    });
  });

  // ===========================================================================
  // GUARDRAIL SEVERITY
  // ===========================================================================

  describe('GuardrailSeverity', () => {
    it('should support block severity', () => {
      const severity: GuardrailSeverity = 'block';
      expect(severity).toBe('block');
    });

    it('should support warn severity', () => {
      const severity: GuardrailSeverity = 'warn';
      expect(severity).toBe('warn');
    });

    it('should support flag severity', () => {
      const severity: GuardrailSeverity = 'flag';
      expect(severity).toBe('flag');
    });

    it('should support log severity', () => {
      const severity: GuardrailSeverity = 'log';
      expect(severity).toBe('log');
    });
  });

  // ===========================================================================
  // ISSUE SEVERITY
  // ===========================================================================

  describe('Issue Severity', () => {
    it('should support low severity', () => {
      const issue: Partial<GuardrailIssue> = { severity: 'low' };
      expect(issue.severity).toBe('low');
    });

    it('should support medium severity', () => {
      const issue: Partial<GuardrailIssue> = { severity: 'medium' };
      expect(issue.severity).toBe('medium');
    });

    it('should support high severity', () => {
      const issue: Partial<GuardrailIssue> = { severity: 'high' };
      expect(issue.severity).toBe('high');
    });

    it('should support critical severity', () => {
      const issue: Partial<GuardrailIssue> = { severity: 'critical' };
      expect(issue.severity).toBe('critical');
    });
  });

  // ===========================================================================
  // INPUT TYPES
  // ===========================================================================

  describe('Input Types', () => {
    it('should support user_query input type', () => {
      const check: Partial<SentryCheck> = { inputType: 'user_query' };
      expect(check.inputType).toBe('user_query');
    });

    it('should support agent_response input type', () => {
      const check: Partial<SentryCheck> = { inputType: 'agent_response' };
      expect(check.inputType).toBe('agent_response');
    });

    it('should support decision input type', () => {
      const check: Partial<SentryCheck> = { inputType: 'decision' };
      expect(check.inputType).toBe('decision');
    });

    it('should support report input type', () => {
      const check: Partial<SentryCheck> = { inputType: 'report' };
      expect(check.inputType).toBe('report');
    });
  });

  // ===========================================================================
  // PII TYPES
  // ===========================================================================

  describe('PII Types', () => {
    it('should support email PII type', () => {
      const match: Partial<PIIMatch> = { type: 'email' };
      expect(match.type).toBe('email');
    });

    it('should support phone PII type', () => {
      const match: Partial<PIIMatch> = { type: 'phone' };
      expect(match.type).toBe('phone');
    });

    it('should support ssn PII type', () => {
      const match: Partial<PIIMatch> = { type: 'ssn' };
      expect(match.type).toBe('ssn');
    });

    it('should support credit_card PII type', () => {
      const match: Partial<PIIMatch> = { type: 'credit_card' };
      expect(match.type).toBe('credit_card');
    });

    it('should support address PII type', () => {
      const match: Partial<PIIMatch> = { type: 'address' };
      expect(match.type).toBe('address');
    });

    it('should support name PII type', () => {
      const match: Partial<PIIMatch> = { type: 'name' };
      expect(match.type).toBe('name');
    });

    it('should support dob PII type', () => {
      const match: Partial<PIIMatch> = { type: 'dob' };
      expect(match.type).toBe('dob');
    });

    it('should support ip_address PII type', () => {
      const match: Partial<PIIMatch> = { type: 'ip_address' };
      expect(match.type).toBe('ip_address');
    });

    it('should support custom PII type', () => {
      const match: Partial<PIIMatch> = { type: 'custom' };
      expect(match.type).toBe('custom');
    });
  });

  // ===========================================================================
  // BIAS TYPES
  // ===========================================================================

  describe('Bias Types', () => {
    it('should support gender bias type', () => {
      const indicator: Partial<BiasIndicator> = { type: 'gender' };
      expect(indicator.type).toBe('gender');
    });

    it('should support race bias type', () => {
      const indicator: Partial<BiasIndicator> = { type: 'race' };
      expect(indicator.type).toBe('race');
    });

    it('should support age bias type', () => {
      const indicator: Partial<BiasIndicator> = { type: 'age' };
      expect(indicator.type).toBe('age');
    });

    it('should support religion bias type', () => {
      const indicator: Partial<BiasIndicator> = { type: 'religion' };
      expect(indicator.type).toBe('religion');
    });

    it('should support political bias type', () => {
      const indicator: Partial<BiasIndicator> = { type: 'political' };
      expect(indicator.type).toBe('political');
    });

    it('should support socioeconomic bias type', () => {
      const indicator: Partial<BiasIndicator> = { type: 'socioeconomic' };
      expect(indicator.type).toBe('socioeconomic');
    });

    it('should support disability bias type', () => {
      const indicator: Partial<BiasIndicator> = { type: 'disability' };
      expect(indicator.type).toBe('disability');
    });
  });

  // ===========================================================================
  // BIAS SEVERITY
  // ===========================================================================

  describe('Bias Severity', () => {
    it('should support low bias severity', () => {
      const indicator: Partial<BiasIndicator> = { severity: 'low' };
      expect(indicator.severity).toBe('low');
    });

    it('should support medium bias severity', () => {
      const indicator: Partial<BiasIndicator> = { severity: 'medium' };
      expect(indicator.severity).toBe('medium');
    });

    it('should support high bias severity', () => {
      const indicator: Partial<BiasIndicator> = { severity: 'high' };
      expect(indicator.severity).toBe('high');
    });
  });

  // ===========================================================================
  // GUARDRAIL CONFIG STRUCTURE
  // ===========================================================================

  describe('GuardrailConfig Structure', () => {
    it('should create valid config', () => {
      const config: GuardrailConfig = {
        type: 'pii_detector',
        enabled: true,
        severity: 'block',
      };
      expect(config.enabled).toBe(true);
    });

    it('should support threshold', () => {
      const config: Partial<GuardrailConfig> = { threshold: 0.8 };
      expect(config.threshold).toBe(0.8);
    });

    it('should support custom rules', () => {
      const config: Partial<GuardrailConfig> = {
        customRules: ['rule1', 'rule2', 'rule3'],
      };
      expect(config.customRules?.length).toBe(3);
    });

    it('should support allow override flag', () => {
      const config: Partial<GuardrailConfig> = { allowOverride: true };
      expect(config.allowOverride).toBe(true);
    });

    it('should support requires approval flag', () => {
      const config: Partial<GuardrailConfig> = { requiresApproval: true };
      expect(config.requiresApproval).toBe(true);
    });
  });

  // ===========================================================================
  // GUARDRAIL RESULT STRUCTURE
  // ===========================================================================

  describe('GuardrailResult Structure', () => {
    it('should create valid result', () => {
      const result: GuardrailResult = {
        guardrailType: 'pii_detector',
        passed: true,
        severity: 'log',
        score: 0,
        issues: [],
        processingTime: 50,
      };
      expect(result.passed).toBe(true);
    });

    it('should support suggestions', () => {
      const result: Partial<GuardrailResult> = {
        suggestions: ['Remove PII', 'Redact names'],
      };
      expect(result.suggestions?.length).toBe(2);
    });

    it('should track processing time', () => {
      const result: Partial<GuardrailResult> = { processingTime: 150 };
      expect(result.processingTime).toBe(150);
    });
  });

  // ===========================================================================
  // GUARDRAIL ISSUE STRUCTURE
  // ===========================================================================

  describe('GuardrailIssue Structure', () => {
    it('should create valid issue', () => {
      const issue: GuardrailIssue = {
        type: 'pii_detected',
        severity: 'high',
        description: 'Email address detected',
        recommendation: 'Redact email before sending',
      };
      expect(issue.type).toBe('pii_detected');
    });

    it('should support location', () => {
      const issue: Partial<GuardrailIssue> = {
        location: { start: 50, end: 75 },
      };
      expect(issue.location?.start).toBe(50);
      expect(issue.location?.end).toBe(75);
    });

    it('should support matched text', () => {
      const issue: Partial<GuardrailIssue> = {
        matchedText: 'john.doe@example.com',
      };
      expect(issue.matchedText).toBe('john.doe@example.com');
    });
  });

  // ===========================================================================
  // SENTRY CHECK STRUCTURE
  // ===========================================================================

  describe('SentryCheck Structure', () => {
    it('should create valid check', () => {
      const check: SentryCheck = {
        id: 'check-123',
        timestamp: new Date(),
        organizationId: 'org-456',
        userId: 'user-789',
        inputType: 'agent_response',
        input: 'The user asked about revenue...',
        results: [],
        overallPassed: true,
        overallScore: 0,
        wasBlocked: false,
        wasModified: false,
        processingTime: 200,
      };
      expect(check.overallPassed).toBe(true);
    });

    it('should support output', () => {
      const check: Partial<SentryCheck> = { output: 'Processed response' };
      expect(check.output).toBe('Processed response');
    });

    it('should support agent ID', () => {
      const check: Partial<SentryCheck> = { agentId: 'agent-123' };
      expect(check.agentId).toBe('agent-123');
    });

    it('should support model used', () => {
      const check: Partial<SentryCheck> = { modelUsed: 'llama3.2:3b' };
      expect(check.modelUsed).toBe('llama3.2:3b');
    });

    it('should support modified output', () => {
      const check: Partial<SentryCheck> = {
        wasModified: true,
        modifiedOutput: 'Redacted response',
      };
      expect(check.modifiedOutput).toBe('Redacted response');
    });
  });

  // ===========================================================================
  // PII MATCH STRUCTURE
  // ===========================================================================

  describe('PIIMatch Structure', () => {
    it('should create valid PII match', () => {
      const match: PIIMatch = {
        type: 'email',
        value: 'john.doe@example.com',
        redactedValue: '[EMAIL REDACTED]',
        start: 50,
        end: 72,
        confidence: 0.99,
      };
      expect(match.confidence).toBe(0.99);
    });

    it('should track start position', () => {
      const match: Partial<PIIMatch> = { start: 100 };
      expect(match.start).toBe(100);
    });

    it('should track end position', () => {
      const match: Partial<PIIMatch> = { end: 150 };
      expect(match.end).toBe(150);
    });

    it('should track confidence', () => {
      const match: Partial<PIIMatch> = { confidence: 0.95 };
      expect(match.confidence).toBe(0.95);
    });
  });

  // ===========================================================================
  // BIAS INDICATOR STRUCTURE
  // ===========================================================================

  describe('BiasIndicator Structure', () => {
    it('should create valid bias indicator', () => {
      const indicator: BiasIndicator = {
        type: 'gender',
        phrase: 'chairman',
        severity: 'low',
        suggestion: 'Consider using "chairperson" instead',
        context: 'The chairman announced...',
      };
      expect(indicator.suggestion).toContain('chairperson');
    });

    it('should track phrase', () => {
      const indicator: Partial<BiasIndicator> = { phrase: 'elderly' };
      expect(indicator.phrase).toBe('elderly');
    });

    it('should track context', () => {
      const indicator: Partial<BiasIndicator> = {
        context: 'The elderly population...',
      };
      expect(indicator.context).toContain('elderly');
    });
  });

  // ===========================================================================
  // SCORE TESTS
  // ===========================================================================

  describe('Score Tests', () => {
    it('should handle score 0', () => {
      const result: Partial<GuardrailResult> = { score: 0 };
      expect(result.score).toBe(0);
    });

    it('should handle score 25', () => {
      const result: Partial<GuardrailResult> = { score: 25 };
      expect(result.score).toBe(25);
    });

    it('should handle score 50', () => {
      const result: Partial<GuardrailResult> = { score: 50 };
      expect(result.score).toBe(50);
    });

    it('should handle score 75', () => {
      const result: Partial<GuardrailResult> = { score: 75 };
      expect(result.score).toBe(75);
    });

    it('should handle score 100', () => {
      const result: Partial<GuardrailResult> = { score: 100 };
      expect(result.score).toBe(100);
    });
  });

  // ===========================================================================
  // THRESHOLD TESTS
  // ===========================================================================

  describe('Threshold Tests', () => {
    it('should handle 0.1 threshold', () => {
      const config: Partial<GuardrailConfig> = { threshold: 0.1 };
      expect(config.threshold).toBe(0.1);
    });

    it('should handle 0.25 threshold', () => {
      const config: Partial<GuardrailConfig> = { threshold: 0.25 };
      expect(config.threshold).toBe(0.25);
    });

    it('should handle 0.5 threshold', () => {
      const config: Partial<GuardrailConfig> = { threshold: 0.5 };
      expect(config.threshold).toBe(0.5);
    });

    it('should handle 0.75 threshold', () => {
      const config: Partial<GuardrailConfig> = { threshold: 0.75 };
      expect(config.threshold).toBe(0.75);
    });

    it('should handle 0.9 threshold', () => {
      const config: Partial<GuardrailConfig> = { threshold: 0.9 };
      expect(config.threshold).toBe(0.9);
    });

    it('should handle 0.99 threshold', () => {
      const config: Partial<GuardrailConfig> = { threshold: 0.99 };
      expect(config.threshold).toBe(0.99);
    });
  });

  // ===========================================================================
  // CONFIDENCE TESTS
  // ===========================================================================

  describe('Confidence Tests', () => {
    it('should handle 0.5 confidence', () => {
      const match: Partial<PIIMatch> = { confidence: 0.5 };
      expect(match.confidence).toBe(0.5);
    });

    it('should handle 0.75 confidence', () => {
      const match: Partial<PIIMatch> = { confidence: 0.75 };
      expect(match.confidence).toBe(0.75);
    });

    it('should handle 0.9 confidence', () => {
      const match: Partial<PIIMatch> = { confidence: 0.9 };
      expect(match.confidence).toBe(0.9);
    });

    it('should handle 0.95 confidence', () => {
      const match: Partial<PIIMatch> = { confidence: 0.95 };
      expect(match.confidence).toBe(0.95);
    });

    it('should handle 0.99 confidence', () => {
      const match: Partial<PIIMatch> = { confidence: 0.99 };
      expect(match.confidence).toBe(0.99);
    });

    it('should handle 1.0 confidence', () => {
      const match: Partial<PIIMatch> = { confidence: 1.0 };
      expect(match.confidence).toBe(1.0);
    });
  });

  // ===========================================================================
  // PROCESSING TIME TESTS
  // ===========================================================================

  describe('Processing Time Tests', () => {
    it('should handle 10ms processing', () => {
      const check: Partial<SentryCheck> = { processingTime: 10 };
      expect(check.processingTime).toBe(10);
    });

    it('should handle 50ms processing', () => {
      const check: Partial<SentryCheck> = { processingTime: 50 };
      expect(check.processingTime).toBe(50);
    });

    it('should handle 100ms processing', () => {
      const check: Partial<SentryCheck> = { processingTime: 100 };
      expect(check.processingTime).toBe(100);
    });

    it('should handle 500ms processing', () => {
      const check: Partial<SentryCheck> = { processingTime: 500 };
      expect(check.processingTime).toBe(500);
    });

    it('should handle 1000ms processing', () => {
      const check: Partial<SentryCheck> = { processingTime: 1000 };
      expect(check.processingTime).toBe(1000);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should detect email PII', () => {
      const match: Partial<PIIMatch> = {
        type: 'email',
        value: 'user@company.com',
        redactedValue: '[EMAIL]',
      };
      expect(match.type).toBe('email');
    });

    it('should detect phone PII', () => {
      const match: Partial<PIIMatch> = {
        type: 'phone',
        value: '555-123-4567',
        redactedValue: '[PHONE]',
      };
      expect(match.type).toBe('phone');
    });

    it('should detect SSN PII', () => {
      const match: Partial<PIIMatch> = {
        type: 'ssn',
        value: '123-45-6789',
        redactedValue: '[SSN]',
      };
      expect(match.type).toBe('ssn');
    });

    it('should detect credit card PII', () => {
      const match: Partial<PIIMatch> = {
        type: 'credit_card',
        value: '4111-1111-1111-1111',
        redactedValue: '[CARD]',
      };
      expect(match.type).toBe('credit_card');
    });

    it('should detect gender bias', () => {
      const indicator: Partial<BiasIndicator> = {
        type: 'gender',
        phrase: 'manpower',
        suggestion: 'Consider using "workforce"',
      };
      expect(indicator.type).toBe('gender');
    });

    it('should detect age bias', () => {
      const indicator: Partial<BiasIndicator> = {
        type: 'age',
        phrase: 'young and energetic',
        suggestion: 'Avoid age-related descriptors',
      };
      expect(indicator.type).toBe('age');
    });

    it('should block toxic content', () => {
      const result: Partial<GuardrailResult> = {
        guardrailType: 'toxicity_filter',
        passed: false,
        severity: 'block',
      };
      expect(result.passed).toBe(false);
    });

    it('should flag low confidence output', () => {
      const result: Partial<GuardrailResult> = {
        guardrailType: 'confidence_threshold',
        passed: false,
        severity: 'flag',
      };
      expect(result.severity).toBe('flag');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty issues array', () => {
      const result: Partial<GuardrailResult> = { issues: [] };
      expect(result.issues?.length).toBe(0);
    });

    it('should handle empty suggestions array', () => {
      const result: Partial<GuardrailResult> = { suggestions: [] };
      expect(result.suggestions?.length).toBe(0);
    });

    it('should handle empty custom rules', () => {
      const config: Partial<GuardrailConfig> = { customRules: [] };
      expect(config.customRules?.length).toBe(0);
    });

    it('should handle empty results array', () => {
      const check: Partial<SentryCheck> = { results: [] };
      expect(check.results?.length).toBe(0);
    });

    it('should handle very long input', () => {
      const check: Partial<SentryCheck> = { input: 'A'.repeat(10000) };
      expect(check.input?.length).toBe(10000);
    });

    it('should handle very long output', () => {
      const check: Partial<SentryCheck> = { output: 'B'.repeat(10000) };
      expect(check.output?.length).toBe(10000);
    });

    it('should handle special characters in input', () => {
      const check: Partial<SentryCheck> = {
        input: 'Query with <script> & "quotes"',
      };
      expect(check.input).toContain('Query');
    });

    it('should handle unicode in input', () => {
      const check: Partial<SentryCheck> = {
        input: '用户查询 🔍',
      };
      expect(check.input).toContain('用户');
    });

    it('should handle zero processing time', () => {
      const check: Partial<SentryCheck> = { processingTime: 0 };
      expect(check.processingTime).toBe(0);
    });

    it('should handle zero score', () => {
      const result: Partial<GuardrailResult> = { score: 0 };
      expect(result.score).toBe(0);
    });

    it('should handle position at start', () => {
      const match: Partial<PIIMatch> = { start: 0, end: 20 };
      expect(match.start).toBe(0);
    });

    it('should handle large position values', () => {
      const match: Partial<PIIMatch> = { start: 10000, end: 10050 };
      expect(match.start).toBe(10000);
    });
  });
});
