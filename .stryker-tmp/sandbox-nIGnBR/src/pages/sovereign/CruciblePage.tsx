/**
 * CendiaCrucible™ - Synthetic Multiverse Simulation Engine
 * 
 * "Synthetic Reality. Infinite Stress Testing. Failure Before It Happens."
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
import React, { useState, useEffect } from 'react';
import { Flame, Play, Target, TrendingDown, TrendingUp, AlertTriangle, Shield, Users, DollarSign, Cpu, Globe, Zap, GitBranch, Network, BarChart3, Brain, ChevronRight, CheckCircle, XCircle, Clock, Sparkles, Eye, Radar, Calendar, Building2, FileDown, Share2, RotateCcw, Skull, Timer, Banknote, UserMinus, Lightbulb, Settings, FileText, ClipboardList } from 'lucide-react';
import apiClient from '../../lib/api/client';

// Types
interface SimulationTemplate {
  type: string;
  name: string;
  description: string;
  shockCount: number;
  shocks: Array<{
    target: string;
    type: string;
    value: number;
    timing: string;
    duration?: number;
  }>;
}

// Scenario explanations for guided view
const scenarioExplanations: Record<string, {
  title: string;
  whatHappens: string;
  whoAffected: string;
  realWorldExample: string;
}> = stryMutAct_9fa48("57955") ? {} : (stryCov_9fa48("57955"), {
  FINANCIAL_STRESS: stryMutAct_9fa48("57956") ? {} : (stryCov_9fa48("57956"), {
    title: 'Financial Stress Test',
    whatHappens: 'Simulates a sudden 30% revenue decline over 90 days combined with 15% operating cost increases. The system models how your cash flow, runway, and financial KPIs cascade through the organization.',
    whoAffected: 'Finance team, all departments with budgets, investors, creditors',
    realWorldExample: '2008 financial crisis, COVID-19 revenue collapse, major customer loss'
  }),
  OPERATIONAL_SHOCK: stryMutAct_9fa48("57961") ? {} : (stryCov_9fa48("57961"), {
    title: 'Operational Disruption',
    whatHappens: 'Models a 50% throughput reduction with 2.5x longer cycle times. Shows how operational bottlenecks propagate through your supply chain, delivery timelines, and customer satisfaction.',
    whoAffected: 'Operations, logistics, customer service, sales teams',
    realWorldExample: 'Factory shutdown, key system outage, major process failure'
  }),
  CYBER_ATTACK: stryMutAct_9fa48("57966") ? {} : (stryCov_9fa48("57966"), {
    title: 'Cybersecurity Incident',
    whatHappens: 'Simulates complete system unavailability, 80% security score drop, and 40% reputation damage over 6 months. Models incident response, recovery costs, and long-term trust impact.',
    whoAffected: 'IT, security, legal, PR, all employees, customers',
    realWorldExample: 'Colonial Pipeline ransomware, SolarWinds breach, Equifax data breach'
  }),
  REGULATORY_CHANGE: stryMutAct_9fa48("57971") ? {} : (stryCov_9fa48("57971"), {
    title: 'Regulatory Shock',
    whatHappens: 'Models 100% compliance cost increase over a year with 30% reduction in operational flexibility. Shows how new regulations affect product development, market access, and competitive positioning.',
    whoAffected: 'Legal, compliance, product teams, international operations',
    realWorldExample: 'GDPR implementation, AI Act compliance, SOX requirements'
  }),
  CULTURAL_SHIFT: stryMutAct_9fa48("57976") ? {} : (stryCov_9fa48("57976"), {
    title: 'Cultural Disruption',
    whatHappens: 'Simulates 40% drop in employee engagement over 60 days and 3x turnover rate increase. Models institutional knowledge loss, productivity decline, and recruitment costs.',
    whoAffected: 'HR, all managers, entire workforce',
    realWorldExample: 'Mass layoffs aftermath, toxic leadership exposure, remote work backlash'
  }),
  ESG_EVENT: stryMutAct_9fa48("57981") ? {} : (stryCov_9fa48("57981"), {
    title: 'ESG Crisis',
    whatHappens: 'Models 60% ESG score collapse and 35% investor confidence decline over 4 months. Shows impact on fundraising, partnerships, and brand value.',
    whoAffected: 'Executive team, investor relations, sustainability, PR',
    realWorldExample: 'Environmental scandal, labor violations exposed, governance failures'
  }),
  MA_SCENARIO: stryMutAct_9fa48("57986") ? {} : (stryCov_9fa48("57986"), {
    title: 'M&A Event',
    whatHappens: 'Simulates $5M integration costs and 25% productivity decline over 6 months. Models culture clash, system integration challenges, and talent retention during transition.',
    whoAffected: 'All employees, IT, HR, finance, operations',
    realWorldExample: 'Major acquisition, merger integration, spin-off transition'
  }),
  MARKET_DISRUPTION: stryMutAct_9fa48("57991") ? {} : (stryCov_9fa48("57991"), {
    title: 'Market Disruption',
    whatHappens: 'Models 20% market share loss over a year with 15% pricing power reduction. Shows competitive response options and long-term strategic positioning impacts.',
    whoAffected: 'Sales, marketing, product, strategy, executive team',
    realWorldExample: 'New competitor entry, technology disruption, demand shift'
  }),
  SUPPLY_CHAIN: stryMutAct_9fa48("57996") ? {} : (stryCov_9fa48("57996"), {
    title: 'Supply Chain Breakdown',
    whatHappens: 'Simulates 70% supply availability drop with 4x lead time increase. Models inventory depletion, customer impact, and alternative sourcing costs.',
    whoAffected: 'Procurement, operations, logistics, sales, customers',
    realWorldExample: 'Suez Canal blockage, chip shortage, pandemic supply disruption'
  }),
  TALENT_EXODUS: stryMutAct_9fa48("58001") ? {} : (stryCov_9fa48("58001"), {
    title: 'Talent Crisis',
    whatHappens: 'Models 50% key talent loss and 40% institutional knowledge decline over 90 days. Shows recruitment costs, productivity gaps, and competitive vulnerability.',
    whoAffected: 'All departments, HR, executive leadership',
    realWorldExample: 'Executive departures, team poaching, great resignation wave'
  }),
  TECHNOLOGY_FAILURE: stryMutAct_9fa48("58006") ? {} : (stryCov_9fa48("58006"), {
    title: 'Technology Failure',
    whatHappens: 'Simulates complete core system outage with 72-hour recovery time. Models business continuity, customer impact, and recovery procedures.',
    whoAffected: 'IT, all digital operations, customers, partners',
    realWorldExample: 'AWS outage, database corruption, critical software failure'
  }),
  BLACK_SWAN: stryMutAct_9fa48("58011") ? {} : (stryCov_9fa48("58011"), {
    title: 'Black Swan Event',
    whatHappens: 'Models 80% operational collapse with 60% external environment degradation. Stress tests your organization against extreme, unpredictable events.',
    whoAffected: 'Entire organization, all stakeholders',
    realWorldExample: 'Global pandemic, natural disaster, unprecedented market crash'
  }),
  AI_DISRUPTION: stryMutAct_9fa48("58016") ? {} : (stryCov_9fa48("58016"), {
    title: 'AI Market Disruption',
    whatHappens: 'Simulates 60% commoditization of core offerings due to AI automation, 40% competitive displacement, and 50% talent obsolescence over 18 months. Models required pivots and reinvention strategies.',
    whoAffected: 'Product, engineering, sales, entire workforce',
    realWorldExample: 'ChatGPT disrupting SaaS, GitHub Copilot changing development, AI replacing creative work'
  }),
  KEY_PERSON_RISK: stryMutAct_9fa48("58021") ? {} : (stryCov_9fa48("58021"), {
    title: 'Founder/Key Person Loss',
    whatHappens: 'Models sudden loss of CEO/founder or critical executive. Simulates 70% strategic direction uncertainty, 50% investor confidence drop, and 30% key customer concern over 6 months.',
    whoAffected: 'Board, investors, leadership team, all employees, key customers',
    realWorldExample: 'Sudden CEO departure, founder health crisis, key executive poaching'
  }),
  CUSTOMER_CONCENTRATION: stryMutAct_9fa48("58026") ? {} : (stryCov_9fa48("58026"), {
    title: 'Key Customer Loss',
    whatHappens: 'Models loss of top customer representing 25%+ of revenue. Simulates immediate 25-40% revenue drop, 6-month recovery timeline, and cascading effects on growth metrics.',
    whoAffected: 'Sales, finance, operations, investors',
    realWorldExample: 'Enterprise contract non-renewal, customer acquisition, strategic pivot away'
  }),
  CUSTOM: stryMutAct_9fa48("58031") ? {} : (stryCov_9fa48("58031"), {
    title: 'Custom Scenario',
    whatHappens: 'Define your own shocks and parameters to test specific hypotheses about your organization\'s resilience.',
    whoAffected: 'Depends on your configuration',
    realWorldExample: 'Your unique business risks and concerns'
  })
});
interface Simulation {
  id: string;
  name: string;
  simulation_type: string;
  status: string;
  created_at: string;
  results_summary?: ResultSummary;
  universes?: Universe[];
  impacts?: Impact[];
  council_deliberations?: CouncilDeliberation[];
}
interface Universe {
  id: string;
  universe_number: number;
  probability: number;
  outcome_sentiment: string;
  outcome_summary?: string;
}
interface Impact {
  id: string;
  impact_category: string;
  entity_name: string;
  change_percent?: number;
  severity: string;
}
interface CouncilDeliberation {
  id: string;
  agent_responses: AgentResponse[];
  consensus_reached: boolean;
  final_recommendation?: string;
  confidence_score?: number;
}
interface AgentResponse {
  agentRole: string;
  analysis: string;
  confidenceLevel: number;
}
interface ResultSummary {
  totalUniverses: number;
  bestCase: {
    probability: number;
    sentiment: string;
    summary: string;
  };
  worstCase: {
    probability: number;
    sentiment: string;
    summary: string;
  };
  mostLikely: {
    probability: number;
    sentiment: string;
    summary: string;
  };
  keyRisks: string[];
  keyOpportunities: string[];
  overallConfidence: number;
}

// Severity levels: EXISTENTIAL (🔴), SEVERE (🟠), MODERATE (🟡)
type SeverityLevel = 'EXISTENTIAL' | 'SEVERE' | 'MODERATE';
const scenarioSeverity: Record<string, SeverityLevel> = stryMutAct_9fa48("58036") ? {} : (stryCov_9fa48("58036"), {
  BLACK_SWAN: 'EXISTENTIAL',
  CYBER_ATTACK: 'EXISTENTIAL',
  TECHNOLOGY_FAILURE: 'EXISTENTIAL',
  AI_DISRUPTION: 'EXISTENTIAL',
  KEY_PERSON_RISK: 'EXISTENTIAL',
  CUSTOMER_CONCENTRATION: 'EXISTENTIAL',
  FINANCIAL_STRESS: 'SEVERE',
  TALENT_EXODUS: 'SEVERE',
  SUPPLY_CHAIN: 'SEVERE',
  OPERATIONAL_SHOCK: 'SEVERE',
  MARKET_DISRUPTION: 'MODERATE',
  REGULATORY_CHANGE: 'MODERATE',
  CULTURAL_SHIFT: 'MODERATE',
  ESG_EVENT: 'MODERATE',
  MA_SCENARIO: 'MODERATE',
  CUSTOM: 'MODERATE'
});
const severityColors: Record<SeverityLevel, {
  bg: string;
  border: string;
  text: string;
  badge: string;
  indicator: string;
}> = stryMutAct_9fa48("58053") ? {} : (stryCov_9fa48("58053"), {
  EXISTENTIAL: stryMutAct_9fa48("58054") ? {} : (stryCov_9fa48("58054"), {
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300',
    indicator: 'bg-red-500'
  }),
  SEVERE: stryMutAct_9fa48("58060") ? {} : (stryCov_9fa48("58060"), {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300',
    indicator: 'bg-orange-500'
  }),
  MODERATE: stryMutAct_9fa48("58066") ? {} : (stryCov_9fa48("58066"), {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300',
    indicator: 'bg-yellow-500'
  })
});

// Example shocks for each scenario (for card display)
const shockExamples: Record<string, string[]> = stryMutAct_9fa48("58072") ? {} : (stryCov_9fa48("58072"), {
  FINANCIAL_STRESS: stryMutAct_9fa48("58073") ? [] : (stryCov_9fa48("58073"), ['Revenue decline (10-50%)', 'Cost increase (15-40%)']),
  OPERATIONAL_SHOCK: stryMutAct_9fa48("58076") ? [] : (stryCov_9fa48("58076"), ['Throughput reduction (30-70%)', 'Cycle time increase (2-4x)']),
  CYBER_ATTACK: stryMutAct_9fa48("58079") ? [] : (stryCov_9fa48("58079"), ['System unavailability', 'Reputation damage (20-60%)']),
  REGULATORY_CHANGE: stryMutAct_9fa48("58082") ? [] : (stryCov_9fa48("58082"), ['Compliance cost spike (50-150%)', 'Flexibility reduction']),
  CULTURAL_SHIFT: stryMutAct_9fa48("58085") ? [] : (stryCov_9fa48("58085"), ['Engagement drop (20-50%)', 'Turnover increase (2-4x)']),
  ESG_EVENT: stryMutAct_9fa48("58088") ? [] : (stryCov_9fa48("58088"), ['ESG score collapse (40-80%)', 'Investor confidence loss']),
  MA_SCENARIO: stryMutAct_9fa48("58091") ? [] : (stryCov_9fa48("58091"), ['Integration costs ($1-10M)', 'Productivity decline (15-35%)']),
  MARKET_DISRUPTION: stryMutAct_9fa48("58094") ? [] : (stryCov_9fa48("58094"), ['Market share loss (10-30%)', 'Pricing power erosion']),
  SUPPLY_CHAIN: stryMutAct_9fa48("58097") ? [] : (stryCov_9fa48("58097"), ['Supply availability drop (50-90%)', 'Lead time increase (3-6x)']),
  TALENT_EXODUS: stryMutAct_9fa48("58100") ? [] : (stryCov_9fa48("58100"), ['Key talent loss (30-70%)', 'Knowledge drain (30-60%)']),
  TECHNOLOGY_FAILURE: stryMutAct_9fa48("58103") ? [] : (stryCov_9fa48("58103"), ['Core system outage', 'Recovery time (24-96h)']),
  BLACK_SWAN: stryMutAct_9fa48("58106") ? [] : (stryCov_9fa48("58106"), ['Multi-system failure (60-90%)', 'External environment shock']),
  AI_DISRUPTION: stryMutAct_9fa48("58109") ? [] : (stryCov_9fa48("58109"), ['Core offering commoditized (40-70%)', 'Competitive displacement']),
  KEY_PERSON_RISK: stryMutAct_9fa48("58112") ? [] : (stryCov_9fa48("58112"), ['Strategic direction loss', 'Investor confidence drop (30-60%)']),
  CUSTOMER_CONCENTRATION: stryMutAct_9fa48("58115") ? [] : (stryCov_9fa48("58115"), ['Revenue loss (25-40%)', 'Growth metric cascade']),
  CUSTOM: stryMutAct_9fa48("58118") ? [] : (stryCov_9fa48("58118"), ['User-defined parameters'])
});

// Scenario icons
const scenarioIcons: Record<string, React.ReactNode> = stryMutAct_9fa48("58120") ? {} : (stryCov_9fa48("58120"), {
  FINANCIAL_STRESS: <DollarSign className="w-5 h-5" />,
  OPERATIONAL_SHOCK: <Cpu className="w-5 h-5" />,
  CYBER_ATTACK: <Shield className="w-5 h-5" />,
  REGULATORY_CHANGE: <Globe className="w-5 h-5" />,
  CULTURAL_SHIFT: <Users className="w-5 h-5" />,
  MARKET_DISRUPTION: <TrendingDown className="w-5 h-5" />,
  SUPPLY_CHAIN: <Network className="w-5 h-5" />,
  TECHNOLOGY_FAILURE: <Zap className="w-5 h-5" />,
  BLACK_SWAN: <AlertTriangle className="w-5 h-5" />,
  TALENT_EXODUS: <UserMinus className="w-5 h-5" />,
  ESG_EVENT: <Globe className="w-5 h-5" />,
  MA_SCENARIO: <Building2 className="w-5 h-5" />,
  AI_DISRUPTION: <Brain className="w-5 h-5" />,
  KEY_PERSON_RISK: <Skull className="w-5 h-5" />,
  CUSTOMER_CONCENTRATION: <Users className="w-5 h-5" />,
  CUSTOM: <Target className="w-5 h-5" />
});

// Resilience Radar Component - Spider chart visualization
interface ResilienceScore {
  dimension: string;
  score: number;
  icon: React.ReactNode;
}
const ResilienceRadar: React.FC<{
  scores: ResilienceScore[];
  overallScore: number;
  weakest: {
    dimension: string;
    score: number;
  };
  strongest: {
    dimension: string;
    score: number;
  };
  onRunSimulation?: (dimension: string) => void;
}> = ({
  scores,
  overallScore,
  weakest,
  strongest,
  onRunSimulation
}) => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  const numPoints = scores.length;

  // Calculate polygon points for the scores
  const getPolygonPoints = (scoreList: ResilienceScore[]) => {
    return scoreList.map((s, i) => {
      const angle = stryMutAct_9fa48("58124") ? Math.PI * 2 * i / numPoints + Math.PI / 2 : (stryCov_9fa48("58124"), (stryMutAct_9fa48("58125") ? Math.PI * 2 * i * numPoints : (stryCov_9fa48("58125"), (stryMutAct_9fa48("58126") ? Math.PI * 2 / i : (stryCov_9fa48("58126"), (stryMutAct_9fa48("58127") ? Math.PI / 2 : (stryCov_9fa48("58127"), Math.PI * 2)) * i)) / numPoints)) - (stryMutAct_9fa48("58128") ? Math.PI * 2 : (stryCov_9fa48("58128"), Math.PI / 2)));
      const radius = stryMutAct_9fa48("58129") ? s.score / 100 / maxRadius : (stryCov_9fa48("58129"), (stryMutAct_9fa48("58130") ? s.score * 100 : (stryCov_9fa48("58130"), s.score / 100)) * maxRadius);
      const x = stryMutAct_9fa48("58131") ? centerX - radius * Math.cos(angle) : (stryCov_9fa48("58131"), centerX + (stryMutAct_9fa48("58132") ? radius / Math.cos(angle) : (stryCov_9fa48("58132"), radius * Math.cos(angle))));
      const y = stryMutAct_9fa48("58133") ? centerY - radius * Math.sin(angle) : (stryCov_9fa48("58133"), centerY + (stryMutAct_9fa48("58134") ? radius / Math.sin(angle) : (stryCov_9fa48("58134"), radius * Math.sin(angle))));
      return `${x},${y}`;
    }).join(' ');
  };

  // Generate grid circles
  const gridLevels = stryMutAct_9fa48("58137") ? [] : (stryCov_9fa48("58137"), [25, 50, 75, 100]);
  return <div className="p-6 bg-slate-900/80 border border-purple-500/30 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Radar className="w-5 h-5 text-purple-400" />
          Resilience Radar
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{overallScore}</span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
      </div>
      
      <div className="flex gap-6">
        {/* SVG Radar Chart */}
        <div className="flex-shrink-0">
          <svg width="300" height="300" className="mx-auto">
            {/* Grid circles */}
            {gridLevels.map(stryMutAct_9fa48("58138") ? () => undefined : (stryCov_9fa48("58138"), level => <circle key={level} cx={centerX} cy={centerY} r={stryMutAct_9fa48("58139") ? level / 100 / maxRadius : (stryCov_9fa48("58139"), (stryMutAct_9fa48("58140") ? level * 100 : (stryCov_9fa48("58140"), level / 100)) * maxRadius)} fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" />))}
            
            {/* Axis lines */}
            {scores.map((_, i) => {
            const angle = stryMutAct_9fa48("58142") ? Math.PI * 2 * i / numPoints + Math.PI / 2 : (stryCov_9fa48("58142"), (stryMutAct_9fa48("58143") ? Math.PI * 2 * i * numPoints : (stryCov_9fa48("58143"), (stryMutAct_9fa48("58144") ? Math.PI * 2 / i : (stryCov_9fa48("58144"), (stryMutAct_9fa48("58145") ? Math.PI / 2 : (stryCov_9fa48("58145"), Math.PI * 2)) * i)) / numPoints)) - (stryMutAct_9fa48("58146") ? Math.PI * 2 : (stryCov_9fa48("58146"), Math.PI / 2)));
            const x2 = stryMutAct_9fa48("58147") ? centerX - maxRadius * Math.cos(angle) : (stryCov_9fa48("58147"), centerX + (stryMutAct_9fa48("58148") ? maxRadius / Math.cos(angle) : (stryCov_9fa48("58148"), maxRadius * Math.cos(angle))));
            const y2 = stryMutAct_9fa48("58149") ? centerY - maxRadius * Math.sin(angle) : (stryCov_9fa48("58149"), centerY + (stryMutAct_9fa48("58150") ? maxRadius / Math.sin(angle) : (stryCov_9fa48("58150"), maxRadius * Math.sin(angle))));
            return <line key={i} x1={centerX} y1={centerY} x2={x2} y2={y2} stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />;
          })}
            
            {/* Score polygon */}
            <polygon points={getPolygonPoints(scores)} fill="rgba(168, 85, 247, 0.2)" stroke="rgb(168, 85, 247)" strokeWidth="2" />
            
            {/* Score points */}
            {scores.map((s, i) => {
            const angle = stryMutAct_9fa48("58152") ? Math.PI * 2 * i / numPoints + Math.PI / 2 : (stryCov_9fa48("58152"), (stryMutAct_9fa48("58153") ? Math.PI * 2 * i * numPoints : (stryCov_9fa48("58153"), (stryMutAct_9fa48("58154") ? Math.PI * 2 / i : (stryCov_9fa48("58154"), (stryMutAct_9fa48("58155") ? Math.PI / 2 : (stryCov_9fa48("58155"), Math.PI * 2)) * i)) / numPoints)) - (stryMutAct_9fa48("58156") ? Math.PI * 2 : (stryCov_9fa48("58156"), Math.PI / 2)));
            const radius = stryMutAct_9fa48("58157") ? s.score / 100 / maxRadius : (stryCov_9fa48("58157"), (stryMutAct_9fa48("58158") ? s.score * 100 : (stryCov_9fa48("58158"), s.score / 100)) * maxRadius);
            const x = stryMutAct_9fa48("58159") ? centerX - radius * Math.cos(angle) : (stryCov_9fa48("58159"), centerX + (stryMutAct_9fa48("58160") ? radius / Math.cos(angle) : (stryCov_9fa48("58160"), radius * Math.cos(angle))));
            const y = stryMutAct_9fa48("58161") ? centerY - radius * Math.sin(angle) : (stryCov_9fa48("58161"), centerY + (stryMutAct_9fa48("58162") ? radius / Math.sin(angle) : (stryCov_9fa48("58162"), radius * Math.sin(angle))));
            const labelRadius = stryMutAct_9fa48("58163") ? maxRadius - 25 : (stryCov_9fa48("58163"), maxRadius + 25);
            const labelX = stryMutAct_9fa48("58164") ? centerX - labelRadius * Math.cos(angle) : (stryCov_9fa48("58164"), centerX + (stryMutAct_9fa48("58165") ? labelRadius / Math.cos(angle) : (stryCov_9fa48("58165"), labelRadius * Math.cos(angle))));
            const labelY = stryMutAct_9fa48("58166") ? centerY - labelRadius * Math.sin(angle) : (stryCov_9fa48("58166"), centerY + (stryMutAct_9fa48("58167") ? labelRadius / Math.sin(angle) : (stryCov_9fa48("58167"), labelRadius * Math.sin(angle))));
            const isWeak = stryMutAct_9fa48("58171") ? s.score >= 60 : stryMutAct_9fa48("58170") ? s.score <= 60 : stryMutAct_9fa48("58169") ? false : stryMutAct_9fa48("58168") ? true : (stryCov_9fa48("58168", "58169", "58170", "58171"), s.score < 60);
            const isStrong = stryMutAct_9fa48("58175") ? s.score < 80 : stryMutAct_9fa48("58174") ? s.score > 80 : stryMutAct_9fa48("58173") ? false : stryMutAct_9fa48("58172") ? true : (stryCov_9fa48("58172", "58173", "58174", "58175"), s.score >= 80);
            return <g key={i}>
                  {/* Point */}
                  <circle cx={x} cy={y} r="6" fill={isWeak ? '#ef4444' : isStrong ? '#22c55e' : '#a855f7'} stroke="white" strokeWidth="2" />
                  {/* Label */}
                  <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" className="text-[10px] fill-gray-400 font-medium">
                    {s.dimension}
                  </text>
                  {/* Score */}
                  <text x={labelX} y={stryMutAct_9fa48("58179") ? labelY - 12 : (stryCov_9fa48("58179"), labelY + 12)} textAnchor="middle" className={`text-[11px] font-bold ${isWeak ? 'fill-red-400' : isStrong ? 'fill-green-400' : 'fill-purple-400'}`}>
                    {s.score}
                  </text>
                </g>;
          })}
          </svg>
        </div>
        
        {/* Insights panel */}
        <div className="flex-1 space-y-4">
          {/* Weakest dimension */}
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              Weakest: {weakest.dimension} ({weakest.score})
            </div>
            <button onClick={stryMutAct_9fa48("58184") ? () => undefined : (stryCov_9fa48("58184"), () => stryMutAct_9fa48("58185") ? onRunSimulation(weakest.dimension) : (stryCov_9fa48("58185"), onRunSimulation?.(weakest.dimension)))} className="text-xs text-red-300 hover:text-red-200 underline">
              Run simulation →
            </button>
          </div>
          
          {/* Strongest dimension */}
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Strongest: {strongest.dimension} ({strongest.score})
            </div>
          </div>
          
          {/* Score breakdown */}
          <div className="space-y-2">
            {scores.map(stryMutAct_9fa48("58186") ? () => undefined : (stryCov_9fa48("58186"), s => <div key={s.dimension} className="flex items-center gap-2">
                <div className="w-20 text-xs text-gray-400 truncate">{s.dimension}</div>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${(stryMutAct_9fa48("58191") ? s.score >= 60 : stryMutAct_9fa48("58190") ? s.score <= 60 : stryMutAct_9fa48("58189") ? false : stryMutAct_9fa48("58188") ? true : (stryCov_9fa48("58188", "58189", "58190", "58191"), s.score < 60)) ? 'bg-red-500' : (stryMutAct_9fa48("58196") ? s.score < 80 : stryMutAct_9fa48("58195") ? s.score > 80 : stryMutAct_9fa48("58194") ? false : stryMutAct_9fa48("58193") ? true : (stryCov_9fa48("58193", "58194", "58195", "58196"), s.score >= 80)) ? 'bg-green-500' : 'bg-purple-500'}`} style={stryMutAct_9fa48("58199") ? {} : (stryCov_9fa48("58199"), {
                width: `${s.score}%`
              })} />
                </div>
                <div className={`w-8 text-xs font-medium text-right ${(stryMutAct_9fa48("58205") ? s.score >= 60 : stryMutAct_9fa48("58204") ? s.score <= 60 : stryMutAct_9fa48("58203") ? false : stryMutAct_9fa48("58202") ? true : (stryCov_9fa48("58202", "58203", "58204", "58205"), s.score < 60)) ? 'text-red-400' : (stryMutAct_9fa48("58210") ? s.score < 80 : stryMutAct_9fa48("58209") ? s.score > 80 : stryMutAct_9fa48("58208") ? false : stryMutAct_9fa48("58207") ? true : (stryCov_9fa48("58207", "58208", "58209", "58210"), s.score >= 80)) ? 'text-green-400' : 'text-gray-400'}`}>
                  {s.score}
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>;
};

// Enhanced Results Panel with break points and recommendations
interface SimulationBreakPoint {
  month: number;
  event: string;
  severity: 'critical' | 'warning' | 'info';
}
interface RecommendedAction {
  priority: number;
  action: string;
  impact: string;
}
const EnhancedResultsPanel: React.FC<{
  simulation: Simulation;
  onExport?: () => void;
  onShare?: () => void;
  onRerun?: () => void;
}> = ({
  simulation,
  onExport,
  onShare,
  onRerun
}) => {
  // Calculate simulated metrics from results
  const results = simulation.results_summary;
  if (stryMutAct_9fa48("58216") ? false : stryMutAct_9fa48("58215") ? true : stryMutAct_9fa48("58214") ? results : (stryCov_9fa48("58214", "58215", "58216"), !results)) return null;

  // Generate synthetic break points based on scenario type
  const breakPoints: SimulationBreakPoint[] = stryMutAct_9fa48("58217") ? [] : (stryCov_9fa48("58217"), [stryMutAct_9fa48("58218") ? {} : (stryCov_9fa48("58218"), {
    month: 3,
    event: 'Critical resource threshold reached',
    severity: 'warning'
  }), stryMutAct_9fa48("58221") ? {} : (stryCov_9fa48("58221"), {
    month: 6,
    event: 'Cash flow becomes negative',
    severity: 'critical'
  }), stryMutAct_9fa48("58224") ? {} : (stryCov_9fa48("58224"), {
    month: 9,
    event: 'Operational capacity degraded by 50%',
    severity: 'critical'
  })]);
  const recommendedActions: RecommendedAction[] = stryMutAct_9fa48("58227") ? [] : (stryCov_9fa48("58227"), [stryMutAct_9fa48("58228") ? {} : (stryCov_9fa48("58228"), {
    priority: 1,
    action: 'Establish emergency credit facility',
    impact: '+3 months runway'
  }), stryMutAct_9fa48("58231") ? {} : (stryCov_9fa48("58231"), {
    priority: 2,
    action: 'Identify 15% cost reduction plan',
    impact: 'Reduce burn rate'
  }), stryMutAct_9fa48("58234") ? {} : (stryCov_9fa48("58234"), {
    priority: 3,
    action: 'Negotiate extended payment terms',
    impact: 'Improve cash flow'
  })]);

  // Calculate time metrics
  const survivalMonths = (stryMutAct_9fa48("58237") ? results.overallConfidence / 12 : (stryCov_9fa48("58237"), results.overallConfidence * 12)).toFixed(1);
  const criticalMonths = (stryMutAct_9fa48("58238") ? results.overallConfidence / 8 : (stryCov_9fa48("58238"), results.overallConfidence * 8)).toFixed(1);
  return <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
          <Timer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{criticalMonths}</div>
          <div className="text-xs text-gray-400">Months to Critical</div>
        </div>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
          <Skull className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{survivalMonths}</div>
          <div className="text-xs text-gray-400">Months to Failure</div>
        </div>
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
          <Banknote className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">${(stryMutAct_9fa48("58239") ? results.overallConfidence / 5 : (stryCov_9fa48("58239"), results.overallConfidence * 5)).toFixed(1)}M</div>
          <div className="text-xs text-gray-400">Cash at Risk</div>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
          <UserMinus className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">-{Math.round(stryMutAct_9fa48("58240") ? (1 - results.overallConfidence) / 40 : (stryCov_9fa48("58240"), (stryMutAct_9fa48("58241") ? 1 + results.overallConfidence : (stryCov_9fa48("58241"), 1 - results.overallConfidence)) * 40))}%</div>
          <div className="text-xs text-gray-400">Headcount Impact</div>
        </div>
      </div>
      
      {/* Break Points */}
      <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-xl">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Break Points Identified
        </h4>
        <div className="space-y-3">
          {breakPoints.map(stryMutAct_9fa48("58242") ? () => undefined : (stryCov_9fa48("58242"), (bp, i) => <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border ${(stryMutAct_9fa48("58246") ? bp.severity !== 'critical' : stryMutAct_9fa48("58245") ? false : stryMutAct_9fa48("58244") ? true : (stryCov_9fa48("58244", "58245", "58246"), bp.severity === 'critical')) ? 'bg-red-500/10 border-red-500/30' : (stryMutAct_9fa48("58251") ? bp.severity !== 'warning' : stryMutAct_9fa48("58250") ? false : stryMutAct_9fa48("58249") ? true : (stryCov_9fa48("58249", "58250", "58251"), bp.severity === 'warning')) ? 'bg-orange-500/10 border-orange-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${(stryMutAct_9fa48("58258") ? bp.severity !== 'critical' : stryMutAct_9fa48("58257") ? false : stryMutAct_9fa48("58256") ? true : (stryCov_9fa48("58256", "58257", "58258"), bp.severity === 'critical')) ? 'bg-red-500 text-white' : (stryMutAct_9fa48("58263") ? bp.severity !== 'warning' : stryMutAct_9fa48("58262") ? false : stryMutAct_9fa48("58261") ? true : (stryCov_9fa48("58261", "58262", "58263"), bp.severity === 'warning')) ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                M{bp.month}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${(stryMutAct_9fa48("58270") ? bp.severity !== 'critical' : stryMutAct_9fa48("58269") ? false : stryMutAct_9fa48("58268") ? true : (stryCov_9fa48("58268", "58269", "58270"), bp.severity === 'critical')) ? 'text-red-300' : (stryMutAct_9fa48("58275") ? bp.severity !== 'warning' : stryMutAct_9fa48("58274") ? false : stryMutAct_9fa48("58273") ? true : (stryCov_9fa48("58273", "58274", "58275"), bp.severity === 'warning')) ? 'text-orange-300' : 'text-blue-300'}`}>
                  Month {bp.month}
                </div>
                <div className="text-gray-300 text-sm">{bp.event}</div>
              </div>
            </div>))}
        </div>
      </div>
      
      {/* Recommended Actions */}
      <div className="p-5 bg-slate-900/80 border border-slate-700 rounded-xl">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Recommended Actions
        </h4>
        <div className="space-y-3">
          {recommendedActions.map(stryMutAct_9fa48("58279") ? () => undefined : (stryCov_9fa48("58279"), (action, i) => <div key={i} className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                {action.priority}
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{action.action}</div>
                <div className="text-green-400 text-xs">{action.impact}</div>
              </div>
            </div>))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button onClick={onExport} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors">
          <FileDown className="w-5 h-5" />
          Export Report
        </button>
        <button onClick={onShare} className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-5 h-5" />
          Share with Board
        </button>
        <button onClick={onRerun} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center justify-center gap-2 transition-colors">
          <RotateCcw className="w-5 h-5" />
          Run Again
        </button>
      </div>
    </div>;
};

// Types for new API responses
interface ResilienceData {
  overall: number;
  dimensions: Array<{
    dimension: string;
    score: number;
    trend: number;
  }>;
  weakest: {
    dimension: string;
    score: number;
  };
  strongest: {
    dimension: string;
    score: number;
  };
  lastUpdated: string;
}
interface BenchmarkData {
  industry: string;
  benchmarks: Array<{
    dimension: string;
    industryAvg: number;
    topQuartile: number;
    yourScore: number;
  }>;
  overallComparison: {
    yourScore: number;
    industryAvg: number;
    percentile: number;
  };
}
interface RecommendationData {
  scenarioType: string;
  priority: 'critical' | 'high' | 'medium';
  reason: string;
  relatedDimension: string;
  lastSimulated?: string;
}
interface RecentSimulationData {
  id: string;
  name: string;
  simulationType: string;
  status: string;
  createdAt: string;
  createdBy: string;
  resilienceScore?: number;
  sentiment?: string;
}
export const CruciblePage: React.FC = () => {
  const [templates, setTemplates] = useState<SimulationTemplate[]>(stryMutAct_9fa48("58281") ? ["Stryker was here"] : (stryCov_9fa48("58281"), []));
  const [simulations, setSimulations] = useState<Simulation[]>(stryMutAct_9fa48("58282") ? ["Stryker was here"] : (stryCov_9fa48("58282"), []));
  const [activeSimulation, setActiveSimulation] = useState<Simulation | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("58283") ? false : (stryCov_9fa48("58283"), true));
  const [isRunning, setIsRunning] = useState(stryMutAct_9fa48("58284") ? true : (stryCov_9fa48("58284"), false));
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [view, setView] = useState<'templates' | 'history' | 'results'>('templates');
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);

  // New state for real-time data
  const [resilienceData, setResilienceData] = useState<ResilienceData | null>(null);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData[]>(stryMutAct_9fa48("58286") ? ["Stryker was here"] : (stryCov_9fa48("58286"), []));
  const [recentSimulations, setRecentSimulations] = useState<RecentSimulationData[]>(stryMutAct_9fa48("58287") ? ["Stryker was here"] : (stryCov_9fa48("58287"), []));

  // Risk appetite slider (Conservative=1, Moderate=2, Aggressive=3)
  const [riskAppetite, setRiskAppetite] = useState<number>(2);
  const [showAssumptions, setShowAssumptions] = useState(stryMutAct_9fa48("58288") ? true : (stryCov_9fa48("58288"), false));
  const [showOutputArtifacts, setShowOutputArtifacts] = useState(stryMutAct_9fa48("58289") ? true : (stryCov_9fa48("58289"), false));

  // New state for scenario customization, history, and scheduling
  const [showScenarioCustomizer, setShowScenarioCustomizer] = useState(stryMutAct_9fa48("58290") ? true : (stryCov_9fa48("58290"), false));
  const [customScenario, setCustomScenario] = useState(stryMutAct_9fa48("58291") ? {} : (stryCov_9fa48("58291"), {
    revenueDecline: 30,
    costIncrease: 20,
    attritionRate: 15,
    marketShare: stryMutAct_9fa48("58292") ? +10 : (stryCov_9fa48("58292"), -10),
    duration: 6
  }));
  const [showHistorySidebar, setShowHistorySidebar] = useState(stryMutAct_9fa48("58293") ? true : (stryCov_9fa48("58293"), false));
  const [scheduleNightly, setScheduleNightly] = useState(stryMutAct_9fa48("58294") ? true : (stryCov_9fa48("58294"), false));

  // Risk appetite labels
  const riskAppetiteLabels = stryMutAct_9fa48("58295") ? [] : (stryCov_9fa48("58295"), ['Conservative', 'Moderate', 'Aggressive']);
  const riskAppetiteDescriptions = stryMutAct_9fa48("58299") ? {} : (stryCov_9fa48("58299"), {
    1: 'Lower severity thresholds, more warnings, cautious recommendations',
    2: 'Balanced severity thresholds, standard recommendations',
    3: 'Higher severity thresholds, focus on existential risks only'
  });
  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesRes, simulationsRes, resilienceRes, benchmarksRes, recommendationsRes, recentRes] = await Promise.all(stryMutAct_9fa48("58306") ? [] : (stryCov_9fa48("58306"), [apiClient.api.get<{
          data: SimulationTemplate[];
        }>('/crucible/templates'), apiClient.api.get<{
          data: Simulation[];
        }>('/crucible/simulations'), apiClient.api.get<{
          data: ResilienceData;
        }>('/crucible/resilience'), apiClient.api.get<{
          data: BenchmarkData;
        }>('/crucible/benchmarks'), apiClient.api.get<{
          data: RecommendationData[];
        }>('/crucible/recommendations'), apiClient.api.get<{
          data: RecentSimulationData[];
        }>('/crucible/recent')]));
        if (stryMutAct_9fa48("58315") ? templatesRes.success || templatesRes.data : stryMutAct_9fa48("58314") ? false : stryMutAct_9fa48("58313") ? true : (stryCov_9fa48("58313", "58314", "58315"), templatesRes.success && templatesRes.data)) {
          const data = stryMutAct_9fa48("58319") ? (templatesRes.data as any).data && templatesRes.data : stryMutAct_9fa48("58318") ? false : stryMutAct_9fa48("58317") ? true : (stryCov_9fa48("58317", "58318", "58319"), (templatesRes.data as any).data || templatesRes.data);
          setTemplates(Array.isArray(data) ? data : stryMutAct_9fa48("58320") ? ["Stryker was here"] : (stryCov_9fa48("58320"), []));
        }
        if (stryMutAct_9fa48("58323") ? simulationsRes.success || simulationsRes.data : stryMutAct_9fa48("58322") ? false : stryMutAct_9fa48("58321") ? true : (stryCov_9fa48("58321", "58322", "58323"), simulationsRes.success && simulationsRes.data)) {
          const data = stryMutAct_9fa48("58327") ? (simulationsRes.data as any).data && simulationsRes.data : stryMutAct_9fa48("58326") ? false : stryMutAct_9fa48("58325") ? true : (stryCov_9fa48("58325", "58326", "58327"), (simulationsRes.data as any).data || simulationsRes.data);
          setSimulations(Array.isArray(data) ? data : stryMutAct_9fa48("58328") ? ["Stryker was here"] : (stryCov_9fa48("58328"), []));
        }
        if (stryMutAct_9fa48("58331") ? resilienceRes.success || resilienceRes.data : stryMutAct_9fa48("58330") ? false : stryMutAct_9fa48("58329") ? true : (stryCov_9fa48("58329", "58330", "58331"), resilienceRes.success && resilienceRes.data)) {
          const data = stryMutAct_9fa48("58335") ? (resilienceRes.data as any).data && resilienceRes.data : stryMutAct_9fa48("58334") ? false : stryMutAct_9fa48("58333") ? true : (stryCov_9fa48("58333", "58334", "58335"), (resilienceRes.data as any).data || resilienceRes.data);
          setResilienceData(data);
        }
        if (stryMutAct_9fa48("58338") ? benchmarksRes.success || benchmarksRes.data : stryMutAct_9fa48("58337") ? false : stryMutAct_9fa48("58336") ? true : (stryCov_9fa48("58336", "58337", "58338"), benchmarksRes.success && benchmarksRes.data)) {
          const data = stryMutAct_9fa48("58342") ? (benchmarksRes.data as any).data && benchmarksRes.data : stryMutAct_9fa48("58341") ? false : stryMutAct_9fa48("58340") ? true : (stryCov_9fa48("58340", "58341", "58342"), (benchmarksRes.data as any).data || benchmarksRes.data);
          setBenchmarkData(data);
        }
        if (stryMutAct_9fa48("58345") ? recommendationsRes.success || recommendationsRes.data : stryMutAct_9fa48("58344") ? false : stryMutAct_9fa48("58343") ? true : (stryCov_9fa48("58343", "58344", "58345"), recommendationsRes.success && recommendationsRes.data)) {
          const data = stryMutAct_9fa48("58349") ? (recommendationsRes.data as any).data && recommendationsRes.data : stryMutAct_9fa48("58348") ? false : stryMutAct_9fa48("58347") ? true : (stryCov_9fa48("58347", "58348", "58349"), (recommendationsRes.data as any).data || recommendationsRes.data);
          setRecommendations(Array.isArray(data) ? data : stryMutAct_9fa48("58350") ? ["Stryker was here"] : (stryCov_9fa48("58350"), []));
        }
        if (stryMutAct_9fa48("58353") ? recentRes.success || recentRes.data : stryMutAct_9fa48("58352") ? false : stryMutAct_9fa48("58351") ? true : (stryCov_9fa48("58351", "58352", "58353"), recentRes.success && recentRes.data)) {
          const data = stryMutAct_9fa48("58357") ? (recentRes.data as any).data && recentRes.data : stryMutAct_9fa48("58356") ? false : stryMutAct_9fa48("58355") ? true : (stryCov_9fa48("58355", "58356", "58357"), (recentRes.data as any).data || recentRes.data);
          setRecentSimulations(Array.isArray(data) ? data : stryMutAct_9fa48("58358") ? ["Stryker was here"] : (stryCov_9fa48("58358"), []));
        }
      } catch (error) {
        console.error('Failed to load Crucible data:', error);
      } finally {
        setIsLoading(stryMutAct_9fa48("58362") ? true : (stryCov_9fa48("58362"), false));
      }
    };
    loadData();
  }, stryMutAct_9fa48("58363") ? ["Stryker was here"] : (stryCov_9fa48("58363"), []));
  const runSimulation = async (templateType: string, customParams?: typeof customScenario) => {
    setIsRunning(stryMutAct_9fa48("58365") ? false : (stryCov_9fa48("58365"), true));
    try {
      // Build simulation payload with custom parameters if provided
      const payload: any = stryMutAct_9fa48("58367") ? {} : (stryCov_9fa48("58367"), {
        name: `${templateType.replace(/_/g, ' ')} - ${new Date().toLocaleDateString()}`,
        simulationType: templateType,
        riskAppetite: stryMutAct_9fa48("58372") ? riskAppetiteLabels[riskAppetite - 1]?.toLowerCase() && 'moderate' : stryMutAct_9fa48("58371") ? false : stryMutAct_9fa48("58370") ? true : (stryCov_9fa48("58370", "58371", "58372"), (stryMutAct_9fa48("58374") ? riskAppetiteLabels[riskAppetite - 1].toLowerCase() : stryMutAct_9fa48("58373") ? riskAppetiteLabels[riskAppetite - 1]?.toUpperCase() : (stryCov_9fa48("58373", "58374"), riskAppetiteLabels[stryMutAct_9fa48("58375") ? riskAppetite + 1 : (stryCov_9fa48("58375"), riskAppetite - 1)]?.toLowerCase())) || 'moderate')
      });

      // Include custom scenario parameters for CUSTOM type
      if (stryMutAct_9fa48("58379") ? templateType === 'CUSTOM' || customParams : stryMutAct_9fa48("58378") ? false : stryMutAct_9fa48("58377") ? true : (stryCov_9fa48("58377", "58378", "58379"), (stryMutAct_9fa48("58381") ? templateType !== 'CUSTOM' : stryMutAct_9fa48("58380") ? true : (stryCov_9fa48("58380", "58381"), templateType === 'CUSTOM')) && customParams)) {
        payload.customParameters = stryMutAct_9fa48("58384") ? {} : (stryCov_9fa48("58384"), {
          revenueDecline: customParams.revenueDecline,
          costIncrease: customParams.costIncrease,
          attritionRate: customParams.attritionRate,
          marketShareChange: customParams.marketShare,
          durationMonths: customParams.duration
        });
      }
      const createRes = await apiClient.api.post<any>('/crucible/simulations', payload);
      if (stryMutAct_9fa48("58388") ? createRes.success || createRes.data : stryMutAct_9fa48("58387") ? false : stryMutAct_9fa48("58386") ? true : (stryCov_9fa48("58386", "58387", "58388"), createRes.success && createRes.data)) {
        const simulation = stryMutAct_9fa48("58392") ? (createRes.data as any).data && createRes.data as Simulation : stryMutAct_9fa48("58391") ? false : stryMutAct_9fa48("58390") ? true : (stryCov_9fa48("58390", "58391", "58392"), (createRes.data as any).data || createRes.data as Simulation);
        const runRes = await apiClient.api.post<{
          data: any;
        }>(`/crucible/simulations/${simulation.id}/run`);
        if (stryMutAct_9fa48("58395") ? false : stryMutAct_9fa48("58394") ? true : (stryCov_9fa48("58394", "58395"), runRes.success)) {
          const detailRes = await apiClient.api.get<any>(`/crucible/simulations/${simulation.id}`);
          if (stryMutAct_9fa48("58400") ? detailRes.success || detailRes.data : stryMutAct_9fa48("58399") ? false : stryMutAct_9fa48("58398") ? true : (stryCov_9fa48("58398", "58399", "58400"), detailRes.success && detailRes.data)) {
            setActiveSimulation(stryMutAct_9fa48("58404") ? (detailRes.data as any).data && detailRes.data as Simulation : stryMutAct_9fa48("58403") ? false : stryMutAct_9fa48("58402") ? true : (stryCov_9fa48("58402", "58403", "58404"), (detailRes.data as any).data || detailRes.data as Simulation));
            setView('results');
            const refreshRes = await apiClient.api.get<any>('/crucible/simulations');
            if (stryMutAct_9fa48("58409") ? refreshRes.success || refreshRes.data : stryMutAct_9fa48("58408") ? false : stryMutAct_9fa48("58407") ? true : (stryCov_9fa48("58407", "58408", "58409"), refreshRes.success && refreshRes.data)) {
              setSimulations(stryMutAct_9fa48("58413") ? (refreshRes.data as any).data && refreshRes.data as Simulation[] : stryMutAct_9fa48("58412") ? false : stryMutAct_9fa48("58411") ? true : (stryCov_9fa48("58411", "58412", "58413"), (refreshRes.data as any).data || refreshRes.data as Simulation[]));
            }
          }
        }
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(stryMutAct_9fa48("58417") ? true : (stryCov_9fa48("58417"), false));
    }
  };
  const loadSimulationDetails = async (id: string) => {
    const res = await apiClient.api.get<any>(`/crucible/simulations/${id}`);
    if (stryMutAct_9fa48("58422") ? res.success || res.data : stryMutAct_9fa48("58421") ? false : stryMutAct_9fa48("58420") ? true : (stryCov_9fa48("58420", "58421", "58422"), res.success && res.data)) {
      setActiveSimulation(stryMutAct_9fa48("58426") ? (res.data as any).data && res.data as Simulation : stryMutAct_9fa48("58425") ? false : stryMutAct_9fa48("58424") ? true : (stryCov_9fa48("58424", "58425", "58426"), (res.data as any).data || res.data as Simulation));
      setView('results');
    }
  };

  // Get the currently selected template details for modal
  const modalTemplate = showDetailModal ? templates.find(stryMutAct_9fa48("58428") ? () => undefined : (stryCov_9fa48("58428"), t => stryMutAct_9fa48("58431") ? t.type !== showDetailModal : stryMutAct_9fa48("58430") ? false : stryMutAct_9fa48("58429") ? true : (stryCov_9fa48("58429", "58430", "58431"), t.type === showDetailModal))) : null;
  const modalExplanation = showDetailModal ? scenarioExplanations[showDetailModal] : null;
  return <div className="min-h-screen bg-slate-950">
      {/* Scenario Detail Modal */}
      {stryMutAct_9fa48("58434") ? showDetailModal && modalTemplate && modalExplanation || <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${showDetailModal === 'BLACK_SWAN' ? 'bg-red-500/20 text-red-400' : showDetailModal === 'CYBER_ATTACK' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {scenarioIcons[showDetailModal] || <Target className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{modalExplanation.title}</h2>
                    <p className="text-gray-400 text-sm">{modalTemplate.shockCount} stress factors applied</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(null)} className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* What Happens */}
              <div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                  What Happens In This Simulation
                </h3>
                <p className="text-gray-300 leading-relaxed">{modalExplanation.whatHappens}</p>
              </div>

              {/* Shocks Applied */}
              <div>
                <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3">
                  Stress Factors Applied
                </h3>
                <div className="space-y-2">
                  {modalTemplate.shocks?.map((shock, i) => <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <span className="text-white font-medium capitalize">{shock.target.replace(/_/g, ' ')}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className={shock.value < 0 ? 'text-red-400' : 'text-yellow-400'}>
                          {shock.type === 'percentage' ? `${shock.value > 0 ? '+' : ''}${shock.value}%` : shock.type === 'multiplier' ? `${shock.value}x` : shock.value}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">({shock.timing}{shock.duration ? `, ${shock.duration} days` : ''})</span>
                      </div>
                    </div>)}
                </div>
              </div>

              {/* Who Is Affected */}
              <div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
                  Who Is Affected
                </h3>
                <p className="text-gray-300">{modalExplanation.whoAffected}</p>
              </div>

              {/* Real World Examples */}
              <div>
                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">
                  Real World Examples
                </h3>
                <p className="text-gray-300 italic">"{modalExplanation.realWorldExample}"</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button onClick={() => {
            setSelectedTemplate(showDetailModal);
            setShowDetailModal(null);
          }} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors">
                Select This Scenario
              </button>
              <button onClick={() => setShowDetailModal(null)} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 font-medium rounded-xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("58433") ? false : stryMutAct_9fa48("58432") ? true : (stryCov_9fa48("58432", "58433", "58434"), (stryMutAct_9fa48("58436") ? showDetailModal && modalTemplate || modalExplanation : stryMutAct_9fa48("58435") ? true : (stryCov_9fa48("58435", "58436"), (stryMutAct_9fa48("58438") ? showDetailModal || modalTemplate : stryMutAct_9fa48("58437") ? true : (stryCov_9fa48("58437", "58438"), showDetailModal && modalTemplate)) && modalExplanation)) && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${(stryMutAct_9fa48("58442") ? showDetailModal !== 'BLACK_SWAN' : stryMutAct_9fa48("58441") ? false : stryMutAct_9fa48("58440") ? true : (stryCov_9fa48("58440", "58441", "58442"), showDetailModal === 'BLACK_SWAN')) ? 'bg-red-500/20 text-red-400' : (stryMutAct_9fa48("58447") ? showDetailModal !== 'CYBER_ATTACK' : stryMutAct_9fa48("58446") ? false : stryMutAct_9fa48("58445") ? true : (stryCov_9fa48("58445", "58446", "58447"), showDetailModal === 'CYBER_ATTACK')) ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {stryMutAct_9fa48("58453") ? scenarioIcons[showDetailModal] && <Target className="w-6 h-6" /> : stryMutAct_9fa48("58452") ? false : stryMutAct_9fa48("58451") ? true : (stryCov_9fa48("58451", "58452", "58453"), scenarioIcons[showDetailModal] || <Target className="w-6 h-6" />)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{modalExplanation.title}</h2>
                    <p className="text-gray-400 text-sm">{modalTemplate.shockCount} stress factors applied</p>
                  </div>
                </div>
                <button onClick={stryMutAct_9fa48("58454") ? () => undefined : (stryCov_9fa48("58454"), () => setShowDetailModal(null))} className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* What Happens */}
              <div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                  What Happens In This Simulation
                </h3>
                <p className="text-gray-300 leading-relaxed">{modalExplanation.whatHappens}</p>
              </div>

              {/* Shocks Applied */}
              <div>
                <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3">
                  Stress Factors Applied
                </h3>
                <div className="space-y-2">
                  {stryMutAct_9fa48("58455") ? modalTemplate.shocks.map((shock, i) => <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <span className="text-white font-medium capitalize">{shock.target.replace(/_/g, ' ')}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className={shock.value < 0 ? 'text-red-400' : 'text-yellow-400'}>
                          {shock.type === 'percentage' ? `${shock.value > 0 ? '+' : ''}${shock.value}%` : shock.type === 'multiplier' ? `${shock.value}x` : shock.value}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">({shock.timing}{shock.duration ? `, ${shock.duration} days` : ''})</span>
                      </div>
                    </div>) : (stryCov_9fa48("58455"), modalTemplate.shocks?.map(stryMutAct_9fa48("58456") ? () => undefined : (stryCov_9fa48("58456"), (shock, i) => <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <span className="text-white font-medium capitalize">{shock.target.replace(/_/g, ' ')}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className={(stryMutAct_9fa48("58461") ? shock.value >= 0 : stryMutAct_9fa48("58460") ? shock.value <= 0 : stryMutAct_9fa48("58459") ? false : stryMutAct_9fa48("58458") ? true : (stryCov_9fa48("58458", "58459", "58460", "58461"), shock.value < 0)) ? 'text-red-400' : 'text-yellow-400'}>
                          {(stryMutAct_9fa48("58466") ? shock.type !== 'percentage' : stryMutAct_9fa48("58465") ? false : stryMutAct_9fa48("58464") ? true : (stryCov_9fa48("58464", "58465", "58466"), shock.type === 'percentage')) ? `${(stryMutAct_9fa48("58472") ? shock.value <= 0 : stryMutAct_9fa48("58471") ? shock.value >= 0 : stryMutAct_9fa48("58470") ? false : stryMutAct_9fa48("58469") ? true : (stryCov_9fa48("58469", "58470", "58471", "58472"), shock.value > 0)) ? '+' : ''}${shock.value}%` : (stryMutAct_9fa48("58477") ? shock.type !== 'multiplier' : stryMutAct_9fa48("58476") ? false : stryMutAct_9fa48("58475") ? true : (stryCov_9fa48("58475", "58476", "58477"), shock.type === 'multiplier')) ? `${shock.value}x` : shock.value}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">({shock.timing}{shock.duration ? `, ${shock.duration} days` : ''})</span>
                      </div>
                    </div>)))}
                </div>
              </div>

              {/* Who Is Affected */}
              <div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
                  Who Is Affected
                </h3>
                <p className="text-gray-300">{modalExplanation.whoAffected}</p>
              </div>

              {/* Real World Examples */}
              <div>
                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">
                  Real World Examples
                </h3>
                <p className="text-gray-300 italic">"{modalExplanation.realWorldExample}"</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button onClick={() => {
            setSelectedTemplate(showDetailModal);
            setShowDetailModal(null);
          }} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors">
                Select This Scenario
              </button>
              <button onClick={stryMutAct_9fa48("58483") ? () => undefined : (stryCov_9fa48("58483"), () => setShowDetailModal(null))} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 font-medium rounded-xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>)}
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/20">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  CendiaCrucible™
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                    SOVEREIGN
                  </span>
                </h1>
                <p className="text-purple-300/80 text-sm">
                  Synthetic Reality. Infinite Stress Testing. Failure Before It Happens.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
              {(stryMutAct_9fa48("58484") ? [] : (stryCov_9fa48("58484"), ['templates', 'history', 'results'])).map(stryMutAct_9fa48("58488") ? () => undefined : (stryCov_9fa48("58488"), v => <button key={v} onClick={stryMutAct_9fa48("58489") ? () => undefined : (stryCov_9fa48("58489"), () => setView(v as any))} disabled={stryMutAct_9fa48("58492") ? v === 'results' || !activeSimulation : stryMutAct_9fa48("58491") ? false : stryMutAct_9fa48("58490") ? true : (stryCov_9fa48("58490", "58491", "58492"), (stryMutAct_9fa48("58494") ? v !== 'results' : stryMutAct_9fa48("58493") ? true : (stryCov_9fa48("58493", "58494"), v === 'results')) && (stryMutAct_9fa48("58496") ? activeSimulation : (stryCov_9fa48("58496"), !activeSimulation)))} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${(stryMutAct_9fa48("58500") ? view !== v : stryMutAct_9fa48("58499") ? false : stryMutAct_9fa48("58498") ? true : (stryCov_9fa48("58498", "58499", "58500"), view === v)) ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white disabled:opacity-50'}`}>
                  {stryMutAct_9fa48("58505") ? v === 'templates' || <Target className="w-4 h-4 inline mr-2" /> : stryMutAct_9fa48("58504") ? false : stryMutAct_9fa48("58503") ? true : (stryCov_9fa48("58503", "58504", "58505"), (stryMutAct_9fa48("58507") ? v !== 'templates' : stryMutAct_9fa48("58506") ? true : (stryCov_9fa48("58506", "58507"), v === 'templates')) && <Target className="w-4 h-4 inline mr-2" />)}
                  {stryMutAct_9fa48("58511") ? v === 'history' || <Clock className="w-4 h-4 inline mr-2" /> : stryMutAct_9fa48("58510") ? false : stryMutAct_9fa48("58509") ? true : (stryCov_9fa48("58509", "58510", "58511"), (stryMutAct_9fa48("58513") ? v !== 'history' : stryMutAct_9fa48("58512") ? true : (stryCov_9fa48("58512", "58513"), v === 'history')) && <Clock className="w-4 h-4 inline mr-2" />)}
                  {stryMutAct_9fa48("58517") ? v === 'results' || <BarChart3 className="w-4 h-4 inline mr-2" /> : stryMutAct_9fa48("58516") ? false : stryMutAct_9fa48("58515") ? true : (stryCov_9fa48("58515", "58516", "58517"), (stryMutAct_9fa48("58519") ? v !== 'results' : stryMutAct_9fa48("58518") ? true : (stryCov_9fa48("58518", "58519"), v === 'results')) && <BarChart3 className="w-4 h-4 inline mr-2" />)}
                  {stryMutAct_9fa48("58521") ? v.charAt(0).toUpperCase() - v.slice(1) : (stryCov_9fa48("58521"), (stryMutAct_9fa48("58523") ? v.toUpperCase() : stryMutAct_9fa48("58522") ? v.charAt(0).toLowerCase() : (stryCov_9fa48("58522", "58523"), v.charAt(0).toUpperCase())) + (stryMutAct_9fa48("58524") ? v : (stryCov_9fa48("58524"), v.slice(1))))}
                </button>))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Appetite & Assumptions Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Risk Appetite Slider */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Risk Appetite:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-400">Conservative</span>
                <input type="range" min="1" max="3" value={riskAppetite} onChange={stryMutAct_9fa48("58525") ? () => undefined : (stryCov_9fa48("58525"), e => setRiskAppetite(parseInt(e.target.value)))} className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                <span className="text-xs text-red-400">Aggressive</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${(stryMutAct_9fa48("58529") ? riskAppetite !== 1 : stryMutAct_9fa48("58528") ? false : stryMutAct_9fa48("58527") ? true : (stryCov_9fa48("58527", "58528", "58529"), riskAppetite === 1)) ? 'bg-blue-500/20 text-blue-300' : (stryMutAct_9fa48("58533") ? riskAppetite !== 2 : stryMutAct_9fa48("58532") ? false : stryMutAct_9fa48("58531") ? true : (stryCov_9fa48("58531", "58532", "58533"), riskAppetite === 2)) ? 'bg-purple-500/20 text-purple-300' : 'bg-red-500/20 text-red-300'}`}>
                {riskAppetiteLabels[stryMutAct_9fa48("58536") ? riskAppetite + 1 : (stryCov_9fa48("58536"), riskAppetite - 1)]}
              </span>
              <span className="text-xs text-gray-500 max-w-xs">
                {riskAppetiteDescriptions[riskAppetite as keyof typeof riskAppetiteDescriptions]}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button onClick={stryMutAct_9fa48("58537") ? () => undefined : (stryCov_9fa48("58537"), () => setShowAssumptions(stryMutAct_9fa48("58538") ? false : (stryCov_9fa48("58538"), true)))} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                <Settings className="w-3 h-3" /> Assumptions
              </button>
              <button onClick={stryMutAct_9fa48("58539") ? () => undefined : (stryCov_9fa48("58539"), () => setShowOutputArtifacts(stryMutAct_9fa48("58540") ? false : (stryCov_9fa48("58540"), true)))} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                <FileDown className="w-3 h-3" /> Output Artifacts
              </button>
              <button onClick={stryMutAct_9fa48("58541") ? () => undefined : (stryCov_9fa48("58541"), () => setShowHistorySidebar(stryMutAct_9fa48("58542") ? false : (stryCov_9fa48("58542"), true)))} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                <Clock className="w-3 h-3" /> History
              </button>
              
              {/* Schedule Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                <span className="text-xs text-gray-400">Nightly</span>
                <button onClick={stryMutAct_9fa48("58543") ? () => undefined : (stryCov_9fa48("58543"), () => setScheduleNightly(stryMutAct_9fa48("58544") ? scheduleNightly : (stryCov_9fa48("58544"), !scheduleNightly)))} className={`relative w-10 h-5 rounded-full transition-colors ${scheduleNightly ? 'bg-purple-600' : 'bg-slate-600'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${scheduleNightly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Last Simulation Status */}
          <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {(stryMutAct_9fa48("58554") ? recentSimulations.length <= 0 : stryMutAct_9fa48("58553") ? recentSimulations.length >= 0 : stryMutAct_9fa48("58552") ? false : stryMutAct_9fa48("58551") ? true : (stryCov_9fa48("58551", "58552", "58553", "58554"), recentSimulations.length > 0)) ? <>Last simulation: <span className="text-purple-400">{stryMutAct_9fa48("58555") ? recentSimulations[0].name : (stryCov_9fa48("58555"), recentSimulations[0]?.name)}</span> ({new Date(stryMutAct_9fa48("58556") ? recentSimulations[0].createdAt : (stryCov_9fa48("58556"), recentSimulations[0]?.createdAt)).toLocaleDateString()})</> : <span className="text-amber-400">No simulation run yet — run your first stress test to establish baseline</span>}
            </span>
            <div className="flex items-center gap-4">
              {stryMutAct_9fa48("58559") ? scheduleNightly || <span className="text-purple-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Scheduled nightly at 2:00 AM
                </span> : stryMutAct_9fa48("58558") ? false : stryMutAct_9fa48("58557") ? true : (stryCov_9fa48("58557", "58558", "58559"), scheduleNightly && <span className="text-purple-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Scheduled nightly at 2:00 AM
                </span>)}
              <span className="text-gray-500">
                Baseline: {stryMutAct_9fa48("58562") ? resilienceData?.overall && '--' : stryMutAct_9fa48("58561") ? false : stryMutAct_9fa48("58560") ? true : (stryCov_9fa48("58560", "58561", "58562"), (stryMutAct_9fa48("58563") ? resilienceData.overall : (stryCov_9fa48("58563"), resilienceData?.overall)) || '--')}/100 resilience
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-purple-300">Initializing Crucible Engine...</p>
            </div>
          </div> : (stryMutAct_9fa48("58567") ? view !== 'templates' : stryMutAct_9fa48("58566") ? false : stryMutAct_9fa48("58565") ? true : (stryCov_9fa48("58565", "58566", "58567"), view === 'templates')) ? <div>
            {/* Top Row: Resilience Radar + Benchmarks + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Resilience Radar - Real Data */}
              <div className="lg:col-span-2">
                {resilienceData ? <ResilienceRadar scores={resilienceData.dimensions.map(stryMutAct_9fa48("58569") ? () => undefined : (stryCov_9fa48("58569"), d => stryMutAct_9fa48("58570") ? {} : (stryCov_9fa48("58570"), {
              dimension: d.dimension,
              score: d.score,
              icon: stryMutAct_9fa48("58573") ? scenarioIcons[d.dimension === 'Financial' ? 'FINANCIAL_STRESS' : d.dimension === 'Talent' ? 'TALENT_EXODUS' : d.dimension === 'Operational' ? 'OPERATIONAL_SHOCK' : d.dimension === 'Cyber' ? 'CYBER_ATTACK' : d.dimension === 'Market' ? 'MARKET_DISRUPTION' : d.dimension === 'Supply Chain' ? 'SUPPLY_CHAIN' : 'REGULATORY_CHANGE'] && <Target className="w-4 h-4" /> : stryMutAct_9fa48("58572") ? false : stryMutAct_9fa48("58571") ? true : (stryCov_9fa48("58571", "58572", "58573"), scenarioIcons[(stryMutAct_9fa48("58576") ? d.dimension !== 'Financial' : stryMutAct_9fa48("58575") ? false : stryMutAct_9fa48("58574") ? true : (stryCov_9fa48("58574", "58575", "58576"), d.dimension === 'Financial')) ? 'FINANCIAL_STRESS' : (stryMutAct_9fa48("58581") ? d.dimension !== 'Talent' : stryMutAct_9fa48("58580") ? false : stryMutAct_9fa48("58579") ? true : (stryCov_9fa48("58579", "58580", "58581"), d.dimension === 'Talent')) ? 'TALENT_EXODUS' : (stryMutAct_9fa48("58586") ? d.dimension !== 'Operational' : stryMutAct_9fa48("58585") ? false : stryMutAct_9fa48("58584") ? true : (stryCov_9fa48("58584", "58585", "58586"), d.dimension === 'Operational')) ? 'OPERATIONAL_SHOCK' : (stryMutAct_9fa48("58591") ? d.dimension !== 'Cyber' : stryMutAct_9fa48("58590") ? false : stryMutAct_9fa48("58589") ? true : (stryCov_9fa48("58589", "58590", "58591"), d.dimension === 'Cyber')) ? 'CYBER_ATTACK' : (stryMutAct_9fa48("58596") ? d.dimension !== 'Market' : stryMutAct_9fa48("58595") ? false : stryMutAct_9fa48("58594") ? true : (stryCov_9fa48("58594", "58595", "58596"), d.dimension === 'Market')) ? 'MARKET_DISRUPTION' : (stryMutAct_9fa48("58601") ? d.dimension !== 'Supply Chain' : stryMutAct_9fa48("58600") ? false : stryMutAct_9fa48("58599") ? true : (stryCov_9fa48("58599", "58600", "58601"), d.dimension === 'Supply Chain')) ? 'SUPPLY_CHAIN' : 'REGULATORY_CHANGE'] || <Target className="w-4 h-4" />)
            })))} overallScore={resilienceData.overall} weakest={resilienceData.weakest} strongest={resilienceData.strongest} onRunSimulation={dimension => {
              const dimensionToScenario: Record<string, string> = stryMutAct_9fa48("58606") ? {} : (stryCov_9fa48("58606"), {
                'Financial': 'FINANCIAL_STRESS',
                'Talent': 'TALENT_EXODUS',
                'Operational': 'OPERATIONAL_SHOCK',
                'Cyber': 'CYBER_ATTACK',
                'Market': 'MARKET_DISRUPTION',
                'Supply Chain': 'SUPPLY_CHAIN',
                'Regulatory': 'REGULATORY_CHANGE'
              });
              setSelectedTemplate(stryMutAct_9fa48("58616") ? dimensionToScenario[dimension] && 'CUSTOM' : stryMutAct_9fa48("58615") ? false : stryMutAct_9fa48("58614") ? true : (stryCov_9fa48("58614", "58615", "58616"), dimensionToScenario[dimension] || 'CUSTOM'));
            }} /> : <div className="p-6 bg-slate-900/80 border border-purple-500/30 rounded-xl h-full flex items-center justify-center">
                    <p className="text-gray-400">Loading resilience data...</p>
                  </div>}
              </div>

              {/* Industry Benchmark + Recommendations Column */}
              <div className="space-y-6">
                {/* Industry Benchmark Comparison */}
                {stryMutAct_9fa48("58620") ? benchmarkData || <div className="p-5 bg-slate-900/80 border border-blue-500/30 rounded-xl">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-400" />
                      {benchmarkData.industry} Benchmark
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white">{benchmarkData.overallComparison.yourScore}</div>
                        <div className="text-xs text-gray-400">Your Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-400">{benchmarkData.overallComparison.percentile}th</div>
                        <div className="text-xs text-gray-400">Percentile</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-gray-400">{benchmarkData.overallComparison.industryAvg}</div>
                        <div className="text-xs text-gray-400">Industry Avg</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {benchmarkData.benchmarks.slice(0, 4).map(b => <div key={b.dimension} className="flex items-center gap-2">
                          <div className="w-16 text-[10px] text-gray-400 truncate">{b.dimension}</div>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                            <div className="absolute h-full bg-gray-600 rounded-full" style={{
                      width: `${b.industryAvg}%`
                    }} />
                            <div className={`absolute h-full rounded-full ${b.yourScore >= b.industryAvg ? 'bg-green-500' : 'bg-orange-500'}`} style={{
                      width: `${b.yourScore}%`
                    }} />
                          </div>
                          <div className={`w-6 text-[10px] font-medium text-right ${b.yourScore >= b.industryAvg ? 'text-green-400' : 'text-orange-400'}`}>
                            {b.yourScore}
                          </div>
                        </div>)}
                    </div>
                  </div> : stryMutAct_9fa48("58619") ? false : stryMutAct_9fa48("58618") ? true : (stryCov_9fa48("58618", "58619", "58620"), benchmarkData && <div className="p-5 bg-slate-900/80 border border-blue-500/30 rounded-xl">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-400" />
                      {benchmarkData.industry} Benchmark
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white">{benchmarkData.overallComparison.yourScore}</div>
                        <div className="text-xs text-gray-400">Your Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-400">{benchmarkData.overallComparison.percentile}th</div>
                        <div className="text-xs text-gray-400">Percentile</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-gray-400">{benchmarkData.overallComparison.industryAvg}</div>
                        <div className="text-xs text-gray-400">Industry Avg</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {stryMutAct_9fa48("58621") ? benchmarkData.benchmarks.map(b => <div key={b.dimension} className="flex items-center gap-2">
                          <div className="w-16 text-[10px] text-gray-400 truncate">{b.dimension}</div>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                            <div className="absolute h-full bg-gray-600 rounded-full" style={{
                      width: `${b.industryAvg}%`
                    }} />
                            <div className={`absolute h-full rounded-full ${b.yourScore >= b.industryAvg ? 'bg-green-500' : 'bg-orange-500'}`} style={{
                      width: `${b.yourScore}%`
                    }} />
                          </div>
                          <div className={`w-6 text-[10px] font-medium text-right ${b.yourScore >= b.industryAvg ? 'text-green-400' : 'text-orange-400'}`}>
                            {b.yourScore}
                          </div>
                        </div>) : (stryCov_9fa48("58621"), benchmarkData.benchmarks.slice(0, 4).map(stryMutAct_9fa48("58622") ? () => undefined : (stryCov_9fa48("58622"), b => <div key={b.dimension} className="flex items-center gap-2">
                          <div className="w-16 text-[10px] text-gray-400 truncate">{b.dimension}</div>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                            <div className="absolute h-full bg-gray-600 rounded-full" style={stryMutAct_9fa48("58623") ? {} : (stryCov_9fa48("58623"), {
                      width: `${b.industryAvg}%`
                    })} />
                            <div className={`absolute h-full rounded-full ${(stryMutAct_9fa48("58629") ? b.yourScore < b.industryAvg : stryMutAct_9fa48("58628") ? b.yourScore > b.industryAvg : stryMutAct_9fa48("58627") ? false : stryMutAct_9fa48("58626") ? true : (stryCov_9fa48("58626", "58627", "58628", "58629"), b.yourScore >= b.industryAvg)) ? 'bg-green-500' : 'bg-orange-500'}`} style={stryMutAct_9fa48("58632") ? {} : (stryCov_9fa48("58632"), {
                      width: `${b.yourScore}%`
                    })} />
                          </div>
                          <div className={`w-6 text-[10px] font-medium text-right ${(stryMutAct_9fa48("58638") ? b.yourScore < b.industryAvg : stryMutAct_9fa48("58637") ? b.yourScore > b.industryAvg : stryMutAct_9fa48("58636") ? false : stryMutAct_9fa48("58635") ? true : (stryCov_9fa48("58635", "58636", "58637", "58638"), b.yourScore >= b.industryAvg)) ? 'text-green-400' : 'text-orange-400'}`}>
                            {b.yourScore}
                          </div>
                        </div>)))}
                    </div>
                  </div>)}

                {/* Scenario Recommendations */}
                {stryMutAct_9fa48("58643") ? recommendations.length > 0 || <div className="p-5 bg-slate-900/80 border border-orange-500/30 rounded-xl">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Recommended Scenarios
                    </h3>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, i) => <button key={i} onClick={() => setSelectedTemplate(rec.scenarioType)} className={`w-full p-3 rounded-lg text-left transition-colors ${rec.priority === 'critical' ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20' : rec.priority === 'high' ? 'bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">
                              {rec.scenarioType.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${rec.priority === 'critical' ? 'bg-red-500/20 text-red-300' : rec.priority === 'high' ? 'bg-orange-500/20 text-orange-300' : 'bg-gray-500/20 text-gray-300'}`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">{rec.reason}</p>
                        </button>)}
                    </div>
                  </div> : stryMutAct_9fa48("58642") ? false : stryMutAct_9fa48("58641") ? true : (stryCov_9fa48("58641", "58642", "58643"), (stryMutAct_9fa48("58646") ? recommendations.length <= 0 : stryMutAct_9fa48("58645") ? recommendations.length >= 0 : stryMutAct_9fa48("58644") ? true : (stryCov_9fa48("58644", "58645", "58646"), recommendations.length > 0)) && <div className="p-5 bg-slate-900/80 border border-orange-500/30 rounded-xl">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Recommended Scenarios
                    </h3>
                    <div className="space-y-2">
                      {stryMutAct_9fa48("58647") ? recommendations.map((rec, i) => <button key={i} onClick={() => setSelectedTemplate(rec.scenarioType)} className={`w-full p-3 rounded-lg text-left transition-colors ${rec.priority === 'critical' ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20' : rec.priority === 'high' ? 'bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">
                              {rec.scenarioType.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${rec.priority === 'critical' ? 'bg-red-500/20 text-red-300' : rec.priority === 'high' ? 'bg-orange-500/20 text-orange-300' : 'bg-gray-500/20 text-gray-300'}`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">{rec.reason}</p>
                        </button>) : (stryCov_9fa48("58647"), recommendations.slice(0, 3).map(stryMutAct_9fa48("58648") ? () => undefined : (stryCov_9fa48("58648"), (rec, i) => <button key={i} onClick={stryMutAct_9fa48("58649") ? () => undefined : (stryCov_9fa48("58649"), () => setSelectedTemplate(rec.scenarioType))} className={`w-full p-3 rounded-lg text-left transition-colors ${(stryMutAct_9fa48("58653") ? rec.priority !== 'critical' : stryMutAct_9fa48("58652") ? false : stryMutAct_9fa48("58651") ? true : (stryCov_9fa48("58651", "58652", "58653"), rec.priority === 'critical')) ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20' : (stryMutAct_9fa48("58658") ? rec.priority !== 'high' : stryMutAct_9fa48("58657") ? false : stryMutAct_9fa48("58656") ? true : (stryCov_9fa48("58656", "58657", "58658"), rec.priority === 'high')) ? 'bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">
                              {rec.scenarioType.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${(stryMutAct_9fa48("58666") ? rec.priority !== 'critical' : stryMutAct_9fa48("58665") ? false : stryMutAct_9fa48("58664") ? true : (stryCov_9fa48("58664", "58665", "58666"), rec.priority === 'critical')) ? 'bg-red-500/20 text-red-300' : (stryMutAct_9fa48("58671") ? rec.priority !== 'high' : stryMutAct_9fa48("58670") ? false : stryMutAct_9fa48("58669") ? true : (stryCov_9fa48("58669", "58670", "58671"), rec.priority === 'high')) ? 'bg-orange-500/20 text-orange-300' : 'bg-gray-500/20 text-gray-300'}`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1">{rec.reason}</p>
                        </button>)))}
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Recent Simulations Summary */}
            {stryMutAct_9fa48("58677") ? recentSimulations.length > 0 || <div className="mb-8 p-5 bg-slate-900/80 border border-slate-700 rounded-xl">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Simulations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {recentSimulations.slice(0, 5).map(sim => <button key={sim.id} onClick={() => loadSimulationDetails(sim.id)} className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${sim.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : sim.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {sim.status}
                        </span>
                        {sim.resilienceScore && <span className="text-xs font-bold text-purple-400">{sim.resilienceScore}%</span>}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{sim.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                        <span>{new Date(sim.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{sim.createdBy}</span>
                      </div>
                    </button>)}
                </div>
              </div> : stryMutAct_9fa48("58676") ? false : stryMutAct_9fa48("58675") ? true : (stryCov_9fa48("58675", "58676", "58677"), (stryMutAct_9fa48("58680") ? recentSimulations.length <= 0 : stryMutAct_9fa48("58679") ? recentSimulations.length >= 0 : stryMutAct_9fa48("58678") ? true : (stryCov_9fa48("58678", "58679", "58680"), recentSimulations.length > 0)) && <div className="mb-8 p-5 bg-slate-900/80 border border-slate-700 rounded-xl">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Simulations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {stryMutAct_9fa48("58681") ? recentSimulations.map(sim => <button key={sim.id} onClick={() => loadSimulationDetails(sim.id)} className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${sim.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : sim.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {sim.status}
                        </span>
                        {sim.resilienceScore && <span className="text-xs font-bold text-purple-400">{sim.resilienceScore}%</span>}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{sim.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                        <span>{new Date(sim.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{sim.createdBy}</span>
                      </div>
                    </button>) : (stryCov_9fa48("58681"), recentSimulations.slice(0, 5).map(stryMutAct_9fa48("58682") ? () => undefined : (stryCov_9fa48("58682"), sim => <button key={sim.id} onClick={stryMutAct_9fa48("58683") ? () => undefined : (stryCov_9fa48("58683"), () => loadSimulationDetails(sim.id))} className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-left transition-colors border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${(stryMutAct_9fa48("58687") ? sim.status !== 'COMPLETED' : stryMutAct_9fa48("58686") ? false : stryMutAct_9fa48("58685") ? true : (stryCov_9fa48("58685", "58686", "58687"), sim.status === 'COMPLETED')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("58692") ? sim.status !== 'RUNNING' : stryMutAct_9fa48("58691") ? false : stryMutAct_9fa48("58690") ? true : (stryCov_9fa48("58690", "58691", "58692"), sim.status === 'RUNNING')) ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {sim.status}
                        </span>
                        {stryMutAct_9fa48("58698") ? sim.resilienceScore || <span className="text-xs font-bold text-purple-400">{sim.resilienceScore}%</span> : stryMutAct_9fa48("58697") ? false : stryMutAct_9fa48("58696") ? true : (stryCov_9fa48("58696", "58697", "58698"), sim.resilienceScore && <span className="text-xs font-bold text-purple-400">{sim.resilienceScore}%</span>)}
                      </div>
                      <p className="text-white text-sm font-medium truncate">{sim.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                        <span>{new Date(sim.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{sim.createdBy}</span>
                      </div>
                    </button>)))}
                </div>
              </div>)}
            
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Simulation Scenarios</h2>
                <p className="text-gray-400">Select a scenario to stress test your organization's resilience</p>
              </div>
              <button onClick={stryMutAct_9fa48("58699") ? () => undefined : (stryCov_9fa48("58699"), () => setShowScenarioCustomizer(stryMutAct_9fa48("58700") ? false : (stryCov_9fa48("58700"), true)))} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" /> Build Custom Scenario
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => {
            const severity = stryMutAct_9fa48("58704") ? scenarioSeverity[template.type] && 'MODERATE' : stryMutAct_9fa48("58703") ? false : stryMutAct_9fa48("58702") ? true : (stryCov_9fa48("58702", "58703", "58704"), scenarioSeverity[template.type] || 'MODERATE');
            const colors = severityColors[severity];
            const lastRun = simulations.find(stryMutAct_9fa48("58706") ? () => undefined : (stryCov_9fa48("58706"), s => stryMutAct_9fa48("58709") ? s.simulation_type !== template.type : stryMutAct_9fa48("58708") ? false : stryMutAct_9fa48("58707") ? true : (stryCov_9fa48("58707", "58708", "58709"), s.simulation_type === template.type)));
            const examples = stryMutAct_9fa48("58712") ? shockExamples[template.type] && [] : stryMutAct_9fa48("58711") ? false : stryMutAct_9fa48("58710") ? true : (stryCov_9fa48("58710", "58711", "58712"), shockExamples[template.type] || (stryMutAct_9fa48("58713") ? ["Stryker was here"] : (stryCov_9fa48("58713"), [])));
            return <div key={template.type} className={`relative rounded-xl border transition-all overflow-hidden ${(stryMutAct_9fa48("58717") ? selectedTemplate !== template.type : stryMutAct_9fa48("58716") ? false : stryMutAct_9fa48("58715") ? true : (stryCov_9fa48("58715", "58716", "58717"), selectedTemplate === template.type)) ? `${colors.bg} ${colors.border} ring-2 ring-purple-500/50` : `bg-slate-900/80 ${colors.border} hover:border-purple-500/50`}`}>
                    {/* Severity Indicator */}
                    <div className={`absolute top-0 right-0 w-3 h-3 rounded-bl-lg ${colors.indicator}`} />
                    
                    <div className="p-5">
                      {/* Header with icon and severity badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.text}`}>
                          {stryMutAct_9fa48("58724") ? scenarioIcons[template.type] && <Target className="w-5 h-5" /> : stryMutAct_9fa48("58723") ? false : stryMutAct_9fa48("58722") ? true : (stryCov_9fa48("58722", "58723", "58724"), scenarioIcons[template.type] || <Target className="w-5 h-5" />)}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.badge}`}>
                          {severity}
                        </span>
                      </div>
                      
                      {/* Title and description */}
                      <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{template.description}</p>
                      
                      {/* Shock examples */}
                      <div className="mb-3 space-y-1">
                        {stryMutAct_9fa48("58726") ? examples.map((ex, i) => <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.indicator}`} />
                            {ex}
                          </div>) : (stryCov_9fa48("58726"), examples.slice(0, 2).map(stryMutAct_9fa48("58727") ? () => undefined : (stryCov_9fa48("58727"), (ex, i) => <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.indicator}`} />
                            {ex}
                          </div>)))}
                      </div>
                      
                      {/* Stats row */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {template.shockCount} shocks
                        </span>
                        {stryMutAct_9fa48("58731") ? lastRun || <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last: {new Date(lastRun.created_at).toLocaleDateString()}
                          </span> : stryMutAct_9fa48("58730") ? false : stryMutAct_9fa48("58729") ? true : (stryCov_9fa48("58729", "58730", "58731"), lastRun && <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Last: {new Date(lastRun.created_at).toLocaleDateString()}
                          </span>)}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 px-5 pb-5 pt-2 border-t border-slate-700/50">
                      <button onClick={e => {
                  e.stopPropagation();
                  setShowDetailModal(template.type);
                }} className="flex-1 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview Scenario
                      </button>
                    <button onClick={e => {
                  e.stopPropagation();
                  setSelectedTemplate(template.type);
                }} className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${(stryMutAct_9fa48("58737") ? selectedTemplate !== template.type : stryMutAct_9fa48("58736") ? false : stryMutAct_9fa48("58735") ? true : (stryCov_9fa48("58735", "58736", "58737"), selectedTemplate === template.type)) ? 'bg-purple-600 text-white' : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300'}`}>
                      <Target className="w-4 h-4" />
                      {(stryMutAct_9fa48("58742") ? selectedTemplate !== template.type : stryMutAct_9fa48("58741") ? false : stryMutAct_9fa48("58740") ? true : (stryCov_9fa48("58740", "58741", "58742"), selectedTemplate === template.type)) ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>;
          })}
            </div>

            {stryMutAct_9fa48("58747") ? selectedTemplate || <div className="mt-8 flex justify-center">
                <button onClick={() => runSimulation(selectedTemplate)} disabled={isRunning} className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-500/30 flex items-center gap-3 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isRunning ? <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running Multiverse Simulation...
                    </> : <>
                      <Play className="w-5 h-5" />
                      Launch Simulation
                      <Sparkles className="w-5 h-5" />
                    </>}
                </button>
              </div> : stryMutAct_9fa48("58746") ? false : stryMutAct_9fa48("58745") ? true : (stryCov_9fa48("58745", "58746", "58747"), selectedTemplate && <div className="mt-8 flex justify-center">
                <button onClick={stryMutAct_9fa48("58748") ? () => undefined : (stryCov_9fa48("58748"), () => runSimulation(selectedTemplate))} disabled={isRunning} className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-500/30 flex items-center gap-3 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {isRunning ? <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running Multiverse Simulation...
                    </> : <>
                      <Play className="w-5 h-5" />
                      Launch Simulation
                      <Sparkles className="w-5 h-5" />
                    </>}
                </button>
              </div>)}
          </div> : (stryMutAct_9fa48("58754") ? view !== 'history' : stryMutAct_9fa48("58753") ? false : stryMutAct_9fa48("58752") ? true : (stryCov_9fa48("58752", "58753", "58754"), view === 'history')) ? <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Simulation History</h2>
              <p className="text-gray-400">View past simulations and their results</p>
            </div>

            {(stryMutAct_9fa48("58758") ? simulations.length !== 0 : stryMutAct_9fa48("58757") ? false : stryMutAct_9fa48("58756") ? true : (stryCov_9fa48("58756", "58757", "58758"), simulations.length === 0)) ? <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <Flame className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">No simulations yet</p>
                <button onClick={stryMutAct_9fa48("58759") ? () => undefined : (stryCov_9fa48("58759"), () => setView('templates'))} className="mt-4 text-purple-400 hover:text-purple-300">
                  Create your first simulation →
                </button>
              </div> : <div className="space-y-4">
                {simulations.map(stryMutAct_9fa48("58761") ? () => undefined : (stryCov_9fa48("58761"), sim => <div key={sim.id} onClick={stryMutAct_9fa48("58762") ? () => undefined : (stryCov_9fa48("58762"), () => loadSimulationDetails(sim.id))} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.01]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                          {stryMutAct_9fa48("58765") ? scenarioIcons[sim.simulation_type] && <Target className="w-5 h-5" /> : stryMutAct_9fa48("58764") ? false : stryMutAct_9fa48("58763") ? true : (stryCov_9fa48("58763", "58764", "58765"), scenarioIcons[sim.simulation_type] || <Target className="w-5 h-5" />)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{sim.name}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(sim.created_at).toLocaleDateString()} • {sim.simulation_type.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${(stryMutAct_9fa48("58770") ? sim.status !== 'COMPLETED' : stryMutAct_9fa48("58769") ? false : stryMutAct_9fa48("58768") ? true : (stryCov_9fa48("58768", "58769", "58770"), sim.status === 'COMPLETED')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("58775") ? sim.status !== 'RUNNING' : stryMutAct_9fa48("58774") ? false : stryMutAct_9fa48("58773") ? true : (stryCov_9fa48("58773", "58774", "58775"), sim.status === 'RUNNING')) ? 'bg-blue-500/20 text-blue-400' : (stryMutAct_9fa48("58780") ? sim.status !== 'FAILED' : stryMutAct_9fa48("58779") ? false : stryMutAct_9fa48("58778") ? true : (stryCov_9fa48("58778", "58779", "58780"), sim.status === 'FAILED')) ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {sim.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>))}
              </div>}
          </div> : (stryMutAct_9fa48("58786") ? view === 'results' || activeSimulation : stryMutAct_9fa48("58785") ? false : stryMutAct_9fa48("58784") ? true : (stryCov_9fa48("58784", "58785", "58786"), (stryMutAct_9fa48("58788") ? view !== 'results' : stryMutAct_9fa48("58787") ? true : (stryCov_9fa48("58787", "58788"), view === 'results')) && activeSimulation)) ? <div>
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">{activeSimulation.name}</h2>
                <p className="text-gray-400">
                  {activeSimulation.simulation_type.replace(/_/g, ' ')} • {stryMutAct_9fa48("58793") ? activeSimulation.universes?.length && 0 : stryMutAct_9fa48("58792") ? false : stryMutAct_9fa48("58791") ? true : (stryCov_9fa48("58791", "58792", "58793"), (stryMutAct_9fa48("58794") ? activeSimulation.universes.length : (stryCov_9fa48("58794"), activeSimulation.universes?.length)) || 0)} parallel universes
                </p>
              </div>
              {stryMutAct_9fa48("58797") ? activeSimulation.status === 'COMPLETED' || <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" /> Completed
                </span> : stryMutAct_9fa48("58796") ? false : stryMutAct_9fa48("58795") ? true : (stryCov_9fa48("58795", "58796", "58797"), (stryMutAct_9fa48("58799") ? activeSimulation.status !== 'COMPLETED' : stryMutAct_9fa48("58798") ? true : (stryCov_9fa48("58798", "58799"), activeSimulation.status === 'COMPLETED')) && <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" /> Completed
                </span>)}
            </div>

            {/* Enhanced Results Panel - Key metrics, break points, recommendations */}
            {stryMutAct_9fa48("58803") ? activeSimulation.results_summary || <div className="mb-8">
                <EnhancedResultsPanel simulation={activeSimulation} onExport={() => console.log('Export report')} onShare={() => console.log('Share with board')} onRerun={() => runSimulation(activeSimulation.simulation_type)} />
              </div> : stryMutAct_9fa48("58802") ? false : stryMutAct_9fa48("58801") ? true : (stryCov_9fa48("58801", "58802", "58803"), activeSimulation.results_summary && <div className="mb-8">
                <EnhancedResultsPanel simulation={activeSimulation} onExport={stryMutAct_9fa48("58804") ? () => undefined : (stryCov_9fa48("58804"), () => console.log('Export report'))} onShare={stryMutAct_9fa48("58806") ? () => undefined : (stryCov_9fa48("58806"), () => console.log('Share with board'))} onRerun={stryMutAct_9fa48("58808") ? () => undefined : (stryCov_9fa48("58808"), () => runSimulation(activeSimulation.simulation_type))} />
              </div>)}

            {/* Summary Cards */}
            {stryMutAct_9fa48("58811") ? activeSimulation.results_summary || <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Best Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.bestCase.probability * 100).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.bestCase.summary}</p>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Most Likely</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.mostLikely.probability * 100).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.mostLikely.summary}</p>
                </div>

                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 mb-3">
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-medium">Worst Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.worstCase.probability * 100).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.worstCase.summary}</p>
                </div>
              </div> : stryMutAct_9fa48("58810") ? false : stryMutAct_9fa48("58809") ? true : (stryCov_9fa48("58809", "58810", "58811"), activeSimulation.results_summary && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Best Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(stryMutAct_9fa48("58812") ? activeSimulation.results_summary.bestCase.probability / 100 : (stryCov_9fa48("58812"), activeSimulation.results_summary.bestCase.probability * 100)).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.bestCase.summary}</p>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Most Likely</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(stryMutAct_9fa48("58813") ? activeSimulation.results_summary.mostLikely.probability / 100 : (stryCov_9fa48("58813"), activeSimulation.results_summary.mostLikely.probability * 100)).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.mostLikely.summary}</p>
                </div>

                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 mb-3">
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-medium">Worst Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(stryMutAct_9fa48("58814") ? activeSimulation.results_summary.worstCase.probability / 100 : (stryCov_9fa48("58814"), activeSimulation.results_summary.worstCase.probability * 100)).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.worstCase.summary}</p>
                </div>
              </div>)}

            {/* Key Risks & Opportunities */}
            {stryMutAct_9fa48("58817") ? activeSimulation.results_summary || <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Key Risks
                  </h3>
                  <ul className="space-y-2">
                    {activeSimulation.results_summary.keyRisks?.length > 0 ? activeSimulation.results_summary.keyRisks.map((risk, i) => <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>) : <li className="text-gray-400 text-sm italic">
                        Risk analysis pending. Run simulation with AI Council enabled for comprehensive risk identification.
                      </li>}
                  </ul>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {activeSimulation.results_summary.keyOpportunities?.length > 0 ? activeSimulation.results_summary.keyOpportunities.map((opp, i) => <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {opp}
                        </li>) : <li className="text-gray-400 text-sm italic">
                        Opportunity analysis pending. Run simulation with AI Council enabled for strategic opportunity identification.
                      </li>}
                  </ul>
                </div>
              </div> : stryMutAct_9fa48("58816") ? false : stryMutAct_9fa48("58815") ? true : (stryCov_9fa48("58815", "58816", "58817"), activeSimulation.results_summary && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Key Risks
                  </h3>
                  <ul className="space-y-2">
                    {(stryMutAct_9fa48("58821") ? activeSimulation.results_summary.keyRisks?.length <= 0 : stryMutAct_9fa48("58820") ? activeSimulation.results_summary.keyRisks?.length >= 0 : stryMutAct_9fa48("58819") ? false : stryMutAct_9fa48("58818") ? true : (stryCov_9fa48("58818", "58819", "58820", "58821"), (stryMutAct_9fa48("58822") ? activeSimulation.results_summary.keyRisks.length : (stryCov_9fa48("58822"), activeSimulation.results_summary.keyRisks?.length)) > 0)) ? activeSimulation.results_summary.keyRisks.map(stryMutAct_9fa48("58823") ? () => undefined : (stryCov_9fa48("58823"), (risk, i) => <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>)) : <li className="text-gray-400 text-sm italic">
                        Risk analysis pending. Run simulation with AI Council enabled for comprehensive risk identification.
                      </li>}
                  </ul>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {(stryMutAct_9fa48("58827") ? activeSimulation.results_summary.keyOpportunities?.length <= 0 : stryMutAct_9fa48("58826") ? activeSimulation.results_summary.keyOpportunities?.length >= 0 : stryMutAct_9fa48("58825") ? false : stryMutAct_9fa48("58824") ? true : (stryCov_9fa48("58824", "58825", "58826", "58827"), (stryMutAct_9fa48("58828") ? activeSimulation.results_summary.keyOpportunities.length : (stryCov_9fa48("58828"), activeSimulation.results_summary.keyOpportunities?.length)) > 0)) ? activeSimulation.results_summary.keyOpportunities.map(stryMutAct_9fa48("58829") ? () => undefined : (stryCov_9fa48("58829"), (opp, i) => <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {opp}
                        </li>)) : <li className="text-gray-400 text-sm italic">
                        Opportunity analysis pending. Run simulation with AI Council enabled for strategic opportunity identification.
                      </li>}
                  </ul>
                </div>
              </div>)}

            {/* Council Deliberation */}
            {stryMutAct_9fa48("58832") ? activeSimulation.council_deliberations && activeSimulation.council_deliberations.length > 0 || <div className="mb-8">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Council AI Deliberation
                </h3>
                {activeSimulation.council_deliberations.map(delib => <div key={delib.id} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`flex items-center gap-2 ${delib.consensus_reached ? 'text-green-400' : 'text-orange-400'}`}>
                        {delib.consensus_reached ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        {delib.consensus_reached ? 'Consensus Reached' : 'Deliberation Ongoing'}
                      </span>
                      {delib.confidence_score !== undefined && <span className="text-sm text-gray-400">Confidence: {delib.confidence_score.toFixed(0)}%</span>}
                    </div>

                    {delib.final_recommendation && <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
                        <h4 className="font-medium text-purple-300 mb-2">Final Recommendation</h4>
                        <p className="text-white">{delib.final_recommendation}</p>
                      </div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {delib.agent_responses.map((agent, i) => <div key={i} className="p-4 bg-black/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {agent.agentRole.slice(0, 2)}
                            </div>
                            <span className="font-medium text-white text-sm">{agent.agentRole}</span>
                          </div>
                          <p className="text-gray-300 text-xs mb-2 line-clamp-3">{agent.analysis}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Confidence</span>
                            <span className="text-xs text-purple-400">{agent.confidenceLevel}%</span>
                          </div>
                        </div>)}
                    </div>
                  </div>)}
              </div> : stryMutAct_9fa48("58831") ? false : stryMutAct_9fa48("58830") ? true : (stryCov_9fa48("58830", "58831", "58832"), (stryMutAct_9fa48("58834") ? activeSimulation.council_deliberations || activeSimulation.council_deliberations.length > 0 : stryMutAct_9fa48("58833") ? true : (stryCov_9fa48("58833", "58834"), activeSimulation.council_deliberations && (stryMutAct_9fa48("58837") ? activeSimulation.council_deliberations.length <= 0 : stryMutAct_9fa48("58836") ? activeSimulation.council_deliberations.length >= 0 : stryMutAct_9fa48("58835") ? true : (stryCov_9fa48("58835", "58836", "58837"), activeSimulation.council_deliberations.length > 0)))) && <div className="mb-8">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Council AI Deliberation
                </h3>
                {activeSimulation.council_deliberations.map(stryMutAct_9fa48("58838") ? () => undefined : (stryCov_9fa48("58838"), delib => <div key={delib.id} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`flex items-center gap-2 ${delib.consensus_reached ? 'text-green-400' : 'text-orange-400'}`}>
                        {delib.consensus_reached ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        {delib.consensus_reached ? 'Consensus Reached' : 'Deliberation Ongoing'}
                      </span>
                      {stryMutAct_9fa48("58846") ? delib.confidence_score !== undefined || <span className="text-sm text-gray-400">Confidence: {delib.confidence_score.toFixed(0)}%</span> : stryMutAct_9fa48("58845") ? false : stryMutAct_9fa48("58844") ? true : (stryCov_9fa48("58844", "58845", "58846"), (stryMutAct_9fa48("58848") ? delib.confidence_score === undefined : stryMutAct_9fa48("58847") ? true : (stryCov_9fa48("58847", "58848"), delib.confidence_score !== undefined)) && <span className="text-sm text-gray-400">Confidence: {delib.confidence_score.toFixed(0)}%</span>)}
                    </div>

                    {stryMutAct_9fa48("58851") ? delib.final_recommendation || <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
                        <h4 className="font-medium text-purple-300 mb-2">Final Recommendation</h4>
                        <p className="text-white">{delib.final_recommendation}</p>
                      </div> : stryMutAct_9fa48("58850") ? false : stryMutAct_9fa48("58849") ? true : (stryCov_9fa48("58849", "58850", "58851"), delib.final_recommendation && <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
                        <h4 className="font-medium text-purple-300 mb-2">Final Recommendation</h4>
                        <p className="text-white">{delib.final_recommendation}</p>
                      </div>)}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {delib.agent_responses.map(stryMutAct_9fa48("58852") ? () => undefined : (stryCov_9fa48("58852"), (agent, i) => <div key={i} className="p-4 bg-black/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {stryMutAct_9fa48("58853") ? agent.agentRole : (stryCov_9fa48("58853"), agent.agentRole.slice(0, 2))}
                            </div>
                            <span className="font-medium text-white text-sm">{agent.agentRole}</span>
                          </div>
                          <p className="text-gray-300 text-xs mb-2 line-clamp-3">{agent.analysis}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Confidence</span>
                            <span className="text-xs text-purple-400">{agent.confidenceLevel}%</span>
                          </div>
                        </div>))}
                    </div>
                  </div>))}
              </div>)}

            {/* Parallel Universes */}
            {stryMutAct_9fa48("58856") ? activeSimulation.universes && activeSimulation.universes.length > 0 || <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                  Parallel Universe Outcomes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeSimulation.universes.slice(0, 8).map(universe => <div key={universe.id} className={`p-4 rounded-xl border ${universe.outcome_sentiment === 'CATASTROPHIC' ? 'bg-red-500/10 border-red-500/30 text-red-400' : universe.outcome_sentiment === 'NEGATIVE' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : universe.outcome_sentiment === 'POSITIVE' ? 'bg-green-500/10 border-green-500/30 text-green-400' : universe.outcome_sentiment === 'OPTIMAL' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Universe #{universe.universe_number}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                          {(universe.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-2">{universe.outcome_sentiment}</p>
                      {universe.outcome_summary && <p className="text-xs text-gray-300 line-clamp-2">{universe.outcome_summary}</p>}
                    </div>)}
                </div>
              </div> : stryMutAct_9fa48("58855") ? false : stryMutAct_9fa48("58854") ? true : (stryCov_9fa48("58854", "58855", "58856"), (stryMutAct_9fa48("58858") ? activeSimulation.universes || activeSimulation.universes.length > 0 : stryMutAct_9fa48("58857") ? true : (stryCov_9fa48("58857", "58858"), activeSimulation.universes && (stryMutAct_9fa48("58861") ? activeSimulation.universes.length <= 0 : stryMutAct_9fa48("58860") ? activeSimulation.universes.length >= 0 : stryMutAct_9fa48("58859") ? true : (stryCov_9fa48("58859", "58860", "58861"), activeSimulation.universes.length > 0)))) && <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                  Parallel Universe Outcomes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stryMutAct_9fa48("58862") ? activeSimulation.universes.map(universe => <div key={universe.id} className={`p-4 rounded-xl border ${universe.outcome_sentiment === 'CATASTROPHIC' ? 'bg-red-500/10 border-red-500/30 text-red-400' : universe.outcome_sentiment === 'NEGATIVE' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : universe.outcome_sentiment === 'POSITIVE' ? 'bg-green-500/10 border-green-500/30 text-green-400' : universe.outcome_sentiment === 'OPTIMAL' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Universe #{universe.universe_number}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                          {(universe.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-2">{universe.outcome_sentiment}</p>
                      {universe.outcome_summary && <p className="text-xs text-gray-300 line-clamp-2">{universe.outcome_summary}</p>}
                    </div>) : (stryCov_9fa48("58862"), activeSimulation.universes.slice(0, 8).map(stryMutAct_9fa48("58863") ? () => undefined : (stryCov_9fa48("58863"), universe => <div key={universe.id} className={`p-4 rounded-xl border ${(stryMutAct_9fa48("58867") ? universe.outcome_sentiment !== 'CATASTROPHIC' : stryMutAct_9fa48("58866") ? false : stryMutAct_9fa48("58865") ? true : (stryCov_9fa48("58865", "58866", "58867"), universe.outcome_sentiment === 'CATASTROPHIC')) ? 'bg-red-500/10 border-red-500/30 text-red-400' : (stryMutAct_9fa48("58872") ? universe.outcome_sentiment !== 'NEGATIVE' : stryMutAct_9fa48("58871") ? false : stryMutAct_9fa48("58870") ? true : (stryCov_9fa48("58870", "58871", "58872"), universe.outcome_sentiment === 'NEGATIVE')) ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : (stryMutAct_9fa48("58877") ? universe.outcome_sentiment !== 'POSITIVE' : stryMutAct_9fa48("58876") ? false : stryMutAct_9fa48("58875") ? true : (stryCov_9fa48("58875", "58876", "58877"), universe.outcome_sentiment === 'POSITIVE')) ? 'bg-green-500/10 border-green-500/30 text-green-400' : (stryMutAct_9fa48("58882") ? universe.outcome_sentiment !== 'OPTIMAL' : stryMutAct_9fa48("58881") ? false : stryMutAct_9fa48("58880") ? true : (stryCov_9fa48("58880", "58881", "58882"), universe.outcome_sentiment === 'OPTIMAL')) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Universe #{universe.universe_number}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                          {(stryMutAct_9fa48("58886") ? universe.probability / 100 : (stryCov_9fa48("58886"), universe.probability * 100)).toFixed(1)}%
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-2">{universe.outcome_sentiment}</p>
                      {stryMutAct_9fa48("58889") ? universe.outcome_summary || <p className="text-xs text-gray-300 line-clamp-2">{universe.outcome_summary}</p> : stryMutAct_9fa48("58888") ? false : stryMutAct_9fa48("58887") ? true : (stryCov_9fa48("58887", "58888", "58889"), universe.outcome_summary && <p className="text-xs text-gray-300 line-clamp-2">{universe.outcome_summary}</p>)}
                    </div>)))}
                </div>
              </div>)}
          </div> : null}
      </div>

      {/* Assumptions Modal */}
      {stryMutAct_9fa48("58892") ? showAssumptions || <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAssumptions(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Simulation Assumptions</h3>
                <p className="text-sm text-gray-400">Baseline metrics and confidence levels used in simulations</p>
              </div>
              <button onClick={() => setShowAssumptions(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Input Assumptions */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">Input Assumptions</h4>
                <div className="space-y-2">
                  {[{
                label: 'Monthly Burn Rate',
                value: '$2.4M',
                source: 'Finance system',
                confidence: 95
              }, {
                label: 'Cash Runway',
                value: '18 months',
                source: 'Treasury',
                confidence: 90
              }, {
                label: 'Revenue Growth Rate',
                value: '12% YoY',
                source: 'CRM pipeline',
                confidence: 75
              }, {
                label: 'Employee Count',
                value: '847',
                source: 'HRIS',
                confidence: 100
              }, {
                label: 'Customer Churn Rate',
                value: '3.2%',
                source: 'Subscription data',
                confidence: 85
              }].map((a, i) => <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{a.label}</div>
                        <div className="text-xs text-gray-500">Source: {a.source}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-medium">{a.value}</div>
                        <div className="text-xs text-gray-500">{a.confidence}% confidence</div>
                      </div>
                    </div>)}
                </div>
              </div>

              {/* Baseline Metrics */}
              <div>
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3">Baseline Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Overall Resilience</div>
                    <div className="text-xl font-bold text-white">{resilienceData?.overall || 72}/100</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Financial Health</div>
                    <div className="text-xl font-bold text-white">78/100</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Operational Capacity</div>
                    <div className="text-xl font-bold text-white">85%</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Talent Stability</div>
                    <div className="text-xl font-bold text-white">71/100</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-gray-500">
                  These assumptions are refreshed daily from connected data sources. Lower confidence inputs have wider variance in Monte Carlo simulations.
                </p>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("58891") ? false : stryMutAct_9fa48("58890") ? true : (stryCov_9fa48("58890", "58891", "58892"), showAssumptions && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={stryMutAct_9fa48("58893") ? () => undefined : (stryCov_9fa48("58893"), () => setShowAssumptions(stryMutAct_9fa48("58894") ? true : (stryCov_9fa48("58894"), false)))}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={stryMutAct_9fa48("58895") ? () => undefined : (stryCov_9fa48("58895"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Simulation Assumptions</h3>
                <p className="text-sm text-gray-400">Baseline metrics and confidence levels used in simulations</p>
              </div>
              <button onClick={stryMutAct_9fa48("58896") ? () => undefined : (stryCov_9fa48("58896"), () => setShowAssumptions(stryMutAct_9fa48("58897") ? true : (stryCov_9fa48("58897"), false)))} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Input Assumptions */}
              <div>
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">Input Assumptions</h4>
                <div className="space-y-2">
                  {(stryMutAct_9fa48("58898") ? [] : (stryCov_9fa48("58898"), [stryMutAct_9fa48("58899") ? {} : (stryCov_9fa48("58899"), {
                label: 'Monthly Burn Rate',
                value: '$2.4M',
                source: 'Finance system',
                confidence: 95
              }), stryMutAct_9fa48("58903") ? {} : (stryCov_9fa48("58903"), {
                label: 'Cash Runway',
                value: '18 months',
                source: 'Treasury',
                confidence: 90
              }), stryMutAct_9fa48("58907") ? {} : (stryCov_9fa48("58907"), {
                label: 'Revenue Growth Rate',
                value: '12% YoY',
                source: 'CRM pipeline',
                confidence: 75
              }), stryMutAct_9fa48("58911") ? {} : (stryCov_9fa48("58911"), {
                label: 'Employee Count',
                value: '847',
                source: 'HRIS',
                confidence: 100
              }), stryMutAct_9fa48("58915") ? {} : (stryCov_9fa48("58915"), {
                label: 'Customer Churn Rate',
                value: '3.2%',
                source: 'Subscription data',
                confidence: 85
              })])).map(stryMutAct_9fa48("58919") ? () => undefined : (stryCov_9fa48("58919"), (a, i) => <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{a.label}</div>
                        <div className="text-xs text-gray-500">Source: {a.source}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-medium">{a.value}</div>
                        <div className="text-xs text-gray-500">{a.confidence}% confidence</div>
                      </div>
                    </div>))}
                </div>
              </div>

              {/* Baseline Metrics */}
              <div>
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3">Baseline Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Overall Resilience</div>
                    <div className="text-xl font-bold text-white">{stryMutAct_9fa48("58922") ? resilienceData?.overall && 72 : stryMutAct_9fa48("58921") ? false : stryMutAct_9fa48("58920") ? true : (stryCov_9fa48("58920", "58921", "58922"), (stryMutAct_9fa48("58923") ? resilienceData.overall : (stryCov_9fa48("58923"), resilienceData?.overall)) || 72)}/100</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Financial Health</div>
                    <div className="text-xl font-bold text-white">78/100</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Operational Capacity</div>
                    <div className="text-xl font-bold text-white">85%</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-gray-500">Talent Stability</div>
                    <div className="text-xl font-bold text-white">71/100</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-gray-500">
                  These assumptions are refreshed daily from connected data sources. Lower confidence inputs have wider variance in Monte Carlo simulations.
                </p>
              </div>
            </div>
          </div>
        </div>)}

      {/* Output Artifacts Modal */}
      {stryMutAct_9fa48("58926") ? showOutputArtifacts || <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowOutputArtifacts(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Output Artifacts</h3>
                <p className="text-sm text-gray-400">Generated documents from simulation results</p>
              </div>
              <button onClick={() => setShowOutputArtifacts(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[{
            name: 'Board Brief',
            icon: <FileText className="w-5 h-5 text-purple-400" />,
            description: 'Executive summary for board presentation',
            format: 'PDF / PPTX',
            available: !!activeSimulation
          }, {
            name: 'Operational Runbook',
            icon: <ClipboardList className="w-5 h-5 text-blue-400" />,
            description: 'Step-by-step response procedures',
            format: 'PDF / Markdown',
            available: !!activeSimulation
          }, {
            name: 'Decision DNA Entry',
            icon: <Brain className="w-5 h-5 text-cyan-400" />,
            description: 'Permanent record linked to Decision DNA',
            format: 'Auto-created',
            available: !!activeSimulation
          }, {
            name: 'Mitigation Plan',
            icon: <Shield className="w-5 h-5 text-emerald-400" />,
            description: 'Prioritized actions with owners and deadlines',
            format: 'PDF / CSV',
            available: !!activeSimulation
          }].map((artifact, i) => <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${artifact.available ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-800/20 border-slate-800 opacity-50'}`}>
                  <div className="flex items-center gap-3">
                    {artifact.icon}
                    <div>
                      <div className="font-medium text-white">{artifact.name}</div>
                      <div className="text-xs text-gray-500">{artifact.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{artifact.format}</span>
                    {artifact.available ? <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-medium">
                        Generate
                      </button> : <span className="text-xs text-gray-600">Run simulation first</span>}
                  </div>
                </div>)}
              
              {!activeSimulation && <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-300">
                    Run a simulation to generate output artifacts. Each simulation creates a complete package for stakeholder communication.
                  </p>
                </div>}
            </div>
          </div>
        </div> : stryMutAct_9fa48("58925") ? false : stryMutAct_9fa48("58924") ? true : (stryCov_9fa48("58924", "58925", "58926"), showOutputArtifacts && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={stryMutAct_9fa48("58927") ? () => undefined : (stryCov_9fa48("58927"), () => setShowOutputArtifacts(stryMutAct_9fa48("58928") ? true : (stryCov_9fa48("58928"), false)))}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={stryMutAct_9fa48("58929") ? () => undefined : (stryCov_9fa48("58929"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Output Artifacts</h3>
                <p className="text-sm text-gray-400">Generated documents from simulation results</p>
              </div>
              <button onClick={stryMutAct_9fa48("58930") ? () => undefined : (stryCov_9fa48("58930"), () => setShowOutputArtifacts(stryMutAct_9fa48("58931") ? true : (stryCov_9fa48("58931"), false)))} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(stryMutAct_9fa48("58932") ? [] : (stryCov_9fa48("58932"), [stryMutAct_9fa48("58933") ? {} : (stryCov_9fa48("58933"), {
            name: 'Board Brief',
            icon: <FileText className="w-5 h-5 text-purple-400" />,
            description: 'Executive summary for board presentation',
            format: 'PDF / PPTX',
            available: stryMutAct_9fa48("58937") ? !activeSimulation : (stryCov_9fa48("58937"), !(stryMutAct_9fa48("58938") ? activeSimulation : (stryCov_9fa48("58938"), !activeSimulation)))
          }), stryMutAct_9fa48("58939") ? {} : (stryCov_9fa48("58939"), {
            name: 'Operational Runbook',
            icon: <ClipboardList className="w-5 h-5 text-blue-400" />,
            description: 'Step-by-step response procedures',
            format: 'PDF / Markdown',
            available: stryMutAct_9fa48("58943") ? !activeSimulation : (stryCov_9fa48("58943"), !(stryMutAct_9fa48("58944") ? activeSimulation : (stryCov_9fa48("58944"), !activeSimulation)))
          }), stryMutAct_9fa48("58945") ? {} : (stryCov_9fa48("58945"), {
            name: 'Decision DNA Entry',
            icon: <Brain className="w-5 h-5 text-cyan-400" />,
            description: 'Permanent record linked to Decision DNA',
            format: 'Auto-created',
            available: stryMutAct_9fa48("58949") ? !activeSimulation : (stryCov_9fa48("58949"), !(stryMutAct_9fa48("58950") ? activeSimulation : (stryCov_9fa48("58950"), !activeSimulation)))
          }), stryMutAct_9fa48("58951") ? {} : (stryCov_9fa48("58951"), {
            name: 'Mitigation Plan',
            icon: <Shield className="w-5 h-5 text-emerald-400" />,
            description: 'Prioritized actions with owners and deadlines',
            format: 'PDF / CSV',
            available: stryMutAct_9fa48("58955") ? !activeSimulation : (stryCov_9fa48("58955"), !(stryMutAct_9fa48("58956") ? activeSimulation : (stryCov_9fa48("58956"), !activeSimulation)))
          })])).map(stryMutAct_9fa48("58957") ? () => undefined : (stryCov_9fa48("58957"), (artifact, i) => <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${artifact.available ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-800/20 border-slate-800 opacity-50'}`}>
                  <div className="flex items-center gap-3">
                    {artifact.icon}
                    <div>
                      <div className="font-medium text-white">{artifact.name}</div>
                      <div className="text-xs text-gray-500">{artifact.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{artifact.format}</span>
                    {artifact.available ? <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-medium">
                        Generate
                      </button> : <span className="text-xs text-gray-600">Run simulation first</span>}
                  </div>
                </div>))}
              
              {stryMutAct_9fa48("58963") ? !activeSimulation || <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-300">
                    Run a simulation to generate output artifacts. Each simulation creates a complete package for stakeholder communication.
                  </p>
                </div> : stryMutAct_9fa48("58962") ? false : stryMutAct_9fa48("58961") ? true : (stryCov_9fa48("58961", "58962", "58963"), (stryMutAct_9fa48("58964") ? activeSimulation : (stryCov_9fa48("58964"), !activeSimulation)) && <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-300">
                    Run a simulation to generate output artifacts. Each simulation creates a complete package for stakeholder communication.
                  </p>
                </div>)}
            </div>
          </div>
        </div>)}

      {/* History Sidebar */}
      {stryMutAct_9fa48("58967") ? showHistorySidebar || <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setShowHistorySidebar(false)}>
          <div className="w-[450px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-white">Simulation History</h2>
                <p className="text-sm text-gray-400">Past runs and comparative analysis</p>
              </div>
              <button onClick={() => setShowHistorySidebar(false)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {recentSimulations.length === 0 ? <div className="text-center py-8 text-gray-500">
                  No simulations run yet
                </div> : recentSimulations.map((sim, i) => <div key={sim.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors" onClick={() => {
            loadSimulationDetails(sim.id);
            setShowHistorySidebar(false);
          }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        {sim.simulationType.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${sim.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {sim.status}
                      </span>
                    </div>
                    <div className="font-medium text-white mb-1">{sim.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{new Date(sim.createdAt).toLocaleString()}</div>
                    {sim.resilienceScore && <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${sim.resilienceScore >= 70 ? 'bg-emerald-500' : sim.resilienceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                  width: `${sim.resilienceScore}%`
                }} />
                        </div>
                        <span className="text-xs text-gray-400">{sim.resilienceScore}/100</span>
                      </div>}
                    <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Re-run with current baseline
                    </button>
                  </div>)}
            </div>

            {/* Trend Chart Placeholder */}
            {recentSimulations.length > 1 && <div className="p-4 border-t border-slate-700">
                <h3 className="font-medium text-white mb-3">Resilience Trend</h3>
                <div className="h-32 bg-slate-800 rounded-lg flex items-end gap-1 p-3">
                  {recentSimulations.slice(0, 10).reverse().map((sim, i) => <div key={i} className="flex-1 bg-purple-500/50 rounded-t transition-all hover:bg-purple-500" style={{
              height: `${sim.resilienceScore || 50}%`
            }} title={`${sim.name}: ${sim.resilienceScore || '--'}/100`} />)}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Oldest</span>
                  <span>Most Recent</span>
                </div>
              </div>}
          </div>
        </div> : stryMutAct_9fa48("58966") ? false : stryMutAct_9fa48("58965") ? true : (stryCov_9fa48("58965", "58966", "58967"), showHistorySidebar && <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={stryMutAct_9fa48("58968") ? () => undefined : (stryCov_9fa48("58968"), () => setShowHistorySidebar(stryMutAct_9fa48("58969") ? true : (stryCov_9fa48("58969"), false)))}>
          <div className="w-[450px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={stryMutAct_9fa48("58970") ? () => undefined : (stryCov_9fa48("58970"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-white">Simulation History</h2>
                <p className="text-sm text-gray-400">Past runs and comparative analysis</p>
              </div>
              <button onClick={stryMutAct_9fa48("58971") ? () => undefined : (stryCov_9fa48("58971"), () => setShowHistorySidebar(stryMutAct_9fa48("58972") ? true : (stryCov_9fa48("58972"), false)))} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {(stryMutAct_9fa48("58975") ? recentSimulations.length !== 0 : stryMutAct_9fa48("58974") ? false : stryMutAct_9fa48("58973") ? true : (stryCov_9fa48("58973", "58974", "58975"), recentSimulations.length === 0)) ? <div className="text-center py-8 text-gray-500">
                  No simulations run yet
                </div> : recentSimulations.map(stryMutAct_9fa48("58976") ? () => undefined : (stryCov_9fa48("58976"), (sim, i) => <div key={sim.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors" onClick={() => {
            loadSimulationDetails(sim.id);
            setShowHistorySidebar(stryMutAct_9fa48("58978") ? true : (stryCov_9fa48("58978"), false));
          }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        {sim.simulationType.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("58983") ? sim.status !== 'COMPLETED' : stryMutAct_9fa48("58982") ? false : stryMutAct_9fa48("58981") ? true : (stryCov_9fa48("58981", "58982", "58983"), sim.status === 'COMPLETED')) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {sim.status}
                      </span>
                    </div>
                    <div className="font-medium text-white mb-1">{sim.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{new Date(sim.createdAt).toLocaleString()}</div>
                    {stryMutAct_9fa48("58989") ? sim.resilienceScore || <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${sim.resilienceScore >= 70 ? 'bg-emerald-500' : sim.resilienceScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                  width: `${sim.resilienceScore}%`
                }} />
                        </div>
                        <span className="text-xs text-gray-400">{sim.resilienceScore}/100</span>
                      </div> : stryMutAct_9fa48("58988") ? false : stryMutAct_9fa48("58987") ? true : (stryCov_9fa48("58987", "58988", "58989"), sim.resilienceScore && <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${(stryMutAct_9fa48("58994") ? sim.resilienceScore < 70 : stryMutAct_9fa48("58993") ? sim.resilienceScore > 70 : stryMutAct_9fa48("58992") ? false : stryMutAct_9fa48("58991") ? true : (stryCov_9fa48("58991", "58992", "58993", "58994"), sim.resilienceScore >= 70)) ? 'bg-emerald-500' : (stryMutAct_9fa48("58999") ? sim.resilienceScore < 50 : stryMutAct_9fa48("58998") ? sim.resilienceScore > 50 : stryMutAct_9fa48("58997") ? false : stryMutAct_9fa48("58996") ? true : (stryCov_9fa48("58996", "58997", "58998", "58999"), sim.resilienceScore >= 50)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("59002") ? {} : (stryCov_9fa48("59002"), {
                  width: `${sim.resilienceScore}%`
                })} />
                        </div>
                        <span className="text-xs text-gray-400">{sim.resilienceScore}/100</span>
                      </div>)}
                    <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Re-run with current baseline
                    </button>
                  </div>))}
            </div>

            {/* Trend Chart Placeholder */}
            {stryMutAct_9fa48("59006") ? recentSimulations.length > 1 || <div className="p-4 border-t border-slate-700">
                <h3 className="font-medium text-white mb-3">Resilience Trend</h3>
                <div className="h-32 bg-slate-800 rounded-lg flex items-end gap-1 p-3">
                  {recentSimulations.slice(0, 10).reverse().map((sim, i) => <div key={i} className="flex-1 bg-purple-500/50 rounded-t transition-all hover:bg-purple-500" style={{
              height: `${sim.resilienceScore || 50}%`
            }} title={`${sim.name}: ${sim.resilienceScore || '--'}/100`} />)}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Oldest</span>
                  <span>Most Recent</span>
                </div>
              </div> : stryMutAct_9fa48("59005") ? false : stryMutAct_9fa48("59004") ? true : (stryCov_9fa48("59004", "59005", "59006"), (stryMutAct_9fa48("59009") ? recentSimulations.length <= 1 : stryMutAct_9fa48("59008") ? recentSimulations.length >= 1 : stryMutAct_9fa48("59007") ? true : (stryCov_9fa48("59007", "59008", "59009"), recentSimulations.length > 1)) && <div className="p-4 border-t border-slate-700">
                <h3 className="font-medium text-white mb-3">Resilience Trend</h3>
                <div className="h-32 bg-slate-800 rounded-lg flex items-end gap-1 p-3">
                  {stryMutAct_9fa48("59011") ? recentSimulations.reverse().map((sim, i) => <div key={i} className="flex-1 bg-purple-500/50 rounded-t transition-all hover:bg-purple-500" style={{
              height: `${sim.resilienceScore || 50}%`
            }} title={`${sim.name}: ${sim.resilienceScore || '--'}/100`} />) : stryMutAct_9fa48("59010") ? recentSimulations.slice(0, 10).map((sim, i) => <div key={i} className="flex-1 bg-purple-500/50 rounded-t transition-all hover:bg-purple-500" style={{
              height: `${sim.resilienceScore || 50}%`
            }} title={`${sim.name}: ${sim.resilienceScore || '--'}/100`} />) : (stryCov_9fa48("59010", "59011"), recentSimulations.slice(0, 10).reverse().map(stryMutAct_9fa48("59012") ? () => undefined : (stryCov_9fa48("59012"), (sim, i) => <div key={i} className="flex-1 bg-purple-500/50 rounded-t transition-all hover:bg-purple-500" style={stryMutAct_9fa48("59013") ? {} : (stryCov_9fa48("59013"), {
              height: `${stryMutAct_9fa48("59017") ? sim.resilienceScore && 50 : stryMutAct_9fa48("59016") ? false : stryMutAct_9fa48("59015") ? true : (stryCov_9fa48("59015", "59016", "59017"), sim.resilienceScore || 50)}%`
            })} title={`${sim.name}: ${stryMutAct_9fa48("59021") ? sim.resilienceScore && '--' : stryMutAct_9fa48("59020") ? false : stryMutAct_9fa48("59019") ? true : (stryCov_9fa48("59019", "59020", "59021"), sim.resilienceScore || '--')}/100`} />)))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Oldest</span>
                  <span>Most Recent</span>
                </div>
              </div>)}
          </div>
        </div>)}

      {/* Scenario Customizer Modal */}
      {stryMutAct_9fa48("59025") ? showScenarioCustomizer || <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowScenarioCustomizer(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Custom Scenario Builder</h3>
              <p className="text-sm text-gray-400">Adjust parameters to create a tailored stress test</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Revenue Decline */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Revenue Decline</span>
                  <span className="text-red-400">-{customScenario.revenueDecline}%</span>
                </div>
                <input type="range" min="0" max="80" value={customScenario.revenueDecline} onChange={e => setCustomScenario({
              ...customScenario,
              revenueDecline: parseInt(e.target.value)
            })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>

              {/* Cost Increase */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Cost Increase</span>
                  <span className="text-orange-400">+{customScenario.costIncrease}%</span>
                </div>
                <input type="range" min="0" max="50" value={customScenario.costIncrease} onChange={e => setCustomScenario({
              ...customScenario,
              costIncrease: parseInt(e.target.value)
            })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              {/* Attrition Rate */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Employee Attrition</span>
                  <span className="text-amber-400">{customScenario.attritionRate}%</span>
                </div>
                <input type="range" min="0" max="40" value={customScenario.attritionRate} onChange={e => setCustomScenario({
              ...customScenario,
              attritionRate: parseInt(e.target.value)
            })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              </div>

              {/* Duration */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Stress Duration</span>
                  <span className="text-purple-400">{customScenario.duration} months</span>
                </div>
                <input type="range" min="1" max="24" value={customScenario.duration} onChange={e => setCustomScenario({
              ...customScenario,
              duration: parseInt(e.target.value)
            })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              </div>

              {/* Impact Preview */}
              <div className="p-4 bg-slate-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Estimated Impact Preview</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-red-400">-${(customScenario.revenueDecline * 0.1).toFixed(1)}M</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-400">-{Math.round(customScenario.attritionRate * 8)}</div>
                    <div className="text-xs text-gray-500">Headcount</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-400">{Math.max(20, 100 - customScenario.revenueDecline - customScenario.costIncrease)}</div>
                    <div className="text-xs text-gray-500">Resilience</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button onClick={() => setShowScenarioCustomizer(false)} className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                Cancel
              </button>
              <button onClick={() => {
            runSimulation('CUSTOM', customScenario);
            setShowScenarioCustomizer(false);
          }} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Run Custom Scenario
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("59024") ? false : stryMutAct_9fa48("59023") ? true : (stryCov_9fa48("59023", "59024", "59025"), showScenarioCustomizer && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={stryMutAct_9fa48("59026") ? () => undefined : (stryCov_9fa48("59026"), () => setShowScenarioCustomizer(stryMutAct_9fa48("59027") ? true : (stryCov_9fa48("59027"), false)))}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full" onClick={stryMutAct_9fa48("59028") ? () => undefined : (stryCov_9fa48("59028"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Custom Scenario Builder</h3>
              <p className="text-sm text-gray-400">Adjust parameters to create a tailored stress test</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Revenue Decline */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Revenue Decline</span>
                  <span className="text-red-400">-{customScenario.revenueDecline}%</span>
                </div>
                <input type="range" min="0" max="80" value={customScenario.revenueDecline} onChange={stryMutAct_9fa48("59029") ? () => undefined : (stryCov_9fa48("59029"), e => setCustomScenario(stryMutAct_9fa48("59030") ? {} : (stryCov_9fa48("59030"), {
              ...customScenario,
              revenueDecline: parseInt(e.target.value)
            })))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>

              {/* Cost Increase */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Cost Increase</span>
                  <span className="text-orange-400">+{customScenario.costIncrease}%</span>
                </div>
                <input type="range" min="0" max="50" value={customScenario.costIncrease} onChange={stryMutAct_9fa48("59031") ? () => undefined : (stryCov_9fa48("59031"), e => setCustomScenario(stryMutAct_9fa48("59032") ? {} : (stryCov_9fa48("59032"), {
              ...customScenario,
              costIncrease: parseInt(e.target.value)
            })))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              {/* Attrition Rate */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Employee Attrition</span>
                  <span className="text-amber-400">{customScenario.attritionRate}%</span>
                </div>
                <input type="range" min="0" max="40" value={customScenario.attritionRate} onChange={stryMutAct_9fa48("59033") ? () => undefined : (stryCov_9fa48("59033"), e => setCustomScenario(stryMutAct_9fa48("59034") ? {} : (stryCov_9fa48("59034"), {
              ...customScenario,
              attritionRate: parseInt(e.target.value)
            })))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              </div>

              {/* Duration */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Stress Duration</span>
                  <span className="text-purple-400">{customScenario.duration} months</span>
                </div>
                <input type="range" min="1" max="24" value={customScenario.duration} onChange={stryMutAct_9fa48("59035") ? () => undefined : (stryCov_9fa48("59035"), e => setCustomScenario(stryMutAct_9fa48("59036") ? {} : (stryCov_9fa48("59036"), {
              ...customScenario,
              duration: parseInt(e.target.value)
            })))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              </div>

              {/* Impact Preview */}
              <div className="p-4 bg-slate-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Estimated Impact Preview</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-red-400">-${(stryMutAct_9fa48("59037") ? customScenario.revenueDecline / 0.1 : (stryCov_9fa48("59037"), customScenario.revenueDecline * 0.1)).toFixed(1)}M</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-400">-{Math.round(stryMutAct_9fa48("59038") ? customScenario.attritionRate / 8 : (stryCov_9fa48("59038"), customScenario.attritionRate * 8))}</div>
                    <div className="text-xs text-gray-500">Headcount</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-400">{stryMutAct_9fa48("59039") ? Math.min(20, 100 - customScenario.revenueDecline - customScenario.costIncrease) : (stryCov_9fa48("59039"), Math.max(20, stryMutAct_9fa48("59040") ? 100 - customScenario.revenueDecline + customScenario.costIncrease : (stryCov_9fa48("59040"), (stryMutAct_9fa48("59041") ? 100 + customScenario.revenueDecline : (stryCov_9fa48("59041"), 100 - customScenario.revenueDecline)) - customScenario.costIncrease)))}</div>
                    <div className="text-xs text-gray-500">Resilience</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button onClick={stryMutAct_9fa48("59042") ? () => undefined : (stryCov_9fa48("59042"), () => setShowScenarioCustomizer(stryMutAct_9fa48("59043") ? true : (stryCov_9fa48("59043"), false)))} className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                Cancel
              </button>
              <button onClick={() => {
            runSimulation('CUSTOM', customScenario);
            setShowScenarioCustomizer(stryMutAct_9fa48("59046") ? true : (stryCov_9fa48("59046"), false));
          }} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Run Custom Scenario
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};
export default CruciblePage;