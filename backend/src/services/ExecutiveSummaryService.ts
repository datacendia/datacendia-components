// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA EXECUTIVE SUMMARY & MINUTES SERVICE
 * =============================================================================
 * Generates executive summaries and meeting minutes for:
 * - Council Deliberations
 * - Decision DNS
 * - Pre-Mortem Analysis
 * - Ghost Board
 * - Decision Debt
 * - Regulatory Absorb
 * - Live Demo Mode
 */

import { prisma } from '../config/database.js';
import ollamaService from './ollama.js';
import { translationService, type SupportedLanguage } from './i18n/TranslationService.js';
import { logger } from '../utils/logger.js';

// NOTE: Run `npx prisma generate` after adding ExecutiveSummary model

// =============================================================================
// TYPES
// =============================================================================

export interface SummaryInput {
  organizationId: string;
  deliberationId?: string;
  decisionId?: string;
  type: SummaryType;
  title: string;
  content: string;
  agents?: Array<{ name: string; content: string }>;
  decision?: string;
  confidence?: number;
  language?: SupportedLanguage;
}

export type SummaryType = 
  | 'COUNCIL_DELIBERATION'
  | 'DECISION_DNS'
  | 'PRE_MORTEM'
  | 'GHOST_BOARD'
  | 'DECISION_DEBT'
  | 'REGULATORY_ABSORB'
  | 'LIVE_DEMO';

export interface ExecutiveSummary {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  participants: string[];
  risks: Risk[];
  recommendations: string[];
  nextSteps: NextStep[];
  language: string;
  generatedBy: string;
  createdAt: Date;
}

export interface ActionItem {
  id: string;
  action: string;
  owner: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Risk {
  id: string;
  description: string;
  rationale: string; // WHY this is a risk
  probability: number; // 1-10
  impact: number; // 1-10
  mitigation?: string;
}

export interface NextStep {
  step: string;
  reason: string; // WHY this step is necessary
}

// =============================================================================
// EXECUTIVE SUMMARY SERVICE
// =============================================================================

class ExecutiveSummaryService {
  private modelId = 'qwen3:32b'; // Use flagship model for quality

  /**
   * Generate executive summary from deliberation
   */
  async generateFromDeliberation(input: SummaryInput): Promise<ExecutiveSummary> {
    logger.info(`Generating executive summary for ${input.type}: ${input.title}`);

    const prompt = this.buildSummaryPrompt(input);
    
    try {
      const response = await ollamaService.generate(prompt, {
        model: this.modelId,
        options: {
          temperature: 0.4,
          num_predict: 2000,
        },
      });

      const parsed = this.parseSummaryResponse(response);
      
      // Translate if not English
      if (input.language && input.language !== 'en') {
        const translated = await translationService.translateExecutiveSummary(
          {
            title: parsed.title,
            content: parsed.content,
            keyPoints: parsed.keyPoints,
            actionItems: parsed.actionItems.map(a => a.action),
            recommendations: parsed.recommendations,
          },
          input.language
        );
        parsed.title = translated.title;
        parsed.content = translated.content;
        parsed.keyPoints = translated.keyPoints;
        parsed.recommendations = translated.recommendations;
      }

      // Save to database
      const saved = await this.saveSummary(input, parsed);
      
      return saved;
    } catch (error) {
      logger.error(`Failed to generate executive summary: ${error}`);
      throw error;
    }
  }

  /**
   * Generate meeting minutes
   */
  async generateMinutes(input: SummaryInput): Promise<ExecutiveSummary> {
    logger.info(`Generating meeting minutes for ${input.type}: ${input.title}`);

    const prompt = this.buildMinutesPrompt(input);
    
    try {
      const response = await ollamaService.generate(prompt, {
        model: this.modelId,
        options: {
          temperature: 0.3,
          num_predict: 3000,
        },
      });

      const parsed = this.parseMinutesResponse(response);
      
      // Translate if not English
      if (input.language && input.language !== 'en') {
        const translated = await translationService.translateExecutiveSummary(
          {
            title: parsed.title,
            content: parsed.content,
            keyPoints: parsed.keyPoints,
            actionItems: parsed.actionItems.map(a => a.action),
            recommendations: parsed.recommendations,
          },
          input.language
        );
        parsed.title = translated.title;
        parsed.content = translated.content;
        parsed.keyPoints = translated.keyPoints;
        parsed.recommendations = translated.recommendations;
      }

      return parsed;
    } catch (error) {
      logger.error(`Failed to generate minutes: ${error}`);
      throw error;
    }
  }

