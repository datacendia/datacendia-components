// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// R&D PROJECT SERVICE - Research & Development Project Management
// CRUD operations for managing R&D projects in the platform
// =============================================================================

import { config } from '../../config/index.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type ResearchStatus = 'conceptual' | 'theoretical' | 'prototyping' | 'testing' | 'paused' | 'completed' | 'cancelled';
export type ResearchHorizon = '2025-2027' | '2028-2030' | '2030-2035' | '2035+' | 'indefinite';
export type ResearchCategory = 'neurotech' | 'space' | 'quantum' | 'biotech' | 'governance' | 'infrastructure' | 'economics' | 'ai' | 'security';
export type RiskLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface RDProject {
  id: string;
  name: string;
  codename: string;
  description: string;
  status: ResearchStatus;
  horizon: ResearchHorizon;
  category: ResearchCategory;
  potentialValue: string;
  technicalChallenges: string[];
  dependencies: string[];
  riskLevel: RiskLevel;
  estimatedInvestment: string;
  principalInvestigator?: string;
  team: string[];
  notes: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Progress tracking
  milestones: RDMilestone[];
  completionPercentage: number;
  
  // Resources
  budget: number;
  budgetSpent: number;
  resources: string[];
  
  // Visibility
  visible: boolean;
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'top-secret';
}

export interface RDMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

export interface RDProjectInput {
  name: string;
  codename: string;
  description: string;
  status?: ResearchStatus;
  horizon: ResearchHorizon;
  category: ResearchCategory;
  potentialValue: string;
  technicalChallenges: string[];
  dependencies: string[];
  riskLevel: RiskLevel;
  estimatedInvestment: string;
  principalInvestigator?: string;
  team?: string[];
  notes?: string;
  budget?: number;
  confidentialityLevel?: 'public' | 'internal' | 'confidential' | 'top-secret';
}

// =============================================================================
// R&D PROJECT SERVICE
// =============================================================================

class RDProjectService {
  private projects: Map<string, RDProject> = new Map();

  constructor() {
    this.initializeProjects();
  }

