// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - SUBSCRIPTION TIERS & FEATURE GATING
// Enterprise-grade subscription management with feature access control
// =============================================================================

// =============================================================================
// SUBSCRIPTION TIER DEFINITIONS
// =============================================================================

export type SubscriptionTier = 
  | 'free'
  | 'starter'
  | 'professional'
  | 'enterprise'
  | 'enterprise_plus'
  | 'custom';

export interface TierConfig {
  id: SubscriptionTier;
  name: string;
  displayName: string;
  price: {
    monthly: number;
    annually: number;
  };
  features: FeatureAccess;
  limits: TierLimits;
  support: SupportLevel;
  sla: SLAConfig;
}

export interface FeatureAccess {
  // Core Platform Features
  dashboard: boolean;
  theGraph: boolean;
  theCouncil: boolean;
  thePulse: boolean;
  theLens: boolean;
  theBridge: boolean;
  theHelm: boolean;
  theLineage: boolean;
  thePredict: boolean;
  theFlow: boolean;
  theHealth: boolean;
  theGuard: boolean;
  theEthics: boolean;
  theAgents: boolean;

  // Holy Shit Features (Premium)
  preMortem: boolean;
  ghostBoard: boolean;
  decisionDebtDashboard: boolean;
  liveDemoMode: boolean;
  regulatoryInstantAbsorb: boolean;

  // Council Modes
  councilModes: {
    warRoom: boolean;
    dueDiligence: boolean;
    innovationLab: boolean;
    compliance: boolean;
    crisis: boolean;
    execution: boolean;
    research: boolean;
    investment: boolean;
    stakeholder: boolean;
    rapid: boolean;
    advisory: boolean;
    governance: boolean;
  };

  // Integration Features
  customConnectors: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  ssoIntegration: boolean;
  auditLogs: boolean;
  customBranding: boolean;
  whiteLabeling: boolean;
}

export interface TierLimits {
  users: number;
  councilDeliberationsPerMonth: number;
  preMortemAnalysesPerMonth: number;
  ghostBoardSessionsPerMonth: number;
  regulatoryDocumentsPerMonth: number;
  dataSources: number;
  storageGB: number;
  apiCallsPerMonth: number;
  retentionDays: number;
  // Pre-Mortem agent access by tier
  preMortemAgents: PreMortemAgentId[];
  // Council agent configuration
  maxCouncilAgents: number;
}

// Pre-Mortem Agent IDs that can be used in Council
export type PreMortemAgentId = 
  | 'cfo'       // CFO Agent - Financial
  | 'coo'       // COO Agent - Operations
  | 'cro'       // CRO Agent - Revenue
  | 'ciso'      // CISO Agent - Security
  | 'cto'       // CTO Agent - Technology
  | 'legal'     // Legal Agent - Compliance
  | 'hr'        // HR Agent - People
  | 'market'    // Market Agent - Competition
  | 'customer'  // Customer Agent - Voice of Customer
  | 'strategist'// Strategy Agent - Long-term
  | 'pessimist';// Devil's Advocate - Critical

export type SupportLevel = 'community' | 'email' | 'priority' | 'dedicated' | 'white_glove';

export interface SLAConfig {
  uptimeGuarantee: number; // e.g., 99.9
  responseTimeMinutes: number;
  resolutionTimeHours: number;
}

