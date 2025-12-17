// @ts-nocheck
// =============================================================================
// CENDIAINVENTUM™ - RESEARCH & DEVELOPMENT / INTELLECTUAL PROPERTY
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
    logger.info('CendiaInventum™ initialized - The Patent Factory is ready');
  }

  // ---------------------------------------------------------------------------
  // IDEA CAPTURE
  // ---------------------------------------------------------------------------

  async captureIdea(idea: Omit<IdeaCapture, 'id' | 'noveltyScore' | 'feasibilityScore' | 'businessValue' | 'patentPotential' | 'status' | 'linkedPatents' | 'linkedProjects' | 'capturedAt' | 'updatedAt'>): Promise<IdeaCapture> {
    // Analyze the idea
    const analysis = await this.analyzeIdea(idea.title, idea.description, idea.category);

    const newIdea: IdeaCapture = {
      ...idea,
      id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    const prompt = `You are CendiaInventum™, an AI R&D and IP management system.

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

    const prompt = `You are CendiaInventum™, generating a provisional patent draft.

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
      id: `pat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    const prompt = `You are CendiaInventum™, scanning content for novel, patentable ideas.

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
}

// Export singleton instance
export const cendiaInventumService = new CendiaInventumService();
