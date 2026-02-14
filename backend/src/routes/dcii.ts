/**
 * DCII - Decision Crisis Immunization Infrastructure™ API Routes
 * 
 * Comprehensive API for all 6 DCII services supporting the 9 Primitives:
 * 1. IISS (Institutional Immune System Score) — scores all 9 primitives
 * 2. Cognitive Bias Mitigation (P6) — detect & challenge biases
 * 3. Synthetic Media Authentication (P8) — deepfake detection & C2PA
 * 4. Cross-Jurisdiction Compliance (P9) — conflict detection
 * 5. RFC 3161 Timestamp Authority (P1) — cryptographic timestamps
 * 6. Decision Similarity — proactive historical matching
 */

import { Router, Request, Response } from 'express';
import { devAuth } from '../middleware/auth.js';
import { iissService } from '../services/dcii/IISSService.js';
import { syntheticMediaAuthService } from '../services/dcii/SyntheticMediaAuthService.js';
import { crossJurisdictionConflictService } from '../services/dcii/CrossJurisdictionConflictService.js';
import { timestampAuthorityService } from '../services/dcii/TimestampAuthorityService.js';
import { decisionSimilarityService } from '../services/dcii/DecisionSimilarityService.js';
import { cognitiveBiasMitigationService } from '../services/dcii/CognitiveBiasMitigationService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// All DCII routes require authentication (devAuth allows bypass in development)
router.use(devAuth);

// =============================================================================
// DCII STATUS
// =============================================================================

router.get('/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'CendiaDCII™ — Decision Crisis Immunization Infrastructure',
      version: '3.0.0',
      modules: {
        iiss: { status: 'operational', description: 'CendiaIISS™ — Institutional Immune System Score (9 primitives)' },
        cognitiveBias: { status: 'operational', description: 'CendiaBiasMitigation™ — Cognitive Bias Mitigation (P6)' },
        syntheticMedia: { status: 'operational', description: 'CendiaMediaAuth™ — Synthetic Media Authentication (P8)' },
        crossJurisdiction: { status: 'operational', description: 'CendiaJurisdiction™ — Cross-Jurisdiction Conflict Detection (P9)' },
        timestampAuthority: { status: 'operational', description: 'CendiaTimestamp™ — RFC 3161 Timestamp Authority (P1)' },
        decisionSimilarity: { status: 'operational', description: 'CendiaSimilarity™ — Decision Similarity Engine' },
      },
      primitives: [
        { id: 'P1', name: 'Discovery-Time Proof', question: 'When did you know?', service: 'CendiaTimestamp' },
        { id: 'P2', name: 'Deliberation Capture', question: 'What did you consider?', service: 'Council + CendiaVault' },
        { id: 'P3', name: 'Override Accountability', question: 'Who decided and why?', service: 'CendiaResponsibility + CendiaNotary' },
        { id: 'P4', name: 'Continuity Memory', question: 'Is knowledge preserved?', service: 'CendiaMemory + Pantheon' },
        { id: 'P5', name: 'Drift Detection', question: 'Are you still compliant?', service: 'CendiaDrift' },
        { id: 'P6', name: 'Cognitive Bias Mitigation', question: 'Did you challenge assumptions?', service: 'CendiaBiasMitigation' },
        { id: 'P7', name: 'Quantum-Resistant Integrity', question: 'Is the proof future-proof?', service: 'PostQuantumKMS' },
        { id: 'P8', name: 'Synthetic Media Authentication', question: 'Is the evidence authentic?', service: 'CendiaMediaAuth' },
        { id: 'P9', name: 'Cross-Jurisdiction Compliance', question: 'Did you comply everywhere?', service: 'CendiaJurisdiction' },
      ],
    },
  });
});

// =============================================================================
// IISS - INSTITUTIONAL IMMUNE SYSTEM SCORE
// =============================================================================

