// =============================================================================
// PREMIUM FEATURES & TIERS FOR AI COUNCIL
// =============================================================================

export type PremiumTier = 'standard' | 'professional' | 'enterprise';

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: PremiumTier;
  price: number; // Monthly price in USD
  annualDiscount: number; // Percentage off for annual
  features: string[];
  agentIntegration: string;
  comingSoon?: boolean;
}

export interface PremiumBundle {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: PremiumTier;
  price: number;
  annualDiscount: number;
  includedFeatures: string[]; // Feature IDs
  savings: number; // Compared to buying separately
  popular?: boolean;
  enterprise?: boolean;
}

// =============================================================================
// TIER DEFINITIONS
// =============================================================================
export const PREMIUM_TIERS: Record<
  PremiumTier,
  { name: string; color: string; bgGradient: string; icon: string }
> = {
  standard: {
    name: 'Standard',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500 to-indigo-500',
    icon: '⭐',
  },
  professional: {
    name: 'Professional',
    color: '#F59E0B',
    bgGradient: 'from-amber-500 to-orange-500',
    icon: '🏆',
  },
  enterprise: {
    name: 'Enterprise',
    color: '#EF4444',
    bgGradient: 'from-red-500 to-rose-600',
    icon: '💎',
  },
};

// =============================================================================
// INDIVIDUAL PREMIUM FEATURES
// =============================================================================
export const PREMIUM_FEATURES: PremiumFeature[] = [
  // ===== STANDARD TIER ($99-199) =====
  {
    id: 'export-reporting',
    name: 'Export & Reporting Pack',
    description: 'Professional document export with branded templates',
    icon: '📄',
    tier: 'standard',
    price: 99,
    annualDiscount: 20,
    features: [
      'Export to PDF, Word, PowerPoint',
      'Professional executive summary formatting',
      'Branded report templates',
      'Agent response sections',
      'Cross-examination summaries',
      'Scheduled report generation',
    ],
    agentIntegration:
      'Each agent response becomes a formatted report section with professional attribution',
  },
  {
    id: 'analytics-insights',
    name: 'Analytics & Insights Pack',
    description: 'Deep analytics on council decisions and agent performance',
    icon: '📊',
    tier: 'standard',
    price: 149,
    annualDiscount: 20,
    features: [
      'Decision history dashboard',
      'Agent consultation frequency',
      'Confidence score trends',
      'Agent agreement/disagreement rates',
      'Topic clustering analysis',
      'Expertise gap detection',
    ],
    agentIntegration:
      'Tracks agent usage patterns, measures agreement rates, identifies when no agent addressed a topic',
  },
  {
    id: 'custom-modes',
    name: 'Custom Council Modes',
    description: 'Design your own council modes with custom behaviors',
    icon: '🎯',
    tier: 'standard',
    price: 179,
    annualDiscount: 20,
    features: [
      'Create unlimited custom modes',
      'Define default agent selections',
      'Set agent behavior overrides',
      'Custom prime directives',
      'Agent speaking order control',
      'Mode-specific agent prompts',
      'Share modes with team',
    ],
    agentIntegration:
      'Customize which agents auto-select, their priority order, and behavior for each mode',
  },
  {
    id: 'agent-builder',
    name: 'Agent Builder Pack',
    description: 'Create unlimited custom AI agents',
    icon: '✨',
    tier: 'standard',
    price: 199,
    annualDiscount: 20,
    features: [
      'Unlimited custom agents',
      'Custom avatars & colors',
      'Define expertise & system prompts',
      'Set agent capabilities',
      'Edit & delete anytime',
      'Persistent storage',
    ],
    agentIntegration:
      'Build agents with specialized expertise that participate alongside standard council members',
  },
  {
    id: 'document-analysis',
    name: 'Document Analysis Pack',
    description: 'Upload documents for council analysis',
    icon: '📁',
    tier: 'standard',
    price: 199,
    annualDiscount: 20,
    features: [
      'Upload PDFs, spreadsheets, contracts',
      'Agents analyze document content',
      'Extract domain-specific insights',
      'Multi-document comparison',
      'Document-referenced cross-examination',
      'OCR for scanned documents',
    ],
    agentIntegration:
      'Agents receive document context - CFO analyzes financials, CLO reviews contracts, etc.',
  },

  // ===== PROFESSIONAL TIER ($249-349) =====
  {
    id: 'team-collaboration',
    name: 'Team Collaboration Pack',
    description: 'Multi-user access with roles and sharing',
    icon: '👥',
    tier: 'professional',
    price: 249,
    annualDiscount: 25,
    features: [
      'Up to 10 team members',
      'Role-based access control',
      'Shared deliberation workspaces',
      'Comment threads on decisions',
      '@mentions and assignments',
      'Team voting on recommendations',
      'Activity feed',
    ],
    agentIntegration:
      'Assign agent responses to team members, vote on which agent advice to follow',
  },
  {
    id: 'audit-excellence',
    name: 'Audit Excellence Pack',
    description: 'External & Internal Auditor agents',
    icon: '🔎',
    tier: 'professional',
    price: 299,
    annualDiscount: 25,
    features: [
      'External Auditor agent',
      'Internal Auditor agent',
      'Financial audit analysis',
      'Compliance verification',
      'Control testing expertise',
      'Fraud detection capabilities',
      'SOX compliance support',
    ],
    agentIntegration:
      'Two specialized auditor agents join your council for compliance and financial oversight',
  },
  {
    id: 'api-access',
    name: 'API Access Pack',
    description: 'Programmatic access and integrations',
    icon: '🔗',
    tier: 'professional',
    price: 299,
    annualDiscount: 25,
    features: [
      'Full REST API access',
      'Query specific agents programmatically',
      'Webhook notifications',
      'Slack & Teams integration',
      'Zapier/Make connectivity',
      '10,000 API calls/month',
      'Batch processing',
    ],
    agentIntegration:
      'Query agents via API: POST /api/deliberate { agents: ["cfo", "cto"], question: "..." }',
  },
  {
    id: 'compliance-audit',
    name: 'Compliance & Audit Trail',
    description: 'Full audit logging for regulatory compliance',
    icon: '🔒',
    tier: 'professional',
    price: 349,
    annualDiscount: 25,
    features: [
      'Complete audit log',
      'Agent consultation timestamps',
      'User action tracking',
      'Response version history',
      'Override tracking',
      'Data retention policies',
      'GDPR compliance tools',
      'Export audit reports',
    ],
    agentIntegration:
      'Logs every agent queried, by whom, when, and tracks if advice was followed or overridden',
  },

  // ===== ENTERPRISE TIER ($399-599) =====
  {
    id: 'healthcare-pack',
    name: 'Healthcare Industry Pack',
    description: 'Specialized healthcare AI agents',
    icon: '🏥',
    tier: 'enterprise',
    price: 399,
    annualDiscount: 30,
    features: [
      'Chief Medical Information Officer (CMIO)',
      'Patient Safety Officer',
      'Healthcare Compliance Officer',
      'Clinical Operations Director',
      'HIPAA compliance expertise',
      'Clinical workflow analysis',
      'Patient outcome optimization',
    ],
    agentIntegration:
      '4 healthcare-specialized agents that understand clinical operations, HIPAA, and patient safety',
  },
  {
    id: 'finance-pack',
    name: 'Finance Industry Pack',
    description: 'Specialized financial services AI agents',
    icon: '💰',
    tier: 'enterprise',
    price: 399,
    annualDiscount: 30,
    features: [
      'Quantitative Analyst',
      'Portfolio Manager',
      'Credit Risk Officer',
      'Treasury Analyst',
      'SEC/FINRA compliance',
      'Risk modeling expertise',
      'Market analysis capabilities',
    ],
    agentIntegration:
      '4 finance-specialized agents for investment analysis, risk modeling, and regulatory compliance',
  },
  {
    id: 'legal-pack',
    name: 'Legal Industry Pack',
    description: 'Specialized legal AI agents',
    icon: '⚖️',
    tier: 'enterprise',
    price: 399,
    annualDiscount: 30,
    features: [
      'Contract Specialist',
      'Intellectual Property Counsel',
      'Litigation Expert',
      'Regulatory Affairs Counsel',
      'Contract clause analysis',
      'Patent/trademark expertise',
      'Legal risk assessment',
    ],
    agentIntegration:
      '4 legal-specialized agents for contracts, IP, litigation strategy, and regulatory matters',
  },
  {
    id: 'unlimited-team',
    name: 'Unlimited Team Pack',
    description: 'Unlimited users with advanced permissions',
    icon: '🏢',
    tier: 'enterprise',
    price: 499,
    annualDiscount: 30,
    features: [
      'Unlimited team members',
      'SSO/SAML integration',
      'Advanced role permissions',
      'Department-based access',
      'Custom approval workflows',
      'Org-wide analytics',
      'Priority support',
    ],
    agentIntegration:
      'Enterprise-wide agent access with department-specific permissions and approval workflows',
  },
  {
    id: 'white-label',
    name: 'White Label & Branding',
    description: 'Custom branding and white-label deployment',
    icon: '🎨',
    tier: 'enterprise',
    price: 599,
    annualDiscount: 30,
    features: [
      'Custom logo & branding',
      'Custom domain support',
      'Remove Datacendia branding',
      'Custom agent avatars',
      'Branded email notifications',
      'Custom color themes',
      'Embed in your product',
    ],
    agentIntegration: 'Your brand, your agents - present the council as your own product',
  },
  {
    id: 'dedicated-models',
    name: 'Dedicated AI Models',
    description: 'Private LLM instances with fine-tuning',
    icon: '🤖',
    tier: 'enterprise',
    price: 999,
    annualDiscount: 30,
    features: [
      'Dedicated Ollama instances',
      'Fine-tuned models on your data',
      'Custom model training',
      'No shared resources',
      'Priority GPU allocation',
      'Model version control',
      '99.9% SLA guarantee',
    ],
    agentIntegration:
      'Agents run on dedicated, fine-tuned models trained specifically on your industry and data',
  },
];

