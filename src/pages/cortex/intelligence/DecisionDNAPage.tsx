// =============================================================================
// DATACENDIA - DECISION DNA TIMELINE
// Full lifecycle visualization for enterprise decisions
// "Black Box Flight Recorder" with step-by-step replay
// =============================================================================

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';

interface DecisionEvent {
  id: string;
  timestamp: string;
  type: 'created' | 'context_added' | 'premortem_run' | 'council_session' | 
        'ghost_board' | 'decision_made' | 'outcome_recorded' | 'reopened';
  title: string;
  summary: string;
  data: Record<string, any>;
  userId: string;
  agentsInvolved?: string[];
}

interface Decision {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  budget?: number;
  timeframe?: string;
  timeline: DecisionEvent[];
  preMortems: any[];
  councilSessions: any[];
  ghostBoardSimulations: any[];
  finalDecision?: string;
  decisionMadeAt?: string;
  outcome?: {
    actualResult: string;
    notes: string;
    lessonsLearned: string[];
  };
  auditHash?: string;
}

interface DecisionSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  riskScore?: number;
  eventCount: number;
}

const EVENT_ICONS: Record<string, string> = {
  created: '🎯',
  context_added: '📝',
  premortem_run: '💀',
  council_session: '🏛️',
  ghost_board: '👻',
  decision_made: '✅',
  outcome_recorded: '📊',
  reopened: '🔄',
};

const EVENT_COLORS: Record<string, string> = {
  created: 'bg-blue-500',
  context_added: 'bg-purple-500',
  premortem_run: 'bg-amber-500',
  council_session: 'bg-indigo-500',
  ghost_board: 'bg-pink-500',
  decision_made: 'bg-green-500',
  outcome_recorded: 'bg-teal-500',
  reopened: 'bg-orange-500',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500',
  analyzing: 'bg-amber-500',
  deliberating: 'bg-indigo-500',
  decided: 'bg-green-500',
  implemented: 'bg-teal-500',
  closed: 'bg-neutral-500',
};

