// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * @module services/council/PromptVersioningService
 * @description Prompt versioning system for reproducible AI deliberations.
 * 
 * If a deliberation output is questioned 2 years later, you need to know
 * exactly which prompt generated it. This service:
 * - Stores prompt templates in PostgreSQL with version tracking
 * - Records which template + variables were used for each deliberation
 * - Supports A/B testing of prompt variants
 * - Enables rollback to previous prompt versions
 * 
 * Models: prompt_templates, prompt_usages (council.prisma)
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'system' | 'agent' | 'mode' | 'custom';
  template: string;
  version: number;
  variables: string[];
  modelConfig: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
}

export interface PromptUsageRecord {
  promptTemplateId: string;
  deliberationId?: string;
  agentCode?: string;
  mode?: string;
  inputVariables: Record<string, string>;
  modelUsed?: string;
  tokenCount?: number;
  responseQuality?: number;
}

export interface ResolvedPrompt {
  templateId: string;
  templateName: string;
  version: number;
  resolvedText: string;
  usageId: string;
}

// =============================================================================
// PROMPT VERSIONING SERVICE
// =============================================================================

export class PromptVersioningService {
  /**
   * Create or update a prompt template. If a template with the same name exists,
   * creates a new version and deactivates the old one.
   */
  async upsertTemplate(params: {
    name: string;
    category: 'system' | 'agent' | 'mode' | 'custom';
    template: string;
    variables?: string[];
    modelConfig?: Record<string, unknown>;
    organizationId?: string;
    createdBy?: string;
  }): Promise<PromptTemplate> {
    try {
      // Find the current active version
      const existing = await prisma.prompt_templates.findFirst({
        where: { name: params.name, is_active: true },
        orderBy: { version: 'desc' },
      });

      const newVersion = existing ? existing.version + 1 : 1;

      // Deactivate previous version
      if (existing) {
        await prisma.prompt_templates.update({
          where: { id: existing.id },
          data: { is_active: false },
        });
      }

      // Create new version
      const created = await prisma.prompt_templates.create({
        data: {
          name: params.name,
          category: params.category,
          template: params.template,
          version: newVersion,
          variables: params.variables ?? [],
          model_config: (params.modelConfig ?? {}) as any,
          is_active: true,
          organization_id: params.organizationId ?? null,
          created_by: params.createdBy ?? null,
          parent_id: existing?.id ?? null,
        },
      });

      logger.info(`[PromptVersioning] Template '${params.name}' v${newVersion} created`);

      return {
        id: created.id,
        name: created.name,
        category: created.category as PromptTemplate['category'],
        template: created.template,
        version: created.version,
        variables: created.variables as string[],
        modelConfig: created.model_config as Record<string, unknown>,
        isActive: created.is_active,
        createdAt: created.created_at,
      };
    } catch (err) {
      logger.error(`[PromptVersioning] Failed to upsert template '${params.name}':`, err);
      throw err;
    }
  }

