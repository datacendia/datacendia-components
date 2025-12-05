// =============================================================================
// DATACENDIA PLATFORM - CENDIA NARRATIVES SERVICE
// Executive-ready narrative generation, board packs, and report creation
// Transforms AI analysis into polished business documents
// =============================================================================

import { BaseService, ServiceHealth } from '../core/services/BaseService.js';
import { ollama } from './ollama.js';

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
  }

  async initialize(): Promise<void> {
    this.logger.info('CendiaNarratives Service initialized - Report generation ready');
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
    const id = `nar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
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
    if (content.includes('\n- ') || content.includes('\n• ')) return 'bullet_list';
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
}

// Export singleton
export const cendiaNarrativesService = new CendiaNarrativesService();