// Calculate IISS for an organization
router.post('/iiss/calculate', async (req: Request, res: Response) => {
  try {
    const { organizationId, organizationName } = req.body;
    const initiatedBy = req.user?.email || 'api-user';
    if (!organizationId || !organizationName) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId and organizationName required' } });
    }
    const score = await iissService.calculateScore(organizationId, organizationName, initiatedBy);
    res.json({ success: true, data: score });
  } catch (err: any) {
    logger.error('IISS calculation failed:', err);
    res.status(500).json({ success: false, error: { code: 'CALCULATION_FAILED', message: err.message } });
  }
});

// Get latest IISS score for an organization
router.get('/iiss/score/:organizationId', (req: Request, res: Response) => {
  const score = iissService.getLatestScore(req.params.organizationId);
  if (!score) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No IISS score found for organization' } });
  res.json({ success: true, data: score });
});

// Get IISS score by ID
router.get('/iiss/score/id/:scoreId', (req: Request, res: Response) => {
  const score = iissService.getScore(req.params.scoreId);
  if (!score) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Score not found' } });
  res.json({ success: true, data: score });
});

// Get IISS history
router.get('/iiss/history/:organizationId', (req: Request, res: Response) => {
  const history = iissService.getHistory(req.params.organizationId);
  res.json({ success: true, data: history });
});

// Get all IISS scores
router.get('/iiss/scores', (_req: Request, res: Response) => {
  res.json({ success: true, data: iissService.getAllScores() });
});

// Get dimension definitions
router.get('/iiss/dimensions', (_req: Request, res: Response) => {
  res.json({ success: true, data: iissService.getDimensionDefinitions() });
});

// Get score band info
router.get('/iiss/bands', (_req: Request, res: Response) => {
  res.json({ success: true, data: iissService.getScoreBandInfo() });
});

// Get industry benchmarks
router.get('/iiss/benchmarks', (req: Request, res: Response) => {
  const industry = req.query.industry as string | undefined;
  res.json({ success: true, data: iissService.getBenchmarks(industry) });
});

// Get assessment details
router.get('/iiss/assessment/:assessmentId', (req: Request, res: Response) => {
  const assessment = iissService.getAssessment(req.params.assessmentId);
  if (!assessment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assessment not found' } });
  res.json({ success: true, data: assessment });
});

// =============================================================================
// COGNITIVE BIAS MITIGATION (P6)
// =============================================================================

// Analyze a deliberation for cognitive biases
router.post('/bias/analyze', async (req: Request, res: Response) => {
  try {
    const { organizationId, deliberationId, deliberationTitle, deliberationDurationMinutes, agentCount, dissentCount, devilsAdvocatePresent, challengeCount, unanimousVote, arguments: args } = req.body;
    const analyzedBy = req.user?.email || 'api-user';
    if (!organizationId || !deliberationId || !deliberationTitle) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, deliberationId, and deliberationTitle required' } });
    }
    const analysis = await cognitiveBiasMitigationService.analyzeDeliberation({
      organizationId, deliberationId, deliberationTitle,
      deliberationDurationMinutes: deliberationDurationMinutes || 0,
      agentCount: agentCount || 0, dissentCount: dissentCount || 0,
      devilsAdvocatePresent: devilsAdvocatePresent || false,
      challengeCount: challengeCount || 0, unanimousVote: unanimousVote || false,
      arguments: args || [], analyzedBy,
    });
    res.json({ success: true, data: analysis });
  } catch (err: any) {
    logger.error('Bias analysis failed:', err);
    res.status(500).json({ success: false, error: { code: 'ANALYSIS_FAILED', message: err.message } });
  }
});

// Get bias analysis by ID
router.get('/bias/analysis/:analysisId', (req: Request, res: Response) => {
  const analysis = cognitiveBiasMitigationService.getAnalysis(req.params.analysisId);
  if (!analysis) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis not found' } });
  res.json({ success: true, data: analysis });
});

// Get analyses by organization
router.get('/bias/analyses/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getAnalysesByOrganization(req.params.organizationId) });
});