// =============================================================================
// TIER CONFIGURATIONS
// =============================================================================

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Free Trial',
    price: { monthly: 0, annually: 0 },
    features: {
      dashboard: true,
      theGraph: true,
      theCouncil: true, // Limited
      thePulse: false,
      theLens: false,
      theBridge: false,
      theHelm: false,
      theLineage: false,
      thePredict: false,
      theFlow: false,
      theHealth: false,
      theGuard: false,
      theEthics: false,
      theAgents: true, // Limited

      // Holy Shit Features - NOT included
      preMortem: false,
      ghostBoard: false,
      decisionDebtDashboard: false,
      liveDemoMode: false,
      regulatoryInstantAbsorb: false,

      councilModes: {
        warRoom: false,
        dueDiligence: false,
        innovationLab: false,
        compliance: false,
        crisis: false,
        execution: false,
        research: true, // Only research mode in free
        investment: false,
        stakeholder: false,
        rapid: true, // Rapid for quick demos
        advisory: false,
        governance: false,
      },

      customConnectors: false,
      apiAccess: false,
      webhooks: false,
      ssoIntegration: false,
      auditLogs: false,
      customBranding: false,
      whiteLabeling: false,
    },
    limits: {
      users: 1,
      councilDeliberationsPerMonth: 10,
      preMortemAnalysesPerMonth: 0,
      ghostBoardSessionsPerMonth: 0,
      regulatoryDocumentsPerMonth: 0,
      dataSources: 1,
      storageGB: 1,
      apiCallsPerMonth: 100,
      retentionDays: 7,
      preMortemAgents: [], // No Pre-Mortem agents in free tier
      maxCouncilAgents: 3,
    },
    support: 'community',
    sla: {
      uptimeGuarantee: 95,
      responseTimeMinutes: 0,
      resolutionTimeHours: 0,
    },
  },

  starter: {
    id: 'starter',
    name: 'starter',
    displayName: 'Starter',
    price: { monthly: 99, annually: 990 },
    features: {
      dashboard: true,
      theGraph: true,
      theCouncil: true,
      thePulse: true,
      theLens: true,
      theBridge: true,
      theHelm: false,
      theLineage: true,
      thePredict: false,
      theFlow: true,
      theHealth: true,
      theGuard: false,
      theEthics: false,
      theAgents: true,

      // Holy Shit Features - Pre-Mortem only
      preMortem: true,
      ghostBoard: false,
      decisionDebtDashboard: false,
      liveDemoMode: false,
      regulatoryInstantAbsorb: false,

      councilModes: {
        warRoom: false,
        dueDiligence: true,
        innovationLab: true,
        compliance: false,
        crisis: false,
        execution: true,
        research: true,
        investment: false,
        stakeholder: false,
        rapid: true,
        advisory: true,
        governance: false,
      },

      customConnectors: false,
      apiAccess: true,
      webhooks: true,
      ssoIntegration: false,
      auditLogs: false,
      customBranding: false,
      whiteLabeling: false,
    },
    limits: {
      users: 5,
      councilDeliberationsPerMonth: 100,
      preMortemAnalysesPerMonth: 10,
      ghostBoardSessionsPerMonth: 0,
      regulatoryDocumentsPerMonth: 0,
      dataSources: 5,
      storageGB: 10,
      apiCallsPerMonth: 10000,
      retentionDays: 30,
      preMortemAgents: ['cfo', 'ciso', 'pessimist'], // Basic 3 agents
      maxCouncilAgents: 5,
    },
    support: 'email',
    sla: {
      uptimeGuarantee: 99,
      responseTimeMinutes: 1440, // 24 hours
      resolutionTimeHours: 72,
    },
  },

  professional: {
    id: 'professional',
    name: 'professional',
    displayName: 'Professional',
    price: { monthly: 499, annually: 4990 },
    features: {
      dashboard: true,
      theGraph: true,
      theCouncil: true,
      thePulse: true,
      theLens: true,
      theBridge: true,
      theHelm: true,
      theLineage: true,
      thePredict: true,
      theFlow: true,
      theHealth: true,
      theGuard: true,
      theEthics: true,
      theAgents: true,

      // Holy Shit Features - Pre-Mortem, Ghost Board, Decision Debt
      preMortem: true,
      ghostBoard: true,
      decisionDebtDashboard: true,
      liveDemoMode: false,
      regulatoryInstantAbsorb: false,

      councilModes: {
        warRoom: true,
        dueDiligence: true,
        innovationLab: true,
        compliance: true,
        crisis: true,
        execution: true,
        research: true,
        investment: true,
        stakeholder: true,
        rapid: true,
        advisory: true,
        governance: true,
      },

      customConnectors: true,
      apiAccess: true,
      webhooks: true,
      ssoIntegration: true,
      auditLogs: true,
      customBranding: false,
      whiteLabeling: false,
    },
    limits: {
      users: 25,
      councilDeliberationsPerMonth: 500,
      preMortemAnalysesPerMonth: 50,
      ghostBoardSessionsPerMonth: 25,
      regulatoryDocumentsPerMonth: 0,
      dataSources: 20,
      storageGB: 100,
      apiCallsPerMonth: 100000,
      retentionDays: 90,
      preMortemAgents: ['cfo', 'coo', 'cro', 'ciso', 'cto', 'pessimist'], // 6 agents
      maxCouncilAgents: 8,
    },
    support: 'priority',
    sla: {
      uptimeGuarantee: 99.5,
      responseTimeMinutes: 240, // 4 hours
      resolutionTimeHours: 24,
    },
  },

  enterprise: {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Enterprise',
    price: { monthly: 1999, annually: 19990 },
    features: {
      dashboard: true,
      theGraph: true,
      theCouncil: true,
      thePulse: true,
      theLens: true,
      theBridge: true,
      theHelm: true,
      theLineage: true,
      thePredict: true,
      theFlow: true,
      theHealth: true,
      theGuard: true,
      theEthics: true,
      theAgents: true,

      // Holy Shit Features - ALL INCLUDED
      preMortem: true,
      ghostBoard: true,
      decisionDebtDashboard: true,
      liveDemoMode: true,
      regulatoryInstantAbsorb: true,

      councilModes: {
        warRoom: true,
        dueDiligence: true,
        innovationLab: true,
        compliance: true,
        crisis: true,
        execution: true,
        research: true,
        investment: true,
        stakeholder: true,
        rapid: true,
        advisory: true,
        governance: true,
      },

      customConnectors: true,
      apiAccess: true,
      webhooks: true,
      ssoIntegration: true,
      auditLogs: true,
      customBranding: true,
      whiteLabeling: false,
    },
    limits: {
      users: 100,
      councilDeliberationsPerMonth: 2000,
      preMortemAnalysesPerMonth: 200,
      ghostBoardSessionsPerMonth: 100,
      regulatoryDocumentsPerMonth: 50,
      dataSources: 100,
      storageGB: 1000,
      apiCallsPerMonth: 1000000,
      retentionDays: 365,
      preMortemAgents: ['cfo', 'coo', 'cro', 'ciso', 'cto', 'legal', 'hr', 'market', 'pessimist'], // 9 agents
      maxCouncilAgents: 10,
    },
    support: 'dedicated',
    sla: {
      uptimeGuarantee: 99.9,
      responseTimeMinutes: 60, // 1 hour
      resolutionTimeHours: 8,
    },
  },

  enterprise_plus: {
    id: 'enterprise_plus',
    name: 'enterprise_plus',
    displayName: 'Enterprise Plus',
    price: { monthly: 4999, annually: 49990 },
    features: {
      dashboard: true,
      theGraph: true,
      theCouncil: true,
      thePulse: true,
      theLens: true,
      theBridge: true,
      theHelm: true,
      theLineage: true,
      thePredict: true,
      theFlow: true,
      theHealth: true,
      theGuard: true,
      theEthics: true,
      theAgents: true,

      // Holy Shit Features - ALL INCLUDED
      preMortem: true,
      ghostBoard: true,
      decisionDebtDashboard: true,
      liveDemoMode: true,
      regulatoryInstantAbsorb: true,

      councilModes: {
        warRoom: true,
        dueDiligence: true,
        innovationLab: true,
        compliance: true,
        crisis: true,
        execution: true,
        research: true,
        investment: true,
        stakeholder: true,
        rapid: true,
        advisory: true,
        governance: true,
      },

      customConnectors: true,
      apiAccess: true,
      webhooks: true,
      ssoIntegration: true,
      auditLogs: true,
      customBranding: true,
      whiteLabeling: true,
    },
    limits: {
      users: -1, // Unlimited
      councilDeliberationsPerMonth: -1,
      preMortemAnalysesPerMonth: -1,
      ghostBoardSessionsPerMonth: -1,
      regulatoryDocumentsPerMonth: -1,
      dataSources: -1,
      storageGB: -1,
      apiCallsPerMonth: -1,
      retentionDays: -1, // Forever
      preMortemAgents: ['cfo', 'coo', 'cro', 'ciso', 'cto', 'legal', 'hr', 'market', 'customer', 'strategist', 'pessimist'], // ALL 11 agents
      maxCouncilAgents: -1, // Unlimited
    },
    support: 'white_glove',
    sla: {
      uptimeGuarantee: 99.99,
      responseTimeMinutes: 15,
      resolutionTimeHours: 4,
    },
  },

  custom: {
    id: 'custom',
    name: 'custom',
    displayName: 'Custom Enterprise',
    price: { monthly: 0, annually: 0 }, // Negotiated
    features: {
      dashboard: true,
      theGraph: true,
      theCouncil: true,
      thePulse: true,
      theLens: true,
      theBridge: true,
      theHelm: true,
      theLineage: true,
      thePredict: true,
      theFlow: true,
      theHealth: true,
      theGuard: true,
      theEthics: true,
      theAgents: true,

      preMortem: true,
      ghostBoard: true,
      decisionDebtDashboard: true,
      liveDemoMode: true,
      regulatoryInstantAbsorb: true,

      councilModes: {
        warRoom: true,
        dueDiligence: true,
        innovationLab: true,
        compliance: true,
        crisis: true,
        execution: true,
        research: true,
        investment: true,
        stakeholder: true,
        rapid: true,
        advisory: true,
        governance: true,
      },

      customConnectors: true,
      apiAccess: true,
      webhooks: true,
      ssoIntegration: true,
      auditLogs: true,
      customBranding: true,
      whiteLabeling: true,
    },
    limits: {
      users: -1,
      councilDeliberationsPerMonth: -1,
      preMortemAnalysesPerMonth: -1,
      ghostBoardSessionsPerMonth: -1,
      regulatoryDocumentsPerMonth: -1,
      dataSources: -1,
      storageGB: -1,
      apiCallsPerMonth: -1,
      retentionDays: -1,
      preMortemAgents: ['cfo', 'coo', 'cro', 'ciso', 'cto', 'legal', 'hr', 'market', 'customer', 'strategist', 'pessimist'], // Custom: ALL agents
      maxCouncilAgents: -1, // Unlimited
    },
    support: 'white_glove',
    sla: {
      uptimeGuarantee: 99.99,
      responseTimeMinutes: 15,
      resolutionTimeHours: 4,
    },
  },
};

