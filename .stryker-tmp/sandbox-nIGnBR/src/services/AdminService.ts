// @ts-nocheck
// =============================================================================
// ADMIN SERVICE - Platform Owner Admin API Client
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
const API_BASE = stryMutAct_9fa48("66003") ? import.meta.env.VITE_API_URL && (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1') : stryMutAct_9fa48("66002") ? false : stryMutAct_9fa48("66001") ? true : (stryCov_9fa48("66001", "66002", "66003"), import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1'));

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
  metadata: {
    industry?: string;
    companySize?: string;
    country?: string;
    primaryContact?: string;
    primaryEmail?: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface LicenseFeatures {
  pillars?: number;
  agents?: number;
  maxUsers?: number;
  maxDeliberationsPerMonth?: number;
  guardianSuite?: boolean;
  sovereignDeployment?: boolean;
  customIntegrations?: boolean;
}
export interface License {
  id: string;
  tenantId: string;
  tenantName: string;
  type: 'trial' | 'foundation' | 'intelligence' | 'governance' | 'sovereign';
  status: 'active' | 'expiring' | 'expired' | 'suspended';
  startDate: string;
  expiresAt: string;
  features: string | LicenseFeatures;
  autoRenew: boolean;
  renewalPrice?: number;
}
export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  lastCheck: string;
}
export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  uptime: number;
}
export interface PlatformDashboard {
  tenants: {
    total: number;
    active: number;
    trial: number;
    churned: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    avgPerTenant: number;
  };
  licenses: {
    total: number;
    active: number;
    expiring: number;
    revenueAtRisk: number;
  };
  system: {
    status: string;
    apiRequests24h: number;
    avgLatency: number;
    errorRate: number;
  };
  users: {
    total: number;
  };
  recentActivity: Array<{
    event: string;
    tenant: string;
    time: string;
    isAlert?: boolean;
  }>;
  lastUpdated: string;
}
export interface HealthDashboard {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  services: ServiceHealth[];
  system: SystemMetrics;
  api: {
    totalRequests24h: number;
    avgLatency: number;
    p95Latency: number;
    errorRate: number;
    requestsByEndpoint: Record<string, number>;
    requestsByStatus: Record<number, number>;
  };
  alerts: Array<{
    id: string;
    severity: string;
    service: string;
    message: string;
    createdAt: string;
  }>;
}

// =============================================================================
// API CLIENT
// =============================================================================

