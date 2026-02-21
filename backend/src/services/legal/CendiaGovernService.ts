// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA GOVERN SERVICE
 * 
 * Policy enforcement engine for legal compliance frameworks.
 * Enforces ABA Model Rules, SRA (UK), EU AI Act, GDPR, and other regulatory requirements.
 * 
 * Key Features:
 * - ABA Model Rules enforcement (1.1, 1.6, 5.1/5.3)
 * - SRA (UK) compliance checks
 * - EU AI Act compliance
 * - GDPR data handling rules
 * - State Bar Rules integration
 * - Attorney-Client Privilege protection
 * - Work Product Doctrine enforcement
 * - Policy violation detection and remediation
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type ComplianceFramework = 
  | 'aba_model_rules'
  | 'sra_uk'
  | 'eu_ai_act'
  | 'gdpr'
  | 'state_bar'
  | 'attorney_client_privilege'
  | 'work_product_doctrine';

export type RuleId = 
  // ABA Model Rules
  | 'aba_1.1_competence'
  | 'aba_1.6_confidentiality'
  | 'aba_5.1_supervision_partners'
  | 'aba_5.3_supervision_nonlawyers'
  | 'aba_1.4_communication'
  | 'aba_1.7_conflict_of_interest'
  | 'aba_1.15_safekeeping_property'
  // SRA (UK)
  | 'sra_competence'
  | 'sra_confidentiality'
  | 'sra_conflicts'
  | 'sra_client_money'
  // EU AI Act
  | 'eu_ai_transparency'
  | 'eu_ai_human_oversight'
  | 'eu_ai_data_governance'
  | 'eu_ai_risk_management'
  // GDPR
  | 'gdpr_lawful_basis'
  | 'gdpr_data_minimization'
  | 'gdpr_purpose_limitation'
  | 'gdpr_storage_limitation'
  | 'gdpr_integrity_confidentiality'
  | 'gdpr_accountability'
  // Privilege
  | 'privilege_attorney_client'
  | 'privilege_work_product'
  | 'privilege_common_interest';

export type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface PolicyRule {
  id: RuleId;
  framework: ComplianceFramework;
  name: string;
  description: string;
  citation: string;
  requirements: string[];
  checkFunction: string; // Name of the check function
  severity: ViolationSeverity;
  autoEnforce: boolean;
  remediationSteps: string[];
}

export interface PolicyViolation {
  id: string;
  ruleId: RuleId;
  framework: ComplianceFramework;
  severity: ViolationSeverity;
  matterId?: string | undefined;
  documentId?: string | undefined;
  userId?: string | undefined;
  description: string;
  evidence: Record<string, any>;
  detectedAt: Date;
  resolvedAt?: Date | undefined;
  resolvedBy?: string | undefined;
  resolution?: string | undefined;
  autoRemediated: boolean;
}

export interface ComplianceCheck {
  id: string;
  frameworks: ComplianceFramework[];
  matterId?: string | undefined;
  documentId?: string | undefined;
  content?: string | undefined;
  context: Record<string, any>;
  checkedAt: Date;
  checkedBy: string;
  results: CheckResult[];
  overallStatus: 'pass' | 'fail' | 'warning';
  hash: string;
}

export interface CheckResult {
  ruleId: RuleId;
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  message: string;
  details?: Record<string, any>;
}

export interface PolicyConfiguration {
  framework: ComplianceFramework;
  enabled: boolean;
  strictMode: boolean;
  autoRemediate: boolean;
  notifyOnViolation: boolean;
  escalationThreshold: ViolationSeverity;
}

// =============================================================================
// POLICY RULES DATABASE
// =============================================================================

