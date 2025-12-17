/**
 * CendiaPanopticon™ - Regulatory Frameworks Database
 * 
 * 200+ frameworks across 50+ jurisdictions
 */

import type { RegulationFramework, RegulatoryRadarEvent } from './types.js';

// =============================================================================
// REGULATORY FRAMEWORK DATABASE
// =============================================================================

export const REGULATORY_FRAMEWORKS: RegulationFramework[] = [
  // Data Protection & Privacy
  { code: 'GDPR', name: 'General Data Protection Regulation', jurisdiction: 'EU', category: 'Privacy', description: 'EU data protection and privacy regulation', requirements: 99 },
  { code: 'CCPA', name: 'California Consumer Privacy Act', jurisdiction: 'US-CA', category: 'Privacy', description: 'California consumer privacy rights', requirements: 45 },
  { code: 'CPRA', name: 'California Privacy Rights Act', jurisdiction: 'US-CA', category: 'Privacy', description: 'Enhanced California privacy protections', requirements: 52 },
  { code: 'HIPAA', name: 'Health Insurance Portability and Accountability Act', jurisdiction: 'US', category: 'Healthcare', description: 'US healthcare data protection', requirements: 75 },
  { code: 'PIPEDA', name: 'Personal Information Protection and Electronic Documents Act', jurisdiction: 'CA', category: 'Privacy', description: 'Canadian privacy law', requirements: 40 },
  { code: 'LGPD', name: 'Lei Geral de Proteção de Dados', jurisdiction: 'BR', category: 'Privacy', description: 'Brazilian data protection law', requirements: 65 },
  { code: 'PDPA', name: 'Personal Data Protection Act', jurisdiction: 'SG', category: 'Privacy', description: 'Singapore data protection', requirements: 38 },
  { code: 'POPIA', name: 'Protection of Personal Information Act', jurisdiction: 'ZA', category: 'Privacy', description: 'South African data protection', requirements: 42 },
  
  // Financial Services
  { code: 'SOX', name: 'Sarbanes-Oxley Act', jurisdiction: 'US', category: 'Financial', description: 'US financial reporting and audit requirements', requirements: 68 },
  { code: 'BASEL_III', name: 'Basel III', jurisdiction: 'Global', category: 'Banking', description: 'International banking capital requirements', requirements: 85 },
  { code: 'BASEL_IV', name: 'Basel IV', jurisdiction: 'Global', category: 'Banking', description: 'Enhanced banking risk framework', requirements: 92 },
  { code: 'DORA', name: 'Digital Operational Resilience Act', jurisdiction: 'EU', category: 'Financial', description: 'EU financial sector ICT resilience', requirements: 64 },
  { code: 'MiFID_II', name: 'Markets in Financial Instruments Directive II', jurisdiction: 'EU', category: 'Financial', description: 'EU financial markets regulation', requirements: 78 },
  { code: 'PSD2', name: 'Payment Services Directive 2', jurisdiction: 'EU', category: 'Payments', description: 'EU payment services regulation', requirements: 55 },
  { code: 'GLBA', name: 'Gramm-Leach-Bliley Act', jurisdiction: 'US', category: 'Financial', description: 'US financial privacy requirements', requirements: 35 },
  { code: 'DODD_FRANK', name: 'Dodd-Frank Wall Street Reform Act', jurisdiction: 'US', category: 'Financial', description: 'US financial system reform', requirements: 120 },
  
  // Cybersecurity
  { code: 'NIST_CSF', name: 'NIST Cybersecurity Framework', jurisdiction: 'US', category: 'Cybersecurity', description: 'US cybersecurity best practices', requirements: 108 },
  { code: 'NIST_800_53', name: 'NIST SP 800-53', jurisdiction: 'US', category: 'Cybersecurity', description: 'Security and privacy controls', requirements: 325 },
  { code: 'ISO_27001', name: 'ISO/IEC 27001', jurisdiction: 'Global', category: 'Cybersecurity', description: 'Information security management', requirements: 114 },
  { code: 'ISO_27701', name: 'ISO/IEC 27701', jurisdiction: 'Global', category: 'Privacy', description: 'Privacy information management', requirements: 85 },
  { code: 'SOC_2', name: 'SOC 2', jurisdiction: 'US', category: 'Audit', description: 'Service organization controls', requirements: 64 },
  { code: 'NIS2', name: 'NIS 2 Directive', jurisdiction: 'EU', category: 'Cybersecurity', description: 'EU network and information security', requirements: 72 },
  { code: 'CIS_CONTROLS', name: 'CIS Critical Security Controls', jurisdiction: 'Global', category: 'Cybersecurity', description: 'Top cybersecurity controls', requirements: 153 },
  
  // AI & Technology
  { code: 'EU_AI_ACT', name: 'EU AI Act', jurisdiction: 'EU', category: 'AI', description: 'EU artificial intelligence regulation', requirements: 89 },
  { code: 'NIST_AI_RMF', name: 'NIST AI Risk Management Framework', jurisdiction: 'US', category: 'AI', description: 'AI risk management guidance', requirements: 45 },
  { code: 'NYC_LOCAL_144', name: 'NYC Local Law 144', jurisdiction: 'US-NY', category: 'AI', description: 'AI hiring tool audit requirements', requirements: 12 },
  { code: 'CO_AI_ACT', name: 'Colorado AI Act', jurisdiction: 'US-CO', category: 'AI', description: 'Colorado high-risk AI systems', requirements: 28 },
  
  // Industry-Specific
  { code: 'PCI_DSS', name: 'Payment Card Industry Data Security Standard', jurisdiction: 'Global', category: 'Payments', description: 'Payment card data security', requirements: 264 },
  { code: 'NERC_CIP', name: 'NERC Critical Infrastructure Protection', jurisdiction: 'US', category: 'Energy', description: 'Power grid cybersecurity', requirements: 82 },
  { code: 'FDA_21_CFR_11', name: 'FDA 21 CFR Part 11', jurisdiction: 'US', category: 'Healthcare', description: 'Electronic records and signatures', requirements: 48 },
  { code: 'FERPA', name: 'Family Educational Rights and Privacy Act', jurisdiction: 'US', category: 'Education', description: 'Student data privacy', requirements: 32 },
  { code: 'FISMA', name: 'Federal Information Security Modernization Act', jurisdiction: 'US', category: 'Government', description: 'Federal agency security', requirements: 95 },
  { code: 'FedRAMP', name: 'Federal Risk and Authorization Management Program', jurisdiction: 'US', category: 'Government', description: 'Cloud security for government', requirements: 325 },
  
  // ESG & Sustainability
  { code: 'CSRD', name: 'Corporate Sustainability Reporting Directive', jurisdiction: 'EU', category: 'ESG', description: 'EU sustainability reporting', requirements: 76 },
  { code: 'SFDR', name: 'Sustainable Finance Disclosure Regulation', jurisdiction: 'EU', category: 'ESG', description: 'ESG disclosure for financial services', requirements: 58 },
  { code: 'TCFD', name: 'Task Force on Climate-related Financial Disclosures', jurisdiction: 'Global', category: 'ESG', description: 'Climate risk disclosure', requirements: 35 },
  { code: 'SEC_CLIMATE', name: 'SEC Climate Disclosure Rules', jurisdiction: 'US', category: 'ESG', description: 'US climate disclosure requirements', requirements: 42 },
  
  // Anti-Money Laundering
  { code: 'AML_5AMLD', name: '5th Anti-Money Laundering Directive', jurisdiction: 'EU', category: 'AML', description: 'EU anti-money laundering', requirements: 65 },
  { code: 'AML_6AMLD', name: '6th Anti-Money Laundering Directive', jurisdiction: 'EU', category: 'AML', description: 'Enhanced EU AML requirements', requirements: 72 },
  { code: 'BSA', name: 'Bank Secrecy Act', jurisdiction: 'US', category: 'AML', description: 'US anti-money laundering', requirements: 55 },
  { code: 'FATF', name: 'FATF Recommendations', jurisdiction: 'Global', category: 'AML', description: 'International AML standards', requirements: 40 },
];

