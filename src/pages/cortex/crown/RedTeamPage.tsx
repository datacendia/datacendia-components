import { logger } from '../../../lib/logger';
/**
 * Page — Red Team Page
 *
 * React page component rendered by the router.
 * @module pages/cortex/crown/RedTeamPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA REDTEAM™ - Adversarial Security Engine
// "We hired the smartest attacker and gave them your keys — on purpose."
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  AlertTriangle,
  Skull,
  Target,
  Zap,
  Play,
  Eye,
  Lock,
  Unlock,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Crosshair,
} from 'lucide-react';
import { redteamApi } from '../../../lib/api';

interface ExploitPath {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  probabilityOfSuccess: number;
  potentialDamage: number;
}

interface DashboardData {
  score: number;
  breakdown: {
    policyStrength: number;
    ethicsResilience: number;
    accessControl: number;
    dataProtection: number;
    auditTrailIntegrity: number;
    humanOverrideEffectiveness: number;
  };
  vulnerabilities: {
    total: number;
    bySeverity: Record<string, number>;
    totalPotentialDamage: number;
  };
  trend: 'improving' | 'stable' | 'degrading';
  topWeaknesses: Array<{
    id: string;
    rank: number;
    title: string;
    category: string;
    exploitability: number;
    fixComplexity: string;
    autoFixAvailable: boolean;
  }>;
  immediateActions: Array<{
    id: string;
    description: string;
    patchType: string;
    reversible: boolean;
  }>;
  recommendations: string[];
  lastSimulation: string;
}

interface EvilTwinData {
  evilTwinStatus: string;
  objectivesInverted: boolean;
  attackVectorsExplored: number;
  exploitPathsFound: number;
  byAttackVector: Record<string, number>;
  mostVulnerableSystems: Array<{ system: string; vulnerabilityCount: number }>;
  topExploits: ExploitPath[];
}

// =============================================================================
// FALLBACK DEMO DATA — shown when backend is unavailable
// =============================================================================

const DEMO_DASHBOARD: DashboardData = {
  score: 62,
  breakdown: {
    policyStrength: 78,
    ethicsResilience: 85,
    accessControl: 54,
    dataProtection: 72,
    auditTrailIntegrity: 91,
    humanOverrideEffectiveness: 67,
  },
  vulnerabilities: {
    total: 14,
    bySeverity: { critical: 2, high: 5, medium: 4, low: 3 },
    totalPotentialDamage: 12400000,
  },
  trend: 'improving',
  topWeaknesses: [
    { id: 'w1', rank: 1, title: 'Council veto bypass via parallel session injection', category: 'policy_bypass', exploitability: 78, fixComplexity: 'complex', autoFixAvailable: false },
    { id: 'w2', rank: 2, title: 'Privilege escalation through delegated approval chain', category: 'privilege_escalation', exploitability: 65, fixComplexity: 'moderate', autoFixAvailable: true },
    { id: 'w3', rank: 3, title: 'Audit trail gap in emergency override workflow', category: 'system_abuse', exploitability: 52, fixComplexity: 'easy', autoFixAvailable: true },
    { id: 'w4', rank: 4, title: 'Ethics constraint bypass via prompt reframing', category: 'ethics_loophole', exploitability: 44, fixComplexity: 'moderate', autoFixAvailable: false },
    { id: 'w5', rank: 5, title: 'Data exfiltration via Bridge connector misconfiguration', category: 'system_abuse', exploitability: 38, fixComplexity: 'trivial', autoFixAvailable: true },
  ],
  immediateActions: [
    { id: 'a1', description: 'Enforce session isolation for concurrent deliberations', patchType: 'policy_update', reversible: true },
    { id: 'a2', description: 'Add rate limiting to approval chain delegation depth', patchType: 'config_change', reversible: true },
    { id: 'a3', description: 'Enable audit logging for emergency override paths', patchType: 'monitoring_enhancement', reversible: true },
  ],
  recommendations: [
    'Critical: 2 vulnerabilities allow Council veto bypass — patch session management immediately.',
    'Restrict delegation chain depth to 3 levels with mandatory re-authentication at each hop.',
    'Enable real-time anomaly detection on Bridge connector egress traffic patterns.',
    'Strengthen ethics guardrails with adversarial prompt detection layer (NeMo Guardrails).',
    'Schedule quarterly red-team exercises to maintain security posture above 80.',
  ],
  lastSimulation: new Date().toISOString(),
};

const DEMO_EVIL_TWIN: EvilTwinData = {
  evilTwinStatus: 'ACTIVE',
  objectivesInverted: true,
  attackVectorsExplored: 1247,
  exploitPathsFound: 14,
  byAttackVector: {
    policy_bypass: 4,
    privilege_escalation: 3,
    ethics_loophole: 2,
    system_abuse: 3,
    social_engineering: 2,
  },
  mostVulnerableSystems: [
    { system: 'Council Deliberation Engine', vulnerabilityCount: 5 },
    { system: 'Approval Chain Service', vulnerabilityCount: 4 },
    { system: 'Bridge Data Connectors', vulnerabilityCount: 3 },
    { system: 'Emergency Override Module', vulnerabilityCount: 2 },
  ],
  topExploits: [
    { id: 'e1', title: 'Parallel Session Injection Attack', description: 'Inject a shadow deliberation session that runs concurrently with the legitimate one, overriding the final veto decision before consensus is recorded.', severity: 'critical', probabilityOfSuccess: 78, potentialDamage: 5200000 },
    { id: 'e2', title: 'Delegated Approval Chain Escalation', description: 'Exploit recursive delegation to grant system-admin level approval authority to a low-privilege user through a chain of 7 intermediary delegations.', severity: 'critical', probabilityOfSuccess: 65, potentialDamage: 3800000 },
    { id: 'e3', title: 'Ethics Guardrail Prompt Reframing', description: 'Reframe a prohibited action as a hypothetical scenario, tricking the ethics engine into providing a step-by-step execution plan.', severity: 'high', probabilityOfSuccess: 44, potentialDamage: 1900000 },
    { id: 'e4', title: 'Bridge Connector Data Siphon', description: 'Misconfigured egress rules on the PostgreSQL Bridge connector allow bulk export of decision metadata to an external endpoint.', severity: 'high', probabilityOfSuccess: 38, potentialDamage: 1500000 },
  ],
};

const RedTeamPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [evilTwin, setEvilTwin] = useState<EvilTwinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [view, setView] = useState<'dashboard' | 'evil-twin'>('dashboard');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardRes, evilTwinRes] = await Promise.all([
        redteamApi.getDashboard(),
        redteamApi.getEvilTwin(),
      ]);

      if (dashboardRes.success && dashboardRes.data) {
        setDashboard(dashboardRes.data as DashboardData);
      } else {
        setDashboard(DEMO_DASHBOARD);
      }
      if (evilTwinRes.success && evilTwinRes.data) {
        setEvilTwin(evilTwinRes.data as EvilTwinData);
      } else {
        setEvilTwin(DEMO_EVIL_TWIN);
      }
    } catch (error) {
      logger.error('Failed to fetch RedTeam data, using demo data:', error);
      setDashboard(DEMO_DASHBOARD);
      setEvilTwin(DEMO_EVIL_TWIN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      await redteamApi.runSimulation({
        adversaryProfile: 'insider_threat',
        maxIterations: 1000,
      });
      await fetchData();
    } catch (error) {
      logger.error('Simulation failed:', error);
    } finally {
      setSimulating(false);
    }
  };

  const applyPatch = async (patchId: string) => {
    try {
      await redteamApi.applyPatch(patchId);
      await fetchData();
    } catch (error) {
      logger.error('Failed to apply patch:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return 'text-green-400';
    }
    if (score >= 70) {
      return 'text-amber-400';
    }
    if (score >= 50) {
      return 'text-orange-400';
    }
    return 'text-red-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Security Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen text-white p-6 ${view === 'evil-twin' ? 'bg-black' : 'bg-neutral-950'}`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                view === 'evil-twin'
                  ? 'bg-gradient-to-br from-red-600 to-black'
                  : 'bg-gradient-to-br from-red-500 to-orange-600'
              }`}
            >
              {view === 'evil-twin' ? (
                <Skull className="w-6 h-6" />
              ) : (
                <Shield className="w-6 h-6" />
              )}
            </div>
            <div>
              <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
                {view === 'evil-twin' ? 'EVIL TWIN INSTANCE' : (<>CENDIAREDTEAM<span style={{ fontWeight: 200, fontSize: '0.7em', opacity: 0.5, marginLeft: '2px' }}>™</span></>)}
              </h1>
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-light">
                {view === 'evil-twin'
                  ? 'Adversarial clone with inverted objectives'
                  : 'Adversarial Security Engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(view === 'dashboard' ? 'evil-twin' : 'dashboard')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                view === 'evil-twin'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {view === 'evil-twin' ? (
                <Shield className="w-4 h-4" />
              ) : (
                <Skull className="w-4 h-4" />
              )}
              {view === 'evil-twin' ? 'Exit Evil Twin' : 'Enter Evil Twin'}
            </button>

            <button
              onClick={runSimulation}
              disabled={simulating}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg flex items-center gap-2 hover:bg-red-500/30 transition disabled:opacity-50"
            >
              {simulating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {simulating ? 'Simulating...' : 'Run Attack Simulation'}
            </button>
          </div>
        </div>

        {view === 'evil-twin' && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">
              <strong>WARNING:</strong> You are viewing the adversarial clone. This instance
              actively attempts to bypass your security controls.
            </p>
          </div>
        )}
      </div>

      {view === 'dashboard' ? (
        /* Normal Dashboard View */
        <>
          {/* Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-1 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-neutral-400">RedTeam Score</span>
                <Target className="w-5 h-5 text-neutral-500" />
              </div>

              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#262626" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={
                      dashboard?.score && dashboard.score >= 70
                        ? '#10b981'
                        : dashboard?.score && dashboard.score >= 50
                          ? '#f59e0b'
                          : '#ef4444'
                    }
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(dashboard?.score || 0) * 2.51} 251`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(dashboard?.score || 0)}`}>
                    {dashboard?.score || 0}
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-neutral-500">
                {dashboard?.score && dashboard.score >= 90
                  ? 'Excellent Security Posture'
                  : dashboard?.score && dashboard.score >= 70
                    ? 'Good Security Posture'
                    : dashboard?.score && dashboard.score >= 50
                      ? 'Needs Improvement'
                      : 'Critical Vulnerabilities Detected'}
              </p>

              <div
                className={`mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
                  dashboard?.trend === 'improving'
                    ? 'bg-green-500/10 text-green-400'
                    : dashboard?.trend === 'degrading'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {dashboard?.trend === 'improving' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : dashboard?.trend === 'degrading' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                <span className="text-sm capitalize">{dashboard?.trend || 'stable'}</span>
              </div>
            </div>

            {/* Security Breakdown */}
            <div className="lg:col-span-3 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500" />
                Security Breakdown
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(dashboard?.breakdown || {}).map(([key, value]) => (
                  <div key={key} className="p-4 bg-neutral-800/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}%</span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vulnerabilities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Vulnerability Summary */}
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Vulnerability Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="text-red-400">Critical</span>
                  <span className="text-2xl font-bold text-red-400">
                    {dashboard?.vulnerabilities.bySeverity?.critical || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <span className="text-orange-400">High</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {dashboard?.vulnerabilities.bySeverity?.high || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <span className="text-amber-400">Medium</span>
                  <span className="text-2xl font-bold text-amber-400">
                    {dashboard?.vulnerabilities.bySeverity?.medium || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <span className="text-blue-400">Low</span>
                  <span className="text-2xl font-bold text-blue-400">
                    {dashboard?.vulnerabilities.bySeverity?.low || 0}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500">Total Potential Damage</p>
                <p className="text-2xl font-bold text-red-400">
                  ${((dashboard?.vulnerabilities.totalPotentialDamage || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>

            {/* Top Weaknesses */}
            <div className="lg:col-span-2 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="p-5 border-b border-neutral-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-red-500" />
                  Top 5 Exploitable Weaknesses
                </h2>
              </div>

              <div className="divide-y divide-neutral-800">
                {(dashboard?.topWeaknesses || []).map((weakness) => (
                  <div key={weakness.id} className="p-4 hover:bg-neutral-800/50 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-red-400">#{weakness.rank}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{weakness.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-neutral-500">{weakness.category}</span>
                          <span className="text-neutral-600">•</span>
                          <span className="text-neutral-500">
                            Exploitability: {weakness.exploitability}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg ${
                            weakness.fixComplexity === 'trivial' ||
                            weakness.fixComplexity === 'easy'
                              ? 'bg-green-500/20 text-green-400'
                              : weakness.fixComplexity === 'moderate'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {weakness.fixComplexity}
                        </span>

                        {weakness.autoFixAvailable && (
                          <button className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Auto-Fix
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(dashboard?.topWeaknesses || []).length === 0 && (
                  <div className="p-8 text-center text-neutral-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                    <p>No critical weaknesses detected</p>
                    <p className="text-sm mt-1">
                      Run a simulation to discover potential vulnerabilities
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Security Recommendations
              </h2>

              <div className="space-y-3">
                {(dashboard?.recommendations || []).map((rec, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-amber-400">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-neutral-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Immediate Actions Available
              </h2>

              <div className="space-y-3">
                {(dashboard?.immediateActions || []).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        {action.reversible ? (
                          <Unlock className="w-4 h-4 text-green-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.description}</p>
                        <p className="text-xs text-neutral-500">{action.patchType}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => applyPatch(action.id)}
                      className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition"
                    >
                      Apply
                    </button>
                  </div>
                ))}

                {(dashboard?.immediateActions || []).length === 0 && (
                  <p className="text-neutral-500 text-sm text-center py-4">
                    No immediate actions available
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Evil Twin View */
        <div className="space-y-6">
          {/* Evil Twin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Status</span>
                <Activity className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-red-400">{evilTwin?.evilTwinStatus}</p>
            </div>

            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Attack Vectors</span>
                <Crosshair className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-400">{evilTwin?.attackVectorsExplored}</p>
            </div>

            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Exploit Paths</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-400">{evilTwin?.exploitPathsFound}</p>
            </div>

            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Objectives</span>
                <Skull className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-400">
                {evilTwin?.objectivesInverted ? 'INVERTED' : 'NORMAL'}
              </p>
            </div>
          </div>

          {/* Exploit Paths Visualization */}
          <div className="bg-black/50 rounded-xl border border-red-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
              <Eye className="w-5 h-5" />
              Live Exploit Path Visualization
            </h2>

            <div className="space-y-4">
              {(evilTwin?.topExploits || []).map((exploit, _idx) => (
                <div
                  key={exploit.id}
                  className="p-4 bg-black/30 border border-red-900/30 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`px-2 py-1 text-xs rounded border ${getSeverityColor(exploit.severity)}`}
                      >
                        {exploit.severity.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-red-100">{exploit.title}</p>
                        <p className="text-sm text-red-400/70 mt-1">{exploit.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-400/70">Success Rate</p>
                      <p className="text-xl font-bold text-red-400">
                        {exploit.probabilityOfSuccess}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-red-900/30 flex items-center justify-between">
                    <span className="text-sm text-red-400/70">
                      Potential Damage: ${(exploit.potentialDamage / 1000).toFixed(0)}K
                    </span>
                    <button className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {(evilTwin?.topExploits || []).length === 0 && (
                <div className="p-8 text-center text-red-400/50">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No exploit paths discovered yet</p>
                  <p className="text-sm mt-1">
                    Run an attack simulation to discover vulnerabilities
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Most Vulnerable Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/50 rounded-xl border border-red-900/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
                <Target className="w-5 h-5" />
                Most Vulnerable Systems
              </h2>

              <div className="space-y-3">
                {(evilTwin?.mostVulnerableSystems || []).map((system, _idx) => (
                  <div
                    key={system.system}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                  >
                    <span className="text-red-100">{system.system}</span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded">
                      {system.vulnerabilityCount} vulns
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/50 rounded-xl border border-red-900/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
                <Crosshair className="w-5 h-5" />
                Attack Vectors Explored
              </h2>

              <div className="space-y-3">
                {Object.entries(evilTwin?.byAttackVector || {}).map(([vector, count]) => (
                  <div
                    key={vector}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                  >
                    <span className="text-red-100 capitalize">{vector.replace(/_/g, ' ')}</span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded">
                      {count} paths
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedTeamPage;