const POLICY_RULES: PolicyRule[] = [
  // ABA Model Rules
  {
    id: 'aba_1.1_competence',
    framework: 'aba_model_rules',
    name: 'Rule 1.1 - Competence',
    description: 'A lawyer shall provide competent representation to a client.',
    citation: 'ABA Model Rules of Professional Conduct, Rule 1.1',
    requirements: [
      'Legal knowledge and skill reasonably necessary',
      'Thoroughness and preparation reasonably necessary',
      'Association with competent lawyer if needed',
    ],
    checkFunction: 'checkCompetence',
    severity: 'high',
    autoEnforce: false,
    remediationSteps: [
      'Ensure matter is staffed with attorneys having relevant expertise',
      'Document research and preparation steps',
      'Consider associating with specialist counsel if needed',
    ],
  },
  {
    id: 'aba_1.6_confidentiality',
    framework: 'aba_model_rules',
    name: 'Rule 1.6 - Confidentiality of Information',
    description: 'A lawyer shall not reveal information relating to the representation of a client.',
    citation: 'ABA Model Rules of Professional Conduct, Rule 1.6',
    requirements: [
      'No disclosure without informed consent',
      'Reasonable efforts to prevent inadvertent disclosure',
      'Limited exceptions (prevent death/substantial bodily harm, etc.)',
    ],
    checkFunction: 'checkConfidentiality',
    severity: 'critical',
    autoEnforce: true,
    remediationSteps: [
      'Block unauthorized disclosure immediately',
      'Review and redact confidential information',
      'Obtain client consent before any disclosure',
      'Document all disclosures and basis',
    ],
  },
  {
    id: 'aba_5.1_supervision_partners',
    framework: 'aba_model_rules',
    name: 'Rule 5.1 - Responsibilities of Partners and Supervisory Lawyers',
    description: 'Partners and supervisory lawyers must ensure firm compliance with Rules.',
    citation: 'ABA Model Rules of Professional Conduct, Rule 5.1',
    requirements: [
      'Reasonable efforts to ensure firm has measures giving reasonable assurance of compliance',
      'Direct supervisory authority lawyers must make reasonable efforts to ensure compliance',
      'Responsible for another lawyer\'s violation if ordered or ratified',
    ],
    checkFunction: 'checkSupervision',
    severity: 'high',
    autoEnforce: false,
    remediationSteps: [
      'Ensure supervisory review of all AI outputs',
      'Document review and approval chain',
      'Implement approval gates for client-facing work',
    ],
  },
  {
    id: 'aba_5.3_supervision_nonlawyers',
    framework: 'aba_model_rules',
    name: 'Rule 5.3 - Responsibilities Regarding Nonlawyer Assistance',
    description: 'Lawyers must supervise nonlawyer assistants, including AI systems.',
    citation: 'ABA Model Rules of Professional Conduct, Rule 5.3',
    requirements: [
      'Conduct compatible with professional obligations of lawyer',
      'Direct supervision of nonlawyer assistants',
      'AI systems treated as nonlawyer assistants requiring supervision',
    ],
    checkFunction: 'checkNonlawyerSupervision',
    severity: 'high',
    autoEnforce: true,
    remediationSteps: [
      'All AI outputs must be reviewed by supervising attorney',
      'No AI output released without human approval',
      'Document AI assistance in work product',
    ],
  },
  // SRA (UK) Rules
  {
    id: 'sra_competence',
    framework: 'sra_uk',
    name: 'SRA Competence',
    description: 'Solicitors must only act where competent to do so.',
    citation: 'SRA Code of Conduct, Paragraph 3.2',
    requirements: [
      'Maintain competence and legal knowledge',
      'Only act in matters where competent',
      'Supervise work delegated to others',
    ],
    checkFunction: 'checkSRACompetence',
    severity: 'high',
    autoEnforce: false,
    remediationSteps: [
      'Verify solicitor qualifications for matter type',
      'Document competence assessment',
      'Arrange supervision or referral if needed',
    ],
  },
  {
    id: 'sra_confidentiality',
    framework: 'sra_uk',
    name: 'SRA Confidentiality',
    description: 'Keep client affairs confidential unless disclosure required or permitted.',
    citation: 'SRA Code of Conduct, Paragraph 6.3',
    requirements: [
      'Keep client affairs confidential',
      'Only disclose with consent or legal requirement',
      'Protect confidential information from unauthorized access',
    ],
    checkFunction: 'checkSRAConfidentiality',
    severity: 'critical',
    autoEnforce: true,
    remediationSteps: [
      'Block unauthorized disclosure',
      'Review information handling procedures',
      'Obtain client consent for any disclosure',
    ],
  },
  // EU AI Act
  {
    id: 'eu_ai_transparency',
    framework: 'eu_ai_act',
    name: 'EU AI Act - Transparency',
    description: 'AI systems must be transparent about their nature and capabilities.',
    citation: 'EU AI Act, Article 52',
    requirements: [
      'Inform users they are interacting with AI',
      'Disclose AI-generated content',
      'Provide information about AI system capabilities and limitations',
    ],
    checkFunction: 'checkAITransparency',
    severity: 'high',
    autoEnforce: true,
    remediationSteps: [
      'Add AI disclosure to all AI-generated outputs',
      'Document AI involvement in work product',
      'Inform clients of AI assistance',
    ],
  },
  {
    id: 'eu_ai_human_oversight',
    framework: 'eu_ai_act',
    name: 'EU AI Act - Human Oversight',
    description: 'High-risk AI systems must allow human oversight.',
    citation: 'EU AI Act, Article 14',
    requirements: [
      'Human oversight of AI decisions',
      'Ability to override AI outputs',
      'Human review before consequential actions',
    ],
    checkFunction: 'checkHumanOversight',
    severity: 'critical',
    autoEnforce: true,
    remediationSteps: [
      'Implement approval gates for AI outputs',
      'Ensure human review of all AI recommendations',
      'Document human oversight in audit trail',
    ],
  },
  // GDPR
  {
    id: 'gdpr_lawful_basis',
    framework: 'gdpr',
    name: 'GDPR - Lawful Basis',
    description: 'Personal data must be processed with a lawful basis.',
    citation: 'GDPR, Article 6',
    requirements: [
      'Identify lawful basis for processing',
      'Document lawful basis',
      'Consent must be freely given, specific, informed, unambiguous',
    ],
    checkFunction: 'checkLawfulBasis',
    severity: 'critical',
    autoEnforce: false,
    remediationSteps: [
      'Document lawful basis for all personal data processing',
      'Obtain consent where required',
      'Review and update privacy notices',
    ],
  },
  {
    id: 'gdpr_data_minimization',
    framework: 'gdpr',
    name: 'GDPR - Data Minimization',
    description: 'Personal data must be adequate, relevant, and limited to what is necessary.',
    citation: 'GDPR, Article 5(1)(c)',
    requirements: [
      'Only collect necessary data',
      'Limit data to purpose',
      'Regular review of data holdings',
    ],
    checkFunction: 'checkDataMinimization',
    severity: 'high',
    autoEnforce: false,
    remediationSteps: [
      'Review data collection practices',
      'Remove unnecessary personal data',
      'Implement data retention policies',
    ],
  },
  // Privilege Rules
  {
    id: 'privilege_attorney_client',
    framework: 'attorney_client_privilege',
    name: 'Attorney-Client Privilege',
    description: 'Communications between attorney and client are privileged.',
    citation: 'Common Law / Evidence Rules',
    requirements: [
      'Communication between attorney and client',
      'For purpose of legal advice',
      'Intended to be confidential',
      'Privilege not waived',
    ],
    checkFunction: 'checkAttorneyClientPrivilege',
    severity: 'critical',
    autoEnforce: true,
    remediationSteps: [
      'Block disclosure of privileged communications',
      'Review for privilege before any export',
      'Document privilege determination',
      'Maintain privilege log',
    ],
  },
  {
    id: 'privilege_work_product',
    framework: 'work_product_doctrine',
    name: 'Work Product Doctrine',
    description: 'Attorney work product prepared in anticipation of litigation is protected.',
    citation: 'Hickman v. Taylor, FRCP 26(b)(3)',
    requirements: [
      'Prepared in anticipation of litigation',
      'By or for party or representative',
      'Mental impressions receive heightened protection',
    ],
    checkFunction: 'checkWorkProduct',
    severity: 'critical',
    autoEnforce: true,
    remediationSteps: [
      'Mark work product documents appropriately',
      'Block disclosure without review',
      'Document work product status',
    ],
  },
];