// Get analyses by deliberation
router.get('/bias/by-deliberation/:deliberationId', (req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getAnalysesByDeliberation(req.params.deliberationId) });
});

// Mitigate a detected bias
router.post('/bias/mitigate/:analysisId/:biasDetectionId', (req: Request, res: Response) => {
  const { action } = req.body;
  const mitigatedBy = req.user?.email || 'api-user';
  if (!action) return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'action required' } });
  const detection = cognitiveBiasMitigationService.mitigateBias(req.params.analysisId, req.params.biasDetectionId, action, mitigatedBy);
  if (!detection) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis or bias detection not found' } });
  res.json({ success: true, data: detection });
});

// Accept bias risk
router.post('/bias/accept-risk/:analysisId/:biasDetectionId', (req: Request, res: Response) => {
  const { justification } = req.body;
  const acceptedBy = req.user?.email || 'api-user';
  if (!justification) return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'justification required' } });
  const detection = cognitiveBiasMitigationService.acceptBiasRisk(req.params.analysisId, req.params.biasDetectionId, acceptedBy, justification);
  if (!detection) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Analysis or bias detection not found' } });
  res.json({ success: true, data: detection });
});

// Generate bias report for organization
router.post('/bias/report', (req: Request, res: Response) => {
  try {
    const { organizationId, from, to } = req.body;
    if (!organizationId) return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId required' } });
    const fromDate = from ? new Date(from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();
    const report = cognitiveBiasMitigationService.generateReport(organizationId, fromDate, toDate);
    res.json({ success: true, data: report });
  } catch (err: any) {
    logger.error('Bias report generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'REPORT_FAILED', message: err.message } });
  }
});

// Get bias report by ID
router.get('/bias/report/:reportId', (req: Request, res: Response) => {
  const report = cognitiveBiasMitigationService.getReport(req.params.reportId);
  if (!report) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Report not found' } });
  res.json({ success: true, data: report });
});

// Get bias definitions (all 12 types)
router.get('/bias/definitions', (_req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getBiasDefinitions() });
});

// Get all analyses
router.get('/bias/analyses', (_req: Request, res: Response) => {
  res.json({ success: true, data: cognitiveBiasMitigationService.getAllAnalyses() });
});

// =============================================================================
// SYNTHETIC MEDIA AUTHENTICATION
// =============================================================================

// Sign media (create provenance)
router.post('/media/sign', async (req: Request, res: Response) => {
  try {
    const { organizationId, fileName, mediaType, mimeType, content, origin } = req.body;
    const createdBy = req.user?.email || 'api-user';
    if (!organizationId || !fileName || !mediaType) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, fileName, and mediaType required' } });
    }
    const asset = await syntheticMediaAuthService.signMedia(
      organizationId, fileName, mediaType, mimeType || 'application/octet-stream',
      content || `content-${Date.now()}`, createdBy,
      origin || { source: 'upload', capturedAt: new Date(), capturedBy: createdBy }
    );
    res.json({ success: true, data: asset });
  } catch (err: any) {
    logger.error('Media signing failed:', err);
    res.status(500).json({ success: false, error: { code: 'SIGNING_FAILED', message: err.message } });
  }
});

// Analyze media authenticity (deepfake detection)
router.post('/media/analyze/:assetId', async (req: Request, res: Response) => {
  try {
    const analyzedBy = req.user?.email || 'api-user';
    const assessment = await syntheticMediaAuthService.analyzeAuthenticity(req.params.assetId, analyzedBy);
    res.json({ success: true, data: assessment });
  } catch (err: any) {
    logger.error('Media analysis failed:', err);
    res.status(500).json({ success: false, error: { code: 'ANALYSIS_FAILED', message: err.message } });
  }
});

// Get media asset
router.get('/media/asset/:assetId', (req: Request, res: Response) => {
  const asset = syntheticMediaAuthService.getAsset(req.params.assetId);
  if (!asset) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Asset not found' } });
  res.json({ success: true, data: asset });
});

