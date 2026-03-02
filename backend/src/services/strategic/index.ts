/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports strategicServices, investorPitchMapping
 * @module services/strategic/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// STRATEGIC SERVICES - INVESTOR-ALIGNED CAPABILITIES
// The 5 Pillars of Enterprise Value
// =============================================================================

// 1. AGENTIC AI - Beyond Text to Execution
export { synthesisEngineService } from './SynthesisEngineService.js';
export type { 
  SynthesisRequest, 
  SynthesisResult, 
  AgentContribution, 
  OrchestratedExecution 
} from './SynthesisEngineService.js';

// 2. SYSTEMS OF RECORD - Anticipating Outcomes
// CendiaRainmaker (existing) + CendiaDocket (existing) work together
// SynthesisEngine orchestrates the "System of Action" pattern

// 3. AGENT-SPEED INFRASTRUCTURE - Recursive Bursts
export { logicGateService } from './LogicGateService.js';
export type { 
  ParallelTask, 
  TaskResult, 
  ParallelExecution, 
  BurstConfig,
  GateMetrics 
} from './LogicGateService.js';

export { rdpService } from './RDPService.js';
export type { 
  DeploymentPackage, 
  DeploymentComponent, 
  DeploymentConfig,
  DeploymentInstance,
  ContainerSpec 
} from './RDPService.js';

// 4. STRUCTURE EXTRACTION - The Moat
export { cendiaGraphService } from './CendiaGraphService.js';
export type { 
  GraphEntity, 
  GraphRelationship, 
  GraphQuery, 
  GraphPath,
  RiskConnection,
  KnowledgeInsight,
  EntityType,
  RelationshipType 
} from './CendiaGraphService.js';

export { cendiaIngestService } from './CendiaIngestService.js';
export type { 
  IngestJob, 
  IngestSource, 
  DocumentInput,
  ProcessedDocument,
  DocumentChunk,
  ExtractedEntity,
  ExtractedRelationship,
  IngestMetrics 
} from './CendiaIngestService.js';

// 5. NEW CATEGORIES - Healthy MAUs (Workforce Augmentation)
export { warGamesService } from './WarGamesService.js';
export type { 
  Scenario, 
  ScenarioCategory,
  ScenarioEvent,
  Simulation,
  SimulationDecision,
  SimulationScore,
  OperatorCertification,
  CertificationLevel 
} from './WarGamesService.js';

// DEFENSE SYNTHESIS - Security Response
export { unionService } from './UnionService.js';
export type { 
  ThreatAssessment, 
  Threat, 
  ThreatType,
  DefenseStrategy,
  Defense,
  Mitigation,
  MonitoringPoint,
  ResponsePlaybook,
  SecurityPosture 
} from './UnionService.js';

// =============================================================================
// SERVICE REGISTRY
// =============================================================================

export const strategicServices: Record<string, () => Promise<unknown>> = {
  // Agentic AI
  synthesisEngine: () => import('./SynthesisEngineService.js').then(m => m.synthesisEngineService),
  
  // Agent-Speed Infrastructure
  logicGate: () => import('./LogicGateService.js').then(m => m.logicGateService),
  rdp: () => import('./RDPService.js').then(m => m.rdpService),
  
  // Structure Extraction
  cendiaGraph: () => import('./CendiaGraphService.js').then(m => m.cendiaGraphService),
  cendiaIngest: () => import('./CendiaIngestService.js').then(m => m.cendiaIngestService),
  
  // Workforce Augmentation
  warGames: () => import('./WarGamesService.js').then(m => m.warGamesService),
  
  // Defense Synthesis
  union: () => import('./UnionService.js').then(m => m.unionService),
};

// =============================================================================
// INVESTOR PITCH MAPPING
// =============================================================================

export const investorPitchMapping = {
  agenticAI: {
    hook: 'The Council - Multimodal agents that don\'t just chat, they debate and decide',
    product: 'SynthesisEngine - The Orchestration Layer',
    pivot: 'Autonomous Action - Show agents logging into a SQL database to execute a trade, not just talking about it',
    services: ['synthesisEngine', 'logicGate']
  },
  systemsOfRecord: {
    hook: 'CendiaRainmaker - The offensive engine that finds revenue opportunities before humans do',
    product: 'CendiaDocket - The Governance Interface',
    pivot: 'System of Action - Rainmaker finds the deal, CendiaDocket allows human approval, Council executes',
    services: ['synthesisEngine'] // Works with existing CendiaRainmaker and CendiaDocket
  },
  agentSpeedInfra: {
    hook: 'Logic Gate Architecture - Parallel processing where Red Team and Union run simultaneously',
    product: 'RDP - Rapid Deployment Protocol',
    pivot: 'Burst Compute - Docker containers spin up/down in milliseconds to handle a crisis',
    services: ['logicGate', 'rdp']
  },
  structureExtraction: {
    hook: 'CendiaGraph - Turning messy PDFs into a queryable Knowledge Graph',
    product: 'CendiaIngest - The Vectorization Pipeline',
    pivot: 'The Institutional Brain - Extract the physics of the bank into a graph',
    services: ['cendiaGraph', 'cendiaIngest']
  },
  workforceAugmentation: {
    hook: 'Operator Certification - Training humans to wield the system',
    product: 'WarGames - Crisis Simulation & Certification',
    pivot: 'We don\'t sell Education, we create Super-Soldiers',
    services: ['warGames']
  }
};
