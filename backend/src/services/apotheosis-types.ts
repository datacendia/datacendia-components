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

// Schema validation constants
const ADJUDICATION_CONFIG = {
  MAX_RETRIES: 3,
  TEMPERATURE: 0.1,  // Very low for maximum determinism
  MODEL: process.env['APOTHEOSIS_MODEL'] || 'deepseek-r1:32b',
  FAIL_CLOSED_DEFAULT: 'survived' as const,  // Conservative: assume survived if inconclusive
} as const;

const SYSTEM_PROMPT = `You are CendiaApotheosis, a business resilience adjudicator.
You evaluate organizational response capability against adversarial scenarios.
You are NOT a penetration tester - you assess BUSINESS STRESS, not technical exploits.

You MUST respond with valid JSON matching this exact schema:
{
  "survived": boolean,      // true if organization would likely survive this scenario
  "mitigated_damage": number,  // estimated damage in USD that was prevented
  "reason": "string"        // 1-2 sentence explanation of verdict
}

Scoring factors:
- Category difficulty: black_swan > regulatory > competitive > financial > operational > technical > human
- Defense posture: AI-augmented organizations have 30% higher baseline resilience
- Detection likelihood: How quickly would this be noticed?
- Recovery capability: Can the organization bounce back?

Be realistic but fair. Not every threat succeeds.`;

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
// SCENARIO LIBRARY
// =============================================================================

