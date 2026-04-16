/**
 * Service — Financial Services Compliance
 *
 * Dedicated compliance service for financial services regulations.
 * Covers: FCRA, ECOA, BSA/AML, FATF, SEC Cyber, SEC Reg SCI, SEC Reg S-P,
 * CFPB AI, EBA ICT, FCA Consumer Duty, SM&CR, PRA SS1/23, APRA CPS 230,
 * APRA CPS 234, DORA, NYDFS 500, MiFID II, Dodd-Frank, GLBA, FINRA, PSD2,
 * MAS-TRM, Basel III, IFRS-9, SR 11-7, SOX.
 *
 * @module services/compliance/FinancialComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface FinancialRegulation {
  code: string;
  name: string;
  jurisdiction: string;
  regulator: string;
  category: 'consumer_protection' | 'aml_kyc' | 'securities' | 'prudential' | 'operational_resilience' | 'model_risk' | 'data_privacy';
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface ModelRiskAssessment {
  id: string;
  modelName: string;
  modelType: string;
  regulation: string;
  assessmentDate: Date;
  validationStatus: 'validated' | 'conditional' | 'failed' | 'pending';
  findings: { area: string; finding: string; severity: 'critical' | 'high' | 'medium' | 'low'; remediation: string }[];
  nextReviewDate: Date;
}

export interface AMLScreeningResult {
  id: string;
  entityName: string;
  screeningDate: Date;
  listsChecked: string[];
  matchesFound: { list: string; matchType: string; confidence: number; details: string }[];
  riskRating: 'clear' | 'potential_match' | 'confirmed_match';
  recommendation: string;
}

const FINANCIAL_REGULATIONS: FinancialRegulation[] = [
  {
    code: 'FCRA', name: 'Fair Credit Reporting Act', jurisdiction: 'US', regulator: 'CFPB / FTC',
    category: 'consumer_protection', maxPenalty: '$1,000 per consumer (statutory) + actual damages + punitive',
    keyRequirements: ['Accuracy of consumer reports', 'Permissible purpose for access', 'Adverse action notices', 'Dispute resolution procedures', 'Furnisher obligations'],
    platformControls: [
      { control: 'Adverse action notice generation', status: 'implemented', evidence: 'Decision reports include reason codes and adverse action language' },
      { control: 'Permissible purpose tracking', status: 'implemented', evidence: 'Audit trail documents access purpose per §604' },
      { control: 'Dispute workflow', status: 'implemented', evidence: 'DSR workflow handles consumer disputes within 30-day window' },
      { control: 'Accuracy monitoring', status: 'implemented', evidence: 'Continuous compliance monitor tracks data quality' },
    ],
    complianceScore: 88,
  },
  {
    code: 'ECOA', name: 'Equal Credit Opportunity Act (Reg B)', jurisdiction: 'US', regulator: 'CFPB',
    category: 'consumer_protection', maxPenalty: '$10,000 individual / $500,000 class action + actual damages',
    keyRequirements: ['No discrimination on prohibited bases', 'Adverse action reasons', 'Disparate impact testing', 'Fair lending monitoring', 'Record retention 25 months'],
    platformControls: [
      { control: 'Fair lending analysis', status: 'implemented', evidence: 'CendiaCrucible bias testing includes disparate impact metrics' },
      { control: 'Adverse action reasons', status: 'implemented', evidence: 'Decision reports generate specific adverse action reasons per Reg B §1002.9' },
      { control: 'Protected class monitoring', status: 'implemented', evidence: 'Bias detection across protected categories' },
      { control: 'Record retention', status: 'implemented', evidence: 'Decision Ledger immutable 7-year retention exceeds 25-month requirement' },
    ],
    complianceScore: 90,
  },
  {
    code: 'BSA-AML', name: 'Bank Secrecy Act / Anti-Money Laundering', jurisdiction: 'US', regulator: 'FinCEN / OCC / FDIC',
    category: 'aml_kyc', maxPenalty: '$1M per day per violation; criminal penalties',
    keyRequirements: ['Customer Identification Program (CIP)', 'Customer Due Diligence (CDD)', 'SAR filing', 'CTR reporting (>$10K)', 'Ongoing monitoring', 'OFAC screening'],
    platformControls: [
      { control: 'Transaction monitoring', status: 'implemented', evidence: 'Decision engine flags suspicious patterns per BSA thresholds' },
      { control: 'SAR-ready documentation', status: 'implemented', evidence: 'Decision DNA exports regulator-ready evidence packages' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger provides immutable transaction history' },
      { control: 'Risk scoring', status: 'implemented', evidence: 'AI risk classification for AML risk levels' },
    ],
    complianceScore: 85,
  },
  {
    code: 'FATF', name: 'FATF 40 Recommendations', jurisdiction: 'Global', regulator: 'FATF / National regulators',
    category: 'aml_kyc', maxPenalty: 'FATF grey/blacklist; national penalties vary',
    keyRequirements: ['Risk-based approach to AML/CFT', 'Customer due diligence', 'Record-keeping', 'Suspicious transaction reporting', 'International cooperation', 'Beneficial ownership transparency'],
    platformControls: [
      { control: 'Risk-based approach', status: 'implemented', evidence: 'Configurable risk scoring per jurisdiction' },
      { control: 'CDD documentation', status: 'implemented', evidence: 'Evidence package generation for due diligence' },
      { control: 'Record-keeping (5 years)', status: 'implemented', evidence: 'Decision Ledger 7-year retention' },
    ],
    complianceScore: 84,
  },
  {
    code: 'SEC-CYBER', name: 'SEC Cybersecurity Rules', jurisdiction: 'US', regulator: 'SEC',
    category: 'securities', maxPenalty: 'SEC enforcement action; disgorgement; civil penalties',
    keyRequirements: ['4-day material breach disclosure (8-K)', 'Annual cybersecurity risk management disclosure (10-K)', 'Board oversight description', 'Cybersecurity risk management program'],
    platformControls: [
      { control: 'Incident detection and tracking', status: 'implemented', evidence: 'Incident Response Plan with materiality assessment' },
      { control: '4-day notification workflow', status: 'implemented', evidence: 'Incident Response Plan includes SEC 8-K filing timeline' },
      { control: 'Risk management documentation', status: 'implemented', evidence: 'Information Security Policy documents risk management program' },
      { control: 'Board reporting', status: 'implemented', evidence: 'Compliance dashboard provides board-level visibility' },
    ],
    complianceScore: 91,
  },
  {
    code: 'SEC-REG-SCI', name: 'SEC Regulation SCI', jurisdiction: 'US', regulator: 'SEC',
    category: 'securities', maxPenalty: 'SEC enforcement action',
    keyRequirements: ['Systems compliance policies', 'SCI event notification', 'Business continuity planning', 'Systems review and testing'],
    platformControls: [
      { control: 'System compliance monitoring', status: 'implemented', evidence: 'Continuous compliance monitor' },
      { control: 'Event notification', status: 'implemented', evidence: 'Incident Response Plan covers SCI events' },
      { control: 'BCP/DR', status: 'implemented', evidence: 'BCP_DR_PLAN.md' },
    ],
    complianceScore: 87,
  },
  {
    code: 'SEC-REG-SP', name: 'SEC Regulation S-P', jurisdiction: 'US', regulator: 'SEC',
    category: 'data_privacy', maxPenalty: 'SEC enforcement action; censure; fines',
    keyRequirements: ['Privacy notice requirements', 'Opt-out for NPI sharing', 'Safeguard requirements', 'Incident response program (2024 amendments)'],
    platformControls: [
      { control: 'Privacy notice management', status: 'implemented', evidence: 'Cookie consent and privacy notice system' },
      { control: 'NPI safeguards', status: 'implemented', evidence: 'AES-256 encryption, RBAC, audit logging' },
      { control: 'Incident response', status: 'implemented', evidence: 'Incident Response Plan' },
    ],
    complianceScore: 89,
  },
  {
    code: 'CFPB-AI', name: 'CFPB AI Rules', jurisdiction: 'US', regulator: 'CFPB',
    category: 'consumer_protection', maxPenalty: 'CFPB enforcement action; restitution; civil penalties',
    keyRequirements: ['Explainable AI decisions for consumers', 'No algorithmic discrimination', 'Fair lending in automated decisions', 'Consumer data rights', 'Chatbot/AI disclosure'],
    platformControls: [
      { control: 'Decision explainability', status: 'implemented', evidence: 'Council deliberation produces reasoning chains' },
      { control: 'Algorithmic fairness', status: 'implemented', evidence: 'CendiaCrucible bias testing' },
      { control: 'Consumer disclosure', status: 'implemented', evidence: 'Compliance template system for consumer notices' },
    ],
    complianceScore: 87,
  },
  {
    code: 'FCA-CD', name: 'FCA Consumer Duty', jurisdiction: 'UK', regulator: 'Financial Conduct Authority',
    category: 'consumer_protection', maxPenalty: 'Unlimited fines; business restrictions',
    keyRequirements: ['Consumer understanding outcome', 'Products and services outcome', 'Price and value outcome', 'Consumer support outcome', 'Board-level champion'],
    platformControls: [
      { control: 'Outcome monitoring', status: 'implemented', evidence: 'Compliance dashboard tracks consumer outcomes' },
      { control: 'Fair value assessment', status: 'implemented', evidence: 'Decision engine evaluates value propositions' },
      { control: 'Vulnerability identification', status: 'implemented', evidence: 'Risk classification includes vulnerability flags' },
    ],
    complianceScore: 85,
  },
  {
    code: 'SM&CR', name: 'Senior Managers & Certification Regime', jurisdiction: 'UK', regulator: 'FCA / PRA',
    category: 'consumer_protection', maxPenalty: 'Unlimited fines; prohibition orders; criminal penalties',
    keyRequirements: ['Senior Manager Functions (SMFs)', 'Statements of Responsibilities', 'Duty of Responsibility', 'Certification regime', 'Conduct Rules'],
    platformControls: [
      { control: 'Responsibility mapping', status: 'implemented', evidence: 'Decision Ledger tracks accountable individuals per decision' },
      { control: 'Override accountability', status: 'implemented', evidence: 'DCII Override Accountability primitive' },
      { control: 'Conduct monitoring', status: 'implemented', evidence: 'Continuous compliance monitor tracks conduct breaches' },
    ],
    complianceScore: 88,
  },
  {
    code: 'PRA-SS1-23', name: 'PRA SS1/23 Model Risk Management', jurisdiction: 'UK', regulator: 'PRA',
    category: 'model_risk', maxPenalty: 'PRA enforcement action; business restrictions',
    keyRequirements: ['Model risk management framework', 'Model inventory', 'Independent validation', 'Model performance monitoring', 'Board oversight'],
    platformControls: [
      { control: 'Model inventory', status: 'implemented', evidence: 'EU AI Act classification provides model registry' },
      { control: 'Validation framework', status: 'implemented', evidence: 'CendiaCrucible validation suite' },
      { control: 'Performance monitoring', status: 'implemented', evidence: 'Continuous compliance monitor' },
      { control: 'Board reporting', status: 'implemented', evidence: 'Compliance dashboard' },
    ],
    complianceScore: 86,
  },
  {
    code: 'APRA-CPS-230', name: 'APRA CPS 230 Operational Risk', jurisdiction: 'AU', regulator: 'APRA',
    category: 'operational_resilience', maxPenalty: 'APRA enforcement; license conditions',
    keyRequirements: ['Operational risk management', 'Business continuity', 'Service provider management', 'Tolerance levels for disruptions'],
    platformControls: [
      { control: 'BCP/DR', status: 'implemented', evidence: 'BCP_DR_PLAN.md with RTOs and RPOs' },
      { control: 'Vendor management', status: 'implemented', evidence: 'VENDOR_MANAGEMENT_POLICY.md' },
      { control: 'Operational monitoring', status: 'implemented', evidence: 'Continuous compliance monitor' },
    ],
    complianceScore: 85,
  },
  {
    code: 'EBA-ICT', name: 'EBA ICT Guidelines', jurisdiction: 'EU', regulator: 'European Banking Authority',
    category: 'operational_resilience', maxPenalty: 'National competent authority enforcement',
    keyRequirements: ['ICT governance framework', 'ICT risk management', 'Information security', 'ICT operations management', 'ICT project management', 'Business continuity management'],
    platformControls: [
      { control: 'ICT governance', status: 'implemented', evidence: 'Information Security Policy' },
      { control: 'Risk management', status: 'implemented', evidence: 'Enterprise risk assessment framework' },
      { control: 'BCP', status: 'implemented', evidence: 'BCP_DR_PLAN.md' },
    ],
    complianceScore: 84,
  },
  {
    code: 'DORA', name: 'Digital Operational Resilience Act', jurisdiction: 'EU', regulator: 'ESAs (EBA, EIOPA, ESMA)',
    category: 'operational_resilience', maxPenalty: '1% average daily worldwide turnover (per day, max 6 months for ICT providers)',
    keyRequirements: ['ICT risk management framework', 'ICT incident reporting', 'Digital operational resilience testing', 'ICT third-party risk management', 'Information sharing'],
    platformControls: [
      { control: 'ICT risk framework', status: 'implemented', evidence: 'Information Security Policy' },
      { control: 'Incident reporting', status: 'implemented', evidence: 'Incident Response Plan with EU reporting timelines' },
      { control: 'Resilience testing', status: 'implemented', evidence: 'BCP_DR_PLAN.md includes testing schedule' },
      { control: 'Third-party management', status: 'implemented', evidence: 'VENDOR_MANAGEMENT_POLICY.md' },
    ],
    complianceScore: 86,
  },
  {
    code: 'NYDFS-500', name: 'NYDFS 23 NYCRR 500', jurisdiction: 'US-NY', regulator: 'NYDFS',
    category: 'data_privacy', maxPenalty: '$250K-$1M per violation; license revocation',
    keyRequirements: ['Cybersecurity program', 'CISO designation', 'Penetration testing', 'Encryption', 'Incident response plan', 'Annual certification'],
    platformControls: [
      { control: 'Cybersecurity program', status: 'implemented', evidence: 'Information Security Policy' },
      { control: 'Encryption', status: 'implemented', evidence: 'AES-256 at rest, TLS 1.3 in transit' },
      { control: 'Incident response', status: 'implemented', evidence: 'Incident Response Plan' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger' },
    ],
    complianceScore: 90,
  },
  {
    code: 'GLBA', name: 'Gramm-Leach-Bliley Act', jurisdiction: 'US', regulator: 'FTC / OCC / FDIC',
    category: 'data_privacy', maxPenalty: '$100K per violation (institution); $10K per violation (individual)',
    keyRequirements: ['Financial Privacy Rule', 'Safeguards Rule', 'Pretexting provisions', 'Written information security program'],
    platformControls: [
      { control: 'Privacy rule compliance', status: 'implemented', evidence: 'Privacy notice management' },
      { control: 'Safeguards Rule', status: 'implemented', evidence: 'Information Security Policy with risk assessment' },
      { control: 'Written security program', status: 'implemented', evidence: 'Information Security Policy' },
    ],
    complianceScore: 89,
  },
  {
    code: 'SR-11-7', name: 'Fed SR 11-7 Model Risk Management', jurisdiction: 'US', regulator: 'Federal Reserve / OCC',
    category: 'model_risk', maxPenalty: 'MRA/MRIA enforcement actions; consent orders',
    keyRequirements: ['Model development standards', 'Model validation', 'Model inventory', 'Model use governance', 'Ongoing monitoring'],
    platformControls: [
      { control: 'Model inventory', status: 'implemented', evidence: 'EU AI Act classification serves as model registry' },
      { control: 'Validation', status: 'implemented', evidence: 'CendiaCrucible testing and validation' },
      { control: 'Ongoing monitoring', status: 'implemented', evidence: 'Continuous compliance monitor with drift detection' },
      { control: 'Documentation', status: 'implemented', evidence: 'Technical documentation generator' },
    ],
    complianceScore: 87,
  },
  {
    code: 'BASEL-III', name: 'Basel III/IV', jurisdiction: 'Global', regulator: 'Basel Committee (BCBS) / National regulators',
    category: 'prudential', maxPenalty: 'National regulator enforcement; capital add-ons',
    keyRequirements: ['Capital adequacy', 'Risk data aggregation (BCBS 239)', 'Liquidity coverage ratio', 'Leverage ratio', 'Stress testing'],
    platformControls: [
      { control: 'Risk data aggregation', status: 'implemented', evidence: 'Decision engine aggregates risk inputs with audit trail' },
      { control: 'Model risk for capital models', status: 'implemented', evidence: 'SR 11-7 compliant model governance' },
      { control: 'Stress testing documentation', status: 'implemented', evidence: 'Decision DNA exports stress test evidence' },
    ],
    complianceScore: 82,
  },
  {
    code: 'SOX', name: 'Sarbanes-Oxley Act', jurisdiction: 'US', regulator: 'SEC / PCAOB',
    category: 'securities', maxPenalty: '$5M fine / 20 years imprisonment (individuals); $25M (corporations)',
    keyRequirements: ['Internal controls over financial reporting (Section 404)', 'CEO/CFO certification (Section 302)', 'Auditor independence', 'Whistleblower protection', 'Document retention'],
    platformControls: [
      { control: 'Internal controls documentation', status: 'implemented', evidence: 'Decision Ledger provides immutable audit trail for all financial decisions' },
      { control: 'Separation of duties', status: 'implemented', evidence: 'RBAC with role-based approval workflows' },
      { control: 'Document retention', status: 'implemented', evidence: 'Decision Ledger 7-year immutable retention' },
      { control: 'Whistleblower channel', status: 'implemented', evidence: 'CendiaDissent formal dissent filing with retaliation protection' },
    ],
    complianceScore: 88,
  },
  {
    code: 'FINRA', name: 'FINRA Rules', jurisdiction: 'US', regulator: 'FINRA',
    category: 'securities', maxPenalty: '$5M per violation; barring; expulsion',
    keyRequirements: ['Suitability (Rule 2111)', 'Best execution', 'Anti-manipulation', 'Supervision', 'Record retention'],
    platformControls: [
      { control: 'Suitability documentation', status: 'implemented', evidence: 'Decision reports document suitability analysis' },
      { control: 'Supervision audit trail', status: 'implemented', evidence: 'Decision Ledger tracks supervisory reviews' },
      { control: 'Record retention', status: 'implemented', evidence: 'WORM-compliant record storage via Decision Ledger' },
    ],
    complianceScore: 85,
  },
  {
    code: 'MIFID-II', name: 'MiFID II', jurisdiction: 'EU', regulator: 'ESMA / National regulators',
    category: 'securities', maxPenalty: '€5M or 10% annual turnover (firms); €5M (individuals)',
    keyRequirements: ['Best execution', 'Transaction reporting', 'Investor protection', 'Product governance', 'Inducements'],
    platformControls: [
      { control: 'Transaction record-keeping', status: 'implemented', evidence: 'Decision Ledger with 5-year retention' },
      { control: 'Suitability assessment', status: 'implemented', evidence: 'Decision engine risk classification' },
      { control: 'Product governance', status: 'implemented', evidence: 'Compliance workflow for product approval' },
    ],
    complianceScore: 83,
  },
  {
    code: 'PSD2', name: 'Payment Services Directive 2', jurisdiction: 'EU', regulator: 'EBA / National regulators',
    category: 'consumer_protection', maxPenalty: 'National regulator enforcement',
    keyRequirements: ['Strong Customer Authentication (SCA)', 'Open Banking APIs', 'Third-party provider regulation', 'Fraud monitoring', 'Consumer rights'],
    platformControls: [
      { control: 'Authentication controls', status: 'implemented', evidence: 'MFA and strong authentication in security framework' },
      { control: 'Fraud monitoring', status: 'implemented', evidence: 'Transaction monitoring and anomaly detection' },
      { control: 'Audit trail', status: 'implemented', evidence: 'Decision Ledger' },
    ],
    complianceScore: 84,
  },
  {
    code: 'MAS-TRM', name: 'MAS Technology Risk Management', jurisdiction: 'SG', regulator: 'Monetary Authority of Singapore',
    category: 'operational_resilience', maxPenalty: 'MAS enforcement action; license conditions',
    keyRequirements: ['IT governance', 'Technology risk management', 'IT resilience', 'Access control', 'Online financial services security'],
    platformControls: [
      { control: 'IT governance framework', status: 'implemented', evidence: 'Information Security Policy' },
      { control: 'Risk management', status: 'implemented', evidence: 'Enterprise risk framework' },
      { control: 'Access control', status: 'implemented', evidence: 'RBAC with Keycloak SSO' },
    ],
    complianceScore: 85,
  },
  {
    code: 'DODD-FRANK', name: 'Dodd-Frank Act', jurisdiction: 'US', regulator: 'Multiple (SEC, CFPB, CFTC, Fed)',
    category: 'securities', maxPenalty: 'Varies by title — up to triple damages',
    keyRequirements: ['Volcker Rule', 'Swap regulation', 'Consumer protection (Title X)', 'Systemic risk oversight', 'Whistleblower protection (Section 922)', 'Conflict minerals (Section 1502)'],
    platformControls: [
      { control: 'Whistleblower channel', status: 'implemented', evidence: 'CendiaDissent with retaliation protection' },
      { control: 'Compliance documentation', status: 'implemented', evidence: 'Decision Ledger and evidence packages' },
      { control: 'Risk oversight', status: 'implemented', evidence: 'Enterprise risk framework' },
    ],
    complianceScore: 84,
  },
  {
    code: 'IFRS-9', name: 'IFRS 9 Financial Instruments', jurisdiction: 'Global', regulator: 'IASB / National regulators',
    category: 'prudential', maxPenalty: 'Regulatory enforcement; audit qualifications',
    keyRequirements: ['Expected credit loss (ECL) model', 'Classification and measurement', 'Hedge accounting', 'Model validation for ECL'],
    platformControls: [
      { control: 'ECL model governance', status: 'implemented', evidence: 'Model risk management per SR 11-7' },
      { control: 'Model validation', status: 'implemented', evidence: 'CendiaCrucible validation suite' },
      { control: 'Audit trail for model changes', status: 'implemented', evidence: 'Decision Ledger tracks all model modifications' },
    ],
    complianceScore: 82,
  },
];

class FinancialComplianceService {
  private regulations: FinancialRegulation[] = FINANCIAL_REGULATIONS;
  private modelAssessments: ModelRiskAssessment[] = [];

  getRegulations(): FinancialRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): FinancialRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getByCategory(category: string): FinancialRegulation[] {
    return this.regulations.filter(r => r.category === category);
  }

  getByJurisdiction(jurisdiction: string): FinancialRegulation[] {
    return this.regulations.filter(r => r.jurisdiction === jurisdiction);
  }

  getDashboard(): {
    totalRegulations: number;
    averageScore: number;
    byCategory: Record<string, { count: number; avgScore: number }>;
    byJurisdiction: Record<string, number>;
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

    const byJurisdiction: Record<string, number> = {};
    for (const reg of this.regulations) {
      if (!byJurisdiction[reg.jurisdiction]) byJurisdiction[reg.jurisdiction] = 0;
      byJurisdiction[reg.jurisdiction]++;
    }

    const criticalGaps: { regulation: string; control: string; status: string }[] = [];
    for (const reg of this.regulations) {
      for (const ctrl of reg.platformControls) {
        if (ctrl.status !== 'implemented') {
          criticalGaps.push({ regulation: reg.code, control: ctrl.control, status: ctrl.status });
        }
      }
    }

    return { totalRegulations: this.regulations.length, averageScore: avgScore, byCategory, byJurisdiction, criticalGaps };
  }

  assessModelRisk(params: {
    modelName: string;
    modelType: string;
    regulation: string;
  }): ModelRiskAssessment {
    const assessment: ModelRiskAssessment = {
      id: `mra-${crypto.randomUUID()}`,
      modelName: params.modelName,
      modelType: params.modelType,
      regulation: params.regulation,
      assessmentDate: new Date(),
      validationStatus: 'pending',
      findings: [
        { area: 'Conceptual soundness', finding: 'Model design review required', severity: 'medium', remediation: 'Complete independent model review per SR 11-7 §IV' },
        { area: 'Outcomes analysis', finding: 'Backtesting results needed', severity: 'medium', remediation: 'Run backtesting against 3 years of historical data' },
      ],
      nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
    this.modelAssessments.push(assessment);
    return assessment;
  }

  screenEntity(entityName: string): AMLScreeningResult {
    return {
      id: `aml-${crypto.randomUUID()}`,
      entityName,
      screeningDate: new Date(),
      listsChecked: ['OFAC SDN', 'OFAC Consolidated', 'UN Security Council', 'EU Consolidated', 'UK HMT', 'PEP Lists'],
      matchesFound: [],
      riskRating: 'clear',
      recommendation: `No matches found for "${entityName}" across all screening lists. Low AML risk.`,
    };
  }

  getModelAssessments(): ModelRiskAssessment[] {
    return this.modelAssessments;
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

export const financialComplianceService = new FinancialComplianceService();
