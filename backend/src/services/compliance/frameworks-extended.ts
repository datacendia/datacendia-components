// Extended compliance frameworks

export const ALL_FRAMEWORKS: ComplianceFramework[] = [
  ...ETHICAL_AI_FRAMEWORKS,
  ...CYBERSECURITY_FRAMEWORKS,
  ...PRIVACY_FRAMEWORKS,
  ...GOVERNANCE_FRAMEWORKS,
  ...INDUSTRY_FRAMEWORKS,
];

// ============================================================================
// PILLAR-TO-FRAMEWORK MAPPING
// ============================================================================
export const PILLAR_FRAMEWORK_MAPPING: Record<PillarId, Record<ComplianceDomain, string[]>> = {
  helm: {
    ethical_ai: ['NIST-AI-RMF', 'OECD-AI', 'ISO-42001'],
    cybersecurity: ['SOC2', 'ZERO-TRUST'],
    privacy: ['GDPR', 'ISO-27701'],
    governance: ['COSO-ERM', 'COBIT', 'SOX'],
    industry: ['BASEL-III', 'IFRS-9'],
  },
  lineage: {
    ethical_ai: ['UNESCO-AI', 'OECD-AI'],
    cybersecurity: ['NIST-800-53', 'MITRE-ATT&CK', 'ISO-27001'],
    privacy: ['GDPR', 'CCPA/CPRA', 'HIPAA', 'PCI-DSS'],
    governance: ['SOX', 'ISO-27001'],
    industry: ['HIPAA', 'PCI-DSS', 'FedRAMP'],
  },
  predict: {
    ethical_ai: ['OECD-AI', 'ISO-42001', 'EU-AI-ACT'],
    cybersecurity: ['NIST-AI-RMF'],
    privacy: ['GDPR', 'HIPAA'],
    governance: ['COSO-ERM', 'SR-11-7'],
    industry: ['BASEL-III', 'IFRS-9', 'SR-11-7'],
  },
  flow: {
    ethical_ai: ['ISO-42001'],
    cybersecurity: ['ZERO-TRUST', 'SOC2', 'NIST-800-53'],
    privacy: ['ISO-27701', 'GDPR'],
    governance: ['ITIL', 'COBIT'],
    industry: ['GxP', 'FedRAMP', 'NERC-CIP'],
  },
  health: {
    ethical_ai: ['ISO-42001'],
    cybersecurity: ['NIST-800-137', 'MITRE-ATT&CK', 'CIS'],
    privacy: ['HIPAA', 'GDPR'],
    governance: ['ISO-20000', 'ISO-9001', 'ITIL'],
    industry: ['NERC-CIP'],
  },
  guard: {
    ethical_ai: ['EU-AI-ACT'],
    cybersecurity: ['NIST-800-53', 'MITRE-ATT&CK', 'ZERO-TRUST', 'ISO-27001', 'SOC2', 'CMMC', 'CIS'],
    privacy: ['GDPR', 'ISO-27701', 'HIPAA', 'PCI-DSS'],
    governance: ['SOC2', 'COBIT'],
    industry: ['CJIS', 'CMMC', 'FedRAMP'],
  },
  ethics: {
    ethical_ai: ['NIST-AI-RMF', 'OECD-AI', 'UNESCO-AI', 'ISO-42001', 'EU-AI-ACT'],
    cybersecurity: ['NIST-800-53'],
    privacy: ['GDPR'],
    governance: ['COSO-ERM'],
    industry: ['GxP', 'CJIS'],
  },
  agents: {
    ethical_ai: ['OECD-AI', 'UNESCO-AI', 'ISO-42001', 'EU-AI-ACT', 'NIST-AI-RMF'],
    cybersecurity: ['NIST-AI-RMF', 'ZERO-TRUST'],
    privacy: ['GDPR'],
    governance: ['ISO-42001'],
    industry: ['SR-11-7'],
  },
};
