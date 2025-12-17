// @ts-nocheck
// =============================================================================
// ADMIN SERVICES INDEX
// Platform administration services
// =============================================================================

export { tenantService, type Tenant, type TenantSettings, type TenantMetrics } from './TenantService.js';
export { userManagementService, type User, type Team, type Role, type ApiKey } from './UserManagementService.js';
export { licenseService, type License, type LicenseFeatures } from './LicenseService.js';
export { systemHealthService, type HealthDashboard, type ServiceHealth, type SystemMetrics } from './SystemHealthService.js';
export { featureControlService, type FeatureConfig, type AgentConfig, type SuiteConfig, type PricingTier } from './FeatureControlService.js';
export { rdProjectService, type RDProject, type RDMilestone, type RDProjectInput } from './RDProjectService.js';
export { adminAIService, type AdminAIResponse, type AdminCommand, type ConversationMessage } from './AdminAIService.js';

// =============================================================================
// ADMIN DASHBOARD AGGREGATION
// =============================================================================

import { tenantService } from './TenantService.js';
import { licenseService } from './LicenseService.js';
import { systemHealthService } from './SystemHealthService.js';

export interface PlatformDashboard {
  // Tenants
  tenants: {
    total: number;
    active: number;
    trial: number;
    churned: number;
  };
  // Revenue
  revenue: {
    mrr: number;
    arr: number;
    avgPerTenant: number;
  };
  // Licenses
  licenses: {
    total: number;
    active: number;
    expiring: number;
    revenueAtRisk: number;
  };
  // System
  system: {
    status: 'healthy' | 'degraded' | 'critical';
    apiRequests24h: number;
    avgLatency: number;
    errorRate: number;
  };
  // Users
  users: {
    total: number;
  };
  // Activity
  recentActivity: Array<{
    event: string;
    tenant: string;
    time: Date;
    isAlert?: boolean;
  }>;
  // Timestamp
  lastUpdated: Date;
}

export async function getPlatformDashboard(): Promise<PlatformDashboard> {
  const tenantMetrics = tenantService.getMetrics();
  const licenseMetrics = licenseService.getMetrics();
  const healthDashboard = await systemHealthService.getDashboard();

  return {
    tenants: {
      total: tenantMetrics.totalTenants,
      active: tenantMetrics.activeTenants,
      trial: tenantMetrics.trialTenants,
      churned: tenantMetrics.churnedTenants,
    },
    revenue: {
      mrr: tenantMetrics.totalMrr,
      arr: tenantMetrics.totalMrr * 12,
      avgPerTenant: tenantMetrics.avgRevenuePerTenant,
    },
    licenses: {
      total: licenseMetrics.totalLicenses,
      active: licenseMetrics.activeLicenses,
      expiring: licenseMetrics.expiringLicenses,
      revenueAtRisk: licenseMetrics.revenueAtRisk,
    },
    system: {
      status: healthDashboard.overallStatus,
      apiRequests24h: healthDashboard.api.totalRequests24h,
      avgLatency: healthDashboard.api.avgLatency,
      errorRate: healthDashboard.api.errorRate,
    },
    users: {
      total: tenantMetrics.totalUsers,
    },
    recentActivity: [
      { event: 'New tenant created', tenant: 'HealthTech Labs', time: new Date(Date.now() - 1800000) },
      { event: 'License upgraded', tenant: 'TechStart Inc', time: new Date(Date.now() - 3600000) },
      { event: 'User limit warning', tenant: 'GlobalCo', time: new Date(Date.now() - 7200000), isAlert: true },
      { event: 'SSO configured', tenant: 'FinanceFirst', time: new Date(Date.now() - 14400000) },
      { event: 'API key created', tenant: 'Acme Corporation', time: new Date(Date.now() - 28800000) },
    ],
    lastUpdated: new Date(),
  };
}
