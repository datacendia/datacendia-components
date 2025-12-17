// @ts-nocheck
// =============================================================================
// DATACENDIA - LENS SUB-PAGES
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatCurrency, formatNumber } from '../../../../lib/utils';

// =============================================================================
// FORECASTS DETAILS PAGE
// =============================================================================

export const ForecastDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    forecastId
  } = useParams();
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m'>('6m');
  const forecast = stryMutAct_9fa48("47351") ? {} : (stryCov_9fa48("47351"), {
    id: stryMutAct_9fa48("47354") ? forecastId && 'revenue-q1-2026' : stryMutAct_9fa48("47353") ? false : stryMutAct_9fa48("47352") ? true : (stryCov_9fa48("47352", "47353", "47354"), forecastId || 'revenue-q1-2026'),
    name: 'Q1 2026 Revenue Forecast',
    metric: 'Revenue',
    currentValue: 12400000,
    predictedValue: 15200000,
    change: 22.5,
    confidence: 87,
    accuracy: 94,
    horizon: 'Q1 2026',
    model: 'Ensemble (LSTM + Prophet)',
    lastUpdated: new Date(stryMutAct_9fa48("47360") ? Date.now() + 3600000 : (stryCov_9fa48("47360"), Date.now() - 3600000)),
    factors: stryMutAct_9fa48("47361") ? [] : (stryCov_9fa48("47361"), [stryMutAct_9fa48("47362") ? {} : (stryCov_9fa48("47362"), {
      name: 'Historical revenue growth',
      impact: 'positive',
      contribution: 35
    }), stryMutAct_9fa48("47365") ? {} : (stryCov_9fa48("47365"), {
      name: 'Pipeline value',
      impact: 'positive',
      contribution: 28
    }), stryMutAct_9fa48("47368") ? {} : (stryCov_9fa48("47368"), {
      name: 'Seasonal patterns',
      impact: 'positive',
      contribution: 15
    }), stryMutAct_9fa48("47371") ? {} : (stryCov_9fa48("47371"), {
      name: 'Market conditions',
      impact: 'neutral',
      contribution: 12
    }), stryMutAct_9fa48("47374") ? {} : (stryCov_9fa48("47374"), {
      name: 'Churn rate',
      impact: 'negative',
      contribution: stryMutAct_9fa48("47377") ? +10 : (stryCov_9fa48("47377"), -10)
    })]),
    scenarios: stryMutAct_9fa48("47378") ? [] : (stryCov_9fa48("47378"), [stryMutAct_9fa48("47379") ? {} : (stryCov_9fa48("47379"), {
      name: 'Base Case',
      value: 15200000,
      probability: 60
    }), stryMutAct_9fa48("47381") ? {} : (stryCov_9fa48("47381"), {
      name: 'Optimistic',
      value: 17500000,
      probability: 25
    }), stryMutAct_9fa48("47383") ? {} : (stryCov_9fa48("47383"), {
      name: 'Conservative',
      value: 13000000,
      probability: 15
    })])
  });
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={stryMutAct_9fa48("47385") ? () => undefined : (stryCov_9fa48("47385"), () => navigate('/cortex/lens'))} className="text-sm text-neutral-500 hover:text-primary-600 mb-2">
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
          <p className="text-2xl font-bold text-neutral-900">{formatCurrency(forecast.currentValue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-5">
          <p className="text-sm text-neutral-500 mb-1">Predicted</p>
          <p className="text-2xl font-bold text-success-main">{formatCurrency(forecast.predictedValue)}</p>
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
              {(['3m', '6m', '12m'] as const).map(stryMutAct_9fa48("47387") ? () => undefined : (stryCov_9fa48("47387"), range => <button key={range} onClick={stryMutAct_9fa48("47388") ? () => undefined : (stryCov_9fa48("47388"), () => setTimeRange(range))} className={cn('px-3 py-1 rounded text-sm transition-colors', (stryMutAct_9fa48("47392") ? timeRange !== range : stryMutAct_9fa48("47391") ? false : stryMutAct_9fa48("47390") ? true : (stryCov_9fa48("47390", "47391", "47392"), timeRange === range)) ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100')}>
                  {range}
                </button>))}
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
            {forecast.factors.map(stryMutAct_9fa48("47395") ? () => undefined : (stryCov_9fa48("47395"), factor => <div key={factor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', stryMutAct_9fa48("47399") ? factor.impact === 'positive' || 'bg-success-main' : stryMutAct_9fa48("47398") ? false : stryMutAct_9fa48("47397") ? true : (stryCov_9fa48("47397", "47398", "47399"), (stryMutAct_9fa48("47401") ? factor.impact !== 'positive' : stryMutAct_9fa48("47400") ? true : (stryCov_9fa48("47400", "47401"), factor.impact === 'positive')) && 'bg-success-main'), stryMutAct_9fa48("47406") ? factor.impact === 'negative' || 'bg-error-main' : stryMutAct_9fa48("47405") ? false : stryMutAct_9fa48("47404") ? true : (stryCov_9fa48("47404", "47405", "47406"), (stryMutAct_9fa48("47408") ? factor.impact !== 'negative' : stryMutAct_9fa48("47407") ? true : (stryCov_9fa48("47407", "47408"), factor.impact === 'negative')) && 'bg-error-main'), stryMutAct_9fa48("47413") ? factor.impact === 'neutral' || 'bg-warning-main' : stryMutAct_9fa48("47412") ? false : stryMutAct_9fa48("47411") ? true : (stryCov_9fa48("47411", "47412", "47413"), (stryMutAct_9fa48("47415") ? factor.impact !== 'neutral' : stryMutAct_9fa48("47414") ? true : (stryCov_9fa48("47414", "47415"), factor.impact === 'neutral')) && 'bg-warning-main'))} />
                  <span className="text-sm text-neutral-600">{factor.name}</span>
                </div>
                <span className={cn('text-sm font-medium', (stryMutAct_9fa48("47422") ? factor.contribution <= 0 : stryMutAct_9fa48("47421") ? factor.contribution >= 0 : stryMutAct_9fa48("47420") ? false : stryMutAct_9fa48("47419") ? true : (stryCov_9fa48("47419", "47420", "47421", "47422"), factor.contribution > 0)) ? 'text-success-main' : 'text-error-main')}>
                  {(stryMutAct_9fa48("47428") ? factor.contribution <= 0 : stryMutAct_9fa48("47427") ? factor.contribution >= 0 : stryMutAct_9fa48("47426") ? false : stryMutAct_9fa48("47425") ? true : (stryCov_9fa48("47425", "47426", "47427", "47428"), factor.contribution > 0)) ? '+' : ''}{factor.contribution}%
                </span>
              </div>))}
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="mt-6 bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Scenario Comparison</h2>
        <div className="grid grid-cols-3 gap-4">
          {forecast.scenarios.map(stryMutAct_9fa48("47431") ? () => undefined : (stryCov_9fa48("47431"), scenario => <div key={scenario.name} className={cn('p-4 rounded-lg border-2', (stryMutAct_9fa48("47435") ? scenario.name !== 'Base Case' : stryMutAct_9fa48("47434") ? false : stryMutAct_9fa48("47433") ? true : (stryCov_9fa48("47433", "47434", "47435"), scenario.name === 'Base Case')) ? 'border-primary-500 bg-primary-50' : 'border-neutral-200')}>
              <p className="text-sm text-neutral-500">{scenario.name}</p>
              <p className="text-2xl font-bold text-neutral-900">{formatCurrency(scenario.value)}</p>
              <p className="text-sm text-neutral-500">{scenario.probability}% probability</p>
            </div>))}
        </div>
      </div>
    </div>;
};

// =============================================================================
// SCENARIO DETAILS PAGE
// =============================================================================

export const ScenarioDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    scenarioId
  } = useParams();
  const scenario = stryMutAct_9fa48("47440") ? {} : (stryCov_9fa48("47440"), {
    id: stryMutAct_9fa48("47443") ? scenarioId && 'europe-expansion' : stryMutAct_9fa48("47442") ? false : stryMutAct_9fa48("47441") ? true : (stryCov_9fa48("47441", "47442", "47443"), scenarioId || 'europe-expansion'),
    name: 'European Market Expansion',
    status: 'active',
    description: 'Scenario modeling the impact of launching in the European market in Q2 2026',
    createdBy: 'John Smith',
    createdAt: 'Nov 15, 2025',
    assumptions: stryMutAct_9fa48("47450") ? [] : (stryCov_9fa48("47450"), [stryMutAct_9fa48("47451") ? {} : (stryCov_9fa48("47451"), {
      name: 'Initial Investment',
      value: '$15M',
      type: 'financial'
    }), stryMutAct_9fa48("47455") ? {} : (stryCov_9fa48("47455"), {
      name: 'Time to Market',
      value: '6 months',
      type: 'operational'
    }), stryMutAct_9fa48("47459") ? {} : (stryCov_9fa48("47459"), {
      name: 'Hiring Target',
      value: '20 employees',
      type: 'operational'
    }), stryMutAct_9fa48("47463") ? {} : (stryCov_9fa48("47463"), {
      name: 'Year 1 Revenue',
      value: '$8M',
      type: 'financial'
    }), stryMutAct_9fa48("47467") ? {} : (stryCov_9fa48("47467"), {
      name: 'Market Share Target',
      value: '5%',
      type: 'market'
    }), stryMutAct_9fa48("47471") ? {} : (stryCov_9fa48("47471"), {
      name: 'Churn Rate Impact',
      value: '-0.5%',
      type: 'customer'
    }), stryMutAct_9fa48("47475") ? {} : (stryCov_9fa48("47475"), {
      name: 'Currency Risk',
      value: 'Hedged 80%',
      type: 'risk'
    }), stryMutAct_9fa48("47479") ? {} : (stryCov_9fa48("47479"), {
      name: 'Regulatory Compliance',
      value: '3 months',
      type: 'operational'
    })]),
    metrics: stryMutAct_9fa48("47483") ? [] : (stryCov_9fa48("47483"), [stryMutAct_9fa48("47484") ? {} : (stryCov_9fa48("47484"), {
      name: 'Revenue Impact',
      baseline: 48000000,
      scenario: 56000000,
      change: 16.7
    }), stryMutAct_9fa48("47486") ? {} : (stryCov_9fa48("47486"), {
      name: 'Operating Costs',
      baseline: 36000000,
      scenario: 42000000,
      change: 16.7
    }), stryMutAct_9fa48("47488") ? {} : (stryCov_9fa48("47488"), {
      name: 'EBITDA',
      baseline: 12000000,
      scenario: 14000000,
      change: 16.7
    }), stryMutAct_9fa48("47490") ? {} : (stryCov_9fa48("47490"), {
      name: 'Cash Runway',
      baseline: 24,
      scenario: 18,
      change: stryMutAct_9fa48("47492") ? +25 : (stryCov_9fa48("47492"), -25),
      unit: 'months'
    }), stryMutAct_9fa48("47494") ? {} : (stryCov_9fa48("47494"), {
      name: 'Headcount',
      baseline: 150,
      scenario: 170,
      change: 13.3,
      unit: 'people'
    }), stryMutAct_9fa48("47497") ? {} : (stryCov_9fa48("47497"), {
      name: 'Customer Base',
      baseline: 500,
      scenario: 650,
      change: 30,
      unit: 'customers'
    })])
  });
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={stryMutAct_9fa48("47500") ? () => undefined : (stryCov_9fa48("47500"), () => navigate('/cortex/lens'))} className="text-sm text-neutral-500 hover:text-primary-600 mb-2">
            ← Back to Lens
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900">{scenario.name}</h1>
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', (stryMutAct_9fa48("47505") ? scenario.status !== 'active' : stryMutAct_9fa48("47504") ? false : stryMutAct_9fa48("47503") ? true : (stryCov_9fa48("47503", "47504", "47505"), scenario.status === 'active')) ? 'bg-success-light text-success-dark' : 'bg-neutral-100 text-neutral-600')}>
              {scenario.status}
            </span>
          </div>
          <p className="text-neutral-500 mt-1">{scenario.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={stryMutAct_9fa48("47509") ? () => undefined : (stryCov_9fa48("47509"), () => navigate(`/cortex/lens/scenarios/${scenario.id}/edit`))} className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
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
            {scenario.assumptions.map(stryMutAct_9fa48("47511") ? () => undefined : (stryCov_9fa48("47511"), assumption => <div key={assumption.name} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{assumption.name}</p>
                  <span className="text-xs text-neutral-400 capitalize">{assumption.type}</span>
                </div>
                <span className="font-medium text-neutral-900">{assumption.value}</span>
              </div>))}
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
              {scenario.metrics.map(stryMutAct_9fa48("47512") ? () => undefined : (stryCov_9fa48("47512"), metric => <tr key={metric.name} className="border-b border-neutral-100">
                  <td className="py-3 font-medium text-neutral-900">{metric.name}</td>
                  <td className="py-3 text-right text-neutral-600">
                    {metric.unit ? formatNumber(metric.baseline) : formatCurrency(metric.baseline)}
                    {stryMutAct_9fa48("47515") ? metric.unit || ` ${metric.unit}` : stryMutAct_9fa48("47514") ? false : stryMutAct_9fa48("47513") ? true : (stryCov_9fa48("47513", "47514", "47515"), metric.unit && ` ${metric.unit}`)}
                  </td>
                  <td className="py-3 text-right text-neutral-900 font-medium">
                    {metric.unit ? formatNumber(metric.scenario) : formatCurrency(metric.scenario)}
                    {stryMutAct_9fa48("47519") ? metric.unit || ` ${metric.unit}` : stryMutAct_9fa48("47518") ? false : stryMutAct_9fa48("47517") ? true : (stryCov_9fa48("47517", "47518", "47519"), metric.unit && ` ${metric.unit}`)}
                  </td>
                  <td className={cn('py-3 text-right font-medium', (stryMutAct_9fa48("47525") ? metric.change <= 0 : stryMutAct_9fa48("47524") ? metric.change >= 0 : stryMutAct_9fa48("47523") ? false : stryMutAct_9fa48("47522") ? true : (stryCov_9fa48("47522", "47523", "47524", "47525"), metric.change > 0)) ? 'text-success-main' : 'text-error-main')}>
                    {(stryMutAct_9fa48("47531") ? metric.change <= 0 : stryMutAct_9fa48("47530") ? metric.change >= 0 : stryMutAct_9fa48("47529") ? false : stryMutAct_9fa48("47528") ? true : (stryCov_9fa48("47528", "47529", "47530", "47531"), metric.change > 0)) ? '+' : ''}{metric.change}%
                  </td>
                </tr>))}
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
    </div>;
};

// =============================================================================
// SCENARIO BUILDER PAGE
// =============================================================================

export const ScenarioBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    scenarioId
  } = useParams();
  const isNew = stryMutAct_9fa48("47537") ? !scenarioId && scenarioId === 'new' : stryMutAct_9fa48("47536") ? false : stryMutAct_9fa48("47535") ? true : (stryCov_9fa48("47535", "47536", "47537"), (stryMutAct_9fa48("47538") ? scenarioId : (stryCov_9fa48("47538"), !scenarioId)) || (stryMutAct_9fa48("47540") ? scenarioId !== 'new' : stryMutAct_9fa48("47539") ? false : (stryCov_9fa48("47539", "47540"), scenarioId === 'new')));
  const [scenario, setScenario] = useState(stryMutAct_9fa48("47542") ? {} : (stryCov_9fa48("47542"), {
    name: isNew ? '' : 'European Market Expansion',
    description: isNew ? '' : 'Scenario modeling the impact of launching in the European market',
    assumptions: isNew ? stryMutAct_9fa48("47547") ? ["Stryker was here"] : (stryCov_9fa48("47547"), []) : stryMutAct_9fa48("47548") ? [] : (stryCov_9fa48("47548"), [stryMutAct_9fa48("47549") ? {} : (stryCov_9fa48("47549"), {
      id: '1',
      name: 'Initial Investment',
      value: '15000000',
      unit: '$'
    }), stryMutAct_9fa48("47554") ? {} : (stryCov_9fa48("47554"), {
      id: '2',
      name: 'Time to Market',
      value: '6',
      unit: 'months'
    }), stryMutAct_9fa48("47559") ? {} : (stryCov_9fa48("47559"), {
      id: '3',
      name: 'Hiring Target',
      value: '20',
      unit: 'employees'
    })]),
    metrics: stryMutAct_9fa48("47564") ? [] : (stryCov_9fa48("47564"), ['revenue', 'costs', 'ebitda', 'runway'])
  }));
  const [newAssumption, setNewAssumption] = useState(stryMutAct_9fa48("47569") ? {} : (stryCov_9fa48("47569"), {
    name: '',
    value: '',
    unit: ''
  }));
  const addAssumption = () => {
    if (stryMutAct_9fa48("47576") ? newAssumption.name || newAssumption.value : stryMutAct_9fa48("47575") ? false : stryMutAct_9fa48("47574") ? true : (stryCov_9fa48("47574", "47575", "47576"), newAssumption.name && newAssumption.value)) {
      setScenario(stryMutAct_9fa48("47578") ? {} : (stryCov_9fa48("47578"), {
        ...scenario,
        assumptions: stryMutAct_9fa48("47579") ? [] : (stryCov_9fa48("47579"), [...scenario.assumptions, stryMutAct_9fa48("47580") ? {} : (stryCov_9fa48("47580"), {
          ...newAssumption,
          id: Date.now().toString()
        })])
      }));
      setNewAssumption(stryMutAct_9fa48("47581") ? {} : (stryCov_9fa48("47581"), {
        name: '',
        value: '',
        unit: ''
      }));
    }
  };
  const availableMetrics = stryMutAct_9fa48("47585") ? [] : (stryCov_9fa48("47585"), [stryMutAct_9fa48("47586") ? {} : (stryCov_9fa48("47586"), {
    id: 'revenue',
    name: 'Revenue'
  }), stryMutAct_9fa48("47589") ? {} : (stryCov_9fa48("47589"), {
    id: 'costs',
    name: 'Operating Costs'
  }), stryMutAct_9fa48("47592") ? {} : (stryCov_9fa48("47592"), {
    id: 'ebitda',
    name: 'EBITDA'
  }), stryMutAct_9fa48("47595") ? {} : (stryCov_9fa48("47595"), {
    id: 'runway',
    name: 'Cash Runway'
  }), stryMutAct_9fa48("47598") ? {} : (stryCov_9fa48("47598"), {
    id: 'headcount',
    name: 'Headcount'
  }), stryMutAct_9fa48("47601") ? {} : (stryCov_9fa48("47601"), {
    id: 'customers',
    name: 'Customer Base'
  }), stryMutAct_9fa48("47604") ? {} : (stryCov_9fa48("47604"), {
    id: 'churn',
    name: 'Churn Rate'
  }), stryMutAct_9fa48("47607") ? {} : (stryCov_9fa48("47607"), {
    id: 'arpu',
    name: 'ARPU'
  })]);
  return <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={stryMutAct_9fa48("47610") ? () => undefined : (stryCov_9fa48("47610"), () => navigate('/cortex/lens'))} className="text-sm text-neutral-500 hover:text-primary-600 mb-2">
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
            <input type="text" value={scenario.name} onChange={stryMutAct_9fa48("47614") ? () => undefined : (stryCov_9fa48("47614"), e => setScenario(stryMutAct_9fa48("47615") ? {} : (stryCov_9fa48("47615"), {
            ...scenario,
            name: e.target.value
          })))} placeholder="e.g., European Market Expansion" className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea value={scenario.description} onChange={stryMutAct_9fa48("47616") ? () => undefined : (stryCov_9fa48("47616"), e => setScenario(stryMutAct_9fa48("47617") ? {} : (stryCov_9fa48("47617"), {
            ...scenario,
            description: e.target.value
          })))} placeholder="Describe the scenario..." rows={3} className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Assumptions</h2>
        
        {/* Existing Assumptions */}
        <div className="space-y-3 mb-4">
          {scenario.assumptions.map(stryMutAct_9fa48("47618") ? () => undefined : (stryCov_9fa48("47618"), assumption => <div key={assumption.id} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
              <span className="flex-1 font-medium text-neutral-900">{assumption.name}</span>
              <span className="text-neutral-600">
                {stryMutAct_9fa48("47621") ? assumption.unit === '$' || '$' : stryMutAct_9fa48("47620") ? false : stryMutAct_9fa48("47619") ? true : (stryCov_9fa48("47619", "47620", "47621"), (stryMutAct_9fa48("47623") ? assumption.unit !== '$' : stryMutAct_9fa48("47622") ? true : (stryCov_9fa48("47622", "47623"), assumption.unit === '$')) && '$')}{assumption.value}{stryMutAct_9fa48("47628") ? assumption.unit !== '$' || ` ${assumption.unit}` : stryMutAct_9fa48("47627") ? false : stryMutAct_9fa48("47626") ? true : (stryCov_9fa48("47626", "47627", "47628"), (stryMutAct_9fa48("47630") ? assumption.unit === '$' : stryMutAct_9fa48("47629") ? true : (stryCov_9fa48("47629", "47630"), assumption.unit !== '$')) && ` ${assumption.unit}`)}
              </span>
              <button onClick={stryMutAct_9fa48("47633") ? () => undefined : (stryCov_9fa48("47633"), () => setScenario(stryMutAct_9fa48("47634") ? {} : (stryCov_9fa48("47634"), {
            ...scenario,
            assumptions: stryMutAct_9fa48("47635") ? scenario.assumptions : (stryCov_9fa48("47635"), scenario.assumptions.filter(stryMutAct_9fa48("47636") ? () => undefined : (stryCov_9fa48("47636"), a => stryMutAct_9fa48("47639") ? a.id === assumption.id : stryMutAct_9fa48("47638") ? false : stryMutAct_9fa48("47637") ? true : (stryCov_9fa48("47637", "47638", "47639"), a.id !== assumption.id))))
          })))} className="text-neutral-400 hover:text-error-main">
                ✕
              </button>
            </div>))}
        </div>

        {/* Add New */}
        <div className="flex items-center gap-4">
          <input type="text" value={newAssumption.name} onChange={stryMutAct_9fa48("47640") ? () => undefined : (stryCov_9fa48("47640"), e => setNewAssumption(stryMutAct_9fa48("47641") ? {} : (stryCov_9fa48("47641"), {
          ...newAssumption,
          name: e.target.value
        })))} placeholder="Assumption name" className="flex-1 h-10 px-3 border border-neutral-300 rounded-lg" />
          <input type="text" value={newAssumption.value} onChange={stryMutAct_9fa48("47642") ? () => undefined : (stryCov_9fa48("47642"), e => setNewAssumption(stryMutAct_9fa48("47643") ? {} : (stryCov_9fa48("47643"), {
          ...newAssumption,
          value: e.target.value
        })))} placeholder="Value" className="w-32 h-10 px-3 border border-neutral-300 rounded-lg" />
          <input type="text" value={newAssumption.unit} onChange={stryMutAct_9fa48("47644") ? () => undefined : (stryCov_9fa48("47644"), e => setNewAssumption(stryMutAct_9fa48("47645") ? {} : (stryCov_9fa48("47645"), {
          ...newAssumption,
          unit: e.target.value
        })))} placeholder="Unit" className="w-24 h-10 px-3 border border-neutral-300 rounded-lg" />
          <button onClick={addAssumption} className="h-10 px-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800">
            Add
          </button>
        </div>
      </div>

      {/* Metrics to Track */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Metrics to Track</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableMetrics.map(stryMutAct_9fa48("47646") ? () => undefined : (stryCov_9fa48("47646"), metric => <button key={metric.id} onClick={() => {
          const newMetrics = scenario.metrics.includes(metric.id) ? stryMutAct_9fa48("47648") ? scenario.metrics : (stryCov_9fa48("47648"), scenario.metrics.filter(stryMutAct_9fa48("47649") ? () => undefined : (stryCov_9fa48("47649"), m => stryMutAct_9fa48("47652") ? m === metric.id : stryMutAct_9fa48("47651") ? false : stryMutAct_9fa48("47650") ? true : (stryCov_9fa48("47650", "47651", "47652"), m !== metric.id)))) : stryMutAct_9fa48("47653") ? [] : (stryCov_9fa48("47653"), [...scenario.metrics, metric.id]);
          setScenario(stryMutAct_9fa48("47654") ? {} : (stryCov_9fa48("47654"), {
            ...scenario,
            metrics: newMetrics
          }));
        }} className={cn('p-3 rounded-lg border-2 text-sm font-medium transition-colors', scenario.metrics.includes(metric.id) ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300')}>
              {metric.name}
            </button>))}
        </div>
      </div>
    </div>;
};
export default ForecastDetailsPage;