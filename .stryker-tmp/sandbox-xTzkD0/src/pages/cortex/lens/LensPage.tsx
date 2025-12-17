// @ts-nocheck

// =============================================================================
// DATACENDIA - THE LENS PAGE (Enhanced)
// Predictive analytics and scenario simulation with parameters & drivers
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { forecastsApi } from '../../../lib/api';
import { useLanguage } from '../../../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface Simulation {
  id: string;
  name: string;
  code: string;
}

interface ScenarioOutcome {
  id: string;
  type: 'worst' | 'base' | 'mitigated';
  label: string;
  impact: string;
  percentage: number;
  confidence: number;
}

interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

interface KeyDriver {
  id: string;
  name: string;
  impact: number;
  direction: 'positive' | 'negative';
}

// =============================================================================
// SIMULATIONS DATA
// =============================================================================

const simulations: Simulation[] = [
  { id: '1', name: 'Supply Chain Shock', code: 'SUPPLY_CHAIN_SHOCK_09' },
  { id: '2', name: 'Market Downturn', code: 'MARKET_DOWNTURN_03' },
  { id: '3', name: 'Cyber Attack', code: 'CYBER_ATTACK_07' },
  { id: '4', name: 'Regulatory Change', code: 'REG_CHANGE_12' },
];

// =============================================================================
// BRANCHING FORECAST VISUALIZATION (Enhanced with confidence bands)
// =============================================================================

const BranchingForecast: React.FC<{ horizon: number }> = ({ horizon }) => {
  // Adjust path endpoints based on horizon
  const endX = 300 + (horizon / 365) * 250;
  
  return (
    <div className="relative h-64 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
        {/* Confidence band for mitigated */}
        <path
          d={`M 300,100 Q 400,80 ${endX},30 L ${endX},70 Q 400,95 300,100 Z`}
          fill="rgba(34, 197, 94, 0.1)"
          stroke="none"
        />
        
        {/* Confidence band for worst case */}
        <path
          d={`M 300,100 Q 400,120 ${endX},150 L ${endX},190 Q 400,140 300,100 Z`}
          fill="rgba(239, 68, 68, 0.1)"
          stroke="none"
        />
        
        {/* Historical path (dashed) */}
        <path
          d="M 50,100 L 200,100"
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.5"
        />
        
        {/* Baseline label */}
        <text x="80" y="90" fill="#9CA3AF" fontSize="12" fontFamily="monospace">
          BASELINE
        </text>
        
        {/* Time labels */}
        <text x="300" y="195" fill="#6B7280" fontSize="10" textAnchor="middle">NOW</text>
        <text x={endX} y="195" fill="#6B7280" fontSize="10" textAnchor="middle">+{horizon}d</text>
        
        {/* Center point (present) */}
        <circle cx="300" cy="100" r="8" fill="white" stroke="#374151" strokeWidth="2" />
        
        {/* Baseline continuation (dashed) */}
        <path
          d={`M 300,100 L ${endX},100`}
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.5"
        />
        
        {/* Mitigated path (green - going up) */}
        <path
          d={`M 300,100 Q ${300 + (endX - 300) / 2},90 ${endX},50`}
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          className="transition-all duration-500"
        />
        
        {/* Worst case path (red - going down) */}
        <path
          d={`M 300,100 Q ${300 + (endX - 300) / 2},130 ${endX},170`}
          fill="none"
          stroke="#EF4444"
          strokeWidth="3"
          className="transition-all duration-500"
        />
        
        {/* End markers */}
        <circle cx={endX} cy="50" r="4" fill="#22C55E" />
        <circle cx={endX} cy="100" r="4" fill="#6B7280" />
        <circle cx={endX} cy="170" r="4" fill="#EF4444" />
      </svg>
    </div>
  );
};

// =============================================================================
// TIME HORIZON SLIDER
// =============================================================================

const TimeHorizonSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const horizons = [30, 90, 180, 365];
  
  return (
    <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
      <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Time Horizon</p>
      <div className="flex gap-2">
        {horizons.map(h => (
          <button
            key={h}
            onClick={() => onChange(h)}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              value === h
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
            )}
          >
            {h === 365 ? '1yr' : `${h}d`}
          </button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// SIMULATION PARAMETERS PANEL
// =============================================================================

const ParametersPanel: React.FC<{
  parameters: SimulationParameter[];
  onChange: (id: string, value: number) => void;
}> = ({ parameters, onChange }) => (
  <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Simulation Parameters</p>
    <div className="space-y-4">
      {parameters.map(param => (
        <div key={param.id}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-300">{param.name}</span>
            <span className="text-white font-medium">{param.value}{param.unit}</span>
          </div>
          <input
            type="range"
            min={param.min}
            max={param.max}
            value={param.value}
            onChange={(e) => onChange(param.id, Number(e.target.value))}
            className="w-full h-1 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-primary-500"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>{param.min}{param.unit}</span>
            <span>{param.max}{param.unit}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// KEY DRIVERS PANEL
// =============================================================================

const KeyDriversPanel: React.FC<{ drivers: KeyDriver[] }> = ({ drivers }) => (
  <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Key Drivers</p>
    <div className="space-y-3">
      {drivers.map(driver => (
        <div key={driver.id} className="flex items-center gap-3">
          <div className={cn(
            'w-6 h-6 rounded flex items-center justify-center text-xs font-bold',
            driver.direction === 'positive' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          )}>
            {driver.direction === 'positive' ? '↑' : '↓'}
          </div>
          <div className="flex-1">
            <p className="text-sm text-neutral-300">{driver.name}</p>
          </div>
          <div className={cn(
            'text-sm font-medium',
            driver.direction === 'positive' ? 'text-green-400' : 'text-red-400'
          )}>
            {driver.direction === 'positive' ? '+' : ''}{driver.impact}%
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// SCENARIO OUTCOME CARD
// =============================================================================

const OutcomeCard: React.FC<{ outcome: ScenarioOutcome }> = ({ outcome }) => {
  const typeConfig = {
    worst: { border: 'border-red-500', text: 'text-red-400', label: 'WORST CASE' },
    base: { border: 'border-neutral-500', text: 'text-neutral-300', label: 'BASE CASE' },
    mitigated: { border: 'border-neutral-600', text: 'text-neutral-300', label: 'MITIGATED' },
  };
  
  const config = typeConfig[outcome.type];
  const isPositive = outcome.percentage > 0;
  
  return (
    <div className={cn(
      'bg-neutral-800/50 rounded-lg p-4 border-t-2',
      config.border
    )}>
      <p className={cn('text-xs font-semibold uppercase tracking-wider mb-2', config.text)}>
        {config.label}
      </p>
      <p className={cn(
        'text-2xl font-bold',
        outcome.percentage > 0 ? 'text-green-400' : outcome.percentage < -5 ? 'text-red-400' : 'text-neutral-300'
      )}>
        {isPositive ? '+' : ''}{outcome.percentage}% Rev
      </p>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LensPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // State
  const [selectedSimulation, setSelectedSimulation] = useState(simulations[0]);
  const [predictiveMode, setPredictiveMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState(90);
  
  // Simulation parameters
  const [parameters, setParameters] = useState<SimulationParameter[]>([
    { id: '1', name: 'Supply Disruption', value: 25, min: 0, max: 100, unit: '%' },
    { id: '2', name: 'Recovery Time', value: 45, min: 14, max: 180, unit: ' days' },
    { id: '3', name: 'Inventory Buffer', value: 30, min: 0, max: 90, unit: ' days' },
  ]);
  
  // Key drivers
  const [drivers] = useState<KeyDriver[]>([
    { id: '1', name: 'Alternative Supplier Activation', impact: 8, direction: 'positive' },
    { id: '2', name: 'Logistics Cost Increase', impact: -5, direction: 'negative' },
    { id: '3', name: 'Customer Demand Shift', impact: -3, direction: 'negative' },
    { id: '4', name: 'Inventory Optimization', impact: 4, direction: 'positive' },
  ]);
  
  // Scenario outcomes for current simulation
  const [outcomes] = useState<ScenarioOutcome[]>([
    { id: '1', type: 'worst', label: 'Worst Case', impact: 'Revenue decline', percentage: -12, confidence: 75 },
    { id: '2', type: 'base', label: 'Base Case', impact: 'Revenue decline', percentage: -2, confidence: 85 },
    { id: '3', type: 'mitigated', label: 'Mitigated', impact: 'Revenue growth', percentage: 1, confidence: 70 },
  ]);
  
  // Update parameter value
  const handleParameterChange = (id: string, value: number) => {
    setParameters(prev => prev.map(p => p.id === id ? { ...p, value } : p));
  };

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await forecastsApi.getForecasts();
      } catch (err) {
        console.error('Lens load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-full bg-neutral-900 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              SIMULATION:
            </span>
            <select
              value={selectedSimulation.id}
              onChange={(e) => {
                const sim = simulations.find(s => s.id === e.target.value);
                if (sim) {setSelectedSimulation(sim);}
              }}
              className="bg-transparent text-white font-mono text-lg border-none focus:ring-0 cursor-pointer"
            >
              {simulations.map(sim => (
                <option key={sim.id} value={sim.id} className="bg-neutral-800">
                  {sim.code}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setPredictiveMode(!predictiveMode)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
              predictiveMode 
                ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            )}
          >
            PREDICTIVE MODE
          </button>
        </div>

        {/* ================================================================= */}
        {/* BRANCHING FORECAST VISUALIZATION */}
        {/* ================================================================= */}
        <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-6 mb-6">
          <BranchingForecast horizon={timeHorizon} />
        </div>

        {/* ================================================================= */}
        {/* SCENARIO OUTCOMES */}
        {/* ================================================================= */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {outcomes.map(outcome => (
            <OutcomeCard key={outcome.id} outcome={outcome} />
          ))}
        </div>

        {/* ================================================================= */}
        {/* CONTROLS ROW */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Time Horizon */}
          <TimeHorizonSlider value={timeHorizon} onChange={setTimeHorizon} />
          
          {/* Simulation Parameters */}
          <ParametersPanel parameters={parameters} onChange={handleParameterChange} />
          
          {/* Key Drivers */}
          <KeyDriversPanel drivers={drivers} />
        </div>

        {/* ================================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================================= */}
        <div className="flex flex-wrap gap-3">
          {/* Present to Council - Primary Integration */}
          <button
            onClick={() => {
              const summary = `Analyze the ${selectedSimulation.name} scenario with ${timeHorizon}-day horizon. ` +
                `Parameters: ${parameters.map(p => `${p.name}: ${p.value}${p.unit}`).join(', ')}. ` +
                `Key drivers: ${drivers.map(d => `${d.name} (${d.impact > 0 ? '+' : ''}${d.impact}%)`).join(', ')}. ` +
                `Outcomes: Worst ${outcomes[0].percentage}%, Base ${outcomes[1].percentage}%, Mitigated ${outcomes[2].percentage}%.`;
              navigate(`/cortex/council?q=${encodeURIComponent(summary)}&mode=due-diligence`);
            }}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 rounded-lg text-sm text-white font-medium hover:from-primary-500 hover:to-primary-400 transition-all flex items-center gap-2"
          >
            🧠 Present to Council
          </button>
          <button
            onClick={() => navigate('/cortex/lens/scenarios/new')}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            + New Scenario
          </button>
          <button
            onClick={() => navigate('/cortex/lens/forecast/all')}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            View All Scenarios →
          </button>
          <button
            onClick={() => {
              // Export simulation report
              const report = {
                timestamp: new Date().toISOString(),
                simulation: selectedSimulation,
                timeHorizon: timeHorizon,
                parameters: parameters.map(p => ({ name: p.name, value: p.value, unit: p.unit })),
                outcomes: outcomes.map(o => ({ type: o.type, label: o.label, percentage: o.percentage })),
                drivers: drivers.map(d => ({ name: d.name, impact: d.impact, direction: d.direction })),
              };
              const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `simulation-${selectedSimulation.code}-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            Export Report
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              // Simulate running analysis
              setTimeout(() => {
                setIsLoading(false);
                alert(`Analysis complete for ${selectedSimulation.name}!\n\nWorst Case: ${outcomes[0].percentage}%\nBase Case: ${outcomes[1].percentage}%\nMitigated: ${outcomes[2].percentage}%`);
              }, 1500);
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 rounded-lg text-sm text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running...' : 'Run Analysis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LensPage;
