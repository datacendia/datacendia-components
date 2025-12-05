import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';
import { testDataSourceConnection } from '../services/connectors/index.js';

const router = Router();

router.use(devAuth);

const dataSourceSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    'POSTGRESQL', 'MYSQL', 'SNOWFLAKE', 'BIGQUERY',
    'SALESFORCE', 'SAP', 'ORACLE', 'MONGODB',
    'REST_API', 'GRAPHQL', 'CSV_UPLOAD'
  ]),
  config: z.record(z.unknown()),
  syncSchedule: z.string().optional(),
});

/**
 * GET /api/v1/data-sources
 * List data sources
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataSources = await prisma.dataSource.findMany({
      where: { organizationId: req.organizationId! },
      orderBy: { name: 'asc' },
    });

    // Remove sensitive credentials from response
    const sanitized = dataSources.map(ds => ({
      ...ds,
      credentials: undefined,
      config: {
        ...(ds.config as object),
        password: undefined,
        apiKey: undefined,
        secret: undefined,
      },
    }));

    res.json({
      success: true,
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/data-sources/:id
 * Get single data source
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataSource = await prisma.dataSource.findUnique({
      where: { id: req.params.id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    res.json({
      success: true,
      data: {
        ...dataSource,
        credentials: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/data-sources
 * Create data source
 */
router.post('/', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type, config, syncSchedule } = dataSourceSchema.parse(req.body);
    const orgId = req.organizationId!;

    // Extract credentials from config
    const { password, apiKey, secret, ...safeConfig } = config as Record<string, unknown>;
    const credentials = { password, apiKey, secret };

    const dataSource = await prisma.dataSource.create({
      data: {
        organizationId: orgId,
        name,
        type,
        config: safeConfig as Prisma.InputJsonValue,
        credentials: credentials as Prisma.InputJsonValue,
        syncSchedule,
        status: 'PENDING',
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: req.user!.id,
        action: 'data_source.create',
        resourceType: 'data_source',
        resourceId: dataSource.id,
        details: { name, type },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...dataSource,
        credentials: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/data-sources/test
 * Test connection without saving (for new data sources)
 */
router.post('/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, config, credentials } = req.body;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Type is required',
      });
    }
    
    const result = await testDataSourceConnection(
      type,
      config || {},
      credentials || {}
    );
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/data-sources/:id/test
 * Test connection for existing data source
 */
router.post('/:id/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataSource = await prisma.dataSource.findUnique({
      where: { id: req.params.id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    // Test connection based on type
    const config = dataSource.config as Record<string, unknown>;
    const credentials = dataSource.credentials as Record<string, string>;
    const result = await testDataSourceConnection(dataSource.type, config, credentials);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/data-sources/:id/sync
 * Trigger sync
 */
router.post('/:id/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataSource = await prisma.dataSource.findUnique({
      where: { id: req.params.id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    // Update status
    await prisma.dataSource.update({
      where: { id: req.params.id },
      data: { status: 'SYNCING' },
    });

    // Run sync in background
    syncDataSource(dataSource).catch(err => {
      logger.error('Data source sync failed:', err);
    });

    res.json({
      success: true,
      data: { message: 'Sync started' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/data-sources/:id
 * Delete data source
 */
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataSource = await prisma.dataSource.findUnique({
      where: { id: req.params.id },
    });

    if (!dataSource) {
      throw errors.notFound('Data source');
    }

    if (dataSource.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    await prisma.dataSource.delete({
      where: { id: req.params.id },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: req.organizationId!,
        userId: req.user!.id,
        action: 'data_source.delete',
        resourceType: 'data_source',
        resourceId: req.params.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'Data source deleted' },
    });
  } catch (error) {
    next(error);
  }
});

// Test connection is now handled by the imported testDataSourceConnection from connectors

// Sync data source
async function syncDataSource(dataSource: {
  id: string;
  type: string;
  config: unknown;
  credentials: unknown;
}) {
  try {
    // Simulate sync operation
    await new Promise(resolve => setTimeout(resolve, 2000));

    await prisma.dataSource.update({
      where: { id: dataSource.id },
      data: {
        status: 'CONNECTED',
        lastSyncAt: new Date(),
        lastSyncStatus: 'success',
      },
    });

  } catch (error) {
    logger.error('Sync error:', error);

    await prisma.dataSource.update({
      where: { id: dataSource.id },
      data: {
        status: 'ERROR',
        lastSyncStatus: error instanceof Error ? error.message : 'Sync failed',
      },
    });
  }
}

export default router;
