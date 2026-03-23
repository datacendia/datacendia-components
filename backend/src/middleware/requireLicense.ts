/**
 * Middleware — License Tier Enforcement
 *
 * Express middleware that gates routes by license tier and pillar.
 * Checks the authenticated user's organization license against required
 * pillars/tiers before allowing access to paid-tier endpoints.
 *
 * Usage:
 *   router.get('/collapse', requireLicense('stress_test'), handler);
 *   router.get('/comply', requireLicense('comply'), handler);
 *   router.get('/sovereign', requireLicense('sovereign'), handler);
 *   router.get('/verticals', requireTier('strategic'), handler);
 *
 * @module middleware/requireLicense
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { Request, Response, NextFunction } from 'express';
import { licensingService, LicenseTier } from '../services/licensing.service.js';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { offlineLicense } from '../services/sovereign/OfflineLicenseService.js';

interface OrgLicenseInfo {
  tier: LicenseTier;
  pillars: string[];
  licenseId: string;
  active: boolean;
}

// Tier hierarchy for comparison (higher index = higher tier)
const TIER_HIERARCHY: LicenseTier[] = ['pilot', 'foundation', 'enterprise', 'strategic', 'custom'];

/**
 * Cache key for org license lookups.
 * TTL: 5 minutes — balances responsiveness with DB load.
 */
function licenseCacheKey(orgId: string): string {
  return `license:org:${orgId}`;
}

/**
 * Resolve the active license for an organization.
 * Checks Redis cache first, then database, then in-memory store.
 */
async function resolveOrgLicense(orgId: string): Promise<OrgLicenseInfo | null> {
  // 1. Check Redis cache
  try {
    const cached = await cache.get<OrgLicenseInfo>(licenseCacheKey(orgId));
    if (cached) {
      return cached;
    }
  } catch { /* cache miss */ }

  // 2. Check tenant plan via organization → tenant relationship
  try {
    // Try to find a tenant that matches this org (tenant.slug or settings may map to orgId)
    const org = await prisma.organizations.findUnique({ where: { id: orgId } });
    if (org) {
      // Look for a tenant with an active license for this org
      const license = await prisma.licenses.findFirst({
        where: {
          status: 'ACTIVE',
          expires_at: { gt: new Date() },
          tenant: {
            OR: [
              { slug: org.slug },
              { name: org.name },
            ],
          },
        },
        include: { tenant: true },
        orderBy: { created_at: 'desc' },
      });

      if (license) {
        const tierStr = license.type.toLowerCase() as LicenseTier;
        const result: OrgLicenseInfo = {
          tier: tierStr,
          pillars: licensingService.getPillarsForTier(tierStr),
          licenseId: license.id,
          active: true,
        };

        // Cache for 5 minutes
        await cache.set(licenseCacheKey(orgId), result, 300).catch(() => {});
        return result;
      }

      // No license found — check if the tenant has a plan set directly
      const tenant = await prisma.tenants.findFirst({
        where: {
          OR: [
            { slug: org.slug },
            { name: org.name },
          ],
          status: 'ACTIVE',
        },
      });

      if (tenant) {
        const tierStr = tenant.plan.toLowerCase() as LicenseTier;
        const result: OrgLicenseInfo = {
          tier: tierStr,
          pillars: licensingService.getPillarsForTier(tierStr),
          licenseId: tenant.id,
          active: true,
        };
        await cache.set(licenseCacheKey(orgId), result, 300).catch(() => {});
        return result;
      }
    }
  } catch {
    // DB query failed — fall through to default
  }

  // 3. Check offline license file (air-gapped / sovereign deployments)
  if (offlineLicense.isValid) {
    const tier = offlineLicense.tier as LicenseTier;
    const result: OrgLicenseInfo = {
      tier,
      pillars: offlineLicense.pillars,
      licenseId: `offline:${offlineLicense.organizationId}`,
      active: true,
    };
    logger.debug(`[License] Resolved from offline license file (tier: ${tier})`);
    return result;
  }

  // 4. Default: allow pilot-level access for all authenticated orgs
  // This ensures the platform works during onboarding before a license is provisioned
  const defaultResult: OrgLicenseInfo = {
    tier: 'pilot' as LicenseTier,
    pillars: licensingService.getPillarsForTier('pilot'),
    licenseId: 'default',
    active: true,
  };

  await cache.set(licenseCacheKey(orgId), defaultResult, 300).catch(() => {});
  return defaultResult;
}

