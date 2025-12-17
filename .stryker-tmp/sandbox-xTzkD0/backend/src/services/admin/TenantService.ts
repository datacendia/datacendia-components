// @ts-nocheck
// =============================================================================
// TENANT MANAGEMENT SERVICE
// Platform-level tenant/organization management
// =============================================================================

import { logger } from '../../utils/logger.js';
import { Pool } from 'pg';
import { config } from '../../config/index.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'trial' | 'foundation' | 'intelligence' | 'governance' | 'sovereign';
  status: 'trial' | 'active' | 'suspended' | 'churned';
  userCount: number;
  userLimit: number;
  mrr: number;
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
  period: string; // YYYY-MM
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
// TENANT SERVICE
// =============================================================================

class TenantService {
  private pool: Pool;
  private tenants: Map<string, Tenant> = new Map();
  private usage: Map<string, TenantUsage[]> = new Map();

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Initialize with real-looking tenant data for demo
    // In production, this would be loaded from PostgreSQL
    const sampleTenants: Tenant[] = [
      {
        id: 'tenant_acme_2024',
        name: 'Acme Corporation',
        slug: 'acme',
        plan: 'sovereign',
        status: 'active',
        userCount: 145,
        userLimit: 200,
        mrr: 25000,
        settings: this.getDefaultSettings('sovereign'),
        metadata: {
          industry: 'technology',
          companySize: '501-1000',
          country: 'US',
          primaryContact: 'John Smith',
          primaryEmail: 'john@acme.com',
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        subscriptionEndsAt: new Date('2025-12-31'),
      },
      {
        id: 'tenant_techstart_2024',
        name: 'TechStart Inc',
        slug: 'techstart',
        plan: 'intelligence',
        status: 'active',
        userCount: 32,
        userLimit: 50,
        mrr: 10000,
        settings: this.getDefaultSettings('intelligence'),
        metadata: {
          industry: 'software',
          companySize: '51-200',
          country: 'US',
          primaryContact: 'Sarah Chen',
          primaryEmail: 'sarah@techstart.io',
        },
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date(),
        subscriptionEndsAt: new Date('2026-01-15'),
      },
      {
        id: 'tenant_globalco_2024',
        name: 'GlobalCo',
        slug: 'globalco',
        plan: 'governance',
        status: 'active',
        userCount: 89,
        userLimit: 100,
        mrr: 15000,
        settings: this.getDefaultSettings('governance'),
        metadata: {
          industry: 'finance',
          companySize: '1001-5000',
          country: 'UK',
          primaryContact: 'James Wilson',
          primaryEmail: 'james@globalco.com',
        },
        createdAt: new Date('2024-03-22'),
        updatedAt: new Date(),
        subscriptionEndsAt: new Date('2025-12-05'),
      },
      {
        id: 'tenant_healthtech_2024',
        name: 'HealthTech Labs',
        slug: 'healthtech',
        plan: 'trial',
        status: 'trial',
        userCount: 12,
        userLimit: 25,
        mrr: 0,
        settings: this.getDefaultSettings('trial'),
        metadata: {
          industry: 'healthcare',
          companySize: '11-50',
          country: 'US',
          primaryContact: 'Dr. Emily Davis',
          primaryEmail: 'emily@healthtechlabs.com',
        },
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date(),
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      {
        id: 'tenant_financeFirst_2024',
        name: 'FinanceFirst',
        slug: 'financefirst',
        plan: 'intelligence',
        status: 'active',
        userCount: 54,
        userLimit: 75,
        mrr: 10000,
        settings: this.getDefaultSettings('intelligence'),
        metadata: {
          industry: 'financial_services',
          companySize: '201-500',
          country: 'US',
          primaryContact: 'Mike Thompson',
          primaryEmail: 'mike@financefirst.com',
        },
        createdAt: new Date('2024-04-08'),
        updatedAt: new Date(),
        subscriptionEndsAt: new Date('2025-04-08'),
      },
    ];

    sampleTenants.forEach(t => this.tenants.set(t.id, t));
    logger.info(`TenantService: Initialized with ${sampleTenants.length} tenants`);
  }

  private getDefaultSettings(plan: string): TenantSettings {
    const planLimits: Record<string, Partial<TenantSettings['limits']>> = {
      trial: { maxUsers: 25, maxAgents: 3, maxDeliberationsPerMonth: 50, maxApiCallsPerDay: 1000, storageGb: 5 },
      foundation: { maxUsers: 50, maxAgents: 5, maxDeliberationsPerMonth: 200, maxApiCallsPerDay: 10000, storageGb: 25 },
      intelligence: { maxUsers: 100, maxAgents: 8, maxDeliberationsPerMonth: 500, maxApiCallsPerDay: 50000, storageGb: 100 },
      governance: { maxUsers: 200, maxAgents: 12, maxDeliberationsPerMonth: 1000, maxApiCallsPerDay: 100000, storageGb: 250 },
      sovereign: { maxUsers: 500, maxAgents: 26, maxDeliberationsPerMonth: -1, maxApiCallsPerDay: -1, storageGb: 1000 },
    };

    const planFeatures: Record<string, Partial<TenantSettings['features']>> = {
      trial: { councilEnabled: true, enterpriseEnabled: false, apiAccess: false, ssoEnabled: false, customBranding: false, advancedAnalytics: false },
      foundation: { councilEnabled: true, enterpriseEnabled: false, apiAccess: true, ssoEnabled: false, customBranding: false, advancedAnalytics: false },
      intelligence: { councilEnabled: true, enterpriseEnabled: true, apiAccess: true, ssoEnabled: false, customBranding: true, advancedAnalytics: true },
      governance: { councilEnabled: true, enterpriseEnabled: true, apiAccess: true, ssoEnabled: true, customBranding: true, advancedAnalytics: true },
      sovereign: { councilEnabled: true, enterpriseEnabled: true, apiAccess: true, ssoEnabled: true, customBranding: true, advancedAnalytics: true },
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
  // TENANT CRUD
  // ---------------------------------------------------------------------------

  async createTenant(data: {
    name: string;
    slug: string;
    plan: Tenant['plan'];
    metadata?: Tenant['metadata'];
  }): Promise<Tenant> {
    const tenant: Tenant = {
      id: `tenant_${data.slug}_${Date.now()}`,
      name: data.name,
      slug: data.slug,
      plan: data.plan,
      status: data.plan === 'trial' ? 'trial' : 'active',
      userCount: 0,
      userLimit: this.getDefaultSettings(data.plan).limits.maxUsers,
      mrr: this.getPlanMrr(data.plan),
      settings: this.getDefaultSettings(data.plan),
      metadata: data.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      trialEndsAt: data.plan === 'trial' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : undefined,
    };

    this.tenants.set(tenant.id, tenant);
    logger.info(`TenantService: Created tenant ${tenant.name} (${tenant.id})`);
    
    return tenant;
  }

  private getPlanMrr(plan: string): number {
    const prices: Record<string, number> = {
      trial: 0,
      foundation: 5000,
      intelligence: 10000,
      governance: 15000,
      sovereign: 25000,
    };
    return prices[plan] || 0;
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    return this.tenants.get(tenantId) || null;
  }

  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    for (const tenant of this.tenants.values()) {
      if (tenant.slug === slug) return tenant;
    }
    return null;
  }

  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant | null> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const updated = {
      ...tenant,
      ...updates,
      updatedAt: new Date(),
    };
    this.tenants.set(tenantId, updated);
    logger.info(`TenantService: Updated tenant ${tenantId}`);
    
    return updated;
  }

  async deleteTenant(tenantId: string): Promise<boolean> {
    const deleted = this.tenants.delete(tenantId);
    if (deleted) {
      logger.info(`TenantService: Deleted tenant ${tenantId}`);
    }
    return deleted;
  }

  async listTenants(filters?: {
    status?: Tenant['status'];
    plan?: Tenant['plan'];
    search?: string;
  }): Promise<Tenant[]> {
    let tenants = Array.from(this.tenants.values());

    if (filters?.status) {
      tenants = tenants.filter(t => t.status === filters.status);
    }
    if (filters?.plan) {
      tenants = tenants.filter(t => t.plan === filters.plan);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      tenants = tenants.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.slug.toLowerCase().includes(search) ||
        t.metadata.primaryEmail?.toLowerCase().includes(search)
      );
    }

    return tenants.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ---------------------------------------------------------------------------
  // PLAN MANAGEMENT
  // ---------------------------------------------------------------------------

  async upgradePlan(tenantId: string, newPlan: Tenant['plan']): Promise<Tenant | null> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) return null;

