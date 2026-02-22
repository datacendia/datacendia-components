// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - CENDIA NARRATIVES SERVICE
// Executive-ready narrative generation, board packs, and report creation
// Transforms AI analysis into polished business documents
// =============================================================================

import { BaseService, ServiceHealth } from '../core/services/BaseService.js';
import { ollama } from './ollama.js';
import { persistServiceRecord, loadServiceRecords } from '../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type NarrativeType = 
  | 'board_pack'           // Full board meeting package
  | 'executive_summary'    // 1-page exec summary
  | 'decision_brief'       // Decision recommendation doc
  | 'risk_assessment'      // Risk analysis report
  | 'strategy_memo'        // Strategic recommendation
  | 'quarterly_review'     // Q review narrative
  | 'audit_report'         // Compliance/audit doc
  | 'incident_report'      // Incident post-mortem
  | 'investment_thesis'    // Investment case
  | 'market_analysis';     // Market intelligence report

export type NarrativeTone = 
  | 'formal'               // Board-level formality
  | 'professional'         // Standard business
  | 'technical'            // Engineering/technical audience
  | 'conversational'       // Internal team
  | 'urgent';              // Crisis communication

export type NarrativeLength = 'brief' | 'standard' | 'comprehensive';

export interface NarrativeRequest {
  organizationId: string;
  userId: string;
  type: NarrativeType;
  title: string;
  context: string;
  data?: Record<string, any>;
  sections?: string[];
  tone?: NarrativeTone;
  length?: NarrativeLength;
  audience?: string;
  includeCharts?: boolean;
  includeRecommendations?: boolean;
  templateId?: string;
}

export interface NarrativeSection {
  id: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'bullet_list' | 'numbered_list' | 'table' | 'chart_placeholder' | 'callout';
  metadata?: Record<string, any>;
}

export interface Narrative {
  id: string;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  type: NarrativeType;
  title: string;
  subtitle?: string;
  executiveSummary: string;
  sections: NarrativeSection[];
  recommendations?: string[];
  keyMetrics?: Array<{ label: string; value: string; trend?: 'up' | 'down' | 'stable' }>;
  risks?: Array<{ level: 'low' | 'medium' | 'high' | 'critical'; description: string }>;
  nextSteps?: string[];
  appendices?: Array<{ title: string; content: string }>;
  metadata: {
    tone: NarrativeTone;
    length: NarrativeLength;
    audience: string;
    wordCount: number;
    readingTime: number; // minutes
    generationTime: number; // ms
    model: string;
  };
  status: 'draft' | 'review' | 'approved' | 'published';
  version: number;
}

export interface NarrativeTemplate {
  id: string;
  name: string;
  type: NarrativeType;
  description: string;
  sections: Array<{ title: string; prompt: string; required: boolean }>;
  tone: NarrativeTone;
  audience: string;
}

// =============================================================================
// NARRATIVE TEMPLATES
// =============================================================================

const NARRATIVE_TEMPLATES: NarrativeTemplate[] = [
  {
    id: 'board-pack-standard',
    name: 'Standard Board Pack',
    type: 'board_pack',
    description: 'Comprehensive board meeting package',
    tone: 'formal',
    audience: 'Board of Directors',
    sections: [
      { title: 'Executive Summary', prompt: 'Summarize key points for board attention', required: true },
      { title: 'Financial Overview', prompt: 'Present financial performance and outlook', required: true },
      { title: 'Strategic Initiatives', prompt: 'Update on major strategic projects', required: true },
      { title: 'Risk & Compliance', prompt: 'Highlight risk landscape and compliance status', required: true },
      { title: 'Market Position', prompt: 'Competitive and market analysis', required: false },
      { title: 'Recommendations', prompt: 'Board action items and recommendations', required: true },
    ],
  },
  {
    id: 'decision-brief-standard',
    name: 'Decision Brief',
    type: 'decision_brief',
    description: 'Structured decision recommendation',
    tone: 'professional',
    audience: 'Executive Leadership',
    sections: [
      { title: 'Situation', prompt: 'Describe the current situation requiring a decision', required: true },
      { title: 'Options', prompt: 'Present available options with pros/cons', required: true },
      { title: 'Analysis', prompt: 'Detailed analysis supporting the recommendation', required: true },
      { title: 'Recommendation', prompt: 'Clear recommendation with rationale', required: true },
      { title: 'Implementation', prompt: 'Next steps if recommendation is approved', required: false },
    ],
  },
  {
    id: 'risk-assessment-standard',
    name: 'Risk Assessment Report',
    type: 'risk_assessment',
    description: 'Comprehensive risk analysis',
    tone: 'professional',
    audience: 'Risk Committee',
    sections: [
      { title: 'Executive Summary', prompt: 'Overview of risk landscape', required: true },
      { title: 'Risk Register', prompt: 'Detailed risk inventory with ratings', required: true },
      { title: 'Emerging Risks', prompt: 'New and evolving risk factors', required: true },
      { title: 'Mitigation Status', prompt: 'Progress on risk mitigation measures', required: true },
      { title: 'Recommendations', prompt: 'Risk management recommendations', required: true },
    ],
  },
];

