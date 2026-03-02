/**
 * Service — Tenant Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports tenantService, Tenant, TenantSettings, TenantUsage, TenantMetrics
 * @module services/admin/TenantService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// TENANT MANAGEMENT SERVICE
// Platform-level tenant/organization management - ENTERPRISE PLATINUM STANDARD
// Uses real Prisma database queries - NO MOCK DATA
// =============================================================================

import { logger } from '../../utils/logger.js';
import { PrismaClient, TenantPlan, TenantStatus } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'pilot' | 'trial' | 'foundation' | 'enterprise' | 'strategic' | 'custom';
  status: 'pending' | 'trial' | 'active' | 'suspended' | 'churned';
  userCount: number;
  userLimit: number;
  mrr: number;
  billingEmail?: string;
  settings: TenantSettings;
  metadata: {
    industry?: string;
    companySize?: string;
    country?: string;
    primaryContact?: string;
    primaryEmail?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
}

export interface TenantSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  features: {
    councilEnabled: boolean;
    enterpriseEnabled: boolean;
    apiAccess: boolean;
    ssoEnabled: boolean;
    customBranding: boolean;
    advancedAnalytics: boolean;
  };
  limits: {
    maxUsers: number;
    maxAgents: number;
    maxDeliberationsPerMonth: number;
    maxApiCallsPerDay: number;
    storageGb: number;
  };
}

export interface TenantUsage {
  tenantId: string;
  period: string;
  apiCalls: number;
  deliberations: number;
  activeUsers: number;
  storageUsedGb: number;
  agentInvocations: number;
}

export interface TenantMetrics {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  churnedTenants: number;
  totalMrr: number;
  avgRevenuePerTenant: number;
  totalUsers: number;
}

// =============================================================================
// TENANT SERVICE - REAL DATABASE QUERIES
// =============================================================================

class TenantService {
  constructor() {
    logger.info('TenantService: Initialized with Prisma database connection');
  }

  private mapPlanFromDb(plan: TenantPlan): Tenant['plan'] {
    const mapping: Record<TenantPlan, Tenant['plan']> = {
      PILOT: 'pilot',
      TRIAL: 'trial',
      FOUNDATION: 'foundation',
      ENTERPRISE: 'enterprise',
      STRATEGIC: 'strategic',
      CUSTOM: 'custom',
    };
    return mapping[plan] || 'trial';
  }

  private mapPlanToDb(plan: Tenant['plan']): TenantPlan {
    const mapping: Record<Tenant['plan'], TenantPlan> = {
      pilot: 'PILOT',
      trial: 'TRIAL',
      foundation: 'FOUNDATION',
      enterprise: 'ENTERPRISE',
      strategic: 'STRATEGIC',
      custom: 'CUSTOM',
    };
    return mapping[plan] || 'TRIAL';
  }

  private mapStatusFromDb(status: TenantStatus): Tenant['status'] {
    const mapping: Record<TenantStatus, Tenant['status']> = {
      PENDING: 'pending',
      TRIAL: 'trial',
      ACTIVE: 'active',
      SUSPENDED: 'suspended',
      CHURNED: 'churned',
    };
    return mapping[status] || 'trial';
  }

  private mapStatusToDb(status: Tenant['status']): TenantStatus {
    const mapping: Record<Tenant['status'], TenantStatus> = {
      pending: 'PENDING',
      trial: 'TRIAL',
      active: 'ACTIVE',
      suspended: 'SUSPENDED',
      churned: 'CHURNED',
    };
    return mapping[status] || 'TRIAL';
  }

  private mapDbToTenant(dbTenant: any): Tenant {
    const settings = (dbTenant.settings as any) || {};
    const metadata = (dbTenant.metadata as any) || {};
    
    return {
      id: dbTenant.id,
      name: dbTenant.name,
      slug: dbTenant.slug,
      plan: this.mapPlanFromDb(dbTenant.plan),
      status: this.mapStatusFromDb(dbTenant.status),
      userCount: dbTenant.user_count,
      userLimit: dbTenant.user_limit,
      mrr: Number(dbTenant.mrr) || 0,
      billingEmail: dbTenant.billing_email,
      settings: {
        timezone: settings.timezone || 'UTC',
        dateFormat: settings.dateFormat || 'MM/DD/YYYY',
        currency: settings.currency || 'USD',
        language: settings.language || 'en',
        features: settings.features || this.getDefaultSettings(this.mapPlanFromDb(dbTenant.plan)).features,
        limits: settings.limits || this.getDefaultSettings(this.mapPlanFromDb(dbTenant.plan)).limits,
      },
      metadata: {
        industry: metadata.industry || dbTenant.industry,
        companySize: metadata.companySize || dbTenant.company_size,
        country: metadata.country || dbTenant.country,
        primaryContact: metadata.primaryContact || dbTenant.primary_contact,
        primaryEmail: metadata.primaryEmail || dbTenant.billing_email,
      },
      createdAt: dbTenant.created_at,
      updatedAt: dbTenant.updated_at,
      trialEndsAt: dbTenant.trial_ends_at,
      subscriptionEndsAt: dbTenant.subscription_ends_at,
    };
  }

  private getDefaultSettings(plan: string): TenantSettings {
    const planLimits: Record<string, Partial<TenantSettings['limits']>> = {
      pilot: { maxUsers: 25, maxAgents: 15, maxDeliberationsPerMonth: 100, maxApiCallsPerDay: 5000, storageGb: 50 },
      trial: { maxUsers: 25, maxAgents: 15, maxDeliberationsPerMonth: 50, maxApiCallsPerDay: 1000, storageGb: 5 },
      foundation: { maxUsers: 100, maxAgents: 15, maxDeliberationsPerMonth: 1000, maxApiCallsPerDay: 50000, storageGb: 500 },
      enterprise: { maxUsers: 500, maxAgents: 50, maxDeliberationsPerMonth: -1, maxApiCallsPerDay: -1, storageGb: 5000 },
      strategic: { maxUsers: -1, maxAgents: -1, maxDeliberationsPerMonth: -1, maxApiCallsPerDay: -1, storageGb: -1 },
      custom: { maxUsers: -1, maxAgents: -1, maxDeliberationsPerMonth: -1, maxApiCallsPerDay: -1, storageGb: -1 },
    };

    const planFeatures: Record<string, Partial<TenantSettings['features']>> = {
      pilot: { councilEnabled: true, enterpriseEnabled: false, apiAccess: true, ssoEnabled: false, customBranding: false, advancedAnalytics: false },
      trial: { councilEnabled: true, enterpriseEnabled: false, apiAccess: false, ssoEnabled: false, customBranding: false, advancedAnalytics: false },
      foundation: { councilEnabled: true, enterpriseEnabled: false, apiAccess: true, ssoEnabled: false, customBranding: false, advancedAnalytics: true },
      enterprise: { councilEnabled: true, enterpriseEnabled: true, apiAccess: true, ssoEnabled: true, customBranding: true, advancedAnalytics: true },
      strategic: { councilEnabled: true, enterpriseEnabled: true, apiAccess: true, ssoEnabled: true, customBranding: true, advancedAnalytics: true },
      custom: { councilEnabled: true, enterpriseEnabled: true, apiAccess: true, ssoEnabled: true, customBranding: true, advancedAnalytics: true },
    };

    return {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'en',
      features: planFeatures[plan] as TenantSettings['features'],
      limits: planLimits[plan] as TenantSettings['limits'],
    };
  }

  // ---------------------------------------------------------------------------
  // TENANT CRUD - REAL PRISMA DATABASE QUERIES
  // ---------------------------------------------------------------------------

  async createTenant(data: {
    name: string;
    slug: string;
    plan: Tenant['plan'];
    metadata?: Tenant['metadata'];
  }): Promise<Tenant> {
    try {
      const settings = this.getDefaultSettings(data.plan);
      const dbTenant = await prisma.tenants.create({
        data: {
          name: data.name,
          slug: data.slug,
          plan: this.mapPlanToDb(data.plan),
          status: data.plan === 'trial' ? 'TRIAL' : 'ACTIVE',
          user_count: 0,
          user_limit: settings.limits.maxUsers,
          mrr: this.getPlanMrr(data.plan),
          billing_email: data.metadata?.primaryEmail,
          primary_contact: data.metadata?.primaryContact,
          industry: data.metadata?.industry,
          company_size: data.metadata?.companySize,
          country: data.metadata?.country,
          settings: settings as any,
          metadata: data.metadata as any || {},
          trial_ends_at: data.plan === 'trial' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
        },
      });
      logger.info(`TenantService: Created tenant ${data.name} (${dbTenant.id})`);
      return this.mapDbToTenant(dbTenant);
    } catch (error) {
      logger.error('TenantService: Failed to create tenant', error);
      throw error;
    }
  }

  private getPlanMrr(plan: string): number {
    // Annual licensing converted to MRR (annual / 12)
    const prices: Record<string, number> = {
      pilot: 4167,       // $50K/year
      trial: 0,
      foundation: 12500, // $150K/year (min)
      enterprise: 41667, // $500K/year (min)
      strategic: 166667, // $2M/year (min)
      custom: 0,         // Negotiated
    };
    return prices[plan] || 0;
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    try {
      const dbTenant = await prisma.tenants.findUnique({
        where: { id: tenantId },
      });
      return dbTenant ? this.mapDbToTenant(dbTenant) : null;
    } catch (error) {
      logger.error(`TenantService: Failed to get tenant ${tenantId}`, error);
      return null;
    }
  }

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    try {
      const dbTenant = await prisma.tenants.findUnique({
        where: { slug },
      });
      return dbTenant ? this.mapDbToTenant(dbTenant) : null;
    } catch (error) {
      logger.error(`TenantService: Failed to get tenant by slug ${slug}`, error);
      return null;
    }
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    try {
      const updateData: any = { updated_at: new Date() };
      if (updates.name) updateData.name = updates.name;
      if (updates.plan) updateData.plan = this.mapPlanToDb(updates.plan);
      if (updates.status) updateData.status = this.mapStatusToDb(updates.status);
      if (updates.userLimit) updateData.user_limit = updates.userLimit;
      if (updates.billingEmail) updateData.billing_email = updates.billingEmail;
      if (updates.settings) updateData.settings = updates.settings;
      if (updates.metadata) updateData.metadata = updates.metadata;

      const dbTenant = await prisma.tenants.update({
        where: { id: tenantId },
        data: updateData,
      });
      logger.info(`TenantService: Updated tenant ${tenantId}`);
      return this.mapDbToTenant(dbTenant);
    } catch (error) {
      logger.error(`TenantService: Failed to update tenant ${tenantId}`, error);
      return null;
    }
  }

  async deleteTenant(tenantId: string): Promise<boolean> {
    try {
      await prisma.tenants.update({
        where: { id: tenantId },
        data: { deleted_at: new Date() },
      });
      logger.info(`TenantService: Soft deleted tenant ${tenantId}`);
      return true;
    } catch (error) {
      logger.error(`TenantService: Failed to delete tenant ${tenantId}`, error);
      return false;
    }
  }

  async listTenants(filters?: {
    status?: Tenant['status'];
    plan?: Tenant['plan'];
    search?: string;
  }): Promise<Tenant[]> {
    try {
      const where: any = { deleted_at: null };
      
      if (filters?.status) {
        where.status = this.mapStatusToDb(filters.status);
      }
      if (filters?.plan) {
        where.plan = this.mapPlanToDb(filters.plan);
      }
      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { slug: { contains: filters.search, mode: 'insensitive' } },
          { billing_email: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const dbTenants = await prisma.tenants.findMany({
        where,
        orderBy: { created_at: 'desc' },
      });

      return dbTenants.map(t => this.mapDbToTenant(t));
    } catch (error) {
      logger.error('TenantService: Failed to list tenants', error);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // PLAN MANAGEMENT
  // ---------------------------------------------------------------------------

  async upgradePlan(tenantId: string, newPlan: Tenant['plan']): Promise<Tenant | null> {
    try {
      const settings = this.getDefaultSettings(newPlan);
      const dbTenant = await prisma.tenants.update({
        where: { id: tenantId },
        data: {
          plan: this.mapPlanToDb(newPlan),
          status: 'ACTIVE',
          mrr: this.getPlanMrr(newPlan),
          user_limit: settings.limits.maxUsers,
          settings: settings as any,
          trial_ends_at: null,
          updated_at: new Date(),
        },
      });
      logger.info(`TenantService: Upgraded tenant ${tenantId} to ${newPlan}`);
      return this.mapDbToTenant(dbTenant);
    } catch (error) {
      logger.error(`TenantService: Failed to upgrade tenant ${tenantId}`, error);
      return null;
    }
  }

  async suspendTenant(tenantId: string, _reason: string): Promise<Tenant | null> {
    return this.updateTenant(tenantId, { status: 'suspended' });
  }

  async reactivateTenant(tenantId: string): Promise<Tenant | null> {
    return this.updateTenant(tenantId, { status: 'active' });
  }

  // ---------------------------------------------------------------------------
  // METRICS - REAL DATABASE AGGREGATION
  // ---------------------------------------------------------------------------

  async getMetrics(): Promise<TenantMetrics> {
    try {
      const [counts, mrrResult, userResult] = await Promise.all([
        prisma.tenants.groupBy({
          by: ['status'],
          where: { deleted_at: null },
          _count: { id: true },
        }),
        prisma.tenants.aggregate({
          where: { deleted_at: null },
          _sum: { mrr: true },
          _count: { id: true },
        }),
        prisma.tenants.aggregate({
          where: { deleted_at: null },
          _sum: { user_count: true },
        }),
      ]);

      const statusCounts: Record<string, number> = {};
      counts.forEach(c => {
        statusCounts[c.status] = c._count.id;
      });

      const totalMrr = Number(mrrResult._sum.mrr) || 0;
      const totalTenants = mrrResult._count.id || 0;
      const paidTenants = (statusCounts['ACTIVE'] || 0) + (statusCounts['ENTERPRISE'] || 0);

      return {
        totalTenants,
        activeTenants: statusCounts['ACTIVE'] || 0,
        trialTenants: statusCounts['TRIAL'] || 0,
        churnedTenants: statusCounts['CHURNED'] || 0,
        totalMrr,
        avgRevenuePerTenant: paidTenants > 0 ? totalMrr / paidTenants : 0,
        totalUsers: Number(userResult._sum.user_count) || 0,
      };
    } catch (error) {
      logger.error('TenantService: Failed to get metrics', error);
      return {
        totalTenants: 0,
        activeTenants: 0,
        trialTenants: 0,
        churnedTenants: 0,
        totalMrr: 0,
        avgRevenuePerTenant: 0,
        totalUsers: 0,
      };
    }
  }

  // ---------------------------------------------------------------------------
  // USAGE TRACKING - REAL DATABASE
  // ---------------------------------------------------------------------------

  async recordUsage(tenantId: string, metrics: Partial<TenantUsage>): Promise<void> {
    try {
      const period = new Date().toISOString().slice(0, 7);
      
      await prisma.tenant_usage.upsert({
        where: {
          tenant_id_period: { tenant_id: tenantId, period },
        },
        update: {
          api_calls: metrics.apiCalls ? { increment: metrics.apiCalls } : undefined,
          deliberations: metrics.deliberations ? { increment: metrics.deliberations } : undefined,
          active_users: metrics.activeUsers,
          storage_used_mb: metrics.storageUsedGb ? Math.round(metrics.storageUsedGb * 1024) : undefined,
          agent_invocations: metrics.agentInvocations ? { increment: metrics.agentInvocations } : undefined,
          updated_at: new Date(),
        },
        create: {
          tenant_id: tenantId,
          period,
          api_calls: metrics.apiCalls || 0,
          deliberations: metrics.deliberations || 0,
          active_users: metrics.activeUsers || 0,
          storage_used_mb: metrics.storageUsedGb ? Math.round(metrics.storageUsedGb * 1024) : 0,
          agent_invocations: metrics.agentInvocations || 0,
        },
      });
    } catch (error) {
      logger.error(`TenantService: Failed to record usage for ${tenantId}`, error);
    }
  }

  async getUsage(tenantId: string, months: number = 6): Promise<TenantUsage[]> {
    try {
      const dbUsage = await prisma.tenant_usage.findMany({
        where: { tenant_id: tenantId },
        orderBy: { period: 'desc' },
        take: months,
      });

      return dbUsage.map(u => ({
        tenantId: u.tenant_id,
        period: u.period,
        apiCalls: u.api_calls,
        deliberations: u.deliberations,
        activeUsers: u.active_users,
        storageUsedGb: u.storage_used_mb / 1024,
        agentInvocations: u.agent_invocations,
      }));
    } catch (error) {
      logger.error(`TenantService: Failed to get usage for ${tenantId}`, error);
      return [];
    }
  }
}

export const tenantService = new TenantService();
export default tenantService;
