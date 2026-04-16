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
    },
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

    res.json({
      overview: {
        totalFrameworks: 8,
        averageReadiness: Math.round(
          (soc2.overallScore + hipaa.overallReadiness + gdpr.overallReadiness +
           euai.overallReadiness + iso.overallReadiness + fedramp.overallReadiness +
           statePrivacy.averageScore + accessibility.overallConformance) / 8
        ),
        criticalGapsTotal:
          soc2.criticalGaps.length + hipaa.criticalGaps.length +
          gdpr.criticalGaps.length + euai.criticalGaps.length +
          iso.criticalGaps.length + fedramp.criticalGaps.length,
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

export default router;
