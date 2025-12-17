// @ts-nocheck
// =============================================================================
// DATACENDIA - RESET PASSWORD PAGE
// Set new password using reset token
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
import { KeyRound, Eye, EyeOff, CheckCircle, XCircle, Loader2, Lock } from 'lucide-react';
import { api } from '../../lib/api/client';
export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(stryMutAct_9fa48("19903") ? true : (stryCov_9fa48("19903"), false));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19904") ? true : (stryCov_9fa48("19904"), false));
  const [status, setStatus] = useState<'form' | 'success' | 'error' | 'no-token'>('form');
  const [error, setError] = useState<string | null>(null);

  // Password strength indicators
  const passwordChecks = stryMutAct_9fa48("19906") ? {} : (stryCov_9fa48("19906"), {
    length: stryMutAct_9fa48("19910") ? password.length < 8 : stryMutAct_9fa48("19909") ? password.length > 8 : stryMutAct_9fa48("19908") ? false : stryMutAct_9fa48("19907") ? true : (stryCov_9fa48("19907", "19908", "19909", "19910"), password.length >= 8),
    uppercase: (stryMutAct_9fa48("19911") ? /[^A-Z]/ : (stryCov_9fa48("19911"), /[A-Z]/)).test(password),
    lowercase: (stryMutAct_9fa48("19912") ? /[^a-z]/ : (stryCov_9fa48("19912"), /[a-z]/)).test(password),
    number: (stryMutAct_9fa48("19913") ? /[^0-9]/ : (stryCov_9fa48("19913"), /[0-9]/)).test(password),
    special: (stryMutAct_9fa48("19914") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("19914"), /[!@#$%^&*(),.?":{}|<>]/)).test(password)
  });
  const passwordStrength = stryMutAct_9fa48("19915") ? Object.values(passwordChecks).length : (stryCov_9fa48("19915"), Object.values(passwordChecks).filter(Boolean).length);
  useEffect(() => {
    if (stryMutAct_9fa48("19919") ? false : stryMutAct_9fa48("19918") ? true : stryMutAct_9fa48("19917") ? token : (stryCov_9fa48("19917", "19918", "19919"), !token)) {
      setStatus('no-token');
    }
  }, stryMutAct_9fa48("19922") ? [] : (stryCov_9fa48("19922"), [token]));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (stryMutAct_9fa48("19926") ? password === confirmPassword : stryMutAct_9fa48("19925") ? false : stryMutAct_9fa48("19924") ? true : (stryCov_9fa48("19924", "19925", "19926"), password !== confirmPassword)) {
      setError('Passwords do not match');
      return;
    }
    if (stryMutAct_9fa48("19932") ? passwordStrength >= 4 : stryMutAct_9fa48("19931") ? passwordStrength <= 4 : stryMutAct_9fa48("19930") ? false : stryMutAct_9fa48("19929") ? true : (stryCov_9fa48("19929", "19930", "19931", "19932"), passwordStrength < 4)) {
      setError('Password does not meet security requirements');
      return;
    }
    setIsLoading(stryMutAct_9fa48("19935") ? false : (stryCov_9fa48("19935"), true));
    try {
      const response = await api.post<{
        message: string;
      }>('/auth/reset-password', stryMutAct_9fa48("19938") ? {} : (stryCov_9fa48("19938"), {
        token,
        password
      }));
      if (stryMutAct_9fa48("19940") ? false : stryMutAct_9fa48("19939") ? true : (stryCov_9fa48("19939", "19940"), response.success)) {
        setStatus('success');
        setTimeout(() => {
          navigate('/auth/login', stryMutAct_9fa48("19945") ? {} : (stryCov_9fa48("19945"), {
            state: stryMutAct_9fa48("19946") ? {} : (stryCov_9fa48("19946"), {
              message: 'Password reset successful! Please log in with your new password.'
            })
          }));
        }, 3000);
      } else {
        setError(stryMutAct_9fa48("19951") ? response.error?.message && 'Failed to reset password' : stryMutAct_9fa48("19950") ? false : stryMutAct_9fa48("19949") ? true : (stryCov_9fa48("19949", "19950", "19951"), (stryMutAct_9fa48("19952") ? response.error.message : (stryCov_9fa48("19952"), response.error?.message)) || 'Failed to reset password'));
        if (stryMutAct_9fa48("19956") ? response.error?.message?.includes('expired') && response.error?.message?.includes('invalid') : stryMutAct_9fa48("19955") ? false : stryMutAct_9fa48("19954") ? true : (stryCov_9fa48("19954", "19955", "19956"), (stryMutAct_9fa48("19958") ? response.error.message?.includes('expired') : stryMutAct_9fa48("19957") ? response.error?.message.includes('expired') : (stryCov_9fa48("19957", "19958"), response.error?.message?.includes('expired'))) || (stryMutAct_9fa48("19961") ? response.error.message?.includes('invalid') : stryMutAct_9fa48("19960") ? response.error?.message.includes('invalid') : (stryCov_9fa48("19960", "19961"), response.error?.message?.includes('invalid'))))) {
          setStatus('error');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(stryMutAct_9fa48("19968") ? true : (stryCov_9fa48("19968"), false));
    }
  };
  if (stryMutAct_9fa48("19971") ? status !== 'no-token' : stryMutAct_9fa48("19970") ? false : stryMutAct_9fa48("19969") ? true : (stryCov_9fa48("19969", "19970", "19971"), status === 'no-token')) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/50 mb-4">
            <XCircle className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/auth/forgot-password" className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
            Request New Reset Link
          </Link>
        </div>
      </div>;
  }
  if (stryMutAct_9fa48("19976") ? status !== 'success' : stryMutAct_9fa48("19975") ? false : stryMutAct_9fa48("19974") ? true : (stryCov_9fa48("19974", "19975", "19976"), status === 'success')) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Password Reset!</h2>
          <p className="text-gray-400 mb-4">
            Your password has been reset successfully.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>;
  }
  if (stryMutAct_9fa48("19981") ? status !== 'error' : stryMutAct_9fa48("19980") ? false : stryMutAct_9fa48("19979") ? true : (stryCov_9fa48("19979", "19980", "19981"), status === 'error')) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/50 mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Reset Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/auth/forgot-password" className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
            Request New Reset Link
          </Link>
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
          <h1 className="text-2xl font-bold text-white">Create New Password</h1>
          <p className="mt-2 text-gray-400">
            Enter a strong password for your account.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {stryMutAct_9fa48("19986") ? error || <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div> : stryMutAct_9fa48("19985") ? false : stryMutAct_9fa48("19984") ? true : (stryCov_9fa48("19984", "19985", "19986"), error && <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div>)}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={stryMutAct_9fa48("19989") ? () => undefined : (stryCov_9fa48("19989"), e => setPassword(e.target.value))} placeholder="••••••••" required className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                <button type="button" onClick={stryMutAct_9fa48("19990") ? () => undefined : (stryCov_9fa48("19990"), () => setShowPassword(stryMutAct_9fa48("19991") ? showPassword : (stryCov_9fa48("19991"), !showPassword)))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {stryMutAct_9fa48("19994") ? password || <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(level => <div key={level} className={`h-1 flex-1 rounded-full ${passwordStrength >= level ? passwordStrength >= 4 ? 'bg-green-500' : passwordStrength >= 3 ? 'bg-yellow-500' : 'bg-red-500' : 'bg-gray-700'}`} />)}
                  </div>
                  <ul className="text-xs space-y-1">
                    <li className={passwordChecks.length ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.length ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={passwordChecks.uppercase ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.uppercase ? '✓' : '○'} One uppercase letter
                    </li>
                    <li className={passwordChecks.lowercase ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.lowercase ? '✓' : '○'} One lowercase letter
                    </li>
                    <li className={passwordChecks.number ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.number ? '✓' : '○'} One number
                    </li>
                    <li className={passwordChecks.special ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.special ? '✓' : '○'} One special character
                    </li>
                  </ul>
                </div> : stryMutAct_9fa48("19993") ? false : stryMutAct_9fa48("19992") ? true : (stryCov_9fa48("19992", "19993", "19994"), password && <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {(stryMutAct_9fa48("19995") ? [] : (stryCov_9fa48("19995"), [1, 2, 3, 4, 5])).map(stryMutAct_9fa48("19996") ? () => undefined : (stryCov_9fa48("19996"), level => <div key={level} className={`h-1 flex-1 rounded-full ${(stryMutAct_9fa48("20001") ? passwordStrength < level : stryMutAct_9fa48("20000") ? passwordStrength > level : stryMutAct_9fa48("19999") ? false : stryMutAct_9fa48("19998") ? true : (stryCov_9fa48("19998", "19999", "20000", "20001"), passwordStrength >= level)) ? (stryMutAct_9fa48("20005") ? passwordStrength < 4 : stryMutAct_9fa48("20004") ? passwordStrength > 4 : stryMutAct_9fa48("20003") ? false : stryMutAct_9fa48("20002") ? true : (stryCov_9fa48("20002", "20003", "20004", "20005"), passwordStrength >= 4)) ? 'bg-green-500' : (stryMutAct_9fa48("20010") ? passwordStrength < 3 : stryMutAct_9fa48("20009") ? passwordStrength > 3 : stryMutAct_9fa48("20008") ? false : stryMutAct_9fa48("20007") ? true : (stryCov_9fa48("20007", "20008", "20009", "20010"), passwordStrength >= 3)) ? 'bg-yellow-500' : 'bg-red-500' : 'bg-gray-700'}`} />))}
                  </div>
                  <ul className="text-xs space-y-1">
                    <li className={passwordChecks.length ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.length ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={passwordChecks.uppercase ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.uppercase ? '✓' : '○'} One uppercase letter
                    </li>
                    <li className={passwordChecks.lowercase ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.lowercase ? '✓' : '○'} One lowercase letter
                    </li>
                    <li className={passwordChecks.number ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.number ? '✓' : '○'} One number
                    </li>
                    <li className={passwordChecks.special ? 'text-green-400' : 'text-gray-500'}>
                      {passwordChecks.special ? '✓' : '○'} One special character
                    </li>
                  </ul>
                </div>)}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={stryMutAct_9fa48("20036") ? () => undefined : (stryCov_9fa48("20036"), e => setConfirmPassword(e.target.value))} placeholder="••••••••" required className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
              </div>
              {stryMutAct_9fa48("20039") ? confirmPassword && password !== confirmPassword || <p className="mt-2 text-sm text-red-400">Passwords do not match</p> : stryMutAct_9fa48("20038") ? false : stryMutAct_9fa48("20037") ? true : (stryCov_9fa48("20037", "20038", "20039"), (stryMutAct_9fa48("20041") ? confirmPassword || password !== confirmPassword : stryMutAct_9fa48("20040") ? true : (stryCov_9fa48("20040", "20041"), confirmPassword && (stryMutAct_9fa48("20043") ? password === confirmPassword : stryMutAct_9fa48("20042") ? true : (stryCov_9fa48("20042", "20043"), password !== confirmPassword)))) && <p className="mt-2 text-sm text-red-400">Passwords do not match</p>)}
            </div>

            <button type="submit" disabled={stryMutAct_9fa48("20046") ? (isLoading || !password || !confirmPassword || password !== confirmPassword) && passwordStrength < 4 : stryMutAct_9fa48("20045") ? false : stryMutAct_9fa48("20044") ? true : (stryCov_9fa48("20044", "20045", "20046"), (stryMutAct_9fa48("20048") ? (isLoading || !password || !confirmPassword) && password !== confirmPassword : stryMutAct_9fa48("20047") ? false : (stryCov_9fa48("20047", "20048"), (stryMutAct_9fa48("20050") ? (isLoading || !password) && !confirmPassword : stryMutAct_9fa48("20049") ? false : (stryCov_9fa48("20049", "20050"), (stryMutAct_9fa48("20052") ? isLoading && !password : stryMutAct_9fa48("20051") ? false : (stryCov_9fa48("20051", "20052"), isLoading || (stryMutAct_9fa48("20053") ? password : (stryCov_9fa48("20053"), !password)))) || (stryMutAct_9fa48("20054") ? confirmPassword : (stryCov_9fa48("20054"), !confirmPassword)))) || (stryMutAct_9fa48("20056") ? password === confirmPassword : stryMutAct_9fa48("20055") ? false : (stryCov_9fa48("20055", "20056"), password !== confirmPassword)))) || (stryMutAct_9fa48("20059") ? passwordStrength >= 4 : stryMutAct_9fa48("20058") ? passwordStrength <= 4 : stryMutAct_9fa48("20057") ? false : (stryCov_9fa48("20057", "20058", "20059"), passwordStrength < 4)))} className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2">
              {isLoading ? <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resetting...
                </> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>;
};
export default ResetPasswordPage;