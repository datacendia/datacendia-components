/**
 * CENDIA FORECAST - Apex Package Service Page
 * Predictive Analytics & Scenario Planning
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, LineChart, Target, GitBranch, AlertTriangle, Brain, Sparkles, ArrowRight, Check, Play, BarChart3, Clock, Zap, Shield } from 'lucide-react';
interface ServiceFeature {
  icon: React.FC<any>;
  title: string;
  description: string;
  capabilities: string[];
}
const SERVICES: ServiceFeature[] = stryMutAct_9fa48("19232") ? [] : (stryCov_9fa48("19232"), [stryMutAct_9fa48("19233") ? {} : (stryCov_9fa48("19233"), {
  icon: TrendingUp,
  title: 'Revenue Forecasting',
  description: 'AI-powered revenue predictions with confidence intervals and scenario analysis.',
  capabilities: stryMutAct_9fa48("19236") ? [] : (stryCov_9fa48("19236"), ['Multi-horizon forecasting (daily to annual)', 'Seasonality and trend decomposition', 'Confidence interval analysis', 'Automated anomaly detection', 'What-if scenario modeling'])
}), stryMutAct_9fa48("19242") ? {} : (stryCov_9fa48("19242"), {
  icon: LineChart,
  title: 'Demand Planning',
  description: 'Optimize inventory and resource allocation with predictive demand analytics.',
  capabilities: stryMutAct_9fa48("19245") ? [] : (stryCov_9fa48("19245"), ['SKU-level demand forecasting', 'Supply chain optimization', 'Lead time predictions', 'Stock-out risk alerts', 'Supplier performance scoring'])
}), stryMutAct_9fa48("19251") ? {} : (stryCov_9fa48("19251"), {
  icon: Target,
  title: 'Goal Tracking',
  description: 'Real-time progress tracking with AI-powered trajectory predictions.',
  capabilities: stryMutAct_9fa48("19254") ? [] : (stryCov_9fa48("19254"), ['KPI achievement probability', 'Goal trajectory analysis', 'Intervention recommendations', 'Team performance forecasting', 'Milestone risk assessment'])
}), stryMutAct_9fa48("19260") ? {} : (stryCov_9fa48("19260"), {
  icon: GitBranch,
  title: 'Scenario Builder',
  description: 'Create and compare multiple future scenarios with Monte Carlo simulations.',
  capabilities: stryMutAct_9fa48("19263") ? [] : (stryCov_9fa48("19263"), ['Interactive scenario creation', 'Monte Carlo simulations', 'Sensitivity analysis', 'Probability distributions', 'Decision tree modeling'])
}), stryMutAct_9fa48("19269") ? {} : (stryCov_9fa48("19269"), {
  icon: AlertTriangle,
  title: 'Risk Analytics',
  description: 'Identify and quantify business risks before they materialize.',
  capabilities: stryMutAct_9fa48("19272") ? [] : (stryCov_9fa48("19272"), ['Risk factor identification', 'Impact quantification', 'Mitigation recommendations', 'Early warning system', 'Regulatory compliance risk'])
}), stryMutAct_9fa48("19278") ? {} : (stryCov_9fa48("19278"), {
  icon: Brain,
  title: 'ML Model Hub',
  description: 'Deploy custom machine learning models with auto-tuning and monitoring.',
  capabilities: stryMutAct_9fa48("19281") ? [] : (stryCov_9fa48("19281"), ['AutoML model training', 'Feature engineering automation', 'Model versioning & A/B testing', 'Real-time inference', 'Drift detection & retraining'])
})]);
const METRICS = stryMutAct_9fa48("19287") ? [] : (stryCov_9fa48("19287"), [stryMutAct_9fa48("19288") ? {} : (stryCov_9fa48("19288"), {
  label: 'Forecast Accuracy',
  value: '94%',
  change: '+8%'
}), stryMutAct_9fa48("19292") ? {} : (stryCov_9fa48("19292"), {
  label: 'Models Deployed',
  value: '12',
  change: '+3'
}), stryMutAct_9fa48("19296") ? {} : (stryCov_9fa48("19296"), {
  label: 'Scenarios Analyzed',
  value: '847',
  change: '+156'
}), stryMutAct_9fa48("19300") ? {} : (stryCov_9fa48("19300"), {
  label: 'Risks Identified',
  value: '23',
  change: '-5'
})]);
export const CendiaForecastPage: React.FC = () => {
  const [activeService, setActiveService] = useState(0);
  const [demoMode, setDemoMode] = useState(stryMutAct_9fa48("19305") ? true : (stryCov_9fa48("19305"), false));
  return <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            APEX PACKAGE
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Cendia<span className="text-indigo-400">Forecast</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mb-8">
            Transform your planning with AI-powered predictions. Forecast revenue,
            model scenarios, and identify risks before they impact your business.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/demo?package=forecast" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition">
              <Play className="w-5 h-5" />
              Request Demo
            </Link>
            <button onClick={stryMutAct_9fa48("19306") ? () => undefined : (stryCov_9fa48("19306"), () => setDemoMode(stryMutAct_9fa48("19307") ? false : (stryCov_9fa48("19307"), true)))} className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition border border-slate-700">
              <Zap className="w-5 h-5" />
              Try Interactive Demo
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRICS.map(stryMutAct_9fa48("19308") ? () => undefined : (stryCov_9fa48("19308"), metric => <div key={metric.label} className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-slate-400">{metric.label}</div>
                <div className="text-xs text-green-400 mt-1">{metric.change} this month</div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            6 Powerful Forecasting Services
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each service is powered by state-of-the-art machine learning models,
            trained on your data and continuously improving.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(stryMutAct_9fa48("19309") ? () => undefined : (stryCov_9fa48("19309"), (service, index) => <div key={service.title} onClick={stryMutAct_9fa48("19310") ? () => undefined : (stryCov_9fa48("19310"), () => setActiveService(index))} className={`p-6 rounded-xl border cursor-pointer transition-all ${(stryMutAct_9fa48("19314") ? activeService !== index : stryMutAct_9fa48("19313") ? false : stryMutAct_9fa48("19312") ? true : (stryCov_9fa48("19312", "19313", "19314"), activeService === index)) ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}>
              <service.icon className={`w-10 h-10 mb-4 ${(stryMutAct_9fa48("19320") ? activeService !== index : stryMutAct_9fa48("19319") ? false : stryMutAct_9fa48("19318") ? true : (stryCov_9fa48("19318", "19319", "19320"), activeService === index)) ? 'text-indigo-400' : 'text-slate-400'}`} />
              <h3 className="text-xl font-semibold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {service.description}
              </p>
              <ul className="space-y-2">
                {stryMutAct_9fa48("19323") ? service.capabilities.map(cap => <li key={cap} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {cap}
                  </li>) : (stryCov_9fa48("19323"), service.capabilities.slice(0, 3).map(stryMutAct_9fa48("19324") ? () => undefined : (stryCov_9fa48("19324"), cap => <li key={cap} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {cap}
                  </li>)))}
              </ul>
              <button className="mt-4 text-indigo-400 text-sm font-medium flex items-center gap-1 hover:text-indigo-300">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>))}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left: Demo Controls */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                See It In Action
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span className="font-medium text-white">Revenue Forecast</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Q1 2025 projected revenue: <span className="text-green-400">$12.4M</span>
                    <br />
                    Confidence: <span className="text-indigo-400">87%</span>
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span className="font-medium text-white">Risk Alert</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Churn risk detected: <span className="text-amber-400">3 enterprise accounts</span>
                    <br />
                    Recommended action: Proactive outreach
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <GitBranch className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium text-white">Scenario Analysis</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Best case: <span className="text-green-400">+24% growth</span>
                    <br />
                    Base case: <span className="text-slate-300">+15% growth</span>
                    <br />
                    Worst case: <span className="text-red-400">+3% growth</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Visualization */}
            <div className="bg-slate-900/50 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <TrendingUp className="w-24 h-24 text-indigo-400" />
                </div>
                <div className="text-white font-semibold">Live Forecasting Engine</div>
                <div className="text-slate-400 text-sm">Processing 1.2M data points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Enterprise-Grade Technology
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {(stryMutAct_9fa48("19325") ? [] : (stryCov_9fa48("19325"), [stryMutAct_9fa48("19326") ? {} : (stryCov_9fa48("19326"), {
          icon: Brain,
          title: 'Advanced ML Models',
          items: stryMutAct_9fa48("19328") ? [] : (stryCov_9fa48("19328"), ['XGBoost, LightGBM, Prophet', 'Neural networks (LSTM, Transformer)', 'Ensemble methods', 'AutoML optimization'])
        }), stryMutAct_9fa48("19333") ? {} : (stryCov_9fa48("19333"), {
          icon: Shield,
          title: 'Security & Compliance',
          items: stryMutAct_9fa48("19335") ? [] : (stryCov_9fa48("19335"), ['SOC 2 Type II certified', 'GDPR compliant', 'Data encryption at rest', 'Role-based access control'])
        }), stryMutAct_9fa48("19340") ? {} : (stryCov_9fa48("19340"), {
          icon: Clock,
          title: 'Real-time Processing',
          items: stryMutAct_9fa48("19342") ? [] : (stryCov_9fa48("19342"), ['Sub-second predictions', 'Streaming data ingestion', 'Automatic model refresh', '99.9% uptime SLA'])
        })])).map(stryMutAct_9fa48("19347") ? () => undefined : (stryCov_9fa48("19347"), section => <div key={section.title} className="p-6 bg-slate-800/30 rounded-xl border border-slate-700">
              <section.icon className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map(stryMutAct_9fa48("19348") ? () => undefined : (stryCov_9fa48("19348"), item => <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    {item}
                  </li>))}
              </ul>
            </div>))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Forecasting?
          </h3>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join leading enterprises using CendiaForecast to predict the future
            with confidence. Get started with a personalized demo.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/demo?package=forecast" className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition">
              Schedule Demo
            </Link>
            <Link to="/pricing" className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default CendiaForecastPage;