/**
 * Industrial Services Vertical Deep Tests
 *
 * Tests all 10 expanded decision schemas:
 * - WorkforceDeploymentSchema
 * - MaintenanceScheduleSchema
 * - IncidentInvestigationSchema
 * - TrainingCertificationSchema
 * - ChangeOrderSchema
 * - InsuranceClaimSchema
 * - EnvironmentalAssessmentSchema
 * - QualityNCRSchema
 * - EmergencyResponseSchema
 * - JointVentureSchema
 *
 * @module __tests__/services/VerticalIndustrialServicesDeep.test
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
  WorkforceDeploymentSchema,
  MaintenanceScheduleSchema,
  IncidentInvestigationSchema,
  TrainingCertificationSchema,
  ChangeOrderSchema,
  InsuranceClaimSchema,
  EnvironmentalAssessmentSchema,
  QualityNCRSchema,
  EmergencyResponseSchema,
  JointVentureSchema,
} = await import('../../services/verticals/industrial-services/IndustrialServicesDecisionSchemasExpanded.js');

// ============================================================================
// WORKFORCE DEPLOYMENT
// ============================================================================

describe('Industrial Services — WorkforceDeploymentSchema', () => {
  let schema: InstanceType<typeof WorkforceDeploymentSchema>;
  beforeEach(() => { schema = new WorkforceDeploymentSchema(); });

  it('should validate complete deployment', () => {
    const result = schema.validate({
      inputs: { deploymentId: 'WD-001', projectId: 'PRJ-001', requiredRoles: [{ role: 'welder', count: 5 }] },
      outcome: { approved: true, riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing required roles', () => {
    const result = schema.validate({
      inputs: { deploymentId: 'WD-002', projectId: 'PRJ-002', requiredRoles: [] },
      outcome: { approved: false, riskRating: 'medium' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('required role'))).toBe(true);
  });

  it('should warn on high altitude (>3000m)', () => {
    const result = schema.validate({
      inputs: { deploymentId: 'WD-003', projectId: 'PRJ-003', requiredRoles: [{ role: 'rigger', count: 3 }], altitude: 4500 },
      outcome: { approved: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('altitude'))).toBe(true);
  });

  it('should warn on personnel gaps', () => {
    const result = schema.validate({
      inputs: { deploymentId: 'WD-004', projectId: 'PRJ-004', requiredRoles: [{ role: 'crane-op', count: 2 }] },
      outcome: { approved: true, riskRating: 'medium', gapAnalysis: [{ role: 'crane-op', required: 2, available: 1, gap: 1 }] },
    } as any);
    expect(result.warnings.some(w => w.includes('gaps'))).toBe(true);
  });

  it('should warn on personnel without medical clearance', () => {
    const result = schema.validate({
      inputs: { deploymentId: 'WD-005', projectId: 'PRJ-005', requiredRoles: [{ role: 'fitter', count: 1 }] },
      outcome: { approved: true, riskRating: 'low', assignedPersonnel: [{ name: 'John', medicalClearance: false }] },
    } as any);
    expect(result.warnings.some(w => w.includes('medical clearance'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('industrial-services');
    expect(schema.decisionType).toBe('workforce-deployment');
    expect(schema.requiredApprovers).toContain('safety-officer');
  });
});

// ============================================================================
// MAINTENANCE SCHEDULE
// ============================================================================

describe('Industrial Services — MaintenanceScheduleSchema', () => {
  let schema: InstanceType<typeof MaintenanceScheduleSchema>;
  beforeEach(() => { schema = new MaintenanceScheduleSchema(); });

  it('should validate complete maintenance schedule', () => {
    const result = schema.validate({
      inputs: { scheduleId: 'MS-001', equipmentId: 'EQ-001', maintenanceType: 'preventive', currentCondition: { overallScore: 75 } },
      outcome: { approved: true, riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing equipment ID', () => {
    const result = schema.validate({
      inputs: { scheduleId: 'MS-002', maintenanceType: 'corrective', currentCondition: {} },
      outcome: { approved: false, riskRating: 'high' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Equipment ID'))).toBe(true);
  });

  it('should warn on low condition score (<40%)', () => {
    const result = schema.validate({
      inputs: { scheduleId: 'MS-003', equipmentId: 'EQ-003', maintenanceType: 'breakdown', currentCondition: { overallScore: 25 } },
      outcome: { approved: true, riskRating: 'critical' },
    } as any);
    expect(result.warnings.some(w => w.includes('below 40%'))).toBe(true);
  });

  it('should warn on remaining life < 12 months', () => {
    const result = schema.validate({
      inputs: { scheduleId: 'MS-004', equipmentId: 'EQ-004', maintenanceType: 'predictive', currentCondition: { overallScore: 60, remainingLife: 6 } },
      outcome: { approved: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('12 months'))).toBe(true);
  });

  it('should reject deferral of regulatory-required maintenance', () => {
    const result = schema.validate({
      inputs: { scheduleId: 'MS-005', equipmentId: 'EQ-005', maintenanceType: 'regulatory', currentCondition: { overallScore: 80 }, regulatoryRequirement: true },
      outcome: { approved: false, riskRating: 'medium' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('regulatory-required'))).toBe(true);
  });

  it('should reject critical risk of deferral', () => {
    const result = schema.validate({
      inputs: { scheduleId: 'MS-006', equipmentId: 'EQ-006', maintenanceType: 'corrective', currentCondition: { overallScore: 50 } },
      outcome: { approved: true, riskRating: 'high', riskOfDeferral: 'critical' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('critical risk'))).toBe(true);
  });
});

// ============================================================================
// INCIDENT INVESTIGATION
// ============================================================================

describe('Industrial Services — IncidentInvestigationSchema', () => {
  let schema: InstanceType<typeof IncidentInvestigationSchema>;
  beforeEach(() => { schema = new IncidentInvestigationSchema(); });

  it('should validate complete investigation', () => {
    const result = schema.validate({
      inputs: { investigationId: 'INV-001', incidentId: 'INC-001', incidentType: 'near-miss', rootCauses: ['procedure-gap'] },
      outcome: { correctiveActions: ['update-sop'], riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing root causes', () => {
    const result = schema.validate({
      inputs: { investigationId: 'INV-002', incidentId: 'INC-002', incidentType: 'first-aid', rootCauses: [] },
      outcome: { correctiveActions: ['training'], riskRating: 'medium' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('root cause'))).toBe(true);
  });

  it('should reject fatality without regulatory report', () => {
    const result = schema.validate({
      inputs: { investigationId: 'INV-003', incidentId: 'INC-003', incidentType: 'fatality', rootCauses: ['equipment-failure'] },
      outcome: { correctiveActions: ['shutdown'], riskRating: 'critical', regulatoryReportRequired: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Fatality'))).toBe(true);
  });

  it('should warn on fatality requiring third-party review', () => {
    const result = schema.validate({
      inputs: { investigationId: 'INV-004', incidentId: 'INC-004', incidentType: 'fatality', rootCauses: ['fall-from-height'] },
      outcome: { correctiveActions: ['barrier-install'], riskRating: 'critical', regulatoryReportRequired: true },
    } as any);
    expect(result.warnings.some(w => w.includes('third-party'))).toBe(true);
  });

  it('should warn on lost-time injury SUNAFIL reporting', () => {
    const result = schema.validate({
      inputs: { investigationId: 'INV-005', incidentId: 'INC-005', incidentType: 'lost-time', rootCauses: ['slip'] },
      outcome: { correctiveActions: ['anti-slip'], riskRating: 'medium' },
    } as any);
    expect(result.warnings.some(w => w.includes('SUNAFIL'))).toBe(true);
  });
});

// ============================================================================
// TRAINING & CERTIFICATION
// ============================================================================

describe('Industrial Services — TrainingCertificationSchema', () => {
  let schema: InstanceType<typeof TrainingCertificationSchema>;
  beforeEach(() => { schema = new TrainingCertificationSchema(); });

  it('should validate complete training', () => {
    const result = schema.validate({
      inputs: { trainingId: 'TR-001', trainingType: 'safety', courseName: 'Confined Space Entry', targetPersonnel: [{ id: 'P1', name: 'John' }] },
      outcome: { approved: true, riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject empty target personnel', () => {
    const result = schema.validate({
      inputs: { trainingId: 'TR-002', trainingType: 'technical', courseName: 'Welding 101', targetPersonnel: [] },
      outcome: { approved: true, riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Target personnel'))).toBe(true);
  });

  it('should reject rejection of regulatory-required training', () => {
    const result = schema.validate({
      inputs: { trainingId: 'TR-003', trainingType: 'regulatory', courseName: 'H2S Awareness', targetPersonnel: [{ id: 'P2' }], regulatoryRequirement: true },
      outcome: { approved: false, riskRating: 'high' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('regulatory-required training'))).toBe(true);
  });

  it('should warn on expired certifications', () => {
    const result = schema.validate({
      inputs: {
        trainingId: 'TR-004', trainingType: 'certification', courseName: 'Crane Operation',
        targetPersonnel: [{ id: 'P3', expiringCertifications: [{ cert: 'NCCCO', expiryDate: '2020-01-01' }] }],
      },
      outcome: { approved: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('expired'))).toBe(true);
  });
});

// ============================================================================
// CHANGE ORDER
// ============================================================================

describe('Industrial Services — ChangeOrderSchema', () => {
  let schema: InstanceType<typeof ChangeOrderSchema>;
  beforeEach(() => { schema = new ChangeOrderSchema(); });

  it('should validate complete change order', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-001', projectId: 'PRJ-001', changeDescription: 'Scope addition', changeValue: 50000 },
      outcome: { approved: true, riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing change value', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-002', projectId: 'PRJ-002', changeDescription: 'Rework' },
      outcome: { approved: false, riskRating: 'medium' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Change value'))).toBe(true);
  });

  it('should warn when change > 20% of original', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-003', projectId: 'PRJ-003', changeDescription: 'Major rework', changeValue: 250000, originalValue: 1000000 },
      outcome: { approved: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('20%'))).toBe(true);
  });

  it('should reject change > 50% of original', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-004', projectId: 'PRJ-004', changeDescription: 'Complete redesign', changeValue: 600000, originalValue: 1000000 },
      outcome: { approved: true, riskRating: 'critical' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('50%'))).toBe(true);
  });

  it('should warn on safety implications', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-005', projectId: 'PRJ-005', changeDescription: 'Foundation change', changeValue: 80000, safetyImplications: ['structural-load-change'] },
      outcome: { approved: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('safety'))).toBe(true);
  });

  it('should warn on revised margin below 5%', () => {
    const result = schema.validate({
      inputs: { changeOrderId: 'CO-006', projectId: 'PRJ-006', changeDescription: 'Extra scope', changeValue: 30000 },
      outcome: { approved: true, riskRating: 'medium', revisedMargin: 0.03 },
    } as any);
    expect(result.warnings.some(w => w.includes('margin'))).toBe(true);
  });
});

// ============================================================================
// INSURANCE CLAIM
// ============================================================================

describe('Industrial Services — InsuranceClaimSchema', () => {
  let schema: InstanceType<typeof InsuranceClaimSchema>;
  beforeEach(() => { schema = new InsuranceClaimSchema(); });

  it('should validate complete claim', () => {
    const result = schema.validate({
      inputs: { claimId: 'CLM-001', policyNumber: 'POL-001', claimType: 'property-damage', claimAmount: 75000 },
      outcome: { filed: true, riskRating: 'medium' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject missing policy number', () => {
    const result = schema.validate({
      inputs: { claimId: 'CLM-002', claimType: 'injury', claimAmount: 50000 },
      outcome: { filed: false, riskRating: 'high' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Policy number'))).toBe(true);
  });

  it('should warn on high-value claim >$500K', () => {
    const result = schema.validate({
      inputs: { claimId: 'CLM-003', policyNumber: 'POL-003', claimType: 'major-loss', claimAmount: 750000 },
      outcome: { filed: true, riskRating: 'critical' },
    } as any);
    expect(result.warnings.some(w => w.includes('$500K'))).toBe(true);
  });

  it('should warn on regulatory notification without docs', () => {
    const result = schema.validate({
      inputs: { claimId: 'CLM-004', policyNumber: 'POL-004', claimType: 'environmental', claimAmount: 200000, regulatoryNotificationRequired: true, supportingDocuments: [] },
      outcome: { filed: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('supporting documents'))).toBe(true);
  });
});

// ============================================================================
// ENVIRONMENTAL ASSESSMENT
// ============================================================================

describe('Industrial Services — EnvironmentalAssessmentSchema', () => {
  let schema: InstanceType<typeof EnvironmentalAssessmentSchema>;
  beforeEach(() => { schema = new EnvironmentalAssessmentSchema(); });

  it('should validate complete assessment', () => {
    const result = schema.validate({
      inputs: { assessmentId: 'EA-001', projectId: 'PRJ-001', assessmentType: 'impact', environmentalAspects: [{ aspect: 'dust', significance: 'low' }] },
      outcome: { approved: true, riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject critical environmental impacts', () => {
    const result = schema.validate({
      inputs: { assessmentId: 'EA-002', projectId: 'PRJ-002', assessmentType: 'impact', environmentalAspects: [{ aspect: 'water-contamination', significance: 'critical' }] },
      outcome: { approved: false, riskRating: 'critical' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('critical environmental'))).toBe(true);
  });

  it('should reject emission exceedances', () => {
    const result = schema.validate({
      inputs: {
        assessmentId: 'EA-003', projectId: 'PRJ-003', assessmentType: 'monitoring',
        environmentalAspects: [{ aspect: 'air', significance: 'moderate' }],
        emissionsData: [{ pollutant: 'SO2', measured: 150, limit: 100 }],
      },
      outcome: { approved: false, riskRating: 'high' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('exceed regulatory'))).toBe(true);
  });

  it('should warn near protected areas', () => {
    const result = schema.validate({
      inputs: { assessmentId: 'EA-004', projectId: 'PRJ-004', assessmentType: 'baseline', environmentalAspects: [{ aspect: 'noise', significance: 'low' }], protectedAreas: true },
      outcome: { approved: true, riskRating: 'medium' },
    } as any);
    expect(result.warnings.some(w => w.includes('protected area'))).toBe(true);
  });
});

// ============================================================================
// QUALITY NCR
// ============================================================================

describe('Industrial Services — QualityNCRSchema', () => {
  let schema: InstanceType<typeof QualityNCRSchema>;
  beforeEach(() => { schema = new QualityNCRSchema(); });

  it('should validate complete NCR', () => {
    const result = schema.validate({
      inputs: { ncrId: 'NCR-001', ncrType: 'dimensional', description: 'Out of tolerance', severity: 'minor' },
      outcome: { disposition: 'rework', riskRating: 'low' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject critical NCR with use-as-is disposition', () => {
    const result = schema.validate({
      inputs: { ncrId: 'NCR-002', ncrType: 'material', description: 'Wrong grade', severity: 'critical' },
      outcome: { disposition: 'use-as-is', riskRating: 'high' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Critical NCR'))).toBe(true);
  });

  it('should warn on recurring NCR (3+ occurrences)', () => {
    const result = schema.validate({
      inputs: { ncrId: 'NCR-003', ncrType: 'process', description: 'Temperature deviation', severity: 'major', previousOccurrences: 4 },
      outcome: { disposition: 'rework', riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('Recurring'))).toBe(true);
  });

  it('should warn on welding NCR without reinspection', () => {
    const result = schema.validate({
      inputs: { ncrId: 'NCR-004', ncrType: 'welding', description: 'Porosity detected', severity: 'major' },
      outcome: { disposition: 'repair', riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('ASME IX'))).toBe(true);
  });
});

// ============================================================================
// EMERGENCY RESPONSE
// ============================================================================

describe('Industrial Services — EmergencyResponseSchema', () => {
  let schema: InstanceType<typeof EmergencyResponseSchema>;
  beforeEach(() => { schema = new EmergencyResponseSchema(); });

  it('should validate complete emergency response', () => {
    const result = schema.validate({
      inputs: { emergencyId: 'EM-001', emergencyType: 'fire', severity: 'level-2' },
      outcome: { responseActivated: true, riskRating: 'high' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject Level 3 without full response activation', () => {
    const result = schema.validate({
      inputs: { emergencyId: 'EM-002', emergencyType: 'chemical-spill', severity: 'level-3' },
      outcome: { responseActivated: false, riskRating: 'critical' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Level 3'))).toBe(true);
  });

  it('should reject evacuation required without status', () => {
    const result = schema.validate({
      inputs: { emergencyId: 'EM-003', emergencyType: 'gas-leak', severity: 'level-2', evacuationRequired: true },
      outcome: { responseActivated: true, riskRating: 'high' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('evacuation status'))).toBe(true);
  });

  it('should warn on environmental impact without notifications', () => {
    const result = schema.validate({
      inputs: { emergencyId: 'EM-004', emergencyType: 'oil-spill', severity: 'level-2', environmentalImpact: true },
      outcome: { responseActivated: true, riskRating: 'critical' },
    } as any);
    expect(result.warnings.some(w => w.includes('regulatory notification'))).toBe(true);
  });

  it('should warn on large number of personnel at risk', () => {
    const result = schema.validate({
      inputs: { emergencyId: 'EM-005', emergencyType: 'explosion', severity: 'level-3', personnelAtRisk: 75 },
      outcome: { responseActivated: true, riskRating: 'critical', evacuationStatus: 'in-progress' },
    } as any);
    expect(result.warnings.some(w => w.includes('mutual aid'))).toBe(true);
  });
});

// ============================================================================
// JOINT VENTURE
// ============================================================================

describe('Industrial Services — JointVentureSchema', () => {
  let schema: InstanceType<typeof JointVentureSchema>;
  beforeEach(() => { schema = new JointVentureSchema(); });

  it('should validate complete joint venture', () => {
    const result = schema.validate({
      inputs: { ventureId: 'JV-001', partnerName: 'Acme Mining', ventureType: 'incorporated', estimatedValue: 50000000, exitStrategy: 'buyout-clause' },
      outcome: { approved: true, riskRating: 'medium' },
    } as any);
    expect(result.valid).toBe(true);
  });

  it('should reject partner with fatality on record', () => {
    const result = schema.validate({
      inputs: {
        ventureId: 'JV-002', partnerName: 'DangerCo', ventureType: 'unincorporated', estimatedValue: 20000000,
        partnerAssessment: { safetyRecord: { fatalities: 2, emr: 1.5 }, financialStability: 'moderate' },
      },
      outcome: { approved: false, riskRating: 'critical' },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('fatality'))).toBe(true);
  });

  it('should warn on weak partner financial stability', () => {
    const result = schema.validate({
      inputs: {
        ventureId: 'JV-003', partnerName: 'WeakFin Corp', ventureType: 'consortium', estimatedValue: 10000000,
        partnerAssessment: { safetyRecord: { fatalities: 0, emr: 0.8 }, financialStability: 'weak' },
        exitStrategy: 'termination-clause',
      },
      outcome: { approved: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('financial stability'))).toBe(true);
  });

  it('should warn on partner EMR > 1.0', () => {
    const result = schema.validate({
      inputs: {
        ventureId: 'JV-004', partnerName: 'HighEMR Ltd', ventureType: 'incorporated', estimatedValue: 30000000,
        partnerAssessment: { safetyRecord: { fatalities: 0, emr: 1.3 }, financialStability: 'strong' },
        exitStrategy: 'buyout',
      },
      outcome: { approved: true, riskRating: 'high' },
    } as any);
    expect(result.warnings.some(w => w.includes('EMR'))).toBe(true);
  });

  it('should warn when no exit strategy defined', () => {
    const result = schema.validate({
      inputs: { ventureId: 'JV-005', partnerName: 'NoExit Inc', ventureType: 'unincorporated', estimatedValue: 15000000 },
      outcome: { approved: true, riskRating: 'medium' },
    } as any);
    expect(result.warnings.some(w => w.includes('exit strategy'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('industrial-services');
    expect(schema.decisionType).toBe('joint-venture');
    expect(schema.requiredApprovers).toContain('general-manager');
    expect(schema.requiredApprovers).toContain('legal-counsel');
    expect(schema.requiredApprovers).toContain('safety-officer');
  });
});
