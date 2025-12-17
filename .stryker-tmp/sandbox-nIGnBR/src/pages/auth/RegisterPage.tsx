// @ts-nocheck
// =============================================================================
// DATACENDIA - REGISTER PAGE (Fully Internationalized)
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
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { authApi } from '../../lib/api';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    t
  } = useI18n();
  const [formData, setFormData] = useState(stryMutAct_9fa48("19716") ? {} : (stryCov_9fa48("19716"), {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    acceptTerms: stryMutAct_9fa48("19723") ? true : (stryCov_9fa48("19723"), false)
  }));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("19724") ? true : (stryCov_9fa48("19724"), false));
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData(stryMutAct_9fa48("19727") ? () => undefined : (stryCov_9fa48("19727"), prev => stryMutAct_9fa48("19728") ? {} : (stryCov_9fa48("19728"), {
      ...prev,
      [name]: (stryMutAct_9fa48("19731") ? type !== 'checkbox' : stryMutAct_9fa48("19730") ? false : stryMutAct_9fa48("19729") ? true : (stryCov_9fa48("19729", "19730", "19731"), type === 'checkbox')) ? checked : value
    })));
  };

  // List of personal email domains that are not allowed
  const personalEmailDomains = stryMutAct_9fa48("19733") ? [] : (stryCov_9fa48("19733"), ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com', 'gmx.com', 'live.com', 'msn.com', 'me.com', 'qq.com', '163.com']);
  const isWorkEmail = (email: string): boolean => {
    const domain = stryMutAct_9fa48("19752") ? email.split('@')[1].toLowerCase() : stryMutAct_9fa48("19751") ? email.split('@')[1]?.toUpperCase() : (stryCov_9fa48("19751", "19752"), email.split('@')[1]?.toLowerCase());
    return stryMutAct_9fa48("19756") ? !!domain || !personalEmailDomains.includes(domain) : stryMutAct_9fa48("19755") ? false : stryMutAct_9fa48("19754") ? true : (stryCov_9fa48("19754", "19755", "19756"), (stryMutAct_9fa48("19757") ? !domain : (stryCov_9fa48("19757"), !(stryMutAct_9fa48("19758") ? domain : (stryCov_9fa48("19758"), !domain)))) && (stryMutAct_9fa48("19759") ? personalEmailDomains.includes(domain) : (stryCov_9fa48("19759"), !personalEmailDomains.includes(domain))));
  };
  const validateStep1 = () => {
    if (stryMutAct_9fa48("19763") ? !formData.firstName && !formData.lastName : stryMutAct_9fa48("19762") ? false : stryMutAct_9fa48("19761") ? true : (stryCov_9fa48("19761", "19762", "19763"), (stryMutAct_9fa48("19764") ? formData.firstName : (stryCov_9fa48("19764"), !formData.firstName)) || (stryMutAct_9fa48("19765") ? formData.lastName : (stryCov_9fa48("19765"), !formData.lastName)))) {
      setError(t('auth.register.errors.fullNameRequired'));
      return stryMutAct_9fa48("19768") ? true : (stryCov_9fa48("19768"), false);
    }
    if (stryMutAct_9fa48("19771") ? !formData.email && !formData.email.includes('@') : stryMutAct_9fa48("19770") ? false : stryMutAct_9fa48("19769") ? true : (stryCov_9fa48("19769", "19770", "19771"), (stryMutAct_9fa48("19772") ? formData.email : (stryCov_9fa48("19772"), !formData.email)) || (stryMutAct_9fa48("19773") ? formData.email.includes('@') : (stryCov_9fa48("19773"), !formData.email.includes('@'))))) {
      setError(t('auth.register.errors.validEmailRequired'));
      return stryMutAct_9fa48("19777") ? true : (stryCov_9fa48("19777"), false);
    }
    if (stryMutAct_9fa48("19780") ? false : stryMutAct_9fa48("19779") ? true : stryMutAct_9fa48("19778") ? isWorkEmail(formData.email) : (stryCov_9fa48("19778", "19779", "19780"), !isWorkEmail(formData.email))) {
      setError('Please use your work email address. Personal email domains are not accepted.');
      return stryMutAct_9fa48("19783") ? true : (stryCov_9fa48("19783"), false);
    }
    setError('');
    return stryMutAct_9fa48("19785") ? false : (stryCov_9fa48("19785"), true);
  };
  const validateStep2 = () => {
    if (stryMutAct_9fa48("19790") ? formData.password.length >= 8 : stryMutAct_9fa48("19789") ? formData.password.length <= 8 : stryMutAct_9fa48("19788") ? false : stryMutAct_9fa48("19787") ? true : (stryCov_9fa48("19787", "19788", "19789", "19790"), formData.password.length < 8)) {
      setError(t('auth.register.errors.passwordMinLength'));
      return stryMutAct_9fa48("19793") ? true : (stryCov_9fa48("19793"), false);
    }
    if (stryMutAct_9fa48("19796") ? formData.password === formData.confirmPassword : stryMutAct_9fa48("19795") ? false : stryMutAct_9fa48("19794") ? true : (stryCov_9fa48("19794", "19795", "19796"), formData.password !== formData.confirmPassword)) {
      setError(t('auth.register.errors.passwordMismatch'));
      return stryMutAct_9fa48("19799") ? true : (stryCov_9fa48("19799"), false);
    }
    if (stryMutAct_9fa48("19802") ? false : stryMutAct_9fa48("19801") ? true : stryMutAct_9fa48("19800") ? formData.acceptTerms : (stryCov_9fa48("19800", "19801", "19802"), !formData.acceptTerms)) {
      setError(t('auth.register.errors.acceptTerms'));
      return stryMutAct_9fa48("19805") ? true : (stryCov_9fa48("19805"), false);
    }
    setError('');
    return stryMutAct_9fa48("19807") ? false : (stryCov_9fa48("19807"), true);
  };
  const handleNextStep = () => {
    if (stryMutAct_9fa48("19810") ? false : stryMutAct_9fa48("19809") ? true : (stryCov_9fa48("19809", "19810"), validateStep1())) {
      setStep(2);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stryMutAct_9fa48("19815") ? false : stryMutAct_9fa48("19814") ? true : stryMutAct_9fa48("19813") ? validateStep2() : (stryCov_9fa48("19813", "19814", "19815"), !validateStep2())) {
      return;
    }
    setIsLoading(stryMutAct_9fa48("19817") ? false : (stryCov_9fa48("19817"), true));
    setError('');
    try {
      const response = await authApi.register(stryMutAct_9fa48("19820") ? {} : (stryCov_9fa48("19820"), {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        ...(formData.company ? stryMutAct_9fa48("19822") ? {} : (stryCov_9fa48("19822"), {
          organizationName: formData.company
        }) : {})
      }));
      if (stryMutAct_9fa48("19824") ? false : stryMutAct_9fa48("19823") ? true : (stryCov_9fa48("19823", "19824"), response.success)) {
        navigate('/cortex/dashboard');
      } else {
        setError(stryMutAct_9fa48("19830") ? response.error?.message && t('auth.register.errors.registrationFailed') : stryMutAct_9fa48("19829") ? false : stryMutAct_9fa48("19828") ? true : (stryCov_9fa48("19828", "19829", "19830"), (stryMutAct_9fa48("19831") ? response.error.message : (stryCov_9fa48("19831"), response.error?.message)) || t('auth.register.errors.registrationFailed')));
      }
    } catch (err) {
      setError(t('auth.login.errors.networkError'));
    } finally {
      setIsLoading(stryMutAct_9fa48("19836") ? true : (stryCov_9fa48("19836"), false));
    }
  };

  // Registration handled during on-site deployment setup
  // No cloud OAuth - enterprise identity configured per-deployment

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
          <h1 className="text-3xl font-light text-white mb-6">
            Request Platform Access
          </h1>
          <p className="text-gray-400 mb-8">
            Enterprise-only. Sovereign deployment.<br />
            No cloud dependencies.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {(stryMutAct_9fa48("19837") ? [] : (stryCov_9fa48("19837"), [stryMutAct_9fa48("19838") ? {} : (stryCov_9fa48("19838"), {
            icon: '🛡️',
            text: 'On-premise deployment'
          }), stryMutAct_9fa48("19841") ? {} : (stryCov_9fa48("19841"), {
            icon: '🔒',
            text: 'Zero data egress'
          }), stryMutAct_9fa48("19844") ? {} : (stryCov_9fa48("19844"), {
            icon: '🏢',
            text: 'Enterprise SSO integration'
          }), stryMutAct_9fa48("19847") ? {} : (stryCov_9fa48("19847"), {
            icon: '📜',
            text: 'Regulatory compliance mapping'
          })])).map(stryMutAct_9fa48("19850") ? () => undefined : (stryCov_9fa48("19850"), (feature, idx) => <div key={idx} className="flex items-center gap-3 text-gray-400">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm">{feature.text}</span>
              </div>))}
          </div>
        </div>

        <div className="text-gray-600 text-xs">
          Work email required · Subject to approval
        </div>
      </div>

      {/* Right Panel - Registration Form */}
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
            <h2 className="text-2xl font-light text-white">Request Access</h2>
            <p className="text-gray-500 mt-2">
              {(stryMutAct_9fa48("19853") ? step !== 1 : stryMutAct_9fa48("19852") ? false : stryMutAct_9fa48("19851") ? true : (stryCov_9fa48("19851", "19852", "19853"), step === 1)) ? 'Enter your work details' : 'Set your credentials'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={cn('w-8 h-1 rounded-full transition-colors', (stryMutAct_9fa48("19860") ? step < 1 : stryMutAct_9fa48("19859") ? step > 1 : stryMutAct_9fa48("19858") ? false : stryMutAct_9fa48("19857") ? true : (stryCov_9fa48("19857", "19858", "19859", "19860"), step >= 1)) ? 'bg-cyan-500' : 'bg-sovereign-border')} />
            <div className={cn('w-8 h-1 rounded-full transition-colors', (stryMutAct_9fa48("19867") ? step < 2 : stryMutAct_9fa48("19866") ? step > 2 : stryMutAct_9fa48("19865") ? false : stryMutAct_9fa48("19864") ? true : (stryCov_9fa48("19864", "19865", "19866", "19867"), step >= 2)) ? 'bg-cyan-500' : 'bg-sovereign-border')} />
          </div>

          {stryMutAct_9fa48("19872") ? step === 1 || <>
              {/* Deployment Notice */}
              <div className="mb-6 p-4 bg-sovereign-card border border-sovereign-border rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Access requests are processed during deployment setup.<br />
                  Your instance runs entirely on your infrastructure.
                </p>
              </div>
            </> : stryMutAct_9fa48("19871") ? false : stryMutAct_9fa48("19870") ? true : (stryCov_9fa48("19870", "19871", "19872"), (stryMutAct_9fa48("19874") ? step !== 1 : stryMutAct_9fa48("19873") ? true : (stryCov_9fa48("19873", "19874"), step === 1)) && <>
              {/* Deployment Notice */}
              <div className="mb-6 p-4 bg-sovereign-card border border-sovereign-border rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Access requests are processed during deployment setup.<br />
                  Your instance runs entirely on your infrastructure.
                </p>
              </div>
            </>)}

          {/* Form */}
          <form onSubmit={(stryMutAct_9fa48("19877") ? step !== 2 : stryMutAct_9fa48("19876") ? false : stryMutAct_9fa48("19875") ? true : (stryCov_9fa48("19875", "19876", "19877"), step === 2)) ? handleSubmit : e => {
          e.preventDefault();
          handleNextStep();
        }} className="space-y-4">
            {stryMutAct_9fa48("19881") ? error || <div className="p-3 bg-crimson-900/20 border border-crimson-800/50 rounded-lg text-sm text-crimson-400">
                {error}
              </div> : stryMutAct_9fa48("19880") ? false : stryMutAct_9fa48("19879") ? true : (stryCov_9fa48("19879", "19880", "19881"), error && <div className="p-3 bg-crimson-900/20 border border-crimson-800/50 rounded-lg text-sm text-crimson-400">
                {error}
              </div>)}

            {(stryMutAct_9fa48("19884") ? step !== 1 : stryMutAct_9fa48("19883") ? false : stryMutAct_9fa48("19882") ? true : (stryCov_9fa48("19882", "19883", "19884"), step === 1)) ? <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.register.firstName')}</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.register.lastName')}</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Work Email <span className="text-crimson-400">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="john@company.com" />
                  <p className="text-xs text-gray-600 mt-1">Personal email domains (gmail, yahoo, etc.) are not accepted</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Organization</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Acme Inc." />
                </div>

                <button type="submit" className="w-full h-11 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-500 transition-colors">
                  Continue
                </button>
              </> : <>
                <button type="button" onClick={stryMutAct_9fa48("19887") ? () => undefined : (stryCov_9fa48("19887"), () => setStep(1))} className="flex items-center gap-1 text-sm text-gray-500 hover:text-white mb-4 transition-colors">
                  ← Back
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.register.password')}</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="••••••••" />
                  <p className="text-xs text-gray-600 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.register.confirmPassword')}</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="••••••••" />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-sovereign-card text-cyan-500 focus:ring-cyan-500" />
                  <span className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-cyan-500 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-cyan-500 hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                {/* Deployment Notice */}
                <div className="p-3 bg-sovereign-card border border-sovereign-border rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    🏢 Credentials are configured during on-site deployment.<br />
                    Our team will contact you to schedule setup.
                  </p>
                </div>

                <button type="submit" disabled={isLoading} className={cn('w-full h-11 bg-crimson-800 text-white font-medium rounded-lg', 'hover:bg-crimson-700 transition-colors', 'disabled:opacity-50 disabled:cursor-not-allowed', 'flex items-center justify-center')}>
                  {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Access Request'}
                </button>
              </>}
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have access?{' '}
            <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-medium">
              Sign in
            </Link>
          </p>

          {/* Language Selector */}
          <div className="mt-6 flex justify-center">
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>
    </div>;
};
export default RegisterPage;