// =============================================================================
// WORKFLOW PICKER - Load Pre-Built Scenarios into Council
// With Dynamic Variable Customization
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

interface DetectedVariable {
  id: string;
  type: 'quarter' | 'year' | 'amount' | 'percentage' | 'duration' | 'count' | 'date' | 'text';
  originalValue: string;
  currentValue: string;
  label: string;
  options: string[] | undefined;
  pattern: RegExp;
}

// =============================================================================
// CURRENCY OPTIONS
// =============================================================================

const CURRENCY_OPTIONS = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '¥', code: 'CNY', name: 'Chinese Yuan' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  { symbol: 'CHF', code: 'CHF', name: 'Swiss Franc' },
  { symbol: 'kr', code: 'SEK', name: 'Swedish Krona' },
  { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' },
  { symbol: '₩', code: 'KRW', name: 'South Korean Won' },
  { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar' },
  { symbol: 'HK$', code: 'HKD', name: 'Hong Kong Dollar' },
  { symbol: 'zł', code: 'PLN', name: 'Polish Złoty' },
  { symbol: 'R', code: 'ZAR', name: 'South African Rand' },
  { symbol: '₪', code: 'ILS', name: 'Israeli Shekel' },
  { symbol: 'د.إ', code: 'AED', name: 'UAE Dirham' },
  { symbol: 'ر.س', code: 'SAR', name: 'Saudi Riyal' },
  { symbol: '₱', code: 'PHP', name: 'Philippine Peso' },
];

// Extract currency symbol from amount string
function extractCurrency(amount: string): { symbol: string; value: string } {
  // Match currency symbols at the start
  const match = amount.match(/^([^\d\s,]+)\s*([\d,]+(?:\.\d+)?[KMB]?)$/);
  if (match && match[1] && match[2]) {
    return { symbol: match[1], value: match[2] };
  }
  // Default: assume $ if no symbol found
  const numMatch = amount.match(/([\d,]+(?:\.\d+)?[KMB]?)/);
  return { symbol: '$', value: numMatch && numMatch[1] ? numMatch[1] : amount };
}

// Combine currency symbol with value
function formatCurrencyAmount(symbol: string, value: string): string {
  return `${symbol}${value}`;
}

// =============================================================================
// VARIABLE TOOLTIPS
// =============================================================================

const VARIABLE_TOOLTIPS: Record<DetectedVariable['type'], { description: string; hint: string }> = {
  quarter: {
    description: 'Fiscal quarter of the year',
    hint: 'Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)',
  },
  year: {
    description: 'Calendar or fiscal year',
    hint: 'Select the year this scenario applies to',
  },
  amount: {
    description: 'Monetary value',
    hint: 'Use K for thousands, M for millions, B for billions (e.g., $4.2M)',
  },
  percentage: {
    description: 'Percentage value',
    hint: 'Enter as a number with % sign (e.g., 15%, 7.5%)',
  },
  duration: {
    description: 'Time period',
    hint: 'Format: number + unit (e.g., 90 days, 6 months, 2 weeks)',
  },
  count: {
    description: 'Quantity or number of items',
    hint: 'Enter a whole number',
  },
  date: {
    description: 'Specific month and year',
    hint: 'Format: Month Year (e.g., January 2025, Dec 2024)',
  },
  text: {
    description: 'Free-form text',
    hint: 'Enter any text value',
  },
};

// =============================================================================
// VARIABLE DETECTION PATTERNS
// =============================================================================

const VARIABLE_PATTERNS: { type: DetectedVariable['type']; pattern: RegExp; label: string; options?: string[] }[] = [
  // Quarters: Q1, Q2, Q3, Q4
  { type: 'quarter', pattern: /\b(Q[1-4])\b/g, label: 'Quarter', options: ['Q1', 'Q2', 'Q3', 'Q4'] },
  // Years: 2024, 2025, etc.
  { type: 'year', pattern: /\b(20[2-3][0-9])\b/g, label: 'Year', options: ['2024', '2025', '2026', '2027'] },
  // Dollar amounts: $4.2M, $380K, $1.5B, $50,000
  { type: 'amount', pattern: /(\$[\d,]+(?:\.\d+)?[KMB]?|\$[\d,]+)/g, label: 'Amount' },
  // Percentages: 12%, 15.5%
  { type: 'percentage', pattern: /(\d+(?:\.\d+)?%)/g, label: 'Percentage' },
  // Durations: 90 days, 2 weeks, 6 months, 1 year
  { type: 'duration', pattern: /(\d+\s+(?:days?|weeks?|months?|years?|hours?))/gi, label: 'Duration' },
  // Counts: 12 vendor contracts, 5 candidates
  { type: 'count', pattern: /(\d+)\s+(vendor|contract|candidate|employee|customer|supplier|partner|project|team|department)/gi, label: 'Count' },
  // Dates: January 2025, Dec 2024
  { type: 'date', pattern: /\b((?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+20[2-3][0-9])\b/gi, label: 'Date' },
];

// Extract variables from text
function extractVariables(text: string): DetectedVariable[] {
  const variables: DetectedVariable[] = [];
  const seen = new Set<string>();

  VARIABLE_PATTERNS.forEach(({ type, pattern, label, options }) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      const value = match[1] || match[0];
      const key = `${type}-${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        variables.push({
          id: `var-${variables.length}`,
          type,
          originalValue: value,
          currentValue: value,
          label: `${label}: ${value}`,
          options,
          pattern: new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        });
      }
    }
  });

  return variables;
}

// Apply variable substitutions to text
function applyVariables(text: string, variables: DetectedVariable[]): string {
  let result = text;
  variables.forEach((v) => {
    if (v.currentValue !== v.originalValue) {
      result = result.replace(v.pattern, v.currentValue);
    }
  });
  return result;
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
  
  // Customization state
  const [customizingScenario, setCustomizingScenario] = useState<WorkflowScenario | null>(null);
  const [variables, setVariables] = useState<DetectedVariable[]>([]);

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
                          // Extract variables and open customization step
                          const detectedVars = extractVariables(scenario.councilQuestion);
                          if (detectedVars.length > 0) {
                            setCustomizingScenario(scenario);
                            setVariables(detectedVars);
                          } else {
                            // No variables to customize, select directly
                            onSelect(scenario);
                            onClose();
                          }
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

      {/* ================================================================= */}
      {/* CUSTOMIZATION MODAL */}
      {/* ================================================================= */}
      {customizingScenario && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    ⚙️ Customize Scenario
                  </h2>
                  <p className="text-neutral-600 text-sm mt-1">
                    Adjust the values below to customize this workflow for your needs
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCustomizingScenario(null);
                    setVariables([]);
                  }}
                  className="p-2 hover:bg-white/50 rounded-lg text-neutral-500 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scenario Info */}
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-neutral-400">{customizingScenario.id}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  priorityColors[customizingScenario.priority]?.bg,
                  priorityColors[customizingScenario.priority]?.text
                )}>
                  {customizingScenario.priority}
                </span>
              </div>
              <h3 className="font-semibold text-neutral-900">{customizingScenario.name}</h3>
            </div>

            {/* Variables Editor */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {variables.map((variable, idx) => {
                  const tooltip = VARIABLE_TOOLTIPS[variable.type];
                  return (
                    <div key={variable.id} className="group">
                      <div className="flex items-center gap-4">
                        {/* Label with tooltip */}
                        <div className="w-36 relative">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-600">
                            {variable.type === 'quarter' && '📅'}
                            {variable.type === 'year' && '📆'}
                            {variable.type === 'amount' && '💰'}
                            {variable.type === 'percentage' && '📊'}
                            {variable.type === 'duration' && '⏱️'}
                            {variable.type === 'count' && '🔢'}
                            {variable.type === 'date' && '📅'}
                            {variable.type === 'text' && '📝'}
                            <span>{variable.type.charAt(0).toUpperCase() + variable.type.slice(1)}</span>
                            {/* Info icon with tooltip */}
                            <div className="relative inline-block">
                              <span className="text-neutral-400 hover:text-neutral-600 cursor-help text-xs">ⓘ</span>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-neutral-800 text-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                                <div className="text-xs font-medium mb-1">{tooltip.description}</div>
                                <div className="text-[10px] text-neutral-300">{tooltip.hint}</div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Input field */}
                        <div className="flex-1">
                          {variable.options ? (
                            <select
                              value={variable.currentValue}
                              onChange={(e) => {
                                const newVars = [...variables];
                                newVars[idx] = { ...variable, currentValue: e.target.value };
                                setVariables(newVars);
                              }}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              title={tooltip.hint}
                            >
                              {variable.options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : variable.type === 'amount' ? (
                            // Special currency + amount input
                            <div className="flex gap-2">
                              <select
                                value={extractCurrency(variable.currentValue).symbol}
                                onChange={(e) => {
                                  const { value } = extractCurrency(variable.currentValue);
                                  const newVars = [...variables];
                                  newVars[idx] = { ...variable, currentValue: formatCurrencyAmount(e.target.value, value) };
                                  setVariables(newVars);
                                }}
                                className="w-24 px-2 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                title="Select currency"
                              >
                                {CURRENCY_OPTIONS.map((curr) => (
                                  <option key={curr.code} value={curr.symbol}>
                                    {curr.symbol} {curr.code}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={extractCurrency(variable.currentValue).value}
                                onChange={(e) => {
                                  const { symbol } = extractCurrency(variable.currentValue);
                                  const newVars = [...variables];
                                  newVars[idx] = { ...variable, currentValue: formatCurrencyAmount(symbol, e.target.value) };
                                  setVariables(newVars);
                                }}
                                placeholder="e.g., 4.2M, 380K"
                                title={tooltip.hint}
                                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-neutral-400 placeholder:text-xs"
                              />
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={variable.currentValue}
                              onChange={(e) => {
                                const newVars = [...variables];
                                newVars[idx] = { ...variable, currentValue: e.target.value };
                                setVariables(newVars);
                              }}
                              placeholder={tooltip.hint}
                              title={tooltip.hint}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-neutral-400 placeholder:text-xs"
                            />
                          )}
                        </div>
                        
                        {/* Original value badge */}
                        <div className="text-xs text-neutral-400 w-24 text-right">
                          <span className="bg-neutral-100 px-2 py-1 rounded">was: {variable.originalValue}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-neutral-100 rounded-xl">
                <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Preview
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {applyVariables(customizingScenario.councilQuestion, variables)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setCustomizingScenario(null);
                  setVariables([]);
                }}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // Reset to original values
                    setVariables(variables.map(v => ({ ...v, currentValue: v.originalValue })));
                  }}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    // Apply customizations and select
                    const customizedScenario = {
                      ...customizingScenario,
                      councilQuestion: applyVariables(customizingScenario.councilQuestion, variables),
                    };
                    onSelect(customizedScenario);
                    setCustomizingScenario(null);
                    setVariables([]);
                    onClose();
                  }}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium"
                >
                  Load Scenario →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowPicker;
