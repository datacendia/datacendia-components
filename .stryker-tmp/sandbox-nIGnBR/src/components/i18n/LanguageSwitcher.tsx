// @ts-nocheck
// =============================================================================
// DATACENDIA - LANGUAGE SWITCHER COMPONENT
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
import React, { useState, useRef, useEffect } from 'react';
import { useLocale, SupportedLocale } from '../../lib/i18n';
interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'flags' | 'compact';
  className?: string;
}
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = ''
}) => {
  const {
    locale,
    setLocale,
    availableLocales,
    localeConfig
  } = useLocale();
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("4689") ? true : (stryCov_9fa48("4689"), false));
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stryMutAct_9fa48("4694") ? dropdownRef.current || !dropdownRef.current.contains(event.target as Node) : stryMutAct_9fa48("4693") ? false : stryMutAct_9fa48("4692") ? true : (stryCov_9fa48("4692", "4693", "4694"), dropdownRef.current && (stryMutAct_9fa48("4695") ? dropdownRef.current.contains(event.target as Node) : (stryCov_9fa48("4695"), !dropdownRef.current.contains(event.target as Node))))) {
        setIsOpen(stryMutAct_9fa48("4697") ? true : (stryCov_9fa48("4697"), false));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return stryMutAct_9fa48("4699") ? () => undefined : (stryCov_9fa48("4699"), () => document.removeEventListener('mousedown', handleClickOutside));
  }, stryMutAct_9fa48("4701") ? ["Stryker was here"] : (stryCov_9fa48("4701"), []));
  const handleSelect = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(stryMutAct_9fa48("4703") ? true : (stryCov_9fa48("4703"), false));
  };

  // Compact variant - just flag and code
  if (stryMutAct_9fa48("4706") ? variant !== 'compact' : stryMutAct_9fa48("4705") ? false : stryMutAct_9fa48("4704") ? true : (stryCov_9fa48("4704", "4705", "4706"), variant === 'compact')) {
    return <div ref={dropdownRef} className={`relative ${className}`}>
        <button onClick={stryMutAct_9fa48("4710") ? () => undefined : (stryCov_9fa48("4710"), () => setIsOpen(stryMutAct_9fa48("4711") ? isOpen : (stryCov_9fa48("4711"), !isOpen)))} className="flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-neutral-100 transition-colors" aria-label="Select language">
          <span className="text-lg">{localeConfig.flag}</span>
          <span className="text-xs font-medium uppercase">{locale}</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {stryMutAct_9fa48("4714") ? isOpen || <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
            {availableLocales.map(loc => <button key={loc.code} onClick={() => handleSelect(loc.code)} className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors ${loc.code === locale ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'}`}>
                <span className="text-lg">{loc.flag}</span>
                <span className="text-sm">{loc.nativeName}</span>
              </button>)}
          </div> : stryMutAct_9fa48("4713") ? false : stryMutAct_9fa48("4712") ? true : (stryCov_9fa48("4712", "4713", "4714"), isOpen && <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
            {availableLocales.map(stryMutAct_9fa48("4715") ? () => undefined : (stryCov_9fa48("4715"), loc => <button key={loc.code} onClick={stryMutAct_9fa48("4716") ? () => undefined : (stryCov_9fa48("4716"), () => handleSelect(loc.code))} className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-neutral-50 transition-colors ${(stryMutAct_9fa48("4720") ? loc.code !== locale : stryMutAct_9fa48("4719") ? false : stryMutAct_9fa48("4718") ? true : (stryCov_9fa48("4718", "4719", "4720"), loc.code === locale)) ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'}`}>
                <span className="text-lg">{loc.flag}</span>
                <span className="text-sm">{loc.nativeName}</span>
              </button>))}
          </div>)}
      </div>;
  }

  // Flags variant - horizontal row of flags
  if (stryMutAct_9fa48("4725") ? variant !== 'flags' : stryMutAct_9fa48("4724") ? false : stryMutAct_9fa48("4723") ? true : (stryCov_9fa48("4723", "4724", "4725"), variant === 'flags')) {
    return <div className={`flex items-center gap-1 ${className}`}>
        {availableLocales.map(stryMutAct_9fa48("4729") ? () => undefined : (stryCov_9fa48("4729"), loc => <button key={loc.code} onClick={stryMutAct_9fa48("4730") ? () => undefined : (stryCov_9fa48("4730"), () => handleSelect(loc.code))} className={`p-1.5 rounded-md transition-all ${(stryMutAct_9fa48("4734") ? loc.code !== locale : stryMutAct_9fa48("4733") ? false : stryMutAct_9fa48("4732") ? true : (stryCov_9fa48("4732", "4733", "4734"), loc.code === locale)) ? 'bg-primary-100 ring-2 ring-primary-500' : 'hover:bg-neutral-100'}`} title={loc.nativeName} aria-label={`Switch to ${loc.name}`}>
            <span className="text-xl">{loc.flag}</span>
          </button>))}
      </div>;
  }

  // Default dropdown variant
  return <div ref={dropdownRef} className={`relative ${className}`}>
      <button onClick={stryMutAct_9fa48("4739") ? () => undefined : (stryCov_9fa48("4739"), () => setIsOpen(stryMutAct_9fa48("4740") ? isOpen : (stryCov_9fa48("4740"), !isOpen)))} className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 rounded-lg hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" aria-expanded={isOpen} aria-haspopup="listbox">
        <span className="text-xl">{localeConfig.flag}</span>
        <span className="text-sm font-medium text-neutral-700">{localeConfig.nativeName}</span>
        <svg className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {stryMutAct_9fa48("4746") ? isOpen || <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 max-h-80 overflow-y-auto" role="listbox">
          {availableLocales.map(loc => <button key={loc.code} onClick={() => handleSelect(loc.code)} role="option" aria-selected={loc.code === locale} className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-50 transition-colors ${loc.code === locale ? 'bg-primary-50' : ''}`}>
              <span className="text-xl">{loc.flag}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${loc.code === locale ? 'text-primary-600' : 'text-neutral-900'}`}>
                  {loc.nativeName}
                </p>
                <p className="text-xs text-neutral-500">{loc.name}</p>
              </div>
              {loc.code === locale && <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>}
            </button>)}
        </div> : stryMutAct_9fa48("4745") ? false : stryMutAct_9fa48("4744") ? true : (stryCov_9fa48("4744", "4745", "4746"), isOpen && <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 max-h-80 overflow-y-auto" role="listbox">
          {availableLocales.map(stryMutAct_9fa48("4747") ? () => undefined : (stryCov_9fa48("4747"), loc => <button key={loc.code} onClick={stryMutAct_9fa48("4748") ? () => undefined : (stryCov_9fa48("4748"), () => handleSelect(loc.code))} role="option" aria-selected={stryMutAct_9fa48("4751") ? loc.code !== locale : stryMutAct_9fa48("4750") ? false : stryMutAct_9fa48("4749") ? true : (stryCov_9fa48("4749", "4750", "4751"), loc.code === locale)} className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-50 transition-colors ${(stryMutAct_9fa48("4755") ? loc.code !== locale : stryMutAct_9fa48("4754") ? false : stryMutAct_9fa48("4753") ? true : (stryCov_9fa48("4753", "4754", "4755"), loc.code === locale)) ? 'bg-primary-50' : ''}`}>
              <span className="text-xl">{loc.flag}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${(stryMutAct_9fa48("4761") ? loc.code !== locale : stryMutAct_9fa48("4760") ? false : stryMutAct_9fa48("4759") ? true : (stryCov_9fa48("4759", "4760", "4761"), loc.code === locale)) ? 'text-primary-600' : 'text-neutral-900'}`}>
                  {loc.nativeName}
                </p>
                <p className="text-xs text-neutral-500">{loc.name}</p>
              </div>
              {stryMutAct_9fa48("4766") ? loc.code === locale || <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg> : stryMutAct_9fa48("4765") ? false : stryMutAct_9fa48("4764") ? true : (stryCov_9fa48("4764", "4765", "4766"), (stryMutAct_9fa48("4768") ? loc.code !== locale : stryMutAct_9fa48("4767") ? true : (stryCov_9fa48("4767", "4768"), loc.code === locale)) && <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>)}
            </button>))}
        </div>)}
    </div>;
};
export default LanguageSwitcher;