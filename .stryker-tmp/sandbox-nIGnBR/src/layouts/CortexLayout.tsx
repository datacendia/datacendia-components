// @ts-nocheck
// =============================================================================
// DATACENDIA - CORTEX LAYOUT
// =============================================================================

// File: src/layouts/CortexLayout.tsx
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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { DataSourceProvider } from '../contexts/DataSourceContext';
import { LanguageProvider, LanguageSelector, useLanguage } from '../contexts/LanguageContext';
import { DataSourceSelector, WorkflowIndicator, QuickActionsBar } from '../components/cortex/DataSourceSelector';
import CommandPalette from '../components/CommandPalette';
import SEO from '../components/SEO';
import { Logo, LogoSimple } from '../components/brand/Logo';
import { SimpleTooltip } from '../components/ui';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../contexts';

// Icons (using inline SVGs for simplicity - replace with icon library)
const Icons = stryMutAct_9fa48("9862") ? {} : (stryCov_9fa48("9862"), {
  Home: stryMutAct_9fa48("9863") ? () => undefined : (stryCov_9fa48("9863"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>),
  Graph: stryMutAct_9fa48("9864") ? () => undefined : (stryCov_9fa48("9864"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>),
  Council: stryMutAct_9fa48("9865") ? () => undefined : (stryCov_9fa48("9865"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>),
  Pulse: stryMutAct_9fa48("9866") ? () => undefined : (stryCov_9fa48("9866"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>),
  Lens: stryMutAct_9fa48("9867") ? () => undefined : (stryCov_9fa48("9867"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>),
  Bridge: stryMutAct_9fa48("9868") ? () => undefined : (stryCov_9fa48("9868"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>),
  Data: stryMutAct_9fa48("9869") ? () => undefined : (stryCov_9fa48("9869"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>),
  Security: stryMutAct_9fa48("9870") ? () => undefined : (stryCov_9fa48("9870"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>),
  Settings: stryMutAct_9fa48("9871") ? () => undefined : (stryCov_9fa48("9871"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>),
  Help: stryMutAct_9fa48("9872") ? () => undefined : (stryCov_9fa48("9872"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>),
  Bell: stryMutAct_9fa48("9873") ? () => undefined : (stryCov_9fa48("9873"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>),
  Search: stryMutAct_9fa48("9874") ? () => undefined : (stryCov_9fa48("9874"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>),
  Menu: stryMutAct_9fa48("9875") ? () => undefined : (stryCov_9fa48("9875"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>),
  ChevronLeft: stryMutAct_9fa48("9876") ? () => undefined : (stryCov_9fa48("9876"), () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>)
});

// Navigation items configuration - 5 Spaces (use translation keys)
const navigationItems = stryMutAct_9fa48("9877") ? [] : (stryCov_9fa48("9877"), [stryMutAct_9fa48("9878") ? {} : (stryCov_9fa48("9878"), {
  id: 'dashboard',
  labelKey: 'sidebar.dashboard',
  icon: Icons.Home,
  path: '/cortex/dashboard',
  tooltip: 'Your command center - overview of all metrics, alerts, and recent activity'
}), stryMutAct_9fa48("9883") ? {} : (stryCov_9fa48("9883"), {
  id: 'graph',
  labelKey: 'sidebar.the_graph',
  icon: Icons.Graph,
  path: '/cortex/graph',
  tooltip: 'Knowledge Graph Explorer - visualize entities, relationships, and data lineage'
}), stryMutAct_9fa48("9888") ? {} : (stryCov_9fa48("9888"), {
  id: 'council',
  labelKey: 'sidebar.the_council',
  icon: Icons.Council,
  path: '/cortex/council',
  tooltip: 'AI Council - multi-agent deliberation for complex decisions with explainable reasoning'
}), stryMutAct_9fa48("9893") ? {} : (stryCov_9fa48("9893"), {
  id: 'pulse',
  labelKey: 'sidebar.the_pulse',
  icon: Icons.Pulse,
  path: '/cortex/pulse',
  tooltip: 'Real-time organizational health monitoring with anomaly detection'
}), stryMutAct_9fa48("9898") ? {} : (stryCov_9fa48("9898"), {
  id: 'lens',
  labelKey: 'sidebar.the_lens',
  icon: Icons.Lens,
  path: '/cortex/lens',
  tooltip: 'Predictive analytics and scenario simulation for strategic planning'
}), stryMutAct_9fa48("9903") ? {} : (stryCov_9fa48("9903"), {
  id: 'bridge',
  labelKey: 'sidebar.the_bridge',
  icon: Icons.Bridge,
  path: '/cortex/bridge',
  tooltip: 'Integration hub - connect external systems, APIs, and data sources'
})]);

// 8 Pillars (Foundational Data Layers)
const pillarItems = stryMutAct_9fa48("9908") ? [] : (stryCov_9fa48("9908"), [stryMutAct_9fa48("9909") ? {} : (stryCov_9fa48("9909"), {
  id: 'helm',
  labelKey: 'sidebar.the_helm',
  emoji: '🎯',
  path: '/cortex/pillars/helm',
  tooltip: 'Metrics Dashboard - KPIs, targets, and performance tracking across your organization'
}), stryMutAct_9fa48("9915") ? {} : (stryCov_9fa48("9915"), {
  id: 'lineage',
  labelKey: 'sidebar.the_lineage',
  emoji: '🔗',
  path: '/cortex/pillars/lineage',
  tooltip: 'Data Lineage - trace data flow from source to consumption with full provenance'
}), stryMutAct_9fa48("9921") ? {} : (stryCov_9fa48("9921"), {
  id: 'predict',
  labelKey: 'sidebar.the_predict',
  emoji: '🔮',
  path: '/cortex/pillars/predict',
  tooltip: 'Forecasting Engine - AI-powered predictions with confidence intervals'
}), stryMutAct_9fa48("9927") ? {} : (stryCov_9fa48("9927"), {
  id: 'flow',
  labelKey: 'sidebar.the_flow',
  emoji: '🌊',
  path: '/cortex/pillars/flow',
  tooltip: 'Workflow Automation - design, execute, and monitor business processes'
}), stryMutAct_9fa48("9933") ? {} : (stryCov_9fa48("9933"), {
  id: 'health',
  labelKey: 'sidebar.the_health',
  emoji: '💓',
  path: '/cortex/pillars/health',
  tooltip: 'Organization Health - data quality, system status, and operational metrics'
}), stryMutAct_9fa48("9939") ? {} : (stryCov_9fa48("9939"), {
  id: 'guard',
  labelKey: 'sidebar.the_guard',
  emoji: '🛡️',
  path: '/cortex/pillars/guard',
  tooltip: 'Security & Alerts - threat monitoring, anomaly detection, and incident response'
}), stryMutAct_9fa48("9945") ? {} : (stryCov_9fa48("9945"), {
  id: 'ethics',
  labelKey: 'sidebar.the_ethics',
  emoji: '⚖️',
  path: '/cortex/pillars/ethics',
  tooltip: 'Stakeholder Voice - ethical AI governance and stakeholder impact assessment'
}), stryMutAct_9fa48("9951") ? {} : (stryCov_9fa48("9951"), {
  id: 'agents',
  labelKey: 'sidebar.the_agents',
  emoji: '🤖',
  path: '/cortex/pillars/agents',
  tooltip: 'AI Agents - autonomous assistants for research, analysis, and task automation'
})]);

// System navigation
const systemItems = stryMutAct_9fa48("9957") ? [] : (stryCov_9fa48("9957"), [stryMutAct_9fa48("9958") ? {} : (stryCov_9fa48("9958"), {
  id: 'data',
  labelKey: 'sidebar.data',
  icon: Icons.Data,
  path: '/cortex/data'
}), stryMutAct_9fa48("9962") ? {} : (stryCov_9fa48("9962"), {
  id: 'security',
  labelKey: 'sidebar.security',
  icon: Icons.Security,
  path: '/cortex/security'
})]);
const bottomNavigationItems = stryMutAct_9fa48("9966") ? [] : (stryCov_9fa48("9966"), [stryMutAct_9fa48("9967") ? {} : (stryCov_9fa48("9967"), {
  id: 'settings',
  labelKey: 'sidebar.settings',
  icon: Icons.Settings,
  path: '/cortex/settings'
}), stryMutAct_9fa48("9971") ? {} : (stryCov_9fa48("9971"), {
  id: 'help',
  labelKey: 'sidebar.help',
  icon: Icons.Help,
  path: '/cortex/help'
})]);

// Get current page for quick actions
const getCurrentPage = (pathname: string): 'graph' | 'council' | 'pulse' | 'lens' | 'bridge' | null => {
  if (stryMutAct_9fa48("9977") ? false : stryMutAct_9fa48("9976") ? true : (stryCov_9fa48("9976", "9977"), pathname.includes('/graph'))) {
    return 'graph';
  }
  if (stryMutAct_9fa48("9982") ? false : stryMutAct_9fa48("9981") ? true : (stryCov_9fa48("9981", "9982"), pathname.includes('/council'))) {
    return 'council';
  }
  if (stryMutAct_9fa48("9987") ? false : stryMutAct_9fa48("9986") ? true : (stryCov_9fa48("9986", "9987"), pathname.includes('/pulse'))) {
    return 'pulse';
  }
  if (stryMutAct_9fa48("9992") ? false : stryMutAct_9fa48("9991") ? true : (stryCov_9fa48("9991", "9992"), pathname.includes('/lens'))) {
    return 'lens';
  }
  if (stryMutAct_9fa48("9997") ? false : stryMutAct_9fa48("9996") ? true : (stryCov_9fa48("9996", "9997"), pathname.includes('/bridge'))) {
    return 'bridge';
  }
  return null;
};

// Premium Features (Decision Intelligence Suite)
const premiumFeatures = stryMutAct_9fa48("10001") ? [] : (stryCov_9fa48("10001"), [stryMutAct_9fa48("10002") ? {} : (stryCov_9fa48("10002"), {
  id: 'chronos',
  label: 'CendiaChronos™',
  icon: '⏱️',
  path: '/cortex/intelligence/chronos',
  description: 'Enterprise Time Machine',
  featured: stryMutAct_9fa48("10008") ? false : (stryCov_9fa48("10008"), true)
}), stryMutAct_9fa48("10009") ? {} : (stryCov_9fa48("10009"), {
  id: 'decision-dna',
  label: 'Decision DNA',
  icon: '🧬',
  path: '/cortex/intelligence/decision-dna',
  description: 'Full lifecycle tracking & replay'
}), stryMutAct_9fa48("10015") ? {} : (stryCov_9fa48("10015"), {
  id: 'pre-mortem',
  label: 'Pre-Mortem Analysis',
  icon: '💀',
  path: '/cortex/intelligence/pre-mortem',
  description: 'Analyze failure modes before deciding'
}), stryMutAct_9fa48("10021") ? {} : (stryCov_9fa48("10021"), {
  id: 'ghost-board',
  label: 'Ghost Board',
  icon: '👻',
  path: '/cortex/intelligence/ghost-board',
  description: 'Rehearse board meetings with AI'
}), stryMutAct_9fa48("10027") ? {} : (stryCov_9fa48("10027"), {
  id: 'decision-debt',
  label: 'Decision Debt',
  icon: '📊',
  path: '/cortex/intelligence/decision-debt',
  description: 'Track stuck decisions & costs'
}), stryMutAct_9fa48("10033") ? {} : (stryCov_9fa48("10033"), {
  id: 'live-demo',
  label: 'Live Demo Mode',
  icon: '⚡',
  path: '/cortex/intelligence/live-demo',
  description: 'Connect to real data instantly'
}), stryMutAct_9fa48("10039") ? {} : (stryCov_9fa48("10039"), {
  id: 'regulatory',
  label: 'Regulatory Absorb',
  icon: '📜',
  path: '/cortex/intelligence/regulatory',
  description: 'Instant compliance learning'
})]);

// Apex Products (Premium Standalone)
const apexProducts = stryMutAct_9fa48("10045") ? [] : (stryCov_9fa48("10045"), [stryMutAct_9fa48("10046") ? {} : (stryCov_9fa48("10046"), {
  id: 'forecast',
  label: 'CendiaForecast™',
  icon: '📈',
  path: '/apex/forecast',
  description: 'AI-Powered Financial Forecasting'
}), stryMutAct_9fa48("10052") ? {} : (stryCov_9fa48("10052"), {
  id: 'sentry',
  label: 'CendiaSentry™',
  icon: '🔔',
  path: '/apex/sentry',
  description: 'Intelligent Alert & Monitoring System'
})]);

// Enterprise Suite (High-Value Features)
const enterpriseFeatures = stryMutAct_9fa48("10058") ? [] : (stryCov_9fa48("10058"), [stryMutAct_9fa48("10059") ? {} : (stryCov_9fa48("10059"), {
  id: 'sovereign',
  label: 'CendiaSovereign™',
  icon: '🏰',
  path: '/cortex/enterprise/sovereign',
  description: 'Fully Local LLM Cluster Orchestrator',
  impact: 'Critical',
  tier: 'Apex'
}), stryMutAct_9fa48("10067") ? {} : (stryCov_9fa48("10067"), {
  id: 'persona-forge',
  label: 'CendiaPersonaForge™',
  icon: '🧠',
  path: '/cortex/enterprise/persona-forge',
  description: 'Enterprise-Trained Digital Twins',
  impact: 'Critical',
  tier: 'Apex'
}), stryMutAct_9fa48("10075") ? {} : (stryCov_9fa48("10075"), {
  id: 'mesh',
  label: 'CendiaMesh™',
  icon: '🕸️',
  path: '/cortex/enterprise/mesh',
  description: 'Cross-Company Decision Network',
  impact: 'Critical',
  tier: 'Apex'
}), stryMutAct_9fa48("10083") ? {} : (stryCov_9fa48("10083"), {
  id: 'govern',
  label: 'CendiaGovern™',
  icon: '⚖️',
  path: '/cortex/enterprise/govern',
  description: 'Legal-Grade Policy & Audit Mapping',
  impact: 'Critical',
  tier: 'Apex'
}), stryMutAct_9fa48("10091") ? {} : (stryCov_9fa48("10091"), {
  id: 'voice',
  label: 'CendiaVoice™',
  icon: '🎙️',
  path: '/cortex/enterprise/voice',
  description: 'AI C-Suite Real-Time Conversation',
  impact: 'High',
  tier: 'Enterprise'
}), stryMutAct_9fa48("10099") ? {} : (stryCov_9fa48("10099"), {
  id: 'autopilot',
  label: 'CendiaAutopilot™',
  icon: '🚀',
  path: '/cortex/enterprise/autopilot',
  description: 'Self-Driving Enterprise Mode',
  impact: 'Critical',
  tier: 'Apex'
}), stryMutAct_9fa48("10107") ? {} : (stryCov_9fa48("10107"), {
  id: 'genomics',
  label: 'CendiaGenomics™',
  icon: '🧬',
  path: '/cortex/enterprise/genomics',
  description: 'Healthcare & Life Sciences Pack',
  impact: 'Critical',
  tier: 'Industry'
}), stryMutAct_9fa48("10115") ? {} : (stryCov_9fa48("10115"), {
  id: 'defense-stack',
  label: 'CendiaDefenseStack™',
  icon: '🛡️',
  path: '/cortex/enterprise/defense-stack',
  description: 'Government/Defense Edition',
  impact: 'Critical',
  tier: 'Industry'
}), stryMutAct_9fa48("10123") ? {} : (stryCov_9fa48("10123"), {
  id: 'omni-translate',
  label: 'CendiaOmniTranslate™',
  icon: '🌍',
  path: '/cortex/enterprise/omni-translate',
  description: '100-Language Enterprise Translator',
  impact: 'High',
  tier: 'Enterprise'
}), stryMutAct_9fa48("10131") ? {} : (stryCov_9fa48("10131"), {
  id: 'veto',
  label: 'CendiaVeto™',
  icon: '🚫',
  path: '/cortex/enterprise/veto',
  description: 'Adversarial Governance Engine',
  impact: 'High',
  tier: 'Enterprise'
}), stryMutAct_9fa48("10139") ? {} : (stryCov_9fa48("10139"), {
  id: 'union',
  label: 'CendiaUnion™',
  icon: '🤝',
  path: '/cortex/enterprise/union',
  description: 'Employee Rights & Wellness Engine',
  impact: 'High',
  tier: 'Enterprise'
}), stryMutAct_9fa48("10147") ? {} : (stryCov_9fa48("10147"), {
  id: 'ledger',
  label: 'CendiaLedger™',
  icon: '📒',
  path: '/cortex/enterprise/ledger',
  description: 'Immutable Decision Blockchain',
  impact: 'Critical',
  tier: 'Apex'
}), // Strategic Intelligence Services
stryMutAct_9fa48("10155") ? {} : (stryCov_9fa48("10155"), {
  id: 'echo',
  label: 'CendiaEcho™',
  icon: '📊',
  path: '/cortex/crown/echo',
  description: 'Decision Outcome Engine - Measure ROI',
  impact: 'High',
  tier: 'Core'
}), stryMutAct_9fa48("10163") ? {} : (stryCov_9fa48("10163"), {
  id: 'redteam',
  label: 'CendiaRedTeam™',
  icon: '💀',
  path: '/cortex/crown/redteam',
  description: 'Adversarial Security Testing',
  impact: 'High',
  tier: 'Core'
}), stryMutAct_9fa48("10171") ? {} : (stryCov_9fa48("10171"), {
  id: 'gnosis',
  label: 'CendiaGnosis™',
  icon: '🎓',
  path: '/cortex/crown/gnosis',
  description: 'AI-Powered Learning Paths',
  impact: 'Strategic',
  tier: 'Core'
})]);

// Sovereign Tier (Premium Enterprise - Regulation, Defense, Long-Horizon)
const sovereignFeatures = stryMutAct_9fa48("10179") ? [] : (stryCov_9fa48("10179"), [stryMutAct_9fa48("10180") ? {} : (stryCov_9fa48("10180"), {
  id: 'crucible',
  label: 'CendiaCrucible™',
  icon: '🔥',
  path: '/cortex/sovereign/crucible',
  description: 'Strategic Decision Forge',
  impact: 'Critical',
  tier: 'Sovereign'
}), stryMutAct_9fa48("10188") ? {} : (stryCov_9fa48("10188"), {
  id: 'panopticon',
  label: 'CendiaPanopticon™',
  icon: '👁️',
  path: '/cortex/sovereign/panopticon',
  description: 'Global Regulation Engine - 25+ Frameworks',
  impact: 'Critical',
  tier: 'Sovereign'
}), stryMutAct_9fa48("10196") ? {} : (stryCov_9fa48("10196"), {
  id: 'aegis',
  label: 'CendiaAegis™',
  icon: '🛡️',
  path: '/cortex/sovereign/aegis',
  description: 'Strategic Defense Intelligence',
  impact: 'Critical',
  tier: 'Sovereign'
}), stryMutAct_9fa48("10204") ? {} : (stryCov_9fa48("10204"), {
  id: 'eternal',
  label: 'CendiaEternal™',
  icon: '♾️',
  path: '/cortex/sovereign/eternal',
  description: 'Ultra-Long Horizon Archive (100+ years)',
  impact: 'Strategic',
  tier: 'Sovereign'
}), stryMutAct_9fa48("10212") ? {} : (stryCov_9fa48("10212"), {
  id: 'symbiont',
  label: 'CendiaSymbiont™',
  icon: '🌐',
  path: '/cortex/sovereign/symbiont',
  description: 'Partnership & Ecosystem Engine',
  impact: 'High',
  tier: 'Sovereign'
}), stryMutAct_9fa48("10220") ? {} : (stryCov_9fa48("10220"), {
  id: 'vox',
  label: 'CendiaVox™',
  icon: '🗣️',
  path: '/cortex/sovereign/vox',
  description: 'Stakeholder Voice Assembly',
  impact: 'High',
  tier: 'Sovereign'
})]);

// Inner layout component that can use translations
const CortexLayoutInner: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(stryMutAct_9fa48("10229") ? true : (stryCov_9fa48("10229"), false));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(stryMutAct_9fa48("10230") ? true : (stryCov_9fa48("10230"), false));
  const [isPremiumDropdownOpen, setIsPremiumDropdownOpen] = useState(stryMutAct_9fa48("10231") ? true : (stryCov_9fa48("10231"), false));
  const [isEnterpriseDropdownOpen, setIsEnterpriseDropdownOpen] = useState(stryMutAct_9fa48("10232") ? true : (stryCov_9fa48("10232"), false));
  const [isSovereignDropdownOpen, setIsSovereignDropdownOpen] = useState(stryMutAct_9fa48("10233") ? true : (stryCov_9fa48("10233"), false));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(stryMutAct_9fa48("10234") ? true : (stryCov_9fa48("10234"), false));
  const location = useLocation();
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const {
    user,
    logout
  } = useAuth();
  const isActive = (path: string) => {
    if (stryMutAct_9fa48("10238") ? path !== '/cortex/dashboard' : stryMutAct_9fa48("10237") ? false : stryMutAct_9fa48("10236") ? true : (stryCov_9fa48("10236", "10237", "10238"), path === '/cortex/dashboard')) {
      return stryMutAct_9fa48("10243") ? location.pathname === '/cortex' && location.pathname === '/cortex/dashboard' : stryMutAct_9fa48("10242") ? false : stryMutAct_9fa48("10241") ? true : (stryCov_9fa48("10241", "10242", "10243"), (stryMutAct_9fa48("10245") ? location.pathname !== '/cortex' : stryMutAct_9fa48("10244") ? false : (stryCov_9fa48("10244", "10245"), location.pathname === '/cortex')) || (stryMutAct_9fa48("10248") ? location.pathname !== '/cortex/dashboard' : stryMutAct_9fa48("10247") ? false : (stryCov_9fa48("10247", "10248"), location.pathname === '/cortex/dashboard')));
    }
    return stryMutAct_9fa48("10250") ? location.pathname.endsWith(path) : (stryCov_9fa48("10250"), location.pathname.startsWith(path));
  };
  const currentPage = getCurrentPage(location.pathname);
  const userInitials = (stryMutAct_9fa48("10251") ? user.name : (stryCov_9fa48("10251"), user?.name)) ? stryMutAct_9fa48("10253") ? user.name.split(' ').map(part => part[0]).join('').toUpperCase() : stryMutAct_9fa48("10252") ? user.name.split(' ').map(part => part[0]).join('').slice(0, 2).toLowerCase() : (stryCov_9fa48("10252", "10253"), user.name.split(' ').map(stryMutAct_9fa48("10255") ? () => undefined : (stryCov_9fa48("10255"), part => part[0])).join('').slice(0, 2).toUpperCase()) : 'JS';
  return <DataSourceProvider>
      {/* SEO - Dynamic page titles and meta tags */}
      <SEO />
      
      {/* Command Palette - Global search and actions (Cmd+K) */}
      <CommandPalette />
      
      <div className="h-screen flex bg-sovereign-base">
      {/* ================================================================= */}
      {/* SIDEBAR */}
      {/* ================================================================= */}
      <aside className={cn('hidden lg:flex flex-col bg-sovereign-elevated border-r border-sovereign-border-subtle', 'transition-all duration-300 ease-in-out', isCollapsed ? 'w-16' : 'w-64')}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sovereign-border-subtle">
          {stryMutAct_9fa48("10264") ? !isCollapsed || <Logo size="sm" /> : stryMutAct_9fa48("10263") ? false : stryMutAct_9fa48("10262") ? true : (stryCov_9fa48("10262", "10263", "10264"), (stryMutAct_9fa48("10265") ? isCollapsed : (stryCov_9fa48("10265"), !isCollapsed)) && <Logo size="sm" />)}
          {stryMutAct_9fa48("10268") ? isCollapsed || <div className="mx-auto">
              <LogoSimple size={32} />
            </div> : stryMutAct_9fa48("10267") ? false : stryMutAct_9fa48("10266") ? true : (stryCov_9fa48("10266", "10267", "10268"), isCollapsed && <div className="mx-auto">
              <LogoSimple size={32} />
            </div>)}
          <button onClick={stryMutAct_9fa48("10269") ? () => undefined : (stryCov_9fa48("10269"), () => setIsCollapsed(stryMutAct_9fa48("10270") ? isCollapsed : (stryCov_9fa48("10270"), !isCollapsed)))} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} className={cn('p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-sovereign-hover', stryMutAct_9fa48("10276") ? isCollapsed || 'hidden' : stryMutAct_9fa48("10275") ? false : stryMutAct_9fa48("10274") ? true : (stryCov_9fa48("10274", "10275", "10276"), isCollapsed && 'hidden'))}>
            <Icons.ChevronLeft />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {/* 5 Spaces */}
          {navigationItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return <SimpleTooltip key={item.id} content={item.tooltip} position="right">
                <button onClick={stryMutAct_9fa48("10279") ? () => undefined : (stryCov_9fa48("10279"), () => navigate(item.path))} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg', 'transition-colors text-sm font-medium', active ? 'bg-sovereign-active text-white border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-sovereign-hover hover:text-white')} title={isCollapsed ? t(item.labelKey) : undefined}>
                  <Icon />
                  {stryMutAct_9fa48("10286") ? !isCollapsed || <span>{t(item.labelKey)}</span> : stryMutAct_9fa48("10285") ? false : stryMutAct_9fa48("10284") ? true : (stryCov_9fa48("10284", "10285", "10286"), (stryMutAct_9fa48("10287") ? isCollapsed : (stryCov_9fa48("10287"), !isCollapsed)) && <span>{t(item.labelKey)}</span>)}
                </button>
              </SimpleTooltip>;
          })}

          {/* 8 Pillars Section */}
          {stryMutAct_9fa48("10290") ? !isCollapsed || <div className="pt-4 mt-4 border-t border-sovereign-border-subtle">
              <p className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {t('sidebar.pillars')}
              </p>
            </div> : stryMutAct_9fa48("10289") ? false : stryMutAct_9fa48("10288") ? true : (stryCov_9fa48("10288", "10289", "10290"), (stryMutAct_9fa48("10291") ? isCollapsed : (stryCov_9fa48("10291"), !isCollapsed)) && <div className="pt-4 mt-4 border-t border-sovereign-border-subtle">
              <p className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {t('sidebar.pillars')}
              </p>
            </div>)}
          {pillarItems.map(item => {
            const active = isActive(item.path);
            return <SimpleTooltip key={item.id} content={item.tooltip} position="right">
                <button onClick={stryMutAct_9fa48("10294") ? () => undefined : (stryCov_9fa48("10294"), () => navigate(item.path))} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg', 'transition-colors text-sm', active ? 'bg-sovereign-active text-white border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-sovereign-hover hover:text-white')} title={isCollapsed ? t(item.labelKey) : undefined}>
                  <span className="text-base">{item.emoji}</span>
                  {stryMutAct_9fa48("10301") ? !isCollapsed || <span>{t(item.labelKey)}</span> : stryMutAct_9fa48("10300") ? false : stryMutAct_9fa48("10299") ? true : (stryCov_9fa48("10299", "10300", "10301"), (stryMutAct_9fa48("10302") ? isCollapsed : (stryCov_9fa48("10302"), !isCollapsed)) && <span>{t(item.labelKey)}</span>)}
                </button>
              </SimpleTooltip>;
          })}

          {/* System Section */}
          {stryMutAct_9fa48("10305") ? !isCollapsed || <div className="pt-4 mt-4 border-t border-sovereign-border-subtle">
              <p className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {t('sidebar.system')}
              </p>
            </div> : stryMutAct_9fa48("10304") ? false : stryMutAct_9fa48("10303") ? true : (stryCov_9fa48("10303", "10304", "10305"), (stryMutAct_9fa48("10306") ? isCollapsed : (stryCov_9fa48("10306"), !isCollapsed)) && <div className="pt-4 mt-4 border-t border-sovereign-border-subtle">
              <p className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                {t('sidebar.system')}
              </p>
            </div>)}
          {systemItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return <button key={item.id} onClick={stryMutAct_9fa48("10309") ? () => undefined : (stryCov_9fa48("10309"), () => navigate(item.path))} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg', 'transition-colors text-sm', active ? 'bg-sovereign-active text-white border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-sovereign-hover hover:text-white')} title={isCollapsed ? t(item.labelKey) : undefined}>
                <Icon />
                {stryMutAct_9fa48("10316") ? !isCollapsed || <span>{t(item.labelKey)}</span> : stryMutAct_9fa48("10315") ? false : stryMutAct_9fa48("10314") ? true : (stryCov_9fa48("10314", "10315", "10316"), (stryMutAct_9fa48("10317") ? isCollapsed : (stryCov_9fa48("10317"), !isCollapsed)) && <span>{t(item.labelKey)}</span>)}
              </button>;
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="py-4 px-2 border-t border-sovereign-border-subtle space-y-1">
          {bottomNavigationItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return <button key={item.id} onClick={stryMutAct_9fa48("10319") ? () => undefined : (stryCov_9fa48("10319"), () => navigate(item.path))} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg', 'transition-colors text-sm font-medium', active ? 'bg-sovereign-active text-white border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-sovereign-hover hover:text-white')} title={isCollapsed ? t(item.labelKey) : undefined}>
                <Icon />
                {stryMutAct_9fa48("10326") ? !isCollapsed || <span>{t(item.labelKey)}</span> : stryMutAct_9fa48("10325") ? false : stryMutAct_9fa48("10324") ? true : (stryCov_9fa48("10324", "10325", "10326"), (stryMutAct_9fa48("10327") ? isCollapsed : (stryCov_9fa48("10327"), !isCollapsed)) && <span>{t(item.labelKey)}</span>)}
              </button>;
          })}
        </div>

        {/* User Section */}
        {stryMutAct_9fa48("10330") ? !isCollapsed || <div className="p-4 border-t border-sovereign-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-crimson-900/30 rounded-full flex items-center justify-center">
                <span className="text-crimson-400 font-medium text-sm">JS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">John Smith</p>
                <p className="text-xs text-gray-500 truncate">{t('label.admin')}</p>
              </div>
            </div>
          </div> : stryMutAct_9fa48("10329") ? false : stryMutAct_9fa48("10328") ? true : (stryCov_9fa48("10328", "10329", "10330"), (stryMutAct_9fa48("10331") ? isCollapsed : (stryCov_9fa48("10331"), !isCollapsed)) && <div className="p-4 border-t border-sovereign-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-crimson-900/30 rounded-full flex items-center justify-center">
                <span className="text-crimson-400 font-medium text-sm">JS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">John Smith</p>
                <p className="text-xs text-gray-500 truncate">{t('label.admin')}</p>
              </div>
            </div>
          </div>)}
      </aside>

      {/* ================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ================================================================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-sovereign-elevated border-b border-sovereign-border-subtle">
          {/* Mobile menu button */}
          <button onClick={stryMutAct_9fa48("10333") ? () => undefined : (stryCov_9fa48("10333"), () => setIsMobileMenuOpen(stryMutAct_9fa48("10334") ? false : (stryCov_9fa48("10334"), true)))} aria-label="Open navigation menu" className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-sovereign-hover">
            <Icons.Menu />
          </button>

          {/* Data Source Selector */}
          <div className="hidden md:block w-64">
            <DataSourceSelector compact />
          </div>

          {/* Search - Opens Command Palette */}
          <div className="flex-1 max-w-md mx-4">
            <button onClick={() => {
              // Trigger Cmd+K programmatically
              const event = new KeyboardEvent('keydown', stryMutAct_9fa48("10337") ? {} : (stryCov_9fa48("10337"), {
                key: 'k',
                metaKey: stryMutAct_9fa48("10339") ? false : (stryCov_9fa48("10339"), true),
                ctrlKey: stryMutAct_9fa48("10340") ? false : (stryCov_9fa48("10340"), true)
              }));
              window.dispatchEvent(event);
            }} className={cn('w-full h-10 pl-10 pr-4 rounded-lg flex items-center justify-between', 'bg-sovereign-card border border-sovereign-border', 'text-sm text-gray-500', 'hover:bg-sovereign-hover hover:border-sovereign-border-strong transition-colors', 'focus:outline-none focus:ring-2 focus:ring-cyan-500')}>
              <div className="flex items-center gap-2">
                <Icons.Search />
                <span>Search anything...</span>
              </div>
              <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-mono bg-sovereign-active text-gray-400 rounded">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Quick Actions (show on main Cortex pages) */}
          {stryMutAct_9fa48("10348") ? currentPage || <div className="hidden lg:block">
              <QuickActionsBar currentPage={currentPage} />
            </div> : stryMutAct_9fa48("10347") ? false : stryMutAct_9fa48("10346") ? true : (stryCov_9fa48("10346", "10347", "10348"), currentPage && <div className="hidden lg:block">
              <QuickActionsBar currentPage={currentPage} />
            </div>)}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Decision Intelligence Dropdown */}
            <div className="relative">
              <button onClick={stryMutAct_9fa48("10349") ? () => undefined : (stryCov_9fa48("10349"), () => setIsPremiumDropdownOpen(stryMutAct_9fa48("10350") ? isPremiumDropdownOpen : (stryCov_9fa48("10350"), !isPremiumDropdownOpen)))} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium', 'bg-sovereign-card border border-sovereign-border text-gray-300', 'hover:bg-sovereign-hover hover:text-white hover:border-cyan-500/50 transition-all')}>
                <span>🧠</span>
                <span className="hidden md:inline">Decision Intelligence</span>
                <svg className={cn('w-4 h-4 transition-transform', stryMutAct_9fa48("10357") ? isPremiumDropdownOpen || 'rotate-180' : stryMutAct_9fa48("10356") ? false : stryMutAct_9fa48("10355") ? true : (stryCov_9fa48("10355", "10356", "10357"), isPremiumDropdownOpen && 'rotate-180'))} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {stryMutAct_9fa48("10361") ? isPremiumDropdownOpen || <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPremiumDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50 overflow-hidden">
                    <div className="p-3 bg-sovereign-elevated border-b border-sovereign-border-subtle">
                      <h3 className="font-semibold text-white">Decision Intelligence Suite</h3>
                      <p className="text-xs text-gray-500">Premium executive decision tools</p>
                    </div>
                    <div className="py-2">
                      {premiumFeatures.map(feature => <button key={feature.id} onClick={() => {
                      navigate(feature.path);
                      setIsPremiumDropdownOpen(false);
                    }} className={cn('w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors', location.pathname === feature.path && 'bg-sovereign-active border-l-2 border-cyan-500')}>
                          <span className="text-xl">{feature.icon}</span>
                          <div className="text-left">
                            <p className="font-medium text-white text-sm">{feature.label}</p>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </button>)}
                    </div>
                    <div className="p-2 border-t border-sovereign-border-subtle">
                      <p className="px-2 text-xs font-semibold text-gray-600 uppercase mb-1">Apex Products</p>
                      {apexProducts.map(product => <button key={product.id} onClick={() => {
                      navigate(product.path);
                      setIsPremiumDropdownOpen(false);
                    }} className={cn('w-full flex items-start gap-3 px-4 py-2 hover:bg-sovereign-hover transition-colors rounded-lg', location.pathname === product.path && 'bg-sovereign-active')}>
                          <span className="text-lg">{product.icon}</span>
                          <div className="text-left">
                            <p className="font-medium text-white text-sm">{product.label}</p>
                            <p className="text-xs text-gray-500">{product.description}</p>
                          </div>
                        </button>)}
                    </div>
                    <div className="p-3 bg-sovereign-elevated border-t border-sovereign-border-subtle">
                      <p className="text-xs text-gray-500 text-center">Enterprise tier features</p>
                    </div>
                  </div>
                </> : stryMutAct_9fa48("10360") ? false : stryMutAct_9fa48("10359") ? true : (stryCov_9fa48("10359", "10360", "10361"), isPremiumDropdownOpen && <>
                  <div className="fixed inset-0 z-40" onClick={stryMutAct_9fa48("10362") ? () => undefined : (stryCov_9fa48("10362"), () => setIsPremiumDropdownOpen(stryMutAct_9fa48("10363") ? true : (stryCov_9fa48("10363"), false)))} />
                  <div className="absolute right-0 mt-2 w-80 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50 overflow-hidden">
                    <div className="p-3 bg-sovereign-elevated border-b border-sovereign-border-subtle">
                      <h3 className="font-semibold text-white">Decision Intelligence Suite</h3>
                      <p className="text-xs text-gray-500">Premium executive decision tools</p>
                    </div>
                    <div className="py-2">
                      {premiumFeatures.map(stryMutAct_9fa48("10364") ? () => undefined : (stryCov_9fa48("10364"), feature => <button key={feature.id} onClick={() => {
                      navigate(feature.path);
                      setIsPremiumDropdownOpen(stryMutAct_9fa48("10366") ? true : (stryCov_9fa48("10366"), false));
                    }} className={cn('w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors', stryMutAct_9fa48("10370") ? location.pathname === feature.path || 'bg-sovereign-active border-l-2 border-cyan-500' : stryMutAct_9fa48("10369") ? false : stryMutAct_9fa48("10368") ? true : (stryCov_9fa48("10368", "10369", "10370"), (stryMutAct_9fa48("10372") ? location.pathname !== feature.path : stryMutAct_9fa48("10371") ? true : (stryCov_9fa48("10371", "10372"), location.pathname === feature.path)) && 'bg-sovereign-active border-l-2 border-cyan-500'))}>
                          <span className="text-xl">{feature.icon}</span>
                          <div className="text-left">
                            <p className="font-medium text-white text-sm">{feature.label}</p>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </button>))}
                    </div>
                    <div className="p-2 border-t border-sovereign-border-subtle">
                      <p className="px-2 text-xs font-semibold text-gray-600 uppercase mb-1">Apex Products</p>
                      {apexProducts.map(stryMutAct_9fa48("10374") ? () => undefined : (stryCov_9fa48("10374"), product => <button key={product.id} onClick={() => {
                      navigate(product.path);
                      setIsPremiumDropdownOpen(stryMutAct_9fa48("10376") ? true : (stryCov_9fa48("10376"), false));
                    }} className={cn('w-full flex items-start gap-3 px-4 py-2 hover:bg-sovereign-hover transition-colors rounded-lg', stryMutAct_9fa48("10380") ? location.pathname === product.path || 'bg-sovereign-active' : stryMutAct_9fa48("10379") ? false : stryMutAct_9fa48("10378") ? true : (stryCov_9fa48("10378", "10379", "10380"), (stryMutAct_9fa48("10382") ? location.pathname !== product.path : stryMutAct_9fa48("10381") ? true : (stryCov_9fa48("10381", "10382"), location.pathname === product.path)) && 'bg-sovereign-active'))}>
                          <span className="text-lg">{product.icon}</span>
                          <div className="text-left">
                            <p className="font-medium text-white text-sm">{product.label}</p>
                            <p className="text-xs text-gray-500">{product.description}</p>
                          </div>
                        </button>))}
                    </div>
                    <div className="p-3 bg-sovereign-elevated border-t border-sovereign-border-subtle">
                      <p className="text-xs text-gray-500 text-center">Enterprise tier features</p>
                    </div>
                  </div>
                </>)}
            </div>

            {/* Enterprise Suite Dropdown */}
            <div className="relative">
              <button onClick={stryMutAct_9fa48("10384") ? () => undefined : (stryCov_9fa48("10384"), () => setIsEnterpriseDropdownOpen(stryMutAct_9fa48("10385") ? isEnterpriseDropdownOpen : (stryCov_9fa48("10385"), !isEnterpriseDropdownOpen)))} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium', 'bg-sovereign-card border border-sovereign-border text-gray-300', 'hover:bg-sovereign-hover hover:text-white hover:border-cyan-500/50 transition-all')}>
                <span>🏢</span>
                <span className="hidden md:inline">Enterprise</span>
                <svg className={cn('w-4 h-4 transition-transform', stryMutAct_9fa48("10392") ? isEnterpriseDropdownOpen || 'rotate-180' : stryMutAct_9fa48("10391") ? false : stryMutAct_9fa48("10390") ? true : (stryCov_9fa48("10390", "10391", "10392"), isEnterpriseDropdownOpen && 'rotate-180'))} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {stryMutAct_9fa48("10396") ? isEnterpriseDropdownOpen || <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsEnterpriseDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-96 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50 overflow-hidden">
                    <div className="p-3 bg-sovereign-elevated border-b border-sovereign-border-subtle">
                      <h3 className="font-semibold text-white">Enterprise Suite</h3>
                      <p className="text-xs text-gray-500">High-impact features for maximum valuation</p>
                    </div>
                    <div className="py-2 max-h-96 overflow-y-auto">
                      {enterpriseFeatures.map(feature => <button key={feature.id} onClick={() => {
                      navigate(feature.path);
                      setIsEnterpriseDropdownOpen(false);
                    }} className={cn('w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors', location.pathname === feature.path && 'bg-sovereign-active border-l-2 border-cyan-500')}>
                          <span className="text-xl">{feature.icon}</span>
                          <div className="text-left flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white text-sm">{feature.label}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${feature.impact === 'Critical' ? 'bg-red-900/30 text-red-400' : feature.impact === 'High' ? 'bg-amber-900/30 text-amber-400' : 'bg-cyan-900/30 text-cyan-400'}`}>{feature.impact}</span>
                            </div>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </button>)}
                    </div>
                    <div className="p-3 bg-sovereign-elevated border-t border-sovereign-border-subtle">
                      <p className="text-xs text-crimson-400 text-center font-medium">🚀 Enterprise Suite • Multi-billion impact potential</p>
                    </div>
                  </div>
                </> : stryMutAct_9fa48("10395") ? false : stryMutAct_9fa48("10394") ? true : (stryCov_9fa48("10394", "10395", "10396"), isEnterpriseDropdownOpen && <>
                  <div className="fixed inset-0 z-40" onClick={stryMutAct_9fa48("10397") ? () => undefined : (stryCov_9fa48("10397"), () => setIsEnterpriseDropdownOpen(stryMutAct_9fa48("10398") ? true : (stryCov_9fa48("10398"), false)))} />
                  <div className="absolute right-0 mt-2 w-96 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50 overflow-hidden">
                    <div className="p-3 bg-sovereign-elevated border-b border-sovereign-border-subtle">
                      <h3 className="font-semibold text-white">Enterprise Suite</h3>
                      <p className="text-xs text-gray-500">High-impact features for maximum valuation</p>
                    </div>
                    <div className="py-2 max-h-96 overflow-y-auto">
                      {enterpriseFeatures.map(stryMutAct_9fa48("10399") ? () => undefined : (stryCov_9fa48("10399"), feature => <button key={feature.id} onClick={() => {
                      navigate(feature.path);
                      setIsEnterpriseDropdownOpen(stryMutAct_9fa48("10401") ? true : (stryCov_9fa48("10401"), false));
                    }} className={cn('w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors', stryMutAct_9fa48("10405") ? location.pathname === feature.path || 'bg-sovereign-active border-l-2 border-cyan-500' : stryMutAct_9fa48("10404") ? false : stryMutAct_9fa48("10403") ? true : (stryCov_9fa48("10403", "10404", "10405"), (stryMutAct_9fa48("10407") ? location.pathname !== feature.path : stryMutAct_9fa48("10406") ? true : (stryCov_9fa48("10406", "10407"), location.pathname === feature.path)) && 'bg-sovereign-active border-l-2 border-cyan-500'))}>
                          <span className="text-xl">{feature.icon}</span>
                          <div className="text-left flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white text-sm">{feature.label}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${(stryMutAct_9fa48("10412") ? feature.impact !== 'Critical' : stryMutAct_9fa48("10411") ? false : stryMutAct_9fa48("10410") ? true : (stryCov_9fa48("10410", "10411", "10412"), feature.impact === 'Critical')) ? 'bg-red-900/30 text-red-400' : (stryMutAct_9fa48("10417") ? feature.impact !== 'High' : stryMutAct_9fa48("10416") ? false : stryMutAct_9fa48("10415") ? true : (stryCov_9fa48("10415", "10416", "10417"), feature.impact === 'High')) ? 'bg-amber-900/30 text-amber-400' : 'bg-cyan-900/30 text-cyan-400'}`}>{feature.impact}</span>
                            </div>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </button>))}
                    </div>
                    <div className="p-3 bg-sovereign-elevated border-t border-sovereign-border-subtle">
                      <p className="text-xs text-crimson-400 text-center font-medium">🚀 Enterprise Suite • Multi-billion impact potential</p>
                    </div>
                  </div>
                </>)}
            </div>

            {/* Sovereign Tier Dropdown - Special crimson accent */}
            <div className="relative">
              <button onClick={stryMutAct_9fa48("10421") ? () => undefined : (stryCov_9fa48("10421"), () => setIsSovereignDropdownOpen(stryMutAct_9fa48("10422") ? isSovereignDropdownOpen : (stryCov_9fa48("10422"), !isSovereignDropdownOpen)))} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium', 'bg-crimson-900/30 border border-crimson-800/50 text-crimson-400', 'hover:bg-crimson-900/50 hover:text-crimson-300 hover:border-crimson-700 transition-all')}>
                <span>👑</span>
                <span className="hidden md:inline">Sovereign</span>
                <svg className={cn('w-4 h-4 transition-transform', stryMutAct_9fa48("10429") ? isSovereignDropdownOpen || 'rotate-180' : stryMutAct_9fa48("10428") ? false : stryMutAct_9fa48("10427") ? true : (stryCov_9fa48("10427", "10428", "10429"), isSovereignDropdownOpen && 'rotate-180'))} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {stryMutAct_9fa48("10433") ? isSovereignDropdownOpen || <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSovereignDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-96 bg-sovereign-card rounded-xl shadow-2xl border border-crimson-900/50 z-50 overflow-hidden">
                    <div className="p-3 bg-crimson-950/50 border-b border-crimson-900/30">
                      <h3 className="font-semibold text-crimson-400">Sovereign Tier</h3>
                      <p className="text-xs text-gray-500">Regulation, Defense & Long-Horizon Strategy</p>
                    </div>
                    <div className="py-2 max-h-96 overflow-y-auto">
                      {sovereignFeatures.map(feature => <button key={feature.id} onClick={() => {
                      navigate(feature.path);
                      setIsSovereignDropdownOpen(false);
                    }} className={cn('w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors', location.pathname === feature.path && 'bg-crimson-900/20 border-l-2 border-crimson-700')}>
                          <span className="text-xl">{feature.icon}</span>
                          <div className="text-left flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white text-sm">{feature.label}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${feature.impact === 'Critical' ? 'bg-red-900/30 text-red-400' : feature.impact === 'High' ? 'bg-amber-900/30 text-amber-400' : 'bg-cyan-900/30 text-cyan-400'}`}>{feature.impact}</span>
                            </div>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </button>)}
                    </div>
                    <div className="p-3 bg-crimson-950/50 border-t border-crimson-900/30">
                      <p className="text-xs text-crimson-400 text-center font-medium">👑 Sovereign Tier • Critical enterprise capabilities</p>
                    </div>
                  </div>
                </> : stryMutAct_9fa48("10432") ? false : stryMutAct_9fa48("10431") ? true : (stryCov_9fa48("10431", "10432", "10433"), isSovereignDropdownOpen && <>
                  <div className="fixed inset-0 z-40" onClick={stryMutAct_9fa48("10434") ? () => undefined : (stryCov_9fa48("10434"), () => setIsSovereignDropdownOpen(stryMutAct_9fa48("10435") ? true : (stryCov_9fa48("10435"), false)))} />
                  <div className="absolute right-0 mt-2 w-96 bg-sovereign-card rounded-xl shadow-2xl border border-crimson-900/50 z-50 overflow-hidden">
                    <div className="p-3 bg-crimson-950/50 border-b border-crimson-900/30">
                      <h3 className="font-semibold text-crimson-400">Sovereign Tier</h3>
                      <p className="text-xs text-gray-500">Regulation, Defense & Long-Horizon Strategy</p>
                    </div>
                    <div className="py-2 max-h-96 overflow-y-auto">
                      {sovereignFeatures.map(stryMutAct_9fa48("10436") ? () => undefined : (stryCov_9fa48("10436"), feature => <button key={feature.id} onClick={() => {
                      navigate(feature.path);
                      setIsSovereignDropdownOpen(stryMutAct_9fa48("10438") ? true : (stryCov_9fa48("10438"), false));
                    }} className={cn('w-full flex items-start gap-3 px-4 py-3 hover:bg-sovereign-hover transition-colors', stryMutAct_9fa48("10442") ? location.pathname === feature.path || 'bg-crimson-900/20 border-l-2 border-crimson-700' : stryMutAct_9fa48("10441") ? false : stryMutAct_9fa48("10440") ? true : (stryCov_9fa48("10440", "10441", "10442"), (stryMutAct_9fa48("10444") ? location.pathname !== feature.path : stryMutAct_9fa48("10443") ? true : (stryCov_9fa48("10443", "10444"), location.pathname === feature.path)) && 'bg-crimson-900/20 border-l-2 border-crimson-700'))}>
                          <span className="text-xl">{feature.icon}</span>
                          <div className="text-left flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white text-sm">{feature.label}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${(stryMutAct_9fa48("10449") ? feature.impact !== 'Critical' : stryMutAct_9fa48("10448") ? false : stryMutAct_9fa48("10447") ? true : (stryCov_9fa48("10447", "10448", "10449"), feature.impact === 'Critical')) ? 'bg-red-900/30 text-red-400' : (stryMutAct_9fa48("10454") ? feature.impact !== 'High' : stryMutAct_9fa48("10453") ? false : stryMutAct_9fa48("10452") ? true : (stryCov_9fa48("10452", "10453", "10454"), feature.impact === 'High')) ? 'bg-amber-900/30 text-amber-400' : 'bg-cyan-900/30 text-cyan-400'}`}>{feature.impact}</span>
                            </div>
                            <p className="text-xs text-gray-500">{feature.description}</p>
                          </div>
                        </button>))}
                    </div>
                    <div className="p-3 bg-crimson-950/50 border-t border-crimson-900/30">
                      <p className="text-xs text-crimson-400 text-center font-medium">👑 Sovereign Tier • Critical enterprise capabilities</p>
                    </div>
                  </div>
                </>)}
            </div>

            {/* Notifications */}
            <button aria-label="Notifications" className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-sovereign-hover">
              <Icons.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson-600 rounded-full" aria-hidden="true" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
            <LanguageSelector />

            {/* User menu */}
            <div className="relative">
              <button aria-label="User menu" onClick={stryMutAct_9fa48("10458") ? () => undefined : (stryCov_9fa48("10458"), () => setIsUserMenuOpen(stryMutAct_9fa48("10459") ? () => undefined : (stryCov_9fa48("10459"), prev => stryMutAct_9fa48("10460") ? prev : (stryCov_9fa48("10460"), !prev))))} className="p-1.5 rounded-lg hover:bg-sovereign-hover">
                <div className="w-8 h-8 bg-crimson-900/30 rounded-full flex items-center justify-center">
                  <span className="text-crimson-400 font-medium text-sm">{userInitials}</span>
                </div>
              </button>

              {stryMutAct_9fa48("10463") ? isUserMenuOpen || <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50 overflow-hidden">
                    <div className="p-4 border-b border-sovereign-border-subtle">
                      <p className="text-sm font-semibold text-white">{user?.name || 'John Smith'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'john@datacendia.com'}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => {
                      navigate('/cortex/settings');
                      setIsUserMenuOpen(false);
                    }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-sovereign-hover hover:text-white">
                        ⚙️ <span>View Settings</span>
                      </button>
                      <button onClick={async () => {
                      setIsUserMenuOpen(false);
                      await logout();
                      navigate('/login');
                    }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-crimson-400 hover:bg-crimson-900/20">
                        ⎋ <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </> : stryMutAct_9fa48("10462") ? false : stryMutAct_9fa48("10461") ? true : (stryCov_9fa48("10461", "10462", "10463"), isUserMenuOpen && <>
                  <div className="fixed inset-0 z-40" onClick={stryMutAct_9fa48("10464") ? () => undefined : (stryCov_9fa48("10464"), () => setIsUserMenuOpen(stryMutAct_9fa48("10465") ? true : (stryCov_9fa48("10465"), false)))} />
                  <div className="absolute right-0 mt-2 w-56 bg-sovereign-card rounded-xl shadow-2xl border border-sovereign-border z-50 overflow-hidden">
                    <div className="p-4 border-b border-sovereign-border-subtle">
                      <p className="text-sm font-semibold text-white">{stryMutAct_9fa48("10468") ? user?.name && 'John Smith' : stryMutAct_9fa48("10467") ? false : stryMutAct_9fa48("10466") ? true : (stryCov_9fa48("10466", "10467", "10468"), (stryMutAct_9fa48("10469") ? user.name : (stryCov_9fa48("10469"), user?.name)) || 'John Smith')}</p>
                      <p className="text-xs text-gray-500 truncate">{stryMutAct_9fa48("10473") ? user?.email && 'john@datacendia.com' : stryMutAct_9fa48("10472") ? false : stryMutAct_9fa48("10471") ? true : (stryCov_9fa48("10471", "10472", "10473"), (stryMutAct_9fa48("10474") ? user.email : (stryCov_9fa48("10474"), user?.email)) || 'john@datacendia.com')}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => {
                      navigate('/cortex/settings');
                      setIsUserMenuOpen(stryMutAct_9fa48("10478") ? true : (stryCov_9fa48("10478"), false));
                    }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:bg-sovereign-hover hover:text-white">
                        ⚙️ <span>View Settings</span>
                      </button>
                      <button onClick={async () => {
                      setIsUserMenuOpen(stryMutAct_9fa48("10480") ? true : (stryCov_9fa48("10480"), false));
                      await logout();
                      navigate('/login');
                    }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-crimson-400 hover:bg-crimson-900/20">
                        ⎋ <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </>)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-sovereign-base">
          <Outlet />
        </main>

        {/* Workflow Indicator */}
        <WorkflowIndicator />
      </div>

      {/* ================================================================= */}
      {/* MOBILE SIDEBAR OVERLAY */}
      {/* ================================================================= */}
      {stryMutAct_9fa48("10484") ? isMobileMenuOpen || <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sovereign-elevated shadow-2xl border-r border-sovereign-border-subtle">
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-sovereign-border-subtle">
              <Logo size="sm" />
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation menu" className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-sovereign-hover">
                ×
              </button>
            </div>

            {/* Navigation */}
            <nav className="py-4 px-2 space-y-1">
              {navigationItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return <button key={item.id} onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg', 'transition-colors text-sm font-medium', active ? 'bg-sovereign-active text-white border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-sovereign-hover hover:text-white')}>
                    <Icon />
                    <span>{t(item.labelKey)}</span>
                  </button>;
            })}
            </nav>
          </aside>
        </div> : stryMutAct_9fa48("10483") ? false : stryMutAct_9fa48("10482") ? true : (stryCov_9fa48("10482", "10483", "10484"), isMobileMenuOpen && <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80" onClick={stryMutAct_9fa48("10485") ? () => undefined : (stryCov_9fa48("10485"), () => setIsMobileMenuOpen(stryMutAct_9fa48("10486") ? true : (stryCov_9fa48("10486"), false)))} />
          
          {/* Sidebar */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sovereign-elevated shadow-2xl border-r border-sovereign-border-subtle">
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-sovereign-border-subtle">
              <Logo size="sm" />
              <button onClick={stryMutAct_9fa48("10487") ? () => undefined : (stryCov_9fa48("10487"), () => setIsMobileMenuOpen(stryMutAct_9fa48("10488") ? true : (stryCov_9fa48("10488"), false)))} aria-label="Close navigation menu" className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-sovereign-hover">
                ×
              </button>
            </div>

            {/* Navigation */}
            <nav className="py-4 px-2 space-y-1">
              {navigationItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return <button key={item.id} onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(stryMutAct_9fa48("10491") ? true : (stryCov_9fa48("10491"), false));
              }} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg', 'transition-colors text-sm font-medium', active ? 'bg-sovereign-active text-white border-l-2 border-cyan-500' : 'text-gray-400 hover:bg-sovereign-hover hover:text-white')}>
                    <Icon />
                    <span>{t(item.labelKey)}</span>
                  </button>;
            })}
            </nav>
          </aside>
        </div>)}
      </div>
    </DataSourceProvider>;
};

// Wrapper component that provides language context
export const CortexLayout: React.FC = () => {
  return <LanguageProvider>
      <CortexLayoutInner />
    </LanguageProvider>;
};
export default CortexLayout;