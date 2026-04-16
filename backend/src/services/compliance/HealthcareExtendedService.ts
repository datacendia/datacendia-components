/**
 * Service — Healthcare Extended Compliance
 *
 * Covers frameworks beyond HIPAA: HITECH, 42 CFR Part 2, Stark Law,
 * Anti-Kickback Statute, CMS CoP, EU IVDR, WHO AI, FDA 21 CFR 11,
 * HITRUST CSF, HL7 FHIR, ICH E6, ISO 13485, EU MDR, FDA SaMD.
 *
 * @module services/compliance/HealthcareExtendedService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface HealthcareRegulation {
  code: string;
  name: string;
  jurisdiction: string;
  regulator: string;
  category: 'privacy' | 'fraud_abuse' | 'device_regulation' | 'standards' | 'clinical' | 'ai_health';
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface HealthcareAssessment {
  id: string;
  regulationCode: string;
  facilityType: string;
  assessmentDate: Date;
  findings: { requirement: string; status: 'met' | 'partial' | 'unmet'; gap: string; remediation: string }[];
  overallCompliance: 'compliant' | 'partially_compliant' | 'non_compliant';
}

const HEALTHCARE_REGULATIONS: HealthcareRegulation[] = [
  {
    code: 'HITECH', name: 'HITECH Act', jurisdiction: 'US', regulator: 'HHS OCR',
    category: 'privacy', maxPenalty: '$1.5M per violation category per year; state AG actions',
    keyRequirements: ['Breach notification to individuals', 'Breach notification to HHS', 'Media notification (>500)', 'Enhanced HIPAA penalties', 'EHR incentive compliance', 'Business associate direct liability'],
    platformControls: [
      { control: 'Breach notification workflow', status: 'implemented', evidence: 'Incident Response Plan with 60-day individual notification and HHS reporting' },
      { control: 'BA compliance tracking', status: 'implemented', evidence: 'BAA_TEMPLATE.md with HITECH provisions' },
      { control: 'Encryption safe harbor', status: 'implemented', evidence: 'AES-256 encryption qualifies for HITECH encryption safe harbor' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger with immutable PHI access logs' },
    ],
    complianceScore: 92,
  },
  {
    code: '42-CFR-2', name: '42 CFR Part 2 (Substance Use)', jurisdiction: 'US', regulator: 'SAMHSA / HHS',
    category: 'privacy', maxPenalty: '$500 first offense; $5K subsequent; referral to US Attorney',
    keyRequirements: ['Written patient consent for disclosure', 'Prohibition on re-disclosure', 'Restriction on use in legal proceedings', 'Qualified Service Organization Agreements', 'Audit and breach reporting'],
    platformControls: [
      { control: 'Segmented consent management', status: 'implemented', evidence: 'Consent engine supports granular SUD data consent separate from general HIPAA' },
      { control: 'Re-disclosure prevention', status: 'implemented', evidence: 'Data classification tags SUD records with Part 2 restrictions' },
      { control: 'Access segmentation', status: 'implemented', evidence: 'RBAC enforces Part 2 access restrictions beyond standard HIPAA' },
    ],
    complianceScore: 88,
  },
  {
    code: 'STARK-LAW', name: 'Stark Law (Physician Self-Referral)', jurisdiction: 'US', regulator: 'CMS / OIG',
    category: 'fraud_abuse', maxPenalty: '$15K per service; $100K per arrangement; treble damages under FCA',
    keyRequirements: ['No referrals to entities with financial relationships', 'Exception documentation (in-office, employee, fair market value)', 'Compensation arrangement tracking', 'Disclosure of financial relationships'],
    platformControls: [
      { control: 'Referral pattern monitoring', status: 'implemented', evidence: 'Decision engine flags referral patterns that may indicate self-referral violations' },
      { control: 'Financial relationship tracking', status: 'implemented', evidence: 'Audit trail documents financial relationships per referral' },
      { control: 'Exception documentation', status: 'implemented', evidence: 'Compliance workflow documents applicable Stark exceptions' },
      { control: 'FMV documentation', status: 'implemented', evidence: 'Decision reports document fair market value analysis' },
    ],
    complianceScore: 85,
  },
  {
    code: 'AKS', name: 'Anti-Kickback Statute', jurisdiction: 'US', regulator: 'OIG / DOJ',
    category: 'fraud_abuse', maxPenalty: '$100K per violation; 10 years imprisonment; treble damages under FCA',
    keyRequirements: ['No remuneration to induce referrals', 'Safe harbor compliance', 'One purpose test (any kickback purpose = violation)', 'OIG advisory opinions for complex arrangements'],
    platformControls: [
      { control: 'Arrangement screening', status: 'implemented', evidence: 'Decision engine screens financial arrangements against AKS one-purpose test' },
      { control: 'Safe harbor documentation', status: 'implemented', evidence: 'Compliance workflow documents applicable safe harbors per arrangement' },
      { control: 'FMV analysis', status: 'implemented', evidence: 'Decision reports include fair market value justification' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger provides immutable records of all healthcare financial arrangements' },
    ],
    complianceScore: 84,
  },
  {
    code: 'CMS-CoP', name: 'CMS Conditions of Participation', jurisdiction: 'US', regulator: 'CMS',
    category: 'standards', maxPenalty: 'Medicare/Medicaid decertification; CMPs',
    keyRequirements: ['Patient rights', 'Quality assessment and performance improvement', 'Infection prevention', 'Discharge planning', 'Medical records', 'Physical environment'],
    platformControls: [
      { control: 'QAPI documentation', status: 'implemented', evidence: 'Decision reports support QAPI committee documentation' },
      { control: 'Patient rights tracking', status: 'implemented', evidence: 'Consent management covers patient rights documentation' },
      { control: 'Record management', status: 'implemented', evidence: 'Decision Ledger with regulatory retention periods' },
    ],
    complianceScore: 83,
  },
  {
    code: 'FDA-21-CFR-11', name: 'FDA 21 CFR Part 11', jurisdiction: 'US', regulator: 'FDA',
    category: 'clinical', maxPenalty: 'Warning letters; consent decree; criminal prosecution',
    keyRequirements: ['Electronic signatures', 'Audit trails for electronic records', 'System validation', 'Access controls', 'Authority checks', 'Device checks'],
    platformControls: [
      { control: 'Electronic signatures', status: 'implemented', evidence: 'DCII cryptographic signing with PKI' },
      { control: 'Audit trails', status: 'implemented', evidence: 'Decision Ledger with timestamp, user, and before/after values' },
      { control: 'Access controls', status: 'implemented', evidence: 'RBAC with Keycloak SSO' },
      { control: 'System validation', status: 'implemented', evidence: 'Integration test suite validates system behavior' },
    ],
    complianceScore: 89,
  },
  {
    code: 'HITRUST-CSF', name: 'HITRUST CSF', jurisdiction: 'US/Global', regulator: 'HITRUST Alliance',
    category: 'standards', maxPenalty: 'Loss of certification; customer contract requirements',
    keyRequirements: ['Information Protection Program', 'Endpoint protection', 'Network protection', 'Vulnerability management', 'Configuration management', 'Access management'],
    platformControls: [
      { control: 'Control mapping', status: 'implemented', evidence: 'Security controls map to HITRUST CSF domains' },
      { control: 'Vulnerability management', status: 'implemented', evidence: 'SBOM generation and vulnerability scanning' },
      { control: 'Access management', status: 'implemented', evidence: 'RBAC with MFA' },
    ],
    complianceScore: 84,
  },
  {
    code: 'HL7-FHIR', name: 'HL7 FHIR', jurisdiction: 'Global', regulator: 'HL7 International',
    category: 'standards', maxPenalty: 'N/A — interoperability standard',
    keyRequirements: ['FHIR resource conformance', 'RESTful API compliance', 'Search parameter support', 'Security and privacy (SMART on FHIR)', 'Terminology binding'],
    platformControls: [
      { control: 'FHIR-ready data model', status: 'implemented', evidence: 'Healthcare vertical data models align with FHIR resources' },
      { control: 'RESTful API', status: 'implemented', evidence: 'All endpoints follow RESTful conventions' },
      { control: 'OAuth2/SMART auth', status: 'implemented', evidence: 'Keycloak SSO supports SMART on FHIR flows' },
    ],
    complianceScore: 82,
  },
  {
    code: 'ICH-E6', name: 'ICH E6(R2) Good Clinical Practice', jurisdiction: 'Global', regulator: 'ICH / National regulators',
    category: 'clinical', maxPenalty: 'Clinical hold; study termination; debarment',
    keyRequirements: ['IRB/ethics committee oversight', 'Informed consent', 'Investigator qualifications', 'Essential documents', 'Sponsor responsibilities', 'Source data verification'],
    platformControls: [
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger with Part 11 compliant audit trail' },
      { control: 'Consent tracking', status: 'implemented', evidence: 'Consent management with versioning' },
      { control: 'Document management', status: 'implemented', evidence: 'CendiaVault for essential document storage with integrity verification' },
    ],
    complianceScore: 83,
  },
  {
    code: 'ISO-13485', name: 'ISO 13485 Medical Devices QMS', jurisdiction: 'Global', regulator: 'Notified Bodies / National regulators',
    category: 'device_regulation', maxPenalty: 'Loss of certification; market withdrawal',
    keyRequirements: ['QMS establishment', 'Design and development controls', 'Risk management (ISO 14971)', 'Production and service provision', 'Measurement, analysis, improvement'],
    platformControls: [
      { control: 'Design control documentation', status: 'implemented', evidence: 'Decision Ledger tracks design decisions with rationale' },
      { control: 'Risk management', status: 'implemented', evidence: 'Enterprise risk framework maps to ISO 14971' },
      { control: 'CAPA workflow', status: 'implemented', evidence: 'Continuous compliance monitor triggers corrective actions' },
    ],
    complianceScore: 81,
  },
  {
    code: 'EU-MDR', name: 'EU Medical Device Regulation', jurisdiction: 'EU', regulator: 'Notified Bodies / National CAs',
    category: 'device_regulation', maxPenalty: '€2M-€10M depending on severity (per member state)',
    keyRequirements: ['Unique Device Identification (UDI)', 'Clinical evaluation', 'Post-market surveillance', 'Vigilance reporting', 'Technical documentation', 'Notified body conformity assessment'],
    platformControls: [
      { control: 'Technical documentation', status: 'implemented', evidence: 'EU AI Act technical documentation generator' },
      { control: 'Post-market surveillance', status: 'implemented', evidence: 'Continuous compliance monitor provides PMS data' },
      { control: 'Vigilance reporting', status: 'implemented', evidence: 'Incident Response Plan covers vigilance reports' },
    ],
    complianceScore: 80,
  },
  {
    code: 'EU-IVDR', name: 'EU In Vitro Diagnostic Regulation', jurisdiction: 'EU', regulator: 'Notified Bodies / National CAs',
    category: 'device_regulation', maxPenalty: 'Similar to MDR — member state enforcement',
    keyRequirements: ['Risk-based classification (A-D)', 'Performance evaluation', 'Post-market performance follow-up', 'Technical documentation', 'UDI-DI assignment'],
    platformControls: [
      { control: 'Classification engine', status: 'implemented', evidence: 'EU AI Act risk classification adaptable to IVDR classes' },
      { control: 'Performance tracking', status: 'implemented', evidence: 'Continuous monitoring for device performance' },
      { control: 'Technical documentation', status: 'implemented', evidence: 'Documentation generator' },
    ],
    complianceScore: 79,
  },
  {
    code: 'FDA-SaMD', name: 'FDA Software as a Medical Device', jurisdiction: 'US', regulator: 'FDA',
    category: 'device_regulation', maxPenalty: 'Warning letter; market withdrawal; consent decree',
    keyRequirements: ['SaMD risk categorization', 'Clinical evaluation', 'Software lifecycle (IEC 62304)', 'Cybersecurity (premarket and postmarket)', 'Real-world performance monitoring'],
    platformControls: [
      { control: 'Risk categorization', status: 'implemented', evidence: 'AI risk classification per SaMD categories (I-IV)' },
      { control: 'Software lifecycle', status: 'implemented', evidence: 'Version-controlled development with audit trail' },
      { control: 'Cybersecurity', status: 'implemented', evidence: 'SBOM generation, vulnerability management' },
      { control: 'Performance monitoring', status: 'implemented', evidence: 'Continuous compliance monitor' },
    ],
    complianceScore: 82,
  },
  {
    code: 'WHO-AI', name: 'WHO Ethics and Governance of AI for Health', jurisdiction: 'Global', regulator: 'WHO (guidance)',
    category: 'ai_health', maxPenalty: 'N/A — guidance document',
    keyRequirements: ['Protect human autonomy', 'Promote human well-being and safety', 'Ensure transparency and explainability', 'Foster responsibility and accountability', 'Ensure inclusiveness and equity', 'Promote responsive and sustainable AI'],
    platformControls: [
      { control: 'Human autonomy', status: 'implemented', evidence: 'Council human-in-the-loop for all health decisions' },
      { control: 'Transparency', status: 'implemented', evidence: 'Decision reports with full reasoning chains' },
      { control: 'Accountability', status: 'implemented', evidence: 'DCII Override Accountability primitive' },
      { control: 'Equity assessment', status: 'implemented', evidence: 'CendiaCrucible bias testing for health equity' },
    ],
    complianceScore: 88,
  },
];

class HealthcareExtendedService {
  private regulations: HealthcareRegulation[] = HEALTHCARE_REGULATIONS;
  private assessments: HealthcareAssessment[] = [];

  getRegulations(): HealthcareRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): HealthcareRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getByCategory(category: string): HealthcareRegulation[] {
    return this.regulations.filter(r => r.category === category);
  }

  getDashboard(): {
    totalRegulations: number;
    averageScore: number;
    byCategory: Record<string, { count: number; avgScore: number }>;
    criticalGaps: { regulation: string; control: string; status: string }[];
    fraudAbuseReadiness: number;
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

    const fraudAbuse = this.regulations.filter(r => r.category === 'fraud_abuse');
    const fraudScore = fraudAbuse.length ? Math.round(fraudAbuse.reduce((s, r) => s + r.complianceScore, 0) / fraudAbuse.length) : 0;

    return { totalRegulations: this.regulations.length, averageScore: avgScore, byCategory, criticalGaps, fraudAbuseReadiness: fraudScore };
  }

  conductAssessment(params: {
    regulationCode: string;
    facilityType: string;
  }): HealthcareAssessment {
    const reg = this.regulations.find(r => r.code === params.regulationCode);
    if (!reg) throw new Error(`Healthcare regulation ${params.regulationCode} not found`);

    const findings = reg.keyRequirements.map(req => {
      const ctrl = reg.platformControls.find(c => c.control.toLowerCase().includes(req.toLowerCase().split(' ')[0]));
      const ctrlStatus: 'met' | 'partial' | 'unmet' = ctrl?.status === 'implemented' ? 'met' : ctrl ? 'partial' : 'unmet';
      return {
        requirement: req,
        status: ctrlStatus,
        gap: ctrlStatus === 'met' ? '' : `${req} needs additional implementation`,
        remediation: ctrlStatus === 'met' ? '' : `Complete implementation of ${req}`,
      };
    });

    const assessment: HealthcareAssessment = {
      id: `hca-${crypto.randomUUID()}`,
      regulationCode: params.regulationCode,
      facilityType: params.facilityType,
      assessmentDate: new Date(),
      findings,
      overallCompliance: findings.every(f => f.status === 'met') ? 'compliant' :
        findings.some(f => f.status === 'unmet') ? 'non_compliant' : 'partially_compliant',
    };

    this.assessments.push(assessment);
    return assessment;
  }

  getAssessments(): HealthcareAssessment[] {
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
      .map(r => `${r.code}: Score ${r.complianceScore}% — review ${r.category} controls`);
    return { overallScore: overall, regulationScores: scores, recommendations };
  }
}

export const healthcareExtendedService = new HealthcareExtendedService();
