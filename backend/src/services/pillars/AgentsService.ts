// =============================================================================
// DATACENDIA PLATFORM - THE AGENTS SERVICE
// AI Agent Management - Configure and monitor AI agents (The Pantheon)
// Enterprise Platinum Intelligence
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

// =============================================================================
// TYPES
// =============================================================================

export type AgentStatus = 'online' | 'busy' | 'offline' | 'error';
export type AgentRole = 'chief' | 'cfo' | 'coo' | 'ciso' | 'cmo' | 'cro' | 'cdo' | 'risk' | 'legal' | 'hr' | 'strategy' | 'custom';

export interface AIAgent {
  id: string;
  code: string;
  name: string;
  displayName: string;
  role: AgentRole;
  description: string;
  icon: string;
  model: string;
  systemPrompt: string;
  capabilities: string[];
  status: AgentStatus;
  organizationId: string;
  createdAt: Date;
  lastActiveAt?: Date;
  queriesTotal: number;
  queriesToday: number;
  avgResponseTime: number;
  satisfaction: number;
}

export interface AgentInteraction {
  id: string;
  agentId: string;
  organizationId: string;
  userId: string;
  query: string;
  response: string;
  responseTime: number;
  rating?: number;
  feedback?: string;
  createdAt: Date;
}

export interface AgentConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  contextWindow: number;
  specializations: string[];
}

export interface AgentStats {
  totalAgents: number;
  onlineAgents: number;
  queriesToday: number;
  avgResponseTime: number;
  satisfaction: number;
  topAgents: { name: string; queries: number }[];
}

// =============================================================================
// DEFAULT AGENTS
// =============================================================================

const DEFAULT_AGENTS: Omit<AIAgent, 'id' | 'organizationId' | 'createdAt' | 'queriesTotal' | 'queriesToday' | 'avgResponseTime' | 'satisfaction'>[] = [
  { code: 'chief', name: 'CendiaChief', displayName: 'Chief of Staff', role: 'chief', icon: '👔', model: 'llama3.3:70b', description: 'Executive synthesis and strategic coordination', systemPrompt: 'You are the Chief of Staff. Synthesize all perspectives into coherent strategy.', capabilities: ['strategy', 'synthesis', 'coordination'], status: 'online' },
  { code: 'cfo', name: 'CendiaCFO', displayName: 'CFO', role: 'cfo', icon: '💰', model: 'llama3.3:70b', description: 'Financial intelligence and analysis', systemPrompt: 'You are the CFO. Focus on ROI, cash flow, and margin. Be conservative.', capabilities: ['finance', 'roi', 'budgeting', 'forecasting'], status: 'online' },
  { code: 'coo', name: 'CendiaCOO', displayName: 'COO', role: 'coo', icon: '⚙️', model: 'llama3.2:3b', description: 'Operations and execution excellence', systemPrompt: 'You are the COO. Focus on bottlenecks, efficiency, and execution speed.', capabilities: ['operations', 'efficiency', 'process'], status: 'online' },
  { code: 'ciso', name: 'CendiaCISO', displayName: 'CISO', role: 'ciso', icon: '🔒', model: 'qwq:32b', description: 'Security and compliance oversight', systemPrompt: 'Scrutinize plans for ANY compliance or security risk. Think step-by-step.', capabilities: ['security', 'compliance', 'risk'], status: 'online' },
  { code: 'cmo', name: 'CendiaCMO', displayName: 'CMO', role: 'cmo', icon: '📢', model: 'llama3.3:70b', description: 'Marketing and brand strategy', systemPrompt: 'You are the CMO. Focus on brand voice, customer perception, and market fit.', capabilities: ['marketing', 'brand', 'customer'], status: 'busy' },
  { code: 'cro', name: 'CendiaCRO', displayName: 'CRO', role: 'cro', icon: '📈', model: 'llama3.3:70b', description: 'Revenue optimization and growth', systemPrompt: 'You are the CRO. Focus on revenue growth, sales efficiency, and pipeline.', capabilities: ['revenue', 'sales', 'growth'], status: 'online' },
  { code: 'cdo', name: 'CendiaCDO', displayName: 'CDO', role: 'cdo', icon: '📊', model: 'qwen2.5-coder:32b', description: 'Data governance and analytics', systemPrompt: 'You are the CDO. Validate data lineage and quality. Output valid JSON or SQL when requested.', capabilities: ['data', 'analytics', 'governance'], status: 'online' },
  { code: 'risk', name: 'CendiaRisk', displayName: 'Risk Officer', role: 'risk', icon: '⚠️', model: 'qwq:32b', description: 'Risk assessment and mitigation', systemPrompt: 'You are the Risk Officer. Calculate probability and impact. Be pessimistic and validate assumptions.', capabilities: ['risk', 'assessment', 'mitigation'], status: 'online' },
];

