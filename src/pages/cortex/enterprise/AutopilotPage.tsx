import { logger } from '../../../lib/logger';
/**
 * Page — Autopilot Page
 *
 * React page component rendered by the router.
 *
 * @exports AutopilotPage
 * @module pages/cortex/enterprise/AutopilotPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA AUTOPILOT™ - SELF-DRIVING ENTERPRISE MODE
// The System Proposes Decisions Automatically, Humans Approve
// "AI-Run Enterprise Territory"
//
// CAPABILITIES:
// - Autonomous decision recommendation engine
// - Human-in-the-loop approval workflows
// - Real-time business condition monitoring
// - Automatic budget adjustments
// - Resource reallocation suggestions
// - Predictive intervention system
// - Escalation-only human involvement
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  enterpriseService,
  AutoDecision,
  AutomationRule,
  SystemHealth,
  DecisionCategory,
} from '../../../services/EnterpriseService';
import { ollamaService } from '../../../lib/ollama';
import api from '../../../lib/api';

// Types imported from EnterpriseService

// =============================================================================
// MOCK DATA
// =============================================================================

const CATEGORY_CONFIG: Record<DecisionCategory, { icon: string; color: string; name: string }> = {
  financial: { icon: '💰', color: 'from-green-600 to-emerald-600', name: 'Financial' },
  operational: { icon: '⚙️', color: 'from-blue-600 to-cyan-600', name: 'Operations' },
  hr: { icon: '👥', color: 'from-purple-600 to-pink-600', name: 'Human Resources' },
  sales: { icon: '📈', color: 'from-amber-600 to-orange-600', name: 'Sales & Revenue' },
  technology: { icon: '💻', color: 'from-indigo-600 to-violet-600', name: 'Technology' },
  risk: { icon: '⚠️', color: 'from-red-600 to-rose-600', name: 'Risk Management' },
  compliance: { icon: '⚖️', color: 'from-teal-600 to-cyan-600', name: 'Compliance' },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AutopilotPage: React.FC = () => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<AutoDecision[]>([]);
  const [automationRules, _setAutomationRules] = useState<AutomationRule[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'decisions' | 'rules' | 'history'>(
    'dashboard'
  );
  const [selectedDecision, setSelectedDecision] = useState<AutoDecision | null>(null);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [_ollamaStatus, setOllamaStatus] = useState({ available: false });

  // Load data from Enterprise Service & API
  const loadData = useCallback(async () => {
    // First try to load from API
    try {
      const [rulesRes, executionsRes] = await Promise.all([
        api.autopilot.getRules(),
        api.autopilot.getExecutions(),
      ]);

      if (rulesRes.success && rulesRes.data) {
        logger.info('[Autopilot] Loaded', rulesRes.data.length, 'rules from database');
      }
      if (executionsRes.success && executionsRes.data) {
        logger.info('[Autopilot] Loaded', executionsRes.data.length, 'executions from database');
      }
    } catch (error) {
      logger.info('[Autopilot] API unavailable, using local service');
    }

    // Fall back to enterprise service
    setDecisions(enterpriseService.getAutoDecisions());
    setSystemHealth(enterpriseService.getSystemHealth());
    setOllamaStatus(ollamaService.getStatus());
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [loadData]);

  const pendingDecisions = decisions.filter((d) => d.status === 'pending');
  const criticalPending = pendingDecisions.filter((d) => d.priority === 'critical');

  const handleApprove = (decisionId: string) => {
    enterpriseService.approveAutoDecision(decisionId, 'Current User');
    loadData();
    setSelectedDecision(null);
  };

  const handleReject = (decisionId: string) => {
    enterpriseService.rejectAutoDecision(decisionId);
    loadData();
    setSelectedDecision(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-amber-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚀</span>
                  <div>
                    <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
                      CENDIAAUTOPILOT<span style={{ fontWeight: 200, fontSize: '0.7em', opacity: 0.5, marginLeft: '2px' }}>™</span>
                    </h1>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-light">Self-Driving Enterprise Mode</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Autopilot Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/60">Autopilot</span>
                <button
                  onClick={() => setAutopilotEnabled(!autopilotEnabled)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    autopilotEnabled ? 'bg-green-600' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                      autopilotEnabled ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span
                  className={`text-sm font-medium ${autopilotEnabled ? 'text-green-400' : 'text-neutral-400'}`}
                >
                  {autopilotEnabled ? 'Active' : 'Paused'}
                </span>
              </div>

              {criticalPending.length > 0 && (
                <div className="px-4 py-2 bg-red-600 rounded-lg animate-pulse">
                  <div className="text-sm font-bold">{criticalPending.length} Critical</div>
                  <div className="text-xs">Awaiting Approval</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* System Health Bar */}
      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b border-amber-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-6 gap-4 text-center">
            <div>
              <div
                className={`text-3xl font-bold ${
                  (systemHealth?.overallScore ?? 0) >= 80
                    ? 'text-green-400'
                    : (systemHealth?.overallScore ?? 0) >= 60
                      ? 'text-amber-400'
                      : 'text-red-400'
                }`}
              >
                {systemHealth?.overallScore ?? 0}%
              </div>
              <div className="text-xs text-amber-300">System Health</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">
                {systemHealth?.pendingDecisions ?? 0}
              </div>
              <div className="text-xs text-amber-300">Pending Decisions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {systemHealth?.autoExecutedToday ?? 0}
              </div>
              <div className="text-xs text-amber-300">Auto-Executed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">
                {systemHealth?.humanApprovedToday ?? 0}
              </div>
              <div className="text-xs text-amber-300">Human Approved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">
                {automationRules.filter((r) => r.enabled).length}
              </div>
              <div className="text-xs text-amber-300">Active Rules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">24/7</div>
              <div className="text-xs text-amber-300">Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-amber-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Command Center', icon: '🎛️' },
              {
                id: 'decisions',
                label: 'Pending Decisions',
                icon: '⏳',
                badge: pendingDecisions.length,
              },
              { id: 'rules', label: 'Automation Rules', icon: '⚙️' },
              { id: 'history', label: 'Decision History', icon: '📜' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-white bg-amber-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-amber-600 rounded-full text-xs">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Critical Decisions Alert */}
            {criticalPending.length > 0 && (
              <div className="bg-red-900/30 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400 animate-pulse">🚨</span> Critical Decisions
                  Requiring Attention
                </h2>
                <div className="space-y-3">
                  {criticalPending.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDecision(d)}
                      className="p-4 bg-red-900/20 rounded-xl border border-red-700/50 cursor-pointer hover:bg-red-900/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                          <div>
                            <h3 className="font-semibold">{d.title}</h3>
                            <p className="text-sm text-white/60">
                              {d.description.slice(0, 100)}...
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-500 transition-colors">
                          Review Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Health */}
            <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
              <h2 className="text-lg font-semibold mb-4">System Health by Category</h2>
              <div className="grid grid-cols-7 gap-4">
                {(systemHealth?.categories ?? []).map((cat) => {
                  const config = CATEGORY_CONFIG[cat.category];
                  return (
                    <div key={cat.category} className="text-center p-4 bg-black/20 rounded-xl">
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}
                      >
                        {config.icon}
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          cat.score >= 80
                            ? 'text-green-400'
                            : cat.score >= 60
                              ? 'text-amber-400'
                              : 'text-red-400'
                        }`}
                      >
                        {Math.round(cat.score)}%
                      </div>
                      <div className="text-xs text-white/50">{config.name}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span
                          className={
                            cat.trend === 'up'
                              ? 'text-green-400'
                              : cat.trend === 'down'
                                ? 'text-red-400'
                                : 'text-white/40'
                          }
                        >
                          {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '→'}
                        </span>
                        {cat.activeDecisions > 0 && (
                          <span className="text-xs px-1.5 py-0.5 bg-amber-600 rounded">
                            {cat.activeDecisions}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recent Auto-Executed Decisions</h3>
                <div className="space-y-3">
                  {decisions
                    .filter((d) => d.status === 'auto-executed')
                    .slice(0, 3)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="p-3 bg-green-900/20 rounded-xl border border-green-700/50"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span>{CATEGORY_CONFIG[d.category].icon}</span>
                          <span className="font-medium text-sm">{d.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-green-600 rounded">Auto</span>
                        </div>
                        <p className="text-xs text-white/60">{d.recommendation}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <h3 className="text-lg font-semibold mb-4">Recently Triggered Rules</h3>
                <div className="space-y-3">
                  {automationRules
                    .filter((r) => r.lastTriggered)
                    .slice(0, 3)
                    .map((r) => (
                      <div key={r.id} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span>{CATEGORY_CONFIG[r.category].icon}</span>
                            <span className="font-medium text-sm">{r.name}</span>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              r.automationLevel === 'full-auto'
                                ? 'bg-green-900 text-green-300'
                                : r.automationLevel === 'semi-auto'
                                  ? 'bg-amber-900 text-amber-300'
                                  : 'bg-blue-900 text-blue-300'
                            }`}
                          >
                            {r.automationLevel}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          Triggered{' '}
                          {Math.floor((Date.now() - (r.lastTriggered?.getTime() || 0)) / 3600000)}h
                          ago • {r.triggerCount} total
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-4">
            {pendingDecisions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
                <p className="text-white/60">No pending decisions require your attention.</p>
              </div>
            ) : (
              pendingDecisions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDecision(d)}
                  className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.01] ${
                    d.priority === 'critical'
                      ? 'border-red-700/50 hover:border-red-500'
                      : d.priority === 'high'
                        ? 'border-amber-700/50 hover:border-amber-500'
                        : 'border-amber-800/50 hover:border-amber-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_CONFIG[d.category].color} flex items-center justify-center text-2xl`}
                      >
                        {CATEGORY_CONFIG[d.category].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{d.title}</h3>
                        <div className="text-sm text-white/50">
                          {CATEGORY_CONFIG[d.category].name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          d.priority === 'critical'
                            ? 'bg-red-600'
                            : d.priority === 'high'
                              ? 'bg-amber-600'
                              : d.priority === 'medium'
                                ? 'bg-blue-600'
                                : 'bg-neutral-600'
                        }`}
                      >
                        {d.priority.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          d.automationLevel === 'full-auto'
                            ? 'bg-green-900 text-green-300'
                            : d.automationLevel === 'semi-auto'
                              ? 'bg-amber-900 text-amber-300'
                              : 'bg-blue-900 text-blue-300'
                        }`}
                      >
                        {d.automationLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4">{d.description}</p>

                  <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-700/30 mb-4">
                    <div className="text-xs text-amber-400 uppercase tracking-wider mb-1">
                      Recommendation
                    </div>
                    <p className="font-medium">{d.recommendation}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {d.impact.slice(0, 3).map((imp, idx) => (
                      <div key={idx} className="text-center p-3 bg-black/20 rounded-xl">
                        <div
                          className={`text-xl font-bold ${imp.projectedChange > 0 ? 'text-green-400' : 'text-red-400'}`}
                        >
                          {imp.projectedChange > 0 ? '+' : ''}
                          {imp.projectedChange}
                          {imp.unit}
                        </div>
                        <div className="text-xs text-white/50">{imp.metric}</div>
                        <div className="text-xs text-white/30">{imp.confidence}% confidence</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="bg-black/30 rounded-2xl p-6 border border-amber-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_CONFIG[rule.category].icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <p className="text-sm text-white/50">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        rule.automationLevel === 'full-auto'
                          ? 'bg-green-900 text-green-300'
                          : rule.automationLevel === 'semi-auto'
                            ? 'bg-amber-900 text-amber-300'
                            : rule.automationLevel === 'approval-required'
                              ? 'bg-blue-900 text-blue-300'
                              : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {rule.automationLevel}
                    </span>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        rule.enabled ? 'bg-green-600' : 'bg-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform ${
                          rule.enabled ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Triggers</div>
                    <div className="space-y-1">
                      {rule.triggers.map((t, idx) => (
                        <div key={idx} className="text-sm font-mono">
                          {t.metric} {t.operator} {t.value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-xl">
                    <div className="text-xs text-white/50 mb-2">Actions</div>
                    <div className="space-y-1">
                      {rule.actions.map((a, idx) => (
                        <div key={idx} className="text-sm">
                          → {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-white/40 mt-4 pt-4 border-t border-amber-800/30">
                  <span>Triggered {rule.triggerCount} times</span>
                  {rule.lastTriggered && (
                    <span>
                      Last: {Math.floor((Date.now() - rule.lastTriggered.getTime()) / 3600000)}h ago
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {decisions
              .filter((d) => d.status !== 'pending')
              .map((d) => (
                <div
                  key={d.id}
                  className={`bg-black/30 rounded-2xl p-6 border ${
                    d.status === 'approved'
                      ? 'border-green-800/50'
                      : d.status === 'auto-executed'
                        ? 'border-blue-800/50'
                        : d.status === 'rejected'
                          ? 'border-red-800/50'
                          : 'border-amber-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{CATEGORY_CONFIG[d.category].icon}</span>
                      <div>
                        <h3 className="font-semibold">{d.title}</h3>
                        <p className="text-sm text-white/50">{d.recommendation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          d.status === 'approved'
                            ? 'bg-green-600'
                            : d.status === 'auto-executed'
                              ? 'bg-blue-600'
                              : d.status === 'rejected'
                                ? 'bg-red-600'
                                : 'bg-amber-600'
                        }`}
                      >
                        {d.status}
                      </span>
                      <div className="text-xs text-white/40 mt-1">
                        {d.approvedAt?.toLocaleDateString() || d.executedAt?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Decision Detail Modal */}
      {selectedDecision && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 rounded-2xl border border-amber-700/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className={`p-6 bg-gradient-to-r ${CATEGORY_CONFIG[selectedDecision.category].color}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {CATEGORY_CONFIG[selectedDecision.category].icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold">{selectedDecision.title}</h2>
                    <p className="text-white/80">
                      {CATEGORY_CONFIG[selectedDecision.category].name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDecision(null)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-white/80">{selectedDecision.description}</p>

              <div className="p-4 bg-amber-900/30 rounded-xl border border-amber-700/30">
                <div className="text-xs text-amber-400 uppercase tracking-wider mb-2">
                  AI Recommendation
                </div>
                <p className="font-semibold text-lg">{selectedDecision.recommendation}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Projected Impact</h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedDecision.impact.map((imp, idx) => (
                    <div key={idx} className="p-4 bg-black/30 rounded-xl text-center">
                      <div
                        className={`text-2xl font-bold ${imp.projectedChange > 0 ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {imp.projectedChange > 0 ? '+' : ''}
                        {imp.projectedChange}
                        {imp.unit}
                      </div>
                      <div className="text-sm text-white/60">{imp.metric}</div>
                      <div className="text-xs text-white/40">{imp.confidence}% confidence</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">AI Reasoning</h4>
                <p className="text-sm text-white/70 p-4 bg-black/30 rounded-xl">
                  {selectedDecision.aiReasoning}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Supporting Data</h4>
                <div className="space-y-2">
                  {selectedDecision.supportingData.map((data, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                    >
                      <span className="text-sm text-white/50">{data.source}</span>
                      <span className="font-medium">{data.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Risks</h4>
                <div className="space-y-2">
                  {selectedDecision.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-900/20 rounded-xl border border-red-700/30"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{risk.description}</span>
                        <span className="text-xs px-2 py-0.5 bg-red-600 rounded">
                          {risk.probability}% probability
                        </span>
                      </div>
                      <p className="text-sm text-white/60">Mitigation: {risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => handleApprove(selectedDecision.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:opacity-90 transition-all"
                >
                  ✅ Approve & Execute
                </button>
                <button
                  onClick={() => handleReject(selectedDecision.id)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl font-semibold hover:opacity-90 transition-all"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutopilotPage;
