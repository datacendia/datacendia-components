/**
 * Rate Limiting Middleware
 * 
 * Provides configurable rate limiting for API endpoints.
 * Uses in-memory storage by default, Redis for production.
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;           // Time window in milliseconds
  maxRequests: number;        // Max requests per window
  keyGenerator?: (req: Request) => string;  // Custom key generator
  skipFailedRequests?: boolean;  // Don't count failed requests
  message?: string;           // Custom error message
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production)
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 60000); // Clean every minute

// Default key generator: IP address + user ID if available
const defaultKeyGenerator = (req: Request): string => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userId = (req as any).user?.id || 'anonymous';
  return `${ip}:${userId}`;
};

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = defaultKeyGenerator,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later.',
  } = config;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    let entry = store.get(key);
    
    if (!entry || entry.resetAt < now) {
      // New window
      entry = {
        count: 1,
        resetAt: now + windowMs,
      };
      store.set(key, entry);
    } else {
      entry.count++;
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000));

    if (entry.count > maxRequests) {
      res.status(429).json({
        error: 'rate_limit_exceeded',
        message,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
      return;
    }

    // Optionally skip counting failed requests
    if (skipFailedRequests) {
      res.on('finish', () => {
        if (res.statusCode >= 400) {
          entry!.count--;
        }
      });
    }

    next();
  };
}

// =============================================================================
// PRESET CONFIGURATIONS
// =============================================================================

/**
 * Standard API rate limit: 100 requests per minute
 */
export const standardRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: 'API rate limit exceeded. Please wait before making more requests.',
});

/**
 * Heavy operations rate limit: 10 requests per minute
 * Use for: Council deliberations, Monte Carlo, large exports
 */
export const heavyRateLimit = rateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Heavy operation rate limit exceeded. Please wait before submitting more requests.',
});

/**
 * Auth rate limit: 5 attempts per 15 minutes
 * Use for: Login, password reset, registration
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  skipFailedRequests: false, // Count failed attempts
  message: 'Too many authentication attempts. Please try again later.',
});

/**
 * Upload rate limit: 20 files per hour
 * Use for: Document uploads, file ingestion
 */
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 20,
  message: 'Upload limit reached. Please wait before uploading more files.',
});

/**
 * Export rate limit: 5 exports per hour
 * Use for: Court-admissible exports, large data exports
 */
export const exportRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: 'Export limit reached. Please wait before requesting more exports.',
});

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// In your routes file:

import { 
  standardRateLimit, 
  heavyRateLimit, 
  authRateLimit,
  uploadRateLimit,
  exportRateLimit 
} from '../middleware/rateLimit';

// Apply to specific routes
router.post('/council/deliberate', heavyRateLimit, councilController.deliberate);
router.post('/auth/login', authRateLimit, authController.login);
router.post('/documents/upload', uploadRateLimit, documentController.upload);
router.post('/chronos/export', exportRateLimit, chronosController.export);

// Or apply globally
app.use('/api', standardRateLimit);

// Custom rate limit for specific endpoint
router.get('/search', rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  maxRequests: 30,
  keyGenerator: (req) => `search:${req.ip}`,
  message: 'Search rate limit exceeded.',
}), searchController.search);
*/

// =============================================================================
// REDIS ADAPTER (For Production)
// =============================================================================

/*
// To use Redis instead of in-memory:

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function redisRateLimit(config: RateLimitConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `ratelimit:${config.keyGenerator?.(req) || defaultKeyGenerator(req)}`;
    
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.pexpire(key, config.windowMs);
    }
    
    const ttl = await redis.pttl(key);
    
    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.maxRequests - current));
    res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + ttl) / 1000));
    
    if (current > config.maxRequests) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: config.message,
        retryAfter: Math.ceil(ttl / 1000),
      });
    }
    
    next();
  };
}
*/

export default rateLimit;
