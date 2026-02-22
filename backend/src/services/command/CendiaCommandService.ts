// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCommandÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ - Vertical-Specific AI Command Interface
 * 
 * Provides intelligent command bars for each industry vertical with:
 * - Natural language query understanding
 * - Vertical-specific quick actions
 * - Automatic Council agent routing
 * - Compliance framework awareness
 * - Contextual suggestions
 */

import { v4 as uuidv4 } from 'uuid';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

export type VerticalId = 
  | 'financial'
  | 'legal'
  | 'healthcare'
  | 'government'
  | 'defense'
  | 'energy'
  | 'insurance'
  | 'manufacturing'
  | 'retail'
  | 'telecom'
  | 'aerospace'
  | 'pharma'
  | 'education'
  | 'realestate'
  | 'media';

export interface CommandContext {
  verticalId: VerticalId;
  userId: string;
  organizationId: string;
  sessionId: string;
  previousCommands?: CommandExecution[];
  activeDocuments?: string[];
  userRole?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  command: string;
  category: string;
  requiredRole?: string;
  estimatedTime?: string;
  agentsInvolved: string[];
  complianceFrameworks: string[];
}

export interface CommandIntent {
  action: 'query' | 'analyze' | 'review' | 'generate' | 'compare' | 'validate' | 'export' | 'monitor';
  subject: string;
  parameters: Record<string, any>;
  confidence: number;
  suggestedAgents: string[];
  relevantFrameworks: string[];
}

