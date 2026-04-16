/**
 * FedRAMP Readiness Service
 *
 * Manages FedRAMP readiness assessment, System Security Plan (SSP) outline,
 * NIST 800-53 control mapping, POA&M tracking, and ATO timeline planning.
 *
 * @module services/compliance/FedRAMPReadinessService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export type ImpactLevel = 'low' | 'moderate' | 'high';
export type ControlFamily = string;
export type ControlImplStatus = 'fully_implemented' | 'partially_implemented' | 'planned' | 'alternative' | 'not_applicable';

export interface FedRAMPControl {
  id: string;
  family: ControlFamily;
  title: string;
  impactLevel: ImpactLevel;
  status: ControlImplStatus;
  implementation: string;
  evidence: string[];
  gaps: string[];
}

export interface SSPOutline {
  systemName: string;
  systemId: string;
  impactLevel: ImpactLevel;
  authorizationType: 'agency' | 'jab';
  systemDescription: string;
  systemBoundary: {
    components: string[];
    dataFlows: string[];
    interconnections: string[];
  };
  securityCategorizationFIPS199: {
    confidentiality: ImpactLevel;
    integrity: ImpactLevel;
    availability: ImpactLevel;
    overall: ImpactLevel;
  };
  leveragedAuthorizations: string[];
  controlFamilySummary: Record<string, { total: number; implemented: number; partial: number; planned: number }>;
  responsibleRoles: Array<{ role: string; name: string; responsibilities: string[] }>;
  generatedAt: Date;
  hash: string;
}

export interface POAMItem {
  id: string;
  weakness: string;
  controlId: string;
  scheduledCompletionDate: Date;
  milestones: Array<{ description: string; dueDate: Date; completed: boolean }>;
  riskLevel: 'low' | 'moderate' | 'high';
  status: 'open' | 'in_progress' | 'completed' | 'risk_accepted';
  responsibleParty: string;
}

export interface FedRAMPStatus {
  overallReadiness: number;
  targetImpactLevel: ImpactLevel;
  controlFamilyScores: Record<string, number>;
  totalControls: number;
  implementedControls: number;
  partialControls: number;
  plannedControls: number;
  poamItems: number;
  openPOAMs: number;
  estimatedATOTimeline: string;
  phases: Array<{ phase: string; status: 'completed' | 'in_progress' | 'not_started'; description: string }>;
  criticalGaps: string[];
  assessedAt: Date;
}

// Key NIST 800-53 Rev 5 Control Families for FedRAMP Moderate
const FEDRAMP_CONTROLS: FedRAMPControl[] = [
  // AC — Access Control
  { id: 'AC-1', family: 'AC', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Access control policy in INFORMATION_SECURITY_POLICY.md; RBAC procedures documented.',
    evidence: ['INFORMATION_SECURITY_POLICY.md', 'casbin.ts'], gaps: [] },
  { id: 'AC-2', family: 'AC', title: 'Account Management', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'User account lifecycle management; provisioning/deprovisioning; role assignment.',
    evidence: ['auth.ts', 'admin.ts'], gaps: [] },
  { id: 'AC-3', family: 'AC', title: 'Access Enforcement', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Casbin RBAC with policy-based access enforcement.',
    evidence: ['casbin.ts'], gaps: [] },
  { id: 'AC-6', family: 'AC', title: 'Least Privilege', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'RBAC tiers enforce minimum necessary access. Admin actions require elevated role.',
    evidence: ['casbin.ts'], gaps: [] },
  { id: 'AC-7', family: 'AC', title: 'Unsuccessful Logon Attempts', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Rate limiting on auth endpoints. Account lockout policy being implemented.',
    evidence: ['auth.ts'], gaps: ['Implement configurable account lockout after N failed attempts'] },
  // AT — Awareness and Training
  { id: 'AT-1', family: 'AT', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Security awareness built into platform. Formal training program in development.',
    evidence: [], gaps: ['Formalize security awareness training program'] },
  // AU — Audit and Accountability
  { id: 'AU-1', family: 'AU', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Audit logging policy; immutable audit trail.',
    evidence: ['CendiaAuditService.ts'], gaps: [] },
  { id: 'AU-2', family: 'AU', title: 'Event Logging', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Comprehensive event logging: auth events, data access, admin actions, compliance violations.',
    evidence: ['CendiaAuditService.ts'], gaps: [] },
  { id: 'AU-3', family: 'AU', title: 'Content of Audit Records', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Audit records include: timestamp, user, action, resource, result, IP address.',
    evidence: ['CendiaAuditService.ts'], gaps: [] },
  { id: 'AU-6', family: 'AU', title: 'Audit Record Review', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Automated monitoring via ContinuousComplianceMonitorService. Manual review procedures needed.',
    evidence: ['ContinuousComplianceMonitorService.ts'], gaps: ['Formalize weekly audit log review procedures'] },
  { id: 'AU-9', family: 'AU', title: 'Protection of Audit Information', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Immutable SHA-256 hash chain; tamper detection; role-based access to logs.',
    evidence: ['CendiaAuditService.ts'], gaps: [] },
  { id: 'AU-11', family: 'AU', title: 'Audit Record Retention', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Configurable retention up to 10+ years. Default 6 years for regulatory compliance.',
    evidence: ['HIPAAComplianceService.ts'], gaps: [] },
  // CA — Assessment, Authorization, and Monitoring
  { id: 'CA-1', family: 'CA', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Compliance framework documented. Formal assessment procedures being developed.',
    evidence: ['COMPLIANCE_DOCUMENTATION.md'], gaps: ['Formalize security assessment procedures'] },
  { id: 'CA-2', family: 'CA', title: 'Control Assessments', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Automated compliance monitoring. Formal 3PAO assessment not yet conducted.',
    evidence: ['ContinuousComplianceMonitorService.ts'], gaps: ['Engage 3PAO for independent assessment'] },
  // CM — Configuration Management
  { id: 'CM-1', family: 'CM', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Git-based configuration management; environment-based config; PR reviews.',
    evidence: ['Git history'], gaps: [] },
  { id: 'CM-2', family: 'CM', title: 'Baseline Configuration', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Docker containers provide consistent baseline; git-tracked configuration.',
    evidence: ['Dockerfile', 'docker-compose.yml'], gaps: [] },
  // IA — Identification and Authentication
  { id: 'IA-1', family: 'IA', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Authentication policy with JWT tokens; password requirements; session management.',
    evidence: ['auth.ts'], gaps: [] },
  { id: 'IA-2', family: 'IA', title: 'Identification and Authentication (Org Users)', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Unique user identification via email; JWT authentication; MFA support.',
    evidence: ['auth.ts'], gaps: [] },
  { id: 'IA-5', family: 'IA', title: 'Authenticator Management', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'bcrypt password hashing; configurable password policy; token rotation.',
    evidence: ['auth.ts'], gaps: [] },
  // IR — Incident Response
  { id: 'IR-1', family: 'IR', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Incident response plan with detection, response, and recovery procedures.',
    evidence: ['INCIDENT_RESPONSE_PLAN.md'], gaps: [] },
  { id: 'IR-4', family: 'IR', title: 'Incident Handling', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Automated detection; severity classification; escalation procedures.',
    evidence: ['ComplianceEnforcer.ts', 'INCIDENT_RESPONSE_PLAN.md'], gaps: [] },
  { id: 'IR-6', family: 'IR', title: 'Incident Reporting', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Internal reporting via audit logs. US-CERT reporting procedures being formalized.',
    evidence: ['CendiaAuditService.ts'], gaps: ['Formalize US-CERT/CISA incident reporting procedures'] },
  // RA — Risk Assessment
  { id: 'RA-1', family: 'RA', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Risk assessment methodology per NIST 800-30.',
    evidence: ['HIPAAComplianceService.ts'], gaps: [] },
  { id: 'RA-3', family: 'RA', title: 'Risk Assessment', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'HIPAA risk assessment service with threat modeling and risk scoring.',
    evidence: ['HIPAAComplianceService.ts'], gaps: [] },
  { id: 'RA-5', family: 'RA', title: 'Vulnerability Monitoring and Scanning', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Dependency vulnerability scanning via npm audit. Full vulnerability management program needed.',
    evidence: ['package.json'], gaps: ['Implement continuous vulnerability scanning and remediation SLAs'] },
  // SC — System and Communications Protection
  { id: 'SC-1', family: 'SC', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Communications security via TLS 1.3; HSTS; CSP headers.',
    evidence: ['headers.ts'], gaps: [] },
  { id: 'SC-7', family: 'SC', title: 'Boundary Protection', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'Helmet security headers; CORS restrictions; API rate limiting.',
    evidence: ['headers.ts'], gaps: [] },
  { id: 'SC-8', family: 'SC', title: 'Transmission Confidentiality and Integrity', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'TLS 1.3 enforced; HSTS headers.',
    evidence: ['headers.ts'], gaps: [] },
  { id: 'SC-12', family: 'SC', title: 'Cryptographic Key Establishment and Management', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'KMS service supporting AWS KMS, Vault, Azure KV, and local keys.',
    evidence: ['KeyManagementService.ts'], gaps: [] },
  { id: 'SC-13', family: 'SC', title: 'Cryptographic Protection', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'AES-256 encryption; SHA-256 integrity; post-quantum cryptography support.',
    evidence: ['KeyManagementService.ts', 'PostQuantumKMS'], gaps: [] },
  { id: 'SC-28', family: 'SC', title: 'Protection of Information at Rest', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'AES-256 encryption at rest for all sensitive data.',
    evidence: ['config'], gaps: [] },
  // SI — System and Information Integrity
  { id: 'SI-1', family: 'SI', title: 'Policy and Procedures', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'System integrity monitoring; input validation; output encoding.',
    evidence: ['ComplianceEnforcer.ts'], gaps: [] },
  { id: 'SI-2', family: 'SI', title: 'Flaw Remediation', impactLevel: 'moderate',
    status: 'partially_implemented', implementation: 'Dependency updates; security patches. Formal patch management SLAs needed.',
    evidence: ['package.json'], gaps: ['Define patch management SLAs (critical: 48h, high: 7d)'] },
  { id: 'SI-4', family: 'SI', title: 'System Monitoring', impactLevel: 'moderate',
    status: 'fully_implemented', implementation: 'ContinuousComplianceMonitorService; canary tripwires; audit log analysis.',
    evidence: ['ContinuousComplianceMonitorService.ts', 'CanaryTripwireService.ts'], gaps: [] },
];

export class FedRAMPReadinessService {
  private controls: FedRAMPControl[] = FEDRAMP_CONTROLS;
  private poamItems: POAMItem[] = [];
  private targetLevel: ImpactLevel = 'moderate';

  constructor() {
    this.generatePOAMFromGaps();
  }

  private generatePOAMFromGaps(): void {
    for (const control of this.controls) {
      for (const gap of control.gaps) {
        this.poamItems.push({
          id: `poam-${control.id}-${this.poamItems.length + 1}`,
          weakness: gap,
          controlId: control.id,
          scheduledCompletionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          milestones: [
            { description: `Plan remediation for ${control.id}`, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), completed: false },
            { description: `Implement fix for ${control.id}`, dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), completed: false },
            { description: `Validate remediation for ${control.id}`, dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), completed: false },
          ],
          riskLevel: control.status === 'planned' ? 'high' : 'moderate',
          status: 'open',
          responsibleParty: 'CISO',
        });
      }
    }
  }

  generateSSPOutline(): SSPOutline {
    const familySummary: SSPOutline['controlFamilySummary'] = {};
    for (const control of this.controls) {
      if (!familySummary[control.family]) {
        familySummary[control.family] = { total: 0, implemented: 0, partial: 0, planned: 0 };
      }
      familySummary[control.family].total++;
      if (control.status === 'fully_implemented') familySummary[control.family].implemented++;
      else if (control.status === 'partially_implemented') familySummary[control.family].partial++;
      else if (control.status === 'planned') familySummary[control.family].planned++;
    }

    const ssp: SSPOutline = {
      systemName: 'Datacendia Decision Crisis Immunization Infrastructure (DCII)',
      systemId: 'DATACENDIA-DCII-001',
      impactLevel: this.targetLevel,
      authorizationType: 'agency',
      systemDescription: 'Datacendia DCII is a sovereign-first enterprise decision governance platform deployed on customer-owned infrastructure. It provides AI-powered council deliberation, compliance enforcement, immutable audit trails, and evidence generation.',
      systemBoundary: {
        components: [
          'Datacendia Backend (Node.js/Express API server)',
          'Datacendia Frontend (React SPA)',
          'PostgreSQL Database (customer-managed)',
          'Redis Cache (customer-managed)',
          'Qdrant Vector Database (customer-managed)',
          'Ollama AI Inference Engine (customer-managed, air-gap capable)',
        ],
        dataFlows: [
          'User → Frontend → Backend API (TLS 1.3)',
          'Backend → PostgreSQL (encrypted connection)',
          'Backend → Ollama (local inference, no external calls)',
          'Backend → Qdrant (vector search, local)',
        ],
        interconnections: [
          'Customer IdP (optional, for SSO integration)',
          'Customer SIEM (optional, for log forwarding)',
        ],
      },
      securityCategorizationFIPS199: {
        confidentiality: 'moderate',
        integrity: 'moderate',
        availability: 'moderate',
        overall: 'moderate',
      },
      leveragedAuthorizations: [],
      controlFamilySummary: familySummary,
      responsibleRoles: [
        { role: 'System Owner', name: 'Stuart Rainey', responsibilities: ['Overall system accountability', 'ATO authorization'] },
        { role: 'ISSO', name: 'TBD', responsibilities: ['Security monitoring', 'POA&M management', 'Continuous monitoring'] },
        { role: 'ISSM', name: 'TBD', responsibilities: ['Security policy', 'Risk management', 'Audit support'] },
      ],
      generatedAt: new Date(),
      hash: '',
    };

    ssp.hash = crypto.createHash('sha256')
      .update(JSON.stringify({ ...ssp, hash: '' }))
      .digest('hex');

    return ssp;
  }

  getComplianceStatus(): FedRAMPStatus {
    const implemented = this.controls.filter(c => c.status === 'fully_implemented').length;
    const partial = this.controls.filter(c => c.status === 'partially_implemented').length;
    const planned = this.controls.filter(c => c.status === 'planned').length;

    const familyScores: Record<string, number> = {};
    const families = [...new Set(this.controls.map(c => c.family))];
    for (const fam of families) {
      const famControls = this.controls.filter(c => c.family === fam);
      const famImpl = famControls.filter(c => c.status === 'fully_implemented').length;
      const famPartial = famControls.filter(c => c.status === 'partially_implemented').length;
      familyScores[fam] = Math.round(((famImpl + famPartial * 0.5) / famControls.length) * 100);
    }

    const readiness = Math.round(((implemented + partial * 0.5) / this.controls.length) * 100);
    const openPOAMs = this.poamItems.filter(p => p.status === 'open' || p.status === 'in_progress').length;

    const criticalGaps: string[] = [];
    if (openPOAMs > 0) criticalGaps.push(`${openPOAMs} open POA&M items`);
    criticalGaps.push('3PAO assessment not yet conducted');
    criticalGaps.push('FedRAMP PMO package not submitted');
    criticalGaps.push('No agency sponsor identified');

    return {
      overallReadiness: readiness,
      targetImpactLevel: this.targetLevel,
      controlFamilyScores: familyScores,
      totalControls: this.controls.length,
      implementedControls: implemented,
      partialControls: partial,
      plannedControls: planned,
      poamItems: this.poamItems.length,
      openPOAMs,
      estimatedATOTimeline: readiness >= 80 ? '12-15 months' : readiness >= 60 ? '15-18 months' : '18-24 months',
      phases: [
        { phase: 'Preparation', status: 'in_progress', description: 'SSP documentation, control implementation, gap remediation' },
        { phase: 'Readiness Assessment', status: 'not_started', description: 'FedRAMP Ready designation from 3PAO' },
        { phase: 'Full Assessment', status: 'not_started', description: 'Complete 3PAO security assessment' },
        { phase: 'Agency Authorization', status: 'not_started', description: 'ATO from sponsoring agency' },
        { phase: 'Continuous Monitoring', status: 'not_started', description: 'Ongoing ConMon per FedRAMP requirements' },
      ],
      criticalGaps,
      assessedAt: new Date(),
    };
  }

  getControls(): FedRAMPControl[] {
    return this.controls;
  }

  getPOAM(): POAMItem[] {
    return this.poamItems;
  }
}

export const fedRAMPReadinessService = new FedRAMPReadinessService();
