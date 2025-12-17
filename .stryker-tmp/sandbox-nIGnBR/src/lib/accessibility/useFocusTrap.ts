// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - FOCUS TRAP HOOK
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
import { useRef, useEffect, useCallback } from 'react';
import { FocusTrap } from './WCAGService';
export interface UseFocusTrapOptions {
  enabled?: boolean;
  returnFocusOnDeactivate?: boolean;
}

/**
 * Hook for trapping focus within a container (modals, dialogs)
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(options: UseFocusTrapOptions = {}) {
  const {
    enabled = stryMutAct_9fa48("10916") ? false : (stryCov_9fa48("10916"), true),
    returnFocusOnDeactivate = stryMutAct_9fa48("10917") ? false : (stryCov_9fa48("10917"), true)
  } = options;
  const containerRef = useRef<T>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);
  const previousActiveElementRef = useRef<Element | null>(null);
  const activate = useCallback(() => {
    if (stryMutAct_9fa48("10921") ? !containerRef.current && !enabled : stryMutAct_9fa48("10920") ? false : stryMutAct_9fa48("10919") ? true : (stryCov_9fa48("10919", "10920", "10921"), (stryMutAct_9fa48("10922") ? containerRef.current : (stryCov_9fa48("10922"), !containerRef.current)) || (stryMutAct_9fa48("10923") ? enabled : (stryCov_9fa48("10923"), !enabled)))) {
      return;
    }
    previousActiveElementRef.current = document.activeElement;
    focusTrapRef.current = new FocusTrap(containerRef.current);
    focusTrapRef.current.activate();
  }, stryMutAct_9fa48("10925") ? [] : (stryCov_9fa48("10925"), [enabled]));
  const deactivate = useCallback(() => {
    if (stryMutAct_9fa48("10928") ? false : stryMutAct_9fa48("10927") ? true : (stryCov_9fa48("10927", "10928"), focusTrapRef.current)) {
      focusTrapRef.current.deactivate();
      focusTrapRef.current = null;
    }
    if (stryMutAct_9fa48("10932") ? returnFocusOnDeactivate || previousActiveElementRef.current instanceof HTMLElement : stryMutAct_9fa48("10931") ? false : stryMutAct_9fa48("10930") ? true : (stryCov_9fa48("10930", "10931", "10932"), returnFocusOnDeactivate && previousActiveElementRef.current instanceof HTMLElement)) {
      previousActiveElementRef.current.focus();
    }
  }, stryMutAct_9fa48("10934") ? [] : (stryCov_9fa48("10934"), [returnFocusOnDeactivate]));
  useEffect(() => {
    if (stryMutAct_9fa48("10938") ? enabled || containerRef.current : stryMutAct_9fa48("10937") ? false : stryMutAct_9fa48("10936") ? true : (stryCov_9fa48("10936", "10937", "10938"), enabled && containerRef.current)) {
      activate();
    }
    return () => {
      deactivate();
    };
  }, stryMutAct_9fa48("10941") ? [] : (stryCov_9fa48("10941"), [enabled, activate, deactivate]));
  return stryMutAct_9fa48("10942") ? {} : (stryCov_9fa48("10942"), {
    ref: containerRef,
    activate,
    deactivate
  });
}