  /**
   * Resolve a prompt template by substituting variables.
   * Records the usage for audit trail.
   */
  async resolve(params: {
    templateName: string;
    variables?: Record<string, string>;
    deliberationId?: string;
    agentCode?: string;
    mode?: string;
    modelUsed?: string;
  }): Promise<ResolvedPrompt> {
    // Find active template
    const template = await prisma.prompt_templates.findFirst({
      where: { name: params.templateName, is_active: true },
      orderBy: { version: 'desc' },
    });

    if (!template) {
      throw new Error(`Prompt template '${params.templateName}' not found`);
    }

    // Substitute variables
    let resolved = template.template;
    const vars = params.variables ?? {};
    for (const [key, value] of Object.entries(vars)) {
      resolved = resolved.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    // Record usage
    const usage = await prisma.prompt_usages.create({
      data: {
        prompt_template_id: template.id,
        deliberation_id: params.deliberationId ?? null,
        agent_code: params.agentCode ?? null,
        mode: params.mode ?? null,
        input_variables: vars,
        model_used: params.modelUsed ?? null,
      },
    });

    return {
      templateId: template.id,
      templateName: template.name,
      version: template.version,
      resolvedText: resolved,
      usageId: usage.id,
    };
  }

  /**
   * Record token count and quality score after a prompt has been used.
   */
  async recordMetrics(usageId: string, metrics: {
    tokenCount?: number;
    responseQuality?: number;
  }): Promise<void> {
    try {
      await prisma.prompt_usages.update({
        where: { id: usageId },
        data: {
          token_count: metrics.tokenCount ?? null,
          response_quality: metrics.responseQuality ?? null,
        },
      });
    } catch (err) {
      logger.error(`[PromptVersioning] Failed to record metrics for usage ${usageId}:`, err);
    }
  }

  /**
   * Get version history for a template.
   */
  async getVersionHistory(templateName: string): Promise<PromptTemplate[]> {
    const versions = await prisma.prompt_templates.findMany({
      where: { name: templateName },
      orderBy: { version: 'desc' },
    });

    return versions.map((v) => ({
      id: v.id,
      name: v.name,
      category: v.category as PromptTemplate['category'],
      template: v.template,
      version: v.version,
      variables: v.variables as string[],
      modelConfig: v.model_config as Record<string, unknown>,
      isActive: v.is_active,
      createdAt: v.created_at,
    }));
  }

  /**
   * Rollback to a specific version of a template.
   */
  async rollback(templateName: string, targetVersion: number): Promise<PromptTemplate> {
    const target = await prisma.prompt_templates.findFirst({
      where: { name: templateName, version: targetVersion },
    });

    if (!target) {
      throw new Error(`Template '${templateName}' v${targetVersion} not found`);
    }

    // Deactivate all versions
    await prisma.prompt_templates.updateMany({
      where: { name: templateName },
      data: { is_active: false },
    });

    // Reactivate target version
    await prisma.prompt_templates.update({
      where: { id: target.id },
      data: { is_active: true },
    });

    logger.info(`[PromptVersioning] Rolled back '${templateName}' to v${targetVersion}`);

    return {
      id: target.id,
      name: target.name,
      category: target.category as PromptTemplate['category'],
      template: target.template,
      version: target.version,
      variables: target.variables as string[],
      modelConfig: target.model_config as Record<string, unknown>,
      isActive: true,
      createdAt: target.created_at,
    };
  }

  /**
   * List all active templates, optionally filtered by category.
   */
  async listActive(category?: string): Promise<PromptTemplate[]> {
    const where: Record<string, unknown> = { is_active: true };
    if (category) where['category'] = category;

    const templates = await prisma.prompt_templates.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category as PromptTemplate['category'],
      template: t.template,
      version: t.version,
      variables: t.variables as string[],
      modelConfig: t.model_config as Record<string, unknown>,
      isActive: t.is_active,
      createdAt: t.created_at,
    }));
  }

  /**
   * Get usage statistics for a template — how many times used, avg quality, etc.
   */
  async getUsageStats(templateName: string): Promise<{
    totalUsages: number;
    avgQuality: number | null;
    avgTokens: number | null;
    byVersion: Array<{ version: number; count: number; avgQuality: number | null }>;
  }> {
    const templates = await prisma.prompt_templates.findMany({
      where: { name: templateName },
      include: { usages: true },
    });

    let totalUsages = 0;
    let qualitySum = 0;
    let qualityCount = 0;
    let tokenSum = 0;
    let tokenCount = 0;
    const byVersion: Array<{ version: number; count: number; avgQuality: number | null }> = [];

    for (const tmpl of templates) {
      const count = tmpl.usages.length;
      totalUsages += count;

      let vQualitySum = 0;
      let vQualityCount = 0;

      for (const usage of tmpl.usages) {
        if (usage.response_quality !== null) {
          qualitySum += usage.response_quality;
          qualityCount++;
          vQualitySum += usage.response_quality;
          vQualityCount++;
        }
        if (usage.token_count !== null) {
          tokenSum += usage.token_count;
          tokenCount++;
        }
      }

      byVersion.push({
        version: tmpl.version,
        count,
        avgQuality: vQualityCount > 0 ? vQualitySum / vQualityCount : null,
      });
    }

    return {
      totalUsages,
      avgQuality: qualityCount > 0 ? qualitySum / qualityCount : null,
      avgTokens: tokenCount > 0 ? Math.round(tokenSum / tokenCount) : null,
      byVersion: byVersion.sort((a, b) => b.version - a.version),
    };
  }

  /**
   * Extract {{variable}} placeholders from template text.
   * Returns unique variable names in order of first appearance.
   */
  private extractVariables(template: string): string[] {
    const matches = template.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    const vars = matches.map(m => m.replace(/\{\{|\}\}/g, ''));
    return [...new Set(vars)];
  }
}

export const promptVersioning = new PromptVersioningService();
export default promptVersioning;