// =============================================================================
// FEATURE DEFINITIONS FOR UI/UX
// =============================================================================

export interface FeatureDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'core' | 'premium' | 'council_mode' | 'integration';
  icon: string;
  minimumTier: SubscriptionTier;
  isHolyShitFeature: boolean;
}

export const FEATURE_DEFINITIONS: Record<string, FeatureDefinition> = {
  preMortem: {
    id: 'preMortem',
    name: 'Pre-Mortem',
    displayName: '💀 The Pre-Mortem',
    description: 'AI-powered failure analysis that shows every way a decision could fail before you make it.',
    category: 'premium',
    icon: '💀',
    minimumTier: 'starter',
    isHolyShitFeature: true,
  },
  ghostBoard: {
    id: 'ghostBoard',
    name: 'Ghost Board',
    displayName: '👻 The Ghost Board',
    description: 'Rehearse board meetings with AI directors that challenge harder than your real board.',
    category: 'premium',
    icon: '👻',
    minimumTier: 'professional',
    isHolyShitFeature: true,
  },
  decisionDebtDashboard: {
    id: 'decisionDebtDashboard',
    name: 'Decision Debt Dashboard',
    displayName: '📊 Decision Debt Dashboard',
    description: 'Real-time visibility into stuck decisions, blockers, and the cost of organizational delay.',
    category: 'premium',
    icon: '📊',
    minimumTier: 'professional',
    isHolyShitFeature: true,
  },
  liveDemoMode: {
    id: 'liveDemoMode',
    name: 'Live Demo Mode',
    displayName: '⚡ Live Demo Mode',
    description: 'Connect to real customer data during demos for instant, personalized deliberations.',
    category: 'premium',
    icon: '⚡',
    minimumTier: 'enterprise',
    isHolyShitFeature: true,
  },
  regulatoryInstantAbsorb: {
    id: 'regulatoryInstantAbsorb',
    name: 'Regulatory Instant-Absorb',
    displayName: '📜 Regulatory Instant-Absorb',
    description: 'Upload any regulation and the Council learns it in seconds.',
    category: 'premium',
    icon: '📜',
    minimumTier: 'enterprise',
    isHolyShitFeature: true,
  },
};

