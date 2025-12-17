// @ts-nocheck
// =============================================================================
// PREMIUM FEATURES HOOK
// Manages premium feature access and unlocking
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
import { useState, useEffect, useCallback } from 'react';
import { PREMIUM_FEATURES, PREMIUM_BUNDLES, getFeatureById, getBundleById, PremiumFeature, PremiumBundle } from '../data/premiumFeatures';

// Agent ID to Premium Feature mapping
const AGENT_FEATURE_MAP: Record<string, string> = stryMutAct_9fa48("9759") ? {} : (stryCov_9fa48("9759"), {
  // Audit Excellence Pack
  'agent-ext-auditor': 'audit-excellence',
  'agent-int-auditor': 'audit-excellence',
  // Healthcare Industry Pack
  'agent-cmio': 'healthcare-pack',
  'agent-pso': 'healthcare-pack',
  'agent-hco': 'healthcare-pack',
  'agent-cod': 'healthcare-pack',
  // Finance Industry Pack
  'agent-quant': 'finance-pack',
  'agent-pm': 'finance-pack',
  'agent-cro-finance': 'finance-pack',
  'agent-treasury': 'finance-pack',
  // Legal Industry Pack
  'agent-contracts': 'legal-pack',
  'agent-ip': 'legal-pack',
  'agent-litigation': 'legal-pack',
  'agent-regulatory': 'legal-pack'
});
interface PremiumState {
  purchasedFeatures: string[];
  purchasedBundles: string[];
}
const STORAGE_KEY = 'datacendia_premium_state';
export function usePremiumFeatures() {
  const [state, setState] = useState<PremiumState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (stryMutAct_9fa48("9778") ? false : stryMutAct_9fa48("9777") ? true : (stryCov_9fa48("9777", "9778"), saved)) {
      try {
        return JSON.parse(saved);
      } catch {
        return stryMutAct_9fa48("9782") ? {} : (stryCov_9fa48("9782"), {
          purchasedFeatures: stryMutAct_9fa48("9783") ? ["Stryker was here"] : (stryCov_9fa48("9783"), []),
          purchasedBundles: stryMutAct_9fa48("9784") ? ["Stryker was here"] : (stryCov_9fa48("9784"), [])
        });
      }
    }
    return stryMutAct_9fa48("9785") ? {} : (stryCov_9fa48("9785"), {
      purchasedFeatures: stryMutAct_9fa48("9786") ? ["Stryker was here"] : (stryCov_9fa48("9786"), []),
      purchasedBundles: stryMutAct_9fa48("9787") ? ["Stryker was here"] : (stryCov_9fa48("9787"), [])
    });
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, stryMutAct_9fa48("9789") ? [] : (stryCov_9fa48("9789"), [state]));

  // Check if a specific feature is unlocked
  const hasFeature = useCallback((featureId: string): boolean => {
    // Direct feature purchase
    if (stryMutAct_9fa48("9792") ? false : stryMutAct_9fa48("9791") ? true : (stryCov_9fa48("9791", "9792"), state.purchasedFeatures.includes(featureId))) {
      return stryMutAct_9fa48("9794") ? false : (stryCov_9fa48("9794"), true);
    }
    // Check if any purchased bundle includes this feature
    for (const bundleId of state.purchasedBundles) {
      const bundle = getBundleById(bundleId);
      if (stryMutAct_9fa48("9798") ? bundle.includedFeatures.includes(featureId) : stryMutAct_9fa48("9797") ? false : stryMutAct_9fa48("9796") ? true : (stryCov_9fa48("9796", "9797", "9798"), bundle?.includedFeatures.includes(featureId))) {
        return stryMutAct_9fa48("9800") ? false : (stryCov_9fa48("9800"), true);
      }
    }
    return stryMutAct_9fa48("9801") ? true : (stryCov_9fa48("9801"), false);
  }, stryMutAct_9fa48("9802") ? [] : (stryCov_9fa48("9802"), [state]));

  // Check if a premium agent is accessible
  const hasAgentAccess = useCallback((agentId: string): boolean => {
    const requiredFeature = AGENT_FEATURE_MAP[agentId];
    if (stryMutAct_9fa48("9806") ? false : stryMutAct_9fa48("9805") ? true : stryMutAct_9fa48("9804") ? requiredFeature : (stryCov_9fa48("9804", "9805", "9806"), !requiredFeature)) {
      // Not a premium agent, or no mapping exists
      return stryMutAct_9fa48("9808") ? false : (stryCov_9fa48("9808"), true);
    }
    return hasFeature(requiredFeature);
  }, stryMutAct_9fa48("9809") ? [] : (stryCov_9fa48("9809"), [hasFeature]));

  // Get the required feature for an agent
  const getAgentRequiredFeature = useCallback((agentId: string): PremiumFeature | undefined => {
    const featureId = AGENT_FEATURE_MAP[agentId];
    if (stryMutAct_9fa48("9813") ? false : stryMutAct_9fa48("9812") ? true : stryMutAct_9fa48("9811") ? featureId : (stryCov_9fa48("9811", "9812", "9813"), !featureId)) {
      return undefined;
    }
    return getFeatureById(featureId);
  }, stryMutAct_9fa48("9815") ? ["Stryker was here"] : (stryCov_9fa48("9815"), []));

  // Purchase a feature
  const purchaseFeature = useCallback((featureId: string) => {
    setState(stryMutAct_9fa48("9817") ? () => undefined : (stryCov_9fa48("9817"), prev => stryMutAct_9fa48("9818") ? {} : (stryCov_9fa48("9818"), {
      ...prev,
      purchasedFeatures: stryMutAct_9fa48("9819") ? [] : (stryCov_9fa48("9819"), [...new Set(stryMutAct_9fa48("9820") ? [] : (stryCov_9fa48("9820"), [...prev.purchasedFeatures, featureId]))])
    })));
  }, stryMutAct_9fa48("9821") ? ["Stryker was here"] : (stryCov_9fa48("9821"), []));

  // Purchase a bundle
  const purchaseBundle = useCallback((bundleId: string) => {
    const bundle = getBundleById(bundleId);
    if (stryMutAct_9fa48("9824") ? false : stryMutAct_9fa48("9823") ? true : (stryCov_9fa48("9823", "9824"), bundle)) {
      setState(stryMutAct_9fa48("9826") ? () => undefined : (stryCov_9fa48("9826"), prev => stryMutAct_9fa48("9827") ? {} : (stryCov_9fa48("9827"), {
        purchasedBundles: stryMutAct_9fa48("9828") ? [] : (stryCov_9fa48("9828"), [...new Set(stryMutAct_9fa48("9829") ? [] : (stryCov_9fa48("9829"), [...prev.purchasedBundles, bundleId]))]),
        purchasedFeatures: stryMutAct_9fa48("9830") ? [] : (stryCov_9fa48("9830"), [...new Set(stryMutAct_9fa48("9831") ? [] : (stryCov_9fa48("9831"), [...prev.purchasedFeatures, ...bundle.includedFeatures]))])
      })));
    }
  }, stryMutAct_9fa48("9832") ? ["Stryker was here"] : (stryCov_9fa48("9832"), []));

  // Get all unlocked features
  const getUnlockedFeatures = useCallback((): string[] => {
    const unlocked = new Set(state.purchasedFeatures);
    for (const bundleId of state.purchasedBundles) {
      const bundle = getBundleById(bundleId);
      stryMutAct_9fa48("9835") ? bundle.includedFeatures.forEach(f => unlocked.add(f)) : (stryCov_9fa48("9835"), bundle?.includedFeatures.forEach(stryMutAct_9fa48("9836") ? () => undefined : (stryCov_9fa48("9836"), f => unlocked.add(f))));
    }
    return Array.from(unlocked);
  }, stryMutAct_9fa48("9837") ? [] : (stryCov_9fa48("9837"), [state]));

  // Check if Agent Builder is unlocked (for custom agents)
  const canCreateCustomAgents = useCallback((): boolean => {
    return hasFeature('agent-builder');
  }, stryMutAct_9fa48("9840") ? [] : (stryCov_9fa48("9840"), [hasFeature]));

  // Check if API Access is unlocked
  const hasApiAccess = useCallback((): boolean => {
    return hasFeature('api-access');
  }, stryMutAct_9fa48("9843") ? [] : (stryCov_9fa48("9843"), [hasFeature]));

  // Check if Team Collaboration is unlocked
  const hasTeamFeatures = useCallback((): boolean => {
    return stryMutAct_9fa48("9847") ? hasFeature('team-collaboration') && hasFeature('unlimited-team') : stryMutAct_9fa48("9846") ? false : stryMutAct_9fa48("9845") ? true : (stryCov_9fa48("9845", "9846", "9847"), hasFeature('team-collaboration') || hasFeature('unlimited-team'));
  }, stryMutAct_9fa48("9850") ? [] : (stryCov_9fa48("9850"), [hasFeature]));

  // Reset all purchases (for testing)
  const resetPurchases = useCallback(() => {
    setState(stryMutAct_9fa48("9852") ? {} : (stryCov_9fa48("9852"), {
      purchasedFeatures: stryMutAct_9fa48("9853") ? ["Stryker was here"] : (stryCov_9fa48("9853"), []),
      purchasedBundles: stryMutAct_9fa48("9854") ? ["Stryker was here"] : (stryCov_9fa48("9854"), [])
    }));
  }, stryMutAct_9fa48("9855") ? ["Stryker was here"] : (stryCov_9fa48("9855"), []));

  // Unlock all features (demo mode)
  const unlockAll = useCallback(() => {
    setState(stryMutAct_9fa48("9857") ? {} : (stryCov_9fa48("9857"), {
      purchasedFeatures: PREMIUM_FEATURES.map(stryMutAct_9fa48("9858") ? () => undefined : (stryCov_9fa48("9858"), f => f.id)),
      purchasedBundles: PREMIUM_BUNDLES.map(stryMutAct_9fa48("9859") ? () => undefined : (stryCov_9fa48("9859"), b => b.id))
    }));
  }, stryMutAct_9fa48("9860") ? ["Stryker was here"] : (stryCov_9fa48("9860"), []));
  return stryMutAct_9fa48("9861") ? {} : (stryCov_9fa48("9861"), {
    // State
    purchasedFeatures: state.purchasedFeatures,
    purchasedBundles: state.purchasedBundles,
    // Feature checks
    hasFeature,
    hasAgentAccess,
    getAgentRequiredFeature,
    getUnlockedFeatures,
    // Specific feature checks
    canCreateCustomAgents,
    hasApiAccess,
    hasTeamFeatures,
    // Actions
    purchaseFeature,
    purchaseBundle,
    resetPurchases,
    unlockAll
  });
}
export default usePremiumFeatures;