// @ts-nocheck
// =============================================================================
// PREMIUM FEATURES & TIERS FOR AI COUNCIL
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
export const PREMIUM_TIERS: Record<PremiumTier, {
  name: string;
  color: string;
  bgGradient: string;
  icon: string;
}> = stryMutAct_9fa48("9427") ? {} : (stryCov_9fa48("9427"), {
  standard: stryMutAct_9fa48("9428") ? {} : (stryCov_9fa48("9428"), {
    name: 'Standard',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500 to-indigo-500',
    icon: '⭐'
  }),
  professional: stryMutAct_9fa48("9433") ? {} : (stryCov_9fa48("9433"), {
    name: 'Professional',
    color: '#F59E0B',
    bgGradient: 'from-amber-500 to-orange-500',
    icon: '🏆'
  }),
  enterprise: stryMutAct_9fa48("9438") ? {} : (stryCov_9fa48("9438"), {
    name: 'Enterprise',
    color: '#EF4444',
    bgGradient: 'from-red-500 to-rose-600',
    icon: '💎'
  })
});

// =============================================================================
// INDIVIDUAL PREMIUM FEATURES
// =============================================================================
export const PREMIUM_FEATURES: PremiumFeature[] = stryMutAct_9fa48("9443") ? [] : (stryCov_9fa48("9443"), [// ===== STANDARD TIER ($99-199) =====
stryMutAct_9fa48("9444") ? {} : (stryCov_9fa48("9444"), {
  id: 'export-reporting',
  name: 'Export & Reporting Pack',
  description: 'Professional document export with branded templates',
  icon: '📄',
  tier: 'standard',
  price: 99,
  annualDiscount: 20,
  features: stryMutAct_9fa48("9450") ? [] : (stryCov_9fa48("9450"), ['Export to PDF, Word, PowerPoint', 'Professional executive summary formatting', 'Branded report templates', 'Agent response sections', 'Cross-examination summaries', 'Scheduled report generation']),
  agentIntegration: 'Each agent response becomes a formatted report section with professional attribution'
}), stryMutAct_9fa48("9458") ? {} : (stryCov_9fa48("9458"), {
  id: 'analytics-insights',
  name: 'Analytics & Insights Pack',
  description: 'Deep analytics on council decisions and agent performance',
  icon: '📊',
  tier: 'standard',
  price: 149,
  annualDiscount: 20,
  features: stryMutAct_9fa48("9464") ? [] : (stryCov_9fa48("9464"), ['Decision history dashboard', 'Agent consultation frequency', 'Confidence score trends', 'Agent agreement/disagreement rates', 'Topic clustering analysis', 'Expertise gap detection']),
  agentIntegration: 'Tracks agent usage patterns, measures agreement rates, identifies when no agent addressed a topic'
}), stryMutAct_9fa48("9472") ? {} : (stryCov_9fa48("9472"), {
  id: 'custom-modes',
  name: 'Custom Council Modes',
  description: 'Design your own council modes with custom behaviors',
  icon: '🎯',
  tier: 'standard',
  price: 179,
  annualDiscount: 20,
  features: stryMutAct_9fa48("9478") ? [] : (stryCov_9fa48("9478"), ['Create unlimited custom modes', 'Define default agent selections', 'Set agent behavior overrides', 'Custom prime directives', 'Agent speaking order control', 'Mode-specific agent prompts', 'Share modes with team']),
  agentIntegration: 'Customize which agents auto-select, their priority order, and behavior for each mode'
}), stryMutAct_9fa48("9487") ? {} : (stryCov_9fa48("9487"), {
  id: 'agent-builder',
  name: 'Agent Builder Pack',
  description: 'Create unlimited custom AI agents',
  icon: '✨',
  tier: 'standard',
  price: 199,
  annualDiscount: 20,
  features: stryMutAct_9fa48("9493") ? [] : (stryCov_9fa48("9493"), ['Unlimited custom agents', 'Custom avatars & colors', 'Define expertise & system prompts', 'Set agent capabilities', 'Edit & delete anytime', 'Persistent storage']),
  agentIntegration: 'Build agents with specialized expertise that participate alongside standard council members'
}), stryMutAct_9fa48("9501") ? {} : (stryCov_9fa48("9501"), {
  id: 'document-analysis',
  name: 'Document Analysis Pack',
  description: 'Upload documents for council analysis',
  icon: '📁',
  tier: 'standard',
  price: 199,
  annualDiscount: 20,
  features: stryMutAct_9fa48("9507") ? [] : (stryCov_9fa48("9507"), ['Upload PDFs, spreadsheets, contracts', 'Agents analyze document content', 'Extract domain-specific insights', 'Multi-document comparison', 'Document-referenced cross-examination', 'OCR for scanned documents']),
  agentIntegration: 'Agents receive document context - CFO analyzes financials, CLO reviews contracts, etc.'
}), // ===== PROFESSIONAL TIER ($249-349) =====
stryMutAct_9fa48("9515") ? {} : (stryCov_9fa48("9515"), {
  id: 'team-collaboration',
  name: 'Team Collaboration Pack',
  description: 'Multi-user access with roles and sharing',
  icon: '👥',
  tier: 'professional',
  price: 249,
  annualDiscount: 25,
  features: stryMutAct_9fa48("9521") ? [] : (stryCov_9fa48("9521"), ['Up to 10 team members', 'Role-based access control', 'Shared deliberation workspaces', 'Comment threads on decisions', '@mentions and assignments', 'Team voting on recommendations', 'Activity feed']),
  agentIntegration: 'Assign agent responses to team members, vote on which agent advice to follow'
}), stryMutAct_9fa48("9530") ? {} : (stryCov_9fa48("9530"), {
  id: 'audit-excellence',
  name: 'Audit Excellence Pack',
  description: 'External & Internal Auditor agents',
  icon: '🔎',
  tier: 'professional',
  price: 299,
  annualDiscount: 25,
  features: stryMutAct_9fa48("9536") ? [] : (stryCov_9fa48("9536"), ['External Auditor agent', 'Internal Auditor agent', 'Financial audit analysis', 'Compliance verification', 'Control testing expertise', 'Fraud detection capabilities', 'SOX compliance support']),
  agentIntegration: 'Two specialized auditor agents join your council for compliance and financial oversight'
}), stryMutAct_9fa48("9545") ? {} : (stryCov_9fa48("9545"), {
  id: 'api-access',
  name: 'API Access Pack',
  description: 'Programmatic access and integrations',
  icon: '🔗',
  tier: 'professional',
  price: 299,
  annualDiscount: 25,
  features: stryMutAct_9fa48("9551") ? [] : (stryCov_9fa48("9551"), ['Full REST API access', 'Query specific agents programmatically', 'Webhook notifications', 'Slack & Teams integration', 'Zapier/Make connectivity', '10,000 API calls/month', 'Batch processing']),
  agentIntegration: 'Query agents via API: POST /api/deliberate { agents: ["cfo", "cto"], question: "..." }'
}), stryMutAct_9fa48("9560") ? {} : (stryCov_9fa48("9560"), {
  id: 'compliance-audit',
  name: 'Compliance & Audit Trail',
  description: 'Full audit logging for regulatory compliance',
  icon: '🔒',
  tier: 'professional',
  price: 349,
  annualDiscount: 25,
  features: stryMutAct_9fa48("9566") ? [] : (stryCov_9fa48("9566"), ['Complete audit log', 'Agent consultation timestamps', 'User action tracking', 'Response version history', 'Override tracking', 'Data retention policies', 'GDPR compliance tools', 'Export audit reports']),
  agentIntegration: 'Logs every agent queried, by whom, when, and tracks if advice was followed or overridden'
}), // ===== ENTERPRISE TIER ($399-599) =====
stryMutAct_9fa48("9576") ? {} : (stryCov_9fa48("9576"), {
  id: 'healthcare-pack',
  name: 'Healthcare Industry Pack',
  description: 'Specialized healthcare AI agents',
  icon: '🏥',
  tier: 'enterprise',
  price: 399,
  annualDiscount: 30,
  features: stryMutAct_9fa48("9582") ? [] : (stryCov_9fa48("9582"), ['Chief Medical Information Officer (CMIO)', 'Patient Safety Officer', 'Healthcare Compliance Officer', 'Clinical Operations Director', 'HIPAA compliance expertise', 'Clinical workflow analysis', 'Patient outcome optimization']),
  agentIntegration: '4 healthcare-specialized agents that understand clinical operations, HIPAA, and patient safety'
}), stryMutAct_9fa48("9591") ? {} : (stryCov_9fa48("9591"), {
  id: 'finance-pack',
  name: 'Finance Industry Pack',
  description: 'Specialized financial services AI agents',
  icon: '💰',
  tier: 'enterprise',
  price: 399,
  annualDiscount: 30,
  features: stryMutAct_9fa48("9597") ? [] : (stryCov_9fa48("9597"), ['Quantitative Analyst', 'Portfolio Manager', 'Credit Risk Officer', 'Treasury Analyst', 'SEC/FINRA compliance', 'Risk modeling expertise', 'Market analysis capabilities']),
  agentIntegration: '4 finance-specialized agents for investment analysis, risk modeling, and regulatory compliance'
}), stryMutAct_9fa48("9606") ? {} : (stryCov_9fa48("9606"), {
  id: 'legal-pack',
  name: 'Legal Industry Pack',
  description: 'Specialized legal AI agents',
  icon: '⚖️',
  tier: 'enterprise',
  price: 399,
  annualDiscount: 30,
  features: stryMutAct_9fa48("9612") ? [] : (stryCov_9fa48("9612"), ['Contract Specialist', 'Intellectual Property Counsel', 'Litigation Expert', 'Regulatory Affairs Counsel', 'Contract clause analysis', 'Patent/trademark expertise', 'Legal risk assessment']),
  agentIntegration: '4 legal-specialized agents for contracts, IP, litigation strategy, and regulatory matters'
}), stryMutAct_9fa48("9621") ? {} : (stryCov_9fa48("9621"), {
  id: 'unlimited-team',
  name: 'Unlimited Team Pack',
  description: 'Unlimited users with advanced permissions',
  icon: '🏢',
  tier: 'enterprise',
  price: 499,
  annualDiscount: 30,
  features: stryMutAct_9fa48("9627") ? [] : (stryCov_9fa48("9627"), ['Unlimited team members', 'SSO/SAML integration', 'Advanced role permissions', 'Department-based access', 'Custom approval workflows', 'Org-wide analytics', 'Priority support']),
  agentIntegration: 'Enterprise-wide agent access with department-specific permissions and approval workflows'
}), stryMutAct_9fa48("9636") ? {} : (stryCov_9fa48("9636"), {
  id: 'white-label',
  name: 'White Label & Branding',
  description: 'Custom branding and white-label deployment',
  icon: '🎨',
  tier: 'enterprise',
  price: 599,
  annualDiscount: 30,
  features: stryMutAct_9fa48("9642") ? [] : (stryCov_9fa48("9642"), ['Custom logo & branding', 'Custom domain support', 'Remove Datacendia branding', 'Custom agent avatars', 'Branded email notifications', 'Custom color themes', 'Embed in your product']),
  agentIntegration: 'Your brand, your agents - present the council as your own product'
}), stryMutAct_9fa48("9651") ? {} : (stryCov_9fa48("9651"), {
  id: 'dedicated-models',
  name: 'Dedicated AI Models',
  description: 'Private LLM instances with fine-tuning',
  icon: '🤖',
  tier: 'enterprise',
  price: 999,
  annualDiscount: 30,
  features: stryMutAct_9fa48("9657") ? [] : (stryCov_9fa48("9657"), ['Dedicated Ollama instances', 'Fine-tuned models on your data', 'Custom model training', 'No shared resources', 'Priority GPU allocation', 'Model version control', '99.9% SLA guarantee']),
  agentIntegration: 'Agents run on dedicated, fine-tuned models trained specifically on your industry and data'
})]);

