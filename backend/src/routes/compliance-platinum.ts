/**
 * Compliance Platinum Routes
 *
 * API endpoints for enterprise platinum compliance services:
 * SOC 2, HIPAA, GDPR, EU AI Act, ISO 27001, FedRAMP, US State Privacy, Accessibility.
 *
 * @module routes/compliance-platinum
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import { Router, Request, Response } from 'express';
import { soc2ReadinessService } from '../services/compliance/SOC2ReadinessService.js';
import { hipaaComplianceService } from '../services/compliance/HIPAAComplianceService.js';
import { gdprComplianceService } from '../services/compliance/GDPRComplianceService.js';
import { euAIActService } from '../services/compliance/EUAIActService.js';
import { iso27001ISMSService } from '../services/compliance/ISO27001ISMSService.js';
import { fedRAMPReadinessService } from '../services/compliance/FedRAMPReadinessService.js';
import { usStatePrivacyEngine } from '../services/compliance/USStatePrivacyEngine.js';
import { accessibilityComplianceService } from '../services/compliance/AccessibilityComplianceService.js';
import { aiSpecificComplianceService } from '../services/compliance/AISpecificComplianceService.js';
import { internationalPrivacyService } from '../services/compliance/InternationalPrivacyService.js';
import { financialComplianceService } from '../services/compliance/FinancialComplianceService.js';
import { healthcareExtendedService } from '../services/compliance/HealthcareExtendedService.js';
import { governmentDefenseService } from '../services/compliance/GovernmentDefenseService.js';
import { antiCorruptionService } from '../services/compliance/AntiCorruptionService.js';
import { esgComplianceService } from '../services/compliance/ESGComplianceService.js';
import { euDigitalRegulationService } from '../services/compliance/EUDigitalRegulationService.js';
import { communicationsComplianceService } from '../services/compliance/CommunicationsComplianceService.js';
import { insuranceComplianceService } from '../services/compliance/InsuranceComplianceService.js';
import { standardsComplianceService } from '../services/compliance/StandardsComplianceService.js';

const router = Router();

// =========================================================================
// HEALTH
// =========================================================================
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    services: {
      soc2: 'operational',
      hipaa: 'operational',
      gdpr: 'operational',
      euAIAct: 'operational',
      iso27001: 'operational',
      fedramp: 'operational',
      usStatePrivacy: 'operational',
      accessibility: 'operational',
      aiSpecific: 'operational',
      internationalPrivacy: 'operational',
      financial: 'operational',
      healthcareExtended: 'operational',
      governmentDefense: 'operational',
      antiCorruption: 'operational',
      esg: 'operational',
      euDigitalRegulation: 'operational',
      communications: 'operational',
      insurance: 'operational',
      standards: 'operational',
    },
    totalServices: 19,
    timestamp: new Date().toISOString(),
  });
});

// =========================================================================
// UNIFIED COMPLIANCE DASHBOARD
// =========================================================================
router.get('/dashboard', (_req: Request, res: Response) => {
  try {
    const soc2 = soc2ReadinessService.assessReadiness();
    const hipaa = hipaaComplianceService.getComplianceStatus();
    const gdpr = gdprComplianceService.getComplianceStatus();
    const euai = euAIActService.getComplianceStatus();
    const iso = iso27001ISMSService.getComplianceStatus();
    const fedramp = fedRAMPReadinessService.getComplianceStatus();
    const statePrivacy = usStatePrivacyEngine.getComplianceSummary();
    const accessibility = accessibilityComplianceService.getComplianceStatus();

    // New service dashboards
    const aiSpecific = aiSpecificComplianceService.getDashboard();
    const intlPrivacy = internationalPrivacyService.getDashboard();
    const financial = financialComplianceService.getDashboard();
    const hcExtended = healthcareExtendedService.getDashboard();
    const govDefense = governmentDefenseService.getDashboard();
    const antiCorruption = antiCorruptionService.getDashboard();
    const esgDash = esgComplianceService.getDashboard();
    const euDigital = euDigitalRegulationService.getDashboard();
    const comms = communicationsComplianceService.getDashboard();
    const insurance = insuranceComplianceService.getDashboard();
    const standards = standardsComplianceService.getDashboard();

    const allScores = [
      soc2.overallScore, hipaa.overallReadiness, gdpr.overallReadiness,
      euai.overallReadiness, iso.overallReadiness, fedramp.overallReadiness,
      statePrivacy.averageScore, accessibility.overallConformance,
      aiSpecific.averageScore, intlPrivacy.averageScore, financial.averageScore,
      hcExtended.averageScore, govDefense.averageScore, antiCorruption.averageScore,
      esgDash.averageScore, euDigital.averageScore, comms.averageScore,
      insurance.averageScore, standards.averageScore,
    ];

    res.json({
      overview: {
        totalServiceCategories: 19,
        totalFrameworksCovered: 214,
        averageReadiness: Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length),
        criticalGapsTotal:
          soc2.criticalGaps.length + hipaa.criticalGaps.length +
          gdpr.criticalGaps.length + euai.criticalGaps.length +
          iso.criticalGaps.length + fedramp.criticalGaps.length +
          aiSpecific.criticalGaps.length + intlPrivacy.criticalGaps.length +
          financial.criticalGaps.length + hcExtended.criticalGaps.length +
          govDefense.criticalGaps.length + antiCorruption.criticalGaps.length +
          esgDash.criticalGaps.length + euDigital.criticalGaps.length +
          comms.criticalGaps.length + insurance.criticalGaps.length +
          standards.criticalGaps.length,
        grade: 'platinum',
      },
      frameworks: {
        soc2: { readiness: soc2.overallScore, type: soc2.reportType, gaps: soc2.criticalGaps.length },
        hipaa: { readiness: hipaa.overallReadiness, retentionCompliant: hipaa.retentionCompliant, gaps: hipaa.criticalGaps.length },
        gdpr: { readiness: gdpr.overallReadiness, dpoAppointed: gdpr.dpoAppointed, ropaComplete: gdpr.ropaComplete, gaps: gdpr.criticalGaps.length },
        euAIAct: { readiness: euai.overallReadiness, classifiedSystems: euai.classifiedSystems, prohibited: euai.prohibitedSystemsDetected, gaps: euai.criticalGaps.length },
        iso27001: { readiness: iso.overallReadiness, certificationStatus: iso.certificationStatus, gaps: iso.criticalGaps.length },
        fedramp: { readiness: fedramp.overallReadiness, targetLevel: fedramp.targetImpactLevel, openPOAMs: fedramp.openPOAMs, gaps: fedramp.criticalGaps.length },
        usStatePrivacy: { statesTracked: statePrivacy.totalStates, effectiveStates: statePrivacy.effectiveStates, averageScore: statePrivacy.averageScore },
        accessibility: { conformance: accessibility.overallConformance, targetLevel: accessibility.targetLevel, knownIssues: accessibility.knownIssues.length },
        aiSpecific: { regulations: aiSpecific.totalRegulations, inEffect: aiSpecific.inEffect, averageScore: aiSpecific.averageScore, gaps: aiSpecific.criticalGaps.length },
        internationalPrivacy: { laws: intlPrivacy.totalLaws, countries: intlPrivacy.countriesCovered, averageScore: intlPrivacy.averageScore, adequacy: intlPrivacy.adequacyCountries },
        financial: { regulations: financial.totalRegulations, averageScore: financial.averageScore, gaps: financial.criticalGaps.length },
        healthcareExtended: { regulations: hcExtended.totalRegulations, averageScore: hcExtended.averageScore, fraudAbuseReadiness: hcExtended.fraudAbuseReadiness },
        governmentDefense: { regulations: govDefense.totalRegulations, averageScore: govDefense.averageScore, atoReadiness: govDefense.atoReadiness, clearanceRequired: govDefense.clearanceRequired },
        antiCorruption: { regulations: antiCorruption.totalRegulations, averageScore: antiCorruption.averageScore, gaps: antiCorruption.criticalGaps.length },
        esg: { frameworks: esgDash.totalFrameworks, mandatory: esgDash.mandatoryCount, averageScore: esgDash.averageScore, gaps: esgDash.criticalGaps.length },
        euDigitalRegulation: { regulations: euDigital.totalRegulations, averageScore: euDigital.averageScore, nis2Ready: euDigital.nis2Ready },
        communications: { regulations: comms.totalRegulations, averageScore: comms.averageScore, gaps: comms.criticalGaps.length },
        insurance: { regulations: insurance.totalRegulations, averageScore: insurance.averageScore, gaps: insurance.criticalGaps.length },
        standards: { standards: standards.totalStandards, certifiable: standards.certifiableCount, averageScore: standards.averageScore, gaps: standards.criticalGaps.length },
      },
      assessedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate compliance dashboard', details: error.message });
  }
});

// =========================================================================
// SOC 2
// =========================================================================
router.get('/soc2/readiness', (req: Request, res: Response) => {
  const reportType = (req.query.type as string) === 'type_ii' ? 'type_ii' : 'type_i';
  res.json(soc2ReadinessService.assessReadiness(reportType as any));
});

router.get('/soc2/system-description', (_req: Request, res: Response) => {
  res.json(soc2ReadinessService.generateSystemDescription());
});

router.get('/soc2/controls', (req: Request, res: Response) => {
  const category = req.query.category as string;
  if (category) {
    res.json(soc2ReadinessService.getControlsByCategory(category as any));
  } else {
    res.json(soc2ReadinessService.getControls());
  }
});

router.get('/soc2/gaps', (_req: Request, res: Response) => {
  res.json(soc2ReadinessService.getGaps());
});

// =========================================================================
// HIPAA
// =========================================================================
router.get('/hipaa/status', (_req: Request, res: Response) => {
  res.json(hipaaComplianceService.getComplianceStatus());
});

router.get('/hipaa/safeguards', (_req: Request, res: Response) => {
  res.json(hipaaComplianceService.getSafeguards());
});

router.get('/hipaa/baas', (_req: Request, res: Response) => {
  res.json(hipaaComplianceService.getBAAs());
});

router.post('/hipaa/baas', (req: Request, res: Response) => {
  try {
    const baa = hipaaComplianceService.addBAA(req.body);
    res.status(201).json(baa);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/hipaa/risk-assessment', (req: Request, res: Response) => {
  const { assessor, scope } = req.body;
  if (!assessor || !scope) {
    res.status(400).json({ error: 'assessor and scope are required' });
    return;
  }
  const assessment = hipaaComplianceService.conductRiskAssessment(assessor, scope);
  res.status(201).json(assessment);
});

router.get('/hipaa/risk-assessments', (_req: Request, res: Response) => {
  res.json(hipaaComplianceService.getRiskAssessments());
});

router.get('/hipaa/breach-log', (_req: Request, res: Response) => {
  res.json(hipaaComplianceService.getBreachLog());
});

// =========================================================================
// GDPR
// =========================================================================
router.get('/gdpr/status', (_req: Request, res: Response) => {
  res.json(gdprComplianceService.getComplianceStatus());
});

router.get('/gdpr/dpo', (_req: Request, res: Response) => {
  const dpo = gdprComplianceService.getDPO();
  if (dpo) {
    res.json(dpo);
  } else {
    res.json({ appointed: false, message: 'No DPO appointed yet' });
  }
});

router.post('/gdpr/dpo', (req: Request, res: Response) => {
  gdprComplianceService.appointDPO(req.body);
  res.status(201).json({ message: 'DPO appointed', dpo: gdprComplianceService.getDPO() });
});

router.get('/gdpr/ropa', (_req: Request, res: Response) => {
  res.json(gdprComplianceService.getROPA());
});

router.post('/gdpr/ropa', (req: Request, res: Response) => {
  try {
    const entry = gdprComplianceService.addROPAEntry(req.body);
    res.status(201).json(entry);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/gdpr/dpias', (_req: Request, res: Response) => {
  res.json(gdprComplianceService.getDPIAs());
});

router.post('/gdpr/dpias', (req: Request, res: Response) => {
  const { processingActivity, assessor } = req.body;
  if (!processingActivity || !assessor) {
    res.status(400).json({ error: 'processingActivity and assessor are required' });
    return;
  }
  const dpia = gdprComplianceService.conductDPIA(processingActivity, assessor);
  res.status(201).json(dpia);
});

router.get('/gdpr/cookie-config', (_req: Request, res: Response) => {
  res.json(gdprComplianceService.getCookieConfig());
});

router.get('/gdpr/dsr-requests', (_req: Request, res: Response) => {
  res.json(gdprComplianceService.getDSRRequests());
});

router.post('/gdpr/dsr-requests', (req: Request, res: Response) => {
  try {
    const dsr = gdprComplianceService.submitDSR({
      ...req.body,
      receivedDate: new Date(req.body.receivedDate || Date.now()),
      verifiedDate: req.body.verifiedDate ? new Date(req.body.verifiedDate) : null,
      denialReason: req.body.denialReason || null,
    });
    res.status(201).json(dsr);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// =========================================================================
// EU AI ACT
// =========================================================================
router.get('/eu-ai-act/status', (_req: Request, res: Response) => {
  res.json(euAIActService.getComplianceStatus());
});

router.get('/eu-ai-act/classifications', (_req: Request, res: Response) => {
  res.json(euAIActService.getClassifications());
});

router.post('/eu-ai-act/classify', (req: Request, res: Response) => {
  try {
    const classification = euAIActService.classifySystem(req.body);
    res.status(201).json(classification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/eu-ai-act/conformity-assessment/:systemId', (req: Request, res: Response) => {
  try {
    const { assessor } = req.body;
    const assessment = euAIActService.conductConformityAssessment(req.params.systemId, assessor || 'CISO');
    res.status(201).json(assessment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/eu-ai-act/assessments', (_req: Request, res: Response) => {
  res.json(euAIActService.getAssessments());
});

router.get('/eu-ai-act/technical-documentation/:systemId', (req: Request, res: Response) => {
  try {
    const doc = euAIActService.generateTechnicalDocumentation(req.params.systemId);
    res.json(doc);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// =========================================================================
// ISO 27001
// =========================================================================
router.get('/iso27001/status', (_req: Request, res: Response) => {
  res.json(iso27001ISMSService.getComplianceStatus());
});

router.get('/iso27001/isms', (_req: Request, res: Response) => {
  res.json(iso27001ISMSService.generateISMSDocument());
});

router.get('/iso27001/soa', (_req: Request, res: Response) => {
  res.json(iso27001ISMSService.generateSoA());
});

router.get('/iso27001/controls', (_req: Request, res: Response) => {
  res.json(iso27001ISMSService.getControls());
});

router.post('/iso27001/certification-body', (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Certification body name is required' });
    return;
  }
  iso27001ISMSService.setCertificationBody(name);
  res.json({ message: `Certification body set to: ${name}`, status: 'stage_1_prep' });
});

// =========================================================================
// FEDRAMP
// =========================================================================
router.get('/fedramp/status', (_req: Request, res: Response) => {
  res.json(fedRAMPReadinessService.getComplianceStatus());
});

router.get('/fedramp/ssp', (_req: Request, res: Response) => {
  res.json(fedRAMPReadinessService.generateSSPOutline());
});

router.get('/fedramp/controls', (_req: Request, res: Response) => {
  res.json(fedRAMPReadinessService.getControls());
});

router.get('/fedramp/poam', (_req: Request, res: Response) => {
  res.json(fedRAMPReadinessService.getPOAM());
});

// =========================================================================
// US STATE PRIVACY
// =========================================================================
router.get('/us-state-privacy/laws', (_req: Request, res: Response) => {
  res.json(usStatePrivacyEngine.getLaws());
});

router.get('/us-state-privacy/effective', (_req: Request, res: Response) => {
  res.json(usStatePrivacyEngine.getEffectiveLaws());
});

router.get('/us-state-privacy/summary', (_req: Request, res: Response) => {
  res.json(usStatePrivacyEngine.getComplianceSummary());
});

router.get('/us-state-privacy/assessment', (_req: Request, res: Response) => {
  res.json(usStatePrivacyEngine.assessCompliance());
});

router.get('/us-state-privacy/gpc-required', (_req: Request, res: Response) => {
  res.json(usStatePrivacyEngine.getGPCRequiredStates());
});

router.get('/us-state-privacy/law/:code', (req: Request, res: Response) => {
  const law = usStatePrivacyEngine.getLawByCode(req.params.code);
  if (law) {
    res.json(law);
  } else {
    res.status(404).json({ error: `Law ${req.params.code} not found` });
  }
});

// =========================================================================
// ACCESSIBILITY
// =========================================================================
router.get('/accessibility/status', (_req: Request, res: Response) => {
  res.json(accessibilityComplianceService.getComplianceStatus());
});

router.get('/accessibility/vpat', (_req: Request, res: Response) => {
  res.json(accessibilityComplianceService.generateVPAT());
});

router.get('/accessibility/criteria', (_req: Request, res: Response) => {
  res.json(accessibilityComplianceService.getCriteria());
});

router.get('/accessibility/issues', (_req: Request, res: Response) => {
  res.json(accessibilityComplianceService.getKnownIssues());
});

// =========================================================================
// AI-SPECIFIC COMPLIANCE (Category A)
// =========================================================================
router.get('/ai-specific/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: aiSpecificComplianceService.getRegulations() });
});

router.get('/ai-specific/regulation/:code', (req: Request, res: Response) => {
  const reg = aiSpecificComplianceService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `Regulation ${req.params.code} not found` }); }
});

router.get('/ai-specific/in-effect', (_req: Request, res: Response) => {
  res.json({ success: true, data: aiSpecificComplianceService.getInEffectRegulations() });
});

router.get('/ai-specific/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: aiSpecificComplianceService.getDashboard() });
});

router.post('/ai-specific/impact-assessment', (req: Request, res: Response) => {
  try {
    const assessment = aiSpecificComplianceService.conductImpactAssessment(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
});

router.get('/ai-specific/assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: aiSpecificComplianceService.getAssessments() });
});

router.post('/ai-specific/biometric-check', (req: Request, res: Response) => {
  const result = aiSpecificComplianceService.checkBiometricCompliance(req.body);
  res.json({ success: true, data: result });
});

router.get('/ai-specific/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: aiSpecificComplianceService.getReadinessReport() });
});

// =========================================================================
// INTERNATIONAL PRIVACY (Category C)
// =========================================================================
router.get('/intl-privacy/laws', (_req: Request, res: Response) => {
  res.json({ success: true, data: internationalPrivacyService.getLaws() });
});

router.get('/intl-privacy/law/:code', (req: Request, res: Response) => {
  const law = internationalPrivacyService.getLaw(req.params.code);
  if (law) { res.json({ success: true, data: law }); }
  else { res.status(404).json({ success: false, error: `Privacy law ${req.params.code} not found` }); }
});

router.get('/intl-privacy/country/:code', (req: Request, res: Response) => {
  res.json({ success: true, data: internationalPrivacyService.getLawsByCountry(req.params.code) });
});

router.get('/intl-privacy/adequacy', (_req: Request, res: Response) => {
  res.json({ success: true, data: internationalPrivacyService.getAdequacyCountries() });
});

router.get('/intl-privacy/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: internationalPrivacyService.getDashboard() });
});

router.post('/intl-privacy/transfer-assessment', (req: Request, res: Response) => {
  const assessment = internationalPrivacyService.assessCrossBorderTransfer(req.body);
  res.json({ success: true, data: assessment });
});

router.get('/intl-privacy/transfer-assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: internationalPrivacyService.getTransferAssessments() });
});

router.get('/intl-privacy/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: internationalPrivacyService.getReadinessReport() });
});

// =========================================================================
// FINANCIAL SERVICES (Category D)
// =========================================================================
router.get('/financial/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: financialComplianceService.getRegulations() });
});

router.get('/financial/regulation/:code', (req: Request, res: Response) => {
  const reg = financialComplianceService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `Financial regulation ${req.params.code} not found` }); }
});

router.get('/financial/category/:category', (req: Request, res: Response) => {
  res.json({ success: true, data: financialComplianceService.getByCategory(req.params.category) });
});

router.get('/financial/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: financialComplianceService.getDashboard() });
});

router.post('/financial/model-risk-assessment', (req: Request, res: Response) => {
  const assessment = financialComplianceService.assessModelRisk(req.body);
  res.status(201).json({ success: true, data: assessment });
});

router.get('/financial/model-assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: financialComplianceService.getModelAssessments() });
});

router.post('/financial/aml-screening', (req: Request, res: Response) => {
  const { entityName } = req.body;
  if (!entityName) { res.status(400).json({ success: false, error: 'entityName is required' }); return; }
  const result = financialComplianceService.screenEntity(entityName);
  res.json({ success: true, data: result });
});

router.get('/financial/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: financialComplianceService.getReadinessReport() });
});

// =========================================================================
// HEALTHCARE EXTENDED (Category E)
// =========================================================================
router.get('/healthcare-ext/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: healthcareExtendedService.getRegulations() });
});

router.get('/healthcare-ext/regulation/:code', (req: Request, res: Response) => {
  const reg = healthcareExtendedService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `Healthcare regulation ${req.params.code} not found` }); }
});

router.get('/healthcare-ext/category/:category', (req: Request, res: Response) => {
  res.json({ success: true, data: healthcareExtendedService.getByCategory(req.params.category) });
});

router.get('/healthcare-ext/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: healthcareExtendedService.getDashboard() });
});

router.post('/healthcare-ext/assessment', (req: Request, res: Response) => {
  try {
    const assessment = healthcareExtendedService.conductAssessment(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
});

router.get('/healthcare-ext/assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: healthcareExtendedService.getAssessments() });
});

router.get('/healthcare-ext/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: healthcareExtendedService.getReadinessReport() });
});

// =========================================================================
// GOVERNMENT & DEFENSE (Category F)
// =========================================================================
router.get('/gov-defense/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: governmentDefenseService.getRegulations() });
});

router.get('/gov-defense/regulation/:code', (req: Request, res: Response) => {
  const reg = governmentDefenseService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `Gov/Defense regulation ${req.params.code} not found` }); }
});

router.get('/gov-defense/category/:category', (req: Request, res: Response) => {
  res.json({ success: true, data: governmentDefenseService.getByCategory(req.params.category) });
});

router.get('/gov-defense/clearance-required', (_req: Request, res: Response) => {
  res.json({ success: true, data: governmentDefenseService.getClearanceRequired() });
});

router.get('/gov-defense/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: governmentDefenseService.getDashboard() });
});

router.post('/gov-defense/authorization-assessment', (req: Request, res: Response) => {
  try {
    const assessment = governmentDefenseService.conductAuthorizationAssessment(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
});

router.get('/gov-defense/assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: governmentDefenseService.getAssessments() });
});

router.get('/gov-defense/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: governmentDefenseService.getReadinessReport() });
});

// =========================================================================
// ANTI-CORRUPTION (Category H)
// =========================================================================
router.get('/anti-corruption/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: antiCorruptionService.getRegulations() });
});

router.get('/anti-corruption/regulation/:code', (req: Request, res: Response) => {
  const reg = antiCorruptionService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `Anti-corruption regulation ${req.params.code} not found` }); }
});

router.get('/anti-corruption/category/:category', (req: Request, res: Response) => {
  res.json({ success: true, data: antiCorruptionService.getByCategory(req.params.category) });
});

router.get('/anti-corruption/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: antiCorruptionService.getDashboard() });
});

router.post('/anti-corruption/due-diligence', (req: Request, res: Response) => {
  const dd = antiCorruptionService.conductDueDiligence(req.body);
  res.status(201).json({ success: true, data: dd });
});

router.get('/anti-corruption/due-diligence-records', (_req: Request, res: Response) => {
  res.json({ success: true, data: antiCorruptionService.getDueDiligenceRecords() });
});

router.get('/anti-corruption/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: antiCorruptionService.getReadinessReport() });
});

// =========================================================================
// ESG & SUSTAINABILITY (Category I)
// =========================================================================
router.get('/esg/frameworks', (_req: Request, res: Response) => {
  res.json({ success: true, data: esgComplianceService.getFrameworks() });
});

router.get('/esg/framework/:code', (req: Request, res: Response) => {
  const fw = esgComplianceService.getFramework(req.params.code);
  if (fw) { res.json({ success: true, data: fw }); }
  else { res.status(404).json({ success: false, error: `ESG framework ${req.params.code} not found` }); }
});

router.get('/esg/mandatory', (_req: Request, res: Response) => {
  res.json({ success: true, data: esgComplianceService.getMandatoryFrameworks() });
});

router.get('/esg/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: esgComplianceService.getDashboard() });
});

router.post('/esg/disclosure-assessment', (req: Request, res: Response) => {
  try {
    const assessment = esgComplianceService.assessDisclosureReadiness(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
});

router.get('/esg/assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: esgComplianceService.getAssessments() });
});

router.get('/esg/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: esgComplianceService.getReadinessReport() });
});

// =========================================================================
// EU DIGITAL REGULATION (Category J)
// =========================================================================
router.get('/eu-digital/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: euDigitalRegulationService.getRegulations() });
});

router.get('/eu-digital/regulation/:code', (req: Request, res: Response) => {
  const reg = euDigitalRegulationService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `EU digital regulation ${req.params.code} not found` }); }
});

router.get('/eu-digital/category/:category', (req: Request, res: Response) => {
  res.json({ success: true, data: euDigitalRegulationService.getByCategory(req.params.category) });
});

router.get('/eu-digital/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: euDigitalRegulationService.getDashboard() });
});

router.post('/eu-digital/nis2-assessment', (req: Request, res: Response) => {
  const assessment = euDigitalRegulationService.assessNIS2(req.body);
  res.status(201).json({ success: true, data: assessment });
});

router.get('/eu-digital/assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: euDigitalRegulationService.getAssessments() });
});

router.get('/eu-digital/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: euDigitalRegulationService.getReadinessReport() });
});

// =========================================================================
// COMMUNICATIONS & MARKETING (Category K)
// =========================================================================
router.get('/communications/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: communicationsComplianceService.getRegulations() });
});

router.get('/communications/regulation/:code', (req: Request, res: Response) => {
  const reg = communicationsComplianceService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `Communications regulation ${req.params.code} not found` }); }
});

router.get('/communications/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: communicationsComplianceService.getDashboard() });
});

router.post('/communications/marketing-check', (req: Request, res: Response) => {
  const result = communicationsComplianceService.checkMarketingCompliance(req.body);
  res.json({ success: true, data: result });
});

router.get('/communications/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: communicationsComplianceService.getReadinessReport() });
});

// =========================================================================
// INSURANCE (Category L)
// =========================================================================
router.get('/insurance/regulations', (_req: Request, res: Response) => {
  res.json({ success: true, data: insuranceComplianceService.getRegulations() });
});

router.get('/insurance/regulation/:code', (req: Request, res: Response) => {
  const reg = insuranceComplianceService.getRegulation(req.params.code);
  if (reg) { res.json({ success: true, data: reg }); }
  else { res.status(404).json({ success: false, error: `Insurance regulation ${req.params.code} not found` }); }
});

router.get('/insurance/category/:category', (req: Request, res: Response) => {
  res.json({ success: true, data: insuranceComplianceService.getByCategory(req.params.category) });
});

router.get('/insurance/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: insuranceComplianceService.getDashboard() });
});

router.post('/insurance/assessment', (req: Request, res: Response) => {
  try {
    const assessment = insuranceComplianceService.conductAssessment(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
});

router.get('/insurance/assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: insuranceComplianceService.getAssessments() });
});

router.get('/insurance/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: insuranceComplianceService.getReadinessReport() });
});

// =========================================================================
// STANDARDS & CERTIFICATIONS (Category M)
// =========================================================================
router.get('/standards/list', (_req: Request, res: Response) => {
  res.json({ success: true, data: standardsComplianceService.getStandards() });
});

router.get('/standards/standard/:code', (req: Request, res: Response) => {
  const std = standardsComplianceService.getStandard(req.params.code);
  if (std) { res.json({ success: true, data: std }); }
  else { res.status(404).json({ success: false, error: `Standard ${req.params.code} not found` }); }
});

router.get('/standards/certifiable', (_req: Request, res: Response) => {
  res.json({ success: true, data: standardsComplianceService.getCertifiable() });
});

router.get('/standards/category/:category', (req: Request, res: Response) => {
  res.json({ success: true, data: standardsComplianceService.getByCategory(req.params.category) });
});

router.get('/standards/dashboard', (_req: Request, res: Response) => {
  res.json({ success: true, data: standardsComplianceService.getDashboard() });
});

router.post('/standards/assessment', (req: Request, res: Response) => {
  try {
    const assessment = standardsComplianceService.assessStandard(req.body);
    res.status(201).json({ success: true, data: assessment });
  } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
});

router.get('/standards/assessments', (_req: Request, res: Response) => {
  res.json({ success: true, data: standardsComplianceService.getAssessments() });
});

router.get('/standards/readiness', (_req: Request, res: Response) => {
  res.json({ success: true, data: standardsComplianceService.getReadinessReport() });
});

export default router;
