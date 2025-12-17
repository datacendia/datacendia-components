// @ts-nocheck
// =============================================================================
// DECISION INTELLIGENCE SERVICE
// Real Ollama-powered decision support with persistent storage
// Enterprise Platinum Standard - No mock data
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
import { ollamaService } from '../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

export interface Decision {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'analyzing' | 'deliberating' | 'decided' | 'implemented' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  budget?: number;
  timeframe?: string;
  createdAt: Date;
  updatedAt: Date;
  timeline: DecisionEvent[];
  preMortems: PreMortemResult[];
  councilSessions: CouncilSession[];
  ghostBoardSimulations: GhostBoardResult[];
  finalDecision?: string;
  decisionMadeAt?: Date;
  outcome?: DecisionOutcome;
  auditHash?: string;
  riskScore?: number;
}
export interface DecisionEvent {
  id: string;
  timestamp: Date;
  type: 'created' | 'context_added' | 'premortem_run' | 'council_session' | 'ghost_board' | 'decision_made' | 'outcome_recorded' | 'reopened';
  title: string;
  summary: string;
  data: Record<string, any>;
  userId: string;
  agentsInvolved?: string[];
}
export interface DecisionOutcome {
  actualResult: string;
  notes: string;
  lessonsLearned: string[];
  recordedAt: Date;
}

// Pre-Mortem Types
export interface FailureMode {
  rank: number;
  title: string;
  probability: number;
  costImpact: number;
  category: string;
  mitigations: {
    action: string;
    cost?: number;
    effectiveness?: number;
  }[];
}
export interface PreMortemResult {
  id: string;
  decisionId?: string;
  decision: string;
  context?: string;
  analyzedAt: Date;
  failureModes: FailureMode[];
  totalRiskWeightedExposure: number;
  overallRiskScore: number;
  recommendation: {
    action: 'proceed' | 'proceed_with_caution' | 'delay' | 'abort';
    reasoning: string;
    conditions: string[];
  };
  executiveSummary: string;
  agentsUsed: string[];
}

// Ghost Board Types
export interface BoardMember {
  id: string;
  name: string;
  role: string;
  icon: string;
  personality: string;
}
export interface BoardQuestion {
  id: string;
  question: string;
  askedBy: BoardMember;
  category: string;
  difficulty: string;
  suggestedAnswer: string;
  answerStrength?: 'weak' | 'adequate' | 'strong';
}
export interface GhostBoardResult {
  id: string;
  decisionId?: string;
  proposalTitle: string;
  proposalContent: string;
  boardType: string;
  difficulty: string;
  duration: number;
  boardMembers: BoardMember[];
  questions: BoardQuestion[];
  preparednessScore: number;
  keyGaps: string[];
  strengthAreas: string[];
  overallAssessment: string;
  runAt: Date;
}

// Council Session Types
export interface CouncilSession {
  id: string;
  decisionId?: string;
  query: string;
  mode: string;
  agents: string[];
  responses: {
    agentId: string;
    agentName: string;
    response: string;
    duration: number;
  }[];
  synthesis: string;
  confidence: number;
  totalDuration: number;
  runAt: Date;
}

// Decision Debt Types
export interface PendingDecision {
  id: string;
  title: string;
  department: string;
  owner: string;
  daysStuck: number;
  estimatedDailyCost: number;
  totalCostAccrued: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: string;
  blockedBy: {
    name: string;
    type: string;
  }[];
  createdAt: Date;
}
export interface DecisionDebtDashboard {
  summary: {
    totalPendingDecisions: number;
    totalBlockedDecisions: number;
    averageDaysStuck: number;
    dailyCost: number;
    monthlyCost: number;
    annualProjectedLoss: number;
    debtScore: {
      grade: string;
      score: number;
      label: string;
      color: string;
    };
  };
  decisions: PendingDecision[];
  topBlockers: {
    blockerName: string;
    decisionsBlocked: number;
    totalCostImpact: number;
  }[];
  criticalPath: string[];
  recommendations: {
    title: string;
    description: string;
    estimatedSavings: number;
  }[];
}

// Chronos Types
export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'decision' | 'metric' | 'personnel' | 'financial' | 'system' | 'milestone';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  department?: string;
  actors?: string[];
}
export interface StateSnapshot {
  timestamp: Date;
  metrics: {
    revenue: number;
    profit: number;
    employees: number;
    customers: number;
    satisfaction: number;
    marketShare: number;
  };
}

// =============================================================================
// BOARD MEMBER DEFINITIONS
// =============================================================================

const BOARD_MEMBERS: Record<string, BoardMember[]> = stryMutAct_9fa48("66750") ? {} : (stryCov_9fa48("66750"), {
  standard: stryMutAct_9fa48("66751") ? [] : (stryCov_9fa48("66751"), [stryMutAct_9fa48("66752") ? {} : (stryCov_9fa48("66752"), {
    id: 'chair',
    name: 'Victoria Sterling',
    role: 'Board Chair',
    icon: '👔',
    personality: 'Strategic, long-term focused'
  }), stryMutAct_9fa48("66758") ? {} : (stryCov_9fa48("66758"), {
    id: 'investor1',
    name: 'James Chen',
    role: 'Lead Investor',
    icon: '💼',
    personality: 'Returns-focused, analytical'
  }), stryMutAct_9fa48("66764") ? {} : (stryCov_9fa48("66764"), {
    id: 'independent1',
    name: 'Sarah Mitchell',
    role: 'Independent Director',
    icon: '🎓',
    personality: 'Governance-focused, objective'
  }), stryMutAct_9fa48("66770") ? {} : (stryCov_9fa48("66770"), {
    id: 'industry',
    name: 'Michael Torres',
    role: 'Industry Expert',
    icon: '🏭',
    personality: 'Market-savvy, practical'
  })]),
  vc_backed: stryMutAct_9fa48("66776") ? [] : (stryCov_9fa48("66776"), [stryMutAct_9fa48("66777") ? {} : (stryCov_9fa48("66777"), {
    id: 'partner',
    name: 'Alexandra Reeves',
    role: 'Managing Partner',
    icon: '🚀',
    personality: 'Growth-obsessed, aggressive'
  }), stryMutAct_9fa48("66783") ? {} : (stryCov_9fa48("66783"), {
    id: 'associate',
    name: 'Kevin Park',
    role: 'Partner',
    icon: '📊',
    personality: 'Metrics-driven, analytical'
  }), stryMutAct_9fa48("66789") ? {} : (stryCov_9fa48("66789"), {
    id: 'founder',
    name: 'Rachel Green',
    role: 'Operating Partner',
    icon: '💡',
    personality: 'Execution-focused, hands-on'
  })]),
  public_company: stryMutAct_9fa48("66795") ? [] : (stryCov_9fa48("66795"), [stryMutAct_9fa48("66796") ? {} : (stryCov_9fa48("66796"), {
    id: 'chair',
    name: 'Robert Harrison',
    role: 'Board Chair',
    icon: '⚖️',
    personality: 'Governance-focused, conservative'
  }), stryMutAct_9fa48("66802") ? {} : (stryCov_9fa48("66802"), {
    id: 'audit',
    name: 'Patricia Wells',
    role: 'Audit Committee Chair',
    icon: '📋',
    personality: 'Compliance-focused, detail-oriented'
  }), stryMutAct_9fa48("66808") ? {} : (stryCov_9fa48("66808"), {
    id: 'comp',
    name: 'William Chang',
    role: 'Compensation Chair',
    icon: '💰',
    personality: 'Shareholder-focused, balanced'
  }), stryMutAct_9fa48("66814") ? {} : (stryCov_9fa48("66814"), {
    id: 'nom',
    name: 'Elizabeth Foster',
    role: 'Nominating Chair',
    icon: '👥',
    personality: 'Culture-focused, strategic'
  })]),
  private_equity: stryMutAct_9fa48("66820") ? [] : (stryCov_9fa48("66820"), [stryMutAct_9fa48("66821") ? {} : (stryCov_9fa48("66821"), {
    id: 'deal',
    name: 'Marcus Webb',
    role: 'Deal Partner',
    icon: '📈',
    personality: 'EBITDA-obsessed, aggressive'
  }), stryMutAct_9fa48("66827") ? {} : (stryCov_9fa48("66827"), {
    id: 'ops',
    name: 'Diana Rodriguez',
    role: 'Operating Partner',
    icon: '⚙️',
    personality: 'Efficiency-focused, demanding'
  }), stryMutAct_9fa48("66833") ? {} : (stryCov_9fa48("66833"), {
    id: 'cfo',
    name: 'Thomas Barrett',
    role: 'Portfolio CFO',
    icon: '💹',
    personality: 'Cash-focused, analytical'
  })])
});

