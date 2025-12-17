// @ts-nocheck
// =============================================================================
// CENDIA MESH™ - CROSS-COMPANY DECISION NETWORK
// Secure Decision-Sharing Network with Differential Privacy
// "Palantir Foundry + McKinsey Insights + Network Effects"
// 
// CAPABILITIES:
// - Anonymized performance benchmarking
// - Industry pattern detection
// - Risk signal aggregation
// - Pricing intelligence
// - Supply chain disruption alerts
// - Fraud detection patterns
// - Differential privacy protection
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
import { useNavigate } from 'react-router-dom';
import { meshApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type Industry = 'technology' | 'finance' | 'healthcare' | 'manufacturing' | 'retail' | 'energy' | 'aerospace' | 'pharma';
type SignalSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
type InsightCategory = 'benchmark' | 'risk' | 'opportunity' | 'trend' | 'disruption' | 'fraud';
interface NetworkNode {
  id: string;
  industry: Industry;
  region: string;
  employeeRange: string;
  revenueRange: string;
  contributionScore: number;
  dataQuality: number;
  lastActive: Date;
  anonymousId: string;
}
interface BenchmarkMetric {
  id: string;
  name: string;
  category: string;
  yourValue: number;
  industryP25: number;
  industryP50: number;
  industryP75: number;
  industryP90: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  unit: string;
  participants: number;
}
interface RiskSignal {
  id: string;
  title: string;
  description: string;
  category: InsightCategory;
  severity: SignalSeverity;
  affectedIndustries: Industry[];
  affectedRegions: string[];
  confidence: number;
  sources: number;
  detectedAt: Date;
  validUntil: Date;
  recommendations: string[];
  relatedSignals: string[];
}
interface IndustryPattern {
  id: string;
  name: string;
  description: string;
  industry: Industry;
  adoptionRate: number;
  avgImpact: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeToValue: string;
  examples: string[];
  relatedPatterns: string[];
}
interface PricingIntelligence {
  id: string;
  category: string;
  product: string;
  yourPrice: number;
  marketP25: number;
  marketP50: number;
  marketP75: number;
  trend: 'rising' | 'falling' | 'stable';
  volatility: 'low' | 'medium' | 'high';
  forecast30d: number;
  forecast90d: number;
  currency: string;
  lastUpdated: Date;
}
interface SupplyChainAlert {
  id: string;
  title: string;
  description: string;
  severity: SignalSeverity;
  affectedSuppliers: number;
  affectedRegions: string[];
  estimatedImpact: string;
  mitigationOptions: string[];
  detectedAt: Date;
  expectedDuration: string;
}
interface FraudPattern {
  id: string;
  name: string;
  description: string;
  detectionRate: number;
  falsePositiveRate: number;
  affectedIndustries: Industry[];
  indicators: string[];
  recommendedActions: string[];
  reportingOrgs: number;
}
interface NetworkStats {
  totalParticipants: number;
  activeToday: number;
  dataPointsShared: number;
  insightsGenerated: number;
  avgResponseTime: number;
  privacyScore: number;
  uptime: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const INDUSTRY_CONFIG: Record<Industry, {
  icon: string;
  color: string;
  name: string;
}> = stryMutAct_9fa48("31564") ? {} : (stryCov_9fa48("31564"), {
  technology: stryMutAct_9fa48("31565") ? {} : (stryCov_9fa48("31565"), {
    icon: '💻',
    color: 'from-blue-600 to-cyan-600',
    name: 'Technology'
  }),
  finance: stryMutAct_9fa48("31569") ? {} : (stryCov_9fa48("31569"), {
    icon: '🏦',
    color: 'from-green-600 to-emerald-600',
    name: 'Financial Services'
  }),
  healthcare: stryMutAct_9fa48("31573") ? {} : (stryCov_9fa48("31573"), {
    icon: '🏥',
    color: 'from-red-600 to-rose-600',
    name: 'Healthcare'
  }),
  manufacturing: stryMutAct_9fa48("31577") ? {} : (stryCov_9fa48("31577"), {
    icon: '🏭',
    color: 'from-amber-600 to-orange-600',
    name: 'Manufacturing'
  }),
  retail: stryMutAct_9fa48("31581") ? {} : (stryCov_9fa48("31581"), {
    icon: '🛍️',
    color: 'from-purple-600 to-pink-600',
    name: 'Retail'
  }),
  energy: stryMutAct_9fa48("31585") ? {} : (stryCov_9fa48("31585"), {
    icon: '⚡',
    color: 'from-yellow-600 to-amber-600',
    name: 'Energy'
  }),
  aerospace: stryMutAct_9fa48("31589") ? {} : (stryCov_9fa48("31589"), {
    icon: '✈️',
    color: 'from-slate-600 to-gray-600',
    name: 'Aerospace & Defense'
  }),
  pharma: stryMutAct_9fa48("31593") ? {} : (stryCov_9fa48("31593"), {
    icon: '💊',
    color: 'from-teal-600 to-cyan-600',
    name: 'Pharmaceuticals'
  })
});
const generateNetworkStats = stryMutAct_9fa48("31597") ? () => undefined : (stryCov_9fa48("31597"), (() => {
  const generateNetworkStats = (): NetworkStats => stryMutAct_9fa48("31598") ? {} : (stryCov_9fa48("31598"), {
    totalParticipants: 2847,
    activeToday: 1893,
    dataPointsShared: 47823000,
    insightsGenerated: 12456,
    avgResponseTime: 45,
    privacyScore: 99.97,
    uptime: 99.99
  });
  return generateNetworkStats;
})());
const generateBenchmarks = stryMutAct_9fa48("31599") ? () => undefined : (stryCov_9fa48("31599"), (() => {
  const generateBenchmarks = (): BenchmarkMetric[] => stryMutAct_9fa48("31600") ? [] : (stryCov_9fa48("31600"), [stryMutAct_9fa48("31601") ? {} : (stryCov_9fa48("31601"), {
    id: 'rev-growth',
    name: 'Revenue Growth Rate',
    category: 'Financial',
    yourValue: 18.5,
    industryP25: 8.2,
    industryP50: 12.4,
    industryP75: 19.8,
    industryP90: 32.1,
    trend: 'up',
    trendPercent: 2.3,
    unit: '%',
    participants: 847
  }), stryMutAct_9fa48("31607") ? {} : (stryCov_9fa48("31607"), {
    id: 'gross-margin',
    name: 'Gross Margin',
    category: 'Financial',
    yourValue: 68.2,
    industryP25: 45.0,
    industryP50: 58.5,
    industryP75: 72.0,
    industryP90: 82.5,
    trend: 'stable',
    trendPercent: 0.5,
    unit: '%',
    participants: 834
  }), stryMutAct_9fa48("31613") ? {} : (stryCov_9fa48("31613"), {
    id: 'employee-growth',
    name: 'Employee Growth Rate',
    category: 'HR',
    yourValue: 12.0,
    industryP25: 3.5,
    industryP50: 8.2,
    industryP75: 15.0,
    industryP90: 25.0,
    trend: 'down',
    trendPercent: stryMutAct_9fa48("31618") ? +4.2 : (stryCov_9fa48("31618"), -4.2),
    unit: '%',
    participants: 756
  }), stryMutAct_9fa48("31620") ? {} : (stryCov_9fa48("31620"), {
    id: 'customer-retention',
    name: 'Customer Retention Rate',
    category: 'Sales',
    yourValue: 94.5,
    industryP25: 78.0,
    industryP50: 85.5,
    industryP75: 92.0,
    industryP90: 97.0,
    trend: 'up',
    trendPercent: 1.8,
    unit: '%',
    participants: 623
  }), stryMutAct_9fa48("31626") ? {} : (stryCov_9fa48("31626"), {
    id: 'sales-efficiency',
    name: 'Sales Efficiency Ratio',
    category: 'Sales',
    yourValue: 1.2,
    industryP25: 0.6,
    industryP50: 0.9,
    industryP75: 1.3,
    industryP90: 1.8,
    trend: 'up',
    trendPercent: 8.5,
    unit: 'x',
    participants: 589
  }), stryMutAct_9fa48("31632") ? {} : (stryCov_9fa48("31632"), {
    id: 'r-d-intensity',
    name: 'R&D Intensity',
    category: 'Operations',
    yourValue: 22.0,
    industryP25: 8.0,
    industryP50: 15.0,
    industryP75: 25.0,
    industryP90: 35.0,
    trend: 'stable',
    trendPercent: 0.2,
    unit: '% of Rev',
    participants: 445
  }), stryMutAct_9fa48("31638") ? {} : (stryCov_9fa48("31638"), {
    id: 'time-to-hire',
    name: 'Average Time to Hire',
    category: 'HR',
    yourValue: 32,
    industryP25: 55,
    industryP50: 42,
    industryP75: 28,
    industryP90: 18,
    trend: 'down',
    trendPercent: stryMutAct_9fa48("31643") ? +12.0 : (stryCov_9fa48("31643"), -12.0),
    unit: 'days',
    participants: 678
  }), stryMutAct_9fa48("31645") ? {} : (stryCov_9fa48("31645"), {
    id: 'nps',
    name: 'Net Promoter Score',
    category: 'Customer',
    yourValue: 45,
    industryP25: 15,
    industryP50: 32,
    industryP75: 48,
    industryP90: 65,
    trend: 'up',
    trendPercent: 5.0,
    unit: '',
    participants: 534
  })]);
  return generateBenchmarks;
})());
const generateRiskSignals = stryMutAct_9fa48("31651") ? () => undefined : (stryCov_9fa48("31651"), (() => {
  const generateRiskSignals = (): RiskSignal[] => stryMutAct_9fa48("31652") ? [] : (stryCov_9fa48("31652"), [stryMutAct_9fa48("31653") ? {} : (stryCov_9fa48("31653"), {
    id: 'sig-001',
    title: 'Semiconductor Supply Chain Disruption',
    description: 'Multiple tier-2 suppliers in Taiwan reporting capacity constraints due to power grid issues. Expected 15-20% reduction in chip availability for Q1 2025.',
    category: 'disruption',
    severity: 'high',
    affectedIndustries: stryMutAct_9fa48("31659") ? [] : (stryCov_9fa48("31659"), ['technology', 'manufacturing', 'aerospace']),
    affectedRegions: stryMutAct_9fa48("31663") ? [] : (stryCov_9fa48("31663"), ['APAC', 'North America', 'Europe']),
    confidence: 87,
    sources: 145,
    detectedAt: new Date(stryMutAct_9fa48("31667") ? Date.now() + 2 * 60 * 60 * 1000 : (stryCov_9fa48("31667"), Date.now() - (stryMutAct_9fa48("31668") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("31668"), (stryMutAct_9fa48("31669") ? 2 * 60 / 60 : (stryCov_9fa48("31669"), (stryMutAct_9fa48("31670") ? 2 / 60 : (stryCov_9fa48("31670"), 2 * 60)) * 60)) * 1000)))),
    validUntil: new Date(stryMutAct_9fa48("31671") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("31671"), Date.now() + (stryMutAct_9fa48("31672") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("31672"), (stryMutAct_9fa48("31673") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("31673"), (stryMutAct_9fa48("31674") ? 30 * 24 / 60 : (stryCov_9fa48("31674"), (stryMutAct_9fa48("31675") ? 30 / 24 : (stryCov_9fa48("31675"), 30 * 24)) * 60)) * 60)) * 1000)))),
    recommendations: stryMutAct_9fa48("31676") ? [] : (stryCov_9fa48("31676"), ['Review safety stock levels for semiconductor-dependent products', 'Engage backup suppliers immediately', 'Consider temporary product mix adjustments']),
    relatedSignals: stryMutAct_9fa48("31680") ? [] : (stryCov_9fa48("31680"), ['sig-004', 'sig-007'])
  }), stryMutAct_9fa48("31683") ? {} : (stryCov_9fa48("31683"), {
    id: 'sig-002',
    title: 'Healthcare Cybersecurity Threat Escalation',
    description: 'Coordinated ransomware campaign targeting healthcare organizations. 23 incidents reported in past 72 hours across network participants.',
    category: 'risk',
    severity: 'critical',
    affectedIndustries: stryMutAct_9fa48("31689") ? [] : (stryCov_9fa48("31689"), ['healthcare', 'pharma']),
    affectedRegions: stryMutAct_9fa48("31692") ? [] : (stryCov_9fa48("31692"), ['North America', 'Europe']),
    confidence: 94,
    sources: 89,
    detectedAt: new Date(stryMutAct_9fa48("31695") ? Date.now() + 4 * 60 * 60 * 1000 : (stryCov_9fa48("31695"), Date.now() - (stryMutAct_9fa48("31696") ? 4 * 60 * 60 / 1000 : (stryCov_9fa48("31696"), (stryMutAct_9fa48("31697") ? 4 * 60 / 60 : (stryCov_9fa48("31697"), (stryMutAct_9fa48("31698") ? 4 / 60 : (stryCov_9fa48("31698"), 4 * 60)) * 60)) * 1000)))),
    validUntil: new Date(stryMutAct_9fa48("31699") ? Date.now() - 14 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("31699"), Date.now() + (stryMutAct_9fa48("31700") ? 14 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("31700"), (stryMutAct_9fa48("31701") ? 14 * 24 * 60 / 60 : (stryCov_9fa48("31701"), (stryMutAct_9fa48("31702") ? 14 * 24 / 60 : (stryCov_9fa48("31702"), (stryMutAct_9fa48("31703") ? 14 / 24 : (stryCov_9fa48("31703"), 14 * 24)) * 60)) * 60)) * 1000)))),
    recommendations: stryMutAct_9fa48("31704") ? [] : (stryCov_9fa48("31704"), ['Implement emergency patching protocol', 'Activate incident response team', 'Review backup integrity', 'Brief executive team on potential impact']),
    relatedSignals: stryMutAct_9fa48("31709") ? [] : (stryCov_9fa48("31709"), ['sig-008'])
  }), stryMutAct_9fa48("31711") ? {} : (stryCov_9fa48("31711"), {
    id: 'sig-003',
    title: 'Enterprise AI Adoption Acceleration',
    description: 'Network data shows 340% increase in enterprise AI deployment plans for 2025. Companies not investing facing competitive disadvantage signals.',
    category: 'trend',
    severity: 'medium',
    affectedIndustries: stryMutAct_9fa48("31717") ? [] : (stryCov_9fa48("31717"), ['technology', 'finance', 'healthcare', 'manufacturing', 'retail']),
    affectedRegions: stryMutAct_9fa48("31723") ? [] : (stryCov_9fa48("31723"), ['Global']),
    confidence: 92,
    sources: 423,
    detectedAt: new Date(stryMutAct_9fa48("31725") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("31725"), Date.now() - (stryMutAct_9fa48("31726") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("31726"), (stryMutAct_9fa48("31727") ? 24 * 60 / 60 : (stryCov_9fa48("31727"), (stryMutAct_9fa48("31728") ? 24 / 60 : (stryCov_9fa48("31728"), 24 * 60)) * 60)) * 1000)))),
    validUntil: new Date(stryMutAct_9fa48("31729") ? Date.now() - 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("31729"), Date.now() + (stryMutAct_9fa48("31730") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("31730"), (stryMutAct_9fa48("31731") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("31731"), (stryMutAct_9fa48("31732") ? 90 * 24 / 60 : (stryCov_9fa48("31732"), (stryMutAct_9fa48("31733") ? 90 / 24 : (stryCov_9fa48("31733"), 90 * 24)) * 60)) * 60)) * 1000)))),
    recommendations: stryMutAct_9fa48("31734") ? [] : (stryCov_9fa48("31734"), ['Assess current AI capabilities and gaps', 'Develop 12-month AI roadmap', 'Evaluate build vs. buy decisions']),
    relatedSignals: stryMutAct_9fa48("31738") ? [] : (stryCov_9fa48("31738"), ['sig-005'])
  }), stryMutAct_9fa48("31740") ? {} : (stryCov_9fa48("31740"), {
    id: 'sig-004',
    title: 'Payment Fraud Pattern: New Vector',
    description: 'Novel fraud pattern detected across 47 financial institutions. Synthetic identity combined with instant payment rails. Average loss per incident: $47K.',
    category: 'fraud',
    severity: 'high',
    affectedIndustries: stryMutAct_9fa48("31746") ? [] : (stryCov_9fa48("31746"), ['finance', 'retail']),
    affectedRegions: stryMutAct_9fa48("31749") ? [] : (stryCov_9fa48("31749"), ['North America']),
    confidence: 89,
    sources: 67,
    detectedAt: new Date(stryMutAct_9fa48("31751") ? Date.now() + 8 * 60 * 60 * 1000 : (stryCov_9fa48("31751"), Date.now() - (stryMutAct_9fa48("31752") ? 8 * 60 * 60 / 1000 : (stryCov_9fa48("31752"), (stryMutAct_9fa48("31753") ? 8 * 60 / 60 : (stryCov_9fa48("31753"), (stryMutAct_9fa48("31754") ? 8 / 60 : (stryCov_9fa48("31754"), 8 * 60)) * 60)) * 1000)))),
    validUntil: new Date(stryMutAct_9fa48("31755") ? Date.now() - 60 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("31755"), Date.now() + (stryMutAct_9fa48("31756") ? 60 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("31756"), (stryMutAct_9fa48("31757") ? 60 * 24 * 60 / 60 : (stryCov_9fa48("31757"), (stryMutAct_9fa48("31758") ? 60 * 24 / 60 : (stryCov_9fa48("31758"), (stryMutAct_9fa48("31759") ? 60 / 24 : (stryCov_9fa48("31759"), 60 * 24)) * 60)) * 60)) * 1000)))),
    recommendations: stryMutAct_9fa48("31760") ? [] : (stryCov_9fa48("31760"), ['Update fraud detection rules', 'Implement additional velocity checks', 'Review instant payment controls']),
    relatedSignals: stryMutAct_9fa48("31764") ? ["Stryker was here"] : (stryCov_9fa48("31764"), [])
  }), stryMutAct_9fa48("31765") ? {} : (stryCov_9fa48("31765"), {
    id: 'sig-005',
    title: 'Labor Market Cooling in Tech Sector',
    description: 'Hiring velocity down 28% QoQ across technology sector. Salary growth decelerating. Opportunity for strategic hiring.',
    category: 'opportunity',
    severity: 'info',
    affectedIndustries: stryMutAct_9fa48("31771") ? [] : (stryCov_9fa48("31771"), ['technology']),
    affectedRegions: stryMutAct_9fa48("31773") ? [] : (stryCov_9fa48("31773"), ['North America', 'Europe']),
    confidence: 96,
    sources: 234,
    detectedAt: new Date(stryMutAct_9fa48("31776") ? Date.now() + 48 * 60 * 60 * 1000 : (stryCov_9fa48("31776"), Date.now() - (stryMutAct_9fa48("31777") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("31777"), (stryMutAct_9fa48("31778") ? 48 * 60 / 60 : (stryCov_9fa48("31778"), (stryMutAct_9fa48("31779") ? 48 / 60 : (stryCov_9fa48("31779"), 48 * 60)) * 60)) * 1000)))),
    validUntil: new Date(stryMutAct_9fa48("31780") ? Date.now() - 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("31780"), Date.now() + (stryMutAct_9fa48("31781") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("31781"), (stryMutAct_9fa48("31782") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("31782"), (stryMutAct_9fa48("31783") ? 90 * 24 / 60 : (stryCov_9fa48("31783"), (stryMutAct_9fa48("31784") ? 90 / 24 : (stryCov_9fa48("31784"), 90 * 24)) * 60)) * 60)) * 1000)))),
    recommendations: stryMutAct_9fa48("31785") ? [] : (stryCov_9fa48("31785"), ['Review compensation benchmarks', 'Accelerate strategic hiring plans', 'Consider opportunistic talent acquisition']),
    relatedSignals: stryMutAct_9fa48("31789") ? ["Stryker was here"] : (stryCov_9fa48("31789"), [])
  })]);
  return generateRiskSignals;
})());
const generatePricingIntel = stryMutAct_9fa48("31790") ? () => undefined : (stryCov_9fa48("31790"), (() => {
  const generatePricingIntel = (): PricingIntelligence[] => stryMutAct_9fa48("31791") ? [] : (stryCov_9fa48("31791"), [stryMutAct_9fa48("31792") ? {} : (stryCov_9fa48("31792"), {
    id: 'price-001',
    category: 'Cloud Services',
    product: 'Enterprise Cloud Compute',
    yourPrice: 0.085,
    marketP25: 0.072,
    marketP50: 0.089,
    marketP75: 0.112,
    trend: 'falling',
    volatility: 'medium',
    forecast30d: 0.082,
    forecast90d: 0.078,
    currency: 'USD/hour',
    lastUpdated: new Date()
  }), stryMutAct_9fa48("31799") ? {} : (stryCov_9fa48("31799"), {
    id: 'price-002',
    category: 'SaaS Licensing',
    product: 'Enterprise CRM',
    yourPrice: 150,
    marketP25: 125,
    marketP50: 175,
    marketP75: 225,
    trend: 'rising',
    volatility: 'low',
    forecast30d: 155,
    forecast90d: 165,
    currency: 'USD/user/mo',
    lastUpdated: new Date()
  }), stryMutAct_9fa48("31806") ? {} : (stryCov_9fa48("31806"), {
    id: 'price-003',
    category: 'Professional Services',
    product: 'Management Consulting',
    yourPrice: 450,
    marketP25: 350,
    marketP50: 425,
    marketP75: 550,
    trend: 'stable',
    volatility: 'low',
    forecast30d: 450,
    forecast90d: 460,
    currency: 'USD/hour',
    lastUpdated: new Date()
  })]);
  return generatePricingIntel;
})());
const generateSupplyChainAlerts = stryMutAct_9fa48("31813") ? () => undefined : (stryCov_9fa48("31813"), (() => {
  const generateSupplyChainAlerts = (): SupplyChainAlert[] => stryMutAct_9fa48("31814") ? [] : (stryCov_9fa48("31814"), [stryMutAct_9fa48("31815") ? {} : (stryCov_9fa48("31815"), {
    id: 'sc-001',
    title: 'Port of Rotterdam Congestion',
    description: 'Container processing delays of 4-6 days due to labor action. Affecting 23% of European shipments.',
    severity: 'high',
    affectedSuppliers: 156,
    affectedRegions: stryMutAct_9fa48("31820") ? [] : (stryCov_9fa48("31820"), ['Europe', 'UK']),
    estimatedImpact: '8-12% increase in logistics costs',
    mitigationOptions: stryMutAct_9fa48("31824") ? [] : (stryCov_9fa48("31824"), ['Reroute via Hamburg', 'Air freight for critical items', 'Increase safety stock']),
    detectedAt: new Date(stryMutAct_9fa48("31828") ? Date.now() + 6 * 60 * 60 * 1000 : (stryCov_9fa48("31828"), Date.now() - (stryMutAct_9fa48("31829") ? 6 * 60 * 60 / 1000 : (stryCov_9fa48("31829"), (stryMutAct_9fa48("31830") ? 6 * 60 / 60 : (stryCov_9fa48("31830"), (stryMutAct_9fa48("31831") ? 6 / 60 : (stryCov_9fa48("31831"), 6 * 60)) * 60)) * 1000)))),
    expectedDuration: '7-14 days'
  }), stryMutAct_9fa48("31833") ? {} : (stryCov_9fa48("31833"), {
    id: 'sc-002',
    title: 'Rare Earth Materials Shortage',
    description: 'China export restrictions impacting rare earth supply. 3-month lead time increase expected.',
    severity: 'critical',
    affectedSuppliers: 89,
    affectedRegions: stryMutAct_9fa48("31838") ? [] : (stryCov_9fa48("31838"), ['Global']),
    estimatedImpact: '25-40% price increase, production delays',
    mitigationOptions: stryMutAct_9fa48("31841") ? [] : (stryCov_9fa48("31841"), ['Qualify alternative suppliers', 'Product redesign', 'Strategic stockpiling']),
    detectedAt: new Date(stryMutAct_9fa48("31845") ? Date.now() + 72 * 60 * 60 * 1000 : (stryCov_9fa48("31845"), Date.now() - (stryMutAct_9fa48("31846") ? 72 * 60 * 60 / 1000 : (stryCov_9fa48("31846"), (stryMutAct_9fa48("31847") ? 72 * 60 / 60 : (stryCov_9fa48("31847"), (stryMutAct_9fa48("31848") ? 72 / 60 : (stryCov_9fa48("31848"), 72 * 60)) * 60)) * 1000)))),
    expectedDuration: '6-12 months'
  })]);
  return generateSupplyChainAlerts;
})());

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MeshPage: React.FC = () => {
  const navigate = useNavigate();
  const [networkStats, setNetworkStats] = useState<NetworkStats>(generateNetworkStats);
  const [benchmarks, setBenchmarks] = useState<BenchmarkMetric[]>(generateBenchmarks);
  const [riskSignals, setRiskSignals] = useState<RiskSignal[]>(generateRiskSignals);
  const [pricingIntel] = useState<PricingIntelligence[]>(generatePricingIntel);
  const [supplyChainAlerts] = useState<SupplyChainAlert[]>(generateSupplyChainAlerts);
  const [activeTab, setActiveTab] = useState<'overview' | 'benchmarks' | 'signals' | 'pricing' | 'supply-chain'>('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("31853") ? false : (stryCov_9fa48("31853"), true));

  // Fetch real data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("31857") ? false : (stryCov_9fa48("31857"), true));

        // Fetch network stats
        const statsRes = await meshApi.getStats();
        if (stryMutAct_9fa48("31860") ? statsRes.success || statsRes.data : stryMutAct_9fa48("31859") ? false : stryMutAct_9fa48("31858") ? true : (stryCov_9fa48("31858", "31859", "31860"), statsRes.success && statsRes.data)) {
          setNetworkStats(stryMutAct_9fa48("31862") ? {} : (stryCov_9fa48("31862"), {
            totalParticipants: statsRes.data.total_participants,
            activeToday: statsRes.data.active_today,
            dataPointsShared: statsRes.data.data_points_shared,
            insightsGenerated: statsRes.data.insights_generated,
            avgResponseTime: statsRes.data.avg_response_ms,
            privacyScore: statsRes.data.privacy_score,
            uptime: statsRes.data.uptime_percent
          }));
        }

        // Fetch benchmarks
        const benchRes = await meshApi.getBenchmarks();
        if (stryMutAct_9fa48("31865") ? benchRes.success && benchRes.data || Array.isArray(benchRes.data) : stryMutAct_9fa48("31864") ? false : stryMutAct_9fa48("31863") ? true : (stryCov_9fa48("31863", "31864", "31865"), (stryMutAct_9fa48("31867") ? benchRes.success || benchRes.data : stryMutAct_9fa48("31866") ? true : (stryCov_9fa48("31866", "31867"), benchRes.success && benchRes.data)) && Array.isArray(benchRes.data))) {
          const mappedBenchmarks = benchRes.data.map(stryMutAct_9fa48("31869") ? () => undefined : (stryCov_9fa48("31869"), (b: any) => stryMutAct_9fa48("31870") ? {} : (stryCov_9fa48("31870"), {
            id: b.id,
            name: b.name,
            category: b.category,
            yourValue: stryMutAct_9fa48("31871") ? b.p50_value / (0.9 + Math.random() * 0.3) : (stryCov_9fa48("31871"), b.p50_value * (stryMutAct_9fa48("31872") ? 0.9 - Math.random() * 0.3 : (stryCov_9fa48("31872"), 0.9 + (stryMutAct_9fa48("31873") ? Math.random() / 0.3 : (stryCov_9fa48("31873"), Math.random() * 0.3))))),
            // Simulated "your value"
            industryP25: b.p25_value,
            industryP50: b.p50_value,
            industryP75: b.p75_value,
            industryP90: b.p90_value,
            trend: b.trend as 'up' | 'down' | 'stable',
            trendPercent: b.trend_percent,
            unit: b.unit,
            participants: b.participants
          })));
          // Group by unique name (take first of each name)
          const uniqueBenchmarks = mappedBenchmarks.reduce((acc: BenchmarkMetric[], curr: BenchmarkMetric) => {
            if (stryMutAct_9fa48("31877") ? false : stryMutAct_9fa48("31876") ? true : stryMutAct_9fa48("31875") ? acc.find(b => b.name === curr.name) : (stryCov_9fa48("31875", "31876", "31877"), !acc.find(stryMutAct_9fa48("31878") ? () => undefined : (stryCov_9fa48("31878"), b => stryMutAct_9fa48("31881") ? b.name !== curr.name : stryMutAct_9fa48("31880") ? false : stryMutAct_9fa48("31879") ? true : (stryCov_9fa48("31879", "31880", "31881"), b.name === curr.name))))) {
              acc.push(curr);
            }
            return acc;
          }, stryMutAct_9fa48("31883") ? ["Stryker was here"] : (stryCov_9fa48("31883"), []));
          setBenchmarks(stryMutAct_9fa48("31884") ? uniqueBenchmarks : (stryCov_9fa48("31884"), uniqueBenchmarks.slice(0, 8)));
        }

        // Fetch risk signals
        const signalsRes = await meshApi.getRiskSignals(stryMutAct_9fa48("31885") ? {} : (stryCov_9fa48("31885"), {
          active: stryMutAct_9fa48("31886") ? false : (stryCov_9fa48("31886"), true)
        }));
        if (stryMutAct_9fa48("31889") ? signalsRes.success && signalsRes.data || Array.isArray(signalsRes.data) : stryMutAct_9fa48("31888") ? false : stryMutAct_9fa48("31887") ? true : (stryCov_9fa48("31887", "31888", "31889"), (stryMutAct_9fa48("31891") ? signalsRes.success || signalsRes.data : stryMutAct_9fa48("31890") ? true : (stryCov_9fa48("31890", "31891"), signalsRes.success && signalsRes.data)) && Array.isArray(signalsRes.data))) {
          const mappedSignals = signalsRes.data.map(stryMutAct_9fa48("31893") ? () => undefined : (stryCov_9fa48("31893"), (s: any) => stryMutAct_9fa48("31894") ? {} : (stryCov_9fa48("31894"), {
            id: s.id,
            title: s.title,
            description: s.description,
            category: s.category as InsightCategory,
            severity: s.severity as SignalSeverity,
            affectedIndustries: stryMutAct_9fa48("31897") ? s.affected_industries && [] : stryMutAct_9fa48("31896") ? false : stryMutAct_9fa48("31895") ? true : (stryCov_9fa48("31895", "31896", "31897"), s.affected_industries || (stryMutAct_9fa48("31898") ? ["Stryker was here"] : (stryCov_9fa48("31898"), []))),
            affectedRegions: stryMutAct_9fa48("31901") ? s.affected_regions && [] : stryMutAct_9fa48("31900") ? false : stryMutAct_9fa48("31899") ? true : (stryCov_9fa48("31899", "31900", "31901"), s.affected_regions || (stryMutAct_9fa48("31902") ? ["Stryker was here"] : (stryCov_9fa48("31902"), []))),
            confidence: s.confidence,
            sources: s.sources,
            detectedAt: new Date(s.detected_at),
            validUntil: new Date(s.valid_until),
            recommendations: stryMutAct_9fa48("31905") ? s.recommendations && [] : stryMutAct_9fa48("31904") ? false : stryMutAct_9fa48("31903") ? true : (stryCov_9fa48("31903", "31904", "31905"), s.recommendations || (stryMutAct_9fa48("31906") ? ["Stryker was here"] : (stryCov_9fa48("31906"), []))),
            relatedSignals: stryMutAct_9fa48("31907") ? ["Stryker was here"] : (stryCov_9fa48("31907"), [])
          })));
          setRiskSignals(mappedSignals);
        }
      } catch (error) {
        console.error('[Mesh] Data load error:', error);
      } finally {
        setIsLoading(stryMutAct_9fa48("31911") ? true : (stryCov_9fa48("31911"), false));
      }
    };
    loadData();
  }, stryMutAct_9fa48("31912") ? ["Stryker was here"] : (stryCov_9fa48("31912"), []));
  const criticalSignals = stryMutAct_9fa48("31913") ? riskSignals : (stryCov_9fa48("31913"), riskSignals.filter(stryMutAct_9fa48("31914") ? () => undefined : (stryCov_9fa48("31914"), s => stryMutAct_9fa48("31917") ? s.severity === 'critical' && s.severity === 'high' : stryMutAct_9fa48("31916") ? false : stryMutAct_9fa48("31915") ? true : (stryCov_9fa48("31915", "31916", "31917"), (stryMutAct_9fa48("31919") ? s.severity !== 'critical' : stryMutAct_9fa48("31918") ? false : (stryCov_9fa48("31918", "31919"), s.severity === 'critical')) || (stryMutAct_9fa48("31922") ? s.severity !== 'high' : stryMutAct_9fa48("31921") ? false : (stryCov_9fa48("31921", "31922"), s.severity === 'high'))))));
  return <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-cyan-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("31924") ? () => undefined : (stryCov_9fa48("31924"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🕸️</span>
                  CendiaMesh™
                  <span className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-0.5 rounded-full font-medium">
                    NETWORK
                  </span>
                </h1>
                <p className="text-cyan-300 text-sm">Cross-Company Decision Network • Differential Privacy Protected</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-green-400">Network Active</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Privacy Score</div>
                <div className="text-xl font-bold text-green-400">{networkStats.privacyScore}%</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Network Stats Bar */}
      <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-b border-cyan-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-7 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{networkStats.totalParticipants.toLocaleString()}</div>
              <div className="text-xs text-cyan-300">Network Participants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{networkStats.activeToday.toLocaleString()}</div>
              <div className="text-xs text-cyan-300">Active Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{(stryMutAct_9fa48("31926") ? networkStats.dataPointsShared * 1000000 : (stryCov_9fa48("31926"), networkStats.dataPointsShared / 1000000)).toFixed(1)}M</div>
              <div className="text-xs text-cyan-300">Data Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{networkStats.insightsGenerated.toLocaleString()}</div>
              <div className="text-xs text-cyan-300">Insights Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{criticalSignals.length}</div>
              <div className="text-xs text-cyan-300">Active Alerts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{networkStats.avgResponseTime}ms</div>
              <div className="text-xs text-cyan-300">Avg Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{networkStats.uptime}%</div>
              <div className="text-xs text-cyan-300">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-cyan-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("31927") ? [] : (stryCov_9fa48("31927"), [stryMutAct_9fa48("31928") ? {} : (stryCov_9fa48("31928"), {
            id: 'overview',
            label: 'Network Overview',
            icon: '🌐'
          }), stryMutAct_9fa48("31932") ? {} : (stryCov_9fa48("31932"), {
            id: 'benchmarks',
            label: 'Benchmarking',
            icon: '📊'
          }), stryMutAct_9fa48("31936") ? {} : (stryCov_9fa48("31936"), {
            id: 'signals',
            label: 'Risk Signals',
            icon: '⚠️'
          }), stryMutAct_9fa48("31940") ? {} : (stryCov_9fa48("31940"), {
            id: 'pricing',
            label: 'Pricing Intelligence',
            icon: '💰'
          }), stryMutAct_9fa48("31944") ? {} : (stryCov_9fa48("31944"), {
            id: 'supply-chain',
            label: 'Supply Chain',
            icon: '🔗'
          })])).map(stryMutAct_9fa48("31948") ? () => undefined : (stryCov_9fa48("31948"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("31949") ? () => undefined : (stryCov_9fa48("31949"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("31953") ? activeTab !== tab.id : stryMutAct_9fa48("31952") ? false : stryMutAct_9fa48("31951") ? true : (stryCov_9fa48("31951", "31952", "31953"), activeTab === tab.id)) ? 'border-cyan-400 text-white bg-cyan-900/20' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("31958") ? activeTab === 'overview' || <div className="space-y-6">
            {/* Privacy Notice */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/50">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🔐</div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Differential Privacy Protected</h2>
                  <p className="text-white/60 text-sm">
                    All data shared on CendiaMesh is protected by differential privacy. Individual company data cannot be
                    reverse-engineered from aggregate insights. Your participation strengthens the network while maintaining
                    complete confidentiality.
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Alerts */}
            {criticalSignals.length > 0 && <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Critical Alerts
                </h2>
                <div className="space-y-3">
                  {criticalSignals.slice(0, 3).map(signal => <div key={signal.id} className={`p-4 rounded-xl border ${signal.severity === 'critical' ? 'bg-red-900/20 border-red-700/50' : 'bg-amber-900/20 border-amber-700/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{signal.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${signal.severity === 'critical' ? 'bg-red-600' : 'bg-amber-600'}`}>
                          {signal.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{signal.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>Confidence: {signal.confidence}%</span>
                        <span>Sources: {signal.sources}</span>
                        <span>Detected: {Math.floor((Date.now() - signal.detectedAt.getTime()) / 3600000)}h ago</span>
                      </div>
                    </div>)}
                </div>
              </div>}

            {/* Industry Distribution */}
            <div className="grid grid-cols-4 gap-4">
              {(Object.keys(INDUSTRY_CONFIG) as Industry[]).map(industry => {
            const config = INDUSTRY_CONFIG[industry];
            const participants = Math.floor(networkStats.totalParticipants * (0.08 + Math.random() * 0.12));
            return <div key={industry} onClick={() => setSelectedIndustry(industry)} className={`bg-black/30 rounded-xl p-4 border cursor-pointer transition-all ${selectedIndustry === industry ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-cyan-800/50 hover:border-cyan-600'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{config.name}</div>
                        <div className="text-xs text-white/50">{participants} participants</div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${config.color}`} style={{
                  width: `${participants / networkStats.totalParticipants * 100 * 5}%`
                }} />
                    </div>
                  </div>;
          })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Your Benchmarks</h3>
                <div className="space-y-3">
                  {benchmarks.slice(0, 4).map(b => <div key={b.id} className="flex items-center justify-between">
                      <span className="text-sm text-white/70">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{b.yourValue}{b.unit}</span>
                        <span className={`text-xs ${b.yourValue >= b.industryP75 ? 'text-green-400' : b.yourValue >= b.industryP50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {b.yourValue >= b.industryP75 ? 'Top 25%' : b.yourValue >= b.industryP50 ? 'Above Median' : 'Below Median'}
                        </span>
                      </div>
                    </div>)}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Recent Insights</h3>
                <div className="space-y-3">
                  {riskSignals.slice(0, 4).map(s => <div key={s.id} className="flex items-start gap-3">
                      <span className={`text-lg ${s.category === 'risk' ? '⚠️' : s.category === 'opportunity' ? '💡' : s.category === 'trend' ? '📈' : s.category === 'fraud' ? '🚨' : '🔔'}`} />
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-white/50">{s.affectedIndustries.length} industries affected</div>
                      </div>
                    </div>)}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Network Activity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Data contributions today</span>
                    <span className="font-bold text-cyan-400">12,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">New insights this week</span>
                    <span className="font-bold text-purple-400">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Your contribution rank</span>
                    <span className="font-bold text-amber-400">Top 5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Insights consumed</span>
                    <span className="font-bold text-green-400">234</span>
                  </div>
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("31957") ? false : stryMutAct_9fa48("31956") ? true : (stryCov_9fa48("31956", "31957", "31958"), (stryMutAct_9fa48("31960") ? activeTab !== 'overview' : stryMutAct_9fa48("31959") ? true : (stryCov_9fa48("31959", "31960"), activeTab === 'overview')) && <div className="space-y-6">
            {/* Privacy Notice */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/50">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🔐</div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">Differential Privacy Protected</h2>
                  <p className="text-white/60 text-sm">
                    All data shared on CendiaMesh is protected by differential privacy. Individual company data cannot be
                    reverse-engineered from aggregate insights. Your participation strengthens the network while maintaining
                    complete confidentiality.
                  </p>
                </div>
              </div>
            </div>

            {/* Critical Alerts */}
            {stryMutAct_9fa48("31964") ? criticalSignals.length > 0 || <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Critical Alerts
                </h2>
                <div className="space-y-3">
                  {criticalSignals.slice(0, 3).map(signal => <div key={signal.id} className={`p-4 rounded-xl border ${signal.severity === 'critical' ? 'bg-red-900/20 border-red-700/50' : 'bg-amber-900/20 border-amber-700/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{signal.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${signal.severity === 'critical' ? 'bg-red-600' : 'bg-amber-600'}`}>
                          {signal.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{signal.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>Confidence: {signal.confidence}%</span>
                        <span>Sources: {signal.sources}</span>
                        <span>Detected: {Math.floor((Date.now() - signal.detectedAt.getTime()) / 3600000)}h ago</span>
                      </div>
                    </div>)}
                </div>
              </div> : stryMutAct_9fa48("31963") ? false : stryMutAct_9fa48("31962") ? true : (stryCov_9fa48("31962", "31963", "31964"), (stryMutAct_9fa48("31967") ? criticalSignals.length <= 0 : stryMutAct_9fa48("31966") ? criticalSignals.length >= 0 : stryMutAct_9fa48("31965") ? true : (stryCov_9fa48("31965", "31966", "31967"), criticalSignals.length > 0)) && <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Critical Alerts
                </h2>
                <div className="space-y-3">
                  {stryMutAct_9fa48("31968") ? criticalSignals.map(signal => <div key={signal.id} className={`p-4 rounded-xl border ${signal.severity === 'critical' ? 'bg-red-900/20 border-red-700/50' : 'bg-amber-900/20 border-amber-700/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{signal.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${signal.severity === 'critical' ? 'bg-red-600' : 'bg-amber-600'}`}>
                          {signal.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{signal.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>Confidence: {signal.confidence}%</span>
                        <span>Sources: {signal.sources}</span>
                        <span>Detected: {Math.floor((Date.now() - signal.detectedAt.getTime()) / 3600000)}h ago</span>
                      </div>
                    </div>) : (stryCov_9fa48("31968"), criticalSignals.slice(0, 3).map(stryMutAct_9fa48("31969") ? () => undefined : (stryCov_9fa48("31969"), signal => <div key={signal.id} className={`p-4 rounded-xl border ${(stryMutAct_9fa48("31973") ? signal.severity !== 'critical' : stryMutAct_9fa48("31972") ? false : stryMutAct_9fa48("31971") ? true : (stryCov_9fa48("31971", "31972", "31973"), signal.severity === 'critical')) ? 'bg-red-900/20 border-red-700/50' : 'bg-amber-900/20 border-amber-700/50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{signal.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("31980") ? signal.severity !== 'critical' : stryMutAct_9fa48("31979") ? false : stryMutAct_9fa48("31978") ? true : (stryCov_9fa48("31978", "31979", "31980"), signal.severity === 'critical')) ? 'bg-red-600' : 'bg-amber-600'}`}>
                          {stryMutAct_9fa48("31984") ? signal.severity.toLowerCase() : (stryCov_9fa48("31984"), signal.severity.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{signal.description}</p>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>Confidence: {signal.confidence}%</span>
                        <span>Sources: {signal.sources}</span>
                        <span>Detected: {Math.floor(stryMutAct_9fa48("31985") ? (Date.now() - signal.detectedAt.getTime()) * 3600000 : (stryCov_9fa48("31985"), (stryMutAct_9fa48("31986") ? Date.now() + signal.detectedAt.getTime() : (stryCov_9fa48("31986"), Date.now() - signal.detectedAt.getTime())) / 3600000))}h ago</span>
                      </div>
                    </div>)))}
                </div>
              </div>)}

            {/* Industry Distribution */}
            <div className="grid grid-cols-4 gap-4">
              {(Object.keys(INDUSTRY_CONFIG) as Industry[]).map(industry => {
            const config = INDUSTRY_CONFIG[industry];
            const participants = Math.floor(stryMutAct_9fa48("31988") ? networkStats.totalParticipants / (0.08 + Math.random() * 0.12) : (stryCov_9fa48("31988"), networkStats.totalParticipants * (stryMutAct_9fa48("31989") ? 0.08 - Math.random() * 0.12 : (stryCov_9fa48("31989"), 0.08 + (stryMutAct_9fa48("31990") ? Math.random() / 0.12 : (stryCov_9fa48("31990"), Math.random() * 0.12))))));
            return <div key={industry} onClick={stryMutAct_9fa48("31991") ? () => undefined : (stryCov_9fa48("31991"), () => setSelectedIndustry(industry))} className={`bg-black/30 rounded-xl p-4 border cursor-pointer transition-all ${(stryMutAct_9fa48("31995") ? selectedIndustry !== industry : stryMutAct_9fa48("31994") ? false : stryMutAct_9fa48("31993") ? true : (stryCov_9fa48("31993", "31994", "31995"), selectedIndustry === industry)) ? 'border-cyan-400 ring-2 ring-cyan-400/20' : 'border-cyan-800/50 hover:border-cyan-600'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{config.name}</div>
                        <div className="text-xs text-white/50">{participants} participants</div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${config.color}`} style={stryMutAct_9fa48("32000") ? {} : (stryCov_9fa48("32000"), {
                  width: `${stryMutAct_9fa48("32002") ? participants / networkStats.totalParticipants * 100 / 5 : (stryCov_9fa48("32002"), (stryMutAct_9fa48("32003") ? participants / networkStats.totalParticipants / 100 : (stryCov_9fa48("32003"), (stryMutAct_9fa48("32004") ? participants * networkStats.totalParticipants : (stryCov_9fa48("32004"), participants / networkStats.totalParticipants)) * 100)) * 5)}%`
                })} />
                    </div>
                  </div>;
          })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Your Benchmarks</h3>
                <div className="space-y-3">
                  {stryMutAct_9fa48("32005") ? benchmarks.map(b => <div key={b.id} className="flex items-center justify-between">
                      <span className="text-sm text-white/70">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{b.yourValue}{b.unit}</span>
                        <span className={`text-xs ${b.yourValue >= b.industryP75 ? 'text-green-400' : b.yourValue >= b.industryP50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {b.yourValue >= b.industryP75 ? 'Top 25%' : b.yourValue >= b.industryP50 ? 'Above Median' : 'Below Median'}
                        </span>
                      </div>
                    </div>) : (stryCov_9fa48("32005"), benchmarks.slice(0, 4).map(stryMutAct_9fa48("32006") ? () => undefined : (stryCov_9fa48("32006"), b => <div key={b.id} className="flex items-center justify-between">
                      <span className="text-sm text-white/70">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{b.yourValue}{b.unit}</span>
                        <span className={`text-xs ${(stryMutAct_9fa48("32011") ? b.yourValue < b.industryP75 : stryMutAct_9fa48("32010") ? b.yourValue > b.industryP75 : stryMutAct_9fa48("32009") ? false : stryMutAct_9fa48("32008") ? true : (stryCov_9fa48("32008", "32009", "32010", "32011"), b.yourValue >= b.industryP75)) ? 'text-green-400' : (stryMutAct_9fa48("32016") ? b.yourValue < b.industryP50 : stryMutAct_9fa48("32015") ? b.yourValue > b.industryP50 : stryMutAct_9fa48("32014") ? false : stryMutAct_9fa48("32013") ? true : (stryCov_9fa48("32013", "32014", "32015", "32016"), b.yourValue >= b.industryP50)) ? 'text-amber-400' : 'text-red-400'}`}>
                          {(stryMutAct_9fa48("32022") ? b.yourValue < b.industryP75 : stryMutAct_9fa48("32021") ? b.yourValue > b.industryP75 : stryMutAct_9fa48("32020") ? false : stryMutAct_9fa48("32019") ? true : (stryCov_9fa48("32019", "32020", "32021", "32022"), b.yourValue >= b.industryP75)) ? 'Top 25%' : (stryMutAct_9fa48("32027") ? b.yourValue < b.industryP50 : stryMutAct_9fa48("32026") ? b.yourValue > b.industryP50 : stryMutAct_9fa48("32025") ? false : stryMutAct_9fa48("32024") ? true : (stryCov_9fa48("32024", "32025", "32026", "32027"), b.yourValue >= b.industryP50)) ? 'Above Median' : 'Below Median'}
                        </span>
                      </div>
                    </div>)))}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Recent Insights</h3>
                <div className="space-y-3">
                  {stryMutAct_9fa48("32030") ? riskSignals.map(s => <div key={s.id} className="flex items-start gap-3">
                      <span className={`text-lg ${s.category === 'risk' ? '⚠️' : s.category === 'opportunity' ? '💡' : s.category === 'trend' ? '📈' : s.category === 'fraud' ? '🚨' : '🔔'}`} />
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-white/50">{s.affectedIndustries.length} industries affected</div>
                      </div>
                    </div>) : (stryCov_9fa48("32030"), riskSignals.slice(0, 4).map(stryMutAct_9fa48("32031") ? () => undefined : (stryCov_9fa48("32031"), s => <div key={s.id} className="flex items-start gap-3">
                      <span className={`text-lg ${(stryMutAct_9fa48("32035") ? s.category !== 'risk' : stryMutAct_9fa48("32034") ? false : stryMutAct_9fa48("32033") ? true : (stryCov_9fa48("32033", "32034", "32035"), s.category === 'risk')) ? '⚠️' : (stryMutAct_9fa48("32040") ? s.category !== 'opportunity' : stryMutAct_9fa48("32039") ? false : stryMutAct_9fa48("32038") ? true : (stryCov_9fa48("32038", "32039", "32040"), s.category === 'opportunity')) ? '💡' : (stryMutAct_9fa48("32045") ? s.category !== 'trend' : stryMutAct_9fa48("32044") ? false : stryMutAct_9fa48("32043") ? true : (stryCov_9fa48("32043", "32044", "32045"), s.category === 'trend')) ? '📈' : (stryMutAct_9fa48("32050") ? s.category !== 'fraud' : stryMutAct_9fa48("32049") ? false : stryMutAct_9fa48("32048") ? true : (stryCov_9fa48("32048", "32049", "32050"), s.category === 'fraud')) ? '🚨' : '🔔'}`} />
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-white/50">{s.affectedIndustries.length} industries affected</div>
                      </div>
                    </div>)))}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Network Activity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Data contributions today</span>
                    <span className="font-bold text-cyan-400">12,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">New insights this week</span>
                    <span className="font-bold text-purple-400">847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Your contribution rank</span>
                    <span className="font-bold text-amber-400">Top 5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Insights consumed</span>
                    <span className="font-bold text-green-400">234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("32056") ? activeTab === 'benchmarks' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-700/50">
              <h2 className="text-lg font-semibold mb-2">📊 Anonymized Performance Benchmarking</h2>
              <p className="text-white/60">
                Compare your performance against industry peers across key metrics. All data is aggregated and anonymized—
                individual company data is never exposed.
              </p>
            </div>

            <div className="space-y-4">
              {benchmarks.map(b => <div key={b.id} className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{b.name}</h3>
                      <div className="text-sm text-white/50">{b.category} • {b.participants} participants</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{b.yourValue}{b.unit}</div>
                      <div className={`text-sm flex items-center gap-1 justify-end ${b.trend === 'up' ? 'text-green-400' : b.trend === 'down' ? 'text-red-400' : 'text-white/50'}`}>
                        {b.trend === 'up' ? '↑' : b.trend === 'down' ? '↓' : '→'}
                        {Math.abs(b.trendPercent)}% vs last quarter
                      </div>
                    </div>
                  </div>

                  {/* Percentile Visualization */}
                  <div className="relative h-8 bg-black/30 rounded-full overflow-hidden mb-2">
                    <div className="absolute inset-0 flex">
                      <div className="bg-red-900/50 h-full" style={{
                  width: '25%'
                }} />
                      <div className="bg-amber-900/50 h-full" style={{
                  width: '25%'
                }} />
                      <div className="bg-green-900/50 h-full" style={{
                  width: '25%'
                }} />
                      <div className="bg-emerald-900/50 h-full" style={{
                  width: '25%'
                }} />
                    </div>
                    <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50" style={{
                left: `${Math.min(100, Math.max(0, (b.yourValue - b.industryP25) / (b.industryP90 - b.industryP25) * 75 + 25))}%`
              }} />
                  </div>

                  <div className="flex justify-between text-xs text-white/50">
                    <span>P25: {b.industryP25}{b.unit}</span>
                    <span>P50: {b.industryP50}{b.unit}</span>
                    <span>P75: {b.industryP75}{b.unit}</span>
                    <span>P90: {b.industryP90}{b.unit}</span>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("32055") ? false : stryMutAct_9fa48("32054") ? true : (stryCov_9fa48("32054", "32055", "32056"), (stryMutAct_9fa48("32058") ? activeTab !== 'benchmarks' : stryMutAct_9fa48("32057") ? true : (stryCov_9fa48("32057", "32058"), activeTab === 'benchmarks')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-700/50">
              <h2 className="text-lg font-semibold mb-2">📊 Anonymized Performance Benchmarking</h2>
              <p className="text-white/60">
                Compare your performance against industry peers across key metrics. All data is aggregated and anonymized—
                individual company data is never exposed.
              </p>
            </div>

            <div className="space-y-4">
              {benchmarks.map(stryMutAct_9fa48("32060") ? () => undefined : (stryCov_9fa48("32060"), b => <div key={b.id} className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{b.name}</h3>
                      <div className="text-sm text-white/50">{b.category} • {b.participants} participants</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{b.yourValue}{b.unit}</div>
                      <div className={`text-sm flex items-center gap-1 justify-end ${(stryMutAct_9fa48("32064") ? b.trend !== 'up' : stryMutAct_9fa48("32063") ? false : stryMutAct_9fa48("32062") ? true : (stryCov_9fa48("32062", "32063", "32064"), b.trend === 'up')) ? 'text-green-400' : (stryMutAct_9fa48("32069") ? b.trend !== 'down' : stryMutAct_9fa48("32068") ? false : stryMutAct_9fa48("32067") ? true : (stryCov_9fa48("32067", "32068", "32069"), b.trend === 'down')) ? 'text-red-400' : 'text-white/50'}`}>
                        {(stryMutAct_9fa48("32075") ? b.trend !== 'up' : stryMutAct_9fa48("32074") ? false : stryMutAct_9fa48("32073") ? true : (stryCov_9fa48("32073", "32074", "32075"), b.trend === 'up')) ? '↑' : (stryMutAct_9fa48("32080") ? b.trend !== 'down' : stryMutAct_9fa48("32079") ? false : stryMutAct_9fa48("32078") ? true : (stryCov_9fa48("32078", "32079", "32080"), b.trend === 'down')) ? '↓' : '→'}
                        {Math.abs(b.trendPercent)}% vs last quarter
                      </div>
                    </div>
                  </div>

                  {/* Percentile Visualization */}
                  <div className="relative h-8 bg-black/30 rounded-full overflow-hidden mb-2">
                    <div className="absolute inset-0 flex">
                      <div className="bg-red-900/50 h-full" style={stryMutAct_9fa48("32084") ? {} : (stryCov_9fa48("32084"), {
                  width: '25%'
                })} />
                      <div className="bg-amber-900/50 h-full" style={stryMutAct_9fa48("32086") ? {} : (stryCov_9fa48("32086"), {
                  width: '25%'
                })} />
                      <div className="bg-green-900/50 h-full" style={stryMutAct_9fa48("32088") ? {} : (stryCov_9fa48("32088"), {
                  width: '25%'
                })} />
                      <div className="bg-emerald-900/50 h-full" style={stryMutAct_9fa48("32090") ? {} : (stryCov_9fa48("32090"), {
                  width: '25%'
                })} />
                    </div>
                    <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50" style={stryMutAct_9fa48("32092") ? {} : (stryCov_9fa48("32092"), {
                left: `${stryMutAct_9fa48("32094") ? Math.max(100, Math.max(0, (b.yourValue - b.industryP25) / (b.industryP90 - b.industryP25) * 75 + 25)) : (stryCov_9fa48("32094"), Math.min(100, stryMutAct_9fa48("32095") ? Math.min(0, (b.yourValue - b.industryP25) / (b.industryP90 - b.industryP25) * 75 + 25) : (stryCov_9fa48("32095"), Math.max(0, stryMutAct_9fa48("32096") ? (b.yourValue - b.industryP25) / (b.industryP90 - b.industryP25) * 75 - 25 : (stryCov_9fa48("32096"), (stryMutAct_9fa48("32097") ? (b.yourValue - b.industryP25) / (b.industryP90 - b.industryP25) / 75 : (stryCov_9fa48("32097"), (stryMutAct_9fa48("32098") ? (b.yourValue - b.industryP25) * (b.industryP90 - b.industryP25) : (stryCov_9fa48("32098"), (stryMutAct_9fa48("32099") ? b.yourValue + b.industryP25 : (stryCov_9fa48("32099"), b.yourValue - b.industryP25)) / (stryMutAct_9fa48("32100") ? b.industryP90 + b.industryP25 : (stryCov_9fa48("32100"), b.industryP90 - b.industryP25)))) * 75)) + 25)))))}%`
              })} />
                  </div>

                  <div className="flex justify-between text-xs text-white/50">
                    <span>P25: {b.industryP25}{b.unit}</span>
                    <span>P50: {b.industryP50}{b.unit}</span>
                    <span>P75: {b.industryP75}{b.unit}</span>
                    <span>P90: {b.industryP90}{b.unit}</span>
                  </div>
                </div>))}
            </div>
          </div>)}

        {stryMutAct_9fa48("32103") ? activeTab === 'signals' || <div className="space-y-4">
            {riskSignals.map(signal => <div key={signal.id} className={`bg-black/30 rounded-2xl p-6 border ${signal.severity === 'critical' ? 'border-red-700/50' : signal.severity === 'high' ? 'border-amber-700/50' : signal.severity === 'medium' ? 'border-yellow-700/50' : 'border-cyan-800/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {signal.category === 'risk' ? '⚠️' : signal.category === 'opportunity' ? '💡' : signal.category === 'trend' ? '📈' : signal.category === 'fraud' ? '🚨' : signal.category === 'disruption' ? '⛈️' : '📢'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{signal.title}</h3>
                      <div className="text-sm text-white/50">
                        Confidence: {signal.confidence}% • {signal.sources} sources
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${signal.severity === 'critical' ? 'bg-red-600' : signal.severity === 'high' ? 'bg-amber-600' : signal.severity === 'medium' ? 'bg-yellow-600' : signal.severity === 'low' ? 'bg-blue-600' : 'bg-neutral-600'}`}>
                    {signal.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-white/70 mb-4">{signal.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Affected Industries</div>
                    <div className="flex flex-wrap gap-1">
                      {signal.affectedIndustries.map(ind => <span key={ind} className="text-xs px-2 py-1 bg-cyan-900/50 rounded">
                          {INDUSTRY_CONFIG[ind].icon} {INDUSTRY_CONFIG[ind].name}
                        </span>)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Affected Regions</div>
                    <div className="flex flex-wrap gap-1">
                      {signal.affectedRegions.map(reg => <span key={reg} className="text-xs px-2 py-1 bg-blue-900/50 rounded">{reg}</span>)}
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-2">Recommended Actions</div>
                  <ul className="space-y-1">
                    {signal.recommendations.map((rec, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="text-green-400">→</span>
                        {rec}
                      </li>)}
                  </ul>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("32102") ? false : stryMutAct_9fa48("32101") ? true : (stryCov_9fa48("32101", "32102", "32103"), (stryMutAct_9fa48("32105") ? activeTab !== 'signals' : stryMutAct_9fa48("32104") ? true : (stryCov_9fa48("32104", "32105"), activeTab === 'signals')) && <div className="space-y-4">
            {riskSignals.map(stryMutAct_9fa48("32107") ? () => undefined : (stryCov_9fa48("32107"), signal => <div key={signal.id} className={`bg-black/30 rounded-2xl p-6 border ${(stryMutAct_9fa48("32111") ? signal.severity !== 'critical' : stryMutAct_9fa48("32110") ? false : stryMutAct_9fa48("32109") ? true : (stryCov_9fa48("32109", "32110", "32111"), signal.severity === 'critical')) ? 'border-red-700/50' : (stryMutAct_9fa48("32116") ? signal.severity !== 'high' : stryMutAct_9fa48("32115") ? false : stryMutAct_9fa48("32114") ? true : (stryCov_9fa48("32114", "32115", "32116"), signal.severity === 'high')) ? 'border-amber-700/50' : (stryMutAct_9fa48("32121") ? signal.severity !== 'medium' : stryMutAct_9fa48("32120") ? false : stryMutAct_9fa48("32119") ? true : (stryCov_9fa48("32119", "32120", "32121"), signal.severity === 'medium')) ? 'border-yellow-700/50' : 'border-cyan-800/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {(stryMutAct_9fa48("32127") ? signal.category !== 'risk' : stryMutAct_9fa48("32126") ? false : stryMutAct_9fa48("32125") ? true : (stryCov_9fa48("32125", "32126", "32127"), signal.category === 'risk')) ? '⚠️' : (stryMutAct_9fa48("32132") ? signal.category !== 'opportunity' : stryMutAct_9fa48("32131") ? false : stryMutAct_9fa48("32130") ? true : (stryCov_9fa48("32130", "32131", "32132"), signal.category === 'opportunity')) ? '💡' : (stryMutAct_9fa48("32137") ? signal.category !== 'trend' : stryMutAct_9fa48("32136") ? false : stryMutAct_9fa48("32135") ? true : (stryCov_9fa48("32135", "32136", "32137"), signal.category === 'trend')) ? '📈' : (stryMutAct_9fa48("32142") ? signal.category !== 'fraud' : stryMutAct_9fa48("32141") ? false : stryMutAct_9fa48("32140") ? true : (stryCov_9fa48("32140", "32141", "32142"), signal.category === 'fraud')) ? '🚨' : (stryMutAct_9fa48("32147") ? signal.category !== 'disruption' : stryMutAct_9fa48("32146") ? false : stryMutAct_9fa48("32145") ? true : (stryCov_9fa48("32145", "32146", "32147"), signal.category === 'disruption')) ? '⛈️' : '📢'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{signal.title}</h3>
                      <div className="text-sm text-white/50">
                        Confidence: {signal.confidence}% • {signal.sources} sources
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("32154") ? signal.severity !== 'critical' : stryMutAct_9fa48("32153") ? false : stryMutAct_9fa48("32152") ? true : (stryCov_9fa48("32152", "32153", "32154"), signal.severity === 'critical')) ? 'bg-red-600' : (stryMutAct_9fa48("32159") ? signal.severity !== 'high' : stryMutAct_9fa48("32158") ? false : stryMutAct_9fa48("32157") ? true : (stryCov_9fa48("32157", "32158", "32159"), signal.severity === 'high')) ? 'bg-amber-600' : (stryMutAct_9fa48("32164") ? signal.severity !== 'medium' : stryMutAct_9fa48("32163") ? false : stryMutAct_9fa48("32162") ? true : (stryCov_9fa48("32162", "32163", "32164"), signal.severity === 'medium')) ? 'bg-yellow-600' : (stryMutAct_9fa48("32169") ? signal.severity !== 'low' : stryMutAct_9fa48("32168") ? false : stryMutAct_9fa48("32167") ? true : (stryCov_9fa48("32167", "32168", "32169"), signal.severity === 'low')) ? 'bg-blue-600' : 'bg-neutral-600'}`}>
                    {stryMutAct_9fa48("32173") ? signal.severity.toLowerCase() : (stryCov_9fa48("32173"), signal.severity.toUpperCase())}
                  </span>
                </div>

                <p className="text-white/70 mb-4">{signal.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Affected Industries</div>
                    <div className="flex flex-wrap gap-1">
                      {signal.affectedIndustries.map(stryMutAct_9fa48("32174") ? () => undefined : (stryCov_9fa48("32174"), ind => <span key={ind} className="text-xs px-2 py-1 bg-cyan-900/50 rounded">
                          {INDUSTRY_CONFIG[ind].icon} {INDUSTRY_CONFIG[ind].name}
                        </span>))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Affected Regions</div>
                    <div className="flex flex-wrap gap-1">
                      {signal.affectedRegions.map(stryMutAct_9fa48("32175") ? () => undefined : (stryCov_9fa48("32175"), reg => <span key={reg} className="text-xs px-2 py-1 bg-blue-900/50 rounded">{reg}</span>))}
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-xs text-white/50 mb-2">Recommended Actions</div>
                  <ul className="space-y-1">
                    {signal.recommendations.map(stryMutAct_9fa48("32176") ? () => undefined : (stryCov_9fa48("32176"), (rec, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="text-green-400">→</span>
                        {rec}
                      </li>))}
                  </ul>
                </div>
              </div>))}
          </div>)}

        {stryMutAct_9fa48("32179") ? activeTab === 'pricing' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700/50">
              <h2 className="text-lg font-semibold mb-2">💰 Pricing Intelligence</h2>
              <p className="text-white/60">
                Real-time market pricing data aggregated from network participants. Use these insights for
                procurement negotiations, pricing strategy, and competitive analysis.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {pricingIntel.map(price => <div key={price.id} className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                  <div className="text-xs text-white/50 mb-1">{price.category}</div>
                  <h3 className="text-lg font-semibold mb-4">{price.product}</h3>

                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold">${price.yourPrice}</div>
                    <div className="text-sm text-white/50">{price.currency}</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P25</span>
                      <span>${price.marketP25}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P50</span>
                      <span>${price.marketP50}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P75</span>
                      <span>${price.marketP75}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cyan-800/30">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${price.forecast30d < price.yourPrice ? 'text-green-400' : 'text-red-400'}`}>
                        ${price.forecast30d}
                      </div>
                      <div className="text-xs text-white/50">30d Forecast</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${price.forecast90d < price.yourPrice ? 'text-green-400' : 'text-red-400'}`}>
                        ${price.forecast90d}
                      </div>
                      <div className="text-xs text-white/50">90d Forecast</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${price.trend === 'rising' ? 'bg-red-900 text-red-300' : price.trend === 'falling' ? 'bg-green-900 text-green-300' : 'bg-neutral-800 text-neutral-300'}`}>
                      {price.trend}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${price.volatility === 'high' ? 'bg-amber-900 text-amber-300' : price.volatility === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'}`}>
                      {price.volatility} volatility
                    </span>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("32178") ? false : stryMutAct_9fa48("32177") ? true : (stryCov_9fa48("32177", "32178", "32179"), (stryMutAct_9fa48("32181") ? activeTab !== 'pricing' : stryMutAct_9fa48("32180") ? true : (stryCov_9fa48("32180", "32181"), activeTab === 'pricing')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700/50">
              <h2 className="text-lg font-semibold mb-2">💰 Pricing Intelligence</h2>
              <p className="text-white/60">
                Real-time market pricing data aggregated from network participants. Use these insights for
                procurement negotiations, pricing strategy, and competitive analysis.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {pricingIntel.map(stryMutAct_9fa48("32183") ? () => undefined : (stryCov_9fa48("32183"), price => <div key={price.id} className="bg-black/30 rounded-2xl p-6 border border-cyan-800/50">
                  <div className="text-xs text-white/50 mb-1">{price.category}</div>
                  <h3 className="text-lg font-semibold mb-4">{price.product}</h3>

                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold">${price.yourPrice}</div>
                    <div className="text-sm text-white/50">{price.currency}</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P25</span>
                      <span>${price.marketP25}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P50</span>
                      <span>${price.marketP50}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Market P75</span>
                      <span>${price.marketP75}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cyan-800/30">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${(stryMutAct_9fa48("32188") ? price.forecast30d >= price.yourPrice : stryMutAct_9fa48("32187") ? price.forecast30d <= price.yourPrice : stryMutAct_9fa48("32186") ? false : stryMutAct_9fa48("32185") ? true : (stryCov_9fa48("32185", "32186", "32187", "32188"), price.forecast30d < price.yourPrice)) ? 'text-green-400' : 'text-red-400'}`}>
                        ${price.forecast30d}
                      </div>
                      <div className="text-xs text-white/50">30d Forecast</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${(stryMutAct_9fa48("32195") ? price.forecast90d >= price.yourPrice : stryMutAct_9fa48("32194") ? price.forecast90d <= price.yourPrice : stryMutAct_9fa48("32193") ? false : stryMutAct_9fa48("32192") ? true : (stryCov_9fa48("32192", "32193", "32194", "32195"), price.forecast90d < price.yourPrice)) ? 'text-green-400' : 'text-red-400'}`}>
                        ${price.forecast90d}
                      </div>
                      <div className="text-xs text-white/50">90d Forecast</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("32201") ? price.trend !== 'rising' : stryMutAct_9fa48("32200") ? false : stryMutAct_9fa48("32199") ? true : (stryCov_9fa48("32199", "32200", "32201"), price.trend === 'rising')) ? 'bg-red-900 text-red-300' : (stryMutAct_9fa48("32206") ? price.trend !== 'falling' : stryMutAct_9fa48("32205") ? false : stryMutAct_9fa48("32204") ? true : (stryCov_9fa48("32204", "32205", "32206"), price.trend === 'falling')) ? 'bg-green-900 text-green-300' : 'bg-neutral-800 text-neutral-300'}`}>
                      {price.trend}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("32213") ? price.volatility !== 'high' : stryMutAct_9fa48("32212") ? false : stryMutAct_9fa48("32211") ? true : (stryCov_9fa48("32211", "32212", "32213"), price.volatility === 'high')) ? 'bg-amber-900 text-amber-300' : (stryMutAct_9fa48("32218") ? price.volatility !== 'medium' : stryMutAct_9fa48("32217") ? false : stryMutAct_9fa48("32216") ? true : (stryCov_9fa48("32216", "32217", "32218"), price.volatility === 'medium')) ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'}`}>
                      {price.volatility} volatility
                    </span>
                  </div>
                </div>))}
            </div>
          </div>)}

        {stryMutAct_9fa48("32224") ? activeTab === 'supply-chain' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-700/50">
              <h2 className="text-lg font-semibold mb-2">🔗 Supply Chain Intelligence</h2>
              <p className="text-white/60">
                Early warning system for supply chain disruptions based on aggregated network data.
                Get ahead of issues before they impact your operations.
              </p>
            </div>

            <div className="space-y-4">
              {supplyChainAlerts.map(alert => <div key={alert.id} className={`bg-black/30 rounded-2xl p-6 border ${alert.severity === 'critical' ? 'border-red-700/50' : alert.severity === 'high' ? 'border-amber-700/50' : 'border-cyan-800/50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{alert.title}</h3>
                      <div className="text-sm text-white/50">
                        {alert.affectedSuppliers} suppliers affected • Expected duration: {alert.expectedDuration}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${alert.severity === 'critical' ? 'bg-red-600' : alert.severity === 'high' ? 'bg-amber-600' : 'bg-blue-600'}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-white/70 mb-4">{alert.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xs text-white/50 mb-1">Estimated Impact</div>
                      <div className="font-medium text-amber-400">{alert.estimatedImpact}</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xs text-white/50 mb-1">Affected Regions</div>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedRegions.map(reg => <span key={reg} className="text-xs px-2 py-0.5 bg-cyan-900/50 rounded">{reg}</span>)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-xs text-white/50 mb-2">Mitigation Options</div>
                    <div className="flex flex-wrap gap-2">
                      {alert.mitigationOptions.map((opt, idx) => <span key={idx} className="px-3 py-1.5 bg-green-900/50 rounded-lg text-sm">
                          {opt}
                        </span>)}
                    </div>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("32223") ? false : stryMutAct_9fa48("32222") ? true : (stryCov_9fa48("32222", "32223", "32224"), (stryMutAct_9fa48("32226") ? activeTab !== 'supply-chain' : stryMutAct_9fa48("32225") ? true : (stryCov_9fa48("32225", "32226"), activeTab === 'supply-chain')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-700/50">
              <h2 className="text-lg font-semibold mb-2">🔗 Supply Chain Intelligence</h2>
              <p className="text-white/60">
                Early warning system for supply chain disruptions based on aggregated network data.
                Get ahead of issues before they impact your operations.
              </p>
            </div>

            <div className="space-y-4">
              {supplyChainAlerts.map(stryMutAct_9fa48("32228") ? () => undefined : (stryCov_9fa48("32228"), alert => <div key={alert.id} className={`bg-black/30 rounded-2xl p-6 border ${(stryMutAct_9fa48("32232") ? alert.severity !== 'critical' : stryMutAct_9fa48("32231") ? false : stryMutAct_9fa48("32230") ? true : (stryCov_9fa48("32230", "32231", "32232"), alert.severity === 'critical')) ? 'border-red-700/50' : (stryMutAct_9fa48("32237") ? alert.severity !== 'high' : stryMutAct_9fa48("32236") ? false : stryMutAct_9fa48("32235") ? true : (stryCov_9fa48("32235", "32236", "32237"), alert.severity === 'high')) ? 'border-amber-700/50' : 'border-cyan-800/50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{alert.title}</h3>
                      <div className="text-sm text-white/50">
                        {alert.affectedSuppliers} suppliers affected • Expected duration: {alert.expectedDuration}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("32244") ? alert.severity !== 'critical' : stryMutAct_9fa48("32243") ? false : stryMutAct_9fa48("32242") ? true : (stryCov_9fa48("32242", "32243", "32244"), alert.severity === 'critical')) ? 'bg-red-600' : (stryMutAct_9fa48("32249") ? alert.severity !== 'high' : stryMutAct_9fa48("32248") ? false : stryMutAct_9fa48("32247") ? true : (stryCov_9fa48("32247", "32248", "32249"), alert.severity === 'high')) ? 'bg-amber-600' : 'bg-blue-600'}`}>
                      {stryMutAct_9fa48("32253") ? alert.severity.toLowerCase() : (stryCov_9fa48("32253"), alert.severity.toUpperCase())}
                    </span>
                  </div>

                  <p className="text-white/70 mb-4">{alert.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xs text-white/50 mb-1">Estimated Impact</div>
                      <div className="font-medium text-amber-400">{alert.estimatedImpact}</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xs text-white/50 mb-1">Affected Regions</div>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedRegions.map(stryMutAct_9fa48("32254") ? () => undefined : (stryCov_9fa48("32254"), reg => <span key={reg} className="text-xs px-2 py-0.5 bg-cyan-900/50 rounded">{reg}</span>))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-xs text-white/50 mb-2">Mitigation Options</div>
                    <div className="flex flex-wrap gap-2">
                      {alert.mitigationOptions.map(stryMutAct_9fa48("32255") ? () => undefined : (stryCov_9fa48("32255"), (opt, idx) => <span key={idx} className="px-3 py-1.5 bg-green-900/50 rounded-lg text-sm">
                          {opt}
                        </span>))}
                    </div>
                  </div>
                </div>))}
            </div>
          </div>)}
      </main>
    </div>;
};
export default MeshPage;