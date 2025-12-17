// =============================================================================
// CENDIA LEDGER™ — IMMUTABLE DECISION BLOCKCHAIN
// First AI decision provenance for regulatory audit
// Every Council deliberation, vote, veto, and confidence score recorded
// =============================================================================

// =============================================================================
// TYPES
// =============================================================================

export type LedgerEventType =
  | 'decision.proposed'
  | 'decision.deliberated'
  | 'decision.voted'
  | 'decision.vetoed'
  | 'decision.approved'
  | 'decision.executed'
  | 'decision.outcome_recorded'
  | 'agent.joined'
  | 'agent.contributed'
  | 'agent.voted'
  | 'agent.vetoed'
  | 'confidence.updated'
  | 'evidence.attached'
  | 'audit.requested'
  | 'audit.completed'
  | 'compliance.check'
  | 'override.requested'
  | 'override.approved'
  | 'override.denied';

export type ComplianceFramework =
  | 'GDPR'
  | 'SOX'
  | 'HIPAA'
  | 'PCI-DSS'
  | 'ISO27001'
  | 'SOC2'
  | 'CCPA'
  | 'NIST';

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
  voters: { agentId: string; vote: string; confidence: number; timestamp: Date }[];

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
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

function createEntryHash(entry: Omit<LedgerEntry, 'hash'>): string {
  const data = JSON.stringify({
    id: entry.id,
    sequence: entry.sequence,
    timestamp: entry.timestamp.toISOString(),
    eventType: entry.eventType,
    decisionId: entry.decisionId,
    previousHash: entry.previousHash,
    data: entry.data,
  });
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
      if (stored) {
        const data = JSON.parse(stored);
        this.sequence = data.sequence || 0;

        data.entries?.forEach((e: LedgerEntry) => {
          e.timestamp = new Date(e.timestamp);
          if (e.verifiedAt) {
            e.verifiedAt = new Date(e.verifiedAt);
          }
          this.entries.set(e.id, e);
        });

        data.decisions?.forEach((d: DecisionRecord) => {
          d.proposedAt = new Date(d.proposedAt);
          if (d.outcomeRecordedAt) {
            d.outcomeRecordedAt = new Date(d.outcomeRecordedAt);
          }
          d.voters.forEach((v) => (v.timestamp = new Date(v.timestamp)));
          d.auditHistory.forEach((a) => {
            a.requestedAt = new Date(a.requestedAt);
            if (a.completedAt) {
              a.completedAt = new Date(a.completedAt);
            }
          });
          this.decisions.set(d.id, d);
        });
      }
    } catch (error) {
      console.error('Failed to load ledger data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        sequence: this.sequence,
        entries: Array.from(this.entries.values()),
        decisions: Array.from(this.decisions.values()),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save ledger data:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // ENTRY CREATION
  // ---------------------------------------------------------------------------

  private getLastHash(): string {
    if (this.entries.size === 0) {
      return this.genesisHash;
    }

    const sortedEntries = Array.from(this.entries.values()).sort((a, b) => a.sequence - b.sequence);
    return sortedEntries[sortedEntries.length - 1].hash;
  }

  createEntry(
    eventType: LedgerEventType,
    decisionId: string,
    title: string,
    description: string,
    data: Record<string, any>,
    options: {
      organizationId?: string;
      userId?: string;
      agentId?: string;
      confidenceScore?: number;
      vote?: LedgerEntry['vote'];
      voteWeight?: number;
      complianceFrameworks?: ComplianceFramework[];
      sensitivityLevel?: LedgerEntry['sensitivityLevel'];
      piiInvolved?: boolean;
    } = {}
  ): LedgerEntry {
    this.sequence++;
    const id = `entry-${Date.now()}-${this.sequence}`;

    const entryWithoutHash: Omit<LedgerEntry, 'hash'> = {
      id,
      sequence: this.sequence,
      timestamp: new Date(),
      eventType,
      decisionId,
      organizationId: options.organizationId || 'default',
      userId: options.userId,
      agentId: options.agentId,
      title,
      description,
      data,
      confidenceScore: options.confidenceScore,
      vote: options.vote,
      voteWeight: options.voteWeight,
      previousHash: this.getLastHash(),
      complianceFrameworks: options.complianceFrameworks || [],
      retentionPeriodDays: 2555, // 7 years default
      sensitivityLevel: options.sensitivityLevel || 'internal',
      piiInvolved: options.piiInvolved || false,
      verified: false,
    };

    const entry: LedgerEntry = {
      ...entryWithoutHash,
      hash: createEntryHash(entryWithoutHash),
    };

    this.entries.set(id, entry);

    // Update decision record
    const decision = this.decisions.get(decisionId);
    if (decision) {
      decision.ledgerEntries.push(id);
      decision.latestEntryHash = entry.hash;
    }

    this.saveToStorage();
    return entry;
  }

  // ---------------------------------------------------------------------------
  // DECISION MANAGEMENT
  // ---------------------------------------------------------------------------

  createDecision(
    title: string,
    description: string,
    proposedBy: string,
    agents: string[]
  ): DecisionRecord {
    const id = `decision-${Date.now()}`;

    const decision: DecisionRecord = {
      id,
      title,
      description,
      proposedBy,
      proposedAt: new Date(),
      status: 'proposed',
      agents,
      voters: [],
      ledgerEntries: [],
      firstEntryHash: '',
      latestEntryHash: '',
      complianceStatus: 'pending',
      auditHistory: [],
    };

    this.decisions.set(id, decision);

    // Create initial ledger entry
    const entry = this.createEntry(
      'decision.proposed',
      id,
      `Decision Proposed: ${title}`,
      description,
      { proposedBy, agents },
      { userId: proposedBy }
    );

    decision.firstEntryHash = entry.hash;
    decision.latestEntryHash = entry.hash;

    this.saveToStorage();
    return decision;
  }

  recordDeliberation(
    decisionId: string,
    agentId: string,
    contribution: string,
    confidenceScore: number
  ): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.status = 'deliberating';

    return this.createEntry(
      'agent.contributed',
      decisionId,
      `Agent Contribution`,
      contribution,
      { agentId, contribution },
      { agentId, confidenceScore }
    );
  }

  recordVote(
    decisionId: string,
    agentId: string,
    vote: 'approve' | 'reject' | 'abstain' | 'veto',
    confidence: number,
    reasoning: string
  ): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.status = 'voting';
    decision.voters.push({ agentId, vote, confidence, timestamp: new Date() });

    const eventType: LedgerEventType = vote === 'veto' ? 'agent.vetoed' : 'agent.voted';

    return this.createEntry(
      eventType,
      decisionId,
      `Vote: ${vote.toUpperCase()}`,
      reasoning,
      { agentId, vote, confidence, reasoning },
      { agentId, vote, confidenceScore: confidence, voteWeight: 1 }
    );
  }

  finalizeDecision(
    decisionId: string,
    status: 'approved' | 'rejected' | 'vetoed',
    finalConfidence: number
  ): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.status = status;
    decision.finalConfidence = finalConfidence;

    const eventType: LedgerEventType =
      status === 'vetoed'
        ? 'decision.vetoed'
        : status === 'approved'
          ? 'decision.approved'
          : 'decision.voted';

    return this.createEntry(
      eventType,
      decisionId,
      `Decision ${status.toUpperCase()}`,
      `Final confidence: ${finalConfidence}%`,
      { status, finalConfidence, voterSummary: decision.voters },
      { confidenceScore: finalConfidence }
    );
  }

  recordOutcome(decisionId: string, outcome: string, metrics?: Record<string, any>): LedgerEntry {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    decision.outcome = outcome;
    decision.outcomeRecordedAt = new Date();

    return this.createEntry(
      'decision.outcome_recorded',
      decisionId,
      'Outcome Recorded',
      outcome,
      { outcome, metrics },
      {}
    );
  }

  // ---------------------------------------------------------------------------
  // CHAIN VERIFICATION
  // ---------------------------------------------------------------------------

  verifyChain(): ChainVerificationResult {
    const sortedEntries = Array.from(this.entries.values()).sort((a, b) => a.sequence - b.sequence);

    if (sortedEntries.length === 0) {
      return { valid: true, entriesChecked: 0, message: 'Empty chain is valid' };
    }

    let previousHash = this.genesisHash;

    for (let i = 0; i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];

      // Verify previous hash link
      if (entry.previousHash !== previousHash) {
        return {
          valid: false,
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: previousHash mismatch`,
        };
      }

      // Verify entry hash
      const { hash: _, ...entryWithoutHash } = entry;
      const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);

      if (entry.hash !== expectedHash) {
        return {
          valid: false,
          entriesChecked: i,
          brokenAt: entry.sequence,
          brokenEntryId: entry.id,
          message: `Chain broken at sequence ${entry.sequence}: hash verification failed`,
        };
      }

      previousHash = entry.hash;
    }

    return {
      valid: true,
      entriesChecked: sortedEntries.length,
      message: `All ${sortedEntries.length} entries verified successfully`,
    };
  }

  verifyEntry(entryId: string): boolean {
    const entry = this.entries.get(entryId);
    if (!entry) {
      return false;
    }

    const { hash: _, ...entryWithoutHash } = entry;
    const expectedHash = createEntryHash(entryWithoutHash as Omit<LedgerEntry, 'hash'>);

    const valid = entry.hash === expectedHash;

    if (valid && !entry.verified) {
      entry.verified = true;
      entry.verifiedAt = new Date();
      this.saveToStorage();
    }

    return valid;
  }

  // ---------------------------------------------------------------------------
  // AUDIT
  // ---------------------------------------------------------------------------

  requestAudit(
    decisionId: string,
    requestedBy: string,
    reason: string,
    framework: ComplianceFramework
  ): AuditRecord {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    const audit: AuditRecord = {
      id: `audit-${Date.now()}`,
      requestedAt: new Date(),
      requestedBy,
      reason,
      framework,
      status: 'pending',
      findings: [],
    };

    decision.auditHistory.push(audit);

    // Create ledger entry for audit request
    this.createEntry(
      'audit.requested',
      decisionId,
      'Audit Requested',
      reason,
      { framework, requestedBy },
      { userId: requestedBy, complianceFrameworks: [framework] }
    );

    this.saveToStorage();
    return audit;
  }

  completeAudit(
    decisionId: string,
    auditId: string,
    findings: AuditFinding[],
    report: string
  ): AuditRecord | null {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      return null;
    }

    const audit = decision.auditHistory.find((a) => a.id === auditId);
    if (!audit) {
      return null;
    }

    audit.status = 'completed';
    audit.completedAt = new Date();
    audit.findings = findings;
    audit.report = report;

    // Update compliance status
    const criticalFindings = findings.filter(
      (f) => f.severity === 'critical' || f.severity === 'high'
    );
    decision.complianceStatus = criticalFindings.length > 0 ? 'review_needed' : 'compliant';

    // Create ledger entry for audit completion
    this.createEntry(
      'audit.completed',
      decisionId,
      'Audit Completed',
      `${findings.length} findings, ${criticalFindings.length} critical/high`,
      { auditId, findingsCount: findings.length, report },
      { complianceFrameworks: [audit.framework] }
    );

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
    return Array.from(this.entries.values()).sort((a, b) => b.sequence - a.sequence);
  }

  getEntriesForDecision(decisionId: string): LedgerEntry[] {
    return this.getAllEntries().filter((e) => e.decisionId === decisionId);
  }

  getDecision(id: string): DecisionRecord | undefined {
    return this.decisions.get(id);
  }

  getAllDecisions(): DecisionRecord[] {
    return Array.from(this.decisions.values()).sort(
      (a, b) => b.proposedAt.getTime() - a.proposedAt.getTime()
    );
  }

  searchEntries(query: {
    eventType?: LedgerEventType;
    startDate?: Date;
    endDate?: Date;
    agentId?: string;
    complianceFramework?: ComplianceFramework;
    piiOnly?: boolean;
  }): LedgerEntry[] {
    return this.getAllEntries().filter((e) => {
      if (query.eventType && e.eventType !== query.eventType) {
        return false;
      }
      if (query.startDate && e.timestamp < query.startDate) {
        return false;
      }
      if (query.endDate && e.timestamp > query.endDate) {
        return false;
      }
      if (query.agentId && e.agentId !== query.agentId) {
        return false;
      }
      if (
        query.complianceFramework &&
        !e.complianceFrameworks.includes(query.complianceFramework)
      ) {
        return false;
      }
      if (query.piiOnly && !e.piiInvolved) {
        return false;
      }
      return true;
    });
  }

  // ---------------------------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------------------------

  exportForAudit(decisionId: string): string {
    const decision = this.decisions.get(decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    const entries = this.getEntriesForDecision(decisionId);
    const verification = this.verifyChain();

    const report = {
      exportedAt: new Date().toISOString(),
      chainIntegrity: verification,
      decision: {
        ...decision,
        proposedAt: decision.proposedAt.toISOString(),
        outcomeRecordedAt: decision.outcomeRecordedAt?.toISOString(),
      },
      entries: entries.map((e) => ({
        ...e,
        timestamp: e.timestamp.toISOString(),
        verifiedAt: e.verifiedAt?.toISOString(),
      })),
      entryCount: entries.length,
      hashChain: entries.map((e) => ({ sequence: e.sequence, hash: e.hash })),
    };

    return JSON.stringify(report, null, 2);
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): LedgerMetrics {
    const entries = this.getAllEntries();
    const decisions = this.getAllDecisions();

    const entriesByType: Record<LedgerEventType, number> = {} as any;
    const entriesByFramework: Record<ComplianceFramework, number> = {
      GDPR: 0,
      SOX: 0,
      HIPAA: 0,
      'PCI-DSS': 0,
      ISO27001: 0,
      SOC2: 0,
      CCPA: 0,
      NIST: 0,
    };

    let totalConfidence = 0;
    let confidenceCount = 0;
    let vetoCount = 0;
    let approveCount = 0;
    let piiCount = 0;

    entries.forEach((e) => {
      entriesByType[e.eventType] = (entriesByType[e.eventType] || 0) + 1;
      e.complianceFrameworks.forEach((f) => entriesByFramework[f]++);

      if (e.confidenceScore !== undefined) {
        totalConfidence += e.confidenceScore;
        confidenceCount++;
      }

      if (e.vote === 'veto') {
        vetoCount++;
      }
      if (e.vote === 'approve') {
        approveCount++;
      }
      if (e.piiInvolved) {
        piiCount++;
      }
    });

    const verification = this.verifyChain();
    const pendingAudits = decisions.reduce(
      (sum, d) =>
        sum +
        d.auditHistory.filter((a) => a.status === 'pending' || a.status === 'in_progress').length,
      0
    );

    return {
      totalEntries: entries.length,
      totalDecisions: decisions.length,
      entriesByType,
      entriesByFramework,
      averageConfidence: confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount) : 0,
      vetoRate: entries.length > 0 ? Math.round((vetoCount / entries.length) * 100) : 0,
      approvalRate: entries.length > 0 ? Math.round((approveCount / entries.length) * 100) : 0,
      chainIntegrity: verification.valid ? 'valid' : 'broken',
      lastVerifiedAt: entries.find((e) => e.verified)?.verifiedAt,
      piiEntriesCount: piiCount,
      pendingAudits,
    };
  }
}

// Singleton
export const ledgerService = new LedgerService();
export default ledgerService;
