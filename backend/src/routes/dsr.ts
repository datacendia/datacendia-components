/**
 * =============================================================================
 * GDPR DATA SUBJECT REQUEST (DSR) ENDPOINTS
 * =============================================================================
 * Implements GDPR Article 15-20 data subject rights:
 * - Right to Access (Article 15)
 * - Right to Erasure (Article 17)
 * - Right to Rectification (Article 16)
 * - Right to Portability (Article 20)
 * 
 * All endpoints require authentication + authorization (ADMIN/SUPER_ADMIN or self)
 * All actions are logged to audit_logs for compliance tracking
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { errors } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all DSR endpoints
router.use(authenticate);

/**
 * Authorization check: User can only access their own data unless they are ADMIN/SUPER_ADMIN
 */
const canAccessUserData = (req: Request, targetUserId: string): boolean => {
  const currentUser = req.user!;
  
  // User can access their own data
  if (currentUser.id === targetUserId) {
    return true;
  }
  
  // ADMIN and SUPER_ADMIN can access any user's data in their organization
  if (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') {
    return true;
  }
  
  return false;
};

/**
 * Create audit log entry for DSR action
 */
const logDSRAction = async (
  organizationId: string,
  userId: string,
  action: string,
  targetUserId: string,
  metadata?: any
): Promise<void> => {
  try {
    await prisma.audit_logs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        user_id: userId,
        action,
        resource_type: 'user',
        resource_id: targetUserId,
        metadata: metadata || {},
        created_at: new Date(),
      },
    });
  } catch (error) {
    logger.error('Failed to create DSR audit log', { error, action, targetUserId });
  }
};

/**
 * GET /api/v1/dsr/export/:userId
 * Right to Access: Export all user data
 */
router.get('/export/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    
    // Authorization check
    if (!canAccessUserData(req, targetUserId)) {
      throw errors.forbidden('You do not have permission to export this user\'s data');
    }
    
    // Fetch user data
    const user = await prisma.users.findUnique({
      where: { id: targetUserId },
      include: {
        organizations: true,
      },
    });
    
    if (!user) {
      throw errors.notFound('User');
    }
    
    // Verify organization match
    if (user.organization_id !== req.organizationId) {
      throw errors.forbidden('User belongs to a different organization');
    }
    
    // Collect all user data
    const [decisions, deliberations, auditLogs] = await Promise.all([
      prisma.decisions.findMany({
        where: { user_id: targetUserId },
      }),
      prisma.deliberations.findMany({
        where: { user_id: targetUserId },
      }),
      prisma.audit_logs.findMany({
        where: { user_id: targetUserId },
        orderBy: { created_at: 'desc' },
        take: 1000, // Limit to last 1000 audit logs
      }),
    ]);
    
    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        preferences: user.preferences,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login_at: user.last_login_at,
      },
      organization: {
        id: user.organizations.id,
        name: user.organizations.name,
        slug: user.organizations.slug,
      },
      decisions: decisions.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description,
        status: d.status,
        created_at: d.created_at,
        updated_at: d.updated_at,
      })),
      deliberations: deliberations.map(d => ({
        id: d.id,
        decision_id: d.decision_id,
        status: d.status,
        created_at: d.created_at,
        updated_at: d.updated_at,
      })),
      auditLogs: auditLogs.map(log => ({
        id: log.id,
        action: log.action,
        resource_type: log.resource_type,
        resource_id: log.resource_id,
        created_at: log.created_at,
      })),
      exportedAt: new Date().toISOString(),
      exportedBy: req.user!.id,
    };
    
    // Log the export action
    await logDSRAction(
      req.organizationId!,
      req.user!.id,
      'dsr.export',
      targetUserId,
      { recordCount: decisions.length + deliberations.length + auditLogs.length }
    );
    
    res.json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/dsr/delete/:userId
 * Right to Erasure: Hard delete user data and anonymize audit logs
 */
