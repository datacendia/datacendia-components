// =============================================================================
// PREMIUM FEATURES HOOK
// Manages premium feature access and unlocking
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { 
  PREMIUM_FEATURES, 
  PREMIUM_BUNDLES, 
  getFeatureById,
  getBundleById,
  PremiumFeature,
  PremiumBundle 
} from '../data/premiumFeatures';

// Agent ID to Premium Feature mapping
const AGENT_FEATURE_MAP: Record<string, string> = {
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
  'agent-regulatory': 'legal-pack',
};

interface PremiumState {
  purchasedFeatures: string[];
  purchasedBundles: string[];
}

const STORAGE_KEY = 'datacendia_premium_state';

export function usePremiumFeatures() {
  const [state, setState] = useState<PremiumState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { purchasedFeatures: [], purchasedBundles: [] };
      }
    }
    return { purchasedFeatures: [], purchasedBundles: [] };
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Check if a specific feature is unlocked
  const hasFeature = useCallback((featureId: string): boolean => {
    // Direct feature purchase
    if (state.purchasedFeatures.includes(featureId)) {
      return true;
    }
    // Check if any purchased bundle includes this feature
    for (const bundleId of state.purchasedBundles) {
      const bundle = getBundleById(bundleId);
      if (bundle?.includedFeatures.includes(featureId)) {
        return true;
      }
    }
    return false;
  }, [state]);

  // Check if a premium agent is accessible
  const hasAgentAccess = useCallback((agentId: string): boolean => {
    const requiredFeature = AGENT_FEATURE_MAP[agentId];
    if (!requiredFeature) {
      // Not a premium agent, or no mapping exists
      return true;
    }
    return hasFeature(requiredFeature);
  }, [hasFeature]);

  // Get the required feature for an agent
  const getAgentRequiredFeature = useCallback((agentId: string): PremiumFeature | undefined => {
    const featureId = AGENT_FEATURE_MAP[agentId];
    if (!featureId) {return undefined;}
    return getFeatureById(featureId);
  }, []);

  // Purchase a feature
  const purchaseFeature = useCallback((featureId: string) => {
    setState(prev => ({
      ...prev,
      purchasedFeatures: [...new Set([...prev.purchasedFeatures, featureId])]
    }));
  }, []);

  // Purchase a bundle
  const purchaseBundle = useCallback((bundleId: string) => {
    const bundle = getBundleById(bundleId);
    if (bundle) {
      setState(prev => ({
        purchasedBundles: [...new Set([...prev.purchasedBundles, bundleId])],
        purchasedFeatures: [...new Set([...prev.purchasedFeatures, ...bundle.includedFeatures])]
      }));
    }
  }, []);

  // Get all unlocked features
  const getUnlockedFeatures = useCallback((): string[] => {
    const unlocked = new Set(state.purchasedFeatures);
    for (const bundleId of state.purchasedBundles) {
      const bundle = getBundleById(bundleId);
      bundle?.includedFeatures.forEach(f => unlocked.add(f));
    }
    return Array.from(unlocked);
  }, [state]);

  // Check if Agent Builder is unlocked (for custom agents)
  const canCreateCustomAgents = useCallback((): boolean => {
    return hasFeature('agent-builder');
  }, [hasFeature]);

  // Check if API Access is unlocked
  const hasApiAccess = useCallback((): boolean => {
    return hasFeature('api-access');
  }, [hasFeature]);

  // Check if Team Collaboration is unlocked
  const hasTeamFeatures = useCallback((): boolean => {
    return hasFeature('team-collaboration') || hasFeature('unlimited-team');
  }, [hasFeature]);

  // Reset all purchases (for testing)
  const resetPurchases = useCallback(() => {
    setState({ purchasedFeatures: [], purchasedBundles: [] });
  }, []);

  // Unlock all features (demo mode)
  const unlockAll = useCallback(() => {
    setState({
      purchasedFeatures: PREMIUM_FEATURES.map(f => f.id),
      purchasedBundles: PREMIUM_BUNDLES.map(b => b.id),
    });
  }, []);

  return {
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
    unlockAll,
  };
}

export default usePremiumFeatures;
