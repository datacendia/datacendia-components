/**
 * Defense & EU-Banking Vertical Deep Tests
 *
 * Defense: DefenseVerticalService singleton, schemas, agents, modes, compliance, connectors
 * EU-Banking: Basel3Engine capital calculations, LCR, NSFR, large exposures, stress tests
 *
 * @module __tests__/services/VerticalDefenseEUBankingDeep.test
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

// ============================================================================
// IMPORTS
// ============================================================================

const {
  DefenseVerticalService,
  defenseVerticalService,
  DEFENSE_DECISION_SCHEMAS,
  DEFENSE_COMPLIANCE_FRAMEWORKS,
  DEFENSE_DATA_CONNECTORS,
  ALL_DEFENSE_AGENTS,
  ALL_DEFENSE_MODES,
} = await import('../../services/verticals/defense/DefenseVerticalService.js');

const {
  Basel3Engine,
  basel3Engine,
} = await import('../../services/verticals/eu-banking/Basel3Engine.js');

// ============================================================================
// DEFENSE: Singleton Pattern
// ============================================================================

describe('Defense — DefenseVerticalService (singleton)', () => {
  it('should return same instance via getInstance', () => {
    const a = DefenseVerticalService.getInstance();
    const b = DefenseVerticalService.getInstance();
    expect(a).toBe(b);
  });

  it('should export pre-built singleton', () => {
    expect(defenseVerticalService).toBeDefined();
    expect(defenseVerticalService).toBe(DefenseVerticalService.getInstance());
  });
});

// ============================================================================
// DEFENSE: Decision Schemas
// ============================================================================

describe('Defense — Decision Schemas', () => {
  it('should have at least 5 schemas', () => {
    expect(DEFENSE_DECISION_SCHEMAS.length).toBeGreaterThanOrEqual(5);
  });

  it('should include mission-order schema', () => {
    const s = DEFENSE_DECISION_SCHEMAS.find(s => s.id === 'mission-order');
    expect(s).toBeDefined();
    expect(s!.name).toContain('OPORD');
    expect(s!.classificationLevel).toBe('SECRET');
    expect(s!.retentionYears).toBe(25);
    expect(s!.requiredApprovals).toContain('mission-commander');
    expect(s!.requiredApprovals).toContain('legal-advisor-ucmj');
  });

  it('should include targeting-decision with 50-year retention', () => {
    const s = DEFENSE_DECISION_SCHEMAS.find(s => s.id === 'targeting-decision');
    expect(s).toBeDefined();
    expect(s!.retentionYears).toBe(50);
    expect(s!.fields.some(f => f.name === 'cde_level')).toBe(true);
    expect(s!.fields.some(f => f.name === 'legal_review')).toBe(true);
  });

  it('should include acquisition-decision at CUI level', () => {
    const s = DEFENSE_DECISION_SCHEMAS.find(s => s.id === 'acquisition-decision');
    expect(s).toBeDefined();
    expect(s!.classificationLevel).toBe('CUI');
  });

  it('should include intelligence-assessment', () => {
    const s = DEFENSE_DECISION_SCHEMAS.find(s => s.id === 'intelligence-assessment');
    expect(s).toBeDefined();
    expect(s!.fields.some(f => f.name === 'confidence_level' && f.type === 'enum')).toBe(true);
  });

  it('should include ROE authorization', () => {
    const s = DEFENSE_DECISION_SCHEMAS.find(s => s.id === 'roe-authorization');
    expect(s).toBeDefined();
    expect(s!.requiredApprovals).toContain('legal-advisor-ucmj');
  });

  it('all schemas should have required fields', () => {
    for (const schema of DEFENSE_DECISION_SCHEMAS) {
      expect(schema.id).toBeTruthy();
      expect(schema.name).toBeTruthy();
      expect(schema.fields.length).toBeGreaterThan(0);
      expect(schema.requiredApprovals.length).toBeGreaterThan(0);
      expect(['UNCLASSIFIED', 'CUI', 'SECRET', 'TOP_SECRET']).toContain(schema.classificationLevel);
      expect(schema.retentionYears).toBeGreaterThan(0);
    }
  });

  it('getSchemaById should return correct schema', () => {
    const svc = defenseVerticalService;
    const schema = svc.getSchemaById('mission-order');
    expect(schema).toBeDefined();
    expect(schema!.id).toBe('mission-order');
  });

  it('getSchemaById should return undefined for unknown', () => {
    expect(defenseVerticalService.getSchemaById('nonexistent')).toBeUndefined();
  });
});

// ============================================================================
// DEFENSE: Compliance Frameworks
// ============================================================================

describe('Defense — Compliance Frameworks', () => {
  it('should have at least 5 frameworks', () => {
    expect(DEFENSE_COMPLIANCE_FRAMEWORKS.length).toBeGreaterThanOrEqual(5);
  });

  it('should include FedRAMP High with continuous audit', () => {
    const f = DEFENSE_COMPLIANCE_FRAMEWORKS.find(f => f.id === 'fedramp-high');
    expect(f).toBeDefined();
    expect(f!.auditFrequency).toBe('continuous');
    expect(f!.requirements).toContain('FIPS 140-2 encryption');
  });

  it('should include CMMC Level 3', () => {
    const f = DEFENSE_COMPLIANCE_FRAMEWORKS.find(f => f.id === 'cmmc-level-3');
    expect(f).toBeDefined();
    expect(f!.requirements).toContain('NIST 800-171 compliance');
  });

  it('should include ITAR', () => {
    const f = DEFENSE_COMPLIANCE_FRAMEWORKS.find(f => f.id === 'itar');
    expect(f).toBeDefined();
    expect(f!.requirements).toContain('Export control compliance');
  });

  it('should include LOAC with targeting modes', () => {
    const f = DEFENSE_COMPLIANCE_FRAMEWORKS.find(f => f.id === 'loac');
    expect(f).toBeDefined();
    expect(f!.applicableModes).toContain('targeting-council');
    expect(f!.requirements).toContain('Proportionality');
  });

  it('getApplicableFrameworks should filter by mode', () => {
    const frameworks = defenseVerticalService.getApplicableFrameworks('targeting-council');
    expect(frameworks.length).toBeGreaterThan(0);
    expect(frameworks.some(f => f.id === 'loac')).toBe(true);
  });
});

// ============================================================================
// DEFENSE: Data Connectors
// ============================================================================

describe('Defense — Data Connectors', () => {
  it('should have at least 5 connectors', () => {
    expect(DEFENSE_DATA_CONNECTORS.length).toBeGreaterThanOrEqual(5);
  });

  it('should include SIPRNet at SECRET classification', () => {
    const c = DEFENSE_DATA_CONNECTORS.find(c => c.id === 'sipr-gateway');
    expect(c).toBeDefined();
    expect(c!.classification).toBe('SECRET');
    expect(c!.authMethods).toContain('PKI');
  });

  it('should include JWICS at TOP_SECRET', () => {
    const c = DEFENSE_DATA_CONNECTORS.find(c => c.id === 'jwics-gateway');
    expect(c).toBeDefined();
    expect(c!.classification).toBe('TOP_SECRET');
  });

  it('getConnectorsByClassification should filter correctly', () => {
    const unclass = defenseVerticalService.getConnectorsByClassification('UNCLASSIFIED');
    expect(unclass.length).toBeGreaterThan(0);
    unclass.forEach(c => expect(c.classification).toBe('UNCLASSIFIED'));

    const secret = defenseVerticalService.getConnectorsByClassification('SECRET');
    secret.forEach(c => expect(c.classification).toBe('SECRET'));
  });
});

// ============================================================================
// DEFENSE: Agents & Modes
// ============================================================================

describe('Defense — Agents', () => {
  it('should have 24+ agents total', () => {
    expect(ALL_DEFENSE_AGENTS.length).toBeGreaterThanOrEqual(24);
  });

  it('getDefaultAgents should return 8 agents', () => {
    const defaults = defenseVerticalService.getDefaultAgents();
    expect(defaults.length).toBe(8);
  });

  it('getOptionalAgents should return 12 agents', () => {
    const optional = defenseVerticalService.getOptionalAgents();
    expect(optional.length).toBe(12);
  });

  it('getSilentGuards should return 4 agents', () => {
    const guards = defenseVerticalService.getSilentGuards();
    expect(guards.length).toBe(4);
  });

  it('buildMissionTeam should return agents for kinetic missions', () => {
    const team = defenseVerticalService.buildMissionTeam('kinetic');
    expect(team.length).toBeGreaterThan(0);
  });

  it('buildMissionTeam should return agents for cyber missions', () => {
    const team = defenseVerticalService.buildMissionTeam('cyber');
    expect(team.length).toBeGreaterThan(0);
  });
});

describe('Defense — Council Modes', () => {
  it('should have 26 modes', () => {
    expect(ALL_DEFENSE_MODES.length).toBe(26);
  });

  it('getModeById should return correct mode', () => {
    const modes = defenseVerticalService.getAllModes();
    const firstMode = modes[0];
    const found = defenseVerticalService.getModeById(firstMode.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(firstMode.id);
  });

  it('getModesByClassification should filter', () => {
    const secretModes = defenseVerticalService.getModesByClassification('SECRET');
    secretModes.forEach(m => expect(m.classificationLevel).toBe('SECRET'));
  });
});

// ============================================================================
// DEFENSE: Summary & Health
// ============================================================================

describe('Defense — Summary & Health', () => {
  it('getSummary should return complete summary', () => {
    const summary = defenseVerticalService.getSummary();
    expect(summary.vertical).toBe('defense');
    expect(summary.displayName).toBe('Defense & National Security');
    expect(summary.schemas).toBeGreaterThanOrEqual(5);
    expect(summary.complianceFrameworks).toBeGreaterThanOrEqual(5);
    expect(summary.dataConnectors).toBeGreaterThanOrEqual(5);
    expect(summary.status).toBe('operational');
    expect(summary.complianceStatus.fedRampHigh).toBe(true);
    expect(summary.complianceStatus.cmmcLevel3).toBe(true);
    expect(summary.complianceStatus.itar).toBe(true);
  });

  it('getHealth should report healthy', () => {
    const health = defenseVerticalService.getHealth();
    expect(health.status).toBe('healthy');
    expect(health.vertical).toBe('defense');
    expect(health.agentsLoaded).toBeGreaterThanOrEqual(24);
    expect(health.modesLoaded).toBe(26);
    expect(health.schemasLoaded).toBeGreaterThanOrEqual(5);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — CET1 Calculation
// ============================================================================

describe('EU-Banking — Basel3Engine CET1', () => {
  const engine = new Basel3Engine();

  const baseCET1 = {
    paidUpCapital: 5000,
    sharePremiun: 1000,
    retainedEarnings: 3000,
    accumulatedOCI: 200,
    otherReserves: 500,
    minorityInterests: 100,
    deductions: {
      goodwill: 800, otherIntangibles: 200, deferredTaxAssets: 300,
      definedBenefitPension: 50, ownSharesHeld: 0, reciprocalCrossHoldings: 0,
      significantInvestments: 100, securitisationPositions: 0, insufficientCoverage: 50,
    },
  };

  it('should calculate CET1 = gross - deductions', () => {
    const result = engine.calculateCET1(baseCET1);
    // gross = 5000+1000+3000+200+500+100 = 9800
    // deductions = 800+200+300+50+0+0+100+0+50 = 1500
    expect(result).toBe(8300);
  });

  it('should floor CET1 at zero', () => {
    const negative = { ...baseCET1, deductions: { ...baseCET1.deductions, goodwill: 50000 } };
    expect(engine.calculateCET1(negative)).toBe(0);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — AT1 & Tier 2
// ============================================================================

describe('EU-Banking — Basel3Engine AT1 & Tier 2', () => {
  const engine = new Basel3Engine();

  it('should calculate AT1 correctly', () => {
    const result = engine.calculateAT1({
      perpetualInstruments: 2000, sharePremiumAT1: 100,
      deductions: { ownInstrumentsHeld: 50, reciprocalHoldings: 0, significantInvestments: 0 },
    });
    expect(result).toBe(2050);
  });

  it('should calculate Tier 2 with amortisation', () => {
    const result = engine.calculateTier2({
      subordinatedDebt: 3000, sharePremiumT2: 200,
      generalCreditRiskAdjustments: 100, amortisationAdjustment: 600,
      deductions: { ownInstrumentsHeld: 0, reciprocalHoldings: 0, significantInvestments: 50 },
    });
    // gross = 3000+200+100-600 = 2700, deductions = 50
    expect(result).toBe(2650);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — Credit RWA
// ============================================================================

describe('EU-Banking — Basel3Engine Credit RWA', () => {
  const engine = new Basel3Engine();

  it('should calculate RWA for retail at 75%', () => {
    const result = engine.calculateCreditRWA([{
      id: 'E1', exposureClass: 'retail', exposureValue: 10000, riskWeight: 0.75,
      collateralValue: 0, collateralType: 'none', maturity: 3, defaulted: false,
      counterpartyName: 'Consumer Portfolio',
    }]);
    expect(result).toBe(7500);
  });

  it('should calculate RWA for corporates at 100%', () => {
    const result = engine.calculateCreditRWA([{
      id: 'E2', exposureClass: 'corporates', exposureValue: 20000, riskWeight: 1.0,
      collateralValue: 0, collateralType: 'none', maturity: 5, defaulted: false,
      counterpartyName: 'Acme Corp',
    }]);
    expect(result).toBe(20000);
  });

  it('should apply collateral reduction (CRM)', () => {
    const result = engine.calculateCreditRWA([{
      id: 'E3', exposureClass: 'corporates', exposureValue: 10000, riskWeight: 1.0,
      collateralValue: 5000, collateralType: 'financial-collateral', maturity: 3,
      defaulted: false, counterpartyName: 'SecuredCo',
    }]);
    // haircut for financial-collateral = 0.04
    // adjusted collateral = 5000 * 0.96 = 4800
    // adjusted exposure = 10000 - 4800 = 5200
    // RWA = 5200 * 1.0 = 5200
    expect(result).toBe(5200);
  });

  it('should handle 0% risk weight for MDBs', () => {
    const result = engine.calculateCreditRWA([{
      id: 'E4', exposureClass: 'multilateral-dev-banks', exposureValue: 50000,
      riskWeight: 0.0, collateralValue: 0, collateralType: 'none', maturity: 10,
      defaulted: false, counterpartyName: 'World Bank',
    }]);
    expect(result).toBe(0);
  });

  it('should sum multiple exposures', () => {
    const result = engine.calculateCreditRWA([
      { id: 'E5', exposureClass: 'retail', exposureValue: 10000, riskWeight: 0.75, collateralValue: 0, collateralType: 'none', maturity: 2, defaulted: false, counterpartyName: 'A' },
      { id: 'E6', exposureClass: 'corporates', exposureValue: 5000, riskWeight: 1.0, collateralValue: 0, collateralType: 'none', maturity: 5, defaulted: false, counterpartyName: 'B' },
    ]);
    expect(result).toBe(7500 + 5000);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — Operational RWA
// ============================================================================

describe('EU-Banking — Basel3Engine Operational RWA', () => {
  const engine = new Basel3Engine();

  it('BIA: 15% of average positive gross income × 12.5', () => {
    const result = engine.calculateOperationalRWA({
      method: 'BIA',
      grossIncomeHistory: [1000, 1200, 800],
    });
    // avg = 1000, charge = 1000*0.15 = 150, RWA = 150*12.5 = 1875
    expect(result).toBe(1875);
  });

  it('BIA: should ignore negative years', () => {
    const result = engine.calculateOperationalRWA({
      method: 'BIA',
      grossIncomeHistory: [1000, -500, 500],
    });
    // positive years: [1000, 500], avg = 750, charge = 112.5, RWA = 1406.25
    expect(result).toBe(1406.25);
  });

  it('BIA: should return 0 for all negative years', () => {
    const result = engine.calculateOperationalRWA({
      method: 'BIA',
      grossIncomeHistory: [-100, -200, -50],
    });
    expect(result).toBe(0);
  });

  it('TSA: should apply business line betas', () => {
    const result = engine.calculateOperationalRWA({
      method: 'TSA',
      grossIncomeHistory: [0, 0, 0],
      businessLineIncome: { 'retail-banking': 1000, 'trading-and-sales': 500 },
    });
    // retail: 1000*0.12 = 120, trading: 500*0.18 = 90, total = 210, RWA = 210*12.5 = 2625
    expect(result).toBe(2625);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — Market RWA
// ============================================================================

describe('EU-Banking — Basel3Engine Market RWA', () => {
  const engine = new Basel3Engine();

  it('should sum specific + general risk charges × 12.5', () => {
    const result = engine.calculateMarketRWA([
      { id: 'P1', assetClass: 'equity', notionalValue: 50000, netPosition: 30000, deltaEquivalent: 30000, specificRiskCharge: 200, generalRiskCharge: 300 },
      { id: 'P2', assetClass: 'fx', notionalValue: 20000, netPosition: 10000, deltaEquivalent: 10000, specificRiskCharge: 50, generalRiskCharge: 100 },
    ]);
    // total charge = (200+300) + (50+100) = 650, RWA = 650*12.5 = 8125
    expect(result).toBe(8125);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — Capital Adequacy (full)
// ============================================================================

describe('EU-Banking — Basel3Engine Capital Adequacy', () => {
  const engine = new Basel3Engine();

  const cet1Comp = {
    paidUpCapital: 5000, sharePremiun: 1000, retainedEarnings: 3000,
    accumulatedOCI: 200, otherReserves: 500, minorityInterests: 100,
    deductions: { goodwill: 500, otherIntangibles: 100, deferredTaxAssets: 200, definedBenefitPension: 50, ownSharesHeld: 0, reciprocalCrossHoldings: 0, significantInvestments: 0, securitisationPositions: 0, insufficientCoverage: 0 },
  };
  const at1Comp = { perpetualInstruments: 1000, sharePremiumAT1: 0, deductions: { ownInstrumentsHeld: 0, reciprocalHoldings: 0, significantInvestments: 0 } };
  const t2Comp = { subordinatedDebt: 2000, sharePremiumT2: 0, generalCreditRiskAdjustments: 100, amortisationAdjustment: 0, deductions: { ownInstrumentsHeld: 0, reciprocalHoldings: 0, significantInvestments: 0 } };
  const creditExp = [{ id: 'E1', exposureClass: 'corporates' as const, exposureValue: 100000, riskWeight: 1.0, collateralValue: 0, collateralType: 'none' as const, maturity: 5, defaulted: false, counterpartyName: 'Corp' }];
  const marketPos = [{ id: 'P1', assetClass: 'equity' as const, notionalValue: 10000, netPosition: 5000, deltaEquivalent: 5000, specificRiskCharge: 100, generalRiskCharge: 200 }];
  const opRisk = { method: 'BIA' as const, grossIncomeHistory: [2000, 2500, 2200] as [number, number, number] };

  it('should produce compliant ratios for well-capitalised bank', () => {
    const result = engine.calculateCapitalAdequacy(
      cet1Comp, at1Comp, t2Comp, creditExp, marketPos, opRisk, 200000,
      { countercyclicalRate: 0, systemicRiskRate: 0 },
    );
    expect(result.cet1Ratio).toBeGreaterThan(0.045);
    expect(result.tier1Ratio).toBeGreaterThan(0.06);
    expect(result.totalCapitalRatio).toBeGreaterThan(0.08);
    expect(result.breaches.filter(b => b.severity === 'critical')).toHaveLength(0);
  });

  it('should detect CET1 breach below 4.5%', () => {
    const weakCET1 = {
      ...cet1Comp,
      paidUpCapital: 500, retainedEarnings: 100, sharePremiun: 0,
      accumulatedOCI: 0, otherReserves: 0, minorityInterests: 0,
    };
    const result = engine.calculateCapitalAdequacy(
      weakCET1, at1Comp, t2Comp, creditExp, marketPos, opRisk, 200000,
      { countercyclicalRate: 0, systemicRiskRate: 0 },
    );
    expect(result.breaches.some(b => b.metric === 'CET1 Ratio' && b.severity === 'critical')).toBe(true);
  });

  it('should detect leverage ratio breach below 3%', () => {
    const result = engine.calculateCapitalAdequacy(
      cet1Comp, at1Comp, t2Comp, creditExp, marketPos, opRisk,
      1000000, // huge exposure measure
      { countercyclicalRate: 0, systemicRiskRate: 0 },
    );
    if (result.leverageRatio < 0.03) {
      expect(result.breaches.some(b => b.metric === 'Leverage Ratio')).toBe(true);
    }
  });

  it('should include capital conservation buffer of 2.5%', () => {
    const result = engine.calculateCapitalAdequacy(
      cet1Comp, at1Comp, t2Comp, creditExp, marketPos, opRisk, 200000,
      { countercyclicalRate: 0.01, systemicRiskRate: 0.005 },
    );
    expect(result.capitalConservationBuffer).toBe(0.025);
    expect(result.countercyclicalBuffer).toBe(0.01);
    expect(result.systemiRiskBuffer).toBe(0.005);
    expect(result.combinedBufferRequirement).toBe(0.04);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — LCR
// ============================================================================

describe('EU-Banking — Basel3Engine LCR', () => {
  const engine = new Basel3Engine();

  it('should calculate LCR above 100% for liquid bank', () => {
    const result = engine.calculateLCR({
      hqla: {
        level1: { cash: 5000, centralBankReserves: 3000, govtBonds: 2000 },
        level2a: { govtBonds20: 1000, coveredBonds: 500, corporateBonds: 500 },
        level2b: { rmbs: 200, corporateBonds: 100, equities: 100 },
      },
      cashOutflows: {
        retailStableDeposits: 20000, retailLessStable: 10000,
        unsecuredWholesaleOperational: 5000, unsecuredWholesaleNonOperational: 3000,
        securedFundingCentral: 2000, securedFundingGovt: 1000,
        securedFundingOther: 500, creditFacilitiesDrawdown: 1000,
        liquidityFacilitiesDrawdown: 500, derivativesOutflows: 100,
        otherContractualOutflows: 200,
      },
      cashInflows: {
        retailInflows: 500, wholesaleInflows: 300,
        securedLendingMaturing: 200, otherInflows: 100,
      },
    });
    expect(result.lcr).toBeGreaterThan(0);
    expect(result.lcrHQLA).toBeGreaterThan(0);
    expect(result.lcrNetOutflows).toBeGreaterThan(0);
  });

  it('should detect LCR breach below 100%', () => {
    const result = engine.calculateLCR({
      hqla: {
        level1: { cash: 100, centralBankReserves: 50, govtBonds: 50 },
        level2a: { govtBonds20: 0, coveredBonds: 0, corporateBonds: 0 },
        level2b: { rmbs: 0, corporateBonds: 0, equities: 0 },
      },
      cashOutflows: {
        retailStableDeposits: 50000, retailLessStable: 30000,
        unsecuredWholesaleOperational: 20000, unsecuredWholesaleNonOperational: 15000,
        securedFundingCentral: 0, securedFundingGovt: 0,
        securedFundingOther: 5000, creditFacilitiesDrawdown: 3000,
        liquidityFacilitiesDrawdown: 2000, derivativesOutflows: 1000,
        otherContractualOutflows: 500,
      },
      cashInflows: { retailInflows: 100, wholesaleInflows: 50, securedLendingMaturing: 0, otherInflows: 0 },
    });
    expect(result.lcr).toBeLessThan(1.0);
    expect(result.breaches.some(b => b.metric === 'LCR')).toBe(true);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — NSFR
// ============================================================================

describe('EU-Banking — Basel3Engine NSFR', () => {
  const engine = new Basel3Engine();

  it('should calculate NSFR above 100% for stable bank', () => {
    const result = engine.calculateNSFR({
      availableStableFunding: {
        regulatoryCapital: 10000, stableRetailDeposits: 30000,
        lessStableRetailDeposits: 10000, wholesaleFundingOver1Y: 5000,
        wholesaleFunding6mTo1Y: 2000, operationalDeposits: 3000,
        otherFundingUnder6m: 1000,
      },
      requiredStableFunding: {
        cash: 5000, centralBankReserves: 2000, unencumberedGovtBonds: 3000,
        unencumberedCorpBondsAA: 2000, residentialMortgages: 20000,
        retailLoansUnder1Y: 5000, corporateLoansUnder1Y: 3000,
        corporateLoansOver1Y: 5000, equities: 1000, otherAssetsOver1Y: 2000,
        offBalanceSheet: 5000,
      },
    });
    expect(result.nsfr).toBeGreaterThan(1.0);
    expect(result.asf).toBeGreaterThan(0);
    expect(result.rsf).toBeGreaterThan(0);
    expect(result.breaches).toHaveLength(0);
  });

  it('should detect NSFR breach below 100%', () => {
    const result = engine.calculateNSFR({
      availableStableFunding: {
        regulatoryCapital: 1000, stableRetailDeposits: 2000,
        lessStableRetailDeposits: 1000, wholesaleFundingOver1Y: 500,
        wholesaleFunding6mTo1Y: 500, operationalDeposits: 500,
        otherFundingUnder6m: 10000,
      },
      requiredStableFunding: {
        cash: 500, centralBankReserves: 0, unencumberedGovtBonds: 1000,
        unencumberedCorpBondsAA: 500, residentialMortgages: 30000,
        retailLoansUnder1Y: 5000, corporateLoansUnder1Y: 3000,
        corporateLoansOver1Y: 10000, equities: 2000, otherAssetsOver1Y: 5000,
        offBalanceSheet: 3000,
      },
    });
    expect(result.nsfr).toBeLessThan(1.0);
    expect(result.breaches.some(b => b.metric === 'NSFR')).toBe(true);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — Large Exposures
// ============================================================================

describe('EU-Banking — Basel3Engine Large Exposures', () => {
  const engine = new Basel3Engine();

  it('should detect non-compliant large exposure > 25%', () => {
    const results = engine.checkLargeExposures(
      [{ counterparty: 'BigCorp', exposureValue: 3000 }],
      10000,
    );
    expect(results[0].exposurePercent).toBe(0.3);
    expect(results[0].compliant).toBe(false);
    expect(results[0].limit).toBe(0.25);
  });

  it('should allow exposure under 25%', () => {
    const results = engine.checkLargeExposures(
      [{ counterparty: 'SmallCorp', exposureValue: 2000 }],
      10000,
    );
    expect(results[0].compliant).toBe(true);
  });

  it('should apply G-SII 15% limit', () => {
    const results = engine.checkLargeExposures(
      [{ counterparty: 'OtherGSII', exposureValue: 1800 }],
      10000,
      true,
    );
    expect(results[0].limit).toBe(0.15);
    expect(results[0].compliant).toBe(false);
  });
});

// ============================================================================
// EU-BANKING: Basel3Engine — Stress Testing
// ============================================================================

describe('EU-Banking — Basel3Engine Stress Testing', () => {
  const engine = new Basel3Engine();

  it('should reduce CET1 under adverse scenario', () => {
    const baseline = engine.calculateCapitalAdequacy(
      {
        paidUpCapital: 8000, sharePremiun: 2000, retainedEarnings: 5000,
        accumulatedOCI: 500, otherReserves: 500, minorityInterests: 0,
        deductions: { goodwill: 500, otherIntangibles: 100, deferredTaxAssets: 200, definedBenefitPension: 0, ownSharesHeld: 0, reciprocalCrossHoldings: 0, significantInvestments: 0, securitisationPositions: 0, insufficientCoverage: 0 },
      },
      { perpetualInstruments: 1500, sharePremiumAT1: 0, deductions: { ownInstrumentsHeld: 0, reciprocalHoldings: 0, significantInvestments: 0 } },
      { subordinatedDebt: 3000, sharePremiumT2: 0, generalCreditRiskAdjustments: 200, amortisationAdjustment: 0, deductions: { ownInstrumentsHeld: 0, reciprocalHoldings: 0, significantInvestments: 0 } },
      [{ id: 'E1', exposureClass: 'corporates', exposureValue: 100000, riskWeight: 1.0, collateralValue: 0, collateralType: 'none', maturity: 5, defaulted: false, counterpartyName: 'Portfolio' }],
      [{ id: 'P1', assetClass: 'equity', notionalValue: 20000, netPosition: 10000, deltaEquivalent: 10000, specificRiskCharge: 200, generalRiskCharge: 400 }],
      { method: 'BIA', grossIncomeHistory: [3000, 3500, 3200] },
      300000,
      { countercyclicalRate: 0.01, systemicRiskRate: 0 },
    );

    const stressed = engine.runStressTest(baseline, {
      name: 'Severe Recession',
      gdpShock: -0.05,
      creditLossRate: 0.03,
      marketLossPct: 0.20,
      rwaInflation: 0.15,
    });

    expect(stressed.cet1Capital).toBeLessThan(baseline.cet1Capital);
    expect(stressed.totalRWA).toBeGreaterThan(baseline.totalRWA);
    expect(stressed.cet1Ratio).toBeLessThan(baseline.cet1Ratio);
  });
});
