// @ts-nocheck
import React, { useState } from 'react';

// Council Modes Configuration
const COUNCIL_MODES = {
  'war-room': {
    id: 'war-room',
    name: 'War Room',
    emoji: '⚔️',
    color: '#EF4444',
    primeDirective: 'Conflict before Consensus',
    description: 'High-stakes strategic decisions with vigorous debate',
    shortDesc: 'Strategic debates'
  },
  'due-diligence': {
    id: 'due-diligence',
    name: 'Due Diligence',
    emoji: '🔍',
    color: '#0F172A',
    primeDirective: 'Verify everything twice',
    description: 'Rigorous analysis where accuracy is paramount',
    shortDesc: 'M&A, investments'
  },
  'innovation-lab': {
    id: 'innovation-lab',
    name: 'Innovation Lab',
    emoji: '💡',
    color: '#10B981',
    primeDirective: 'Yes, and...',
    description: 'Brainstorming where creativity trumps criticism',
    shortDesc: 'Brainstorming'
  },
  'compliance': {
    id: 'compliance',
    name: 'Compliance',
    emoji: '🛡️',
    color: '#F59E0B',
    primeDirective: 'What could go wrong?',
    description: 'Regulatory and risk-focused review',
    shortDesc: 'Regulatory review'
  },
  'crisis': {
    id: 'crisis',
    name: 'Crisis',
    emoji: '🚨',
    color: '#EF4444',
    primeDirective: 'Triage and act',
    description: 'Emergency response with immediate decisions',
    shortDesc: 'Emergencies'
  },
  'execution': {
    id: 'execution',
    name: 'Execution',
    emoji: '🎯',
    color: '#2563EB',
    primeDirective: 'How do we ship this?',
    description: 'Detailed project planning with timelines',
    shortDesc: 'Project planning'
  },
  'research': {
    id: 'research',
    name: 'Research',
    emoji: '🔬',
    color: '#8B5CF6',
    primeDirective: 'Follow the evidence',
    description: 'Data-driven analysis with objectivity',
    shortDesc: 'Data analysis'
  },
  'investment': {
    id: 'investment',
    name: 'Investment',
    emoji: '💰',
    color: '#10B981',
    primeDirective: 'Show me the ROI',
    description: 'Financial analysis for budget decisions',
    shortDesc: 'Budget decisions'
  },
  'stakeholder': {
    id: 'stakeholder',
    name: 'Stakeholder',
    emoji: '🤝',
    color: '#3B82F6',
    primeDirective: 'Who wins, who loses?',
    description: 'People impact and change management',
    shortDesc: 'Change management'
  },
  'rapid': {
    id: 'rapid',
    name: 'Rapid',
    emoji: '⚡',
    color: '#F59E0B',
    primeDirective: 'Decide in 60 seconds',
    description: 'Quick decisions using heuristics',
    shortDesc: 'Quick decisions'
  },
  'advisory': {
    id: 'advisory',
    name: 'Advisory',
    emoji: '🎓',
    color: '#8B5CF6',
    primeDirective: 'Educate, don\'t dictate',
    description: 'Training and framework teaching',
    shortDesc: 'Training'
  },
  'governance': {
    id: 'governance',
    name: 'Governance',
    emoji: '🏛️',
    color: '#0F172A',
    primeDirective: 'Precedent matters',
    description: 'Policy decisions with long-term implications',
    shortDesc: 'Policy creation'
  }
};

// Mode categories for organized display
const MODE_CATEGORIES = {
  'Decision Making': ['war-room', 'rapid', 'governance'],
  'Analysis': ['due-diligence', 'research', 'investment'],
  'Planning': ['execution', 'stakeholder', 'compliance'],
  'Creative': ['innovation-lab', 'advisory', 'crisis']
};

