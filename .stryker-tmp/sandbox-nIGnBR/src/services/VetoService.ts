// @ts-nocheck
// =============================================================================
// CENDIA VETO™ — ADVERSARIAL GOVERNANCE ENGINE
// First veto-based (not just advisory) AI governance system
// Permanent blocking agents with enforceable veto rights
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
import { ollamaService, DomainAgent } from '../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

export type VetoAgentRole = 'ciso' | 'ethics' | 'compliance' | 'risk' | 'legal' | 'finance';
export type VetoStatus = 'pending' | 'approved' | 'vetoed' | 'override_requested' | 'escalated';
export type VetoReason = 'security_risk' | 'compliance_violation' | 'ethical_concern' | 'financial_risk' | 'legal_liability' | 'regulatory_breach' | 'reputational_damage' | 'data_privacy' | 'operational_risk' | 'strategic_misalignment';
export interface VetoAgent {
  id: string;
  role: VetoAgentRole;
  name: string;
  title: string;
  avatar: string;
  jurisdiction: string[];
  vetoThreshold: number; // 0-100 risk score threshold
  canBlockAutomatic: boolean;
  requiresHumanOverride: boolean;
  description: string;
}
export interface VetoDecision {
  id: string;
  proposalId: string;
  proposalTitle: string;
  proposalDescription: string;
  submittedBy: string;
  submittedAt: Date;
  status: VetoStatus;

  // Agent reviews
  reviews: VetoReview[];

  // Final outcome
  finalDecision?: 'approved' | 'vetoed';
  decidedAt?: Date;
  decidedBy?: string;

