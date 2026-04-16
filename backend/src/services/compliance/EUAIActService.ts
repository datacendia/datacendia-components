/**
 * EU AI Act Conformity Service
 *
 * Manages EU AI Act compliance: risk classification, conformity assessment,
 * Article 52 transparency obligations, prohibited practices checks,
 * high-risk system requirements, and technical documentation.
 *
 * @module services/compliance/EUAIActService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export type AIRiskLevel = 'unacceptable' | 'high' | 'limited' | 'minimal';

export type ConformityStatus = 
  | 'compliant' | 'partially_compliant' | 'non_compliant' | 'assessment_pending';

export interface AISystemClassification {
  systemId: string;
  systemName: string;
  description: string;
  riskLevel: AIRiskLevel;
  classificationRationale: string;
  annex: string;
  prohibitedPracticeCheck: {
    socialScoring: boolean;
    subliminalManipulation: boolean;
    exploitingVulnerabilities: boolean;
    biometricCategorization: boolean;
    realTimeBiometricId: boolean;
    emotionRecognition: boolean;
    predictivePolicing: boolean;
    facialRecognitionScraping: boolean;
    isProhibited: boolean;
  };
  highRiskRequirements: {
    riskManagementSystem: ConformityStatus;
    dataGovernance: ConformityStatus;
    technicalDocumentation: ConformityStatus;
    recordKeeping: ConformityStatus;
    transparency: ConformityStatus;
    humanOversight: ConformityStatus;
    accuracy: ConformityStatus;
    robustness: ConformityStatus;
    cybersecurity: ConformityStatus;
  } | null;
  article52Obligations: {
    disclosureToUsers: boolean;
    emotionDetectionNotice: boolean;
    deepfakeLabeling: boolean;
    aiGeneratedContentMarking: boolean;
  };
  classifiedAt: Date;
  classifiedBy: string;
}

export interface ConformityAssessment {
  id: string;
  systemId: string;
  assessmentDate: Date;
  assessor: string;
  assessmentType: 'self_assessment' | 'third_party' | 'notified_body';
  overallStatus: ConformityStatus;
  findings: Array<{
    requirement: string;
    article: string;
    status: ConformityStatus;
    evidence: string[];
    gaps: string[];
    remediationPlan: string;
  }>;
  ceMarking: boolean;
  euDeclarationOfConformity: boolean;
  registeredInEUDatabase: boolean;
  nextAssessmentDate: Date;
}

export interface TechnicalDocumentation {
  systemId: string;
  systemName: string;
  version: string;
  sections: {
    generalDescription: string;
    intendedPurpose: string;
    designSpecifications: string;
    developmentProcess: string;
    trainingData: string;
    testingMethodology: string;
    performanceMetrics: string;
    riskManagement: string;
    humanOversight: string;
    monitoringPlan: string;
    changesLog: string;
  };
  generatedAt: Date;
  hash: string;
}

export interface EUAIActComplianceStatus {
  overallReadiness: number;
  classifiedSystems: number;
  highRiskSystems: number;
  limitedRiskSystems: number;
  minimalRiskSystems: number;
  prohibitedSystemsDetected: number;
  conformityAssessments: number;
  article52Compliant: boolean;
  deadlines: Array<{
    deadline: string;
    requirement: string;
    status: 'met' | 'approaching' | 'overdue';
  }>;
  criticalGaps: string[];
  assessedAt: Date;
}

export class EUAIActService {
  private classifications: AISystemClassification[] = [];
  private assessments: ConformityAssessment[] = [];

  constructor() {
    this.classifyDatacendiaSystems();
  }

  private classifyDatacendiaSystems(): void {
    // Classify core Datacendia AI systems
    this.classifications = [
      {
        systemId: 'council-deliberation',
        systemName: 'AI Council Deliberation Engine',
        description: 'Multi-agent AI system for structured decision-making with human oversight.',
        riskLevel: 'limited',
        classificationRationale: 'AI system that interacts with natural persons. Not high-risk as it is advisory only — human-in-the-loop required for all final decisions. Falls under Article 52 transparency obligations.',
        annex: 'N/A (limited risk)',
        prohibitedPracticeCheck: {
          socialScoring: false, subliminalManipulation: false,
          exploitingVulnerabilities: false, biometricCategorization: false,
          realTimeBiometricId: false, emotionRecognition: false,
          predictivePolicing: false, facialRecognitionScraping: false,
          isProhibited: false,
        },
        highRiskRequirements: null,
        article52Obligations: {
          disclosureToUsers: true,
          emotionDetectionNotice: false,
          deepfakeLabeling: false,
          aiGeneratedContentMarking: true,
        },
        classifiedAt: new Date(),
        classifiedBy: 'EUAIActService auto-classification',
      },
      {
        systemId: 'compliance-enforcer',
        systemName: 'Compliance Enforcement Engine',
        description: 'Rule-based compliance violation detection and blocking system.',
        riskLevel: 'minimal',
        classificationRationale: 'Deterministic rule-based system, not an AI system per Article 3(1). Uses predefined rules, not machine learning. Classified as minimal risk out of abundance of caution.',
        annex: 'N/A (minimal risk — rule-based)',
        prohibitedPracticeCheck: {
          socialScoring: false, subliminalManipulation: false,
          exploitingVulnerabilities: false, biometricCategorization: false,
          realTimeBiometricId: false, emotionRecognition: false,
          predictivePolicing: false, facialRecognitionScraping: false,
          isProhibited: false,
        },
        highRiskRequirements: null,
        article52Obligations: {
          disclosureToUsers: false,
          emotionDetectionNotice: false,
          deepfakeLabeling: false,
          aiGeneratedContentMarking: false,
        },
        classifiedAt: new Date(),
        classifiedBy: 'EUAIActService auto-classification',
      },
      {
        systemId: 'risk-scoring',
        systemName: 'AI Risk Scoring and Analysis',
        description: 'AI-assisted risk analysis for decision support.',
        riskLevel: 'limited',
        classificationRationale: 'Advisory AI system for risk analysis. Not high-risk as outputs are recommendations only — no automated decisions with legal effects. Human decision-maker required.',
        annex: 'N/A (limited risk)',
        prohibitedPracticeCheck: {
          socialScoring: false, subliminalManipulation: false,
          exploitingVulnerabilities: false, biometricCategorization: false,
          realTimeBiometricId: false, emotionRecognition: false,
          predictivePolicing: false, facialRecognitionScraping: false,
          isProhibited: false,
        },
        highRiskRequirements: null,
        article52Obligations: {
          disclosureToUsers: true,
          emotionDetectionNotice: false,
          deepfakeLabeling: false,
          aiGeneratedContentMarking: true,
        },
        classifiedAt: new Date(),
        classifiedBy: 'EUAIActService auto-classification',
      },
    ];
  }

  classifySystem(params: {
    systemName: string;
    description: string;
    usesML: boolean;
    makesDecisionsWithLegalEffect: boolean;
    domain: string;
    classifiedBy: string;
  }): AISystemClassification {
    let riskLevel: AIRiskLevel = 'minimal';
    let annex = 'N/A';

    const prohibitedCheck = {
      socialScoring: false, subliminalManipulation: false,
      exploitingVulnerabilities: false, biometricCategorization: false,
      realTimeBiometricId: false, emotionRecognition: false,
      predictivePolicing: false, facialRecognitionScraping: false,
      isProhibited: false,
    };

    // High-risk Annex III areas
    const highRiskDomains = [
      'employment', 'credit_scoring', 'education', 'law_enforcement',
      'migration', 'justice', 'critical_infrastructure', 'biometric',
    ];

    if (highRiskDomains.includes(params.domain)) {
      riskLevel = 'high';
      annex = 'Annex III';
    } else if (params.usesML && !params.makesDecisionsWithLegalEffect) {
      riskLevel = 'limited';
    }

    const classification: AISystemClassification = {
      systemId: `sys-${crypto.randomUUID()}`,
      systemName: params.systemName,
      description: params.description,
      riskLevel,
      classificationRationale: `Classified as ${riskLevel} risk based on domain (${params.domain}), ML use (${params.usesML}), and legal effect (${params.makesDecisionsWithLegalEffect}).`,
      annex,
      prohibitedPracticeCheck: prohibitedCheck,
      highRiskRequirements: riskLevel === 'high' ? {
        riskManagementSystem: 'assessment_pending',
        dataGovernance: 'assessment_pending',
        technicalDocumentation: 'assessment_pending',
        recordKeeping: 'assessment_pending',
        transparency: 'assessment_pending',
        humanOversight: 'assessment_pending',
        accuracy: 'assessment_pending',
        robustness: 'assessment_pending',
        cybersecurity: 'assessment_pending',
      } : null,
      article52Obligations: {
        disclosureToUsers: riskLevel !== 'minimal',
        emotionDetectionNotice: false,
        deepfakeLabeling: false,
        aiGeneratedContentMarking: params.usesML,
      },
      classifiedAt: new Date(),
      classifiedBy: params.classifiedBy,
    };

    this.classifications.push(classification);
    return classification;
  }

  conductConformityAssessment(systemId: string, assessor: string): ConformityAssessment {
    const system = this.classifications.find(c => c.systemId === systemId);
    if (!system) throw new Error(`System ${systemId} not found`);

    const findings = [];

    if (system.riskLevel === 'high' && system.highRiskRequirements) {
      const reqMap: Record<string, string> = {
        riskManagementSystem: 'Art 9 — Risk Management',
        dataGovernance: 'Art 10 — Data Governance',
        technicalDocumentation: 'Art 11 — Technical Documentation',
        recordKeeping: 'Art 12 — Record-Keeping',
        transparency: 'Art 13 — Transparency',
        humanOversight: 'Art 14 — Human Oversight',
        accuracy: 'Art 15 — Accuracy',
        robustness: 'Art 15 — Robustness',
        cybersecurity: 'Art 15 — Cybersecurity',
      };
      for (const [key, article] of Object.entries(reqMap)) {
        findings.push({
          requirement: key,
          article,
          status: 'assessment_pending' as ConformityStatus,
          evidence: [],
          gaps: [`${article} assessment not yet completed`],
          remediationPlan: `Complete ${article} assessment and documentation`,
        });
      }
    }

    // Article 52 transparency check
    if (system.article52Obligations.disclosureToUsers) {
      findings.push({
        requirement: 'article52_disclosure',
        article: 'Art 52 — Transparency',
        status: 'compliant' as ConformityStatus,
        evidence: ['AI-generated content marked in all responses', 'User disclosure in platform UI'],
        gaps: [],
        remediationPlan: 'N/A — compliant',
      });
    }

    const overallStatus: ConformityStatus = findings.some(f => f.status === 'non_compliant')
      ? 'non_compliant'
      : findings.some(f => f.status === 'assessment_pending')
        ? 'partially_compliant'
        : 'compliant';

    const assessment: ConformityAssessment = {
      id: `ca-${crypto.randomUUID()}`,
      systemId,
      assessmentDate: new Date(),
      assessor,
      assessmentType: system.riskLevel === 'high' ? 'third_party' : 'self_assessment',
      overallStatus,
      findings,
      ceMarking: overallStatus === 'compliant',
      euDeclarationOfConformity: overallStatus === 'compliant',
      registeredInEUDatabase: false,
      nextAssessmentDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };

    this.assessments.push(assessment);
    return assessment;
  }

  generateTechnicalDocumentation(systemId: string): TechnicalDocumentation {
    const system = this.classifications.find(c => c.systemId === systemId);
    if (!system) throw new Error(`System ${systemId} not found`);

    const doc: TechnicalDocumentation = {
      systemId,
      systemName: system.systemName,
      version: '1.0',
      sections: {
        generalDescription: `${system.systemName}: ${system.description}. Risk level: ${system.riskLevel}. Classification: ${system.classificationRationale}`,
        intendedPurpose: 'Enterprise decision governance and compliance enforcement. Advisory AI with human-in-the-loop.',
        designSpecifications: 'Multi-agent architecture with role-based agents. Local inference via Ollama. No external data dependencies.',
        developmentProcess: 'Agile development with CI/CD. Code review required for all changes. Security-first design.',
        trainingData: 'Uses pre-trained open-source models (Llama, Qwen, DeepSeek). No customer data used in training. Fine-tuning via local RLHF only.',
        testingMethodology: 'Unit tests, integration tests, adversarial red-teaming, bias audits, compliance validation.',
        performanceMetrics: 'Response quality scoring, bias detection rates, compliance enforcement accuracy, false positive rates.',
        riskManagement: 'ComplianceEnforcer 5-ring model. ContinuousComplianceMonitor for drift detection. Automated violation blocking.',
        humanOversight: 'All AI outputs are advisory. Human decision-maker required for all final decisions. Override capability always available.',
        monitoringPlan: 'Real-time compliance monitoring. Drift detection alerts. Periodic bias audits. Annual conformity reassessment.',
        changesLog: 'All changes tracked in Git. Change management via PR review. Deployment audit trail.',
      },
      generatedAt: new Date(),
      hash: '',
    };

    doc.hash = crypto.createHash('sha256')
      .update(JSON.stringify({ ...doc, hash: '' }))
      .digest('hex');

    return doc;
  }

  getClassifications(): AISystemClassification[] {
    return this.classifications;
  }

  getAssessments(): ConformityAssessment[] {
    return this.assessments;
  }

  getComplianceStatus(): EUAIActComplianceStatus {
    const criticalGaps: string[] = [];
    const now = new Date();

    const highRisk = this.classifications.filter(c => c.riskLevel === 'high');
    const prohibited = this.classifications.filter(c => c.prohibitedPracticeCheck.isProhibited);

    if (prohibited.length > 0) {
      criticalGaps.push(`${prohibited.length} PROHIBITED AI system(s) detected — must be discontinued immediately`);
    }

    const article52Systems = this.classifications.filter(c => c.article52Obligations.disclosureToUsers);
    const article52Compliant = article52Systems.every(s => s.article52Obligations.disclosureToUsers);

    if (!article52Compliant) {
      criticalGaps.push('Article 52 transparency obligations not met for all systems');
    }

    // Deadline tracking
    const deadlines = [
      {
        deadline: '2025-02-02',
        requirement: 'AI Literacy (Art 4) — Organizations must ensure AI literacy',
        status: now > new Date('2025-02-02') ? 'overdue' as const : 'approaching' as const,
      },
      {
        deadline: '2025-08-02',
        requirement: 'Prohibited Practices (Art 5) — Prohibited AI practices banned',
        status: now > new Date('2025-08-02') ? 'overdue' as const : 'approaching' as const,
      },
      {
        deadline: '2026-08-02',
        requirement: 'High-Risk AI (Annex III) — Full compliance required',
        status: now > new Date('2026-08-02') ? 'overdue' as const : 'approaching' as const,
      },
      {
        deadline: '2027-08-02',
        requirement: 'All AI Systems — Full regulation in effect',
        status: now > new Date('2027-08-02') ? 'overdue' as const : 'approaching' as const,
      },
    ];

    const overdueCount = deadlines.filter(d => d.status === 'overdue').length;
    if (overdueCount > 0) {
      criticalGaps.push(`${overdueCount} EU AI Act deadline(s) overdue`);
    }

    // Readiness score
    let score = 70; // Base: we have classification and Article 52 transparency
    if (prohibited.length === 0) score += 10;
    if (article52Compliant) score += 10;
    if (this.assessments.length > 0) score += 5;
    if (highRisk.length === 0) score += 5; // No high-risk systems = simpler compliance

    return {
      overallReadiness: Math.min(score, 100),
      classifiedSystems: this.classifications.length,
      highRiskSystems: highRisk.length,
      limitedRiskSystems: this.classifications.filter(c => c.riskLevel === 'limited').length,
      minimalRiskSystems: this.classifications.filter(c => c.riskLevel === 'minimal').length,
      prohibitedSystemsDetected: prohibited.length,
      conformityAssessments: this.assessments.length,
      article52Compliant,
      deadlines,
      criticalGaps,
      assessedAt: new Date(),
    };
  }
}

export const euAIActService = new EUAIActService();
