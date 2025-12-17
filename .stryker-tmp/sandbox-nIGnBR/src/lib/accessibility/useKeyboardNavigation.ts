// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - KEYBOARD NAVIGATION HOOK
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
import { useRef, useEffect, useCallback, RefObject } from 'react';
import { KEYBOARD_KEYS, createArrowKeyHandler } from './WCAGService';
export interface UseKeyboardNavigationOptions {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  selector?: string;
  onSelect?: (element: HTMLElement, index: number) => void;
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation in lists, menus, and other composite widgets
 */
export function useKeyboardNavigation<T extends HTMLElement = HTMLElement>(options: UseKeyboardNavigationOptions = {}): {
  containerRef: RefObject<T>;
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrevious: () => void;
} {
  const {
    orientation = 'vertical',
    loop = stryMutAct_9fa48("10945") ? false : (stryCov_9fa48("10945"), true),
    selector = '[tabindex="0"], button:not([disabled]), a[href], input:not([disabled])',
    onSelect,
    enabled = stryMutAct_9fa48("10947") ? false : (stryCov_9fa48("10947"), true)
  } = options;
  const containerRef = useRef<T>(null);
  const getItems = useCallback((): HTMLElement[] => {
    if (stryMutAct_9fa48("10951") ? false : stryMutAct_9fa48("10950") ? true : stryMutAct_9fa48("10949") ? containerRef.current : (stryCov_9fa48("10949", "10950", "10951"), !containerRef.current)) {
      return stryMutAct_9fa48("10953") ? ["Stryker was here"] : (stryCov_9fa48("10953"), []);
    }
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(selector));
  }, stryMutAct_9fa48("10954") ? [] : (stryCov_9fa48("10954"), [selector]));
  const focusFirst = useCallback(() => {
    const items = getItems();
    stryMutAct_9fa48("10956") ? items[0].focus() : (stryCov_9fa48("10956"), items[0]?.focus());
  }, stryMutAct_9fa48("10957") ? [] : (stryCov_9fa48("10957"), [getItems]));
  const focusLast = useCallback(() => {
    const items = getItems();
    stryMutAct_9fa48("10959") ? items[items.length - 1].focus() : (stryCov_9fa48("10959"), items[stryMutAct_9fa48("10960") ? items.length + 1 : (stryCov_9fa48("10960"), items.length - 1)]?.focus());
  }, stryMutAct_9fa48("10961") ? [] : (stryCov_9fa48("10961"), [getItems]));
  const focusNext = useCallback(() => {
    const items = getItems();
    const currentIndex = items.findIndex(stryMutAct_9fa48("10963") ? () => undefined : (stryCov_9fa48("10963"), item => stryMutAct_9fa48("10966") ? item !== document.activeElement : stryMutAct_9fa48("10965") ? false : stryMutAct_9fa48("10964") ? true : (stryCov_9fa48("10964", "10965", "10966"), item === document.activeElement)));
    let nextIndex = stryMutAct_9fa48("10967") ? currentIndex - 1 : (stryCov_9fa48("10967"), currentIndex + 1);
    if (stryMutAct_9fa48("10970") ? loop || nextIndex >= items.length : stryMutAct_9fa48("10969") ? false : stryMutAct_9fa48("10968") ? true : (stryCov_9fa48("10968", "10969", "10970"), loop && (stryMutAct_9fa48("10973") ? nextIndex < items.length : stryMutAct_9fa48("10972") ? nextIndex > items.length : stryMutAct_9fa48("10971") ? true : (stryCov_9fa48("10971", "10972", "10973"), nextIndex >= items.length)))) {
      nextIndex = 0;
    } else {
      nextIndex = stryMutAct_9fa48("10976") ? Math.max(nextIndex, items.length - 1) : (stryCov_9fa48("10976"), Math.min(nextIndex, stryMutAct_9fa48("10977") ? items.length + 1 : (stryCov_9fa48("10977"), items.length - 1)));
    }
    stryMutAct_9fa48("10978") ? items[nextIndex].focus() : (stryCov_9fa48("10978"), items[nextIndex]?.focus());
  }, stryMutAct_9fa48("10979") ? [] : (stryCov_9fa48("10979"), [getItems, loop]));
  const focusPrevious = useCallback(() => {
    const items = getItems();
    const currentIndex = items.findIndex(stryMutAct_9fa48("10981") ? () => undefined : (stryCov_9fa48("10981"), item => stryMutAct_9fa48("10984") ? item !== document.activeElement : stryMutAct_9fa48("10983") ? false : stryMutAct_9fa48("10982") ? true : (stryCov_9fa48("10982", "10983", "10984"), item === document.activeElement)));
    let prevIndex = stryMutAct_9fa48("10985") ? currentIndex + 1 : (stryCov_9fa48("10985"), currentIndex - 1);
    if (stryMutAct_9fa48("10988") ? loop || prevIndex < 0 : stryMutAct_9fa48("10987") ? false : stryMutAct_9fa48("10986") ? true : (stryCov_9fa48("10986", "10987", "10988"), loop && (stryMutAct_9fa48("10991") ? prevIndex >= 0 : stryMutAct_9fa48("10990") ? prevIndex <= 0 : stryMutAct_9fa48("10989") ? true : (stryCov_9fa48("10989", "10990", "10991"), prevIndex < 0)))) {
      prevIndex = stryMutAct_9fa48("10993") ? items.length + 1 : (stryCov_9fa48("10993"), items.length - 1);
    } else {
      prevIndex = stryMutAct_9fa48("10995") ? Math.min(prevIndex, 0) : (stryCov_9fa48("10995"), Math.max(prevIndex, 0));
    }
    stryMutAct_9fa48("10996") ? items[prevIndex].focus() : (stryCov_9fa48("10996"), items[prevIndex]?.focus());
  }, stryMutAct_9fa48("10997") ? [] : (stryCov_9fa48("10997"), [getItems, loop]));
  useEffect(() => {
    if (stryMutAct_9fa48("11001") ? !enabled && !containerRef.current : stryMutAct_9fa48("11000") ? false : stryMutAct_9fa48("10999") ? true : (stryCov_9fa48("10999", "11000", "11001"), (stryMutAct_9fa48("11002") ? enabled : (stryCov_9fa48("11002"), !enabled)) || (stryMutAct_9fa48("11003") ? containerRef.current : (stryCov_9fa48("11003"), !containerRef.current)))) {
      return;
    }
    const container = containerRef.current;
    const items = getItems();
    const handler = createArrowKeyHandler(items, stryMutAct_9fa48("11005") ? {} : (stryCov_9fa48("11005"), {
      orientation,
      loop,
      onSelect
    }));
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle escape key
      if (stryMutAct_9fa48("11009") ? event.key !== KEYBOARD_KEYS.ESCAPE : stryMutAct_9fa48("11008") ? false : stryMutAct_9fa48("11007") ? true : (stryCov_9fa48("11007", "11008", "11009"), event.key === KEYBOARD_KEYS.ESCAPE)) {
        stryMutAct_9fa48("11011") ? (document.activeElement as HTMLElement).blur() : (stryCov_9fa48("11011"), (document.activeElement as HTMLElement)?.blur());
        return;
      }
      handler(event);
    };
    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, stryMutAct_9fa48("11015") ? [] : (stryCov_9fa48("11015"), [enabled, getItems, orientation, loop, onSelect]));
  return stryMutAct_9fa48("11016") ? {} : (stryCov_9fa48("11016"), {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious
  });
}