/**
 * Service — Standards & Certifications Compliance
 *
 * Covers: SOC 1, ISO 27017, ISO 27018, OWASP Top 10, CSA STAR,
 * ISO 31000, ISO 27005, NIST Privacy Framework, ISO 22301, ISO 9001,
 * COBIT, ITIL, CIS Controls, ISO 20000.
 *
 * @module services/compliance/StandardsComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface ComplianceStandard {
  code: string;
  name: string;
  jurisdiction: string;
  governingBody: string;
  category: 'audit' | 'cloud_security' | 'risk_management' | 'governance' | 'security' | 'service_management' | 'business_continuity' | 'quality' | 'privacy';
  certifiable: boolean;
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface StandardsAssessment {
  id: string;
  standardCode: string;
  assessmentDate: Date;
  controlsEvaluated: number;
  controlsMet: number;
  gaps: { control: string; gap: string; severity: 'critical' | 'high' | 'medium' | 'low' }[];
  readinessPercentage: number;
  certificationReady: boolean;
}

const STANDARDS: ComplianceStandard[] = [
  {
    code: 'SOC-1', name: 'SOC 1 (SSAE 18)', jurisdiction: 'US/Global', governingBody: 'AICPA',
    category: 'audit', certifiable: true,
    maxPenalty: 'Loss of SOC 1 report; customer contract requirements',
    keyRequirements: ['Control objectives for financial reporting', 'Control activities', 'Information and communication', 'Monitoring', 'Service auditor testing', 'Type I (design) or Type II (operating effectiveness)'],
    platformControls: [
      { control: 'Financial data controls', status: 'implemented', evidence: 'RBAC with separation of duties for financial data processing' },
      { control: 'Change management', status: 'implemented', evidence: 'Version-controlled deployments with approval workflows' },
      { control: 'Monitoring', status: 'implemented', evidence: 'Continuous compliance monitor' },
      { control: 'Audit evidence', status: 'implemented', evidence: 'Decision Ledger provides auditor-ready evidence' },
    ],
    complianceScore: 85,
  },
  {
    code: 'ISO-27017', name: 'ISO 27017 Cloud Security', jurisdiction: 'Global', governingBody: 'ISO/IEC',
    category: 'cloud_security', certifiable: true,
    maxPenalty: 'Loss of certification; customer requirements',
    keyRequirements: ['Cloud-specific controls extending ISO 27001', 'Shared responsibility model', 'Virtual machine hardening', 'Cloud service customer data isolation', 'Virtual network security', 'Cloud service administration'],
    platformControls: [
      { control: 'Shared responsibility documentation', status: 'implemented', evidence: 'Security policy documents shared responsibility for cloud deployments' },
      { control: 'Data isolation', status: 'implemented', evidence: 'Multi-tenant architecture with strict data isolation' },
      { control: 'Network security', status: 'implemented', evidence: 'Network segmentation and firewall controls' },
      { control: 'Admin access controls', status: 'implemented', evidence: 'Privileged access management with MFA' },
    ],
    complianceScore: 84,
  },
  {
    code: 'ISO-27018', name: 'ISO 27018 PII in Cloud', jurisdiction: 'Global', governingBody: 'ISO/IEC',
    category: 'privacy', certifiable: true,
    maxPenalty: 'Loss of certification; customer requirements',
    keyRequirements: ['PII processor obligations', 'Consent and choice', 'Purpose limitation', 'Data minimization', 'Use/disclosure/retention limitation', 'Transparency', 'Individual participation'],
    platformControls: [
      { control: 'PII processing controls', status: 'implemented', evidence: 'GDPR data processing controls extend to ISO 27018' },
      { control: 'Consent management', status: 'implemented', evidence: 'Consent engine' },
      { control: 'Transparency', status: 'implemented', evidence: 'Privacy notice management' },
      { control: 'Data subject rights', status: 'implemented', evidence: 'DSR workflow' },
    ],
    complianceScore: 86,
  },
  {
    code: 'OWASP-TOP-10', name: 'OWASP Top 10 Web Security', jurisdiction: 'Global', governingBody: 'OWASP Foundation',
    category: 'security', certifiable: false,
    maxPenalty: 'N/A — best practice; but referenced by regulators and auditors',
    keyRequirements: ['A01: Broken Access Control', 'A02: Cryptographic Failures', 'A03: Injection', 'A04: Insecure Design', 'A05: Security Misconfiguration', 'A06: Vulnerable Components', 'A07: Auth Failures', 'A08: Software Integrity Failures', 'A09: Logging Failures', 'A10: SSRF'],
    platformControls: [
      { control: 'Access control (A01)', status: 'implemented', evidence: 'RBAC with Casbin policy engine' },
      { control: 'Cryptography (A02)', status: 'implemented', evidence: 'AES-256, TLS 1.3, FIPS-compliant crypto' },
      { control: 'Injection prevention (A03)', status: 'implemented', evidence: 'Parameterized queries via Prisma ORM; input validation' },
      { control: 'Secure design (A04)', status: 'implemented', evidence: 'Threat modeling in security policy' },
      { control: 'Configuration management (A05)', status: 'implemented', evidence: 'Environment-based config; no hardcoded secrets' },
      { control: 'Component management (A06)', status: 'implemented', evidence: 'SBOM generation with vulnerability scanning' },
      { control: 'Authentication (A07)', status: 'implemented', evidence: 'Keycloak SSO with MFA' },
      { control: 'Software integrity (A08)', status: 'implemented', evidence: 'SBOM with Cosign signing' },
      { control: 'Logging (A09)', status: 'implemented', evidence: 'Comprehensive audit logging in Decision Ledger' },
      { control: 'SSRF prevention (A10)', status: 'implemented', evidence: 'URL allowlisting; no user-controlled server-side requests' },
    ],
    complianceScore: 92,
  },
  {
    code: 'CSA-STAR', name: 'CSA STAR', jurisdiction: 'Global', governingBody: 'Cloud Security Alliance',
    category: 'cloud_security', certifiable: true,
    maxPenalty: 'Loss of certification; enterprise buyer requirements',
    keyRequirements: ['Cloud Controls Matrix (CCM) domains', 'Consensus Assessments Initiative Questionnaire (CAIQ)', 'Level 1: Self-assessment', 'Level 2: Third-party audit', 'Level 3: Continuous monitoring', 'Application security', 'Data security', 'Infrastructure security'],
    platformControls: [
      { control: 'CCM mapping', status: 'implemented', evidence: 'Security controls map to CSA CCM v4 domains' },
      { control: 'CAIQ responses', status: 'implemented', evidence: 'Compliance reporting generates CAIQ-compatible responses' },
      { control: 'Continuous monitoring', status: 'implemented', evidence: 'ContinuousComplianceMonitorService for Level 3' },
      { control: 'Application security', status: 'implemented', evidence: 'OWASP Top 10 compliance' },
    ],
    complianceScore: 84,
  },
  {
    code: 'ISO-31000', name: 'ISO 31000 Risk Management', jurisdiction: 'Global', governingBody: 'ISO',
    category: 'risk_management', certifiable: false,
    maxPenalty: 'N/A — framework; not certifiable',
    keyRequirements: ['Risk management principles', 'Risk management framework', 'Risk management process (context, assessment, treatment)', 'Communication and consultation', 'Monitoring and review', 'Recording and reporting'],
    platformControls: [
      { control: 'Risk framework', status: 'implemented', evidence: 'Enterprise risk framework follows ISO 31000 structure' },
      { control: 'Risk assessment process', status: 'implemented', evidence: 'Automated risk assessment workflow' },
      { control: 'Risk treatment', status: 'implemented', evidence: 'Risk mitigation tracking in compliance monitor' },
      { control: 'Reporting', status: 'implemented', evidence: 'Compliance dashboard provides risk reporting' },
    ],
    complianceScore: 87,
  },
  {
    code: 'ISO-27005', name: 'ISO 27005 Info Security Risk Management', jurisdiction: 'Global', governingBody: 'ISO/IEC',
    category: 'risk_management', certifiable: false,
    maxPenalty: 'N/A — guidance standard supporting ISO 27001',
    keyRequirements: ['Context establishment', 'Risk identification', 'Risk analysis', 'Risk evaluation', 'Risk treatment', 'Risk acceptance', 'Risk communication', 'Risk monitoring and review'],
    platformControls: [
      { control: 'Risk identification', status: 'implemented', evidence: 'Asset-based risk identification in security framework' },
      { control: 'Risk analysis', status: 'implemented', evidence: 'Quantitative and qualitative risk analysis' },
      { control: 'Risk treatment', status: 'implemented', evidence: 'Risk treatment plans with owner assignment' },
      { control: 'Monitoring', status: 'implemented', evidence: 'Continuous compliance monitor for risk changes' },
    ],
    complianceScore: 86,
  },
  {
    code: 'NIST-PRIVACY', name: 'NIST Privacy Framework', jurisdiction: 'US/Global', governingBody: 'NIST',
    category: 'privacy', certifiable: false,
    maxPenalty: 'N/A — voluntary; referenced by regulations',
    keyRequirements: ['Identify-P function', 'Govern-P function', 'Control-P function', 'Communicate-P function', 'Protect-P function', 'Privacy risk assessment', 'Data processing ecosystem mapping'],
    platformControls: [
      { control: 'Identify-P', status: 'implemented', evidence: 'Data classification and inventory' },
      { control: 'Govern-P', status: 'implemented', evidence: 'DCII privacy governance framework' },
      { control: 'Control-P', status: 'implemented', evidence: 'RBAC and data access controls' },
      { control: 'Communicate-P', status: 'implemented', evidence: 'Privacy notice management' },
      { control: 'Protect-P', status: 'implemented', evidence: 'Encryption and security controls' },
    ],
    complianceScore: 88,
  },
  {
    code: 'ISO-22301', name: 'ISO 22301 Business Continuity', jurisdiction: 'Global', governingBody: 'ISO',
    category: 'business_continuity', certifiable: true,
    maxPenalty: 'Loss of certification; customer/regulatory requirements',
    keyRequirements: ['Business impact analysis', 'Risk assessment', 'Business continuity strategy', 'Business continuity plans', 'Exercise and testing', 'Performance evaluation', 'Continual improvement'],
    platformControls: [
      { control: 'BIA', status: 'implemented', evidence: 'BCP_DR_PLAN.md includes business impact analysis' },
      { control: 'BCP', status: 'implemented', evidence: 'BCP_DR_PLAN.md with RTOs and RPOs' },
      { control: 'Testing', status: 'implemented', evidence: 'BCP_DR_PLAN.md includes testing schedule' },
      { control: 'Risk assessment', status: 'implemented', evidence: 'Enterprise risk framework' },
    ],
    complianceScore: 86,
  },
  {
    code: 'ISO-9001', name: 'ISO 9001 Quality Management', jurisdiction: 'Global', governingBody: 'ISO',
    category: 'quality', certifiable: true,
    maxPenalty: 'Loss of certification; customer requirements',
    keyRequirements: ['Quality policy and objectives', 'Process approach', 'Risk-based thinking', 'Customer focus', 'Leadership', 'Planning', 'Support resources', 'Operation', 'Performance evaluation', 'Improvement'],
    platformControls: [
      { control: 'Process documentation', status: 'implemented', evidence: 'All services documented with API specifications' },
      { control: 'Risk-based thinking', status: 'implemented', evidence: 'Enterprise risk framework integrated into all processes' },
      { control: 'Performance evaluation', status: 'implemented', evidence: 'Continuous compliance monitor tracks quality metrics' },
      { control: 'Improvement tracking', status: 'implemented', evidence: 'CAPA workflow for corrective actions' },
    ],
    complianceScore: 84,
  },
  {
    code: 'COBIT', name: 'COBIT 2019', jurisdiction: 'Global', governingBody: 'ISACA',
    category: 'governance', certifiable: false,
    maxPenalty: 'N/A — governance framework; referenced by auditors',
    keyRequirements: ['Evaluate, Direct, Monitor (EDM)', 'Align, Plan, Organize (APO)', 'Build, Acquire, Implement (BAI)', 'Deliver, Service, Support (DSS)', 'Monitor, Evaluate, Assess (MEA)', '40 governance and management objectives'],
    platformControls: [
      { control: 'IT governance (EDM)', status: 'implemented', evidence: 'DCII governance framework maps to COBIT EDM' },
      { control: 'Strategic alignment (APO)', status: 'implemented', evidence: 'Risk management and compliance alignment' },
      { control: 'Change management (BAI)', status: 'implemented', evidence: 'Version-controlled deployment process' },
      { control: 'Service delivery (DSS)', status: 'implemented', evidence: 'Service management controls' },
      { control: 'Performance monitoring (MEA)', status: 'implemented', evidence: 'Continuous compliance monitoring' },
    ],
    complianceScore: 85,
  },
  {
    code: 'ITIL', name: 'ITIL 4', jurisdiction: 'Global', governingBody: 'Axelos/PeopleCert',
    category: 'service_management', certifiable: false,
    maxPenalty: 'N/A — best practice framework',
    keyRequirements: ['Service value system', 'Service value chain', '34 management practices', 'Incident management', 'Change enablement', 'Problem management', 'Service desk', 'Service level management'],
    platformControls: [
      { control: 'Incident management', status: 'implemented', evidence: 'Incident Response Plan' },
      { control: 'Change enablement', status: 'implemented', evidence: 'Version-controlled deployment with approval' },
      { control: 'Service level management', status: 'implemented', evidence: 'BCP_DR_PLAN.md with SLA targets' },
      { control: 'Monitoring and event management', status: 'implemented', evidence: 'Continuous compliance monitor' },
    ],
    complianceScore: 83,
  },
  {
    code: 'CIS', name: 'CIS Controls v8', jurisdiction: 'Global', governingBody: 'Center for Internet Security',
    category: 'security', certifiable: false,
    maxPenalty: 'N/A — best practice; referenced by CMMC, HIPAA, PCI',
    keyRequirements: ['IG1: Basic Cyber Hygiene (56 safeguards)', 'IG2: (additional 74 safeguards)', 'IG3: (additional 23 safeguards)', '18 control families', 'Asset management', 'Data protection', 'Account management', 'Audit log management', 'Vulnerability management'],
    platformControls: [
      { control: 'Asset inventory (CIS 1)', status: 'implemented', evidence: 'System inventory and classification' },
      { control: 'Data protection (CIS 3)', status: 'implemented', evidence: 'Data classification with encryption controls' },
      { control: 'Account management (CIS 5/6)', status: 'implemented', evidence: 'RBAC with MFA via Keycloak' },
      { control: 'Audit logs (CIS 8)', status: 'implemented', evidence: 'Decision Ledger comprehensive audit logging' },
      { control: 'Vulnerability management (CIS 7)', status: 'implemented', evidence: 'SBOM with CVE tracking' },
    ],
    complianceScore: 86,
  },
  {
    code: 'ISO-20000', name: 'ISO 20000 IT Service Management', jurisdiction: 'Global', governingBody: 'ISO/IEC',
    category: 'service_management', certifiable: true,
    maxPenalty: 'Loss of certification; customer requirements',
    keyRequirements: ['Service management system', 'Service portfolio management', 'Relationship management', 'Resolution processes', 'Control processes', 'Service design and transition'],
    platformControls: [
      { control: 'Service management system', status: 'implemented', evidence: 'DCII governance as service management framework' },
      { control: 'Resolution processes', status: 'implemented', evidence: 'Incident Response Plan' },
      { control: 'Control processes', status: 'implemented', evidence: 'Change management and configuration management' },
    ],
    complianceScore: 82,
  },
];

class StandardsComplianceService {
  private standards: ComplianceStandard[] = STANDARDS;
  private assessments: StandardsAssessment[] = [];

  getStandards(): ComplianceStandard[] {
    return this.standards;
  }

  getStandard(code: string): ComplianceStandard | undefined {
    return this.standards.find(s => s.code === code);
  }

  getCertifiable(): ComplianceStandard[] {
    return this.standards.filter(s => s.certifiable);
  }

  getByCategory(category: string): ComplianceStandard[] {
    return this.standards.filter(s => s.category === category);
  }

  getDashboard(): {
    totalStandards: number;
    certifiableCount: number;
    averageScore: number;
    byCategory: Record<string, { count: number; avgScore: number }>;
    criticalGaps: { standard: string; control: string; status: string }[];
  } {
    const avgScore = Math.round(this.standards.reduce((s, st) => s + st.complianceScore, 0) / this.standards.length);

    const byCategory: Record<string, { count: number; avgScore: number }> = {};
    for (const st of this.standards) {
      if (!byCategory[st.category]) byCategory[st.category] = { count: 0, avgScore: 0 };
      byCategory[st.category].count++;
      byCategory[st.category].avgScore += st.complianceScore;
    }
    for (const cat of Object.keys(byCategory)) {
      byCategory[cat].avgScore = Math.round(byCategory[cat].avgScore / byCategory[cat].count);
    }

    const criticalGaps: { standard: string; control: string; status: string }[] = [];
    for (const st of this.standards) {
      for (const ctrl of st.platformControls) {
        if (ctrl.status !== 'implemented') {
          criticalGaps.push({ standard: st.code, control: ctrl.control, status: ctrl.status });
        }
      }
    }

    return {
      totalStandards: this.standards.length,
      certifiableCount: this.standards.filter(s => s.certifiable).length,
      averageScore: avgScore,
      byCategory,
      criticalGaps,
    };
  }

  assessStandard(params: {
    standardCode: string;
  }): StandardsAssessment {
    const std = this.standards.find(s => s.code === params.standardCode);
    if (!std) throw new Error(`Standard ${params.standardCode} not found`);

    const fulfilled = std.platformControls.filter(c => c.status === 'implemented').length;
    const total = std.platformControls.length;
    const gaps = std.platformControls
      .filter(c => c.status !== 'implemented')
      .map(c => ({
        control: c.control,
        gap: `${c.control}: ${c.status}`,
        severity: c.status === 'partial' ? 'medium' as const : 'high' as const,
      }));

    const assessment: StandardsAssessment = {
      id: `std-${crypto.randomUUID()}`,
      standardCode: params.standardCode,
      assessmentDate: new Date(),
      controlsEvaluated: total,
      controlsMet: fulfilled,
      gaps,
      readinessPercentage: Math.round((fulfilled / total) * 100),
      certificationReady: std.certifiable && gaps.length === 0,
    };

    this.assessments.push(assessment);
    return assessment;
  }

  getAssessments(): StandardsAssessment[] {
    return this.assessments;
  }

  getReadinessReport(): {
    overallScore: number;
    standardScores: { code: string; name: string; score: number; certifiable: boolean }[];
    recommendations: string[];
  } {
    const scores = this.standards.map(s => ({ code: s.code, name: s.name, score: s.complianceScore, certifiable: s.certifiable }));
    const overall = Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length);
    const recommendations = this.standards
      .filter(s => s.complianceScore < 85)
      .map(s => `${s.code}${s.certifiable ? ' (certifiable)' : ''}: Score ${s.complianceScore}% — review ${s.category} controls`);
    return { overallScore: overall, standardScores: scores, recommendations };
  }
}

export const standardsComplianceService = new StandardsComplianceService();
