/**
 * CendiaSentryService Deep Tests
 *
 * Tests AI guardrails enforcement:
 * - PII detection (email, phone, SSN, credit card, IP)
 * - PII redaction and masking
 * - Toxicity filtering with context awareness
 * - Bias detection (gender, age)
 * - Hallucination detection (uncited claims, absolute statements)
 * - Financial accuracy checking
 * - Confidence threshold checking
 * - Scope drift detection
 * - Full checkContent pipeline with blocking/warning/passing
 * - Guardrail configuration (default + custom)
 * - Statistics and recent checks retrieval
 * - Health check
 *
 * @module __tests__/services/CendiaSentryDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../services/CendiaAuditService.js', () => ({
  cendiaAuditService: {
    logGuardrail: vi.fn().mockResolvedValue(undefined),
  },
}));

const { CendiaSentryService } = await import('../../services/CendiaSentryService.js');

const ORG = 'org-sentry-test';
const USER = 'usr-analyst';

function createSentry(): InstanceType<typeof CendiaSentryService> {
  return new CendiaSentryService();
}

// ============================================================================
// PII DETECTION
// ============================================================================

describe('CendiaSentry — PII Detection', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: email not detected
  it('should detect email addresses', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Show me contact details', output: 'Please contact john.doe@acmecorp.com for details',
    });
    const piiResult = check.results.find(r => r.guardrailType === 'pii_detector');
    expect(piiResult).toBeDefined();
    expect(piiResult!.issues.length).toBeGreaterThan(0);
    expect(piiResult!.issues[0].type).toBe('pii_detected');
    expect(piiResult!.issues[0].description).toContain('email');
  });

  // FAILS IF: phone number not detected
  it('should detect phone numbers', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Call us at 555-123-4567 for support',
    });
    const piiResult = check.results.find(r => r.guardrailType === 'pii_detector');
    expect(piiResult!.issues.length).toBeGreaterThan(0);
    expect(piiResult!.issues.some(i => i.description?.includes('phone'))).toBe(true);
  });

  // FAILS IF: SSN not detected
  it('should detect social security numbers', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'The SSN is 123-45-6789',
    });
    const piiResult = check.results.find(r => r.guardrailType === 'pii_detector');
    expect(piiResult!.issues.length).toBeGreaterThan(0);
  });

  // FAILS IF: credit card not detected
  it('should detect credit card numbers', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Card number: 4111 1111 1111 1111',
    });
    const piiResult = check.results.find(r => r.guardrailType === 'pii_detector');
    expect(piiResult!.issues.length).toBeGreaterThan(0);
  });

  // FAILS IF: IP address not detected
  it('should detect IP addresses', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Server is at 192.168.1.100',
    });
    const piiResult = check.results.find(r => r.guardrailType === 'pii_detector');
    expect(piiResult!.issues.length).toBeGreaterThan(0);
  });

  // FAILS IF: clean text triggers PII
  it('should pass clean text without PII', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'The quarterly revenue increased by 15% compared to last year.',
    });
    const piiResult = check.results.find(r => r.guardrailType === 'pii_detector');
    expect(piiResult!.issues.length).toBe(0);
    expect(piiResult!.passed).toBe(true);
  });
});

// ============================================================================
// PII REDACTION
// ============================================================================

describe('CendiaSentry — PII Redaction', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: redactPII doesn't replace emails
  it('should redact email addresses', () => {
    const result = sentry.redactPII('Contact john@example.com for details');
    expect(result).not.toContain('john@example.com');
    expect(result).toContain('[REDACTED');
  });

  // FAILS IF: redactPII doesn't replace phone numbers
  it('should redact phone numbers', () => {
    const result = sentry.redactPII('Call 555-123-4567');
    expect(result).not.toContain('555-123-4567');
    expect(result).toContain('[REDACTED');
  });

  // FAILS IF: redactPII modifies clean text
  it('should not modify clean text', () => {
    const clean = 'Revenue is up this quarter with no concerns.';
    expect(sentry.redactPII(clean)).toBe(clean);
  });

  // FAILS IF: output modification flag not set
  it('should set wasModified when PII is redacted from output', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Contact sarah@corp.com for the report',
    });
    // If PII was found, output should be modified
    if (check.results.some(r => r.guardrailType === 'pii_detector' && r.issues.length > 0)) {
      expect(check.wasModified).toBe(true);
      expect(check.modifiedOutput).toBeDefined();
      expect(check.modifiedOutput).not.toContain('sarah@corp.com');
    }
  });
});

// ============================================================================
// TOXICITY FILTER
// ============================================================================

describe('CendiaSentry — Toxicity Filter', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: toxic pattern not detected
  it('should detect toxic content with hate patterns', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'We should destroy all competitors immediately',
    });
    const toxResult = check.results.find(r => r.guardrailType === 'toxicity_filter');
    expect(toxResult).toBeDefined();
    expect(toxResult!.issues.length).toBeGreaterThan(0);
  });

  // FAILS IF: clean business text triggers toxicity
  it('should pass normal business content', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'The market analysis suggests a 12% growth opportunity in Q3.',
    });
    const toxResult = check.results.find(r => r.guardrailType === 'toxicity_filter');
    expect(toxResult!.passed).toBe(true);
  });

  // FAILS IF: prevention context not recognized
  it('should allow prevention context (e.g., "prevent harm")', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Our security team works to prevent harm to our infrastructure.',
    });
    const toxResult = check.results.find(r => r.guardrailType === 'toxicity_filter');
    // "harm" in prevention context should not be critical
    const criticalIssues = toxResult!.issues.filter(i => i.severity === 'critical');
    expect(criticalIssues.length).toBe(0);
  });
});

// ============================================================================
// BIAS DETECTION
// ============================================================================

describe('CendiaSentry — Bias Detection', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: gender bias not detected
  it('should detect gender-biased language', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'He is a natural leader and executive material.',
    });
    const biasResult = check.results.find(r => r.guardrailType === 'bias_detector');
    expect(biasResult).toBeDefined();
    expect(biasResult!.issues.some(i => i.type?.includes('gender'))).toBe(true);
  });

  // FAILS IF: age bias not detected
  it('should detect age-biased language', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Old workers are slower to adopt new technology.',
    });
    const biasResult = check.results.find(r => r.guardrailType === 'bias_detector');
    expect(biasResult!.issues.some(i => i.type === 'age_bias')).toBe(true);
  });

  // FAILS IF: neutral language triggers bias
  it('should pass neutral inclusive language', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'The team demonstrated strong collaboration and delivered the project on time.',
    });
    const biasResult = check.results.find(r => r.guardrailType === 'bias_detector');
    expect(biasResult!.issues.length).toBe(0);
  });
});

// ============================================================================
// HALLUCINATION CHECK
// ============================================================================

describe('CendiaSentry — Hallucination Detection', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: uncited claims not flagged
  it('should flag uncited claims', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Studies show that 90% of companies fail. Research proves that AI is always better. Experts agree this is certain.',
    });
    const hallResult = check.results.find(r => r.guardrailType === 'hallucination_check');
    expect(hallResult!.issues.length).toBeGreaterThan(0);
    expect(hallResult!.issues.some(i => i.description?.includes('Uncited'))).toBe(true);
  });

  // FAILS IF: absolute statements not flagged
  it('should flag absolute statements', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'This approach always works and never fails. Everyone agrees.',
    });
    const hallResult = check.results.find(r => r.guardrailType === 'hallucination_check');
    expect(hallResult!.issues.some(i => i.description?.includes('Absolute'))).toBe(true);
  });

  // FAILS IF: overconfident claims not flagged
  it('should flag overconfident claims', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'This strategy is 100% guaranteed to work.',
    });
    const hallResult = check.results.find(r => r.guardrailType === 'hallucination_check');
    expect(hallResult!.issues.length).toBeGreaterThan(0);
  });

  // FAILS IF: qualified statements trigger hallucination check
  it('should pass properly qualified statements', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Based on available data, the revenue growth is approximately 8%.',
    });
    const hallResult = check.results.find(r => r.guardrailType === 'hallucination_check');
    expect(hallResult!.passed).toBe(true);
  });
});

// ============================================================================
// FINANCIAL ACCURACY
// ============================================================================

describe('CendiaSentry — Financial Accuracy', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: unrealistic ROI not flagged
  it('should flag unrealistic financial claims', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'This investment guarantees a 10000% ROI within 6 months.',
    });
    const finResult = check.results.find(r => r.guardrailType === 'financial_accuracy');
    expect(finResult!.issues.length).toBeGreaterThan(0);
    expect(finResult!.issues.some(i => i.type === 'unrealistic_financial_claim')).toBe(true);
  });

  // FAILS IF: many unqualified financial figures not flagged
  it('should flag many financial figures without qualification', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Revenue is $5 million. Costs are $2 million. Profit is $3 million. Growth is 15%. EBITDA margin is 25%. ROI is 200%. Market cap is $100 million. Debt is $50 million. Cash is $10 million. Yield is 8%.',
    });
    const finResult = check.results.find(r => r.guardrailType === 'financial_accuracy');
    expect(finResult!.issues.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// CONFIDENCE THRESHOLD
// ============================================================================

describe('CendiaSentry — Confidence Threshold', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: low-confidence response not flagged
  it('should flag low-confidence response with many uncertainty markers', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: "I'm not sure maybe possibly uncertain might be I don't know possibly maybe uncertain",
    });
    const confResult = check.results.find(r => r.guardrailType === 'confidence_threshold');
    expect(confResult!.issues.length).toBeGreaterThan(0);
    expect(confResult!.issues[0].type).toBe('low_confidence_response');
  });

  // FAILS IF: confident response triggers low confidence
  it('should pass confident response', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Based on our analysis, the quarterly revenue increased by 12% driven by strong demand in the enterprise segment. The operating margin improved by 3 percentage points.',
    });
    const confResult = check.results.find(r => r.guardrailType === 'confidence_threshold');
    expect(confResult!.passed).toBe(true);
  });
});

// ============================================================================
// SCOPE LIMITER
// ============================================================================

describe('CendiaSentry — Scope Limiter', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: off-topic indicator not flagged
  it('should flag scope drift indicators', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'The revenue analysis looks good. By the way, have you tried the new coffee machine? Changing the subject, the weather is nice.',
    });
    const scopeResult = check.results.find(r => r.guardrailType === 'scope_limiter');
    expect(scopeResult!.issues.length).toBeGreaterThan(0);
    expect(scopeResult!.issues.some(i => i.type === 'potential_scope_drift')).toBe(true);
  });

  // FAILS IF: low query relevance not detected
  it('should flag low relevance to original query', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'The cat sat on the mat. It was a lovely day.',
      context: { originalQuery: 'What is our quarterly revenue forecast for EMEA?' },
    });
    const scopeResult = check.results.find(r => r.guardrailType === 'scope_limiter');
    expect(scopeResult!.issues.some(i => i.type === 'low_query_relevance')).toBe(true);
  });
});

// ============================================================================
// FULL PIPELINE — BLOCKING, WARNING, PASSING
// ============================================================================

describe('CendiaSentry — Full Pipeline', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: toxic content not blocked
  it('should block toxic content overall', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'We should hate all competitors and attack every one of them.',
    });
    // Toxicity filter is set to 'block' severity
    expect(check.wasBlocked).toBe(true);
    expect(check.overallPassed).toBe(false);
  });

  // FAILS IF: clean content blocked
  it('should pass clean business content through all guardrails', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'The team completed the project milestone on schedule with all deliverables meeting quality standards.',
    });
    expect(check.overallPassed).toBe(true);
    expect(check.wasBlocked).toBe(false);
    expect(check.results.length).toBeGreaterThan(0);
    expect(check.processingTime).toBeGreaterThanOrEqual(0);
  });

  // FAILS IF: check not stored for retrieval
  it('should store and retrieve checks', async () => {
    const check = await sentry.checkContent({
      organizationId: ORG, userId: USER, inputType: 'agent_response',
      input: 'Analyze this', output: 'Test content for storage',
    });
    const retrieved = await sentry.getCheck(check.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe(check.id);
    expect(retrieved!.organizationId).toBe(ORG);
  });

  // FAILS IF: recent checks not filtered by org
  it('should retrieve recent checks for organization', async () => {
    const uniqueOrg = `org-recent-${Date.now()}`;
    await sentry.checkContent({
      organizationId: uniqueOrg, userId: USER, inputType: 'user_query',
      input: 'Test input 1',
    });
    await sentry.checkContent({
      organizationId: uniqueOrg, userId: USER, inputType: 'user_query',
      input: 'Test input 2',
    });

    const recent = await sentry.getRecentChecks(uniqueOrg);
    expect(recent.length).toBe(2);
    expect(recent.every(c => c.organizationId === uniqueOrg)).toBe(true);
  });
});

// ============================================================================
// GUARDRAIL CONFIGURATION
// ============================================================================

describe('CendiaSentry — Configuration', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: default config missing expected guardrails
  it('should have default config with all guardrail types', () => {
    const config = sentry.getDefaultConfig();
    expect(config.length).toBe(8);
    const types = config.map(c => c.type);
    expect(types).toContain('content_filter');
    expect(types).toContain('pii_detector');
    expect(types).toContain('bias_detector');
    expect(types).toContain('hallucination_check');
    expect(types).toContain('toxicity_filter');
    expect(types).toContain('financial_accuracy');
    expect(types).toContain('scope_limiter');
    expect(types).toContain('confidence_threshold');
  });

  // FAILS IF: custom config not applied
  it('should apply custom guardrail configuration', async () => {
    const customOrg = `org-custom-${Date.now()}`;
    sentry.setGuardrailConfig(customOrg, [
      { type: 'pii_detector', enabled: true, severity: 'block', threshold: 0.1 },
    ]);

    const check = await sentry.checkContent({
      organizationId: customOrg, userId: USER, inputType: 'agent_response',
      input: 'Show info', output: 'Contact admin@test.com for info',
    });
    // Only PII should be checked
    expect(check.results.length).toBe(1);
    expect(check.results[0].guardrailType).toBe('pii_detector');
  });

  // FAILS IF: disabled guardrails still run
  it('should skip disabled guardrails', async () => {
    const disabledOrg = `org-disabled-${Date.now()}`;
    sentry.setGuardrailConfig(disabledOrg, [
      { type: 'pii_detector', enabled: false, severity: 'warn', threshold: 0.5 },
      { type: 'toxicity_filter', enabled: true, severity: 'block', threshold: 0.9 },
    ]);

    const check = await sentry.checkContent({
      organizationId: disabledOrg, userId: USER, inputType: 'agent_response',
      input: 'Show info', output: 'Contact admin@test.com',
    });
    // PII should not be in results since disabled
    expect(check.results.every(r => r.guardrailType !== 'pii_detector')).toBe(true);
  });
});

// ============================================================================
// STATISTICS & HEALTH
// ============================================================================

describe('CendiaSentry — Statistics & Health', () => {
  let sentry: InstanceType<typeof CendiaSentryService>;
  beforeEach(() => { sentry = createSentry(); });

  // FAILS IF: statistics returns wrong shape
  it('should calculate guardrail statistics', async () => {
    const statsOrg = `org-stats-${Date.now()}`;
    await sentry.checkContent({
      organizationId: statsOrg, userId: USER, inputType: 'agent_response',
      input: 'Check this', output: 'Clean content',
    });
    await sentry.checkContent({
      organizationId: statsOrg, userId: USER, inputType: 'agent_response',
      input: 'Check this', output: 'Contact admin@corp.com with SSN 123-45-6789',
    });

    const stats = await sentry.getStatistics(statsOrg);
    expect(stats.totalChecks).toBe(2);
    expect(typeof stats.passRate).toBe('number');
    expect(typeof stats.blockRate).toBe('number');
    expect(typeof stats.averageScore).toBe('number');
    expect(typeof stats.issuesByType).toBe('object');
  });

  // FAILS IF: health check returns wrong shape
  it('should return healthy status', async () => {
    const health = await sentry.healthCheck();
    expect(health.status).toBe('healthy');
    expect(health.lastCheck).toBeInstanceOf(Date);
    expect(health.details).toHaveProperty('totalChecks');
    expect(health.details).toHaveProperty('activeGuardrails');
  });
});