// Compact Mode Selector (Dropdown)
export function CouncilModeSelector({ selectedMode, onModeChange, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const mode = COUNCIL_MODES[selectedMode];

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <span className="text-lg">{mode.emoji}</span>
          <span className="text-white font-medium">{mode.name}</span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50 max-h-96 overflow-y-auto">
            {Object.entries(MODE_CATEGORIES).map(([category, modeIds]) => (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                  {category}
                </div>
                {modeIds.map(modeId => {
                  const m = COUNCIL_MODES[modeId];
                  return (
                    <button
                      key={modeId}
                      onClick={() => { onModeChange(modeId); setIsOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 transition-colors ${selectedMode === modeId ? 'bg-slate-700' : ''}`}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <div className="text-left">
                        <div className="text-white font-medium">{m.name}</div>
                        <div className="text-xs text-slate-400">{m.shortDesc}</div>
                      </div>
                      {selectedMode === modeId && (
                        <svg className="w-4 h-4 text-emerald-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full grid view
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Object.values(COUNCIL_MODES).map(m => (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedMode === m.id 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{m.emoji}</span>
            <span className="font-semibold text-white">{m.name}</span>
          </div>
          <p className="text-xs text-slate-400 italic">"{m.primeDirective}"</p>
          <p className="text-xs text-slate-500 mt-1">{m.shortDesc}</p>
        </button>
      ))}
    </div>
  );
}

// Mode Badge (shows current mode inline)
export function CouncilModeBadge({ modeId }) {
  const mode = COUNCIL_MODES[modeId];
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
    >
      <span>{mode.emoji}</span>
      <span>{mode.name}</span>
    </span>
  );
}

// Mode Info Card (expanded details)
export function CouncilModeCard({ modeId }) {
  const mode = COUNCIL_MODES[modeId];
  return (
    <div 
      className="p-4 rounded-lg border"
      style={{ borderColor: `${mode.color}40`, backgroundColor: `${mode.color}10` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{mode.emoji}</span>
        <div>
          <h3 className="font-bold text-lg text-white">{mode.name} Mode</h3>
          <p className="text-sm italic" style={{ color: mode.color }}>"{mode.primeDirective}"</p>
        </div>
      </div>
      <p className="text-slate-300 text-sm">{mode.description}</p>
    </div>
  );
}

// Complete Council Input with Mode Selector
export function CouncilInput({ onSubmit }) {
  const [query, setQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('war-room');
  const [depth, setDepth] = useState('full'); // 'quick' or 'full'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit({ query, mode: selectedMode, depth });
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          Ask The Council
        </h2>
        <CouncilModeSelector 
          selectedMode={selectedMode} 
          onModeChange={setSelectedMode}
          compact={true}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What decision should The Council deliberate on?"
          className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
          rows={3}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDepth('quick')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                depth === 'quick' 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Quick Answer
            </button>
            <button
              type="button"
              onClick={() => setDepth('full')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                depth === 'full' 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🏛️ Full Deliberation
            </button>
          </div>

          <button
            type="submit"
            disabled={!query.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
          >
            Convene Council →
          </button>
        </div>
      </form>

      <CouncilModeCard modeId={selectedMode} />
    </div>
  );
}

// Demo App
export default function CouncilModesDemo() {
  const [selectedMode, setSelectedMode] = useState('war-room');

  const handleSubmit = ({ query, mode, depth }) => {
    console.log('Council Query:', { query, mode, depth });
    alert(`Submitting to Council in ${COUNCIL_MODES[mode].name} Mode:\n\n"${query}"\n\nDepth: ${depth}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Council Modes</h1>
          <p className="text-slate-400">Programmable Organizational Intelligence</p>
        </div>

        {/* Main Input */}
        <CouncilInput onSubmit={handleSubmit} />

        {/* Mode Grid */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">All Modes</h3>
          <CouncilModeSelector 
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
          />
        </div>

        {/* Selected Mode Details */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Selected Mode</h3>
          <CouncilModeCard modeId={selectedMode} />
        </div>
      </div>
    </div>
  );
}
