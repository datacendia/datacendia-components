import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { Prisma } from '@prisma/client';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { devAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(devAuth);

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  preferences: z.record(z.unknown()).optional(),
});

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']).default('VIEWER'),
  teams: z.array(z.string()).optional(),
  message: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

/**
 * GET /api/v1/users/me
 * Get current user
 */
router.get('/me', (req: Request, res: Response) => {
  const user = req.user!;

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      preferences: user.preferences,
      organizationId: user.organizationId,
      organization: {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      },
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    },
  });
});

/**
 * PUT /api/v1/users/me
 * Update current user
 */
router.put('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const userId = req.user!.id;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        preferences: data.preferences as Prisma.InputJsonValue,
      },
      include: { organization: true },
    });

    // Invalidate cache
    await cache.del(`user:${userId}`);

    res.json({
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        avatarUrl: updated.avatarUrl,
        role: updated.role,
        preferences: updated.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/me/password
 * Change password
 */
router.put('/me/password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const user = req.user!;

    if (!user.passwordHash) {
      throw errors.badRequest('Cannot change password for OAuth users');
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) {
      throw errors.unauthorized('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: 'user.password_changed',
        resourceType: 'user',
        resourceId: user.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'Password changed successfully' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/users
 * List organization users (admin only)
 */
router.get('/', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.organizationId!;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { organizationId: orgId, deletedAt: null },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where: { organizationId: orgId, deletedAt: null } }),
    ]);

    res.json({
      success: true,
      data: users,
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
 * POST /api/v1/users/invite
 * Invite new user (admin only)
 */
router.post('/invite', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role, teams } = inviteUserSchema.parse(req.body);
    const orgId = req.organizationId!;

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      throw errors.conflict('User with this email already exists');
    }

    // Create invited user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: email.split('@')[0],
        organizationId: orgId,
        role,
        status: 'INVITED',
      },
    });

    // Add to teams if specified
    if (teams && teams.length > 0) {
      await prisma.teamMember.createMany({
        data: teams.map(teamId => ({
          teamId,
          userId: user.id,
        })),
      });
    }

    // TODO: Send invitation email

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        userId: req.user!.id,
        action: 'user.invite',
        resourceType: 'user',
        resourceId: user.id,
        details: { email, role },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/:id/role
 * Update user role (admin only)
 */
router.put('/:id/role', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = z.object({ role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']) }).parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      throw errors.notFound('User');
    }

    if (user.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    // Cannot demote yourself
    if (user.id === req.user!.id && role !== req.user!.role) {
      throw errors.badRequest('Cannot change your own role');
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });

    // Invalidate cache
    await cache.del(`user:${user.id}`);

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: req.organizationId!,
        userId: req.user!.id,
        action: 'user.role_changed',
        resourceType: 'user',
        resourceId: user.id,
        details: { newRole: role, previousRole: user.role },
      },
    });

    res.json({
      success: true,
      data: {
        id: updated.id,
        role: updated.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/users/:id
 * Delete user (admin only)
 */
router.delete('/:id', requireRole('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      throw errors.notFound('User');
    }

    if (user.organizationId !== req.organizationId) {
      throw errors.forbidden();
    }

    // Cannot delete yourself
    if (user.id === req.user!.id) {
      throw errors.badRequest('Cannot delete your own account');
    }

    // Soft delete
    await prisma.user.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), status: 'DISABLED' },
    });

    // Invalidate cache
    await cache.del(`user:${user.id}`);

    // Audit log
    await prisma.auditLog.create({
      data: {
        organizationId: req.organizationId!,
        userId: req.user!.id,
        action: 'user.delete',
        resourceType: 'user',
        resourceId: user.id,
      },
    });

    res.json({
      success: true,
      data: { message: 'User deleted' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
