// @ts-nocheck
// =============================================================================
// DATACENDIA - PILLARS PAGES (The 8 Foundational Data Layers)
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
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
import { X, ExternalLink, Play, AlertTriangle, Shield, Clock, TrendingUp, TrendingDown } from 'lucide-react';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

const PillarHeader: React.FC<{
  icon: string;
  name: string;
  tagline: string;
  color: string;
}> = stryMutAct_9fa48("47658") ? () => undefined : (stryCov_9fa48("47658"), (() => {
  const PillarHeader: React.FC<{
    icon: string;
    name: string;
    tagline: string;
    color: string;
  }> = ({
    icon,
    name,
    tagline,
    color
  }) => <div className="mb-8">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={stryMutAct_9fa48("47659") ? {} : (stryCov_9fa48("47659"), {
        backgroundColor: `${color}20`
      })}>
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
        <p className="text-neutral-500">{tagline}</p>
      </div>
    </div>
  </div>;
  return PillarHeader;
})());
const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
}> = stryMutAct_9fa48("47661") ? () => undefined : (stryCov_9fa48("47661"), (() => {
  const MetricCard: React.FC<{
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
    unit?: string;
  }> = ({
    label,
    value,
    change,
    trend,
    unit
  }) => <div className="bg-white rounded-xl border border-neutral-200 p-4">
    <p className="text-sm text-neutral-500 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-neutral-900">
        {value}{stryMutAct_9fa48("47664") ? unit || <span className="text-base font-normal text-neutral-500">{unit}</span> : stryMutAct_9fa48("47663") ? false : stryMutAct_9fa48("47662") ? true : (stryCov_9fa48("47662", "47663", "47664"), unit && <span className="text-base font-normal text-neutral-500">{unit}</span>)}
      </span>
      {stryMutAct_9fa48("47667") ? change !== undefined || <span className={cn('text-sm font-medium', trend === 'up' && 'text-success-main', trend === 'down' && 'text-error-main', trend === 'stable' && 'text-neutral-500')}>
          {trend === 'up' && '↑'}{trend === 'down' && '↓'}{Math.abs(change)}%
        </span> : stryMutAct_9fa48("47666") ? false : stryMutAct_9fa48("47665") ? true : (stryCov_9fa48("47665", "47666", "47667"), (stryMutAct_9fa48("47669") ? change === undefined : stryMutAct_9fa48("47668") ? true : (stryCov_9fa48("47668", "47669"), change !== undefined)) && <span className={cn('text-sm font-medium', stryMutAct_9fa48("47673") ? trend === 'up' || 'text-success-main' : stryMutAct_9fa48("47672") ? false : stryMutAct_9fa48("47671") ? true : (stryCov_9fa48("47671", "47672", "47673"), (stryMutAct_9fa48("47675") ? trend !== 'up' : stryMutAct_9fa48("47674") ? true : (stryCov_9fa48("47674", "47675"), trend === 'up')) && 'text-success-main'), stryMutAct_9fa48("47680") ? trend === 'down' || 'text-error-main' : stryMutAct_9fa48("47679") ? false : stryMutAct_9fa48("47678") ? true : (stryCov_9fa48("47678", "47679", "47680"), (stryMutAct_9fa48("47682") ? trend !== 'down' : stryMutAct_9fa48("47681") ? true : (stryCov_9fa48("47681", "47682"), trend === 'down')) && 'text-error-main'), stryMutAct_9fa48("47687") ? trend === 'stable' || 'text-neutral-500' : stryMutAct_9fa48("47686") ? false : stryMutAct_9fa48("47685") ? true : (stryCov_9fa48("47685", "47686", "47687"), (stryMutAct_9fa48("47689") ? trend !== 'stable' : stryMutAct_9fa48("47688") ? true : (stryCov_9fa48("47688", "47689"), trend === 'stable')) && 'text-neutral-500'))}>
          {stryMutAct_9fa48("47694") ? trend === 'up' || '↑' : stryMutAct_9fa48("47693") ? false : stryMutAct_9fa48("47692") ? true : (stryCov_9fa48("47692", "47693", "47694"), (stryMutAct_9fa48("47696") ? trend !== 'up' : stryMutAct_9fa48("47695") ? true : (stryCov_9fa48("47695", "47696"), trend === 'up')) && '↑')}{stryMutAct_9fa48("47701") ? trend === 'down' || '↓' : stryMutAct_9fa48("47700") ? false : stryMutAct_9fa48("47699") ? true : (stryCov_9fa48("47699", "47700", "47701"), (stryMutAct_9fa48("47703") ? trend !== 'down' : stryMutAct_9fa48("47702") ? true : (stryCov_9fa48("47702", "47703"), trend === 'down')) && '↓')}{Math.abs(change)}%
        </span>)}
    </div>
  </div>;
  return MetricCard;
})());

// =============================================================================
// THE HELM - Metrics & KPIs (Enhanced)
// =============================================================================

interface HelmMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'critical' | 'stable';
  trend: number;
  owner?: string;
  ownerRole?: string;
  threshold?: number;
  target?: number;
  lastUpdated?: string;
  type?: 'leading' | 'lagging';
  linkedDecisionId?: string;
  linkedCrucibleId?: string;
}
interface HelmCategory {
  id: string;
  name: string;
  icon: string;
  color?: string;
  metrics: HelmMetric[];
}
interface HelmDashboard {
  totalMetrics: number;
  onTarget: number;
  atRisk: number;
  critical: number;
  healthScore?: number;
  healthTrend?: number;
  lastUpdated?: string;
  escalatedToCouncil?: number;
  categories: HelmCategory[];
}

// Category icons and colors
const CATEGORY_CONFIG: Record<string, {
  icon: string;
  color: string;
  bg: string;
}> = stryMutAct_9fa48("47706") ? {} : (stryCov_9fa48("47706"), {
  'financial': stryMutAct_9fa48("47707") ? {} : (stryCov_9fa48("47707"), {
    icon: '💰',
    color: '#10B981',
    bg: 'bg-emerald-50'
  }),
  'operational': stryMutAct_9fa48("47711") ? {} : (stryCov_9fa48("47711"), {
    icon: '⚙️',
    color: '#6366F1',
    bg: 'bg-indigo-50'
  }),
  'customer': stryMutAct_9fa48("47715") ? {} : (stryCov_9fa48("47715"), {
    icon: '❤️',
    color: '#EC4899',
    bg: 'bg-pink-50'
  }),
  'people': stryMutAct_9fa48("47719") ? {} : (stryCov_9fa48("47719"), {
    icon: '👥',
    color: '#F59E0B',
    bg: 'bg-amber-50'
  }),
  'strategic': stryMutAct_9fa48("47723") ? {} : (stryCov_9fa48("47723"), {
    icon: '🎯',
    color: '#8B5CF6',
    bg: 'bg-purple-50'
  }),
  'compliance': stryMutAct_9fa48("47727") ? {} : (stryCov_9fa48("47727"), {
    icon: '⚖️',
    color: '#06B6D4',
    bg: 'bg-cyan-50'
  }),
  'default': stryMutAct_9fa48("47731") ? {} : (stryCov_9fa48("47731"), {
    icon: '📊',
    color: '#64748B',
    bg: 'bg-slate-50'
  })
});

// Pre-built metric packs
const METRIC_PACKS = stryMutAct_9fa48("47735") ? [] : (stryCov_9fa48("47735"), [stryMutAct_9fa48("47736") ? {} : (stryCov_9fa48("47736"), {
  id: 'cfo',
  name: 'CFO Pack',
  icon: '💰',
  metrics: stryMutAct_9fa48("47740") ? [] : (stryCov_9fa48("47740"), ['Revenue', 'Gross Margin', 'Cash Flow', 'Runway'])
}), stryMutAct_9fa48("47745") ? {} : (stryCov_9fa48("47745"), {
  id: 'coo',
  name: 'COO Pack',
  icon: '⚙️',
  metrics: stryMutAct_9fa48("47749") ? [] : (stryCov_9fa48("47749"), ['Throughput', 'Defect Rate', 'Cycle Time', 'Utilization'])
}), stryMutAct_9fa48("47754") ? {} : (stryCov_9fa48("47754"), {
  id: 'chro',
  name: 'CHRO Pack',
  icon: '👥',
  metrics: stryMutAct_9fa48("47758") ? [] : (stryCov_9fa48("47758"), ['Engagement Score', 'Time-to-Hire', 'Attrition Rate', 'eNPS'])
}), stryMutAct_9fa48("47763") ? {} : (stryCov_9fa48("47763"), {
  id: 'cmo',
  name: 'CMO Pack',
  icon: '📢',
  metrics: stryMutAct_9fa48("47767") ? [] : (stryCov_9fa48("47767"), ['CAC', 'LTV', 'NPS', 'Brand Awareness'])
})]);