export const DecisionDNAPage: React.FC = () => {
  const [decisions, setDecisions] = useState<DecisionSummary[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [replayMode, setReplayMode] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  
  // New decision form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');

  // Load decisions
  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    try {
      const response = await fetch('/api/v1/decisions?organizationId=demo');
      const data = await response.json();
      if (data.success) {
        setDecisions(data.decisions);
      }
    } catch (error) {
      console.error('Failed to load decisions:', error);
    }
  };

  const loadDecision = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/decisions/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedDecision(data.decision);
        setReplayStep(0);
        setReplayMode(false);
      }
    } catch (error) {
      console.error('Failed to load decision:', error);
    }
    setIsLoading(false);
  };

  const createDecision = async () => {
    if (!newTitle.trim() || !newDescription.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('/api/v1/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          budget: newBudget ? parseFloat(newBudget) : undefined,
          timeframe: newTimeframe || undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewTitle('');
        setNewDescription('');
        setNewBudget('');
        setNewTimeframe('');
        loadDecisions();
        loadDecision(data.decision.id);
      }
    } catch (error) {
      console.error('Failed to create decision:', error);
    }
    setIsCreating(false);
  };

  const runPreMortem = async () => {
    if (!selectedDecision) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/decisions/${selectedDecision.id}/premortem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.success) {
        loadDecision(selectedDecision.id);
      }
    } catch (error) {
      console.error('Failed to run pre-mortem:', error);
    }
    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getVisibleEvents = () => {
    if (!selectedDecision) return [];
    if (!replayMode) return selectedDecision.timeline;
    return selectedDecision.timeline.slice(0, replayStep + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🧬</span>
            <h1 className="text-3xl font-bold text-white">Decision DNA</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Full lifecycle tracking with step-by-step replay. Every decision, every analysis, every outcome.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Decision List */}
          <div className="col-span-4 space-y-4">
            {/* Create New Decision */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>➕</span> New Decision
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Decision title..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What decision needs to be made?"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm h-20 resize-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="Budget ($)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                  />
                  <input
                    type="text"
                    value={newTimeframe}
                    onChange={(e) => setNewTimeframe(e.target.value)}
                    placeholder="Timeframe"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                  />
                </div>
                <button
                  onClick={createDecision}
                  disabled={isCreating || !newTitle.trim() || !newDescription.trim()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Decision'}
                </button>
              </div>
            </div>

            {/* Decision List */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>📋</span> Tracked Decisions ({decisions.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {decisions.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No decisions tracked yet. Create one above!
                  </p>
                ) : (
                  decisions.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => loadDecision(d.id)}
                      className={cn(
                        'w-full p-3 rounded-lg border text-left transition-all',
                        selectedDecision?.id === d.id
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-white font-medium text-sm truncate">{d.title}</div>
                          <div className="text-slate-400 text-xs mt-1">
                            {d.eventCount} events • {formatDate(d.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            STATUS_COLORS[d.status] || 'bg-gray-500'
                          )}>
                            {d.status}
                          </span>
                          {d.riskScore !== undefined && (
                            <span className={cn(
                              'text-xs',
                              d.riskScore > 60 ? 'text-red-400' :
                              d.riskScore > 40 ? 'text-yellow-400' :
                              'text-green-400'
                            )}>
                              {d.riskScore}% risk
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Timeline */}
          <div className="col-span-8">
            {!selectedDecision ? (
              <div className="bg-slate-800/50 rounded-xl p-12 border border-slate-700 text-center">
                <span className="text-6xl mb-4 block">🧬</span>
                <h3 className="text-xl font-semibold text-white mb-2">Select or Create a Decision</h3>
                <p className="text-slate-400">
                  Track the full DNA of any business decision - from initial context through analysis to outcome.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Decision Header */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedDecision.title}</h2>
                      <p className="text-slate-400 mt-1">{selectedDecision.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className={cn(
                          'px-2 py-0.5 rounded font-medium',
                          STATUS_COLORS[selectedDecision.status] || 'bg-gray-500'
                        )}>
                          {selectedDecision.status}
                        </span>
                        {selectedDecision.budget && (
                          <span className="text-slate-400">
                            💰 ${selectedDecision.budget.toLocaleString()}
                          </span>
                        )}
                        {selectedDecision.timeframe && (
                          <span className="text-slate-400">
                            📅 {selectedDecision.timeframe}
                          </span>
                        )}
                        {selectedDecision.auditHash && (
                          <span className="text-green-400 text-xs font-mono">
                            🔒 {selectedDecision.auditHash}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={runPreMortem}
                        disabled={isLoading}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        💀 Pre-Mortem
                      </button>
                      <button
                        onClick={() => setReplayMode(!replayMode)}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          replayMode
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        )}
                      >
                        {replayMode ? '⏹️ Exit Replay' : '▶️ Replay'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replay Controls */}
                {replayMode && (
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-medium">
                        🎬 Replay Mode - Step {replayStep + 1} of {selectedDecision.timeline.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setReplayStep(Math.max(0, replayStep - 1))}
                          disabled={replayStep === 0}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm"
                        >
                          ◀ Prev
                        </button>
                        <button
                          onClick={() => setReplayStep(Math.min(selectedDecision.timeline.length - 1, replayStep + 1))}
                          disabled={replayStep >= selectedDecision.timeline.length - 1}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm"
                        >
                          Next ▶
                        </button>
                        <button
                          onClick={() => setReplayStep(selectedDecision.timeline.length - 1)}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm"
                        >
                          ⏭ End
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input
                        type="range"
                        min={0}
                        max={selectedDecision.timeline.length - 1}
                        value={replayStep}
                        onChange={(e) => setReplayStep(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>📜</span> Decision Timeline
                  </h3>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-600" />

                    {/* Events */}
                    <div className="space-y-4">
                      {getVisibleEvents().map((event, idx) => (
                        <div
                          key={event.id}
                          className={cn(
                            'relative pl-14 transition-all',
                            replayMode && idx === replayStep && 'scale-105'
                          )}
                        >
                          {/* Event dot */}
                          <div className={cn(
                            'absolute left-4 w-5 h-5 rounded-full flex items-center justify-center text-xs',
                            EVENT_COLORS[event.type] || 'bg-gray-500',
                            replayMode && idx === replayStep && 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-800'
                          )}>
                            {EVENT_ICONS[event.type] || '📌'}
                          </div>

                          {/* Event card */}
                          <div
                            className={cn(
                              'bg-slate-700/50 rounded-lg p-3 border cursor-pointer transition-all',
                              expandedEvent === event.id
                                ? 'border-blue-500'
                                : 'border-slate-600 hover:border-slate-500'
                            )}
                            onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-white font-medium">{event.title}</div>
                                <div className="text-slate-400 text-sm mt-1">{event.summary}</div>
                              </div>
                              <div className="text-slate-500 text-xs whitespace-nowrap ml-4">
                                {formatDate(event.timestamp)}
                              </div>
                            </div>

                            {/* Expanded data */}
                            {expandedEvent === event.id && event.data && (
                              <div className="mt-3 pt-3 border-t border-slate-600">
                                {event.agentsInvolved && event.agentsInvolved.length > 0 && (
                                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className="text-slate-400 text-xs">Agents:</span>
                                    {event.agentsInvolved.map(agent => (
                                      <span key={agent} className="px-2 py-0.5 bg-slate-600 rounded text-xs text-white">
                                        {agent}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Pre-Mortem formatted view */}
                                {event.type === 'premortem_run' && event.data.failureModes ? (
                                  <div className="space-y-3">
                                    {/* Risk Summary */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div className={cn(
                                          'text-2xl font-bold',
                                          event.data.riskScore >= 70 ? 'text-red-400' :
                                          event.data.riskScore >= 40 ? 'text-amber-400' : 'text-green-400'
                                        )}>
                                          {event.data.riskScore}%
                                        </div>
                                        <div className="text-xs text-slate-400">Risk Score</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                          ${(event.data.totalExposure / 1000000).toFixed(1)}M
                                        </div>
                                        <div className="text-xs text-slate-400">Exposure</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center flex-1">
                                        <div className={cn(
                                          'text-lg font-semibold uppercase',
                                          event.data.recommendation === 'proceed' ? 'text-green-400' :
                                          event.data.recommendation === 'delay' ? 'text-amber-400' : 'text-red-400'
                                        )}>
                                          {event.data.recommendation}
                                        </div>
                                        <div className="text-xs text-slate-400">Recommendation</div>
                                      </div>
                                    </div>

                                    {/* Failure Modes */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Top Failure Modes ({event.data.failureModes.length})
                                      </div>
                                      <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {event.data.failureModes.map((fm: any, i: number) => (
                                          <div key={i} className="p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <div className={cn(
                                                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                                                fm.probability >= 70 ? 'bg-red-500/20 text-red-400' :
                                                fm.probability >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                                              )}>
                                                {fm.probability}%
                                              </div>
                                              <div>
                                                <div className="text-white font-medium">{fm.title}</div>
                                                <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                                                  {fm.category}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-red-400 font-semibold">
                                                ${(fm.costImpact / 1000).toFixed(0)}K
                                              </div>
                                              <div className="text-xs text-slate-500">impact</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <pre className="text-xs text-slate-300 bg-slate-800 rounded p-2 overflow-x-auto max-h-48">
                                    {JSON.stringify(event.data, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-amber-400 text-2xl mb-2">💀</div>
                    <div className="text-white font-semibold">Pre-Mortems</div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.preMortems.length}
                    </div>
                    {selectedDecision.preMortems.length > 0 && (
                      <div className="text-slate-400 text-sm mt-1">
                        Last risk: {selectedDecision.preMortems[selectedDecision.preMortems.length - 1]?.riskScore}%
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-indigo-400 text-2xl mb-2">🏛️</div>
                    <div className="text-white font-semibold">Council Sessions</div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.councilSessions.length}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="text-pink-400 text-2xl mb-2">👻</div>
                    <div className="text-white font-semibold">Board Simulations</div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.ghostBoardSimulations.length}
                    </div>
                  </div>
                </div>

                {/* Audit Export */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">🔒 Audit Export</h3>
                      <p className="text-slate-400 text-sm">
                        Export full decision record for compliance and auditing
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(selectedDecision, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `decision-${selectedDecision.id}-audit.json`;
                        a.click();
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                    >
                      📥 Export JSON
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionDNAPage;
