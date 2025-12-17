// @ts-nocheck
// =============================================================================
// DATACENDIA - DASHBOARD PAGE (Real API Integration)
// =============================================================================

// File: src/pages/cortex/DashboardPage.tsx
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
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatNumber, formatCurrency, formatRelativeTime } from '../../../lib/utils';
import { healthApi, alertsApi, metricsApi, organizationsApi, authApi } from '../../lib/api';
import { wsClient } from '../../lib/api/websocket';
import type { HealthScore as ApiHealthScore, Alert as ApiAlert } from '../../lib/api/types';
import { useLanguage } from '../../contexts/LanguageContext';
import { NarrativeGuide, NarrativeSelector } from '../../components/ui';
import { Compass, X } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface HealthScore {
  overall: number;
  dimensions: {
    data: {
      score: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    };
    operations: {
      score: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    };
    security: {
      score: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    };
    people: {
      score: number;
      trend: 'up' | 'down' | 'stable';
      change: number;
    };
  };
}
interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  timestamp: Date;
}
interface Approval {
  id: string;
  type: 'workflow' | 'access' | 'budget';
  title: string;
  requestedBy: string;
}
interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}
interface Activity {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

// =============================================================================
// FALLBACK DATA (Used when API is unavailable)
// =============================================================================

const fallbackHealthScore: HealthScore = stryMutAct_9fa48("25241") ? {} : (stryCov_9fa48("25241"), {
  overall: 82,
  dimensions: stryMutAct_9fa48("25242") ? {} : (stryCov_9fa48("25242"), {
    data: stryMutAct_9fa48("25243") ? {} : (stryCov_9fa48("25243"), {
      score: 94,
      trend: 'up',
      change: 2
    }),
    operations: stryMutAct_9fa48("25245") ? {} : (stryCov_9fa48("25245"), {
      score: 78,
      trend: 'down',
      change: stryMutAct_9fa48("25247") ? +5 : (stryCov_9fa48("25247"), -5)
    }),
    security: stryMutAct_9fa48("25248") ? {} : (stryCov_9fa48("25248"), {
      score: 85,
      trend: 'up',
      change: 1
    }),
    people: stryMutAct_9fa48("25250") ? {} : (stryCov_9fa48("25250"), {
      score: 71,
      trend: 'stable',
      change: 0
    })
  })
});

// Translation helper type
type TranslateFunc = (key: string, params?: Record<string, string>) => string;

// Translated data getters - called inside component with t()
const getTranslatedAlerts = stryMutAct_9fa48("25252") ? () => undefined : (stryCov_9fa48("25252"), (() => {
  const getTranslatedAlerts = (t: TranslateFunc): Alert[] => stryMutAct_9fa48("25253") ? [] : (stryCov_9fa48("25253"), [stryMutAct_9fa48("25254") ? {} : (stryCov_9fa48("25254"), {
    id: '1',
    severity: 'critical',
    title: t('dashboard.sampleAlerts.databaseCpu'),
    timestamp: new Date(stryMutAct_9fa48("25258") ? Date.now() + 300000 : (stryCov_9fa48("25258"), Date.now() - 300000))
  }), stryMutAct_9fa48("25259") ? {} : (stryCov_9fa48("25259"), {
    id: '2',
    severity: 'critical',
    title: t('dashboard.sampleAlerts.paymentLatency'),
    timestamp: new Date(stryMutAct_9fa48("25263") ? Date.now() + 600000 : (stryCov_9fa48("25263"), Date.now() - 600000))
  }), stryMutAct_9fa48("25264") ? {} : (stryCov_9fa48("25264"), {
    id: '3',
    severity: 'warning',
    title: t('dashboard.sampleAlerts.diskUsage'),
    timestamp: new Date(stryMutAct_9fa48("25268") ? Date.now() + 1800000 : (stryCov_9fa48("25268"), Date.now() - 1800000))
  })]);
  return getTranslatedAlerts;
})());
const getTranslatedApprovals = stryMutAct_9fa48("25269") ? () => undefined : (stryCov_9fa48("25269"), (() => {
  const getTranslatedApprovals = (t: TranslateFunc): Approval[] => stryMutAct_9fa48("25270") ? [] : (stryCov_9fa48("25270"), [stryMutAct_9fa48("25271") ? {} : (stryCov_9fa48("25271"), {
    id: '1',
    type: 'workflow',
    title: t('dashboard.sampleApprovals.monthlyClose'),
    requestedBy: 'Sarah Chen'
  }), stryMutAct_9fa48("25276") ? {} : (stryCov_9fa48("25276"), {
    id: '2',
    type: 'access',
    title: t('dashboard.sampleApprovals.prodDbAccess'),
    requestedBy: 'Emily Davis'
  })]);
  return getTranslatedApprovals;
})());
const getTranslatedMetrics = stryMutAct_9fa48("25281") ? () => undefined : (stryCov_9fa48("25281"), (() => {
  const getTranslatedMetrics = (t: TranslateFunc): Metric[] => stryMutAct_9fa48("25282") ? [] : (stryCov_9fa48("25282"), [stryMutAct_9fa48("25283") ? {} : (stryCov_9fa48("25283"), {
    id: '1',
    name: t('dashboard.sampleMetrics.revenue'),
    value: 12400000,
    unit: 'USD',
    change: 12,
    changeType: 'increase'
  }), stryMutAct_9fa48("25288") ? {} : (stryCov_9fa48("25288"), {
    id: '2',
    name: t('dashboard.sampleMetrics.pipeline'),
    value: 48200000,
    unit: 'USD',
    change: 8,
    changeType: 'increase'
  }), stryMutAct_9fa48("25293") ? {} : (stryCov_9fa48("25293"), {
    id: '3',
    name: t('dashboard.sampleMetrics.burnRate'),
    value: 1200000,
    unit: 'USD/mo',
    change: stryMutAct_9fa48("25297") ? +3 : (stryCov_9fa48("25297"), -3),
    changeType: 'decrease'
  }), stryMutAct_9fa48("25299") ? {} : (stryCov_9fa48("25299"), {
    id: '4',
    name: t('dashboard.sampleMetrics.nps'),
    value: 72,
    unit: 'pts',
    change: 5,
    changeType: 'increase'
  })]);
  return getTranslatedMetrics;
})());
const getTranslatedActivity = stryMutAct_9fa48("25304") ? () => undefined : (stryCov_9fa48("25304"), (() => {
  const getTranslatedActivity = (t: TranslateFunc): Activity[] => stryMutAct_9fa48("25305") ? [] : (stryCov_9fa48("25305"), [stryMutAct_9fa48("25306") ? {} : (stryCov_9fa48("25306"), {
    id: '1',
    type: 'success',
    message: `Workflow "Monthly Close" ${stryMutAct_9fa48("25312") ? t('common.completed') && 'completed' : stryMutAct_9fa48("25311") ? false : stryMutAct_9fa48("25310") ? true : (stryCov_9fa48("25310", "25311", "25312"), t('common.completed') || 'completed')}`,
    timestamp: new Date(stryMutAct_9fa48("25315") ? Date.now() + 120000 : (stryCov_9fa48("25315"), Date.now() - 120000))
  }), stryMutAct_9fa48("25316") ? {} : (stryCov_9fa48("25316"), {
    id: '2',
    type: 'info',
    message: `Sarah ${stryMutAct_9fa48("25322") ? t('common.queried') && 'queried' : stryMutAct_9fa48("25321") ? false : stryMutAct_9fa48("25320") ? true : (stryCov_9fa48("25320", "25321", "25322"), t('common.queried') || 'queried')} revenue forecast`,
    timestamp: new Date(stryMutAct_9fa48("25325") ? Date.now() + 900000 : (stryCov_9fa48("25325"), Date.now() - 900000))
  })]);
  return getTranslatedActivity;
})());
const getTranslatedQueries = stryMutAct_9fa48("25326") ? () => undefined : (stryCov_9fa48("25326"), (() => {
  const getTranslatedQueries = (t: TranslateFunc): string[] => stryMutAct_9fa48("25327") ? [] : (stryCov_9fa48("25327"), [t('dashboard.sampleQueries.churnIncrease'), t('dashboard.sampleQueries.forecastRevenue'), t('dashboard.sampleQueries.biggestRisk')]);
  return getTranslatedQueries;
})());

// =============================================================================
// COMPONENT
// =============================================================================

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    t,
    language
  } = useLanguage();
  const [queryInput, setQueryInput] = useState('');

  // Real data state
  const [alerts, setAlerts] = useState<Alert[]>(stryMutAct_9fa48("25333") ? ["Stryker was here"] : (stryCov_9fa48("25333"), []));
  const [metrics, setMetrics] = useState<Metric[]>(stryMutAct_9fa48("25334") ? ["Stryker was here"] : (stryCov_9fa48("25334"), []));
  const [healthScore, setHealthScore] = useState<HealthScore>(fallbackHealthScore);
  const [userName, setUserName] = useState('User');
  const [orgName, setOrgName] = useState('Your Company');

  // Get translated fallback data
  const fallbackAlerts = getTranslatedAlerts(t);
  const fallbackApprovals = getTranslatedApprovals(t);
  const fallbackMetrics = getTranslatedMetrics(t);
  const fallbackActivity = getTranslatedActivity(t);
  const recentQueries = getTranslatedQueries(t);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("25337") ? false : (stryCov_9fa48("25337"), true));

  // User Journey State
  const [showJourneySelector, setShowJourneySelector] = useState(stryMutAct_9fa48("25338") ? true : (stryCov_9fa48("25338"), false));
  const [activeJourney, setActiveJourney] = useState<'welcome' | 'executive' | 'dataEngineer' | 'complianceOfficer' | 'strategist' | 'quickStart' | null>(null);
  const [journeyCompleted, setJourneyCompleted] = useState(() => {
    return stryMutAct_9fa48("25342") ? localStorage.getItem('datacendia_journey_completed') !== 'true' : stryMutAct_9fa48("25341") ? false : stryMutAct_9fa48("25340") ? true : (stryCov_9fa48("25340", "25341", "25342"), localStorage.getItem('datacendia_journey_completed') === 'true');
  });

  // Fetch real data from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(stryMutAct_9fa48("25347") ? false : (stryCov_9fa48("25347"), true));
      try {
        // Fetch alerts
        const alertsResponse = await alertsApi.getAlerts(stryMutAct_9fa48("25349") ? {} : (stryCov_9fa48("25349"), {
          status: 'ACTIVE'
        }));
        if (stryMutAct_9fa48("25353") ? alertsResponse.success || alertsResponse.data : stryMutAct_9fa48("25352") ? false : stryMutAct_9fa48("25351") ? true : (stryCov_9fa48("25351", "25352", "25353"), alertsResponse.success && alertsResponse.data)) {
          const mappedAlerts: Alert[] = stryMutAct_9fa48("25355") ? alertsResponse.data.map((a: ApiAlert) => ({
            id: a.id,
            severity: a.severity,
            title: a.title,
            timestamp: new Date(a.createdAt)
          })) : (stryCov_9fa48("25355"), alertsResponse.data.slice(0, 5).map(stryMutAct_9fa48("25356") ? () => undefined : (stryCov_9fa48("25356"), (a: ApiAlert) => stryMutAct_9fa48("25357") ? {} : (stryCov_9fa48("25357"), {
            id: a.id,
            severity: a.severity,
            title: a.title,
            timestamp: new Date(a.createdAt)
          }))));
          setAlerts((stryMutAct_9fa48("25361") ? mappedAlerts.length <= 0 : stryMutAct_9fa48("25360") ? mappedAlerts.length >= 0 : stryMutAct_9fa48("25359") ? false : stryMutAct_9fa48("25358") ? true : (stryCov_9fa48("25358", "25359", "25360", "25361"), mappedAlerts.length > 0)) ? mappedAlerts : fallbackAlerts);
        }

        // Fetch metrics
        const metricsResponse = await metricsApi.getMetrics();
        if (stryMutAct_9fa48("25364") ? metricsResponse.success || metricsResponse.data : stryMutAct_9fa48("25363") ? false : stryMutAct_9fa48("25362") ? true : (stryCov_9fa48("25362", "25363", "25364"), metricsResponse.success && metricsResponse.data)) {
          const mappedMetrics: Metric[] = stryMutAct_9fa48("25366") ? metricsResponse.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            value: m.current_value || 0,
            unit: m.unit || '',
            change: m.change_percent || 0,
            changeType: (m.change_percent || 0) > 0 ? 'increase' : (m.change_percent || 0) < 0 ? 'decrease' : 'neutral'
          })) : (stryCov_9fa48("25366"), metricsResponse.data.slice(0, 4).map(stryMutAct_9fa48("25367") ? () => undefined : (stryCov_9fa48("25367"), (m: any) => stryMutAct_9fa48("25368") ? {} : (stryCov_9fa48("25368"), {
            id: m.id,
            name: m.name,
            value: stryMutAct_9fa48("25371") ? m.current_value && 0 : stryMutAct_9fa48("25370") ? false : stryMutAct_9fa48("25369") ? true : (stryCov_9fa48("25369", "25370", "25371"), m.current_value || 0),
            unit: stryMutAct_9fa48("25374") ? m.unit && '' : stryMutAct_9fa48("25373") ? false : stryMutAct_9fa48("25372") ? true : (stryCov_9fa48("25372", "25373", "25374"), m.unit || ''),
            change: stryMutAct_9fa48("25378") ? m.change_percent && 0 : stryMutAct_9fa48("25377") ? false : stryMutAct_9fa48("25376") ? true : (stryCov_9fa48("25376", "25377", "25378"), m.change_percent || 0),
            changeType: (stryMutAct_9fa48("25382") ? (m.change_percent || 0) <= 0 : stryMutAct_9fa48("25381") ? (m.change_percent || 0) >= 0 : stryMutAct_9fa48("25380") ? false : stryMutAct_9fa48("25379") ? true : (stryCov_9fa48("25379", "25380", "25381", "25382"), (stryMutAct_9fa48("25385") ? m.change_percent && 0 : stryMutAct_9fa48("25384") ? false : stryMutAct_9fa48("25383") ? true : (stryCov_9fa48("25383", "25384", "25385"), m.change_percent || 0)) > 0)) ? 'increase' : (stryMutAct_9fa48("25390") ? (m.change_percent || 0) >= 0 : stryMutAct_9fa48("25389") ? (m.change_percent || 0) <= 0 : stryMutAct_9fa48("25388") ? false : stryMutAct_9fa48("25387") ? true : (stryCov_9fa48("25387", "25388", "25389", "25390"), (stryMutAct_9fa48("25393") ? m.change_percent && 0 : stryMutAct_9fa48("25392") ? false : stryMutAct_9fa48("25391") ? true : (stryCov_9fa48("25391", "25392", "25393"), m.change_percent || 0)) < 0)) ? 'decrease' : 'neutral'
          }))));
          setMetrics((stryMutAct_9fa48("25399") ? mappedMetrics.length <= 0 : stryMutAct_9fa48("25398") ? mappedMetrics.length >= 0 : stryMutAct_9fa48("25397") ? false : stryMutAct_9fa48("25396") ? true : (stryCov_9fa48("25396", "25397", "25398", "25399"), mappedMetrics.length > 0)) ? mappedMetrics : fallbackMetrics);
        }

        // Fetch health score
        const healthResponse = await healthApi.getScore();
        if (stryMutAct_9fa48("25402") ? healthResponse.success || healthResponse.data : stryMutAct_9fa48("25401") ? false : stryMutAct_9fa48("25400") ? true : (stryCov_9fa48("25400", "25401", "25402"), healthResponse.success && healthResponse.data)) {
          setHealthScore(healthResponse.data as unknown as HealthScore);
        }

        // Fetch current organization
        const orgResponse = await organizationsApi.getCurrent();
        if (stryMutAct_9fa48("25406") ? orgResponse.success || orgResponse.data : stryMutAct_9fa48("25405") ? false : stryMutAct_9fa48("25404") ? true : (stryCov_9fa48("25404", "25405", "25406"), orgResponse.success && orgResponse.data)) {
          setOrgName(stryMutAct_9fa48("25410") ? orgResponse.data.name && 'Your Company' : stryMutAct_9fa48("25409") ? false : stryMutAct_9fa48("25408") ? true : (stryCov_9fa48("25408", "25409", "25410"), orgResponse.data.name || 'Your Company'));
        }

        // Fetch current user
        const userResponse = await authApi.getCurrentUser();
        if (stryMutAct_9fa48("25414") ? userResponse.success || userResponse.data : stryMutAct_9fa48("25413") ? false : stryMutAct_9fa48("25412") ? true : (stryCov_9fa48("25412", "25413", "25414"), userResponse.success && userResponse.data)) {
          setUserName(stryMutAct_9fa48("25418") ? userResponse.data.name?.split(' ')[0] && 'User' : stryMutAct_9fa48("25417") ? false : stryMutAct_9fa48("25416") ? true : (stryCov_9fa48("25416", "25417", "25418"), (stryMutAct_9fa48("25419") ? userResponse.data.name.split(' ')[0] : (stryCov_9fa48("25419"), userResponse.data.name?.split(' ')[0])) || 'User'));
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        // Use fallbacks on error
        setAlerts(fallbackAlerts);
        setMetrics(fallbackMetrics);
      } finally {
        setIsLoading(stryMutAct_9fa48("25425") ? true : (stryCov_9fa48("25425"), false));
      }
    };
    fetchDashboardData();
  }, stryMutAct_9fa48("25426") ? ["Stryker was here"] : (stryCov_9fa48("25426"), []));
  const handleQuerySubmit = () => {
    if (stryMutAct_9fa48("25430") ? queryInput : stryMutAct_9fa48("25429") ? false : stryMutAct_9fa48("25428") ? true : (stryCov_9fa48("25428", "25429", "25430"), queryInput.trim())) {
      navigate(`/cortex/council?q=${encodeURIComponent(queryInput)}`);
    }
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (stryMutAct_9fa48("25437") ? hour >= 12 : stryMutAct_9fa48("25436") ? hour <= 12 : stryMutAct_9fa48("25435") ? false : stryMutAct_9fa48("25434") ? true : (stryCov_9fa48("25434", "25435", "25436", "25437"), hour < 12)) {
      return t('dashboard.greetings.morning');
    }
    if (stryMutAct_9fa48("25443") ? hour >= 18 : stryMutAct_9fa48("25442") ? hour <= 18 : stryMutAct_9fa48("25441") ? false : stryMutAct_9fa48("25440") ? true : (stryCov_9fa48("25440", "25441", "25442", "25443"), hour < 18)) {
      return t('dashboard.greetings.afternoon');
    }
    return t('dashboard.greetings.evening');
  };
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (stryMutAct_9fa48("25450") ? trend !== 'up' : stryMutAct_9fa48("25449") ? false : stryMutAct_9fa48("25448") ? true : (stryCov_9fa48("25448", "25449", "25450"), trend === 'up')) {
      return '↑';
    }
    if (stryMutAct_9fa48("25456") ? trend !== 'down' : stryMutAct_9fa48("25455") ? false : stryMutAct_9fa48("25454") ? true : (stryCov_9fa48("25454", "25455", "25456"), trend === 'down')) {
      return '↓';
    }
    return '→';
  };
  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean = stryMutAct_9fa48("25461") ? false : (stryCov_9fa48("25461"), true)) => {
    if (stryMutAct_9fa48("25465") ? trend !== 'stable' : stryMutAct_9fa48("25464") ? false : stryMutAct_9fa48("25463") ? true : (stryCov_9fa48("25463", "25464", "25465"), trend === 'stable')) {
      return 'text-neutral-500';
    }
    if (stryMutAct_9fa48("25471") ? trend !== 'up' : stryMutAct_9fa48("25470") ? false : stryMutAct_9fa48("25469") ? true : (stryCov_9fa48("25469", "25470", "25471"), trend === 'up')) {
      return isPositive ? 'text-success-main' : 'text-error-main';
    }
    return isPositive ? 'text-error-main' : 'text-success-main';
  };
  const handleJourneyComplete = () => {
    setActiveJourney(null);
    setJourneyCompleted(stryMutAct_9fa48("25479") ? false : (stryCov_9fa48("25479"), true));
    localStorage.setItem('datacendia_journey_completed', 'true');
  };
  const handleSelectJourney = (journeyId: 'welcome' | 'executive' | 'dataEngineer' | 'complianceOfficer' | 'strategist' | 'quickStart') => {
    setActiveJourney(journeyId);
    setShowJourneySelector(stryMutAct_9fa48("25483") ? true : (stryCov_9fa48("25483"), false));
  };
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ================================================================= */}
      {/* HEADER */}
      {/* ================================================================= */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-neutral-500 mt-1">
          {t('dashboard.subtitle', stryMutAct_9fa48("25485") ? {} : (stryCov_9fa48("25485"), {
          company: orgName
        }))}
        </p>
      </div>

      {/* ================================================================= */}
      {/* HEALTH SCORE */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Overall Score */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke={(stryMutAct_9fa48("25489") ? healthScore.overall < 80 : stryMutAct_9fa48("25488") ? healthScore.overall > 80 : stryMutAct_9fa48("25487") ? false : stryMutAct_9fa48("25486") ? true : (stryCov_9fa48("25486", "25487", "25488", "25489"), healthScore.overall >= 80)) ? '#22C55E' : (stryMutAct_9fa48("25494") ? healthScore.overall < 60 : stryMutAct_9fa48("25493") ? healthScore.overall > 60 : stryMutAct_9fa48("25492") ? false : stryMutAct_9fa48("25491") ? true : (stryCov_9fa48("25491", "25492", "25493", "25494"), healthScore.overall >= 60)) ? '#F59E0B' : '#EF4444'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${stryMutAct_9fa48("25498") ? healthScore.overall / 100 / 251.2 : (stryCov_9fa48("25498"), (stryMutAct_9fa48("25499") ? healthScore.overall * 100 : (stryCov_9fa48("25499"), healthScore.overall / 100)) * 251.2)} 251.2`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-neutral-900">{healthScore.overall}</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900" title="Composite of Data, Operations, Security, and People – computed from the last 7 days of signals">{t('dashboard.health_score')} ℹ️</h2>
              <p className="text-sm text-success-main font-medium">▲ +3 {t('dashboard.fromLastWeek')}</p>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:max-w-xl">
            {Object.entries(healthScore.dimensions).map(([key, data]) => {
            const lowestScore = stryMutAct_9fa48("25503") ? Math.max(...Object.values(healthScore.dimensions).map(d => d.score)) : (stryCov_9fa48("25503"), Math.min(...Object.values(healthScore.dimensions).map(stryMutAct_9fa48("25504") ? () => undefined : (stryCov_9fa48("25504"), d => d.score))));
            const isLowest = stryMutAct_9fa48("25507") ? data.score !== lowestScore : stryMutAct_9fa48("25506") ? false : stryMutAct_9fa48("25505") ? true : (stryCov_9fa48("25505", "25506", "25507"), data.score === lowestScore);
            return <div key={key} className={cn("text-center p-3 rounded-lg cursor-pointer transition-all hover:shadow-md group relative", isLowest ? "bg-amber-50 ring-1 ring-amber-200" : "bg-neutral-50")} onClick={stryMutAct_9fa48("25511") ? () => undefined : (stryCov_9fa48("25511"), () => navigate(`/cortex/intelligence/chronos?filter=${key}`))} title={`Click to view ${key} events in Chronos`}>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                    {t(`dashboard.${key}`)}
                    {stryMutAct_9fa48("25517") ? isLowest || <span className="ml-1 text-amber-600">⚠️</span> : stryMutAct_9fa48("25516") ? false : stryMutAct_9fa48("25515") ? true : (stryCov_9fa48("25515", "25516", "25517"), isLowest && <span className="ml-1 text-amber-600">⚠️</span>)}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">{data.score}</p>
                  <p className={cn('text-xs font-medium', getTrendColor(data.trend, stryMutAct_9fa48("25519") ? false : (stryCov_9fa48("25519"), true)))}>
                    {getTrendIcon(data.trend)} {Math.abs(data.change)}
                  </p>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {isLowest ? 'Lowest score - click to investigate' : 'View in Chronos'}
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* ALERTS & APPROVALS ROW */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">{t('dashboard.alerts')}</h3>
            <button onClick={stryMutAct_9fa48("25523") ? () => undefined : (stryCov_9fa48("25523"), () => navigate('/cortex/pulse/alerts'))} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {t('button.view_all')} →
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Summary badges */}
            <div className="flex gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-light text-error-dark">
                🔴 {stryMutAct_9fa48("25526") ? (alerts.length > 0 ? alerts : fallbackAlerts).length : (stryCov_9fa48("25526"), ((stryMutAct_9fa48("25530") ? alerts.length <= 0 : stryMutAct_9fa48("25529") ? alerts.length >= 0 : stryMutAct_9fa48("25528") ? false : stryMutAct_9fa48("25527") ? true : (stryCov_9fa48("25527", "25528", "25529", "25530"), alerts.length > 0)) ? alerts : fallbackAlerts).filter(stryMutAct_9fa48("25531") ? () => undefined : (stryCov_9fa48("25531"), a => stryMutAct_9fa48("25534") ? a.severity !== 'critical' : stryMutAct_9fa48("25533") ? false : stryMutAct_9fa48("25532") ? true : (stryCov_9fa48("25532", "25533", "25534"), a.severity === 'critical'))).length)} {t('dashboard.critical')}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-light text-warning-dark">
                🟡 {stryMutAct_9fa48("25537") ? (alerts.length > 0 ? alerts : fallbackAlerts).length : (stryCov_9fa48("25537"), ((stryMutAct_9fa48("25541") ? alerts.length <= 0 : stryMutAct_9fa48("25540") ? alerts.length >= 0 : stryMutAct_9fa48("25539") ? false : stryMutAct_9fa48("25538") ? true : (stryCov_9fa48("25538", "25539", "25540", "25541"), alerts.length > 0)) ? alerts : fallbackAlerts).filter(stryMutAct_9fa48("25542") ? () => undefined : (stryCov_9fa48("25542"), a => stryMutAct_9fa48("25545") ? a.severity !== 'warning' : stryMutAct_9fa48("25544") ? false : stryMutAct_9fa48("25543") ? true : (stryCov_9fa48("25543", "25544", "25545"), a.severity === 'warning'))).length)} {t('dashboard.warning')}
              </span>
            </div>

            {/* Alert list - clickable to Chronos */}
            {stryMutAct_9fa48("25548") ? (alerts.length > 0 ? alerts : fallbackAlerts).map(alert => <div key={alert.id} onClick={() => navigate(`/cortex/intelligence/chronos?alertId=${alert.id}&timestamp=${alert.timestamp.toISOString()}`)} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors group">
                <span className={cn('mt-0.5 w-2 h-2 rounded-full flex-shrink-0', alert.severity === 'critical' && 'bg-error-main', alert.severity === 'warning' && 'bg-warning-main', alert.severity === 'info' && 'bg-info-main')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{alert.title}</p>
                  <p className="text-xs text-neutral-500">{formatRelativeTime(alert.timestamp)}</p>
                </div>
                <span className="text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  View in Chronos →
                </span>
              </div>) : (stryCov_9fa48("25548"), ((stryMutAct_9fa48("25552") ? alerts.length <= 0 : stryMutAct_9fa48("25551") ? alerts.length >= 0 : stryMutAct_9fa48("25550") ? false : stryMutAct_9fa48("25549") ? true : (stryCov_9fa48("25549", "25550", "25551", "25552"), alerts.length > 0)) ? alerts : fallbackAlerts).slice(0, 4).map(stryMutAct_9fa48("25553") ? () => undefined : (stryCov_9fa48("25553"), alert => <div key={alert.id} onClick={stryMutAct_9fa48("25554") ? () => undefined : (stryCov_9fa48("25554"), () => navigate(`/cortex/intelligence/chronos?alertId=${alert.id}&timestamp=${alert.timestamp.toISOString()}`))} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors group">
                <span className={cn('mt-0.5 w-2 h-2 rounded-full flex-shrink-0', stryMutAct_9fa48("25559") ? alert.severity === 'critical' || 'bg-error-main' : stryMutAct_9fa48("25558") ? false : stryMutAct_9fa48("25557") ? true : (stryCov_9fa48("25557", "25558", "25559"), (stryMutAct_9fa48("25561") ? alert.severity !== 'critical' : stryMutAct_9fa48("25560") ? true : (stryCov_9fa48("25560", "25561"), alert.severity === 'critical')) && 'bg-error-main'), stryMutAct_9fa48("25566") ? alert.severity === 'warning' || 'bg-warning-main' : stryMutAct_9fa48("25565") ? false : stryMutAct_9fa48("25564") ? true : (stryCov_9fa48("25564", "25565", "25566"), (stryMutAct_9fa48("25568") ? alert.severity !== 'warning' : stryMutAct_9fa48("25567") ? true : (stryCov_9fa48("25567", "25568"), alert.severity === 'warning')) && 'bg-warning-main'), stryMutAct_9fa48("25573") ? alert.severity === 'info' || 'bg-info-main' : stryMutAct_9fa48("25572") ? false : stryMutAct_9fa48("25571") ? true : (stryCov_9fa48("25571", "25572", "25573"), (stryMutAct_9fa48("25575") ? alert.severity !== 'info' : stryMutAct_9fa48("25574") ? true : (stryCov_9fa48("25574", "25575"), alert.severity === 'info')) && 'bg-info-main'))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{alert.title}</p>
                  <p className="text-xs text-neutral-500">{formatRelativeTime(alert.timestamp)}</p>
                </div>
                <span className="text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  View in Chronos →
                </span>
              </div>)))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">{t('dashboard.pending_approvals')}</h3>
            <button onClick={stryMutAct_9fa48("25579") ? () => undefined : (stryCov_9fa48("25579"), () => navigate('/cortex/bridge/approvals'))} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {t('button.view_all')} →
            </button>
          </div>

          {/* Summary badges */}
          <div className="flex gap-3 mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
              📋 {stryMutAct_9fa48("25582") ? fallbackApprovals.length : (stryCov_9fa48("25582"), fallbackApprovals.filter(stryMutAct_9fa48("25583") ? () => undefined : (stryCov_9fa48("25583"), a => stryMutAct_9fa48("25586") ? a.type !== 'workflow' : stryMutAct_9fa48("25585") ? false : stryMutAct_9fa48("25584") ? true : (stryCov_9fa48("25584", "25585", "25586"), a.type === 'workflow'))).length)} {t('dashboard.workflows')}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700">
              👤 {stryMutAct_9fa48("25589") ? fallbackApprovals.length : (stryCov_9fa48("25589"), fallbackApprovals.filter(stryMutAct_9fa48("25590") ? () => undefined : (stryCov_9fa48("25590"), a => stryMutAct_9fa48("25593") ? a.type !== 'access' : stryMutAct_9fa48("25592") ? false : stryMutAct_9fa48("25591") ? true : (stryCov_9fa48("25591", "25592", "25593"), a.type === 'access'))).length)} {t('dashboard.access')}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-700">
              💰 {stryMutAct_9fa48("25596") ? fallbackApprovals.length : (stryCov_9fa48("25596"), fallbackApprovals.filter(stryMutAct_9fa48("25597") ? () => undefined : (stryCov_9fa48("25597"), a => stryMutAct_9fa48("25600") ? a.type !== 'budget' : stryMutAct_9fa48("25599") ? false : stryMutAct_9fa48("25598") ? true : (stryCov_9fa48("25598", "25599", "25600"), a.type === 'budget'))).length)} {t('dashboard.budget')}
            </span>
          </div>

          {/* Approval list */}
          <div className="space-y-3">
            {stryMutAct_9fa48("25603") ? fallbackApprovals.map(approval => <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{approval.title}</p>
                  <p className="text-xs text-neutral-500">{t('dashboard.by')} {approval.requestedBy}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={e => {
                e.stopPropagation();
                // In a real app, this would call workflowsApi.approve(approval.id)
                alert(`Approved: ${approval.title}`);
              }} className="px-3 py-1 text-xs font-medium text-success-main bg-success-light rounded-md hover:bg-success-main hover:text-white transition-colors">
                    {t('dashboard.approve')}
                  </button>
                </div>
              </div>) : (stryCov_9fa48("25603"), fallbackApprovals.slice(0, 4).map(stryMutAct_9fa48("25604") ? () => undefined : (stryCov_9fa48("25604"), approval => <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{approval.title}</p>
                  <p className="text-xs text-neutral-500">{t('dashboard.by')} {approval.requestedBy}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={e => {
                e.stopPropagation();
                // In a real app, this would call workflowsApi.approve(approval.id)
                alert(`Approved: ${approval.title}`);
              }} className="px-3 py-1 text-xs font-medium text-success-main bg-success-light rounded-md hover:bg-success-main hover:text-white transition-colors">
                    {t('dashboard.approve')}
                  </button>
                </div>
              </div>)))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* KEY METRICS */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t('dashboard.keyMetrics')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {((stryMutAct_9fa48("25613") ? metrics.length <= 0 : stryMutAct_9fa48("25612") ? metrics.length >= 0 : stryMutAct_9fa48("25611") ? false : stryMutAct_9fa48("25610") ? true : (stryCov_9fa48("25610", "25611", "25612", "25613"), metrics.length > 0)) ? metrics : fallbackMetrics).map(stryMutAct_9fa48("25614") ? () => undefined : (stryCov_9fa48("25614"), metric => <div key={metric.id} className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs font-medium text-neutral-500 mb-1">{metric.name}</p>
              <p className="text-xl font-bold text-neutral-900">
                {(stryMutAct_9fa48("25617") ? metric.unit === 'USD' && metric.unit === 'USD/mo' : stryMutAct_9fa48("25616") ? false : stryMutAct_9fa48("25615") ? true : (stryCov_9fa48("25615", "25616", "25617"), (stryMutAct_9fa48("25619") ? metric.unit !== 'USD' : stryMutAct_9fa48("25618") ? false : (stryCov_9fa48("25618", "25619"), metric.unit === 'USD')) || (stryMutAct_9fa48("25622") ? metric.unit !== 'USD/mo' : stryMutAct_9fa48("25621") ? false : (stryCov_9fa48("25621", "25622"), metric.unit === 'USD/mo')))) ? formatCurrency(metric.value) : (stryMutAct_9fa48("25626") ? metric.unit === '%' && metric.unit === 'pts' : stryMutAct_9fa48("25625") ? false : stryMutAct_9fa48("25624") ? true : (stryCov_9fa48("25624", "25625", "25626"), (stryMutAct_9fa48("25628") ? metric.unit !== '%' : stryMutAct_9fa48("25627") ? false : (stryCov_9fa48("25627", "25628"), metric.unit === '%')) || (stryMutAct_9fa48("25631") ? metric.unit !== 'pts' : stryMutAct_9fa48("25630") ? false : (stryCov_9fa48("25630", "25631"), metric.unit === 'pts')))) ? formatNumber(metric.value, 1) : formatNumber(metric.value)}
                {stryMutAct_9fa48("25635") ? metric.unit === '%' || '%' : stryMutAct_9fa48("25634") ? false : stryMutAct_9fa48("25633") ? true : (stryCov_9fa48("25633", "25634", "25635"), (stryMutAct_9fa48("25637") ? metric.unit !== '%' : stryMutAct_9fa48("25636") ? true : (stryCov_9fa48("25636", "25637"), metric.unit === '%')) && '%')}
              </p>
              <p className={cn('text-xs font-medium mt-1', (stryMutAct_9fa48("25643") ? metric.changeType !== 'increase' : stryMutAct_9fa48("25642") ? false : stryMutAct_9fa48("25641") ? true : (stryCov_9fa48("25641", "25642", "25643"), metric.changeType === 'increase')) ? 'text-success-main' : (stryMutAct_9fa48("25648") ? metric.changeType === 'decrease' || metric.name === 'Churn' : stryMutAct_9fa48("25647") ? false : stryMutAct_9fa48("25646") ? true : (stryCov_9fa48("25646", "25647", "25648"), (stryMutAct_9fa48("25650") ? metric.changeType !== 'decrease' : stryMutAct_9fa48("25649") ? true : (stryCov_9fa48("25649", "25650"), metric.changeType === 'decrease')) && (stryMutAct_9fa48("25653") ? metric.name !== 'Churn' : stryMutAct_9fa48("25652") ? true : (stryCov_9fa48("25652", "25653"), metric.name === 'Churn')))) ? 'text-success-main' : (stryMutAct_9fa48("25658") ? metric.changeType === 'decrease' || metric.name === 'Burn Rate' : stryMutAct_9fa48("25657") ? false : stryMutAct_9fa48("25656") ? true : (stryCov_9fa48("25656", "25657", "25658"), (stryMutAct_9fa48("25660") ? metric.changeType !== 'decrease' : stryMutAct_9fa48("25659") ? true : (stryCov_9fa48("25659", "25660"), metric.changeType === 'decrease')) && (stryMutAct_9fa48("25663") ? metric.name !== 'Burn Rate' : stryMutAct_9fa48("25662") ? true : (stryCov_9fa48("25662", "25663"), metric.name === 'Burn Rate')))) ? 'text-success-main' : 'text-error-main')}>
                {(stryMutAct_9fa48("25669") ? metric.changeType !== 'increase' : stryMutAct_9fa48("25668") ? false : stryMutAct_9fa48("25667") ? true : (stryCov_9fa48("25667", "25668", "25669"), metric.changeType === 'increase')) ? '▲' : '▼'} {Math.abs(metric.change)}{(stryMutAct_9fa48("25675") ? metric.unit !== '%' : stryMutAct_9fa48("25674") ? false : stryMutAct_9fa48("25673") ? true : (stryCov_9fa48("25673", "25674", "25675"), metric.unit === '%')) ? 'pp' : '%'}
              </p>
            </div>))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ASK THE COUNCIL & ACTIVITY */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ask the Council */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{t('dashboard.askTheCouncil')}</h3>
              <p className="text-xs text-white/60">Council: Multi-agent deliberation on live data</p>
            </div>
            <button onClick={stryMutAct_9fa48("25680") ? () => undefined : (stryCov_9fa48("25680"), () => navigate('/cortex/council?tab=decisions'))} className="text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
              📝 Recent Decisions
            </button>
          </div>
          
          <div className="relative mb-4">
            <input type="text" value={queryInput} onChange={stryMutAct_9fa48("25682") ? () => undefined : (stryCov_9fa48("25682"), e => setQueryInput(e.target.value))} onKeyDown={stryMutAct_9fa48("25683") ? () => undefined : (stryCov_9fa48("25683"), e => stryMutAct_9fa48("25686") ? e.key === 'Enter' || handleQuerySubmit() : stryMutAct_9fa48("25685") ? false : stryMutAct_9fa48("25684") ? true : (stryCov_9fa48("25684", "25685", "25686"), (stryMutAct_9fa48("25688") ? e.key !== 'Enter' : stryMutAct_9fa48("25687") ? true : (stryCov_9fa48("25687", "25688"), e.key === 'Enter')) && handleQuerySubmit()))} placeholder={t('dashboard.whatToKnow')} className={cn('w-full h-12 pl-4 pr-12 rounded-lg', 'bg-white/10 border border-white/20', 'text-white placeholder:text-white/60', 'focus:outline-none focus:ring-2 focus:ring-white/30')} />
            <button onClick={handleQuerySubmit} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10">
              🎤
            </button>
          </div>

          <div>
            <p className="text-sm text-white/70 mb-2">{t('dashboard.recentQueries')}</p>
            <div className="space-y-2">
              {recentQueries.map(stryMutAct_9fa48("25696") ? () => undefined : (stryCov_9fa48("25696"), (query, i) => <button key={i} onClick={stryMutAct_9fa48("25697") ? () => undefined : (stryCov_9fa48("25697"), () => setQueryInput(query))} className="block w-full text-left text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                  "{query}"
                </button>))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">{t('dashboard.recentActivity')}</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              {t('dashboard.viewFullLog')} →
            </button>
          </div>

          <div className="space-y-3">
            {fallbackActivity.map(stryMutAct_9fa48("25700") ? () => undefined : (stryCov_9fa48("25700"), activity => <div key={activity.id} className="flex items-start gap-3">
                <span className={cn('mt-1.5 w-2 h-2 rounded-full flex-shrink-0', stryMutAct_9fa48("25704") ? activity.type === 'success' || 'bg-success-main' : stryMutAct_9fa48("25703") ? false : stryMutAct_9fa48("25702") ? true : (stryCov_9fa48("25702", "25703", "25704"), (stryMutAct_9fa48("25706") ? activity.type !== 'success' : stryMutAct_9fa48("25705") ? true : (stryCov_9fa48("25705", "25706"), activity.type === 'success')) && 'bg-success-main'), stryMutAct_9fa48("25711") ? activity.type === 'info' || 'bg-info-main' : stryMutAct_9fa48("25710") ? false : stryMutAct_9fa48("25709") ? true : (stryCov_9fa48("25709", "25710", "25711"), (stryMutAct_9fa48("25713") ? activity.type !== 'info' : stryMutAct_9fa48("25712") ? true : (stryCov_9fa48("25712", "25713"), activity.type === 'info')) && 'bg-info-main'), stryMutAct_9fa48("25718") ? activity.type === 'warning' || 'bg-warning-main' : stryMutAct_9fa48("25717") ? false : stryMutAct_9fa48("25716") ? true : (stryCov_9fa48("25716", "25717", "25718"), (stryMutAct_9fa48("25720") ? activity.type !== 'warning' : stryMutAct_9fa48("25719") ? true : (stryCov_9fa48("25719", "25720"), activity.type === 'warning')) && 'bg-warning-main'), stryMutAct_9fa48("25725") ? activity.type === 'error' || 'bg-error-main' : stryMutAct_9fa48("25724") ? false : stryMutAct_9fa48("25723") ? true : (stryCov_9fa48("25723", "25724", "25725"), (stryMutAct_9fa48("25727") ? activity.type !== 'error' : stryMutAct_9fa48("25726") ? true : (stryCov_9fa48("25726", "25727"), activity.type === 'error')) && 'bg-error-main'))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-700">{activity.message}</p>
                  <p className="text-xs text-neutral-400">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* USER JOURNEY / STORYBOARD */}
      {/* ================================================================= */}
      
      {/* Start Journey Button (shown when no journey active) */}
      {stryMutAct_9fa48("25732") ? !activeJourney && !showJourneySelector || <button onClick={() => setShowJourneySelector(true)} className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <Compass className="w-5 h-5" />
          <span className="font-medium">Start Your Journey</span>
        </button> : stryMutAct_9fa48("25731") ? false : stryMutAct_9fa48("25730") ? true : (stryCov_9fa48("25730", "25731", "25732"), (stryMutAct_9fa48("25734") ? !activeJourney || !showJourneySelector : stryMutAct_9fa48("25733") ? true : (stryCov_9fa48("25733", "25734"), (stryMutAct_9fa48("25735") ? activeJourney : (stryCov_9fa48("25735"), !activeJourney)) && (stryMutAct_9fa48("25736") ? showJourneySelector : (stryCov_9fa48("25736"), !showJourneySelector)))) && <button onClick={stryMutAct_9fa48("25737") ? () => undefined : (stryCov_9fa48("25737"), () => setShowJourneySelector(stryMutAct_9fa48("25738") ? false : (stryCov_9fa48("25738"), true)))} className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <Compass className="w-5 h-5" />
          <span className="font-medium">Start Your Journey</span>
        </button>)}

      {/* Journey Selector Modal */}
      {stryMutAct_9fa48("25741") ? showJourneySelector || <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Choose Your Journey</h2>
                <p className="text-primary-100 text-sm mt-1">Select a guided experience tailored to your role</p>
              </div>
              <button onClick={() => setShowJourneySelector(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <NarrativeSelector onSelect={handleSelectJourney} />
            </div>
          </div>
        </div> : stryMutAct_9fa48("25740") ? false : stryMutAct_9fa48("25739") ? true : (stryCov_9fa48("25739", "25740", "25741"), showJourneySelector && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Choose Your Journey</h2>
                <p className="text-primary-100 text-sm mt-1">Select a guided experience tailored to your role</p>
              </div>
              <button onClick={stryMutAct_9fa48("25742") ? () => undefined : (stryCov_9fa48("25742"), () => setShowJourneySelector(stryMutAct_9fa48("25743") ? true : (stryCov_9fa48("25743"), false)))} className="text-white/80 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <NarrativeSelector onSelect={handleSelectJourney} />
            </div>
          </div>
        </div>)}

      {/* Active Journey Guide (Floating) */}
      {stryMutAct_9fa48("25746") ? activeJourney || <NarrativeGuide narrativeId={activeJourney} variant="floating" onComplete={handleJourneyComplete} /> : stryMutAct_9fa48("25745") ? false : stryMutAct_9fa48("25744") ? true : (stryCov_9fa48("25744", "25745", "25746"), activeJourney && <NarrativeGuide narrativeId={activeJourney} variant="floating" onComplete={handleJourneyComplete} />)}
    </div>;
};
export default DashboardPage;