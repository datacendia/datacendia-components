// @ts-nocheck
// =============================================================================
// CENDIA SOVEREIGN SERVICES - UNIFIED EXPORT
// Enterprise Platinum Sovereign Architecture Components
// =============================================================================

// Data Diode - Unidirectional data ingest
export { dataDiodeService, DataDiodeService } from './DataDiodeService.js';
export type { 
  IngestSource, 
  IngestEvent, 
  DataFormat, 
  IngestStatus,
  DiodeStatistics 
} from './DataDiodeService.js';

// Local RLHF - Zero-cloud reinforcement learning
export { localRLHFService, LocalRLHFService } from './LocalRLHFService.js';
export type { 
  FeedbackRecord, 
  TrainingDataset, 
  LoraConfig, 
  TrainingPair,
  FeedbackType,
  FeedbackSignal
} from './LocalRLHFService.js';

// Decision DNA - Audit artifact export
export { decisionDNAService, DecisionDNAService } from './DecisionDNAService.js';
export type { 
  DecisionDNA, 
  DNAExportOptions
} from './DecisionDNAService.js';

// Shadow Council - Sandbox deliberation
export { shadowCouncilService, ShadowCouncilService } from './ShadowCouncilService.js';
export type { 
  ShadowSession, 
  ShadowDeliberation, 
  ShadowConfig,
  ComparisonResults
} from './ShadowCouncilService.js';

// Deterministic Replay - Bit-perfect reproducibility
export { deterministicReplayService, DeterministicReplayService, DeterministicRNG } from './DeterministicReplayService.js';
export type { 
  ReplayableState, 
  ReplayResult, 
  ReplayDifference,
  RandomState,
  ModelState
} from './DeterministicReplayService.js';

// QR Air-Gap Bridge - Zero-media transfer
export { qrAirGapBridgeService, QRAirGapBridgeService } from './QRAirGapBridgeService.js';
export type { 
  QRPayload, 
  QRSequence, 
  QRChunk,
  CaptureSession,
  BridgeConfig
} from './QRAirGapBridgeService.js';

// Canary Tripwires - Exfiltration detection
export { canaryTripwireService, CanaryTripwireService } from './CanaryTripwireService.js';
export type { 
  Canary, 
  CanaryAlert, 
  CanaryType,
  CanaryDeployment
} from './CanaryTripwireService.js';

// TPM Attestation - Hardware-signed decisions
export { tpmAttestationService, TPMAttestationService } from './TPMAttestationService.js';
export type { 
  SignedDecision, 
  AttestationKey, 
  Attestation,
  VerificationResult,
  DecisionPayload as TPMDecisionPayload
} from './TPMAttestationService.js';

// Time-Lock - Cryptographic embargo
export { timeLockService, TimeLockService, TimeLockPuzzleGenerator } from './TimeLockService.js';
export type { 
  TimeLockVault, 
  TimeLockPuzzle, 
  UnlockProgress,
  Witness
} from './TimeLockService.js';

// Federated Mesh - Multi-site learning
export { federatedMeshService, FederatedMeshService } from './FederatedMeshService.js';
export type { 
  MeshNode, 
  ModelDelta, 
  SyncManifest,
  MergeResult,
  NodeCapabilities
} from './FederatedMeshService.js';

// Portable Instance - USB deployment
export { portableInstanceService, PortableInstanceService } from './PortableInstanceService.js';
export type { 
  PortableInstanceConfig, 
  PortableImage, 
  BuildProgress,
  InstanceComponents,
  InstanceSecurity
} from './PortableInstanceService.js';

// =============================================================================
// SOVEREIGN ARCHITECTURE SUMMARY
// =============================================================================

export const SOVEREIGN_SERVICES = {
  dataDiode: 'Unidirectional data ingest - "We never make outbound calls"',
  localRLHF: 'Zero-cloud learning - "Your AI learns your judgment locally"',
  decisionDNA: 'Audit export - "One-click audit artifact for regulators"',
  shadowCouncil: 'Sandbox mode - "Test radical ideas without record"',
  deterministicReplay: 'Reproducibility - "Re-run any decision, get identical output"',
  qrAirGapBridge: 'Zero-media sync - "Transfer across air gaps without physical media"',
  canaryTripwires: 'Leak detection - "We\'ll know if data ever leaks"',
  tpmAttestation: 'Hardware signing - "Cryptographic proof on specific machine"',
  timeLock: 'Embargo - "Impossible to leak early—cryptographically"',
  federatedMesh: 'Multi-site - "Learn across sites without connectivity"',
  portableInstance: 'USB deploy - "Boot Datacendia from a thumb drive"',
} as const;

export const SOVEREIGN_VERSION = '1.0.0';