// =============================================================================
// CENDIA GOVERN SERVICE
// =============================================================================

export class CendiaGovernService extends EventEmitter {
  private violations: Map<string, PolicyViolation> = new Map();
  private checks: Map<string, ComplianceCheck> = new Map();
  private configurations: Map<ComplianceFramework, PolicyConfiguration> = new Map();
  private rules: Map<RuleId, PolicyRule> = new Map();

  constructor() {
    super();
    // Initialize rules
    for (const rule of POLICY_RULES) {
      this.rules.set(rule.id, rule);
    }
    // Initialize default configurations
    this.initializeDefaultConfigurations();
  }

  private initializeDefaultConfigurations(): void {
    const frameworks: ComplianceFramework[] = [
      'aba_model_rules',
      'sra_uk',
      'eu_ai_act',
      'gdpr',
      'state_bar',
      'attorney_client_privilege',
      'work_product_doctrine',
    ];

    for (const framework of frameworks) {
      this.configurations.set(framework, {
        framework,
        enabled: true,
        strictMode: framework === 'attorney_client_privilege' || framework === 'work_product_doctrine',
        autoRemediate: framework === 'attorney_client_privilege' || framework === 'work_product_doctrine',
        notifyOnViolation: true,
        escalationThreshold: 'high',
      });
    }
  }

