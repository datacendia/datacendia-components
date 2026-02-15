// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * GraphQL Schema Definition for Datacendia API
 * 
 * This provides a unified GraphQL layer for flexible client queries,
 * reducing over-fetching and enabling efficient data access.
 */

import { gql } from 'graphql-tag';

export const typeDefs = gql`
  # Scalars
  scalar DateTime
  scalar JSON

  # Enums
  enum AgentStatus {
    ONLINE
    OFFLINE
    BUSY
    ERROR
  }

  enum DeliberationStatus {
    DRAFT
    IN_PROGRESS
    CROSS_EXAMINATION
    SYNTHESIS
    COMPLETED
    ARCHIVED
  }

  enum ConfidenceLevel {
    CALIBRATING
    PENDING_EVIDENCE
    LOW
    MEDIUM
    HIGH
  }

  enum SubscriptionTier {
    PILOT
    FOUNDATION
    ENTERPRISE
    STRATEGIC
    CUSTOM
  }

  # Agent Types
  type Agent {
    id: ID!
    code: String!
    name: String!
    role: String!
    description: String
    avatar: String!
    color: String!
    status: AgentStatus!
    expertise: [String!]!
    capabilities: [String!]!
    stats: AgentStats
    isCustom: Boolean!
    isPremium: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AgentStats {
    deliberationsLed: Int!
    avgConfidence: Float!
    avgResponseTime: String!
    satisfactionScore: Float!
  }

  type AgentResponse {
    agentId: ID!
    agentName: String!
    agentAvatar: String!
    agentColor: String!
    response: String!
    duration: Int!
    isStreaming: Boolean!
    timestamp: DateTime!
  }

  # Deliberation Types
  type Deliberation {
    id: ID!
    sessionId: String!
    query: String!
    mode: String!
    status: DeliberationStatus!
    confidence: ConfidenceLevel
    confidenceScore: Int
    agents: [Agent!]!
    agentResponses: [AgentResponse!]!
    crossExaminations: [CrossExamination!]!
    synthesis: String
    owner: User
    impactedDomains: [String!]!
    attachments: [Attachment!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    completedAt: DateTime
  }

  type CrossExamination {
    id: ID!
    challengerId: ID!
    challengerName: String!
    challengerAvatar: String!
    challengerColor: String!
    targetId: ID!
    targetName: String!
    challenge: String!
    rebuttal: String
    timestamp: DateTime!
  }

  type Attachment {
    id: ID!
    filename: String!
    mimeType: String!
    size: Int!
    extractedContent: String
    uploadedAt: DateTime!
  }

  # User & Auth Types
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    department: String
    avatar: String
    tier: SubscriptionTier!
    permissions: [String!]!
    createdAt: DateTime!
    lastLoginAt: DateTime
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
    expiresAt: DateTime!
  }

  # Organization Types
  type Organization {
    id: ID!
    name: String!
    slug: String!
    tier: SubscriptionTier!
    settings: OrganizationSettings!
    users: [User!]!
    usage: UsageMetrics!
    createdAt: DateTime!
  }

  type OrganizationSettings {
    defaultMode: String!
    autoLockRoster: Boolean!
    requireApproval: Boolean!
    retentionDays: Int!
    allowedDomains: [String!]!
  }

  type UsageMetrics {
    apiCalls: Int!
    apiCallsLimit: Int!
    storageUsedMB: Int!
    storageLimitMB: Int!
    deliberationsThisMonth: Int!
    deliberationsLimit: Int!
    activeUsers: Int!
    aiTokensUsed: Int!
    aiTokensLimit: Int!
  }

  # Knowledge Graph Types
  type KnowledgeGraph {
    entityCount: Int!
    relationshipCount: Int!
    dataPointCount: Int!
    freshness: Float!
    lastUpdated: DateTime!
  }

  type Entity {
    id: ID!
    type: String!
    name: String!
    properties: JSON!
    relationships: [Relationship!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Relationship {
    id: ID!
    type: String!
    sourceId: ID!
    targetId: ID!
    properties: JSON!
    weight: Float!
  }

  # Chronos Types
  type TimelineSnapshot {
    timestamp: DateTime!
    metrics: OrganizationMetrics!
    events: [TimelineEvent!]!
    councilState: CouncilState!
    graphState: KnowledgeGraph!
  }

  type OrganizationMetrics {
    revenue: Float!
    profit: Float!
    employees: Int!
    customers: Int!
    npsScore: Float!
    marketShare: Float!
    burnRate: Float!
    runway: Float!
  }

  type TimelineEvent {
    id: ID!
    type: String!
    title: String!
    description: String
    timestamp: DateTime!
    department: String!
    severity: String!
    impact: String
  }

  type CouncilState {
    activeAgents: Int!
    agentNames: [String!]!
    pendingDecisions: Int!
    totalDeliberations: Int!
    consensusRate: Float!
  }

  # Webhook Types
  type Webhook {
    id: ID!
    url: String!
    events: [String!]!
    isActive: Boolean!
    secret: String!
    createdAt: DateTime!
    lastTriggeredAt: DateTime
    failureCount: Int!
  }

  type WebhookDelivery {
    id: ID!
    webhookId: ID!
    event: String!
    payload: JSON!
    statusCode: Int
    response: String
    deliveredAt: DateTime!
    success: Boolean!
  }

  # Queries
  type Query {
    # Agent queries
    agents(status: AgentStatus, isCustom: Boolean): [Agent!]!
    agent(id: ID!): Agent

    # Deliberation queries
    deliberations(
      status: DeliberationStatus
      limit: Int
      offset: Int
      startDate: DateTime
      endDate: DateTime
    ): [Deliberation!]!
    deliberation(id: ID!): Deliberation
    recentDecisions(limit: Int): [Deliberation!]!

    # User & Org queries
    me: User
    organization: Organization
    users(role: String, department: String): [User!]!

    # Knowledge Graph queries
    knowledgeGraph: KnowledgeGraph!
    entities(type: String, search: String, limit: Int): [Entity!]!
    entity(id: ID!): Entity
    entityRelationships(entityId: ID!, depth: Int): [Relationship!]!

    # Chronos queries
    timelineSnapshot(timestamp: DateTime!): TimelineSnapshot!
    timelineRange(start: DateTime!, end: DateTime!): [TimelineSnapshot!]!
    pivotalMoments(limit: Int): [TimelineEvent!]!

    # Webhook queries
    webhooks: [Webhook!]!
    webhook(id: ID!): Webhook
    webhookDeliveries(webhookId: ID!, limit: Int): [WebhookDelivery!]!

    # Usage & Analytics
    usageMetrics: UsageMetrics!
    apiUsageHistory(days: Int): [JSON!]!
  }

  # Mutations
  type Mutation {
    # Deliberation mutations
    startDeliberation(
      query: String!
      mode: String!
      agentIds: [ID!]
      attachmentIds: [ID!]
      lockRoster: Boolean
    ): Deliberation!
    
    submitQuickBrief(query: String!, agentId: ID): Deliberation!
    
    cancelDeliberation(id: ID!): Boolean!
    
    archiveDeliberation(id: ID!): Deliberation!

    # Agent mutations
    createCustomAgent(input: CreateAgentInput!): Agent!
    updateAgent(id: ID!, input: UpdateAgentInput!): Agent!
    deleteAgent(id: ID!): Boolean!

    # Attachment mutations
    uploadAttachment(file: Upload!): Attachment!
    deleteAttachment(id: ID!): Boolean!

    # Webhook mutations
    createWebhook(url: String!, events: [String!]!): Webhook!
    updateWebhook(id: ID!, url: String, events: [String!], isActive: Boolean): Webhook!
    deleteWebhook(id: ID!): Boolean!
    testWebhook(id: ID!): WebhookDelivery!

    # User mutations
    updateProfile(name: String, avatar: String, department: String): User!
    updateOrganizationSettings(input: OrganizationSettingsInput!): Organization!

    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    refreshToken(refreshToken: String!): AuthPayload!
    logout: Boolean!
  }

  # Subscriptions
  type Subscription {
    # Real-time deliberation updates
    deliberationProgress(id: ID!): Deliberation!
    agentResponse(deliberationId: ID!): AgentResponse!
    crossExamination(deliberationId: ID!): CrossExamination!
    synthesisComplete(deliberationId: ID!): Deliberation!

    # Agent status changes
    agentStatusChanged: Agent!

    # Knowledge graph updates
    entityUpdated: Entity!
    
    # Webhook events
    webhookTriggered: WebhookDelivery!
  }

  # Input Types
  input CreateAgentInput {
    name: String!
    role: String!
    description: String
    avatar: String!
    color: String!
    expertise: [String!]!
    capabilities: [String!]!
  }

  input UpdateAgentInput {
    name: String
    role: String
    description: String
    avatar: String
    color: String
    expertise: [String!]
    capabilities: [String!]
  }

  input OrganizationSettingsInput {
    defaultMode: String
    autoLockRoster: Boolean
    requireApproval: Boolean
    retentionDays: Int
    allowedDomains: [String!]
  }

  # File upload scalar (for multipart requests)
  scalar Upload
`;

export default typeDefs;
