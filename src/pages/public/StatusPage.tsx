/**
 * Page — Public Status Page
 *
 * Real-time platform status page showing component health, uptime, and active incidents.
 * Unauthenticated — accessible to customers, investors, and the public.
 *
 * @exports StatusPage
 * @module pages/public/StatusPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Shield,
  Clock,
  Activity,
  Server,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ComponentStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  description?: string;
}

interface ActiveIncident {
  severity: 'info' | 'warning' | 'critical';
  service: string;
  message: string;
  createdAt: string;
}

interface StatusResponse {
  status: 'operational' | 'degraded' | 'major_outage';
  timestamp: string;
  uptime: number;
  version: string;
  components: ComponentStatus[];
  activeIncidents: ActiveIncident[];
}

// =============================================================================
// HELPERS
// =============================================================================

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) {return `${days}d ${hours}h ${mins}m`;}
  if (hours > 0) {return `${hours}h ${mins}m`;}
  return `${mins}m`;
}

function statusIcon(status: string) {
  switch (status) {
    case 'healthy':
    case 'operational':
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case 'degraded':
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case 'down':
    case 'major_outage':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Activity className="w-5 h-5 text-slate-400" />;
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'operational':
      return 'All Systems Operational';
    case 'degraded':
      return 'Partial System Degradation';
    case 'major_outage':
      return 'Major Outage';
    default:
      return 'Unknown';
  }
}

function statusBg(status: string): string {
  switch (status) {
    case 'operational':
      return 'bg-emerald-500';
    case 'degraded':
      return 'bg-amber-500';
    case 'major_outage':
      return 'bg-red-500';
    default:
      return 'bg-slate-500';
  }
}

function componentStatusBadge(status: string) {
  switch (status) {
    case 'healthy':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Operational
        </span>
      );
    case 'degraded':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Degraded
        </span>
      );
    case 'down':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Down
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Unknown
        </span>
      );
  }
}

function severityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">Critical</span>;
    case 'warning':
      return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">Warning</span>;
    default:
      return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">Info</span>;
  }
}

// =============================================================================
// STATUS PAGE COMPONENT
// =============================================================================

export const StatusPage: React.FC = () => {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/v1/public/status');
      if (!res.ok) {throw new Error(`HTTP ${res.status}`);}
      const json: StatusResponse = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch (err) {
      setError('Unable to reach the Datacendia API. The service may be temporarily unavailable.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-slate-900" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Datacendia Status</h1>
                <p className="text-sm text-slate-500">Real-time platform health</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                datacendia.com
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overall Status Banner */}
        {error ? (
          <div className="rounded-xl bg-red-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-semibold">Service Unreachable</h2>
                <p className="text-red-100 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : data ? (
          <div className={`rounded-xl ${statusBg(data.status)} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {statusIcon(data.status)}
                <div>
                  <h2 className="text-lg font-semibold">{statusLabel(data.status)}</h2>
                  <p className="text-white/80 text-sm mt-1">
                    Last checked {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 60s
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-white/70">
                <div className="flex items-center gap-1.5 justify-end">
                  <Clock className="w-3.5 h-3.5" />
                  Uptime: {formatUptime(data.uptime)}
                </div>
                <div className="mt-1">v{data.version}</div>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="rounded-xl bg-slate-200 p-6 animate-pulse">
            <div className="h-6 bg-slate-300 rounded w-48" />
            <div className="h-4 bg-slate-300 rounded w-64 mt-2" />
          </div>
        ) : null}

        {/* Active Incidents */}
        {data && data.activeIncidents.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Active Incidents
            </h3>
            <div className="space-y-3">
              {data.activeIncidents.map((incident, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {severityBadge(incident.severity)}
                        <span className="text-sm font-medium text-slate-700">{incident.service}</span>
                      </div>
                      <p className="text-sm text-slate-600">{incident.message}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(incident.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Component Status */}
        <section>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-500" />
            Components
          </h3>
          {data ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {data.components.map((comp) => (
                <div
                  key={comp.name}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon(comp.status)}
                    <div>
                      <div className="text-sm font-medium text-slate-900">{comp.name}</div>
                      {comp.description && (
                        <div className="text-xs text-slate-500 mt-0.5">{comp.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {comp.latency > 0 && (
                      <span className="text-xs text-slate-400">{comp.latency}ms</span>
                    )}
                    {componentStatusBadge(comp.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded w-40" />
                  <div className="h-6 bg-slate-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* No incidents message */}
        {data && data.activeIncidents.length === 0 && (
          <section className="bg-white border border-slate-200 rounded-xl p-6 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No active incidents</p>
            <p className="text-xs text-slate-400 mt-1">
              All systems are operating normally.
            </p>
          </section>
        )}

        {/* Footer info */}
        <footer className="text-center text-xs text-slate-400 pt-4 pb-8 space-y-1">
          <p>This page auto-refreshes every 60 seconds.</p>
          <p>
            Questions? Contact{' '}
            <a href="mailto:support@datacendia.com" className="text-slate-500 hover:text-slate-700 underline">
              support@datacendia.com
            </a>
          </p>
          <p className="pt-2">
            <Link to="/security" className="text-slate-500 hover:text-slate-700 underline">Security</Link>
            {' · '}
            <Link to="/privacy" className="text-slate-500 hover:text-slate-700 underline">Privacy</Link>
            {' · '}
            <Link to="/terms" className="text-slate-500 hover:text-slate-700 underline">Terms</Link>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default StatusPage;
