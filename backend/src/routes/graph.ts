import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { graph } from '../config/neo4j.js';
import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = Router();

router.use(devAuth);

const entityQuerySchema = z.object({
  type: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(50),
});

const createEntitySchema = z.object({
  type: z.string().min(1),
  name: z.string().min(1),
  properties: z.record(z.unknown()).optional(),
});

const createRelationshipSchema = z.object({
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  type: z.string().min(1),
  properties: z.record(z.unknown()).optional(),
});

const neighborQuerySchema = z.object({
  direction: z.enum(['incoming', 'outgoing', 'both']).default('both'),
  relationshipType: z.string().optional(),
  depth: z.coerce.number().min(1).max(5).default(1),
});

const graphQuerySchema = z.object({
  query: z.string().min(1),
  parameters: z.record(z.unknown()).optional(),
});

/**
 * GET /api/v1/graph/entities
 * List entities in the knowledge graph
 */
router.get('/entities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, search, page, pageSize } = entityQuerySchema.parse(req.query);
    const orgId = req.organizationId!;

    let cypher = `
      MATCH (e)
      WHERE e.organizationId = $orgId
    `;
    const params: Record<string, unknown> = { orgId };

    if (type) {
      cypher += ` AND e:${type}`;
    }

    if (search) {
      cypher += ` AND (e.name =~ $searchPattern OR e.description =~ $searchPattern)`;
      params.searchPattern = `(?i).*${search}.*`;
    }

    // Get total count
    const countResult = await graph.read<{ count: unknown }>(
      cypher + ' RETURN count(e) as count',
      params
    );

    const rawCount = countResult[0]?.count ?? 0;
    let total: number;
    if (typeof rawCount === 'bigint') {
      total = Number(rawCount);
    } else if (typeof rawCount === 'number') {
      total = rawCount;
    } else if (rawCount && typeof (rawCount as any).toNumber === 'function') {
      total = (rawCount as any).toNumber();
    } else {
      total = Number(rawCount) || 0;
    }

    // Get paginated results
    cypher += ` RETURN e ORDER BY e.name SKIP toInteger($skip) LIMIT toInteger($limit)`;
    params.skip = Math.max(0, (page - 1) * pageSize);
    params.limit = pageSize;

    const entities = await graph.read<{ e: Record<string, unknown> }>(cypher, params);

    res.json({
      success: true,
      data: entities.map(r => r.e),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/graph/entities/:id
 * Get single entity
 */
router.get('/entities/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e {id: $id}) RETURN e',
      { id: req.params.id }
    );

    if (result.length === 0) {
      throw errors.notFound('Entity');
    }

    const entity = result[0].e;
    if (entity.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    // Get connection counts
    const connections = await graph.read<{ incoming: number; outgoing: number }>(
      `MATCH (e {id: $id})
       OPTIONAL MATCH (e)<-[in]-()
       OPTIONAL MATCH (e)-[out]->()
       RETURN count(DISTINCT in) as incoming, count(DISTINCT out) as outgoing`,
      { id: req.params.id }
    );

    res.json({
      success: true,
      data: {
        ...entity,
        connections: connections[0] || { incoming: 0, outgoing: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/graph/entities
 * Create new entity
 */
router.post('/entities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, name, properties } = createEntitySchema.parse(req.body);
    const orgId = req.organizationId!;

    const id = `ent_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;

    const entity = await graph.createNode(type, {
      id,
      name,
      organizationId: orgId,
      ...properties,
    });

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: orgId,
        user_id: req.user!.id,
        action: 'entity.create',
        resource_type: 'entity',
        resource_id: id,
        details: { type, name },
      },
    });

    res.status(201).json({
      success: true,
      data: entity,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/graph/entities/:id
 * Update entity
 */
router.put('/entities/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, properties } = req.body;

    // Check exists and ownership
    const existing = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e {id: $id}) RETURN e',
      { id: req.params.id }
    );

    if (existing.length === 0) {
      throw errors.notFound('Entity');
    }

    if (existing[0].e.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (name) updates.name = name;
    if (properties) Object.assign(updates, properties);

    const result = await graph.write<{ e: Record<string, unknown> }>(
      `MATCH (e {id: $id})
       SET e += $updates
       RETURN e`,
      { id: req.params.id, updates }
    );

    res.json({
      success: true,
      data: result[0]?.e,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/graph/entities/:id
 * Delete entity
 */
router.delete('/entities/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check exists and ownership
    const existing = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e {id: $id}) RETURN e',
      { id: req.params.id }
    );

    if (existing.length === 0) {
      throw errors.notFound('Entity');
    }

    if (existing[0].e.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    // Delete with all relationships
    await graph.write(
      'MATCH (e {id: $id}) DETACH DELETE e',
      { id: req.params.id }
    );

    // Audit log
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: req.organizationId!,
        user_id: req.user!.id,
        action: 'entity.delete',
        resource_type: 'entity',
        resource_id: req.params.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'Entity deleted' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/graph/entities/:id/neighbors
 * Get entity neighbors
 */
router.get('/entities/:id/neighbors', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { direction, relationshipType, depth } = neighborQuerySchema.parse(req.query);

    const neighbors = await graph.getNeighbors(
      req.params.id,
      direction,
      relationshipType,
      depth
    );

    res.json({
      success: true,
      data: neighbors,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/graph/relationships
 * Create relationship between entities
 */
router.post('/relationships', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sourceId, targetId, type, properties } = createRelationshipSchema.parse(req.body);

    // Verify both entities exist and belong to org
    const entities = await graph.read<{ e: Record<string, unknown> }>(
      'MATCH (e) WHERE e.id IN $ids RETURN e',
      { ids: [sourceId, targetId] }
    );

    if (entities.length !== 2) {
      throw errors.notFound('One or both entities');
    }

    for (const entity of entities) {
      if (entity.e.organizationId !== req.organizationId) {
        throw errors.forbidden();
      }
    }

    await graph.createRelationship(sourceId, targetId, type, properties || {});

    res.status(201).json({
      success: true,
      data: { sourceId, targetId, type, properties },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/graph/query
 * Execute custom graph query
 */
router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query, parameters } = graphQuerySchema.parse(req.body);

    // Security: only allow read queries
    const normalizedQuery = query.trim().toUpperCase();
    if (
      normalizedQuery.includes('CREATE') ||
      normalizedQuery.includes('DELETE') ||
      normalizedQuery.includes('SET') ||
      normalizedQuery.includes('REMOVE') ||
      normalizedQuery.includes('MERGE')
    ) {
      throw errors.forbidden('Only read queries are allowed');
    }

    // Inject organization filter
    const orgParams = {
      ...parameters,
      _orgId: req.organizationId,
    };

    const result = await graph.read(query, orgParams);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/graph/search
 * Search entities
 */
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    const type = req.query.type as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!q || q.length < 2) {
      throw errors.badRequest('Search query must be at least 2 characters');
    }

    const entities = await graph.searchEntities(q, type, limit);

    // Filter by organization
    const filtered = entities.filter(
      (e: Record<string, unknown>) => e.organizationId === req.organizationId
    );

    res.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
