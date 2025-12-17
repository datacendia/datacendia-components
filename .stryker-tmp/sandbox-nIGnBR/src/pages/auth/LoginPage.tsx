// @ts-nocheck
// =============================================================================
// DATACENDIA - LOGIN PAGE (Fully Internationalized)
// =============================================================================

// File: src/pages/auth/LoginPage.tsx
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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { authApi } from '../../lib/api';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    t
  } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(stryMutAct_9fa48("19665") ? true : (stryCov_9fa48("19665"), false));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19666") ? true : (stryCov_9fa48("19666"), false));
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(stryMutAct_9fa48("19670") ? false : (stryCov_9fa48("19670"), true));
    try {
      // Call real backend API
      const response = await authApi.login(stryMutAct_9fa48("19672") ? {} : (stryCov_9fa48("19672"), {
        email,
        password
      }));
      if (stryMutAct_9fa48("19674") ? false : stryMutAct_9fa48("19673") ? true : (stryCov_9fa48("19673", "19674"), response.success)) {
        navigate('/cortex/dashboard');
      } else {
        setError(stryMutAct_9fa48("19680") ? response.error?.message && t('auth.login.errors.invalidCredentials') : stryMutAct_9fa48("19679") ? false : stryMutAct_9fa48("19678") ? true : (stryCov_9fa48("19678", "19679", "19680"), (stryMutAct_9fa48("19681") ? response.error.message : (stryCov_9fa48("19681"), response.error?.message)) || t('auth.login.errors.invalidCredentials')));
      }
    } catch (err) {
      setError(t('auth.login.errors.networkError'));
    } finally {
      setIsLoading(stryMutAct_9fa48("19686") ? true : (stryCov_9fa48("19686"), false));
    }
  };
  const handleEnterpriseSSO = (method: 'ad' | 'saml' | 'oidc' | 'cert') => {
    // In production, this would redirect to the configured IdP
    console.log(`Enterprise SSO: ${method}`);
    // Example: window.location.href = `/api/v1/auth/sso/${method}`;
  };
  return <div className="min-h-screen flex bg-sovereign-base">
      {/* Left Panel - Sovereign Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sovereign-elevated border-r border-sovereign-border-subtle p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crimson-900/30 rounded-lg flex items-center justify-center border border-crimson-800/50">
              <span className="text-crimson-400 font-bold text-xl">D</span>
            </div>
            <span className="text-white text-xl font-semibold tracking-wider">DATACENDIA</span>
          </div>
        </div>
        
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-[0.3em] mb-4">Sovereign Intelligence Platform</p>
          <h1 className="text-3xl font-light text-white mb-6 leading-relaxed">
            We do not host your data.<br />
            <span className="relative">
              We return your mind
              <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-crimson-900/0 via-crimson-800 to-crimson-900/0" />
            </span>.
          </h1>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <div className="text-center">
              <div className="text-2xl font-light text-white">11</div>
              <div className="text-[10px] uppercase tracking-wider">Deployments</div>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-light text-white">2,847</div>
              <div className="text-[10px] uppercase tracking-wider">Decisions</div>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div className="text-center">
              <div className="text-2xl font-light text-white">31</div>
              <div className="text-[10px] uppercase tracking-wider">Frameworks</div>
            </div>
          </div>
        </div>
        
        <div className="text-gray-600 text-xs">
          Air-gapped operation · No external dependencies · Your infrastructure
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-crimson-900/30 rounded-lg flex items-center justify-center border border-crimson-800/50">
              <span className="text-crimson-400 font-bold text-xl">D</span>
            </div>
            <span className="text-white text-xl font-semibold tracking-wider">DATACENDIA</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white">{t('auth.login.title')}</h2>
            <p className="text-gray-500 mt-2">{t('auth.login.subtitle')}</p>
          </div>

          {/* Enterprise Identity - On-Premise */}
          <div className="mb-6">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-3 text-center">Enterprise Identity</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={stryMutAct_9fa48("19691") ? () => undefined : (stryCov_9fa48("19691"), () => handleEnterpriseSSO('ad'))} className="flex items-center justify-center gap-2 h-11 px-3 bg-sovereign-card border border-sovereign-border rounded-lg hover:bg-sovereign-hover hover:border-cyan-500/50 transition-colors">
                <span className="text-lg">🏢</span>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-300 block">Active Directory</span>
                  <span className="text-[10px] text-gray-600">LDAP / Kerberos</span>
                </div>
              </button>
              <button onClick={stryMutAct_9fa48("19693") ? () => undefined : (stryCov_9fa48("19693"), () => handleEnterpriseSSO('saml'))} className="flex items-center justify-center gap-2 h-11 px-3 bg-sovereign-card border border-sovereign-border rounded-lg hover:bg-sovereign-hover hover:border-cyan-500/50 transition-colors">
                <span className="text-lg">🔐</span>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-300 block">SAML 2.0</span>
                  <span className="text-[10px] text-gray-600">ADFS / Okta / Ping</span>
                </div>
              </button>
              <button onClick={stryMutAct_9fa48("19695") ? () => undefined : (stryCov_9fa48("19695"), () => handleEnterpriseSSO('oidc'))} className="flex items-center justify-center gap-2 h-11 px-3 bg-sovereign-card border border-sovereign-border rounded-lg hover:bg-sovereign-hover hover:border-cyan-500/50 transition-colors">
                <span className="text-lg">🔑</span>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-300 block">OIDC</span>
                  <span className="text-[10px] text-gray-600">Keycloak / Dex</span>
                </div>
              </button>
              <button onClick={stryMutAct_9fa48("19697") ? () => undefined : (stryCov_9fa48("19697"), () => handleEnterpriseSSO('cert'))} className="flex items-center justify-center gap-2 h-11 px-3 bg-sovereign-card border border-sovereign-border rounded-lg hover:bg-sovereign-hover hover:border-cyan-500/50 transition-colors">
                <span className="text-lg">🛡️</span>
                <div className="text-left">
                  <span className="text-xs font-medium text-gray-300 block">Certificate</span>
                  <span className="text-[10px] text-gray-600">PKI / Smart Card</span>
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sovereign-border-subtle" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-sovereign-base text-sm text-gray-600">or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {stryMutAct_9fa48("19701") ? error || <div role="alert" data-testid="error-message" className="p-3 bg-crimson-900/20 border border-crimson-800/50 rounded-lg text-sm text-crimson-400">
                {error}
              </div> : stryMutAct_9fa48("19700") ? false : stryMutAct_9fa48("19699") ? true : (stryCov_9fa48("19699", "19700", "19701"), error && <div role="alert" data-testid="error-message" className="p-3 bg-crimson-900/20 border border-crimson-800/50 rounded-lg text-sm text-crimson-400">
                {error}
              </div>)}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                {t('auth.login.email')}
              </label>
              <input id="email" data-testid="email-input" type="email" value={email} onChange={stryMutAct_9fa48("19703") ? () => undefined : (stryCov_9fa48("19703"), e => setEmail(e.target.value))} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="you@company.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                {t('auth.login.password')}
              </label>
              <input id="password" data-testid="password-input" type="password" value={password} onChange={stryMutAct_9fa48("19705") ? () => undefined : (stryCov_9fa48("19705"), e => setPassword(e.target.value))} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="••••••••" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={stryMutAct_9fa48("19706") ? () => undefined : (stryCov_9fa48("19706"), e => setRememberMe(e.target.checked))} className="w-4 h-4 rounded border-gray-600 bg-sovereign-card text-cyan-500 focus:ring-cyan-500" />
                <span className="text-sm text-gray-400">{t('auth.login.rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-cyan-500 hover:text-cyan-400">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <button type="submit" data-testid="login-button" disabled={isLoading} className={cn('w-full h-11 bg-cyan-600 text-white font-medium rounded-lg', 'hover:bg-cyan-500 transition-colors', 'disabled:opacity-50 disabled:cursor-not-allowed', 'flex items-center justify-center')}>
              {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t('auth.login.submitButton')}
            </button>
          </form>

          {/* Request Access Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have access?{' '}
              <Link to="/" className="text-crimson-400 hover:text-crimson-300">
                Request Access →
              </Link>
            </p>
          </div>

          {/* Language Selector */}
          <div className="mt-8 flex justify-center">
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>
    </div>;
};
export default LoginPage;