import { logger } from '../../../lib/logger';
/**
 * Page — Gateway Dashboard Page
 *
 * React page component rendered by the router.
 * @module pages/cortex/enterprise/GatewayDashboardPage
 */

/**
 * CendiaGateway™ — AI Governance Gateway Dashboard
 * 
 * The CISO's view: real-time visibility into every AI interaction
 * across the organization, PII detection, policy enforcement,
 * and the AI Manifest™ compliance artifact.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Activity, AlertTriangle, Eye, FileText, Download,
  Clock, Zap, DollarSign, Users, Building2, Bot, Lock,
  CheckCircle, XCircle, AlertCircle, Search, Filter,
  BarChart3, PieChart, TrendingUp, Globe, Server,
  ShieldAlert, ShieldCheck, FileWarning, Fingerprint,
} from 'lucide-react';
import { api } from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

interface GatewayStats {
  totalInteractions: number;
  totalTokens: number;
  totalCostUsd: number;
  piiDetections: number;
  piiBlocks: number;
  piiRedactions: number;
  policyBlocks: number;
  policyWarnings: number;
  byProvider: Record<string, { count: number; tokens: number; costUsd: number }>;
  byModel: Record<string, { count: number; tokens: number; costUsd: number }>;
  byDepartment: Record<string, { count: number; tokens: number; costUsd: number }>;
  byUser: Record<string, { count: number; tokens: number; costUsd: number }>;
  topPIITypes: Array<{ type: string; count: number }>;
}

interface GatewayInteraction {
  id: string;
  provider: string;
  model: string;
  userId: string;
  userEmail: string;
  userDepartment: string;
  piiDetected: boolean;
  piiTypes: string[];
  policyAction: string;
  policyReason?: string;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  statusCode: number;
  integrityHash: string;
  requestedAt: string;
}

interface GatewayPolicy {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  departments: string[];
  blockPIITypes: string[];
  redactPIITypes: string[];
  blockKeywords: string[];
  defaultAction: string;
}

interface PIITestResult {
  hasPII: boolean;
  types: string[];
  detections: Array<{ type: string; redacted: string; confidence: number }>;
  redactedText: string;
  scanDurationMs: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

const GatewayDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<GatewayStats | null>(null);
  const [interactions, setInteractions] = useState<GatewayInteraction[]>([]);
  const [policies, setPolicies] = useState<GatewayPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'policies' | 'pii-test' | 'manifest'>('overview');
  const [piiTestText, setPiiTestText] = useState('');
  const [piiTestResult, setPiiTestResult] = useState<PIITestResult | null>(null);
  const [piiTestLoading, setPiiTestLoading] = useState(false);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [manifest, setManifest] = useState<any>(null);
  const [filterProvider, setFilterProvider] = useState('');
  const [filterPiiOnly, setFilterPiiOnly] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, interactionsRes, policiesRes] = await Promise.all([
        api.get<GatewayStats>('/gateway/stats'),
        api.get<{ interactions: GatewayInteraction[] }>('/gateway/interactions?limit=50'),
        api.get<{ policies: GatewayPolicy[] }>('/gateway/policies'),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (interactionsRes.data) setInteractions(interactionsRes.data.interactions || []);
      if (policiesRes.data) setPolicies(policiesRes.data.policies || []);
    } catch (err) {
      logger.error('[Gateway] Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handlePIITest = async () => {
    if (!piiTestText.trim()) return;
    setPiiTestLoading(true);
    try {
      const res = await api.post<PIITestResult>('/gateway/test-pii', { text: piiTestText });
      if (res.data) setPiiTestResult(res.data);
    } catch (err) {
      logger.error('[Gateway] PII test failed:', err);
    } finally {
      setPiiTestLoading(false);
    }
  };

  const handleGenerateManifest = async () => {
    setManifestLoading(true);
    try {
      const res = await api.post<any>('/gateway/manifest', {
        periodStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        periodEnd: new Date().toISOString(),
      });
      if (res.data) setManifest(res.data);
    } catch (err) {
      logger.error('[Gateway] Manifest generation failed:', err);
    } finally {
      setManifestLoading(false);
    }
  };

  const handleDownloadManifest = () => {
    if (!manifest) return;
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-manifest-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-amber-900/30 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  CendiaGateway™
                </h1>
                <p className="text-sm text-gray-400">AI Governance Gateway — Every AI interaction, defensible.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Gateway Active</span>
              </div>
              <button
                onClick={fetchData}
                className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
              { id: 'interactions' as const, label: 'Interactions', icon: Activity },
              { id: 'policies' as const, label: 'Policies', icon: ShieldAlert },
              { id: 'pii-test' as const, label: 'PII Scanner', icon: Fingerprint },
              { id: 'manifest' as const, label: 'AI Manifest™', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-amber-400 border-t border-x border-amber-500/30'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading && !stats ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
          </div>
        ) : activeTab === 'overview' ? (
          <OverviewTab stats={stats} interactions={interactions} />
        ) : activeTab === 'interactions' ? (
          <InteractionsTab
            interactions={interactions}
            filterProvider={filterProvider}
            setFilterProvider={setFilterProvider}
            filterPiiOnly={filterPiiOnly}
            setFilterPiiOnly={setFilterPiiOnly}
          />
        ) : activeTab === 'policies' ? (
          <PoliciesTab policies={policies} />
        ) : activeTab === 'pii-test' ? (
          <PIITestTab
            text={piiTestText}
            setText={setPiiTestText}
            result={piiTestResult}
            loading={piiTestLoading}
            onTest={handlePIITest}
          />
        ) : activeTab === 'manifest' ? (
          <ManifestTab
            manifest={manifest}
            loading={manifestLoading}
            onGenerate={handleGenerateManifest}
            onDownload={handleDownloadManifest}
          />
        ) : null}
      </div>
    </div>
  );
};

// =============================================================================
// OVERVIEW TAB
// =============================================================================

const OverviewTab: React.FC<{ stats: GatewayStats | null; interactions: GatewayInteraction[] }> = ({ stats, interactions }) => {
  if (!stats) return null;

  const statCards = [
    { label: 'Total Interactions', value: stats.totalInteractions.toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { label: 'Total Tokens', value: stats.totalTokens.toLocaleString(), icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { label: 'Total Cost', value: `$${stats.totalCostUsd.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { label: 'PII Detections', value: stats.piiDetections.toLocaleString(), icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { label: 'PII Blocked', value: stats.piiBlocks.toLocaleString(), icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { label: 'PII Redacted', value: stats.piiRedactions.toLocaleString(), icon: Eye, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    { label: 'Policy Blocks', value: stats.policyBlocks.toLocaleString(), icon: Lock, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { label: 'Policy Warnings', value: stats.policyWarnings.toLocaleString(), icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`${card.bg} ${card.border} border rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-gray-400">{card.label}</span>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Provider + Model Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Provider */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            By Provider
          </h3>
          {Object.entries(stats.byProvider).length === 0 ? (
            <p className="text-sm text-gray-500 italic">No interactions yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.byProvider).map(([provider, data]) => (
                <div key={provider} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300 capitalize">{provider}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{data.count} calls</span>
                    <span>{data.tokens.toLocaleString()} tokens</span>
                    <span className="text-emerald-400">${data.costUsd.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Department */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            By Department
          </h3>
          {Object.entries(stats.byDepartment).length === 0 ? (
            <p className="text-sm text-gray-500 italic">No interactions yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.byDepartment).map(([dept, data]) => (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300 capitalize">{dept}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{data.count} calls</span>
                    <span>{data.tokens.toLocaleString()} tokens</span>
                    <span className="text-emerald-400">${data.costUsd.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top PII Types */}
      {stats.topPIITypes.length > 0 && (
        <div className="bg-gray-900/50 border border-amber-500/20 rounded-xl p-5">
          <h3 className="text-sm font-medium text-amber-300 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            PII Detections by Type
          </h3>
          <div className="flex flex-wrap gap-3">
            {stats.topPIITypes.map(({ type, count }) => (
              <div key={type} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs text-amber-300 uppercase font-mono">{type}</span>
                <span className="text-xs text-amber-500 font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Interactions */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Recent Interactions
        </h3>
        {interactions.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No AI interactions recorded yet.</p>
            <p className="text-xs text-gray-600 mt-1">
              Point your AI API calls to the gateway to start monitoring.
            </p>
          </div>
        ) : (
          <InteractionList interactions={interactions.slice(0, 10)} />
        )}
      </div>
    </div>
  );
};

// =============================================================================
// INTERACTIONS TAB
// =============================================================================

const InteractionsTab: React.FC<{
  interactions: GatewayInteraction[];
  filterProvider: string;
  setFilterProvider: (v: string) => void;
  filterPiiOnly: boolean;
  setFilterPiiOnly: (v: boolean) => void;
}> = ({ interactions, filterProvider, setFilterProvider, filterPiiOnly, setFilterPiiOnly }) => {
  let filtered = interactions;
  if (filterProvider) filtered = filtered.filter(i => i.provider === filterProvider);
  if (filterPiiOnly) filtered = filtered.filter(i => i.piiDetected);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterProvider}
            onChange={e => setFilterProvider(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300"
          >
            <option value="">All Providers</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
            <option value="ollama">Ollama</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filterPiiOnly}
            onChange={e => setFilterPiiOnly(e.target.checked)}
            className="rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-sm text-gray-400">PII only</span>
        </label>
        <span className="text-xs text-gray-600 ml-auto">{filtered.length} interactions</span>
      </div>

      {/* Table */}
      <InteractionList interactions={filtered} />
    </div>
  );
};

// =============================================================================
// INTERACTION LIST (shared)
// =============================================================================

const InteractionList: React.FC<{ interactions: GatewayInteraction[] }> = ({ interactions }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
          <th className="text-left py-2 px-3">Time</th>
          <th className="text-left py-2 px-3">User</th>
          <th className="text-left py-2 px-3">Provider</th>
          <th className="text-left py-2 px-3">Model</th>
          <th className="text-left py-2 px-3">Tokens</th>
          <th className="text-left py-2 px-3">Cost</th>
          <th className="text-left py-2 px-3">PII</th>
          <th className="text-left py-2 px-3">Action</th>
          <th className="text-left py-2 px-3">Latency</th>
          <th className="text-left py-2 px-3">Hash</th>
        </tr>
      </thead>
      <tbody>
        {interactions.map(i => (
          <tr key={i.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
            <td className="py-2.5 px-3 text-gray-400 text-xs font-mono">
              {new Date(i.requestedAt).toLocaleTimeString()}
            </td>
            <td className="py-2.5 px-3">
              <div className="text-gray-300 text-xs">{i.userEmail}</div>
              <div className="text-gray-600 text-xs">{i.userDepartment}</div>
            </td>
            <td className="py-2.5 px-3">
              <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 capitalize">{i.provider}</span>
            </td>
            <td className="py-2.5 px-3 text-gray-400 text-xs font-mono">{i.model}</td>
            <td className="py-2.5 px-3 text-gray-400 text-xs">{i.totalTokens.toLocaleString()}</td>
            <td className="py-2.5 px-3 text-emerald-400 text-xs">${i.estimatedCostUsd.toFixed(4)}</td>
            <td className="py-2.5 px-3">
              {i.piiDetected ? (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-amber-400">{i.piiTypes.join(', ')}</span>
                </div>
              ) : (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </td>
            <td className="py-2.5 px-3">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                i.policyAction === 'block' ? 'bg-red-500/10 text-red-400' :
                i.policyAction === 'redact' ? 'bg-orange-500/10 text-orange-400' :
                i.policyAction === 'warn' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-emerald-500/10 text-emerald-400'
              }`}>
                {i.policyAction}
              </span>
            </td>
            <td className="py-2.5 px-3 text-gray-500 text-xs">{i.latencyMs}ms</td>
            <td className="py-2.5 px-3 text-gray-600 text-xs font-mono" title={i.integrityHash}>
              {i.integrityHash.slice(0, 8)}...
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// =============================================================================
// POLICIES TAB
// =============================================================================

const PoliciesTab: React.FC<{ policies: GatewayPolicy[] }> = ({ policies }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-300">Active Policies</h3>
      <span className="text-xs text-gray-500">{policies.filter(p => p.enabled).length} active / {policies.length} total</span>
    </div>

    {policies.length === 0 ? (
      <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-xl">
        <ShieldCheck className="w-12 h-12 text-gray-700 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Default policies active.</p>
        <p className="text-xs text-gray-600 mt-1">SSN, credit cards, and medical records are blocked by default.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {policies.map(policy => (
          <div key={policy.id} className={`border rounded-xl p-4 ${
            policy.enabled ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-900/20 border-gray-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${policy.enabled ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                <h4 className="text-sm font-medium text-gray-200">{policy.name}</h4>
                <span className="text-xs text-gray-600">Priority: {policy.priority}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                policy.defaultAction === 'block' ? 'bg-red-500/10 text-red-400' :
                policy.defaultAction === 'redact' ? 'bg-orange-500/10 text-orange-400' :
                'bg-emerald-500/10 text-emerald-400'
              }`}>
                {policy.defaultAction}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {policy.blockPIITypes.length > 0 && (
                <div>
                  <span className="text-gray-500">Block PII:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {policy.blockPIITypes.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono uppercase">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {policy.redactPIITypes.length > 0 && (
                <div>
                  <span className="text-gray-500">Redact PII:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {policy.redactPIITypes.map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono uppercase">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {policy.blockKeywords.length > 0 && (
                <div>
                  <span className="text-gray-500">Block Keywords:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {policy.blockKeywords.map(k => (
                      <span key={k} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-300">"{k}"</span>
                    ))}
                  </div>
                </div>
              )}
              {policy.departments.length > 0 && (
                <div>
                  <span className="text-gray-500">Departments:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {policy.departments.map(d => (
                      <span key={d} className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">{d}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// =============================================================================
// PII TEST TAB
// =============================================================================

const PIITestTab: React.FC<{
  text: string;
  setText: (v: string) => void;
  result: PIITestResult | null;
  loading: boolean;
  onTest: () => void;
}> = ({ text, setText, result, loading, onTest }) => (
  <div className="space-y-6">
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
        <Fingerprint className="w-4 h-4 text-amber-400" />
        PII Detection Scanner
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Paste any text below to test the gateway's PII detection engine. This is the same engine
        that scans every AI prompt passing through the gateway.
      </p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste text to scan for PII...&#10;&#10;Example: Please analyze John Smith's account. His SSN is 123-45-6789, email is john@acme.com, and credit card is 4111-1111-1111-1111."
        className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 font-mono placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none"
      />
      <button
        onClick={onTest}
        disabled={loading || !text.trim()}
        className="mt-3 px-4 py-2 text-sm rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border border-amber-500 border-t-transparent" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Scan for PII
          </>
        )}
      </button>
    </div>

    {result && (
      <div className={`border rounded-xl p-5 ${
        result.hasPII
          ? 'bg-red-950/20 border-red-500/30'
          : 'bg-emerald-950/20 border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {result.hasPII ? (
            <>
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm font-medium text-red-300">
                PII Detected — {result.detections.length} instance{result.detections.length !== 1 ? 's' : ''} found
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">No PII Detected</span>
            </>
          )}
          <span className="text-xs text-gray-500 ml-auto">Scanned in {result.scanDurationMs}ms</span>
        </div>

        {result.hasPII && (
          <>
            {/* Detection badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {result.detections.map((d, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="text-xs text-red-300 uppercase font-mono">{d.type}</span>
                  <span className="text-xs text-red-500">→ {d.redacted}</span>
                  <span className="text-xs text-gray-600">{(d.confidence * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>

            {/* Redacted text */}
            <div className="mt-4">
              <span className="text-xs text-gray-500 mb-2 block">Redacted output:</span>
              <pre className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {result.redactedText}
              </pre>
            </div>
          </>
        )}
      </div>
    )}
  </div>
);

// =============================================================================
// AI MANIFEST™ TAB
// =============================================================================

const ManifestTab: React.FC<{
  manifest: any;
  loading: boolean;
  onGenerate: () => void;
  onDownload: () => void;
}> = ({ manifest, loading, onGenerate, onDownload }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-amber-950/30 to-gray-900/50 border border-amber-500/20 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <FileText className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-300">The AI Manifest™</h3>
          <p className="text-sm text-gray-400">
            A cryptographically signed compliance artifact proving every AI interaction
            in your organization was governed, monitored, and policy-enforced.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Hand this to an auditor, regulator, or board member. It contains a complete inventory
        of all AI usage — by department, by user, by model — with Merkle tree integrity proof
        and HMAC signatures. Supports defensible compliance posture under EU AI Act, GDPR, HIPAA, and SOX.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="px-5 py-2.5 text-sm rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate AI Manifest (Last 90 Days)
            </>
          )}
        </button>

        {manifest && (
          <button
            onClick={onDownload}
            className="px-5 py-2.5 text-sm rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        )}
      </div>
    </div>

    {manifest && (
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ManifestCard label="Total Interactions" value={manifest.summary.totalInteractions} />
          <ManifestCard label="Total Users" value={manifest.summary.totalUsers} />
          <ManifestCard label="Total Departments" value={manifest.summary.totalDepartments} />
          <ManifestCard label="Total Cost" value={`$${manifest.summary.totalCostUsd}`} />
        </div>

        {/* Integrity Proof */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-5">
          <h4 className="text-sm font-medium text-emerald-300 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Cryptographic Integrity Proof
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-gray-500">Merkle Root:</span>
              <p className="text-emerald-400 break-all">{manifest.integrity.merkleRoot}</p>
            </div>
            <div>
              <span className="text-gray-500">Integrity Hash:</span>
              <p className="text-emerald-400 break-all">{manifest.integrity.integrityHash}</p>
            </div>
            <div>
              <span className="text-gray-500">Signature:</span>
              <p className="text-emerald-400 break-all">{manifest.integrity.signature}</p>
            </div>
            <div>
              <span className="text-gray-500">Algorithm:</span>
              <p className="text-emerald-400">{manifest.integrity.algorithm}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {manifest.integrity.chainIntact ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400">Chain intact — {manifest.integrity.entriesVerified} entries verified</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">Chain integrity compromised</span>
              </>
            )}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Compliance Status</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'EU AI Act Article 26 (Deployer Monitoring Posture)', met: manifest.compliance.euAiActArticle26 },
              { label: 'GDPR Article 35 (DPIA)', met: manifest.compliance.gdprArticle35 },
              { label: 'HIPAA PHI Protection', met: manifest.compliance.hipaaPhiProtection },
              { label: 'SOX §302 Documentation', met: manifest.compliance.sox302Documentation },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                {item.met ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )}
                <span className={`text-xs ${item.met ? 'text-emerald-400' : 'text-gray-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Breakdown */}
        {manifest.departments.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Department Breakdown</h4>
            <div className="space-y-2">
              {manifest.departments.map((dept: any) => (
                <div key={dept.name} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-sm text-gray-300 capitalize">{dept.name}</span>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{dept.users} users</span>
                    <span>{dept.interactions} interactions</span>
                    <span>{dept.tokens.toLocaleString()} tokens</span>
                    <span className="text-emerald-400">${dept.costUsd}</span>
                    {dept.piiDetections > 0 && (
                      <span className="text-amber-400">{dept.piiDetections} PII</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

const ManifestCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
    <span className="text-xs text-gray-500">{label}</span>
    <p className="text-xl font-bold text-amber-400 mt-1">{value}</p>
  </div>
);

export default GatewayDashboardPage;
