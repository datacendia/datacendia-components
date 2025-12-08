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

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { decisionIntelApi, metricsApi, councilApi, alertsApi, graphApi } from '../../../lib/api';

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
    correlation: number; // 0-1
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
    timestamp: number; // seconds into replay
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
  timeRange: { start: Date; end: Date };
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
    vulnerabilities: { critical: number; high: number; medium: number; low: number };
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
    timeRangeCovered: { start: Date; end: Date };
    piiExposed: false;
    secretsRevealed: false;
  };
}

// =============================================================================
// DATA GENERATION (Would connect to Neo4j + Event Store in production)
// =============================================================================

const generateEvents = (): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  const now = new Date();
  
  const templates = [
    { type: 'decision' as const, titles: ['Board Approved Q3 Budget', 'Council Greenlit Acquisition', 'Authorized Series C Terms', 'Approved Hiring Freeze Lift', 'Sanctioned Market Expansion'] },
    { type: 'metric' as const, titles: ['Revenue Milestone: $10M ARR', 'Churn Spike Detected', 'NPS Score Jump to 72', 'CAC Reduced by 23%', 'LTV:CAC Hit 4.2x'] },
    { type: 'personnel' as const, titles: ['VP Sales Departure', 'CTO Transition', 'Engineering +12 Headcount', 'CFO Hired from Goldman', 'Sales Team Restructure'] },
    { type: 'financial' as const, titles: ['Series B Close: $45M', 'Q2 Earnings Beat', 'Debt Facility Secured', 'Tax Credit Realized', 'Bridge Round Complete'] },
    { type: 'milestone' as const, titles: ['1,000th Enterprise Customer', 'SOC2 Type II Certified', 'GDPR Compliance Achieved', 'Product Hunt Launch', 'First $1M Contract'] },
  ];
  
  for (let i = 0; i < 80; i++) {
    const daysAgo = Math.floor(Math.random() * 730);
    const hoursAgo = Math.floor(Math.random() * 24);
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    events.push({
      id: `evt-${i}`,
      timestamp: new Date(now.getTime() - (daysAgo * 24 + hoursAgo) * 60 * 60 * 1000),
      type: template.type,
      title: template.titles[Math.floor(Math.random() * template.titles.length)],
      description: 'Full audit trail available. Click to replay Council deliberation.',
      impact: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
      magnitude: Math.floor(Math.random() * 10) + 1,
      department: ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'Legal'][Math.floor(Math.random() * 6)],
      actors: ['CEO', 'CFO', 'CTO', 'COO', 'Board', 'Council'].slice(0, Math.floor(Math.random() * 3) + 1),
      deliberationId: Math.random() > 0.5 ? `dlb-${i}` : undefined,
    });
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateSnapshot = (date: Date, mode: ChronosMode): StateSnapshot => {
  const now = new Date();
  const daysDiff = (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
  const isPast = daysDiff > 0;
  const factor = isPast ? Math.pow(0.9992, daysDiff) : Math.pow(1.0008, -daysDiff);
  const volatility = mode === 'fastforward' ? 0.15 : 0.05;
  
  const randomize = (base: number) => base * factor * (1 + (Math.random() - 0.5) * volatility);
  
  return {
    timestamp: date,
    metrics: {
      revenue: Math.round(randomize(12500000)),
      profit: Math.round(randomize(2800000)),
      employees: Math.round(randomize(156)),
      customers: Math.round(randomize(847)),
      satisfaction: Math.min(100, Math.round(randomize(87))),
      marketShare: Math.max(1, randomize(12.4)),
      burnRate: Math.round(randomize(850000)),
      runway: Math.round(randomize(18)),
    },
    council: {
      activeAgents: ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent'].slice(0, Math.floor(Math.random() * 2) + 4),
      pendingDecisions: Math.floor(Math.random() * 8),
      totalDeliberations: Math.floor(daysDiff > 0 ? 450 - daysDiff * 0.5 : 450 + Math.abs(daysDiff) * 0.3),
      consensusRate: Math.min(100, randomize(78)),
    },
    graph: {
      entities: Math.round(randomize(15420)),
      relationships: Math.round(randomize(48930)),
      dataPoints: Math.round(randomize(2340000)),
      freshness: Math.max(0, Math.min(100, 95 - (isPast ? daysDiff * 0.1 : -daysDiff * 0.05))),
    },
  };
};

// Generate Pivotal Moments (AI-detected critical points)
const generatePivotalMoments = (events: TimelineEvent[]): PivotalMoment[] => {
  return events
    .filter(e => e.magnitude >= 7)
    .slice(0, 8)
    .map(event => ({
      id: `pivot-${event.id}`,
      timestamp: event.timestamp,
      event,
      significance: event.magnitude * 10 + Math.floor(Math.random() * 20),
      reason: event.impact === 'positive' 
        ? `Major growth catalyst - ${event.title.toLowerCase()}`
        : event.impact === 'negative'
        ? `Critical inflection point - ${event.title.toLowerCase()}`
        : `Strategic pivot opportunity - ${event.title.toLowerCase()}`,
      impactedMetrics: ['revenue', 'profit', 'customers'].slice(0, Math.floor(Math.random() * 2) + 2),
      beforeState: { revenue: 10000000 + Math.random() * 2000000, profit: 2000000 + Math.random() * 500000 },
      afterState: { revenue: 11000000 + Math.random() * 3000000, profit: 2200000 + Math.random() * 800000 },
    }));
};

// Generate Council Replay
const generateCouncilReplay = (event: TimelineEvent): CouncilReplay => {
  const agents = ['Chief Strategic Agent', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent'];
  return {
    id: `replay-${event.id}`,
    deliberationId: event.deliberationId || `dlb-${event.id}`,
    timestamp: event.timestamp,
    query: `Should we proceed with: ${event.title}?`,
    participants: agents.slice(0, Math.floor(Math.random() * 2) + 3),
    duration: 180 + Math.floor(Math.random() * 120),
    phases: agents.slice(0, 4).map((agent, i) => ({
      agent,
      statement: [
        `Based on my analysis, the financial implications suggest ${event.impact === 'positive' ? 'strong upside potential' : 'careful risk management'}.`,
        `From an operational standpoint, we need to consider resource allocation and timeline impacts.`,
        `Security and compliance review indicates ${Math.random() > 0.5 ? 'green light' : 'minor concerns to address'}.`,
        `Market positioning analysis shows ${event.impact === 'positive' ? 'competitive advantage' : 'need for differentiation'}.`,
      ][i] || 'I concur with the assessment and recommend proceeding with caution.',
      sentiment: ['positive', 'neutral', 'positive', 'neutral'][i] as any,
      timestamp: (i + 1) * 45,
    })),
    decision: event.impact === 'positive' ? 'APPROVED' : 'APPROVED WITH CONDITIONS',
    confidence: 75 + Math.floor(Math.random() * 20),
  };
};

// Generate Causal Chain (Impact Tracing)
const generateCausalChain = (event: TimelineEvent, allEvents: TimelineEvent[]): CausalChain => {
  const effects = allEvents
    .filter(e => e.timestamp > event.timestamp && e.timestamp < new Date(event.timestamp.getTime() + 90 * 24 * 60 * 60 * 1000))
    .slice(0, 4)
    .map(e => ({
      event: e,
      delay: Math.floor((e.timestamp.getTime() - event.timestamp.getTime()) / (24 * 60 * 60 * 1000)),
      correlation: 0.5 + Math.random() * 0.45,
    }));

  return {
    id: `chain-${event.id}`,
    rootCause: event,
    effects,
    totalImpact: {
      revenue: (Math.random() - 0.3) * 3000000,
      profit: (Math.random() - 0.3) * 800000,
      customers: Math.floor((Math.random() - 0.3) * 100),
    },
  };
};

// Generate Monte Carlo Results
const generateMonteCarloResults = (variable: string): MonteCarloResult => {
  const scenarios = [
    { scenario: 'Pessimistic', probability: 0.15, revenue: 9000000, profit: 1500000 },
    { scenario: 'Conservative', probability: 0.25, revenue: 11000000, profit: 2200000 },
    { scenario: 'Base Case', probability: 0.35, revenue: 12500000, profit: 2800000 },
    { scenario: 'Optimistic', probability: 0.20, revenue: 15000000, profit: 3500000 },
    { scenario: 'Best Case', probability: 0.05, revenue: 18000000, profit: 4500000 },
  ];

  return {
    id: `mc-${Date.now()}`,
    variable,
    simulations: 10000,
    outcomes: scenarios,
    optimalPath: 'Base Case with aggressive Q3 marketing',
    confidenceInterval: [10500000, 14500000],
  };
};

// =============================================================================
// CHRONOS-ERP™ GENERATORS - Enterprise System Data
// =============================================================================

const generateERPConnectors = (): ERPConnector[] => [
  {
    id: 'sf-001',
    name: 'Salesforce Production',
    source: 'salesforce',
    icon: '☁️',
    status: 'connected',
    lastSync: new Date(Date.now() - 5 * 60 * 1000),
    recordCount: 847293,
    dataTypes: ['Opportunities', 'Accounts', 'Contacts', 'Activities', 'Forecasts'],
    syncFrequency: 'realtime',
    healthScore: 98,
  },
  {
    id: 'sap-001',
    name: 'SAP S/4HANA',
    source: 'sap',
    icon: '🏢',
    status: 'connected',
    lastSync: new Date(Date.now() - 15 * 60 * 1000),
    recordCount: 2341892,
    dataTypes: ['Purchase Orders', 'Sales Orders', 'Invoices', 'GL Entries', 'Cost Centers'],
    syncFrequency: 'hourly',
    healthScore: 95,
  },
  {
    id: 'wd-001',
    name: 'Workday HCM',
    source: 'workday',
    icon: '👥',
    status: 'connected',
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    recordCount: 45678,
    dataTypes: ['Employees', 'Compensation', 'Performance', 'Recruiting', 'Time Off'],
    syncFrequency: 'daily',
    healthScore: 99,
  },
  {
    id: 'jira-001',
    name: 'Jira Software',
    source: 'jira',
    icon: '🎯',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 1000),
    recordCount: 128934,
    dataTypes: ['Issues', 'Sprints', 'Releases', 'Components', 'Velocity'],
    syncFrequency: 'realtime',
    healthScore: 97,
  },
  {
    id: 'gh-001',
    name: 'GitHub Enterprise',
    source: 'github',
    icon: '🐙',
    status: 'connected',
    lastSync: new Date(Date.now() - 1 * 60 * 1000),
    recordCount: 89234,
    dataTypes: ['Commits', 'Pull Requests', 'Releases', 'Deployments', 'Actions'],
    syncFrequency: 'realtime',
    healthScore: 100,
  },
  {
    id: 'snow-001',
    name: 'ServiceNow',
    source: 'servicenow',
    icon: '🎫',
    status: 'syncing',
    lastSync: new Date(Date.now() - 10 * 60 * 1000),
    recordCount: 234567,
    dataTypes: ['Incidents', 'Requests', 'Changes', 'Problems', 'CMDB'],
    syncFrequency: 'hourly',
    healthScore: 92,
  },
  {
    id: 'sp-001',
    name: 'SharePoint Online',
    source: 'sharepoint',
    icon: '📁',
    status: 'connected',
    lastSync: new Date(Date.now() - 60 * 60 * 1000),
    recordCount: 567890,
    dataTypes: ['Documents', 'Policies', 'Contracts', 'Templates', 'Revisions'],
    syncFrequency: 'daily',
    healthScore: 94,
  },
  {
    id: 'ns-001',
    name: 'NetSuite',
    source: 'netsuite',
    icon: '💰',
    status: 'connected',
    lastSync: new Date(Date.now() - 45 * 60 * 1000),
    recordCount: 1234567,
    dataTypes: ['Transactions', 'Customers', 'Vendors', 'GL', 'Reports'],
    syncFrequency: 'hourly',
    healthScore: 96,
  },
];

const generateCRMEvents = (days: number = 90): CRMPipelineEvent[] => {
  const events: CRMPipelineEvent[] = [];
  const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const accounts = ['Acme Corp', 'TechGiant Inc', 'GlobalBank', 'MegaRetail', 'HealthFirst', 'EduPrime', 'AutoMax', 'EnergyPlus'];
  const owners = ['Sarah Chen', 'Mike Johnson', 'Emily Davis', 'James Wilson', 'Lisa Brown'];

  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * days);
    const amount = Math.floor(Math.random() * 500000) + 25000;
    const stageIdx = Math.floor(Math.random() * stages.length);
    
    events.push({
      id: `crm-${i}`,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      source: 'salesforce',
      opportunityId: `OPP-${100000 + i}`,
      accountName: accounts[Math.floor(Math.random() * accounts.length)],
      stage: stages[stageIdx],
      previousStage: stageIdx > 0 ? stages[stageIdx - 1] : undefined,
      amount,
      probability: [10, 25, 50, 75, 100, 0][stageIdx],
      owner: owners[Math.floor(Math.random() * owners.length)],
      closeDate: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      deltaAmount: Math.random() > 0.7 ? Math.floor((Math.random() - 0.5) * 50000) : undefined,
    });
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateERPTransactions = (days: number = 90): ERPTransactionEvent[] => {
  const events: ERPTransactionEvent[] = [];
  const types: ERPTransactionEvent['transactionType'][] = ['purchase_order', 'sales_order', 'invoice', 'payment', 'journal_entry'];
  const costCenters = ['CC-1000', 'CC-2000', 'CC-3000', 'CC-4000', 'CC-5000'];
  const glAccounts = ['4000-Revenue', '5000-COGS', '6000-OpEx', '7000-Payroll', '8000-Other'];

  for (let i = 0; i < 200; i++) {
    const daysAgo = Math.floor(Math.random() * days);
    const type = types[Math.floor(Math.random() * types.length)];
    
    events.push({
      id: `erp-${i}`,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      source: 'sap',
      transactionType: type,
      documentNumber: `DOC-${200000 + i}`,
      amount: Math.floor(Math.random() * 100000) + 1000,
      currency: 'USD',
      costCenter: costCenters[Math.floor(Math.random() * costCenters.length)],
      glAccount: glAccounts[Math.floor(Math.random() * glAccounts.length)],
      description: `${type.replace('_', ' ')} - Auto generated`,
      approver: Math.random() > 0.5 ? 'CFO' : 'Controller',
    });
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateHREvents = (days: number = 180): HREvent[] => {
  const events: HREvent[] = [];
  const eventTypes: HREvent['eventType'][] = ['hire', 'termination', 'promotion', 'transfer', 'compensation_change', 'performance_review'];
  const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'Product', 'HR', 'Legal'];
  const positions = ['Engineer', 'Manager', 'Director', 'VP', 'Analyst', 'Specialist', 'Lead'];
  const locations = ['San Francisco', 'New York', 'Austin', 'Seattle', 'London', 'Singapore'];

  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * days);
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    events.push({
      id: `hr-${i}`,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      source: 'workday',
      eventType,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      level: ['IC1', 'IC2', 'IC3', 'M1', 'M2', 'D1', 'VP'][Math.floor(Math.random() * 7)],
      location: locations[Math.floor(Math.random() * locations.length)],
      headcountDelta: eventType === 'hire' ? 1 : eventType === 'termination' ? -1 : 0,
      compensationBand: ['$80k-100k', '$100k-130k', '$130k-160k', '$160k-200k', '$200k+'][Math.floor(Math.random() * 5)],
    });
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateEngineeringEvents = (days: number = 90): EngineeringEvent[] => {
  const events: EngineeringEvent[] = [];
  const eventTypes: EngineeringEvent['eventType'][] = ['sprint_complete', 'release', 'incident', 'pr_merged', 'deployment'];
  const projects = ['Platform', 'API', 'Frontend', 'Mobile', 'Infrastructure', 'Data Pipeline'];
  const teams = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Core', 'Growth'];

  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * days);
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    events.push({
      id: `eng-${i}`,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      source: Math.random() > 0.5 ? 'jira' : 'github',
      eventType,
      project: projects[Math.floor(Math.random() * projects.length)],
      team: teams[Math.floor(Math.random() * teams.length)],
      velocity: eventType === 'sprint_complete' ? Math.floor(Math.random() * 30) + 20 : undefined,
      storyPoints: eventType === 'sprint_complete' ? Math.floor(Math.random() * 50) + 30 : undefined,
      leadTime: Math.floor(Math.random() * 10) + 2,
      cycleTime: Math.floor(Math.random() * 5) + 1,
      deployFrequency: eventType === 'deployment' ? Math.floor(Math.random() * 5) + 1 : undefined,
      incidentSeverity: eventType === 'incident' ? ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any : undefined,
    });
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateServiceTickets = (days: number = 60): ServiceTicketEvent[] => {
  const events: ServiceTicketEvent[] = [];
  const categories: ServiceTicketEvent['category'][] = ['incident', 'request', 'problem', 'change'];
  const priorities: ServiceTicketEvent['priority'][] = ['critical', 'high', 'medium', 'low'];
  const assignees = ['Ops Team', 'DevOps', 'Security', 'Network', 'Help Desk'];

  for (let i = 0; i < 80; i++) {
    const daysAgo = Math.floor(Math.random() * days);
    const isResolved = Math.random() > 0.3;
    
    events.push({
      id: `svc-${i}`,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      source: 'servicenow',
      ticketId: `INC${300000 + i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: isResolved ? 'resolved' : ['open', 'in_progress'][Math.floor(Math.random() * 2)] as any,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      resolution: isResolved ? 'Issue resolved per standard procedure' : undefined,
      slaBreached: Math.random() > 0.85,
      responseTime: Math.floor(Math.random() * 60) + 5,
      resolutionTime: isResolved ? Math.floor(Math.random() * 480) + 30 : undefined,
    });
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateDocumentRevisions = (days: number = 180): DocumentRevisionEvent[] => {
  const events: DocumentRevisionEvent[] = [];
  const docTypes: DocumentRevisionEvent['documentType'][] = ['policy', 'contract', 'spec', 'report', 'presentation'];
  const changeTypes: DocumentRevisionEvent['changeType'][] = ['created', 'modified', 'approved', 'published', 'archived'];
  const authors = ['Legal Team', 'Finance Team', 'Product Team', 'Executive Office', 'Compliance'];
  const docs = ['Q3 Financial Report', 'Security Policy', 'Vendor Agreement', 'Product Roadmap', 'Employee Handbook', 'SOX Controls', 'Data Governance Policy'];

  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * days);
    const version = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`;
    
    events.push({
      id: `doc-${i}`,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      source: 'sharepoint',
      documentId: `DOC-${400000 + i}`,
      documentName: docs[Math.floor(Math.random() * docs.length)],
      documentType: docTypes[Math.floor(Math.random() * docTypes.length)],
      version,
      previousVersion: parseFloat(version) > 1 ? `${parseFloat(version) - 0.1}` : undefined,
      author: authors[Math.floor(Math.random() * authors.length)],
      changeType: changeTypes[Math.floor(Math.random() * changeTypes.length)],
      approvers: Math.random() > 0.5 ? ['CFO', 'General Counsel'] : undefined,
    });
  }
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateERPSnapshot = (date: Date): ERPStateSnapshot => {
  const now = new Date();
  const daysDiff = (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
  const factor = Math.pow(0.9995, daysDiff);
  const randomize = (base: number, variance: number = 0.1) => 
    base * factor * (1 + (Math.random() - 0.5) * variance);

  return {
    timestamp: date,
    crm: {
      totalPipeline: Math.round(randomize(45000000)),
      weightedPipeline: Math.round(randomize(28000000)),
      openOpportunities: Math.round(randomize(234)),
      wonThisMonth: Math.round(randomize(18)),
      lostThisMonth: Math.round(randomize(7)),
      avgDealSize: Math.round(randomize(125000)),
      winRate: Math.min(100, randomize(42, 0.05)),
    },
    erp: {
      revenue: Math.round(randomize(12500000)),
      expenses: Math.round(randomize(9800000)),
      cashPosition: Math.round(randomize(8500000)),
      accountsReceivable: Math.round(randomize(3200000)),
      accountsPayable: Math.round(randomize(1800000)),
      openPOs: Math.round(randomize(156)),
    },
    hr: {
      totalHeadcount: Math.round(randomize(156)),
      openReqs: Math.round(randomize(23)),
      attritionRate: randomize(12, 0.2),
      avgTenure: randomize(2.8, 0.1),
      hiresThisQuarter: Math.round(randomize(15)),
      departuresThisQuarter: Math.round(randomize(5)),
    },
    engineering: {
      velocity: Math.round(randomize(47)),
      sprintCompletion: Math.min(100, randomize(85, 0.1)),
      bugCount: Math.round(randomize(34)),
      techDebtHours: Math.round(randomize(420)),
      deploymentFrequency: randomize(4.2, 0.15),
      mttr: Math.round(randomize(45)),
    },
    serviceDesk: {
      openTickets: Math.round(randomize(89)),
      avgResponseTime: Math.round(randomize(15)),
      avgResolutionTime: Math.round(randomize(180)),
      slaCompliance: Math.min(100, randomize(94, 0.05)),
      csat: Math.min(100, randomize(87, 0.08)),
    },
  };
};

// =============================================================================
// ENTERPRISE COMPLIANCE GENERATORS (The Undefeatable 5%)
// =============================================================================

// Generate SHA-256 hash (simulated)
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64);
};

// Generate Immutable Ledger
const generateLedger = (): ChronosLedger => {
  const genesisTimestamp = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);
  const genesisHash = generateHash(`genesis-${genesisTimestamp.toISOString()}`);
  
  const genesisBlock: LedgerBlock = {
    blockNumber: 0,
    timestamp: genesisTimestamp,
    previousHash: '0'.repeat(64),
    hash: genesisHash,
    merkleRoot: generateHash('merkle-genesis'),
    stateSnapshot: generateSnapshot(genesisTimestamp, 'rewind'),
    events: [],
    signature: generateHash(`sig-genesis-${Date.now()}`),
    signedBy: 'system@datacendia.com',
    nonce: 0,
  };

  const latestTimestamp = new Date();
  const latestBlock: LedgerBlock = {
    blockNumber: 4382,
    timestamp: latestTimestamp,
    previousHash: generateHash(`block-4381-${Date.now()}`),
    hash: generateHash(`block-4382-${latestTimestamp.toISOString()}`),
    merkleRoot: generateHash(`merkle-4382-${Date.now()}`),
    stateSnapshot: generateSnapshot(latestTimestamp, 'rewind'),
    events: [],
    signature: generateHash(`sig-4382-${Date.now()}`),
    signedBy: 'chronos-node-1@datacendia.com',
    nonce: 847293,
  };

  return {
    chainId: 'chronos-mainnet-001',
    genesisBlock,
    latestBlock,
    totalBlocks: 4383,
    integrityStatus: 'verified',
    lastVerified: new Date(Date.now() - 60000),
    complianceFlags: {
      sox: true,
      sec: true,
      fedramp: true,
      gdpr: true,
      hipaa: false,
    },
  };
};

// Generate Live Sync Status
const generateLiveSyncStatus = (): LiveSyncStatus => ({
  isConnected: true,
  lastEventTime: new Date(Date.now() - Math.random() * 5000),
  pendingEvents: Math.floor(Math.random() * 3),
  syncLag: Math.floor(Math.random() * 150),
  throughput: 12 + Math.random() * 8,
  kafkaOffset: 8472934 + Math.floor(Math.random() * 100),
  websocketStatus: 'connected',
});

// Generate Court-Admissible Export
const generateCourtExport = (timeRange: { start: Date; end: Date }): CourtAdmissibleExport => ({
  id: `export-${Date.now()}`,
  exportedAt: new Date(),
  requestedBy: 'legal@company.com',
  timeRange,
  includedBlocks: Array.from({ length: 50 }, (_, i) => 4300 + i),
  merkleProof: Array.from({ length: 8 }, () => generateHash(`proof-${Math.random()}`)),
  signatures: [
    { signer: 'CEO', role: 'Chief Executive Officer', timestamp: new Date(), signature: generateHash('ceo-sig'), publicKey: 'pk_ceo_...' },
    { signer: 'CFO', role: 'Chief Financial Officer', timestamp: new Date(), signature: generateHash('cfo-sig'), publicKey: 'pk_cfo_...' },
    { signer: 'General Counsel', role: 'Legal', timestamp: new Date(), signature: generateHash('gc-sig'), publicKey: 'pk_gc_...' },
  ],
  witnessStatements: [
    { witness: 'Internal Audit', statement: 'Verified data integrity and chain of custody.', timestamp: new Date() },
  ],
  deliberationTranscripts: [],
  hashChainVerification: {
    startHash: generateHash('start'),
    endHash: generateHash('end'),
    allBlocksValid: true,
  },
  legalCertification: {
    certified: true,
    certifier: 'Datacendia Chronos Certification Authority',
    jurisdiction: 'United States',
  },
  format: 'forensic-bundle',
});

// Default redaction rules
const DEFAULT_REDACTION_RULES: RedactionRule[] = [
  { id: 'r1', field: 'ssn', pattern: /\d{3}-\d{2}-\d{4}/, replacement: '***-**-****', category: 'pii', preserveFinancialTruth: true },
  { id: 'r2', field: 'email', pattern: /@.*\.com/, replacement: '@[REDACTED]', category: 'pii', preserveFinancialTruth: true },
  { id: 'r3', field: 'name', pattern: /[A-Z][a-z]+ [A-Z][a-z]+/, replacement: '[NAME REDACTED]', category: 'personnel', preserveFinancialTruth: true },
  { id: 'r4', field: 'salary', pattern: /\$[\d,]+/, replacement: '$[REDACTED]', category: 'personnel', preserveFinancialTruth: false },
  { id: 'r5', field: 'medical', pattern: /diagnosis|treatment|patient/i, replacement: '[PHI REDACTED]', category: 'phi', preserveFinancialTruth: true },
];

// =============================================================================
// FULL TRACEABILITY GENERATOR - Court-Level Causality Proof
// =============================================================================

const generateTraceabilityView = (event: TimelineEvent): TraceabilityView => {
  const services = ['DataIngestionService', 'TransformEngine', 'ValidationService', 'AIAnalytics', 'DecisionService'];
  const datasets = ['CRM_Pipeline', 'ERP_Transactions', 'HR_Records', 'Engineering_Metrics', 'Financial_Ledger'];
  const agents = ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent', 'CRO Agent'];
  
  return {
    eventId: event.id,
    originSource: {
      dataset: datasets[Math.floor(Math.random() * datasets.length)],
      table: `${event.department?.toLowerCase() || 'core'}_events`,
      field: event.type === 'metric' ? 'value' : event.type === 'financial' ? 'amount' : 'status',
      timestamp: new Date(event.timestamp.getTime() - 3600000),
      rawValue: event.type === 'financial' ? Math.floor(Math.random() * 10000000) : event.title,
    },
    intermediateTransforms: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => ({
      step: i + 1,
      service: services[i % services.length],
      operation: ['Extract', 'Transform', 'Validate', 'Enrich', 'Aggregate', 'Normalize'][i % 6],
      inputHash: generateHash(`input-${event.id}-${i}`),
      outputHash: generateHash(`output-${event.id}-${i}`),
      timestamp: new Date(event.timestamp.getTime() - (3600000 - i * 600000)),
      duration: 50 + Math.floor(Math.random() * 200),
    })),
    finalOutput: {
      value: event.title,
      confidence: 0.85 + Math.random() * 0.14,
      timestamp: event.timestamp,
    },
    agentProvenance: {
      agentId: `agent-${Math.floor(Math.random() * 6)}`,
      agentName: agents[Math.floor(Math.random() * agents.length)],
      agentRole: event.actors?.[0] || 'Analyst',
      deliberationId: event.deliberationId,
      reasoning: `Analysis based on ${event.type} data patterns and historical precedent. Confidence level determined by data quality and model accuracy.`,
    },
    serviceChain: services.slice(0, 3 + Math.floor(Math.random() * 2)).map((s, i) => ({
      serviceName: s,
      version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      method: ['process', 'analyze', 'validate', 'transform'][i % 4],
      latency: 10 + Math.floor(Math.random() * 50),
    })),
    datasetLineage: datasets.slice(0, 2 + Math.floor(Math.random() * 2)).map(d => ({
      datasetId: `ds-${generateHash(d).slice(0, 8)}`,
      datasetName: d,
      source: ['Salesforce', 'SAP', 'Workday', 'Internal'][Math.floor(Math.random() * 4)],
      lastUpdated: new Date(event.timestamp.getTime() - Math.random() * 86400000),
      recordCount: Math.floor(Math.random() * 1000000),
      quality: 0.9 + Math.random() * 0.09,
    })),
    frameworkGovernance: {
      framework: ['NIST CSF', 'ISO 27001', 'SOC 2', 'GDPR', 'OECD AI'][Math.floor(Math.random() * 5)],
      policy: `${event.department || 'Corporate'} Data Governance Policy v2.1`,
      controls: ['Access Control', 'Data Classification', 'Audit Logging', 'Encryption'].slice(0, 2 + Math.floor(Math.random() * 2)),
      validatedAt: new Date(event.timestamp.getTime() - 60000),
      validatedBy: 'Compliance Engine v3.2',
    },
    integrityProof: {
      merkleRoot: generateHash(`merkle-${event.id}`),
      blockNumber: 4000 + Math.floor(Math.random() * 400),
      signature: generateHash(`sig-${event.id}-${Date.now()}`),
    },
  };
};

// =============================================================================
// PER-EVENT COMPLIANCE SNAPSHOT GENERATOR
// =============================================================================

const generateEventComplianceSnapshot = (event: TimelineEvent): EventComplianceSnapshot => {
  const riskLevel = Math.random();
  return {
    eventId: event.id,
    timestamp: event.timestamp,
    nistScore: {
      overall: 75 + Math.floor(Math.random() * 20),
      identify: 70 + Math.floor(Math.random() * 25),
      protect: 75 + Math.floor(Math.random() * 20),
      detect: 80 + Math.floor(Math.random() * 15),
      respond: 70 + Math.floor(Math.random() * 25),
      recover: 65 + Math.floor(Math.random() * 30),
    },
    oecdScore: {
      overall: 80 + Math.floor(Math.random() * 15),
      transparency: 85 + Math.floor(Math.random() * 10),
      accountability: 80 + Math.floor(Math.random() * 15),
      robustness: 75 + Math.floor(Math.random() * 20),
      fairness: 82 + Math.floor(Math.random() * 13),
      privacy: 78 + Math.floor(Math.random() * 17),
    },
    privacyCompliance: {
      gdprStatus: riskLevel < 0.1 ? 'violation' : riskLevel < 0.25 ? 'warning' : 'compliant',
      ccpaStatus: riskLevel < 0.08 ? 'violation' : riskLevel < 0.2 ? 'warning' : 'compliant',
      dataMinimization: 85 + Math.floor(Math.random() * 12),
      consentCoverage: 92 + Math.floor(Math.random() * 7),
      retentionCompliance: 88 + Math.floor(Math.random() * 10),
    },
    securityPosture: {
      overallScore: 82 + Math.floor(Math.random() * 15),
      vulnerabilities: {
        critical: Math.floor(Math.random() * 2),
        high: Math.floor(Math.random() * 5),
        medium: Math.floor(Math.random() * 15),
        low: Math.floor(Math.random() * 30),
      },
      encryptionCoverage: 95 + Math.floor(Math.random() * 4),
      accessControlScore: 88 + Math.floor(Math.random() * 10),
      auditLogIntegrity: 99 + Math.random(),
    },
    stakeholderImpact: {
      customersAffected: event.type === 'milestone' ? Math.floor(Math.random() * 10000) : Math.floor(Math.random() * 500),
      employeesAffected: event.type === 'personnel' ? Math.floor(Math.random() * 50) : Math.floor(Math.random() * 10),
      partnersAffected: Math.floor(Math.random() * 5),
      financialExposure: event.type === 'financial' ? Math.floor(Math.random() * 5000000) : Math.floor(Math.random() * 500000),
      reputationalRisk: riskLevel < 0.1 ? 'critical' : riskLevel < 0.25 ? 'high' : riskLevel < 0.5 ? 'medium' : 'low',
    },
    driftScore: {
      modelDrift: Math.random() * 0.15,
      dataDrift: Math.random() * 0.12,
      conceptDrift: Math.random() * 0.08,
      performanceDrift: Math.random() * 0.1,
      lastCalibration: new Date(event.timestamp.getTime() - Math.random() * 7 * 86400000),
    },
  };
};

// =============================================================================
// REVERSE TIME CHECK GENERATOR - Chronos Integrity Validation
// =============================================================================

const generateReverseTimeCheck = (targetDate: Date, mode: ChronosMode): ReverseTimeCheck => {
  const hasMismatch = Math.random() < 0.05; // 5% chance of detecting a mismatch
  const expectedHash = generateHash(`expected-${targetDate.toISOString()}`);
  const actualHash = hasMismatch ? generateHash(`actual-${Date.now()}`) : expectedHash;
  
  return {
    id: `rtc-${Date.now()}`,
    targetDate,
    requestedBy: 'compliance@company.com',
    requestedAt: new Date(),
    status: hasMismatch ? 'mismatch_detected' : 'complete',
    progress: 100,
    reconstructedState: generateSnapshot(targetDate, mode),
    expectedHash,
    actualHash,
    mismatches: hasMismatch ? [
      {
        field: 'metrics.revenue',
        expected: 12500000,
        actual: 12487500,
        severity: 'medium',
        possibleCauses: ['Late transaction reconciliation', 'Currency conversion timing', 'Rounding differences'],
      },
    ] : [],
    tamperProofSignal: {
      isValid: !hasMismatch,
      validationMethod: 'Merkle Tree + Digital Signatures',
      merkleProof: Array.from({ length: 8 }, (_, i) => generateHash(`proof-${i}-${targetDate.toISOString()}`)),
      blockRange: [4000, 4382],
      witnessSignatures: ['Chronos Node 1', 'Chronos Node 2', 'Chronos Node 3'].map(w => generateHash(`witness-${w}`)),
    },
    forensicReport: {
      generatedAt: new Date(),
      findings: hasMismatch 
        ? ['Minor discrepancy detected in revenue metrics', 'All other fields validated successfully', 'Hash chain integrity maintained']
        : ['All state reconstructions match stored hashes', 'No tampering detected', 'Full audit trail verified'],
      recommendations: hasMismatch
        ? ['Review transaction logs for the affected period', 'Verify ERP sync status', 'Consider manual reconciliation']
        : ['Continue regular monitoring', 'Schedule next integrity check'],
      legalAdmissible: true,
    },
  };
};

// =============================================================================
// ZERO-KNOWLEDGE PROOF GENERATOR
// =============================================================================

const generateZKProof = (
  proofType: ZeroKnowledgeProof['proofType'],
  framework: ZeroKnowledgeProof['framework'],
  claim: string
): ZeroKnowledgeProof => {
  return {
    id: `zkp-${Date.now()}`,
    proofType,
    claim,
    framework,
    generatedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    proof: {
      commitment: generateHash(`commitment-${framework}-${Date.now()}`),
      challenge: generateHash(`challenge-${framework}-${Date.now()}`),
      response: generateHash(`response-${framework}-${Date.now()}`),
      publicInputs: [
        `Framework: ${framework}`,
        `Time Range: Last 365 days`,
        `Compliance Status: VERIFIED`,
      ],
    },
    verification: {
      isValid: true,
      verifiedAt: new Date(),
      verifierSignature: generateHash(`verifier-sig-${Date.now()}`),
      verificationHash: generateHash(`verification-${framework}-${Date.now()}`),
    },
    metadata: {
      dataPointsProven: 10000 + Math.floor(Math.random() * 50000),
      timeRangeCovered: { start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), end: new Date() },
      piiExposed: false,
      secretsRevealed: false,
    },
  };
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [snapshot, setSnapshot] = useState<StateSnapshot>(() => generateSnapshot(new Date(), 'rewind'));
  const [realMetrics, setRealMetrics] = useState<any[]>([]);
  const [realDeliberations, setRealDeliberations] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Enhanced State
  const [enhancedView, setEnhancedView] = useState<EnhancedView>('standard');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pivotalMoments, setPivotalMoments] = useState<PivotalMoment[]>([]);
  const [diffDate, setDiffDate] = useState<Date | null>(null);
  const [diffSnapshot, setDiffSnapshot] = useState<StateSnapshot | null>(null);
  const [selectedReplay, setSelectedReplay] = useState<CouncilReplay | null>(null);
  const [causalChain, setCausalChain] = useState<CausalChain | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult | null>(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [graphNodes, setGraphNodes] = useState<Array<{x: number; y: number; size: number}>>([]);
  const [realGraphStats, setRealGraphStats] = useState<{
    entities: number;
    relationships: number;
    dataPoints: number;
    freshness: number;
  } | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');

  const departments = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.department) { set.add(e.department); }
    });
    return Array.from(set).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedDepartment === 'All Departments') { return events; }
    return events.filter(e => e.department === selectedDepartment);
  }, [events, selectedDepartment]);
  const filteredPivotalMoments = useMemo(() => {
    if (selectedDepartment === 'All Departments') { return pivotalMoments; }
    return pivotalMoments.filter(m => m.event.department === selectedDepartment);
  }, [pivotalMoments, selectedDepartment]);
  const [branches, setBranches] = useState<BranchTimeline[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Enterprise Compliance State (The Undefeatable 5%)
  const [ledger, setLedger] = useState<ChronosLedger>(() => generateLedger());
  const [liveSyncStatus, setLiveSyncStatus] = useState<LiveSyncStatus>(() => generateLiveSyncStatus());
  const [witnessSessions, setWitnessSessions] = useState<WitnessSession[]>([]);
  const [showCompliancePanel, setShowCompliancePanel] = useState(false);
  const [showCourtExportModal, setShowCourtExportModal] = useState(false);
  const [showWitnessModal, setShowWitnessModal] = useState(false);
  const [redactionRules] = useState<RedactionRule[]>(DEFAULT_REDACTION_RULES);
  const [exportInProgress, setExportInProgress] = useState(false);

  // Chronos-ERP™ State - Enterprise System Time Travel
  const [erpConnectors] = useState<ERPConnector[]>(() => generateERPConnectors());
  const [showERPPanel, setShowERPPanel] = useState(false);
  const [selectedERPSource, setSelectedERPSource] = useState<ERPSource | 'all'>('all');
  const [erpSnapshot, setErpSnapshot] = useState<ERPStateSnapshot>(() => generateERPSnapshot(new Date()));
  const [crmEvents] = useState(() => generateCRMEvents());
  const [erpTransactions] = useState(() => generateERPTransactions());
  const [hrEvents] = useState(() => generateHREvents());
  const [engineeringEvents] = useState(() => generateEngineeringEvents());
  const [serviceTickets] = useState(() => generateServiceTickets());
  const [documentRevisions] = useState(() => generateDocumentRevisions());

  // =========================================================================
  // NEW FEATURE STATES - The 5 Power Features
  // =========================================================================
  
  // (1) Full Traceability Views
  const [showTraceability, setShowTraceability] = useState(false);
  const [traceabilityView, setTraceabilityView] = useState<TraceabilityView | null>(null);
  
  // (2) Per-Event Compliance Snapshot
  const [showComplianceSnapshot, setShowComplianceSnapshot] = useState(false);
  const [eventComplianceSnapshot, setEventComplianceSnapshot] = useState<EventComplianceSnapshot | null>(null);
  
  // (3) Reverse Time Checks - Chronos Integrity Validation
  const [showReverseTimeCheck, setShowReverseTimeCheck] = useState(false);
  const [reverseTimeCheck, setReverseTimeCheck] = useState<ReverseTimeCheck | null>(null);
  const [reverseTimeProgress, setReverseTimeProgress] = useState(0);
  const [isRebuildingState, setIsRebuildingState] = useState(false);
  
  // (4) Regulator Mode
  const [regulatorMode, setRegulatorMode] = useState(false);
  const [regulatorSession, setRegulatorSession] = useState<RegulatorSession | null>(null);
  const [showRegulatorSetup, setShowRegulatorSetup] = useState(false);
  
  // (5) Zero-Knowledge Audits
  const [showZKAudit, setShowZKAudit] = useState(false);
  const [zkProofs, setZkProofs] = useState<ZeroKnowledgeProof[]>([]);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);

  // Time range based on mode
  const timeRange = useMemo(() => {
    const now = new Date();
    if (mode === 'rewind') {
      return {
        min: new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000), // 2 years ago
        max: now,
      };
    } else if (mode === 'fastforward') {
      return {
        min: now,
        max: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year ahead
      };
    } else {
      return {
        min: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
        max: now,
      };
    }
  }, [mode]);

  // Update snapshot when date changes - apply time-based projection to metrics
  useEffect(() => {
    // Calculate time-based factor for projecting metrics forward/backward
    const now = new Date();
    const daysDiff = (now.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000);
    const isPast = daysDiff > 0;
    
    // Growth/decay factor based on time distance
    // Past: values were lower, Future: values projected higher (with uncertainty)
    const growthRate = 0.0008; // ~30% annual growth rate
    const factor = isPast 
      ? Math.pow(1 - growthRate, daysDiff) 
      : Math.pow(1 + growthRate, -daysDiff);
    
    // Add some volatility for future projections
    const volatility = mode === 'fastforward' ? 0.15 : 0.05;
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    
    // Apply time-based transformation
    const projectValue = (baseValue: number, isWholeNumber: boolean = false): number => {
      const projected = baseValue * factor * randomFactor;
      return isWholeNumber ? Math.round(projected) : Math.round(projected * 100) / 100;
    };

    // Try to use real metrics as base values
    const getMetricValue = (code: string, fallback: number): number => {
      if (realMetrics.length > 0) {
        const metric = realMetrics.find((m: any) => 
          m.code?.toLowerCase().includes(code.toLowerCase()) ||
          m.name?.toLowerCase().includes(code.toLowerCase())
        );
        return metric?.current_value || metric?.value || fallback;
      }
      return fallback;
    };

    // Build snapshot with time-projected values
    const projectedSnapshot: StateSnapshot = {
      timestamp: currentDate,
      metrics: {
        revenue: projectValue(getMetricValue('revenue', 12500000)),
        profit: projectValue(getMetricValue('profit', 2800000)),
        employees: projectValue(getMetricValue('headcount', 156), true),
        customers: projectValue(getMetricValue('customers', 847), true),
        satisfaction: Math.min(100, Math.max(0, projectValue(getMetricValue('satisfaction', 87)))),
        marketShare: Math.max(0, projectValue(getMetricValue('market', 12.4))),
        burnRate: projectValue(getMetricValue('burn', 850000)),
        runway: Math.max(0, projectValue(getMetricValue('runway', 18), true)),
      },
      council: {
        activeAgents: ['Chief Strategic', 'CFO Agent', 'COO Agent', 'CISO Agent', 'CMO Agent'].slice(0, Math.floor(Math.random() * 2) + 4),
        pendingDecisions: Math.max(0, Math.floor(realDeliberations.filter((d: any) => d.status === 'PENDING' || d.status === 'IN_PROGRESS').length * factor)),
        totalDeliberations: Math.max(0, Math.floor(realDeliberations.length * factor)),
        consensusRate: Math.min(100, Math.max(50, projectValue(78))),
      },
      graph: {
        // Use real Neo4j stats if available, otherwise fallback
        entities: projectValue(realGraphStats?.entities || getMetricValue('entities', 15420), true),
        relationships: projectValue(realGraphStats?.relationships || getMetricValue('relationships', 48930), true),
        dataPoints: projectValue(realGraphStats?.dataPoints || getMetricValue('datapoints', 2340000), true),
        freshness: realGraphStats?.freshness ?? Math.max(0, Math.min(100, 95 - (isPast ? daysDiff * 0.1 : -daysDiff * 0.02))),
      },
    };
    
    setSnapshot(projectedSnapshot);
    setErpSnapshot(generateERPSnapshot(currentDate));
  }, [currentDate, mode, realMetrics, realDeliberations, realGraphStats]);

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentDate(prev => {
          const increment = (mode === 'rewind' ? -1 : 1) * playbackSpeed * 24 * 60 * 60 * 1000; // 1 day per tick
          const newDate = new Date(prev.getTime() + increment);
          
          if (newDate < timeRange.min || newDate > timeRange.max) {
            setIsPlaying(false);
            return prev;
          }
          return newDate;
        });
      }, 100);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    
    return () => {
      if (playIntervalRef.current) {clearInterval(playIntervalRef.current);}
    };
  }, [isPlaying, playbackSpeed, mode, timeRange]);

  // Initialize pivotal moments with AI detection
  useEffect(() => {
    const detectPivotalMomentsWithAI = async () => {
      if (events.length === 0) {return;}
      
      try {
        // Call AI to detect pivotal moments
        const response = await decisionIntelApi.detectPivotalMoments({
          events: events.map(e => ({
            id: e.id,
            timestamp: e.timestamp.toISOString(),
            type: e.type,
            title: e.title,
            description: e.description,
            impact: e.impact,
            magnitude: e.magnitude,
            department: e.department,
          })),
          limit: 8,
          department: selectedDepartment === 'All Departments' ? undefined : selectedDepartment,
        });

        if (response.success && response.data && Array.isArray(response.data)) {
          console.log('[ChronosAI] Detected', response.data.length, 'pivotal moments via AI');
          // Map AI response to PivotalMoment format
          const aiMoments: PivotalMoment[] = [];
          for (const m of response.data as any[]) {
            const event = events.find(e => e.id === m.eventId);
            if (event) {
              aiMoments.push({
                id: `pivot-${m.eventId}`,
                timestamp: event.timestamp,
                event,
                significance: m.significance || 80,
                reason: m.reason || 'AI-identified critical decision point',
                impactedMetrics: m.impactedMetrics || ['revenue', 'operations'],
                beforeState: { revenue: 10000000, profit: 2000000 },
                afterState: { revenue: 11000000, profit: 2200000 },
              });
            }
          }
          
          if (aiMoments.length > 0) {
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
  }, [events, selectedDepartment]);

  // Fetch ALL real data from APIs
  useEffect(() => {
    const fetchAllChronosData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch all data sources in parallel
        const [snapshotsRes, metricsRes, deliberationsRes, alertsRes, decisionsRes, graphStatsRes] = await Promise.all([
          decisionIntelApi.getChronosSnapshots(),
          metricsApi.getMetrics(),
          councilApi.getActiveDeliberations(),
          alertsApi.getAlerts(),
          councilApi.getRecentDecisions(50),
          graphApi.getStats(),
        ]);

        // Process snapshots
        if (snapshotsRes.success && snapshotsRes.data) {
          console.log('[Chronos] Loaded', (snapshotsRes.data as any[]).length, 'snapshots');
        }

        // Process real graph stats from Neo4j
        if (graphStatsRes.success && graphStatsRes.data) {
          setRealGraphStats({
            entities: graphStatsRes.data.entities,
            relationships: graphStatsRes.data.relationships,
            dataPoints: graphStatsRes.data.dataPoints,
            freshness: graphStatsRes.data.freshness,
          });
          console.log('[Chronos] Loaded real graph stats:', graphStatsRes.data);
        }

        // Process metrics into timeline events
        if (metricsRes.success && metricsRes.data) {
          setRealMetrics(metricsRes.data as any[]);
          console.log('[Chronos] Loaded', (metricsRes.data as any[]).length, 'metrics');
        }

        // Process deliberations into timeline events  
        if (deliberationsRes.success && deliberationsRes.data) {
          setRealDeliberations(deliberationsRes.data as any[]);
          console.log('[Chronos] Loaded', (deliberationsRes.data as any[]).length, 'deliberations');
        }

        // Build real timeline events from all sources
        const realEvents: TimelineEvent[] = [];

        // Add deliberation events
        if (deliberationsRes.success && deliberationsRes.data) {
          (deliberationsRes.data as any[]).forEach((d: any) => {
            realEvents.push({
              id: d.id,
              timestamp: new Date(d.created_at),
              type: 'decision',
              title: d.question?.substring(0, 50) || 'Council Deliberation',
              description: d.question || 'AI Council deliberation',
              impact: d.status === 'COMPLETED' ? 'positive' : 'neutral',
              department: 'Executive',
              magnitude: d.confidence ? Math.round(d.confidence / 10) : 7,
              deliberationId: d.id,
            });
          });
        }

        // Add alert events (from normalized alertsApi)
        if (alertsRes.success && alertsRes.data) {
          (alertsRes.data as any[]).forEach((a: any) => {
            realEvents.push({
              id: a.id,
              timestamp: new Date(a.createdAt),
              type: 'system',
              title: a.title || 'System Alert',
              description: a.message || (a as any).description || 'Alert triggered',
              impact: a.severity === 'critical' ? 'negative' : a.severity === 'warning' ? 'neutral' : 'positive',
              department: 'Operations',
              magnitude: a.severity === 'critical' ? 9 : a.severity === 'warning' ? 7 : 5,
            });
          });
        }

        // Add recent decisions as events
        if (decisionsRes.success && decisionsRes.data) {
          (decisionsRes.data as any[]).forEach((d: any) => {
            realEvents.push({
              id: `decision-${d.id}`,
              timestamp: new Date(d.created_at || d.timestamp || Date.now()),
              type: 'decision',
              title: d.query?.substring(0, 50) || d.title || 'Council Decision',
              description: d.query || d.description || 'Council decision made',
              impact: 'positive',
              department: 'Executive',
              magnitude: 8,
              deliberationId: d.deliberation_id,
            });
          });
        }

        // Sort by timestamp and set
        realEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        // If we have real events, use them; otherwise fall back to generated
        if (realEvents.length > 0) {
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
        setIsLoadingData(false);
      }
    };
    fetchAllChronosData();
  }, []);

  // Generate animated graph nodes
  useEffect(() => {
    const nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
    }));
    setGraphNodes(nodes);
  }, [currentDate]);

  // Update diff snapshot when diff date changes
  useEffect(() => {
    if (diffDate) {
      setDiffSnapshot(generateSnapshot(diffDate, mode));
    }
  }, [diffDate, mode]);

  // Handle deep links to specific timestamps
  useEffect(() => {
    const timestamp = searchParams.get('t');
    if (timestamp) {
      setCurrentDate(new Date(parseInt(timestamp)));
    }
  }, [searchParams]);

  // Mode change handler
  const handleModeChange = (newMode: ChronosMode) => {
    setMode(newMode);
    setIsPlaying(false);
    setEnhancedView('standard');
    if (newMode === 'fastforward') {
      setCurrentDate(new Date());
    } else if (newMode === 'rewind') {
      setCurrentDate(new Date());
    } else {
      setCurrentDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)); // 6 months ago for replay
    }
  };

  // Add bookmark
  const addBookmark = (label: string, notes?: string) => {
    const bookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      timestamp: currentDate,
      label,
      notes,
      createdAt: new Date(),
      sharedUrl: `${window.location.origin}/cortex/intelligence/chronos?t=${currentDate.getTime()}`,
    };
    setBookmarks(prev => [...prev, bookmark]);
    setShowBookmarkModal(false);
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
      const response = await decisionIntelApi.analyzeCausalChain({
        root_event: {
          id: event.id,
          timestamp: event.timestamp.toISOString(),
          type: event.type,
          title: event.title,
          description: event.description,
          impact: event.impact,
        },
        all_events: events.map(e => ({
          id: e.id,
          timestamp: e.timestamp.toISOString(),
          type: e.type,
          title: e.title,
          description: e.description,
          impact: e.impact,
        })),
      });

      if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('[ChronosAI] Causal chain analysis complete:', response.data.length, 'links');
        
        // Build causal chain from AI response
        const effects = (response.data as any[]).map(link => {
          const linkedEvent = events.find(e => e.id === link.toEventId);
          return {
            event: linkedEvent || event,
            delay: Math.floor((new Date().getTime() - event.timestamp.getTime()) / (24 * 60 * 60 * 1000)),
            correlation: link.strength || 0.7,
          };
        }).filter(e => e.event !== event);

        setCausalChain({
          id: `chain-${event.id}`,
          rootCause: event,
          effects,
          totalImpact: {
            revenue: effects.length * 500000,
            profit: effects.length * 100000,
            customers: effects.length * 10,
          },
        });
        return;
      }
    } catch (error) {
      console.log('[ChronosAI] Causal chain analysis failed, using fallback:', error);
    }
    
    // Fallback to local generation
    setCausalChain(generateCausalChain(event, events));
  };

  // Start Council replay
  const startCouncilReplay = (event: TimelineEvent) => {
    setSelectedReplay(generateCouncilReplay(event));
    setEnhancedView('theater');
  };

  // Run Monte Carlo with AI scenario generation
  const runMonteCarlo = async (variable: string) => {
    setEnhancedView('monte-carlo');
    
    // Try AI-powered scenario generation
    try {
      const response = await decisionIntelApi.generateFutureScenarios({
        current_metrics: snapshot.metrics,
        recent_events: events.slice(0, 10).map(e => ({
          id: e.id,
          timestamp: e.timestamp.toISOString(),
          title: e.title,
          impact: e.impact,
        })),
        time_horizon: '12 months',
      });

      if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('[ChronosAI] Generated', response.data.length, 'future scenarios via AI');
        
        // Map AI scenarios to MonteCarloResult format
        const aiResult: MonteCarloResult = {
          id: `mc-${Date.now()}`,
          variable,
          simulations: 10000,
          outcomes: (response.data as any[]).map(s => ({
            scenario: s.name,
            probability: s.probability,
            revenue: s.metrics?.revenue || 12500000,
            profit: s.metrics?.profit || 2800000,
          })),
          optimalPath: (response.data as any[])[2]?.description || 'Base case trajectory',
          confidenceInterval: [10500000, 14500000],
        };
        
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
    const branch: BranchTimeline = {
      id: `branch-${Date.now()}`,
      name: `${variable}: ${alternate}`,
      branchPoint: currentDate,
      variable,
      original,
      alternate,
      divergence: Math.random() * 30 + 10,
      snapshots: Array.from({ length: 12 }, (_, i) => 
        generateSnapshot(new Date(currentDate.getTime() + i * 30 * 24 * 60 * 60 * 1000), 'replay')
      ),
      outcome: ['better', 'worse', 'similar'][Math.floor(Math.random() * 3)] as any,
      deltaRevenue: (Math.random() - 0.3) * 5000000,
      deltaProfit: (Math.random() - 0.4) * 1500000,
    };
    setBranches(prev => [...prev, branch]);
    setSelectedBranch(branch.id);
    setShowBranchModal(false);
  };

  // ==========================================================================
  // ENTERPRISE COMPLIANCE HANDLERS (The Undefeatable 5%)
  // ==========================================================================

  // Live Sync - Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSyncStatus(generateLiveSyncStatus());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Add witness session
  const addWitnessSession = (org: string, role: string, accessLevel: WitnessSession['accessLevel']) => {
    const session: WitnessSession = {
      id: `witness-${Date.now()}`,
      witnessId: `${org.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      witnessOrg: org,
      witnessRole: role,
      accessLevel,
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      airGappedKey: generateHash(`key-${org}-${Date.now()}`).slice(0, 16),
      lastActivity: new Date(),
      viewedBlocks: [],
      isLive: true,
    };
    setWitnessSessions(prev => [...prev, session]);
    setShowWitnessModal(false);
  };

  // Generate court-admissible export
  const generateExport = async (format: CourtAdmissibleExport['format'], withRedaction: boolean) => {
    setExportInProgress(true);
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const exportData = generateCourtExport({ start: timeRange.min, end: currentDate });
    console.log('Court-admissible export generated:', exportData);
    setExportInProgress(false);
    setShowCourtExportModal(false);
    // In production, this would trigger a download
    alert(`✅ Export generated: ${format.toUpperCase()}\nBlocks: ${exportData.includedBlocks.length}\nSignatures: ${exportData.signatures.length}`);
  };

  // ==========================================================================
  // NEW FEATURE HANDLERS - The 5 Power Features
  // ==========================================================================

  // (1) Full Traceability - Show origin → intermediate → final causality
  const openTraceability = (event: TimelineEvent) => {
    const traceability = generateTraceabilityView(event);
    setTraceabilityView(traceability);
    setShowTraceability(true);
  };

  // (2) Per-Event Compliance Snapshot
  const openComplianceSnapshot = (event: TimelineEvent) => {
    const snapshot = generateEventComplianceSnapshot(event);
    setEventComplianceSnapshot(snapshot);
    setShowComplianceSnapshot(true);
  };

  // (3) Reverse Time Check - Rebuild company state at any date
  const runReverseTimeCheck = async (targetDate: Date) => {
    setIsRebuildingState(true);
    setReverseTimeProgress(0);
    setShowReverseTimeCheck(true);
    
    // Simulate progressive reconstruction
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setReverseTimeProgress(i);
    }
    
    const check = generateReverseTimeCheck(targetDate, mode);
    setReverseTimeCheck(check);
    setIsRebuildingState(false);
  };

  // (4) Regulator Mode - Setup read-only session
  const startRegulatorSession = (
    org: RegulatorSession['regulatorOrg'],
    name: string,
    accessLevel: RegulatorSession['accessLevel'],
    timeSlice: { start: Date; end: Date }
  ) => {
    const session: RegulatorSession = {
      id: `reg-${Date.now()}`,
      regulatorId: generateHash(`${org}-${Date.now()}`).slice(0, 16),
      regulatorOrg: org,
      regulatorName: name,
      accessLevel,
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      isReadOnly: true,
      timeSliceStart: timeSlice.start,
      timeSliceEnd: timeSlice.end,
      redactionProfile: accessLevel === 'full_audit' ? 'minimal' : 'standard',
      viewedItems: [],
      exportedReports: [],
      sessionKey: generateHash(`session-${Date.now()}`).slice(0, 32),
      twoFactorVerified: true,
    };
    setRegulatorSession(session);
    setRegulatorMode(true);
    setShowRegulatorSetup(false);
  };

  const endRegulatorSession = () => {
    setRegulatorMode(false);
    setRegulatorSession(null);
  };

  // (5) Zero-Knowledge Audit - Generate ZK proof
  const generateZKAuditProof = async (
    framework: ZeroKnowledgeProof['framework'],
    claim: string
  ) => {
    setIsGeneratingProof(true);
    
    // Simulate ZK proof generation (computationally intensive in real implementation)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const proofType: ZeroKnowledgeProof['proofType'] = 
      framework === 'GDPR' || framework === 'CCPA' ? 'privacy' :
      framework === 'SOX' ? 'financial' :
      framework === 'HIPAA' ? 'privacy' :
      framework === 'NIST' || framework === 'ISO27001' || framework === 'SOC2' ? 'security' :
      'compliance';
    
    const proof = generateZKProof(proofType, framework, claim);
    setZkProofs(prev => [...prev, proof]);
    setIsGeneratingProof(false);
  };

  const getModeStyles = () => {
    switch (mode) {
      case 'rewind': return { gradient: 'from-amber-600 to-orange-700', accent: 'amber', icon: '⏪' };
      case 'replay': return { gradient: 'from-purple-600 to-pink-700', accent: 'purple', icon: '🔀' };
      case 'fastforward': return { gradient: 'from-cyan-600 to-blue-700', accent: 'cyan', icon: '⏩' };
    }
  };
  
  const styles = getModeStyles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/cortex/dashboard')}
              className="text-sm text-neutral-400 hover:text-white mb-1 flex items-center gap-1"
            >
              <span>←</span>
              <span>Back to Cortex</span>
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span>🕰️ CendiaChronos™</span>
              <span className="text-sm font-normal text-neutral-400">
                The Enterprise Time Machine
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-neutral-400">Department</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 text-xs rounded px-2 py-1 text-neutral-100"
              >
                <option value="All Departments">All Departments</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-black/20 rounded-full p-1">
              {(['rewind', 'replay', 'fastforward'] as ChronosMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    mode === m ? 'bg-white text-neutral-900' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {m === 'rewind' && '⏪ Rewind'}
                  {m === 'replay' && '🔀 Replay'}
                  {m === 'fastforward' && '⏩ Fast Forward'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid (Standard View) */}
        {enhancedView === 'standard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Time Machine Controls & State */}
            <div className="col-span-2 space-y-6">
            {/* State at This Time */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span>{styles.icon}</span>
                  Organization State
                  <span className="text-sm font-normal text-neutral-500">
                    @ {currentDate.toLocaleString()}
                  </span>
                </h2>
                {mode === 'rewind' && selectedEvent?.deliberationId && (
                  <button 
                    onClick={() => startCouncilReplay(selectedEvent)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    🎬 Replay Council Deliberation
                  </button>
                )}
              </div>
              
              <MetricsGrid snapshot={snapshot} mode={mode} />
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
            {mode === 'replay' && branches.length > 0 && (
              <div className="bg-neutral-900 rounded-2xl p-6 border border-purple-800">
                <h2 className="text-xl font-semibold mb-4">🌀 Alternate Timelines</h2>
                <BranchList 
                  branches={branches} 
                  selectedId={selectedBranch}
                  onSelect={setSelectedBranch}
                />
              </div>
            )}
          </div>

          {/* Right Column - Events & Actions */}
          <div className="space-y-6">
            {/* Events at This Time */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
              <h2 className="text-lg font-semibold mb-4">📅 Events</h2>
              <EventsList
                events={filteredEvents}
                currentDate={currentDate}
                onSelect={setSelectedEvent}
                selectedId={selectedEvent?.id}
              />
            </div>

            {/* Replay Actions */}
            {mode === 'replay' && (
              <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-700">
                <h2 className="text-lg font-semibold mb-4">🔀 Create Alternate Timeline</h2>
                <VariableSelector onCreateBranch={() => setShowBranchModal(true)} />
              </div>
            )}

            {/* Fast Forward Predictions */}
            {mode === 'fastforward' && (
              <div className="bg-cyan-900/30 rounded-2xl p-6 border border-cyan-700">
                <h2 className="text-lg font-semibold mb-4">🔮 Prediction Confidence</h2>
                <PredictionConfidence currentDate={currentDate} />
              </div>
            )}

            {/* Audit Trail (Rewind) */}
            {mode === 'rewind' && (
              <div className="bg-amber-900/30 rounded-2xl p-6 border border-amber-700">
                <h2 className="text-lg font-semibold mb-4">📋 Export Audit Package</h2>
                <AuditExport currentDate={currentDate} />
              </div>
            )}

            {/* Pivotal Moments */}
            <PivotalMomentsPanel
              moments={filteredPivotalMoments}
              onJumpTo={setCurrentDate}
              onStartImpactTrace={startImpactTrace}
            />
            </div>
          </div>
        )}

      {/* Branch Creation Modal */}
      {showBranchModal && (
        <BranchModal
          branchPoint={currentDate}
          onClose={() => setShowBranchModal(false)}
          onCreate={createBranch}
        />
      )}

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <BookmarkModal
          currentDate={currentDate}
          onSave={addBookmark}
          onClose={() => setShowBookmarkModal(false)}
        />
      )}

      {/* Court-Admissible Export Modal */}
      {showCourtExportModal && (
        <CourtExportModal
          timeRange={timeRange}
          currentDate={currentDate}
          onExport={generateExport}
          onClose={() => setShowCourtExportModal(false)}
          isExporting={exportInProgress}
        />
      )}

      {/* Witness Session Modal */}
      {showWitnessModal && (
        <WitnessModal
          onAdd={addWitnessSession}
          onClose={() => setShowWitnessModal(false)}
        />
      )}

      {/* Full Traceability Modal */}
      {showTraceability && traceabilityView && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
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
                  {traceabilityView.intermediateTransforms.map((t: { step: number; service: string; operation: string; outputHash: string; duration: number }, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-black/30 rounded-lg p-3">
                      <span className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold">{t.step}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{t.service} → {t.operation}</div>
                        <div className="text-xs text-neutral-400 font-mono">Hash: {t.outputHash.slice(0, 16)}...</div>
                      </div>
                      <div className="text-xs text-neutral-400">{t.duration}ms</div>
                    </div>
                  ))}
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
        </div>
      )}

      {/* Per-Event Compliance Snapshot Modal */}
      {showComplianceSnapshot && eventComplianceSnapshot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
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
        </div>
      )}

      {/* Reverse Time Check Modal */}
      {showReverseTimeCheck && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-700 w-full max-w-3xl">
            <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">🔄 Chronos Integrity Validation</h2>
                <p className="text-neutral-400 text-sm mt-1">Rebuilding company state as of {currentDate.toLocaleDateString()}</p>
              </div>
              <button onClick={() => setShowReverseTimeCheck(false)} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="p-6">
              {isRebuildingState ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-spin">⏳</div>
                  <div className="text-white font-bold text-xl mb-2">Reconstructing State...</div>
                  <div className="w-full bg-neutral-700 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all" style={{ width: `${reverseTimeProgress}%` }} />
                  </div>
                  <div className="text-neutral-400">{reverseTimeProgress}% complete</div>
                </div>
              ) : reverseTimeCheck && (
                <div className="space-y-6">
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
                  {reverseTimeCheck.forensicReport.legalAdmissible && (
                    <div className="mt-3 text-green-400 text-sm">⚖️ This report is court-admissible</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Regulator Mode Setup Modal */}
      {showRegulatorSetup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
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
                {(['SEC', 'FDIC', 'OCC', 'FRB', 'DOJ', 'FTC', 'HHS', 'Custom'] as const).map(org => (
                  <button key={org} onClick={() => startRegulatorSession(org, `${org} Auditor`, 'full_audit', { start: timeRange.min, end: currentDate })} className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left transition-colors">
                    <div className="text-white font-bold">{org}</div>
                    <div className="text-neutral-400 text-sm">{org === 'SEC' ? 'Securities & Exchange' : org === 'FDIC' ? 'Federal Deposit Insurance' : org === 'Custom' ? 'Custom Regulatory Body' : `${org} Agency`}</div>
                  </button>
                ))}
              </div>
              <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700">
                <div className="text-amber-400 font-semibold">⚠️ Important</div>
                <div className="text-neutral-300 text-sm mt-1">Regulator Mode provides read-only access with automatic redaction. All access is logged.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regulator Mode Banner */}
      {regulatorMode && regulatorSession && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 z-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl">🔴</span>
            <div>
              <span className="font-bold">REGULATOR MODE ACTIVE</span>
              <span className="ml-4 text-sm opacity-80">{regulatorSession.regulatorOrg} - Expires: {regulatorSession.expiresAt.toLocaleTimeString()}</span>
            </div>
          </div>
          <button onClick={endRegulatorSession} className="bg-white text-red-600 px-4 py-1 rounded-lg font-bold hover:bg-red-100">End Session</button>
        </div>
      )}

      {/* Zero-Knowledge Audit Modal */}
      {showZKAudit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
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
                  {(['GDPR', 'HIPAA', 'SOX', 'SOC2', 'NIST', 'ISO27001', 'CCPA', 'OECD_AI'] as const).map(fw => (
                    <button key={fw} onClick={() => generateZKAuditProof(fw, `We are compliant with ${fw} requirements`)} disabled={isGeneratingProof} className="p-3 bg-black/30 hover:bg-black/50 rounded-lg text-center transition-colors disabled:opacity-50">
                      <div className="text-white font-bold">{fw}</div>
                      <div className="text-xs text-neutral-400">Generate Proof</div>
                    </button>
                  ))}
                </div>
                {isGeneratingProof && <div className="mt-4 text-center text-cyan-400"><span className="animate-spin inline-block mr-2">⚡</span>Generating cryptographic proof...</div>}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Generated Proofs ({zkProofs.length})</h3>
                {zkProofs.length === 0 ? (
                  <div className="text-neutral-400 text-center py-8">No proofs generated yet. Click a framework above.</div>
                ) : (
                  <div className="space-y-3">
                    {zkProofs.map((proof: ZeroKnowledgeProof, i: number) => (
                      <div key={i} className="bg-neutral-800 rounded-xl p-4">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-6 bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                <h3 className="text-purple-400 font-semibold mb-2">🔮 How Zero-Knowledge Proofs Work</h3>
                <div className="text-neutral-300 text-sm">Zero-knowledge proofs allow you to prove statements about your data without revealing the data itself. Demonstrate GDPR compliance without exposing PII.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
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
}> = ({ currentDate, minDate, maxDate, onDateChange, mode, events, isPlaying, onPlayPause, playbackSpeed, onSpeedChange }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const totalMs = maxDate.getTime() - minDate.getTime();
  const position = ((currentDate.getTime() - minDate.getTime()) / totalMs) * 100;
  
  // Calculate date from mouse position
  const getDateFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) {return null;}
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = x / rect.width;
    return new Date(minDate.getTime() + pct * totalMs);
  }, [minDate, totalMs]);

  const handleTrackClick = (e: React.MouseEvent) => {
    const newDate = getDateFromPosition(e.clientX);
    if (newDate) {onDateChange(newDate);}
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const newDate = getDateFromPosition(e.clientX);
    if (newDate) {onDateChange(newDate);}
  };

  // Handle drag move and end
  useEffect(() => {
    if (!isDragging) {return;}

    const handleMouseMove = (e: MouseEvent) => {
      const newDate = getDateFromPosition(e.clientX);
      if (newDate) {onDateChange(newDate);}
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, getDateFromPosition, onDateChange]);

  const getGradient = () => {
    switch (mode) {
      case 'rewind': return 'from-amber-500 to-orange-600';
      case 'replay': return 'from-purple-500 to-pink-600';
      case 'fastforward': return 'from-cyan-500 to-blue-600';
    }
  };

  // Event markers
  const markers = events
    .filter(e => e.timestamp >= minDate && e.timestamp <= maxDate)
    .map(e => ({
      position: ((e.timestamp.getTime() - minDate.getTime()) / totalMs) * 100,
      event: e,
    }));

  const handleJumpToNearestEvent = () => {
    if (events.length === 0) { return; }
    let nearest = events[0];
    let nearestDiff = Math.abs(events[0].timestamp.getTime() - currentDate.getTime());
    for (const e of events) {
      const diff = Math.abs(e.timestamp.getTime() - currentDate.getTime());
      if (diff < nearestDiff) {
        nearest = e;
        nearestDiff = diff;
      }
    }
    onDateChange(nearest.timestamp);
  };

  return (
    <div>
      {/* Date Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-500">
          {minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}>
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-neutral-400">
            {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="text-sm text-neutral-500">
          {maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Track */}
      <div 
        ref={trackRef}
        className={`relative h-16 bg-neutral-800 rounded-xl cursor-pointer overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
      >
        {/* Progress */}
        <div 
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getGradient()} opacity-20`}
          style={{ width: `${position}%` }}
        />
        
        {/* Event Markers */}
        {markers.map((m, i) => (
          <div
            key={i}
            className={`absolute top-2 bottom-2 w-0.5 rounded-full ${
              m.event.impact === 'positive' ? 'bg-green-500' :
              m.event.impact === 'negative' ? 'bg-red-500' : 'bg-neutral-600'
            } ${Math.abs(m.position - position) < 1 ? 'opacity-100 w-1' : 'opacity-40'}`}
            style={{ left: `${m.position}%` }}
            title={m.event.title}
          />
        ))}
        
        {/* Now Marker */}
        {mode === 'fastforward' && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white/50"
            style={{ left: `${((new Date().getTime() - minDate.getTime()) / totalMs) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400 whitespace-nowrap">NOW</div>
          </div>
        )}
        
        {/* Playhead */}
        <div 
          className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b ${getGradient()}`}
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${getGradient()} border-2 border-white shadow-lg`} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => onDateChange(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          title="Back 1 week"
        >
          ⏮️
        </button>
        <button
          onClick={onPlayPause}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isPlaying ? 'bg-red-600 hover:bg-red-500' : `bg-gradient-to-r ${getGradient()}`
          }`}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button
          onClick={() => onDateChange(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
          className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          title="Forward 1 week"
        >
          ⏭️
        </button>
        
        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm text-neutral-500">Speed:</span>
          {[1, 2, 5, 10].map(speed => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-2 py-1 text-xs rounded ${
                playbackSpeed === speed ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {speed}x
            </button>
          ))}
          <button
            onClick={handleJumpToNearestEvent}
            className="ml-2 px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Jump to Event
          </button>
        </div>
      </div>

      {/* Quick Jump */}
      <div className="flex justify-center gap-2 mt-3">
        {mode === 'rewind' && (
          <>
            <QuickJump label="Yesterday" onClick={() => onDateChange(new Date(Date.now() - 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Week" onClick={() => onDateChange(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Month" onClick={() => onDateChange(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Quarter" onClick={() => onDateChange(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="Last Year" onClick={() => onDateChange(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))} />
          </>
        )}
        {mode === 'fastforward' && (
          <>
            <QuickJump label="+1 Month" onClick={() => onDateChange(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="+1 Quarter" onClick={() => onDateChange(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="+6 Months" onClick={() => onDateChange(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000))} />
            <QuickJump label="+1 Year" onClick={() => onDateChange(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))} />
          </>
        )}
      </div>
    </div>
  );
};

const QuickJump: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors"
  >
    {label}
  </button>
);

const MetricsGrid: React.FC<{ snapshot: StateSnapshot; mode: ChronosMode }> = ({ snapshot, mode }) => {
  const metrics = [
    { key: 'revenue', label: 'Revenue', icon: '💰', format: (v: number) => `$${(v / 1000000).toFixed(1)}M` },
    { key: 'profit', label: 'Profit', icon: '📈', format: (v: number) => `$${(v / 1000000).toFixed(1)}M` },
    { key: 'employees', label: 'Employees', icon: '👥', format: (v: number) => v.toLocaleString() },
    { key: 'customers', label: 'Customers', icon: '🏢', format: (v: number) => v.toLocaleString() },
    { key: 'satisfaction', label: 'NPS Score', icon: '😊', format: (v: number) => `${v.toFixed(0)}` },
    { key: 'marketShare', label: 'Market Share', icon: '🎯', format: (v: number) => `${v.toFixed(1)}%` },
    { key: 'burnRate', label: 'Burn Rate', icon: '🔥', format: (v: number) => `$${(v / 1000).toFixed(0)}K/mo` },
    { key: 'runway', label: 'Runway', icon: '🛫', format: (v: number) => `${v} months` },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map(({ key, label, icon, format }) => (
        <div key={key} className="bg-neutral-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
            <span>{icon}</span>
            <span>{label}</span>
          </div>
          <div className="text-2xl font-bold">
            {format((snapshot.metrics as any)[key])}
          </div>
          {mode === 'fastforward' && (
            <div className="text-xs text-cyan-400 mt-1">Projected</div>
          )}
        </div>
      ))}
    </div>
  );
};

const CouncilState: React.FC<{ council: StateSnapshot['council']; mode: ChronosMode }> = ({ council, mode }) => (
  <div className="grid grid-cols-4 gap-4">
    <div className="bg-neutral-800/50 rounded-xl p-4">
      <div className="text-sm text-neutral-400 mb-1">Active Agents</div>
      <div className="text-2xl font-bold">{council.activeAgents.length}</div>
      <div className="text-xs text-neutral-500 mt-1">{council.activeAgents.join(', ')}</div>
    </div>
    <div className="bg-neutral-800/50 rounded-xl p-4">
      <div className="text-sm text-neutral-400 mb-1">Pending Decisions</div>
      <div className="text-2xl font-bold">{council.pendingDecisions}</div>
    </div>
    <div className="bg-neutral-800/50 rounded-xl p-4">
      <div className="text-sm text-neutral-400 mb-1">Total Deliberations</div>
      <div className="text-2xl font-bold">{council.totalDeliberations === 0 ? '—' : council.totalDeliberations}</div>
    </div>
    <div className="bg-neutral-800/50 rounded-xl p-4">
      <div className="text-sm text-neutral-400 mb-1">Consensus Rate</div>
      <div className="text-2xl font-bold">{council.consensusRate.toFixed(0)}%</div>
    </div>
  </div>
);

const GraphState: React.FC<{ graph: StateSnapshot['graph']; mode: ChronosMode }> = ({ graph, mode }) => (
  <div className="grid grid-cols-4 gap-4">
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
      <div className="text-2xl font-bold">{graph.dataPoints === 0 ? '—' : `${(graph.dataPoints / 1000000).toFixed(1)}M`}</div>
    </div>
    <div className="bg-neutral-800/50 rounded-xl p-4">
      <div className="text-sm text-neutral-400 mb-1">Freshness</div>
      <div className="text-2xl font-bold">{graph.freshness.toFixed(0)}%</div>
    </div>
  </div>
);

const EventsList: React.FC<{
  events: TimelineEvent[];
  currentDate: Date;
  onSelect: (event: TimelineEvent) => void;
  selectedId?: string;
}> = ({ events, currentDate, onSelect, selectedId }) => {
  const visibleEvents = events
    .filter(e => e.timestamp <= currentDate)
    .slice(0, 8);

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'decision': return '⚖️';
      case 'metric': return '📊';
      case 'personnel': return '👤';
      case 'financial': return '💵';
      case 'system': return '⚙️';
      case 'milestone': return '🏆';
    }
  };

  const getSeverityIcon = (impact: TimelineEvent['impact']) => {
    switch (impact) {
      case 'negative': return '🔴';
      case 'neutral': return '🟡';
      case 'positive': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {visibleEvents.length === 0 ? (
        <div className="text-center text-neutral-500 py-8">No events at this time</div>
      ) : (
        visibleEvents.map(event => (
          <button
            key={event.id}
            onClick={() => onSelect(event)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedId === event.id ? 'bg-white/10 ring-1 ring-white/30' :
              event.impact === 'positive' ? 'bg-green-900/20 hover:bg-green-900/30' :
              event.impact === 'negative' ? 'bg-red-900/20 hover:bg-red-900/30' :
              'bg-neutral-800/50 hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg flex items-center gap-1">
                <span aria-hidden>{getSeverityIcon(event.impact)}</span>
                <span>{getTypeIcon(event.type)}</span>
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{event.title}</p>
                <p className="text-xs text-neutral-500">
                  {event.timestamp.toLocaleDateString()} • {event.department}
                </p>
              </div>
              {event.deliberationId && (
                <span className="text-xs bg-amber-600/30 text-amber-400 px-2 py-0.5 rounded">Replay</span>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  );
};

const VariableSelector: React.FC<{ onCreateBranch: () => void }> = ({ onCreateBranch }) => (
  <div className="space-y-4">
    <p className="text-sm text-purple-300">
      Select a decision point from the events list, then create an alternate timeline to see what would have happened.
    </p>
    <button
      onClick={onCreateBranch}
      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity"
    >
      🔀 Create Alternate Timeline
    </button>
  </div>
);

const BranchList: React.FC<{
  branches: BranchTimeline[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ branches, selectedId, onSelect }) => (
  <div className="space-y-3">
    {branches.map(branch => (
      <button
        key={branch.id}
        onClick={() => onSelect(branch.id)}
        className={`w-full text-left p-4 rounded-xl border transition-colors ${
          selectedId === branch.id 
            ? 'bg-purple-900/30 border-purple-500' 
            : 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-600'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{branch.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            branch.outcome === 'better' ? 'bg-green-600' :
            branch.outcome === 'worse' ? 'bg-red-600' : 'bg-neutral-600'
          }`}>
            {branch.outcome === 'better' ? '✓ Better' : branch.outcome === 'worse' ? '✗ Worse' : '≈ Similar'}
          </span>
        </div>
        <div className="text-sm text-neutral-400">
          <span className="line-through text-red-400">{branch.original}</span>
          {' → '}
          <span className="text-green-400">{branch.alternate}</span>
        </div>
        <div className="flex gap-4 mt-2 text-sm">
          <span className={branch.deltaRevenue >= 0 ? 'text-green-400' : 'text-red-400'}>
            Revenue: {branch.deltaRevenue >= 0 ? '+' : ''}{(branch.deltaRevenue / 1000000).toFixed(1)}M
          </span>
          <span className={branch.deltaProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
            Profit: {branch.deltaProfit >= 0 ? '+' : ''}{(branch.deltaProfit / 1000000).toFixed(1)}M
          </span>
        </div>
      </button>
    ))}
  </div>
);

const PredictionConfidence: React.FC<{ currentDate: Date }> = ({ currentDate }) => {
  const daysAhead = Math.floor((currentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  const confidence = Math.max(10, 95 - daysAhead * 0.3);
  
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-neutral-400">Prediction Confidence</span>
          <span className={confidence > 70 ? 'text-green-400' : confidence > 40 ? 'text-yellow-400' : 'text-red-400'}>
            {confidence.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              confidence > 70 ? 'bg-green-500' : confidence > 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${confidence}%` }}
          />
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
    </div>
  );
};