// Get assets by organization
router.get('/media/assets/:organizationId', (req: Request, res: Response) => {
  const assets = syntheticMediaAuthService.getAssetsByOrganization(req.params.organizationId);
  res.json({ success: true, data: assets });
});

// Get all assets
router.get('/media/assets', (_req: Request, res: Response) => {
  res.json({ success: true, data: syntheticMediaAuthService.getAllAssets() });
});

// Generate verification report
router.get('/media/report/:assetId', async (req: Request, res: Response) => {
  try {
    const report = await syntheticMediaAuthService.generateVerificationReport(req.params.assetId);
    res.json({ success: true, data: report });
  } catch (err: any) {
    logger.error('Report generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'REPORT_FAILED', message: err.message } });
  }
});

// Add custody entry
router.post('/media/custody/:assetId', (req: Request, res: Response) => {
  const { action, actorRole, details, ipAddress } = req.body;
  const actor = req.user?.email || 'api-user';
  const entry = syntheticMediaAuthService.addCustodyEntry(req.params.assetId, action, actor, actorRole || 'user', details || '', ipAddress);
  if (!entry) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Asset not found' } });
  res.json({ success: true, data: entry });
});

// =============================================================================
// CROSS-JURISDICTION COMPLIANCE CONFLICT DETECTION
// =============================================================================

// Assess organization across jurisdictions
router.post('/jurisdiction/assess', async (req: Request, res: Response) => {
  try {
    const { organizationId, organizationName, jurisdictions } = req.body;
    const assessedBy = req.user?.email || 'api-user';
    if (!organizationId || !organizationName || !jurisdictions?.length) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, organizationName, and jurisdictions required' } });
    }
    const assessment = await crossJurisdictionConflictService.assessOrganization(organizationId, organizationName, jurisdictions, assessedBy);
    res.json({ success: true, data: assessment });
  } catch (err: any) {
    logger.error('Jurisdiction assessment failed:', err);
    res.status(500).json({ success: false, error: { code: 'ASSESSMENT_FAILED', message: err.message } });
  }
});

// Get assessment
router.get('/jurisdiction/assessment/:assessmentId', (req: Request, res: Response) => {
  const assessment = crossJurisdictionConflictService.getAssessment(req.params.assessmentId);
  if (!assessment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assessment not found' } });
  res.json({ success: true, data: assessment });
});

// Get assessments by organization
router.get('/jurisdiction/assessments/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getAssessmentsByOrganization(req.params.organizationId) });
});

// Get conflicts by organization
router.get('/jurisdiction/conflicts/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getConflictsByOrganization(req.params.organizationId) });
});

// Get all conflicts
router.get('/jurisdiction/conflicts', (_req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getAllConflicts() });
});

// Get specific conflict
router.get('/jurisdiction/conflict/:conflictId', (req: Request, res: Response) => {
  const conflict = crossJurisdictionConflictService.getConflict(req.params.conflictId);
  if (!conflict) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Conflict not found' } });
  res.json({ success: true, data: conflict });
});

// Generate good-faith documentation
router.post('/jurisdiction/good-faith/:conflictId', async (req: Request, res: Response) => {
  try {
    const signedBy = req.user?.email || 'api-user';
    const doc = await crossJurisdictionConflictService.generateGoodFaithDocument(req.params.conflictId, signedBy);
    res.json({ success: true, data: doc });
  } catch (err: any) {
    logger.error('Good-faith document generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'GENERATION_FAILED', message: err.message } });
  }
});

// Generate jurisdiction evidence packet
router.post('/jurisdiction/evidence-packet', async (req: Request, res: Response) => {
  try {
    const { organizationId, jurisdiction, framework, packetType } = req.body;
    const generatedBy = req.user?.email || 'api-user';
    if (!organizationId || !jurisdiction || !framework) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, jurisdiction, and framework required' } });
    }
    const packet = await crossJurisdictionConflictService.generateEvidencePacket(
      organizationId, jurisdiction, framework, packetType || 'compliance_report', generatedBy
    );
    res.json({ success: true, data: packet });
  } catch (err: any) {
    logger.error('Evidence packet generation failed:', err);
    res.status(500).json({ success: false, error: { code: 'GENERATION_FAILED', message: err.message } });
  }
});

