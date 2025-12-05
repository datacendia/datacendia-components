// =============================================================================
// DATACENDIA - THE PULSE PAGE (Enhanced)
// Real-time organizational health monitoring with activity feed & system status
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { healthApi, alertsApi } from '../../../lib/api';
import { useLanguage } from '../../../contexts/LanguageContext';

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

const Sparkline: React.FC<{ data: number[]; color: string; height?: number }> = ({ 
  data, 
  color, 
  height = 32 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// =============================================================================
// HEALTH BAR CHART COMPONENT
// =============================================================================

const HealthBarChart: React.FC<{ data: number[] }> = ({ data }) => {
  const maxValue = Math.max(...data, 100);
  
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((value, index) => (
        <div
          key={index}
          className="flex-1 bg-neutral-600 rounded-t transition-all hover:bg-neutral-500"
          style={{ height: `${(value / maxValue) * 100}%` }}
        />
      ))}
    </div>
  );
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
}> = ({ label, value, percentage, color, sparklineData }) => (
  <div className="bg-neutral-800/50 rounded-lg p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">{label}</p>
    <div className="flex items-end justify-between mb-3">
      <p className="text-2xl font-bold text-white">{value}</p>
      {sparklineData && (
        <div className="w-16 h-6">
          <Sparkline data={sparklineData} color={color} height={24} />
        </div>
      )}
    </div>
    <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

// =============================================================================
// SYSTEM STATUS COMPONENT
// =============================================================================

const SystemStatusGrid: React.FC<{ systems: SystemStatus[] }> = ({ systems }) => (
  <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">System Status</p>
    <div className="grid grid-cols-2 gap-3">
      {systems.map(system => (
        <div key={system.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              system.status === 'online' && 'bg-green-500',
              system.status === 'degraded' && 'bg-yellow-500',
              system.status === 'offline' && 'bg-red-500'
            )} />
            <span className="text-sm text-neutral-300">{system.name}</span>
          </div>
          <span className="text-xs text-neutral-500">{system.latency}ms</span>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// ACTIVITY FEED COMPONENT
// =============================================================================

const ActivityFeed: React.FC<{ events: ActivityEvent[] }> = ({ events }) => {
  const typeConfig = {
    alert: { icon: '⚠️', color: 'text-red-400' },
    change: { icon: '📝', color: 'text-blue-400' },
    deployment: { icon: '🚀', color: 'text-green-400' },
    metric: { icon: '📊', color: 'text-purple-400' },
  };

  return (
    <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
      <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Live Activity</p>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {events.map(event => {
          const config = typeConfig[event.type];
          return (
            <div key={event.id} className="flex items-start gap-3">
              <span className={cn('text-sm', config.color)}>{config.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-300 truncate">{event.message}</p>
                <p className="text-xs text-neutral-500">{event.source} • just now</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// HEALTH DIMENSION CARD
// =============================================================================

const HealthDimensionCard: React.FC<{ dimension: HealthDimension }> = ({ dimension }) => (
  <div className="bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/50">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-lg">{dimension.icon}</span>
        <span className="text-sm text-neutral-300">{dimension.name}</span>
      </div>
      <span className={cn(
        'text-xs font-medium',
        dimension.trend > 0 ? 'text-green-400' : dimension.trend < 0 ? 'text-red-400' : 'text-neutral-400'
      )}>
        {dimension.trend > 0 ? '+' : ''}{dimension.trend}%
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${dimension.score}%`, backgroundColor: dimension.color }}
        />
      </div>
      <span className="text-sm font-medium text-white">{dimension.score}</span>
    </div>
  </div>
);

// =============================================================================
// ANOMALY CARD COMPONENT
// =============================================================================

const AnomalyCard: React.FC<{ anomaly: Anomaly; onAcknowledge?: () => void; onResolve?: () => void }> = ({ 
  anomaly, 
  onAcknowledge, 
  onResolve 
}) => {
  const typeConfig = {
    detected: { icon: '⚡', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    investigating: { icon: '🔍', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    resolved: { icon: '✓', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  };
  
  const config = typeConfig[anomaly.type];
  
  return (
    <div className={cn('rounded-lg p-4 border', config.bg, config.border)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className={cn('text-xl', config.color)}>{config.icon}</span>
          <div>
            <p className={cn('text-xs font-semibold uppercase tracking-wider mb-1', config.color)}>
              {anomaly.type === 'detected' ? 'ANOMALY DETECTED' : 
               anomaly.type === 'investigating' ? 'INVESTIGATING' : 'RESOLVED'}
            </p>
            <p className="text-white text-sm">{anomaly.title}</p>
            <p className="text-xs text-neutral-500 mt-1">{anomaly.source}</p>
          </div>
        </div>
        {anomaly.type !== 'resolved' && (
          <div className="flex gap-2">
            {anomaly.type === 'detected' && onAcknowledge && (
              <button
                onClick={onAcknowledge}
                className="px-3 py-1 text-xs bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition-colors"
              >
                Acknowledge
              </button>
            )}
            {onResolve && (
              <button
                onClick={onResolve}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Resolve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PulsePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // State
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [weeklyChange, setWeeklyChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Health trend data (last 14 days)
  const [healthTrend, setHealthTrend] = useState<number[]>([]);
  
  // Sparkline data for metrics
  const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
  const [freshnessHistory, setFreshnessHistory] = useState<number[]>([]);
  const [apiLatency, setApiLatency] = useState<number>(0);
  const [dataFreshness, setDataFreshness] = useState<number>(0);
  
  // System status - fetched from API
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  
  // Activity events - fetched from alerts API
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  
  // Health dimensions - fetched from API
  const [dimensions, setDimensions] = useState<HealthDimension[]>([]);
  
  // Anomalies - fetched from alerts API
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  // Load health score and dimensions
  const loadHealthData = useCallback(async () => {
    try {
      const [scoreRes, dimensionsRes, trendRes, systemsRes] = await Promise.all([
        healthApi.getScore(),
        healthApi.getDimensions(),
        healthApi.getTrend(14),
        healthApi.getSystemStatus(),
      ]);
      
      if (scoreRes.success && scoreRes.data) {
        setHealthScore(scoreRes.data.overall);
        // Calculate weekly change from trend
        if (trendRes.success && trendRes.data && trendRes.data.length >= 7) {
          const oldScore = trendRes.data[0]?.score || scoreRes.data.overall;
          const change = ((scoreRes.data.overall - oldScore) / oldScore) * 100;
          setWeeklyChange(change);
        }
      }
      
      if (dimensionsRes.success && dimensionsRes.data) {
        const dims = dimensionsRes.data;
        setDimensions([
          { id: '1', name: 'Data Quality', score: dims.data?.score || 0, trend: dims.data?.change || 0, icon: '📊', color: '#3B82F6' },
          { id: '2', name: 'Operations', score: dims.operations?.score || 0, trend: dims.operations?.change || 0, icon: '⚙️', color: '#F59E0B' },
          { id: '3', name: 'Security', score: dims.security?.score || 0, trend: dims.security?.change || 0, icon: '🔒', color: '#10B981' },
          { id: '4', name: 'People', score: dims.people?.score || 0, trend: dims.people?.change || 0, icon: '👥', color: '#8B5CF6' },
        ]);
      }
      
      if (trendRes.success && trendRes.data) {
        setHealthTrend(trendRes.data.map(t => t.score));
      }
      
      if (systemsRes.success && systemsRes.data) {
        setSystems(systemsRes.data.map((s, i) => ({
          id: String(i + 1),
          name: s.service,
          status: s.status as 'online' | 'degraded' | 'offline',
          latency: s.latency || 0,
          uptime: 99.9, // Will be enhanced when uptime endpoint is added
        })));
        
        // Calculate average latency for display
        const avgLatency = systemsRes.data.reduce((acc, s) => acc + (s.latency || 0), 0) / systemsRes.data.length;
        setApiLatency(avgLatency);
        setLatencyHistory(prev => [...prev.slice(-9), avgLatency]);
      }
    } catch (err) {
      console.error('Health data load error:', err);
      setError('Failed to load health data');
    }
  }, []);

  // Load alerts and convert to anomalies
  const loadAlerts = useCallback(async () => {
    try {
      const alertsRes = await alertsApi.getAlerts({ status: 'ACTIVE' });
      
      if (alertsRes.success && alertsRes.data) {
        // Convert alerts to anomalies
        const alertAnomalies: Anomaly[] = alertsRes.data.map(alert => ({
          id: alert.id,
          type: alert.status === 'resolved' ? 'resolved' as const : 
                alert.status === 'acknowledged' ? 'investigating' as const : 'detected' as const,
          title: alert.message || alert.title || 'Unknown alert',
          source: alert.source,
          timestamp: new Date(alert.createdAt),
        }));
        setAnomalies(alertAnomalies);
        
        // Create activity events from recent alerts
        const alertEvents: ActivityEvent[] = alertsRes.data.slice(0, 5).map(alert => ({
          id: alert.id,
          type: 'alert' as const,
          message: alert.title,
          source: alert.source,
          timestamp: new Date(alert.createdAt),
        }));
        setEvents(alertEvents);
      }
    } catch (err) {
      console.error('Alerts load error:', err);
    }
  }, []);

  // Initial load and polling
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([loadHealthData(), loadAlerts()]);
      setIsLoading(false);
    };

    loadAll();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      loadHealthData();
      loadAlerts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadHealthData, loadAlerts]);

  const handleAcknowledge = (id: string) => {
    setAnomalies(prev => prev.map(a => 
      a.id === id ? { ...a, type: 'investigating' as const } : a
    ));
  };

  const handleResolve = (id: string) => {
    setAnomalies(prev => prev.map(a => 
      a.id === id ? { ...a, type: 'resolved' as const } : a
    ));
  };

  return (
    <div className="min-h-full bg-neutral-900 p-6 lg:p-8">
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
              {healthScore !== null ? `${healthScore.toFixed(1)}%` : '--'}
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
              <MetricBar
                label="API LATENCY"
                value={`${Math.round(apiLatency)}ms`}
                percentage={Math.min(100, (apiLatency / 100) * 100)}
                color="#22C55E"
                sparklineData={latencyHistory}
              />
              <MetricBar
                label="DATA FRESHNESS"
                value={`${dataFreshness.toFixed(1)}s`}
                percentage={Math.min(100, ((2 - dataFreshness) / 2) * 100)}
                color="#3B82F6"
                sparklineData={freshnessHistory}
              />
            </div>
            
            {/* Health Dimensions */}
            <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Health Breakdown</p>
              <div className="grid grid-cols-2 gap-3">
                {dimensions.map(dim => (
                  <HealthDimensionCard key={dim.id} dimension={dim} />
                ))}
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
          {anomalies.map(anomaly => (
            <AnomalyCard 
              key={anomaly.id} 
              anomaly={anomaly}
              onAcknowledge={() => handleAcknowledge(anomaly.id)}
              onResolve={() => handleResolve(anomaly.id)}
            />
          ))}
        </div>

        {/* ================================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================================= */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/cortex/pulse/alerts')}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            View All Alerts →
          </button>
          <button
            onClick={() => navigate('/cortex/pulse/metrics')}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            Detailed Metrics →
          </button>
          <button
            className="px-4 py-2 bg-primary-600 rounded-lg text-sm text-white font-medium hover:bg-primary-700 transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default PulsePage;