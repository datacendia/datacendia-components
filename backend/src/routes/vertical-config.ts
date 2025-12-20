/**
 * CENDIA VERTICAL CONFIGURATION API ROUTES
 * 
 * Manage industry verticals and toggleable service access
 */

import { Router, Request, Response } from 'express';
import { verticalConfigService } from '../services/enterprise/VerticalConfigService.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Extract user/org info from request
const extractContext = (req: Request) => ({
  userId: req.headers['x-user-id'] as string || 'anonymous',
  organizationId: req.headers['x-organization-id'] as string || 'default-org',
});

// =============================================================================
// CATALOG & TEMPLATES
// =============================================================================

/**
 * GET /api/v1/vertical-config/services
 * Get full service catalog
 */
router.get('/services', async (_req: Request, res: Response) => {
  try {
    const services = verticalConfigService.getServiceCatalog();
    res.json({ services });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting services:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/services/:id
 * Get specific service
 */
router.get('/services/:id', async (req: Request, res: Response) => {
  try {
    const service = verticalConfigService.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting service:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/services/category/:category
 * Get services by category
 */
router.get('/services/category/:category', async (req: Request, res: Response) => {
  try {
    const services = verticalConfigService.getServicesByCategory(req.params.category as any);
    res.json({ services });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting services by category:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/verticals
 * Get all vertical templates
 */
router.get('/verticals', async (_req: Request, res: Response) => {
  try {
    const verticals = verticalConfigService.getVerticalTemplates();
    res.json({ verticals });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting verticals:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/verticals/:id
 * Get specific vertical template
 */
router.get('/verticals/:id', async (req: Request, res: Response) => {
  try {
    const vertical = verticalConfigService.getVerticalById(req.params.id);
    if (!vertical) {
      return res.status(404).json({ error: 'Vertical not found' });
    }
    res.json(vertical);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting vertical:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/verticals/:id/recommended
 * Get recommended services for a vertical
 */
router.get('/verticals/:id/recommended', async (req: Request, res: Response) => {
  try {
    const services = verticalConfigService.getRecommendedServices(req.params.id);
    res.json({ services });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting recommended services:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/verticals/compare/:id1/:id2
 * Compare two verticals
 */
router.get('/verticals/compare/:id1/:id2', async (req: Request, res: Response) => {
  try {
    const comparison = verticalConfigService.compareVerticals(req.params.id1, req.params.id2);
    res.json(comparison);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error comparing verticals:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// ORGANIZATION CONFIGURATION
// =============================================================================

/**
 * GET /api/v1/vertical-config/organization
 * Get organization's current configuration
 */
router.get('/organization', async (req: Request, res: Response) => {
  try {
    const { organizationId } = extractContext(req);
    const config = await verticalConfigService.getOrganizationConfig(organizationId);
    
    if (!config) {
      return res.status(404).json({ error: 'No configuration found', needsSetup: true });
    }
    
    res.json(config);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting org config:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/v1/vertical-config/organization
 * Create organization configuration
 */
router.post('/organization', async (req: Request, res: Response) => {
  try {
    const { userId, organizationId } = extractContext(req);
    const { verticalId, customEnabledServices } = req.body;

    if (!verticalId) {
      return res.status(400).json({ error: 'verticalId is required' });
    }

    const config = await verticalConfigService.createOrganizationConfig(
      organizationId,
      verticalId,
      userId,
      customEnabledServices
    );

    res.status(201).json(config);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error creating org config:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/v1/vertical-config/organization
 * Update organization configuration
 */
router.put('/organization', async (req: Request, res: Response) => {
  try {
    const { userId, organizationId } = extractContext(req);
    const updates = req.body;

    const config = await verticalConfigService.updateOrganizationConfig(
      organizationId,
      updates,
      userId
    );

    res.json(config);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error updating org config:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/v1/vertical-config/organization/switch-vertical
 * Switch to a different vertical
 */
router.post('/organization/switch-vertical', async (req: Request, res: Response) => {
  try {
    const { userId, organizationId } = extractContext(req);
    const { verticalId, preserveCustomizations = true } = req.body;

    if (!verticalId) {
      return res.status(400).json({ error: 'verticalId is required' });
    }

    const config = await verticalConfigService.switchVertical(
      organizationId,
      verticalId,
      userId,
      preserveCustomizations
    );

    res.json(config);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error switching vertical:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// SERVICE TOGGLES
// =============================================================================

/**
 * POST /api/v1/vertical-config/toggle/:serviceId
 * Toggle a single service
 */
router.post('/toggle/:serviceId', async (req: Request, res: Response) => {
  try {
    const { userId, organizationId } = extractContext(req);
    const { enabled, reason } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled (boolean) is required' });
    }

    const toggle = await verticalConfigService.toggleService(
      organizationId,
      req.params.serviceId,
      enabled,
      userId,
      reason
    );

    res.json(toggle);
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error toggling service:', error);
    res.status(error.message.includes('Core service') ? 400 : 500).json({ error: error.message });
  }
});

/**
 * POST /api/v1/vertical-config/toggle-bulk
 * Toggle multiple services at once
 */
router.post('/toggle-bulk', async (req: Request, res: Response) => {
  try {
    const { userId, organizationId } = extractContext(req);
    const { toggles } = req.body;

    if (!Array.isArray(toggles)) {
      return res.status(400).json({ error: 'toggles array is required' });
    }

    const results = await verticalConfigService.bulkToggleServices(
      organizationId,
      toggles,
      userId
    );

    res.json({ results });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error bulk toggling services:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/enabled
 * Get all enabled services for organization
 */
router.get('/enabled', async (req: Request, res: Response) => {
  try {
    const { organizationId } = extractContext(req);
    const services = await verticalConfigService.getEnabledServices(organizationId);
    res.json({ services });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting enabled services:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/disabled
 * Get all disabled services for organization
 */
router.get('/disabled', async (req: Request, res: Response) => {
  try {
    const { organizationId } = extractContext(req);
    const services = await verticalConfigService.getDisabledServices(organizationId);
    res.json({ services });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error getting disabled services:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/vertical-config/check/:serviceId
 * Check if a specific service is enabled
 */
router.get('/check/:serviceId', async (req: Request, res: Response) => {
  try {
    const { organizationId } = extractContext(req);
    const enabled = await verticalConfigService.isServiceEnabled(organizationId, req.params.serviceId);
    res.json({ serviceId: req.params.serviceId, enabled });
  } catch (error: any) {
    logger.error('[VerticalConfig API] Error checking service:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