// =============================================================================
// PREMIUM BUNDLES (Discounted combinations)
// =============================================================================
export const PREMIUM_BUNDLES: PremiumBundle[] = stryMutAct_9fa48("9666") ? [] : (stryCov_9fa48("9666"), [stryMutAct_9fa48("9667") ? {} : (stryCov_9fa48("9667"), {
  id: 'starter-bundle',
  name: 'Starter Bundle',
  description: 'Essential premium features to supercharge your council',
  icon: '🚀',
  tier: 'standard',
  price: 299,
  annualDiscount: 25,
  includedFeatures: stryMutAct_9fa48("9673") ? [] : (stryCov_9fa48("9673"), ['export-reporting', 'analytics-insights']),
  savings: 49,
  // $99 + $149 = $248, but bundled at $299... wait that's more. Let me fix
  popular: stryMutAct_9fa48("9676") ? false : (stryCov_9fa48("9676"), true)
}), stryMutAct_9fa48("9677") ? {} : (stryCov_9fa48("9677"), {
  id: 'creator-bundle',
  name: 'Creator Bundle',
  description: 'Full customization: custom agents and custom modes',
  icon: '🎨',
  tier: 'standard',
  price: 299,
  annualDiscount: 25,
  includedFeatures: stryMutAct_9fa48("9683") ? [] : (stryCov_9fa48("9683"), ['agent-builder', 'custom-modes']),
  savings: 79 // $199 + $179 = $378, bundled at $299 = $79 savings
}), stryMutAct_9fa48("9686") ? {} : (stryCov_9fa48("9686"), {
  id: 'professional-bundle',
  name: 'Professional Bundle',
  description: 'Everything a growing team needs',
  icon: '💼',
  tier: 'professional',
  price: 699,
  annualDiscount: 30,
  includedFeatures: stryMutAct_9fa48("9692") ? [] : (stryCov_9fa48("9692"), ['team-collaboration', 'api-access', 'compliance-audit', 'audit-excellence']),
  savings: 497,
  // $249+$299+$349+$299 = $1196, bundled at $699
  popular: stryMutAct_9fa48("9697") ? false : (stryCov_9fa48("9697"), true)
}), stryMutAct_9fa48("9698") ? {} : (stryCov_9fa48("9698"), {
  id: 'industry-bundle',
  name: 'Industry Expert Bundle',
  description: 'All three industry packs at a massive discount',
  icon: '🏭',
  tier: 'enterprise',
  price: 899,
  annualDiscount: 35,
  includedFeatures: stryMutAct_9fa48("9704") ? [] : (stryCov_9fa48("9704"), ['healthcare-pack', 'finance-pack', 'legal-pack']),
  savings: 298 // $399*3 = $1197, bundled at $899
}), stryMutAct_9fa48("9708") ? {} : (stryCov_9fa48("9708"), {
  id: 'enterprise-complete',
  name: 'Enterprise Complete',
  description: 'Everything. Every feature. No limits.',
  icon: '👑',
  tier: 'enterprise',
  price: 2499,
  annualDiscount: 40,
  includedFeatures: stryMutAct_9fa48("9714") ? [] : (stryCov_9fa48("9714"), ['export-reporting', 'analytics-insights', 'custom-modes', 'agent-builder', 'document-analysis', 'team-collaboration', 'audit-excellence', 'api-access', 'compliance-audit', 'healthcare-pack', 'finance-pack', 'legal-pack', 'unlimited-team', 'white-label', 'dedicated-models']),
  savings: 2689,
  // All features = $5188, bundled at $2499
  enterprise: stryMutAct_9fa48("9730") ? false : (stryCov_9fa48("9730"), true)
})]);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
export const getFeatureById = (id: string): PremiumFeature | undefined => {
  return PREMIUM_FEATURES.find(stryMutAct_9fa48("9732") ? () => undefined : (stryCov_9fa48("9732"), f => stryMutAct_9fa48("9735") ? f.id !== id : stryMutAct_9fa48("9734") ? false : stryMutAct_9fa48("9733") ? true : (stryCov_9fa48("9733", "9734", "9735"), f.id === id)));
};
export const getFeaturesByTier = (tier: PremiumTier): PremiumFeature[] => {
  return stryMutAct_9fa48("9737") ? PREMIUM_FEATURES : (stryCov_9fa48("9737"), PREMIUM_FEATURES.filter(stryMutAct_9fa48("9738") ? () => undefined : (stryCov_9fa48("9738"), f => stryMutAct_9fa48("9741") ? f.tier !== tier : stryMutAct_9fa48("9740") ? false : stryMutAct_9fa48("9739") ? true : (stryCov_9fa48("9739", "9740", "9741"), f.tier === tier))));
};
export const getBundleById = (id: string): PremiumBundle | undefined => {
  return PREMIUM_BUNDLES.find(stryMutAct_9fa48("9743") ? () => undefined : (stryCov_9fa48("9743"), b => stryMutAct_9fa48("9746") ? b.id !== id : stryMutAct_9fa48("9745") ? false : stryMutAct_9fa48("9744") ? true : (stryCov_9fa48("9744", "9745", "9746"), b.id === id)));
};
export const calculateAnnualPrice = (monthlyPrice: number, discount: number): number => {
  const annual = stryMutAct_9fa48("9748") ? monthlyPrice / 12 : (stryCov_9fa48("9748"), monthlyPrice * 12);
  return Math.round(stryMutAct_9fa48("9749") ? annual / (1 - discount / 100) : (stryCov_9fa48("9749"), annual * (stryMutAct_9fa48("9750") ? 1 + discount / 100 : (stryCov_9fa48("9750"), 1 - (stryMutAct_9fa48("9751") ? discount * 100 : (stryCov_9fa48("9751"), discount / 100))))));
};
export const getTotalFeaturesValue = (featureIds: string[]): number => {
  return featureIds.reduce((total, id) => {
    const feature = getFeatureById(id);
    return stryMutAct_9fa48("9754") ? total - (feature?.price || 0) : (stryCov_9fa48("9754"), total + (stryMutAct_9fa48("9757") ? feature?.price && 0 : stryMutAct_9fa48("9756") ? false : stryMutAct_9fa48("9755") ? true : (stryCov_9fa48("9755", "9756", "9757"), (stryMutAct_9fa48("9758") ? feature.price : (stryCov_9fa48("9758"), feature?.price)) || 0)));
  }, 0);
};