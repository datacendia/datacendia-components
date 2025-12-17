// @ts-nocheck
// =============================================================================
// CENDIA LEDGER™ — IMMUTABLE DECISION BLOCKCHAIN
// First AI decision provenance for regulatory audit
// Every Council deliberation, vote, veto, and confidence score recorded
// =============================================================================

// =============================================================================
// TYPES
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
export type LedgerEventType = 'decision.proposed' | 'decision.deliberated' | 'decision.voted' | 'decision.vetoed' | 'decision.approved' | 'decision.executed' | 'decision.outcome_recorded' | 'agent.joined' | 'agent.contributed' | 'agent.voted' | 'agent.vetoed' | 'confidence.updated' | 'evidence.attached' | 'audit.requested' | 'audit.completed' | 'compliance.check' | 'override.requested' | 'override.approved' | 'override.denied';
export type ComplianceFramework = 'GDPR' | 'SOX' | 'HIPAA' | 'PCI-DSS' | 'ISO27001' | 'SOC2' | 'CCPA' | 'NIST';
export interface LedgerEntry {
  id: string;
  sequence: number;
  timestamp: Date;
  eventType: LedgerEventType;

  // Entity references
  decisionId: string;
  organizationId: string;
  userId?: string;
  agentId?: string;

  // Event data
  title: string;
  description: string;
  data: Record<string, any>;

  // Confidence & voting
  confidenceScore?: number;
  vote?: 'approve' | 'reject' | 'abstain' | 'veto';
  voteWeight?: number;

  // Chain integrity
  previousHash: string;
  hash: string;
  signature?: string;

  // Compliance
  complianceFrameworks: ComplianceFramework[];
  retentionPeriodDays: number;
  sensitivityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  piiInvolved: boolean;

  // Verification
  verified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}
export interface DecisionRecord {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  proposedAt: Date;
  status: 'proposed' | 'deliberating' | 'voting' | 'approved' | 'rejected' | 'vetoed' | 'executed';

  // Participants
  agents: string[];
  voters: {
    agentId: string;
    vote: string;
    confidence: number;
    timestamp: Date;
  }[];

  // Outcome
  finalConfidence?: number;
  outcome?: string;
  outcomeRecordedAt?: Date;

  // Ledger
  ledgerEntries: string[]; // Entry IDs
  firstEntryHash: string;
  latestEntryHash: string;

  // Compliance
  complianceStatus: 'pending' | 'compliant' | 'review_needed' | 'violation';
  auditHistory: AuditRecord[];
}
export interface AuditRecord {
  id: string;
  requestedAt: Date;
  requestedBy: string;
  reason: string;
  framework: ComplianceFramework;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  findings: AuditFinding[];
  completedAt?: Date;
  report?: string;
}
export interface AuditFinding {
  id: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  remediation?: string;
  resolved: boolean;
}
export interface LedgerMetrics {
  totalEntries: number;
  totalDecisions: number;
  entriesByType: Record<LedgerEventType, number>;
  entriesByFramework: Record<ComplianceFramework, number>;
  averageConfidence: number;
  vetoRate: number;
  approvalRate: number;
  chainIntegrity: 'valid' | 'broken' | 'unknown';
  lastVerifiedAt?: Date;
  piiEntriesCount: number;
  pendingAudits: number;
}
export interface ChainVerificationResult {
  valid: boolean;
  entriesChecked: number;
  brokenAt?: number;
  brokenEntryId?: string;
  message: string;
}

// =============================================================================
// STORAGE KEY
// =============================================================================

const STORAGE_KEY = 'datacendia_ledger_service';

// =============================================================================
// HASH FUNCTION
// =============================================================================

function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; stryMutAct_9fa48("68646") ? i >= data.length : stryMutAct_9fa48("68645") ? i <= data.length : stryMutAct_9fa48("68644") ? false : (stryCov_9fa48("68644", "68645", "68646"), i < data.length); stryMutAct_9fa48("68647") ? i-- : (stryCov_9fa48("68647"), i++)) {
    const char = data.charCodeAt(i);
    hash = stryMutAct_9fa48("68649") ? (hash << 5) - hash - char : (stryCov_9fa48("68649"), (stryMutAct_9fa48("68650") ? (hash << 5) + hash : (stryCov_9fa48("68650"), (hash << 5) - hash)) + char);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}
function createEntryHash(entry: Omit<LedgerEntry, 'hash'>): string {
  const data = JSON.stringify(stryMutAct_9fa48("68653") ? {} : (stryCov_9fa48("68653"), {
    id: entry.id,
    sequence: entry.sequence,
    timestamp: entry.timestamp.toISOString(),
    eventType: entry.eventType,
    decisionId: entry.decisionId,
    previousHash: entry.previousHash,
    data: entry.data
  }));
  return generateHash(data);
}

// =============================================================================
// LEDGER SERVICE
// =============================================================================

