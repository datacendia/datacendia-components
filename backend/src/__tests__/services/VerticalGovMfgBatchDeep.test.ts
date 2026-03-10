/**
 * Vertical Government, Manufacturing & Batch Deep Tests
 *
 * Tests Government (Procurement, Policy, Grant, Budget schemas),
 * Manufacturing (Production, Quality, Safety, Rebalance schemas),
 * and batch-tests the remaining verticals' VerticalImplementation pattern.
 *
 * @module __tests__/services/VerticalGovMfgBatchDeep.test
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
  expressionParser: {
    parse: vi.fn().mockReturnValue({ evaluate: () => true }),
    evaluateBoolean: vi.fn().mockReturnValue(false),
  },
}));

// ============================================================================
// IMPORTS
// ============================================================================

const {
  ProcurementDecisionSchema,
  PolicyDecisionSchema,
  GrantDecisionSchema,
  BudgetDecisionSchema,
  GovernmentComplianceMapper,
} = await import('../../services/verticals/government/GovernmentVertical.js');

const {
  productionDecisionSchema,
  qualityApprovalSchema,
  safetyEscalationSchema,
  PortfolioRebalanceSchema,
  ManufacturingComplianceMapper,
} = await import('../../services/verticals/manufacturing/ManufacturingVertical.js');

// ============================================================================
// GOVERNMENT: ProcurementDecisionSchema
// ============================================================================

describe('Government — ProcurementDecisionSchema', () => {
  let schema: InstanceType<typeof ProcurementDecisionSchema>;

  beforeEach(() => {
    schema = new ProcurementDecisionSchema();
  });

  it('should validate complete procurement decision', () => {
    const result = schema.validate({
      inputs: {
        solicitationNumber: 'SOL-2026-001',
        acquisitionType: 'full-and-open',
        estimatedValue: 2500000,
      },
      outcome: {
        awarded: true,
        rationale: 'Best value determination based on technical and price factors',
      },
    } as any);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // FAILS IF: missing solicitation not caught
  it('should reject missing solicitation number', () => {
    const result = schema.validate({
      inputs: { acquisitionType: 'competitive', estimatedValue: 100000 },
      outcome: { awarded: false, rationale: 'No acceptable bids' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Solicitation number'))).toBe(true);
  });

  // FAILS IF: sole-source J&A warning not raised
  it('should warn on sole-source without competition documentation', () => {
    const result = schema.validate({
      inputs: {
        solicitationNumber: 'SOL-2026-002',
        acquisitionType: 'sole-source',
        estimatedValue: 500000,
      },
      outcome: {
        awarded: true,
        rationale: 'Only qualified vendor',
        competitionDocumented: false,
      },
    } as any);
    expect(result.warnings.some(w => w.includes('J&A'))).toBe(true);
  });

  // FAILS IF: sole-source with competition doc still warned
  it('should not warn on sole-source with competition documented', () => {
    const result = schema.validate({
      inputs: {
        solicitationNumber: 'SOL-2026-003',
        acquisitionType: 'sole-source',
        estimatedValue: 750000,
      },
      outcome: {
        awarded: true,
        rationale: 'Urgent need',
        competitionDocumented: true,
      },
    } as any);
    expect(result.warnings.filter(w => w.includes('J&A'))).toHaveLength(0);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('government');
    expect(schema.decisionType).toBe('procurement');
    expect(schema.requiredApprovers).toContain('contracting-officer');
    expect(schema.requiredApprovers).toContain('legal-counsel');
  });
});

// ============================================================================
// GOVERNMENT: PolicyDecisionSchema
// ============================================================================

describe('Government — PolicyDecisionSchema', () => {
  let schema: InstanceType<typeof PolicyDecisionSchema>;

  beforeEach(() => {
    schema = new PolicyDecisionSchema();
  });

  it('should validate complete policy decision', () => {
    const result = schema.validate({
      inputs: { policyId: 'POL-2026-001', policyType: 'regulatory' },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing policy ID', () => {
    const result = schema.validate({
      inputs: { policyType: 'administrative' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Policy ID'))).toBe(true);
  });

  it('should reject missing policy type', () => {
    const result = schema.validate({
      inputs: { policyId: 'POL-002' },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Policy type'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('agency-head');
    expect(schema.requiredApprovers).toContain('general-counsel');
  });
});

// ============================================================================
// GOVERNMENT: GrantDecisionSchema
// ============================================================================

describe('Government — GrantDecisionSchema', () => {
  let schema: InstanceType<typeof GrantDecisionSchema>;

  beforeEach(() => {
    schema = new GrantDecisionSchema();
  });

  it('should validate complete grant decision', () => {
    const result = schema.validate({
      inputs: { opportunityNumber: 'GRANT-2026-001', requestedAmount: 1500000 },
      outcome: { awarded: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing opportunity number', () => {
    const result = schema.validate({
      inputs: { requestedAmount: 500000 },
      outcome: { awarded: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Opportunity number'))).toBe(true);
  });

  it('should reject non-numeric amount', () => {
    const result = schema.validate({
      inputs: { opportunityNumber: 'G-002' },
      outcome: { awarded: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Requested amount'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('program-officer');
    expect(schema.requiredApprovers).toContain('grants-officer');
  });
});

// ============================================================================
// GOVERNMENT: BudgetDecisionSchema
// ============================================================================

describe('Government — BudgetDecisionSchema', () => {
  let schema: InstanceType<typeof BudgetDecisionSchema>;

  beforeEach(() => {
    schema = new BudgetDecisionSchema();
  });

  it('should validate complete budget decision', () => {
    const result = schema.validate({
      inputs: { fiscalYear: 2026, requestedAmount: 10000000 },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject non-numeric fiscal year', () => {
    const result = schema.validate({
      inputs: { requestedAmount: 5000000 },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Fiscal year'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('budget-officer');
    expect(schema.requiredApprovers).toContain('cfo');
  });
});

// ============================================================================
// GOVERNMENT: GovernmentComplianceMapper
// ============================================================================

describe('Government — GovernmentComplianceMapper', () => {
  let mapper: InstanceType<typeof GovernmentComplianceMapper>;

  beforeEach(() => {
    mapper = new GovernmentComplianceMapper();
  });

  it('should have compliance frameworks registered', () => {
    expect(mapper.supportedFrameworks.length).toBeGreaterThan(0);
  });

  it('should include FAR framework', () => {
    const ids = mapper.supportedFrameworks.map(f => f.id);
    expect(ids.some(id => id.includes('far') || id.includes('government') || id.includes('fedramp'))).toBe(true);
  });
});

// ============================================================================
// MANUFACTURING: productionDecisionSchema
// ============================================================================

describe('Manufacturing — productionDecisionSchema', () => {
  let schema: InstanceType<typeof productionDecisionSchema>;

  beforeEach(() => {
    schema = new productionDecisionSchema();
  });

  it('should validate complete production decision', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'PROD-001',
        requestedAmount: 50000,
        productionScore: 720,
        debtToIncomeRatio: 0.35,
      },
      outcome: {
        approved: true,
        riskRating: 'medium',
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: production score below 300 not caught
  it('should reject production score below 300', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'PROD-002',
        requestedAmount: 10000,
        productionScore: 200,
        debtToIncomeRatio: 0.5,
      },
      outcome: { approved: false, riskRating: 'high' },
    } as any);
    expect(result.errors.some(e => e.includes('below valid range'))).toBe(true);
  });

  // FAILS IF: DTI > 100% warning not raised
  it('should warn on debt-to-income ratio exceeding 100%', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'PROD-003',
        requestedAmount: 75000,
        productionScore: 650,
        debtToIncomeRatio: 1.5,
      },
      outcome: { approved: false, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('100%'))).toBe(true);
  });

  // FAILS IF: very-high risk approval warning not raised
  it('should warn when approving very-high risk', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'PROD-004',
        requestedAmount: 200000,
        productionScore: 500,
        debtToIncomeRatio: 0.6,
      },
      outcome: { approved: true, riskRating: 'very-high' },
    } as any);
    expect(result.warnings.some(w => w.includes('additional documentation'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('Manufacturing');
    expect(schema.decisionType).toBe('production');
  });
});

// ============================================================================
// MANUFACTURING: qualityApprovalSchema
// ============================================================================

describe('Manufacturing — qualityApprovalSchema', () => {
  let schema: InstanceType<typeof qualityApprovalSchema>;

  beforeEach(() => {
    schema = new qualityApprovalSchema();
  });

  it('should validate complete quality approval', () => {
    const result = schema.validate({
      inputs: {
        qualityrId: 'QA-001',
        instrument: 'Tensile Tester',
        direction: 'pass',
        quantity: 1000,
        price: 5.50,
        riskMetrics: { concentration: 0.15 },
      },
      outcome: { approved: true, executionAllowed: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: zero quantity accepted
  it('should reject zero quantity', () => {
    const result = schema.validate({
      inputs: {
        qualityrId: 'QA-002',
        instrument: 'CMM',
        direction: 'inspect',
        quantity: 0,
        price: 10,
      },
      outcome: { approved: false, executionAllowed: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('quantity'))).toBe(true);
  });

  // FAILS IF: negative price accepted
  it('should reject negative price', () => {
    const result = schema.validate({
      inputs: {
        qualityrId: 'QA-003',
        instrument: 'Spectrometer',
        direction: 'test',
        quantity: 500,
        price: -1,
      },
      outcome: { approved: false, executionAllowed: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('price'))).toBe(true);
  });

  // FAILS IF: concentration warning not raised
  it('should warn on concentration > 25%', () => {
    const result = schema.validate({
      inputs: {
        qualityrId: 'QA-004',
        instrument: 'X-Ray',
        direction: 'inspect',
        quantity: 100,
        price: 50,
        riskMetrics: { concentration: 0.30 },
      },
      outcome: { approved: true, executionAllowed: true },
    } as any);
    expect(result.warnings.some(w => w.includes('concentration'))).toBe(true);
  });
});

// ============================================================================
// MANUFACTURING: safetyEscalationSchema
// ============================================================================

describe('Manufacturing — safetyEscalationSchema', () => {
  let schema: InstanceType<typeof safetyEscalationSchema>;

  beforeEach(() => {
    schema = new safetyEscalationSchema();
  });

  it('should validate complete safety escalation', () => {
    const result = schema.validate({
      inputs: {
        alertId: 'SAFETY-001',
        customerId: 'PLANT-A',
        riskIndicators: ['chemical-spill', 'ventilation-failure'],
        sanctionScreenResult: 'clear',
      },
      outcome: { escalationLevel: 'investigate', sarRequired: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: empty risk indicators accepted
  it('should reject empty risk indicators', () => {
    const result = schema.validate({
      inputs: {
        alertId: 'SAFETY-002',
        customerId: 'PLANT-B',
        riskIndicators: [],
        sanctionScreenResult: 'clear',
      },
      outcome: { escalationLevel: 'close', sarRequired: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('risk indicator'))).toBe(true);
  });

  // FAILS IF: confirmed sanction match without block accepted
  it('should reject confirmed sanction match without block', () => {
    const result = schema.validate({
      inputs: {
        alertId: 'SAFETY-003',
        customerId: 'PLANT-C',
        riskIndicators: ['sanction-hit'],
        sanctionScreenResult: 'confirmed-match',
      },
      outcome: { escalationLevel: 'investigate', sarRequired: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('sanction match must result in block'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('Manufacturing');
    expect(schema.decisionType).toBe('safety');
  });
});

// ============================================================================
// MANUFACTURING: PortfolioRebalanceSchema
// ============================================================================

describe('Manufacturing — PortfolioRebalanceSchema', () => {
  let schema: InstanceType<typeof PortfolioRebalanceSchema>;

  beforeEach(() => {
    schema = new PortfolioRebalanceSchema();
  });

  it('should validate complete rebalance decision', () => {
    const result = schema.validate({
      inputs: {
        portfolioId: 'PORT-001',
        clientId: 'CLIENT-001',
        currentAllocation: [
          { asset: 'equities', weight: 0.6 },
          { asset: 'bonds', weight: 0.4 },
        ],
        targetAllocation: [
          { asset: 'equities', weight: 0.5 },
          { asset: 'bonds', weight: 0.5 },
        ],
      },
      outcome: { approved: true, suitabilityConfirmed: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: missing portfolio ID not caught
  it('should reject missing portfolio ID', () => {
    const result = schema.validate({
      inputs: {
        clientId: 'C-001',
        currentAllocation: [{ asset: 'equities', weight: 1.0 }],
        targetAllocation: [{ asset: 'equities', weight: 1.0 }],
      },
      outcome: { approved: true, suitabilityConfirmed: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Portfolio ID'))).toBe(true);
  });

  // FAILS IF: approval without suitability not caught
  it('should reject approval without suitability confirmation', () => {
    const result = schema.validate({
      inputs: {
        portfolioId: 'PORT-002',
        clientId: 'C-002',
        currentAllocation: [{ asset: 'cash', weight: 1.0 }],
        targetAllocation: [{ asset: 'equities', weight: 1.0 }],
      },
      outcome: { approved: true, suitabilityConfirmed: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('suitability'))).toBe(true);
  });

  // FAILS IF: allocation sum warning not raised
  it('should warn when allocations do not sum to 100%', () => {
    const result = schema.validate({
      inputs: {
        portfolioId: 'PORT-003',
        clientId: 'C-003',
        currentAllocation: [
          { asset: 'equities', weight: 0.3 },
          { asset: 'bonds', weight: 0.3 },
        ],
        targetAllocation: [
          { asset: 'equities', weight: 0.5 },
          { asset: 'bonds', weight: 0.5 },
        ],
      },
      outcome: { approved: false, suitabilityConfirmed: false },
    } as any);
    expect(result.warnings.some(w => w.includes('Current allocation does not sum'))).toBe(true);
  });

  // FAILS IF: turnover warning not raised
  it('should warn when turnover exceeds max constraint', () => {
    const result = schema.validate({
      inputs: {
        portfolioId: 'PORT-004',
        clientId: 'C-004',
        currentAllocation: [
          { asset: 'equities', weight: 0.8 },
          { asset: 'bonds', weight: 0.2 },
        ],
        targetAllocation: [
          { asset: 'equities', weight: 0.2 },
          { asset: 'bonds', weight: 0.8 },
        ],
        constraints: { maxTurnover: 0.10 },
      },
      outcome: { approved: false, suitabilityConfirmed: false },
    } as any);
    // Turnover = |0.2-0.8|+|0.8-0.2| = 1.2 / 2 = 0.6 = 60% >> 10%
    expect(result.warnings.some(w => w.includes('Turnover') && w.includes('exceeds'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('portfolio-manager');
    expect(schema.requiredApprovers).toContain('compliance-officer');
  });
});

// ============================================================================
// MANUFACTURING: ManufacturingComplianceMapper
// ============================================================================

describe('Manufacturing — ManufacturingComplianceMapper', () => {
  let mapper: InstanceType<typeof ManufacturingComplianceMapper>;

  beforeEach(() => {
    mapper = new ManufacturingComplianceMapper();
  });

  it('should have compliance frameworks registered', () => {
    expect(mapper.supportedFrameworks.length).toBeGreaterThan(0);
  });

  it('should retrieve a framework by ID', () => {
    const first = mapper.supportedFrameworks[0]!;
    const found = mapper.getFramework(first.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
  });
});

// ============================================================================
// BATCH: VerticalImplementation pattern across multiple verticals
// Some verticals export a class, some export an already-constructed instance.
// We resolve each to an instance uniformly.
// ============================================================================

async function resolveVerticalInstance(importPromise: Promise<any>, key: string): Promise<any> {
  const mod = await importPromise;
  const exported = mod[key];
  if (!exported) return undefined;
  // If it's a class (function), instantiate it; otherwise treat it as an instance
  if (typeof exported === 'function') return new exported();
  return exported;
}

describe('Batch — VerticalImplementation pattern', () => {
  const verticalSpecs: { module: Promise<any>; key: string }[] = [
    { module: import('../../services/verticals/financial/FinancialVertical.js'), key: 'FinancialVerticalImplementation' },
    { module: import('../../services/verticals/healthcare/HealthcareVertical.js'), key: 'HealthcareVerticalImplementation' },
    { module: import('../../services/verticals/legal/LegalVertical.js'), key: 'LegalVerticalImplementation' },
    { module: import('../../services/verticals/energy/EnergyVertical.js'), key: 'EnergyVerticalImplementation' },
    { module: import('../../services/verticals/insurance/InsuranceVertical.js'), key: 'InsuranceVerticalImplementation' },
    { module: import('../../services/verticals/government/GovernmentVertical.js'), key: 'GovernmentVerticalImplementation' },
    { module: import('../../services/verticals/manufacturing/ManufacturingVertical.js'), key: 'ManufacturingVerticalImplementation' },
  ];

  it('should resolve all 7 flagship vertical implementations', async () => {
    const instances = await Promise.all(verticalSpecs.map(s => resolveVerticalInstance(s.module, s.key)));
    for (const instance of instances) {
      expect(instance).toBeDefined();
      expect(instance.verticalId).toBeTruthy();
      expect(instance.verticalName).toBeTruthy();
      expect(typeof instance.completionPercentage).toBe('number');
      expect(instance.completionPercentage).toBeGreaterThan(0);
      expect(instance.completionPercentage).toBeLessThanOrEqual(100);
    }
  });

  it('should have unique verticalIds across implementations', async () => {
    const instances = await Promise.all(verticalSpecs.map(s => resolveVerticalInstance(s.module, s.key)));
    const ids = instances.map(i => i.verticalId);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have all 6 layers defined on each implementation', async () => {
    const instances = await Promise.all(verticalSpecs.map(s => resolveVerticalInstance(s.module, s.key)));
    for (const instance of instances) {
      expect(instance).toHaveProperty('dataConnector');
      expect(instance).toHaveProperty('knowledgeBase');
      expect(instance).toHaveProperty('complianceMapper');
      expect(instance).toHaveProperty('decisionSchemas');
      expect(instance).toHaveProperty('agentPresets');
      expect(instance).toHaveProperty('defensibleOutput');
    }
  });

  it('should have non-empty decision schemas on each implementation', async () => {
    const instances = await Promise.all(verticalSpecs.map(s => resolveVerticalInstance(s.module, s.key)));
    for (const instance of instances) {
      expect(instance.decisionSchemas).toBeDefined();
      const schemas = instance.decisionSchemas;
      // decisionSchemas is a Map or array depending on vertical
      if (schemas instanceof Map) {
        expect(schemas.size).toBeGreaterThan(0);
      } else if (Array.isArray(schemas)) {
        expect(schemas.length).toBeGreaterThan(0);
      } else {
        // Object with keys
        expect(Object.keys(schemas).length).toBeGreaterThan(0);
      }
    }
  });
});
