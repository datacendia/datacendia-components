// @ts-nocheck
import React, { useState, useEffect } from 'react';

/**
 * Custom Council Mode Builder
 * Allows users to create, edit, and save custom Council Modes
 */

// Default mode template
const DEFAULT_MODE_TEMPLATE = {
  id: '',
  name: '',
  emoji: '🏛️',
  color: '#2563EB',
  primeDirective: '',
  description: '',
  useCases: ['', '', ''],
  leadAgent: 'chief',
  agentBehaviors: ['', '', ''],
  processSteps: [
    { name: 'Analysis', description: '' },
    { name: 'Discussion', description: '' },
    { name: 'Synthesis', description: '' }
  ],
  outputFormat: '',
  tone: '',
  systemPrompt: ''
};

// Available emojis for modes
const MODE_EMOJIS = [
  '⚔️', '🔍', '💡', '🛡️', '🚨', '🎯', '🔬', '💰', '🤝', '⚡', '🎓', '🏛️',
  '🚀', '📊', '🔧', '💎', '🌟', '🎪', '🏆', '🎭', '📈', '🔮', '⚖️', '🧭',
  '🎨', '🔐', '📋', '🗂️', '💼', '🎯', '🔥', '❄️', '🌊', '⛰️', '🌈', '☀️'
];

// Available colors
const MODE_COLORS = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Green', value: '#10B981' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Slate', value: '#0F172A' },
  { name: 'Cyan', value: '#06B6D4' }
];

// Available lead agents
const LEAD_AGENTS = [
  { id: 'chief', name: 'Chief Strategy Agent', description: 'Orchestrates and synthesizes' },
  { id: 'cfo', name: 'CFO Agent', description: 'Financial focus' },
  { id: 'coo', name: 'COO Agent', description: 'Operations focus' },
  { id: 'ciso', name: 'CISO Agent', description: 'Security & compliance focus' },
  { id: 'cmo', name: 'CMO Agent', description: 'Marketing & growth focus' },
  { id: 'cto', name: 'CTO Agent', description: 'Technology focus' },
  { id: 'chro', name: 'CHRO Agent', description: 'People & culture focus' },
  { id: 'cro', name: 'CRO Agent', description: 'Revenue focus' },
  { id: 'cdo', name: 'CDO Agent', description: 'Data focus' },
  { id: 'risk', name: 'Risk Agent', description: 'Risk assessment focus' }
];

// Tone presets
const TONE_PRESETS = [
  { name: 'Confrontational', description: 'Agents challenge each other aggressively' },
  { name: 'Collaborative', description: 'Agents build on each other\'s ideas' },
  { name: 'Analytical', description: 'Data-driven, objective, evidence-based' },
  { name: 'Urgent', description: 'Fast, decisive, action-oriented' },
  { name: 'Cautious', description: 'Risk-aware, conservative, thorough' },
  { name: 'Educational', description: 'Patient, explanatory, teaching' },
  { name: 'Formal', description: 'Professional, documented, precedent-aware' }
];

// Generate system prompt from mode configuration
function generateSystemPrompt(mode) {
  const agentBehaviors = mode.agentBehaviors.filter(b => b.trim()).map(b => `- ${b}`).join('\n');
  const processSteps = mode.processSteps.filter(s => s.description.trim()).map((s, i) => 
    `${i + 1}. **${s.name}:** ${s.description}`
  ).join('\n');
  const useCases = mode.useCases.filter(u => u.trim()).map(u => `- ${u}`).join('\n');

  return `### ROLE: The Council ${mode.name}

### OBJECTIVE: ${mode.description}

### THE PRIME DIRECTIVE: "${mode.primeDirective}"
${agentBehaviors ? `\nAgent Behaviors:\n${agentBehaviors}` : ''}

### THE PROCESS:
${processSteps || '1. Analysis\n2. Discussion\n3. Synthesis'}

### USE CASES:
${useCases || '- General queries'}

### OUTPUT FORMAT:
${mode.outputFormat || 'Standard deliberation format with domain analysis, cross-examination, and synthesis.'}

### TONE:
${mode.tone || 'Professional and balanced'}

### LEAD AGENT: ${LEAD_AGENTS.find(a => a.id === mode.leadAgent)?.name || 'Chief Strategy Agent'}

### CURRENT CONTEXT:
The user has asked: {USER_QUERY}

Execute ${mode.name} Deliberation.`;
}

