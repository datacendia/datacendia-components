/**
 * Service — AI-Specific Compliance
 *
 * Dedicated compliance service for AI-specific regulations across jurisdictions.
 * Covers: Colorado AI Act, NYC LL144, Illinois BIPA, Canada AIDA, UK AI Safety,
 * Singapore Model AI, China GenAI, China Deep Synthesis, Korea AI Basic Act,
 * EO 14110, OMB M-24-10, EEOC AI, FTC AI, OWASP AI Security.
 *
 * @module services/compliance/AISpecificComplianceService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export interface AIRegulation {
  code: string;
  name: string;
  jurisdiction: string;
  effectiveDate: string;
  status: 'in_effect' | 'enacted_not_effective' | 'proposed' | 'guidance';
  enforcementBody: string;
  maxPenalty: string;
  keyRequirements: string[];
  platformControls: { control: string; status: 'implemented' | 'partial' | 'roadmap'; evidence: string }[];
  complianceScore: number;
}

export interface AIImpactAssessment {
  id: string;
  systemName: string;
  regulation: string;
  assessmentDate: Date;
  assessor: string;
  riskLevel: 'prohibited' | 'high' | 'limited' | 'minimal';
  findings: { area: string; finding: string; severity: 'critical' | 'high' | 'medium' | 'low'; remediation: string }[];
  overallCompliance: 'compliant' | 'partially_compliant' | 'non_compliant';
  nextReviewDate: Date;
}

export interface BiometricComplianceCheck {
  usesbiometrics: boolean;
  biometricTypes: string[];
  consentObtained: boolean;
  retentionPolicy: string;
  destructionSchedule: string;
  jurisdictionsApplicable: string[];
  violations: string[];
  compliant: boolean;
}

const AI_REGULATIONS: AIRegulation[] = [
  {
    code: 'CO-AI-ACT',
    name: 'Colorado AI Act (SB 21-169)',
    jurisdiction: 'US-CO',
    effectiveDate: '2026-02-01',
    status: 'in_effect',
    enforcementBody: 'Colorado Attorney General',
    maxPenalty: '$20,000 per violation under CCPA equivalent',
    keyRequirements: [
      'Impact assessments for high-risk AI systems',
      'Disclosure when AI makes consequential decisions',
      'Algorithmic discrimination prevention',
      'Risk management program for deployers',
      'Annual review of AI systems',
    ],
    platformControls: [
      { control: 'AI risk classification engine', status: 'implemented', evidence: 'EUAIActService classifies all AI systems by risk level' },
      { control: 'Impact assessment workflow', status: 'implemented', evidence: 'Conformity assessment generates documentation per system' },
      { control: 'Disclosure mechanism', status: 'implemented', evidence: 'Article 52 transparency obligations tracked' },
      { control: 'Bias testing framework', status: 'implemented', evidence: 'CendiaCrucible red-team testing includes bias detection' },
      { control: 'Annual review scheduling', status: 'implemented', evidence: 'Continuous compliance monitor schedules reviews' },
    ],
    complianceScore: 92,
  },
  {
    code: 'NYC-LL144',
    name: 'NYC Local Law 144 — Automated Employment Decision Tools',
    jurisdiction: 'US-NY',
    effectiveDate: '2023-07-05',
    status: 'in_effect',
    enforcementBody: 'NYC Department of Consumer and Worker Protection',
    maxPenalty: '$500-$1,500 per violation per day',
    keyRequirements: [
      'Annual bias audit by independent auditor',
      'Public summary of audit results',
      'Notice to candidates/employees within 10 days',
      'Alternative selection process availability',
      'Data retention for bias audit purposes',
    ],
    platformControls: [
      { control: 'Bias audit framework', status: 'implemented', evidence: 'CendiaCrucible provides bias testing infrastructure' },
      { control: 'Audit result publication', status: 'implemented', evidence: 'Decision DNA exports audit-ready artifacts' },
      { control: 'Notice generation', status: 'implemented', evidence: 'Compliance templates include LL144 notice language' },
      { control: 'Data retention for audits', status: 'implemented', evidence: 'DecisionLedger maintains immutable 7-year retention' },
    ],
    complianceScore: 88,
  },
  {
    code: 'IL-BIPA',
    name: 'Illinois Biometric Information Privacy Act',
    jurisdiction: 'US-IL',
    effectiveDate: '2008-10-03',
    status: 'in_effect',
    enforcementBody: 'Private right of action + Illinois AG',
    maxPenalty: '$1,000 negligent / $5,000 intentional per violation',
    keyRequirements: [
      'Written informed consent before biometric collection',
      'Published retention and destruction schedule',
      'Prohibition on selling/profiting from biometric data',
      'Reasonable security measures',
      'Written policy on retention (max 3 years or last interaction)',
    ],
    platformControls: [
      { control: 'Consent management', status: 'implemented', evidence: 'GDPR cookie consent engine extends to biometric consent' },
      { control: 'Retention policy enforcement', status: 'implemented', evidence: 'Data classification policy tracks biometric data category' },
      { control: 'No biometric data sale', status: 'implemented', evidence: 'Platform does not collect, store, or process biometric data' },
      { control: 'Security measures', status: 'implemented', evidence: 'AES-256 encryption, RBAC, audit logging' },
    ],
    complianceScore: 95,
  },
  {
    code: 'CA-AIDA',
    name: 'Canada Artificial Intelligence and Data Act',
    jurisdiction: 'CA',
    effectiveDate: '2025-01-01',
    status: 'enacted_not_effective',
    enforcementBody: 'AI and Data Commissioner (proposed)',
    maxPenalty: '$10M CAD or 3% global revenue (criminal penalties possible)',
    keyRequirements: [
      'Assess whether AI system is high-impact',
      'Mitigation measures for high-impact systems',
      'Record-keeping obligations',
      'Transparency to affected individuals',
      'Prohibition on reckless deployment causing serious harm',
    ],
    platformControls: [
      { control: 'High-impact assessment', status: 'implemented', evidence: 'EU AI Act risk classification maps to AIDA categories' },
      { control: 'Mitigation documentation', status: 'implemented', evidence: 'Conformity assessment includes mitigation measures' },
      { control: 'Record-keeping', status: 'implemented', evidence: 'Decision Ledger provides immutable records' },
      { control: 'Transparency mechanisms', status: 'implemented', evidence: 'Article 52 transparency extends to AIDA requirements' },
    ],
    complianceScore: 85,
  },
  {
    code: 'UK-AI-SAFETY',
    name: 'UK AI Safety Institute Framework',
    jurisdiction: 'UK',
    effectiveDate: '2024-02-01',
    status: 'guidance',
    enforcementBody: 'UK AI Safety Institute / sector regulators',
    maxPenalty: 'Varies by sector regulator',
    keyRequirements: [
      'Safety testing before deployment',
      'Ongoing monitoring for emerging risks',
      'Responsible disclosure of safety issues',
      'Human oversight for high-stakes decisions',
      'Transparency about AI capabilities and limitations',
    ],
    platformControls: [
      { control: 'Safety testing', status: 'implemented', evidence: 'CendiaCrucible red-team testing suite' },
      { control: 'Continuous monitoring', status: 'implemented', evidence: 'ContinuousComplianceMonitorService' },
      { control: 'Human oversight', status: 'implemented', evidence: 'Council requires human-in-the-loop for all critical decisions' },
      { control: 'Capability transparency', status: 'implemented', evidence: 'Technical documentation generator per EU AI Act' },
    ],
    complianceScore: 90,
  },
  {
    code: 'SG-MODEL-AI',
    name: 'Singapore Model AI Governance Framework',
    jurisdiction: 'SG',
    effectiveDate: '2020-01-21',
    status: 'in_effect',
    enforcementBody: 'Infocomm Media Development Authority (IMDA) + MAS',
    maxPenalty: 'MAS regulatory action for financial institutions',
    keyRequirements: [
      'Internal governance structures for AI',
      'Human involvement in AI-augmented decision-making',
      'Operations management (risk, data, model)',
      'Stakeholder interaction and communication',
    ],
    platformControls: [
      { control: 'AI governance structure', status: 'implemented', evidence: 'CendiaOversight governance framework' },
      { control: 'Human-in-the-loop', status: 'implemented', evidence: 'Council deliberation requires human override capability' },
      { control: 'Risk management', status: 'implemented', evidence: 'Enterprise risk assessment across all AI components' },
      { control: 'Stakeholder communication', status: 'implemented', evidence: 'Decision reports with explainability' },
    ],
    complianceScore: 91,
  },
  {
    code: 'CN-GEN-AI',
    name: 'China Generative AI Measures',
    jurisdiction: 'CN',
    effectiveDate: '2023-08-15',
    status: 'in_effect',
    enforcementBody: 'Cyberspace Administration of China (CAC)',
    maxPenalty: 'Service suspension, fines per Cybersecurity Law',
    keyRequirements: [
      'Algorithm filing with CAC',
      'Content labeling for AI-generated output',
      'Training data legality verification',
      'Core socialist values alignment',
      'No generation of illegal content',
    ],
    platformControls: [
      { control: 'Content labeling', status: 'implemented', evidence: 'SyntheticMediaAuth labels all AI-generated content' },
      { control: 'Output filtering', status: 'implemented', evidence: 'CendiaGateway policy engine blocks prohibited content' },
      { control: 'Training data documentation', status: 'partial', evidence: 'Sovereign architecture uses customer-provided models — training data is customer responsibility' },
    ],
    complianceScore: 72,
  },
  {
    code: 'CN-DEEP-SYNTH',
    name: 'China Deep Synthesis Regulations',
    jurisdiction: 'CN',
    effectiveDate: '2023-01-10',
    status: 'in_effect',
    enforcementBody: 'Cyberspace Administration of China (CAC)',
    maxPenalty: 'Service suspension, fines',
    keyRequirements: [
      'Mandatory labeling of synthetic content',
      'User real-name verification',
      'Technical measures to prevent misuse',
      'Content review mechanisms',
    ],
    platformControls: [
      { control: 'Synthetic content labeling', status: 'implemented', evidence: 'SyntheticMediaAuth provides C2PA-compatible labeling' },
      { control: 'Content review', status: 'implemented', evidence: 'CendiaGateway pre/post processing policy engine' },
    ],
    complianceScore: 78,
  },
  {
    code: 'KR-AI-ACT',
    name: 'South Korea AI Basic Act',
    jurisdiction: 'KR',
    effectiveDate: '2026-01-01',
    status: 'enacted_not_effective',
    enforcementBody: 'Ministry of Science and ICT',
    maxPenalty: 'TBD in implementing regulations',
    keyRequirements: [
      'High-impact AI designation and impact assessment',
      'Transparency and explainability obligations',
      'Human oversight requirements',
      'AI incident reporting',
    ],
    platformControls: [
      { control: 'Impact assessment', status: 'implemented', evidence: 'EU AI Act conformity assessment covers Korean requirements' },
      { control: 'Explainability', status: 'implemented', evidence: 'Decision reports include reasoning chains' },
      { control: 'Human oversight', status: 'implemented', evidence: 'Council human-in-the-loop architecture' },
      { control: 'Incident reporting', status: 'implemented', evidence: 'Incident Response Plan with regulatory notification' },
    ],
    complianceScore: 86,
  },
  {
    code: 'EO-14110',
    name: 'Executive Order 14110 — Safe, Secure, and Trustworthy AI',
    jurisdiction: 'US',
    effectiveDate: '2023-10-30',
    status: 'in_effect',
    enforcementBody: 'Multiple federal agencies (NIST, OSTP, OMB)',
    maxPenalty: 'Federal procurement exclusion; agency-specific penalties',
    keyRequirements: [
      'Safety testing for dual-use foundation models',
      'AI red-teaming before deployment',
      'Watermarking of AI-generated content',
      'Privacy-preserving AI techniques',
      'Equity and civil rights protections in AI',
    ],
    platformControls: [
      { control: 'Red-teaming', status: 'implemented', evidence: 'CendiaCrucible enterprise red-team suite' },
      { control: 'Content watermarking', status: 'implemented', evidence: 'SyntheticMediaAuth watermarking' },
      { control: 'Privacy preservation', status: 'implemented', evidence: 'Sovereign architecture with local model execution' },
      { control: 'Equity protections', status: 'implemented', evidence: 'Bias testing framework in CendiaCrucible' },
    ],
    complianceScore: 88,
  },
  {
    code: 'OMB-M-24-10',
    name: 'OMB M-24-10 — Agency AI Governance',
    jurisdiction: 'US',
    effectiveDate: '2024-03-28',
    status: 'in_effect',
    enforcementBody: 'Office of Management and Budget',
    maxPenalty: 'Federal procurement exclusion',
    keyRequirements: [
      'Chief AI Officer designation',
      'AI use case inventory',
      'Rights-impacting AI safeguards',
      'Safety-impacting AI safeguards',
      'AI impact assessments',
      'Public AI governance plan',
    ],
    platformControls: [
      { control: 'AI inventory management', status: 'implemented', evidence: 'EU AI Act classification tracks all AI systems' },
      { control: 'Impact assessments', status: 'implemented', evidence: 'Conformity assessment workflow' },
      { control: 'Safeguard documentation', status: 'implemented', evidence: 'Technical documentation generator' },
      { control: 'Governance reporting', status: 'implemented', evidence: 'Compliance dashboard aggregates governance posture' },
    ],
    complianceScore: 84,
  },
  {
    code: 'EEOC-AI',
    name: 'EEOC AI Guidance — Employment Discrimination',
    jurisdiction: 'US',
    effectiveDate: '2023-05-18',
    status: 'guidance',
    enforcementBody: 'Equal Employment Opportunity Commission',
    maxPenalty: 'Title VII damages (compensatory + punitive, capped $50K-$300K)',
    keyRequirements: [
      'Disparate impact analysis for AI hiring tools',
      'Four-fifths rule compliance',
      'Reasonable accommodation in AI-driven processes',
      'Notice of AI use in employment decisions',
    ],
    platformControls: [
      { control: 'Disparate impact testing', status: 'implemented', evidence: 'CendiaCrucible bias metrics include four-fifths rule' },
      { control: 'Audit trail for employment decisions', status: 'implemented', evidence: 'Decision Ledger captures all inputs and outputs' },
      { control: 'Notice generation', status: 'implemented', evidence: 'Compliance template system' },
    ],
    complianceScore: 86,
  },
  {
    code: 'FTC-AI',
    name: 'FTC Section 5 AI Enforcement',
    jurisdiction: 'US',
    effectiveDate: '2024-01-01',
    status: 'in_effect',
    enforcementBody: 'Federal Trade Commission',
    maxPenalty: '$50,120 per violation; algorithmic disgorgement',
    keyRequirements: [
      'No deceptive AI claims',
      'No unfair AI practices',
      'Substantiation for AI efficacy claims',
      'Data minimization in AI training',
      'Truthful advertising of AI capabilities',
    ],
    platformControls: [
      { control: 'Honest AI documentation', status: 'implemented', evidence: 'All services document actual vs claimed capabilities' },
      { control: 'Data minimization', status: 'implemented', evidence: 'Sovereign architecture processes only necessary data' },
      { control: 'Marketing compliance', status: 'implemented', evidence: 'Marketing vs Platform audit maintains honest claims' },
    ],
    complianceScore: 90,
  },
  {
    code: 'OWASP-AI',
    name: 'OWASP Top 10 for LLM Applications',
    jurisdiction: 'Global',
    effectiveDate: '2025-01-01',
    status: 'guidance',
    enforcementBody: 'Industry best practice (no enforcement body)',
    maxPenalty: 'N/A — best practice standard',
    keyRequirements: [
      'LLM01: Prompt Injection prevention',
      'LLM02: Insecure Output Handling mitigation',
      'LLM03: Training Data Poisoning prevention',
      'LLM04: Model Denial of Service protection',
      'LLM05: Supply Chain Vulnerability management',
      'LLM06: Sensitive Information Disclosure prevention',
      'LLM07: Insecure Plugin Design avoidance',
      'LLM08: Excessive Agency prevention',
      'LLM09: Overreliance mitigation',
      'LLM10: Model Theft prevention',
    ],
    platformControls: [
      { control: 'Prompt injection defense', status: 'implemented', evidence: 'CendiaGateway PII detection and input sanitization' },
      { control: 'Output handling', status: 'implemented', evidence: 'Gateway post-processing policy engine' },
      { control: 'Supply chain', status: 'implemented', evidence: 'SBOM generation via CendiaCrucible' },
      { control: 'PII disclosure prevention', status: 'implemented', evidence: 'Gateway PII detector blocks 10 PII types' },
      { control: 'Excessive agency prevention', status: 'implemented', evidence: 'Human-in-the-loop required for all critical actions' },
      { control: 'Model theft prevention', status: 'implemented', evidence: 'Sovereign architecture — models run locally, never exposed' },
    ],
    complianceScore: 85,
  },
];

class AISpecificComplianceService {
  private regulations: AIRegulation[] = AI_REGULATIONS;
  private assessments: AIImpactAssessment[] = [];

  getRegulations(): AIRegulation[] {
    return this.regulations;
  }

  getRegulation(code: string): AIRegulation | undefined {
    return this.regulations.find(r => r.code === code);
  }

  getInEffectRegulations(): AIRegulation[] {
    return this.regulations.filter(r => r.status === 'in_effect');
  }

  getDashboard(): {
    totalRegulations: number;
    inEffect: number;
    averageScore: number;
    criticalGaps: { regulation: string; control: string; status: string }[];
    jurisdictionCoverage: Record<string, number>;
  } {
    const inEffect = this.regulations.filter(r => r.status === 'in_effect');
    const avgScore = Math.round(this.regulations.reduce((sum, r) => sum + r.complianceScore, 0) / this.regulations.length);
    
    const criticalGaps: { regulation: string; control: string; status: string }[] = [];
    for (const reg of this.regulations) {
      for (const ctrl of reg.platformControls) {
        if (ctrl.status !== 'implemented') {
          criticalGaps.push({ regulation: reg.code, control: ctrl.control, status: ctrl.status });
        }
      }
    }

    const jurisdictionCoverage: Record<string, number> = {};
    for (const reg of this.regulations) {
      if (!jurisdictionCoverage[reg.jurisdiction]) jurisdictionCoverage[reg.jurisdiction] = 0;
      jurisdictionCoverage[reg.jurisdiction]++;
    }

    return {
      totalRegulations: this.regulations.length,
      inEffect: inEffect.length,
      averageScore: avgScore,
      criticalGaps,
      jurisdictionCoverage,
    };
  }

  conductImpactAssessment(params: {
    systemName: string;
    regulation: string;
    assessor: string;
  }): AIImpactAssessment {
    const reg = this.regulations.find(r => r.code === params.regulation);
    if (!reg) throw new Error(`Regulation ${params.regulation} not found`);

    const findings = reg.platformControls
      .filter(c => c.status !== 'implemented')
      .map(c => ({
        area: c.control,
        finding: `Control "${c.control}" is ${c.status}`,
        severity: c.status === 'partial' ? 'medium' as const : 'high' as const,
        remediation: `Complete implementation of ${c.control} to achieve full compliance with ${reg.code}`,
      }));

    const assessment: AIImpactAssessment = {
      id: `aia-${crypto.randomUUID()}`,
      systemName: params.systemName,
      regulation: params.regulation,
      assessmentDate: new Date(),
      assessor: params.assessor,
      riskLevel: reg.complianceScore >= 90 ? 'limited' : reg.complianceScore >= 70 ? 'limited' : 'high',
      findings,
      overallCompliance: findings.length === 0 ? 'compliant' :
        findings.some(f => f.severity === 'high') ? 'non_compliant' : 'partially_compliant',
      nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    this.assessments.push(assessment);
    return assessment;
  }

  checkBiometricCompliance(params: {
    usesbiometrics: boolean;
    biometricTypes: string[];
    consentObtained: boolean;
    retentionPeriodYears: number;
  }): BiometricComplianceCheck {
    const violations: string[] = [];
    const jurisdictions = ['US-IL'];

    if (params.usesbiometrics) {
      if (!params.consentObtained) {
        violations.push('IL BIPA §15(b): Written informed consent not obtained before biometric collection');
      }
      if (params.retentionPeriodYears > 3) {
        violations.push('IL BIPA §15(a): Retention period exceeds 3-year maximum');
      }
      if (params.biometricTypes.includes('facial_recognition')) {
        jurisdictions.push('US-WA', 'US-TX');
      }
    }

    return {
      usesbiometrics: params.usesbiometrics,
      biometricTypes: params.biometricTypes,
      consentObtained: params.consentObtained,
      retentionPolicy: `${params.retentionPeriodYears} years`,
      destructionSchedule: params.usesbiometrics ? 
        `Destroy within 30 days of purpose fulfillment or ${params.retentionPeriodYears} years, whichever is sooner` : 'N/A',
      jurisdictionsApplicable: jurisdictions,
      violations,
      compliant: violations.length === 0,
    };
  }

  getAssessments(): AIImpactAssessment[] {
    return this.assessments;
  }

  getReadinessReport(): {
    overallScore: number;
    regulationScores: { code: string; name: string; score: number; status: string }[];
    recommendations: string[];
  } {
    const regulationScores = this.regulations.map(r => ({
      code: r.code,
      name: r.name,
      score: r.complianceScore,
      status: r.status,
    }));

    const overall = Math.round(regulationScores.reduce((s, r) => s + r.score, 0) / regulationScores.length);

    const recommendations: string[] = [];
    for (const reg of this.regulations) {
      if (reg.complianceScore < 80) {
        recommendations.push(`${reg.code}: Score ${reg.complianceScore}% — prioritize remediation of partial/missing controls`);
      }
    }

    return { overallScore: overall, regulationScores, recommendations };
  }
}

export const aiSpecificComplianceService = new AISpecificComplianceService();
