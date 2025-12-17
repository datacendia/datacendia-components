// =============================================================================
// DATACENDIA - THE COUNCIL PAGE (Real Ollama Integration)
// =============================================================================

// File: src/pages/cortex/council/CouncilPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';
import { councilApi } from '../../../lib/api';
import { ollamaService, type DomainAgent } from '../../../lib/ollama';
import { sovereignApi, enterpriseApi, vaultApi } from '../../../lib/sovereignApi';
import {
  COUNCIL_MODES,
  MODE_CATEGORIES,
  CORE_MODES,
  isCoreMode,
  type CouncilMode,
} from '../../../data/councilModes';
import { useLanguage } from '@/contexts/LanguageContext';
import PremiumFeaturesModal from '../../../components/premium/PremiumFeaturesModal';
import { usePremiumFeatures } from '../../../hooks/usePremiumFeatures';
import { PageGuide, GUIDES } from '../../../components/PageGuide';
import { WorkflowPicker } from '../../../components/council/WorkflowPicker';

// =============================================================================
// TYPES
// =============================================================================

interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
  // Premium add-on fields
  premium?: boolean;
  premiumPackage?: string;
  premiumPrice?: string;
  // Custom agent fields
  isCustom?: boolean;
  systemPrompt?: string;
}

interface Deliberation {
  id: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  phase: string;
  agents: string[];
  startedAt: Date;
  completedAt?: Date;
  confidence?: number;
}

interface AgentResponse {
  agentId: string;
  agentName: string;
  agentAvatar: string;
  agentColor: string;
  agentRole: string;
  response: string;
  duration: number;
  isStreaming?: boolean;
}

interface CrossExamination {
  challengerId: string;
  challengerName: string;
  challengerAvatar: string;
  challengerColor: string;
  targetId: string;
  targetName: string;
  challenge: string;
  rebuttal: string;
}

interface QueryResult {
  id: string;
  query: string;
  response: string; // Final synthesis
  confidence: number;
  agents: { id: string; name: string }[];
  agentResponses: AgentResponse[]; // Individual agent responses
  crossExaminations: CrossExamination[]; // Cross-examination threads
  answeredAt: Date;
  mode: 'quick' | 'deliberation';
  currentPhase?: string;
}

// Agent colors by code
const agentColors: Record<string, string> = {
  chief: '#6366F1',
  cfo: '#10B981',
  coo: '#F59E0B',
  ciso: '#EF4444',
  cmo: '#EC4899',
  cro: '#8B5CF6',
  cdo: '#06B6D4',
  risk: '#F97316',
};

// Agent avatars by code
const agentAvatars: Record<string, string> = {
  chief: '👔',
  cfo: '💰',
  coo: '⚙️',
  ciso: '🔒',
  cmo: '📢',
  cro: '📈',
  cdo: '📊',
  risk: '⚠️',
};

// =============================================================================
// EMOJI PICKER FOR CUSTOM AGENTS
// =============================================================================
const AGENT_EMOJIS = [
  '🧠',
  '💡',
  '🎯',
  '📊',
  '💼',
  '🔧',
  '⚡',
  '🌟',
  '🎨',
  '📈',
  '🔬',
  '🏆',
  '🛡️',
  '⚙️',
  '💰',
  '📋',
  '🔎',
  '🎓',
  '🌐',
  '🤝',
  '📱',
  '🖥️',
  '🔐',
  '📦',
  '🚀',
  '💎',
  '🏭',
  '🌱',
  '⚖️',
  '🔔',
  '📝',
  '🎪',
  '🧪',
  '🔮',
  '🎭',
  '🏛️',
  '🌍',
  '🤖',
  '👤',
  '👥',
];

const AGENT_COLORS = [
  '#6366F1',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#14B8A6',
  '#3B82F6',
  '#A855F7',
  '#22C55E',
  '#0EA5E9',
  '#D946EF',
  '#84CC16',
  '#F43F5E',
  '#7C3AED',
  '#0D9488',
];

