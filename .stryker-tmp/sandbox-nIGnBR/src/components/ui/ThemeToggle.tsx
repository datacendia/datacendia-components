// @ts-nocheck
// =============================================================================
// THEME TOGGLE COMPONENT
// Elegant dark/light mode switcher
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
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../../lib/utils';
interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'icon' | 'dropdown' | 'switch';
}
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = stryMutAct_9fa48("6651") ? true : (stryCov_9fa48("6651"), false),
  variant = 'icon'
}) => {
  const {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  } = useTheme();
  if (stryMutAct_9fa48("6656") ? variant !== 'icon' : stryMutAct_9fa48("6655") ? false : stryMutAct_9fa48("6654") ? true : (stryCov_9fa48("6654", "6655", "6656"), variant === 'icon')) {
    return <button onClick={toggleTheme} className={cn('p-2 rounded-lg transition-colors', 'hover:bg-neutral-100 dark:hover:bg-neutral-800', 'text-neutral-600 dark:text-neutral-400', className)} title={`Switch to ${(stryMutAct_9fa48("6665") ? resolvedTheme !== 'dark' : stryMutAct_9fa48("6664") ? false : stryMutAct_9fa48("6663") ? true : (stryCov_9fa48("6663", "6664", "6665"), resolvedTheme === 'dark')) ? 'light' : 'dark'} mode`}>
        {(stryMutAct_9fa48("6671") ? resolvedTheme !== 'dark' : stryMutAct_9fa48("6670") ? false : stryMutAct_9fa48("6669") ? true : (stryCov_9fa48("6669", "6670", "6671"), resolvedTheme === 'dark')) ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        {stryMutAct_9fa48("6675") ? showLabel || <span className="ml-2 text-sm">
            {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
          </span> : stryMutAct_9fa48("6674") ? false : stryMutAct_9fa48("6673") ? true : (stryCov_9fa48("6673", "6674", "6675"), showLabel && <span className="ml-2 text-sm">
            {(stryMutAct_9fa48("6678") ? resolvedTheme !== 'dark' : stryMutAct_9fa48("6677") ? false : stryMutAct_9fa48("6676") ? true : (stryCov_9fa48("6676", "6677", "6678"), resolvedTheme === 'dark')) ? 'Light' : 'Dark'}
          </span>)}
      </button>;
  }
  if (stryMutAct_9fa48("6684") ? variant !== 'switch' : stryMutAct_9fa48("6683") ? false : stryMutAct_9fa48("6682") ? true : (stryCov_9fa48("6682", "6683", "6684"), variant === 'switch')) {
    return <div className={cn('flex items-center gap-2', className)}>
        <Sun className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
        <button onClick={toggleTheme} className={cn('relative w-12 h-6 rounded-full transition-colors', (stryMutAct_9fa48("6691") ? resolvedTheme !== 'dark' : stryMutAct_9fa48("6690") ? false : stryMutAct_9fa48("6689") ? true : (stryCov_9fa48("6689", "6690", "6691"), resolvedTheme === 'dark')) ? 'bg-cyan-600' : 'bg-neutral-300')}>
          <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-transform', (stryMutAct_9fa48("6698") ? resolvedTheme !== 'dark' : stryMutAct_9fa48("6697") ? false : stryMutAct_9fa48("6696") ? true : (stryCov_9fa48("6696", "6697", "6698"), resolvedTheme === 'dark')) ? 'left-7' : 'left-1')} />
        </button>
        <Moon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
      </div>;
  }

  // Dropdown variant
  return <div className={cn('relative', className)}>
      <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <button onClick={stryMutAct_9fa48("6703") ? () => undefined : (stryCov_9fa48("6703"), () => setTheme('light'))} className={cn('p-2 rounded-md transition-colors', (stryMutAct_9fa48("6708") ? theme !== 'light' : stryMutAct_9fa48("6707") ? false : stryMutAct_9fa48("6706") ? true : (stryCov_9fa48("6706", "6707", "6708"), theme === 'light')) ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300')} title="Light mode">
          <Sun className="w-4 h-4" />
        </button>
        <button onClick={stryMutAct_9fa48("6712") ? () => undefined : (stryCov_9fa48("6712"), () => setTheme('dark'))} className={cn('p-2 rounded-md transition-colors', (stryMutAct_9fa48("6717") ? theme !== 'dark' : stryMutAct_9fa48("6716") ? false : stryMutAct_9fa48("6715") ? true : (stryCov_9fa48("6715", "6716", "6717"), theme === 'dark')) ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300')} title="Dark mode">
          <Moon className="w-4 h-4" />
        </button>
        <button onClick={stryMutAct_9fa48("6721") ? () => undefined : (stryCov_9fa48("6721"), () => setTheme('system'))} className={cn('p-2 rounded-md transition-colors', (stryMutAct_9fa48("6726") ? theme !== 'system' : stryMutAct_9fa48("6725") ? false : stryMutAct_9fa48("6724") ? true : (stryCov_9fa48("6724", "6725", "6726"), theme === 'system')) ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300')} title="System preference">
          <Monitor className="w-4 h-4" />
        </button>
      </div>
    </div>;
};
export default ThemeToggle;