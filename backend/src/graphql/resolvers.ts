/**
 * Module — Resolvers
 *
 * Platform module.
 *
 * @exports resolvers, GraphQLContext
 * @module graphql/resolvers
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * GraphQL Resolvers for Datacendia API
 * 
 * Implements all Query, Mutation, and Subscription resolvers
 * with proper type safety and error handling.
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { GraphQLError } from 'graphql';

// =============================================================================
// CONTEXT TYPE
// =============================================================================

export interface GraphQLContext {
  user: {
    id: string;
    email: string;
    role: string;
    organizationId: string;
  } | null;
  organizationId: string | null;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function requireAuth(context: GraphQLContext): asserts context is GraphQLContext & { user: NonNullable<GraphQLContext['user']> } {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
}

function requireOrg(context: GraphQLContext): string {
  requireAuth(context);
  if (!context.organizationId) {
    throw new GraphQLError('Organization context required', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  return context.organizationId;
}

// =============================================================================
// RESOLVERS
// =============================================================================

export const resolvers = {
  // ---------------------------------------------------------------------------
  // QUERIES
  // ---------------------------------------------------------------------------
  Query: {
    // Agent queries
    agents: async (_: unknown, args: { status?: string; isCustom?: boolean }, context: GraphQLContext) => {
      requireAuth(context);
      const where: Record<string, unknown> = { is_active: true };
      
      if (args.isCustom !== undefined) {
        where.code = args.isCustom ? { startsWith: 'CUSTOM_' } : { not: { startsWith: 'CUSTOM_' } };
      }
      
      const agents = await prisma.agents.findMany({ where });
      return agents.map(mapAgent);
    },

    agent: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      const agent = await prisma.agents.findUnique({ where: { id: args.id } });
      return agent ? mapAgent(agent) : null;
    },

    // Deliberation queries
    deliberations: async (
      _: unknown,
      args: { status?: string; limit?: number; offset?: number; startDate?: Date; endDate?: Date },
      context: GraphQLContext
    ) => {
      const orgId = requireOrg(context);
      
      const where: Record<string, unknown> = { organization_id: orgId };
      if (args.status) where.status = args.status;
      if (args.startDate || args.endDate) {
        where.created_at = {};
        if (args.startDate) (where.created_at as Record<string, unknown>).gte = args.startDate;
        if (args.endDate) (where.created_at as Record<string, unknown>).lte = args.endDate;
      }

      const deliberations = await prisma.deliberations.findMany({
        where,
        take: args.limit ?? 20,
        skip: args.offset ?? 0,
        orderBy: { created_at: 'desc' },
        include: {
          deliberation_messages: true,
        },
      });

      return deliberations.map(mapDeliberation);
    },

    deliberation: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      const deliberation = await prisma.deliberations.findUnique({
        where: { id: args.id },
        include: {
          deliberation_messages: true,
        },
      });
      return deliberation ? mapDeliberation(deliberation) : null;
    },

    recentDecisions: async (_: unknown, args: { limit?: number }, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      
      const deliberations = await prisma.deliberations.findMany({
        where: { 
          organization_id: orgId,
          status: 'COMPLETED',
        },
        take: args.limit ?? 10,
        orderBy: { completed_at: 'desc' },
        include: {
          deliberation_messages: true,
        },
      });

      return deliberations.map(mapDeliberation);
    },

    // User & Org queries
    me: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAuth(context);
      const user = await prisma.users.findUnique({
        where: { id: context.user.id },
      });
      return user ? mapUser(user) : null;
    },

    organization: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      const org = await prisma.organizations.findUnique({
        where: { id: orgId },
      });
      return org ? mapOrganization(org) : null;
    },

    users: async (_: unknown, args: { role?: string; department?: string }, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      
      const where: Record<string, unknown> = { organization_id: orgId };
      if (args.role) where.role = args.role;
      if (args.department) where.department = args.department;

      const users = await prisma.users.findMany({ where });
      return users.map(mapUser);
    },

    // Knowledge Graph queries
    knowledgeGraph: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAuth(context);
      // Deterministic data; production upgrade: connect to Neo4j
      return {
        entityCount: 0,
        relationshipCount: 0,
        dataPointCount: 0,
        freshness: 0.95,
        lastUpdated: new Date(),
      };
    },

    entities: async (_: unknown, args: { type?: string; search?: string; limit?: number }, context: GraphQLContext) => {
      requireAuth(context);
      // Production upgrade: query Neo4j
      return [];
    },

    entity: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      return null;
    },

    entityRelationships: async (_: unknown, args: { entityId: string; depth?: number }, context: GraphQLContext) => {
      requireAuth(context);
      return [];
    },

    // Chronos queries
    timelineSnapshot: async (_: unknown, args: { timestamp: Date }, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      
      return {
        timestamp: args.timestamp,
        metrics: {
          revenue: 0,
          profit: 0,
          employees: 0,
          customers: 0,
          npsScore: 0,
          marketShare: 0,
          burnRate: 0,
          runway: 0,
        },
        events: [],
        councilState: {
          activeAgents: 0,
          agentNames: [],
          pendingDecisions: 0,
          totalDeliberations: 0,
          consensusRate: 0,
        },
        graphState: {
          entityCount: 0,
          relationshipCount: 0,
          dataPointCount: 0,
          freshness: 0,
          lastUpdated: new Date(),
        },
      };
    },

    timelineRange: async (_: unknown, args: { start: Date; end: Date }, context: GraphQLContext) => {
      requireAuth(context);
      return [];
    },

    pivotalMoments: async (_: unknown, args: { limit?: number }, context: GraphQLContext) => {
      requireAuth(context);
      return [];
    },

    webhooks: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      const hooks = await prisma.webhooks.findMany({
        where: { organization_id: orgId },
        orderBy: { created_at: 'desc' },
      });
      return hooks.map(mapWebhook);
    },

    webhook: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      const hook = await prisma.webhooks.findUnique({ where: { id: args.id } });
      return hook ? mapWebhook(hook) : null;
    },

    webhookDeliveries: async (_: unknown, args: { webhookId: string; limit?: number }, context: GraphQLContext) => {
      requireAuth(context);
      const deliveries = await prisma.webhook_deliveries.findMany({
        where: { webhook_id: args.webhookId },
        take: args.limit ?? 50,
        orderBy: { delivered_at: 'desc' },
      });
      return deliveries.map(d => ({
        id: d.id,
        webhookId: d.webhook_id,
        event: d.event,
        payload: d.payload,
        statusCode: d.status_code,
        response: d.response,
        deliveredAt: d.delivered_at,
        success: d.success,
      }));
    },

    // Usage & Analytics
    usageMetrics: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      
      // Get actual counts from database
      const [userCount, deliberationCount] = await Promise.all([
        prisma.users.count({ where: { organization_id: orgId } }),
        prisma.deliberations.count({ where: { organization_id: orgId } }),
      ]);

      return {
        apiCalls: 0,
        apiCallsLimit: 10000,
        storageUsedMB: 0,
        storageLimitMB: 1000,
        deliberationsThisMonth: deliberationCount,
        deliberationsLimit: 100,
        activeUsers: userCount,
        aiTokensUsed: 0,
        aiTokensLimit: 1000000,
      };
    },

    apiUsageHistory: async (_: unknown, args: { days?: number }, context: GraphQLContext) => {
      requireAuth(context);
      return [];
    },
  },

  // ---------------------------------------------------------------------------
  // MUTATIONS
  // ---------------------------------------------------------------------------
  Mutation: {
    // Deliberation mutations
    startDeliberation: async (
      _: unknown,
      args: { query: string; mode: string; agentIds?: string[]; attachmentIds?: string[]; lockRoster?: boolean },
      context: GraphQLContext
    ) => {
      const orgId = requireOrg(context);
      
      const deliberation = await prisma.deliberations.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: orgId,
          question: args.query,
          mode: args.mode,
          status: 'PENDING',
          config: {
            lockRoster: args.lockRoster ?? false,
            agentIds: args.agentIds ?? [],
          },
          context: {},
          created_at: new Date(),
        },
      });

      return mapDeliberation(deliberation);
    },

    submitQuickBrief: async (_: unknown, args: { query: string; agentId?: string }, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      
      const deliberation = await prisma.deliberations.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: orgId,
          question: args.query,
          mode: 'quick_brief',
          status: 'PENDING',
          config: { agentId: args.agentId },
          context: {},
          created_at: new Date(),
        },
      });

      return mapDeliberation(deliberation);
    },

    cancelDeliberation: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      await prisma.deliberations.update({
        where: { id: args.id },
        data: { status: 'CANCELLED' },
      });
      return true;
    },

    archiveDeliberation: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      const deliberation = await prisma.deliberations.update({
        where: { id: args.id },
        data: { status: 'COMPLETED' }, // Archive by marking completed
      });
      return mapDeliberation(deliberation);
    },

    // Agent mutations
    createCustomAgent: async (
      _: unknown,
      args: { input: { name: string; role: string; description?: string; avatar: string; color: string; expertise: string[]; capabilities: string[] } },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      const agent = await prisma.agents.create({
        data: {
          id: crypto.randomUUID(),
          code: `CUSTOM_${Date.now()}`,
          name: args.input.name,
          role: args.input.role,
          description: args.input.description ?? '',
          avatar_url: args.input.avatar,
          system_prompt: `You are ${args.input.name}, a ${args.input.role}.`,
          capabilities: args.input.capabilities,
          constraints: [],
          model_config: {},
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return mapAgent(agent);
    },

    updateAgent: async (
      _: unknown,
      args: { id: string; input: { name?: string; role?: string; description?: string; avatar?: string; color?: string; expertise?: string[]; capabilities?: string[] } },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      const updateData: Record<string, unknown> = { updated_at: new Date() };
      if (args.input.name) updateData.name = args.input.name;
      if (args.input.role) updateData.role = args.input.role;
      if (args.input.description) updateData.description = args.input.description;
      if (args.input.avatar) updateData.avatar_url = args.input.avatar;
      if (args.input.capabilities) updateData.capabilities = args.input.capabilities;

      const agent = await prisma.agents.update({
        where: { id: args.id },
        data: updateData,
      });

      return mapAgent(agent);
    },

    deleteAgent: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      await prisma.agents.update({
        where: { id: args.id },
        data: { is_active: false },
      });
      return true;
    },

    createWebhook: async (_: unknown, args: { url: string; events: string[] }, context: GraphQLContext) => {
      const orgId = requireOrg(context);
      const secret = crypto.randomUUID();
      const hook = await prisma.webhooks.create({
        data: {
          organization_id: orgId,
          url: args.url,
          events: args.events,
          secret,
          is_active: true,
        },
      });
      return mapWebhook(hook);
    },

    updateWebhook: async (
      _: unknown,
      args: { id: string; url?: string; events?: string[]; isActive?: boolean },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      const data: Record<string, unknown> = {};
      if (args.url !== undefined) data.url = args.url;
      if (args.events !== undefined) data.events = args.events;
      if (args.isActive !== undefined) data.is_active = args.isActive;
      const hook = await prisma.webhooks.update({ where: { id: args.id }, data });
      return mapWebhook(hook);
    },

    deleteWebhook: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      await prisma.webhooks.delete({ where: { id: args.id } });
      return true;
    },

    testWebhook: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      const hook = await prisma.webhooks.findUnique({ where: { id: args.id } });
      if (!hook) throw new GraphQLError('Webhook not found', { extensions: { code: 'NOT_FOUND' } });

      let statusCode = 0;
      let responseBody = '';
      let success = false;
      try {
        const resp = await fetch(hook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Datacendia-Signature': hook.secret },
          body: JSON.stringify({ event: 'test', timestamp: new Date().toISOString(), data: { test: true } }),
          signal: AbortSignal.timeout(10000),
        });
        statusCode = resp.status;
        responseBody = await resp.text().catch(() => '');
        success = resp.ok;
      } catch (err) {
        responseBody = err instanceof Error ? err.message : 'Connection failed';
      }

      const delivery = await prisma.webhook_deliveries.create({
        data: { webhook_id: args.id, event: 'test', payload: { test: true }, status_code: statusCode, response: responseBody.slice(0, 1000), success },
      });

      return {
        id: delivery.id,
        webhookId: delivery.webhook_id,
        event: delivery.event,
        payload: delivery.payload,
        statusCode: delivery.status_code,
        response: delivery.response,
        deliveredAt: delivery.delivered_at,
        success: delivery.success,
      };
    },

    // User mutations
    updateProfile: async (
      _: unknown,
      args: { name?: string; avatar?: string; department?: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      const updateData: Record<string, unknown> = { updated_at: new Date() };
      if (args.name) {
        const [firstName, ...lastParts] = args.name.split(' ');
        updateData.first_name = firstName;
        updateData.last_name = lastParts.join(' ') || '';
      }
      if (args.avatar) updateData.avatar_url = args.avatar;
      if (args.department) updateData.department = args.department;

      const user = await prisma.users.update({
        where: { id: context.user.id },
        data: updateData,
      });

      return mapUser(user);
    },

    updateOrganizationSettings: async (
      _: unknown,
      args: { input: { defaultMode?: string; autoLockRoster?: boolean; requireApproval?: boolean; retentionDays?: number; allowedDomains?: string[] } },
      context: GraphQLContext
    ) => {
      const orgId = requireOrg(context);
      
      const org = await prisma.organizations.update({
        where: { id: orgId },
        data: {
          settings: args.input,
          updated_at: new Date(),
        },
      });

      return mapOrganization(org);
    },

    // Auth mutations (simplified - would integrate with auth service)
    login: async (_: unknown, args: { email: string; password: string }) => {
      throw new GraphQLError('Use REST /auth/login endpoint', {
        extensions: { code: 'BAD_REQUEST' },
      });
    },

    refreshToken: async (_: unknown, args: { refreshToken: string }) => {
      throw new GraphQLError('Use REST /auth/refresh endpoint', {
        extensions: { code: 'BAD_REQUEST' },
      });
    },

    logout: async (_: unknown, __: unknown, context: GraphQLContext) => {
      requireAuth(context);
      return true;
    },

    // File upload (placeholder)
    uploadAttachment: async () => {
      throw new GraphQLError('File uploads should use REST /upload endpoint', {
        extensions: { code: 'BAD_REQUEST' },
      });
    },

    deleteAttachment: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      return true;
    },
  },

  // ---------------------------------------------------------------------------
  // SUBSCRIPTIONS (placeholders - would use WebSocket)
  // ---------------------------------------------------------------------------
  Subscription: {
    deliberationProgress: {
      subscribe: () => {
        throw new GraphQLError('Use WebSocket connection for subscriptions');
      },
    },
    agentResponse: {
      subscribe: () => {
        throw new GraphQLError('Use WebSocket connection for subscriptions');
      },
    },
    crossExamination: {
      subscribe: () => {
        throw new GraphQLError('Use WebSocket connection for subscriptions');
      },
    },
    synthesisComplete: {
      subscribe: () => {
        throw new GraphQLError('Use WebSocket connection for subscriptions');
      },
    },
    agentStatusChanged: {
      subscribe: () => {
        throw new GraphQLError('Use WebSocket connection for subscriptions');
      },
    },
    entityUpdated: {
      subscribe: () => {
        throw new GraphQLError('Use WebSocket connection for subscriptions');
      },
    },
    webhookTriggered: {
      subscribe: () => {
        throw new GraphQLError('Use WebSocket connection for subscriptions');
      },
    },
  },
};

// =============================================================================
// MAPPERS - Convert DB entities to GraphQL types
// =============================================================================

interface AgentRecord {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar_url: string | null;
  capabilities: unknown;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

function mapAgent(agent: AgentRecord) {
  return {
    id: agent.id,
    code: agent.code,
    name: agent.name,
    role: agent.role,
    description: agent.description,
    avatar: agent.avatar_url ?? '/avatars/default.png',
    color: '#6366f1',
    status: 'ONLINE',
    expertise: [],
    capabilities: Array.isArray(agent.capabilities) ? agent.capabilities : [],
    stats: {
      deliberationsLed: 0,
      avgConfidence: 0.85,
      avgResponseTime: '2.3s',
      satisfactionScore: 4.5,
    },
    isCustom: agent.code.startsWith('CUSTOM_'),
    isPremium: false,
    createdAt: agent.created_at,
    updatedAt: agent.updated_at,
  };
}

interface DeliberationRecord {
  id: string;
  organization_id: string;
  question: string;
  mode: string | null;
  status: string;
  current_phase: string | null;
  progress: number;
  decision: unknown;
  confidence: number | null;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  deliberation_messages?: Array<{
    id: string;
    agent_id: string;
    content: string;
    created_at: Date;
  }>;
}

function mapDeliberation(delib: DeliberationRecord) {
  return {
    id: delib.id,
    sessionId: delib.id,
    query: delib.question,
    mode: delib.mode ?? 'consensus',
    status: delib.status,
    confidence: delib.confidence ? getConfidenceLevel(delib.confidence) : 'PENDING_EVIDENCE',
    confidenceScore: delib.confidence ? Math.round(delib.confidence * 100) : null,
    agents: [],
    agentResponses: (delib.deliberation_messages ?? []).map(msg => ({
      agentId: msg.agent_id,
      agentName: 'Agent',
      agentAvatar: '/avatars/default.png',
      agentColor: '#6366f1',
      response: msg.content,
      duration: 0,
      isStreaming: false,
      timestamp: msg.created_at,
    })),
    crossExaminations: [],
    synthesis: typeof delib.decision === 'object' && delib.decision !== null 
      ? (delib.decision as Record<string, unknown>).outcome as string ?? null
      : null,
    owner: null,
    impactedDomains: [],
    attachments: [],
    createdAt: delib.created_at,
    updatedAt: delib.created_at,
    completedAt: delib.completed_at,
  };
}

function getConfidenceLevel(score: number): string {
  if (score >= 0.8) return 'HIGH';
  if (score >= 0.5) return 'MEDIUM';
  return 'LOW';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(user: any) {
  const name = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown';
  return {
    id: user.id,
    email: user.email || '',
    name,
    role: user.role || 'viewer',
    department: user.department || null,
    avatar: user.avatar_url || null,
    tier: 'ENTERPRISE',
    permissions: [],
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at || null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrganization(org: any) {
  const settings = typeof org.settings === 'object' && org.settings !== null
    ? org.settings as Record<string, unknown>
    : {};
    
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    tier: (org.plan || 'enterprise').toUpperCase(),
    settings: {
      defaultMode: (settings.defaultMode as string) ?? 'consensus',
      autoLockRoster: (settings.autoLockRoster as boolean) ?? false,
      requireApproval: (settings.requireApproval as boolean) ?? false,
      retentionDays: (settings.retentionDays as number) ?? 90,
      allowedDomains: (settings.allowedDomains as string[]) ?? [],
    },
    users: [],
    usage: {
      apiCalls: 0,
      apiCallsLimit: 10000,
      storageUsedMB: 0,
      storageLimitMB: 1000,
      deliberationsThisMonth: 0,
      deliberationsLimit: 100,
      activeUsers: 0,
      aiTokensUsed: 0,
      aiTokensLimit: 1000000,
    },
    createdAt: org.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapWebhook(webhook: any) {
  return {
    id: webhook.id,
    url: webhook.url,
    events: Array.isArray(webhook.events) ? webhook.events : [],
    isActive: webhook.is_active ?? true,
    secret: webhook.secret || '',
    createdAt: webhook.created_at,
    lastTriggeredAt: webhook.last_triggered_at || null,
    failureCount: webhook.failure_count || 0,
  };
}

export default resolvers;