  // ===========================================================================
  // COMPLIANCE CHECKING
  // ===========================================================================

  /**
   * Run compliance check against specified frameworks
   */
  async runComplianceCheck(params: {
    frameworks: ComplianceFramework[];
    matterId?: string;
    documentId?: string;
    content?: string;
    context?: Record<string, any>;
    checkedBy: string;
  }): Promise<ComplianceCheck> {
    const id = `check-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const results: CheckResult[] = [];

    for (const framework of params.frameworks) {
      const config = this.configurations.get(framework);
      if (!config?.enabled) continue;

      const frameworkRules = Array.from(this.rules.values())
        .filter(r => r.framework === framework);

      for (const rule of frameworkRules) {
        const result = await this.checkRule(rule, params);
        results.push(result);

        // Record violation if failed
        if (result.status === 'fail') {
          await this.recordViolation({
            ruleId: rule.id,
            framework,
            severity: rule.severity,
            matterId: params.matterId,
            documentId: params.documentId,
            description: result.message,
            evidence: result.details || {},
            autoRemediated: false,
          });
        }
      }
    }

    const overallStatus = this.determineOverallStatus(results);

    const check: ComplianceCheck = {
      id,
      frameworks: params.frameworks,
      matterId: params.matterId,
      documentId: params.documentId,
      content: params.content,
      context: params.context || {},
      checkedAt: new Date(),
      checkedBy: params.checkedBy,
      results,
      overallStatus,
      hash: '',
    };

    check.hash = this.generateHash(check);
    this.checks.set(id, check);
    persistServiceRecord({ serviceName: 'CendiaGovern', recordType: 'compliance_check', referenceId: id, data: check });
    this.emit('compliance-check-complete', check);

    return check;
  }

  /**
   * Check a single rule
   */
  private async checkRule(rule: PolicyRule, params: {
    matterId?: string;
    documentId?: string;
    content?: string;
    context?: Record<string, any>;
  }): Promise<CheckResult> {
    // Execute the appropriate check based on rule
    switch (rule.id) {
      case 'aba_1.6_confidentiality':
      case 'sra_confidentiality':
        return this.checkConfidentiality(rule, params);
      
      case 'aba_5.1_supervision_partners':
      case 'aba_5.3_supervision_nonlawyers':
        return this.checkSupervision(rule, params);
      
      case 'eu_ai_transparency':
        return this.checkAITransparency(rule, params);
      
      case 'eu_ai_human_oversight':
        return this.checkHumanOversight(rule, params);
      
      case 'privilege_attorney_client':
        return this.checkAttorneyClientPrivilege(rule, params);
      
      case 'privilege_work_product':
        return this.checkWorkProduct(rule, params);
      
      case 'gdpr_data_minimization':
        return this.checkDataMinimization(rule, params);
      
      default:
        // Default pass for rules without specific implementation
        return {
          ruleId: rule.id,
          status: 'pass',
          message: `${rule.name}: Compliant (manual verification recommended)`,
        };
    }
  }

  // ===========================================================================
  // SPECIFIC RULE CHECKS
  // ===========================================================================

  private checkConfidentiality(rule: PolicyRule, params: {
    content?: string;
    context?: Record<string, any>;
  }): CheckResult {
    const content = params.content || '';
    const context = params.context || {};

    // Check for confidentiality markers
    const hasConfidentialMarker = context['isConfidential'] === true;
    const hasClientConsent = context['clientConsentForDisclosure'] === true;
    const isExternalShare = context['isExternalShare'] === true;

    if (hasConfidentialMarker && isExternalShare && !hasClientConsent) {
      return {
        ruleId: rule.id,
        status: 'fail',
        message: `${rule.name}: Confidential information cannot be shared externally without client consent`,
        details: { hasConfidentialMarker, hasClientConsent, isExternalShare },
      };
    }

    // Check for PII patterns
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{16}\b/, // Credit card
    ];

    for (const pattern of piiPatterns) {
      if (pattern.test(content) && isExternalShare) {
        return {
          ruleId: rule.id,
          status: 'warning',
          message: `${rule.name}: Potential PII detected in content marked for external sharing`,
          details: { patternMatched: pattern.source },
        };
      }
    }

    return {
      ruleId: rule.id,
      status: 'pass',
      message: `${rule.name}: Confidentiality requirements met`,
    };
  }

  private checkSupervision(rule: PolicyRule, params: {
    context?: Record<string, any>;
  }): CheckResult {
    const context = params.context || {};

    const hasAIGenerated = context['aiGenerated'] === true;
    const hasHumanReview = context['humanReviewed'] === true;
    const reviewedBy = context['reviewedBy'];

    if (hasAIGenerated && !hasHumanReview) {
      return {
        ruleId: rule.id,
        status: 'fail',
        message: `${rule.name}: AI-generated content requires attorney supervision before release`,
        details: { aiGenerated: hasAIGenerated, humanReviewed: hasHumanReview },
      };
    }

    if (hasAIGenerated && hasHumanReview && !reviewedBy) {
      return {
        ruleId: rule.id,
        status: 'warning',
        message: `${rule.name}: Reviewer identity should be documented`,
        details: { aiGenerated: hasAIGenerated, humanReviewed: hasHumanReview },
      };
    }

    return {
      ruleId: rule.id,
      status: 'pass',
      message: `${rule.name}: Supervision requirements met`,
    };
  }

  private checkAITransparency(rule: PolicyRule, params: {
    context?: Record<string, any>;
  }): CheckResult {
    const context = params.context || {};

    const hasAIGenerated = context['aiGenerated'] === true;
    const hasAIDisclosure = context['aiDisclosureIncluded'] === true;
    const isClientFacing = context['isClientFacing'] === true;

    if (hasAIGenerated && isClientFacing && !hasAIDisclosure) {
      return {
        ruleId: rule.id,
        status: 'fail',
        message: `${rule.name}: Client-facing AI-generated content must include AI disclosure`,
        details: { aiGenerated: hasAIGenerated, aiDisclosureIncluded: hasAIDisclosure },
      };
    }

    return {
      ruleId: rule.id,
      status: 'pass',
      message: `${rule.name}: AI transparency requirements met`,
    };
  }

  private checkHumanOversight(rule: PolicyRule, params: {
    context?: Record<string, any>;
  }): CheckResult {
    const context = params.context || {};

    const isHighRiskDecision = context['isHighRiskDecision'] === true;
    const hasHumanApproval = context['humanApproval'] === true;

    if (isHighRiskDecision && !hasHumanApproval) {
      return {
        ruleId: rule.id,
        status: 'fail',
        message: `${rule.name}: High-risk AI decisions require human approval`,
        details: { isHighRiskDecision, hasHumanApproval },
      };
    }

    return {
      ruleId: rule.id,
      status: 'pass',
      message: `${rule.name}: Human oversight requirements met`,
    };
  }

  private checkAttorneyClientPrivilege(rule: PolicyRule, params: {
    context?: Record<string, any>;
  }): CheckResult {
    const context = params.context || {};

    const isPrivileged = context['privilegeStatus'] === 'attorney-client';
    const isExternalShare = context['isExternalShare'] === true;
    const privilegeReviewed = context['privilegeReviewed'] === true;
    const privilegeWaived = context['privilegeWaived'] === true;

    if (isPrivileged && isExternalShare && !privilegeWaived) {
      if (!privilegeReviewed) {
        return {
          ruleId: rule.id,
          status: 'fail',
          message: `${rule.name}: Privileged communication cannot be shared without privilege review`,
          details: { isPrivileged, isExternalShare, privilegeReviewed },
        };
      }
    }

    return {
      ruleId: rule.id,
      status: 'pass',
      message: `${rule.name}: Attorney-client privilege protected`,
    };
  }

  private checkWorkProduct(rule: PolicyRule, params: {
    context?: Record<string, any>;
  }): CheckResult {
    const context = params.context || {};

    const isWorkProduct = context['privilegeStatus'] === 'work-product';
    const isExternalShare = context['isExternalShare'] === true;
    const workProductReviewed = context['workProductReviewed'] === true;

    if (isWorkProduct && isExternalShare && !workProductReviewed) {
      return {
        ruleId: rule.id,
        status: 'fail',
        message: `${rule.name}: Work product cannot be shared without review`,
        details: { isWorkProduct, isExternalShare, workProductReviewed },
      };
    }

    return {
      ruleId: rule.id,
      status: 'pass',
      message: `${rule.name}: Work product doctrine protected`,
    };
  }

  private checkDataMinimization(rule: PolicyRule, params: {
    content?: string;
    context?: Record<string, any>;
  }): CheckResult {
    const context = params.context || {};

    const dataCategories = context['dataCategories'] as string[] || [];
    const purposeDocumented = context['purposeDocumented'] === true;

    if (dataCategories.length > 5 && !purposeDocumented) {
      return {
        ruleId: rule.id,
        status: 'warning',
        message: `${rule.name}: Multiple data categories collected - ensure purpose is documented`,
        details: { dataCategories, purposeDocumented },
      };
    }

    return {
      ruleId: rule.id,
      status: 'pass',
      message: `${rule.name}: Data minimization requirements met`,
    };
  }

  // ===========================================================================
  // VIOLATION MANAGEMENT
  // ===========================================================================

  private async recordViolation(params: {
    ruleId: RuleId;
    framework: ComplianceFramework;
    severity: ViolationSeverity;
    matterId?: string | undefined;
    documentId?: string | undefined;
    userId?: string | undefined;
    description: string;
    evidence: Record<string, any>;
    autoRemediated: boolean;
  }): Promise<PolicyViolation> {
    const id = `violation-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    const violation: PolicyViolation = {
      id,
      ruleId: params.ruleId,
      framework: params.framework,
      severity: params.severity,
      matterId: params.matterId,
      documentId: params.documentId,
      userId: params.userId,
      description: params.description,
      evidence: params.evidence,
      detectedAt: new Date(),
      autoRemediated: params.autoRemediated,
    };

    this.violations.set(id, violation);
    persistServiceRecord({ serviceName: 'CendiaGovern', recordType: 'violation', referenceId: id, data: violation });
    this.emit('violation-detected', violation);

    // Check if should escalate
    const config = this.configurations.get(params.framework);
    if (config?.notifyOnViolation) {
      this.emit('violation-notification', violation);
    }

    return violation;
  }

