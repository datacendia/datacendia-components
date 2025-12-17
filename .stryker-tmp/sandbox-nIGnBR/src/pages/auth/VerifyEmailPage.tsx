// @ts-nocheck
// =============================================================================
// DATACENDIA - EMAIL VERIFICATION PAGE
// Handles email verification token processing
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { api } from '../../lib/api/client';
export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (stryMutAct_9fa48("20068") ? false : stryMutAct_9fa48("20067") ? true : stryMutAct_9fa48("20066") ? token : (stryCov_9fa48("20066", "20067", "20068"), !token)) {
      setStatus('no-token');
      setMessage('No verification token provided.');
      return;
    }
    const verifyEmail = async () => {
      try {
        const response = await api.post<{
          message: string;
        }>('/auth/verify-email', stryMutAct_9fa48("20075") ? {} : (stryCov_9fa48("20075"), {
          token
        }));
        if (stryMutAct_9fa48("20077") ? false : stryMutAct_9fa48("20076") ? true : (stryCov_9fa48("20076", "20077"), response.success)) {
          setStatus('success');
          setMessage(stryMutAct_9fa48("20082") ? response.data?.message && 'Your email has been verified successfully!' : stryMutAct_9fa48("20081") ? false : stryMutAct_9fa48("20080") ? true : (stryCov_9fa48("20080", "20081", "20082"), (stryMutAct_9fa48("20083") ? response.data.message : (stryCov_9fa48("20083"), response.data?.message)) || 'Your email has been verified successfully!'));

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/auth/login', stryMutAct_9fa48("20087") ? {} : (stryCov_9fa48("20087"), {
              state: stryMutAct_9fa48("20088") ? {} : (stryCov_9fa48("20088"), {
                message: 'Email verified! Please log in to continue.'
              })
            }));
          }, 3000);
        } else {
          setStatus('error');
          setMessage(stryMutAct_9fa48("20094") ? response.error?.message && 'Failed to verify email. The link may have expired.' : stryMutAct_9fa48("20093") ? false : stryMutAct_9fa48("20092") ? true : (stryCov_9fa48("20092", "20093", "20094"), (stryMutAct_9fa48("20095") ? response.error.message : (stryCov_9fa48("20095"), response.error?.message)) || 'Failed to verify email. The link may have expired.'));
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email.');
      }
    };
    verifyEmail();
  }, stryMutAct_9fa48("20100") ? [] : (stryCov_9fa48("20100"), [token, navigate]));
  return <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Email Verification</h1>
        </div>

        {/* Status Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
          {stryMutAct_9fa48("20103") ? status === 'loading' || <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900/50 mb-4">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verifying your email...</h2>
              <p className="text-gray-400">Please wait while we verify your email address.</p>
            </> : stryMutAct_9fa48("20102") ? false : stryMutAct_9fa48("20101") ? true : (stryCov_9fa48("20101", "20102", "20103"), (stryMutAct_9fa48("20105") ? status !== 'loading' : stryMutAct_9fa48("20104") ? true : (stryCov_9fa48("20104", "20105"), status === 'loading')) && <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900/50 mb-4">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verifying your email...</h2>
              <p className="text-gray-400">Please wait while we verify your email address.</p>
            </>)}

          {stryMutAct_9fa48("20109") ? status === 'success' || <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </> : stryMutAct_9fa48("20108") ? false : stryMutAct_9fa48("20107") ? true : (stryCov_9fa48("20107", "20108", "20109"), (stryMutAct_9fa48("20111") ? status !== 'success' : stryMutAct_9fa48("20110") ? true : (stryCov_9fa48("20110", "20111"), status === 'success')) && <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </>)}

          {stryMutAct_9fa48("20115") ? status === 'error' || <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/50 mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link to="/auth/login" className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                  Go to Login
                </Link>
                <button onClick={() => navigate('/auth/resend-verification')} className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
                  Resend Verification Email
                </button>
              </div>
            </> : stryMutAct_9fa48("20114") ? false : stryMutAct_9fa48("20113") ? true : (stryCov_9fa48("20113", "20114", "20115"), (stryMutAct_9fa48("20117") ? status !== 'error' : stryMutAct_9fa48("20116") ? true : (stryCov_9fa48("20116", "20117"), status === 'error')) && <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/50 mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link to="/auth/login" className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                  Go to Login
                </Link>
                <button onClick={stryMutAct_9fa48("20119") ? () => undefined : (stryCov_9fa48("20119"), () => navigate('/auth/resend-verification'))} className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
                  Resend Verification Email
                </button>
              </div>
            </>)}

          {stryMutAct_9fa48("20123") ? status === 'no-token' || <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/50 mb-4">
                <XCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Invalid Link</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link to="/auth/login" className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                Go to Login
              </Link>
            </> : stryMutAct_9fa48("20122") ? false : stryMutAct_9fa48("20121") ? true : (stryCov_9fa48("20121", "20122", "20123"), (stryMutAct_9fa48("20125") ? status !== 'no-token' : stryMutAct_9fa48("20124") ? true : (stryCov_9fa48("20124", "20125"), status === 'no-token')) && <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/50 mb-4">
                <XCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Invalid Link</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link to="/auth/login" className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                Go to Login
              </Link>
            </>)}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Need help?{' '}
          <a href="mailto:support@datacendia.com" className="text-indigo-400 hover:text-indigo-300">
            Contact Support
          </a>
        </p>
      </div>
    </div>;
};
export default VerifyEmailPage;