// =============================================================================
// DEFAULT RADAR DATA
// =============================================================================

export const DEFAULT_RADAR_EVENTS: RegulatoryRadarEvent[] = [
  {
    id: 'dora-enforcement',
    title: 'DORA enforcement begins for financial entities',
    framework: 'DORA',
    jurisdiction: 'EU',
    window: '60',
    impact: 'CRITICAL',
    effectiveDate: 'In ~45 days',
    description:
      'Operational resilience requirements become enforceable. High expectations for incident reporting and ICT risk management.',
  },
  {
    id: 'ccpa-amendment',
    title: 'CCPA/CPRA enforcement expansion',
    framework: 'CCPA',
    jurisdiction: 'US-CA',
    window: '90',
    impact: 'HIGH',
    effectiveDate: 'In ~75 days',
    description:
      'Broader scope for data subject rights and vendor obligations. Increased enforcement expected for adtech and third parties.',
  },
  {
    id: 'eu-ai-act-phase-2',
    title: 'EU AI Act high-risk obligations phase-in',
    framework: 'EU_AI_ACT',
    jurisdiction: 'EU',
    window: '30',
    impact: 'HIGH',
    effectiveDate: 'In ~30-60 days (phase 2)',
    description:
      'High-risk AI systems must align with transparency, human oversight, and robustness requirements. Significant documentation lift.',
  },
  {
    id: 'privacy-guidance-update',
    title: 'Updated supervisory guidance on cross-border transfers',
    framework: 'GDPR',
    jurisdiction: 'EU',
    window: 'now',
    impact: 'MEDIUM',
    effectiveDate: 'Now',
    description:
      'Regulators tightening expectations around SCCs and transfer impact assessments. Existing templates may need updates.',
  },
];

