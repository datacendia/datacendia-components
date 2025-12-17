/**
 * CendiaApotheosis™ - Type Definitions
 * 
 * Types for the self-improvement loop system
 */
// @ts-nocheck


// =============================================================================
// RUN TYPES
// =============================================================================

export type ApotheosisRunStatus = 'running' | 'completed' | 'failed' | 'scheduled';

export interface ApotheosisRun {
  id: string;
  organizationId: string;
  startedAt: Date;
  completedAt?: Date;
  status: ApotheosisRunStatus;
  
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

// =============================================================================
// WEAKNESS TYPES
// =============================================================================

export type WeaknessCategory = 
  | 'financial'
  | 'operational'
  | 'competitive'
  | 'regulatory'
  | 'reputational'
  | 'technical'
  | 'human'
  | 'black_swan';

export type WeaknessSeverity = 'critical' | 'high' | 'medium' | 'low';

export type WeaknessStatus = 
  | 'new'
  | 'auto_patched'
  | 'escalated'
  | 'acknowledged'
  | 'deferred'
  | 'rejected';

export type FixComplexity = 
  | 'trivial'
  | 'easy'
  | 'moderate'
  | 'complex'
  | 'requires_redesign';

export interface WeaknessItem {
  id: string;
  title: string;
  description: string;
  category: WeaknessCategory;
  severity: WeaknessSeverity;
  exploitScenario: string;
  damageEstimate: number;
  fixComplexity: FixComplexity;
  recommendedFix: string;
  autoFixable: boolean;
  status: WeaknessStatus;
  discoveredAt: Date;
  resolvedAt?: Date;
}

// =============================================================================
// PATCH TYPES
// =============================================================================

export type PatchType = 
  | 'policy_adjustment'
  | 'access_control'
  | 'workflow_modification'
  | 'council_tuning'
  | 'alert_creation'
  | 'config_change';

export type PatchStatus = 'applied' | 'rolled_back' | 'failed';

export interface AutoPatch {
  id: string;
  weaknessId: string;
  patchType: PatchType;
  description: string;
  beforeState: string;
  afterState: string;
  reversible: boolean;
  budgetImpact: number;
  appliedAt: Date;
  status: PatchStatus;
  rollbackAvailable: boolean;
}

// =============================================================================
// ESCALATION TYPES
// =============================================================================

export type EscalationStatus = 'pending' | 'approved' | 'rejected' | 'deferred';

export interface Escalation {
  id: string;
  weaknessId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high';
  reason: string;
  estimatedCostToFix: number;
  riskIfNotFixed: number;
  assignedTo: string[];
  deadline: Date;
  status: EscalationStatus;
  responseAt?: Date;
  response?: string;
}

// =============================================================================
// UPSKILL TYPES
// =============================================================================

export type UpskillStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'skipped';

export interface UpskillAssignment {
  id: string;
  userId: string;
  userName?: string;
  department?: string;
  weaknessId: string;
  title: string;
  description: string;
  learningPath: LearningModule[];
  estimatedHours: number;
  deadline: Date;
  status: UpskillStatus;
  completedAt?: Date;
  scoreImprovement?: number;
}

export interface LearningModule {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'exercise' | 'assessment' | 'simulation';
  duration: number;
  url?: string;
  content?: string;
  completed: boolean;
}

// =============================================================================
// PATTERN BAN TYPES
// =============================================================================

export type PatternBanStatus = 'active' | 'appealed' | 'revoked' | 'expired';

export interface PatternBan {
  id: string;
  pattern: string;
  patternType: 'decision_pattern' | 'workflow_pattern' | 'data_access_pattern' | 'approval_pattern';
  reason: string;
  weaknessIds: string[];
  createdAt: Date;
  expiresAt?: Date;
  status: PatternBanStatus;
  appealable: boolean;
  appealDeadline?: Date;
}

// =============================================================================
// ATTACK SCENARIO TYPES
// =============================================================================

export type AttackCategory = 
  | 'financial_stress'
  | 'competitive_threat'
  | 'regulatory_change'
  | 'talent_exodus'
  | 'supply_chain'
  | 'cyber_attack'
  | 'reputation_crisis'
  | 'market_disruption'
  | 'black_swan';

export interface AttackScenario {
  id: string;
  category: AttackCategory;
  name: string;
  description: string;
  probability: number;
  severity: WeaknessSeverity;
  vectors: AttackVector[];
  mitigations: string[];
}

export interface AttackVector {
  name: string;
  description: string;
  exploitSteps: string[];
  targetAssets: string[];
  requiredAccess: string;
}

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface ApotheosisConfig {
  enabled: boolean;
  schedule: string; // cron expression
  maxRunDuration: number; // minutes
  shadowCouncilInstances: number;
  attackCategories: AttackCategory[];
  autoFixEnabled: boolean;
  autoFixBudgetLimit: number;
  escalationThreshold: WeaknessSeverity;
  upskillEnabled: boolean;
  patternBanEnabled: boolean;
}

export const DEFAULT_APOTHEOSIS_CONFIG: ApotheosisConfig = {
  enabled: true,
  schedule: '0 2 * * *', // 2 AM daily
  maxRunDuration: 120,
  shadowCouncilInstances: 3,
  attackCategories: [
    'financial_stress',
    'competitive_threat',
    'regulatory_change',
    'talent_exodus',
    'cyber_attack',
  ],
  autoFixEnabled: true,
  autoFixBudgetLimit: 10000,
  escalationThreshold: 'high',
  upskillEnabled: true,
  patternBanEnabled: true,
};
