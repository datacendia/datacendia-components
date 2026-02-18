// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAINVENTUMÃ¢â€žÂ¢ - RESEARCH & DEVELOPMENT / INTELLECTUAL PROPERTY
// "The Patent Factory" - AI-powered innovation capture and IP management
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface IdeaCapture {
  id: string;
  title: string;
  description: string;
  source: 'meeting' | 'document' | 'chat' | 'whiteboard' | 'submission' | 'research';
  submitter: string;
  department: string;
  category: string;
  tags: string[];
  noveltyScore: number; // 0-100
  feasibilityScore: number; // 0-100
  businessValue: number; // 0-100
  patentPotential: boolean;
  status: 'captured' | 'evaluating' | 'approved' | 'in_development' | 'patented' | 'archived';
  linkedPatents: string[];
  linkedProjects: string[];
  aiAnalysis?: IdeaAnalysis;
  capturedAt: Date;
  updatedAt: Date;
}

export interface IdeaAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  similarIdeas: { title: string; similarity: number }[];
  recommendations: string[];
}

export interface Patent {
  id: string;
  type: 'utility' | 'design' | 'provisional' | 'continuation' | 'divisional';
  title: string;
  abstract: string;
  inventors: Inventor[];
  assignee: string;
  status: 'draft' | 'filed' | 'pending' | 'published' | 'granted' | 'rejected' | 'abandoned';
  filingDate?: Date;
  publicationDate?: Date;
  grantDate?: Date;
  expirationDate?: Date;
  applicationNumber?: string;
  patentNumber?: string;
  claims: PatentClaim[];
  priorArt: PriorArt[];
  jurisdictions: string[];
  maintenanceFees: MaintenanceFee[];
  linkedIdeas: string[];
  monetization?: PatentMonetization;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventor {
  name: string;
  email: string;
  contribution: number; // percentage
  assignmentSigned: boolean;
}

export interface PatentClaim {
  number: number;
  type: 'independent' | 'dependent';
  text: string;
  dependsOn?: number;
}

export interface PriorArt {
  reference: string;
  type: 'patent' | 'publication' | 'product' | 'other';
  relevance: 'high' | 'medium' | 'low';
  differentiation: string;
  discoveredAt: Date;
}

export interface MaintenanceFee {
  dueDate: Date;
  amount: number;
  jurisdiction: string;
  status: 'upcoming' | 'paid' | 'overdue' | 'grace_period';
  paidDate?: Date;
}

export interface PatentMonetization {
  strategy: 'licensing' | 'enforcement' | 'sale' | 'cross_license' | 'defensive';
  estimatedValue: number;
  activeDeals: LicenseDeal[];
  annualRevenue: number;
}

export interface LicenseDeal {
  id: string;
  licensee: string;
  type: 'exclusive' | 'non_exclusive' | 'field_of_use';
  territory: string[];
  startDate: Date;
  endDate: Date;
  upfrontFee: number;
  royaltyRate: number;
  minimumRoyalty: number;
  status: 'negotiating' | 'active' | 'expired' | 'terminated';
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  status: 'proposed' | 'approved' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget: number;
  spent: number;
  team: ProjectTeamMember[];
  milestones: ResearchMilestone[];
  deliverables: Deliverable[];
  linkedIdeas: string[];
  linkedPatents: string[];
  publications: Publication[];
  startDate?: Date;
  targetCompletion?: Date;
  actualCompletion?: Date;
  createdAt: Date;
}

export interface ProjectTeamMember {
  name: string;
  role: string;
  allocation: number; // percentage
  expertise: string[];
}

export interface ResearchMilestone {
  name: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  completedDate?: Date;
  deliverables: string[];
}

export interface Deliverable {
  name: string;
  type: 'prototype' | 'report' | 'patent' | 'publication' | 'dataset' | 'software';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: Date;
  completedDate?: Date;
  url?: string;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  type: 'journal' | 'conference' | 'whitepaper' | 'technical_report';
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'published' | 'rejected';
  submittedDate?: Date;
  publishedDate?: Date;
  doi?: string;
  citations: number;
}

export interface IPPortfolio {
  totalPatents: number;
  patentsByStatus: Record<string, number>;
  patentsByCategory: { category: string; count: number; value: number }[];
  totalValue: number;
  annualRevenue: number;
  maintenanceCosts: number;
  upcomingFees: MaintenanceFee[];
  expiringPatents: Patent[];
  portfolioHealth: number;
  recommendations: string[];
}

export interface InnovationMetrics {
  period: string;
  ideasCaptured: number;
  ideasApproved: number;
  patentsFiled: number;
  patentsGranted: number;
  projectsActive: number;
  projectsCompleted: number;
  rdSpend: number;
  ipRevenue: number;
  innovationRate: number;
  patentPendingTime: number;
  ideaToPatentConversion: number;
  topCategories: { category: string; ideas: number; patents: number }[];
}

export interface ProvisionalPatentDraft {
  ideaId: string;
  title: string;
  background: string;
  summary: string;
  detailedDescription: string;
  claims: string[];
  figures: string[];
  priorArtAnalysis: string;
  filingRecommendation: 'file_immediately' | 'file_soon' | 'needs_work' | 'not_recommended';
  strengthScore: number;
  aiGenerated: boolean;
  generatedAt: Date;
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaInventumService {
  private ideas: Map<string, IdeaCapture> = new Map();
  private patents: Map<string, Patent> = new Map();
  private projects: Map<string, ResearchProject> = new Map();

  constructor() {
    logger.info('CendiaInventumÃ¢â€žÂ¢ initialized - The Patent Factory is ready');
  }

  // ---------------------------------------------------------------------------
  // IDEA CAPTURE
  // ---------------------------------------------------------------------------

  async captureIdea(idea: Omit<IdeaCapture, 'id' | 'noveltyScore' | 'feasibilityScore' | 'businessValue' | 'patentPotential' | 'status' | 'linkedPatents' | 'linkedProjects' | 'capturedAt' | 'updatedAt'>): Promise<IdeaCapture> {
    // Analyze the idea
    const analysis = await this.analyzeIdea(idea.title, idea.description, idea.category);

    const newIdea: IdeaCapture = {
      ...idea,
      id: `idea-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      noveltyScore: analysis.noveltyScore,
      feasibilityScore: analysis.feasibilityScore,
      businessValue: analysis.businessValue,
      patentPotential: analysis.patentPotential,
      status: 'captured',
      linkedPatents: [],
      linkedProjects: [],
      aiAnalysis: analysis.analysis,
      capturedAt: new Date(),
      updatedAt: new Date(),
    };

    this.ideas.set(newIdea.id, newIdea);

    if (newIdea.patentPotential) {
      logger.info(`CendiaInventum: Patent-potential idea captured - ${newIdea.title}`);
    } else {
      logger.info(`CendiaInventum: Idea captured - ${newIdea.title}`);
    }

    return newIdea;
  }

  private async analyzeIdea(title: string, description: string, category: string): Promise<{
    noveltyScore: number;
    feasibilityScore: number;
    businessValue: number;
    patentPotential: boolean;
    analysis: IdeaAnalysis;
  }> {
    const prompt = `You are CendiaInventumÃ¢â€žÂ¢, an AI R&D and IP management system.

Analyze this innovation idea for patent potential:

TITLE: ${title}
DESCRIPTION: ${description}
CATEGORY: ${category}

Provide comprehensive analysis in JSON:
{
  "noveltyScore": 0-100,
  "feasibilityScore": 0-100,
  "businessValue": 0-100,
  "patentPotential": boolean,
  "analysis": {
    "summary": "brief summary",
    "strengths": ["strength 1"],
    "weaknesses": ["weakness 1"],
    "opportunities": ["opportunity 1"],
    "threats": ["threat 1"],
    "similarIdeas": [{"title": "similar idea", "similarity": 0-100}],
    "recommendations": ["recommendation 1"]
  }
}

Consider:
- Novelty: Is this truly new/non-obvious?
- Feasibility: Can this be implemented with current technology?
- Business Value: Market potential and competitive advantage
- Patent Potential: Novel, non-obvious, useful, and patentable subject matter`;

    let analysisData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('patent_drafting') });
        analysisData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaInventum: AI idea analysis unavailable');
    }

    return {
      noveltyScore: analysisData.noveltyScore || 60,
      feasibilityScore: analysisData.feasibilityScore || 70,
      businessValue: analysisData.businessValue || 50,
      patentPotential: analysisData.patentPotential || (analysisData.noveltyScore > 70),
      analysis: analysisData.analysis || {
        summary: 'Analysis pending detailed review',
        strengths: ['Initial concept shows promise'],
        weaknesses: ['Requires further development'],
        opportunities: ['Potential market applications'],
        threats: ['Competitive landscape unknown'],
        similarIdeas: [],
        recommendations: ['Conduct prior art search', 'Develop proof of concept'],
      },
    };
  }

  updateIdeaStatus(ideaId: string, status: IdeaCapture['status']): IdeaCapture | null {
    const idea = this.ideas.get(ideaId);
    if (!idea) return null;

    idea.status = status;
    idea.updatedAt = new Date();

    logger.info(`CendiaInventum: Idea ${ideaId} status updated to ${status}`);
    return idea;
  }

  getIdea(ideaId: string): IdeaCapture | null {
    return this.ideas.get(ideaId) || null;
  }

  getAllIdeas(): IdeaCapture[] {
    return Array.from(this.ideas.values());
  }

  getIdeasByStatus(status: IdeaCapture['status']): IdeaCapture[] {
    return Array.from(this.ideas.values()).filter(i => i.status === status);
  }

  getPatentableIdeas(): IdeaCapture[] {
    return Array.from(this.ideas.values()).filter(i => i.patentPotential && i.status !== 'patented' && i.status !== 'archived');
  }

  // ---------------------------------------------------------------------------
  // PATENT MANAGEMENT
  // ---------------------------------------------------------------------------

  async generateProvisionalPatent(ideaId: string): Promise<ProvisionalPatentDraft> {
    const idea = this.ideas.get(ideaId);
    if (!idea) throw new Error('Idea not found');

    const prompt = `You are CendiaInventumÃ¢â€žÂ¢, generating a provisional patent draft.

IDEA: ${idea.title}
DESCRIPTION: ${idea.description}
CATEGORY: ${idea.category}
NOVELTY SCORE: ${idea.noveltyScore}

Generate a provisional patent draft in JSON:
{
  "title": "formal patent title",
  "background": "background of the invention (2-3 paragraphs)",
  "summary": "summary of the invention (1-2 paragraphs)",
  "detailedDescription": "detailed description (3-5 paragraphs)",
  "claims": ["claim 1 (independent)", "claim 2 (dependent)", "claim 3"],
  "figures": ["Figure 1: description", "Figure 2: description"],
  "priorArtAnalysis": "analysis of prior art and differentiation",
  "filingRecommendation": "file_immediately|file_soon|needs_work|not_recommended",
  "strengthScore": 0-100
}`;

    let patentData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('patent_drafting') });
        patentData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaInventum: AI patent generation unavailable');
    }

    const draft: ProvisionalPatentDraft = {
      ideaId,
      title: patentData.title || `System and Method for ${idea.title}`,
      background: patentData.background || `The present invention relates to ${idea.category}. ${idea.description}`,
      summary: patentData.summary || `A novel ${idea.category.toLowerCase()} system and method is disclosed.`,
      detailedDescription: patentData.detailedDescription || idea.description,
      claims: patentData.claims || [
        `A method comprising: ${idea.description.substring(0, 100)}...`,
        'The method of claim 1, further comprising additional steps.',
        `A system configured to implement the method of claim 1.`,
      ],
      figures: patentData.figures || ['Figure 1: System overview diagram'],
      priorArtAnalysis: patentData.priorArtAnalysis || 'Prior art search recommended before filing.',
      filingRecommendation: patentData.filingRecommendation || (idea.noveltyScore > 75 ? 'file_soon' : 'needs_work'),
      strengthScore: patentData.strengthScore || idea.noveltyScore,
      aiGenerated: true,
      generatedAt: new Date(),
    };

    logger.info(`CendiaInventum: Provisional patent draft generated for idea ${ideaId}`);
    return draft;
  }

  createPatent(patent: Omit<Patent, 'id' | 'createdAt' | 'updatedAt'>): Patent {
    const newPatent: Patent = {
      ...patent,
      id: `pat-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.patents.set(newPatent.id, newPatent);

    // Link to ideas
    for (const ideaId of newPatent.linkedIdeas) {
      const idea = this.ideas.get(ideaId);
      if (idea) {
        idea.linkedPatents.push(newPatent.id);
        if (newPatent.status === 'granted') {
          idea.status = 'patented';
        }
      }
    }

    logger.info(`CendiaInventum: Patent created - ${newPatent.title}`);
    return newPatent;
  }

  updatePatentStatus(patentId: string, status: Patent['status'], details?: Partial<Patent>): Patent | null {
    const patent = this.patents.get(patentId);
    if (!patent) return null;

    patent.status = status;
    if (details) {
      Object.assign(patent, details);
    }
    patent.updatedAt = new Date();

    // Update filing/grant dates based on status
    if (status === 'filed' && !patent.filingDate) {
      patent.filingDate = new Date();
    }
    if (status === 'granted' && !patent.grantDate) {
      patent.grantDate = new Date();
      // Calculate expiration (typically 20 years from filing)
      if (patent.filingDate) {
        patent.expirationDate = new Date(patent.filingDate);
        patent.expirationDate.setFullYear(patent.expirationDate.getFullYear() + 20);
      }
    }

    logger.info(`CendiaInventum: Patent ${patentId} status updated to ${status}`);
    return patent;
  }

  addPriorArt(patentId: string, priorArt: Omit<PriorArt, 'discoveredAt'>): Patent | null {
    const patent = this.patents.get(patentId);
    if (!patent) return null;

    patent.priorArt.push({
      ...priorArt,
      discoveredAt: new Date(),
    });
    patent.updatedAt = new Date();

    return patent;
  }

  getPatent(patentId: string): Patent | null {
    return this.patents.get(patentId) || null;
  }

  getAllPatents(): Patent[] {
    return Array.from(this.patents.values());
  }

  getPatentsByStatus(status: Patent['status']): Patent[] {
    return Array.from(this.patents.values()).filter(p => p.status === status);
  }

  // ---------------------------------------------------------------------------
  // MAINTENANCE FEE TRACKING
  // ---------------------------------------------------------------------------

  getUpcomingMaintenanceFees(days: number = 90): { patent: Patent; fee: MaintenanceFee }[] {
    const upcoming: { patent: Patent; fee: MaintenanceFee }[] = [];
    const threshold = Date.now() + days * 24 * 60 * 60 * 1000;

    for (const patent of this.patents.values()) {
      for (const fee of patent.maintenanceFees) {
        if (fee.status === 'upcoming' && fee.dueDate.getTime() <= threshold) {
          upcoming.push({ patent, fee });
        }
      }
    }

    return upcoming.sort((a, b) => a.fee.dueDate.getTime() - b.fee.dueDate.getTime());
  }

  recordMaintenancePayment(patentId: string, feeIndex: number): Patent | null {
    const patent = this.patents.get(patentId);
    if (!patent || !patent.maintenanceFees[feeIndex]) return null;

    patent.maintenanceFees[feeIndex].status = 'paid';
    patent.maintenanceFees[feeIndex].paidDate = new Date();
    patent.updatedAt = new Date();

    logger.info(`CendiaInventum: Maintenance fee paid for patent ${patentId}`);
    return patent;
  }

  // ---------------------------------------------------------------------------
  // RESEARCH PROJECTS
  // ---------------------------------------------------------------------------

  createProject(project: Omit<ResearchProject, 'id' | 'spent' | 'publications' | 'createdAt'>): ResearchProject {
    const newProject: ResearchProject = {
      ...project,
      id: `proj-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      spent: 0,
      publications: [],
      createdAt: new Date(),
    };
    this.projects.set(newProject.id, newProject);

    // Link to ideas
    for (const ideaId of newProject.linkedIdeas) {
      const idea = this.ideas.get(ideaId);
      if (idea) {
        idea.linkedProjects.push(newProject.id);
        if (idea.status === 'captured' || idea.status === 'approved') {
          idea.status = 'in_development';
        }
      }
    }

    logger.info(`CendiaInventum: Research project created - ${newProject.title}`);
    return newProject;
  }

  updateProjectStatus(projectId: string, status: ResearchProject['status']): ResearchProject | null {
    const project = this.projects.get(projectId);
    if (!project) return null;

    project.status = status;
    if (status === 'completed') {
      project.actualCompletion = new Date();
    }

    return project;
  }

  updateMilestone(projectId: string, milestoneIndex: number, status: ResearchMilestone['status']): ResearchProject | null {
    const project = this.projects.get(projectId);
    if (!project || !project.milestones[milestoneIndex]) return null;

    project.milestones[milestoneIndex].status = status;
    if (status === 'completed') {
      project.milestones[milestoneIndex].completedDate = new Date();
    }

    return project;
  }

  addPublication(projectId: string, publication: Publication): ResearchProject | null {
    const project = this.projects.get(projectId);
    if (!project) return null;

    project.publications.push(publication);
    logger.info(`CendiaInventum: Publication added to project ${projectId} - ${publication.title}`);
    return project;
  }

  getProject(projectId: string): ResearchProject | null {
    return this.projects.get(projectId) || null;
  }

  getAllProjects(): ResearchProject[] {
    return Array.from(this.projects.values());
  }

  getActiveProjects(): ResearchProject[] {
    return Array.from(this.projects.values()).filter(p => p.status === 'active');
  }

  // ---------------------------------------------------------------------------
  // PORTFOLIO ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeIPPortfolio(): Promise<IPPortfolio> {
    const patents = this.getAllPatents();
    
    // Count by status
    const byStatus: Record<string, number> = {};
    patents.forEach(p => {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    });

    // Aggregate by category (using tags from linked ideas)
    const categoryMap: Record<string, { count: number; value: number }> = {};
    patents.forEach(p => {
      const idea = p.linkedIdeas[0] ? this.ideas.get(p.linkedIdeas[0]) : null;
      const category = idea?.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, value: 0 };
      }
      categoryMap[category].count++;
      categoryMap[category].value += p.monetization?.estimatedValue || 50000;
    });

    const byCategory = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      value: data.value,
    }));

    // Calculate totals
    const totalValue = patents.reduce((sum, p) => sum + (p.monetization?.estimatedValue || 50000), 0);
    const annualRevenue = patents.reduce((sum, p) => sum + (p.monetization?.annualRevenue || 0), 0);
    const maintenanceCosts = patents.reduce((sum, p) => 
      sum + p.maintenanceFees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0), 0);

    // Find expiring patents (within 2 years)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    const expiringPatents = patents.filter(p => 
      p.expirationDate && p.expirationDate <= twoYearsFromNow && p.status === 'granted'
    );

    // Calculate portfolio health
    const grantedCount = patents.filter(p => p.status === 'granted').length;
    const portfolioHealth = patents.length > 0 
      ? Math.round((grantedCount / patents.length) * 100 * 0.6 + 
          (annualRevenue > 0 ? 30 : 0) + 
          (expiringPatents.length < 3 ? 10 : 0))
      : 0;

    return {
      totalPatents: patents.length,
      patentsByStatus: byStatus,
      patentsByCategory: byCategory,
      totalValue,
      annualRevenue,
      maintenanceCosts,
      upcomingFees: this.getUpcomingMaintenanceFees(90).map(f => f.fee),
      expiringPatents,
      portfolioHealth,
      recommendations: [
        expiringPatents.length > 0 ? `Review ${expiringPatents.length} patents expiring within 2 years` : '',
        this.getUpcomingMaintenanceFees(30).length > 0 ? 'Maintenance fees due within 30 days' : '',
        grantedCount < patents.length * 0.5 ? 'Consider accelerating pending applications' : '',
      ].filter(r => r),
    };
  }

  // ---------------------------------------------------------------------------
  // INNOVATION SCAN
  // ---------------------------------------------------------------------------

  async scanForNovelIdeas(content: string, source: string): Promise<IdeaCapture[]> {
    const prompt = `You are CendiaInventumÃ¢â€žÂ¢, scanning content for novel, patentable ideas.

CONTENT SOURCE: ${source}
CONTENT:
${content.substring(0, 3000)}

Identify any novel, potentially patentable ideas in this content. For each idea found, provide in JSON:
{
  "ideas": [
    {
      "title": "idea title",
      "description": "detailed description",
      "category": "category",
      "tags": ["tag1", "tag2"],
      "noveltyIndicators": ["what makes it novel"]
    }
  ]
}

Focus on:
- Technical innovations
- Process improvements
- Novel combinations of existing technologies
- Solutions to specific problems`;

    let scanData: any = { ideas: [] };

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('patent_drafting') });
        scanData = this.parseJsonFromResponse(response) || { ideas: [] };
      }
    } catch (error) {
      logger.warn('CendiaInventum: AI idea scan unavailable');
    }

    const capturedIdeas: IdeaCapture[] = [];

    for (const ideaData of scanData.ideas || []) {
      if (ideaData.title && ideaData.description) {
        const idea = await this.captureIdea({
          title: ideaData.title,
          description: ideaData.description,
          source: source as IdeaCapture['source'],
          submitter: 'CendiaInventum Scanner',
          department: 'R&D',
          category: ideaData.category || 'Innovation',
          tags: ideaData.tags || [],
        });
        capturedIdeas.push(idea);
      }
    }

    if (capturedIdeas.length > 0) {
      logger.info(`CendiaInventum: Scanned ${source} - found ${capturedIdeas.length} potential ideas`);
    }

    return capturedIdeas;
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private parseJsonFromResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      logger.warn('CendiaInventum: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalIdeas: number;
    patentableIdeas: number;
    totalPatents: number;
    grantedPatents: number;
    activeProjects: number;
    portfolioValue: number;
  } {
    const ideas = this.getAllIdeas();
    const patents = this.getAllPatents();
    const projects = this.getActiveProjects();

    return {
      totalIdeas: ideas.length,
      patentableIdeas: ideas.filter(i => i.patentPotential).length,
      totalPatents: patents.length,
      grantedPatents: patents.filter(p => p.status === 'granted').length,
      activeProjects: projects.length,
      portfolioValue: patents.reduce((sum, p) => sum + (p.monetization?.estimatedValue || 50000), 0),
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Innovation Pipeline Dashboard */
  getInnovationPipelineDashboard(): {
    pipeline: { captured: number; evaluating: number; approved: number; inDevelopment: number; patented: number; archived: number };
    avgScores: { novelty: number; feasibility: number; businessValue: number };
    bySource: Array<{ source: string; count: number; avgNovelty: number; patentableRate: number }>;
    byDepartment: Array<{ department: string; count: number; avgNovelty: number; patentableRate: number }>;
    byCategory: Array<{ category: string; count: number; avgBusinessValue: number }>;
    topIdeas: Array<{ title: string; novelty: number; feasibility: number; businessValue: number; patentPotential: boolean; status: string }>;
    conversionRate: { ideaToApproved: number; approvedToPatent: number; overallConversion: number };
    insights: string[];
  } {
    const ideas = this.getAllIdeas();

    const pipeline = { captured: 0, evaluating: 0, approved: 0, inDevelopment: 0, patented: 0, archived: 0 };
    const sourceMap: Record<string, { count: number; novelty: number; patentable: number }> = {};
    const deptMap: Record<string, { count: number; novelty: number; patentable: number }> = {};
    const catMap: Record<string, { count: number; bv: number }> = {};

    for (const idea of ideas) {
      if (idea.status === 'in_development') pipeline.inDevelopment++;
      else if (pipeline[idea.status as keyof typeof pipeline] !== undefined) (pipeline as any)[idea.status]++;

      if (!sourceMap[idea.source]) sourceMap[idea.source] = { count: 0, novelty: 0, patentable: 0 };
      sourceMap[idea.source].count++;
      sourceMap[idea.source].novelty += idea.noveltyScore;
      if (idea.patentPotential) sourceMap[idea.source].patentable++;

      if (!deptMap[idea.department]) deptMap[idea.department] = { count: 0, novelty: 0, patentable: 0 };
      deptMap[idea.department].count++;
      deptMap[idea.department].novelty += idea.noveltyScore;
      if (idea.patentPotential) deptMap[idea.department].patentable++;

      if (!catMap[idea.category]) catMap[idea.category] = { count: 0, bv: 0 };
      catMap[idea.category].count++;
      catMap[idea.category].bv += idea.businessValue;
    }

    const avgNovelty = ideas.length > 0 ? Math.round(ideas.reduce((s, i) => s + i.noveltyScore, 0) / ideas.length) : 0;
    const avgFeasibility = ideas.length > 0 ? Math.round(ideas.reduce((s, i) => s + i.feasibilityScore, 0) / ideas.length) : 0;
    const avgBV = ideas.length > 0 ? Math.round(ideas.reduce((s, i) => s + i.businessValue, 0) / ideas.length) : 0;

    const topIdeas = [...ideas]
      .sort((a, b) => (b.noveltyScore + b.businessValue) - (a.noveltyScore + a.businessValue))
      .slice(0, 10)
      .map(i => ({ title: i.title, novelty: i.noveltyScore, feasibility: i.feasibilityScore, businessValue: i.businessValue, patentPotential: i.patentPotential, status: i.status }));

    const approved = ideas.filter(i => i.status !== 'captured' && i.status !== 'evaluating' && i.status !== 'archived').length;
    const patented = ideas.filter(i => i.status === 'patented').length;
    const ideaToApproved = ideas.length > 0 ? Math.round((approved / ideas.length) * 100) : 0;
    const approvedToPatent = approved > 0 ? Math.round((patented / approved) * 100) : 0;
    const overallConversion = ideas.length > 0 ? Math.round((patented / ideas.length) * 100) : 0;

    const insights: string[] = [];
    if (pipeline.captured > 5) insights.push(`${pipeline.captured} idea(s) awaiting evaluation Ã¢â‚¬â€ review backlog`);
    if (avgNovelty < 50) insights.push(`Average novelty score is ${avgNovelty} Ã¢â‚¬â€ encourage more breakthrough thinking`);
    if (overallConversion < 10 && ideas.length > 10) insights.push(`Idea-to-patent conversion rate is only ${overallConversion}%`);
    const patentable = ideas.filter(i => i.patentPotential && i.status !== 'patented').length;
    if (patentable > 0) insights.push(`${patentable} patentable idea(s) not yet filed`);
    if (insights.length === 0) insights.push('Innovation pipeline is healthy with good throughput');

    return {
      pipeline, avgScores: { novelty: avgNovelty, feasibility: avgFeasibility, businessValue: avgBV },
      bySource: Object.entries(sourceMap).map(([s, d]) => ({ source: s, count: d.count, avgNovelty: Math.round(d.novelty / d.count), patentableRate: Math.round((d.patentable / d.count) * 100) })).sort((a, b) => b.count - a.count),
      byDepartment: Object.entries(deptMap).map(([d, v]) => ({ department: d, count: v.count, avgNovelty: Math.round(v.novelty / v.count), patentableRate: Math.round((v.patentable / v.count) * 100) })).sort((a, b) => b.count - a.count),
      byCategory: Object.entries(catMap).map(([c, d]) => ({ category: c, count: d.count, avgBusinessValue: Math.round(d.bv / d.count) })).sort((a, b) => b.count - a.count),
      topIdeas, conversionRate: { ideaToApproved, approvedToPatent, overallConversion }, insights,
    };
  }

  /** 10/10: IP Portfolio Intelligence */
  getIPPortfolioIntelligence(): {
    summary: { totalPatents: number; granted: number; pending: number; filed: number; rejected: number; totalValue: number; annualRevenue: number };
    byType: Array<{ type: string; count: number; grantRate: number }>;
    byJurisdiction: Array<{ jurisdiction: string; count: number }>;
    healthScore: number;
    expiringWithin2Years: Array<{ title: string; patentNumber: string; expirationDate: Date; estimatedValue: number }>;
    overdueFees: Array<{ title: string; jurisdiction: string; amount: number; dueDate: Date }>;
    upcomingFees: Array<{ title: string; jurisdiction: string; amount: number; dueDate: Date; daysUntilDue: number }>;
    claimsAnalysis: { totalClaims: number; avgClaimsPerPatent: number; independentClaims: number; dependentClaims: number };
    insights: string[];
  } {
    const patents = this.getAllPatents();

    const granted = patents.filter(p => p.status === 'granted').length;
    const pending = patents.filter(p => p.status === 'pending').length;
    const filed = patents.filter(p => p.status === 'filed').length;
    const rejected = patents.filter(p => p.status === 'rejected').length;
    const totalValue = patents.reduce((s, p) => s + (p.monetization?.estimatedValue || 50000), 0);
    const annualRevenue = patents.reduce((s, p) => s + (p.monetization?.annualRevenue || 0), 0);

    const typeMap: Record<string, { count: number; granted: number }> = {};
    const jurisdictionMap: Record<string, number> = {};
    let totalClaims = 0; let independent = 0; let dependent = 0;

    for (const p of patents) {
      if (!typeMap[p.type]) typeMap[p.type] = { count: 0, granted: 0 };
      typeMap[p.type].count++;
      if (p.status === 'granted') typeMap[p.type].granted++;

      for (const j of p.jurisdictions) {
        jurisdictionMap[j] = (jurisdictionMap[j] || 0) + 1;
      }

      totalClaims += p.claims.length;
      independent += p.claims.filter(c => c.type === 'independent').length;
      dependent += p.claims.filter(c => c.type === 'dependent').length;
    }

    const now = Date.now();
    const twoYears = 2 * 365 * 24 * 60 * 60 * 1000;
    const expiring = patents.filter(p => p.expirationDate && p.status === 'granted' && p.expirationDate.getTime() - now < twoYears && p.expirationDate.getTime() > now)
      .map(p => ({ title: p.title, patentNumber: p.patentNumber || 'N/A', expirationDate: p.expirationDate!, estimatedValue: p.monetization?.estimatedValue || 50000 }));

    const overdueFees: Array<{ title: string; jurisdiction: string; amount: number; dueDate: Date }> = [];
    const upcomingFees: Array<{ title: string; jurisdiction: string; amount: number; dueDate: Date; daysUntilDue: number }> = [];
    for (const p of patents) {
      for (const f of p.maintenanceFees) {
        if (f.status === 'overdue') overdueFees.push({ title: p.title, jurisdiction: f.jurisdiction, amount: f.amount, dueDate: f.dueDate });
        if (f.status === 'upcoming' && f.dueDate.getTime() - now < 90 * 24 * 60 * 60 * 1000) {
          upcomingFees.push({ title: p.title, jurisdiction: f.jurisdiction, amount: f.amount, dueDate: f.dueDate, daysUntilDue: Math.ceil((f.dueDate.getTime() - now) / (24 * 60 * 60 * 1000)) });
        }
      }
    }

    const healthScore = patents.length > 0
      ? Math.round((granted / patents.length) * 60 + (annualRevenue > 0 ? 20 : 0) + (overdueFees.length === 0 ? 10 : 0) + (expiring.length < 3 ? 10 : 0))
      : 0;

    const insights: string[] = [];
    if (overdueFees.length > 0) insights.push(`${overdueFees.length} overdue maintenance fee(s) Ã¢â‚¬â€ risk of patent abandonment`);
    if (expiring.length > 0) insights.push(`${expiring.length} patent(s) expiring within 2 years Ã¢â‚¬â€ review renewal strategy`);
    if (rejected > 0) insights.push(`${rejected} patent(s) rejected Ã¢â‚¬â€ consider amendments or appeals`);
    if (pending > 3) insights.push(`${pending} patent(s) pending Ã¢â‚¬â€ consider acceleration strategies`);
    if (insights.length === 0) insights.push('IP portfolio is in good health');

    return {
      summary: { totalPatents: patents.length, granted, pending, filed, rejected, totalValue, annualRevenue },
      byType: Object.entries(typeMap).map(([t, d]) => ({ type: t, count: d.count, grantRate: d.count > 0 ? Math.round((d.granted / d.count) * 100) : 0 })),
      byJurisdiction: Object.entries(jurisdictionMap).map(([j, c]) => ({ jurisdiction: j, count: c })).sort((a, b) => b.count - a.count),
      healthScore, expiringWithin2Years: expiring, overdueFees, upcomingFees: upcomingFees.sort((a, b) => a.daysUntilDue - b.daysUntilDue),
      claimsAnalysis: { totalClaims, avgClaimsPerPatent: patents.length > 0 ? Math.round(totalClaims / patents.length * 10) / 10 : 0, independentClaims: independent, dependentClaims: dependent },
      insights,
    };
  }

  /** 10/10: R&D Performance Analytics */
  getRDPerformanceAnalytics(): {
    projectSummary: { total: number; active: number; completed: number; onHold: number; cancelled: number };
    budgetOverview: { totalBudget: number; totalSpent: number; burnRate: number; overBudgetProjects: number };
    milestoneHealth: { total: number; completed: number; inProgress: number; delayed: number; onTimeRate: number };
    teamAllocation: Array<{ name: string; role: string; projects: number; totalAllocation: number; overallocated: boolean }>;
    publicationMetrics: { totalPublications: number; published: number; underReview: number; totalCitations: number };
    byPriority: Array<{ priority: string; count: number; avgBudget: number; avgCompletion: number }>;
    projectHealth: Array<{ project: string; status: string; budgetUsed: number; milestoneCompletion: number; health: string }>;
    insights: string[];
  } {
    const projects = this.getAllProjects();

    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const onHold = projects.filter(p => p.status === 'on_hold').length;
    const cancelled = projects.filter(p => p.status === 'cancelled').length;

    const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
    const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
    const burnRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    const overBudget = projects.filter(p => p.spent > p.budget).length;

    let totalMilestones = 0; let completedMilestones = 0; let inProgressMilestones = 0; let delayedMilestones = 0;
    for (const p of projects) {
      for (const m of p.milestones) {
        totalMilestones++;
        if (m.status === 'completed') completedMilestones++;
        else if (m.status === 'in_progress') inProgressMilestones++;
        else if (m.status === 'delayed') delayedMilestones++;
      }
    }
    const onTimeRate = totalMilestones > 0 ? Math.round(((completedMilestones + inProgressMilestones) / totalMilestones) * 100) : 100;

    const teamMap: Record<string, { role: string; projects: number; allocation: number }> = {};
    for (const p of projects) {
      if (p.status !== 'active') continue;
      for (const t of p.team) {
        if (!teamMap[t.name]) teamMap[t.name] = { role: t.role, projects: 0, allocation: 0 };
        teamMap[t.name].projects++;
        teamMap[t.name].allocation += t.allocation;
      }
    }

    let totalPubs = 0; let published = 0; let underReview = 0; let totalCitations = 0;
    for (const p of projects) {
      for (const pub of p.publications) {
        totalPubs++;
        if (pub.status === 'published') published++;
        if (pub.status === 'under_review') underReview++;
        totalCitations += pub.citations;
      }
    }

    const priorityMap: Record<string, { count: number; budget: number; completion: number }> = {};
    for (const p of projects) {
      if (!priorityMap[p.priority]) priorityMap[p.priority] = { count: 0, budget: 0, completion: 0 };
      priorityMap[p.priority].count++;
      priorityMap[p.priority].budget += p.budget;
      const totalMs = p.milestones.length;
      const completedMs = p.milestones.filter(m => m.status === 'completed').length;
      priorityMap[p.priority].completion += totalMs > 0 ? (completedMs / totalMs) * 100 : 0;
    }

    const projectHealth = projects.map(p => {
      const budgetUsed = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
      const totalMs = p.milestones.length;
      const completedMs = p.milestones.filter(m => m.status === 'completed').length;
      const milestoneCompletion = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0;
      const health = budgetUsed > 100 ? 'over_budget' : p.milestones.some(m => m.status === 'delayed') ? 'at_risk' : p.status === 'active' ? 'on_track' : p.status;
      return { project: p.title, status: p.status, budgetUsed, milestoneCompletion, health };
    });

    const insights: string[] = [];
    if (overBudget > 0) insights.push(`${overBudget} project(s) over budget`);
    if (delayedMilestones > 0) insights.push(`${delayedMilestones} milestone(s) delayed across all projects`);
    const overallocated = Object.values(teamMap).filter(t => t.allocation > 100);
    if (overallocated.length > 0) insights.push(`${overallocated.length} team member(s) overallocated (>100%)`);
    if (onHold > 0) insights.push(`${onHold} project(s) on hold Ã¢â‚¬â€ review for restart or cancellation`);
    if (insights.length === 0) insights.push('R&D portfolio is performing well across all metrics');

    return {
      projectSummary: { total: projects.length, active, completed, onHold, cancelled },
      budgetOverview: { totalBudget, totalSpent, burnRate, overBudgetProjects: overBudget },
      milestoneHealth: { total: totalMilestones, completed: completedMilestones, inProgress: inProgressMilestones, delayed: delayedMilestones, onTimeRate },
      teamAllocation: Object.entries(teamMap).map(([n, d]) => ({ name: n, role: d.role, projects: d.projects, totalAllocation: d.allocation, overallocated: d.allocation > 100 })).sort((a, b) => b.totalAllocation - a.totalAllocation),
      publicationMetrics: { totalPublications: totalPubs, published, underReview, totalCitations },
      byPriority: Object.entries(priorityMap).map(([p, d]) => ({ priority: p, count: d.count, avgBudget: Math.round(d.budget / d.count), avgCompletion: Math.round(d.completion / d.count) })),
      projectHealth, insights,
    };
  }

  /** 10/10: Patent Monetization Tracker */
  getPatentMonetizationTracker(): {
    totalPortfolioValue: number;
    annualIPRevenue: number;
    annualMaintenanceCost: number;
    netIPIncome: number;
    roi: number;
    byStrategy: Array<{ strategy: string; patentCount: number; totalValue: number; annualRevenue: number }>;
    activeDeals: Array<{ patent: string; licensee: string; type: string; royaltyRate: number; status: string; annualRevenue: number }>;
    unmonetized: Array<{ title: string; estimatedValue: number; patentNumber: string; suggestion: string }>;
    revenueConcentration: { topLicensee: string; topLicenseeRevenue: number; diversificationScore: number };
    insights: string[];
  } {
    const patents = this.getAllPatents();

    const totalValue = patents.reduce((s, p) => s + (p.monetization?.estimatedValue || 50000), 0);
    const annualRevenue = patents.reduce((s, p) => s + (p.monetization?.annualRevenue || 0), 0);
    const maintenanceCost = patents.reduce((s, p) => s + p.maintenanceFees.filter(f => f.status === 'paid').reduce((fs, f) => fs + f.amount, 0), 0);
    const netIncome = annualRevenue - maintenanceCost;
    const roi = maintenanceCost > 0 ? Math.round((netIncome / maintenanceCost) * 100) : 0;

    const strategyMap: Record<string, { count: number; value: number; revenue: number }> = {};
    const allDeals: Array<{ patent: string; licensee: string; type: string; royaltyRate: number; status: string; annualRevenue: number }> = [];
    const licenseeRevenue: Record<string, number> = {};

    for (const p of patents) {
      if (p.monetization) {
        const s = p.monetization.strategy;
        if (!strategyMap[s]) strategyMap[s] = { count: 0, value: 0, revenue: 0 };
        strategyMap[s].count++;
        strategyMap[s].value += p.monetization.estimatedValue;
        strategyMap[s].revenue += p.monetization.annualRevenue;

        for (const deal of p.monetization.activeDeals) {
          const dealRevenue = deal.minimumRoyalty || deal.upfrontFee * (deal.royaltyRate / 100);
          allDeals.push({ patent: p.title, licensee: deal.licensee, type: deal.type, royaltyRate: deal.royaltyRate, status: deal.status, annualRevenue: dealRevenue });
          licenseeRevenue[deal.licensee] = (licenseeRevenue[deal.licensee] || 0) + dealRevenue;
        }
      }
    }

    const unmonetized = patents
      .filter(p => p.status === 'granted' && (!p.monetization || p.monetization.annualRevenue === 0))
      .map(p => ({
        title: p.title, estimatedValue: p.monetization?.estimatedValue || 50000, patentNumber: p.patentNumber || 'N/A',
        suggestion: p.claims.length > 5 ? 'Strong claims Ã¢â‚¬â€ pursue licensing' : 'Consider cross-licensing or portfolio sale',
      }));

    const sortedLicensees = Object.entries(licenseeRevenue).sort((a, b) => b[1] - a[1]);
    const topLicensee = sortedLicensees[0]?.[0] || 'None';
    const topRevenue = sortedLicensees[0]?.[1] || 0;
    const diversification = sortedLicensees.length > 0 && annualRevenue > 0 ? Math.round((1 - topRevenue / Math.max(1, annualRevenue)) * 100) : 0;

    const insights: string[] = [];
    if (unmonetized.length > 0) insights.push(`${unmonetized.length} granted patent(s) generating no revenue Ã¢â‚¬â€ monetization opportunity`);
    if (roi < 100 && annualRevenue > 0) insights.push(`IP ROI is ${roi}% Ã¢â‚¬â€ maintenance costs may exceed returns for some patents`);
    if (diversification < 30 && sortedLicensees.length > 0) insights.push('Revenue heavily concentrated on one licensee Ã¢â‚¬â€ diversify licensing');
    if (allDeals.filter(d => d.status === 'negotiating').length > 0) insights.push(`${allDeals.filter(d => d.status === 'negotiating').length} deal(s) in negotiation`);
    if (insights.length === 0) insights.push('Patent monetization strategy is performing well');

    return {
      totalPortfolioValue: totalValue, annualIPRevenue: annualRevenue, annualMaintenanceCost: maintenanceCost, netIPIncome: netIncome, roi,
      byStrategy: Object.entries(strategyMap).map(([s, d]) => ({ strategy: s, patentCount: d.count, totalValue: d.value, annualRevenue: d.revenue })).sort((a, b) => b.annualRevenue - a.annualRevenue),
      activeDeals: allDeals.sort((a, b) => b.annualRevenue - a.annualRevenue),
      unmonetized,
      revenueConcentration: { topLicensee, topLicenseeRevenue: topRevenue, diversificationScore: diversification },
      insights,
    };
  }
}

// Export singleton instance
export const cendiaInventumService = new CendiaInventumService();
