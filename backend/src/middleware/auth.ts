import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';
import { config } from '../config/index.js';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { errors } from './errorHandler.js';
import { User, Organization } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User & { organization: Organization };
      organizationId?: string;
    }
  }
}

interface JWTPayload {
  sub: string;
  email: string;
  organizationId: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = new TextEncoder().encode(config.jwtSecret);

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw errors.unauthorized('No token provided');
    }

    const token = authHeader.substring(7);

    // Verify token
    const { payload } = await jose.jwtVerify(token, JWT_SECRET) as { payload: JWTPayload };

    // Check if token is in blacklist (logged out tokens)
    const isBlacklisted = await cache.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      throw errors.unauthorized('Token has been revoked');
    }

    // Try to get user from cache
    const cacheKey = `user:${payload.sub}`;
    let user = await cache.get<User & { organization: Organization }>(cacheKey);

    if (!user) {
      // Fetch from database
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.sub },
        include: { organization: true },
      });

      if (!dbUser || dbUser.status !== 'ACTIVE' || dbUser.deletedAt) {
        throw errors.unauthorized('User not found or inactive');
      }

      user = dbUser;
      
      // Cache for 5 minutes
      await cache.set(cacheKey, user, 300);
    }

    req.user = user;
    req.organizationId = user.organizationId;
    
    next();
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      next(errors.unauthorized('Token has expired'));
    } else if (error instanceof jose.errors.JWTInvalid) {
      next(errors.unauthorized('Invalid token'));
    } else {
      next(error);
    }
  }
};

/**
 * Check if user has required role
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(errors.unauthorized());
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(errors.forbidden('Insufficient permissions'));
      return;
    }

    next();
  };
};

/**
 * Development mode authentication bypass
 * Creates a demo user context when no token is provided
 */
export const devAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  // If token provided, use real auth
  if (authHeader?.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  
  // In development, use real seeded organization
  if (process.env.NODE_ENV !== 'production') {
    // Try to get the seeded admin user
    const adminUser = await prisma.users.findUnique({
      where: { email: 'admin@datacendia.com' },
      include: { organizations: true },
    });
    
    if (adminUser) {
      req.user = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        organizationId: adminUser.organization_id,
        status: adminUser.status,
        createdAt: adminUser.created_at,
        updatedAt: adminUser.updated_at,
        organization: adminUser.organizations,
      } as any;
      req.organizationId = adminUser.organization_id;
    } else {
      const demoOrg = await prisma.organizations.upsert({
        where: { slug: 'demo' },
        update: {},
        create: {
          id: 'demo-org-id',
          name: 'Demo Organization',
          slug: 'demo',
          settings: {},
          updated_at: new Date(),
        },
      });

      const demoUser = await prisma.users.upsert({
        where: { email: 'demo@datacendia.com' },
        update: {},
        create: {
          id: 'demo-user-id',
          organization_id: demoOrg.id,
          email: 'demo@datacendia.com',
          password_hash: null,
          name: 'Demo User',
          role: 'ADMIN',
          status: 'ACTIVE',
          preferences: {},
          updated_at: new Date(),
        },
      });

      req.user = {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        organizationId: demoUser.organization_id,
        status: demoUser.status,
        createdAt: demoUser.created_at,
        updatedAt: demoUser.updated_at,
        organization: demoOrg,
      } as any;
      req.organizationId = demoOrg.id;
    }
    return next();
  }
  
  // In production, require auth
  throw errors.unauthorized('No token provided');
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  // Try to authenticate but don't fail
  authenticate(req, res, (err) => {
    // Ignore auth errors for optional auth
    next();
  });
};

/**
 * Generate access token
 */
export const generateAccessToken = async (user: {
  id: string;
  email: string;
  organizationId: string;
  role: string;
}): Promise<string> => {
  const token = await new jose.SignJWT({
    sub: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwtExpiresIn)
    .sign(JWT_SECRET);

  return token;
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = async (userId: string): Promise<string> => {
  const REFRESH_SECRET = new TextEncoder().encode(config.jwtRefreshSecret);
  
  const token = await new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(config.jwtRefreshExpiresIn)
    .sign(REFRESH_SECRET);

  return token;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = async (token: string): Promise<string> => {
  const REFRESH_SECRET = new TextEncoder().encode(config.jwtRefreshSecret);
  
  try {
    const { payload } = await jose.jwtVerify(token, REFRESH_SECRET);
    return payload.sub as string;
  } catch {
    throw errors.unauthorized('Invalid refresh token');
  }
};

export default authenticate;
