// @ts-nocheck
// =============================================================================
// DATACENDIA FEATURE FLAGS - Powered by Unleash
// Toggle features dynamically without redeploying
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const UNLEASH_URL = 'http://localhost:4242/api';
const UNLEASH_TOKEN = 'cendia-admin-token';

// Feature flag definitions
export const FEATURE_FLAGS = {
  // Council Modes
  WAR_ROOM_MODE: 'council-war-room-mode',
  AGGRESSIVE_AGENTS: 'council-aggressive-agents',
  // Enterprise Features
  CHRONOS_ERP_INTEGRATION: 'chronos-erp-integration',
  GNOSIS_RAG_ENABLED: 'gnosis-rag-enabled',
  CRUCIBLE_MONTE_CARLO: 'crucible-monte-carlo',
  // Security Features
  ZERO_KNOWLEDGE_PROOFS: 'security-zk-proofs',
  REGULATOR_MODE: 'security-regulator-mode',
  // Experimental
  AI_SELF_IMPROVEMENT: 'experimental-apotheosis',
  DISSENT_PROTECTION: 'experimental-dissent'
} as const;
type FeatureFlag = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];

// Cache for feature flag values
const flagCache: Map<string, {
  value: boolean;
  timestamp: number;
}> = new Map();
const CACHE_TTL = 30000; // 30 seconds

/**
 * Check if a feature flag is enabled
 */
export async function isFeatureEnabled(flag: FeatureFlag): Promise<boolean> {
  // Check cache first
  const cached = flagCache.get(flag);
  if (stryMutAct_9fa48("15017") ? cached || Date.now() - cached.timestamp < CACHE_TTL : stryMutAct_9fa48("15016") ? false : stryMutAct_9fa48("15015") ? true : (stryCov_9fa48("15015", "15016", "15017"), cached && (stryMutAct_9fa48("15020") ? Date.now() - cached.timestamp >= CACHE_TTL : stryMutAct_9fa48("15019") ? Date.now() - cached.timestamp <= CACHE_TTL : stryMutAct_9fa48("15018") ? true : (stryCov_9fa48("15018", "15019", "15020"), (stryMutAct_9fa48("15021") ? Date.now() + cached.timestamp : (stryCov_9fa48("15021"), Date.now() - cached.timestamp)) < CACHE_TTL)))) {
    return cached.value;
  }
  try {
    const response = await fetch(`${UNLEASH_URL}/client/features/${flag}`, stryMutAct_9fa48("15025") ? {} : (stryCov_9fa48("15025"), {
      headers: stryMutAct_9fa48("15026") ? {} : (stryCov_9fa48("15026"), {
        'Authorization': UNLEASH_TOKEN,
        'Content-Type': 'application/json'
      })
    }));
    if (stryMutAct_9fa48("15030") ? false : stryMutAct_9fa48("15029") ? true : stryMutAct_9fa48("15028") ? response.ok : (stryCov_9fa48("15028", "15029", "15030"), !response.ok)) {
      console.warn(`[FeatureFlags] Failed to fetch flag ${flag}, using default`);
      return stryMutAct_9fa48("15033") ? true : (stryCov_9fa48("15033"), false);
    }
    const data = await response.json();
    const enabled = stryMutAct_9fa48("15034") ? data.enabled && false : (stryCov_9fa48("15034"), data.enabled ?? (stryMutAct_9fa48("15035") ? true : (stryCov_9fa48("15035"), false)));

    // Update cache
    flagCache.set(flag, stryMutAct_9fa48("15036") ? {} : (stryCov_9fa48("15036"), {
      value: enabled,
      timestamp: Date.now()
    }));
    return enabled;
  } catch (error) {
    console.warn(`[FeatureFlags] Error fetching flag ${flag}:`, error);
    return stryMutAct_9fa48("15039") ? true : (stryCov_9fa48("15039"), false);
  }
}

/**
 * Get all feature flags at once
 */
export async function getAllFeatureFlags(): Promise<Record<FeatureFlag, boolean>> {
  const flags: Record<string, boolean> = {};
  try {
    const response = await fetch(`${UNLEASH_URL}/client/features`, stryMutAct_9fa48("15043") ? {} : (stryCov_9fa48("15043"), {
      headers: stryMutAct_9fa48("15044") ? {} : (stryCov_9fa48("15044"), {
        'Authorization': UNLEASH_TOKEN,
        'Content-Type': 'application/json'
      })
    }));
    if (stryMutAct_9fa48("15047") ? false : stryMutAct_9fa48("15046") ? true : (stryCov_9fa48("15046", "15047"), response.ok)) {
      const data = await response.json();
      for (const feature of stryMutAct_9fa48("15051") ? data.features && [] : stryMutAct_9fa48("15050") ? false : stryMutAct_9fa48("15049") ? true : (stryCov_9fa48("15049", "15050", "15051"), data.features || (stryMutAct_9fa48("15052") ? ["Stryker was here"] : (stryCov_9fa48("15052"), [])))) {
        flags[feature.name] = stryMutAct_9fa48("15054") ? feature.enabled && false : (stryCov_9fa48("15054"), feature.enabled ?? (stryMutAct_9fa48("15055") ? true : (stryCov_9fa48("15055"), false)));
        flagCache.set(feature.name, stryMutAct_9fa48("15056") ? {} : (stryCov_9fa48("15056"), {
          value: feature.enabled,
          timestamp: Date.now()
        }));
      }
    }
  } catch (error) {
    console.warn('[FeatureFlags] Error fetching all flags:', error);
  }

  // Return with defaults for any missing flags
  return Object.fromEntries(Object.values(FEATURE_FLAGS).map(flag => [flag, flags[flag] ?? false])) as Record<FeatureFlag, boolean>;
}

/**
 * React hook for feature flags (simple version)
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  // For now, return true by default - in production, this would use React state
  // and the async isFeatureEnabled function
  return stryMutAct_9fa48("15060") ? false : (stryCov_9fa48("15060"), true);
}

/**
 * Open the Unleash dashboard
 */
export function openUnleashDashboard(): void {
  window.open('http://localhost:4242', '_blank');
}