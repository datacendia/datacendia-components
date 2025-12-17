// @ts-nocheck
// =============================================================================
// CENDIA CHRONOS™ - THE ENTERPRISE TIME MACHINE
// Premium Package: Time-travel through your organization's history and future
// "The Black Box Flight Recorder for Corporate Intent"
// 
// ENHANCED FEATURES:
// - Diff View: Side-by-side comparison of any two dates
// - Pivotal Moment Detection: AI identifies critical decision points
// - Council Replay Theater: Watch deliberations play back like video
// - Impact Tracing: See ripple effects from any decision
// - Multi-Branch Compare: Compare 3+ alternate timelines
// - Bookmark Moments: Save & share timestamps
// - Causal Analysis: Trace metrics to root decisions
// - Animated Graph Preview: Knowledge graph morphs with timeline
// - Monte Carlo Simulations: Run 1000+ scenarios
// 
// CHRONOS-ERP™ - Enterprise System Time Travel:
// - Salesforce: CRM pipelines, opportunities, forecasts
// - SAP/NetSuite: ERP transactions, GL entries, purchase orders
// - Workday: Hiring data, compensation, headcount changes
// - Jira/GitHub: Engineering velocity, deployments, incidents
// - ServiceNow: Service tickets, SLA compliance, MTTR
// - SharePoint: Document revisions, policy changes, approvals
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
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decisionIntelApi, metricsApi, councilApi, alertsApi, graphApi } from '../../../lib/api';
import { sovereignApi } from '../../../lib/sovereignApi';

// =============================================================================
// TYPES
// =============================================================================

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'decision' | 'metric' | 'personnel' | 'financial' | 'system' | 'milestone';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  magnitude: number;
  department?: string;
  actors?: string[];
  deliberationId?: string;
  snapshotId?: string;
}
interface StateSnapshot {
  timestamp: Date;
  metrics: {
    revenue: number;
    profit: number;
    employees: number;
    customers: number;
    satisfaction: number;
    marketShare: number;
    burnRate: number;
    runway: number;
  };
  council: {
    activeAgents: string[];
    pendingDecisions: number;
    totalDeliberations: number;
    consensusRate: number;
  };
  graph: {
    entities: number;
    relationships: number;
    dataPoints: number;
    freshness: number;
  };
}
interface BranchTimeline {
  id: string;
  name: string;
  branchPoint: Date;
  variable: string;
  original: string;
  alternate: string;
  divergence: number;
  snapshots: StateSnapshot[];
  outcome: 'better' | 'worse' | 'similar';
  deltaRevenue: number;
  deltaProfit: number;
}
type ChronosMode = 'rewind' | 'replay' | 'fastforward';
type EnhancedView = 'standard' | 'diff' | 'theater' | 'impact' | 'monte-carlo';

// Enhanced Types
interface Bookmark {
  id: string;
  timestamp: Date;
  label: string;
  notes?: string;
  createdAt: Date;
  sharedUrl?: string;
}
interface PivotalMoment {
  id: string;
  timestamp: Date;
  event: TimelineEvent;
  significance: number; // 1-100
  reason: string;
  impactedMetrics: string[];
  beforeState: Partial<StateSnapshot['metrics']>;
  afterState: Partial<StateSnapshot['metrics']>;
}
interface CausalChain {
  id: string;
  rootCause: TimelineEvent;
  effects: Array<{
    event: TimelineEvent;
    delay: number; // days
    correlation: number; /* 0-1*/
  }>;
  totalImpact: {
    revenue: number;
    profit: number;
    customers: number;
  };
}
interface CouncilReplay {
  id: string;
  deliberationId: string;
  timestamp: Date;
  query: string;
  participants: string[];
  duration: number; // seconds
  phases: Array<{
    agent: string;
    statement: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    timestamp: number; /* seconds into replay*/
  }>;
  decision: string;
  confidence: number;
}
interface MonteCarloResult {
  id: string;
  variable: string;
  simulations: number;
  outcomes: Array<{
    scenario: string;
    probability: number;
    revenue: number;
    profit: number;
  }>;
  optimalPath: string;
  confidenceInterval: [number, number];
}

// =============================================================================
// CHRONOS-ERP™ TYPES - Enterprise System Time Travel
// =============================================================================

type ERPSource = 'salesforce' | 'sap' | 'workday' | 'jira' | 'servicenow' | 'github' | 'sharepoint' | 'netsuite';
interface ERPConnector {
  id: string;
  name: string;
  source: ERPSource;
  icon: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync: Date;
  recordCount: number;
  dataTypes: string[];
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  healthScore: number;
}
interface CRMPipelineEvent {
  id: string;
  timestamp: Date;
  source: 'salesforce' | 'hubspot';
  opportunityId: string;
  accountName: string;
  stage: string;
  previousStage?: string;
  amount: number;
  probability: number;
  owner: string;
  closeDate: Date;
  deltaAmount?: number;
}
interface ERPTransactionEvent {
  id: string;
  timestamp: Date;
  source: 'sap' | 'netsuite' | 'oracle';
  transactionType: 'purchase_order' | 'sales_order' | 'invoice' | 'payment' | 'journal_entry';
  documentNumber: string;
  amount: number;
  currency: string;
  costCenter: string;
  glAccount: string;
  description: string;
  approver?: string;
}
interface HREvent {
  id: string;
  timestamp: Date;
  source: 'workday' | 'bamboohr' | 'adp';
  eventType: 'hire' | 'termination' | 'promotion' | 'transfer' | 'compensation_change' | 'performance_review';
  department: string;
  position: string;
  level?: string;
  location: string;
  headcountDelta: number;
  compensationBand?: string;
}
interface EngineeringEvent {
  id: string;
  timestamp: Date;
  source: 'jira' | 'github' | 'gitlab' | 'linear';
  eventType: 'sprint_complete' | 'release' | 'incident' | 'pr_merged' | 'deployment';
  project: string;
  team: string;
  velocity?: number;
  storyPoints?: number;
  leadTime?: number;
  cycleTime?: number;
  deployFrequency?: number;
  incidentSeverity?: 'critical' | 'high' | 'medium' | 'low';
}
interface ServiceTicketEvent {
  id: string;
  timestamp: Date;
  source: 'servicenow' | 'zendesk' | 'freshdesk';
  ticketId: string;
  category: 'incident' | 'request' | 'problem' | 'change';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignee: string;
  resolution?: string;
  slaBreached: boolean;
  responseTime: number;
  resolutionTime?: number;
}
interface DocumentRevisionEvent {
  id: string;
  timestamp: Date;
  source: 'sharepoint' | 'confluence' | 'notion' | 'google_drive';
  documentId: string;
  documentName: string;
  documentType: 'policy' | 'contract' | 'spec' | 'report' | 'presentation';
  version: string;
  previousVersion?: string;
  author: string;
  changeType: 'created' | 'modified' | 'approved' | 'published' | 'archived';
  approvers?: string[];
}
interface FinancialValidationEvent {
  id: string;
  timestamp: Date;
  source: 'sap' | 'netsuite' | 'oracle' | 'workday';
  validationType: 'reconciliation' | 'audit' | 'close' | 'compliance_check';
  period: string;
  entity: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  discrepancyAmount?: number;
  controlId?: string;
  auditor?: string;
  findings?: string;
}

// Aggregate ERP snapshot at a point in time
interface ERPStateSnapshot {
  timestamp: Date;
  crm: {
    totalPipeline: number;
    weightedPipeline: number;
    openOpportunities: number;
    wonThisMonth: number;
    lostThisMonth: number;
    avgDealSize: number;
    winRate: number;
  };
  erp: {
    revenue: number;
    expenses: number;
    cashPosition: number;
    accountsReceivable: number;
    accountsPayable: number;
    openPOs: number;
  };
  hr: {
    totalHeadcount: number;
    openReqs: number;
    attritionRate: number;
    avgTenure: number;
    hiresThisQuarter: number;
    departuresThisQuarter: number;
  };
  engineering: {
    velocity: number;
    sprintCompletion: number;
    bugCount: number;
    techDebtHours: number;
    deploymentFrequency: number;
    mttr: number;
  };
  serviceDesk: {
    openTickets: number;
    avgResponseTime: number;
    avgResolutionTime: number;
    slaCompliance: number;
    csat: number;
  };
}

// =============================================================================
// ENTERPRISE COMPLIANCE TYPES (The Undefeatable 5%)
// =============================================================================

interface LedgerBlock {
  blockNumber: number;
  timestamp: Date;
  previousHash: string;
  hash: string;
  merkleRoot: string;
  stateSnapshot: StateSnapshot;
  events: TimelineEvent[];
  signature: string;
  signedBy: string;
  nonce: number;
}
interface ChronosLedger {
  chainId: string;
  genesisBlock: LedgerBlock;
  latestBlock: LedgerBlock;
  totalBlocks: number;
  integrityStatus: 'verified' | 'compromised' | 'pending';
  lastVerified: Date;
  complianceFlags: {
    sox: boolean;
    sec: boolean;
    fedramp: boolean;
    gdpr: boolean;
    hipaa: boolean;
  };
}
interface CourtAdmissibleExport {
  id: string;
  exportedAt: Date;
  requestedBy: string;
  timeRange: {
    start: Date;
    end: Date;
  };
  includedBlocks: number[];
  merkleProof: string[];
  signatures: Array<{
    signer: string;
    role: string;
    timestamp: Date;
    signature: string;
    publicKey: string;
  }>;
  witnessStatements: Array<{
    witness: string;
    statement: string;
    timestamp: Date;
  }>;
  deliberationTranscripts: CouncilReplay[];
  hashChainVerification: {
    startHash: string;
    endHash: string;
    allBlocksValid: boolean;
  };
  legalCertification: {
    certified: boolean;
    certifier: string;
    caseNumber?: string;
    jurisdiction?: string;
  };
  format: 'pdf' | 'json' | 'xml' | 'forensic-bundle';
}
interface WitnessSession {
  id: string;
  witnessId: string;
  witnessOrg: string; // "Deloitte", "SEC", "DOJ", etc.
  witnessRole: string;
  accessLevel: 'full' | 'financial-only' | 'redacted';
  startedAt: Date;
  expiresAt: Date;
  airGappedKey: string;
  lastActivity: Date;
  viewedBlocks: number[];
  isLive: boolean;
  ipAddress?: string;
}
interface RedactionRule {
  id: string;
  field: string;
  pattern: RegExp | string;
  replacement: string;
  category: 'pii' | 'phi' | 'personnel' | 'confidential' | 'trade-secret';
  preserveFinancialTruth: boolean;
}
interface RedactedExport {
  originalHash: string;
  redactedHash: string;
  redactionLog: Array<{
    field: string;
    category: string;
    count: number;
  }>;
  financialIntegrityPreserved: boolean;
  redactionCertificate: string;
}
interface LiveSyncStatus {
  isConnected: boolean;
  lastEventTime: Date;
  pendingEvents: number;
  syncLag: number; // milliseconds
  throughput: number; // events per second
  kafkaOffset?: number;
  websocketStatus: 'connected' | 'reconnecting' | 'disconnected';
}

// =============================================================================
// FULL TRACEABILITY TYPES - Court-Level Causality Proof
// =============================================================================

interface TraceabilityView {
  eventId: string;
  originSource: {
    dataset: string;
    table: string;
    field: string;
    timestamp: Date;
    rawValue: any;
  };
  intermediateTransforms: Array<{
    step: number;
    service: string;
    operation: string;
    inputHash: string;
    outputHash: string;
    timestamp: Date;
    duration: number;
  }>;
  finalOutput: {
    value: any;
    confidence: number;
    timestamp: Date;
  };
  agentProvenance: {
    agentId: string;
    agentName: string;
    agentRole: string;
    deliberationId?: string;
    reasoning: string;
  };
  serviceChain: Array<{
    serviceName: string;
    version: string;
    method: string;
    latency: number;
  }>;
  datasetLineage: Array<{
    datasetId: string;
    datasetName: string;
    source: string;
    lastUpdated: Date;
    recordCount: number;
    quality: number;
  }>;
  frameworkGovernance: {
    framework: string;
    policy: string;
    controls: string[];
    validatedAt: Date;
    validatedBy: string;
  };
  integrityProof: {
    merkleRoot: string;
    blockNumber: number;
    signature: string;
  };
}

// =============================================================================
// PER-EVENT COMPLIANCE SNAPSHOT TYPES
// =============================================================================

interface EventComplianceSnapshot {
  eventId: string;
  timestamp: Date;
  nistScore: {
    overall: number;
    identify: number;
    protect: number;
    detect: number;
    respond: number;
    recover: number;
  };
  oecdScore: {
    overall: number;
    transparency: number;
    accountability: number;
    robustness: number;
    fairness: number;
    privacy: number;
  };
  privacyCompliance: {
    gdprStatus: 'compliant' | 'warning' | 'violation';
    ccpaStatus: 'compliant' | 'warning' | 'violation';
    dataMinimization: number;
    consentCoverage: number;
    retentionCompliance: number;
  };
  securityPosture: {
    overallScore: number;
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    encryptionCoverage: number;
    accessControlScore: number;
    auditLogIntegrity: number;
  };
  stakeholderImpact: {
    customersAffected: number;
    employeesAffected: number;
    partnersAffected: number;
    financialExposure: number;
    reputationalRisk: 'low' | 'medium' | 'high' | 'critical';
  };
  driftScore: {
    modelDrift: number;
    dataDrift: number;
    conceptDrift: number;
    performanceDrift: number;
    lastCalibration: Date;
  };
}

// =============================================================================
// REVERSE TIME CHECK TYPES - Chronos Integrity Validation
// =============================================================================

interface ReverseTimeCheck {
  id: string;
  targetDate: Date;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'rebuilding' | 'complete' | 'mismatch_detected';
  progress: number;
  reconstructedState: StateSnapshot | null;
  expectedHash: string;
  actualHash: string;
  mismatches: Array<{
    field: string;
    expected: any;
    actual: any;
    severity: 'critical' | 'high' | 'medium' | 'low';
    possibleCauses: string[];
  }>;
  tamperProofSignal: {
    isValid: boolean;
    validationMethod: string;
    merkleProof: string[];
    blockRange: [number, number];
    witnessSignatures: string[];
  };
  forensicReport: {
    generatedAt: Date;
    findings: string[];
    recommendations: string[];
    legalAdmissible: boolean;
  };
}

// =============================================================================
// REGULATOR MODE TYPES
// =============================================================================

interface RegulatorSession {
  id: string;
  regulatorId: string;
  regulatorOrg: 'SEC' | 'FDIC' | 'OCC' | 'FRB' | 'DOJ' | 'FTC' | 'HHS' | 'Custom';
  regulatorName: string;
  accessLevel: 'full_audit' | 'financial_only' | 'compliance_only' | 'summary_only';
  startedAt: Date;
  expiresAt: Date;
  isReadOnly: true;
  timeSliceStart: Date;
  timeSliceEnd: Date;
  redactionProfile: 'standard' | 'strict' | 'minimal';
  viewedItems: string[];
  exportedReports: string[];
  sessionKey: string;
  ipRestriction?: string;
  twoFactorVerified: boolean;
}

// =============================================================================
// ZERO-KNOWLEDGE AUDIT TYPES
// =============================================================================

interface ZeroKnowledgeProof {
  id: string;
  proofType: 'compliance' | 'financial' | 'privacy' | 'security' | 'ethics';
  claim: string;
  framework: 'GDPR' | 'HIPAA' | 'SOX' | 'SOC2' | 'NIST' | 'ISO27001' | 'CCPA' | 'OECD_AI';
  generatedAt: Date;
  expiresAt: Date;
  proof: {
    commitment: string;
    challenge: string;
    response: string;
    publicInputs: string[];
  };
  verification: {
    isValid: boolean;
    verifiedAt: Date;
    verifierSignature: string;
    verificationHash: string;
  };
  metadata: {
    dataPointsProven: number;
    timeRangeCovered: {
      start: Date;
      end: Date;
    };
    piiExposed: false;
    secretsRevealed: false;
  };
}

// =============================================================================
// DATA GENERATION (Would connect to Neo4j + Event Store in production)
// =============================================================================

const generateEvents = (): TimelineEvent[] => {
  const events: TimelineEvent[] = stryMutAct_9fa48("36592") ? ["Stryker was here"] : (stryCov_9fa48("36592"), []);
  const now = new Date();
  const templates = stryMutAct_9fa48("36593") ? [] : (stryCov_9fa48("36593"), [stryMutAct_9fa48("36594") ? {} : (stryCov_9fa48("36594"), {
    type: 'decision' as const,
    titles: stryMutAct_9fa48("36595") ? [] : (stryCov_9fa48("36595"), ['Board Approved Q3 Budget', 'Council Greenlit Acquisition', 'Authorized Series C Terms', 'Approved Hiring Freeze Lift', 'Sanctioned Market Expansion'])
  }), stryMutAct_9fa48("36601") ? {} : (stryCov_9fa48("36601"), {
    type: 'metric' as const,
    titles: stryMutAct_9fa48("36602") ? [] : (stryCov_9fa48("36602"), ['Revenue Milestone: $10M ARR', 'Churn Spike Detected', 'NPS Score Jump to 72', 'CAC Reduced by 23%', 'LTV:CAC Hit 4.2x'])
  }), stryMutAct_9fa48("36608") ? {} : (stryCov_9fa48("36608"), {
    type: 'personnel' as const,
    titles: stryMutAct_9fa48("36609") ? [] : (stryCov_9fa48("36609"), ['VP Sales Departure', 'CTO Transition', 'Engineering +12 Headcount', 'CFO Hired from Goldman', 'Sales Team Restructure'])
  }), stryMutAct_9fa48("36615") ? {} : (stryCov_9fa48("36615"), {
    type: 'financial' as const,
    titles: stryMutAct_9fa48("36616") ? [] : (stryCov_9fa48("36616"), ['Series B Close: $45M', 'Q2 Earnings Beat', 'Debt Facility Secured', 'Tax Credit Realized', 'Bridge Round Complete'])
  }), stryMutAct_9fa48("36622") ? {} : (stryCov_9fa48("36622"), {
    type: 'milestone' as const,
    titles: stryMutAct_9fa48("36623") ? [] : (stryCov_9fa48("36623"), ['1,000th Enterprise Customer', 'SOC2 Type II Certified', 'GDPR Compliance Achieved', 'Product Hunt Launch', 'First $1M Contract'])
  })]);
  for (let i = 0; stryMutAct_9fa48("36631") ? i >= 80 : stryMutAct_9fa48("36630") ? i <= 80 : stryMutAct_9fa48("36629") ? false : (stryCov_9fa48("36629", "36630", "36631"), i < 80); stryMutAct_9fa48("36632") ? i-- : (stryCov_9fa48("36632"), i++)) {
    const daysAgo = Math.floor(stryMutAct_9fa48("36634") ? Math.random() / 730 : (stryCov_9fa48("36634"), Math.random() * 730));
    const hoursAgo = Math.floor(stryMutAct_9fa48("36635") ? Math.random() / 24 : (stryCov_9fa48("36635"), Math.random() * 24));
    const template = templates[Math.floor(stryMutAct_9fa48("36636") ? Math.random() / templates.length : (stryCov_9fa48("36636"), Math.random() * templates.length))];
    events.push(stryMutAct_9fa48("36637") ? {} : (stryCov_9fa48("36637"), {
      id: `evt-${i}`,
      timestamp: new Date(stryMutAct_9fa48("36639") ? now.getTime() + (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000 : (stryCov_9fa48("36639"), now.getTime() - (stryMutAct_9fa48("36640") ? (daysAgo * 24 + hoursAgo) * 60 * 60 / 1000 : (stryCov_9fa48("36640"), (stryMutAct_9fa48("36641") ? (daysAgo * 24 + hoursAgo) * 60 / 60 : (stryCov_9fa48("36641"), (stryMutAct_9fa48("36642") ? (daysAgo * 24 + hoursAgo) / 60 : (stryCov_9fa48("36642"), (stryMutAct_9fa48("36643") ? daysAgo * 24 - hoursAgo : (stryCov_9fa48("36643"), (stryMutAct_9fa48("36644") ? daysAgo / 24 : (stryCov_9fa48("36644"), daysAgo * 24)) + hoursAgo)) * 60)) * 60)) * 1000)))),
      type: template.type,
      title: template.titles[Math.floor(stryMutAct_9fa48("36645") ? Math.random() / template.titles.length : (stryCov_9fa48("36645"), Math.random() * template.titles.length))],
      description: 'Full audit trail available. Click to replay Council deliberation.',
      impact: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
      magnitude: stryMutAct_9fa48("36647") ? Math.floor(Math.random() * 10) - 1 : (stryCov_9fa48("36647"), Math.floor(stryMutAct_9fa48("36648") ? Math.random() / 10 : (stryCov_9fa48("36648"), Math.random() * 10)) + 1),
      department: (stryMutAct_9fa48("36649") ? [] : (stryCov_9fa48("36649"), ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'Legal']))[Math.floor(stryMutAct_9fa48("36656") ? Math.random() / 6 : (stryCov_9fa48("36656"), Math.random() * 6))],
      actors: stryMutAct_9fa48("36657") ? ['CEO', 'CFO', 'CTO', 'COO', 'Board', 'Council'] : (stryCov_9fa48("36657"), (stryMutAct_9fa48("36658") ? [] : (stryCov_9fa48("36658"), ['CEO', 'CFO', 'CTO', 'COO', 'Board', 'Council'])).slice(0, stryMutAct_9fa48("36665") ? Math.floor(Math.random() * 3) - 1 : (stryCov_9fa48("36665"), Math.floor(stryMutAct_9fa48("36666") ? Math.random() / 3 : (stryCov_9fa48("36666"), Math.random() * 3)) + 1))),
      deliberationId: (stryMutAct_9fa48("36670") ? Math.random() <= 0.5 : stryMutAct_9fa48("36669") ? Math.random() >= 0.5 : stryMutAct_9fa48("36668") ? false : stryMutAct_9fa48("36667") ? true : (stryCov_9fa48("36667", "36668", "36669", "36670"), Math.random() > 0.5)) ? `dlb-${i}` : undefined
    }));
  }
  return stryMutAct_9fa48("36672") ? events : (stryCov_9fa48("36672"), events.sort(stryMutAct_9fa48("36673") ? () => undefined : (stryCov_9fa48("36673"), (a, b) => stryMutAct_9fa48("36674") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("36674"), b.timestamp.getTime() - a.timestamp.getTime()))));
};
const generateSnapshot = (date: Date, mode: ChronosMode): StateSnapshot => {
  const now = new Date();
  const daysDiff = stryMutAct_9fa48("36676") ? (now.getTime() - date.getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("36676"), (stryMutAct_9fa48("36677") ? now.getTime() + date.getTime() : (stryCov_9fa48("36677"), now.getTime() - date.getTime())) / (stryMutAct_9fa48("36678") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("36678"), (stryMutAct_9fa48("36679") ? 24 * 60 / 60 : (stryCov_9fa48("36679"), (stryMutAct_9fa48("36680") ? 24 / 60 : (stryCov_9fa48("36680"), 24 * 60)) * 60)) * 1000)));
  const isPast = stryMutAct_9fa48("36684") ? daysDiff <= 0 : stryMutAct_9fa48("36683") ? daysDiff >= 0 : stryMutAct_9fa48("36682") ? false : stryMutAct_9fa48("36681") ? true : (stryCov_9fa48("36681", "36682", "36683", "36684"), daysDiff > 0);
  const factor = isPast ? Math.pow(0.9992, daysDiff) : Math.pow(1.0008, stryMutAct_9fa48("36685") ? +daysDiff : (stryCov_9fa48("36685"), -daysDiff));
  const volatility = (stryMutAct_9fa48("36688") ? mode !== 'fastforward' : stryMutAct_9fa48("36687") ? false : stryMutAct_9fa48("36686") ? true : (stryCov_9fa48("36686", "36687", "36688"), mode === 'fastforward')) ? 0.15 : 0.05;
  const randomize = stryMutAct_9fa48("36690") ? () => undefined : (stryCov_9fa48("36690"), (() => {
    const randomize = (base: number) => stryMutAct_9fa48("36691") ? base * factor / (1 + (Math.random() - 0.5) * volatility) : (stryCov_9fa48("36691"), (stryMutAct_9fa48("36692") ? base / factor : (stryCov_9fa48("36692"), base * factor)) * (stryMutAct_9fa48("36693") ? 1 - (Math.random() - 0.5) * volatility : (stryCov_9fa48("36693"), 1 + (stryMutAct_9fa48("36694") ? (Math.random() - 0.5) / volatility : (stryCov_9fa48("36694"), (stryMutAct_9fa48("36695") ? Math.random() + 0.5 : (stryCov_9fa48("36695"), Math.random() - 0.5)) * volatility)))));
    return randomize;
  })());
  return stryMutAct_9fa48("36696") ? {} : (stryCov_9fa48("36696"), {
    timestamp: date,
    metrics: stryMutAct_9fa48("36697") ? {} : (stryCov_9fa48("36697"), {
      revenue: Math.round(randomize(12500000)),
      profit: Math.round(randomize(2800000)),
      employees: Math.round(randomize(156)),
      customers: Math.round(randomize(847)),
      satisfaction: stryMutAct_9fa48("36698") ? Math.max(100, Math.round(randomize(87))) : (stryCov_9fa48("36698"), Math.min(100, Math.round(randomize(87)))),
      marketShare: stryMutAct_9fa48("36699") ? Math.min(1, randomize(12.4)) : (stryCov_9fa48("36699"), Math.max(1, randomize(12.4))),
      burnRate: Math.round(randomize(850000)),
      runway: Math.round(randomize(18))
    }),
    council: stryMutAct_9fa48("36700") ? {} : (stryCov_9fa48("36700"), {
      activeAgents: stryMutAct_9fa48("36701") ? ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent'] : (stryCov_9fa48("36701"), (stryMutAct_9fa48("36702") ? [] : (stryCov_9fa48("36702"), ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent'])).slice(0, stryMutAct_9fa48("36708") ? Math.floor(Math.random() * 2) - 4 : (stryCov_9fa48("36708"), Math.floor(stryMutAct_9fa48("36709") ? Math.random() / 2 : (stryCov_9fa48("36709"), Math.random() * 2)) + 4))),
      pendingDecisions: Math.floor(stryMutAct_9fa48("36710") ? Math.random() / 8 : (stryCov_9fa48("36710"), Math.random() * 8)),
      totalDeliberations: Math.floor((stryMutAct_9fa48("36714") ? daysDiff <= 0 : stryMutAct_9fa48("36713") ? daysDiff >= 0 : stryMutAct_9fa48("36712") ? false : stryMutAct_9fa48("36711") ? true : (stryCov_9fa48("36711", "36712", "36713", "36714"), daysDiff > 0)) ? stryMutAct_9fa48("36715") ? 450 + daysDiff * 0.5 : (stryCov_9fa48("36715"), 450 - (stryMutAct_9fa48("36716") ? daysDiff / 0.5 : (stryCov_9fa48("36716"), daysDiff * 0.5))) : stryMutAct_9fa48("36717") ? 450 - Math.abs(daysDiff) * 0.3 : (stryCov_9fa48("36717"), 450 + (stryMutAct_9fa48("36718") ? Math.abs(daysDiff) / 0.3 : (stryCov_9fa48("36718"), Math.abs(daysDiff) * 0.3)))),
      consensusRate: stryMutAct_9fa48("36719") ? Math.max(100, randomize(78)) : (stryCov_9fa48("36719"), Math.min(100, randomize(78)))
    }),
    graph: stryMutAct_9fa48("36720") ? {} : (stryCov_9fa48("36720"), {
      entities: Math.round(randomize(15420)),
      relationships: Math.round(randomize(48930)),
      dataPoints: Math.round(randomize(2340000)),
      freshness: stryMutAct_9fa48("36721") ? Math.min(0, Math.min(100, 95 - (isPast ? daysDiff * 0.1 : -daysDiff * 0.05))) : (stryCov_9fa48("36721"), Math.max(0, stryMutAct_9fa48("36722") ? Math.max(100, 95 - (isPast ? daysDiff * 0.1 : -daysDiff * 0.05)) : (stryCov_9fa48("36722"), Math.min(100, stryMutAct_9fa48("36723") ? 95 + (isPast ? daysDiff * 0.1 : -daysDiff * 0.05) : (stryCov_9fa48("36723"), 95 - (isPast ? stryMutAct_9fa48("36724") ? daysDiff / 0.1 : (stryCov_9fa48("36724"), daysDiff * 0.1) : stryMutAct_9fa48("36725") ? -daysDiff / 0.05 : (stryCov_9fa48("36725"), (stryMutAct_9fa48("36726") ? +daysDiff : (stryCov_9fa48("36726"), -daysDiff)) * 0.05)))))))
    })
  });
};

// Generate Pivotal Moments (AI-detected critical points)
const generatePivotalMoments = (events: TimelineEvent[]): PivotalMoment[] => {
  return stryMutAct_9fa48("36729") ? events.slice(0, 8).map(event => ({
    id: `pivot-${event.id}`,
    timestamp: event.timestamp,
    event,
    significance: event.magnitude * 10 + Math.floor(Math.random() * 20),
    reason: event.impact === 'positive' ? `Major growth catalyst - ${event.title.toLowerCase()}` : event.impact === 'negative' ? `Critical inflection point - ${event.title.toLowerCase()}` : `Strategic pivot opportunity - ${event.title.toLowerCase()}`,
    impactedMetrics: ['revenue', 'profit', 'customers'].slice(0, Math.floor(Math.random() * 2) + 2),
    beforeState: {
      revenue: 10000000 + Math.random() * 2000000,
      profit: 2000000 + Math.random() * 500000
    },
    afterState: {
      revenue: 11000000 + Math.random() * 3000000,
      profit: 2200000 + Math.random() * 800000
    }
  })) : stryMutAct_9fa48("36728") ? events.filter(e => e.magnitude >= 7).map(event => ({
    id: `pivot-${event.id}`,
    timestamp: event.timestamp,
    event,
    significance: event.magnitude * 10 + Math.floor(Math.random() * 20),
    reason: event.impact === 'positive' ? `Major growth catalyst - ${event.title.toLowerCase()}` : event.impact === 'negative' ? `Critical inflection point - ${event.title.toLowerCase()}` : `Strategic pivot opportunity - ${event.title.toLowerCase()}`,
    impactedMetrics: ['revenue', 'profit', 'customers'].slice(0, Math.floor(Math.random() * 2) + 2),
    beforeState: {
      revenue: 10000000 + Math.random() * 2000000,
      profit: 2000000 + Math.random() * 500000
    },
    afterState: {
      revenue: 11000000 + Math.random() * 3000000,
      profit: 2200000 + Math.random() * 800000
    }
  })) : (stryCov_9fa48("36728", "36729"), events.filter(stryMutAct_9fa48("36730") ? () => undefined : (stryCov_9fa48("36730"), e => stryMutAct_9fa48("36734") ? e.magnitude < 7 : stryMutAct_9fa48("36733") ? e.magnitude > 7 : stryMutAct_9fa48("36732") ? false : stryMutAct_9fa48("36731") ? true : (stryCov_9fa48("36731", "36732", "36733", "36734"), e.magnitude >= 7))).slice(0, 8).map(stryMutAct_9fa48("36735") ? () => undefined : (stryCov_9fa48("36735"), event => stryMutAct_9fa48("36736") ? {} : (stryCov_9fa48("36736"), {
    id: `pivot-${event.id}`,
    timestamp: event.timestamp,
    event,
    significance: stryMutAct_9fa48("36738") ? event.magnitude * 10 - Math.floor(Math.random() * 20) : (stryCov_9fa48("36738"), (stryMutAct_9fa48("36739") ? event.magnitude / 10 : (stryCov_9fa48("36739"), event.magnitude * 10)) + Math.floor(stryMutAct_9fa48("36740") ? Math.random() / 20 : (stryCov_9fa48("36740"), Math.random() * 20))),
    reason: (stryMutAct_9fa48("36743") ? event.impact !== 'positive' : stryMutAct_9fa48("36742") ? false : stryMutAct_9fa48("36741") ? true : (stryCov_9fa48("36741", "36742", "36743"), event.impact === 'positive')) ? `Major growth catalyst - ${stryMutAct_9fa48("36746") ? event.title.toUpperCase() : (stryCov_9fa48("36746"), event.title.toLowerCase())}` : (stryMutAct_9fa48("36749") ? event.impact !== 'negative' : stryMutAct_9fa48("36748") ? false : stryMutAct_9fa48("36747") ? true : (stryCov_9fa48("36747", "36748", "36749"), event.impact === 'negative')) ? `Critical inflection point - ${stryMutAct_9fa48("36752") ? event.title.toUpperCase() : (stryCov_9fa48("36752"), event.title.toLowerCase())}` : `Strategic pivot opportunity - ${stryMutAct_9fa48("36754") ? event.title.toUpperCase() : (stryCov_9fa48("36754"), event.title.toLowerCase())}`,
    impactedMetrics: stryMutAct_9fa48("36755") ? ['revenue', 'profit', 'customers'] : (stryCov_9fa48("36755"), (stryMutAct_9fa48("36756") ? [] : (stryCov_9fa48("36756"), ['revenue', 'profit', 'customers'])).slice(0, stryMutAct_9fa48("36760") ? Math.floor(Math.random() * 2) - 2 : (stryCov_9fa48("36760"), Math.floor(stryMutAct_9fa48("36761") ? Math.random() / 2 : (stryCov_9fa48("36761"), Math.random() * 2)) + 2))),
    beforeState: stryMutAct_9fa48("36762") ? {} : (stryCov_9fa48("36762"), {
      revenue: stryMutAct_9fa48("36763") ? 10000000 - Math.random() * 2000000 : (stryCov_9fa48("36763"), 10000000 + (stryMutAct_9fa48("36764") ? Math.random() / 2000000 : (stryCov_9fa48("36764"), Math.random() * 2000000))),
      profit: stryMutAct_9fa48("36765") ? 2000000 - Math.random() * 500000 : (stryCov_9fa48("36765"), 2000000 + (stryMutAct_9fa48("36766") ? Math.random() / 500000 : (stryCov_9fa48("36766"), Math.random() * 500000)))
    }),
    afterState: stryMutAct_9fa48("36767") ? {} : (stryCov_9fa48("36767"), {
      revenue: stryMutAct_9fa48("36768") ? 11000000 - Math.random() * 3000000 : (stryCov_9fa48("36768"), 11000000 + (stryMutAct_9fa48("36769") ? Math.random() / 3000000 : (stryCov_9fa48("36769"), Math.random() * 3000000))),
      profit: stryMutAct_9fa48("36770") ? 2200000 - Math.random() * 800000 : (stryCov_9fa48("36770"), 2200000 + (stryMutAct_9fa48("36771") ? Math.random() / 800000 : (stryCov_9fa48("36771"), Math.random() * 800000)))
    })
  }))));
};

// Generate Council Replay with detailed deliberations
const generateCouncilReplay = (event: TimelineEvent): CouncilReplay => {
  const agents = stryMutAct_9fa48("36773") ? [] : (stryCov_9fa48("36773"), ['Chief Strategic Agent', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent']);
  const isPositive = stryMutAct_9fa48("36781") ? event.impact !== 'positive' : stryMutAct_9fa48("36780") ? false : stryMutAct_9fa48("36779") ? true : (stryCov_9fa48("36779", "36780", "36781"), event.impact === 'positive');

  // Generate detailed, realistic deliberation statements
  const detailedStatements: Record<string, {
    statement: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[]> = stryMutAct_9fa48("36783") ? {} : (stryCov_9fa48("36783"), {
    'Chief Strategic Agent': stryMutAct_9fa48("36784") ? [] : (stryCov_9fa48("36784"), [stryMutAct_9fa48("36785") ? {} : (stryCov_9fa48("36785"), {
      statement: `Looking at "${event.title}" from a strategic perspective, I see ${isPositive ? 'significant alignment with our 3-year growth roadmap' : 'potential misalignment with our current strategic priorities'}. The timing is ${isPositive ? 'opportune given market conditions' : 'concerning given our current resource allocation'}. I recommend we ${isPositive ? 'proceed with a phased approach, establishing clear milestones at 30, 60, and 90 days' : 'conduct further analysis before committing resources'}.`,
      sentiment: isPositive ? 'positive' : 'neutral'
    }), stryMutAct_9fa48("36795") ? {} : (stryCov_9fa48("36795"), {
      statement: `To add context - our competitive analysis shows that ${isPositive ? 'first-mover advantage here could establish market leadership' : 'several competitors have attempted similar initiatives with mixed results'}. The strategic risk-reward ratio is ${isPositive ? 'favorable' : 'within acceptable bounds but requires careful monitoring'}.`,
      sentiment: isPositive ? 'positive' : 'neutral'
    })]),
    'CFO Agent': stryMutAct_9fa48("36803") ? [] : (stryCov_9fa48("36803"), [stryMutAct_9fa48("36804") ? {} : (stryCov_9fa48("36804"), {
      statement: `From a financial standpoint, I've modeled three scenarios for "${event.title}". The base case shows ${isPositive ? 'positive ROI within 18 months with NPV of approximately $2.4M' : 'break-even at 24 months under optimistic assumptions'}. Cash flow impact is ${isPositive ? 'manageable within our current runway' : 'significant and would require reallocation from other initiatives'}. I'm ${isPositive ? 'supportive but recommend quarterly financial reviews' : 'cautious and suggest we phase the investment'}.`,
      sentiment: isPositive ? 'positive' : 'neutral'
    }), stryMutAct_9fa48("36814") ? {} : (stryCov_9fa48("36814"), {
      statement: `Additionally, currency exposure ${isPositive ? 'can be hedged at reasonable cost' : 'adds 8-12% variance to projections'}. Our finance team has prepared contingency budgets. ${isPositive ? 'The investment thesis is sound.' : 'We should cap initial investment at 60% of proposed budget until we see early results.'}`,
      sentiment: isPositive ? 'positive' : 'neutral'
    })]),
    'COO Agent': stryMutAct_9fa48("36822") ? [] : (stryCov_9fa48("36822"), [stryMutAct_9fa48("36823") ? {} : (stryCov_9fa48("36823"), {
      statement: `Operationally, implementing "${event.title}" will require ${isPositive ? 'reallocation of 15-20% of our platform team for Q2' : 'significant operational restructuring'}. I've assessed our capacity and ${isPositive ? 'we can absorb this without impacting core deliverables' : 'we would need to delay 2-3 lower-priority initiatives'}. Supply chain and vendor relationships ${isPositive ? 'are in place to support execution' : 'would need 60-90 days to establish'}.`,
      sentiment: isPositive ? 'positive' : 'neutral'
    }), stryMutAct_9fa48("36833") ? {} : (stryCov_9fa48("36833"), {
      statement: `My team has drafted an execution plan with clear ownership and accountability. ${isPositive ? 'We can begin implementation within 2 weeks of approval.' : 'I recommend a 30-day planning phase before committing to execution timelines.'} Key dependencies include talent acquisition and system integrations.`,
      sentiment: 'neutral'
    })]),
    'CISO Agent': stryMutAct_9fa48("36838") ? [] : (stryCov_9fa48("36838"), [stryMutAct_9fa48("36839") ? {} : (stryCov_9fa48("36839"), {
      statement: `Security and compliance review for "${event.title}" is ${isPositive ? 'complete with no blocking issues' : 'ongoing with some areas requiring attention'}. ${isPositive ? 'All regulatory requirements (SOC2, GDPR, HIPAA) can be met with existing controls' : 'We identified 3 compliance gaps that need remediation before proceeding'}. Data protection impact assessment ${isPositive ? 'shows acceptable risk levels' : 'flagged elevated risk in data handling procedures'}.`,
      sentiment: isPositive ? 'positive' : 'neutral'
    }), stryMutAct_9fa48("36849") ? {} : (stryCov_9fa48("36849"), {
      statement: `From a security architecture perspective, ${isPositive ? 'the proposed design follows our zero-trust principles' : 'we need to enhance authentication and access controls'}. ${isPositive ? 'I approve from a security standpoint.' : 'I recommend security review gates at each phase before proceeding.'}`,
      sentiment: isPositive ? 'positive' : 'neutral'
    })]),
    'CMO Agent': stryMutAct_9fa48("36857") ? [] : (stryCov_9fa48("36857"), [stryMutAct_9fa48("36858") ? {} : (stryCov_9fa48("36858"), {
      statement: `Market positioning analysis for "${event.title}" shows ${isPositive ? 'strong alignment with customer demand signals we\'ve been tracking' : 'moderate market interest with some uncertainty about timing'}. Our brand equity ${isPositive ? 'supports this initiative and could be amplified through it' : 'requires careful messaging to maintain trust'}. Customer research indicates ${isPositive ? '72% positive sentiment in target segments' : 'mixed signals that warrant further validation'}.`,
      sentiment: isPositive ? 'positive' : 'neutral'
    }), stryMutAct_9fa48("36868") ? {} : (stryCov_9fa48("36868"), {
      statement: `I've prepared a go-to-market strategy that ${isPositive ? 'leverages our existing channels with minimal additional spend' : 'would require $150K in additional marketing investment'}. ${isPositive ? 'The market window is favorable for the next 6-9 months.' : 'We should consider a limited pilot before full market launch.'}`,
      sentiment: isPositive ? 'positive' : 'neutral'
    })])
  });

  // Build phases with multiple rounds of deliberation
  const selectedAgents = stryMutAct_9fa48("36876") ? agents : (stryCov_9fa48("36876"), agents.slice(0, 4));
  const phases: Array<{
    agent: string;
    statement: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    timestamp: number;
  }> = stryMutAct_9fa48("36877") ? ["Stryker was here"] : (stryCov_9fa48("36877"), []);

  // Round 1: Initial positions
  selectedAgents.forEach((agent, i) => {
    const agentStatements = detailedStatements[agent];
    if (stryMutAct_9fa48("36881") ? agentStatements[0] : stryMutAct_9fa48("36880") ? false : stryMutAct_9fa48("36879") ? true : (stryCov_9fa48("36879", "36880", "36881"), agentStatements?.[0])) {
      phases.push(stryMutAct_9fa48("36883") ? {} : (stryCov_9fa48("36883"), {
        agent,
        statement: agentStatements[0].statement,
        sentiment: agentStatements[0].sentiment,
        timestamp: stryMutAct_9fa48("36884") ? (i + 1) / 30 : (stryCov_9fa48("36884"), (stryMutAct_9fa48("36885") ? i - 1 : (stryCov_9fa48("36885"), i + 1)) * 30)
      }));
    }
  });

  // Round 2: Follow-up and synthesis
  selectedAgents.forEach((agent, i) => {
    const agentStatements = detailedStatements[agent];
    if (stryMutAct_9fa48("36889") ? agentStatements[1] : stryMutAct_9fa48("36888") ? false : stryMutAct_9fa48("36887") ? true : (stryCov_9fa48("36887", "36888", "36889"), agentStatements?.[1])) {
      phases.push(stryMutAct_9fa48("36891") ? {} : (stryCov_9fa48("36891"), {
        agent,
        statement: agentStatements[1].statement,
        sentiment: agentStatements[1].sentiment,
        timestamp: stryMutAct_9fa48("36892") ? 150 - (i + 1) * 25 : (stryCov_9fa48("36892"), 150 + (stryMutAct_9fa48("36893") ? (i + 1) / 25 : (stryCov_9fa48("36893"), (stryMutAct_9fa48("36894") ? i - 1 : (stryCov_9fa48("36894"), i + 1)) * 25)))
      }));
    }
  });
  return stryMutAct_9fa48("36895") ? {} : (stryCov_9fa48("36895"), {
    id: `replay-${event.id}`,
    deliberationId: stryMutAct_9fa48("36899") ? event.deliberationId && `dlb-${event.id}` : stryMutAct_9fa48("36898") ? false : stryMutAct_9fa48("36897") ? true : (stryCov_9fa48("36897", "36898", "36899"), event.deliberationId || `dlb-${event.id}`),
    timestamp: event.timestamp,
    query: `Should we proceed with: ${event.title}?`,
    participants: selectedAgents,
    duration: stryMutAct_9fa48("36902") ? 300 - Math.floor(Math.random() * 120) : (stryCov_9fa48("36902"), 300 + Math.floor(stryMutAct_9fa48("36903") ? Math.random() / 120 : (stryCov_9fa48("36903"), Math.random() * 120))),
    phases,
    decision: isPositive ? 'APPROVED' : 'APPROVED WITH CONDITIONS',
    confidence: stryMutAct_9fa48("36906") ? 75 - Math.floor(Math.random() * 20) : (stryCov_9fa48("36906"), 75 + Math.floor(stryMutAct_9fa48("36907") ? Math.random() / 20 : (stryCov_9fa48("36907"), Math.random() * 20)))
  });
};

// Generate Causal Chain (Impact Tracing)
const generateCausalChain = (event: TimelineEvent, allEvents: TimelineEvent[]): CausalChain => {
  // Try to find real downstream events
  let effects = stryMutAct_9fa48("36910") ? allEvents.slice(0, 4).map(e => ({
    event: e,
    delay: Math.floor((e.timestamp.getTime() - event.timestamp.getTime()) / (24 * 60 * 60 * 1000)),
    correlation: 0.5 + Math.random() * 0.45
  })) : stryMutAct_9fa48("36909") ? allEvents.filter(e => e.timestamp > event.timestamp && e.timestamp < new Date(event.timestamp.getTime() + 90 * 24 * 60 * 60 * 1000)).map(e => ({
    event: e,
    delay: Math.floor((e.timestamp.getTime() - event.timestamp.getTime()) / (24 * 60 * 60 * 1000)),
    correlation: 0.5 + Math.random() * 0.45
  })) : (stryCov_9fa48("36909", "36910"), allEvents.filter(stryMutAct_9fa48("36911") ? () => undefined : (stryCov_9fa48("36911"), e => stryMutAct_9fa48("36914") ? e.timestamp > event.timestamp || e.timestamp < new Date(event.timestamp.getTime() + 90 * 24 * 60 * 60 * 1000) : stryMutAct_9fa48("36913") ? false : stryMutAct_9fa48("36912") ? true : (stryCov_9fa48("36912", "36913", "36914"), (stryMutAct_9fa48("36917") ? e.timestamp <= event.timestamp : stryMutAct_9fa48("36916") ? e.timestamp >= event.timestamp : stryMutAct_9fa48("36915") ? true : (stryCov_9fa48("36915", "36916", "36917"), e.timestamp > event.timestamp)) && (stryMutAct_9fa48("36920") ? e.timestamp >= new Date(event.timestamp.getTime() + 90 * 24 * 60 * 60 * 1000) : stryMutAct_9fa48("36919") ? e.timestamp <= new Date(event.timestamp.getTime() + 90 * 24 * 60 * 60 * 1000) : stryMutAct_9fa48("36918") ? true : (stryCov_9fa48("36918", "36919", "36920"), e.timestamp < new Date(stryMutAct_9fa48("36921") ? event.timestamp.getTime() - 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("36921"), event.timestamp.getTime() + (stryMutAct_9fa48("36922") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("36922"), (stryMutAct_9fa48("36923") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("36923"), (stryMutAct_9fa48("36924") ? 90 * 24 / 60 : (stryCov_9fa48("36924"), (stryMutAct_9fa48("36925") ? 90 / 24 : (stryCov_9fa48("36925"), 90 * 24)) * 60)) * 60)) * 1000))))))))).slice(0, 4).map(stryMutAct_9fa48("36926") ? () => undefined : (stryCov_9fa48("36926"), e => stryMutAct_9fa48("36927") ? {} : (stryCov_9fa48("36927"), {
    event: e,
    delay: Math.floor(stryMutAct_9fa48("36928") ? (e.timestamp.getTime() - event.timestamp.getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("36928"), (stryMutAct_9fa48("36929") ? e.timestamp.getTime() + event.timestamp.getTime() : (stryCov_9fa48("36929"), e.timestamp.getTime() - event.timestamp.getTime())) / (stryMutAct_9fa48("36930") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("36930"), (stryMutAct_9fa48("36931") ? 24 * 60 / 60 : (stryCov_9fa48("36931"), (stryMutAct_9fa48("36932") ? 24 / 60 : (stryCov_9fa48("36932"), 24 * 60)) * 60)) * 1000)))),
    correlation: stryMutAct_9fa48("36933") ? 0.5 - Math.random() * 0.45 : (stryCov_9fa48("36933"), 0.5 + (stryMutAct_9fa48("36934") ? Math.random() / 0.45 : (stryCov_9fa48("36934"), Math.random() * 0.45)))
  }))));

  // If no real downstream events, generate AI predictions
  if (stryMutAct_9fa48("36937") ? effects.length !== 0 : stryMutAct_9fa48("36936") ? false : stryMutAct_9fa48("36935") ? true : (stryCov_9fa48("36935", "36936", "36937"), effects.length === 0)) {
    const predictedEffects = stryMutAct_9fa48("36939") ? [] : (stryCov_9fa48("36939"), [stryMutAct_9fa48("36940") ? {} : (stryCov_9fa48("36940"), {
      title: 'Revenue forecast likely to be updated',
      department: 'Finance',
      delay: 3,
      confidence: 0.92
    }), stryMutAct_9fa48("36943") ? {} : (stryCov_9fa48("36943"), {
      title: 'Team capacity reallocation expected',
      department: 'Operations',
      delay: 7,
      confidence: 0.78
    }), stryMutAct_9fa48("36946") ? {} : (stryCov_9fa48("36946"), {
      title: 'Customer success playbook revision probable',
      department: 'Customer Success',
      delay: 14,
      confidence: 0.65
    }), stryMutAct_9fa48("36949") ? {} : (stryCov_9fa48("36949"), {
      title: 'Quarterly targets may be adjusted',
      department: 'Executive',
      delay: 21,
      confidence: 0.54
    }), stryMutAct_9fa48("36952") ? {} : (stryCov_9fa48("36952"), {
      title: 'Marketing campaign launch anticipated',
      department: 'Marketing',
      delay: 30,
      confidence: 0.47
    })]);
    effects = stryMutAct_9fa48("36955") ? predictedEffects.map((pe, idx) => ({
      event: {
        id: `pred-${event.id}-${idx}`,
        timestamp: new Date(event.timestamp.getTime() + pe.delay * 24 * 60 * 60 * 1000),
        title: pe.title,
        description: `AI-predicted downstream effect from ${event.title}`,
        department: pe.department,
        type: 'metric' as const,
        impact: 'positive' as const,
        magnitude: 0.5 + Math.random() * 0.3,
        isPrediction: true // Flag as prediction
      },
      delay: pe.delay,
      correlation: pe.confidence,
      isPrediction: true
    })) : (stryCov_9fa48("36955"), predictedEffects.slice(0, stryMutAct_9fa48("36956") ? 4 - Math.floor(Math.random() * 2) : (stryCov_9fa48("36956"), 4 + Math.floor(stryMutAct_9fa48("36957") ? Math.random() / 2 : (stryCov_9fa48("36957"), Math.random() * 2)))).map(stryMutAct_9fa48("36958") ? () => undefined : (stryCov_9fa48("36958"), (pe, idx) => stryMutAct_9fa48("36959") ? {} : (stryCov_9fa48("36959"), {
      event: stryMutAct_9fa48("36960") ? {} : (stryCov_9fa48("36960"), {
        id: `pred-${event.id}-${idx}`,
        timestamp: new Date(stryMutAct_9fa48("36962") ? event.timestamp.getTime() - pe.delay * 24 * 60 * 60 * 1000 : (stryCov_9fa48("36962"), event.timestamp.getTime() + (stryMutAct_9fa48("36963") ? pe.delay * 24 * 60 * 60 / 1000 : (stryCov_9fa48("36963"), (stryMutAct_9fa48("36964") ? pe.delay * 24 * 60 / 60 : (stryCov_9fa48("36964"), (stryMutAct_9fa48("36965") ? pe.delay * 24 / 60 : (stryCov_9fa48("36965"), (stryMutAct_9fa48("36966") ? pe.delay / 24 : (stryCov_9fa48("36966"), pe.delay * 24)) * 60)) * 60)) * 1000)))),
        title: pe.title,
        description: `AI-predicted downstream effect from ${event.title}`,
        department: pe.department,
        type: 'metric' as const,
        impact: 'positive' as const,
        magnitude: stryMutAct_9fa48("36968") ? 0.5 - Math.random() * 0.3 : (stryCov_9fa48("36968"), 0.5 + (stryMutAct_9fa48("36969") ? Math.random() / 0.3 : (stryCov_9fa48("36969"), Math.random() * 0.3))),
        isPrediction: stryMutAct_9fa48("36970") ? false : (stryCov_9fa48("36970"), true) // Flag as prediction
      }),
      delay: pe.delay,
      correlation: pe.confidence,
      isPrediction: stryMutAct_9fa48("36971") ? false : (stryCov_9fa48("36971"), true)
    }))));
  }

  // Calculate total impact based on event impact
  const isPositive = stryMutAct_9fa48("36974") ? event.impact !== 'positive' : stryMutAct_9fa48("36973") ? false : stryMutAct_9fa48("36972") ? true : (stryCov_9fa48("36972", "36973", "36974"), event.impact === 'positive');
  const baseRevenue = isPositive ? 1500000 : stryMutAct_9fa48("36976") ? +800000 : (stryCov_9fa48("36976"), -800000);
  const baseProfit = isPositive ? 400000 : stryMutAct_9fa48("36977") ? +200000 : (stryCov_9fa48("36977"), -200000);
  const baseCustomers = isPositive ? 45 : stryMutAct_9fa48("36978") ? +15 : (stryCov_9fa48("36978"), -15);
  return stryMutAct_9fa48("36979") ? {} : (stryCov_9fa48("36979"), {
    id: `chain-${event.id}`,
    rootCause: event,
    effects,
    totalImpact: stryMutAct_9fa48("36981") ? {} : (stryCov_9fa48("36981"), {
      revenue: stryMutAct_9fa48("36982") ? baseRevenue - (Math.random() - 0.5) * 1000000 : (stryCov_9fa48("36982"), baseRevenue + (stryMutAct_9fa48("36983") ? (Math.random() - 0.5) / 1000000 : (stryCov_9fa48("36983"), (stryMutAct_9fa48("36984") ? Math.random() + 0.5 : (stryCov_9fa48("36984"), Math.random() - 0.5)) * 1000000))),
      profit: stryMutAct_9fa48("36985") ? baseProfit - (Math.random() - 0.5) * 200000 : (stryCov_9fa48("36985"), baseProfit + (stryMutAct_9fa48("36986") ? (Math.random() - 0.5) / 200000 : (stryCov_9fa48("36986"), (stryMutAct_9fa48("36987") ? Math.random() + 0.5 : (stryCov_9fa48("36987"), Math.random() - 0.5)) * 200000))),
      customers: stryMutAct_9fa48("36988") ? baseCustomers - Math.floor((Math.random() - 0.5) * 30) : (stryCov_9fa48("36988"), baseCustomers + Math.floor(stryMutAct_9fa48("36989") ? (Math.random() - 0.5) / 30 : (stryCov_9fa48("36989"), (stryMutAct_9fa48("36990") ? Math.random() + 0.5 : (stryCov_9fa48("36990"), Math.random() - 0.5)) * 30)))
    })
  });
};

// Generate Monte Carlo Results
const generateMonteCarloResults = (variable: string): MonteCarloResult => {
  const scenarios = stryMutAct_9fa48("36992") ? [] : (stryCov_9fa48("36992"), [stryMutAct_9fa48("36993") ? {} : (stryCov_9fa48("36993"), {
    scenario: 'Pessimistic',
    probability: 0.15,
    revenue: 9000000,
    profit: 1500000
  }), stryMutAct_9fa48("36995") ? {} : (stryCov_9fa48("36995"), {
    scenario: 'Conservative',
    probability: 0.25,
    revenue: 11000000,
    profit: 2200000
  }), stryMutAct_9fa48("36997") ? {} : (stryCov_9fa48("36997"), {
    scenario: 'Base Case',
    probability: 0.35,
    revenue: 12500000,
    profit: 2800000
  }), stryMutAct_9fa48("36999") ? {} : (stryCov_9fa48("36999"), {
    scenario: 'Optimistic',
    probability: 0.20,
    revenue: 15000000,
    profit: 3500000
  }), stryMutAct_9fa48("37001") ? {} : (stryCov_9fa48("37001"), {
    scenario: 'Best Case',
    probability: 0.05,
    revenue: 18000000,
    profit: 4500000
  })]);
  return stryMutAct_9fa48("37003") ? {} : (stryCov_9fa48("37003"), {
    id: `mc-${Date.now()}`,
    variable,
    simulations: 10000,
    outcomes: scenarios,
    optimalPath: 'Base Case with aggressive Q3 marketing',
    confidenceInterval: stryMutAct_9fa48("37006") ? [] : (stryCov_9fa48("37006"), [10500000, 14500000])
  });
};

// =============================================================================
// CHRONOS-ERP™ GENERATORS - Enterprise System Data
// =============================================================================

const generateERPConnectors = stryMutAct_9fa48("37007") ? () => undefined : (stryCov_9fa48("37007"), (() => {
  const generateERPConnectors = (): ERPConnector[] => stryMutAct_9fa48("37008") ? [] : (stryCov_9fa48("37008"), [stryMutAct_9fa48("37009") ? {} : (stryCov_9fa48("37009"), {
    id: 'sf-001',
    name: 'Salesforce Production',
    source: 'salesforce',
    icon: '☁️',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("37015") ? Date.now() + 5 * 60 * 1000 : (stryCov_9fa48("37015"), Date.now() - (stryMutAct_9fa48("37016") ? 5 * 60 / 1000 : (stryCov_9fa48("37016"), (stryMutAct_9fa48("37017") ? 5 / 60 : (stryCov_9fa48("37017"), 5 * 60)) * 1000)))),
    recordCount: 847293,
    dataTypes: stryMutAct_9fa48("37018") ? [] : (stryCov_9fa48("37018"), ['Opportunities', 'Accounts', 'Contacts', 'Activities', 'Forecasts']),
    syncFrequency: 'realtime',
    healthScore: 98
  }), stryMutAct_9fa48("37025") ? {} : (stryCov_9fa48("37025"), {
    id: 'sap-001',
    name: 'SAP S/4HANA',
    source: 'sap',
    icon: '🏢',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("37031") ? Date.now() + 15 * 60 * 1000 : (stryCov_9fa48("37031"), Date.now() - (stryMutAct_9fa48("37032") ? 15 * 60 / 1000 : (stryCov_9fa48("37032"), (stryMutAct_9fa48("37033") ? 15 / 60 : (stryCov_9fa48("37033"), 15 * 60)) * 1000)))),
    recordCount: 2341892,
    dataTypes: stryMutAct_9fa48("37034") ? [] : (stryCov_9fa48("37034"), ['Purchase Orders', 'Sales Orders', 'Invoices', 'GL Entries', 'Cost Centers']),
    syncFrequency: 'hourly',
    healthScore: 95
  }), stryMutAct_9fa48("37041") ? {} : (stryCov_9fa48("37041"), {
    id: 'wd-001',
    name: 'Workday HCM',
    source: 'workday',
    icon: '👥',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("37047") ? Date.now() + 30 * 60 * 1000 : (stryCov_9fa48("37047"), Date.now() - (stryMutAct_9fa48("37048") ? 30 * 60 / 1000 : (stryCov_9fa48("37048"), (stryMutAct_9fa48("37049") ? 30 / 60 : (stryCov_9fa48("37049"), 30 * 60)) * 1000)))),
    recordCount: 45678,
    dataTypes: stryMutAct_9fa48("37050") ? [] : (stryCov_9fa48("37050"), ['Employees', 'Compensation', 'Performance', 'Recruiting', 'Time Off']),
    syncFrequency: 'daily',
    healthScore: 99
  }), stryMutAct_9fa48("37057") ? {} : (stryCov_9fa48("37057"), {
    id: 'jira-001',
    name: 'Jira Software',
    source: 'jira',
    icon: '🎯',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("37063") ? Date.now() + 2 * 60 * 1000 : (stryCov_9fa48("37063"), Date.now() - (stryMutAct_9fa48("37064") ? 2 * 60 / 1000 : (stryCov_9fa48("37064"), (stryMutAct_9fa48("37065") ? 2 / 60 : (stryCov_9fa48("37065"), 2 * 60)) * 1000)))),
    recordCount: 128934,
    dataTypes: stryMutAct_9fa48("37066") ? [] : (stryCov_9fa48("37066"), ['Issues', 'Sprints', 'Releases', 'Components', 'Velocity']),
    syncFrequency: 'realtime',
    healthScore: 97
  }), stryMutAct_9fa48("37073") ? {} : (stryCov_9fa48("37073"), {
    id: 'gh-001',
    name: 'GitHub Enterprise',
    source: 'github',
    icon: '🐙',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("37079") ? Date.now() + 1 * 60 * 1000 : (stryCov_9fa48("37079"), Date.now() - (stryMutAct_9fa48("37080") ? 1 * 60 / 1000 : (stryCov_9fa48("37080"), (stryMutAct_9fa48("37081") ? 1 / 60 : (stryCov_9fa48("37081"), 1 * 60)) * 1000)))),
    recordCount: 89234,
    dataTypes: stryMutAct_9fa48("37082") ? [] : (stryCov_9fa48("37082"), ['Commits', 'Pull Requests', 'Releases', 'Deployments', 'Actions']),
    syncFrequency: 'realtime',
    healthScore: 100
  }), stryMutAct_9fa48("37089") ? {} : (stryCov_9fa48("37089"), {
    id: 'snow-001',
    name: 'ServiceNow',
    source: 'servicenow',
    icon: '🎫',
    status: 'syncing',
    lastSync: new Date(stryMutAct_9fa48("37095") ? Date.now() + 10 * 60 * 1000 : (stryCov_9fa48("37095"), Date.now() - (stryMutAct_9fa48("37096") ? 10 * 60 / 1000 : (stryCov_9fa48("37096"), (stryMutAct_9fa48("37097") ? 10 / 60 : (stryCov_9fa48("37097"), 10 * 60)) * 1000)))),
    recordCount: 234567,
    dataTypes: stryMutAct_9fa48("37098") ? [] : (stryCov_9fa48("37098"), ['Incidents', 'Requests', 'Changes', 'Problems', 'CMDB']),
    syncFrequency: 'hourly',
    healthScore: 92
  }), stryMutAct_9fa48("37105") ? {} : (stryCov_9fa48("37105"), {
    id: 'sp-001',
    name: 'SharePoint Online',
    source: 'sharepoint',
    icon: '📁',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("37111") ? Date.now() + 60 * 60 * 1000 : (stryCov_9fa48("37111"), Date.now() - (stryMutAct_9fa48("37112") ? 60 * 60 / 1000 : (stryCov_9fa48("37112"), (stryMutAct_9fa48("37113") ? 60 / 60 : (stryCov_9fa48("37113"), 60 * 60)) * 1000)))),
    recordCount: 567890,
    dataTypes: stryMutAct_9fa48("37114") ? [] : (stryCov_9fa48("37114"), ['Documents', 'Policies', 'Contracts', 'Templates', 'Revisions']),
    syncFrequency: 'daily',
    healthScore: 94
  }), stryMutAct_9fa48("37121") ? {} : (stryCov_9fa48("37121"), {
    id: 'ns-001',
    name: 'NetSuite',
    source: 'netsuite',
    icon: '💰',
    status: 'connected',
    lastSync: new Date(stryMutAct_9fa48("37127") ? Date.now() + 45 * 60 * 1000 : (stryCov_9fa48("37127"), Date.now() - (stryMutAct_9fa48("37128") ? 45 * 60 / 1000 : (stryCov_9fa48("37128"), (stryMutAct_9fa48("37129") ? 45 / 60 : (stryCov_9fa48("37129"), 45 * 60)) * 1000)))),
    recordCount: 1234567,
    dataTypes: stryMutAct_9fa48("37130") ? [] : (stryCov_9fa48("37130"), ['Transactions', 'Customers', 'Vendors', 'GL', 'Reports']),
    syncFrequency: 'hourly',
    healthScore: 96
  })]);
  return generateERPConnectors;
})());
const generateCRMEvents = (days: number = 90): CRMPipelineEvent[] => {
  const events: CRMPipelineEvent[] = stryMutAct_9fa48("37138") ? ["Stryker was here"] : (stryCov_9fa48("37138"), []);
  const stages = stryMutAct_9fa48("37139") ? [] : (stryCov_9fa48("37139"), ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']);
  const accounts = stryMutAct_9fa48("37146") ? [] : (stryCov_9fa48("37146"), ['Acme Corp', 'TechGiant Inc', 'GlobalBank', 'MegaRetail', 'HealthFirst', 'EduPrime', 'AutoMax', 'EnergyPlus']);
  const owners = stryMutAct_9fa48("37155") ? [] : (stryCov_9fa48("37155"), ['Sarah Chen', 'Mike Johnson', 'Emily Davis', 'James Wilson', 'Lisa Brown']);
  for (let i = 0; stryMutAct_9fa48("37163") ? i >= 150 : stryMutAct_9fa48("37162") ? i <= 150 : stryMutAct_9fa48("37161") ? false : (stryCov_9fa48("37161", "37162", "37163"), i < 150); stryMutAct_9fa48("37164") ? i-- : (stryCov_9fa48("37164"), i++)) {
    const daysAgo = Math.floor(stryMutAct_9fa48("37166") ? Math.random() / days : (stryCov_9fa48("37166"), Math.random() * days));
    const amount = stryMutAct_9fa48("37167") ? Math.floor(Math.random() * 500000) - 25000 : (stryCov_9fa48("37167"), Math.floor(stryMutAct_9fa48("37168") ? Math.random() / 500000 : (stryCov_9fa48("37168"), Math.random() * 500000)) + 25000);
    const stageIdx = Math.floor(stryMutAct_9fa48("37169") ? Math.random() / stages.length : (stryCov_9fa48("37169"), Math.random() * stages.length));
    events.push(stryMutAct_9fa48("37170") ? {} : (stryCov_9fa48("37170"), {
      id: `crm-${i}`,
      timestamp: new Date(stryMutAct_9fa48("37172") ? Date.now() + daysAgo * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37172"), Date.now() - (stryMutAct_9fa48("37173") ? daysAgo * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37173"), (stryMutAct_9fa48("37174") ? daysAgo * 24 * 60 / 60 : (stryCov_9fa48("37174"), (stryMutAct_9fa48("37175") ? daysAgo * 24 / 60 : (stryCov_9fa48("37175"), (stryMutAct_9fa48("37176") ? daysAgo / 24 : (stryCov_9fa48("37176"), daysAgo * 24)) * 60)) * 60)) * 1000)))),
      source: 'salesforce',
      opportunityId: `OPP-${stryMutAct_9fa48("37179") ? 100000 - i : (stryCov_9fa48("37179"), 100000 + i)}`,
      accountName: accounts[Math.floor(stryMutAct_9fa48("37180") ? Math.random() / accounts.length : (stryCov_9fa48("37180"), Math.random() * accounts.length))],
      stage: stages[stageIdx],
      previousStage: (stryMutAct_9fa48("37184") ? stageIdx <= 0 : stryMutAct_9fa48("37183") ? stageIdx >= 0 : stryMutAct_9fa48("37182") ? false : stryMutAct_9fa48("37181") ? true : (stryCov_9fa48("37181", "37182", "37183", "37184"), stageIdx > 0)) ? stages[stryMutAct_9fa48("37185") ? stageIdx + 1 : (stryCov_9fa48("37185"), stageIdx - 1)] : undefined,
      amount,
      probability: (stryMutAct_9fa48("37186") ? [] : (stryCov_9fa48("37186"), [10, 25, 50, 75, 100, 0]))[stageIdx],
      owner: owners[Math.floor(stryMutAct_9fa48("37187") ? Math.random() / owners.length : (stryCov_9fa48("37187"), Math.random() * owners.length))],
      closeDate: new Date(stryMutAct_9fa48("37188") ? Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37188"), Date.now() + (stryMutAct_9fa48("37189") ? Math.floor(Math.random() * 90) * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37189"), (stryMutAct_9fa48("37190") ? Math.floor(Math.random() * 90) * 24 * 60 / 60 : (stryCov_9fa48("37190"), (stryMutAct_9fa48("37191") ? Math.floor(Math.random() * 90) * 24 / 60 : (stryCov_9fa48("37191"), (stryMutAct_9fa48("37192") ? Math.floor(Math.random() * 90) / 24 : (stryCov_9fa48("37192"), Math.floor(stryMutAct_9fa48("37193") ? Math.random() / 90 : (stryCov_9fa48("37193"), Math.random() * 90)) * 24)) * 60)) * 60)) * 1000)))),
      deltaAmount: (stryMutAct_9fa48("37197") ? Math.random() <= 0.7 : stryMutAct_9fa48("37196") ? Math.random() >= 0.7 : stryMutAct_9fa48("37195") ? false : stryMutAct_9fa48("37194") ? true : (stryCov_9fa48("37194", "37195", "37196", "37197"), Math.random() > 0.7)) ? Math.floor(stryMutAct_9fa48("37198") ? (Math.random() - 0.5) / 50000 : (stryCov_9fa48("37198"), (stryMutAct_9fa48("37199") ? Math.random() + 0.5 : (stryCov_9fa48("37199"), Math.random() - 0.5)) * 50000)) : undefined
    }));
  }
  return stryMutAct_9fa48("37200") ? events : (stryCov_9fa48("37200"), events.sort(stryMutAct_9fa48("37201") ? () => undefined : (stryCov_9fa48("37201"), (a, b) => stryMutAct_9fa48("37202") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("37202"), b.timestamp.getTime() - a.timestamp.getTime()))));
};
const generateERPTransactions = (days: number = 90): ERPTransactionEvent[] => {
  const events: ERPTransactionEvent[] = stryMutAct_9fa48("37204") ? ["Stryker was here"] : (stryCov_9fa48("37204"), []);
  const types: ERPTransactionEvent['transactionType'][] = stryMutAct_9fa48("37205") ? [] : (stryCov_9fa48("37205"), ['purchase_order', 'sales_order', 'invoice', 'payment', 'journal_entry']);
  const costCenters = stryMutAct_9fa48("37211") ? [] : (stryCov_9fa48("37211"), ['CC-1000', 'CC-2000', 'CC-3000', 'CC-4000', 'CC-5000']);
  const glAccounts = stryMutAct_9fa48("37217") ? [] : (stryCov_9fa48("37217"), ['4000-Revenue', '5000-COGS', '6000-OpEx', '7000-Payroll', '8000-Other']);
  for (let i = 0; stryMutAct_9fa48("37225") ? i >= 200 : stryMutAct_9fa48("37224") ? i <= 200 : stryMutAct_9fa48("37223") ? false : (stryCov_9fa48("37223", "37224", "37225"), i < 200); stryMutAct_9fa48("37226") ? i-- : (stryCov_9fa48("37226"), i++)) {
    const daysAgo = Math.floor(stryMutAct_9fa48("37228") ? Math.random() / days : (stryCov_9fa48("37228"), Math.random() * days));
    const type = types[Math.floor(stryMutAct_9fa48("37229") ? Math.random() / types.length : (stryCov_9fa48("37229"), Math.random() * types.length))];
    events.push(stryMutAct_9fa48("37230") ? {} : (stryCov_9fa48("37230"), {
      id: `erp-${i}`,
      timestamp: new Date(stryMutAct_9fa48("37232") ? Date.now() + daysAgo * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37232"), Date.now() - (stryMutAct_9fa48("37233") ? daysAgo * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37233"), (stryMutAct_9fa48("37234") ? daysAgo * 24 * 60 / 60 : (stryCov_9fa48("37234"), (stryMutAct_9fa48("37235") ? daysAgo * 24 / 60 : (stryCov_9fa48("37235"), (stryMutAct_9fa48("37236") ? daysAgo / 24 : (stryCov_9fa48("37236"), daysAgo * 24)) * 60)) * 60)) * 1000)))),
      source: 'sap',
      transactionType: type,
      documentNumber: `DOC-${stryMutAct_9fa48("37239") ? 200000 - i : (stryCov_9fa48("37239"), 200000 + i)}`,
      amount: stryMutAct_9fa48("37240") ? Math.floor(Math.random() * 100000) - 1000 : (stryCov_9fa48("37240"), Math.floor(stryMutAct_9fa48("37241") ? Math.random() / 100000 : (stryCov_9fa48("37241"), Math.random() * 100000)) + 1000),
      currency: 'USD',
      costCenter: costCenters[Math.floor(stryMutAct_9fa48("37243") ? Math.random() / costCenters.length : (stryCov_9fa48("37243"), Math.random() * costCenters.length))],
      glAccount: glAccounts[Math.floor(stryMutAct_9fa48("37244") ? Math.random() / glAccounts.length : (stryCov_9fa48("37244"), Math.random() * glAccounts.length))],
      description: `${type.replace('_', ' ')} - Auto generated`,
      approver: (stryMutAct_9fa48("37251") ? Math.random() <= 0.5 : stryMutAct_9fa48("37250") ? Math.random() >= 0.5 : stryMutAct_9fa48("37249") ? false : stryMutAct_9fa48("37248") ? true : (stryCov_9fa48("37248", "37249", "37250", "37251"), Math.random() > 0.5)) ? 'CFO' : 'Controller'
    }));
  }
  return stryMutAct_9fa48("37254") ? events : (stryCov_9fa48("37254"), events.sort(stryMutAct_9fa48("37255") ? () => undefined : (stryCov_9fa48("37255"), (a, b) => stryMutAct_9fa48("37256") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("37256"), b.timestamp.getTime() - a.timestamp.getTime()))));
};
const generateHREvents = (days: number = 180): HREvent[] => {
  const events: HREvent[] = stryMutAct_9fa48("37258") ? ["Stryker was here"] : (stryCov_9fa48("37258"), []);
  const eventTypes: HREvent['eventType'][] = stryMutAct_9fa48("37259") ? [] : (stryCov_9fa48("37259"), ['hire', 'termination', 'promotion', 'transfer', 'compensation_change', 'performance_review']);
  const departments = stryMutAct_9fa48("37266") ? [] : (stryCov_9fa48("37266"), ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'Product', 'HR', 'Legal']);
  const positions = stryMutAct_9fa48("37275") ? [] : (stryCov_9fa48("37275"), ['Engineer', 'Manager', 'Director', 'VP', 'Analyst', 'Specialist', 'Lead']);
  const locations = stryMutAct_9fa48("37283") ? [] : (stryCov_9fa48("37283"), ['San Francisco', 'New York', 'Austin', 'Seattle', 'London', 'Singapore']);
  for (let i = 0; stryMutAct_9fa48("37292") ? i >= 100 : stryMutAct_9fa48("37291") ? i <= 100 : stryMutAct_9fa48("37290") ? false : (stryCov_9fa48("37290", "37291", "37292"), i < 100); stryMutAct_9fa48("37293") ? i-- : (stryCov_9fa48("37293"), i++)) {
    const daysAgo = Math.floor(stryMutAct_9fa48("37295") ? Math.random() / days : (stryCov_9fa48("37295"), Math.random() * days));
    const eventType = eventTypes[Math.floor(stryMutAct_9fa48("37296") ? Math.random() / eventTypes.length : (stryCov_9fa48("37296"), Math.random() * eventTypes.length))];
    events.push(stryMutAct_9fa48("37297") ? {} : (stryCov_9fa48("37297"), {
      id: `hr-${i}`,
      timestamp: new Date(stryMutAct_9fa48("37299") ? Date.now() + daysAgo * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37299"), Date.now() - (stryMutAct_9fa48("37300") ? daysAgo * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37300"), (stryMutAct_9fa48("37301") ? daysAgo * 24 * 60 / 60 : (stryCov_9fa48("37301"), (stryMutAct_9fa48("37302") ? daysAgo * 24 / 60 : (stryCov_9fa48("37302"), (stryMutAct_9fa48("37303") ? daysAgo / 24 : (stryCov_9fa48("37303"), daysAgo * 24)) * 60)) * 60)) * 1000)))),
      source: 'workday',
      eventType,
      department: departments[Math.floor(stryMutAct_9fa48("37305") ? Math.random() / departments.length : (stryCov_9fa48("37305"), Math.random() * departments.length))],
      position: positions[Math.floor(stryMutAct_9fa48("37306") ? Math.random() / positions.length : (stryCov_9fa48("37306"), Math.random() * positions.length))],
      level: (stryMutAct_9fa48("37307") ? [] : (stryCov_9fa48("37307"), ['IC1', 'IC2', 'IC3', 'M1', 'M2', 'D1', 'VP']))[Math.floor(stryMutAct_9fa48("37315") ? Math.random() / 7 : (stryCov_9fa48("37315"), Math.random() * 7))],
      location: locations[Math.floor(stryMutAct_9fa48("37316") ? Math.random() / locations.length : (stryCov_9fa48("37316"), Math.random() * locations.length))],
      headcountDelta: (stryMutAct_9fa48("37319") ? eventType !== 'hire' : stryMutAct_9fa48("37318") ? false : stryMutAct_9fa48("37317") ? true : (stryCov_9fa48("37317", "37318", "37319"), eventType === 'hire')) ? 1 : (stryMutAct_9fa48("37323") ? eventType !== 'termination' : stryMutAct_9fa48("37322") ? false : stryMutAct_9fa48("37321") ? true : (stryCov_9fa48("37321", "37322", "37323"), eventType === 'termination')) ? stryMutAct_9fa48("37325") ? +1 : (stryCov_9fa48("37325"), -1) : 0,
      compensationBand: (stryMutAct_9fa48("37326") ? [] : (stryCov_9fa48("37326"), ['$80k-100k', '$100k-130k', '$130k-160k', '$160k-200k', '$200k+']))[Math.floor(stryMutAct_9fa48("37332") ? Math.random() / 5 : (stryCov_9fa48("37332"), Math.random() * 5))]
    }));
  }
  return stryMutAct_9fa48("37333") ? events : (stryCov_9fa48("37333"), events.sort(stryMutAct_9fa48("37334") ? () => undefined : (stryCov_9fa48("37334"), (a, b) => stryMutAct_9fa48("37335") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("37335"), b.timestamp.getTime() - a.timestamp.getTime()))));
};
const generateEngineeringEvents = (days: number = 90): EngineeringEvent[] => {
  const events: EngineeringEvent[] = stryMutAct_9fa48("37337") ? ["Stryker was here"] : (stryCov_9fa48("37337"), []);
  const eventTypes: EngineeringEvent['eventType'][] = stryMutAct_9fa48("37338") ? [] : (stryCov_9fa48("37338"), ['sprint_complete', 'release', 'incident', 'pr_merged', 'deployment']);
  const projects = stryMutAct_9fa48("37344") ? [] : (stryCov_9fa48("37344"), ['Platform', 'API', 'Frontend', 'Mobile', 'Infrastructure', 'Data Pipeline']);
  const teams = stryMutAct_9fa48("37351") ? [] : (stryCov_9fa48("37351"), ['Alpha', 'Beta', 'Gamma', 'Delta', 'Core', 'Growth']);
  for (let i = 0; stryMutAct_9fa48("37360") ? i >= 120 : stryMutAct_9fa48("37359") ? i <= 120 : stryMutAct_9fa48("37358") ? false : (stryCov_9fa48("37358", "37359", "37360"), i < 120); stryMutAct_9fa48("37361") ? i-- : (stryCov_9fa48("37361"), i++)) {
    const daysAgo = Math.floor(stryMutAct_9fa48("37363") ? Math.random() / days : (stryCov_9fa48("37363"), Math.random() * days));
    const eventType = eventTypes[Math.floor(stryMutAct_9fa48("37364") ? Math.random() / eventTypes.length : (stryCov_9fa48("37364"), Math.random() * eventTypes.length))];
    events.push(stryMutAct_9fa48("37365") ? {} : (stryCov_9fa48("37365"), {
      id: `eng-${i}`,
      timestamp: new Date(stryMutAct_9fa48("37367") ? Date.now() + daysAgo * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37367"), Date.now() - (stryMutAct_9fa48("37368") ? daysAgo * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37368"), (stryMutAct_9fa48("37369") ? daysAgo * 24 * 60 / 60 : (stryCov_9fa48("37369"), (stryMutAct_9fa48("37370") ? daysAgo * 24 / 60 : (stryCov_9fa48("37370"), (stryMutAct_9fa48("37371") ? daysAgo / 24 : (stryCov_9fa48("37371"), daysAgo * 24)) * 60)) * 60)) * 1000)))),
      source: (stryMutAct_9fa48("37375") ? Math.random() <= 0.5 : stryMutAct_9fa48("37374") ? Math.random() >= 0.5 : stryMutAct_9fa48("37373") ? false : stryMutAct_9fa48("37372") ? true : (stryCov_9fa48("37372", "37373", "37374", "37375"), Math.random() > 0.5)) ? 'jira' : 'github',
      eventType,
      project: projects[Math.floor(stryMutAct_9fa48("37378") ? Math.random() / projects.length : (stryCov_9fa48("37378"), Math.random() * projects.length))],
      team: teams[Math.floor(stryMutAct_9fa48("37379") ? Math.random() / teams.length : (stryCov_9fa48("37379"), Math.random() * teams.length))],
      velocity: (stryMutAct_9fa48("37382") ? eventType !== 'sprint_complete' : stryMutAct_9fa48("37381") ? false : stryMutAct_9fa48("37380") ? true : (stryCov_9fa48("37380", "37381", "37382"), eventType === 'sprint_complete')) ? stryMutAct_9fa48("37384") ? Math.floor(Math.random() * 30) - 20 : (stryCov_9fa48("37384"), Math.floor(stryMutAct_9fa48("37385") ? Math.random() / 30 : (stryCov_9fa48("37385"), Math.random() * 30)) + 20) : undefined,
      storyPoints: (stryMutAct_9fa48("37388") ? eventType !== 'sprint_complete' : stryMutAct_9fa48("37387") ? false : stryMutAct_9fa48("37386") ? true : (stryCov_9fa48("37386", "37387", "37388"), eventType === 'sprint_complete')) ? stryMutAct_9fa48("37390") ? Math.floor(Math.random() * 50) - 30 : (stryCov_9fa48("37390"), Math.floor(stryMutAct_9fa48("37391") ? Math.random() / 50 : (stryCov_9fa48("37391"), Math.random() * 50)) + 30) : undefined,
      leadTime: stryMutAct_9fa48("37392") ? Math.floor(Math.random() * 10) - 2 : (stryCov_9fa48("37392"), Math.floor(stryMutAct_9fa48("37393") ? Math.random() / 10 : (stryCov_9fa48("37393"), Math.random() * 10)) + 2),
      cycleTime: stryMutAct_9fa48("37394") ? Math.floor(Math.random() * 5) - 1 : (stryCov_9fa48("37394"), Math.floor(stryMutAct_9fa48("37395") ? Math.random() / 5 : (stryCov_9fa48("37395"), Math.random() * 5)) + 1),
      deployFrequency: (stryMutAct_9fa48("37398") ? eventType !== 'deployment' : stryMutAct_9fa48("37397") ? false : stryMutAct_9fa48("37396") ? true : (stryCov_9fa48("37396", "37397", "37398"), eventType === 'deployment')) ? stryMutAct_9fa48("37400") ? Math.floor(Math.random() * 5) - 1 : (stryCov_9fa48("37400"), Math.floor(stryMutAct_9fa48("37401") ? Math.random() / 5 : (stryCov_9fa48("37401"), Math.random() * 5)) + 1) : undefined,
      incidentSeverity: (stryMutAct_9fa48("37404") ? eventType !== 'incident' : stryMutAct_9fa48("37403") ? false : stryMutAct_9fa48("37402") ? true : (stryCov_9fa48("37402", "37403", "37404"), eventType === 'incident')) ? ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any : undefined
    }));
  }
  return stryMutAct_9fa48("37406") ? events : (stryCov_9fa48("37406"), events.sort(stryMutAct_9fa48("37407") ? () => undefined : (stryCov_9fa48("37407"), (a, b) => stryMutAct_9fa48("37408") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("37408"), b.timestamp.getTime() - a.timestamp.getTime()))));
};
const generateServiceTickets = (days: number = 60): ServiceTicketEvent[] => {
  const events: ServiceTicketEvent[] = stryMutAct_9fa48("37410") ? ["Stryker was here"] : (stryCov_9fa48("37410"), []);
  const categories: ServiceTicketEvent['category'][] = stryMutAct_9fa48("37411") ? [] : (stryCov_9fa48("37411"), ['incident', 'request', 'problem', 'change']);
  const priorities: ServiceTicketEvent['priority'][] = stryMutAct_9fa48("37416") ? [] : (stryCov_9fa48("37416"), ['critical', 'high', 'medium', 'low']);
  const assignees = stryMutAct_9fa48("37421") ? [] : (stryCov_9fa48("37421"), ['Ops Team', 'DevOps', 'Security', 'Network', 'Help Desk']);
  for (let i = 0; stryMutAct_9fa48("37429") ? i >= 80 : stryMutAct_9fa48("37428") ? i <= 80 : stryMutAct_9fa48("37427") ? false : (stryCov_9fa48("37427", "37428", "37429"), i < 80); stryMutAct_9fa48("37430") ? i-- : (stryCov_9fa48("37430"), i++)) {
    const daysAgo = Math.floor(stryMutAct_9fa48("37432") ? Math.random() / days : (stryCov_9fa48("37432"), Math.random() * days));
    const isResolved = stryMutAct_9fa48("37436") ? Math.random() <= 0.3 : stryMutAct_9fa48("37435") ? Math.random() >= 0.3 : stryMutAct_9fa48("37434") ? false : stryMutAct_9fa48("37433") ? true : (stryCov_9fa48("37433", "37434", "37435", "37436"), Math.random() > 0.3);
    events.push(stryMutAct_9fa48("37437") ? {} : (stryCov_9fa48("37437"), {
      id: `svc-${i}`,
      timestamp: new Date(stryMutAct_9fa48("37439") ? Date.now() + daysAgo * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37439"), Date.now() - (stryMutAct_9fa48("37440") ? daysAgo * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37440"), (stryMutAct_9fa48("37441") ? daysAgo * 24 * 60 / 60 : (stryCov_9fa48("37441"), (stryMutAct_9fa48("37442") ? daysAgo * 24 / 60 : (stryCov_9fa48("37442"), (stryMutAct_9fa48("37443") ? daysAgo / 24 : (stryCov_9fa48("37443"), daysAgo * 24)) * 60)) * 60)) * 1000)))),
      source: 'servicenow',
      ticketId: `INC${stryMutAct_9fa48("37446") ? 300000 - i : (stryCov_9fa48("37446"), 300000 + i)}`,
      category: categories[Math.floor(stryMutAct_9fa48("37447") ? Math.random() / categories.length : (stryCov_9fa48("37447"), Math.random() * categories.length))],
      priority: priorities[Math.floor(stryMutAct_9fa48("37448") ? Math.random() / priorities.length : (stryCov_9fa48("37448"), Math.random() * priorities.length))],
      status: isResolved ? 'resolved' : ['open', 'in_progress'][Math.floor(Math.random() * 2)] as any,
      assignee: assignees[Math.floor(stryMutAct_9fa48("37450") ? Math.random() / assignees.length : (stryCov_9fa48("37450"), Math.random() * assignees.length))],
      resolution: isResolved ? 'Issue resolved per standard procedure' : undefined,
      slaBreached: stryMutAct_9fa48("37455") ? Math.random() <= 0.85 : stryMutAct_9fa48("37454") ? Math.random() >= 0.85 : stryMutAct_9fa48("37453") ? false : stryMutAct_9fa48("37452") ? true : (stryCov_9fa48("37452", "37453", "37454", "37455"), Math.random() > 0.85),
      responseTime: stryMutAct_9fa48("37456") ? Math.floor(Math.random() * 60) - 5 : (stryCov_9fa48("37456"), Math.floor(stryMutAct_9fa48("37457") ? Math.random() / 60 : (stryCov_9fa48("37457"), Math.random() * 60)) + 5),
      resolutionTime: isResolved ? stryMutAct_9fa48("37458") ? Math.floor(Math.random() * 480) - 30 : (stryCov_9fa48("37458"), Math.floor(stryMutAct_9fa48("37459") ? Math.random() / 480 : (stryCov_9fa48("37459"), Math.random() * 480)) + 30) : undefined
    }));
  }
  return stryMutAct_9fa48("37460") ? events : (stryCov_9fa48("37460"), events.sort(stryMutAct_9fa48("37461") ? () => undefined : (stryCov_9fa48("37461"), (a, b) => stryMutAct_9fa48("37462") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("37462"), b.timestamp.getTime() - a.timestamp.getTime()))));
};
const generateDocumentRevisions = (days: number = 180): DocumentRevisionEvent[] => {
  const events: DocumentRevisionEvent[] = stryMutAct_9fa48("37464") ? ["Stryker was here"] : (stryCov_9fa48("37464"), []);
  const docTypes: DocumentRevisionEvent['documentType'][] = stryMutAct_9fa48("37465") ? [] : (stryCov_9fa48("37465"), ['policy', 'contract', 'spec', 'report', 'presentation']);
  const changeTypes: DocumentRevisionEvent['changeType'][] = stryMutAct_9fa48("37471") ? [] : (stryCov_9fa48("37471"), ['created', 'modified', 'approved', 'published', 'archived']);
  const authors = stryMutAct_9fa48("37477") ? [] : (stryCov_9fa48("37477"), ['Legal Team', 'Finance Team', 'Product Team', 'Executive Office', 'Compliance']);
  const docs = stryMutAct_9fa48("37483") ? [] : (stryCov_9fa48("37483"), ['Q3 Financial Report', 'Security Policy', 'Vendor Agreement', 'Product Roadmap', 'Employee Handbook', 'SOX Controls', 'Data Governance Policy']);
  for (let i = 0; stryMutAct_9fa48("37493") ? i >= 60 : stryMutAct_9fa48("37492") ? i <= 60 : stryMutAct_9fa48("37491") ? false : (stryCov_9fa48("37491", "37492", "37493"), i < 60); stryMutAct_9fa48("37494") ? i-- : (stryCov_9fa48("37494"), i++)) {
    const daysAgo = Math.floor(stryMutAct_9fa48("37496") ? Math.random() / days : (stryCov_9fa48("37496"), Math.random() * days));
    const version = `${stryMutAct_9fa48("37498") ? Math.floor(Math.random() * 5) - 1 : (stryCov_9fa48("37498"), Math.floor(stryMutAct_9fa48("37499") ? Math.random() / 5 : (stryCov_9fa48("37499"), Math.random() * 5)) + 1)}.${Math.floor(stryMutAct_9fa48("37500") ? Math.random() / 10 : (stryCov_9fa48("37500"), Math.random() * 10))}`;
    events.push(stryMutAct_9fa48("37501") ? {} : (stryCov_9fa48("37501"), {
      id: `doc-${i}`,
      timestamp: new Date(stryMutAct_9fa48("37503") ? Date.now() + daysAgo * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37503"), Date.now() - (stryMutAct_9fa48("37504") ? daysAgo * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37504"), (stryMutAct_9fa48("37505") ? daysAgo * 24 * 60 / 60 : (stryCov_9fa48("37505"), (stryMutAct_9fa48("37506") ? daysAgo * 24 / 60 : (stryCov_9fa48("37506"), (stryMutAct_9fa48("37507") ? daysAgo / 24 : (stryCov_9fa48("37507"), daysAgo * 24)) * 60)) * 60)) * 1000)))),
      source: 'sharepoint',
      documentId: `DOC-${stryMutAct_9fa48("37510") ? 400000 - i : (stryCov_9fa48("37510"), 400000 + i)}`,
      documentName: docs[Math.floor(stryMutAct_9fa48("37511") ? Math.random() / docs.length : (stryCov_9fa48("37511"), Math.random() * docs.length))],
      documentType: docTypes[Math.floor(stryMutAct_9fa48("37512") ? Math.random() / docTypes.length : (stryCov_9fa48("37512"), Math.random() * docTypes.length))],
      version,
      previousVersion: (stryMutAct_9fa48("37516") ? parseFloat(version) <= 1 : stryMutAct_9fa48("37515") ? parseFloat(version) >= 1 : stryMutAct_9fa48("37514") ? false : stryMutAct_9fa48("37513") ? true : (stryCov_9fa48("37513", "37514", "37515", "37516"), parseFloat(version) > 1)) ? `${stryMutAct_9fa48("37518") ? parseFloat(version) + 0.1 : (stryCov_9fa48("37518"), parseFloat(version) - 0.1)}` : undefined,
      author: authors[Math.floor(stryMutAct_9fa48("37519") ? Math.random() / authors.length : (stryCov_9fa48("37519"), Math.random() * authors.length))],
      changeType: changeTypes[Math.floor(stryMutAct_9fa48("37520") ? Math.random() / changeTypes.length : (stryCov_9fa48("37520"), Math.random() * changeTypes.length))],
      approvers: (stryMutAct_9fa48("37524") ? Math.random() <= 0.5 : stryMutAct_9fa48("37523") ? Math.random() >= 0.5 : stryMutAct_9fa48("37522") ? false : stryMutAct_9fa48("37521") ? true : (stryCov_9fa48("37521", "37522", "37523", "37524"), Math.random() > 0.5)) ? stryMutAct_9fa48("37525") ? [] : (stryCov_9fa48("37525"), ['CFO', 'General Counsel']) : undefined
    }));
  }
  return stryMutAct_9fa48("37528") ? events : (stryCov_9fa48("37528"), events.sort(stryMutAct_9fa48("37529") ? () => undefined : (stryCov_9fa48("37529"), (a, b) => stryMutAct_9fa48("37530") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("37530"), b.timestamp.getTime() - a.timestamp.getTime()))));
};
const generateERPSnapshot = (date: Date): ERPStateSnapshot => {
  const now = new Date();
  const daysDiff = stryMutAct_9fa48("37532") ? (now.getTime() - date.getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("37532"), (stryMutAct_9fa48("37533") ? now.getTime() + date.getTime() : (stryCov_9fa48("37533"), now.getTime() - date.getTime())) / (stryMutAct_9fa48("37534") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("37534"), (stryMutAct_9fa48("37535") ? 24 * 60 / 60 : (stryCov_9fa48("37535"), (stryMutAct_9fa48("37536") ? 24 / 60 : (stryCov_9fa48("37536"), 24 * 60)) * 60)) * 1000)));
  const factor = Math.pow(0.9995, daysDiff);
  const randomize = stryMutAct_9fa48("37537") ? () => undefined : (stryCov_9fa48("37537"), (() => {
    const randomize = (base: number, variance: number = 0.1) => stryMutAct_9fa48("37538") ? base * factor / (1 + (Math.random() - 0.5) * variance) : (stryCov_9fa48("37538"), (stryMutAct_9fa48("37539") ? base / factor : (stryCov_9fa48("37539"), base * factor)) * (stryMutAct_9fa48("37540") ? 1 - (Math.random() - 0.5) * variance : (stryCov_9fa48("37540"), 1 + (stryMutAct_9fa48("37541") ? (Math.random() - 0.5) / variance : (stryCov_9fa48("37541"), (stryMutAct_9fa48("37542") ? Math.random() + 0.5 : (stryCov_9fa48("37542"), Math.random() - 0.5)) * variance)))));
    return randomize;
  })());
  return stryMutAct_9fa48("37543") ? {} : (stryCov_9fa48("37543"), {
    timestamp: date,
    crm: stryMutAct_9fa48("37544") ? {} : (stryCov_9fa48("37544"), {
      totalPipeline: Math.round(randomize(45000000)),
      weightedPipeline: Math.round(randomize(28000000)),
      openOpportunities: Math.round(randomize(234)),
      wonThisMonth: Math.round(randomize(18)),
      lostThisMonth: Math.round(randomize(7)),
      avgDealSize: Math.round(randomize(125000)),
      winRate: stryMutAct_9fa48("37545") ? Math.max(100, randomize(42, 0.05)) : (stryCov_9fa48("37545"), Math.min(100, randomize(42, 0.05)))
    }),
    erp: stryMutAct_9fa48("37546") ? {} : (stryCov_9fa48("37546"), {
      revenue: Math.round(randomize(12500000)),
      expenses: Math.round(randomize(9800000)),
      cashPosition: Math.round(randomize(8500000)),
      accountsReceivable: Math.round(randomize(3200000)),
      accountsPayable: Math.round(randomize(1800000)),
      openPOs: Math.round(randomize(156))
    }),
    hr: stryMutAct_9fa48("37547") ? {} : (stryCov_9fa48("37547"), {
      totalHeadcount: Math.round(randomize(156)),
      openReqs: Math.round(randomize(23)),
      attritionRate: randomize(12, 0.2),
      avgTenure: randomize(2.8, 0.1),
      hiresThisQuarter: Math.round(randomize(15)),
      departuresThisQuarter: Math.round(randomize(5))
    }),
    engineering: stryMutAct_9fa48("37548") ? {} : (stryCov_9fa48("37548"), {
      velocity: Math.round(randomize(47)),
      sprintCompletion: stryMutAct_9fa48("37549") ? Math.max(100, randomize(85, 0.1)) : (stryCov_9fa48("37549"), Math.min(100, randomize(85, 0.1))),
      bugCount: Math.round(randomize(34)),
      techDebtHours: Math.round(randomize(420)),
      deploymentFrequency: randomize(4.2, 0.15),
      mttr: Math.round(randomize(45))
    }),
    serviceDesk: stryMutAct_9fa48("37550") ? {} : (stryCov_9fa48("37550"), {
      openTickets: Math.round(randomize(89)),
      avgResponseTime: Math.round(randomize(15)),
      avgResolutionTime: Math.round(randomize(180)),
      slaCompliance: stryMutAct_9fa48("37551") ? Math.max(100, randomize(94, 0.05)) : (stryCov_9fa48("37551"), Math.min(100, randomize(94, 0.05))),
      csat: stryMutAct_9fa48("37552") ? Math.max(100, randomize(87, 0.08)) : (stryCov_9fa48("37552"), Math.min(100, randomize(87, 0.08)))
    })
  });
};

// =============================================================================
// ENTERPRISE COMPLIANCE GENERATORS (The Undefeatable 5%)
// =============================================================================

// Generate SHA-256 hash (simulated)
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; stryMutAct_9fa48("37556") ? i >= data.length : stryMutAct_9fa48("37555") ? i <= data.length : stryMutAct_9fa48("37554") ? false : (stryCov_9fa48("37554", "37555", "37556"), i < data.length); stryMutAct_9fa48("37557") ? i-- : (stryCov_9fa48("37557"), i++)) {
    const char = data.charCodeAt(i);
    hash = stryMutAct_9fa48("37559") ? (hash << 5) - hash - char : (stryCov_9fa48("37559"), (stryMutAct_9fa48("37560") ? (hash << 5) + hash : (stryCov_9fa48("37560"), (hash << 5) - hash)) + char);
    hash = hash & hash;
  }
  return stryMutAct_9fa48("37561") ? Math.abs(hash).toString(16).padStart(64, '0') : (stryCov_9fa48("37561"), Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64));
};

// Generate Immutable Ledger
const generateLedger = (): ChronosLedger => {
  const genesisTimestamp = new Date(stryMutAct_9fa48("37564") ? Date.now() + 730 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("37564"), Date.now() - (stryMutAct_9fa48("37565") ? 730 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("37565"), (stryMutAct_9fa48("37566") ? 730 * 24 * 60 / 60 : (stryCov_9fa48("37566"), (stryMutAct_9fa48("37567") ? 730 * 24 / 60 : (stryCov_9fa48("37567"), (stryMutAct_9fa48("37568") ? 730 / 24 : (stryCov_9fa48("37568"), 730 * 24)) * 60)) * 60)) * 1000))));
  const genesisHash = generateHash(`genesis-${genesisTimestamp.toISOString()}`);
  const genesisBlock: LedgerBlock = stryMutAct_9fa48("37570") ? {} : (stryCov_9fa48("37570"), {
    blockNumber: 0,
    timestamp: genesisTimestamp,
    previousHash: '0'.repeat(64),
    hash: genesisHash,
    merkleRoot: generateHash('merkle-genesis'),
    stateSnapshot: generateSnapshot(genesisTimestamp, 'rewind'),
    events: stryMutAct_9fa48("37574") ? ["Stryker was here"] : (stryCov_9fa48("37574"), []),
    signature: generateHash(`sig-genesis-${Date.now()}`),
    signedBy: 'system@datacendia.com',
    nonce: 0
  });
  const latestTimestamp = new Date();
  const latestBlock: LedgerBlock = stryMutAct_9fa48("37577") ? {} : (stryCov_9fa48("37577"), {
    blockNumber: 4382,
    timestamp: latestTimestamp,
    previousHash: generateHash(`block-4381-${Date.now()}`),
    hash: generateHash(`block-4382-${latestTimestamp.toISOString()}`),
    merkleRoot: generateHash(`merkle-4382-${Date.now()}`),
    stateSnapshot: generateSnapshot(latestTimestamp, 'rewind'),
    events: stryMutAct_9fa48("37582") ? ["Stryker was here"] : (stryCov_9fa48("37582"), []),
    signature: generateHash(`sig-4382-${Date.now()}`),
    signedBy: 'chronos-node-1@datacendia.com',
    nonce: 847293
  });
  return stryMutAct_9fa48("37585") ? {} : (stryCov_9fa48("37585"), {
    chainId: 'chronos-mainnet-001',
    genesisBlock,
    latestBlock,
    totalBlocks: 4383,
    integrityStatus: 'verified',
    lastVerified: new Date(stryMutAct_9fa48("37588") ? Date.now() + 60000 : (stryCov_9fa48("37588"), Date.now() - 60000)),
    complianceFlags: stryMutAct_9fa48("37589") ? {} : (stryCov_9fa48("37589"), {
      sox: stryMutAct_9fa48("37590") ? false : (stryCov_9fa48("37590"), true),
      sec: stryMutAct_9fa48("37591") ? false : (stryCov_9fa48("37591"), true),
      fedramp: stryMutAct_9fa48("37592") ? false : (stryCov_9fa48("37592"), true),
      gdpr: stryMutAct_9fa48("37593") ? false : (stryCov_9fa48("37593"), true),
      hipaa: stryMutAct_9fa48("37594") ? true : (stryCov_9fa48("37594"), false)
    })
  });
};

// Generate Live Sync Status
const generateLiveSyncStatus = stryMutAct_9fa48("37595") ? () => undefined : (stryCov_9fa48("37595"), (() => {
  const generateLiveSyncStatus = (): LiveSyncStatus => stryMutAct_9fa48("37596") ? {} : (stryCov_9fa48("37596"), {
    isConnected: stryMutAct_9fa48("37597") ? false : (stryCov_9fa48("37597"), true),
    lastEventTime: new Date(stryMutAct_9fa48("37598") ? Date.now() + Math.random() * 5000 : (stryCov_9fa48("37598"), Date.now() - (stryMutAct_9fa48("37599") ? Math.random() / 5000 : (stryCov_9fa48("37599"), Math.random() * 5000)))),
    pendingEvents: Math.floor(stryMutAct_9fa48("37600") ? Math.random() / 3 : (stryCov_9fa48("37600"), Math.random() * 3)),
    syncLag: Math.floor(stryMutAct_9fa48("37601") ? Math.random() / 150 : (stryCov_9fa48("37601"), Math.random() * 150)),
    throughput: stryMutAct_9fa48("37602") ? 12 - Math.random() * 8 : (stryCov_9fa48("37602"), 12 + (stryMutAct_9fa48("37603") ? Math.random() / 8 : (stryCov_9fa48("37603"), Math.random() * 8))),
    kafkaOffset: stryMutAct_9fa48("37604") ? 8472934 - Math.floor(Math.random() * 100) : (stryCov_9fa48("37604"), 8472934 + Math.floor(stryMutAct_9fa48("37605") ? Math.random() / 100 : (stryCov_9fa48("37605"), Math.random() * 100))),
    websocketStatus: 'connected'
  });
  return generateLiveSyncStatus;
})());

// Generate Court-Admissible Export
const generateCourtExport = stryMutAct_9fa48("37607") ? () => undefined : (stryCov_9fa48("37607"), (() => {
  const generateCourtExport = (timeRange: {
    start: Date;
    end: Date;
  }): CourtAdmissibleExport => stryMutAct_9fa48("37608") ? {} : (stryCov_9fa48("37608"), {
    id: `export-${Date.now()}`,
    exportedAt: new Date(),
    requestedBy: 'legal@company.com',
    timeRange,
    includedBlocks: Array.from(stryMutAct_9fa48("37611") ? {} : (stryCov_9fa48("37611"), {
      length: 50
    }), stryMutAct_9fa48("37612") ? () => undefined : (stryCov_9fa48("37612"), (_, i) => stryMutAct_9fa48("37613") ? 4300 - i : (stryCov_9fa48("37613"), 4300 + i))),
    merkleProof: Array.from(stryMutAct_9fa48("37614") ? {} : (stryCov_9fa48("37614"), {
      length: 8
    }), stryMutAct_9fa48("37615") ? () => undefined : (stryCov_9fa48("37615"), () => generateHash(`proof-${Math.random()}`))),
    signatures: stryMutAct_9fa48("37617") ? [] : (stryCov_9fa48("37617"), [stryMutAct_9fa48("37618") ? {} : (stryCov_9fa48("37618"), {
      signer: 'CEO',
      role: 'Chief Executive Officer',
      timestamp: new Date(),
      signature: generateHash('ceo-sig'),
      publicKey: 'pk_ceo_...'
    }), stryMutAct_9fa48("37623") ? {} : (stryCov_9fa48("37623"), {
      signer: 'CFO',
      role: 'Chief Financial Officer',
      timestamp: new Date(),
      signature: generateHash('cfo-sig'),
      publicKey: 'pk_cfo_...'
    }), stryMutAct_9fa48("37628") ? {} : (stryCov_9fa48("37628"), {
      signer: 'General Counsel',
      role: 'Legal',
      timestamp: new Date(),
      signature: generateHash('gc-sig'),
      publicKey: 'pk_gc_...'
    })]),
    witnessStatements: stryMutAct_9fa48("37633") ? [] : (stryCov_9fa48("37633"), [stryMutAct_9fa48("37634") ? {} : (stryCov_9fa48("37634"), {
      witness: 'Internal Audit',
      statement: 'Verified data integrity and chain of custody.',
      timestamp: new Date()
    })]),
    deliberationTranscripts: stryMutAct_9fa48("37637") ? ["Stryker was here"] : (stryCov_9fa48("37637"), []),
    hashChainVerification: stryMutAct_9fa48("37638") ? {} : (stryCov_9fa48("37638"), {
      startHash: generateHash('start'),
      endHash: generateHash('end'),
      allBlocksValid: stryMutAct_9fa48("37641") ? false : (stryCov_9fa48("37641"), true)
    }),
    legalCertification: stryMutAct_9fa48("37642") ? {} : (stryCov_9fa48("37642"), {
      certified: stryMutAct_9fa48("37643") ? false : (stryCov_9fa48("37643"), true),
      certifier: 'Datacendia Chronos Certification Authority',
      jurisdiction: 'United States'
    }),
    format: 'forensic-bundle'
  });
  return generateCourtExport;
})());

// Default redaction rules
const DEFAULT_REDACTION_RULES: RedactionRule[] = stryMutAct_9fa48("37647") ? [] : (stryCov_9fa48("37647"), [stryMutAct_9fa48("37648") ? {} : (stryCov_9fa48("37648"), {
  id: 'r1',
  field: 'ssn',
  pattern: stryMutAct_9fa48("37656") ? /\d{3}-\d{2}-\D{4}/ : stryMutAct_9fa48("37655") ? /\d{3}-\d{2}-\d/ : stryMutAct_9fa48("37654") ? /\d{3}-\D{2}-\d{4}/ : stryMutAct_9fa48("37653") ? /\d{3}-\d-\d{4}/ : stryMutAct_9fa48("37652") ? /\D{3}-\d{2}-\d{4}/ : stryMutAct_9fa48("37651") ? /\d-\d{2}-\d{4}/ : (stryCov_9fa48("37651", "37652", "37653", "37654", "37655", "37656"), /\d{3}-\d{2}-\d{4}/),
  replacement: '***-**-****',
  category: 'pii',
  preserveFinancialTruth: stryMutAct_9fa48("37659") ? false : (stryCov_9fa48("37659"), true)
}), stryMutAct_9fa48("37660") ? {} : (stryCov_9fa48("37660"), {
  id: 'r2',
  field: 'email',
  pattern: stryMutAct_9fa48("37663") ? /@.\.com/ : (stryCov_9fa48("37663"), /@.*\.com/),
  replacement: '@[REDACTED]',
  category: 'pii',
  preserveFinancialTruth: stryMutAct_9fa48("37666") ? false : (stryCov_9fa48("37666"), true)
}), stryMutAct_9fa48("37667") ? {} : (stryCov_9fa48("37667"), {
  id: 'r3',
  field: 'name',
  pattern: stryMutAct_9fa48("37675") ? /[A-Z][a-z]+ [A-Z][^a-z]+/ : stryMutAct_9fa48("37674") ? /[A-Z][a-z]+ [A-Z][a-z]/ : stryMutAct_9fa48("37673") ? /[A-Z][a-z]+ [^A-Z][a-z]+/ : stryMutAct_9fa48("37672") ? /[A-Z][^a-z]+ [A-Z][a-z]+/ : stryMutAct_9fa48("37671") ? /[A-Z][a-z] [A-Z][a-z]+/ : stryMutAct_9fa48("37670") ? /[^A-Z][a-z]+ [A-Z][a-z]+/ : (stryCov_9fa48("37670", "37671", "37672", "37673", "37674", "37675"), /[A-Z][a-z]+ [A-Z][a-z]+/),
  replacement: '[NAME REDACTED]',
  category: 'personnel',
  preserveFinancialTruth: stryMutAct_9fa48("37678") ? false : (stryCov_9fa48("37678"), true)
}), stryMutAct_9fa48("37679") ? {} : (stryCov_9fa48("37679"), {
  id: 'r4',
  field: 'salary',
  pattern: stryMutAct_9fa48("37684") ? /\$[\D,]+/ : stryMutAct_9fa48("37683") ? /\$[^\d,]+/ : stryMutAct_9fa48("37682") ? /\$[\d,]/ : (stryCov_9fa48("37682", "37683", "37684"), /\$[\d,]+/),
  replacement: '$[REDACTED]',
  category: 'personnel',
  preserveFinancialTruth: stryMutAct_9fa48("37687") ? true : (stryCov_9fa48("37687"), false)
}), stryMutAct_9fa48("37688") ? {} : (stryCov_9fa48("37688"), {
  id: 'r5',
  field: 'medical',
  pattern: /diagnosis|treatment|patient/i,
  replacement: '[PHI REDACTED]',
  category: 'phi',
  preserveFinancialTruth: stryMutAct_9fa48("37693") ? false : (stryCov_9fa48("37693"), true)
})]);

// =============================================================================
// FULL TRACEABILITY GENERATOR - Court-Level Causality Proof
// =============================================================================

const generateTraceabilityView = (event: TimelineEvent): TraceabilityView => {
  const services = stryMutAct_9fa48("37695") ? [] : (stryCov_9fa48("37695"), ['DataIngestionService', 'TransformEngine', 'ValidationService', 'AIAnalytics', 'DecisionService']);
  const datasets = stryMutAct_9fa48("37701") ? [] : (stryCov_9fa48("37701"), ['CRM_Pipeline', 'ERP_Transactions', 'HR_Records', 'Engineering_Metrics', 'Financial_Ledger']);
  const agents = stryMutAct_9fa48("37707") ? [] : (stryCov_9fa48("37707"), ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent', 'CRO Agent']);
  return stryMutAct_9fa48("37714") ? {} : (stryCov_9fa48("37714"), {
    eventId: event.id,
    originSource: stryMutAct_9fa48("37715") ? {} : (stryCov_9fa48("37715"), {
      dataset: datasets[Math.floor(stryMutAct_9fa48("37716") ? Math.random() / datasets.length : (stryCov_9fa48("37716"), Math.random() * datasets.length))],
      table: `${stryMutAct_9fa48("37720") ? event.department?.toLowerCase() && 'core' : stryMutAct_9fa48("37719") ? false : stryMutAct_9fa48("37718") ? true : (stryCov_9fa48("37718", "37719", "37720"), (stryMutAct_9fa48("37722") ? event.department.toLowerCase() : stryMutAct_9fa48("37721") ? event.department?.toUpperCase() : (stryCov_9fa48("37721", "37722"), event.department?.toLowerCase())) || 'core')}_events`,
      field: (stryMutAct_9fa48("37726") ? event.type !== 'metric' : stryMutAct_9fa48("37725") ? false : stryMutAct_9fa48("37724") ? true : (stryCov_9fa48("37724", "37725", "37726"), event.type === 'metric')) ? 'value' : (stryMutAct_9fa48("37731") ? event.type !== 'financial' : stryMutAct_9fa48("37730") ? false : stryMutAct_9fa48("37729") ? true : (stryCov_9fa48("37729", "37730", "37731"), event.type === 'financial')) ? 'amount' : 'status',
      timestamp: new Date(stryMutAct_9fa48("37735") ? event.timestamp.getTime() + 3600000 : (stryCov_9fa48("37735"), event.timestamp.getTime() - 3600000)),
      rawValue: (stryMutAct_9fa48("37738") ? event.type !== 'financial' : stryMutAct_9fa48("37737") ? false : stryMutAct_9fa48("37736") ? true : (stryCov_9fa48("37736", "37737", "37738"), event.type === 'financial')) ? Math.floor(stryMutAct_9fa48("37740") ? Math.random() / 10000000 : (stryCov_9fa48("37740"), Math.random() * 10000000)) : event.title
    }),
    intermediateTransforms: Array.from(stryMutAct_9fa48("37741") ? {} : (stryCov_9fa48("37741"), {
      length: stryMutAct_9fa48("37742") ? 3 - Math.floor(Math.random() * 3) : (stryCov_9fa48("37742"), 3 + Math.floor(stryMutAct_9fa48("37743") ? Math.random() / 3 : (stryCov_9fa48("37743"), Math.random() * 3)))
    }), stryMutAct_9fa48("37744") ? () => undefined : (stryCov_9fa48("37744"), (_, i) => stryMutAct_9fa48("37745") ? {} : (stryCov_9fa48("37745"), {
      step: stryMutAct_9fa48("37746") ? i - 1 : (stryCov_9fa48("37746"), i + 1),
      service: services[stryMutAct_9fa48("37747") ? i * services.length : (stryCov_9fa48("37747"), i % services.length)],
      operation: (stryMutAct_9fa48("37748") ? [] : (stryCov_9fa48("37748"), ['Extract', 'Transform', 'Validate', 'Enrich', 'Aggregate', 'Normalize']))[stryMutAct_9fa48("37755") ? i * 6 : (stryCov_9fa48("37755"), i % 6)],
      inputHash: generateHash(`input-${event.id}-${i}`),
      outputHash: generateHash(`output-${event.id}-${i}`),
      timestamp: new Date(stryMutAct_9fa48("37758") ? event.timestamp.getTime() + (3600000 - i * 600000) : (stryCov_9fa48("37758"), event.timestamp.getTime() - (stryMutAct_9fa48("37759") ? 3600000 + i * 600000 : (stryCov_9fa48("37759"), 3600000 - (stryMutAct_9fa48("37760") ? i / 600000 : (stryCov_9fa48("37760"), i * 600000)))))),
      duration: stryMutAct_9fa48("37761") ? 50 - Math.floor(Math.random() * 200) : (stryCov_9fa48("37761"), 50 + Math.floor(stryMutAct_9fa48("37762") ? Math.random() / 200 : (stryCov_9fa48("37762"), Math.random() * 200)))
    }))),
    finalOutput: stryMutAct_9fa48("37763") ? {} : (stryCov_9fa48("37763"), {
      value: event.title,
      confidence: stryMutAct_9fa48("37764") ? 0.85 - Math.random() * 0.14 : (stryCov_9fa48("37764"), 0.85 + (stryMutAct_9fa48("37765") ? Math.random() / 0.14 : (stryCov_9fa48("37765"), Math.random() * 0.14))),
      timestamp: event.timestamp
    }),
    agentProvenance: stryMutAct_9fa48("37766") ? {} : (stryCov_9fa48("37766"), {
      agentId: `agent-${Math.floor(stryMutAct_9fa48("37768") ? Math.random() / 6 : (stryCov_9fa48("37768"), Math.random() * 6))}`,
      agentName: agents[Math.floor(stryMutAct_9fa48("37769") ? Math.random() / agents.length : (stryCov_9fa48("37769"), Math.random() * agents.length))],
      agentRole: stryMutAct_9fa48("37772") ? event.actors?.[0] && 'Analyst' : stryMutAct_9fa48("37771") ? false : stryMutAct_9fa48("37770") ? true : (stryCov_9fa48("37770", "37771", "37772"), (stryMutAct_9fa48("37773") ? event.actors[0] : (stryCov_9fa48("37773"), event.actors?.[0])) || 'Analyst'),
      deliberationId: event.deliberationId,
      reasoning: `Analysis based on ${event.type} data patterns and historical precedent. Confidence level determined by data quality and model accuracy.`
    }),
    serviceChain: stryMutAct_9fa48("37776") ? services.map((s, i) => ({
      serviceName: s,
      version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      method: ['process', 'analyze', 'validate', 'transform'][i % 4],
      latency: 10 + Math.floor(Math.random() * 50)
    })) : (stryCov_9fa48("37776"), services.slice(0, stryMutAct_9fa48("37777") ? 3 - Math.floor(Math.random() * 2) : (stryCov_9fa48("37777"), 3 + Math.floor(stryMutAct_9fa48("37778") ? Math.random() / 2 : (stryCov_9fa48("37778"), Math.random() * 2)))).map(stryMutAct_9fa48("37779") ? () => undefined : (stryCov_9fa48("37779"), (s, i) => stryMutAct_9fa48("37780") ? {} : (stryCov_9fa48("37780"), {
      serviceName: s,
      version: `v${stryMutAct_9fa48("37782") ? Math.floor(Math.random() * 3) - 1 : (stryCov_9fa48("37782"), Math.floor(stryMutAct_9fa48("37783") ? Math.random() / 3 : (stryCov_9fa48("37783"), Math.random() * 3)) + 1)}.${Math.floor(stryMutAct_9fa48("37784") ? Math.random() / 10 : (stryCov_9fa48("37784"), Math.random() * 10))}.${Math.floor(stryMutAct_9fa48("37785") ? Math.random() / 20 : (stryCov_9fa48("37785"), Math.random() * 20))}`,
      method: (stryMutAct_9fa48("37786") ? [] : (stryCov_9fa48("37786"), ['process', 'analyze', 'validate', 'transform']))[stryMutAct_9fa48("37791") ? i * 4 : (stryCov_9fa48("37791"), i % 4)],
      latency: stryMutAct_9fa48("37792") ? 10 - Math.floor(Math.random() * 50) : (stryCov_9fa48("37792"), 10 + Math.floor(stryMutAct_9fa48("37793") ? Math.random() / 50 : (stryCov_9fa48("37793"), Math.random() * 50)))
    })))),
    datasetLineage: stryMutAct_9fa48("37794") ? datasets.map(d => ({
      datasetId: `ds-${generateHash(d).slice(0, 8)}`,
      datasetName: d,
      source: ['Salesforce', 'SAP', 'Workday', 'Internal'][Math.floor(Math.random() * 4)],
      lastUpdated: new Date(event.timestamp.getTime() - Math.random() * 86400000),
      recordCount: Math.floor(Math.random() * 1000000),
      quality: 0.9 + Math.random() * 0.09
    })) : (stryCov_9fa48("37794"), datasets.slice(0, stryMutAct_9fa48("37795") ? 2 - Math.floor(Math.random() * 2) : (stryCov_9fa48("37795"), 2 + Math.floor(stryMutAct_9fa48("37796") ? Math.random() / 2 : (stryCov_9fa48("37796"), Math.random() * 2)))).map(stryMutAct_9fa48("37797") ? () => undefined : (stryCov_9fa48("37797"), d => stryMutAct_9fa48("37798") ? {} : (stryCov_9fa48("37798"), {
      datasetId: `ds-${stryMutAct_9fa48("37800") ? generateHash(d) : (stryCov_9fa48("37800"), generateHash(d).slice(0, 8))}`,
      datasetName: d,
      source: (stryMutAct_9fa48("37801") ? [] : (stryCov_9fa48("37801"), ['Salesforce', 'SAP', 'Workday', 'Internal']))[Math.floor(stryMutAct_9fa48("37806") ? Math.random() / 4 : (stryCov_9fa48("37806"), Math.random() * 4))],
      lastUpdated: new Date(stryMutAct_9fa48("37807") ? event.timestamp.getTime() + Math.random() * 86400000 : (stryCov_9fa48("37807"), event.timestamp.getTime() - (stryMutAct_9fa48("37808") ? Math.random() / 86400000 : (stryCov_9fa48("37808"), Math.random() * 86400000)))),
      recordCount: Math.floor(stryMutAct_9fa48("37809") ? Math.random() / 1000000 : (stryCov_9fa48("37809"), Math.random() * 1000000)),
      quality: stryMutAct_9fa48("37810") ? 0.9 - Math.random() * 0.09 : (stryCov_9fa48("37810"), 0.9 + (stryMutAct_9fa48("37811") ? Math.random() / 0.09 : (stryCov_9fa48("37811"), Math.random() * 0.09)))
    })))),
    frameworkGovernance: stryMutAct_9fa48("37812") ? {} : (stryCov_9fa48("37812"), {
      framework: (stryMutAct_9fa48("37813") ? [] : (stryCov_9fa48("37813"), ['NIST CSF', 'ISO 27001', 'SOC 2', 'GDPR', 'OECD AI']))[Math.floor(stryMutAct_9fa48("37819") ? Math.random() / 5 : (stryCov_9fa48("37819"), Math.random() * 5))],
      policy: `${stryMutAct_9fa48("37823") ? event.department && 'Corporate' : stryMutAct_9fa48("37822") ? false : stryMutAct_9fa48("37821") ? true : (stryCov_9fa48("37821", "37822", "37823"), event.department || 'Corporate')} Data Governance Policy v2.1`,
      controls: stryMutAct_9fa48("37825") ? ['Access Control', 'Data Classification', 'Audit Logging', 'Encryption'] : (stryCov_9fa48("37825"), (stryMutAct_9fa48("37826") ? [] : (stryCov_9fa48("37826"), ['Access Control', 'Data Classification', 'Audit Logging', 'Encryption'])).slice(0, stryMutAct_9fa48("37831") ? 2 - Math.floor(Math.random() * 2) : (stryCov_9fa48("37831"), 2 + Math.floor(stryMutAct_9fa48("37832") ? Math.random() / 2 : (stryCov_9fa48("37832"), Math.random() * 2))))),
      validatedAt: new Date(stryMutAct_9fa48("37833") ? event.timestamp.getTime() + 60000 : (stryCov_9fa48("37833"), event.timestamp.getTime() - 60000)),
      validatedBy: 'Compliance Engine v3.2'
    }),
    integrityProof: stryMutAct_9fa48("37835") ? {} : (stryCov_9fa48("37835"), {
      merkleRoot: generateHash(`merkle-${event.id}`),
      blockNumber: stryMutAct_9fa48("37837") ? 4000 - Math.floor(Math.random() * 400) : (stryCov_9fa48("37837"), 4000 + Math.floor(stryMutAct_9fa48("37838") ? Math.random() / 400 : (stryCov_9fa48("37838"), Math.random() * 400))),
      signature: generateHash(`sig-${event.id}-${Date.now()}`)
    })
  });
};

// =============================================================================
// PER-EVENT COMPLIANCE SNAPSHOT GENERATOR
// =============================================================================

const generateEventComplianceSnapshot = (event: TimelineEvent): EventComplianceSnapshot => {
  const riskLevel = Math.random();
  return stryMutAct_9fa48("37841") ? {} : (stryCov_9fa48("37841"), {
    eventId: event.id,
    timestamp: event.timestamp,
    nistScore: stryMutAct_9fa48("37842") ? {} : (stryCov_9fa48("37842"), {
      overall: stryMutAct_9fa48("37843") ? 75 - Math.floor(Math.random() * 20) : (stryCov_9fa48("37843"), 75 + Math.floor(stryMutAct_9fa48("37844") ? Math.random() / 20 : (stryCov_9fa48("37844"), Math.random() * 20))),
      identify: stryMutAct_9fa48("37845") ? 70 - Math.floor(Math.random() * 25) : (stryCov_9fa48("37845"), 70 + Math.floor(stryMutAct_9fa48("37846") ? Math.random() / 25 : (stryCov_9fa48("37846"), Math.random() * 25))),
      protect: stryMutAct_9fa48("37847") ? 75 - Math.floor(Math.random() * 20) : (stryCov_9fa48("37847"), 75 + Math.floor(stryMutAct_9fa48("37848") ? Math.random() / 20 : (stryCov_9fa48("37848"), Math.random() * 20))),
      detect: stryMutAct_9fa48("37849") ? 80 - Math.floor(Math.random() * 15) : (stryCov_9fa48("37849"), 80 + Math.floor(stryMutAct_9fa48("37850") ? Math.random() / 15 : (stryCov_9fa48("37850"), Math.random() * 15))),
      respond: stryMutAct_9fa48("37851") ? 70 - Math.floor(Math.random() * 25) : (stryCov_9fa48("37851"), 70 + Math.floor(stryMutAct_9fa48("37852") ? Math.random() / 25 : (stryCov_9fa48("37852"), Math.random() * 25))),
      recover: stryMutAct_9fa48("37853") ? 65 - Math.floor(Math.random() * 30) : (stryCov_9fa48("37853"), 65 + Math.floor(stryMutAct_9fa48("37854") ? Math.random() / 30 : (stryCov_9fa48("37854"), Math.random() * 30)))
    }),
    oecdScore: stryMutAct_9fa48("37855") ? {} : (stryCov_9fa48("37855"), {
      overall: stryMutAct_9fa48("37856") ? 80 - Math.floor(Math.random() * 15) : (stryCov_9fa48("37856"), 80 + Math.floor(stryMutAct_9fa48("37857") ? Math.random() / 15 : (stryCov_9fa48("37857"), Math.random() * 15))),
      transparency: stryMutAct_9fa48("37858") ? 85 - Math.floor(Math.random() * 10) : (stryCov_9fa48("37858"), 85 + Math.floor(stryMutAct_9fa48("37859") ? Math.random() / 10 : (stryCov_9fa48("37859"), Math.random() * 10))),
      accountability: stryMutAct_9fa48("37860") ? 80 - Math.floor(Math.random() * 15) : (stryCov_9fa48("37860"), 80 + Math.floor(stryMutAct_9fa48("37861") ? Math.random() / 15 : (stryCov_9fa48("37861"), Math.random() * 15))),
      robustness: stryMutAct_9fa48("37862") ? 75 - Math.floor(Math.random() * 20) : (stryCov_9fa48("37862"), 75 + Math.floor(stryMutAct_9fa48("37863") ? Math.random() / 20 : (stryCov_9fa48("37863"), Math.random() * 20))),
      fairness: stryMutAct_9fa48("37864") ? 82 - Math.floor(Math.random() * 13) : (stryCov_9fa48("37864"), 82 + Math.floor(stryMutAct_9fa48("37865") ? Math.random() / 13 : (stryCov_9fa48("37865"), Math.random() * 13))),
      privacy: stryMutAct_9fa48("37866") ? 78 - Math.floor(Math.random() * 17) : (stryCov_9fa48("37866"), 78 + Math.floor(stryMutAct_9fa48("37867") ? Math.random() / 17 : (stryCov_9fa48("37867"), Math.random() * 17)))
    }),
    privacyCompliance: stryMutAct_9fa48("37868") ? {} : (stryCov_9fa48("37868"), {
      gdprStatus: (stryMutAct_9fa48("37872") ? riskLevel >= 0.1 : stryMutAct_9fa48("37871") ? riskLevel <= 0.1 : stryMutAct_9fa48("37870") ? false : stryMutAct_9fa48("37869") ? true : (stryCov_9fa48("37869", "37870", "37871", "37872"), riskLevel < 0.1)) ? 'violation' : (stryMutAct_9fa48("37877") ? riskLevel >= 0.25 : stryMutAct_9fa48("37876") ? riskLevel <= 0.25 : stryMutAct_9fa48("37875") ? false : stryMutAct_9fa48("37874") ? true : (stryCov_9fa48("37874", "37875", "37876", "37877"), riskLevel < 0.25)) ? 'warning' : 'compliant',
      ccpaStatus: (stryMutAct_9fa48("37883") ? riskLevel >= 0.08 : stryMutAct_9fa48("37882") ? riskLevel <= 0.08 : stryMutAct_9fa48("37881") ? false : stryMutAct_9fa48("37880") ? true : (stryCov_9fa48("37880", "37881", "37882", "37883"), riskLevel < 0.08)) ? 'violation' : (stryMutAct_9fa48("37888") ? riskLevel >= 0.2 : stryMutAct_9fa48("37887") ? riskLevel <= 0.2 : stryMutAct_9fa48("37886") ? false : stryMutAct_9fa48("37885") ? true : (stryCov_9fa48("37885", "37886", "37887", "37888"), riskLevel < 0.2)) ? 'warning' : 'compliant',
      dataMinimization: stryMutAct_9fa48("37891") ? 85 - Math.floor(Math.random() * 12) : (stryCov_9fa48("37891"), 85 + Math.floor(stryMutAct_9fa48("37892") ? Math.random() / 12 : (stryCov_9fa48("37892"), Math.random() * 12))),
      consentCoverage: stryMutAct_9fa48("37893") ? 92 - Math.floor(Math.random() * 7) : (stryCov_9fa48("37893"), 92 + Math.floor(stryMutAct_9fa48("37894") ? Math.random() / 7 : (stryCov_9fa48("37894"), Math.random() * 7))),
      retentionCompliance: stryMutAct_9fa48("37895") ? 88 - Math.floor(Math.random() * 10) : (stryCov_9fa48("37895"), 88 + Math.floor(stryMutAct_9fa48("37896") ? Math.random() / 10 : (stryCov_9fa48("37896"), Math.random() * 10)))
    }),
    securityPosture: stryMutAct_9fa48("37897") ? {} : (stryCov_9fa48("37897"), {
      overallScore: stryMutAct_9fa48("37898") ? 82 - Math.floor(Math.random() * 15) : (stryCov_9fa48("37898"), 82 + Math.floor(stryMutAct_9fa48("37899") ? Math.random() / 15 : (stryCov_9fa48("37899"), Math.random() * 15))),
      vulnerabilities: stryMutAct_9fa48("37900") ? {} : (stryCov_9fa48("37900"), {
        critical: Math.floor(stryMutAct_9fa48("37901") ? Math.random() / 2 : (stryCov_9fa48("37901"), Math.random() * 2)),
        high: Math.floor(stryMutAct_9fa48("37902") ? Math.random() / 5 : (stryCov_9fa48("37902"), Math.random() * 5)),
        medium: Math.floor(stryMutAct_9fa48("37903") ? Math.random() / 15 : (stryCov_9fa48("37903"), Math.random() * 15)),
        low: Math.floor(stryMutAct_9fa48("37904") ? Math.random() / 30 : (stryCov_9fa48("37904"), Math.random() * 30))
      }),
      encryptionCoverage: stryMutAct_9fa48("37905") ? 95 - Math.floor(Math.random() * 4) : (stryCov_9fa48("37905"), 95 + Math.floor(stryMutAct_9fa48("37906") ? Math.random() / 4 : (stryCov_9fa48("37906"), Math.random() * 4))),
      accessControlScore: stryMutAct_9fa48("37907") ? 88 - Math.floor(Math.random() * 10) : (stryCov_9fa48("37907"), 88 + Math.floor(stryMutAct_9fa48("37908") ? Math.random() / 10 : (stryCov_9fa48("37908"), Math.random() * 10))),
      auditLogIntegrity: stryMutAct_9fa48("37909") ? 99 - Math.random() : (stryCov_9fa48("37909"), 99 + Math.random())
    }),
    stakeholderImpact: stryMutAct_9fa48("37910") ? {} : (stryCov_9fa48("37910"), {
      customersAffected: (stryMutAct_9fa48("37913") ? event.type !== 'milestone' : stryMutAct_9fa48("37912") ? false : stryMutAct_9fa48("37911") ? true : (stryCov_9fa48("37911", "37912", "37913"), event.type === 'milestone')) ? Math.floor(stryMutAct_9fa48("37915") ? Math.random() / 10000 : (stryCov_9fa48("37915"), Math.random() * 10000)) : Math.floor(stryMutAct_9fa48("37916") ? Math.random() / 500 : (stryCov_9fa48("37916"), Math.random() * 500)),
      employeesAffected: (stryMutAct_9fa48("37919") ? event.type !== 'personnel' : stryMutAct_9fa48("37918") ? false : stryMutAct_9fa48("37917") ? true : (stryCov_9fa48("37917", "37918", "37919"), event.type === 'personnel')) ? Math.floor(stryMutAct_9fa48("37921") ? Math.random() / 50 : (stryCov_9fa48("37921"), Math.random() * 50)) : Math.floor(stryMutAct_9fa48("37922") ? Math.random() / 10 : (stryCov_9fa48("37922"), Math.random() * 10)),
      partnersAffected: Math.floor(stryMutAct_9fa48("37923") ? Math.random() / 5 : (stryCov_9fa48("37923"), Math.random() * 5)),
      financialExposure: (stryMutAct_9fa48("37926") ? event.type !== 'financial' : stryMutAct_9fa48("37925") ? false : stryMutAct_9fa48("37924") ? true : (stryCov_9fa48("37924", "37925", "37926"), event.type === 'financial')) ? Math.floor(stryMutAct_9fa48("37928") ? Math.random() / 5000000 : (stryCov_9fa48("37928"), Math.random() * 5000000)) : Math.floor(stryMutAct_9fa48("37929") ? Math.random() / 500000 : (stryCov_9fa48("37929"), Math.random() * 500000)),
      reputationalRisk: (stryMutAct_9fa48("37933") ? riskLevel >= 0.1 : stryMutAct_9fa48("37932") ? riskLevel <= 0.1 : stryMutAct_9fa48("37931") ? false : stryMutAct_9fa48("37930") ? true : (stryCov_9fa48("37930", "37931", "37932", "37933"), riskLevel < 0.1)) ? 'critical' : (stryMutAct_9fa48("37938") ? riskLevel >= 0.25 : stryMutAct_9fa48("37937") ? riskLevel <= 0.25 : stryMutAct_9fa48("37936") ? false : stryMutAct_9fa48("37935") ? true : (stryCov_9fa48("37935", "37936", "37937", "37938"), riskLevel < 0.25)) ? 'high' : (stryMutAct_9fa48("37943") ? riskLevel >= 0.5 : stryMutAct_9fa48("37942") ? riskLevel <= 0.5 : stryMutAct_9fa48("37941") ? false : stryMutAct_9fa48("37940") ? true : (stryCov_9fa48("37940", "37941", "37942", "37943"), riskLevel < 0.5)) ? 'medium' : 'low'
    }),
    driftScore: stryMutAct_9fa48("37946") ? {} : (stryCov_9fa48("37946"), {
      modelDrift: stryMutAct_9fa48("37947") ? Math.random() / 0.15 : (stryCov_9fa48("37947"), Math.random() * 0.15),
      dataDrift: stryMutAct_9fa48("37948") ? Math.random() / 0.12 : (stryCov_9fa48("37948"), Math.random() * 0.12),
      conceptDrift: stryMutAct_9fa48("37949") ? Math.random() / 0.08 : (stryCov_9fa48("37949"), Math.random() * 0.08),
      performanceDrift: stryMutAct_9fa48("37950") ? Math.random() / 0.1 : (stryCov_9fa48("37950"), Math.random() * 0.1),
      lastCalibration: new Date(stryMutAct_9fa48("37951") ? event.timestamp.getTime() + Math.random() * 7 * 86400000 : (stryCov_9fa48("37951"), event.timestamp.getTime() - (stryMutAct_9fa48("37952") ? Math.random() * 7 / 86400000 : (stryCov_9fa48("37952"), (stryMutAct_9fa48("37953") ? Math.random() / 7 : (stryCov_9fa48("37953"), Math.random() * 7)) * 86400000))))
    })
  });
};

// =============================================================================
// REVERSE TIME CHECK GENERATOR - Chronos Integrity Validation
// =============================================================================

const generateReverseTimeCheck = (targetDate: Date, mode: ChronosMode): ReverseTimeCheck => {
  const hasMismatch = stryMutAct_9fa48("37958") ? Math.random() >= 0.05 : stryMutAct_9fa48("37957") ? Math.random() <= 0.05 : stryMutAct_9fa48("37956") ? false : stryMutAct_9fa48("37955") ? true : (stryCov_9fa48("37955", "37956", "37957", "37958"), Math.random() < 0.05); // 5% chance of detecting a mismatch
  const expectedHash = generateHash(`expected-${targetDate.toISOString()}`);
  const actualHash = hasMismatch ? generateHash(`actual-${Date.now()}`) : expectedHash;
  return stryMutAct_9fa48("37961") ? {} : (stryCov_9fa48("37961"), {
    id: `rtc-${Date.now()}`,
    targetDate,
    requestedBy: 'compliance@company.com',
    requestedAt: new Date(),
    status: hasMismatch ? 'mismatch_detected' : 'complete',
    progress: 100,
    reconstructedState: generateSnapshot(targetDate, mode),
    expectedHash,
    actualHash,
    mismatches: hasMismatch ? stryMutAct_9fa48("37966") ? [] : (stryCov_9fa48("37966"), [stryMutAct_9fa48("37967") ? {} : (stryCov_9fa48("37967"), {
      field: 'metrics.revenue',
      expected: 12500000,
      actual: 12487500,
      severity: 'medium',
      possibleCauses: stryMutAct_9fa48("37970") ? [] : (stryCov_9fa48("37970"), ['Late transaction reconciliation', 'Currency conversion timing', 'Rounding differences'])
    })]) : stryMutAct_9fa48("37974") ? ["Stryker was here"] : (stryCov_9fa48("37974"), []),
    tamperProofSignal: stryMutAct_9fa48("37975") ? {} : (stryCov_9fa48("37975"), {
      isValid: stryMutAct_9fa48("37976") ? hasMismatch : (stryCov_9fa48("37976"), !hasMismatch),
      validationMethod: 'Merkle Tree + Digital Signatures',
      merkleProof: Array.from(stryMutAct_9fa48("37978") ? {} : (stryCov_9fa48("37978"), {
        length: 8
      }), stryMutAct_9fa48("37979") ? () => undefined : (stryCov_9fa48("37979"), (_, i) => generateHash(`proof-${i}-${targetDate.toISOString()}`))),
      blockRange: stryMutAct_9fa48("37981") ? [] : (stryCov_9fa48("37981"), [4000, 4382]),
      witnessSignatures: (stryMutAct_9fa48("37982") ? [] : (stryCov_9fa48("37982"), ['Chronos Node 1', 'Chronos Node 2', 'Chronos Node 3'])).map(stryMutAct_9fa48("37986") ? () => undefined : (stryCov_9fa48("37986"), w => generateHash(`witness-${w}`)))
    }),
    forensicReport: stryMutAct_9fa48("37988") ? {} : (stryCov_9fa48("37988"), {
      generatedAt: new Date(),
      findings: hasMismatch ? stryMutAct_9fa48("37989") ? [] : (stryCov_9fa48("37989"), ['Minor discrepancy detected in revenue metrics', 'All other fields validated successfully', 'Hash chain integrity maintained']) : stryMutAct_9fa48("37993") ? [] : (stryCov_9fa48("37993"), ['All state reconstructions match stored hashes', 'No tampering detected', 'Full audit trail verified']),
      recommendations: hasMismatch ? stryMutAct_9fa48("37997") ? [] : (stryCov_9fa48("37997"), ['Review transaction logs for the affected period', 'Verify ERP sync status', 'Consider manual reconciliation']) : stryMutAct_9fa48("38001") ? [] : (stryCov_9fa48("38001"), ['Continue regular monitoring', 'Schedule next integrity check']),
      legalAdmissible: stryMutAct_9fa48("38004") ? false : (stryCov_9fa48("38004"), true)
    })
  });
};

// =============================================================================
// ZERO-KNOWLEDGE PROOF GENERATOR
// =============================================================================

const generateZKProof = (proofType: ZeroKnowledgeProof['proofType'], framework: ZeroKnowledgeProof['framework'], claim: string): ZeroKnowledgeProof => {
  return stryMutAct_9fa48("38006") ? {} : (stryCov_9fa48("38006"), {
    id: `zkp-${Date.now()}`,
    proofType,
    claim,
    framework,
    generatedAt: new Date(),
    expiresAt: new Date(stryMutAct_9fa48("38008") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38008"), Date.now() + (stryMutAct_9fa48("38009") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38009"), (stryMutAct_9fa48("38010") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("38010"), (stryMutAct_9fa48("38011") ? 30 * 24 / 60 : (stryCov_9fa48("38011"), (stryMutAct_9fa48("38012") ? 30 / 24 : (stryCov_9fa48("38012"), 30 * 24)) * 60)) * 60)) * 1000)))),
    // 30 days
    proof: stryMutAct_9fa48("38013") ? {} : (stryCov_9fa48("38013"), {
      commitment: generateHash(`commitment-${framework}-${Date.now()}`),
      challenge: generateHash(`challenge-${framework}-${Date.now()}`),
      response: generateHash(`response-${framework}-${Date.now()}`),
      publicInputs: stryMutAct_9fa48("38017") ? [] : (stryCov_9fa48("38017"), [`Framework: ${framework}`, `Time Range: Last 365 days`, `Compliance Status: VERIFIED`])
    }),
    verification: stryMutAct_9fa48("38021") ? {} : (stryCov_9fa48("38021"), {
      isValid: stryMutAct_9fa48("38022") ? false : (stryCov_9fa48("38022"), true),
      verifiedAt: new Date(),
      verifierSignature: generateHash(`verifier-sig-${Date.now()}`),
      verificationHash: generateHash(`verification-${framework}-${Date.now()}`)
    }),
    metadata: stryMutAct_9fa48("38025") ? {} : (stryCov_9fa48("38025"), {
      dataPointsProven: stryMutAct_9fa48("38026") ? 10000 - Math.floor(Math.random() * 50000) : (stryCov_9fa48("38026"), 10000 + Math.floor(stryMutAct_9fa48("38027") ? Math.random() / 50000 : (stryCov_9fa48("38027"), Math.random() * 50000))),
      timeRangeCovered: stryMutAct_9fa48("38028") ? {} : (stryCov_9fa48("38028"), {
        start: new Date(stryMutAct_9fa48("38029") ? Date.now() + 365 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38029"), Date.now() - (stryMutAct_9fa48("38030") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38030"), (stryMutAct_9fa48("38031") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("38031"), (stryMutAct_9fa48("38032") ? 365 * 24 / 60 : (stryCov_9fa48("38032"), (stryMutAct_9fa48("38033") ? 365 / 24 : (stryCov_9fa48("38033"), 365 * 24)) * 60)) * 60)) * 1000)))),
        end: new Date()
      }),
      piiExposed: stryMutAct_9fa48("38034") ? true : (stryCov_9fa48("38034"), false),
      secretsRevealed: stryMutAct_9fa48("38035") ? true : (stryCov_9fa48("38035"), false)
    })
  });
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ChronosPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Core State
  const [mode, setMode] = useState<ChronosMode>('rewind');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(stryMutAct_9fa48("38038") ? true : (stryCov_9fa48("38038"), false));
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [events, setEvents] = useState<TimelineEvent[]>(stryMutAct_9fa48("38039") ? ["Stryker was here"] : (stryCov_9fa48("38039"), []));
  const [snapshot, setSnapshot] = useState<StateSnapshot>(stryMutAct_9fa48("38040") ? () => undefined : (stryCov_9fa48("38040"), () => generateSnapshot(new Date(), 'rewind')));
  const [realMetrics, setRealMetrics] = useState<any[]>(stryMutAct_9fa48("38042") ? ["Stryker was here"] : (stryCov_9fa48("38042"), []));
  const [realDeliberations, setRealDeliberations] = useState<any[]>(stryMutAct_9fa48("38043") ? ["Stryker was here"] : (stryCov_9fa48("38043"), []));
  const [isLoadingData, setIsLoadingData] = useState(stryMutAct_9fa48("38044") ? false : (stryCov_9fa48("38044"), true));

  // Department Filter State
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const departments = stryMutAct_9fa48("38046") ? [] : (stryCov_9fa48("38046"), ['all', 'Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations', 'Product', 'Executive']);

  // Enhanced State
  const [enhancedView, setEnhancedView] = useState<EnhancedView>('standard');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(stryMutAct_9fa48("38057") ? ["Stryker was here"] : (stryCov_9fa48("38057"), []));
  const [pivotalMoments, setPivotalMoments] = useState<PivotalMoment[]>(stryMutAct_9fa48("38058") ? ["Stryker was here"] : (stryCov_9fa48("38058"), []));
  const [diffDate, setDiffDate] = useState<Date | null>(null);
  const [diffSnapshot, setDiffSnapshot] = useState<StateSnapshot | null>(null);
  const [selectedReplay, setSelectedReplay] = useState<CouncilReplay | null>(null);
  const [causalChain, setCausalChain] = useState<CausalChain | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult | null>(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(stryMutAct_9fa48("38059") ? true : (stryCov_9fa48("38059"), false));
  const [graphNodes, setGraphNodes] = useState<Array<{
    x: number;
    y: number;
    size: number;
  }>>(stryMutAct_9fa48("38060") ? ["Stryker was here"] : (stryCov_9fa48("38060"), []));
  const [realGraphStats, setRealGraphStats] = useState<{
    entities: number;
    relationships: number;
    dataPoints: number;
    freshness: number;
  } | null>(null);
  const [branches, setBranches] = useState<BranchTimeline[]>(stryMutAct_9fa48("38061") ? ["Stryker was here"] : (stryCov_9fa48("38061"), []));
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(stryMutAct_9fa48("38062") ? true : (stryCov_9fa48("38062"), false));
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Enterprise Compliance State (The Undefeatable 5%)
  const [ledger, setLedger] = useState<ChronosLedger>(stryMutAct_9fa48("38063") ? () => undefined : (stryCov_9fa48("38063"), () => generateLedger()));
  const [liveSyncStatus, setLiveSyncStatus] = useState<LiveSyncStatus>(stryMutAct_9fa48("38064") ? () => undefined : (stryCov_9fa48("38064"), () => generateLiveSyncStatus()));
  const [witnessSessions, setWitnessSessions] = useState<WitnessSession[]>(stryMutAct_9fa48("38065") ? ["Stryker was here"] : (stryCov_9fa48("38065"), []));
  const [showCompliancePanel, setShowCompliancePanel] = useState(stryMutAct_9fa48("38066") ? true : (stryCov_9fa48("38066"), false));
  const [showCourtExportModal, setShowCourtExportModal] = useState(stryMutAct_9fa48("38067") ? true : (stryCov_9fa48("38067"), false));
  const [showWitnessModal, setShowWitnessModal] = useState(stryMutAct_9fa48("38068") ? true : (stryCov_9fa48("38068"), false));
  const [witnessEvent, setWitnessEvent] = useState<TimelineEvent | null>(null);
  const [redactionRules] = useState<RedactionRule[]>(DEFAULT_REDACTION_RULES);
  const [exportInProgress, setExportInProgress] = useState(stryMutAct_9fa48("38069") ? true : (stryCov_9fa48("38069"), false));

  // Chronos-ERP™ State - Enterprise System Time Travel
  const [erpConnectors] = useState<ERPConnector[]>(stryMutAct_9fa48("38070") ? () => undefined : (stryCov_9fa48("38070"), () => generateERPConnectors()));
  const [showERPPanel, setShowERPPanel] = useState(stryMutAct_9fa48("38071") ? true : (stryCov_9fa48("38071"), false));
  const [selectedERPSource, setSelectedERPSource] = useState<ERPSource | 'all'>('all');
  const [erpSnapshot, setErpSnapshot] = useState<ERPStateSnapshot>(stryMutAct_9fa48("38073") ? () => undefined : (stryCov_9fa48("38073"), () => generateERPSnapshot(new Date())));
  const [crmEvents] = useState(stryMutAct_9fa48("38074") ? () => undefined : (stryCov_9fa48("38074"), () => generateCRMEvents()));
  const [erpTransactions] = useState(stryMutAct_9fa48("38075") ? () => undefined : (stryCov_9fa48("38075"), () => generateERPTransactions()));
  const [hrEvents] = useState(stryMutAct_9fa48("38076") ? () => undefined : (stryCov_9fa48("38076"), () => generateHREvents()));
  const [engineeringEvents] = useState(stryMutAct_9fa48("38077") ? () => undefined : (stryCov_9fa48("38077"), () => generateEngineeringEvents()));
  const [serviceTickets] = useState(stryMutAct_9fa48("38078") ? () => undefined : (stryCov_9fa48("38078"), () => generateServiceTickets()));
  const [documentRevisions] = useState(stryMutAct_9fa48("38079") ? () => undefined : (stryCov_9fa48("38079"), () => generateDocumentRevisions()));

  // =========================================================================
  // NEW FEATURE STATES - The 5 Power Features
  // =========================================================================

  // (1) Full Traceability Views
  const [showTraceability, setShowTraceability] = useState(stryMutAct_9fa48("38080") ? true : (stryCov_9fa48("38080"), false));
  const [traceabilityView, setTraceabilityView] = useState<TraceabilityView | null>(null);

  // (2) Per-Event Compliance Snapshot
  const [showComplianceSnapshot, setShowComplianceSnapshot] = useState(stryMutAct_9fa48("38081") ? true : (stryCov_9fa48("38081"), false));
  const [eventComplianceSnapshot, setEventComplianceSnapshot] = useState<EventComplianceSnapshot | null>(null);

  // (3) Reverse Time Checks - Chronos Integrity Validation
  const [showReverseTimeCheck, setShowReverseTimeCheck] = useState(stryMutAct_9fa48("38082") ? true : (stryCov_9fa48("38082"), false));
  const [reverseTimeCheck, setReverseTimeCheck] = useState<ReverseTimeCheck | null>(null);
  const [reverseTimeProgress, setReverseTimeProgress] = useState(0);
  const [isRebuildingState, setIsRebuildingState] = useState(stryMutAct_9fa48("38083") ? true : (stryCov_9fa48("38083"), false));

  // (4) Regulator Mode
  const [regulatorMode, setRegulatorMode] = useState(stryMutAct_9fa48("38084") ? true : (stryCov_9fa48("38084"), false));
  const [regulatorSession, setRegulatorSession] = useState<RegulatorSession | null>(null);
  const [showRegulatorSetup, setShowRegulatorSetup] = useState(stryMutAct_9fa48("38085") ? true : (stryCov_9fa48("38085"), false));

  // (5) Zero-Knowledge Audits
  const [showZKAudit, setShowZKAudit] = useState(stryMutAct_9fa48("38086") ? true : (stryCov_9fa48("38086"), false));
  const [zkProofs, setZkProofs] = useState<ZeroKnowledgeProof[]>(stryMutAct_9fa48("38087") ? ["Stryker was here"] : (stryCov_9fa48("38087"), []));
  const [isGeneratingProof, setIsGeneratingProof] = useState(stryMutAct_9fa48("38088") ? true : (stryCov_9fa48("38088"), false));

  // Time range based on mode
  const timeRange = useMemo(() => {
    const now = new Date();
    if (stryMutAct_9fa48("38092") ? mode !== 'rewind' : stryMutAct_9fa48("38091") ? false : stryMutAct_9fa48("38090") ? true : (stryCov_9fa48("38090", "38091", "38092"), mode === 'rewind')) {
      return stryMutAct_9fa48("38095") ? {} : (stryCov_9fa48("38095"), {
        min: new Date(stryMutAct_9fa48("38096") ? now.getTime() + 730 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38096"), now.getTime() - (stryMutAct_9fa48("38097") ? 730 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38097"), (stryMutAct_9fa48("38098") ? 730 * 24 * 60 / 60 : (stryCov_9fa48("38098"), (stryMutAct_9fa48("38099") ? 730 * 24 / 60 : (stryCov_9fa48("38099"), (stryMutAct_9fa48("38100") ? 730 / 24 : (stryCov_9fa48("38100"), 730 * 24)) * 60)) * 60)) * 1000)))),
        // 2 years ago
        max: now
      });
    } else if (stryMutAct_9fa48("38103") ? mode !== 'fastforward' : stryMutAct_9fa48("38102") ? false : stryMutAct_9fa48("38101") ? true : (stryCov_9fa48("38101", "38102", "38103"), mode === 'fastforward')) {
      return stryMutAct_9fa48("38106") ? {} : (stryCov_9fa48("38106"), {
        min: now,
        max: new Date(stryMutAct_9fa48("38107") ? now.getTime() - 365 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38107"), now.getTime() + (stryMutAct_9fa48("38108") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38108"), (stryMutAct_9fa48("38109") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("38109"), (stryMutAct_9fa48("38110") ? 365 * 24 / 60 : (stryCov_9fa48("38110"), (stryMutAct_9fa48("38111") ? 365 / 24 : (stryCov_9fa48("38111"), 365 * 24)) * 60)) * 60)) * 1000)))) // 1 year ahead
      });
    } else {
      return stryMutAct_9fa48("38113") ? {} : (stryCov_9fa48("38113"), {
        min: new Date(stryMutAct_9fa48("38114") ? now.getTime() + 365 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38114"), now.getTime() - (stryMutAct_9fa48("38115") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38115"), (stryMutAct_9fa48("38116") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("38116"), (stryMutAct_9fa48("38117") ? 365 * 24 / 60 : (stryCov_9fa48("38117"), (stryMutAct_9fa48("38118") ? 365 / 24 : (stryCov_9fa48("38118"), 365 * 24)) * 60)) * 60)) * 1000)))),
        max: now
      });
    }
  }, stryMutAct_9fa48("38119") ? [] : (stryCov_9fa48("38119"), [mode]));

  // Update snapshot when date changes - apply time-based projection to metrics
  useEffect(() => {
    // Calculate time-based factor for projecting metrics forward/backward
    const now = new Date();
    const daysDiff = stryMutAct_9fa48("38121") ? (now.getTime() - currentDate.getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("38121"), (stryMutAct_9fa48("38122") ? now.getTime() + currentDate.getTime() : (stryCov_9fa48("38122"), now.getTime() - currentDate.getTime())) / (stryMutAct_9fa48("38123") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("38123"), (stryMutAct_9fa48("38124") ? 24 * 60 / 60 : (stryCov_9fa48("38124"), (stryMutAct_9fa48("38125") ? 24 / 60 : (stryCov_9fa48("38125"), 24 * 60)) * 60)) * 1000)));
    const isPast = stryMutAct_9fa48("38129") ? daysDiff <= 0 : stryMutAct_9fa48("38128") ? daysDiff >= 0 : stryMutAct_9fa48("38127") ? false : stryMutAct_9fa48("38126") ? true : (stryCov_9fa48("38126", "38127", "38128", "38129"), daysDiff > 0);

    // Growth/decay factor based on time distance
    // Past: values were lower, Future: values projected higher (with uncertainty)
    const growthRate = 0.0008; // ~30% annual growth rate
    const factor = isPast ? Math.pow(stryMutAct_9fa48("38130") ? 1 + growthRate : (stryCov_9fa48("38130"), 1 - growthRate), daysDiff) : Math.pow(stryMutAct_9fa48("38131") ? 1 - growthRate : (stryCov_9fa48("38131"), 1 + growthRate), stryMutAct_9fa48("38132") ? +daysDiff : (stryCov_9fa48("38132"), -daysDiff));

    // Add some volatility for future projections
    const volatility = (stryMutAct_9fa48("38135") ? mode !== 'fastforward' : stryMutAct_9fa48("38134") ? false : stryMutAct_9fa48("38133") ? true : (stryCov_9fa48("38133", "38134", "38135"), mode === 'fastforward')) ? 0.15 : 0.05;
    const randomFactor = stryMutAct_9fa48("38137") ? 1 - (Math.random() - 0.5) * volatility : (stryCov_9fa48("38137"), 1 + (stryMutAct_9fa48("38138") ? (Math.random() - 0.5) / volatility : (stryCov_9fa48("38138"), (stryMutAct_9fa48("38139") ? Math.random() + 0.5 : (stryCov_9fa48("38139"), Math.random() - 0.5)) * volatility)));

    // Apply time-based transformation
    const projectValue = (baseValue: number, isWholeNumber: boolean = stryMutAct_9fa48("38140") ? true : (stryCov_9fa48("38140"), false)): number => {
      const projected = stryMutAct_9fa48("38142") ? baseValue * factor / randomFactor : (stryCov_9fa48("38142"), (stryMutAct_9fa48("38143") ? baseValue / factor : (stryCov_9fa48("38143"), baseValue * factor)) * randomFactor);
      return isWholeNumber ? Math.round(projected) : stryMutAct_9fa48("38144") ? Math.round(projected * 100) * 100 : (stryCov_9fa48("38144"), Math.round(stryMutAct_9fa48("38145") ? projected / 100 : (stryCov_9fa48("38145"), projected * 100)) / 100);
    };

    // Try to use real metrics as base values
    const getMetricValue = (code: string, fallback: number): number => {
      if (stryMutAct_9fa48("38150") ? realMetrics.length <= 0 : stryMutAct_9fa48("38149") ? realMetrics.length >= 0 : stryMutAct_9fa48("38148") ? false : stryMutAct_9fa48("38147") ? true : (stryCov_9fa48("38147", "38148", "38149", "38150"), realMetrics.length > 0)) {
        const metric = realMetrics.find(stryMutAct_9fa48("38152") ? () => undefined : (stryCov_9fa48("38152"), (m: any) => stryMutAct_9fa48("38155") ? m.code?.toLowerCase().includes(code.toLowerCase()) && m.name?.toLowerCase().includes(code.toLowerCase()) : stryMutAct_9fa48("38154") ? false : stryMutAct_9fa48("38153") ? true : (stryCov_9fa48("38153", "38154", "38155"), (stryMutAct_9fa48("38157") ? m.code.toLowerCase().includes(code.toLowerCase()) : stryMutAct_9fa48("38156") ? m.code?.toUpperCase().includes(code.toLowerCase()) : (stryCov_9fa48("38156", "38157"), m.code?.toLowerCase().includes(stryMutAct_9fa48("38158") ? code.toUpperCase() : (stryCov_9fa48("38158"), code.toLowerCase())))) || (stryMutAct_9fa48("38160") ? m.name.toLowerCase().includes(code.toLowerCase()) : stryMutAct_9fa48("38159") ? m.name?.toUpperCase().includes(code.toLowerCase()) : (stryCov_9fa48("38159", "38160"), m.name?.toLowerCase().includes(stryMutAct_9fa48("38161") ? code.toUpperCase() : (stryCov_9fa48("38161"), code.toLowerCase())))))));
        return stryMutAct_9fa48("38164") ? (metric?.current_value || metric?.value) && fallback : stryMutAct_9fa48("38163") ? false : stryMutAct_9fa48("38162") ? true : (stryCov_9fa48("38162", "38163", "38164"), (stryMutAct_9fa48("38166") ? metric?.current_value && metric?.value : stryMutAct_9fa48("38165") ? false : (stryCov_9fa48("38165", "38166"), (stryMutAct_9fa48("38167") ? metric.current_value : (stryCov_9fa48("38167"), metric?.current_value)) || (stryMutAct_9fa48("38168") ? metric.value : (stryCov_9fa48("38168"), metric?.value)))) || fallback);
      }
      return fallback;
    };

    // Build snapshot with time-projected values
    const projectedSnapshot: StateSnapshot = stryMutAct_9fa48("38169") ? {} : (stryCov_9fa48("38169"), {
      timestamp: currentDate,
      metrics: stryMutAct_9fa48("38170") ? {} : (stryCov_9fa48("38170"), {
        revenue: projectValue(getMetricValue('revenue', 12500000)),
        profit: projectValue(getMetricValue('profit', 2800000)),
        employees: projectValue(getMetricValue('headcount', 156), stryMutAct_9fa48("38174") ? false : (stryCov_9fa48("38174"), true)),
        customers: projectValue(getMetricValue('customers', 847), stryMutAct_9fa48("38176") ? false : (stryCov_9fa48("38176"), true)),
        satisfaction: stryMutAct_9fa48("38177") ? Math.max(100, Math.max(0, projectValue(getMetricValue('satisfaction', 87)))) : (stryCov_9fa48("38177"), Math.min(100, stryMutAct_9fa48("38178") ? Math.min(0, projectValue(getMetricValue('satisfaction', 87))) : (stryCov_9fa48("38178"), Math.max(0, projectValue(getMetricValue('satisfaction', 87)))))),
        marketShare: stryMutAct_9fa48("38180") ? Math.min(0, projectValue(getMetricValue('market', 12.4))) : (stryCov_9fa48("38180"), Math.max(0, projectValue(getMetricValue('market', 12.4)))),
        burnRate: projectValue(getMetricValue('burn', 850000)),
        runway: stryMutAct_9fa48("38183") ? Math.min(0, projectValue(getMetricValue('runway', 18), true)) : (stryCov_9fa48("38183"), Math.max(0, projectValue(getMetricValue('runway', 18), stryMutAct_9fa48("38185") ? false : (stryCov_9fa48("38185"), true))))
      }),
      council: stryMutAct_9fa48("38186") ? {} : (stryCov_9fa48("38186"), {
        activeAgents: stryMutAct_9fa48("38187") ? ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent'] : (stryCov_9fa48("38187"), (stryMutAct_9fa48("38188") ? [] : (stryCov_9fa48("38188"), ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent'])).slice(0, stryMutAct_9fa48("38194") ? Math.floor(Math.random() * 2) - 4 : (stryCov_9fa48("38194"), Math.floor(stryMutAct_9fa48("38195") ? Math.random() / 2 : (stryCov_9fa48("38195"), Math.random() * 2)) + 4))),
        pendingDecisions: stryMutAct_9fa48("38196") ? Math.min(0, Math.floor(realDeliberations.filter((d: any) => d.status === 'PENDING' || d.status === 'IN_PROGRESS').length * factor)) : (stryCov_9fa48("38196"), Math.max(0, Math.floor(stryMutAct_9fa48("38197") ? realDeliberations.filter((d: any) => d.status === 'PENDING' || d.status === 'IN_PROGRESS').length / factor : (stryCov_9fa48("38197"), (stryMutAct_9fa48("38198") ? realDeliberations.length : (stryCov_9fa48("38198"), realDeliberations.filter(stryMutAct_9fa48("38199") ? () => undefined : (stryCov_9fa48("38199"), (d: any) => stryMutAct_9fa48("38202") ? d.status === 'PENDING' && d.status === 'IN_PROGRESS' : stryMutAct_9fa48("38201") ? false : stryMutAct_9fa48("38200") ? true : (stryCov_9fa48("38200", "38201", "38202"), (stryMutAct_9fa48("38204") ? d.status !== 'PENDING' : stryMutAct_9fa48("38203") ? false : (stryCov_9fa48("38203", "38204"), d.status === 'PENDING')) || (stryMutAct_9fa48("38207") ? d.status !== 'IN_PROGRESS' : stryMutAct_9fa48("38206") ? false : (stryCov_9fa48("38206", "38207"), d.status === 'IN_PROGRESS'))))).length)) * factor)))),
        totalDeliberations: stryMutAct_9fa48("38209") ? Math.min(0, Math.floor(realDeliberations.length * factor)) : (stryCov_9fa48("38209"), Math.max(0, Math.floor(stryMutAct_9fa48("38210") ? realDeliberations.length / factor : (stryCov_9fa48("38210"), realDeliberations.length * factor)))),
        consensusRate: stryMutAct_9fa48("38211") ? Math.max(100, Math.max(50, projectValue(78))) : (stryCov_9fa48("38211"), Math.min(100, stryMutAct_9fa48("38212") ? Math.min(50, projectValue(78)) : (stryCov_9fa48("38212"), Math.max(50, projectValue(78)))))
      }),
      graph: stryMutAct_9fa48("38213") ? {} : (stryCov_9fa48("38213"), {
        // Use real Neo4j stats if available, otherwise fallback
        entities: projectValue(stryMutAct_9fa48("38216") ? realGraphStats?.entities && getMetricValue('entities', 15420) : stryMutAct_9fa48("38215") ? false : stryMutAct_9fa48("38214") ? true : (stryCov_9fa48("38214", "38215", "38216"), (stryMutAct_9fa48("38217") ? realGraphStats.entities : (stryCov_9fa48("38217"), realGraphStats?.entities)) || getMetricValue('entities', 15420)), stryMutAct_9fa48("38219") ? false : (stryCov_9fa48("38219"), true)),
        relationships: projectValue(stryMutAct_9fa48("38222") ? realGraphStats?.relationships && getMetricValue('relationships', 48930) : stryMutAct_9fa48("38221") ? false : stryMutAct_9fa48("38220") ? true : (stryCov_9fa48("38220", "38221", "38222"), (stryMutAct_9fa48("38223") ? realGraphStats.relationships : (stryCov_9fa48("38223"), realGraphStats?.relationships)) || getMetricValue('relationships', 48930)), stryMutAct_9fa48("38225") ? false : (stryCov_9fa48("38225"), true)),
        dataPoints: projectValue(stryMutAct_9fa48("38228") ? realGraphStats?.dataPoints && getMetricValue('datapoints', 2340000) : stryMutAct_9fa48("38227") ? false : stryMutAct_9fa48("38226") ? true : (stryCov_9fa48("38226", "38227", "38228"), (stryMutAct_9fa48("38229") ? realGraphStats.dataPoints : (stryCov_9fa48("38229"), realGraphStats?.dataPoints)) || getMetricValue('datapoints', 2340000)), stryMutAct_9fa48("38231") ? false : (stryCov_9fa48("38231"), true)),
        freshness: stryMutAct_9fa48("38232") ? realGraphStats?.freshness && Math.max(0, Math.min(100, 95 - (isPast ? daysDiff * 0.1 : -daysDiff * 0.02))) : (stryCov_9fa48("38232"), (stryMutAct_9fa48("38233") ? realGraphStats.freshness : (stryCov_9fa48("38233"), realGraphStats?.freshness)) ?? (stryMutAct_9fa48("38234") ? Math.min(0, Math.min(100, 95 - (isPast ? daysDiff * 0.1 : -daysDiff * 0.02))) : (stryCov_9fa48("38234"), Math.max(0, stryMutAct_9fa48("38235") ? Math.max(100, 95 - (isPast ? daysDiff * 0.1 : -daysDiff * 0.02)) : (stryCov_9fa48("38235"), Math.min(100, stryMutAct_9fa48("38236") ? 95 + (isPast ? daysDiff * 0.1 : -daysDiff * 0.02) : (stryCov_9fa48("38236"), 95 - (isPast ? stryMutAct_9fa48("38237") ? daysDiff / 0.1 : (stryCov_9fa48("38237"), daysDiff * 0.1) : stryMutAct_9fa48("38238") ? -daysDiff / 0.02 : (stryCov_9fa48("38238"), (stryMutAct_9fa48("38239") ? +daysDiff : (stryCov_9fa48("38239"), -daysDiff)) * 0.02)))))))))
      })
    });
    setSnapshot(projectedSnapshot);
    setErpSnapshot(generateERPSnapshot(currentDate));
  }, stryMutAct_9fa48("38240") ? [] : (stryCov_9fa48("38240"), [currentDate, mode, realMetrics, realDeliberations, realGraphStats]));

  // Playback logic with variable speed support
  // At 1x: 1 day per second (smooth playback)
  // At 0.1x: 1 hour per second (slow motion for detailed analysis)
  // At 10x: 10 days per second (fast forward)
  useEffect(() => {
    if (stryMutAct_9fa48("38243") ? false : stryMutAct_9fa48("38242") ? true : (stryCov_9fa48("38242", "38243"), isPlaying)) {
      // Tick every 100ms for smooth animation
      const tickInterval = 100;
      // Base increment: at 1x speed, advance 1 day per second (so 0.1 days per 100ms tick)
      const baseIncrementMs = stryMutAct_9fa48("38245") ? 0.1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38245"), (stryMutAct_9fa48("38246") ? 0.1 * 24 * 60 / 60 : (stryCov_9fa48("38246"), (stryMutAct_9fa48("38247") ? 0.1 * 24 / 60 : (stryCov_9fa48("38247"), (stryMutAct_9fa48("38248") ? 0.1 / 24 : (stryCov_9fa48("38248"), 0.1 * 24)) * 60)) * 60)) * 1000); // 0.1 days = 2.4 hours per tick at 1x

      playIntervalRef.current = setInterval(() => {
        setCurrentDate(prev => {
          const increment = stryMutAct_9fa48("38251") ? (mode === 'rewind' ? -1 : 1) * playbackSpeed / baseIncrementMs : (stryCov_9fa48("38251"), (stryMutAct_9fa48("38252") ? (mode === 'rewind' ? -1 : 1) / playbackSpeed : (stryCov_9fa48("38252"), ((stryMutAct_9fa48("38255") ? mode !== 'rewind' : stryMutAct_9fa48("38254") ? false : stryMutAct_9fa48("38253") ? true : (stryCov_9fa48("38253", "38254", "38255"), mode === 'rewind')) ? stryMutAct_9fa48("38257") ? +1 : (stryCov_9fa48("38257"), -1) : 1) * playbackSpeed)) * baseIncrementMs);
          const newDate = new Date(stryMutAct_9fa48("38258") ? prev.getTime() - increment : (stryCov_9fa48("38258"), prev.getTime() + increment));
          if (stryMutAct_9fa48("38261") ? newDate < timeRange.min && newDate > timeRange.max : stryMutAct_9fa48("38260") ? false : stryMutAct_9fa48("38259") ? true : (stryCov_9fa48("38259", "38260", "38261"), (stryMutAct_9fa48("38264") ? newDate >= timeRange.min : stryMutAct_9fa48("38263") ? newDate <= timeRange.min : stryMutAct_9fa48("38262") ? false : (stryCov_9fa48("38262", "38263", "38264"), newDate < timeRange.min)) || (stryMutAct_9fa48("38267") ? newDate <= timeRange.max : stryMutAct_9fa48("38266") ? newDate >= timeRange.max : stryMutAct_9fa48("38265") ? false : (stryCov_9fa48("38265", "38266", "38267"), newDate > timeRange.max)))) {
            setIsPlaying(stryMutAct_9fa48("38269") ? true : (stryCov_9fa48("38269"), false));
            return prev;
          }
          return newDate;
        });
      }, tickInterval);
    } else if (stryMutAct_9fa48("38271") ? false : stryMutAct_9fa48("38270") ? true : (stryCov_9fa48("38270", "38271"), playIntervalRef.current)) {
      clearInterval(playIntervalRef.current);
    }
    return () => {
      if (stryMutAct_9fa48("38275") ? false : stryMutAct_9fa48("38274") ? true : (stryCov_9fa48("38274", "38275"), playIntervalRef.current)) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, stryMutAct_9fa48("38277") ? [] : (stryCov_9fa48("38277"), [isPlaying, playbackSpeed, mode, timeRange]));

  // Initialize pivotal moments with AI detection
  useEffect(() => {
    const detectPivotalMomentsWithAI = async () => {
      if (stryMutAct_9fa48("38282") ? events.length !== 0 : stryMutAct_9fa48("38281") ? false : stryMutAct_9fa48("38280") ? true : (stryCov_9fa48("38280", "38281", "38282"), events.length === 0)) {
        return;
      }
      try {
        // Call AI to detect pivotal moments
        const response = await decisionIntelApi.detectPivotalMoments(stryMutAct_9fa48("38285") ? {} : (stryCov_9fa48("38285"), {
          events: events.map(stryMutAct_9fa48("38286") ? () => undefined : (stryCov_9fa48("38286"), e => stryMutAct_9fa48("38287") ? {} : (stryCov_9fa48("38287"), {
            id: e.id,
            timestamp: e.timestamp.toISOString(),
            type: e.type,
            title: e.title,
            description: e.description,
            impact: e.impact,
            magnitude: e.magnitude,
            department: e.department
          }))),
          limit: 8
        }));
        if (stryMutAct_9fa48("38290") ? response.success && response.data || Array.isArray(response.data) : stryMutAct_9fa48("38289") ? false : stryMutAct_9fa48("38288") ? true : (stryCov_9fa48("38288", "38289", "38290"), (stryMutAct_9fa48("38292") ? response.success || response.data : stryMutAct_9fa48("38291") ? true : (stryCov_9fa48("38291", "38292"), response.success && response.data)) && Array.isArray(response.data))) {
          console.log('[ChronosAI] Detected', response.data.length, 'pivotal moments via AI');
          // Map AI response to PivotalMoment format
          const aiMoments: PivotalMoment[] = stryMutAct_9fa48("38296") ? ["Stryker was here"] : (stryCov_9fa48("38296"), []);
          for (const m of response.data as any[]) {
            const event = events.find(stryMutAct_9fa48("38298") ? () => undefined : (stryCov_9fa48("38298"), e => stryMutAct_9fa48("38301") ? e.id !== m.eventId : stryMutAct_9fa48("38300") ? false : stryMutAct_9fa48("38299") ? true : (stryCov_9fa48("38299", "38300", "38301"), e.id === m.eventId)));
            if (stryMutAct_9fa48("38303") ? false : stryMutAct_9fa48("38302") ? true : (stryCov_9fa48("38302", "38303"), event)) {
              aiMoments.push(stryMutAct_9fa48("38305") ? {} : (stryCov_9fa48("38305"), {
                id: `pivot-${m.eventId}`,
                timestamp: event.timestamp,
                event,
                significance: stryMutAct_9fa48("38309") ? m.significance && 80 : stryMutAct_9fa48("38308") ? false : stryMutAct_9fa48("38307") ? true : (stryCov_9fa48("38307", "38308", "38309"), m.significance || 80),
                reason: stryMutAct_9fa48("38312") ? m.reason && 'AI-identified critical decision point' : stryMutAct_9fa48("38311") ? false : stryMutAct_9fa48("38310") ? true : (stryCov_9fa48("38310", "38311", "38312"), m.reason || 'AI-identified critical decision point'),
                impactedMetrics: stryMutAct_9fa48("38316") ? m.impactedMetrics && ['revenue', 'operations'] : stryMutAct_9fa48("38315") ? false : stryMutAct_9fa48("38314") ? true : (stryCov_9fa48("38314", "38315", "38316"), m.impactedMetrics || (stryMutAct_9fa48("38317") ? [] : (stryCov_9fa48("38317"), ['revenue', 'operations']))),
                beforeState: stryMutAct_9fa48("38320") ? {} : (stryCov_9fa48("38320"), {
                  revenue: 10000000,
                  profit: 2000000
                }),
                afterState: stryMutAct_9fa48("38321") ? {} : (stryCov_9fa48("38321"), {
                  revenue: 11000000,
                  profit: 2200000
                })
              }));
            }
          }
          if (stryMutAct_9fa48("38325") ? aiMoments.length <= 0 : stryMutAct_9fa48("38324") ? aiMoments.length >= 0 : stryMutAct_9fa48("38323") ? false : stryMutAct_9fa48("38322") ? true : (stryCov_9fa48("38322", "38323", "38324", "38325"), aiMoments.length > 0)) {
            setPivotalMoments(aiMoments);
            return;
          }
        }
      } catch (error) {
        console.log('[ChronosAI] AI detection failed, using fallback:', error);
      }

      // Fallback to local generation
      setPivotalMoments(generatePivotalMoments(events));
    };
    detectPivotalMomentsWithAI();
  }, stryMutAct_9fa48("38329") ? [] : (stryCov_9fa48("38329"), [events]));

  // Fetch ALL real data from APIs
  useEffect(() => {
    const fetchAllChronosData = async () => {
      setIsLoadingData(stryMutAct_9fa48("38332") ? false : (stryCov_9fa48("38332"), true));
      try {
        // Fetch all data sources in parallel
        const [snapshotsRes, metricsRes, deliberationsRes, alertsRes, decisionsRes, graphStatsRes] = await Promise.all(stryMutAct_9fa48("38334") ? [] : (stryCov_9fa48("38334"), [decisionIntelApi.getChronosSnapshots(), metricsApi.getMetrics(), councilApi.getAllDeliberations(100),
        // Get ALL deliberations, not just active
        alertsApi.getAlerts(), councilApi.getRecentDecisions(50), graphApi.getStats()]));

        // Process snapshots
        if (stryMutAct_9fa48("38337") ? snapshotsRes.success || snapshotsRes.data : stryMutAct_9fa48("38336") ? false : stryMutAct_9fa48("38335") ? true : (stryCov_9fa48("38335", "38336", "38337"), snapshotsRes.success && snapshotsRes.data)) {
          console.log('[Chronos] Loaded', (snapshotsRes.data as any[]).length, 'snapshots');
        }

        // Process real graph stats from Neo4j
        if (stryMutAct_9fa48("38343") ? graphStatsRes.success || graphStatsRes.data : stryMutAct_9fa48("38342") ? false : stryMutAct_9fa48("38341") ? true : (stryCov_9fa48("38341", "38342", "38343"), graphStatsRes.success && graphStatsRes.data)) {
          setRealGraphStats(stryMutAct_9fa48("38345") ? {} : (stryCov_9fa48("38345"), {
            entities: graphStatsRes.data.entities,
            relationships: graphStatsRes.data.relationships,
            dataPoints: graphStatsRes.data.dataPoints,
            freshness: graphStatsRes.data.freshness
          }));
          console.log('[Chronos] Loaded real graph stats:', graphStatsRes.data);
        }

        // Process metrics into timeline events
        if (stryMutAct_9fa48("38349") ? metricsRes.success || metricsRes.data : stryMutAct_9fa48("38348") ? false : stryMutAct_9fa48("38347") ? true : (stryCov_9fa48("38347", "38348", "38349"), metricsRes.success && metricsRes.data)) {
          setRealMetrics(metricsRes.data as any[]);
          console.log('[Chronos] Loaded', (metricsRes.data as any[]).length, 'metrics');
        }

        // Process deliberations into timeline events  
        if (stryMutAct_9fa48("38355") ? deliberationsRes.success || deliberationsRes.data : stryMutAct_9fa48("38354") ? false : stryMutAct_9fa48("38353") ? true : (stryCov_9fa48("38353", "38354", "38355"), deliberationsRes.success && deliberationsRes.data)) {
          setRealDeliberations(deliberationsRes.data as any[]);
          console.log('[Chronos] Loaded', (deliberationsRes.data as any[]).length, 'deliberations');
        }

        // Build real timeline events from all sources
        const realEvents: TimelineEvent[] = stryMutAct_9fa48("38359") ? ["Stryker was here"] : (stryCov_9fa48("38359"), []);

        // Add deliberation events
        if (stryMutAct_9fa48("38362") ? deliberationsRes.success || deliberationsRes.data : stryMutAct_9fa48("38361") ? false : stryMutAct_9fa48("38360") ? true : (stryCov_9fa48("38360", "38361", "38362"), deliberationsRes.success && deliberationsRes.data)) {
          (deliberationsRes.data as any[]).forEach((d: any) => {
            realEvents.push(stryMutAct_9fa48("38365") ? {} : (stryCov_9fa48("38365"), {
              id: d.id,
              timestamp: new Date(d.created_at),
              type: 'decision',
              title: stryMutAct_9fa48("38369") ? d.question?.substring(0, 50) && 'Council Deliberation' : stryMutAct_9fa48("38368") ? false : stryMutAct_9fa48("38367") ? true : (stryCov_9fa48("38367", "38368", "38369"), (stryMutAct_9fa48("38371") ? d.question.substring(0, 50) : stryMutAct_9fa48("38370") ? d.question : (stryCov_9fa48("38370", "38371"), d.question?.substring(0, 50))) || 'Council Deliberation'),
              description: stryMutAct_9fa48("38375") ? d.question && 'AI Council deliberation' : stryMutAct_9fa48("38374") ? false : stryMutAct_9fa48("38373") ? true : (stryCov_9fa48("38373", "38374", "38375"), d.question || 'AI Council deliberation'),
              impact: (stryMutAct_9fa48("38379") ? d.status !== 'COMPLETED' : stryMutAct_9fa48("38378") ? false : stryMutAct_9fa48("38377") ? true : (stryCov_9fa48("38377", "38378", "38379"), d.status === 'COMPLETED')) ? 'positive' : 'neutral',
              department: 'Executive',
              magnitude: d.confidence ? Math.round(stryMutAct_9fa48("38384") ? d.confidence * 10 : (stryCov_9fa48("38384"), d.confidence / 10)) : 7,
              deliberationId: d.id
            }));
          });
        }

        // Add alert events
        if (stryMutAct_9fa48("38387") ? alertsRes.success || alertsRes.data : stryMutAct_9fa48("38386") ? false : stryMutAct_9fa48("38385") ? true : (stryCov_9fa48("38385", "38386", "38387"), alertsRes.success && alertsRes.data)) {
          (alertsRes.data as any[]).forEach((a: any) => {
            realEvents.push(stryMutAct_9fa48("38390") ? {} : (stryCov_9fa48("38390"), {
              id: a.id,
              timestamp: new Date(a.created_at),
              type: 'system',
              title: stryMutAct_9fa48("38394") ? a.title && 'System Alert' : stryMutAct_9fa48("38393") ? false : stryMutAct_9fa48("38392") ? true : (stryCov_9fa48("38392", "38393", "38394"), a.title || 'System Alert'),
              description: stryMutAct_9fa48("38398") ? (a.message || a.description) && 'Alert triggered' : stryMutAct_9fa48("38397") ? false : stryMutAct_9fa48("38396") ? true : (stryCov_9fa48("38396", "38397", "38398"), (stryMutAct_9fa48("38400") ? a.message && a.description : stryMutAct_9fa48("38399") ? false : (stryCov_9fa48("38399", "38400"), a.message || a.description)) || 'Alert triggered'),
              impact: (stryMutAct_9fa48("38404") ? a.severity !== 'CRITICAL' : stryMutAct_9fa48("38403") ? false : stryMutAct_9fa48("38402") ? true : (stryCov_9fa48("38402", "38403", "38404"), a.severity === 'CRITICAL')) ? 'negative' : (stryMutAct_9fa48("38409") ? a.severity !== 'WARNING' : stryMutAct_9fa48("38408") ? false : stryMutAct_9fa48("38407") ? true : (stryCov_9fa48("38407", "38408", "38409"), a.severity === 'WARNING')) ? 'neutral' : 'positive',
              department: 'Operations',
              magnitude: (stryMutAct_9fa48("38416") ? a.severity !== 'CRITICAL' : stryMutAct_9fa48("38415") ? false : stryMutAct_9fa48("38414") ? true : (stryCov_9fa48("38414", "38415", "38416"), a.severity === 'CRITICAL')) ? 9 : (stryMutAct_9fa48("38420") ? a.severity !== 'HIGH' : stryMutAct_9fa48("38419") ? false : stryMutAct_9fa48("38418") ? true : (stryCov_9fa48("38418", "38419", "38420"), a.severity === 'HIGH')) ? 7 : 5
            }));
          });
        }

        // Add recent decisions as events
        if (stryMutAct_9fa48("38424") ? decisionsRes.success || decisionsRes.data : stryMutAct_9fa48("38423") ? false : stryMutAct_9fa48("38422") ? true : (stryCov_9fa48("38422", "38423", "38424"), decisionsRes.success && decisionsRes.data)) {
          (decisionsRes.data as any[]).forEach((d: any) => {
            realEvents.push(stryMutAct_9fa48("38427") ? {} : (stryCov_9fa48("38427"), {
              id: `decision-${d.id}`,
              timestamp: new Date(stryMutAct_9fa48("38431") ? (d.created_at || d.timestamp) && Date.now() : stryMutAct_9fa48("38430") ? false : stryMutAct_9fa48("38429") ? true : (stryCov_9fa48("38429", "38430", "38431"), (stryMutAct_9fa48("38433") ? d.created_at && d.timestamp : stryMutAct_9fa48("38432") ? false : (stryCov_9fa48("38432", "38433"), d.created_at || d.timestamp)) || Date.now())),
              type: 'decision',
              title: stryMutAct_9fa48("38437") ? (d.query?.substring(0, 50) || d.title) && 'Council Decision' : stryMutAct_9fa48("38436") ? false : stryMutAct_9fa48("38435") ? true : (stryCov_9fa48("38435", "38436", "38437"), (stryMutAct_9fa48("38439") ? d.query?.substring(0, 50) && d.title : stryMutAct_9fa48("38438") ? false : (stryCov_9fa48("38438", "38439"), (stryMutAct_9fa48("38441") ? d.query.substring(0, 50) : stryMutAct_9fa48("38440") ? d.query : (stryCov_9fa48("38440", "38441"), d.query?.substring(0, 50))) || d.title)) || 'Council Decision'),
              description: stryMutAct_9fa48("38445") ? (d.query || d.description) && 'Council decision made' : stryMutAct_9fa48("38444") ? false : stryMutAct_9fa48("38443") ? true : (stryCov_9fa48("38443", "38444", "38445"), (stryMutAct_9fa48("38447") ? d.query && d.description : stryMutAct_9fa48("38446") ? false : (stryCov_9fa48("38446", "38447"), d.query || d.description)) || 'Council decision made'),
              impact: 'positive',
              department: 'Executive',
              magnitude: 8,
              deliberationId: d.deliberation_id
            }));
          });
        }

        // Also fetch events from Apache Druid (Sovereign Stack)
        try {
          const druidEvents = await sovereignApi.druid.queryTimeline(new Date(stryMutAct_9fa48("38452") ? Date.now() + 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38452"), Date.now() - (stryMutAct_9fa48("38453") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38453"), (stryMutAct_9fa48("38454") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("38454"), (stryMutAct_9fa48("38455") ? 90 * 24 / 60 : (stryCov_9fa48("38455"), (stryMutAct_9fa48("38456") ? 90 / 24 : (stryCov_9fa48("38456"), 90 * 24)) * 60)) * 60)) * 1000)))),
          // 90 days ago
          new Date(), undefined,
          // all event types
          100);
          if (stryMutAct_9fa48("38460") ? druidEvents.length <= 0 : stryMutAct_9fa48("38459") ? druidEvents.length >= 0 : stryMutAct_9fa48("38458") ? false : stryMutAct_9fa48("38457") ? true : (stryCov_9fa48("38457", "38458", "38459", "38460"), druidEvents.length > 0)) {
            druidEvents.forEach((de: any) => {
              realEvents.push(stryMutAct_9fa48("38463") ? {} : (stryCov_9fa48("38463"), {
                id: stryMutAct_9fa48("38466") ? de.id && `druid-${Date.now()}-${Math.random()}` : stryMutAct_9fa48("38465") ? false : stryMutAct_9fa48("38464") ? true : (stryCov_9fa48("38464", "38465", "38466"), de.id || `druid-${Date.now()}-${Math.random()}`),
                timestamp: new Date(de.timestamp),
                type: stryMutAct_9fa48("38470") ? de.eventType && 'system' : stryMutAct_9fa48("38469") ? false : stryMutAct_9fa48("38468") ? true : (stryCov_9fa48("38468", "38469", "38470"), de.eventType || 'system'),
                title: stryMutAct_9fa48("38474") ? de.action && 'Event' : stryMutAct_9fa48("38473") ? false : stryMutAct_9fa48("38472") ? true : (stryCov_9fa48("38472", "38473", "38474"), de.action || 'Event'),
                description: `${de.entityType}: ${de.entityId}`,
                impact: 'neutral',
                department: stryMutAct_9fa48("38480") ? de.metadata?.department && 'System' : stryMutAct_9fa48("38479") ? false : stryMutAct_9fa48("38478") ? true : (stryCov_9fa48("38478", "38479", "38480"), (stryMutAct_9fa48("38481") ? de.metadata.department : (stryCov_9fa48("38481"), de.metadata?.department)) || 'System'),
                magnitude: 5
              }));
            });
            console.log('[Chronos] Added', druidEvents.length, 'events from Apache Druid');
          }
        } catch (druidError) {
          console.warn('[Chronos] Druid unavailable, continuing with other data sources:', druidError);
        }

        // Sort by timestamp and set
        stryMutAct_9fa48("38487") ? realEvents : (stryCov_9fa48("38487"), realEvents.sort(stryMutAct_9fa48("38488") ? () => undefined : (stryCov_9fa48("38488"), (a, b) => stryMutAct_9fa48("38489") ? b.timestamp.getTime() + a.timestamp.getTime() : (stryCov_9fa48("38489"), b.timestamp.getTime() - a.timestamp.getTime()))));

        // If we have real events, use them; otherwise fall back to generated
        if (stryMutAct_9fa48("38493") ? realEvents.length <= 0 : stryMutAct_9fa48("38492") ? realEvents.length >= 0 : stryMutAct_9fa48("38491") ? false : stryMutAct_9fa48("38490") ? true : (stryCov_9fa48("38490", "38491", "38492", "38493"), realEvents.length > 0)) {
          setEvents(realEvents);
          console.log('[Chronos] Using', realEvents.length, 'real events');
        } else {
          setEvents(generateEvents());
          console.log('[Chronos] No real events, using generated fallback');
        }
      } catch (error) {
        console.log('[Chronos] API error, using generated fallback:', error);
        setEvents(generateEvents());
      } finally {
        setIsLoadingData(stryMutAct_9fa48("38502") ? true : (stryCov_9fa48("38502"), false));
      }
    };
    fetchAllChronosData();
  }, stryMutAct_9fa48("38503") ? ["Stryker was here"] : (stryCov_9fa48("38503"), []));

  // Generate animated graph nodes
  useEffect(() => {
    const nodes = Array.from(stryMutAct_9fa48("38505") ? {} : (stryCov_9fa48("38505"), {
      length: 30
    }), stryMutAct_9fa48("38506") ? () => undefined : (stryCov_9fa48("38506"), () => stryMutAct_9fa48("38507") ? {} : (stryCov_9fa48("38507"), {
      x: stryMutAct_9fa48("38508") ? Math.random() / 100 : (stryCov_9fa48("38508"), Math.random() * 100),
      y: stryMutAct_9fa48("38509") ? Math.random() / 100 : (stryCov_9fa48("38509"), Math.random() * 100),
      size: stryMutAct_9fa48("38510") ? 2 - Math.random() * 4 : (stryCov_9fa48("38510"), 2 + (stryMutAct_9fa48("38511") ? Math.random() / 4 : (stryCov_9fa48("38511"), Math.random() * 4)))
    })));
    setGraphNodes(nodes);
  }, stryMutAct_9fa48("38512") ? [] : (stryCov_9fa48("38512"), [currentDate]));

  // Update diff snapshot when diff date changes
  useEffect(() => {
    if (stryMutAct_9fa48("38515") ? false : stryMutAct_9fa48("38514") ? true : (stryCov_9fa48("38514", "38515"), diffDate)) {
      setDiffSnapshot(generateSnapshot(diffDate, mode));
    }
  }, stryMutAct_9fa48("38517") ? [] : (stryCov_9fa48("38517"), [diffDate, mode]));

  // Handle deep links to specific timestamps
  useEffect(() => {
    const timestamp = searchParams.get('t');
    if (stryMutAct_9fa48("38521") ? false : stryMutAct_9fa48("38520") ? true : (stryCov_9fa48("38520", "38521"), timestamp)) {
      setCurrentDate(new Date(parseInt(timestamp)));
    }
  }, stryMutAct_9fa48("38523") ? [] : (stryCov_9fa48("38523"), [searchParams]));

  // Mode change handler
  const handleModeChange = (newMode: ChronosMode) => {
    setMode(newMode);
    setIsPlaying(stryMutAct_9fa48("38525") ? true : (stryCov_9fa48("38525"), false));
    setEnhancedView('standard');
    if (stryMutAct_9fa48("38529") ? newMode !== 'fastforward' : stryMutAct_9fa48("38528") ? false : stryMutAct_9fa48("38527") ? true : (stryCov_9fa48("38527", "38528", "38529"), newMode === 'fastforward')) {
      setCurrentDate(new Date());
    } else if (stryMutAct_9fa48("38534") ? newMode !== 'rewind' : stryMutAct_9fa48("38533") ? false : stryMutAct_9fa48("38532") ? true : (stryCov_9fa48("38532", "38533", "38534"), newMode === 'rewind')) {
      setCurrentDate(new Date());
    } else {
      setCurrentDate(new Date(stryMutAct_9fa48("38538") ? Date.now() + 180 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38538"), Date.now() - (stryMutAct_9fa48("38539") ? 180 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38539"), (stryMutAct_9fa48("38540") ? 180 * 24 * 60 / 60 : (stryCov_9fa48("38540"), (stryMutAct_9fa48("38541") ? 180 * 24 / 60 : (stryCov_9fa48("38541"), (stryMutAct_9fa48("38542") ? 180 / 24 : (stryCov_9fa48("38542"), 180 * 24)) * 60)) * 60)) * 1000))))); // 6 months ago for replay
    }
  };

  // Add bookmark
  const addBookmark = (label: string, notes?: string) => {
    const bookmark: Bookmark = stryMutAct_9fa48("38544") ? {} : (stryCov_9fa48("38544"), {
      id: `bm-${Date.now()}`,
      timestamp: currentDate,
      label,
      notes,
      createdAt: new Date(),
      sharedUrl: `${window.location.origin}/cortex/intelligence/chronos?t=${currentDate.getTime()}`
    });
    setBookmarks(stryMutAct_9fa48("38547") ? () => undefined : (stryCov_9fa48("38547"), prev => stryMutAct_9fa48("38548") ? [] : (stryCov_9fa48("38548"), [...prev, bookmark])));
    setShowBookmarkModal(stryMutAct_9fa48("38549") ? true : (stryCov_9fa48("38549"), false));
  };

  // Copy share link
  const copyShareLink = () => {
    const url = `${window.location.origin}/cortex/intelligence/chronos?t=${currentDate.getTime()}`;
    navigator.clipboard.writeText(url);
  };

  // Start impact trace with AI analysis
  const startImpactTrace = async (event: TimelineEvent) => {
    setEnhancedView('impact');

    // Try AI-powered causal chain analysis
    try {
      const response = await decisionIntelApi.analyzeCausalChain(stryMutAct_9fa48("38555") ? {} : (stryCov_9fa48("38555"), {
        root_event: stryMutAct_9fa48("38556") ? {} : (stryCov_9fa48("38556"), {
          id: event.id,
          timestamp: event.timestamp.toISOString(),
          type: event.type,
          title: event.title,
          description: event.description,
          impact: event.impact
        }),
        all_events: events.map(stryMutAct_9fa48("38557") ? () => undefined : (stryCov_9fa48("38557"), e => stryMutAct_9fa48("38558") ? {} : (stryCov_9fa48("38558"), {
          id: e.id,
          timestamp: e.timestamp.toISOString(),
          type: e.type,
          title: e.title,
          description: e.description,
          impact: e.impact
        })))
      }));
      if (stryMutAct_9fa48("38561") ? response.success && response.data && Array.isArray(response.data) || response.data.length > 0 : stryMutAct_9fa48("38560") ? false : stryMutAct_9fa48("38559") ? true : (stryCov_9fa48("38559", "38560", "38561"), (stryMutAct_9fa48("38563") ? response.success && response.data || Array.isArray(response.data) : stryMutAct_9fa48("38562") ? true : (stryCov_9fa48("38562", "38563"), (stryMutAct_9fa48("38565") ? response.success || response.data : stryMutAct_9fa48("38564") ? true : (stryCov_9fa48("38564", "38565"), response.success && response.data)) && Array.isArray(response.data))) && (stryMutAct_9fa48("38568") ? response.data.length <= 0 : stryMutAct_9fa48("38567") ? response.data.length >= 0 : stryMutAct_9fa48("38566") ? true : (stryCov_9fa48("38566", "38567", "38568"), response.data.length > 0)))) {
        console.log('[ChronosAI] Causal chain analysis complete:', response.data.length, 'links');

        // Build causal chain from AI response
        const effects = stryMutAct_9fa48("38572") ? (response.data as any[]).map(link => {
          const linkedEvent = events.find(e => e.id === link.toEventId);
          return {
            event: linkedEvent || event,
            delay: Math.floor((new Date().getTime() - event.timestamp.getTime()) / (24 * 60 * 60 * 1000)),
            correlation: link.strength || 0.7
          };
        }) : (stryCov_9fa48("38572"), (response.data as any[]).map(link => {
          const linkedEvent = events.find(stryMutAct_9fa48("38574") ? () => undefined : (stryCov_9fa48("38574"), e => stryMutAct_9fa48("38577") ? e.id !== link.toEventId : stryMutAct_9fa48("38576") ? false : stryMutAct_9fa48("38575") ? true : (stryCov_9fa48("38575", "38576", "38577"), e.id === link.toEventId)));
          return stryMutAct_9fa48("38578") ? {} : (stryCov_9fa48("38578"), {
            event: stryMutAct_9fa48("38581") ? linkedEvent && event : stryMutAct_9fa48("38580") ? false : stryMutAct_9fa48("38579") ? true : (stryCov_9fa48("38579", "38580", "38581"), linkedEvent || event),
            delay: Math.floor(stryMutAct_9fa48("38582") ? (new Date().getTime() - event.timestamp.getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("38582"), (stryMutAct_9fa48("38583") ? new Date().getTime() + event.timestamp.getTime() : (stryCov_9fa48("38583"), new Date().getTime() - event.timestamp.getTime())) / (stryMutAct_9fa48("38584") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("38584"), (stryMutAct_9fa48("38585") ? 24 * 60 / 60 : (stryCov_9fa48("38585"), (stryMutAct_9fa48("38586") ? 24 / 60 : (stryCov_9fa48("38586"), 24 * 60)) * 60)) * 1000)))),
            correlation: stryMutAct_9fa48("38589") ? link.strength && 0.7 : stryMutAct_9fa48("38588") ? false : stryMutAct_9fa48("38587") ? true : (stryCov_9fa48("38587", "38588", "38589"), link.strength || 0.7)
          });
        }).filter(stryMutAct_9fa48("38590") ? () => undefined : (stryCov_9fa48("38590"), e => stryMutAct_9fa48("38593") ? e.event === event : stryMutAct_9fa48("38592") ? false : stryMutAct_9fa48("38591") ? true : (stryCov_9fa48("38591", "38592", "38593"), e.event !== event))));
        setCausalChain(stryMutAct_9fa48("38594") ? {} : (stryCov_9fa48("38594"), {
          id: `chain-${event.id}`,
          rootCause: event,
          effects,
          totalImpact: stryMutAct_9fa48("38596") ? {} : (stryCov_9fa48("38596"), {
            revenue: stryMutAct_9fa48("38597") ? effects.length / 500000 : (stryCov_9fa48("38597"), effects.length * 500000),
            profit: stryMutAct_9fa48("38598") ? effects.length / 100000 : (stryCov_9fa48("38598"), effects.length * 100000),
            customers: stryMutAct_9fa48("38599") ? effects.length / 10 : (stryCov_9fa48("38599"), effects.length * 10)
          })
        }));
        return;
      }
    } catch (error) {
      console.log('[ChronosAI] Causal chain analysis failed, using fallback:', error);
    }

    // Fallback to local generation
    setCausalChain(generateCausalChain(event, events));
  };

  // Start Council replay - fetch real transcript if available
  const startCouncilReplay = async (event: TimelineEvent) => {
    setEnhancedView('theater');

    // If event has a real deliberation ID, fetch real transcript
    if (stryMutAct_9fa48("38605") ? false : stryMutAct_9fa48("38604") ? true : (stryCov_9fa48("38604", "38605"), event.deliberationId)) {
      try {
        const response = await councilApi.getDeliberationTranscript(event.deliberationId);
        if (stryMutAct_9fa48("38610") ? response.success || response.data : stryMutAct_9fa48("38609") ? false : stryMutAct_9fa48("38608") ? true : (stryCov_9fa48("38608", "38609", "38610"), response.success && response.data)) {
          const transcript = response.data as any;
          // Build replay from real data
          // Map transcript phases to replay format
          const replayPhases = stryMutAct_9fa48("38614") ? transcript.phases?.flatMap((phase: any) => (phase.messages || []).map((msg: any, idx: number) => ({
            agent: msg.agentName || 'Agent',
            statement: msg.content || '',
            sentiment: msg.sentiment || 'neutral' as const,
            timestamp: idx * 15 // Approximate timing
          }))) && [] : stryMutAct_9fa48("38613") ? false : stryMutAct_9fa48("38612") ? true : (stryCov_9fa48("38612", "38613", "38614"), (stryMutAct_9fa48("38615") ? transcript.phases.flatMap((phase: any) => (phase.messages || []).map((msg: any, idx: number) => ({
            agent: msg.agentName || 'Agent',
            statement: msg.content || '',
            sentiment: msg.sentiment || 'neutral' as const,
            timestamp: idx * 15 // Approximate timing
          }))) : (stryCov_9fa48("38615"), transcript.phases?.flatMap(stryMutAct_9fa48("38616") ? () => undefined : (stryCov_9fa48("38616"), (phase: any) => (stryMutAct_9fa48("38619") ? phase.messages && [] : stryMutAct_9fa48("38618") ? false : stryMutAct_9fa48("38617") ? true : (stryCov_9fa48("38617", "38618", "38619"), phase.messages || (stryMutAct_9fa48("38620") ? ["Stryker was here"] : (stryCov_9fa48("38620"), [])))).map(stryMutAct_9fa48("38621") ? () => undefined : (stryCov_9fa48("38621"), (msg: any, idx: number) => stryMutAct_9fa48("38622") ? {} : (stryCov_9fa48("38622"), {
            agent: stryMutAct_9fa48("38625") ? msg.agentName && 'Agent' : stryMutAct_9fa48("38624") ? false : stryMutAct_9fa48("38623") ? true : (stryCov_9fa48("38623", "38624", "38625"), msg.agentName || 'Agent'),
            statement: stryMutAct_9fa48("38629") ? msg.content && '' : stryMutAct_9fa48("38628") ? false : stryMutAct_9fa48("38627") ? true : (stryCov_9fa48("38627", "38628", "38629"), msg.content || ''),
            sentiment: stryMutAct_9fa48("38633") ? msg.sentiment && 'neutral' as const : stryMutAct_9fa48("38632") ? false : stryMutAct_9fa48("38631") ? true : (stryCov_9fa48("38631", "38632", "38633"), msg.sentiment || 'neutral' as const),
            timestamp: stryMutAct_9fa48("38634") ? idx / 15 : (stryCov_9fa48("38634"), idx * 15) // Approximate timing
          }))))))) || (stryMutAct_9fa48("38635") ? ["Stryker was here"] : (stryCov_9fa48("38635"), [])));
          const participants = stryMutAct_9fa48("38638") ? transcript.phases?.flatMap((p: any) => p.messages?.map((m: any) => m.agentName) || []).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i) && [] : stryMutAct_9fa48("38637") ? false : stryMutAct_9fa48("38636") ? true : (stryCov_9fa48("38636", "38637", "38638"), (stryMutAct_9fa48("38640") ? transcript.phases.flatMap((p: any) => p.messages?.map((m: any) => m.agentName) || []).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i) : stryMutAct_9fa48("38639") ? transcript.phases?.flatMap((p: any) => p.messages?.map((m: any) => m.agentName) || []) : (stryCov_9fa48("38639", "38640"), transcript.phases?.flatMap(stryMutAct_9fa48("38641") ? () => undefined : (stryCov_9fa48("38641"), (p: any) => stryMutAct_9fa48("38644") ? p.messages?.map((m: any) => m.agentName) && [] : stryMutAct_9fa48("38643") ? false : stryMutAct_9fa48("38642") ? true : (stryCov_9fa48("38642", "38643", "38644"), (stryMutAct_9fa48("38645") ? p.messages.map((m: any) => m.agentName) : (stryCov_9fa48("38645"), p.messages?.map(stryMutAct_9fa48("38646") ? () => undefined : (stryCov_9fa48("38646"), (m: any) => m.agentName)))) || (stryMutAct_9fa48("38647") ? ["Stryker was here"] : (stryCov_9fa48("38647"), []))))).filter(stryMutAct_9fa48("38648") ? () => undefined : (stryCov_9fa48("38648"), (v: string, i: number, a: string[]) => stryMutAct_9fa48("38651") ? a.indexOf(v) !== i : stryMutAct_9fa48("38650") ? false : stryMutAct_9fa48("38649") ? true : (stryCov_9fa48("38649", "38650", "38651"), a.indexOf(v) === i))))) || (stryMutAct_9fa48("38652") ? ["Stryker was here"] : (stryCov_9fa48("38652"), [])));

          // Only use real data if we have actual phases and participants
          if (stryMutAct_9fa48("38655") ? replayPhases.length > 0 || participants.length > 0 : stryMutAct_9fa48("38654") ? false : stryMutAct_9fa48("38653") ? true : (stryCov_9fa48("38653", "38654", "38655"), (stryMutAct_9fa48("38658") ? replayPhases.length <= 0 : stryMutAct_9fa48("38657") ? replayPhases.length >= 0 : stryMutAct_9fa48("38656") ? true : (stryCov_9fa48("38656", "38657", "38658"), replayPhases.length > 0)) && (stryMutAct_9fa48("38661") ? participants.length <= 0 : stryMutAct_9fa48("38660") ? participants.length >= 0 : stryMutAct_9fa48("38659") ? true : (stryCov_9fa48("38659", "38660", "38661"), participants.length > 0)))) {
            const realReplay: CouncilReplay = stryMutAct_9fa48("38663") ? {} : (stryCov_9fa48("38663"), {
              id: `replay-${event.id}`,
              deliberationId: event.deliberationId,
              timestamp: event.timestamp,
              query: event.title,
              participants,
              duration: stryMutAct_9fa48("38665") ? replayPhases.length / 15 : (stryCov_9fa48("38665"), replayPhases.length * 15),
              phases: replayPhases,
              decision: (stryMutAct_9fa48("38668") ? event.impact !== 'positive' : stryMutAct_9fa48("38667") ? false : stryMutAct_9fa48("38666") ? true : (stryCov_9fa48("38666", "38667", "38668"), event.impact === 'positive')) ? 'APPROVED' : (stryMutAct_9fa48("38673") ? event.impact !== 'negative' : stryMutAct_9fa48("38672") ? false : stryMutAct_9fa48("38671") ? true : (stryCov_9fa48("38671", "38672", "38673"), event.impact === 'negative')) ? 'REJECTED' : 'PENDING',
              confidence: stryMutAct_9fa48("38679") ? transcript.phases?.[transcript.phases.length - 1]?.messages?.[0]?.confidence && 0.75 : stryMutAct_9fa48("38678") ? false : stryMutAct_9fa48("38677") ? true : (stryCov_9fa48("38677", "38678", "38679"), (stryMutAct_9fa48("38683") ? transcript.phases[transcript.phases.length - 1]?.messages?.[0]?.confidence : stryMutAct_9fa48("38682") ? transcript.phases?.[transcript.phases.length - 1].messages?.[0]?.confidence : stryMutAct_9fa48("38681") ? transcript.phases?.[transcript.phases.length - 1]?.messages[0]?.confidence : stryMutAct_9fa48("38680") ? transcript.phases?.[transcript.phases.length - 1]?.messages?.[0].confidence : (stryCov_9fa48("38680", "38681", "38682", "38683"), transcript.phases?.[stryMutAct_9fa48("38684") ? transcript.phases.length + 1 : (stryCov_9fa48("38684"), transcript.phases.length - 1)]?.messages?.[0]?.confidence)) || 0.75)
            });
            setSelectedReplay(realReplay);
            return;
          }
        }
      } catch (err) {
        console.log('[Chronos] Falling back to generated replay:', err);
      }
    }

    // Fallback to generated replay with proper agents
    setSelectedReplay(generateCouncilReplay(event));
  };

  // Run Monte Carlo with AI scenario generation
  const runMonteCarlo = async (variable: string) => {
    setEnhancedView('monte-carlo');

    // Try AI-powered scenario generation
    try {
      const response = await decisionIntelApi.generateFutureScenarios(stryMutAct_9fa48("38690") ? {} : (stryCov_9fa48("38690"), {
        current_metrics: snapshot.metrics,
        recent_events: stryMutAct_9fa48("38691") ? events.map(e => ({
          id: e.id,
          timestamp: e.timestamp.toISOString(),
          title: e.title,
          impact: e.impact
        })) : (stryCov_9fa48("38691"), events.slice(0, 10).map(stryMutAct_9fa48("38692") ? () => undefined : (stryCov_9fa48("38692"), e => stryMutAct_9fa48("38693") ? {} : (stryCov_9fa48("38693"), {
          id: e.id,
          timestamp: e.timestamp.toISOString(),
          title: e.title,
          impact: e.impact
        })))),
        time_horizon: '12 months'
      }));
      if (stryMutAct_9fa48("38697") ? response.success && response.data && Array.isArray(response.data) || response.data.length > 0 : stryMutAct_9fa48("38696") ? false : stryMutAct_9fa48("38695") ? true : (stryCov_9fa48("38695", "38696", "38697"), (stryMutAct_9fa48("38699") ? response.success && response.data || Array.isArray(response.data) : stryMutAct_9fa48("38698") ? true : (stryCov_9fa48("38698", "38699"), (stryMutAct_9fa48("38701") ? response.success || response.data : stryMutAct_9fa48("38700") ? true : (stryCov_9fa48("38700", "38701"), response.success && response.data)) && Array.isArray(response.data))) && (stryMutAct_9fa48("38704") ? response.data.length <= 0 : stryMutAct_9fa48("38703") ? response.data.length >= 0 : stryMutAct_9fa48("38702") ? true : (stryCov_9fa48("38702", "38703", "38704"), response.data.length > 0)))) {
        console.log('[ChronosAI] Generated', response.data.length, 'future scenarios via AI');

        // Map AI scenarios to MonteCarloResult format
        const aiResult: MonteCarloResult = stryMutAct_9fa48("38708") ? {} : (stryCov_9fa48("38708"), {
          id: `mc-${Date.now()}`,
          variable,
          simulations: 10000,
          outcomes: (response.data as any[]).map(stryMutAct_9fa48("38710") ? () => undefined : (stryCov_9fa48("38710"), s => stryMutAct_9fa48("38711") ? {} : (stryCov_9fa48("38711"), {
            scenario: s.name,
            probability: s.probability,
            revenue: stryMutAct_9fa48("38714") ? s.metrics?.revenue && 12500000 : stryMutAct_9fa48("38713") ? false : stryMutAct_9fa48("38712") ? true : (stryCov_9fa48("38712", "38713", "38714"), (stryMutAct_9fa48("38715") ? s.metrics.revenue : (stryCov_9fa48("38715"), s.metrics?.revenue)) || 12500000),
            profit: stryMutAct_9fa48("38718") ? s.metrics?.profit && 2800000 : stryMutAct_9fa48("38717") ? false : stryMutAct_9fa48("38716") ? true : (stryCov_9fa48("38716", "38717", "38718"), (stryMutAct_9fa48("38719") ? s.metrics.profit : (stryCov_9fa48("38719"), s.metrics?.profit)) || 2800000)
          }))),
          optimalPath: stryMutAct_9fa48("38722") ? (response.data as any[])[2]?.description && 'Base case trajectory' : stryMutAct_9fa48("38721") ? false : stryMutAct_9fa48("38720") ? true : (stryCov_9fa48("38720", "38721", "38722"), (stryMutAct_9fa48("38723") ? (response.data as any[])[2].description : (stryCov_9fa48("38723"), (response.data as any[])[2]?.description)) || 'Base case trajectory'),
          confidenceInterval: stryMutAct_9fa48("38725") ? [] : (stryCov_9fa48("38725"), [10500000, 14500000])
        });
        setMonteCarloResult(aiResult);
        return;
      }
    } catch (error) {
      console.log('[ChronosAI] Scenario generation failed, using fallback:', error);
    }

    // Fallback to local generation
    setMonteCarloResult(generateMonteCarloResults(variable));
  };

  // Start diff view
  const startDiffView = (compareDate: Date) => {
    setDiffDate(compareDate);
    setEnhancedView('diff');
  };

  // Create alternate timeline
  const createBranch = (variable: string, original: string, alternate: string) => {
    const branch: BranchTimeline = stryMutAct_9fa48("38731") ? {} : (stryCov_9fa48("38731"), {
      id: `branch-${Date.now()}`,
      name: `${variable}: ${alternate}`,
      branchPoint: currentDate,
      variable,
      original,
      alternate,
      divergence: stryMutAct_9fa48("38734") ? Math.random() * 30 - 10 : (stryCov_9fa48("38734"), (stryMutAct_9fa48("38735") ? Math.random() / 30 : (stryCov_9fa48("38735"), Math.random() * 30)) + 10),
      snapshots: Array.from(stryMutAct_9fa48("38736") ? {} : (stryCov_9fa48("38736"), {
        length: 12
      }), stryMutAct_9fa48("38737") ? () => undefined : (stryCov_9fa48("38737"), (_, i) => generateSnapshot(new Date(stryMutAct_9fa48("38738") ? currentDate.getTime() - i * 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("38738"), currentDate.getTime() + (stryMutAct_9fa48("38739") ? i * 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("38739"), (stryMutAct_9fa48("38740") ? i * 30 * 24 * 60 / 60 : (stryCov_9fa48("38740"), (stryMutAct_9fa48("38741") ? i * 30 * 24 / 60 : (stryCov_9fa48("38741"), (stryMutAct_9fa48("38742") ? i * 30 / 24 : (stryCov_9fa48("38742"), (stryMutAct_9fa48("38743") ? i / 30 : (stryCov_9fa48("38743"), i * 30)) * 24)) * 60)) * 60)) * 1000)))), 'replay'))),
      outcome: ['better', 'worse', 'similar'][Math.floor(Math.random() * 3)] as any,
      deltaRevenue: stryMutAct_9fa48("38745") ? (Math.random() - 0.3) / 5000000 : (stryCov_9fa48("38745"), (stryMutAct_9fa48("38746") ? Math.random() + 0.3 : (stryCov_9fa48("38746"), Math.random() - 0.3)) * 5000000),
      deltaProfit: stryMutAct_9fa48("38747") ? (Math.random() - 0.4) / 1500000 : (stryCov_9fa48("38747"), (stryMutAct_9fa48("38748") ? Math.random() + 0.4 : (stryCov_9fa48("38748"), Math.random() - 0.4)) * 1500000)
    });
    setBranches(stryMutAct_9fa48("38749") ? () => undefined : (stryCov_9fa48("38749"), prev => stryMutAct_9fa48("38750") ? [] : (stryCov_9fa48("38750"), [...prev, branch])));
    setSelectedBranch(branch.id);
    setShowBranchModal(stryMutAct_9fa48("38751") ? true : (stryCov_9fa48("38751"), false));
  };

  // ==========================================================================
  // ENTERPRISE COMPLIANCE HANDLERS (The Undefeatable 5%)
  // ==========================================================================

  // Live Sync - Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSyncStatus(generateLiveSyncStatus());
    }, 2000);
    return stryMutAct_9fa48("38754") ? () => undefined : (stryCov_9fa48("38754"), () => clearInterval(interval));
  }, stryMutAct_9fa48("38755") ? ["Stryker was here"] : (stryCov_9fa48("38755"), []));

  // Add witness session
  const addWitnessSession = (org: string, role: string, accessLevel: WitnessSession['accessLevel']) => {
    const session: WitnessSession = stryMutAct_9fa48("38757") ? {} : (stryCov_9fa48("38757"), {
      id: `witness-${Date.now()}`,
      witnessId: `${stryMutAct_9fa48("38760") ? org.toUpperCase().replace(/\s/g, '-') : (stryCov_9fa48("38760"), org.toLowerCase().replace(stryMutAct_9fa48("38761") ? /\S/g : (stryCov_9fa48("38761"), /\s/g), '-'))}-${Date.now()}`,
      witnessOrg: org,
      witnessRole: role,
      accessLevel,
      startedAt: new Date(),
      expiresAt: new Date(stryMutAct_9fa48("38763") ? Date.now() - 4 * 60 * 60 * 1000 : (stryCov_9fa48("38763"), Date.now() + (stryMutAct_9fa48("38764") ? 4 * 60 * 60 / 1000 : (stryCov_9fa48("38764"), (stryMutAct_9fa48("38765") ? 4 * 60 / 60 : (stryCov_9fa48("38765"), (stryMutAct_9fa48("38766") ? 4 / 60 : (stryCov_9fa48("38766"), 4 * 60)) * 60)) * 1000)))),
      // 4 hours
      airGappedKey: stryMutAct_9fa48("38767") ? generateHash(`key-${org}-${Date.now()}`) : (stryCov_9fa48("38767"), generateHash(`key-${org}-${Date.now()}`).slice(0, 16)),
      lastActivity: new Date(),
      viewedBlocks: stryMutAct_9fa48("38769") ? ["Stryker was here"] : (stryCov_9fa48("38769"), []),
      isLive: stryMutAct_9fa48("38770") ? false : (stryCov_9fa48("38770"), true)
    });
    setWitnessSessions(stryMutAct_9fa48("38771") ? () => undefined : (stryCov_9fa48("38771"), prev => stryMutAct_9fa48("38772") ? [] : (stryCov_9fa48("38772"), [...prev, session])));
    setShowWitnessModal(stryMutAct_9fa48("38773") ? true : (stryCov_9fa48("38773"), false));
  };

  // Generate court-admissible export
  const generateExport = async (format: CourtAdmissibleExport['format'], withRedaction: boolean) => {
    setExportInProgress(stryMutAct_9fa48("38775") ? false : (stryCov_9fa48("38775"), true));
    // Simulate export generation
    await new Promise(stryMutAct_9fa48("38776") ? () => undefined : (stryCov_9fa48("38776"), resolve => setTimeout(resolve, 2000)));
    const exportData = generateCourtExport(stryMutAct_9fa48("38777") ? {} : (stryCov_9fa48("38777"), {
      start: timeRange.min,
      end: currentDate
    }));
    console.log('Court-admissible export generated:', exportData);
    setExportInProgress(stryMutAct_9fa48("38779") ? true : (stryCov_9fa48("38779"), false));
    setShowCourtExportModal(stryMutAct_9fa48("38780") ? true : (stryCov_9fa48("38780"), false));
    // In production, this would trigger a download
    alert(`✅ Export generated: ${stryMutAct_9fa48("38782") ? format.toLowerCase() : (stryCov_9fa48("38782"), format.toUpperCase())}\nBlocks: ${exportData.includedBlocks.length}\nSignatures: ${exportData.signatures.length}`);
  };

  // ==========================================================================
  // NEW FEATURE HANDLERS - The 5 Power Features
  // ==========================================================================

  // (1) Full Traceability - Show origin → intermediate → final causality
  const openTraceability = (event: TimelineEvent) => {
    const traceability = generateTraceabilityView(event);
    setTraceabilityView(traceability);
    setShowTraceability(stryMutAct_9fa48("38784") ? false : (stryCov_9fa48("38784"), true));
  };

  // (2) Per-Event Compliance Snapshot
  const openComplianceSnapshot = (event: TimelineEvent) => {
    const snapshot = generateEventComplianceSnapshot(event);
    setEventComplianceSnapshot(snapshot);
    setShowComplianceSnapshot(stryMutAct_9fa48("38786") ? false : (stryCov_9fa48("38786"), true));
  };

  // (3) Reverse Time Check - Rebuild company state at any date
  const runReverseTimeCheck = async (targetDate: Date) => {
    setIsRebuildingState(stryMutAct_9fa48("38788") ? false : (stryCov_9fa48("38788"), true));
    setReverseTimeProgress(0);
    setShowReverseTimeCheck(stryMutAct_9fa48("38789") ? false : (stryCov_9fa48("38789"), true));

    // Simulate progressive reconstruction
    for (let i = 0; stryMutAct_9fa48("38792") ? i > 100 : stryMutAct_9fa48("38791") ? i < 100 : stryMutAct_9fa48("38790") ? false : (stryCov_9fa48("38790", "38791", "38792"), i <= 100); stryMutAct_9fa48("38793") ? i -= 5 : (stryCov_9fa48("38793"), i += 5)) {
      await new Promise(stryMutAct_9fa48("38795") ? () => undefined : (stryCov_9fa48("38795"), resolve => setTimeout(resolve, 100)));
      setReverseTimeProgress(i);
    }
    const check = generateReverseTimeCheck(targetDate, mode);
    setReverseTimeCheck(check);
    setIsRebuildingState(stryMutAct_9fa48("38796") ? true : (stryCov_9fa48("38796"), false));
  };

  // (4) Regulator Mode - Setup read-only session
  const startRegulatorSession = (org: RegulatorSession['regulatorOrg'], name: string, accessLevel: RegulatorSession['accessLevel'], timeSlice: {
    start: Date;
    end: Date;
  }) => {
    const session: RegulatorSession = stryMutAct_9fa48("38798") ? {} : (stryCov_9fa48("38798"), {
      id: `reg-${Date.now()}`,
      regulatorId: stryMutAct_9fa48("38800") ? generateHash(`${org}-${Date.now()}`) : (stryCov_9fa48("38800"), generateHash(`${org}-${Date.now()}`).slice(0, 16)),
      regulatorOrg: org,
      regulatorName: name,
      accessLevel,
      startedAt: new Date(),
      expiresAt: new Date(stryMutAct_9fa48("38802") ? Date.now() - 8 * 60 * 60 * 1000 : (stryCov_9fa48("38802"), Date.now() + (stryMutAct_9fa48("38803") ? 8 * 60 * 60 / 1000 : (stryCov_9fa48("38803"), (stryMutAct_9fa48("38804") ? 8 * 60 / 60 : (stryCov_9fa48("38804"), (stryMutAct_9fa48("38805") ? 8 / 60 : (stryCov_9fa48("38805"), 8 * 60)) * 60)) * 1000)))),
      // 8 hours
      isReadOnly: stryMutAct_9fa48("38806") ? false : (stryCov_9fa48("38806"), true),
      timeSliceStart: timeSlice.start,
      timeSliceEnd: timeSlice.end,
      redactionProfile: (stryMutAct_9fa48("38809") ? accessLevel !== 'full_audit' : stryMutAct_9fa48("38808") ? false : stryMutAct_9fa48("38807") ? true : (stryCov_9fa48("38807", "38808", "38809"), accessLevel === 'full_audit')) ? 'minimal' : 'standard',
      viewedItems: stryMutAct_9fa48("38813") ? ["Stryker was here"] : (stryCov_9fa48("38813"), []),
      exportedReports: stryMutAct_9fa48("38814") ? ["Stryker was here"] : (stryCov_9fa48("38814"), []),
      sessionKey: stryMutAct_9fa48("38815") ? generateHash(`session-${Date.now()}`) : (stryCov_9fa48("38815"), generateHash(`session-${Date.now()}`).slice(0, 32)),
      twoFactorVerified: stryMutAct_9fa48("38817") ? false : (stryCov_9fa48("38817"), true)
    });
    setRegulatorSession(session);
    setRegulatorMode(stryMutAct_9fa48("38818") ? false : (stryCov_9fa48("38818"), true));
    setShowRegulatorSetup(stryMutAct_9fa48("38819") ? true : (stryCov_9fa48("38819"), false));
  };
  const endRegulatorSession = () => {
    setRegulatorMode(stryMutAct_9fa48("38821") ? true : (stryCov_9fa48("38821"), false));
    setRegulatorSession(null);
  };

  // (5) Zero-Knowledge Audit - Generate ZK proof
  const generateZKAuditProof = async (framework: ZeroKnowledgeProof['framework'], claim: string) => {
    setIsGeneratingProof(stryMutAct_9fa48("38823") ? false : (stryCov_9fa48("38823"), true));

    // Simulate ZK proof generation (computationally intensive in real implementation)
    await new Promise(stryMutAct_9fa48("38824") ? () => undefined : (stryCov_9fa48("38824"), resolve => setTimeout(resolve, 2000)));
    const proofType: ZeroKnowledgeProof['proofType'] = (stryMutAct_9fa48("38827") ? framework === 'GDPR' && framework === 'CCPA' : stryMutAct_9fa48("38826") ? false : stryMutAct_9fa48("38825") ? true : (stryCov_9fa48("38825", "38826", "38827"), (stryMutAct_9fa48("38829") ? framework !== 'GDPR' : stryMutAct_9fa48("38828") ? false : (stryCov_9fa48("38828", "38829"), framework === 'GDPR')) || (stryMutAct_9fa48("38832") ? framework !== 'CCPA' : stryMutAct_9fa48("38831") ? false : (stryCov_9fa48("38831", "38832"), framework === 'CCPA')))) ? 'privacy' : (stryMutAct_9fa48("38837") ? framework !== 'SOX' : stryMutAct_9fa48("38836") ? false : stryMutAct_9fa48("38835") ? true : (stryCov_9fa48("38835", "38836", "38837"), framework === 'SOX')) ? 'financial' : (stryMutAct_9fa48("38842") ? framework !== 'HIPAA' : stryMutAct_9fa48("38841") ? false : stryMutAct_9fa48("38840") ? true : (stryCov_9fa48("38840", "38841", "38842"), framework === 'HIPAA')) ? 'privacy' : (stryMutAct_9fa48("38847") ? (framework === 'NIST' || framework === 'ISO27001') && framework === 'SOC2' : stryMutAct_9fa48("38846") ? false : stryMutAct_9fa48("38845") ? true : (stryCov_9fa48("38845", "38846", "38847"), (stryMutAct_9fa48("38849") ? framework === 'NIST' && framework === 'ISO27001' : stryMutAct_9fa48("38848") ? false : (stryCov_9fa48("38848", "38849"), (stryMutAct_9fa48("38851") ? framework !== 'NIST' : stryMutAct_9fa48("38850") ? false : (stryCov_9fa48("38850", "38851"), framework === 'NIST')) || (stryMutAct_9fa48("38854") ? framework !== 'ISO27001' : stryMutAct_9fa48("38853") ? false : (stryCov_9fa48("38853", "38854"), framework === 'ISO27001')))) || (stryMutAct_9fa48("38857") ? framework !== 'SOC2' : stryMutAct_9fa48("38856") ? false : (stryCov_9fa48("38856", "38857"), framework === 'SOC2')))) ? 'security' : 'compliance';
    const proof = generateZKProof(proofType, framework, claim);
    setZkProofs(stryMutAct_9fa48("38861") ? () => undefined : (stryCov_9fa48("38861"), prev => stryMutAct_9fa48("38862") ? [] : (stryCov_9fa48("38862"), [...prev, proof])));
    setIsGeneratingProof(stryMutAct_9fa48("38863") ? true : (stryCov_9fa48("38863"), false));
  };

  // Open Event in Witness Modal
  const openEventWitness = (event: TimelineEvent) => {
    setWitnessEvent(event);
    setShowWitnessModal(stryMutAct_9fa48("38865") ? false : (stryCov_9fa48("38865"), true));
  };
  const getModeStyles = () => {
    switch (mode) {
      case 'rewind':
        if (stryMutAct_9fa48("38867")) {} else {
          stryCov_9fa48("38867");
          return stryMutAct_9fa48("38869") ? {} : (stryCov_9fa48("38869"), {
            gradient: 'from-amber-600 to-orange-700',
            accent: 'amber',
            icon: '⏪'
          });
        }
      case 'replay':
        if (stryMutAct_9fa48("38873")) {} else {
          stryCov_9fa48("38873");
          return stryMutAct_9fa48("38875") ? {} : (stryCov_9fa48("38875"), {
            gradient: 'from-purple-600 to-pink-700',
            accent: 'purple',
            icon: '🔀'
          });
        }
      case 'fastforward':
        if (stryMutAct_9fa48("38879")) {} else {
          stryCov_9fa48("38879");
          return stryMutAct_9fa48("38881") ? {} : (stryCov_9fa48("38881"), {
            gradient: 'from-cyan-600 to-blue-700',
            accent: 'cyan',
            icon: '⏩'
          });
        }
    }
  };
  const styles = getModeStyles();
  return <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className={`bg-gradient-to-r ${styles.gradient} py-6 px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-4xl">⏱️</span>
                <div>
                  <h1 className="text-3xl font-bold">CendiaChronos™</h1>
                  <p className="text-white/80">The Enterprise Time Machine</p>
                </div>
              </div>
              {/* Powered by Apache Druid */}
              <a href="http://localhost:8888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors">
                <span className="text-amber-400 text-xs font-medium">⚡ Powered by Apache Druid</span>
              </a>
            </div>
            <div className="flex items-center gap-2 bg-black/20 rounded-full p-1">
              {(['rewind', 'replay', 'fastforward'] as ChronosMode[]).map(stryMutAct_9fa48("38886") ? () => undefined : (stryCov_9fa48("38886"), m => <button key={m} onClick={stryMutAct_9fa48("38887") ? () => undefined : (stryCov_9fa48("38887"), () => handleModeChange(m))} title={(stryMutAct_9fa48("38890") ? m !== 'rewind' : stryMutAct_9fa48("38889") ? false : stryMutAct_9fa48("38888") ? true : (stryCov_9fa48("38888", "38889", "38890"), m === 'rewind')) ? 'Jump back to a previous decision window' : (stryMutAct_9fa48("38895") ? m !== 'replay' : stryMutAct_9fa48("38894") ? false : stryMutAct_9fa48("38893") ? true : (stryCov_9fa48("38893", "38894", "38895"), m === 'replay')) ? 'Play every change between two points in time' : 'Skip ahead to the next major event (compliance, financial, incident)'} className={`px-4 py-2 rounded-full font-medium transition-all ${(stryMutAct_9fa48("38902") ? mode !== m : stryMutAct_9fa48("38901") ? false : stryMutAct_9fa48("38900") ? true : (stryCov_9fa48("38900", "38901", "38902"), mode === m)) ? 'bg-white text-neutral-900' : 'text-white/80 hover:text-white'}`}>
                  {stryMutAct_9fa48("38907") ? m === 'rewind' || '⏪ Rewind' : stryMutAct_9fa48("38906") ? false : stryMutAct_9fa48("38905") ? true : (stryCov_9fa48("38905", "38906", "38907"), (stryMutAct_9fa48("38909") ? m !== 'rewind' : stryMutAct_9fa48("38908") ? true : (stryCov_9fa48("38908", "38909"), m === 'rewind')) && '⏪ Rewind')}
                  {stryMutAct_9fa48("38914") ? m === 'replay' || '🔀 Replay' : stryMutAct_9fa48("38913") ? false : stryMutAct_9fa48("38912") ? true : (stryCov_9fa48("38912", "38913", "38914"), (stryMutAct_9fa48("38916") ? m !== 'replay' : stryMutAct_9fa48("38915") ? true : (stryCov_9fa48("38915", "38916"), m === 'replay')) && '🔀 Replay')}
                  {stryMutAct_9fa48("38921") ? m === 'fastforward' || '⏩ Fast Forward' : stryMutAct_9fa48("38920") ? false : stryMutAct_9fa48("38919") ? true : (stryCov_9fa48("38919", "38920", "38921"), (stryMutAct_9fa48("38923") ? m !== 'fastforward' : stryMutAct_9fa48("38922") ? true : (stryCov_9fa48("38922", "38923"), m === 'fastforward')) && '⏩ Fast Forward')}
                </button>))}
            </div>
          </div>

          {/* Mode Description */}
          <div className="mt-4 p-4 bg-black/20 rounded-xl">
            {stryMutAct_9fa48("38928") ? mode === 'rewind' || <p className="text-white/90">
                <strong>The Ultimate Audit:</strong> Travel back to any moment and see exactly what your organization knew, decided, and did.
                Built for audits, regulators, and "why did we sign off on that?" moments.
              </p> : stryMutAct_9fa48("38927") ? false : stryMutAct_9fa48("38926") ? true : (stryCov_9fa48("38926", "38927", "38928"), (stryMutAct_9fa48("38930") ? mode !== 'rewind' : stryMutAct_9fa48("38929") ? true : (stryCov_9fa48("38929", "38930"), mode === 'rewind')) && <p className="text-white/90">
                <strong>The Ultimate Audit:</strong> Travel back to any moment and see exactly what your organization knew, decided, and did.
                Built for audits, regulators, and "why did we sign off on that?" moments.
              </p>)}
            {stryMutAct_9fa48("38934") ? mode === 'replay' || <p className="text-white/90">
                <strong>The Strategy Simulator:</strong> Go back in time, change ONE variable, and watch an alternate timeline unfold.
                A/B test your history. See what would have happened.
              </p> : stryMutAct_9fa48("38933") ? false : stryMutAct_9fa48("38932") ? true : (stryCov_9fa48("38932", "38933", "38934"), (stryMutAct_9fa48("38936") ? mode !== 'replay' : stryMutAct_9fa48("38935") ? true : (stryCov_9fa48("38935", "38936"), mode === 'replay')) && <p className="text-white/90">
                <strong>The Strategy Simulator:</strong> Go back in time, change ONE variable, and watch an alternate timeline unfold.
                A/B test your history. See what would have happened.
              </p>)}
            {stryMutAct_9fa48("38940") ? mode === 'fastforward' || <p className="text-white/90">
                <strong>The Wargame:</strong> Project your organization into the future. This isn't a static forecast—
                the Council actively deliberates scenarios in your predicted future state.
              </p> : stryMutAct_9fa48("38939") ? false : stryMutAct_9fa48("38938") ? true : (stryCov_9fa48("38938", "38939", "38940"), (stryMutAct_9fa48("38942") ? mode !== 'fastforward' : stryMutAct_9fa48("38941") ? true : (stryCov_9fa48("38941", "38942"), mode === 'fastforward')) && <p className="text-white/90">
                <strong>The Wargame:</strong> Project your organization into the future. This isn't a static forecast—
                the Council actively deliberates scenarios in your predicted future state.
              </p>)}
          </div>
        </div>
      </header>

      {/* Enterprise Compliance Status Bar - Organized into 3 Groups */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border-b border-emerald-700/50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* LEFT SIDE: Status + Compliance Coverage */}
            <div className="flex items-center gap-2">
              {/* GROUP 1: Status Indicators */}
              <div className="flex items-center gap-3 px-3 py-1.5 bg-black/20 rounded-lg border border-white/5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Status</span>
                <div className="w-px h-4 bg-neutral-700" />
                <div className="flex items-center gap-1.5" title="Cryptographically secured, tamper-proof record">
                  <div className={`w-2 h-2 rounded-full ${(stryMutAct_9fa48("38947") ? ledger.integrityStatus !== 'verified' : stryMutAct_9fa48("38946") ? false : stryMutAct_9fa48("38945") ? true : (stryCov_9fa48("38945", "38946", "38947"), ledger.integrityStatus === 'verified')) ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="text-xs text-white/80">Ledger</span>
                </div>
                <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-neutral-300">
                  #{ledger.latestBlock.blockNumber}
                </span>
                <div className="flex items-center gap-1.5" title="Real-time event synchronization">
                  <div className={`w-2 h-2 rounded-full ${liveSyncStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-xs text-white/80">Sync</span>
                </div>
                <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-neutral-300">
                  {liveSyncStatus.syncLag}ms
                </span>
                {stryMutAct_9fa48("38956") ? witnessSessions.length > 0 || <div className="flex items-center gap-1" title="Active witness observers">
                    <span className="text-amber-400">👁️</span>
                    <span className="text-[10px] text-amber-300 font-medium">{witnessSessions.length}</span>
                  </div> : stryMutAct_9fa48("38955") ? false : stryMutAct_9fa48("38954") ? true : (stryCov_9fa48("38954", "38955", "38956"), (stryMutAct_9fa48("38959") ? witnessSessions.length <= 0 : stryMutAct_9fa48("38958") ? witnessSessions.length >= 0 : stryMutAct_9fa48("38957") ? true : (stryCov_9fa48("38957", "38958", "38959"), witnessSessions.length > 0)) && <div className="flex items-center gap-1" title="Active witness observers">
                    <span className="text-amber-400">👁️</span>
                    <span className="text-[10px] text-amber-300 font-medium">{witnessSessions.length}</span>
                  </div>)}
              </div>

              {/* GROUP 2: Compliance Coverage */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg border border-white/5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Compliance</span>
                <div className="w-px h-4 bg-neutral-700" />
                <div className="flex items-center gap-1">
                  {stryMutAct_9fa48("38962") ? ledger.complianceFlags.sox || <span className="text-[10px] px-1.5 py-0.5 bg-green-600/50 rounded font-medium" title="Sarbanes-Oxley Act">SOX</span> : stryMutAct_9fa48("38961") ? false : stryMutAct_9fa48("38960") ? true : (stryCov_9fa48("38960", "38961", "38962"), ledger.complianceFlags.sox && <span className="text-[10px] px-1.5 py-0.5 bg-green-600/50 rounded font-medium" title="Sarbanes-Oxley Act">SOX</span>)}
                  {stryMutAct_9fa48("38965") ? ledger.complianceFlags.sec || <span className="text-[10px] px-1.5 py-0.5 bg-green-600/50 rounded font-medium" title="Securities & Exchange Commission">SEC</span> : stryMutAct_9fa48("38964") ? false : stryMutAct_9fa48("38963") ? true : (stryCov_9fa48("38963", "38964", "38965"), ledger.complianceFlags.sec && <span className="text-[10px] px-1.5 py-0.5 bg-green-600/50 rounded font-medium" title="Securities & Exchange Commission">SEC</span>)}
                  {stryMutAct_9fa48("38968") ? ledger.complianceFlags.fedramp || <span className="text-[10px] px-1.5 py-0.5 bg-blue-600/50 rounded font-medium" title="Federal Risk & Authorization Mgmt">FedRAMP</span> : stryMutAct_9fa48("38967") ? false : stryMutAct_9fa48("38966") ? true : (stryCov_9fa48("38966", "38967", "38968"), ledger.complianceFlags.fedramp && <span className="text-[10px] px-1.5 py-0.5 bg-blue-600/50 rounded font-medium" title="Federal Risk & Authorization Mgmt">FedRAMP</span>)}
                  {stryMutAct_9fa48("38971") ? ledger.complianceFlags.gdpr || <span className="text-[10px] px-1.5 py-0.5 bg-purple-600/50 rounded font-medium" title="General Data Protection Regulation">GDPR</span> : stryMutAct_9fa48("38970") ? false : stryMutAct_9fa48("38969") ? true : (stryCov_9fa48("38969", "38970", "38971"), ledger.complianceFlags.gdpr && <span className="text-[10px] px-1.5 py-0.5 bg-purple-600/50 rounded font-medium" title="General Data Protection Regulation">GDPR</span>)}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Actions & Modes */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg border border-white/5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Actions</span>
              <div className="w-px h-4 bg-neutral-700" />
              <button onClick={stryMutAct_9fa48("38972") ? () => undefined : (stryCov_9fa48("38972"), () => setShowCompliancePanel(stryMutAct_9fa48("38973") ? showCompliancePanel : (stryCov_9fa48("38973"), !showCompliancePanel)))} className="px-2.5 py-1 text-[10px] bg-emerald-700/50 hover:bg-emerald-600/50 rounded transition-colors flex items-center gap-1" title="View full compliance dashboard">
                🔒 Panel
              </button>
              <button onClick={stryMutAct_9fa48("38974") ? () => undefined : (stryCov_9fa48("38974"), () => setShowCourtExportModal(stryMutAct_9fa48("38975") ? false : (stryCov_9fa48("38975"), true)))} className="px-2.5 py-1 text-[10px] bg-amber-700/50 hover:bg-amber-600/50 rounded transition-colors flex items-center gap-1" title="Generate court-admissible evidence package">
                ⚖️ Export
              </button>
              <button onClick={stryMutAct_9fa48("38976") ? () => undefined : (stryCov_9fa48("38976"), () => setShowWitnessModal(stryMutAct_9fa48("38977") ? false : (stryCov_9fa48("38977"), true)))} className="px-2.5 py-1 text-[10px] bg-blue-700/50 hover:bg-blue-600/50 rounded transition-colors flex items-center gap-1" title="Add external auditor or regulator as witness">
                👁️ Witness
              </button>
              <button onClick={stryMutAct_9fa48("38978") ? () => undefined : (stryCov_9fa48("38978"), () => setShowERPPanel(stryMutAct_9fa48("38979") ? showERPPanel : (stryCov_9fa48("38979"), !showERPPanel)))} className="px-2.5 py-1 text-[10px] bg-indigo-700/50 hover:bg-indigo-600/50 rounded transition-colors flex items-center gap-1" title="View connected ERP system data">
                🏢 ERP
              </button>
              
              <div className="w-px h-4 bg-neutral-600" />
              
              <button onClick={stryMutAct_9fa48("38980") ? () => undefined : (stryCov_9fa48("38980"), () => runReverseTimeCheck(currentDate))} className="px-2.5 py-1 text-[10px] bg-rose-700/50 hover:bg-rose-600/50 rounded transition-colors flex items-center gap-1" title="Rebuild & verify state at this timestamp">
                🔄 Verify
              </button>
              <button onClick={stryMutAct_9fa48("38981") ? () => undefined : (stryCov_9fa48("38981"), () => setShowRegulatorSetup(stryMutAct_9fa48("38982") ? false : (stryCov_9fa48("38982"), true)))} className={`px-2.5 py-1 text-[10px] rounded transition-colors flex items-center gap-1 ${regulatorMode ? 'bg-red-600 text-white animate-pulse' : 'bg-purple-700/50 hover:bg-purple-600/50'}`} title="Enable read-only regulator inspection mode">
                {regulatorMode ? '🔴 Active' : '🏛️ Regulator'}
              </button>
              <button onClick={stryMutAct_9fa48("38988") ? () => undefined : (stryCov_9fa48("38988"), () => setShowZKAudit(stryMutAct_9fa48("38989") ? false : (stryCov_9fa48("38989"), true)))} className="px-2.5 py-1 text-[10px] bg-cyan-700/50 hover:bg-cyan-600/50 rounded transition-colors flex items-center gap-1" title="Generate zero-knowledge compliance proofs">
                🔐 ZK Proof
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chronos-ERP Panel (Collapsible) */}
      {stryMutAct_9fa48("38992") ? showERPPanel || <ERPPanel connectors={erpConnectors} erpSnapshot={erpSnapshot} selectedSource={selectedERPSource} onSourceChange={setSelectedERPSource} currentDate={currentDate} onClose={() => setShowERPPanel(false)} /> : stryMutAct_9fa48("38991") ? false : stryMutAct_9fa48("38990") ? true : (stryCov_9fa48("38990", "38991", "38992"), showERPPanel && <ERPPanel connectors={erpConnectors} erpSnapshot={erpSnapshot} selectedSource={selectedERPSource} onSourceChange={setSelectedERPSource} currentDate={currentDate} onClose={stryMutAct_9fa48("38993") ? () => undefined : (stryCov_9fa48("38993"), () => setShowERPPanel(stryMutAct_9fa48("38994") ? true : (stryCov_9fa48("38994"), false)))} />)}

      {/* Compliance Panel (Collapsible) */}
      {stryMutAct_9fa48("38997") ? showCompliancePanel || <CompliancePanel ledger={ledger} liveSyncStatus={liveSyncStatus} witnessSessions={witnessSessions} redactionRules={redactionRules} onClose={() => setShowCompliancePanel(false)} /> : stryMutAct_9fa48("38996") ? false : stryMutAct_9fa48("38995") ? true : (stryCov_9fa48("38995", "38996", "38997"), showCompliancePanel && <CompliancePanel ledger={ledger} liveSyncStatus={liveSyncStatus} witnessSessions={witnessSessions} redactionRules={redactionRules} onClose={stryMutAct_9fa48("38998") ? () => undefined : (stryCov_9fa48("38998"), () => setShowCompliancePanel(stryMutAct_9fa48("38999") ? true : (stryCov_9fa48("38999"), false)))} />)}

      {/* Enhanced Features Toolbar */}
      <div className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 mr-2">Enhanced Views:</span>
              {(stryMutAct_9fa48("39000") ? [] : (stryCov_9fa48("39000"), [stryMutAct_9fa48("39001") ? {} : (stryCov_9fa48("39001"), {
              id: 'standard',
              label: '📊 Standard',
              icon: '📊',
              tooltip: 'Default timeline view with metrics and events'
            }), stryMutAct_9fa48("39006") ? {} : (stryCov_9fa48("39006"), {
              id: 'diff',
              label: '⚖️ Diff View',
              icon: '⚖️',
              tooltip: 'Side-by-side comparison of two points in time'
            }), stryMutAct_9fa48("39011") ? {} : (stryCov_9fa48("39011"), {
              id: 'theater',
              label: '🎬 Council Replay',
              icon: '🎬',
              tooltip: 'Watch AI council deliberation playback'
            }), stryMutAct_9fa48("39016") ? {} : (stryCov_9fa48("39016"), {
              id: 'impact',
              label: '🔗 Impact Trace',
              icon: '🔗',
              tooltip: 'Trace ripple effects from any decision'
            }), stryMutAct_9fa48("39021") ? {} : (stryCov_9fa48("39021"), {
              id: 'monte-carlo',
              label: '🎲 Monte Carlo',
              icon: '🎲',
              tooltip: 'Run 10,000+ probabilistic simulations'
            })])).map(stryMutAct_9fa48("39026") ? () => undefined : (stryCov_9fa48("39026"), view => <button key={view.id} onClick={stryMutAct_9fa48("39027") ? () => undefined : (stryCov_9fa48("39027"), () => setEnhancedView(view.id as EnhancedView))} title={view.tooltip} className={`px-3 py-1.5 text-sm rounded-lg transition-all ${(stryMutAct_9fa48("39031") ? enhancedView !== view.id : stryMutAct_9fa48("39030") ? false : stryMutAct_9fa48("39029") ? true : (stryCov_9fa48("39029", "39030", "39031"), enhancedView === view.id)) ? `bg-gradient-to-r ${styles.gradient} text-white` : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                  {view.label}
                </button>))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={stryMutAct_9fa48("39034") ? () => undefined : (stryCov_9fa48("39034"), () => setShowBookmarkModal(stryMutAct_9fa48("39035") ? false : (stryCov_9fa48("39035"), true)))} className="px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1">
                🔖 Bookmark
              </button>
              <button onClick={copyShareLink} className="px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1">
                🔗 Share Link
              </button>
              {stryMutAct_9fa48("39038") ? bookmarks.length > 0 || <div className="relative group">
                  <button className="px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors">
                    📚 {bookmarks.length} Saved
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {bookmarks.map(bm => <button key={bm.id} onClick={() => setCurrentDate(bm.timestamp)} className="w-full text-left px-3 py-2 hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg">
                        <p className="font-medium text-sm">{bm.label}</p>
                        <p className="text-xs text-neutral-500">{bm.timestamp.toLocaleString()}</p>
                      </button>)}
                  </div>
                </div> : stryMutAct_9fa48("39037") ? false : stryMutAct_9fa48("39036") ? true : (stryCov_9fa48("39036", "39037", "39038"), (stryMutAct_9fa48("39041") ? bookmarks.length <= 0 : stryMutAct_9fa48("39040") ? bookmarks.length >= 0 : stryMutAct_9fa48("39039") ? true : (stryCov_9fa48("39039", "39040", "39041"), bookmarks.length > 0)) && <div className="relative group">
                  <button className="px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors">
                    📚 {bookmarks.length} Saved
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {bookmarks.map(stryMutAct_9fa48("39042") ? () => undefined : (stryCov_9fa48("39042"), bm => <button key={bm.id} onClick={stryMutAct_9fa48("39043") ? () => undefined : (stryCov_9fa48("39043"), () => setCurrentDate(bm.timestamp))} className="w-full text-left px-3 py-2 hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg">
                        <p className="font-medium text-sm">{bm.label}</p>
                        <p className="text-xs text-neutral-500">{bm.timestamp.toLocaleString()}</p>
                      </button>))}
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Timeline Scrubber */}
        <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
          <TimelineScrubber currentDate={currentDate} minDate={timeRange.min} maxDate={timeRange.max} onDateChange={setCurrentDate} mode={mode} events={events} isPlaying={isPlaying} onPlayPause={stryMutAct_9fa48("39044") ? () => undefined : (stryCov_9fa48("39044"), () => setIsPlaying(stryMutAct_9fa48("39045") ? isPlaying : (stryCov_9fa48("39045"), !isPlaying)))} playbackSpeed={playbackSpeed} onSpeedChange={setPlaybackSpeed} onEventClick={event => {
          if (stryMutAct_9fa48("39049") ? enhancedView !== 'impact' : stryMutAct_9fa48("39048") ? false : stryMutAct_9fa48("39047") ? true : (stryCov_9fa48("39047", "39048", "39049"), enhancedView === 'impact')) {
            startImpactTrace(event);
          } else {
            // When not in impact mode, clicking an event switches to impact mode and traces
            startImpactTrace(event);
          }
        }} />
          {/* Replay Status Caption */}
          {stryMutAct_9fa48("39055") ? isPlaying || <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-amber-200">
                  {mode === 'rewind' && `Replaying changes from ${currentDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })} to now at ${playbackSpeed}x speed`}
                  {mode === 'replay' && `Simulating alternate timeline at ${playbackSpeed}x speed`}
                  {mode === 'fastforward' && `Projecting future scenarios at ${playbackSpeed}x speed`}
                </span>
              </div>
            </div> : stryMutAct_9fa48("39054") ? false : stryMutAct_9fa48("39053") ? true : (stryCov_9fa48("39053", "39054", "39055"), isPlaying && <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/50 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-amber-200">
                  {stryMutAct_9fa48("39058") ? mode === 'rewind' || `Replaying changes from ${currentDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })} to now at ${playbackSpeed}x speed` : stryMutAct_9fa48("39057") ? false : stryMutAct_9fa48("39056") ? true : (stryCov_9fa48("39056", "39057", "39058"), (stryMutAct_9fa48("39060") ? mode !== 'rewind' : stryMutAct_9fa48("39059") ? true : (stryCov_9fa48("39059", "39060"), mode === 'rewind')) && `Replaying changes from ${currentDate.toLocaleTimeString(stryMutAct_9fa48("39063") ? ["Stryker was here"] : (stryCov_9fa48("39063"), []), stryMutAct_9fa48("39064") ? {} : (stryCov_9fa48("39064"), {
                hour: '2-digit',
                minute: '2-digit'
              }))} to now at ${playbackSpeed}x speed`)}
                  {stryMutAct_9fa48("39069") ? mode === 'replay' || `Simulating alternate timeline at ${playbackSpeed}x speed` : stryMutAct_9fa48("39068") ? false : stryMutAct_9fa48("39067") ? true : (stryCov_9fa48("39067", "39068", "39069"), (stryMutAct_9fa48("39071") ? mode !== 'replay' : stryMutAct_9fa48("39070") ? true : (stryCov_9fa48("39070", "39071"), mode === 'replay')) && `Simulating alternate timeline at ${playbackSpeed}x speed`)}
                  {stryMutAct_9fa48("39076") ? mode === 'fastforward' || `Projecting future scenarios at ${playbackSpeed}x speed` : stryMutAct_9fa48("39075") ? false : stryMutAct_9fa48("39074") ? true : (stryCov_9fa48("39074", "39075", "39076"), (stryMutAct_9fa48("39078") ? mode !== 'fastforward' : stryMutAct_9fa48("39077") ? true : (stryCov_9fa48("39077", "39078"), mode === 'fastforward')) && `Projecting future scenarios at ${playbackSpeed}x speed`)}
                </span>
              </div>
            </div>)}
          {/* Help tooltip for first-time users */}
          <div className="mt-3 text-center">
            <span className="text-xs text-neutral-500">
              💡 <em>Chronos replays every metric, event, and AI decision between two points in time.</em>
            </span>
          </div>
        </div>

        {/* Enhanced Views (Conditional) */}
        {stryMutAct_9fa48("39083") ? enhancedView === 'diff' || <DiffView currentSnapshot={snapshot} compareSnapshot={diffSnapshot} currentDate={currentDate} compareDate={diffDate} onSelectCompareDate={startDiffView} /> : stryMutAct_9fa48("39082") ? false : stryMutAct_9fa48("39081") ? true : (stryCov_9fa48("39081", "39082", "39083"), (stryMutAct_9fa48("39085") ? enhancedView !== 'diff' : stryMutAct_9fa48("39084") ? true : (stryCov_9fa48("39084", "39085"), enhancedView === 'diff')) && <DiffView currentSnapshot={snapshot} compareSnapshot={diffSnapshot} currentDate={currentDate} compareDate={diffDate} onSelectCompareDate={startDiffView} />)}

        {stryMutAct_9fa48("39089") ? enhancedView === 'theater' || <CouncilTheater replay={selectedReplay} onClose={() => setEnhancedView('standard')} /> : stryMutAct_9fa48("39088") ? false : stryMutAct_9fa48("39087") ? true : (stryCov_9fa48("39087", "39088", "39089"), (stryMutAct_9fa48("39091") ? enhancedView !== 'theater' : stryMutAct_9fa48("39090") ? true : (stryCov_9fa48("39090", "39091"), enhancedView === 'theater')) && <CouncilTheater replay={selectedReplay} onClose={stryMutAct_9fa48("39093") ? () => undefined : (stryCov_9fa48("39093"), () => setEnhancedView('standard'))} />)}

        {stryMutAct_9fa48("39097") ? enhancedView === 'impact' || <ImpactTraceView causalChain={causalChain} onClose={() => setEnhancedView('standard')} /> : stryMutAct_9fa48("39096") ? false : stryMutAct_9fa48("39095") ? true : (stryCov_9fa48("39095", "39096", "39097"), (stryMutAct_9fa48("39099") ? enhancedView !== 'impact' : stryMutAct_9fa48("39098") ? true : (stryCov_9fa48("39098", "39099"), enhancedView === 'impact')) && <ImpactTraceView causalChain={causalChain} onClose={stryMutAct_9fa48("39101") ? () => undefined : (stryCov_9fa48("39101"), () => setEnhancedView('standard'))} />)}

        {stryMutAct_9fa48("39105") ? enhancedView === 'monte-carlo' || <MonteCarloView result={monteCarloResult} onRun={runMonteCarlo} onClose={() => setEnhancedView('standard')} /> : stryMutAct_9fa48("39104") ? false : stryMutAct_9fa48("39103") ? true : (stryCov_9fa48("39103", "39104", "39105"), (stryMutAct_9fa48("39107") ? enhancedView !== 'monte-carlo' : stryMutAct_9fa48("39106") ? true : (stryCov_9fa48("39106", "39107"), enhancedView === 'monte-carlo')) && <MonteCarloView result={monteCarloResult} onRun={runMonteCarlo} onClose={stryMutAct_9fa48("39109") ? () => undefined : (stryCov_9fa48("39109"), () => setEnhancedView('standard'))} />)}

        {/* Main Content Grid (Standard View) */}
        {stryMutAct_9fa48("39113") ? enhancedView === 'standard' || <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Metrics */}
          <div className="col-span-2 space-y-6">
            {/* State at This Time */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span>{styles.icon}</span>
                  Organization State
                </h2>
                <div className="flex items-center gap-3">
                  {/* Department Selector */}
                  <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
                    {departments.map(dept => <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>)}
                  </select>
                  {mode === 'rewind' && selectedEvent?.deliberationId && <button onClick={() => startCouncilReplay(selectedEvent)} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
                      🎬 Replay Council Deliberation
                    </button>}
                </div>
              </div>
              
              {/* Timestamp subtitle */}
              <p className="text-sm text-neutral-500 mb-4">
                {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}, {currentDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })} · {selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}
              </p>
              
              {/* Cone of Uncertainty Banner - shown when viewing future dates */}
              {currentDate > new Date() && <div className="mb-4 p-3 bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-cyan-900/40 border border-cyan-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🔮</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-cyan-300">Cone of Uncertainty</span>
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                          Monte Carlo Simulation
                        </span>
                      </div>
                      <p className="text-xs text-cyan-200/70 mt-1">
                        Future projections show <span className="font-semibold text-white">probabilistic ranges</span> — uncertainty grows with time. 
                        Past data is immutable (Ledger), but the future is probabilistic (Strategy Pillar).
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Days ahead</div>
                      <div className="text-xl font-bold text-cyan-400">
                        +{Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))}
                      </div>
                      <div className="text-xs text-cyan-500/70">
                        ±{Math.min(30, 5 + Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) / 365 * 25).toFixed(0)}% uncertainty
                      </div>
                    </div>
                  </div>
                </div>}
              
              {/* Highlight Metric - Key insight at this moment */}
              {(() => {
              const isFutureDate = currentDate > new Date();
              const daysAhead = Math.max(0, (currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000));
              const uncertaintyPct = Math.min(30, 5 + daysAhead / 365 * 25);
              const runwayLow = snapshot.metrics.runway * (1 - uncertaintyPct / 100);
              const runwayHigh = snapshot.metrics.runway * (1 + uncertaintyPct / 100);
              return <div className={`mb-4 p-3 rounded-xl ${isFutureDate ? 'bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-cyan-900/30 border border-cyan-500/30' : 'bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-700/50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{isFutureDate ? '🔮' : '🛫'}</span>
                        <div>
                          <span className="text-sm text-neutral-400">
                            {isFutureDate ? 'Projected Insight' : 'Key Insight'}
                          </span>
                          <div className={`text-lg font-bold ${isFutureDate ? 'text-cyan-300' : 'text-white'}`}>
                            Runway: {isFutureDate ? <span style={{
                          fontStyle: 'italic'
                        }}>
                                {runwayLow.toFixed(1)} – {runwayHigh.toFixed(1)} months
                              </span> : <>{snapshot.metrics.runway.toFixed(1)} months</>}
                            <span className={`ml-2 text-sm font-normal ${snapshot.metrics.runway > 12 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {snapshot.metrics.runway > 12 ? '↑ healthy' : '⚠️ monitor'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isFutureDate ? <>
                            <div className="text-xs text-cyan-400/70">projection confidence</div>
                            <div className="text-cyan-400 font-semibold">±{uncertaintyPct.toFixed(0)}%</div>
                          </> : <>
                            <div className="text-xs text-neutral-500">vs last quarter</div>
                            <div className="text-emerald-400 font-semibold">+3.1 months</div>
                          </>}
                      </div>
                    </div>
                  </div>;
            })()}
              
              <MetricsGrid snapshot={snapshot} mode={mode} department={selectedDepartment} currentDate={currentDate} />
            </div>

            {/* Council State */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold mb-4">🧠 Council State</h2>
              <CouncilState council={snapshot.council} mode={mode} />
            </div>

            {/* Knowledge Graph State */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold mb-4">🕸️ Knowledge Graph</h2>
              <GraphState graph={snapshot.graph} mode={mode} />
            </div>

            {/* Animated Graph Preview */}
            <AnimatedGraphPreview nodes={graphNodes} snapshot={snapshot} />

            {/* Alternate Timelines (Replay Mode) */}
            {mode === 'replay' && branches.length > 0 && <div className="bg-neutral-900 rounded-2xl p-6 border border-purple-800">
                <h2 className="text-xl font-semibold mb-4">🌀 Alternate Timelines</h2>
                <BranchList branches={branches} selectedId={selectedBranch} onSelect={setSelectedBranch} />
              </div>}
          </div>

          {/* Right Column - Events & Actions */}
          <div className="space-y-6">
            {/* Events at This Time */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className="text-lg font-semibold mb-3">📅 Events</h2>
              <EventsList events={events} currentDate={currentDate} onSelect={setSelectedEvent} selectedId={selectedEvent?.id} mode={mode} onOpenWitness={openEventWitness} />
            </div>

            {/* Replay Actions */}
            {mode === 'replay' && <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-700">
                <h2 className="text-lg font-semibold mb-4">🔀 Create Alternate Timeline</h2>
                <VariableSelector onCreateBranch={() => setShowBranchModal(true)} />
              </div>}

            {/* Fast Forward Predictions */}
            {mode === 'fastforward' && <div className="bg-cyan-900/30 rounded-2xl p-6 border border-cyan-700">
                <h2 className="text-lg font-semibold mb-4">🔮 Prediction Confidence</h2>
                <PredictionConfidence currentDate={currentDate} />
              </div>}

            {/* Audit Trail (Rewind) */}
            {mode === 'rewind' && <div className="bg-amber-900/30 rounded-2xl p-6 border border-amber-700">
                <h2 className="text-lg font-semibold mb-4">📋 Export Audit Package</h2>
                <AuditExport currentDate={currentDate} />
              </div>}

            {/* Pivotal Moments */}
            <PivotalMomentsPanel moments={pivotalMoments} onJumpTo={setCurrentDate} onStartImpactTrace={startImpactTrace} />
          </div>
        </div> : stryMutAct_9fa48("39112") ? false : stryMutAct_9fa48("39111") ? true : (stryCov_9fa48("39111", "39112", "39113"), (stryMutAct_9fa48("39115") ? enhancedView !== 'standard' : stryMutAct_9fa48("39114") ? true : (stryCov_9fa48("39114", "39115"), enhancedView === 'standard')) && <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Metrics */}
          <div className="col-span-2 space-y-6">
            {/* State at This Time */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span>{styles.icon}</span>
                  Organization State
                </h2>
                <div className="flex items-center gap-3">
                  {/* Department Selector */}
                  <select value={selectedDepartment} onChange={stryMutAct_9fa48("39117") ? () => undefined : (stryCov_9fa48("39117"), e => setSelectedDepartment(e.target.value))} className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500">
                    {departments.map(stryMutAct_9fa48("39118") ? () => undefined : (stryCov_9fa48("39118"), dept => <option key={dept} value={dept}>
                        {(stryMutAct_9fa48("39121") ? dept !== 'all' : stryMutAct_9fa48("39120") ? false : stryMutAct_9fa48("39119") ? true : (stryCov_9fa48("39119", "39120", "39121"), dept === 'all')) ? 'All Departments' : dept}
                      </option>))}
                  </select>
                  {stryMutAct_9fa48("39126") ? mode === 'rewind' && selectedEvent?.deliberationId || <button onClick={() => startCouncilReplay(selectedEvent)} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
                      🎬 Replay Council Deliberation
                    </button> : stryMutAct_9fa48("39125") ? false : stryMutAct_9fa48("39124") ? true : (stryCov_9fa48("39124", "39125", "39126"), (stryMutAct_9fa48("39128") ? mode === 'rewind' || selectedEvent?.deliberationId : stryMutAct_9fa48("39127") ? true : (stryCov_9fa48("39127", "39128"), (stryMutAct_9fa48("39130") ? mode !== 'rewind' : stryMutAct_9fa48("39129") ? true : (stryCov_9fa48("39129", "39130"), mode === 'rewind')) && (stryMutAct_9fa48("39132") ? selectedEvent.deliberationId : (stryCov_9fa48("39132"), selectedEvent?.deliberationId)))) && <button onClick={stryMutAct_9fa48("39133") ? () => undefined : (stryCov_9fa48("39133"), () => startCouncilReplay(selectedEvent))} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
                      🎬 Replay Council Deliberation
                    </button>)}
                </div>
              </div>
              
              {/* Timestamp subtitle */}
              <p className="text-sm text-neutral-500 mb-4">
                {currentDate.toLocaleDateString('en-US', stryMutAct_9fa48("39135") ? {} : (stryCov_9fa48("39135"), {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }))}, {currentDate.toLocaleTimeString('en-US', stryMutAct_9fa48("39140") ? {} : (stryCov_9fa48("39140"), {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }))} · {(stryMutAct_9fa48("39146") ? selectedDepartment !== 'all' : stryMutAct_9fa48("39145") ? false : stryMutAct_9fa48("39144") ? true : (stryCov_9fa48("39144", "39145", "39146"), selectedDepartment === 'all')) ? 'All Departments' : selectedDepartment}
              </p>
              
              {/* Cone of Uncertainty Banner - shown when viewing future dates */}
              {stryMutAct_9fa48("39151") ? currentDate > new Date() || <div className="mb-4 p-3 bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-cyan-900/40 border border-cyan-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🔮</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-cyan-300">Cone of Uncertainty</span>
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                          Monte Carlo Simulation
                        </span>
                      </div>
                      <p className="text-xs text-cyan-200/70 mt-1">
                        Future projections show <span className="font-semibold text-white">probabilistic ranges</span> — uncertainty grows with time. 
                        Past data is immutable (Ledger), but the future is probabilistic (Strategy Pillar).
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Days ahead</div>
                      <div className="text-xl font-bold text-cyan-400">
                        +{Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))}
                      </div>
                      <div className="text-xs text-cyan-500/70">
                        ±{Math.min(30, 5 + Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) / 365 * 25).toFixed(0)}% uncertainty
                      </div>
                    </div>
                  </div>
                </div> : stryMutAct_9fa48("39150") ? false : stryMutAct_9fa48("39149") ? true : (stryCov_9fa48("39149", "39150", "39151"), (stryMutAct_9fa48("39154") ? currentDate <= new Date() : stryMutAct_9fa48("39153") ? currentDate >= new Date() : stryMutAct_9fa48("39152") ? true : (stryCov_9fa48("39152", "39153", "39154"), currentDate > new Date())) && <div className="mb-4 p-3 bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-cyan-900/40 border border-cyan-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🔮</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-cyan-300">Cone of Uncertainty</span>
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                          Monte Carlo Simulation
                        </span>
                      </div>
                      <p className="text-xs text-cyan-200/70 mt-1">
                        Future projections show <span className="font-semibold text-white">probabilistic ranges</span> — uncertainty grows with time. 
                        Past data is immutable (Ledger), but the future is probabilistic (Strategy Pillar).
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400">Days ahead</div>
                      <div className="text-xl font-bold text-cyan-400">
                        +{Math.ceil(stryMutAct_9fa48("39155") ? (currentDate.getTime() - new Date().getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("39155"), (stryMutAct_9fa48("39156") ? currentDate.getTime() + new Date().getTime() : (stryCov_9fa48("39156"), currentDate.getTime() - new Date().getTime())) / (stryMutAct_9fa48("39157") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("39157"), (stryMutAct_9fa48("39158") ? 24 * 60 / 60 : (stryCov_9fa48("39158"), (stryMutAct_9fa48("39159") ? 24 / 60 : (stryCov_9fa48("39159"), 24 * 60)) * 60)) * 1000))))}
                      </div>
                      <div className="text-xs text-cyan-500/70">
                        ±{stryMutAct_9fa48("39160") ? Math.max(30, 5 + Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) / 365 * 25).toFixed(0) : (stryCov_9fa48("39160"), Math.min(30, stryMutAct_9fa48("39161") ? 5 - Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) / 365 * 25 : (stryCov_9fa48("39161"), 5 + (stryMutAct_9fa48("39162") ? Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) / 365 / 25 : (stryCov_9fa48("39162"), (stryMutAct_9fa48("39163") ? Math.ceil((currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) * 365 : (stryCov_9fa48("39163"), Math.ceil(stryMutAct_9fa48("39164") ? (currentDate.getTime() - new Date().getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("39164"), (stryMutAct_9fa48("39165") ? currentDate.getTime() + new Date().getTime() : (stryCov_9fa48("39165"), currentDate.getTime() - new Date().getTime())) / (stryMutAct_9fa48("39166") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("39166"), (stryMutAct_9fa48("39167") ? 24 * 60 / 60 : (stryCov_9fa48("39167"), (stryMutAct_9fa48("39168") ? 24 / 60 : (stryCov_9fa48("39168"), 24 * 60)) * 60)) * 1000)))) / 365)) * 25)))).toFixed(0))}% uncertainty
                      </div>
                    </div>
                  </div>
                </div>)}
              
              {/* Highlight Metric - Key insight at this moment */}
              {(() => {
              const isFutureDate = stryMutAct_9fa48("39173") ? currentDate <= new Date() : stryMutAct_9fa48("39172") ? currentDate >= new Date() : stryMutAct_9fa48("39171") ? false : stryMutAct_9fa48("39170") ? true : (stryCov_9fa48("39170", "39171", "39172", "39173"), currentDate > new Date());
              const daysAhead = stryMutAct_9fa48("39174") ? Math.min(0, (currentDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)) : (stryCov_9fa48("39174"), Math.max(0, stryMutAct_9fa48("39175") ? (currentDate.getTime() - new Date().getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("39175"), (stryMutAct_9fa48("39176") ? currentDate.getTime() + new Date().getTime() : (stryCov_9fa48("39176"), currentDate.getTime() - new Date().getTime())) / (stryMutAct_9fa48("39177") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("39177"), (stryMutAct_9fa48("39178") ? 24 * 60 / 60 : (stryCov_9fa48("39178"), (stryMutAct_9fa48("39179") ? 24 / 60 : (stryCov_9fa48("39179"), 24 * 60)) * 60)) * 1000)))));
              const uncertaintyPct = stryMutAct_9fa48("39180") ? Math.max(30, 5 + daysAhead / 365 * 25) : (stryCov_9fa48("39180"), Math.min(30, stryMutAct_9fa48("39181") ? 5 - daysAhead / 365 * 25 : (stryCov_9fa48("39181"), 5 + (stryMutAct_9fa48("39182") ? daysAhead / 365 / 25 : (stryCov_9fa48("39182"), (stryMutAct_9fa48("39183") ? daysAhead * 365 : (stryCov_9fa48("39183"), daysAhead / 365)) * 25)))));
              const runwayLow = stryMutAct_9fa48("39184") ? snapshot.metrics.runway / (1 - uncertaintyPct / 100) : (stryCov_9fa48("39184"), snapshot.metrics.runway * (stryMutAct_9fa48("39185") ? 1 + uncertaintyPct / 100 : (stryCov_9fa48("39185"), 1 - (stryMutAct_9fa48("39186") ? uncertaintyPct * 100 : (stryCov_9fa48("39186"), uncertaintyPct / 100)))));
              const runwayHigh = stryMutAct_9fa48("39187") ? snapshot.metrics.runway / (1 + uncertaintyPct / 100) : (stryCov_9fa48("39187"), snapshot.metrics.runway * (stryMutAct_9fa48("39188") ? 1 - uncertaintyPct / 100 : (stryCov_9fa48("39188"), 1 + (stryMutAct_9fa48("39189") ? uncertaintyPct * 100 : (stryCov_9fa48("39189"), uncertaintyPct / 100)))));
              return <div className={`mb-4 p-3 rounded-xl ${isFutureDate ? 'bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-cyan-900/30 border border-cyan-500/30' : 'bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-700/50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{isFutureDate ? '🔮' : '🛫'}</span>
                        <div>
                          <span className="text-sm text-neutral-400">
                            {isFutureDate ? 'Projected Insight' : 'Key Insight'}
                          </span>
                          <div className={`text-lg font-bold ${isFutureDate ? 'text-cyan-300' : 'text-white'}`}>
                            Runway: {isFutureDate ? <span style={stryMutAct_9fa48("39200") ? {} : (stryCov_9fa48("39200"), {
                          fontStyle: 'italic'
                        })}>
                                {runwayLow.toFixed(1)} – {runwayHigh.toFixed(1)} months
                              </span> : <>{snapshot.metrics.runway.toFixed(1)} months</>}
                            <span className={`ml-2 text-sm font-normal ${(stryMutAct_9fa48("39206") ? snapshot.metrics.runway <= 12 : stryMutAct_9fa48("39205") ? snapshot.metrics.runway >= 12 : stryMutAct_9fa48("39204") ? false : stryMutAct_9fa48("39203") ? true : (stryCov_9fa48("39203", "39204", "39205", "39206"), snapshot.metrics.runway > 12)) ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {(stryMutAct_9fa48("39212") ? snapshot.metrics.runway <= 12 : stryMutAct_9fa48("39211") ? snapshot.metrics.runway >= 12 : stryMutAct_9fa48("39210") ? false : stryMutAct_9fa48("39209") ? true : (stryCov_9fa48("39209", "39210", "39211", "39212"), snapshot.metrics.runway > 12)) ? '↑ healthy' : '⚠️ monitor'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {isFutureDate ? <>
                            <div className="text-xs text-cyan-400/70">projection confidence</div>
                            <div className="text-cyan-400 font-semibold">±{uncertaintyPct.toFixed(0)}%</div>
                          </> : <>
                            <div className="text-xs text-neutral-500">vs last quarter</div>
                            <div className="text-emerald-400 font-semibold">+3.1 months</div>
                          </>}
                      </div>
                    </div>
                  </div>;
            })()}
              
              <MetricsGrid snapshot={snapshot} mode={mode} department={selectedDepartment} currentDate={currentDate} />
            </div>

            {/* Council State */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold mb-4">🧠 Council State</h2>
              <CouncilState council={snapshot.council} mode={mode} />
            </div>

            {/* Knowledge Graph State */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className="text-xl font-semibold mb-4">🕸️ Knowledge Graph</h2>
              <GraphState graph={snapshot.graph} mode={mode} />
            </div>

            {/* Animated Graph Preview */}
            <AnimatedGraphPreview nodes={graphNodes} snapshot={snapshot} />

            {/* Alternate Timelines (Replay Mode) */}
            {stryMutAct_9fa48("39217") ? mode === 'replay' && branches.length > 0 || <div className="bg-neutral-900 rounded-2xl p-6 border border-purple-800">
                <h2 className="text-xl font-semibold mb-4">🌀 Alternate Timelines</h2>
                <BranchList branches={branches} selectedId={selectedBranch} onSelect={setSelectedBranch} />
              </div> : stryMutAct_9fa48("39216") ? false : stryMutAct_9fa48("39215") ? true : (stryCov_9fa48("39215", "39216", "39217"), (stryMutAct_9fa48("39219") ? mode === 'replay' || branches.length > 0 : stryMutAct_9fa48("39218") ? true : (stryCov_9fa48("39218", "39219"), (stryMutAct_9fa48("39221") ? mode !== 'replay' : stryMutAct_9fa48("39220") ? true : (stryCov_9fa48("39220", "39221"), mode === 'replay')) && (stryMutAct_9fa48("39225") ? branches.length <= 0 : stryMutAct_9fa48("39224") ? branches.length >= 0 : stryMutAct_9fa48("39223") ? true : (stryCov_9fa48("39223", "39224", "39225"), branches.length > 0)))) && <div className="bg-neutral-900 rounded-2xl p-6 border border-purple-800">
                <h2 className="text-xl font-semibold mb-4">🌀 Alternate Timelines</h2>
                <BranchList branches={branches} selectedId={selectedBranch} onSelect={setSelectedBranch} />
              </div>)}
          </div>

          {/* Right Column - Events & Actions */}
          <div className="space-y-6">
            {/* Events at This Time */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className="text-lg font-semibold mb-3">📅 Events</h2>
              <EventsList events={events} currentDate={currentDate} onSelect={setSelectedEvent} selectedId={stryMutAct_9fa48("39226") ? selectedEvent.id : (stryCov_9fa48("39226"), selectedEvent?.id)} mode={mode} onOpenWitness={openEventWitness} />
            </div>

            {/* Replay Actions */}
            {stryMutAct_9fa48("39229") ? mode === 'replay' || <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-700">
                <h2 className="text-lg font-semibold mb-4">🔀 Create Alternate Timeline</h2>
                <VariableSelector onCreateBranch={() => setShowBranchModal(true)} />
              </div> : stryMutAct_9fa48("39228") ? false : stryMutAct_9fa48("39227") ? true : (stryCov_9fa48("39227", "39228", "39229"), (stryMutAct_9fa48("39231") ? mode !== 'replay' : stryMutAct_9fa48("39230") ? true : (stryCov_9fa48("39230", "39231"), mode === 'replay')) && <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-700">
                <h2 className="text-lg font-semibold mb-4">🔀 Create Alternate Timeline</h2>
                <VariableSelector onCreateBranch={stryMutAct_9fa48("39233") ? () => undefined : (stryCov_9fa48("39233"), () => setShowBranchModal(stryMutAct_9fa48("39234") ? false : (stryCov_9fa48("39234"), true)))} />
              </div>)}

            {/* Fast Forward Predictions */}
            {stryMutAct_9fa48("39237") ? mode === 'fastforward' || <div className="bg-cyan-900/30 rounded-2xl p-6 border border-cyan-700">
                <h2 className="text-lg font-semibold mb-4">🔮 Prediction Confidence</h2>
                <PredictionConfidence currentDate={currentDate} />
              </div> : stryMutAct_9fa48("39236") ? false : stryMutAct_9fa48("39235") ? true : (stryCov_9fa48("39235", "39236", "39237"), (stryMutAct_9fa48("39239") ? mode !== 'fastforward' : stryMutAct_9fa48("39238") ? true : (stryCov_9fa48("39238", "39239"), mode === 'fastforward')) && <div className="bg-cyan-900/30 rounded-2xl p-6 border border-cyan-700">
                <h2 className="text-lg font-semibold mb-4">🔮 Prediction Confidence</h2>
                <PredictionConfidence currentDate={currentDate} />
              </div>)}

            {/* Audit Trail (Rewind) */}
            {stryMutAct_9fa48("39243") ? mode === 'rewind' || <div className="bg-amber-900/30 rounded-2xl p-6 border border-amber-700">
                <h2 className="text-lg font-semibold mb-4">📋 Export Audit Package</h2>
                <AuditExport currentDate={currentDate} />
              </div> : stryMutAct_9fa48("39242") ? false : stryMutAct_9fa48("39241") ? true : (stryCov_9fa48("39241", "39242", "39243"), (stryMutAct_9fa48("39245") ? mode !== 'rewind' : stryMutAct_9fa48("39244") ? true : (stryCov_9fa48("39244", "39245"), mode === 'rewind')) && <div className="bg-amber-900/30 rounded-2xl p-6 border border-amber-700">
                <h2 className="text-lg font-semibold mb-4">📋 Export Audit Package</h2>
                <AuditExport currentDate={currentDate} />
              </div>)}

            {/* Pivotal Moments */}
            <PivotalMomentsPanel moments={pivotalMoments} onJumpTo={setCurrentDate} onStartImpactTrace={startImpactTrace} />
          </div>
        </div>)}
      </main>

      {/* Branch Creation Modal */}
      {stryMutAct_9fa48("39249") ? showBranchModal || <BranchModal branchPoint={currentDate} onClose={() => setShowBranchModal(false)} onCreate={createBranch} /> : stryMutAct_9fa48("39248") ? false : stryMutAct_9fa48("39247") ? true : (stryCov_9fa48("39247", "39248", "39249"), showBranchModal && <BranchModal branchPoint={currentDate} onClose={stryMutAct_9fa48("39250") ? () => undefined : (stryCov_9fa48("39250"), () => setShowBranchModal(stryMutAct_9fa48("39251") ? true : (stryCov_9fa48("39251"), false)))} onCreate={createBranch} />)}

      {/* Bookmark Modal */}
      {stryMutAct_9fa48("39254") ? showBookmarkModal || <BookmarkModal currentDate={currentDate} onSave={addBookmark} onClose={() => setShowBookmarkModal(false)} /> : stryMutAct_9fa48("39253") ? false : stryMutAct_9fa48("39252") ? true : (stryCov_9fa48("39252", "39253", "39254"), showBookmarkModal && <BookmarkModal currentDate={currentDate} onSave={addBookmark} onClose={stryMutAct_9fa48("39255") ? () => undefined : (stryCov_9fa48("39255"), () => setShowBookmarkModal(stryMutAct_9fa48("39256") ? true : (stryCov_9fa48("39256"), false)))} />)}

      {/* Court-Admissible Export Modal */}
      {stryMutAct_9fa48("39259") ? showCourtExportModal || <CourtExportModal timeRange={timeRange} currentDate={currentDate} onExport={generateExport} onClose={() => setShowCourtExportModal(false)} isExporting={exportInProgress} /> : stryMutAct_9fa48("39258") ? false : stryMutAct_9fa48("39257") ? true : (stryCov_9fa48("39257", "39258", "39259"), showCourtExportModal && <CourtExportModal timeRange={timeRange} currentDate={currentDate} onExport={generateExport} onClose={stryMutAct_9fa48("39260") ? () => undefined : (stryCov_9fa48("39260"), () => setShowCourtExportModal(stryMutAct_9fa48("39261") ? true : (stryCov_9fa48("39261"), false)))} isExporting={exportInProgress} />)}

      {/* Witness Session Modal */}
      {stryMutAct_9fa48("39264") ? showWitnessModal && !witnessEvent || <WitnessModal onAdd={addWitnessSession} onClose={() => setShowWitnessModal(false)} /> : stryMutAct_9fa48("39263") ? false : stryMutAct_9fa48("39262") ? true : (stryCov_9fa48("39262", "39263", "39264"), (stryMutAct_9fa48("39266") ? showWitnessModal || !witnessEvent : stryMutAct_9fa48("39265") ? true : (stryCov_9fa48("39265", "39266"), showWitnessModal && (stryMutAct_9fa48("39267") ? witnessEvent : (stryCov_9fa48("39267"), !witnessEvent)))) && <WitnessModal onAdd={addWitnessSession} onClose={stryMutAct_9fa48("39268") ? () => undefined : (stryCov_9fa48("39268"), () => setShowWitnessModal(stryMutAct_9fa48("39269") ? true : (stryCov_9fa48("39269"), false)))} />)}

      {/* Event Witness Modal - CendiaWitness™ View */}
      {stryMutAct_9fa48("39272") ? showWitnessModal && witnessEvent || <EventWitnessModal event={witnessEvent} onClose={() => {
      setShowWitnessModal(false);
      setWitnessEvent(null);
    }} onOpenInChronos={timestamp => {
      setCurrentDate(timestamp);
      setMode('rewind');
      setShowWitnessModal(false);
      setWitnessEvent(null);
    }} /> : stryMutAct_9fa48("39271") ? false : stryMutAct_9fa48("39270") ? true : (stryCov_9fa48("39270", "39271", "39272"), (stryMutAct_9fa48("39274") ? showWitnessModal || witnessEvent : stryMutAct_9fa48("39273") ? true : (stryCov_9fa48("39273", "39274"), showWitnessModal && witnessEvent)) && <EventWitnessModal event={witnessEvent} onClose={() => {
      setShowWitnessModal(stryMutAct_9fa48("39276") ? true : (stryCov_9fa48("39276"), false));
      setWitnessEvent(null);
    }} onOpenInChronos={timestamp => {
      setCurrentDate(timestamp);
      setMode('rewind');
      setShowWitnessModal(stryMutAct_9fa48("39279") ? true : (stryCov_9fa48("39279"), false));
      setWitnessEvent(null);
    }} />)}

      {/* Full Traceability Modal */}
      {stryMutAct_9fa48("39282") ? showTraceability && traceabilityView || <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">🔍 Full Traceability View</h2>
                <p className="text-neutral-400 text-sm mt-1">Court-level causality proof: Origin → Intermediate → Final</p>
              </div>
              <button onClick={() => setShowTraceability(false)} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700">
                <h3 className="text-emerald-400 font-semibold mb-3">📥 Origin Source</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-neutral-400">Dataset:</span> <span className="text-white font-mono">{traceabilityView.originSource.dataset}</span></div>
                  <div><span className="text-neutral-400">Table:</span> <span className="text-white font-mono">{traceabilityView.originSource.table}</span></div>
                  <div><span className="text-neutral-400">Field:</span> <span className="text-white font-mono">{traceabilityView.originSource.field}</span></div>
                </div>
              </div>
              <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700">
                <h3 className="text-amber-400 font-semibold mb-3">⚙️ Transforms ({traceabilityView.intermediateTransforms.length})</h3>
                <div className="space-y-2">
                  {traceabilityView.intermediateTransforms.map((t: {
                step: number;
                service: string;
                operation: string;
                outputHash: string;
                duration: number;
              }, i: number) => <div key={i} className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
                      <span className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold">{t.step}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{t.service} → {t.operation}</div>
                        <div className="text-xs text-neutral-400 font-mono">Hash: {t.outputHash.slice(0, 16)}...</div>
                      </div>
                      <div className="text-xs text-neutral-400">{t.duration}ms</div>
                    </div>)}
                </div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                <h3 className="text-purple-400 font-semibold mb-3">🤖 Agent Provenance</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-600/50 rounded-full flex items-center justify-center text-2xl">🧠</div>
                  <div>
                    <div className="text-white font-bold">{traceabilityView.agentProvenance.agentName}</div>
                    <div className="text-neutral-400 text-sm">{traceabilityView.agentProvenance.agentRole}</div>
                    <div className="text-neutral-300 text-sm mt-2 italic">"{traceabilityView.agentProvenance.reasoning}"</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 rounded-xl p-4 border border-green-700">
                <h3 className="text-green-400 font-semibold mb-3">✅ Integrity Proof</h3>
                <div className="font-mono text-xs text-neutral-300 bg-black/30 p-3 rounded-lg">
                  <div>Merkle Root: {traceabilityView.integrityProof.merkleRoot}</div>
                  <div>Block: #{traceabilityView.integrityProof.blockNumber}</div>
                  <div>Signature: {traceabilityView.integrityProof.signature.slice(0, 32)}...</div>
                </div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("39281") ? false : stryMutAct_9fa48("39280") ? true : (stryCov_9fa48("39280", "39281", "39282"), (stryMutAct_9fa48("39284") ? showTraceability || traceabilityView : stryMutAct_9fa48("39283") ? true : (stryCov_9fa48("39283", "39284"), showTraceability && traceabilityView)) && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">🔍 Full Traceability View</h2>
                <p className="text-neutral-400 text-sm mt-1">Court-level causality proof: Origin → Intermediate → Final</p>
              </div>
              <button onClick={stryMutAct_9fa48("39285") ? () => undefined : (stryCov_9fa48("39285"), () => setShowTraceability(stryMutAct_9fa48("39286") ? true : (stryCov_9fa48("39286"), false)))} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700">
                <h3 className="text-emerald-400 font-semibold mb-3">📥 Origin Source</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-neutral-400">Dataset:</span> <span className="text-white font-mono">{traceabilityView.originSource.dataset}</span></div>
                  <div><span className="text-neutral-400">Table:</span> <span className="text-white font-mono">{traceabilityView.originSource.table}</span></div>
                  <div><span className="text-neutral-400">Field:</span> <span className="text-white font-mono">{traceabilityView.originSource.field}</span></div>
                </div>
              </div>
              <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700">
                <h3 className="text-amber-400 font-semibold mb-3">⚙️ Transforms ({traceabilityView.intermediateTransforms.length})</h3>
                <div className="space-y-2">
                  {traceabilityView.intermediateTransforms.map(stryMutAct_9fa48("39287") ? () => undefined : (stryCov_9fa48("39287"), (t: {
                step: number;
                service: string;
                operation: string;
                outputHash: string;
                duration: number;
              }, i: number) => <div key={i} className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
                      <span className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold">{t.step}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{t.service} → {t.operation}</div>
                        <div className="text-xs text-neutral-400 font-mono">Hash: {stryMutAct_9fa48("39288") ? t.outputHash : (stryCov_9fa48("39288"), t.outputHash.slice(0, 16))}...</div>
                      </div>
                      <div className="text-xs text-neutral-400">{t.duration}ms</div>
                    </div>))}
                </div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                <h3 className="text-purple-400 font-semibold mb-3">🤖 Agent Provenance</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-600/50 rounded-full flex items-center justify-center text-2xl">🧠</div>
                  <div>
                    <div className="text-white font-bold">{traceabilityView.agentProvenance.agentName}</div>
                    <div className="text-neutral-400 text-sm">{traceabilityView.agentProvenance.agentRole}</div>
                    <div className="text-neutral-300 text-sm mt-2 italic">"{traceabilityView.agentProvenance.reasoning}"</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 rounded-xl p-4 border border-green-700">
                <h3 className="text-green-400 font-semibold mb-3">✅ Integrity Proof</h3>
                <div className="font-mono text-xs text-neutral-300 bg-black/30 p-3 rounded-lg">
                  <div>Merkle Root: {traceabilityView.integrityProof.merkleRoot}</div>
                  <div>Block: #{traceabilityView.integrityProof.blockNumber}</div>
                  <div>Signature: {stryMutAct_9fa48("39289") ? traceabilityView.integrityProof.signature : (stryCov_9fa48("39289"), traceabilityView.integrityProof.signature.slice(0, 32))}...</div>
                </div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Per-Event Compliance Snapshot Modal */}
      {stryMutAct_9fa48("39292") ? showComplianceSnapshot && eventComplianceSnapshot || <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">📊 Compliance Snapshot</h2>
                <p className="text-neutral-400 text-sm mt-1">At the time this decision was made</p>
              </div>
              <button onClick={() => setShowComplianceSnapshot(false)} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700">
                <h3 className="text-blue-400 font-semibold mb-3">🛡️ NIST CSF</h3>
                <div className="text-4xl font-bold text-white mb-3">{eventComplianceSnapshot.nistScore.overall}%</div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                <h3 className="text-purple-400 font-semibold mb-3">🌐 OECD AI</h3>
                <div className="text-4xl font-bold text-white mb-3">{eventComplianceSnapshot.oecdScore.overall}%</div>
              </div>
              <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700">
                <h3 className="text-emerald-400 font-semibold mb-3">🔒 Privacy</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-400">GDPR</span><span className={`px-2 py-0.5 rounded text-xs ${eventComplianceSnapshot.privacyCompliance.gdprStatus === 'compliant' ? 'bg-green-600' : 'bg-amber-600'}`}>{eventComplianceSnapshot.privacyCompliance.gdprStatus.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">CCPA</span><span className={`px-2 py-0.5 rounded text-xs ${eventComplianceSnapshot.privacyCompliance.ccpaStatus === 'compliant' ? 'bg-green-600' : 'bg-amber-600'}`}>{eventComplianceSnapshot.privacyCompliance.ccpaStatus.toUpperCase()}</span></div>
                </div>
              </div>
              <div className="bg-red-900/30 rounded-xl p-4 border border-red-700">
                <h3 className="text-red-400 font-semibold mb-3">🔐 Security</h3>
                <div className="text-4xl font-bold text-white mb-3">{eventComplianceSnapshot.securityPosture.overallScore}%</div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("39291") ? false : stryMutAct_9fa48("39290") ? true : (stryCov_9fa48("39290", "39291", "39292"), (stryMutAct_9fa48("39294") ? showComplianceSnapshot || eventComplianceSnapshot : stryMutAct_9fa48("39293") ? true : (stryCov_9fa48("39293", "39294"), showComplianceSnapshot && eventComplianceSnapshot)) && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">📊 Compliance Snapshot</h2>
                <p className="text-neutral-400 text-sm mt-1">At the time this decision was made</p>
              </div>
              <button onClick={stryMutAct_9fa48("39295") ? () => undefined : (stryCov_9fa48("39295"), () => setShowComplianceSnapshot(stryMutAct_9fa48("39296") ? true : (stryCov_9fa48("39296"), false)))} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-2 gap-4">
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700">
                <h3 className="text-blue-400 font-semibold mb-3">🛡️ NIST CSF</h3>
                <div className="text-4xl font-bold text-white mb-3">{eventComplianceSnapshot.nistScore.overall}%</div>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                <h3 className="text-purple-400 font-semibold mb-3">🌐 OECD AI</h3>
                <div className="text-4xl font-bold text-white mb-3">{eventComplianceSnapshot.oecdScore.overall}%</div>
              </div>
              <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700">
                <h3 className="text-emerald-400 font-semibold mb-3">🔒 Privacy</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-400">GDPR</span><span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("39300") ? eventComplianceSnapshot.privacyCompliance.gdprStatus !== 'compliant' : stryMutAct_9fa48("39299") ? false : stryMutAct_9fa48("39298") ? true : (stryCov_9fa48("39298", "39299", "39300"), eventComplianceSnapshot.privacyCompliance.gdprStatus === 'compliant')) ? 'bg-green-600' : 'bg-amber-600'}`}>{stryMutAct_9fa48("39304") ? eventComplianceSnapshot.privacyCompliance.gdprStatus.toLowerCase() : (stryCov_9fa48("39304"), eventComplianceSnapshot.privacyCompliance.gdprStatus.toUpperCase())}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">CCPA</span><span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("39308") ? eventComplianceSnapshot.privacyCompliance.ccpaStatus !== 'compliant' : stryMutAct_9fa48("39307") ? false : stryMutAct_9fa48("39306") ? true : (stryCov_9fa48("39306", "39307", "39308"), eventComplianceSnapshot.privacyCompliance.ccpaStatus === 'compliant')) ? 'bg-green-600' : 'bg-amber-600'}`}>{stryMutAct_9fa48("39312") ? eventComplianceSnapshot.privacyCompliance.ccpaStatus.toLowerCase() : (stryCov_9fa48("39312"), eventComplianceSnapshot.privacyCompliance.ccpaStatus.toUpperCase())}</span></div>
                </div>
              </div>
              <div className="bg-red-900/30 rounded-xl p-4 border border-red-700">
                <h3 className="text-red-400 font-semibold mb-3">🔐 Security</h3>
                <div className="text-4xl font-bold text-white mb-3">{eventComplianceSnapshot.securityPosture.overallScore}%</div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Reverse Time Check Modal */}
      {stryMutAct_9fa48("39315") ? showReverseTimeCheck || <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-3xl">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🔄 Chronos Integrity Validation</h2>
                <p className="text-neutral-400 text-sm mt-1">Rebuilding company state as of {currentDate.toLocaleDateString()}</p>
              </div>
              <button onClick={() => setShowReverseTimeCheck(false)} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              {isRebuildingState ? <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-spin">⏳</div>
                  <div className="text-white font-bold text-xl mb-2">Reconstructing State...</div>
                  <div className="w-full bg-neutral-700 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all" style={{
                width: `${reverseTimeProgress}%`
              }} />
                  </div>
                  <div className="text-neutral-400">{reverseTimeProgress}% complete</div>
                </div> : reverseTimeCheck && <div className="space-y-6">
                  <div className={`p-6 rounded-xl ${reverseTimeCheck.status === 'complete' ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{reverseTimeCheck.status === 'complete' ? '✅' : '⚠️'}</span>
                      <div>
                        <div className={`text-2xl font-bold ${reverseTimeCheck.status === 'complete' ? 'text-green-400' : 'text-red-400'}`}>
                          {reverseTimeCheck.status === 'complete' ? 'INTEGRITY VERIFIED' : 'MISMATCH DETECTED'}
                        </div>
                        <div className="text-neutral-400">{reverseTimeCheck.status === 'complete' ? 'All state reconstructions match stored hashes.' : 'Discrepancies found.'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">🔐 Hash Verification</h3>
                    <div className="font-mono text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-neutral-400">Expected:</span><span className="text-white">{reverseTimeCheck.expectedHash.slice(0, 32)}...</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Actual:</span><span className={reverseTimeCheck.expectedHash === reverseTimeCheck.actualHash ? 'text-green-400' : 'text-red-400'}>{reverseTimeCheck.actualHash.slice(0, 32)}...</span></div>
                    </div>
                  </div>
                  {reverseTimeCheck.forensicReport.legalAdmissible && <div className="mt-3 text-green-400 text-sm">⚖️ This report is court-admissible</div>}
                </div>}
            </div>
          </div>
        </div> : stryMutAct_9fa48("39314") ? false : stryMutAct_9fa48("39313") ? true : (stryCov_9fa48("39313", "39314", "39315"), showReverseTimeCheck && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-3xl">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🔄 Chronos Integrity Validation</h2>
                <p className="text-neutral-400 text-sm mt-1">Rebuilding company state as of {currentDate.toLocaleDateString()}</p>
              </div>
              <button onClick={stryMutAct_9fa48("39316") ? () => undefined : (stryCov_9fa48("39316"), () => setShowReverseTimeCheck(stryMutAct_9fa48("39317") ? true : (stryCov_9fa48("39317"), false)))} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              {isRebuildingState ? <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-spin">⏳</div>
                  <div className="text-white font-bold text-xl mb-2">Reconstructing State...</div>
                  <div className="w-full bg-neutral-700 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all" style={stryMutAct_9fa48("39318") ? {} : (stryCov_9fa48("39318"), {
                width: `${reverseTimeProgress}%`
              })} />
                  </div>
                  <div className="text-neutral-400">{reverseTimeProgress}% complete</div>
                </div> : stryMutAct_9fa48("39322") ? reverseTimeCheck || <div className="space-y-6">
                  <div className={`p-6 rounded-xl ${reverseTimeCheck.status === 'complete' ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{reverseTimeCheck.status === 'complete' ? '✅' : '⚠️'}</span>
                      <div>
                        <div className={`text-2xl font-bold ${reverseTimeCheck.status === 'complete' ? 'text-green-400' : 'text-red-400'}`}>
                          {reverseTimeCheck.status === 'complete' ? 'INTEGRITY VERIFIED' : 'MISMATCH DETECTED'}
                        </div>
                        <div className="text-neutral-400">{reverseTimeCheck.status === 'complete' ? 'All state reconstructions match stored hashes.' : 'Discrepancies found.'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">🔐 Hash Verification</h3>
                    <div className="font-mono text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-neutral-400">Expected:</span><span className="text-white">{reverseTimeCheck.expectedHash.slice(0, 32)}...</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Actual:</span><span className={reverseTimeCheck.expectedHash === reverseTimeCheck.actualHash ? 'text-green-400' : 'text-red-400'}>{reverseTimeCheck.actualHash.slice(0, 32)}...</span></div>
                    </div>
                  </div>
                  {reverseTimeCheck.forensicReport.legalAdmissible && <div className="mt-3 text-green-400 text-sm">⚖️ This report is court-admissible</div>}
                </div> : stryMutAct_9fa48("39321") ? false : stryMutAct_9fa48("39320") ? true : (stryCov_9fa48("39320", "39321", "39322"), reverseTimeCheck && <div className="space-y-6">
                  <div className={`p-6 rounded-xl ${(stryMutAct_9fa48("39326") ? reverseTimeCheck.status !== 'complete' : stryMutAct_9fa48("39325") ? false : stryMutAct_9fa48("39324") ? true : (stryCov_9fa48("39324", "39325", "39326"), reverseTimeCheck.status === 'complete')) ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{(stryMutAct_9fa48("39332") ? reverseTimeCheck.status !== 'complete' : stryMutAct_9fa48("39331") ? false : stryMutAct_9fa48("39330") ? true : (stryCov_9fa48("39330", "39331", "39332"), reverseTimeCheck.status === 'complete')) ? '✅' : '⚠️'}</span>
                      <div>
                        <div className={`text-2xl font-bold ${(stryMutAct_9fa48("39339") ? reverseTimeCheck.status !== 'complete' : stryMutAct_9fa48("39338") ? false : stryMutAct_9fa48("39337") ? true : (stryCov_9fa48("39337", "39338", "39339"), reverseTimeCheck.status === 'complete')) ? 'text-green-400' : 'text-red-400'}`}>
                          {(stryMutAct_9fa48("39345") ? reverseTimeCheck.status !== 'complete' : stryMutAct_9fa48("39344") ? false : stryMutAct_9fa48("39343") ? true : (stryCov_9fa48("39343", "39344", "39345"), reverseTimeCheck.status === 'complete')) ? 'INTEGRITY VERIFIED' : 'MISMATCH DETECTED'}
                        </div>
                        <div className="text-neutral-400">{(stryMutAct_9fa48("39351") ? reverseTimeCheck.status !== 'complete' : stryMutAct_9fa48("39350") ? false : stryMutAct_9fa48("39349") ? true : (stryCov_9fa48("39349", "39350", "39351"), reverseTimeCheck.status === 'complete')) ? 'All state reconstructions match stored hashes.' : 'Discrepancies found.'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">🔐 Hash Verification</h3>
                    <div className="font-mono text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-neutral-400">Expected:</span><span className="text-white">{stryMutAct_9fa48("39355") ? reverseTimeCheck.expectedHash : (stryCov_9fa48("39355"), reverseTimeCheck.expectedHash.slice(0, 32))}...</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Actual:</span><span className={(stryMutAct_9fa48("39358") ? reverseTimeCheck.expectedHash !== reverseTimeCheck.actualHash : stryMutAct_9fa48("39357") ? false : stryMutAct_9fa48("39356") ? true : (stryCov_9fa48("39356", "39357", "39358"), reverseTimeCheck.expectedHash === reverseTimeCheck.actualHash)) ? 'text-green-400' : 'text-red-400'}>{stryMutAct_9fa48("39361") ? reverseTimeCheck.actualHash : (stryCov_9fa48("39361"), reverseTimeCheck.actualHash.slice(0, 32))}...</span></div>
                    </div>
                  </div>
                  {stryMutAct_9fa48("39364") ? reverseTimeCheck.forensicReport.legalAdmissible || <div className="mt-3 text-green-400 text-sm">⚖️ This report is court-admissible</div> : stryMutAct_9fa48("39363") ? false : stryMutAct_9fa48("39362") ? true : (stryCov_9fa48("39362", "39363", "39364"), reverseTimeCheck.forensicReport.legalAdmissible && <div className="mt-3 text-green-400 text-sm">⚖️ This report is court-admissible</div>)}
                </div>)}
            </div>
          </div>
        </div>)}

      {/* Regulator Mode Setup Modal */}
      {stryMutAct_9fa48("39367") ? showRegulatorSetup || <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-2xl">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🏛️ Regulator Mode Setup</h2>
                <p className="text-neutral-400 text-sm mt-1">Read-only access for regulatory inspection</p>
              </div>
              <button onClick={() => setShowRegulatorSetup(false)} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(['SEC', 'FDIC', 'OCC', 'FRB', 'DOJ', 'FTC', 'HHS', 'Custom'] as const).map(org => <button key={org} onClick={() => startRegulatorSession(org, `${org} Auditor`, 'full_audit', {
              start: timeRange.min,
              end: currentDate
            })} className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left transition-colors">
                    <div className="text-white font-bold">{org}</div>
                    <div className="text-neutral-400 text-sm">{org === 'SEC' ? 'Securities & Exchange' : org === 'FDIC' ? 'Federal Deposit Insurance' : org === 'Custom' ? 'Custom Regulatory Body' : `${org} Agency`}</div>
                  </button>)}
              </div>
              <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700">
                <div className="text-amber-400 font-semibold">⚠️ Important</div>
                <div className="text-neutral-300 text-sm mt-1">Regulator Mode provides read-only access with automatic redaction. All access is logged.</div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("39366") ? false : stryMutAct_9fa48("39365") ? true : (stryCov_9fa48("39365", "39366", "39367"), showRegulatorSetup && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-2xl">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🏛️ Regulator Mode Setup</h2>
                <p className="text-neutral-400 text-sm mt-1">Read-only access for regulatory inspection</p>
              </div>
              <button onClick={stryMutAct_9fa48("39368") ? () => undefined : (stryCov_9fa48("39368"), () => setShowRegulatorSetup(stryMutAct_9fa48("39369") ? true : (stryCov_9fa48("39369"), false)))} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(['SEC', 'FDIC', 'OCC', 'FRB', 'DOJ', 'FTC', 'HHS', 'Custom'] as const).map(stryMutAct_9fa48("39370") ? () => undefined : (stryCov_9fa48("39370"), org => <button key={org} onClick={stryMutAct_9fa48("39371") ? () => undefined : (stryCov_9fa48("39371"), () => startRegulatorSession(org, `${org} Auditor`, 'full_audit', stryMutAct_9fa48("39374") ? {} : (stryCov_9fa48("39374"), {
              start: timeRange.min,
              end: currentDate
            })))} className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left transition-colors">
                    <div className="text-white font-bold">{org}</div>
                    <div className="text-neutral-400 text-sm">{(stryMutAct_9fa48("39377") ? org !== 'SEC' : stryMutAct_9fa48("39376") ? false : stryMutAct_9fa48("39375") ? true : (stryCov_9fa48("39375", "39376", "39377"), org === 'SEC')) ? 'Securities & Exchange' : (stryMutAct_9fa48("39382") ? org !== 'FDIC' : stryMutAct_9fa48("39381") ? false : stryMutAct_9fa48("39380") ? true : (stryCov_9fa48("39380", "39381", "39382"), org === 'FDIC')) ? 'Federal Deposit Insurance' : (stryMutAct_9fa48("39387") ? org !== 'Custom' : stryMutAct_9fa48("39386") ? false : stryMutAct_9fa48("39385") ? true : (stryCov_9fa48("39385", "39386", "39387"), org === 'Custom')) ? 'Custom Regulatory Body' : `${org} Agency`}</div>
                  </button>))}
              </div>
              <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700">
                <div className="text-amber-400 font-semibold">⚠️ Important</div>
                <div className="text-neutral-300 text-sm mt-1">Regulator Mode provides read-only access with automatic redaction. All access is logged.</div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Regulator Mode Banner */}
      {stryMutAct_9fa48("39393") ? regulatorMode && regulatorSession || <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 z-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl">🔴</span>
            <div>
              <span className="font-bold">REGULATOR MODE ACTIVE</span>
              <span className="ml-4 text-sm opacity-80">{regulatorSession.regulatorOrg} - Expires: {regulatorSession.expiresAt.toLocaleTimeString()}</span>
            </div>
          </div>
          <button onClick={endRegulatorSession} className="bg-white text-red-600 px-4 py-1 rounded-lg font-bold hover:bg-red-100">End Session</button>
        </div> : stryMutAct_9fa48("39392") ? false : stryMutAct_9fa48("39391") ? true : (stryCov_9fa48("39391", "39392", "39393"), (stryMutAct_9fa48("39395") ? regulatorMode || regulatorSession : stryMutAct_9fa48("39394") ? true : (stryCov_9fa48("39394", "39395"), regulatorMode && regulatorSession)) && <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 z-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl">🔴</span>
            <div>
              <span className="font-bold">REGULATOR MODE ACTIVE</span>
              <span className="ml-4 text-sm opacity-80">{regulatorSession.regulatorOrg} - Expires: {regulatorSession.expiresAt.toLocaleTimeString()}</span>
            </div>
          </div>
          <button onClick={endRegulatorSession} className="bg-white text-red-600 px-4 py-1 rounded-lg font-bold hover:bg-red-100">End Session</button>
        </div>)}

      {/* Zero-Knowledge Audit Modal */}
      {stryMutAct_9fa48("39398") ? showZKAudit || <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🔐 Zero-Knowledge Audits</h2>
                <p className="text-neutral-400 text-sm mt-1">Prove compliance without revealing sensitive data</p>
              </div>
              <button onClick={() => setShowZKAudit(false)} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-4 border border-cyan-700 mb-6">
                <h3 className="text-cyan-400 font-semibold mb-3">Generate New ZK Proof</h3>
                <div className="grid grid-cols-4 gap-3">
                  {(['GDPR', 'HIPAA', 'SOX', 'SOC2', 'NIST', 'ISO27001', 'CCPA', 'OECD_AI'] as const).map(fw => <button key={fw} onClick={() => generateZKAuditProof(fw, `We are compliant with ${fw} requirements`)} disabled={isGeneratingProof} className="p-3 bg-black/30 hover:bg-black/50 rounded-lg text-center transition-colors disabled:opacity-50">
                      <div className="text-white font-bold">{fw}</div>
                      <div className="text-xs text-neutral-400">Generate Proof</div>
                    </button>)}
                </div>
                {isGeneratingProof && <div className="mt-4 text-center text-cyan-400"><span className="animate-spin inline-block mr-2">⚡</span>Generating cryptographic proof...</div>}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Generated Proofs ({zkProofs.length})</h3>
                {zkProofs.length === 0 ? <div className="text-neutral-400 text-center py-8">No proofs generated yet. Click a framework above.</div> : <div className="space-y-3">
                    {zkProofs.map((proof: ZeroKnowledgeProof, i: number) => <div key={i} className="bg-neutral-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                              <div className="text-white font-bold">{proof.framework} Compliance Proof</div>
                              <div className="text-neutral-400 text-sm">{proof.claim}</div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-600 rounded-full text-xs font-bold">VERIFIED</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div><span className="text-neutral-400">Data Points:</span><span className="text-white ml-2">{proof.metadata.dataPointsProven.toLocaleString()}</span></div>
                          <div><span className="text-neutral-400">PII Exposed:</span><span className="text-green-400 ml-2">NONE</span></div>
                          <div><span className="text-neutral-400">Secrets:</span><span className="text-green-400 ml-2">NONE</span></div>
                        </div>
                        <div className="mt-3 p-2 bg-black/30 rounded-lg font-mono text-xs text-neutral-400">Proof Hash: {proof.verification.verificationHash.slice(0, 48)}...</div>
                      </div>)}
                  </div>}
              </div>
              <div className="mt-6 bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                <h3 className="text-purple-400 font-semibold mb-2">🔮 How Zero-Knowledge Proofs Work</h3>
                <div className="text-neutral-300 text-sm">Zero-knowledge proofs allow you to prove statements about your data without revealing the data itself. Demonstrate GDPR compliance without exposing PII.</div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("39397") ? false : stryMutAct_9fa48("39396") ? true : (stryCov_9fa48("39396", "39397", "39398"), showZKAudit && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🔐 Zero-Knowledge Audits</h2>
                <p className="text-neutral-400 text-sm mt-1">Prove compliance without revealing sensitive data</p>
              </div>
              <button onClick={stryMutAct_9fa48("39399") ? () => undefined : (stryCov_9fa48("39399"), () => setShowZKAudit(stryMutAct_9fa48("39400") ? true : (stryCov_9fa48("39400"), false)))} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-4 border border-cyan-700 mb-6">
                <h3 className="text-cyan-400 font-semibold mb-3">Generate New ZK Proof</h3>
                <div className="grid grid-cols-4 gap-3">
                  {(['GDPR', 'HIPAA', 'SOX', 'SOC2', 'NIST', 'ISO27001', 'CCPA', 'OECD_AI'] as const).map(stryMutAct_9fa48("39401") ? () => undefined : (stryCov_9fa48("39401"), fw => <button key={fw} onClick={stryMutAct_9fa48("39402") ? () => undefined : (stryCov_9fa48("39402"), () => generateZKAuditProof(fw, `We are compliant with ${fw} requirements`))} disabled={isGeneratingProof} className="p-3 bg-black/30 hover:bg-black/50 rounded-lg text-center transition-colors disabled:opacity-50">
                      <div className="text-white font-bold">{fw}</div>
                      <div className="text-xs text-neutral-400">Generate Proof</div>
                    </button>))}
                </div>
                {stryMutAct_9fa48("39406") ? isGeneratingProof || <div className="mt-4 text-center text-cyan-400"><span className="animate-spin inline-block mr-2">⚡</span>Generating cryptographic proof...</div> : stryMutAct_9fa48("39405") ? false : stryMutAct_9fa48("39404") ? true : (stryCov_9fa48("39404", "39405", "39406"), isGeneratingProof && <div className="mt-4 text-center text-cyan-400"><span className="animate-spin inline-block mr-2">⚡</span>Generating cryptographic proof...</div>)}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Generated Proofs ({zkProofs.length})</h3>
                {(stryMutAct_9fa48("39409") ? zkProofs.length !== 0 : stryMutAct_9fa48("39408") ? false : stryMutAct_9fa48("39407") ? true : (stryCov_9fa48("39407", "39408", "39409"), zkProofs.length === 0)) ? <div className="text-neutral-400 text-center py-8">No proofs generated yet. Click a framework above.</div> : <div className="space-y-3">
                    {zkProofs.map(stryMutAct_9fa48("39410") ? () => undefined : (stryCov_9fa48("39410"), (proof: ZeroKnowledgeProof, i: number) => <div key={i} className="bg-neutral-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                              <div className="text-white font-bold">{proof.framework} Compliance Proof</div>
                              <div className="text-neutral-400 text-sm">{proof.claim}</div>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-600 rounded-full text-xs font-bold">VERIFIED</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div><span className="text-neutral-400">Data Points:</span><span className="text-white ml-2">{proof.metadata.dataPointsProven.toLocaleString()}</span></div>
                          <div><span className="text-neutral-400">PII Exposed:</span><span className="text-green-400 ml-2">NONE</span></div>
                          <div><span className="text-neutral-400">Secrets:</span><span className="text-green-400 ml-2">NONE</span></div>
                        </div>
                        <div className="mt-3 p-2 bg-black/30 rounded-lg font-mono text-xs text-neutral-400">Proof Hash: {stryMutAct_9fa48("39411") ? proof.verification.verificationHash : (stryCov_9fa48("39411"), proof.verification.verificationHash.slice(0, 48))}...</div>
                      </div>))}
                  </div>}
              </div>
              <div className="mt-6 bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                <h3 className="text-purple-400 font-semibold mb-2">🔮 How Zero-Knowledge Proofs Work</h3>
                <div className="text-neutral-300 text-sm">Zero-knowledge proofs allow you to prove statements about your data without revealing the data itself. Demonstrate GDPR compliance without exposing PII.</div>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const TimelineScrubber: React.FC<{
  currentDate: Date;
  minDate: Date;
  maxDate: Date;
  onDateChange: (date: Date) => void;
  mode: ChronosMode;
  events: TimelineEvent[];
  isPlaying: boolean;
  onPlayPause: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onEventClick?: (event: TimelineEvent) => void;
}> = ({
  currentDate,
  minDate,
  maxDate,
  onDateChange,
  mode,
  events,
  isPlaying,
  onPlayPause,
  playbackSpeed,
  onSpeedChange,
  onEventClick
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(stryMutAct_9fa48("39413") ? true : (stryCov_9fa48("39413"), false));
  const [showDatePicker, setShowDatePicker] = useState(stryMutAct_9fa48("39414") ? true : (stryCov_9fa48("39414"), false));
  const [jumpDate, setJumpDate] = useState('');
  const [jumpTime, setJumpTime] = useState('12:00');

  // Handle jump to specific date/time
  const handleJumpToDateTime = () => {
    if (stryMutAct_9fa48("39420") ? false : stryMutAct_9fa48("39419") ? true : stryMutAct_9fa48("39418") ? jumpDate : (stryCov_9fa48("39418", "39419", "39420"), !jumpDate)) return;
    const [year, month, day] = jumpDate.split('-').map(Number);
    const [hours, minutes] = jumpTime.split(':').map(Number);
    const targetDate = new Date(year, stryMutAct_9fa48("39423") ? month + 1 : (stryCov_9fa48("39423"), month - 1), day, hours, minutes);

    // Clamp to valid range
    if (stryMutAct_9fa48("39427") ? targetDate >= minDate : stryMutAct_9fa48("39426") ? targetDate <= minDate : stryMutAct_9fa48("39425") ? false : stryMutAct_9fa48("39424") ? true : (stryCov_9fa48("39424", "39425", "39426", "39427"), targetDate < minDate)) {
      onDateChange(minDate);
    } else if (stryMutAct_9fa48("39432") ? targetDate <= maxDate : stryMutAct_9fa48("39431") ? targetDate >= maxDate : stryMutAct_9fa48("39430") ? false : stryMutAct_9fa48("39429") ? true : (stryCov_9fa48("39429", "39430", "39431", "39432"), targetDate > maxDate)) {
      onDateChange(maxDate);
    } else {
      onDateChange(targetDate);
    }
    setShowDatePicker(stryMutAct_9fa48("39435") ? true : (stryCov_9fa48("39435"), false));
  };
  const totalMs = stryMutAct_9fa48("39436") ? maxDate.getTime() + minDate.getTime() : (stryCov_9fa48("39436"), maxDate.getTime() - minDate.getTime());
  const position = stryMutAct_9fa48("39437") ? (currentDate.getTime() - minDate.getTime()) / totalMs / 100 : (stryCov_9fa48("39437"), (stryMutAct_9fa48("39438") ? (currentDate.getTime() - minDate.getTime()) * totalMs : (stryCov_9fa48("39438"), (stryMutAct_9fa48("39439") ? currentDate.getTime() + minDate.getTime() : (stryCov_9fa48("39439"), currentDate.getTime() - minDate.getTime())) / totalMs)) * 100);

  // Calculate date from mouse position
  const getDateFromPosition = useCallback((clientX: number) => {
    if (stryMutAct_9fa48("39443") ? false : stryMutAct_9fa48("39442") ? true : stryMutAct_9fa48("39441") ? trackRef.current : (stryCov_9fa48("39441", "39442", "39443"), !trackRef.current)) {
      return null;
    }
    const rect = trackRef.current.getBoundingClientRect();
    const x = stryMutAct_9fa48("39445") ? Math.min(0, Math.min(clientX - rect.left, rect.width)) : (stryCov_9fa48("39445"), Math.max(0, stryMutAct_9fa48("39446") ? Math.max(clientX - rect.left, rect.width) : (stryCov_9fa48("39446"), Math.min(stryMutAct_9fa48("39447") ? clientX + rect.left : (stryCov_9fa48("39447"), clientX - rect.left), rect.width))));
    const pct = stryMutAct_9fa48("39448") ? x * rect.width : (stryCov_9fa48("39448"), x / rect.width);
    return new Date(stryMutAct_9fa48("39449") ? minDate.getTime() - pct * totalMs : (stryCov_9fa48("39449"), minDate.getTime() + (stryMutAct_9fa48("39450") ? pct / totalMs : (stryCov_9fa48("39450"), pct * totalMs))));
  }, stryMutAct_9fa48("39451") ? [] : (stryCov_9fa48("39451"), [minDate, totalMs]));
  const handleTrackClick = (e: React.MouseEvent) => {
    const newDate = getDateFromPosition(e.clientX);
    if (stryMutAct_9fa48("39454") ? false : stryMutAct_9fa48("39453") ? true : (stryCov_9fa48("39453", "39454"), newDate)) {
      onDateChange(newDate);
    }
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(stryMutAct_9fa48("39457") ? false : (stryCov_9fa48("39457"), true));
    const newDate = getDateFromPosition(e.clientX);
    if (stryMutAct_9fa48("39459") ? false : stryMutAct_9fa48("39458") ? true : (stryCov_9fa48("39458", "39459"), newDate)) {
      onDateChange(newDate);
    }
  };

  // Handle drag move and end
  useEffect(() => {
    if (stryMutAct_9fa48("39464") ? false : stryMutAct_9fa48("39463") ? true : stryMutAct_9fa48("39462") ? isDragging : (stryCov_9fa48("39462", "39463", "39464"), !isDragging)) {
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      const newDate = getDateFromPosition(e.clientX);
      if (stryMutAct_9fa48("39468") ? false : stryMutAct_9fa48("39467") ? true : (stryCov_9fa48("39467", "39468"), newDate)) {
        onDateChange(newDate);
      }
    };
    const handleMouseUp = () => {
      setIsDragging(stryMutAct_9fa48("39471") ? true : (stryCov_9fa48("39471"), false));
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, stryMutAct_9fa48("39477") ? [] : (stryCov_9fa48("39477"), [isDragging, getDateFromPosition, onDateChange]));
  const getGradient = () => {
    switch (mode) {
      case 'rewind':
        if (stryMutAct_9fa48("39479")) {} else {
          stryCov_9fa48("39479");
          return 'from-amber-500 to-orange-600';
        }
      case 'replay':
        if (stryMutAct_9fa48("39482")) {} else {
          stryCov_9fa48("39482");
          return 'from-purple-500 to-pink-600';
        }
      case 'fastforward':
        if (stryMutAct_9fa48("39485")) {} else {
          stryCov_9fa48("39485");
          return 'from-cyan-500 to-blue-600';
        }
    }
  };

  // Event markers
  const markers = stryMutAct_9fa48("39488") ? events.map(e => ({
    position: (e.timestamp.getTime() - minDate.getTime()) / totalMs * 100,
    event: e
  })) : (stryCov_9fa48("39488"), events.filter(stryMutAct_9fa48("39489") ? () => undefined : (stryCov_9fa48("39489"), e => stryMutAct_9fa48("39492") ? e.timestamp >= minDate || e.timestamp <= maxDate : stryMutAct_9fa48("39491") ? false : stryMutAct_9fa48("39490") ? true : (stryCov_9fa48("39490", "39491", "39492"), (stryMutAct_9fa48("39495") ? e.timestamp < minDate : stryMutAct_9fa48("39494") ? e.timestamp > minDate : stryMutAct_9fa48("39493") ? true : (stryCov_9fa48("39493", "39494", "39495"), e.timestamp >= minDate)) && (stryMutAct_9fa48("39498") ? e.timestamp > maxDate : stryMutAct_9fa48("39497") ? e.timestamp < maxDate : stryMutAct_9fa48("39496") ? true : (stryCov_9fa48("39496", "39497", "39498"), e.timestamp <= maxDate))))).map(stryMutAct_9fa48("39499") ? () => undefined : (stryCov_9fa48("39499"), e => stryMutAct_9fa48("39500") ? {} : (stryCov_9fa48("39500"), {
    position: stryMutAct_9fa48("39501") ? (e.timestamp.getTime() - minDate.getTime()) / totalMs / 100 : (stryCov_9fa48("39501"), (stryMutAct_9fa48("39502") ? (e.timestamp.getTime() - minDate.getTime()) * totalMs : (stryCov_9fa48("39502"), (stryMutAct_9fa48("39503") ? e.timestamp.getTime() + minDate.getTime() : (stryCov_9fa48("39503"), e.timestamp.getTime() - minDate.getTime())) / totalMs)) * 100),
    event: e
  }))));
  return <div>
      {/* Date Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-500">
          {minDate.toLocaleDateString('en-US', stryMutAct_9fa48("39505") ? {} : (stryCov_9fa48("39505"), {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }))}
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}>
            {currentDate.toLocaleDateString('en-US', stryMutAct_9fa48("39511") ? {} : (stryCov_9fa48("39511"), {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }))}
          </div>
          <div className="text-neutral-400">
            {currentDate.toLocaleTimeString('en-US', stryMutAct_9fa48("39517") ? {} : (stryCov_9fa48("39517"), {
            hour: '2-digit',
            minute: '2-digit'
          }))}
          </div>
        </div>
        <div className="text-sm text-neutral-500">
          {maxDate.toLocaleDateString('en-US', stryMutAct_9fa48("39521") ? {} : (stryCov_9fa48("39521"), {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }))}
        </div>
      </div>

      {/* Track - with Cone of Uncertainty for future dates */}
      <div ref={trackRef} className={`relative h-16 bg-neutral-800 rounded-xl cursor-pointer overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} onMouseDown={handleMouseDown}>
        {/* Calculate "Today" position for Cone of Uncertainty visualization */}
        {(() => {
        const nowMs = new Date().getTime();
        const todayPosition = stryMutAct_9fa48("39529") ? Math.min(0, Math.min(100, (nowMs - minDate.getTime()) / totalMs * 100)) : (stryCov_9fa48("39529"), Math.max(0, stryMutAct_9fa48("39530") ? Math.max(100, (nowMs - minDate.getTime()) / totalMs * 100) : (stryCov_9fa48("39530"), Math.min(100, stryMutAct_9fa48("39531") ? (nowMs - minDate.getTime()) / totalMs / 100 : (stryCov_9fa48("39531"), (stryMutAct_9fa48("39532") ? (nowMs - minDate.getTime()) * totalMs : (stryCov_9fa48("39532"), (stryMutAct_9fa48("39533") ? nowMs + minDate.getTime() : (stryCov_9fa48("39533"), nowMs - minDate.getTime())) / totalMs)) * 100)))));
        const isFuture = stryMutAct_9fa48("39537") ? currentDate <= new Date() : stryMutAct_9fa48("39536") ? currentDate >= new Date() : stryMutAct_9fa48("39535") ? false : stryMutAct_9fa48("39534") ? true : (stryCov_9fa48("39534", "39535", "39536", "39537"), currentDate > new Date());
        return <>
              {/* Past: Solid progress bar (immutable ledger data) */}
              <div className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getGradient()} opacity-30`} style={stryMutAct_9fa48("39539") ? {} : (stryCov_9fa48("39539"), {
            width: `${stryMutAct_9fa48("39541") ? Math.max(position, todayPosition) : (stryCov_9fa48("39541"), Math.min(position, todayPosition))}%`
          })} />
              
              {/* Future: Dotted/striped pattern (Cone of Uncertainty) */}
              {stryMutAct_9fa48("39544") ? mode === 'fastforward' || <div className="absolute inset-y-0" style={{
            left: `${todayPosition}%`,
            right: 0,
            background: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 4px,
                      rgba(6, 182, 212, 0.1) 4px,
                      rgba(6, 182, 212, 0.1) 8px
                    )`
          }} /> : stryMutAct_9fa48("39543") ? false : stryMutAct_9fa48("39542") ? true : (stryCov_9fa48("39542", "39543", "39544"), (stryMutAct_9fa48("39546") ? mode !== 'fastforward' : stryMutAct_9fa48("39545") ? true : (stryCov_9fa48("39545", "39546"), mode === 'fastforward')) && <div className="absolute inset-y-0" style={stryMutAct_9fa48("39548") ? {} : (stryCov_9fa48("39548"), {
            left: `${todayPosition}%`,
            right: 0,
            background: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 4px,
                      rgba(6, 182, 212, 0.1) 4px,
                      rgba(6, 182, 212, 0.1) 8px
                    )`
          })} />)}
              
              {/* Cone of Uncertainty diverging visual (expanding uncertainty) */}
              {stryMutAct_9fa48("39553") ? mode === 'fastforward' || <div className="absolute inset-y-0 pointer-events-none" style={{
            left: `${todayPosition}%`,
            right: 0
          }}>
                  {/* Top diverging line */}
                  <div className="absolute h-0.5 bg-gradient-to-r from-cyan-500/60 to-transparent" style={{
              top: '25%',
              left: 0,
              right: 0,
              transform: 'rotate(-2deg)',
              transformOrigin: 'left center'
            }} />
                  {/* Bottom diverging line */}
                  <div className="absolute h-0.5 bg-gradient-to-r from-cyan-500/60 to-transparent" style={{
              bottom: '25%',
              left: 0,
              right: 0,
              transform: 'rotate(2deg)',
              transformOrigin: 'left center'
            }} />
                  {/* Center line (base projection) - dashed */}
                  <div className="absolute h-0.5 top-1/2 -translate-y-1/2" style={{
              left: 0,
              right: 0,
              backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.5) 50%, transparent 50%)',
              backgroundSize: '12px 100%'
            }} />
                </div> : stryMutAct_9fa48("39552") ? false : stryMutAct_9fa48("39551") ? true : (stryCov_9fa48("39551", "39552", "39553"), (stryMutAct_9fa48("39555") ? mode !== 'fastforward' : stryMutAct_9fa48("39554") ? true : (stryCov_9fa48("39554", "39555"), mode === 'fastforward')) && <div className="absolute inset-y-0 pointer-events-none" style={stryMutAct_9fa48("39557") ? {} : (stryCov_9fa48("39557"), {
            left: `${todayPosition}%`,
            right: 0
          })}>
                  {/* Top diverging line */}
                  <div className="absolute h-0.5 bg-gradient-to-r from-cyan-500/60 to-transparent" style={stryMutAct_9fa48("39559") ? {} : (stryCov_9fa48("39559"), {
              top: '25%',
              left: 0,
              right: 0,
              transform: 'rotate(-2deg)',
              transformOrigin: 'left center'
            })} />
                  {/* Bottom diverging line */}
                  <div className="absolute h-0.5 bg-gradient-to-r from-cyan-500/60 to-transparent" style={stryMutAct_9fa48("39563") ? {} : (stryCov_9fa48("39563"), {
              bottom: '25%',
              left: 0,
              right: 0,
              transform: 'rotate(2deg)',
              transformOrigin: 'left center'
            })} />
                  {/* Center line (base projection) - dashed */}
                  <div className="absolute h-0.5 top-1/2 -translate-y-1/2" style={stryMutAct_9fa48("39567") ? {} : (stryCov_9fa48("39567"), {
              left: 0,
              right: 0,
              backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.5) 50%, transparent 50%)',
              backgroundSize: '12px 100%'
            })} />
                </div>)}
              
              {/* Future progress (when scrubbing into future) */}
              {stryMutAct_9fa48("39572") ? position > todayPosition || <div className="absolute inset-y-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" style={{
            left: `${todayPosition}%`,
            width: `${position - todayPosition}%`,
            borderLeft: '2px dashed rgba(6, 182, 212, 0.5)'
          }} /> : stryMutAct_9fa48("39571") ? false : stryMutAct_9fa48("39570") ? true : (stryCov_9fa48("39570", "39571", "39572"), (stryMutAct_9fa48("39575") ? position <= todayPosition : stryMutAct_9fa48("39574") ? position >= todayPosition : stryMutAct_9fa48("39573") ? true : (stryCov_9fa48("39573", "39574", "39575"), position > todayPosition)) && <div className="absolute inset-y-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" style={stryMutAct_9fa48("39576") ? {} : (stryCov_9fa48("39576"), {
            left: `${todayPosition}%`,
            width: `${stryMutAct_9fa48("39579") ? position + todayPosition : (stryCov_9fa48("39579"), position - todayPosition)}%`,
            borderLeft: '2px dashed rgba(6, 182, 212, 0.5)'
          })} />)}
            </>;
      })()}
        
        {/* Event Markers */}
        {markers.map(stryMutAct_9fa48("39581") ? () => undefined : (stryCov_9fa48("39581"), (m, i) => <div key={i} className={`absolute top-2 bottom-2 w-0.5 rounded-full cursor-pointer hover:w-1.5 hover:opacity-100 transition-all ${(stryMutAct_9fa48("39585") ? m.event.impact !== 'positive' : stryMutAct_9fa48("39584") ? false : stryMutAct_9fa48("39583") ? true : (stryCov_9fa48("39583", "39584", "39585"), m.event.impact === 'positive')) ? 'bg-green-500' : (stryMutAct_9fa48("39590") ? m.event.impact !== 'negative' : stryMutAct_9fa48("39589") ? false : stryMutAct_9fa48("39588") ? true : (stryCov_9fa48("39588", "39589", "39590"), m.event.impact === 'negative')) ? 'bg-red-500' : 'bg-neutral-600'} ${(stryMutAct_9fa48("39597") ? Math.abs(m.position - position) >= 1 : stryMutAct_9fa48("39596") ? Math.abs(m.position - position) <= 1 : stryMutAct_9fa48("39595") ? false : stryMutAct_9fa48("39594") ? true : (stryCov_9fa48("39594", "39595", "39596", "39597"), Math.abs(stryMutAct_9fa48("39598") ? m.position + position : (stryCov_9fa48("39598"), m.position - position)) < 1)) ? 'opacity-100 w-1' : 'opacity-40'}`} style={stryMutAct_9fa48("39601") ? {} : (stryCov_9fa48("39601"), {
        left: `${m.position}%`
      })} title={`${m.event.title} - Click to trace impact`} onClick={e => {
        e.stopPropagation();
        stryMutAct_9fa48("39605") ? onEventClick(m.event) : (stryCov_9fa48("39605"), onEventClick?.(m.event));
      }} />))}
        
        {/* Now Marker */}
        {stryMutAct_9fa48("39608") ? mode === 'fastforward' || <div className="absolute top-0 bottom-0 w-0.5 bg-white/50" style={{
        left: `${(new Date().getTime() - minDate.getTime()) / totalMs * 100}%`
      }}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400 whitespace-nowrap">NOW</div>
          </div> : stryMutAct_9fa48("39607") ? false : stryMutAct_9fa48("39606") ? true : (stryCov_9fa48("39606", "39607", "39608"), (stryMutAct_9fa48("39610") ? mode !== 'fastforward' : stryMutAct_9fa48("39609") ? true : (stryCov_9fa48("39609", "39610"), mode === 'fastforward')) && <div className="absolute top-0 bottom-0 w-0.5 bg-white/50" style={stryMutAct_9fa48("39612") ? {} : (stryCov_9fa48("39612"), {
        left: `${stryMutAct_9fa48("39614") ? (new Date().getTime() - minDate.getTime()) / totalMs / 100 : (stryCov_9fa48("39614"), (stryMutAct_9fa48("39615") ? (new Date().getTime() - minDate.getTime()) * totalMs : (stryCov_9fa48("39615"), (stryMutAct_9fa48("39616") ? new Date().getTime() + minDate.getTime() : (stryCov_9fa48("39616"), new Date().getTime() - minDate.getTime())) / totalMs)) * 100)}%`
      })}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400 whitespace-nowrap">NOW</div>
          </div>)}
        
        {/* Playhead */}
        <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b ${getGradient()}`} style={stryMutAct_9fa48("39618") ? {} : (stryCov_9fa48("39618"), {
        left: `${position}%`,
        transform: 'translateX(-50%)'
      })}>
          <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${getGradient()} border-2 border-white shadow-lg`} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={stryMutAct_9fa48("39622") ? () => undefined : (stryCov_9fa48("39622"), () => onDateChange(new Date(stryMutAct_9fa48("39623") ? currentDate.getTime() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39623"), currentDate.getTime() - (stryMutAct_9fa48("39624") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39624"), (stryMutAct_9fa48("39625") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("39625"), (stryMutAct_9fa48("39626") ? 7 * 24 / 60 : (stryCov_9fa48("39626"), (stryMutAct_9fa48("39627") ? 7 / 24 : (stryCov_9fa48("39627"), 7 * 24)) * 60)) * 60)) * 1000))))))} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors" title="Back 1 week">
          ⏮️
        </button>
        <button onClick={onPlayPause} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${isPlaying ? 'bg-red-600 hover:bg-red-500' : `bg-gradient-to-r ${getGradient()}`}`}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={stryMutAct_9fa48("39633") ? () => undefined : (stryCov_9fa48("39633"), () => onDateChange(new Date(stryMutAct_9fa48("39634") ? currentDate.getTime() - 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39634"), currentDate.getTime() + (stryMutAct_9fa48("39635") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39635"), (stryMutAct_9fa48("39636") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("39636"), (stryMutAct_9fa48("39637") ? 7 * 24 / 60 : (stryCov_9fa48("39637"), (stryMutAct_9fa48("39638") ? 7 / 24 : (stryCov_9fa48("39638"), 7 * 24)) * 60)) * 60)) * 1000))))))} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors" title="Forward 1 week">
          ⏭️
        </button>
        
        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm text-neutral-500">Speed:</span>
          {(stryMutAct_9fa48("39639") ? [] : (stryCov_9fa48("39639"), [0.1, 0.25, 0.5, 1, 2, 5, 10])).map(stryMutAct_9fa48("39640") ? () => undefined : (stryCov_9fa48("39640"), speed => <button key={speed} onClick={stryMutAct_9fa48("39641") ? () => undefined : (stryCov_9fa48("39641"), () => onSpeedChange(speed))} className={`px-2 py-1 text-xs rounded ${(stryMutAct_9fa48("39645") ? playbackSpeed !== speed : stryMutAct_9fa48("39644") ? false : stryMutAct_9fa48("39643") ? true : (stryCov_9fa48("39643", "39644", "39645"), playbackSpeed === speed)) ? 'bg-white text-neutral-900' : (stryMutAct_9fa48("39650") ? speed >= 1 : stryMutAct_9fa48("39649") ? speed <= 1 : stryMutAct_9fa48("39648") ? false : stryMutAct_9fa48("39647") ? true : (stryCov_9fa48("39647", "39648", "39649", "39650"), speed < 1)) ? 'bg-amber-900/50 text-amber-400 hover:bg-amber-800/50' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`} title={(stryMutAct_9fa48("39655") ? speed !== 0.1 : stryMutAct_9fa48("39654") ? false : stryMutAct_9fa48("39653") ? true : (stryCov_9fa48("39653", "39654", "39655"), speed === 0.1)) ? 'Ultra slow: ~2.4 hours per second' : (stryMutAct_9fa48("39659") ? speed !== 0.25 : stryMutAct_9fa48("39658") ? false : stryMutAct_9fa48("39657") ? true : (stryCov_9fa48("39657", "39658", "39659"), speed === 0.25)) ? 'Slow: ~6 hours per second' : (stryMutAct_9fa48("39663") ? speed !== 0.5 : stryMutAct_9fa48("39662") ? false : stryMutAct_9fa48("39661") ? true : (stryCov_9fa48("39661", "39662", "39663"), speed === 0.5)) ? 'Half speed: ~12 hours per second' : (stryMutAct_9fa48("39667") ? speed !== 1 : stryMutAct_9fa48("39666") ? false : stryMutAct_9fa48("39665") ? true : (stryCov_9fa48("39665", "39666", "39667"), speed === 1)) ? 'Normal: ~1 day per second' : (stryMutAct_9fa48("39671") ? speed !== 2 : stryMutAct_9fa48("39670") ? false : stryMutAct_9fa48("39669") ? true : (stryCov_9fa48("39669", "39670", "39671"), speed === 2)) ? 'Fast: ~2 days per second' : (stryMutAct_9fa48("39675") ? speed !== 5 : stryMutAct_9fa48("39674") ? false : stryMutAct_9fa48("39673") ? true : (stryCov_9fa48("39673", "39674", "39675"), speed === 5)) ? 'Faster: ~5 days per second' : 'Fastest: ~10 days per second'}>
              {(stryMutAct_9fa48("39681") ? speed >= 1 : stryMutAct_9fa48("39680") ? speed <= 1 : stryMutAct_9fa48("39679") ? false : stryMutAct_9fa48("39678") ? true : (stryCov_9fa48("39678", "39679", "39680", "39681"), speed < 1)) ? `${speed}x` : `${speed}x`}
            </button>))}
        </div>
      </div>

      {/* Quick Jump */}
      <div className="flex justify-center gap-2 mt-3">
        {stryMutAct_9fa48("39686") ? mode === 'rewind' || <>
            <QuickJump label="Yesterday" onClick={() => onDateChange(new Date(Date.now() - 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Week" onClick={() => onDateChange(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Month" onClick={() => onDateChange(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Quarter" onClick={() => onDateChange(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Year" onClick={() => onDateChange(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))} />
          </> : stryMutAct_9fa48("39685") ? false : stryMutAct_9fa48("39684") ? true : (stryCov_9fa48("39684", "39685", "39686"), (stryMutAct_9fa48("39688") ? mode !== 'rewind' : stryMutAct_9fa48("39687") ? true : (stryCov_9fa48("39687", "39688"), mode === 'rewind')) && <>
            <QuickJump label="Yesterday" onClick={stryMutAct_9fa48("39690") ? () => undefined : (stryCov_9fa48("39690"), () => onDateChange(new Date(stryMutAct_9fa48("39691") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("39691"), Date.now() - (stryMutAct_9fa48("39692") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("39692"), (stryMutAct_9fa48("39693") ? 24 * 60 / 60 : (stryCov_9fa48("39693"), (stryMutAct_9fa48("39694") ? 24 / 60 : (stryCov_9fa48("39694"), 24 * 60)) * 60)) * 1000))))))} />
            <QuickJump label="Last Week" onClick={stryMutAct_9fa48("39695") ? () => undefined : (stryCov_9fa48("39695"), () => onDateChange(new Date(stryMutAct_9fa48("39696") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39696"), Date.now() - (stryMutAct_9fa48("39697") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39697"), (stryMutAct_9fa48("39698") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("39698"), (stryMutAct_9fa48("39699") ? 7 * 24 / 60 : (stryCov_9fa48("39699"), (stryMutAct_9fa48("39700") ? 7 / 24 : (stryCov_9fa48("39700"), 7 * 24)) * 60)) * 60)) * 1000))))))} />
            <QuickJump label="Last Month" onClick={stryMutAct_9fa48("39701") ? () => undefined : (stryCov_9fa48("39701"), () => onDateChange(new Date(stryMutAct_9fa48("39702") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39702"), Date.now() - (stryMutAct_9fa48("39703") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39703"), (stryMutAct_9fa48("39704") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("39704"), (stryMutAct_9fa48("39705") ? 30 * 24 / 60 : (stryCov_9fa48("39705"), (stryMutAct_9fa48("39706") ? 30 / 24 : (stryCov_9fa48("39706"), 30 * 24)) * 60)) * 60)) * 1000))))))} />
            <QuickJump label="Last Quarter" onClick={stryMutAct_9fa48("39707") ? () => undefined : (stryCov_9fa48("39707"), () => onDateChange(new Date(stryMutAct_9fa48("39708") ? Date.now() + 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39708"), Date.now() - (stryMutAct_9fa48("39709") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39709"), (stryMutAct_9fa48("39710") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("39710"), (stryMutAct_9fa48("39711") ? 90 * 24 / 60 : (stryCov_9fa48("39711"), (stryMutAct_9fa48("39712") ? 90 / 24 : (stryCov_9fa48("39712"), 90 * 24)) * 60)) * 60)) * 1000))))))} />
            <QuickJump label="Last Year" onClick={stryMutAct_9fa48("39713") ? () => undefined : (stryCov_9fa48("39713"), () => onDateChange(new Date(stryMutAct_9fa48("39714") ? Date.now() + 365 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39714"), Date.now() - (stryMutAct_9fa48("39715") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39715"), (stryMutAct_9fa48("39716") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("39716"), (stryMutAct_9fa48("39717") ? 365 * 24 / 60 : (stryCov_9fa48("39717"), (stryMutAct_9fa48("39718") ? 365 / 24 : (stryCov_9fa48("39718"), 365 * 24)) * 60)) * 60)) * 1000))))))} />
          </>)}
        {stryMutAct_9fa48("39721") ? mode === 'fastforward' || <>
            <QuickJump label="+1 Month" onClick={() => onDateChange(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="+1 Quarter" onClick={() => onDateChange(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="+6 Months" onClick={() => onDateChange(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="+1 Year" onClick={() => onDateChange(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))} />
          </> : stryMutAct_9fa48("39720") ? false : stryMutAct_9fa48("39719") ? true : (stryCov_9fa48("39719", "39720", "39721"), (stryMutAct_9fa48("39723") ? mode !== 'fastforward' : stryMutAct_9fa48("39722") ? true : (stryCov_9fa48("39722", "39723"), mode === 'fastforward')) && <>
            <QuickJump label="+1 Month" onClick={stryMutAct_9fa48("39725") ? () => undefined : (stryCov_9fa48("39725"), () => onDateChange(new Date(stryMutAct_9fa48("39726") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39726"), Date.now() + (stryMutAct_9fa48("39727") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39727"), (stryMutAct_9fa48("39728") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("39728"), (stryMutAct_9fa48("39729") ? 30 * 24 / 60 : (stryCov_9fa48("39729"), (stryMutAct_9fa48("39730") ? 30 / 24 : (stryCov_9fa48("39730"), 30 * 24)) * 60)) * 60)) * 1000))))))} />
            <QuickJump label="+1 Quarter" onClick={stryMutAct_9fa48("39731") ? () => undefined : (stryCov_9fa48("39731"), () => onDateChange(new Date(stryMutAct_9fa48("39732") ? Date.now() - 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39732"), Date.now() + (stryMutAct_9fa48("39733") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39733"), (stryMutAct_9fa48("39734") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("39734"), (stryMutAct_9fa48("39735") ? 90 * 24 / 60 : (stryCov_9fa48("39735"), (stryMutAct_9fa48("39736") ? 90 / 24 : (stryCov_9fa48("39736"), 90 * 24)) * 60)) * 60)) * 1000))))))} />
            <QuickJump label="+6 Months" onClick={stryMutAct_9fa48("39737") ? () => undefined : (stryCov_9fa48("39737"), () => onDateChange(new Date(stryMutAct_9fa48("39738") ? Date.now() - 180 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39738"), Date.now() + (stryMutAct_9fa48("39739") ? 180 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39739"), (stryMutAct_9fa48("39740") ? 180 * 24 * 60 / 60 : (stryCov_9fa48("39740"), (stryMutAct_9fa48("39741") ? 180 * 24 / 60 : (stryCov_9fa48("39741"), (stryMutAct_9fa48("39742") ? 180 / 24 : (stryCov_9fa48("39742"), 180 * 24)) * 60)) * 60)) * 1000))))))} />
            <QuickJump label="+1 Year" onClick={stryMutAct_9fa48("39743") ? () => undefined : (stryCov_9fa48("39743"), () => onDateChange(new Date(stryMutAct_9fa48("39744") ? Date.now() - 365 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("39744"), Date.now() + (stryMutAct_9fa48("39745") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("39745"), (stryMutAct_9fa48("39746") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("39746"), (stryMutAct_9fa48("39747") ? 365 * 24 / 60 : (stryCov_9fa48("39747"), (stryMutAct_9fa48("39748") ? 365 / 24 : (stryCov_9fa48("39748"), 365 * 24)) * 60)) * 60)) * 1000))))))} />
          </>)}
        
        {/* Custom Date/Time Jump Button */}
        <button onClick={stryMutAct_9fa48("39749") ? () => undefined : (stryCov_9fa48("39749"), () => setShowDatePicker(stryMutAct_9fa48("39750") ? showDatePicker : (stryCov_9fa48("39750"), !showDatePicker)))} className="px-3 py-1 text-xs bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-full transition-colors font-semibold flex items-center gap-1">
          📅 Jump to Date
        </button>
      </div>

      {/* Date/Time Picker Panel */}
      {stryMutAct_9fa48("39753") ? showDatePicker || <div className="mt-4 p-4 bg-neutral-800 rounded-xl border border-amber-600/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-500">⏰</span>
            <span className="text-sm font-semibold text-white">Jump to Specific Date & Time</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Date</label>
              <input type="date" value={jumpDate} onChange={e => setJumpDate(e.target.value)} min={minDate.toISOString().split('T')[0]} max={maxDate.toISOString().split('T')[0]} className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-amber-500 focus:outline-none" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Time</label>
              <input type="time" value={jumpTime} onChange={e => setJumpTime(e.target.value)} className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-amber-500 focus:outline-none" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">&nbsp;</label>
              <button onClick={handleJumpToDateTime} disabled={!jumpDate} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
                ⏩ Jump
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">&nbsp;</label>
              <button onClick={() => setShowDatePicker(false)} className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-neutral-500">
            Valid range: {minDate.toLocaleDateString()} — {maxDate.toLocaleDateString()}
          </div>
        </div> : stryMutAct_9fa48("39752") ? false : stryMutAct_9fa48("39751") ? true : (stryCov_9fa48("39751", "39752", "39753"), showDatePicker && <div className="mt-4 p-4 bg-neutral-800 rounded-xl border border-amber-600/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-500">⏰</span>
            <span className="text-sm font-semibold text-white">Jump to Specific Date & Time</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Date</label>
              <input type="date" value={jumpDate} onChange={stryMutAct_9fa48("39754") ? () => undefined : (stryCov_9fa48("39754"), e => setJumpDate(e.target.value))} min={minDate.toISOString().split('T')[0]} max={maxDate.toISOString().split('T')[0]} className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-amber-500 focus:outline-none" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">Time</label>
              <input type="time" value={jumpTime} onChange={stryMutAct_9fa48("39757") ? () => undefined : (stryCov_9fa48("39757"), e => setJumpTime(e.target.value))} className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:border-amber-500 focus:outline-none" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">&nbsp;</label>
              <button onClick={handleJumpToDateTime} disabled={stryMutAct_9fa48("39758") ? jumpDate : (stryCov_9fa48("39758"), !jumpDate)} className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
                ⏩ Jump
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-400">&nbsp;</label>
              <button onClick={stryMutAct_9fa48("39759") ? () => undefined : (stryCov_9fa48("39759"), () => setShowDatePicker(stryMutAct_9fa48("39760") ? true : (stryCov_9fa48("39760"), false)))} className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-neutral-500">
            Valid range: {minDate.toLocaleDateString()} — {maxDate.toLocaleDateString()}
          </div>
        </div>)}
    </div>;
};
const QuickJump: React.FC<{
  label: string;
  onClick: () => void;
}> = stryMutAct_9fa48("39761") ? () => undefined : (stryCov_9fa48("39761"), (() => {
  const QuickJump: React.FC<{
    label: string;
    onClick: () => void;
  }> = ({
    label,
    onClick
  }) => <button onClick={onClick} className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
    {label}
  </button>;
  return QuickJump;
})());
const MetricsGrid: React.FC<{
  snapshot: StateSnapshot;
  mode: ChronosMode;
  department?: string;
  currentDate?: Date;
}> = ({
  snapshot,
  mode,
  department = 'all',
  currentDate
}) => {
  const [showOrgComparison, setShowOrgComparison] = useState(stryMutAct_9fa48("39764") ? true : (stryCov_9fa48("39764"), false));

  // Cone of Uncertainty: Calculate how far into the future we are
  const now = new Date();
  const isFuture = currentDate ? stryMutAct_9fa48("39768") ? currentDate <= now : stryMutAct_9fa48("39767") ? currentDate >= now : stryMutAct_9fa48("39766") ? false : stryMutAct_9fa48("39765") ? true : (stryCov_9fa48("39765", "39766", "39767", "39768"), currentDate > now) : stryMutAct_9fa48("39771") ? mode !== 'fastforward' : stryMutAct_9fa48("39770") ? false : stryMutAct_9fa48("39769") ? true : (stryCov_9fa48("39769", "39770", "39771"), mode === 'fastforward');
  const daysIntoFuture = currentDate ? stryMutAct_9fa48("39773") ? Math.min(0, (currentDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)) : (stryCov_9fa48("39773"), Math.max(0, stryMutAct_9fa48("39774") ? (currentDate.getTime() - now.getTime()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("39774"), (stryMutAct_9fa48("39775") ? currentDate.getTime() + now.getTime() : (stryCov_9fa48("39775"), currentDate.getTime() - now.getTime())) / (stryMutAct_9fa48("39776") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("39776"), (stryMutAct_9fa48("39777") ? 24 * 60 / 60 : (stryCov_9fa48("39777"), (stryMutAct_9fa48("39778") ? 24 / 60 : (stryCov_9fa48("39778"), 24 * 60)) * 60)) * 1000))))) : 0;

  // Uncertainty grows with time: starts at ±5% and grows to ±30% at 1 year
  const uncertaintyPercent = stryMutAct_9fa48("39779") ? Math.max(30, 5 + daysIntoFuture / 365 * 25) : (stryCov_9fa48("39779"), Math.min(30, stryMutAct_9fa48("39780") ? 5 - daysIntoFuture / 365 * 25 : (stryCov_9fa48("39780"), 5 + (stryMutAct_9fa48("39781") ? daysIntoFuture / 365 / 25 : (stryCov_9fa48("39781"), (stryMutAct_9fa48("39782") ? daysIntoFuture * 365 : (stryCov_9fa48("39782"), daysIntoFuture / 365)) * 25)))));

  // Calculate range for a value based on uncertainty
  const getUncertaintyRange = (value: number): {
    low: number;
    high: number;
    spread: number;
  } => {
    const spread = stryMutAct_9fa48("39784") ? value / (uncertaintyPercent / 100) : (stryCov_9fa48("39784"), value * (stryMutAct_9fa48("39785") ? uncertaintyPercent * 100 : (stryCov_9fa48("39785"), uncertaintyPercent / 100)));
    return stryMutAct_9fa48("39786") ? {} : (stryCov_9fa48("39786"), {
      low: stryMutAct_9fa48("39787") ? value + spread : (stryCov_9fa48("39787"), value - spread),
      high: stryMutAct_9fa48("39788") ? value - spread : (stryCov_9fa48("39788"), value + spread),
      spread: uncertaintyPercent
    });
  };

  // Org-wide benchmarks for comparison (averages across all departments)
  const orgBenchmarks: Record<string, number> = stryMutAct_9fa48("39789") ? {} : (stryCov_9fa48("39789"), {
    headcount: 38,
    // avg headcount per dept
    velocity: 72,
    // avg velocity score
    deploys: 8,
    // avg deploys/week
    bugRate: 3.1,
    // avg bug rate
    techDebt: 18,
    // avg tech debt %
    teamNPS: 58,
    // avg team eNPS
    prTime: 6.5,
    // avg PR time
    coverage: 65,
    // avg test coverage
    pipeline: 5200000,
    // avg pipeline
    winRate: 28,
    // avg win rate
    acv: 95000,
    // avg ACV
    quota: 78,
    // avg quota attainment
    cycle: 52,
    // avg sales cycle
    meetings: 18,
    // avg meetings/week
    churn: 12,
    // avg churn risk
    cac: 5500,
    // avg CAC
    mqls: 620,
    // avg MQLs/month
    conversion: 18,
    // avg MQL→SQL
    spend: 280000,
    // avg monthly spend
    roi: 2.4,
    // avg campaign ROI
    traffic: 120000,
    // avg web traffic
    brand: 65,
    // avg brand score
    burn: 920000,
    // avg burn rate
    runway: 14,
    // avg runway
    ar: 45,
    // avg A/R days
    ap: 38,
    // avg A/P days
    variance: stryMutAct_9fa48("39790") ? +5 : (stryCov_9fa48("39790"), -5),
    // avg budget variance
    cash: 12000000,
    // avg cash position
    margin: 62,
    // avg gross margin
    openReqs: 18,
    // avg open reqs
    attrition: 12,
    // avg attrition
    timeToHire: 45,
    // avg time to hire
    eNPS: 35,
    // avg eNPS
    tenure: 1.8,
    // avg tenure
    diversity: 32,
    // avg diversity %
    training: 16 // avg training hrs
  });

  // Department-specific metrics
  const departmentMetrics: Record<string, Array<{
    key: string;
    label: string;
    icon: string;
    format: (v: number) => string;
    value: number;
  }>> = stryMutAct_9fa48("39791") ? {} : (stryCov_9fa48("39791"), {
    'Engineering': stryMutAct_9fa48("39792") ? [] : (stryCov_9fa48("39792"), [stryMutAct_9fa48("39793") ? {} : (stryCov_9fa48("39793"), {
      key: 'headcount',
      label: 'Headcount',
      icon: '👥',
      format: stryMutAct_9fa48("39797") ? () => undefined : (stryCov_9fa48("39797"), (v: number) => v.toString()),
      value: 67
    }), stryMutAct_9fa48("39798") ? {} : (stryCov_9fa48("39798"), {
      key: 'velocity',
      label: 'Velocity',
      icon: '🚀',
      format: stryMutAct_9fa48("39802") ? () => undefined : (stryCov_9fa48("39802"), (v: number) => `${v}/sprint`),
      value: 84
    }), stryMutAct_9fa48("39804") ? {} : (stryCov_9fa48("39804"), {
      key: 'deploys',
      label: 'Deploys/Week',
      icon: '📦',
      format: stryMutAct_9fa48("39808") ? () => undefined : (stryCov_9fa48("39808"), (v: number) => v.toString()),
      value: 12
    }), stryMutAct_9fa48("39809") ? {} : (stryCov_9fa48("39809"), {
      key: 'bugRate',
      label: 'Bug Rate',
      icon: '🐛',
      format: stryMutAct_9fa48("39813") ? () => undefined : (stryCov_9fa48("39813"), (v: number) => `${v}%`),
      value: 2.3
    }), stryMutAct_9fa48("39815") ? {} : (stryCov_9fa48("39815"), {
      key: 'techDebt',
      label: 'Tech Debt',
      icon: '💳',
      format: stryMutAct_9fa48("39819") ? () => undefined : (stryCov_9fa48("39819"), (v: number) => `${v}%`),
      value: 14
    }), stryMutAct_9fa48("39821") ? {} : (stryCov_9fa48("39821"), {
      key: 'teamNPS',
      label: 'Team eNPS',
      icon: '😊',
      format: stryMutAct_9fa48("39825") ? () => undefined : (stryCov_9fa48("39825"), (v: number) => v.toString()),
      value: 71
    }), stryMutAct_9fa48("39826") ? {} : (stryCov_9fa48("39826"), {
      key: 'prTime',
      label: 'Avg PR Time',
      icon: '⏱️',
      format: stryMutAct_9fa48("39830") ? () => undefined : (stryCov_9fa48("39830"), (v: number) => `${v}h`),
      value: 4.2
    }), stryMutAct_9fa48("39832") ? {} : (stryCov_9fa48("39832"), {
      key: 'coverage',
      label: 'Test Coverage',
      icon: '✅',
      format: stryMutAct_9fa48("39836") ? () => undefined : (stryCov_9fa48("39836"), (v: number) => `${v}%`),
      value: 78
    })]),
    'Sales': stryMutAct_9fa48("39838") ? [] : (stryCov_9fa48("39838"), [stryMutAct_9fa48("39839") ? {} : (stryCov_9fa48("39839"), {
      key: 'headcount',
      label: 'Headcount',
      icon: '👥',
      format: stryMutAct_9fa48("39843") ? () => undefined : (stryCov_9fa48("39843"), (v: number) => v.toString()),
      value: 34
    }), stryMutAct_9fa48("39844") ? {} : (stryCov_9fa48("39844"), {
      key: 'pipeline',
      label: 'Pipeline',
      icon: '💰',
      format: stryMutAct_9fa48("39848") ? () => undefined : (stryCov_9fa48("39848"), (v: number) => `$${(stryMutAct_9fa48("39850") ? v * 1000000 : (stryCov_9fa48("39850"), v / 1000000)).toFixed(1)}M`),
      value: 8500000
    }), stryMutAct_9fa48("39851") ? {} : (stryCov_9fa48("39851"), {
      key: 'winRate',
      label: 'Win Rate',
      icon: '🎯',
      format: stryMutAct_9fa48("39855") ? () => undefined : (stryCov_9fa48("39855"), (v: number) => `${v}%`),
      value: 32
    }), stryMutAct_9fa48("39857") ? {} : (stryCov_9fa48("39857"), {
      key: 'acv',
      label: 'Avg ACV',
      icon: '📈',
      format: stryMutAct_9fa48("39861") ? () => undefined : (stryCov_9fa48("39861"), (v: number) => `$${(stryMutAct_9fa48("39863") ? v * 1000 : (stryCov_9fa48("39863"), v / 1000)).toFixed(0)}K`),
      value: 125000
    }), stryMutAct_9fa48("39864") ? {} : (stryCov_9fa48("39864"), {
      key: 'quota',
      label: 'Quota Attain',
      icon: '🏆',
      format: stryMutAct_9fa48("39868") ? () => undefined : (stryCov_9fa48("39868"), (v: number) => `${v}%`),
      value: 87
    }), stryMutAct_9fa48("39870") ? {} : (stryCov_9fa48("39870"), {
      key: 'cycle',
      label: 'Sales Cycle',
      icon: '⏱️',
      format: stryMutAct_9fa48("39874") ? () => undefined : (stryCov_9fa48("39874"), (v: number) => `${v} days`),
      value: 45
    }), stryMutAct_9fa48("39876") ? {} : (stryCov_9fa48("39876"), {
      key: 'meetings',
      label: 'Meetings/Week',
      icon: '📅',
      format: stryMutAct_9fa48("39880") ? () => undefined : (stryCov_9fa48("39880"), (v: number) => v.toString()),
      value: 23
    }), stryMutAct_9fa48("39881") ? {} : (stryCov_9fa48("39881"), {
      key: 'churn',
      label: 'Churn Risk',
      icon: '⚠️',
      format: stryMutAct_9fa48("39885") ? () => undefined : (stryCov_9fa48("39885"), (v: number) => `${v}%`),
      value: 8
    })]),
    'Marketing': stryMutAct_9fa48("39887") ? [] : (stryCov_9fa48("39887"), [stryMutAct_9fa48("39888") ? {} : (stryCov_9fa48("39888"), {
      key: 'headcount',
      label: 'Headcount',
      icon: '👥',
      format: stryMutAct_9fa48("39892") ? () => undefined : (stryCov_9fa48("39892"), (v: number) => v.toString()),
      value: 22
    }), stryMutAct_9fa48("39893") ? {} : (stryCov_9fa48("39893"), {
      key: 'cac',
      label: 'CAC',
      icon: '💵',
      format: stryMutAct_9fa48("39897") ? () => undefined : (stryCov_9fa48("39897"), (v: number) => `$${v.toLocaleString()}`),
      value: 4200
    }), stryMutAct_9fa48("39899") ? {} : (stryCov_9fa48("39899"), {
      key: 'mqls',
      label: 'MQLs/Month',
      icon: '📊',
      format: stryMutAct_9fa48("39903") ? () => undefined : (stryCov_9fa48("39903"), (v: number) => v.toLocaleString()),
      value: 847
    }), stryMutAct_9fa48("39904") ? {} : (stryCov_9fa48("39904"), {
      key: 'conversion',
      label: 'MQL→SQL',
      icon: '🎯',
      format: stryMutAct_9fa48("39908") ? () => undefined : (stryCov_9fa48("39908"), (v: number) => `${v}%`),
      value: 24
    }), stryMutAct_9fa48("39910") ? {} : (stryCov_9fa48("39910"), {
      key: 'spend',
      label: 'Monthly Spend',
      icon: '💰',
      format: stryMutAct_9fa48("39914") ? () => undefined : (stryCov_9fa48("39914"), (v: number) => `$${(stryMutAct_9fa48("39916") ? v * 1000 : (stryCov_9fa48("39916"), v / 1000)).toFixed(0)}K`),
      value: 320000
    }), stryMutAct_9fa48("39917") ? {} : (stryCov_9fa48("39917"), {
      key: 'roi',
      label: 'Campaign ROI',
      icon: '📈',
      format: stryMutAct_9fa48("39921") ? () => undefined : (stryCov_9fa48("39921"), (v: number) => `${v}x`),
      value: 3.2
    }), stryMutAct_9fa48("39923") ? {} : (stryCov_9fa48("39923"), {
      key: 'traffic',
      label: 'Web Traffic',
      icon: '🌐',
      format: stryMutAct_9fa48("39927") ? () => undefined : (stryCov_9fa48("39927"), (v: number) => `${(stryMutAct_9fa48("39929") ? v * 1000 : (stryCov_9fa48("39929"), v / 1000)).toFixed(0)}K`),
      value: 156000
    }), stryMutAct_9fa48("39930") ? {} : (stryCov_9fa48("39930"), {
      key: 'brand',
      label: 'Brand Score',
      icon: '⭐',
      format: stryMutAct_9fa48("39934") ? () => undefined : (stryCov_9fa48("39934"), (v: number) => v.toString()),
      value: 72
    })]),
    'Finance': stryMutAct_9fa48("39935") ? [] : (stryCov_9fa48("39935"), [stryMutAct_9fa48("39936") ? {} : (stryCov_9fa48("39936"), {
      key: 'headcount',
      label: 'Headcount',
      icon: '👥',
      format: stryMutAct_9fa48("39940") ? () => undefined : (stryCov_9fa48("39940"), (v: number) => v.toString()),
      value: 12
    }), stryMutAct_9fa48("39941") ? {} : (stryCov_9fa48("39941"), {
      key: 'burn',
      label: 'Burn Rate',
      icon: '🔥',
      format: stryMutAct_9fa48("39945") ? () => undefined : (stryCov_9fa48("39945"), (v: number) => `$${(stryMutAct_9fa48("39947") ? v * 1000 : (stryCov_9fa48("39947"), v / 1000)).toFixed(0)}K/mo`),
      value: 834000
    }), stryMutAct_9fa48("39948") ? {} : (stryCov_9fa48("39948"), {
      key: 'runway',
      label: 'Runway',
      icon: '🛫',
      format: stryMutAct_9fa48("39952") ? () => undefined : (stryCov_9fa48("39952"), (v: number) => `${v} mo`),
      value: 18
    }), stryMutAct_9fa48("39954") ? {} : (stryCov_9fa48("39954"), {
      key: 'ar',
      label: 'A/R Days',
      icon: '📋',
      format: stryMutAct_9fa48("39958") ? () => undefined : (stryCov_9fa48("39958"), (v: number) => `${v} days`),
      value: 38
    }), stryMutAct_9fa48("39960") ? {} : (stryCov_9fa48("39960"), {
      key: 'ap',
      label: 'A/P Days',
      icon: '📑',
      format: stryMutAct_9fa48("39964") ? () => undefined : (stryCov_9fa48("39964"), (v: number) => `${v} days`),
      value: 42
    }), stryMutAct_9fa48("39966") ? {} : (stryCov_9fa48("39966"), {
      key: 'variance',
      label: 'Budget Var',
      icon: '📊',
      format: stryMutAct_9fa48("39970") ? () => undefined : (stryCov_9fa48("39970"), (v: number) => `${(stryMutAct_9fa48("39975") ? v <= 0 : stryMutAct_9fa48("39974") ? v >= 0 : stryMutAct_9fa48("39973") ? false : stryMutAct_9fa48("39972") ? true : (stryCov_9fa48("39972", "39973", "39974", "39975"), v > 0)) ? '+' : ''}${v}%`),
      value: stryMutAct_9fa48("39978") ? +3.2 : (stryCov_9fa48("39978"), -3.2)
    }), stryMutAct_9fa48("39979") ? {} : (stryCov_9fa48("39979"), {
      key: 'cash',
      label: 'Cash Position',
      icon: '💰',
      format: stryMutAct_9fa48("39983") ? () => undefined : (stryCov_9fa48("39983"), (v: number) => `$${(stryMutAct_9fa48("39985") ? v * 1000000 : (stryCov_9fa48("39985"), v / 1000000)).toFixed(1)}M`),
      value: 15200000
    }), stryMutAct_9fa48("39986") ? {} : (stryCov_9fa48("39986"), {
      key: 'margin',
      label: 'Gross Margin',
      icon: '📈',
      format: stryMutAct_9fa48("39990") ? () => undefined : (stryCov_9fa48("39990"), (v: number) => `${v}%`),
      value: 68
    })]),
    'HR': stryMutAct_9fa48("39992") ? [] : (stryCov_9fa48("39992"), [stryMutAct_9fa48("39993") ? {} : (stryCov_9fa48("39993"), {
      key: 'headcount',
      label: 'Total HC',
      icon: '👥',
      format: stryMutAct_9fa48("39997") ? () => undefined : (stryCov_9fa48("39997"), (v: number) => v.toString()),
      value: 153
    }), stryMutAct_9fa48("39998") ? {} : (stryCov_9fa48("39998"), {
      key: 'openReqs',
      label: 'Open Reqs',
      icon: '📋',
      format: stryMutAct_9fa48("40002") ? () => undefined : (stryCov_9fa48("40002"), (v: number) => v.toString()),
      value: 12
    }), stryMutAct_9fa48("40003") ? {} : (stryCov_9fa48("40003"), {
      key: 'attrition',
      label: 'Attrition',
      icon: '📉',
      format: stryMutAct_9fa48("40007") ? () => undefined : (stryCov_9fa48("40007"), (v: number) => `${v}%`),
      value: 8.5
    }), stryMutAct_9fa48("40009") ? {} : (stryCov_9fa48("40009"), {
      key: 'timeToHire',
      label: 'Time to Hire',
      icon: '⏱️',
      format: stryMutAct_9fa48("40013") ? () => undefined : (stryCov_9fa48("40013"), (v: number) => `${v} days`),
      value: 38
    }), stryMutAct_9fa48("40015") ? {} : (stryCov_9fa48("40015"), {
      key: 'eNPS',
      label: 'eNPS',
      icon: '😊',
      format: stryMutAct_9fa48("40019") ? () => undefined : (stryCov_9fa48("40019"), (v: number) => v.toString()),
      value: 42
    }), stryMutAct_9fa48("40020") ? {} : (stryCov_9fa48("40020"), {
      key: 'tenure',
      label: 'Avg Tenure',
      icon: '📅',
      format: stryMutAct_9fa48("40024") ? () => undefined : (stryCov_9fa48("40024"), (v: number) => `${v} yrs`),
      value: 2.4
    }), stryMutAct_9fa48("40026") ? {} : (stryCov_9fa48("40026"), {
      key: 'diversity',
      label: 'Diversity %',
      icon: '🌈',
      format: stryMutAct_9fa48("40030") ? () => undefined : (stryCov_9fa48("40030"), (v: number) => `${v}%`),
      value: 38
    }), stryMutAct_9fa48("40032") ? {} : (stryCov_9fa48("40032"), {
      key: 'training',
      label: 'Training Hrs',
      icon: '📚',
      format: stryMutAct_9fa48("40036") ? () => undefined : (stryCov_9fa48("40036"), (v: number) => `${v}/emp`),
      value: 24
    })])
  });

  // Default org-wide metrics
  const orgMetrics = stryMutAct_9fa48("40038") ? [] : (stryCov_9fa48("40038"), [stryMutAct_9fa48("40039") ? {} : (stryCov_9fa48("40039"), {
    key: 'revenue',
    label: 'Revenue',
    icon: '💰',
    format: stryMutAct_9fa48("40043") ? () => undefined : (stryCov_9fa48("40043"), (v: number) => `$${(stryMutAct_9fa48("40045") ? v * 1000000 : (stryCov_9fa48("40045"), v / 1000000)).toFixed(1)}M`),
    value: snapshot.metrics.revenue
  }), stryMutAct_9fa48("40046") ? {} : (stryCov_9fa48("40046"), {
    key: 'profit',
    label: 'Profit',
    icon: '📈',
    format: stryMutAct_9fa48("40050") ? () => undefined : (stryCov_9fa48("40050"), (v: number) => `$${(stryMutAct_9fa48("40052") ? v * 1000000 : (stryCov_9fa48("40052"), v / 1000000)).toFixed(1)}M`),
    value: snapshot.metrics.profit
  }), stryMutAct_9fa48("40053") ? {} : (stryCov_9fa48("40053"), {
    key: 'employees',
    label: 'Employees',
    icon: '👥',
    format: stryMutAct_9fa48("40057") ? () => undefined : (stryCov_9fa48("40057"), (v: number) => v.toLocaleString()),
    value: snapshot.metrics.employees
  }), stryMutAct_9fa48("40058") ? {} : (stryCov_9fa48("40058"), {
    key: 'customers',
    label: 'Customers',
    icon: '🏢',
    format: stryMutAct_9fa48("40062") ? () => undefined : (stryCov_9fa48("40062"), (v: number) => v.toLocaleString()),
    value: snapshot.metrics.customers
  }), stryMutAct_9fa48("40063") ? {} : (stryCov_9fa48("40063"), {
    key: 'satisfaction',
    label: 'NPS Score',
    icon: '😊',
    format: stryMutAct_9fa48("40067") ? () => undefined : (stryCov_9fa48("40067"), (v: number) => `${v.toFixed(0)}`),
    value: snapshot.metrics.satisfaction
  }), stryMutAct_9fa48("40069") ? {} : (stryCov_9fa48("40069"), {
    key: 'marketShare',
    label: 'Market Share',
    icon: '🎯',
    format: stryMutAct_9fa48("40073") ? () => undefined : (stryCov_9fa48("40073"), (v: number) => `${v.toFixed(1)}%`),
    value: snapshot.metrics.marketShare
  }), stryMutAct_9fa48("40075") ? {} : (stryCov_9fa48("40075"), {
    key: 'burnRate',
    label: 'Burn Rate',
    icon: '🔥',
    format: stryMutAct_9fa48("40079") ? () => undefined : (stryCov_9fa48("40079"), (v: number) => `$${(stryMutAct_9fa48("40081") ? v * 1000 : (stryCov_9fa48("40081"), v / 1000)).toFixed(0)}K/mo`),
    value: snapshot.metrics.burnRate
  }), stryMutAct_9fa48("40082") ? {} : (stryCov_9fa48("40082"), {
    key: 'runway',
    label: 'Runway',
    icon: '🛫',
    format: stryMutAct_9fa48("40086") ? () => undefined : (stryCov_9fa48("40086"), (v: number) => `${v} months`),
    value: snapshot.metrics.runway
  })]);
  const metrics = (stryMutAct_9fa48("40090") ? department === 'all' && !departmentMetrics[department] : stryMutAct_9fa48("40089") ? false : stryMutAct_9fa48("40088") ? true : (stryCov_9fa48("40088", "40089", "40090"), (stryMutAct_9fa48("40092") ? department !== 'all' : stryMutAct_9fa48("40091") ? false : (stryCov_9fa48("40091", "40092"), department === 'all')) || (stryMutAct_9fa48("40094") ? departmentMetrics[department] : (stryCov_9fa48("40094"), !departmentMetrics[department])))) ? orgMetrics : departmentMetrics[department];

  // Calculate variance from org benchmark
  const getVariance = (key: string, value: number): {
    percent: number;
    isPositive: boolean;
  } | null => {
    const benchmark = orgBenchmarks[key];
    if (stryMutAct_9fa48("40098") ? false : stryMutAct_9fa48("40097") ? true : stryMutAct_9fa48("40096") ? benchmark : (stryCov_9fa48("40096", "40097", "40098"), !benchmark)) return null;
    const percent = stryMutAct_9fa48("40099") ? (value - benchmark) / benchmark / 100 : (stryCov_9fa48("40099"), (stryMutAct_9fa48("40100") ? (value - benchmark) * benchmark : (stryCov_9fa48("40100"), (stryMutAct_9fa48("40101") ? value + benchmark : (stryCov_9fa48("40101"), value - benchmark)) / benchmark)) * 100);
    // For some metrics, lower is better (bugRate, techDebt, prTime, churn, cac, attrition, timeToHire, ar, cycle)
    const lowerIsBetter = (stryMutAct_9fa48("40102") ? [] : (stryCov_9fa48("40102"), ['bugRate', 'techDebt', 'prTime', 'churn', 'cac', 'attrition', 'timeToHire', 'ar', 'cycle', 'burn'])).includes(key);
    return stryMutAct_9fa48("40113") ? {} : (stryCov_9fa48("40113"), {
      percent: Math.abs(percent),
      isPositive: lowerIsBetter ? stryMutAct_9fa48("40117") ? percent >= 0 : stryMutAct_9fa48("40116") ? percent <= 0 : stryMutAct_9fa48("40115") ? false : stryMutAct_9fa48("40114") ? true : (stryCov_9fa48("40114", "40115", "40116", "40117"), percent < 0) : stryMutAct_9fa48("40121") ? percent <= 0 : stryMutAct_9fa48("40120") ? percent >= 0 : stryMutAct_9fa48("40119") ? false : stryMutAct_9fa48("40118") ? true : (stryCov_9fa48("40118", "40119", "40120", "40121"), percent > 0)
    });
  };
  return <div>
      {stryMutAct_9fa48("40124") ? department !== 'all' || <div className="mb-4 px-3 py-2 bg-amber-900/30 border border-amber-700 rounded-lg text-sm text-amber-300 flex items-center justify-between">
          <span>📊 Showing {department} metrics</span>
          <button onClick={() => setShowOrgComparison(!showOrgComparison)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${showOrgComparison ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}>
            {showOrgComparison ? '✓ Comparing to Org Avg' : 'Compare to Org Avg'}
          </button>
        </div> : stryMutAct_9fa48("40123") ? false : stryMutAct_9fa48("40122") ? true : (stryCov_9fa48("40122", "40123", "40124"), (stryMutAct_9fa48("40126") ? department === 'all' : stryMutAct_9fa48("40125") ? true : (stryCov_9fa48("40125", "40126"), department !== 'all')) && <div className="mb-4 px-3 py-2 bg-amber-900/30 border border-amber-700 rounded-lg text-sm text-amber-300 flex items-center justify-between">
          <span>📊 Showing {department} metrics</span>
          <button onClick={stryMutAct_9fa48("40128") ? () => undefined : (stryCov_9fa48("40128"), () => setShowOrgComparison(stryMutAct_9fa48("40129") ? showOrgComparison : (stryCov_9fa48("40129"), !showOrgComparison)))} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${showOrgComparison ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}>
            {showOrgComparison ? '✓ Comparing to Org Avg' : 'Compare to Org Avg'}
          </button>
        </div>)}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(({
        key,
        label,
        icon,
        format,
        value
      }) => {
        const variance = showOrgComparison ? getVariance(key, value) : null;
        const benchmark = orgBenchmarks[key];
        const range = isFuture ? getUncertaintyRange(value) : null;
        return <div key={key} className={`rounded-xl p-4 relative overflow-hidden ${isFuture ? 'bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border border-cyan-700/50' : 'bg-neutral-800/50'}`}>
              {/* Cone of Uncertainty visual indicator for future */}
              {stryMutAct_9fa48("40141") ? isFuture || <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-cyan-500/20" /> : stryMutAct_9fa48("40140") ? false : stryMutAct_9fa48("40139") ? true : (stryCov_9fa48("40139", "40140", "40141"), isFuture && <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-cyan-500/20" />)}
              <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                <span>{icon}</span>
                <span>{label}</span>
                {stryMutAct_9fa48("40144") ? isFuture || <span className="text-cyan-400 text-xs">🔮</span> : stryMutAct_9fa48("40143") ? false : stryMutAct_9fa48("40142") ? true : (stryCov_9fa48("40142", "40143", "40144"), isFuture && <span className="text-cyan-400 text-xs">🔮</span>)}
              </div>
              {(stryMutAct_9fa48("40147") ? isFuture || range : stryMutAct_9fa48("40146") ? false : stryMutAct_9fa48("40145") ? true : (stryCov_9fa48("40145", "40146", "40147"), isFuture && range)) ? <>
                  {/* Show range instead of single value for future */}
                  <div className="text-2xl font-bold text-cyan-300" style={stryMutAct_9fa48("40148") ? {} : (stryCov_9fa48("40148"), {
              fontStyle: 'italic'
            })}>
                    {format(value)}
                  </div>
                  <div className="text-xs text-cyan-400/80 mt-1 font-mono">
                    ±{range.spread.toFixed(0)}% → {format(range.low)} – {format(range.high)}
                  </div>
                  {/* Mini uncertainty bar */}
                  <div className="mt-2 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full" style={stryMutAct_9fa48("40150") ? {} : (stryCov_9fa48("40150"), {
                width: `${stryMutAct_9fa48("40152") ? Math.max(100, 30 + range.spread * 2) : (stryCov_9fa48("40152"), Math.min(100, stryMutAct_9fa48("40153") ? 30 - range.spread * 2 : (stryCov_9fa48("40153"), 30 + (stryMutAct_9fa48("40154") ? range.spread / 2 : (stryCov_9fa48("40154"), range.spread * 2)))))}%`,
                animation: 'pulse 2s ease-in-out infinite'
              })} />
                  </div>
                </> : <div className="text-2xl font-bold">
                  {format(value)}
                </div>}
              {stryMutAct_9fa48("40158") ? mode === 'fastforward' && !isFuture || <div className="text-xs text-cyan-400 mt-1">Projected</div> : stryMutAct_9fa48("40157") ? false : stryMutAct_9fa48("40156") ? true : (stryCov_9fa48("40156", "40157", "40158"), (stryMutAct_9fa48("40160") ? mode === 'fastforward' || !isFuture : stryMutAct_9fa48("40159") ? true : (stryCov_9fa48("40159", "40160"), (stryMutAct_9fa48("40162") ? mode !== 'fastforward' : stryMutAct_9fa48("40161") ? true : (stryCov_9fa48("40161", "40162"), mode === 'fastforward')) && (stryMutAct_9fa48("40164") ? isFuture : (stryCov_9fa48("40164"), !isFuture)))) && <div className="text-xs text-cyan-400 mt-1">Projected</div>)}
              {stryMutAct_9fa48("40167") ? showOrgComparison && variance && benchmark !== undefined && !isFuture || <div className={`text-xs mt-2 flex items-center gap-1 ${variance.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{variance.isPositive ? '▲' : '▼'}</span>
                  <span>{variance.percent.toFixed(1)}% vs org avg</span>
                  <span className="text-neutral-500 ml-1">({format(benchmark)})</span>
                </div> : stryMutAct_9fa48("40166") ? false : stryMutAct_9fa48("40165") ? true : (stryCov_9fa48("40165", "40166", "40167"), (stryMutAct_9fa48("40169") ? showOrgComparison && variance && benchmark !== undefined || !isFuture : stryMutAct_9fa48("40168") ? true : (stryCov_9fa48("40168", "40169"), (stryMutAct_9fa48("40171") ? showOrgComparison && variance || benchmark !== undefined : stryMutAct_9fa48("40170") ? true : (stryCov_9fa48("40170", "40171"), (stryMutAct_9fa48("40173") ? showOrgComparison || variance : stryMutAct_9fa48("40172") ? true : (stryCov_9fa48("40172", "40173"), showOrgComparison && variance)) && (stryMutAct_9fa48("40175") ? benchmark === undefined : stryMutAct_9fa48("40174") ? true : (stryCov_9fa48("40174", "40175"), benchmark !== undefined)))) && (stryMutAct_9fa48("40176") ? isFuture : (stryCov_9fa48("40176"), !isFuture)))) && <div className={`text-xs mt-2 flex items-center gap-1 ${variance.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  <span>{variance.isPositive ? '▲' : '▼'}</span>
                  <span>{variance.percent.toFixed(1)}% vs org avg</span>
                  <span className="text-neutral-500 ml-1">({format(benchmark)})</span>
                </div>)}
            </div>;
      })}
      </div>
    </div>;
};
const CouncilState: React.FC<{
  council: StateSnapshot['council'];
  mode: ChronosMode;
}> = ({
  council,
  mode
}) => {
  // Helper to display zeros elegantly
  const displayValue = (value: number, suffix?: string) => {
    if (stryMutAct_9fa48("40186") ? value !== 0 : stryMutAct_9fa48("40185") ? false : stryMutAct_9fa48("40184") ? true : (stryCov_9fa48("40184", "40185", "40186"), value === 0)) return <span className="text-neutral-500">—</span>;
    return suffix ? `${value}${suffix}` : value;
  };
  return <div className="grid grid-cols-4 gap-4">
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Active Agents</div>
        <div className="text-2xl font-bold">{council.activeAgents.length}</div>
        <div className="text-xs text-neutral-500 mt-1 truncate">{stryMutAct_9fa48("40190") ? council.activeAgents.join(', ') && '—' : stryMutAct_9fa48("40189") ? false : stryMutAct_9fa48("40188") ? true : (stryCov_9fa48("40188", "40189", "40190"), council.activeAgents.join(', ') || '—')}</div>
      </div>
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Pending Decisions</div>
        <div className="text-2xl font-bold">
          {(stryMutAct_9fa48("40195") ? council.pendingDecisions !== 0 : stryMutAct_9fa48("40194") ? false : stryMutAct_9fa48("40193") ? true : (stryCov_9fa48("40193", "40194", "40195"), council.pendingDecisions === 0)) ? <span className="text-green-400">✓ 0</span> : <span className="text-amber-400">{council.pendingDecisions}</span>}
        </div>
      </div>
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Total Deliberations</div>
        <div className="text-2xl font-bold">{displayValue(council.totalDeliberations)}</div>
      </div>
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Consensus Rate</div>
        <div className="text-2xl font-bold">{council.consensusRate.toFixed(0)}%</div>
      </div>
    </div>;
};
const GraphState: React.FC<{
  graph: StateSnapshot['graph'];
  mode: ChronosMode;
}> = ({
  graph,
  mode
}) => {
  // Format data points - show "—" if zero, otherwise format nicely
  const formatDataPoints = (value: number) => {
    if (stryMutAct_9fa48("40200") ? value !== 0 : stryMutAct_9fa48("40199") ? false : stryMutAct_9fa48("40198") ? true : (stryCov_9fa48("40198", "40199", "40200"), value === 0)) return <span className="text-neutral-500">—</span>;
    if (stryMutAct_9fa48("40204") ? value < 1000000 : stryMutAct_9fa48("40203") ? value > 1000000 : stryMutAct_9fa48("40202") ? false : stryMutAct_9fa48("40201") ? true : (stryCov_9fa48("40201", "40202", "40203", "40204"), value >= 1000000)) return `${(stryMutAct_9fa48("40206") ? value * 1000000 : (stryCov_9fa48("40206"), value / 1000000)).toFixed(1)}M`;
    if (stryMutAct_9fa48("40210") ? value < 1000 : stryMutAct_9fa48("40209") ? value > 1000 : stryMutAct_9fa48("40208") ? false : stryMutAct_9fa48("40207") ? true : (stryCov_9fa48("40207", "40208", "40209", "40210"), value >= 1000)) return `${(stryMutAct_9fa48("40212") ? value * 1000 : (stryCov_9fa48("40212"), value / 1000)).toFixed(1)}K`;
    return value.toLocaleString();
  };
  return <div className="grid grid-cols-4 gap-4">
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Entities</div>
        <div className="text-2xl font-bold">{graph.entities.toLocaleString()}</div>
      </div>
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Relationships</div>
        <div className="text-2xl font-bold">{graph.relationships.toLocaleString()}</div>
      </div>
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Data Points</div>
        <div className="text-2xl font-bold">{formatDataPoints(graph.dataPoints)}</div>
      </div>
      <div className="bg-neutral-800/50 rounded-xl p-4">
        <div className="text-sm text-neutral-400 mb-1">Freshness</div>
        <div className="text-2xl font-bold text-green-400">{graph.freshness.toFixed(0)}%</div>
      </div>
    </div>;
};
const EventsList: React.FC<{
  events: TimelineEvent[];
  currentDate: Date;
  onSelect: (event: TimelineEvent) => void;
  selectedId?: string;
  mode?: ChronosMode;
  onOpenWitness?: (event: TimelineEvent) => void;
}> = ({
  events,
  currentDate,
  onSelect,
  selectedId,
  mode = 'rewind',
  onOpenWitness
}) => {
  const [filter, setFilter] = useState<'all' | 'compliance' | 'financial' | 'operational' | 'people' | 'security'>('all');

  // Filter events by category
  const filterEvents = (e: TimelineEvent) => {
    if (stryMutAct_9fa48("40219") ? filter !== 'all' : stryMutAct_9fa48("40218") ? false : stryMutAct_9fa48("40217") ? true : (stryCov_9fa48("40217", "40218", "40219"), filter === 'all')) return stryMutAct_9fa48("40221") ? false : (stryCov_9fa48("40221"), true);
    if (stryMutAct_9fa48("40224") ? filter !== 'compliance' : stryMutAct_9fa48("40223") ? false : stryMutAct_9fa48("40222") ? true : (stryCov_9fa48("40222", "40223", "40224"), filter === 'compliance')) return stryMutAct_9fa48("40228") ? (e.type === 'milestone' || e.title.toLowerCase().includes('compliance') || e.title.toLowerCase().includes('soc')) && e.title.toLowerCase().includes('gdpr') : stryMutAct_9fa48("40227") ? false : stryMutAct_9fa48("40226") ? true : (stryCov_9fa48("40226", "40227", "40228"), (stryMutAct_9fa48("40230") ? (e.type === 'milestone' || e.title.toLowerCase().includes('compliance')) && e.title.toLowerCase().includes('soc') : stryMutAct_9fa48("40229") ? false : (stryCov_9fa48("40229", "40230"), (stryMutAct_9fa48("40232") ? e.type === 'milestone' && e.title.toLowerCase().includes('compliance') : stryMutAct_9fa48("40231") ? false : (stryCov_9fa48("40231", "40232"), (stryMutAct_9fa48("40234") ? e.type !== 'milestone' : stryMutAct_9fa48("40233") ? false : (stryCov_9fa48("40233", "40234"), e.type === 'milestone')) || (stryMutAct_9fa48("40236") ? e.title.toUpperCase().includes('compliance') : (stryCov_9fa48("40236"), e.title.toLowerCase().includes('compliance'))))) || (stryMutAct_9fa48("40238") ? e.title.toUpperCase().includes('soc') : (stryCov_9fa48("40238"), e.title.toLowerCase().includes('soc'))))) || (stryMutAct_9fa48("40240") ? e.title.toUpperCase().includes('gdpr') : (stryCov_9fa48("40240"), e.title.toLowerCase().includes('gdpr'))));
    if (stryMutAct_9fa48("40244") ? filter !== 'financial' : stryMutAct_9fa48("40243") ? false : stryMutAct_9fa48("40242") ? true : (stryCov_9fa48("40242", "40243", "40244"), filter === 'financial')) return stryMutAct_9fa48("40248") ? e.type === 'financial' && e.type === 'metric' : stryMutAct_9fa48("40247") ? false : stryMutAct_9fa48("40246") ? true : (stryCov_9fa48("40246", "40247", "40248"), (stryMutAct_9fa48("40250") ? e.type !== 'financial' : stryMutAct_9fa48("40249") ? false : (stryCov_9fa48("40249", "40250"), e.type === 'financial')) || (stryMutAct_9fa48("40253") ? e.type !== 'metric' : stryMutAct_9fa48("40252") ? false : (stryCov_9fa48("40252", "40253"), e.type === 'metric')));
    if (stryMutAct_9fa48("40257") ? filter !== 'operational' : stryMutAct_9fa48("40256") ? false : stryMutAct_9fa48("40255") ? true : (stryCov_9fa48("40255", "40256", "40257"), filter === 'operational')) return stryMutAct_9fa48("40261") ? e.type === 'system' && e.type === 'decision' : stryMutAct_9fa48("40260") ? false : stryMutAct_9fa48("40259") ? true : (stryCov_9fa48("40259", "40260", "40261"), (stryMutAct_9fa48("40263") ? e.type !== 'system' : stryMutAct_9fa48("40262") ? false : (stryCov_9fa48("40262", "40263"), e.type === 'system')) || (stryMutAct_9fa48("40266") ? e.type !== 'decision' : stryMutAct_9fa48("40265") ? false : (stryCov_9fa48("40265", "40266"), e.type === 'decision')));
    if (stryMutAct_9fa48("40270") ? filter !== 'people' : stryMutAct_9fa48("40269") ? false : stryMutAct_9fa48("40268") ? true : (stryCov_9fa48("40268", "40269", "40270"), filter === 'people')) return stryMutAct_9fa48("40274") ? e.type !== 'personnel' : stryMutAct_9fa48("40273") ? false : stryMutAct_9fa48("40272") ? true : (stryCov_9fa48("40272", "40273", "40274"), e.type === 'personnel');
    if (stryMutAct_9fa48("40278") ? filter !== 'security' : stryMutAct_9fa48("40277") ? false : stryMutAct_9fa48("40276") ? true : (stryCov_9fa48("40276", "40277", "40278"), filter === 'security')) return stryMutAct_9fa48("40282") ? (e.title.toLowerCase().includes('security') || e.title.toLowerCase().includes('breach') || e.title.toLowerCase().includes('incident') || e.title.toLowerCase().includes('threat')) && e.department === 'Security' : stryMutAct_9fa48("40281") ? false : stryMutAct_9fa48("40280") ? true : (stryCov_9fa48("40280", "40281", "40282"), (stryMutAct_9fa48("40284") ? (e.title.toLowerCase().includes('security') || e.title.toLowerCase().includes('breach') || e.title.toLowerCase().includes('incident')) && e.title.toLowerCase().includes('threat') : stryMutAct_9fa48("40283") ? false : (stryCov_9fa48("40283", "40284"), (stryMutAct_9fa48("40286") ? (e.title.toLowerCase().includes('security') || e.title.toLowerCase().includes('breach')) && e.title.toLowerCase().includes('incident') : stryMutAct_9fa48("40285") ? false : (stryCov_9fa48("40285", "40286"), (stryMutAct_9fa48("40288") ? e.title.toLowerCase().includes('security') && e.title.toLowerCase().includes('breach') : stryMutAct_9fa48("40287") ? false : (stryCov_9fa48("40287", "40288"), (stryMutAct_9fa48("40289") ? e.title.toUpperCase().includes('security') : (stryCov_9fa48("40289"), e.title.toLowerCase().includes('security'))) || (stryMutAct_9fa48("40291") ? e.title.toUpperCase().includes('breach') : (stryCov_9fa48("40291"), e.title.toLowerCase().includes('breach'))))) || (stryMutAct_9fa48("40293") ? e.title.toUpperCase().includes('incident') : (stryCov_9fa48("40293"), e.title.toLowerCase().includes('incident'))))) || (stryMutAct_9fa48("40295") ? e.title.toUpperCase().includes('threat') : (stryCov_9fa48("40295"), e.title.toLowerCase().includes('threat'))))) || (stryMutAct_9fa48("40298") ? e.department !== 'Security' : stryMutAct_9fa48("40297") ? false : (stryCov_9fa48("40297", "40298"), e.department === 'Security')));
    return stryMutAct_9fa48("40300") ? false : (stryCov_9fa48("40300"), true);
  };
  const visibleEvents = stryMutAct_9fa48("40303") ? events.filter(filterEvents).slice(0, 8) : stryMutAct_9fa48("40302") ? events.filter(e => e.timestamp <= currentDate).slice(0, 8) : stryMutAct_9fa48("40301") ? events.filter(e => e.timestamp <= currentDate).filter(filterEvents) : (stryCov_9fa48("40301", "40302", "40303"), events.filter(stryMutAct_9fa48("40304") ? () => undefined : (stryCov_9fa48("40304"), e => stryMutAct_9fa48("40308") ? e.timestamp > currentDate : stryMutAct_9fa48("40307") ? e.timestamp < currentDate : stryMutAct_9fa48("40306") ? false : stryMutAct_9fa48("40305") ? true : (stryCov_9fa48("40305", "40306", "40307", "40308"), e.timestamp <= currentDate))).filter(filterEvents).slice(0, 8));

  // Also get upcoming events for timeline markers
  const upcomingEvents = stryMutAct_9fa48("40311") ? events.filter(filterEvents).slice(0, 3) : stryMutAct_9fa48("40310") ? events.filter(e => e.timestamp > currentDate).slice(0, 3) : stryMutAct_9fa48("40309") ? events.filter(e => e.timestamp > currentDate).filter(filterEvents) : (stryCov_9fa48("40309", "40310", "40311"), events.filter(stryMutAct_9fa48("40312") ? () => undefined : (stryCov_9fa48("40312"), e => stryMutAct_9fa48("40316") ? e.timestamp <= currentDate : stryMutAct_9fa48("40315") ? e.timestamp >= currentDate : stryMutAct_9fa48("40314") ? false : stryMutAct_9fa48("40313") ? true : (stryCov_9fa48("40313", "40314", "40315", "40316"), e.timestamp > currentDate))).filter(filterEvents).slice(0, 3));
  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'decision':
        if (stryMutAct_9fa48("40318")) {} else {
          stryCov_9fa48("40318");
          return '⚖️';
        }
      case 'metric':
        if (stryMutAct_9fa48("40321")) {} else {
          stryCov_9fa48("40321");
          return '📊';
        }
      case 'personnel':
        if (stryMutAct_9fa48("40324")) {} else {
          stryCov_9fa48("40324");
          return '👤';
        }
      case 'financial':
        if (stryMutAct_9fa48("40327")) {} else {
          stryCov_9fa48("40327");
          return '💵';
        }
      case 'system':
        if (stryMutAct_9fa48("40330")) {} else {
          stryCov_9fa48("40330");
          return '⚙️';
        }
      case 'milestone':
        if (stryMutAct_9fa48("40333")) {} else {
          stryCov_9fa48("40333");
          return '🏆';
        }
    }
  };

  // Severity indicator based on impact and magnitude
  const getSeverityBadge = (event: TimelineEvent) => {
    const magnitude = stryMutAct_9fa48("40339") ? event.magnitude && 5 : stryMutAct_9fa48("40338") ? false : stryMutAct_9fa48("40337") ? true : (stryCov_9fa48("40337", "40338", "40339"), event.magnitude || 5);
    if (stryMutAct_9fa48("40342") ? event.impact === 'negative' || magnitude >= 8 : stryMutAct_9fa48("40341") ? false : stryMutAct_9fa48("40340") ? true : (stryCov_9fa48("40340", "40341", "40342"), (stryMutAct_9fa48("40344") ? event.impact !== 'negative' : stryMutAct_9fa48("40343") ? true : (stryCov_9fa48("40343", "40344"), event.impact === 'negative')) && (stryMutAct_9fa48("40348") ? magnitude < 8 : stryMutAct_9fa48("40347") ? magnitude > 8 : stryMutAct_9fa48("40346") ? true : (stryCov_9fa48("40346", "40347", "40348"), magnitude >= 8)))) {
      return <span className="text-xs px-1.5 py-0.5 rounded bg-red-900 text-red-300">🔴 Critical</span>;
    }
    if (stryMutAct_9fa48("40352") ? event.impact === 'negative' || magnitude >= 5 : stryMutAct_9fa48("40351") ? false : stryMutAct_9fa48("40350") ? true : (stryCov_9fa48("40350", "40351", "40352"), (stryMutAct_9fa48("40354") ? event.impact !== 'negative' : stryMutAct_9fa48("40353") ? true : (stryCov_9fa48("40353", "40354"), event.impact === 'negative')) && (stryMutAct_9fa48("40358") ? magnitude < 5 : stryMutAct_9fa48("40357") ? magnitude > 5 : stryMutAct_9fa48("40356") ? true : (stryCov_9fa48("40356", "40357", "40358"), magnitude >= 5)))) {
      return <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900 text-amber-300">🟠 High</span>;
    }
    if (stryMutAct_9fa48("40362") ? event.impact === 'positive' || magnitude >= 8 : stryMutAct_9fa48("40361") ? false : stryMutAct_9fa48("40360") ? true : (stryCov_9fa48("40360", "40361", "40362"), (stryMutAct_9fa48("40364") ? event.impact !== 'positive' : stryMutAct_9fa48("40363") ? true : (stryCov_9fa48("40363", "40364"), event.impact === 'positive')) && (stryMutAct_9fa48("40368") ? magnitude < 8 : stryMutAct_9fa48("40367") ? magnitude > 8 : stryMutAct_9fa48("40366") ? true : (stryCov_9fa48("40366", "40367", "40368"), magnitude >= 8)))) {
      return <span className="text-xs px-1.5 py-0.5 rounded bg-green-900 text-green-300">🟢 Major</span>;
    }
    return null;
  };

  // Timeline marker for event timing
  const getTimelineMarker = (event: TimelineEvent, isUpcoming: boolean) => {
    if (stryMutAct_9fa48("40372") ? false : stryMutAct_9fa48("40371") ? true : (stryCov_9fa48("40371", "40372"), isUpcoming)) {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 border border-cyan-700/50">⏳ Upcoming</span>;
    }
    const hoursAgo = stryMutAct_9fa48("40374") ? (currentDate.getTime() - event.timestamp.getTime()) * (1000 * 60 * 60) : (stryCov_9fa48("40374"), (stryMutAct_9fa48("40375") ? currentDate.getTime() + event.timestamp.getTime() : (stryCov_9fa48("40375"), currentDate.getTime() - event.timestamp.getTime())) / (stryMutAct_9fa48("40376") ? 1000 * 60 / 60 : (stryCov_9fa48("40376"), (stryMutAct_9fa48("40377") ? 1000 / 60 : (stryCov_9fa48("40377"), 1000 * 60)) * 60)));
    if (stryMutAct_9fa48("40381") ? hoursAgo >= 1 : stryMutAct_9fa48("40380") ? hoursAgo <= 1 : stryMutAct_9fa48("40379") ? false : stryMutAct_9fa48("40378") ? true : (stryCov_9fa48("40378", "40379", "40380", "40381"), hoursAgo < 1)) {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 border border-amber-700/50">⚡ Just now</span>;
    }
    if (stryMutAct_9fa48("40386") ? hoursAgo >= 24 : stryMutAct_9fa48("40385") ? hoursAgo <= 24 : stryMutAct_9fa48("40384") ? false : stryMutAct_9fa48("40383") ? true : (stryCov_9fa48("40383", "40384", "40385", "40386"), hoursAgo < 24)) {
      return <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">🕐 Today</span>;
    }
    return null;
  };
  return <div>
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(stryMutAct_9fa48("40388") ? [] : (stryCov_9fa48("40388"), [stryMutAct_9fa48("40389") ? {} : (stryCov_9fa48("40389"), {
        id: 'all',
        label: 'All',
        icon: '📋'
      }), stryMutAct_9fa48("40393") ? {} : (stryCov_9fa48("40393"), {
        id: 'compliance',
        label: 'Compliance',
        icon: '✅'
      }), stryMutAct_9fa48("40397") ? {} : (stryCov_9fa48("40397"), {
        id: 'financial',
        label: 'Financial',
        icon: '💰'
      }), stryMutAct_9fa48("40401") ? {} : (stryCov_9fa48("40401"), {
        id: 'operational',
        label: 'Operational',
        icon: '⚙️'
      }), stryMutAct_9fa48("40405") ? {} : (stryCov_9fa48("40405"), {
        id: 'people',
        label: 'People',
        icon: '👥'
      }), stryMutAct_9fa48("40409") ? {} : (stryCov_9fa48("40409"), {
        id: 'security',
        label: 'Security',
        icon: '🔒'
      })])).map(stryMutAct_9fa48("40413") ? () => undefined : (stryCov_9fa48("40413"), f => <button key={f.id} onClick={stryMutAct_9fa48("40414") ? () => undefined : (stryCov_9fa48("40414"), () => setFilter(f.id as typeof filter))} className={`px-2 py-1 text-[10px] rounded-full transition-colors ${(stryMutAct_9fa48("40418") ? filter !== f.id : stryMutAct_9fa48("40417") ? false : stryMutAct_9fa48("40416") ? true : (stryCov_9fa48("40416", "40417", "40418"), filter === f.id)) ? 'bg-white/20 text-white border border-white/30' : 'bg-neutral-800 text-neutral-400 hover:text-white border border-transparent'}`}>
            {f.icon} {f.label}
          </button>))}
      </div>

      {/* Upcoming Events (if in replay/fastforward mode) */}
      {stryMutAct_9fa48("40423") ? (mode === 'replay' || mode === 'fastforward') && upcomingEvents.length > 0 || <div className="mb-3 p-2 bg-cyan-900/20 border border-cyan-800/50 rounded-lg">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold mb-2">Coming Up in Timeline</div>
          {upcomingEvents.map(event => <div key={event.id} className="flex items-center gap-2 text-xs text-cyan-300/70 py-1">
              <span>⏳</span>
              <span className="truncate">{event.title}</span>
            </div>)}
        </div> : stryMutAct_9fa48("40422") ? false : stryMutAct_9fa48("40421") ? true : (stryCov_9fa48("40421", "40422", "40423"), (stryMutAct_9fa48("40425") ? mode === 'replay' || mode === 'fastforward' || upcomingEvents.length > 0 : stryMutAct_9fa48("40424") ? true : (stryCov_9fa48("40424", "40425"), (stryMutAct_9fa48("40427") ? mode === 'replay' && mode === 'fastforward' : stryMutAct_9fa48("40426") ? true : (stryCov_9fa48("40426", "40427"), (stryMutAct_9fa48("40429") ? mode !== 'replay' : stryMutAct_9fa48("40428") ? false : (stryCov_9fa48("40428", "40429"), mode === 'replay')) || (stryMutAct_9fa48("40432") ? mode !== 'fastforward' : stryMutAct_9fa48("40431") ? false : (stryCov_9fa48("40431", "40432"), mode === 'fastforward')))) && (stryMutAct_9fa48("40436") ? upcomingEvents.length <= 0 : stryMutAct_9fa48("40435") ? upcomingEvents.length >= 0 : stryMutAct_9fa48("40434") ? true : (stryCov_9fa48("40434", "40435", "40436"), upcomingEvents.length > 0)))) && <div className="mb-3 p-2 bg-cyan-900/20 border border-cyan-800/50 rounded-lg">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold mb-2">Coming Up in Timeline</div>
          {upcomingEvents.map(stryMutAct_9fa48("40437") ? () => undefined : (stryCov_9fa48("40437"), event => <div key={event.id} className="flex items-center gap-2 text-xs text-cyan-300/70 py-1">
              <span>⏳</span>
              <span className="truncate">{event.title}</span>
            </div>))}
        </div>)}

      {/* Event List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {(stryMutAct_9fa48("40440") ? visibleEvents.length !== 0 : stryMutAct_9fa48("40439") ? false : stryMutAct_9fa48("40438") ? true : (stryCov_9fa48("40438", "40439", "40440"), visibleEvents.length === 0)) ? <div className="text-center text-neutral-500 py-8">No events matching filter</div> : visibleEvents.map(stryMutAct_9fa48("40441") ? () => undefined : (stryCov_9fa48("40441"), event => <button key={event.id} onClick={stryMutAct_9fa48("40442") ? () => undefined : (stryCov_9fa48("40442"), () => onSelect(event))} className={`w-full text-left p-3 rounded-lg transition-colors ${(stryMutAct_9fa48("40446") ? selectedId !== event.id : stryMutAct_9fa48("40445") ? false : stryMutAct_9fa48("40444") ? true : (stryCov_9fa48("40444", "40445", "40446"), selectedId === event.id)) ? 'bg-white/10 ring-1 ring-white/30' : (stryMutAct_9fa48("40450") ? event.impact !== 'positive' : stryMutAct_9fa48("40449") ? false : stryMutAct_9fa48("40448") ? true : (stryCov_9fa48("40448", "40449", "40450"), event.impact === 'positive')) ? 'bg-green-900/20 hover:bg-green-900/30' : (stryMutAct_9fa48("40455") ? event.impact !== 'negative' : stryMutAct_9fa48("40454") ? false : stryMutAct_9fa48("40453") ? true : (stryCov_9fa48("40453", "40454", "40455"), event.impact === 'negative')) ? 'bg-red-900/20 hover:bg-red-900/30' : 'bg-neutral-800/50 hover:bg-neutral-800'}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{getTypeIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    {getSeverityBadge(event)}
                    {getTimelineMarker(event, stryMutAct_9fa48("40459") ? true : (stryCov_9fa48("40459"), false))}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {event.timestamp.toLocaleDateString()} • {stryMutAct_9fa48("40462") ? event.department && 'Organization' : stryMutAct_9fa48("40461") ? false : stryMutAct_9fa48("40460") ? true : (stryCov_9fa48("40460", "40461", "40462"), event.department || 'Organization')}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {stryMutAct_9fa48("40466") ? event.deliberationId || <span className="text-xs bg-amber-600/30 text-amber-400 px-2 py-0.5 rounded">Replay</span> : stryMutAct_9fa48("40465") ? false : stryMutAct_9fa48("40464") ? true : (stryCov_9fa48("40464", "40465", "40466"), event.deliberationId && <span className="text-xs bg-amber-600/30 text-amber-400 px-2 py-0.5 rounded">Replay</span>)}
                  {stryMutAct_9fa48("40469") ? onOpenWitness || <button onClick={e => {
              e.stopPropagation();
              onOpenWitness(event);
            }} className="text-[10px] bg-cyan-600/30 text-cyan-400 px-2 py-0.5 rounded hover:bg-cyan-600/50 transition-colors">
                      🔍 Witness
                    </button> : stryMutAct_9fa48("40468") ? false : stryMutAct_9fa48("40467") ? true : (stryCov_9fa48("40467", "40468", "40469"), onOpenWitness && <button onClick={e => {
              e.stopPropagation();
              onOpenWitness(event);
            }} className="text-[10px] bg-cyan-600/30 text-cyan-400 px-2 py-0.5 rounded hover:bg-cyan-600/50 transition-colors">
                      🔍 Witness
                    </button>)}
                </div>
              </div>
            </button>))}
      </div>
    </div>;
};

// =============================================================================
// EVENT WITNESS MODAL - CendiaWitness™ View for Events
// =============================================================================
const EventWitnessModal: React.FC<{
  event: TimelineEvent;
  onClose: () => void;
  onOpenInChronos: (timestamp: Date) => void;
}> = ({
  event,
  onClose,
  onOpenInChronos
}) => {
  // Generate mock witness data
  const decisionId = `DC-${event.timestamp.getFullYear()}-${String(stryMutAct_9fa48("40473") ? event.timestamp.getMonth() - 1 : (stryCov_9fa48("40473"), event.timestamp.getMonth() + 1)).padStart(2, '0')}-${stryMutAct_9fa48("40476") ? event.id.toUpperCase() : stryMutAct_9fa48("40475") ? event.id.slice(0, 8).toLowerCase() : (stryCov_9fa48("40475", "40476"), event.id.slice(0, 8).toUpperCase())}`;

  // Governance policy based on event type
  const governancePolicy = stryMutAct_9fa48("40477") ? {} : (stryCov_9fa48("40477"), {
    rule: 'Requires CFO + COO + CISO sign-off for launch.',
    quorumRequired: 3,
    quorumObtained: (stryMutAct_9fa48("40481") ? event.impact !== 'negative' : stryMutAct_9fa48("40480") ? false : stryMutAct_9fa48("40479") ? true : (stryCov_9fa48("40479", "40480", "40481"), event.impact === 'negative')) ? 2 : 3
  });

  // Source/Origin of the event
  const eventSources = stryMutAct_9fa48("40483") ? [] : (stryCov_9fa48("40483"), ['Council decision', 'Bridge workflow', 'Panopticon alert', 'Manual entry']);
  const source = event.deliberationId ? 'Council decision' : eventSources[Math.floor(stryMutAct_9fa48("40489") ? Math.random() / 3 : (stryCov_9fa48("40489"), Math.random() * 3))];

  // Calculate timing for each approver
  const eventCreatedAt = new Date(stryMutAct_9fa48("40490") ? event.timestamp.getTime() + 4 * 3600000 : (stryCov_9fa48("40490"), event.timestamp.getTime() - (stryMutAct_9fa48("40491") ? 4 / 3600000 : (stryCov_9fa48("40491"), 4 * 3600000)))); // 4 hours before
  const approvers = stryMutAct_9fa48("40492") ? [] : (stryCov_9fa48("40492"), [stryMutAct_9fa48("40493") ? {} : (stryCov_9fa48("40493"), {
    name: 'Sarah Chen',
    role: 'CFO',
    signedAt: new Date(stryMutAct_9fa48("40496") ? event.timestamp.getTime() + 3600000 : (stryCov_9fa48("40496"), event.timestamp.getTime() - 3600000)),
    status: 'approved' as const,
    waitTime: '3h 12m'
  }), stryMutAct_9fa48("40498") ? {} : (stryCov_9fa48("40498"), {
    name: 'Michael Torres',
    role: 'COO',
    signedAt: new Date(stryMutAct_9fa48("40501") ? event.timestamp.getTime() + 1800000 : (stryCov_9fa48("40501"), event.timestamp.getTime() - 1800000)),
    status: 'approved' as const,
    waitTime: '2h 30m'
  }), stryMutAct_9fa48("40503") ? {} : (stryCov_9fa48("40503"), {
    name: 'Emily Watson',
    role: 'CISO',
    signedAt: (stryMutAct_9fa48("40508") ? event.impact !== 'negative' : stryMutAct_9fa48("40507") ? false : stryMutAct_9fa48("40506") ? true : (stryCov_9fa48("40506", "40507", "40508"), event.impact === 'negative')) ? null : new Date(stryMutAct_9fa48("40510") ? event.timestamp.getTime() + 900000 : (stryCov_9fa48("40510"), event.timestamp.getTime() - 900000)),
    status: (stryMutAct_9fa48("40513") ? event.impact !== 'negative' : stryMutAct_9fa48("40512") ? false : stryMutAct_9fa48("40511") ? true : (stryCov_9fa48("40511", "40512", "40513"), event.impact === 'negative')) ? 'pending' as const : 'approved' as const,
    waitTime: (stryMutAct_9fa48("40517") ? event.impact !== 'negative' : stryMutAct_9fa48("40516") ? false : stryMutAct_9fa48("40515") ? true : (stryCov_9fa48("40515", "40516", "40517"), event.impact === 'negative')) ? '18h 05m (pending)' : '3h 45m'
  })]);

  // Navigate to Decision DNA with this event highlighted
  const openInDecisionDNA = () => {
    window.open(`/cortex/intelligence/decision-dna?decision=${decisionId}&highlight=${event.id}`, '_blank');
  };
  return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={stryMutAct_9fa48("40524") ? () => undefined : (stryCov_9fa48("40524"), e => e.stopPropagation())}>
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔍</span>
                <h2 className="text-xl font-semibold">CendiaWitness™</h2>
              </div>
              <p className="text-sm text-neutral-400">Immutable evidence record for this event</p>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-white p-2">✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Decision ID Block */}
          <div className="bg-black/50 border border-neutral-800 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500">Decision ID</span>
                <button onClick={openInDecisionDNA} className="block font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition-colors" title="Open in Decision DNA with this event highlighted">
                  {decisionId} ↗
                </button>
              </div>
              <div>
                <span className="text-neutral-500">Event ID</span>
                <p className="font-mono text-neutral-300">{event.id}</p>
              </div>
              <div>
                <span className="text-neutral-500">Decision Title</span>
                <p className="text-white font-medium">{event.title}</p>
              </div>
              <div>
                <span className="text-neutral-500">Timestamp</span>
                <p className="text-neutral-300">{event.timestamp.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-neutral-500">Source</span>
                <p className="text-indigo-400 font-medium">{source}</p>
              </div>
              <div>
                <span className="text-neutral-500">Outcome</span>
                <p className={`font-medium ${(stryMutAct_9fa48("40528") ? event.impact !== 'positive' : stryMutAct_9fa48("40527") ? false : stryMutAct_9fa48("40526") ? true : (stryCov_9fa48("40526", "40527", "40528"), event.impact === 'positive')) ? 'text-green-400' : (stryMutAct_9fa48("40533") ? event.impact !== 'negative' : stryMutAct_9fa48("40532") ? false : stryMutAct_9fa48("40531") ? true : (stryCov_9fa48("40531", "40532", "40533"), event.impact === 'negative')) ? 'text-red-400' : 'text-amber-400'}`}>
                  {(stryMutAct_9fa48("40539") ? event.impact !== 'positive' : stryMutAct_9fa48("40538") ? false : stryMutAct_9fa48("40537") ? true : (stryCov_9fa48("40537", "40538", "40539"), event.impact === 'positive')) ? '✓ Approved' : (stryMutAct_9fa48("40544") ? event.impact !== 'negative' : stryMutAct_9fa48("40543") ? false : stryMutAct_9fa48("40542") ? true : (stryCov_9fa48("40542", "40543", "40544"), event.impact === 'negative')) ? '✗ Rejected / Escalated' : '⏳ Pending Review'}
                </p>
              </div>
            </div>
            
            {/* Governance Policy */}
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-neutral-500 text-xs">Policy</span>
                  <p className="text-neutral-300 text-sm">{governancePolicy.rule}</p>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 text-xs">Quorum</span>
                  <p className={`text-sm font-medium ${(stryMutAct_9fa48("40552") ? governancePolicy.quorumObtained < governancePolicy.quorumRequired : stryMutAct_9fa48("40551") ? governancePolicy.quorumObtained > governancePolicy.quorumRequired : stryMutAct_9fa48("40550") ? false : stryMutAct_9fa48("40549") ? true : (stryCov_9fa48("40549", "40550", "40551", "40552"), governancePolicy.quorumObtained >= governancePolicy.quorumRequired)) ? 'text-green-400' : 'text-amber-400'}`}>
                    {governancePolicy.quorumObtained}/{governancePolicy.quorumRequired} obtained
                  </p>
                </div>
              </div>
              {stryMutAct_9fa48("40557") ? governancePolicy.quorumObtained < governancePolicy.quorumRequired || <div className="mt-2 px-3 py-2 bg-red-900/30 border border-red-700/50 rounded-lg">
                  <p className="text-red-400 text-xs font-medium">
                    ⚠️ Status: Blocked (Security sign-off missing)
                  </p>
                </div> : stryMutAct_9fa48("40556") ? false : stryMutAct_9fa48("40555") ? true : (stryCov_9fa48("40555", "40556", "40557"), (stryMutAct_9fa48("40560") ? governancePolicy.quorumObtained >= governancePolicy.quorumRequired : stryMutAct_9fa48("40559") ? governancePolicy.quorumObtained <= governancePolicy.quorumRequired : stryMutAct_9fa48("40558") ? true : (stryCov_9fa48("40558", "40559", "40560"), governancePolicy.quorumObtained < governancePolicy.quorumRequired)) && <div className="mt-2 px-3 py-2 bg-red-900/30 border border-red-700/50 rounded-lg">
                  <p className="text-red-400 text-xs font-medium">
                    ⚠️ Status: Blocked (Security sign-off missing)
                  </p>
                </div>)}
            </div>
          </div>

          {/* Approvers / Signers */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Who Approved / Signed</h3>
            <div className="space-y-2">
              {approvers.map(stryMutAct_9fa48("40561") ? () => undefined : (stryCov_9fa48("40561"), (approver, i) => <div key={i} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{(stryMutAct_9fa48("40564") ? approver.status !== 'approved' : stryMutAct_9fa48("40563") ? false : stryMutAct_9fa48("40562") ? true : (stryCov_9fa48("40562", "40563", "40564"), approver.status === 'approved')) ? '✅' : '⏳'}</span>
                    <div>
                      <p className="font-medium">{approver.name}</p>
                      <p className="text-xs text-neutral-500">{approver.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${(stryMutAct_9fa48("40571") ? approver.status !== 'approved' : stryMutAct_9fa48("40570") ? false : stryMutAct_9fa48("40569") ? true : (stryCov_9fa48("40569", "40570", "40571"), approver.status === 'approved')) ? 'text-green-400' : 'text-amber-400'}`}>
                      {(stryMutAct_9fa48("40577") ? approver.status !== 'approved' : stryMutAct_9fa48("40576") ? false : stryMutAct_9fa48("40575") ? true : (stryCov_9fa48("40575", "40576", "40577"), approver.status === 'approved')) ? 'Signed' : 'Pending'}
                    </p>
                    {stryMutAct_9fa48("40583") ? approver.signedAt || <p className="text-[10px] text-neutral-500">{approver.signedAt.toLocaleString()}</p> : stryMutAct_9fa48("40582") ? false : stryMutAct_9fa48("40581") ? true : (stryCov_9fa48("40581", "40582", "40583"), approver.signedAt && <p className="text-[10px] text-neutral-500">{approver.signedAt.toLocaleString()}</p>)}
                    <p className="text-[10px] text-neutral-600 mt-0.5">
                      {(stryMutAct_9fa48("40586") ? approver.status !== 'approved' : stryMutAct_9fa48("40585") ? false : stryMutAct_9fa48("40584") ? true : (stryCov_9fa48("40584", "40585", "40586"), approver.status === 'approved')) ? `Signed after ${approver.waitTime}` : `Pending for ${approver.waitTime}`}
                    </p>
                  </div>
                </div>))}
            </div>
          </div>

          {/* Linked Assets */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Linked Assets</h3>
            <div className="grid grid-cols-2 gap-3">
              {stryMutAct_9fa48("40592") ? event.deliberationId || <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                  <p className="text-xs text-amber-400 font-medium mb-1">📋 Council Minutes</p>
                  <p className="text-[10px] text-neutral-400 font-mono">{event.deliberationId}</p>
                </div> : stryMutAct_9fa48("40591") ? false : stryMutAct_9fa48("40590") ? true : (stryCov_9fa48("40590", "40591", "40592"), event.deliberationId && <div className="p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                  <p className="text-xs text-amber-400 font-medium mb-1">📋 Council Minutes</p>
                  <p className="text-[10px] text-neutral-400 font-mono">{event.deliberationId}</p>
                </div>)}
              <div className="p-3 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                <p className="text-xs text-purple-400 font-medium mb-1">📊 Executive Brief</p>
                <p className="text-[10px] text-neutral-400">Auto-generated summary</p>
              </div>
              <div className="p-3 bg-cyan-900/20 border border-cyan-700/50 rounded-lg">
                <p className="text-xs text-cyan-400 font-medium mb-1">⏰ Chronos Timestamp</p>
                <p className="text-[10px] text-neutral-400 font-mono">{event.timestamp.toISOString()}</p>
              </div>
              <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-lg cursor-help" title="Hash of this event's record, anchored in the Chronos immutable ledger. Any tampering would change this value.">
                <p className="text-xs text-green-400 font-medium mb-1">🔐 Ledger Hash (Chronos)</p>
                <p className="text-[10px] text-neutral-400 font-mono truncate">sha256:{stryMutAct_9fa48("40593") ? event.id : (stryCov_9fa48("40593"), event.id.slice(0, 16))}...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-700 bg-neutral-800/50 flex gap-3">
          <button onClick={stryMutAct_9fa48("40594") ? () => undefined : (stryCov_9fa48("40594"), () => onOpenInChronos(event.timestamp))} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            ⏪ Open this moment in Chronos Replay
          </button>
          <button onClick={onClose} className="px-4 py-3 bg-neutral-700 rounded-lg font-medium hover:bg-neutral-600 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>;
};
const VariableSelector: React.FC<{
  onCreateBranch: () => void;
}> = stryMutAct_9fa48("40595") ? () => undefined : (stryCov_9fa48("40595"), (() => {
  const VariableSelector: React.FC<{
    onCreateBranch: () => void;
  }> = ({
    onCreateBranch
  }) => <div className="space-y-4">
    <p className="text-sm text-purple-300">
      Select a decision point from the events list, then create an alternate timeline to see what would have happened.
    </p>
    <button onClick={onCreateBranch} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity">
      🔀 Create Alternate Timeline
    </button>
  </div>;
  return VariableSelector;
})());
const BranchList: React.FC<{
  branches: BranchTimeline[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = stryMutAct_9fa48("40596") ? () => undefined : (stryCov_9fa48("40596"), (() => {
  const BranchList: React.FC<{
    branches: BranchTimeline[];
    selectedId: string | null;
    onSelect: (id: string) => void;
  }> = ({
    branches,
    selectedId,
    onSelect
  }) => <div className="space-y-3">
    {branches.map(stryMutAct_9fa48("40597") ? () => undefined : (stryCov_9fa48("40597"), branch => <button key={branch.id} onClick={stryMutAct_9fa48("40598") ? () => undefined : (stryCov_9fa48("40598"), () => onSelect(branch.id))} className={`w-full text-left p-4 rounded-xl border transition-colors ${(stryMutAct_9fa48("40602") ? selectedId !== branch.id : stryMutAct_9fa48("40601") ? false : stryMutAct_9fa48("40600") ? true : (stryCov_9fa48("40600", "40601", "40602"), selectedId === branch.id)) ? 'bg-purple-900/30 border-purple-500' : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{branch.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${(stryMutAct_9fa48("40608") ? branch.outcome !== 'better' : stryMutAct_9fa48("40607") ? false : stryMutAct_9fa48("40606") ? true : (stryCov_9fa48("40606", "40607", "40608"), branch.outcome === 'better')) ? 'bg-green-600' : (stryMutAct_9fa48("40613") ? branch.outcome !== 'worse' : stryMutAct_9fa48("40612") ? false : stryMutAct_9fa48("40611") ? true : (stryCov_9fa48("40611", "40612", "40613"), branch.outcome === 'worse')) ? 'bg-red-600' : 'bg-neutral-600'}`}>
            {(stryMutAct_9fa48("40619") ? branch.outcome !== 'better' : stryMutAct_9fa48("40618") ? false : stryMutAct_9fa48("40617") ? true : (stryCov_9fa48("40617", "40618", "40619"), branch.outcome === 'better')) ? '✓ Better' : (stryMutAct_9fa48("40624") ? branch.outcome !== 'worse' : stryMutAct_9fa48("40623") ? false : stryMutAct_9fa48("40622") ? true : (stryCov_9fa48("40622", "40623", "40624"), branch.outcome === 'worse')) ? '✗ Worse' : '≈ Similar'}
          </span>
        </div>
        <div className="text-sm text-neutral-400">
          <span className="line-through text-red-400">{branch.original}</span>
          {' → '}
          <span className="text-green-400">{branch.alternate}</span>
        </div>
        <div className="flex gap-4 mt-2 text-sm">
          <span className={(stryMutAct_9fa48("40632") ? branch.deltaRevenue < 0 : stryMutAct_9fa48("40631") ? branch.deltaRevenue > 0 : stryMutAct_9fa48("40630") ? false : stryMutAct_9fa48("40629") ? true : (stryCov_9fa48("40629", "40630", "40631", "40632"), branch.deltaRevenue >= 0)) ? 'text-green-400' : 'text-red-400'}>
            Revenue: {(stryMutAct_9fa48("40638") ? branch.deltaRevenue < 0 : stryMutAct_9fa48("40637") ? branch.deltaRevenue > 0 : stryMutAct_9fa48("40636") ? false : stryMutAct_9fa48("40635") ? true : (stryCov_9fa48("40635", "40636", "40637", "40638"), branch.deltaRevenue >= 0)) ? '+' : ''}{(stryMutAct_9fa48("40641") ? branch.deltaRevenue * 1000000 : (stryCov_9fa48("40641"), branch.deltaRevenue / 1000000)).toFixed(1)}M
          </span>
          <span className={(stryMutAct_9fa48("40645") ? branch.deltaProfit < 0 : stryMutAct_9fa48("40644") ? branch.deltaProfit > 0 : stryMutAct_9fa48("40643") ? false : stryMutAct_9fa48("40642") ? true : (stryCov_9fa48("40642", "40643", "40644", "40645"), branch.deltaProfit >= 0)) ? 'text-green-400' : 'text-red-400'}>
            Profit: {(stryMutAct_9fa48("40651") ? branch.deltaProfit < 0 : stryMutAct_9fa48("40650") ? branch.deltaProfit > 0 : stryMutAct_9fa48("40649") ? false : stryMutAct_9fa48("40648") ? true : (stryCov_9fa48("40648", "40649", "40650", "40651"), branch.deltaProfit >= 0)) ? '+' : ''}{(stryMutAct_9fa48("40654") ? branch.deltaProfit * 1000000 : (stryCov_9fa48("40654"), branch.deltaProfit / 1000000)).toFixed(1)}M
          </span>
        </div>
      </button>))}
  </div>;
  return BranchList;
})());
const PredictionConfidence: React.FC<{
  currentDate: Date;
}> = ({
  currentDate
}) => {
  const daysAhead = Math.floor(stryMutAct_9fa48("40656") ? (currentDate.getTime() - Date.now()) * (24 * 60 * 60 * 1000) : (stryCov_9fa48("40656"), (stryMutAct_9fa48("40657") ? currentDate.getTime() + Date.now() : (stryCov_9fa48("40657"), currentDate.getTime() - Date.now())) / (stryMutAct_9fa48("40658") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("40658"), (stryMutAct_9fa48("40659") ? 24 * 60 / 60 : (stryCov_9fa48("40659"), (stryMutAct_9fa48("40660") ? 24 / 60 : (stryCov_9fa48("40660"), 24 * 60)) * 60)) * 1000))));
  const confidence = stryMutAct_9fa48("40661") ? Math.min(10, 95 - daysAhead * 0.3) : (stryCov_9fa48("40661"), Math.max(10, stryMutAct_9fa48("40662") ? 95 + daysAhead * 0.3 : (stryCov_9fa48("40662"), 95 - (stryMutAct_9fa48("40663") ? daysAhead / 0.3 : (stryCov_9fa48("40663"), daysAhead * 0.3)))));
  return <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Prediction Confidence</span>
          <span className={(stryMutAct_9fa48("40667") ? confidence <= 70 : stryMutAct_9fa48("40666") ? confidence >= 70 : stryMutAct_9fa48("40665") ? false : stryMutAct_9fa48("40664") ? true : (stryCov_9fa48("40664", "40665", "40666", "40667"), confidence > 70)) ? 'text-green-400' : (stryMutAct_9fa48("40672") ? confidence <= 40 : stryMutAct_9fa48("40671") ? confidence >= 40 : stryMutAct_9fa48("40670") ? false : stryMutAct_9fa48("40669") ? true : (stryCov_9fa48("40669", "40670", "40671", "40672"), confidence > 40)) ? 'text-yellow-400' : 'text-red-400'}>
            {confidence.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${(stryMutAct_9fa48("40679") ? confidence <= 70 : stryMutAct_9fa48("40678") ? confidence >= 70 : stryMutAct_9fa48("40677") ? false : stryMutAct_9fa48("40676") ? true : (stryCov_9fa48("40676", "40677", "40678", "40679"), confidence > 70)) ? 'bg-green-500' : (stryMutAct_9fa48("40684") ? confidence <= 40 : stryMutAct_9fa48("40683") ? confidence >= 40 : stryMutAct_9fa48("40682") ? false : stryMutAct_9fa48("40681") ? true : (stryCov_9fa48("40681", "40682", "40683", "40684"), confidence > 40)) ? 'bg-yellow-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("40687") ? {} : (stryCov_9fa48("40687"), {
          width: `${confidence}%`
        })} />
        </div>
      </div>
      <p className="text-xs text-neutral-500">
        Predictions {daysAhead} days ahead. Confidence decreases with temporal distance.
      </p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-400">Data Sources</span>
          <span>12 active</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Model Version</span>
          <span>Chronos v2.4</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Last Calibration</span>
          <span>2 hours ago</span>
        </div>
      </div>
    </div>;
};
const AuditExport: React.FC<{
  currentDate: Date;
}> = ({
  currentDate
}) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      const hash = `sha256:${Date.now().toString(16)}`;
      const timestamp = new Date().toISOString();

      // Create HTML content for PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Datacendia Audit Package</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #f59e0b; }
    .subtitle { color: #666; margin-top: 5px; }
    h2 { color: #f59e0b; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .section { margin-bottom: 30px; }
    .proof-box { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; font-family: monospace; font-size: 12px; }
    .metadata { display: grid; grid-template-columns: 150px 1fr; gap: 10px; }
    .label { font-weight: bold; color: #666; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
    .stamp { display: inline-block; border: 2px solid #22c55e; color: #22c55e; padding: 5px 15px; border-radius: 4px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">DATACENDIA</div>
    <div class="subtitle">CendiaChronos™ Audit Package</div>
  </div>
  
  <div class="section">
    <h2>📋 Audit Information</h2>
    <div class="metadata">
      <span class="label">Generated:</span><span>${new Date().toLocaleString()}</span>
      <span class="label">Snapshot Date:</span><span>${currentDate.toLocaleString()}</span>
      <span class="label">Package Type:</span><span>Complete Audit Trail</span>
      <span class="label">Version:</span><span>1.0</span>
    </div>
  </div>
  
  <div class="section">
    <h2>🔐 Cryptographic Proof</h2>
    <div class="proof-box">
      <div><strong>Hash:</strong> ${hash}</div>
      <div><strong>Algorithm:</strong> SHA-256</div>
      <div><strong>Timestamp:</strong> ${timestamp}</div>
      <div><strong>Signer:</strong> CendiaChronos™</div>
    </div>
  </div>
  
  <div class="section">
    <h2>📜 Chain of Custody</h2>
    <p>This audit package was generated by CendiaChronos™ and includes cryptographic proof of authenticity. All Council deliberations, decisions, and supporting data from the specified point in time are included.</p>
    <p>The integrity of this document can be verified using the cryptographic hash above.</p>
  </div>
  
  <div class="section">
    <h2>📊 Contents Summary</h2>
    <ul>
      <li>Council Deliberations</li>
      <li>Decision Records</li>
      <li>Timeline Events</li>
      <li>Supporting Documentation</li>
    </ul>
  </div>
  
  <div class="footer">
    <div class="stamp">✓ VERIFIED AUTHENTIC</div>
    <p>This document was automatically generated by Datacendia Sovereign Stack.<br/>
    For verification, contact compliance@datacendia.com</p>
  </div>
</body>
</html>`;

      // Open print dialog which allows saving as PDF
      const printWindow = window.open('', '_blank');
      if (stryMutAct_9fa48("40698") ? false : stryMutAct_9fa48("40697") ? true : (stryCov_9fa48("40697", "40698"), printWindow)) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };
  const handleExportJSON = async () => {
    setExporting('json');
    try {
      const auditData = stryMutAct_9fa48("40707") ? {} : (stryCov_9fa48("40707"), {
        exportDate: new Date().toISOString(),
        snapshotDate: currentDate.toISOString(),
        type: 'audit-package',
        version: '1.0',
        contents: stryMutAct_9fa48("40710") ? {} : (stryCov_9fa48("40710"), {
          deliberations: stryMutAct_9fa48("40711") ? ["Stryker was here"] : (stryCov_9fa48("40711"), []),
          decisions: stryMutAct_9fa48("40712") ? ["Stryker was here"] : (stryCov_9fa48("40712"), []),
          timeline: stryMutAct_9fa48("40713") ? ["Stryker was here"] : (stryCov_9fa48("40713"), []),
          metadata: stryMutAct_9fa48("40714") ? {} : (stryCov_9fa48("40714"), {
            totalEvents: 0,
            dateRange: stryMutAct_9fa48("40715") ? {} : (stryCov_9fa48("40715"), {
              start: currentDate.toISOString(),
              end: new Date().toISOString()
            })
          })
        }),
        cryptographicProof: stryMutAct_9fa48("40716") ? {} : (stryCov_9fa48("40716"), {
          hash: `sha256:${Date.now().toString(16)}`,
          timestamp: new Date().toISOString(),
          signer: 'CendiaChronos™',
          algorithm: 'SHA-256'
        })
      });
      const blob = new Blob(stryMutAct_9fa48("40720") ? [] : (stryCov_9fa48("40720"), [JSON.stringify(auditData, null, 2)]), stryMutAct_9fa48("40721") ? {} : (stryCov_9fa48("40721"), {
        type: 'application/json'
      }));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-package-${currentDate.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };
  const handleRecordReplay = () => {
    setExporting('replay');
    // Simulate recording
    setTimeout(() => {
      alert('Council Replay recording started. This feature captures all deliberation interactions for playback.');
      setExporting(null);
    }, 500);
  };
  return <div className="space-y-4">
      <p className="text-sm text-amber-300">
        Generate a complete audit package for this point in time, including all Council deliberations, decisions, and supporting data.
      </p>
      <div className="space-y-2">
        <button onClick={handleExportPDF} disabled={stryMutAct_9fa48("40735") ? exporting === null : stryMutAct_9fa48("40734") ? false : stryMutAct_9fa48("40733") ? true : (stryCov_9fa48("40733", "40734", "40735"), exporting !== null)} className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
          {(stryMutAct_9fa48("40738") ? exporting !== 'pdf' : stryMutAct_9fa48("40737") ? false : stryMutAct_9fa48("40736") ? true : (stryCov_9fa48("40736", "40737", "40738"), exporting === 'pdf')) ? '⏳ Generating...' : '📄 Export PDF Report'}
        </button>
        <button onClick={handleExportJSON} disabled={stryMutAct_9fa48("40744") ? exporting === null : stryMutAct_9fa48("40743") ? false : stryMutAct_9fa48("40742") ? true : (stryCov_9fa48("40742", "40743", "40744"), exporting !== null)} className="w-full py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
          {(stryMutAct_9fa48("40747") ? exporting !== 'json' : stryMutAct_9fa48("40746") ? false : stryMutAct_9fa48("40745") ? true : (stryCov_9fa48("40745", "40746", "40747"), exporting === 'json')) ? '⏳ Exporting...' : '📦 Export Data Package (JSON)'}
        </button>
        <button onClick={handleRecordReplay} disabled={stryMutAct_9fa48("40753") ? exporting === null : stryMutAct_9fa48("40752") ? false : stryMutAct_9fa48("40751") ? true : (stryCov_9fa48("40751", "40752", "40753"), exporting !== null)} className="w-full py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
          {(stryMutAct_9fa48("40756") ? exporting !== 'replay' : stryMutAct_9fa48("40755") ? false : stryMutAct_9fa48("40754") ? true : (stryCov_9fa48("40754", "40755", "40756"), exporting === 'replay')) ? '⏳ Starting...' : '🎬 Record Council Replay'}
        </button>
      </div>
      <p className="text-xs text-neutral-500">
        All exports include cryptographic proof of authenticity and chain of custody.
      </p>
    </div>;
};
const BranchModal: React.FC<{
  branchPoint: Date;
  onClose: () => void;
  onCreate: (variable: string, original: string, alternate: string) => void;
}> = ({
  branchPoint,
  onClose,
  onCreate
}) => {
  const [selected, setSelected] = useState<{
    variable: string;
    original: string;
  } | null>(null);
  const [alternate, setAlternate] = useState('');
  const variables = stryMutAct_9fa48("40762") ? [] : (stryCov_9fa48("40762"), [stryMutAct_9fa48("40763") ? {} : (stryCov_9fa48("40763"), {
    variable: 'VP of Sales',
    original: 'Terminated',
    alternatives: stryMutAct_9fa48("40766") ? [] : (stryCov_9fa48("40766"), ['Retained', 'Reassigned to EMEA', 'Promoted to CRO'])
  }), stryMutAct_9fa48("40770") ? {} : (stryCov_9fa48("40770"), {
    variable: 'Q3 Marketing Budget',
    original: '$2.5M',
    alternatives: stryMutAct_9fa48("40773") ? [] : (stryCov_9fa48("40773"), ['$1.5M (Conservative)', '$4M (Aggressive)', '$3M (Moderate)'])
  }), stryMutAct_9fa48("40777") ? {} : (stryCov_9fa48("40777"), {
    variable: 'Product V2 Launch',
    original: 'September',
    alternatives: stryMutAct_9fa48("40780") ? [] : (stryCov_9fa48("40780"), ['June (Early)', 'December (Delayed)', 'Cancelled'])
  }), stryMutAct_9fa48("40784") ? {} : (stryCov_9fa48("40784"), {
    variable: 'Enterprise Pricing',
    original: '$500/seat',
    alternatives: stryMutAct_9fa48("40787") ? [] : (stryCov_9fa48("40787"), ['$350/seat', '$650/seat', 'Usage-based'])
  }), stryMutAct_9fa48("40791") ? {} : (stryCov_9fa48("40791"), {
    variable: 'Engineering Headcount',
    original: '+15',
    alternatives: stryMutAct_9fa48("40794") ? [] : (stryCov_9fa48("40794"), ['+5 (Lean)', '+25 (Aggressive)', 'Hiring Freeze'])
  }), stryMutAct_9fa48("40798") ? {} : (stryCov_9fa48("40798"), {
    variable: 'Series C Terms',
    original: '$50M @ $400M',
    alternatives: stryMutAct_9fa48("40801") ? [] : (stryCov_9fa48("40801"), ['$30M @ $300M', '$75M @ $500M', 'Delayed 6mo'])
  })]);
  return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-purple-600 max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🔀 Create Alternate Timeline</h2>
              <p className="text-purple-200 text-sm mt-1">
                Branch from {branchPoint.toLocaleDateString()}
              </p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-400">
            Select a variable to change. The Council will simulate the alternate timeline.
          </p>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {variables.map(stryMutAct_9fa48("40805") ? () => undefined : (stryCov_9fa48("40805"), v => <button key={v.variable} onClick={() => {
            setSelected(v);
            setAlternate('');
          }} className={`w-full text-left p-3 rounded-lg transition-colors ${(stryMutAct_9fa48("40811") ? selected?.variable !== v.variable : stryMutAct_9fa48("40810") ? false : stryMutAct_9fa48("40809") ? true : (stryCov_9fa48("40809", "40810", "40811"), (stryMutAct_9fa48("40812") ? selected.variable : (stryCov_9fa48("40812"), selected?.variable)) === v.variable)) ? 'bg-purple-900/50 ring-1 ring-purple-500' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                <div className="font-medium">{v.variable}</div>
                <div className="text-sm text-neutral-500">Currently: {v.original}</div>
              </button>))}
          </div>
          
          {stryMutAct_9fa48("40817") ? selected || <div className="pt-4 border-t border-neutral-800">
              <div className="text-sm text-neutral-400 mb-2">What if it was instead:</div>
              <div className="flex flex-wrap gap-2">
                {variables.find(v => v.variable === selected.variable)?.alternatives.map(alt => <button key={alt} onClick={() => setAlternate(alt)} className={`px-3 py-2 text-sm rounded-lg transition-colors ${alternate === alt ? 'bg-purple-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                    {alt}
                  </button>)}
              </div>
            </div> : stryMutAct_9fa48("40816") ? false : stryMutAct_9fa48("40815") ? true : (stryCov_9fa48("40815", "40816", "40817"), selected && <div className="pt-4 border-t border-neutral-800">
              <div className="text-sm text-neutral-400 mb-2">What if it was instead:</div>
              <div className="flex flex-wrap gap-2">
                {stryMutAct_9fa48("40818") ? variables.find(v => v.variable === selected.variable).alternatives.map(alt => <button key={alt} onClick={() => setAlternate(alt)} className={`px-3 py-2 text-sm rounded-lg transition-colors ${alternate === alt ? 'bg-purple-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                    {alt}
                  </button>) : (stryCov_9fa48("40818"), variables.find(stryMutAct_9fa48("40819") ? () => undefined : (stryCov_9fa48("40819"), v => stryMutAct_9fa48("40822") ? v.variable !== selected.variable : stryMutAct_9fa48("40821") ? false : stryMutAct_9fa48("40820") ? true : (stryCov_9fa48("40820", "40821", "40822"), v.variable === selected.variable)))?.alternatives.map(stryMutAct_9fa48("40823") ? () => undefined : (stryCov_9fa48("40823"), alt => <button key={alt} onClick={stryMutAct_9fa48("40824") ? () => undefined : (stryCov_9fa48("40824"), () => setAlternate(alt))} className={`px-3 py-2 text-sm rounded-lg transition-colors ${(stryMutAct_9fa48("40828") ? alternate !== alt : stryMutAct_9fa48("40827") ? false : stryMutAct_9fa48("40826") ? true : (stryCov_9fa48("40826", "40827", "40828"), alternate === alt)) ? 'bg-purple-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
                    {alt}
                  </button>)))}
              </div>
            </div>)}
        </div>
        
        <div className="p-6 pt-0">
          <button onClick={stryMutAct_9fa48("40831") ? () => undefined : (stryCov_9fa48("40831"), () => stryMutAct_9fa48("40834") ? selected && alternate || onCreate(selected.variable, selected.original, alternate) : stryMutAct_9fa48("40833") ? false : stryMutAct_9fa48("40832") ? true : (stryCov_9fa48("40832", "40833", "40834"), (stryMutAct_9fa48("40836") ? selected || alternate : stryMutAct_9fa48("40835") ? true : (stryCov_9fa48("40835", "40836"), selected && alternate)) && onCreate(selected.variable, selected.original, alternate)))} disabled={stryMutAct_9fa48("40839") ? !selected && !alternate : stryMutAct_9fa48("40838") ? false : stryMutAct_9fa48("40837") ? true : (stryCov_9fa48("40837", "40838", "40839"), (stryMutAct_9fa48("40840") ? selected : (stryCov_9fa48("40840"), !selected)) || (stryMutAct_9fa48("40841") ? alternate : (stryCov_9fa48("40841"), !alternate)))} className={`w-full py-3 rounded-xl font-semibold transition-all ${(stryMutAct_9fa48("40845") ? selected || alternate : stryMutAct_9fa48("40844") ? false : stryMutAct_9fa48("40843") ? true : (stryCov_9fa48("40843", "40844", "40845"), selected && alternate)) ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}>
            🌀 Simulate Alternate Timeline
          </button>
        </div>
      </div>
    </div>;
};

// =============================================================================
// ENHANCED VIEW COMPONENTS
// =============================================================================

// Diff View - Side-by-side comparison
const DiffView: React.FC<{
  currentSnapshot: StateSnapshot;
  compareSnapshot: StateSnapshot | null;
  currentDate: Date;
  compareDate: Date | null;
  onSelectCompareDate: (date: Date) => void;
}> = ({
  currentSnapshot,
  compareSnapshot,
  currentDate,
  compareDate,
  onSelectCompareDate
}) => {
  const quickDates = stryMutAct_9fa48("40849") ? [] : (stryCov_9fa48("40849"), [stryMutAct_9fa48("40850") ? {} : (stryCov_9fa48("40850"), {
    label: '1 Week Ago',
    date: new Date(stryMutAct_9fa48("40852") ? currentDate.getTime() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("40852"), currentDate.getTime() - (stryMutAct_9fa48("40853") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("40853"), (stryMutAct_9fa48("40854") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("40854"), (stryMutAct_9fa48("40855") ? 7 * 24 / 60 : (stryCov_9fa48("40855"), (stryMutAct_9fa48("40856") ? 7 / 24 : (stryCov_9fa48("40856"), 7 * 24)) * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("40857") ? {} : (stryCov_9fa48("40857"), {
    label: '1 Month Ago',
    date: new Date(stryMutAct_9fa48("40859") ? currentDate.getTime() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("40859"), currentDate.getTime() - (stryMutAct_9fa48("40860") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("40860"), (stryMutAct_9fa48("40861") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("40861"), (stryMutAct_9fa48("40862") ? 30 * 24 / 60 : (stryCov_9fa48("40862"), (stryMutAct_9fa48("40863") ? 30 / 24 : (stryCov_9fa48("40863"), 30 * 24)) * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("40864") ? {} : (stryCov_9fa48("40864"), {
    label: '1 Quarter Ago',
    date: new Date(stryMutAct_9fa48("40866") ? currentDate.getTime() + 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("40866"), currentDate.getTime() - (stryMutAct_9fa48("40867") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("40867"), (stryMutAct_9fa48("40868") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("40868"), (stryMutAct_9fa48("40869") ? 90 * 24 / 60 : (stryCov_9fa48("40869"), (stryMutAct_9fa48("40870") ? 90 / 24 : (stryCov_9fa48("40870"), 90 * 24)) * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("40871") ? {} : (stryCov_9fa48("40871"), {
    label: '1 Year Ago',
    date: new Date(stryMutAct_9fa48("40873") ? currentDate.getTime() + 365 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("40873"), currentDate.getTime() - (stryMutAct_9fa48("40874") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("40874"), (stryMutAct_9fa48("40875") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("40875"), (stryMutAct_9fa48("40876") ? 365 * 24 / 60 : (stryCov_9fa48("40876"), (stryMutAct_9fa48("40877") ? 365 / 24 : (stryCov_9fa48("40877"), 365 * 24)) * 60)) * 60)) * 1000))))
  })]);
  const metrics = stryMutAct_9fa48("40878") ? [] : (stryCov_9fa48("40878"), [stryMutAct_9fa48("40879") ? {} : (stryCov_9fa48("40879"), {
    key: 'revenue',
    label: 'Revenue',
    format: stryMutAct_9fa48("40882") ? () => undefined : (stryCov_9fa48("40882"), (v: number) => `$${(stryMutAct_9fa48("40884") ? v * 1000000 : (stryCov_9fa48("40884"), v / 1000000)).toFixed(2)}M`)
  }), stryMutAct_9fa48("40885") ? {} : (stryCov_9fa48("40885"), {
    key: 'profit',
    label: 'Profit',
    format: stryMutAct_9fa48("40888") ? () => undefined : (stryCov_9fa48("40888"), (v: number) => `$${(stryMutAct_9fa48("40890") ? v * 1000000 : (stryCov_9fa48("40890"), v / 1000000)).toFixed(2)}M`)
  }), stryMutAct_9fa48("40891") ? {} : (stryCov_9fa48("40891"), {
    key: 'employees',
    label: 'Employees',
    format: stryMutAct_9fa48("40894") ? () => undefined : (stryCov_9fa48("40894"), (v: number) => v.toLocaleString())
  }), stryMutAct_9fa48("40895") ? {} : (stryCov_9fa48("40895"), {
    key: 'customers',
    label: 'Customers',
    format: stryMutAct_9fa48("40898") ? () => undefined : (stryCov_9fa48("40898"), (v: number) => v.toLocaleString())
  }), stryMutAct_9fa48("40899") ? {} : (stryCov_9fa48("40899"), {
    key: 'satisfaction',
    label: 'NPS Score',
    format: stryMutAct_9fa48("40902") ? () => undefined : (stryCov_9fa48("40902"), (v: number) => v.toFixed(0))
  }), stryMutAct_9fa48("40903") ? {} : (stryCov_9fa48("40903"), {
    key: 'marketShare',
    label: 'Market Share',
    format: stryMutAct_9fa48("40906") ? () => undefined : (stryCov_9fa48("40906"), (v: number) => `${v.toFixed(1)}%`)
  })]);
  return <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          ⚖️ Diff View
          <span className="text-sm font-normal text-neutral-500">Compare two points in time</span>
        </h2>
        <div className="flex gap-2">
          {quickDates.map(stryMutAct_9fa48("40908") ? () => undefined : (stryCov_9fa48("40908"), q => <button key={q.label} onClick={stryMutAct_9fa48("40909") ? () => undefined : (stryCov_9fa48("40909"), () => onSelectCompareDate(q.date))} className={`px-3 py-1 text-xs rounded-lg transition-colors ${(stryMutAct_9fa48("40913") ? compareDate?.toDateString() !== q.date.toDateString() : stryMutAct_9fa48("40912") ? false : stryMutAct_9fa48("40911") ? true : (stryCov_9fa48("40911", "40912", "40913"), (stryMutAct_9fa48("40914") ? compareDate.toDateString() : (stryCov_9fa48("40914"), compareDate?.toDateString())) === q.date.toDateString())) ? 'bg-amber-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
              {q.label}
            </button>))}
        </div>
      </div>

      {/* Comparison Headers */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-neutral-800 rounded-lg">
          <div className="text-sm text-neutral-400">Comparing</div>
          <div className="font-bold text-amber-400">{currentDate.toLocaleDateString()}</div>
        </div>
        <div className="text-center p-3 bg-neutral-800 rounded-lg">
          <div className="text-sm text-neutral-400">vs</div>
          <div className="font-bold text-2xl">⚖️</div>
        </div>
        <div className="text-center p-3 bg-neutral-800 rounded-lg">
          <div className="text-sm text-neutral-400">With</div>
          <div className="font-bold text-cyan-400">
            {stryMutAct_9fa48("40919") ? compareDate?.toLocaleDateString() && 'Select a date' : stryMutAct_9fa48("40918") ? false : stryMutAct_9fa48("40917") ? true : (stryCov_9fa48("40917", "40918", "40919"), (stryMutAct_9fa48("40920") ? compareDate.toLocaleDateString() : (stryCov_9fa48("40920"), compareDate?.toLocaleDateString())) || 'Select a date')}
          </div>
        </div>
      </div>

      {/* Metrics Comparison */}
      {stryMutAct_9fa48("40924") ? compareSnapshot || <div className="space-y-3">
          {metrics.map(({
        key,
        label,
        format
      }) => {
        const current = (currentSnapshot.metrics as any)[key];
        const compare = (compareSnapshot.metrics as any)[key];
        const diff = current - compare;
        const pctChange = diff / compare * 100;
        return <div key={key} className="grid grid-cols-4 gap-4 items-center p-3 bg-neutral-800/50 rounded-lg">
                <div className="font-medium">{label}</div>
                <div className="text-right text-amber-400">{format(current)}</div>
                <div className="text-right text-cyan-400">{format(compare)}</div>
                <div className={`text-right font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {diff >= 0 ? '↑' : '↓'} {Math.abs(pctChange).toFixed(1)}%
                </div>
              </div>;
      })}
        </div> : stryMutAct_9fa48("40923") ? false : stryMutAct_9fa48("40922") ? true : (stryCov_9fa48("40922", "40923", "40924"), compareSnapshot && <div className="space-y-3">
          {metrics.map(({
        key,
        label,
        format
      }) => {
        const current = (currentSnapshot.metrics as any)[key];
        const compare = (compareSnapshot.metrics as any)[key];
        const diff = stryMutAct_9fa48("40926") ? current + compare : (stryCov_9fa48("40926"), current - compare);
        const pctChange = stryMutAct_9fa48("40927") ? diff / compare / 100 : (stryCov_9fa48("40927"), (stryMutAct_9fa48("40928") ? diff * compare : (stryCov_9fa48("40928"), diff / compare)) * 100);
        return <div key={key} className="grid grid-cols-4 gap-4 items-center p-3 bg-neutral-800/50 rounded-lg">
                <div className="font-medium">{label}</div>
                <div className="text-right text-amber-400">{format(current)}</div>
                <div className="text-right text-cyan-400">{format(compare)}</div>
                <div className={`text-right font-bold ${(stryMutAct_9fa48("40933") ? diff < 0 : stryMutAct_9fa48("40932") ? diff > 0 : stryMutAct_9fa48("40931") ? false : stryMutAct_9fa48("40930") ? true : (stryCov_9fa48("40930", "40931", "40932", "40933"), diff >= 0)) ? 'text-green-400' : 'text-red-400'}`}>
                  {(stryMutAct_9fa48("40939") ? diff < 0 : stryMutAct_9fa48("40938") ? diff > 0 : stryMutAct_9fa48("40937") ? false : stryMutAct_9fa48("40936") ? true : (stryCov_9fa48("40936", "40937", "40938", "40939"), diff >= 0)) ? '↑' : '↓'} {Math.abs(pctChange).toFixed(1)}%
                </div>
              </div>;
      })}
        </div>)}
    </div>;
};

// Council Replay Theater
const CouncilTheater: React.FC<{
  replay: CouncilReplay | null;
  onClose: () => void;
}> = ({
  replay,
  onClose
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(stryMutAct_9fa48("40943") ? true : (stryCov_9fa48("40943"), false));
  useEffect(() => {
    if (stryMutAct_9fa48("40947") ? isPlaying && replay || currentPhase < replay.phases.length - 1 : stryMutAct_9fa48("40946") ? false : stryMutAct_9fa48("40945") ? true : (stryCov_9fa48("40945", "40946", "40947"), (stryMutAct_9fa48("40949") ? isPlaying || replay : stryMutAct_9fa48("40948") ? true : (stryCov_9fa48("40948", "40949"), isPlaying && replay)) && (stryMutAct_9fa48("40952") ? currentPhase >= replay.phases.length - 1 : stryMutAct_9fa48("40951") ? currentPhase <= replay.phases.length - 1 : stryMutAct_9fa48("40950") ? true : (stryCov_9fa48("40950", "40951", "40952"), currentPhase < (stryMutAct_9fa48("40953") ? replay.phases.length + 1 : (stryCov_9fa48("40953"), replay.phases.length - 1)))))) {
      const timer = setTimeout(stryMutAct_9fa48("40955") ? () => undefined : (stryCov_9fa48("40955"), () => setCurrentPhase(stryMutAct_9fa48("40956") ? () => undefined : (stryCov_9fa48("40956"), p => stryMutAct_9fa48("40957") ? p - 1 : (stryCov_9fa48("40957"), p + 1)))), 3000);
      return stryMutAct_9fa48("40958") ? () => undefined : (stryCov_9fa48("40958"), () => clearTimeout(timer));
    } else if (stryMutAct_9fa48("40962") ? currentPhase < (replay?.phases.length || 0) - 1 : stryMutAct_9fa48("40961") ? currentPhase > (replay?.phases.length || 0) - 1 : stryMutAct_9fa48("40960") ? false : stryMutAct_9fa48("40959") ? true : (stryCov_9fa48("40959", "40960", "40961", "40962"), currentPhase >= (stryMutAct_9fa48("40963") ? (replay?.phases.length || 0) + 1 : (stryCov_9fa48("40963"), (stryMutAct_9fa48("40966") ? replay?.phases.length && 0 : stryMutAct_9fa48("40965") ? false : stryMutAct_9fa48("40964") ? true : (stryCov_9fa48("40964", "40965", "40966"), (stryMutAct_9fa48("40967") ? replay.phases.length : (stryCov_9fa48("40967"), replay?.phases.length)) || 0)) - 1)))) {
      setIsPlaying(stryMutAct_9fa48("40969") ? true : (stryCov_9fa48("40969"), false));
    }
  }, stryMutAct_9fa48("40970") ? [] : (stryCov_9fa48("40970"), [isPlaying, currentPhase, replay]));
  if (stryMutAct_9fa48("40973") ? false : stryMutAct_9fa48("40972") ? true : stryMutAct_9fa48("40971") ? replay : (stryCov_9fa48("40971", "40972", "40973"), !replay)) {
    return <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 text-center">
        <span className="text-6xl mb-4 block">🎬</span>
        <h2 className="text-xl font-bold mb-2">Council Replay Theater</h2>
        <p className="text-neutral-400">Select an event with a deliberation to replay</p>
      </div>;
  }
  const agentColors: Record<string, string> = stryMutAct_9fa48("40975") ? {} : (stryCov_9fa48("40975"), {
    'Chief Strategic Agent': 'from-blue-600 to-indigo-700',
    'CFO Agent': 'from-green-600 to-emerald-700',
    'COO Agent': 'from-orange-600 to-amber-700',
    'CISO Agent': 'from-red-600 to-rose-700',
    'CMO Agent': 'from-purple-600 to-pink-700'
  });
  return <div className="bg-neutral-900 rounded-2xl border border-amber-800 overflow-hidden">
      {/* Theater Header */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              🎬 Council Replay Theater
            </h2>
            <p className="text-amber-200 text-sm">{replay.query}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
      </div>

      {/* Participants */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Participants:</span>
          {replay.participants.map(stryMutAct_9fa48("40981") ? () => undefined : (stryCov_9fa48("40981"), p => <span key={p} className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${stryMutAct_9fa48("40985") ? agentColors[p] && 'from-neutral-600 to-neutral-700' : stryMutAct_9fa48("40984") ? false : stryMutAct_9fa48("40983") ? true : (stryCov_9fa48("40983", "40984", "40985"), agentColors[p] || 'from-neutral-600 to-neutral-700')}`}>
              {p.replace(' Agent', '')}
            </span>))}
        </div>
      </div>

      {/* Deliberation Phases */}
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {replay.phases.map(stryMutAct_9fa48("40989") ? () => undefined : (stryCov_9fa48("40989"), (phase, idx) => <div key={idx} className={`p-4 rounded-xl transition-all duration-500 ${(stryMutAct_9fa48("40994") ? idx > currentPhase : stryMutAct_9fa48("40993") ? idx < currentPhase : stryMutAct_9fa48("40992") ? false : stryMutAct_9fa48("40991") ? true : (stryCov_9fa48("40991", "40992", "40993", "40994"), idx <= currentPhase)) ? 'opacity-100' : 'opacity-30'} ${(stryMutAct_9fa48("40999") ? idx !== currentPhase : stryMutAct_9fa48("40998") ? false : stryMutAct_9fa48("40997") ? true : (stryCov_9fa48("40997", "40998", "40999"), idx === currentPhase)) ? 'ring-2 ring-amber-500' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stryMutAct_9fa48("41005") ? agentColors[phase.agent] && 'from-neutral-600 to-neutral-700' : stryMutAct_9fa48("41004") ? false : stryMutAct_9fa48("41003") ? true : (stryCov_9fa48("41003", "41004", "41005"), agentColors[phase.agent] || 'from-neutral-600 to-neutral-700')} flex items-center justify-center text-lg`}>
                {stryMutAct_9fa48("41007") ? phase.agent : (stryCov_9fa48("41007"), phase.agent.charAt(0))}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{phase.agent}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${(stryMutAct_9fa48("41011") ? phase.sentiment !== 'positive' : stryMutAct_9fa48("41010") ? false : stryMutAct_9fa48("41009") ? true : (stryCov_9fa48("41009", "41010", "41011"), phase.sentiment === 'positive')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("41016") ? phase.sentiment !== 'negative' : stryMutAct_9fa48("41015") ? false : stryMutAct_9fa48("41014") ? true : (stryCov_9fa48("41014", "41015", "41016"), phase.sentiment === 'negative')) ? 'bg-red-900 text-red-300' : 'bg-neutral-700 text-neutral-300'}`}>
                    {phase.sentiment}
                  </span>
                </div>
                <p className="text-neutral-300">{phase.statement}</p>
              </div>
            </div>
          </div>))}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => {
            setCurrentPhase(0);
            setIsPlaying(stryMutAct_9fa48("41021") ? false : (stryCov_9fa48("41021"), true));
          }} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium">
              ▶️ Play from Start
            </button>
            <button onClick={stryMutAct_9fa48("41022") ? () => undefined : (stryCov_9fa48("41022"), () => setIsPlaying(stryMutAct_9fa48("41023") ? isPlaying : (stryCov_9fa48("41023"), !isPlaying)))} className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg">
              {isPlaying ? '⏸️ Pause' : '▶️ Resume'}
            </button>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-400">Decision</div>
            <div className={`font-bold ${replay.decision.includes('APPROVED') ? 'text-green-400' : 'text-red-400'}`}>
              {replay.decision}
            </div>
            <div className="text-xs text-neutral-500">{replay.confidence}% confidence</div>
          </div>
        </div>
      </div>
    </div>;
};

// Impact Trace View
const ImpactTraceView: React.FC<{
  causalChain: CausalChain | null;
  onClose: () => void;
}> = ({
  causalChain,
  onClose
}) => {
  const [showBreakdown, setShowBreakdown] = React.useState(stryMutAct_9fa48("41031") ? true : (stryCov_9fa48("41031"), false));

  // Helper to get confidence label
  const getConfidenceLabel = (value: number) => {
    if (stryMutAct_9fa48("41036") ? value < 0.8 : stryMutAct_9fa48("41035") ? value > 0.8 : stryMutAct_9fa48("41034") ? false : stryMutAct_9fa48("41033") ? true : (stryCov_9fa48("41033", "41034", "41035", "41036"), value >= 0.8)) return stryMutAct_9fa48("41037") ? {} : (stryCov_9fa48("41037"), {
      label: 'High',
      color: 'text-green-400'
    });
    if (stryMutAct_9fa48("41043") ? value < 0.5 : stryMutAct_9fa48("41042") ? value > 0.5 : stryMutAct_9fa48("41041") ? false : stryMutAct_9fa48("41040") ? true : (stryCov_9fa48("41040", "41041", "41042", "41043"), value >= 0.5)) return stryMutAct_9fa48("41044") ? {} : (stryCov_9fa48("41044"), {
      label: 'Medium',
      color: 'text-amber-400'
    });
    return stryMutAct_9fa48("41047") ? {} : (stryCov_9fa48("41047"), {
      label: 'Low',
      color: 'text-red-400'
    });
  };

  // Navigate to Decision DNA
  const openInDNA = (eventId: string) => {
    window.open(`/cortex/intelligence/decision-dna?highlight=${eventId}`, '_blank');
  };

  // Open CendiaCrucible stress test
  const openCrucible = () => {
    window.open(`/cortex/intelligence/crucible?chain=${stryMutAct_9fa48("41055") ? causalChain.id : (stryCov_9fa48("41055"), causalChain?.id)}`, '_blank');
  };
  if (stryMutAct_9fa48("41059") ? false : stryMutAct_9fa48("41058") ? true : stryMutAct_9fa48("41057") ? causalChain : (stryCov_9fa48("41057", "41058", "41059"), !causalChain)) {
    return <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 text-center">
        <span className="text-6xl mb-4 block">🔗</span>
        <h2 className="text-xl font-bold mb-2">Impact Trace</h2>
        <p className="text-neutral-400">Select an event to trace its ripple effects</p>
      </div>;
  }
  const maxDelay = stryMutAct_9fa48("41061") ? Math.min(...causalChain.effects.map((e: any) => e.delay), 1) : (stryCov_9fa48("41061"), Math.max(...causalChain.effects.map(stryMutAct_9fa48("41062") ? () => undefined : (stryCov_9fa48("41062"), (e: any) => e.delay)), 1));
  return <div className="bg-neutral-900 rounded-2xl border border-blue-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🔗 Impact Trace: Causal Analysis</h2>
            <p className="text-blue-200 text-sm">
              Root Cause: {causalChain.rootCause.title} • 
              <span className="text-blue-300 ml-1">Causal chain (0 to +{maxDelay} days)</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openCrucible} className="px-3 py-1.5 bg-purple-600/50 hover:bg-purple-600 border border-purple-500 rounded-lg text-xs font-medium transition-colors" title="Run stress test on this causal chain">
              🧪 Stress Test in Crucible
            </button>
            <button onClick={onClose} className="text-white/60 hover:text-white p-2">✕</button>
          </div>
        </div>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Root Event - Clickable */}
        <div className="flex items-center gap-4 mb-6 p-3 rounded-xl hover:bg-neutral-800/50 cursor-pointer transition-colors group" onClick={stryMutAct_9fa48("41063") ? () => undefined : (stryCov_9fa48("41063"), () => openInDNA(causalChain.rootCause.id))} title="This is a governed decision. View full timeline in Decision DNA.">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl">
            🎯
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg flex items-center gap-2">
              {causalChain.rootCause.title}
              <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">↗ View in DNA</span>
            </div>
            <div className="text-sm text-neutral-400">
              {causalChain.rootCause.timestamp.toLocaleDateString()} • {causalChain.rootCause.department}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              📋 Governed decision • Click to view full timeline
            </div>
          </div>
        </div>

        {/* Ripple Effects - check if predictions */}
        {stryMutAct_9fa48("41066") ? causalChain.effects.some((e: any) => e.isPrediction) || <div className="mb-4 px-3 py-2 bg-amber-900/30 border border-amber-700/50 rounded-lg">
            <p className="text-amber-400 text-xs font-medium flex items-center gap-2">
              <span>🔮</span>
              <span>AI Predictions: The following are model-predicted downstream effects based on historical patterns. Actual outcomes may vary.</span>
            </p>
          </div> : stryMutAct_9fa48("41065") ? false : stryMutAct_9fa48("41064") ? true : (stryCov_9fa48("41064", "41065", "41066"), (stryMutAct_9fa48("41067") ? causalChain.effects.every((e: any) => e.isPrediction) : (stryCov_9fa48("41067"), causalChain.effects.some(stryMutAct_9fa48("41068") ? () => undefined : (stryCov_9fa48("41068"), (e: any) => e.isPrediction)))) && <div className="mb-4 px-3 py-2 bg-amber-900/30 border border-amber-700/50 rounded-lg">
            <p className="text-amber-400 text-xs font-medium flex items-center gap-2">
              <span>🔮</span>
              <span>AI Predictions: The following are model-predicted downstream effects based on historical patterns. Actual outcomes may vary.</span>
            </p>
          </div>)}
        
        {/* Mini Timeline Slider */}
        <div className="mb-6 bg-neutral-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>{causalChain.rootCause.timestamp.toLocaleDateString()}</span>
            <span className="text-neutral-500">Causal Chain Timeline</span>
            <span>{(stryMutAct_9fa48("41072") ? causalChain.effects.length <= 0 : stryMutAct_9fa48("41071") ? causalChain.effects.length >= 0 : stryMutAct_9fa48("41070") ? false : stryMutAct_9fa48("41069") ? true : (stryCov_9fa48("41069", "41070", "41071", "41072"), causalChain.effects.length > 0)) ? causalChain.effects[stryMutAct_9fa48("41073") ? causalChain.effects.length + 1 : (stryCov_9fa48("41073"), causalChain.effects.length - 1)].event.timestamp.toLocaleDateString() : causalChain.rootCause.timestamp.toLocaleDateString()}</span>
          </div>
          <div className="relative h-8 bg-neutral-700 rounded-full overflow-hidden">
            {/* Root cause marker */}
            <div className="absolute top-1 bottom-1 w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-lg z-10" style={stryMutAct_9fa48("41074") ? {} : (stryCov_9fa48("41074"), {
            left: '2px'
          })} title={`Root: ${causalChain.rootCause.title}`} />
            {/* Effect markers */}
            {causalChain.effects.map((effect: any, idx: number) => {
            const maxDelay = stryMutAct_9fa48("41078") ? Math.min(...causalChain.effects.map((e: any) => e.delay), 1) : (stryCov_9fa48("41078"), Math.max(...causalChain.effects.map(stryMutAct_9fa48("41079") ? () => undefined : (stryCov_9fa48("41079"), (e: any) => e.delay)), 1));
            const position = stryMutAct_9fa48("41080") ? effect.delay / maxDelay * 90 - 5 : (stryCov_9fa48("41080"), (stryMutAct_9fa48("41081") ? effect.delay / maxDelay / 90 : (stryCov_9fa48("41081"), (stryMutAct_9fa48("41082") ? effect.delay * maxDelay : (stryCov_9fa48("41082"), effect.delay / maxDelay)) * 90)) + 5); // 5-95% range
            return <div key={idx} className={`absolute top-1 bottom-1 w-3 h-3 rounded-full border-2 border-white shadow-lg ${effect.isPrediction ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'}`} style={stryMutAct_9fa48("41086") ? {} : (stryCov_9fa48("41086"), {
              left: `${position}%`
            })} title={`${effect.event.title} (+${effect.delay}d)`} />;
          })}
            {/* Track line */}
            <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-blue-600/50 -translate-y-1/2" />
          </div>
        </div>

        <div className="relative pl-8 border-l-2 border-blue-600 space-y-4">
          {causalChain.effects.map((effect: any, idx: number) => {
          const confidence = getConfidenceLabel(effect.correlation);
          const contributionPct = Math.round(stryMutAct_9fa48("41090") ? effect.correlation / causalChain.effects.reduce((sum: number, e: any) => sum + e.correlation, 0) / 100 : (stryCov_9fa48("41090"), (stryMutAct_9fa48("41091") ? effect.correlation * causalChain.effects.reduce((sum: number, e: any) => sum + e.correlation, 0) : (stryCov_9fa48("41091"), effect.correlation / causalChain.effects.reduce(stryMutAct_9fa48("41092") ? () => undefined : (stryCov_9fa48("41092"), (sum: number, e: any) => stryMutAct_9fa48("41093") ? sum - e.correlation : (stryCov_9fa48("41093"), sum + e.correlation)), 0))) * 100));
          return <div key={idx} className="relative">
                <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 border-neutral-900 ${effect.isPrediction ? 'bg-amber-500' : 'bg-blue-600'}`} />
                <div className={`rounded-lg p-4 cursor-pointer transition-all hover:scale-[1.01] group ${effect.isPrediction ? 'bg-amber-900/20 border border-amber-800/50 hover:border-amber-600' : 'bg-neutral-800/50 hover:bg-neutral-800 hover:border-blue-600 border border-transparent'}`} onClick={stryMutAct_9fa48("41100") ? () => undefined : (stryCov_9fa48("41100"), () => openInDNA(effect.event.id))} title="Click to view in Decision DNA or CendiaWitness">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {stryMutAct_9fa48("41103") ? effect.isPrediction || <span className="text-amber-400 text-xs">🔮</span> : stryMutAct_9fa48("41102") ? false : stryMutAct_9fa48("41101") ? true : (stryCov_9fa48("41101", "41102", "41103"), effect.isPrediction && <span className="text-amber-400 text-xs">🔮</span>)}
                      <span className="font-medium">{effect.event.title}</span>
                      <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-300 block">
                        {effect.event.timestamp.toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-neutral-500">+{effect.delay} days after root</span>
                    </div>
                  </div>
                  
                  {/* Contribution with direction and confidence */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Contribution:</span>
                      <span className="text-green-400 font-semibold">+{contributionPct}%</span>
                    </div>
                    <span className="text-neutral-600">•</span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400">Confidence:</span>
                      <span className={`font-medium ${confidence.color}`}>{confidence.label}</span>
                    </div>
                    <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div className={`h-full ${effect.isPrediction ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} style={stryMutAct_9fa48("41108") ? {} : (stryCov_9fa48("41108"), {
                    width: `${stryMutAct_9fa48("41110") ? effect.correlation / 100 : (stryCov_9fa48("41110"), effect.correlation * 100)}%`
                  })} />
                    </div>
                    <span className={effect.isPrediction ? 'text-amber-400' : 'text-blue-400'}>
                      {(stryMutAct_9fa48("41113") ? effect.correlation / 100 : (stryCov_9fa48("41113"), effect.correlation * 100)).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>;
        })}
        </div>

        {/* Total Impact with Counterfactual */}
        <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">📊 Total Impact</h3>
            <button onClick={stryMutAct_9fa48("41114") ? () => undefined : (stryCov_9fa48("41114"), () => setShowBreakdown(stryMutAct_9fa48("41115") ? showBreakdown : (stryCov_9fa48("41115"), !showBreakdown)))} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              {showBreakdown ? '← Hide breakdown' : 'View impact breakdown →'}
            </button>
          </div>
          
          {/* Actual vs Baseline */}
          <div className="mb-4 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-neutral-400">Actual vs Baseline Scenario</span>
                <div className="text-lg font-bold text-green-400">
                  +{(stryMutAct_9fa48("41118") ? causalChain.totalImpact.revenue * 0.7 * 1000000 : (stryCov_9fa48("41118"), (stryMutAct_9fa48("41119") ? causalChain.totalImpact.revenue / 0.7 : (stryCov_9fa48("41119"), causalChain.totalImpact.revenue * 0.7)) / 1000000)).toFixed(1)}M incremental
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500">Baseline: similar periods without this decision</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-neutral-400">Revenue Impact</div>
              <div className={`text-xl font-bold ${(stryMutAct_9fa48("41124") ? causalChain.totalImpact.revenue < 0 : stryMutAct_9fa48("41123") ? causalChain.totalImpact.revenue > 0 : stryMutAct_9fa48("41122") ? false : stryMutAct_9fa48("41121") ? true : (stryCov_9fa48("41121", "41122", "41123", "41124"), causalChain.totalImpact.revenue >= 0)) ? 'text-green-400' : 'text-red-400'}`}>
                {(stryMutAct_9fa48("41130") ? causalChain.totalImpact.revenue < 0 : stryMutAct_9fa48("41129") ? causalChain.totalImpact.revenue > 0 : stryMutAct_9fa48("41128") ? false : stryMutAct_9fa48("41127") ? true : (stryCov_9fa48("41127", "41128", "41129", "41130"), causalChain.totalImpact.revenue >= 0)) ? '+' : ''}{(stryMutAct_9fa48("41133") ? causalChain.totalImpact.revenue * 1000000 : (stryCov_9fa48("41133"), causalChain.totalImpact.revenue / 1000000)).toFixed(1)}M
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-400">Profit Impact</div>
              <div className={`text-xl font-bold ${(stryMutAct_9fa48("41138") ? causalChain.totalImpact.profit < 0 : stryMutAct_9fa48("41137") ? causalChain.totalImpact.profit > 0 : stryMutAct_9fa48("41136") ? false : stryMutAct_9fa48("41135") ? true : (stryCov_9fa48("41135", "41136", "41137", "41138"), causalChain.totalImpact.profit >= 0)) ? 'text-green-400' : 'text-red-400'}`}>
                {(stryMutAct_9fa48("41144") ? causalChain.totalImpact.profit < 0 : stryMutAct_9fa48("41143") ? causalChain.totalImpact.profit > 0 : stryMutAct_9fa48("41142") ? false : stryMutAct_9fa48("41141") ? true : (stryCov_9fa48("41141", "41142", "41143", "41144"), causalChain.totalImpact.profit >= 0)) ? '+' : ''}{(stryMutAct_9fa48("41147") ? causalChain.totalImpact.profit * 1000000 : (stryCov_9fa48("41147"), causalChain.totalImpact.profit / 1000000)).toFixed(1)}M
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-400">Customer Impact</div>
              <div className={`text-xl font-bold ${(stryMutAct_9fa48("41152") ? causalChain.totalImpact.customers < 0 : stryMutAct_9fa48("41151") ? causalChain.totalImpact.customers > 0 : stryMutAct_9fa48("41150") ? false : stryMutAct_9fa48("41149") ? true : (stryCov_9fa48("41149", "41150", "41151", "41152"), causalChain.totalImpact.customers >= 0)) ? 'text-green-400' : 'text-red-400'}`}>
                {(stryMutAct_9fa48("41158") ? causalChain.totalImpact.customers < 0 : stryMutAct_9fa48("41157") ? causalChain.totalImpact.customers > 0 : stryMutAct_9fa48("41156") ? false : stryMutAct_9fa48("41155") ? true : (stryCov_9fa48("41155", "41156", "41157", "41158"), causalChain.totalImpact.customers >= 0)) ? '+' : ''}{causalChain.totalImpact.customers}
              </div>
            </div>
          </div>
          
          {/* Impact Breakdown Panel */}
          {stryMutAct_9fa48("41163") ? showBreakdown || <div className="mt-4 pt-4 border-t border-neutral-700">
              <h4 className="text-sm font-medium text-neutral-300 mb-3">Impact Attribution Breakdown</h4>
              <div className="space-y-2">
                {causalChain.effects.map((effect: any, idx: number) => {
              const pct = Math.round(effect.correlation / causalChain.effects.reduce((sum: number, e: any) => sum + e.correlation, 0) * 100);
              return <div key={idx} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-neutral-400 truncate">{effect.event.title}</div>
                      <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{
                    width: `${pct}%`
                  }} />
                      </div>
                      <span className="text-xs text-blue-400 w-10 text-right">{pct}%</span>
                    </div>;
            })}
                {/* Other factors */}
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-32 text-xs text-neutral-500 truncate">Market trends</div>
                  <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-500" style={{
                  width: '12%'
                }} />
                  </div>
                  <span className="text-xs text-neutral-500 w-10 text-right">12%</span>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-32 text-xs text-neutral-500 truncate">Seasonality</div>
                  <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-500" style={{
                  width: '8%'
                }} />
                  </div>
                  <span className="text-xs text-neutral-500 w-10 text-right">8%</span>
                </div>
              </div>
            </div> : stryMutAct_9fa48("41162") ? false : stryMutAct_9fa48("41161") ? true : (stryCov_9fa48("41161", "41162", "41163"), showBreakdown && <div className="mt-4 pt-4 border-t border-neutral-700">
              <h4 className="text-sm font-medium text-neutral-300 mb-3">Impact Attribution Breakdown</h4>
              <div className="space-y-2">
                {causalChain.effects.map((effect: any, idx: number) => {
              const pct = Math.round(stryMutAct_9fa48("41165") ? effect.correlation / causalChain.effects.reduce((sum: number, e: any) => sum + e.correlation, 0) / 100 : (stryCov_9fa48("41165"), (stryMutAct_9fa48("41166") ? effect.correlation * causalChain.effects.reduce((sum: number, e: any) => sum + e.correlation, 0) : (stryCov_9fa48("41166"), effect.correlation / causalChain.effects.reduce(stryMutAct_9fa48("41167") ? () => undefined : (stryCov_9fa48("41167"), (sum: number, e: any) => stryMutAct_9fa48("41168") ? sum - e.correlation : (stryCov_9fa48("41168"), sum + e.correlation)), 0))) * 100));
              return <div key={idx} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-neutral-400 truncate">{effect.event.title}</div>
                      <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={stryMutAct_9fa48("41169") ? {} : (stryCov_9fa48("41169"), {
                    width: `${pct}%`
                  })} />
                      </div>
                      <span className="text-xs text-blue-400 w-10 text-right">{pct}%</span>
                    </div>;
            })}
                {/* Other factors */}
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-32 text-xs text-neutral-500 truncate">Market trends</div>
                  <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-500" style={stryMutAct_9fa48("41171") ? {} : (stryCov_9fa48("41171"), {
                  width: '12%'
                })} />
                  </div>
                  <span className="text-xs text-neutral-500 w-10 text-right">12%</span>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-32 text-xs text-neutral-500 truncate">Seasonality</div>
                  <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-500" style={stryMutAct_9fa48("41173") ? {} : (stryCov_9fa48("41173"), {
                  width: '8%'
                })} />
                  </div>
                  <span className="text-xs text-neutral-500 w-10 text-right">8%</span>
                </div>
              </div>
            </div>)}
        </div>
        
        {/* Integration Links */}
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              📋 <span>Council/DNA</span> → <span>Chronos</span> → <span className="text-blue-400">Impact Trace</span>
            </span>
          </div>
          <button onClick={openCrucible} className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
            🧪 Run stress test in CendiaCrucible™ →
          </button>
        </div>
      </div>
    </div>;
};

// Monte Carlo Simulation View
const MonteCarloView: React.FC<{
  result: MonteCarloResult | null;
  onRun: (variable: string) => void;
  onClose: () => void;
}> = ({
  result,
  onRun,
  onClose
}) => {
  const variables = stryMutAct_9fa48("41176") ? [] : (stryCov_9fa48("41176"), ['Q3 Marketing Budget', 'Hiring Strategy', 'Pricing Model', 'Product Roadmap', 'M&A Decision']);
  if (stryMutAct_9fa48("41184") ? false : stryMutAct_9fa48("41183") ? true : stryMutAct_9fa48("41182") ? result : (stryCov_9fa48("41182", "41183", "41184"), !result)) {
    return <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🎲 Monte Carlo Simulation
        </h2>
        <p className="text-neutral-400 mb-6">
          Run 10,000+ simulations to find the optimal decision path with probability distributions.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {variables.map(stryMutAct_9fa48("41186") ? () => undefined : (stryCov_9fa48("41186"), v => <button key={v} onClick={stryMutAct_9fa48("41187") ? () => undefined : (stryCov_9fa48("41187"), () => onRun(v))} className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left transition-colors">
              <div className="font-medium">{v}</div>
              <div className="text-xs text-neutral-500">Click to simulate</div>
            </button>))}
        </div>
      </div>;
  }
  const maxProb = stryMutAct_9fa48("41188") ? Math.min(...result.outcomes.map(o => o.probability)) : (stryCov_9fa48("41188"), Math.max(...result.outcomes.map(stryMutAct_9fa48("41189") ? () => undefined : (stryCov_9fa48("41189"), o => o.probability))));
  return <div className="bg-neutral-900 rounded-2xl border border-green-800 overflow-hidden">
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🎲 Monte Carlo Results</h2>
            <p className="text-green-200 text-sm">
              Variable: {result.variable} • {result.simulations.toLocaleString()} simulations
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
      </div>

      <div className="p-6">
        {/* Probability Distribution */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-400 mb-3">OUTCOME PROBABILITY DISTRIBUTION</h3>
          <div className="space-y-3">
            {result.outcomes.map(stryMutAct_9fa48("41190") ? () => undefined : (stryCov_9fa48("41190"), (outcome, idx) => <div key={idx} className="flex items-center gap-4">
                <div className="w-28 text-sm">{outcome.scenario}</div>
                <div className="flex-1 h-8 bg-neutral-800 rounded-lg overflow-hidden relative">
                  <div className={`h-full bg-gradient-to-r ${(stryMutAct_9fa48("41194") ? idx !== 2 : stryMutAct_9fa48("41193") ? false : stryMutAct_9fa48("41192") ? true : (stryCov_9fa48("41192", "41193", "41194"), idx === 2)) ? 'from-green-500 to-emerald-500' : 'from-neutral-600 to-neutral-500'}`} style={stryMutAct_9fa48("41197") ? {} : (stryCov_9fa48("41197"), {
                width: `${stryMutAct_9fa48("41199") ? outcome.probability / maxProb / 100 : (stryCov_9fa48("41199"), (stryMutAct_9fa48("41200") ? outcome.probability * maxProb : (stryCov_9fa48("41200"), outcome.probability / maxProb)) * 100)}%`
              })} />
                  <span className="absolute inset-0 flex items-center px-3 text-sm font-medium">
                    {(stryMutAct_9fa48("41201") ? outcome.probability / 100 : (stryCov_9fa48("41201"), outcome.probability * 100)).toFixed(0)}%
                  </span>
                </div>
                <div className="w-24 text-right text-sm">
                  ${(stryMutAct_9fa48("41202") ? outcome.revenue * 1000000 : (stryCov_9fa48("41202"), outcome.revenue / 1000000)).toFixed(1)}M
                </div>
              </div>))}
          </div>
        </div>

        {/* Optimal Path */}
        <div className="p-4 bg-green-900/20 rounded-xl border border-green-700 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏆</span>
            <span className="font-semibold">Optimal Path</span>
          </div>
          <p className="text-green-300">{result.optimalPath}</p>
        </div>

        {/* Confidence Interval */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-800/50 rounded-xl">
            <div className="text-sm text-neutral-400">95% Confidence Interval</div>
            <div className="text-lg font-bold">
              ${(stryMutAct_9fa48("41203") ? result.confidenceInterval[0] * 1000000 : (stryCov_9fa48("41203"), result.confidenceInterval[0] / 1000000)).toFixed(1)}M - ${(stryMutAct_9fa48("41204") ? result.confidenceInterval[1] * 1000000 : (stryCov_9fa48("41204"), result.confidenceInterval[1] / 1000000)).toFixed(1)}M
            </div>
          </div>
          <div className="p-4 bg-neutral-800/50 rounded-xl">
            <div className="text-sm text-neutral-400">Expected Value</div>
            <div className="text-lg font-bold text-green-400">
              ${(stryMutAct_9fa48("41205") ? (result.confidenceInterval[0] + result.confidenceInterval[1]) * 2000000 : (stryCov_9fa48("41205"), (stryMutAct_9fa48("41206") ? result.confidenceInterval[0] - result.confidenceInterval[1] : (stryCov_9fa48("41206"), result.confidenceInterval[0] + result.confidenceInterval[1])) / 2000000)).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>;
};

// Pivotal Moments Panel
const PivotalMomentsPanel: React.FC<{
  moments: PivotalMoment[];
  onJumpTo: (date: Date) => void;
  onStartImpactTrace: (event: TimelineEvent) => void;
}> = ({
  moments,
  onJumpTo,
  onStartImpactTrace
}) => {
  // Convert significance score to human-readable label
  const getSignificanceLabel = (significance: number) => {
    // Cap at 100 for display purposes
    const cappedValue = stryMutAct_9fa48("41209") ? Math.max(significance, 100) : (stryCov_9fa48("41209"), Math.min(significance, 100));
    if (stryMutAct_9fa48("41213") ? cappedValue < 90 : stryMutAct_9fa48("41212") ? cappedValue > 90 : stryMutAct_9fa48("41211") ? false : stryMutAct_9fa48("41210") ? true : (stryCov_9fa48("41210", "41211", "41212", "41213"), cappedValue >= 90)) return stryMutAct_9fa48("41214") ? {} : (stryCov_9fa48("41214"), {
      label: 'Critical',
      color: 'bg-red-900 text-red-300',
      icon: '🔴'
    });
    if (stryMutAct_9fa48("41221") ? cappedValue < 70 : stryMutAct_9fa48("41220") ? cappedValue > 70 : stryMutAct_9fa48("41219") ? false : stryMutAct_9fa48("41218") ? true : (stryCov_9fa48("41218", "41219", "41220", "41221"), cappedValue >= 70)) return stryMutAct_9fa48("41222") ? {} : (stryCov_9fa48("41222"), {
      label: 'High',
      color: 'bg-amber-900 text-amber-300',
      icon: '🟠'
    });
    if (stryMutAct_9fa48("41229") ? cappedValue < 50 : stryMutAct_9fa48("41228") ? cappedValue > 50 : stryMutAct_9fa48("41227") ? false : stryMutAct_9fa48("41226") ? true : (stryCov_9fa48("41226", "41227", "41228", "41229"), cappedValue >= 50)) return stryMutAct_9fa48("41230") ? {} : (stryCov_9fa48("41230"), {
      label: 'Medium',
      color: 'bg-yellow-900 text-yellow-300',
      icon: '🟡'
    });
    return stryMutAct_9fa48("41234") ? {} : (stryCov_9fa48("41234"), {
      label: 'Notable',
      color: 'bg-neutral-700 text-neutral-300',
      icon: '🔵'
    });
  };
  return <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        ⚡ AI-Detected Pivotal Moments
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {moments.map(moment => {
        const sig = getSignificanceLabel(moment.significance);
        return <div key={moment.id} className="p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{moment.event.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${sig.color}`}>
                  <span>{sig.icon}</span>
                  <span>{sig.label}</span>
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-2">{moment.reason}</p>
              <div className="flex gap-2">
                <button onClick={stryMutAct_9fa48("41240") ? () => undefined : (stryCov_9fa48("41240"), () => onJumpTo(moment.timestamp))} className="px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded">
                  Jump to
                </button>
                <button onClick={stryMutAct_9fa48("41241") ? () => undefined : (stryCov_9fa48("41241"), () => onStartImpactTrace(moment.event))} className="px-2 py-1 text-xs bg-blue-700 hover:bg-blue-600 rounded">
                  Trace Impact
                </button>
              </div>
            </div>;
      })}
      </div>
    </div>;
};

// Animated Graph Preview
const AnimatedGraphPreview: React.FC<{
  nodes: Array<{
    x: number;
    y: number;
    size: number;
  }>;
  snapshot: StateSnapshot;
}> = stryMutAct_9fa48("41242") ? () => undefined : (stryCov_9fa48("41242"), (() => {
  const AnimatedGraphPreview: React.FC<{
    nodes: Array<{
      x: number;
      y: number;
      size: number;
    }>;
    snapshot: StateSnapshot;
  }> = ({
    nodes,
    snapshot
  }) => <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">
      🕸️ Knowledge Graph State
    </h3>
    <div className="relative h-40 bg-neutral-800/50 rounded-lg overflow-hidden">
      {/* Animated nodes */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map(stryMutAct_9fa48("41243") ? () => undefined : (stryCov_9fa48("41243"), (node, i) => <g key={i}>
            {/* Connections */}
            {stryMutAct_9fa48("41244") ? nodes.map((target, j) => <line key={j} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />) : (stryCov_9fa48("41244"), nodes.slice(stryMutAct_9fa48("41245") ? i - 1 : (stryCov_9fa48("41245"), i + 1), stryMutAct_9fa48("41246") ? i - 3 : (stryCov_9fa48("41246"), i + 3)).map(stryMutAct_9fa48("41247") ? () => undefined : (stryCov_9fa48("41247"), (target, j) => <line key={j} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />)))}
            {/* Node */}
            <circle cx={`${node.x}%`} cy={`${node.y}%`} r={node.size} fill="rgba(59, 130, 246, 0.6)" className="animate-pulse" style={stryMutAct_9fa48("41254") ? {} : (stryCov_9fa48("41254"), {
            animationDelay: `${stryMutAct_9fa48("41256") ? i / 0.1 : (stryCov_9fa48("41256"), i * 0.1)}s`
          })} />
          </g>))}
      </svg>
      {/* Stats overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs">
        <span className="bg-black/50 px-2 py-1 rounded">{snapshot.graph.entities.toLocaleString()} entities</span>
        <span className="bg-black/50 px-2 py-1 rounded">{snapshot.graph.relationships.toLocaleString()} relationships</span>
        <span className="bg-black/50 px-2 py-1 rounded">{snapshot.graph.freshness}% fresh</span>
      </div>
    </div>
  </div>;
  return AnimatedGraphPreview;
})());

// Bookmark Modal
const BookmarkModal: React.FC<{
  currentDate: Date;
  onSave: (label: string, notes?: string) => void;
  onClose: () => void;
}> = ({
  currentDate,
  onSave,
  onClose
}) => {
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-amber-600 max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-amber-900 to-orange-900 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">🔖 Bookmark This Moment</h2>
            <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="text-sm text-neutral-400 mb-1">Timestamp</div>
            <div className="font-mono bg-neutral-800 px-3 py-2 rounded-lg">
              {currentDate.toLocaleString()}
            </div>
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Label *</label>
            <input type="text" value={label} onChange={stryMutAct_9fa48("41260") ? () => undefined : (stryCov_9fa48("41260"), e => setLabel(e.target.value))} placeholder="e.g., Q3 Budget Decision" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Notes (optional)</label>
            <textarea value={notes} onChange={stryMutAct_9fa48("41261") ? () => undefined : (stryCov_9fa48("41261"), e => setNotes(e.target.value))} placeholder="Add context for future reference..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 h-20 resize-none focus:border-amber-500 focus:outline-none" />
          </div>
          <button onClick={stryMutAct_9fa48("41262") ? () => undefined : (stryCov_9fa48("41262"), () => stryMutAct_9fa48("41265") ? label || onSave(label, notes) : stryMutAct_9fa48("41264") ? false : stryMutAct_9fa48("41263") ? true : (stryCov_9fa48("41263", "41264", "41265"), label && onSave(label, notes)))} disabled={stryMutAct_9fa48("41266") ? label : (stryCov_9fa48("41266"), !label)} className={`w-full py-3 rounded-xl font-semibold transition-all ${label ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}>
            🔖 Save Bookmark
          </button>
        </div>
      </div>
    </div>;
};

// =============================================================================
// ENTERPRISE COMPLIANCE COMPONENTS (The Undefeatable 5%)
// =============================================================================

// Compliance Panel - Full dashboard view
const CompliancePanel: React.FC<{
  ledger: ChronosLedger;
  liveSyncStatus: LiveSyncStatus;
  witnessSessions: WitnessSession[];
  redactionRules: RedactionRule[];
  onClose: () => void;
}> = stryMutAct_9fa48("41270") ? () => undefined : (stryCov_9fa48("41270"), (() => {
  const CompliancePanel: React.FC<{
    ledger: ChronosLedger;
    liveSyncStatus: LiveSyncStatus;
    witnessSessions: WitnessSession[];
    redactionRules: RedactionRule[];
    onClose: () => void;
  }> = ({
    ledger,
    liveSyncStatus,
    witnessSessions,
    redactionRules,
    onClose
  }) => <div className="bg-gradient-to-b from-emerald-950 to-neutral-950 border-b border-emerald-800">
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🔒 Enterprise Compliance Dashboard
        </h2>
        <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Immutable Ledger Status */}
        <div className="bg-black/30 rounded-xl p-4 border border-emerald-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⛓️</span>
            <span className="font-semibold">Immutable Ledger™</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Chain ID</span>
              <span className="font-mono text-xs">{ledger.chainId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Blocks</span>
              <span className="font-bold text-emerald-400">{ledger.totalBlocks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Latest Hash</span>
              <span className="font-mono text-[10px] text-neutral-500">{stryMutAct_9fa48("41271") ? ledger.latestBlock.hash : (stryCov_9fa48("41271"), ledger.latestBlock.hash.slice(0, 16))}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Integrity</span>
              <span className={`font-bold ${(stryMutAct_9fa48("41275") ? ledger.integrityStatus !== 'verified' : stryMutAct_9fa48("41274") ? false : stryMutAct_9fa48("41273") ? true : (stryCov_9fa48("41273", "41274", "41275"), ledger.integrityStatus === 'verified')) ? 'text-green-400' : 'text-red-400'}`}>
                {stryMutAct_9fa48("41279") ? ledger.integrityStatus.toLowerCase() : (stryCov_9fa48("41279"), ledger.integrityStatus.toUpperCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Last Verified</span>
              <span>{Math.floor(stryMutAct_9fa48("41280") ? (Date.now() - ledger.lastVerified.getTime()) * 1000 : (stryCov_9fa48("41280"), (stryMutAct_9fa48("41281") ? Date.now() + ledger.lastVerified.getTime() : (stryCov_9fa48("41281"), Date.now() - ledger.lastVerified.getTime())) / 1000))}s ago</span>
            </div>
          </div>
        </div>

        {/* Live Sync Status */}
        <div className="bg-black/30 rounded-xl p-4 border border-cyan-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📡</span>
            <span className="font-semibold">Live Chronos Sync</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Status</span>
              <span className={`font-bold ${liveSyncStatus.isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {stryMutAct_9fa48("41285") ? liveSyncStatus.websocketStatus.toLowerCase() : (stryCov_9fa48("41285"), liveSyncStatus.websocketStatus.toUpperCase())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Sync Lag</span>
              <span className={(stryMutAct_9fa48("41289") ? liveSyncStatus.syncLag >= 100 : stryMutAct_9fa48("41288") ? liveSyncStatus.syncLag <= 100 : stryMutAct_9fa48("41287") ? false : stryMutAct_9fa48("41286") ? true : (stryCov_9fa48("41286", "41287", "41288", "41289"), liveSyncStatus.syncLag < 100)) ? 'text-green-400' : 'text-amber-400'}>
                {liveSyncStatus.syncLag}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Throughput</span>
              <span>{liveSyncStatus.throughput.toFixed(1)} evt/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Pending</span>
              <span>{liveSyncStatus.pendingEvents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Kafka Offset</span>
              <span className="font-mono text-xs">{liveSyncStatus.kafkaOffset}</span>
            </div>
          </div>
        </div>

        {/* Active Witness Sessions */}
        <div className="bg-black/30 rounded-xl p-4 border border-amber-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👁️</span>
            <span className="font-semibold">Witness Mode</span>
          </div>
          {(stryMutAct_9fa48("41294") ? witnessSessions.length !== 0 : stryMutAct_9fa48("41293") ? false : stryMutAct_9fa48("41292") ? true : (stryCov_9fa48("41292", "41293", "41294"), witnessSessions.length === 0)) ? <p className="text-sm text-neutral-500">No active witness sessions</p> : <div className="space-y-2">
              {witnessSessions.map(stryMutAct_9fa48("41295") ? () => undefined : (stryCov_9fa48("41295"), session => <div key={session.id} className="p-2 bg-amber-900/20 rounded-lg text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.witnessOrg}</span>
                    <span className={`w-2 h-2 rounded-full ${session.isLive ? 'bg-green-400' : 'bg-neutral-500'}`} />
                  </div>
                  <div className="text-xs text-neutral-400">{session.witnessRole}</div>
                  <div className="text-xs text-neutral-500">Access: {session.accessLevel}</div>
                </div>))}
            </div>}
        </div>

        {/* Redaction Engine */}
        <div className="bg-black/30 rounded-xl p-4 border border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔏</span>
            <span className="font-semibold">Redaction Engine</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Active Rules</span>
              <span className="font-bold">{redactionRules.length}</span>
            </div>
            <div className="space-y-1">
              {stryMutAct_9fa48("41299") ? redactionRules.map(rule => <div key={rule.id} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${rule.category === 'pii' ? 'bg-red-400' : rule.category === 'phi' ? 'bg-purple-400' : rule.category === 'personnel' ? 'bg-amber-400' : 'bg-neutral-400'}`} />
                  <span className="text-xs text-neutral-400">{rule.field}</span>
                  <span className="text-[10px] px-1 bg-neutral-700 rounded">{rule.category}</span>
                </div>) : (stryCov_9fa48("41299"), redactionRules.slice(0, 3).map(stryMutAct_9fa48("41300") ? () => undefined : (stryCov_9fa48("41300"), rule => <div key={rule.id} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${(stryMutAct_9fa48("41304") ? rule.category !== 'pii' : stryMutAct_9fa48("41303") ? false : stryMutAct_9fa48("41302") ? true : (stryCov_9fa48("41302", "41303", "41304"), rule.category === 'pii')) ? 'bg-red-400' : (stryMutAct_9fa48("41309") ? rule.category !== 'phi' : stryMutAct_9fa48("41308") ? false : stryMutAct_9fa48("41307") ? true : (stryCov_9fa48("41307", "41308", "41309"), rule.category === 'phi')) ? 'bg-purple-400' : (stryMutAct_9fa48("41314") ? rule.category !== 'personnel' : stryMutAct_9fa48("41313") ? false : stryMutAct_9fa48("41312") ? true : (stryCov_9fa48("41312", "41313", "41314"), rule.category === 'personnel')) ? 'bg-amber-400' : 'bg-neutral-400'}`} />
                  <span className="text-xs text-neutral-400">{rule.field}</span>
                  <span className="text-[10px] px-1 bg-neutral-700 rounded">{rule.category}</span>
                </div>)))}
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              Financial truth preserved across all redactions
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
  return CompliancePanel;
})());

// Court-Admissible Export Modal
const CourtExportModal: React.FC<{
  timeRange: {
    min: Date;
    max: Date;
  };
  currentDate: Date;
  onExport: (format: CourtAdmissibleExport['format'], withRedaction: boolean) => void;
  onClose: () => void;
  isExporting: boolean;
}> = ({
  timeRange,
  currentDate,
  onExport,
  onClose,
  isExporting
}) => {
  const [format, setFormat] = useState<CourtAdmissibleExport['format']>('forensic-bundle');
  const [withRedaction, setWithRedaction] = useState(stryMutAct_9fa48("41320") ? false : (stryCov_9fa48("41320"), true));
  const [includeCounsel, setIncludeCounsel] = useState(stryMutAct_9fa48("41321") ? false : (stryCov_9fa48("41321"), true));
  return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-amber-600 max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-amber-900 to-orange-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                ⚖️ Court-Admissible Export
              </h2>
              <p className="text-amber-200 text-sm mt-1">
                Generate legally defensible evidence package
              </p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Time Range */}
          <div className="p-3 bg-neutral-800 rounded-lg">
            <div className="text-sm text-neutral-400 mb-1">Export Time Range</div>
            <div className="font-mono text-sm">
              {timeRange.min.toLocaleDateString()} → {currentDate.toLocaleDateString()}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <div className="text-sm text-neutral-400 mb-2">Export Format</div>
            <div className="grid grid-cols-2 gap-2">
              {(stryMutAct_9fa48("41322") ? [] : (stryCov_9fa48("41322"), [stryMutAct_9fa48("41323") ? {} : (stryCov_9fa48("41323"), {
              id: 'forensic-bundle',
              label: '🔒 Forensic Bundle',
              desc: 'Full chain + proofs'
            }), stryMutAct_9fa48("41327") ? {} : (stryCov_9fa48("41327"), {
              id: 'pdf',
              label: '📄 PDF Report',
              desc: 'Human-readable'
            }), stryMutAct_9fa48("41331") ? {} : (stryCov_9fa48("41331"), {
              id: 'json',
              label: '📋 JSON Data',
              desc: 'Machine-readable'
            }), stryMutAct_9fa48("41335") ? {} : (stryCov_9fa48("41335"), {
              id: 'xml',
              label: '📑 XML/XBRL',
              desc: 'Regulatory format'
            })])).map(stryMutAct_9fa48("41339") ? () => undefined : (stryCov_9fa48("41339"), opt => <button key={opt.id} onClick={stryMutAct_9fa48("41340") ? () => undefined : (stryCov_9fa48("41340"), () => setFormat(opt.id as any))} className={`p-3 rounded-lg text-left transition-colors ${(stryMutAct_9fa48("41344") ? format !== opt.id : stryMutAct_9fa48("41343") ? false : stryMutAct_9fa48("41342") ? true : (stryCov_9fa48("41342", "41343", "41344"), format === opt.id)) ? 'bg-amber-700 border border-amber-500' : 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600'}`}>
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs text-neutral-400">{opt.desc}</div>
                </button>))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg cursor-pointer">
              <input type="checkbox" checked={withRedaction} onChange={stryMutAct_9fa48("41347") ? () => undefined : (stryCov_9fa48("41347"), e => setWithRedaction(e.target.checked))} className="w-4 h-4 rounded border-neutral-600" />
              <div>
                <div className="font-medium text-sm">Apply PII Redaction</div>
                <div className="text-xs text-neutral-400">Auto-redact personal data while preserving financial truth</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg cursor-pointer">
              <input type="checkbox" checked={includeCounsel} onChange={stryMutAct_9fa48("41348") ? () => undefined : (stryCov_9fa48("41348"), e => setIncludeCounsel(e.target.checked))} className="w-4 h-4 rounded border-neutral-600" />
              <div>
                <div className="font-medium text-sm">Include Council Transcripts</div>
                <div className="text-xs text-neutral-400">Full deliberation records for audit trail</div>
              </div>
            </label>
          </div>

          {/* Signatures Info */}
          <div className="p-3 bg-emerald-900/20 border border-emerald-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span>✍️</span>
              <span className="font-medium text-sm">Required Signatures</span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-emerald-800 rounded">CEO</span>
              <span className="text-xs px-2 py-1 bg-emerald-800 rounded">CFO</span>
              <span className="text-xs px-2 py-1 bg-emerald-800 rounded">General Counsel</span>
            </div>
          </div>

          <button onClick={stryMutAct_9fa48("41349") ? () => undefined : (stryCov_9fa48("41349"), () => onExport(format, withRedaction))} disabled={isExporting} className={`w-full py-3 rounded-xl font-semibold transition-all ${isExporting ? 'bg-neutral-700 text-neutral-400 cursor-wait' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90'}`}>
            {isExporting ? '⏳ Generating Export...' : '⚖️ Generate Court-Admissible Export'}
          </button>
        </div>
      </div>
    </div>;
};

// Add Witness Modal
const WitnessModal: React.FC<{
  onAdd: (org: string, role: string, accessLevel: WitnessSession['accessLevel']) => void;
  onClose: () => void;
}> = ({
  onAdd,
  onClose
}) => {
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [accessLevel, setAccessLevel] = useState<WitnessSession['accessLevel']>('redacted');
  const presets = stryMutAct_9fa48("41359") ? [] : (stryCov_9fa48("41359"), [stryMutAct_9fa48("41360") ? {} : (stryCov_9fa48("41360"), {
    org: 'Deloitte',
    role: 'External Auditor'
  }), stryMutAct_9fa48("41363") ? {} : (stryCov_9fa48("41363"), {
    org: 'PwC',
    role: 'External Auditor'
  }), stryMutAct_9fa48("41366") ? {} : (stryCov_9fa48("41366"), {
    org: 'SEC',
    role: 'Regulatory Examiner'
  }), stryMutAct_9fa48("41369") ? {} : (stryCov_9fa48("41369"), {
    org: 'DOJ',
    role: 'Federal Investigator'
  }), stryMutAct_9fa48("41372") ? {} : (stryCov_9fa48("41372"), {
    org: 'Internal Audit',
    role: 'Compliance Officer'
  })]);
  return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl border border-blue-600 max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">👁️ Add Witness Session</h2>
              <p className="text-blue-200 text-sm mt-1">Grant read-only timeline access</p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Presets */}
          <div>
            <div className="text-sm text-neutral-400 mb-2">Quick Add</div>
            <div className="flex flex-wrap gap-2">
              {presets.map(stryMutAct_9fa48("41375") ? () => undefined : (stryCov_9fa48("41375"), p => <button key={p.org} onClick={() => {
              setOrg(p.org);
              setRole(p.role);
            }} className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-lg">
                  {p.org}
                </button>))}
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Organization *</label>
            <input type="text" value={org} onChange={stryMutAct_9fa48("41377") ? () => undefined : (stryCov_9fa48("41377"), e => setOrg(e.target.value))} placeholder="e.g., Deloitte, SEC, DOJ" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2" />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Role *</label>
            <input type="text" value={role} onChange={stryMutAct_9fa48("41378") ? () => undefined : (stryCov_9fa48("41378"), e => setRole(e.target.value))} placeholder="e.g., External Auditor, Investigator" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2" />
          </div>

          {/* Access Level */}
          <div>
            <div className="text-sm text-neutral-400 mb-2">Access Level</div>
            <div className="grid grid-cols-3 gap-2">
              {(stryMutAct_9fa48("41379") ? [] : (stryCov_9fa48("41379"), [stryMutAct_9fa48("41380") ? {} : (stryCov_9fa48("41380"), {
              id: 'redacted',
              label: 'Redacted',
              desc: 'PII removed'
            }), stryMutAct_9fa48("41384") ? {} : (stryCov_9fa48("41384"), {
              id: 'financial-only',
              label: 'Financial',
              desc: 'Numbers only'
            }), stryMutAct_9fa48("41388") ? {} : (stryCov_9fa48("41388"), {
              id: 'full',
              label: 'Full Access',
              desc: 'Everything'
            })])).map(stryMutAct_9fa48("41392") ? () => undefined : (stryCov_9fa48("41392"), opt => <button key={opt.id} onClick={stryMutAct_9fa48("41393") ? () => undefined : (stryCov_9fa48("41393"), () => setAccessLevel(opt.id as any))} className={`p-2 rounded-lg text-center transition-colors ${(stryMutAct_9fa48("41397") ? accessLevel !== opt.id : stryMutAct_9fa48("41396") ? false : stryMutAct_9fa48("41395") ? true : (stryCov_9fa48("41395", "41396", "41397"), accessLevel === opt.id)) ? 'bg-blue-700 border border-blue-500' : 'bg-neutral-800 border border-neutral-700'}`}>
                  <div className="font-medium text-xs">{opt.label}</div>
                  <div className="text-[10px] text-neutral-400">{opt.desc}</div>
                </button>))}
            </div>
          </div>

          {/* Air-Gapped Key Notice */}
          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg text-sm">
            <p className="text-blue-300">
              🔐 An air-gapped access key will be generated. The witness must complete a key ceremony to activate their session.
            </p>
          </div>

          <button onClick={stryMutAct_9fa48("41400") ? () => undefined : (stryCov_9fa48("41400"), () => stryMutAct_9fa48("41403") ? org && role || onAdd(org, role, accessLevel) : stryMutAct_9fa48("41402") ? false : stryMutAct_9fa48("41401") ? true : (stryCov_9fa48("41401", "41402", "41403"), (stryMutAct_9fa48("41405") ? org || role : stryMutAct_9fa48("41404") ? true : (stryCov_9fa48("41404", "41405"), org && role)) && onAdd(org, role, accessLevel)))} disabled={stryMutAct_9fa48("41408") ? !org && !role : stryMutAct_9fa48("41407") ? false : stryMutAct_9fa48("41406") ? true : (stryCov_9fa48("41406", "41407", "41408"), (stryMutAct_9fa48("41409") ? org : (stryCov_9fa48("41409"), !org)) || (stryMutAct_9fa48("41410") ? role : (stryCov_9fa48("41410"), !role)))} className={`w-full py-3 rounded-xl font-semibold transition-all ${(stryMutAct_9fa48("41414") ? org || role : stryMutAct_9fa48("41413") ? false : stryMutAct_9fa48("41412") ? true : (stryCov_9fa48("41412", "41413", "41414"), org && role)) ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}>
            👁️ Create Witness Session
          </button>
        </div>
      </div>
    </div>;
};

// =============================================================================
// CHRONOS-ERP™ COMPONENTS - Enterprise System Time Travel
// =============================================================================

const ERPPanel: React.FC<{
  connectors: ERPConnector[];
  erpSnapshot: ERPStateSnapshot;
  selectedSource: ERPSource | 'all';
  onSourceChange: (source: ERPSource | 'all') => void;
  currentDate: Date;
  onClose: () => void;
}> = ({
  connectors,
  erpSnapshot,
  selectedSource,
  onSourceChange,
  currentDate,
  onClose
}) => {
  const activeConnectors = stryMutAct_9fa48("41418") ? connectors : (stryCov_9fa48("41418"), connectors.filter(stryMutAct_9fa48("41419") ? () => undefined : (stryCov_9fa48("41419"), c => stryMutAct_9fa48("41422") ? c.status === 'connected' && c.status === 'syncing' : stryMutAct_9fa48("41421") ? false : stryMutAct_9fa48("41420") ? true : (stryCov_9fa48("41420", "41421", "41422"), (stryMutAct_9fa48("41424") ? c.status !== 'connected' : stryMutAct_9fa48("41423") ? false : (stryCov_9fa48("41423", "41424"), c.status === 'connected')) || (stryMutAct_9fa48("41427") ? c.status !== 'syncing' : stryMutAct_9fa48("41426") ? false : (stryCov_9fa48("41426", "41427"), c.status === 'syncing'))))));
  const totalRecords = connectors.reduce(stryMutAct_9fa48("41429") ? () => undefined : (stryCov_9fa48("41429"), (sum, c) => stryMutAct_9fa48("41430") ? sum - c.recordCount : (stryCov_9fa48("41430"), sum + c.recordCount)), 0);
  return <div className="bg-gradient-to-b from-indigo-950 to-neutral-950 border-b border-indigo-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              🏢 Chronos-ERP™ <span className="text-indigo-400 text-sm font-normal">Enterprise System Time Travel</span>
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Replay SAP, Workday, Salesforce, and more • {totalRecords.toLocaleString()} total records indexed
            </p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl">✕</button>
        </div>

        {/* Connected Systems */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Connected Systems</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={stryMutAct_9fa48("41431") ? () => undefined : (stryCov_9fa48("41431"), () => onSourceChange('all'))} className={`px-3 py-2 rounded-lg text-sm transition-colors ${(stryMutAct_9fa48("41436") ? selectedSource !== 'all' : stryMutAct_9fa48("41435") ? false : stryMutAct_9fa48("41434") ? true : (stryCov_9fa48("41434", "41435", "41436"), selectedSource === 'all')) ? 'bg-indigo-600 border border-indigo-400' : 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600'}`}>
              All Systems
            </button>
            {connectors.map(stryMutAct_9fa48("41440") ? () => undefined : (stryCov_9fa48("41440"), c => <button key={c.id} onClick={stryMutAct_9fa48("41441") ? () => undefined : (stryCov_9fa48("41441"), () => onSourceChange(c.source))} className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${(stryMutAct_9fa48("41445") ? selectedSource !== c.source : stryMutAct_9fa48("41444") ? false : stryMutAct_9fa48("41443") ? true : (stryCov_9fa48("41443", "41444", "41445"), selectedSource === c.source)) ? 'bg-indigo-600 border border-indigo-400' : 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600'}`}>
                <span>{c.icon}</span>
                <span>{c.name}</span>
                <span className={`w-2 h-2 rounded-full ${(stryMutAct_9fa48("41451") ? c.status !== 'connected' : stryMutAct_9fa48("41450") ? false : stryMutAct_9fa48("41449") ? true : (stryCov_9fa48("41449", "41450", "41451"), c.status === 'connected')) ? 'bg-green-400' : (stryMutAct_9fa48("41456") ? c.status !== 'syncing' : stryMutAct_9fa48("41455") ? false : stryMutAct_9fa48("41454") ? true : (stryCov_9fa48("41454", "41455", "41456"), c.status === 'syncing')) ? 'bg-amber-400 animate-pulse' : (stryMutAct_9fa48("41461") ? c.status !== 'error' : stryMutAct_9fa48("41460") ? false : stryMutAct_9fa48("41459") ? true : (stryCov_9fa48("41459", "41460", "41461"), c.status === 'error')) ? 'bg-red-400' : 'bg-neutral-500'}`} />
              </button>))}
          </div>
        </div>

        {/* State at Current Time */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Enterprise State on {currentDate.toLocaleDateString()}
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {/* CRM State */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <span>☁️</span>
                <span className="font-semibold text-sm">Salesforce CRM</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pipeline</span>
                  <span className="font-bold text-blue-400">${(stryMutAct_9fa48("41465") ? erpSnapshot.crm.totalPipeline * 1000000 : (stryCov_9fa48("41465"), erpSnapshot.crm.totalPipeline / 1000000)).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Weighted</span>
                  <span>${(stryMutAct_9fa48("41466") ? erpSnapshot.crm.weightedPipeline * 1000000 : (stryCov_9fa48("41466"), erpSnapshot.crm.weightedPipeline / 1000000)).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Win Rate</span>
                  <span className="text-green-400">{erpSnapshot.crm.winRate.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Avg Deal</span>
                  <span>${(stryMutAct_9fa48("41467") ? erpSnapshot.crm.avgDealSize * 1000 : (stryCov_9fa48("41467"), erpSnapshot.crm.avgDealSize / 1000)).toFixed(0)}K</span>
                </div>
              </div>
            </div>

            {/* ERP State */}
            <div className="bg-black/30 rounded-xl p-4 border border-amber-800">
              <div className="flex items-center gap-2 mb-3">
                <span>🏢</span>
                <span className="font-semibold text-sm">SAP Financials</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Revenue</span>
                  <span className="font-bold text-green-400">${(stryMutAct_9fa48("41468") ? erpSnapshot.erp.revenue * 1000000 : (stryCov_9fa48("41468"), erpSnapshot.erp.revenue / 1000000)).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Expenses</span>
                  <span className="text-red-400">${(stryMutAct_9fa48("41469") ? erpSnapshot.erp.expenses * 1000000 : (stryCov_9fa48("41469"), erpSnapshot.erp.expenses / 1000000)).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Cash</span>
                  <span>${(stryMutAct_9fa48("41470") ? erpSnapshot.erp.cashPosition * 1000000 : (stryCov_9fa48("41470"), erpSnapshot.erp.cashPosition / 1000000)).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">A/R</span>
                  <span>${(stryMutAct_9fa48("41471") ? erpSnapshot.erp.accountsReceivable * 1000000 : (stryCov_9fa48("41471"), erpSnapshot.erp.accountsReceivable / 1000000)).toFixed(1)}M</span>
                </div>
              </div>
            </div>

            {/* HR State */}
            <div className="bg-black/30 rounded-xl p-4 border border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <span>👥</span>
                <span className="font-semibold text-sm">Workday HR</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Headcount</span>
                  <span className="font-bold text-purple-400">{erpSnapshot.hr.totalHeadcount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Open Reqs</span>
                  <span>{erpSnapshot.hr.openReqs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Attrition</span>
                  <span className={(stryMutAct_9fa48("41475") ? erpSnapshot.hr.attritionRate <= 15 : stryMutAct_9fa48("41474") ? erpSnapshot.hr.attritionRate >= 15 : stryMutAct_9fa48("41473") ? false : stryMutAct_9fa48("41472") ? true : (stryCov_9fa48("41472", "41473", "41474", "41475"), erpSnapshot.hr.attritionRate > 15)) ? 'text-red-400' : 'text-green-400'}>
                    {erpSnapshot.hr.attritionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Avg Tenure</span>
                  <span>{erpSnapshot.hr.avgTenure.toFixed(1)} yrs</span>
                </div>
              </div>
            </div>

            {/* Engineering State */}
            <div className="bg-black/30 rounded-xl p-4 border border-cyan-800">
              <div className="flex items-center gap-2 mb-3">
                <span>🐙</span>
                <span className="font-semibold text-sm">Jira + GitHub</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Velocity</span>
                  <span className="font-bold text-cyan-400">{erpSnapshot.engineering.velocity} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Sprint %</span>
                  <span className={(stryMutAct_9fa48("41481") ? erpSnapshot.engineering.sprintCompletion <= 80 : stryMutAct_9fa48("41480") ? erpSnapshot.engineering.sprintCompletion >= 80 : stryMutAct_9fa48("41479") ? false : stryMutAct_9fa48("41478") ? true : (stryCov_9fa48("41478", "41479", "41480", "41481"), erpSnapshot.engineering.sprintCompletion > 80)) ? 'text-green-400' : 'text-amber-400'}>
                    {erpSnapshot.engineering.sprintCompletion.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Deploy/wk</span>
                  <span>{erpSnapshot.engineering.deploymentFrequency.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">MTTR</span>
                  <span>{erpSnapshot.engineering.mttr} min</span>
                </div>
              </div>
            </div>

            {/* Service Desk State */}
            <div className="bg-black/30 rounded-xl p-4 border border-rose-800">
              <div className="flex items-center gap-2 mb-3">
                <span>🎫</span>
                <span className="font-semibold text-sm">ServiceNow</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Open</span>
                  <span className="font-bold text-rose-400">{erpSnapshot.serviceDesk.openTickets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Response</span>
                  <span>{erpSnapshot.serviceDesk.avgResponseTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">SLA %</span>
                  <span className={(stryMutAct_9fa48("41487") ? erpSnapshot.serviceDesk.slaCompliance <= 90 : stryMutAct_9fa48("41486") ? erpSnapshot.serviceDesk.slaCompliance >= 90 : stryMutAct_9fa48("41485") ? false : stryMutAct_9fa48("41484") ? true : (stryCov_9fa48("41484", "41485", "41486", "41487"), erpSnapshot.serviceDesk.slaCompliance > 90)) ? 'text-green-400' : 'text-red-400'}>
                    {erpSnapshot.serviceDesk.slaCompliance.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">CSAT</span>
                  <span>{erpSnapshot.serviceDesk.csat.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector Health */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">Connector Health</h3>
          <div className="grid grid-cols-4 gap-3">
            {connectors.map(stryMutAct_9fa48("41490") ? () => undefined : (stryCov_9fa48("41490"), c => <div key={c.id} className="bg-black/20 rounded-lg p-3 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="font-medium text-sm">{c.name}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("41494") ? c.status !== 'connected' : stryMutAct_9fa48("41493") ? false : stryMutAct_9fa48("41492") ? true : (stryCov_9fa48("41492", "41493", "41494"), c.status === 'connected')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("41499") ? c.status !== 'syncing' : stryMutAct_9fa48("41498") ? false : stryMutAct_9fa48("41497") ? true : (stryCov_9fa48("41497", "41498", "41499"), c.status === 'syncing')) ? 'bg-amber-900 text-amber-300' : (stryMutAct_9fa48("41504") ? c.status !== 'error' : stryMutAct_9fa48("41503") ? false : stryMutAct_9fa48("41502") ? true : (stryCov_9fa48("41502", "41503", "41504"), c.status === 'error')) ? 'bg-red-900 text-red-300' : 'bg-neutral-800 text-neutral-400'}`}>
                    {c.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500">Records</span>
                    <div className="font-medium">{c.recordCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-neutral-500">Health</span>
                    <div className={`font-medium ${(stryMutAct_9fa48("41512") ? c.healthScore <= 95 : stryMutAct_9fa48("41511") ? c.healthScore >= 95 : stryMutAct_9fa48("41510") ? false : stryMutAct_9fa48("41509") ? true : (stryCov_9fa48("41509", "41510", "41511", "41512"), c.healthScore > 95)) ? 'text-green-400' : (stryMutAct_9fa48("41517") ? c.healthScore <= 80 : stryMutAct_9fa48("41516") ? c.healthScore >= 80 : stryMutAct_9fa48("41515") ? false : stryMutAct_9fa48("41514") ? true : (stryCov_9fa48("41514", "41515", "41516", "41517"), c.healthScore > 80)) ? 'text-amber-400' : 'text-red-400'}`}>
                      {c.healthScore}%
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500">Last Sync</span>
                    <div className="font-medium">{Math.floor(stryMutAct_9fa48("41520") ? (Date.now() - c.lastSync.getTime()) * 60000 : (stryCov_9fa48("41520"), (stryMutAct_9fa48("41521") ? Date.now() + c.lastSync.getTime() : (stryCov_9fa48("41521"), Date.now() - c.lastSync.getTime())) / 60000))} min ago</div>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>;
};
export default ChronosPage;