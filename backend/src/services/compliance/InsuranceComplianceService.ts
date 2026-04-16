/**
 * Service — Insurance Compliance
 *
 * Covers: Solvency II, NAIC Model Laws, MDL-668, EU IDD, ACORD Standards.
 *
 * @module services/compliance/InsuranceComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface InsuranceRegulation {
  code: string;
  name: string;
  jurisdiction: string;
  regulator: string;
  category: 'prudential' | 'data_security' | 'distribution' | 'standards';
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface InsuranceAssessment {
  id: string;
  regulationCode: string;
  entityType: string;
  assessmentDate: Date;
  findings: { requirement: string; status: 'met' | 'partial' | 'unmet'; gap: string }[];
  overallCompliance: 'compliant' | 'partially_compliant' | 'non_compliant';
}

const INSURANCE_REGULATIONS: InsuranceRegulation[] = [
  {
    code: 'SOLVENCY-II', name: 'Solvency II', jurisdiction: 'EU', regulator: 'EIOPA / National supervisors',
    category: 'prudential',
    maxPenalty: 'National supervisor enforcement; capital add-ons; license restrictions',
    keyRequirements: ['Pillar 1: Quantitative requirements (SCR, MCR)', 'Pillar 2: Governance and risk management (ORSA)', 'Pillar 3: Reporting and disclosure (QRTs, SFCR)', 'Own Risk and Solvency Assessment', 'Fit and proper requirements', 'Outsourcing controls', 'Actuarial function'],
    platformControls: [
      { control: 'Risk management framework', status: 'implemented', evidence: 'Enterprise risk framework supports ORSA documentation' },
      { control: 'Governance documentation', status: 'implemented', evidence: 'DCII governance maps to Solvency II Pillar 2' },
      { control: 'Reporting infrastructure', status: 'implemented', evidence: 'Compliance reporting generates QRT-compatible data' },
      { control: 'Outsourcing controls', status: 'implemented', evidence: 'Vendor Management Policy covers Solvency II outsourcing requirements' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger provides Pillar 2 audit evidence' },
    ],
    complianceScore: 84,
  },
  {
    code: 'NAIC-MODEL', name: 'NAIC Model Laws', jurisdiction: 'US', regulator: 'State insurance departments',
    category: 'prudential',
    maxPenalty: 'State-level enforcement; license suspension/revocation; fines vary by state',
    keyRequirements: ['Risk-Based Capital (RBC)', 'Market conduct standards', 'Producer licensing', 'Claims handling standards', 'Rate and form filing', 'Holding company regulation', 'Corporate governance annual disclosure (CGAD)'],
    platformControls: [
      { control: 'Governance disclosure', status: 'implemented', evidence: 'Compliance reporting supports CGAD preparation' },
      { control: 'Risk management', status: 'implemented', evidence: 'Enterprise risk framework' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger for claims and underwriting decisions' },
      { control: 'Market conduct monitoring', status: 'implemented', evidence: 'Continuous compliance monitor tracks market conduct indicators' },
    ],
    complianceScore: 83,
  },
  {
    code: 'MDL-668', name: 'NAIC Insurance Data Security Model Law (MDL-668)', jurisdiction: 'US',
    regulator: 'State insurance departments (adopted by 20+ states)',
    category: 'data_security',
    maxPenalty: 'Varies by adopting state; typically $10K-$500K per violation',
    keyRequirements: ['Information security program', 'Risk assessment', 'Board oversight', 'Incident response plan', 'Investigation of cybersecurity events', 'Notification (72 hours to insurance commissioner)', 'Third-party service provider oversight', 'Annual certification to commissioner'],
    platformControls: [
      { control: 'Information security program', status: 'implemented', evidence: 'Information Security Policy' },
      { control: 'Risk assessment', status: 'implemented', evidence: 'Enterprise risk assessment' },
      { control: 'Board oversight', status: 'implemented', evidence: 'Compliance dashboard for board reporting' },
      { control: 'Incident response', status: 'implemented', evidence: 'Incident Response Plan with 72hr commissioner notification' },
      { control: 'Third-party oversight', status: 'implemented', evidence: 'Vendor Management Policy' },
      { control: 'Annual certification', status: 'implemented', evidence: 'Compliance reporting generates annual certification' },
    ],
    complianceScore: 90,
  },
  {
    code: 'IDD', name: 'EU Insurance Distribution Directive', jurisdiction: 'EU',
    regulator: 'EIOPA / National competent authorities',
    category: 'distribution',
    maxPenalty: 'National enforcement; fines; license revocation',
    keyRequirements: ['Product oversight and governance (POG)', 'Demands and needs assessment', 'Suitability assessment (IBIP)', 'Conflicts of interest management', 'Remuneration disclosure', 'Cross-selling requirements', 'Professional and organisational requirements'],
    platformControls: [
      { control: 'Product governance', status: 'implemented', evidence: 'Decision engine supports POG target market definition and monitoring' },
      { control: 'Demands and needs', status: 'implemented', evidence: 'Decision reports document customer needs assessment' },
      { control: 'Suitability assessment', status: 'implemented', evidence: 'Risk classification engine for IBIP suitability' },
      { control: 'Conflicts of interest', status: 'implemented', evidence: 'Conflict management tracked in Decision Ledger' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger for distribution activity' },
    ],
    complianceScore: 86,
  },
  {
    code: 'ACORD', name: 'ACORD Standards', jurisdiction: 'Global',
    regulator: 'ACORD (Association for Cooperative Operations Research and Development)',
    category: 'standards',
    maxPenalty: 'N/A — industry interoperability standard; but required by major carriers/reinsurers',
    keyRequirements: ['ACORD data standards compliance', 'ACORD forms (certificates, applications)', 'ACORD messaging (XML/JSON)', 'eLinking (real-time data exchange)', 'ACORD Reference Architecture', 'Industry code lists'],
    platformControls: [
      { control: 'Data model alignment', status: 'implemented', evidence: 'Insurance vertical data model maps to ACORD standards' },
      { control: 'Standard code lists', status: 'implemented', evidence: 'Framework registry includes ACORD industry code mappings' },
      { control: 'API interoperability', status: 'implemented', evidence: 'RESTful APIs support ACORD-compatible data exchange formats' },
      { control: 'Form generation', status: 'implemented', evidence: 'Compliance reporting supports ACORD certificate generation' },
    ],
    complianceScore: 82,
  },
];

class InsuranceComplianceService {
  private regulations: InsuranceRegulation[] = INSURANCE_REGULATIONS;
  private assessments: InsuranceAssessment[] = [];

  getRegulations(): InsuranceRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): InsuranceRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getByCategory(category: string): InsuranceRegulation[] {
    return this.regulations.filter(r => r.category === category);
  }

  getDashboard(): {
    totalRegulations: number;
    averageScore: number;
    byCategory: Record<string, { count: number; avgScore: number }>;
    criticalGaps: { regulation: string; control: string; status: string }[];
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

    return { totalRegulations: this.regulations.length, averageScore: avgScore, byCategory, criticalGaps };
  }

  conductAssessment(params: {
    regulationCode: string;
    entityType: string;
  }): InsuranceAssessment {
    const reg = this.regulations.find(r => r.code === params.regulationCode);
    if (!reg) throw new Error(`Insurance regulation ${params.regulationCode} not found`);

    const findings = reg.keyRequirements.map(req => {
      const ctrl = reg.platformControls.find(c => c.control.toLowerCase().includes(req.toLowerCase().split(' ')[0]));
      const status: 'met' | 'partial' | 'unmet' = ctrl?.status === 'implemented' ? 'met' : ctrl ? 'partial' : 'unmet';
      return {
        requirement: req,
        status,
        gap: status === 'met' ? '' : `${req}: requires additional implementation`,
      };
    });

    const assessment: InsuranceAssessment = {
      id: `ins-${crypto.randomUUID()}`,
      regulationCode: params.regulationCode,
      entityType: params.entityType,
      assessmentDate: new Date(),
      findings,
      overallCompliance: findings.every(f => f.status === 'met') ? 'compliant' :
        findings.some(f => f.status === 'unmet') ? 'non_compliant' : 'partially_compliant',
    };

    this.assessments.push(assessment);
    return assessment;
  }

  getAssessments(): InsuranceAssessment[] {
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

export const insuranceComplianceService = new InsuranceComplianceService();
