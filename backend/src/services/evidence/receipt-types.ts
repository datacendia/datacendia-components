export interface RegulatorsReceipt {
  receiptId: string;
  version: string;
  generatedAt: Date;
  generatedBy: string;
  
  // Decision Information
  decision: {
    id: string;
    question: string;
    finalDecision: string;
    councilMode: string;
    vertical?: string;
    createdAt: Date;
    completedAt: Date;
    consensusScore: number;
  };
  
  // Participants
  participants: {
    agents: ReceiptAgent[];
    humanApprovers?: ReceiptHumanApprover[];
  };
  
  // Evidence Chain
  evidenceChain: {
    deliberationHash: string;
    merkleRoot: string;
    citationsHash: string;
    agentResponsesHash: string;
    dissentsHash: string;
  };
  
  // Compliance Mapping
  compliance: {
    frameworks: string[];
    requirements: ComplianceRequirement[];
    gatesCleared: string[];
    gatesFailed: string[];
  };
  
  // Citations & Sources
  citations: ReceiptCitation[];
  
  // Dissents & Minority Views
  dissents: ReceiptDissent[];
  
  // Audit Trail
  auditTrail: AuditEntry[];
  
  // Cryptographic Proof
  cryptographicProof: {
    algorithm: string;
    receiptHash: string;
    signature?: string;
    signedBy?: string;
    signedAt?: Date;
    publicKeyFingerprint?: string;
  };
  
  // Media Authentication (P8)
  mediaAuthentication?: {
    assetsVerified: number;
    chainOfCustodyIntact: boolean;
    c2paProvenanceSigned: boolean;
    deepfakeAnalysisRun: boolean;
    verdicts: { assetName: string; verdict: string; confidence: number }[];
  };

  // Workflow Configuration
  workflowConfig?: {
    workflowType: string;
    verticalId: string;
    complianceProfile: string;
  };

  // IISS Scores
  iissScores?: {
    overallScore: number;
    band: string;
    certificationLevel: string;
    dimensions: { name: string; primitive: string; score: number; maxScore: number; normalizedScore: number }[];
    calculatedAt: Date;
  };

  // Override Accountability (Primitive C)
  overrideEvents?: ReceiptOverrideEvent[];

  // Drift Analysis (Primitive E) — longitudinal tracking
  driftAnalysis?: ReceiptDriftAnalysis;

  // Retention & Legal
  retention: {
    retentionPeriod: string;
    retentionUntil: Date;
    legalHold: boolean;
    jurisdiction: string;
  };
}

export interface ReceiptAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  responseCount: number;
  citationCount: number;
  dissented: boolean;
  confidenceAvg: number;
}

export interface ReceiptHumanApprover {
  userId: string;
  name: string;
  role: string;
  approvedAt: Date;
  signature?: string;
}

export interface ComplianceRequirement {
  framework: string;
  requirement: string;
  status: 'met' | 'not_met' | 'not_applicable';
  evidence?: string;
}

export interface ReceiptCitation {
  id: string;
  type: string;
  reference: string;
  source: string;
  addedBy: string;
  addedAt: Date;
  verified: boolean;
}

export interface ReceiptDissent {
  agentId: string;
  agentName: string;
  reason: string;
  severity: string;
  timestamp: Date;
  protected: boolean;
}

export interface AuditEntry {
  timestamp: Date;
  action: string;
  actor: string;
  details: string;
  hash: string;
}

export interface ReceiptOverrideEvent {
  id: string;
  authorityName: string;
  authorityRole: string;
  authorityDepartment?: string;
  actionTaken: string;
  aiRecommendation?: string;
  aiConfidenceScore?: number;
  justification: string;
  acceptedRisks: string[];
  dissentsOverridden: string[];
  signatureHash: string;
  timestamp: Date;
  detectionMethod: 'explicit' | 'inferred';  // explicit = recorded via CendiaResponsibility, inferred = detected by divergence
}

export interface ReceiptDriftAnalysis {
  currentScores: { primitive: string; score: number; maxScore: number }[];
  baselineScores?: { primitive: string; score: number; maxScore: number; recordedAt: Date }[];
  trends: { primitive: string; direction: 'improving' | 'stable' | 'degrading'; delta: number }[];
  overrideRateHistory: { period: string; overrideCount: number; totalDecisions: number; rate: number }[];
  gatePassRateHistory: { period: string; passed: number; failed: number; rate: number }[];
  snapshotCount: number;
  analysisWindow: string;
}

export interface ReceiptGenerationOptions {
  includeFullResponses: boolean;
  includeRawData: boolean;
  signWithKms: boolean;
  format: 'pdf' | 'json' | 'html';
  jurisdiction: string;
  retentionYears: number;
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

