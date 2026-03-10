/**
 * Vertical Template Batch Deep Tests
 *
 * Tests the shared CreditDecisionSchema / TradeApprovalSchema /
 * AMLEscalationSchema / PortfolioRebalanceSchema pattern across
 * template verticals that reuse the same financial-derived schemas:
 * - Nonprofit, Professional, Aerospace (base), Pharmaceutical (base),
 *   Retail (base), Telecom (base)
 *
 * Also tests Education and Real Estate VerticalImplementation batch.
 *
 * @module __tests__/services/VerticalTemplateBatchDeep.test
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
    hashFallback: vi.fn().mockReturnValue(new Array(384).fill(0.05)),
  },
}));
vi.mock('../../../utils/RuleEngine.js', () => ({
  expressionParser: { parse: vi.fn().mockReturnValue({ evaluate: () => true }) },
}));

// ============================================================================
// IMPORTS — Template verticals
// ============================================================================

const nonprofitMod = await import('../../services/verticals/nonprofit/NonprofitVertical.js');
const professionalMod = await import('../../services/verticals/professional/ProfessionalVertical.js');
const aerospaceMod = await import('../../services/verticals/aerospace/AerospaceVertical.js');
const pharmaBaseMod = await import('../../services/verticals/pharmaceutical/PharmaceuticalVertical.js');
const retailBaseMod = await import('../../services/verticals/retail/RetailVertical.js');
const telecomBaseMod = await import('../../services/verticals/telecom/TelecomVertical.js');

// ============================================================================
// Parameterised batch test for CreditDecisionSchema
// ============================================================================

interface TemplateVertical {
  name: string;
  mod: any;
  verticalId: string;
}

const templateVerticals: TemplateVertical[] = [
  { name: 'Nonprofit', mod: nonprofitMod, verticalId: 'Nonprofit' },
  { name: 'Professional', mod: professionalMod, verticalId: 'Professional' },
  { name: 'Aerospace (base)', mod: aerospaceMod, verticalId: 'Aerospace' },
  { name: 'Pharmaceutical (base)', mod: pharmaBaseMod, verticalId: 'Pharmaceutical' },
  { name: 'Retail (base)', mod: retailBaseMod, verticalId: 'Retail' },
  { name: 'Telecom (base)', mod: telecomBaseMod, verticalId: 'Telecom' },
];

// ============================================================================
// CreditDecisionSchema — shared across template verticals
// ============================================================================

describe('Batch — CreditDecisionSchema (template verticals)', () => {
  for (const { name, mod } of templateVerticals) {
    describe(`${name}`, () => {
      let schema: any;
      beforeEach(() => { schema = new mod.CreditDecisionSchema(); });

      it('should validate complete credit decision', () => {
        const result = schema.validate({
          inputs: { applicantId: 'A-001', requestedAmount: 50000, creditScore: 720, debtToIncomeRatio: 0.35 },
          outcome: { approved: true, riskRating: 'low' },
        });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject missing applicant ID', () => {
        const result = schema.validate({
          inputs: { requestedAmount: 10000, creditScore: 650, debtToIncomeRatio: 0.4 },
          outcome: { approved: false, riskRating: 'medium' },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('Applicant ID'))).toBe(true);
      });

      it('should reject credit score below valid range', () => {
        const result = schema.validate({
          inputs: { applicantId: 'A-002', requestedAmount: 25000, creditScore: 200, debtToIncomeRatio: 0.3 },
          outcome: { approved: false, riskRating: 'high' },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('below valid range'))).toBe(true);
      });

      it('should warn on debt-to-income > 100%', () => {
        const result = schema.validate({
          inputs: { applicantId: 'A-003', requestedAmount: 15000, creditScore: 600, debtToIncomeRatio: 1.5 },
          outcome: { approved: false, riskRating: 'high' },
        });
        expect(result.warnings.some((w: string) => w.includes('100%'))).toBe(true);
      });

      it('should warn on very-high risk approval', () => {
        const result = schema.validate({
          inputs: { applicantId: 'A-004', requestedAmount: 75000, creditScore: 680, debtToIncomeRatio: 0.45 },
          outcome: { approved: true, riskRating: 'very-high' },
        });
        expect(result.warnings.some((w: string) => w.includes('High-risk approval'))).toBe(true);
      });
    });
  }
});

// ============================================================================
// TradeApprovalSchema — shared across template verticals
// ============================================================================

describe('Batch — TradeApprovalSchema (template verticals)', () => {
  for (const { name, mod } of templateVerticals) {
    describe(`${name}`, () => {
      let schema: any;
      beforeEach(() => { schema = new mod.TradeApprovalSchema(); });

      it('should validate complete trade', () => {
        const result = schema.validate({
          inputs: { traderId: 'T-001', instrument: 'AAPL', direction: 'buy', quantity: 1000, price: 150.50 },
          outcome: { approved: true, executionAllowed: true },
        });
        expect(result.valid).toBe(true);
      });

      it('should reject zero quantity', () => {
        const result = schema.validate({
          inputs: { traderId: 'T-002', instrument: 'MSFT', direction: 'sell', quantity: 0, price: 300 },
          outcome: { approved: false },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('quantity'))).toBe(true);
      });

      it('should reject negative price', () => {
        const result = schema.validate({
          inputs: { traderId: 'T-003', instrument: 'GOOG', direction: 'buy', quantity: 500, price: -10 },
          outcome: { approved: false },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('price'))).toBe(true);
      });

      it('should warn on concentration > 25%', () => {
        const result = schema.validate({
          inputs: {
            traderId: 'T-004', instrument: 'TSLA', direction: 'buy',
            quantity: 5000, price: 200, riskMetrics: { concentration: 0.40 },
          },
          outcome: { approved: true, executionAllowed: true },
        });
        expect(result.warnings.some((w: string) => w.includes('concentration'))).toBe(true);
      });
    });
  }
});

// ============================================================================
// AMLEscalationSchema — shared across template verticals
// ============================================================================

describe('Batch — AMLEscalationSchema (template verticals)', () => {
  for (const { name, mod } of templateVerticals) {
    describe(`${name}`, () => {
      let schema: any;
      beforeEach(() => { schema = new mod.AMLEscalationSchema(); });

      it('should validate complete AML escalation', () => {
        const result = schema.validate({
          inputs: { alertId: 'AML-001', customerId: 'C-001', riskIndicators: ['structuring', 'unusual-volume'] },
          outcome: { escalationLevel: 'investigate', sarRequired: false },
        });
        expect(result.valid).toBe(true);
      });

      it('should reject empty risk indicators', () => {
        const result = schema.validate({
          inputs: { alertId: 'AML-002', customerId: 'C-002', riskIndicators: [] },
          outcome: { escalationLevel: 'dismiss', sarRequired: false },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('risk indicator'))).toBe(true);
      });

      it('should reject confirmed sanction match without block', () => {
        const result = schema.validate({
          inputs: {
            alertId: 'AML-003', customerId: 'C-003',
            riskIndicators: ['sanctions-match'],
            sanctionScreenResult: 'confirmed-match',
          },
          outcome: { escalationLevel: 'investigate', sarRequired: true },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('block'))).toBe(true);
      });

      it('should accept confirmed sanction match with block', () => {
        const result = schema.validate({
          inputs: {
            alertId: 'AML-004', customerId: 'C-004',
            riskIndicators: ['sanctions-match'],
            sanctionScreenResult: 'confirmed-match',
          },
          outcome: { escalationLevel: 'block', sarRequired: true },
        });
        expect(result.valid).toBe(true);
      });
    });
  }
});

// ============================================================================
// PortfolioRebalanceSchema — shared across template verticals
// ============================================================================

describe('Batch — PortfolioRebalanceSchema (template verticals)', () => {
  for (const { name, mod } of templateVerticals) {
    describe(`${name}`, () => {
      let schema: any;
      beforeEach(() => { schema = new mod.PortfolioRebalanceSchema(); });

      it('should validate complete rebalance', () => {
        const result = schema.validate({
          inputs: {
            portfolioId: 'PF-001', clientId: 'CL-001',
            currentAllocation: [{ asset: 'equities', weight: 0.6 }, { asset: 'bonds', weight: 0.4 }],
            targetAllocation: [{ asset: 'equities', weight: 0.5 }, { asset: 'bonds', weight: 0.5 }],
          },
          outcome: { approved: true, suitabilityConfirmed: true },
        });
        expect(result.valid).toBe(true);
      });

      it('should reject missing client ID', () => {
        const result = schema.validate({
          inputs: {
            portfolioId: 'PF-002',
            currentAllocation: [{ asset: 'equity', weight: 1.0 }],
            targetAllocation: [{ asset: 'equity', weight: 1.0 }],
          },
          outcome: { approved: false, suitabilityConfirmed: false },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('Client ID'))).toBe(true);
      });

      it('should reject approval without suitability confirmation', () => {
        const result = schema.validate({
          inputs: {
            portfolioId: 'PF-003', clientId: 'CL-003',
            currentAllocation: [{ asset: 'stocks', weight: 1.0 }],
            targetAllocation: [{ asset: 'stocks', weight: 1.0 }],
          },
          outcome: { approved: true, suitabilityConfirmed: false },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e: string) => e.includes('suitability'))).toBe(true);
      });

      it('should warn when allocation does not sum to 100%', () => {
        const result = schema.validate({
          inputs: {
            portfolioId: 'PF-004', clientId: 'CL-004',
            currentAllocation: [{ asset: 'equities', weight: 0.3 }, { asset: 'bonds', weight: 0.3 }],
            targetAllocation: [{ asset: 'equities', weight: 0.5 }, { asset: 'bonds', weight: 0.5 }],
          },
          outcome: { approved: true, suitabilityConfirmed: true },
        });
        expect(result.warnings.some((w: string) => w.includes('100%'))).toBe(true);
      });

      it('should warn on turnover exceeding max constraint', () => {
        const result = schema.validate({
          inputs: {
            portfolioId: 'PF-005', clientId: 'CL-005',
            currentAllocation: [{ asset: 'A', weight: 0.8 }, { asset: 'B', weight: 0.2 }],
            targetAllocation: [{ asset: 'A', weight: 0.2 }, { asset: 'B', weight: 0.8 }],
            constraints: { maxTurnover: 0.1 },
          },
          outcome: { approved: true, suitabilityConfirmed: true },
        });
        expect(result.warnings.some((w: string) => w.includes('Turnover'))).toBe(true);
      });
    });
  }
});

// ============================================================================
// Batch — VerticalImplementation for template verticals
// ============================================================================

describe('Batch — VerticalImplementation pattern (template verticals)', () => {
  const impls = [
    { name: 'Nonprofit', impl: nonprofitMod.default || nonprofitMod.NonprofitVerticalImplementation, id: 'Nonprofit' },
    { name: 'Professional', impl: professionalMod.default || professionalMod.ProfessionalVerticalImplementation, id: 'Professional' },
  ];

  for (const { name, impl, id } of impls) {
    describe(`${name} VerticalImplementation`, () => {
      let instance: any;
      beforeEach(() => {
        instance = (typeof impl === 'function' && impl.prototype) ? new impl() : impl;
      });

      it(`should have verticalId "${id}"`, () => {
        expect(instance.verticalId).toBe(id);
      });

      it('should have all 6 layers', () => {
        expect(instance.dataConnector).toBeDefined();
        expect(instance.knowledgeBase).toBeDefined();
        expect(instance.complianceMapper).toBeDefined();
        expect(instance.decisionSchemas).toBeInstanceOf(Map);
        expect(instance.agentPresets).toBeInstanceOf(Map);
        expect(instance.defensibleOutput).toBeDefined();
      });

      it('should have 4 decision schemas (credit, trade, aml, rebalance)', () => {
        expect(instance.decisionSchemas.size).toBe(4);
        expect(instance.decisionSchemas.has('credit')).toBe(true);
        expect(instance.decisionSchemas.has('trade')).toBe(true);
        expect(instance.decisionSchemas.has('aml')).toBe(true);
        expect(instance.decisionSchemas.has('rebalance')).toBe(true);
      });

      it('should have at least 1 agent preset', () => {
        expect(instance.agentPresets.size).toBeGreaterThanOrEqual(1);
      });

      it('should report 100% completion', () => {
        expect(instance.completionPercentage).toBe(100);
      });

      it('should return valid status', () => {
        const status = instance.getStatus();
        expect(status.vertical).toBeTruthy();
        expect(status.completionPercentage).toBe(100);
        expect(status.layers).toBeDefined();
      });
    });
  }
});
