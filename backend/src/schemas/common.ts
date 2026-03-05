/**
 * Schemas — Common Zod Validation Schemas
 *
 * Reusable Zod schemas for common request patterns across routes.
 * Import these instead of defining inline schemas in every route.
 *
 * @module schemas/common
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { z } from 'zod';

// =============================================================================
// ID SCHEMAS
// =============================================================================

export const idParam = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const uuidParam = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

export const orgIdParam = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
});

// =============================================================================
// PAGINATION & FILTERING
// =============================================================================

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchQuery = paginationQuery.extend({
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const dateRangeQuery = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// =============================================================================
// COMMON BODY SCHEMAS
// =============================================================================

export const createResourceBody = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().max(5000).optional(),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateResourceBody = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional(),
  category: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const configBody = z.object({
  config: z.record(z.unknown()),
});

export const statusUpdateBody = z.object({
  status: z.string().min(1, 'Status is required'),
  reason: z.string().optional(),
});

// =============================================================================
// AI / COUNCIL SCHEMAS
// =============================================================================

export const aiQueryBody = z.object({
  query: z.string().min(1, 'Query is required').max(10000),
  context: z.record(z.unknown()).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(1).max(32000).optional(),
});

export const deliberationBody = z.object({
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(10000),
  decisionId: z.string().optional(),
  agentIds: z.array(z.string()).optional(),
  config: z.record(z.unknown()).optional(),
});

// =============================================================================
// COMPLIANCE SCHEMAS
// =============================================================================

export const complianceAssessmentBody = z.object({
  frameworkId: z.string().min(1),
  scope: z.string().optional(),
  controls: z.array(z.object({
    controlId: z.string(),
    status: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'PARTIAL', 'NOT_APPLICABLE']),
    evidence: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});

// =============================================================================
// EVIDENCE SCHEMAS
// =============================================================================

export const evidenceBody = z.object({
  type: z.string().min(1),
  content: z.union([z.string(), z.record(z.unknown())]),
  source: z.string().optional(),
  decisionId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// =============================================================================
// NOTIFICATION SCHEMAS
// =============================================================================

export const notificationBody = z.object({
  type: z.string().min(1),
  title: z.string().min(1).max(200),
  message: z.string().max(5000),
  recipients: z.array(z.string()).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

// =============================================================================
// SETTINGS SCHEMAS
// =============================================================================

export const settingsBody = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export const bulkSettingsBody = z.object({
  settings: z.array(z.object({
    key: z.string().min(1),
    value: z.unknown(),
  })),
});
