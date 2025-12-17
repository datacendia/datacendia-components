// @ts-nocheck
// =============================================================================
// DATACENDIA - FORGOT PASSWORD PAGE (Fully Internationalized)
// Request password reset email
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../../lib/api/client';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';
export const ForgotPasswordPage: React.FC = () => {
  const {
    t
  } = useI18n();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19483") ? true : (stryCov_9fa48("19483"), false));
  const [isSubmitted, setIsSubmitted] = useState(stryMutAct_9fa48("19484") ? true : (stryCov_9fa48("19484"), false));
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(stryMutAct_9fa48("19486") ? false : (stryCov_9fa48("19486"), true));
    try {
      const response = await api.post<{
        message: string;
      }>('/auth/forgot-password', stryMutAct_9fa48("19489") ? {} : (stryCov_9fa48("19489"), {
        email
      }));
      if (stryMutAct_9fa48("19491") ? false : stryMutAct_9fa48("19490") ? true : (stryCov_9fa48("19490", "19491"), response.success)) {
        setIsSubmitted(stryMutAct_9fa48("19493") ? false : (stryCov_9fa48("19493"), true));
      } else {
        // Always show success to prevent email enumeration
        setIsSubmitted(stryMutAct_9fa48("19495") ? false : (stryCov_9fa48("19495"), true));
      }
    } catch (err) {
      // Still show success to prevent email enumeration
      setIsSubmitted(stryMutAct_9fa48("19497") ? false : (stryCov_9fa48("19497"), true));
    } finally {
      setIsLoading(stryMutAct_9fa48("19499") ? true : (stryCov_9fa48("19499"), false));
    }
  };
  if (stryMutAct_9fa48("19501") ? false : stryMutAct_9fa48("19500") ? true : (stryCov_9fa48("19500", "19501"), isSubmitted)) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{t('auth.forgotPassword.checkEmail')}</h2>
            <p className="text-gray-400 mb-6">
              {t('auth.forgotPassword.emailSentTo')} <strong className="text-white">{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t('auth.forgotPassword.linkExpiry')}
            </p>
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth.forgotPassword.title')}</h1>
          <p className="mt-2 text-gray-400">
            {t('auth.forgotPassword.subtitle')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {stryMutAct_9fa48("19511") ? error || <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div> : stryMutAct_9fa48("19510") ? false : stryMutAct_9fa48("19509") ? true : (stryCov_9fa48("19509", "19510", "19511"), error && <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div>)}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input id="email" type="email" value={email} onChange={stryMutAct_9fa48("19513") ? () => undefined : (stryCov_9fa48("19513"), e => setEmail(e.target.value))} placeholder="you@company.com" required className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <button type="submit" disabled={stryMutAct_9fa48("19516") ? isLoading && !email : stryMutAct_9fa48("19515") ? false : stryMutAct_9fa48("19514") ? true : (stryCov_9fa48("19514", "19515", "19516"), isLoading || (stryMutAct_9fa48("19517") ? email : (stryCov_9fa48("19517"), !email)))} className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2">
              {isLoading ? <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.loading')}
                </> : t('auth.forgotPassword.sendResetLink')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>;
};
export default ForgotPasswordPage;