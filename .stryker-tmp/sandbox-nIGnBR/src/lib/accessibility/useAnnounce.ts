// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - SCREEN READER ANNOUNCEMENT HOOK
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
import { useCallback, useRef } from 'react';
import { announceToScreenReader } from './WCAGService';

/**
 * Hook for making announcements to screen readers
 */
export function useAnnounce() {
  const queueRef = useRef<string[]>(stryMutAct_9fa48("10884") ? ["Stryker was here"] : (stryCov_9fa48("10884"), []));
  const isProcessingRef = useRef(stryMutAct_9fa48("10885") ? true : (stryCov_9fa48("10885"), false));
  const processQueue = useCallback(() => {
    if (stryMutAct_9fa48("10889") ? isProcessingRef.current && queueRef.current.length === 0 : stryMutAct_9fa48("10888") ? false : stryMutAct_9fa48("10887") ? true : (stryCov_9fa48("10887", "10888", "10889"), isProcessingRef.current || (stryMutAct_9fa48("10891") ? queueRef.current.length !== 0 : stryMutAct_9fa48("10890") ? false : (stryCov_9fa48("10890", "10891"), queueRef.current.length === 0)))) {
      return;
    }
    isProcessingRef.current = stryMutAct_9fa48("10893") ? false : (stryCov_9fa48("10893"), true);
    const message = queueRef.current.shift()!;
    announceToScreenReader(message, 'polite');
    setTimeout(() => {
      isProcessingRef.current = stryMutAct_9fa48("10896") ? true : (stryCov_9fa48("10896"), false);
      processQueue();
    }, 500);
  }, stryMutAct_9fa48("10897") ? ["Stryker was here"] : (stryCov_9fa48("10897"), []));
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (stryMutAct_9fa48("10902") ? priority !== 'assertive' : stryMutAct_9fa48("10901") ? false : stryMutAct_9fa48("10900") ? true : (stryCov_9fa48("10900", "10901", "10902"), priority === 'assertive')) {
      // Assertive messages bypass the queue
      announceToScreenReader(message, 'assertive');
    } else {
      queueRef.current.push(message);
      processQueue();
    }
  }, stryMutAct_9fa48("10907") ? [] : (stryCov_9fa48("10907"), [processQueue]));
  const announcePolite = useCallback((message: string) => {
    announce(message, 'polite');
  }, stryMutAct_9fa48("10910") ? [] : (stryCov_9fa48("10910"), [announce]));
  const announceAssertive = useCallback((message: string) => {
    announce(message, 'assertive');
  }, stryMutAct_9fa48("10913") ? [] : (stryCov_9fa48("10913"), [announce]));
  return stryMutAct_9fa48("10914") ? {} : (stryCov_9fa48("10914"), {
    announce,
    announcePolite,
    announceAssertive
  });
}