/**
 * Vertical Expanded Batch 2 Deep Tests
 *
 * Tests the domain-specific expanded decision schemas across 4 more verticals:
 * - Education: AdmissionsSchema, DisciplinarySchema, FinancialAidSchema
 * - Real Estate: PropertyValuationSchema, MortgageUnderwritingSchema, FairHousingReviewSchema
 * - Technology: ModelDeploymentSchema, ArchitectureDecisionSchema, IncidentResponseSchema
 * - Transportation: DriverSafetySchema, HazmatSchema
 *
 * Also batch-tests VerticalImplementation pattern across all expanded verticals.
 *
 * @module __tests__/services/VerticalExpandedBatch2Deep.test
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
// IMPORTS
// ============================================================================

const {
  AdmissionsSchema,
  DisciplinarySchema,
  FinancialAidSchema,
  EducationVerticalImplementation,
} = await import('../../services/verticals/education/EducationVertical.js');

const {
  PropertyValuationSchema,
  MortgageUnderwritingSchema,
  FairHousingReviewSchema,
  RealEstateVerticalImplementation,
} = await import('../../services/verticals/realestate/RealEstateVertical.js');

const {
  ModelDeploymentSchema,
  ArchitectureDecisionSchema,
  IncidentResponseSchema,
  TechnologyVerticalImplementation,
} = await import('../../services/verticals/technology/TechnologyVertical.js');

const {
  DriverSafetySchema,
  HazmatSchema,
  TransportationVerticalImplementation,
} = await import('../../services/verticals/transportation/TransportationVerticalExpanded.js');

// Expanded vertical implementations for batch pattern test
const { AerospaceVerticalImplementation } = await import('../../services/verticals/aerospace/AerospaceVerticalExpanded.js');
const { AgricultureVerticalImplementation } = await import('../../services/verticals/agriculture/AgricultureVerticalExpanded.js');
const { AutomotiveVerticalImplementation } = await import('../../services/verticals/automotive/AutomotiveVerticalExpanded.js');
const { ConstructionVerticalImplementation } = await import('../../services/verticals/construction/ConstructionVerticalExpanded.js');
const { HospitalityVerticalImplementation } = await import('../../services/verticals/hospitality/HospitalityVerticalExpanded.js');
const { MediaVerticalImplementation } = await import('../../services/verticals/media/MediaVerticalExpanded.js');
const { PharmaceuticalVerticalImplementation } = await import('../../services/verticals/pharmaceutical/PharmaceuticalVerticalExpanded.js');
const { RetailVerticalImplementation } = await import('../../services/verticals/retail/RetailVerticalExpanded.js');
const { TelecomVerticalImplementation } = await import('../../services/verticals/telecom/TelecomVerticalExpanded.js');
const { SportsVerticalImplementation } = await import('../../services/verticals/sports/SportsVerticalExpanded.js');

// ============================================================================
// EDUCATION: AdmissionsSchema
// ============================================================================

describe('Education — AdmissionsSchema', () => {
  let schema: InstanceType<typeof AdmissionsSchema>;
  beforeEach(() => { schema = new AdmissionsSchema(); });

  it('should validate complete admissions decision', () => {
    const result = schema.validate({
      inputs: { applicantId: 'APP-001', programId: 'CS-PHD', academicRecord: { gpa: 3.9 } },
      outcome: { decision: 'admit', fairnessAuditPassed: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing applicant ID', () => {
    const result = schema.validate({
      inputs: { programId: 'MBA' },
      outcome: { decision: 'deny' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Applicant ID'))).toBe(true);
  });

  it('should reject missing program ID', () => {
    const result = schema.validate({
      inputs: { applicantId: 'APP-002' },
      outcome: { decision: 'waitlist' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Program ID'))).toBe(true);
  });

  it('should warn when fairness audit failed', () => {
    const result = schema.validate({
      inputs: { applicantId: 'APP-003', programId: 'LAW' },
      outcome: { decision: 'deny', fairnessAuditPassed: false },
    } as any);
    expect(result.warnings.some(w => w.includes('Fairness audit'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('education');
    expect(schema.decisionType).toBe('admissions');
    expect(schema.requiredApprovers).toContain('admissions-director');
    expect(schema.requiredApprovers).toContain('equity-officer');
  });
});

// ============================================================================
// EDUCATION: DisciplinarySchema
// ============================================================================

describe('Education — DisciplinarySchema', () => {
  let schema: InstanceType<typeof DisciplinarySchema>;
  beforeEach(() => { schema = new DisciplinarySchema(); });

  it('should validate complete disciplinary decision', () => {
    const result = schema.validate({
      inputs: { studentId: 'STU-001', incidentId: 'INC-001', dueProcessSteps: ['hearing', 'evidence'] },
      outcome: { action: 'suspension', dueProcessCompliant: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject non-compliant due process', () => {
    const result = schema.validate({
      inputs: { studentId: 'STU-002', incidentId: 'INC-002' },
      outcome: { action: 'expulsion', dueProcessCompliant: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Due process'))).toBe(true);
  });

  it('should warn for minor without parent notification', () => {
    const result = schema.validate({
      inputs: { studentId: 'STU-003', incidentId: 'INC-003', studentAge: 16, parentNotified: false },
      outcome: { action: 'probation', dueProcessCompliant: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Minor student'))).toBe(true);
  });
});

// ============================================================================
// EDUCATION: FinancialAidSchema
// ============================================================================

describe('Education — FinancialAidSchema', () => {
  let schema: InstanceType<typeof FinancialAidSchema>;
  beforeEach(() => { schema = new FinancialAidSchema(); });

  it('should validate complete financial aid decision', () => {
    const result = schema.validate({
      inputs: { studentId: 'STU-001', academicYear: '2025-26', fafsa: { efc: 5000 } },
      outcome: { totalAidPackage: 25000 },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing FAFSA data', () => {
    const result = schema.validate({
      inputs: { studentId: 'STU-002', academicYear: '2025-26' },
      outcome: { totalAidPackage: 15000 },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('FAFSA'))).toBe(true);
  });

  it('should warn when student not meeting SAP', () => {
    const result = schema.validate({
      inputs: { studentId: 'STU-003', academicYear: '2025-26', fafsa: { efc: 3000 }, satisfactoryProgress: false },
      outcome: { totalAidPackage: 10000 },
    } as any);
    expect(result.warnings.some(w => w.includes('SAP'))).toBe(true);
  });
});

// ============================================================================
// REAL ESTATE: PropertyValuationSchema
// ============================================================================

describe('Real Estate — PropertyValuationSchema', () => {
  let schema: InstanceType<typeof PropertyValuationSchema>;
  beforeEach(() => { schema = new PropertyValuationSchema(); });

  it('should validate complete property valuation', () => {
    const result = schema.validate({
      inputs: { propertyId: 'PROP-001', propertyType: 'single-family', comparables: [{}, {}, {}] },
      outcome: { estimatedValue: 450000, fairHousingCompliant: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing property type', () => {
    const result = schema.validate({
      inputs: { propertyId: 'PROP-002' },
      outcome: { estimatedValue: 300000 },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Property type'))).toBe(true);
  });

  it('should reject failed fair housing compliance', () => {
    const result = schema.validate({
      inputs: { propertyId: 'PROP-003', propertyType: 'condo', comparables: [{}, {}, {}] },
      outcome: { estimatedValue: 250000, fairHousingCompliant: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Fair housing'))).toBe(true);
  });

  it('should warn when fewer than 3 comparables', () => {
    const result = schema.validate({
      inputs: { propertyId: 'PROP-004', propertyType: 'multi-family', comparables: [{}] },
      outcome: { estimatedValue: 800000, fairHousingCompliant: true },
    } as any);
    expect(result.warnings.some(w => w.includes('comparables'))).toBe(true);
  });
});

// ============================================================================
// REAL ESTATE: MortgageUnderwritingSchema
// ============================================================================

describe('Real Estate — MortgageUnderwritingSchema', () => {
  let schema: InstanceType<typeof MortgageUnderwritingSchema>;
  beforeEach(() => { schema = new MortgageUnderwritingSchema(); });

  it('should validate complete mortgage underwriting', () => {
    const result = schema.validate({
      inputs: { applicationId: 'MTG-001', borrowerId: 'BRW-001', loanAmount: 350000, ltv: 80, dti: 35 },
      outcome: { decision: 'approve', fairLendingCompliant: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject failed fair lending compliance', () => {
    const result = schema.validate({
      inputs: { applicationId: 'MTG-002', borrowerId: 'BRW-002', loanAmount: 200000 },
      outcome: { decision: 'deny', fairLendingCompliant: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Fair lending'))).toBe(true);
  });

  it('should warn when LTV exceeds 97%', () => {
    const result = schema.validate({
      inputs: { applicationId: 'MTG-003', borrowerId: 'BRW-003', loanAmount: 490000, ltv: 98, dti: 30 },
      outcome: { decision: 'approve', fairLendingCompliant: true },
    } as any);
    expect(result.warnings.some(w => w.includes('LTV'))).toBe(true);
  });

  it('should warn when DTI exceeds QM threshold', () => {
    const result = schema.validate({
      inputs: { applicationId: 'MTG-004', borrowerId: 'BRW-004', loanAmount: 300000, ltv: 80, dti: 50 },
      outcome: { decision: 'approve', fairLendingCompliant: true },
    } as any);
    expect(result.warnings.some(w => w.includes('DTI'))).toBe(true);
  });
});

// ============================================================================
// REAL ESTATE: FairHousingReviewSchema
// ============================================================================

describe('Real Estate — FairHousingReviewSchema', () => {
  let schema: InstanceType<typeof FairHousingReviewSchema>;
  beforeEach(() => { schema = new FairHousingReviewSchema(); });

  it('should validate complete fair housing review', () => {
    const result = schema.validate({
      inputs: { propertyId: 'PROP-001', reviewType: 'advertising' },
      outcome: { compliant: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing review type', () => {
    const result = schema.validate({
      inputs: { propertyId: 'PROP-002' },
      outcome: { compliant: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Review type'))).toBe(true);
  });

  it('should warn on detected violations', () => {
    const result = schema.validate({
      inputs: { propertyId: 'PROP-003', reviewType: 'lending' },
      outcome: { compliant: false, violations: ['Discriminatory lending terms'] },
    } as any);
    expect(result.warnings.some(w => w.includes('violations'))).toBe(true);
  });
});

// ============================================================================
// TECHNOLOGY: ModelDeploymentSchema
// ============================================================================

describe('Technology — ModelDeploymentSchema', () => {
  let schema: InstanceType<typeof ModelDeploymentSchema>;
  beforeEach(() => { schema = new ModelDeploymentSchema(); });

  it('should validate complete model deployment', () => {
    const result = schema.validate({
      inputs: { modelId: 'MDL-001', modelVersion: '2.1.0', targetEnvironment: 'production' },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing model version', () => {
    const result = schema.validate({
      inputs: { modelId: 'MDL-002', targetEnvironment: 'staging' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Model version'))).toBe(true);
  });

  it('should reject critical vulnerabilities', () => {
    const result = schema.validate({
      inputs: {
        modelId: 'MDL-003', modelVersion: '1.0', targetEnvironment: 'production',
        securityScan: { critical: 3, high: 5, medium: 12 },
      },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Critical vulnerabilities'))).toBe(true);
  });

  it('should warn on bias test failures', () => {
    const result = schema.validate({
      inputs: {
        modelId: 'MDL-004', modelVersion: '2.0', targetEnvironment: 'production',
        biasTestResults: [{ test: 'demographic-parity', acceptable: false }],
      },
      outcome: { approved: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Bias test'))).toBe(true);
  });
});

// ============================================================================
// TECHNOLOGY: ArchitectureDecisionSchema
// ============================================================================

describe('Technology — ArchitectureDecisionSchema', () => {
  let schema: InstanceType<typeof ArchitectureDecisionSchema>;
  beforeEach(() => { schema = new ArchitectureDecisionSchema(); });

  it('should validate complete ADR', () => {
    const result = schema.validate({
      inputs: { proposalId: 'ADR-001', title: 'Migrate to microservices' },
      outcome: { decision: 'approved' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing title', () => {
    const result = schema.validate({
      inputs: { proposalId: 'ADR-002' },
      outcome: { decision: 'rejected' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Title'))).toBe(true);
  });
});

// ============================================================================
// TECHNOLOGY: IncidentResponseSchema
// ============================================================================

describe('Technology — IncidentResponseSchema', () => {
  let schema: InstanceType<typeof IncidentResponseSchema>;
  beforeEach(() => { schema = new IncidentResponseSchema(); });

  it('should validate complete incident response', () => {
    const result = schema.validate({
      inputs: { incidentId: 'SEV-001', severity: 'P1' },
      outcome: { selectedMitigation: 'Rollback deployment', escalated: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing severity', () => {
    const result = schema.validate({
      inputs: { incidentId: 'SEV-002' },
      outcome: { selectedMitigation: 'Restart service' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Severity'))).toBe(true);
  });

  it('should warn on P0 not escalated', () => {
    const result = schema.validate({
      inputs: { incidentId: 'SEV-003', severity: 'P0' },
      outcome: { selectedMitigation: 'Full failover' },
    } as any);
    expect(result.warnings.some(w => w.includes('P0'))).toBe(true);
  });
});

// ============================================================================
// TRANSPORTATION: DriverSafetySchema
// ============================================================================

describe('Transportation — DriverSafetySchema', () => {
  let schema: InstanceType<typeof DriverSafetySchema>;
  beforeEach(() => { schema = new DriverSafetySchema(); });

  it('should validate fit-for-duty driver', () => {
    const result = schema.validate({
      inputs: { driverId: 'DRV-001', cdlClass: 'A', hosStatus: { drivingHours: 8 } },
      outcome: { fitForDuty: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing CDL class', () => {
    const result = schema.validate({
      inputs: { driverId: 'DRV-002' },
      outcome: { fitForDuty: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('CDL class'))).toBe(true);
  });

  it('should reject HOS driving limit exceeded', () => {
    const result = schema.validate({
      inputs: { driverId: 'DRV-003', cdlClass: 'B', hosStatus: { drivingHours: 13 } },
      outcome: { fitForDuty: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('HOS driving limit'))).toBe(true);
  });

  it('should reject expired medical certification', () => {
    const result = schema.validate({
      inputs: {
        driverId: 'DRV-004', cdlClass: 'A',
        hosStatus: { drivingHours: 5 },
        medicalCertification: { expiry: '2020-01-01' },
      },
      outcome: { fitForDuty: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Medical certification expired'))).toBe(true);
  });
});

// ============================================================================
// TRANSPORTATION: HazmatSchema
// ============================================================================

describe('Transportation — HazmatSchema', () => {
  let schema: InstanceType<typeof HazmatSchema>;
  beforeEach(() => { schema = new HazmatSchema(); });

  it('should validate complete hazmat shipment', () => {
    const result = schema.validate({
      inputs: {
        shipmentId: 'HAZ-001', hazmatClass: '3', unNumber: 'UN1203',
        driverEndorsement: 'H', securityPlan: true,
      },
      outcome: { approved: true, documentationComplete: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing UN number', () => {
    const result = schema.validate({
      inputs: { shipmentId: 'HAZ-002', hazmatClass: '8', driverEndorsement: 'H' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('UN number'))).toBe(true);
  });

  it('should reject missing driver endorsement', () => {
    const result = schema.validate({
      inputs: { shipmentId: 'HAZ-003', hazmatClass: '2', unNumber: 'UN1075' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('endorsement'))).toBe(true);
  });

  it('should warn when security plan not verified', () => {
    const result = schema.validate({
      inputs: {
        shipmentId: 'HAZ-004', hazmatClass: '6', unNumber: 'UN1851',
        driverEndorsement: 'HN',
      },
      outcome: { approved: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Security plan'))).toBe(true);
  });
});

// ============================================================================
// BATCH: VerticalImplementation pattern across expanded verticals
// ============================================================================

describe('Batch — VerticalImplementation pattern (expanded verticals)', () => {
  const verticals = [
    { name: 'Aerospace', Cls: AerospaceVerticalImplementation, id: 'aerospace' },
    { name: 'Agriculture', Cls: AgricultureVerticalImplementation, id: 'agriculture' },
    { name: 'Automotive', Cls: AutomotiveVerticalImplementation, id: 'automotive' },
    { name: 'Construction', Cls: ConstructionVerticalImplementation, id: 'construction' },
    { name: 'Education', Cls: EducationVerticalImplementation, id: 'education' },
    { name: 'Hospitality', Cls: HospitalityVerticalImplementation, id: 'hospitality' },
    { name: 'Media', Cls: MediaVerticalImplementation, id: 'media' },
    { name: 'Pharmaceutical', Cls: PharmaceuticalVerticalImplementation, id: 'pharmaceutical' },
    { name: 'Real Estate', Cls: RealEstateVerticalImplementation, id: 'realestate' },
    { name: 'Retail', Cls: RetailVerticalImplementation, id: 'retail' },
    { name: 'Sports', Cls: SportsVerticalImplementation, id: 'sports' },
    { name: 'Technology', Cls: TechnologyVerticalImplementation, id: 'technology' },
    { name: 'Telecom', Cls: TelecomVerticalImplementation, id: 'telecom' },
    { name: 'Transportation', Cls: TransportationVerticalImplementation, id: 'transportation' },
  ];

  for (const { name, Cls, id } of verticals) {
    describe(`${name} VerticalImplementation`, () => {
      let instance: any;

      beforeEach(() => {
        if (typeof Cls === 'function' && Cls.prototype) {
          instance = new (Cls as any)();
        } else {
          instance = Cls;
        }
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

      it('should have at least 1 decision schema', () => {
        expect(instance.decisionSchemas.size).toBeGreaterThanOrEqual(1);
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