  private initializeProjects(): void {
    const defaultProjects: RDProject[] = [
      // NEUROTECH
      {
        id: 'rd-neurolink',
        name: 'CendiaNeuro-Link™',
        codename: 'Project Synapse',
        description: 'Direct Brain-Computer Interface (BCI) integration for "thought-speed" deliberation. Instant simulation of executive intent without verbal or typed input.',
        status: 'conceptual',
        horizon: '2030-2035',
        category: 'neurotech',
        potentialValue: 'Eliminates communication latency in critical decisions. Ultimate human-AI fusion.',
        technicalChallenges: [
          'BCI hardware not mature (Neuralink, Synchron still in trials)',
          'FDA/regulatory approval pathway unclear',
          'Signal-to-noise ratio insufficient for complex thought',
          'Ethical concerns around thought privacy',
        ],
        dependencies: ['Mature BCI hardware ecosystem', 'Regulatory framework for neural interfaces'],
        riskLevel: 'extreme',
        estimatedInvestment: '$50M-$200M (10+ years)',
        notes: 'Monitor Neuralink N1 trials. Revisit when consumer BCI reaches 10M users.',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        milestones: [
          { id: 'm1', name: 'Market Analysis', description: 'Analyze BCI market readiness', targetDate: '2025-12-31', status: 'pending' }
        ],
        completionPercentage: 5,
        budget: 500000,
        budgetSpent: 25000,
        resources: [],
        team: [],
        visible: true,
        confidentialityLevel: 'internal'
      },
      {
        id: 'rd-neurosovereign',
        name: 'CendiaNeuroSovereign™',
        codename: 'Project Psyche',
        description: 'Model population-level psychological health, resilience, and unrest risk. National-scale mental health infrastructure.',
        status: 'theoretical',
        horizon: '2028-2030',
        category: 'neurotech',
        potentialValue: '$20M-$45M/year. Stabilizes societies; prevents unrest and burnout at national scale.',
        technicalChallenges: [
          'Privacy concerns with population-level mental health data',
          'Model accuracy for predicting social unrest',
          'Government trust in AI-driven psychology',
          'Cultural variations in mental health indicators',
        ],
        dependencies: ['CendiaBio™ biometric platform', 'Government data partnerships'],
        riskLevel: 'high',
        estimatedInvestment: '$15M-$40M',
        principalInvestigator: 'TBD - Requires behavioral science lead',
        notes: 'Could spin out CendiaBio as prerequisite. WHO partnership potential.',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        milestones: [],
        completionPercentage: 10,
        budget: 1000000,
        budgetSpent: 100000,
        resources: [],
        team: [],
        visible: true,
        confidentialityLevel: 'confidential'
      },
      // SPACE
      {
        id: 'rd-interstellar',
        name: 'CendiaInterstellar Logistics™',
        codename: 'Project Horizon',
        description: 'High-latency decision support for Mars/Space colonies. Governs off-world colonies where light-lag (4-24 min to Mars) prevents real-time Earth control.',
        status: 'conceptual',
        horizon: '2035+',
        category: 'space',
        potentialValue: 'Monopoly on off-world governance infrastructure. $100M+/year when colonies exist.',
        technicalChallenges: [
          'No current market (SpaceX Mars colony 2030+ optimistically)',
          'Latency-tolerant consensus algorithms needed',
          'Radiation-hardened hardware requirements',
          'Legal jurisdiction in space unclear',
        ],
        dependencies: ['Viable Mars colony', 'Space law framework'],
        riskLevel: 'extreme',
        estimatedInvestment: '$100M+ (20+ years)',
        notes: 'Pure moonshot. Monitor SpaceX Starship progress. Partnership with NASA/ESA potential.',
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        milestones: [],
        completionPercentage: 2,
        budget: 250000,
        budgetSpent: 5000,
        resources: [],
        team: [],
        visible: true,
        confidentialityLevel: 'internal'
      },
      // QUANTUM
      {
        id: 'rd-quantum',
        name: 'CendiaQuantum™',
        codename: 'Project Qubit',
        description: 'Quantum-enhanced optimization and simulation. Leverage quantum computing for exponentially faster scenario analysis.',
        status: 'theoretical',
        horizon: '2028-2030',
        category: 'quantum',
        potentialValue: '1000x speedup for complex simulations. First-mover advantage in quantum decision intelligence.',
        technicalChallenges: [
          'Quantum hardware still experimental',
          'Limited qubit coherence times',
          'Quantum algorithm development expertise needed',
          'Cost of quantum compute access',
        ],
        dependencies: ['Access to quantum hardware (IBM, Google, IonQ)', 'Quantum ML expertise'],
        riskLevel: 'high',
        estimatedInvestment: '$5M-$20M',
        principalInvestigator: 'TBD - Requires quantum computing lead',
        notes: 'Partner with IBM Quantum Network. Start with hybrid classical-quantum algorithms.',
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        milestones: [
          { id: 'm1', name: 'IBM Partnership', description: 'Establish IBM Quantum Network partnership', targetDate: '2025-06-30', status: 'in-progress' }
        ],
        completionPercentage: 15,
        budget: 2000000,
        budgetSpent: 300000,
        resources: [],
        team: ['Dr. Sarah Chen'],
        visible: true,
        confidentialityLevel: 'internal'
      },
      // AI
      {
        id: 'rd-agi-council',
        name: 'CendiaAGI Council™',
        codename: 'Project Prometheus',
        description: 'Next-generation AGI-powered executive council with emergent reasoning capabilities and autonomous decision-making.',
        status: 'prototyping',
        horizon: '2025-2027',
        category: 'ai',
        potentialValue: 'True AGI-level strategic advisors. 10x improvement over current LLM-based agents.',
        technicalChallenges: [
          'AGI safety and alignment',
          'Maintaining human oversight',
          'Computational requirements',
          'Unpredictable emergent behaviors',
        ],
        dependencies: ['Advanced reasoning models', 'Safety frameworks'],
        riskLevel: 'high',
        estimatedInvestment: '$10M-$30M',
        principalInvestigator: 'Dr. Michael Torres',
        notes: 'Building on latest reasoning models. Focus on safety-first development.',
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        milestones: [
          { id: 'm1', name: 'Reasoning Framework', description: 'Develop multi-step reasoning framework', targetDate: '2025-03-31', status: 'completed', completedDate: '2025-02-15' },
          { id: 'm2', name: 'Safety Validation', description: 'Complete safety testing suite', targetDate: '2025-09-30', status: 'in-progress' }
        ],
        completionPercentage: 45,
        budget: 5000000,
        budgetSpent: 2250000,
        resources: ['GPU Cluster A', 'Safety Lab'],
        team: ['Dr. Michael Torres', 'Emily Zhang', 'James Wilson'],
        visible: true,
        confidentialityLevel: 'confidential'
      },
      // GOVERNANCE
      {
        id: 'rd-constitution',
        name: 'CendiaConstitution™',
        codename: 'Project Lex',
        description: 'AI-generated constitutional frameworks for organizations. Self-amending governance documents with built-in checks and balances.',
        status: 'theoretical',
        horizon: '2025-2027',
        category: 'governance',
        potentialValue: 'Revolutionary corporate governance. Could replace traditional bylaws with adaptive AI-managed frameworks.',
        technicalChallenges: [
          'Legal recognition of AI-generated governance',
          'Balancing flexibility with stability',
          'Integration with existing legal systems',
          'Stakeholder acceptance',
        ],
        dependencies: ['Legal AI expertise', 'Pilot organization partners'],
        riskLevel: 'medium',
        estimatedInvestment: '$3M-$8M',
        notes: 'Start with DAO governance. Expand to traditional corporations.',
        createdAt: '2024-04-15T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        milestones: [],
        completionPercentage: 20,
        budget: 1500000,
        budgetSpent: 300000,
        resources: [],
        team: ['Legal Team'],
        visible: true,
        confidentialityLevel: 'internal'
      },
      // ECONOMICS
      {
        id: 'rd-economy',
        name: 'CendiaEconomy™',
        codename: 'Project Atlas',
        description: 'Real-time economic modeling and policy simulation at national scale. Predict and optimize economic policy outcomes.',
        status: 'prototyping',
        horizon: '2025-2027',
        category: 'economics',
        potentialValue: '$50M+/year. Central banks and treasuries as customers.',
        technicalChallenges: [
          'Economic model accuracy',
          'Political sensitivity of predictions',
          'Data access from governments',
          'Black swan event handling',
        ],
        dependencies: ['Economic data partnerships', 'Government trust'],
        riskLevel: 'medium',
        estimatedInvestment: '$8M-$15M',
        principalInvestigator: 'Dr. Alex Kim',
        notes: 'Pilot with smaller nations first. Singapore, Estonia potential early adopters.',
        createdAt: '2024-05-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        milestones: [
          { id: 'm1', name: 'Core Model', description: 'Build core economic simulation model', targetDate: '2025-06-30', status: 'completed', completedDate: '2025-05-20' },
          { id: 'm2', name: 'Pilot Partnership', description: 'Secure first government pilot', targetDate: '2025-12-31', status: 'in-progress' }
        ],
        completionPercentage: 55,
        budget: 3000000,
        budgetSpent: 1650000,
        resources: ['Data Lake', 'Economics Team'],
        team: ['Dr. Alex Kim', 'Maria Santos', 'Robert Chen'],
        visible: true,
        confidentialityLevel: 'confidential'
      },
    ];