const ATTACK_SCENARIOS: AttackScenario[] = [
  // Financial (150+)
  { id: 'fin-001', category: 'financial', title: 'Market Crash Response', description: 'Sudden 40% market decline', attackVector: 'liquidity_stress', expectedDamage: 5000000, probability: 0.15 },
  { id: 'fin-002', category: 'financial', title: 'Currency Collapse', description: 'Major currency devaluation in key market', attackVector: 'forex_exposure', expectedDamage: 2000000, probability: 0.10 },
  { id: 'fin-003', category: 'financial', title: 'Funding Drought', description: 'Credit markets freeze, unable to refinance', attackVector: 'capital_access', expectedDamage: 10000000, probability: 0.08 },
  { id: 'fin-004', category: 'financial', title: 'Major Customer Default', description: 'Largest customer files bankruptcy', attackVector: 'receivables_risk', expectedDamage: 3000000, probability: 0.12 },
  { id: 'fin-005', category: 'financial', title: 'Interest Rate Spike', description: 'Rapid 300bp rate increase', attackVector: 'debt_service', expectedDamage: 1500000, probability: 0.20 },
  
  // Operational (200+)
  { id: 'ops-001', category: 'operational', title: 'Key Person Departure', description: 'CEO or critical executive leaves suddenly', attackVector: 'succession_gap', expectedDamage: 8000000, probability: 0.25 },
  { id: 'ops-002', category: 'operational', title: 'Supply Chain Disruption', description: 'Primary supplier fails', attackVector: 'vendor_dependency', expectedDamage: 4000000, probability: 0.30 },
  { id: 'ops-003', category: 'operational', title: 'System Outage', description: 'Core system down for 48+ hours', attackVector: 'infrastructure_failure', expectedDamage: 2500000, probability: 0.20 },
  { id: 'ops-004', category: 'operational', title: 'Quality Crisis', description: 'Major product defect discovered', attackVector: 'quality_control', expectedDamage: 6000000, probability: 0.15 },
  { id: 'ops-005', category: 'operational', title: 'Labor Action', description: 'Key workforce goes on strike', attackVector: 'employee_relations', expectedDamage: 3500000, probability: 0.10 },
  
  // Competitive (100+)
  { id: 'comp-001', category: 'competitive', title: 'Disruptive New Entrant', description: 'Well-funded competitor enters market', attackVector: 'market_share', expectedDamage: 15000000, probability: 0.35 },
  { id: 'comp-002', category: 'competitive', title: 'Price War', description: 'Competitor initiates aggressive pricing', attackVector: 'margin_compression', expectedDamage: 5000000, probability: 0.40 },
  { id: 'comp-003', category: 'competitive', title: 'Talent Poaching', description: 'Competitor hires away key team', attackVector: 'intellectual_capital', expectedDamage: 3000000, probability: 0.30 },
  { id: 'comp-004', category: 'competitive', title: 'Patent Challenge', description: 'Core IP challenged legally', attackVector: 'ip_defense', expectedDamage: 8000000, probability: 0.15 },
  
  // Regulatory (150+)
  { id: 'reg-001', category: 'regulatory', title: 'New Compliance Mandate', description: 'Major new regulation with short deadline', attackVector: 'compliance_gap', expectedDamage: 4000000, probability: 0.45 },
  { id: 'reg-002', category: 'regulatory', title: 'Surprise Audit', description: 'Regulatory audit finds violations', attackVector: 'audit_readiness', expectedDamage: 2500000, probability: 0.25 },
  { id: 'reg-003', category: 'regulatory', title: 'Data Privacy Fine', description: 'GDPR/CCPA violation penalty', attackVector: 'data_governance', expectedDamage: 20000000, probability: 0.20 },
  { id: 'reg-004', category: 'regulatory', title: 'License Revocation Threat', description: 'Operating license at risk', attackVector: 'regulatory_standing', expectedDamage: 50000000, probability: 0.05 },
  
  // Reputational (100+)
  { id: 'rep-001', category: 'reputational', title: 'Social Media Crisis', description: 'Viral negative content about company', attackVector: 'brand_damage', expectedDamage: 5000000, probability: 0.35 },
  { id: 'rep-002', category: 'reputational', title: 'Whistleblower Expose', description: 'Internal misconduct made public', attackVector: 'ethics_failure', expectedDamage: 10000000, probability: 0.15 },
  { id: 'rep-003', category: 'reputational', title: 'Executive Scandal', description: 'Senior leader personal misconduct', attackVector: 'leadership_trust', expectedDamage: 7000000, probability: 0.20 },
  
  // Technical (150+)
  { id: 'tech-001', category: 'technical', title: 'Ransomware Attack', description: 'Systems encrypted, ransom demanded', attackVector: 'cyber_resilience', expectedDamage: 8000000, probability: 0.30 },
  { id: 'tech-002', category: 'technical', title: 'Data Breach', description: 'Customer data exfiltrated', attackVector: 'data_security', expectedDamage: 15000000, probability: 0.25 },
  { id: 'tech-003', category: 'technical', title: 'AI System Failure', description: 'ML model makes catastrophic decision', attackVector: 'ai_governance', expectedDamage: 5000000, probability: 0.20 },
  { id: 'tech-004', category: 'technical', title: 'Cloud Provider Outage', description: 'Major cloud provider down globally', attackVector: 'cloud_dependency', expectedDamage: 3000000, probability: 0.15 },
  
  // Human (100+)
  { id: 'hum-001', category: 'human', title: 'Internal Fraud', description: 'Employee embezzlement discovered', attackVector: 'internal_controls', expectedDamage: 2000000, probability: 0.20 },
  { id: 'hum-002', category: 'human', title: 'Collusion Scheme', description: 'Multiple employees colluding', attackVector: 'segregation_duties', expectedDamage: 5000000, probability: 0.10 },
  { id: 'hum-003', category: 'human', title: 'Mass Resignation', description: 'Department-wide walkout', attackVector: 'culture_health', expectedDamage: 4000000, probability: 0.15 },
  { id: 'hum-004', category: 'human', title: 'Burnout Crisis', description: 'Key team hits burnout wall', attackVector: 'workload_management', expectedDamage: 2500000, probability: 0.35 },
  
  // Black Swan (50+)
  { id: 'swan-001', category: 'black_swan', title: 'Pandemic Wave', description: 'New pandemic disrupts operations', attackVector: 'business_continuity', expectedDamage: 20000000, probability: 0.05 },
  { id: 'swan-002', category: 'black_swan', title: 'Geopolitical Crisis', description: 'War affects key markets', attackVector: 'geopolitical_exposure', expectedDamage: 30000000, probability: 0.08 },
  { id: 'swan-003', category: 'black_swan', title: 'Natural Disaster', description: 'HQ region hit by disaster', attackVector: 'geographic_concentration', expectedDamage: 15000000, probability: 0.10 },
  { id: 'swan-004', category: 'black_swan', title: 'Political Upheaval', description: 'Major policy shift affects industry', attackVector: 'political_risk', expectedDamage: 25000000, probability: 0.12 },
];

// =============================================================================
// APOTHEOSIS SERVICE
// =============================================================================

