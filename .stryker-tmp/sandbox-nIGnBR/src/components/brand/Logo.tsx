/**
 * DATACENDIA BRAND LOGO
 * Uses the official logo.png from public folder
 * Represents: Sovereign Intelligence, Deliberation, Lineage, Ethics
 */
// @ts-nocheck
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
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

// Logo aspect ratio: 746x182 = ~4.1:1
const LOGO_ASPECT_RATIO = stryMutAct_9fa48("432") ? 746 * 182 : (stryCov_9fa48("432"), 746 / 182);
const sizes = stryMutAct_9fa48("433") ? {} : (stryCov_9fa48("433"), {
  sm: stryMutAct_9fa48("434") ? {} : (stryCov_9fa48("434"), {
    height: 32
  }),
  md: stryMutAct_9fa48("435") ? {} : (stryCov_9fa48("435"), {
    height: 40
  }),
  lg: stryMutAct_9fa48("436") ? {} : (stryCov_9fa48("436"), {
    height: 48
  }),
  xl: stryMutAct_9fa48("437") ? {} : (stryCov_9fa48("437"), {
    height: 64
  })
});
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = ''
}) => {
  const {
    height
  } = sizes[size];
  const width = Math.round(stryMutAct_9fa48("442") ? height / LOGO_ASPECT_RATIO : (stryCov_9fa48("442"), height * LOGO_ASPECT_RATIO));
  return <img src="/logo.png" alt="Datacendia" width={width} height={height} style={stryMutAct_9fa48("443") ? {} : (stryCov_9fa48("443"), {
    height: `${height}px`,
    width: `${width}px`
  })} className={className} />;
};

// Same logo for simple contexts
export const LogoSimple: React.FC<{
  size?: number;
  className?: string;
}> = ({
  size = 40,
  className = ''
}) => {
  const width = Math.round(stryMutAct_9fa48("448") ? size / LOGO_ASPECT_RATIO : (stryCov_9fa48("448"), size * LOGO_ASPECT_RATIO));
  return <img src="/logo.png" alt="Datacendia" width={width} height={size} style={stryMutAct_9fa48("449") ? {} : (stryCov_9fa48("449"), {
    height: `${size}px`,
    width: `${width}px`
  })} className={className} />;
};
export default Logo;