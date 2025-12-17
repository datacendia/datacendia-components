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
const AGENT_FEATURE_MAP: Record<string, string> = stryMutAct_9fa48("0") ? {} : (stryCov_9fa48("0"), {
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
    if (stryMutAct_9fa48("19") ? false : stryMutAct_9fa48("18") ? true : (stryCov_9fa48("18", "19"), saved)) {
      try {
        return JSON.parse(saved);
      } catch {
        return stryMutAct_9fa48("23") ? {} : (stryCov_9fa48("23"), {
          purchasedFeatures: stryMutAct_9fa48("24") ? ["Stryker was here"] : (stryCov_9fa48("24"), []),
          purchasedBundles: stryMutAct_9fa48("25") ? ["Stryker was here"] : (stryCov_9fa48("25"), [])
        });
      }
    }
    return stryMutAct_9fa48("26") ? {} : (stryCov_9fa48("26"), {
      purchasedFeatures: stryMutAct_9fa48("27") ? ["Stryker was here"] : (stryCov_9fa48("27"), []),
      purchasedBundles: stryMutAct_9fa48("28") ? ["Stryker was here"] : (stryCov_9fa48("28"), [])
    });
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, stryMutAct_9fa48("30") ? [] : (stryCov_9fa48("30"), [state]));

  // Check if a specific feature is unlocked
  const hasFeature = useCallback((featureId: string): boolean => {
    // Direct feature purchase
    if (stryMutAct_9fa48("33") ? false : stryMutAct_9fa48("32") ? true : (stryCov_9fa48("32", "33"), state.purchasedFeatures.includes(featureId))) {
      return stryMutAct_9fa48("35") ? false : (stryCov_9fa48("35"), true);
    }
    // Check if any purchased bundle includes this feature
    for (const bundleId of state.purchasedBundles) {
      const bundle = getBundleById(bundleId);
      if (stryMutAct_9fa48("39") ? bundle.includedFeatures.includes(featureId) : stryMutAct_9fa48("38") ? false : stryMutAct_9fa48("37") ? true : (stryCov_9fa48("37", "38", "39"), bundle?.includedFeatures.includes(featureId))) {
        return stryMutAct_9fa48("41") ? false : (stryCov_9fa48("41"), true);
      }
    }
    return stryMutAct_9fa48("42") ? true : (stryCov_9fa48("42"), false);
  }, stryMutAct_9fa48("43") ? [] : (stryCov_9fa48("43"), [state]));

  // Check if a premium agent is accessible
  const hasAgentAccess = useCallback((agentId: string): boolean => {
    const requiredFeature = AGENT_FEATURE_MAP[agentId];
    if (stryMutAct_9fa48("47") ? false : stryMutAct_9fa48("46") ? true : stryMutAct_9fa48("45") ? requiredFeature : (stryCov_9fa48("45", "46", "47"), !requiredFeature)) {
      // Not a premium agent, or no mapping exists
      return stryMutAct_9fa48("49") ? false : (stryCov_9fa48("49"), true);
    }
    return hasFeature(requiredFeature);
  }, stryMutAct_9fa48("50") ? [] : (stryCov_9fa48("50"), [hasFeature]));

  // Get the required feature for an agent
  const getAgentRequiredFeature = useCallback((agentId: string): PremiumFeature | undefined => {
    const featureId = AGENT_FEATURE_MAP[agentId];
    if (stryMutAct_9fa48("54") ? false : stryMutAct_9fa48("53") ? true : stryMutAct_9fa48("52") ? featureId : (stryCov_9fa48("52", "53", "54"), !featureId)) {
      return undefined;
    }
    return getFeatureById(featureId);
  }, stryMutAct_9fa48("56") ? ["Stryker was here"] : (stryCov_9fa48("56"), []));

  // Purchase a feature
  const purchaseFeature = useCallback((featureId: string) => {
    setState(stryMutAct_9fa48("58") ? () => undefined : (stryCov_9fa48("58"), prev => stryMutAct_9fa48("59") ? {} : (stryCov_9fa48("59"), {
      ...prev,
      purchasedFeatures: stryMutAct_9fa48("60") ? [] : (stryCov_9fa48("60"), [...new Set(stryMutAct_9fa48("61") ? [] : (stryCov_9fa48("61"), [...prev.purchasedFeatures, featureId]))])
    })));
  }, stryMutAct_9fa48("62") ? ["Stryker was here"] : (stryCov_9fa48("62"), []));

  // Purchase a bundle
  const purchaseBundle = useCallback((bundleId: string) => {
    const bundle = getBundleById(bundleId);
    if (stryMutAct_9fa48("65") ? false : stryMutAct_9fa48("64") ? true : (stryCov_9fa48("64", "65"), bundle)) {
      setState(stryMutAct_9fa48("67") ? () => undefined : (stryCov_9fa48("67"), prev => stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
        purchasedBundles: stryMutAct_9fa48("69") ? [] : (stryCov_9fa48("69"), [...new Set(stryMutAct_9fa48("70") ? [] : (stryCov_9fa48("70"), [...prev.purchasedBundles, bundleId]))]),
        purchasedFeatures: stryMutAct_9fa48("71") ? [] : (stryCov_9fa48("71"), [...new Set(stryMutAct_9fa48("72") ? [] : (stryCov_9fa48("72"), [...prev.purchasedFeatures, ...bundle.includedFeatures]))])
      })));
    }
  }, stryMutAct_9fa48("73") ? ["Stryker was here"] : (stryCov_9fa48("73"), []));

  // Get all unlocked features
  const getUnlockedFeatures = useCallback((): string[] => {
    const unlocked = new Set(state.purchasedFeatures);
    for (const bundleId of state.purchasedBundles) {
      const bundle = getBundleById(bundleId);
      stryMutAct_9fa48("76") ? bundle.includedFeatures.forEach(f => unlocked.add(f)) : (stryCov_9fa48("76"), bundle?.includedFeatures.forEach(stryMutAct_9fa48("77") ? () => undefined : (stryCov_9fa48("77"), f => unlocked.add(f))));
    }
    return Array.from(unlocked);
  }, stryMutAct_9fa48("78") ? [] : (stryCov_9fa48("78"), [state]));

  // Check if Agent Builder is unlocked (for custom agents)
  const canCreateCustomAgents = useCallback((): boolean => {
    return hasFeature('agent-builder');
  }, stryMutAct_9fa48("81") ? [] : (stryCov_9fa48("81"), [hasFeature]));

  // Check if API Access is unlocked
  const hasApiAccess = useCallback((): boolean => {
    return hasFeature('api-access');
  }, stryMutAct_9fa48("84") ? [] : (stryCov_9fa48("84"), [hasFeature]));

  // Check if Team Collaboration is unlocked
  const hasTeamFeatures = useCallback((): boolean => {
    return stryMutAct_9fa48("88") ? hasFeature('team-collaboration') && hasFeature('unlimited-team') : stryMutAct_9fa48("87") ? false : stryMutAct_9fa48("86") ? true : (stryCov_9fa48("86", "87", "88"), hasFeature('team-collaboration') || hasFeature('unlimited-team'));
  }, stryMutAct_9fa48("91") ? [] : (stryCov_9fa48("91"), [hasFeature]));

  // Reset all purchases (for testing)
  const resetPurchases = useCallback(() => {
    setState(stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
      purchasedFeatures: stryMutAct_9fa48("94") ? ["Stryker was here"] : (stryCov_9fa48("94"), []),
      purchasedBundles: stryMutAct_9fa48("95") ? ["Stryker was here"] : (stryCov_9fa48("95"), [])
    }));
  }, stryMutAct_9fa48("96") ? ["Stryker was here"] : (stryCov_9fa48("96"), []));

  // Unlock all features (demo mode)
  const unlockAll = useCallback(() => {
    setState(stryMutAct_9fa48("98") ? {} : (stryCov_9fa48("98"), {
      purchasedFeatures: PREMIUM_FEATURES.map(stryMutAct_9fa48("99") ? () => undefined : (stryCov_9fa48("99"), f => f.id)),
      purchasedBundles: PREMIUM_BUNDLES.map(stryMutAct_9fa48("100") ? () => undefined : (stryCov_9fa48("100"), b => b.id))
    }));
  }, stryMutAct_9fa48("101") ? ["Stryker was here"] : (stryCov_9fa48("101"), []));
  return stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
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