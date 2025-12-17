// @ts-nocheck
// =============================================================================
// DATACENDIA - AUTH PAGES
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../../lib/utils';

// =============================================================================
// LOGIN PAGE
// =============================================================================

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(stryMutAct_9fa48("19524") ? true : (stryCov_9fa48("19524"), false));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19525") ? true : (stryCov_9fa48("19525"), false));
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(stryMutAct_9fa48("19529") ? false : (stryCov_9fa48("19529"), true));
    try {
      await new Promise(stryMutAct_9fa48("19531") ? () => undefined : (stryCov_9fa48("19531"), resolve => setTimeout(resolve, 1000)));
      // Simulate login - replace with actual API call
      navigate(stryMutAct_9fa48("19534") ? searchParams.get('redirect') && '/cortex' : stryMutAct_9fa48("19533") ? false : stryMutAct_9fa48("19532") ? true : (stryCov_9fa48("19532", "19533", "19534"), searchParams.get('redirect') || '/cortex'));
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(stryMutAct_9fa48("19540") ? true : (stryCov_9fa48("19540"), false));
    }
  };
  const handleOAuthLogin = (provider: 'google' | 'microsoft') => {
    // Redirect to OAuth flow
    console.log('OAuth login with', provider);
  };
  return <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-semibold text-neutral-900">Datacendia</span>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome back</h1>
          <p className="text-neutral-500 mb-8">Sign in to your account to continue</p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button onClick={stryMutAct_9fa48("19543") ? () => undefined : (stryCov_9fa48("19543"), () => handleOAuthLogin('google'))} className="w-full flex items-center justify-center gap-3 h-11 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-medium text-neutral-700">Continue with Google</span>
            </button>
            
            <button onClick={stryMutAct_9fa48("19545") ? () => undefined : (stryCov_9fa48("19545"), () => handleOAuthLogin('microsoft'))} className="w-full flex items-center justify-center gap-3 h-11 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
              <span className="text-sm font-medium text-neutral-700">Continue with Microsoft</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">or continue with email</span>
            </div>
          </div>

          {/* Error Alert */}
          {stryMutAct_9fa48("19549") ? error || <div data-testid="error-message" className="mb-4 p-3 bg-error-light text-error-dark rounded-lg text-sm">
              {error}
            </div> : stryMutAct_9fa48("19548") ? false : stryMutAct_9fa48("19547") ? true : (stryCov_9fa48("19547", "19548", "19549"), error && <div data-testid="error-message" className="mb-4 p-3 bg-error-light text-error-dark rounded-lg text-sm">
              {error}
            </div>)}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input data-testid="email-input" type="email" required value={email} onChange={stryMutAct_9fa48("19550") ? () => undefined : (stryCov_9fa48("19550"), e => setEmail(e.target.value))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="you@company.com" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-neutral-700">Password</label>
                <a href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
              <input data-testid="password-input" type="password" required value={password} onChange={stryMutAct_9fa48("19551") ? () => undefined : (stryCov_9fa48("19551"), e => setPassword(e.target.value))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="••••••••" />
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={stryMutAct_9fa48("19552") ? () => undefined : (stryCov_9fa48("19552"), e => setRememberMe(e.target.checked))} className="rounded text-primary-600" />
              <span className="text-sm text-neutral-600">Remember me for 30 days</span>
            </label>

            <button data-testid="login-button" type="submit" disabled={isLoading} className="w-full h-11 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* SSO Link */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600">
              <strong>Enterprise SSO?</strong>{' '}
              <a href="/login/sso" className="text-primary-600 hover:text-primary-700">
                Sign in with SAML →
              </a>
            </p>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <a href="/demo" className="text-primary-600 hover:text-primary-700 font-medium">
              Request a demo
            </a>
          </p>
        </div>
      </div>

      {/* Right - Branding */}
      <div className="hidden lg:flex flex-1 bg-primary-600 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-4">
            Your organization's intelligence, sovereign and whole
          </h2>
          <p className="text-white/70 text-lg">
            Connect your data, consult AI advisors, and see possible futures — 
            all while keeping complete control.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            {(stryMutAct_9fa48("19557") ? [] : (stryCov_9fa48("19557"), [stryMutAct_9fa48("19558") ? {} : (stryCov_9fa48("19558"), {
            stat: '50+',
            label: 'Integrations'
          }), stryMutAct_9fa48("19561") ? {} : (stryCov_9fa48("19561"), {
            stat: '8',
            label: 'AI Agents'
          }), stryMutAct_9fa48("19564") ? {} : (stryCov_9fa48("19564"), {
            stat: '99.9%',
            label: 'Uptime'
          }), stryMutAct_9fa48("19567") ? {} : (stryCov_9fa48("19567"), {
            stat: 'SOC 2',
            label: 'Compliant'
          })])).map(stryMutAct_9fa48("19570") ? () => undefined : (stryCov_9fa48("19570"), item => <div key={item.label}>
                <p className="text-3xl font-bold">{item.stat}</p>
                <p className="text-white/60">{item.label}</p>
              </div>))}
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// REGISTER PAGE
// =============================================================================

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(stryMutAct_9fa48("19572") ? {} : (stryCov_9fa48("19572"), {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: stryMutAct_9fa48("19579") ? true : (stryCov_9fa48("19579"), false)
  }));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19580") ? true : (stryCov_9fa48("19580"), false));
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (stryMutAct_9fa48("19586") ? formData.password === formData.confirmPassword : stryMutAct_9fa48("19585") ? false : stryMutAct_9fa48("19584") ? true : (stryCov_9fa48("19584", "19585", "19586"), formData.password !== formData.confirmPassword)) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(stryMutAct_9fa48("19589") ? false : (stryCov_9fa48("19589"), true));
    try {
      await new Promise(stryMutAct_9fa48("19591") ? () => undefined : (stryCov_9fa48("19591"), resolve => setTimeout(resolve, 1000)));
      navigate('/cortex');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(stryMutAct_9fa48("19596") ? true : (stryCov_9fa48("19596"), false));
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
      <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-semibold text-neutral-900">Datacendia</span>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create your account</h1>
        <p className="text-neutral-500 mb-8">Start your 14-day free trial</p>

        {stryMutAct_9fa48("19599") ? error || <div className="mb-4 p-3 bg-error-light text-error-dark rounded-lg text-sm">
            {error}
          </div> : stryMutAct_9fa48("19598") ? false : stryMutAct_9fa48("19597") ? true : (stryCov_9fa48("19597", "19598", "19599"), error && <div className="mb-4 p-3 bg-error-light text-error-dark rounded-lg text-sm">
            {error}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
              <input type="text" required value={formData.firstName} onChange={stryMutAct_9fa48("19600") ? () => undefined : (stryCov_9fa48("19600"), e => setFormData(stryMutAct_9fa48("19601") ? {} : (stryCov_9fa48("19601"), {
              ...formData,
              firstName: e.target.value
            })))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
              <input type="text" required value={formData.lastName} onChange={stryMutAct_9fa48("19602") ? () => undefined : (stryCov_9fa48("19602"), e => setFormData(stryMutAct_9fa48("19603") ? {} : (stryCov_9fa48("19603"), {
              ...formData,
              lastName: e.target.value
            })))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Work Email</label>
            <input type="email" required value={formData.email} onChange={stryMutAct_9fa48("19604") ? () => undefined : (stryCov_9fa48("19604"), e => setFormData(stryMutAct_9fa48("19605") ? {} : (stryCov_9fa48("19605"), {
            ...formData,
            email: e.target.value
          })))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
            <input type="text" required value={formData.company} onChange={stryMutAct_9fa48("19606") ? () => undefined : (stryCov_9fa48("19606"), e => setFormData(stryMutAct_9fa48("19607") ? {} : (stryCov_9fa48("19607"), {
            ...formData,
            company: e.target.value
          })))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <input type="password" required minLength={8} value={formData.password} onChange={stryMutAct_9fa48("19608") ? () => undefined : (stryCov_9fa48("19608"), e => setFormData(stryMutAct_9fa48("19609") ? {} : (stryCov_9fa48("19609"), {
            ...formData,
            password: e.target.value
          })))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            <p className="text-xs text-neutral-400 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm Password</label>
            <input type="password" required value={formData.confirmPassword} onChange={stryMutAct_9fa48("19610") ? () => undefined : (stryCov_9fa48("19610"), e => setFormData(stryMutAct_9fa48("19611") ? {} : (stryCov_9fa48("19611"), {
            ...formData,
            confirmPassword: e.target.value
          })))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <label className="flex items-start gap-2">
            <input type="checkbox" required checked={formData.agreeToTerms} onChange={stryMutAct_9fa48("19612") ? () => undefined : (stryCov_9fa48("19612"), e => setFormData(stryMutAct_9fa48("19613") ? {} : (stryCov_9fa48("19613"), {
            ...formData,
            agreeToTerms: e.target.checked
          })))} className="mt-1 rounded text-primary-600" />
            <span className="text-sm text-neutral-600">
              I agree to the{' '}
              <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
            </span>
          </label>

          <button type="submit" disabled={isLoading} className="w-full h-11 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>;
};

// =============================================================================
// FORGOT PASSWORD PAGE
// =============================================================================

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19622") ? true : (stryCov_9fa48("19622"), false));
  const [isSubmitted, setIsSubmitted] = useState(stryMutAct_9fa48("19623") ? true : (stryCov_9fa48("19623"), false));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(stryMutAct_9fa48("19625") ? false : (stryCov_9fa48("19625"), true));
    await new Promise(stryMutAct_9fa48("19626") ? () => undefined : (stryCov_9fa48("19626"), resolve => setTimeout(resolve, 1000)));
    setIsSubmitted(stryMutAct_9fa48("19627") ? false : (stryCov_9fa48("19627"), true));
    setIsLoading(stryMutAct_9fa48("19628") ? true : (stryCov_9fa48("19628"), false));
  };
  if (stryMutAct_9fa48("19630") ? false : stryMutAct_9fa48("19629") ? true : (stryCov_9fa48("19629", "19630"), isSubmitted)) {
    return <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Check your email</h1>
          <p className="text-neutral-600 mb-8">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to login
          </a>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
      <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-semibold text-neutral-900">Datacendia</span>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Forgot your password?</h1>
        <p className="text-neutral-500 mb-8">
          Enter your email and we'll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={stryMutAct_9fa48("19632") ? () => undefined : (stryCov_9fa48("19632"), e => setEmail(e.target.value))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="you@company.com" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-11 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
            {isLoading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to login
          </a>
        </p>
      </div>
    </div>;
};

// =============================================================================
// RESET PASSWORD PAGE
// =============================================================================

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19638") ? true : (stryCov_9fa48("19638"), false));
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (stryMutAct_9fa48("19644") ? password === confirmPassword : stryMutAct_9fa48("19643") ? false : stryMutAct_9fa48("19642") ? true : (stryCov_9fa48("19642", "19643", "19644"), password !== confirmPassword)) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(stryMutAct_9fa48("19647") ? false : (stryCov_9fa48("19647"), true));
    try {
      await new Promise(stryMutAct_9fa48("19649") ? () => undefined : (stryCov_9fa48("19649"), resolve => setTimeout(resolve, 1000)));
      navigate('/login?reset=success');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(stryMutAct_9fa48("19654") ? true : (stryCov_9fa48("19654"), false));
    }
  };
  return <div className="min-h-screen flex items-center justify-center p-8 bg-neutral-50">
      <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-semibold text-neutral-900">Datacendia</span>
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reset your password</h1>
        <p className="text-neutral-500 mb-8">
          Enter your new password below
        </p>

        {stryMutAct_9fa48("19657") ? error || <div className="mb-4 p-3 bg-error-light text-error-dark rounded-lg text-sm">
            {error}
          </div> : stryMutAct_9fa48("19656") ? false : stryMutAct_9fa48("19655") ? true : (stryCov_9fa48("19655", "19656", "19657"), error && <div className="mb-4 p-3 bg-error-light text-error-dark rounded-lg text-sm">
            {error}
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
            <input type="password" required minLength={8} value={password} onChange={stryMutAct_9fa48("19658") ? () => undefined : (stryCov_9fa48("19658"), e => setPassword(e.target.value))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            <p className="text-xs text-neutral-400 mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm Password</label>
            <input type="password" required value={confirmPassword} onChange={stryMutAct_9fa48("19659") ? () => undefined : (stryCov_9fa48("19659"), e => setConfirmPassword(e.target.value))} className="w-full h-11 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-11 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
            {isLoading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>;
};

// Re-export enhanced pages
export { VerifyEmailPage } from './VerifyEmailPage';
export default LoginPage;