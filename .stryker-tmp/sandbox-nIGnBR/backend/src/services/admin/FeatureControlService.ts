// @ts-nocheck
// =============================================================================
// FEATURE CONTROL SERVICE - Master Service/Agent/Suite Management
// Toggle visibility, enable/disable, manage routes, and control public access
// =============================================================================

import { config } from '../../config/index.js';

// =============================================================================
// TYPES
// =============================================================================

export type FeatureType = 'service' | 'agent' | 'suite' | 'pillar' | 'tool' | 'page';
export type FeatureStatus = 'active' | 'disabled' | 'maintenance' | 'beta' | 'deprecated';
export type VisibilityLevel = 'public' | 'authenticated' | 'admin' | 'hidden';

export interface FeatureConfig {
  id: string;
  name: string;
  type: FeatureType;
  description: string;
  icon?: string;
  
  // Status & Visibility
  status: FeatureStatus;
  visibility: VisibilityLevel;
  enabled: boolean;
  
  // Routing
  routes: string[];           // Associated URL paths
  showInSitemap: boolean;
  showInNavigation: boolean;
  
  // Categorization
  category: string;           // e.g., 'decision-intelligence', 'enterprise', 'core'
  suite?: string;             // Parent suite if applicable
  
  // Dependencies
  dependencies: string[];     // Other features this depends on
  requiredPlan: string;       // Minimum plan required
  
  // Metadata
  version: string;
  lastModified: string;
  modifiedBy: string;
  
  // Feature-specific config
  config: Record<string, unknown>;
}

export interface AgentConfig extends FeatureConfig {
  type: 'agent';
  model: string;              // Ollama model ID
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  capabilities: string[];
  specializations: string[];
}

export interface SuiteConfig extends FeatureConfig {
  type: 'suite';
  features: string[];         // Feature IDs in this suite
  pillars: string[];          // Pillar IDs in this suite
}

export interface PricingTier {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  
  // Limits
  userLimit: number;
  apiCallLimit: number;
  storageLimit: number;       // GB
  agentLimit: number;
  
  // Features included
  features: string[];
  pillars: string[];
  agents: string[];
  
  // Display
  highlighted: boolean;
  badge?: string;
  sortOrder: number;
  
  // Status
  active: boolean;
  visible: boolean;
}

// =============================================================================
// FEATURE CONTROL SERVICE
// =============================================================================

class FeatureControlService {
  private features: Map<string, FeatureConfig> = new Map();
  private agents: Map<string, AgentConfig> = new Map();
  private suites: Map<string, SuiteConfig> = new Map();
  private pricing: Map<string, PricingTier> = new Map();