// Get evidence packets by organization
router.get('/jurisdiction/evidence-packets/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getEvidencePacketsByOrganization(req.params.organizationId) });
});

// Get jurisdiction profiles
router.get('/jurisdiction/profiles', (_req: Request, res: Response) => {
  res.json({ success: true, data: crossJurisdictionConflictService.getJurisdictionProfiles() });
});

// Get specific jurisdiction profile
router.get('/jurisdiction/profile/:jurisdiction', (req: Request, res: Response) => {
  const profile = crossJurisdictionConflictService.getJurisdictionProfile(req.params.jurisdiction as any);
  if (!profile) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Jurisdiction profile not found' } });
  res.json({ success: true, data: profile });
});

// =============================================================================
// RFC 3161 TIMESTAMP AUTHORITY
// =============================================================================

// Issue a timestamp
router.post('/timestamp/issue', async (req: Request, res: Response) => {
  try {
    const { organizationId, data, description, dataType, referenceId, useExternal, useBlockchain, preferredProvider } = req.body;
    if (!organizationId || !data || !description) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, data, and description required' } });
    }
    const token = await timestampAuthorityService.issueTimestamp(
      organizationId, data, description, dataType || 'generic', referenceId,
      { useExternal, useBlockchain, preferredProvider }
    );
    res.json({ success: true, data: token });
  } catch (err: any) {
    logger.error('Timestamp issuance failed:', err);
    res.status(500).json({ success: false, error: { code: 'ISSUANCE_FAILED', message: err.message } });
  }
});

// Batch timestamp
router.post('/timestamp/batch', async (req: Request, res: Response) => {
  try {
    const { organizationId, items, useExternal, useBlockchain } = req.body;
    if (!organizationId || !items?.length) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId and items required' } });
    }
    const batch = await timestampAuthorityService.batchTimestamp(organizationId, items, { useExternal, useBlockchain });
    res.json({ success: true, data: batch });
  } catch (err: any) {
    logger.error('Batch timestamp failed:', err);
    res.status(500).json({ success: false, error: { code: 'BATCH_FAILED', message: err.message } });
  }
});

// Verify a timestamp
router.post('/timestamp/verify/:tokenId', async (req: Request, res: Response) => {
  try {
    const verifiedBy = req.user?.email || 'api-user';
    const verification = await timestampAuthorityService.verifyTimestamp(req.params.tokenId, verifiedBy);
    res.json({ success: true, data: verification });
  } catch (err: any) {
    logger.error('Timestamp verification failed:', err);
    res.status(500).json({ success: false, error: { code: 'VERIFICATION_FAILED', message: err.message } });
  }
});

// Get timestamp token
router.get('/timestamp/token/:tokenId', (req: Request, res: Response) => {
  const token = timestampAuthorityService.getToken(req.params.tokenId);
  if (!token) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Token not found' } });
  res.json({ success: true, data: token });
});

// Get tokens by organization
router.get('/timestamp/tokens/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getTokensByOrganization(req.params.organizationId) });
});

// Get all tokens
router.get('/timestamp/tokens', (_req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getAllTokens() });
});

// Get tokens by reference
router.get('/timestamp/by-reference/:referenceId', (req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getTokensByReference(req.params.referenceId) });
});

// Get TSA providers
router.get('/timestamp/providers', (_req: Request, res: Response) => {
  res.json({ success: true, data: timestampAuthorityService.getProviders() });
});

// Get timestamp stats
router.get('/timestamp/stats', (req: Request, res: Response) => {
  const organizationId = req.query.organizationId as string | undefined;
  res.json({ success: true, data: timestampAuthorityService.getStats(organizationId) });
});