class LedgerService {
  private entries: Map<string, LedgerEntry> = new Map();
  private decisions: Map<string, DecisionRecord> = new Map();
  private sequence: number = 0;
  private genesisHash: string = '0000000000000000';
  constructor() {
    this.loadFromStorage();
  }
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stryMutAct_9fa48("68659") ? false : stryMutAct_9fa48("68658") ? true : (stryCov_9fa48("68658", "68659"), stored)) {
        const data = JSON.parse(stored);
        this.sequence = stryMutAct_9fa48("68663") ? data.sequence && 0 : stryMutAct_9fa48("68662") ? false : stryMutAct_9fa48("68661") ? true : (stryCov_9fa48("68661", "68662", "68663"), data.sequence || 0);
        stryMutAct_9fa48("68664") ? data.entries.forEach((e: LedgerEntry) => {
          e.timestamp = new Date(e.timestamp);
          if (e.verifiedAt) {
            e.verifiedAt = new Date(e.verifiedAt);
          }
          this.entries.set(e.id, e);
        }) : (stryCov_9fa48("68664"), data.entries?.forEach((e: LedgerEntry) => {
          e.timestamp = new Date(e.timestamp);
          if (stryMutAct_9fa48("68667") ? false : stryMutAct_9fa48("68666") ? true : (stryCov_9fa48("68666", "68667"), e.verifiedAt)) {
            e.verifiedAt = new Date(e.verifiedAt);
          }
          this.entries.set(e.id, e);
        }));
        stryMutAct_9fa48("68669") ? data.decisions.forEach((d: DecisionRecord) => {
          d.proposedAt = new Date(d.proposedAt);
          if (d.outcomeRecordedAt) {
            d.outcomeRecordedAt = new Date(d.outcomeRecordedAt);
          }
          d.voters.forEach(v => v.timestamp = new Date(v.timestamp));
          d.auditHistory.forEach(a => {
            a.requestedAt = new Date(a.requestedAt);
            if (a.completedAt) {
              a.completedAt = new Date(a.completedAt);
            }
          });
          this.decisions.set(d.id, d);
        }) : (stryCov_9fa48("68669"), data.decisions?.forEach((d: DecisionRecord) => {
          d.proposedAt = new Date(d.proposedAt);
          if (stryMutAct_9fa48("68672") ? false : stryMutAct_9fa48("68671") ? true : (stryCov_9fa48("68671", "68672"), d.outcomeRecordedAt)) {
            d.outcomeRecordedAt = new Date(d.outcomeRecordedAt);
          }
          d.voters.forEach(stryMutAct_9fa48("68674") ? () => undefined : (stryCov_9fa48("68674"), v => v.timestamp = new Date(v.timestamp)));
          d.auditHistory.forEach(a => {
            a.requestedAt = new Date(a.requestedAt);
            if (stryMutAct_9fa48("68677") ? false : stryMutAct_9fa48("68676") ? true : (stryCov_9fa48("68676", "68677"), a.completedAt)) {
              a.completedAt = new Date(a.completedAt);
            }
          });
          this.decisions.set(d.id, d);
        }));
      }
    } catch (error) {
      console.error('Failed to load ledger data:', error);
    }
  }
  private saveToStorage(): void {
    try {
      const data = stryMutAct_9fa48("68683") ? {} : (stryCov_9fa48("68683"), {
        sequence: this.sequence,
        entries: Array.from(this.entries.values()),
        decisions: Array.from(this.decisions.values())
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save ledger data:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // ENTRY CREATION
  // ---------------------------------------------------------------------------

  private getLastHash(): string {
    if (stryMutAct_9fa48("68689") ? this.entries.size !== 0 : stryMutAct_9fa48("68688") ? false : stryMutAct_9fa48("68687") ? true : (stryCov_9fa48("68687", "68688", "68689"), this.entries.size === 0)) {
      return this.genesisHash;
    }
    const sortedEntries = stryMutAct_9fa48("68691") ? Array.from(this.entries.values()) : (stryCov_9fa48("68691"), Array.from(this.entries.values()).sort(stryMutAct_9fa48("68692") ? () => undefined : (stryCov_9fa48("68692"), (a, b) => stryMutAct_9fa48("68693") ? a.sequence + b.sequence : (stryCov_9fa48("68693"), a.sequence - b.sequence))));
    return sortedEntries[stryMutAct_9fa48("68694") ? sortedEntries.length + 1 : (stryCov_9fa48("68694"), sortedEntries.length - 1)].hash;
  }
  createEntry(eventType: LedgerEventType, decisionId: string, title: string, description: string, data: Record<string, any>, options: {
    organizationId?: string;
    userId?: string;
    agentId?: string;
    confidenceScore?: number;
    vote?: LedgerEntry['vote'];
    voteWeight?: number;
    complianceFrameworks?: ComplianceFramework[];
    sensitivityLevel?: LedgerEntry['sensitivityLevel'];
    piiInvolved?: boolean;
  } = {}): LedgerEntry {
    stryMutAct_9fa48("68696") ? this.sequence-- : (stryCov_9fa48("68696"), this.sequence++);
    const id = `entry-${Date.now()}-${this.sequence}`;
    const entryWithoutHash: Omit<LedgerEntry, 'hash'> = stryMutAct_9fa48("68698") ? {} : (stryCov_9fa48("68698"), {
      id,
      sequence: this.sequence,
      timestamp: new Date(),
      eventType,
      decisionId,
      organizationId: stryMutAct_9fa48("68701") ? options.organizationId && 'default' : stryMutAct_9fa48("68700") ? false : stryMutAct_9fa48("68699") ? true : (stryCov_9fa48("68699", "68700", "68701"), options.organizationId || 'default'),
      userId: options.userId,
      agentId: options.agentId,
      title,
      description,
      data,
      confidenceScore: options.confidenceScore,
      vote: options.vote,
      voteWeight: options.voteWeight,
      previousHash: this.getLastHash(),
      complianceFrameworks: stryMutAct_9fa48("68705") ? options.complianceFrameworks && [] : stryMutAct_9fa48("68704") ? false : stryMutAct_9fa48("68703") ? true : (stryCov_9fa48("68703", "68704", "68705"), options.complianceFrameworks || (stryMutAct_9fa48("68706") ? ["Stryker was here"] : (stryCov_9fa48("68706"), []))),
      retentionPeriodDays: 2555,
      // 7 years default
      sensitivityLevel: stryMutAct_9fa48("68709") ? options.sensitivityLevel && 'internal' : stryMutAct_9fa48("68708") ? false : stryMutAct_9fa48("68707") ? true : (stryCov_9fa48("68707", "68708", "68709"), options.sensitivityLevel || 'internal'),
      piiInvolved: stryMutAct_9fa48("68713") ? options.piiInvolved && false : stryMutAct_9fa48("68712") ? false : stryMutAct_9fa48("68711") ? true : (stryCov_9fa48("68711", "68712", "68713"), options.piiInvolved || (stryMutAct_9fa48("68714") ? true : (stryCov_9fa48("68714"), false))),
      verified: stryMutAct_9fa48("68715") ? true : (stryCov_9fa48("68715"), false)
    });
    const entry: LedgerEntry = stryMutAct_9fa48("68716") ? {} : (stryCov_9fa48("68716"), {
      ...entryWithoutHash,
      hash: createEntryHash(entryWithoutHash)
    });
    this.entries.set(id, entry);

    // Update decision record
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68718") ? false : stryMutAct_9fa48("68717") ? true : (stryCov_9fa48("68717", "68718"), decision)) {
      decision.ledgerEntries.push(id);
      decision.latestEntryHash = entry.hash;
    }
    this.saveToStorage();
    return entry;
  }

  // ---------------------------------------------------------------------------
  // DECISION MANAGEMENT
  // ---------------------------------------------------------------------------

  createDecision(title: string, description: string, proposedBy: string, agents: string[]): DecisionRecord {
    const id = `decision-${Date.now()}`;
    const decision: DecisionRecord = stryMutAct_9fa48("68722") ? {} : (stryCov_9fa48("68722"), {
      id,
      title,
      description,
      proposedBy,
      proposedAt: new Date(),
      status: 'proposed',
      agents,
      voters: stryMutAct_9fa48("68724") ? ["Stryker was here"] : (stryCov_9fa48("68724"), []),
      ledgerEntries: stryMutAct_9fa48("68725") ? ["Stryker was here"] : (stryCov_9fa48("68725"), []),
      firstEntryHash: '',
      latestEntryHash: '',
      complianceStatus: 'pending',
      auditHistory: stryMutAct_9fa48("68729") ? ["Stryker was here"] : (stryCov_9fa48("68729"), [])
    });
    this.decisions.set(id, decision);

    // Create initial ledger entry
    const entry = this.createEntry('decision.proposed', id, `Decision Proposed: ${title}`, description, stryMutAct_9fa48("68732") ? {} : (stryCov_9fa48("68732"), {
      proposedBy,
      agents
    }), stryMutAct_9fa48("68733") ? {} : (stryCov_9fa48("68733"), {
      userId: proposedBy
    }));
    decision.firstEntryHash = entry.hash;
    decision.latestEntryHash = entry.hash;
    this.saveToStorage();
    return decision;
  }
  recordDeliberation(decisionId: string, agentId: string, contribution: string, confidenceScore: number): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68737") ? false : stryMutAct_9fa48("68736") ? true : stryMutAct_9fa48("68735") ? decision : (stryCov_9fa48("68735", "68736", "68737"), !decision)) {
      throw new Error('Decision not found');
    }
    decision.status = 'deliberating';
    return this.createEntry('agent.contributed', decisionId, `Agent Contribution`, contribution, stryMutAct_9fa48("68743") ? {} : (stryCov_9fa48("68743"), {
      agentId,
      contribution
    }), stryMutAct_9fa48("68744") ? {} : (stryCov_9fa48("68744"), {
      agentId,
      confidenceScore
    }));
  }
  recordVote(decisionId: string, agentId: string, vote: 'approve' | 'reject' | 'abstain' | 'veto', confidence: number, reasoning: string): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68748") ? false : stryMutAct_9fa48("68747") ? true : stryMutAct_9fa48("68746") ? decision : (stryCov_9fa48("68746", "68747", "68748"), !decision)) {
      throw new Error('Decision not found');
    }
    decision.status = 'voting';
    decision.voters.push(stryMutAct_9fa48("68752") ? {} : (stryCov_9fa48("68752"), {
      agentId,
      vote,
      confidence,
      timestamp: new Date()
    }));
    const eventType: LedgerEventType = (stryMutAct_9fa48("68755") ? vote !== 'veto' : stryMutAct_9fa48("68754") ? false : stryMutAct_9fa48("68753") ? true : (stryCov_9fa48("68753", "68754", "68755"), vote === 'veto')) ? 'agent.vetoed' : 'agent.voted';
    return this.createEntry(eventType, decisionId, `Vote: ${stryMutAct_9fa48("68760") ? vote.toLowerCase() : (stryCov_9fa48("68760"), vote.toUpperCase())}`, reasoning, stryMutAct_9fa48("68761") ? {} : (stryCov_9fa48("68761"), {
      agentId,
      vote,
      confidence,
      reasoning
    }), stryMutAct_9fa48("68762") ? {} : (stryCov_9fa48("68762"), {
      agentId,
      vote,
      confidenceScore: confidence,
      voteWeight: 1
    }));
  }
  finalizeDecision(decisionId: string, status: 'approved' | 'rejected' | 'vetoed', finalConfidence: number): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68766") ? false : stryMutAct_9fa48("68765") ? true : stryMutAct_9fa48("68764") ? decision : (stryCov_9fa48("68764", "68765", "68766"), !decision)) {
      throw new Error('Decision not found');
    }
    decision.status = status;
    decision.finalConfidence = finalConfidence;
    const eventType: LedgerEventType = (stryMutAct_9fa48("68771") ? status !== 'vetoed' : stryMutAct_9fa48("68770") ? false : stryMutAct_9fa48("68769") ? true : (stryCov_9fa48("68769", "68770", "68771"), status === 'vetoed')) ? 'decision.vetoed' : (stryMutAct_9fa48("68776") ? status !== 'approved' : stryMutAct_9fa48("68775") ? false : stryMutAct_9fa48("68774") ? true : (stryCov_9fa48("68774", "68775", "68776"), status === 'approved')) ? 'decision.approved' : 'decision.voted';
    return this.createEntry(eventType, decisionId, `Decision ${stryMutAct_9fa48("68781") ? status.toLowerCase() : (stryCov_9fa48("68781"), status.toUpperCase())}`, `Final confidence: ${finalConfidence}%`, stryMutAct_9fa48("68783") ? {} : (stryCov_9fa48("68783"), {
      status,
      finalConfidence,
      voterSummary: decision.voters
    }), stryMutAct_9fa48("68784") ? {} : (stryCov_9fa48("68784"), {
      confidenceScore: finalConfidence
    }));
  }
  recordOutcome(decisionId: string, outcome: string, metrics?: Record<string, any>): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68788") ? false : stryMutAct_9fa48("68787") ? true : stryMutAct_9fa48("68786") ? decision : (stryCov_9fa48("68786", "68787", "68788"), !decision)) {
      throw new Error('Decision not found');
    }
    decision.outcome = outcome;
    decision.outcomeRecordedAt = new Date();
    return this.createEntry('decision.outcome_recorded', decisionId, 'Outcome Recorded', outcome, stryMutAct_9fa48("68793") ? {} : (stryCov_9fa48("68793"), {
      outcome,
      metrics
    }), {});
  }

  // ---------------------------------------------------------------------------
  // CHAIN VERIFICATION
  // ---------------------------------------------------------------------------

  verifyChain(): ChainVerificationResult {
    const sortedEntries = stryMutAct_9fa48("68795") ? Array.from(this.entries.values()) : (stryCov_9fa48("68795"), Array.from(this.entries.values()).sort(stryMutAct_9fa48("68796") ? () => undefined : (stryCov_9fa48("68796"), (a, b) => stryMutAct_9fa48("68797") ? a.sequence + b.sequence : (stryCov_9fa48("68797"), a.sequence - b.sequence))));
    if (stryMutAct_9fa48("68800") ? sortedEntries.length !== 0 : stryMutAct_9fa48("68799") ? false : stryMutAct_9fa48("68798") ? true : (stryCov_9fa48("68798", "68799", "68800"), sortedEntries.length === 0)) {
      return stryMutAct_9fa48("68802") ? {} : (stryCov_9fa48("68802"), {
        valid: stryMutAct_9fa48("68803") ? false : (stryCov_9fa48("68803"), true),
        entriesChecked: 0,
        message: 'Empty chain is valid'
      });
    }
    let previousHash = this.genesisHash;
    for (let i = 0; stryMutAct_9fa48("68807") ? i >= sortedEntries.length : stryMutAct_9fa48("68806") ? i <= sortedEntries.length : stryMutAct_9fa48("68805") ? false : (stryCov_9fa48("68805", "68806", "68807"), i < sortedEntries.length); stryMutAct_9fa48("68808") ? i-- : (stryCov_9fa48("68808"), i++)) {
      const entry = sortedEntries[i];

      // Verify previous hash link
      if (stryMutAct_9fa48("68812") ? entry.previousHash === previousHash : stryMutAct_9fa48("68811") ? false : stryMutAct_9fa48("68810") ? true : (stryCov_9fa48("68810", "68811", "68812"), entry.previousHash !== previousHash)) {
        return stryMutAct_9fa48("68814") ? {} : (stryCov_9fa48("68814"), {
          valid: stryMutAct_9fa48("68815") ? true : (stryCov_9fa48("68815"), false),
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: previousHash mismatch`
        });
      }

      // Verify entry hash
      const {
        hash: _,
        ...entryWithoutHash
      } = entry;
      const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);
      if (stryMutAct_9fa48("68819") ? entry.hash === expectedHash : stryMutAct_9fa48("68818") ? false : stryMutAct_9fa48("68817") ? true : (stryCov_9fa48("68817", "68818", "68819"), entry.hash !== expectedHash)) {
        return stryMutAct_9fa48("68821") ? {} : (stryCov_9fa48("68821"), {
          valid: stryMutAct_9fa48("68822") ? true : (stryCov_9fa48("68822"), false),
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: hash verification failed`
        });
      }
      previousHash = entry.hash;
    }
    return stryMutAct_9fa48("68824") ? {} : (stryCov_9fa48("68824"), {
      valid: stryMutAct_9fa48("68825") ? false : (stryCov_9fa48("68825"), true),
      entriesChecked: sortedEntries.length,
      message: `All ${sortedEntries.length} entries verified successfully`
    });
  }
  verifyEntry(entryId: string): boolean {
    const entry = this.entries.get(entryId);
    if (stryMutAct_9fa48("68830") ? false : stryMutAct_9fa48("68829") ? true : stryMutAct_9fa48("68828") ? entry : (stryCov_9fa48("68828", "68829", "68830"), !entry)) {
      return stryMutAct_9fa48("68832") ? true : (stryCov_9fa48("68832"), false);
    }
    const {
      hash: _,
      ...entryWithoutHash
    } = entry;
    const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);
    const valid = stryMutAct_9fa48("68835") ? entry.hash !== expectedHash : stryMutAct_9fa48("68834") ? false : stryMutAct_9fa48("68833") ? true : (stryCov_9fa48("68833", "68834", "68835"), entry.hash === expectedHash);
    if (stryMutAct_9fa48("68838") ? valid || !entry.verified : stryMutAct_9fa48("68837") ? false : stryMutAct_9fa48("68836") ? true : (stryCov_9fa48("68836", "68837", "68838"), valid && (stryMutAct_9fa48("68839") ? entry.verified : (stryCov_9fa48("68839"), !entry.verified)))) {
      entry.verified = stryMutAct_9fa48("68841") ? false : (stryCov_9fa48("68841"), true);
      entry.verifiedAt = new Date();
      this.saveToStorage();
    }
    return valid;
  }

  // ---------------------------------------------------------------------------
  // AUDIT
  // ---------------------------------------------------------------------------

  requestAudit(decisionId: string, requestedBy: string, reason: string, framework: ComplianceFramework): AuditRecord {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68845") ? false : stryMutAct_9fa48("68844") ? true : stryMutAct_9fa48("68843") ? decision : (stryCov_9fa48("68843", "68844", "68845"), !decision)) {
      throw new Error('Decision not found');
    }
    const audit: AuditRecord = stryMutAct_9fa48("68848") ? {} : (stryCov_9fa48("68848"), {
      id: `audit-${Date.now()}`,
      requestedAt: new Date(),
      requestedBy,
      reason,
      framework,
      status: 'pending',
      findings: stryMutAct_9fa48("68851") ? ["Stryker was here"] : (stryCov_9fa48("68851"), [])
    });
    decision.auditHistory.push(audit);

    // Create ledger entry for audit request
    this.createEntry('audit.requested', decisionId, 'Audit Requested', reason, stryMutAct_9fa48("68854") ? {} : (stryCov_9fa48("68854"), {
      framework,
      requestedBy
    }), stryMutAct_9fa48("68855") ? {} : (stryCov_9fa48("68855"), {
      userId: requestedBy,
      complianceFrameworks: stryMutAct_9fa48("68856") ? [] : (stryCov_9fa48("68856"), [framework])
    }));
    this.saveToStorage();
    return audit;
  }
  completeAudit(decisionId: string, auditId: string, findings: AuditFinding[], report: string): AuditRecord | null {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68860") ? false : stryMutAct_9fa48("68859") ? true : stryMutAct_9fa48("68858") ? decision : (stryCov_9fa48("68858", "68859", "68860"), !decision)) {
      return null;
    }
    const audit = decision.auditHistory.find(stryMutAct_9fa48("68862") ? () => undefined : (stryCov_9fa48("68862"), a => stryMutAct_9fa48("68865") ? a.id !== auditId : stryMutAct_9fa48("68864") ? false : stryMutAct_9fa48("68863") ? true : (stryCov_9fa48("68863", "68864", "68865"), a.id === auditId)));
    if (stryMutAct_9fa48("68868") ? false : stryMutAct_9fa48("68867") ? true : stryMutAct_9fa48("68866") ? audit : (stryCov_9fa48("68866", "68867", "68868"), !audit)) {
      return null;
    }
    audit.status = 'completed';
    audit.completedAt = new Date();
    audit.findings = findings;
    audit.report = report;

    // Update compliance status
    const criticalFindings = stryMutAct_9fa48("68871") ? findings : (stryCov_9fa48("68871"), findings.filter(stryMutAct_9fa48("68872") ? () => undefined : (stryCov_9fa48("68872"), f => stryMutAct_9fa48("68875") ? f.severity === 'critical' && f.severity === 'high' : stryMutAct_9fa48("68874") ? false : stryMutAct_9fa48("68873") ? true : (stryCov_9fa48("68873", "68874", "68875"), (stryMutAct_9fa48("68877") ? f.severity !== 'critical' : stryMutAct_9fa48("68876") ? false : (stryCov_9fa48("68876", "68877"), f.severity === 'critical')) || (stryMutAct_9fa48("68880") ? f.severity !== 'high' : stryMutAct_9fa48("68879") ? false : (stryCov_9fa48("68879", "68880"), f.severity === 'high'))))));
    decision.complianceStatus = (stryMutAct_9fa48("68885") ? criticalFindings.length <= 0 : stryMutAct_9fa48("68884") ? criticalFindings.length >= 0 : stryMutAct_9fa48("68883") ? false : stryMutAct_9fa48("68882") ? true : (stryCov_9fa48("68882", "68883", "68884", "68885"), criticalFindings.length > 0)) ? 'review_needed' : 'compliant';

    // Create ledger entry for audit completion
    this.createEntry('audit.completed', decisionId, 'Audit Completed', `${findings.length} findings, ${criticalFindings.length} critical/high`, stryMutAct_9fa48("68891") ? {} : (stryCov_9fa48("68891"), {
      auditId,
      findingsCount: findings.length,
      report
    }), stryMutAct_9fa48("68892") ? {} : (stryCov_9fa48("68892"), {
      complianceFrameworks: stryMutAct_9fa48("68893") ? [] : (stryCov_9fa48("68893"), [audit.framework])
    }));
    this.saveToStorage();
    return audit;
  }

  // ---------------------------------------------------------------------------
  // DATA ACCESS
  // ---------------------------------------------------------------------------

  getEntry(id: string): LedgerEntry | undefined {
    return this.entries.get(id);
  }
  getAllEntries(): LedgerEntry[] {
    return stryMutAct_9fa48("68896") ? Array.from(this.entries.values()) : (stryCov_9fa48("68896"), Array.from(this.entries.values()).sort(stryMutAct_9fa48("68897") ? () => undefined : (stryCov_9fa48("68897"), (a, b) => stryMutAct_9fa48("68898") ? b.sequence + a.sequence : (stryCov_9fa48("68898"), b.sequence - a.sequence))));
  }
  getEntriesForDecision(decisionId: string): LedgerEntry[] {
    return stryMutAct_9fa48("68900") ? this.getAllEntries() : (stryCov_9fa48("68900"), this.getAllEntries().filter(stryMutAct_9fa48("68901") ? () => undefined : (stryCov_9fa48("68901"), e => stryMutAct_9fa48("68904") ? e.decisionId !== decisionId : stryMutAct_9fa48("68903") ? false : stryMutAct_9fa48("68902") ? true : (stryCov_9fa48("68902", "68903", "68904"), e.decisionId === decisionId))));
  }
  getDecision(id: string): DecisionRecord | undefined {
    return this.decisions.get(id);
  }
  getAllDecisions(): DecisionRecord[] {
    return stryMutAct_9fa48("68907") ? Array.from(this.decisions.values()) : (stryCov_9fa48("68907"), Array.from(this.decisions.values()).sort(stryMutAct_9fa48("68908") ? () => undefined : (stryCov_9fa48("68908"), (a, b) => stryMutAct_9fa48("68909") ? b.proposedAt.getTime() + a.proposedAt.getTime() : (stryCov_9fa48("68909"), b.proposedAt.getTime() - a.proposedAt.getTime()))));
  }
  searchEntries(query: {
    eventType?: LedgerEventType;
    startDate?: Date;
    endDate?: Date;
    agentId?: string;
    complianceFramework?: ComplianceFramework;
    piiOnly?: boolean;
  }): LedgerEntry[] {
    return stryMutAct_9fa48("68911") ? this.getAllEntries() : (stryCov_9fa48("68911"), this.getAllEntries().filter(e => {
      if (stryMutAct_9fa48("68915") ? query.eventType || e.eventType !== query.eventType : stryMutAct_9fa48("68914") ? false : stryMutAct_9fa48("68913") ? true : (stryCov_9fa48("68913", "68914", "68915"), query.eventType && (stryMutAct_9fa48("68917") ? e.eventType === query.eventType : stryMutAct_9fa48("68916") ? true : (stryCov_9fa48("68916", "68917"), e.eventType !== query.eventType)))) {
        return stryMutAct_9fa48("68919") ? true : (stryCov_9fa48("68919"), false);
      }
      if (stryMutAct_9fa48("68922") ? query.startDate || e.timestamp < query.startDate : stryMutAct_9fa48("68921") ? false : stryMutAct_9fa48("68920") ? true : (stryCov_9fa48("68920", "68921", "68922"), query.startDate && (stryMutAct_9fa48("68925") ? e.timestamp >= query.startDate : stryMutAct_9fa48("68924") ? e.timestamp <= query.startDate : stryMutAct_9fa48("68923") ? true : (stryCov_9fa48("68923", "68924", "68925"), e.timestamp < query.startDate)))) {
        return stryMutAct_9fa48("68927") ? true : (stryCov_9fa48("68927"), false);
      }
      if (stryMutAct_9fa48("68930") ? query.endDate || e.timestamp > query.endDate : stryMutAct_9fa48("68929") ? false : stryMutAct_9fa48("68928") ? true : (stryCov_9fa48("68928", "68929", "68930"), query.endDate && (stryMutAct_9fa48("68933") ? e.timestamp <= query.endDate : stryMutAct_9fa48("68932") ? e.timestamp >= query.endDate : stryMutAct_9fa48("68931") ? true : (stryCov_9fa48("68931", "68932", "68933"), e.timestamp > query.endDate)))) {
        return stryMutAct_9fa48("68935") ? true : (stryCov_9fa48("68935"), false);
      }
      if (stryMutAct_9fa48("68938") ? query.agentId || e.agentId !== query.agentId : stryMutAct_9fa48("68937") ? false : stryMutAct_9fa48("68936") ? true : (stryCov_9fa48("68936", "68937", "68938"), query.agentId && (stryMutAct_9fa48("68940") ? e.agentId === query.agentId : stryMutAct_9fa48("68939") ? true : (stryCov_9fa48("68939", "68940"), e.agentId !== query.agentId)))) {
        return stryMutAct_9fa48("68942") ? true : (stryCov_9fa48("68942"), false);
      }
      if (stryMutAct_9fa48("68945") ? query.complianceFramework || !e.complianceFrameworks.includes(query.complianceFramework) : stryMutAct_9fa48("68944") ? false : stryMutAct_9fa48("68943") ? true : (stryCov_9fa48("68943", "68944", "68945"), query.complianceFramework && (stryMutAct_9fa48("68946") ? e.complianceFrameworks.includes(query.complianceFramework) : (stryCov_9fa48("68946"), !e.complianceFrameworks.includes(query.complianceFramework))))) {
        return stryMutAct_9fa48("68948") ? true : (stryCov_9fa48("68948"), false);
      }
      if (stryMutAct_9fa48("68951") ? query.piiOnly || !e.piiInvolved : stryMutAct_9fa48("68950") ? false : stryMutAct_9fa48("68949") ? true : (stryCov_9fa48("68949", "68950", "68951"), query.piiOnly && (stryMutAct_9fa48("68952") ? e.piiInvolved : (stryCov_9fa48("68952"), !e.piiInvolved)))) {
        return stryMutAct_9fa48("68954") ? true : (stryCov_9fa48("68954"), false);
      }
      return stryMutAct_9fa48("68955") ? false : (stryCov_9fa48("68955"), true);
    }));
  }

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------

  exportForAudit(decisionId: string): string {
    const decision = this.decisions.get(decisionId);
    if (stryMutAct_9fa48("68959") ? false : stryMutAct_9fa48("68958") ? true : stryMutAct_9fa48("68957") ? decision : (stryCov_9fa48("68957", "68958", "68959"), !decision)) {
      throw new Error('Decision not found');
    }
    const entries = this.getEntriesForDecision(decisionId);
    const verification = this.verifyChain();
    const report = stryMutAct_9fa48("68962") ? {} : (stryCov_9fa48("68962"), {
      exportedAt: new Date().toISOString(),
      chainIntegrity: verification,
      decision: stryMutAct_9fa48("68963") ? {} : (stryCov_9fa48("68963"), {
        ...decision,
        proposedAt: decision.proposedAt.toISOString(),
        outcomeRecordedAt: stryMutAct_9fa48("68964") ? decision.outcomeRecordedAt.toISOString() : (stryCov_9fa48("68964"), decision.outcomeRecordedAt?.toISOString())
      }),
      entries: entries.map(stryMutAct_9fa48("68965") ? () => undefined : (stryCov_9fa48("68965"), e => stryMutAct_9fa48("68966") ? {} : (stryCov_9fa48("68966"), {
        ...e,
        timestamp: e.timestamp.toISOString(),
        verifiedAt: stryMutAct_9fa48("68967") ? e.verifiedAt.toISOString() : (stryCov_9fa48("68967"), e.verifiedAt?.toISOString())
      }))),
      entryCount: entries.length,
      hashChain: entries.map(stryMutAct_9fa48("68968") ? () => undefined : (stryCov_9fa48("68968"), e => stryMutAct_9fa48("68969") ? {} : (stryCov_9fa48("68969"), {
        sequence: e.sequence,
        hash: e.hash
      })))
    });
    return JSON.stringify(report, null, 2);
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): LedgerMetrics {
    const entries = this.getAllEntries();
    const decisions = this.getAllDecisions();
    const entriesByType: Record<LedgerEventType, number> = {} as any;
    const entriesByFramework: Record<ComplianceFramework, number> = stryMutAct_9fa48("68971") ? {} : (stryCov_9fa48("68971"), {
      GDPR: 0,
      SOX: 0,
      HIPAA: 0,
      'PCI-DSS': 0,
      ISO27001: 0,
      SOC2: 0,
      CCPA: 0,
      NIST: 0
    });
    let totalConfidence = 0;
    let confidenceCount = 0;
    let vetoCount = 0;
    let approveCount = 0;
    let piiCount = 0;
    entries.forEach(e => {
      entriesByType[e.eventType] = stryMutAct_9fa48("68973") ? (entriesByType[e.eventType] || 0) - 1 : (stryCov_9fa48("68973"), (stryMutAct_9fa48("68976") ? entriesByType[e.eventType] && 0 : stryMutAct_9fa48("68975") ? false : stryMutAct_9fa48("68974") ? true : (stryCov_9fa48("68974", "68975", "68976"), entriesByType[e.eventType] || 0)) + 1);
      e.complianceFrameworks.forEach(stryMutAct_9fa48("68977") ? () => undefined : (stryCov_9fa48("68977"), f => stryMutAct_9fa48("68978") ? entriesByFramework[f]-- : (stryCov_9fa48("68978"), entriesByFramework[f]++)));
      if (stryMutAct_9fa48("68981") ? e.confidenceScore === undefined : stryMutAct_9fa48("68980") ? false : stryMutAct_9fa48("68979") ? true : (stryCov_9fa48("68979", "68980", "68981"), e.confidenceScore !== undefined)) {
        stryMutAct_9fa48("68983") ? totalConfidence -= e.confidenceScore : (stryCov_9fa48("68983"), totalConfidence += e.confidenceScore);
        stryMutAct_9fa48("68984") ? confidenceCount-- : (stryCov_9fa48("68984"), confidenceCount++);
      }
      if (stryMutAct_9fa48("68987") ? e.vote !== 'veto' : stryMutAct_9fa48("68986") ? false : stryMutAct_9fa48("68985") ? true : (stryCov_9fa48("68985", "68986", "68987"), e.vote === 'veto')) {
        stryMutAct_9fa48("68990") ? vetoCount-- : (stryCov_9fa48("68990"), vetoCount++);
      }
      if (stryMutAct_9fa48("68993") ? e.vote !== 'approve' : stryMutAct_9fa48("68992") ? false : stryMutAct_9fa48("68991") ? true : (stryCov_9fa48("68991", "68992", "68993"), e.vote === 'approve')) {
        stryMutAct_9fa48("68996") ? approveCount-- : (stryCov_9fa48("68996"), approveCount++);
      }
      if (stryMutAct_9fa48("68998") ? false : stryMutAct_9fa48("68997") ? true : (stryCov_9fa48("68997", "68998"), e.piiInvolved)) {
        stryMutAct_9fa48("69000") ? piiCount-- : (stryCov_9fa48("69000"), piiCount++);
      }
    });
    const verification = this.verifyChain();
    const pendingAudits = decisions.reduce(stryMutAct_9fa48("69001") ? () => undefined : (stryCov_9fa48("69001"), (sum, d) => stryMutAct_9fa48("69002") ? sum - d.auditHistory.filter(a => a.status === 'pending' || a.status === 'in_progress').length : (stryCov_9fa48("69002"), sum + (stryMutAct_9fa48("69003") ? d.auditHistory.length : (stryCov_9fa48("69003"), d.auditHistory.filter(stryMutAct_9fa48("69004") ? () => undefined : (stryCov_9fa48("69004"), a => stryMutAct_9fa48("69007") ? a.status === 'pending' && a.status === 'in_progress' : stryMutAct_9fa48("69006") ? false : stryMutAct_9fa48("69005") ? true : (stryCov_9fa48("69005", "69006", "69007"), (stryMutAct_9fa48("69009") ? a.status !== 'pending' : stryMutAct_9fa48("69008") ? false : (stryCov_9fa48("69008", "69009"), a.status === 'pending')) || (stryMutAct_9fa48("69012") ? a.status !== 'in_progress' : stryMutAct_9fa48("69011") ? false : (stryCov_9fa48("69011", "69012"), a.status === 'in_progress'))))).length)))), 0);
    return stryMutAct_9fa48("69014") ? {} : (stryCov_9fa48("69014"), {
      totalEntries: entries.length,
      totalDecisions: decisions.length,
      entriesByType,
      entriesByFramework,
      averageConfidence: (stryMutAct_9fa48("69018") ? confidenceCount <= 0 : stryMutAct_9fa48("69017") ? confidenceCount >= 0 : stryMutAct_9fa48("69016") ? false : stryMutAct_9fa48("69015") ? true : (stryCov_9fa48("69015", "69016", "69017", "69018"), confidenceCount > 0)) ? Math.round(stryMutAct_9fa48("69019") ? totalConfidence * confidenceCount : (stryCov_9fa48("69019"), totalConfidence / confidenceCount)) : 0,
      vetoRate: (stryMutAct_9fa48("69023") ? entries.length <= 0 : stryMutAct_9fa48("69022") ? entries.length >= 0 : stryMutAct_9fa48("69021") ? false : stryMutAct_9fa48("69020") ? true : (stryCov_9fa48("69020", "69021", "69022", "69023"), entries.length > 0)) ? Math.round(stryMutAct_9fa48("69024") ? vetoCount / entries.length / 100 : (stryCov_9fa48("69024"), (stryMutAct_9fa48("69025") ? vetoCount * entries.length : (stryCov_9fa48("69025"), vetoCount / entries.length)) * 100)) : 0,
      approvalRate: (stryMutAct_9fa48("69029") ? entries.length <= 0 : stryMutAct_9fa48("69028") ? entries.length >= 0 : stryMutAct_9fa48("69027") ? false : stryMutAct_9fa48("69026") ? true : (stryCov_9fa48("69026", "69027", "69028", "69029"), entries.length > 0)) ? Math.round(stryMutAct_9fa48("69030") ? approveCount / entries.length / 100 : (stryCov_9fa48("69030"), (stryMutAct_9fa48("69031") ? approveCount * entries.length : (stryCov_9fa48("69031"), approveCount / entries.length)) * 100)) : 0,
      chainIntegrity: verification.valid ? 'valid' : 'broken',
      lastVerifiedAt: stryMutAct_9fa48("69034") ? entries.find(e => e.verified).verifiedAt : (stryCov_9fa48("69034"), entries.find(stryMutAct_9fa48("69035") ? () => undefined : (stryCov_9fa48("69035"), e => e.verified))?.verifiedAt),
      piiEntriesCount: piiCount,
      pendingAudits
    });
  }
}

// Singleton
export const ledgerService = new LedgerService();
export default ledgerService;