// =============================================================================
// SOVEREIGN ARCHITECTURE API ROUTES
// Exposes all 11 enterprise platinum sovereign services
// =============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { devAuth } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

// Import sovereign services
import { dataDiodeService } from '../services/sovereign/DataDiodeService.js';
import { localRLHFService } from '../services/sovereign/LocalRLHFService.js';
import { decisionDNAService } from '../services/sovereign/DecisionDNAService.js';
import { shadowCouncilService } from '../services/sovereign/ShadowCouncilService.js';
import { deterministicReplayService } from '../services/sovereign/DeterministicReplayService.js';
import { qrAirGapBridgeService } from '../services/sovereign/QRAirGapBridgeService.js';
import { canaryTripwireService } from '../services/sovereign/CanaryTripwireService.js';
import { tpmAttestationService } from '../services/sovereign/TPMAttestationService.js';
import { timeLockService } from '../services/sovereign/TimeLockService.js';
import { federatedMeshService } from '../services/sovereign/FederatedMeshService.js';
import { portableInstanceService } from '../services/sovereign/PortableInstanceService.js';

const router = Router();
router.use(devAuth);

// =============================================================================
// SOVEREIGN SERVICES STATUS
// =============================================================================

router.get('/status', async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      version: '1.0.0',
      services: {
        dataDiode: { enabled: true, description: 'Unidirectional data ingest' },
        localRLHF: { enabled: true, description: 'Zero-cloud learning' },
        decisionDNA: { enabled: true, description: 'Audit artifact export' },
        shadowCouncil: { enabled: true, description: 'Sandbox deliberation' },
        deterministicReplay: { enabled: true, description: 'Bit-perfect reproducibility' },
        qrAirGapBridge: { enabled: true, description: 'Zero-media transfer' },
        canaryTripwires: { enabled: true, description: 'Exfiltration detection' },
        tpmAttestation: { enabled: true, description: 'Hardware-signed decisions' },
        timeLock: { enabled: true, description: 'Cryptographic embargo' },
        federatedMesh: { enabled: true, description: 'Multi-site learning' },
        portableInstance: { enabled: true, description: 'USB deployment' },
      },
    },
  });
});

// =============================================================================
// DATA DIODE - Unidirectional Ingest
// =============================================================================

router.post('/diode/sources', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const source = await dataDiodeService.registerSource(req.body);
    res.status(201).json({ success: true, data: source });
  } catch (error) {
    next(error);
  }
});

router.get('/diode/sources', async (req: Request, res: Response) => {
  res.json({ success: true, data: dataDiodeService.getSources() });
});

router.get('/diode/events', async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  res.json({ success: true, data: dataDiodeService.getRecentEvents(limit) });
});

router.get('/diode/statistics', async (req: Request, res: Response) => {
  res.json({ success: true, data: dataDiodeService.getStatistics() });
});

// =============================================================================
// LOCAL RLHF - Zero-Cloud Learning
// =============================================================================

router.post('/rlhf/feedback', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await localRLHFService.recordFeedback({
      ...req.body,
      organizationId: req.organizationId || 'demo',
      userId: req.user?.id || 'anonymous',
    });
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.get('/rlhf/stats', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: localRLHFService.getFeedbackStats(orgId) });
});

router.post('/rlhf/datasets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataset = await localRLHFService.generateDataset({
      organizationId: req.organizationId || 'demo',
      ...req.body,
    });
    res.status(201).json({ success: true, data: dataset });
  } catch (error) {
    next(error);
  }
});

router.get('/rlhf/datasets', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: localRLHFService.getDatasets(orgId) });
});

router.post('/rlhf/lora', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await localRLHFService.createLoraConfig({
      organizationId: req.organizationId || 'demo',
      ...req.body,
    });
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
});

router.get('/rlhf/lora/:id/script', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scriptPath = await localRLHFService.generateTrainingScript(req.params.id);
    res.json({ success: true, data: { scriptPath } });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// DECISION DNA - Audit Export
// =============================================================================

router.post('/dna/generate/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dna = await decisionDNAService.generateDNA(req.params.deliberationId, req.body);
    res.json({ success: true, data: dna });
  } catch (error) {
    next(error);
  }
});

router.post('/dna/export/:deliberationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dna = await decisionDNAService.generateDNA(req.params.deliberationId, req.body);
    const bundlePath = await decisionDNAService.exportAsBundle(dna);
    res.json({ success: true, data: { dna, bundlePath } });
  } catch (error) {
    next(error);
  }
});

router.post('/dna/verify', async (req: Request, res: Response) => {
  const result = decisionDNAService.verifyIntegrity(req.body);
  res.json({ success: true, data: result });
});

// =============================================================================
// SHADOW COUNCIL - Sandbox Deliberation
// =============================================================================

router.post('/shadow/sessions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await shadowCouncilService.createSession({
      organizationId: req.organizationId || 'demo',
      createdBy: req.user?.id || 'anonymous',
      ...req.body,
    });
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

