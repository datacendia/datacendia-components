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
import { Link } from 'react-router-dom';
import { Cookie, Settings, BarChart, Shield } from 'lucide-react';
export const CookiePolicyPage: React.FC = () => {
  const cookieTypes = stryMutAct_9fa48("52582") ? [] : (stryCov_9fa48("52582"), [stryMutAct_9fa48("52583") ? {} : (stryCov_9fa48("52583"), {
    icon: Shield,
    name: 'Essential Cookies',
    description: 'Required for the platform to function. Cannot be disabled.',
    examples: stryMutAct_9fa48("52586") ? [] : (stryCov_9fa48("52586"), ['Session management', 'Security tokens', 'Load balancing']),
    required: stryMutAct_9fa48("52590") ? false : (stryCov_9fa48("52590"), true)
  }), stryMutAct_9fa48("52591") ? {} : (stryCov_9fa48("52591"), {
    icon: Settings,
    name: 'Functional Cookies',
    description: 'Remember your preferences and settings.',
    examples: stryMutAct_9fa48("52594") ? [] : (stryCov_9fa48("52594"), ['Language preference', 'Theme selection', 'Dashboard layout']),
    required: stryMutAct_9fa48("52598") ? true : (stryCov_9fa48("52598"), false)
  }), stryMutAct_9fa48("52599") ? {} : (stryCov_9fa48("52599"), {
    icon: BarChart,
    name: 'Analytics Cookies',
    description: 'Help us understand how you use the platform.',
    examples: stryMutAct_9fa48("52602") ? [] : (stryCov_9fa48("52602"), ['Page views', 'Feature usage', 'Performance metrics']),
    required: stryMutAct_9fa48("52606") ? true : (stryCov_9fa48("52606"), false)
  })]);
  return <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/privacy" className="text-neutral-600 hover:text-neutral-900">Privacy</Link>
            <Link to="/terms" className="text-neutral-600 hover:text-neutral-900">Terms</Link>
            <Link to="/security" className="text-neutral-600 hover:text-neutral-900">Security</Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Cookie className="w-10 h-10 text-neutral-700" />
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Cookie Policy</h1>
            <p className="text-neutral-500">Last updated: December 2024</p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none">
          <p className="text-lg text-neutral-600 mb-8">
            This policy explains how Datacendia uses cookies and similar technologies to recognize 
            you when you visit our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">What Are Cookies?</h2>
          <p className="text-neutral-600 mb-6">
            Cookies are small data files placed on your device when you visit a website. They are 
            widely used to make websites work more efficiently and provide reporting information.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Cookies We Use</h2>
          <div className="space-y-6 mb-8">
            {cookieTypes.map(stryMutAct_9fa48("52607") ? () => undefined : (stryCov_9fa48("52607"), (cookie, index) => <div key={index} className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="flex items-start gap-4">
                  <cookie.icon className="w-8 h-8 text-neutral-700 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{cookie.name}</h3>
                      {stryMutAct_9fa48("52610") ? cookie.required || <span className="px-2 py-0.5 text-xs bg-neutral-200 rounded-full">Required</span> : stryMutAct_9fa48("52609") ? false : stryMutAct_9fa48("52608") ? true : (stryCov_9fa48("52608", "52609", "52610"), cookie.required && <span className="px-2 py-0.5 text-xs bg-neutral-200 rounded-full">Required</span>)}
                    </div>
                    <p className="text-neutral-600 mb-3">{cookie.description}</p>
                    <div className="text-sm text-neutral-500">
                      <strong>Examples:</strong> {cookie.examples.join(', ')}
                    </div>
                  </div>
                </div>
              </div>))}
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Air-Gapped Deployments</h2>
          <p className="text-neutral-600 mb-6">
            For on-premise and air-gapped deployments, Datacendia operates with <strong>zero external 
            cookies or tracking</strong>. Only essential session cookies are used, and all data 
            remains within your infrastructure.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Managing Cookies</h2>
          <p className="text-neutral-600 mb-6">
            You can control cookies through your browser settings. Note that disabling essential 
            cookies may prevent the platform from functioning correctly.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p className="text-neutral-600">
            Questions about our cookie policy? Contact us at{' '}
            <a href="mailto:privacy@datacendia.com" className="text-neutral-900 hover:underline">
              privacy@datacendia.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8 border-t border-neutral-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia, Inc. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/privacy" className="hover:text-neutral-900">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-neutral-900">Terms of Service</Link>
            <Link to="/security" className="hover:text-neutral-900">Security</Link>
          </div>
        </div>
      </footer>
    </div>;
};
export default CookiePolicyPage;