// =============================================================================
// THE AGENTS SERVICE
// =============================================================================

export class AgentsService extends BaseService {
  private agentsStore: Map<string, AIAgent> = new Map();
  private interactionsStore: Map<string, AgentInteraction[]> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'agents-service',
      version: '1.0.0',
      dependencies: [],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Agents service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Agents service shutting down...');
    this.agentsStore.clear();
    this.interactionsStore.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    const agents = Array.from(this.agentsStore.values());
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        totalAgents: agents.length,
        onlineAgents: agents.filter(a => a.status === 'online').length,
      },
    };
  }

  // ===========================================================================
  // AGENT MANAGEMENT
  // ===========================================================================

  async createAgent(agent: Omit<AIAgent, 'id' | 'createdAt' | 'queriesTotal' | 'queriesToday' | 'avgResponseTime' | 'satisfaction'>): Promise<AIAgent> {
    const id = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const newAgent: AIAgent = {
      ...agent,
      id,
      createdAt: new Date(),
      queriesTotal: 0,
      queriesToday: 0,
      avgResponseTime: 0,
      satisfaction: 5.0,
    };

    this.agentsStore.set(id, newAgent);
    return newAgent;
  }

  async getAgent(agentId: string): Promise<AIAgent | null> {
    return this.agentsStore.get(agentId) || null;
  }

  async getAgentByCode(organizationId: string, code: string): Promise<AIAgent | null> {
    const agents = Array.from(this.agentsStore.values());
    return agents.find(a => a.organizationId === organizationId && a.code === code) || null;
  }

  async getAgents(organizationId: string): Promise<AIAgent[]> {
    return Array.from(this.agentsStore.values())
      .filter(a => a.organizationId === organizationId);
  }

  async updateAgentStatus(agentId: string, status: AgentStatus): Promise<AIAgent | null> {
    const agent = this.agentsStore.get(agentId);
    if (!agent) return null;
    agent.status = status;
    if (status === 'online') agent.lastActiveAt = new Date();
    this.agentsStore.set(agentId, agent);
    return agent;
  }

  async updateAgentConfig(agentId: string, updates: Partial<AIAgent>): Promise<AIAgent | null> {
    const agent = this.agentsStore.get(agentId);
    if (!agent) return null;
    
    const updated = { ...agent, ...updates };
    this.agentsStore.set(agentId, updated);
    return updated;
  }

  // ===========================================================================
  // INTERACTIONS
  // ===========================================================================

  async recordInteraction(interaction: Omit<AgentInteraction, 'id' | 'createdAt'>): Promise<AgentInteraction> {
    const newInteraction: AgentInteraction = {
      ...interaction,
      id: `int-${Date.now()}`,
      createdAt: new Date(),
    };

    const interactions = this.interactionsStore.get(interaction.agentId) || [];
    interactions.push(newInteraction);
    if (interactions.length > 1000) interactions.shift(); // Keep last 1000
    this.interactionsStore.set(interaction.agentId, interactions);

    // Update agent stats
    const agent = this.agentsStore.get(interaction.agentId);
    if (agent) {
      agent.queriesTotal++;
      agent.queriesToday++;
      agent.lastActiveAt = new Date();
      
      // Update average response time
      const recentInteractions = interactions.slice(-100);
      agent.avgResponseTime = recentInteractions.reduce((sum, i) => sum + i.responseTime, 0) / recentInteractions.length;
      
      // Update satisfaction from ratings
      const ratedInteractions = recentInteractions.filter(i => i.rating !== undefined);
      if (ratedInteractions.length > 0) {
        agent.satisfaction = ratedInteractions.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedInteractions.length;
      }
      
      this.agentsStore.set(interaction.agentId, agent);
    }

    return newInteraction;
  }

  async getInteractions(agentId: string, limit: number = 50): Promise<AgentInteraction[]> {
    const interactions = this.interactionsStore.get(agentId) || [];
    return interactions.slice(-limit).reverse();
  }

  async rateInteraction(interactionId: string, rating: number, feedback?: string): Promise<AgentInteraction | null> {
    for (const [agentId, interactions] of this.interactionsStore.entries()) {
      const interaction = interactions.find(i => i.id === interactionId);
      if (interaction) {
        interaction.rating = rating;
        interaction.feedback = feedback;
        this.interactionsStore.set(agentId, interactions);
        
        // Update agent satisfaction
        const agent = this.agentsStore.get(agentId);
        if (agent) {
          const ratedInteractions = interactions.filter(i => i.rating !== undefined);
          agent.satisfaction = ratedInteractions.reduce((sum, i) => sum + (i.rating || 0), 0) / ratedInteractions.length;
          this.agentsStore.set(agentId, agent);
        }
        
        return interaction;
      }
    }
    return null;
  }

  // ===========================================================================
  // STATS
  // ===========================================================================

  async getAgentStats(organizationId: string): Promise<AgentStats> {
    const agents = await this.getAgents(organizationId);
    
    const queriesToday = agents.reduce((sum, a) => sum + a.queriesToday, 0);
    const totalQueries = agents.reduce((sum, a) => sum + a.queriesTotal, 0);
    const avgResponseTime = agents.length > 0
      ? agents.reduce((sum, a) => sum + a.avgResponseTime, 0) / agents.length
      : 0;
    const satisfaction = agents.length > 0
      ? agents.reduce((sum, a) => sum + a.satisfaction, 0) / agents.length
      : 5.0;

    const topAgents = agents
      .sort((a, b) => b.queriesToday - a.queriesToday)
      .slice(0, 5)
      .map(a => ({ name: a.displayName, queries: a.queriesToday }));

    return {
      totalAgents: agents.length,
      onlineAgents: agents.filter(a => a.status === 'online').length,
      queriesToday,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      satisfaction: Math.round(satisfaction * 10) / 10,
      topAgents,
    };
  }

  async resetDailyCounters(): Promise<void> {
    for (const agent of this.agentsStore.values()) {
      agent.queriesToday = 0;
    }
    this.logger.info('Reset daily query counters for all agents');
  }

  // ===========================================================================
  // SEED DATA
  // ===========================================================================

  async seedDefaultAgents(organizationId: string): Promise<void> {
    for (const agentTemplate of DEFAULT_AGENTS) {
      const agent = await this.createAgent({
        ...agentTemplate,
        organizationId,
      });

      // Simulate some usage
      agent.queriesTotal = Math.floor(50 + Math.random() * 200);
      agent.queriesToday = Math.floor(10 + Math.random() * 50);
      agent.avgResponseTime = 1.5 + Math.random() * 2;
      agent.satisfaction = 4.5 + Math.random() * 0.5;
      this.agentsStore.set(agent.id, agent);
    }

    this.logger.info(`Seeded ${DEFAULT_AGENTS.length} agents for org ${organizationId}`);
  }

  async hasAgentsForOrg(organizationId: string): Promise<boolean> {
    const agents = await this.getAgents(organizationId);
    return agents.length > 0;
  }
}

export const agentsService = new AgentsService();