router.get('/shadow/sessions', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: shadowCouncilService.listSessions(orgId, req.user?.id) });
});

router.get('/shadow/sessions/:id', async (req: Request, res: Response) => {
  const session = shadowCouncilService.getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  res.json({ success: true, data: session });
});

router.post('/shadow/sessions/:id/deliberate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliberation = await shadowCouncilService.startDeliberation({
      sessionId: req.params.id,
      ...req.body,
    });
    res.status(201).json({ success: true, data: deliberation });
  } catch (error) {
    next(error);
  }
});

router.post('/shadow/sessions/:id/close', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await shadowCouncilService.closeSession(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/shadow/compare', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shadowDeliberationId, officialDeliberationId } = req.body;
    const result = await shadowCouncilService.compareToOfficial(shadowDeliberationId, officialDeliberationId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// DETERMINISTIC REPLAY - Reproducibility
// =============================================================================

router.post('/replay/capture/start', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stateId = await deterministicReplayService.beginCapture({
      organizationId: req.organizationId || 'demo',
      ...req.body,
    });
    res.status(201).json({ success: true, data: { stateId } });
  } catch (error) {
    next(error);
  }
});

router.post('/replay/capture/:stateId/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const state = await deterministicReplayService.completeCapture(req.params.stateId);
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
});

router.post('/replay/:stateId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deterministicReplayService.replay(req.params.stateId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/replay/:stateId/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deterministicReplayService.verifyState(req.params.stateId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/replay/states', async (req: Request, res: Response) => {
  const orgId = req.query.organizationId as string;
  res.json({ success: true, data: deterministicReplayService.listStates(orgId) });
});

// =============================================================================
// QR AIR-GAP BRIDGE - Zero-Media Transfer
// =============================================================================

router.post('/qr/payload', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await qrAirGapBridgeService.createPayload(req.body);
    res.status(201).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
});

router.post('/qr/sequence/:payloadId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sequence = await qrAirGapBridgeService.generateSequence(req.params.payloadId);
    res.json({ success: true, data: sequence });
  } catch (error) {
    next(error);
  }
});

router.post('/qr/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await qrAirGapBridgeService.quickExport(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/qr/capture/start', async (req: Request, res: Response) => {
  const session = qrAirGapBridgeService.startCaptureSession(req.body.expectedPayloadId);
  res.status(201).json({ success: true, data: session });
});

router.post('/qr/capture/:sessionId/scan', async (req: Request, res: Response) => {
  const result = qrAirGapBridgeService.processCapturedQR(req.params.sessionId, req.body.qrData);
  res.json({ success: true, data: result });
});

router.get('/qr/capture/:sessionId/decode', async (req: Request, res: Response) => {
  const result = qrAirGapBridgeService.decodeCapturedData(
    req.params.sessionId, 
    req.query.decryptionKey as string
  );
  res.json({ success: true, data: result });
});

// =============================================================================
// CANARY TRIPWIRES - Exfiltration Detection
// =============================================================================

router.post('/canary/deploy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const canary = await canaryTripwireService.deployCanary({
      organizationId: req.organizationId || 'demo',
      ...req.body,
    });
    res.status(201).json({ success: true, data: canary });
  } catch (error) {
    next(error);
  }
});

router.post('/canary/deploy-network', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const canaries = await canaryTripwireService.deployCanaryNetwork({
      organizationId: req.organizationId || 'demo',
      ...req.body,
    });
    res.status(201).json({ success: true, data: canaries });
  } catch (error) {
    next(error);
  }
});

router.get('/canary/list', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: canaryTripwireService.listCanaries(orgId) });
});

router.get('/canary/alerts', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: canaryTripwireService.listAlerts(orgId) });
});

router.get('/canary/status', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: canaryTripwireService.getDeploymentStatus(orgId) });
});

router.post('/canary/trigger', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alert = await canaryTripwireService.reportTrigger(req.body);
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// TPM ATTESTATION - Hardware Signing
// =============================================================================

router.post('/tpm/initialize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = await tpmAttestationService.initialize();
    res.json({ success: true, data: key });
  } catch (error) {
    next(error);
  }
});

router.get('/tpm/key', async (req: Request, res: Response) => {
  const key = tpmAttestationService.getAttestationKey();
  res.json({ success: true, data: key });
});

router.post('/tpm/sign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signed = await tpmAttestationService.signDecision({
      organizationId: req.organizationId || 'demo',
      ...req.body,
    });
    res.json({ success: true, data: signed });
  } catch (error) {
    next(error);
  }
});

router.get('/tpm/verify/:signedId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tpmAttestationService.verifySignature(req.params.signedId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/tpm/signatures', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: tpmAttestationService.listSignedDecisions(orgId) });
});

router.get('/tpm/export/:signedId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bundle = await tpmAttestationService.exportVerificationBundle(req.params.signedId);
    res.json({ success: true, data: bundle });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// TIME-LOCK - Cryptographic Embargo
// =============================================================================

router.post('/timelock/vaults', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vault = await timeLockService.createVault({
      organizationId: req.organizationId || 'demo',
      createdBy: req.user?.id || 'anonymous',
      ...req.body,
    });
    res.status(201).json({ success: true, data: vault });
  } catch (error) {
    next(error);
  }
});

