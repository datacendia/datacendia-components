/**
 * CendiaVox™ - Stakeholder Voice Assembly
 * "Who speaks for those not in the room?"
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
import apiClient from '../../lib/api/client';
import { Users, MessageSquare, Vote, AlertTriangle, Scale, Heart, Leaf, Clock, X, TrendingUp, TrendingDown, Minus, Play, ExternalLink, Edit2, Check, ArrowRight, CircleDot, CheckCircle, XCircle, AlertCircle, BarChart2, Link2, Download } from 'lucide-react';

// Mock sentiment history data (monthly)
const SENTIMENT_HISTORY = stryMutAct_9fa48("60587") ? [] : (stryCov_9fa48("60587"), [stryMutAct_9fa48("60588") ? {} : (stryCov_9fa48("60588"), {
  month: 'Aug',
  EMPLOYEES: 72,
  CUSTOMERS: 68,
  ENVIRONMENT: 75,
  FUTURE_GENERATIONS: 80,
  COMMUNITY: 65,
  SHAREHOLDERS: 70
}), stryMutAct_9fa48("60590") ? {} : (stryCov_9fa48("60590"), {
  month: 'Sep',
  EMPLOYEES: 70,
  CUSTOMERS: 72,
  ENVIRONMENT: 74,
  FUTURE_GENERATIONS: 80,
  COMMUNITY: 68,
  SHAREHOLDERS: 72
}), stryMutAct_9fa48("60592") ? {} : (stryCov_9fa48("60592"), {
  month: 'Oct',
  EMPLOYEES: 68,
  CUSTOMERS: 75,
  ENVIRONMENT: 73,
  FUTURE_GENERATIONS: 79,
  COMMUNITY: 70,
  SHAREHOLDERS: 74
}), stryMutAct_9fa48("60594") ? {} : (stryCov_9fa48("60594"), {
  month: 'Nov',
  EMPLOYEES: 65,
  CUSTOMERS: 78,
  ENVIRONMENT: 76,
  FUTURE_GENERATIONS: 81,
  COMMUNITY: 72,
  SHAREHOLDERS: 76
}), stryMutAct_9fa48("60596") ? {} : (stryCov_9fa48("60596"), {
  month: 'Dec',
  EMPLOYEES: 63,
  CUSTOMERS: 80,
  ENVIRONMENT: 78,
  FUTURE_GENERATIONS: 82,
  COMMUNITY: 73,
  SHAREHOLDERS: 78
}), stryMutAct_9fa48("60598") ? {} : (stryCov_9fa48("60598"), {
  month: 'Jan',
  EMPLOYEES: 61,
  CUSTOMERS: 82,
  ENVIRONMENT: 80,
  FUTURE_GENERATIONS: 83,
  COMMUNITY: 74,
  SHAREHOLDERS: 80
})]);

// Default stakeholder configuration with weights
const DEFAULT_STAKEHOLDERS = stryMutAct_9fa48("60600") ? [] : (stryCov_9fa48("60600"), [stryMutAct_9fa48("60601") ? {} : (stryCov_9fa48("60601"), {
  type: 'EMPLOYEES',
  name: 'Employees',
  icon: '👥',
  defaultWeight: 1.0,
  vetoRights: stryMutAct_9fa48("60605") ? [] : (stryCov_9fa48("60605"), ['Mass layoffs', 'Unsafe conditions', 'Benefits reduction']),
  description: 'Current workforce across all levels'
}), stryMutAct_9fa48("60610") ? {} : (stryCov_9fa48("60610"), {
  type: 'CUSTOMERS',
  name: 'Customers',
  icon: '❤️',
  defaultWeight: 1.0,
  vetoRights: stryMutAct_9fa48("60614") ? [] : (stryCov_9fa48("60614"), ['Service discontinuation', 'Privacy violations']),
  description: 'End users and enterprise clients'
}), stryMutAct_9fa48("60618") ? {} : (stryCov_9fa48("60618"), {
  type: 'COMMUNITY',
  name: 'Community',
  icon: '🏠',
  defaultWeight: 0.8,
  vetoRights: stryMutAct_9fa48("60622") ? [] : (stryCov_9fa48("60622"), ['Environmental harm', 'Community displacement']),
  description: 'Local communities where we operate'
}), stryMutAct_9fa48("60626") ? {} : (stryCov_9fa48("60626"), {
  type: 'ENVIRONMENT',
  name: 'Environment',
  icon: '🌿',
  defaultWeight: 1.2,
  vetoRights: stryMutAct_9fa48("60630") ? [] : (stryCov_9fa48("60630"), ['Irreversible harm', 'Carbon commitments']),
  description: 'Natural environment and ecosystems'
}), stryMutAct_9fa48("60634") ? {} : (stryCov_9fa48("60634"), {
  type: 'FUTURE_GENERATIONS',
  name: 'Future Generations',
  icon: '🔮',
  defaultWeight: 1.5,
  vetoRights: stryMutAct_9fa48("60638") ? [] : (stryCov_9fa48("60638"), ['Generational debt', 'Resource depletion']),
  description: 'Those who inherit our decisions'
}), stryMutAct_9fa48("60642") ? {} : (stryCov_9fa48("60642"), {
  type: 'SHAREHOLDERS',
  name: 'Shareholders',
  icon: '💰',
  defaultWeight: 1.0,
  vetoRights: stryMutAct_9fa48("60646") ? [] : (stryCov_9fa48("60646"), ['Fiduciary breach']),
  description: 'Investors and equity holders'
})]);

// Decision lifecycle stages for the assembly timeline
const DECISION_LIFECYCLE = stryMutAct_9fa48("60649") ? [] : (stryCov_9fa48("60649"), [stryMutAct_9fa48("60650") ? {} : (stryCov_9fa48("60650"), {
  id: 'decision',
  label: 'Decision Proposed',
  icon: '📝',
  description: 'Question submitted to Council'
}), stryMutAct_9fa48("60655") ? {} : (stryCov_9fa48("60655"), {
  id: 'assembly',
  label: 'Stakeholder Assembly',
  icon: '🗣️',
  description: 'Voices gathered and weighted'
}), stryMutAct_9fa48("60660") ? {} : (stryCov_9fa48("60660"), {
  id: 'veto-check',
  label: 'Veto Check',
  icon: '⚠️',
  description: 'Checking against veto rights'
}), stryMutAct_9fa48("60665") ? {} : (stryCov_9fa48("60665"), {
  id: 'resolution',
  label: 'Resolution',
  icon: '✅',
  description: 'Final decision recorded'
})]);
interface Stakeholder {
  id: string;
  stakeholderType: string;
  name: string;
  description: string;
  voiceWeight: number;
  vetoRights: string[];
  isActive: boolean;
}
interface Dashboard {
  activeStakeholders: number;
  signalsLast7Days: number;
  sentimentBreakdown: Record<string, number>;
  vetoesLast30Days: number;
  totalAssemblies: number;
}
interface Signal {
  id: string;
  timestamp: Date;
  stakeholder: string;
  type: 'survey' | 'hr_data' | 'nps' | 'incident' | 'regulatory' | 'social';
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  source: string;
}
interface VetoRecord {
  id: string;
  timestamp: Date;
  decisionId: string;
  decisionTitle: string;
  stakeholder: string;
  vetoType: string;
  outcome: 'blocked' | 'escalated' | 'overridden';
}
interface WeightChange {
  timestamp: Date;
  oldWeight: number;
  newWeight: number;
  changedBy: string;
}

// Mock data for signals
const MOCK_SIGNALS: Signal[] = stryMutAct_9fa48("60670") ? [] : (stryCov_9fa48("60670"), [stryMutAct_9fa48("60671") ? {} : (stryCov_9fa48("60671"), {
  id: 's1',
  timestamp: new Date(stryMutAct_9fa48("60673") ? Date.now() + 1 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60673"), Date.now() - (stryMutAct_9fa48("60674") ? 1 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60674"), (stryMutAct_9fa48("60675") ? 1 * 24 * 60 / 60 : (stryCov_9fa48("60675"), (stryMutAct_9fa48("60676") ? 1 * 24 / 60 : (stryCov_9fa48("60676"), (stryMutAct_9fa48("60677") ? 1 / 24 : (stryCov_9fa48("60677"), 1 * 24)) * 60)) * 60)) * 1000)))),
  stakeholder: 'EMPLOYEES',
  type: 'survey',
  severity: 'medium',
  summary: 'Q4 engagement survey shows 12% drop in remote work satisfaction',
  source: 'Workday Survey'
}), stryMutAct_9fa48("60683") ? {} : (stryCov_9fa48("60683"), {
  id: 's2',
  timestamp: new Date(stryMutAct_9fa48("60685") ? Date.now() + 2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60685"), Date.now() - (stryMutAct_9fa48("60686") ? 2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60686"), (stryMutAct_9fa48("60687") ? 2 * 24 * 60 / 60 : (stryCov_9fa48("60687"), (stryMutAct_9fa48("60688") ? 2 * 24 / 60 : (stryCov_9fa48("60688"), (stryMutAct_9fa48("60689") ? 2 / 24 : (stryCov_9fa48("60689"), 2 * 24)) * 60)) * 60)) * 1000)))),
  stakeholder: 'CUSTOMERS',
  type: 'nps',
  severity: 'low',
  summary: 'NPS increased from 42 to 47 in enterprise segment',
  source: 'Delighted'
}), stryMutAct_9fa48("60695") ? {} : (stryCov_9fa48("60695"), {
  id: 's3',
  timestamp: new Date(stryMutAct_9fa48("60697") ? Date.now() + 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60697"), Date.now() - (stryMutAct_9fa48("60698") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60698"), (stryMutAct_9fa48("60699") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("60699"), (stryMutAct_9fa48("60700") ? 3 * 24 / 60 : (stryCov_9fa48("60700"), (stryMutAct_9fa48("60701") ? 3 / 24 : (stryCov_9fa48("60701"), 3 * 24)) * 60)) * 60)) * 1000)))),
  stakeholder: 'ENVIRONMENT',
  type: 'regulatory',
  severity: 'high',
  summary: 'New EU carbon reporting requirements effective Q2 2026',
  source: 'Regulatory Watch'
}), stryMutAct_9fa48("60707") ? {} : (stryCov_9fa48("60707"), {
  id: 's4',
  timestamp: new Date(stryMutAct_9fa48("60709") ? Date.now() + 4 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60709"), Date.now() - (stryMutAct_9fa48("60710") ? 4 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60710"), (stryMutAct_9fa48("60711") ? 4 * 24 * 60 / 60 : (stryCov_9fa48("60711"), (stryMutAct_9fa48("60712") ? 4 * 24 / 60 : (stryCov_9fa48("60712"), (stryMutAct_9fa48("60713") ? 4 / 24 : (stryCov_9fa48("60713"), 4 * 24)) * 60)) * 60)) * 1000)))),
  stakeholder: 'COMMUNITY',
  type: 'social',
  severity: 'medium',
  summary: 'Local council raised concerns about expanded facility traffic',
  source: 'Community Relations'
}), stryMutAct_9fa48("60719") ? {} : (stryCov_9fa48("60719"), {
  id: 's5',
  timestamp: new Date(stryMutAct_9fa48("60721") ? Date.now() + 5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60721"), Date.now() - (stryMutAct_9fa48("60722") ? 5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60722"), (stryMutAct_9fa48("60723") ? 5 * 24 * 60 / 60 : (stryCov_9fa48("60723"), (stryMutAct_9fa48("60724") ? 5 * 24 / 60 : (stryCov_9fa48("60724"), (stryMutAct_9fa48("60725") ? 5 / 24 : (stryCov_9fa48("60725"), 5 * 24)) * 60)) * 60)) * 1000)))),
  stakeholder: 'EMPLOYEES',
  type: 'hr_data',
  severity: 'high',
  summary: 'Engineering attrition rate increased to 18% (threshold: 15%)',
  source: 'HR Analytics'
}), stryMutAct_9fa48("60731") ? {} : (stryCov_9fa48("60731"), {
  id: 's6',
  timestamp: new Date(stryMutAct_9fa48("60733") ? Date.now() + 6 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60733"), Date.now() - (stryMutAct_9fa48("60734") ? 6 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60734"), (stryMutAct_9fa48("60735") ? 6 * 24 * 60 / 60 : (stryCov_9fa48("60735"), (stryMutAct_9fa48("60736") ? 6 * 24 / 60 : (stryCov_9fa48("60736"), (stryMutAct_9fa48("60737") ? 6 / 24 : (stryCov_9fa48("60737"), 6 * 24)) * 60)) * 60)) * 1000)))),
  stakeholder: 'CUSTOMERS',
  type: 'incident',
  severity: 'critical',
  summary: 'Major outage affected 2,400 enterprise customers for 47 minutes',
  source: 'PagerDuty'
})]);

// Mock data for vetoes
const MOCK_VETOES: VetoRecord[] = stryMutAct_9fa48("60743") ? [] : (stryCov_9fa48("60743"), [stryMutAct_9fa48("60744") ? {} : (stryCov_9fa48("60744"), {
  id: 'v1',
  timestamp: new Date(stryMutAct_9fa48("60746") ? Date.now() + 5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60746"), Date.now() - (stryMutAct_9fa48("60747") ? 5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60747"), (stryMutAct_9fa48("60748") ? 5 * 24 * 60 / 60 : (stryCov_9fa48("60748"), (stryMutAct_9fa48("60749") ? 5 * 24 / 60 : (stryCov_9fa48("60749"), (stryMutAct_9fa48("60750") ? 5 / 24 : (stryCov_9fa48("60750"), 5 * 24)) * 60)) * 60)) * 1000)))),
  decisionId: 'dec-001',
  decisionTitle: 'Facility Expansion Phase 2',
  stakeholder: 'ENVIRONMENT',
  vetoType: 'IRREVERSIBLE_ENVIRONMENTAL_DAMAGE',
  outcome: 'escalated'
}), stryMutAct_9fa48("60756") ? {} : (stryCov_9fa48("60756"), {
  id: 'v2',
  timestamp: new Date(stryMutAct_9fa48("60758") ? Date.now() + 12 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60758"), Date.now() - (stryMutAct_9fa48("60759") ? 12 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60759"), (stryMutAct_9fa48("60760") ? 12 * 24 * 60 / 60 : (stryCov_9fa48("60760"), (stryMutAct_9fa48("60761") ? 12 * 24 / 60 : (stryCov_9fa48("60761"), (stryMutAct_9fa48("60762") ? 12 / 24 : (stryCov_9fa48("60762"), 12 * 24)) * 60)) * 60)) * 1000)))),
  decisionId: 'dec-002',
  decisionTitle: 'Workforce Reduction Plan',
  stakeholder: 'EMPLOYEES',
  vetoType: 'MASS_LAYOFFS',
  outcome: 'blocked'
})]);
export const VoxPage: React.FC = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(stryMutAct_9fa48("60769") ? ["Stryker was here"] : (stryCov_9fa48("60769"), []));
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("60770") ? false : (stryCov_9fa48("60770"), true));
  const [isInitializing, setIsInitializing] = useState(stryMutAct_9fa48("60771") ? true : (stryCov_9fa48("60771"), false));

  // Panel states
  const [showSignalsPanel, setShowSignalsPanel] = useState(stryMutAct_9fa48("60772") ? true : (stryCov_9fa48("60772"), false));
  const [showVetoesPanel, setShowVetoesPanel] = useState(stryMutAct_9fa48("60773") ? true : (stryCov_9fa48("60773"), false));
  const [showSentimentBreakdown, setShowSentimentBreakdown] = useState(stryMutAct_9fa48("60774") ? true : (stryCov_9fa48("60774"), false));
  const [showAssemblyModal, setShowAssemblyModal] = useState(stryMutAct_9fa48("60775") ? true : (stryCov_9fa48("60775"), false));
  const [editingWeightFor, setEditingWeightFor] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState<number>(1.0);
  const [showPhilosophy, setShowPhilosophy] = useState(stryMutAct_9fa48("60776") ? true : (stryCov_9fa48("60776"), false));
  const [showDecisionTimeline, setShowDecisionTimeline] = useState(stryMutAct_9fa48("60777") ? true : (stryCov_9fa48("60777"), false));
  const [activeTimelineDecision, setActiveTimelineDecision] = useState<string | null>(null);
  const [showSentimentChart, setShowSentimentChart] = useState(stryMutAct_9fa48("60778") ? true : (stryCov_9fa48("60778"), false));
  const [selectedChartStakeholder, setSelectedChartStakeholder] = useState<string | null>(null);

  // Sentiment trends (mock)
  const sentimentTrend = stryMutAct_9fa48("60779") ? {} : (stryCov_9fa48("60779"), {
    direction: 'up' as const,
    vsLastMonth: '+8%'
  });
  const stakeholderSentiment: Record<string, number> = stryMutAct_9fa48("60781") ? {} : (stryCov_9fa48("60781"), {
    'EMPLOYEES': stryMutAct_9fa48("60782") ? +2 : (stryCov_9fa48("60782"), -2),
    'CUSTOMERS': 5,
    'COMMUNITY': 1,
    'ENVIRONMENT': 0,
    'FUTURE_GENERATIONS': 0,
    'SHAREHOLDERS': 3
  });
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("60784") ? ["Stryker was here"] : (stryCov_9fa48("60784"), []));
  const loadData = async () => {
    try {
      const [stkRes, dashRes] = await Promise.all(stryMutAct_9fa48("60787") ? [] : (stryCov_9fa48("60787"), [apiClient.api.get<{
        data: Stakeholder[];
      }>('/vox/stakeholders'), apiClient.api.get<{
        data: Dashboard;
      }>('/vox/dashboard')]));
      if (stryMutAct_9fa48("60791") ? false : stryMutAct_9fa48("60790") ? true : (stryCov_9fa48("60790", "60791"), stkRes.success)) {
        setStakeholders(stryMutAct_9fa48("60795") ? ((stkRes.data as any)?.data || stkRes.data) && [] : stryMutAct_9fa48("60794") ? false : stryMutAct_9fa48("60793") ? true : (stryCov_9fa48("60793", "60794", "60795"), (stryMutAct_9fa48("60797") ? (stkRes.data as any)?.data && stkRes.data : stryMutAct_9fa48("60796") ? false : (stryCov_9fa48("60796", "60797"), (stryMutAct_9fa48("60798") ? (stkRes.data as any).data : (stryCov_9fa48("60798"), (stkRes.data as any)?.data)) || stkRes.data)) || (stryMutAct_9fa48("60799") ? ["Stryker was here"] : (stryCov_9fa48("60799"), []))));
      }
      if (stryMutAct_9fa48("60801") ? false : stryMutAct_9fa48("60800") ? true : (stryCov_9fa48("60800", "60801"), dashRes.success)) {
        setDashboard(stryMutAct_9fa48("60805") ? ((dashRes.data as any)?.data || dashRes.data) && null : stryMutAct_9fa48("60804") ? false : stryMutAct_9fa48("60803") ? true : (stryCov_9fa48("60803", "60804", "60805"), (stryMutAct_9fa48("60807") ? (dashRes.data as any)?.data && dashRes.data : stryMutAct_9fa48("60806") ? false : (stryCov_9fa48("60806", "60807"), (stryMutAct_9fa48("60808") ? (dashRes.data as any).data : (stryCov_9fa48("60808"), (dashRes.data as any)?.data)) || dashRes.data)) || null));
      }
    } catch (error) {
      console.error('Failed to load Vox data:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("60812") ? true : (stryCov_9fa48("60812"), false));
    }
  };
  const initializeStakeholders = async () => {
    setIsInitializing(stryMutAct_9fa48("60814") ? false : (stryCov_9fa48("60814"), true));
    try {
      await apiClient.api.post('/vox/stakeholders/initialize');
      await loadData();
    } catch (error) {
      console.error('Initialize failed:', error);
    } finally {
      setIsInitializing(stryMutAct_9fa48("60820") ? true : (stryCov_9fa48("60820"), false));
    }
  };
  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case 'EMPLOYEES':
        if (stryMutAct_9fa48("60822")) {} else {
          stryCov_9fa48("60822");
          return <Users className="w-5 h-5 text-blue-400" />;
        }
      case 'CUSTOMERS':
        if (stryMutAct_9fa48("60824")) {} else {
          stryCov_9fa48("60824");
          return <Heart className="w-5 h-5 text-pink-400" />;
        }
      case 'COMMUNITY':
        if (stryMutAct_9fa48("60826")) {} else {
          stryCov_9fa48("60826");
          return <Users className="w-5 h-5 text-amber-400" />;
        }
      case 'ENVIRONMENT':
        if (stryMutAct_9fa48("60828")) {} else {
          stryCov_9fa48("60828");
          return <Leaf className="w-5 h-5 text-emerald-400" />;
        }
      case 'FUTURE_GENERATIONS':
        if (stryMutAct_9fa48("60830")) {} else {
          stryCov_9fa48("60830");
          return <Clock className="w-5 h-5 text-purple-400" />;
        }
      case 'SHAREHOLDERS':
        if (stryMutAct_9fa48("60832")) {} else {
          stryCov_9fa48("60832");
          return <Scale className="w-5 h-5 text-cyan-400" />;
        }
      default:
        if (stryMutAct_9fa48("60834")) {} else {
          stryCov_9fa48("60834");
          return <Users className="w-5 h-5 text-slate-400" />;
        }
    }
  };
  const getStakeholderColor = (type: string) => {
    switch (type) {
      case 'EMPLOYEES':
        if (stryMutAct_9fa48("60836")) {} else {
          stryCov_9fa48("60836");
          return 'border-blue-500/50 bg-blue-500/10';
        }
      case 'CUSTOMERS':
        if (stryMutAct_9fa48("60839")) {} else {
          stryCov_9fa48("60839");
          return 'border-pink-500/50 bg-pink-500/10';
        }
      case 'COMMUNITY':
        if (stryMutAct_9fa48("60842")) {} else {
          stryCov_9fa48("60842");
          return 'border-amber-500/50 bg-amber-500/10';
        }
      case 'ENVIRONMENT':
        if (stryMutAct_9fa48("60845")) {} else {
          stryCov_9fa48("60845");
          return 'border-emerald-500/50 bg-emerald-500/10';
        }
      case 'FUTURE_GENERATIONS':
        if (stryMutAct_9fa48("60848")) {} else {
          stryCov_9fa48("60848");
          return 'border-purple-500/50 bg-purple-500/10';
        }
      case 'SHAREHOLDERS':
        if (stryMutAct_9fa48("60851")) {} else {
          stryCov_9fa48("60851");
          return 'border-cyan-500/50 bg-cyan-500/10';
        }
      default:
        if (stryMutAct_9fa48("60854")) {} else {
          stryCov_9fa48("60854");
          return 'border-slate-500/50 bg-slate-500/10';
        }
    }
  };

  // Dynamic decision timeline data (relative to current time)
  const formatTimelineDate = (hoursAgo: number) => {
    const date = new Date(stryMutAct_9fa48("60857") ? Date.now() + hoursAgo * 60 * 60 * 1000 : (stryCov_9fa48("60857"), Date.now() - (stryMutAct_9fa48("60858") ? hoursAgo * 60 * 60 / 1000 : (stryCov_9fa48("60858"), (stryMutAct_9fa48("60859") ? hoursAgo * 60 / 60 : (stryCov_9fa48("60859"), (stryMutAct_9fa48("60860") ? hoursAgo / 60 : (stryCov_9fa48("60860"), hoursAgo * 60)) * 60)) * 1000))));
    return stryMutAct_9fa48("60861") ? date.toISOString().replace('T', ' ') : (stryCov_9fa48("60861"), date.toISOString().replace('T', ' ').substring(0, 16));
  };
  const mockDecisionTimeline = stryMutAct_9fa48("60864") ? {} : (stryCov_9fa48("60864"), {
    id: `dec-${new Date().getFullYear()}-042`,
    title: 'Facility Expansion Phase 2',
    stages: stryMutAct_9fa48("60867") ? [] : (stryCov_9fa48("60867"), [stryMutAct_9fa48("60868") ? {} : (stryCov_9fa48("60868"), {
      stage: 'decision',
      status: 'completed',
      timestamp: formatTimelineDate(72),
      notes: 'Proposed by Operations'
    }), stryMutAct_9fa48("60872") ? {} : (stryCov_9fa48("60872"), {
      stage: 'assembly',
      status: 'completed',
      timestamp: formatTimelineDate(71.75),
      notes: '6 stakeholder voices gathered'
    }), stryMutAct_9fa48("60876") ? {} : (stryCov_9fa48("60876"), {
      stage: 'veto-check',
      status: 'vetoed',
      timestamp: formatTimelineDate(71.5),
      notes: 'Environment veto: Irreversible harm'
    }), stryMutAct_9fa48("60880") ? {} : (stryCov_9fa48("60880"), {
      stage: 'resolution',
      status: 'pending',
      timestamp: null,
      notes: 'Awaiting mitigation plan'
    })])
  });
  if (stryMutAct_9fa48("60885") ? false : stryMutAct_9fa48("60884") ? true : (stryCov_9fa48("60884", "60885"), isLoading)) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Vox...</div>;
  }
  return <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaVox™</h1>
            <p className="text-slate-400">Stakeholder Voice Assembly - "Who speaks for those not in the room?"</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={stryMutAct_9fa48("60887") ? () => undefined : (stryCov_9fa48("60887"), () => setShowAssemblyModal(stryMutAct_9fa48("60888") ? false : (stryCov_9fa48("60888"), true)))} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Play className="w-4 h-4" />
            Run Stakeholder Assembly on a Decision
          </button>
          <button onClick={stryMutAct_9fa48("60889") ? () => undefined : (stryCov_9fa48("60889"), () => setShowSentimentChart(stryMutAct_9fa48("60890") ? false : (stryCov_9fa48("60890"), true)))} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> Sentiment History
          </button>
        </div>
        <div className="flex items-center gap-4">
          <a href="/cortex/intelligence/council" className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-sm text-purple-300 flex items-center gap-2">
            <Link2 className="w-4 h-4" /> Link to Council Deliberation
          </a>
          <div className="text-xs text-slate-500">
            Linked to: <span className="text-cyan-400">Council</span> • <span className="text-purple-400">Decision DNA</span> • <span className="text-blue-400">Chronos</span>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {stryMutAct_9fa48("60893") ? dashboard || <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Users className="w-4 h-4" /> Stakeholders</div>
            <div className="text-3xl font-bold">{dashboard.activeStakeholders}</div>
          </div>
          <button onClick={() => setShowSignalsPanel(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><MessageSquare className="w-4 h-4" /> Signals (7d)</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboard.signalsLast7Days || MOCK_SIGNALS.length}</div>
            <div className="text-xs text-cyan-400/60 mt-1">Click to view stream →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Vote className="w-4 h-4" /> Assemblies</div>
            <div className="text-3xl font-bold">{dashboard.totalAssemblies}</div>
          </div>
          <button onClick={() => setShowVetoesPanel(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><AlertTriangle className="w-4 h-4" /> Vetoes (30d)</div>
            <div className="text-3xl font-bold text-red-400">{dashboard.vetoesLast30Days || MOCK_VETOES.length}</div>
            <div className="text-xs text-red-400/60 mt-1">Click to view history →</div>
          </button>
          <button onClick={() => setShowSentimentBreakdown(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="text-slate-400 text-sm mb-1 flex items-center justify-between">
              <span>Sentiment</span>
              <span className="flex items-center gap-1 text-emerald-400">
                {sentimentTrend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : sentimentTrend.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span className="text-xs">{sentimentTrend.vsLastMonth}</span>
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(dashboard.sentimentBreakdown || {}).slice(0, 3).map(([k, v]) => <span key={k} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">{k.substring(0, 3)}: {v}</span>)}
            </div>
            <div className="text-xs text-emerald-400/60 mt-1">Improving vs last month →</div>
          </button>
        </div> : stryMutAct_9fa48("60892") ? false : stryMutAct_9fa48("60891") ? true : (stryCov_9fa48("60891", "60892", "60893"), dashboard && <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Users className="w-4 h-4" /> Stakeholders</div>
            <div className="text-3xl font-bold">{dashboard.activeStakeholders}</div>
          </div>
          <button onClick={stryMutAct_9fa48("60894") ? () => undefined : (stryCov_9fa48("60894"), () => setShowSignalsPanel(stryMutAct_9fa48("60895") ? false : (stryCov_9fa48("60895"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><MessageSquare className="w-4 h-4" /> Signals (7d)</div>
            <div className="text-3xl font-bold text-cyan-400">{stryMutAct_9fa48("60898") ? dashboard.signalsLast7Days && MOCK_SIGNALS.length : stryMutAct_9fa48("60897") ? false : stryMutAct_9fa48("60896") ? true : (stryCov_9fa48("60896", "60897", "60898"), dashboard.signalsLast7Days || MOCK_SIGNALS.length)}</div>
            <div className="text-xs text-cyan-400/60 mt-1">Click to view stream →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Vote className="w-4 h-4" /> Assemblies</div>
            <div className="text-3xl font-bold">{dashboard.totalAssemblies}</div>
          </div>
          <button onClick={stryMutAct_9fa48("60899") ? () => undefined : (stryCov_9fa48("60899"), () => setShowVetoesPanel(stryMutAct_9fa48("60900") ? false : (stryCov_9fa48("60900"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><AlertTriangle className="w-4 h-4" /> Vetoes (30d)</div>
            <div className="text-3xl font-bold text-red-400">{stryMutAct_9fa48("60903") ? dashboard.vetoesLast30Days && MOCK_VETOES.length : stryMutAct_9fa48("60902") ? false : stryMutAct_9fa48("60901") ? true : (stryCov_9fa48("60901", "60902", "60903"), dashboard.vetoesLast30Days || MOCK_VETOES.length)}</div>
            <div className="text-xs text-red-400/60 mt-1">Click to view history →</div>
          </button>
          <button onClick={stryMutAct_9fa48("60904") ? () => undefined : (stryCov_9fa48("60904"), () => setShowSentimentBreakdown(stryMutAct_9fa48("60905") ? false : (stryCov_9fa48("60905"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="text-slate-400 text-sm mb-1 flex items-center justify-between">
              <span>Sentiment</span>
              <span className="flex items-center gap-1 text-emerald-400">
                {(stryMutAct_9fa48("60908") ? sentimentTrend.direction !== 'up' : stryMutAct_9fa48("60907") ? false : stryMutAct_9fa48("60906") ? true : (stryCov_9fa48("60906", "60907", "60908"), sentimentTrend.direction === 'up')) ? <TrendingUp className="w-3 h-3" /> : (stryMutAct_9fa48("60912") ? sentimentTrend.direction !== 'down' : stryMutAct_9fa48("60911") ? false : stryMutAct_9fa48("60910") ? true : (stryCov_9fa48("60910", "60911", "60912"), sentimentTrend.direction === 'down')) ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span className="text-xs">{sentimentTrend.vsLastMonth}</span>
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {stryMutAct_9fa48("60914") ? Object.entries(dashboard.sentimentBreakdown || {}).map(([k, v]) => <span key={k} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">{k.substring(0, 3)}: {v}</span>) : (stryCov_9fa48("60914"), Object.entries(stryMutAct_9fa48("60917") ? dashboard.sentimentBreakdown && {} : stryMutAct_9fa48("60916") ? false : stryMutAct_9fa48("60915") ? true : (stryCov_9fa48("60915", "60916", "60917"), dashboard.sentimentBreakdown || {})).slice(0, 3).map(stryMutAct_9fa48("60918") ? () => undefined : (stryCov_9fa48("60918"), ([k, v]) => <span key={k} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">{stryMutAct_9fa48("60919") ? k : (stryCov_9fa48("60919"), k.substring(0, 3))}: {v}</span>)))}
            </div>
            <div className="text-xs text-emerald-400/60 mt-1">Improving vs last month →</div>
          </button>
        </div>)}

      {/* Initialize Button */}
      {stryMutAct_9fa48("60922") ? stakeholders.length === 0 || <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700 mb-8">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Stakeholders Configured</h3>
          <p className="text-slate-400 mb-6">Initialize default stakeholder voices including employees, customers, community, environment, and future generations.</p>
          <button onClick={initializeStakeholders} disabled={isInitializing} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium disabled:opacity-50">
            {isInitializing ? 'Initializing...' : 'Initialize Stakeholder Voices'}
          </button>
        </div> : stryMutAct_9fa48("60921") ? false : stryMutAct_9fa48("60920") ? true : (stryCov_9fa48("60920", "60921", "60922"), (stryMutAct_9fa48("60924") ? stakeholders.length !== 0 : stryMutAct_9fa48("60923") ? true : (stryCov_9fa48("60923", "60924"), stakeholders.length === 0)) && <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700 mb-8">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Stakeholders Configured</h3>
          <p className="text-slate-400 mb-6">Initialize default stakeholder voices including employees, customers, community, environment, and future generations.</p>
          <button onClick={initializeStakeholders} disabled={isInitializing} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium disabled:opacity-50">
            {isInitializing ? 'Initializing...' : 'Initialize Stakeholder Voices'}
          </button>
        </div>)}

      {/* Stakeholder Cards */}
      {stryMutAct_9fa48("60929") ? stakeholders.length > 0 || <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map(s => {
        const stakeholderSignals = MOCK_SIGNALS.filter(sig => sig.stakeholder === s.stakeholderType).length;
        const stakeholderVetoes = MOCK_VETOES.filter(v => v.stakeholder === s.stakeholderType).length;
        return <div key={s.id} className={`rounded-lg p-6 border ${getStakeholderColor(s.stakeholderType)}`}>
                <div className="flex items-center gap-3 mb-4">
                  {getStakeholderIcon(s.stakeholderType)}
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.stakeholderType.replace(/_/g, ' ')}</div>
                  </div>
                  {/* Signals & Vetoes mini badges */}
                  <div className="flex gap-2">
                    <button onClick={() => setShowSignalsPanel(true)} className={`text-xs px-2 py-1 rounded ${stakeholderSignals > 0 ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-slate-700 text-slate-500'}`} title={`${stakeholderSignals} signals in last 7 days`}>
                      📡 {stakeholderSignals}
                    </button>
                    <button onClick={() => setShowVetoesPanel(true)} className={`text-xs px-2 py-1 rounded ${stakeholderVetoes > 0 ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-slate-700 text-slate-500'}`} title={`${stakeholderVetoes} vetoes in last 30 days`}>
                      🛑 {stakeholderVetoes}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">{s.description}</p>
                <div className="space-y-3 text-sm">
                  {/* Editable Voice Weight with Draggable Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1 group relative">
                        Voice Weight
                        <span className="text-slate-600 text-xs cursor-help">ⓘ</span>
                        <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10 border border-slate-700">
                          Voice Weight determines how strongly this stakeholder's interests are weighted in Council deliberations and risk scoring.
                        </span>
                      </span>
                      <span className="font-medium text-cyan-400">{s.voiceWeight.toFixed(1)}x</span>
                    </div>
                    {editingWeightFor === s.id ? <div className="space-y-2">
                        <input type="range" value={newWeight} onChange={e => setNewWeight(parseFloat(e.target.value))} step="0.1" min="0.1" max="2.0" className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>0.1x (Low)</span>
                          <span>1.0x (Default)</span>
                          <span>2.0x (High)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" value={newWeight} onChange={e => setNewWeight(Math.min(2.0, Math.max(0.1, parseFloat(e.target.value) || 1.0)))} step="0.1" min="0.1" max="2.0" className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm" />
                          <button onClick={async () => {
                    // Save to backend
                    try {
                      await apiClient.api.patch(`/vox/stakeholders/${s.id}`, {
                        voiceWeight: newWeight
                      });
                      await loadData();
                    } catch (error) {
                      console.error('Failed to update weight:', error);
                    }
                    setEditingWeightFor(null);
                  }} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm flex items-center gap-1">
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button onClick={() => setEditingWeightFor(null)} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm">
                            Cancel
                          </button>
                        </div>
                      </div> : <button onClick={() => {
                setEditingWeightFor(s.id);
                setNewWeight(s.voiceWeight);
              }} className="w-full h-2 bg-slate-600 rounded-lg relative group cursor-pointer hover:bg-slate-500 transition-colors">
                        <div className="absolute top-0 left-0 h-full bg-cyan-500 rounded-lg transition-all" style={{
                  width: `${s.voiceWeight / 2.0 * 100}%`
                }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-lg border-2 border-white" style={{
                  left: `calc(${s.voiceWeight / 2.0 * 100}% - 8px)`
                }} />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to adjust
                        </span>
                      </button>}
                  </div>
                  {/* Weight audit trail hint */}
                  <div className="text-[10px] text-slate-500">
                    Last changed: {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} by Governance Admin
                  </div>
                  <div>
                    <span className="text-slate-400">Veto Rights:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.vetoRights.map((right, i) => <span key={i} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded">
                          {right.replace(/_/g, ' ')}
                        </span>)}
                    </div>
                  </div>
                </div>
              </div>;
      })}
        </div> : stryMutAct_9fa48("60928") ? false : stryMutAct_9fa48("60927") ? true : (stryCov_9fa48("60927", "60928", "60929"), (stryMutAct_9fa48("60932") ? stakeholders.length <= 0 : stryMutAct_9fa48("60931") ? stakeholders.length >= 0 : stryMutAct_9fa48("60930") ? true : (stryCov_9fa48("60930", "60931", "60932"), stakeholders.length > 0)) && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map(s => {
        const stakeholderSignals = stryMutAct_9fa48("60934") ? MOCK_SIGNALS.length : (stryCov_9fa48("60934"), MOCK_SIGNALS.filter(stryMutAct_9fa48("60935") ? () => undefined : (stryCov_9fa48("60935"), sig => stryMutAct_9fa48("60938") ? sig.stakeholder !== s.stakeholderType : stryMutAct_9fa48("60937") ? false : stryMutAct_9fa48("60936") ? true : (stryCov_9fa48("60936", "60937", "60938"), sig.stakeholder === s.stakeholderType))).length);
        const stakeholderVetoes = stryMutAct_9fa48("60939") ? MOCK_VETOES.length : (stryCov_9fa48("60939"), MOCK_VETOES.filter(stryMutAct_9fa48("60940") ? () => undefined : (stryCov_9fa48("60940"), v => stryMutAct_9fa48("60943") ? v.stakeholder !== s.stakeholderType : stryMutAct_9fa48("60942") ? false : stryMutAct_9fa48("60941") ? true : (stryCov_9fa48("60941", "60942", "60943"), v.stakeholder === s.stakeholderType))).length);
        return <div key={s.id} className={`rounded-lg p-6 border ${getStakeholderColor(s.stakeholderType)}`}>
                <div className="flex items-center gap-3 mb-4">
                  {getStakeholderIcon(s.stakeholderType)}
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.stakeholderType.replace(/_/g, ' ')}</div>
                  </div>
                  {/* Signals & Vetoes mini badges */}
                  <div className="flex gap-2">
                    <button onClick={stryMutAct_9fa48("60946") ? () => undefined : (stryCov_9fa48("60946"), () => setShowSignalsPanel(stryMutAct_9fa48("60947") ? false : (stryCov_9fa48("60947"), true)))} className={`text-xs px-2 py-1 rounded ${(stryMutAct_9fa48("60952") ? stakeholderSignals <= 0 : stryMutAct_9fa48("60951") ? stakeholderSignals >= 0 : stryMutAct_9fa48("60950") ? false : stryMutAct_9fa48("60949") ? true : (stryCov_9fa48("60949", "60950", "60951", "60952"), stakeholderSignals > 0)) ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-slate-700 text-slate-500'}`} title={`${stakeholderSignals} signals in last 7 days`}>
                      📡 {stakeholderSignals}
                    </button>
                    <button onClick={stryMutAct_9fa48("60956") ? () => undefined : (stryCov_9fa48("60956"), () => setShowVetoesPanel(stryMutAct_9fa48("60957") ? false : (stryCov_9fa48("60957"), true)))} className={`text-xs px-2 py-1 rounded ${(stryMutAct_9fa48("60962") ? stakeholderVetoes <= 0 : stryMutAct_9fa48("60961") ? stakeholderVetoes >= 0 : stryMutAct_9fa48("60960") ? false : stryMutAct_9fa48("60959") ? true : (stryCov_9fa48("60959", "60960", "60961", "60962"), stakeholderVetoes > 0)) ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-slate-700 text-slate-500'}`} title={`${stakeholderVetoes} vetoes in last 30 days`}>
                      🛑 {stakeholderVetoes}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">{s.description}</p>
                <div className="space-y-3 text-sm">
                  {/* Editable Voice Weight with Draggable Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1 group relative">
                        Voice Weight
                        <span className="text-slate-600 text-xs cursor-help">ⓘ</span>
                        <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10 border border-slate-700">
                          Voice Weight determines how strongly this stakeholder's interests are weighted in Council deliberations and risk scoring.
                        </span>
                      </span>
                      <span className="font-medium text-cyan-400">{s.voiceWeight.toFixed(1)}x</span>
                    </div>
                    {(stryMutAct_9fa48("60968") ? editingWeightFor !== s.id : stryMutAct_9fa48("60967") ? false : stryMutAct_9fa48("60966") ? true : (stryCov_9fa48("60966", "60967", "60968"), editingWeightFor === s.id)) ? <div className="space-y-2">
                        <input type="range" value={newWeight} onChange={stryMutAct_9fa48("60969") ? () => undefined : (stryCov_9fa48("60969"), e => setNewWeight(parseFloat(e.target.value)))} step="0.1" min="0.1" max="2.0" className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>0.1x (Low)</span>
                          <span>1.0x (Default)</span>
                          <span>2.0x (High)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="number" value={newWeight} onChange={stryMutAct_9fa48("60970") ? () => undefined : (stryCov_9fa48("60970"), e => setNewWeight(stryMutAct_9fa48("60971") ? Math.max(2.0, Math.max(0.1, parseFloat(e.target.value) || 1.0)) : (stryCov_9fa48("60971"), Math.min(2.0, stryMutAct_9fa48("60972") ? Math.min(0.1, parseFloat(e.target.value) || 1.0) : (stryCov_9fa48("60972"), Math.max(0.1, stryMutAct_9fa48("60975") ? parseFloat(e.target.value) && 1.0 : stryMutAct_9fa48("60974") ? false : stryMutAct_9fa48("60973") ? true : (stryCov_9fa48("60973", "60974", "60975"), parseFloat(e.target.value) || 1.0)))))))} step="0.1" min="0.1" max="2.0" className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm" />
                          <button onClick={async () => {
                    // Save to backend
                    try {
                      await apiClient.api.patch(`/vox/stakeholders/${s.id}`, stryMutAct_9fa48("60979") ? {} : (stryCov_9fa48("60979"), {
                        voiceWeight: newWeight
                      }));
                      await loadData();
                    } catch (error) {
                      console.error('Failed to update weight:', error);
                    }
                    setEditingWeightFor(null);
                  }} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm flex items-center gap-1">
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button onClick={stryMutAct_9fa48("60982") ? () => undefined : (stryCov_9fa48("60982"), () => setEditingWeightFor(null))} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm">
                            Cancel
                          </button>
                        </div>
                      </div> : <button onClick={() => {
                setEditingWeightFor(s.id);
                setNewWeight(s.voiceWeight);
              }} className="w-full h-2 bg-slate-600 rounded-lg relative group cursor-pointer hover:bg-slate-500 transition-colors">
                        <div className="absolute top-0 left-0 h-full bg-cyan-500 rounded-lg transition-all" style={stryMutAct_9fa48("60984") ? {} : (stryCov_9fa48("60984"), {
                  width: `${stryMutAct_9fa48("60986") ? s.voiceWeight / 2.0 / 100 : (stryCov_9fa48("60986"), (stryMutAct_9fa48("60987") ? s.voiceWeight * 2.0 : (stryCov_9fa48("60987"), s.voiceWeight / 2.0)) * 100)}%`
                })} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-lg border-2 border-white" style={stryMutAct_9fa48("60988") ? {} : (stryCov_9fa48("60988"), {
                  left: `calc(${stryMutAct_9fa48("60990") ? s.voiceWeight / 2.0 / 100 : (stryCov_9fa48("60990"), (stryMutAct_9fa48("60991") ? s.voiceWeight * 2.0 : (stryCov_9fa48("60991"), s.voiceWeight / 2.0)) * 100)}% - 8px)`
                })} />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-slate-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to adjust
                        </span>
                      </button>}
                  </div>
                  {/* Weight audit trail hint */}
                  <div className="text-[10px] text-slate-500">
                    Last changed: {new Date(stryMutAct_9fa48("60992") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("60992"), Date.now() - (stryMutAct_9fa48("60993") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("60993"), (stryMutAct_9fa48("60994") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("60994"), (stryMutAct_9fa48("60995") ? 30 * 24 / 60 : (stryCov_9fa48("60995"), (stryMutAct_9fa48("60996") ? 30 / 24 : (stryCov_9fa48("60996"), 30 * 24)) * 60)) * 60)) * 1000)))).toISOString().split('T')[0]} by Governance Admin
                  </div>
                  <div>
                    <span className="text-slate-400">Veto Rights:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.vetoRights.map(stryMutAct_9fa48("60998") ? () => undefined : (stryCov_9fa48("60998"), (right, i) => <span key={i} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded">
                          {right.replace(/_/g, ' ')}
                        </span>))}
                    </div>
                  </div>
                </div>
              </div>;
      })}
        </div>)}

      {/* Decision → Assembly → Veto → Resolution Timeline */}
      <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-cyan-400" /> Decision Governance Timeline
            </h2>
            <p className="text-sm text-slate-400">How stakeholder voices flow through decisions</p>
          </div>
          <button onClick={stryMutAct_9fa48("61000") ? () => undefined : (stryCov_9fa48("61000"), () => setShowDecisionTimeline(stryMutAct_9fa48("61001") ? showDecisionTimeline : (stryCov_9fa48("61001"), !showDecisionTimeline)))} className="text-xs text-cyan-400 hover:text-cyan-300">
            {showDecisionTimeline ? 'Hide example' : 'Show live example'}
          </button>
        </div>
        
        {/* Timeline Steps */}
        <div className="flex items-center justify-between mb-6">
          {DECISION_LIFECYCLE.map(stryMutAct_9fa48("61004") ? () => undefined : (stryCov_9fa48("61004"), (stage, i) => <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl mb-2">
                  {stage.icon}
                </div>
                <div className="font-medium text-sm">{stage.label}</div>
                <div className="text-xs text-slate-500 max-w-[120px]">{stage.description}</div>
              </div>
              {stryMutAct_9fa48("61007") ? i < DECISION_LIFECYCLE.length - 1 || <div className="flex-1 h-0.5 bg-cyan-500/30 mx-2"></div> : stryMutAct_9fa48("61006") ? false : stryMutAct_9fa48("61005") ? true : (stryCov_9fa48("61005", "61006", "61007"), (stryMutAct_9fa48("61010") ? i >= DECISION_LIFECYCLE.length - 1 : stryMutAct_9fa48("61009") ? i <= DECISION_LIFECYCLE.length - 1 : stryMutAct_9fa48("61008") ? true : (stryCov_9fa48("61008", "61009", "61010"), i < (stryMutAct_9fa48("61011") ? DECISION_LIFECYCLE.length + 1 : (stryCov_9fa48("61011"), DECISION_LIFECYCLE.length - 1)))) && <div className="flex-1 h-0.5 bg-cyan-500/30 mx-2"></div>)}
            </React.Fragment>))}
        </div>

        {/* Live Example */}
        {stryMutAct_9fa48("61014") ? showDecisionTimeline || <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">{mockDecisionTimeline.title}</div>
                <div className="text-xs text-slate-400">ID: {mockDecisionTimeline.id}</div>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">Veto Active</span>
            </div>
            <div className="space-y-2">
              {mockDecisionTimeline.stages.map((s, i) => <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${s.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : s.status === 'vetoed' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-500'}`}>
                    {s.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : s.status === 'vetoed' ? <XCircle className="w-4 h-4" /> : <CircleDot className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{DECISION_LIFECYCLE.find(d => d.id === s.stage)?.label}</div>
                    <div className="text-xs text-slate-400">{s.notes}</div>
                  </div>
                  {s.timestamp && <div className="text-xs text-slate-500">{s.timestamp}</div>}
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("61013") ? false : stryMutAct_9fa48("61012") ? true : (stryCov_9fa48("61012", "61013", "61014"), showDecisionTimeline && <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">{mockDecisionTimeline.title}</div>
                <div className="text-xs text-slate-400">ID: {mockDecisionTimeline.id}</div>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs">Veto Active</span>
            </div>
            <div className="space-y-2">
              {mockDecisionTimeline.stages.map(stryMutAct_9fa48("61015") ? () => undefined : (stryCov_9fa48("61015"), (s, i) => <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${(stryMutAct_9fa48("61019") ? s.status !== 'completed' : stryMutAct_9fa48("61018") ? false : stryMutAct_9fa48("61017") ? true : (stryCov_9fa48("61017", "61018", "61019"), s.status === 'completed')) ? 'bg-emerald-500/20 text-emerald-400' : (stryMutAct_9fa48("61024") ? s.status !== 'vetoed' : stryMutAct_9fa48("61023") ? false : stryMutAct_9fa48("61022") ? true : (stryCov_9fa48("61022", "61023", "61024"), s.status === 'vetoed')) ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-500'}`}>
                    {(stryMutAct_9fa48("61030") ? s.status !== 'completed' : stryMutAct_9fa48("61029") ? false : stryMutAct_9fa48("61028") ? true : (stryCov_9fa48("61028", "61029", "61030"), s.status === 'completed')) ? <CheckCircle className="w-4 h-4" /> : (stryMutAct_9fa48("61034") ? s.status !== 'vetoed' : stryMutAct_9fa48("61033") ? false : stryMutAct_9fa48("61032") ? true : (stryCov_9fa48("61032", "61033", "61034"), s.status === 'vetoed')) ? <XCircle className="w-4 h-4" /> : <CircleDot className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{stryMutAct_9fa48("61036") ? DECISION_LIFECYCLE.find(d => d.id === s.stage).label : (stryCov_9fa48("61036"), DECISION_LIFECYCLE.find(stryMutAct_9fa48("61037") ? () => undefined : (stryCov_9fa48("61037"), d => stryMutAct_9fa48("61040") ? d.id !== s.stage : stryMutAct_9fa48("61039") ? false : stryMutAct_9fa48("61038") ? true : (stryCov_9fa48("61038", "61039", "61040"), d.id === s.stage)))?.label)}</div>
                    <div className="text-xs text-slate-400">{s.notes}</div>
                  </div>
                  {stryMutAct_9fa48("61043") ? s.timestamp || <div className="text-xs text-slate-500">{s.timestamp}</div> : stryMutAct_9fa48("61042") ? false : stryMutAct_9fa48("61041") ? true : (stryCov_9fa48("61041", "61042", "61043"), s.timestamp && <div className="text-xs text-slate-500">{s.timestamp}</div>)}
                </div>))}
            </div>
          </div>)}
      </div>

      {/* Default Stakeholders Reference */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="font-semibold mb-4">Default Stakeholder Weights & Veto Rights</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {DEFAULT_STAKEHOLDERS.map(stryMutAct_9fa48("61044") ? () => undefined : (stryCov_9fa48("61044"), s => <div key={s.type} className={`p-3 rounded-lg border ${getStakeholderColor(s.type)}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-slate-400 mb-2">Weight: {s.defaultWeight}x</div>
              <div className="text-xs text-slate-500">
                Veto: {s.vetoRights.length} right{(stryMutAct_9fa48("61048") ? s.vetoRights.length === 1 : stryMutAct_9fa48("61047") ? false : stryMutAct_9fa48("61046") ? true : (stryCov_9fa48("61046", "61047", "61048"), s.vetoRights.length !== 1)) ? 's' : ''}
              </div>
            </div>))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Weights are editable per stakeholder. Higher weights amplify that voice in Council deliberations.
        </p>
      </div>

      {/* Philosophy Banner - Collapsible */}
      <div className="mt-8 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-lg border border-cyan-500/30 overflow-hidden">
        <button onClick={stryMutAct_9fa48("61051") ? () => undefined : (stryCov_9fa48("61051"), () => setShowPhilosophy(stryMutAct_9fa48("61052") ? showPhilosophy : (stryCov_9fa48("61052"), !showPhilosophy)))} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-cyan-400" />
            <span className="font-medium">Stakeholder Capitalism Philosophy</span>
            <span className="text-xs text-slate-500">— Why every voice matters</span>
          </div>
          <svg className={`w-5 h-5 text-slate-400 transition-transform ${showPhilosophy ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {stryMutAct_9fa48("61058") ? showPhilosophy || <div className="px-6 pb-6 pt-2">
            <p className="text-slate-300 mb-4">
              <strong className="text-white">CendiaVox™ enforces stakeholder capitalism in decision-making.</strong> Every major decision 
              is tested against the interests of employees, customers, communities, environment, and future generations. 
              All proxies represent voices that cannot speak for themselves.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span>Environment: veto on irreversible harm</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span>Future generations: veto on generational debt</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>Employees: veto on unsafe conditions</span>
              </div>
            </div>
          </div> : stryMutAct_9fa48("61057") ? false : stryMutAct_9fa48("61056") ? true : (stryCov_9fa48("61056", "61057", "61058"), showPhilosophy && <div className="px-6 pb-6 pt-2">
            <p className="text-slate-300 mb-4">
              <strong className="text-white">CendiaVox™ enforces stakeholder capitalism in decision-making.</strong> Every major decision 
              is tested against the interests of employees, customers, communities, environment, and future generations. 
              All proxies represent voices that cannot speak for themselves.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span>Environment: veto on irreversible harm</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span>Future generations: veto on generational debt</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>Employees: veto on unsafe conditions</span>
              </div>
            </div>
          </div>)}
      </div>

      {/* Signals Stream Panel */}
      {stryMutAct_9fa48("61061") ? showSignalsPanel || <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={() => setShowSignalsPanel(false)}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">📡 Signals Stream</h2>
                <p className="text-sm text-slate-400">Live sensing from all stakeholder channels</p>
              </div>
              <button onClick={() => setShowSignalsPanel(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_SIGNALS.map(signal => <div key={signal.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${signal.severity === 'critical' ? 'bg-red-500/20 text-red-300' : signal.severity === 'high' ? 'bg-orange-500/20 text-orange-300' : signal.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'}`}>
                      {signal.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{signal.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm mb-2">{signal.summary}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{signal.stakeholder.replace(/_/g, ' ')}</span>
                    <span className="flex items-center gap-1">
                      {signal.source}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("61060") ? false : stryMutAct_9fa48("61059") ? true : (stryCov_9fa48("61059", "61060", "61061"), showSignalsPanel && <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={stryMutAct_9fa48("61062") ? () => undefined : (stryCov_9fa48("61062"), () => setShowSignalsPanel(stryMutAct_9fa48("61063") ? true : (stryCov_9fa48("61063"), false)))}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={stryMutAct_9fa48("61064") ? () => undefined : (stryCov_9fa48("61064"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">📡 Signals Stream</h2>
                <p className="text-sm text-slate-400">Live sensing from all stakeholder channels</p>
              </div>
              <button onClick={stryMutAct_9fa48("61065") ? () => undefined : (stryCov_9fa48("61065"), () => setShowSignalsPanel(stryMutAct_9fa48("61066") ? true : (stryCov_9fa48("61066"), false)))} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_SIGNALS.map(stryMutAct_9fa48("61067") ? () => undefined : (stryCov_9fa48("61067"), signal => <div key={signal.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("61071") ? signal.severity !== 'critical' : stryMutAct_9fa48("61070") ? false : stryMutAct_9fa48("61069") ? true : (stryCov_9fa48("61069", "61070", "61071"), signal.severity === 'critical')) ? 'bg-red-500/20 text-red-300' : (stryMutAct_9fa48("61076") ? signal.severity !== 'high' : stryMutAct_9fa48("61075") ? false : stryMutAct_9fa48("61074") ? true : (stryCov_9fa48("61074", "61075", "61076"), signal.severity === 'high')) ? 'bg-orange-500/20 text-orange-300' : (stryMutAct_9fa48("61081") ? signal.severity !== 'medium' : stryMutAct_9fa48("61080") ? false : stryMutAct_9fa48("61079") ? true : (stryCov_9fa48("61079", "61080", "61081"), signal.severity === 'medium')) ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'}`}>
                      {stryMutAct_9fa48("61085") ? signal.severity.toLowerCase() : (stryCov_9fa48("61085"), signal.severity.toUpperCase())}
                    </span>
                    <span className="text-xs text-slate-500">{signal.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm mb-2">{signal.summary}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{signal.stakeholder.replace(/_/g, ' ')}</span>
                    <span className="flex items-center gap-1">
                      {signal.source}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>))}
            </div>
          </div>
        </div>)}

      {/* Vetoes History Panel */}
      {stryMutAct_9fa48("61089") ? showVetoesPanel || <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={() => setShowVetoesPanel(false)}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">🛑 Veto History</h2>
                <p className="text-sm text-slate-400">Decisions where stakeholder vetoes were triggered</p>
              </div>
              <button onClick={() => setShowVetoesPanel(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_VETOES.map(veto => <div key={veto.id} className="p-4 bg-slate-800 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${veto.outcome === 'blocked' ? 'bg-red-500/20 text-red-300' : veto.outcome === 'escalated' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-300'}`}>
                      {veto.outcome.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{veto.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">{veto.decisionTitle}</div>
                  <div className="text-xs text-slate-400 mb-2">{veto.vetoType.replace(/_/g, ' ')}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Triggered by: {veto.stakeholder.replace(/_/g, ' ')}</span>
                    <button onClick={() => window.open(`/cortex/intelligence/decision-dna?id=${veto.decisionId}`, '_blank')} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                      View in DNA <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>)}
              {MOCK_VETOES.length === 0 && <div className="text-center py-8 text-slate-500">No vetoes in last 30 days</div>}
            </div>
          </div>
        </div> : stryMutAct_9fa48("61088") ? false : stryMutAct_9fa48("61087") ? true : (stryCov_9fa48("61087", "61088", "61089"), showVetoesPanel && <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={stryMutAct_9fa48("61090") ? () => undefined : (stryCov_9fa48("61090"), () => setShowVetoesPanel(stryMutAct_9fa48("61091") ? true : (stryCov_9fa48("61091"), false)))}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={stryMutAct_9fa48("61092") ? () => undefined : (stryCov_9fa48("61092"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">🛑 Veto History</h2>
                <p className="text-sm text-slate-400">Decisions where stakeholder vetoes were triggered</p>
              </div>
              <button onClick={stryMutAct_9fa48("61093") ? () => undefined : (stryCov_9fa48("61093"), () => setShowVetoesPanel(stryMutAct_9fa48("61094") ? true : (stryCov_9fa48("61094"), false)))} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_VETOES.map(stryMutAct_9fa48("61095") ? () => undefined : (stryCov_9fa48("61095"), veto => <div key={veto.id} className="p-4 bg-slate-800 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("61099") ? veto.outcome !== 'blocked' : stryMutAct_9fa48("61098") ? false : stryMutAct_9fa48("61097") ? true : (stryCov_9fa48("61097", "61098", "61099"), veto.outcome === 'blocked')) ? 'bg-red-500/20 text-red-300' : (stryMutAct_9fa48("61104") ? veto.outcome !== 'escalated' : stryMutAct_9fa48("61103") ? false : stryMutAct_9fa48("61102") ? true : (stryCov_9fa48("61102", "61103", "61104"), veto.outcome === 'escalated')) ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-300'}`}>
                      {stryMutAct_9fa48("61108") ? veto.outcome.toLowerCase() : (stryCov_9fa48("61108"), veto.outcome.toUpperCase())}
                    </span>
                    <span className="text-xs text-slate-500">{veto.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">{veto.decisionTitle}</div>
                  <div className="text-xs text-slate-400 mb-2">{veto.vetoType.replace(/_/g, ' ')}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Triggered by: {veto.stakeholder.replace(/_/g, ' ')}</span>
                    <button onClick={stryMutAct_9fa48("61111") ? () => undefined : (stryCov_9fa48("61111"), () => window.open(`/cortex/intelligence/decision-dna?id=${veto.decisionId}`, '_blank'))} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                      View in DNA <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>))}
              {stryMutAct_9fa48("61116") ? MOCK_VETOES.length === 0 || <div className="text-center py-8 text-slate-500">No vetoes in last 30 days</div> : stryMutAct_9fa48("61115") ? false : stryMutAct_9fa48("61114") ? true : (stryCov_9fa48("61114", "61115", "61116"), (stryMutAct_9fa48("61118") ? MOCK_VETOES.length !== 0 : stryMutAct_9fa48("61117") ? true : (stryCov_9fa48("61117", "61118"), MOCK_VETOES.length === 0)) && <div className="text-center py-8 text-slate-500">No vetoes in last 30 days</div>)}
            </div>
          </div>
        </div>)}

      {/* Sentiment Breakdown Modal */}
      {stryMutAct_9fa48("61121") ? showSentimentBreakdown || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSentimentBreakdown(false)}>
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-[500px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📊 Sentiment Breakdown</h2>
                <p className="text-sm text-slate-400">ESG pulse by stakeholder group</p>
              </div>
              <button onClick={() => setShowSentimentBreakdown(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-slate-300">Overall Trend</span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  {sentimentTrend.vsLastMonth} vs last month
                </span>
              </div>
              {Object.entries(stakeholderSentiment).map(([stakeholder, value]) => <div key={stakeholder} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-300">{stakeholder.replace(/_/g, ' ')}</span>
                  <span className={`font-medium ${value > 0 ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("61120") ? false : stryMutAct_9fa48("61119") ? true : (stryCov_9fa48("61119", "61120", "61121"), showSentimentBreakdown && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("61122") ? () => undefined : (stryCov_9fa48("61122"), () => setShowSentimentBreakdown(stryMutAct_9fa48("61123") ? true : (stryCov_9fa48("61123"), false)))}>
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-[500px] max-h-[80vh] overflow-y-auto" onClick={stryMutAct_9fa48("61124") ? () => undefined : (stryCov_9fa48("61124"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📊 Sentiment Breakdown</h2>
                <p className="text-sm text-slate-400">ESG pulse by stakeholder group</p>
              </div>
              <button onClick={stryMutAct_9fa48("61125") ? () => undefined : (stryCov_9fa48("61125"), () => setShowSentimentBreakdown(stryMutAct_9fa48("61126") ? true : (stryCov_9fa48("61126"), false)))} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-slate-300">Overall Trend</span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  {sentimentTrend.vsLastMonth} vs last month
                </span>
              </div>
              {Object.entries(stakeholderSentiment).map(stryMutAct_9fa48("61127") ? () => undefined : (stryCov_9fa48("61127"), ([stakeholder, value]) => <div key={stakeholder} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-300">{stakeholder.replace(/_/g, ' ')}</span>
                  <span className={`font-medium ${(stryMutAct_9fa48("61133") ? value <= 0 : stryMutAct_9fa48("61132") ? value >= 0 : stryMutAct_9fa48("61131") ? false : stryMutAct_9fa48("61130") ? true : (stryCov_9fa48("61130", "61131", "61132", "61133"), value > 0)) ? 'text-emerald-400' : (stryMutAct_9fa48("61138") ? value >= 0 : stryMutAct_9fa48("61137") ? value <= 0 : stryMutAct_9fa48("61136") ? false : stryMutAct_9fa48("61135") ? true : (stryCov_9fa48("61135", "61136", "61137", "61138"), value < 0)) ? 'text-red-400' : 'text-slate-400'}`}>
                    {(stryMutAct_9fa48("61144") ? value <= 0 : stryMutAct_9fa48("61143") ? value >= 0 : stryMutAct_9fa48("61142") ? false : stryMutAct_9fa48("61141") ? true : (stryCov_9fa48("61141", "61142", "61143", "61144"), value > 0)) ? '+' : ''}{value}
                  </span>
                </div>))}
            </div>
          </div>
        </div>)}

      {/* Run Assembly Modal */}
      {stryMutAct_9fa48("61149") ? showAssemblyModal || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssemblyModal(false)}>
          <div className="bg-slate-900 rounded-xl border border-cyan-500/30 w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold mb-1">🗣️ Run Stakeholder Assembly</h2>
              <p className="text-sm text-slate-400">Convene stakeholder voices to deliberate on a decision</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Decision</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white">
                  <option value="">Choose from recent Decision DNA items...</option>
                  <option value="dec-001">DEC-001: Facility Expansion Phase 2</option>
                  <option value="dec-002">DEC-002: Workforce Reduction Plan</option>
                  <option value="dec-003">DEC-003: AI Infrastructure Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Or enter Decision ID</label>
                <input type="text" placeholder="e.g., DEC-2025-0042" className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500" />
              </div>
              <div className="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                <h4 className="font-medium text-cyan-300 mb-2">What happens next:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• A Council session will be spawned with {stakeholders.length || 6} stakeholder voices</li>
                  <li>• Each voice is represented by a configured AI persona</li>
                  <li>• The assembly will be logged to Decision DNA as: <strong>Stakeholder Assembly: Yes</strong></li>
                  <li>• Results link back to this CendiaVox configuration</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowAssemblyModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button onClick={() => {
              setShowAssemblyModal(false);
              window.open('/cortex/intelligence/council?assembly=true', '_blank');
            }} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium">
                  Start Assembly →
                </button>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("61148") ? false : stryMutAct_9fa48("61147") ? true : (stryCov_9fa48("61147", "61148", "61149"), showAssemblyModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("61150") ? () => undefined : (stryCov_9fa48("61150"), () => setShowAssemblyModal(stryMutAct_9fa48("61151") ? true : (stryCov_9fa48("61151"), false)))}>
          <div className="bg-slate-900 rounded-xl border border-cyan-500/30 w-[600px] max-h-[80vh] overflow-y-auto" onClick={stryMutAct_9fa48("61152") ? () => undefined : (stryCov_9fa48("61152"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold mb-1">🗣️ Run Stakeholder Assembly</h2>
              <p className="text-sm text-slate-400">Convene stakeholder voices to deliberate on a decision</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Decision</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white">
                  <option value="">Choose from recent Decision DNA items...</option>
                  <option value="dec-001">DEC-001: Facility Expansion Phase 2</option>
                  <option value="dec-002">DEC-002: Workforce Reduction Plan</option>
                  <option value="dec-003">DEC-003: AI Infrastructure Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Or enter Decision ID</label>
                <input type="text" placeholder="e.g., DEC-2025-0042" className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500" />
              </div>
              <div className="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                <h4 className="font-medium text-cyan-300 mb-2">What happens next:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• A Council session will be spawned with {stryMutAct_9fa48("61155") ? stakeholders.length && 6 : stryMutAct_9fa48("61154") ? false : stryMutAct_9fa48("61153") ? true : (stryCov_9fa48("61153", "61154", "61155"), stakeholders.length || 6)} stakeholder voices</li>
                  <li>• Each voice is represented by a configured AI persona</li>
                  <li>• The assembly will be logged to Decision DNA as: <strong>Stakeholder Assembly: Yes</strong></li>
                  <li>• Results link back to this CendiaVox configuration</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={stryMutAct_9fa48("61156") ? () => undefined : (stryCov_9fa48("61156"), () => setShowAssemblyModal(stryMutAct_9fa48("61157") ? true : (stryCov_9fa48("61157"), false)))} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button onClick={() => {
              setShowAssemblyModal(stryMutAct_9fa48("61159") ? true : (stryCov_9fa48("61159"), false));
              window.open('/cortex/intelligence/council?assembly=true', '_blank');
            }} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium">
                  Start Assembly →
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Sentiment History Chart Modal */}
      {stryMutAct_9fa48("61164") ? showSentimentChart || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowSentimentChart(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" /> Sentiment History
                </h3>
                <p className="text-sm text-slate-400">Track stakeholder sentiment trends over time</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export
                </button>
                <button onClick={() => setShowSentimentChart(false)} className="text-slate-400 hover:text-white p-1">✕</button>
              </div>
            </div>

            {/* Stakeholder Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={() => setSelectedChartStakeholder(null)} className={`px-3 py-1.5 rounded-lg text-xs ${!selectedChartStakeholder ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                All Stakeholders
              </button>
              {DEFAULT_STAKEHOLDERS.map(s => <button key={s.type} onClick={() => setSelectedChartStakeholder(s.type)} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${selectedChartStakeholder === s.type ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  <span>{s.icon}</span> {s.name}
                </button>)}
            </div>

            {/* Chart Area */}
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <div className="h-64 flex items-end gap-1">
                {SENTIMENT_HISTORY.map((month, i) => <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col gap-0.5 h-52">
                      {(selectedChartStakeholder ? [selectedChartStakeholder] : Object.keys(month).filter(k => k !== 'month')).map(stakeholder => {
                  const value = month[stakeholder as keyof typeof month] as number;
                  const color = stakeholder === 'EMPLOYEES' ? 'bg-blue-500' : stakeholder === 'CUSTOMERS' ? 'bg-pink-500' : stakeholder === 'ENVIRONMENT' ? 'bg-emerald-500' : stakeholder === 'FUTURE_GENERATIONS' ? 'bg-purple-500' : stakeholder === 'COMMUNITY' ? 'bg-amber-500' : 'bg-cyan-500';
                  return <div key={stakeholder} className={`w-full ${color} rounded-sm transition-all hover:opacity-80`} style={{
                    height: `${value / 100 * (selectedChartStakeholder ? 100 : 16)}%`
                  }} title={`${stakeholder}: ${value}`} />;
                })}
                    </div>
                    <span className="text-xs text-slate-500 mt-2">{month.month}</span>
                  </div>)}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              {DEFAULT_STAKEHOLDERS.map(s => <span key={s.type} className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded ${s.type === 'EMPLOYEES' ? 'bg-blue-500' : s.type === 'CUSTOMERS' ? 'bg-pink-500' : s.type === 'ENVIRONMENT' ? 'bg-emerald-500' : s.type === 'FUTURE_GENERATIONS' ? 'bg-purple-500' : s.type === 'COMMUNITY' ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                  {s.name}
                </span>)}
            </div>

            {/* Alerts Section */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <h4 className="font-medium text-amber-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Sentiment Alerts
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">👥 Employees sentiment declining -11 pts over 6 months</span>
                  <span className="text-red-400">Action needed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">🔮 Future Generations veto frequency up 15%</span>
                  <span className="text-amber-400">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("61163") ? false : stryMutAct_9fa48("61162") ? true : (stryCov_9fa48("61162", "61163", "61164"), showSentimentChart && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("61165") ? () => undefined : (stryCov_9fa48("61165"), () => setShowSentimentChart(stryMutAct_9fa48("61166") ? true : (stryCov_9fa48("61166"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl border border-slate-700" onClick={stryMutAct_9fa48("61167") ? () => undefined : (stryCov_9fa48("61167"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" /> Sentiment History
                </h3>
                <p className="text-sm text-slate-400">Track stakeholder sentiment trends over time</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export
                </button>
                <button onClick={stryMutAct_9fa48("61168") ? () => undefined : (stryCov_9fa48("61168"), () => setShowSentimentChart(stryMutAct_9fa48("61169") ? true : (stryCov_9fa48("61169"), false)))} className="text-slate-400 hover:text-white p-1">✕</button>
              </div>
            </div>

            {/* Stakeholder Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button onClick={stryMutAct_9fa48("61170") ? () => undefined : (stryCov_9fa48("61170"), () => setSelectedChartStakeholder(null))} className={`px-3 py-1.5 rounded-lg text-xs ${(stryMutAct_9fa48("61172") ? selectedChartStakeholder : (stryCov_9fa48("61172"), !selectedChartStakeholder)) ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                All Stakeholders
              </button>
              {DEFAULT_STAKEHOLDERS.map(stryMutAct_9fa48("61175") ? () => undefined : (stryCov_9fa48("61175"), s => <button key={s.type} onClick={stryMutAct_9fa48("61176") ? () => undefined : (stryCov_9fa48("61176"), () => setSelectedChartStakeholder(s.type))} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${(stryMutAct_9fa48("61180") ? selectedChartStakeholder !== s.type : stryMutAct_9fa48("61179") ? false : stryMutAct_9fa48("61178") ? true : (stryCov_9fa48("61178", "61179", "61180"), selectedChartStakeholder === s.type)) ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  <span>{s.icon}</span> {s.name}
                </button>))}
            </div>

            {/* Chart Area */}
            <div className="bg-slate-900 rounded-lg p-4 mb-4">
              <div className="h-64 flex items-end gap-1">
                {SENTIMENT_HISTORY.map(stryMutAct_9fa48("61183") ? () => undefined : (stryCov_9fa48("61183"), (month, i) => <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col gap-0.5 h-52">
                      {(selectedChartStakeholder ? stryMutAct_9fa48("61184") ? [] : (stryCov_9fa48("61184"), [selectedChartStakeholder]) : stryMutAct_9fa48("61185") ? Object.keys(month) : (stryCov_9fa48("61185"), Object.keys(month).filter(stryMutAct_9fa48("61186") ? () => undefined : (stryCov_9fa48("61186"), k => stryMutAct_9fa48("61189") ? k === 'month' : stryMutAct_9fa48("61188") ? false : stryMutAct_9fa48("61187") ? true : (stryCov_9fa48("61187", "61188", "61189"), k !== 'month'))))).map(stakeholder => {
                  const value = month[stakeholder as keyof typeof month] as number;
                  const color = (stryMutAct_9fa48("61194") ? stakeholder !== 'EMPLOYEES' : stryMutAct_9fa48("61193") ? false : stryMutAct_9fa48("61192") ? true : (stryCov_9fa48("61192", "61193", "61194"), stakeholder === 'EMPLOYEES')) ? 'bg-blue-500' : (stryMutAct_9fa48("61199") ? stakeholder !== 'CUSTOMERS' : stryMutAct_9fa48("61198") ? false : stryMutAct_9fa48("61197") ? true : (stryCov_9fa48("61197", "61198", "61199"), stakeholder === 'CUSTOMERS')) ? 'bg-pink-500' : (stryMutAct_9fa48("61204") ? stakeholder !== 'ENVIRONMENT' : stryMutAct_9fa48("61203") ? false : stryMutAct_9fa48("61202") ? true : (stryCov_9fa48("61202", "61203", "61204"), stakeholder === 'ENVIRONMENT')) ? 'bg-emerald-500' : (stryMutAct_9fa48("61209") ? stakeholder !== 'FUTURE_GENERATIONS' : stryMutAct_9fa48("61208") ? false : stryMutAct_9fa48("61207") ? true : (stryCov_9fa48("61207", "61208", "61209"), stakeholder === 'FUTURE_GENERATIONS')) ? 'bg-purple-500' : (stryMutAct_9fa48("61214") ? stakeholder !== 'COMMUNITY' : stryMutAct_9fa48("61213") ? false : stryMutAct_9fa48("61212") ? true : (stryCov_9fa48("61212", "61213", "61214"), stakeholder === 'COMMUNITY')) ? 'bg-amber-500' : 'bg-cyan-500';
                  return <div key={stakeholder} className={`w-full ${color} rounded-sm transition-all hover:opacity-80`} style={stryMutAct_9fa48("61219") ? {} : (stryCov_9fa48("61219"), {
                    height: `${stryMutAct_9fa48("61221") ? value / 100 / (selectedChartStakeholder ? 100 : 16) : (stryCov_9fa48("61221"), (stryMutAct_9fa48("61222") ? value * 100 : (stryCov_9fa48("61222"), value / 100)) * (selectedChartStakeholder ? 100 : 16))}%`
                  })} title={`${stakeholder}: ${value}`} />;
                })}
                    </div>
                    <span className="text-xs text-slate-500 mt-2">{month.month}</span>
                  </div>))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              {DEFAULT_STAKEHOLDERS.map(stryMutAct_9fa48("61224") ? () => undefined : (stryCov_9fa48("61224"), s => <span key={s.type} className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded ${(stryMutAct_9fa48("61228") ? s.type !== 'EMPLOYEES' : stryMutAct_9fa48("61227") ? false : stryMutAct_9fa48("61226") ? true : (stryCov_9fa48("61226", "61227", "61228"), s.type === 'EMPLOYEES')) ? 'bg-blue-500' : (stryMutAct_9fa48("61233") ? s.type !== 'CUSTOMERS' : stryMutAct_9fa48("61232") ? false : stryMutAct_9fa48("61231") ? true : (stryCov_9fa48("61231", "61232", "61233"), s.type === 'CUSTOMERS')) ? 'bg-pink-500' : (stryMutAct_9fa48("61238") ? s.type !== 'ENVIRONMENT' : stryMutAct_9fa48("61237") ? false : stryMutAct_9fa48("61236") ? true : (stryCov_9fa48("61236", "61237", "61238"), s.type === 'ENVIRONMENT')) ? 'bg-emerald-500' : (stryMutAct_9fa48("61243") ? s.type !== 'FUTURE_GENERATIONS' : stryMutAct_9fa48("61242") ? false : stryMutAct_9fa48("61241") ? true : (stryCov_9fa48("61241", "61242", "61243"), s.type === 'FUTURE_GENERATIONS')) ? 'bg-purple-500' : (stryMutAct_9fa48("61248") ? s.type !== 'COMMUNITY' : stryMutAct_9fa48("61247") ? false : stryMutAct_9fa48("61246") ? true : (stryCov_9fa48("61246", "61247", "61248"), s.type === 'COMMUNITY')) ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                  {s.name}
                </span>))}
            </div>

            {/* Alerts Section */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <h4 className="font-medium text-amber-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Sentiment Alerts
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">👥 Employees sentiment declining -11 pts over 6 months</span>
                  <span className="text-red-400">Action needed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">🔮 Future Generations veto frequency up 15%</span>
                  <span className="text-amber-400">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};
export default VoxPage;