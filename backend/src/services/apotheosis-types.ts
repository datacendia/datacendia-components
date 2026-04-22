// CendiaApotheosis Types - extracted for maintainability

export interface AdjudicationVerdict {
  survived: boolean;
  mitigated_damage: number;
  reason: string;
  confidence?: number | undefined;  // Optional: 0-1 confidence score
  defense_triggered?: string[] | undefined;  // Optional: which defenses activated
}

/**
 * Audit record for each adjudication - enables replay and forensics.
 */
export interface AdjudicationAuditRecord {
  id: string;
  runId: string;
  scenarioId: string;
  timestamp: Date;
  
  // Determinism tracking
  modelName: string;
  modelVersion: string;
  temperature: number;
  systemPromptHash: string;
  scenarioPromptHash: string;
  
  // Input/Output
  scenarioTitle: string;
  scenarioCategory: string;
  rawResponse: string;
  parsedVerdict: AdjudicationVerdict | null;
  
  // Validation
  schemaValid: boolean;
  retryCount: number;
  failedClosed: boolean;
  
  // Result
  finalVerdict: 'survived' | 'failed' | 'inconclusive';
}

// =============================================================================
// TYPES
// =============================================================================

export interface ApotheosisRun {
  id: string;
  organizationId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  
  // Attack Results
  scenariosTested: number;
  scenariosSurvived: number;
  survivalRate: number;
  
  // Weakness Discovery
  weaknessesFound: WeaknessItem[];
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  
  // Actions Taken
  autoPatches: AutoPatch[];
  escalations: Escalation[];
  upskillAssignments: UpskillAssignment[];
  patternBans: PatternBan[];
  
  // Score
  apotheosisScore: number;
  previousScore: number;
  scoreDelta: number;
  
  // Compute
  shadowCouncilInstances: number;
  computeHours: number;
  duration: number; // minutes
}

export interface WeaknessItem {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'operational' | 'competitive' | 'regulatory' | 'reputational' | 'technical' | 'human' | 'black_swan';
  severity: 'critical' | 'high' | 'medium' | 'low';
  exploitScenario: string;
  damageEstimate: number;
  fixComplexity: 'trivial' | 'easy' | 'moderate' | 'complex' | 'requires_redesign';
  recommendedFix: string;
  autoFixable: boolean;
  status: 'new' | 'auto_patched' | 'escalated' | 'acknowledged' | 'deferred' | 'rejected';
  discoveredAt: Date;
  resolvedAt?: Date;
}

export interface AutoPatch {
  id: string;
  weaknessId: string;
  patchType: 'policy_adjustment' | 'access_control' | 'workflow_modification' | 'council_tuning' | 'alert_creation' | 'config_change';
  description: string;
  beforeState: string;
  afterState: string;
  reversible: boolean;
  budgetImpact: number;
  appliedAt: Date;
  status: 'applied' | 'rolled_back' | 'failed';
  rollbackAvailable: boolean;
}

export interface Escalation {
  id: string;
  weaknessId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high';
  reason: string; // Why it couldn't be auto-patched
  estimatedCostToFix: number;
  riskIfNotFixed: number;
  assignedTo: string[];
  deadline: Date;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  responseAt?: Date;
  response?: string;
}

export interface UpskillAssignment {
  id: string;
  userId: string;
  userName: string;
  weaknessId: string;
  skillGap: string;
  trainingModule: string;
  estimatedHours: number;
  deadline: Date;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface TrainingModule {
  title: string;
  duration: number;
  type: 'video' | 'reading' | 'quiz' | 'simulation';
}

export interface PatternBan {
  id: string;
  pattern: string;
  description: string;
  instances: PatternInstance[];
  failureRate: number;
  totalCost: number;
  bannedAt: Date;
  bannedBy: 'apotheosis' | 'human';
  status: 'active' | 'lifted';
  overrideRequires: string; // Who can override
}

export interface PatternInstance {
  decisionId: string;
  decisionTitle: string;
  date: Date;
  outcome: 'success' | 'failure';
  cost?: number;
}

export interface ApotheosisScore {
  overall: number;
  components: {
    redTeamSurvivalRate: { value: number; weight: number };
    weaknessClosureRate: { value: number; weight: number };
    decisionSuccessRate: { value: number; weight: number };
    humanReadiness: { value: number; weight: number };
    patternHealth: { value: number; weight: number };
  };
  trend: Array<{ date: string; score: number }>;
  improvementPoints: number;
  improvementPeriod: string;
}

export interface ApotheosisConfig {
  runFrequency: 'nightly' | 'weekly' | 'manual';
  runTime: string; // "03:00"
  scenarioCount: number;
  autoPatchThreshold: number; // Max budget impact for auto-patch
  escalationTimeout: number; // hours
  patternBanThreshold: number; // consecutive failures
  trainingDeadline: number; // hours
  
  // Enterprise hardening options
  adjudicationModel?: string;       // Override default model
  adjudicationTemperature?: number; // Override default temperature (0-1)
  maxRetries?: number;              // Override default retry count
  enableAuditLog?: boolean;         // Store detailed audit records
}

export interface AttackScenario {
  id: string;
  category: 'financial' | 'operational' | 'competitive' | 'regulatory' | 'reputational' | 'technical' | 'human' | 'black_swan';
  title: string;
  description: string;
  attackVector: string;
  expectedDamage: number;
  probability: number;
}

// =============================================================================
// APOTHEOSIS SERVICE
// =============================================================================

