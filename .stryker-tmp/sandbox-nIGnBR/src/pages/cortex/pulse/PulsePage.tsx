// @ts-nocheck
// =============================================================================
// DATACENDIA - THE PULSE PAGE (Enhanced)
// Real-time organizational health monitoring with activity feed & system status
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
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { healthApi, alertsApi } from '../../../lib/api';
import { useLanguage } from '../../../contexts/LanguageContext';
import { sovereignApi } from '../../../lib/sovereignApi';

// =============================================================================
// TYPES
// =============================================================================

interface Anomaly {
  id: string;
  type: 'detected' | 'resolved' | 'investigating';
  title: string;
  source: string;
  timestamp: Date;
}
interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  uptime: number;
}
interface ActivityEvent {
  id: string;
  type: 'alert' | 'change' | 'deployment' | 'metric';
  message: string;
  source: string;
  timestamp: Date;
}
interface HealthDimension {
  id: string;
  name: string;
  score: number;
  trend: number;
  icon: string;
  color: string;
}

// =============================================================================
// SPARKLINE COMPONENT
// =============================================================================

const Sparkline: React.FC<{
  data: number[];
  color: string;
  height?: number;
}> = ({
  data,
  color,
  height = 32
}) => {
  const max = stryMutAct_9fa48("49364") ? Math.min(...data) : (stryCov_9fa48("49364"), Math.max(...data));
  const min = stryMutAct_9fa48("49365") ? Math.max(...data) : (stryCov_9fa48("49365"), Math.min(...data));
  const range = stryMutAct_9fa48("49368") ? max - min && 1 : stryMutAct_9fa48("49367") ? false : stryMutAct_9fa48("49366") ? true : (stryCov_9fa48("49366", "49367", "49368"), (stryMutAct_9fa48("49369") ? max + min : (stryCov_9fa48("49369"), max - min)) || 1);
  const points = data.map((value, i) => {
    const x = stryMutAct_9fa48("49371") ? i / (data.length - 1) / 100 : (stryCov_9fa48("49371"), (stryMutAct_9fa48("49372") ? i * (data.length - 1) : (stryCov_9fa48("49372"), i / (stryMutAct_9fa48("49373") ? data.length + 1 : (stryCov_9fa48("49373"), data.length - 1)))) * 100);
    const y = stryMutAct_9fa48("49374") ? height + (value - min) / range * height : (stryCov_9fa48("49374"), height - (stryMutAct_9fa48("49375") ? (value - min) / range / height : (stryCov_9fa48("49375"), (stryMutAct_9fa48("49376") ? (value - min) * range : (stryCov_9fa48("49376"), (stryMutAct_9fa48("49377") ? value + min : (stryCov_9fa48("49377"), value - min)) / range)) * height)));
    return `${x},${y}`;
  }).join(' ');
  return <svg className="w-full" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
};

// =============================================================================
// HEALTH BAR CHART COMPONENT
// =============================================================================

const HealthBarChart: React.FC<{
  data: number[];
}> = ({
  data
}) => {
  const maxValue = stryMutAct_9fa48("49382") ? Math.min(...data, 100) : (stryCov_9fa48("49382"), Math.max(...data, 100));
  return <div className="flex items-end gap-1 h-32">
      {data.map(stryMutAct_9fa48("49383") ? () => undefined : (stryCov_9fa48("49383"), (value, index) => <div key={index} className="flex-1 bg-neutral-600 rounded-t transition-all hover:bg-neutral-500" style={stryMutAct_9fa48("49384") ? {} : (stryCov_9fa48("49384"), {
      height: `${stryMutAct_9fa48("49386") ? value / maxValue / 100 : (stryCov_9fa48("49386"), (stryMutAct_9fa48("49387") ? value * maxValue : (stryCov_9fa48("49387"), value / maxValue)) * 100)}%`
    })} />))}
    </div>;
};

// =============================================================================
// METRIC BAR COMPONENT
// =============================================================================

const MetricBar: React.FC<{
  label: string;
  value: string;
  percentage: number;
  color: string;
  sparklineData?: number[];
}> = stryMutAct_9fa48("49388") ? () => undefined : (stryCov_9fa48("49388"), (() => {
  const MetricBar: React.FC<{
    label: string;
    value: string;
    percentage: number;
    color: string;
    sparklineData?: number[];
  }> = ({
    label,
    value,
    percentage,
    color,
    sparklineData
  }) => <div className="bg-neutral-800/50 rounded-lg p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">{label}</p>
    <div className="flex items-end justify-between mb-3">
      <p className="text-2xl font-bold text-white">{value}</p>
      {stryMutAct_9fa48("49391") ? sparklineData || <div className="w-16 h-6">
          <Sparkline data={sparklineData} color={color} height={24} />
        </div> : stryMutAct_9fa48("49390") ? false : stryMutAct_9fa48("49389") ? true : (stryCov_9fa48("49389", "49390", "49391"), sparklineData && <div className="w-16 h-6">
          <Sparkline data={sparklineData} color={color} height={24} />
        </div>)}
    </div>
    <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={stryMutAct_9fa48("49392") ? {} : (stryCov_9fa48("49392"), {
        width: `${percentage}%`,
        backgroundColor: color
      })} />
    </div>
  </div>;
  return MetricBar;
})());