// =============================================================================
// FEATURE GATING SERVICE
// =============================================================================

export class FeatureGatingService {
  private static instance: FeatureGatingService;
  private customOverrides: Map<string, Partial<FeatureAccess>> = new Map();

  private constructor() {}

  static getInstance(): FeatureGatingService {
    if (!FeatureGatingService.instance) {
      FeatureGatingService.instance = new FeatureGatingService();
    }
    return FeatureGatingService.instance;
  }

  /**
   * Check if a feature is available for a given tier
   */
  hasFeature(tier: SubscriptionTier, featureKey: keyof FeatureAccess): boolean {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return false;
    return tierConfig.features[featureKey] === true;
  }

  /**
   * Check if a specific council mode is available
   */
  hasCouncilMode(
    tier: SubscriptionTier, 
    mode: keyof FeatureAccess['councilModes']
  ): boolean {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return false;
    return tierConfig.features.councilModes[mode] === true;
  }

  /**
   * Get numeric limit value for a tier
   */
  getLimit(tier: SubscriptionTier, limitKey: Exclude<keyof TierLimits, 'preMortemAgents'>): number {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return 0;
    const value = tierConfig.limits[limitKey];
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Get available Pre-Mortem agents for a tier
   */
  getAvailablePreMortemAgents(tier: SubscriptionTier): PreMortemAgentId[] {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return [];
    return tierConfig.limits.preMortemAgents;
  }

  /**
   * Check if a Pre-Mortem agent is available for a tier
   */
  hasPreMortemAgent(tier: SubscriptionTier, agentId: PreMortemAgentId): boolean {
    const agents = this.getAvailablePreMortemAgents(tier);
    return agents.includes(agentId);
  }

  /**
   * Check if within usage limits
   */
  isWithinLimit(
    tier: SubscriptionTier, 
    limitKey: Exclude<keyof TierLimits, 'preMortemAgents'>, 
    currentUsage: number
  ): boolean {
    const limit = this.getLimit(tier, limitKey);
    if (limit === -1) return true; // Unlimited
    return currentUsage < limit;
  }

  /**
   * Get all available features for a tier
   */
  getAvailableFeatures(tier: SubscriptionTier): string[] {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) return [];
    
    const features: string[] = [];
    for (const [key, value] of Object.entries(tierConfig.features)) {
      if (key === 'councilModes') continue;
      if (value === true) features.push(key);
    }
    return features;
  }