// =============================================================================
// CUSTOM AGENT CREATOR MODAL
// =============================================================================
const CustomAgentCreator: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  onDelete?: (agentId: string) => void;
  editingAgent: Agent | null;
  t: (key: string) => string;
}> = ({ isOpen, onClose, onSave, onDelete, editingAgent, t }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [expertise, setExpertise] = useState('');
  const [avatar, setAvatar] = useState('🧠');
  const [color, setColor] = useState('#6366F1');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapability, setNewCapability] = useState('');

  // Load editing agent data
  useEffect(() => {
    if (editingAgent) {
      setName(editingAgent.name);
      setRole(editingAgent.role);
      setDescription(editingAgent.description);
      setAvatar(editingAgent.avatar);
      setColor(editingAgent.color);
      setCapabilities(editingAgent.capabilities || []);
      // Extract expertise from system prompt if custom agent
      const customData = (editingAgent as any).systemPrompt;
      if (customData) {
        setExpertise(customData);
      }
    } else {
      // Reset form
      setName('');
      setRole('');
      setDescription('');
      setExpertise('');
      setAvatar('🧠');
      setColor('#6366F1');
      setCapabilities([]);
    }
  }, [editingAgent, isOpen]);

  const addCapability = () => {
    if (newCapability.trim() && capabilities.length < 6) {
      setCapabilities([...capabilities, newCapability.trim()]);
      setNewCapability('');
    }
  };

  const removeCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || !role.trim()) {
      return;
    }

    const agent: Agent & { systemPrompt?: string; isCustom?: boolean } = {
      id: editingAgent?.id || `custom-agent-${Date.now()}`,
      code: editingAgent?.code || `custom-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      description: description.trim() || `Custom agent: ${role}`,
      avatar,
      color,
      status: 'online',
      capabilities: capabilities.length > 0 ? capabilities : [role],
      isCustom: true,
      systemPrompt:
        expertise.trim() ||
        `You are ${name}, a custom AI agent. Your role is: ${role}. ${description}`,
    };

    onSave(agent as Agent);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-neutral-900">
                  {editingAgent
                    ? t('council.customAgent.editTitle')
                    : `✨ ${t('council.customAgent.title')}`}
                </h2>
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ⭐ PREMIUM
                </span>
              </div>
              <p className="text-neutral-600">{t('council.customAgent.subtitle')}</p>
              <p className="text-xs text-purple-600 font-medium mt-1">
                Agent Builder Pack • $199/month
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg text-neutral-500">
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Avatar & Color Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.avatar')}
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-lg max-h-32 overflow-y-auto">
                {AGENT_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={cn(
                      'w-10 h-10 text-xl rounded-lg flex items-center justify-center transition-all',
                      avatar === emoji
                        ? 'bg-primary-500 shadow-md scale-110'
                        : 'bg-white hover:bg-neutral-100'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.color')}
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-lg">
                {AGENT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'w-10 h-10 rounded-lg transition-all',
                      color === c ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110' : ''
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-neutral-50 rounded-xl flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${color}20` }}
            >
              {avatar}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{name || 'Agent Name'}</h3>
              <p className="text-sm text-neutral-500">{role || 'Agent Role'}</p>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.name')} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Market Analyst"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.role')} *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Market Research & Analysis"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={100}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              {t('council.customAgent.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('council.customAgent.descriptionPlaceholder')}
              rows={2}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              maxLength={200}
            />
          </div>

          {/* Expertise / System Prompt */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              {t('council.customAgent.expertise')}
            </label>
            <textarea
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="Define the agent's expertise, knowledge areas, and how it should respond..."
              rows={5}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm"
            />
          </div>

          {/* Capabilities */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Capabilities (up to 6)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCapability()}
                placeholder="e.g., Market Analysis"
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={30}
              />
              <button
                onClick={addCapability}
                disabled={capabilities.length >= 6}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2"
                >
                  {cap}
                  <button onClick={() => removeCapability(i)} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
          <div>
            {editingAgent && onDelete && (
              <button
                onClick={() => {
                  if (confirm('Delete this custom agent?')) {
                    onDelete(editingAgent.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Delete Agent
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !role.trim()}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 font-medium"
            >
              {editingAgent ? 'Save Changes' : 'Create Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// Agent Card with translations
const AgentCard: React.FC<{
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onUnlock?: () => void;
  isLocked?: boolean;
  compact?: boolean;
}> = ({ agent, isSelected, onSelect, onEdit, onUnlock, isLocked = false, compact = false }) => {
  const { t } = useLanguage();

  // Get translated name/role/description, fallback to agent data
  const displayName =
    t(`agent.${agent.code}.name`) !== `agent.${agent.code}.name`
      ? t(`agent.${agent.code}.name`)
      : agent.name;
  const displayRole =
    t(`agent.${agent.code}.role`) !== `agent.${agent.code}.role`
      ? t(`agent.${agent.code}.role`)
      : agent.role;
  const displayDescription =
    t(`agent.${agent.code}.description`) !== `agent.${agent.code}.description`
      ? t(`agent.${agent.code}.description`)
      : agent.description;
  return (
    <button
      onClick={isLocked ? onUnlock : onSelect}
      className={cn(
        'relative p-4 rounded-xl border-2 transition-all text-left w-full',
        isLocked
          ? 'border-neutral-300 bg-neutral-100 opacity-75 hover:opacity-100 hover:border-amber-400'
          : isSelected
            ? 'border-primary-500 bg-primary-50'
            : agent.premium
              ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 hover:shadow-md'
              : agent.isCustom
                ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 hover:shadow-md'
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
      )}
    >
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
            <span>🔒</span>
            <span className="text-xs font-semibold text-neutral-700">Unlock</span>
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {agent.premium && (
        <div
          className={cn(
            'absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1',
            isLocked
              ? 'bg-gradient-to-r from-neutral-400 to-neutral-500'
              : 'bg-gradient-to-r from-amber-500 to-orange-500'
          )}
        >
          <span>{isLocked ? '🔒' : '👑'}</span>
          <span>{isLocked ? 'LOCKED' : 'PREMIUM'}</span>
        </div>
      )}

      {/* Custom Badge */}
      {agent.isCustom && !agent.premium && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <span>✨</span>
          <span>CUSTOM</span>
        </div>
      )}

      {/* Edit button for custom agents */}
      {agent.isCustom && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-3 left-3 w-6 h-6 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 text-xs transition-colors"
          title="Edit agent"
        >
          ✏️
        </button>
      )}

      {/* Status indicator */}
      <div
        className={cn(
          'absolute top-3 right-3 w-2.5 h-2.5 rounded-full',
          (agent.premium || agent.isCustom) && 'top-5', // Move down if badge present
          agent.status === 'online' && 'bg-success-main',
          agent.status === 'offline' && 'bg-neutral-300',
          agent.status === 'busy' && 'bg-warning-main'
        )}
      />

      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
        style={{ backgroundColor: `${agent.color}20` }}
      >
        {agent.avatar}
      </div>

      {/* Info - Using translated values */}
      <h3 className="font-semibold text-neutral-900">{displayName}</h3>
      <p className="text-sm text-neutral-500">{displayRole}</p>

      {!compact && (
        <>
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{displayDescription}</p>
          {agent.premium && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {agent.premiumPackage}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">{agent.premiumPrice}</span>
            </div>
          )}
        </>
      )}
    </button>
  );
};

// Deliberation Card
const DeliberationCard: React.FC<{
  deliberation: Deliberation;
  agents: Agent[];
  onClick: () => void;
}> = ({ deliberation, agents, onClick }) => {
  const phaseLabels: Record<string, string> = {
    initial_analysis: 'Initial Analysis',
    cross_examination: 'Cross-Examination',
    synthesis: 'Synthesis',
    ethics_check: 'Ethics Check',
  };

  const phaseProgress: Record<string, number> = {
    initial_analysis: 25,
    cross_examination: 50,
    synthesis: 75,
    ethics_check: 90,
  };

  const participatingAgents = agents.filter((a) => deliberation.agents.includes(a.id));

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-medium text-primary-600">
              {phaseLabels[deliberation.phase] || deliberation.phase}
            </span>
          </div>
          <h3 className="font-medium text-neutral-900 line-clamp-2">"{deliberation.question}"</h3>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full mb-3">
        <div
          className="h-full bg-primary-500 rounded-full transition-all"
          style={{ width: `${phaseProgress[deliberation.phase] || 50}%` }}
        />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex -space-x-2">
          {participatingAgents.slice(0, 4).map((agent) => (
            <div
              key={agent.id}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-white"
              style={{ backgroundColor: `${agent.color}20` }}
              title={agent.name}
            >
              {agent.avatar}
            </div>
          ))}
          {participatingAgents.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-600 border-2 border-white">
              +{participatingAgents.length - 4}
            </div>
          )}
        </div>
        <span className="text-neutral-400">{formatRelativeTime(deliberation.startedAt)}</span>
      </div>
    </button>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

async function safeJson<T = any>(res: any, context: string): Promise<T> {
  if (!res) {
    throw new Error(`Empty response for ${context}`);
  }

  if (res.success === false && res.error) {
    const message = res.error.message || res.error.code || 'Unknown error';
    throw new Error(`Request failed for ${context}: ${message}`);
  }

  if (res.data !== undefined) {
    return res.data as T;
  }

  return res as T;
}

// Mode translation helper
const MODE_TRANSLATIONS: Record<string, Record<string, { name: string; directive: string }>> = {
  es: {
    'war-room': { name: 'Sala de Guerra', directive: 'Conflicto antes del Consenso' },
    rapid: { name: 'Decisión Rápida', directive: 'Velocidad con Datos' },
    'due-diligence': { name: 'Debida Diligencia', directive: 'Verificar Todo' },
    'innovation-lab': {
      name: 'Laboratorio de Innovación',
      directive: 'Posibilidades antes de Restricciones',
    },
    crisis: { name: 'Crisis', directive: 'Contener y Comunicar' },
    execution: { name: 'Ejecución', directive: 'Plazos son Ley' },
    governance: { name: 'Gobernanza', directive: 'Proceso Protege' },
    compliance: { name: 'Cumplimiento', directive: 'Letra de la Ley' },
    research: { name: 'Investigación', directive: 'Datos Impulsan Decisiones' },
  },
};

export const CouncilPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const { t, language } = useLanguage();

  // Helper to get translated mode name
  const getModeName = (modeId: string) => {
    if (language !== 'en' && MODE_TRANSLATIONS[language]?.[modeId]) {
      return MODE_TRANSLATIONS[language][modeId].name;
    }
    return COUNCIL_MODES[modeId]?.name || modeId;
  };

  const getModeDirective = (modeId: string) => {
    if (language !== 'en' && MODE_TRANSLATIONS[language]?.[modeId]) {
      return MODE_TRANSLATIONS[language][modeId].directive;
    }
    return COUNCIL_MODES[modeId]?.primeDirective || '';
  };

  // State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [deliberations, setDeliberations] = useState<Deliberation[]>([]);
  const [recentDecisions, setRecentDecisions] = useState<QueryResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [queryMode, setQueryMode] = useState<'quick' | 'deliberation'>('quick');
  const [selectedMode, setSelectedMode] = useState<string>('war-room');
  const [showModesLibrary, setShowModesLibrary] = useState(false);
  const [showWorkflowPicker, setShowWorkflowPicker] = useState(false);

  // Document attachments for deliberation
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [extractedContent, setExtractedContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drop to Deliberate - Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [agentActivations, setAgentActivations] = useState<
    Record<string, { status: string; color: string }>
  >({});
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Custom Agent Creator
  const [showAgentCreator, setShowAgentCreator] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Premium Features Modal & Hook
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const premium = usePremiumFeatures();

  // Policy-based permissions (Casbin integration)
  const [canVeto, setCanVeto] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const [policyReason, setPolicyReason] = useState('');

  // Check user permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const [vetoResult, approveResult] = await Promise.all([
          enterpriseApi.canVetoDecision('strategic'),
          enterpriseApi.canApproveDecision('operational'),
        ]);
        setCanVeto(vetoResult.allowed);
        setCanApprove(approveResult.allowed);
        setPolicyReason(vetoResult.reason || approveResult.reason || '');
      } catch (error) {
        // Default to allowed if policy service unavailable (dev mode)
        setCanVeto(true);
        setCanApprove(true);
      }
    };
    checkPermissions();
  }, []);

  // Handle premium purchase (simulated - would integrate with Stripe in production)
  const handlePremiumPurchase = (itemId: string, type: 'feature' | 'bundle') => {
    if (type === 'feature') {
      premium.purchaseFeature(itemId);
      alert(`✅ ${itemId} activated! Thank you for your purchase.`);
    } else {
      premium.purchaseBundle(itemId);
      alert(`🎉 Bundle ${itemId} activated! All included features are now available.`);
    }
  };
  const [customAgents, setCustomAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('datacendia_custom_agents');
    return saved ? JSON.parse(saved) : [];
  });

  // Save custom agents to localStorage
  useEffect(() => {
    localStorage.setItem('datacendia_custom_agents', JSON.stringify(customAgents));
  }, [customAgents]);

  // Auto-select relevant agents when mode changes
  useEffect(() => {
    const mode = COUNCIL_MODES[selectedMode];
    if (mode?.defaultAgents) {
      // Convert agent codes to agent IDs (e.g., 'chief' -> 'agent-chief')
      const defaultAgentIds = mode.defaultAgents.map((code) => `agent-${code}`);
      setSelectedAgents(defaultAgentIds);
    }
  }, [selectedMode]);

  // Load agents from Ollama service
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check Ollama availability and get agents
        await ollamaService.checkAvailability();
        const ollamaAgents = ollamaService.getAgents();

        setAgents(
          ollamaAgents.map((a: DomainAgent) => ({
            id: a.id,
            code: a.code,
            name: a.name,
            role: a.role,
            description: a.description,
            avatar: a.avatar,
            color: a.color,
            status: a.status,
            capabilities: a.capabilities,
            premium: a.premium,
            premiumPackage: a.premiumPackage,
            premiumPrice: a.premiumPrice,
          }))
        );

        const status = ollamaService.getStatus();
        if (!status.available) {
          setError(
            'Ollama is not running. Please start Ollama to enable AI agents. Run: ollama serve'
          );
        }
      } catch (err) {
        setError('Failed to connect to Ollama. Please ensure Ollama is running on localhost:11434');
        console.error('Ollama connection error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();

    // Refresh agent status every 10 seconds
    const interval = setInterval(async () => {
      await ollamaService.checkAvailability();
      const ollamaAgents = ollamaService.getAgents();
      setAgents(
        ollamaAgents.map((a: DomainAgent) => ({
          id: a.id,
          code: a.code,
          name: a.name,
          role: a.role,
          description: a.description,
          avatar: a.avatar,
          color: a.color,
          status: a.status,
          capabilities: a.capabilities,
          premium: a.premium,
          premiumPackage: a.premiumPackage,
          premiumPrice: a.premiumPrice,
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const selectAllAgents = () => {
    const allAgentsList = [...agents, ...customAgents];
    const onlineAgents = allAgentsList.filter((a) => a.status === 'online').map((a) => a.id);
    setSelectedAgents(onlineAgents);
  };

  // Combined agents list (Ollama agents + Custom agents)
  const allAgents = [...agents, ...customAgents];

  // Custom Agent Management Functions
  const handleSaveCustomAgent = (agent: Agent) => {
    setCustomAgents((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === agent.id);
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = agent;
        return updated;
      }
      // Add new
      return [...prev, agent];
    });
  };

  const handleDeleteCustomAgent = (agentId: string) => {
    setCustomAgents((prev) => prev.filter((a) => a.id !== agentId));
    setSelectedAgents((prev) => prev.filter((id) => id !== agentId));
  };

  const handleEditCustomAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowAgentCreator(true);
  };

  // ==========================================================================
  // DROP TO DELIBERATE - File Type Detection & Agent Auto-Wake
  // ==========================================================================

  const detectFileTypeAndWakeAgents = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = file.type.toLowerCase();

    // Define which agents wake up for which file types
    const activations: Record<string, { status: string; color: string }> = {};

    // Legal/Contract Documents (PDF, DOCX)
    if (
      ['pdf', 'docx', 'doc'].includes(ext) ||
      mimeType.includes('pdf') ||
      mimeType.includes('word')
    ) {
      activations['risk'] = { status: 'Analyzing Risk Clauses', color: '#F97316' };
      activations['ciso'] = { status: 'Scanning Security Terms', color: '#EF4444' };
      activations['cfo'] = { status: 'Reviewing Financial Terms', color: '#10B981' };
      activations['chief'] = { status: 'Strategic Assessment', color: '#6366F1' };
      // Auto-select Deal Room mode for contracts
      setSelectedMode('deal-room');
    }

    // Financial Data (CSV, XLSX, XLS)
    if (
      ['csv', 'xlsx', 'xls'].includes(ext) ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('csv')
    ) {
      activations['cfo'] = { status: 'Parsing Financial Data', color: '#10B981' };
      activations['cdo'] = { status: 'Analyzing Data Structure', color: '#06B6D4' };
      activations['cro'] = { status: 'Revenue Analysis', color: '#8B5CF6' };
      // Auto-select Due Diligence mode for data
      setSelectedMode('due-diligence');
    }

    // Presentations (PPTX, PPT)
    if (['pptx', 'ppt'].includes(ext) || mimeType.includes('presentation')) {
      activations['cmo'] = { status: 'Reviewing Messaging', color: '#EC4899' };
      activations['chief'] = { status: 'Strategic Alignment', color: '#6366F1' };
      activations['coo'] = { status: 'Operational Feasibility', color: '#F59E0B' };
    }

    // Code/Technical (JSON, MD, TXT)
    if (['json', 'md', 'txt', 'js', 'ts', 'py'].includes(ext)) {
      activations['cdo'] = { status: 'Technical Analysis', color: '#06B6D4' };
      activations['ciso'] = { status: 'Security Review', color: '#EF4444' };
      // Auto-select Innovation Lab mode for technical docs
      setSelectedMode('innovation-lab');
    }

    return activations;
  };

  const handleFileDrop = async (file: File) => {
    setIsProcessingDrop(true);
    setDroppedFile(file);

    // Detect file type and wake relevant agents
    const activations = detectFileTypeAndWakeAgents(file);
    setAgentActivations(activations);

    // Auto-select the awakened agents
    const agentIds = Object.keys(activations);
    setSelectedAgents((prev) => {
      const newSelection = new Set([...prev, ...agentIds]);
      return Array.from(newSelection);
    });

    // Add to attached files
    setAttachedFiles((prev) => [...prev, file]);

    // Upload to CendiaVault (MinIO) - sovereign storage
    let vaultDoc: any = null;
    try {
      vaultDoc = await vaultApi.uploadDocument(file, 'council-documents', {
        uploadedBy: 'council-user',
        deliberationType: selectedMode,
        agentsActivated: agentIds,
      });
      console.log('[CendiaVault] Document stored:', vaultDoc?.path);
    } catch (err) {
      console.log('[CendiaVault] Upload deferred, continuing with local processing');
    }

    // Extract text content using Tika
    try {
      const mimeType = file.type || 'application/octet-stream';
      let result: any = null;

      if (vaultDoc && typeof vaultDoc.id === 'string' && !vaultDoc.id.startsWith('local-')) {
        result = await enterpriseApi.extractDocumentFromVault(
          vaultDoc.bucket,
          vaultDoc.path,
          mimeType,
          file.name
        );
      } else if (file.size <= 5 * 1024 * 1024) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const r = reader.result as string;
            resolve(r.split(',')[1] || r);
          };
          reader.readAsDataURL(file);
        });
        result = await enterpriseApi.extractDocument(base64, mimeType, file.name);
      }

      if (result?.text) {
        setExtractedContent(
          (prev) => prev + (prev ? '\n\n---\n\n' : '') + `[Document: ${file.name}]\n${result.text}`
        );
      }
    } catch (err) {
      console.log('Document extraction not available, file staged for deliberation');
    }

    // Auto-switch to deliberation mode
    setQueryMode('deliberation');

    // Clear activations after 3 seconds (agents stay selected)
    setTimeout(() => {
      setAgentActivations({});
      setIsProcessingDrop(false);
    }, 3000);
  };

  // Drag event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Process the first file (or could handle multiple)
      await handleFileDrop(files[0]);
    }
  };

  // State for streaming deliberation
  const [streamingDecision, setStreamingDecision] = useState<QueryResult | null>(null);
  const [currentStreamingAgent, setCurrentStreamingAgent] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>('');

  // C) Progressive disclosure - collapsible sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, Record<string, boolean>>>(
    {}
  );

  const toggleSection = (decisionId: string, section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [decisionId]: {
        ...prev[decisionId],
        [section]: !prev[decisionId]?.[section],
      },
    }));
  };

  const isSectionExpanded = (decisionId: string, section: string) => {
    return expandedSections[decisionId]?.[section] ?? false;
  };

  // D) Agent selection - lock roster for audit
  const [isRosterLocked, setIsRosterLocked] = useState(false);

  // Get mode selection rationale for "Why these agents?" tooltip
  const getModeRationale = (modeKey: string) => {
    const rationales: Record<string, string> = {
      'war-room':
        'War Room mode auto-selects CFO, COO, and Risk agents for crisis response scenarios requiring financial, operational, and risk expertise.',
      'deal-room':
        'Deal Room mode selects Chief Strategy, CFO, and Legal agents for M&A and contract review requiring strategic, financial, and legal analysis.',
      'board-prep':
        'Board Prep mode includes Chief Strategy, CFO, and CMO for executive presentations requiring strategic narrative and financial accuracy.',
      'risk-review':
        'Risk Review mode prioritizes CISO, Risk, and COO agents for security and operational risk assessment.',
      'strategy-session':
        'Strategy Session selects Chief Strategy, CMO, and CDO agents for market analysis and strategic planning.',
    };
    return (
      rationales[modeKey] || 'Agents selected based on current deliberation mode and query context.'
    );
  };

  const handleSubmit = async () => {
    if (!queryInput.trim()) {
      return;
    }

    const onlineAgents = agents.filter((a) => a.status === 'online');
    if (onlineAgents.length === 0) {
      setError(
        'No agents are online. Please start Ollama and ensure you have a model installed (e.g., ollama pull llama3.2)'
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Build question with document context if files are attached
    let questionAsked = queryInput;
    if (extractedContent && attachedFiles.length > 0) {
      questionAsked = `${queryInput}\n\n--- ATTACHED DOCUMENTS FOR REVIEW ---\n${extractedContent}`;
    }

    setQueryInput('');
    setAttachedFiles([]);
    setExtractedContent('');

    try {
      if (queryMode === 'deliberation') {
        // Create initial streaming decision
        const decisionId = `decision-${Date.now()}`;
        const agentIds = selectedAgents.length > 0 ? selectedAgents : onlineAgents.map((a) => a.id);

        // Queue the deliberation job in the sovereign stack (BullMQ)
        try {
          await sovereignApi.queue.queueDeliberation({
            sessionId: decisionId,
            question: questionAsked,
            agents: agentIds,
            context: { mode: queryMode },
            priority: 'normal',
          });
          console.log('[Council] Deliberation queued in sovereign stack:', decisionId);
        } catch (queueError) {
          console.warn(
            '[Council] Queue service unavailable, proceeding with direct execution:',
            queueError
          );
        }

        const initialDecision: QueryResult = {
          id: decisionId,
          query: questionAsked,
          response: '',
          confidence: 0,
          agents: [],
          agentResponses: [],
          crossExaminations: [],
          answeredAt: new Date(),
          mode: 'deliberation',
          currentPhase: 'initial_analysis',
        };

        setStreamingDecision(initialDecision);
        setRecentDecisions((prev) => [initialDecision, ...prev].slice(0, 10));

        // Run deliberation with streaming and cross-examination
        const result = await ollamaService.deliberateWithStreaming(questionAsked, agentIds, {
          onPhaseChange: (phase) => {
            setCurrentPhase(phase);
            setStreamingDecision((prev) => (prev ? { ...prev, currentPhase: phase } : null));
            setRecentDecisions((prev) =>
              prev.map((d) => (d.id === decisionId ? { ...d, currentPhase: phase } : d))
            );
          },
          onAgentStart: (agent) => {
            setCurrentStreamingAgent(agent.id);
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                const existingIdx = d.agentResponses.findIndex((ar) => ar.agentId === agent.id);
                if (existingIdx === -1) {
                  return {
                    ...d,
                    agentResponses: [
                      ...d.agentResponses,
                      {
                        agentId: agent.id,
                        agentName: agent.name,
                        agentAvatar: agent.avatar,
                        agentColor: agent.color,
                        agentRole: agent.role,
                        response: '',
                        duration: 0,
                        isStreaming: true,
                      },
                    ],
                    agents: [...d.agents, { id: agent.id, name: agent.name }],
                  };
                }
                return d;
              })
            );
          },
          onToken: (agent, token) => {
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                return {
                  ...d,
                  agentResponses: d.agentResponses.map((ar) =>
                    ar.agentId === agent.id ? { ...ar, response: ar.response + token } : ar
                  ),
                };
              })
            );
          },
          onAgentComplete: (agent, response, duration) => {
            setCurrentStreamingAgent(null);
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                return {
                  ...d,
                  agentResponses: d.agentResponses.map((ar) =>
                    ar.agentId === agent.id ? { ...ar, response, duration, isStreaming: false } : ar
                  ),
                };
              })
            );
          },
          onChallenge: (challenger, target, challenge) => {
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                return {
                  ...d,
                  crossExaminations: [
                    ...d.crossExaminations,
                    {
                      challengerId: challenger.id,
                      challengerName: challenger.name,
                      challengerAvatar: challenger.avatar,
                      challengerColor: challenger.color,
                      targetId: target.id,
                      targetName: target.name,
                      challenge,
                      rebuttal: '',
                    },
                  ],
                };
              })
            );
          },
          onRebuttal: (target, rebuttal) => {
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                const lastCrossExam = d.crossExaminations[d.crossExaminations.length - 1];
                if (lastCrossExam && lastCrossExam.targetId === target.id) {
                  return {
                    ...d,
                    crossExaminations: d.crossExaminations.map((ce, i) =>
                      i === d.crossExaminations.length - 1 ? { ...ce, rebuttal } : ce
                    ),
                  };
                }
                return d;
              })
            );
          },
          onSynthesisStart: () => {
            setCurrentStreamingAgent('synthesis');
          },
          onSynthesisToken: (token) => {
            setRecentDecisions((prev) =>
              prev.map((d) => (d.id === decisionId ? { ...d, response: d.response + token } : d))
            );
          },
          onComplete: (synthesis, confidence) => {
            setCurrentStreamingAgent(null);
            setCurrentPhase('');
            setStreamingDecision(null);
            setRecentDecisions((prev) =>
              prev.map((d) =>
                d.id === decisionId
                  ? { ...d, response: synthesis, confidence, currentPhase: 'completed' }
                  : d
              )
            );
          },
        });
      } else {
        // Quick query - use first online agent or Chief Strategy Agent
        const targetAgent =
          selectedAgents.length > 0
            ? onlineAgents.find((a) => selectedAgents.includes(a.id)) || onlineAgents[0]
            : onlineAgents.find((a) => a.code === 'chief') || onlineAgents[0];

        if (!targetAgent) {
          setError('No agents available for query');
          return;
        }

        const result = await ollamaService.queryAgent(targetAgent.id, questionAsked);

        // Add to recent decisions
        const newDecision: QueryResult = {
          id: `decision-${Date.now()}`,
          query: questionAsked,
          response: result.response,
          confidence: 85,
          agents: [{ id: result.agent.id, name: result.agent.name }],
          agentResponses: [
            {
              agentId: result.agent.id,
              agentName: result.agent.name,
              agentAvatar: result.agent.avatar,
              agentColor: result.agent.color,
              agentRole: result.agent.role,
              response: result.response,
              duration: result.duration,
            },
          ],
          crossExaminations: [],
          answeredAt: new Date(),
          mode: 'quick',
        };

        setRecentDecisions((prev) => [newDecision, ...prev].slice(0, 10));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request. Ensure Ollama is running.');
      console.error('Query error:', err);
    } finally {
      setIsProcessing(false);

      // Store decision context in vector DB for agent memory (async, non-blocking)
      const latestDecision = recentDecisions[0];
      if (latestDecision && latestDecision.response) {
        sovereignApi.vector
          .storeDecisionContext({
            decisionId: latestDecision.id,
            title: latestDecision.query.slice(0, 100),
            context: latestDecision.query,
            outcome: latestDecision.response,
            confidence: latestDecision.confidence || 0,
            participants: latestDecision.agents?.map((a) => a.name) || [],
          })
          .catch((err) => console.warn('[Council] Failed to store decision context:', err));
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ================================================================= */}
      {/* HEADER */}
      {/* ================================================================= */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{t('council.title')}</h1>
            <p className="text-neutral-500 mt-1">
              {t('council.subtitle')} — 12 {t('council.pre_built_modes')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Premium Features Button */}
            <button
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              <span>✨</span>
              <span className="font-medium">Premium</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">30 AI Agents</span>
            </button>
            <button
              onClick={() => setShowModesLibrary(!showModesLibrary)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <span>📚</span>
              <span className="font-medium">{t('council.modes_library')}</span>
            </button>
            {agents.some((a) => a.status === 'online') ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success-light text-success-dark rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" />
                {t('council.ollama_connected')}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-error-light text-error-dark rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-error-main" />
                {t('council.ollama_disconnected')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODES LIBRARY (Expandable) */}
      {/* ================================================================= */}
      {showModesLibrary && (
        <div className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{t('council.modes.title')}</h2>
                <p className="text-neutral-600 mt-1">
                  {t('council.modes.subtitle')}
                  <span className="font-semibold text-primary-600 ml-1">
                    {t('council.modes.cultureNote')}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowModesLibrary(false)}
                className="p-2 hover:bg-white/50 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Reference Table */}
          <div className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              {t('council.modes.quickReference')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">
                      {t('council.modes.mode')}
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">
                      {t('council.modes.primeDirective')}
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">
                      {t('council.modes.bestFor')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(COUNCIL_MODES).map((mode) => (
                    <tr
                      key={mode.id}
                      className={cn(
                        'border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors',
                        selectedMode === mode.id && 'bg-primary-50'
                      )}
                      onClick={() => {
                        setSelectedMode(mode.id);
                        setShowModesLibrary(false);
                      }}
                    >
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-lg">{mode.emoji}</span>
                          <span className="font-medium">{mode.name}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-600 italic">"{mode.primeDirective}"</td>
                      <td className="py-3 px-3 text-neutral-500">{mode.shortDesc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Mode Details */}
          {selectedMode && (
            <div className="p-6 bg-neutral-50 border-t border-neutral-200">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${COUNCIL_MODES[selectedMode].color}20` }}
                >
                  {COUNCIL_MODES[selectedMode].emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {COUNCIL_MODES[selectedMode].name} Mode
                  </h3>
                  <p className="text-primary-600 font-medium italic mb-2">
                    "{COUNCIL_MODES[selectedMode].primeDirective}"
                  </p>
                  <p className="text-neutral-600 mb-4">{COUNCIL_MODES[selectedMode].description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                        {t('council.modes.bestFor')}:
                      </h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode].useCases.map((uc, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-primary-500">•</span> {uc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                        {t('council.modes.agentBehavior')}:
                      </h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode].agentBehaviors.slice(0, 4).map((ab, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">→</span>
                            <span>{ab}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-error-light border border-error-main rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-error-dark">{error}</p>
              <p className="text-sm text-error-dark/80 mt-1">
                To enable AI agents, run:{' '}
                <code className="px-1 py-0.5 bg-white/50 rounded">ollama serve</code> and ensure you
                have a model:{' '}
                <code className="px-1 py-0.5 bg-white/50 rounded">ollama pull llama3.2</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* AGENT GRID */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">{t('council.agents.domain')}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" />{' '}
              {t('label.online')}
            </span>
            <span className="flex items-center gap-1 text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-neutral-300" /> {t('label.offline')}
            </span>
          </div>
        </div>

        {/* Core C-Suite Agents */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Core C-Suite
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allAgents
              .filter(
                (a) =>
                  !a.premium &&
                  !a.isCustom &&
                  ['chief', 'cfo', 'coo', 'ciso', 'cmo', 'cro', 'cdo', 'risk'].includes(a.code)
              )
              .map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgents.includes(agent.id)}
                  onSelect={() => toggleAgentSelection(agent.id)}
                  compact
                />
              ))}
          </div>
        </div>

        {/* External & Audit Agents - Only show unlocked ones */}
        {allAgents.filter(
          (a) => a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)
        ).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                External & Audit Agents
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Premium
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allAgents
                .filter(
                  (a) =>
                    a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)
                )
                .map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgents.includes(agent.id)}
                    onSelect={() => toggleAgentSelection(agent.id)}
                    compact
                  />
                ))}
            </div>
          </div>
        )}

        {/* Clinical / Healthcare Agents - Only show unlocked ones */}
        {allAgents.filter(
          (a) =>
            a.premium &&
            (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) &&
            premium.hasAgentAccess(a.id)
        ).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Clinical / Healthcare Agents
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-medium">
                Healthcare Pack
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allAgents
                .filter(
                  (a) =>
                    a.premium &&
                    (a.premiumPackage?.includes('Healthcare') ||
                      a.premiumPackage?.includes('Clinical')) &&
                    premium.hasAgentAccess(a.id)
                )
                .map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgents.includes(agent.id)}
                    onSelect={() => toggleAgentSelection(agent.id)}
                    compact
                  />
                ))}
            </div>
          </div>
        )}

        {/* Custom Agents & Unlocked Industry Agents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Custom Agents
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Show custom agents */}
            {allAgents
              .filter((a) => a.isCustom)
              .map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgents.includes(agent.id)}
                  onSelect={() => toggleAgentSelection(agent.id)}
                  onEdit={() => handleEditCustomAgent(agent)}
                  compact
                />
              ))}
            {/* Show unlocked industry agents */}
            {allAgents
              .filter((a) => {
                if (a.isCustom) return false;
                if (!a.premium) return false;
                if (a.premiumPackage?.includes('Audit')) return false;
                if (
                  a.premiumPackage?.includes('Healthcare') ||
                  a.premiumPackage?.includes('Clinical')
                )
                  return false;
                return premium.hasAgentAccess(a.id);
              })
              .map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgents.includes(agent.id)}
                  onSelect={() => toggleAgentSelection(agent.id)}
                  compact
                />
              ))}

            {/* Create Custom Agent Button - Premium Feature */}
            <button
              onClick={() => {
                if (premium.canCreateCustomAgents()) {
                  setEditingAgent(null);
                  setShowAgentCreator(true);
                } else {
                  setShowPremiumModal(true);
                }
              }}
              className={cn(
                'relative p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]',
                premium.canCreateCustomAgents()
                  ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 hover:shadow-md'
                  : 'border-neutral-300 bg-neutral-100 opacity-75 hover:opacity-100 hover:border-amber-400'
              )}
            >
              {/* Premium/Locked Badge */}
              <div
                className={cn(
                  'absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1',
                  premium.canCreateCustomAgents()
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    : 'bg-gradient-to-r from-neutral-400 to-neutral-500'
                )}
              >
                <span>{premium.canCreateCustomAgents() ? '⭐' : '🔒'}</span>
                <span>{premium.canCreateCustomAgents() ? 'PREMIUM' : 'LOCKED'}</span>
              </div>

              {/* Locked Overlay */}
              {!premium.canCreateCustomAgents() && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
                  <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                    <span>🔒</span>
                    <span className="text-xs font-semibold text-neutral-700">Unlock</span>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  premium.canCreateCustomAgents()
                    ? 'bg-gradient-to-br from-purple-200 to-indigo-200'
                    : 'bg-neutral-200'
                )}
              >
                {premium.canCreateCustomAgents() ? '✨' : '🔒'}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  premium.canCreateCustomAgents() ? 'text-purple-700' : 'text-neutral-600'
                )}
              >
                Create Agent
              </span>
              <span
                className={cn(
                  'text-xs',
                  premium.canCreateCustomAgents() ? 'text-purple-500' : 'text-neutral-500'
                )}
              >
                Agent Builder Pack
              </span>
              {!premium.canCreateCustomAgents() && (
                <span className="text-[10px] text-amber-600 font-semibold">$199/month</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* DROP TO DELIBERATE - Central Council Table */}
      {/* ================================================================= */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative mb-6 rounded-2xl border-2 border-dashed transition-all duration-300',
          isDragging
            ? 'border-amber-400 bg-gradient-to-br from-amber-900/30 to-orange-900/30 scale-[1.02] shadow-2xl shadow-amber-500/20'
            : droppedFile
              ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-teal-900/20'
              : 'border-neutral-600/30 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 hover:border-neutral-500/50'
        )}
      >
        {/* Council Table Visual */}
        <div className="p-6">
          {/* Drop Zone Header */}
          <div className="text-center mb-4">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                isDragging
                  ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                  : droppedFile
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-neutral-700/50 text-neutral-400'
              )}
            >
              {isDragging ? (
                <>
                  <span className="text-xl animate-bounce">📥</span>
                  <span>Release to analyze with Council</span>
                </>
              ) : droppedFile ? (
                <>
                  <span className="text-xl">✅</span>
                  <span>Document staged: {droppedFile.name}</span>
                </>
              ) : (
                <>
                  <span className="text-xl">📋</span>
                  <span>Attach Evidence to Deliberation</span>
                </>
              )}
            </div>
          </div>

          {/* Circular Council Table with Agent Seats */}
          <div className="relative mx-auto" style={{ width: '320px', height: '200px' }}>
            {/* Center Table */}
            <div
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 rounded-full flex items-center justify-center transition-all duration-500',
                isDragging
                  ? 'bg-gradient-to-br from-amber-600/40 to-orange-600/40 shadow-lg shadow-amber-500/30 scale-110'
                  : droppedFile
                    ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30'
                    : 'bg-gradient-to-br from-neutral-700/40 to-neutral-800/40'
              )}
            >
              {isDragging ? (
                <div className="text-center">
                  <span className="text-3xl animate-bounce">📄</span>
                  <div className="text-xs text-amber-300 font-medium mt-1">Drop Here</div>
                </div>
              ) : droppedFile ? (
                <div className="text-center px-2 relative">
                  <span className="text-2xl">📁</span>
                  <div className="text-[10px] text-emerald-300 truncate max-w-[100px]">
                    {droppedFile.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDroppedFile(null);
                      setAttachedFiles([]);
                      setExtractedContent('');
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center transition-colors"
                    title="Remove document"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl opacity-50">🪑</span>
                  <div className="text-[10px] text-neutral-500">Council Table</div>
                </div>
              )}
            </div>

            {/* Agent Seats Around Table */}
            {agents
              .filter((a) => ['chief', 'cfo', 'coo', 'ciso', 'risk', 'cdo'].includes(a.code))
              .slice(0, 6)
              .map((agent, idx) => {
                const angle = (idx * 60 - 90) * (Math.PI / 180);
                const radius = 90;
                const x = Math.cos(angle) * radius + 160;
                const y = Math.sin(angle) * radius + 100;
                const activation = agentActivations[agent.code];

                return (
                  <div
                    key={agent.id}
                    className={cn(
                      'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500',
                      activation && 'scale-110 z-10'
                    )}
                    style={{ left: x, top: y }}
                  >
                    <div
                      className={cn(
                        'relative w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300',
                        activation
                          ? 'shadow-lg animate-pulse'
                          : selectedAgents.includes(agent.id)
                            ? 'opacity-100'
                            : 'opacity-50'
                      )}
                      style={{
                        backgroundColor: activation ? `${activation.color}30` : `${agent.color}20`,
                        borderColor: activation ? activation.color : agent.color,
                        boxShadow: activation ? `0 0 20px ${activation.color}50` : undefined,
                      }}
                    >
                      {agent.avatar}

                      {/* Activation Status Badge */}
                      {activation && (
                        <div
                          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-medium animate-fade-in"
                          style={{
                            backgroundColor: `${activation.color}20`,
                            color: activation.color,
                          }}
                        >
                          {activation.status}
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-1">
                      <div
                        className={cn(
                          'text-[10px] font-medium',
                          activation ? 'text-white' : 'text-neutral-500'
                        )}
                      >
                        {agent.code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Drop Instructions */}
          {!droppedFile && !isDragging && (
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-500">
                Drag a <span className="text-amber-400">PDF</span>,{' '}
                <span className="text-emerald-400">Excel</span>, or{' '}
                <span className="text-blue-400">Document</span> here
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                The Council will auto-detect the document type and wake relevant agents
              </p>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessingDrop && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full text-emerald-400 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>Extracting document content...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* QUERY INPUT */}
      {/* ================================================================= */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('council.ask')}</h2>

          {/* Mode Selector with Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">{t('label.mode')}:</span>
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                <span className="text-lg">{COUNCIL_MODES[selectedMode]?.emoji}</span>
                <span className="font-medium">{getModeName(selectedMode)}</span>
                <span className="text-white/50">▼</span>
              </button>
              {/* Dropdown Menu - Core modes only, with link to full library */}
              <div className="absolute top-full left-0 mt-1 w-72 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                  Core Modes
                </div>
                {Object.values(COUNCIL_MODES)
                  .filter((mode) => mode.isCore)
                  .map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-neutral-800 transition-colors',
                        selectedMode === mode.id &&
                          'bg-primary-900/50 border-l-2 border-primary-500'
                      )}
                    >
                      <span className="text-lg">{mode.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm">{getModeName(mode.id)}</div>
                        <div className="text-xs text-neutral-400 truncate">
                          {getModeDirective(mode.id)}
                        </div>
                      </div>
                    </button>
                  ))}
                <div className="border-t border-neutral-700 p-2">
                  <button
                    onClick={() => setShowModesLibrary(true)}
                    className="w-full text-center text-xs text-primary-400 hover:text-primary-300 py-1.5 bg-neutral-800/50 rounded"
                  >
                    📚 {language === 'es' ? 'Ver Biblioteca Completa' : 'View Full Modes Library'} (
                    {Object.keys(COUNCIL_MODES).length} modes) →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Mode Info Banner */}
        <div
          className="mb-4 px-4 py-3 rounded-lg border"
          style={{
            backgroundColor: `${COUNCIL_MODES[selectedMode]?.color}20`,
            borderColor: `${COUNCIL_MODES[selectedMode]?.color}40`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{COUNCIL_MODES[selectedMode]?.emoji}</span>
              <div>
                <div className="font-semibold">
                  {getModeName(selectedMode)} {language === 'es' ? 'Modo' : 'Mode'}
                </div>
                <div className="text-sm text-white/80 italic">
                  "{getModeDirective(selectedMode)}"
                </div>
                <div className="text-xs text-white/60 mt-0.5">
                  {language === 'es' ? 'Ideal para' : 'Best for'}:{' '}
                  {COUNCIL_MODES[selectedMode]?.shortDesc || 'Strategic decisions'}
                </div>
              </div>
            </div>
            <div className="text-sm text-white/60">
              {language === 'es' ? 'Líder' : 'Lead'}:{' '}
              {COUNCIL_MODES[selectedMode]?.leadAgent.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <textarea
            ref={queryInputRef}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={t('council.placeholder')}
            rows={3}
            className={cn(
              'w-full px-4 py-3 rounded-lg resize-none',
              'bg-white/10 border border-white/20',
              'text-white placeholder:text-white/60',
              'focus:outline-none focus:ring-2 focus:ring-white/30'
            )}
          />

          {/* Document Attachment Section */}
          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.pptx,.ppt,.csv,.json,.md"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  setAttachedFiles((prev) => [...prev, ...files]);
                  // Extract text content using Tika
                  for (const file of files) {
                    try {
                      const mimeType = file.type || 'application/octet-stream';
                      let result: any = null;

                      let vaultDoc: any = null;
                      try {
                        vaultDoc = await vaultApi.uploadDocument(file, 'council-documents', {
                          uploadedBy: 'council-user',
                          deliberationType: selectedMode,
                        });
                      } catch {
                        vaultDoc = null;
                      }

                      if (
                        vaultDoc &&
                        typeof vaultDoc.id === 'string' &&
                        !vaultDoc.id.startsWith('local-')
                      ) {
                        result = await enterpriseApi.extractDocumentFromVault(
                          vaultDoc.bucket,
                          vaultDoc.path,
                          mimeType,
                          file.name
                        );
                      } else if (file.size <= 5 * 1024 * 1024) {
                        // Convert file to base64 (small files only)
                        const base64 = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const r = reader.result as string;
                            resolve(r.split(',')[1] || r);
                          };
                          reader.readAsDataURL(file);
                        });
                        result = await enterpriseApi.extractDocument(base64, mimeType, file.name);
                      }

                      if (result?.text) {
                        setExtractedContent(
                          (prev) =>
                            prev +
                            (prev ? '\n\n---\n\n' : '') +
                            `[Document: ${file.name}]\n${result.text}`
                        );
                      }
                    } catch (err) {
                      console.log('Document extraction not available, using filename only');
                    }
                  }
                }
                e.target.value = '';
              }}
              className="hidden"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWorkflowPicker(true)}
                className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-sm transition-colors text-amber-200"
              >
                <span>📋</span>
                <span>Load Scenario</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors"
              >
                <span>📎</span>
                <span>Attach Documents</span>
              </button>

              {attachedFiles.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2 py-1 bg-white/20 rounded text-xs"
                    >
                      <span>📄</span>
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button
                        onClick={() => {
                          setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
                          setExtractedContent('');
                        }}
                        className="hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {attachedFiles.length > 0 && (
              <p className="text-xs text-white/60 mt-2">
                📋 {attachedFiles.length} document{attachedFiles.length > 1 ? 's' : ''} attached.
                The Council will analyze{' '}
                {attachedFiles.length > 1 ? 'these documents' : 'this document'} during
                deliberation.
              </p>
            )}
          </div>
        </div>

        {/* D) Explicit Agent Selection - Auditable Roster */}
        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">🧠 Selected Agents</span>
              {/* Why these agents? tooltip */}
              <div className="group relative">
                <button className="text-xs text-white/50 hover:text-white/80 underline">
                  Why these agents?
                </button>
                <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {getModeRationale(selectedMode)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Lock roster for audit toggle */}
              <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRosterLocked}
                  onChange={(e) => setIsRosterLocked(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                />
                <span className={isRosterLocked ? 'text-amber-400' : ''}>
                  {isRosterLocked ? '🔒 Roster Locked' : '🔓 Lock for Audit'}
                </span>
              </label>
              <button
                onClick={selectAllAgents}
                disabled={isRosterLocked}
                className={cn(
                  'text-xs underline',
                  isRosterLocked
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/70 hover:text-white'
                )}
              >
                Select all online
              </button>
            </div>
          </div>

          {/* Selected Agents Pill Row */}
          <div className="flex flex-wrap gap-2">
            {selectedAgents.length === 0 ? (
              <span className="text-sm text-white/50 italic">
                All available agents will be consulted
              </span>
            ) : (
              selectedAgents.map((id) => {
                const agent = agents.find((a) => a.id === id);
                if (!agent) return null;
                return (
                  <div
                    key={id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all',
                      isRosterLocked
                        ? 'bg-amber-900/30 border border-amber-700/50'
                        : 'bg-white/10 border border-white/20 hover:border-red-500/50 group'
                    )}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: agent.color }}
                    >
                      {agent.avatar}
                    </div>
                    <span className="text-white/90">
                      {agent.name.replace('Cendia', '').replace(' Agent', '').trim()}
                    </span>
                    {!isRosterLocked && (
                      <button
                        onClick={() => setSelectedAgents((prev) => prev.filter((a) => a !== id))}
                        className="text-white/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove agent"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {isRosterLocked && (
            <p className="mt-2 text-xs text-amber-400/80">
              🔒 Agent roster is locked for audit compliance. Unlock to modify.
            </p>
          )}
        </div>

        {/* Query mode and submit */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setQueryMode('quick')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                queryMode === 'quick'
                  ? 'bg-white text-primary-600'
                  : 'text-white/70 hover:text-white'
              )}
            >
              ⚡ Quick Brief
            </button>
            <button
              onClick={() => setQueryMode('deliberation')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                queryMode === 'deliberation'
                  ? 'bg-white text-primary-600'
                  : 'text-white/70 hover:text-white'
              )}
            >
              ⚖️ Governed Deliberation
            </button>
          </div>

          {/* Generate Minutes & Brief toggle - shown for Full Deliberation */}
          {queryMode === 'deliberation' && (
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
              />
              <span className="group-hover:text-white transition-colors">
                📝 Generate Minutes & Brief
              </span>
            </label>
          )}

          <button
            onClick={handleSubmit}
            disabled={!queryInput.trim() || isProcessing}
            className={cn(
              'flex-1 lg:flex-none px-8 py-2.5 rounded-lg font-medium transition-colors',
              'bg-white text-primary-600 hover:bg-white/90',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : queryMode === 'quick' ? (
              '⚡ Get Quick Brief'
            ) : (
              '⚖️ Start Deliberation'
            )}
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* RECENT DECISIONS - Full Width with All Agent Responses */}
      {/* ================================================================= */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">{t('council.recent_decisions')}</h2>
          <button className="text-sm text-primary-400 hover:text-primary-300 font-medium">
            {t('button.view_all')} →
          </button>
        </div>

        <div className="divide-y divide-neutral-800">
          {recentDecisions.length > 0 ? (
            recentDecisions.map((result) => (
              <div key={result.id} className="p-6">
                {/* Session Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        result.mode === 'deliberation'
                          ? 'bg-orange-900/50 text-orange-400'
                          : 'bg-blue-900/50 text-blue-400'
                      )}
                    >
                      {result.mode === 'deliberation'
                        ? '⚖️ GOVERNED DELIBERATION'
                        : '⚡ QUICK BRIEF'}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        !result.confidence || result.confidence === 0
                          ? 'bg-neutral-800 text-neutral-400'
                          : result.confidence >= 90
                            ? 'bg-green-900/50 text-green-400'
                            : result.confidence >= 70
                              ? 'bg-yellow-900/50 text-yellow-400'
                              : result.confidence >= 50
                                ? 'bg-orange-900/50 text-orange-400'
                                : 'bg-neutral-700 text-neutral-300'
                      )}
                    >
                      {!result.confidence || result.confidence === 0
                        ? result.currentPhase && result.currentPhase !== 'completed'
                          ? '◐ Calibrating...'
                          : result.agentResponses?.length === 0
                            ? '○ Pending Evidence'
                            : '—'
                        : result.confidence >= 90
                          ? '● High Confidence'
                          : result.confidence >= 70
                            ? '◑ Medium Confidence'
                            : '○ Low Confidence'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {formatRelativeTime(result.answeredAt)}
                  </span>
                </div>

                {/* B) Decision Header - Executive framing layer */}
                <div className="mb-4 p-4 bg-gradient-to-r from-neutral-800 to-neutral-800/50 rounded-xl border border-neutral-700 sticky top-0 z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Decision Statement */}
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {result.query.length > 80
                          ? result.query.slice(0, 80) + '...'
                          : result.query}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Owner */}
                        <span className="px-2 py-1 bg-neutral-700 rounded text-neutral-300">
                          👤 Owner: <span className="text-white font-medium">Current User</span>
                        </span>
                        {/* Mode */}
                        <span
                          className={cn(
                            'px-2 py-1 rounded',
                            result.mode === 'deliberation'
                              ? 'bg-orange-900/30 text-orange-400'
                              : 'bg-blue-900/30 text-blue-400'
                          )}
                        >
                          {result.mode === 'deliberation'
                            ? '⚖️ Governed Deliberation'
                            : '⚡ Quick Brief'}
                        </span>
                        {/* Inputs */}
                        <span className="px-2 py-1 bg-neutral-700 rounded text-neutral-300">
                          📎 Inputs:{' '}
                          <span className="text-white font-medium">
                            {result.agentResponses?.length || 0} analyses
                          </span>
                        </span>
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-semibold',
                          result.currentPhase === 'completed' || !result.currentPhase
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                        )}
                      >
                        {result.currentPhase === 'completed' || !result.currentPhase
                          ? '✓ Logged'
                          : '◐ In Review'}
                      </span>
                      {/* Impacted Domains */}
                      <div className="flex gap-1">
                        {['Finance', 'Ops', 'Risk']
                          .slice(0, Math.min(3, result.agents?.length || 1))
                          .map((domain, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400"
                            >
                              {domain}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Question */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm text-white font-medium">
                    U
                  </div>
                  <div className="flex-1 bg-neutral-800 rounded-lg px-4 py-3">
                    <p className="text-white font-medium">{result.query}</p>
                  </div>
                </div>

                {/* Phase Indicator */}
                {result.currentPhase && result.currentPhase !== 'completed' && (
                  <div className="flex items-center gap-2 mb-4 ml-14">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-xs text-orange-400 font-mono uppercase">
                      {result.currentPhase.replace('_', ' ')} in progress...
                    </span>
                  </div>
                )}

                {/* C) Progressive Disclosure - Answer First, Then Debate */}
                <div className="space-y-4">
                  {/* TOP SECTION: Council Recommendation (shown first, always visible) */}
                  {result.response && (
                    <div className="bg-gradient-to-r from-primary-900/30 to-emerald-900/30 rounded-xl p-5 border border-primary-700/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-xl">
                          🎯
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            Council Recommendation
                          </h4>
                          <span className="text-xs text-primary-400">
                            Synthesized from {result.agentResponses?.length || 0} expert analyses
                          </span>
                        </div>
                      </div>
                      <div className="bg-neutral-900/50 rounded-lg p-4 border-l-4 border-primary-500">
                        <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed">
                          {result.response}
                        </p>
                      </div>

                      {/* Quick Action Bullets */}
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-neutral-800/50 rounded-lg p-3">
                          <div className="text-xs text-amber-400 font-semibold mb-2">
                            ⚠️ Risks & Constraints
                          </div>
                          <ul className="text-xs text-neutral-400 space-y-1">
                            <li>• Review assumptions before proceeding</li>
                            <li>• Consider resource availability</li>
                          </ul>
                        </div>
                        <div className="bg-neutral-800/50 rounded-lg p-3">
                          <div className="text-xs text-emerald-400 font-semibold mb-2">
                            ✓ Next Actions
                          </div>
                          <ul className="text-xs text-neutral-400 space-y-1">
                            <li>☐ Assign decision owner</li>
                            <li>☐ Set review deadline</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COLLAPSIBLE: Agent Analyses */}
                  {result.agentResponses && result.agentResponses.length > 0 && (
                    <div className="border border-neutral-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(result.id, 'agents')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-750 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🧠</span>
                          <span className="font-medium text-white">Agent Analyses</span>
                          <span className="px-2 py-0.5 bg-neutral-700 rounded text-xs text-neutral-400">
                            {result.agentResponses.length} responses
                          </span>
                        </div>
                        <span className="text-neutral-400 text-lg">
                          {isSectionExpanded(result.id, 'agents') ? '▼' : '▶'}
                        </span>
                      </button>
                      {isSectionExpanded(result.id, 'agents') && (
                        <div className="p-4 space-y-4 bg-neutral-900/50">
                          {result.agentResponses.map((agentResp) => (
                            <div key={agentResp.agentId} className="flex items-start gap-4">
                              <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                <div
                                  className={cn(
                                    'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                                    agentResp.isStreaming &&
                                      'ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900'
                                  )}
                                  style={{ backgroundColor: agentResp.agentColor }}
                                >
                                  {agentResp.agentAvatar}
                                </div>
                                <span className="text-[10px] text-neutral-500 font-medium text-center">
                                  {agentResp.agentName.split(' ')[0]}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={cn(
                                      'text-xs font-mono',
                                      agentResp.isStreaming ? 'text-green-400' : 'text-neutral-400'
                                    )}
                                  >
                                    {agentResp.agentName}{' '}
                                    {agentResp.isStreaming ? 'analyzing...' : 'completed'}
                                  </span>
                                  {agentResp.isStreaming && (
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                  )}
                                  {!agentResp.isStreaming && agentResp.duration > 0 && (
                                    <span className="text-xs text-neutral-600">
                                      ({Math.round(agentResp.duration / 1000)}s)
                                    </span>
                                  )}
                                </div>
                                <div
                                  className={cn(
                                    'bg-neutral-800 rounded-lg px-4 py-4 border-l-2',
                                    agentResp.isStreaming && 'border-green-500'
                                  )}
                                  style={{
                                    borderColor: agentResp.isStreaming
                                      ? undefined
                                      : agentResp.agentColor,
                                  }}
                                >
                                  <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">
                                    {agentResp.response || (agentResp.isStreaming ? '▌' : '')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* COLLAPSIBLE: Cross-Examination */}
                  {result.crossExaminations && result.crossExaminations.length > 0 && (
                    <div className="border border-neutral-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(result.id, 'crossExam')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-750 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">⚔️</span>
                          <span className="font-medium text-white">Cross-Examination</span>
                          <span className="px-2 py-0.5 bg-yellow-900/50 text-yellow-400 rounded text-xs">
                            {result.crossExaminations.length} exchanges
                          </span>
                        </div>
                        <span className="text-neutral-400 text-lg">
                          {isSectionExpanded(result.id, 'crossExam') ? '▼' : '▶'}
                        </span>
                      </button>
                      {isSectionExpanded(result.id, 'crossExam') && (
                        <div className="p-4 space-y-4 bg-neutral-900/50">
                          {result.crossExaminations.map((ce, idx) => (
                            <div key={idx} className="space-y-3">
                              {/* Challenge */}
                              <div className="flex items-start gap-4 ml-4">
                                <div className="flex flex-col items-center gap-1 min-w-[40px]">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                                    style={{ backgroundColor: ce.challengerColor }}
                                  >
                                    {ce.challengerAvatar}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-yellow-400 font-mono">
                                      {ce.challengerName} challenges {ce.targetName}
                                    </span>
                                  </div>
                                  <div className="bg-yellow-900/20 rounded-lg px-3 py-2 border-l-2 border-yellow-500">
                                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">
                                      {ce.challenge}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* Rebuttal */}
                              {ce.rebuttal && (
                                <div className="flex items-start gap-4 ml-12">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs text-cyan-400 font-mono">
                                        {ce.targetName} responds
                                      </span>
                                    </div>
                                    <div className="bg-cyan-900/20 rounded-lg px-3 py-2 border-l-2 border-cyan-500">
                                      <p className="text-neutral-300 text-sm whitespace-pre-wrap">
                                        {ce.rebuttal}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Document Actions */}
                  {result.mode === 'deliberation' &&
                    result.currentPhase === 'completed' &&
                    result.response && (
                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-700">
                        <button
                          onClick={async () => {
                            try {
                              // Save deliberation first
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId =
                                (saveData as any).deliberation?.id ?? (saveData as any).id;
                              if (!deliberationId) {
                                throw new Error('Missing deliberation id in save response');
                              }

                              // Generate summary
                              const summaryRes =
                                await councilApi.generateExecutiveSummary(deliberationId);
                              const summaryData = await safeJson<any>(
                                summaryRes,
                                'generate executive summary'
                              );

                              // Show in new window
                              const summaryWindow = window.open('', '_blank');
                              if (summaryWindow) {
                                summaryWindow.document.write(`
                              <html><head><title>Executive Summary</title>
                              <style>
                                body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
                                h1 { color: #1a1a1a; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                                h2 { color: #374151; margin-top: 24px; }
                                .rec { background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; }
                                ul { line-height: 1.8; }
                              </style></head><body>
                              <h1>📋 ${summaryData.summary.title}</h1>
                              <p><strong>Date:</strong> ${new Date(summaryData.summary.date).toLocaleDateString()}</p>
                              <p><strong>Confidence:</strong> ${summaryData.summary.confidence}%</p>
                              <h2>Question</h2><p>${summaryData.summary.question}</p>
                              <h2>Recommendation</h2><div class="rec">${summaryData.summary.recommendation}</div>
                              <h2>Key Findings</h2><ul>${summaryData.summary.keyFindings.map((f: string) => '<li>' + f + '</li>').join('')}</ul>
                              <h2>Risk Factors</h2><ul>${summaryData.summary.riskFactors.map((r: string) => '<li>' + r + '</li>').join('')}</ul>
                              <h2>Next Steps</h2><ul>${summaryData.summary.nextSteps.map((s: string) => '<li>' + s + '</li>').join('')}</ul>
                              </body></html>
                            `);
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to generate summary:', msg);
                              alert(`Failed to generate summary: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          📋 Executive Summary
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              // Save deliberation first
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId =
                                (saveData as any).deliberation?.id ?? (saveData as any).id;
                              if (!deliberationId) {
                                throw new Error('Missing deliberation id in save response');
                              }

                              // Generate minutes
                              const minutesRes = await councilApi.generateMinutes(deliberationId);
                              const minutesData = await safeJson<any>(
                                minutesRes,
                                'generate deliberation minutes'
                              );

                              // Show in new window
                              const minutesWindow = window.open('', '_blank');
                              if (minutesWindow) {
                                minutesWindow.document.write(`
                              <html><head><title>Deliberation Minutes</title>
                              <style>
                                body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
                                h1 { color: #1a1a1a; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                                h2 { color: #374151; margin-top: 24px; }
                                .entry { padding: 12px; margin: 8px 0; border-radius: 8px; }
                                .statement { background: #f3f4f6; border-left: 3px solid #6b7280; }
                                .challenge { background: #fef3c7; border-left: 3px solid #f59e0b; }
                                .response { background: #e0f2fe; border-left: 3px solid #0ea5e9; }
                                .resolution { background: #dcfce7; border-left: 3px solid #22c55e; }
                                .speaker { font-weight: 600; color: #374151; }
                                .time { font-size: 12px; color: #9ca3af; }
                              </style></head><body>
                              <h1>📝 ${minutesData.minutes.title}</h1>
                              <p><strong>Date:</strong> ${new Date(minutesData.minutes.date).toLocaleDateString()}</p>
                              <p><strong>Agenda:</strong> ${minutesData.minutes.agenda}</p>
                              <h2>Attendees</h2>
                              <ul>${minutesData.minutes.attendees.map((a: any) => '<li><strong>' + a.name + '</strong> - ' + a.role + '</li>').join('')}</ul>
                              <h2>Proceedings</h2>
                              ${minutesData.minutes.proceedings
                                .map(
                                  (p: any) =>
                                    '<div class="entry ' +
                                    p.type +
                                    '">' +
                                    '<span class="speaker">' +
                                    p.speaker +
                                    '</span> <span class="time">(' +
                                    p.speakerRole +
                                    ')</span>' +
                                    '<p>' +
                                    p.content +
                                    '</p></div>'
                                )
                                .join('')}
                              <h2>Resolutions</h2>
                              <ul>${minutesData.minutes.resolutions.map((r: string) => '<li>' + r + '</li>').join('')}</ul>
                              <h2>Action Items</h2>
                              <ul>${minutesData.minutes.actionItems.map((a: any) => '<li><strong>' + a.action + '</strong> - Owner: ' + a.owner + '</li>').join('')}</ul>
                              </body></html>
                            `);
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to generate minutes:', msg);
                              alert(`Failed to generate minutes: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          📝 Generate Minutes
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId =
                                (saveData as any).deliberation?.id ?? (saveData as any).id;
                              alert('Deliberation saved! ID: ' + deliberationId);
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to save:', msg);
                              alert(`Failed to save: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          💾 Save
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p className="text-4xl mb-2">💭</p>
              <p>{t('council.no_decisions')}</p>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ACTIVE DELIBERATIONS */}
      {/* ================================================================= */}
      {deliberations.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Deliberations</h2>
          <div className="space-y-4">
            {deliberations.map((deliberation) => (
              <DeliberationCard
                key={deliberation.id}
                deliberation={deliberation}
                agents={allAgents}
                onClick={() => navigate(`/cortex/council/deliberation/${deliberation.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CUSTOM AGENT CREATOR MODAL */}
      {/* ================================================================= */}
      <CustomAgentCreator
        isOpen={showAgentCreator}
        onClose={() => {
          setShowAgentCreator(false);
          setEditingAgent(null);
        }}
        onSave={handleSaveCustomAgent}
        onDelete={handleDeleteCustomAgent}
        editingAgent={editingAgent}
        t={t}
      />

      {/* ================================================================= */}
      {/* PREMIUM FEATURES MODAL */}
      {/* ================================================================= */}
      <PremiumFeaturesModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPurchase={handlePremiumPurchase}
        currentFeatures={premium.getUnlockedFeatures()}
      />

      {/* Page Guide */}
      <PageGuide {...GUIDES.council} />

      {/* ================================================================= */}
      {/* WORKFLOW PICKER MODAL */}
      {/* ================================================================= */}
      <WorkflowPicker
        isOpen={showWorkflowPicker}
        onClose={() => setShowWorkflowPicker(false)}
        onSelect={(scenario) => {
          // Auto-fill the question
          setQueryInput(scenario.councilQuestion);
          // Set the council mode
          if (scenario.councilMode && COUNCIL_MODES[scenario.councilMode]) {
            setSelectedMode(scenario.councilMode);
          }
          // Focus the input
          queryInputRef.current?.focus();
        }}
        currentMode={selectedMode}
      />
    </div>
  );
};

export default CouncilPage;
