/**
 * Service — Compliance Enforcer
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports ComplianceEnforcer, complianceEnforcer, ComplianceViolation, ComplianceCheck, ActionContext
 * @module services/compliance/ComplianceEnforcer
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance Enforcer - Active Compliance Engine
 * Real-time violation detection with framework citations
 * 
 * "Blocked per Ring 3 (Privacy), Framework HIPAA, Control §164.312"
 */

import { ComplianceDomain, PillarId,  } from './frameworks';

// ============================================================================
// TYPES
// ============================================================================

export interface ComplianceViolation {
  id: string;
  timestamp: Date;
  ring: number;
  domain: ComplianceDomain;
  framework: string;
  frameworkCode: string;
  control: string;
  controlTitle: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  citation: string;
  recommendation: string;
  blocked: boolean;
}

export interface ComplianceCheck {
  allowed: boolean;
  violations: ComplianceViolation[];
  citations: string[];
  recommendation: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface ActionContext {
  action: string;
  description: string;
  pillar?: PillarId;
  dataTypes?: string[];
  targetSystem?: string;
  userId?: string;
  agentId?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// COMPLIANCE RULES DATABASE
// ============================================================================

interface ComplianceRule {
  id: string;
  ring: number;
  domain: ComplianceDomain;
  framework: string;
  frameworkCode: string;
  control: string;
  controlTitle: string;
  keywords: string[];
  dataTypes: string[];
  blockedActions: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  citation: string;
  reason: string;
  recommendation: string;
}

const COMPLIANCE_RULES: ComplianceRule[] = [
  // ========================================
  // RING 3: PRIVACY & DATA PROTECTION
  // ========================================
  
  // HIPAA Rules
  {
    id: 'hipaa-phi-public',
    ring: 3,
    domain: 'privacy',
    framework: 'HIPAA',
    frameworkCode: 'HIPAA',
    control: '§164.312(a)(1)',
    controlTitle: 'Access Control',
    keywords: ['patient', 'health', 'medical', 'phi', 'hipaa', 'healthcare', 'diagnosis', 'treatment'],
    dataTypes: ['phi', 'health_records', 'patient_data', 'medical_records'],
    blockedActions: ['upload_public', 'share_public', 'expose', 'publish', 'public_bucket', 'public_storage'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)',
    reason: 'Protected Health Information (PHI) cannot be stored in publicly accessible locations',
    recommendation: 'Use HIPAA-compliant encrypted storage with access controls and audit logging',
  },
  {
    id: 'hipaa-phi-encryption',
    ring: 3,
    domain: 'privacy',
    framework: 'HIPAA',
    frameworkCode: 'HIPAA',
    control: '§164.312(a)(2)(iv)',
    controlTitle: 'Encryption and Decryption',
    keywords: ['patient', 'health', 'medical', 'phi', 'unencrypted', 'plaintext'],
    dataTypes: ['phi', 'health_records', 'patient_data'],
    blockedActions: ['transmit_unencrypted', 'store_unencrypted', 'email_plaintext'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(2)(iv)',
    reason: 'PHI must be encrypted at rest and in transit',
    recommendation: 'Enable TLS 1.3 for transmission and AES-256 for storage encryption',
  },
  {
    id: 'hipaa-audit',
    ring: 3,
    domain: 'privacy',
    framework: 'HIPAA',
    frameworkCode: 'HIPAA',
    control: '§164.312(b)',
    controlTitle: 'Audit Controls',
    keywords: ['patient', 'health', 'medical', 'phi', 'access', 'view', 'modify'],
    dataTypes: ['phi', 'health_records', 'patient_data'],
    blockedActions: ['access_without_logging', 'disable_audit'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(b)',
    reason: 'All PHI access must be logged and auditable',
    recommendation: 'Enable comprehensive audit logging for all PHI access events',
  },

  // GDPR Rules
  {
    id: 'gdpr-consent',
    ring: 3,
    domain: 'privacy',
    framework: 'GDPR',
    frameworkCode: 'GDPR',
    control: 'Article 7',
    controlTitle: 'Conditions for Consent',
    keywords: ['personal', 'pii', 'user', 'customer', 'consent', 'gdpr', 'eu', 'european'],
    dataTypes: ['pii', 'personal_data', 'user_data', 'customer_data'],
    blockedActions: ['process_without_consent', 'collect_without_consent', 'share_without_consent'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework GDPR, Article 7',
    reason: 'Personal data processing requires valid consent or legitimate basis',
    recommendation: 'Obtain explicit consent or document legitimate interest before processing',
  },
  {
    id: 'gdpr-transfer',
    ring: 3,
    domain: 'privacy',
    framework: 'GDPR',
    frameworkCode: 'GDPR',
    control: 'Article 44-49',
    controlTitle: 'Cross-Border Transfer',
    keywords: ['transfer', 'export', 'offshore', 'third-country', 'non-eu', 'international'],
    dataTypes: ['pii', 'personal_data', 'eu_data'],
    blockedActions: ['transfer_non_adequate', 'export_without_safeguards', 'offshore_processing'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework GDPR, Articles 44-49',
    reason: 'Cross-border transfers require adequacy decision or appropriate safeguards',
    recommendation: 'Use Standard Contractual Clauses (SCCs) or verify adequacy decision exists',
  },
  {
    id: 'gdpr-erasure',
    ring: 3,
    domain: 'privacy',
    framework: 'GDPR',
    frameworkCode: 'GDPR',
    control: 'Article 17',
    controlTitle: 'Right to Erasure',
    keywords: ['delete', 'erase', 'forget', 'removal', 'right to be forgotten'],
    dataTypes: ['pii', 'personal_data'],
    blockedActions: ['ignore_deletion_request', 'permanent_retention', 'block_erasure'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework GDPR, Article 17',
    reason: 'Data subjects have the right to request erasure of their personal data',
    recommendation: 'Implement data deletion workflows that honor erasure requests within 30 days',
  },

  // PCI-DSS Rules
  {
    id: 'pci-card-storage',
    ring: 3,
    domain: 'privacy',
    framework: 'PCI-DSS',
    frameworkCode: 'PCI-DSS',
    control: 'Requirement 3.2',
    controlTitle: 'Cardholder Data Protection',
    keywords: ['credit card', 'payment', 'cardholder', 'pan', 'cvv', 'card number'],
    dataTypes: ['payment_card', 'pan', 'cardholder_data', 'cvv'],
    blockedActions: ['store_cvv', 'log_full_pan', 'store_unencrypted_pan', 'public_storage'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2',
    reason: 'Sensitive authentication data (CVV, full track data) must never be stored',
    recommendation: 'Use tokenization and never store CVV; mask PAN in logs (show only last 4 digits)',
  },

  // CCPA Rules
  {
    id: 'ccpa-opt-out',
    ring: 3,
    domain: 'privacy',
    framework: 'CCPA',
    frameworkCode: 'CCPA',
    control: '§1798.120',
    controlTitle: 'Right to Opt-Out',
    keywords: ['california', 'ccpa', 'sell', 'share', 'consumer', 'opt-out'],
    dataTypes: ['california_consumer_data', 'pii'],
    blockedActions: ['sell_data_after_optout', 'ignore_opt_out', 'share_after_optout'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework CCPA, §1798.120',
    reason: 'California consumers have the right to opt-out of data sales',
    recommendation: 'Honor opt-out requests immediately and maintain opt-out registry',
  },

  // ========================================
  // RING 2: CYBERSECURITY & RISK
  // ========================================

  // NIST 800-53 Rules
  {
    id: 'nist-access-control',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'NIST 800-53',
    frameworkCode: 'NIST-800-53',
    control: 'AC-3',
    controlTitle: 'Access Enforcement',
    keywords: ['access', 'permission', 'authorization', 'privilege', 'admin'],
    dataTypes: ['sensitive_data', 'classified'],
    blockedActions: ['bypass_access_control', 'grant_excessive_permissions', 'disable_rbac'],
    severity: 'critical',
    citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control AC-3',
    reason: 'Access must be enforced according to policy',
    recommendation: 'Implement role-based access control (RBAC) with least privilege principle',
  },
  {
    id: 'nist-audit-events',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'NIST 800-53',
    frameworkCode: 'NIST-800-53',
    control: 'AU-2',
    controlTitle: 'Audit Events',
    keywords: ['audit', 'log', 'event', 'security', 'monitoring'],
    dataTypes: ['system_events', 'security_events'],
    blockedActions: ['disable_logging', 'delete_audit_logs', 'bypass_monitoring'],
    severity: 'high',
    citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2',
    reason: 'Security-relevant events must be logged and retained',
    recommendation: 'Maintain audit logs for minimum 1 year with tamper-proof storage',
  },
  {
    id: 'nist-encryption',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'NIST 800-53',
    frameworkCode: 'NIST-800-53',
    control: 'SC-13',
    controlTitle: 'Cryptographic Protection',
    keywords: ['encrypt', 'crypto', 'key', 'certificate', 'tls', 'ssl'],
    dataTypes: ['sensitive_data', 'credentials'],
    blockedActions: ['use_weak_crypto', 'disable_encryption', 'store_plaintext_secrets'],
    severity: 'critical',
    citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control SC-13',
    reason: 'FIPS-validated cryptography must be used for sensitive data',
    recommendation: 'Use AES-256, TLS 1.3, and FIPS 140-2 validated modules',
  },

  // Zero Trust Rules
  {
    id: 'zt-implicit-trust',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'Zero Trust',
    frameworkCode: 'NIST-800-207',
    control: 'Tenet 1',
    controlTitle: 'Never Trust, Always Verify',
    keywords: ['trust', 'internal', 'network', 'perimeter', 'vpn'],
    dataTypes: ['any'],
    blockedActions: ['trust_based_on_network', 'skip_auth_internal', 'implicit_trust'],
    severity: 'high',
    citation: 'Ring 2 (Cybersecurity), Framework Zero Trust (NIST 800-207), Tenet 1',
    reason: 'Never trust implicitly; always verify identity and authorization',
    recommendation: 'Implement continuous verification regardless of network location',
  },

  // SOC 2 Rules
  {
    id: 'soc2-availability',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'SOC 2',
    frameworkCode: 'SOC-2',
    control: 'A1.1',
    controlTitle: 'System Availability',
    keywords: ['availability', 'uptime', 'sla', 'downtime', 'outage'],
    dataTypes: ['production_systems'],
    blockedActions: ['disable_redundancy', 'remove_backup', 'skip_failover_test'],
    severity: 'medium',
    citation: 'Ring 2 (Cybersecurity), Framework SOC 2, Control A1.1',
    reason: 'Systems must maintain committed availability levels',
    recommendation: 'Maintain redundancy and regularly test failover procedures',
  },

  // ========================================
  // RING 1: ETHICAL AI
  // ========================================

  // NIST AI RMF Rules
  {
    id: 'nist-ai-bias',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'NIST AI RMF',
    frameworkCode: 'NIST-AI-RMF',
    control: 'MEASURE 2.6',
    controlTitle: 'Bias Testing',
    keywords: ['bias', 'fairness', 'discrimination', 'demographic', 'protected class'],
    dataTypes: ['model_outputs', 'predictions'],
    blockedActions: ['deploy_untested_model', 'skip_bias_testing', 'ignore_bias_metrics'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6',
    reason: 'AI models must be tested for bias before deployment',
    recommendation: 'Run fairness metrics (demographic parity, equalized odds) before deployment',
  },
  {
    id: 'nist-ai-transparency',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'NIST AI RMF',
    frameworkCode: 'NIST-AI-RMF',
    control: 'GOVERN 4.1',
    controlTitle: 'Transparency',
    keywords: ['explainability', 'transparency', 'black box', 'interpretability'],
    dataTypes: ['model_decisions', 'predictions'],
    blockedActions: ['deploy_unexplainable', 'hide_decision_logic', 'no_explanation'],
    severity: 'medium',
    citation: 'Ring 1 (Ethical AI), Framework NIST AI RMF, Control GOVERN 4.1',
    reason: 'AI decisions affecting individuals must be explainable',
    recommendation: 'Implement SHAP/LIME explanations or use inherently interpretable models',
  },

  // EU AI Act Rules
  {
    id: 'eu-ai-prohibited',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'EU AI Act',
    frameworkCode: 'EU-AI-ACT',
    control: 'Article 5',
    controlTitle: 'Prohibited AI Practices',
    keywords: ['manipulation', 'social scoring', 'biometric', 'subliminal', 'exploitation'],
    dataTypes: ['user_behavior', 'biometric_data'],
    blockedActions: ['subliminal_manipulation', 'social_scoring', 'exploit_vulnerability', 'mass_surveillance'],
    severity: 'critical',
    citation: 'Ring 1 (Ethical AI), Framework EU AI Act, Article 5',
    reason: 'This AI practice is prohibited under EU AI Act',
    recommendation: 'Discontinue prohibited practice immediately; consult legal counsel',
  },
  {
    id: 'eu-ai-high-risk',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'EU AI Act',
    frameworkCode: 'EU-AI-ACT',
    control: 'Article 9',
    controlTitle: 'Risk Management for High-Risk AI',
    keywords: ['high-risk', 'employment', 'credit', 'law enforcement', 'education', 'healthcare'],
    dataTypes: ['high_risk_decisions'],
    blockedActions: ['deploy_without_risk_assessment', 'skip_conformity_assessment'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework EU AI Act, Article 9',
    reason: 'High-risk AI systems require risk management and conformity assessment',
    recommendation: 'Complete risk assessment and register in EU database before deployment',
  },

  // OECD AI Principles
  {
    id: 'oecd-human-oversight',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'OECD AI Principles',
    frameworkCode: 'OECD-AI',
    control: 'Principle 1.4',
    controlTitle: 'Human Oversight',
    keywords: ['autonomous', 'human-in-loop', 'override', 'intervention', 'control'],
    dataTypes: ['autonomous_decisions'],
    blockedActions: ['remove_human_oversight', 'fully_autonomous_critical', 'disable_override'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework OECD AI Principles, Principle 1.4',
    reason: 'AI systems should enable human oversight and intervention',
    recommendation: 'Implement human-in-the-loop for critical decisions; enable override capability',
  },

  // ========================================
  // RING 4: GOVERNANCE & AUDIT
  // ========================================

  // SOX Rules
  {
    id: 'sox-financial-controls',
    ring: 4,
    domain: 'governance',
    framework: 'SOX',
    frameworkCode: 'SOX',
    control: 'Section 404',
    controlTitle: 'Internal Controls',
    keywords: ['financial', 'accounting', 'revenue', 'reporting', 'audit'],
    dataTypes: ['financial_data', 'accounting_records'],
    blockedActions: ['bypass_approval', 'modify_without_audit', 'delete_financial_records'],
    severity: 'critical',
    citation: 'Ring 4 (Governance), Framework SOX, Section 404',
    reason: 'Financial data modifications require proper controls and audit trail',
    recommendation: 'Implement separation of duties and dual approval for financial changes',
  },

  // COBIT Rules
  {
    id: 'cobit-change-management',
    ring: 4,
    domain: 'governance',
    framework: 'COBIT',
    frameworkCode: 'COBIT',
    control: 'BAI06',
    controlTitle: 'Managed IT Changes',
    keywords: ['change', 'deployment', 'release', 'production', 'update'],
    dataTypes: ['production_systems'],
    blockedActions: ['deploy_without_approval', 'skip_change_review', 'emergency_change_abuse'],
    severity: 'medium',
    citation: 'Ring 4 (Governance), Framework COBIT, Control BAI06',
    reason: 'Changes to production require formal change management process',
    recommendation: 'Submit change request through CAB; document rollback plan',
  },

  // ========================================
  // RING 5: INDUSTRY REGULATION
  // ========================================

  // Basel III/IV Rules
  {
    id: 'basel-model-risk',
    ring: 5,
    domain: 'industry',
    framework: 'Basel III/IV',
    frameworkCode: 'BASEL-III',
    control: 'BCBS 239',
    controlTitle: 'Risk Data Aggregation',
    keywords: ['risk', 'capital', 'liquidity', 'model', 'stress test', 'banking'],
    dataTypes: ['risk_data', 'capital_calculations'],
    blockedActions: ['use_unvalidated_model', 'skip_backtesting', 'modify_risk_calculations'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework Basel III/IV, BCBS 239',
    reason: 'Risk models require validation and ongoing monitoring',
    recommendation: 'Complete model validation and obtain Model Risk Management approval',
  },

  // FedRAMP Rules
  {
    id: 'fedramp-data-location',
    ring: 5,
    domain: 'industry',
    framework: 'FedRAMP',
    frameworkCode: 'FEDRAMP',
    control: 'AC-7',
    controlTitle: 'Data Residency',
    keywords: ['federal', 'government', 'fedramp', 'fisma', 'data location', 'sovereignty'],
    dataTypes: ['federal_data', 'government_data'],
    blockedActions: ['store_outside_boundary', 'process_non_authorized', 'transfer_unauthorized'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework FedRAMP, Control AC-7',
    reason: 'Federal data must remain within authorized FedRAMP boundary',
    recommendation: 'Use only FedRAMP-authorized services and document all data flows',
  },

  // CJIS Rules
  {
    id: 'cjis-criminal-data',
    ring: 5,
    domain: 'industry',
    framework: 'CJIS',
    frameworkCode: 'CJIS',
    control: '5.4',
    controlTitle: 'Access Control',
    keywords: ['criminal', 'justice', 'law enforcement', 'cjis', 'ncic', 'fingerprint'],
    dataTypes: ['criminal_justice_data', 'law_enforcement_data'],
    blockedActions: ['access_without_clearance', 'share_unauthorized', 'store_non_compliant'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework CJIS, Policy 5.4',
    reason: 'Criminal justice information requires CJIS-compliant handling',
    recommendation: 'Verify personnel clearance and use CJIS-compliant infrastructure',
  },

  // ========================================
  // RING 1: AI-SPECIFIC (ADDITIONAL)
  // ========================================

  // Colorado AI Act
  {
    id: 'colorado-ai-impact',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'Colorado AI Act',
    frameworkCode: 'CO-AI-ACT',
    control: 'SB 205 §6-1-1702',
    controlTitle: 'High-Risk AI Impact Assessment',
    keywords: ['hiring', 'employment', 'credit', 'insurance', 'housing', 'education', 'scoring', 'profiling'],
    dataTypes: ['employment_data', 'credit_data', 'insurance_data'],
    blockedActions: ['deploy_without_impact_assessment', 'skip_bias_testing', 'deny_disclosure'],
    severity: 'critical',
    citation: 'Ring 1 (Ethical AI), Framework Colorado AI Act, §6-1-1702',
    reason: 'High-risk AI systems require impact assessment and consumer disclosure before deployment',
    recommendation: 'Complete algorithmic impact assessment; publish notice of AI use; document bias testing results',
  },

  // NYC Local Law 144
  {
    id: 'nyc-ll144-aedt',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'NYC Local Law 144',
    frameworkCode: 'NYC-LL144',
    control: 'LL144 §20-870',
    controlTitle: 'Automated Employment Decision Tool Audit',
    keywords: ['hiring', 'recruitment', 'employment', 'candidate', 'resume', 'screening', 'promotion'],
    dataTypes: ['employment_data', 'hr_data'],
    blockedActions: ['use_aedt_without_audit', 'skip_bias_audit', 'deny_candidate_notice'],
    severity: 'critical',
    citation: 'Ring 1 (Ethical AI), Framework NYC LL144, §20-870',
    reason: 'Automated employment decision tools require annual bias audit and candidate notice',
    recommendation: 'Engage independent auditor for bias audit; post summary on careers page; provide candidate notice 10 days prior',
  },

  // Executive Order 14110
  {
    id: 'eo-14110-ai-safety',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'Executive Order 14110',
    frameworkCode: 'EO-14110',
    control: 'Sec 4.2',
    controlTitle: 'AI Safety and Security',
    keywords: ['foundation model', 'dual use', 'frontier', 'safety', 'red team', 'watermark'],
    dataTypes: ['ai_model_data', 'training_data'],
    blockedActions: ['deploy_without_safety_test', 'skip_red_team', 'omit_watermark'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework EO 14110, Section 4.2',
    reason: 'Dual-use foundation models require safety testing, red-teaming, and content authentication',
    recommendation: 'Complete AI red-teaming; implement content provenance; report per OMB M-24-10',
  },

  // OWASP AI Security
  {
    id: 'owasp-ai-prompt-injection',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'OWASP AI Security',
    frameworkCode: 'OWASP-AI',
    control: 'LLM01',
    controlTitle: 'Prompt Injection Prevention',
    keywords: ['prompt', 'injection', 'jailbreak', 'system prompt', 'instruction'],
    dataTypes: ['ai_input', 'prompt_data'],
    blockedActions: ['allow_unsanitized_prompt', 'expose_system_prompt', 'skip_input_validation'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework OWASP AI, LLM01',
    reason: 'Prompt injection can cause unauthorized actions and data exfiltration',
    recommendation: 'Implement input sanitization, prompt boundaries, and output filtering',
  },

  // ========================================
  // RING 3: PRIVACY (ADDITIONAL)
  // ========================================

  // Illinois BIPA
  {
    id: 'bipa-biometric-consent',
    ring: 3,
    domain: 'privacy',
    framework: 'Illinois BIPA',
    frameworkCode: 'IL-BIPA',
    control: '§15(b)',
    controlTitle: 'Biometric Informed Consent',
    keywords: ['biometric', 'fingerprint', 'face', 'iris', 'voiceprint', 'facial recognition', 'hand geometry'],
    dataTypes: ['biometric_data'],
    blockedActions: ['collect_without_consent', 'share_biometric', 'store_without_policy'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework Illinois BIPA, §15(b)',
    reason: 'Biometric data requires written informed consent and published retention/destruction policy. $1K-$5K per violation.',
    recommendation: 'Obtain written consent before collection; publish retention schedule; never sell biometric data',
  },

  // HITECH Act
  {
    id: 'hitech-breach-notification',
    ring: 5,
    domain: 'industry',
    framework: 'HITECH Act',
    frameworkCode: 'HITECH',
    control: 'Sec 13402',
    controlTitle: 'Breach Notification',
    keywords: ['breach', 'unauthorized access', 'phi disclosure', 'health data leak', 'patient data'],
    dataTypes: ['health_data', 'phi'],
    blockedActions: ['delay_breach_notification', 'skip_hhs_notification', 'destroy_breach_evidence'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework HITECH, Section 13402',
    reason: 'PHI breaches affecting 500+ individuals require notification within 60 days to HHS, media, and individuals',
    recommendation: 'Activate incident response plan; notify HHS within 60 days; maintain breach log for 6 years',
  },

  // US State Privacy (Generic)
  {
    id: 'state-privacy-opt-out',
    ring: 3,
    domain: 'privacy',
    framework: 'US State Privacy Laws',
    frameworkCode: 'VCDPA',
    control: 'Universal Opt-Out',
    controlTitle: 'Consumer Opt-Out Rights',
    keywords: ['targeted advertising', 'sale of data', 'profiling', 'opt out', 'do not sell', 'gpc'],
    dataTypes: ['consumer_data', 'personal_data'],
    blockedActions: ['ignore_opt_out', 'sell_after_opt_out', 'profile_after_opt_out'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), US State Privacy Laws (VA/CT/CO/TX/OR + 13 more)',
    reason: '19+ US states require honoring consumer opt-out for targeted advertising and data sales',
    recommendation: 'Implement Global Privacy Control (GPC) signal detection; honor opt-out within 15 days',
  },

  // UK GDPR
  {
    id: 'uk-gdpr-cross-border',
    ring: 3,
    domain: 'privacy',
    framework: 'UK GDPR',
    frameworkCode: 'UK-GDPR',
    control: 'Art 46',
    controlTitle: 'International Data Transfers',
    keywords: ['uk data', 'international transfer', 'cross border', 'adequacy', 'standard contractual'],
    dataTypes: ['uk_personal_data'],
    blockedActions: ['transfer_without_safeguards', 'ignore_uk_adequacy', 'skip_tia'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework UK GDPR, Article 46',
    reason: 'UK personal data transfers require adequacy decision or appropriate safeguards',
    recommendation: 'Execute UK IDTA or UK Addendum to EU SCCs; complete Transfer Impact Assessment',
  },

  // ePrivacy / Cookie Consent
  {
    id: 'eprivacy-cookie-consent',
    ring: 3,
    domain: 'privacy',
    framework: 'ePrivacy Directive',
    frameworkCode: 'EPRIVACY',
    control: 'Art 5(3)',
    controlTitle: 'Cookie Consent',
    keywords: ['cookie', 'tracking', 'analytics', 'pixel', 'local storage', 'fingerprint'],
    dataTypes: ['tracking_data', 'cookie_data'],
    blockedActions: ['set_cookie_without_consent', 'track_without_consent', 'fingerprint_without_consent'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework ePrivacy Directive, Article 5(3)',
    reason: 'Non-essential cookies require prior informed consent',
    recommendation: 'Implement cookie consent management platform; block non-essential cookies until consent',
  },

  // ========================================
  // RING 5: INDUSTRY (ADDITIONAL)
  // ========================================

  // FCRA
  {
    id: 'fcra-adverse-action',
    ring: 5,
    domain: 'industry',
    framework: 'FCRA',
    frameworkCode: 'FCRA',
    control: '§615(a)',
    controlTitle: 'Adverse Action Notice',
    keywords: ['credit', 'credit report', 'adverse action', 'credit decision', 'credit score', 'lending'],
    dataTypes: ['credit_data', 'consumer_report'],
    blockedActions: ['deny_without_notice', 'use_report_without_purpose', 'skip_adverse_notice'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework FCRA, §615(a)',
    reason: 'Consumer credit adverse actions require specific notice with CRA info and score factors',
    recommendation: 'Provide adverse action notice within 30 days with specific reasons; include dispute rights',
  },

  // ECOA
  {
    id: 'ecoa-disparate-impact',
    ring: 5,
    domain: 'industry',
    framework: 'ECOA',
    frameworkCode: 'ECOA',
    control: 'Reg B §1002.4',
    controlTitle: 'Anti-Discrimination in Lending',
    keywords: ['lending', 'credit', 'mortgage', 'loan', 'underwriting', 'pricing'],
    dataTypes: ['credit_data', 'lending_data'],
    blockedActions: ['use_prohibited_factors', 'skip_fair_lending_test', 'discriminatory_pricing'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework ECOA, Regulation B §1002.4',
    reason: 'AI lending models must not discriminate based on protected characteristics (race, sex, age, etc.)',
    recommendation: 'Run disparate impact analysis; document adverse action reasons per ECOA; monitor for fair lending',
  },

  // BSA/AML
  {
    id: 'bsa-aml-kyc',
    ring: 5,
    domain: 'industry',
    framework: 'BSA/AML',
    frameworkCode: 'BSA-AML',
    control: 'CDD Rule',
    controlTitle: 'Customer Due Diligence',
    keywords: ['customer', 'account', 'onboarding', 'kyc', 'beneficial owner', 'pep', 'sanctions'],
    dataTypes: ['customer_data', 'financial_data'],
    blockedActions: ['onboard_without_kyc', 'skip_sanctions_check', 'ignore_sar_trigger'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework BSA/AML, CDD Rule',
    reason: 'Financial institutions must verify customer identity and monitor for suspicious activity',
    recommendation: 'Complete CDD/EDD process; screen against OFAC SDN list; file SARs within 30 days',
  },

  // Section 508 / WCAG
  {
    id: 'section-508-accessibility',
    ring: 5,
    domain: 'industry',
    framework: 'Section 508',
    frameworkCode: 'SECTION-508',
    control: 'E205',
    controlTitle: 'Electronic Content Accessibility',
    keywords: ['accessibility', 'screen reader', 'aria', 'alt text', 'contrast', 'keyboard navigation'],
    dataTypes: ['ui_content', 'web_content'],
    blockedActions: ['deploy_without_vpat', 'ignore_accessibility_audit', 'remove_aria_labels'],
    severity: 'high',
    citation: 'Ring 5 (Industry), Framework Section 508, E205',
    reason: 'Government buyers require Section 508 compliance. Digital services must be accessible.',
    recommendation: 'Generate VPAT; ensure WCAG 2.1 AA compliance; test with assistive technology',
  },

  // NIS2
  {
    id: 'nis2-incident-reporting',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'NIS2 Directive',
    frameworkCode: 'NIS2',
    control: 'Art 23',
    controlTitle: 'Incident Reporting',
    keywords: ['cyber incident', 'security breach', 'ransomware', 'outage', 'denial of service'],
    dataTypes: ['security_event', 'incident_data'],
    blockedActions: ['delay_incident_report', 'suppress_incident', 'skip_24hr_notification'],
    severity: 'critical',
    citation: 'Ring 2 (Cybersecurity), Framework NIS2, Article 23',
    reason: 'Essential entities must report significant incidents within 24 hours (early warning) and 72 hours (full)',
    recommendation: 'Submit early warning within 24h; full notification within 72h; final report within 1 month',
  },

  // SEC Cybersecurity
  {
    id: 'sec-cyber-disclosure',
    ring: 5,
    domain: 'industry',
    framework: 'SEC Cybersecurity Rules',
    frameworkCode: 'SEC-CYBER',
    control: 'Item 1.05 (8-K)',
    controlTitle: 'Material Incident Disclosure',
    keywords: ['material', 'cyber incident', 'data breach', 'sec filing', 'disclosure'],
    dataTypes: ['security_event', 'corporate_data'],
    blockedActions: ['delay_8k_filing', 'suppress_material_incident', 'misrepresent_impact'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework SEC Cybersecurity Rules, Item 1.05',
    reason: 'Public companies must disclose material cybersecurity incidents within 4 business days on Form 8-K',
    recommendation: 'File 8-K within 4 business days of materiality determination; describe impact and remediation',
  },
];

// ============================================================================
// COMPLIANCE ENFORCER SERVICE
// ============================================================================

export class ComplianceEnforcer {
  private rules: ComplianceRule[] = COMPLIANCE_RULES;

  /**
   * Check an action against all compliance rules
   * Returns detailed violations with citations
   */
  checkAction(context: ActionContext): ComplianceCheck {
    const violations: ComplianceViolation[] = [];
    const actionLower = context.action.toLowerCase();
    const descLower = context.description.toLowerCase();
    const dataTypes = context.dataTypes || [];

    for (const rule of this.rules) {
      // Check if action matches blocked actions
      const actionMatch = rule.blockedActions.some(blocked => 
        actionLower.includes(blocked.replace(/_/g, ' ')) ||
        actionLower.includes(blocked.replace(/_/g, ''))
      );

      // Check keywords in description
      const keywordMatch = rule.keywords.some(kw => descLower.includes(kw));

      // Check data types
      const dataTypeMatch = rule.dataTypes.some(dt => 
        dataTypes.includes(dt) || dt === 'any'
      );

      // If we have both an action match and either keyword or data type match
      if (actionMatch && (keywordMatch || dataTypeMatch)) {
        violations.push({
          id: `violation-${rule.id}-${Date.now()}`,
          timestamp: new Date(),
          ring: rule.ring,
          domain: rule.domain,
          framework: rule.framework,
          frameworkCode: rule.frameworkCode,
          control: rule.control,
          controlTitle: rule.controlTitle,
          severity: rule.severity,
          action: context.action,
          reason: rule.reason,
          citation: rule.citation,
          recommendation: rule.recommendation,
          blocked: rule.severity === 'critical' || rule.severity === 'high',
        });
      }
    }

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    violations.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const blocked = violations.some(v => v.blocked);
    const citations = violations.map(v => v.citation);
    const riskLevel = this.calculateRiskLevel(violations);
    
    let recommendation = 'Action approved';
    if (violations.length > 0) {
      recommendation = violations[0].recommendation;
    }

    return {
      allowed: !blocked,
      violations,
      citations,
      recommendation,
      riskLevel,
    };
  }

  /**
   * Quick check for Council agents - returns formatted response
   */
  enforceForCouncil(
    agentId: string,
    action: string,
    description: string,
    dataTypes: string[] = []
  ): { allowed: boolean; response: string; violations: ComplianceViolation[] } {
    const check = this.checkAction({ action, description, dataTypes, agentId });

    if (check.allowed && check.violations.length === 0) {
      return {
        allowed: true,
        response: `✅ Action permitted. No compliance violations detected.`,
        violations: [],
      };
    }

    if (!check.allowed) {
      const topViolation = check.violations[0];
      const response = `🚫 **BLOCKED** per ${topViolation.citation}

**Reason:** ${topViolation.reason}

**Recommendation:** ${topViolation.recommendation}

${check.violations.length > 1 ? `\n⚠️ ${check.violations.length - 1} additional violation(s) detected.` : ''}`;

      return {
        allowed: false,
        response,
        violations: check.violations,
      };
    }

    // Allowed but with warnings
    const warnings = check.violations.map(v => `- ⚠️ ${v.citation}: ${v.reason}`).join('\n');
    return {
      allowed: true,
      response: `⚠️ Action permitted with warnings:\n${warnings}\n\n**Recommendation:** ${check.recommendation}`,
      violations: check.violations,
    };
  }

  /**
   * Get formatted citation for a specific violation
   */
  formatCitation(violation: ComplianceViolation): string {
    return `Blocked per Ring ${violation.ring} (${this.getDomainName(violation.domain)}), Framework ${violation.framework}, Control ${violation.control}`;
  }

  /**
   * Get all rules for a specific domain
   */
  getRulesByDomain(domain: ComplianceDomain): ComplianceRule[] {
    return this.rules.filter(r => r.domain === domain);
  }

  /**
   * Get all rules for a specific framework
   */
  getRulesByFramework(frameworkCode: string): ComplianceRule[] {
    return this.rules.filter(r => r.frameworkCode === frameworkCode);
  }

  private calculateRiskLevel(violations: ComplianceViolation[]): ComplianceCheck['riskLevel'] {
    if (violations.length === 0) return 'none';
    if (violations.some(v => v.severity === 'critical')) return 'critical';
    if (violations.some(v => v.severity === 'high')) return 'high';
    if (violations.some(v => v.severity === 'medium')) return 'medium';
    return 'low';
  }

  private getDomainName(domain: ComplianceDomain): string {
    const names: Record<ComplianceDomain, string> = {
      ethical_ai: 'Ethical AI',
      cybersecurity: 'Cybersecurity',
      privacy: 'Privacy',
      governance: 'Governance',
      industry: 'Industry',
    };
    return names[domain];
  }
}

export const complianceEnforcer = new ComplianceEnforcer();
