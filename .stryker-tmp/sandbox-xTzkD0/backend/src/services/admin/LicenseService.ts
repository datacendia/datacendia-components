// @ts-nocheck
// =============================================================================
// LICENSE MANAGEMENT SERVICE
// Platform-level license management
// =============================================================================

import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface License {
  id: string;
  tenantId: string;
  tenantName: string;
  type: 'trial' | 'foundation' | 'intelligence' | 'governance' | 'sovereign';
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  features: LicenseFeatures;
  startDate: Date;
  expiresAt: Date;
  autoRenew: boolean;
  renewalPrice?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LicenseFeatures {
  pillars: string[];
  agents: number;
  maxUsers: number;
  maxDeliberationsPerMonth: number;
  apiAccess: boolean;
  ssoEnabled: boolean;
  customBranding: boolean;
  prioritySupport: boolean;
  dedicatedSuccess: boolean;
  customIntegrations: boolean;
  advancedAnalytics: boolean;
}

// =============================================================================
// LICENSE SERVICE
// =============================================================================

class LicenseService {
  private licenses: Map<string, License> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleLicenses: License[] = [
      {
        id: 'LIC-001',
        tenantId: 'tenant_acme_2024',
        tenantName: 'Acme Corporation',
        type: 'sovereign',
        status: 'active',
        features: this.getFeaturesForType('sovereign'),
        startDate: new Date('2024-01-15'),
        expiresAt: new Date('2025-12-31'),
        autoRenew: true,
        renewalPrice: 300000,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
      {
        id: 'LIC-002',
        tenantId: 'tenant_techstart_2024',
        tenantName: 'TechStart Inc',
        type: 'intelligence',
        status: 'active',
        features: this.getFeaturesForType('intelligence'),
        startDate: new Date('2024-02-03'),
        expiresAt: new Date('2026-01-15'),
        autoRenew: true,
        renewalPrice: 120000,
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date(),
      },
      {
        id: 'LIC-003',
        tenantId: 'tenant_globalco_2024',
        tenantName: 'GlobalCo',
        type: 'governance',
        status: 'expiring',
        features: this.getFeaturesForType('governance'),
        startDate: new Date('2024-03-22'),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        autoRenew: false,
        renewalPrice: 180000,
        notes: 'Customer reviewing renewal options',
        createdAt: new Date('2024-03-22'),
        updatedAt: new Date(),
      },
      {
        id: 'LIC-004',
        tenantId: 'tenant_healthtech_2024',
        tenantName: 'HealthTech Labs',
        type: 'trial',
        status: 'active',
        features: this.getFeaturesForType('trial'),
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        autoRenew: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: 'LIC-005',
        tenantId: 'tenant_financeFirst_2024',
        tenantName: 'FinanceFirst',
        type: 'intelligence',
        status: 'active',
        features: this.getFeaturesForType('intelligence'),
        startDate: new Date('2024-04-08'),
        expiresAt: new Date('2025-04-08'),
        autoRenew: true,
        renewalPrice: 120000,
        createdAt: new Date('2024-04-08'),
        updatedAt: new Date(),
      },
    ];

    sampleLicenses.forEach(l => this.licenses.set(l.id, l));
    logger.info(`LicenseService: Initialized with ${sampleLicenses.length} licenses`);
  }

  private getFeaturesForType(type: string): LicenseFeatures {
    const features: Record<string, LicenseFeatures> = {
      trial: {
        pillars: ['helm', 'lineage', 'predict'],
        agents: 3,
        maxUsers: 25,
        maxDeliberationsPerMonth: 50,
        apiAccess: false,
        ssoEnabled: false,
        customBranding: false,
        prioritySupport: false,
        dedicatedSuccess: false,
        customIntegrations: false,
        advancedAnalytics: false,
      },
      foundation: {
        pillars: ['helm', 'lineage', 'predict', 'flow'],
        agents: 5,
        maxUsers: 50,
        maxDeliberationsPerMonth: 200,
        apiAccess: true,
        ssoEnabled: false,
        customBranding: false,
        prioritySupport: false,
        dedicatedSuccess: false,
        customIntegrations: false,
        advancedAnalytics: false,
      },
      intelligence: {
        pillars: ['helm', 'lineage', 'predict', 'flow', 'health', 'guard'],
        agents: 8,
        maxUsers: 100,
        maxDeliberationsPerMonth: 500,
        apiAccess: true,
        ssoEnabled: false,
        customBranding: true,
        prioritySupport: true,
        dedicatedSuccess: false,
        customIntegrations: false,
        advancedAnalytics: true,
      },
      governance: {
        pillars: ['helm', 'lineage', 'predict', 'flow', 'health', 'guard', 'ethics'],
        agents: 12,
        maxUsers: 200,
        maxDeliberationsPerMonth: 1000,
        apiAccess: true,
        ssoEnabled: true,
        customBranding: true,
        prioritySupport: true,
        dedicatedSuccess: true,
        customIntegrations: true,
        advancedAnalytics: true,
      },
      sovereign: {
        pillars: ['helm', 'lineage', 'predict', 'flow', 'health', 'guard', 'ethics', 'agents'],
        agents: 26,
        maxUsers: 500,
        maxDeliberationsPerMonth: -1, // Unlimited
        apiAccess: true,
        ssoEnabled: true,
        customBranding: true,
        prioritySupport: true,
        dedicatedSuccess: true,
        customIntegrations: true,
        advancedAnalytics: true,
      },
    };

    return features[type] || features.trial;
  }

  // ---------------------------------------------------------------------------
  // LICENSE CRUD
  // ---------------------------------------------------------------------------

  async createLicense(data: {
    tenantId: string;
    tenantName: string;
    type: License['type'];
    durationMonths: number;
    autoRenew?: boolean;
    notes?: string;
  }): Promise<License> {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + data.durationMonths);

    const license: License = {
      id: `LIC-${String(this.licenses.size + 1).padStart(3, '0')}`,
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      type: data.type,
      status: data.type === 'trial' ? 'active' : 'active',
      features: this.getFeaturesForType(data.type),
      startDate: now,
      expiresAt,
      autoRenew: data.autoRenew ?? false,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.licenses.set(license.id, license);
    logger.info(`LicenseService: Created license ${license.id} for ${data.tenantName}`);
    
    return license;
  }

  async getLicense(licenseId: string): Promise<License | null> {
    return this.licenses.get(licenseId) || null;
  }

  async getLicenseByTenant(tenantId: string): Promise<License | null> {
    for (const license of this.licenses.values()) {
      if (license.tenantId === tenantId) return license;
    }
    return null;
  }

  async updateLicense(licenseId: string, updates: Partial<License>): Promise<License | null> {
    const license = this.licenses.get(licenseId);
    if (!license) return null;

    const updated = { ...license, ...updates, updatedAt: new Date() };
    this.licenses.set(licenseId, updated);
    logger.info(`LicenseService: Updated license ${licenseId}`);
    
    return updated;
  }

  async listLicenses(filters?: {
    status?: License['status'];
    type?: License['type'];
  }): Promise<License[]> {
    let licenses = Array.from(this.licenses.values());

    if (filters?.status) {
      licenses = licenses.filter(l => l.status === filters.status);
    }
    if (filters?.type) {
      licenses = licenses.filter(l => l.type === filters.type);
    }

    // Update status based on expiration
    licenses = licenses.map(l => this.updateLicenseStatus(l));

    return licenses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private updateLicenseStatus(license: License): License {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((license.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      license.status = 'expired';
    } else if (daysUntilExpiry <= 30) {
      license.status = 'expiring';
    }

    return license;
  }

  // ---------------------------------------------------------------------------
  // LICENSE OPERATIONS
  // ---------------------------------------------------------------------------

  async extendLicense(licenseId: string, months: number): Promise<License | null> {
    const license = this.licenses.get(licenseId);
    if (!license) return null;

    const newExpiry = new Date(license.expiresAt);
    newExpiry.setMonth(newExpiry.getMonth() + months);

    license.expiresAt = newExpiry;
    license.status = 'active';
    license.updatedAt = new Date();

    logger.info(`LicenseService: Extended license ${licenseId} by ${months} months`);
    return license;
  }

  async upgradeLicense(licenseId: string, newType: License['type']): Promise<License | null> {
    const license = this.licenses.get(licenseId);
    if (!license) return null;

    license.type = newType;
    license.features = this.getFeaturesForType(newType);
    license.updatedAt = new Date();

    logger.info(`LicenseService: Upgraded license ${licenseId} to ${newType}`);
    return license;
  }

  async suspendLicense(licenseId: string, reason: string): Promise<License | null> {
    const license = this.licenses.get(licenseId);
    if (!license) return null;

    license.status = 'suspended';
    license.notes = reason;
    license.updatedAt = new Date();

    logger.info(`LicenseService: Suspended license ${licenseId}: ${reason}`);
    return license;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalLicenses: number;
    activeLicenses: number;
    expiringLicenses: number;
    trialLicenses: number;
    revenueAtRisk: number;
    byType: Record<string, number>;
  } {
    const licenses = Array.from(this.licenses.values()).map(l => this.updateLicenseStatus(l));

    const byType: Record<string, number> = {};
    licenses.forEach(l => {
      byType[l.type] = (byType[l.type] || 0) + 1;
    });

    const expiring = licenses.filter(l => l.status === 'expiring');
    const revenueAtRisk = expiring.reduce((sum, l) => sum + (l.renewalPrice || 0), 0);

    return {
      totalLicenses: licenses.length,
      activeLicenses: licenses.filter(l => l.status === 'active').length,
      expiringLicenses: expiring.length,
      trialLicenses: licenses.filter(l => l.type === 'trial').length,
      revenueAtRisk,
      byType,
    };
  }
}

export const licenseService = new LicenseService();
export default licenseService;
