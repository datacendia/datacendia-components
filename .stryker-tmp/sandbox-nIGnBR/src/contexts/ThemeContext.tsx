// @ts-nocheck
// =============================================================================
// DATACENDIA THEME CONTEXT
// Dark/Light mode toggle with system preference detection
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
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';
interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'datacendia-theme';
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (stryMutAct_9fa48("8618") ? typeof window === 'undefined' : stryMutAct_9fa48("8617") ? false : stryMutAct_9fa48("8616") ? true : (stryCov_9fa48("8616", "8617", "8618"), typeof window !== 'undefined')) {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return stryMutAct_9fa48("8623") ? stored && 'system' : stryMutAct_9fa48("8622") ? false : stryMutAct_9fa48("8621") ? true : (stryCov_9fa48("8621", "8622", "8623"), stored || 'system');
    }
    return 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Resolve system preference
  const resolveTheme = useCallback((themeValue: Theme): ResolvedTheme => {
    if (stryMutAct_9fa48("8630") ? themeValue !== 'system' : stryMutAct_9fa48("8629") ? false : stryMutAct_9fa48("8628") ? true : (stryCov_9fa48("8628", "8629", "8630"), themeValue === 'system')) {
      if (stryMutAct_9fa48("8635") ? typeof window === 'undefined' : stryMutAct_9fa48("8634") ? false : stryMutAct_9fa48("8633") ? true : (stryCov_9fa48("8633", "8634", "8635"), typeof window !== 'undefined')) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return themeValue;
  }, stryMutAct_9fa48("8642") ? ["Stryker was here"] : (stryCov_9fa48("8642"), []));

  // Update resolved theme and apply to document
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);

    // Apply to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Also set data attribute for components that need it
    root.setAttribute('data-theme', resolved);
  }, stryMutAct_9fa48("8647") ? [] : (stryCov_9fa48("8647"), [theme, resolveTheme]));

  // Listen for system preference changes
  useEffect(() => {
    if (stryMutAct_9fa48("8651") ? theme === 'system' : stryMutAct_9fa48("8650") ? false : stryMutAct_9fa48("8649") ? true : (stryCov_9fa48("8649", "8650", "8651"), theme !== 'system')) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return stryMutAct_9fa48("8662") ? () => undefined : (stryCov_9fa48("8662"), () => mediaQuery.removeEventListener('change', handler));
  }, stryMutAct_9fa48("8664") ? [] : (stryCov_9fa48("8664"), [theme]));
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, stryMutAct_9fa48("8666") ? ["Stryker was here"] : (stryCov_9fa48("8666"), []));
  const toggleTheme = useCallback(() => {
    const newTheme = (stryMutAct_9fa48("8670") ? resolvedTheme !== 'dark' : stryMutAct_9fa48("8669") ? false : stryMutAct_9fa48("8668") ? true : (stryCov_9fa48("8668", "8669", "8670"), resolvedTheme === 'dark')) ? 'light' : 'dark';
    setTheme(newTheme);
  }, stryMutAct_9fa48("8674") ? [] : (stryCov_9fa48("8674"), [resolvedTheme, setTheme]));
  return <ThemeContext.Provider value={stryMutAct_9fa48("8675") ? {} : (stryCov_9fa48("8675"), {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  })}>
      {children}
    </ThemeContext.Provider>;
};
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (stryMutAct_9fa48("8679") ? false : stryMutAct_9fa48("8678") ? true : stryMutAct_9fa48("8677") ? context : (stryCov_9fa48("8677", "8678", "8679"), !context)) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for conditional dark mode classes
export const useDarkMode = () => {
  const {
    resolvedTheme
  } = useTheme();
  return stryMutAct_9fa48("8685") ? resolvedTheme !== 'dark' : stryMutAct_9fa48("8684") ? false : stryMutAct_9fa48("8683") ? true : (stryCov_9fa48("8683", "8684", "8685"), resolvedTheme === 'dark');
};
export default ThemeContext;