/**
 * Vertical Flagships Deep Tests
 *
 * Tests the 4 flagship verticals (Financial, Healthcare, Legal, Energy) —
 * decision schema validation, compliance mapping, safety frameworks,
 * agent presets, and pre-mortem scenarios.
 *
 * Every test uses real business data (credit decisions, AML, grid ops, etc.)
 *
 * @module __tests__/services/VerticalFlagshipsDeep.test
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
  CreditDecisionSchema,
  TradeApprovalSchema,
  AMLEscalationSchema,
  PortfolioRebalanceSchema,
  FinancialComplianceMapper,
  CreditAnalysisAgentPreset,
} = await import('../../services/verticals/financial/FinancialVertical.js');

const {
  SafetyFirstFramework,
  IncidentPreMortemLibrary,
  MaintenanceDeferralSchema,
  EmergencyResponseSchema,
  EnergyComplianceMapper,
} = await import('../../services/verticals/energy/EnergyVertical.js');

// ============================================================================
// FINANCIAL: CreditDecisionSchema
// ============================================================================

describe('Financial — CreditDecisionSchema', () => {
  let schema: InstanceType<typeof CreditDecisionSchema>;

  beforeEach(() => {
    schema = new CreditDecisionSchema();
  });

  // FAILS IF: valid credit decision rejects
  it('should validate a complete credit decision', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'APP-001',
        requestedAmount: 500000,
        purpose: 'Working capital',
        creditScore: 720,
        debtToIncomeRatio: 0.35,
        financialStatements: [{ year: 2025, revenue: 2000000, netIncome: 200000 }],
      },
      outcome: {
        approved: true,
        approvedAmount: 500000,
        interestRate: 6.5,
        riskRating: 'medium',
      },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // FAILS IF: missing required fields not caught
  it('should reject missing applicantId', () => {
    const result = schema.validate({
      inputs: {
        requestedAmount: 100000,
        creditScore: 650,
        debtToIncomeRatio: 0.4,
      } as any,
      outcome: { approved: false, riskRating: 'high' } as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Applicant ID'))).toBe(true);
  });

  // FAILS IF: business rule not enforced
  it('should error on credit score below 300', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'APP-002',
        requestedAmount: 50000,
        purpose: 'Equipment',
        creditScore: 200,
        debtToIncomeRatio: 0.5,
        financialStatements: [],
      },
      outcome: { approved: false, riskRating: 'very-high' } as any,
    });
    expect(result.errors.some(e => e.includes('below valid range'))).toBe(true);
  });

  // FAILS IF: DTI warning not raised
  it('should warn on debt-to-income ratio > 100%', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'APP-003',
        requestedAmount: 200000,
        purpose: 'Expansion',
        creditScore: 680,
        debtToIncomeRatio: 1.2,
        financialStatements: [],
      },
      outcome: { approved: false, riskRating: 'high' } as any,
    });
    expect(result.warnings.some(w => w.includes('100%'))).toBe(true);
  });

  // FAILS IF: very-high risk approval not warned
  it('should warn when approving very-high risk', () => {
    const result = schema.validate({
      inputs: {
        applicantId: 'APP-004',
        requestedAmount: 1000000,
        purpose: 'Acquisition',
        creditScore: 520,
        debtToIncomeRatio: 0.6,
        financialStatements: [],
      },
      outcome: { approved: true, riskRating: 'very-high' } as any,
    });
    expect(result.warnings.some(w => w.includes('additional documentation'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('financial');
    expect(schema.decisionType).toBe('credit');
    expect(schema.requiredApprovers).toContain('credit-officer');
    expect(schema.requiredApprovers).toContain('risk-manager');
  });
});

// ============================================================================
// FINANCIAL: TradeApprovalSchema
// ============================================================================

describe('Financial — TradeApprovalSchema', () => {
  let schema: InstanceType<typeof TradeApprovalSchema>;

  beforeEach(() => {
    schema = new TradeApprovalSchema();
  });

  it('should validate a complete trade approval', () => {
    const result = schema.validate({
      inputs: {
        traderId: 'TRADER-001',
        instrument: 'AAPL',
        direction: 'buy',
        quantity: 1000,
        price: 175.50,
        orderType: 'limit',
        portfolio: 'GROWTH-FUND',
        riskMetrics: { var: 0.02, exposure: 175500, concentration: 0.15 },
      },
      outcome: {
        approved: true,
        executionAllowed: true,
        complianceFlags: [],
        preTradeChecks: [{ check: 'position-limit', passed: true }],
      },
    });
    expect(result.valid).toBe(true);
  });

  // FAILS IF: zero quantity accepted
  it('should reject zero quantity', () => {
    const result = schema.validate({
      inputs: {
        traderId: 'TRADER-002',
        instrument: 'MSFT',
        direction: 'sell',
        quantity: 0,
        price: 350,
        orderType: 'market',
        portfolio: 'HEDGE',
        riskMetrics: { var: 0.01, exposure: 0, concentration: 0 },
      },
      outcome: { approved: false, executionAllowed: false, complianceFlags: [], preTradeChecks: [] },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('quantity'))).toBe(true);
  });

  // FAILS IF: concentration warning not raised
  it('should warn on concentration > 25%', () => {
    const result = schema.validate({
      inputs: {
        traderId: 'TRADER-003',
        instrument: 'TSLA',
        direction: 'buy',
        quantity: 5000,
        price: 200,
        orderType: 'market',
        portfolio: 'CONCENTRATED',
        riskMetrics: { var: 0.05, exposure: 1000000, concentration: 0.35 },
      },
      outcome: { approved: true, executionAllowed: true, complianceFlags: [], preTradeChecks: [] },
    });
    expect(result.warnings.some(w => w.includes('concentration'))).toBe(true);
  });
});

// ============================================================================
// FINANCIAL: AMLEscalationSchema
// ============================================================================

describe('Financial — AMLEscalationSchema', () => {
  let schema: InstanceType<typeof AMLEscalationSchema>;

  beforeEach(() => {
    schema = new AMLEscalationSchema();
  });

  it('should validate a complete AML escalation', () => {
    const result = schema.validate({
      inputs: {
        alertId: 'AML-ALERT-001',
        customerId: 'CUST-12345',
        transactionIds: ['TXN-001', 'TXN-002'],
        totalAmount: 150000,
        riskIndicators: ['structuring', 'rapid-movement'],
        countryRisk: 'high',
        pep: false,
      },
      outcome: {
        escalationLevel: 'investigate',
        sarRequired: true,
        recommendedActions: ['Enhanced due diligence'],
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: empty risk indicators accepted
  it('should reject empty risk indicators', () => {
    const result = schema.validate({
      inputs: {
        alertId: 'AML-002',
        customerId: 'CUST-999',
        transactionIds: [],
        totalAmount: 50000,
        riskIndicators: [],
        countryRisk: 'low',
        pep: false,
        sanctionScreenResult: 'clear',
      },
      outcome: { escalationLevel: 'close', sarRequired: false } as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('risk indicator'))).toBe(true);
  });

  // FAILS IF: sanction match without block accepted
  it('should reject confirmed sanction match without block', () => {
    const result = schema.validate({
      inputs: {
        alertId: 'AML-003',
        customerId: 'CUST-SANCTION',
        transactionIds: ['TXN-100'],
        totalAmount: 500000,
        riskIndicators: ['sanction-hit'],
        countryRisk: 'high',
        pep: true,
        sanctionScreenResult: 'confirmed-match',
      },
      outcome: { escalationLevel: 'investigate', sarRequired: true } as any,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('sanction match must result in block'))).toBe(true);
  });

  // FAILS IF: sanction match with block rejected
  it('should accept confirmed sanction match with block escalation', () => {
    const result = schema.validate({
      inputs: {
        alertId: 'AML-004',
        customerId: 'CUST-BLOCKED',
        transactionIds: ['TXN-200'],
        totalAmount: 1000000,
        riskIndicators: ['sanction-hit', 'pep'],
        countryRisk: 'high',
        pep: true,
        sanctionScreenResult: 'confirmed-match',
      },
      outcome: { escalationLevel: 'block', sarRequired: true } as any,
    });
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// FINANCIAL: FinancialComplianceMapper
// ============================================================================

describe('Financial — FinancialComplianceMapper', () => {
  let mapper: InstanceType<typeof FinancialComplianceMapper>;

  beforeEach(() => {
    mapper = new FinancialComplianceMapper();
  });

  // FAILS IF: frameworks missing
  it('should have compliance frameworks registered', () => {
    const frameworks = mapper.supportedFrameworks;
    expect(frameworks.length).toBeGreaterThan(0);
    const ids = frameworks.map(f => f.id);
    expect(ids).toContain('basel-iii');
    expect(ids).toContain('sr-11-7');
  });

  // FAILS IF: framework lookup fails
  it('should retrieve framework by ID', () => {
    const framework = mapper.getFramework('basel-iii');
    expect(framework).toBeDefined();
    expect(framework!.name).toBeTruthy();
    expect(framework!.controls.length).toBeGreaterThan(0);
  });

  // FAILS IF: returns framework for invalid ID
  it('should return undefined for non-existent framework', () => {
    expect(mapper.getFramework('nonexistent')).toBeUndefined();
  });
});

// ============================================================================
// FINANCIAL: CreditAnalysisAgentPreset
// ============================================================================

describe('Financial — CreditAnalysisAgentPreset', () => {
  let preset: InstanceType<typeof CreditAnalysisAgentPreset>;

  beforeEach(() => {
    preset = new CreditAnalysisAgentPreset();
  });

  it('should have correct preset metadata', () => {
    expect(preset.verticalId).toBe('financial');
    expect(preset.presetId).toBe('credit-analysis');
    expect(preset.name).toBe('Credit Analysis Workflow');
  });

  // FAILS IF: capabilities empty
  it('should define capabilities', () => {
    expect(preset.capabilities.length).toBeGreaterThan(0);
    for (const cap of preset.capabilities) {
      expect(cap.id).toBeTruthy();
      expect(cap.name).toBeTruthy();
    }
  });

  // FAILS IF: guardrails empty
  it('should define guardrails', () => {
    expect(preset.guardrails.length).toBeGreaterThan(0);
    for (const g of preset.guardrails) {
      expect(g.id).toBeTruthy();
      expect(g.type).toBeTruthy();
    }
  });

  // FAILS IF: workflow steps empty
  it('should define workflow steps', () => {
    expect(preset.workflow.length).toBeGreaterThan(0);
    for (const step of preset.workflow) {
      expect(step.id).toBeTruthy();
      expect(step.name).toBeTruthy();
    }
  });
});

// ============================================================================
// ENERGY: SafetyFirstFramework
// ============================================================================

describe('Energy — SafetyFirstFramework', () => {
  let safety: InstanceType<typeof SafetyFirstFramework>;

  beforeEach(() => {
    safety = new SafetyFirstFramework();
  });

  // FAILS IF: safe scenario flagged
  it('should evaluate safe maintenance deferral as safe', () => {
    const result = safety.evaluateSafety('maintenance-deferral', {
      impactAssessment: { safetyRisk: 0.3, reliabilityRisk: 0.4 },
      currentCondition: { healthScore: 0.8 },
    });
    expect(result.overallSafe).toBe(true);
    expect(result.safetyLevel).toBe('safe');
    expect(result.failSafeTriggered).toBe(false);
    expect(result.hash).toBeTruthy();
    expect(result.hash.length).toBe(64);
  });

  // FAILS IF: critical safety risk not caught
  it('should trigger emergency for critical safety risk', () => {
    const result = safety.evaluateSafety('maintenance-deferral', {
      impactAssessment: { safetyRisk: 0.9, reliabilityRisk: 0.5 },
      currentCondition: { healthScore: 0.6 },
    });
    expect(result.safetyLevel).toBe('emergency');
    expect(result.failSafeTriggered).toBe(true);
    expect(result.humanOversightRequired).toBe(true);
    expect(result.mitigations).toBeDefined();
    expect(result.mitigations!.length).toBeGreaterThan(0);
  });

  // FAILS IF: high reliability risk not flagged as danger
  it('should flag danger for high reliability risk', () => {
    const result = safety.evaluateSafety('maintenance-deferral', {
      impactAssessment: { safetyRisk: 0.5, reliabilityRisk: 0.9 },
      currentCondition: { healthScore: 0.6 },
    });
    expect(result.safetyLevel).toBe('danger');
    expect(result.overallSafe).toBe(false);
  });

  // FAILS IF: grid frequency instability not caught
  it('should detect grid frequency instability in load-balancing', () => {
    const result = safety.evaluateSafety('load-balancing', {
      gridState: {
        frequency: 59.8,      // Outside 59.95-60.05
        voltage: 1.0,
        reserveMargin: 0.20,
        congestionPoints: [],
      },
    });
    expect(result.safetyLevel).toBe('emergency');
    expect(result.failSafeTriggered).toBe(true);
  });

  // FAILS IF: low reserve margin not flagged
  it('should flag low reserve margin as danger', () => {
    const result = safety.evaluateSafety('load-balancing', {
      gridState: {
        frequency: 60.0,
        voltage: 1.0,
        reserveMargin: 0.10,  // Below 0.15 threshold
        congestionPoints: [],
      },
    });
    expect(result.safetyLevel).toBe('danger');
    expect(result.overallSafe).toBe(false);
  });

  // FAILS IF: fail-safe defaults wrong
  it('should return correct fail-safe defaults', () => {
    const maint = safety.getFailSafeDefault('maintenance-deferral');
    expect(maint).toHaveProperty('approved', false);

    const emergency = safety.getFailSafeDefault('emergency-response');
    expect(emergency).toHaveProperty('responseLevel', 'emergency');

    const unknown = safety.getFailSafeDefault('unknown-type');
    expect(unknown).toHaveProperty('approved', false);
  });

  // FAILS IF: enforceFailSafe doesn't override outcome
  it('should enforce fail-safe on triggered safety review', () => {
    const dangerousReview = safety.evaluateSafety('maintenance-deferral', {
      impactAssessment: { safetyRisk: 0.95, reliabilityRisk: 0.9 },
    });
    expect(dangerousReview.failSafeTriggered).toBe(true);

    const overridden = safety.enforceFailSafe(
      'maintenance-deferral',
      { approved: true, reason: 'Budget pressure' },
      dangerousReview,
    );
    expect(overridden.approved).toBe(false); // Fail-safe overrides
    expect(overridden.failSafeApplied).toBe(true);
  });

  // FAILS IF: non-triggered review overrides outcome
  it('should not enforce fail-safe when not triggered', () => {
    const safeReview = safety.evaluateSafety('maintenance-deferral', {
      impactAssessment: { safetyRisk: 0.2, reliabilityRisk: 0.3 },
      currentCondition: { healthScore: 0.9 },
    });
    expect(safeReview.failSafeTriggered).toBe(false);

    const result = safety.enforceFailSafe(
      'maintenance-deferral',
      { approved: true, reason: 'Low risk' },
      safeReview,
    );
    expect(result.approved).toBe(true);
    expect(result.failSafeApplied).toBeUndefined();
  });
});

// ============================================================================
// ENERGY: IncidentPreMortemLibrary
// ============================================================================

describe('Energy — IncidentPreMortemLibrary', () => {
  let library: InstanceType<typeof IncidentPreMortemLibrary>;

  beforeEach(() => {
    library = new IncidentPreMortemLibrary();
  });

  // FAILS IF: scenarios not initialized
  it('should have pre-configured scenarios', () => {
    const scenarios = library.getAllScenarios();
    expect(scenarios.length).toBe(5);
  });

  // FAILS IF: scenario lookup fails
  it('should retrieve scenario by ID', () => {
    const scenario = library.getScenario('scenario-001');
    expect(scenario).toBeDefined();
    expect(scenario!.name).toBe('Transformer Failure Cascade');
    expect(scenario!.category).toBe('equipment');
  });

  // FAILS IF: returns scenario for invalid ID
  it('should return undefined for nonexistent scenario', () => {
    expect(library.getScenario('nonexistent')).toBeUndefined();
  });

  // FAILS IF: weather filtering broken
  it('should find relevant scenarios for ice storm conditions', () => {
    const relevant = library.findRelevantScenarios({
      weatherConditions: ['Freezing rain', 'Ice accumulation expected'],
    });
    expect(relevant.some(s => s.category === 'weather')).toBe(true);
    expect(relevant.some(s => s.name.includes('Ice Storm'))).toBe(true);
  });

  // FAILS IF: asset-type filtering broken
  it('should find relevant scenarios for transformer context', () => {
    const relevant = library.findRelevantScenarios({
      assetType: 'transformer',
    });
    expect(relevant.some(s => s.name.includes('Transformer'))).toBe(true);
  });

  // FAILS IF: cascade computation broken
  it('should compute cascade for stressed grid', () => {
    const cascade = library.computeCascade('Transformer failure', {
      frequency: 60.0,
      voltage: 1.0,
      reserveMargin: 0.10,  // Low reserves → cascade step
      congestionPoints: ['Line-A', 'Line-B', 'Line-C'],  // >2 → cascade step
    } as any);
    expect(cascade.cascadeSteps.length).toBeGreaterThan(1);
    expect(cascade.cascadeSteps[0].event).toBe('Transformer failure');
    expect(cascade.finalImpact).toContain('Significant');
    expect(cascade.mitigationOpportunities.length).toBeGreaterThan(0);
  });

  // FAILS IF: contained event not detected
  it('should detect contained event on healthy grid', () => {
    const cascade = library.computeCascade('Minor fault', {
      frequency: 60.0,
      voltage: 1.0,
      reserveMargin: 0.25,  // Healthy
      congestionPoints: [],  // No congestion
    } as any);
    expect(cascade.cascadeSteps).toHaveLength(1);
    expect(cascade.finalImpact).toContain('Contained');
  });
});

// ============================================================================
// ENERGY: MaintenanceDeferralSchema
// ============================================================================

describe('Energy — MaintenanceDeferralSchema', () => {
  let schema: InstanceType<typeof MaintenanceDeferralSchema>;

  beforeEach(() => {
    schema = new MaintenanceDeferralSchema();
  });

  it('should validate complete maintenance deferral', () => {
    const result = schema.validate({
      inputs: {
        asset: { assetId: 'XFMR-001', assetName: 'Transformer #1', criticality: 'high' },
        scheduledMaintenanceDate: new Date('2026-04-01'),
        proposedDeferralDate: new Date('2026-06-01'),
        deferralReason: 'Budget constraints',
        impactAssessment: { safetyRisk: 0.3, reliabilityRisk: 0.4 },
      },
      outcome: {
        approved: false,
        safetyReview: { reviewId: 'SR-001', safetyLevel: 'safe' },
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: missing asset ID not caught
  it('should reject missing asset ID', () => {
    const result = schema.validate({
      inputs: {
        asset: {},
        scheduledMaintenanceDate: new Date(),
        proposedDeferralDate: new Date(),
        deferralReason: 'test',
      },
      outcome: { approved: false, safetyReview: {} },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Asset ID'))).toBe(true);
  });

  // FAILS IF: high safety risk warning not raised
  it('should warn on high safety risk', () => {
    const result = schema.validate({
      inputs: {
        asset: { assetId: 'XFMR-002', criticality: 'normal' },
        scheduledMaintenanceDate: new Date(),
        proposedDeferralDate: new Date(),
        deferralReason: 'Budget',
        impactAssessment: { safetyRisk: 0.7, reliabilityRisk: 0.3 },
      },
      outcome: { approved: false, safetyReview: { reviewId: 'SR-002' } },
    } as any);
    expect(result.warnings.some(w => w.includes('safety risk'))).toBe(true);
  });

  // FAILS IF: critical asset warning not raised
  it('should warn on critical asset deferral', () => {
    const result = schema.validate({
      inputs: {
        asset: { assetId: 'XFMR-003', criticality: 'critical' },
        scheduledMaintenanceDate: new Date(),
        proposedDeferralDate: new Date(),
        deferralReason: 'Parts unavailable',
        impactAssessment: { safetyRisk: 0.2, reliabilityRisk: 0.3 },
      },
      outcome: { approved: false, safetyReview: { reviewId: 'SR-003' } },
    } as any);
    expect(result.warnings.some(w => w.includes('executive approval'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('maintenance-supervisor');
    expect(schema.requiredApprovers).toContain('reliability-engineer');
  });
});

// ============================================================================
// ENERGY: EmergencyResponseSchema
// ============================================================================

describe('Energy — EmergencyResponseSchema', () => {
  let schema: InstanceType<typeof EmergencyResponseSchema>;

  beforeEach(() => {
    schema = new EmergencyResponseSchema();
  });

  it('should validate complete emergency response', () => {
    const result = schema.validate({
      inputs: {
        incidentId: 'INC-001',
        incidentType: 'equipment-failure',
        severity: 3,
      },
      outcome: {
        responseLevel: 'elevated',
        incidentCommanderApproval: true,
        safetyReview: { reviewId: 'SR-ER-001' },
      },
    } as any);
    expect(result.valid).toBe(true);
  });

  // FAILS IF: missing incident ID not caught
  it('should reject missing incident fields', () => {
    const result = schema.validate({
      inputs: {},
      outcome: {},
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Incident ID'))).toBe(true);
    expect(result.errors.some(e => e.includes('Incident type'))).toBe(true);
  });

  // FAILS IF: high severity warning not raised
  it('should warn on high severity incident (1-2)', () => {
    const result = schema.validate({
      inputs: {
        incidentId: 'INC-002',
        incidentType: 'cyber-attack',
        severity: 1,
      },
      outcome: {
        responseLevel: 'emergency',
        incidentCommanderApproval: true,
        safetyReview: { reviewId: 'SR-ER-002' },
      },
    } as any);
    expect(result.warnings.some(w => w.includes('executive notification'))).toBe(true);
  });
});

// ============================================================================
// ENERGY: EnergyComplianceMapper
// ============================================================================

describe('Energy — EnergyComplianceMapper', () => {
  let mapper: InstanceType<typeof EnergyComplianceMapper>;

  beforeEach(() => {
    mapper = new EnergyComplianceMapper();
  });

  it('should have NERC CIP compliance framework', () => {
    const frameworks = mapper.supportedFrameworks;
    expect(frameworks.length).toBeGreaterThan(0);
    const ids = frameworks.map(f => f.id);
    expect(ids).toContain('nerc-cip');
  });

  it('should retrieve NERC CIP framework with controls', () => {
    const framework = mapper.getFramework('nerc-cip');
    expect(framework).toBeDefined();
    expect(framework!.controls.length).toBeGreaterThan(0);
  });
});
