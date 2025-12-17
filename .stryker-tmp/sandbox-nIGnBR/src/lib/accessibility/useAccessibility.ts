// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - ACCESSIBILITY HOOK
// Provides accessibility preferences and utilities
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
import { prefersReducedMotion, prefersHighContrast, getPreferredColorScheme, onReducedMotionChange, wcagService } from './WCAGService';
export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  colorScheme: 'light' | 'dark' | 'high-contrast';
}
export interface UseAccessibilityReturn {
  preferences: AccessibilityPreferences;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  isInitialized: boolean;
}

/**
 * Hook for accessing accessibility features and preferences
 */
export function useAccessibility(): UseAccessibilityReturn {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(stryMutAct_9fa48("10860") ? {} : (stryCov_9fa48("10860"), {
    reducedMotion: stryMutAct_9fa48("10861") ? true : (stryCov_9fa48("10861"), false),
    highContrast: stryMutAct_9fa48("10862") ? true : (stryCov_9fa48("10862"), false),
    colorScheme: 'light'
  }));
  const [isInitialized, setIsInitialized] = useState(stryMutAct_9fa48("10864") ? true : (stryCov_9fa48("10864"), false));
  useEffect(() => {
    // Initialize preferences
    setPreferences(stryMutAct_9fa48("10866") ? {} : (stryCov_9fa48("10866"), {
      reducedMotion: prefersReducedMotion(),
      highContrast: prefersHighContrast(),
      colorScheme: getPreferredColorScheme()
    }));

    // Initialize WCAG service
    wcagService.initialize();
    setIsInitialized(stryMutAct_9fa48("10867") ? false : (stryCov_9fa48("10867"), true));

    // Listen for reduced motion changes
    const unsubscribe = onReducedMotionChange(prefersReduced => {
      setPreferences(stryMutAct_9fa48("10869") ? () => undefined : (stryCov_9fa48("10869"), prev => stryMutAct_9fa48("10870") ? {} : (stryCov_9fa48("10870"), {
        ...prev,
        reducedMotion: prefersReduced
      })));
    });

    // Listen for color scheme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = () => {
      setPreferences(stryMutAct_9fa48("10873") ? () => undefined : (stryCov_9fa48("10873"), prev => stryMutAct_9fa48("10874") ? {} : (stryCov_9fa48("10874"), {
        ...prev,
        colorScheme: getPreferredColorScheme()
      })));
    };
    darkModeQuery.addEventListener('change', handleColorSchemeChange);
    return () => {
      unsubscribe();
      darkModeQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, stryMutAct_9fa48("10878") ? ["Stryker was here"] : (stryCov_9fa48("10878"), []));
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    wcagService.announce(message, priority);
  }, stryMutAct_9fa48("10881") ? ["Stryker was here"] : (stryCov_9fa48("10881"), []));
  return stryMutAct_9fa48("10882") ? {} : (stryCov_9fa48("10882"), {
    preferences,
    announce,
    isInitialized
  });
}