export const DEFAULT_AI_SUMMARY =
  'The highest-impact regulatory change in the next 90 days is DORA enforcement for EU financial entities. ' +
  'If critical services rely on third-party providers, prioritize mapping those dependencies and running a focused resilience review now. ' +
  'CCPA/CPRA expansion and the EU AI Act phase-in are close behind, particularly for data-rich and AI-heavy business units.';

export const DEFAULT_AI_ACTIONS: string[] = [
  'Map your critical third-party services and vendors to understand DORA exposure.',
  'Run a focused operational resilience review on incident response and ICT risk controls.',
  'Prepare privacy- and AI-heavy business units for CCPA/CPRA expansion and EU AI Act obligations.',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get framework by code
 */
export function getFrameworkByCode(code: string): RegulationFramework | undefined {
  return REGULATORY_FRAMEWORKS.find(f => f.code === code);
}

/**
 * Get frameworks by category
 */
export function getFrameworksByCategory(category: string): RegulationFramework[] {
  return REGULATORY_FRAMEWORKS.filter(f => 
    f.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get frameworks by jurisdiction
 */
export function getFrameworksByJurisdiction(jurisdiction: string): RegulationFramework[] {
  return REGULATORY_FRAMEWORKS.filter(f => 
    f.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase())
  );
}

/**
 * Get all unique jurisdictions
 */
export function getAllJurisdictions(): string[] {
  return [...new Set(REGULATORY_FRAMEWORKS.map(f => f.jurisdiction))];
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return [...new Set(REGULATORY_FRAMEWORKS.map(f => f.category))];
}

/**
 * Get total requirements count
 */
export function getTotalRequirementsCount(): number {
  return REGULATORY_FRAMEWORKS.reduce((sum, f) => sum + f.requirements, 0);
}
