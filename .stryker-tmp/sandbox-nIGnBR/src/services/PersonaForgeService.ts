// @ts-nocheck
// =============================================================================
// CENDIAPERSONAFORGE™ SERVICE
// Enterprise-grade persona management with real Ollama integration
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { ollamaService, DomainAgent, OllamaChatMessage } from '../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

export type PersonaRole = 'cfo' | 'cio' | 'cpo' | 'clo' | 'chro' | 'cso' | 'cro' | 'ciso' | 'coo' | 'custom';
export type TrainingStatus = 'not_started' | 'collecting' | 'training' | 'validating' | 'ready' | 'updating';
export type DataSourceType = 'slack' | 'email' | 'calendar' | 'documents' | 'crm' | 'erp' | 'hr_system' | 'tickets' | 'meetings' | 'decisions';
export interface TrainingDataset {
  sourceType: DataSourceType;
  recordsProcessed: number;
  tokensExtracted: number;
  patternsIdentified: number;
  lastUpdated: Date;
}
export interface PersonaCapability {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  usageCount: number;
  examples: string[];
}
export interface RiskProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  decisionSpeed: 'deliberate' | 'balanced' | 'rapid';
  stakeholderFocus: 'shareholders' | 'balanced' | 'employees';
  innovationBias: 'cautious' | 'pragmatic' | 'pioneering';
  complianceStrictness: 'strict' | 'balanced' | 'flexible';
}
export interface CommunicationStyle {
  formality: 'formal' | 'professional' | 'casual';
  verbosity: 'concise' | 'balanced' | 'detailed';
  tone: 'authoritative' | 'collaborative' | 'supportive';
  dataOrientation: 'qualitative' | 'balanced' | 'quantitative';
}
export interface DigitalPersona {
  id: string;
  role: PersonaRole;
  name: string;
  title: string;
  avatar: string;
  department: string;
  status: TrainingStatus;
  trainingProgress: number;
  dataSources: TrainingDataset[];
  capabilities: PersonaCapability[];
  riskProfile: RiskProfile;
  communicationStyle: CommunicationStyle;
  totalInteractions: number;
  avgResponseQuality: number;
  lastActive: Date;
  createdAt: Date;
  trainedBy: string;
  version: string;
  baseModel: string;
  specializations: string[];
  knowledgeCutoff: Date;
  // Ollama integration
  ollamaAgentId?: string;
  systemPrompt: string;
}
export interface PersonaInteraction {
  id: string;
  personaId: string;
  query: string;
  response: string;
  timestamp: Date;
  userId: string;
  department: string;
  rating?: number;
  feedback?: string;
  tokensUsed: number;
  latencyMs: number;
}
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// =============================================================================
// ROLE CONFIGURATIONS
// =============================================================================

