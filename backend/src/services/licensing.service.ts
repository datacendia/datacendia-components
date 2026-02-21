// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Licensing Service for Datacendia
 * 
 * 3-Tier Annual Enterprise Licensing:
 *   Pilot:      $50,000 (90-day evaluation, 1 business unit)
 *   Foundation:  $150,000–$500,000/year (Council + DECIDE + DCII)
 *   Enterprise:  $500,000–$1,500,000/year (+ StressTest, Comply, Govern, Sovereign, Operate)
 *   Strategic:   $2M–$100M+/year (+ Resilience, Model, Dominate, Nation)
 *   Custom:      Negotiated (Government, Defense, Platinum)
 * 
 * Model: Sovereign-first enterprise software. Not SaaS. Annual licenses.
 * Customer-owned infrastructure, keys, and proof.
 */

import crypto from 'crypto';
import { persistServiceRecord, loadServiceRecords } from '../utils/servicePersistence.js';
import { logger } from '../utils/logger.js';

// License Types
export type LicenseType = 'named' | 'concurrent' | 'site';
export type LicenseTier = 'pilot' | 'foundation' | 'enterprise' | 'strategic' | 'custom';
export type BillingCycle = 'annual';

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

// Pricing Configuration — Annual Enterprise Licensing
const TIER_PRICING: Record<LicenseTier, {
  annualMin: number;
  annualMax: number;
  pilotPrice: number;
  apiCallsIncluded: number;
  storageGB: number;
  deliberationsPerMonth: number;
  aiTokensPerMonth: number;
  pillars: string[];
}> = {
  pilot: {
    annualMin: 50000,
    annualMax: 50000,
    pilotPrice: 50000,
    apiCallsIncluded: 50000,
    storageGB: 50,
    deliberationsPerMonth: 100,
    aiTokensPerMonth: 500000,
    pillars: ['council', 'decide', 'dcii'],
  },
  foundation: {
    annualMin: 150000,
    annualMax: 500000,
    pilotPrice: 50000,
    apiCallsIncluded: 500000,
    storageGB: 500,
    deliberationsPerMonth: 1000,
    aiTokensPerMonth: 5000000,
    pillars: ['council', 'decide', 'dcii'],
  },
  enterprise: {
    annualMin: 500000,
    annualMax: 1500000,
    pilotPrice: 50000,
    apiCallsIncluded: Infinity,
    storageGB: 5000,
    deliberationsPerMonth: Infinity,
    aiTokensPerMonth: Infinity,
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate'],
  },
  strategic: {
    annualMin: 1500000,
    annualMax: Infinity,
    pilotPrice: 50000,
    apiCallsIncluded: Infinity,
    storageGB: Infinity,
    deliberationsPerMonth: Infinity,
    aiTokensPerMonth: Infinity,
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
  },
  custom: {
    annualMin: 0,
    annualMax: Infinity,
    pilotPrice: 0,
    apiCallsIncluded: Infinity,
    storageGB: Infinity,
    deliberationsPerMonth: Infinity,
    aiTokensPerMonth: Infinity,
    pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
  },
};