// =============================================================================
// SERVICE CLASS
// =============================================================================

class DecisionIntelligenceService {
  private decisions: Map<string, Decision> = new Map();
  private preMortems: Map<string, PreMortemResult> = new Map();
  private ghostBoards: Map<string, GhostBoardResult> = new Map();
  private pendingDecisions: Map<string, PendingDecision> = new Map();
  private timeline: TimelineEvent[] = stryMutAct_9fa48("66839") ? ["Stryker was here"] : (stryCov_9fa48("66839"), []);
  private storageKey = 'datacendia_decisions';
  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  // ---------------------------------------------------------------------------
  // STORAGE
  // ---------------------------------------------------------------------------

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stryMutAct_9fa48("66845") ? false : stryMutAct_9fa48("66844") ? true : (stryCov_9fa48("66844", "66845"), stored)) {
        const data = JSON.parse(stored);
        stryMutAct_9fa48("66847") ? data.decisions.forEach((d: Decision) => {
          d.createdAt = new Date(d.createdAt);
          d.updatedAt = new Date(d.updatedAt);
          d.timeline = d.timeline?.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp)
          })) || [];
          this.decisions.set(d.id, d);
        }) : (stryCov_9fa48("66847"), data.decisions?.forEach((d: Decision) => {
          d.createdAt = new Date(d.createdAt);
          d.updatedAt = new Date(d.updatedAt);
          d.timeline = stryMutAct_9fa48("66851") ? d.timeline?.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp)
          })) && [] : stryMutAct_9fa48("66850") ? false : stryMutAct_9fa48("66849") ? true : (stryCov_9fa48("66849", "66850", "66851"), (stryMutAct_9fa48("66852") ? d.timeline.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp)
          })) : (stryCov_9fa48("66852"), d.timeline?.map(stryMutAct_9fa48("66853") ? () => undefined : (stryCov_9fa48("66853"), (e: any) => stryMutAct_9fa48("66854") ? {} : (stryCov_9fa48("66854"), {
            ...e,
            timestamp: new Date(e.timestamp)
          }))))) || (stryMutAct_9fa48("66855") ? ["Stryker was here"] : (stryCov_9fa48("66855"), [])));
          this.decisions.set(d.id, d);
        }));
        stryMutAct_9fa48("66856") ? data.preMortems.forEach((p: PreMortemResult) => {
          p.analyzedAt = new Date(p.analyzedAt);
          this.preMortems.set(p.id, p);
        }) : (stryCov_9fa48("66856"), data.preMortems?.forEach((p: PreMortemResult) => {
          p.analyzedAt = new Date(p.analyzedAt);
          this.preMortems.set(p.id, p);
        }));
        stryMutAct_9fa48("66858") ? data.ghostBoards.forEach((g: GhostBoardResult) => {
          g.runAt = new Date(g.runAt);
          this.ghostBoards.set(g.id, g);
        }) : (stryCov_9fa48("66858"), data.ghostBoards?.forEach((g: GhostBoardResult) => {
          g.runAt = new Date(g.runAt);
          this.ghostBoards.set(g.id, g);
        }));
        stryMutAct_9fa48("66860") ? data.pendingDecisions.forEach((p: PendingDecision) => {
          p.createdAt = new Date(p.createdAt);
          this.pendingDecisions.set(p.id, p);
        }) : (stryCov_9fa48("66860"), data.pendingDecisions?.forEach((p: PendingDecision) => {
          p.createdAt = new Date(p.createdAt);
          this.pendingDecisions.set(p.id, p);
        }));
        console.log('[DecisionIntelligence] Loaded', this.decisions.size, 'decisions from storage');
      }
    } catch (error) {
      console.error('[DecisionIntelligence] Failed to load:', error);
    }
  }
  private saveToStorage(): void {
    try {
      const data = stryMutAct_9fa48("66868") ? {} : (stryCov_9fa48("66868"), {
        decisions: Array.from(this.decisions.values()),
        preMortems: Array.from(this.preMortems.values()),
        ghostBoards: Array.from(this.ghostBoards.values()),
        pendingDecisions: Array.from(this.pendingDecisions.values())
      });
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('[DecisionIntelligence] Failed to save:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------

  private initializeDefaultData(): void {
    if (stryMutAct_9fa48("66875") ? this.decisions.size <= 0 : stryMutAct_9fa48("66874") ? this.decisions.size >= 0 : stryMutAct_9fa48("66873") ? false : stryMutAct_9fa48("66872") ? true : (stryCov_9fa48("66872", "66873", "66874", "66875"), this.decisions.size > 0)) {
      return;
    }

    // Create sample decisions
    const sampleDecisions: Partial<Decision>[] = stryMutAct_9fa48("66877") ? [] : (stryCov_9fa48("66877"), [stryMutAct_9fa48("66878") ? {} : (stryCov_9fa48("66878"), {
      title: 'Cloud Infrastructure Migration',
      description: 'Migrate legacy on-premise systems to AWS cloud infrastructure',
      status: 'deliberating',
      priority: 'high',
      category: 'Technology',
      budget: 2500000,
      timeframe: '12 months'
    }), stryMutAct_9fa48("66885") ? {} : (stryCov_9fa48("66885"), {
      title: 'Q4 Marketing Budget Increase',
      description: 'Increase Q4 marketing spend by 25% to capture holiday season',
      status: 'decided',
      priority: 'medium',
      category: 'Marketing',
      budget: 500000,
      timeframe: '3 months',
      finalDecision: 'Approved with 15% increase instead of 25%'
    }), stryMutAct_9fa48("66893") ? {} : (stryCov_9fa48("66893"), {
      title: 'AI Integration Strategy',
      description: 'Develop strategy for integrating AI across all business units',
      status: 'analyzing',
      priority: 'critical',
      category: 'Strategy',
      budget: 5000000,
      timeframe: '24 months'
    })]);
    sampleDecisions.forEach(stryMutAct_9fa48("66900") ? () => undefined : (stryCov_9fa48("66900"), d => this.createDecision(d)));

    // Create sample pending decisions for debt tracking
    const samplePending: Partial<PendingDecision>[] = stryMutAct_9fa48("66901") ? [] : (stryCov_9fa48("66901"), [stryMutAct_9fa48("66902") ? {} : (stryCov_9fa48("66902"), {
      title: 'Vendor Contract Renewal',
      department: 'Procurement',
      owner: 'Sarah Johnson',
      daysStuck: 23,
      estimatedDailyCost: 1500,
      priority: 'high',
      blockedBy: stryMutAct_9fa48("66907") ? [] : (stryCov_9fa48("66907"), [stryMutAct_9fa48("66908") ? {} : (stryCov_9fa48("66908"), {
        name: 'Legal Review',
        type: 'department'
      })])
    }), stryMutAct_9fa48("66911") ? {} : (stryCov_9fa48("66911"), {
      title: 'Product Roadmap Q1',
      department: 'Product',
      owner: 'Mike Chen',
      daysStuck: 15,
      estimatedDailyCost: 3200,
      priority: 'critical',
      blockedBy: stryMutAct_9fa48("66916") ? [] : (stryCov_9fa48("66916"), [stryMutAct_9fa48("66917") ? {} : (stryCov_9fa48("66917"), {
        name: 'Budget Approval',
        type: 'process'
      })])
    }), stryMutAct_9fa48("66920") ? {} : (stryCov_9fa48("66920"), {
      title: 'Engineering Hiring Plan',
      department: 'HR',
      owner: 'Lisa Park',
      daysStuck: 31,
      estimatedDailyCost: 2800,
      priority: 'high',
      blockedBy: stryMutAct_9fa48("66925") ? [] : (stryCov_9fa48("66925"), [stryMutAct_9fa48("66926") ? {} : (stryCov_9fa48("66926"), {
        name: 'CFO Approval',
        type: 'person'
      })])
    })]);
    samplePending.forEach(stryMutAct_9fa48("66929") ? () => undefined : (stryCov_9fa48("66929"), p => this.createPendingDecision(p)));
  }

  // ---------------------------------------------------------------------------
  // DECISION MANAGEMENT
  // ---------------------------------------------------------------------------

  getDecisions(): Decision[] {
    return stryMutAct_9fa48("66931") ? Array.from(this.decisions.values()) : (stryCov_9fa48("66931"), Array.from(this.decisions.values()).sort(stryMutAct_9fa48("66932") ? () => undefined : (stryCov_9fa48("66932"), (a, b) => stryMutAct_9fa48("66933") ? b.updatedAt.getTime() + a.updatedAt.getTime() : (stryCov_9fa48("66933"), b.updatedAt.getTime() - a.updatedAt.getTime()))));
  }
  getDecision(id: string): Decision | undefined {
    return this.decisions.get(id);
  }
  createDecision(partial: Partial<Decision>): Decision {
    const id = stryMutAct_9fa48("66938") ? partial.id && `decision-${Date.now()}` : stryMutAct_9fa48("66937") ? false : stryMutAct_9fa48("66936") ? true : (stryCov_9fa48("66936", "66937", "66938"), partial.id || `decision-${Date.now()}`);
    const now = new Date();
    const decision: Decision = stryMutAct_9fa48("66940") ? {} : (stryCov_9fa48("66940"), {
      id,
      title: stryMutAct_9fa48("66943") ? partial.title && 'New Decision' : stryMutAct_9fa48("66942") ? false : stryMutAct_9fa48("66941") ? true : (stryCov_9fa48("66941", "66942", "66943"), partial.title || 'New Decision'),
      description: stryMutAct_9fa48("66947") ? partial.description && '' : stryMutAct_9fa48("66946") ? false : stryMutAct_9fa48("66945") ? true : (stryCov_9fa48("66945", "66946", "66947"), partial.description || ''),
      status: stryMutAct_9fa48("66951") ? partial.status && 'draft' : stryMutAct_9fa48("66950") ? false : stryMutAct_9fa48("66949") ? true : (stryCov_9fa48("66949", "66950", "66951"), partial.status || 'draft'),
      priority: stryMutAct_9fa48("66955") ? partial.priority && 'medium' : stryMutAct_9fa48("66954") ? false : stryMutAct_9fa48("66953") ? true : (stryCov_9fa48("66953", "66954", "66955"), partial.priority || 'medium'),
      category: stryMutAct_9fa48("66959") ? partial.category && 'General' : stryMutAct_9fa48("66958") ? false : stryMutAct_9fa48("66957") ? true : (stryCov_9fa48("66957", "66958", "66959"), partial.category || 'General'),
      budget: partial.budget,
      timeframe: partial.timeframe,
      createdAt: now,
      updatedAt: now,
      timeline: stryMutAct_9fa48("66961") ? [] : (stryCov_9fa48("66961"), [stryMutAct_9fa48("66962") ? {} : (stryCov_9fa48("66962"), {
        id: `event-${Date.now()}`,
        timestamp: now,
        type: 'created',
        title: 'Decision Created',
        summary: `Decision "${partial.title}" was created`,
        data: {},
        userId: 'system'
      })]),
      preMortems: stryMutAct_9fa48("66968") ? ["Stryker was here"] : (stryCov_9fa48("66968"), []),
      councilSessions: stryMutAct_9fa48("66969") ? ["Stryker was here"] : (stryCov_9fa48("66969"), []),
      ghostBoardSimulations: stryMutAct_9fa48("66970") ? ["Stryker was here"] : (stryCov_9fa48("66970"), []),
      finalDecision: partial.finalDecision,
      decisionMadeAt: partial.decisionMadeAt,
      outcome: partial.outcome,
      riskScore: partial.riskScore
    });
    this.decisions.set(id, decision);
    this.saveToStorage();
    return decision;
  }
  updateDecision(id: string, updates: Partial<Decision>): Decision | null {
    const decision = this.decisions.get(id);
    if (stryMutAct_9fa48("66974") ? false : stryMutAct_9fa48("66973") ? true : stryMutAct_9fa48("66972") ? decision : (stryCov_9fa48("66972", "66973", "66974"), !decision)) {
      return null;
    }
    const updated = stryMutAct_9fa48("66976") ? {} : (stryCov_9fa48("66976"), {
      ...decision,
      ...updates,
      updatedAt: new Date()
    });
    this.decisions.set(id, updated);
    this.saveToStorage();
    return updated;
  }
  addDecisionEvent(decisionId: string, event: Omit<DecisionEvent, 'id' | 'timestamp'>): void {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("66980") ? false : stryMutAct_9fa48("66979") ? true : stryMutAct_9fa48("66978") ? decision : (stryCov_9fa48("66978", "66979", "66980"), !decision)) {
      return;
    }
    decision.timeline.push(stryMutAct_9fa48("66982") ? {} : (stryCov_9fa48("66982"), {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date()
    }));
    decision.updatedAt = new Date();
    this.saveToStorage();
  }

  // ---------------------------------------------------------------------------
  // PRE-MORTEM ANALYSIS (Ollama-powered)
  // ---------------------------------------------------------------------------

  async runPreMortem(decisionText: string, context?: string, options?: {
    budget?: number;
    timeframe?: string;
    agents?: string[];
  }): Promise<PreMortemResult> {
    const status = ollamaService.getStatus();
    let failureModes: FailureMode[] = stryMutAct_9fa48("66985") ? ["Stryker was here"] : (stryCov_9fa48("66985"), []);
    let recommendation: PreMortemResult['recommendation'] | null = null;
    let executiveSummary: string = '';
    if (stryMutAct_9fa48("66988") ? false : stryMutAct_9fa48("66987") ? true : (stryCov_9fa48("66987", "66988"), status.available)) {
      // Use real Ollama for analysis
      try {
        const prompt = `You are a Pre-Mortem Analysis expert. Analyze the following decision for potential failure modes.

DECISION: ${decisionText}
${context ? `CONTEXT: ${context}` : ''}
${(stryMutAct_9fa48("66994") ? options.budget : (stryCov_9fa48("66994"), options?.budget)) ? `BUDGET: $${options.budget.toLocaleString()}` : ''}
${(stryMutAct_9fa48("66997") ? options.timeframe : (stryCov_9fa48("66997"), options?.timeframe)) ? `TIMEFRAME: ${options.timeframe}` : ''}

Provide analysis in JSON format:
{
  "failureModes": [
    {
      "rank": 1,
      "title": "Failure mode title",
      "probability": 0.0-1.0,
      "costImpact": dollar amount,
      "category": "Financial/Operational/Technical/Market/Regulatory",
      "mitigations": [{"action": "mitigation step", "effectiveness": 0.0-1.0}]
    }
  ],
  "overallRiskScore": 0-100,
  "recommendation": {
    "action": "proceed|proceed_with_caution|delay|abort",
    "reasoning": "explanation",
    "conditions": ["condition 1", "condition 2"]
  },
  "executiveSummary": "2-3 sentence summary"
}`;
        const response = await ollamaService.generate(stryMutAct_9fa48("67000") ? {} : (stryCov_9fa48("67000"), {
          model: 'llama3:8b',
          prompt,
          options: stryMutAct_9fa48("67002") ? {} : (stryCov_9fa48("67002"), {
            temperature: 0.3
          })
        }));

        // Parse JSON from response
        const jsonMatch = response.response.match(stryMutAct_9fa48("67006") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("67005") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("67004") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("67003") ? /\{[\s\S]\}/ : (stryCov_9fa48("67003", "67004", "67005", "67006"), /\{[\s\S]*\}/));
        if (stryMutAct_9fa48("67008") ? false : stryMutAct_9fa48("67007") ? true : (stryCov_9fa48("67007", "67008"), jsonMatch)) {
          const parsed = JSON.parse(jsonMatch[0]);
          failureModes = stryMutAct_9fa48("67012") ? parsed.failureModes && [] : stryMutAct_9fa48("67011") ? false : stryMutAct_9fa48("67010") ? true : (stryCov_9fa48("67010", "67011", "67012"), parsed.failureModes || (stryMutAct_9fa48("67013") ? ["Stryker was here"] : (stryCov_9fa48("67013"), [])));
          recommendation = parsed.recommendation;
          executiveSummary = stryMutAct_9fa48("67016") ? parsed.executiveSummary && '' : stryMutAct_9fa48("67015") ? false : stryMutAct_9fa48("67014") ? true : (stryCov_9fa48("67014", "67015", "67016"), parsed.executiveSummary || '');
        }
      } catch (error) {
        console.error('[PreMortem] Ollama error:', error);
      }
    }

    // Fallback to intelligent defaults if Ollama unavailable or failed
    if (stryMutAct_9fa48("67022") ? failureModes.length !== 0 : stryMutAct_9fa48("67021") ? false : stryMutAct_9fa48("67020") ? true : (stryCov_9fa48("67020", "67021", "67022"), failureModes.length === 0)) {
      failureModes = this.generateDefaultFailureModes(decisionText, stryMutAct_9fa48("67024") ? options.budget : (stryCov_9fa48("67024"), options?.budget));
      recommendation = this.generateDefaultRecommendation(failureModes);
      executiveSummary = `Analysis of "${stryMutAct_9fa48("67026") ? decisionText : (stryCov_9fa48("67026"), decisionText.slice(0, 50))}..." identified ${failureModes.length} potential failure modes. ${(stryMutAct_9fa48("67029") ? recommendation.action !== 'proceed' : stryMutAct_9fa48("67028") ? false : stryMutAct_9fa48("67027") ? true : (stryCov_9fa48("67027", "67028", "67029"), recommendation.action === 'proceed')) ? 'Proceed with standard precautions.' : (stryMutAct_9fa48("67034") ? recommendation.action !== 'proceed_with_caution' : stryMutAct_9fa48("67033") ? false : stryMutAct_9fa48("67032") ? true : (stryCov_9fa48("67032", "67033", "67034"), recommendation.action === 'proceed_with_caution')) ? 'Proceed with enhanced monitoring.' : 'Consider alternatives before proceeding.'}`;
    }
    const totalRWE = failureModes.reduce(stryMutAct_9fa48("67038") ? () => undefined : (stryCov_9fa48("67038"), (sum, fm) => stryMutAct_9fa48("67039") ? sum - fm.probability * fm.costImpact : (stryCov_9fa48("67039"), sum + (stryMutAct_9fa48("67040") ? fm.probability / fm.costImpact : (stryCov_9fa48("67040"), fm.probability * fm.costImpact)))), 0);
    const overallRisk = stryMutAct_9fa48("67041") ? Math.max(100, failureModes.reduce((sum, fm) => sum + fm.probability * 100, 0) / Math.max(1, failureModes.length)) : (stryCov_9fa48("67041"), Math.min(100, stryMutAct_9fa48("67042") ? failureModes.reduce((sum, fm) => sum + fm.probability * 100, 0) * Math.max(1, failureModes.length) : (stryCov_9fa48("67042"), failureModes.reduce(stryMutAct_9fa48("67043") ? () => undefined : (stryCov_9fa48("67043"), (sum, fm) => stryMutAct_9fa48("67044") ? sum - fm.probability * 100 : (stryCov_9fa48("67044"), sum + (stryMutAct_9fa48("67045") ? fm.probability / 100 : (stryCov_9fa48("67045"), fm.probability * 100)))), 0) / (stryMutAct_9fa48("67046") ? Math.min(1, failureModes.length) : (stryCov_9fa48("67046"), Math.max(1, failureModes.length))))));
    const result: PreMortemResult = stryMutAct_9fa48("67047") ? {} : (stryCov_9fa48("67047"), {
      id: `premortem-${Date.now()}`,
      decision: decisionText,
      context,
      analyzedAt: new Date(),
      failureModes,
      totalRiskWeightedExposure: totalRWE,
      overallRiskScore: Math.round(overallRisk),
      recommendation: stryMutAct_9fa48("67051") ? recommendation && {
        action: 'proceed_with_caution',
        reasoning: 'Analysis incomplete',
        conditions: []
      } : stryMutAct_9fa48("67050") ? false : stryMutAct_9fa48("67049") ? true : (stryCov_9fa48("67049", "67050", "67051"), recommendation || (stryMutAct_9fa48("67052") ? {} : (stryCov_9fa48("67052"), {
        action: 'proceed_with_caution',
        reasoning: 'Analysis incomplete',
        conditions: stryMutAct_9fa48("67055") ? ["Stryker was here"] : (stryCov_9fa48("67055"), [])
      }))),
      executiveSummary: stryMutAct_9fa48("67058") ? executiveSummary && 'Analysis completed.' : stryMutAct_9fa48("67057") ? false : stryMutAct_9fa48("67056") ? true : (stryCov_9fa48("67056", "67057", "67058"), executiveSummary || 'Analysis completed.'),
      agentsUsed: stryMutAct_9fa48("67062") ? options?.agents && ['cfo', 'ciso', 'pessimist'] : stryMutAct_9fa48("67061") ? false : stryMutAct_9fa48("67060") ? true : (stryCov_9fa48("67060", "67061", "67062"), (stryMutAct_9fa48("67063") ? options.agents : (stryCov_9fa48("67063"), options?.agents)) || (stryMutAct_9fa48("67064") ? [] : (stryCov_9fa48("67064"), ['cfo', 'ciso', 'pessimist'])))
    });
    this.preMortems.set(result.id, result);
    this.saveToStorage();
    return result;
  }
  private generateDefaultFailureModes(decision: string, budget?: number): FailureMode[] {
    const baseCost = stryMutAct_9fa48("67071") ? budget && 100000 : stryMutAct_9fa48("67070") ? false : stryMutAct_9fa48("67069") ? true : (stryCov_9fa48("67069", "67070", "67071"), budget || 100000);
    return stryMutAct_9fa48("67072") ? [] : (stryCov_9fa48("67072"), [stryMutAct_9fa48("67073") ? {} : (stryCov_9fa48("67073"), {
      rank: 1,
      title: 'Resource constraints lead to timeline delays',
      probability: 0.35,
      costImpact: stryMutAct_9fa48("67075") ? baseCost / 0.15 : (stryCov_9fa48("67075"), baseCost * 0.15),
      category: 'Operational',
      mitigations: stryMutAct_9fa48("67077") ? [] : (stryCov_9fa48("67077"), [stryMutAct_9fa48("67078") ? {} : (stryCov_9fa48("67078"), {
        action: 'Build 20% buffer into timeline estimates',
        effectiveness: 0.7
      }), stryMutAct_9fa48("67080") ? {} : (stryCov_9fa48("67080"), {
        action: 'Identify backup resources upfront',
        effectiveness: 0.5
      })])
    }), stryMutAct_9fa48("67082") ? {} : (stryCov_9fa48("67082"), {
      rank: 2,
      title: 'Stakeholder misalignment causes scope creep',
      probability: 0.40,
      costImpact: stryMutAct_9fa48("67084") ? baseCost / 0.25 : (stryCov_9fa48("67084"), baseCost * 0.25),
      category: 'Operational',
      mitigations: stryMutAct_9fa48("67086") ? [] : (stryCov_9fa48("67086"), [stryMutAct_9fa48("67087") ? {} : (stryCov_9fa48("67087"), {
        action: 'Lock scope with signed-off requirements',
        effectiveness: 0.8
      }), stryMutAct_9fa48("67089") ? {} : (stryCov_9fa48("67089"), {
        action: 'Establish change control process',
        effectiveness: 0.6
      })])
    }), stryMutAct_9fa48("67091") ? {} : (stryCov_9fa48("67091"), {
      rank: 3,
      title: 'Market conditions change during execution',
      probability: 0.25,
      costImpact: stryMutAct_9fa48("67093") ? baseCost / 0.40 : (stryCov_9fa48("67093"), baseCost * 0.40),
      category: 'Market',
      mitigations: stryMutAct_9fa48("67095") ? [] : (stryCov_9fa48("67095"), [stryMutAct_9fa48("67096") ? {} : (stryCov_9fa48("67096"), {
        action: 'Build checkpoints for go/no-go decisions',
        effectiveness: 0.7
      }), stryMutAct_9fa48("67098") ? {} : (stryCov_9fa48("67098"), {
        action: 'Develop contingency plans',
        effectiveness: 0.5
      })])
    }), stryMutAct_9fa48("67100") ? {} : (stryCov_9fa48("67100"), {
      rank: 4,
      title: 'Technical implementation challenges',
      probability: 0.30,
      costImpact: stryMutAct_9fa48("67102") ? baseCost / 0.20 : (stryCov_9fa48("67102"), baseCost * 0.20),
      category: 'Technical',
      mitigations: stryMutAct_9fa48("67104") ? [] : (stryCov_9fa48("67104"), [stryMutAct_9fa48("67105") ? {} : (stryCov_9fa48("67105"), {
        action: 'Conduct proof-of-concept first',
        effectiveness: 0.8
      }), stryMutAct_9fa48("67107") ? {} : (stryCov_9fa48("67107"), {
        action: 'Engage technical experts early',
        effectiveness: 0.7
      })])
    }), stryMutAct_9fa48("67109") ? {} : (stryCov_9fa48("67109"), {
      rank: 5,
      title: 'Regulatory or compliance issues emerge',
      probability: 0.15,
      costImpact: stryMutAct_9fa48("67111") ? baseCost / 0.50 : (stryCov_9fa48("67111"), baseCost * 0.50),
      category: 'Regulatory',
      mitigations: stryMutAct_9fa48("67113") ? [] : (stryCov_9fa48("67113"), [stryMutAct_9fa48("67114") ? {} : (stryCov_9fa48("67114"), {
        action: 'Early legal and compliance review',
        effectiveness: 0.9
      }), stryMutAct_9fa48("67116") ? {} : (stryCov_9fa48("67116"), {
        action: 'Monitor regulatory landscape',
        effectiveness: 0.6
      })])
    })]);
  }
  private generateDefaultRecommendation(failureModes: FailureMode[]): PreMortemResult['recommendation'] {
    const avgProbability = stryMutAct_9fa48("67119") ? failureModes.reduce((s, f) => s + f.probability, 0) * failureModes.length : (stryCov_9fa48("67119"), failureModes.reduce(stryMutAct_9fa48("67120") ? () => undefined : (stryCov_9fa48("67120"), (s, f) => stryMutAct_9fa48("67121") ? s - f.probability : (stryCov_9fa48("67121"), s + f.probability)), 0) / failureModes.length);
    if (stryMutAct_9fa48("67125") ? avgProbability <= 0.5 : stryMutAct_9fa48("67124") ? avgProbability >= 0.5 : stryMutAct_9fa48("67123") ? false : stryMutAct_9fa48("67122") ? true : (stryCov_9fa48("67122", "67123", "67124", "67125"), avgProbability > 0.5)) {
      return stryMutAct_9fa48("67127") ? {} : (stryCov_9fa48("67127"), {
        action: 'delay',
        reasoning: 'High probability of multiple failure modes suggests further analysis or risk mitigation is needed.',
        conditions: stryMutAct_9fa48("67130") ? [] : (stryCov_9fa48("67130"), ['Complete detailed risk mitigation plan', 'Secure executive sponsorship'])
      });
    } else if (stryMutAct_9fa48("67136") ? avgProbability <= 0.3 : stryMutAct_9fa48("67135") ? avgProbability >= 0.3 : stryMutAct_9fa48("67134") ? false : stryMutAct_9fa48("67133") ? true : (stryCov_9fa48("67133", "67134", "67135", "67136"), avgProbability > 0.3)) {
      return stryMutAct_9fa48("67138") ? {} : (stryCov_9fa48("67138"), {
        action: 'proceed_with_caution',
        reasoning: 'Moderate risk profile with manageable failure modes. Recommend enhanced monitoring.',
        conditions: stryMutAct_9fa48("67141") ? [] : (stryCov_9fa48("67141"), ['Implement key mitigations', 'Establish weekly risk reviews'])
      });
    } else {
      return stryMutAct_9fa48("67145") ? {} : (stryCov_9fa48("67145"), {
        action: 'proceed',
        reasoning: 'Risk profile is acceptable with standard precautions.',
        conditions: stryMutAct_9fa48("67148") ? [] : (stryCov_9fa48("67148"), ['Standard project governance', 'Regular status reporting'])
      });
    }
  }

  // ---------------------------------------------------------------------------
  // GHOST BOARD (Ollama-powered)
  // ---------------------------------------------------------------------------

  async runGhostBoard(proposalTitle: string, proposalContent: string, boardType: string = 'standard', difficulty: string = 'hard'): Promise<GhostBoardResult> {
    const boardMembers = stryMutAct_9fa48("67156") ? BOARD_MEMBERS[boardType] && BOARD_MEMBERS.standard : stryMutAct_9fa48("67155") ? false : stryMutAct_9fa48("67154") ? true : (stryCov_9fa48("67154", "67155", "67156"), BOARD_MEMBERS[boardType] || BOARD_MEMBERS.standard);
    const questions: BoardQuestion[] = stryMutAct_9fa48("67157") ? ["Stryker was here"] : (stryCov_9fa48("67157"), []);
    const status = ollamaService.getStatus();
    for (const member of boardMembers) {
      let question: string;
      let suggestedAnswer: string;
      if (stryMutAct_9fa48("67160") ? false : stryMutAct_9fa48("67159") ? true : (stryCov_9fa48("67159", "67160"), status.available)) {
        try {
          const prompt = `You are ${member.name}, ${member.role} on a corporate board. Your personality: ${member.personality}.

A proposal is being presented:
TITLE: ${proposalTitle}
CONTENT: ${proposalContent}

Generate ONE challenging ${difficulty} question you would ask about this proposal. Be specific and probing.
Then provide a suggested strong answer.

Format:
QUESTION: [your question]
ANSWER: [suggested answer]`;
          const response = await ollamaService.generate(stryMutAct_9fa48("67164") ? {} : (stryCov_9fa48("67164"), {
            model: 'llama3:8b',
            prompt,
            options: stryMutAct_9fa48("67166") ? {} : (stryCov_9fa48("67166"), {
              temperature: 0.7,
              num_predict: 500
            })
          }));
          const qMatch = response.response.match(stryMutAct_9fa48("67171") ? /QUESTION:\s*(.+?)(?=ANSWER:)/s : stryMutAct_9fa48("67170") ? /QUESTION:\s*(.+?)(?!ANSWER:|$)/s : stryMutAct_9fa48("67169") ? /QUESTION:\s*(.)(?=ANSWER:|$)/s : stryMutAct_9fa48("67168") ? /QUESTION:\S*(.+?)(?=ANSWER:|$)/s : stryMutAct_9fa48("67167") ? /QUESTION:\s(.+?)(?=ANSWER:|$)/s : (stryCov_9fa48("67167", "67168", "67169", "67170", "67171"), /QUESTION:\s*(.+?)(?=ANSWER:|$)/s));
          const aMatch = response.response.match(stryMutAct_9fa48("67175") ? /ANSWER:\s*(.)$/s : stryMutAct_9fa48("67174") ? /ANSWER:\S*(.+?)$/s : stryMutAct_9fa48("67173") ? /ANSWER:\s(.+?)$/s : stryMutAct_9fa48("67172") ? /ANSWER:\s*(.+?)/s : (stryCov_9fa48("67172", "67173", "67174", "67175"), /ANSWER:\s*(.+?)$/s));
          question = stryMutAct_9fa48("67178") ? qMatch?.[1]?.trim() && this.getDefaultQuestion(member, proposalTitle) : stryMutAct_9fa48("67177") ? false : stryMutAct_9fa48("67176") ? true : (stryCov_9fa48("67176", "67177", "67178"), (stryMutAct_9fa48("67181") ? qMatch[1]?.trim() : stryMutAct_9fa48("67180") ? qMatch?.[1].trim() : stryMutAct_9fa48("67179") ? qMatch?.[1] : (stryCov_9fa48("67179", "67180", "67181"), qMatch?.[1]?.trim())) || this.getDefaultQuestion(member, proposalTitle));
          suggestedAnswer = stryMutAct_9fa48("67184") ? aMatch?.[1]?.trim() && 'Address the concern with specific data and a clear action plan.' : stryMutAct_9fa48("67183") ? false : stryMutAct_9fa48("67182") ? true : (stryCov_9fa48("67182", "67183", "67184"), (stryMutAct_9fa48("67187") ? aMatch[1]?.trim() : stryMutAct_9fa48("67186") ? aMatch?.[1].trim() : stryMutAct_9fa48("67185") ? aMatch?.[1] : (stryCov_9fa48("67185", "67186", "67187"), aMatch?.[1]?.trim())) || 'Address the concern with specific data and a clear action plan.');
        } catch (error) {
          question = this.getDefaultQuestion(member, proposalTitle);
          suggestedAnswer = 'Provide specific metrics and a clear implementation roadmap.';
        }
      } else {
        question = this.getDefaultQuestion(member, proposalTitle);
        suggestedAnswer = 'Provide specific metrics, risk analysis, and implementation roadmap.';
      }
      questions.push(stryMutAct_9fa48("67193") ? {} : (stryCov_9fa48("67193"), {
        id: `q-${Date.now()}-${member.id}`,
        question,
        askedBy: member,
        category: member.role,
        difficulty,
        suggestedAnswer
      }));
    }

    // Calculate preparedness score
    const preparednessScore = stryMutAct_9fa48("67195") ? 70 - Math.floor(Math.random() * 20) : (stryCov_9fa48("67195"), 70 + Math.floor(stryMutAct_9fa48("67196") ? Math.random() / 20 : (stryCov_9fa48("67196"), Math.random() * 20)));
    const result: GhostBoardResult = stryMutAct_9fa48("67197") ? {} : (stryCov_9fa48("67197"), {
      id: `ghost-${Date.now()}`,
      proposalTitle,
      proposalContent,
      boardType,
      difficulty,
      duration: stryMutAct_9fa48("67199") ? questions.length / 3 : (stryCov_9fa48("67199"), questions.length * 3),
      boardMembers,
      questions,
      preparednessScore,
      keyGaps: stryMutAct_9fa48("67200") ? [] : (stryCov_9fa48("67200"), ['Financial projections need more detail', 'Risk mitigation not fully addressed']),
      strengthAreas: stryMutAct_9fa48("67203") ? [] : (stryCov_9fa48("67203"), ['Clear problem statement', 'Strong market analysis']),
      overallAssessment: (stryMutAct_9fa48("67209") ? preparednessScore < 80 : stryMutAct_9fa48("67208") ? preparednessScore > 80 : stryMutAct_9fa48("67207") ? false : stryMutAct_9fa48("67206") ? true : (stryCov_9fa48("67206", "67207", "67208", "67209"), preparednessScore >= 80)) ? 'Well-prepared for board presentation. Minor refinements recommended.' : (stryMutAct_9fa48("67214") ? preparednessScore < 60 : stryMutAct_9fa48("67213") ? preparednessScore > 60 : stryMutAct_9fa48("67212") ? false : stryMutAct_9fa48("67211") ? true : (stryCov_9fa48("67211", "67212", "67213", "67214"), preparednessScore >= 60)) ? 'Moderately prepared. Address key gaps before presenting.' : 'Additional preparation needed. Significant gaps identified.',
      runAt: new Date()
    });
    this.ghostBoards.set(result.id, result);
    this.saveToStorage();
    return result;
  }
  private getDefaultQuestion(member: BoardMember, proposal: string): string {
    const questions: Record<string, string[]> = stryMutAct_9fa48("67218") ? {} : (stryCov_9fa48("67218"), {
      'Board Chair': stryMutAct_9fa48("67219") ? [] : (stryCov_9fa48("67219"), [`How does "${proposal}" align with our 3-year strategic vision?`, 'What are the key milestones and how will we measure success?']),
      'Lead Investor': stryMutAct_9fa48("67222") ? [] : (stryCov_9fa48("67222"), ['What is the expected ROI and payback period?', 'How does this compare to alternative uses of capital?']),
      'Independent Director': stryMutAct_9fa48("67225") ? [] : (stryCov_9fa48("67225"), ['Have we fully evaluated the governance implications?', 'What conflicts of interest should we be aware of?']),
      'Managing Partner': stryMutAct_9fa48("67228") ? [] : (stryCov_9fa48("67228"), ['How will this accelerate our path to exit?', 'What is the impact on our key growth metrics?']),
      'Audit Committee Chair': stryMutAct_9fa48("67231") ? [] : (stryCov_9fa48("67231"), ['What are the financial controls and compliance requirements?', 'How will we ensure proper oversight?'])
    });
    const memberQuestions = stryMutAct_9fa48("67236") ? questions[member.role] && ['What is the risk-adjusted return on this initiative?'] : stryMutAct_9fa48("67235") ? false : stryMutAct_9fa48("67234") ? true : (stryCov_9fa48("67234", "67235", "67236"), questions[member.role] || (stryMutAct_9fa48("67237") ? [] : (stryCov_9fa48("67237"), ['What is the risk-adjusted return on this initiative?'])));
    return memberQuestions[Math.floor(stryMutAct_9fa48("67239") ? Math.random() / memberQuestions.length : (stryCov_9fa48("67239"), Math.random() * memberQuestions.length))];
  }

  // ---------------------------------------------------------------------------
  // DECISION DEBT TRACKING
  // ---------------------------------------------------------------------------

  getPendingDecisions(): PendingDecision[] {
    return Array.from(this.pendingDecisions.values());
  }
  createPendingDecision(partial: Partial<PendingDecision>): PendingDecision {
    const id = stryMutAct_9fa48("67244") ? partial.id && `pending-${Date.now()}` : stryMutAct_9fa48("67243") ? false : stryMutAct_9fa48("67242") ? true : (stryCov_9fa48("67242", "67243", "67244"), partial.id || `pending-${Date.now()}`);
    const daysStuck = stryMutAct_9fa48("67248") ? partial.daysStuck && 0 : stryMutAct_9fa48("67247") ? false : stryMutAct_9fa48("67246") ? true : (stryCov_9fa48("67246", "67247", "67248"), partial.daysStuck || 0);
    const dailyCost = stryMutAct_9fa48("67251") ? partial.estimatedDailyCost && 1000 : stryMutAct_9fa48("67250") ? false : stryMutAct_9fa48("67249") ? true : (stryCov_9fa48("67249", "67250", "67251"), partial.estimatedDailyCost || 1000);
    const decision: PendingDecision = stryMutAct_9fa48("67252") ? {} : (stryCov_9fa48("67252"), {
      id,
      title: stryMutAct_9fa48("67255") ? partial.title && 'Untitled Decision' : stryMutAct_9fa48("67254") ? false : stryMutAct_9fa48("67253") ? true : (stryCov_9fa48("67253", "67254", "67255"), partial.title || 'Untitled Decision'),
      department: stryMutAct_9fa48("67259") ? partial.department && 'General' : stryMutAct_9fa48("67258") ? false : stryMutAct_9fa48("67257") ? true : (stryCov_9fa48("67257", "67258", "67259"), partial.department || 'General'),
      owner: stryMutAct_9fa48("67263") ? partial.owner && 'Unassigned' : stryMutAct_9fa48("67262") ? false : stryMutAct_9fa48("67261") ? true : (stryCov_9fa48("67261", "67262", "67263"), partial.owner || 'Unassigned'),
      daysStuck,
      estimatedDailyCost: dailyCost,
      totalCostAccrued: stryMutAct_9fa48("67265") ? daysStuck / dailyCost : (stryCov_9fa48("67265"), daysStuck * dailyCost),
      priority: stryMutAct_9fa48("67268") ? partial.priority && 'medium' : stryMutAct_9fa48("67267") ? false : stryMutAct_9fa48("67266") ? true : (stryCov_9fa48("67266", "67267", "67268"), partial.priority || 'medium'),
      status: stryMutAct_9fa48("67272") ? partial.status && 'Pending' : stryMutAct_9fa48("67271") ? false : stryMutAct_9fa48("67270") ? true : (stryCov_9fa48("67270", "67271", "67272"), partial.status || 'Pending'),
      blockedBy: stryMutAct_9fa48("67276") ? partial.blockedBy && [] : stryMutAct_9fa48("67275") ? false : stryMutAct_9fa48("67274") ? true : (stryCov_9fa48("67274", "67275", "67276"), partial.blockedBy || (stryMutAct_9fa48("67277") ? ["Stryker was here"] : (stryCov_9fa48("67277"), []))),
      createdAt: new Date()
    });
    this.pendingDecisions.set(id, decision);
    this.saveToStorage();
    return decision;
  }
  getDecisionDebtDashboard(): DecisionDebtDashboard {
    const decisions = this.getPendingDecisions();
    const totalDecisions = decisions.length;
    const blockedDecisions = stryMutAct_9fa48("67279") ? decisions.length : (stryCov_9fa48("67279"), decisions.filter(stryMutAct_9fa48("67280") ? () => undefined : (stryCov_9fa48("67280"), d => stryMutAct_9fa48("67284") ? d.blockedBy.length <= 0 : stryMutAct_9fa48("67283") ? d.blockedBy.length >= 0 : stryMutAct_9fa48("67282") ? false : stryMutAct_9fa48("67281") ? true : (stryCov_9fa48("67281", "67282", "67283", "67284"), d.blockedBy.length > 0))).length);
    const avgDaysStuck = stryMutAct_9fa48("67285") ? decisions.reduce((s, d) => s + d.daysStuck, 0) * Math.max(1, totalDecisions) : (stryCov_9fa48("67285"), decisions.reduce(stryMutAct_9fa48("67286") ? () => undefined : (stryCov_9fa48("67286"), (s, d) => stryMutAct_9fa48("67287") ? s - d.daysStuck : (stryCov_9fa48("67287"), s + d.daysStuck)), 0) / (stryMutAct_9fa48("67288") ? Math.min(1, totalDecisions) : (stryCov_9fa48("67288"), Math.max(1, totalDecisions))));
    const dailyCost = decisions.reduce(stryMutAct_9fa48("67289") ? () => undefined : (stryCov_9fa48("67289"), (s, d) => stryMutAct_9fa48("67290") ? s - d.estimatedDailyCost : (stryCov_9fa48("67290"), s + d.estimatedDailyCost)), 0);
    const totalAccrued = decisions.reduce(stryMutAct_9fa48("67291") ? () => undefined : (stryCov_9fa48("67291"), (s, d) => stryMutAct_9fa48("67292") ? s - d.totalCostAccrued : (stryCov_9fa48("67292"), s + d.totalCostAccrued)), 0);

    // Calculate debt score
    let grade = 'A';
    let score = 95;
    let label = 'Excellent';
    if (stryMutAct_9fa48("67298") ? avgDaysStuck <= 30 : stryMutAct_9fa48("67297") ? avgDaysStuck >= 30 : stryMutAct_9fa48("67296") ? false : stryMutAct_9fa48("67295") ? true : (stryCov_9fa48("67295", "67296", "67297", "67298"), avgDaysStuck > 30)) {
      grade = 'F';
      score = 30;
      label = 'Critical';
    } else if (stryMutAct_9fa48("67305") ? avgDaysStuck <= 21 : stryMutAct_9fa48("67304") ? avgDaysStuck >= 21 : stryMutAct_9fa48("67303") ? false : stryMutAct_9fa48("67302") ? true : (stryCov_9fa48("67302", "67303", "67304", "67305"), avgDaysStuck > 21)) {
      grade = 'D';
      score = 50;
      label = 'Poor';
    } else if (stryMutAct_9fa48("67312") ? avgDaysStuck <= 14 : stryMutAct_9fa48("67311") ? avgDaysStuck >= 14 : stryMutAct_9fa48("67310") ? false : stryMutAct_9fa48("67309") ? true : (stryCov_9fa48("67309", "67310", "67311", "67312"), avgDaysStuck > 14)) {
      grade = 'C';
      score = 65;
      label = 'Fair';
    } else if (stryMutAct_9fa48("67319") ? avgDaysStuck <= 7 : stryMutAct_9fa48("67318") ? avgDaysStuck >= 7 : stryMutAct_9fa48("67317") ? false : stryMutAct_9fa48("67316") ? true : (stryCov_9fa48("67316", "67317", "67318", "67319"), avgDaysStuck > 7)) {
      grade = 'B';
      score = 80;
      label = 'Good';
    }

    // Identify top blockers
    const blockerMap = new Map<string, {
      count: number;
      cost: number;
    }>();
    decisions.forEach(d => {
      d.blockedBy.forEach(b => {
        const existing = stryMutAct_9fa48("67327") ? blockerMap.get(b.name) && {
          count: 0,
          cost: 0
        } : stryMutAct_9fa48("67326") ? false : stryMutAct_9fa48("67325") ? true : (stryCov_9fa48("67325", "67326", "67327"), blockerMap.get(b.name) || (stryMutAct_9fa48("67328") ? {} : (stryCov_9fa48("67328"), {
          count: 0,
          cost: 0
        })));
        blockerMap.set(b.name, stryMutAct_9fa48("67329") ? {} : (stryCov_9fa48("67329"), {
          count: stryMutAct_9fa48("67330") ? existing.count - 1 : (stryCov_9fa48("67330"), existing.count + 1),
          cost: stryMutAct_9fa48("67331") ? existing.cost - d.totalCostAccrued : (stryCov_9fa48("67331"), existing.cost + d.totalCostAccrued)
        }));
      });
    });
    const topBlockers = stryMutAct_9fa48("67333") ? Array.from(blockerMap.entries()).map(([name, data]) => ({
      blockerName: name,
      decisionsBlocked: data.count,
      totalCostImpact: data.cost
    })).slice(0, 5) : stryMutAct_9fa48("67332") ? Array.from(blockerMap.entries()).map(([name, data]) => ({
      blockerName: name,
      decisionsBlocked: data.count,
      totalCostImpact: data.cost
    })).sort((a, b) => b.totalCostImpact - a.totalCostImpact) : (stryCov_9fa48("67332", "67333"), Array.from(blockerMap.entries()).map(stryMutAct_9fa48("67334") ? () => undefined : (stryCov_9fa48("67334"), ([name, data]) => stryMutAct_9fa48("67335") ? {} : (stryCov_9fa48("67335"), {
      blockerName: name,
      decisionsBlocked: data.count,
      totalCostImpact: data.cost
    }))).sort(stryMutAct_9fa48("67336") ? () => undefined : (stryCov_9fa48("67336"), (a, b) => stryMutAct_9fa48("67337") ? b.totalCostImpact + a.totalCostImpact : (stryCov_9fa48("67337"), b.totalCostImpact - a.totalCostImpact))).slice(0, 5));
    return stryMutAct_9fa48("67338") ? {} : (stryCov_9fa48("67338"), {
      summary: stryMutAct_9fa48("67339") ? {} : (stryCov_9fa48("67339"), {
        totalPendingDecisions: totalDecisions,
        totalBlockedDecisions: blockedDecisions,
        averageDaysStuck: avgDaysStuck,
        dailyCost,
        monthlyCost: stryMutAct_9fa48("67340") ? dailyCost / 30 : (stryCov_9fa48("67340"), dailyCost * 30),
        annualProjectedLoss: stryMutAct_9fa48("67341") ? dailyCost / 365 : (stryCov_9fa48("67341"), dailyCost * 365),
        debtScore: stryMutAct_9fa48("67342") ? {} : (stryCov_9fa48("67342"), {
          grade,
          score,
          label,
          color: (stryMutAct_9fa48("67345") ? grade !== 'A' : stryMutAct_9fa48("67344") ? false : stryMutAct_9fa48("67343") ? true : (stryCov_9fa48("67343", "67344", "67345"), grade === 'A')) ? 'green' : (stryMutAct_9fa48("67350") ? grade !== 'B' : stryMutAct_9fa48("67349") ? false : stryMutAct_9fa48("67348") ? true : (stryCov_9fa48("67348", "67349", "67350"), grade === 'B')) ? 'lime' : (stryMutAct_9fa48("67355") ? grade !== 'C' : stryMutAct_9fa48("67354") ? false : stryMutAct_9fa48("67353") ? true : (stryCov_9fa48("67353", "67354", "67355"), grade === 'C')) ? 'yellow' : (stryMutAct_9fa48("67360") ? grade !== 'D' : stryMutAct_9fa48("67359") ? false : stryMutAct_9fa48("67358") ? true : (stryCov_9fa48("67358", "67359", "67360"), grade === 'D')) ? 'orange' : 'red'
        })
      }),
      decisions: stryMutAct_9fa48("67364") ? decisions : (stryCov_9fa48("67364"), decisions.sort(stryMutAct_9fa48("67365") ? () => undefined : (stryCov_9fa48("67365"), (a, b) => stryMutAct_9fa48("67366") ? b.totalCostAccrued + a.totalCostAccrued : (stryCov_9fa48("67366"), b.totalCostAccrued - a.totalCostAccrued)))),
      topBlockers,
      criticalPath: stryMutAct_9fa48("67367") ? decisions.map(d => d.title) : (stryCov_9fa48("67367"), decisions.filter(stryMutAct_9fa48("67368") ? () => undefined : (stryCov_9fa48("67368"), d => stryMutAct_9fa48("67371") ? d.priority !== 'critical' : stryMutAct_9fa48("67370") ? false : stryMutAct_9fa48("67369") ? true : (stryCov_9fa48("67369", "67370", "67371"), d.priority === 'critical'))).map(stryMutAct_9fa48("67373") ? () => undefined : (stryCov_9fa48("67373"), d => d.title))),
      recommendations: stryMutAct_9fa48("67374") ? [] : (stryCov_9fa48("67374"), [stryMutAct_9fa48("67375") ? {} : (stryCov_9fa48("67375"), {
        title: 'Clear top blocker',
        description: `Resolve "${stryMutAct_9fa48("67380") ? topBlockers[0]?.blockerName && 'pending reviews' : stryMutAct_9fa48("67379") ? false : stryMutAct_9fa48("67378") ? true : (stryCov_9fa48("67378", "67379", "67380"), (stryMutAct_9fa48("67381") ? topBlockers[0].blockerName : (stryCov_9fa48("67381"), topBlockers[0]?.blockerName)) || 'pending reviews')}" to unblock ${stryMutAct_9fa48("67385") ? topBlockers[0]?.decisionsBlocked && 0 : stryMutAct_9fa48("67384") ? false : stryMutAct_9fa48("67383") ? true : (stryCov_9fa48("67383", "67384", "67385"), (stryMutAct_9fa48("67386") ? topBlockers[0].decisionsBlocked : (stryCov_9fa48("67386"), topBlockers[0]?.decisionsBlocked)) || 0)} decisions`,
        estimatedSavings: stryMutAct_9fa48("67389") ? topBlockers[0]?.totalCostImpact && 0 : stryMutAct_9fa48("67388") ? false : stryMutAct_9fa48("67387") ? true : (stryCov_9fa48("67387", "67388", "67389"), (stryMutAct_9fa48("67390") ? topBlockers[0].totalCostImpact : (stryCov_9fa48("67390"), topBlockers[0]?.totalCostImpact)) || 0)
      }), stryMutAct_9fa48("67391") ? {} : (stryCov_9fa48("67391"), {
        title: 'Implement decision SLAs',
        description: 'Set maximum decision times by priority level',
        estimatedSavings: stryMutAct_9fa48("67394") ? dailyCost / 10 : (stryCov_9fa48("67394"), dailyCost * 10)
      }), stryMutAct_9fa48("67395") ? {} : (stryCov_9fa48("67395"), {
        title: 'Weekly decision review',
        description: 'Review all stuck decisions in weekly leadership meeting',
        estimatedSavings: stryMutAct_9fa48("67398") ? dailyCost / 5 : (stryCov_9fa48("67398"), dailyCost * 5)
      })])
    });
  }

  // ---------------------------------------------------------------------------
  // CHRONOS TIME MACHINE
  // ---------------------------------------------------------------------------

  getTimeline(startDate: Date, endDate: Date): TimelineEvent[] {
    return stryMutAct_9fa48("67401") ? this.timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) : stryMutAct_9fa48("67400") ? this.timeline.filter(e => e.timestamp >= startDate && e.timestamp <= endDate) : (stryCov_9fa48("67400", "67401"), this.timeline.filter(stryMutAct_9fa48("67402") ? () => undefined : (stryCov_9fa48("67402"), e => stryMutAct_9fa48("67405") ? e.timestamp >= startDate || e.timestamp <= endDate : stryMutAct_9fa48("67404") ? false : stryMutAct_9fa48("67403") ? true : (stryCov_9fa48("67403", "67404", "67405"), (stryMutAct_9fa48("67408") ? e.timestamp < startDate : stryMutAct_9fa48("67407") ? e.timestamp > startDate : stryMutAct_9fa48("67406") ? true : (stryCov_9fa48("67406", "67407", "67408"), e.timestamp >= startDate)) && (stryMutAct_9fa48("67411") ? e.timestamp > endDate : stryMutAct_9fa48("67410") ? e.timestamp < endDate : stryMutAct_9fa48("67409") ? true : (stryCov_9fa48("67409", "67410", "67411"), e.timestamp <= endDate))))).sort(stryMutAct_9fa48("67412") ? () => undefined : (stryCov_9fa48("67412"), (a, b) => stryMutAct_9fa48("67413") ? a.timestamp.getTime() + b.timestamp.getTime() : (stryCov_9fa48("67413"), a.timestamp.getTime() - b.timestamp.getTime()))));
  }
  addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const newEvent: TimelineEvent = stryMutAct_9fa48("67415") ? {} : (stryCov_9fa48("67415"), {
      ...event,
      id: `timeline-${Date.now()}`
    });
    this.timeline.push(newEvent);
    this.saveToStorage();
    return newEvent;
  }
  getStateSnapshot(date: Date): StateSnapshot {
    // Generate realistic snapshot based on date
    const monthsAgo = stryMutAct_9fa48("67418") ? (Date.now() - date.getTime()) * (30 * 24 * 60 * 60 * 1000) : (stryCov_9fa48("67418"), (stryMutAct_9fa48("67419") ? Date.now() + date.getTime() : (stryCov_9fa48("67419"), Date.now() - date.getTime())) / (stryMutAct_9fa48("67420") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("67420"), (stryMutAct_9fa48("67421") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("67421"), (stryMutAct_9fa48("67422") ? 30 * 24 / 60 : (stryCov_9fa48("67422"), (stryMutAct_9fa48("67423") ? 30 / 24 : (stryCov_9fa48("67423"), 30 * 24)) * 60)) * 60)) * 1000)));
    const baseRevenue = 50000000;
    const growthRate = 0.02; // 2% monthly

    return stryMutAct_9fa48("67424") ? {} : (stryCov_9fa48("67424"), {
      timestamp: date,
      metrics: stryMutAct_9fa48("67425") ? {} : (stryCov_9fa48("67425"), {
        revenue: Math.round(stryMutAct_9fa48("67426") ? baseRevenue / Math.pow(1 - growthRate, monthsAgo) : (stryCov_9fa48("67426"), baseRevenue * Math.pow(stryMutAct_9fa48("67427") ? 1 + growthRate : (stryCov_9fa48("67427"), 1 - growthRate), monthsAgo))),
        profit: Math.round(stryMutAct_9fa48("67428") ? baseRevenue * 0.15 / Math.pow(1 - growthRate, monthsAgo) : (stryCov_9fa48("67428"), (stryMutAct_9fa48("67429") ? baseRevenue / 0.15 : (stryCov_9fa48("67429"), baseRevenue * 0.15)) * Math.pow(stryMutAct_9fa48("67430") ? 1 + growthRate : (stryCov_9fa48("67430"), 1 - growthRate), monthsAgo))),
        employees: Math.round(stryMutAct_9fa48("67431") ? 150 + monthsAgo * 2 : (stryCov_9fa48("67431"), 150 - (stryMutAct_9fa48("67432") ? monthsAgo / 2 : (stryCov_9fa48("67432"), monthsAgo * 2)))),
        customers: Math.round(stryMutAct_9fa48("67433") ? 500 + monthsAgo * 10 : (stryCov_9fa48("67433"), 500 - (stryMutAct_9fa48("67434") ? monthsAgo / 10 : (stryCov_9fa48("67434"), monthsAgo * 10)))),
        satisfaction: stryMutAct_9fa48("67435") ? 4.2 + monthsAgo * 0.05 : (stryCov_9fa48("67435"), 4.2 - (stryMutAct_9fa48("67436") ? monthsAgo / 0.05 : (stryCov_9fa48("67436"), monthsAgo * 0.05))),
        marketShare: stryMutAct_9fa48("67437") ? 12 + monthsAgo * 0.2 : (stryCov_9fa48("67437"), 12 - (stryMutAct_9fa48("67438") ? monthsAgo / 0.2 : (stryCov_9fa48("67438"), monthsAgo * 0.2)))
      })
    });
  }

  // ---------------------------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------------------------

  getStats(): {
    totalDecisions: number;
    activeDecisions: number;
    preMortemsRun: number;
    ghostBoardsRun: number;
    avgRiskScore: number;
  } {
    const decisions = Array.from(this.decisions.values());
    return stryMutAct_9fa48("67440") ? {} : (stryCov_9fa48("67440"), {
      totalDecisions: decisions.length,
      activeDecisions: stryMutAct_9fa48("67441") ? decisions.length : (stryCov_9fa48("67441"), decisions.filter(stryMutAct_9fa48("67442") ? () => undefined : (stryCov_9fa48("67442"), d => stryMutAct_9fa48("67443") ? ['closed', 'implemented'].includes(d.status) : (stryCov_9fa48("67443"), !(stryMutAct_9fa48("67444") ? [] : (stryCov_9fa48("67444"), ['closed', 'implemented'])).includes(d.status)))).length),
      preMortemsRun: this.preMortems.size,
      ghostBoardsRun: this.ghostBoards.size,
      avgRiskScore: stryMutAct_9fa48("67447") ? decisions.reduce((s, d) => s + (d.riskScore || 50), 0) * Math.max(1, decisions.length) : (stryCov_9fa48("67447"), decisions.reduce(stryMutAct_9fa48("67448") ? () => undefined : (stryCov_9fa48("67448"), (s, d) => stryMutAct_9fa48("67449") ? s - (d.riskScore || 50) : (stryCov_9fa48("67449"), s + (stryMutAct_9fa48("67452") ? d.riskScore && 50 : stryMutAct_9fa48("67451") ? false : stryMutAct_9fa48("67450") ? true : (stryCov_9fa48("67450", "67451", "67452"), d.riskScore || 50)))), 0) / (stryMutAct_9fa48("67453") ? Math.min(1, decisions.length) : (stryCov_9fa48("67453"), Math.max(1, decisions.length))))
    });
  }
}

// Singleton instance
export const decisionIntelligenceService = new DecisionIntelligenceService();
export default decisionIntelligenceService;