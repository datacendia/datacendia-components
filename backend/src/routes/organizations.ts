import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { cache } from '../config/redis.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

const updateOrgSchema = z.object({
  name: z.string().min(2).optional(),
  settings: z.record(z.unknown()).optional(),
});

/**
 * GET /api/v1/organizations/current
 * Get current organization
 */
router.get('/current', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.organizationId! },
    });

    if (!org) {
      throw errors.notFound('Organization');
    }

    res.json({
      success: true,
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        industry: org.industry,
        companySize: org.companySize,
        settings: org.settings,
        createdAt: org.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/organizations/current
 * Update organization (admin only)
 */
router.put('/current', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateOrgSchema.parse(req.body);

    const updated = await prisma.organization.update({
      where: { id: req.organizationId! },
      data: {
        name: data.name,
        settings: data.settings as Prisma.InputJsonValue,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: req.organizationId!,
        userId: req.user!.id,
        action: 'organization.update',
        resourceType: 'organization',
        resourceId: req.organizationId!,
        details: data as Prisma.InputJsonValue,
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        settings: updated.settings,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/organizations/current/teams
 * Get organization teams
 */
router.get('/current/teams', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await prisma.team.findMany({
      where: { organizationId: req.organizationId! },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: teams.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        memberCount: t._count.members,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/organizations/current/teams
 * Create team (admin only)
 */
router.post('/current/teams', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }).parse(req.body);

    const team = await prisma.team.create({
      data: {
        organizationId: req.organizationId!,
        name,
        description,
      },
    });

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/organizations/current/activity
 * Get organization activity log
 */
router.get('/current/activity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { organizationId: req.organizationId! },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.auditLog.count({ where: { organizationId: req.organizationId! } }),
    ]);

    res.json({
      success: true,
      data: logs.map(l => ({
        id: l.id,
        action: l.action,
        resourceType: l.resourceType,
        resourceId: l.resourceId,
        details: l.details,
        user: l.user,
        createdAt: l.createdAt,
      })),
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

export default router;