// Available Modules — Pillar-based licensing
const MODULES: LicenseModule[] = [
  // Tier 1: Foundation Pillars
  {
    id: 'council',
    name: 'THE COUNCIL',
    description: 'Multi-agent AI deliberation system — the engine that produces decisions',
    price: 0, // Included in Foundation
    features: ['15 C-Suite agents', '35+ Council modes', 'CendiaLive™', 'CendiaReplay™', 'PersonaForge™'],
  },
  {
    id: 'decide',
    name: 'DECIDE',
    description: 'Intelligence about every decision — before, during, and after',
    price: 0, // Included in Foundation
    features: ['CendiaChronos™', 'CendiaPreMortem™', 'Ghost Board™', 'Decision Debt™', 'CendiaEcho™', 'CendiaCascade™'],
  },
  {
    id: 'dcii',
    name: 'DCII',
    description: 'Decision Crisis Immunization Infrastructure — prove decisions survive scrutiny',
    price: 0, // Included in Foundation
    features: ['9 Primitives (P1-P9)', 'CendiaVault™', 'CendiaNotary™', 'CendiaIISS™', 'Regulator\'s Receipt™', 'CendiaBiasMitigation™'],
  },
  // Tier 2: Enterprise Pillars
  {
    id: 'stress_test',
    name: 'STRESS-TEST',
    description: 'Attack decisions before reality does',
    price: 0, // Included in Enterprise
    features: ['CendiaCrucible™', 'CendiaRedTeam™', 'War Games', 'SCGE', 'Monte Carlo Engine'],
    requiredModules: ['council', 'decide', 'dcii'],
  },
  {
    id: 'comply',
    name: 'COMPLY',
    description: 'Stay legal everywhere, automatically',
    price: 0, // Included in Enterprise
    features: ['CendiaPanopticon™', 'Regulatory Absorb™', 'Compliance Monitor', '10 Frameworks', 'CendiaInsure™'],
    requiredModules: ['dcii'],
  },
  {
    id: 'govern',
    name: 'GOVERN',
    description: 'Rules, oversight, and accountability',
    price: 0, // Included in Enterprise
    features: ['CendiaGovern™', 'CendiaCourt™', 'CendiaDissent™', 'CendiaAutopilot™', 'Logic Gate'],
    requiredModules: ['council'],
  },
  {
    id: 'sovereign',
    name: 'SOVEREIGN',
    description: 'Your infrastructure, your keys, your proof',
    price: 0, // Included in Enterprise
    features: ['21 Sovereign Patterns', 'Post-Quantum KMS', 'CendiaBlackBox™', 'Federated Mesh', 'CAC/PIV Auth'],
  },
  {
    id: 'operate',
    name: 'OPERATE (CendiaOps™)',
    description: 'AI co-pilots for every department',
    price: 0, // Included in Enterprise
    features: ['19 Department Co-Pilots', 'CendiaOmniTranslate™', 'CendiaApotheosis™', 'CendiaPulse'],
    requiredModules: ['council'],
  },
  // Tier 3: Strategic Pillars
  {
    id: 'collapse',
    name: 'RESILIENCE',
    description: 'Institutional survival systems — collapse simulation, recovery, century-grade preservation',
    price: 0, // Included in Strategic
    features: ['COLLAPSE Simulation', 'CendiaPhoenix™', 'CendiaEternal™', 'CendiaHorizon™', 'Succession Engine', 'Institutional Memory Architecture'],
    requiredModules: ['council', 'stress_test'],
  },
  {
    id: 'sgas',
    name: 'MODEL',
    description: 'Understand society before you act on it — population modeling, stakeholder voice, policy simulation',
    price: 0, // Included in Strategic
    features: ['SGAS Population Modeling', 'CendiaVox™', 'CendiaNarratives™', 'Synthetic Population Engine', 'Policy Impact Simulator'],
    requiredModules: ['council'],
  },
  {
    id: 'verticals',
    name: 'DOMINATE',
    description: 'Own your industry — 8 deep verticals with 48+ modes each',
    price: 0, // Included in Strategic
    features: ['Legal Vertical', 'Healthcare Vertical', 'Finance Vertical', 'Sports Vertical', 'Energy Vertical', 'Defense Vertical', 'Government Vertical', 'Insurance Vertical', 'CendiaMesh™ M&A', 'CendiaGlass™ AR'],
    requiredModules: ['council', 'decide', 'comply'],
  },
  {
    id: 'frontier',
    name: 'NATION',
    description: 'Governance at national scale — policy modeling, multi-agency coordination, sovereign infrastructure',
    price: 0, // Included in Strategic
    features: ['CendiaNation™', 'National Compliance Framework', 'Multi-Agency Coordination', 'Sovereign National Infrastructure'],
    requiredModules: ['council', 'decide', 'dcii', 'sovereign'],
  },
];

class LicensingService {
  private licenses: Map<string, License> = new Map();
  private licensesByKey: Map<string, License> = new Map();



  constructor() {


    this.loadFromDB().catch(() => {});


  }


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
    const durationMonths = options.tier === 'pilot' ? 3 : 12;
    
    const license: License = {
      id: `lic_${crypto.randomUUID()}`,
      key: this.generateLicenseKey(),
      organizationId: options.organizationId,
      tier: options.tier,
      type: options.type || 'site',
      modules: options.modules || tierConfig.pillars,
      seats: options.seats || 50,
      billingCycle: options.billingCycle || 'annual',
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
   * All pricing is annual enterprise licensing — not SaaS.
   */
  calculatePrice(options: {
    tier: LicenseTier;
    seats: number;
    modules?: string[];
    billingCycle: BillingCycle;
  }): {
    annualMin: number;
    annualMax: number;
    pilotPrice: number;
    pillarsIncluded: string[];
    total: number;
  } {
    const tierConfig = TIER_PRICING[options.tier];

    return {
      annualMin: tierConfig.annualMin,
      annualMax: tierConfig.annualMax === Infinity ? 0 : tierConfig.annualMax,
      pilotPrice: tierConfig.pilotPrice,
      pillarsIncluded: tierConfig.pillars,
      total: tierConfig.annualMin,
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
   * Get pillars available for a tier
   */
  getPillarsForTier(tier: LicenseTier): string[] {
    return TIER_PRICING[tier]?.pillars || [];
  }

  /**
   * Check if a pillar is available for a tier
   */
  hasPillar(tier: LicenseTier, pillarId: string): boolean {
    return this.getPillarsForTier(tier).includes(pillarId);
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'Licensing', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.licenses.has(d.id)) this.licenses.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'Licensing', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.licensesByKey.has(d.id)) this.licensesByKey.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[LicensingService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[LicensingService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const licensingService = new LicensingService();
export default licensingService;
