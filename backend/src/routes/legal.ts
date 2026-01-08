/**
 * DATACENDIA LEGAL VERTICAL API ROUTES
 * 
 * Enterprise Platinum Standard - Complete legal vertical API
 * Includes case law ingestion, matter management, privilege gates, and citation enforcement
 */

import { Router, Request, Response } from 'express';
import { legalVerticalService } from '../services/legal';

const router = Router();

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', (_req: Request, res: Response) => {
  try {
    const health = legalVerticalService.getHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// =============================================================================
// CASE LAW LIBRARY
// =============================================================================

/**
 * POST /api/v1/legal/cases/ingest
 * Ingest a single case into the library
 */
router.post('/cases/ingest', async (req: Request, res: Response) => {
  try {
    const caseData = req.body;
    const result = await legalVerticalService.ingestCaseLaw(caseData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest case law', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/cases/bulk-ingest
 * Bulk ingest cases (e.g., from Westlaw/LexisNexis export)
 */
router.post('/cases/bulk-ingest', async (req: Request, res: Response) => {
  try {
    const { cases, sourceSystem, importedBy } = req.body;
    
    if (!Array.isArray(cases)) {
      return res.status(400).json({ error: 'cases must be an array' });
    }
    
    const result = await legalVerticalService.bulkIngestCaseLaw(
      cases,
      sourceSystem || 'manual',
      importedBy || 'system'
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk ingest cases', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/cases/search
 * Search the case law library
 */
router.post('/cases/search', async (req: Request, res: Response) => {
  try {
    const query = req.body;
    const results = await legalVerticalService.searchCaseLaw(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/cases/:id
 * Get case by ID
 */
router.get('/cases/:id', (req: Request, res: Response) => {
  try {
    const caseLaw = legalVerticalService.getCaseById(req.params.id);
    if (!caseLaw) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(caseLaw);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/cases/citation/:citation
 * Get case by citation
 */
router.get('/cases/citation/:citation', (req: Request, res: Response) => {
  try {
    const citation = decodeURIComponent(req.params.citation);
    const caseLaw = legalVerticalService.getCaseByCitation(citation);
    if (!caseLaw) {
      return res.status(404).json({ error: 'Case not found for citation' });
    }
    res.json(caseLaw);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get case', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/cases/verify-citation
 * Verify a citation exists in the library
 */
router.post('/cases/verify-citation', (req: Request, res: Response) => {
  try {
    const { citation } = req.body;
    const result = legalVerticalService.verifyCitation(citation);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Verification failed', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/cases/stats
 * Get library statistics
 */
router.get('/cases/stats', (_req: Request, res: Response) => {
  try {
    const stats = legalVerticalService.getLibraryStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats', details: String(error) });
  }
});

// =============================================================================
// MATTER MANAGEMENT
// =============================================================================

/**
 * POST /api/v1/legal/matters
 * Create a new matter
 */
router.post('/matters', async (req: Request, res: Response) => {
  try {
    const matterData = req.body;
    const matter = await legalVerticalService.createMatter(matterData);
    res.status(201).json(matter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create matter', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/matters/:id
 * Get matter by ID
 */
router.get('/matters/:id', (req: Request, res: Response) => {
  try {
    const matter = legalVerticalService.getMatter(req.params.id);
    if (!matter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    res.json(matter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get matter', details: String(error) });
  }
});

/**
 * PUT /api/v1/legal/matters/:id
 * Update matter
 */
router.put('/matters/:id', async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const matter = await legalVerticalService.updateMatter(req.params.id, updates);
    if (!matter) {
      return res.status(404).json({ error: 'Matter not found' });
    }
    res.json(matter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update matter', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/matters
 * List matters with optional filters
 */
router.get('/matters', (req: Request, res: Response) => {
  try {
    const filters = {
      clientId: req.query.clientId as string | undefined,
      status: req.query.status as any,
      type: req.query.type as any,
      practiceArea: req.query.practiceArea as string | undefined,
      responsibleAttorney: req.query.responsibleAttorney as string | undefined,
    };
    
    const matters = legalVerticalService.listMatters(filters);
    res.json({ matters, total: matters.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list matters', details: String(error) });
  }
});

// =============================================================================
// PRIVILEGE MANAGEMENT
// =============================================================================

/**
 * POST /api/v1/legal/privilege/review
 * Submit a privilege review
 */
router.post('/privilege/review', async (req: Request, res: Response) => {
  try {
    const reviewData = req.body;
    const review = await legalVerticalService.submitPrivilegeReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit privilege review', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/privilege/can-export/:documentId
 * Check if document can be exported (privilege gate)
 */
router.get('/privilege/can-export/:documentId', (req: Request, res: Response) => {
  try {
    const result = legalVerticalService.canExportDocument(req.params.documentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Export check failed', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/privilege/reviews/:matterId
 * Get privilege reviews for a matter
 */
router.get('/privilege/reviews/:matterId', (req: Request, res: Response) => {
  try {
    const reviews = legalVerticalService.getPrivilegeReviewsForMatter(req.params.matterId);
    res.json({ reviews, total: reviews.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reviews', details: String(error) });
  }
});

// =============================================================================
// CITATION ENFORCEMENT
// =============================================================================

/**
 * POST /api/v1/legal/citations/validate
 * Validate citations
 */
router.post('/citations/validate', (req: Request, res: Response) => {
  try {
    const { citations } = req.body;
    
    if (!Array.isArray(citations)) {
      return res.status(400).json({ error: 'citations must be an array' });
    }
    
    const result = legalVerticalService.validateCitations(citations);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Validation failed', details: String(error) });
  }
});

/**
 * POST /api/v1/legal/citations/enforce
 * Enforce citation requirement (no-source-no-claim)
 */
router.post('/citations/enforce', (req: Request, res: Response) => {
  try {
    const { claims } = req.body;
    
    if (!Array.isArray(claims)) {
      return res.status(400).json({ error: 'claims must be an array' });
    }
    
    const result = legalVerticalService.enforceCitationRequirement(claims);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Enforcement failed', details: String(error) });
  }
});

// =============================================================================
// AGENT PRESETS
// =============================================================================

/**
 * GET /api/v1/legal/presets
 * Get all agent presets
 */
router.get('/presets', (_req: Request, res: Response) => {
  try {
    const presets = legalVerticalService.getAgentPresets();
    res.json({ presets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get presets', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/presets/:id
 * Get agent preset by ID
 */
router.get('/presets/:id', (req: Request, res: Response) => {
  try {
    const preset = legalVerticalService.getAgentPreset(req.params.id);
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }
    res.json(preset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get preset', details: String(error) });
  }
});

/**
 * GET /api/v1/legal/presets/recommended/:matterType
 * Get recommended preset for matter type
 */
router.get('/presets/recommended/:matterType', (req: Request, res: Response) => {
  try {
    const preset = legalVerticalService.getRecommendedPreset(req.params.matterType as any);
    res.json(preset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommended preset', details: String(error) });
  }
});

export default router;
