// =============================================================================
// LICENSE MANAGEMENT SERVICE
// Platform-level license management - ENTERPRISE PLATINUM STANDARD
// Uses real Prisma database queries - NO MOCK DATA
// =============================================================================

import { logger } from '../../utils/logger.js';
import { PrismaClient, LicenseType, LicenseStatus } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface License {
  id: string;
  tenantId: string;
  tenantName: string;
  licenseKey: string;
  type: 'pilot' | 'trial' | 'foundation' | 'enterprise' | 'strategic' | 'custom';
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  seats: number;
  seatsUsed: number;
  features: LicenseFeatures;
  billingCycle: 'annual';
  revenue: number;
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
// LICENSE SERVICE - REAL DATABASE QUERIES
// =============================================================================

class LicenseService {
  constructor() {
    logger.info('LicenseService: Initialized with Prisma database connection');
  }

  private mapTypeFromDb(type: LicenseType): License['type'] {
    const mapping: Record<LicenseType, License['type']> = {
      PILOT: 'pilot',
      TRIAL: 'trial',
      FOUNDATION: 'foundation',
      ENTERPRISE: 'enterprise',
      STRATEGIC: 'strategic',
      CUSTOM: 'custom',
    };
    return mapping[type] || 'trial';
  }

  private mapTypeToDb(type: License['type']): LicenseType {
    const mapping: Record<License['type'], LicenseType> = {
      pilot: 'PILOT',
      trial: 'TRIAL',
      foundation: 'FOUNDATION',
      enterprise: 'ENTERPRISE',
      strategic: 'STRATEGIC',
      custom: 'CUSTOM',
    };
    return mapping[type] || 'TRIAL';
  }

  private mapStatusFromDb(status: LicenseStatus): License['status'] {
    const mapping: Record<LicenseStatus, License['status']> = {
      ACTIVE: 'active',
      EXPIRING: 'expiring',
      EXPIRED: 'expired',
      SUSPENDED: 'suspended',
    };
    return mapping[status] || 'active';
  }

  private mapStatusToDb(status: License['status']): LicenseStatus {
    const mapping: Record<License['status'], LicenseStatus> = {
      active: 'ACTIVE',
      expiring: 'EXPIRING',
      expired: 'EXPIRED',
      suspended: 'SUSPENDED',
    };
    return mapping[status] || 'ACTIVE';
  }

  private async mapDbToLicense(dbLicense: any): Promise<License> {
    // Get tenant name
    let tenantName = 'Unknown';
    try {
      const tenant = await prisma.tenants.findUnique({
        where: { id: dbLicense.tenant_id },
        select: { name: true },
      });
      tenantName = tenant?.name || 'Unknown';
    } catch {
      // Ignore
    }

    const features = (dbLicense.features as any) || this.getFeaturesForType(this.mapTypeFromDb(dbLicense.type));

    return {
      id: dbLicense.id,
      tenantId: dbLicense.tenant_id,
      tenantName,
      licenseKey: dbLicense.license_key,
      type: this.mapTypeFromDb(dbLicense.type),
      status: this.mapStatusFromDb(dbLicense.status),
      seats: dbLicense.seats,
      seatsUsed: dbLicense.seats_used,
      features: Array.isArray(features) ? this.getFeaturesForType(this.mapTypeFromDb(dbLicense.type)) : features,
      billingCycle: 'annual',
      revenue: Number(dbLicense.revenue) || 0,
      startDate: dbLicense.start_date,
      expiresAt: dbLicense.expires_at,
      autoRenew: dbLicense.auto_renew,
      renewalPrice: dbLicense.renewal_price ? Number(dbLicense.renewal_price) : undefined,
      notes: dbLicense.notes,
      createdAt: dbLicense.created_at,
      updatedAt: dbLicense.updated_at,
    };
  }

  private generateLicenseKey(type: string): string {
    const prefix = type.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    return `DC-${prefix}-${random}-${timestamp}`;
  }

  private getFeaturesForType(type: string): LicenseFeatures {
    const features: Record<string, LicenseFeatures> = {
      pilot: {
        pillars: ['council', 'decide', 'dcii'],
        agents: 15,
        maxUsers: 25,
        maxDeliberationsPerMonth: 100,
        apiAccess: true,
        ssoEnabled: false,
        customBranding: false,
        prioritySupport: false,
        dedicatedSuccess: false,
        customIntegrations: false,
        advancedAnalytics: false,
      },
      trial: {
        pillars: ['council', 'decide', 'dcii'],
        agents: 15,
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
        pillars: ['council', 'decide', 'dcii'],
        agents: 15,
        maxUsers: 100,
        maxDeliberationsPerMonth: 1000,
        apiAccess: true,
        ssoEnabled: false,
        customBranding: false,
        prioritySupport: true,
        dedicatedSuccess: false,
        customIntegrations: false,
        advancedAnalytics: true,
      },
      enterprise: {
        pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate'],
        agents: 50,
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
      strategic: {
        pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
        agents: -1, // Unlimited
        maxUsers: -1, // Unlimited
        maxDeliberationsPerMonth: -1, // Unlimited
        apiAccess: true,
        ssoEnabled: true,
        customBranding: true,
        prioritySupport: true,
        dedicatedSuccess: true,
        customIntegrations: true,
        advancedAnalytics: true,
      },
      custom: {
        pillars: ['council', 'decide', 'dcii', 'stress_test', 'comply', 'govern', 'sovereign', 'operate', 'collapse', 'sgas', 'verticals', 'frontier'],
        agents: -1, // Unlimited
        maxUsers: -1, // Unlimited
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

    return features[type] || features['trial'];
  }

  // ---------------------------------------------------------------------------
  // LICENSE CRUD - REAL PRISMA DATABASE QUERIES
  // ---------------------------------------------------------------------------

  async createLicense(data: {
    tenantId: string;
    type: License['type'];
    durationMonths: number;
    seats?: number;
    autoRenew?: boolean;
    notes?: string;
  }): Promise<License> {
    try {
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + data.durationMonths);

      const features = this.getFeaturesForType(data.type);
      const licenseKey = this.generateLicenseKey(data.type);
      const revenue = this.getRevenue(data.type);

      const dbLicense = await prisma.licenses.create({
        data: {
          tenant_id: data.tenantId,
          license_key: licenseKey,
          type: this.mapTypeToDb(data.type),
          status: 'ACTIVE',
          seats: data.seats || (features.maxUsers === -1 ? 9999 : features.maxUsers),
          seats_used: 0,
          features: features as any,
          billing_cycle: 'ANNUAL',
          revenue,
          start_date: now,
          expires_at: expiresAt,
          auto_renew: data.autoRenew ?? false,
          notes: data.notes,
        },
      });

      logger.info(`LicenseService: Created license ${dbLicense.id} for tenant ${data.tenantId}`);
      return this.mapDbToLicense(dbLicense);
    } catch (error) {
      logger.error('LicenseService: Failed to create license', error);
      throw error;
    }
  }

  private getRevenue(type: string): number {
    // Annual enterprise licensing — not SaaS
    const annualPrices: Record<string, number> = {
      pilot: 50000,
      trial: 0,
      foundation: 150000,
      enterprise: 500000,
      strategic: 2000000,
      custom: 0, // Negotiated
    };
    return annualPrices[type] || 0;
  }

  async getLicense(licenseId: string): Promise<License | null> {
    try {
      const dbLicense = await prisma.licenses.findUnique({
        where: { id: licenseId },
      });
      return dbLicense ? this.mapDbToLicense(dbLicense) : null;
    } catch (error) {
      logger.error(`LicenseService: Failed to get license ${licenseId}`, error);
      return null;
    }
  }

  async getLicenseByTenant(tenantId: string): Promise<License | null> {
    try {
      const dbLicense = await prisma.licenses.findFirst({
        where: { tenant_id: tenantId },
        orderBy: { created_at: 'desc' },
      });
      return dbLicense ? this.mapDbToLicense(dbLicense) : null;
    } catch (error) {
      logger.error(`LicenseService: Failed to get license for tenant ${tenantId}`, error);
      return null;
    }
  }

  async updateLicense(licenseId: string, updates: Partial<License>): Promise<License | null> {
    try {
      const updateData: any = { updated_at: new Date() };
      if (updates.type) updateData.type = this.mapTypeToDb(updates.type);
      if (updates.status) updateData.status = this.mapStatusToDb(updates.status);
      if (updates.seats) updateData.seats = updates.seats;
      if (updates.autoRenew !== undefined) updateData.auto_renew = updates.autoRenew;
      if (updates.notes) updateData.notes = updates.notes;
      if (updates.expiresAt) updateData.expires_at = updates.expiresAt;
      if (updates.features) updateData.features = updates.features;

      const dbLicense = await prisma.licenses.update({
        where: { id: licenseId },
        data: updateData,
      });
      logger.info(`LicenseService: Updated license ${licenseId}`);
      return this.mapDbToLicense(dbLicense);
    } catch (error) {
      logger.error(`LicenseService: Failed to update license ${licenseId}`, error);
      return null;
    }
  }

  async listLicenses(filters?: {
    status?: License['status'];
    type?: License['type'];
  }): Promise<License[]> {
    try {
      const where: any = {};
      if (filters?.status) {
        where.status = this.mapStatusToDb(filters.status);
      }
      if (filters?.type) {
        where.type = this.mapTypeToDb(filters.type);
      }

      const dbLicenses = await prisma.licenses.findMany({
        where,
        orderBy: { created_at: 'desc' },
      });

      const licenses = await Promise.all(
        dbLicenses.map((l: any) => this.mapDbToLicense(l))
      );

      // Update status based on expiration
      return licenses.map(l => this.updateLicenseStatus(l));
    } catch (error) {
      logger.error('LicenseService: Failed to list licenses', error);
      return [];
    }
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
  // LICENSE OPERATIONS - REAL DATABASE
  // ---------------------------------------------------------------------------

  async extendLicense(licenseId: string, months: number): Promise<License | null> {
    try {
      const license = await prisma.licenses.findUnique({
        where: { id: licenseId },
      });
      if (!license) return null;

      const newExpiry = new Date(license.expires_at);
      newExpiry.setMonth(newExpiry.getMonth() + months);

      const dbLicense = await prisma.licenses.update({
        where: { id: licenseId },
        data: {
          expires_at: newExpiry,
          status: 'ACTIVE',
          updated_at: new Date(),
        },
      });

      logger.info(`LicenseService: Extended license ${licenseId} by ${months} months`);
      return this.mapDbToLicense(dbLicense);
    } catch (error) {
      logger.error(`LicenseService: Failed to extend license ${licenseId}`, error);
      return null;
    }
  }

  async upgradeLicense(licenseId: string, newType: License['type']): Promise<License | null> {
    try {
      const features = this.getFeaturesForType(newType);
      const dbLicense = await prisma.licenses.update({
        where: { id: licenseId },
        data: {
          type: this.mapTypeToDb(newType),
          features: features as any,
          updated_at: new Date(),
        },
      });

      logger.info(`LicenseService: Upgraded license ${licenseId} to ${newType}`);
      return this.mapDbToLicense(dbLicense);
    } catch (error) {
      logger.error(`LicenseService: Failed to upgrade license ${licenseId}`, error);
      return null;
    }
  }

  async suspendLicense(licenseId: string, reason: string): Promise<License | null> {
    try {
      const dbLicense = await prisma.licenses.update({
        where: { id: licenseId },
        data: {
          status: 'SUSPENDED',
          notes: reason,
          updated_at: new Date(),
        },
      });

      logger.info(`LicenseService: Suspended license ${licenseId}: ${reason}`);
      return this.mapDbToLicense(dbLicense);
    } catch (error) {
      logger.error(`LicenseService: Failed to suspend license ${licenseId}`, error);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS - REAL DATABASE AGGREGATION
  // ---------------------------------------------------------------------------

  async getMetrics(): Promise<{
    totalLicenses: number;
    activeLicenses: number;
    expiringLicenses: number;
    trialLicenses: number;
    revenueAtRisk: number;
    byType: Record<string, number>;
  }> {
    try {
      const [counts, typeCounts, expiringRevenue] = await Promise.all([
        prisma.licenses.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        prisma.licenses.groupBy({
          by: ['type'],
          _count: { id: true },
        }),
        prisma.licenses.aggregate({
          where: { status: 'EXPIRING' },
          _sum: { renewal_price: true },
        }),
      ]);

      const statusCounts: Record<string, number> = {};
      counts.forEach((c: any) => {
        statusCounts[c.status] = c._count.id;
      });

      const byType: Record<string, number> = {};
      typeCounts.forEach((c: any) => {
        byType[this.mapTypeFromDb(c.type)] = c._count.id;
      });

      const totalLicenses = Object.values(statusCounts).reduce((a, b) => a + b, 0);

      return {
        totalLicenses,
        activeLicenses: statusCounts['ACTIVE'] || 0,
        expiringLicenses: statusCounts['EXPIRING'] || 0,
        trialLicenses: byType['trial'] || 0,
        revenueAtRisk: Number(expiringRevenue._sum.renewal_price) || 0,
        byType,
      };
    } catch (error) {
      logger.error('LicenseService: Failed to get metrics', error);
      return {
        totalLicenses: 0,
        activeLicenses: 0,
        expiringLicenses: 0,
        trialLicenses: 0,
        revenueAtRisk: 0,
        byType: {},
      };
    }
  }
}

export const licenseService = new LicenseService();
export default licenseService;
