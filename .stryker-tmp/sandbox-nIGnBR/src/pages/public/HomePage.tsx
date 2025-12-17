// @ts-nocheck
// =============================================================================
// DATACENDIA - PUBLIC HOME PAGE
// =============================================================================

// File: src/pages/public/HomePage.tsx
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
import { cn } from '../../../lib/utils';
import { Logo } from '../../components/brand';

// Pillar data
const pillars = stryMutAct_9fa48("53075") ? [] : (stryCov_9fa48("53075"), [stryMutAct_9fa48("53076") ? {} : (stryCov_9fa48("53076"), {
  id: 'lineage',
  name: 'Lineage',
  icon: '🔗',
  description: 'Trace every data point to its source'
}), stryMutAct_9fa48("53081") ? {} : (stryCov_9fa48("53081"), {
  id: 'metrics',
  name: 'Metrics',
  icon: '📊',
  description: 'Unified KPIs across all systems'
}), stryMutAct_9fa48("53086") ? {} : (stryCov_9fa48("53086"), {
  id: 'predict',
  name: 'Predict',
  icon: '🔮',
  description: 'AI-powered forecasting'
}), stryMutAct_9fa48("53091") ? {} : (stryCov_9fa48("53091"), {
  id: 'flow',
  name: 'Flow',
  icon: '🔄',
  description: 'Automated workflows'
}), stryMutAct_9fa48("53096") ? {} : (stryCov_9fa48("53096"), {
  id: 'guard',
  name: 'Guard',
  icon: '🛡️',
  description: 'Data governance & compliance'
}), stryMutAct_9fa48("53101") ? {} : (stryCov_9fa48("53101"), {
  id: 'helm',
  name: 'Helm',
  icon: '⚓',
  description: 'Strategic decision support'
}), stryMutAct_9fa48("53106") ? {} : (stryCov_9fa48("53106"), {
  id: 'health',
  name: 'Health',
  icon: '💓',
  description: 'Organizational vitality metrics'
}), stryMutAct_9fa48("53111") ? {} : (stryCov_9fa48("53111"), {
  id: 'ethics',
  name: 'Ethics',
  icon: '⚖️',
  description: 'Built-in ethical oversight'
})]);
const cortexSpaces = stryMutAct_9fa48("53116") ? [] : (stryCov_9fa48("53116"), [stryMutAct_9fa48("53117") ? {} : (stryCov_9fa48("53117"), {
  name: 'The Graph',
  description: 'Navigate your knowledge universe',
  icon: '🕸️'
}), stryMutAct_9fa48("53121") ? {} : (stryCov_9fa48("53121"), {
  name: 'The Council',
  description: 'AI advisors that reason together',
  icon: '👥'
}), stryMutAct_9fa48("53125") ? {} : (stryCov_9fa48("53125"), {
  name: 'The Pulse',
  description: 'Real-time organizational health',
  icon: '💓'
}), stryMutAct_9fa48("53129") ? {} : (stryCov_9fa48("53129"), {
  name: 'The Lens',
  description: 'See possible futures',
  icon: '🔮'
}), stryMutAct_9fa48("53133") ? {} : (stryCov_9fa48("53133"), {
  name: 'The Bridge',
  description: 'Take action across systems',
  icon: '🌉'
})]);
const trustedBy = stryMutAct_9fa48("53137") ? [] : (stryCov_9fa48("53137"), [stryMutAct_9fa48("53138") ? {} : (stryCov_9fa48("53138"), {
  name: 'Fortune 500',
  logo: '🏢'
}), stryMutAct_9fa48("53141") ? {} : (stryCov_9fa48("53141"), {
  name: 'Global Bank',
  logo: '🏦'
}), stryMutAct_9fa48("53144") ? {} : (stryCov_9fa48("53144"), {
  name: 'Healthcare',
  logo: '🏥'
}), stryMutAct_9fa48("53147") ? {} : (stryCov_9fa48("53147"), {
  name: 'Government',
  logo: '🏛️'
}), stryMutAct_9fa48("53150") ? {} : (stryCov_9fa48("53150"), {
  name: 'Tech Giant',
  logo: '💻'
})]);
const stats = stryMutAct_9fa48("53153") ? [] : (stryCov_9fa48("53153"), [stryMutAct_9fa48("53154") ? {} : (stryCov_9fa48("53154"), {
  value: '$2.1B',
  label: 'Decisions Optimized',
  suffix: ''
}), stryMutAct_9fa48("53158") ? {} : (stryCov_9fa48("53158"), {
  value: '94',
  label: 'Forecast Accuracy',
  suffix: '%'
}), stryMutAct_9fa48("53162") ? {} : (stryCov_9fa48("53162"), {
  value: '50',
  label: 'Time Saved',
  suffix: '%'
}), stryMutAct_9fa48("53166") ? {} : (stryCov_9fa48("53166"), {
  value: '99.9',
  label: 'Uptime SLA',
  suffix: '%'
})]);
const testimonials = stryMutAct_9fa48("53170") ? [] : (stryCov_9fa48("53170"), [stryMutAct_9fa48("53171") ? {} : (stryCov_9fa48("53171"), {
  quote: 'Datacendia transformed how we make strategic decisions. The AI Council gives us perspectives we never considered.',
  author: 'Sarah Chen',
  title: 'CFO, Fortune 500 Company',
  avatar: '👩‍💼'
}), stryMutAct_9fa48("53176") ? {} : (stryCov_9fa48("53176"), {
  quote: 'Finally, a platform that unifies all our data sources and gives us real predictive power.',
  author: 'Michael Torres',
  title: 'CTO, Global Healthcare System',
  avatar: '👨‍💻'
}), stryMutAct_9fa48("53181") ? {} : (stryCov_9fa48("53181"), {
  quote: 'The ROI was immediate. We caught three major risks before they became crises.',
  author: 'Emily Watson',
  title: 'Chief Risk Officer, Investment Bank',
  avatar: '👩‍💼'
})]);
const apexPackages = stryMutAct_9fa48("53186") ? [] : (stryCov_9fa48("53186"), [stryMutAct_9fa48("53187") ? {} : (stryCov_9fa48("53187"), {
  name: 'CendiaForecast',
  icon: '📈',
  description: 'Predictive Analytics',
  link: '/apex/forecast'
}), stryMutAct_9fa48("53192") ? {} : (stryCov_9fa48("53192"), {
  name: 'CendiaSentry',
  icon: '🛡️',
  description: 'Security & Compliance',
  link: '/apex/sentry'
}), stryMutAct_9fa48("53197") ? {} : (stryCov_9fa48("53197"), {
  name: 'CendiaFlow',
  icon: '⚡',
  description: 'Workflow Automation',
  link: '/apex/flow'
}), stryMutAct_9fa48("53202") ? {} : (stryCov_9fa48("53202"), {
  name: 'CendiaInsight',
  icon: '💡',
  description: 'Business Intelligence',
  link: '/apex/insight'
})]);
export const HomePage: React.FC = () => {
  return <div className="min-h-screen bg-white">
      {/* ================================================================= */}
      {/* NAVIGATION */}
      {/* ================================================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link to="/product" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                Product
              </Link>
              <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                Pricing
              </Link>
              <Link to="/apex/forecast" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                Solutions
              </Link>
              <Link to="/about" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                About
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Sign In
              </Link>
              <Link to="/demo" className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 transition-all duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================================================================= */}
      {/* HERO SECTION */}
      {/* ================================================================= */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
              <span>🚀</span>
              <span>Sovereign Enterprise Intelligence Platform</span>
            </div>
            
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-6">Datacendia is a Sovereign Enterprise Intelligence Platform</p>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight mb-6">
              Your organization's intelligence,{' '}
              <span className="text-primary-600">sovereign and whole</span>
            </h1>
            
            <p className="text-xl text-neutral-600 mb-4 max-w-2xl mx-auto">
              A governed decision layer that runs on your infrastructure, replays any moment in time, and proves why you made each decision.
            </p>
            
            <p className="text-base text-neutral-500 mb-10 max-w-xl mx-auto italic">
              "We do not host your data. We return your mind."
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/demo" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 active:scale-95 transition-all duration-200 text-lg cursor-pointer">
                Request Early Access
              </Link>
              <Link to="/product" className="w-full sm:w-auto px-8 py-4 border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 active:scale-95 transition-all duration-200 text-lg cursor-pointer">
                Explore Platform
              </Link>
            </div>
          </div>

          {/* Hero Visual - Animated Cortex */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-primary-100 via-white to-secondary-100 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
              {/* Animated circles */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary-200 rounded-full animate-ping opacity-20" style={stryMutAct_9fa48("53209") ? {} : (stryCov_9fa48("53209"), {
                animationDuration: '3s'
              })} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-secondary-200 rounded-full animate-ping opacity-30" style={stryMutAct_9fa48("53211") ? {} : (stryCov_9fa48("53211"), {
                animationDuration: '2.5s'
              })} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary-300 rounded-full animate-ping opacity-40" style={stryMutAct_9fa48("53213") ? {} : (stryCov_9fa48("53213"), {
                animationDuration: '2s'
              })} />
              </div>
              
              {/* Floating nodes */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary-500 rounded-full animate-bounce" style={stryMutAct_9fa48("53215") ? {} : (stryCov_9fa48("53215"), {
              animationDuration: '2s'
            })} />
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-secondary-500 rounded-full animate-bounce" style={stryMutAct_9fa48("53217") ? {} : (stryCov_9fa48("53217"), {
              animationDuration: '1.5s',
              animationDelay: '0.5s'
            })} />
              <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-primary-400 rounded-full animate-bounce" style={stryMutAct_9fa48("53220") ? {} : (stryCov_9fa48("53220"), {
              animationDuration: '2.5s',
              animationDelay: '0.3s'
            })} />
              <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-secondary-400 rounded-full animate-bounce" style={stryMutAct_9fa48("53223") ? {} : (stryCov_9fa48("53223"), {
              animationDuration: '1.8s',
              animationDelay: '0.7s'
            })} />
              
              {/* Center brain icon with pulse */}
              <div className="relative z-10 text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-pulse" style={stryMutAct_9fa48("53226") ? {} : (stryCov_9fa48("53226"), {
                  animationDuration: '2s'
                })} />
                  <p className="text-8xl relative z-10 drop-shadow-lg">🧠</p>
                </div>
                <p className="text-primary-600 font-semibold mt-4 animate-pulse">The Cortex</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FIRST SCROLL - THREE CORE CAPABILITIES */}
      {/* ================================================================= */}
      <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Chronos - Rewind Any Decision */}
            <Link to="/cortex/intelligence/chronos" className="group p-8 bg-white rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                ⏪
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Rewind Any Decision</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Travel back to any moment in your organization's history. See exactly what was known, who decided, and why. Built for audits and "why did we do that?" moments.
              </p>
              <p className="text-xs text-primary-600 font-medium mt-4 group-hover:underline">CendiaChronos™ →</p>
            </Link>

            {/* Council - Governed AI Council */}
            <Link to="/cortex/council" className="group p-8 bg-white rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                👥
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Governed AI Council</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Don't ask one AI. Convene a council. CFO, CISO, Ethics Officer—they debate, dissent, and reach consensus. Every deliberation is recorded.
              </p>
              <p className="text-xs text-primary-600 font-medium mt-4 group-hover:underline">The Council™ →</p>
            </Link>

            {/* Honesty Matrices - Radical Transparency */}
            <Link to="/honesty" className="group p-8 bg-white rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                🔍
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Radical Transparency</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                We publish what we can't do. Every limitation, every tradeoff, every honest answer—before you buy. See our Honesty Matrices.
              </p>
              <p className="text-xs text-primary-600 font-medium mt-4 group-hover:underline">View Honesty Matrices →</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* PROBLEM STATEMENT */}
      {/* ================================================================= */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              The Enterprise Intelligence Crisis
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Today's organizations are data-rich but insight-poor
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-neutral-200">
              <div className="w-12 h-12 bg-error-light rounded-xl flex items-center justify-center text-2xl mb-4">
                🌊
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Data Chaos</h3>
              <p className="text-neutral-600">
                Critical information scattered across 200+ SaaS tools. No single source of truth. 
                Executives make decisions on incomplete data.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl border border-neutral-200">
              <div className="w-12 h-12 bg-warning-light rounded-xl flex items-center justify-center text-2xl mb-4">
                🔧
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Tool Sprawl</h3>
              <p className="text-neutral-600">
                BI for analytics. CRM for customers. ERP for operations. Each silo speaks a different 
                language. Integration is a nightmare.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-2xl border border-neutral-200">
              <div className="w-12 h-12 bg-info-light rounded-xl flex items-center justify-center text-2xl mb-4">
                🔮
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Foresight</h3>
              <p className="text-neutral-600">
                Dashboards show yesterday. But what about tomorrow? Organizations react to crises 
                instead of preventing them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE CORTEX */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Enter The Cortex
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Five interconnected spaces that transform how you understand and run your organization
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {cortexSpaces.map(stryMutAct_9fa48("53228") ? () => undefined : (stryCov_9fa48("53228"), (space, index) => <div key={space.name} className="p-6 bg-white rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="text-4xl mb-4">{space.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {space.name}
                </h3>
                <p className="text-sm text-neutral-500">{space.description}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE 8 PILLARS */}
      {/* ================================================================= */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The 8 Pillars</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              The foundational capabilities that power sovereign enterprise intelligence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pillars.map(stryMutAct_9fa48("53229") ? () => undefined : (stryCov_9fa48("53229"), pillar => <div key={pillar.id} className="p-6 bg-white/10 backdrop-blur rounded-2xl hover:bg-white/20 transition-colors cursor-pointer">
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h3 className="text-lg font-semibold mb-1">{pillar.name}</h3>
                <p className="text-sm text-white/70">{pillar.description}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* STATS SECTION */}
      {/* ================================================================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stryMutAct_9fa48("53230") ? () => undefined : (stryCov_9fa48("53230"), stat => <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* APEX PACKAGES */}
      {/* ================================================================= */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Apex Packages
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Purpose-built solutions for your most critical business needs
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {apexPackages.map(stryMutAct_9fa48("53231") ? () => undefined : (stryCov_9fa48("53231"), pkg => <Link key={pkg.name} to={pkg.link} className="p-6 bg-white rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-xl transition-all group">
                <div className="text-4xl mb-4">{pkg.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">
                  {pkg.name}
                </h3>
                <p className="text-neutral-500">{pkg.description}</p>
              </Link>))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TESTIMONIALS */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              What Leaders Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(stryMutAct_9fa48("53232") ? () => undefined : (stryCov_9fa48("53232"), (testimonial, index) => <div key={index} className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-4xl mb-4">"</div>
                <p className="text-neutral-700 mb-6 italic">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">{testimonial.author}</div>
                    <div className="text-sm text-neutral-500">{testimonial.title}</div>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TRUST SECTION */}
      {/* ================================================================= */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-neutral-500 text-sm uppercase tracking-wider mb-8">
              Trusted by forward-thinking enterprises
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {trustedBy.map(stryMutAct_9fa48("53233") ? () => undefined : (stryCov_9fa48("53233"), (company, index) => <div key={index} className="flex items-center gap-2 text-neutral-400">
                  <span className="text-3xl">{company.logo}</span>
                  <span className="text-lg font-semibold">{company.name}</span>
                </div>))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* VIDEO SECTION */}
      {/* ================================================================= */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              See Datacendia in Action
            </h2>
            <p className="text-xl text-neutral-600">
              Watch how organizations are transforming decision-making
            </p>
          </div>
          <div className="aspect-video bg-neutral-900 rounded-2xl overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-white font-semibold">Product Demo</div>
              <div className="text-white/70 text-sm">3 min overview</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CTA SECTION */}
      {/* ================================================================= */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to unify your organization's intelligence?
          </h2>
          <p className="text-xl text-neutral-400 mb-10">
            Join the enterprises that have chosen sovereignty over scattered data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/demo" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors text-lg">
              Request Demo
            </Link>
            <Link to="/pricing" className="w-full sm:w-auto px-8 py-4 border border-neutral-700 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors text-lg">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FOOTER */}
      {/* ================================================================= */}
      <footer className="py-12 bg-neutral-950 text-neutral-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-sm text-neutral-400">Sovereign Enterprise Intelligence</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/product" className="hover:text-white">Platform</Link></li>
                <li><Link to="/product/pillars" className="hover:text-white">8 Pillars</Link></li>
                <li><Link to="/product/cortex" className="hover:text-white">The Cortex</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/manifesto" className="hover:text-white">Manifesto</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/downloads" className="hover:text-white">Downloads</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link to="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2025 Datacendia, Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default HomePage;