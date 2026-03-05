/**
 * Service — Frameworks
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports getFrameworkByCode, getFrameworksByCategory, getFrameworksByJurisdiction, getAllJurisdictions, getAllCategories, getTotalRequirementsCount, REGULATORY_FRAMEWORKS, DEFAULT_RADAR_EVENTS
 * @module services/panopticon/frameworks
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

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

  // Peru — Mandatory for Peruvian regulated institutions
  { code: 'DS_115_2025_PCM', name: 'DS N° 115-2025-PCM', jurisdiction: 'PE', category: 'AI', description: 'Supreme Decree nationalizing ISO/IEC 42001:2023 as enforceable AI governance standard in Peru. Applies to public procurement and SBS-regulated institutions.', requirements: 93 },
  { code: 'LEY_31814', name: 'Ley 31814 — Ley de Inteligencia Artificial', jurisdiction: 'PE', category: 'AI', description: 'Peru organic AI law (July 2023). Risk-based framework: prohibited, high-risk (credit scoring, biometric ID, employment), and acceptable uses.', requirements: 45 },
  { code: 'LEY_26702', name: 'Ley 26702 — Ley General del Sistema Financiero', jurisdiction: 'PE', category: 'Financial', description: 'Primary law governing Peru financial system. All SBS-regulated institutions operate under this framework.', requirements: 120 },
  { code: 'SBS_GOB_CORP', name: 'SBS Reglamento de Gobierno Corporativo y Gestión Integral de Riesgos', jurisdiction: 'PE', category: 'Financial', description: 'SBS regulation (2017) on corporate governance and comprehensive risk management. AI governance sits within operational risk framework.', requirements: 85 },
  { code: 'LEY_29733', name: 'Ley 29733 — Ley de Protección de Datos Personales', jurisdiction: 'PE', category: 'Privacy', description: 'Peru personal data protection law. Requires data protection impact assessments for AI systems processing sensitive personal data.', requirements: 52 },

  // Defense / Government — Additional
  { code: 'NIST_800_171', name: 'NIST SP 800-171', jurisdiction: 'US', category: 'Cybersecurity', description: 'Protecting Controlled Unclassified Information in nonfederal systems', requirements: 110 },

  // Healthcare — Additional
  { code: 'HITRUST', name: 'HITRUST CSF', jurisdiction: 'US', category: 'Healthcare', description: 'Healthcare Information Trust Alliance Common Security Framework', requirements: 156 },
  { code: 'FDA_SaMD', name: 'FDA Software as a Medical Device', jurisdiction: 'US', category: 'Healthcare', description: 'FDA guidance for Software as a Medical Device classification and oversight', requirements: 38 },

  // Insurance
  { code: 'SOLVENCY_II', name: 'Solvency II', jurisdiction: 'EU', category: 'Insurance', description: 'EU insurance capital adequacy and risk management framework', requirements: 95 },
  { code: 'NAIC', name: 'NAIC Model Laws', jurisdiction: 'US', category: 'Insurance', description: 'US National Association of Insurance Commissioners model regulation', requirements: 48 },

  // Energy — Additional
  { code: 'IEC_62443', name: 'IEC 62443', jurisdiction: 'Global', category: 'Energy', description: 'Industrial automation and control systems cybersecurity', requirements: 78 },

  // Sports / Football
  { code: 'UEFA_FFP', name: 'UEFA Financial Fair Play / PSR', jurisdiction: 'EU', category: 'Sports', description: 'UEFA Profit and Sustainability Rules for football clubs', requirements: 35 },
  { code: 'FIFA_AGENT_REGS', name: 'FIFA Agent Regulations', jurisdiction: 'Global', category: 'Sports', description: 'FIFA Football Agent Regulations governing agent licensing and conduct', requirements: 28 },
  { code: 'PL_PSR', name: 'Premier League PSR', jurisdiction: 'UK', category: 'Sports', description: 'Premier League Profit and Sustainability Rules', requirements: 32 },
  { code: 'FGA_2025', name: 'Football Governance Act 2025 / IFR', jurisdiction: 'UK', category: 'Sports', description: 'UK Football Governance Act establishing Independent Football Regulator', requirements: 45 },

  // Legal
  { code: 'ABA_MRPC', name: 'ABA Model Rules of Professional Conduct', jurisdiction: 'US', category: 'Legal', description: 'Attorney ethics rules including privilege preservation and competence with AI tools', requirements: 52 },
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