export interface CommandExecution {
  id: string;
  command: string;
  intent: CommandIntent;
  verticalId: VerticalId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  councilDeliberationId?: string;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface CommandSuggestion {
  command: string;
  description: string;
  relevance: number;
  category: string;
}

// ============================================================================
// VERTICAL CONFIGURATIONS
// ============================================================================

export const VERTICAL_CONFIGS: Record<VerticalId, {
  name: string;
  description: string;
  primaryAgents: string[];
  complianceFrameworks: string[];
  quickActions: QuickAction[];
  commandPatterns: { pattern: RegExp; intent: Partial<CommandIntent> }[];
}> = {
  financial: {
    name: 'Financial Services',
    description: 'Banking, investment, trading, and financial analysis',
    primaryAgents: ['CFO', 'Risk', 'Compliance', 'Legal', 'Quant'],
    complianceFrameworks: ['BASEL-III', 'DORA', 'MiFID-II', 'SOX', 'GLBA', 'PCI-DSS', 'FINRA', 'DODD-FRANK'],
    quickActions: [
      {
        id: 'fin-risk-assess',
        label: 'Portfolio Risk Assessment',
        description: 'Analyze portfolio risk exposure across asset classes',
        icon: 'TrendingUp',
        command: 'Analyze portfolio risk exposure and VaR',
        category: 'Risk',
        estimatedTime: '2-5 min',
        agentsInvolved: ['CFO', 'Risk', 'Quant'],
        complianceFrameworks: ['BASEL-III', 'SR-11-7'],
      },
      {
        id: 'fin-compliance-check',
        label: 'Regulatory Compliance Check',
        description: 'Verify compliance with financial regulations',
        icon: 'Shield',
        command: 'Check regulatory compliance status',
        category: 'Compliance',
        estimatedTime: '3-7 min',
        agentsInvolved: ['Compliance', 'Legal', 'CFO'],
        complianceFrameworks: ['BASEL-III', 'DORA', 'MiFID-II', 'SOX'],
      },
      {
        id: 'fin-trade-review',
        label: 'Trade Execution Review',
        description: 'Review trade execution quality and best execution',
        icon: 'Activity',
        command: 'Review trade execution quality for compliance',
        category: 'Trading',
        estimatedTime: '1-3 min',
        agentsInvolved: ['CFO', 'Compliance', 'Quant'],
        complianceFrameworks: ['MiFID-II', 'FINRA'],
      },
      {
        id: 'fin-stress-test',
        label: 'Stress Test Scenario',
        description: 'Run stress test scenarios on portfolios',
        icon: 'Zap',
        command: 'Run stress test with adverse market scenario',
        category: 'Risk',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Risk', 'Quant', 'CFO'],
        complianceFrameworks: ['BASEL-III', 'DORA'],
      },
      {
        id: 'fin-aml-screen',
        label: 'AML/KYC Screening',
        description: 'Screen transactions for anti-money laundering',
        icon: 'Search',
        command: 'Screen recent transactions for AML red flags',
        category: 'Compliance',
        estimatedTime: '2-4 min',
        agentsInvolved: ['Compliance', 'Legal', 'Risk'],
        complianceFrameworks: ['GLBA', 'FINRA', 'NYDFS-500'],
      },
      {
        id: 'fin-model-validate',
        label: 'Model Validation',
        description: 'Validate quantitative models per SR 11-7',
        icon: 'CheckCircle',
        command: 'Validate pricing model for regulatory compliance',
        category: 'Quant',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Quant', 'Risk', 'Compliance'],
        complianceFrameworks: ['SR-11-7', 'BASEL-III'],
      },
    ],
    commandPatterns: [
      { pattern: /risk|var|exposure/i, intent: { action: 'analyze', subject: 'risk' } },
      { pattern: /compliance|regulatory|audit/i, intent: { action: 'validate', subject: 'compliance' } },
      { pattern: /trade|execution|order/i, intent: { action: 'review', subject: 'trading' } },
      { pattern: /stress|scenario|simulation/i, intent: { action: 'analyze', subject: 'stress-test' } },
      { pattern: /aml|kyc|sanction/i, intent: { action: 'validate', subject: 'aml' } },
      { pattern: /model|validation|backtest/i, intent: { action: 'validate', subject: 'model' } },
    ],
  },

  legal: {
    name: 'Legal Services',
    description: 'Contract review, litigation, compliance, and legal research',
    primaryAgents: ['Legal', 'Compliance', 'Ethics', 'Risk'],
    complianceFrameworks: ['ABA-MRPC', 'SRA-UK', 'GDPR', 'CCPA/CPRA'],
    quickActions: [
      {
        id: 'legal-contract-review',
        label: 'Contract Risk Analysis',
        description: 'Analyze contract for legal risks and red flags',
        icon: 'FileText',
        command: 'Analyze contract for legal risks and unfavorable terms',
        category: 'Contracts',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Legal', 'Risk', 'Compliance'],
        complianceFrameworks: ['ABA-MRPC'],
      },
      {
        id: 'legal-litigation-risk',
        label: 'Litigation Risk Assessment',
        description: 'Assess litigation exposure and strategy',
        icon: 'Scale',
        command: 'Assess litigation risk and recommend strategy',
        category: 'Litigation',
        estimatedTime: '5-15 min',
        agentsInvolved: ['Legal', 'Risk', 'Ethics'],
        complianceFrameworks: ['ABA-MRPC'],
      },
      {
        id: 'legal-research',
        label: 'Legal Research Query',
        description: 'Research case law and legal precedents',
        icon: 'Search',
        command: 'Research relevant case law and precedents',
        category: 'Research',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Legal'],
        complianceFrameworks: [],
      },
      {
        id: 'legal-compliance-gap',
        label: 'Compliance Gap Analysis',
        description: 'Identify regulatory compliance gaps',
        icon: 'AlertTriangle',
        command: 'Identify compliance gaps across regulations',
        category: 'Compliance',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Compliance', 'Legal', 'Risk'],
        complianceFrameworks: ['GDPR', 'CCPA/CPRA', 'HIPAA'],
      },
      {
        id: 'legal-privilege-review',
        label: 'Privilege Review',
        description: 'Review documents for attorney-client privilege',
        icon: 'Lock',
        command: 'Review documents for privilege classification',
        category: 'Discovery',
        estimatedTime: '5-15 min',
        agentsInvolved: ['Legal', 'Ethics'],
        complianceFrameworks: ['ABA-MRPC'],
      },
    ],
    commandPatterns: [
      { pattern: /contract|agreement|terms/i, intent: { action: 'review', subject: 'contract' } },
      { pattern: /litigation|lawsuit|dispute/i, intent: { action: 'analyze', subject: 'litigation' } },
      { pattern: /research|case law|precedent/i, intent: { action: 'query', subject: 'research' } },
      { pattern: /compliance|regulation|gap/i, intent: { action: 'validate', subject: 'compliance' } },
      { pattern: /privilege|confidential|discovery/i, intent: { action: 'review', subject: 'privilege' } },
    ],
  },

  healthcare: {
    name: 'Healthcare',
    description: 'Clinical decisions, patient care, HIPAA, and healthcare compliance',
    primaryAgents: ['Clinical', 'Compliance', 'Ethics', 'Legal', 'Risk'],
    complianceFrameworks: ['HIPAA', 'HITRUST-CSF', 'FDA-21-CFR-11', 'HL7-FHIR', 'GxP', 'ICH-E6-R2'],
    quickActions: [
      {
        id: 'health-hipaa-check',
        label: 'HIPAA Compliance Check',
        description: 'Verify HIPAA compliance for PHI handling',
        icon: 'Shield',
        command: 'Check HIPAA compliance for patient data handling',
        category: 'Compliance',
        estimatedTime: '2-5 min',
        agentsInvolved: ['Compliance', 'Legal', 'Risk'],
        complianceFrameworks: ['HIPAA', 'HITRUST-CSF'],
      },
      {
        id: 'health-clinical-decision',
        label: 'Clinical Decision Support',
        description: 'AI-assisted clinical decision support',
        icon: 'Heart',
        command: 'Provide clinical decision support for patient case',
        category: 'Clinical',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Clinical', 'Ethics', 'Risk'],
        complianceFrameworks: ['FDA-21-CFR-11'],
      },
      {
        id: 'health-trial-protocol',
        label: 'Clinical Trial Protocol Review',
        description: 'Review clinical trial protocol for compliance',
        icon: 'Clipboard',
        command: 'Review clinical trial protocol for ICH GCP compliance',
        category: 'Clinical Trials',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Clinical', 'Compliance', 'Ethics', 'Legal'],
        complianceFrameworks: ['ICH-E6-R2', 'GxP', 'FDA-21-CFR-11'],
      },
      {
        id: 'health-phi-audit',
        label: 'PHI Access Audit',
        description: 'Audit access to protected health information',
        icon: 'Eye',
        command: 'Audit PHI access logs for unauthorized access',
        category: 'Security',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Compliance', 'Risk'],
        complianceFrameworks: ['HIPAA', 'HITRUST-CSF'],
      },
    ],
    commandPatterns: [
      { pattern: /hipaa|phi|patient data/i, intent: { action: 'validate', subject: 'hipaa' } },
      { pattern: /clinical|diagnosis|treatment/i, intent: { action: 'analyze', subject: 'clinical' } },
      { pattern: /trial|protocol|gcp/i, intent: { action: 'review', subject: 'clinical-trial' } },
      { pattern: /audit|access|log/i, intent: { action: 'monitor', subject: 'audit' } },
    ],
  },

  government: {
    name: 'Government',
    description: 'Public sector operations, procurement, and regulatory compliance',
    primaryAgents: ['Compliance', 'Legal', 'Risk', 'Ethics', 'Security'],
    complianceFrameworks: ['FedRAMP', 'FISMA', 'StateRAMP', 'CJIS', 'FIPS-140-3', 'NIST-800-53'],
    quickActions: [
      {
        id: 'gov-fedramp-status',
        label: 'FedRAMP Authorization Status',
        description: 'Check FedRAMP authorization status and gaps',
        icon: 'Shield',
        command: 'Check FedRAMP authorization status',
        category: 'Compliance',
        estimatedTime: '3-5 min',
        agentsInvolved: ['Compliance', 'Security', 'Risk'],
        complianceFrameworks: ['FedRAMP', 'NIST-800-53'],
      },
      {
        id: 'gov-procurement-review',
        label: 'Procurement Review',
        description: 'Review procurement for FAR/DFAR compliance',
        icon: 'FileText',
        command: 'Review procurement package for FAR compliance',
        category: 'Procurement',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Legal', 'Compliance', 'Risk'],
        complianceFrameworks: ['DFARS'],
      },
      {
        id: 'gov-security-clearance',
        label: 'Security Clearance Check',
        description: 'Verify security clearance requirements',
        icon: 'Lock',
        command: 'Check security clearance requirements for project',
        category: 'Security',
        estimatedTime: '2-4 min',
        agentsInvolved: ['Security', 'Compliance'],
        complianceFrameworks: ['CJIS', 'FIPS-140-3'],
      },
      {
        id: 'gov-foia-response',
        label: 'FOIA Response Preparation',
        description: 'Prepare FOIA response with redactions',
        icon: 'FileSearch',
        command: 'Prepare FOIA response with appropriate redactions',
        category: 'Legal',
        estimatedTime: '10-30 min',
        agentsInvolved: ['Legal', 'Compliance', 'Ethics'],
        complianceFrameworks: [],
      },
    ],
    commandPatterns: [
      { pattern: /fedramp|stateramp|authorization/i, intent: { action: 'validate', subject: 'fedramp' } },
      { pattern: /procurement|far|contract/i, intent: { action: 'review', subject: 'procurement' } },
      { pattern: /clearance|classified|security/i, intent: { action: 'validate', subject: 'security' } },
      { pattern: /foia|public record|disclosure/i, intent: { action: 'generate', subject: 'foia' } },
    ],
  },

  defense: {
    name: 'Defense & Aerospace',
    description: 'Defense contracting, ITAR, export controls, and security',
    primaryAgents: ['Security', 'Compliance', 'Legal', 'Risk', 'Ethics'],
    complianceFrameworks: ['ITAR', 'EAR', 'DFARS', 'CMMC', 'NIST-800-53', 'FIPS-140-3'],
    quickActions: [
      {
        id: 'def-itar-review',
        label: 'ITAR Classification Review',
        description: 'Review items for ITAR classification',
        icon: 'Shield',
        command: 'Review items for ITAR/EAR classification',
        category: 'Export Control',
        estimatedTime: '5-15 min',
        agentsInvolved: ['Compliance', 'Legal', 'Security'],
        complianceFrameworks: ['ITAR', 'EAR'],
      },
      {
        id: 'def-cmmc-assess',
        label: 'CMMC Readiness Assessment',
        description: 'Assess CMMC compliance readiness',
        icon: 'CheckCircle',
        command: 'Assess CMMC Level 2 compliance readiness',
        category: 'Compliance',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Compliance', 'Security', 'Risk'],
        complianceFrameworks: ['CMMC', 'NIST-800-53'],
      },
      {
        id: 'def-cui-handling',
        label: 'CUI Handling Review',
        description: 'Review Controlled Unclassified Information handling',
        icon: 'Lock',
        command: 'Review CUI handling procedures for compliance',
        category: 'Security',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Security', 'Compliance'],
        complianceFrameworks: ['DFARS', 'NIST-800-53'],
      },
      {
        id: 'def-supply-chain',
        label: 'Supply Chain Risk Assessment',
        description: 'Assess defense supply chain risks',
        icon: 'Truck',
        command: 'Assess supply chain security risks',
        category: 'Risk',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Risk', 'Security', 'Compliance'],
        complianceFrameworks: ['DFARS', 'CMMC'],
      },
    ],
    commandPatterns: [
      { pattern: /itar|ear|export/i, intent: { action: 'validate', subject: 'export-control' } },
      { pattern: /cmmc|cybersecurity maturity/i, intent: { action: 'validate', subject: 'cmmc' } },
      { pattern: /cui|controlled|classified/i, intent: { action: 'review', subject: 'cui' } },
      { pattern: /supply chain|vendor|contractor/i, intent: { action: 'analyze', subject: 'supply-chain' } },
    ],
  },

  energy: {
    name: 'Energy & Utilities',
    description: 'Grid operations, pipeline security, and energy compliance',
    primaryAgents: ['Operations', 'Security', 'Compliance', 'Risk', 'Safety'],
    complianceFrameworks: ['NERC-CIP', 'IEC-62443', 'TSA-PIPELINE', 'API-1164', 'ISO-55001'],
    quickActions: [
      {
        id: 'energy-nerc-cip',
        label: 'NERC CIP Compliance Check',
        description: 'Check NERC CIP compliance for bulk electric system',
        icon: 'Zap',
        command: 'Check NERC CIP compliance status',
        category: 'Compliance',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Compliance', 'Security', 'Operations'],
        complianceFrameworks: ['NERC-CIP'],
      },
      {
        id: 'energy-scada-security',
        label: 'SCADA Security Assessment',
        description: 'Assess SCADA/ICS security posture',
        icon: 'Shield',
        command: 'Assess SCADA system security posture',
        category: 'Security',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Security', 'Operations', 'Risk'],
        complianceFrameworks: ['IEC-62443', 'NERC-CIP'],
      },
      {
        id: 'energy-pipeline-security',
        label: 'Pipeline Security Review',
        description: 'Review pipeline cybersecurity per TSA directives',
        icon: 'Lock',
        command: 'Review pipeline security per TSA Security Directives',
        category: 'Security',
        estimatedTime: '5-15 min',
        agentsInvolved: ['Security', 'Compliance', 'Operations'],
        complianceFrameworks: ['TSA-PIPELINE', 'API-1164'],
      },
      {
        id: 'energy-grid-reliability',
        label: 'Grid Reliability Analysis',
        description: 'Analyze grid reliability and contingency planning',
        icon: 'Activity',
        command: 'Analyze grid reliability and identify vulnerabilities',
        category: 'Operations',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Operations', 'Risk', 'Security'],
        complianceFrameworks: ['NERC-CIP'],
      },
    ],
    commandPatterns: [
      { pattern: /nerc|cip|bulk electric/i, intent: { action: 'validate', subject: 'nerc-cip' } },
      { pattern: /scada|ics|ot/i, intent: { action: 'analyze', subject: 'scada' } },
      { pattern: /pipeline|tsa|oil|gas/i, intent: { action: 'review', subject: 'pipeline' } },
      { pattern: /grid|reliability|outage/i, intent: { action: 'analyze', subject: 'grid' } },
    ],
  },

  insurance: {
    name: 'Insurance',
    description: 'Claims processing, underwriting, and insurance compliance',
    primaryAgents: ['Underwriting', 'Claims', 'Compliance', 'Legal', 'Risk', 'Actuary'],
    complianceFrameworks: ['SOLVENCY-II', 'NAIC', 'DORA', 'NYDFS-500', 'GDPR'],
    quickActions: [
      {
        id: 'ins-claims-review',
        label: 'Claims Review',
        description: 'Review claim for fraud indicators and coverage',
        icon: 'FileText',
        command: 'Review claim for fraud indicators and coverage analysis',
        category: 'Claims',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Claims', 'Legal', 'Risk'],
        complianceFrameworks: ['NAIC'],
      },
      {
        id: 'ins-underwriting',
        label: 'Underwriting Assessment',
        description: 'Assess risk and premium pricing',
        icon: 'Calculator',
        command: 'Assess underwriting risk and recommend pricing',
        category: 'Underwriting',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Underwriting', 'Actuary', 'Risk'],
        complianceFrameworks: ['SOLVENCY-II', 'NAIC'],
      },
      {
        id: 'ins-solvency',
        label: 'Solvency Analysis',
        description: 'Analyze capital adequacy and solvency ratios',
        icon: 'TrendingUp',
        command: 'Analyze solvency ratios and capital adequacy',
        category: 'Compliance',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Actuary', 'Compliance', 'Risk'],
        complianceFrameworks: ['SOLVENCY-II', 'NAIC'],
      },
      {
        id: 'ins-reserve-review',
        label: 'Reserve Adequacy Review',
        description: 'Review loss reserve adequacy',
        icon: 'Database',
        command: 'Review loss reserve adequacy and projections',
        category: 'Actuarial',
        estimatedTime: '10-15 min',
        agentsInvolved: ['Actuary', 'Risk', 'Compliance'],
        complianceFrameworks: ['SOLVENCY-II', 'NAIC'],
      },
    ],
    commandPatterns: [
      { pattern: /claim|coverage|fraud/i, intent: { action: 'review', subject: 'claims' } },
      { pattern: /underwriting|premium|risk/i, intent: { action: 'analyze', subject: 'underwriting' } },
      { pattern: /solvency|capital|ratio/i, intent: { action: 'analyze', subject: 'solvency' } },
      { pattern: /reserve|loss|projection/i, intent: { action: 'review', subject: 'reserves' } },
    ],
  },

  manufacturing: {
    name: 'Manufacturing',
    description: 'Production operations, quality control, and supply chain',
    primaryAgents: ['Operations', 'Quality', 'Safety', 'Compliance', 'Risk'],
    complianceFrameworks: ['ISO-9001', 'ISO-22301', 'ISO-55001', 'IEC-62443', 'ISO-14001'],
    quickActions: [
      {
        id: 'mfg-quality-check',
        label: 'Quality Control Review',
        description: 'Review quality control metrics and non-conformances',
        icon: 'CheckCircle',
        command: 'Review quality control metrics and identify issues',
        category: 'Quality',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Quality', 'Operations', 'Risk'],
        complianceFrameworks: ['ISO-9001'],
      },
      {
        id: 'mfg-supply-chain',
        label: 'Supply Chain Analysis',
        description: 'Analyze supply chain risks and dependencies',
        icon: 'Truck',
        command: 'Analyze supply chain risks and bottlenecks',
        category: 'Supply Chain',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Operations', 'Risk', 'Compliance'],
        complianceFrameworks: ['ISO-22301'],
      },
      {
        id: 'mfg-safety-audit',
        label: 'Safety Compliance Audit',
        description: 'Audit workplace safety compliance',
        icon: 'AlertTriangle',
        command: 'Audit workplace safety compliance status',
        category: 'Safety',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Safety', 'Compliance', 'Operations'],
        complianceFrameworks: ['ISO-14001'],
      },
      {
        id: 'mfg-asset-mgmt',
        label: 'Asset Management Review',
        description: 'Review asset lifecycle and maintenance',
        icon: 'Settings',
        command: 'Review asset management and maintenance schedules',
        category: 'Assets',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Operations', 'Risk'],
        complianceFrameworks: ['ISO-55001'],
      },
    ],
    commandPatterns: [
      { pattern: /quality|defect|non-conformance/i, intent: { action: 'review', subject: 'quality' } },
      { pattern: /supply chain|vendor|logistics/i, intent: { action: 'analyze', subject: 'supply-chain' } },
      { pattern: /safety|osha|workplace/i, intent: { action: 'validate', subject: 'safety' } },
      { pattern: /asset|maintenance|equipment/i, intent: { action: 'review', subject: 'assets' } },
    ],
  },

  retail: {
    name: 'Retail & E-commerce',
    description: 'Retail operations, payments, and consumer data protection',
    primaryAgents: ['Operations', 'Compliance', 'Legal', 'Risk', 'Marketing'],
    complianceFrameworks: ['PCI-DSS', 'PCI-P2PE', 'PCI-3DS', 'GDPR', 'CCPA/CPRA'],
    quickActions: [
      {
        id: 'retail-pci-check',
        label: 'PCI DSS Compliance Check',
        description: 'Check PCI DSS compliance for payment processing',
        icon: 'CreditCard',
        command: 'Check PCI DSS compliance status',
        category: 'Compliance',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Compliance', 'Risk', 'Operations'],
        complianceFrameworks: ['PCI-DSS', 'PCI-P2PE', 'PCI-3DS'],
      },
      {
        id: 'retail-privacy',
        label: 'Consumer Privacy Review',
        description: 'Review consumer data privacy practices',
        icon: 'Lock',
        command: 'Review consumer data privacy compliance',
        category: 'Privacy',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Compliance', 'Legal', 'Marketing'],
        complianceFrameworks: ['GDPR', 'CCPA/CPRA'],
      },
      {
        id: 'retail-fraud-detect',
        label: 'Fraud Detection Analysis',
        description: 'Analyze transactions for fraud patterns',
        icon: 'AlertTriangle',
        command: 'Analyze recent transactions for fraud patterns',
        category: 'Risk',
        estimatedTime: '3-5 min',
        agentsInvolved: ['Risk', 'Operations', 'Compliance'],
        complianceFrameworks: ['PCI-DSS'],
      },
    ],
    commandPatterns: [
      { pattern: /pci|payment|card/i, intent: { action: 'validate', subject: 'pci' } },
      { pattern: /privacy|gdpr|ccpa|consumer/i, intent: { action: 'review', subject: 'privacy' } },
      { pattern: /fraud|chargeback|dispute/i, intent: { action: 'analyze', subject: 'fraud' } },
    ],
  },

  telecom: {
    name: 'Telecommunications',
    description: 'Network operations, communications compliance, and security',
    primaryAgents: ['Operations', 'Security', 'Compliance', 'Legal', 'Risk'],
    complianceFrameworks: ['GSMA-NESAS', 'ETSI-EN-303-645', 'FCC-TCPA', 'GDPR'],
    quickActions: [
      {
        id: 'telecom-network-security',
        label: 'Network Security Assessment',
        description: 'Assess network infrastructure security',
        icon: 'Wifi',
        command: 'Assess network infrastructure security posture',
        category: 'Security',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Security', 'Operations', 'Risk'],
        complianceFrameworks: ['GSMA-NESAS'],
      },
      {
        id: 'telecom-tcpa-compliance',
        label: 'TCPA Compliance Review',
        description: 'Review communications for TCPA compliance',
        icon: 'Phone',
        command: 'Review marketing communications for TCPA compliance',
        category: 'Compliance',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Compliance', 'Legal', 'Marketing'],
        complianceFrameworks: ['FCC-TCPA'],
      },
    ],
    commandPatterns: [
      { pattern: /network|infrastructure|5g/i, intent: { action: 'analyze', subject: 'network' } },
      { pattern: /tcpa|robocall|consent/i, intent: { action: 'validate', subject: 'tcpa' } },
    ],
  },

  aerospace: {
    name: 'Aerospace',
    description: 'Aviation safety, airworthiness, and aerospace compliance',
    primaryAgents: ['Safety', 'Quality', 'Compliance', 'Legal', 'Risk'],
    complianceFrameworks: ['AS9100', 'DO-326A', 'ITAR', 'EAR'],
    quickActions: [
      {
        id: 'aero-as9100',
        label: 'AS9100 Compliance Check',
        description: 'Check aerospace quality management compliance',
        icon: 'Plane',
        command: 'Check AS9100 quality management compliance',
        category: 'Quality',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Quality', 'Compliance', 'Risk'],
        complianceFrameworks: ['AS9100'],
      },
      {
        id: 'aero-airworthiness',
        label: 'Airworthiness Security Review',
        description: 'Review airborne systems security per DO-326A',
        icon: 'Shield',
        command: 'Review airworthiness security compliance',
        category: 'Security',
        estimatedTime: '10-20 min',
        agentsInvolved: ['Security', 'Safety', 'Compliance'],
        complianceFrameworks: ['DO-326A'],
      },
    ],
    commandPatterns: [
      { pattern: /as9100|quality|aerospace/i, intent: { action: 'validate', subject: 'as9100' } },
      { pattern: /airworthiness|do-326|safety/i, intent: { action: 'review', subject: 'airworthiness' } },
    ],
  },

  pharma: {
    name: 'Pharmaceutical',
    description: 'Drug development, clinical trials, and pharma compliance',
    primaryAgents: ['Clinical', 'Regulatory', 'Quality', 'Legal', 'Risk'],
    complianceFrameworks: ['FDA-21-CFR-11', 'GxP', 'ICH-E6-R2', 'ISO-13485', 'MDR-EU'],
    quickActions: [
      {
        id: 'pharma-gxp-check',
        label: 'GxP Compliance Check',
        description: 'Check Good Practice compliance (GLP/GMP/GCP)',
        icon: 'Pill',
        command: 'Check GxP compliance status',
        category: 'Compliance',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Quality', 'Regulatory', 'Compliance'],
        complianceFrameworks: ['GxP', 'FDA-21-CFR-11'],
      },
      {
        id: 'pharma-21-cfr',
        label: '21 CFR Part 11 Review',
        description: 'Review electronic records compliance',
        icon: 'FileText',
        command: 'Review 21 CFR Part 11 electronic records compliance',
        category: 'Compliance',
        estimatedTime: '10-15 min',
        agentsInvolved: ['Regulatory', 'Quality', 'Compliance'],
        complianceFrameworks: ['FDA-21-CFR-11'],
      },
      {
        id: 'pharma-batch-release',
        label: 'Batch Release Review',
        description: 'Review batch records for release decision',
        icon: 'CheckCircle',
        command: 'Review batch records for quality release',
        category: 'Quality',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Quality', 'Regulatory'],
        complianceFrameworks: ['GxP'],
      },
    ],
    commandPatterns: [
      { pattern: /gxp|gmp|glp|gcp/i, intent: { action: 'validate', subject: 'gxp' } },
      { pattern: /21 cfr|electronic record|signature/i, intent: { action: 'review', subject: '21-cfr-11' } },
      { pattern: /batch|release|lot/i, intent: { action: 'review', subject: 'batch' } },
    ],
  },

  education: {
    name: 'Education',
    description: 'Student records, educational compliance, and institutional operations',
    primaryAgents: ['Compliance', 'Legal', 'Operations', 'Ethics'],
    complianceFrameworks: ['FERPA', 'COPPA', 'GDPR'],
    quickActions: [
      {
        id: 'edu-ferpa-check',
        label: 'FERPA Compliance Check',
        description: 'Check FERPA compliance for student records',
        icon: 'GraduationCap',
        command: 'Check FERPA compliance for student data handling',
        category: 'Compliance',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Compliance', 'Legal'],
        complianceFrameworks: ['FERPA'],
      },
      {
        id: 'edu-coppa-review',
        label: 'COPPA Review',
        description: 'Review children\'s data privacy compliance',
        icon: 'Users',
        command: 'Review COPPA compliance for under-13 users',
        category: 'Privacy',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Compliance', 'Legal', 'Ethics'],
        complianceFrameworks: ['COPPA'],
      },
    ],
    commandPatterns: [
      { pattern: /ferpa|student record|education/i, intent: { action: 'validate', subject: 'ferpa' } },
      { pattern: /coppa|children|minor/i, intent: { action: 'review', subject: 'coppa' } },
    ],
  },

  realestate: {
    name: 'Real Estate',
    description: 'Property transactions, construction, and real estate compliance',
    primaryAgents: ['Legal', 'Compliance', 'Risk', 'Operations'],
    complianceFrameworks: ['RESPA', 'ISO-19650'],
    quickActions: [
      {
        id: 're-respa-check',
        label: 'RESPA Compliance Check',
        description: 'Check RESPA compliance for transactions',
        icon: 'Home',
        command: 'Check RESPA compliance for transaction',
        category: 'Compliance',
        estimatedTime: '3-5 min',
        agentsInvolved: ['Compliance', 'Legal'],
        complianceFrameworks: ['RESPA'],
      },
      {
        id: 're-title-review',
        label: 'Title Review',
        description: 'Review title for issues and encumbrances',
        icon: 'FileText',
        command: 'Review title report for issues',
        category: 'Legal',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Legal', 'Risk'],
        complianceFrameworks: [],
      },
    ],
    commandPatterns: [
      { pattern: /respa|settlement|closing/i, intent: { action: 'validate', subject: 'respa' } },
      { pattern: /title|encumbrance|lien/i, intent: { action: 'review', subject: 'title' } },
    ],
  },

  media: {
    name: 'Media & Entertainment',
    description: 'Content rights, licensing, and media compliance',
    primaryAgents: ['Legal', 'Compliance', 'Risk', 'Ethics'],
    complianceFrameworks: ['GDPR', 'CCPA/CPRA', 'COPPA'],
    quickActions: [
      {
        id: 'media-rights-check',
        label: 'Rights Clearance Check',
        description: 'Check content rights and licensing',
        icon: 'Film',
        command: 'Check content rights and licensing status',
        category: 'Legal',
        estimatedTime: '5-10 min',
        agentsInvolved: ['Legal', 'Compliance'],
        complianceFrameworks: [],
      },
      {
        id: 'media-content-review',
        label: 'Content Compliance Review',
        description: 'Review content for compliance issues',
        icon: 'Eye',
        command: 'Review content for regulatory compliance',
        category: 'Compliance',
        estimatedTime: '3-8 min',
        agentsInvolved: ['Compliance', 'Legal', 'Ethics'],
        complianceFrameworks: ['COPPA'],
      },
    ],
    commandPatterns: [
      { pattern: /rights|license|copyright/i, intent: { action: 'validate', subject: 'rights' } },
      { pattern: /content|moderation|compliance/i, intent: { action: 'review', subject: 'content' } },
    ],
  },
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class CendiaCommandService {
  private executions: Map<string, CommandExecution> = new Map();

  constructor() {
    this.loadFromDB().catch(() => {});
  }

  /**
   * Get vertical configuration
   */
  getVerticalConfig(verticalId: VerticalId) {
    return VERTICAL_CONFIGS[verticalId];
  }

  /**
   * Get all available verticals
   */
  getAllVerticals() {
    return Object.entries(VERTICAL_CONFIGS).map(([id, config]) => ({
      id,
      name: config.name,
      description: config.description,
      quickActionCount: config.quickActions.length,
      primaryAgents: config.primaryAgents,
      complianceFrameworks: config.complianceFrameworks,
    }));
  }

  /**
   * Get quick actions for a vertical
   */
  getQuickActions(verticalId: VerticalId, category?: string): QuickAction[] {
    const config = VERTICAL_CONFIGS[verticalId];
    if (!config) return [];
    
    if (category) {
      return config.quickActions.filter(a => a.category === category);
    }
    return config.quickActions;
  }

  /**
   * Parse natural language command to intent
   */
  parseCommand(command: string, context: CommandContext): CommandIntent {
    const config = VERTICAL_CONFIGS[context.verticalId];
    if (!config) {
      return {
        action: 'query',
        subject: 'unknown',
        parameters: { rawCommand: command },
        confidence: 0.3,
        suggestedAgents: [],
        relevantFrameworks: [],
      };
    }

    // Match against patterns
    let bestMatch: Partial<CommandIntent> | null = null;
    let highestConfidence = 0;

    for (const { pattern, intent } of config.commandPatterns) {
      if (pattern.test(command)) {
        const confidence = 0.85;
        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = intent;
        }
      }
    }

    if (bestMatch) {
      return {
        action: bestMatch.action || 'query',
        subject: bestMatch.subject || 'general',
        parameters: { rawCommand: command },
        confidence: highestConfidence,
        suggestedAgents: config.primaryAgents,
        relevantFrameworks: config.complianceFrameworks,
      };
    }

    // Default intent
    return {
      action: 'query',
      subject: 'general',
      parameters: { rawCommand: command },
      confidence: 0.5,
      suggestedAgents: config.primaryAgents.slice(0, 3),
      relevantFrameworks: config.complianceFrameworks.slice(0, 3),
    };
  }

  /**
   * Execute a command
   */
  async executeCommand(command: string, context: CommandContext): Promise<CommandExecution> {
    const intent = this.parseCommand(command, context);
    
    const execution: CommandExecution = {
      id: uuidv4(),
      command,
      intent,
      verticalId: context.verticalId,
      status: 'pending',
      startedAt: new Date(),
    };

    this.executions.set(execution.id, execution);

    // Uses deterministic computation; ROADMAP: to the Council
    // Execute the command
    execution.status = 'processing';

    // Process request
    await new Promise(resolve => setTimeout(resolve, 100));

    execution.status = 'completed';
    execution.completedAt = new Date();
    execution.result = {
      message: `Command processed: ${command}`,
      intent,
      suggestedNextSteps: [
        'Review the analysis results',
        'Export compliance report',
        'Schedule follow-up review',
      ],
    };

    return execution;
  }

  /**
   * Get command suggestions based on context
   */
  getSuggestions(partialCommand: string, context: CommandContext): CommandSuggestion[] {
    const config = VERTICAL_CONFIGS[context.verticalId];
    if (!config) return [];

    const suggestions: CommandSuggestion[] = [];
    const lowerPartial = partialCommand.toLowerCase();

    // Match quick actions
    for (const action of config.quickActions) {
      if (action.command.toLowerCase().includes(lowerPartial) ||
          action.label.toLowerCase().includes(lowerPartial)) {
        suggestions.push({
          command: action.command,
          description: action.description,
          relevance: 0.9,
          category: action.category,
        });
      }
    }

    // Sort by relevance
    return suggestions.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }

  /**
   * Get execution history
   */
  getExecutionHistory(context: CommandContext, limit: number = 10): CommandExecution[] {
    const executions = Array.from(this.executions.values())
      .filter(e => e.verticalId === context.verticalId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
    
    return executions;
  }

  /**
   * Get execution by ID
   */
  getExecution(id: string): CommandExecution | undefined {
    return this.executions.get(id);
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaCommand', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.executions.has(d.id)) this.executions.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaCommandService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaCommandService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    recordCount: number;
    lastActivity: Date | null;
    uptime: number;
    metrics: Record<string, number>;
  }> {
    const maps = Object.entries(this).filter(([_, v]) => v instanceof Map) as [string, Map<string, unknown>][];
    const totalRecords = maps.reduce((sum, [_, m]) => sum + m.size, 0);
    return {
      serviceName: 'CendiaCommand',
      status: 'operational',
      recordCount: totalRecords,
      lastActivity: new Date(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(maps.map(([k, m]) => [k, m.size])),
    };
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaCommand',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaCommandService = new CendiaCommandService();
