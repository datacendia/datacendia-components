/**
 * Licensing Service for Datacendia
 * 
 * Implements comprehensive licensing structure:
 * - Seat-based + Usage hybrid pricing
 * - Named vs Concurrent licensing options
 * - Module-based licensing for individual pillars
 * - Academic/Nonprofit tier (80% discount)
 * - Startup program (free under $1M ARR)
 * - Government/FedRAMP tier
 * - License key validation API
 */
// @ts-nocheck


import crypto from 'crypto';

// License Types
export type LicenseType = 'named' | 'concurrent' | 'site';
export type LicenseTier = 'free' | 'starter' | 'pro' | 'enterprise' | 'sovereign' | 'academic' | 'nonprofit' | 'startup' | 'government';
export type BillingCycle = 'monthly' | 'annual';

export interface LicenseModule {
  id: string;
  name: string;
  description: string;
  price: number; // Monthly base price
  features: string[];
  requiredModules?: string[];
}

export interface License {
  id: string;
  key: string;
  organizationId: string;
  tier: LicenseTier;
  type: LicenseType;
  modules: string[];
  seats: number;
  concurrentLimit?: number;
  billingCycle: BillingCycle;
  startDate: Date;
  expirationDate: Date;
  isActive: boolean;
  isTrial: boolean;
  trialEndsAt?: Date;
  usage: LicenseUsage;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface LicenseUsage {
  apiCalls: number;
  apiCallsLimit: number;
  storageUsedMB: number;
  storageLimitMB: number;
  deliberations: number;
  deliberationsLimit: number;
  aiTokens: number;
  aiTokensLimit: number;
  activeSeats: number;
  concurrentSessions: number;
}

export interface LicenseValidation {
  valid: boolean;
  license?: License;
  error?: string;
  features: string[];
  limits: Record<string, number>;
  expiresAt?: Date;
  daysRemaining?: number;
}

// Pricing Configuration
const TIER_PRICING: Record<LicenseTier, {
  basePrice: number;
  seatPrice: number;
  apiCallsIncluded: number;
  storageGB: number;
  deliberationsPerMonth: number;
  aiTokensPerMonth: number;
  discount?: number;
}> = {
  free: {
    basePrice: 0,
    seatPrice: 0,
    apiCallsIncluded: 1000,
    storageGB: 1,
    deliberationsPerMonth: 10,
    aiTokensPerMonth: 10000,
  },
  starter: {
    basePrice: 49,
    seatPrice: 15,
    apiCallsIncluded: 10000,
    storageGB: 10,
    deliberationsPerMonth: 100,
    aiTokensPerMonth: 100000,
  },
  pro: {
    basePrice: 299,
    seatPrice: 25,
    apiCallsIncluded: 100000,
    storageGB: 100,
    deliberationsPerMonth: 1000,
    aiTokensPerMonth: 1000000,
  },
  enterprise: {
    basePrice: 1499,
    seatPrice: 35,
    apiCallsIncluded: 1000000,
    storageGB: 1000,
    deliberationsPerMonth: 10000,
    aiTokensPerMonth: 10000000,
  },
  sovereign: {
    basePrice: 4999,
    seatPrice: 50,
    apiCallsIncluded: Infinity,
    storageGB: Infinity,
    deliberationsPerMonth: Infinity,
    aiTokensPerMonth: Infinity,
  },
  academic: {
    basePrice: 99,
    seatPrice: 5,
    apiCallsIncluded: 50000,
    storageGB: 50,
    deliberationsPerMonth: 500,
    aiTokensPerMonth: 500000,
    discount: 0.80, // 80% discount
  },
  nonprofit: {
    basePrice: 99,
    seatPrice: 5,
    apiCallsIncluded: 50000,
    storageGB: 50,
    deliberationsPerMonth: 500,
    aiTokensPerMonth: 500000,
    discount: 0.80,
  },
  startup: {
    basePrice: 0,
    seatPrice: 0,
    apiCallsIncluded: 25000,
    storageGB: 25,
    deliberationsPerMonth: 250,
    aiTokensPerMonth: 250000,
  },
  government: {
    basePrice: 2999,
    seatPrice: 45,
    apiCallsIncluded: 500000,
    storageGB: 500,
    deliberationsPerMonth: 5000,
    aiTokensPerMonth: 5000000,
  },
};

// Available Modules
const MODULES: LicenseModule[] = [
  {
    id: 'council',
    name: 'The Council',
    description: 'AI-powered multi-agent deliberation system',
    price: 199,
    features: ['Multi-agent deliberations', 'Cross-examination', 'Synthesis'],
  },
  {
    id: 'chronos',
    name: 'CendiaChronos',
    description: 'Enterprise time machine for audit and replay',
    price: 299,
    features: ['Timeline replay', 'State reconstruction', 'Audit trails'],
  },
  {
    id: 'graph',
    name: 'The Graph',
    description: 'Knowledge graph visualization and analytics',
    price: 149,
    features: ['Entity mapping', 'Relationship discovery', 'Graph queries'],
  },
  {
    id: 'pulse',
    name: 'The Pulse',
    description: 'Real-time organizational health monitoring',
    price: 99,
    features: ['Health metrics', 'Anomaly detection', 'Alerts'],
  },
  {
    id: 'predict',
    name: 'The Predict',
    description: 'Monte Carlo simulations and forecasting',
    price: 249,
    features: ['Scenario modeling', 'Uncertainty cones', 'What-if analysis'],
    requiredModules: ['chronos'],
  },
  {
    id: 'guard',
    name: 'The Guard',
    description: 'Security and compliance monitoring',
    price: 199,
    features: ['Threat detection', 'Compliance scanning', 'Access control'],
  },
  {
    id: 'ethics',
    name: 'The Ethics',
    description: 'AI ethics and bias detection',
    price: 149,
    features: ['Bias detection', 'Fairness metrics', 'Ethics reports'],
  },
  {
    id: 'agents',
    name: 'Custom Agents',
    description: 'Create and deploy custom AI agents',
    price: 299,
    features: ['Agent builder', 'Custom personas', 'Specialized expertise'],
    requiredModules: ['council'],
  },
];

class LicensingService {
  private licenses: Map<string, License> = new Map();
  private licensesByKey: Map<string, License> = new Map();

