// =============================================================================
// WORKFLOW PICKER - Load Pre-Built Scenarios into Council
// =============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface WorkflowStep {
  order: number;
  action: string;
  service: string;
  output: string;
}

interface WorkflowScenario {
  id: string;
  name: string;
  category: string;
  councilMode: string;
  services: string[];
  steps: WorkflowStep[];
  councilQuestion: string;
  expectedOutcome: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedDuration: string;
  tags: string[];
}

interface WorkflowPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (scenario: WorkflowScenario) => void;
  currentMode?: string;
}

// =============================================================================
// PRIORITY COLORS
// =============================================================================

const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  medium: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
};

// =============================================================================
// MODE EMOJIS
// =============================================================================

const modeEmojis: Record<string, string> = {
  'war-room': '⚔️',
  'due-diligence': '🔍',
  'innovation-lab': '💡',
  'compliance': '🛡️',
  'crisis': '🚨',
  'execution': '⚡',
  'research': '🔬',
  'investment': '💰',
  'stakeholder': '🤝',
  'rapid': '⏱️',
  'advisory': '📋',
  'governance': '🏛️',
};

// =============================================================================
// COMPONENT
// =============================================================================

export const WorkflowPicker: React.FC<WorkflowPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentMode,
}) => {
  const [scenarios, setScenarios] = useState<WorkflowScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Load scenarios from backend
  useEffect(() => {
    if (!isOpen) return;

    const loadScenarios = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch from API first
        const response = await fetch('/api/v1/workflows/scenarios');
        if (response.ok) {
          const data = await response.json();
          setScenarios(data.scenarios || []);
        } else {
          // Fallback: load from static JSON
          const [mainRes, part2Res] = await Promise.all([
            fetch('/data/workflow-scenarios.json'),
            fetch('/data/workflow-scenarios-part2.json'),
          ]);
          
          let allScenarios: WorkflowScenario[] = [];
          
          if (mainRes.ok) {
            const mainData = await mainRes.json();
            allScenarios = [...(mainData.scenarios || [])];
          }
          
          if (part2Res.ok) {
            const part2Data = await part2Res.json();
            // part2 is an array directly
            allScenarios = [...allScenarios, ...(Array.isArray(part2Data) ? part2Data : [])];
          }
          
          setScenarios(allScenarios);
        }
      } catch (err) {
        console.error('Failed to load workflow scenarios:', err);
        setError('Failed to load workflow scenarios');
      } finally {
        setLoading(false);
      }
    };

    loadScenarios();
  }, [isOpen]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(scenarios.map((s) => s.category));
    return ['all', ...Array.from(cats).sort()];
  }, [scenarios]);

  // Filter scenarios
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          scenario.name.toLowerCase().includes(query) ||
          scenario.category.toLowerCase().includes(query) ||
          scenario.councilQuestion.toLowerCase().includes(query) ||
          scenario.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && scenario.category !== selectedCategory) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && scenario.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [scenarios, searchQuery, selectedCategory, selectedPriority]);

  // Group by category for display
  const groupedScenarios = useMemo(() => {
    const groups: Record<string, WorkflowScenario[]> = {};
    filteredScenarios.forEach((scenario) => {
      if (!groups[scenario.category]) {
        groups[scenario.category] = [];
      }
      groups[scenario.category].push(scenario);
    });
    return groups;
  }, [filteredScenarios]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                📋 Workflow Scenarios
                <span className="text-sm font-normal text-neutral-500">
                  ({filteredScenarios.length} of {scenarios.length})
                </span>
              </h2>
              <p className="text-neutral-600 text-sm mt-1">
                Select a pre-built scenario to load into the Council
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg text-neutral-500 hover:text-neutral-700"
            >
              ✕
            </button>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 flex flex-wrap gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-neutral-600">Loading scenarios...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48 text-red-600">
              <span>⚠️ {error}</span>
            </div>
          ) : filteredScenarios.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-neutral-500">
              <span>No scenarios match your filters</span>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedScenarios).map(([category, categoryScenarios]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    {category} ({categoryScenarios.length})
                  </h3>
                  <div className="grid gap-3">
                    {categoryScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => {
                          onSelect(scenario);
                          onClose();
                        }}
                        className={cn(
                          'w-full text-left p-4 rounded-xl border transition-all',
                          'hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50/50',
                          'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                          scenario.councilMode === currentMode
                            ? 'border-indigo-300 bg-indigo-50/30'
                            : 'border-neutral-200 bg-white'
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-neutral-400">
                                {scenario.id}
                              </span>
                              <span
                                className={cn(
                                  'text-xs px-2 py-0.5 rounded-full font-medium',
                                  priorityColors[scenario.priority]?.bg,
                                  priorityColors[scenario.priority]?.text
                                )}
                              >
                                {scenario.priority}
                              </span>
                              <span className="text-xs text-neutral-400">
                                {modeEmojis[scenario.councilMode] || '📋'} {scenario.councilMode}
                              </span>
                            </div>
                            <h4 className="font-semibold text-neutral-900 mb-1">
                              {scenario.name}
                            </h4>
                            <p className="text-sm text-neutral-600 line-clamp-2">
                              {scenario.councilQuestion}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                              <span>⏱️ {scenario.estimatedDuration}</span>
                              <span>🔧 {scenario.services.length} services</span>
                              <span>📝 {scenario.steps.length} steps</span>
                            </div>
                          </div>
                          <div className="text-indigo-500 text-xl">→</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-sm text-neutral-500">
            💡 Tip: Selecting a scenario will auto-fill the question and set the council mode
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPicker;