router.delete('/delete/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    
    // Authorization check - only ADMIN or SUPER_ADMIN can perform hard deletion
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'SUPER_ADMIN') {
      throw errors.forbidden('Only administrators can perform data erasure');
    }
    
    // Cannot delete yourself
    if (req.user!.id === targetUserId) {
      throw errors.badRequest('Cannot delete your own account');
    }
    
    // Fetch user data
    const user = await prisma.users.findUnique({
      where: { id: targetUserId },
    });
    
    if (!user) {
      throw errors.notFound('User');
    }
    
    // Verify organization match
    if (user.organization_id !== req.organizationId) {
      throw errors.forbidden('User belongs to a different organization');
    }
    
    // Begin transaction for hard deletion
    await prisma.$transaction(async (tx) => {
      // Anonymize audit logs (keep structure for compliance, replace PII)
      await tx.audit_logs.updateMany({
        where: { user_id: targetUserId },
        data: {
          metadata: { _redacted: true, original_user: '[REDACTED]' },
          user_id: 'REDACTED_USER',
        },
      });
      
      // Hard delete deliberations
      await tx.deliberations.deleteMany({
        where: { user_id: targetUserId },
      });
      
      // Hard delete decisions
      await tx.decisions.deleteMany({
        where: { user_id: targetUserId },
      });
      
      // Hard delete user
      await tx.users.delete({
        where: { id: targetUserId },
      });
    });
    
    // Invalidate cache
    await cache.del(`user:${targetUserId}`);
    
    // Log the deletion action (before user is deleted)
    await logDSRAction(
      req.organizationId!,
      req.user!.id,
      'dsr.delete',
      targetUserId,
      { userEmail: user.email }
    );
    
    res.json({
      success: true,
      data: { 
        message: 'User data permanently deleted and audit logs anonymized',
        deletedUserId: targetUserId,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/v1/dsr/rectify/:userId
 * Right to Rectification: Update user personal data
 */
const rectifyUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  preferences: z.record(z.unknown()).optional(),
});

router.patch('/rectify/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    
    // Authorization check
    if (!canAccessUserData(req, targetUserId)) {
      throw errors.forbidden('You do not have permission to rectify this user\'s data');
    }
    
    // Validate request body
    const data = rectifyUserSchema.parse(req.body);
    
    // Fetch user data
    const user = await prisma.users.findUnique({
      where: { id: targetUserId },
    });
    
    if (!user) {
      throw errors.notFound('User');
    }
    
    // Verify organization match
    if (user.organization_id !== req.organizationId) {
      throw errors.forbidden('User belongs to a different organization');
    }
    
    // If email is being changed, verify it's not already in use
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.users.findUnique({
        where: { email: data.email },
      });
      
      if (existingUser) {
        throw errors.badRequest('Email already in use');
      }
    }
    
    // Update user data
    const updated = await prisma.users.update({
      where: { id: targetUserId },
      data: {
        name: data.name,
        email: data.email,
        preferences: data.preferences,
        updated_at: new Date(),
      },
    });
    
    // Invalidate cache
    await cache.del(`user:${targetUserId}`);
    
    // Log the rectification action
    await logDSRAction(
      req.organizationId!,
      req.user!.id,
      'dsr.rectify',
      targetUserId,
      { fields: Object.keys(data) }
    );
    
    res.json({
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        preferences: updated.preferences,
        updated_at: updated.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/dsr/portable/:userId
 * Right to Portability: Export in machine-readable JSON format
 * (Similar to export but optimized for data portability to other systems)
 */
router.get('/portable/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.userId;
    
    // Authorization check
    if (!canAccessUserData(req, targetUserId)) {
      throw errors.forbidden('You do not have permission to export this user\'s data');
    }
    
    // Fetch user data
    const user = await prisma.users.findUnique({
      where: { id: targetUserId },
      include: {
        organizations: true,
      },
    });
    
    if (!user) {
      throw errors.notFound('User');
    }
    
    // Verify organization match
    if (user.organization_id !== req.organizationId) {
      throw errors.forbidden('User belongs to a different organization');
    }
    
    // Collect all user data for portability
    const [decisions, deliberations] = await Promise.all([
      prisma.decisions.findMany({
        where: { user_id: targetUserId },
      }),
      prisma.deliberations.findMany({
        where: { user_id: targetUserId },
      }),
    ]);
    
    // Format for portability (structured JSON that other systems can import)
    const portableData = {
      format: 'GDPR-Portable-v1',
      exported: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        preferences: user.preferences,
        created: user.created_at?.toISOString(),
        updated: user.updated_at?.toISOString(),
      },
      records: {
        decisions: decisions.map(d => ({
          id: d.id,
          title: d.title,
          description: d.description,
          status: d.status,
          created: d.created_at?.toISOString(),
          updated: d.updated_at?.toISOString(),
        })),
        deliberations: deliberations.map(d => ({
          id: d.id,
          decision_id: d.decision_id,
          status: d.status,
          created: d.created_at?.toISOString(),
          updated: d.updated_at?.toISOString(),
        })),
      },
    };
    
    // Log the portable export action
    await logDSRAction(
      req.organizationId!,
      req.user!.id,
      'dsr.portable',
      targetUserId
    );
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${targetUserId}-${Date.now()}.json"`);
    
    res.json(portableData);
  } catch (error) {
    next(error);
  }
});

export default router;
