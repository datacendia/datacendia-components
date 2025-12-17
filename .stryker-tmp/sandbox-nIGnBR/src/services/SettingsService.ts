// @ts-nocheck
// =============================================================================
// SETTINGS SERVICE - Client Admin API Client
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
const API_BASE = stryMutAct_9fa48("69594") ? import.meta.env.VITE_API_URL && (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1') : stryMutAct_9fa48("69593") ? false : stryMutAct_9fa48("69592") ? true : (stryCov_9fa48("69592", "69593", "69594"), import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1'));

// =============================================================================
// TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  department?: string;
  title?: string;
  lastLoginAt?: string;
  createdAt: string;
  mfaEnabled: boolean;
}
export interface Team {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  leaderId?: string;
  createdAt: string;
}
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}
export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  lastUsedAt?: string;
  status: 'active' | 'revoked';
  createdAt: string;
}
export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  settings: {
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  metadata: {
    industry?: string;
    companySize?: string;
    primaryContact?: string;
    primaryEmail?: string;
  };
  userCount: number;
  userLimit: number;
}
export interface BillingInfo {
  plan: string;
  mrr: number;
  userCount: number;
  userLimit: number;
  nextBillingDate: string;
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
  }>;
}
export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}
export interface Preferences {
  notifications: {
    email: boolean;
    slack: boolean;
    deliberationComplete: boolean;
    weeklyDigest: boolean;
    alertsOnly: boolean;
  };
  display: {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
  };
  council: {
    defaultMode: string;
    autoSave: boolean;
    streamResponses: boolean;
    showConfidenceScores: boolean;
  };
}
export interface SecuritySettings {
  sso: {
    enabled: boolean;
    provider: string | null;
    domain: string | null;
  };
  mfa: {
    enforced: boolean;
    enabledUsers: number;
    totalUsers: number;
  };
  sessions: {
    maxConcurrent: number;
    sessionTimeout: number;
    requireReauth: boolean;
  };
  ipWhitelist: {
    enabled: boolean;
    addresses: string[];
  };
  auditLog: {
    enabled: boolean;
    retentionDays: number;
  };
}

// =============================================================================
// API CLIENT
// =============================================================================

