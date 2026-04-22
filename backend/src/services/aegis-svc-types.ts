export type SignalType = 'CYBER' | 'GEOPOLITICAL' | 'INFRASTRUCTURE' | 'SUPPLY_CHAIN' | 'FINANCIAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'REGULATORY';
export type ThreatType = 'CYBER_ATTACK' | 'DATA_BREACH' | 'INSIDER_THREAT' | 'SUPPLY_CHAIN_ATTACK' | 'PHYSICAL_SECURITY' | 'GEOPOLITICAL_RISK' | 'NATURAL_DISASTER' | 'MARKET_DISRUPTION' | 'REGULATORY_ACTION' | 'REPUTATIONAL_CRISIS';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
export type ThreatStatus = 'ACTIVE' | 'MONITORING' | 'CONTAINED' | 'MITIGATED' | 'RESOLVED';

export interface ThreatSignal {
  id: string;
  signalType: SignalType;
  source: string;
  title: string;
  content: string;
  severity: Severity;
  confidence: number;
  entities: string[];
  tags: string[];
}

export interface ThreatAssessment {
  id: string;
  threatType: ThreatType;
  title: string;
  description: string;
  severity: Severity;
  probability: number;
  impactScore: number;
  affectedAssets: string[];
  status: ThreatStatus;
}

export interface CascadeScenario {
  id: string;
  scenarioName: string;
  description: string;
  triggerConditions: string[];
  cascadeEffects: CascadeEffect[];
  financialImpact: number;
  operationalImpact: number;
  reputationalImpact: number;
  recoveryTimeHours: number;
  probability: number;
}

export interface CascadeEffect {
  system: string;
  effect: string;
  timeToImpact: number;
  severity: Severity;
}

export interface Countermeasure {
  id: string;
  title: string;
  description: string;
  type: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE' | 'DETERRENT' | 'RECOVERY';
  effectiveness: number;
  costEstimate: number;
  timeToImplement: number;
  status: string;
}

export interface ThreatBriefing {
  id: string;
  title: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  executiveSummary: string;
  detailedAnalysis: string;
  recommendations: string[];
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