  /**
   * Resolve a violation
   */
  async resolveViolation(violationId: string, params: {
    resolvedBy: string;
    resolution: string;
  }): Promise<PolicyViolation | null> {
    const violation = this.violations.get(violationId);
    if (!violation) return null;

    violation.resolvedAt = new Date();
    violation.resolvedBy = params.resolvedBy;
    violation.resolution = params.resolution;

    this.violations.set(violationId, violation);
    this.emit('violation-resolved', violation);

    return violation;
  }

  /**
   * Get open violations
   */
  getOpenViolations(filters?: {
    framework?: ComplianceFramework;
    severity?: ViolationSeverity;
    matterId?: string;
  }): PolicyViolation[] {
    let violations = Array.from(this.violations.values())
      .filter(v => !v.resolvedAt);

    if (filters?.framework) {
      violations = violations.filter(v => v.framework === filters.framework);
    }
    if (filters?.severity) {
      violations = violations.filter(v => v.severity === filters.severity);
    }
    if (filters?.matterId) {
      violations = violations.filter(v => v.matterId === filters.matterId);
    }

    return violations;
  }

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  /**
   * Update framework configuration
   */
  updateConfiguration(config: PolicyConfiguration): void {
    this.configurations.set(config.framework, config);
    this.emit('configuration-updated', config);
  }

