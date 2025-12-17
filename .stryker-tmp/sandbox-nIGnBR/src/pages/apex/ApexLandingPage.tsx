// @ts-nocheck
// =============================================================================
// DATACENDIA - APEX PRODUCTS LANDING PAGE
// Premium standalone offerings showcase
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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Bell, ArrowRight, Sparkles, BarChart3, Shield, Zap, Check } from 'lucide-react';
interface ApexProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  path: string;
  features: string[];
  pricing: string;
}
const apexProducts: ApexProduct[] = stryMutAct_9fa48("19185") ? [] : (stryCov_9fa48("19185"), [stryMutAct_9fa48("19186") ? {} : (stryCov_9fa48("19186"), {
  id: 'forecast',
  name: 'CendiaForecast™',
  tagline: 'AI-Powered Financial Forecasting',
  description: 'Predict revenue, cash flow, and key metrics with enterprise-grade accuracy. Leverage machine learning to model scenarios and make data-driven decisions.',
  icon: <TrendingUp className="w-8 h-8" />,
  color: 'text-emerald-500',
  gradient: 'from-emerald-500 to-teal-600',
  path: '/apex/forecast',
  features: stryMutAct_9fa48("19194") ? [] : (stryCov_9fa48("19194"), ['Multi-scenario revenue modeling', 'Cash flow predictions with confidence intervals', 'Seasonal pattern detection', 'What-if analysis tools', 'Executive dashboard exports', 'API integration ready']),
  pricing: 'Starting at $2,500/month'
}), stryMutAct_9fa48("19202") ? {} : (stryCov_9fa48("19202"), {
  id: 'sentry',
  name: 'CendiaSentry™',
  tagline: 'Intelligent Alert & Monitoring',
  description: 'Never miss a critical event. AI-powered anomaly detection monitors your entire organization and alerts the right people at the right time.',
  icon: <Bell className="w-8 h-8" />,
  color: 'text-orange-500',
  gradient: 'from-orange-500 to-red-600',
  path: '/apex/sentry',
  features: stryMutAct_9fa48("19210") ? [] : (stryCov_9fa48("19210"), ['Real-time anomaly detection', 'Smart alert routing & escalation', 'Customizable thresholds', 'Integration with 50+ data sources', 'Mobile push notifications', 'Incident timeline & postmortems']),
  pricing: 'Starting at $1,500/month'
})]);
export const ApexLandingPage: React.FC = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/80" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-primary-300 text-sm font-medium">Apex Product Suite</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Premium Intelligence
              <br />
              <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                Standalone Solutions
              </span>
            </h1>
            
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Purpose-built AI products that deliver immediate value. 
              Deploy independently or integrate with the full Datacendia platform.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {apexProducts.map(stryMutAct_9fa48("19219") ? () => undefined : (stryCov_9fa48("19219"), product => <div key={product.id} className="group relative bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700 hover:border-neutral-500 transition-all duration-300 overflow-hidden">
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${product.gradient}`} />
                
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${product.gradient} text-white`}>
                      {product.icon}
                    </div>
                    <span className="text-xs text-neutral-500 bg-neutral-700/50 px-3 py-1 rounded-full">
                      {product.pricing}
                    </span>
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {product.name}
                  </h2>
                  <p className={`text-sm font-medium ${product.color} mb-4`}>
                    {product.tagline}
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {product.features.map(stryMutAct_9fa48("19223") ? () => undefined : (stryCov_9fa48("19223"), (feature, idx) => <li key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check className={`w-4 h-4 ${product.color}`} />
                        {feature}
                      </li>))}
                  </ul>

                  {/* CTA */}
                  <button onClick={stryMutAct_9fa48("19225") ? () => undefined : (stryCov_9fa48("19225"), () => navigate(product.path))} className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${product.gradient} text-white font-medium rounded-xl hover:opacity-90 transition-opacity group`}>
                    Explore {product.name.split('™')[0]}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>))}
          </div>
        </div>
      </div>

      {/* Why Apex Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose Apex?</h2>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Standalone products that deliver enterprise value without the complexity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-500/20 text-primary-400 mb-4">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Rapid Deployment</h3>
            <p className="text-neutral-400 text-sm">
              Go live in days, not months. Pre-built integrations and guided setup.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 mb-4">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Immediate ROI</h3>
            <p className="text-neutral-400 text-sm">
              See value from day one. Proven outcomes across industries.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-500/20 text-orange-400 mb-4">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enterprise Grade</h3>
            <p className="text-neutral-400 text-sm">
              SOC 2 compliant. On-prem options. Full data sovereignty.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-primary-600/20 to-cyan-600/20 rounded-2xl p-8 md:p-12 text-center border border-primary-500/30">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Intelligence?
          </h2>
          <p className="text-neutral-300 mb-8 max-w-xl mx-auto">
            Start with a single product or explore the full Datacendia platform. 
            Our team is here to help you find the right solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={stryMutAct_9fa48("19228") ? () => undefined : (stryCov_9fa48("19228"), () => navigate('/cortex'))} className="px-8 py-3 bg-white text-neutral-900 font-medium rounded-xl hover:bg-neutral-100 transition-colors">
              Explore Full Platform
            </button>
            <button onClick={stryMutAct_9fa48("19230") ? () => undefined : (stryCov_9fa48("19230"), () => navigate('/contact'))} className="px-8 py-3 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default ApexLandingPage;