    const updated = {
      ...tenant,
      plan: newPlan,
      status: 'active' as const,
      mrr: this.getPlanMrr(newPlan),
      settings: this.getDefaultSettings(newPlan),
      userLimit: this.getDefaultSettings(newPlan).limits.maxUsers,
      updatedAt: new Date(),
      trialEndsAt: undefined,
    };
    this.tenants.set(tenantId, updated);
    logger.info(`TenantService: Upgraded tenant ${tenantId} to ${newPlan}`);
    
    return updated;
  }

  async suspendTenant(tenantId: string, reason: string): Promise<Tenant | null> {
    return this.updateTenant(tenantId, { status: 'suspended' });
  }

  async reactivateTenant(tenantId: string): Promise<Tenant | null> {
    return this.updateTenant(tenantId, { status: 'active' });
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): TenantMetrics {
    const tenants = Array.from(this.tenants.values());
    
    return {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'active').length,
      trialTenants: tenants.filter(t => t.status === 'trial').length,
      churnedTenants: tenants.filter(t => t.status === 'churned').length,
      totalMrr: tenants.reduce((sum, t) => sum + t.mrr, 0),
      avgRevenuePerTenant: tenants.length > 0 
        ? tenants.reduce((sum, t) => sum + t.mrr, 0) / tenants.filter(t => t.mrr > 0).length 
        : 0,
      totalUsers: tenants.reduce((sum, t) => sum + t.userCount, 0),
    };
  }

  // ---------------------------------------------------------------------------
  // USAGE TRACKING
  // ---------------------------------------------------------------------------

  async recordUsage(tenantId: string, metrics: Partial<TenantUsage>): Promise<void> {
    const period = new Date().toISOString().slice(0, 7); // YYYY-MM
    const existing = this.usage.get(tenantId) || [];
    
    let current = existing.find(u => u.period === period);
    if (!current) {
      current = {
        tenantId,
        period,
        apiCalls: 0,
        deliberations: 0,
        activeUsers: 0,
        storageUsedGb: 0,
        agentInvocations: 0,
      };
      existing.push(current);
    }

    if (metrics.apiCalls) current.apiCalls += metrics.apiCalls;
    if (metrics.deliberations) current.deliberations += metrics.deliberations;
    if (metrics.activeUsers) current.activeUsers = metrics.activeUsers;
    if (metrics.storageUsedGb) current.storageUsedGb = metrics.storageUsedGb;
    if (metrics.agentInvocations) current.agentInvocations += metrics.agentInvocations;

    this.usage.set(tenantId, existing);
  }

  async getUsage(tenantId: string, months: number = 6): Promise<TenantUsage[]> {
    const usage = this.usage.get(tenantId) || [];
    return usage.slice(-months);
  }
}

export const tenantService = new TenantService();
export default tenantService;