    defaultProjects.forEach(p => this.projects.set(p.id, p));
  }

  // ===========================================================================
  // CRUD OPERATIONS
  // ===========================================================================

  async list(filters?: { 
    category?: ResearchCategory; 
    status?: ResearchStatus; 
    horizon?: ResearchHorizon;
    visible?: boolean;
  }): Promise<RDProject[]> {
    let projects = Array.from(this.projects.values());
    
    if (filters?.category) {
      projects = projects.filter(p => p.category === filters.category);
    }
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    if (filters?.horizon) {
      projects = projects.filter(p => p.horizon === filters.horizon);
    }
    if (filters?.visible !== undefined) {
      projects = projects.filter(p => p.visible === filters.visible);
    }
    
    return projects.sort((a, b) => b.completionPercentage - a.completionPercentage);
  }

  async get(id: string): Promise<RDProject | null> {
    return this.projects.get(id) || null;
  }

  async create(input: RDProjectInput): Promise<RDProject> {
    const id = `rd-${Date.now()}`;
    const now = new Date().toISOString();
    
    const project: RDProject = {
      id,
      name: input.name,
      codename: input.codename,
      description: input.description,
      status: input.status || 'conceptual',
      horizon: input.horizon,
      category: input.category,
      potentialValue: input.potentialValue,
      technicalChallenges: input.technicalChallenges,
      dependencies: input.dependencies,
      riskLevel: input.riskLevel,
      estimatedInvestment: input.estimatedInvestment,
      principalInvestigator: input.principalInvestigator,
      team: input.team || [],
      notes: input.notes || '',
      createdAt: now,
      updatedAt: now,
      createdBy: 'admin',
      milestones: [],
      completionPercentage: 0,
      budget: input.budget || 0,
      budgetSpent: 0,
      resources: [],
      visible: true,
      confidentialityLevel: input.confidentialityLevel || 'internal'
    };

    this.projects.set(id, project);
    return project;
  }

  async update(id: string, updates: Partial<RDProject>): Promise<RDProject | null> {
    const project = this.projects.get(id);
    if (!project) return null;

    const updated: RDProject = {
      ...project,
      ...updates,
      id: project.id, // Prevent ID change
      createdAt: project.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    this.projects.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // ===========================================================================
  // MILESTONE MANAGEMENT
  // ===========================================================================

  async addMilestone(projectId: string, milestone: Omit<RDMilestone, 'id'>): Promise<RDProject | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const newMilestone: RDMilestone = {
      ...milestone,
      id: `m-${Date.now()}`
    };

    project.milestones.push(newMilestone);
    project.updatedAt = new Date().toISOString();
    
    return project;
  }

  async updateMilestone(projectId: string, milestoneId: string, updates: Partial<RDMilestone>): Promise<RDProject | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const milestoneIndex = project.milestones.findIndex(m => m.id === milestoneId);
    if (milestoneIndex === -1) return null;

    project.milestones[milestoneIndex] = {
      ...project.milestones[milestoneIndex],
      ...updates
    };
    project.updatedAt = new Date().toISOString();
    
    return project;
  }

  async completeMilestone(projectId: string, milestoneId: string): Promise<RDProject | null> {
    return this.updateMilestone(projectId, milestoneId, {
      status: 'completed',
      completedDate: new Date().toISOString()
    });
  }

  // ===========================================================================
  // PROGRESS & METRICS
  // ===========================================================================

  async updateProgress(projectId: string, completionPercentage: number): Promise<RDProject | null> {
    return this.update(projectId, { completionPercentage: Math.min(100, Math.max(0, completionPercentage)) });
  }

  async updateBudget(projectId: string, budgetSpent: number): Promise<RDProject | null> {
    return this.update(projectId, { budgetSpent });
  }

  async getMetrics(): Promise<{
    totalProjects: number;
    byStatus: Record<ResearchStatus, number>;
    byCategory: Record<ResearchCategory, number>;
    byHorizon: Record<ResearchHorizon, number>;
    totalBudget: number;
    totalSpent: number;
    averageCompletion: number;
    activeProjects: number;
  }> {
    const projects = Array.from(this.projects.values());
    
    const byStatus = {} as Record<ResearchStatus, number>;
    const byCategory = {} as Record<ResearchCategory, number>;
    const byHorizon = {} as Record<ResearchHorizon, number>;
    
    let totalBudget = 0;
    let totalSpent = 0;
    let totalCompletion = 0;
    let activeCount = 0;

    for (const project of projects) {
      byStatus[project.status] = (byStatus[project.status] || 0) + 1;
      byCategory[project.category] = (byCategory[project.category] || 0) + 1;
      byHorizon[project.horizon] = (byHorizon[project.horizon] || 0) + 1;
      
      totalBudget += project.budget;
      totalSpent += project.budgetSpent;
      totalCompletion += project.completionPercentage;
      
      if (['conceptual', 'theoretical', 'prototyping', 'testing'].includes(project.status)) {
        activeCount++;
      }
    }

    return {
      totalProjects: projects.length,
      byStatus,
      byCategory,
      byHorizon,
      totalBudget,
      totalSpent,
      averageCompletion: projects.length > 0 ? totalCompletion / projects.length : 0,
      activeProjects: activeCount
    };
  }
}

export const rdProjectService = new RDProjectService();
