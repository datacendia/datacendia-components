/**
 * ISO 27001 ISMS Service
 *
 * Manages ISO 27001:2022 Information Security Management System:
 * Statement of Applicability (SoA), Annex A controls mapping,
 * risk treatment plans, and certification readiness.
 *
 * @module services/compliance/ISO27001ISMSService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export type ControlStatus = 'implemented' | 'partially_implemented' | 'planned' | 'not_applicable';

export interface AnnexAControl {
  id: string;
  clause: string;
  title: string;
  category: string;
  status: ControlStatus;
  justification: string;
  implementation: string;
  evidence: string[];
  riskTreatment: string;
  owner: string;
}

export interface ISMSDocument {
  title: string;
  version: string;
  scope: string;
  context: {
    internalIssues: string[];
    externalIssues: string[];
    interestedParties: Array<{ party: string; requirements: string[] }>;
  };
  leadership: {
    commitment: string;
    policy: string;
    rolesAndResponsibilities: Array<{ role: string; responsibilities: string[] }>;
  };
  riskAssessment: {
    methodology: string;
    criteria: string;
    treatmentOptions: string[];
  };
  objectives: Array<{
    objective: string;
    measurable: boolean;
    responsible: string;
    timeframe: string;
  }>;
  generatedAt: Date;
  hash: string;
}

export interface ISO27001Status {
  overallReadiness: number;
  controlCoverage: number;
  annexAScores: Record<string, number>;
  totalControls: number;
  implementedControls: number;
  partialControls: number;
  plannedControls: number;
  naControls: number;
  ismsDocumented: boolean;
  soaGenerated: boolean;
  certificationBody: string | null;
  certificationStatus: 'not_started' | 'stage_1_prep' | 'stage_1_complete' | 'stage_2_prep' | 'stage_2_complete' | 'certified';
  criticalGaps: string[];
  assessedAt: Date;
}

// ISO 27001:2022 Annex A Controls (93 controls in 4 themes)
const ANNEX_A_CONTROLS: AnnexAControl[] = [
  // ===== A.5 Organizational Controls (37 controls) =====
  { id: 'A.5.1', clause: '5.1', title: 'Policies for information security', category: 'Organizational',
    status: 'implemented', justification: 'Required — InfoSec policy established',
    implementation: 'Information Security Policy document published; reviewed annually.',
    evidence: ['INFORMATION_SECURITY_POLICY.md'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.2', clause: '5.2', title: 'Information security roles and responsibilities', category: 'Organizational',
    status: 'implemented', justification: 'Required — roles defined in RBAC',
    implementation: 'Casbin RBAC with defined roles (OWNER, ADMIN, USER). Security responsibilities documented.',
    evidence: ['casbin.ts', 'INFORMATION_SECURITY_POLICY.md'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.3', clause: '5.3', title: 'Segregation of duties', category: 'Organizational',
    status: 'implemented', justification: 'Required — prevents fraud and errors',
    implementation: 'RBAC enforces separation of duties; admin actions require elevated permissions.',
    evidence: ['casbin.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.4', clause: '5.4', title: 'Management responsibilities', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'Owner oversight; compliance dashboard; periodic reviews.',
    evidence: ['ComplianceDashboardService.ts'], riskTreatment: 'Risk reduction', owner: 'CEO' },
  { id: 'A.5.5', clause: '5.5', title: 'Contact with authorities', category: 'Organizational',
    status: 'partially_implemented', justification: 'Required for incident reporting',
    implementation: 'Incident response plan includes authority contact procedures.',
    evidence: ['INCIDENT_RESPONSE_PLAN.md'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.7', clause: '5.7', title: 'Threat intelligence', category: 'Organizational',
    status: 'partially_implemented', justification: 'Required for proactive defense',
    implementation: 'Dependency vulnerability scanning; canary tripwires for detection.',
    evidence: ['CanaryTripwireService.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.8', clause: '5.8', title: 'Information security in project management', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'Security review in PR process; compliance checks in CI/CD.',
    evidence: ['Git PR history'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.5.9', clause: '5.9', title: 'Inventory of information and other associated assets', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'Data source inventory; service catalog; framework registry.',
    evidence: ['frameworks.ts', 'DataSourcesPage.tsx'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.5.10', clause: '5.10', title: 'Acceptable use of information and other associated assets', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'ComplianceEnforcer blocks prohibited actions; data classification enforced.',
    evidence: ['ComplianceEnforcer.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.12', clause: '5.12', title: 'Classification of information', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'PII detection and classification; data sensitivity levels enforced.',
    evidence: ['PIIDetector.ts', 'DATA_CLASSIFICATION_POLICY.md'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.13', clause: '5.13', title: 'Labelling of information', category: 'Organizational',
    status: 'partially_implemented', justification: 'Required',
    implementation: 'PII types labeled in detection; formal labeling procedures being implemented.',
    evidence: ['PIIDetector.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.14', clause: '5.14', title: 'Information transfer', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'TLS 1.3 for all transfers; API authentication required; data diode for sensitive ingest.',
    evidence: ['headers.ts', 'DataDiodeService.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.5.15', clause: '5.15', title: 'Access control', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'Casbin RBAC; JWT authentication; minimum necessary principle.',
    evidence: ['casbin.ts', 'auth.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.16', clause: '5.16', title: 'Identity management', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'Unique user IDs; email verification; admin provisioning workflow.',
    evidence: ['auth.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.5.17', clause: '5.17', title: 'Authentication information', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'bcrypt password hashing; JWT tokens; configurable session duration.',
    evidence: ['auth.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.5.23', clause: '5.23', title: 'Information security for use of cloud services', category: 'Organizational',
    status: 'implemented', justification: 'Required — sovereign architecture',
    implementation: 'Sovereign-first: no mandatory cloud dependencies. Customer-owned infrastructure.',
    evidence: ['Architecture documentation'], riskTreatment: 'Risk avoidance', owner: 'CTO' },
  { id: 'A.5.24', clause: '5.24', title: 'Information security incident management planning and preparation', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'Incident response plan; automated detection; escalation procedures.',
    evidence: ['INCIDENT_RESPONSE_PLAN.md'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.25', clause: '5.25', title: 'Assessment and decision on information security events', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'ComplianceEnforcer severity classification; automated risk level calculation.',
    evidence: ['ComplianceEnforcer.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.26', clause: '5.26', title: 'Response to information security incidents', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'Automated blocking of critical violations; incident response procedures.',
    evidence: ['ComplianceEnforcer.ts', 'INCIDENT_RESPONSE_PLAN.md'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.28', clause: '5.28', title: 'Collection of evidence', category: 'Organizational',
    status: 'implemented', justification: 'Required for forensics',
    implementation: 'Immutable audit ledger; Merkle tree evidence chains; SHA-256 integrity.',
    evidence: ['CendiaAuditService.ts', 'DecisionDNAService.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.29', clause: '5.29', title: 'Information security during disruption', category: 'Organizational',
    status: 'partially_implemented', justification: 'Required',
    implementation: 'BCP/DR plan drafted; deterministic replay for recovery.',
    evidence: ['BCP_DR_PLAN.md', 'DeterministicReplayService.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.30', clause: '5.30', title: 'ICT readiness for business continuity', category: 'Organizational',
    status: 'partially_implemented', justification: 'Required',
    implementation: 'Health check endpoints; graceful degradation; backup strategy.',
    evidence: ['health.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.5.31', clause: '5.31', title: 'Legal, statutory, regulatory and contractual requirements', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: '190+ regulatory frameworks tracked; automated compliance enforcement.',
    evidence: ['frameworks.ts', 'ComplianceEnforcer.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.5.34', clause: '5.34', title: 'Privacy and protection of PII', category: 'Organizational',
    status: 'implemented', justification: 'Required',
    implementation: 'PII detection; GDPR/HIPAA controls; privacy policy; cookie consent.',
    evidence: ['PIIDetector.ts', 'GDPRComplianceService.ts', 'HIPAAComplianceService.ts'], riskTreatment: 'Risk reduction', owner: 'DPO' },
  // ===== A.6 People Controls (8 controls) =====
  { id: 'A.6.1', clause: '6.1', title: 'Screening', category: 'People',
    status: 'partially_implemented', justification: 'Required',
    implementation: 'Background check policy established. Process being formalized.',
    evidence: [], riskTreatment: 'Risk reduction', owner: 'HR' },
  { id: 'A.6.2', clause: '6.2', title: 'Terms and conditions of employment', category: 'People',
    status: 'implemented', justification: 'Required',
    implementation: 'Security obligations in employment agreements; NDA requirements.',
    evidence: [], riskTreatment: 'Risk reduction', owner: 'HR' },
  { id: 'A.6.3', clause: '6.3', title: 'Information security awareness, education and training', category: 'People',
    status: 'partially_implemented', justification: 'Required',
    implementation: 'Technical security awareness built into platform. Formal training program in development.',
    evidence: [], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.6.5', clause: '6.5', title: 'Responsibilities after termination or change of employment', category: 'People',
    status: 'implemented', justification: 'Required',
    implementation: 'User deactivation; JWT revocation; session invalidation on termination.',
    evidence: ['admin.ts'], riskTreatment: 'Risk reduction', owner: 'HR' },
  // ===== A.7 Physical Controls (14 controls) =====
  { id: 'A.7.1', clause: '7.1', title: 'Physical security perimeters', category: 'Physical',
    status: 'not_applicable', justification: 'Sovereign deployment — customer responsibility per shared responsibility model.',
    implementation: 'N/A — customer-managed infrastructure.', evidence: ['System Description'], riskTreatment: 'Risk transfer', owner: 'Customer' },
  // ===== A.8 Technological Controls (34 controls) =====
  { id: 'A.8.1', clause: '8.1', title: 'User endpoint devices', category: 'Technological',
    status: 'not_applicable', justification: 'Customer-managed endpoints.',
    implementation: 'N/A — platform provides API-level security.', evidence: [], riskTreatment: 'Risk transfer', owner: 'Customer' },
  { id: 'A.8.2', clause: '8.2', title: 'Privileged access rights', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'OWNER/ADMIN/USER tiers; elevated actions require ADMIN+; audit trail on all privileged actions.',
    evidence: ['casbin.ts', 'CendiaAuditService.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.8.3', clause: '8.3', title: 'Information access restriction', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'RBAC enforcement per resource; API-level authorization checks.',
    evidence: ['casbin.ts', 'auth.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.8.5', clause: '8.5', title: 'Secure authentication', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'JWT with configurable expiry; bcrypt password hashing; MFA support.',
    evidence: ['auth.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.8.7', clause: '8.7', title: 'Protection against malware', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'Input validation; SQL injection prevention (Prisma); XSS protection (Helmet CSP).',
    evidence: ['headers.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.8.9', clause: '8.9', title: 'Configuration management', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'Environment-based configuration; secrets in env vars; git-tracked config.',
    evidence: ['config/index.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.8.12', clause: '8.12', title: 'Data leakage prevention', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'PII detection and blocking; CendiaGateway policy engine; canary tripwires.',
    evidence: ['PIIDetector.ts', 'CendiaGatewayService.ts', 'CanaryTripwireService.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.8.15', clause: '8.15', title: 'Logging', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'Comprehensive audit logging; immutable SHA-256 hash chain; configurable retention.',
    evidence: ['CendiaAuditService.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.8.16', clause: '8.16', title: 'Monitoring activities', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'ContinuousComplianceMonitorService; real-time drift detection across 10+ frameworks.',
    evidence: ['ContinuousComplianceMonitorService.ts'], riskTreatment: 'Risk reduction', owner: 'CISO' },
  { id: 'A.8.20', clause: '8.20', title: 'Networks security', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'Helmet security headers; CORS; rate limiting; TLS 1.3.',
    evidence: ['headers.ts'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.8.24', clause: '8.24', title: 'Use of cryptography', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'AES-256 encryption at rest; TLS 1.3 in transit; SHA-256 integrity; post-quantum KMS.',
    evidence: ['KeyManagementService.ts', 'PostQuantumKMS'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.8.25', clause: '8.25', title: 'Secure development life cycle', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'Git-based SDLC; PR reviews; CI/CD; dependency scanning; security testing.',
    evidence: ['Git history', 'CI config'], riskTreatment: 'Risk reduction', owner: 'CTO' },
  { id: 'A.8.28', clause: '8.28', title: 'Secure coding', category: 'Technological',
    status: 'implemented', justification: 'Required',
    implementation: 'TypeScript strict mode; Prisma ORM (no raw SQL); input validation; output encoding.',
    evidence: ['tsconfig.json', 'prisma schema'], riskTreatment: 'Risk reduction', owner: 'CTO' },
];

export class ISO27001ISMSService {
  private controls: AnnexAControl[] = ANNEX_A_CONTROLS;
  private certificationBody: string | null = null;
  private certificationStatus: ISO27001Status['certificationStatus'] = 'not_started';

  generateISMSDocument(): ISMSDocument {
    const doc: ISMSDocument = {
      title: 'Datacendia Information Security Management System (ISMS)',
      version: '1.0',
      scope: 'The ISMS covers the Datacendia Decision Crisis Immunization Infrastructure (DCII) platform, including all backend services, frontend applications, AI inference components, and supporting infrastructure managed by Datacendia.',
      context: {
        internalIssues: [
          'Pre-Series A startup — lean team with broad responsibilities',
          'Sovereign-first architecture reduces third-party risk',
          'AI governance is core product capability',
          'Compliance enforcement is built into platform DNA',
        ],
        externalIssues: [
          'Rapidly evolving AI regulation (EU AI Act, Colorado AI Act)',
          '19+ US state privacy laws with varying requirements',
          'Enterprise buyers require SOC 2 and ISO 27001',
          'Increasing cyber threat landscape',
        ],
        interestedParties: [
          { party: 'Customers', requirements: ['Data protection', 'Regulatory compliance', 'Platform availability', 'Audit evidence'] },
          { party: 'Regulators', requirements: ['GDPR compliance', 'HIPAA safeguards', 'AI transparency', 'Breach notification'] },
          { party: 'Employees', requirements: ['Secure work environment', 'Clear security responsibilities', 'Training'] },
          { party: 'Investors', requirements: ['Risk management', 'Compliance posture', 'Incident readiness'] },
        ],
      },
      leadership: {
        commitment: 'Leadership is committed to establishing, implementing, maintaining, and continually improving the ISMS. Resources are allocated for security controls, compliance monitoring, and continuous improvement.',
        policy: 'Datacendia maintains an Information Security Policy that is appropriate to the purpose of the organization, includes security objectives, and commits to satisfying applicable requirements and continual improvement.',
        rolesAndResponsibilities: [
          { role: 'CEO/Owner', responsibilities: ['Overall ISMS accountability', 'Resource allocation', 'Management review'] },
          { role: 'CISO', responsibilities: ['ISMS operation', 'Risk management', 'Incident response', 'Compliance monitoring'] },
          { role: 'CTO', responsibilities: ['Technical controls', 'Secure development', 'Architecture security'] },
          { role: 'DPO', responsibilities: ['Privacy compliance', 'GDPR oversight', 'Data subject rights'] },
        ],
      },
      riskAssessment: {
        methodology: 'Risk assessment follows ISO 27005 methodology with threat-vulnerability-impact analysis. Risk scores calculated as Likelihood × Impact on a 5-point scale.',
        criteria: 'Risk acceptance criteria: Low (1-6) = Accept, Medium (7-14) = Mitigate, High (15-20) = Mitigate urgently, Critical (21-25) = Immediate action required.',
        treatmentOptions: ['Risk reduction (implement controls)', 'Risk avoidance (eliminate the risk)', 'Risk transfer (insurance/contract)', 'Risk acceptance (with documented justification)'],
      },
      objectives: [
        { objective: 'Achieve SOC 2 Type I report', measurable: true, responsible: 'CISO', timeframe: 'Q3 2026' },
        { objective: 'Complete ISO 27001 Stage 1 audit', measurable: true, responsible: 'CISO', timeframe: 'Q4 2026' },
        { objective: 'Zero critical security incidents', measurable: true, responsible: 'CISO', timeframe: 'Ongoing' },
        { objective: 'Maintain 95%+ compliance control coverage', measurable: true, responsible: 'CISO', timeframe: 'Ongoing' },
        { objective: 'Complete annual risk assessment', measurable: true, responsible: 'CISO', timeframe: 'Annually' },
      ],
      generatedAt: new Date(),
      hash: '',
    };

    doc.hash = crypto.createHash('sha256')
      .update(JSON.stringify({ ...doc, hash: '' }))
      .digest('hex');

    return doc;
  }

  generateSoA(): { controls: AnnexAControl[]; summary: Record<string, { total: number; implemented: number; partial: number; planned: number; na: number }> } {
    const summary: Record<string, { total: number; implemented: number; partial: number; planned: number; na: number }> = {};
    
    for (const control of this.controls) {
      if (!summary[control.category]) {
        summary[control.category] = { total: 0, implemented: 0, partial: 0, planned: 0, na: 0 };
      }
      summary[control.category].total++;
      if (control.status === 'implemented') summary[control.category].implemented++;
      else if (control.status === 'partially_implemented') summary[control.category].partial++;
      else if (control.status === 'planned') summary[control.category].planned++;
      else if (control.status === 'not_applicable') summary[control.category].na++;
    }

    return { controls: this.controls, summary };
  }

  getComplianceStatus(): ISO27001Status {
    const implemented = this.controls.filter(c => c.status === 'implemented').length;
    const partial = this.controls.filter(c => c.status === 'partially_implemented').length;
    const planned = this.controls.filter(c => c.status === 'planned').length;
    const na = this.controls.filter(c => c.status === 'not_applicable').length;
    const applicable = this.controls.length - na;

    const controlCoverage = applicable > 0
      ? Math.round(((implemented + partial * 0.5) / applicable) * 100) : 0;

    const annexAScores: Record<string, number> = {};
    const categories = [...new Set(this.controls.map(c => c.category))];
    for (const cat of categories) {
      const catControls = this.controls.filter(c => c.category === cat && c.status !== 'not_applicable');
      const catImpl = catControls.filter(c => c.status === 'implemented').length;
      const catPartial = catControls.filter(c => c.status === 'partially_implemented').length;
      annexAScores[cat] = catControls.length > 0
        ? Math.round(((catImpl + catPartial * 0.5) / catControls.length) * 100) : 100;
    }

    const criticalGaps: string[] = [];
    for (const c of this.controls) {
      if (c.status === 'partially_implemented') {
        criticalGaps.push(`${c.id}: ${c.title} — partially implemented`);
      }
    }
    if (!this.certificationBody) criticalGaps.push('No certification body selected');

    return {
      overallReadiness: Math.round(controlCoverage * 0.9),
      controlCoverage,
      annexAScores,
      totalControls: this.controls.length,
      implementedControls: implemented,
      partialControls: partial,
      plannedControls: planned,
      naControls: na,
      ismsDocumented: true,
      soaGenerated: true,
      certificationBody: this.certificationBody,
      certificationStatus: this.certificationStatus,
      criticalGaps,
      assessedAt: new Date(),
    };
  }

  getControls(): AnnexAControl[] {
    return this.controls;
  }

  setCertificationBody(name: string): void {
    this.certificationBody = name;
    this.certificationStatus = 'stage_1_prep';
  }
}

export const iso27001ISMSService = new ISO27001ISMSService();