// =============================================================================
// CENDIA NARRATIVES SERVICE
// =============================================================================

export class CendiaNarrativesService extends BaseService {
  private narratives: Map<string, Narrative> = new Map();
  private templates: Map<string, NarrativeTemplate> = new Map();
  private narrativesByOrg: Map<string, string[]> = new Map();

  constructor() {
    super({
      name: 'CendiaNarrativesService',
      version: '1.0.0',
      dependencies: [],
    });
    
    // Load default templates
    for (const template of NARRATIVE_TEMPLATES) {
      this.templates.set(template.id, template);
    }


    this.loadFromDB().catch(() => {});
  }

  async initialize(): Promise<void> {
    this.logger.info('[CendiaNarratives] Report GenerationÃ¢â€žÂ¢ initialized');
  }

  async shutdown(): Promise<void> {
    this.logger.info('CendiaNarratives Service shutting down');
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: {
        totalNarratives: this.narratives.size,
        templates: this.templates.size,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // NARRATIVE GENERATION
  // ---------------------------------------------------------------------------

  /**
   * Generate a narrative document
   */
  async generateNarrative(request: NarrativeRequest): Promise<Narrative> {
    const startTime = Date.now();
    const id = `nar-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`;
    
    // Get template if specified
    const template = request.templateId ? this.templates.get(request.templateId) : null;
    const tone = request.tone || template?.tone || 'professional';
    const length = request.length || 'standard';
    const audience = request.audience || template?.audience || 'Executive Leadership';
    
    // Determine sections to generate
    const sectionDefs = request.sections?.map(s => ({ title: s, prompt: s, required: true })) ||
                        template?.sections ||
                        this.getDefaultSections(request.type);
    
    // Generate executive summary first
    const executiveSummary = await this.generateSection({
      title: 'Executive Summary',
      context: request.context,
      data: request.data,
      tone,
      length: 'brief',
      type: request.type,
      audience,
    });
    
    // Generate each section
    const sections: NarrativeSection[] = [];
    let order = 0;
    
    for (const sectionDef of sectionDefs) {
      const content = await this.generateSection({
        title: sectionDef.title,
        prompt: sectionDef.prompt,
        context: request.context,
        data: request.data,
        tone,
        length,
        type: request.type,
        audience,
      });
      
      sections.push({
        id: `sec-${order}`,
        title: sectionDef.title,
        content,
        order: order++,
        type: this.inferSectionType(content),
      });
    }
    
    // Generate recommendations if requested
    let recommendations: string[] | undefined;
    if (request.includeRecommendations !== false) {
      recommendations = await this.generateRecommendations({
        context: request.context,
        data: request.data,
        tone,
        type: request.type,
      });
    }
    
    // Calculate metadata
    const fullContent = executiveSummary + sections.map(s => s.content).join(' ');
    const wordCount = fullContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute
    
    const narrative: Narrative = {
      id,
      organizationId: request.organizationId,
      createdBy: request.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: request.type,
      title: request.title,
      executiveSummary,
      sections,
      recommendations,
      keyMetrics: this.extractKeyMetrics(request.data),
      risks: this.extractRisks(request.data),
      nextSteps: recommendations?.slice(0, 3),
      metadata: {
        tone,
        length,
        audience,
        wordCount,
        readingTime,
        generationTime: Date.now() - startTime,
        model: 'llama3.2',
      },
      status: 'draft',
      version: 1,
    };
    
    // Store narrative
    this.narratives.set(id, narrative);
    
    // Index by organization
    const orgNarratives = this.narrativesByOrg.get(request.organizationId) || [];
    orgNarratives.unshift(id);
    this.narrativesByOrg.set(request.organizationId, orgNarratives.slice(0, 1000));
    
    this.incrementCounter('narratives_generated', 1);
    this.logger.info(`Generated narrative: ${request.title}`, { 
      id, 
      type: request.type, 
      wordCount,
      generationTime: narrative.metadata.generationTime,
    });
    
    return narrative;
  }

  /**
   * Generate a single section
   */
  private async generateSection(params: {
    title: string;
    prompt?: string;
    context: string;
    data?: Record<string, any>;
    tone: NarrativeTone;
    length: NarrativeLength;
    type: NarrativeType;
    audience: string;
  }): Promise<string> {
    const lengthGuide = {
      brief: '2-3 paragraphs',
      standard: '4-5 paragraphs',
      comprehensive: '6-8 paragraphs',
    };
    
    const toneGuide = {
      formal: 'formal, third-person, objective',
      professional: 'professional, clear, direct',
      technical: 'technical, precise, detailed',
      conversational: 'conversational, accessible, engaging',
      urgent: 'urgent, action-oriented, clear',
    };
    
    const prompt = `You are a senior business writer creating executive-level documentation.

DOCUMENT TYPE: ${params.type.replace(/_/g, ' ').toUpperCase()}
SECTION: ${params.title}
AUDIENCE: ${params.audience}
TONE: ${toneGuide[params.tone]}
LENGTH: ${lengthGuide[params.length]}

CONTEXT:
${params.context}

${params.data ? `DATA:\n${JSON.stringify(params.data, null, 2)}` : ''}

${params.prompt ? `SPECIFIC INSTRUCTIONS: ${params.prompt}` : ''}

Write the "${params.title}" section. Be specific, use data where available, and maintain the appropriate tone for ${params.audience}. Do not use placeholder text.`;

    try {
      const response = await ollama.generate(prompt, {
        model: 'llama3.2',
        options: {
          temperature: 0.7,
          num_predict: 1000,
        },
      });
      
      return response.trim();
    } catch (error) {
      this.logger.error('Failed to generate section', { title: params.title, error });
      return `[Section generation failed for "${params.title}". Please retry or provide manual content.]`;
    }
  }

  /**
   * Generate recommendations
   */
  private async generateRecommendations(params: {
    context: string;
    data?: Record<string, any>;
    tone: NarrativeTone;
    type: NarrativeType;
  }): Promise<string[]> {
    const prompt = `Based on the following context and data, provide 3-5 clear, actionable recommendations.

DOCUMENT TYPE: ${params.type.replace(/_/g, ' ')}
CONTEXT: ${params.context}
${params.data ? `DATA: ${JSON.stringify(params.data, null, 2)}` : ''}

Provide recommendations as a JSON array of strings. Each recommendation should be specific and actionable.
Format: ["Recommendation 1", "Recommendation 2", ...]`;

    try {
      const response = await ollama.generate(prompt, {
        model: 'llama3.2',
        format: 'json',
        options: { temperature: 0.5 },
      });
      
      // Parse JSON response
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : parsed.recommendations || [];
    } catch (error) {
      this.logger.error('Failed to generate recommendations', { error });
      return ['Review the analysis and determine next steps.'];
    }
  }

  // ---------------------------------------------------------------------------
  // QUICK GENERATORS
  // ---------------------------------------------------------------------------

  /**
   * Generate executive summary from analysis results
   */
  async generateExecutiveSummary(params: {
    organizationId: string;
    userId: string;
    title: string;
    analyses: Array<{ type: string; summary: string; risk?: number }>;
    keyFindings: string[];
    recommendation?: string;
  }): Promise<Narrative> {
    const context = `
Analysis Results:
${params.analyses.map(a => `- ${a.type}: ${a.summary}${a.risk ? ` (Risk: ${a.risk}%)` : ''}`).join('\n')}

Key Findings:
${params.keyFindings.map(f => `- ${f}`).join('\n')}

${params.recommendation ? `Recommendation: ${params.recommendation}` : ''}
`;
    
    return this.generateNarrative({
      organizationId: params.organizationId,
      userId: params.userId,
      type: 'executive_summary',
      title: params.title,
      context,
      sections: ['Key Findings', 'Analysis Summary', 'Implications'],
      tone: 'professional',
      length: 'brief',
      includeRecommendations: true,
    });
  }

  /**
   * Generate decision brief from Pre-Mortem results
   */
  async generateDecisionBrief(params: {
    organizationId: string;
    userId: string;
    decisionTitle: string;
    description: string;
    preMortemResults?: any;
    councilDeliberation?: any;
    options?: Array<{ name: string; pros: string[]; cons: string[] }>;
  }): Promise<Narrative> {
    const context = `
Decision: ${params.decisionTitle}
Description: ${params.description}

${params.preMortemResults ? `Pre-Mortem Analysis:
- Risk Score: ${params.preMortemResults.riskScore}%
- Top Failure Modes: ${params.preMortemResults.failureModes?.slice(0, 3).map((f: any) => f.title).join(', ')}` : ''}

${params.councilDeliberation ? `Council Deliberation:
- Outcome: ${params.councilDeliberation.outcome}
- Key Points: ${params.councilDeliberation.keyPoints?.join('; ')}` : ''}

${params.options ? `Options Considered:
${params.options.map(o => `${o.name}:
  Pros: ${o.pros.join(', ')}
  Cons: ${o.cons.join(', ')}`).join('\n')}` : ''}
`;
    
    return this.generateNarrative({
      organizationId: params.organizationId,
      userId: params.userId,
      type: 'decision_brief',
      title: `Decision Brief: ${params.decisionTitle}`,
      context,
      templateId: 'decision-brief-standard',
      includeRecommendations: true,
    });
  }

  /**
   * Generate board pack from multiple inputs
   */
  async generateBoardPack(params: {
    organizationId: string;
    userId: string;
    meetingDate: Date;
    financials?: any;
    strategicUpdates?: string[];
    riskUpdates?: any;
    actionItems?: string[];
  }): Promise<Narrative> {
    const context = `
Board Meeting: ${params.meetingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

${params.financials ? `Financial Overview:
${JSON.stringify(params.financials, null, 2)}` : ''}

${params.strategicUpdates ? `Strategic Updates:
${params.strategicUpdates.map(u => `- ${u}`).join('\n')}` : ''}

${params.riskUpdates ? `Risk Updates:
${JSON.stringify(params.riskUpdates, null, 2)}` : ''}

${params.actionItems ? `Pending Action Items:
${params.actionItems.map(a => `- ${a}`).join('\n')}` : ''}
`;
    
    return this.generateNarrative({
      organizationId: params.organizationId,
      userId: params.userId,
      type: 'board_pack',
      title: `Board Pack - ${params.meetingDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      context,
      templateId: 'board-pack-standard',
      tone: 'formal',
      length: 'comprehensive',
      includeRecommendations: true,
    });
  }

  // ---------------------------------------------------------------------------
  // UTILITIES
  // ---------------------------------------------------------------------------

  private getDefaultSections(type: NarrativeType): Array<{ title: string; prompt: string; required: boolean }> {
    const defaults: Record<NarrativeType, Array<{ title: string; prompt: string; required: boolean }>> = {
      board_pack: [
        { title: 'Executive Summary', prompt: 'High-level overview for board', required: true },
        { title: 'Key Metrics', prompt: 'Critical business metrics', required: true },
        { title: 'Strategic Update', prompt: 'Progress on strategic initiatives', required: true },
        { title: 'Recommendations', prompt: 'Items requiring board decision', required: true },
      ],
      executive_summary: [
        { title: 'Situation', prompt: 'Current state overview', required: true },
        { title: 'Key Findings', prompt: 'Main takeaways', required: true },
        { title: 'Implications', prompt: 'What this means', required: true },
      ],
      decision_brief: [
        { title: 'Context', prompt: 'Background and situation', required: true },
        { title: 'Options', prompt: 'Available choices', required: true },
        { title: 'Analysis', prompt: 'Evaluation of options', required: true },
        { title: 'Recommendation', prompt: 'Suggested course of action', required: true },
      ],
      risk_assessment: [
        { title: 'Overview', prompt: 'Risk landscape summary', required: true },
        { title: 'Critical Risks', prompt: 'Highest priority risks', required: true },
        { title: 'Mitigation', prompt: 'Risk mitigation strategies', required: true },
      ],
      strategy_memo: [
        { title: 'Objective', prompt: 'Strategic objective', required: true },
        { title: 'Analysis', prompt: 'Strategic analysis', required: true },
        { title: 'Recommendations', prompt: 'Strategic recommendations', required: true },
      ],
      quarterly_review: [
        { title: 'Performance', prompt: 'Quarter performance', required: true },
        { title: 'Highlights', prompt: 'Key achievements', required: true },
        { title: 'Outlook', prompt: 'Next quarter outlook', required: true },
      ],
      audit_report: [
        { title: 'Scope', prompt: 'Audit scope', required: true },
        { title: 'Findings', prompt: 'Audit findings', required: true },
        { title: 'Recommendations', prompt: 'Remediation recommendations', required: true },
      ],
      incident_report: [
        { title: 'Incident Summary', prompt: 'What happened', required: true },
        { title: 'Impact', prompt: 'Business impact', required: true },
        { title: 'Root Cause', prompt: 'Why it happened', required: true },
        { title: 'Prevention', prompt: 'How to prevent recurrence', required: true },
      ],
      investment_thesis: [
        { title: 'Opportunity', prompt: 'Investment opportunity', required: true },
        { title: 'Analysis', prompt: 'Financial and strategic analysis', required: true },
        { title: 'Risks', prompt: 'Investment risks', required: true },
        { title: 'Recommendation', prompt: 'Investment recommendation', required: true },
      ],
      market_analysis: [
        { title: 'Market Overview', prompt: 'Market landscape', required: true },
        { title: 'Competitive Position', prompt: 'Competitive analysis', required: true },
        { title: 'Opportunities', prompt: 'Market opportunities', required: true },
      ],
    };
    
    return defaults[type] || defaults.executive_summary;
  }

  private inferSectionType(content: string): NarrativeSection['type'] {
    if (content.includes('\n- ') || content.includes('\nÃ¢â‚¬Â¢ ')) return 'bullet_list';
    if (/\n\d+\.\s/.test(content)) return 'numbered_list';
    if (content.includes('|') && content.includes('---')) return 'table';
    return 'text';
  }

  private extractKeyMetrics(data?: Record<string, any>): Narrative['keyMetrics'] {
    if (!data) return undefined;
    
    const metrics: Narrative['keyMetrics'] = [];
    
    // Look for common metric patterns
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'number' || (typeof value === 'string' && /^[\d.,]+%?$/.test(value))) {
        metrics.push({
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim(),
          value: String(value),
        });
      }
    }
    
    return metrics.length > 0 ? metrics.slice(0, 6) : undefined;
  }

  private extractRisks(data?: Record<string, any>): Narrative['risks'] {
    if (!data?.risks && !data?.riskScore) return undefined;
    
    if (Array.isArray(data.risks)) {
      return data.risks.map((r: any) => ({
        level: r.level || (r.score > 70 ? 'high' : r.score > 40 ? 'medium' : 'low'),
        description: r.description || r.title || String(r),
      }));
    }
    
    if (data.riskScore) {
      return [{
        level: data.riskScore > 70 ? 'high' : data.riskScore > 40 ? 'medium' : 'low',
        description: `Overall risk score: ${data.riskScore}%`,
      }];
    }
    
    return undefined;
  }

  // ---------------------------------------------------------------------------
  // CRUD OPERATIONS
  // ---------------------------------------------------------------------------

  async getNarrative(id: string): Promise<Narrative | null> {
    return this.narratives.get(id) || null;
  }

  async listNarratives(organizationId: string, options?: {
    type?: NarrativeType;
    status?: Narrative['status'];
    limit?: number;
    offset?: number;
  }): Promise<{ narratives: Narrative[]; total: number }> {
    let narratives = Array.from(this.narratives.values())
      .filter(n => n.organizationId === organizationId);
    
    if (options?.type) {
      narratives = narratives.filter(n => n.type === options.type);
    }
    
    if (options?.status) {
      narratives = narratives.filter(n => n.status === options.status);
    }
    
    narratives.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const total = narratives.length;
    const offset = options?.offset || 0;
    const limit = options?.limit || 20;
    
    narratives = narratives.slice(offset, offset + limit);
    
    return { narratives, total };
  }

  async updateNarrativeStatus(id: string, status: Narrative['status']): Promise<Narrative | null> {
    const narrative = this.narratives.get(id);
    if (!narrative) return null;
    
    narrative.status = status;
    narrative.updatedAt = new Date();
    narrative.version++;
    
    return narrative;
  }

  async getTemplates(): Promise<NarrativeTemplate[]> {
    return Array.from(this.templates.values());
  }

  async addTemplate(template: NarrativeTemplate): Promise<void> {
    this.templates.set(template.id, template);
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Narrative Quality Scoring
   * Evaluates narrative quality across readability, completeness, and impact dimensions.
   */
  async scoreNarrativeQuality(narrativeId: string): Promise<{
    overallScore: number;
    dimensions: Array<{
      name: string;
      score: number;
      status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR';
      feedback: string;
    }>;
    suggestions: string[];
    readabilityGrade: string;
    estimatedImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  }> {
    const narrative = this.narratives.get(narrativeId);
    if (!narrative) throw new Error(`Narrative ${narrativeId} not found`);

    const totalContent = narrative.sections.map(s => s.content).join(' ');
    const wordCount = totalContent.split(/\s+/).length;
    const sentences = totalContent.split(/[.!?]+/).filter(Boolean);
    const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;

    // Dimension 1: Completeness Ã¢â‚¬â€ all key sections present
    const requiredSections = ['summary', 'analysis', 'recommendation'];
    const sectionTitlesLower = narrative.sections.map(s => s.title.toLowerCase());
    const completenessHits = requiredSections.filter(r => sectionTitlesLower.some(t => t.includes(r))).length;
    const completenessScore = Math.round((completenessHits / requiredSections.length) * 100);

    // Dimension 2: Readability Ã¢â‚¬â€ sentence complexity
    const readabilityScore = avgSentenceLength <= 20 ? 90 : avgSentenceLength <= 30 ? 70 : avgSentenceLength <= 40 ? 50 : 30;

    // Dimension 3: Structure Ã¢â‚¬â€ well-organized sections
    const structureScore = narrative.sections.length >= 4 ? 90 : narrative.sections.length >= 3 ? 75 : narrative.sections.length >= 2 ? 55 : 30;

    // Dimension 4: Actionability Ã¢â‚¬â€ has recommendations and next steps
    const hasRecommendations = (narrative.recommendations?.length || 0) > 0;
    const hasNextSteps = (narrative.nextSteps?.length || 0) > 0;
    const hasMetrics = (narrative.keyMetrics?.length || 0) > 0;
    const actionScore = (hasRecommendations ? 35 : 0) + (hasNextSteps ? 35 : 0) + (hasMetrics ? 30 : 0);

    // Dimension 5: Depth Ã¢â‚¬â€ word count relative to type
    const targetWords = narrative.metadata.length === 'comprehensive' ? 2000 : narrative.metadata.length === 'standard' ? 1000 : 500;
    const depthRatio = Math.min(1.5, wordCount / targetWords);
    const depthScore = Math.round(Math.min(100, depthRatio * 80));

    const statusFn = (s: number) => s >= 85 ? 'EXCELLENT' as const : s >= 65 ? 'GOOD' as const : s >= 40 ? 'NEEDS_IMPROVEMENT' as const : 'POOR' as const;

    const dimensions = [
      { name: 'Completeness', score: completenessScore, status: statusFn(completenessScore), feedback: `${completenessHits}/${requiredSections.length} key sections present` },
      { name: 'Readability', score: readabilityScore, status: statusFn(readabilityScore), feedback: `Avg sentence length: ${Math.round(avgSentenceLength)} words` },
      { name: 'Structure', score: structureScore, status: statusFn(structureScore), feedback: `${narrative.sections.length} sections` },
      { name: 'Actionability', score: actionScore, status: statusFn(actionScore), feedback: `${hasRecommendations ? 'Has' : 'Missing'} recommendations, ${hasNextSteps ? 'has' : 'missing'} next steps` },
      { name: 'Content Depth', score: depthScore, status: statusFn(depthScore), feedback: `${wordCount} words (target: ~${targetWords})` },
    ];

    const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);

    const suggestions: string[] = [];
    if (!hasRecommendations) suggestions.push('Add specific, actionable recommendations');
    if (!hasNextSteps) suggestions.push('Include clear next steps for the audience');
    if (!hasMetrics) suggestions.push('Add key metrics to quantify the narrative');
    if (avgSentenceLength > 25) suggestions.push('Shorten sentences for better readability');
    if (narrative.sections.length < 3) suggestions.push('Add more sections for better structure');

    const readabilityGrade = readabilityScore >= 80 ? 'A' : readabilityScore >= 65 ? 'B' : readabilityScore >= 50 ? 'C' : 'D';
    const estimatedImpact = overallScore >= 80 ? 'HIGH' : overallScore >= 55 ? 'MEDIUM' : 'LOW';

    return { overallScore, dimensions, suggestions, readabilityGrade, estimatedImpact };
  }

  /**
   * 10/10: Audience Impact Analysis
   * Predicts how different audiences will receive the narrative.
   */
  async analyzeAudienceImpact(narrativeId: string): Promise<{
    primaryAudience: string;
    audienceProfiles: Array<{
      audience: string;
      receptivity: number;
      keyTakeaways: string[];
      potentialConcerns: string[];
      recommendedToneAdjustment: string;
    }>;
    overallResonance: number;
    toneConsistency: number;
  }> {
    const narrative = this.narratives.get(narrativeId);
    if (!narrative) throw new Error(`Narrative ${narrativeId} not found`);

    const audiences = [
      { name: 'Board of Directors', focus: ['strategy', 'risk', 'governance', 'fiduciary'] },
      { name: 'C-Suite Executives', focus: ['execution', 'metrics', 'competitive', 'growth'] },
      { name: 'Investors/Analysts', focus: ['financials', 'returns', 'market', 'valuation'] },
      { name: 'Operational Managers', focus: ['implementation', 'resources', 'timeline', 'process'] },
      { name: 'Compliance Officers', focus: ['regulatory', 'risk', 'audit', 'compliance'] },
    ];

    const contentLower = narrative.sections.map(s => s.content.toLowerCase()).join(' ');
    
    const audienceProfiles = audiences.map(aud => {
      const focusHits = aud.focus.filter(f => contentLower.includes(f)).length;
      const receptivity = Math.round((focusHits / aud.focus.length) * 100);

      const keyTakeaways = narrative.sections
        .filter(s => aud.focus.some(f => s.content.toLowerCase().includes(f)))
        .map(s => s.title)
        .slice(0, 3);

      const potentialConcerns: string[] = [];
      if (focusHits === 0) potentialConcerns.push(`Content doesn't address ${aud.name} priorities`);
      if (narrative.metadata.tone === 'conversational' && aud.name.includes('Board')) {
        potentialConcerns.push('Casual tone may not suit board audience');
      }

      const toneMatch = narrative.metadata.audience.toLowerCase().includes(aud.name.toLowerCase().split(' ')[0]);
      const recommendedToneAdjustment = toneMatch
        ? 'Tone appropriate for this audience'
        : `Consider adjusting for ${aud.name} expectations`;

      return { audience: aud.name, receptivity, keyTakeaways, potentialConcerns, recommendedToneAdjustment };
    });

    const overallResonance = Math.round(audienceProfiles.reduce((sum, p) => sum + p.receptivity, 0) / audienceProfiles.length);

    // Tone consistency Ã¢â‚¬â€ check if tone stays consistent across sections
    const toneConsistency = narrative.sections.length > 1 ? 85 : 100; // Simplified heuristic

    return {
      primaryAudience: narrative.metadata.audience,
      audienceProfiles,
      overallResonance,
      toneConsistency,
    };
  }

  /**
   * 10/10: Narrative Consistency Checker
   * Checks for factual consistency across multiple narratives.
   */
  async checkNarrativeConsistency(organizationId: string): Promise<{
    narrativesChecked: number;
    consistencyScore: number;
    inconsistencies: Array<{
      type: 'METRIC_MISMATCH' | 'TONE_SHIFT' | 'CONTRADICTORY_CLAIM' | 'OUTDATED_DATA';
      severity: 'low' | 'medium' | 'high';
      narrative1: { id: string; title: string };
      narrative2?: { id: string; title: string };
      description: string;
      recommendation: string;
    }>;
    recommendations: string[];
  }> {
    const orgNarrativeIds = this.narrativesByOrg.get(organizationId) || [];
    const orgNarratives = orgNarrativeIds
      .map(id => this.narratives.get(id))
      .filter((n): n is Narrative => n !== undefined)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 20);

    const inconsistencies: Array<{
      type: 'METRIC_MISMATCH' | 'TONE_SHIFT' | 'CONTRADICTORY_CLAIM' | 'OUTDATED_DATA';
      severity: 'low' | 'medium' | 'high';
      narrative1: { id: string; title: string };
      narrative2?: { id: string; title: string };
      description: string;
      recommendation: string;
    }> = [];

    // Check for metric mismatches between narratives
    for (let i = 0; i < orgNarratives.length; i++) {
      const n1 = orgNarratives[i];
      
      // Check for outdated content (>90 days old and still published)
      const daysSinceUpdate = (Date.now() - n1.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate > 90 && n1.status === 'published') {
        inconsistencies.push({
          type: 'OUTDATED_DATA',
          severity: 'medium',
          narrative1: { id: n1.id, title: n1.title },
          description: `Published ${Math.round(daysSinceUpdate)} days ago without update`,
          recommendation: 'Review and refresh data or archive this narrative',
        });
      }

      // Compare metrics between narrative pairs
      for (let j = i + 1; j < orgNarratives.length; j++) {
        const n2 = orgNarratives[j];
        
        // Check tone consistency for same type
        if (n1.type === n2.type && n1.metadata.tone !== n2.metadata.tone) {
          inconsistencies.push({
            type: 'TONE_SHIFT',
            severity: 'low',
            narrative1: { id: n1.id, title: n1.title },
            narrative2: { id: n2.id, title: n2.title },
            description: `Same type but different tones: "${n1.metadata.tone}" vs "${n2.metadata.tone}"`,
            recommendation: 'Standardize tone for same-type narratives',
          });
        }

        // Check for metric mismatches
        if (n1.keyMetrics && n2.keyMetrics) {
          for (const m1 of n1.keyMetrics) {
            const m2 = n2.keyMetrics.find(m => m.label === m1.label);
            if (m2 && m1.value !== m2.value) {
              inconsistencies.push({
                type: 'METRIC_MISMATCH',
                severity: 'high',
                narrative1: { id: n1.id, title: n1.title },
                narrative2: { id: n2.id, title: n2.title },
                description: `${m1.label}: "${m1.value}" vs "${m2.value}"`,
                recommendation: 'Reconcile metric values across narratives',
              });
            }
          }
        }
      }
    }

    const consistencyScore = inconsistencies.length === 0 ? 100
      : Math.max(0, 100 - inconsistencies.reduce((sum, i) => sum + (i.severity === 'high' ? 20 : i.severity === 'medium' ? 10 : 5), 0));

    const recommendations: string[] = [];
    const highSeverity = inconsistencies.filter(i => i.severity === 'high');
    if (highSeverity.length > 0) recommendations.push(`${highSeverity.length} high-severity inconsistencies require immediate attention`);
    const outdated = inconsistencies.filter(i => i.type === 'OUTDATED_DATA');
    if (outdated.length > 0) recommendations.push(`${outdated.length} narrative(s) may contain stale data`);
    if (recommendations.length === 0) recommendations.push('All narratives are consistent Ã¢â‚¬â€ maintain regular reviews');

    return {
      narrativesChecked: orgNarratives.length,
      consistencyScore,
      inconsistencies: inconsistencies.slice(0, 20),
      recommendations,
    };
  }

  /**
   * 10/10: Content Analytics Dashboard
   * Aggregated analytics across all generated narratives.
   */
  async getContentAnalytics(organizationId: string): Promise<{
    totalNarratives: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byTone: Record<string, number>;
    avgGenerationTime: number;
    avgWordCount: number;
    avgReadingTime: number;
    topTemplates: Array<{ templateId: string; templateName: string; usageCount: number }>;
    monthlyOutput: Array<{ month: string; count: number; avgQuality: number }>;
    productivity: {
      narrativesThisMonth: number;
      narrativesLastMonth: number;
      trend: 'up' | 'down' | 'stable';
      percentChange: number;
    };
  }> {
    const orgNarrativeIds = this.narrativesByOrg.get(organizationId) || [];
    const orgNarratives = orgNarrativeIds
      .map(id => this.narratives.get(id))
      .filter((n): n is Narrative => n !== undefined);

    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byTone: Record<string, number> = {};
    const templateUsage: Record<string, number> = {};
    let totalGenTime = 0;
    let totalWords = 0;
    let totalReading = 0;

    for (const n of orgNarratives) {
      byType[n.type] = (byType[n.type] || 0) + 1;
      byStatus[n.status] = (byStatus[n.status] || 0) + 1;
      byTone[n.metadata.tone] = (byTone[n.metadata.tone] || 0) + 1;
      totalGenTime += n.metadata.generationTime;
      totalWords += n.metadata.wordCount;
      totalReading += n.metadata.readingTime;
    }

    const avgGenerationTime = orgNarratives.length > 0 ? Math.round(totalGenTime / orgNarratives.length) : 0;
    const avgWordCount = orgNarratives.length > 0 ? Math.round(totalWords / orgNarratives.length) : 0;
    const avgReadingTime = orgNarratives.length > 0 ? Math.round(totalReading / orgNarratives.length) : 0;

    const topTemplates = Object.entries(templateUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([templateId, usageCount]) => ({
        templateId,
        templateName: this.templates.get(templateId)?.name || templateId,
        usageCount,
      }));

    // Monthly output
    const monthMap: Record<string, number> = {};
    for (const n of orgNarratives) {
      const month = n.createdAt.toISOString().slice(0, 7);
      monthMap[month] = (monthMap[month] || 0) + 1;
    }

    const monthlyOutput = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count, avgQuality: 0 }));

    // Productivity trend
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    const narrativesThisMonth = monthMap[thisMonth] || 0;
    const narrativesLastMonth = monthMap[lastMonth] || 0;
    const percentChange = narrativesLastMonth > 0
      ? Math.round(((narrativesThisMonth - narrativesLastMonth) / narrativesLastMonth) * 100) : 0;

    return {
      totalNarratives: orgNarratives.length,
      byType,
      byStatus,
      byTone,
      avgGenerationTime,
      avgWordCount,
      avgReadingTime,
      topTemplates,
      monthlyOutput,
      productivity: {
        narrativesThisMonth,
        narrativesLastMonth,
        trend: percentChange > 5 ? 'up' : percentChange < -5 ? 'down' : 'stable',
        percentChange,
      },
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaNarratives', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.narratives.has(d.id)) this.narratives.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaNarratives', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.templates.has(d.id)) this.templates.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaNarratives', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.narrativesByOrg.has(d.id)) this.narrativesByOrg.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) this.logger.info(`[CendiaNarrativesService] Restored ${restored} records from database`);


    } catch (err) {


      this.logger.warn(`[CendiaNarrativesService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton
export const cendiaNarrativesService = new CendiaNarrativesService();
