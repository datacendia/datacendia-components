/**
 * CendiaPanopticon™ - Global Regulation Engine
 * "Every new regulation, absorbed and enforced."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Shield, AlertTriangle, FileText, TrendingUp, Globe, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  regulation: { framework_code: string };
}

interface Dashboard {
  totalFrameworks: number;
  overallComplianceScore: number;
  openViolations: { critical: number; high: number; medium: number; low: number; total: number };
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

const DEFAULT_RADAR_EVENTS: RegulatoryRadarEvent[] = [
  {
    id: 'dora-enforcement',
    title: 'DORA enforcement begins for financial entities',
    framework: 'DORA',
    jurisdiction: 'EU',
    window: '60',
    impact: 'CRITICAL',
    effectiveDate: 'In ~45 days',
    description:
      'Operational resilience requirements become enforceable. High expectations for incident reporting and ICT risk management.',
  },
  {
    id: 'ccpa-amendment',
    title: 'CCPA/CPRA enforcement expansion',
    framework: 'CCPA',
    jurisdiction: 'US-CA',
    window: '90',
    impact: 'HIGH',
    effectiveDate: 'In ~75 days',
    description:
      'Broader scope for data subject rights and vendor obligations. Increased enforcement expected for adtech and third parties.',
  },
  {
    id: 'eu-ai-act-phase-2',
    title: 'EU AI Act high-risk obligations phase-in',
    framework: 'EU AI Act',
    jurisdiction: 'EU',
    window: '30',
    impact: 'HIGH',
    effectiveDate: 'In ~30-60 days (phase 2)',
    description:
      'High-risk AI systems must align with transparency, human oversight, and robustness requirements. Significant documentation lift.',
  },
  {
    id: 'privacy-guidance-update',
    title: 'Updated supervisory guidance on cross-border transfers',
    framework: 'GDPR',
    jurisdiction: 'EU',
    window: 'now',
    impact: 'MEDIUM',
    effectiveDate: 'Now',
    description:
      'Regulators tightening expectations around SCCs and transfer impact assessments. Existing templates may need updates.',
  },
];

const DEFAULT_AI_SUMMARY =
  'The highest-impact change in the next 90 days is DORA enforcement for EU financial entities. ' +
  'If your critical services rely on third-party providers, you should prioritize mapping those dependencies and ' +
  'running a focused resilience review now. CCPA/CPRA expansion and the EU AI Act phase-in are close behind, ' +
  'particularly for data-rich and AI-heavy business units.';

const DEFAULT_AI_ACTIONS: string[] = [
  'Map your critical third-party services and vendors to understand DORA exposure.',
  'Run a focused operational resilience review on incident response and ICT risk controls.',
  'Prepare privacy- and AI-heavy business units for CCPA/CPRA expansion and EU AI Act obligations.',
];

export const PanopticonPage: React.FC = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isIngesting, setIsIngesting] = useState(false);
  const [radarEvents, setRadarEvents] = useState<RegulatoryRadarEvent[]>(DEFAULT_RADAR_EVENTS);
  const [aiSummary, setAiSummary] = useState<string>(DEFAULT_AI_SUMMARY);
  const [aiActions, setAiActions] = useState<string[]>(DEFAULT_AI_ACTIONS);
  const [perspective, setPerspective] = useState<'board' | 'operator'>('board');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Persist user preference for perspective
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('dc_panopticon_perspective', perspective);
      } catch {
        // ignore storage errors
      }
    }

    loadRadarInsights(perspective);
  }, [perspective]);

  useEffect(() => {
    if (typeof window === 'undefined') {return;}
    try {
      const stored = window.localStorage.getItem('dc_panopticon_perspective');
      if (stored === 'board' || stored === 'operator') {
        setPerspective(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const loadData = async () => {
    try {
      const [fwRes, regRes, violRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Framework[] }>('/panopticon/frameworks'),
        apiClient.api.get<{ data: Regulation[] }>('/panopticon/regulations'),
        apiClient.api.get<{ data: Violation[] }>('/panopticon/violations'),
        apiClient.api.get<{ data: Dashboard }>('/panopticon/dashboard'),
      ]);

      if (fwRes.success) {setFrameworks((fwRes.data as any)?.data || fwRes.data || []);}
      if (regRes.success) {setRegulations((regRes.data as any)?.data || regRes.data || []);}
      if (violRes.success) {setViolations((violRes.data as any)?.data || violRes.data || []);}
      if (dashRes.success) {setDashboard((dashRes.data as any)?.data || dashRes.data || null);}
    } catch (error) {
      console.error('Failed to load Panopticon data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRadarInsights = async (view: 'board' | 'operator') => {
    try {
      const res = await apiClient.api.get<{
        data?: { events?: RegulatoryRadarEvent[]; summary?: string; actions?: string[] } | RegulatoryRadarEvent[];
      }>('/panopticon/radar', { perspective: view });

      if (res.success && res.data) {
        const payload = ((res.data as any).data ?? res.data) as
          | RegulatoryRadarEvent[]
          | { events?: RegulatoryRadarEvent[]; summary?: string; actions?: string[] };

        if (Array.isArray(payload)) {
          setRadarEvents(payload);
        } else if (payload && Array.isArray(payload.events)) {
          setRadarEvents(payload.events);
          if (typeof payload.summary === 'string') {
            setAiSummary(payload.summary);
          }
          if (Array.isArray(payload.actions)) {
            setAiActions(payload.actions);
          }
        }
      }
    } catch {
    }
  };

  const ingestRegulation = async (code: string) => {
    setIsIngesting(true);
    try {
      await apiClient.api.post('/panopticon/regulations/ingest', { frameworkCode: code });
      await loadData();
    } catch (error) {
      console.error('Ingest failed:', error);
    } finally {
      setIsIngesting(false);
    }
  };

  const categories = [...new Set(frameworks.map(f => f.category))];
  const filteredFrameworks = selectedCategory === 'all' 
    ? frameworks 
    : frameworks.filter(f => f.category === selectedCategory);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getImpactBadgeClasses = (impact: string) => {
    switch (impact) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-200 border border-orange-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40';
      default:
        return 'bg-slate-600/40 text-slate-200 border border-slate-500/40';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Panopticon...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-10 h-10 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaPanopticon™</h1>
            <p className="text-slate-400">Global Regulation Engine - "Every new regulation, absorbed and enforced."</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Compliance Score</div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-bold text-emerald-400">
                {dashboard.overallComplianceScore}%
              </div>
              <div className="flex items-center gap-1 text-sm text-emerald-300">
                <TrendingUp className="w-4 h-4" />
                <span>+3% vs last month</span>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400"
                style={{ width: `${Math.min(100, Math.max(0, dashboard.overallComplianceScore))}%` }}
              />
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Active Frameworks</div>
            <div className="text-3xl font-bold">{regulations.length}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Open Violations</div>
            <div
              className={`text-3xl font-bold ${
                dashboard.openViolations.total > 0 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {dashboard.openViolations.total === 0
                ? '0 ✅'
                : dashboard.openViolations.total}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Critical</div>
            <div className="text-3xl font-bold text-red-500">{dashboard.openViolations.critical}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="text-slate-400 text-sm">Jurisdictions</div>
            <div className="text-3xl font-bold text-blue-400">{dashboard.jurisdictions}</div>
          </div>
        </div>
      )}

      {radarEvents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                {['now', '30', '60', '90'].map(window => (
                  <div key={window} className="space-y-3">
                    {radarEvents
                      .filter(event => event.window === window)
                      .map(event => (
                        <div
                          key={event.id}
                          className="p-3 bg-slate-700/60 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-emerald-300">
                              {event.framework}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${getImpactBadgeClasses(
                                event.impact
                              )}`}
                            >
                              {event.impact}
                            </span>
                          </div>
                          <div
                            className={`text-slate-200 ${
                              event.impact === 'CRITICAL' ? 'text-sm font-semibold' : 'text-xs'
                            }`}
                          >
                            {event.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {event.effectiveDate} 
                            
                            
                            · {event.jurisdiction}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold">AI Assessment</h2>
              </div>
              <select
                value={perspective}
                onChange={(e) => setPerspective((e.target.value as 'board' | 'operator'))}
                className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200"
              >
                <option value="board">Board view</option>
                <option value="operator">Operator view</option>
              </select>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-line">
              {aiSummary}
            </p>
            {aiActions.length > 0 && (
              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Recommended actions
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                  {aiActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework Library */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Regulatory Frameworks ({frameworks.length})
            </h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFrameworks.map(fw => {
              const isActive = regulations.some(r => r.framework_code === fw.code);
              return (
                <div key={fw.code} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{fw.code}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-600 rounded">{fw.jurisdiction}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">{fw.category}</span>
                    </div>
                    <div className="text-sm text-slate-400">{fw.name}</div>
                    <div className="text-xs text-slate-500">{fw.requirements} requirements</div>
                  </div>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-sm">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => ingestRegulation(fw.code)}
                      disabled={isIngesting}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm disabled:opacity-50"
                    >
                      {isIngesting ? 'Ingesting...' : 'Ingest'}
                    </button>
                  )}
                </div>
              );
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
          {violations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
              No open violations
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {violations.map(v => (
                <div key={v.id} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getSeverityColor(v.severity)}`} />
                    <span className="text-sm font-medium">{v.title}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {v.regulation?.framework_code} • {v.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Regulations */}
      <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-400" />
          Active Regulations
        </h2>
        {regulations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No regulations ingested yet. Select frameworks above to ingest.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulations.map(reg => (
              <div key={reg.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-emerald-400">{reg.framework_code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    reg.status === 'ACTIVE' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-600'
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <div className="text-sm text-slate-300">{reg.framework_name}</div>
                <div className="text-xs text-slate-500 mt-1">{reg.jurisdiction}</div>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                  <span>{reg.obligations?.length || 0} obligations</span>
                  <span className={reg.violations?.length > 0 ? 'text-red-400' : ''}>
                    {reg.violations?.length || 0} violations
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanopticonPage;
