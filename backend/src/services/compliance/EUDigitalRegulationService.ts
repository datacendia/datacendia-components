/**
 * Service — EU Digital Regulation Package Compliance
 *
 * Covers: NIS2, DSA, DMA, EU Data Act, Data Governance Act,
 * EU Cyber Resilience Act, eIDAS 2.0.
 *
 * @module services/compliance/EUDigitalRegulationService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface EUDigitalRegulation {
  code: string;
  name: string;
  effectiveDate: string;
  enforcementBody: string;
  category: 'cybersecurity' | 'digital_services' | 'data_governance' | 'digital_identity';
  applicability: string;
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface NIS2Assessment {
  id: string;
  entityType: 'essential' | 'important' | 'out_of_scope';
  sector: string;
  assessmentDate: Date;
  measures: { measure: string; status: 'compliant' | 'partial' | 'non_compliant'; gap: string }[];
  overallCompliance: 'compliant' | 'partially_compliant' | 'non_compliant';
}

const EU_DIGITAL_REGULATIONS: EUDigitalRegulation[] = [
  {
    code: 'NIS2', name: 'NIS2 Directive', effectiveDate: '2024-10-17',
    enforcementBody: 'National competent authorities (CSIRT teams)',
    category: 'cybersecurity', applicability: 'Essential and important entities in critical sectors',
    maxPenalty: '€10M or 2% global turnover (essential); €7M or 1.4% (important)',
    keyRequirements: ['Risk management measures (Article 21)', 'Incident reporting (24hr early warning, 72hr notification)', 'Supply chain security', 'Business continuity management', 'Encryption and access control', 'Vulnerability handling and disclosure', 'Senior management accountability', 'Multi-factor authentication'],
    platformControls: [
      { control: 'Risk management', status: 'implemented', evidence: 'Enterprise risk framework covers NIS2 Article 21 measures' },
      { control: 'Incident reporting (24/72hr)', status: 'implemented', evidence: 'Incident Response Plan with NIS2 early warning and notification timelines' },
      { control: 'Supply chain security', status: 'implemented', evidence: 'Vendor Management Policy with security assessment' },
      { control: 'BCP', status: 'implemented', evidence: 'BCP_DR_PLAN.md' },
      { control: 'Encryption', status: 'implemented', evidence: 'AES-256, TLS 1.3' },
      { control: 'MFA', status: 'implemented', evidence: 'Keycloak SSO with MFA' },
      { control: 'Vulnerability management', status: 'implemented', evidence: 'SBOM generation with CVE tracking' },
    ],
    complianceScore: 90,
  },
  {
    code: 'DSA', name: 'Digital Services Act', effectiveDate: '2024-02-17',
    enforcementBody: 'Digital Services Coordinators / European Commission',
    category: 'digital_services', applicability: 'Intermediary services, hosting services, platforms, VLOPs/VLOSEs',
    maxPenalty: '6% global annual turnover; periodic penalties up to 5% daily turnover',
    keyRequirements: ['Transparency reporting', 'Notice and action mechanisms', 'Complaint-handling systems', 'Algorithmic transparency', 'Risk assessments for VLOPs', 'Crisis response mechanism', 'Data access for researchers'],
    platformControls: [
      { control: 'Transparency reporting', status: 'implemented', evidence: 'Compliance dashboard provides DSA transparency metrics' },
      { control: 'Complaint handling', status: 'implemented', evidence: 'CendiaDissent provides complaint mechanism' },
      { control: 'Algorithmic transparency', status: 'implemented', evidence: 'EU AI Act transparency obligations cover DSA requirements' },
      { control: 'Risk assessment', status: 'implemented', evidence: 'Enterprise risk framework includes systemic risk assessment' },
    ],
    complianceScore: 84,
  },
  {
    code: 'DMA', name: 'Digital Markets Act', effectiveDate: '2023-05-02',
    enforcementBody: 'European Commission (DG COMP)',
    category: 'digital_services', applicability: 'Designated gatekeepers (€7.5B+ turnover or €75B+ market cap)',
    maxPenalty: '10% global turnover (first); 20% (repeat); behavioral/structural remedies',
    keyRequirements: ['Data portability', 'Interoperability', 'No self-preferencing', 'Fair ranking', 'No anti-competitive bundling', 'Third-party access to platform data', 'End-user consent for data combination'],
    platformControls: [
      { control: 'Data portability', status: 'implemented', evidence: 'GDPR/DSR data portability workflow provides DMA-compliant export' },
      { control: 'Interoperability', status: 'implemented', evidence: 'RESTful APIs with OpenAPI documentation' },
      { control: 'Consent management', status: 'implemented', evidence: 'GDPR consent engine covers DMA consent requirements' },
    ],
    complianceScore: 82,
  },
  {
    code: 'EU-DATA-ACT', name: 'EU Data Act', effectiveDate: '2025-09-12',
    enforcementBody: 'National competent authorities',
    category: 'data_governance', applicability: 'IoT manufacturers, data holders, cloud providers, data recipients',
    maxPenalty: 'National enforcement; effective, proportionate, and dissuasive penalties',
    keyRequirements: ['User access to IoT-generated data', 'B2B data sharing obligations', 'Cloud switching and interoperability', 'Safeguards against unlawful data access', 'Smart contract requirements', 'Public sector data access in emergencies'],
    platformControls: [
      { control: 'Data access controls', status: 'implemented', evidence: 'RBAC with granular data access management' },
      { control: 'Cloud switching', status: 'implemented', evidence: 'Sovereign architecture supports multi-cloud deployment' },
      { control: 'Data portability', status: 'implemented', evidence: 'Export functionality for data migration' },
      { control: 'Safeguards', status: 'implemented', evidence: 'Encryption and access controls prevent unlawful access' },
    ],
    complianceScore: 83,
  },
  {
    code: 'DGA', name: 'Data Governance Act', effectiveDate: '2023-09-24',
    enforcementBody: 'National competent authorities',
    category: 'data_governance', applicability: 'Public sector bodies, data intermediaries, data altruism organizations',
    maxPenalty: 'National enforcement',
    keyRequirements: ['Re-use of protected public sector data', 'Data intermediary registration', 'Data altruism recognition', 'European Data Innovation Board', 'International data transfer safeguards'],
    platformControls: [
      { control: 'Data intermediary controls', status: 'implemented', evidence: 'CendiaGateway acts as registered data intermediary' },
      { control: 'Transfer safeguards', status: 'implemented', evidence: 'Sovereign architecture prevents unauthorized cross-border transfers' },
      { control: 'Data governance framework', status: 'implemented', evidence: 'DCII data governance maps to DGA requirements' },
    ],
    complianceScore: 81,
  },
  {
    code: 'EU-CRA', name: 'EU Cyber Resilience Act', effectiveDate: '2027-12-01',
    enforcementBody: 'National market surveillance authorities',
    category: 'cybersecurity', applicability: 'Products with digital elements (software and hardware)',
    maxPenalty: '€15M or 2.5% global turnover',
    keyRequirements: ['Security by design', 'Vulnerability handling', 'Security updates for product lifetime', 'SBOM provision', 'CE marking for cybersecurity', 'Conformity assessment', 'Incident reporting (24hr for exploited vulnerabilities)'],
    platformControls: [
      { control: 'Secure by design', status: 'implemented', evidence: 'CISA Secure by Design pledge alignment' },
      { control: 'SBOM', status: 'implemented', evidence: 'SBOM generation via scripts/generate-sbom.sh' },
      { control: 'Vulnerability handling', status: 'implemented', evidence: 'Dependency scanning and CVE tracking' },
      { control: 'Security updates', status: 'implemented', evidence: 'Version-controlled release management' },
      { control: 'Incident reporting', status: 'implemented', evidence: 'Incident Response Plan with 24hr ENISA notification' },
    ],
    complianceScore: 86,
  },
  {
    code: 'EIDAS-2.0', name: 'eIDAS 2.0', effectiveDate: '2026-01-01',
    enforcementBody: 'National supervisory bodies',
    category: 'digital_identity', applicability: 'Trust service providers, relying parties, EU Digital Identity Wallet providers',
    maxPenalty: 'National enforcement; administrative fines',
    keyRequirements: ['EU Digital Identity Wallet support', 'Qualified trust services', 'Electronic signatures/seals', 'Electronic timestamps', 'Electronic registered delivery', 'Website authentication certificates', 'Electronic attestation of attributes'],
    platformControls: [
      { control: 'Electronic signatures', status: 'implemented', evidence: 'DCII cryptographic signing infrastructure' },
      { control: 'Trust services', status: 'implemented', evidence: 'PKI infrastructure via step-ca' },
      { control: 'Timestamping', status: 'implemented', evidence: 'Cryptographic timestamps in Decision Ledger' },
      { control: 'Identity verification', status: 'implemented', evidence: 'Keycloak SSO with identity assurance levels' },
    ],
    complianceScore: 83,
  },
];

class EUDigitalRegulationService {
  private regulations: EUDigitalRegulation[] = EU_DIGITAL_REGULATIONS;
  private assessments: NIS2Assessment[] = [];

  getRegulations(): EUDigitalRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): EUDigitalRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getByCategory(category: string): EUDigitalRegulation[] {
    return this.regulations.filter(r => r.category === category);
  }

  getDashboard(): {
    totalRegulations: number;
    averageScore: number;
    byCategory: Record<string, { count: number; avgScore: number }>;
    criticalGaps: { regulation: string; control: string; status: string }[];
    nis2Ready: boolean;
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

    const nis2 = this.regulations.find(r => r.code === 'NIS2');
    return {
      totalRegulations: this.regulations.length,
      averageScore: avgScore,
      byCategory,
      criticalGaps,
      nis2Ready: (nis2?.complianceScore ?? 0) >= 85,
    };
  }

  assessNIS2(params: {
    entityType: 'essential' | 'important' | 'out_of_scope';
    sector: string;
  }): NIS2Assessment {
    const nis2 = this.regulations.find(r => r.code === 'NIS2')!;
    
    const measures = nis2.keyRequirements.map(req => {
      const matched = nis2.platformControls.some(c => c.control.toLowerCase().includes(req.toLowerCase().split(' ')[0]) && c.status === 'implemented');
      const noControl = !nis2.platformControls.some(c => c.control.toLowerCase().includes(req.toLowerCase().split(' ')[0]));
      const status: 'compliant' | 'partial' | 'non_compliant' = matched ? 'compliant' : noControl ? 'non_compliant' : 'partial';
      return { measure: req, status, gap: status === 'compliant' ? '' : `${req} needs implementation` };
    });

    const assessment: NIS2Assessment = {
      id: `nis2-${crypto.randomUUID()}`,
      entityType: params.entityType,
      sector: params.sector,
      assessmentDate: new Date(),
      measures,
      overallCompliance: measures.every(m => m.status === 'compliant') ? 'compliant' :
        measures.some(m => m.status === 'non_compliant') ? 'non_compliant' : 'partially_compliant',
    };

    this.assessments.push(assessment);
    return assessment;
  }

  getAssessments(): NIS2Assessment[] {
    return this.assessments;
  }

  getReadinessReport(): {
    overallScore: number;
    regulationScores: { code: string; name: string; score: number; effectiveDate: string }[];
    recommendations: string[];
  } {
    const scores = this.regulations.map(r => ({ code: r.code, name: r.name, score: r.complianceScore, effectiveDate: r.effectiveDate }));
    const overall = Math.round(scores.reduce((s, r) => s + r.score, 0) / scores.length);
    const recommendations = this.regulations
      .filter(r => r.complianceScore < 85)
      .map(r => `${r.code}: Score ${r.complianceScore}% — prioritize before ${r.effectiveDate}`);
    return { overallScore: overall, regulationScores: scores, recommendations };
  }
}

export const euDigitalRegulationService = new EUDigitalRegulationService();
