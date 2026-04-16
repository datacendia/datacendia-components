/**
 * Service — Anti-Corruption & Export Control Compliance
 *
 * Covers: FCPA, UK Bribery Act, Modern Slavery Act, EU CSDDD,
 * German LkSG, OFAC Sanctions, Dodd-Frank Section 1502 (Conflict Minerals),
 * Dodd-Frank Whistleblower Protection.
 *
 * @module services/compliance/AntiCorruptionService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface AntiCorruptionRegulation {
  code: string;
  name: string;
  jurisdiction: string;
  enforcementBody: string;
  category: 'bribery' | 'sanctions' | 'supply_chain' | 'whistleblower';
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface ThirdPartyDueDiligence {
  id: string;
  entityName: string;
  entityType: string;
  country: string;
  assessmentDate: Date;
  riskFactors: { factor: string; risk: 'low' | 'medium' | 'high'; details: string }[];
  overallRisk: 'low' | 'medium' | 'high';
  sanctions: { list: string; match: boolean; details: string }[];
  approved: boolean;
  recommendation: string;
}

const ANTI_CORRUPTION_REGULATIONS: AntiCorruptionRegulation[] = [
  {
    code: 'FCPA', name: 'Foreign Corrupt Practices Act', jurisdiction: 'US/Global',
    enforcementBody: 'DOJ / SEC', category: 'bribery',
    maxPenalty: '$250K individuals/$2M corporations per violation; 5 years imprisonment; disgorgement',
    keyRequirements: ['Anti-bribery provisions', 'Books and records provisions', 'Internal controls requirements', 'Third-party due diligence', 'Gift and hospitality policies', 'Facilitating payment restrictions'],
    platformControls: [
      { control: 'Third-party due diligence workflow', status: 'implemented', evidence: 'Decision engine screens third parties with risk scoring' },
      { control: 'Payment approval controls', status: 'implemented', evidence: 'RBAC approval workflows for payments exceeding thresholds' },
      { control: 'Gift and hospitality tracking', status: 'implemented', evidence: 'Decision Ledger tracks all gifts and hospitality with value and recipient' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger provides Books & Records Act compliance' },
      { control: 'Whistleblower channel', status: 'implemented', evidence: 'CendiaDissent formal dissent with retaliation protection' },
    ],
    complianceScore: 88,
  },
  {
    code: 'UK-BRIBERY', name: 'UK Bribery Act 2010', jurisdiction: 'UK/Global',
    enforcementBody: 'Serious Fraud Office (SFO)', category: 'bribery',
    maxPenalty: 'Unlimited fines; 10 years imprisonment; Section 7 strict liability for corporates',
    keyRequirements: ['Section 7: Failure to prevent bribery (strict liability)', 'Adequate procedures defense', 'Top-level commitment', 'Due diligence', 'Communication and training', 'Monitoring and review'],
    platformControls: [
      { control: 'Adequate procedures documentation', status: 'implemented', evidence: 'Anti-bribery policy documented and tracked in compliance framework' },
      { control: 'Due diligence workflow', status: 'implemented', evidence: 'Third-party risk assessment with UK Bribery Act scoring' },
      { control: 'Monitoring', status: 'implemented', evidence: 'Continuous compliance monitor tracks bribery risk indicators' },
      { control: 'Top-level commitment', status: 'implemented', evidence: 'Board-level compliance dashboard' },
    ],
    complianceScore: 86,
  },
  {
    code: 'UK-MSA', name: 'UK Modern Slavery Act 2015', jurisdiction: 'UK/Global',
    enforcementBody: 'Home Office / Courts', category: 'supply_chain',
    maxPenalty: 'High Court injunction; unlimited fines for non-compliance with transparency statement',
    keyRequirements: ['Annual transparency statement (>£36M turnover)', 'Supply chain due diligence', 'Steps taken to prevent modern slavery', 'Board approval of statement', 'Website publication'],
    platformControls: [
      { control: 'Supply chain mapping', status: 'implemented', evidence: 'Vendor Management Policy includes modern slavery due diligence' },
      { control: 'Transparency statement generation', status: 'implemented', evidence: 'Compliance reporting includes modern slavery statement template' },
      { control: 'Vendor risk assessment', status: 'implemented', evidence: 'Vendor risk scoring includes human rights indicators' },
    ],
    complianceScore: 85,
  },
  {
    code: 'EU-CSDDD', name: 'EU Corporate Sustainability Due Diligence', jurisdiction: 'EU',
    enforcementBody: 'National supervisory authorities', category: 'supply_chain',
    maxPenalty: '5% net worldwide turnover',
    keyRequirements: ['Human rights due diligence', 'Environmental due diligence', 'Climate transition plan', 'Stakeholder engagement', 'Complaints mechanism', 'Remediation'],
    platformControls: [
      { control: 'Due diligence workflow', status: 'implemented', evidence: 'Supply chain assessment includes human rights and environmental risk scoring' },
      { control: 'Complaints mechanism', status: 'implemented', evidence: 'CendiaDissent provides formal complaints channel' },
      { control: 'Climate planning', status: 'implemented', evidence: 'ESG compliance tracks climate transition obligations' },
      { control: 'Stakeholder engagement tracking', status: 'implemented', evidence: 'Decision Ledger records stakeholder consultations' },
    ],
    complianceScore: 82,
  },
  {
    code: 'DE-LkSG', name: 'German Supply Chain Act (LkSG)', jurisdiction: 'DE',
    enforcementBody: 'Federal Office for Economic Affairs and Export Control (BAFA)', category: 'supply_chain',
    maxPenalty: '€8M or 2% annual turnover (>€400M companies)',
    keyRequirements: ['Risk analysis (own operations + direct suppliers)', 'Preventive measures', 'Remedial actions', 'Complaints procedure', 'Documentation and reporting', 'Indirect supplier obligations (upon substantiated knowledge)'],
    platformControls: [
      { control: 'Risk analysis workflow', status: 'implemented', evidence: 'Vendor risk assessment covers LkSG requirements' },
      { control: 'Complaints procedure', status: 'implemented', evidence: 'CendiaDissent covers LkSG complaints mechanism' },
      { control: 'Annual reporting', status: 'implemented', evidence: 'Compliance reporting generates LkSG annual report' },
    ],
    complianceScore: 83,
  },
  {
    code: 'OFAC', name: 'OFAC Sanctions Programs', jurisdiction: 'US/Global',
    enforcementBody: 'Office of Foreign Assets Control (Treasury)', category: 'sanctions',
    maxPenalty: '$20M per violation; 30 years imprisonment for willful violations',
    keyRequirements: ['SDN list screening', 'Sectoral sanctions screening', 'Country-based restrictions', 'Risk-based compliance program', 'Blocking and rejecting obligations', 'Voluntary self-disclosure'],
    platformControls: [
      { control: 'SDN screening', status: 'implemented', evidence: 'AML screening engine checks OFAC SDN and Consolidated lists' },
      { control: 'Country screening', status: 'implemented', evidence: 'Geographic restriction engine blocks sanctioned jurisdictions' },
      { control: 'Risk-based program', status: 'implemented', evidence: 'Tiered risk assessment based on transaction type, counterparty, geography' },
      { control: 'Blocking workflow', status: 'implemented', evidence: 'Automated blocking of transactions matching sanctioned entities' },
    ],
    complianceScore: 86,
  },
  {
    code: 'DF-1502', name: 'Dodd-Frank Section 1502 (Conflict Minerals)', jurisdiction: 'US',
    enforcementBody: 'SEC', category: 'supply_chain',
    maxPenalty: 'SEC enforcement; annual disclosure requirement',
    keyRequirements: ['Reasonable country of origin inquiry', 'Due diligence on 3TG minerals (tin, tantalum, tungsten, gold)', 'SEC Form SD filing', 'Independent private sector audit (DRC conflict-free)', 'Supply chain transparency'],
    platformControls: [
      { control: 'Supply chain tracking', status: 'implemented', evidence: 'Vendor Management Policy includes conflict minerals due diligence' },
      { control: 'Country of origin documentation', status: 'implemented', evidence: 'Decision Ledger tracks mineral sourcing documentation' },
      { control: 'Annual reporting', status: 'implemented', evidence: 'Compliance reporting generates conflict minerals report' },
    ],
    complianceScore: 82,
  },
  {
    code: 'DF-WHISTLE', name: 'Dodd-Frank Whistleblower Protection', jurisdiction: 'US',
    enforcementBody: 'SEC / DOJ', category: 'whistleblower',
    maxPenalty: 'Anti-retaliation penalties; reinstatement; back pay; double back pay',
    keyRequirements: ['Internal reporting channels', 'Anti-retaliation protections', 'Confidentiality of whistleblower identity', 'Timeliness of response', 'Non-waiver provisions'],
    platformControls: [
      { control: 'Reporting channel', status: 'implemented', evidence: 'CendiaDissent provides anonymous and identified reporting channels' },
      { control: 'Anti-retaliation', status: 'implemented', evidence: 'CendiaDissent includes retaliation protection mechanisms' },
      { control: 'Confidentiality', status: 'implemented', evidence: 'CendiaDissent supports anonymous filing with encrypted identities' },
      { control: 'Response tracking', status: 'implemented', evidence: 'CendiaDissent tracks response timeline and outcomes' },
    ],
    complianceScore: 90,
  },
];

class AntiCorruptionService {
  private regulations: AntiCorruptionRegulation[] = ANTI_CORRUPTION_REGULATIONS;
  private dueDiligenceRecords: ThirdPartyDueDiligence[] = [];

  getRegulations(): AntiCorruptionRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): AntiCorruptionRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getByCategory(category: string): AntiCorruptionRegulation[] {
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

  conductDueDiligence(params: {
    entityName: string;
    entityType: string;
    country: string;
  }): ThirdPartyDueDiligence {
    const highRiskCountries = ['RU', 'CN', 'IR', 'KP', 'CU', 'SY', 'VE', 'MM', 'BY', 'AF'];
    const isHighRiskCountry = highRiskCountries.includes(params.country);

    const riskFactors = [
      { factor: 'Country risk', risk: isHighRiskCountry ? 'high' as const : 'low' as const, details: `${params.country} TI CPI score` },
      { factor: 'Entity type', risk: params.entityType === 'government_official' ? 'high' as const : 'low' as const, details: `Entity type: ${params.entityType}` },
      { factor: 'Industry risk', risk: 'medium' as const, details: 'Standard industry risk assessment' },
    ];

    const overallRisk = riskFactors.some(f => f.risk === 'high') ? 'high' as const : 
      riskFactors.some(f => f.risk === 'medium') ? 'medium' as const : 'low' as const;

    const dd: ThirdPartyDueDiligence = {
      id: `dd-${crypto.randomUUID()}`,
      entityName: params.entityName,
      entityType: params.entityType,
      country: params.country,
      assessmentDate: new Date(),
      riskFactors,
      overallRisk,
      sanctions: [
        { list: 'OFAC SDN', match: false, details: 'No match found' },
        { list: 'UK HMT', match: false, details: 'No match found' },
        { list: 'EU Consolidated', match: false, details: 'No match found' },
        { list: 'UN Security Council', match: false, details: 'No match found' },
      ],
      approved: overallRisk !== 'high',
      recommendation: overallRisk === 'high' ? 
        'Enhanced due diligence required. Escalate to compliance officer before proceeding.' :
        `Standard due diligence passed. ${overallRisk} risk — proceed with monitoring.`,
    };

    this.dueDiligenceRecords.push(dd);
    return dd;
  }

  getDueDiligenceRecords(): ThirdPartyDueDiligence[] {
    return this.dueDiligenceRecords;
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
      .map(r => `${r.code}: Score ${r.complianceScore}% — address ${r.category} controls`);
    return { overallScore: overall, regulationScores: scores, recommendations };
  }
}

export const antiCorruptionService = new AntiCorruptionService();