// =============================================================================
// SYSTEM STATUS COMPONENT
// =============================================================================

const SystemStatusGrid: React.FC<{
  systems: SystemStatus[];
}> = stryMutAct_9fa48("49394") ? () => undefined : (stryCov_9fa48("49394"), (() => {
  const SystemStatusGrid: React.FC<{
    systems: SystemStatus[];
  }> = ({
    systems
  }) => <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">System Status</p>
    <div className="grid grid-cols-2 gap-3">
      {systems.map(stryMutAct_9fa48("49395") ? () => undefined : (stryCov_9fa48("49395"), system => <div key={system.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', stryMutAct_9fa48("49399") ? system.status === 'online' || 'bg-green-500' : stryMutAct_9fa48("49398") ? false : stryMutAct_9fa48("49397") ? true : (stryCov_9fa48("49397", "49398", "49399"), (stryMutAct_9fa48("49401") ? system.status !== 'online' : stryMutAct_9fa48("49400") ? true : (stryCov_9fa48("49400", "49401"), system.status === 'online')) && 'bg-green-500'), stryMutAct_9fa48("49406") ? system.status === 'degraded' || 'bg-yellow-500' : stryMutAct_9fa48("49405") ? false : stryMutAct_9fa48("49404") ? true : (stryCov_9fa48("49404", "49405", "49406"), (stryMutAct_9fa48("49408") ? system.status !== 'degraded' : stryMutAct_9fa48("49407") ? true : (stryCov_9fa48("49407", "49408"), system.status === 'degraded')) && 'bg-yellow-500'), stryMutAct_9fa48("49413") ? system.status === 'offline' || 'bg-red-500' : stryMutAct_9fa48("49412") ? false : stryMutAct_9fa48("49411") ? true : (stryCov_9fa48("49411", "49412", "49413"), (stryMutAct_9fa48("49415") ? system.status !== 'offline' : stryMutAct_9fa48("49414") ? true : (stryCov_9fa48("49414", "49415"), system.status === 'offline')) && 'bg-red-500'))} />
            <span className="text-sm text-neutral-300">{system.name}</span>
          </div>
          <span className="text-xs text-neutral-500">{system.latency}ms</span>
        </div>))}
    </div>
  </div>;
  return SystemStatusGrid;
})());

// =============================================================================
// ACTIVITY FEED COMPONENT
// =============================================================================

const ActivityFeed: React.FC<{
  events: ActivityEvent[];
}> = ({
  events
}) => {
  const typeConfig = stryMutAct_9fa48("49419") ? {} : (stryCov_9fa48("49419"), {
    alert: stryMutAct_9fa48("49420") ? {} : (stryCov_9fa48("49420"), {
      icon: '⚠️',
      color: 'text-red-400'
    }),
    change: stryMutAct_9fa48("49423") ? {} : (stryCov_9fa48("49423"), {
      icon: '📝',
      color: 'text-blue-400'
    }),
    deployment: stryMutAct_9fa48("49426") ? {} : (stryCov_9fa48("49426"), {
      icon: '🚀',
      color: 'text-green-400'
    }),
    metric: stryMutAct_9fa48("49429") ? {} : (stryCov_9fa48("49429"), {
      icon: '📊',
      color: 'text-purple-400'
    })
  });
  return <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
      <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Live Activity</p>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {events.map(event => {
        const config = typeConfig[event.type];
        return <div key={event.id} className="flex items-start gap-3">
              <span className={cn('text-sm', config.color)}>{config.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-300 truncate">{event.message}</p>
                <p className="text-xs text-neutral-500">{event.source} • just now</p>
              </div>
            </div>;
      })}
      </div>
    </div>;
};

// =============================================================================
// HEALTH DIMENSION CARD
// =============================================================================

const HealthDimensionCard: React.FC<{
  dimension: HealthDimension;
}> = stryMutAct_9fa48("49434") ? () => undefined : (stryCov_9fa48("49434"), (() => {
  const HealthDimensionCard: React.FC<{
    dimension: HealthDimension;
  }> = ({
    dimension
  }) => <div className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/50">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-lg">{dimension.icon}</span>
        <span className="text-sm text-neutral-300">{dimension.name}</span>
      </div>
      <span className={cn('text-xs font-medium', (stryMutAct_9fa48("49439") ? dimension.trend <= 0 : stryMutAct_9fa48("49438") ? dimension.trend >= 0 : stryMutAct_9fa48("49437") ? false : stryMutAct_9fa48("49436") ? true : (stryCov_9fa48("49436", "49437", "49438", "49439"), dimension.trend > 0)) ? 'text-green-400' : (stryMutAct_9fa48("49444") ? dimension.trend >= 0 : stryMutAct_9fa48("49443") ? dimension.trend <= 0 : stryMutAct_9fa48("49442") ? false : stryMutAct_9fa48("49441") ? true : (stryCov_9fa48("49441", "49442", "49443", "49444"), dimension.trend < 0)) ? 'text-red-400' : 'text-neutral-400')}>
        {(stryMutAct_9fa48("49450") ? dimension.trend <= 0 : stryMutAct_9fa48("49449") ? dimension.trend >= 0 : stryMutAct_9fa48("49448") ? false : stryMutAct_9fa48("49447") ? true : (stryCov_9fa48("49447", "49448", "49449", "49450"), dimension.trend > 0)) ? '+' : ''}{dimension.trend}%
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={stryMutAct_9fa48("49453") ? {} : (stryCov_9fa48("49453"), {
          width: `${dimension.score}%`,
          backgroundColor: dimension.color
        })} />
      </div>
      <span className="text-sm font-medium text-white">{dimension.score}</span>
    </div>
  </div>;
  return HealthDimensionCard;
})());

// =============================================================================
// ANOMALY CARD COMPONENT
// =============================================================================

const AnomalyCard: React.FC<{
  anomaly: Anomaly;
  onAcknowledge?: () => void;
  onResolve?: () => void;
}> = ({
  anomaly,
  onAcknowledge,
  onResolve
}) => {
  const typeConfig = stryMutAct_9fa48("49456") ? {} : (stryCov_9fa48("49456"), {
    detected: stryMutAct_9fa48("49457") ? {} : (stryCov_9fa48("49457"), {
      icon: '⚡',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30'
    }),
    investigating: stryMutAct_9fa48("49462") ? {} : (stryCov_9fa48("49462"), {
      icon: '🔍',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30'
    }),
    resolved: stryMutAct_9fa48("49467") ? {} : (stryCov_9fa48("49467"), {
      icon: '✓',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    })
  });
  const config = typeConfig[anomaly.type];
  return <div className={cn('rounded-lg p-4 border', config.bg, config.border)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className={cn('text-xl', config.color)}>{config.icon}</span>
          <div>
            <p className={cn('text-xs font-semibold uppercase tracking-wider mb-1', config.color)}>
              {(stryMutAct_9fa48("49477") ? anomaly.type !== 'detected' : stryMutAct_9fa48("49476") ? false : stryMutAct_9fa48("49475") ? true : (stryCov_9fa48("49475", "49476", "49477"), anomaly.type === 'detected')) ? 'ANOMALY DETECTED' : (stryMutAct_9fa48("49482") ? anomaly.type !== 'investigating' : stryMutAct_9fa48("49481") ? false : stryMutAct_9fa48("49480") ? true : (stryCov_9fa48("49480", "49481", "49482"), anomaly.type === 'investigating')) ? 'INVESTIGATING' : 'RESOLVED'}
            </p>
            <p className="text-white text-sm">{anomaly.title}</p>
            <p className="text-xs text-neutral-500 mt-1">{anomaly.source}</p>
          </div>
        </div>
        {stryMutAct_9fa48("49488") ? anomaly.type !== 'resolved' || <div className="flex gap-2">
            {anomaly.type === 'detected' && onAcknowledge && <button onClick={onAcknowledge} className="px-3 py-1 text-xs bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition-colors">
                Acknowledge
              </button>}
            {onResolve && <button onClick={onResolve} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Resolve
              </button>}
          </div> : stryMutAct_9fa48("49487") ? false : stryMutAct_9fa48("49486") ? true : (stryCov_9fa48("49486", "49487", "49488"), (stryMutAct_9fa48("49490") ? anomaly.type === 'resolved' : stryMutAct_9fa48("49489") ? true : (stryCov_9fa48("49489", "49490"), anomaly.type !== 'resolved')) && <div className="flex gap-2">
            {stryMutAct_9fa48("49494") ? anomaly.type === 'detected' && onAcknowledge || <button onClick={onAcknowledge} className="px-3 py-1 text-xs bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition-colors">
                Acknowledge
              </button> : stryMutAct_9fa48("49493") ? false : stryMutAct_9fa48("49492") ? true : (stryCov_9fa48("49492", "49493", "49494"), (stryMutAct_9fa48("49496") ? anomaly.type === 'detected' || onAcknowledge : stryMutAct_9fa48("49495") ? true : (stryCov_9fa48("49495", "49496"), (stryMutAct_9fa48("49498") ? anomaly.type !== 'detected' : stryMutAct_9fa48("49497") ? true : (stryCov_9fa48("49497", "49498"), anomaly.type === 'detected')) && onAcknowledge)) && <button onClick={onAcknowledge} className="px-3 py-1 text-xs bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition-colors">
                Acknowledge
              </button>)}
            {stryMutAct_9fa48("49502") ? onResolve || <button onClick={onResolve} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Resolve
              </button> : stryMutAct_9fa48("49501") ? false : stryMutAct_9fa48("49500") ? true : (stryCov_9fa48("49500", "49501", "49502"), onResolve && <button onClick={onResolve} className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Resolve
              </button>)}
          </div>)}
      </div>
    </div>;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PulsePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();

  // State
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [weeklyChange, setWeeklyChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("49504") ? false : (stryCov_9fa48("49504"), true));
  const [error, setError] = useState<string | null>(null);

  // Health trend data (last 14 days)
  const [healthTrend, setHealthTrend] = useState<number[]>(stryMutAct_9fa48("49505") ? ["Stryker was here"] : (stryCov_9fa48("49505"), []));

  // Sparkline data for metrics
  const [latencyHistory, setLatencyHistory] = useState<number[]>(stryMutAct_9fa48("49506") ? ["Stryker was here"] : (stryCov_9fa48("49506"), []));
  const [freshnessHistory, setFreshnessHistory] = useState<number[]>(stryMutAct_9fa48("49507") ? ["Stryker was here"] : (stryCov_9fa48("49507"), []));
  const [apiLatency, setApiLatency] = useState<number>(0);
  const [dataFreshness, setDataFreshness] = useState<number>(0);

  // System status - fetched from API
  const [systems, setSystems] = useState<SystemStatus[]>(stryMutAct_9fa48("49508") ? ["Stryker was here"] : (stryCov_9fa48("49508"), []));

  // Activity events - fetched from alerts API
  const [events, setEvents] = useState<ActivityEvent[]>(stryMutAct_9fa48("49509") ? ["Stryker was here"] : (stryCov_9fa48("49509"), []));

  // Health dimensions - fetched from API
  const [dimensions, setDimensions] = useState<HealthDimension[]>(stryMutAct_9fa48("49510") ? ["Stryker was here"] : (stryCov_9fa48("49510"), []));

  // Anomalies - fetched from alerts API
  const [anomalies, setAnomalies] = useState<Anomaly[]>(stryMutAct_9fa48("49511") ? ["Stryker was here"] : (stryCov_9fa48("49511"), []));

  // Load health score and dimensions
  const loadHealthData = useCallback(async () => {
    try {
      const [scoreRes, dimensionsRes, trendRes, systemsRes] = await Promise.all(stryMutAct_9fa48("49514") ? [] : (stryCov_9fa48("49514"), [healthApi.getScore(), healthApi.getDimensions(), healthApi.getTrend(14), healthApi.getSystemStatus()]));
      if (stryMutAct_9fa48("49517") ? scoreRes.success || scoreRes.data : stryMutAct_9fa48("49516") ? false : stryMutAct_9fa48("49515") ? true : (stryCov_9fa48("49515", "49516", "49517"), scoreRes.success && scoreRes.data)) {
        setHealthScore(scoreRes.data.overall);
        // Calculate weekly change from trend
        if (stryMutAct_9fa48("49521") ? trendRes.success && trendRes.data || trendRes.data.length >= 7 : stryMutAct_9fa48("49520") ? false : stryMutAct_9fa48("49519") ? true : (stryCov_9fa48("49519", "49520", "49521"), (stryMutAct_9fa48("49523") ? trendRes.success || trendRes.data : stryMutAct_9fa48("49522") ? true : (stryCov_9fa48("49522", "49523"), trendRes.success && trendRes.data)) && (stryMutAct_9fa48("49526") ? trendRes.data.length < 7 : stryMutAct_9fa48("49525") ? trendRes.data.length > 7 : stryMutAct_9fa48("49524") ? true : (stryCov_9fa48("49524", "49525", "49526"), trendRes.data.length >= 7)))) {
          const oldScore = stryMutAct_9fa48("49530") ? trendRes.data[0]?.score && scoreRes.data.overall : stryMutAct_9fa48("49529") ? false : stryMutAct_9fa48("49528") ? true : (stryCov_9fa48("49528", "49529", "49530"), (stryMutAct_9fa48("49531") ? trendRes.data[0].score : (stryCov_9fa48("49531"), trendRes.data[0]?.score)) || scoreRes.data.overall);
          const change = stryMutAct_9fa48("49532") ? (scoreRes.data.overall - oldScore) / oldScore / 100 : (stryCov_9fa48("49532"), (stryMutAct_9fa48("49533") ? (scoreRes.data.overall - oldScore) * oldScore : (stryCov_9fa48("49533"), (stryMutAct_9fa48("49534") ? scoreRes.data.overall + oldScore : (stryCov_9fa48("49534"), scoreRes.data.overall - oldScore)) / oldScore)) * 100);
          setWeeklyChange(change);
        }
      }
      if (stryMutAct_9fa48("49537") ? dimensionsRes.success || dimensionsRes.data : stryMutAct_9fa48("49536") ? false : stryMutAct_9fa48("49535") ? true : (stryCov_9fa48("49535", "49536", "49537"), dimensionsRes.success && dimensionsRes.data)) {
        const dims = dimensionsRes.data;
        setDimensions(stryMutAct_9fa48("49539") ? [] : (stryCov_9fa48("49539"), [stryMutAct_9fa48("49540") ? {} : (stryCov_9fa48("49540"), {
          id: '1',
          name: 'Data Quality',
          score: stryMutAct_9fa48("49545") ? dims.data?.score && 0 : stryMutAct_9fa48("49544") ? false : stryMutAct_9fa48("49543") ? true : (stryCov_9fa48("49543", "49544", "49545"), (stryMutAct_9fa48("49546") ? dims.data.score : (stryCov_9fa48("49546"), dims.data?.score)) || 0),
          trend: stryMutAct_9fa48("49549") ? dims.data?.change && 0 : stryMutAct_9fa48("49548") ? false : stryMutAct_9fa48("49547") ? true : (stryCov_9fa48("49547", "49548", "49549"), (stryMutAct_9fa48("49550") ? dims.data.change : (stryCov_9fa48("49550"), dims.data?.change)) || 0),
          icon: '📊',
          color: '#3B82F6'
        }), stryMutAct_9fa48("49553") ? {} : (stryCov_9fa48("49553"), {
          id: '2',
          name: 'Operations',
          score: stryMutAct_9fa48("49558") ? dims.operations?.score && 0 : stryMutAct_9fa48("49557") ? false : stryMutAct_9fa48("49556") ? true : (stryCov_9fa48("49556", "49557", "49558"), (stryMutAct_9fa48("49559") ? dims.operations.score : (stryCov_9fa48("49559"), dims.operations?.score)) || 0),
          trend: stryMutAct_9fa48("49562") ? dims.operations?.change && 0 : stryMutAct_9fa48("49561") ? false : stryMutAct_9fa48("49560") ? true : (stryCov_9fa48("49560", "49561", "49562"), (stryMutAct_9fa48("49563") ? dims.operations.change : (stryCov_9fa48("49563"), dims.operations?.change)) || 0),
          icon: '⚙️',
          color: '#F59E0B'
        }), stryMutAct_9fa48("49566") ? {} : (stryCov_9fa48("49566"), {
          id: '3',
          name: 'Security',
          score: stryMutAct_9fa48("49571") ? dims.security?.score && 0 : stryMutAct_9fa48("49570") ? false : stryMutAct_9fa48("49569") ? true : (stryCov_9fa48("49569", "49570", "49571"), (stryMutAct_9fa48("49572") ? dims.security.score : (stryCov_9fa48("49572"), dims.security?.score)) || 0),
          trend: stryMutAct_9fa48("49575") ? dims.security?.change && 0 : stryMutAct_9fa48("49574") ? false : stryMutAct_9fa48("49573") ? true : (stryCov_9fa48("49573", "49574", "49575"), (stryMutAct_9fa48("49576") ? dims.security.change : (stryCov_9fa48("49576"), dims.security?.change)) || 0),
          icon: '🔒',
          color: '#10B981'
        }), stryMutAct_9fa48("49579") ? {} : (stryCov_9fa48("49579"), {
          id: '4',
          name: 'People',
          score: stryMutAct_9fa48("49584") ? dims.people?.score && 0 : stryMutAct_9fa48("49583") ? false : stryMutAct_9fa48("49582") ? true : (stryCov_9fa48("49582", "49583", "49584"), (stryMutAct_9fa48("49585") ? dims.people.score : (stryCov_9fa48("49585"), dims.people?.score)) || 0),
          trend: stryMutAct_9fa48("49588") ? dims.people?.change && 0 : stryMutAct_9fa48("49587") ? false : stryMutAct_9fa48("49586") ? true : (stryCov_9fa48("49586", "49587", "49588"), (stryMutAct_9fa48("49589") ? dims.people.change : (stryCov_9fa48("49589"), dims.people?.change)) || 0),
          icon: '👥',
          color: '#8B5CF6'
        })]));
      }
      if (stryMutAct_9fa48("49594") ? trendRes.success || trendRes.data : stryMutAct_9fa48("49593") ? false : stryMutAct_9fa48("49592") ? true : (stryCov_9fa48("49592", "49593", "49594"), trendRes.success && trendRes.data)) {
        // Handle both array format and object with scores property
        const scores = Array.isArray(trendRes.data) ? trendRes.data : stryMutAct_9fa48("49598") ? (trendRes.data as any).scores && [] : stryMutAct_9fa48("49597") ? false : stryMutAct_9fa48("49596") ? true : (stryCov_9fa48("49596", "49597", "49598"), (trendRes.data as any).scores || (stryMutAct_9fa48("49599") ? ["Stryker was here"] : (stryCov_9fa48("49599"), [])));
        setHealthTrend(scores.map(stryMutAct_9fa48("49600") ? () => undefined : (stryCov_9fa48("49600"), (t: any) => stryMutAct_9fa48("49603") ? t.score && t.overall : stryMutAct_9fa48("49602") ? false : stryMutAct_9fa48("49601") ? true : (stryCov_9fa48("49601", "49602", "49603"), t.score || t.overall))));
      }
      if (stryMutAct_9fa48("49606") ? systemsRes.success || systemsRes.data : stryMutAct_9fa48("49605") ? false : stryMutAct_9fa48("49604") ? true : (stryCov_9fa48("49604", "49605", "49606"), systemsRes.success && systemsRes.data)) {
        const systemsData = systemsRes.data as Array<{
          name: string;
          status: string;
          latency: string | null;
        }>;
        setSystems(systemsData.map((s, i) => {
          const latencyValue = s.latency ? parseInt(String(s.latency).replace('ms', ''), 10) : 0;
          return stryMutAct_9fa48("49611") ? {} : (stryCov_9fa48("49611"), {
            id: String(stryMutAct_9fa48("49612") ? i - 1 : (stryCov_9fa48("49612"), i + 1)),
            name: s.name,
            status: s.status as 'online' | 'degraded' | 'offline',
            latency: latencyValue,
            uptime: 99.9 // Will be enhanced when uptime endpoint is added
          });
        }));

        // Calculate average latency for display
        const avgLatency = stryMutAct_9fa48("49613") ? systemsData.reduce((acc, s) => {
          const latencyValue = s.latency ? parseInt(String(s.latency).replace('ms', ''), 10) : 0;
          return acc + latencyValue;
        }, 0) * systemsData.length : (stryCov_9fa48("49613"), systemsData.reduce((acc, s) => {
          const latencyValue = s.latency ? parseInt(String(s.latency).replace('ms', ''), 10) : 0;
          return stryMutAct_9fa48("49617") ? acc - latencyValue : (stryCov_9fa48("49617"), acc + latencyValue);
        }, 0) / systemsData.length);
        setApiLatency(avgLatency);
        setLatencyHistory(stryMutAct_9fa48("49618") ? () => undefined : (stryCov_9fa48("49618"), prev => stryMutAct_9fa48("49619") ? [] : (stryCov_9fa48("49619"), [...(stryMutAct_9fa48("49620") ? prev : (stryCov_9fa48("49620"), prev.slice(stryMutAct_9fa48("49621") ? +9 : (stryCov_9fa48("49621"), -9)))), avgLatency])));
      }
      // Also fetch real metrics from Prometheus (sovereign stack)
      try {
        const now = new Date();
        const oneHourAgo = new Date(stryMutAct_9fa48("49623") ? now.getTime() + 60 * 60 * 1000 : (stryCov_9fa48("49623"), now.getTime() - (stryMutAct_9fa48("49624") ? 60 * 60 / 1000 : (stryCov_9fa48("49624"), (stryMutAct_9fa48("49625") ? 60 / 60 : (stryCov_9fa48("49625"), 60 * 60)) * 1000))));

        // Fetch CPU usage from Prometheus
        const cpuMetrics = await sovereignApi.metrics.queryRange('avg(rate(process_cpu_seconds_total[5m])) * 100', oneHourAgo, now, '5m');
        if (stryMutAct_9fa48("49630") ? cpuMetrics.length > 0 || cpuMetrics[0].values : stryMutAct_9fa48("49629") ? false : stryMutAct_9fa48("49628") ? true : (stryCov_9fa48("49628", "49629", "49630"), (stryMutAct_9fa48("49633") ? cpuMetrics.length <= 0 : stryMutAct_9fa48("49632") ? cpuMetrics.length >= 0 : stryMutAct_9fa48("49631") ? true : (stryCov_9fa48("49631", "49632", "49633"), cpuMetrics.length > 0)) && cpuMetrics[0].values)) {
          const latestCpu = cpuMetrics[0].values[stryMutAct_9fa48("49635") ? cpuMetrics[0].values.length + 1 : (stryCov_9fa48("49635"), cpuMetrics[0].values.length - 1)];
          console.log('[Pulse] Prometheus CPU metric:', latestCpu);
        }

        // Check sovereign stack health
        const sovereignHealth = await sovereignApi.getHealthStatus();
        if (stryMutAct_9fa48("49638") ? false : stryMutAct_9fa48("49637") ? true : (stryCov_9fa48("49637", "49638"), sovereignHealth.healthy)) {
          console.log('[Pulse] Sovereign stack healthy, services:', Object.keys(sovereignHealth.services).length);
        }
      } catch (prometheusError) {
        console.warn('[Pulse] Prometheus metrics unavailable:', prometheusError);
        // Continue with existing health data - Prometheus is optional
      }
    } catch (err) {
      console.error('Health data load error:', err);
      setError('Failed to load health data');
    }
  }, stryMutAct_9fa48("49646") ? ["Stryker was here"] : (stryCov_9fa48("49646"), []));

  // Load alerts and convert to anomalies
  const loadAlerts = useCallback(async () => {
    try {
      const alertsRes = await alertsApi.getAlerts(stryMutAct_9fa48("49649") ? {} : (stryCov_9fa48("49649"), {
        status: 'ACTIVE'
      }));
      if (stryMutAct_9fa48("49653") ? alertsRes.success || alertsRes.data : stryMutAct_9fa48("49652") ? false : stryMutAct_9fa48("49651") ? true : (stryCov_9fa48("49651", "49652", "49653"), alertsRes.success && alertsRes.data)) {
        // Convert alerts to anomalies
        const alertAnomalies: Anomaly[] = alertsRes.data.map(stryMutAct_9fa48("49655") ? () => undefined : (stryCov_9fa48("49655"), alert => stryMutAct_9fa48("49656") ? {} : (stryCov_9fa48("49656"), {
          id: alert.id,
          type: (stryMutAct_9fa48("49659") ? alert.status !== 'resolved' : stryMutAct_9fa48("49658") ? false : stryMutAct_9fa48("49657") ? true : (stryCov_9fa48("49657", "49658", "49659"), alert.status === 'resolved')) ? 'resolved' as const : (stryMutAct_9fa48("49663") ? alert.status !== 'acknowledged' : stryMutAct_9fa48("49662") ? false : stryMutAct_9fa48("49661") ? true : (stryCov_9fa48("49661", "49662", "49663"), alert.status === 'acknowledged')) ? 'investigating' as const : 'detected' as const,
          title: stryMutAct_9fa48("49667") ? (alert.message || alert.title) && 'Unknown alert' : stryMutAct_9fa48("49666") ? false : stryMutAct_9fa48("49665") ? true : (stryCov_9fa48("49665", "49666", "49667"), (stryMutAct_9fa48("49669") ? alert.message && alert.title : stryMutAct_9fa48("49668") ? false : (stryCov_9fa48("49668", "49669"), alert.message || alert.title)) || 'Unknown alert'),
          source: alert.source,
          timestamp: new Date(alert.createdAt)
        })));
        setAnomalies(alertAnomalies);

        // Create activity events from recent alerts
        const alertEvents: ActivityEvent[] = stryMutAct_9fa48("49671") ? alertsRes.data.map(alert => ({
          id: alert.id,
          type: 'alert' as const,
          message: alert.title,
          source: alert.source,
          timestamp: new Date(alert.createdAt)
        })) : (stryCov_9fa48("49671"), alertsRes.data.slice(0, 5).map(stryMutAct_9fa48("49672") ? () => undefined : (stryCov_9fa48("49672"), alert => stryMutAct_9fa48("49673") ? {} : (stryCov_9fa48("49673"), {
          id: alert.id,
          type: 'alert' as const,
          message: alert.title,
          source: alert.source,
          timestamp: new Date(alert.createdAt)
        }))));
        setEvents(alertEvents);
      }
    } catch (err) {
      console.error('Alerts load error:', err);
    }
  }, stryMutAct_9fa48("49676") ? ["Stryker was here"] : (stryCov_9fa48("49676"), []));

  // Initial load and polling
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(stryMutAct_9fa48("49679") ? false : (stryCov_9fa48("49679"), true));
      await Promise.all(stryMutAct_9fa48("49680") ? [] : (stryCov_9fa48("49680"), [loadHealthData(), loadAlerts()]));
      setIsLoading(stryMutAct_9fa48("49681") ? true : (stryCov_9fa48("49681"), false));
    };
    loadAll();

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      loadHealthData();
      loadAlerts();
    }, 30000);
    return stryMutAct_9fa48("49683") ? () => undefined : (stryCov_9fa48("49683"), () => clearInterval(interval));
  }, stryMutAct_9fa48("49684") ? [] : (stryCov_9fa48("49684"), [loadHealthData, loadAlerts]));
  const handleAcknowledge = (id: string) => {
    setAnomalies(stryMutAct_9fa48("49686") ? () => undefined : (stryCov_9fa48("49686"), prev => prev.map(stryMutAct_9fa48("49687") ? () => undefined : (stryCov_9fa48("49687"), a => (stryMutAct_9fa48("49690") ? a.id !== id : stryMutAct_9fa48("49689") ? false : stryMutAct_9fa48("49688") ? true : (stryCov_9fa48("49688", "49689", "49690"), a.id === id)) ? stryMutAct_9fa48("49691") ? {} : (stryCov_9fa48("49691"), {
      ...a,
      type: 'investigating' as const
    }) : a))));
  };
  const handleResolve = (id: string) => {
    setAnomalies(stryMutAct_9fa48("49693") ? () => undefined : (stryCov_9fa48("49693"), prev => prev.map(stryMutAct_9fa48("49694") ? () => undefined : (stryCov_9fa48("49694"), a => (stryMutAct_9fa48("49697") ? a.id !== id : stryMutAct_9fa48("49696") ? false : stryMutAct_9fa48("49695") ? true : (stryCov_9fa48("49695", "49696", "49697"), a.id === id)) ? stryMutAct_9fa48("49698") ? {} : (stryCov_9fa48("49698"), {
      ...a,
      type: 'resolved' as const
    }) : a))));
  };
  return <div className="min-h-full bg-neutral-900 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* ORGANIZATIONAL HEALTH SECTION */}
        {/* ================================================================= */}
        <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">
              ORGANIZATIONAL HEALTH
            </p>
            <span className="text-sm text-green-400 font-medium">
              +{weeklyChange.toFixed(1)}% this week
            </span>
          </div>
          
          {/* Big Score */}
          <div className="mb-8">
            <span className="text-6xl font-bold text-white">
              {(stryMutAct_9fa48("49701") ? healthScore === null : stryMutAct_9fa48("49700") ? false : stryMutAct_9fa48("49699") ? true : (stryCov_9fa48("49699", "49700", "49701"), healthScore !== null)) ? `${healthScore.toFixed(1)}%` : '--'}
            </span>
          </div>
          
          {/* Bar Chart */}
          <HealthBarChart data={healthTrend} />
        </div>

        {/* ================================================================= */}
        {/* TWO COLUMN LAYOUT */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-4">
              <MetricBar label="API LATENCY" value={`${Math.round(apiLatency)}ms`} percentage={stryMutAct_9fa48("49705") ? Math.max(100, apiLatency / 100 * 100) : (stryCov_9fa48("49705"), Math.min(100, stryMutAct_9fa48("49706") ? apiLatency / 100 / 100 : (stryCov_9fa48("49706"), (stryMutAct_9fa48("49707") ? apiLatency * 100 : (stryCov_9fa48("49707"), apiLatency / 100)) * 100)))} color="#22C55E" sparklineData={latencyHistory} />
              <MetricBar label="DATA FRESHNESS" value={`${dataFreshness.toFixed(1)}s`} percentage={stryMutAct_9fa48("49709") ? Math.max(100, (2 - dataFreshness) / 2 * 100) : (stryCov_9fa48("49709"), Math.min(100, stryMutAct_9fa48("49710") ? (2 - dataFreshness) / 2 / 100 : (stryCov_9fa48("49710"), (stryMutAct_9fa48("49711") ? (2 - dataFreshness) * 2 : (stryCov_9fa48("49711"), (stryMutAct_9fa48("49712") ? 2 + dataFreshness : (stryCov_9fa48("49712"), 2 - dataFreshness)) / 2)) * 100)))} color="#3B82F6" sparklineData={freshnessHistory} />
            </div>
            
            {/* Health Dimensions */}
            <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-neutral-400 uppercase tracking-wider">Health Breakdown</p>
                <div className="flex gap-2">
                  <button onClick={stryMutAct_9fa48("49713") ? () => undefined : (stryCov_9fa48("49713"), () => navigate('/cortex/intelligence/chronos?filter=health'))} className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors">
                    View incidents in Chronos →
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {dimensions.map(stryMutAct_9fa48("49715") ? () => undefined : (stryCov_9fa48("49715"), dim => <div key={dim.id} className="cursor-pointer group" onClick={stryMutAct_9fa48("49716") ? () => undefined : (stryCov_9fa48("49716"), () => navigate(`/cortex/intelligence/chronos?filter=${stryMutAct_9fa48("49718") ? dim.name.toUpperCase().replace(' ', '-') : (stryCov_9fa48("49718"), dim.name.toLowerCase().replace(' ', '-'))}`))}>
                    <HealthDimensionCard dimension={dim} />
                    <div className="mt-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => {
                    e.stopPropagation();
                    navigate(`/cortex/council?q=Why did ${dim.name} change by ${dim.trend}%? What factors are affecting it?`);
                  }} className="text-[10px] text-primary-400 hover:text-primary-300">
                        Ask Council →
                      </button>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* System Status */}
            <SystemStatusGrid systems={systems} />
            
            {/* Activity Feed */}
            <ActivityFeed events={events} />
          </div>
        </div>

        {/* ================================================================= */}
        {/* ANOMALIES */}
        {/* ================================================================= */}
        <div className="space-y-4 mb-6">
          <p className="text-xs text-neutral-400 uppercase tracking-wider">Active Alerts</p>
          {anomalies.map(stryMutAct_9fa48("49723") ? () => undefined : (stryCov_9fa48("49723"), anomaly => <AnomalyCard key={anomaly.id} anomaly={anomaly} onAcknowledge={stryMutAct_9fa48("49724") ? () => undefined : (stryCov_9fa48("49724"), () => handleAcknowledge(anomaly.id))} onResolve={stryMutAct_9fa48("49725") ? () => undefined : (stryCov_9fa48("49725"), () => handleResolve(anomaly.id))} />))}
        </div>

        {/* ================================================================= */}
        {/* SOVEREIGN OBSERVABILITY - Powered by Prometheus/Grafana */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="text-white font-medium">Sovereign Observability</p>
                <p className="text-green-400/70 text-xs">Powered by Prometheus + Grafana</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="http://localhost:9090" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 hover:bg-neutral-700 transition-colors">
                Prometheus →
              </a>
              <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-400 hover:bg-green-500/30 transition-colors">
                Open Grafana →
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================================= */}
        <div className="flex gap-3">
          <button onClick={stryMutAct_9fa48("49726") ? () => undefined : (stryCov_9fa48("49726"), () => navigate('/cortex/pulse/alerts'))} className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors">
            View All Alerts →
          </button>
          <button onClick={stryMutAct_9fa48("49728") ? () => undefined : (stryCov_9fa48("49728"), () => navigate('/cortex/pulse/metrics'))} className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors">
            Detailed Metrics →
          </button>
          <button onClick={() => {
          // Generate a health report
          const report = stryMutAct_9fa48("49731") ? {} : (stryCov_9fa48("49731"), {
            timestamp: new Date().toISOString(),
            healthScore,
            dimensions: dimensions.map(stryMutAct_9fa48("49732") ? () => undefined : (stryCov_9fa48("49732"), d => stryMutAct_9fa48("49733") ? {} : (stryCov_9fa48("49733"), {
              name: d.name,
              score: d.score,
              trend: d.trend
            }))),
            systems: systems.map(stryMutAct_9fa48("49734") ? () => undefined : (stryCov_9fa48("49734"), s => stryMutAct_9fa48("49735") ? {} : (stryCov_9fa48("49735"), {
              name: s.name,
              status: s.status
            })))
          });
          const blob = new Blob(stryMutAct_9fa48("49736") ? [] : (stryCov_9fa48("49736"), [JSON.stringify(report, null, 2)]), stryMutAct_9fa48("49737") ? {} : (stryCov_9fa48("49737"), {
            type: 'application/json'
          }));
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `health-report-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }} className="px-4 py-2 bg-primary-600 rounded-lg text-sm text-white font-medium hover:bg-primary-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>;
};
export default PulsePage;