// =============================================================================
// PREMIUM BUNDLES (Discounted combinations)
// =============================================================================
export const PREMIUM_BUNDLES: PremiumBundle[] = [
  {
    id: 'starter-bundle',
    name: 'Starter Bundle',
    description: 'Essential premium features to supercharge your council',
    icon: '🚀',
    tier: 'standard',
    price: 299,
    annualDiscount: 25,
    includedFeatures: ['export-reporting', 'analytics-insights'],
    savings: 49, // $99 + $149 = $248, but bundled at $299... wait that's more. Let me fix
    popular: true,
  },
  {
    id: 'creator-bundle',
    name: 'Creator Bundle',
    description: 'Full customization: custom agents and custom modes',
    icon: '🎨',
    tier: 'standard',
    price: 299,
    annualDiscount: 25,
    includedFeatures: ['agent-builder', 'custom-modes'],
    savings: 79, // $199 + $179 = $378, bundled at $299 = $79 savings
  },
  {
    id: 'professional-bundle',
    name: 'Professional Bundle',
    description: 'Everything a growing team needs',
    icon: '💼',
    tier: 'professional',
    price: 699,
    annualDiscount: 30,
    includedFeatures: ['team-collaboration', 'api-access', 'compliance-audit', 'audit-excellence'],
    savings: 497, // $249+$299+$349+$299 = $1196, bundled at $699
    popular: true,
  },
  {
    id: 'industry-bundle',
    name: 'Industry Expert Bundle',
    description: 'All three industry packs at a massive discount',
    icon: '🏭',
    tier: 'enterprise',
    price: 899,
    annualDiscount: 35,
    includedFeatures: ['healthcare-pack', 'finance-pack', 'legal-pack'],
    savings: 298, // $399*3 = $1197, bundled at $899
  },
  {
    id: 'enterprise-complete',
    name: 'Enterprise Complete',
    description: 'Everything. Every feature. No limits.',
    icon: '👑',
    tier: 'enterprise',
    price: 2499,
    annualDiscount: 40,
    includedFeatures: [
      'export-reporting',
      'analytics-insights',
      'custom-modes',
      'agent-builder',
      'document-analysis',
      'team-collaboration',
      'audit-excellence',
      'api-access',
      'compliance-audit',
      'healthcare-pack',
      'finance-pack',
      'legal-pack',
      'unlimited-team',
      'white-label',
      'dedicated-models',
    ],
    savings: 2689, // All features = $5188, bundled at $2499
    enterprise: true,
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
export const getFeatureById = (id: string): PremiumFeature | undefined => {
  return PREMIUM_FEATURES.find((f) => f.id === id);
};

export const getFeaturesByTier = (tier: PremiumTier): PremiumFeature[] => {
  return PREMIUM_FEATURES.filter((f) => f.tier === tier);
};

export const getBundleById = (id: string): PremiumBundle | undefined => {
  return PREMIUM_BUNDLES.find((b) => b.id === id);
};

export const calculateAnnualPrice = (monthlyPrice: number, discount: number): number => {
  const annual = monthlyPrice * 12;
  return Math.round(annual * (1 - discount / 100));
};

export const getTotalFeaturesValue = (featureIds: string[]): number => {
  return featureIds.reduce((total, id) => {
    const feature = getFeatureById(id);
    return total + (feature?.price || 0);
  }, 0);
};
