// =============================================================================
// DATACENDIA - LENS SUB-PAGES
// =============================================================================

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatCurrency, formatNumber } from '../../../../lib/utils';

// =============================================================================
// FORECASTS DETAILS PAGE
// =============================================================================

export const ForecastDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { forecastId } = useParams();
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');

  const forecast = {
    id: forecastId || 'revenue-q1-2026',
    name: 'Q1 2026 Revenue Forecast',
    metric: 'Revenue',
    currentValue: 12400000,
    predictedValue: 15200000,
    change: 22.5,
    confidence: 87,
    accuracy: 94,
    horizon: 'Q1 2026',
    model: 'Ensemble (LSTM + Prophet)',
    lastUpdated: new Date(Date.now() - 3600000),
    factors: [
      { name: 'Historical revenue growth', impact: 'positive', contribution: 35 },
      { name: 'Pipeline value', impact: 'positive', contribution: 28 },
      { name: 'Seasonal patterns', impact: 'positive', contribution: 15 },
      { name: 'Market conditions', impact: 'neutral', contribution: 12 },
      { name: 'Churn rate', impact: 'negative', contribution: -10 },
    ],
    scenarios: [
      { name: 'Base Case', value: 15200000, probability: 60 },
      { name: 'Optimistic', value: 17500000, probability: 25 },
      { name: 'Conservative', value: 13000000, probability: 15 },
    ],
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/cortex/lens')}
            className="text-sm text-neutral-500 hover:text-primary-600 mb-2"
          >
            ← Back to Lens
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">{forecast.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
            Export
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Run What-If
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Current</p>
          <p className="text-2xl font-bold text-neutral-900">
            {formatCurrency(forecast.currentValue)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Predicted</p>
          <p className="text-2xl font-bold text-success-main">
            {formatCurrency(forecast.predictedValue)}
          </p>
          <p className="text-sm text-success-main">↑ {forecast.change}%</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Confidence</p>
          <p className="text-2xl font-bold text-neutral-900">{forecast.confidence}%</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Historical Accuracy</p>
          <p className="text-2xl font-bold text-neutral-900">{forecast.accuracy}%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Forecast Trend</h2>
            <div className="flex items-center gap-2">
              {(['3m', '6m', '12m'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-3 py-1 rounded text-sm transition-colors',
                    timeRange === range
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-center justify-center text-neutral-400 border border-dashed border-neutral-200 rounded-lg">
            [Forecast Chart - Integrate with Recharts]
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contributing Factors</h2>
          <div className="space-y-3">
            {forecast.factors.map((factor) => (
              <div key={factor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      factor.impact === 'positive' && 'bg-success-main',
                      factor.impact === 'negative' && 'bg-error-main',
                      factor.impact === 'neutral' && 'bg-warning-main'
                    )}
                  />
                  <span className="text-sm text-neutral-600">{factor.name}</span>
                </div>
                <span
                  className={cn(
                    'text-sm font-medium',
                    factor.contribution > 0 ? 'text-success-main' : 'text-error-main'
                  )}
                >
                  {factor.contribution > 0 ? '+' : ''}
                  {factor.contribution}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="mt-6 bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Scenario Comparison</h2>
        <div className="grid grid-cols-3 gap-4">
          {forecast.scenarios.map((scenario) => (
            <div
              key={scenario.name}
              className={cn(
                'p-4 rounded-lg border-2',
                scenario.name === 'Base Case'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200'
              )}
            >
              <p className="text-sm text-neutral-500">{scenario.name}</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatCurrency(scenario.value)}
              </p>
              <p className="text-sm text-neutral-500">{scenario.probability}% probability</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SCENARIO DETAILS PAGE
// =============================================================================

export const ScenarioDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { scenarioId } = useParams();

  const scenario = {
    id: scenarioId || 'europe-expansion',
    name: 'European Market Expansion',
    status: 'active',
    description: 'Scenario modeling the impact of launching in the European market in Q2 2026',
    createdBy: 'John Smith',
    createdAt: 'Nov 15, 2025',
    assumptions: [
      { name: 'Initial Investment', value: '$15M', type: 'financial' },
      { name: 'Time to Market', value: '6 months', type: 'operational' },
      { name: 'Hiring Target', value: '20 employees', type: 'operational' },
      { name: 'Year 1 Revenue', value: '$8M', type: 'financial' },
      { name: 'Market Share Target', value: '5%', type: 'market' },
      { name: 'Churn Rate Impact', value: '-0.5%', type: 'customer' },
      { name: 'Currency Risk', value: 'Hedged 80%', type: 'risk' },
      { name: 'Regulatory Compliance', value: '3 months', type: 'operational' },
    ],
    metrics: [
      { name: 'Revenue Impact', baseline: 48000000, scenario: 56000000, change: 16.7 },
      { name: 'Operating Costs', baseline: 36000000, scenario: 42000000, change: 16.7 },
      { name: 'EBITDA', baseline: 12000000, scenario: 14000000, change: 16.7 },
      { name: 'Cash Runway', baseline: 24, scenario: 18, change: -25, unit: 'months' },
      { name: 'Headcount', baseline: 150, scenario: 170, change: 13.3, unit: 'people' },
      { name: 'Customer Base', baseline: 500, scenario: 650, change: 30, unit: 'customers' },
    ],
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/cortex/lens')}
            className="text-sm text-neutral-500 hover:text-primary-600 mb-2"
          >
            ← Back to Lens
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">{scenario.name}</h1>
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium capitalize',
                scenario.status === 'active'
                  ? 'bg-success-light text-success-dark'
                  : 'bg-neutral-100 text-neutral-600'
              )}
            >
              {scenario.status}
            </span>
          </div>
          <p className="text-neutral-500 mt-1">{scenario.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/cortex/lens/scenarios/${scenario.id}/edit`)}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50"
          >
            Edit Scenario
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Run Analysis
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Assumptions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Assumptions</h2>
          <div className="space-y-3">
            {scenario.assumptions.map((assumption) => (
              <div
                key={assumption.name}
                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">{assumption.name}</p>
                  <span className="text-xs text-neutral-400 capitalize">{assumption.type}</span>
                </div>
                <span className="font-medium text-neutral-900">{assumption.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Impact Analysis</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 text-sm font-medium text-neutral-500">Metric</th>
                <th className="text-right py-2 text-sm font-medium text-neutral-500">Baseline</th>
                <th className="text-right py-2 text-sm font-medium text-neutral-500">Scenario</th>
                <th className="text-right py-2 text-sm font-medium text-neutral-500">Change</th>
              </tr>
            </thead>
            <tbody>
              {scenario.metrics.map((metric) => (
                <tr key={metric.name} className="border-b border-neutral-100">
                  <td className="py-3 font-medium text-neutral-900">{metric.name}</td>
                  <td className="py-3 text-right text-neutral-600">
                    {metric.unit ? formatNumber(metric.baseline) : formatCurrency(metric.baseline)}
                    {metric.unit && ` ${metric.unit}`}
                  </td>
                  <td className="py-3 text-right text-neutral-900 font-medium">
                    {metric.unit ? formatNumber(metric.scenario) : formatCurrency(metric.scenario)}
                    {metric.unit && ` ${metric.unit}`}
                  </td>
                  <td
                    className={cn(
                      'py-3 text-right font-medium',
                      metric.change > 0 ? 'text-success-main' : 'text-error-main'
                    )}
                  >
                    {metric.change > 0 ? '+' : ''}
                    {metric.change}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualization */}
      <div className="mt-6 bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Visual Comparison</h2>
        <div className="h-64 flex items-center justify-center text-neutral-400 border border-dashed border-neutral-200 rounded-lg">
          [Scenario Comparison Chart - Integrate with Recharts]
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SCENARIO BUILDER PAGE
// =============================================================================

export const ScenarioBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const isNew = !scenarioId || scenarioId === 'new';

  const [scenario, setScenario] = useState({
    name: isNew ? '' : 'European Market Expansion',
    description: isNew ? '' : 'Scenario modeling the impact of launching in the European market',
    assumptions: isNew
      ? []
      : [
          { id: '1', name: 'Initial Investment', value: '15000000', unit: '$' },
          { id: '2', name: 'Time to Market', value: '6', unit: 'months' },
          { id: '3', name: 'Hiring Target', value: '20', unit: 'employees' },
        ],
    metrics: ['revenue', 'costs', 'ebitda', 'runway'],
  });

  const [newAssumption, setNewAssumption] = useState({ name: '', value: '', unit: '' });

  const addAssumption = () => {
    if (newAssumption.name && newAssumption.value) {
      setScenario({
        ...scenario,
        assumptions: [...scenario.assumptions, { ...newAssumption, id: Date.now().toString() }],
      });
      setNewAssumption({ name: '', value: '', unit: '' });
    }
  };

  const availableMetrics = [
    { id: 'revenue', name: 'Revenue' },
    { id: 'costs', name: 'Operating Costs' },
    { id: 'ebitda', name: 'EBITDA' },
    { id: 'runway', name: 'Cash Runway' },
    { id: 'headcount', name: 'Headcount' },
    { id: 'customers', name: 'Customer Base' },
    { id: 'churn', name: 'Churn Rate' },
    { id: 'arpu', name: 'ARPU' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/cortex/lens')}
            className="text-sm text-neutral-500 hover:text-primary-600 mb-2"
          >
            ← Back to Lens
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">
            {isNew ? 'Create Scenario' : 'Edit Scenario'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
            Save Draft
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Save & Run
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Scenario Name</label>
            <input
              type="text"
              value={scenario.name}
              onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
              placeholder="e.g., European Market Expansion"
              className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              value={scenario.description}
              onChange={(e) => setScenario({ ...scenario, description: e.target.value })}
              placeholder="Describe the scenario..."
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Assumptions</h2>

        {/* Existing Assumptions */}
        <div className="space-y-3 mb-4">
          {scenario.assumptions.map((assumption) => (
            <div
              key={assumption.id}
              className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
            >
              <span className="flex-1 font-medium text-neutral-900">{assumption.name}</span>
              <span className="text-neutral-600">
                {assumption.unit === '$' && '$'}
                {assumption.value}
                {assumption.unit !== '$' && ` ${assumption.unit}`}
              </span>
              <button
                onClick={() =>
                  setScenario({
                    ...scenario,
                    assumptions: scenario.assumptions.filter((a) => a.id !== assumption.id),
                  })
                }
                className="text-neutral-400 hover:text-error-main"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add New */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newAssumption.name}
            onChange={(e) => setNewAssumption({ ...newAssumption, name: e.target.value })}
            placeholder="Assumption name"
            className="flex-1 h-10 px-3 border border-neutral-300 rounded-lg"
          />
          <input
            type="text"
            value={newAssumption.value}
            onChange={(e) => setNewAssumption({ ...newAssumption, value: e.target.value })}
            placeholder="Value"
            className="w-32 h-10 px-3 border border-neutral-300 rounded-lg"
          />
          <input
            type="text"
            value={newAssumption.unit}
            onChange={(e) => setNewAssumption({ ...newAssumption, unit: e.target.value })}
            placeholder="Unit"
            className="w-24 h-10 px-3 border border-neutral-300 rounded-lg"
          />
          <button
            onClick={addAssumption}
            className="h-10 px-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
          >
            Add
          </button>
        </div>
      </div>

      {/* Metrics to Track */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Metrics to Track</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => {
                const newMetrics = scenario.metrics.includes(metric.id)
                  ? scenario.metrics.filter((m) => m !== metric.id)
                  : [...scenario.metrics, metric.id];
                setScenario({ ...scenario, metrics: newMetrics });
              }}
              className={cn(
                'p-3 rounded-lg border-2 text-sm font-medium transition-colors',
                scenario.metrics.includes(metric.id)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              )}
            >
              {metric.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastDetailsPage;