class AdminService {
  private baseUrl = `${API_BASE}/admin`;
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, stryMutAct_9fa48("66009") ? {} : (stryCov_9fa48("66009"), {
      headers: stryMutAct_9fa48("66010") ? {} : (stryCov_9fa48("66010"), {
        'Content-Type': 'application/json'
        // Add auth token here in production
      }),
      ...options
    }));
    if (stryMutAct_9fa48("66014") ? false : stryMutAct_9fa48("66013") ? true : stryMutAct_9fa48("66012") ? response.ok : (stryCov_9fa48("66012", "66013", "66014"), !response.ok)) {
      const error = await response.json().catch(stryMutAct_9fa48("66016") ? () => undefined : (stryCov_9fa48("66016"), () => stryMutAct_9fa48("66017") ? {} : (stryCov_9fa48("66017"), {
        error: 'Request failed'
      })));
      throw new Error(stryMutAct_9fa48("66021") ? error.error && `HTTP ${response.status}` : stryMutAct_9fa48("66020") ? false : stryMutAct_9fa48("66019") ? true : (stryCov_9fa48("66019", "66020", "66021"), error.error || `HTTP ${response.status}`));
    }
    return response.json();
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------------------------

  async getDashboard(): Promise<PlatformDashboard> {
    return this.request('/dashboard');
  }

  // ---------------------------------------------------------------------------
  // TENANTS
  // ---------------------------------------------------------------------------

  async listTenants(filters?: {
    status?: string;
    plan?: string;
    search?: string;
  }): Promise<{
    tenants: Tenant[];
    total: number;
  }> {
    const params = new URLSearchParams();
    if (stryMutAct_9fa48("66028") ? filters.status : stryMutAct_9fa48("66027") ? false : stryMutAct_9fa48("66026") ? true : (stryCov_9fa48("66026", "66027", "66028"), filters?.status)) {
      params.append('status', filters.status);
    }
    if (stryMutAct_9fa48("66033") ? filters.plan : stryMutAct_9fa48("66032") ? false : stryMutAct_9fa48("66031") ? true : (stryCov_9fa48("66031", "66032", "66033"), filters?.plan)) {
      params.append('plan', filters.plan);
    }
    if (stryMutAct_9fa48("66038") ? filters.search : stryMutAct_9fa48("66037") ? false : stryMutAct_9fa48("66036") ? true : (stryCov_9fa48("66036", "66037", "66038"), filters?.search)) {
      params.append('search', filters.search);
    }
    const query = params.toString();
    return this.request(`/tenants${query ? `?${query}` : ''}`);
  }
  async getTenant(id: string): Promise<Tenant> {
    return this.request(`/tenants/${id}`);
  }
  async createTenant(data: {
    name: string;
    slug: string;
    plan: string;
    metadata?: Partial<Tenant['metadata']>;
  }): Promise<Tenant> {
    return this.request('/tenants', stryMutAct_9fa48("66048") ? {} : (stryCov_9fa48("66048"), {
      method: 'POST',
      body: JSON.stringify(data)
    }));
  }
  async updateTenant(id: string, updates: Partial<Tenant>): Promise<Tenant> {
    return this.request(`/tenants/${id}`, stryMutAct_9fa48("66052") ? {} : (stryCov_9fa48("66052"), {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }));
  }
  async upgradeTenant(id: string, plan: string): Promise<Tenant> {
    return this.request(`/tenants/${id}/upgrade`, stryMutAct_9fa48("66056") ? {} : (stryCov_9fa48("66056"), {
      method: 'POST',
      body: JSON.stringify(stryMutAct_9fa48("66058") ? {} : (stryCov_9fa48("66058"), {
        plan
      }))
    }));
  }
  async suspendTenant(id: string, reason: string): Promise<Tenant> {
    return this.request(`/tenants/${id}/suspend`, stryMutAct_9fa48("66061") ? {} : (stryCov_9fa48("66061"), {
      method: 'POST',
      body: JSON.stringify(stryMutAct_9fa48("66063") ? {} : (stryCov_9fa48("66063"), {
        reason
      }))
    }));
  }

  // ---------------------------------------------------------------------------
  // LICENSES
  // ---------------------------------------------------------------------------

  async listLicenses(filters?: {
    status?: string;
    type?: string;
  }): Promise<{
    licenses: License[];
    total: number;
  }> {
    const params = new URLSearchParams();
    if (stryMutAct_9fa48("66067") ? filters.status : stryMutAct_9fa48("66066") ? false : stryMutAct_9fa48("66065") ? true : (stryCov_9fa48("66065", "66066", "66067"), filters?.status)) {
      params.append('status', filters.status);
    }
    if (stryMutAct_9fa48("66072") ? filters.type : stryMutAct_9fa48("66071") ? false : stryMutAct_9fa48("66070") ? true : (stryCov_9fa48("66070", "66071", "66072"), filters?.type)) {
      params.append('type', filters.type);
    }
    const query = params.toString();
    return this.request(`/licenses${query ? `?${query}` : ''}`);
  }
  async getLicense(id: string): Promise<License> {
    return this.request(`/licenses/${id}`);
  }
  async extendLicense(id: string, months: number): Promise<License> {
    return this.request(`/licenses/${id}/extend`, stryMutAct_9fa48("66082") ? {} : (stryCov_9fa48("66082"), {
      method: 'POST',
      body: JSON.stringify(stryMutAct_9fa48("66084") ? {} : (stryCov_9fa48("66084"), {
        months
      }))
    }));
  }
  async upgradeLicense(id: string, type: string): Promise<License> {
    return this.request(`/licenses/${id}/upgrade`, stryMutAct_9fa48("66087") ? {} : (stryCov_9fa48("66087"), {
      method: 'POST',
      body: JSON.stringify(stryMutAct_9fa48("66089") ? {} : (stryCov_9fa48("66089"), {
        type
      }))
    }));
  }

  // ---------------------------------------------------------------------------
  // SYSTEM HEALTH
  // ---------------------------------------------------------------------------

  async getHealthDashboard(): Promise<HealthDashboard> {
    return this.request('/health');
  }
  async getServiceHealth(): Promise<{
    services: ServiceHealth[];
  }> {
    return this.request('/health/services');
  }
  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.request('/health/system');
  }
  async getApiMetrics(): Promise<HealthDashboard['api']> {
    return this.request('/health/api');
  }
  async acknowledgeAlert(alertId: string): Promise<void> {
    await this.request(`/health/alerts/${alertId}/acknowledge`, stryMutAct_9fa48("66100") ? {} : (stryCov_9fa48("66100"), {
      method: 'POST'
    }));
  }
}
export const adminService = new AdminService();
export default adminService;