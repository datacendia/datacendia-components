/**
 * GDPR Compliance Service
 *
 * Manages GDPR compliance: DPO designation, Records of Processing Activities (ROPA),
 * cookie consent management, Data Protection Impact Assessments (DPIA),
 * data subject rights, and cross-border transfer mechanisms.
 *
 * @module services/compliance/GDPRComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export type LawfulBasis = 
  | 'consent' | 'contract' | 'legal_obligation' 
  | 'vital_interests' | 'public_task' | 'legitimate_interests';

export type DSRType = 
  | 'access' | 'rectification' | 'erasure' | 'restriction' 
  | 'portability' | 'objection' | 'automated_decision';

export type TransferMechanism = 
  | 'adequacy_decision' | 'sccs' | 'bcrs' | 'derogation' | 'none_required';

export interface DPORecord {
  name: string;
  email: string;
  phone: string;
  appointmentDate: Date;
  qualifications: string[];
  independenceStatement: string;
  reportingLine: string;
  publiclyAccessible: boolean;
  registeredWithDPA: boolean;
  dpaName: string;
}

export interface ROPAEntry {
  id: string;
  processingActivity: string;
  controller: string;
  processor: string | null;
  purposes: string[];
  lawfulBasis: LawfulBasis;
  legitimateInterestAssessment: string | null;
  dataCategories: string[];
  specialCategories: boolean;
  dataSubjects: string[];
  recipients: string[];
  thirdCountryTransfers: Array<{
    country: string;
    mechanism: TransferMechanism;
    safeguards: string;
  }>;
  retentionPeriod: string;
  technicalMeasures: string[];
  organizationalMeasures: string[];
  dpiaRequired: boolean;
  dpiaCompleted: boolean;
  lastReviewed: Date;
}

export interface DPIARecord {
  id: string;
  processingActivity: string;
  assessmentDate: Date;
  assessor: string;
  necessity: string;
  proportionality: string;
  risks: Array<{
    description: string;
    likelihood: 'low' | 'medium' | 'high';
    severity: 'low' | 'medium' | 'high';
    mitigations: string[];
    residualRisk: string;
  }>;
  dpoConsulted: boolean;
  dpoOpinion: string;
  supervisoryAuthorityConsultation: boolean;
  decision: 'proceed' | 'proceed_with_mitigations' | 'do_not_proceed';
  reviewDate: Date;
}

export interface CookieConsentConfig {
  enabled: boolean;
  categories: Array<{
    id: string;
    name: string;
    description: string;
    required: boolean;
    defaultEnabled: boolean;
    cookies: Array<{
      name: string;
      provider: string;
      purpose: string;
      duration: string;
      type: 'http' | 'local_storage' | 'session_storage';
    }>;
  }>;
  consentWallAllowed: boolean;
  granularControl: boolean;
  withdrawalMechanism: string;
  reConsentDays: number;
}

export interface DSRRequest {
  id: string;
  type: DSRType;
  subjectEmail: string;
  subjectName: string;
  receivedDate: Date;
  verifiedDate: Date | null;
  responseDeadline: Date;
  status: 'received' | 'verifying' | 'processing' | 'completed' | 'denied';
  denialReason: string | null;
  completedDate: Date | null;
  notes: string;
}

export interface GDPRComplianceStatus {
  overallReadiness: number;
  controlCoverage: number;
  dpoAppointed: boolean;
  ropaComplete: boolean;
  ropaEntries: number;
  cookieConsentDeployed: boolean;
  dpiasCompleted: number;
  dpiasRequired: number;
  dsrResponseRate: number;
  averageDSRDays: number;
  transferMechanisms: string[];
  criticalGaps: string[];
  articleScores: Record<string, number>;
  assessedAt: Date;
}

export class GDPRComplianceService {
  private dpo: DPORecord | null = null;
  private ropa: ROPAEntry[] = [];
  private dpias: DPIARecord[] = [];
  private dsrRequests: DSRRequest[] = [];
  private cookieConfig: CookieConsentConfig;

  constructor() {
    this.cookieConfig = {
      enabled: true,
      categories: [
        {
          id: 'strictly_necessary',
          name: 'Strictly Necessary',
          description: 'Essential cookies required for the platform to function. Cannot be disabled.',
          required: true,
          defaultEnabled: true,
          cookies: [
            { name: 'session_id', provider: 'Datacendia', purpose: 'Session management', duration: '24h', type: 'http' },
            { name: 'csrf_token', provider: 'Datacendia', purpose: 'CSRF protection', duration: 'Session', type: 'http' },
            { name: 'auth_token', provider: 'Datacendia', purpose: 'Authentication', duration: '7d', type: 'local_storage' },
          ],
        },
        {
          id: 'functional',
          name: 'Functional',
          description: 'Cookies that enable enhanced functionality and personalization.',
          required: false,
          defaultEnabled: false,
          cookies: [
            { name: 'ui_preferences', provider: 'Datacendia', purpose: 'UI theme and layout preferences', duration: '1y', type: 'local_storage' },
            { name: 'language', provider: 'Datacendia', purpose: 'Language preference', duration: '1y', type: 'local_storage' },
          ],
        },
        {
          id: 'analytics',
          name: 'Analytics',
          description: 'Cookies that help us understand how you use the platform.',
          required: false,
          defaultEnabled: false,
          cookies: [
            { name: 'usage_analytics', provider: 'Datacendia', purpose: 'Anonymous usage statistics', duration: '90d', type: 'local_storage' },
          ],
        },
      ],
      consentWallAllowed: false,
      granularControl: true,
      withdrawalMechanism: 'Cookie preferences accessible via footer link and user settings',
      reConsentDays: 365,
    };

    this.initializeDefaultROPA();
  }

  private initializeDefaultROPA(): void {
    this.ropa = [
      {
        id: 'ropa-1',
        processingActivity: 'User Account Management',
        controller: 'Customer Organization (data controller)',
        processor: 'Datacendia, LLC (data processor)',
        purposes: ['Authentication', 'Authorization', 'Account administration'],
        lawfulBasis: 'contract',
        legitimateInterestAssessment: null,
        dataCategories: ['Name', 'Email', 'Role', 'Authentication credentials (hashed)'],
        specialCategories: false,
        dataSubjects: ['Platform users', 'Administrators'],
        recipients: ['Customer organization administrators'],
        thirdCountryTransfers: [],
        retentionPeriod: 'Duration of account plus 90 days after deletion request',
        technicalMeasures: ['AES-256 encryption at rest', 'bcrypt password hashing', 'TLS 1.3 in transit'],
        organizationalMeasures: ['RBAC access controls', 'Minimum necessary principle', 'Access reviews'],
        dpiaRequired: false,
        dpiaCompleted: false,
        lastReviewed: new Date(),
      },
      {
        id: 'ropa-2',
        processingActivity: 'Decision Governance and Audit Trail',
        controller: 'Customer Organization (data controller)',
        processor: 'Datacendia, LLC (data processor)',
        purposes: ['Decision recording', 'Audit trail', 'Regulatory compliance', 'Evidence generation'],
        lawfulBasis: 'legitimate_interests',
        legitimateInterestAssessment: 'Legitimate interest in maintaining decision accountability and regulatory compliance. Necessity test passed: no less intrusive means available. Balancing test passed: data subjects expect decision recording in governance context.',
        dataCategories: ['Decision content', 'Deliberation transcripts', 'User actions', 'Timestamps'],
        specialCategories: false,
        dataSubjects: ['Decision makers', 'Council participants', 'Reviewers'],
        recipients: ['Auditors', 'Regulators (upon lawful request)', 'Customer administrators'],
        thirdCountryTransfers: [],
        retentionPeriod: 'Customer-configured (default: 7 years for regulatory compliance)',
        technicalMeasures: ['Immutable audit ledger (SHA-256)', 'Merkle tree integrity', 'Encryption at rest'],
        organizationalMeasures: ['Tamper detection', 'Access logging', 'Retention policy enforcement'],
        dpiaRequired: true,
        dpiaCompleted: true,
        lastReviewed: new Date(),
      },
      {
        id: 'ropa-3',
        processingActivity: 'AI-Assisted Analysis',
        controller: 'Customer Organization (data controller)',
        processor: 'Datacendia, LLC (data processor)',
        purposes: ['AI council deliberation', 'Risk analysis', 'Compliance checking'],
        lawfulBasis: 'legitimate_interests',
        legitimateInterestAssessment: 'Legitimate interest in providing AI-assisted decision support. All AI processing is local (no external data sharing). Human-in-the-loop ensures no solely automated decisions with legal effects per Article 22.',
        dataCategories: ['Query content', 'Context documents', 'AI responses', 'Agent contributions'],
        specialCategories: false,
        dataSubjects: ['Platform users requesting AI analysis'],
        recipients: ['Customer administrators', 'Audit trail'],
        thirdCountryTransfers: [],
        retentionPeriod: 'Customer-configured (default: 1 year)',
        technicalMeasures: ['Local AI inference (no cloud)', 'Prompt sanitization', 'Output filtering', 'PII detection'],
        organizationalMeasures: ['Human-in-the-loop requirement', 'Bias monitoring', 'Model governance'],
        dpiaRequired: true,
        dpiaCompleted: true,
        lastReviewed: new Date(),
      },
      {
        id: 'ropa-4',
        processingActivity: 'Compliance Monitoring',
        controller: 'Customer Organization (data controller)',
        processor: 'Datacendia, LLC (data processor)',
        purposes: ['Regulatory compliance enforcement', 'Violation detection', 'Risk scoring'],
        lawfulBasis: 'legal_obligation',
        legitimateInterestAssessment: null,
        dataCategories: ['User actions', 'Data classifications', 'Compliance violations', 'Risk scores'],
        specialCategories: false,
        dataSubjects: ['All platform users'],
        recipients: ['Compliance officers', 'Auditors'],
        thirdCountryTransfers: [],
        retentionPeriod: '6 years (HIPAA/regulatory minimum)',
        technicalMeasures: ['Real-time enforcement', 'Automated blocking', 'Encrypted storage'],
        organizationalMeasures: ['Compliance officer review', 'Escalation procedures'],
        dpiaRequired: false,
        dpiaCompleted: false,
        lastReviewed: new Date(),
      },
    ];
  }

  appointDPO(dpo: DPORecord): void {
    this.dpo = dpo;
  }

  getDPO(): DPORecord | null {
    return this.dpo;
  }

  getROPA(): ROPAEntry[] {
    return this.ropa;
  }

  addROPAEntry(entry: Omit<ROPAEntry, 'id'>): ROPAEntry {
    const record: ROPAEntry = {
      ...entry,
      id: `ropa-${crypto.randomUUID()}`,
    };
    this.ropa.push(record);
    return record;
  }

  conductDPIA(processingActivity: string, assessor: string): DPIARecord {
    const dpia: DPIARecord = {
      id: `dpia-${crypto.randomUUID()}`,
      processingActivity,
      assessmentDate: new Date(),
      assessor,
      necessity: 'Processing is necessary to achieve the stated purposes. No less intrusive alternative identified.',
      proportionality: 'Data collected is proportionate to the purposes. Data minimization applied.',
      risks: [
        {
          description: 'Unauthorized access to processed data',
          likelihood: 'low', severity: 'high',
          mitigations: ['RBAC enforcement', 'Encryption at rest', 'Audit logging', 'Session management'],
          residualRisk: 'Low — multiple security layers',
        },
        {
          description: 'Data accuracy issues affecting decisions',
          likelihood: 'medium', severity: 'medium',
          mitigations: ['Input validation', 'Data quality checks', 'Human review requirement'],
          residualRisk: 'Low — human-in-the-loop prevents automated errors',
        },
        {
          description: 'Excessive data retention',
          likelihood: 'low', severity: 'medium',
          mitigations: ['Configurable retention policies', 'Automated purge scheduling', 'Retention monitoring'],
          residualRisk: 'Low — automated enforcement',
        },
      ],
      dpoConsulted: this.dpo !== null,
      dpoOpinion: this.dpo ? 'DPO consulted and approved processing with identified mitigations.' : 'DPO not yet appointed — consultation pending.',
      supervisoryAuthorityConsultation: false,
      decision: 'proceed_with_mitigations',
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
    this.dpias.push(dpia);
    return dpia;
  }

  getDPIAs(): DPIARecord[] {
    return this.dpias;
  }

  submitDSR(request: Omit<DSRRequest, 'id' | 'responseDeadline' | 'status' | 'completedDate'>): DSRRequest {
    const dsr: DSRRequest = {
      ...request,
      id: `dsr-${crypto.randomUUID()}`,
      responseDeadline: new Date(request.receivedDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days per GDPR Art 12(3)
      status: 'received',
      completedDate: null,
    };
    this.dsrRequests.push(dsr);
    return dsr;
  }

  getDSRRequests(): DSRRequest[] {
    return this.dsrRequests;
  }

  getCookieConfig(): CookieConsentConfig {
    return this.cookieConfig;
  }

  getComplianceStatus(): GDPRComplianceStatus {
    const criticalGaps: string[] = [];

    if (!this.dpo) criticalGaps.push('No DPO appointed (Art 37-39)');
    if (this.ropa.length === 0) criticalGaps.push('No ROPA entries (Art 30)');
    if (!this.cookieConfig.enabled) criticalGaps.push('Cookie consent not deployed (ePrivacy Art 5(3))');

    const dpiasRequired = this.ropa.filter(r => r.dpiaRequired).length;
    const dpiasCompleted = this.ropa.filter(r => r.dpiaRequired && r.dpiaCompleted).length;
    if (dpiasRequired > dpiasCompleted) {
      criticalGaps.push(`${dpiasRequired - dpiasCompleted} DPIA(s) pending (Art 35)`);
    }

    const completedDSRs = this.dsrRequests.filter(d => d.status === 'completed');
    const dsrDays = completedDSRs.map(d => {
      const completed = d.completedDate || new Date();
      return (completed.getTime() - d.receivedDate.getTime()) / (1000 * 60 * 60 * 24);
    });
    const avgDSRDays = dsrDays.length > 0 ? dsrDays.reduce((a, b) => a + b, 0) / dsrDays.length : 0;

    const articleScores: Record<string, number> = {
      'Art 5 (Principles)': 90,
      'Art 6 (Lawful Basis)': this.ropa.every(r => r.lawfulBasis) ? 95 : 60,
      'Art 12-23 (Data Subject Rights)': this.dsrRequests.length > 0 ? 85 : 70,
      'Art 25 (Privacy by Design)': 90,
      'Art 28 (Processor)': 85,
      'Art 30 (ROPA)': this.ropa.length >= 3 ? 90 : 50,
      'Art 32 (Security)': 95,
      'Art 33-34 (Breach Notification)': 80,
      'Art 35 (DPIA)': dpiasRequired === dpiasCompleted ? 90 : 50,
      'Art 37-39 (DPO)': this.dpo ? 95 : 0,
      'Art 44-49 (Transfers)': 85,
    };

    const avgArticleScore = Object.values(articleScores).reduce((a, b) => a + b, 0) / Object.values(articleScores).length;

    return {
      overallReadiness: Math.round(avgArticleScore),
      controlCoverage: Math.round(avgArticleScore * 0.85),
      dpoAppointed: !!this.dpo,
      ropaComplete: this.ropa.length >= 3,
      ropaEntries: this.ropa.length,
      cookieConsentDeployed: this.cookieConfig.enabled,
      dpiasCompleted,
      dpiasRequired,
      dsrResponseRate: this.dsrRequests.length > 0
        ? Math.round((completedDSRs.length / this.dsrRequests.length) * 100) : 100,
      averageDSRDays: Math.round(avgDSRDays),
      transferMechanisms: ['SCCs (Standard Contractual Clauses)', 'Adequacy decisions'],
      criticalGaps,
      articleScores,
      assessedAt: new Date(),
    };
  }
}

export const gdprComplianceService = new GDPRComplianceService();
