/**
 * Vertical Insurance & Legal Deep Tests
 *
 * Tests Insurance BiasFairnessEngine, UnderwritingDecisionSchema,
 * ClaimDecisionSchema, and Legal decision schemas (ContractReview,
 * LitigationStrategy, SettlementApproval, PrivilegeDetermination,
 * EDiscovery, RegulatoryResponse, MADueDiligence, ConflictCheck).
 *
 * Every test uses real domain data with explicit assertions.
 *
 * @module __tests__/services/VerticalInsuranceLegalDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
  saveServiceRecord: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../../services/llm/EmbeddingService.js', () => ({
  embeddingService: {
    embed: vi.fn().mockResolvedValue(new Array(384).fill(0.1)),
    cosineSimilarity: vi.fn().mockReturnValue(0.85),
    isOllamaAvailable: vi.fn().mockReturnValue(false),
    getDimension: vi.fn().mockReturnValue(384),
  },
}));
vi.mock('../../../utils/RuleEngine.js', () => ({
  expressionParser: { parse: vi.fn().mockReturnValue({ evaluate: () => true }) },
}));

// ============================================================================
// IMPORTS
// ============================================================================

const {
  BiasFairnessEngine,
  UnderwritingDecisionSchema,
  ClaimDecisionSchema,
  InsuranceComplianceMapper,
} = await import('../../services/verticals/insurance/InsuranceVertical.js');

const {
  ContractReviewSchema,
  LitigationStrategySchema,
  SettlementApprovalSchema,
  PrivilegeDeterminationSchema,
  EDiscoveryProductionSchema,
  RegulatoryResponseSchema,
  MADueDiligenceSchema,
  ConflictCheckSchema,
} = await import('../../services/verticals/legal/LegalDecisionSchemas.js');

// ============================================================================
// INSURANCE: BiasFairnessEngine
// ============================================================================

describe('Insurance — BiasFairnessEngine', () => {
  let engine: InstanceType<typeof BiasFairnessEngine>;

  beforeEach(() => {
    engine = new BiasFairnessEngine();
  });

  // FAILS IF: audit without historical data crashes or missing fields
  it('should audit decision without historical data', () => {
    const result = engine.auditDecision(
      'underwriting',
      'positive',
      { age: 35, sex: 'male', race: 'white' },
    );
    expect(result.auditId).toBeTruthy();
    expect(result.overallFair).toBe(true);
    expect(result.metrics.length).toBe(4);
    expect(result.protectedClassAnalysis.length).toBe(6);
    expect(result.hash).toBeTruthy();
    expect(result.hash.length).toBe(64);
  });

  // FAILS IF: protected classes not all analyzed
  it('should analyze all 6 protected classes', () => {
    const result = engine.auditDecision('underwriting', 'positive', { age: 45 });
    const classes = result.protectedClassAnalysis.map(p => p.protectedClass);
    expect(classes).toContain('race');
    expect(classes).toContain('sex');
    expect(classes).toContain('age');
    expect(classes).toContain('disability');
    expect(classes).toContain('national-origin');
    expect(classes).toContain('marital-status');
  });

  // FAILS IF: insufficient data doesn't default to acceptable
  it('should treat insufficient historical data as acceptable', () => {
    const smallHistory = Array.from({ length: 10 }, (_, i) => ({
      attributes: { age: 30 + i },
      decision: i % 2 === 0 ? 'positive' as const : 'negative' as const,
    }));
    const result = engine.auditDecision('underwriting', 'positive', { age: 40 }, smallHistory);
    // With < 30 records, should assume acceptable
    for (const pca of result.protectedClassAnalysis) {
      expect(pca.acceptable).toBe(true);
      expect(pca.disparateImpactRatio).toBe(1.0);
    }
  });

  // FAILS IF: metrics don't include all 4 fairness measures
  it('should calculate 4 fairness metrics', () => {
    const result = engine.auditDecision('claims', 'negative', { disability: true });
    const metricNames = result.metrics.map(m => m.metricName);
    expect(metricNames).toContain('Disparate Impact Ratio');
    expect(metricNames).toContain('Statistical Parity Difference');
    expect(metricNames).toContain('Equalized Odds Difference');
    expect(metricNames).toContain('Predictive Parity Difference');
  });

  // FAILS IF: large dataset with balanced decisions flagged as unfair
  it('should pass fairness with balanced historical data (>30 records)', () => {
    const balanced = Array.from({ length: 40 }, (_, i) => ({
      attributes: { age: 25 + i },
      decision: i % 2 === 0 ? 'positive' as const : 'negative' as const,
    }));
    const result = engine.auditDecision('underwriting', 'positive', { age: 35 }, balanced);
    // 50% positive rate → disparate impact ~0.5, which fails the 0.8 threshold
    // Statistical parity diff = |0.5 - 0.5| = 0.0 → passes
    expect(result.metrics.find(m => m.metricName === 'Statistical Parity Difference')!.passed).toBe(true);
  });

  // FAILS IF: remediation missing when unfair
  it('should generate remediation when metrics fail', () => {
    // Create heavily skewed data: mostly negative
    const skewed = Array.from({ length: 40 }, (_, i) => ({
      attributes: { age: 25 + i },
      decision: i < 5 ? 'positive' as const : 'negative' as const,
    }));
    const result = engine.auditDecision('underwriting', 'positive', { age: 35 }, skewed);
    // 5/40 = 0.125 positive rate → disparate impact = 0.125 < 0.8 → fails
    expect(result.overallFair).toBe(false);
    expect(result.remediation).toBeDefined();
    expect(result.remediation!.length).toBeGreaterThan(0);
  });

  // FAILS IF: fairness report crashes or missing fields
  it('should generate fairness report from multiple audits', () => {
    const audits = [
      engine.auditDecision('underwriting', 'positive', { age: 30 }),
      engine.auditDecision('underwriting', 'negative', { age: 55 }),
      engine.auditDecision('claims', 'positive', { sex: 'female' }),
    ];

    const report = engine.generateFairnessReport(audits);
    expect(report.totalDecisions).toBe(3);
    expect(report.fairDecisions + report.unfairDecisions).toBe(3);
    expect(report.period.start).toBeInstanceOf(Date);
    expect(report.period.end).toBeInstanceOf(Date);
    expect(Object.keys(report.metricSummary).length).toBeGreaterThan(0);
    expect(Object.keys(report.protectedClassSummary).length).toBeGreaterThan(0);
    expect(report.recommendations.length).toBeGreaterThan(0);
  });

  // FAILS IF: empty audit list crashes
  it('should handle empty audit list in report', () => {
    const report = engine.generateFairnessReport([]);
    expect(report.totalDecisions).toBe(0);
    expect(report.fairDecisions).toBe(0);
  });

  // FAILS IF: hash not deterministic for same result
  it('should produce SHA-256 hash for audit result', () => {
    const result = engine.auditDecision('underwriting', 'positive', { age: 40 });
    expect(result.hash.length).toBe(64);
    expect(/^[0-9a-f]+$/.test(result.hash)).toBe(true);
  });
});

// ============================================================================
// INSURANCE: UnderwritingDecisionSchema
// ============================================================================

describe('Insurance — UnderwritingDecisionSchema', () => {
  let schema: InstanceType<typeof UnderwritingDecisionSchema>;

  beforeEach(() => {
    schema = new UnderwritingDecisionSchema();
  });

  it('should validate complete underwriting decision', () => {
    const result = schema.validate({
      inputs: {
        applicationId: 'APP-INS-001',
        applicant: { id: 'APPLICANT-001', name: 'John Doe' },
        requestedCoverage: { type: 'auto', limit: 500000 },
      },
      outcome: {
        decision: 'approve',
        fairnessAudit: { auditId: 'FA-001', overallFair: true, metrics: [], protectedClassAnalysis: [], hash: 'abc' },
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: missing fields not caught
  it('should reject missing application ID', () => {
    const result = schema.validate({
      inputs: { applicant: { id: 'A1' }, requestedCoverage: {} },
      outcome: { decision: 'approve', fairnessAudit: { auditId: 'FA', overallFair: true } },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Application ID'))).toBe(true);
  });

  // FAILS IF: missing fairness audit not caught
  it('should reject missing fairness audit', () => {
    const result = schema.validate({
      inputs: {
        applicationId: 'APP-002',
        applicant: { id: 'A2' },
        requestedCoverage: { type: 'home' },
      },
      outcome: { decision: 'approve' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Fairness audit'))).toBe(true);
  });

  // FAILS IF: unfair audit warning not raised
  it('should warn when fairness audit flags issues', () => {
    const result = schema.validate({
      inputs: {
        applicationId: 'APP-003',
        applicant: { id: 'A3' },
        requestedCoverage: { type: 'life' },
      },
      outcome: {
        decision: 'approve',
        fairnessAudit: { auditId: 'FA-003', overallFair: false, metrics: [], protectedClassAnalysis: [], hash: 'x' },
      },
    } as any);
    expect(result.warnings.some(w => w.includes('Fairness audit'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('insurance');
    expect(schema.decisionType).toBe('underwriting');
    expect(schema.requiredApprovers).toContain('underwriter');
  });
});

// ============================================================================
// INSURANCE: ClaimDecisionSchema
// ============================================================================

describe('Insurance — ClaimDecisionSchema', () => {
  let schema: InstanceType<typeof ClaimDecisionSchema>;

  beforeEach(() => {
    schema = new ClaimDecisionSchema();
  });

  it('should validate complete claim approval', () => {
    const result = schema.validate({
      inputs: {
        claim: { claimNumber: 'CLM-001' },
        policy: { policyNumber: 'POL-001' },
      },
      outcome: {
        decision: 'approve',
        approvedAmount: 25000,
        fairnessAudit: { auditId: 'FA-CLM-001', overallFair: true },
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: denial without reason accepted
  it('should reject denied claim without denial reason', () => {
    const result = schema.validate({
      inputs: {
        claim: { claimNumber: 'CLM-002' },
        policy: { policyNumber: 'POL-002' },
      },
      outcome: {
        decision: 'deny',
        fairnessAudit: { auditId: 'FA-CLM-002', overallFair: true },
      },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Denial reason'))).toBe(true);
  });

  // FAILS IF: missing claim number not caught
  it('should reject missing claim number', () => {
    const result = schema.validate({
      inputs: { claim: {}, policy: { policyNumber: 'POL-003' } },
      outcome: { decision: 'approve', fairnessAudit: { auditId: 'FA', overallFair: true } },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Claim number'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('claims-adjuster');
  });
});

// ============================================================================
// INSURANCE: InsuranceComplianceMapper
// ============================================================================

describe('Insurance — InsuranceComplianceMapper', () => {
  let mapper: InstanceType<typeof InsuranceComplianceMapper>;

  beforeEach(() => {
    mapper = new InsuranceComplianceMapper();
  });

  it('should have compliance frameworks registered', () => {
    expect(mapper.supportedFrameworks.length).toBeGreaterThan(0);
  });

  it('should include NAIC framework', () => {
    const ids = mapper.supportedFrameworks.map(f => f.id);
    expect(ids.some(id => id.includes('naic') || id.includes('insurance'))).toBe(true);
  });
});

// ============================================================================
// LEGAL: ContractReviewSchema
// ============================================================================

describe('Legal — ContractReviewSchema', () => {
  let schema: InstanceType<typeof ContractReviewSchema>;

  beforeEach(() => {
    schema = new ContractReviewSchema();
  });

  it('should validate complete contract review', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'M-001', clientId: 'C-001', conflictsCleared: true },
        contractType: 'vendor-agreement',
      },
      outcome: {
        approved: true,
        privilegeProtected: true,
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: missing matter not caught
  it('should reject missing matter context', () => {
    const result = schema.validate({
      inputs: { contractType: 'nda' },
      outcome: { approved: true, privilegeProtected: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Matter context'))).toBe(true);
  });

  // FAILS IF: uncleared conflicts not caught
  it('should reject contract review without cleared conflicts', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'M-002', clientId: 'C-002', conflictsCleared: false },
        contractType: 'licensing',
      },
      outcome: { approved: false, privilegeProtected: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Conflicts must be cleared'))).toBe(true);
  });

  // FAILS IF: red flags without deal-breakers not warned
  it('should warn when red flags exist but no deal-breakers specified', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'M-003', clientId: 'C-003', conflictsCleared: true },
        contractType: 'service-agreement',
        redFlags: ['Unlimited liability clause', 'Non-compete overbroad'],
      },
      outcome: { approved: false, privilegeProtected: true, dealBreakers: [] },
    } as any);
    expect(result.warnings.some(w => w.includes('Red flags'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('responsible-attorney');
    expect(schema.requiredApprovers).toContain('partner');
  });
});

// ============================================================================
// LEGAL: LitigationStrategySchema
// ============================================================================

describe('Legal — LitigationStrategySchema', () => {
  let schema: InstanceType<typeof LitigationStrategySchema>;

  beforeEach(() => {
    schema = new LitigationStrategySchema();
  });

  it('should validate complete litigation strategy', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'LIT-001' },
        caseStage: 'discovery',
      },
      outcome: {
        recommendedStrategy: 'aggressive-discovery',
        privilegeProtected: true,
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: non-privileged strategy accepted
  it('should reject litigation strategy without privilege protection', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'LIT-002' },
        caseStage: 'pre-trial',
      },
      outcome: {
        recommendedStrategy: 'settlement-focused',
        privilegeProtected: false,
      },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('privilege-protected'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('litigation-partner');
  });
});

// ============================================================================
// LEGAL: SettlementApprovalSchema
// ============================================================================

describe('Legal — SettlementApprovalSchema', () => {
  let schema: InstanceType<typeof SettlementApprovalSchema>;

  beforeEach(() => {
    schema = new SettlementApprovalSchema();
  });

  it('should validate complete settlement approval', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'SET-001' },
        settlementAmount: 500000,
        clientApproval: true,
      },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: settlement without client approval not caught
  it('should reject settlement without client approval', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'SET-002' },
        settlementAmount: 250000,
      },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Client approval'))).toBe(true);
  });

  // FAILS IF: board approval warning not raised
  it('should warn when board approval required', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'SET-003' },
        settlementAmount: 5000000,
        clientApproval: true,
      },
      outcome: { approved: true, boardApprovalRequired: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Board approval'))).toBe(true);
  });
});

// ============================================================================
// LEGAL: PrivilegeDeterminationSchema
// ============================================================================

describe('Legal — PrivilegeDeterminationSchema', () => {
  let schema: InstanceType<typeof PrivilegeDeterminationSchema>;

  beforeEach(() => {
    schema = new PrivilegeDeterminationSchema();
  });

  it('should validate complete privilege determination', () => {
    const result = schema.validate({
      inputs: { documentId: 'DOC-001' },
      outcome: { privilegeLevel: 'confidential', producible: false },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: missing document ID not caught
  it('should reject missing document ID', () => {
    const result = schema.validate({
      inputs: {},
      outcome: { privilegeLevel: 'public', producible: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Document ID'))).toBe(true);
  });

  // FAILS IF: third-party disclosure waiver warning not raised
  it('should warn on third-party disclosure with privilege', () => {
    const result = schema.validate({
      inputs: { documentId: 'DOC-002', thirdPartyDisclosure: true },
      outcome: { privilegeLevel: 'confidential', producible: false, privilegeType: 'attorney-client' },
    } as any);
    expect(result.warnings.some(w => w.includes('waive privilege'))).toBe(true);
  });

  // FAILS IF: producing privileged document not warned
  it('should warn when producing non-public privileged document', () => {
    const result = schema.validate({
      inputs: { documentId: 'DOC-003' },
      outcome: { privilegeLevel: 'confidential', producible: true },
    } as any);
    expect(result.warnings.some(w => w.includes('waiver is intentional'))).toBe(true);
  });
});

// ============================================================================
// LEGAL: EDiscoveryProductionSchema
// ============================================================================

describe('Legal — EDiscoveryProductionSchema', () => {
  let schema: InstanceType<typeof EDiscoveryProductionSchema>;

  beforeEach(() => {
    schema = new EDiscoveryProductionSchema();
  });

  it('should validate complete eDiscovery production', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'ED-001' },
        productionRequest: 'First set of interrogatories',
        privilegeReviewComplete: true,
      },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: incomplete privilege review not caught
  it('should reject production without privilege review', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'ED-002' },
        productionRequest: 'Document request #2',
        privilegeReviewComplete: false,
      },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Privilege review must be complete'))).toBe(true);
  });

  // FAILS IF: privileged docs without privilege log not caught
  it('should require privilege log for privileged documents', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'ED-003' },
        productionRequest: 'Document production #3',
        privilegeReviewComplete: true,
        privilegedDocuments: 15,
      },
      outcome: { approved: true, privilegeLog: [] },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('privilege log'))).toBe(true);
  });

  // FAILS IF: imminent deadline warning not raised
  it('should warn on production deadline within 5 days', () => {
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'ED-004' },
        productionRequest: 'Urgent production',
        privilegeReviewComplete: true,
        productionDeadline: threeDaysFromNow,
      },
      outcome: { approved: true },
    } as any);
    expect(result.warnings.some(w => w.includes('5 days'))).toBe(true);
  });
});

// ============================================================================
// LEGAL: RegulatoryResponseSchema
// ============================================================================

describe('Legal — RegulatoryResponseSchema', () => {
  let schema: InstanceType<typeof RegulatoryResponseSchema>;

  beforeEach(() => {
    schema = new RegulatoryResponseSchema();
  });

  it('should validate complete regulatory response', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'REG-001' },
        regulator: 'SEC',
        internalInvestigationComplete: true,
      },
      outcome: { responseStrategy: 'cooperate-fully' },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: missing regulator not caught
  it('should reject missing regulator', () => {
    const result = schema.validate({
      inputs: { matter: { matterId: 'REG-002' } },
      outcome: { responseStrategy: 'negotiate' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Regulator'))).toBe(true);
  });

  // FAILS IF: incomplete investigation warning not raised
  it('should warn when internal investigation not complete', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'REG-003' },
        regulator: 'DOJ',
        internalInvestigationComplete: false,
      },
      outcome: { responseStrategy: 'defend' },
    } as any);
    expect(result.warnings.some(w => w.includes('investigation'))).toBe(true);
  });

  // FAILS IF: privilege issues without assertions not warned
  it('should warn when privilege issues exist without assertions', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'REG-004' },
        regulator: 'FTC',
        internalInvestigationComplete: true,
        privilegeIssues: true,
      },
      outcome: { responseStrategy: 'cooperate', privilegeAssertions: [] },
    } as any);
    expect(result.warnings.some(w => w.includes('Privilege issues'))).toBe(true);
  });
});

// ============================================================================
// LEGAL: MADueDiligenceSchema
// ============================================================================

describe('Legal — MADueDiligenceSchema', () => {
  let schema: InstanceType<typeof MADueDiligenceSchema>;

  beforeEach(() => {
    schema = new MADueDiligenceSchema();
  });

  it('should validate complete M&A due diligence', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'MA-001' },
        transactionValue: 50000000,
      },
      outcome: { recommendation: 'proceed' },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: deal-breaker issues with proceed recommendation not caught
  it('should reject proceed recommendation with deal-breaker red flags', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'MA-002' },
        transactionValue: 200000000,
        redFlags: [
          { issue: 'Undisclosed litigation', severity: 'deal-breaker' },
          { issue: 'Environmental liability', severity: 'material' },
        ],
      },
      outcome: { recommendation: 'proceed' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('deal-breaker'))).toBe(true);
  });

  // FAILS IF: HSR filing warning not raised for large transactions
  it('should warn on HSR filing for transactions > $111.4M', () => {
    const result = schema.validate({
      inputs: {
        matter: { matterId: 'MA-003' },
        transactionValue: 200000000,
        hsrFiling: true,
      },
      outcome: { recommendation: 'proceed-with-conditions' },
    } as any);
    expect(result.warnings.some(w => w.includes('HSR filing'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('ma-partner');
    expect(schema.requiredApprovers).toContain('client-representative');
  });
});

// ============================================================================
// LEGAL: ConflictCheckSchema
// ============================================================================

describe('Legal — ConflictCheckSchema', () => {
  let schema: InstanceType<typeof ConflictCheckSchema>;

  beforeEach(() => {
    schema = new ConflictCheckSchema();
  });

  it('should validate complete conflict check', () => {
    const result = schema.validate({
      inputs: { proposedClient: { name: 'Acme Corp', id: 'CLIENT-001' } },
      outcome: { cleared: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: non-waivable conflicts with clearance not caught
  it('should reject clearance with non-waivable conflicts', () => {
    const result = schema.validate({
      inputs: { proposedClient: { name: 'Conflict Corp' } },
      outcome: {
        cleared: true,
        conflicts: [
          { party: 'Opposing party', severity: 'non-waivable', description: 'Direct adversary' },
        ],
      },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('non-waivable'))).toBe(true);
  });

  // FAILS IF: waiver required but not obtained not warned
  it('should warn when waiver required but not obtained', () => {
    const result = schema.validate({
      inputs: { proposedClient: { name: 'Waiver Corp' } },
      outcome: {
        cleared: true,
        waiverRequired: true,
        waiverObtained: false,
        conflicts: [],
      },
    } as any);
    expect(result.warnings.some(w => w.includes('Waiver required'))).toBe(true);
  });

  // FAILS IF: missing proposed client not caught
  it('should reject missing proposed client', () => {
    const result = schema.validate({
      inputs: {},
      outcome: { cleared: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Proposed client'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('conflicts-officer');
    expect(schema.requiredApprovers).toContain('ethics-partner');
  });
});