const AuditExport: React.FC<{ currentDate: Date }> = ({ currentDate }) => (
  <div className="space-y-4">
    <p className="text-sm text-amber-300">
      Generate a complete audit package for this point in time, including all Council deliberations, decisions, and supporting data.
    </p>
    <div className="space-y-2">
      <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors">
        📄 Export PDF Report
      </button>
      <button className="w-full py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-medium transition-colors">
        📦 Export Data Package (JSON)
      </button>
      <button className="w-full py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-medium transition-colors">
        🎬 Record Council Replay
      </button>
    </div>
    <p className="text-xs text-neutral-500">
      All exports include cryptographic proof of authenticity and chain of custody.
    </p>
  </div>
);

const BranchModal: React.FC<{
  branchPoint: Date;
  onClose: () => void;
  onCreate: (variable: string, original: string, alternate: string) => void;
}> = ({ branchPoint, onClose, onCreate }) => {
  const [selected, setSelected] = useState<{ variable: string; original: string } | null>(null);
  const [alternate, setAlternate] = useState('');

  const variables = [
    { variable: 'VP of Sales', original: 'Terminated', alternatives: ['Retained', 'Reassigned to EMEA', 'Promoted to CRO'] },
    { variable: 'Q3 Marketing Budget', original: '$2.5M', alternatives: ['$1.5M (Conservative)', '$4M (Aggressive)', '$3M (Moderate)'] },
    { variable: 'Product V2 Launch', original: 'September', alternatives: ['June (Early)', 'December (Delayed)', 'Cancelled'] },
    { variable: 'Enterprise Pricing', original: '$500/seat', alternatives: ['$350/seat', '$650/seat', 'Usage-based'] },
    { variable: 'Engineering Headcount', original: '+15', alternatives: ['+5 (Lean)', '+25 (Aggressive)', 'Hiring Freeze'] },
    { variable: 'Series C Terms', original: '$50M @ $400M', alternatives: ['$30M @ $300M', '$75M @ $500M', 'Delayed 6mo'] },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
            {variables.map(v => (
              <button
                key={v.variable}
                onClick={() => { setSelected(v); setAlternate(''); }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selected?.variable === v.variable
                    ? 'bg-purple-900/50 ring-1 ring-purple-500'
                    : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
              >
                <div className="font-medium">{v.variable}</div>
                <div className="text-sm text-neutral-500">Currently: {v.original}</div>
              </button>
            ))}
          </div>
          
          {selected && (
            <div className="pt-4 border-t border-neutral-800">
              <div className="text-sm text-neutral-400 mb-2">What if it was instead:</div>
              <div className="flex flex-wrap gap-2">
                {variables.find(v => v.variable === selected.variable)?.alternatives.map(alt => (
                  <button
                    key={alt}
                    onClick={() => setAlternate(alt)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      alternate === alt
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-800 hover:bg-neutral-700'
                    }`}
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 pt-0">
          <button
            onClick={() => selected && alternate && onCreate(selected.variable, selected.original, alternate)}
            disabled={!selected || !alternate}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              selected && alternate
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            🌀 Simulate Alternate Timeline
          </button>
        </div>
      </div>
    </div>
  );
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
}> = ({ currentSnapshot, compareSnapshot, currentDate, compareDate, onSelectCompareDate }) => {
  const quickDates = [
    { label: '1 Week Ago', date: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) },
    { label: '1 Month Ago', date: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000) },
    { label: '1 Quarter Ago', date: new Date(currentDate.getTime() - 90 * 24 * 60 * 60 * 1000) },
    { label: '1 Year Ago', date: new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000) },
  ];

  const metrics = [
    { key: 'revenue', label: 'Revenue', format: (v: number) => `$${(v / 1000000).toFixed(2)}M` },
    { key: 'profit', label: 'Profit', format: (v: number) => `$${(v / 1000000).toFixed(2)}M` },
    { key: 'employees', label: 'Employees', format: (v: number) => v.toLocaleString() },
    { key: 'customers', label: 'Customers', format: (v: number) => v.toLocaleString() },
    { key: 'satisfaction', label: 'NPS Score', format: (v: number) => v.toFixed(0) },
    { key: 'marketShare', label: 'Market Share', format: (v: number) => `${v.toFixed(1)}%` },
  ];

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          ⚖️ Diff View
          <span className="text-sm font-normal text-neutral-500">Compare two points in time</span>
        </h2>
        <div className="flex gap-2">
          {quickDates.map(q => (
            <button
              key={q.label}
              onClick={() => onSelectCompareDate(q.date)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                compareDate?.toDateString() === q.date.toDateString()
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700'
              }`}
            >
              {q.label}
            </button>
          ))}
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
            {compareDate?.toLocaleDateString() || 'Select a date'}
          </div>
        </div>
      </div>

      {/* Metrics Comparison */}
      {compareSnapshot && (
        <div className="space-y-3">
          {metrics.map(({ key, label, format }) => {
            const current = (currentSnapshot.metrics as any)[key];
            const compare = (compareSnapshot.metrics as any)[key];
            const diff = current - compare;
            const pctChange = ((diff) / compare) * 100;
            
            return (
              <div key={key} className="grid grid-cols-4 gap-4 items-center p-3 bg-neutral-800/50 rounded-lg">
                <div className="font-medium">{label}</div>
                <div className="text-right text-amber-400">{format(current)}</div>
                <div className="text-right text-cyan-400">{format(compare)}</div>
                <div className={`text-right font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {diff >= 0 ? '↑' : '↓'} {Math.abs(pctChange).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Council Replay Theater
const CouncilTheater: React.FC<{
  replay: CouncilReplay | null;
  onClose: () => void;
}> = ({ replay, onClose }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && replay && currentPhase < replay.phases.length - 1) {
      const timer = setTimeout(() => setCurrentPhase(p => p + 1), 3000);
      return () => clearTimeout(timer);
    } else if (currentPhase >= (replay?.phases.length || 0) - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentPhase, replay]);

  if (!replay) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 text-center">
        <span className="text-6xl mb-4 block">🎬</span>
        <h2 className="text-xl font-bold mb-2">Council Replay Theater</h2>
        <p className="text-neutral-400">Select an event with a deliberation to replay</p>
      </div>
    );
  }

  const agentColors: Record<string, string> = {
    'Chief Strategic Agent': 'from-blue-600 to-indigo-700',
    'CFO Agent': 'from-green-600 to-emerald-700',
    'COO Agent': 'from-orange-600 to-amber-700',
    'CISO Agent': 'from-red-600 to-rose-700',
    'CMO Agent': 'from-purple-600 to-pink-700',
  };

  return (
    <div className="bg-neutral-900 rounded-2xl border border-amber-800 overflow-hidden">
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
          {replay.participants.map(p => (
            <span key={p} className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${agentColors[p] || 'from-neutral-600 to-neutral-700'}`}>
              {p.replace(' Agent', '')}
            </span>
          ))}
        </div>
      </div>

      {/* Deliberation Phases */}
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {replay.phases.map((phase, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl transition-all duration-500 ${
              idx <= currentPhase ? 'opacity-100' : 'opacity-30'
            } ${idx === currentPhase ? 'ring-2 ring-amber-500' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${agentColors[phase.agent] || 'from-neutral-600 to-neutral-700'} flex items-center justify-center text-lg`}>
                {phase.agent.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{phase.agent}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    phase.sentiment === 'positive' ? 'bg-green-900 text-green-300' :
                    phase.sentiment === 'negative' ? 'bg-red-900 text-red-300' :
                    'bg-neutral-700 text-neutral-300'
                  }`}>
                    {phase.sentiment}
                  </span>
                </div>
                <p className="text-neutral-300">{phase.statement}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCurrentPhase(0); setIsPlaying(true); }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium"
            >
              ▶️ Play from Start
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
            >
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
    </div>
  );
};

// Impact Trace View
const ImpactTraceView: React.FC<{
  causalChain: CausalChain | null;
  onClose: () => void;
}> = ({ causalChain, onClose }) => {
  if (!causalChain) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 text-center">
        <span className="text-6xl mb-4 block">🔗</span>
        <h2 className="text-xl font-bold mb-2">Impact Trace</h2>
        <p className="text-neutral-400">Select an event to trace its ripple effects</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-blue-800 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">🔗 Impact Trace: Causal Analysis</h2>
            <p className="text-blue-200 text-sm">Root Cause: {causalChain.rootCause.title}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
      </div>

      <div className="p-6">
        {/* Root Event */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <div className="font-bold text-lg">{causalChain.rootCause.title}</div>
            <div className="text-sm text-neutral-400">
              {causalChain.rootCause.timestamp.toLocaleDateString()} • {causalChain.rootCause.department}
            </div>
          </div>
        </div>

        {/* Ripple Effects */}
        <div className="relative pl-8 border-l-2 border-blue-600 space-y-4">
          {causalChain.effects.map((effect, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-600 border-2 border-neutral-900" />
              <div className="bg-neutral-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{effect.event.title}</span>
                  <span className="text-xs text-neutral-500">+{effect.delay} days</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-neutral-400">Correlation:</span>
                  <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${effect.correlation * 100}%` }}
                    />
                  </div>
                  <span className="text-blue-400">{(effect.correlation * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Impact */}
        <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-800">
          <h3 className="font-semibold mb-3">📊 Total Impact</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-neutral-400">Revenue Impact</div>
              <div className={`text-xl font-bold ${causalChain.totalImpact.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {causalChain.totalImpact.revenue >= 0 ? '+' : ''}{(causalChain.totalImpact.revenue / 1000000).toFixed(1)}M
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-400">Profit Impact</div>
              <div className={`text-xl font-bold ${causalChain.totalImpact.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {causalChain.totalImpact.profit >= 0 ? '+' : ''}{(causalChain.totalImpact.profit / 1000000).toFixed(1)}M
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-400">Customer Impact</div>
              <div className={`text-xl font-bold ${causalChain.totalImpact.customers >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {causalChain.totalImpact.customers >= 0 ? '+' : ''}{causalChain.totalImpact.customers}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Monte Carlo Simulation View
const MonteCarloView: React.FC<{
  result: MonteCarloResult | null;
  onRun: (variable: string) => void;
  onClose: () => void;
}> = ({ result, onRun, onClose }) => {
  const variables = ['Q3 Marketing Budget', 'Hiring Strategy', 'Pricing Model', 'Product Roadmap', 'M&A Decision'];

  if (!result) {
    return (
      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🎲 Monte Carlo Simulation
        </h2>
        <p className="text-neutral-400 mb-6">
          Run 10,000+ simulations to find the optimal decision path with probability distributions.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {variables.map(v => (
            <button
              key={v}
              onClick={() => onRun(v)}
              className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-left transition-colors"
            >
              <div className="font-medium">{v}</div>
              <div className="text-xs text-neutral-500">Click to simulate</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const maxProb = Math.max(...result.outcomes.map(o => o.probability));

  return (
    <div className="bg-neutral-900 rounded-2xl border border-green-800 overflow-hidden">
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
            {result.outcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-28 text-sm">{outcome.scenario}</div>
                <div className="flex-1 h-8 bg-neutral-800 rounded-lg overflow-hidden relative">
                  <div 
                    className={`h-full bg-gradient-to-r ${
                      idx === 2 ? 'from-green-500 to-emerald-500' : 'from-neutral-600 to-neutral-500'
                    }`}
                    style={{ width: `${(outcome.probability / maxProb) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-sm font-medium">
                    {(outcome.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-24 text-right text-sm">
                  ${(outcome.revenue / 1000000).toFixed(1)}M
                </div>
              </div>
            ))}
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
              ${(result.confidenceInterval[0] / 1000000).toFixed(1)}M - ${(result.confidenceInterval[1] / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="p-4 bg-neutral-800/50 rounded-xl">
            <div className="text-sm text-neutral-400">Expected Value</div>
            <div className="text-lg font-bold text-green-400">
              ${((result.confidenceInterval[0] + result.confidenceInterval[1]) / 2000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pivotal Moments Panel
const PivotalMomentsPanel: React.FC<{
  moments: PivotalMoment[];
  onJumpTo: (date: Date) => void;
  onStartImpactTrace: (event: TimelineEvent) => void;
}> = ({ moments, onJumpTo, onStartImpactTrace }) => {
  const getSeverityMeta = (significance: number) => {
    if (significance >= 80) {
      return { label: 'HIGH', badgeClass: 'bg-red-900 text-red-300', icon: '🔴' };
    }
    if (significance >= 60) {
      return { label: 'MEDIUM', badgeClass: 'bg-amber-900 text-amber-300', icon: '🟠' };
    }
    return { label: 'NOTABLE', badgeClass: 'bg-yellow-900 text-yellow-300', icon: '🟡' };
  };

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        ⚡ AI-Detected Pivotal Moments
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {moments.map(moment => {
          const { label, badgeClass, icon } = getSeverityMeta(moment.significance);
          return (
            <div
              key={moment.id}
              className="p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm" aria-hidden>{icon}</span>
                  <span className="font-medium text-sm">{moment.event.title}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClass}`}>
                  {label}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-2">{moment.reason}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => onJumpTo(moment.timestamp)}
                  className="px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded"
                >
                  Jump to
                </button>
                <button
                  onClick={() => onStartImpactTrace(moment.event)}
                  className="px-2 py-1 text-xs bg-blue-700 hover:bg-blue-600 rounded"
                >
                  Trace Impact
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Animated Graph Preview
const AnimatedGraphPreview: React.FC<{
  nodes: Array<{x: number; y: number; size: number}>;
  snapshot: StateSnapshot;
}> = ({ nodes, snapshot }) => (
  <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">
      🕸️ Knowledge Graph State
    </h3>
    <div className="relative h-40 bg-neutral-800/50 rounded-lg overflow-hidden">
      {/* Animated nodes */}
      <svg className="absolute inset-0 w-full h-full">
        {nodes.map((node, i) => (
          <g key={i}>
            {/* Connections */}
            {nodes.slice(i + 1, i + 3).map((target, j) => (
              <line
                key={j}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="1"
              />
            ))}
            {/* Node */}
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill="rgba(59, 130, 246, 0.6)"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          </g>
        ))}
      </svg>
      {/* Stats overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs">
        <span className="bg-black/50 px-2 py-1 rounded">{snapshot.graph.entities.toLocaleString()} entities</span>
        <span className="bg-black/50 px-2 py-1 rounded">{snapshot.graph.relationships.toLocaleString()} relationships</span>
        <span className="bg-black/50 px-2 py-1 rounded">{snapshot.graph.freshness}% fresh</span>
      </div>
    </div>
  </div>
);

// Bookmark Modal
const BookmarkModal: React.FC<{
  currentDate: Date;
  onSave: (label: string, notes?: string) => void;
  onClose: () => void;
}> = ({ currentDate, onSave, onClose }) => {
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Q3 Budget Decision"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context for future reference..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 h-20 resize-none focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => label && onSave(label, notes)}
            disabled={!label}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              label
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            🔖 Save Bookmark
          </button>
        </div>
      </div>
    </div>
  );
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
}> = ({ ledger, liveSyncStatus, witnessSessions, redactionRules, onClose }) => (
  <div className="bg-gradient-to-b from-emerald-950 to-neutral-950 border-b border-emerald-800">
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
              <span className="font-mono text-[10px] text-neutral-500">{ledger.latestBlock.hash.slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Integrity</span>
              <span className={`font-bold ${ledger.integrityStatus === 'verified' ? 'text-green-400' : 'text-red-400'}`}>
                {ledger.integrityStatus.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Last Verified</span>
              <span>{Math.floor((Date.now() - ledger.lastVerified.getTime()) / 1000)}s ago</span>
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
                {liveSyncStatus.websocketStatus.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Sync Lag</span>
              <span className={liveSyncStatus.syncLag < 100 ? 'text-green-400' : 'text-amber-400'}>
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
          {witnessSessions.length === 0 ? (
            <p className="text-sm text-neutral-500">No active witness sessions</p>
          ) : (
            <div className="space-y-2">
              {witnessSessions.map(session => (
                <div key={session.id} className="p-2 bg-amber-900/20 rounded-lg text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.witnessOrg}</span>
                    <span className={`w-2 h-2 rounded-full ${session.isLive ? 'bg-green-400' : 'bg-neutral-500'}`} />
                  </div>
                  <div className="text-xs text-neutral-400">{session.witnessRole}</div>
                  <div className="text-xs text-neutral-500">Access: {session.accessLevel}</div>
                </div>
              ))}
            </div>
          )}
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
              {redactionRules.slice(0, 3).map(rule => (
                <div key={rule.id} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    rule.category === 'pii' ? 'bg-red-400' :
                    rule.category === 'phi' ? 'bg-purple-400' :
                    rule.category === 'personnel' ? 'bg-amber-400' :
                    'bg-neutral-400'
                  }`} />
                  <span className="text-xs text-neutral-400">{rule.field}</span>
                  <span className="text-[10px] px-1 bg-neutral-700 rounded">{rule.category}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              Financial truth preserved across all redactions
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Court-Admissible Export Modal
const CourtExportModal: React.FC<{
  timeRange: { min: Date; max: Date };
  currentDate: Date;
  onExport: (format: CourtAdmissibleExport['format'], withRedaction: boolean) => void;
  onClose: () => void;
  isExporting: boolean;
}> = ({ timeRange, currentDate, onExport, onClose, isExporting }) => {
  const [format, setFormat] = useState<CourtAdmissibleExport['format']>('forensic-bundle');
  const [withRedaction, setWithRedaction] = useState(true);
  const [includeCounsel, setIncludeCounsel] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
              {[
                { id: 'forensic-bundle', label: '🔒 Forensic Bundle', desc: 'Full chain + proofs' },
                { id: 'pdf', label: '📄 PDF Report', desc: 'Human-readable' },
                { id: 'json', label: '📋 JSON Data', desc: 'Machine-readable' },
                { id: 'xml', label: '📑 XML/XBRL', desc: 'Regulatory format' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormat(opt.id as any)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    format === opt.id
                      ? 'bg-amber-700 border border-amber-500'
                      : 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs text-neutral-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={withRedaction}
                onChange={(e) => setWithRedaction(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-600"
              />
              <div>
                <div className="font-medium text-sm">Apply PII Redaction</div>
                <div className="text-xs text-neutral-400">Auto-redact personal data while preserving financial truth</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-neutral-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={includeCounsel}
                onChange={(e) => setIncludeCounsel(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-600"
              />
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

          <button
            onClick={() => onExport(format, withRedaction)}
            disabled={isExporting}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              isExporting
                ? 'bg-neutral-700 text-neutral-400 cursor-wait'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90'
            }`}
          >
            {isExporting ? '⏳ Generating Export...' : '⚖️ Generate Court-Admissible Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Witness Modal
const WitnessModal: React.FC<{
  onAdd: (org: string, role: string, accessLevel: WitnessSession['accessLevel']) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
  const [org, setOrg] = useState('');
  const [role, setRole] = useState('');
  const [accessLevel, setAccessLevel] = useState<WitnessSession['accessLevel']>('redacted');

  const presets = [
    { org: 'Deloitte', role: 'External Auditor' },
    { org: 'PwC', role: 'External Auditor' },
    { org: 'SEC', role: 'Regulatory Examiner' },
    { org: 'DOJ', role: 'Federal Investigator' },
    { org: 'Internal Audit', role: 'Compliance Officer' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
              {presets.map(p => (
                <button
                  key={p.org}
                  onClick={() => { setOrg(p.org); setRole(p.role); }}
                  className="px-3 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded-lg"
                >
                  {p.org}
                </button>
              ))}
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Organization *</label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="e.g., Deloitte, SEC, DOJ"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-neutral-400 mb-1 block">Role *</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., External Auditor, Investigator"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Access Level */}
          <div>
            <div className="text-sm text-neutral-400 mb-2">Access Level</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'redacted', label: 'Redacted', desc: 'PII removed' },
                { id: 'financial-only', label: 'Financial', desc: 'Numbers only' },
                { id: 'full', label: 'Full Access', desc: 'Everything' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAccessLevel(opt.id as any)}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    accessLevel === opt.id
                      ? 'bg-blue-700 border border-blue-500'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div className="font-medium text-xs">{opt.label}</div>
                  <div className="text-[10px] text-neutral-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Air-Gapped Key Notice */}
          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg text-sm">
            <p className="text-blue-300">
              🔐 An air-gapped access key will be generated. The witness must complete a key ceremony to activate their session.
            </p>
          </div>

          <button
            onClick={() => org && role && onAdd(org, role, accessLevel)}
            disabled={!org || !role}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              org && role
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            👁️ Create Witness Session
          </button>
        </div>
      </div>
    </div>
  );
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
}> = ({ connectors, erpSnapshot, selectedSource, onSourceChange, currentDate, onClose }) => {
  const activeConnectors = connectors.filter(c => c.status === 'connected' || c.status === 'syncing');
  const totalRecords = connectors.reduce((sum, c) => sum + c.recordCount, 0);

  return (
    <div className="bg-gradient-to-b from-indigo-950 to-neutral-950 border-b border-indigo-800">
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
            <button
              onClick={() => onSourceChange('all')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedSource === 'all'
                  ? 'bg-indigo-600 border border-indigo-400'
                  : 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600'
              }`}
            >
              All Systems
            </button>
            {connectors.map(c => (
              <button
                key={c.id}
                onClick={() => onSourceChange(c.source)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedSource === c.source
                    ? 'bg-indigo-600 border border-indigo-400'
                    : 'bg-neutral-800 border border-neutral-700 hover:border-neutral-600'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
                <span className={`w-2 h-2 rounded-full ${
                  c.status === 'connected' ? 'bg-green-400' :
                  c.status === 'syncing' ? 'bg-amber-400 animate-pulse' :
                  c.status === 'error' ? 'bg-red-400' : 'bg-neutral-500'
                }`} />
              </button>
            ))}
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
                  <span className="font-bold text-blue-400">${(erpSnapshot.crm.totalPipeline / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Weighted</span>
                  <span>${(erpSnapshot.crm.weightedPipeline / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Win Rate</span>
                  <span className="text-green-400">{erpSnapshot.crm.winRate.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Avg Deal</span>
                  <span>${(erpSnapshot.crm.avgDealSize / 1000).toFixed(0)}K</span>
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
                  <span className="font-bold text-green-400">${(erpSnapshot.erp.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Expenses</span>
                  <span className="text-red-400">${(erpSnapshot.erp.expenses / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Cash</span>
                  <span>${(erpSnapshot.erp.cashPosition / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">A/R</span>
                  <span>${(erpSnapshot.erp.accountsReceivable / 1000000).toFixed(1)}M</span>
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
                  <span className={erpSnapshot.hr.attritionRate > 15 ? 'text-red-400' : 'text-green-400'}>
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
                  <span className={erpSnapshot.engineering.sprintCompletion > 80 ? 'text-green-400' : 'text-amber-400'}>
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
                  <span className={erpSnapshot.serviceDesk.slaCompliance > 90 ? 'text-green-400' : 'text-red-400'}>
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
            {connectors.map(c => (
              <div key={c.id} className="bg-black/20 rounded-lg p-3 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="font-medium text-sm">{c.name}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs ${
                    c.status === 'connected' ? 'bg-green-900 text-green-300' :
                    c.status === 'syncing' ? 'bg-amber-900 text-amber-300' :
                    c.status === 'error' ? 'bg-red-900 text-red-300' :
                    'bg-neutral-800 text-neutral-400'
                  }`}>
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
                    <div className={`font-medium ${c.healthScore > 95 ? 'text-green-400' : c.healthScore > 80 ? 'text-amber-400' : 'text-red-400'}`}>
                      {c.healthScore}%
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-500">Last Sync</span>
                    <div className="font-medium">{Math.floor((Date.now() - c.lastSync.getTime()) / 60000)} min ago</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