  /**
   * Get all Holy Shit features availability for a tier
   */
  getHolyShitFeatures(tier: SubscriptionTier): Record<string, boolean> {
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) {
      return {
        preMortem: false,
        ghostBoard: false,
        decisionDebtDashboard: false,
        liveDemoMode: false,
        regulatoryInstantAbsorb: false,
      };
    }

    return {
      preMortem: tierConfig.features.preMortem,
      ghostBoard: tierConfig.features.ghostBoard,
      decisionDebtDashboard: tierConfig.features.decisionDebtDashboard,
      liveDemoMode: tierConfig.features.liveDemoMode,
      regulatoryInstantAbsorb: tierConfig.features.regulatoryInstantAbsorb,
    };
  }

  /**
   * Set custom feature overrides for an organization
   */
  setCustomOverrides(organizationId: string, overrides: Partial<FeatureAccess>): void {
    this.customOverrides.set(organizationId, overrides);
  }

  /**
   * Check feature with custom overrides
   */
  hasFeatureWithOverrides(
    tier: SubscriptionTier,
    organizationId: string,
    featureKey: keyof FeatureAccess
  ): boolean {
    // Check custom overrides first
    const overrides = this.customOverrides.get(organizationId);
    if (overrides && overrides[featureKey] !== undefined) {
      return overrides[featureKey] as boolean;
    }
    
    // Fall back to tier default
    return this.hasFeature(tier, featureKey);
  }

  /**
   * Get recommended upgrade tier for a feature
   */
  getUpgradeTierForFeature(featureKey: keyof FeatureAccess): SubscriptionTier | null {
    const tiers: SubscriptionTier[] = ['starter', 'professional', 'enterprise', 'enterprise_plus'];
    
    for (const tier of tiers) {
      if (this.hasFeature(tier, featureKey)) {
        return tier;
      }
    }
    
    return null;
  }

  /**
   * Calculate usage percentage
   */
  getUsagePercentage(
    tier: SubscriptionTier, 
    limitKey: Exclude<keyof TierLimits, 'preMortemAgents'>, 
    currentUsage: number
  ): number {
    const limit = this.getLimit(tier, limitKey);
    if (limit === -1) return 0; // Unlimited
    if (limit === 0) return 100; // Not available
    return Math.round((currentUsage / limit) * 100);
  }
}

export const featureGating = FeatureGatingService.getInstance();
