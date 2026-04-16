/**
 * Integration Tests — Extended Compliance Services
 *
 * Tests all 11 new compliance service categories to verify:
 * - Service instantiation and data integrity
 * - Dashboard generation
 * - Assessment workflows
 * - Readiness reports
 *
 * @module __tests__/services/compliance/ExtendedComplianceServices.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import { describe, it, expect } from 'vitest';
import { aiSpecificComplianceService } from '../../../services/compliance/AISpecificComplianceService.js';
import { internationalPrivacyService } from '../../../services/compliance/InternationalPrivacyService.js';
import { financialComplianceService } from '../../../services/compliance/FinancialComplianceService.js';
import { healthcareExtendedService } from '../../../services/compliance/HealthcareExtendedService.js';
import { governmentDefenseService } from '../../../services/compliance/GovernmentDefenseService.js';
import { antiCorruptionService } from '../../../services/compliance/AntiCorruptionService.js';
import { esgComplianceService } from '../../../services/compliance/ESGComplianceService.js';
import { euDigitalRegulationService } from '../../../services/compliance/EUDigitalRegulationService.js';
import { communicationsComplianceService } from '../../../services/compliance/CommunicationsComplianceService.js';
import { insuranceComplianceService } from '../../../services/compliance/InsuranceComplianceService.js';
import { standardsComplianceService } from '../../../services/compliance/StandardsComplianceService.js';

// ==========================================================================
// AI-SPECIFIC COMPLIANCE
// ==========================================================================
describe('AISpecificComplianceService', () => {
  it('should return all regulations', () => {
    const regs = aiSpecificComplianceService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(10);
    expect(regs[0]).toHaveProperty('code');
    expect(regs[0]).toHaveProperty('complianceScore');
  });

  it('should find regulation by code', () => {
    const reg = aiSpecificComplianceService.getRegulation('CO-AI-ACT');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('Colorado');
  });

  it('should return in-effect regulations', () => {
    const inEffect = aiSpecificComplianceService.getInEffectRegulations();
    expect(inEffect.length).toBeGreaterThan(0);
    inEffect.forEach(r => expect(r.effectiveDate).toBeDefined());
  });

  it('should generate dashboard', () => {
    const dash = aiSpecificComplianceService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
    expect(dash.averageScore).toBeGreaterThan(0);
    expect(dash).toHaveProperty('criticalGaps');
  });

  it('should conduct impact assessment', () => {
    const regs = aiSpecificComplianceService.getRegulations();
    const assessment = aiSpecificComplianceService.conductImpactAssessment({
      systemName: 'Test AI System',
      regulation: regs[0].code,
      assessor: 'CISO',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment).toHaveProperty('findings');
    expect(assessment).toHaveProperty('overallCompliance');
  });

  it('should check biometric compliance', () => {
    const result = aiSpecificComplianceService.checkBiometricCompliance({
      usesbiometrics: true,
      biometricTypes: ['fingerprint'],
      consentObtained: true,
      retentionPeriodYears: 3,
    });
    expect(result).toBeDefined();
  });

  it('should generate readiness report', () => {
    const report = aiSpecificComplianceService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
    expect(report.regulationScores.length).toBeGreaterThan(0);
  });
});

// ==========================================================================
// INTERNATIONAL PRIVACY
// ==========================================================================
describe('InternationalPrivacyService', () => {
  it('should return all privacy laws', () => {
    const laws = internationalPrivacyService.getLaws();
    expect(laws.length).toBeGreaterThanOrEqual(15);
  });

  it('should find law by code', () => {
    const law = internationalPrivacyService.getLaw('UK-GDPR');
    expect(law).toBeDefined();
    expect(law!.name).toContain('UK');
  });

  it('should return laws by country', () => {
    const laws = internationalPrivacyService.getLawsByCountry('CA');
    expect(laws.length).toBeGreaterThan(0);
  });

  it('should identify adequacy countries', () => {
    const adequacy = internationalPrivacyService.getAdequacyCountries();
    expect(adequacy.length).toBeGreaterThan(0);
  });

  it('should generate dashboard', () => {
    const dash = internationalPrivacyService.getDashboard();
    expect(dash.totalLaws).toBeGreaterThan(0);
    expect(dash.countriesCovered).toBeGreaterThan(0);
  });

  it('should assess cross-border transfer', () => {
    const assessment = internationalPrivacyService.assessCrossBorderTransfer({
      sourceCountry: 'US',
      destinationCountry: 'UK',
      dataCategories: ['personal_data'],
      legalBasis: 'SCCs',
    });
    expect(assessment).toHaveProperty('id');
    expect(assessment).toHaveProperty('riskLevel');
  });

  it('should generate readiness report', () => {
    const report = internationalPrivacyService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// FINANCIAL SERVICES
// ==========================================================================
describe('FinancialComplianceService', () => {
  it('should return all regulations', () => {
    const regs = financialComplianceService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(20);
  });

  it('should find regulation by code', () => {
    const reg = financialComplianceService.getRegulation('FCRA');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('Credit');
  });

  it('should filter by category', () => {
    const consumer = financialComplianceService.getByCategory('consumer_protection');
    expect(consumer.length).toBeGreaterThan(0);
    consumer.forEach(r => expect(r.category).toBe('consumer_protection'));
  });

  it('should generate dashboard', () => {
    const dash = financialComplianceService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
    expect(dash.byCategory).toBeDefined();
    expect(dash.byJurisdiction).toBeDefined();
  });

  it('should assess model risk', () => {
    const assessment = financialComplianceService.assessModelRisk({
      modelName: 'Credit Scoring Model v2',
      modelType: 'credit_scoring',
      regulation: 'SR-11-7',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment.findings.length).toBeGreaterThan(0);
  });

  it('should screen entity for AML', () => {
    const result = financialComplianceService.screenEntity('Test Corporation LLC');
    expect(result.id).toBeDefined();
    expect(result.listsChecked.length).toBeGreaterThan(0);
    expect(result.riskRating).toBe('clear');
  });

  it('should generate readiness report', () => {
    const report = financialComplianceService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
    expect(report.regulationScores.length).toBeGreaterThanOrEqual(20);
  });
});

// ==========================================================================
// HEALTHCARE EXTENDED
// ==========================================================================
describe('HealthcareExtendedService', () => {
  it('should return all regulations', () => {
    const regs = healthcareExtendedService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(10);
  });

  it('should find regulation by code', () => {
    const reg = healthcareExtendedService.getRegulation('STARK-LAW');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('Stark');
  });

  it('should filter by category', () => {
    const fraud = healthcareExtendedService.getByCategory('fraud_abuse');
    expect(fraud.length).toBeGreaterThan(0);
  });

  it('should generate dashboard', () => {
    const dash = healthcareExtendedService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
    expect(dash.fraudAbuseReadiness).toBeGreaterThan(0);
  });

  it('should conduct assessment', () => {
    const assessment = healthcareExtendedService.conductAssessment({
      regulationCode: 'HITECH',
      facilityType: 'hospital',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment.findings.length).toBeGreaterThan(0);
  });

  it('should generate readiness report', () => {
    const report = healthcareExtendedService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// GOVERNMENT & DEFENSE
// ==========================================================================
describe('GovernmentDefenseService', () => {
  it('should return all regulations', () => {
    const regs = governmentDefenseService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(14);
  });

  it('should find regulation by code', () => {
    const reg = governmentDefenseService.getRegulation('EO-14110');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('Executive Order');
  });

  it('should identify clearance-required frameworks', () => {
    const clearance = governmentDefenseService.getClearanceRequired();
    expect(clearance.length).toBeGreaterThan(0);
    clearance.forEach(r => expect(r.clearanceRequired).toBe(true));
  });

  it('should generate dashboard', () => {
    const dash = governmentDefenseService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
    expect(dash.atoReadiness).toBeGreaterThan(0);
  });

  it('should conduct authorization assessment', () => {
    const assessment = governmentDefenseService.conductAuthorizationAssessment({
      framework: 'FISMA',
      systemName: 'Test System',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment.readinessPercentage).toBeGreaterThan(0);
  });

  it('should generate readiness report', () => {
    const report = governmentDefenseService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// ANTI-CORRUPTION
// ==========================================================================
describe('AntiCorruptionService', () => {
  it('should return all regulations', () => {
    const regs = antiCorruptionService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(7);
  });

  it('should find regulation by code', () => {
    const reg = antiCorruptionService.getRegulation('FCPA');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('Foreign Corrupt');
  });

  it('should generate dashboard', () => {
    const dash = antiCorruptionService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
    expect(dash.byCategory).toBeDefined();
  });

  it('should conduct due diligence', () => {
    const dd = antiCorruptionService.conductDueDiligence({
      entityName: 'Acme Corp',
      entityType: 'vendor',
      country: 'GB',
    });
    expect(dd.id).toBeDefined();
    expect(dd.sanctions.length).toBeGreaterThan(0);
    expect(dd.overallRisk).toBeDefined();
  });

  it('should flag high-risk countries', () => {
    const dd = antiCorruptionService.conductDueDiligence({
      entityName: 'Test Entity',
      entityType: 'vendor',
      country: 'RU',
    });
    expect(dd.overallRisk).toBe('high');
    expect(dd.approved).toBe(false);
  });

  it('should generate readiness report', () => {
    const report = antiCorruptionService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// ESG & SUSTAINABILITY
// ==========================================================================
describe('ESGComplianceService', () => {
  it('should return all frameworks', () => {
    const fws = esgComplianceService.getFrameworks();
    expect(fws.length).toBeGreaterThanOrEqual(8);
  });

  it('should find framework by code', () => {
    const fw = esgComplianceService.getFramework('GRI');
    expect(fw).toBeDefined();
    expect(fw!.name).toContain('GRI');
  });

  it('should return mandatory frameworks', () => {
    const mandatory = esgComplianceService.getMandatoryFrameworks();
    expect(mandatory.length).toBeGreaterThan(0);
    mandatory.forEach(f => expect(f.mandatory).toBe(true));
  });

  it('should generate dashboard', () => {
    const dash = esgComplianceService.getDashboard();
    expect(dash.totalFrameworks).toBeGreaterThan(0);
    expect(dash.mandatoryCount).toBeGreaterThan(0);
  });

  it('should assess disclosure readiness', () => {
    const assessment = esgComplianceService.assessDisclosureReadiness({
      framework: 'GRI',
      reportingPeriod: '2024',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment.readinessPercentage).toBeGreaterThan(0);
  });

  it('should generate readiness report', () => {
    const report = esgComplianceService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// EU DIGITAL REGULATION
// ==========================================================================
describe('EUDigitalRegulationService', () => {
  it('should return all regulations', () => {
    const regs = euDigitalRegulationService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(6);
  });

  it('should find regulation by code', () => {
    const reg = euDigitalRegulationService.getRegulation('NIS2');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('NIS2');
  });

  it('should filter by category', () => {
    const cyber = euDigitalRegulationService.getByCategory('cybersecurity');
    expect(cyber.length).toBeGreaterThan(0);
  });

  it('should generate dashboard with NIS2 readiness', () => {
    const dash = euDigitalRegulationService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
    expect(typeof dash.nis2Ready).toBe('boolean');
  });

  it('should assess NIS2 compliance', () => {
    const assessment = euDigitalRegulationService.assessNIS2({
      entityType: 'essential',
      sector: 'digital_infrastructure',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment.measures.length).toBeGreaterThan(0);
  });

  it('should generate readiness report', () => {
    const report = euDigitalRegulationService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// COMMUNICATIONS & MARKETING
// ==========================================================================
describe('CommunicationsComplianceService', () => {
  it('should return all regulations', () => {
    const regs = communicationsComplianceService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(4);
  });

  it('should find regulation by code', () => {
    const reg = communicationsComplianceService.getRegulation('CAN-SPAM');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('CAN-SPAM');
  });

  it('should generate dashboard', () => {
    const dash = communicationsComplianceService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
  });

  it('should check marketing compliance — compliant', () => {
    const result = communicationsComplianceService.checkMarketingCompliance({
      channelType: 'email',
      targetJurisdictions: ['US'],
      hasExpressConsent: true,
      hasOptOutMechanism: true,
    });
    expect(result.compliant).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  it('should check marketing compliance — non-compliant', () => {
    const result = communicationsComplianceService.checkMarketingCompliance({
      channelType: 'phone',
      targetJurisdictions: ['US'],
      hasExpressConsent: false,
      hasOptOutMechanism: false,
    });
    expect(result.compliant).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it('should generate readiness report', () => {
    const report = communicationsComplianceService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// INSURANCE
// ==========================================================================
describe('InsuranceComplianceService', () => {
  it('should return all regulations', () => {
    const regs = insuranceComplianceService.getRegulations();
    expect(regs.length).toBeGreaterThanOrEqual(5);
  });

  it('should find regulation by code', () => {
    const reg = insuranceComplianceService.getRegulation('SOLVENCY-II');
    expect(reg).toBeDefined();
    expect(reg!.name).toContain('Solvency');
  });

  it('should filter by category', () => {
    const prudential = insuranceComplianceService.getByCategory('prudential');
    expect(prudential.length).toBeGreaterThan(0);
  });

  it('should generate dashboard', () => {
    const dash = insuranceComplianceService.getDashboard();
    expect(dash.totalRegulations).toBeGreaterThan(0);
  });

  it('should conduct assessment', () => {
    const assessment = insuranceComplianceService.conductAssessment({
      regulationCode: 'MDL-668',
      entityType: 'insurer',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment.findings.length).toBeGreaterThan(0);
  });

  it('should generate readiness report', () => {
    const report = insuranceComplianceService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
  });
});

// ==========================================================================
// STANDARDS & CERTIFICATIONS
// ==========================================================================
describe('StandardsComplianceService', () => {
  it('should return all standards', () => {
    const stds = standardsComplianceService.getStandards();
    expect(stds.length).toBeGreaterThanOrEqual(12);
  });

  it('should find standard by code', () => {
    const std = standardsComplianceService.getStandard('OWASP-TOP-10');
    expect(std).toBeDefined();
    expect(std!.name).toContain('OWASP');
  });

  it('should return certifiable standards', () => {
    const certifiable = standardsComplianceService.getCertifiable();
    expect(certifiable.length).toBeGreaterThan(0);
    certifiable.forEach(s => expect(s.certifiable).toBe(true));
  });

  it('should filter by category', () => {
    const security = standardsComplianceService.getByCategory('security');
    expect(security.length).toBeGreaterThan(0);
  });

  it('should generate dashboard', () => {
    const dash = standardsComplianceService.getDashboard();
    expect(dash.totalStandards).toBeGreaterThan(0);
    expect(dash.certifiableCount).toBeGreaterThan(0);
  });

  it('should assess standard', () => {
    const assessment = standardsComplianceService.assessStandard({
      standardCode: 'ISO-27017',
    });
    expect(assessment.id).toBeDefined();
    expect(assessment.readinessPercentage).toBeGreaterThan(0);
  });

  it('should generate readiness report', () => {
    const report = standardsComplianceService.getReadinessReport();
    expect(report.overallScore).toBeGreaterThan(0);
    expect(report.standardScores.length).toBeGreaterThan(0);
  });
});

// ==========================================================================
// CROSS-SERVICE INTEGRATION
// ==========================================================================
describe('Cross-Service Integration', () => {
  it('all 11 services should return non-zero regulation/framework counts', () => {
    expect(aiSpecificComplianceService.getRegulations().length).toBeGreaterThan(0);
    expect(internationalPrivacyService.getLaws().length).toBeGreaterThan(0);
    expect(financialComplianceService.getRegulations().length).toBeGreaterThan(0);
    expect(healthcareExtendedService.getRegulations().length).toBeGreaterThan(0);
    expect(governmentDefenseService.getRegulations().length).toBeGreaterThan(0);
    expect(antiCorruptionService.getRegulations().length).toBeGreaterThan(0);
    expect(esgComplianceService.getFrameworks().length).toBeGreaterThan(0);
    expect(euDigitalRegulationService.getRegulations().length).toBeGreaterThan(0);
    expect(communicationsComplianceService.getRegulations().length).toBeGreaterThan(0);
    expect(insuranceComplianceService.getRegulations().length).toBeGreaterThan(0);
    expect(standardsComplianceService.getStandards().length).toBeGreaterThan(0);
  });

  it('all dashboards should return valid averageScore between 0 and 100', () => {
    const dashboards = [
      aiSpecificComplianceService.getDashboard(),
      internationalPrivacyService.getDashboard(),
      financialComplianceService.getDashboard(),
      healthcareExtendedService.getDashboard(),
      governmentDefenseService.getDashboard(),
      antiCorruptionService.getDashboard(),
      esgComplianceService.getDashboard(),
      euDigitalRegulationService.getDashboard(),
      communicationsComplianceService.getDashboard(),
      insuranceComplianceService.getDashboard(),
      standardsComplianceService.getDashboard(),
    ];

    dashboards.forEach(d => {
      const score = (d as any).averageScore ?? (d as any).averageScore;
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it('total regulations across all 11 new services should exceed 100', () => {
    const total =
      aiSpecificComplianceService.getRegulations().length +
      internationalPrivacyService.getLaws().length +
      financialComplianceService.getRegulations().length +
      healthcareExtendedService.getRegulations().length +
      governmentDefenseService.getRegulations().length +
      antiCorruptionService.getRegulations().length +
      esgComplianceService.getFrameworks().length +
      euDigitalRegulationService.getRegulations().length +
      communicationsComplianceService.getRegulations().length +
      insuranceComplianceService.getRegulations().length +
      standardsComplianceService.getStandards().length;

    expect(total).toBeGreaterThan(100);
  });
});