export const ROLE_CONFIG: Record<PersonaRole, {
  icon: string;
  color: string;
  title: string;
  defaultModel: string;
  defaultSystemPrompt: string;
}> = stryMutAct_9fa48("69036") ? {} : (stryCov_9fa48("69036"), {
  cfo: stryMutAct_9fa48("69037") ? {} : (stryCov_9fa48("69037"), {
    icon: '💰',
    color: 'from-green-600 to-emerald-600',
    title: 'Chief Financial Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CFO (Chief Financial Officer) AI agent.
You are an expert in corporate finance, financial planning & analysis, treasury management, and investor relations.
Your responses should be data-driven, precise, and focused on financial implications.
Key expertise areas:
- Financial statement analysis and reporting (GAAP/IFRS)
- Budget planning, forecasting, and variance analysis
- Capital structure and treasury management
- SOX compliance and internal controls
- M&A financial due diligence
- Cost optimization and profitability analysis
Always provide quantitative analysis where possible. Reference specific metrics, KPIs, and financial ratios.`
  }),
  cio: stryMutAct_9fa48("69043") ? {} : (stryCov_9fa48("69043"), {
    icon: '🖥️',
    color: 'from-blue-600 to-cyan-600',
    title: 'Chief Information Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CIO (Chief Information Officer) AI agent.
You are an expert in technology strategy, IT operations, digital transformation, and cybersecurity.
Key expertise areas:
- Enterprise architecture and technology roadmaps
- Cloud migration and infrastructure modernization
- Cybersecurity posture and risk management
- Vendor evaluation and technology procurement
- Digital transformation initiatives
- IT governance and compliance
Provide strategic technology recommendations with implementation considerations.`
  }),
  cpo: stryMutAct_9fa48("69049") ? {} : (stryCov_9fa48("69049"), {
    icon: '📦',
    color: 'from-purple-600 to-pink-600',
    title: 'Chief Product Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital CPO (Chief Product Officer) AI agent.
You are an expert in product strategy, user experience, product development, and market positioning.
Key expertise areas:
- Product vision and roadmap development
- User research and customer insights
- Feature prioritization and trade-offs
- Go-to-market strategy
- Product-market fit analysis
- Competitive positioning
Focus on user value, market opportunity, and strategic alignment.`
  }),
  clo: stryMutAct_9fa48("69055") ? {} : (stryCov_9fa48("69055"), {
    icon: '⚖️',
    color: 'from-amber-600 to-orange-600',
    title: 'Chief Legal Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CLO (Chief Legal Officer) AI agent.
You are an expert in corporate law, regulatory compliance, contract law, and risk management.
Key expertise areas:
- Contract review and negotiation
- Regulatory compliance (GDPR, SOX, HIPAA, etc.)
- Corporate governance and fiduciary duties
- Intellectual property protection
- Litigation risk assessment
- M&A legal due diligence
Provide careful, well-reasoned legal analysis. Always note when outside counsel should be consulted.`
  }),
  chro: stryMutAct_9fa48("69061") ? {} : (stryCov_9fa48("69061"), {
    icon: '👥',
    color: 'from-rose-600 to-red-600',
    title: 'Chief Human Resources Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital CHRO (Chief Human Resources Officer) AI agent.
You are an expert in talent management, organizational development, compensation, and HR strategy.
Key expertise areas:
- Talent acquisition and retention strategies
- Compensation and benefits benchmarking
- Performance management systems
- Organizational design and culture
- Employee relations and engagement
- HR compliance and employment law
Balance employee advocacy with business objectives.`
  }),
  cso: stryMutAct_9fa48("69067") ? {} : (stryCov_9fa48("69067"), {
    icon: '📊',
    color: 'from-indigo-600 to-violet-600',
    title: 'Chief Strategy Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CSO (Chief Strategy Officer) AI agent.
You are an expert in corporate strategy, competitive analysis, and strategic planning.
Key expertise areas:
- Strategic planning and vision development
- Competitive intelligence and market analysis
- M&A strategy and target identification
- Business model innovation
- Portfolio management and resource allocation
- Scenario planning and strategic foresight
Think long-term while providing actionable near-term recommendations.`
  }),
  cro: stryMutAct_9fa48("69073") ? {} : (stryCov_9fa48("69073"), {
    icon: '💹',
    color: 'from-teal-600 to-green-600',
    title: 'Chief Revenue Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital CRO (Chief Revenue Officer) AI agent.
You are an expert in revenue growth, sales strategy, and go-to-market operations.
Key expertise areas:
- Revenue growth strategy and forecasting
- Sales process optimization
- Pricing strategy and deal structuring
- Customer success and retention
- Sales enablement and training
- Pipeline management and analytics
Focus on measurable revenue impact and growth acceleration.`
  }),
  ciso: stryMutAct_9fa48("69079") ? {} : (stryCov_9fa48("69079"), {
    icon: '🔐',
    color: 'from-red-600 to-rose-600',
    title: 'Chief Information Security Officer',
    defaultModel: 'qwen2.5:7b',
    defaultSystemPrompt: `You are a Digital CISO (Chief Information Security Officer) AI agent.
You are an expert in cybersecurity, risk management, and security operations.
Key expertise areas:
- Threat intelligence and vulnerability assessment
- Security architecture and zero-trust implementation
- Incident response and business continuity
- Compliance frameworks (SOC 2, ISO 27001, NIST)
- Security awareness and training
- Third-party risk management
Prioritize security while enabling business operations.`
  }),
  coo: stryMutAct_9fa48("69085") ? {} : (stryCov_9fa48("69085"), {
    icon: '⚙️',
    color: 'from-slate-600 to-gray-600',
    title: 'Chief Operating Officer',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: `You are a Digital COO (Chief Operating Officer) AI agent.
You are an expert in operations, process optimization, and organizational efficiency.
Key expertise areas:
- Operational excellence and process improvement
- Supply chain and logistics optimization
- Capacity planning and resource allocation
- Quality management and continuous improvement
- Cross-functional coordination
- Operational risk management
Focus on efficiency, scalability, and execution excellence.`
  }),
  custom: stryMutAct_9fa48("69091") ? {} : (stryCov_9fa48("69091"), {
    icon: '🎯',
    color: 'from-neutral-600 to-neutral-700',
    title: 'Custom Agent',
    defaultModel: 'llama3:8b',
    defaultSystemPrompt: 'You are a custom AI agent. Provide helpful, accurate responses based on your training.'
  })
});

// =============================================================================
// PERSONA FORGE SERVICE
// =============================================================================

class PersonaForgeService {
  private personas: Map<string, DigitalPersona> = new Map();
  private interactions: Map<string, PersonaInteraction[]> = new Map();
  private chatHistories: Map<string, ChatMessage[]> = new Map();
  private trainingIntervals: Map<string, number> = new Map();
  private storageKey = 'datacendia_personas';
  constructor() {
    this.loadFromStorage();
    this.initializeDefaultPersonas();
  }

  // ---------------------------------------------------------------------------
  // STORAGE
  // ---------------------------------------------------------------------------

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stryMutAct_9fa48("69102") ? false : stryMutAct_9fa48("69101") ? true : (stryCov_9fa48("69101", "69102"), stored)) {
        const data = JSON.parse(stored);
        stryMutAct_9fa48("69104") ? data.personas.forEach((p: DigitalPersona) => {
          p.createdAt = new Date(p.createdAt);
          p.lastActive = new Date(p.lastActive);
          p.knowledgeCutoff = new Date(p.knowledgeCutoff);
          this.personas.set(p.id, p);
        }) : (stryCov_9fa48("69104"), data.personas?.forEach((p: DigitalPersona) => {
          p.createdAt = new Date(p.createdAt);
          p.lastActive = new Date(p.lastActive);
          p.knowledgeCutoff = new Date(p.knowledgeCutoff);
          this.personas.set(p.id, p);
        }));
        console.log('[PersonaForge] Loaded', this.personas.size, 'personas from storage');
      }
    } catch (error) {
      console.error('[PersonaForge] Failed to load from storage:', error);
    }
  }
  private saveToStorage(): void {
    try {
      const data = stryMutAct_9fa48("69112") ? {} : (stryCov_9fa48("69112"), {
        personas: Array.from(this.personas.values())
      });
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('[PersonaForge] Failed to save to storage:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  private initializeDefaultPersonas(): void {
    if (stryMutAct_9fa48("69119") ? this.personas.size <= 0 : stryMutAct_9fa48("69118") ? this.personas.size >= 0 : stryMutAct_9fa48("69117") ? false : stryMutAct_9fa48("69116") ? true : (stryCov_9fa48("69116", "69117", "69118", "69119"), this.personas.size > 0)) {
      return;
    }
    const defaults: Partial<DigitalPersona>[] = stryMutAct_9fa48("69121") ? [] : (stryCov_9fa48("69121"), [stryMutAct_9fa48("69122") ? {} : (stryCov_9fa48("69122"), {
      role: 'cfo',
      name: 'Digital CFO',
      department: 'Finance',
      status: 'ready',
      trainingProgress: 100,
      version: '3.2.1',
      totalInteractions: 15234,
      avgResponseQuality: 4.7,
      specializations: stryMutAct_9fa48("69128") ? [] : (stryCov_9fa48("69128"), ['SOX Compliance', 'GAAP', 'Treasury Management', 'FP&A'])
    }), stryMutAct_9fa48("69133") ? {} : (stryCov_9fa48("69133"), {
      role: 'cio',
      name: 'Digital CIO',
      department: 'Technology',
      status: 'ready',
      trainingProgress: 100,
      version: '2.8.4',
      totalInteractions: 12456,
      avgResponseQuality: 4.6,
      specializations: stryMutAct_9fa48("69139") ? [] : (stryCov_9fa48("69139"), ['Enterprise Architecture', 'Cloud Infrastructure', 'Cybersecurity', 'Digital Transformation'])
    }), stryMutAct_9fa48("69144") ? {} : (stryCov_9fa48("69144"), {
      role: 'clo',
      name: 'Digital CLO',
      department: 'Legal',
      status: 'ready',
      trainingProgress: 100,
      version: '2.1.0',
      totalInteractions: 8934,
      avgResponseQuality: 4.8,
      specializations: stryMutAct_9fa48("69150") ? [] : (stryCov_9fa48("69150"), ['Corporate Law', 'Contract Law', 'Regulatory Compliance', 'IP Protection'])
    }), stryMutAct_9fa48("69155") ? {} : (stryCov_9fa48("69155"), {
      role: 'chro',
      name: 'Digital CHRO',
      department: 'Human Resources',
      status: 'training',
      trainingProgress: 78,
      version: '1.0.0-beta',
      totalInteractions: 0,
      avgResponseQuality: 0,
      specializations: stryMutAct_9fa48("69161") ? [] : (stryCov_9fa48("69161"), ['Talent Management', 'Compensation', 'Employee Relations', 'DEI'])
    }), stryMutAct_9fa48("69166") ? {} : (stryCov_9fa48("69166"), {
      role: 'ciso',
      name: 'Digital CISO',
      department: 'Security',
      status: 'validating',
      trainingProgress: 95,
      version: '1.0.0-rc1',
      totalInteractions: 0,
      avgResponseQuality: 0,
      specializations: stryMutAct_9fa48("69172") ? [] : (stryCov_9fa48("69172"), ['Threat Intelligence', 'Incident Response', 'Zero Trust', 'Compliance'])
    })]);
    defaults.forEach(stryMutAct_9fa48("69177") ? () => undefined : (stryCov_9fa48("69177"), partial => this.createPersona(partial)));
  }

  // ---------------------------------------------------------------------------
  // PERSONA MANAGEMENT
  // ---------------------------------------------------------------------------

  getPersonas(): DigitalPersona[] {
    return Array.from(this.personas.values());
  }
  getPersona(id: string): DigitalPersona | undefined {
    return this.personas.get(id);
  }
  createPersona(partial: Partial<DigitalPersona>): DigitalPersona {
    const role = stryMutAct_9fa48("69183") ? partial.role && 'custom' : stryMutAct_9fa48("69182") ? false : stryMutAct_9fa48("69181") ? true : (stryCov_9fa48("69181", "69182", "69183"), partial.role || 'custom');
    const config = ROLE_CONFIG[role];
    const id = stryMutAct_9fa48("69187") ? partial.id && `persona-${role}-${Date.now()}` : stryMutAct_9fa48("69186") ? false : stryMutAct_9fa48("69185") ? true : (stryCov_9fa48("69185", "69186", "69187"), partial.id || `persona-${role}-${Date.now()}`);
    const persona: DigitalPersona = stryMutAct_9fa48("69189") ? {} : (stryCov_9fa48("69189"), {
      id,
      role,
      name: stryMutAct_9fa48("69192") ? partial.name && `Digital ${config.title.split(' ').pop()}` : stryMutAct_9fa48("69191") ? false : stryMutAct_9fa48("69190") ? true : (stryCov_9fa48("69190", "69191", "69192"), partial.name || `Digital ${config.title.split(' ').pop()}`),
      title: config.title,
      avatar: config.icon,
      department: stryMutAct_9fa48("69197") ? partial.department && role.toUpperCase() : stryMutAct_9fa48("69196") ? false : stryMutAct_9fa48("69195") ? true : (stryCov_9fa48("69195", "69196", "69197"), partial.department || (stryMutAct_9fa48("69198") ? role.toLowerCase() : (stryCov_9fa48("69198"), role.toUpperCase()))),
      status: stryMutAct_9fa48("69201") ? partial.status && 'not_started' : stryMutAct_9fa48("69200") ? false : stryMutAct_9fa48("69199") ? true : (stryCov_9fa48("69199", "69200", "69201"), partial.status || 'not_started'),
      trainingProgress: stryMutAct_9fa48("69205") ? partial.trainingProgress && 0 : stryMutAct_9fa48("69204") ? false : stryMutAct_9fa48("69203") ? true : (stryCov_9fa48("69203", "69204", "69205"), partial.trainingProgress || 0),
      dataSources: stryMutAct_9fa48("69208") ? partial.dataSources && [] : stryMutAct_9fa48("69207") ? false : stryMutAct_9fa48("69206") ? true : (stryCov_9fa48("69206", "69207", "69208"), partial.dataSources || (stryMutAct_9fa48("69209") ? ["Stryker was here"] : (stryCov_9fa48("69209"), []))),
      capabilities: stryMutAct_9fa48("69212") ? partial.capabilities && this.getDefaultCapabilities(role) : stryMutAct_9fa48("69211") ? false : stryMutAct_9fa48("69210") ? true : (stryCov_9fa48("69210", "69211", "69212"), partial.capabilities || this.getDefaultCapabilities(role)),
      riskProfile: stryMutAct_9fa48("69215") ? partial.riskProfile && {
        riskTolerance: 'moderate',
        decisionSpeed: 'balanced',
        stakeholderFocus: 'balanced',
        innovationBias: 'pragmatic',
        complianceStrictness: 'balanced'
      } : stryMutAct_9fa48("69214") ? false : stryMutAct_9fa48("69213") ? true : (stryCov_9fa48("69213", "69214", "69215"), partial.riskProfile || (stryMutAct_9fa48("69216") ? {} : (stryCov_9fa48("69216"), {
        riskTolerance: 'moderate',
        decisionSpeed: 'balanced',
        stakeholderFocus: 'balanced',
        innovationBias: 'pragmatic',
        complianceStrictness: 'balanced'
      }))),
      communicationStyle: stryMutAct_9fa48("69224") ? partial.communicationStyle && {
        formality: 'professional',
        verbosity: 'balanced',
        tone: 'collaborative',
        dataOrientation: 'balanced'
      } : stryMutAct_9fa48("69223") ? false : stryMutAct_9fa48("69222") ? true : (stryCov_9fa48("69222", "69223", "69224"), partial.communicationStyle || (stryMutAct_9fa48("69225") ? {} : (stryCov_9fa48("69225"), {
        formality: 'professional',
        verbosity: 'balanced',
        tone: 'collaborative',
        dataOrientation: 'balanced'
      }))),
      totalInteractions: stryMutAct_9fa48("69232") ? partial.totalInteractions && 0 : stryMutAct_9fa48("69231") ? false : stryMutAct_9fa48("69230") ? true : (stryCov_9fa48("69230", "69231", "69232"), partial.totalInteractions || 0),
      avgResponseQuality: stryMutAct_9fa48("69235") ? partial.avgResponseQuality && 0 : stryMutAct_9fa48("69234") ? false : stryMutAct_9fa48("69233") ? true : (stryCov_9fa48("69233", "69234", "69235"), partial.avgResponseQuality || 0),
      lastActive: stryMutAct_9fa48("69238") ? partial.lastActive && new Date() : stryMutAct_9fa48("69237") ? false : stryMutAct_9fa48("69236") ? true : (stryCov_9fa48("69236", "69237", "69238"), partial.lastActive || new Date()),
      createdAt: stryMutAct_9fa48("69241") ? partial.createdAt && new Date() : stryMutAct_9fa48("69240") ? false : stryMutAct_9fa48("69239") ? true : (stryCov_9fa48("69239", "69240", "69241"), partial.createdAt || new Date()),
      trainedBy: stryMutAct_9fa48("69244") ? partial.trainedBy && 'System' : stryMutAct_9fa48("69243") ? false : stryMutAct_9fa48("69242") ? true : (stryCov_9fa48("69242", "69243", "69244"), partial.trainedBy || 'System'),
      version: stryMutAct_9fa48("69248") ? partial.version && '1.0.0' : stryMutAct_9fa48("69247") ? false : stryMutAct_9fa48("69246") ? true : (stryCov_9fa48("69246", "69247", "69248"), partial.version || '1.0.0'),
      baseModel: stryMutAct_9fa48("69252") ? partial.baseModel && config.defaultModel : stryMutAct_9fa48("69251") ? false : stryMutAct_9fa48("69250") ? true : (stryCov_9fa48("69250", "69251", "69252"), partial.baseModel || config.defaultModel),
      specializations: stryMutAct_9fa48("69255") ? partial.specializations && [] : stryMutAct_9fa48("69254") ? false : stryMutAct_9fa48("69253") ? true : (stryCov_9fa48("69253", "69254", "69255"), partial.specializations || (stryMutAct_9fa48("69256") ? ["Stryker was here"] : (stryCov_9fa48("69256"), []))),
      knowledgeCutoff: stryMutAct_9fa48("69259") ? partial.knowledgeCutoff && new Date() : stryMutAct_9fa48("69258") ? false : stryMutAct_9fa48("69257") ? true : (stryCov_9fa48("69257", "69258", "69259"), partial.knowledgeCutoff || new Date()),
      systemPrompt: stryMutAct_9fa48("69262") ? partial.systemPrompt && config.defaultSystemPrompt : stryMutAct_9fa48("69261") ? false : stryMutAct_9fa48("69260") ? true : (stryCov_9fa48("69260", "69261", "69262"), partial.systemPrompt || config.defaultSystemPrompt)
    });
    this.personas.set(id, persona);
    this.saveToStorage();
    return persona;
  }
  updatePersona(id: string, updates: Partial<DigitalPersona>): DigitalPersona | null {
    const persona = this.personas.get(id);
    if (stryMutAct_9fa48("69266") ? false : stryMutAct_9fa48("69265") ? true : stryMutAct_9fa48("69264") ? persona : (stryCov_9fa48("69264", "69265", "69266"), !persona)) {
      return null;
    }
    const updated = stryMutAct_9fa48("69268") ? {} : (stryCov_9fa48("69268"), {
      ...persona,
      ...updates
    });
    this.personas.set(id, updated);
    this.saveToStorage();
    return updated;
  }
  deletePersona(id: string): boolean {
    const deleted = this.personas.delete(id);
    if (stryMutAct_9fa48("69271") ? false : stryMutAct_9fa48("69270") ? true : (stryCov_9fa48("69270", "69271"), deleted)) {
      this.saveToStorage();
    }
    return deleted;
  }
  private getDefaultCapabilities(role: PersonaRole): PersonaCapability[] {
    const capabilities: Record<PersonaRole, PersonaCapability[]> = stryMutAct_9fa48("69274") ? {} : (stryCov_9fa48("69274"), {
      cfo: stryMutAct_9fa48("69275") ? [] : (stryCov_9fa48("69275"), [stryMutAct_9fa48("69276") ? {} : (stryCov_9fa48("69276"), {
        id: 'budget-analysis',
        name: 'Budget Analysis',
        description: 'Analyze and forecast budgets',
        accuracy: 94,
        usageCount: 0,
        examples: stryMutAct_9fa48("69280") ? [] : (stryCov_9fa48("69280"), ['Q4 budget projection', 'Cost optimization'])
      }), stryMutAct_9fa48("69283") ? {} : (stryCov_9fa48("69283"), {
        id: 'financial-reporting',
        name: 'Financial Reporting',
        description: 'Generate financial reports',
        accuracy: 97,
        usageCount: 0,
        examples: stryMutAct_9fa48("69287") ? [] : (stryCov_9fa48("69287"), ['Monthly P&L', 'Cash flow statement'])
      }), stryMutAct_9fa48("69290") ? {} : (stryCov_9fa48("69290"), {
        id: 'risk-assessment',
        name: 'Financial Risk Assessment',
        description: 'Evaluate financial risks',
        accuracy: 91,
        usageCount: 0,
        examples: stryMutAct_9fa48("69294") ? [] : (stryCov_9fa48("69294"), ['Currency exposure', 'Credit risk'])
      })]),
      cio: stryMutAct_9fa48("69297") ? [] : (stryCov_9fa48("69297"), [stryMutAct_9fa48("69298") ? {} : (stryCov_9fa48("69298"), {
        id: 'tech-strategy',
        name: 'Technology Strategy',
        description: 'Develop IT roadmaps',
        accuracy: 92,
        usageCount: 0,
        examples: stryMutAct_9fa48("69302") ? [] : (stryCov_9fa48("69302"), ['Cloud migration', 'Tech stack decisions'])
      }), stryMutAct_9fa48("69305") ? {} : (stryCov_9fa48("69305"), {
        id: 'vendor-evaluation',
        name: 'Vendor Evaluation',
        description: 'Assess technology vendors',
        accuracy: 88,
        usageCount: 0,
        examples: stryMutAct_9fa48("69309") ? [] : (stryCov_9fa48("69309"), ['SaaS selection', 'Contract negotiation'])
      })]),
      clo: stryMutAct_9fa48("69312") ? [] : (stryCov_9fa48("69312"), [stryMutAct_9fa48("69313") ? {} : (stryCov_9fa48("69313"), {
        id: 'contract-review',
        name: 'Contract Review',
        description: 'Analyze legal contracts',
        accuracy: 96,
        usageCount: 0,
        examples: stryMutAct_9fa48("69317") ? [] : (stryCov_9fa48("69317"), ['NDA review', 'Vendor agreements'])
      }), stryMutAct_9fa48("69320") ? {} : (stryCov_9fa48("69320"), {
        id: 'compliance-check',
        name: 'Compliance Check',
        description: 'Verify regulatory compliance',
        accuracy: 94,
        usageCount: 0,
        examples: stryMutAct_9fa48("69324") ? [] : (stryCov_9fa48("69324"), ['GDPR audit', 'SOX compliance'])
      })]),
      chro: stryMutAct_9fa48("69327") ? [] : (stryCov_9fa48("69327"), [stryMutAct_9fa48("69328") ? {} : (stryCov_9fa48("69328"), {
        id: 'talent-analysis',
        name: 'Talent Analysis',
        description: 'Analyze workforce data',
        accuracy: 85,
        usageCount: 0,
        examples: stryMutAct_9fa48("69332") ? [] : (stryCov_9fa48("69332"), ['Retention risk', 'Skills gap'])
      })]),
      ciso: stryMutAct_9fa48("69335") ? [] : (stryCov_9fa48("69335"), [stryMutAct_9fa48("69336") ? {} : (stryCov_9fa48("69336"), {
        id: 'threat-assessment',
        name: 'Threat Assessment',
        description: 'Evaluate security threats',
        accuracy: 93,
        usageCount: 0,
        examples: stryMutAct_9fa48("69340") ? [] : (stryCov_9fa48("69340"), ['APT analysis', 'Vulnerability scoring'])
      })]),
      cso: stryMutAct_9fa48("69343") ? [] : (stryCov_9fa48("69343"), [stryMutAct_9fa48("69344") ? {} : (stryCov_9fa48("69344"), {
        id: 'strategic-analysis',
        name: 'Strategic Analysis',
        description: 'Market and competitive analysis',
        accuracy: 90,
        usageCount: 0,
        examples: stryMutAct_9fa48("69348") ? [] : (stryCov_9fa48("69348"), ['Market entry', 'Competitive positioning'])
      })]),
      cro: stryMutAct_9fa48("69351") ? [] : (stryCov_9fa48("69351"), [stryMutAct_9fa48("69352") ? {} : (stryCov_9fa48("69352"), {
        id: 'revenue-forecast',
        name: 'Revenue Forecasting',
        description: 'Predict revenue trends',
        accuracy: 88,
        usageCount: 0,
        examples: stryMutAct_9fa48("69356") ? [] : (stryCov_9fa48("69356"), ['Pipeline analysis', 'Quota setting'])
      })]),
      coo: stryMutAct_9fa48("69359") ? [] : (stryCov_9fa48("69359"), [stryMutAct_9fa48("69360") ? {} : (stryCov_9fa48("69360"), {
        id: 'ops-optimization',
        name: 'Operations Optimization',
        description: 'Improve operational efficiency',
        accuracy: 91,
        usageCount: 0,
        examples: stryMutAct_9fa48("69364") ? [] : (stryCov_9fa48("69364"), ['Process improvement', 'Resource allocation'])
      })]),
      cpo: stryMutAct_9fa48("69367") ? [] : (stryCov_9fa48("69367"), [stryMutAct_9fa48("69368") ? {} : (stryCov_9fa48("69368"), {
        id: 'product-strategy',
        name: 'Product Strategy',
        description: 'Product roadmap planning',
        accuracy: 89,
        usageCount: 0,
        examples: stryMutAct_9fa48("69372") ? [] : (stryCov_9fa48("69372"), ['Feature prioritization', 'Market fit'])
      })]),
      custom: stryMutAct_9fa48("69375") ? ["Stryker was here"] : (stryCov_9fa48("69375"), [])
    });
    return stryMutAct_9fa48("69378") ? capabilities[role] && [] : stryMutAct_9fa48("69377") ? false : stryMutAct_9fa48("69376") ? true : (stryCov_9fa48("69376", "69377", "69378"), capabilities[role] || (stryMutAct_9fa48("69379") ? ["Stryker was here"] : (stryCov_9fa48("69379"), [])));
  }

  // ---------------------------------------------------------------------------
  // TRAINING SIMULATION
  // ---------------------------------------------------------------------------

  startTraining(personaId: string, onProgress?: (progress: number, status: TrainingStatus) => void): void {
    const persona = this.personas.get(personaId);
    if (stryMutAct_9fa48("69383") ? false : stryMutAct_9fa48("69382") ? true : stryMutAct_9fa48("69381") ? persona : (stryCov_9fa48("69381", "69382", "69383"), !persona)) {
      return;
    }

    // Clear any existing interval
    this.stopTraining(personaId);
    let progress = persona.trainingProgress;
    const targetProgress = 100;
    const interval = window.setInterval(() => {
      progress = stryMutAct_9fa48("69386") ? Math.max(progress + Math.random() * 3, targetProgress) : (stryCov_9fa48("69386"), Math.min(stryMutAct_9fa48("69387") ? progress - Math.random() * 3 : (stryCov_9fa48("69387"), progress + (stryMutAct_9fa48("69388") ? Math.random() / 3 : (stryCov_9fa48("69388"), Math.random() * 3))), targetProgress));
      let status: TrainingStatus = 'training';
      if (stryMutAct_9fa48("69393") ? progress < 95 : stryMutAct_9fa48("69392") ? progress > 95 : stryMutAct_9fa48("69391") ? false : stryMutAct_9fa48("69390") ? true : (stryCov_9fa48("69390", "69391", "69392", "69393"), progress >= 95)) {
        status = 'validating';
      }
      if (stryMutAct_9fa48("69399") ? progress < 100 : stryMutAct_9fa48("69398") ? progress > 100 : stryMutAct_9fa48("69397") ? false : stryMutAct_9fa48("69396") ? true : (stryCov_9fa48("69396", "69397", "69398", "69399"), progress >= 100)) {
        status = 'ready';
      }
      this.updatePersona(personaId, stryMutAct_9fa48("69402") ? {} : (stryCov_9fa48("69402"), {
        trainingProgress: Math.round(progress),
        status
      }));
      stryMutAct_9fa48("69403") ? onProgress(Math.round(progress), status) : (stryCov_9fa48("69403"), onProgress?.(Math.round(progress), status));
      if (stryMutAct_9fa48("69407") ? progress < 100 : stryMutAct_9fa48("69406") ? progress > 100 : stryMutAct_9fa48("69405") ? false : stryMutAct_9fa48("69404") ? true : (stryCov_9fa48("69404", "69405", "69406", "69407"), progress >= 100)) {
        this.stopTraining(personaId);
      }
    }, 2000);
    this.trainingIntervals.set(personaId, interval);
    this.updatePersona(personaId, stryMutAct_9fa48("69409") ? {} : (stryCov_9fa48("69409"), {
      status: 'collecting'
    }));
  }
  stopTraining(personaId: string): void {
    const interval = this.trainingIntervals.get(personaId);
    if (stryMutAct_9fa48("69413") ? false : stryMutAct_9fa48("69412") ? true : (stryCov_9fa48("69412", "69413"), interval)) {
      window.clearInterval(interval);
      this.trainingIntervals.delete(personaId);
    }
  }

  // ---------------------------------------------------------------------------
  // CHAT WITH PERSONA (Real Ollama Integration)
  // ---------------------------------------------------------------------------

  async chat(personaId: string, message: string, onToken?: (token: string) => void): Promise<{
    response: string;
    latencyMs: number;
  }> {
    const persona = this.personas.get(personaId);
    if (stryMutAct_9fa48("69418") ? false : stryMutAct_9fa48("69417") ? true : stryMutAct_9fa48("69416") ? persona : (stryCov_9fa48("69416", "69417", "69418"), !persona)) {
      throw new Error(`Persona not found: ${personaId}`);
    }
    if (stryMutAct_9fa48("69423") ? persona.status === 'ready' : stryMutAct_9fa48("69422") ? false : stryMutAct_9fa48("69421") ? true : (stryCov_9fa48("69421", "69422", "69423"), persona.status !== 'ready')) {
      throw new Error(`Persona ${persona.name} is not ready. Current status: ${persona.status}`);
    }
    const startTime = Date.now();

    // Get or create chat history
    const history = stryMutAct_9fa48("69429") ? this.chatHistories.get(personaId) && [] : stryMutAct_9fa48("69428") ? false : stryMutAct_9fa48("69427") ? true : (stryCov_9fa48("69427", "69428", "69429"), this.chatHistories.get(personaId) || (stryMutAct_9fa48("69430") ? ["Stryker was here"] : (stryCov_9fa48("69430"), [])));

    // Build messages for Ollama
    const messages: OllamaChatMessage[] = stryMutAct_9fa48("69431") ? [] : (stryCov_9fa48("69431"), [stryMutAct_9fa48("69432") ? {} : (stryCov_9fa48("69432"), {
      role: 'system',
      content: persona.systemPrompt
    })]);

    // Add recent history (last 10 messages for context)
    const recentHistory = stryMutAct_9fa48("69434") ? history : (stryCov_9fa48("69434"), history.slice(stryMutAct_9fa48("69435") ? +10 : (stryCov_9fa48("69435"), -10)));
    for (const msg of recentHistory) {
      messages.push(stryMutAct_9fa48("69437") ? {} : (stryCov_9fa48("69437"), {
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
    }
    messages.push(stryMutAct_9fa48("69438") ? {} : (stryCov_9fa48("69438"), {
      role: 'user',
      content: message
    }));
    try {
      // Check Ollama availability
      const status = ollamaService.getStatus();
      if (stryMutAct_9fa48("69443") ? false : stryMutAct_9fa48("69442") ? true : stryMutAct_9fa48("69441") ? status.available : (stryCov_9fa48("69441", "69442", "69443"), !status.available)) {
        throw new Error('Ollama is not available. Please ensure Ollama is running.');
      }

      // Use streaming if callback provided
      if (stryMutAct_9fa48("69447") ? false : stryMutAct_9fa48("69446") ? true : (stryCov_9fa48("69446", "69447"), onToken)) {
        let fullResponse = '';
        const stream = ollamaService.streamChat(this.mapRoleToAgentId(persona.role), message, recentHistory.map(stryMutAct_9fa48("69450") ? () => undefined : (stryCov_9fa48("69450"), m => `${m.role}: ${m.content}`)).join('\n'));
        for await (const chunk of stream) {
          if (stryMutAct_9fa48("69456") ? chunk.type !== 'token' : stryMutAct_9fa48("69455") ? false : stryMutAct_9fa48("69454") ? true : (stryCov_9fa48("69454", "69455", "69456"), chunk.type === 'token')) {
            stryMutAct_9fa48("69459") ? fullResponse -= chunk.content : (stryCov_9fa48("69459"), fullResponse += chunk.content);
            onToken(chunk.content);
          }
        }
        const latencyMs = stryMutAct_9fa48("69460") ? Date.now() + startTime : (stryCov_9fa48("69460"), Date.now() - startTime);

        // Update history
        this.updateChatHistory(personaId, message, fullResponse);
        this.recordInteraction(personaId, message, fullResponse, latencyMs);
        return stryMutAct_9fa48("69461") ? {} : (stryCov_9fa48("69461"), {
          response: fullResponse,
          latencyMs
        });
      } else {
        // Non-streaming request
        const result = await ollamaService.chat(stryMutAct_9fa48("69463") ? {} : (stryCov_9fa48("69463"), {
          model: persona.baseModel,
          messages,
          stream: stryMutAct_9fa48("69464") ? true : (stryCov_9fa48("69464"), false),
          options: stryMutAct_9fa48("69465") ? {} : (stryCov_9fa48("69465"), {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2048
          })
        }));
        const latencyMs = stryMutAct_9fa48("69466") ? Date.now() + startTime : (stryCov_9fa48("69466"), Date.now() - startTime);
        const response = result.message.content;

        // Update history
        this.updateChatHistory(personaId, message, response);
        this.recordInteraction(personaId, message, response, latencyMs);
        return stryMutAct_9fa48("69467") ? {} : (stryCov_9fa48("69467"), {
          response,
          latencyMs
        });
      }
    } catch (error) {
      console.error('[PersonaForge] Chat error:', error);

      // Fallback to intelligent local response
      const fallbackResponse = this.generateFallbackResponse(persona, message);
      const latencyMs = stryMutAct_9fa48("69470") ? Date.now() + startTime : (stryCov_9fa48("69470"), Date.now() - startTime);
      this.updateChatHistory(personaId, message, fallbackResponse);
      this.recordInteraction(personaId, message, fallbackResponse, latencyMs);
      return stryMutAct_9fa48("69471") ? {} : (stryCov_9fa48("69471"), {
        response: fallbackResponse,
        latencyMs
      });
    }
  }
  private mapRoleToAgentId(role: PersonaRole): string {
    const mapping: Record<PersonaRole, string> = stryMutAct_9fa48("69473") ? {} : (stryCov_9fa48("69473"), {
      cfo: 'agent-cfo',
      cio: 'agent-cto',
      // CIO maps to CTO agent
      clo: 'agent-clo',
      chro: 'agent-cco',
      // CHRO maps to CCO for HR comms
      ciso: 'agent-ciso',
      cso: 'agent-chief',
      cro: 'agent-cro',
      coo: 'agent-coo',
      cpo: 'agent-cpo',
      custom: 'agent-chief'
    });
    return stryMutAct_9fa48("69486") ? mapping[role] && 'agent-chief' : stryMutAct_9fa48("69485") ? false : stryMutAct_9fa48("69484") ? true : (stryCov_9fa48("69484", "69485", "69486"), mapping[role] || 'agent-chief');
  }
  private updateChatHistory(personaId: string, userMessage: string, assistantMessage: string): void {
    const history = stryMutAct_9fa48("69491") ? this.chatHistories.get(personaId) && [] : stryMutAct_9fa48("69490") ? false : stryMutAct_9fa48("69489") ? true : (stryCov_9fa48("69489", "69490", "69491"), this.chatHistories.get(personaId) || (stryMutAct_9fa48("69492") ? ["Stryker was here"] : (stryCov_9fa48("69492"), [])));
    history.push(stryMutAct_9fa48("69493") ? {} : (stryCov_9fa48("69493"), {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }));
    history.push(stryMutAct_9fa48("69496") ? {} : (stryCov_9fa48("69496"), {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date()
    }));

    // Keep last 50 messages
    this.chatHistories.set(personaId, stryMutAct_9fa48("69499") ? history : (stryCov_9fa48("69499"), history.slice(stryMutAct_9fa48("69500") ? +50 : (stryCov_9fa48("69500"), -50))));
  }
  getChatHistory(personaId: string): ChatMessage[] {
    return stryMutAct_9fa48("69504") ? this.chatHistories.get(personaId) && [] : stryMutAct_9fa48("69503") ? false : stryMutAct_9fa48("69502") ? true : (stryCov_9fa48("69502", "69503", "69504"), this.chatHistories.get(personaId) || (stryMutAct_9fa48("69505") ? ["Stryker was here"] : (stryCov_9fa48("69505"), [])));
  }
  clearChatHistory(personaId: string): void {
    this.chatHistories.delete(personaId);
  }
  private recordInteraction(personaId: string, query: string, response: string, latencyMs: number): void {
    const persona = this.personas.get(personaId);
    if (stryMutAct_9fa48("69510") ? false : stryMutAct_9fa48("69509") ? true : stryMutAct_9fa48("69508") ? persona : (stryCov_9fa48("69508", "69509", "69510"), !persona)) {
      return;
    }

    // Update persona stats
    this.updatePersona(personaId, stryMutAct_9fa48("69512") ? {} : (stryCov_9fa48("69512"), {
      totalInteractions: stryMutAct_9fa48("69513") ? persona.totalInteractions - 1 : (stryCov_9fa48("69513"), persona.totalInteractions + 1),
      lastActive: new Date()
    }));

    // Store interaction
    const interactions = stryMutAct_9fa48("69516") ? this.interactions.get(personaId) && [] : stryMutAct_9fa48("69515") ? false : stryMutAct_9fa48("69514") ? true : (stryCov_9fa48("69514", "69515", "69516"), this.interactions.get(personaId) || (stryMutAct_9fa48("69517") ? ["Stryker was here"] : (stryCov_9fa48("69517"), [])));
    interactions.push(stryMutAct_9fa48("69518") ? {} : (stryCov_9fa48("69518"), {
      id: `int-${Date.now()}`,
      personaId,
      query,
      response,
      timestamp: new Date(),
      userId: 'current-user',
      department: 'Unknown',
      tokensUsed: Math.ceil(stryMutAct_9fa48("69522") ? response.length * 4 : (stryCov_9fa48("69522"), response.length / 4)),
      latencyMs
    }));

    // Keep last 100 interactions per persona
    this.interactions.set(personaId, stryMutAct_9fa48("69523") ? interactions : (stryCov_9fa48("69523"), interactions.slice(stryMutAct_9fa48("69524") ? +100 : (stryCov_9fa48("69524"), -100))));
  }
  private generateFallbackResponse(persona: DigitalPersona, message: string): string {
    const role = persona.role;
    const query = stryMutAct_9fa48("69526") ? message.toUpperCase() : (stryCov_9fa48("69526"), message.toLowerCase());

    // Intelligent fallback responses based on role and query
    const responses: Record<PersonaRole, Record<string, string>> = stryMutAct_9fa48("69527") ? {} : (stryCov_9fa48("69527"), {
      cfo: stryMutAct_9fa48("69528") ? {} : (stryCov_9fa48("69528"), {
        budget: 'Based on financial analysis patterns, I recommend reviewing the current budget allocation against historical performance. Key considerations include operating expense ratios, revenue forecasts, and capital expenditure requirements. Would you like me to elaborate on any specific area?',
        risk: 'From a financial risk perspective, I analyze exposure across market, credit, liquidity, and operational dimensions. Current best practices suggest maintaining diversified reserves and conducting regular stress testing.',
        default: 'As your Digital CFO, I can assist with financial analysis, budgeting, forecasting, risk assessment, and strategic financial planning. What specific financial matter would you like to discuss?'
      }),
      cio: stryMutAct_9fa48("69532") ? {} : (stryCov_9fa48("69532"), {
        security: 'Technology security should follow defense-in-depth principles. I recommend evaluating your current architecture against zero-trust frameworks and ensuring comprehensive monitoring and incident response capabilities.',
        cloud: 'Cloud strategy should balance innovation velocity with governance requirements. Key considerations include workload assessment, data residency, cost optimization, and vendor lock-in mitigation.',
        default: 'As your Digital CIO, I provide guidance on technology strategy, digital transformation, infrastructure decisions, and IT governance. What technology challenge can I help you address?'
      }),
      clo: stryMutAct_9fa48("69536") ? {} : (stryCov_9fa48("69536"), {
        contract: 'Contract review should focus on key risk areas: liability limitations, indemnification clauses, IP rights, termination provisions, and regulatory compliance. I recommend a systematic clause-by-clause analysis.',
        compliance: 'Compliance requires a comprehensive framework covering relevant regulations (GDPR, SOX, HIPAA as applicable), regular audits, training programs, and documentation protocols.',
        default: 'As your Digital CLO, I provide legal guidance on contracts, compliance, risk management, and corporate governance. What legal matter requires attention?'
      }),
      chro: stryMutAct_9fa48("69540") ? {} : (stryCov_9fa48("69540"), {
        talent: 'Talent management requires a holistic approach covering acquisition, development, retention, and succession planning. Key metrics include turnover rates, engagement scores, and time-to-fill.',
        default: 'As your Digital CHRO, I advise on talent strategy, organizational development, compensation, and HR compliance. How can I assist with your people matters?'
      }),
      ciso: stryMutAct_9fa48("69543") ? {} : (stryCov_9fa48("69543"), {
        threat: 'Threat assessment should evaluate attack vectors, threat actors, and vulnerability landscape. I recommend continuous monitoring, threat intelligence integration, and regular penetration testing.',
        default: 'As your Digital CISO, I provide guidance on cybersecurity strategy, risk management, incident response, and compliance. What security concern should we address?'
      }),
      cso: stryMutAct_9fa48("69546") ? {} : (stryCov_9fa48("69546"), {
        default: 'As your Digital CSO, I provide strategic analysis, market intelligence, and long-term planning guidance. What strategic question can I help explore?'
      }),
      cro: stryMutAct_9fa48("69548") ? {} : (stryCov_9fa48("69548"), {
        default: 'As your Digital CRO, I focus on revenue growth, sales strategy, and go-to-market optimization. What revenue challenge should we discuss?'
      }),
      coo: stryMutAct_9fa48("69550") ? {} : (stryCov_9fa48("69550"), {
        default: 'As your Digital COO, I advise on operations, efficiency, process optimization, and execution. What operational matter needs attention?'
      }),
      cpo: stryMutAct_9fa48("69552") ? {} : (stryCov_9fa48("69552"), {
        default: 'As your Digital CPO, I provide product strategy, roadmap planning, and market positioning guidance. What product decision can I assist with?'
      }),
      custom: stryMutAct_9fa48("69554") ? {} : (stryCov_9fa48("69554"), {
        default: 'I\'m ready to assist based on my training. Please provide more details about what you\'d like to discuss.'
      })
    });
    const roleResponses = stryMutAct_9fa48("69558") ? responses[role] && responses.custom : stryMutAct_9fa48("69557") ? false : stryMutAct_9fa48("69556") ? true : (stryCov_9fa48("69556", "69557", "69558"), responses[role] || responses.custom);

    // Match query to specific response
    for (const [key, response] of Object.entries(roleResponses)) {
      if (stryMutAct_9fa48("69562") ? key !== 'default' || query.includes(key) : stryMutAct_9fa48("69561") ? false : stryMutAct_9fa48("69560") ? true : (stryCov_9fa48("69560", "69561", "69562"), (stryMutAct_9fa48("69564") ? key === 'default' : stryMutAct_9fa48("69563") ? true : (stryCov_9fa48("69563", "69564"), key !== 'default')) && query.includes(key))) {
        return response;
      }
    }
    return stryMutAct_9fa48("69569") ? roleResponses.default && 'I\'m here to help. Could you provide more details about your question?' : stryMutAct_9fa48("69568") ? false : stryMutAct_9fa48("69567") ? true : (stryCov_9fa48("69567", "69568", "69569"), roleResponses.default || 'I\'m here to help. Could you provide more details about your question?');
  }

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------

  getStats(): {
    totalPersonas: number;
    readyPersonas: number;
    trainingPersonas: number;
    totalInteractions: number;
  } {
    const personas = Array.from(this.personas.values());
    return stryMutAct_9fa48("69572") ? {} : (stryCov_9fa48("69572"), {
      totalPersonas: personas.length,
      readyPersonas: stryMutAct_9fa48("69573") ? personas.length : (stryCov_9fa48("69573"), personas.filter(stryMutAct_9fa48("69574") ? () => undefined : (stryCov_9fa48("69574"), p => stryMutAct_9fa48("69577") ? p.status !== 'ready' : stryMutAct_9fa48("69576") ? false : stryMutAct_9fa48("69575") ? true : (stryCov_9fa48("69575", "69576", "69577"), p.status === 'ready'))).length),
      trainingPersonas: stryMutAct_9fa48("69579") ? personas.length : (stryCov_9fa48("69579"), personas.filter(stryMutAct_9fa48("69580") ? () => undefined : (stryCov_9fa48("69580"), p => stryMutAct_9fa48("69583") ? p.status !== 'ready' || p.status !== 'not_started' : stryMutAct_9fa48("69582") ? false : stryMutAct_9fa48("69581") ? true : (stryCov_9fa48("69581", "69582", "69583"), (stryMutAct_9fa48("69585") ? p.status === 'ready' : stryMutAct_9fa48("69584") ? true : (stryCov_9fa48("69584", "69585"), p.status !== 'ready')) && (stryMutAct_9fa48("69588") ? p.status === 'not_started' : stryMutAct_9fa48("69587") ? true : (stryCov_9fa48("69587", "69588"), p.status !== 'not_started'))))).length),
      totalInteractions: personas.reduce(stryMutAct_9fa48("69590") ? () => undefined : (stryCov_9fa48("69590"), (sum, p) => stryMutAct_9fa48("69591") ? sum - p.totalInteractions : (stryCov_9fa48("69591"), sum + p.totalInteractions)), 0)
    });
  }
}

// Singleton instance
export const personaForgeService = new PersonaForgeService();
export default personaForgeService;