class SettingsService {
  private baseUrl = `${API_BASE}/settings`;
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, stryMutAct_9fa48("69600") ? {} : (stryCov_9fa48("69600"), {
      headers: stryMutAct_9fa48("69601") ? {} : (stryCov_9fa48("69601"), {
        'Content-Type': 'application/json'
        // Add auth token here in production
      }),
      ...options
    }));
    if (stryMutAct_9fa48("69605") ? false : stryMutAct_9fa48("69604") ? true : stryMutAct_9fa48("69603") ? response.ok : (stryCov_9fa48("69603", "69604", "69605"), !response.ok)) {
      const error = await response.json().catch(stryMutAct_9fa48("69607") ? () => undefined : (stryCov_9fa48("69607"), () => stryMutAct_9fa48("69608") ? {} : (stryCov_9fa48("69608"), {
        error: 'Request failed'
      })));
      throw new Error(stryMutAct_9fa48("69612") ? error.error && `HTTP ${response.status}` : stryMutAct_9fa48("69611") ? false : stryMutAct_9fa48("69610") ? true : (stryCov_9fa48("69610", "69611", "69612"), error.error || `HTTP ${response.status}`));
    }
    return response.json();
  }

  // ---------------------------------------------------------------------------
  // ORGANIZATION
  // ---------------------------------------------------------------------------

  async getOrganization(): Promise<Organization> {
    return this.request('/organization');
  }
  async updateOrganization(updates: Partial<Organization>): Promise<Organization> {
    return this.request('/organization', stryMutAct_9fa48("69618") ? {} : (stryCov_9fa48("69618"), {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }));
  }

  // ---------------------------------------------------------------------------
  // USERS
  // ---------------------------------------------------------------------------

  async listUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{
    users: User[];
    total: number;
    metrics: any;
  }> {
    const params = new URLSearchParams();
    if (stryMutAct_9fa48("69623") ? filters.role : stryMutAct_9fa48("69622") ? false : stryMutAct_9fa48("69621") ? true : (stryCov_9fa48("69621", "69622", "69623"), filters?.role)) {
      params.append('role', filters.role);
    }
    if (stryMutAct_9fa48("69628") ? filters.status : stryMutAct_9fa48("69627") ? false : stryMutAct_9fa48("69626") ? true : (stryCov_9fa48("69626", "69627", "69628"), filters?.status)) {
      params.append('status', filters.status);
    }
    if (stryMutAct_9fa48("69633") ? filters.search : stryMutAct_9fa48("69632") ? false : stryMutAct_9fa48("69631") ? true : (stryCov_9fa48("69631", "69632", "69633"), filters?.search)) {
      params.append('search', filters.search);
    }
    const query = params.toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }
  async getUser(id: string): Promise<User> {
    return this.request(`/users/${id}`);
  }
  async createUser(data: {
    email: string;
    name: string;
    role: string;
    department?: string;
    title?: string;
  }): Promise<User> {
    return this.request('/users', stryMutAct_9fa48("69643") ? {} : (stryCov_9fa48("69643"), {
      method: 'POST',
      body: JSON.stringify(data)
    }));
  }
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return this.request(`/users/${id}`, stryMutAct_9fa48("69647") ? {} : (stryCov_9fa48("69647"), {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }));
  }
  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, stryMutAct_9fa48("69651") ? {} : (stryCov_9fa48("69651"), {
      method: 'DELETE'
    }));
  }
  async resendInvite(userId: string): Promise<void> {
    await this.request(`/users/${userId}/resend-invite`, stryMutAct_9fa48("69655") ? {} : (stryCov_9fa48("69655"), {
      method: 'POST'
    }));
  }

  // ---------------------------------------------------------------------------
  // TEAMS
  // ---------------------------------------------------------------------------

  async listTeams(): Promise<{
    teams: Team[];
    total: number;
  }> {
    return this.request('/teams');
  }
  async getTeam(id: string): Promise<Team> {
    return this.request(`/teams/${id}`);
  }
  async createTeam(data: {
    name: string;
    description?: string;
    leaderId?: string;
    memberIds?: string[];
  }): Promise<Team> {
    return this.request('/teams', stryMutAct_9fa48("69663") ? {} : (stryCov_9fa48("69663"), {
      method: 'POST',
      body: JSON.stringify(data)
    }));
  }
  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    return this.request(`/teams/${id}`, stryMutAct_9fa48("69667") ? {} : (stryCov_9fa48("69667"), {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }));
  }
  async deleteTeam(id: string): Promise<void> {
    await this.request(`/teams/${id}`, stryMutAct_9fa48("69671") ? {} : (stryCov_9fa48("69671"), {
      method: 'DELETE'
    }));
  }
  async addTeamMember(teamId: string, userId: string): Promise<Team> {
    return this.request(`/teams/${teamId}/members`, stryMutAct_9fa48("69675") ? {} : (stryCov_9fa48("69675"), {
      method: 'POST',
      body: JSON.stringify(stryMutAct_9fa48("69677") ? {} : (stryCov_9fa48("69677"), {
        userId
      }))
    }));
  }
  async removeTeamMember(teamId: string, userId: string): Promise<Team> {
    return this.request(`/teams/${teamId}/members/${userId}`, stryMutAct_9fa48("69680") ? {} : (stryCov_9fa48("69680"), {
      method: 'DELETE'
    }));
  }

  // ---------------------------------------------------------------------------
  // ROLES
  // ---------------------------------------------------------------------------

  async listRoles(): Promise<{
    roles: Role[];
    total: number;
  }> {
    return this.request('/roles');
  }
  async createRole(data: {
    name: string;
    description: string;
    permissions: string[];
  }): Promise<Role> {
    return this.request('/roles', stryMutAct_9fa48("69686") ? {} : (stryCov_9fa48("69686"), {
      method: 'POST',
      body: JSON.stringify(data)
    }));
  }
  async deleteRole(id: string): Promise<void> {
    await this.request(`/roles/${id}`, stryMutAct_9fa48("69690") ? {} : (stryCov_9fa48("69690"), {
      method: 'DELETE'
    }));
  }

  // ---------------------------------------------------------------------------
  // API KEYS
  // ---------------------------------------------------------------------------

  async listApiKeys(): Promise<{
    apiKeys: ApiKey[];
    total: number;
  }> {
    return this.request('/api-keys');
  }
  async createApiKey(data: {
    name: string;
    permissions: string[];
    expiresAt?: string;
  }): Promise<{
    apiKey: ApiKey;
    fullKey: string;
    warning: string;
  }> {
    return this.request('/api-keys', stryMutAct_9fa48("69696") ? {} : (stryCov_9fa48("69696"), {
      method: 'POST',
      body: JSON.stringify(data)
    }));
  }
  async revokeApiKey(id: string): Promise<void> {
    await this.request(`/api-keys/${id}`, stryMutAct_9fa48("69700") ? {} : (stryCov_9fa48("69700"), {
      method: 'DELETE'
    }));
  }

  // ---------------------------------------------------------------------------
  // BILLING
  // ---------------------------------------------------------------------------

  async getBilling(): Promise<BillingInfo> {
    return this.request('/billing');
  }

  // ---------------------------------------------------------------------------
  // INTEGRATIONS
  // ---------------------------------------------------------------------------

  async getIntegrations(): Promise<{
    available: Integration[];
    configured: Array<{
      id: string;
      status: string;
      configuredAt: string;
    }>;
  }> {
    return this.request('/integrations');
  }

  // ---------------------------------------------------------------------------
  // PREFERENCES
  // ---------------------------------------------------------------------------

  async getPreferences(): Promise<Preferences> {
    return this.request('/preferences');
  }
  async updatePreferences(updates: Partial<Preferences>): Promise<Preferences> {
    return this.request('/preferences', stryMutAct_9fa48("69710") ? {} : (stryCov_9fa48("69710"), {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }));
  }

  // ---------------------------------------------------------------------------
  // SECURITY
  // ---------------------------------------------------------------------------

  async getSecuritySettings(): Promise<SecuritySettings> {
    return this.request('/security');
  }
  async updateSecuritySettings(updates: Partial<SecuritySettings>): Promise<SecuritySettings> {
    return this.request('/security', stryMutAct_9fa48("69716") ? {} : (stryCov_9fa48("69716"), {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }));
  }
}
export const settingsService = new SettingsService();
export default settingsService;