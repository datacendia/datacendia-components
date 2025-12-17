/**
 * CendiaPanopticon™ - Global Regulation Engine
 * "Every new regulation, absorbed and enforced."
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
import { Shield, AlertTriangle, FileText, TrendingUp, Globe, CheckCircle, XCircle, Clock, X, ExternalLink, Play, FlaskConical, MapPin, Zap, Download, User, Calendar, ChevronRight, Filter } from 'lucide-react';
interface Framework {
  code: string;
  name: string;
  jurisdiction: string;
  category: string;
  description: string;
  requirements: number;
}
interface Regulation {
  id: string;
  framework_code: string;
  framework_name: string;
  jurisdiction: string;
  status: string;
  obligations: any[];
  violations: any[];
}
interface Violation {
  id: string;
  title: string;
  severity: string;
  status: string;
  regulation: {
    framework_code: string;
  };
  owner?: string;
  dueDate?: string;
  progress?: number;
}
interface Dashboard {
  totalFrameworks: number;
  overallComplianceScore: number;
  openViolations: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  upcomingRegulations: number;
  jurisdictions: number;
}
interface RegulatoryRadarEvent {
  id: string;
  title: string;
  framework: string;
  jurisdiction: string;
  window: 'now' | '30' | '60' | '90';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  effectiveDate: string;
  description: string;
}
const DEFAULT_RADAR_EVENTS: RegulatoryRadarEvent[] = stryMutAct_9fa48("59528") ? [] : (stryCov_9fa48("59528"), [stryMutAct_9fa48("59529") ? {} : (stryCov_9fa48("59529"), {
  id: 'dora-enforcement',
  title: 'DORA enforcement begins for financial entities',
  framework: 'DORA',
  jurisdiction: 'EU',
  window: '60',
  impact: 'CRITICAL',
  effectiveDate: 'In ~45 days',
  description: 'Operational resilience requirements become enforceable. High expectations for incident reporting and ICT risk management.'
}), stryMutAct_9fa48("59538") ? {} : (stryCov_9fa48("59538"), {
  id: 'ccpa-amendment',
  title: 'CCPA/CPRA enforcement expansion',
  framework: 'CCPA',
  jurisdiction: 'US-CA',
  window: '90',
  impact: 'HIGH',
  effectiveDate: 'In ~75 days',
  description: 'Broader scope for data subject rights and vendor obligations. Increased enforcement expected for adtech and third parties.'
}), stryMutAct_9fa48("59547") ? {} : (stryCov_9fa48("59547"), {
  id: 'eu-ai-act-phase-2',
  title: 'EU AI Act high-risk obligations phase-in',
  framework: 'EU AI Act',
  jurisdiction: 'EU',
  window: '30',
  impact: 'HIGH',
  effectiveDate: 'In ~30-60 days (phase 2)',
  description: 'High-risk AI systems must align with transparency, human oversight, and robustness requirements. Significant documentation lift.'
}), stryMutAct_9fa48("59556") ? {} : (stryCov_9fa48("59556"), {
  id: 'privacy-guidance-update',
  title: 'Updated supervisory guidance on cross-border transfers',
  framework: 'GDPR',
  jurisdiction: 'EU',
  window: 'now',
  impact: 'MEDIUM',
  effectiveDate: 'Now',
  description: 'Regulators tightening expectations around SCCs and transfer impact assessments. Existing templates may need updates.'
})]);
const DEFAULT_AI_SUMMARY = 'The highest-impact change in the next 90 days is DORA enforcement for EU financial entities. ' + 'If your critical services rely on third-party providers, you should prioritize mapping those dependencies and ' + 'running a focused resilience review now. CCPA/CPRA expansion and the EU AI Act phase-in are close behind, ' + 'particularly for data-rich and AI-heavy business units.';
const DEFAULT_AI_ACTIONS: string[] = stryMutAct_9fa48("59569") ? [] : (stryCov_9fa48("59569"), ['Map your critical third-party services and vendors to understand DORA exposure.', 'Run a focused operational resilience review on incident response and ICT risk controls.', 'Prepare privacy- and AI-heavy business units for CCPA/CPRA expansion and EU AI Act obligations.']);

// Mock compliance score breakdown
const SCORE_BREAKDOWN = stryMutAct_9fa48("59573") ? {} : (stryCov_9fa48("59573"), {
  byFramework: stryMutAct_9fa48("59574") ? [] : (stryCov_9fa48("59574"), [stryMutAct_9fa48("59575") ? {} : (stryCov_9fa48("59575"), {
    code: 'GDPR',
    score: 68,
    controls: 142,
    mapped: 97
  }), stryMutAct_9fa48("59577") ? {} : (stryCov_9fa48("59577"), {
    code: 'HIPAA',
    score: 80,
    controls: 89,
    mapped: 71
  }), stryMutAct_9fa48("59579") ? {} : (stryCov_9fa48("59579"), {
    code: 'SOX',
    score: 71,
    controls: 64,
    mapped: 45
  }), stryMutAct_9fa48("59581") ? {} : (stryCov_9fa48("59581"), {
    code: 'DORA',
    score: 45,
    controls: 112,
    mapped: 50
  }), stryMutAct_9fa48("59583") ? {} : (stryCov_9fa48("59583"), {
    code: 'CCPA',
    score: 82,
    controls: 38,
    mapped: 31
  })]),
  byControlFamily: stryMutAct_9fa48("59585") ? [] : (stryCov_9fa48("59585"), [stryMutAct_9fa48("59586") ? {} : (stryCov_9fa48("59586"), {
    family: 'Access Control',
    score: 78
  }), stryMutAct_9fa48("59588") ? {} : (stryCov_9fa48("59588"), {
    family: 'Logging & Monitoring',
    score: 85
  }), stryMutAct_9fa48("59590") ? {} : (stryCov_9fa48("59590"), {
    family: 'Vendor Risk',
    score: 62
  }), stryMutAct_9fa48("59592") ? {} : (stryCov_9fa48("59592"), {
    family: 'Data Protection',
    score: 74
  }), stryMutAct_9fa48("59594") ? {} : (stryCov_9fa48("59594"), {
    family: 'Incident Response',
    score: 69
  })])
});

// Mock jurisdiction matrix
const JURISDICTION_MATRIX = stryMutAct_9fa48("59596") ? [] : (stryCov_9fa48("59596"), [stryMutAct_9fa48("59597") ? {} : (stryCov_9fa48("59597"), {
  region: 'European Union',
  frameworks: stryMutAct_9fa48("59599") ? [] : (stryCov_9fa48("59599"), ['GDPR', 'DORA', 'EU AI Act']),
  obligations: 245,
  violations: 1
}), stryMutAct_9fa48("59603") ? {} : (stryCov_9fa48("59603"), {
  region: 'United States',
  frameworks: stryMutAct_9fa48("59605") ? [] : (stryCov_9fa48("59605"), ['HIPAA', 'SOX', 'CCPA']),
  obligations: 180,
  violations: 2
}), stryMutAct_9fa48("59609") ? {} : (stryCov_9fa48("59609"), {
  region: 'United Kingdom',
  frameworks: stryMutAct_9fa48("59611") ? [] : (stryCov_9fa48("59611"), ['UK GDPR', 'FCA']),
  obligations: 95,
  violations: 0
}), stryMutAct_9fa48("59614") ? {} : (stryCov_9fa48("59614"), {
  region: 'Canada',
  frameworks: stryMutAct_9fa48("59616") ? [] : (stryCov_9fa48("59616"), ['PIPEDA']),
  obligations: 42,
  violations: 0
}), stryMutAct_9fa48("59618") ? {} : (stryCov_9fa48("59618"), {
  region: 'Australia',
  frameworks: stryMutAct_9fa48("59620") ? [] : (stryCov_9fa48("59620"), ['Privacy Act']),
  obligations: 38,
  violations: 0
}), stryMutAct_9fa48("59622") ? {} : (stryCov_9fa48("59622"), {
  region: 'Singapore',
  frameworks: stryMutAct_9fa48("59624") ? [] : (stryCov_9fa48("59624"), ['PDPA']),
  obligations: 35,
  violations: 0
})]);

// Helper for dynamic date generation
const getFutureDate = (daysFromNow: number): string => {
  const date = new Date(stryMutAct_9fa48("59627") ? Date.now() - daysFromNow * 24 * 60 * 60 * 1000 : (stryCov_9fa48("59627"), Date.now() + (stryMutAct_9fa48("59628") ? daysFromNow * 24 * 60 * 60 / 1000 : (stryCov_9fa48("59628"), (stryMutAct_9fa48("59629") ? daysFromNow * 24 * 60 / 60 : (stryCov_9fa48("59629"), (stryMutAct_9fa48("59630") ? daysFromNow * 24 / 60 : (stryCov_9fa48("59630"), (stryMutAct_9fa48("59631") ? daysFromNow / 24 : (stryCov_9fa48("59631"), daysFromNow * 24)) * 60)) * 60)) * 1000))));
  return date.toISOString().split('T')[0];
};
const currentYear = new Date().getFullYear();

// Dynamic violation details (dates relative to current time)
const VIOLATION_DETAILS: Record<string, any> = stryMutAct_9fa48("59633") ? {} : (stryCov_9fa48("59633"), {
  'v1': stryMutAct_9fa48("59634") ? {} : (stryCov_9fa48("59634"), {
    id: 'v1',
    title: 'Missing data retention policy enforcement',
    severity: 'HIGH',
    framework: 'GDPR',
    description: 'Article 5(1)(e) requires storage limitation. Current systems retain personal data beyond declared periods.',
    owner: 'Data Protection Officer',
    dueDate: getFutureDate(30),
    linkedDecisions: stryMutAct_9fa48("59641") ? [] : (stryCov_9fa48("59641"), [`DEC-${stryMutAct_9fa48("59643") ? currentYear + 1 : (stryCov_9fa48("59643"), currentYear - 1)}-089: Data Retention Review`]),
    mitigationWorkflow: `WF-${currentYear}-012`
  }),
  'v2': stryMutAct_9fa48("59645") ? {} : (stryCov_9fa48("59645"), {
    id: 'v2',
    title: 'Incomplete vendor risk assessment',
    severity: 'MEDIUM',
    framework: 'DORA',
    description: 'ICT third-party risk assessment not completed for 3 critical vendors.',
    owner: 'Vendor Risk Manager',
    dueDate: getFutureDate(14),
    linkedDecisions: stryMutAct_9fa48("59652") ? ["Stryker was here"] : (stryCov_9fa48("59652"), []),
    mitigationWorkflow: null
  })
});
export const PanopticonPage: React.FC = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>(stryMutAct_9fa48("59654") ? ["Stryker was here"] : (stryCov_9fa48("59654"), []));
  const [regulations, setRegulations] = useState<Regulation[]>(stryMutAct_9fa48("59655") ? ["Stryker was here"] : (stryCov_9fa48("59655"), []));
  const [violations, setViolations] = useState<Violation[]>(stryMutAct_9fa48("59656") ? ["Stryker was here"] : (stryCov_9fa48("59656"), []));
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("59657") ? false : (stryCov_9fa48("59657"), true));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isIngesting, setIsIngesting] = useState(stryMutAct_9fa48("59659") ? true : (stryCov_9fa48("59659"), false));
  const [radarEvents, setRadarEvents] = useState<RegulatoryRadarEvent[]>(DEFAULT_RADAR_EVENTS);
  const [aiSummary, setAiSummary] = useState<string>(DEFAULT_AI_SUMMARY);

  // Panel/Modal states
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(stryMutAct_9fa48("59660") ? true : (stryCov_9fa48("59660"), false));
  const [showJurisdictionMatrix, setShowJurisdictionMatrix] = useState(stryMutAct_9fa48("59661") ? true : (stryCov_9fa48("59661"), false));
  const [selectedRadarEvent, setSelectedRadarEvent] = useState<RegulatoryRadarEvent | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<string | null>(null);
  const [aiActions, setAiActions] = useState<string[]>(DEFAULT_AI_ACTIONS);
  const [perspective, setPerspective] = useState<'board' | 'operator'>('board');
  const [showAiRationale, setShowAiRationale] = useState(stryMutAct_9fa48("59663") ? true : (stryCov_9fa48("59663"), false));

  // New state for violation workflow and exports
  const [showViolationWorkflow, setShowViolationWorkflow] = useState(stryMutAct_9fa48("59664") ? true : (stryCov_9fa48("59664"), false));
  const [violationFilter, setViolationFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showExportModal, setShowExportModal] = useState(stryMutAct_9fa48("59666") ? true : (stryCov_9fa48("59666"), false));
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("59668") ? ["Stryker was here"] : (stryCov_9fa48("59668"), []));
  useEffect(() => {
    // Persist user preference for perspective
    if (stryMutAct_9fa48("59672") ? typeof window === 'undefined' : stryMutAct_9fa48("59671") ? false : stryMutAct_9fa48("59670") ? true : (stryCov_9fa48("59670", "59671", "59672"), typeof window !== 'undefined')) {
      try {
        window.localStorage.setItem('dc_panopticon_perspective', perspective);
      } catch {
        // ignore storage errors
      }
    }
    loadRadarInsights(perspective);
  }, stryMutAct_9fa48("59677") ? [] : (stryCov_9fa48("59677"), [perspective]));
  useEffect(() => {
    if (stryMutAct_9fa48("59681") ? typeof window !== 'undefined' : stryMutAct_9fa48("59680") ? false : stryMutAct_9fa48("59679") ? true : (stryCov_9fa48("59679", "59680", "59681"), typeof window === 'undefined')) {
      return;
    }
    try {
      const stored = window.localStorage.getItem('dc_panopticon_perspective');
      if (stryMutAct_9fa48("59688") ? stored === 'board' && stored === 'operator' : stryMutAct_9fa48("59687") ? false : stryMutAct_9fa48("59686") ? true : (stryCov_9fa48("59686", "59687", "59688"), (stryMutAct_9fa48("59690") ? stored !== 'board' : stryMutAct_9fa48("59689") ? false : (stryCov_9fa48("59689", "59690"), stored === 'board')) || (stryMutAct_9fa48("59693") ? stored !== 'operator' : stryMutAct_9fa48("59692") ? false : (stryCov_9fa48("59692", "59693"), stored === 'operator')))) {
        setPerspective(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, stryMutAct_9fa48("59696") ? ["Stryker was here"] : (stryCov_9fa48("59696"), []));
  const loadData = async () => {
    try {
      const [fwRes, regRes, violRes, dashRes] = await Promise.all(stryMutAct_9fa48("59699") ? [] : (stryCov_9fa48("59699"), [apiClient.api.get<{
        data: Framework[];
      }>('/panopticon/frameworks'), apiClient.api.get<{
        data: Regulation[];
      }>('/panopticon/regulations'), apiClient.api.get<{
        data: Violation[];
      }>('/panopticon/violations'), apiClient.api.get<{
        data: Dashboard;
      }>('/panopticon/dashboard')]));
      if (stryMutAct_9fa48("59705") ? false : stryMutAct_9fa48("59704") ? true : (stryCov_9fa48("59704", "59705"), fwRes.success)) {
        setFrameworks(stryMutAct_9fa48("59709") ? ((fwRes.data as any)?.data || fwRes.data) && [] : stryMutAct_9fa48("59708") ? false : stryMutAct_9fa48("59707") ? true : (stryCov_9fa48("59707", "59708", "59709"), (stryMutAct_9fa48("59711") ? (fwRes.data as any)?.data && fwRes.data : stryMutAct_9fa48("59710") ? false : (stryCov_9fa48("59710", "59711"), (stryMutAct_9fa48("59712") ? (fwRes.data as any).data : (stryCov_9fa48("59712"), (fwRes.data as any)?.data)) || fwRes.data)) || (stryMutAct_9fa48("59713") ? ["Stryker was here"] : (stryCov_9fa48("59713"), []))));
      }
      if (stryMutAct_9fa48("59715") ? false : stryMutAct_9fa48("59714") ? true : (stryCov_9fa48("59714", "59715"), regRes.success)) {
        setRegulations(stryMutAct_9fa48("59719") ? ((regRes.data as any)?.data || regRes.data) && [] : stryMutAct_9fa48("59718") ? false : stryMutAct_9fa48("59717") ? true : (stryCov_9fa48("59717", "59718", "59719"), (stryMutAct_9fa48("59721") ? (regRes.data as any)?.data && regRes.data : stryMutAct_9fa48("59720") ? false : (stryCov_9fa48("59720", "59721"), (stryMutAct_9fa48("59722") ? (regRes.data as any).data : (stryCov_9fa48("59722"), (regRes.data as any)?.data)) || regRes.data)) || (stryMutAct_9fa48("59723") ? ["Stryker was here"] : (stryCov_9fa48("59723"), []))));
      }
      if (stryMutAct_9fa48("59725") ? false : stryMutAct_9fa48("59724") ? true : (stryCov_9fa48("59724", "59725"), violRes.success)) {
        setViolations(stryMutAct_9fa48("59729") ? ((violRes.data as any)?.data || violRes.data) && [] : stryMutAct_9fa48("59728") ? false : stryMutAct_9fa48("59727") ? true : (stryCov_9fa48("59727", "59728", "59729"), (stryMutAct_9fa48("59731") ? (violRes.data as any)?.data && violRes.data : stryMutAct_9fa48("59730") ? false : (stryCov_9fa48("59730", "59731"), (stryMutAct_9fa48("59732") ? (violRes.data as any).data : (stryCov_9fa48("59732"), (violRes.data as any)?.data)) || violRes.data)) || (stryMutAct_9fa48("59733") ? ["Stryker was here"] : (stryCov_9fa48("59733"), []))));
      }
      if (stryMutAct_9fa48("59735") ? false : stryMutAct_9fa48("59734") ? true : (stryCov_9fa48("59734", "59735"), dashRes.success)) {
        setDashboard(stryMutAct_9fa48("59739") ? ((dashRes.data as any)?.data || dashRes.data) && null : stryMutAct_9fa48("59738") ? false : stryMutAct_9fa48("59737") ? true : (stryCov_9fa48("59737", "59738", "59739"), (stryMutAct_9fa48("59741") ? (dashRes.data as any)?.data && dashRes.data : stryMutAct_9fa48("59740") ? false : (stryCov_9fa48("59740", "59741"), (stryMutAct_9fa48("59742") ? (dashRes.data as any).data : (stryCov_9fa48("59742"), (dashRes.data as any)?.data)) || dashRes.data)) || null));
      }
    } catch (error) {
      console.error('Failed to load Panopticon data:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("59746") ? true : (stryCov_9fa48("59746"), false));
    }
  };
  const loadRadarInsights = async (view: 'board' | 'operator') => {
    try {
      const res = await apiClient.api.get<{
        data?: {
          events?: RegulatoryRadarEvent[];
          summary?: string;
          actions?: string[];
        } | RegulatoryRadarEvent[];
      }>('/panopticon/radar', stryMutAct_9fa48("59750") ? {} : (stryCov_9fa48("59750"), {
        perspective: view
      }));
      if (stryMutAct_9fa48("59753") ? res.success || res.data : stryMutAct_9fa48("59752") ? false : stryMutAct_9fa48("59751") ? true : (stryCov_9fa48("59751", "59752", "59753"), res.success && res.data)) {
        const payload = ((res.data as any).data ?? res.data) as RegulatoryRadarEvent[] | {
          events?: RegulatoryRadarEvent[];
          summary?: string;
          actions?: string[];
        };
        if (stryMutAct_9fa48("59756") ? false : stryMutAct_9fa48("59755") ? true : (stryCov_9fa48("59755", "59756"), Array.isArray(payload))) {
          setRadarEvents(payload);
        } else if (stryMutAct_9fa48("59760") ? payload || Array.isArray(payload.events) : stryMutAct_9fa48("59759") ? false : stryMutAct_9fa48("59758") ? true : (stryCov_9fa48("59758", "59759", "59760"), payload && Array.isArray(payload.events))) {
          setRadarEvents(payload.events);
          if (stryMutAct_9fa48("59764") ? typeof payload.summary !== 'string' : stryMutAct_9fa48("59763") ? false : stryMutAct_9fa48("59762") ? true : (stryCov_9fa48("59762", "59763", "59764"), typeof payload.summary === 'string')) {
            setAiSummary(payload.summary);
          }
          if (stryMutAct_9fa48("59768") ? false : stryMutAct_9fa48("59767") ? true : (stryCov_9fa48("59767", "59768"), Array.isArray(payload.actions))) {
            setAiActions(payload.actions);
          }
        }
      }
    } catch {}
  };
  const ingestRegulation = async (code: string) => {
    setIsIngesting(stryMutAct_9fa48("59771") ? false : (stryCov_9fa48("59771"), true));
    try {
      await apiClient.api.post('/panopticon/regulations/ingest', stryMutAct_9fa48("59774") ? {} : (stryCov_9fa48("59774"), {
        frameworkCode: code
      }));
      await loadData();
    } catch (error) {
      console.error('Ingest failed:', error);
    } finally {
      setIsIngesting(stryMutAct_9fa48("59778") ? true : (stryCov_9fa48("59778"), false));
    }
  };
  const categories = stryMutAct_9fa48("59779") ? [] : (stryCov_9fa48("59779"), [...new Set(frameworks.map(stryMutAct_9fa48("59780") ? () => undefined : (stryCov_9fa48("59780"), f => f.category)))]);
  const filteredFrameworks = (stryMutAct_9fa48("59783") ? selectedCategory !== 'all' : stryMutAct_9fa48("59782") ? false : stryMutAct_9fa48("59781") ? true : (stryCov_9fa48("59781", "59782", "59783"), selectedCategory === 'all')) ? frameworks : stryMutAct_9fa48("59785") ? frameworks : (stryCov_9fa48("59785"), frameworks.filter(stryMutAct_9fa48("59786") ? () => undefined : (stryCov_9fa48("59786"), f => stryMutAct_9fa48("59789") ? f.category !== selectedCategory : stryMutAct_9fa48("59788") ? false : stryMutAct_9fa48("59787") ? true : (stryCov_9fa48("59787", "59788", "59789"), f.category === selectedCategory))));
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        if (stryMutAct_9fa48("59791")) {} else {
          stryCov_9fa48("59791");
          return 'bg-red-500';
        }
      case 'HIGH':
        if (stryMutAct_9fa48("59794")) {} else {
          stryCov_9fa48("59794");
          return 'bg-orange-500';
        }
      case 'MEDIUM':
        if (stryMutAct_9fa48("59797")) {} else {
          stryCov_9fa48("59797");
          return 'bg-yellow-500';
        }
      default:
        if (stryMutAct_9fa48("59800")) {} else {
          stryCov_9fa48("59800");
          return 'bg-blue-500';
        }
    }
  };
  const getImpactBadgeClasses = (impact: string) => {
    switch (impact) {
      case 'CRITICAL':
        if (stryMutAct_9fa48("59803")) {} else {
          stryCov_9fa48("59803");
          return 'bg-red-500/20 text-red-300 border border-red-500/40';
        }
      case 'HIGH':
        if (stryMutAct_9fa48("59806")) {} else {
          stryCov_9fa48("59806");
          return 'bg-orange-500/20 text-orange-200 border border-orange-500/40';
        }
      case 'MEDIUM':
        if (stryMutAct_9fa48("59809")) {} else {
          stryCov_9fa48("59809");
          return 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40';
        }
      default:
        if (stryMutAct_9fa48("59812")) {} else {
          stryCov_9fa48("59812");
          return 'bg-slate-600/40 text-slate-200 border border-slate-500/40';
        }
    }
  };
  if (stryMutAct_9fa48("59815") ? false : stryMutAct_9fa48("59814") ? true : (stryCov_9fa48("59814", "59815"), isLoading)) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Panopticon...</div>
      </div>;
  }
  return <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaPanopticon™</h1>
              <p className="text-slate-400">Global Regulation Engine - "Every new regulation, absorbed and enforced."</p>
            </div>
          </div>
          <button onClick={stryMutAct_9fa48("59817") ? () => undefined : (stryCov_9fa48("59817"), () => setShowExportModal(stryMutAct_9fa48("59818") ? false : (stryCov_9fa48("59818"), true)))} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Reports
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      {stryMutAct_9fa48("59821") ? dashboard || <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {/* Compliance Score - Clickable with tooltip */}
          <button onClick={() => setShowScoreBreakdown(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all text-left group relative">
            <div className="text-slate-400 text-sm flex items-center gap-1">
              Compliance Score
              <span className="text-slate-600 text-xs cursor-help">ⓘ</span>
              <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10 border border-slate-700">
                Weighted coverage of obligations across all active frameworks:<br />
                • 0–49%: High exposure<br />
                • 50–79%: Partial coverage<br />
                • 80%+: Strong compliance
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-bold text-emerald-400">
                {dashboard.overallComplianceScore}%
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-300">
                <TrendingUp className="w-4 h-4" />
                <span>+3%</span>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400" style={{
            width: `${Math.min(100, Math.max(0, dashboard.overallComplianceScore))}%`
          }} />
            </div>
            <div className="text-xs text-emerald-400/60 mt-2">View score breakdown →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Active Frameworks</div>
            <div className="text-3xl font-bold">{regulations.length}</div>
          </div>
          <button onClick={() => setShowViolationWorkflow(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="text-slate-400 text-sm">Open Violations</div>
            <div className={`text-3xl font-bold ${dashboard.openViolations.total > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {dashboard.openViolations.total === 0 ? '0 ✅' : dashboard.openViolations.total}
            </div>
            <div className="text-xs text-red-400/60 mt-2">Manage workflow →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Critical</div>
            <div className="text-3xl font-bold text-red-500">{dashboard.openViolations.critical}</div>
          </div>
          {/* Jurisdictions - Clickable */}
          <button onClick={() => setShowJurisdictionMatrix(true)} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="text-slate-400 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Jurisdictions
            </div>
            <div className="text-3xl font-bold text-blue-400">{dashboard.jurisdictions}</div>
            <div className="text-xs text-blue-400/60 mt-2">View exposure matrix →</div>
          </button>
        </div> : stryMutAct_9fa48("59820") ? false : stryMutAct_9fa48("59819") ? true : (stryCov_9fa48("59819", "59820", "59821"), dashboard && <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {/* Compliance Score - Clickable with tooltip */}
          <button onClick={stryMutAct_9fa48("59822") ? () => undefined : (stryCov_9fa48("59822"), () => setShowScoreBreakdown(stryMutAct_9fa48("59823") ? false : (stryCov_9fa48("59823"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all text-left group relative">
            <div className="text-slate-400 text-sm flex items-center gap-1">
              Compliance Score
              <span className="text-slate-600 text-xs cursor-help">ⓘ</span>
              <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10 border border-slate-700">
                Weighted coverage of obligations across all active frameworks:<br />
                • 0–49%: High exposure<br />
                • 50–79%: Partial coverage<br />
                • 80%+: Strong compliance
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-bold text-emerald-400">
                {dashboard.overallComplianceScore}%
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-300">
                <TrendingUp className="w-4 h-4" />
                <span>+3%</span>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400" style={stryMutAct_9fa48("59824") ? {} : (stryCov_9fa48("59824"), {
            width: `${stryMutAct_9fa48("59826") ? Math.max(100, Math.max(0, dashboard.overallComplianceScore)) : (stryCov_9fa48("59826"), Math.min(100, stryMutAct_9fa48("59827") ? Math.min(0, dashboard.overallComplianceScore) : (stryCov_9fa48("59827"), Math.max(0, dashboard.overallComplianceScore))))}%`
          })} />
            </div>
            <div className="text-xs text-emerald-400/60 mt-2">View score breakdown →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Active Frameworks</div>
            <div className="text-3xl font-bold">{regulations.length}</div>
          </div>
          <button onClick={stryMutAct_9fa48("59828") ? () => undefined : (stryCov_9fa48("59828"), () => setShowViolationWorkflow(stryMutAct_9fa48("59829") ? false : (stryCov_9fa48("59829"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="text-slate-400 text-sm">Open Violations</div>
            <div className={`text-3xl font-bold ${(stryMutAct_9fa48("59834") ? dashboard.openViolations.total <= 0 : stryMutAct_9fa48("59833") ? dashboard.openViolations.total >= 0 : stryMutAct_9fa48("59832") ? false : stryMutAct_9fa48("59831") ? true : (stryCov_9fa48("59831", "59832", "59833", "59834"), dashboard.openViolations.total > 0)) ? 'text-red-400' : 'text-emerald-400'}`}>
              {(stryMutAct_9fa48("59839") ? dashboard.openViolations.total !== 0 : stryMutAct_9fa48("59838") ? false : stryMutAct_9fa48("59837") ? true : (stryCov_9fa48("59837", "59838", "59839"), dashboard.openViolations.total === 0)) ? '0 ✅' : dashboard.openViolations.total}
            </div>
            <div className="text-xs text-red-400/60 mt-2">Manage workflow →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Critical</div>
            <div className="text-3xl font-bold text-red-500">{dashboard.openViolations.critical}</div>
          </div>
          {/* Jurisdictions - Clickable */}
          <button onClick={stryMutAct_9fa48("59841") ? () => undefined : (stryCov_9fa48("59841"), () => setShowJurisdictionMatrix(stryMutAct_9fa48("59842") ? false : (stryCov_9fa48("59842"), true)))} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all text-left">
            <div className="text-slate-400 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Jurisdictions
            </div>
            <div className="text-3xl font-bold text-blue-400">{dashboard.jurisdictions}</div>
            <div className="text-xs text-blue-400/60 mt-2">View exposure matrix →</div>
          </button>
        </div>)}

      {stryMutAct_9fa48("59845") ? radarEvents.length > 0 || <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Regulatory Radar (Next 90 Days)</span>
              </h2>
            </div>
            <div className="relative pt-4">
              <div className="h-0.5 bg-slate-700 rounded-full" />
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Now</span>
                <span>30 days</span>
                <span>60 days</span>
                <span>90 days</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {['now', '30', '60', '90'].map(window => <div key={window} className="space-y-3">
                    {radarEvents.filter(event => event.window === window).map(event => <button key={event.id} onClick={() => setSelectedRadarEvent(event)} className="p-3 bg-slate-700/60 rounded-lg border border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700 transition-all text-left w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-emerald-300">
                              {event.framework}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getImpactBadgeClasses(event.impact)}`}>
                              {event.impact}
                            </span>
                          </div>
                          <div className={`text-slate-200 ${event.impact === 'CRITICAL' ? 'text-sm font-semibold' : 'text-xs'}`}>
                            {event.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {event.effectiveDate} · {event.jurisdiction}
                          </div>
                          <div className="text-[10px] text-emerald-400/60 mt-1">Click for details →</div>
                        </button>)}
                  </div>)}
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold">AI Assessment</h2>
              </div>
              <select value={perspective} onChange={e => setPerspective(e.target.value as 'board' | 'operator')} className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200">
                <option value="board">Board view</option>
                <option value="operator">Operator view</option>
              </select>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-line">
              {aiSummary}
            </p>
            {aiActions.length > 0 && <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Recommended actions
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                  {aiActions.map((action, index) => <li key={index}>{action}</li>)}
                </ul>
              </div>}
            
            {/* Confidence & Transparency */}
            <div className="mt-4 pt-3 border-t border-slate-700">
              <button onClick={() => setShowAiRationale(!showAiRationale)} className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">87% Confidence</span>
                  <span>Last updated: 2 hours ago</span>
                </span>
                <span>{showAiRationale ? '▲' : '▼'} Why this assessment?</span>
              </button>
              {showAiRationale && <div className="mt-3 p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300 space-y-2">
                  <p><strong>Data sources:</strong> EU Official Journal, regulatory feeds, 14 vendor advisories</p>
                  <p><strong>Analysis method:</strong> Cross-referenced against your control framework mapping</p>
                  <p><strong>Confidence factors:</strong> High source reliability (+), recent regulatory guidance (+), limited internal data on DORA (-)</p>
                </div>}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <button onClick={() => window.open('/cortex/intelligence/council?briefing=regulatory-q4-2025', '_blank')} className="w-full px-3 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Play className="w-4 h-4" />
                Create Council Briefing
              </button>
              <button onClick={() => window.open('/cortex/intelligence/crucible?preset=regulatory-resilience', '_blank')} className="w-full px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <FlaskConical className="w-4 h-4" />
                Launch Crucible Stress Test
              </button>
            </div>
            <div className="mt-3 text-[10px] text-slate-500">
              This assessment is logged in Decision DNA as "Regulatory Risk Review – Q4 2025"
            </div>
          </div>
        </div> : stryMutAct_9fa48("59844") ? false : stryMutAct_9fa48("59843") ? true : (stryCov_9fa48("59843", "59844", "59845"), (stryMutAct_9fa48("59848") ? radarEvents.length <= 0 : stryMutAct_9fa48("59847") ? radarEvents.length >= 0 : stryMutAct_9fa48("59846") ? true : (stryCov_9fa48("59846", "59847", "59848"), radarEvents.length > 0)) && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Regulatory Radar (Next 90 Days)</span>
              </h2>
            </div>
            <div className="relative pt-4">
              <div className="h-0.5 bg-slate-700 rounded-full" />
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>Now</span>
                <span>30 days</span>
                <span>60 days</span>
                <span>90 days</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {(stryMutAct_9fa48("59849") ? [] : (stryCov_9fa48("59849"), ['now', '30', '60', '90'])).map(stryMutAct_9fa48("59854") ? () => undefined : (stryCov_9fa48("59854"), window => <div key={window} className="space-y-3">
                    {stryMutAct_9fa48("59855") ? radarEvents.map(event => <button key={event.id} onClick={() => setSelectedRadarEvent(event)} className="p-3 bg-slate-700/60 rounded-lg border border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700 transition-all text-left w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-emerald-300">
                              {event.framework}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getImpactBadgeClasses(event.impact)}`}>
                              {event.impact}
                            </span>
                          </div>
                          <div className={`text-slate-200 ${event.impact === 'CRITICAL' ? 'text-sm font-semibold' : 'text-xs'}`}>
                            {event.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {event.effectiveDate} · {event.jurisdiction}
                          </div>
                          <div className="text-[10px] text-emerald-400/60 mt-1">Click for details →</div>
                        </button>) : (stryCov_9fa48("59855"), radarEvents.filter(stryMutAct_9fa48("59856") ? () => undefined : (stryCov_9fa48("59856"), event => stryMutAct_9fa48("59859") ? event.window !== window : stryMutAct_9fa48("59858") ? false : stryMutAct_9fa48("59857") ? true : (stryCov_9fa48("59857", "59858", "59859"), event.window === window))).map(stryMutAct_9fa48("59860") ? () => undefined : (stryCov_9fa48("59860"), event => <button key={event.id} onClick={stryMutAct_9fa48("59861") ? () => undefined : (stryCov_9fa48("59861"), () => setSelectedRadarEvent(event))} className="p-3 bg-slate-700/60 rounded-lg border border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700 transition-all text-left w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-emerald-300">
                              {event.framework}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getImpactBadgeClasses(event.impact)}`}>
                              {event.impact}
                            </span>
                          </div>
                          <div className={`text-slate-200 ${(stryMutAct_9fa48("59866") ? event.impact !== 'CRITICAL' : stryMutAct_9fa48("59865") ? false : stryMutAct_9fa48("59864") ? true : (stryCov_9fa48("59864", "59865", "59866"), event.impact === 'CRITICAL')) ? 'text-sm font-semibold' : 'text-xs'}`}>
                            {event.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {event.effectiveDate} · {event.jurisdiction}
                          </div>
                          <div className="text-[10px] text-emerald-400/60 mt-1">Click for details →</div>
                        </button>)))}
                  </div>))}
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold">AI Assessment</h2>
              </div>
              <select value={perspective} onChange={stryMutAct_9fa48("59870") ? () => undefined : (stryCov_9fa48("59870"), e => setPerspective(e.target.value as 'board' | 'operator'))} className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200">
                <option value="board">Board view</option>
                <option value="operator">Operator view</option>
              </select>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-line">
              {aiSummary}
            </p>
            {stryMutAct_9fa48("59873") ? aiActions.length > 0 || <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Recommended actions
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                  {aiActions.map((action, index) => <li key={index}>{action}</li>)}
                </ul>
              </div> : stryMutAct_9fa48("59872") ? false : stryMutAct_9fa48("59871") ? true : (stryCov_9fa48("59871", "59872", "59873"), (stryMutAct_9fa48("59876") ? aiActions.length <= 0 : stryMutAct_9fa48("59875") ? aiActions.length >= 0 : stryMutAct_9fa48("59874") ? true : (stryCov_9fa48("59874", "59875", "59876"), aiActions.length > 0)) && <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Recommended actions
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                  {aiActions.map(stryMutAct_9fa48("59877") ? () => undefined : (stryCov_9fa48("59877"), (action, index) => <li key={index}>{action}</li>))}
                </ul>
              </div>)}
            
            {/* Confidence & Transparency */}
            <div className="mt-4 pt-3 border-t border-slate-700">
              <button onClick={stryMutAct_9fa48("59878") ? () => undefined : (stryCov_9fa48("59878"), () => setShowAiRationale(stryMutAct_9fa48("59879") ? showAiRationale : (stryCov_9fa48("59879"), !showAiRationale)))} className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">87% Confidence</span>
                  <span>Last updated: 2 hours ago</span>
                </span>
                <span>{showAiRationale ? '▲' : '▼'} Why this assessment?</span>
              </button>
              {stryMutAct_9fa48("59884") ? showAiRationale || <div className="mt-3 p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300 space-y-2">
                  <p><strong>Data sources:</strong> EU Official Journal, regulatory feeds, 14 vendor advisories</p>
                  <p><strong>Analysis method:</strong> Cross-referenced against your control framework mapping</p>
                  <p><strong>Confidence factors:</strong> High source reliability (+), recent regulatory guidance (+), limited internal data on DORA (-)</p>
                </div> : stryMutAct_9fa48("59883") ? false : stryMutAct_9fa48("59882") ? true : (stryCov_9fa48("59882", "59883", "59884"), showAiRationale && <div className="mt-3 p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300 space-y-2">
                  <p><strong>Data sources:</strong> EU Official Journal, regulatory feeds, 14 vendor advisories</p>
                  <p><strong>Analysis method:</strong> Cross-referenced against your control framework mapping</p>
                  <p><strong>Confidence factors:</strong> High source reliability (+), recent regulatory guidance (+), limited internal data on DORA (-)</p>
                </div>)}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <button onClick={stryMutAct_9fa48("59885") ? () => undefined : (stryCov_9fa48("59885"), () => window.open('/cortex/intelligence/council?briefing=regulatory-q4-2025', '_blank'))} className="w-full px-3 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Play className="w-4 h-4" />
                Create Council Briefing
              </button>
              <button onClick={stryMutAct_9fa48("59888") ? () => undefined : (stryCov_9fa48("59888"), () => window.open('/cortex/intelligence/crucible?preset=regulatory-resilience', '_blank'))} className="w-full px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <FlaskConical className="w-4 h-4" />
                Launch Crucible Stress Test
              </button>
            </div>
            <div className="mt-3 text-[10px] text-slate-500">
              This assessment is logged in Decision DNA as "Regulatory Risk Review – Q4 2025"
            </div>
          </div>
        </div>)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework Library */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Regulatory Frameworks ({frameworks.length})
            </h2>
            <select value={selectedCategory} onChange={stryMutAct_9fa48("59891") ? () => undefined : (stryCov_9fa48("59891"), e => setSelectedCategory(e.target.value))} className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm">
              <option value="all">All Categories</option>
              {categories.map(stryMutAct_9fa48("59892") ? () => undefined : (stryCov_9fa48("59892"), cat => <option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFrameworks.map(fw => {
            const regulation = regulations.find(stryMutAct_9fa48("59894") ? () => undefined : (stryCov_9fa48("59894"), r => stryMutAct_9fa48("59897") ? r.framework_code !== fw.code : stryMutAct_9fa48("59896") ? false : stryMutAct_9fa48("59895") ? true : (stryCov_9fa48("59895", "59896", "59897"), r.framework_code === fw.code)));
            const isActive = stryMutAct_9fa48("59900") ? regulation?.status !== 'ACTIVE' : stryMutAct_9fa48("59899") ? false : stryMutAct_9fa48("59898") ? true : (stryCov_9fa48("59898", "59899", "59900"), (stryMutAct_9fa48("59901") ? regulation.status : (stryCov_9fa48("59901"), regulation?.status)) === 'ACTIVE');
            const isIngested = stryMutAct_9fa48("59903") ? !regulation : (stryCov_9fa48("59903"), !(stryMutAct_9fa48("59904") ? regulation : (stryCov_9fa48("59904"), !regulation)));

            // Determine status and button
            let statusBadge;
            let actionButton;
            if (stryMutAct_9fa48("59906") ? false : stryMutAct_9fa48("59905") ? true : (stryCov_9fa48("59905", "59906"), isActive)) {
              statusBadge = <span className="flex items-center gap-1 text-emerald-400 text-xs px-2 py-0.5 bg-emerald-900/50 rounded" title="Controls have been mapped; included in Compliance Score.">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>;
              actionButton = <button className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm">
                    View Controls
                  </button>;
            } else if (stryMutAct_9fa48("59909") ? false : stryMutAct_9fa48("59908") ? true : (stryCov_9fa48("59908", "59909"), isIngested)) {
              statusBadge = <span className="flex items-center gap-1 text-amber-400 text-xs px-2 py-0.5 bg-amber-900/50 rounded">
                    <Clock className="w-3 h-3" /> Ingested
                  </span>;
              actionButton = <button className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded text-sm">
                    Map Controls
                  </button>;
            } else {
              statusBadge = <span className="text-xs text-slate-500">Not loaded</span>;
              actionButton = <button onClick={stryMutAct_9fa48("59912") ? () => undefined : (stryCov_9fa48("59912"), () => ingestRegulation(fw.code))} disabled={isIngesting} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm disabled:opacity-50 group relative" title="Pull full requirement set into Datacendia for mapping.">
                    {isIngesting ? 'Ingesting...' : 'Ingest'}
                  </button>;
            }
            return <div key={fw.code} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{fw.code}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{fw.jurisdiction}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">{fw.category}</span>
                      {statusBadge}
                    </div>
                    <div className="text-sm text-slate-400">{fw.name}</div>
                    <div className="text-xs text-slate-500">{fw.requirements} requirements</div>
                  </div>
                  {actionButton}
                </div>;
          })}
          </div>
        </div>

        {/* Violations Panel */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>Open Violations ({violations.length})</span>
            </h2>
            <button className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-700">
              + New
            </button>
          </div>
          {(stryMutAct_9fa48("59917") ? violations.length !== 0 : stryMutAct_9fa48("59916") ? false : stryMutAct_9fa48("59915") ? true : (stryCov_9fa48("59915", "59916", "59917"), violations.length === 0)) ? <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
              No open violations
            </div> : <div className="space-y-3 max-h-80 overflow-y-auto">
              {violations.map(stryMutAct_9fa48("59918") ? () => undefined : (stryCov_9fa48("59918"), v => <button key={v.id} onClick={stryMutAct_9fa48("59919") ? () => undefined : (stryCov_9fa48("59919"), () => setSelectedViolation(v.id))} className="w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 hover:border-red-500/30 border border-transparent transition-all text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getSeverityColor(v.severity)}`} />
                    <span className="text-sm font-medium">{v.title}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {stryMutAct_9fa48("59921") ? v.regulation.framework_code : (stryCov_9fa48("59921"), v.regulation?.framework_code)} • {v.status}
                  </div>
                  <div className="text-[10px] text-red-400/60 mt-1">Click for details & actions →</div>
                </button>))}
            </div>}
        </div>
      </div>

      {/* Active Regulations */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-400" />
          Active Regulations
        </h2>
        {(stryMutAct_9fa48("59924") ? regulations.length !== 0 : stryMutAct_9fa48("59923") ? false : stryMutAct_9fa48("59922") ? true : (stryCov_9fa48("59922", "59923", "59924"), regulations.length === 0)) ? <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Frameworks</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Get started by loading sample frameworks or ingesting your own regulatory requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => {
            // Demo mode: load sample frameworks
            (stryMutAct_9fa48("59926") ? [] : (stryCov_9fa48("59926"), ['GDPR', 'SOX', 'HIPAA', 'CCPA'])).forEach(stryMutAct_9fa48("59931") ? () => undefined : (stryCov_9fa48("59931"), code => ingestRegulation(code)));
          }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" /> Load Sample Frameworks
              </button>
              <button onClick={stryMutAct_9fa48("59932") ? () => undefined : (stryCov_9fa48("59932"), () => window.scrollTo(stryMutAct_9fa48("59933") ? {} : (stryCov_9fa48("59933"), {
            top: 0,
            behavior: 'smooth'
          })))} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
                Browse Framework Library ↑
              </button>
            </div>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulations.map(stryMutAct_9fa48("59935") ? () => undefined : (stryCov_9fa48("59935"), reg => <div key={reg.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-emerald-400">{reg.framework_code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("59939") ? reg.status !== 'ACTIVE' : stryMutAct_9fa48("59938") ? false : stryMutAct_9fa48("59937") ? true : (stryCov_9fa48("59937", "59938", "59939"), reg.status === 'ACTIVE')) ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-600'}`}>
                    {reg.status}
                  </span>
                </div>
                <div className="text-sm text-slate-300">{reg.framework_name}</div>
                <div className="text-xs text-slate-500 mt-1">{reg.jurisdiction}</div>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                  <span>{stryMutAct_9fa48("59945") ? reg.obligations?.length && 0 : stryMutAct_9fa48("59944") ? false : stryMutAct_9fa48("59943") ? true : (stryCov_9fa48("59943", "59944", "59945"), (stryMutAct_9fa48("59946") ? reg.obligations.length : (stryCov_9fa48("59946"), reg.obligations?.length)) || 0)} obligations</span>
                  <span className={(stryMutAct_9fa48("59950") ? reg.violations?.length <= 0 : stryMutAct_9fa48("59949") ? reg.violations?.length >= 0 : stryMutAct_9fa48("59948") ? false : stryMutAct_9fa48("59947") ? true : (stryCov_9fa48("59947", "59948", "59949", "59950"), (stryMutAct_9fa48("59951") ? reg.violations.length : (stryCov_9fa48("59951"), reg.violations?.length)) > 0)) ? 'text-red-400' : ''}>
                    {stryMutAct_9fa48("59956") ? reg.violations?.length && 0 : stryMutAct_9fa48("59955") ? false : stryMutAct_9fa48("59954") ? true : (stryCov_9fa48("59954", "59955", "59956"), (stryMutAct_9fa48("59957") ? reg.violations.length : (stryCov_9fa48("59957"), reg.violations?.length)) || 0)} violations
                  </span>
                </div>
              </div>))}
          </div>}
      </div>

      {/* Score Breakdown Modal */}
      {stryMutAct_9fa48("59960") ? showScoreBreakdown || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowScoreBreakdown(false)}>
          <div className="bg-slate-900 rounded-xl border border-emerald-500/30 w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📊 Compliance Score Breakdown</h2>
                <p className="text-sm text-slate-400">Weighted coverage across all active frameworks</p>
              </div>
              <button onClick={() => setShowScoreBreakdown(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">By Framework</h3>
                <div className="space-y-3">
                  {SCORE_BREAKDOWN.byFramework.map(fw => <div key={fw.code} className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium">{fw.code}</div>
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${fw.score >= 80 ? 'bg-emerald-500' : fw.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                    width: `${fw.score}%`
                  }} />
                      </div>
                      <span className={`w-12 text-right text-sm font-medium ${fw.score >= 80 ? 'text-emerald-400' : fw.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {fw.score}%
                      </span>
                      <span className="text-xs text-slate-500 w-24">{fw.mapped}/{fw.controls} controls</span>
                    </div>)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">By Control Family</h3>
                <div className="space-y-3">
                  {SCORE_BREAKDOWN.byControlFamily.map(cf => <div key={cf.family} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-slate-400">{cf.family}</div>
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${cf.score >= 80 ? 'bg-emerald-500' : cf.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                    width: `${cf.score}%`
                  }} />
                      </div>
                      <span className={`w-12 text-right text-sm font-medium ${cf.score >= 80 ? 'text-emerald-400' : cf.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                        {cf.score}%
                      </span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("59959") ? false : stryMutAct_9fa48("59958") ? true : (stryCov_9fa48("59958", "59959", "59960"), showScoreBreakdown && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("59961") ? () => undefined : (stryCov_9fa48("59961"), () => setShowScoreBreakdown(stryMutAct_9fa48("59962") ? true : (stryCov_9fa48("59962"), false)))}>
          <div className="bg-slate-900 rounded-xl border border-emerald-500/30 w-[600px] max-h-[80vh] overflow-y-auto" onClick={stryMutAct_9fa48("59963") ? () => undefined : (stryCov_9fa48("59963"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📊 Compliance Score Breakdown</h2>
                <p className="text-sm text-slate-400">Weighted coverage across all active frameworks</p>
              </div>
              <button onClick={stryMutAct_9fa48("59964") ? () => undefined : (stryCov_9fa48("59964"), () => setShowScoreBreakdown(stryMutAct_9fa48("59965") ? true : (stryCov_9fa48("59965"), false)))} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">By Framework</h3>
                <div className="space-y-3">
                  {SCORE_BREAKDOWN.byFramework.map(stryMutAct_9fa48("59966") ? () => undefined : (stryCov_9fa48("59966"), fw => <div key={fw.code} className="flex items-center gap-3">
                      <div className="w-16 text-sm font-medium">{fw.code}</div>
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${(stryMutAct_9fa48("59971") ? fw.score < 80 : stryMutAct_9fa48("59970") ? fw.score > 80 : stryMutAct_9fa48("59969") ? false : stryMutAct_9fa48("59968") ? true : (stryCov_9fa48("59968", "59969", "59970", "59971"), fw.score >= 80)) ? 'bg-emerald-500' : (stryMutAct_9fa48("59976") ? fw.score < 50 : stryMutAct_9fa48("59975") ? fw.score > 50 : stryMutAct_9fa48("59974") ? false : stryMutAct_9fa48("59973") ? true : (stryCov_9fa48("59973", "59974", "59975", "59976"), fw.score >= 50)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("59979") ? {} : (stryCov_9fa48("59979"), {
                    width: `${fw.score}%`
                  })} />
                      </div>
                      <span className={`w-12 text-right text-sm font-medium ${(stryMutAct_9fa48("59985") ? fw.score < 80 : stryMutAct_9fa48("59984") ? fw.score > 80 : stryMutAct_9fa48("59983") ? false : stryMutAct_9fa48("59982") ? true : (stryCov_9fa48("59982", "59983", "59984", "59985"), fw.score >= 80)) ? 'text-emerald-400' : (stryMutAct_9fa48("59990") ? fw.score < 50 : stryMutAct_9fa48("59989") ? fw.score > 50 : stryMutAct_9fa48("59988") ? false : stryMutAct_9fa48("59987") ? true : (stryCov_9fa48("59987", "59988", "59989", "59990"), fw.score >= 50)) ? 'text-amber-400' : 'text-red-400'}`}>
                        {fw.score}%
                      </span>
                      <span className="text-xs text-slate-500 w-24">{fw.mapped}/{fw.controls} controls</span>
                    </div>))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">By Control Family</h3>
                <div className="space-y-3">
                  {SCORE_BREAKDOWN.byControlFamily.map(stryMutAct_9fa48("59993") ? () => undefined : (stryCov_9fa48("59993"), cf => <div key={cf.family} className="flex items-center gap-3">
                      <div className="w-36 text-sm text-slate-400">{cf.family}</div>
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${(stryMutAct_9fa48("59998") ? cf.score < 80 : stryMutAct_9fa48("59997") ? cf.score > 80 : stryMutAct_9fa48("59996") ? false : stryMutAct_9fa48("59995") ? true : (stryCov_9fa48("59995", "59996", "59997", "59998"), cf.score >= 80)) ? 'bg-emerald-500' : (stryMutAct_9fa48("60003") ? cf.score < 50 : stryMutAct_9fa48("60002") ? cf.score > 50 : stryMutAct_9fa48("60001") ? false : stryMutAct_9fa48("60000") ? true : (stryCov_9fa48("60000", "60001", "60002", "60003"), cf.score >= 50)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("60006") ? {} : (stryCov_9fa48("60006"), {
                    width: `${cf.score}%`
                  })} />
                      </div>
                      <span className={`w-12 text-right text-sm font-medium ${(stryMutAct_9fa48("60012") ? cf.score < 80 : stryMutAct_9fa48("60011") ? cf.score > 80 : stryMutAct_9fa48("60010") ? false : stryMutAct_9fa48("60009") ? true : (stryCov_9fa48("60009", "60010", "60011", "60012"), cf.score >= 80)) ? 'text-emerald-400' : (stryMutAct_9fa48("60017") ? cf.score < 50 : stryMutAct_9fa48("60016") ? cf.score > 50 : stryMutAct_9fa48("60015") ? false : stryMutAct_9fa48("60014") ? true : (stryCov_9fa48("60014", "60015", "60016", "60017"), cf.score >= 50)) ? 'text-amber-400' : 'text-red-400'}`}>
                        {cf.score}%
                      </span>
                    </div>))}
                </div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Jurisdiction Matrix Modal */}
      {stryMutAct_9fa48("60022") ? showJurisdictionMatrix || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowJurisdictionMatrix(false)}>
          <div className="bg-slate-900 rounded-xl border border-blue-500/30 w-[700px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">🌍 Jurisdiction Exposure Matrix</h2>
                <p className="text-sm text-slate-400">Where are we exposed?</p>
              </div>
              <button onClick={() => setShowJurisdictionMatrix(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3">Region</th>
                    <th className="pb-3">Frameworks</th>
                    <th className="pb-3 text-right">Obligations</th>
                    <th className="pb-3 text-right">Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {JURISDICTION_MATRIX.map(j => <tr key={j.region} className="border-b border-slate-800">
                      <td className="py-3 font-medium">{j.region}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {j.frameworks.map(fw => <span key={fw} className="text-xs px-2 py-0.5 bg-slate-700 rounded">{fw}</span>)}
                        </div>
                      </td>
                      <td className="py-3 text-right">{j.obligations}</td>
                      <td className="py-3 text-right">
                        <span className={j.violations > 0 ? 'text-red-400 font-medium' : 'text-emerald-400'}>
                          {j.violations}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div> : stryMutAct_9fa48("60021") ? false : stryMutAct_9fa48("60020") ? true : (stryCov_9fa48("60020", "60021", "60022"), showJurisdictionMatrix && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("60023") ? () => undefined : (stryCov_9fa48("60023"), () => setShowJurisdictionMatrix(stryMutAct_9fa48("60024") ? true : (stryCov_9fa48("60024"), false)))}>
          <div className="bg-slate-900 rounded-xl border border-blue-500/30 w-[700px] max-h-[80vh] overflow-y-auto" onClick={stryMutAct_9fa48("60025") ? () => undefined : (stryCov_9fa48("60025"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">🌍 Jurisdiction Exposure Matrix</h2>
                <p className="text-sm text-slate-400">Where are we exposed?</p>
              </div>
              <button onClick={stryMutAct_9fa48("60026") ? () => undefined : (stryCov_9fa48("60026"), () => setShowJurisdictionMatrix(stryMutAct_9fa48("60027") ? true : (stryCov_9fa48("60027"), false)))} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3">Region</th>
                    <th className="pb-3">Frameworks</th>
                    <th className="pb-3 text-right">Obligations</th>
                    <th className="pb-3 text-right">Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {JURISDICTION_MATRIX.map(stryMutAct_9fa48("60028") ? () => undefined : (stryCov_9fa48("60028"), j => <tr key={j.region} className="border-b border-slate-800">
                      <td className="py-3 font-medium">{j.region}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {j.frameworks.map(stryMutAct_9fa48("60029") ? () => undefined : (stryCov_9fa48("60029"), fw => <span key={fw} className="text-xs px-2 py-0.5 bg-slate-700 rounded">{fw}</span>))}
                        </div>
                      </td>
                      <td className="py-3 text-right">{j.obligations}</td>
                      <td className="py-3 text-right">
                        <span className={(stryMutAct_9fa48("60033") ? j.violations <= 0 : stryMutAct_9fa48("60032") ? j.violations >= 0 : stryMutAct_9fa48("60031") ? false : stryMutAct_9fa48("60030") ? true : (stryCov_9fa48("60030", "60031", "60032", "60033"), j.violations > 0)) ? 'text-red-400 font-medium' : 'text-emerald-400'}>
                          {j.violations}
                        </span>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>)}

      {/* Radar Event Detail Panel */}
      {stryMutAct_9fa48("60038") ? selectedRadarEvent || <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={() => setSelectedRadarEvent(null)}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <div className={`text-xs px-2 py-0.5 rounded-full inline-block mb-2 ${getImpactBadgeClasses(selectedRadarEvent.impact)}`}>
                  {selectedRadarEvent.impact} IMPACT
                </div>
                <h2 className="text-xl font-bold">{selectedRadarEvent.framework}</h2>
                <p className="text-sm text-slate-400">{selectedRadarEvent.jurisdiction} • {selectedRadarEvent.effectiveDate}</p>
              </div>
              <button onClick={() => setSelectedRadarEvent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-2">{selectedRadarEvent.title}</h3>
                <p className="text-sm text-slate-300">{selectedRadarEvent.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Affected Business Units</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">IT Operations</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Data Privacy</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Vendor Management</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Affected Data Types</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Personal Data</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Financial Records</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <button onClick={() => window.open(`/cortex/intelligence/decision-dna?new=true&regulation=${selectedRadarEvent.framework}`, '_blank')} className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <FileText className="w-4 h-4" />
                  Create Impact Assessment in Decision DNA
                </button>
                <button onClick={() => window.open(`/cortex/bridge?template=remediation&regulation=${selectedRadarEvent.framework}`, '_blank')} className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Create Remediation Workflow in Bridge
                </button>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("60037") ? false : stryMutAct_9fa48("60036") ? true : (stryCov_9fa48("60036", "60037", "60038"), selectedRadarEvent && <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={stryMutAct_9fa48("60039") ? () => undefined : (stryCov_9fa48("60039"), () => setSelectedRadarEvent(null))}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={stryMutAct_9fa48("60040") ? () => undefined : (stryCov_9fa48("60040"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <div className={`text-xs px-2 py-0.5 rounded-full inline-block mb-2 ${getImpactBadgeClasses(selectedRadarEvent.impact)}`}>
                  {selectedRadarEvent.impact} IMPACT
                </div>
                <h2 className="text-xl font-bold">{selectedRadarEvent.framework}</h2>
                <p className="text-sm text-slate-400">{selectedRadarEvent.jurisdiction} • {selectedRadarEvent.effectiveDate}</p>
              </div>
              <button onClick={stryMutAct_9fa48("60042") ? () => undefined : (stryCov_9fa48("60042"), () => setSelectedRadarEvent(null))} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-2">{selectedRadarEvent.title}</h3>
                <p className="text-sm text-slate-300">{selectedRadarEvent.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Affected Business Units</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">IT Operations</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Data Privacy</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Vendor Management</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Affected Data Types</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Personal Data</span>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded">Financial Records</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <button onClick={stryMutAct_9fa48("60043") ? () => undefined : (stryCov_9fa48("60043"), () => window.open(`/cortex/intelligence/decision-dna?new=true&regulation=${selectedRadarEvent.framework}`, '_blank'))} className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <FileText className="w-4 h-4" />
                  Create Impact Assessment in Decision DNA
                </button>
                <button onClick={stryMutAct_9fa48("60046") ? () => undefined : (stryCov_9fa48("60046"), () => window.open(`/cortex/bridge?template=remediation&regulation=${selectedRadarEvent.framework}`, '_blank'))} className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Create Remediation Workflow in Bridge
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Violation Detail Modal (Witness-style) */}
      {stryMutAct_9fa48("60051") ? selectedViolation || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedViolation(null)}>
          <div className="bg-slate-900 rounded-xl border border-red-500/30 w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Violation Details</h2>
                  <p className="text-sm text-slate-400">CendiaWitness™ Record</p>
                </div>
              </div>
              <button onClick={() => setSelectedViolation(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
            const detail = VIOLATION_DETAILS[selectedViolation as keyof typeof VIOLATION_DETAILS] || {
              title: 'Unknown Violation',
              severity: 'MEDIUM',
              framework: 'Unknown',
              description: 'No details available',
              owner: 'Unassigned',
              dueDate: 'TBD',
              linkedDecisions: [],
              mitigationWorkflow: null
            };
            return <>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{detail.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${detail.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : detail.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {detail.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{detail.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Framework:</span>
                        <span className="ml-2 font-medium">{detail.framework}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Owner:</span>
                        <span className="ml-2 font-medium">{detail.owner}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Due Date:</span>
                        <span className="ml-2 font-medium">{detail.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span className="ml-2 font-medium text-amber-400">Open</span>
                      </div>
                    </div>
                    {detail.linkedDecisions.length > 0 && <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Linked Decisions</h4>
                        <div className="space-y-2">
                          {detail.linkedDecisions.map((dec: string, i: number) => <button key={i} className="w-full p-2 bg-slate-800 rounded text-sm text-left hover:bg-slate-700 flex items-center justify-between">
                              <span>{dec}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </button>)}
                        </div>
                      </div>}
                    {detail.mitigationWorkflow && <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Mitigation Workflow</h4>
                        <button className="w-full p-2 bg-purple-900/30 border border-purple-500/30 rounded text-sm text-left hover:bg-purple-900/50 flex items-center justify-between">
                          <span>{detail.mitigationWorkflow}</span>
                          <ExternalLink className="w-3 h-3 text-purple-400" />
                        </button>
                      </div>}
                    <div className="pt-4 border-t border-slate-700 space-y-3">
                      <button onClick={() => window.open('/cortex/intelligence/council?escalate=violation', '_blank')} className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                        <Play className="w-4 h-4" />
                        Escalate to Council
                      </button>
                      <button onClick={() => window.open('/cortex/bridge?link=violation', '_blank')} className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                        Link to Workflow
                      </button>
                    </div>
                  </>;
          })()}
            </div>
          </div>
        </div> : stryMutAct_9fa48("60050") ? false : stryMutAct_9fa48("60049") ? true : (stryCov_9fa48("60049", "60050", "60051"), selectedViolation && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("60052") ? () => undefined : (stryCov_9fa48("60052"), () => setSelectedViolation(null))}>
          <div className="bg-slate-900 rounded-xl border border-red-500/30 w-[600px] max-h-[80vh] overflow-y-auto" onClick={stryMutAct_9fa48("60053") ? () => undefined : (stryCov_9fa48("60053"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Violation Details</h2>
                  <p className="text-sm text-slate-400">CendiaWitness™ Record</p>
                </div>
              </div>
              <button onClick={stryMutAct_9fa48("60054") ? () => undefined : (stryCov_9fa48("60054"), () => setSelectedViolation(null))} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
            const detail = stryMutAct_9fa48("60058") ? VIOLATION_DETAILS[selectedViolation as keyof typeof VIOLATION_DETAILS] && {
              title: 'Unknown Violation',
              severity: 'MEDIUM',
              framework: 'Unknown',
              description: 'No details available',
              owner: 'Unassigned',
              dueDate: 'TBD',
              linkedDecisions: [],
              mitigationWorkflow: null
            } : stryMutAct_9fa48("60057") ? false : stryMutAct_9fa48("60056") ? true : (stryCov_9fa48("60056", "60057", "60058"), VIOLATION_DETAILS[selectedViolation as keyof typeof VIOLATION_DETAILS] || (stryMutAct_9fa48("60059") ? {} : (stryCov_9fa48("60059"), {
              title: 'Unknown Violation',
              severity: 'MEDIUM',
              framework: 'Unknown',
              description: 'No details available',
              owner: 'Unassigned',
              dueDate: 'TBD',
              linkedDecisions: stryMutAct_9fa48("60066") ? ["Stryker was here"] : (stryCov_9fa48("60066"), []),
              mitigationWorkflow: null
            })));
            return <>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{detail.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("60070") ? detail.severity !== 'CRITICAL' : stryMutAct_9fa48("60069") ? false : stryMutAct_9fa48("60068") ? true : (stryCov_9fa48("60068", "60069", "60070"), detail.severity === 'CRITICAL')) ? 'bg-red-500/20 text-red-300' : (stryMutAct_9fa48("60075") ? detail.severity !== 'HIGH' : stryMutAct_9fa48("60074") ? false : stryMutAct_9fa48("60073") ? true : (stryCov_9fa48("60073", "60074", "60075"), detail.severity === 'HIGH')) ? 'bg-orange-500/20 text-orange-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {detail.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{detail.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Framework:</span>
                        <span className="ml-2 font-medium">{detail.framework}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Owner:</span>
                        <span className="ml-2 font-medium">{detail.owner}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Due Date:</span>
                        <span className="ml-2 font-medium">{detail.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span className="ml-2 font-medium text-amber-400">Open</span>
                      </div>
                    </div>
                    {stryMutAct_9fa48("60081") ? detail.linkedDecisions.length > 0 || <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Linked Decisions</h4>
                        <div className="space-y-2">
                          {detail.linkedDecisions.map((dec: string, i: number) => <button key={i} className="w-full p-2 bg-slate-800 rounded text-sm text-left hover:bg-slate-700 flex items-center justify-between">
                              <span>{dec}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </button>)}
                        </div>
                      </div> : stryMutAct_9fa48("60080") ? false : stryMutAct_9fa48("60079") ? true : (stryCov_9fa48("60079", "60080", "60081"), (stryMutAct_9fa48("60084") ? detail.linkedDecisions.length <= 0 : stryMutAct_9fa48("60083") ? detail.linkedDecisions.length >= 0 : stryMutAct_9fa48("60082") ? true : (stryCov_9fa48("60082", "60083", "60084"), detail.linkedDecisions.length > 0)) && <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Linked Decisions</h4>
                        <div className="space-y-2">
                          {detail.linkedDecisions.map(stryMutAct_9fa48("60085") ? () => undefined : (stryCov_9fa48("60085"), (dec: string, i: number) => <button key={i} className="w-full p-2 bg-slate-800 rounded text-sm text-left hover:bg-slate-700 flex items-center justify-between">
                              <span>{dec}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </button>))}
                        </div>
                      </div>)}
                    {stryMutAct_9fa48("60088") ? detail.mitigationWorkflow || <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Mitigation Workflow</h4>
                        <button className="w-full p-2 bg-purple-900/30 border border-purple-500/30 rounded text-sm text-left hover:bg-purple-900/50 flex items-center justify-between">
                          <span>{detail.mitigationWorkflow}</span>
                          <ExternalLink className="w-3 h-3 text-purple-400" />
                        </button>
                      </div> : stryMutAct_9fa48("60087") ? false : stryMutAct_9fa48("60086") ? true : (stryCov_9fa48("60086", "60087", "60088"), detail.mitigationWorkflow && <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Mitigation Workflow</h4>
                        <button className="w-full p-2 bg-purple-900/30 border border-purple-500/30 rounded text-sm text-left hover:bg-purple-900/50 flex items-center justify-between">
                          <span>{detail.mitigationWorkflow}</span>
                          <ExternalLink className="w-3 h-3 text-purple-400" />
                        </button>
                      </div>)}
                    <div className="pt-4 border-t border-slate-700 space-y-3">
                      <button onClick={stryMutAct_9fa48("60089") ? () => undefined : (stryCov_9fa48("60089"), () => window.open('/cortex/intelligence/council?escalate=violation', '_blank'))} className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                        <Play className="w-4 h-4" />
                        Escalate to Council
                      </button>
                      <button onClick={stryMutAct_9fa48("60092") ? () => undefined : (stryCov_9fa48("60092"), () => window.open('/cortex/bridge?link=violation', '_blank'))} className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                        Link to Workflow
                      </button>
                    </div>
                  </>;
          })()}
            </div>
          </div>
        </div>)}

      {/* Export Modal */}
      {stryMutAct_9fa48("60097") ? showExportModal || <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" /> Export Reports
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Compliance Summary</div>
                    <div className="text-xs text-slate-400">Overall scores, framework status, trend analysis</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">PDF</span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Open Violations Report</div>
                    <div className="text-xs text-slate-400">All violations with owners, due dates, progress</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">CSV</span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Board Report</div>
                    <div className="text-xs text-slate-400">Executive summary with risk matrix</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">PPTX</span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Regulatory Radar</div>
                    <div className="text-xs text-slate-400">Upcoming changes by jurisdiction</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded">PDF</span>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
              Reports can be customized via templates in Settings → Report Templates
            </div>
          </div>
        </div> : stryMutAct_9fa48("60096") ? false : stryMutAct_9fa48("60095") ? true : (stryCov_9fa48("60095", "60096", "60097"), showExportModal && <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("60098") ? () => undefined : (stryCov_9fa48("60098"), () => setShowExportModal(stryMutAct_9fa48("60099") ? true : (stryCov_9fa48("60099"), false)))}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700" onClick={stryMutAct_9fa48("60100") ? () => undefined : (stryCov_9fa48("60100"), e => e.stopPropagation())}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" /> Export Reports
              </h3>
              <button onClick={stryMutAct_9fa48("60101") ? () => undefined : (stryCov_9fa48("60101"), () => setShowExportModal(stryMutAct_9fa48("60102") ? true : (stryCov_9fa48("60102"), false)))} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Compliance Summary</div>
                    <div className="text-xs text-slate-400">Overall scores, framework status, trend analysis</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">PDF</span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Open Violations Report</div>
                    <div className="text-xs text-slate-400">All violations with owners, due dates, progress</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">CSV</span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Board Report</div>
                    <div className="text-xs text-slate-400">Executive summary with risk matrix</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">PPTX</span>
                </div>
              </button>
              <button className="w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Regulatory Radar</div>
                    <div className="text-xs text-slate-400">Upcoming changes by jurisdiction</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded">PDF</span>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
              Reports can be customized via templates in Settings → Report Templates
            </div>
          </div>
        </div>)}

      {/* Violation Workflow Panel */}
      {stryMutAct_9fa48("60105") ? showViolationWorkflow || <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setShowViolationWorkflow(false)}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Violation Workflow</h2>
                <button onClick={() => setShowViolationWorkflow(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              
              {/* Filter Pills */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(level => <button key={level} onClick={() => setViolationFilter(level)} className={`px-3 py-1 rounded-lg text-xs capitalize ${violationFilter === level ? level === 'critical' ? 'bg-red-600 text-white' : level === 'high' ? 'bg-orange-600 text-white' : level === 'medium' ? 'bg-amber-600 text-white' : level === 'low' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {level}
                  </button>)}
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Dynamic violations with workflow (dates relative to current time) */}
              {[{
            id: 'v1',
            title: 'Missing data retention policy',
            severity: 'HIGH',
            owner: 'Data Protection Officer',
            dueDate: getFutureDate(30),
            progress: 35
          }, {
            id: 'v2',
            title: 'Incomplete vendor risk assessment',
            severity: 'MEDIUM',
            owner: 'Vendor Risk Manager',
            dueDate: getFutureDate(14),
            progress: 60
          }, {
            id: 'v3',
            title: 'Delayed security training',
            severity: 'LOW',
            owner: 'HR Director',
            dueDate: getFutureDate(45),
            progress: 80
          }].filter(v => violationFilter === 'all' || v.severity.toLowerCase() === violationFilter).map(v => <div key={v.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${v.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : v.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300' : v.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {v.severity}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due: {v.dueDate}
                    </span>
                  </div>
                  
                  <div className="font-medium text-white mb-2">{v.title}</div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <User className="w-3 h-3" />
                    <span>{v.owner}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{v.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${v.progress >= 80 ? 'bg-emerald-500' : v.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                  width: `${v.progress}%`
                }} />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedViolation(v.id)} className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs flex items-center justify-center gap-1">
                      View Details <ChevronRight className="w-3 h-3" />
                    </button>
                    <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs">
                      <option>Assign Owner</option>
                      <option>Sarah Chen</option>
                      <option>Michael Torres</option>
                      <option>Emily Watson</option>
                    </select>
                  </div>
                </div>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("60104") ? false : stryMutAct_9fa48("60103") ? true : (stryCov_9fa48("60103", "60104", "60105"), showViolationWorkflow && <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={stryMutAct_9fa48("60106") ? () => undefined : (stryCov_9fa48("60106"), () => setShowViolationWorkflow(stryMutAct_9fa48("60107") ? true : (stryCov_9fa48("60107"), false)))}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={stryMutAct_9fa48("60108") ? () => undefined : (stryCov_9fa48("60108"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-slate-700 sticky top-0 bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Violation Workflow</h2>
                <button onClick={stryMutAct_9fa48("60109") ? () => undefined : (stryCov_9fa48("60109"), () => setShowViolationWorkflow(stryMutAct_9fa48("60110") ? true : (stryCov_9fa48("60110"), false)))} className="text-slate-400 hover:text-white">✕</button>
              </div>
              
              {/* Filter Pills */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(stryMutAct_9fa48("60111") ? () => undefined : (stryCov_9fa48("60111"), level => <button key={level} onClick={stryMutAct_9fa48("60112") ? () => undefined : (stryCov_9fa48("60112"), () => setViolationFilter(level))} className={`px-3 py-1 rounded-lg text-xs capitalize ${(stryMutAct_9fa48("60116") ? violationFilter !== level : stryMutAct_9fa48("60115") ? false : stryMutAct_9fa48("60114") ? true : (stryCov_9fa48("60114", "60115", "60116"), violationFilter === level)) ? (stryMutAct_9fa48("60119") ? level !== 'critical' : stryMutAct_9fa48("60118") ? false : stryMutAct_9fa48("60117") ? true : (stryCov_9fa48("60117", "60118", "60119"), level === 'critical')) ? 'bg-red-600 text-white' : (stryMutAct_9fa48("60124") ? level !== 'high' : stryMutAct_9fa48("60123") ? false : stryMutAct_9fa48("60122") ? true : (stryCov_9fa48("60122", "60123", "60124"), level === 'high')) ? 'bg-orange-600 text-white' : (stryMutAct_9fa48("60129") ? level !== 'medium' : stryMutAct_9fa48("60128") ? false : stryMutAct_9fa48("60127") ? true : (stryCov_9fa48("60127", "60128", "60129"), level === 'medium')) ? 'bg-amber-600 text-white' : (stryMutAct_9fa48("60134") ? level !== 'low' : stryMutAct_9fa48("60133") ? false : stryMutAct_9fa48("60132") ? true : (stryCov_9fa48("60132", "60133", "60134"), level === 'low')) ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    {level}
                  </button>))}
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Dynamic violations with workflow (dates relative to current time) */}
              {stryMutAct_9fa48("60139") ? [{
            id: 'v1',
            title: 'Missing data retention policy',
            severity: 'HIGH',
            owner: 'Data Protection Officer',
            dueDate: getFutureDate(30),
            progress: 35
          }, {
            id: 'v2',
            title: 'Incomplete vendor risk assessment',
            severity: 'MEDIUM',
            owner: 'Vendor Risk Manager',
            dueDate: getFutureDate(14),
            progress: 60
          }, {
            id: 'v3',
            title: 'Delayed security training',
            severity: 'LOW',
            owner: 'HR Director',
            dueDate: getFutureDate(45),
            progress: 80
          }].map(v => <div key={v.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${v.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : v.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300' : v.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {v.severity}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due: {v.dueDate}
                    </span>
                  </div>
                  
                  <div className="font-medium text-white mb-2">{v.title}</div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <User className="w-3 h-3" />
                    <span>{v.owner}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{v.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${v.progress >= 80 ? 'bg-emerald-500' : v.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                  width: `${v.progress}%`
                }} />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedViolation(v.id)} className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs flex items-center justify-center gap-1">
                      View Details <ChevronRight className="w-3 h-3" />
                    </button>
                    <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs">
                      <option>Assign Owner</option>
                      <option>Sarah Chen</option>
                      <option>Michael Torres</option>
                      <option>Emily Watson</option>
                    </select>
                  </div>
                </div>) : (stryCov_9fa48("60139"), (stryMutAct_9fa48("60140") ? [] : (stryCov_9fa48("60140"), [stryMutAct_9fa48("60141") ? {} : (stryCov_9fa48("60141"), {
            id: 'v1',
            title: 'Missing data retention policy',
            severity: 'HIGH',
            owner: 'Data Protection Officer',
            dueDate: getFutureDate(30),
            progress: 35
          }), stryMutAct_9fa48("60146") ? {} : (stryCov_9fa48("60146"), {
            id: 'v2',
            title: 'Incomplete vendor risk assessment',
            severity: 'MEDIUM',
            owner: 'Vendor Risk Manager',
            dueDate: getFutureDate(14),
            progress: 60
          }), stryMutAct_9fa48("60151") ? {} : (stryCov_9fa48("60151"), {
            id: 'v3',
            title: 'Delayed security training',
            severity: 'LOW',
            owner: 'HR Director',
            dueDate: getFutureDate(45),
            progress: 80
          })])).filter(stryMutAct_9fa48("60156") ? () => undefined : (stryCov_9fa48("60156"), v => stryMutAct_9fa48("60159") ? violationFilter === 'all' && v.severity.toLowerCase() === violationFilter : stryMutAct_9fa48("60158") ? false : stryMutAct_9fa48("60157") ? true : (stryCov_9fa48("60157", "60158", "60159"), (stryMutAct_9fa48("60161") ? violationFilter !== 'all' : stryMutAct_9fa48("60160") ? false : (stryCov_9fa48("60160", "60161"), violationFilter === 'all')) || (stryMutAct_9fa48("60164") ? v.severity.toLowerCase() !== violationFilter : stryMutAct_9fa48("60163") ? false : (stryCov_9fa48("60163", "60164"), (stryMutAct_9fa48("60165") ? v.severity.toUpperCase() : (stryCov_9fa48("60165"), v.severity.toLowerCase())) === violationFilter))))).map(stryMutAct_9fa48("60166") ? () => undefined : (stryCov_9fa48("60166"), v => <div key={v.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("60170") ? v.severity !== 'CRITICAL' : stryMutAct_9fa48("60169") ? false : stryMutAct_9fa48("60168") ? true : (stryCov_9fa48("60168", "60169", "60170"), v.severity === 'CRITICAL')) ? 'bg-red-500/20 text-red-300' : (stryMutAct_9fa48("60175") ? v.severity !== 'HIGH' : stryMutAct_9fa48("60174") ? false : stryMutAct_9fa48("60173") ? true : (stryCov_9fa48("60173", "60174", "60175"), v.severity === 'HIGH')) ? 'bg-orange-500/20 text-orange-300' : (stryMutAct_9fa48("60180") ? v.severity !== 'MEDIUM' : stryMutAct_9fa48("60179") ? false : stryMutAct_9fa48("60178") ? true : (stryCov_9fa48("60178", "60179", "60180"), v.severity === 'MEDIUM')) ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {v.severity}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due: {v.dueDate}
                    </span>
                  </div>
                  
                  <div className="font-medium text-white mb-2">{v.title}</div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <User className="w-3 h-3" />
                    <span>{v.owner}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{v.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(stryMutAct_9fa48("60188") ? v.progress < 80 : stryMutAct_9fa48("60187") ? v.progress > 80 : stryMutAct_9fa48("60186") ? false : stryMutAct_9fa48("60185") ? true : (stryCov_9fa48("60185", "60186", "60187", "60188"), v.progress >= 80)) ? 'bg-emerald-500' : (stryMutAct_9fa48("60193") ? v.progress < 50 : stryMutAct_9fa48("60192") ? v.progress > 50 : stryMutAct_9fa48("60191") ? false : stryMutAct_9fa48("60190") ? true : (stryCov_9fa48("60190", "60191", "60192", "60193"), v.progress >= 50)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("60196") ? {} : (stryCov_9fa48("60196"), {
                  width: `${v.progress}%`
                })} />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={stryMutAct_9fa48("60198") ? () => undefined : (stryCov_9fa48("60198"), () => setSelectedViolation(v.id))} className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs flex items-center justify-center gap-1">
                      View Details <ChevronRight className="w-3 h-3" />
                    </button>
                    <select className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs">
                      <option>Assign Owner</option>
                      <option>Sarah Chen</option>
                      <option>Michael Torres</option>
                      <option>Emily Watson</option>
                    </select>
                  </div>
                </div>)))}
            </div>
          </div>
        </div>)}
    </div>;
};
export default PanopticonPage;