// Owner avatars
const OWNER_AVATARS: Record<string, string> = stryMutAct_9fa48("47772") ? {} : (stryCov_9fa48("47772"), {
  'CFO': '💰',
  'COO': '⚙️',
  'CMO': '📢',
  'CHRO': '👥',
  'CTO': '💻',
  'CEO': '👔'
});
export const HelmPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<HelmDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("47780") ? false : (stryCov_9fa48("47780"), true));
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'quarter'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<HelmCategory | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<HelmMetric | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'at_risk' | 'critical'>('all');
  useEffect(() => {
    const loadHelmData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("47786") ? false : (stryCov_9fa48("47786"), true));
        const res = await api.get<HelmDashboard>('/pillars/helm/dashboard', stryMutAct_9fa48("47788") ? {} : (stryCov_9fa48("47788"), {
          organizationId: 'demo'
        }));
        if (stryMutAct_9fa48("47792") ? res.success || res.data : stryMutAct_9fa48("47791") ? false : stryMutAct_9fa48("47790") ? true : (stryCov_9fa48("47790", "47791", "47792"), res.success && res.data)) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error('Failed to load helm data:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("47797") ? true : (stryCov_9fa48("47797"), false));
      }
    };
    loadHelmData();
  }, stryMutAct_9fa48("47798") ? [] : (stryCov_9fa48("47798"), [timeframe]));
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'on_track':
        if (stryMutAct_9fa48("47800")) {} else {
          stryCov_9fa48("47800");
          return 'bg-success-light text-success-dark';
        }
      case 'at_risk':
        if (stryMutAct_9fa48("47803")) {} else {
          stryCov_9fa48("47803");
          return 'bg-warning-light text-warning-dark';
        }
      case 'critical':
        if (stryMutAct_9fa48("47806")) {} else {
          stryCov_9fa48("47806");
          return 'bg-error-light text-error-dark';
        }
      default:
        if (stryMutAct_9fa48("47809")) {} else {
          stryCov_9fa48("47809");
          return 'bg-neutral-100 text-neutral-600';
        }
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        if (stryMutAct_9fa48("47812")) {} else {
          stryCov_9fa48("47812");
          return 'On Track';
        }
      case 'at_risk':
        if (stryMutAct_9fa48("47815")) {} else {
          stryCov_9fa48("47815");
          return 'At Risk';
        }
      case 'critical':
        if (stryMutAct_9fa48("47818")) {} else {
          stryCov_9fa48("47818");
          return 'Critical';
        }
      default:
        if (stryMutAct_9fa48("47821")) {} else {
          stryCov_9fa48("47821");
          return 'Stable';
        }
    }
  };
  const getCategoryConfig = (name: string | undefined) => {
    if (stryMutAct_9fa48("47826") ? false : stryMutAct_9fa48("47825") ? true : stryMutAct_9fa48("47824") ? name : (stryCov_9fa48("47824", "47825", "47826"), !name)) return CATEGORY_CONFIG['default'];
    const key = stryMutAct_9fa48("47828") ? name.toUpperCase() : (stryCov_9fa48("47828"), name.toLowerCase());
    return stryMutAct_9fa48("47831") ? CATEGORY_CONFIG[key] && CATEGORY_CONFIG['default'] : stryMutAct_9fa48("47830") ? false : stryMutAct_9fa48("47829") ? true : (stryCov_9fa48("47829", "47830", "47831"), CATEGORY_CONFIG[key] || CATEGORY_CONFIG['default']);
  };
  const getCategoryStats = (cat: HelmCategory | null | undefined) => {
    if (stryMutAct_9fa48("47836") ? false : stryMutAct_9fa48("47835") ? true : stryMutAct_9fa48("47834") ? cat : (stryCov_9fa48("47834", "47835", "47836"), !cat)) return stryMutAct_9fa48("47837") ? {} : (stryCov_9fa48("47837"), {
      total: 0,
      onTrack: 0,
      atRisk: 0,
      critical: 0,
      owners: stryMutAct_9fa48("47838") ? ["Stryker was here"] : (stryCov_9fa48("47838"), [])
    });
    const metrics = stryMutAct_9fa48("47841") ? cat.metrics && [] : stryMutAct_9fa48("47840") ? false : stryMutAct_9fa48("47839") ? true : (stryCov_9fa48("47839", "47840", "47841"), cat.metrics || (stryMutAct_9fa48("47842") ? ["Stryker was here"] : (stryCov_9fa48("47842"), [])));
    return stryMutAct_9fa48("47843") ? {} : (stryCov_9fa48("47843"), {
      total: metrics.length,
      onTrack: stryMutAct_9fa48("47844") ? metrics.length : (stryCov_9fa48("47844"), metrics.filter(stryMutAct_9fa48("47845") ? () => undefined : (stryCov_9fa48("47845"), m => stryMutAct_9fa48("47848") ? m.status === 'on_track' && m.status === 'stable' : stryMutAct_9fa48("47847") ? false : stryMutAct_9fa48("47846") ? true : (stryCov_9fa48("47846", "47847", "47848"), (stryMutAct_9fa48("47850") ? m.status !== 'on_track' : stryMutAct_9fa48("47849") ? false : (stryCov_9fa48("47849", "47850"), m.status === 'on_track')) || (stryMutAct_9fa48("47853") ? m.status !== 'stable' : stryMutAct_9fa48("47852") ? false : (stryCov_9fa48("47852", "47853"), m.status === 'stable'))))).length),
      atRisk: stryMutAct_9fa48("47855") ? metrics.length : (stryCov_9fa48("47855"), metrics.filter(stryMutAct_9fa48("47856") ? () => undefined : (stryCov_9fa48("47856"), m => stryMutAct_9fa48("47859") ? m.status !== 'at_risk' : stryMutAct_9fa48("47858") ? false : stryMutAct_9fa48("47857") ? true : (stryCov_9fa48("47857", "47858", "47859"), m.status === 'at_risk'))).length),
      critical: stryMutAct_9fa48("47861") ? metrics.length : (stryCov_9fa48("47861"), metrics.filter(stryMutAct_9fa48("47862") ? () => undefined : (stryCov_9fa48("47862"), m => stryMutAct_9fa48("47865") ? m.status !== 'critical' : stryMutAct_9fa48("47864") ? false : stryMutAct_9fa48("47863") ? true : (stryCov_9fa48("47863", "47864", "47865"), m.status === 'critical'))).length),
      owners: stryMutAct_9fa48("47867") ? [] : (stryCov_9fa48("47867"), [...new Set(stryMutAct_9fa48("47868") ? metrics.map(m => m.ownerRole) : (stryCov_9fa48("47868"), metrics.map(stryMutAct_9fa48("47869") ? () => undefined : (stryCov_9fa48("47869"), m => m.ownerRole)).filter(Boolean)))])
    });
  };
  const healthScore = stryMutAct_9fa48("47870") ? dashboard?.healthScore && Math.round((dashboard?.onTarget ?? 0) / Math.max(1, dashboard?.totalMetrics ?? 1) * 100) : (stryCov_9fa48("47870"), (stryMutAct_9fa48("47871") ? dashboard.healthScore : (stryCov_9fa48("47871"), dashboard?.healthScore)) ?? Math.round(stryMutAct_9fa48("47872") ? (dashboard?.onTarget ?? 0) / Math.max(1, dashboard?.totalMetrics ?? 1) / 100 : (stryCov_9fa48("47872"), (stryMutAct_9fa48("47873") ? (dashboard?.onTarget ?? 0) * Math.max(1, dashboard?.totalMetrics ?? 1) : (stryCov_9fa48("47873"), (stryMutAct_9fa48("47874") ? dashboard?.onTarget && 0 : (stryCov_9fa48("47874"), (stryMutAct_9fa48("47875") ? dashboard.onTarget : (stryCov_9fa48("47875"), dashboard?.onTarget)) ?? 0)) / (stryMutAct_9fa48("47876") ? Math.min(1, dashboard?.totalMetrics ?? 1) : (stryCov_9fa48("47876"), Math.max(1, stryMutAct_9fa48("47877") ? dashboard?.totalMetrics && 1 : (stryCov_9fa48("47877"), (stryMutAct_9fa48("47878") ? dashboard.totalMetrics : (stryCov_9fa48("47878"), dashboard?.totalMetrics)) ?? 1)))))) * 100)));
  const healthTrend = stryMutAct_9fa48("47879") ? dashboard?.healthTrend && 3 : (stryCov_9fa48("47879"), (stryMutAct_9fa48("47880") ? dashboard.healthTrend : (stryCov_9fa48("47880"), dashboard?.healthTrend)) ?? 3);
  const onTargetPct = Math.round(stryMutAct_9fa48("47881") ? (dashboard?.onTarget ?? 0) / Math.max(1, dashboard?.totalMetrics ?? 1) / 100 : (stryCov_9fa48("47881"), (stryMutAct_9fa48("47882") ? (dashboard?.onTarget ?? 0) * Math.max(1, dashboard?.totalMetrics ?? 1) : (stryCov_9fa48("47882"), (stryMutAct_9fa48("47883") ? dashboard?.onTarget && 0 : (stryCov_9fa48("47883"), (stryMutAct_9fa48("47884") ? dashboard.onTarget : (stryCov_9fa48("47884"), dashboard?.onTarget)) ?? 0)) / (stryMutAct_9fa48("47885") ? Math.min(1, dashboard?.totalMetrics ?? 1) : (stryCov_9fa48("47885"), Math.max(1, stryMutAct_9fa48("47886") ? dashboard?.totalMetrics && 1 : (stryCov_9fa48("47886"), (stryMutAct_9fa48("47887") ? dashboard.totalMetrics : (stryCov_9fa48("47887"), dashboard?.totalMetrics)) ?? 1)))))) * 100));
  const atRiskPct = Math.round(stryMutAct_9fa48("47888") ? (dashboard?.atRisk ?? 0) / Math.max(1, dashboard?.totalMetrics ?? 1) / 100 : (stryCov_9fa48("47888"), (stryMutAct_9fa48("47889") ? (dashboard?.atRisk ?? 0) * Math.max(1, dashboard?.totalMetrics ?? 1) : (stryCov_9fa48("47889"), (stryMutAct_9fa48("47890") ? dashboard?.atRisk && 0 : (stryCov_9fa48("47890"), (stryMutAct_9fa48("47891") ? dashboard.atRisk : (stryCov_9fa48("47891"), dashboard?.atRisk)) ?? 0)) / (stryMutAct_9fa48("47892") ? Math.min(1, dashboard?.totalMetrics ?? 1) : (stryCov_9fa48("47892"), Math.max(1, stryMutAct_9fa48("47893") ? dashboard?.totalMetrics && 1 : (stryCov_9fa48("47893"), (stryMutAct_9fa48("47894") ? dashboard.totalMetrics : (stryCov_9fa48("47894"), dashboard?.totalMetrics)) ?? 1)))))) * 100));
  const criticalPct = stryMutAct_9fa48("47895") ? 100 - onTargetPct + atRiskPct : (stryCov_9fa48("47895"), (stryMutAct_9fa48("47896") ? 100 + onTargetPct : (stryCov_9fa48("47896"), 100 - onTargetPct)) - atRiskPct);
  if (stryMutAct_9fa48("47898") ? false : stryMutAct_9fa48("47897") ? true : (stryCov_9fa48("47897", "47898"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="🎯" name="The Helm" tagline="Single source of truth for organizational metrics" color="#6366F1" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-neutral-500">Loading metrics data...</span>
        </div>
      </div>;
  }
  return <div className="p-6">
      {/* Header with last updated */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl bg-indigo-100">🎯</div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">The Helm</h1>
              <p className="text-neutral-500">Single source of truth for organizational metrics</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <select value={timeframe} onChange={stryMutAct_9fa48("47900") ? () => undefined : (stryCov_9fa48("47900"), e => setTimeframe(e.target.value as any))} className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <p className="text-xs text-neutral-400">
            <Clock className="w-3 h-3 inline mr-1" />
            Last updated: {(stryMutAct_9fa48("47901") ? dashboard.lastUpdated : (stryCov_9fa48("47901"), dashboard?.lastUpdated)) ? new Date(dashboard.lastUpdated).toLocaleString() : 'Just now'}
          </p>
        </div>
      </div>

      {/* Health Summary Card */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Organizational Health</h3>
          {stryMutAct_9fa48("47905") ? (dashboard?.escalatedToCouncil ?? 0) > 0 || <button onClick={() => navigate('/cortex/intelligence/decision-dna?filter=escalated')} className="text-xs text-warning-dark bg-warning-light px-3 py-1 rounded-full hover:bg-warning-main hover:text-white transition-colors">
              {dashboard?.escalatedToCouncil} metrics escalated to Council →
            </button> : stryMutAct_9fa48("47904") ? false : stryMutAct_9fa48("47903") ? true : (stryCov_9fa48("47903", "47904", "47905"), (stryMutAct_9fa48("47908") ? (dashboard?.escalatedToCouncil ?? 0) <= 0 : stryMutAct_9fa48("47907") ? (dashboard?.escalatedToCouncil ?? 0) >= 0 : stryMutAct_9fa48("47906") ? true : (stryCov_9fa48("47906", "47907", "47908"), (stryMutAct_9fa48("47909") ? dashboard?.escalatedToCouncil && 0 : (stryCov_9fa48("47909"), (stryMutAct_9fa48("47910") ? dashboard.escalatedToCouncil : (stryCov_9fa48("47910"), dashboard?.escalatedToCouncil)) ?? 0)) > 0)) && <button onClick={stryMutAct_9fa48("47911") ? () => undefined : (stryCov_9fa48("47911"), () => navigate('/cortex/intelligence/decision-dna?filter=escalated'))} className="text-xs text-warning-dark bg-warning-light px-3 py-1 rounded-full hover:bg-warning-main hover:text-white transition-colors">
              {stryMutAct_9fa48("47913") ? dashboard.escalatedToCouncil : (stryCov_9fa48("47913"), dashboard?.escalatedToCouncil)} metrics escalated to Council →
            </button>)}
        </div>
        <div className="flex items-center gap-8">
          {/* Health Score Circle */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" fill="none" stroke="#E5E7EB" strokeWidth="10" />
              <circle cx="56" cy="56" r="48" fill="none" stroke={(stryMutAct_9fa48("47917") ? healthScore < 80 : stryMutAct_9fa48("47916") ? healthScore > 80 : stryMutAct_9fa48("47915") ? false : stryMutAct_9fa48("47914") ? true : (stryCov_9fa48("47914", "47915", "47916", "47917"), healthScore >= 80)) ? '#10B981' : (stryMutAct_9fa48("47922") ? healthScore < 60 : stryMutAct_9fa48("47921") ? healthScore > 60 : stryMutAct_9fa48("47920") ? false : stryMutAct_9fa48("47919") ? true : (stryCov_9fa48("47919", "47920", "47921", "47922"), healthScore >= 60)) ? '#F59E0B' : '#EF4444'} strokeWidth="10" strokeDasharray={`${stryMutAct_9fa48("47926") ? healthScore / 3.02 : (stryCov_9fa48("47926"), healthScore * 3.02)} 302`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-neutral-900">{healthScore}</span>
              <span className="text-xs text-neutral-500">Score</span>
            </div>
          </div>

          {/* Trend */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 mb-1">
              {(stryMutAct_9fa48("47930") ? healthTrend < 0 : stryMutAct_9fa48("47929") ? healthTrend > 0 : stryMutAct_9fa48("47928") ? false : stryMutAct_9fa48("47927") ? true : (stryCov_9fa48("47927", "47928", "47929", "47930"), healthTrend >= 0)) ? <TrendingUp className="w-5 h-5 text-success-main" /> : <TrendingDown className="w-5 h-5 text-error-main" />}
              <span className={cn('text-lg font-semibold', (stryMutAct_9fa48("47935") ? healthTrend < 0 : stryMutAct_9fa48("47934") ? healthTrend > 0 : stryMutAct_9fa48("47933") ? false : stryMutAct_9fa48("47932") ? true : (stryCov_9fa48("47932", "47933", "47934", "47935"), healthTrend >= 0)) ? 'text-success-dark' : 'text-error-dark')}>
                {(stryMutAct_9fa48("47941") ? healthTrend < 0 : stryMutAct_9fa48("47940") ? healthTrend > 0 : stryMutAct_9fa48("47939") ? false : stryMutAct_9fa48("47938") ? true : (stryCov_9fa48("47938", "47939", "47940", "47941"), healthTrend >= 0)) ? '+' : ''}{healthTrend}%
              </span>
            </div>
            <p className="text-xs text-neutral-500">vs last {(stryMutAct_9fa48("47946") ? timeframe !== '7d' : stryMutAct_9fa48("47945") ? false : stryMutAct_9fa48("47944") ? true : (stryCov_9fa48("47944", "47945", "47946"), timeframe === '7d')) ? 'week' : (stryMutAct_9fa48("47951") ? timeframe !== '30d' : stryMutAct_9fa48("47950") ? false : stryMutAct_9fa48("47949") ? true : (stryCov_9fa48("47949", "47950", "47951"), timeframe === '30d')) ? 'month' : 'quarter'}</p>
          </div>

          {/* Stacked Bar */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2 text-sm">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success-main"></span> On Target {onTargetPct}%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning-main"></span> At Risk {atRiskPct}%</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error-main"></span> Critical {criticalPct}%</span>
            </div>
            <div className="h-4 bg-neutral-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-success-main" style={stryMutAct_9fa48("47955") ? {} : (stryCov_9fa48("47955"), {
              width: `${onTargetPct}%`
            })} />
              <div className="h-full bg-warning-main" style={stryMutAct_9fa48("47957") ? {} : (stryCov_9fa48("47957"), {
              width: `${atRiskPct}%`
            })} />
              <div className="h-full bg-error-main" style={stryMutAct_9fa48("47959") ? {} : (stryCov_9fa48("47959"), {
              width: `${criticalPct}%`
            })} />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={stryMutAct_9fa48("47961") ? () => undefined : (stryCov_9fa48("47961"), () => setStatusFilter((stryMutAct_9fa48("47964") ? statusFilter !== 'at_risk' : stryMutAct_9fa48("47963") ? false : stryMutAct_9fa48("47962") ? true : (stryCov_9fa48("47962", "47963", "47964"), statusFilter === 'at_risk')) ? 'all' : 'at_risk'))} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', (stryMutAct_9fa48("47971") ? statusFilter !== 'at_risk' : stryMutAct_9fa48("47970") ? false : stryMutAct_9fa48("47969") ? true : (stryCov_9fa48("47969", "47970", "47971"), statusFilter === 'at_risk')) ? 'bg-warning-main text-white' : 'bg-warning-light text-warning-dark hover:bg-warning-main hover:text-white')}>
              {stryMutAct_9fa48("47975") ? dashboard?.atRisk && 0 : (stryCov_9fa48("47975"), (stryMutAct_9fa48("47976") ? dashboard.atRisk : (stryCov_9fa48("47976"), dashboard?.atRisk)) ?? 0)} At Risk
            </button>
            <button onClick={stryMutAct_9fa48("47977") ? () => undefined : (stryCov_9fa48("47977"), () => setStatusFilter((stryMutAct_9fa48("47980") ? statusFilter !== 'critical' : stryMutAct_9fa48("47979") ? false : stryMutAct_9fa48("47978") ? true : (stryCov_9fa48("47978", "47979", "47980"), statusFilter === 'critical')) ? 'all' : 'critical'))} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', (stryMutAct_9fa48("47987") ? statusFilter !== 'critical' : stryMutAct_9fa48("47986") ? false : stryMutAct_9fa48("47985") ? true : (stryCov_9fa48("47985", "47986", "47987"), statusFilter === 'critical')) ? 'bg-error-main text-white' : 'bg-error-light text-error-dark hover:bg-error-main hover:text-white')}>
              {stryMutAct_9fa48("47991") ? dashboard?.critical && 0 : (stryCov_9fa48("47991"), (stryMutAct_9fa48("47992") ? dashboard.critical : (stryCov_9fa48("47992"), dashboard?.critical)) ?? 0)} Critical
            </button>
          </div>
        </div>
      </div>

      {/* Metric Categories */}
      {(stryMutAct_9fa48("47996") ? (dashboard?.categories?.length ?? 0) <= 0 : stryMutAct_9fa48("47995") ? (dashboard?.categories?.length ?? 0) >= 0 : stryMutAct_9fa48("47994") ? false : stryMutAct_9fa48("47993") ? true : (stryCov_9fa48("47993", "47994", "47995", "47996"), (stryMutAct_9fa48("47997") ? dashboard?.categories?.length && 0 : (stryCov_9fa48("47997"), (stryMutAct_9fa48("47999") ? dashboard.categories?.length : stryMutAct_9fa48("47998") ? dashboard?.categories.length : (stryCov_9fa48("47998", "47999"), dashboard?.categories?.length)) ?? 0)) > 0)) ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stryMutAct_9fa48("48000") ? (dashboard?.categories || []).map((cat, idx) => {
        const config = getCategoryConfig(cat?.name);
        const stats = getCategoryStats(cat);
        const metrics = cat?.metrics || [];
        const filteredMetrics = statusFilter === 'all' ? metrics : metrics.filter(m => m.status === statusFilter);
        if (statusFilter !== 'all' && filteredMetrics.length === 0) return null;
        return <button key={cat?.id || idx} onClick={() => setSelectedCategory(cat)} className={cn('p-5 rounded-xl border border-neutral-200 text-left hover:border-primary-500 hover:shadow-md transition-all', config.bg)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat?.icon || config.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{cat?.name || 'Category'}</h3>
                      <p className="text-sm text-neutral-500">{stats.total} metrics</p>
                    </div>
                  </div>
                  {/* Owner avatars */}
                  {stats.owners.length > 0 && <div className="flex -space-x-2">
                      {stats.owners.slice(0, 3).map((owner, i) => <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-sm" title={owner}>
                          {OWNER_AVATARS[owner as string] || '👤'}
                        </div>)}
                    </div>}
                </div>

                {/* Mini status bar */}
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden flex mb-3">
                  {stats.onTrack > 0 && <div className="h-full bg-success-main" style={{
              width: `${stats.onTrack / stats.total * 100}%`
            }} />}
                  {stats.atRisk > 0 && <div className="h-full bg-warning-main" style={{
              width: `${stats.atRisk / stats.total * 100}%`
            }} />}
                  {stats.critical > 0 && <div className="h-full bg-error-main" style={{
              width: `${stats.critical / stats.total * 100}%`
            }} />}
                </div>

                {/* Status pills */}
                <div className="flex items-center gap-2 text-xs">
                  {stats.onTrack > 0 && <span className="px-2 py-0.5 bg-success-light text-success-dark rounded-full">On target {stats.onTrack}</span>}
                  {stats.atRisk > 0 && <span className="px-2 py-0.5 bg-warning-light text-warning-dark rounded-full">At risk {stats.atRisk}</span>}
                  {stats.critical > 0 && <span className="px-2 py-0.5 bg-error-light text-error-dark rounded-full">Critical {stats.critical}</span>}
                </div>
              </button>;
      }) : (stryCov_9fa48("48000"), (stryMutAct_9fa48("48003") ? dashboard?.categories && [] : stryMutAct_9fa48("48002") ? false : stryMutAct_9fa48("48001") ? true : (stryCov_9fa48("48001", "48002", "48003"), (stryMutAct_9fa48("48004") ? dashboard.categories : (stryCov_9fa48("48004"), dashboard?.categories)) || (stryMutAct_9fa48("48005") ? ["Stryker was here"] : (stryCov_9fa48("48005"), [])))).filter(stryMutAct_9fa48("48006") ? () => undefined : (stryCov_9fa48("48006"), cat => stryMutAct_9fa48("48009") ? cat || typeof cat === 'object' : stryMutAct_9fa48("48008") ? false : stryMutAct_9fa48("48007") ? true : (stryCov_9fa48("48007", "48008", "48009"), cat && (stryMutAct_9fa48("48011") ? typeof cat !== 'object' : stryMutAct_9fa48("48010") ? true : (stryCov_9fa48("48010", "48011"), typeof cat === 'object'))))).map((cat, idx) => {
        const config = getCategoryConfig(stryMutAct_9fa48("48014") ? cat.name : (stryCov_9fa48("48014"), cat?.name));
        const stats = getCategoryStats(cat);
        const metrics = stryMutAct_9fa48("48017") ? cat?.metrics && [] : stryMutAct_9fa48("48016") ? false : stryMutAct_9fa48("48015") ? true : (stryCov_9fa48("48015", "48016", "48017"), (stryMutAct_9fa48("48018") ? cat.metrics : (stryCov_9fa48("48018"), cat?.metrics)) || (stryMutAct_9fa48("48019") ? ["Stryker was here"] : (stryCov_9fa48("48019"), [])));
        const filteredMetrics = (stryMutAct_9fa48("48022") ? statusFilter !== 'all' : stryMutAct_9fa48("48021") ? false : stryMutAct_9fa48("48020") ? true : (stryCov_9fa48("48020", "48021", "48022"), statusFilter === 'all')) ? metrics : stryMutAct_9fa48("48024") ? metrics : (stryCov_9fa48("48024"), metrics.filter(stryMutAct_9fa48("48025") ? () => undefined : (stryCov_9fa48("48025"), m => stryMutAct_9fa48("48028") ? m.status !== statusFilter : stryMutAct_9fa48("48027") ? false : stryMutAct_9fa48("48026") ? true : (stryCov_9fa48("48026", "48027", "48028"), m.status === statusFilter))));
        if (stryMutAct_9fa48("48031") ? statusFilter !== 'all' || filteredMetrics.length === 0 : stryMutAct_9fa48("48030") ? false : stryMutAct_9fa48("48029") ? true : (stryCov_9fa48("48029", "48030", "48031"), (stryMutAct_9fa48("48033") ? statusFilter === 'all' : stryMutAct_9fa48("48032") ? true : (stryCov_9fa48("48032", "48033"), statusFilter !== 'all')) && (stryMutAct_9fa48("48036") ? filteredMetrics.length !== 0 : stryMutAct_9fa48("48035") ? true : (stryCov_9fa48("48035", "48036"), filteredMetrics.length === 0)))) return null;
        return <button key={stryMutAct_9fa48("48039") ? cat?.id && idx : stryMutAct_9fa48("48038") ? false : stryMutAct_9fa48("48037") ? true : (stryCov_9fa48("48037", "48038", "48039"), (stryMutAct_9fa48("48040") ? cat.id : (stryCov_9fa48("48040"), cat?.id)) || idx)} onClick={stryMutAct_9fa48("48041") ? () => undefined : (stryCov_9fa48("48041"), () => setSelectedCategory(cat))} className={cn('p-5 rounded-xl border border-neutral-200 text-left hover:border-primary-500 hover:shadow-md transition-all', config.bg)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stryMutAct_9fa48("48045") ? cat?.icon && config.icon : stryMutAct_9fa48("48044") ? false : stryMutAct_9fa48("48043") ? true : (stryCov_9fa48("48043", "48044", "48045"), (stryMutAct_9fa48("48046") ? cat.icon : (stryCov_9fa48("48046"), cat?.icon)) || config.icon)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{stryMutAct_9fa48("48049") ? cat?.name && 'Category' : stryMutAct_9fa48("48048") ? false : stryMutAct_9fa48("48047") ? true : (stryCov_9fa48("48047", "48048", "48049"), (stryMutAct_9fa48("48050") ? cat.name : (stryCov_9fa48("48050"), cat?.name)) || 'Category')}</h3>
                      <p className="text-sm text-neutral-500">{stats.total} metrics</p>
                    </div>
                  </div>
                  {/* Owner avatars */}
                  {stryMutAct_9fa48("48054") ? stats.owners.length > 0 || <div className="flex -space-x-2">
                      {stats.owners.slice(0, 3).map((owner, i) => <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-sm" title={owner}>
                          {OWNER_AVATARS[owner as string] || '👤'}
                        </div>)}
                    </div> : stryMutAct_9fa48("48053") ? false : stryMutAct_9fa48("48052") ? true : (stryCov_9fa48("48052", "48053", "48054"), (stryMutAct_9fa48("48057") ? stats.owners.length <= 0 : stryMutAct_9fa48("48056") ? stats.owners.length >= 0 : stryMutAct_9fa48("48055") ? true : (stryCov_9fa48("48055", "48056", "48057"), stats.owners.length > 0)) && <div className="flex -space-x-2">
                      {stryMutAct_9fa48("48058") ? stats.owners.map((owner, i) => <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-sm" title={owner}>
                          {OWNER_AVATARS[owner as string] || '👤'}
                        </div>) : (stryCov_9fa48("48058"), stats.owners.slice(0, 3).map(stryMutAct_9fa48("48059") ? () => undefined : (stryCov_9fa48("48059"), (owner, i) => <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-sm" title={owner}>
                          {stryMutAct_9fa48("48062") ? OWNER_AVATARS[owner as string] && '👤' : stryMutAct_9fa48("48061") ? false : stryMutAct_9fa48("48060") ? true : (stryCov_9fa48("48060", "48061", "48062"), OWNER_AVATARS[owner as string] || '👤')}
                        </div>)))}
                    </div>)}
                </div>

                {/* Mini status bar */}
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden flex mb-3">
                  {stryMutAct_9fa48("48066") ? stats.onTrack > 0 || <div className="h-full bg-success-main" style={{
              width: `${stats.onTrack / stats.total * 100}%`
            }} /> : stryMutAct_9fa48("48065") ? false : stryMutAct_9fa48("48064") ? true : (stryCov_9fa48("48064", "48065", "48066"), (stryMutAct_9fa48("48069") ? stats.onTrack <= 0 : stryMutAct_9fa48("48068") ? stats.onTrack >= 0 : stryMutAct_9fa48("48067") ? true : (stryCov_9fa48("48067", "48068", "48069"), stats.onTrack > 0)) && <div className="h-full bg-success-main" style={stryMutAct_9fa48("48070") ? {} : (stryCov_9fa48("48070"), {
              width: `${stryMutAct_9fa48("48072") ? stats.onTrack / stats.total / 100 : (stryCov_9fa48("48072"), (stryMutAct_9fa48("48073") ? stats.onTrack * stats.total : (stryCov_9fa48("48073"), stats.onTrack / stats.total)) * 100)}%`
            })} />)}
                  {stryMutAct_9fa48("48076") ? stats.atRisk > 0 || <div className="h-full bg-warning-main" style={{
              width: `${stats.atRisk / stats.total * 100}%`
            }} /> : stryMutAct_9fa48("48075") ? false : stryMutAct_9fa48("48074") ? true : (stryCov_9fa48("48074", "48075", "48076"), (stryMutAct_9fa48("48079") ? stats.atRisk <= 0 : stryMutAct_9fa48("48078") ? stats.atRisk >= 0 : stryMutAct_9fa48("48077") ? true : (stryCov_9fa48("48077", "48078", "48079"), stats.atRisk > 0)) && <div className="h-full bg-warning-main" style={stryMutAct_9fa48("48080") ? {} : (stryCov_9fa48("48080"), {
              width: `${stryMutAct_9fa48("48082") ? stats.atRisk / stats.total / 100 : (stryCov_9fa48("48082"), (stryMutAct_9fa48("48083") ? stats.atRisk * stats.total : (stryCov_9fa48("48083"), stats.atRisk / stats.total)) * 100)}%`
            })} />)}
                  {stryMutAct_9fa48("48086") ? stats.critical > 0 || <div className="h-full bg-error-main" style={{
              width: `${stats.critical / stats.total * 100}%`
            }} /> : stryMutAct_9fa48("48085") ? false : stryMutAct_9fa48("48084") ? true : (stryCov_9fa48("48084", "48085", "48086"), (stryMutAct_9fa48("48089") ? stats.critical <= 0 : stryMutAct_9fa48("48088") ? stats.critical >= 0 : stryMutAct_9fa48("48087") ? true : (stryCov_9fa48("48087", "48088", "48089"), stats.critical > 0)) && <div className="h-full bg-error-main" style={stryMutAct_9fa48("48090") ? {} : (stryCov_9fa48("48090"), {
              width: `${stryMutAct_9fa48("48092") ? stats.critical / stats.total / 100 : (stryCov_9fa48("48092"), (stryMutAct_9fa48("48093") ? stats.critical * stats.total : (stryCov_9fa48("48093"), stats.critical / stats.total)) * 100)}%`
            })} />)}
                </div>

                {/* Status pills */}
                <div className="flex items-center gap-2 text-xs">
                  {stryMutAct_9fa48("48096") ? stats.onTrack > 0 || <span className="px-2 py-0.5 bg-success-light text-success-dark rounded-full">On target {stats.onTrack}</span> : stryMutAct_9fa48("48095") ? false : stryMutAct_9fa48("48094") ? true : (stryCov_9fa48("48094", "48095", "48096"), (stryMutAct_9fa48("48099") ? stats.onTrack <= 0 : stryMutAct_9fa48("48098") ? stats.onTrack >= 0 : stryMutAct_9fa48("48097") ? true : (stryCov_9fa48("48097", "48098", "48099"), stats.onTrack > 0)) && <span className="px-2 py-0.5 bg-success-light text-success-dark rounded-full">On target {stats.onTrack}</span>)}
                  {stryMutAct_9fa48("48102") ? stats.atRisk > 0 || <span className="px-2 py-0.5 bg-warning-light text-warning-dark rounded-full">At risk {stats.atRisk}</span> : stryMutAct_9fa48("48101") ? false : stryMutAct_9fa48("48100") ? true : (stryCov_9fa48("48100", "48101", "48102"), (stryMutAct_9fa48("48105") ? stats.atRisk <= 0 : stryMutAct_9fa48("48104") ? stats.atRisk >= 0 : stryMutAct_9fa48("48103") ? true : (stryCov_9fa48("48103", "48104", "48105"), stats.atRisk > 0)) && <span className="px-2 py-0.5 bg-warning-light text-warning-dark rounded-full">At risk {stats.atRisk}</span>)}
                  {stryMutAct_9fa48("48108") ? stats.critical > 0 || <span className="px-2 py-0.5 bg-error-light text-error-dark rounded-full">Critical {stats.critical}</span> : stryMutAct_9fa48("48107") ? false : stryMutAct_9fa48("48106") ? true : (stryCov_9fa48("48106", "48107", "48108"), (stryMutAct_9fa48("48111") ? stats.critical <= 0 : stryMutAct_9fa48("48110") ? stats.critical >= 0 : stryMutAct_9fa48("48109") ? true : (stryCov_9fa48("48109", "48110", "48111"), stats.critical > 0)) && <span className="px-2 py-0.5 bg-error-light text-error-dark rounded-full">Critical {stats.critical}</span>)}
                </div>
              </button>;
      }))}
        </div> : (/* Empty state with metric packs */
    <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No metrics configured yet</h3>
          <p className="text-neutral-500 mb-6">Get started with one of our pre-built metric packs:</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRIC_PACKS.map(stryMutAct_9fa48("48112") ? () => undefined : (stryCov_9fa48("48112"), pack => <button key={pack.id} className="p-4 border border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
                <span className="text-2xl mb-2 block">{pack.icon}</span>
                <h4 className="font-semibold text-neutral-900">{pack.name}</h4>
                <p className="text-xs text-neutral-500 mt-1">{pack.metrics.join(', ')}</p>
              </button>))}
          </div>
        </div>)}

      {/* Category Detail Drawer */}
      {stryMutAct_9fa48("48116") ? selectedCategory || <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={() => setSelectedCategory(null)}>
          <div className="w-[700px] h-full bg-white overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 sticky top-0 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedCategory?.icon || getCategoryConfig(selectedCategory?.name).icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedCategory?.name || 'Category'}</h2>
                  <p className="text-sm text-neutral-500">{(selectedCategory?.metrics || []).length} metrics</p>
                </div>
              </div>
              <button onClick={() => setSelectedCategory(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-neutral-100 flex items-center gap-4 bg-neutral-50">
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Types</option>
                <option>Leading</option>
                <option>Lagging</option>
              </select>
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Owners</option>
                <option>CFO</option>
                <option>COO</option>
                <option>CMO</option>
              </select>
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Status</option>
                <option>On Track</option>
                <option>At Risk</option>
                <option>Critical</option>
              </select>
            </div>

            {/* Metrics Table */}
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-200">
                    <th className="pb-3 font-medium">Metric</th>
                    <th className="pb-3 font-medium">Value</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Owner</th>
                    <th className="pb-3 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedCategory?.metrics || []).map(metric => <tr key={metric.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer" onClick={() => setSelectedMetric(metric)}>
                      <td className="py-3">
                        <div className="font-medium text-neutral-900">{metric.name}</div>
                        {metric.type && <span className="text-xs text-neutral-400">{metric.type}</span>}
                      </td>
                      <td className="py-3">
                        <span className="font-medium">{typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}</span>
                        <span className="text-neutral-500">{metric.unit}</span>
                        {metric.target && <span className="text-xs text-neutral-400 ml-1">/ {metric.target}{metric.unit}</span>}
                      </td>
                      <td className="py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', getStatusStyle(metric.status))}>
                          {getStatusLabel(metric.status)}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-600">{metric.owner || '—'}</td>
                      <td className="py-3">
                        <span className={cn('flex items-center gap-1', metric.trend >= 0 ? 'text-success-dark' : 'text-error-dark')}>
                          {metric.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(metric.trend)}%
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div> : stryMutAct_9fa48("48115") ? false : stryMutAct_9fa48("48114") ? true : (stryCov_9fa48("48114", "48115", "48116"), selectedCategory && <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={stryMutAct_9fa48("48117") ? () => undefined : (stryCov_9fa48("48117"), () => setSelectedCategory(null))}>
          <div className="w-[700px] h-full bg-white overflow-y-auto" onClick={stryMutAct_9fa48("48118") ? () => undefined : (stryCov_9fa48("48118"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-neutral-200 sticky top-0 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stryMutAct_9fa48("48121") ? selectedCategory?.icon && getCategoryConfig(selectedCategory?.name).icon : stryMutAct_9fa48("48120") ? false : stryMutAct_9fa48("48119") ? true : (stryCov_9fa48("48119", "48120", "48121"), (stryMutAct_9fa48("48122") ? selectedCategory.icon : (stryCov_9fa48("48122"), selectedCategory?.icon)) || getCategoryConfig(stryMutAct_9fa48("48123") ? selectedCategory.name : (stryCov_9fa48("48123"), selectedCategory?.name)).icon)}</span>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{stryMutAct_9fa48("48126") ? selectedCategory?.name && 'Category' : stryMutAct_9fa48("48125") ? false : stryMutAct_9fa48("48124") ? true : (stryCov_9fa48("48124", "48125", "48126"), (stryMutAct_9fa48("48127") ? selectedCategory.name : (stryCov_9fa48("48127"), selectedCategory?.name)) || 'Category')}</h2>
                  <p className="text-sm text-neutral-500">{(stryMutAct_9fa48("48131") ? selectedCategory?.metrics && [] : stryMutAct_9fa48("48130") ? false : stryMutAct_9fa48("48129") ? true : (stryCov_9fa48("48129", "48130", "48131"), (stryMutAct_9fa48("48132") ? selectedCategory.metrics : (stryCov_9fa48("48132"), selectedCategory?.metrics)) || (stryMutAct_9fa48("48133") ? ["Stryker was here"] : (stryCov_9fa48("48133"), [])))).length} metrics</p>
                </div>
              </div>
              <button onClick={stryMutAct_9fa48("48134") ? () => undefined : (stryCov_9fa48("48134"), () => setSelectedCategory(null))} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-neutral-100 flex items-center gap-4 bg-neutral-50">
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Types</option>
                <option>Leading</option>
                <option>Lagging</option>
              </select>
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Owners</option>
                <option>CFO</option>
                <option>COO</option>
                <option>CMO</option>
              </select>
              <select className="text-sm border border-neutral-200 rounded px-2 py-1">
                <option>All Status</option>
                <option>On Track</option>
                <option>At Risk</option>
                <option>Critical</option>
              </select>
            </div>

            {/* Metrics Table */}
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500 border-b border-neutral-200">
                    <th className="pb-3 font-medium">Metric</th>
                    <th className="pb-3 font-medium">Value</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Owner</th>
                    <th className="pb-3 font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {(stryMutAct_9fa48("48137") ? selectedCategory?.metrics && [] : stryMutAct_9fa48("48136") ? false : stryMutAct_9fa48("48135") ? true : (stryCov_9fa48("48135", "48136", "48137"), (stryMutAct_9fa48("48138") ? selectedCategory.metrics : (stryCov_9fa48("48138"), selectedCategory?.metrics)) || (stryMutAct_9fa48("48139") ? ["Stryker was here"] : (stryCov_9fa48("48139"), [])))).map(stryMutAct_9fa48("48140") ? () => undefined : (stryCov_9fa48("48140"), metric => <tr key={metric.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer" onClick={stryMutAct_9fa48("48141") ? () => undefined : (stryCov_9fa48("48141"), () => setSelectedMetric(metric))}>
                      <td className="py-3">
                        <div className="font-medium text-neutral-900">{metric.name}</div>
                        {stryMutAct_9fa48("48144") ? metric.type || <span className="text-xs text-neutral-400">{metric.type}</span> : stryMutAct_9fa48("48143") ? false : stryMutAct_9fa48("48142") ? true : (stryCov_9fa48("48142", "48143", "48144"), metric.type && <span className="text-xs text-neutral-400">{metric.type}</span>)}
                      </td>
                      <td className="py-3">
                        <span className="font-medium">{(stryMutAct_9fa48("48147") ? typeof metric.value !== 'number' : stryMutAct_9fa48("48146") ? false : stryMutAct_9fa48("48145") ? true : (stryCov_9fa48("48145", "48146", "48147"), typeof metric.value === 'number')) ? metric.value.toFixed(1) : metric.value}</span>
                        <span className="text-neutral-500">{metric.unit}</span>
                        {stryMutAct_9fa48("48151") ? metric.target || <span className="text-xs text-neutral-400 ml-1">/ {metric.target}{metric.unit}</span> : stryMutAct_9fa48("48150") ? false : stryMutAct_9fa48("48149") ? true : (stryCov_9fa48("48149", "48150", "48151"), metric.target && <span className="text-xs text-neutral-400 ml-1">/ {metric.target}{metric.unit}</span>)}
                      </td>
                      <td className="py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', getStatusStyle(metric.status))}>
                          {getStatusLabel(metric.status)}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-600">{stryMutAct_9fa48("48155") ? metric.owner && '—' : stryMutAct_9fa48("48154") ? false : stryMutAct_9fa48("48153") ? true : (stryCov_9fa48("48153", "48154", "48155"), metric.owner || '—')}</td>
                      <td className="py-3">
                        <span className={cn('flex items-center gap-1', (stryMutAct_9fa48("48161") ? metric.trend < 0 : stryMutAct_9fa48("48160") ? metric.trend > 0 : stryMutAct_9fa48("48159") ? false : stryMutAct_9fa48("48158") ? true : (stryCov_9fa48("48158", "48159", "48160", "48161"), metric.trend >= 0)) ? 'text-success-dark' : 'text-error-dark')}>
                          {(stryMutAct_9fa48("48167") ? metric.trend < 0 : stryMutAct_9fa48("48166") ? metric.trend > 0 : stryMutAct_9fa48("48165") ? false : stryMutAct_9fa48("48164") ? true : (stryCov_9fa48("48164", "48165", "48166", "48167"), metric.trend >= 0)) ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(metric.trend)}%
                        </span>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>)}

      {/* Metric Detail Modal */}
      {stryMutAct_9fa48("48170") ? selectedMetric || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedMetric(null)}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[550px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{selectedMetric.name}</h2>
                <p className="text-sm text-neutral-500">{selectedMetric.type || 'Metric'} • {selectedMetric.owner || 'Unassigned'}</p>
              </div>
              <button onClick={() => setSelectedMetric(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Value & Status */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-3xl font-bold text-neutral-900">
                    {typeof selectedMetric.value === 'number' ? selectedMetric.value.toFixed(1) : selectedMetric.value}
                    <span className="text-lg font-normal text-neutral-500">{selectedMetric.unit}</span>
                  </p>
                  {selectedMetric.target && <p className="text-sm text-neutral-500">Target: {selectedMetric.target}{selectedMetric.unit}</p>}
                </div>
                <div className="text-right">
                  <span className={cn('text-xs px-3 py-1 rounded-full', getStatusStyle(selectedMetric.status))}>
                    {getStatusLabel(selectedMetric.status)}
                  </span>
                  <div className={cn('flex items-center gap-1 mt-2 justify-end', selectedMetric.trend >= 0 ? 'text-success-dark' : 'text-error-dark')}>
                    {selectedMetric.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">{selectedMetric.trend >= 0 ? '+' : ''}{selectedMetric.trend}%</span>
                  </div>
                </div>
              </div>

              {/* Ownership & Guardrails */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-500 mb-1">Owner</p>
                  <p className="font-medium text-neutral-900">{selectedMetric.owner || 'Unassigned'}</p>
                  {selectedMetric.ownerRole && <p className="text-xs text-neutral-400">{selectedMetric.ownerRole}</p>}
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-500 mb-1">Threshold</p>
                  <p className="font-medium text-neutral-900">{selectedMetric.threshold ?? 'Not set'}{selectedMetric.threshold ? selectedMetric.unit : ''}</p>
                </div>
              </div>

              {/* Linked items for critical metrics */}
              {selectedMetric.status === 'critical' && <div className="p-4 bg-error-light rounded-lg">
                  <h4 className="font-medium text-error-dark mb-2">Critical Metric Tracking</h4>
                  <div className="space-y-2 text-sm">
                    {selectedMetric.linkedDecisionId ? <button onClick={() => navigate(`/cortex/intelligence/decision-dna?id=${selectedMetric.linkedDecisionId}`)} className="flex items-center gap-2 text-error-dark hover:underline">
                        <ExternalLink className="w-3 h-3" /> Decision DNA: {selectedMetric.linkedDecisionId}
                      </button> : <p className="text-error-dark/70">No Decision DNA item attached</p>}
                    {selectedMetric.linkedCrucibleId ? <button onClick={() => navigate(`/cortex/intelligence/crucible?id=${selectedMetric.linkedCrucibleId}`)} className="flex items-center gap-2 text-error-dark hover:underline">
                        <ExternalLink className="w-3 h-3" /> Crucible Scenario: {selectedMetric.linkedCrucibleId}
                      </button> : <p className="text-error-dark/70">No Crucible scenario analysing this</p>}
                  </div>
                </div>}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <button onClick={() => navigate(`/cortex/pillars/lineage?metric=${selectedMetric.id}`)} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  View Lineage
                </button>
                <button onClick={() => navigate(`/cortex/intelligence/chronos?metric=${selectedMetric.id}`)} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Clock className="w-4 h-4" />
                  Open in Chronos
                </button>
                <button onClick={() => navigate(`/cortex/intelligence/council?question=What+is+driving+${encodeURIComponent(selectedMetric.name)}?`)} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Ask Council: "What is driving this metric?"
                </button>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("48169") ? false : stryMutAct_9fa48("48168") ? true : (stryCov_9fa48("48168", "48169", "48170"), selectedMetric && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("48171") ? () => undefined : (stryCov_9fa48("48171"), () => setSelectedMetric(null))}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[550px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={stryMutAct_9fa48("48172") ? () => undefined : (stryCov_9fa48("48172"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{selectedMetric.name}</h2>
                <p className="text-sm text-neutral-500">{stryMutAct_9fa48("48175") ? selectedMetric.type && 'Metric' : stryMutAct_9fa48("48174") ? false : stryMutAct_9fa48("48173") ? true : (stryCov_9fa48("48173", "48174", "48175"), selectedMetric.type || 'Metric')} • {stryMutAct_9fa48("48179") ? selectedMetric.owner && 'Unassigned' : stryMutAct_9fa48("48178") ? false : stryMutAct_9fa48("48177") ? true : (stryCov_9fa48("48177", "48178", "48179"), selectedMetric.owner || 'Unassigned')}</p>
              </div>
              <button onClick={stryMutAct_9fa48("48181") ? () => undefined : (stryCov_9fa48("48181"), () => setSelectedMetric(null))} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Value & Status */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-3xl font-bold text-neutral-900">
                    {(stryMutAct_9fa48("48184") ? typeof selectedMetric.value !== 'number' : stryMutAct_9fa48("48183") ? false : stryMutAct_9fa48("48182") ? true : (stryCov_9fa48("48182", "48183", "48184"), typeof selectedMetric.value === 'number')) ? selectedMetric.value.toFixed(1) : selectedMetric.value}
                    <span className="text-lg font-normal text-neutral-500">{selectedMetric.unit}</span>
                  </p>
                  {stryMutAct_9fa48("48188") ? selectedMetric.target || <p className="text-sm text-neutral-500">Target: {selectedMetric.target}{selectedMetric.unit}</p> : stryMutAct_9fa48("48187") ? false : stryMutAct_9fa48("48186") ? true : (stryCov_9fa48("48186", "48187", "48188"), selectedMetric.target && <p className="text-sm text-neutral-500">Target: {selectedMetric.target}{selectedMetric.unit}</p>)}
                </div>
                <div className="text-right">
                  <span className={cn('text-xs px-3 py-1 rounded-full', getStatusStyle(selectedMetric.status))}>
                    {getStatusLabel(selectedMetric.status)}
                  </span>
                  <div className={cn('flex items-center gap-1 mt-2 justify-end', (stryMutAct_9fa48("48194") ? selectedMetric.trend < 0 : stryMutAct_9fa48("48193") ? selectedMetric.trend > 0 : stryMutAct_9fa48("48192") ? false : stryMutAct_9fa48("48191") ? true : (stryCov_9fa48("48191", "48192", "48193", "48194"), selectedMetric.trend >= 0)) ? 'text-success-dark' : 'text-error-dark')}>
                    {(stryMutAct_9fa48("48200") ? selectedMetric.trend < 0 : stryMutAct_9fa48("48199") ? selectedMetric.trend > 0 : stryMutAct_9fa48("48198") ? false : stryMutAct_9fa48("48197") ? true : (stryCov_9fa48("48197", "48198", "48199", "48200"), selectedMetric.trend >= 0)) ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">{(stryMutAct_9fa48("48204") ? selectedMetric.trend < 0 : stryMutAct_9fa48("48203") ? selectedMetric.trend > 0 : stryMutAct_9fa48("48202") ? false : stryMutAct_9fa48("48201") ? true : (stryCov_9fa48("48201", "48202", "48203", "48204"), selectedMetric.trend >= 0)) ? '+' : ''}{selectedMetric.trend}%</span>
                  </div>
                </div>
              </div>

              {/* Ownership & Guardrails */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-500 mb-1">Owner</p>
                  <p className="font-medium text-neutral-900">{stryMutAct_9fa48("48209") ? selectedMetric.owner && 'Unassigned' : stryMutAct_9fa48("48208") ? false : stryMutAct_9fa48("48207") ? true : (stryCov_9fa48("48207", "48208", "48209"), selectedMetric.owner || 'Unassigned')}</p>
                  {stryMutAct_9fa48("48213") ? selectedMetric.ownerRole || <p className="text-xs text-neutral-400">{selectedMetric.ownerRole}</p> : stryMutAct_9fa48("48212") ? false : stryMutAct_9fa48("48211") ? true : (stryCov_9fa48("48211", "48212", "48213"), selectedMetric.ownerRole && <p className="text-xs text-neutral-400">{selectedMetric.ownerRole}</p>)}
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-500 mb-1">Threshold</p>
                  <p className="font-medium text-neutral-900">{stryMutAct_9fa48("48214") ? selectedMetric.threshold && 'Not set' : (stryCov_9fa48("48214"), selectedMetric.threshold ?? 'Not set')}{selectedMetric.threshold ? selectedMetric.unit : ''}</p>
                </div>
              </div>

              {/* Linked items for critical metrics */}
              {stryMutAct_9fa48("48219") ? selectedMetric.status === 'critical' || <div className="p-4 bg-error-light rounded-lg">
                  <h4 className="font-medium text-error-dark mb-2">Critical Metric Tracking</h4>
                  <div className="space-y-2 text-sm">
                    {selectedMetric.linkedDecisionId ? <button onClick={() => navigate(`/cortex/intelligence/decision-dna?id=${selectedMetric.linkedDecisionId}`)} className="flex items-center gap-2 text-error-dark hover:underline">
                        <ExternalLink className="w-3 h-3" /> Decision DNA: {selectedMetric.linkedDecisionId}
                      </button> : <p className="text-error-dark/70">No Decision DNA item attached</p>}
                    {selectedMetric.linkedCrucibleId ? <button onClick={() => navigate(`/cortex/intelligence/crucible?id=${selectedMetric.linkedCrucibleId}`)} className="flex items-center gap-2 text-error-dark hover:underline">
                        <ExternalLink className="w-3 h-3" /> Crucible Scenario: {selectedMetric.linkedCrucibleId}
                      </button> : <p className="text-error-dark/70">No Crucible scenario analysing this</p>}
                  </div>
                </div> : stryMutAct_9fa48("48218") ? false : stryMutAct_9fa48("48217") ? true : (stryCov_9fa48("48217", "48218", "48219"), (stryMutAct_9fa48("48221") ? selectedMetric.status !== 'critical' : stryMutAct_9fa48("48220") ? true : (stryCov_9fa48("48220", "48221"), selectedMetric.status === 'critical')) && <div className="p-4 bg-error-light rounded-lg">
                  <h4 className="font-medium text-error-dark mb-2">Critical Metric Tracking</h4>
                  <div className="space-y-2 text-sm">
                    {selectedMetric.linkedDecisionId ? <button onClick={stryMutAct_9fa48("48223") ? () => undefined : (stryCov_9fa48("48223"), () => navigate(`/cortex/intelligence/decision-dna?id=${selectedMetric.linkedDecisionId}`))} className="flex items-center gap-2 text-error-dark hover:underline">
                        <ExternalLink className="w-3 h-3" /> Decision DNA: {selectedMetric.linkedDecisionId}
                      </button> : <p className="text-error-dark/70">No Decision DNA item attached</p>}
                    {selectedMetric.linkedCrucibleId ? <button onClick={stryMutAct_9fa48("48225") ? () => undefined : (stryCov_9fa48("48225"), () => navigate(`/cortex/intelligence/crucible?id=${selectedMetric.linkedCrucibleId}`))} className="flex items-center gap-2 text-error-dark hover:underline">
                        <ExternalLink className="w-3 h-3" /> Crucible Scenario: {selectedMetric.linkedCrucibleId}
                      </button> : <p className="text-error-dark/70">No Crucible scenario analysing this</p>}
                  </div>
                </div>)}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <button onClick={stryMutAct_9fa48("48227") ? () => undefined : (stryCov_9fa48("48227"), () => navigate(`/cortex/pillars/lineage?metric=${selectedMetric.id}`))} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  View Lineage
                </button>
                <button onClick={stryMutAct_9fa48("48229") ? () => undefined : (stryCov_9fa48("48229"), () => navigate(`/cortex/intelligence/chronos?metric=${selectedMetric.id}`))} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Clock className="w-4 h-4" />
                  Open in Chronos
                </button>
                <button onClick={stryMutAct_9fa48("48231") ? () => undefined : (stryCov_9fa48("48231"), () => navigate(`/cortex/intelligence/council?question=What+is+driving+${encodeURIComponent(selectedMetric.name)}?`))} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Ask Council: "What is driving this metric?"
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// THE LINEAGE - Data Provenance
// =============================================================================

interface LineageEntity {
  id: string;
  name: string;
  type: string;
  upstreamCount: number;
  downstreamCount: number;
  qualityScore: number;
  lastUpdated: string;
}
interface QualityOverview {
  totalEntities: number;
  totalSources: number;
  totalRelationships: number;
  avgQualityScore: number;
  sourceQuality: Array<{
    name: string;
    quality: number;
    recordCount: number;
  }>;
}
export const LineagePage: React.FC = () => {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<LineageEntity[]>(stryMutAct_9fa48("48234") ? ["Stryker was here"] : (stryCov_9fa48("48234"), []));
  const [qualityOverview, setQualityOverview] = useState<QualityOverview | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("48235") ? false : (stryCov_9fa48("48235"), true));
  useEffect(() => {
    const loadLineageData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("48239") ? false : (stryCov_9fa48("48239"), true));
        const [entitiesRes, qualityRes] = await Promise.all(stryMutAct_9fa48("48240") ? [] : (stryCov_9fa48("48240"), [api.get<LineageEntity[]>('/pillars/lineage/entities', stryMutAct_9fa48("48242") ? {} : (stryCov_9fa48("48242"), {
          organizationId: 'demo'
        })), api.get<QualityOverview>('/pillars/lineage/quality', stryMutAct_9fa48("48245") ? {} : (stryCov_9fa48("48245"), {
          organizationId: 'demo'
        }))]));
        if (stryMutAct_9fa48("48249") ? entitiesRes.success || entitiesRes.data : stryMutAct_9fa48("48248") ? false : stryMutAct_9fa48("48247") ? true : (stryCov_9fa48("48247", "48248", "48249"), entitiesRes.success && entitiesRes.data)) {
          setEntities(stryMutAct_9fa48("48253") ? entitiesRes.data && [] : stryMutAct_9fa48("48252") ? false : stryMutAct_9fa48("48251") ? true : (stryCov_9fa48("48251", "48252", "48253"), entitiesRes.data || (stryMutAct_9fa48("48254") ? ["Stryker was here"] : (stryCov_9fa48("48254"), []))));
        }
        if (stryMutAct_9fa48("48257") ? qualityRes.success || qualityRes.data : stryMutAct_9fa48("48256") ? false : stryMutAct_9fa48("48255") ? true : (stryCov_9fa48("48255", "48256", "48257"), qualityRes.success && qualityRes.data)) {
          setQualityOverview(qualityRes.data);
        }
      } catch (err) {
        console.error('Failed to load lineage data:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("48262") ? true : (stryCov_9fa48("48262"), false));
      }
    };
    loadLineageData();
  }, stryMutAct_9fa48("48263") ? ["Stryker was here"] : (stryCov_9fa48("48263"), []));
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = stryMutAct_9fa48("48265") ? now.getTime() + date.getTime() : (stryCov_9fa48("48265"), now.getTime() - date.getTime());
    const diffMins = Math.floor(stryMutAct_9fa48("48266") ? diffMs * 60000 : (stryCov_9fa48("48266"), diffMs / 60000));
    const diffHours = Math.floor(stryMutAct_9fa48("48267") ? diffMs * 3600000 : (stryCov_9fa48("48267"), diffMs / 3600000));
    if (stryMutAct_9fa48("48271") ? diffMins >= 60 : stryMutAct_9fa48("48270") ? diffMins <= 60 : stryMutAct_9fa48("48269") ? false : stryMutAct_9fa48("48268") ? true : (stryCov_9fa48("48268", "48269", "48270", "48271"), diffMins < 60)) {
      return `${diffMins} min ago`;
    }
    if (stryMutAct_9fa48("48277") ? diffHours >= 24 : stryMutAct_9fa48("48276") ? diffHours <= 24 : stryMutAct_9fa48("48275") ? false : stryMutAct_9fa48("48274") ? true : (stryCov_9fa48("48274", "48275", "48276", "48277"), diffHours < 24)) {
      return `${diffHours} hours ago`;
    }
    return `${Math.floor(stryMutAct_9fa48("48281") ? diffMs * 86400000 : (stryCov_9fa48("48281"), diffMs / 86400000))} days ago`;
  };
  if (stryMutAct_9fa48("48283") ? false : stryMutAct_9fa48("48282") ? true : (stryCov_9fa48("48282", "48283"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="🔗" name="The Lineage" tagline="Complete data provenance and dependency tracking" color="#10B981" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-neutral-500">Loading lineage data...</span>
        </div>
      </div>;
  }
  return <div className="p-6">
      <PillarHeader icon="🔗" name="The Lineage" tagline="Complete data provenance and dependency tracking" color="#10B981" />

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Tracked Entities" value={stryMutAct_9fa48("48285") ? qualityOverview?.totalEntities && entities.length : (stryCov_9fa48("48285"), (stryMutAct_9fa48("48286") ? qualityOverview.totalEntities : (stryCov_9fa48("48286"), qualityOverview?.totalEntities)) ?? entities.length)} />
        <MetricCard label="Data Sources" value={stryMutAct_9fa48("48287") ? qualityOverview?.totalSources && 0 : (stryCov_9fa48("48287"), (stryMutAct_9fa48("48288") ? qualityOverview.totalSources : (stryCov_9fa48("48288"), qualityOverview?.totalSources)) ?? 0)} />
        <MetricCard label="Relationships" value={stryMutAct_9fa48("48289") ? qualityOverview?.totalRelationships && 0 : (stryCov_9fa48("48289"), (stryMutAct_9fa48("48290") ? qualityOverview.totalRelationships : (stryCov_9fa48("48290"), qualityOverview?.totalRelationships)) ?? 0)} />
        <MetricCard label="Quality Score" value={Math.round(stryMutAct_9fa48("48291") ? qualityOverview?.avgQualityScore && 0 : (stryCov_9fa48("48291"), (stryMutAct_9fa48("48292") ? qualityOverview.avgQualityScore : (stryCov_9fa48("48292"), qualityOverview?.avgQualityScore)) ?? 0))} unit="%" />
      </div>

      {/* Lineage Explorer - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Lineage Views</h3>
          <button onClick={stryMutAct_9fa48("48293") ? () => undefined : (stryCov_9fa48("48293"), () => navigate('/cortex/graph'))} className="text-sm text-primary-600 hover:text-primary-700">
            Open Graph Explorer →
          </button>
        </div>
        <div className="space-y-3">
          {(stryMutAct_9fa48("48298") ? entities.length <= 0 : stryMutAct_9fa48("48297") ? entities.length >= 0 : stryMutAct_9fa48("48296") ? false : stryMutAct_9fa48("48295") ? true : (stryCov_9fa48("48295", "48296", "48297", "48298"), entities.length > 0)) ? stryMutAct_9fa48("48299") ? entities.map(entity => <div key={entity.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer" onClick={() => navigate(`/cortex/graph?entity=${entity.id}`)}>
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {entity.type === 'report' ? '📄' : entity.type === 'dataset' ? '📊' : entity.type === 'metric' ? '📈' : entity.type === 'model' ? '🤖' : '📁'}
                </span>
                <div>
                  <p className="font-medium text-neutral-900">{entity.name}</p>
                  <p className="text-sm text-neutral-500">{entity.upstreamCount} upstream sources</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{formatRelativeTime(entity.lastUpdated)}</span>
            </div>) : (stryCov_9fa48("48299"), entities.slice(0, 6).map(stryMutAct_9fa48("48300") ? () => undefined : (stryCov_9fa48("48300"), entity => <div key={entity.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer" onClick={stryMutAct_9fa48("48301") ? () => undefined : (stryCov_9fa48("48301"), () => navigate(`/cortex/graph?entity=${entity.id}`))}>
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {(stryMutAct_9fa48("48305") ? entity.type !== 'report' : stryMutAct_9fa48("48304") ? false : stryMutAct_9fa48("48303") ? true : (stryCov_9fa48("48303", "48304", "48305"), entity.type === 'report')) ? '📄' : (stryMutAct_9fa48("48310") ? entity.type !== 'dataset' : stryMutAct_9fa48("48309") ? false : stryMutAct_9fa48("48308") ? true : (stryCov_9fa48("48308", "48309", "48310"), entity.type === 'dataset')) ? '📊' : (stryMutAct_9fa48("48315") ? entity.type !== 'metric' : stryMutAct_9fa48("48314") ? false : stryMutAct_9fa48("48313") ? true : (stryCov_9fa48("48313", "48314", "48315"), entity.type === 'metric')) ? '📈' : (stryMutAct_9fa48("48320") ? entity.type !== 'model' : stryMutAct_9fa48("48319") ? false : stryMutAct_9fa48("48318") ? true : (stryCov_9fa48("48318", "48319", "48320"), entity.type === 'model')) ? '🤖' : '📁'}
                </span>
                <div>
                  <p className="font-medium text-neutral-900">{entity.name}</p>
                  <p className="text-sm text-neutral-500">{entity.upstreamCount} upstream sources</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{formatRelativeTime(entity.lastUpdated)}</span>
            </div>))) : <p className="text-neutral-500 text-center py-4">No entities tracked yet</p>}
        </div>
      </div>

      {/* Data Quality - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Quality by Source</h3>
        <div className="space-y-4">
          {(stryMutAct_9fa48("48326") ? qualityOverview?.sourceQuality && [] : stryMutAct_9fa48("48325") ? false : stryMutAct_9fa48("48324") ? true : (stryCov_9fa48("48324", "48325", "48326"), (stryMutAct_9fa48("48327") ? qualityOverview.sourceQuality : (stryCov_9fa48("48327"), qualityOverview?.sourceQuality)) || (stryMutAct_9fa48("48328") ? ["Stryker was here"] : (stryCov_9fa48("48328"), [])))).map(stryMutAct_9fa48("48329") ? () => undefined : (stryCov_9fa48("48329"), (source, idx) => <div key={idx} className="flex items-center gap-4">
              <span className="w-32 text-neutral-700">{source.name}</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full', (stryMutAct_9fa48("48334") ? source.quality < 95 : stryMutAct_9fa48("48333") ? source.quality > 95 : stryMutAct_9fa48("48332") ? false : stryMutAct_9fa48("48331") ? true : (stryCov_9fa48("48331", "48332", "48333", "48334"), source.quality >= 95)) ? 'bg-success-main' : (stryMutAct_9fa48("48339") ? source.quality < 85 : stryMutAct_9fa48("48338") ? source.quality > 85 : stryMutAct_9fa48("48337") ? false : stryMutAct_9fa48("48336") ? true : (stryCov_9fa48("48336", "48337", "48338", "48339"), source.quality >= 85)) ? 'bg-warning-main' : 'bg-error-main')} style={stryMutAct_9fa48("48342") ? {} : (stryCov_9fa48("48342"), {
              width: `${source.quality}%`
            })} />
              </div>
              <span className="w-12 text-sm font-medium text-neutral-900">{source.quality}%</span>
              <span className="w-20 text-sm text-neutral-500">{source.recordCount.toLocaleString()}</span>
            </div>))}
          {stryMutAct_9fa48("48346") ? !qualityOverview?.sourceQuality || qualityOverview.sourceQuality.length === 0 || <p className="text-neutral-500 text-center py-4">No quality data available</p> : stryMutAct_9fa48("48345") ? false : stryMutAct_9fa48("48344") ? true : (stryCov_9fa48("48344", "48345", "48346"), (stryMutAct_9fa48("48348") ? !qualityOverview?.sourceQuality && qualityOverview.sourceQuality.length === 0 : stryMutAct_9fa48("48347") ? true : (stryCov_9fa48("48347", "48348"), (stryMutAct_9fa48("48349") ? qualityOverview?.sourceQuality : (stryCov_9fa48("48349"), !(stryMutAct_9fa48("48350") ? qualityOverview.sourceQuality : (stryCov_9fa48("48350"), qualityOverview?.sourceQuality)))) || (stryMutAct_9fa48("48352") ? qualityOverview.sourceQuality.length !== 0 : stryMutAct_9fa48("48351") ? false : (stryCov_9fa48("48351", "48352"), qualityOverview.sourceQuality.length === 0)))) && <p className="text-neutral-500 text-center py-4">No quality data available</p>)}
        </div>
      </div>
    </div>;
};

// =============================================================================
// THE PREDICT - Forecasting
// =============================================================================

interface PredictModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  status: 'active' | 'training' | 'inactive';
  predictions: number;
  lastTrained: string;
}
interface PredictInsight {
  feature: string;
  importance: number;
}
export const PredictPage: React.FC = () => {
  const [models, setModels] = useState<PredictModel[]>(stryMutAct_9fa48("48354") ? ["Stryker was here"] : (stryCov_9fa48("48354"), []));
  const [insights, setInsights] = useState<PredictInsight[]>(stryMutAct_9fa48("48355") ? ["Stryker was here"] : (stryCov_9fa48("48355"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("48356") ? false : (stryCov_9fa48("48356"), true));
  useEffect(() => {
    const loadPredictData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("48360") ? false : (stryCov_9fa48("48360"), true));
        const [modelsRes, insightsRes] = await Promise.all(stryMutAct_9fa48("48361") ? [] : (stryCov_9fa48("48361"), [api.get<PredictModel[]>('/pillars/predict/models', stryMutAct_9fa48("48363") ? {} : (stryCov_9fa48("48363"), {
          organizationId: 'demo'
        })), api.get<{
          features: PredictInsight[];
        }>('/pillars/predict/insights', stryMutAct_9fa48("48366") ? {} : (stryCov_9fa48("48366"), {
          organizationId: 'demo'
        }))]));
        if (stryMutAct_9fa48("48370") ? modelsRes.success || modelsRes.data : stryMutAct_9fa48("48369") ? false : stryMutAct_9fa48("48368") ? true : (stryCov_9fa48("48368", "48369", "48370"), modelsRes.success && modelsRes.data)) {
          setModels(stryMutAct_9fa48("48374") ? modelsRes.data && [] : stryMutAct_9fa48("48373") ? false : stryMutAct_9fa48("48372") ? true : (stryCov_9fa48("48372", "48373", "48374"), modelsRes.data || (stryMutAct_9fa48("48375") ? ["Stryker was here"] : (stryCov_9fa48("48375"), []))));
        }
        if (stryMutAct_9fa48("48378") ? insightsRes.success || insightsRes.data : stryMutAct_9fa48("48377") ? false : stryMutAct_9fa48("48376") ? true : (stryCov_9fa48("48376", "48377", "48378"), insightsRes.success && insightsRes.data)) {
          setInsights(stryMutAct_9fa48("48382") ? insightsRes.data.features && [] : stryMutAct_9fa48("48381") ? false : stryMutAct_9fa48("48380") ? true : (stryCov_9fa48("48380", "48381", "48382"), insightsRes.data.features || (stryMutAct_9fa48("48383") ? ["Stryker was here"] : (stryCov_9fa48("48383"), []))));
        }
      } catch (err) {
        console.error('Failed to load predict data:', err);
        // Use demo data when API is unavailable
        setModels(stryMutAct_9fa48("48386") ? [] : (stryCov_9fa48("48386"), [stryMutAct_9fa48("48387") ? {} : (stryCov_9fa48("48387"), {
          id: 'pm1',
          name: 'Revenue Forecast',
          type: 'regression',
          accuracy: 94.2,
          status: 'active',
          predictions: 1247,
          lastTrained: new Date().toISOString()
        }), stryMutAct_9fa48("48392") ? {} : (stryCov_9fa48("48392"), {
          id: 'pm2',
          name: 'Churn Predictor',
          type: 'classification',
          accuracy: 89.7,
          status: 'active',
          predictions: 856,
          lastTrained: new Date().toISOString()
        }), stryMutAct_9fa48("48397") ? {} : (stryCov_9fa48("48397"), {
          id: 'pm3',
          name: 'Demand Planning',
          type: 'time-series',
          accuracy: 91.3,
          status: 'active',
          predictions: 2103,
          lastTrained: new Date().toISOString()
        })]));
        setInsights(stryMutAct_9fa48("48402") ? [] : (stryCov_9fa48("48402"), [stryMutAct_9fa48("48403") ? {} : (stryCov_9fa48("48403"), {
          feature: 'Customer Lifetime Value',
          importance: 0.85
        }), stryMutAct_9fa48("48405") ? {} : (stryCov_9fa48("48405"), {
          feature: 'Engagement Score',
          importance: 0.72
        }), stryMutAct_9fa48("48407") ? {} : (stryCov_9fa48("48407"), {
          feature: 'Purchase Frequency',
          importance: 0.68
        })]));
      } finally {
        setIsLoading(stryMutAct_9fa48("48410") ? true : (stryCov_9fa48("48410"), false));
      }
    };
    loadPredictData();
  }, stryMutAct_9fa48("48411") ? ["Stryker was here"] : (stryCov_9fa48("48411"), []));
  const activeModels = stryMutAct_9fa48("48412") ? models.length : (stryCov_9fa48("48412"), models.filter(stryMutAct_9fa48("48413") ? () => undefined : (stryCov_9fa48("48413"), m => stryMutAct_9fa48("48416") ? m.status !== 'active' : stryMutAct_9fa48("48415") ? false : stryMutAct_9fa48("48414") ? true : (stryCov_9fa48("48414", "48415", "48416"), m.status === 'active'))).length);
  const avgAccuracy = (stryMutAct_9fa48("48421") ? models.length <= 0 : stryMutAct_9fa48("48420") ? models.length >= 0 : stryMutAct_9fa48("48419") ? false : stryMutAct_9fa48("48418") ? true : (stryCov_9fa48("48418", "48419", "48420", "48421"), models.length > 0)) ? stryMutAct_9fa48("48422") ? models.reduce((sum, m) => sum + m.accuracy, 0) * models.length : (stryCov_9fa48("48422"), models.reduce(stryMutAct_9fa48("48423") ? () => undefined : (stryCov_9fa48("48423"), (sum, m) => stryMutAct_9fa48("48424") ? sum - m.accuracy : (stryCov_9fa48("48424"), sum + m.accuracy)), 0) / models.length) : 0;
  const totalPredictions = models.reduce(stryMutAct_9fa48("48425") ? () => undefined : (stryCov_9fa48("48425"), (sum, m) => stryMutAct_9fa48("48426") ? sum - (m.predictions || 0) : (stryCov_9fa48("48426"), sum + (stryMutAct_9fa48("48429") ? m.predictions && 0 : stryMutAct_9fa48("48428") ? false : stryMutAct_9fa48("48427") ? true : (stryCov_9fa48("48427", "48428", "48429"), m.predictions || 0)))), 0);
  if (stryMutAct_9fa48("48431") ? false : stryMutAct_9fa48("48430") ? true : (stryCov_9fa48("48430", "48431"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="🔮" name="The Predict" tagline="AI-powered forecasting and predictive analytics" color="#8B5CF6" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-neutral-500">Loading prediction models...</span>
        </div>
      </div>;
  }
  return <div className="p-6">
      <PillarHeader icon="🔮" name="The Predict" tagline="AI-powered forecasting and predictive analytics" color="#8B5CF6" />

      {/* Active Models - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Models" value={activeModels} />
        <MetricCard label="Avg Accuracy" value={avgAccuracy.toFixed(1)} unit="%" />
        <MetricCard label="Predictions Today" value={totalPredictions} />
        <MetricCard label="Models Training" value={stryMutAct_9fa48("48433") ? models.length : (stryCov_9fa48("48433"), models.filter(stryMutAct_9fa48("48434") ? () => undefined : (stryCov_9fa48("48434"), m => stryMutAct_9fa48("48437") ? m.status !== 'training' : stryMutAct_9fa48("48436") ? false : stryMutAct_9fa48("48435") ? true : (stryCov_9fa48("48435", "48436", "48437"), m.status === 'training'))).length)} />
      </div>

      {/* Forecast Models - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Forecast Models</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(stryMutAct_9fa48("48442") ? models.length <= 0 : stryMutAct_9fa48("48441") ? models.length >= 0 : stryMutAct_9fa48("48440") ? false : stryMutAct_9fa48("48439") ? true : (stryCov_9fa48("48439", "48440", "48441", "48442"), models.length > 0)) ? models.map(stryMutAct_9fa48("48443") ? () => undefined : (stryCov_9fa48("48443"), model => <div key={model.id} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{model.name}</h4>
                <span className={cn('text-xs px-2 py-1 rounded-full', (stryMutAct_9fa48("48447") ? model.status !== 'active' : stryMutAct_9fa48("48446") ? false : stryMutAct_9fa48("48445") ? true : (stryCov_9fa48("48445", "48446", "48447"), model.status === 'active')) ? 'bg-success-light text-success-dark' : (stryMutAct_9fa48("48452") ? model.status !== 'training' : stryMutAct_9fa48("48451") ? false : stryMutAct_9fa48("48450") ? true : (stryCov_9fa48("48450", "48451", "48452"), model.status === 'training')) ? 'bg-warning-light text-warning-dark' : 'bg-neutral-100 text-neutral-600')}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mb-2">{model.type}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full">
                  <div className="h-full bg-primary-500 rounded-full" style={stryMutAct_9fa48("48456") ? {} : (stryCov_9fa48("48456"), {
                width: `${model.accuracy}%`
              })} />
                </div>
                <span className="text-sm font-medium text-neutral-900">{model.accuracy.toFixed(1)}%</span>
              </div>
            </div>)) : <p className="col-span-2 text-neutral-500 text-center py-4">No models configured</p>}
        </div>
      </div>

      {/* Feature Importance - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Predictive Features</h3>
        <div className="space-y-3">
          {(stryMutAct_9fa48("48461") ? insights.length <= 0 : stryMutAct_9fa48("48460") ? insights.length >= 0 : stryMutAct_9fa48("48459") ? false : stryMutAct_9fa48("48458") ? true : (stryCov_9fa48("48458", "48459", "48460", "48461"), insights.length > 0)) ? stryMutAct_9fa48("48462") ? insights.map((f, idx) => <div key={idx} className="flex items-center gap-4">
              <span className="w-40 text-neutral-700">{f.feature}</span>
              <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{
              width: `${f.importance * 100}%`
            }} />
              </div>
              <span className="w-12 text-sm text-neutral-600">{(f.importance * 100).toFixed(0)}%</span>
            </div>) : (stryCov_9fa48("48462"), insights.slice(0, 5).map(stryMutAct_9fa48("48463") ? () => undefined : (stryCov_9fa48("48463"), (f, idx) => <div key={idx} className="flex items-center gap-4">
              <span className="w-40 text-neutral-700">{f.feature}</span>
              <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={stryMutAct_9fa48("48464") ? {} : (stryCov_9fa48("48464"), {
              width: `${stryMutAct_9fa48("48466") ? f.importance / 100 : (stryCov_9fa48("48466"), f.importance * 100)}%`
            })} />
              </div>
              <span className="w-12 text-sm text-neutral-600">{(stryMutAct_9fa48("48467") ? f.importance / 100 : (stryCov_9fa48("48467"), f.importance * 100)).toFixed(0)}%</span>
            </div>))) : <p className="text-neutral-500 text-center py-4">No feature insights available</p>}
        </div>
      </div>
    </div>;
};

// =============================================================================
// THE FLOW - Workflow Automation
// =============================================================================

interface FlowStats {
  activeWorkflows: number;
  executionsToday: number;
  successRate: number;
  timeSavedHours: number;
  pendingApprovals: number;
}
interface FlowExecution {
  id: string;
  workflowName: string;
  status: 'success' | 'running' | 'failed' | 'pending';
  startedAt: string;
  duration: number | null;
}
export const FlowPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<FlowStats | null>(null);
  const [executions, setExecutions] = useState<FlowExecution[]>(stryMutAct_9fa48("48469") ? ["Stryker was here"] : (stryCov_9fa48("48469"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("48470") ? false : (stryCov_9fa48("48470"), true));
  useEffect(() => {
    const loadFlowData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("48474") ? false : (stryCov_9fa48("48474"), true));
        const [statsRes, execRes] = await Promise.all(stryMutAct_9fa48("48475") ? [] : (stryCov_9fa48("48475"), [api.get<FlowStats>('/pillars/flow/stats', stryMutAct_9fa48("48477") ? {} : (stryCov_9fa48("48477"), {
          organizationId: 'demo'
        })), api.get<FlowExecution[]>('/pillars/flow/executions', stryMutAct_9fa48("48480") ? {} : (stryCov_9fa48("48480"), {
          organizationId: 'demo',
          limit: 10
        }))]));
        if (stryMutAct_9fa48("48484") ? statsRes.success || statsRes.data : stryMutAct_9fa48("48483") ? false : stryMutAct_9fa48("48482") ? true : (stryCov_9fa48("48482", "48483", "48484"), statsRes.success && statsRes.data)) {
          setStats(statsRes.data);
        }
        if (stryMutAct_9fa48("48488") ? execRes.success || execRes.data : stryMutAct_9fa48("48487") ? false : stryMutAct_9fa48("48486") ? true : (stryCov_9fa48("48486", "48487", "48488"), execRes.success && execRes.data)) {
          setExecutions(stryMutAct_9fa48("48492") ? execRes.data && [] : stryMutAct_9fa48("48491") ? false : stryMutAct_9fa48("48490") ? true : (stryCov_9fa48("48490", "48491", "48492"), execRes.data || (stryMutAct_9fa48("48493") ? ["Stryker was here"] : (stryCov_9fa48("48493"), []))));
        }
      } catch (err) {
        console.error('Failed to load flow data:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("48497") ? true : (stryCov_9fa48("48497"), false));
      }
    };
    loadFlowData();
  }, stryMutAct_9fa48("48498") ? ["Stryker was here"] : (stryCov_9fa48("48498"), []));
  const formatDuration = (ms: number | null) => {
    if (stryMutAct_9fa48("48502") ? ms !== null : stryMutAct_9fa48("48501") ? false : stryMutAct_9fa48("48500") ? true : (stryCov_9fa48("48500", "48501", "48502"), ms === null)) {
      return '—';
    }
    if (stryMutAct_9fa48("48508") ? ms >= 1000 : stryMutAct_9fa48("48507") ? ms <= 1000 : stryMutAct_9fa48("48506") ? false : stryMutAct_9fa48("48505") ? true : (stryCov_9fa48("48505", "48506", "48507", "48508"), ms < 1000)) {
      return `${ms}ms`;
    }
    if (stryMutAct_9fa48("48514") ? ms >= 60000 : stryMutAct_9fa48("48513") ? ms <= 60000 : stryMutAct_9fa48("48512") ? false : stryMutAct_9fa48("48511") ? true : (stryCov_9fa48("48511", "48512", "48513", "48514"), ms < 60000)) {
      return `${(stryMutAct_9fa48("48517") ? ms * 1000 : (stryCov_9fa48("48517"), ms / 1000)).toFixed(0)}s`;
    }
    return `${Math.floor(stryMutAct_9fa48("48519") ? ms * 60000 : (stryCov_9fa48("48519"), ms / 60000))}m ${Math.floor(stryMutAct_9fa48("48520") ? ms % 60000 * 1000 : (stryCov_9fa48("48520"), (stryMutAct_9fa48("48521") ? ms * 60000 : (stryCov_9fa48("48521"), ms % 60000)) / 1000))}s`;
  };
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = stryMutAct_9fa48("48523") ? now.getTime() + date.getTime() : (stryCov_9fa48("48523"), now.getTime() - date.getTime());
    if (stryMutAct_9fa48("48527") ? diffMs >= 60000 : stryMutAct_9fa48("48526") ? diffMs <= 60000 : stryMutAct_9fa48("48525") ? false : stryMutAct_9fa48("48524") ? true : (stryCov_9fa48("48524", "48525", "48526", "48527"), diffMs < 60000)) {
      return 'Now';
    }
    const diffMins = Math.floor(stryMutAct_9fa48("48530") ? diffMs * 60000 : (stryCov_9fa48("48530"), diffMs / 60000));
    if (stryMutAct_9fa48("48534") ? diffMins >= 60 : stryMutAct_9fa48("48533") ? diffMins <= 60 : stryMutAct_9fa48("48532") ? false : stryMutAct_9fa48("48531") ? true : (stryCov_9fa48("48531", "48532", "48533", "48534"), diffMins < 60)) {
      return `${diffMins} min ago`;
    }
    return `${Math.floor(stryMutAct_9fa48("48538") ? diffMs * 3600000 : (stryCov_9fa48("48538"), diffMs / 3600000))} hours ago`;
  };
  if (stryMutAct_9fa48("48540") ? false : stryMutAct_9fa48("48539") ? true : (stryCov_9fa48("48539", "48540"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="🌊" name="The Flow" tagline="Intelligent workflow automation and orchestration" color="#06B6D4" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <span className="ml-3 text-neutral-500">Loading workflow data...</span>
        </div>
      </div>;
  }
  return <div className="p-6">
      <PillarHeader icon="🌊" name="The Flow" tagline="Intelligent workflow automation and orchestration" color="#06B6D4" />

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Workflows" value={stryMutAct_9fa48("48542") ? stats?.activeWorkflows && 0 : (stryCov_9fa48("48542"), (stryMutAct_9fa48("48543") ? stats.activeWorkflows : (stryCov_9fa48("48543"), stats?.activeWorkflows)) ?? 0)} />
        <MetricCard label="Executions Today" value={stryMutAct_9fa48("48544") ? stats?.executionsToday && 0 : (stryCov_9fa48("48544"), (stryMutAct_9fa48("48545") ? stats.executionsToday : (stryCov_9fa48("48545"), stats?.executionsToday)) ?? 0)} />
        <MetricCard label="Success Rate" value={(stryMutAct_9fa48("48546") ? stats?.successRate && 0 : (stryCov_9fa48("48546"), (stryMutAct_9fa48("48547") ? stats.successRate : (stryCov_9fa48("48547"), stats?.successRate)) ?? 0)).toFixed(1)} unit="%" />
        <MetricCard label="Pending Approvals" value={stryMutAct_9fa48("48548") ? stats?.pendingApprovals && 0 : (stryCov_9fa48("48548"), (stryMutAct_9fa48("48549") ? stats.pendingApprovals : (stryCov_9fa48("48549"), stats?.pendingApprovals)) ?? 0)} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <button onClick={stryMutAct_9fa48("48550") ? () => undefined : (stryCov_9fa48("48550"), () => navigate('/cortex/bridge'))} className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left">
          <span className="text-3xl mb-3 block">🔧</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Workflow Builder</h3>
          <p className="text-sm text-neutral-500">Create and edit automation workflows</p>
        </button>
        <button onClick={stryMutAct_9fa48("48552") ? () => undefined : (stryCov_9fa48("48552"), () => navigate('/cortex/bridge?tab=executions'))} className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left">
          <span className="text-3xl mb-3 block">📊</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Execution History</h3>
          <p className="text-sm text-neutral-500">View past runs and logs</p>
        </button>
        <button onClick={stryMutAct_9fa48("48554") ? () => undefined : (stryCov_9fa48("48554"), () => navigate('/cortex/bridge?tab=approvals'))} className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left">
          <span className="text-3xl mb-3 block">✅</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Pending Approvals</h3>
          <p className="text-sm text-neutral-500">Review human-in-the-loop tasks</p>
        </button>
      </div>

      {/* Recent Activity - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Flow Executions</h3>
        <div className="space-y-3">
          {(stryMutAct_9fa48("48559") ? executions.length <= 0 : stryMutAct_9fa48("48558") ? executions.length >= 0 : stryMutAct_9fa48("48557") ? false : stryMutAct_9fa48("48556") ? true : (stryCov_9fa48("48556", "48557", "48558", "48559"), executions.length > 0)) ? executions.map(stryMutAct_9fa48("48560") ? () => undefined : (stryCov_9fa48("48560"), exec => <div key={exec.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={cn('w-2 h-2 rounded-full', stryMutAct_9fa48("48564") ? exec.status === 'success' || 'bg-success-main' : stryMutAct_9fa48("48563") ? false : stryMutAct_9fa48("48562") ? true : (stryCov_9fa48("48562", "48563", "48564"), (stryMutAct_9fa48("48566") ? exec.status !== 'success' : stryMutAct_9fa48("48565") ? true : (stryCov_9fa48("48565", "48566"), exec.status === 'success')) && 'bg-success-main'), stryMutAct_9fa48("48571") ? exec.status === 'running' || 'bg-primary-500 animate-pulse' : stryMutAct_9fa48("48570") ? false : stryMutAct_9fa48("48569") ? true : (stryCov_9fa48("48569", "48570", "48571"), (stryMutAct_9fa48("48573") ? exec.status !== 'running' : stryMutAct_9fa48("48572") ? true : (stryCov_9fa48("48572", "48573"), exec.status === 'running')) && 'bg-primary-500 animate-pulse'), stryMutAct_9fa48("48578") ? exec.status === 'failed' || 'bg-error-main' : stryMutAct_9fa48("48577") ? false : stryMutAct_9fa48("48576") ? true : (stryCov_9fa48("48576", "48577", "48578"), (stryMutAct_9fa48("48580") ? exec.status !== 'failed' : stryMutAct_9fa48("48579") ? true : (stryCov_9fa48("48579", "48580"), exec.status === 'failed')) && 'bg-error-main'), stryMutAct_9fa48("48585") ? exec.status === 'pending' || 'bg-warning-main' : stryMutAct_9fa48("48584") ? false : stryMutAct_9fa48("48583") ? true : (stryCov_9fa48("48583", "48584", "48585"), (stryMutAct_9fa48("48587") ? exec.status !== 'pending' : stryMutAct_9fa48("48586") ? true : (stryCov_9fa48("48586", "48587"), exec.status === 'pending')) && 'bg-warning-main'))} />
                <span className="font-medium text-neutral-900">{exec.workflowName}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>{formatDuration(exec.duration)}</span>
                <span>{formatRelativeTime(exec.startedAt)}</span>
              </div>
            </div>)) : <p className="text-neutral-500 text-center py-4">No recent executions</p>}
        </div>
      </div>
    </div>;
};

// =============================================================================
// THE HEALTH - Organizational Health
// =============================================================================

interface SystemHealth {
  overallScore: number;
  dimensions: Array<{
    name: string;
    score: number;
    color: string;
  }>;
  status: 'healthy' | 'degraded' | 'critical';
}
interface HealthAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  source: string;
  createdAt: string;
  acknowledged: boolean;
  affectedSystems?: string[];
  rootCause?: string;
  linkedWorkflow?: string;
}

// Mock alert details for demo
const MOCK_ALERT_DETAILS: Record<string, Partial<HealthAlert>> = stryMutAct_9fa48("48590") ? {} : (stryCov_9fa48("48590"), {
  'default': stryMutAct_9fa48("48591") ? {} : (stryCov_9fa48("48591"), {
    affectedSystems: stryMutAct_9fa48("48592") ? [] : (stryCov_9fa48("48592"), ['API Gateway', 'Auth Service', 'Database Cluster']),
    rootCause: 'Elevated latency detected in primary database connections, potentially due to connection pool exhaustion.',
    linkedWorkflow: 'WF-2025-034'
  })
});
export const HealthPage: React.FC = () => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<HealthAlert[]>(stryMutAct_9fa48("48599") ? ["Stryker was here"] : (stryCov_9fa48("48599"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("48600") ? false : (stryCov_9fa48("48600"), true));
  const [selectedAlert, setSelectedAlert] = useState<HealthAlert | null>(null);
  useEffect(() => {
    const loadHealthData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("48604") ? false : (stryCov_9fa48("48604"), true));
        const [healthRes, alertsRes] = await Promise.all(stryMutAct_9fa48("48605") ? [] : (stryCov_9fa48("48605"), [api.get<SystemHealth>('/pillars/health/status', stryMutAct_9fa48("48607") ? {} : (stryCov_9fa48("48607"), {
          organizationId: 'demo'
        })), api.get<HealthAlert[]>('/pillars/health/alerts', stryMutAct_9fa48("48610") ? {} : (stryCov_9fa48("48610"), {
          organizationId: 'demo'
        }))]));
        if (stryMutAct_9fa48("48614") ? healthRes.success || healthRes.data : stryMutAct_9fa48("48613") ? false : stryMutAct_9fa48("48612") ? true : (stryCov_9fa48("48612", "48613", "48614"), healthRes.success && healthRes.data)) {
          setHealth(healthRes.data);
        }
        if (stryMutAct_9fa48("48618") ? alertsRes.success || alertsRes.data : stryMutAct_9fa48("48617") ? false : stryMutAct_9fa48("48616") ? true : (stryCov_9fa48("48616", "48617", "48618"), alertsRes.success && alertsRes.data)) {
          setAlerts(stryMutAct_9fa48("48622") ? alertsRes.data && [] : stryMutAct_9fa48("48621") ? false : stryMutAct_9fa48("48620") ? true : (stryCov_9fa48("48620", "48621", "48622"), alertsRes.data || (stryMutAct_9fa48("48623") ? ["Stryker was here"] : (stryCov_9fa48("48623"), []))));
        }
      } catch (err) {
        console.error('Failed to load health data:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("48627") ? true : (stryCov_9fa48("48627"), false));
      }
    };
    loadHealthData();
  }, stryMutAct_9fa48("48628") ? ["Stryker was here"] : (stryCov_9fa48("48628"), []));
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = stryMutAct_9fa48("48630") ? now.getTime() + date.getTime() : (stryCov_9fa48("48630"), now.getTime() - date.getTime());
    const diffMins = Math.floor(stryMutAct_9fa48("48631") ? diffMs * 60000 : (stryCov_9fa48("48631"), diffMs / 60000));
    if (stryMutAct_9fa48("48635") ? diffMins >= 60 : stryMutAct_9fa48("48634") ? diffMins <= 60 : stryMutAct_9fa48("48633") ? false : stryMutAct_9fa48("48632") ? true : (stryCov_9fa48("48632", "48633", "48634", "48635"), diffMins < 60)) {
      return `${diffMins} min ago`;
    }
    return `${Math.floor(stryMutAct_9fa48("48639") ? diffMs * 3600000 : (stryCov_9fa48("48639"), diffMs / 3600000))} hours ago`;
  };
  const getScoreColor = (score: number) => {
    if (stryMutAct_9fa48("48644") ? score < 90 : stryMutAct_9fa48("48643") ? score > 90 : stryMutAct_9fa48("48642") ? false : stryMutAct_9fa48("48641") ? true : (stryCov_9fa48("48641", "48642", "48643", "48644"), score >= 90)) {
      return '#10B981';
    }
    if (stryMutAct_9fa48("48650") ? score < 70 : stryMutAct_9fa48("48649") ? score > 70 : stryMutAct_9fa48("48648") ? false : stryMutAct_9fa48("48647") ? true : (stryCov_9fa48("48647", "48648", "48649", "48650"), score >= 70)) {
      return '#F59E0B';
    }
    return '#EF4444';
  };
  if (stryMutAct_9fa48("48655") ? false : stryMutAct_9fa48("48654") ? true : (stryCov_9fa48("48654", "48655"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="💓" name="The Health" tagline="Real-time organizational health monitoring" color="#EF4444" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-neutral-500">Loading health data...</span>
        </div>
      </div>;
  }
  const overallScore = stryMutAct_9fa48("48657") ? health?.overallScore && 0 : (stryCov_9fa48("48657"), (stryMutAct_9fa48("48658") ? health.overallScore : (stryCov_9fa48("48658"), health?.overallScore)) ?? 0);
  return <div className="p-6">
      <PillarHeader icon="💓" name="The Health" tagline="Real-time organizational health monitoring" color="#EF4444" />

      {/* Health Score - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Overall Health Score</h3>
          <button onClick={stryMutAct_9fa48("48659") ? () => undefined : (stryCov_9fa48("48659"), () => navigate('/cortex/pulse'))} className="text-sm text-primary-600 hover:text-primary-700">
            View Details →
          </button>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle cx="64" cy="64" r="56" fill="none" stroke={getScoreColor(overallScore)} strokeWidth="12" strokeDasharray={`${stryMutAct_9fa48("48662") ? overallScore / 3.52 : (stryCov_9fa48("48662"), overallScore * 3.52)} 352`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">{Math.round(overallScore)}</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {(stryMutAct_9fa48("48665") ? health?.dimensions && [] : stryMutAct_9fa48("48664") ? false : stryMutAct_9fa48("48663") ? true : (stryCov_9fa48("48663", "48664", "48665"), (stryMutAct_9fa48("48666") ? health.dimensions : (stryCov_9fa48("48666"), health?.dimensions)) || (stryMutAct_9fa48("48667") ? ["Stryker was here"] : (stryCov_9fa48("48667"), [])))).map(stryMutAct_9fa48("48668") ? () => undefined : (stryCov_9fa48("48668"), (dim, idx) => <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={stryMutAct_9fa48("48669") ? {} : (stryCov_9fa48("48669"), {
              backgroundColor: stryMutAct_9fa48("48672") ? dim.color && getScoreColor(dim.score) : stryMutAct_9fa48("48671") ? false : stryMutAct_9fa48("48670") ? true : (stryCov_9fa48("48670", "48671", "48672"), dim.color || getScoreColor(dim.score))
            })} />
                <span className="text-neutral-600">{dim.name}</span>
                <span className="font-medium text-neutral-900 ml-auto">{Math.round(dim.score)}</span>
              </div>))}
          </div>
        </div>
      </div>

      {/* Active Alerts - REAL DATA - Now clickable */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Active Alerts</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error-main"></span> Critical</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning-main"></span> Warning</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-500"></span> Info</span>
          </div>
        </div>
        <div className="space-y-3">
          {(stryMutAct_9fa48("48676") ? alerts.length <= 0 : stryMutAct_9fa48("48675") ? alerts.length >= 0 : stryMutAct_9fa48("48674") ? false : stryMutAct_9fa48("48673") ? true : (stryCov_9fa48("48673", "48674", "48675", "48676"), alerts.length > 0)) ? alerts.map(stryMutAct_9fa48("48677") ? () => undefined : (stryCov_9fa48("48677"), alert => <button key={alert.id} onClick={stryMutAct_9fa48("48678") ? () => undefined : (stryCov_9fa48("48678"), () => setSelectedAlert(alert))} className={cn('w-full p-4 rounded-lg border-l-4 text-left hover:opacity-80 transition-opacity cursor-pointer', stryMutAct_9fa48("48682") ? alert.severity === 'critical' || 'bg-error-light border-error-main' : stryMutAct_9fa48("48681") ? false : stryMutAct_9fa48("48680") ? true : (stryCov_9fa48("48680", "48681", "48682"), (stryMutAct_9fa48("48684") ? alert.severity !== 'critical' : stryMutAct_9fa48("48683") ? true : (stryCov_9fa48("48683", "48684"), alert.severity === 'critical')) && 'bg-error-light border-error-main'), stryMutAct_9fa48("48689") ? alert.severity === 'warning' || 'bg-warning-light border-warning-main' : stryMutAct_9fa48("48688") ? false : stryMutAct_9fa48("48687") ? true : (stryCov_9fa48("48687", "48688", "48689"), (stryMutAct_9fa48("48691") ? alert.severity !== 'warning' : stryMutAct_9fa48("48690") ? true : (stryCov_9fa48("48690", "48691"), alert.severity === 'warning')) && 'bg-warning-light border-warning-main'), stryMutAct_9fa48("48696") ? alert.severity === 'info' || 'bg-primary-50 border-primary-500' : stryMutAct_9fa48("48695") ? false : stryMutAct_9fa48("48694") ? true : (stryCov_9fa48("48694", "48695", "48696"), (stryMutAct_9fa48("48698") ? alert.severity !== 'info' : stryMutAct_9fa48("48697") ? true : (stryCov_9fa48("48697", "48698"), alert.severity === 'info')) && 'bg-primary-50 border-primary-500'))}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-900">{alert.title}</span>
                  {stryMutAct_9fa48("48703") ? alert.description || <p className="text-sm text-neutral-600 mt-1 line-clamp-1">{alert.description}</p> : stryMutAct_9fa48("48702") ? false : stryMutAct_9fa48("48701") ? true : (stryCov_9fa48("48701", "48702", "48703"), alert.description && <p className="text-sm text-neutral-600 mt-1 line-clamp-1">{alert.description}</p>)}
                </div>
                <span className="text-sm text-neutral-500">{formatRelativeTime(alert.createdAt)}</span>
              </div>
            </button>)) : <p className="text-neutral-500 text-center py-4">No active alerts - all systems healthy</p>}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {stryMutAct_9fa48("48706") ? selectedAlert || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedAlert(null)}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', selectedAlert.severity === 'critical' ? 'bg-error-light' : selectedAlert.severity === 'warning' ? 'bg-warning-light' : 'bg-primary-50')}>
                  <AlertTriangle className={cn('w-5 h-5', selectedAlert.severity === 'critical' ? 'text-error-main' : selectedAlert.severity === 'warning' ? 'text-warning-main' : 'text-primary-500')} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedAlert.title}</h2>
                  <p className="text-sm text-neutral-500">{selectedAlert.source || 'System Monitor'} • {formatRelativeTime(selectedAlert.createdAt)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', selectedAlert.severity === 'critical' ? 'bg-error-light text-error-dark' : selectedAlert.severity === 'warning' ? 'bg-warning-light text-warning-dark' : 'bg-primary-50 text-primary-700')}>
                  {selectedAlert.severity.toUpperCase()}
                </span>
                {selectedAlert.acknowledged && <span className="text-xs px-2 py-1 bg-success-light text-success-dark rounded-full">Acknowledged</span>}
              </div>
              
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                <p className="text-sm text-neutral-600">
                  {selectedAlert.description || 'No additional details available.'}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Root Cause Analysis</h4>
                <p className="text-sm text-neutral-600">
                  {selectedAlert.rootCause || MOCK_ALERT_DETAILS.default.rootCause}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Affected Systems</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedAlert.affectedSystems || MOCK_ALERT_DETAILS.default.affectedSystems || []).map((system, i) => <span key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded">{system}</span>)}
                </div>
              </div>

              {(selectedAlert.linkedWorkflow || MOCK_ALERT_DETAILS.default.linkedWorkflow) && <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">Linked Workflow:</span>
                  <button onClick={() => navigate('/cortex/bridge')} className="text-primary-600 hover:underline flex items-center gap-1">
                    {selectedAlert.linkedWorkflow || MOCK_ALERT_DETAILS.default.linkedWorkflow} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>}

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button onClick={() => {
              setSelectedAlert(null);
              navigate('/cortex/intelligence/chronos');
            }} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Clock className="w-4 h-4" />
                  View in Chronos Timeline
                </button>
                <button onClick={() => window.open('/cortex/bridge?template=incident-response', '_blank')} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Create Response Workflow in Bridge
                </button>
                <button onClick={() => window.open('/cortex/intelligence/council?escalate=health', '_blank')} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  Escalate to Council
                </button>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("48705") ? false : stryMutAct_9fa48("48704") ? true : (stryCov_9fa48("48704", "48705", "48706"), selectedAlert && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("48707") ? () => undefined : (stryCov_9fa48("48707"), () => setSelectedAlert(null))}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={stryMutAct_9fa48("48708") ? () => undefined : (stryCov_9fa48("48708"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', (stryMutAct_9fa48("48712") ? selectedAlert.severity !== 'critical' : stryMutAct_9fa48("48711") ? false : stryMutAct_9fa48("48710") ? true : (stryCov_9fa48("48710", "48711", "48712"), selectedAlert.severity === 'critical')) ? 'bg-error-light' : (stryMutAct_9fa48("48717") ? selectedAlert.severity !== 'warning' : stryMutAct_9fa48("48716") ? false : stryMutAct_9fa48("48715") ? true : (stryCov_9fa48("48715", "48716", "48717"), selectedAlert.severity === 'warning')) ? 'bg-warning-light' : 'bg-primary-50')}>
                  <AlertTriangle className={cn('w-5 h-5', (stryMutAct_9fa48("48724") ? selectedAlert.severity !== 'critical' : stryMutAct_9fa48("48723") ? false : stryMutAct_9fa48("48722") ? true : (stryCov_9fa48("48722", "48723", "48724"), selectedAlert.severity === 'critical')) ? 'text-error-main' : (stryMutAct_9fa48("48729") ? selectedAlert.severity !== 'warning' : stryMutAct_9fa48("48728") ? false : stryMutAct_9fa48("48727") ? true : (stryCov_9fa48("48727", "48728", "48729"), selectedAlert.severity === 'warning')) ? 'text-warning-main' : 'text-primary-500')} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedAlert.title}</h2>
                  <p className="text-sm text-neutral-500">{stryMutAct_9fa48("48735") ? selectedAlert.source && 'System Monitor' : stryMutAct_9fa48("48734") ? false : stryMutAct_9fa48("48733") ? true : (stryCov_9fa48("48733", "48734", "48735"), selectedAlert.source || 'System Monitor')} • {formatRelativeTime(selectedAlert.createdAt)}</p>
                </div>
              </div>
              <button onClick={stryMutAct_9fa48("48737") ? () => undefined : (stryCov_9fa48("48737"), () => setSelectedAlert(null))} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', (stryMutAct_9fa48("48741") ? selectedAlert.severity !== 'critical' : stryMutAct_9fa48("48740") ? false : stryMutAct_9fa48("48739") ? true : (stryCov_9fa48("48739", "48740", "48741"), selectedAlert.severity === 'critical')) ? 'bg-error-light text-error-dark' : (stryMutAct_9fa48("48746") ? selectedAlert.severity !== 'warning' : stryMutAct_9fa48("48745") ? false : stryMutAct_9fa48("48744") ? true : (stryCov_9fa48("48744", "48745", "48746"), selectedAlert.severity === 'warning')) ? 'bg-warning-light text-warning-dark' : 'bg-primary-50 text-primary-700')}>
                  {stryMutAct_9fa48("48750") ? selectedAlert.severity.toLowerCase() : (stryCov_9fa48("48750"), selectedAlert.severity.toUpperCase())}
                </span>
                {stryMutAct_9fa48("48753") ? selectedAlert.acknowledged || <span className="text-xs px-2 py-1 bg-success-light text-success-dark rounded-full">Acknowledged</span> : stryMutAct_9fa48("48752") ? false : stryMutAct_9fa48("48751") ? true : (stryCov_9fa48("48751", "48752", "48753"), selectedAlert.acknowledged && <span className="text-xs px-2 py-1 bg-success-light text-success-dark rounded-full">Acknowledged</span>)}
              </div>
              
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                <p className="text-sm text-neutral-600">
                  {stryMutAct_9fa48("48756") ? selectedAlert.description && 'No additional details available.' : stryMutAct_9fa48("48755") ? false : stryMutAct_9fa48("48754") ? true : (stryCov_9fa48("48754", "48755", "48756"), selectedAlert.description || 'No additional details available.')}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Root Cause Analysis</h4>
                <p className="text-sm text-neutral-600">
                  {stryMutAct_9fa48("48760") ? selectedAlert.rootCause && MOCK_ALERT_DETAILS.default.rootCause : stryMutAct_9fa48("48759") ? false : stryMutAct_9fa48("48758") ? true : (stryCov_9fa48("48758", "48759", "48760"), selectedAlert.rootCause || MOCK_ALERT_DETAILS.default.rootCause)}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Affected Systems</h4>
                <div className="flex flex-wrap gap-2">
                  {(stryMutAct_9fa48("48763") ? (selectedAlert.affectedSystems || MOCK_ALERT_DETAILS.default.affectedSystems) && [] : stryMutAct_9fa48("48762") ? false : stryMutAct_9fa48("48761") ? true : (stryCov_9fa48("48761", "48762", "48763"), (stryMutAct_9fa48("48765") ? selectedAlert.affectedSystems && MOCK_ALERT_DETAILS.default.affectedSystems : stryMutAct_9fa48("48764") ? false : (stryCov_9fa48("48764", "48765"), selectedAlert.affectedSystems || MOCK_ALERT_DETAILS.default.affectedSystems)) || (stryMutAct_9fa48("48766") ? ["Stryker was here"] : (stryCov_9fa48("48766"), [])))).map(stryMutAct_9fa48("48767") ? () => undefined : (stryCov_9fa48("48767"), (system, i) => <span key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded">{system}</span>))}
                </div>
              </div>

              {stryMutAct_9fa48("48770") ? selectedAlert.linkedWorkflow || MOCK_ALERT_DETAILS.default.linkedWorkflow || <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">Linked Workflow:</span>
                  <button onClick={() => navigate('/cortex/bridge')} className="text-primary-600 hover:underline flex items-center gap-1">
                    {selectedAlert.linkedWorkflow || MOCK_ALERT_DETAILS.default.linkedWorkflow} <ExternalLink className="w-3 h-3" />
                  </button>
                </div> : stryMutAct_9fa48("48769") ? false : stryMutAct_9fa48("48768") ? true : (stryCov_9fa48("48768", "48769", "48770"), (stryMutAct_9fa48("48772") ? selectedAlert.linkedWorkflow && MOCK_ALERT_DETAILS.default.linkedWorkflow : stryMutAct_9fa48("48771") ? true : (stryCov_9fa48("48771", "48772"), selectedAlert.linkedWorkflow || MOCK_ALERT_DETAILS.default.linkedWorkflow)) && <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">Linked Workflow:</span>
                  <button onClick={stryMutAct_9fa48("48773") ? () => undefined : (stryCov_9fa48("48773"), () => navigate('/cortex/bridge'))} className="text-primary-600 hover:underline flex items-center gap-1">
                    {stryMutAct_9fa48("48777") ? selectedAlert.linkedWorkflow && MOCK_ALERT_DETAILS.default.linkedWorkflow : stryMutAct_9fa48("48776") ? false : stryMutAct_9fa48("48775") ? true : (stryCov_9fa48("48775", "48776", "48777"), selectedAlert.linkedWorkflow || MOCK_ALERT_DETAILS.default.linkedWorkflow)} <ExternalLink className="w-3 h-3" />
                  </button>
                </div>)}

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button onClick={() => {
              setSelectedAlert(null);
              navigate('/cortex/intelligence/chronos');
            }} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Clock className="w-4 h-4" />
                  View in Chronos Timeline
                </button>
                <button onClick={stryMutAct_9fa48("48780") ? () => undefined : (stryCov_9fa48("48780"), () => window.open('/cortex/bridge?template=incident-response', '_blank'))} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Create Response Workflow in Bridge
                </button>
                <button onClick={stryMutAct_9fa48("48783") ? () => undefined : (stryCov_9fa48("48783"), () => window.open('/cortex/intelligence/council?escalate=health', '_blank'))} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  Escalate to Council
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// THE GUARD - Security Posture
// =============================================================================

interface SecurityPosture {
  securityScore: number;
  openVulnerabilities: number;
  complianceScore: number;
  daysSinceIncident: number;
  frameworks: Array<{
    id: string;
    name: string;
    status: 'compliant' | 'in_progress' | 'non_compliant';
    implementedControls: number;
    totalControls: number;
  }>;
}
interface SecurityThreat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  detectedAt: string;
  status: string;
  description?: string;
  affectedAssets?: string[];
  cve?: string;
  cvss?: number;
}

// Mock threat details for demo
const MOCK_THREAT_DETAILS: Record<string, Partial<SecurityThreat>> = stryMutAct_9fa48("48786") ? {} : (stryCov_9fa48("48786"), {
  'default': stryMutAct_9fa48("48787") ? {} : (stryCov_9fa48("48787"), {
    description: 'Potential security event detected requiring investigation.',
    affectedAssets: stryMutAct_9fa48("48789") ? [] : (stryCov_9fa48("48789"), ['Production Server', 'API Gateway']),
    cve: 'CVE-2024-1234',
    cvss: 7.5
  })
});
export const GuardPage: React.FC = () => {
  const navigate = useNavigate();
  const [posture, setPosture] = useState<SecurityPosture | null>(null);
  const [threats, setThreats] = useState<SecurityThreat[]>(stryMutAct_9fa48("48794") ? ["Stryker was here"] : (stryCov_9fa48("48794"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("48795") ? false : (stryCov_9fa48("48795"), true));
  const [error, setError] = useState<string | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<SecurityThreat | null>(null);
  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("48799") ? false : (stryCov_9fa48("48799"), true));
        setError(null);

        // Fetch security posture and threats from backend
        const [postureRes, threatsRes] = await Promise.all(stryMutAct_9fa48("48800") ? [] : (stryCov_9fa48("48800"), [api.get<SecurityPosture>('/pillars/guard/posture', stryMutAct_9fa48("48802") ? {} : (stryCov_9fa48("48802"), {
          organizationId: 'demo'
        })), api.get<SecurityThreat[]>('/pillars/guard/threats', stryMutAct_9fa48("48805") ? {} : (stryCov_9fa48("48805"), {
          organizationId: 'demo'
        }))]));
        if (stryMutAct_9fa48("48809") ? postureRes.success || postureRes.data : stryMutAct_9fa48("48808") ? false : stryMutAct_9fa48("48807") ? true : (stryCov_9fa48("48807", "48808", "48809"), postureRes.success && postureRes.data)) {
          setPosture(postureRes.data);
        }
        if (stryMutAct_9fa48("48813") ? threatsRes.success || threatsRes.data : stryMutAct_9fa48("48812") ? false : stryMutAct_9fa48("48811") ? true : (stryCov_9fa48("48811", "48812", "48813"), threatsRes.success && threatsRes.data)) {
          setThreats(threatsRes.data);
        }
      } catch (err) {
        console.error('Failed to load security data:', err);
        setError('Failed to load security data');
      } finally {
        setIsLoading(stryMutAct_9fa48("48819") ? true : (stryCov_9fa48("48819"), false));
      }
    };
    loadSecurityData();
  }, stryMutAct_9fa48("48820") ? ["Stryker was here"] : (stryCov_9fa48("48820"), []));

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = stryMutAct_9fa48("48822") ? now.getTime() + date.getTime() : (stryCov_9fa48("48822"), now.getTime() - date.getTime());
    const diffMins = Math.floor(stryMutAct_9fa48("48823") ? diffMs * 60000 : (stryCov_9fa48("48823"), diffMs / 60000));
    const diffHours = Math.floor(stryMutAct_9fa48("48824") ? diffMs * 3600000 : (stryCov_9fa48("48824"), diffMs / 3600000));
    const diffDays = Math.floor(stryMutAct_9fa48("48825") ? diffMs * 86400000 : (stryCov_9fa48("48825"), diffMs / 86400000));
    if (stryMutAct_9fa48("48829") ? diffMins >= 60 : stryMutAct_9fa48("48828") ? diffMins <= 60 : stryMutAct_9fa48("48827") ? false : stryMutAct_9fa48("48826") ? true : (stryCov_9fa48("48826", "48827", "48828", "48829"), diffMins < 60)) {
      return `${diffMins} minutes ago`;
    }
    if (stryMutAct_9fa48("48835") ? diffHours >= 24 : stryMutAct_9fa48("48834") ? diffHours <= 24 : stryMutAct_9fa48("48833") ? false : stryMutAct_9fa48("48832") ? true : (stryCov_9fa48("48832", "48833", "48834", "48835"), diffHours < 24)) {
      return `${diffHours} hours ago`;
    }
    return `${diffDays} days ago`;
  };
  if (stryMutAct_9fa48("48840") ? false : stryMutAct_9fa48("48839") ? true : (stryCov_9fa48("48839", "48840"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="🛡️" name="The Guard" tagline="Proactive security posture and compliance monitoring" color="#F59E0B" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-neutral-500">Loading security data...</span>
        </div>
      </div>;
  }
  return <div className="p-6">
      <PillarHeader icon="🛡️" name="The Guard" tagline="Proactive security posture and compliance monitoring" color="#F59E0B" />

      {/* Sovereign Security Integration */}
      <div className="mb-6 flex items-center gap-3">
        <a href="http://localhost:8090" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors">
          <span className="text-red-500 text-xs font-medium">🔐 Infisical Secrets</span>
        </a>
        <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors">
          <span className="text-blue-500 text-xs font-medium">🔑 Keycloak SSO</span>
        </a>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <span className="text-amber-500 text-xs font-medium">🛡️ Wazuh XDR (Coming Soon)</span>
        </div>
      </div>

      {stryMutAct_9fa48("48844") ? error || <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">
          {error}
        </div> : stryMutAct_9fa48("48843") ? false : stryMutAct_9fa48("48842") ? true : (stryCov_9fa48("48842", "48843", "48844"), error && <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">
          {error}
        </div>)}

      {/* Security Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Security Score" value={Math.round(stryMutAct_9fa48("48845") ? posture?.securityScore && 0 : (stryCov_9fa48("48845"), (stryMutAct_9fa48("48846") ? posture.securityScore : (stryCov_9fa48("48846"), posture?.securityScore)) ?? 0))} unit="/100" />
        <MetricCard label="Open Vulnerabilities" value={stryMutAct_9fa48("48847") ? posture?.openVulnerabilities && 0 : (stryCov_9fa48("48847"), (stryMutAct_9fa48("48848") ? posture.openVulnerabilities : (stryCov_9fa48("48848"), posture?.openVulnerabilities)) ?? 0)} />
        <MetricCard label="Compliance Status" value={Math.round(stryMutAct_9fa48("48849") ? posture?.complianceScore && 0 : (stryCov_9fa48("48849"), (stryMutAct_9fa48("48850") ? posture.complianceScore : (stryCov_9fa48("48850"), posture?.complianceScore)) ?? 0))} unit="%" />
        <MetricCard label="Days Since Incident" value={stryMutAct_9fa48("48851") ? posture?.daysSinceIncident && 0 : (stryCov_9fa48("48851"), (stryMutAct_9fa48("48852") ? posture.daysSinceIncident : (stryCov_9fa48("48852"), posture?.daysSinceIncident)) ?? 0)} />
      </div>

      {/* Compliance Frameworks - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Compliance Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(stryMutAct_9fa48("48855") ? posture?.frameworks && [] : stryMutAct_9fa48("48854") ? false : stryMutAct_9fa48("48853") ? true : (stryCov_9fa48("48853", "48854", "48855"), (stryMutAct_9fa48("48856") ? posture.frameworks : (stryCov_9fa48("48856"), posture?.frameworks)) || (stryMutAct_9fa48("48857") ? ["Stryker was here"] : (stryCov_9fa48("48857"), [])))).map(stryMutAct_9fa48("48858") ? () => undefined : (stryCov_9fa48("48858"), (fw, idx) => <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-900">{fw.name}</span>
                <span className={cn('text-xs px-2 py-1 rounded-full', (stryMutAct_9fa48("48862") ? fw.status !== 'compliant' : stryMutAct_9fa48("48861") ? false : stryMutAct_9fa48("48860") ? true : (stryCov_9fa48("48860", "48861", "48862"), fw.status === 'compliant')) ? 'bg-success-light text-success-dark' : (stryMutAct_9fa48("48867") ? fw.status !== 'in_progress' : stryMutAct_9fa48("48866") ? false : stryMutAct_9fa48("48865") ? true : (stryCov_9fa48("48865", "48866", "48867"), fw.status === 'in_progress')) ? 'bg-warning-light text-warning-dark' : 'bg-error-light text-error-dark')}>
                  {(stryMutAct_9fa48("48873") ? fw.status !== 'compliant' : stryMutAct_9fa48("48872") ? false : stryMutAct_9fa48("48871") ? true : (stryCov_9fa48("48871", "48872", "48873"), fw.status === 'compliant')) ? 'Compliant' : (stryMutAct_9fa48("48878") ? fw.status !== 'in_progress' : stryMutAct_9fa48("48877") ? false : stryMutAct_9fa48("48876") ? true : (stryCov_9fa48("48876", "48877", "48878"), fw.status === 'in_progress')) ? 'In Progress' : 'Non-Compliant'}
                </span>
              </div>
              <p className="text-sm text-neutral-500">{fw.implementedControls}/{fw.totalControls} controls</p>
            </div>))}
          {stryMutAct_9fa48("48884") ? !posture?.frameworks || posture.frameworks.length === 0 || <p className="col-span-4 text-neutral-500 text-center py-4">No compliance frameworks configured</p> : stryMutAct_9fa48("48883") ? false : stryMutAct_9fa48("48882") ? true : (stryCov_9fa48("48882", "48883", "48884"), (stryMutAct_9fa48("48886") ? !posture?.frameworks && posture.frameworks.length === 0 : stryMutAct_9fa48("48885") ? true : (stryCov_9fa48("48885", "48886"), (stryMutAct_9fa48("48887") ? posture?.frameworks : (stryCov_9fa48("48887"), !(stryMutAct_9fa48("48888") ? posture.frameworks : (stryCov_9fa48("48888"), posture?.frameworks)))) || (stryMutAct_9fa48("48890") ? posture.frameworks.length !== 0 : stryMutAct_9fa48("48889") ? false : (stryCov_9fa48("48889", "48890"), posture.frameworks.length === 0)))) && <p className="col-span-4 text-neutral-500 text-center py-4">No compliance frameworks configured</p>)}
        </div>
      </div>

      {/* Threats - REAL DATA - Now clickable */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Threat Detection</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error-main"></span> Critical/High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning-main"></span> Medium</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neutral-400"></span> Low</span>
          </div>
        </div>
        <div className="space-y-3">
          {(stryMutAct_9fa48("48894") ? threats.length <= 0 : stryMutAct_9fa48("48893") ? threats.length >= 0 : stryMutAct_9fa48("48892") ? false : stryMutAct_9fa48("48891") ? true : (stryCov_9fa48("48891", "48892", "48893", "48894"), threats.length > 0)) ? threats.map(stryMutAct_9fa48("48895") ? () => undefined : (stryCov_9fa48("48895"), threat => <button key={threat.id} onClick={stryMutAct_9fa48("48896") ? () => undefined : (stryCov_9fa48("48896"), () => setSelectedThreat(threat))} className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 hover:border-primary-500 border border-transparent transition-all text-left">
              <div className="flex items-center gap-3">
                <span className={cn('w-2 h-2 rounded-full', stryMutAct_9fa48("48900") ? threat.severity === 'critical' || 'bg-error-main' : stryMutAct_9fa48("48899") ? false : stryMutAct_9fa48("48898") ? true : (stryCov_9fa48("48898", "48899", "48900"), (stryMutAct_9fa48("48902") ? threat.severity !== 'critical' : stryMutAct_9fa48("48901") ? true : (stryCov_9fa48("48901", "48902"), threat.severity === 'critical')) && 'bg-error-main'), stryMutAct_9fa48("48907") ? threat.severity === 'high' || 'bg-error-main' : stryMutAct_9fa48("48906") ? false : stryMutAct_9fa48("48905") ? true : (stryCov_9fa48("48905", "48906", "48907"), (stryMutAct_9fa48("48909") ? threat.severity !== 'high' : stryMutAct_9fa48("48908") ? true : (stryCov_9fa48("48908", "48909"), threat.severity === 'high')) && 'bg-error-main'), stryMutAct_9fa48("48914") ? threat.severity === 'medium' || 'bg-warning-main' : stryMutAct_9fa48("48913") ? false : stryMutAct_9fa48("48912") ? true : (stryCov_9fa48("48912", "48913", "48914"), (stryMutAct_9fa48("48916") ? threat.severity !== 'medium' : stryMutAct_9fa48("48915") ? true : (stryCov_9fa48("48915", "48916"), threat.severity === 'medium')) && 'bg-warning-main'), stryMutAct_9fa48("48921") ? threat.severity === 'low' || 'bg-neutral-400' : stryMutAct_9fa48("48920") ? false : stryMutAct_9fa48("48919") ? true : (stryCov_9fa48("48919", "48920", "48921"), (stryMutAct_9fa48("48923") ? threat.severity !== 'low' : stryMutAct_9fa48("48922") ? true : (stryCov_9fa48("48922", "48923"), threat.severity === 'low')) && 'bg-neutral-400'))} />
                <div>
                  <p className="font-medium text-neutral-900">{threat.type}</p>
                  <p className="text-sm text-neutral-500">{threat.source}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={cn('text-xs px-2 py-1 rounded-full', (stryMutAct_9fa48("48929") ? threat.status === 'resolved' && threat.status === 'mitigated' : stryMutAct_9fa48("48928") ? false : stryMutAct_9fa48("48927") ? true : (stryCov_9fa48("48927", "48928", "48929"), (stryMutAct_9fa48("48931") ? threat.status !== 'resolved' : stryMutAct_9fa48("48930") ? false : (stryCov_9fa48("48930", "48931"), threat.status === 'resolved')) || (stryMutAct_9fa48("48934") ? threat.status !== 'mitigated' : stryMutAct_9fa48("48933") ? false : (stryCov_9fa48("48933", "48934"), threat.status === 'mitigated')))) ? 'bg-success-light text-success-dark' : (stryMutAct_9fa48("48939") ? threat.status !== 'investigating' : stryMutAct_9fa48("48938") ? false : stryMutAct_9fa48("48937") ? true : (stryCov_9fa48("48937", "48938", "48939"), threat.status === 'investigating')) ? 'bg-warning-light text-warning-dark' : 'bg-neutral-100 text-neutral-600')}>
                  {threat.status}
                </span>
                <p className="text-xs text-neutral-500 mt-1">{formatRelativeTime(threat.detectedAt)}</p>
              </div>
            </button>)) : <p className="text-neutral-500 text-center py-4">No active threats detected</p>}
        </div>
      </div>

      {/* Threat Detail Modal */}
      {stryMutAct_9fa48("48945") ? selectedThreat || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedThreat(null)}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', selectedThreat.severity === 'critical' || selectedThreat.severity === 'high' ? 'bg-error-light' : 'bg-warning-light')}>
                  <AlertTriangle className={cn('w-5 h-5', selectedThreat.severity === 'critical' || selectedThreat.severity === 'high' ? 'text-error-main' : 'text-warning-main')} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedThreat.type}</h2>
                  <p className="text-sm text-neutral-500">{selectedThreat.source} • {formatRelativeTime(selectedThreat.detectedAt)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedThreat(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', selectedThreat.severity === 'critical' ? 'bg-error-light text-error-dark' : selectedThreat.severity === 'high' ? 'bg-error-light text-error-dark' : selectedThreat.severity === 'medium' ? 'bg-warning-light text-warning-dark' : 'bg-neutral-100 text-neutral-600')}>
                  {selectedThreat.severity.toUpperCase()}
                </span>
                <span className={cn('text-xs px-2 py-1 rounded-full', selectedThreat.status === 'resolved' || selectedThreat.status === 'mitigated' ? 'bg-success-light text-success-dark' : selectedThreat.status === 'investigating' ? 'bg-warning-light text-warning-dark' : 'bg-neutral-100 text-neutral-600')}>
                  {selectedThreat.status}
                </span>
                {MOCK_THREAT_DETAILS.default.cvss && <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">
                    CVSS: {MOCK_THREAT_DETAILS.default.cvss}
                  </span>}
              </div>
              
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                <p className="text-sm text-neutral-600">
                  {selectedThreat.description || MOCK_THREAT_DETAILS.default.description}
                </p>
              </div>

              {MOCK_THREAT_DETAILS.default.cve && <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">CVE:</span>
                  <a href={`https://nvd.nist.gov/vuln/detail/${MOCK_THREAT_DETAILS.default.cve}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center gap-1">
                    {MOCK_THREAT_DETAILS.default.cve} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>}

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Affected Assets</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedThreat.affectedAssets || MOCK_THREAT_DETAILS.default.affectedAssets || []).map((asset, i) => <span key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded">{asset}</span>)}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button onClick={() => {
              setSelectedThreat(null);
              navigate('/sovereign/panopticon');
            }} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Shield className="w-4 h-4" />
                  View in Panopticon
                </button>
                <button onClick={() => window.open('/cortex/intelligence/council?escalate=security', '_blank')} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Escalate to Council
                </button>
                <button onClick={() => window.open('/cortex/bridge?template=incident-response', '_blank')} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  Create Incident Response Workflow
                </button>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("48944") ? false : stryMutAct_9fa48("48943") ? true : (stryCov_9fa48("48943", "48944", "48945"), selectedThreat && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("48946") ? () => undefined : (stryCov_9fa48("48946"), () => setSelectedThreat(null))}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={stryMutAct_9fa48("48947") ? () => undefined : (stryCov_9fa48("48947"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', (stryMutAct_9fa48("48951") ? selectedThreat.severity === 'critical' && selectedThreat.severity === 'high' : stryMutAct_9fa48("48950") ? false : stryMutAct_9fa48("48949") ? true : (stryCov_9fa48("48949", "48950", "48951"), (stryMutAct_9fa48("48953") ? selectedThreat.severity !== 'critical' : stryMutAct_9fa48("48952") ? false : (stryCov_9fa48("48952", "48953"), selectedThreat.severity === 'critical')) || (stryMutAct_9fa48("48956") ? selectedThreat.severity !== 'high' : stryMutAct_9fa48("48955") ? false : (stryCov_9fa48("48955", "48956"), selectedThreat.severity === 'high')))) ? 'bg-error-light' : 'bg-warning-light')}>
                  <AlertTriangle className={cn('w-5 h-5', (stryMutAct_9fa48("48963") ? selectedThreat.severity === 'critical' && selectedThreat.severity === 'high' : stryMutAct_9fa48("48962") ? false : stryMutAct_9fa48("48961") ? true : (stryCov_9fa48("48961", "48962", "48963"), (stryMutAct_9fa48("48965") ? selectedThreat.severity !== 'critical' : stryMutAct_9fa48("48964") ? false : (stryCov_9fa48("48964", "48965"), selectedThreat.severity === 'critical')) || (stryMutAct_9fa48("48968") ? selectedThreat.severity !== 'high' : stryMutAct_9fa48("48967") ? false : (stryCov_9fa48("48967", "48968"), selectedThreat.severity === 'high')))) ? 'text-error-main' : 'text-warning-main')} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedThreat.type}</h2>
                  <p className="text-sm text-neutral-500">{selectedThreat.source} • {formatRelativeTime(selectedThreat.detectedAt)}</p>
                </div>
              </div>
              <button onClick={stryMutAct_9fa48("48972") ? () => undefined : (stryCov_9fa48("48972"), () => setSelectedThreat(null))} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', (stryMutAct_9fa48("48976") ? selectedThreat.severity !== 'critical' : stryMutAct_9fa48("48975") ? false : stryMutAct_9fa48("48974") ? true : (stryCov_9fa48("48974", "48975", "48976"), selectedThreat.severity === 'critical')) ? 'bg-error-light text-error-dark' : (stryMutAct_9fa48("48981") ? selectedThreat.severity !== 'high' : stryMutAct_9fa48("48980") ? false : stryMutAct_9fa48("48979") ? true : (stryCov_9fa48("48979", "48980", "48981"), selectedThreat.severity === 'high')) ? 'bg-error-light text-error-dark' : (stryMutAct_9fa48("48986") ? selectedThreat.severity !== 'medium' : stryMutAct_9fa48("48985") ? false : stryMutAct_9fa48("48984") ? true : (stryCov_9fa48("48984", "48985", "48986"), selectedThreat.severity === 'medium')) ? 'bg-warning-light text-warning-dark' : 'bg-neutral-100 text-neutral-600')}>
                  {stryMutAct_9fa48("48990") ? selectedThreat.severity.toLowerCase() : (stryCov_9fa48("48990"), selectedThreat.severity.toUpperCase())}
                </span>
                <span className={cn('text-xs px-2 py-1 rounded-full', (stryMutAct_9fa48("48994") ? selectedThreat.status === 'resolved' && selectedThreat.status === 'mitigated' : stryMutAct_9fa48("48993") ? false : stryMutAct_9fa48("48992") ? true : (stryCov_9fa48("48992", "48993", "48994"), (stryMutAct_9fa48("48996") ? selectedThreat.status !== 'resolved' : stryMutAct_9fa48("48995") ? false : (stryCov_9fa48("48995", "48996"), selectedThreat.status === 'resolved')) || (stryMutAct_9fa48("48999") ? selectedThreat.status !== 'mitigated' : stryMutAct_9fa48("48998") ? false : (stryCov_9fa48("48998", "48999"), selectedThreat.status === 'mitigated')))) ? 'bg-success-light text-success-dark' : (stryMutAct_9fa48("49004") ? selectedThreat.status !== 'investigating' : stryMutAct_9fa48("49003") ? false : stryMutAct_9fa48("49002") ? true : (stryCov_9fa48("49002", "49003", "49004"), selectedThreat.status === 'investigating')) ? 'bg-warning-light text-warning-dark' : 'bg-neutral-100 text-neutral-600')}>
                  {selectedThreat.status}
                </span>
                {stryMutAct_9fa48("49010") ? MOCK_THREAT_DETAILS.default.cvss || <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">
                    CVSS: {MOCK_THREAT_DETAILS.default.cvss}
                  </span> : stryMutAct_9fa48("49009") ? false : stryMutAct_9fa48("49008") ? true : (stryCov_9fa48("49008", "49009", "49010"), MOCK_THREAT_DETAILS.default.cvss && <span className="text-xs px-2 py-1 bg-neutral-100 rounded-full">
                    CVSS: {MOCK_THREAT_DETAILS.default.cvss}
                  </span>)}
              </div>
              
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Description</h4>
                <p className="text-sm text-neutral-600">
                  {stryMutAct_9fa48("49013") ? selectedThreat.description && MOCK_THREAT_DETAILS.default.description : stryMutAct_9fa48("49012") ? false : stryMutAct_9fa48("49011") ? true : (stryCov_9fa48("49011", "49012", "49013"), selectedThreat.description || MOCK_THREAT_DETAILS.default.description)}
                </p>
              </div>

              {stryMutAct_9fa48("49016") ? MOCK_THREAT_DETAILS.default.cve || <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">CVE:</span>
                  <a href={`https://nvd.nist.gov/vuln/detail/${MOCK_THREAT_DETAILS.default.cve}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center gap-1">
                    {MOCK_THREAT_DETAILS.default.cve} <ExternalLink className="w-3 h-3" />
                  </a>
                </div> : stryMutAct_9fa48("49015") ? false : stryMutAct_9fa48("49014") ? true : (stryCov_9fa48("49014", "49015", "49016"), MOCK_THREAT_DETAILS.default.cve && <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">CVE:</span>
                  <a href={`https://nvd.nist.gov/vuln/detail/${MOCK_THREAT_DETAILS.default.cve}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center gap-1">
                    {MOCK_THREAT_DETAILS.default.cve} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>)}

              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Affected Assets</h4>
                <div className="flex flex-wrap gap-2">
                  {(stryMutAct_9fa48("49020") ? (selectedThreat.affectedAssets || MOCK_THREAT_DETAILS.default.affectedAssets) && [] : stryMutAct_9fa48("49019") ? false : stryMutAct_9fa48("49018") ? true : (stryCov_9fa48("49018", "49019", "49020"), (stryMutAct_9fa48("49022") ? selectedThreat.affectedAssets && MOCK_THREAT_DETAILS.default.affectedAssets : stryMutAct_9fa48("49021") ? false : (stryCov_9fa48("49021", "49022"), selectedThreat.affectedAssets || MOCK_THREAT_DETAILS.default.affectedAssets)) || (stryMutAct_9fa48("49023") ? ["Stryker was here"] : (stryCov_9fa48("49023"), [])))).map(stryMutAct_9fa48("49024") ? () => undefined : (stryCov_9fa48("49024"), (asset, i) => <span key={i} className="text-xs px-2 py-1 bg-neutral-100 rounded">{asset}</span>))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button onClick={() => {
              setSelectedThreat(null);
              navigate('/sovereign/panopticon');
            }} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Shield className="w-4 h-4" />
                  View in Panopticon
                </button>
                <button onClick={stryMutAct_9fa48("49027") ? () => undefined : (stryCov_9fa48("49027"), () => window.open('/cortex/intelligence/council?escalate=security', '_blank'))} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-4 h-4" />
                  Escalate to Council
                </button>
                <button onClick={stryMutAct_9fa48("49030") ? () => undefined : (stryCov_9fa48("49030"), () => window.open('/cortex/bridge?template=incident-response', '_blank'))} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  Create Incident Response Workflow
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// THE ETHICS - Ethical Guardrails
// =============================================================================

interface EthicsStats {
  policyCompliance: number;
  biasChecks: number;
  flaggedDecisions: number;
  humanOverrides: number;
}
interface EthicsPrinciple {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  checksThisWeek: number;
}
interface EthicsReview {
  id: string;
  decisionId?: string;
  decisionName: string;
  result: 'approved' | 'flagged' | 'rejected';
  reviewedBy: string;
  reviewedAt: string;
  principle?: string;
  rationale?: string;
  biasScore?: number;
}

// Mock review details for demo
const MOCK_REVIEW_DETAILS: Record<string, Partial<EthicsReview>> = stryMutAct_9fa48("49033") ? {} : (stryCov_9fa48("49033"), {
  'default': stryMutAct_9fa48("49034") ? {} : (stryCov_9fa48("49034"), {
    principle: 'Fairness & Non-Discrimination',
    rationale: 'Decision was reviewed for potential bias in outcome distribution across demographic groups. Analysis found no significant disparate impact.',
    biasScore: 0.12,
    decisionId: 'DEC-2025-0042'
  })
});
export const EthicsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<EthicsStats | null>(null);
  const [principles, setPrinciples] = useState<EthicsPrinciple[]>(stryMutAct_9fa48("49039") ? ["Stryker was here"] : (stryCov_9fa48("49039"), []));
  const [reviews, setReviews] = useState<EthicsReview[]>(stryMutAct_9fa48("49040") ? ["Stryker was here"] : (stryCov_9fa48("49040"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("49041") ? false : (stryCov_9fa48("49041"), true));
  const [selectedReview, setSelectedReview] = useState<EthicsReview | null>(null);
  useEffect(() => {
    const loadEthicsData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("49045") ? false : (stryCov_9fa48("49045"), true));
        const [statsRes, principlesRes, reviewsRes] = await Promise.all(stryMutAct_9fa48("49046") ? [] : (stryCov_9fa48("49046"), [api.get<EthicsStats>('/pillars/ethics/stats', stryMutAct_9fa48("49048") ? {} : (stryCov_9fa48("49048"), {
          organizationId: 'demo'
        })), api.get<EthicsPrinciple[]>('/pillars/ethics/principles', stryMutAct_9fa48("49051") ? {} : (stryCov_9fa48("49051"), {
          organizationId: 'demo'
        })), api.get<EthicsReview[]>('/pillars/ethics/reviews', stryMutAct_9fa48("49054") ? {} : (stryCov_9fa48("49054"), {
          organizationId: 'demo'
        }))]));
        if (stryMutAct_9fa48("49058") ? statsRes.success || statsRes.data : stryMutAct_9fa48("49057") ? false : stryMutAct_9fa48("49056") ? true : (stryCov_9fa48("49056", "49057", "49058"), statsRes.success && statsRes.data)) {
          setStats(statsRes.data);
        }
        if (stryMutAct_9fa48("49062") ? principlesRes.success || principlesRes.data : stryMutAct_9fa48("49061") ? false : stryMutAct_9fa48("49060") ? true : (stryCov_9fa48("49060", "49061", "49062"), principlesRes.success && principlesRes.data)) {
          setPrinciples(stryMutAct_9fa48("49066") ? principlesRes.data && [] : stryMutAct_9fa48("49065") ? false : stryMutAct_9fa48("49064") ? true : (stryCov_9fa48("49064", "49065", "49066"), principlesRes.data || (stryMutAct_9fa48("49067") ? ["Stryker was here"] : (stryCov_9fa48("49067"), []))));
        }
        if (stryMutAct_9fa48("49070") ? reviewsRes.success || reviewsRes.data : stryMutAct_9fa48("49069") ? false : stryMutAct_9fa48("49068") ? true : (stryCov_9fa48("49068", "49069", "49070"), reviewsRes.success && reviewsRes.data)) {
          setReviews(stryMutAct_9fa48("49074") ? reviewsRes.data && [] : stryMutAct_9fa48("49073") ? false : stryMutAct_9fa48("49072") ? true : (stryCov_9fa48("49072", "49073", "49074"), reviewsRes.data || (stryMutAct_9fa48("49075") ? ["Stryker was here"] : (stryCov_9fa48("49075"), []))));
        }
      } catch (err) {
        console.error('Failed to load ethics data:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("49079") ? true : (stryCov_9fa48("49079"), false));
      }
    };
    loadEthicsData();
  }, stryMutAct_9fa48("49080") ? ["Stryker was here"] : (stryCov_9fa48("49080"), []));
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', stryMutAct_9fa48("49083") ? {} : (stryCov_9fa48("49083"), {
      month: 'short',
      day: 'numeric'
    }));
  };
  if (stryMutAct_9fa48("49087") ? false : stryMutAct_9fa48("49086") ? true : (stryCov_9fa48("49086", "49087"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="⚖️" name="The Ethics" tagline="Built-in ethical guardrails and governance" color="#EC4899" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-3 text-neutral-500">Loading ethics data...</span>
        </div>
      </div>;
  }
  return <div className="p-6">
      <PillarHeader icon="⚖️" name="The Ethics" tagline="Built-in ethical guardrails and governance" color="#EC4899" />

      {/* Ethics Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Policy Compliance" value={(stryMutAct_9fa48("49089") ? stats?.policyCompliance && 0 : (stryCov_9fa48("49089"), (stryMutAct_9fa48("49090") ? stats.policyCompliance : (stryCov_9fa48("49090"), stats?.policyCompliance)) ?? 0)).toFixed(1)} unit="%" />
        <MetricCard label="Bias Checks" value={stryMutAct_9fa48("49091") ? stats?.biasChecks && 0 : (stryCov_9fa48("49091"), (stryMutAct_9fa48("49092") ? stats.biasChecks : (stryCov_9fa48("49092"), stats?.biasChecks)) ?? 0)} />
        <MetricCard label="Flagged Decisions" value={stryMutAct_9fa48("49093") ? stats?.flaggedDecisions && 0 : (stryCov_9fa48("49093"), (stryMutAct_9fa48("49094") ? stats.flaggedDecisions : (stryCov_9fa48("49094"), stats?.flaggedDecisions)) ?? 0)} />
        <MetricCard label="Human Overrides" value={stryMutAct_9fa48("49095") ? stats?.humanOverrides && 0 : (stryCov_9fa48("49095"), (stryMutAct_9fa48("49096") ? stats.humanOverrides : (stryCov_9fa48("49096"), stats?.humanOverrides)) ?? 0)} />
      </div>

      {/* Ethical Principles - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Ethical Principles</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(stryMutAct_9fa48("49100") ? principles.length <= 0 : stryMutAct_9fa48("49099") ? principles.length >= 0 : stryMutAct_9fa48("49098") ? false : stryMutAct_9fa48("49097") ? true : (stryCov_9fa48("49097", "49098", "49099", "49100"), principles.length > 0)) ? principles.map(stryMutAct_9fa48("49101") ? () => undefined : (stryCov_9fa48("49101"), principle => <div key={principle.id} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-neutral-900">{principle.name}</h4>
                <span className={cn('text-xs px-2 py-1 rounded-full', (stryMutAct_9fa48("49105") ? principle.status !== 'active' : stryMutAct_9fa48("49104") ? false : stryMutAct_9fa48("49103") ? true : (stryCov_9fa48("49103", "49104", "49105"), principle.status === 'active')) ? 'bg-success-light text-success-dark' : 'bg-neutral-100 text-neutral-600')}>
                  {principle.status}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mb-2">{principle.description}</p>
              <p className="text-xs text-neutral-500">{principle.checksThisWeek} checks this week</p>
            </div>)) : <p className="col-span-2 text-neutral-500 text-center py-4">No ethical principles configured</p>}
        </div>
      </div>

      {/* Recent Reviews - REAL DATA - Now clickable */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Ethics Reviews</h3>
        <div className="space-y-3">
          {(stryMutAct_9fa48("49112") ? reviews.length <= 0 : stryMutAct_9fa48("49111") ? reviews.length >= 0 : stryMutAct_9fa48("49110") ? false : stryMutAct_9fa48("49109") ? true : (stryCov_9fa48("49109", "49110", "49111", "49112"), reviews.length > 0)) ? reviews.map(stryMutAct_9fa48("49113") ? () => undefined : (stryCov_9fa48("49113"), review => <button key={review.id} onClick={stryMutAct_9fa48("49114") ? () => undefined : (stryCov_9fa48("49114"), () => setSelectedReview(review))} className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left">
              <div>
                <p className="font-medium text-neutral-900">{stryMutAct_9fa48("49117") ? review.decisionName && 'Unnamed Decision' : stryMutAct_9fa48("49116") ? false : stryMutAct_9fa48("49115") ? true : (stryCov_9fa48("49115", "49116", "49117"), review.decisionName || 'Unnamed Decision')}</p>
                <p className="text-sm text-neutral-500">Reviewed by {stryMutAct_9fa48("49121") ? review.reviewedBy && 'Ethics Engine' : stryMutAct_9fa48("49120") ? false : stryMutAct_9fa48("49119") ? true : (stryCov_9fa48("49119", "49120", "49121"), review.reviewedBy || 'Ethics Engine')}</p>
              </div>
              <div className="text-right">
                <span className={cn('text-xs px-2 py-1 rounded-full', (stryMutAct_9fa48("49126") ? review.result !== 'approved' : stryMutAct_9fa48("49125") ? false : stryMutAct_9fa48("49124") ? true : (stryCov_9fa48("49124", "49125", "49126"), review.result === 'approved')) ? 'bg-success-light text-success-dark' : (stryMutAct_9fa48("49131") ? review.result !== 'flagged' : stryMutAct_9fa48("49130") ? false : stryMutAct_9fa48("49129") ? true : (stryCov_9fa48("49129", "49130", "49131"), review.result === 'flagged')) ? 'bg-warning-light text-warning-dark' : 'bg-error-light text-error-dark')}>
                  {review.result}
                </span>
                <p className="text-xs text-neutral-500 mt-1">{formatDate(review.reviewedAt)}</p>
              </div>
            </button>)) : <p className="text-neutral-500 text-center py-4">No recent reviews</p>}
        </div>
      </div>

      {/* Review Detail Modal */}
      {stryMutAct_9fa48("49137") ? selectedReview || <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedReview(null)}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', selectedReview.result === 'approved' ? 'bg-success-light' : selectedReview.result === 'flagged' ? 'bg-warning-light' : 'bg-error-light')}>
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Ethics Review</h2>
                  <p className="text-sm text-neutral-500">{selectedReview.decisionName || 'Unnamed Decision'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', selectedReview.result === 'approved' ? 'bg-success-light text-success-dark' : selectedReview.result === 'flagged' ? 'bg-warning-light text-warning-dark' : 'bg-error-light text-error-dark')}>
                  {selectedReview.result.toUpperCase()}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatDate(selectedReview.reviewedAt)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Reviewed By:</span>
                  <span className="ml-2 font-medium text-neutral-900">{selectedReview.reviewedBy || 'Ethics Engine'}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Principle:</span>
                  <span className="ml-2 font-medium text-neutral-900">{selectedReview.principle || MOCK_REVIEW_DETAILS.default.principle}</span>
                </div>
              </div>

              {(selectedReview.biasScore !== undefined || MOCK_REVIEW_DETAILS.default.biasScore !== undefined) && <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">Bias Score</h4>
                    <span className={cn('text-sm font-medium', (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.3 ? 'text-success-dark' : (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.6 ? 'text-warning-dark' : 'text-error-dark')}>
                      {((selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.3 ? 'bg-success-main' : (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.6 ? 'bg-warning-main' : 'bg-error-main')} style={{
                width: `${(selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) * 100}%`
              }} />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Lower is better. Threshold: 30%</p>
                </div>}
              
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Review Rationale</h4>
                <p className="text-sm text-neutral-600">
                  {selectedReview.rationale || MOCK_REVIEW_DETAILS.default.rationale}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500">Decision ID:</span>
                <button onClick={() => navigate(`/cortex/intelligence/decision-dna?id=${selectedReview.decisionId || MOCK_REVIEW_DETAILS.default.decisionId}`)} className="text-primary-600 hover:underline flex items-center gap-1">
                  {selectedReview.decisionId || MOCK_REVIEW_DETAILS.default.decisionId} <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button onClick={() => {
              setSelectedReview(null);
              navigate(`/cortex/intelligence/decision-dna?id=${selectedReview.decisionId || MOCK_REVIEW_DETAILS.default.decisionId}`);
            }} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  View in Decision DNA
                </button>
                {selectedReview.result === 'rejected' && <button onClick={() => window.open('/cortex/intelligence/council?appeal=ethics', '_blank')} className="w-full px-4 py-2 bg-warning-light hover:bg-warning-main hover:text-white text-warning-dark rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    Appeal to Council
                  </button>}
                <button onClick={() => window.open('/sovereign/vox', '_blank')} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  View Stakeholder Impact in CendiaVox
                </button>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("49136") ? false : stryMutAct_9fa48("49135") ? true : (stryCov_9fa48("49135", "49136", "49137"), selectedReview && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={stryMutAct_9fa48("49138") ? () => undefined : (stryCov_9fa48("49138"), () => setSelectedReview(null))}>
          <div className="bg-white rounded-xl border border-neutral-200 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={stryMutAct_9fa48("49139") ? () => undefined : (stryCov_9fa48("49139"), e => e.stopPropagation())}>
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', (stryMutAct_9fa48("49143") ? selectedReview.result !== 'approved' : stryMutAct_9fa48("49142") ? false : stryMutAct_9fa48("49141") ? true : (stryCov_9fa48("49141", "49142", "49143"), selectedReview.result === 'approved')) ? 'bg-success-light' : (stryMutAct_9fa48("49148") ? selectedReview.result !== 'flagged' : stryMutAct_9fa48("49147") ? false : stryMutAct_9fa48("49146") ? true : (stryCov_9fa48("49146", "49147", "49148"), selectedReview.result === 'flagged')) ? 'bg-warning-light' : 'bg-error-light')}>
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Ethics Review</h2>
                  <p className="text-sm text-neutral-500">{stryMutAct_9fa48("49154") ? selectedReview.decisionName && 'Unnamed Decision' : stryMutAct_9fa48("49153") ? false : stryMutAct_9fa48("49152") ? true : (stryCov_9fa48("49152", "49153", "49154"), selectedReview.decisionName || 'Unnamed Decision')}</p>
                </div>
              </div>
              <button onClick={stryMutAct_9fa48("49156") ? () => undefined : (stryCov_9fa48("49156"), () => setSelectedReview(null))} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', (stryMutAct_9fa48("49160") ? selectedReview.result !== 'approved' : stryMutAct_9fa48("49159") ? false : stryMutAct_9fa48("49158") ? true : (stryCov_9fa48("49158", "49159", "49160"), selectedReview.result === 'approved')) ? 'bg-success-light text-success-dark' : (stryMutAct_9fa48("49165") ? selectedReview.result !== 'flagged' : stryMutAct_9fa48("49164") ? false : stryMutAct_9fa48("49163") ? true : (stryCov_9fa48("49163", "49164", "49165"), selectedReview.result === 'flagged')) ? 'bg-warning-light text-warning-dark' : 'bg-error-light text-error-dark')}>
                  {stryMutAct_9fa48("49169") ? selectedReview.result.toLowerCase() : (stryCov_9fa48("49169"), selectedReview.result.toUpperCase())}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatDate(selectedReview.reviewedAt)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Reviewed By:</span>
                  <span className="ml-2 font-medium text-neutral-900">{stryMutAct_9fa48("49172") ? selectedReview.reviewedBy && 'Ethics Engine' : stryMutAct_9fa48("49171") ? false : stryMutAct_9fa48("49170") ? true : (stryCov_9fa48("49170", "49171", "49172"), selectedReview.reviewedBy || 'Ethics Engine')}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Principle:</span>
                  <span className="ml-2 font-medium text-neutral-900">{stryMutAct_9fa48("49176") ? selectedReview.principle && MOCK_REVIEW_DETAILS.default.principle : stryMutAct_9fa48("49175") ? false : stryMutAct_9fa48("49174") ? true : (stryCov_9fa48("49174", "49175", "49176"), selectedReview.principle || MOCK_REVIEW_DETAILS.default.principle)}</span>
                </div>
              </div>

              {stryMutAct_9fa48("49179") ? selectedReview.biasScore !== undefined || MOCK_REVIEW_DETAILS.default.biasScore !== undefined || <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">Bias Score</h4>
                    <span className={cn('text-sm font-medium', (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.3 ? 'text-success-dark' : (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.6 ? 'text-warning-dark' : 'text-error-dark')}>
                      {((selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.3 ? 'bg-success-main' : (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) < 0.6 ? 'bg-warning-main' : 'bg-error-main')} style={{
                width: `${(selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) * 100}%`
              }} />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Lower is better. Threshold: 30%</p>
                </div> : stryMutAct_9fa48("49178") ? false : stryMutAct_9fa48("49177") ? true : (stryCov_9fa48("49177", "49178", "49179"), (stryMutAct_9fa48("49181") ? selectedReview.biasScore !== undefined && MOCK_REVIEW_DETAILS.default.biasScore !== undefined : stryMutAct_9fa48("49180") ? true : (stryCov_9fa48("49180", "49181"), (stryMutAct_9fa48("49183") ? selectedReview.biasScore === undefined : stryMutAct_9fa48("49182") ? false : (stryCov_9fa48("49182", "49183"), selectedReview.biasScore !== undefined)) || (stryMutAct_9fa48("49185") ? MOCK_REVIEW_DETAILS.default.biasScore === undefined : stryMutAct_9fa48("49184") ? false : (stryCov_9fa48("49184", "49185"), MOCK_REVIEW_DETAILS.default.biasScore !== undefined)))) && <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-neutral-900">Bias Score</h4>
                    <span className={cn('text-sm font-medium', (stryMutAct_9fa48("49190") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) >= 0.3 : stryMutAct_9fa48("49189") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) <= 0.3 : stryMutAct_9fa48("49188") ? false : stryMutAct_9fa48("49187") ? true : (stryCov_9fa48("49187", "49188", "49189", "49190"), (stryMutAct_9fa48("49191") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore) && 0 : (stryCov_9fa48("49191"), (stryMutAct_9fa48("49192") ? selectedReview.biasScore && MOCK_REVIEW_DETAILS.default.biasScore : (stryCov_9fa48("49192"), selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore)) ?? 0)) < 0.3)) ? 'text-success-dark' : (stryMutAct_9fa48("49197") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) >= 0.6 : stryMutAct_9fa48("49196") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) <= 0.6 : stryMutAct_9fa48("49195") ? false : stryMutAct_9fa48("49194") ? true : (stryCov_9fa48("49194", "49195", "49196", "49197"), (stryMutAct_9fa48("49198") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore) && 0 : (stryCov_9fa48("49198"), (stryMutAct_9fa48("49199") ? selectedReview.biasScore && MOCK_REVIEW_DETAILS.default.biasScore : (stryCov_9fa48("49199"), selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore)) ?? 0)) < 0.6)) ? 'text-warning-dark' : 'text-error-dark')}>
                      {(stryMutAct_9fa48("49202") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) / 100 : (stryCov_9fa48("49202"), (stryMutAct_9fa48("49203") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore) && 0 : (stryCov_9fa48("49203"), (stryMutAct_9fa48("49204") ? selectedReview.biasScore && MOCK_REVIEW_DETAILS.default.biasScore : (stryCov_9fa48("49204"), selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore)) ?? 0)) * 100)).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', (stryMutAct_9fa48("49209") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) >= 0.3 : stryMutAct_9fa48("49208") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) <= 0.3 : stryMutAct_9fa48("49207") ? false : stryMutAct_9fa48("49206") ? true : (stryCov_9fa48("49206", "49207", "49208", "49209"), (stryMutAct_9fa48("49210") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore) && 0 : (stryCov_9fa48("49210"), (stryMutAct_9fa48("49211") ? selectedReview.biasScore && MOCK_REVIEW_DETAILS.default.biasScore : (stryCov_9fa48("49211"), selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore)) ?? 0)) < 0.3)) ? 'bg-success-main' : (stryMutAct_9fa48("49216") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) >= 0.6 : stryMutAct_9fa48("49215") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) <= 0.6 : stryMutAct_9fa48("49214") ? false : stryMutAct_9fa48("49213") ? true : (stryCov_9fa48("49213", "49214", "49215", "49216"), (stryMutAct_9fa48("49217") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore) && 0 : (stryCov_9fa48("49217"), (stryMutAct_9fa48("49218") ? selectedReview.biasScore && MOCK_REVIEW_DETAILS.default.biasScore : (stryCov_9fa48("49218"), selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore)) ?? 0)) < 0.6)) ? 'bg-warning-main' : 'bg-error-main')} style={stryMutAct_9fa48("49221") ? {} : (stryCov_9fa48("49221"), {
                width: `${stryMutAct_9fa48("49223") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore ?? 0) / 100 : (stryCov_9fa48("49223"), (stryMutAct_9fa48("49224") ? (selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore) && 0 : (stryCov_9fa48("49224"), (stryMutAct_9fa48("49225") ? selectedReview.biasScore && MOCK_REVIEW_DETAILS.default.biasScore : (stryCov_9fa48("49225"), selectedReview.biasScore ?? MOCK_REVIEW_DETAILS.default.biasScore)) ?? 0)) * 100)}%`
              })} />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Lower is better. Threshold: 30%</p>
                </div>)}
              
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">Review Rationale</h4>
                <p className="text-sm text-neutral-600">
                  {stryMutAct_9fa48("49228") ? selectedReview.rationale && MOCK_REVIEW_DETAILS.default.rationale : stryMutAct_9fa48("49227") ? false : stryMutAct_9fa48("49226") ? true : (stryCov_9fa48("49226", "49227", "49228"), selectedReview.rationale || MOCK_REVIEW_DETAILS.default.rationale)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500">Decision ID:</span>
                <button onClick={stryMutAct_9fa48("49229") ? () => undefined : (stryCov_9fa48("49229"), () => navigate(`/cortex/intelligence/decision-dna?id=${stryMutAct_9fa48("49233") ? selectedReview.decisionId && MOCK_REVIEW_DETAILS.default.decisionId : stryMutAct_9fa48("49232") ? false : stryMutAct_9fa48("49231") ? true : (stryCov_9fa48("49231", "49232", "49233"), selectedReview.decisionId || MOCK_REVIEW_DETAILS.default.decisionId)}`))} className="text-primary-600 hover:underline flex items-center gap-1">
                  {stryMutAct_9fa48("49236") ? selectedReview.decisionId && MOCK_REVIEW_DETAILS.default.decisionId : stryMutAct_9fa48("49235") ? false : stryMutAct_9fa48("49234") ? true : (stryCov_9fa48("49234", "49235", "49236"), selectedReview.decisionId || MOCK_REVIEW_DETAILS.default.decisionId)} <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="pt-4 border-t border-neutral-200 space-y-3">
                <button onClick={() => {
              setSelectedReview(null);
              navigate(`/cortex/intelligence/decision-dna?id=${stryMutAct_9fa48("49241") ? selectedReview.decisionId && MOCK_REVIEW_DETAILS.default.decisionId : stryMutAct_9fa48("49240") ? false : stryMutAct_9fa48("49239") ? true : (stryCov_9fa48("49239", "49240", "49241"), selectedReview.decisionId || MOCK_REVIEW_DETAILS.default.decisionId)}`);
            }} className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  View in Decision DNA
                </button>
                {stryMutAct_9fa48("49244") ? selectedReview.result === 'rejected' || <button onClick={() => window.open('/cortex/intelligence/council?appeal=ethics', '_blank')} className="w-full px-4 py-2 bg-warning-light hover:bg-warning-main hover:text-white text-warning-dark rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    Appeal to Council
                  </button> : stryMutAct_9fa48("49243") ? false : stryMutAct_9fa48("49242") ? true : (stryCov_9fa48("49242", "49243", "49244"), (stryMutAct_9fa48("49246") ? selectedReview.result !== 'rejected' : stryMutAct_9fa48("49245") ? true : (stryCov_9fa48("49245", "49246"), selectedReview.result === 'rejected')) && <button onClick={stryMutAct_9fa48("49248") ? () => undefined : (stryCov_9fa48("49248"), () => window.open('/cortex/intelligence/council?appeal=ethics', '_blank'))} className="w-full px-4 py-2 bg-warning-light hover:bg-warning-main hover:text-white text-warning-dark rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    Appeal to Council
                  </button>)}
                <button onClick={stryMutAct_9fa48("49251") ? () => undefined : (stryCov_9fa48("49251"), () => window.open('/sovereign/vox', '_blank'))} className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                  View Stakeholder Impact in CendiaVox
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// THE AGENTS - AI Advisors
// =============================================================================

interface AgentStats {
  activeAgents: number;
  queriesToday: number;
  avgResponseTime: number;
  satisfaction: number;
}
interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  status: 'online' | 'busy' | 'offline';
  queriesToday: number;
}
export const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>(stryMutAct_9fa48("49255") ? ["Stryker was here"] : (stryCov_9fa48("49255"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("49256") ? false : (stryCov_9fa48("49256"), true));
  useEffect(() => {
    const loadAgentsData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("49260") ? false : (stryCov_9fa48("49260"), true));
        const [statsRes, agentsRes] = await Promise.all(stryMutAct_9fa48("49261") ? [] : (stryCov_9fa48("49261"), [api.get<AgentStats>('/pillars/agents/stats', stryMutAct_9fa48("49263") ? {} : (stryCov_9fa48("49263"), {
          organizationId: 'demo'
        })), api.get<Agent[]>('/pillars/agents', stryMutAct_9fa48("49266") ? {} : (stryCov_9fa48("49266"), {
          organizationId: 'demo'
        }))]));
        if (stryMutAct_9fa48("49270") ? statsRes.success || statsRes.data : stryMutAct_9fa48("49269") ? false : stryMutAct_9fa48("49268") ? true : (stryCov_9fa48("49268", "49269", "49270"), statsRes.success && statsRes.data)) {
          setStats(statsRes.data);
        }
        if (stryMutAct_9fa48("49274") ? agentsRes.success || agentsRes.data : stryMutAct_9fa48("49273") ? false : stryMutAct_9fa48("49272") ? true : (stryCov_9fa48("49272", "49273", "49274"), agentsRes.success && agentsRes.data)) {
          setAgents(stryMutAct_9fa48("49278") ? agentsRes.data && [] : stryMutAct_9fa48("49277") ? false : stryMutAct_9fa48("49276") ? true : (stryCov_9fa48("49276", "49277", "49278"), agentsRes.data || (stryMutAct_9fa48("49279") ? ["Stryker was here"] : (stryCov_9fa48("49279"), []))));
        }
      } catch (err) {
        console.error('Failed to load agents data:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("49283") ? true : (stryCov_9fa48("49283"), false));
      }
    };
    loadAgentsData();
  }, stryMutAct_9fa48("49284") ? ["Stryker was here"] : (stryCov_9fa48("49284"), []));
  const getAgentIcon = (code: string): string => {
    const icons: Record<string, string> = stryMutAct_9fa48("49286") ? {} : (stryCov_9fa48("49286"), {
      'chief': '👔',
      'cfo': '💰',
      'coo': '⚙️',
      'ciso': '🔒',
      'cto': '💻',
      'cmo': '📢',
      'cro': '📈',
      'cdo': '📊',
      'risk': '⚠️',
      'clo': '⚖️',
      'chro': '👥',
      'cso': '🌍',
      'cco': '📰',
      'caio': '🤖'
    });
    return stryMutAct_9fa48("49303") ? icons[code.toLowerCase()] && '🤖' : stryMutAct_9fa48("49302") ? false : stryMutAct_9fa48("49301") ? true : (stryCov_9fa48("49301", "49302", "49303"), icons[stryMutAct_9fa48("49304") ? code.toUpperCase() : (stryCov_9fa48("49304"), code.toLowerCase())] || '🤖');
  };
  if (stryMutAct_9fa48("49307") ? false : stryMutAct_9fa48("49306") ? true : (stryCov_9fa48("49306", "49307"), isLoading)) {
    return <div className="p-6">
        <PillarHeader icon="🤖" name="The Agents" tagline="AI advisors for every domain - The Pantheon" color="#6366F1" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-neutral-500">Loading agents data...</span>
        </div>
      </div>;
  }
  return <div className="p-6">
      <PillarHeader icon="🤖" name="The Agents" tagline="AI advisors for every domain - The Pantheon" color="#6366F1" />

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Agents" value={stryMutAct_9fa48("49309") ? stats?.activeAgents && agents.filter(a => a.status === 'online').length : (stryCov_9fa48("49309"), (stryMutAct_9fa48("49310") ? stats.activeAgents : (stryCov_9fa48("49310"), stats?.activeAgents)) ?? (stryMutAct_9fa48("49311") ? agents.length : (stryCov_9fa48("49311"), agents.filter(stryMutAct_9fa48("49312") ? () => undefined : (stryCov_9fa48("49312"), a => stryMutAct_9fa48("49315") ? a.status !== 'online' : stryMutAct_9fa48("49314") ? false : stryMutAct_9fa48("49313") ? true : (stryCov_9fa48("49313", "49314", "49315"), a.status === 'online'))).length)))} />
        <MetricCard label="Queries Today" value={stryMutAct_9fa48("49317") ? stats?.queriesToday && agents.reduce((sum, a) => sum + a.queriesToday, 0) : (stryCov_9fa48("49317"), (stryMutAct_9fa48("49318") ? stats.queriesToday : (stryCov_9fa48("49318"), stats?.queriesToday)) ?? agents.reduce(stryMutAct_9fa48("49319") ? () => undefined : (stryCov_9fa48("49319"), (sum, a) => stryMutAct_9fa48("49320") ? sum - a.queriesToday : (stryCov_9fa48("49320"), sum + a.queriesToday)), 0))} />
        <MetricCard label="Avg Response" value={(stryMutAct_9fa48("49321") ? stats?.avgResponseTime && 0 : (stryCov_9fa48("49321"), (stryMutAct_9fa48("49322") ? stats.avgResponseTime : (stryCov_9fa48("49322"), stats?.avgResponseTime)) ?? 0)).toFixed(1)} unit="s" />
        <MetricCard label="Satisfaction" value={(stryMutAct_9fa48("49323") ? stats?.satisfaction && 0 : (stryCov_9fa48("49323"), (stryMutAct_9fa48("49324") ? stats.satisfaction : (stryCov_9fa48("49324"), stats?.satisfaction)) ?? 0)).toFixed(1)} unit="/5" />
      </div>

      {/* Agent Grid - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(stryMutAct_9fa48("49328") ? agents.length <= 0 : stryMutAct_9fa48("49327") ? agents.length >= 0 : stryMutAct_9fa48("49326") ? false : stryMutAct_9fa48("49325") ? true : (stryCov_9fa48("49325", "49326", "49327", "49328"), agents.length > 0)) ? agents.map(stryMutAct_9fa48("49329") ? () => undefined : (stryCov_9fa48("49329"), agent => <div key={agent.id} onClick={stryMutAct_9fa48("49330") ? () => undefined : (stryCov_9fa48("49330"), () => navigate(`/cortex/council?agent=${agent.code}`))} className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{stryMutAct_9fa48("49334") ? agent.icon && getAgentIcon(agent.code) : stryMutAct_9fa48("49333") ? false : stryMutAct_9fa48("49332") ? true : (stryCov_9fa48("49332", "49333", "49334"), agent.icon || getAgentIcon(agent.code))}</span>
              <span className={cn('w-2 h-2 rounded-full', stryMutAct_9fa48("49338") ? agent.status === 'online' || 'bg-success-main' : stryMutAct_9fa48("49337") ? false : stryMutAct_9fa48("49336") ? true : (stryCov_9fa48("49336", "49337", "49338"), (stryMutAct_9fa48("49340") ? agent.status !== 'online' : stryMutAct_9fa48("49339") ? true : (stryCov_9fa48("49339", "49340"), agent.status === 'online')) && 'bg-success-main'), stryMutAct_9fa48("49345") ? agent.status === 'busy' || 'bg-warning-main' : stryMutAct_9fa48("49344") ? false : stryMutAct_9fa48("49343") ? true : (stryCov_9fa48("49343", "49344", "49345"), (stryMutAct_9fa48("49347") ? agent.status !== 'busy' : stryMutAct_9fa48("49346") ? true : (stryCov_9fa48("49346", "49347"), agent.status === 'busy')) && 'bg-warning-main'), stryMutAct_9fa48("49352") ? agent.status === 'offline' || 'bg-neutral-300' : stryMutAct_9fa48("49351") ? false : stryMutAct_9fa48("49350") ? true : (stryCov_9fa48("49350", "49351", "49352"), (stryMutAct_9fa48("49354") ? agent.status !== 'offline' : stryMutAct_9fa48("49353") ? true : (stryCov_9fa48("49353", "49354"), agent.status === 'offline')) && 'bg-neutral-300'))} />
            </div>
            <h4 className="font-semibold text-neutral-900">{agent.name}</h4>
            <p className="text-sm text-neutral-500">{agent.role}</p>
            <p className="text-xs text-neutral-400 mt-2">{agent.queriesToday} queries today</p>
          </div>)) : <p className="col-span-4 text-neutral-500 text-center py-8">No agents configured</p>}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={stryMutAct_9fa48("49357") ? () => undefined : (stryCov_9fa48("49357"), () => navigate('/cortex/council'))} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Ask The Council
          </button>
          <button onClick={stryMutAct_9fa48("49359") ? () => undefined : (stryCov_9fa48("49359"), () => navigate('/cortex/council?mode=deliberation'))} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
            Start Deliberation
          </button>
          <button onClick={stryMutAct_9fa48("49361") ? () => undefined : (stryCov_9fa48("49361"), () => navigate('/cortex/council?tab=history'))} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
            View Decision History
          </button>
        </div>
      </div>
    </div>;
};
export default HelmPage;