// Validate mode configuration
function validateMode(mode) {
  const errors = [];
  
  if (!mode.name || mode.name.trim().length < 2) {
    errors.push('Mode name must be at least 2 characters');
  }
  
  if (!mode.primeDirective || mode.primeDirective.trim().length < 5) {
    errors.push('Prime directive is required (at least 5 characters)');
  }
  
  if (!mode.description || mode.description.trim().length < 10) {
    errors.push('Description is required (at least 10 characters)');
  }
  
  if (mode.useCases.filter(u => u.trim()).length < 1) {
    errors.push('At least one use case is required');
  }
  
  // Generate ID from name if not set
  if (!mode.id && mode.name) {
    mode.id = mode.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  
  return { valid: errors.length === 0, errors };
}

// Main Builder Component
export function CustomModeBuilder({ existingMode, onSave, onCancel }) {
  const [mode, setMode] = useState(existingMode || DEFAULT_MODE_TEMPLATE);
  const [activeTab, setActiveTab] = useState('basics');
  const [errors, setErrors] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Update mode field
  const updateField = (field, value) => {
    setMode(prev => ({ ...prev, [field]: value }));
  };

  // Update array field
  const updateArrayField = (field, index, value) => {
    setMode(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Add item to array field
  const addArrayItem = (field, defaultValue = '') => {
    setMode(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  // Remove item from array field
  const removeArrayItem = (field, index) => {
    setMode(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Update process step
  const updateProcessStep = (index, key, value) => {
    setMode(prev => ({
      ...prev,
      processSteps: prev.processSteps.map((step, i) => 
        i === index ? { ...step, [key]: value } : step
      )
    }));
  };

  // Handle save
  const handleSave = () => {
    const validation = validateMode(mode);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    // Generate system prompt
    const finalMode = {
      ...mode,
      systemPrompt: generateSystemPrompt(mode)
    };
    
    onSave(finalMode);
  };

  // Tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basics':
        return (
          <div className="space-y-6">
            {/* Name and Emoji */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mode Name *</label>
                <input
                  type="text"
                  value={mode.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Customer Focus"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Emoji</label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-800 border border-slate-700 rounded-lg max-h-24 overflow-y-auto">
                  {MODE_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => updateField('emoji', emoji)}
                      className={`text-xl p-1 rounded hover:bg-slate-700 ${mode.emoji === emoji ? 'bg-blue-600' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
              <div className="flex gap-2">
                {MODE_COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => updateField('color', color.value)}
                    className={`w-8 h-8 rounded-full border-2 ${mode.color === color.value ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Prime Directive */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prime Directive *</label>
              <input
                type="text"
                value={mode.primeDirective}
                onChange={(e) => updateField('primeDirective', e.target.value)}
                placeholder="e.g., Customer first, always"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 mt-1">The one-sentence philosophy that guides this mode</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
              <textarea
                value={mode.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe when and why to use this mode..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Lead Agent */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Lead Agent</label>
              <select
                value={mode.leadAgent}
                onChange={(e) => updateField('leadAgent', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {LEAD_AGENTS.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} - {agent.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'behavior':
        return (
          <div className="space-y-6">
            {/* Agent Behaviors */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Agent Behaviors</label>
              <p className="text-xs text-slate-500 mb-3">How should agents interact in this mode?</p>
              {mode.agentBehaviors.map((behavior, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={behavior}
                    onChange={(e) => updateArrayField('agentBehaviors', index, e.target.value)}
                    placeholder={`e.g., CFO must approve all budget implications`}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeArrayItem('agentBehaviors', index)}
                    className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('agentBehaviors', '')}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add behavior
              </button>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {TONE_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => updateField('tone', `${preset.name}: ${preset.description}`)}
                    className={`p-2 text-left text-sm rounded-lg border ${
                      mode.tone.includes(preset.name) 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-medium text-white">{preset.name}</div>
                    <div className="text-xs text-slate-500">{preset.description}</div>
                  </button>
                ))}
              </div>
              <textarea
                value={mode.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                placeholder="Describe the communication style..."
                rows={2}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-6">
            {/* Process Steps */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Deliberation Process</label>
              <p className="text-xs text-slate-500 mb-3">Define the steps agents follow in this mode</p>
              {mode.processSteps.map((step, index) => (
                <div key={index} className="p-4 bg-slate-800 rounded-lg border border-slate-700 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-500 font-mono text-sm">{index + 1}.</span>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateProcessStep(index, 'name', e.target.value)}
                      placeholder="Step name"
                      className="flex-1 px-3 py-1 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    {mode.processSteps.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('processSteps', index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                    placeholder="Describe what happens in this step..."
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => addArrayItem('processSteps', { name: '', description: '' })}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add step
              </button>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Output Format</label>
              <textarea
                value={mode.outputFormat}
                onChange={(e) => updateField('outputFormat', e.target.value)}
                placeholder="Describe the expected output format (tables, lists, sections, etc.)..."
                rows={4}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        );

      case 'usecases':
        return (
          <div className="space-y-6">
            {/* Use Cases */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Use Cases *</label>
              <p className="text-xs text-slate-500 mb-3">When should users select this mode?</p>
              {mode.useCases.map((useCase, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={useCase}
                    onChange={(e) => updateArrayField('useCases', index, e.target.value)}
                    placeholder={`e.g., Customer escalations`}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  {mode.useCases.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('useCases', index)}
                      className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('useCases', '')}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add use case
              </button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            {/* Mode Card Preview */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mode Card Preview</label>
              <div 
                className="p-4 rounded-lg border"
                style={{ borderColor: `${mode.color}40`, backgroundColor: `${mode.color}10` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{mode.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg text-white">{mode.name || 'Mode Name'}</h3>
                    <p className="text-sm italic" style={{ color: mode.color }}>
                      "{mode.primeDirective || 'Prime directive goes here'}"
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{mode.description || 'Description goes here'}</p>
              </div>
            </div>

            {/* Generated System Prompt */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Generated System Prompt</label>
              <pre className="p-4 bg-slate-900 rounded-lg text-xs text-slate-400 overflow-x-auto max-h-96 whitespace-pre-wrap">
                {generateSystemPrompt(mode)}
              </pre>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mode.emoji}</span>
          <div>
            <h2 className="font-bold text-white">
              {existingMode ? 'Edit Mode' : 'Create Custom Mode'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode.name || 'New Mode'}
            </p>
          </div>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'basics', label: 'Basics' },
          { id: 'behavior', label: 'Behavior' },
          { id: 'process', label: 'Process' },
          { id: 'usecases', label: 'Use Cases' },
          { id: 'preview', label: 'Preview' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {renderTabContent()}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="px-6 py-3 bg-red-900/20 border-t border-red-900/50">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-400">• {error}</p>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          {existingMode ? 'Save Changes' : 'Create Mode'}
        </button>
      </div>
    </div>
  );
}

// Mode Library Component (manages all custom modes)
export function CustomModeLibrary({ customModes, onAddMode, onEditMode, onDeleteMode }) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingMode, setEditingMode] = useState(null);

  const handleSave = (mode) => {
    if (editingMode) {
      onEditMode(mode);
    } else {
      onAddMode(mode);
    }
    setShowBuilder(false);
    setEditingMode(null);
  };

  const handleEdit = (mode) => {
    setEditingMode(mode);
    setShowBuilder(true);
  };

  if (showBuilder) {
    return (
      <CustomModeBuilder
        existingMode={editingMode}
        onSave={handleSave}
        onCancel={() => { setShowBuilder(false); setEditingMode(null); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Custom Modes</h3>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Mode
        </button>
      </div>

      {customModes.length === 0 ? (
        <div className="p-8 text-center bg-slate-800/50 rounded-lg border border-slate-700 border-dashed">
          <p className="text-slate-400 mb-2">No custom modes yet</p>
          <p className="text-sm text-slate-500">Create a mode tailored to your organization's decision-making style</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customModes.map(mode => (
            <div 
              key={mode.id}
              className="p-4 rounded-lg border bg-slate-800/50"
              style={{ borderColor: `${mode.color}40` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{mode.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-white">{mode.name}</h4>
                    <p className="text-xs italic" style={{ color: mode.color }}>"{mode.primeDirective}"</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(mode)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteMode(mode.id)}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400">{mode.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {mode.useCases.filter(u => u).slice(0, 3).map((useCase, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-400">
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomModeBuilder;
