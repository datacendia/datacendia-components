// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// USER MANAGEMENT SERVICE
// Organization-level user management for tenants
// =============================================================================

import { logger } from '../../utils/logger.js';
import { Pool } from 'pg';
import { config } from '../../config/index.js';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  avatar?: string;
  department?: string;
  title?: string;
  permissions: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  invitedBy?: string;
  mfaEnabled: boolean;
}

export interface Team {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  memberIds: string[];
  leaderId?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean; // System roles can't be deleted
  userCount: number;
  createdAt: Date;
}

export interface Invitation {
  id: string;
  tenantId: string;
  email: string;
  role: User['role'];
  invitedBy: string;
  token: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  keyPrefix: string; // First 8 chars for identification
  keyHash: string;
  permissions: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  status: 'active' | 'revoked';
  createdAt: Date;
}

// =============================================================================
// USER MANAGEMENT SERVICE
// =============================================================================

class UserManagementService {
  private pool: Pool;
  private users: Map<string, User> = new Map();
  private teams: Map<string, Team> = new Map();
  private roles: Map<string, Role> = new Map();
  private invitations: Map<string, Invitation> = new Map();
  private apiKeys: Map<string, ApiKey> = new Map();

  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });
    this.initializeSystemRoles();
    this.initializeSampleData();
  }

  private initializeSystemRoles(): void {
    const systemRoles: Role[] = [
      {
        id: 'role_owner',
        tenantId: '*',
        name: 'Owner',
        description: 'Full access to all features and settings',
        permissions: ['*'],
        isSystem: true,
        userCount: 0,
        createdAt: new Date(),
      },
      {
        id: 'role_admin',
        tenantId: '*',
        name: 'Admin',
        description: 'Manage users, settings, and most features',
        permissions: [
          'users:manage', 'teams:manage', 'settings:manage', 
          'council:use', 'data:manage', 'reports:view', 'api:manage'
        ],
        isSystem: true,
        userCount: 0,
        createdAt: new Date(),
      },
      {
        id: 'role_editor',
        tenantId: '*',
        name: 'Editor',
        description: 'Create and edit content, run deliberations',
        permissions: [
          'council:use', 'data:view', 'data:edit', 'reports:view'
        ],
        isSystem: true,
        userCount: 0,
        createdAt: new Date(),
      },
      {
        id: 'role_viewer',
        tenantId: '*',
        name: 'Viewer',
        description: 'View-only access to dashboards and reports',
        permissions: ['data:view', 'reports:view'],
        isSystem: true,
        userCount: 0,
        createdAt: new Date(),
      },
    ];

    systemRoles.forEach(r => this.roles.set(r.id, r));
  }

  private initializeSampleData(): void {
    // Sample users for demo tenant
    const sampleUsers: User[] = [
      {
        id: 'user_john_001',
        tenantId: 'tenant_acme_2024',
        email: 'john@acme.com',
        name: 'John Smith',
        role: 'owner',
        status: 'active',
        department: 'Executive',
        title: 'CEO',
        permissions: ['*'],
        lastLoginAt: new Date(Date.now() - 3600000),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        mfaEnabled: true,
      },
      {
        id: 'user_sarah_002',
        tenantId: 'tenant_acme_2024',
        email: 'sarah@acme.com',
        name: 'Sarah Chen',
        role: 'admin',
        status: 'active',
        department: 'Operations',
        title: 'COO',
        permissions: ['users:manage', 'teams:manage', 'settings:manage', 'council:use', 'data:manage'],
        lastLoginAt: new Date(Date.now() - 86400000),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date(),
        mfaEnabled: true,
      },
      {
        id: 'user_mike_003',
        tenantId: 'tenant_acme_2024',
        email: 'mike@acme.com',
        name: 'Mike Johnson',
        role: 'editor',
        status: 'active',
        department: 'Strategy',
        title: 'Strategy Director',
        permissions: ['council:use', 'data:view', 'data:edit', 'reports:view'],
        lastLoginAt: new Date(Date.now() - 172800000),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        mfaEnabled: false,
      },
      {
        id: 'user_emily_004',
        tenantId: 'tenant_acme_2024',
        email: 'emily@acme.com',
        name: 'Emily Davis',
        role: 'editor',
        status: 'pending',
        department: 'Finance',
        title: 'CFO',
        permissions: ['council:use', 'data:view', 'data:edit', 'reports:view'],
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date(),
        invitedBy: 'user_john_001',
        mfaEnabled: false,
      },
      {
        id: 'user_tom_005',
        tenantId: 'tenant_acme_2024',
        email: 'tom@acme.com',
        name: 'Tom Wilson',
        role: 'viewer',
        status: 'active',
        department: 'Sales',
        title: 'Sales Manager',
        permissions: ['data:view', 'reports:view'],
        lastLoginAt: new Date(Date.now() - 604800000),
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date(),
        mfaEnabled: false,
      },
    ];

    sampleUsers.forEach(u => this.users.set(u.id, u));

    // Sample teams
    const sampleTeams: Team[] = [
      {
        id: 'team_exec_001',
        tenantId: 'tenant_acme_2024',
        name: 'Executive Team',
        description: 'C-Suite and senior leadership',
        memberIds: ['user_john_001', 'user_sarah_002', 'user_emily_004'],
        leaderId: 'user_john_001',
        permissions: ['*'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
      },
      {
        id: 'team_strategy_001',
        tenantId: 'tenant_acme_2024',
        name: 'Strategy Team',
        description: 'Strategic planning and analysis',
        memberIds: ['user_mike_003', 'user_sarah_002'],
        leaderId: 'user_mike_003',
        permissions: ['council:use', 'data:view', 'data:edit'],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
      },
    ];

    sampleTeams.forEach(t => this.teams.set(t.id, t));

    // Sample API keys
    const sampleApiKeys: ApiKey[] = [
      {
        id: 'apikey_001',
        tenantId: 'tenant_acme_2024',
        userId: 'user_sarah_002',
        name: 'Production Integration',
        keyPrefix: 'dc_prod_',
        keyHash: crypto.createHash('sha256').update('dc_prod_xxxxxxxxxxxx').digest('hex'),
        permissions: ['council:use', 'data:read'],
        lastUsedAt: new Date(Date.now() - 3600000),
        status: 'active',
        createdAt: new Date('2024-06-01'),
      },
      {
        id: 'apikey_002',
        tenantId: 'tenant_acme_2024',
        userId: 'user_mike_003',
        name: 'Development Testing',
        keyPrefix: 'dc_test_',
        keyHash: crypto.createHash('sha256').update('dc_test_xxxxxxxxxxxx').digest('hex'),
        permissions: ['council:use'],
        lastUsedAt: new Date(Date.now() - 86400000),
        status: 'active',
        createdAt: new Date('2024-08-15'),
      },
    ];

    sampleApiKeys.forEach(k => this.apiKeys.set(k.id, k));

    logger.info(`UserManagementService: Initialized with ${sampleUsers.length} users, ${sampleTeams.length} teams`);
  }

  // ---------------------------------------------------------------------------
  // USER CRUD
  // ---------------------------------------------------------------------------

  async createUser(tenantId: string, data: {
    email: string;
    name: string;
    role: User['role'];
    department?: string;
    title?: string;
    invitedBy?: string;
  }): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${crypto.randomUUID().slice(0, 6)}`,
      tenantId,
      email: data.email,
      name: data.name,
      role: data.role,
      status: 'pending',
      department: data.department,
      title: data.title,
      permissions: this.getPermissionsForRole(data.role),
      createdAt: new Date(),
      updatedAt: new Date(),
      invitedBy: data.invitedBy,
      mfaEnabled: false,
    };

    this.users.set(user.id, user);
    logger.info(`UserManagementService: Created user ${user.email} for tenant ${tenantId}`);
    
    return user;
  }

  private getPermissionsForRole(role: User['role']): string[] {
    const roleMap: Record<string, string[]> = {
      owner: ['*'],
      admin: ['users:manage', 'teams:manage', 'settings:manage', 'council:use', 'data:manage', 'reports:view', 'api:manage'],
      editor: ['council:use', 'data:view', 'data:edit', 'reports:view'],
      viewer: ['data:view', 'reports:view'],
    };
    return roleMap[role] || [];
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async getUserByEmail(tenantId: string, email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.tenantId === tenantId && user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(userId, updated);
    logger.info(`UserManagementService: Updated user ${userId}`);
    
    return updated;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const deleted = this.users.delete(userId);
    if (deleted) {
      logger.info(`UserManagementService: Deleted user ${userId}`);
    }
    return deleted;
  }

  async listUsers(tenantId: string, filters?: {
    role?: User['role'];
    status?: User['status'];
    search?: string;
  }): Promise<User[]> {
    let users = Array.from(this.users.values()).filter(u => u.tenantId === tenantId);

    if (filters?.role) {
      users = users.filter(u => u.role === filters.role);
    }
    if (filters?.status) {
      users = users.filter(u => u.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    return users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ---------------------------------------------------------------------------
  // TEAM MANAGEMENT
  // ---------------------------------------------------------------------------

  async createTeam(tenantId: string, data: {
    name: string;
    description?: string;
    leaderId?: string;
    memberIds?: string[];
    permissions?: string[];
  }): Promise<Team> {
    const team: Team = {
      id: `team_${Date.now()}_${crypto.randomUUID().slice(0, 6)}`,
      tenantId,
      name: data.name,
      description: data.description,
      memberIds: data.memberIds || [],
      leaderId: data.leaderId,
      permissions: data.permissions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.teams.set(team.id, team);
    logger.info(`UserManagementService: Created team ${team.name} for tenant ${tenantId}`);
    
    return team;
  }

  async getTeam(teamId: string): Promise<Team | null> {
    return this.teams.get(teamId) || null;
  }

  async updateTeam(teamId: string, updates: Partial<Team>): Promise<Team | null> {
    const team = this.teams.get(teamId);
    if (!team) return null;

    const updated = { ...team, ...updates, updatedAt: new Date() };
    this.teams.set(teamId, updated);
    
    return updated;
  }

  async deleteTeam(teamId: string): Promise<boolean> {
    return this.teams.delete(teamId);
  }

  async listTeams(tenantId: string): Promise<Team[]> {
    return Array.from(this.teams.values())
      .filter(t => t.tenantId === tenantId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async addTeamMember(teamId: string, userId: string): Promise<Team | null> {
    const team = this.teams.get(teamId);
    if (!team) return null;

    if (!team.memberIds.includes(userId)) {
      team.memberIds.push(userId);
      team.updatedAt = new Date();
    }
    
    return team;
  }

  async removeTeamMember(teamId: string, userId: string): Promise<Team | null> {
    const team = this.teams.get(teamId);
    if (!team) return null;

    team.memberIds = team.memberIds.filter(id => id !== userId);
    team.updatedAt = new Date();
    
    return team;
  }

  // ---------------------------------------------------------------------------
  // ROLE MANAGEMENT
  // ---------------------------------------------------------------------------

  async createRole(tenantId: string, data: {
    name: string;
    description: string;
    permissions: string[];
  }): Promise<Role> {
    const role: Role = {
      id: `role_${Date.now()}_${crypto.randomUUID().slice(0, 6)}`,
      tenantId,
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      isSystem: false,
      userCount: 0,
      createdAt: new Date(),
    };

    this.roles.set(role.id, role);
    logger.info(`UserManagementService: Created custom role ${role.name} for tenant ${tenantId}`);
    
    return role;
  }

  async listRoles(tenantId: string): Promise<Role[]> {
    return Array.from(this.roles.values())
      .filter(r => r.tenantId === '*' || r.tenantId === tenantId)
      .sort((a, b) => {
        if (a.isSystem !== b.isSystem) return a.isSystem ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  async deleteRole(roleId: string): Promise<boolean> {
    const role = this.roles.get(roleId);
    if (!role || role.isSystem) return false;
    return this.roles.delete(roleId);
  }

  // ---------------------------------------------------------------------------
  // API KEYS
  // ---------------------------------------------------------------------------

  async createApiKey(tenantId: string, userId: string, data: {
    name: string;
    permissions: string[];
    expiresAt?: Date;
  }): Promise<{ apiKey: ApiKey; fullKey: string }> {
    const keyValue = `dc_${crypto.randomBytes(24).toString('hex')}`;
    const keyPrefix = keyValue.substring(0, 8);
    const keyHash = crypto.createHash('sha256').update(keyValue).digest('hex');

    const apiKey: ApiKey = {
      id: `apikey_${Date.now()}`,
      tenantId,
      userId,
      name: data.name,
      keyPrefix,
      keyHash,
      permissions: data.permissions,
      expiresAt: data.expiresAt,
      status: 'active',
      createdAt: new Date(),
    };

    this.apiKeys.set(apiKey.id, apiKey);
    logger.info(`UserManagementService: Created API key ${apiKey.name} for tenant ${tenantId}`);
    
    // Return full key only once - it won't be retrievable again
    return { apiKey, fullKey: keyValue };
  }

  async listApiKeys(tenantId: string): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values())
      .filter(k => k.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async revokeApiKey(keyId: string): Promise<boolean> {
    const key = this.apiKeys.get(keyId);
    if (!key) return false;
    key.status = 'revoked';
    return true;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getUserMetrics(tenantId: string): {
    totalUsers: number;
    activeUsers: number;
    pendingInvites: number;
    byRole: Record<string, number>;
  } {
    const users = Array.from(this.users.values()).filter(u => u.tenantId === tenantId);
    const invites = Array.from(this.invitations.values())
      .filter(i => i.tenantId === tenantId && i.status === 'pending');

    const byRole: Record<string, number> = {};
    users.forEach(u => {
      byRole[u.role] = (byRole[u.role] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      pendingInvites: invites.length,
      byRole,
    };
  }
}

export const userManagementService = new UserManagementService();
export default userManagementService;
