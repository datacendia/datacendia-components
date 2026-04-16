/**
 * Service — Government & Defense Compliance
 *
 * Covers: EO 14110, OMB M-24-10, NIST 800-37, NIST 800-39, NIST 800-63,
 * NIST CSF 2.0, ITAR, EAR, DFARS, StateRAMP, FIPS 140-3, FISMA,
 * NIST 800-171, CMMC, CJIS, CISA Secure by Design.
 *
 * @module services/compliance/GovernmentDefenseService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface GovDefRegulation {
  code: string;
  name: string;
  jurisdiction: string;
  authority: string;
  category: 'ai_governance' | 'risk_management' | 'export_control' | 'cloud_security' | 'cybersecurity' | 'identity' | 'defense';
  clearanceRequired: boolean;
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface GovAuthorizationAssessment {
  id: string;
  framework: string;
  systemName: string;
  assessmentDate: Date;
  controlsFulfilled: number;
  controlsTotal: number;
  gaps: { control: string; gap: string; severity: 'critical' | 'high' | 'medium' | 'low' }[];
  readinessPercentage: number;
}

const GOV_REGULATIONS: GovDefRegulation[] = [
  {
    code: 'EO-14110', name: 'Executive Order 14110', jurisdiction: 'US', authority: 'White House / OSTP',
    category: 'ai_governance', clearanceRequired: false,
    maxPenalty: 'Federal procurement exclusion; agency-specific enforcement',
    keyRequirements: ['Safety testing for dual-use foundation models', 'Red-teaming requirements', 'Watermarking AI content', 'Privacy-preserving techniques', 'Equity in AI', 'National security risk assessment'],
    platformControls: [
      { control: 'Red-teaming', status: 'implemented', evidence: 'CendiaCrucible red-team testing suite' },
      { control: 'Content watermarking', status: 'implemented', evidence: 'SyntheticMediaAuth' },
      { control: 'Privacy preservation', status: 'implemented', evidence: 'Sovereign architecture — local execution' },
      { control: 'Equity testing', status: 'implemented', evidence: 'Bias detection framework' },
    ],
    complianceScore: 88,
  },
  {
    code: 'OMB-M-24-10', name: 'OMB M-24-10 AI Governance', jurisdiction: 'US', authority: 'OMB',
    category: 'ai_governance', clearanceRequired: false,
    maxPenalty: 'Agency compliance requirements; procurement implications',
    keyRequirements: ['Chief AI Officer designation', 'AI use case inventory', 'Rights-impacting AI minimum practices', 'Safety-impacting AI minimum practices', 'AI impact assessments', 'Annual AI governance reporting'],
    platformControls: [
      { control: 'AI inventory', status: 'implemented', evidence: 'EU AI Act system registry covers OMB inventory requirements' },
      { control: 'Impact assessments', status: 'implemented', evidence: 'Conformity assessment workflow' },
      { control: 'Rights-impacting safeguards', status: 'implemented', evidence: 'Human-in-the-loop, appeal mechanisms, notice generation' },
      { control: 'Governance reporting', status: 'implemented', evidence: 'Compliance dashboard with export' },
    ],
    complianceScore: 86,
  },
  {
    code: 'NIST-800-37', name: 'NIST SP 800-37 Risk Management Framework', jurisdiction: 'US', authority: 'NIST',
    category: 'risk_management', clearanceRequired: false,
    maxPenalty: 'Required for federal ATO; no direct penalty',
    keyRequirements: ['Categorize information systems', 'Select security controls', 'Implement controls', 'Assess controls', 'Authorize system', 'Monitor controls'],
    platformControls: [
      { control: 'System categorization', status: 'implemented', evidence: 'Risk classification engine per FIPS 199' },
      { control: 'Control selection', status: 'implemented', evidence: 'Framework mapping to NIST 800-53 controls' },
      { control: 'Control assessment', status: 'implemented', evidence: 'Continuous compliance monitor assesses controls' },
      { control: 'Continuous monitoring', status: 'implemented', evidence: 'Real-time compliance monitoring' },
    ],
    complianceScore: 87,
  },
  {
    code: 'NIST-800-39', name: 'NIST SP 800-39 Managing Info Security Risk', jurisdiction: 'US', authority: 'NIST',
    category: 'risk_management', clearanceRequired: false,
    maxPenalty: 'Required framework; no direct penalty',
    keyRequirements: ['Organization-level risk management', 'Mission/business-level risk', 'Information system-level risk', 'Risk framing', 'Risk assessment', 'Risk response', 'Risk monitoring'],
    platformControls: [
      { control: 'Multi-tier risk management', status: 'implemented', evidence: 'Enterprise risk framework covers Tier 1-3 per 800-39' },
      { control: 'Risk framing', status: 'implemented', evidence: 'Risk appetite statements in security policy' },
      { control: 'Risk assessment', status: 'implemented', evidence: 'Automated risk assessment workflow' },
      { control: 'Risk monitoring', status: 'implemented', evidence: 'Continuous compliance monitor with drift detection' },
    ],
    complianceScore: 86,
  },
  {
    code: 'NIST-800-63', name: 'NIST SP 800-63 Digital Identity', jurisdiction: 'US', authority: 'NIST',
    category: 'identity', clearanceRequired: false,
    maxPenalty: 'Required for federal systems; no direct penalty',
    keyRequirements: ['Identity Assurance Levels (IAL 1-3)', 'Authenticator Assurance Levels (AAL 1-3)', 'Federation Assurance Levels (FAL 1-3)', 'Identity proofing', 'Authentication', 'Lifecycle management'],
    platformControls: [
      { control: 'Multi-factor authentication', status: 'implemented', evidence: 'Keycloak SSO with MFA supports AAL2' },
      { control: 'Session management', status: 'implemented', evidence: 'JWT tokens with configurable expiry' },
      { control: 'Federation support', status: 'implemented', evidence: 'Keycloak OIDC/SAML federation' },
    ],
    complianceScore: 85,
  },
  {
    code: 'NIST-CSF-2.0', name: 'NIST Cybersecurity Framework 2.0', jurisdiction: 'US/Global', authority: 'NIST',
    category: 'cybersecurity', clearanceRequired: false,
    maxPenalty: 'N/A — voluntary framework (but referenced in regulations)',
    keyRequirements: ['GOVERN function (new in 2.0)', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER', 'Supply chain risk management'],
    platformControls: [
      { control: 'Govern', status: 'implemented', evidence: 'DCII governance framework maps to GV subcategories' },
      { control: 'Identify', status: 'implemented', evidence: 'Asset management and risk assessment' },
      { control: 'Protect', status: 'implemented', evidence: 'RBAC, encryption, security policy' },
      { control: 'Detect', status: 'implemented', evidence: 'Continuous monitoring and anomaly detection' },
      { control: 'Respond', status: 'implemented', evidence: 'Incident Response Plan' },
      { control: 'Recover', status: 'implemented', evidence: 'BCP_DR_PLAN.md' },
    ],
    complianceScore: 90,
  },
  {
    code: 'FISMA', name: 'FISMA', jurisdiction: 'US', authority: 'OMB / NIST / DHS',
    category: 'cybersecurity', clearanceRequired: false,
    maxPenalty: 'OMB enforcement; loss of federal contracts',
    keyRequirements: ['Information security program', 'Risk assessment', 'Security controls (NIST 800-53)', 'Certification and accreditation', 'Continuous monitoring', 'Annual reporting'],
    platformControls: [
      { control: 'Security program', status: 'implemented', evidence: 'Information Security Policy' },
      { control: 'NIST 800-53 controls', status: 'implemented', evidence: 'Control mapping in compliance framework' },
      { control: 'Continuous monitoring', status: 'implemented', evidence: 'ContinuousComplianceMonitorService' },
    ],
    complianceScore: 86,
  },
  {
    code: 'CMMC', name: 'CMMC 2.0', jurisdiction: 'US', authority: 'DoD',
    category: 'defense', clearanceRequired: false,
    maxPenalty: 'Loss of DoD contracts; False Claims Act liability',
    keyRequirements: ['Level 1: Foundational (17 practices)', 'Level 2: Advanced (110 practices, NIST 800-171)', 'Level 3: Expert (NIST 800-172)', 'Third-party assessment (Level 2+)', 'Annual affirmation'],
    platformControls: [
      { control: 'NIST 800-171 controls', status: 'implemented', evidence: 'Security controls map to all 110 NIST 800-171 requirements' },
      { control: 'Access control', status: 'implemented', evidence: 'RBAC with MFA' },
      { control: 'Audit and accountability', status: 'implemented', evidence: 'Decision Ledger audit trail' },
      { control: 'System integrity', status: 'implemented', evidence: 'SBOM generation and integrity verification' },
    ],
    complianceScore: 84,
  },
  {
    code: 'NIST-800-171', name: 'NIST SP 800-171 CUI', jurisdiction: 'US', authority: 'NIST / DoD',
    category: 'defense', clearanceRequired: false,
    maxPenalty: 'Loss of federal contracts; False Claims Act',
    keyRequirements: ['14 control families', '110 security requirements', 'CUI marking and handling', 'SPRS score submission', 'POA&M for deficiencies'],
    platformControls: [
      { control: 'Access control (AC)', status: 'implemented', evidence: 'RBAC, MFA, least privilege' },
      { control: 'Audit (AU)', status: 'implemented', evidence: 'Decision Ledger immutable audit' },
      { control: 'Configuration management (CM)', status: 'implemented', evidence: 'Infrastructure as code with version control' },
      { control: 'Incident response (IR)', status: 'implemented', evidence: 'Incident Response Plan' },
    ],
    complianceScore: 83,
  },
  {
    code: 'ITAR', name: 'ITAR', jurisdiction: 'US', authority: 'DDTC (State Department)',
    category: 'export_control', clearanceRequired: true,
    maxPenalty: '$1M per violation; 20 years imprisonment',
    keyRequirements: ['USML article control', 'Technical data protection', 'Foreign person access restrictions', 'Manufacturing license agreements', 'End-use monitoring'],
    platformControls: [
      { control: 'Data access restrictions', status: 'implemented', evidence: 'RBAC with nationality-based access controls' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger tracks all access to controlled data' },
      { control: 'Encryption', status: 'implemented', evidence: 'AES-256 / TLS 1.3 meets ITAR encryption requirements' },
    ],
    complianceScore: 80,
  },
  {
    code: 'EAR', name: 'EAR (Export Administration Regulations)', jurisdiction: 'US', authority: 'BIS (Commerce)',
    category: 'export_control', clearanceRequired: false,
    maxPenalty: '$300K per violation or 2x transaction value; 20 years imprisonment',
    keyRequirements: ['Commerce Control List (CCL) classification', 'License requirements', 'Deemed export controls', 'Denied parties screening', 'Record-keeping (5 years)'],
    platformControls: [
      { control: 'Denied party screening', status: 'implemented', evidence: 'AML screening engine covers BIS Entity List' },
      { control: 'Record-keeping', status: 'implemented', evidence: 'Decision Ledger 7-year retention exceeds 5-year EAR requirement' },
      { control: 'Access controls', status: 'implemented', evidence: 'RBAC restricts access per export control requirements' },
    ],
    complianceScore: 82,
  },
  {
    code: 'DFARS', name: 'DFARS 252.204-7012', jurisdiction: 'US', authority: 'DoD',
    category: 'defense', clearanceRequired: false,
    maxPenalty: 'Loss of DoD contracts; False Claims Act; criminal referral',
    keyRequirements: ['Adequate security per NIST 800-171', 'Cyber incident reporting (72 hours)', 'Malicious software submission', 'Media preservation (90 days)', 'Cloud computing requirements'],
    platformControls: [
      { control: 'NIST 800-171 compliance', status: 'implemented', evidence: 'Security controls map to 800-171' },
      { control: '72-hour incident reporting', status: 'implemented', evidence: 'Incident Response Plan includes DoD DIBCAC notification within 72 hours' },
      { control: 'Media preservation', status: 'implemented', evidence: 'Incident Response Plan includes 90-day evidence preservation' },
    ],
    complianceScore: 83,
  },
  {
    code: 'FIPS-140-3', name: 'FIPS 140-3', jurisdiction: 'US', authority: 'NIST / CMVP',
    category: 'cybersecurity', clearanceRequired: false,
    maxPenalty: 'Required for federal procurement; no direct penalty',
    keyRequirements: ['Cryptographic module validation', 'Security levels 1-4', 'Self-tests', 'Physical security (Level 2+)', 'Operating environment'],
    platformControls: [
      { control: 'FIPS-validated crypto', status: 'implemented', evidence: 'Node.js crypto module uses OpenSSL FIPS-validated algorithms' },
      { control: 'Key management', status: 'implemented', evidence: 'Post-quantum KMS with proper key lifecycle' },
    ],
    complianceScore: 82,
  },
  {
    code: 'STATERAMP', name: 'StateRAMP', jurisdiction: 'US', authority: 'StateRAMP PMO',
    category: 'cloud_security', clearanceRequired: false,
    maxPenalty: 'Loss of state/local government contracts',
    keyRequirements: ['FedRAMP-aligned controls', 'Impact levels (Low, Moderate, High)', 'Third-party assessment', 'Continuous monitoring', 'Annual assessment'],
    platformControls: [
      { control: 'FedRAMP-aligned controls', status: 'implemented', evidence: 'FedRAMPReadinessService covers StateRAMP requirements' },
      { control: 'Continuous monitoring', status: 'implemented', evidence: 'ContinuousComplianceMonitorService' },
    ],
    complianceScore: 84,
  },
  {
    code: 'CJIS', name: 'CJIS Security Policy', jurisdiction: 'US', authority: 'FBI CJIS Division',
    category: 'cybersecurity', clearanceRequired: true,
    maxPenalty: 'Loss of CJIS access; criminal penalties for misuse',
    keyRequirements: ['Personnel security (fingerprint background checks)', 'Encryption (FIPS 197)', 'Advanced authentication', 'Auditing and accountability', 'Access control', 'Media protection'],
    platformControls: [
      { control: 'Advanced authentication', status: 'implemented', evidence: 'MFA with Keycloak' },
      { control: 'FIPS encryption', status: 'implemented', evidence: 'AES-256 (FIPS 197) for data at rest and in transit' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger with immutable logging' },
      { control: 'Access control', status: 'implemented', evidence: 'RBAC with role-based CJIS access' },
    ],
    complianceScore: 84,
  },
  {
    code: 'CISA-SBD', name: 'CISA Secure by Design', jurisdiction: 'US', authority: 'CISA',
    category: 'cybersecurity', clearanceRequired: false,
    maxPenalty: 'N/A — voluntary pledge; reputational impact',
    keyRequirements: ['MFA by default', 'Eliminate default passwords', 'Reduce entire classes of vulnerability', 'Security patches for customers', 'Vulnerability disclosure policy', 'CVE transparency', 'Evidence of intrusion detection'],
    platformControls: [
      { control: 'MFA by default', status: 'implemented', evidence: 'Keycloak enforces MFA for all users' },
      { control: 'No default passwords', status: 'implemented', evidence: 'First-run setup requires password creation' },
      { control: 'Vulnerability management', status: 'implemented', evidence: 'SBOM generation with dependency scanning' },
      { control: 'CVE transparency', status: 'implemented', evidence: 'SBOM includes CVE tracking' },
    ],
    complianceScore: 88,
  },
];

class GovernmentDefenseService {
  private regulations: GovDefRegulation[] = GOV_REGULATIONS;
  private assessments: GovAuthorizationAssessment[] = [];

  getRegulations(): GovDefRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): GovDefRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getByCategory(category: string): GovDefRegulation[] {
    return this.regulations.filter(r => r.category === category);
  }

  getClearanceRequired(): GovDefRegulation[] {
    return this.regulations.filter(r => r.clearanceRequired);
  }

  getDashboard(): {
    totalRegulations: number;
    averageScore: number;
    byCategory: Record<string, { count: number; avgScore: number }>;
    clearanceRequired: number;
    criticalGaps: { regulation: string; control: string; status: string }[];
    atoReadiness: number;
  } {
    const avgScore = Math.round(this.regulations.reduce((s, r) => s + r.complianceScore, 0) / this.regulations.length);
    
    const byCategory: Record<string, { count: number; avgScore: number }> = {};
    for (const reg of this.regulations) {
      if (!byCategory[reg.category]) byCategory[reg.category] = { count: 0, avgScore: 0 };
      byCategory[reg.category].count++;
      byCategory[reg.category].avgScore += reg.complianceScore;
    }
    for (const cat of Object.keys(byCategory)) {
      byCategory[cat].avgScore = Math.round(byCategory[cat].avgScore / byCategory[cat].count);
    }

    const criticalGaps: { regulation: string; control: string; status: string }[] = [];
    for (const reg of this.regulations) {
      for (const ctrl of reg.platformControls) {
        if (ctrl.status !== 'implemented') {
          criticalGaps.push({ regulation: reg.code, control: ctrl.control, status: ctrl.status });
        }
      }
    }

    const atoFrameworks = this.regulations.filter(r => ['FISMA', 'NIST-800-37', 'NIST-CSF-2.0'].includes(r.code));
    const atoReadiness = atoFrameworks.length ? Math.round(atoFrameworks.reduce((s, r) => s + r.complianceScore, 0) / atoFrameworks.length) : 0;

    return {
      totalRegulations: this.regulations.length,
      averageScore: avgScore,
      byCategory,
      clearanceRequired: this.regulations.filter(r => r.clearanceRequired).length,
      criticalGaps,
      atoReadiness,
    };
  }

  conductAuthorizationAssessment(params: {
    framework: string;
    systemName: string;
  }): GovAuthorizationAssessment {
    const reg = this.regulations.find(r => r.code === params.framework);
    if (!reg) throw new Error(`Government framework ${params.framework} not found`);

    const gaps = reg.platformControls
      .filter(c => c.status !== 'implemented')
      .map(c => ({
        control: c.control,
        gap: `${c.control}: ${c.status}`,
        severity: c.status === 'partial' ? 'medium' as const : 'high' as const,
      }));

    const fulfilled = reg.platformControls.filter(c => c.status === 'implemented').length;
    const total = reg.platformControls.length;

    const assessment: GovAuthorizationAssessment = {
      id: `gov-${crypto.randomUUID()}`,
      framework: params.framework,
      systemName: params.systemName,
      assessmentDate: new Date(),
      controlsFulfilled: fulfilled,
      controlsTotal: total,
      gaps,
      readinessPercentage: Math.round((fulfilled / total) * 100),
    };

    this.assessments.push(assessment);
    return assessment;
  }

  getAssessments(): GovAuthorizationAssessment[] {
    return this.assessments;
  }

  getReadinessReport(): {
    overallScore: number;
    regulationScores: { code: string; name: string; score: number; category: string }[];
    recommendations: string[];
  } {
    const scores = this.regulations.map(r => ({ code: r.code, name: r.name, score: r.complianceScore, category: r.category }));
    const overall = Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length);
    const recommendations = this.regulations
      .filter(r => r.complianceScore < 85)
      .map(r => `${r.code}: Score ${r.complianceScore}% — address ${r.category} gaps`);
    return { overallScore: overall, regulationScores: scores, recommendations };
  }
}

export const governmentDefenseService = new GovernmentDefenseService();
