/**
 * Vertical Expanded Batch Deep Tests
 *
 * Tests the domain-specific expanded decision schemas across 9 verticals:
 * - Aerospace: AirworthinessSchema, DesignCertificationSchema
 * - Agriculture: CropManagementSchema, PesticideApplicationSchema, FoodSafetySchema
 * - Automotive: VehicleRecallSchema, ADASValidationSchema
 * - Construction: SafetyIncidentSchema, ChangeOrderSchema
 * - Hospitality: FoodSafetySchema, GuestSafetySchema
 * - Media: ContentModerationSchema, RightsLicensingSchema
 * - Pharmaceutical: ClinicalTrialSchema, DrugSafetySchema
 * - Retail: PricingDecisionSchema, ProductRecallSchema, CustomerDataSchema
 * - Telecom: ServiceOutageSchema, SubscriberPrivacySchema
 *
 * Every test uses real domain data with explicit assertions.
 *
 * @module __tests__/services/VerticalExpandedBatchDeep.test
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
  AirworthinessSchema,
  DesignCertificationSchema,
} = await import('../../services/verticals/aerospace/AerospaceVerticalExpanded.js');

const {
  CropManagementSchema,
  PesticideApplicationSchema,
  FoodSafetySchema: AgFoodSafetySchema,
} = await import('../../services/verticals/agriculture/AgricultureVerticalExpanded.js');

const {
  VehicleRecallSchema,
  ADASValidationSchema,
} = await import('../../services/verticals/automotive/AutomotiveVerticalExpanded.js');

const {
  SafetyIncidentSchema,
  ChangeOrderSchema,
} = await import('../../services/verticals/construction/ConstructionVerticalExpanded.js');

const {
  FoodSafetySchema: HospFoodSafetySchema,
  GuestSafetySchema,
} = await import('../../services/verticals/hospitality/HospitalityVerticalExpanded.js');

const {
  ContentModerationSchema,
  RightsLicensingSchema,
} = await import('../../services/verticals/media/MediaVerticalExpanded.js');

const {
  ClinicalTrialSchema,
  DrugSafetySchema,
} = await import('../../services/verticals/pharmaceutical/PharmaceuticalVerticalExpanded.js');

const {
  PricingDecisionSchema,
  ProductRecallSchema,
  CustomerDataSchema,
} = await import('../../services/verticals/retail/RetailVerticalExpanded.js');

const {
  ServiceOutageSchema,
  SubscriberPrivacySchema,
} = await import('../../services/verticals/telecom/TelecomVerticalExpanded.js');

// ============================================================================
// AEROSPACE: AirworthinessSchema
// ============================================================================

describe('Aerospace — AirworthinessSchema', () => {
  let schema: InstanceType<typeof AirworthinessSchema>;
  beforeEach(() => { schema = new AirworthinessSchema(); });

  it('should validate airworthy aircraft', () => {
    const result = schema.validate({
      inputs: {
        aircraftId: 'N12345', registrationNumber: 'N12345',
        adCompliance: [{ directiveId: 'AD-2025-01', compliant: true }],
      },
      outcome: { airworthy: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing aircraft ID', () => {
    const result = schema.validate({
      inputs: { registrationNumber: 'N999' },
      outcome: { airworthy: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Aircraft ID'))).toBe(true);
  });

  it('should reject non-compliant airworthiness directives', () => {
    const result = schema.validate({
      inputs: {
        aircraftId: 'N54321', registrationNumber: 'N54321',
        adCompliance: [
          { directiveId: 'AD-2025-01', compliant: true },
          { directiveId: 'AD-2025-02', compliant: false },
        ],
      },
      outcome: { airworthy: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Non-compliant airworthiness'))).toBe(true);
  });

  it('should warn on expired MEL deferrals', () => {
    const result = schema.validate({
      inputs: {
        aircraftId: 'N11111', registrationNumber: 'N11111',
        adCompliance: [{ directiveId: 'AD-001', compliant: true }],
        melsAndcdls: [{ item: 'Weather radar', deferral: true, expiry: '2020-01-01' }],
      },
      outcome: { airworthy: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Expired MEL'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('aerospace');
    expect(schema.decisionType).toBe('airworthiness');
    expect(schema.requiredApprovers).toContain('designated-airworthiness-representative');
  });
});

// ============================================================================
// AEROSPACE: DesignCertificationSchema
// ============================================================================

describe('Aerospace — DesignCertificationSchema', () => {
  let schema: InstanceType<typeof DesignCertificationSchema>;
  beforeEach(() => { schema = new DesignCertificationSchema(); });

  it('should validate complete design certification', () => {
    const result = schema.validate({
      inputs: {
        projectId: 'CERT-001', certificationType: 'type-certificate',
        complianceMatrix: [{ item: 'CFR-25.571', status: 'compliant' }],
      },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing project ID', () => {
    const result = schema.validate({
      inputs: { certificationType: 'supplemental' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Project ID'))).toBe(true);
  });

  it('should reject unmitigated catastrophic hazard', () => {
    const result = schema.validate({
      inputs: {
        projectId: 'CERT-002', certificationType: 'type-certificate',
        safetyAssessment: [{ hazard: 'Engine failure', severity: 'catastrophic', mitigated: false }],
      },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('catastrophic'))).toBe(true);
  });

  it('should warn on non-compliant matrix items', () => {
    const result = schema.validate({
      inputs: {
        projectId: 'CERT-003', certificationType: 'stc',
        complianceMatrix: [
          { item: 'CFR-25.571', status: 'compliant' },
          { item: 'CFR-25.1309', status: 'not-compliant' },
        ],
      },
      outcome: { approved: false },
    } as any);
    expect(result.warnings.some(w => w.includes('Non-compliant'))).toBe(true);
  });
});

// ============================================================================
// AGRICULTURE: CropManagementSchema
// ============================================================================

describe('Agriculture — CropManagementSchema', () => {
  let schema: InstanceType<typeof CropManagementSchema>;
  beforeEach(() => { schema = new CropManagementSchema(); });

  it('should validate complete crop management decision', () => {
    const result = schema.validate({
      inputs: { fieldId: 'FIELD-001', cropType: 'corn', soilAnalysis: { ph: 6.5, nitrogen: 'adequate' } },
      outcome: { recommendation: 'plant', bufferZoneCompliant: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing field ID', () => {
    const result = schema.validate({
      inputs: { cropType: 'wheat' },
      outcome: { recommendation: 'delay' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Field ID'))).toBe(true);
  });

  it('should warn on buffer zone non-compliance', () => {
    const result = schema.validate({
      inputs: { fieldId: 'F-002', cropType: 'soybeans', soilAnalysis: {} },
      outcome: { recommendation: 'spray', bufferZoneCompliant: false },
    } as any);
    expect(result.warnings.some(w => w.includes('Buffer zone'))).toBe(true);
  });
});

// ============================================================================
// AGRICULTURE: PesticideApplicationSchema
// ============================================================================

describe('Agriculture — PesticideApplicationSchema', () => {
  let schema: InstanceType<typeof PesticideApplicationSchema>;
  beforeEach(() => { schema = new PesticideApplicationSchema(); });

  it('should validate complete pesticide application', () => {
    const result = schema.validate({
      inputs: {
        fieldId: 'F-001', targetPest: 'aphids', applicatorLicense: 'LIC-001',
        ipmThreshold: true,
      },
      outcome: { approved: true, selectedProduct: 'neem-oil' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject application during temperature inversions', () => {
    const result = schema.validate({
      inputs: {
        fieldId: 'F-002', targetPest: 'mites', applicatorLicense: 'LIC-002',
        weatherConditions: { inversions: true },
      },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('inversions'))).toBe(true);
  });

  it('should warn when IPM threshold not met', () => {
    const result = schema.validate({
      inputs: { fieldId: 'F-003', targetPest: 'beetles', applicatorLicense: 'LIC-003' },
      outcome: { approved: true, selectedProduct: 'pyrethrin' },
    } as any);
    expect(result.warnings.some(w => w.includes('IPM threshold'))).toBe(true);
  });
});

// ============================================================================
// AGRICULTURE: FoodSafetySchema (Agriculture)
// ============================================================================

describe('Agriculture — FoodSafetySchema', () => {
  let schema: InstanceType<typeof AgFoodSafetySchema>;
  beforeEach(() => { schema = new AgFoodSafetySchema(); });

  it('should validate cleared product', () => {
    const result = schema.validate({
      inputs: { productId: 'PROD-001', testResults: [{ test: 'salmonella', passed: true }] },
      outcome: { cleared: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing test results', () => {
    const result = schema.validate({
      inputs: { productId: 'PROD-002', testResults: [] },
      outcome: { cleared: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Test results'))).toBe(true);
  });

  it('should warn on failed tests', () => {
    const result = schema.validate({
      inputs: { productId: 'PROD-003', testResults: [{ test: 'e-coli', passed: false }] },
      outcome: { cleared: false },
    } as any);
    expect(result.warnings.some(w => w.includes('Failed tests'))).toBe(true);
  });
});

// ============================================================================
// AUTOMOTIVE: VehicleRecallSchema
// ============================================================================

describe('Automotive — VehicleRecallSchema', () => {
  let schema: InstanceType<typeof VehicleRecallSchema>;
  beforeEach(() => { schema = new VehicleRecallSchema(); });

  it('should validate complete vehicle recall', () => {
    const result = schema.validate({
      inputs: { defectId: 'DEF-001', component: 'airbag-inflator', affectedVehicles: 50000 },
      outcome: { recallInitiated: true, scope: 'nationwide' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing defect ID', () => {
    const result = schema.validate({
      inputs: { component: 'brakes' },
      outcome: { recallInitiated: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Defect ID'))).toBe(true);
  });

  it('should warn when fatalities reported', () => {
    const result = schema.validate({
      inputs: { defectId: 'DEF-002', component: 'steering', fatalitiesReported: 3 },
      outcome: { recallInitiated: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Fatalities'))).toBe(true);
  });
});

// ============================================================================
// AUTOMOTIVE: ADASValidationSchema
// ============================================================================

describe('Automotive — ADASValidationSchema', () => {
  let schema: InstanceType<typeof ADASValidationSchema>;
  beforeEach(() => { schema = new ADASValidationSchema(); });

  it('should validate complete ADAS validation', () => {
    const result = schema.validate({
      inputs: { systemId: 'ADAS-001', systemType: 'AEB', softwareVersion: '3.1.0' },
      outcome: { approved: true, safetyRating: 'ASIL-D' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing system type', () => {
    const result = schema.validate({
      inputs: { systemId: 'ADAS-002', softwareVersion: '1.0' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('System type'))).toBe(true);
  });

  it('should reject unacceptable catastrophic failure probability', () => {
    const result = schema.validate({
      inputs: {
        systemId: 'ADAS-003', systemType: 'LKA', softwareVersion: '2.0',
        failureModes: [{ mode: 'false-negative', severity: 'catastrophic', probability: 0.05 }],
      },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('catastrophic failure'))).toBe(true);
  });
});

// ============================================================================
// CONSTRUCTION: SafetyIncidentSchema
// ============================================================================

describe('Construction — SafetyIncidentSchema', () => {
  let schema: InstanceType<typeof SafetyIncidentSchema>;
  beforeEach(() => { schema = new SafetyIncidentSchema(); });

  it('should validate complete safety incident', () => {
    const result = schema.validate({
      inputs: { incidentId: 'INC-001', projectId: 'PRJ-001', incidentType: 'fall' },
      outcome: { investigationComplete: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing incident type', () => {
    const result = schema.validate({
      inputs: { incidentId: 'INC-002', projectId: 'PRJ-002' },
      outcome: { investigationComplete: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Incident type'))).toBe(true);
  });

  it('should warn on fatality — OSHA notification', () => {
    const result = schema.validate({
      inputs: { incidentId: 'INC-003', projectId: 'PRJ-003', incidentType: 'fatality' },
      outcome: { investigationComplete: false },
    } as any);
    expect(result.warnings.some(w => w.includes('OSHA'))).toBe(true);
  });
});

// ============================================================================
// CONSTRUCTION: ChangeOrderSchema
// ============================================================================

describe('Construction — ChangeOrderSchema', () => {
  let schema: InstanceType<typeof ChangeOrderSchema>;
  beforeEach(() => { schema = new ChangeOrderSchema(); });

  it('should validate complete change order', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-001', projectId: 'PRJ-001', costImpact: 150000 },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing cost impact', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-002', projectId: 'PRJ-002' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Cost impact'))).toBe(true);
  });

  it('should warn when cumulative change orders exceed 15%', () => {
    const result = schema.validate({
      inputs: {
        changeOrderId: 'CO-003', projectId: 'PRJ-003', costImpact: 500000,
        cumulativeChangeOrders: 2000000, originalContractValue: 10000000,
      },
      outcome: { approved: true },
    } as any);
    expect(result.warnings.some(w => w.includes('15%'))).toBe(true);
  });
});

// ============================================================================
// HOSPITALITY: FoodSafetySchema
// ============================================================================

describe('Hospitality — FoodSafetySchema', () => {
  let schema: InstanceType<typeof HospFoodSafetySchema>;
  beforeEach(() => { schema = new HospFoodSafetySchema(); });

  it('should validate passing food safety inspection', () => {
    const result = schema.validate({
      inputs: {
        locationId: 'LOC-001', inspectionType: 'routine',
        findings: [{ area: 'kitchen', severity: 'minor', corrected: true }],
      },
      outcome: { overallScore: 95, passed: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing location ID', () => {
    const result = schema.validate({
      inputs: { inspectionType: 'surprise' },
      outcome: { overallScore: 70, passed: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Location ID'))).toBe(true);
  });

  it('should reject uncorrected critical findings', () => {
    const result = schema.validate({
      inputs: {
        locationId: 'LOC-002', inspectionType: 'complaint',
        findings: [{ area: 'storage', severity: 'critical', corrected: false }],
      },
      outcome: { overallScore: 40, passed: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('critical findings'))).toBe(true);
  });
});

// ============================================================================
// HOSPITALITY: GuestSafetySchema
// ============================================================================

describe('Hospitality — GuestSafetySchema', () => {
  let schema: InstanceType<typeof GuestSafetySchema>;
  beforeEach(() => { schema = new GuestSafetySchema(); });

  it('should validate complete guest safety incident', () => {
    const result = schema.validate({
      inputs: { incidentId: 'GSI-001', propertyId: 'PROP-001', incidentType: 'slip-and-fall' },
      outcome: { immediateActions: ['secured area', 'first aid'] },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing property ID', () => {
    const result = schema.validate({
      inputs: { incidentId: 'GSI-002', incidentType: 'fire' },
      outcome: { immediateActions: ['evacuate'] },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Property ID'))).toBe(true);
  });

  it('should warn when emergency services dispatched', () => {
    const result = schema.validate({
      inputs: {
        incidentId: 'GSI-003', propertyId: 'PROP-002', incidentType: 'drowning',
        emergencyServicesDispatched: true,
      },
      outcome: { immediateActions: ['CPR', 'pool closure'] },
    } as any);
    expect(result.warnings.some(w => w.includes('insurance notification'))).toBe(true);
  });
});

// ============================================================================
// MEDIA: ContentModerationSchema
// ============================================================================

describe('Media — ContentModerationSchema', () => {
  let schema: InstanceType<typeof ContentModerationSchema>;
  beforeEach(() => { schema = new ContentModerationSchema(); });

  it('should validate complete content moderation', () => {
    const result = schema.validate({
      inputs: { contentId: 'CNT-001', contentType: 'video', flagReason: 'hate-speech' },
      outcome: { action: 'remove', appealAvailable: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing flag reason', () => {
    const result = schema.validate({
      inputs: { contentId: 'CNT-002', contentType: 'article' },
      outcome: { action: 'restrict' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Flag reason'))).toBe(true);
  });

  it('should warn when minor involved', () => {
    const result = schema.validate({
      inputs: { contentId: 'CNT-003', contentType: 'image', flagReason: 'csam', minorInvolved: true },
      outcome: { action: 'remove' },
    } as any);
    expect(result.warnings.some(w => w.includes('Minor involved'))).toBe(true);
  });
});

// ============================================================================
// MEDIA: RightsLicensingSchema
// ============================================================================

describe('Media — RightsLicensingSchema', () => {
  let schema: InstanceType<typeof RightsLicensingSchema>;
  beforeEach(() => { schema = new RightsLicensingSchema(); });

  it('should validate complete rights licensing', () => {
    const result = schema.validate({
      inputs: { contentId: 'MEDIA-001', rightsType: 'broadcast', territory: 'US', chainOfTitle: true },
      outcome: { approved: true, territories: ['US'] },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject licensing conflicts', () => {
    const result = schema.validate({
      inputs: { contentId: 'MEDIA-002', rightsType: 'digital', chainOfTitle: true },
      outcome: { approved: false, conflictsIdentified: ['Existing exclusive deal with Netflix'] },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('conflicts'))).toBe(true);
  });

  it('should warn on missing chain of title', () => {
    const result = schema.validate({
      inputs: { contentId: 'MEDIA-003', rightsType: 'theatrical' },
      outcome: { approved: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Chain of title'))).toBe(true);
  });
});

// ============================================================================
// PHARMACEUTICAL: ClinicalTrialSchema
// ============================================================================

describe('Pharmaceutical — ClinicalTrialSchema', () => {
  let schema: InstanceType<typeof ClinicalTrialSchema>;
  beforeEach(() => { schema = new ClinicalTrialSchema(); });

  it('should validate complete clinical trial decision', () => {
    const result = schema.validate({
      inputs: { trialId: 'CT-001', phase: 'Phase III', ethicsApproval: true },
      outcome: { decision: 'continue', safetyAcceptable: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing ethics approval', () => {
    const result = schema.validate({
      inputs: { trialId: 'CT-002', phase: 'Phase I' },
      outcome: { decision: 'hold' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Ethics approval'))).toBe(true);
  });

  it('should warn when deaths reported — DSMB review', () => {
    const result = schema.validate({
      inputs: {
        trialId: 'CT-003', phase: 'Phase II', ethicsApproval: true,
        safetyData: { deaths: 2, seriousAdverseEvents: 15 },
      },
      outcome: { decision: 'pause', safetyAcceptable: false },
    } as any);
    expect(result.warnings.some(w => w.includes('DSMB'))).toBe(true);
  });
});

// ============================================================================
// PHARMACEUTICAL: DrugSafetySchema
// ============================================================================

describe('Pharmaceutical — DrugSafetySchema', () => {
  let schema: InstanceType<typeof DrugSafetySchema>;
  beforeEach(() => { schema = new DrugSafetySchema(); });

  it('should validate complete drug safety signal', () => {
    const result = schema.validate({
      inputs: {
        productId: 'DRUG-001', signalType: 'post-market',
        adverseEvents: [{ event: 'hepatotoxicity', count: 50 }],
      },
      outcome: { action: 'label-update' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing adverse events', () => {
    const result = schema.validate({
      inputs: { productId: 'DRUG-002', signalType: 'clinical', adverseEvents: [] },
      outcome: { action: 'investigate' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Adverse events'))).toBe(true);
  });

  it('should warn on market withdrawal — board approval', () => {
    const result = schema.validate({
      inputs: {
        productId: 'DRUG-003', signalType: 'post-market',
        adverseEvents: [{ event: 'cardiac-death', count: 100 }],
      },
      outcome: { action: 'market-withdrawal' },
    } as any);
    expect(result.warnings.some(w => w.includes('board approval'))).toBe(true);
  });
});

// ============================================================================
// RETAIL: PricingDecisionSchema
// ============================================================================

describe('Retail — PricingDecisionSchema', () => {
  let schema: InstanceType<typeof PricingDecisionSchema>;
  beforeEach(() => { schema = new PricingDecisionSchema(); });

  it('should validate complete pricing decision', () => {
    const result = schema.validate({
      inputs: { productId: 'SKU-001', currentPrice: 29.99 },
      outcome: { newPrice: 24.99, fairnessCheck: 'passed' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing current price', () => {
    const result = schema.validate({
      inputs: { productId: 'SKU-002' },
      outcome: { newPrice: 19.99 },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Current price'))).toBe(true);
  });

  it('should warn on elevated discrimination risk', () => {
    const result = schema.validate({
      inputs: { productId: 'SKU-003', currentPrice: 49.99 },
      outcome: { newPrice: 59.99, fairnessCheck: 'flagged', discriminationRiskScore: 0.45 },
    } as any);
    expect(result.warnings.some(w => w.includes('Discrimination risk'))).toBe(true);
  });
});

// ============================================================================
// RETAIL: ProductRecallSchema
// ============================================================================

describe('Retail — ProductRecallSchema', () => {
  let schema: InstanceType<typeof ProductRecallSchema>;
  beforeEach(() => { schema = new ProductRecallSchema(); });

  it('should validate complete product recall', () => {
    const result = schema.validate({
      inputs: { productId: 'SKU-RECALL-001', hazardType: 'choking' },
      outcome: { recallInitiated: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing hazard type', () => {
    const result = schema.validate({
      inputs: { productId: 'SKU-R-002' },
      outcome: { recallInitiated: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Hazard type'))).toBe(true);
  });

  it('should warn on injuries reported', () => {
    const result = schema.validate({
      inputs: { productId: 'SKU-R-003', hazardType: 'burn', injuriesReported: 12 },
      outcome: { recallInitiated: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Injuries reported'))).toBe(true);
  });
});

// ============================================================================
// RETAIL: CustomerDataSchema
// ============================================================================

describe('Retail — CustomerDataSchema', () => {
  let schema: InstanceType<typeof CustomerDataSchema>;
  beforeEach(() => { schema = new CustomerDataSchema(); });

  it('should validate complete customer data request', () => {
    const result = schema.validate({
      inputs: { requestId: 'REQ-001', dataType: 'purchase-history', purposeLimitation: 'analytics' },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing purpose limitation', () => {
    const result = schema.validate({
      inputs: { requestId: 'REQ-002', dataType: 'browsing' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Purpose limitation'))).toBe(true);
  });

  it('should warn when minor data involved', () => {
    const result = schema.validate({
      inputs: {
        requestId: 'REQ-003', dataType: 'profile', purposeLimitation: 'marketing',
        minorDataInvolved: true,
      },
      outcome: { approved: false },
    } as any);
    expect(result.warnings.some(w => w.includes('Minor data'))).toBe(true);
  });

  it('should warn on PII without DPIA', () => {
    const result = schema.validate({
      inputs: {
        requestId: 'REQ-004', dataType: 'personal', purposeLimitation: 'profiling',
        piiInvolved: true,
      },
      outcome: { approved: true, dpiaConducted: false },
    } as any);
    expect(result.warnings.some(w => w.includes('DPIA'))).toBe(true);
  });
});

// ============================================================================
// TELECOM: ServiceOutageSchema
// ============================================================================

describe('Telecom — ServiceOutageSchema', () => {
  let schema: InstanceType<typeof ServiceOutageSchema>;
  beforeEach(() => { schema = new ServiceOutageSchema(); });

  it('should validate complete service outage', () => {
    const result = schema.validate({
      inputs: { outageId: 'OUT-001', severity: 'P1', subscribersImpacted: 50000 },
      outcome: { restorationPlan: 'Reroute traffic via backup' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing severity', () => {
    const result = schema.validate({
      inputs: { outageId: 'OUT-002' },
      outcome: { restorationPlan: 'Deploy fix' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Severity'))).toBe(true);
  });

  it('should warn on E-911 impact — FCC notification', () => {
    const result = schema.validate({
      inputs: { outageId: 'OUT-003', severity: 'P1', subscribersImpacted: 100000, e911Impact: true },
      outcome: { restorationPlan: 'Emergency restore' },
    } as any);
    expect(result.warnings.some(w => w.includes('FCC'))).toBe(true);
  });
});

// ============================================================================
// TELECOM: SubscriberPrivacySchema
// ============================================================================

describe('Telecom — SubscriberPrivacySchema', () => {
  let schema: InstanceType<typeof SubscriberPrivacySchema>;
  beforeEach(() => { schema = new SubscriberPrivacySchema(); });

  it('should validate complete subscriber privacy request', () => {
    const result = schema.validate({
      inputs: { requestId: 'PRIV-001', dataType: 'cdr', processingPurpose: 'billing', consentObtained: true },
      outcome: { approved: true, cpniCompliant: true },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject CPNI access without consent', () => {
    const result = schema.validate({
      inputs: { requestId: 'PRIV-002', dataType: 'cpni', processingPurpose: 'marketing' },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('CPNI consent'))).toBe(true);
  });

  it('should warn on law enforcement request', () => {
    const result = schema.validate({
      inputs: {
        requestId: 'PRIV-003', dataType: 'subscriber-records',
        processingPurpose: 'legal',
        lawEnforcementRequest: true,
      },
      outcome: { approved: true, cpniCompliant: true },
    } as any);
    expect(result.warnings.some(w => w.includes('Law enforcement'))).toBe(true);
  });
});