/**
 * Middleware factory: require a specific pillar to be licensed.
 *
 * @param requiredPillar - The pillar ID that must be in the org's license
 *   (e.g., 'stress_test', 'comply', 'govern', 'sovereign', 'operate',
 *    'collapse', 'sgas', 'verticals', 'frontier')
 */
export function requireLicense(requiredPillar: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.organizationId || req.user?.organizationId;

      if (!orgId) {
        res.status(401).json({
          error: 'Authentication required',
          code: 'LICENSE_NO_AUTH',
        });
        return;
      }

      const license = await resolveOrgLicense(orgId);

      if (!license || !license.active) {
        res.status(403).json({
          error: 'No active license found for this organization',
          code: 'LICENSE_NOT_FOUND',
          requiredPillar,
        });
        return;
      }

      if (!license.pillars.includes(requiredPillar)) {
        const requiredTier = getMinimumTierForPillar(requiredPillar);
        logger.info(
          `[License] Org ${orgId} (tier: ${license.tier}) blocked from ${requiredPillar} — requires ${requiredTier}`
        );

        res.status(403).json({
          error: `This feature requires the ${requiredTier} tier or higher`,
          code: 'LICENSE_TIER_INSUFFICIENT',
          currentTier: license.tier,
          requiredTier,
          requiredPillar,
          upgradeUrl: '/cortex/upgrade',
        });
        return;
      }

      // Track usage
      if (license.licenseId !== 'default') {
        licensingService.trackUsage(license.licenseId, 'apiCalls').catch(() => {});
      }

      next();
    } catch (error) {
      logger.error('[License] Middleware error:', error);
      // Fail open in case of errors — don't block legitimate requests due to license check failures
      next();
    }
  };
}

/**
 * Middleware factory: require a minimum tier level.
 *
 * @param minimumTier - The minimum tier required (e.g., 'foundation', 'enterprise', 'strategic')
 */
export function requireTier(minimumTier: LicenseTier) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgId = req.organizationId || req.user?.organizationId;

      if (!orgId) {
        res.status(401).json({ error: 'Authentication required', code: 'LICENSE_NO_AUTH' });
        return;
      }

      const license = await resolveOrgLicense(orgId);

      if (!license || !license.active) {
        res.status(403).json({
          error: 'No active license found',
          code: 'LICENSE_NOT_FOUND',
        });
        return;
      }

      const currentIdx = TIER_HIERARCHY.indexOf(license.tier);
      const requiredIdx = TIER_HIERARCHY.indexOf(minimumTier);

      if (currentIdx < requiredIdx) {
        res.status(403).json({
          error: `This feature requires the ${minimumTier} tier or higher`,
          code: 'LICENSE_TIER_INSUFFICIENT',
          currentTier: license.tier,
          requiredTier: minimumTier,
          upgradeUrl: '/cortex/upgrade',
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('[License] Tier check error:', error);
      next(); // Fail open
    }
  };
}

/**
 * Determine the minimum tier that includes a given pillar.
 */
function getMinimumTierForPillar(pillarId: string): string {
  const pillarTierMap: Record<string, string> = {
    council: 'pilot',
    decide: 'pilot',
    dcii: 'pilot',
    stress_test: 'enterprise',
    comply: 'enterprise',
    govern: 'enterprise',
    sovereign: 'enterprise',
    operate: 'enterprise',
    collapse: 'strategic',
    sgas: 'strategic',
    verticals: 'strategic',
    frontier: 'strategic',
  };
  return pillarTierMap[pillarId] || 'enterprise';
}