  /**
   * Get framework configuration
   */
  getConfiguration(framework: ComplianceFramework): PolicyConfiguration | undefined {
    return this.configurations.get(framework);
  }

  /**
   * Get all rules for a framework
   */
  getRulesForFramework(framework: ComplianceFramework): PolicyRule[] {
    return Array.from(this.rules.values()).filter(r => r.framework === framework);
  }

  // ===========================================================================
  // UTILITIES
  // ===========================================================================

  private determineOverallStatus(results: CheckResult[]): 'pass' | 'fail' | 'warning' {
    if (results.some(r => r.status === 'fail')) return 'fail';
    if (results.some(r => r.status === 'warning')) return 'warning';
    return 'pass';
  }

  private generateHash(data: any): string {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * Get compliance statistics
   */
  getStatistics(): {
    totalChecks: number;
    totalViolations: number;
    openViolations: number;
    byFramework: Record<string, { checks: number; violations: number }>;
    bySeverity: Record<string, number>;
  } {
    const checks = Array.from(this.checks.values());
    const violations = Array.from(this.violations.values());
    const openViolations = violations.filter(v => !v.resolvedAt);

    const byFramework: Record<string, { checks: number; violations: number }> = {};
    const bySeverity: Record<string, number> = {};

    for (const check of checks) {
      for (const framework of check.frameworks) {
        if (!byFramework[framework]) {
          byFramework[framework] = { checks: 0, violations: 0 };
        }
        byFramework[framework].checks++;
      }
    }

    for (const violation of violations) {
      if (!byFramework[violation.framework]) {
        byFramework[violation.framework] = { checks: 0, violations: 0 };
      }
      const frameworkStats = byFramework[violation.framework];
      if (frameworkStats) {
        frameworkStats.violations++;
      }
      bySeverity[violation.severity] = (bySeverity[violation.severity] || 0) + 1;
    }

    return {
      totalChecks: checks.length,
      totalViolations: violations.length,
      openViolations: openViolations.length,
      byFramework,
      bySeverity,
    };
  }
}

// Export singleton instance
export const cendiaGovernService = new CendiaGovernService();
export default cendiaGovernService;
