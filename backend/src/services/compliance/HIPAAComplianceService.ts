/**
 * HIPAA Compliance Service
 *
 * Manages HIPAA + HITECH compliance: BAA tracking, risk assessment,
 * PHI safeguards, breach notification, and 6-year log retention.
 *
 * @module services/compliance/HIPAAComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export type HIPAARuleType = 'privacy' | 'security' | 'breach_notification' | 'enforcement' | 'hitech';

export type SafeguardType = 'administrative' | 'physical' | 'technical';

export interface BAARecord {
  id: string;
  vendorName: string;
  vendorContact: string;
  effectiveDate: Date;
  expirationDate: Date | null;
  baaType: 'business_associate' | 'subcontractor';
  services: string[];
  phiTypes: string[];
  permittedUses: string[];
  breachNotificationDays: number;
  status: 'active' | 'pending' | 'expired' | 'terminated';
  documentHash: string;
  lastReviewed: Date;
}

export interface RiskAssessment {
  id: string;
  assessmentDate: Date;
  assessor: string;
  scope: string;
  methodology: string;
  threats: Array<{
    id: string;
    name: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    currentControls: string[];
    residualRisk: string;
    remediationPlan: string;
  }>;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  nextAssessmentDate: Date;
  approvedBy: string;
}

export interface PHISafeguard {
  id: string;
  type: SafeguardType;
  standard: string;
  implementationSpec: string;
  required: boolean;
  status: 'implemented' | 'partially_implemented' | 'planned' | 'not_applicable';
  implementation: string;
  evidence: string[];
}

export interface BreachRecord {
  id: string;
  discoveryDate: Date;
  reportedDate: Date | null;
  affectedIndividuals: number;
  phiTypes: string[];
  description: string;
  rootCause: string;
  riskAssessment: {
    naturePHI: string;
    unauthorizedEntity: string;
    acquired: boolean;
    mitigationSteps: string[];
  };
  notifications: {
    individuals: { required: boolean; sent: boolean; date: Date | null };
    hhs: { required: boolean; sent: boolean; date: Date | null };
    media: { required: boolean; sent: boolean; date: Date | null };
  };
  status: 'investigating' | 'notifying' | 'resolved' | 'closed';
}

export interface HIPAAComplianceStatus {
  overallReadiness: number;
  controlCoverage: number;
  baaStatus: { total: number; active: number; pending: number; expired: number };
  riskAssessmentCurrent: boolean;
  lastRiskAssessment: Date | null;
  logRetentionDays: number;
  requiredRetentionDays: number;
  retentionCompliant: boolean;
  safeguardScores: Record<SafeguardType, number>;
  criticalGaps: string[];
  assessedAt: Date;
}

// HIPAA Security Rule Safeguards (45 CFR Part 160/164)
const HIPAA_SAFEGUARDS: PHISafeguard[] = [
  // Administrative Safeguards (§164.308)
  {
    id: 'admin-1', type: 'administrative', standard: '§164.308(a)(1)',
    implementationSpec: 'Security Management Process',
    required: true, status: 'implemented',
    implementation: 'ComplianceEnforcer 5-ring model with real-time risk analysis and automated violation blocking.',
    evidence: ['ComplianceEnforcer.ts', 'ContinuousComplianceMonitorService.ts'],
  },
  {
    id: 'admin-2', type: 'administrative', standard: '§164.308(a)(1)(ii)(A)',
    implementationSpec: 'Risk Analysis',
    required: true, status: 'implemented',
    implementation: 'Formal risk assessment service with threat modeling, likelihood/impact scoring, and remediation tracking.',
    evidence: ['HIPAAComplianceService.ts risk assessment module'],
  },
  {
    id: 'admin-3', type: 'administrative', standard: '§164.308(a)(1)(ii)(B)',
    implementationSpec: 'Risk Management',
    required: true, status: 'implemented',
    implementation: 'Automated compliance monitoring with drift detection; risk mitigation tracking.',
    evidence: ['ContinuousComplianceMonitorService.ts'],
  },
  {
    id: 'admin-4', type: 'administrative', standard: '§164.308(a)(1)(ii)(C)',
    implementationSpec: 'Sanction Policy',
    required: true, status: 'partially_implemented',
    implementation: 'Automated action blocking for violations. Formal HR sanction policy being documented.',
    evidence: ['ComplianceEnforcer.ts'],
  },
  {
    id: 'admin-5', type: 'administrative', standard: '§164.308(a)(1)(ii)(D)',
    implementationSpec: 'Information System Activity Review',
    required: true, status: 'implemented',
    implementation: 'Comprehensive audit logging with immutable SHA-256 hash chain; real-time activity monitoring.',
    evidence: ['CendiaAuditService.ts'],
  },
  {
    id: 'admin-6', type: 'administrative', standard: '§164.308(a)(2)',
    implementationSpec: 'Assigned Security Responsibility',
    required: true, status: 'implemented',
    implementation: 'CISO role assigned; security responsibilities documented in compliance dashboard.',
    evidence: ['INFORMATION_SECURITY_POLICY.md'],
  },
  {
    id: 'admin-7', type: 'administrative', standard: '§164.308(a)(3)',
    implementationSpec: 'Workforce Security',
    required: true, status: 'implemented',
    implementation: 'RBAC with Casbin; role-based access provisioning/deprovisioning; access reviews.',
    evidence: ['casbin.ts', 'auth.ts'],
  },
  {
    id: 'admin-8', type: 'administrative', standard: '§164.308(a)(4)',
    implementationSpec: 'Information Access Management',
    required: true, status: 'implemented',
    implementation: 'Minimum necessary access enforced via Casbin RBAC; data classification per sensitivity.',
    evidence: ['casbin.ts', 'PIIDetector.ts'],
  },
  {
    id: 'admin-9', type: 'administrative', standard: '§164.308(a)(5)',
    implementationSpec: 'Security Awareness and Training',
    required: true, status: 'partially_implemented',
    implementation: 'Technical security awareness built into platform. Formal training program being developed.',
    evidence: [],
  },
  {
    id: 'admin-10', type: 'administrative', standard: '§164.308(a)(6)',
    implementationSpec: 'Security Incident Procedures',
    required: true, status: 'implemented',
    implementation: 'Incident response plan; automated detection; breach notification workflow.',
    evidence: ['INCIDENT_RESPONSE_PLAN.md'],
  },
  {
    id: 'admin-11', type: 'administrative', standard: '§164.308(a)(7)',
    implementationSpec: 'Contingency Plan',
    required: true, status: 'partially_implemented',
    implementation: 'BCP/DR plan drafted; deterministic replay enables decision recovery.',
    evidence: ['BCP_DR_PLAN.md', 'DeterministicReplayService.ts'],
  },
  {
    id: 'admin-12', type: 'administrative', standard: '§164.308(a)(8)',
    implementationSpec: 'Evaluation',
    required: true, status: 'implemented',
    implementation: 'Continuous compliance monitoring; periodic readiness assessments; gap analysis.',
    evidence: ['COMPLIANCE_AUDIT_APR2026.md'],
  },
  {
    id: 'admin-13', type: 'administrative', standard: '§164.308(b)(1)',
    implementationSpec: 'Business Associate Contracts',
    required: true, status: 'implemented',
    implementation: 'BAA management service with tracking, review dates, and PHI scope documentation.',
    evidence: ['HIPAAComplianceService.ts BAA module'],
  },
  // Physical Safeguards (§164.310)
  {
    id: 'phys-1', type: 'physical', standard: '§164.310(a)(1)',
    implementationSpec: 'Facility Access Controls',
    required: true, status: 'not_applicable',
    implementation: 'Sovereign/on-premise deployment — physical security is customer responsibility.',
    evidence: ['System Description — CUEC'],
  },
  {
    id: 'phys-2', type: 'physical', standard: '§164.310(b)',
    implementationSpec: 'Workstation Use',
    required: true, status: 'not_applicable',
    implementation: 'Customer-managed workstations. Platform enforces session timeouts and screen locks.',
    evidence: ['auth.ts session management'],
  },
  {
    id: 'phys-3', type: 'physical', standard: '§164.310(c)',
    implementationSpec: 'Workstation Security',
    required: true, status: 'not_applicable',
    implementation: 'Customer responsibility for endpoint security. Platform provides API-level protection.',
    evidence: ['System Description — CUEC'],
  },
  {
    id: 'phys-4', type: 'physical', standard: '§164.310(d)(1)',
    implementationSpec: 'Device and Media Controls',
    required: true, status: 'partially_implemented',
    implementation: 'Encryption at rest protects data on storage media. Disposal procedures being documented.',
    evidence: ['encryption config'],
  },
  // Technical Safeguards (§164.312)
  {
    id: 'tech-1', type: 'technical', standard: '§164.312(a)(1)',
    implementationSpec: 'Access Control',
    required: true, status: 'implemented',
    implementation: 'JWT authentication; Casbin RBAC; unique user identification; emergency access procedure.',
    evidence: ['auth.ts', 'casbin.ts'],
  },
  {
    id: 'tech-2', type: 'technical', standard: '§164.312(b)',
    implementationSpec: 'Audit Controls',
    required: true, status: 'implemented',
    implementation: 'Immutable audit ledger with SHA-256 chain; 6-year configurable retention; tamper detection.',
    evidence: ['CendiaAuditService.ts'],
  },
  {
    id: 'tech-3', type: 'technical', standard: '§164.312(c)(1)',
    implementationSpec: 'Integrity',
    required: true, status: 'implemented',
    implementation: 'Merkle tree evidence chains; SHA-256 hash verification; digital signatures.',
    evidence: ['DecisionDNAService.ts', 'RegulatorsReceiptService.ts'],
  },
  {
    id: 'tech-4', type: 'technical', standard: '§164.312(d)',
    implementationSpec: 'Person or Entity Authentication',
    required: true, status: 'implemented',
    implementation: 'Multi-factor authentication support; JWT token validation; session management.',
    evidence: ['auth.ts'],
  },
  {
    id: 'tech-5', type: 'technical', standard: '§164.312(e)(1)',
    implementationSpec: 'Transmission Security',
    required: true, status: 'implemented',
    implementation: 'TLS 1.3 enforced for all transmissions; HSTS headers; encryption of PHI in transit.',
    evidence: ['headers.ts'],
  },
];

export class HIPAAComplianceService {
  private safeguards: PHISafeguard[] = HIPAA_SAFEGUARDS;
  private baaRecords: BAARecord[] = [];
  private riskAssessments: RiskAssessment[] = [];
  private breachLog: BreachRecord[] = [];
  private logRetentionDays: number = 2190; // 6 years = 2190 days

  getComplianceStatus(): HIPAAComplianceStatus {
    const implemented = this.safeguards.filter(s => s.status === 'implemented').length;
    const partial = this.safeguards.filter(s => s.status === 'partially_implemented').length;
    const na = this.safeguards.filter(s => s.status === 'not_applicable').length;
    const applicable = this.safeguards.length - na;

    const controlCoverage = applicable > 0
      ? Math.round(((implemented + partial * 0.5) / applicable) * 100)
      : 0;

    const safeguardScores: Record<SafeguardType, number> = {
      administrative: 0, physical: 0, technical: 0,
    };
    for (const type of ['administrative', 'physical', 'technical'] as SafeguardType[]) {
      const typeSafeguards = this.safeguards.filter(s => s.type === type && s.status !== 'not_applicable');
      const typeImpl = typeSafeguards.filter(s => s.status === 'implemented').length;
      const typePartial = typeSafeguards.filter(s => s.status === 'partially_implemented').length;
      safeguardScores[type] = typeSafeguards.length > 0
        ? Math.round(((typeImpl + typePartial * 0.5) / typeSafeguards.length) * 100)
        : 100;
    }

    const criticalGaps: string[] = [];
    for (const s of this.safeguards) {
      if (s.required && (s.status === 'planned' || s.status === 'partially_implemented')) {
        criticalGaps.push(`${s.standard} ${s.implementationSpec}: ${s.status}`);
      }
    }
    if (this.baaRecords.filter(b => b.status === 'active').length === 0) {
      criticalGaps.push('No active BAAs on file');
    }
    if (this.riskAssessments.length === 0) {
      criticalGaps.push('No formal risk assessment completed (required annually)');
    }
    if (this.logRetentionDays < 2190) {
      criticalGaps.push(`Log retention ${this.logRetentionDays} days < required 2190 days (6 years)`);
    }

    const activeBaas = this.baaRecords.filter(b => b.status === 'active').length;
    const lastRA = this.riskAssessments.length > 0
      ? this.riskAssessments[this.riskAssessments.length - 1].assessmentDate
      : null;
    const raCurrentDays = lastRA ? (Date.now() - lastRA.getTime()) / (1000 * 60 * 60 * 24) : Infinity;

    return {
      overallReadiness: Math.round(controlCoverage * 0.92),
      controlCoverage,
      baaStatus: {
        total: this.baaRecords.length,
        active: activeBaas,
        pending: this.baaRecords.filter(b => b.status === 'pending').length,
        expired: this.baaRecords.filter(b => b.status === 'expired').length,
      },
      riskAssessmentCurrent: raCurrentDays <= 365,
      lastRiskAssessment: lastRA,
      logRetentionDays: this.logRetentionDays,
      requiredRetentionDays: 2190,
      retentionCompliant: this.logRetentionDays >= 2190,
      safeguardScores,
      criticalGaps,
      assessedAt: new Date(),
    };
  }

  addBAA(baa: Omit<BAARecord, 'id' | 'documentHash'>): BAARecord {
    const record: BAARecord = {
      ...baa,
      id: `baa-${crypto.randomUUID()}`,
      documentHash: crypto.createHash('sha256')
        .update(JSON.stringify(baa))
        .digest('hex'),
    };
    this.baaRecords.push(record);
    return record;
  }

  getBAAs(): BAARecord[] {
    return this.baaRecords;
  }

  conductRiskAssessment(assessor: string, scope: string): RiskAssessment {
    const assessment: RiskAssessment = {
      id: `ra-${crypto.randomUUID()}`,
      assessmentDate: new Date(),
      assessor,
      scope,
      methodology: 'NIST SP 800-30 Rev 1 — Guide for Conducting Risk Assessments',
      threats: [
        {
          id: 't1', name: 'Unauthorized PHI Access',
          likelihood: 'medium', impact: 'high', riskLevel: 'high',
          currentControls: ['RBAC', 'JWT auth', 'audit logging', 'session management'],
          residualRisk: 'Low — RBAC and audit controls provide strong access control',
          remediationPlan: 'Implement periodic access reviews',
        },
        {
          id: 't2', name: 'PHI Data Breach via Application Vulnerability',
          likelihood: 'low', impact: 'high', riskLevel: 'medium',
          currentControls: ['Input validation', 'Helmet CSP', 'SQL injection prevention', 'XSS protection'],
          residualRisk: 'Low — multiple layers of defense',
          remediationPlan: 'Schedule annual penetration testing',
        },
        {
          id: 't3', name: 'PHI Loss Due to System Failure',
          likelihood: 'low', impact: 'high', riskLevel: 'medium',
          currentControls: ['Database backups', 'Health checks', 'Deterministic replay'],
          residualRisk: 'Medium — BCP/DR plan needs testing',
          remediationPlan: 'Complete and test BCP/DR plan; schedule DR drill',
        },
        {
          id: 't4', name: 'Insider Threat',
          likelihood: 'low', impact: 'high', riskLevel: 'medium',
          currentControls: ['Canary tripwires', 'Audit logging', 'Minimum necessary access'],
          residualRisk: 'Low — multiple detection mechanisms',
          remediationPlan: 'Implement user behavior analytics',
        },
        {
          id: 't5', name: 'Business Associate PHI Mishandling',
          likelihood: 'low', impact: 'medium', riskLevel: 'low',
          currentControls: ['BAA management', 'Vendor risk assessment', 'Sovereign architecture'],
          residualRisk: 'Very Low — sovereign architecture minimizes BA dependencies',
          remediationPlan: 'Annual BA compliance review',
        },
      ],
      overallRisk: 'medium',
      nextAssessmentDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      approvedBy: assessor,
    };
    this.riskAssessments.push(assessment);
    return assessment;
  }

  getRiskAssessments(): RiskAssessment[] {
    return this.riskAssessments;
  }

  reportBreach(breach: Omit<BreachRecord, 'id' | 'status'>): BreachRecord {
    const record: BreachRecord = {
      ...breach,
      id: `breach-${crypto.randomUUID()}`,
      status: 'investigating',
    };
    // Auto-determine notification requirements per HITECH
    if (record.affectedIndividuals >= 500) {
      record.notifications.hhs.required = true;
      record.notifications.media.required = true;
    }
    record.notifications.individuals.required = true;
    this.breachLog.push(record);
    return record;
  }

  getBreachLog(): BreachRecord[] {
    return this.breachLog;
  }

  getSafeguards(): PHISafeguard[] {
    return this.safeguards;
  }

  setLogRetention(days: number): void {
    this.logRetentionDays = Math.max(days, 2190);
  }
}

export const hipaaComplianceService = new HIPAAComplianceService();