  // Override tracking
  overrideRequested?: boolean;
  overrideRequestedBy?: string;
  overrideReason?: string;
  overrideApproved?: boolean;
  overrideApprovedBy?: string;
}
export interface VetoReview {
  id: string;
  agentId: string;
  agentRole: VetoAgentRole;
  status: 'pending' | 'approved' | 'vetoed' | 'conditional';
  riskScore: number; // 0-100
  confidence: number; // 0-100
  reasoning: string;
  concerns: VetoConcern[];
  conditions?: string[];
  reviewedAt: Date;
  isBlocking: boolean;
}
export interface VetoConcern {
  id: string;
  category: VetoReason;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation?: string;
  regulatoryReference?: string;
}
export interface VetoPolicy {
  id: string;
  name: string;
  description: string;
  triggerConditions: VetoTrigger[];
  requiredAgents: VetoAgentRole[];
  autoVetoThreshold: number;
  escalationPath: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface VetoTrigger {
  type: 'keyword' | 'amount' | 'department' | 'category' | 'risk_score';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'in';
  value: string | number | string[];
  agentToNotify: VetoAgentRole;
}
export interface VetoMetrics {
  totalProposals: number;
  approvedProposals: number;
  vetoedProposals: number;
  pendingProposals: number;
  overrideRequests: number;
  overridesApproved: number;
  avgReviewTime: number; // hours
  vetosByAgent: Record<VetoAgentRole, number>;
  vetosByReason: Record<VetoReason, number>;
  riskScoreDistribution: {
    range: string;
    count: number;
  }[];
}

// =============================================================================
// VETO AGENTS
// =============================================================================

export const VETO_AGENTS: VetoAgent[] = stryMutAct_9fa48("70289") ? [] : (stryCov_9fa48("70289"), [stryMutAct_9fa48("70290") ? {} : (stryCov_9fa48("70290"), {
  id: 'veto-ciso',
  role: 'ciso',
  name: 'CISO Guardian',
  title: 'Chief Information Security Officer',
  avatar: '🛡️',
  jurisdiction: stryMutAct_9fa48("70296") ? [] : (stryCov_9fa48("70296"), ['data_security', 'cyber_risk', 'access_control', 'encryption', 'incident_response']),
  vetoThreshold: 70,
  canBlockAutomatic: stryMutAct_9fa48("70302") ? false : (stryCov_9fa48("70302"), true),
  requiresHumanOverride: stryMutAct_9fa48("70303") ? false : (stryCov_9fa48("70303"), true),
  description: 'Blocks proposals with security vulnerabilities, data exposure risks, or insufficient access controls.'
}), stryMutAct_9fa48("70305") ? {} : (stryCov_9fa48("70305"), {
  id: 'veto-ethics',
  role: 'ethics',
  name: 'Ethics Arbiter',
  title: 'Chief Ethics Officer',
  avatar: '⚖️',
  jurisdiction: stryMutAct_9fa48("70311") ? [] : (stryCov_9fa48("70311"), ['fairness', 'bias', 'transparency', 'social_impact', 'stakeholder_welfare']),
  vetoThreshold: 60,
  canBlockAutomatic: stryMutAct_9fa48("70317") ? false : (stryCov_9fa48("70317"), true),
  requiresHumanOverride: stryMutAct_9fa48("70318") ? false : (stryCov_9fa48("70318"), true),
  description: 'Blocks proposals with ethical concerns, bias risks, or negative social impact.'
}), stryMutAct_9fa48("70320") ? {} : (stryCov_9fa48("70320"), {
  id: 'veto-compliance',
  role: 'compliance',
  name: 'Compliance Sentinel',
  title: 'Chief Compliance Officer',
  avatar: '📋',
  jurisdiction: stryMutAct_9fa48("70326") ? [] : (stryCov_9fa48("70326"), ['gdpr', 'sox', 'hipaa', 'pci_dss', 'regulatory', 'licensing']),
  vetoThreshold: 65,
  canBlockAutomatic: stryMutAct_9fa48("70333") ? false : (stryCov_9fa48("70333"), true),
  requiresHumanOverride: stryMutAct_9fa48("70334") ? false : (stryCov_9fa48("70334"), true),
  description: 'Blocks proposals violating GDPR, SOX, HIPAA, or other regulatory frameworks.'
}), stryMutAct_9fa48("70336") ? {} : (stryCov_9fa48("70336"), {
  id: 'veto-risk',
  role: 'risk',
  name: 'Risk Assessor',
  title: 'Chief Risk Officer',
  avatar: '📊',
  jurisdiction: stryMutAct_9fa48("70342") ? [] : (stryCov_9fa48("70342"), ['operational_risk', 'market_risk', 'credit_risk', 'liquidity_risk', 'strategic_risk']),
  vetoThreshold: 75,
  canBlockAutomatic: stryMutAct_9fa48("70348") ? true : (stryCov_9fa48("70348"), false),
  requiresHumanOverride: stryMutAct_9fa48("70349") ? true : (stryCov_9fa48("70349"), false),
  description: 'Evaluates overall risk exposure and flags high-risk proposals for review.'
}), stryMutAct_9fa48("70351") ? {} : (stryCov_9fa48("70351"), {
  id: 'veto-legal',
  role: 'legal',
  name: 'Legal Counsel',
  title: 'General Counsel',
  avatar: '⚔️',
  jurisdiction: stryMutAct_9fa48("70357") ? [] : (stryCov_9fa48("70357"), ['contracts', 'liability', 'ip', 'employment_law', 'litigation_risk']),
  vetoThreshold: 70,
  canBlockAutomatic: stryMutAct_9fa48("70363") ? false : (stryCov_9fa48("70363"), true),
  requiresHumanOverride: stryMutAct_9fa48("70364") ? false : (stryCov_9fa48("70364"), true),
  description: 'Blocks proposals with legal liability, contract violations, or litigation risks.'
}), stryMutAct_9fa48("70366") ? {} : (stryCov_9fa48("70366"), {
  id: 'veto-finance',
  role: 'finance',
  name: 'Financial Guardian',
  title: 'Chief Financial Officer',
  avatar: '💰',
  jurisdiction: stryMutAct_9fa48("70372") ? [] : (stryCov_9fa48("70372"), ['budget', 'roi', 'cash_flow', 'audit', 'financial_controls']),
  vetoThreshold: 80,
  canBlockAutomatic: stryMutAct_9fa48("70378") ? true : (stryCov_9fa48("70378"), false),
  requiresHumanOverride: stryMutAct_9fa48("70379") ? true : (stryCov_9fa48("70379"), false),
  description: 'Reviews financial impact and flags proposals exceeding budget or ROI thresholds.'
})]);

// =============================================================================
// DEFAULT POLICIES
// =============================================================================

const DEFAULT_POLICIES: VetoPolicy[] = stryMutAct_9fa48("70381") ? [] : (stryCov_9fa48("70381"), [stryMutAct_9fa48("70382") ? {} : (stryCov_9fa48("70382"), {
  id: 'policy-security',
  name: 'Security Review Required',
  description: 'All proposals involving data, systems, or infrastructure must pass CISO review',
  triggerConditions: stryMutAct_9fa48("70386") ? [] : (stryCov_9fa48("70386"), [stryMutAct_9fa48("70387") ? {} : (stryCov_9fa48("70387"), {
    type: 'keyword',
    operator: 'contains',
    value: stryMutAct_9fa48("70390") ? [] : (stryCov_9fa48("70390"), ['data', 'system', 'api', 'database', 'cloud', 'server']),
    agentToNotify: 'ciso'
  }), stryMutAct_9fa48("70398") ? {} : (stryCov_9fa48("70398"), {
    type: 'category',
    operator: 'in',
    value: stryMutAct_9fa48("70401") ? [] : (stryCov_9fa48("70401"), ['infrastructure', 'data', 'integration']),
    agentToNotify: 'ciso'
  })]),
  requiredAgents: stryMutAct_9fa48("70406") ? [] : (stryCov_9fa48("70406"), ['ciso']),
  autoVetoThreshold: 85,
  escalationPath: stryMutAct_9fa48("70408") ? [] : (stryCov_9fa48("70408"), ['ciso', 'cto', 'ceo']),
  isActive: stryMutAct_9fa48("70412") ? false : (stryCov_9fa48("70412"), true),
  createdAt: new Date(),
  updatedAt: new Date()
}), stryMutAct_9fa48("70413") ? {} : (stryCov_9fa48("70413"), {
  id: 'policy-compliance',
  name: 'Regulatory Compliance Gate',
  description: 'Proposals affecting customer data or financial operations require compliance review',
  triggerConditions: stryMutAct_9fa48("70417") ? [] : (stryCov_9fa48("70417"), [stryMutAct_9fa48("70418") ? {} : (stryCov_9fa48("70418"), {
    type: 'keyword',
    operator: 'contains',
    value: stryMutAct_9fa48("70421") ? [] : (stryCov_9fa48("70421"), ['customer', 'pii', 'financial', 'payment', 'gdpr', 'hipaa']),
    agentToNotify: 'compliance'
  }), stryMutAct_9fa48("70429") ? {} : (stryCov_9fa48("70429"), {
    type: 'amount',
    operator: 'greater_than',
    value: 100000,
    agentToNotify: 'compliance'
  })]),
  requiredAgents: stryMutAct_9fa48("70433") ? [] : (stryCov_9fa48("70433"), ['compliance', 'legal']),
  autoVetoThreshold: 80,
  escalationPath: stryMutAct_9fa48("70436") ? [] : (stryCov_9fa48("70436"), ['compliance', 'legal', 'ceo']),
  isActive: stryMutAct_9fa48("70440") ? false : (stryCov_9fa48("70440"), true),
  createdAt: new Date(),
  updatedAt: new Date()
}), stryMutAct_9fa48("70441") ? {} : (stryCov_9fa48("70441"), {
  id: 'policy-ethics',
  name: 'Ethics Review Gate',
  description: 'AI/ML decisions and workforce changes require ethics review',
  triggerConditions: stryMutAct_9fa48("70445") ? [] : (stryCov_9fa48("70445"), [stryMutAct_9fa48("70446") ? {} : (stryCov_9fa48("70446"), {
    type: 'keyword',
    operator: 'contains',
    value: stryMutAct_9fa48("70449") ? [] : (stryCov_9fa48("70449"), ['ai', 'ml', 'algorithm', 'automation', 'layoff', 'termination']),
    agentToNotify: 'ethics'
  }), stryMutAct_9fa48("70457") ? {} : (stryCov_9fa48("70457"), {
    type: 'category',
    operator: 'in',
    value: stryMutAct_9fa48("70460") ? [] : (stryCov_9fa48("70460"), ['ai', 'hr', 'workforce']),
    agentToNotify: 'ethics'
  })]),
  requiredAgents: stryMutAct_9fa48("70465") ? [] : (stryCov_9fa48("70465"), ['ethics']),
  autoVetoThreshold: 70,
  escalationPath: stryMutAct_9fa48("70467") ? [] : (stryCov_9fa48("70467"), ['ethics', 'chro', 'ceo']),
  isActive: stryMutAct_9fa48("70471") ? false : (stryCov_9fa48("70471"), true),
  createdAt: new Date(),
  updatedAt: new Date()
}), stryMutAct_9fa48("70472") ? {} : (stryCov_9fa48("70472"), {
  id: 'policy-financial',
  name: 'Financial Approval Gate',
  description: 'High-value proposals require CFO review',
  triggerConditions: stryMutAct_9fa48("70476") ? [] : (stryCov_9fa48("70476"), [stryMutAct_9fa48("70477") ? {} : (stryCov_9fa48("70477"), {
    type: 'amount',
    operator: 'greater_than',
    value: 500000,
    agentToNotify: 'finance'
  }), stryMutAct_9fa48("70481") ? {} : (stryCov_9fa48("70481"), {
    type: 'keyword',
    operator: 'contains',
    value: stryMutAct_9fa48("70484") ? [] : (stryCov_9fa48("70484"), ['acquisition', 'merger', 'investment', 'budget']),
    agentToNotify: 'finance'
  })]),
  requiredAgents: stryMutAct_9fa48("70490") ? [] : (stryCov_9fa48("70490"), ['finance', 'risk']),
  autoVetoThreshold: 90,
  escalationPath: stryMutAct_9fa48("70493") ? [] : (stryCov_9fa48("70493"), ['finance', 'ceo', 'board']),
  isActive: stryMutAct_9fa48("70497") ? false : (stryCov_9fa48("70497"), true),
  createdAt: new Date(),
  updatedAt: new Date()
})]);

// =============================================================================
// STORAGE KEY
// =============================================================================

const STORAGE_KEY = 'datacendia_veto_service';

// =============================================================================
// VETO SERVICE
// =============================================================================

class VetoService {
  private decisions: Map<string, VetoDecision> = new Map();
  private policies: Map<string, VetoPolicy> = new Map();
  private ollamaAvailable: boolean = stryMutAct_9fa48("70499") ? true : (stryCov_9fa48("70499"), false);
  constructor() {
    this.loadFromStorage();
    this.checkOllamaStatus();

    // Initialize default policies if none exist
    if (stryMutAct_9fa48("70503") ? this.policies.size !== 0 : stryMutAct_9fa48("70502") ? false : stryMutAct_9fa48("70501") ? true : (stryCov_9fa48("70501", "70502", "70503"), this.policies.size === 0)) {
      DEFAULT_POLICIES.forEach(stryMutAct_9fa48("70505") ? () => undefined : (stryCov_9fa48("70505"), p => this.policies.set(p.id, p)));
      this.saveToStorage();
    }
  }
  private async checkOllamaStatus(): Promise<void> {
    try {
      this.ollamaAvailable = await ollamaService.checkAvailability();
    } catch {
      this.ollamaAvailable = stryMutAct_9fa48("70509") ? true : (stryCov_9fa48("70509"), false);
    }
  }
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stryMutAct_9fa48("70513") ? false : stryMutAct_9fa48("70512") ? true : (stryCov_9fa48("70512", "70513"), stored)) {
        const data = JSON.parse(stored);
        stryMutAct_9fa48("70515") ? data.decisions.forEach((d: VetoDecision) => {
          d.submittedAt = new Date(d.submittedAt);
          if (d.decidedAt) {
            d.decidedAt = new Date(d.decidedAt);
          }
          d.reviews.forEach(r => r.reviewedAt = new Date(r.reviewedAt));
          this.decisions.set(d.id, d);
        }) : (stryCov_9fa48("70515"), data.decisions?.forEach((d: VetoDecision) => {
          d.submittedAt = new Date(d.submittedAt);
          if (stryMutAct_9fa48("70518") ? false : stryMutAct_9fa48("70517") ? true : (stryCov_9fa48("70517", "70518"), d.decidedAt)) {
            d.decidedAt = new Date(d.decidedAt);
          }
          d.reviews.forEach(stryMutAct_9fa48("70520") ? () => undefined : (stryCov_9fa48("70520"), r => r.reviewedAt = new Date(r.reviewedAt)));
          this.decisions.set(d.id, d);
        }));
        stryMutAct_9fa48("70521") ? data.policies.forEach((p: VetoPolicy) => {
          p.createdAt = new Date(p.createdAt);
          p.updatedAt = new Date(p.updatedAt);
          this.policies.set(p.id, p);
        }) : (stryCov_9fa48("70521"), data.policies?.forEach((p: VetoPolicy) => {
          p.createdAt = new Date(p.createdAt);
          p.updatedAt = new Date(p.updatedAt);
          this.policies.set(p.id, p);
        }));
      }
    } catch (error) {
      console.error('Failed to load veto data from storage:', error);
    }
  }
  private saveToStorage(): void {
    try {
      const data = stryMutAct_9fa48("70527") ? {} : (stryCov_9fa48("70527"), {
        decisions: Array.from(this.decisions.values()),
        policies: Array.from(this.policies.values())
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save veto data to storage:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // AGENT RETRIEVAL
  // ---------------------------------------------------------------------------

  getVetoAgents(): VetoAgent[] {
    return VETO_AGENTS;
  }
  getVetoAgent(role: VetoAgentRole): VetoAgent | undefined {
    return VETO_AGENTS.find(stryMutAct_9fa48("70532") ? () => undefined : (stryCov_9fa48("70532"), a => stryMutAct_9fa48("70535") ? a.role !== role : stryMutAct_9fa48("70534") ? false : stryMutAct_9fa48("70533") ? true : (stryCov_9fa48("70533", "70534", "70535"), a.role === role)));
  }

  // ---------------------------------------------------------------------------
  // PROPOSAL SUBMISSION
  // ---------------------------------------------------------------------------

  async submitProposal(title: string, description: string, submittedBy: string, category?: string, amount?: number): Promise<VetoDecision> {
    const id = `veto-${Date.now()}-${stryMutAct_9fa48("70538") ? Math.random().toString(36) : (stryCov_9fa48("70538"), Math.random().toString(36).substr(2, 9))}`;

    // Determine which agents need to review based on policies
    const requiredAgents = this.determineRequiredAgents(title, description, category, amount);
    const decision: VetoDecision = stryMutAct_9fa48("70539") ? {} : (stryCov_9fa48("70539"), {
      id,
      proposalId: id,
      proposalTitle: title,
      proposalDescription: description,
      submittedBy,
      submittedAt: new Date(),
      status: 'pending',
      reviews: stryMutAct_9fa48("70541") ? ["Stryker was here"] : (stryCov_9fa48("70541"), [])
    });
    this.decisions.set(id, decision);

    // Automatically run reviews for required agents
    for (const agentRole of requiredAgents) {
      await this.runAgentReview(id, agentRole);
    }

    // Check if any automatic vetoes triggered
    this.evaluateDecision(id);
    this.saveToStorage();
    return this.decisions.get(id)!;
  }
  private determineRequiredAgents(title: string, description: string, category?: string, amount?: number): VetoAgentRole[] {
    const required = new Set<VetoAgentRole>();
    const text = stryMutAct_9fa48("70544") ? `${title} ${description}`.toUpperCase() : (stryCov_9fa48("70544"), `${title} ${description}`.toLowerCase());
    this.policies.forEach(policy => {
      if (stryMutAct_9fa48("70549") ? false : stryMutAct_9fa48("70548") ? true : stryMutAct_9fa48("70547") ? policy.isActive : (stryCov_9fa48("70547", "70548", "70549"), !policy.isActive)) {
        return;
      }
      for (const trigger of policy.triggerConditions) {
        let matches = stryMutAct_9fa48("70552") ? true : (stryCov_9fa48("70552"), false);
        switch (trigger.type) {
          case 'keyword':
            if (stryMutAct_9fa48("70553")) {} else {
              stryCov_9fa48("70553");
              if (stryMutAct_9fa48("70557") ? trigger.operator === 'contains' || Array.isArray(trigger.value) : stryMutAct_9fa48("70556") ? false : stryMutAct_9fa48("70555") ? true : (stryCov_9fa48("70555", "70556", "70557"), (stryMutAct_9fa48("70559") ? trigger.operator !== 'contains' : stryMutAct_9fa48("70558") ? true : (stryCov_9fa48("70558", "70559"), trigger.operator === 'contains')) && Array.isArray(trigger.value))) {
                matches = stryMutAct_9fa48("70562") ? trigger.value.every(kw => text.includes(kw.toLowerCase())) : (stryCov_9fa48("70562"), trigger.value.some(stryMutAct_9fa48("70563") ? () => undefined : (stryCov_9fa48("70563"), kw => text.includes(stryMutAct_9fa48("70564") ? kw.toUpperCase() : (stryCov_9fa48("70564"), kw.toLowerCase())))));
              }
              break;
            }
          case 'category':
            if (stryMutAct_9fa48("70565")) {} else {
              stryCov_9fa48("70565");
              if (stryMutAct_9fa48("70569") ? trigger.operator === 'in' && Array.isArray(trigger.value) || category : stryMutAct_9fa48("70568") ? false : stryMutAct_9fa48("70567") ? true : (stryCov_9fa48("70567", "70568", "70569"), (stryMutAct_9fa48("70571") ? trigger.operator === 'in' || Array.isArray(trigger.value) : stryMutAct_9fa48("70570") ? true : (stryCov_9fa48("70570", "70571"), (stryMutAct_9fa48("70573") ? trigger.operator !== 'in' : stryMutAct_9fa48("70572") ? true : (stryCov_9fa48("70572", "70573"), trigger.operator === 'in')) && Array.isArray(trigger.value))) && category)) {
                matches = trigger.value.includes(stryMutAct_9fa48("70576") ? category.toUpperCase() : (stryCov_9fa48("70576"), category.toLowerCase()));
              }
              break;
            }
          case 'amount':
            if (stryMutAct_9fa48("70577")) {} else {
              stryCov_9fa48("70577");
              if (stryMutAct_9fa48("70581") ? amount === undefined : stryMutAct_9fa48("70580") ? false : stryMutAct_9fa48("70579") ? true : (stryCov_9fa48("70579", "70580", "70581"), amount !== undefined)) {
                if (stryMutAct_9fa48("70585") ? trigger.operator === 'greater_than' || typeof trigger.value === 'number' : stryMutAct_9fa48("70584") ? false : stryMutAct_9fa48("70583") ? true : (stryCov_9fa48("70583", "70584", "70585"), (stryMutAct_9fa48("70587") ? trigger.operator !== 'greater_than' : stryMutAct_9fa48("70586") ? true : (stryCov_9fa48("70586", "70587"), trigger.operator === 'greater_than')) && (stryMutAct_9fa48("70590") ? typeof trigger.value !== 'number' : stryMutAct_9fa48("70589") ? true : (stryCov_9fa48("70589", "70590"), typeof trigger.value === 'number')))) {
                  matches = stryMutAct_9fa48("70596") ? amount <= trigger.value : stryMutAct_9fa48("70595") ? amount >= trigger.value : stryMutAct_9fa48("70594") ? false : stryMutAct_9fa48("70593") ? true : (stryCov_9fa48("70593", "70594", "70595", "70596"), amount > trigger.value);
                } else if (stryMutAct_9fa48("70599") ? trigger.operator === 'less_than' || typeof trigger.value === 'number' : stryMutAct_9fa48("70598") ? false : stryMutAct_9fa48("70597") ? true : (stryCov_9fa48("70597", "70598", "70599"), (stryMutAct_9fa48("70601") ? trigger.operator !== 'less_than' : stryMutAct_9fa48("70600") ? true : (stryCov_9fa48("70600", "70601"), trigger.operator === 'less_than')) && (stryMutAct_9fa48("70604") ? typeof trigger.value !== 'number' : stryMutAct_9fa48("70603") ? true : (stryCov_9fa48("70603", "70604"), typeof trigger.value === 'number')))) {
                  matches = stryMutAct_9fa48("70610") ? amount >= trigger.value : stryMutAct_9fa48("70609") ? amount <= trigger.value : stryMutAct_9fa48("70608") ? false : stryMutAct_9fa48("70607") ? true : (stryCov_9fa48("70607", "70608", "70609", "70610"), amount < trigger.value);
                }
              }
              break;
            }
        }
        if (stryMutAct_9fa48("70612") ? false : stryMutAct_9fa48("70611") ? true : (stryCov_9fa48("70611", "70612"), matches)) {
          required.add(trigger.agentToNotify);
        }
      }
    });

    // Always include at least risk assessment
    if (stryMutAct_9fa48("70616") ? required.size !== 0 : stryMutAct_9fa48("70615") ? false : stryMutAct_9fa48("70614") ? true : (stryCov_9fa48("70614", "70615", "70616"), required.size === 0)) {
      required.add('risk');
    }
    return Array.from(required);
  }

  // ---------------------------------------------------------------------------
  // AGENT REVIEW
  // ---------------------------------------------------------------------------

  async runAgentReview(decisionId: string, agentRole: VetoAgentRole): Promise<VetoReview> {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("70622") ? false : stryMutAct_9fa48("70621") ? true : stryMutAct_9fa48("70620") ? decision : (stryCov_9fa48("70620", "70621", "70622"), !decision)) {
      throw new Error('Decision not found');
    }
    const agent = this.getVetoAgent(agentRole);
    if (stryMutAct_9fa48("70627") ? false : stryMutAct_9fa48("70626") ? true : stryMutAct_9fa48("70625") ? agent : (stryCov_9fa48("70625", "70626", "70627"), !agent)) {
      throw new Error('Agent not found');
    }
    let review: VetoReview;
    if (stryMutAct_9fa48("70631") ? false : stryMutAct_9fa48("70630") ? true : (stryCov_9fa48("70630", "70631"), this.ollamaAvailable)) {
      review = await this.runOllamaReview(decision, agent);
    } else {
      review = this.runFallbackReview(decision, agent);
    }

    // Add review to decision
    decision.reviews.push(review);
    this.saveToStorage();
    return review;
  }
  private async runOllamaReview(decision: VetoDecision, agent: VetoAgent): Promise<VetoReview> {
    const prompt = `You are the ${agent.title} (${agent.name}) responsible for reviewing proposals.

Your jurisdiction includes: ${agent.jurisdiction.join(', ')}

Review this proposal and provide your assessment:

**Proposal Title:** ${decision.proposalTitle}
**Description:** ${decision.proposalDescription}

Analyze for risks in your jurisdiction. Respond in JSON format:
{
  "riskScore": <0-100>,
  "confidence": <0-100>,
  "status": "<approved|vetoed|conditional>",
  "reasoning": "<your detailed reasoning>",
  "concerns": [
    {
      "category": "<security_risk|compliance_violation|ethical_concern|financial_risk|legal_liability|regulatory_breach|reputational_damage|data_privacy|operational_risk|strategic_misalignment>",
      "severity": "<low|medium|high|critical>",
      "description": "<description of concern>",
      "mitigation": "<suggested mitigation>"
    }
  ],
  "conditions": ["<condition if conditional approval>"]
}`;
    try {
      const response = await ollamaService.generate(stryMutAct_9fa48("70638") ? {} : (stryCov_9fa48("70638"), {
        prompt,
        model: 'llama3.2:latest'
      }));
      const responseText = stryMutAct_9fa48("70642") ? response.response && '' : stryMutAct_9fa48("70641") ? false : stryMutAct_9fa48("70640") ? true : (stryCov_9fa48("70640", "70641", "70642"), response.response || '');
      const jsonMatch = responseText.match(stryMutAct_9fa48("70647") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("70646") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("70645") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("70644") ? /\{[\s\S]\}/ : (stryCov_9fa48("70644", "70645", "70646", "70647"), /\{[\s\S]*\}/));
      if (stryMutAct_9fa48("70649") ? false : stryMutAct_9fa48("70648") ? true : (stryCov_9fa48("70648", "70649"), jsonMatch)) {
        const parsed = JSON.parse(jsonMatch[0]);
        const isBlocking = stryMutAct_9fa48("70653") ? agent.canBlockAutomatic || parsed.riskScore >= agent.vetoThreshold : stryMutAct_9fa48("70652") ? false : stryMutAct_9fa48("70651") ? true : (stryCov_9fa48("70651", "70652", "70653"), agent.canBlockAutomatic && (stryMutAct_9fa48("70656") ? parsed.riskScore < agent.vetoThreshold : stryMutAct_9fa48("70655") ? parsed.riskScore > agent.vetoThreshold : stryMutAct_9fa48("70654") ? true : (stryCov_9fa48("70654", "70655", "70656"), parsed.riskScore >= agent.vetoThreshold)));
        return stryMutAct_9fa48("70657") ? {} : (stryCov_9fa48("70657"), {
          id: `review-${Date.now()}`,
          agentId: agent.id,
          agentRole: agent.role,
          status: isBlocking ? 'vetoed' : parsed.status,
          riskScore: parsed.riskScore,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
          concerns: parsed.concerns.map(stryMutAct_9fa48("70660") ? () => undefined : (stryCov_9fa48("70660"), (c: any, i: number) => stryMutAct_9fa48("70661") ? {} : (stryCov_9fa48("70661"), {
            id: `concern-${i}`,
            ...c
          }))),
          conditions: parsed.conditions,
          reviewedAt: new Date(),
          isBlocking
        });
      }
    } catch (error) {
      console.error('Ollama review failed:', error);
    }
    return this.runFallbackReview(decision, agent);
  }
  private runFallbackReview(decision: VetoDecision, agent: VetoAgent): VetoReview {
    const text = stryMutAct_9fa48("70666") ? `${decision.proposalTitle} ${decision.proposalDescription}`.toUpperCase() : (stryCov_9fa48("70666"), `${decision.proposalTitle} ${decision.proposalDescription}`.toLowerCase());

    // Intelligent fallback based on keywords
    const riskIndicators: {
      keyword: string;
      score: number;
      category: VetoReason;
    }[] = stryMutAct_9fa48("70668") ? [] : (stryCov_9fa48("70668"), [stryMutAct_9fa48("70669") ? {} : (stryCov_9fa48("70669"), {
      keyword: 'delete',
      score: 30,
      category: 'data_privacy'
    }), stryMutAct_9fa48("70672") ? {} : (stryCov_9fa48("70672"), {
      keyword: 'remove',
      score: 20,
      category: 'operational_risk'
    }), stryMutAct_9fa48("70675") ? {} : (stryCov_9fa48("70675"), {
      keyword: 'customer data',
      score: 40,
      category: 'data_privacy'
    }), stryMutAct_9fa48("70678") ? {} : (stryCov_9fa48("70678"), {
      keyword: 'pii',
      score: 50,
      category: 'compliance_violation'
    }), stryMutAct_9fa48("70681") ? {} : (stryCov_9fa48("70681"), {
      keyword: 'gdpr',
      score: 35,
      category: 'regulatory_breach'
    }), stryMutAct_9fa48("70684") ? {} : (stryCov_9fa48("70684"), {
      keyword: 'layoff',
      score: 45,
      category: 'ethical_concern'
    }), stryMutAct_9fa48("70687") ? {} : (stryCov_9fa48("70687"), {
      keyword: 'terminate',
      score: 40,
      category: 'legal_liability'
    }), stryMutAct_9fa48("70690") ? {} : (stryCov_9fa48("70690"), {
      keyword: 'acquisition',
      score: 35,
      category: 'financial_risk'
    }), stryMutAct_9fa48("70693") ? {} : (stryCov_9fa48("70693"), {
      keyword: 'ai',
      score: 25,
      category: 'ethical_concern'
    }), stryMutAct_9fa48("70696") ? {} : (stryCov_9fa48("70696"), {
      keyword: 'automation',
      score: 20,
      category: 'operational_risk'
    }), stryMutAct_9fa48("70699") ? {} : (stryCov_9fa48("70699"), {
      keyword: 'security',
      score: 30,
      category: 'security_risk'
    }), stryMutAct_9fa48("70702") ? {} : (stryCov_9fa48("70702"), {
      keyword: 'password',
      score: 35,
      category: 'security_risk'
    }), stryMutAct_9fa48("70705") ? {} : (stryCov_9fa48("70705"), {
      keyword: 'encrypt',
      score: 25,
      category: 'security_risk'
    }), stryMutAct_9fa48("70708") ? {} : (stryCov_9fa48("70708"), {
      keyword: 'public',
      score: 20,
      category: 'reputational_damage'
    }), stryMutAct_9fa48("70711") ? {} : (stryCov_9fa48("70711"), {
      keyword: 'media',
      score: 25,
      category: 'reputational_damage'
    })]);
    let riskScore = 20; // Base risk
    const concerns: VetoConcern[] = stryMutAct_9fa48("70714") ? ["Stryker was here"] : (stryCov_9fa48("70714"), []);
    riskIndicators.forEach((indicator, i) => {
      if (stryMutAct_9fa48("70717") ? false : stryMutAct_9fa48("70716") ? true : (stryCov_9fa48("70716", "70717"), text.includes(indicator.keyword))) {
        stryMutAct_9fa48("70719") ? riskScore -= indicator.score : (stryCov_9fa48("70719"), riskScore += indicator.score);
        if (stryMutAct_9fa48("70722") ? agent.jurisdiction.every(j => indicator.category.includes(j) || j.includes(indicator.category.split('_')[0])) : stryMutAct_9fa48("70721") ? false : stryMutAct_9fa48("70720") ? true : (stryCov_9fa48("70720", "70721", "70722"), agent.jurisdiction.some(stryMutAct_9fa48("70723") ? () => undefined : (stryCov_9fa48("70723"), j => stryMutAct_9fa48("70726") ? indicator.category.includes(j) && j.includes(indicator.category.split('_')[0]) : stryMutAct_9fa48("70725") ? false : stryMutAct_9fa48("70724") ? true : (stryCov_9fa48("70724", "70725", "70726"), indicator.category.includes(j) || j.includes(indicator.category.split('_')[0])))))) {
          concerns.push(stryMutAct_9fa48("70729") ? {} : (stryCov_9fa48("70729"), {
            id: `concern-${i}`,
            category: indicator.category,
            severity: (stryMutAct_9fa48("70734") ? indicator.score <= 35 : stryMutAct_9fa48("70733") ? indicator.score >= 35 : stryMutAct_9fa48("70732") ? false : stryMutAct_9fa48("70731") ? true : (stryCov_9fa48("70731", "70732", "70733", "70734"), indicator.score > 35)) ? 'high' : (stryMutAct_9fa48("70739") ? indicator.score <= 25 : stryMutAct_9fa48("70738") ? indicator.score >= 25 : stryMutAct_9fa48("70737") ? false : stryMutAct_9fa48("70736") ? true : (stryCov_9fa48("70736", "70737", "70738", "70739"), indicator.score > 25)) ? 'medium' : 'low',
            description: `Detected "${indicator.keyword}" which may indicate ${indicator.category.replace(/_/g, ' ')}`,
            mitigation: `Review and address ${indicator.category.replace(/_/g, ' ')} before proceeding`
          }));
        }
      }
    });
    riskScore = stryMutAct_9fa48("70746") ? Math.max(100, riskScore) : (stryCov_9fa48("70746"), Math.min(100, riskScore));
    const isBlocking = stryMutAct_9fa48("70749") ? agent.canBlockAutomatic || riskScore >= agent.vetoThreshold : stryMutAct_9fa48("70748") ? false : stryMutAct_9fa48("70747") ? true : (stryCov_9fa48("70747", "70748", "70749"), agent.canBlockAutomatic && (stryMutAct_9fa48("70752") ? riskScore < agent.vetoThreshold : stryMutAct_9fa48("70751") ? riskScore > agent.vetoThreshold : stryMutAct_9fa48("70750") ? true : (stryCov_9fa48("70750", "70751", "70752"), riskScore >= agent.vetoThreshold)));
    return stryMutAct_9fa48("70753") ? {} : (stryCov_9fa48("70753"), {
      id: `review-${Date.now()}`,
      agentId: agent.id,
      agentRole: agent.role,
      status: isBlocking ? 'vetoed' : (stryMutAct_9fa48("70759") ? riskScore < 50 : stryMutAct_9fa48("70758") ? riskScore > 50 : stryMutAct_9fa48("70757") ? false : stryMutAct_9fa48("70756") ? true : (stryCov_9fa48("70756", "70757", "70758", "70759"), riskScore >= 50)) ? 'conditional' : 'approved',
      riskScore,
      confidence: 70,
      reasoning: `${agent.name} reviewed this proposal. Risk score: ${riskScore}/100. ${concerns.length} concerns identified within ${agent.role} jurisdiction.`,
      concerns,
      conditions: (stryMutAct_9fa48("70766") ? riskScore < 50 : stryMutAct_9fa48("70765") ? riskScore > 50 : stryMutAct_9fa48("70764") ? false : stryMutAct_9fa48("70763") ? true : (stryCov_9fa48("70763", "70764", "70765", "70766"), riskScore >= 50)) ? stryMutAct_9fa48("70767") ? [] : (stryCov_9fa48("70767"), ['Requires additional documentation', 'Stakeholder sign-off recommended']) : undefined,
      reviewedAt: new Date(),
      isBlocking
    });
  }

  // ---------------------------------------------------------------------------
  // DECISION EVALUATION
  // ---------------------------------------------------------------------------

  private evaluateDecision(decisionId: string): void {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("70773") ? false : stryMutAct_9fa48("70772") ? true : stryMutAct_9fa48("70771") ? decision : (stryCov_9fa48("70771", "70772", "70773"), !decision)) {
      return;
    }

    // Check if any blocking review exists
    const blockingReview = decision.reviews.find(stryMutAct_9fa48("70775") ? () => undefined : (stryCov_9fa48("70775"), r => stryMutAct_9fa48("70778") ? r.isBlocking || r.status === 'vetoed' : stryMutAct_9fa48("70777") ? false : stryMutAct_9fa48("70776") ? true : (stryCov_9fa48("70776", "70777", "70778"), r.isBlocking && (stryMutAct_9fa48("70780") ? r.status !== 'vetoed' : stryMutAct_9fa48("70779") ? true : (stryCov_9fa48("70779", "70780"), r.status === 'vetoed')))));
    if (stryMutAct_9fa48("70783") ? false : stryMutAct_9fa48("70782") ? true : (stryCov_9fa48("70782", "70783"), blockingReview)) {
      decision.status = 'vetoed';
      decision.finalDecision = 'vetoed';
      decision.decidedAt = new Date();
      decision.decidedBy = blockingReview.agentRole;
    } else if (stryMutAct_9fa48("70789") ? decision.reviews.some(r => r.status === 'approved') : stryMutAct_9fa48("70788") ? false : stryMutAct_9fa48("70787") ? true : (stryCov_9fa48("70787", "70788", "70789"), decision.reviews.every(stryMutAct_9fa48("70790") ? () => undefined : (stryCov_9fa48("70790"), r => stryMutAct_9fa48("70793") ? r.status !== 'approved' : stryMutAct_9fa48("70792") ? false : stryMutAct_9fa48("70791") ? true : (stryCov_9fa48("70791", "70792", "70793"), r.status === 'approved'))))) {
      decision.status = 'approved';
      decision.finalDecision = 'approved';
      decision.decidedAt = new Date();
      decision.decidedBy = 'system';
    }
    this.saveToStorage();
  }

  // ---------------------------------------------------------------------------
  // OVERRIDE WORKFLOW
  // ---------------------------------------------------------------------------

  requestOverride(decisionId: string, requestedBy: string, reason: string): VetoDecision | null {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("70802") ? !decision && decision.status !== 'vetoed' : stryMutAct_9fa48("70801") ? false : stryMutAct_9fa48("70800") ? true : (stryCov_9fa48("70800", "70801", "70802"), (stryMutAct_9fa48("70803") ? decision : (stryCov_9fa48("70803"), !decision)) || (stryMutAct_9fa48("70805") ? decision.status === 'vetoed' : stryMutAct_9fa48("70804") ? false : (stryCov_9fa48("70804", "70805"), decision.status !== 'vetoed')))) {
      return null;
    }
    decision.status = 'override_requested';
    decision.overrideRequested = stryMutAct_9fa48("70809") ? false : (stryCov_9fa48("70809"), true);
    decision.overrideRequestedBy = requestedBy;
    decision.overrideReason = reason;
    this.saveToStorage();
    return decision;
  }
  approveOverride(decisionId: string, approvedBy: string): VetoDecision | null {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("70813") ? !decision && decision.status !== 'override_requested' : stryMutAct_9fa48("70812") ? false : stryMutAct_9fa48("70811") ? true : (stryCov_9fa48("70811", "70812", "70813"), (stryMutAct_9fa48("70814") ? decision : (stryCov_9fa48("70814"), !decision)) || (stryMutAct_9fa48("70816") ? decision.status === 'override_requested' : stryMutAct_9fa48("70815") ? false : (stryCov_9fa48("70815", "70816"), decision.status !== 'override_requested')))) {
      return null;
    }
    decision.status = 'approved';
    decision.finalDecision = 'approved';
    decision.overrideApproved = stryMutAct_9fa48("70821") ? false : (stryCov_9fa48("70821"), true);
    decision.overrideApprovedBy = approvedBy;
    decision.decidedAt = new Date();
    decision.decidedBy = approvedBy;
    this.saveToStorage();
    return decision;
  }
  denyOverride(decisionId: string): VetoDecision | null {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("70825") ? !decision && decision.status !== 'override_requested' : stryMutAct_9fa48("70824") ? false : stryMutAct_9fa48("70823") ? true : (stryCov_9fa48("70823", "70824", "70825"), (stryMutAct_9fa48("70826") ? decision : (stryCov_9fa48("70826"), !decision)) || (stryMutAct_9fa48("70828") ? decision.status === 'override_requested' : stryMutAct_9fa48("70827") ? false : (stryCov_9fa48("70827", "70828"), decision.status !== 'override_requested')))) {
      return null;
    }
    decision.status = 'vetoed';
    decision.overrideApproved = stryMutAct_9fa48("70832") ? true : (stryCov_9fa48("70832"), false);
    this.saveToStorage();
    return decision;
  }

  // ---------------------------------------------------------------------------
  // DATA ACCESS
  // ---------------------------------------------------------------------------

  getDecision(id: string): VetoDecision | undefined {
    return this.decisions.get(id);
  }
  getAllDecisions(): VetoDecision[] {
    return stryMutAct_9fa48("70835") ? Array.from(this.decisions.values()) : (stryCov_9fa48("70835"), Array.from(this.decisions.values()).sort(stryMutAct_9fa48("70836") ? () => undefined : (stryCov_9fa48("70836"), (a, b) => stryMutAct_9fa48("70837") ? b.submittedAt.getTime() + a.submittedAt.getTime() : (stryCov_9fa48("70837"), b.submittedAt.getTime() - a.submittedAt.getTime()))));
  }
  getPendingDecisions(): VetoDecision[] {
    return stryMutAct_9fa48("70839") ? this.getAllDecisions() : (stryCov_9fa48("70839"), this.getAllDecisions().filter(stryMutAct_9fa48("70840") ? () => undefined : (stryCov_9fa48("70840"), d => stryMutAct_9fa48("70843") ? d.status === 'pending' && d.status === 'override_requested' : stryMutAct_9fa48("70842") ? false : stryMutAct_9fa48("70841") ? true : (stryCov_9fa48("70841", "70842", "70843"), (stryMutAct_9fa48("70845") ? d.status !== 'pending' : stryMutAct_9fa48("70844") ? false : (stryCov_9fa48("70844", "70845"), d.status === 'pending')) || (stryMutAct_9fa48("70848") ? d.status !== 'override_requested' : stryMutAct_9fa48("70847") ? false : (stryCov_9fa48("70847", "70848"), d.status === 'override_requested'))))));
  }
  getVetoedDecisions(): VetoDecision[] {
    return stryMutAct_9fa48("70851") ? this.getAllDecisions() : (stryCov_9fa48("70851"), this.getAllDecisions().filter(stryMutAct_9fa48("70852") ? () => undefined : (stryCov_9fa48("70852"), d => stryMutAct_9fa48("70855") ? d.finalDecision !== 'vetoed' : stryMutAct_9fa48("70854") ? false : stryMutAct_9fa48("70853") ? true : (stryCov_9fa48("70853", "70854", "70855"), d.finalDecision === 'vetoed'))));
  }

  // ---------------------------------------------------------------------------
  // POLICIES
  // ---------------------------------------------------------------------------

  getPolicies(): VetoPolicy[] {
    return Array.from(this.policies.values());
  }
  createPolicy(policy: Omit<VetoPolicy, 'id' | 'createdAt' | 'updatedAt'>): VetoPolicy {
    const id = `policy-${Date.now()}`;
    const newPolicy: VetoPolicy = stryMutAct_9fa48("70860") ? {} : (stryCov_9fa48("70860"), {
      ...policy,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.policies.set(id, newPolicy);
    this.saveToStorage();
    return newPolicy;
  }
  togglePolicy(policyId: string): VetoPolicy | null {
    const policy = this.policies.get(policyId);
    if (stryMutAct_9fa48("70864") ? false : stryMutAct_9fa48("70863") ? true : stryMutAct_9fa48("70862") ? policy : (stryCov_9fa48("70862", "70863", "70864"), !policy)) {
      return null;
    }
    policy.isActive = stryMutAct_9fa48("70866") ? policy.isActive : (stryCov_9fa48("70866"), !policy.isActive);
    policy.updatedAt = new Date();
    this.saveToStorage();
    return policy;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): VetoMetrics {
    const decisions = this.getAllDecisions();
    const vetosByAgent: Record<VetoAgentRole, number> = stryMutAct_9fa48("70868") ? {} : (stryCov_9fa48("70868"), {
      ciso: 0,
      ethics: 0,
      compliance: 0,
      risk: 0,
      legal: 0,
      finance: 0
    });
    const vetosByReason: Record<VetoReason, number> = stryMutAct_9fa48("70869") ? {} : (stryCov_9fa48("70869"), {
      security_risk: 0,
      compliance_violation: 0,
      ethical_concern: 0,
      financial_risk: 0,
      legal_liability: 0,
      regulatory_breach: 0,
      reputational_damage: 0,
      data_privacy: 0,
      operational_risk: 0,
      strategic_misalignment: 0
    });
    decisions.forEach(d => {
      if (stryMutAct_9fa48("70873") ? d.finalDecision !== 'vetoed' : stryMutAct_9fa48("70872") ? false : stryMutAct_9fa48("70871") ? true : (stryCov_9fa48("70871", "70872", "70873"), d.finalDecision === 'vetoed')) {
        const blockingReview = d.reviews.find(stryMutAct_9fa48("70876") ? () => undefined : (stryCov_9fa48("70876"), r => r.isBlocking));
        if (stryMutAct_9fa48("70878") ? false : stryMutAct_9fa48("70877") ? true : (stryCov_9fa48("70877", "70878"), blockingReview)) {
          stryMutAct_9fa48("70880") ? vetosByAgent[blockingReview.agentRole]-- : (stryCov_9fa48("70880"), vetosByAgent[blockingReview.agentRole]++);
          blockingReview.concerns.forEach(c => {
            if (stryMutAct_9fa48("70884") ? vetosByReason[c.category] === undefined : stryMutAct_9fa48("70883") ? false : stryMutAct_9fa48("70882") ? true : (stryCov_9fa48("70882", "70883", "70884"), vetosByReason[c.category] !== undefined)) {
              stryMutAct_9fa48("70886") ? vetosByReason[c.category]-- : (stryCov_9fa48("70886"), vetosByReason[c.category]++);
            }
          });
        }
      }
    });
    const riskScores = decisions.flatMap(stryMutAct_9fa48("70887") ? () => undefined : (stryCov_9fa48("70887"), d => d.reviews.map(stryMutAct_9fa48("70888") ? () => undefined : (stryCov_9fa48("70888"), r => r.riskScore))));
    const riskDistribution = stryMutAct_9fa48("70889") ? [] : (stryCov_9fa48("70889"), [stryMutAct_9fa48("70890") ? {} : (stryCov_9fa48("70890"), {
      range: '0-25',
      count: stryMutAct_9fa48("70892") ? riskScores.length : (stryCov_9fa48("70892"), riskScores.filter(stryMutAct_9fa48("70893") ? () => undefined : (stryCov_9fa48("70893"), s => stryMutAct_9fa48("70897") ? s > 25 : stryMutAct_9fa48("70896") ? s < 25 : stryMutAct_9fa48("70895") ? false : stryMutAct_9fa48("70894") ? true : (stryCov_9fa48("70894", "70895", "70896", "70897"), s <= 25))).length)
    }), stryMutAct_9fa48("70898") ? {} : (stryCov_9fa48("70898"), {
      range: '26-50',
      count: stryMutAct_9fa48("70900") ? riskScores.length : (stryCov_9fa48("70900"), riskScores.filter(stryMutAct_9fa48("70901") ? () => undefined : (stryCov_9fa48("70901"), s => stryMutAct_9fa48("70904") ? s > 25 || s <= 50 : stryMutAct_9fa48("70903") ? false : stryMutAct_9fa48("70902") ? true : (stryCov_9fa48("70902", "70903", "70904"), (stryMutAct_9fa48("70907") ? s <= 25 : stryMutAct_9fa48("70906") ? s >= 25 : stryMutAct_9fa48("70905") ? true : (stryCov_9fa48("70905", "70906", "70907"), s > 25)) && (stryMutAct_9fa48("70910") ? s > 50 : stryMutAct_9fa48("70909") ? s < 50 : stryMutAct_9fa48("70908") ? true : (stryCov_9fa48("70908", "70909", "70910"), s <= 50))))).length)
    }), stryMutAct_9fa48("70911") ? {} : (stryCov_9fa48("70911"), {
      range: '51-75',
      count: stryMutAct_9fa48("70913") ? riskScores.length : (stryCov_9fa48("70913"), riskScores.filter(stryMutAct_9fa48("70914") ? () => undefined : (stryCov_9fa48("70914"), s => stryMutAct_9fa48("70917") ? s > 50 || s <= 75 : stryMutAct_9fa48("70916") ? false : stryMutAct_9fa48("70915") ? true : (stryCov_9fa48("70915", "70916", "70917"), (stryMutAct_9fa48("70920") ? s <= 50 : stryMutAct_9fa48("70919") ? s >= 50 : stryMutAct_9fa48("70918") ? true : (stryCov_9fa48("70918", "70919", "70920"), s > 50)) && (stryMutAct_9fa48("70923") ? s > 75 : stryMutAct_9fa48("70922") ? s < 75 : stryMutAct_9fa48("70921") ? true : (stryCov_9fa48("70921", "70922", "70923"), s <= 75))))).length)
    }), stryMutAct_9fa48("70924") ? {} : (stryCov_9fa48("70924"), {
      range: '76-100',
      count: stryMutAct_9fa48("70926") ? riskScores.length : (stryCov_9fa48("70926"), riskScores.filter(stryMutAct_9fa48("70927") ? () => undefined : (stryCov_9fa48("70927"), s => stryMutAct_9fa48("70931") ? s <= 75 : stryMutAct_9fa48("70930") ? s >= 75 : stryMutAct_9fa48("70929") ? false : stryMutAct_9fa48("70928") ? true : (stryCov_9fa48("70928", "70929", "70930", "70931"), s > 75))).length)
    })]);
    const reviewTimes = stryMutAct_9fa48("70932") ? decisions.map(d => (d.decidedAt!.getTime() - d.submittedAt.getTime()) / (1000 * 60 * 60)) : (stryCov_9fa48("70932"), decisions.filter(stryMutAct_9fa48("70933") ? () => undefined : (stryCov_9fa48("70933"), d => d.decidedAt)).map(stryMutAct_9fa48("70934") ? () => undefined : (stryCov_9fa48("70934"), d => stryMutAct_9fa48("70935") ? (d.decidedAt!.getTime() - d.submittedAt.getTime()) * (1000 * 60 * 60) : (stryCov_9fa48("70935"), (stryMutAct_9fa48("70936") ? d.decidedAt!.getTime() + d.submittedAt.getTime() : (stryCov_9fa48("70936"), d.decidedAt!.getTime() - d.submittedAt.getTime())) / (stryMutAct_9fa48("70937") ? 1000 * 60 / 60 : (stryCov_9fa48("70937"), (stryMutAct_9fa48("70938") ? 1000 / 60 : (stryCov_9fa48("70938"), 1000 * 60)) * 60))))));
    const avgReviewTime = (stryMutAct_9fa48("70942") ? reviewTimes.length <= 0 : stryMutAct_9fa48("70941") ? reviewTimes.length >= 0 : stryMutAct_9fa48("70940") ? false : stryMutAct_9fa48("70939") ? true : (stryCov_9fa48("70939", "70940", "70941", "70942"), reviewTimes.length > 0)) ? stryMutAct_9fa48("70943") ? reviewTimes.reduce((a, b) => a + b, 0) * reviewTimes.length : (stryCov_9fa48("70943"), reviewTimes.reduce(stryMutAct_9fa48("70944") ? () => undefined : (stryCov_9fa48("70944"), (a, b) => stryMutAct_9fa48("70945") ? a - b : (stryCov_9fa48("70945"), a + b)), 0) / reviewTimes.length) : 0;
    return stryMutAct_9fa48("70946") ? {} : (stryCov_9fa48("70946"), {
      totalProposals: decisions.length,
      approvedProposals: stryMutAct_9fa48("70947") ? decisions.length : (stryCov_9fa48("70947"), decisions.filter(stryMutAct_9fa48("70948") ? () => undefined : (stryCov_9fa48("70948"), d => stryMutAct_9fa48("70951") ? d.finalDecision !== 'approved' : stryMutAct_9fa48("70950") ? false : stryMutAct_9fa48("70949") ? true : (stryCov_9fa48("70949", "70950", "70951"), d.finalDecision === 'approved'))).length),
      vetoedProposals: stryMutAct_9fa48("70953") ? decisions.length : (stryCov_9fa48("70953"), decisions.filter(stryMutAct_9fa48("70954") ? () => undefined : (stryCov_9fa48("70954"), d => stryMutAct_9fa48("70957") ? d.finalDecision !== 'vetoed' : stryMutAct_9fa48("70956") ? false : stryMutAct_9fa48("70955") ? true : (stryCov_9fa48("70955", "70956", "70957"), d.finalDecision === 'vetoed'))).length),
      pendingProposals: stryMutAct_9fa48("70959") ? decisions.length : (stryCov_9fa48("70959"), decisions.filter(stryMutAct_9fa48("70960") ? () => undefined : (stryCov_9fa48("70960"), d => stryMutAct_9fa48("70963") ? d.status !== 'pending' : stryMutAct_9fa48("70962") ? false : stryMutAct_9fa48("70961") ? true : (stryCov_9fa48("70961", "70962", "70963"), d.status === 'pending'))).length),
      overrideRequests: stryMutAct_9fa48("70965") ? decisions.length : (stryCov_9fa48("70965"), decisions.filter(stryMutAct_9fa48("70966") ? () => undefined : (stryCov_9fa48("70966"), d => d.overrideRequested)).length),
      overridesApproved: stryMutAct_9fa48("70967") ? decisions.length : (stryCov_9fa48("70967"), decisions.filter(stryMutAct_9fa48("70968") ? () => undefined : (stryCov_9fa48("70968"), d => d.overrideApproved)).length),
      avgReviewTime,
      vetosByAgent,
      vetosByReason,
      riskScoreDistribution: riskDistribution
    });
  }

  // ---------------------------------------------------------------------------
  // OLLAMA STATUS
  // ---------------------------------------------------------------------------

  isOllamaAvailable(): boolean {
    return this.ollamaAvailable;
  }
  async refreshOllamaStatus(): Promise<boolean> {
    await this.checkOllamaStatus();
    return this.ollamaAvailable;
  }
}

// Singleton
export const vetoService = new VetoService();
export default vetoService;