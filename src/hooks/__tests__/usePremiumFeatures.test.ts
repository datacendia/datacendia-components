// =============================================================================
// PREMIUM FEATURES HOOK TESTS
// Unit tests for usePremiumFeatures.ts
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePremiumFeatures } from '../usePremiumFeatures';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock premiumFeatures data
vi.mock('../../data/premiumFeatures', () => ({
  PREMIUM_FEATURES: [
    { id: 'audit-excellence', name: 'Audit Excellence' },
    { id: 'healthcare-pack', name: 'Healthcare Pack' },
    { id: 'finance-pack', name: 'Finance Pack' },
    { id: 'legal-pack', name: 'Legal Pack' },
    { id: 'agent-builder', name: 'Agent Builder' },
    { id: 'api-access', name: 'API Access' },
    { id: 'team-collaboration', name: 'Team Collaboration' },
    { id: 'unlimited-team', name: 'Unlimited Team' },
  ],
  PREMIUM_BUNDLES: [
    {
      id: 'enterprise-bundle',
      name: 'Enterprise Bundle',
      includedFeatures: ['audit-excellence', 'api-access', 'team-collaboration'],
    },
    {
      id: 'healthcare-bundle',
      name: 'Healthcare Bundle',
      includedFeatures: ['healthcare-pack', 'audit-excellence'],
    },
  ],
  getFeatureById: vi.fn((id: string) => {
    const features: Record<string, any> = {
      'audit-excellence': { id: 'audit-excellence', name: 'Audit Excellence', price: 99 },
      'healthcare-pack': { id: 'healthcare-pack', name: 'Healthcare Pack', price: 199 },
      'finance-pack': { id: 'finance-pack', name: 'Finance Pack', price: 199 },
      'legal-pack': { id: 'legal-pack', name: 'Legal Pack', price: 199 },
      'agent-builder': { id: 'agent-builder', name: 'Agent Builder', price: 149 },
      'api-access': { id: 'api-access', name: 'API Access', price: 79 },
      'team-collaboration': { id: 'team-collaboration', name: 'Team Collaboration', price: 49 },
    };
    return features[id];
  }),
  getBundleById: vi.fn((id: string) => {
    const bundles: Record<string, any> = {
      'enterprise-bundle': {
        id: 'enterprise-bundle',
        name: 'Enterprise Bundle',
        includedFeatures: ['audit-excellence', 'api-access', 'team-collaboration'],
      },
      'healthcare-bundle': {
        id: 'healthcare-bundle',
        name: 'Healthcare Bundle',
        includedFeatures: ['healthcare-pack', 'audit-excellence'],
      },
    };
    return bundles[id];
  }),
}));

// =============================================================================
// TESTS
// =============================================================================

describe('usePremiumFeatures', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty purchased features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.purchasedFeatures).toEqual([]);
      expect(result.current.purchasedBundles).toEqual([]);
    });

    it('should load state from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['audit-excellence'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.purchasedFeatures).toContain('audit-excellence');
    });

    it('should handle invalid localStorage data', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.purchasedFeatures).toEqual([]);
    });
  });

  describe('hasFeature', () => {
    it('should return true for purchased feature', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['audit-excellence'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasFeature('audit-excellence')).toBe(true);
    });

    it('should return false for unpurchased feature', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasFeature('audit-excellence')).toBe(false);
    });

    it('should return true for feature included in purchased bundle', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: [],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasFeature('audit-excellence')).toBe(true);
      expect(result.current.hasFeature('api-access')).toBe(true);
    });
  });

  describe('hasAgentAccess', () => {
    it('should return true for non-premium agents', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasAgentAccess('agent-strategist')).toBe(true);
    });

    it('should return false for premium agent without feature', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasAgentAccess('agent-ext-auditor')).toBe(false);
    });

    it('should return true for premium agent with feature', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['audit-excellence'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasAgentAccess('agent-ext-auditor')).toBe(true);
    });
  });

  describe('getAgentRequiredFeature', () => {
    it('should return undefined for non-premium agent', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.getAgentRequiredFeature('agent-strategist')).toBeUndefined();
    });

    it('should return feature for premium agent', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      const feature = result.current.getAgentRequiredFeature('agent-ext-auditor');
      expect(feature?.id).toBe('audit-excellence');
    });
  });

  describe('purchaseFeature', () => {
    it('should add feature to purchased list', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseFeature('audit-excellence');
      });

      expect(result.current.purchasedFeatures).toContain('audit-excellence');
    });

    it('should not duplicate features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseFeature('audit-excellence');
        result.current.purchaseFeature('audit-excellence');
      });

      expect(result.current.purchasedFeatures.filter((f) => f === 'audit-excellence')).toHaveLength(
        1
      );
    });

    it('should persist to localStorage', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseFeature('audit-excellence');
      });

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('purchaseBundle', () => {
    it('should add bundle and its features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseBundle('enterprise-bundle');
      });

      expect(result.current.purchasedBundles).toContain('enterprise-bundle');
      expect(result.current.purchasedFeatures).toContain('audit-excellence');
      expect(result.current.purchasedFeatures).toContain('api-access');
      expect(result.current.purchasedFeatures).toContain('team-collaboration');
    });

    it('should handle invalid bundle gracefully', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.purchaseBundle('invalid-bundle');
      });

      expect(result.current.purchasedBundles).not.toContain('invalid-bundle');
    });
  });

  describe('getUnlockedFeatures', () => {
    it('should return all unlocked features', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['finance-pack'],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      const unlocked = result.current.getUnlockedFeatures();
      expect(unlocked).toContain('finance-pack');
      expect(unlocked).toContain('audit-excellence');
      expect(unlocked).toContain('api-access');
    });

    it('should not have duplicates', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['audit-excellence'],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      const unlocked = result.current.getUnlockedFeatures();
      expect(unlocked.filter((f) => f === 'audit-excellence')).toHaveLength(1);
    });
  });

  describe('canCreateCustomAgents', () => {
    it('should return false without agent-builder', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.canCreateCustomAgents()).toBe(false);
    });

    it('should return true with agent-builder', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['agent-builder'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.canCreateCustomAgents()).toBe(true);
    });
  });

  describe('hasApiAccess', () => {
    it('should return false without api-access', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasApiAccess()).toBe(false);
    });

    it('should return true with api-access', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['api-access'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasApiAccess()).toBe(true);
    });
  });

  describe('hasTeamFeatures', () => {
    it('should return false without team features', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasTeamFeatures()).toBe(false);
    });

    it('should return true with team-collaboration', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['team-collaboration'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasTeamFeatures()).toBe(true);
    });

    it('should return true with unlimited-team', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['unlimited-team'],
          purchasedBundles: [],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      expect(result.current.hasTeamFeatures()).toBe(true);
    });
  });

  describe('resetPurchases', () => {
    it('should clear all purchases', () => {
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          purchasedFeatures: ['audit-excellence', 'api-access'],
          purchasedBundles: ['enterprise-bundle'],
        })
      );

      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.resetPurchases();
      });

      expect(result.current.purchasedFeatures).toEqual([]);
      expect(result.current.purchasedBundles).toEqual([]);
    });
  });

  describe('unlockAll', () => {
    it('should unlock all features and bundles', () => {
      const { result } = renderHook(() => usePremiumFeatures());

      act(() => {
        result.current.unlockAll();
      });

      expect(result.current.purchasedFeatures.length).toBeGreaterThan(0);
      expect(result.current.purchasedBundles.length).toBeGreaterThan(0);
    });
  });
});
