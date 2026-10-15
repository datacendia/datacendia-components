/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports PlatformDashboard
 * @module services/admin/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

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


// The platform dashboard is computed from the database (tenants, licenses,
// users, audit log); see platformDashboard.ts.
export { getPlatformDashboard, type PlatformDashboard } from './platformDashboard.js';
