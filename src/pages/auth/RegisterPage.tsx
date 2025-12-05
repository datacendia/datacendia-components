// =============================================================================
// DATACENDIA - REGISTER PAGE (Fully Internationalized)
// =============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { authApi } from '../../lib/api';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError(t('auth.register.errors.fullNameRequired'));
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError(t('auth.register.errors.validEmailRequired'));
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 8) {
      setError(t('auth.register.errors.passwordMinLength'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.errors.passwordMismatch'));
      return false;
    }
    if (!formData.acceptTerms) {
      setError(t('auth.register.errors.acceptTerms'));
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        ...(formData.company ? { organizationName: formData.company } : {}),
      });

      if (response.success) {
        navigate('/cortex/dashboard');
      } else {
        setError(response.error?.message || t('auth.register.errors.registrationFailed'));
      }
    } catch (err) {
      setError(t('auth.login.errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = (provider: 'google' | 'microsoft') => {
    // Redirect to OAuth flow
    window.location.href = `/api/v1/auth/oauth/${provider}`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">D</span>
            </div>
            <span className="text-white text-xl font-semibold">{t('common.appName')}</span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('auth.register.headline')}
          </h1>
          <p className="text-white/70 text-lg mb-8">
            {t('auth.register.subheadline')}
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '🧠', text: t('auth.register.features.council') },
              { icon: '📊', text: t('auth.register.features.graph') },
              { icon: '🔮', text: t('auth.register.features.lens') },
              { icon: '⚡', text: t('auth.register.features.bridge') },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white/80">
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/50 text-sm">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-neutral-900 text-xl font-semibold">{t('common.appName')}</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">{t('auth.register.title')}</h2>
            <p className="text-neutral-500 mt-2">
              {step === 1 ? t('auth.register.step1Subtitle') : t('auth.register.step2Subtitle')}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={cn(
              'w-8 h-1 rounded-full transition-colors',
              step >= 1 ? 'bg-primary-600' : 'bg-neutral-200'
            )} />
            <div className={cn(
              'w-8 h-1 rounded-full transition-colors',
              step >= 2 ? 'bg-primary-600' : 'bg-neutral-200'
            )} />
          </div>

          {step === 1 && (
            <>
              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuthRegister('google')}
                  className="w-full flex items-center justify-center gap-3 h-11 px-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-neutral-700">{t('auth.register.signUpWith')} Google</span>
                </button>

                <button
                  onClick={() => handleOAuthRegister('microsoft')}
                  className="w-full flex items-center justify-center gap-3 h-11 px-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                  <span className="text-sm font-medium text-neutral-700">{t('auth.register.signUpWith')} Microsoft</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-neutral-400">{t('auth.login.orContinueWith')}</span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
            {error && (
              <div className="p-3 bg-error-light border border-error-main rounded-lg text-sm text-error-dark">
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t('auth.register.firstName')}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">{t('auth.register.lastName')}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('auth.register.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('auth.register.company')}</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full h-11 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Acme Inc."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('common.next')}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
                >
                  ← {t('common.back')}
                </button>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('auth.register.password')}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-neutral-400 mt-1">{t('auth.register.passwordHint')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{t('auth.register.confirmPassword')}</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="••••••••"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-600">
                    {t('auth.register.agreeToTerms')}{' '}
                    <Link to="/terms" className="text-primary-600 hover:underline">{t('footer.terms')}</Link>
                    {' '}{t('common.and')}{' '}
                    <Link to="/privacy" className="text-primary-600 hover:underline">{t('footer.privacy')}</Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full h-11 bg-primary-600 text-white font-medium rounded-lg',
                    'hover:bg-primary-700 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center justify-center'
                  )}
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    t('auth.register.submitButton')
                  )}
                </button>
              </>
            )}
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-neutral-500">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('auth.register.signIn')}
            </Link>
          </p>

          {/* Language Selector */}
          <div className="mt-6 flex justify-center">
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