  /**
   * Build prompt for executive summary generation
   */
  private buildSummaryPrompt(input: SummaryInput): string {
    const agentsSection = input.agents?.map(a => 
      `**${a.name}:** ${a.content}`
    ).join('\n\n') || '';

    return `You are an executive assistant creating a professional executive summary.

## Context
Type: ${input.type.replace(/_/g, ' ')}
Title: ${input.title}

## Content
${input.content}

${agentsSection ? `## Agent Contributions\n${agentsSection}` : ''}

${input.decision ? `## Final Decision\n${input.decision}\n\nConfidence: ${input.confidence || 'N/A'}%` : ''}

## Task
Generate a comprehensive executive summary in JSON format:

{
  "title": "Executive Summary: [Topic]",
  "content": "[2-3 paragraph executive summary highlighting key insights, decisions, and strategic implications]",
  "keyPoints": [
    "[Key point 1]",
    "[Key point 2]",
    "[Up to 5 key points]"
  ],
  "actionItems": [
    {
      "id": "ai-1",
      "action": "[Specific action]",
      "owner": "[Role/Person]",
      "deadline": "[Timeframe]",
      "priority": "high",
      "status": "pending"
    }
  ],
  "participants": ["[Agent/Role names]"],
  "risks": [
    {
      "id": "r-1",
      "description": "[Risk description]",
      "rationale": "[WHY this is a risk - explain the underlying cause and potential consequences]",
      "probability": 7,
      "impact": 8,
      "mitigation": "[Mitigation strategy]"
    }
  ],
  "recommendations": [
    "[Strategic recommendation 1]",
    "[Strategic recommendation 2]"
  ],
  "nextSteps": [
    {
      "step": "[Immediate next step]",
      "reason": "[WHY this step is necessary - explain the purpose and expected outcome]"
    },
    {
      "step": "[Follow-up action]",
      "reason": "[WHY this step is necessary]"
    }
  ]
}

Return ONLY valid JSON, no markdown or explanations.`;
  }

  /**
   * Build prompt for meeting minutes generation
   */
  private buildMinutesPrompt(input: SummaryInput): string {
    const agentsSection = input.agents?.map(a => 
      `**${a.name}:** ${a.content}`
    ).join('\n\n') || '';

    return `You are a professional executive secretary creating formal meeting minutes.

## Meeting Details
Type: ${input.type.replace(/_/g, ' ')}
Subject: ${input.title}
Date: ${new Date().toISOString().split('T')[0]}

## Proceedings
${input.content}

${agentsSection ? `## Participant Contributions\n${agentsSection}` : ''}

${input.decision ? `## Resolution\n${input.decision}` : ''}

## Task
Generate formal meeting minutes in JSON format:

{
  "title": "Minutes: ${input.title}",
  "content": "[Formal narrative of the meeting proceedings, discussions, and outcomes]",
  "keyPoints": [
    "[Discussion point 1]",
    "[Discussion point 2]"
  ],
  "actionItems": [
    {
      "id": "min-1",
      "action": "[Action decided]",
      "owner": "[Assigned to]",
      "deadline": "[Due date/timeframe]",
      "priority": "medium",
      "status": "pending"
    }
  ],
  "participants": ["[List of participants]"],
  "risks": [],
  "recommendations": [
    "[Formal recommendation from the meeting]"
  ],
  "nextSteps": [
    "[Follow-up meeting or action]"
  ]
}

Return ONLY valid JSON, no markdown or explanations.`;
  }

  /**
   * Parse summary response from LLM
   */
  private parseSummaryResponse(response: string): ExecutiveSummary {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        id: `summary-${Date.now()}`,
        title: parsed.title || 'Executive Summary',
        content: parsed.content || '',
        keyPoints: parsed.keyPoints || [],
        actionItems: (parsed.actionItems || []).map((a: any) => ({
          id: a.id || `ai-${Date.now()}`,
          action: a.action || '',
          owner: a.owner || 'TBD',
          deadline: a.deadline,
          priority: a.priority || 'medium',
          status: a.status || 'pending',
        })),
        participants: parsed.participants || [],
        risks: (parsed.risks || []).map((r: any) => ({
          id: r.id || `r-${Date.now()}`,
          description: r.description || '',
          probability: r.probability || 5,
          impact: r.impact || 5,
          mitigation: r.mitigation,
        })),
        recommendations: parsed.recommendations || [],
        nextSteps: parsed.nextSteps || [],
        language: 'en',
        generatedBy: this.modelId,
        createdAt: new Date(),
      };
    } catch (error) {
      logger.error(`Failed to parse summary response: ${error}`);
      
      // Return basic summary on parse failure
      return {
        id: `summary-${Date.now()}`,
        title: 'Executive Summary',
        content: response,
        keyPoints: [],
        actionItems: [],
        participants: [],
        risks: [],
        recommendations: [],
        nextSteps: [],
        language: 'en',
        generatedBy: this.modelId,
        createdAt: new Date(),
      };
    }
  }

  /**
   * Parse minutes response
   */
  private parseMinutesResponse(response: string): ExecutiveSummary {
    return this.parseSummaryResponse(response);
  }

  /**
   * Save summary to database
   */
  private async saveSummary(
    input: SummaryInput,
    summary: ExecutiveSummary
  ): Promise<ExecutiveSummary> {
    try {
      // @ts-ignore - Prisma client will have this after generate
      const saved = await prisma.executiveSummary.create({
        data: {
          organizationId: input.organizationId,
          deliberationId: input.deliberationId,
          decisionId: input.decisionId,
          type: input.type,
          title: summary.title,
          content: summary.content,
          keyPoints: summary.keyPoints as unknown as any,
          actionItems: summary.actionItems as unknown as any,
          participants: summary.participants as unknown as any,
          risks: summary.risks as unknown as any,
          recommendations: summary.recommendations as unknown as any,
          nextSteps: summary.nextSteps as unknown as any,
          language: input.language || 'en',
          generatedBy: summary.generatedBy,
        },
      });

      return {
        ...summary,
        id: saved.id,
        createdAt: saved.createdAt,
      };
    } catch (error) {
      logger.error(`Failed to save summary to database: ${error}`);
      // Return unsaved summary
      return summary;
    }
  }

  /**
   * Get summaries for an organization
   */
  async getSummaries(
    organizationId: string,
    options?: {
      type?: SummaryType;
      limit?: number;
      offset?: number;
    }
  ): Promise<ExecutiveSummary[]> {
    try {
      // @ts-ignore - Prisma client will have this after generate
      const summaries = await prisma.executiveSummary.findMany({
        where: {
          organizationId,
          ...(options?.type && { type: options.type }),
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 20,
        skip: options?.offset || 0,
      });

      return summaries.map((s: any) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        keyPoints: s.keyPoints || [],
        actionItems: s.actionItems || [],
        participants: s.participants || [],
        risks: s.risks || [],
        recommendations: s.recommendations || [],
        nextSteps: s.nextSteps || [],
        language: s.language,
        generatedBy: s.generatedBy,
        createdAt: s.createdAt,
      }));
    } catch (error) {
      logger.error(`Failed to fetch summaries: ${error}`);
      return [];
    }
  }

  /**
   * Get summary by ID
   */
  async getSummaryById(id: string): Promise<ExecutiveSummary | null> {
    try {
      // @ts-ignore - Prisma client will have this after generate
      const s = await prisma.executiveSummary.findUnique({
        where: { id },
      });

      if (!s) return null;

      return {
        id: s.id,
        title: s.title,
        content: s.content,
        keyPoints: (s.keyPoints || []) as unknown as string[],
        actionItems: (s.actionItems || []) as unknown as ActionItem[],
        participants: (s.participants || []) as unknown as string[],
        risks: (s.risks || []) as unknown as Risk[],
        recommendations: (s.recommendations || []) as unknown as string[],
        nextSteps: (s.nextSteps || []) as unknown as NextStep[],
        language: s.language,
        generatedBy: s.generatedBy,
        createdAt: s.createdAt,
      };
    } catch (error) {
      logger.error(`Failed to fetch summary: ${error}`);
      return null;
    }
  }

  /**
   * Export summary as markdown
   */
  exportAsMarkdown(summary: ExecutiveSummary): string {
    let md = `# ${summary.title}\n\n`;
    md += `*Generated: ${summary.createdAt.toISOString().split('T')[0]}*\n\n`;
    md += `---\n\n`;
    md += `## Executive Summary\n\n${summary.content}\n\n`;
    
    if (summary.keyPoints.length > 0) {
      md += `## Key Points\n\n`;
      summary.keyPoints.forEach(p => {
        md += `- ${p}\n`;
      });
      md += '\n';
    }

    if (summary.actionItems.length > 0) {
      md += `## Action Items\n\n`;
      md += `| Action | Owner | Deadline | Priority | Status |\n`;
      md += `|--------|-------|----------|----------|--------|\n`;
      summary.actionItems.forEach(a => {
        md += `| ${a.action} | ${a.owner} | ${a.deadline || 'TBD'} | ${a.priority} | ${a.status} |\n`;
      });
      md += '\n';
    }

    if (summary.risks.length > 0) {
      md += `## Identified Risks\n\n`;
      summary.risks.forEach((r, i) => {
        md += `### ${i + 1}. ${r.description}\n\n`;
        md += `**Why this is a risk:** ${r.rationale || 'Not specified'}\n\n`;
        md += `- **Probability:** ${r.probability}/10\n`;
        md += `- **Impact:** ${r.impact}/10\n`;
        md += `- **Mitigation:** ${r.mitigation || 'TBD'}\n\n`;
      });
    }

    if (summary.recommendations.length > 0) {
      md += `## Recommendations\n\n`;
      summary.recommendations.forEach((r, i) => {
        md += `${i + 1}. ${r}\n`;
      });
      md += '\n';
    }

    if (summary.nextSteps.length > 0) {
      md += `## Next Steps\n\n`;
      summary.nextSteps.forEach((s, i) => {
        const step = typeof s === 'string' ? s : s.step;
        const reason = typeof s === 'string' ? null : s.reason;
        md += `### ${i + 1}. ${step}\n\n`;
        if (reason) {
          md += `**Why:** ${reason}\n\n`;
        }
      });
    }

    if (summary.participants.length > 0) {
      md += `---\n\n`;
      md += `**Participants:** ${summary.participants.join(', ')}\n\n`;
    }

    md += `*Generated by: ${summary.generatedBy}*\n`;

    return md;
  }
}

export const executiveSummaryService = new ExecutiveSummaryService();