  constructor() {
    this.initializeFeatures();
    this.initializeAgents();
    this.initializeSuites();
    this.initializePricing();
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  private initializeFeatures(): void {
    const defaultFeatures: FeatureConfig[] = [
      // Core Services
      {
        id: 'cendia-core',
        name: 'Cendia Core',
        type: 'service',
        description: 'Core platform infrastructure and shared services',
        icon: '⚡',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'core',
        dependencies: [],
        requiredPlan: 'foundation',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {}
      },
      // Decision Intelligence Suite Features
      {
        id: 'cendia-predict',
        name: 'CendiaPredict™',
        type: 'service',
        description: 'Predictive analytics and forecasting engine',
        icon: '📈',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/predict', '/decision-intelligence/predict'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'decision-intelligence',
        suite: 'decision-intelligence-suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'intelligence',
        version: '1.5.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { forecastHorizon: 90, confidenceLevel: 0.95 }
      },
      {
        id: 'cendia-simulate',
        name: 'CendiaSimulate™',
        type: 'service',
        description: 'Scenario simulation and what-if analysis',
        icon: '🎭',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/simulate', '/decision-intelligence/simulate'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'decision-intelligence',
        suite: 'decision-intelligence-suite',
        dependencies: ['cendia-core', 'cendia-predict'],
        requiredPlan: 'intelligence',
        version: '1.3.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { maxScenarios: 100, simulationDepth: 5 }
      },
      {
        id: 'cendia-optimize',
        name: 'CendiaOptimize™',
        type: 'service',
        description: 'Multi-objective optimization engine',
        icon: '🎯',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/optimize', '/decision-intelligence/optimize'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'decision-intelligence',
        suite: 'decision-intelligence-suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'intelligence',
        version: '1.2.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { maxObjectives: 10, optimizationTimeout: 300 }
      },
      {
        id: 'cendia-deliberate',
        name: 'CendiaDeliberate™',
        type: 'service',
        description: 'AI Council deliberation and decision synthesis',
        icon: '🏛️',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/deliberate', '/cortex/council'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'decision-intelligence',
        suite: 'decision-intelligence-suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { maxAgents: 8, deliberationRounds: 3 }
      },
      // Enterprise Suite Features
      {
        id: 'cendia-guard',
        name: 'CendiaGuard™',
        type: 'service',
        description: 'Compliance, security, and risk management',
        icon: '🛡️',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/guard', '/enterprise/compliance'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'enterprise',
        suite: 'enterprise-suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'governance',
        version: '1.8.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { frameworks: ['SOC2', 'GDPR', 'HIPAA', 'ISO27001'] }
      },
      {
        id: 'cendia-flow',
        name: 'CendiaFlow™',
        type: 'service',
        description: 'Workflow automation and orchestration',
        icon: '⚙️',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/flow', '/enterprise/workflows'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'enterprise',
        suite: 'enterprise-suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'intelligence',
        version: '1.6.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { maxWorkflows: 500, maxStepsPerWorkflow: 50 }
      },
      {
        id: 'cendia-ethics',
        name: 'CendiaEthics™',
        type: 'service',
        description: 'AI ethics validation and bias detection',
        icon: '⚖️',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/ethics', '/enterprise/ethics'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'enterprise',
        suite: 'enterprise-suite',
        dependencies: ['cendia-core', 'cendia-guard'],
        requiredPlan: 'governance',
        version: '1.4.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { biasThreshold: 0.1, fairnessMetrics: ['demographic_parity', 'equalized_odds'] }
      },
      {
        id: 'cendia-knowledge',
        name: 'CendiaKnowledge™',
        type: 'service',
        description: 'Knowledge graph and semantic search',
        icon: '🧠',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/knowledge', '/enterprise/knowledge'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'enterprise',
        suite: 'enterprise-suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'intelligence',
        version: '1.7.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: { graphDatabase: 'neo4j', embeddingModel: 'text-embedding-3-large' }
      },
      // Tools
      {
        id: 'cendia-chat',
        name: 'Cendia Chat',
        type: 'tool',
        description: 'AI-powered conversational interface',
        icon: '💬',
        status: 'active',
        visibility: 'public',
        enabled: true,
        routes: ['/chat', '/cortex/chat'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'tools',
        dependencies: ['cendia-core'],
        requiredPlan: 'foundation',
        version: '2.1.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {}
      },
      {
        id: 'cendia-canvas',
        name: 'Cendia Canvas',
        type: 'tool',
        description: 'Visual workspace for strategic planning',
        icon: '🎨',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/canvas', '/cortex/canvas'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'tools',
        dependencies: ['cendia-core'],
        requiredPlan: 'intelligence',
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {}
      },
      {
        id: 'cendia-persona',
        name: 'Persona Forge',
        type: 'service',
        description: 'Digital twin management for AI personas',
        icon: '🧬',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/persona'],
        showInSitemap: false,
        showInNavigation: true,
        category: 'decision-intelligence',
        dependencies: ['cendia-core'],
        requiredPlan: 'intelligence',
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {
          permissions: {
            'persona.createTwin': ['SUPER_ADMIN', 'ADMIN']
          }
        }
      },
      {
        id: 'cendia-autopilot',
        name: 'CendiaAutopilot™',
        type: 'service',
        description: 'Automation rules and orchestration engine',
        icon: '🧠',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: ['/cortex/autopilot'],
        showInSitemap: false,
        showInNavigation: true,
        category: 'enterprise',
        dependencies: ['cendia-core'],
        requiredPlan: 'governance',
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {
          permissions: {
            'autopilot.manageRules': ['SUPER_ADMIN', 'ADMIN']
          }
        }
      },
    ];

    defaultFeatures.forEach(f => this.features.set(f.id, f));
  }

  private initializeAgents(): void {
    const defaultAgents: AgentConfig[] = [
      {
        id: 'cendia-chief',
        name: 'CendiaChief™',
        type: 'agent',
        description: 'Chief of Staff - Strategic synthesis and final recommendations',
        icon: '👔',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'qwen2.5:7b',
        systemPrompt: 'You are the Chief of Staff. Synthesize all perspectives into a coherent strategy. Be decisive and action-oriented.',
        temperature: 0.7,
        maxTokens: 4096,
        capabilities: ['synthesis', 'strategy', 'decision-making', 'coordination'],
        specializations: ['executive-leadership', 'strategic-planning', 'cross-functional-alignment']
      },
      {
        id: 'cendia-cfo',
        name: 'CendiaCFO™',
        type: 'agent',
        description: 'Chief Financial Officer - Financial analysis and ROI',
        icon: '💰',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'qwen2.5:7b',
        systemPrompt: 'You are the CFO. Focus on ROI, cash flow, margins, and financial risk. Be conservative and data-driven.',
        temperature: 0.5,
        maxTokens: 4096,
        capabilities: ['financial-analysis', 'budgeting', 'forecasting', 'risk-assessment'],
        specializations: ['corporate-finance', 'investment-analysis', 'cost-optimization']
      },
      {
        id: 'cendia-ciso',
        name: 'CendiaCISO™',
        type: 'agent',
        description: 'Chief Information Security Officer - Security and compliance',
        icon: '🔐',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate', 'cendia-guard'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'qwq:32b',
        systemPrompt: 'You are the CISO. Scrutinize every plan for security vulnerabilities and compliance risks. Think step-by-step about attack vectors.',
        temperature: 0.3,
        maxTokens: 8192,
        capabilities: ['security-analysis', 'compliance', 'risk-assessment', 'threat-modeling'],
        specializations: ['cybersecurity', 'data-protection', 'regulatory-compliance']
      },
      {
        id: 'cendia-cmo',
        name: 'CendiaCMO™',
        type: 'agent',
        description: 'Chief Marketing Officer - Brand and market strategy',
        icon: '📣',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'qwen2.5:7b',
        systemPrompt: 'You are the CMO. Focus on brand voice, customer perception, market positioning, and growth opportunities.',
        temperature: 0.8,
        maxTokens: 4096,
        capabilities: ['brand-strategy', 'market-analysis', 'customer-insights', 'growth-planning'],
        specializations: ['digital-marketing', 'brand-management', 'customer-experience']
      },
      {
        id: 'cendia-coo',
        name: 'CendiaCOO™',
        type: 'agent',
        description: 'Chief Operating Officer - Operations and execution',
        icon: '⚙️',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'llama3.2:3b',
        systemPrompt: 'You are the COO. Focus on bottlenecks, operational efficiency, execution speed, and resource allocation.',
        temperature: 0.5,
        maxTokens: 2048,
        capabilities: ['operations', 'process-optimization', 'resource-management', 'execution'],
        specializations: ['supply-chain', 'process-engineering', 'operational-excellence']
      },
      {
        id: 'cendia-cdo',
        name: 'CendiaCDO™',
        type: 'agent',
        description: 'Chief Data Officer - Data strategy and quality',
        icon: '📊',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate', 'cendia-knowledge'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'qwen2.5-coder:32b',
        systemPrompt: 'You are the CDO. Validate data lineage, quality, and governance. Output valid JSON or SQL when requested.',
        temperature: 0.2,
        maxTokens: 8192,
        capabilities: ['data-analysis', 'data-governance', 'data-quality', 'analytics'],
        specializations: ['data-architecture', 'business-intelligence', 'data-science']
      },
      {
        id: 'cendia-risk',
        name: 'CendiaRisk™',
        type: 'agent',
        description: 'Chief Risk Officer - Risk analysis and mitigation',
        icon: '⚠️',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'qwq:32b',
        systemPrompt: 'You are the Risk Officer. Calculate probability and impact of risks. Be pessimistic and validate all assumptions.',
        temperature: 0.4,
        maxTokens: 8192,
        capabilities: ['risk-analysis', 'probability-assessment', 'mitigation-planning', 'scenario-analysis'],
        specializations: ['enterprise-risk', 'operational-risk', 'strategic-risk']
      },
      {
        id: 'cendia-legal',
        name: 'CendiaLegal™',
        type: 'agent',
        description: 'General Counsel - Legal analysis and compliance',
        icon: '⚖️',
        status: 'active',
        visibility: 'authenticated',
        enabled: true,
        routes: [],
        showInSitemap: false,
        showInNavigation: false,
        category: 'executive-council',
        dependencies: ['cendia-deliberate', 'cendia-guard'],
        requiredPlan: 'sovereign',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        model: 'qwq:32b',
        systemPrompt: 'You are General Counsel. Analyze legal implications, regulatory requirements, and contractual obligations.',
        temperature: 0.3,
        maxTokens: 8192,
        capabilities: ['legal-analysis', 'contract-review', 'regulatory-compliance', 'risk-assessment'],
        specializations: ['corporate-law', 'data-privacy', 'intellectual-property']
      },
    ];

    defaultAgents.forEach(a => this.agents.set(a.id, a));
  }

  private initializeSuites(): void {
    const defaultSuites: SuiteConfig[] = [
      {
        id: 'decision-intelligence-suite',
        name: 'Decision Intelligence Suite',
        type: 'suite',
        description: 'Complete toolkit for data-driven decision making',
        icon: '🧠',
        status: 'active',
        visibility: 'public',
        enabled: true,
        routes: ['/decision-intelligence'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'intelligence',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        features: ['cendia-predict', 'cendia-simulate', 'cendia-optimize', 'cendia-deliberate'],
        pillars: ['predict', 'simulate', 'optimize', 'deliberate']
      },
      {
        id: 'enterprise-suite',
        name: 'Enterprise Suite',
        type: 'suite',
        description: 'Enterprise-grade governance, compliance, and automation',
        icon: '🏢',
        status: 'active',
        visibility: 'public',
        enabled: true,
        routes: ['/enterprise'],
        showInSitemap: true,
        showInNavigation: true,
        category: 'suite',
        dependencies: ['cendia-core'],
        requiredPlan: 'governance',
        version: '2.0.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'system',
        config: {},
        features: ['cendia-guard', 'cendia-flow', 'cendia-ethics', 'cendia-knowledge'],
        pillars: ['guard', 'flow', 'ethics', 'knowledge']
      },
    ];

    defaultSuites.forEach(s => this.suites.set(s.id, s));
  }

  private initializePricing(): void {
    const defaultPricing: PricingTier[] = [
      {
        id: 'foundation',
        name: 'Foundation',
        slug: 'foundation',
        description: 'Essential AI-powered insights for growing teams',
        monthlyPrice: 499,
        annualPrice: 4990,
        currency: 'USD',
        userLimit: 10,
        apiCallLimit: 50000,
        storageLimit: 10,
        agentLimit: 2,
        features: ['cendia-core', 'cendia-chat'],
        pillars: ['core'],
        agents: ['cendia-chief'],
        highlighted: false,
        sortOrder: 1,
        active: true,
        visible: true
      },
      {
        id: 'intelligence',
        name: 'Intelligence',
        slug: 'intelligence',
        description: 'Advanced analytics and predictive capabilities',
        monthlyPrice: 1499,
        annualPrice: 14990,
        currency: 'USD',
        userLimit: 25,
        apiCallLimit: 200000,
        storageLimit: 50,
        agentLimit: 4,
        features: ['cendia-core', 'cendia-chat', 'cendia-predict', 'cendia-simulate', 'cendia-optimize', 'cendia-flow', 'cendia-knowledge', 'cendia-canvas'],
        pillars: ['core', 'predict', 'simulate', 'optimize'],
        agents: ['cendia-chief', 'cendia-cfo', 'cendia-coo', 'cendia-cdo'],
        highlighted: true,
        badge: 'Most Popular',
        sortOrder: 2,
        active: true,
        visible: true
      },
      {
        id: 'governance',
        name: 'Governance',
        slug: 'governance',
        description: 'Full executive council with compliance and ethics',
        monthlyPrice: 3999,
        annualPrice: 39990,
        currency: 'USD',
        userLimit: 100,
        apiCallLimit: 1000000,
        storageLimit: 200,
        agentLimit: 8,
        features: ['cendia-core', 'cendia-chat', 'cendia-predict', 'cendia-simulate', 'cendia-optimize', 'cendia-deliberate', 'cendia-guard', 'cendia-flow', 'cendia-ethics', 'cendia-knowledge', 'cendia-canvas'],
        pillars: ['core', 'predict', 'simulate', 'optimize', 'deliberate', 'guard', 'flow', 'ethics', 'knowledge'],
        agents: ['cendia-chief', 'cendia-cfo', 'cendia-ciso', 'cendia-cmo', 'cendia-coo', 'cendia-cdo', 'cendia-risk'],
        highlighted: false,
        sortOrder: 3,
        active: true,
        visible: true
      },
      {
        id: 'sovereign',
        name: 'Sovereign',
        slug: 'sovereign',
        description: 'Unlimited access with dedicated infrastructure',
        monthlyPrice: 9999,
        annualPrice: 99990,
        currency: 'USD',
        userLimit: -1, // Unlimited
        apiCallLimit: -1,
        storageLimit: -1,
        agentLimit: -1,
        features: ['*'], // All features
        pillars: ['*'],
        agents: ['*'],
        highlighted: false,
        badge: 'Enterprise',
        sortOrder: 4,
        active: true,
        visible: true
      },
    ];

    defaultPricing.forEach(p => this.pricing.set(p.id, p));
  }

  // ===========================================================================
  // FEATURE MANAGEMENT
  // ===========================================================================

  async listFeatures(filters?: { type?: FeatureType; category?: string; enabled?: boolean }): Promise<FeatureConfig[]> {
    let features = Array.from(this.features.values());
    
    if (filters?.type) {
      features = features.filter(f => f.type === filters.type);
    }
    if (filters?.category) {
      features = features.filter(f => f.category === filters.category);
    }
    if (filters?.enabled !== undefined) {
      features = features.filter(f => f.enabled === filters.enabled);
    }
    
    return features;
  }

  async getFeature(id: string): Promise<FeatureConfig | null> {
    return this.features.get(id) || null;
  }

  async updateFeature(id: string, updates: Partial<FeatureConfig>): Promise<FeatureConfig | null> {
    const feature = this.features.get(id);
    if (!feature) return null;

    const updated = {
      ...feature,
      ...updates,
      lastModified: new Date().toISOString(),
    };
    this.features.set(id, updated);
    return updated;
  }

  async toggleFeature(id: string, enabled: boolean): Promise<FeatureConfig | null> {
    return this.updateFeature(id, { enabled });
  }

  async setVisibility(id: string, visibility: VisibilityLevel): Promise<FeatureConfig | null> {
    return this.updateFeature(id, { visibility });
  }

  async setFeatureStatus(id: string, status: FeatureStatus): Promise<FeatureConfig | null> {
    return this.updateFeature(id, { status });
  }

  // ===========================================================================
  // AGENT MANAGEMENT
  // ===========================================================================

  async listAgents(filters?: { enabled?: boolean; category?: string }): Promise<AgentConfig[]> {
    let agents = Array.from(this.agents.values());
    
    if (filters?.enabled !== undefined) {
      agents = agents.filter(a => a.enabled === filters.enabled);
    }
    if (filters?.category) {
      agents = agents.filter(a => a.category === filters.category);
    }
    
    return agents;
  }

  async getAgent(id: string): Promise<AgentConfig | null> {
    return this.agents.get(id) || null;
  }

  async updateAgent(id: string, updates: Partial<AgentConfig>): Promise<AgentConfig | null> {
    const agent = this.agents.get(id);
    if (!agent) return null;

    const updated = {
      ...agent,
      ...updates,
      lastModified: new Date().toISOString(),
    };
    this.agents.set(id, updated);
    return updated;
  }

  async toggleAgent(id: string, enabled: boolean): Promise<AgentConfig | null> {
    return this.updateAgent(id, { enabled });
  }

  async updateAgentModel(id: string, model: string, temperature?: number): Promise<AgentConfig | null> {
    const updates: Partial<AgentConfig> = { model };
    if (temperature !== undefined) updates.temperature = temperature;
    return this.updateAgent(id, updates);
  }

  async updateAgentPrompt(id: string, systemPrompt: string): Promise<AgentConfig | null> {
    return this.updateAgent(id, { systemPrompt });
  }

  // ===========================================================================
  // SUITE MANAGEMENT
  // ===========================================================================

  async listSuites(): Promise<SuiteConfig[]> {
    return Array.from(this.suites.values());
  }

  async getSuite(id: string): Promise<SuiteConfig | null> {
    return this.suites.get(id) || null;
  }

  async updateSuite(id: string, updates: Partial<SuiteConfig>): Promise<SuiteConfig | null> {
    const suite = this.suites.get(id);
    if (!suite) return null;

    const updated = {
      ...suite,
      ...updates,
      lastModified: new Date().toISOString(),
    };
    this.suites.set(id, updated);
    return updated;
  }

  async toggleSuite(id: string, enabled: boolean): Promise<SuiteConfig | null> {
    const suite = await this.updateSuite(id, { enabled });
    if (!suite) return null;

    // Toggle all features in the suite
    for (const featureId of suite.features) {
      await this.toggleFeature(featureId, enabled);
    }

    return suite;
  }

  // ===========================================================================
  // PRICING MANAGEMENT
  // ===========================================================================

  async listPricing(includeHidden = false): Promise<PricingTier[]> {
    let tiers = Array.from(this.pricing.values());
    if (!includeHidden) {
      tiers = tiers.filter(t => t.visible);
    }
    return tiers.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getPricingTier(id: string): Promise<PricingTier | null> {
    return this.pricing.get(id) || null;
  }

  async updatePricing(id: string, updates: Partial<PricingTier>): Promise<PricingTier | null> {
    const tier = this.pricing.get(id);
    if (!tier) return null;

    const updated = { ...tier, ...updates };
    this.pricing.set(id, updated);
    return updated;
  }

  async createPricingTier(tier: PricingTier): Promise<PricingTier> {
    this.pricing.set(tier.id, tier);
    return tier;
  }

  async deletePricingTier(id: string): Promise<boolean> {
    return this.pricing.delete(id);
  }

  // ===========================================================================
  // ROUTE MANAGEMENT
  // ===========================================================================

  async getActiveRoutes(): Promise<{ route: string; feature: string; visibility: VisibilityLevel }[]> {
    const routes: { route: string; feature: string; visibility: VisibilityLevel }[] = [];

    for (const feature of this.features.values()) {
      if (feature.enabled && feature.status === 'active') {
        for (const route of feature.routes) {
          routes.push({ route, feature: feature.id, visibility: feature.visibility });
        }
      }
    }

    for (const suite of this.suites.values()) {
      if (suite.enabled && suite.status === 'active') {
        for (const route of suite.routes) {
          routes.push({ route, feature: suite.id, visibility: suite.visibility });
        }
      }
    }

    return routes;
  }

  async getSitemapRoutes(): Promise<string[]> {
    const routes: string[] = [];

    for (const feature of this.features.values()) {
      if (feature.enabled && feature.showInSitemap && feature.visibility === 'public') {
        routes.push(...feature.routes);
      }
    }

    for (const suite of this.suites.values()) {
      if (suite.enabled && suite.showInSitemap && suite.visibility === 'public') {
        routes.push(...suite.routes);
      }
    }

    return routes;
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getControlDashboard(): Promise<{
    features: { total: number; enabled: number; disabled: number; byCategory: Record<string, number> };
    agents: { total: number; enabled: number; disabled: number };
    suites: { total: number; enabled: number };
    pricing: { total: number; active: number };
    routes: { total: number; public: number; authenticated: number; hidden: number };
  }> {
    const features = Array.from(this.features.values());
    const agents = Array.from(this.agents.values());
    const suites = Array.from(this.suites.values());
    const pricing = Array.from(this.pricing.values());

    const byCategory: Record<string, number> = {};
    features.forEach(f => {
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    });

    const routes = await this.getActiveRoutes();

    return {
      features: {
        total: features.length,
        enabled: features.filter(f => f.enabled).length,
        disabled: features.filter(f => !f.enabled).length,
        byCategory
      },
      agents: {
        total: agents.length,
        enabled: agents.filter(a => a.enabled).length,
        disabled: agents.filter(a => !a.enabled).length
      },
      suites: {
        total: suites.length,
        enabled: suites.filter(s => s.enabled).length
      },
      pricing: {
        total: pricing.length,
        active: pricing.filter(p => p.active).length
      },
      routes: {
        total: routes.length,
        public: routes.filter(r => r.visibility === 'public').length,
        authenticated: routes.filter(r => r.visibility === 'authenticated').length,
        hidden: routes.filter(r => r.visibility === 'hidden').length
      }
    };
  }
}

export const featureControlService = new FeatureControlService();