  /**
   * Generate a new license key
   */
  private generateLicenseKey(): string {
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return `DCND-${segments.join('-')}`;
  }

  /**
   * Create a new license
   */
  async createLicense(options: {
    organizationId: string;
    tier: LicenseTier;
    type?: LicenseType;
    modules?: string[];
    seats?: number;
    billingCycle?: BillingCycle;
    isTrial?: boolean;
    trialDays?: number;
  }): Promise<License> {
    const tierConfig = TIER_PRICING[options.tier];
    const now = new Date();
    const durationMonths = options.billingCycle === 'annual' ? 12 : 1;
    
    const license: License = {
      id: `lic_${crypto.randomUUID()}`,
      key: this.generateLicenseKey(),
      organizationId: options.organizationId,
      tier: options.tier,
      type: options.type || 'named',
      modules: options.modules || ['council', 'graph', 'pulse'],
      seats: options.seats || (options.tier === 'free' ? 3 : 10),
      billingCycle: options.billingCycle || 'monthly',
      startDate: now,
      expirationDate: new Date(now.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      isTrial: options.isTrial || false,
      trialEndsAt: options.isTrial 
        ? new Date(now.getTime() + (options.trialDays || 14) * 24 * 60 * 60 * 1000)
        : undefined,
      usage: {
        apiCalls: 0,
        apiCallsLimit: tierConfig.apiCallsIncluded,
        storageUsedMB: 0,
        storageLimitMB: tierConfig.storageGB * 1024,
        deliberations: 0,
        deliberationsLimit: tierConfig.deliberationsPerMonth,
        aiTokens: 0,
        aiTokensLimit: tierConfig.aiTokensPerMonth,
        activeSeats: 0,
        concurrentSessions: 0,
      },
      metadata: {},
      createdAt: now,
      updatedAt: now,
    };

    this.licenses.set(license.id, license);
    this.licensesByKey.set(license.key, license);

    console.log(`[Licensing] Created ${options.tier} license for org ${options.organizationId}`);
    return license;
  }

  /**
   * Validate a license key
   */
  async validateLicense(key: string): Promise<LicenseValidation> {
    const license = this.licensesByKey.get(key);

    if (!license) {
      return { valid: false, error: 'Invalid license key', features: [], limits: {} };
    }

    if (!license.isActive) {
      return { valid: false, error: 'License has been deactivated', features: [], limits: {} };
    }

    const now = new Date();
    if (license.expirationDate < now) {
      return { valid: false, error: 'License has expired', features: [], limits: {} };
    }

    if (license.isTrial && license.trialEndsAt && license.trialEndsAt < now) {
      return { valid: false, error: 'Trial period has ended', features: [], limits: {} };
    }

    // Collect features from all enabled modules
    const features: string[] = [];
    for (const moduleId of license.modules) {
      const module = MODULES.find(m => m.id === moduleId);
      if (module) {
        features.push(...module.features);
      }
    }

    const daysRemaining = Math.ceil(
      (license.expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    );

    return {
      valid: true,
      license,
      features,
      limits: {
        apiCalls: license.usage.apiCallsLimit,
        storageGB: license.usage.storageLimitMB / 1024,
        deliberations: license.usage.deliberationsLimit,
        aiTokens: license.usage.aiTokensLimit,
        seats: license.seats,
      },
      expiresAt: license.expirationDate,
      daysRemaining,
    };
  }

  /**
   * Check if a feature is available for a license
   */
  async hasFeature(licenseId: string, feature: string): Promise<boolean> {
    const license = this.licenses.get(licenseId);
    if (!license || !license.isActive) return false;

    for (const moduleId of license.modules) {
      const module = MODULES.find(m => m.id === moduleId);
      if (module?.features.includes(feature)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a module is available for a license
   */
  async hasModule(licenseId: string, moduleId: string): Promise<boolean> {
    const license = this.licenses.get(licenseId);
    return license?.modules.includes(moduleId) ?? false;
  }

  /**
   * Update usage metrics
   */
  async trackUsage(
    licenseId: string,
    metric: keyof LicenseUsage,
    increment: number = 1
  ): Promise<boolean> {
    const license = this.licenses.get(licenseId);
    if (!license) return false;

    const limitKey = `${metric}Limit` as keyof LicenseUsage;
    const currentValue = license.usage[metric] as number;
    const limitValue = license.usage[limitKey] as number;

    if (currentValue + increment > limitValue && limitValue !== Infinity) {
      console.warn(`[Licensing] Usage limit exceeded for ${metric}`);
      return false;
    }

    (license.usage[metric] as number) += increment;
    license.updatedAt = new Date();
    return true;
  }

  /**
   * Get usage report for a license
   */
  async getUsageReport(licenseId: string): Promise<{
    usage: LicenseUsage;
    percentages: Record<string, number>;
    warnings: string[];
  } | null> {
    const license = this.licenses.get(licenseId);
    if (!license) return null;

    const percentages: Record<string, number> = {};
    const warnings: string[] = [];

    const metrics: (keyof LicenseUsage)[] = ['apiCalls', 'storageUsedMB', 'deliberations', 'aiTokens'];
    
    for (const metric of metrics) {
      const limitKey = `${metric}Limit` as keyof LicenseUsage;
      const current = license.usage[metric] as number;
      const limit = license.usage[limitKey] as number;
      
      if (limit === Infinity) {
        percentages[metric] = 0;
      } else {
        const pct = (current / limit) * 100;
        percentages[metric] = pct;
        
        if (pct >= 90) {
          warnings.push(`${metric} usage is at ${pct.toFixed(1)}% of limit`);
        }
      }
    }

    return { usage: license.usage, percentages, warnings };
  }

  /**
   * Calculate price for a license configuration
   */
  calculatePrice(options: {
    tier: LicenseTier;
    seats: number;
    modules?: string[];
    billingCycle: BillingCycle;
  }): {
    basePrice: number;
    seatPrice: number;
    modulePrice: number;
    discount: number;
    subtotal: number;
    annualDiscount: number;
    total: number;
  } {
    const tierConfig = TIER_PRICING[options.tier];
    
    const basePrice = tierConfig.basePrice;
    const seatPrice = options.seats * tierConfig.seatPrice;
    
    let modulePrice = 0;
    if (options.modules) {
      for (const moduleId of options.modules) {
        const module = MODULES.find(m => m.id === moduleId);
        if (module) {
          modulePrice += module.price;
        }
      }
    }

    let subtotal = basePrice + seatPrice + modulePrice;
    
    // Apply tier discount (e.g., academic/nonprofit 80%)
    const tierDiscount = tierConfig.discount || 0;
    const discountAmount = subtotal * tierDiscount;
    subtotal -= discountAmount;

    // Annual discount (20%)
    const annualDiscount = options.billingCycle === 'annual' ? subtotal * 0.20 : 0;
    const total = options.billingCycle === 'annual' 
      ? (subtotal - annualDiscount) * 12 
      : subtotal;

    return {
      basePrice,
      seatPrice,
      modulePrice,
      discount: discountAmount,
      subtotal,
      annualDiscount,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Get all available modules
   */
  getModules(): LicenseModule[] {
    return MODULES;
  }

  /**
   * Get tier information
   */
  getTierInfo(tier: LicenseTier) {
    return TIER_PRICING[tier];
  }

  /**
   * Upgrade or downgrade a license tier
   */
  async changeTier(licenseId: string, newTier: LicenseTier): Promise<License | null> {
    const license = this.licenses.get(licenseId);
    if (!license) return null;

    const newConfig = TIER_PRICING[newTier];
    
    license.tier = newTier;
    license.usage.apiCallsLimit = newConfig.apiCallsIncluded;
    license.usage.storageLimitMB = newConfig.storageGB * 1024;
    license.usage.deliberationsLimit = newConfig.deliberationsPerMonth;
    license.usage.aiTokensLimit = newConfig.aiTokensPerMonth;
    license.updatedAt = new Date();

    console.log(`[Licensing] Changed license ${licenseId} to tier ${newTier}`);
    return license;
  }

  /**
   * Add module to license
   */
  async addModule(licenseId: string, moduleId: string): Promise<boolean> {
    const license = this.licenses.get(licenseId);
    if (!license) return false;

    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return false;

    // Check required modules
    if (module.requiredModules) {
      for (const required of module.requiredModules) {
        if (!license.modules.includes(required)) {
          console.error(`[Licensing] Module ${moduleId} requires ${required}`);
          return false;
        }
      }
    }

    if (!license.modules.includes(moduleId)) {
      license.modules.push(moduleId);
      license.updatedAt = new Date();
    }

    return true;
  }

  /**
   * Verify startup eligibility (under $1M ARR)
   */
  async verifyStartupEligibility(organizationId: string, annualRevenue: number): Promise<boolean> {
    const isEligible = annualRevenue < 1000000;
    console.log(`[Licensing] Startup eligibility for org ${organizationId}: ${isEligible} (ARR: $${annualRevenue})`);
    return isEligible;
  }

  /**
   * Apply academic/nonprofit discount
   */
  async applyEducationalDiscount(
    licenseId: string,
    type: 'academic' | 'nonprofit',
    verificationDocumentUrl: string
  ): Promise<boolean> {
    const license = this.licenses.get(licenseId);
    if (!license) return false;

    license.tier = type;
    license.metadata.educationalVerification = verificationDocumentUrl;
    license.metadata.discountApplied = true;
    license.updatedAt = new Date();

    console.log(`[Licensing] Applied ${type} discount to license ${licenseId}`);
    return true;
  }
}

export const licensingService = new LicensingService();
export default licensingService;