// Get batch
router.get('/timestamp/batch/:batchId', (req: Request, res: Response) => {
  const batch = timestampAuthorityService.getBatch(req.params.batchId);
  if (!batch) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Batch not found' } });
  res.json({ success: true, data: batch });
});

// =============================================================================
// DECISION SIMILARITY
// =============================================================================

// Search for similar decisions
router.post('/similarity/search', async (req: Request, res: Response) => {
  try {
    const { organizationId, title, question, context, decisionType, department, urgency, tags, maxResults, minSimilarity, includeOutcomes, includeCrossDepartment } = req.body;
    if (!organizationId || !title || !question) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, title, and question required' } });
    }
    const result = await decisionSimilarityService.findSimilarDecisions({
      organizationId, title, question, context: context || '',
      decisionType, department, urgency, tags,
      maxResults, minSimilarity, includeOutcomes, includeCrossDepartment,
    });
    res.json({ success: true, data: result });
  } catch (err: any) {
    logger.error('Similarity search failed:', err);
    res.status(500).json({ success: false, error: { code: 'SEARCH_FAILED', message: err.message } });
  }
});

// Add a decision record
router.post('/similarity/decisions', (req: Request, res: Response) => {
  try {
    const record = req.body;
    if (!record.organizationId || !record.title || !record.question) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_PARAMS', message: 'organizationId, title, and question required' } });
    }
    const decision = decisionSimilarityService.addDecisionRecord({
      ...record,
      decidedAt: record.decidedAt ? new Date(record.decidedAt) : new Date(),
      decidedBy: record.decidedBy || req.user?.email || 'api-user',
      tags: record.tags || [],
      relatedDecisionIds: record.relatedDecisionIds || [],
      overrideOccurred: record.overrideOccurred || false,
    });
    res.json({ success: true, data: decision });
  } catch (err: any) {
    logger.error('Decision record creation failed:', err);
    res.status(500).json({ success: false, error: { code: 'CREATION_FAILED', message: err.message } });
  }
});

// Update decision outcome
router.put('/similarity/decisions/:decisionId/outcome', (req: Request, res: Response) => {
  const { outcome, outcomeDescription, lessonsLearned, dissenterWasCorrect } = req.body;
  const decision = decisionSimilarityService.updateOutcome(
    req.params.decisionId, outcome, outcomeDescription, lessonsLearned, dissenterWasCorrect
  );
  if (!decision) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Decision not found' } });
  res.json({ success: true, data: decision });
});

// Get decisions by organization
router.get('/similarity/decisions/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getDecisionsByOrganization(req.params.organizationId) });
});

// Get all decisions
router.get('/similarity/decisions', (_req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getAllDecisions() });
});

// Get specific decision
router.get('/similarity/decision/:decisionId', (req: Request, res: Response) => {
  const decision = decisionSimilarityService.getDecision(req.params.decisionId);
  if (!decision) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Decision not found' } });
  res.json({ success: true, data: decision });
});

// Detect patterns
router.post('/similarity/patterns/:organizationId', async (req: Request, res: Response) => {
  try {
    const patterns = await decisionSimilarityService.detectPatterns(req.params.organizationId);
    res.json({ success: true, data: patterns });
  } catch (err: any) {
    logger.error('Pattern detection failed:', err);
    res.status(500).json({ success: false, error: { code: 'DETECTION_FAILED', message: err.message } });
  }
});

// Get patterns by organization
router.get('/similarity/patterns/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getPatternsByOrganization(req.params.organizationId) });
});

// Get similarity stats
router.get('/similarity/stats/:organizationId', (req: Request, res: Response) => {
  res.json({ success: true, data: decisionSimilarityService.getStats(req.params.organizationId) });
});

// Get search result
router.get('/similarity/result/:resultId', (req: Request, res: Response) => {
  const result = decisionSimilarityService.getSearchResult(req.params.resultId);
  if (!result) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Search result not found' } });
  res.json({ success: true, data: result });
});

export default router;