router.get('/timelock/vaults', async (req: Request, res: Response) => {
  const orgId = req.organizationId || 'demo';
  res.json({ success: true, data: timeLockService.listVaults(orgId) });
});

router.get('/timelock/vaults/:id', async (req: Request, res: Response) => {
  const vault = timeLockService.getVault(req.params.id);
  if (!vault) {
    return res.status(404).json({ success: false, error: 'Vault not found' });
  }
  res.json({ success: true, data: vault });
});

router.post('/timelock/vaults/:id/unlock', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const progress = await timeLockService.startUnlock(req.params.id);
    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
});

router.get('/timelock/vaults/:id/progress', async (req: Request, res: Response) => {
  const progress = timeLockService.getUnlockProgress(req.params.id);
  res.json({ success: true, data: progress });
});

router.get('/timelock/vaults/:id/content', async (req: Request, res: Response) => {
  const userId = req.user?.id || 'anonymous';
  const content = timeLockService.getVaultContent(req.params.id, userId);
  if (content === null) {
    return res.status(403).json({ success: false, error: 'Vault not accessible' });
  }
  res.json({ success: true, data: { content } });
});

router.post('/timelock/vaults/:id/revoke', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await timeLockService.revokeVault(req.params.id, req.user?.id || 'anonymous');
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// FEDERATED MESH - Multi-Site Learning
// =============================================================================

router.post('/mesh/initialize', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await federatedMeshService.initializeNode({
      organizationId: req.organizationId || 'demo',
      ...req.body,
    });
    res.json({ success: true, data: node });
  } catch (error) {
    next(error);
  }
});

router.get('/mesh/node', async (req: Request, res: Response) => {
  res.json({ success: true, data: federatedMeshService.getThisNode() });
});

router.get('/mesh/nodes', async (req: Request, res: Response) => {
  res.json({ success: true, data: federatedMeshService.listNodes() });
});

router.post('/mesh/nodes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await federatedMeshService.registerRemoteNode(req.body);
    res.status(201).json({ success: true, data: node });
  } catch (error) {
    next(error);
  }
});

router.post('/mesh/deltas', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const delta = await federatedMeshService.createModelDelta({
      ...req.body,
      deltaData: Buffer.from(req.body.deltaData, 'base64'),
    });
    res.status(201).json({ success: true, data: delta });
  } catch (error) {
    next(error);
  }
});

router.get('/mesh/deltas', async (req: Request, res: Response) => {
  const filters = {
    deltaType: req.query.deltaType as any,
    applied: req.query.applied === 'true' ? true : req.query.applied === 'false' ? false : undefined,
    baseModel: req.query.baseModel as string,
  };
  res.json({ success: true, data: federatedMeshService.listDeltas(filters) });
});

router.post('/mesh/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await federatedMeshService.createExportManifest(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/mesh/import', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await federatedMeshService.importFromManifest(req.body.importPath);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/mesh/deltas/:id/apply', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await federatedMeshService.applyDelta(req.params.id, req.body.targetModel);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/mesh/statistics', async (req: Request, res: Response) => {
  res.json({ success: true, data: federatedMeshService.getStatistics() });
});

// =============================================================================
// PORTABLE INSTANCE - USB Deployment
// =============================================================================

router.post('/portable/configs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const config = await portableInstanceService.createConfig({
      organizationId: req.organizationId || 'demo',
      createdBy: req.user?.id || 'anonymous',
      ...req.body,
    });
    res.status(201).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
});

router.get('/portable/configs', async (req: Request, res: Response) => {
  const orgId = req.query.organizationId as string;
  res.json({ success: true, data: portableInstanceService.listConfigs(orgId) });
});

router.get('/portable/configs/:id', async (req: Request, res: Response) => {
  const config = portableInstanceService.getConfig(req.params.id);
  if (!config) {
    return res.status(404).json({ success: false, error: 'Config not found' });
  }
  res.json({ success: true, data: config });
});

router.post('/portable/build/:configId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image = await portableInstanceService.buildImage(req.params.configId);
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
});

router.get('/portable/images', async (req: Request, res: Response) => {
  const configId = req.query.configId as string;
  res.json({ success: true, data: portableInstanceService.listImages(configId) });
});

router.get('/portable/images/:id', async (req: Request, res: Response) => {
  const image = portableInstanceService.getImage(req.params.id);
  if (!image) {
    return res.status(404).json({ success: false, error: 'Image not found' });
  }
  res.json({ success: true, data: image });
});

router.get('/portable/images/:id/progress', async (req: Request, res: Response) => {
  const progress = portableInstanceService.getBuildProgress(req.params.id);
  res.json({ success: true, data: progress });
});

router.get('/portable/images/:id/download', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await portableInstanceService.downloadImage(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
