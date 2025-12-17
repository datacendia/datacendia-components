// @ts-nocheck
// =============================================================================
// DATACENDIA - THE COUNCIL PAGE (Real Ollama Integration)
// =============================================================================

// File: src/pages/cortex/council/CouncilPage.tsx
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
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';
import { councilApi } from '../../../lib/api';
import { ollamaService, type DomainAgent } from '../../../lib/ollama';
import { sovereignApi, enterpriseApi, vaultApi } from '../../../lib/sovereignApi';
import { COUNCIL_MODES, MODE_CATEGORIES, CORE_MODES, isCoreMode, type CouncilMode } from '../../../data/councilModes';
import { useLanguage } from '@/contexts/LanguageContext';
import PremiumFeaturesModal from '../../../components/premium/PremiumFeaturesModal';
import { usePremiumFeatures } from '../../../hooks/usePremiumFeatures';
import { PageGuide, GUIDES } from '../../../components/PageGuide';

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
  agents: {
    id: string;
    name: string;
  }[];
  agentResponses: AgentResponse[]; // Individual agent responses
  crossExaminations: CrossExamination[]; // Cross-examination threads
  answeredAt: Date;
  mode: 'quick' | 'deliberation';
  currentPhase?: string;
}

// Agent colors by code
const agentColors: Record<string, string> = stryMutAct_9fa48("21317") ? {} : (stryCov_9fa48("21317"), {
  chief: '#6366F1',
  cfo: '#10B981',
  coo: '#F59E0B',
  ciso: '#EF4444',
  cmo: '#EC4899',
  cro: '#8B5CF6',
  cdo: '#06B6D4',
  risk: '#F97316'
});

// Agent avatars by code
const agentAvatars: Record<string, string> = stryMutAct_9fa48("21326") ? {} : (stryCov_9fa48("21326"), {
  chief: '👔',
  cfo: '💰',
  coo: '⚙️',
  ciso: '🔒',
  cmo: '📢',
  cro: '📈',
  cdo: '📊',
  risk: '⚠️'
});

// =============================================================================
// EMOJI PICKER FOR CUSTOM AGENTS
// =============================================================================
const AGENT_EMOJIS = stryMutAct_9fa48("21335") ? [] : (stryCov_9fa48("21335"), ['🧠', '💡', '🎯', '📊', '💼', '🔧', '⚡', '🌟', '🎨', '📈', '🔬', '🏆', '🛡️', '⚙️', '💰', '📋', '🔎', '🎓', '🌐', '🤝', '📱', '🖥️', '🔐', '📦', '🚀', '💎', '🏭', '🌱', '⚖️', '🔔', '📝', '🎪', '🧪', '🔮', '🎭', '🏛️', '🌍', '🤖', '👤', '👥']);
const AGENT_COLORS = stryMutAct_9fa48("21376") ? [] : (stryCov_9fa48("21376"), ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#F97316', '#14B8A6', '#3B82F6', '#A855F7', '#22C55E', '#0EA5E9', '#D946EF', '#84CC16', '#F43F5E', '#7C3AED', '#0D9488']);

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
}> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingAgent,
  t
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [expertise, setExpertise] = useState('');
  const [avatar, setAvatar] = useState('🧠');
  const [color, setColor] = useState('#6366F1');
  const [capabilities, setCapabilities] = useState<string[]>(stryMutAct_9fa48("21402") ? ["Stryker was here"] : (stryCov_9fa48("21402"), []));
  const [newCapability, setNewCapability] = useState('');

  // Load editing agent data
  useEffect(() => {
    if (stryMutAct_9fa48("21406") ? false : stryMutAct_9fa48("21405") ? true : (stryCov_9fa48("21405", "21406"), editingAgent)) {
      setName(editingAgent.name);
      setRole(editingAgent.role);
      setDescription(editingAgent.description);
      setAvatar(editingAgent.avatar);
      setColor(editingAgent.color);
      setCapabilities(stryMutAct_9fa48("21410") ? editingAgent.capabilities && [] : stryMutAct_9fa48("21409") ? false : stryMutAct_9fa48("21408") ? true : (stryCov_9fa48("21408", "21409", "21410"), editingAgent.capabilities || (stryMutAct_9fa48("21411") ? ["Stryker was here"] : (stryCov_9fa48("21411"), []))));
      // Extract expertise from system prompt if custom agent
      const customData = (editingAgent as any).systemPrompt;
      if (stryMutAct_9fa48("21413") ? false : stryMutAct_9fa48("21412") ? true : (stryCov_9fa48("21412", "21413"), customData)) {
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
      setCapabilities(stryMutAct_9fa48("21422") ? ["Stryker was here"] : (stryCov_9fa48("21422"), []));
    }
  }, stryMutAct_9fa48("21423") ? [] : (stryCov_9fa48("21423"), [editingAgent, isOpen]));
  const addCapability = () => {
    if (stryMutAct_9fa48("21427") ? newCapability.trim() || capabilities.length < 6 : stryMutAct_9fa48("21426") ? false : stryMutAct_9fa48("21425") ? true : (stryCov_9fa48("21425", "21426", "21427"), (stryMutAct_9fa48("21428") ? newCapability : (stryCov_9fa48("21428"), newCapability.trim())) && (stryMutAct_9fa48("21431") ? capabilities.length >= 6 : stryMutAct_9fa48("21430") ? capabilities.length <= 6 : stryMutAct_9fa48("21429") ? true : (stryCov_9fa48("21429", "21430", "21431"), capabilities.length < 6)))) {
      setCapabilities(stryMutAct_9fa48("21433") ? [] : (stryCov_9fa48("21433"), [...capabilities, stryMutAct_9fa48("21434") ? newCapability : (stryCov_9fa48("21434"), newCapability.trim())]));
      setNewCapability('');
    }
  };
  const removeCapability = (index: number) => {
    setCapabilities(stryMutAct_9fa48("21437") ? capabilities : (stryCov_9fa48("21437"), capabilities.filter(stryMutAct_9fa48("21438") ? () => undefined : (stryCov_9fa48("21438"), (_, i) => stryMutAct_9fa48("21441") ? i === index : stryMutAct_9fa48("21440") ? false : stryMutAct_9fa48("21439") ? true : (stryCov_9fa48("21439", "21440", "21441"), i !== index)))));
  };
  const handleSave = () => {
    if (stryMutAct_9fa48("21445") ? !name.trim() && !role.trim() : stryMutAct_9fa48("21444") ? false : stryMutAct_9fa48("21443") ? true : (stryCov_9fa48("21443", "21444", "21445"), (stryMutAct_9fa48("21446") ? name.trim() : (stryCov_9fa48("21446"), !(stryMutAct_9fa48("21447") ? name : (stryCov_9fa48("21447"), name.trim())))) || (stryMutAct_9fa48("21448") ? role.trim() : (stryCov_9fa48("21448"), !(stryMutAct_9fa48("21449") ? role : (stryCov_9fa48("21449"), role.trim())))))) {
      return;
    }
    const agent: Agent & {
      systemPrompt?: string;
      isCustom?: boolean;
    } = stryMutAct_9fa48("21451") ? {} : (stryCov_9fa48("21451"), {
      id: stryMutAct_9fa48("21454") ? editingAgent?.id && `custom-agent-${Date.now()}` : stryMutAct_9fa48("21453") ? false : stryMutAct_9fa48("21452") ? true : (stryCov_9fa48("21452", "21453", "21454"), (stryMutAct_9fa48("21455") ? editingAgent.id : (stryCov_9fa48("21455"), editingAgent?.id)) || `custom-agent-${Date.now()}`),
      code: stryMutAct_9fa48("21459") ? editingAgent?.code && `custom-${Date.now()}` : stryMutAct_9fa48("21458") ? false : stryMutAct_9fa48("21457") ? true : (stryCov_9fa48("21457", "21458", "21459"), (stryMutAct_9fa48("21460") ? editingAgent.code : (stryCov_9fa48("21460"), editingAgent?.code)) || `custom-${Date.now()}`),
      name: stryMutAct_9fa48("21462") ? name : (stryCov_9fa48("21462"), name.trim()),
      role: stryMutAct_9fa48("21463") ? role : (stryCov_9fa48("21463"), role.trim()),
      description: stryMutAct_9fa48("21466") ? description.trim() && `Custom agent: ${role}` : stryMutAct_9fa48("21465") ? false : stryMutAct_9fa48("21464") ? true : (stryCov_9fa48("21464", "21465", "21466"), (stryMutAct_9fa48("21467") ? description : (stryCov_9fa48("21467"), description.trim())) || `Custom agent: ${role}`),
      avatar,
      color,
      status: 'online',
      capabilities: (stryMutAct_9fa48("21473") ? capabilities.length <= 0 : stryMutAct_9fa48("21472") ? capabilities.length >= 0 : stryMutAct_9fa48("21471") ? false : stryMutAct_9fa48("21470") ? true : (stryCov_9fa48("21470", "21471", "21472", "21473"), capabilities.length > 0)) ? capabilities : stryMutAct_9fa48("21474") ? [] : (stryCov_9fa48("21474"), [role]),
      isCustom: stryMutAct_9fa48("21475") ? false : (stryCov_9fa48("21475"), true),
      systemPrompt: stryMutAct_9fa48("21478") ? expertise.trim() && `You are ${name}, a custom AI agent. Your role is: ${role}. ${description}` : stryMutAct_9fa48("21477") ? false : stryMutAct_9fa48("21476") ? true : (stryCov_9fa48("21476", "21477", "21478"), (stryMutAct_9fa48("21479") ? expertise : (stryCov_9fa48("21479"), expertise.trim())) || `You are ${name}, a custom AI agent. Your role is: ${role}. ${description}`)
    });
    onSave(agent as Agent);
    onClose();
  };
  if (stryMutAct_9fa48("21483") ? false : stryMutAct_9fa48("21482") ? true : stryMutAct_9fa48("21481") ? isOpen : (stryCov_9fa48("21481", "21482", "21483"), !isOpen)) {
    return null;
  }
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-neutral-900">
                  {editingAgent ? t('council.customAgent.editTitle') : `✨ ${t('council.customAgent.title')}`}
                </h2>
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ⭐ PREMIUM
                </span>
              </div>
              <p className="text-neutral-600">
                {t('council.customAgent.subtitle')}
              </p>
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
                {AGENT_EMOJIS.map(stryMutAct_9fa48("21490") ? () => undefined : (stryCov_9fa48("21490"), emoji => <button key={emoji} onClick={stryMutAct_9fa48("21491") ? () => undefined : (stryCov_9fa48("21491"), () => setAvatar(emoji))} className={cn('w-10 h-10 text-xl rounded-lg flex items-center justify-center transition-all', (stryMutAct_9fa48("21495") ? avatar !== emoji : stryMutAct_9fa48("21494") ? false : stryMutAct_9fa48("21493") ? true : (stryCov_9fa48("21493", "21494", "21495"), avatar === emoji)) ? 'bg-primary-500 shadow-md scale-110' : 'bg-white hover:bg-neutral-100')}>
                    {emoji}
                  </button>))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.color')}
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-lg">
                {AGENT_COLORS.map(stryMutAct_9fa48("21499") ? () => undefined : (stryCov_9fa48("21499"), c => <button key={c} onClick={stryMutAct_9fa48("21500") ? () => undefined : (stryCov_9fa48("21500"), () => setColor(c))} className={cn('w-10 h-10 rounded-lg transition-all', (stryMutAct_9fa48("21504") ? color !== c : stryMutAct_9fa48("21503") ? false : stryMutAct_9fa48("21502") ? true : (stryCov_9fa48("21502", "21503", "21504"), color === c)) ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110' : '')} style={stryMutAct_9fa48("21507") ? {} : (stryCov_9fa48("21507"), {
                backgroundColor: c
              })} />))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-neutral-50 rounded-xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={stryMutAct_9fa48("21508") ? {} : (stryCov_9fa48("21508"), {
            backgroundColor: `${color}20`
          })}>
              {avatar}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{stryMutAct_9fa48("21512") ? name && 'Agent Name' : stryMutAct_9fa48("21511") ? false : stryMutAct_9fa48("21510") ? true : (stryCov_9fa48("21510", "21511", "21512"), name || 'Agent Name')}</h3>
              <p className="text-sm text-neutral-500">{stryMutAct_9fa48("21516") ? role && 'Agent Role' : stryMutAct_9fa48("21515") ? false : stryMutAct_9fa48("21514") ? true : (stryCov_9fa48("21514", "21515", "21516"), role || 'Agent Role')}</p>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.name')} *
              </label>
              <input type="text" value={name} onChange={stryMutAct_9fa48("21519") ? () => undefined : (stryCov_9fa48("21519"), e => setName(e.target.value))} placeholder="e.g., Market Analyst" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" maxLength={50} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.role')} *
              </label>
              <input type="text" value={role} onChange={stryMutAct_9fa48("21521") ? () => undefined : (stryCov_9fa48("21521"), e => setRole(e.target.value))} placeholder="e.g., Market Research & Analysis" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" maxLength={100} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.description')}
              </label>
            <textarea value={description} onChange={stryMutAct_9fa48("21523") ? () => undefined : (stryCov_9fa48("21523"), e => setDescription(e.target.value))} placeholder={t('council.customAgent.descriptionPlaceholder')} rows={2} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none" maxLength={200} />
          </div>

          {/* Expertise / System Prompt */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.expertise')}
              </label>
            <textarea value={expertise} onChange={stryMutAct_9fa48("21526") ? () => undefined : (stryCov_9fa48("21526"), e => setExpertise(e.target.value))} placeholder="Define the agent's expertise, knowledge areas, and how it should respond..." rows={5} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm" />
          </div>

          {/* Capabilities */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Capabilities (up to 6)
            </label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newCapability} onChange={stryMutAct_9fa48("21527") ? () => undefined : (stryCov_9fa48("21527"), e => setNewCapability(e.target.value))} onKeyPress={stryMutAct_9fa48("21528") ? () => undefined : (stryCov_9fa48("21528"), e => stryMutAct_9fa48("21531") ? e.key === 'Enter' || addCapability() : stryMutAct_9fa48("21530") ? false : stryMutAct_9fa48("21529") ? true : (stryCov_9fa48("21529", "21530", "21531"), (stryMutAct_9fa48("21533") ? e.key !== 'Enter' : stryMutAct_9fa48("21532") ? true : (stryCov_9fa48("21532", "21533"), e.key === 'Enter')) && addCapability()))} placeholder="e.g., Market Analysis" className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" maxLength={30} />
              <button onClick={addCapability} disabled={stryMutAct_9fa48("21538") ? capabilities.length < 6 : stryMutAct_9fa48("21537") ? capabilities.length > 6 : stryMutAct_9fa48("21536") ? false : stryMutAct_9fa48("21535") ? true : (stryCov_9fa48("21535", "21536", "21537", "21538"), capabilities.length >= 6)} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilities.map(stryMutAct_9fa48("21539") ? () => undefined : (stryCov_9fa48("21539"), (cap, i) => <span key={i} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                  {cap}
                  <button onClick={stryMutAct_9fa48("21540") ? () => undefined : (stryCov_9fa48("21540"), () => removeCapability(i))} className="hover:text-red-500">
                    ×
                  </button>
                </span>))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
          <div>
            {stryMutAct_9fa48("21543") ? editingAgent && onDelete || <button onClick={() => {
            if (confirm('Delete this custom agent?')) {
              onDelete(editingAgent.id);
              onClose();
            }
          }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                Delete Agent
              </button> : stryMutAct_9fa48("21542") ? false : stryMutAct_9fa48("21541") ? true : (stryCov_9fa48("21541", "21542", "21543"), (stryMutAct_9fa48("21545") ? editingAgent || onDelete : stryMutAct_9fa48("21544") ? true : (stryCov_9fa48("21544", "21545"), editingAgent && onDelete)) && <button onClick={() => {
            if (stryMutAct_9fa48("21548") ? false : stryMutAct_9fa48("21547") ? true : (stryCov_9fa48("21547", "21548"), confirm('Delete this custom agent?'))) {
              onDelete(editingAgent.id);
              onClose();
            }
          }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                Delete Agent
              </button>)}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              Cancel
            </button>
            <button onClick={handleSave} disabled={stryMutAct_9fa48("21553") ? !name.trim() && !role.trim() : stryMutAct_9fa48("21552") ? false : stryMutAct_9fa48("21551") ? true : (stryCov_9fa48("21551", "21552", "21553"), (stryMutAct_9fa48("21554") ? name.trim() : (stryCov_9fa48("21554"), !(stryMutAct_9fa48("21555") ? name : (stryCov_9fa48("21555"), name.trim())))) || (stryMutAct_9fa48("21556") ? role.trim() : (stryCov_9fa48("21556"), !(stryMutAct_9fa48("21557") ? role : (stryCov_9fa48("21557"), role.trim())))))} className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 font-medium">
              {editingAgent ? 'Save Changes' : 'Create Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>;
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
}> = ({
  agent,
  isSelected,
  onSelect,
  onEdit,
  onUnlock,
  isLocked = stryMutAct_9fa48("21560") ? true : (stryCov_9fa48("21560"), false),
  compact = stryMutAct_9fa48("21561") ? true : (stryCov_9fa48("21561"), false)
}) => {
  const {
    t
  } = useLanguage();

  // Get translated name/role/description, fallback to agent data
  const displayName = (stryMutAct_9fa48("21565") ? t(`agent.${agent.code}.name`) === `agent.${agent.code}.name` : stryMutAct_9fa48("21564") ? false : stryMutAct_9fa48("21563") ? true : (stryCov_9fa48("21563", "21564", "21565"), t(`agent.${agent.code}.name`) !== `agent.${agent.code}.name`)) ? t(`agent.${agent.code}.name`) : agent.name;
  const displayRole = (stryMutAct_9fa48("21571") ? t(`agent.${agent.code}.role`) === `agent.${agent.code}.role` : stryMutAct_9fa48("21570") ? false : stryMutAct_9fa48("21569") ? true : (stryCov_9fa48("21569", "21570", "21571"), t(`agent.${agent.code}.role`) !== `agent.${agent.code}.role`)) ? t(`agent.${agent.code}.role`) : agent.role;
  const displayDescription = (stryMutAct_9fa48("21577") ? t(`agent.${agent.code}.description`) === `agent.${agent.code}.description` : stryMutAct_9fa48("21576") ? false : stryMutAct_9fa48("21575") ? true : (stryCov_9fa48("21575", "21576", "21577"), t(`agent.${agent.code}.description`) !== `agent.${agent.code}.description`)) ? t(`agent.${agent.code}.description`) : agent.description;
  return <button onClick={isLocked ? onUnlock : onSelect} className={cn('relative p-4 rounded-xl border-2 transition-all text-left w-full', isLocked ? 'border-neutral-300 bg-neutral-100 opacity-75 hover:opacity-100 hover:border-amber-400' : isSelected ? 'border-primary-500 bg-primary-50' : agent.premium ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 hover:shadow-md' : agent.isCustom ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 hover:shadow-md' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm')}>
      {/* Locked Overlay */}
      {stryMutAct_9fa48("21589") ? isLocked || <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
            <span>🔒</span>
            <span className="text-xs font-semibold text-neutral-700">Unlock</span>
          </div>
        </div> : stryMutAct_9fa48("21588") ? false : stryMutAct_9fa48("21587") ? true : (stryCov_9fa48("21587", "21588", "21589"), isLocked && <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
            <span>🔒</span>
            <span className="text-xs font-semibold text-neutral-700">Unlock</span>
          </div>
        </div>)}
      
      {/* Premium Badge */}
      {stryMutAct_9fa48("21592") ? agent.premium || <div className={cn("absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1", isLocked ? "bg-gradient-to-r from-neutral-400 to-neutral-500" : "bg-gradient-to-r from-amber-500 to-orange-500")}>
          <span>{isLocked ? '🔒' : '👑'}</span>
          <span>{isLocked ? 'LOCKED' : 'PREMIUM'}</span>
        </div> : stryMutAct_9fa48("21591") ? false : stryMutAct_9fa48("21590") ? true : (stryCov_9fa48("21590", "21591", "21592"), agent.premium && <div className={cn("absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1", isLocked ? "bg-gradient-to-r from-neutral-400 to-neutral-500" : "bg-gradient-to-r from-amber-500 to-orange-500")}>
          <span>{isLocked ? '🔒' : '👑'}</span>
          <span>{isLocked ? 'LOCKED' : 'PREMIUM'}</span>
        </div>)}
      
      {/* Custom Badge */}
      {stryMutAct_9fa48("21602") ? agent.isCustom && !agent.premium || <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <span>✨</span>
          <span>CUSTOM</span>
        </div> : stryMutAct_9fa48("21601") ? false : stryMutAct_9fa48("21600") ? true : (stryCov_9fa48("21600", "21601", "21602"), (stryMutAct_9fa48("21604") ? agent.isCustom || !agent.premium : stryMutAct_9fa48("21603") ? true : (stryCov_9fa48("21603", "21604"), agent.isCustom && (stryMutAct_9fa48("21605") ? agent.premium : (stryCov_9fa48("21605"), !agent.premium)))) && <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <span>✨</span>
          <span>CUSTOM</span>
        </div>)}
      
      {/* Edit button for custom agents */}
      {stryMutAct_9fa48("21608") ? agent.isCustom && onEdit || <button onClick={e => {
      e.stopPropagation();
      onEdit();
    }} className="absolute top-3 left-3 w-6 h-6 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 text-xs transition-colors" title="Edit agent">
          ✏️
        </button> : stryMutAct_9fa48("21607") ? false : stryMutAct_9fa48("21606") ? true : (stryCov_9fa48("21606", "21607", "21608"), (stryMutAct_9fa48("21610") ? agent.isCustom || onEdit : stryMutAct_9fa48("21609") ? true : (stryCov_9fa48("21609", "21610"), agent.isCustom && onEdit)) && <button onClick={e => {
      e.stopPropagation();
      onEdit();
    }} className="absolute top-3 left-3 w-6 h-6 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 text-xs transition-colors" title="Edit agent">
          ✏️
        </button>)}
      
      {/* Status indicator */}
      <div className={cn('absolute top-3 right-3 w-2.5 h-2.5 rounded-full', stryMutAct_9fa48("21615") ? agent.premium || agent.isCustom || 'top-5' : stryMutAct_9fa48("21614") ? false : stryMutAct_9fa48("21613") ? true : (stryCov_9fa48("21613", "21614", "21615"), (stryMutAct_9fa48("21617") ? agent.premium && agent.isCustom : stryMutAct_9fa48("21616") ? true : (stryCov_9fa48("21616", "21617"), agent.premium || agent.isCustom)) && 'top-5'), // Move down if badge present
    stryMutAct_9fa48("21621") ?
    // Move down if badge present
    agent.status === 'online' || 'bg-success-main' : stryMutAct_9fa48("21620") ? false : stryMutAct_9fa48("21619") ? true : (stryCov_9fa48("21619", "21620", "21621"), (stryMutAct_9fa48("21623") ? agent.status !== 'online' : stryMutAct_9fa48("21622") ? true : (stryCov_9fa48("21622", "21623"), agent.status === 'online')) && 'bg-success-main'), stryMutAct_9fa48("21628") ? agent.status === 'offline' || 'bg-neutral-300' : stryMutAct_9fa48("21627") ? false : stryMutAct_9fa48("21626") ? true : (stryCov_9fa48("21626", "21627", "21628"), (stryMutAct_9fa48("21630") ? agent.status !== 'offline' : stryMutAct_9fa48("21629") ? true : (stryCov_9fa48("21629", "21630"), agent.status === 'offline')) && 'bg-neutral-300'), stryMutAct_9fa48("21635") ? agent.status === 'busy' || 'bg-warning-main' : stryMutAct_9fa48("21634") ? false : stryMutAct_9fa48("21633") ? true : (stryCov_9fa48("21633", "21634", "21635"), (stryMutAct_9fa48("21637") ? agent.status !== 'busy' : stryMutAct_9fa48("21636") ? true : (stryCov_9fa48("21636", "21637"), agent.status === 'busy')) && 'bg-warning-main'))} />
      
      {/* Avatar */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={stryMutAct_9fa48("21640") ? {} : (stryCov_9fa48("21640"), {
      backgroundColor: `${agent.color}20`
    })}>
        {agent.avatar}
      </div>
      
      {/* Info - Using translated values */}
      <h3 className="font-semibold text-neutral-900">{displayName}</h3>
      <p className="text-sm text-neutral-500">{displayRole}</p>
      
      {stryMutAct_9fa48("21644") ? !compact || <>
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{displayDescription}</p>
          {agent.premium && <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {agent.premiumPackage}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">
                {agent.premiumPrice}
              </span>
            </div>}
        </> : stryMutAct_9fa48("21643") ? false : stryMutAct_9fa48("21642") ? true : (stryCov_9fa48("21642", "21643", "21644"), (stryMutAct_9fa48("21645") ? compact : (stryCov_9fa48("21645"), !compact)) && <>
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{displayDescription}</p>
          {stryMutAct_9fa48("21648") ? agent.premium || <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {agent.premiumPackage}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">
                {agent.premiumPrice}
              </span>
            </div> : stryMutAct_9fa48("21647") ? false : stryMutAct_9fa48("21646") ? true : (stryCov_9fa48("21646", "21647", "21648"), agent.premium && <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {agent.premiumPackage}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">
                {agent.premiumPrice}
              </span>
            </div>)}
        </>)}
    </button>;
};

// Deliberation Card
const DeliberationCard: React.FC<{
  deliberation: Deliberation;
  agents: Agent[];
  onClick: () => void;
}> = ({
  deliberation,
  agents,
  onClick
}) => {
  const phaseLabels: Record<string, string> = stryMutAct_9fa48("21650") ? {} : (stryCov_9fa48("21650"), {
    initial_analysis: 'Initial Analysis',
    cross_examination: 'Cross-Examination',
    synthesis: 'Synthesis',
    ethics_check: 'Ethics Check'
  });
  const phaseProgress: Record<string, number> = stryMutAct_9fa48("21655") ? {} : (stryCov_9fa48("21655"), {
    initial_analysis: 25,
    cross_examination: 50,
    synthesis: 75,
    ethics_check: 90
  });
  const participatingAgents = stryMutAct_9fa48("21656") ? agents : (stryCov_9fa48("21656"), agents.filter(stryMutAct_9fa48("21657") ? () => undefined : (stryCov_9fa48("21657"), a => deliberation.agents.includes(a.id))));
  return <button onClick={onClick} className="w-full p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all text-left">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-medium text-primary-600">
              {stryMutAct_9fa48("21660") ? phaseLabels[deliberation.phase] && deliberation.phase : stryMutAct_9fa48("21659") ? false : stryMutAct_9fa48("21658") ? true : (stryCov_9fa48("21658", "21659", "21660"), phaseLabels[deliberation.phase] || deliberation.phase)}
            </span>
          </div>
          <h3 className="font-medium text-neutral-900 line-clamp-2">
            "{deliberation.question}"
          </h3>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full mb-3">
        <div className="h-full bg-primary-500 rounded-full transition-all" style={stryMutAct_9fa48("21661") ? {} : (stryCov_9fa48("21661"), {
        width: `${stryMutAct_9fa48("21665") ? phaseProgress[deliberation.phase] && 50 : stryMutAct_9fa48("21664") ? false : stryMutAct_9fa48("21663") ? true : (stryCov_9fa48("21663", "21664", "21665"), phaseProgress[deliberation.phase] || 50)}%`
      })} />
      </div>
      
      {/* Meta */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex -space-x-2">
          {stryMutAct_9fa48("21666") ? participatingAgents.map(agent => <div key={agent.id} className="w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-white" style={{
          backgroundColor: `${agent.color}20`
        }} title={agent.name}>
              {agent.avatar}
            </div>) : (stryCov_9fa48("21666"), participatingAgents.slice(0, 4).map(stryMutAct_9fa48("21667") ? () => undefined : (stryCov_9fa48("21667"), agent => <div key={agent.id} className="w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-white" style={stryMutAct_9fa48("21668") ? {} : (stryCov_9fa48("21668"), {
          backgroundColor: `${agent.color}20`
        })} title={agent.name}>
              {agent.avatar}
            </div>)))}
          {stryMutAct_9fa48("21672") ? participatingAgents.length > 4 || <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-600 border-2 border-white">
              +{participatingAgents.length - 4}
            </div> : stryMutAct_9fa48("21671") ? false : stryMutAct_9fa48("21670") ? true : (stryCov_9fa48("21670", "21671", "21672"), (stryMutAct_9fa48("21675") ? participatingAgents.length <= 4 : stryMutAct_9fa48("21674") ? participatingAgents.length >= 4 : stryMutAct_9fa48("21673") ? true : (stryCov_9fa48("21673", "21674", "21675"), participatingAgents.length > 4)) && <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-600 border-2 border-white">
              +{stryMutAct_9fa48("21676") ? participatingAgents.length + 4 : (stryCov_9fa48("21676"), participatingAgents.length - 4)}
            </div>)}
        </div>
        <span className="text-neutral-400">
          {formatRelativeTime(deliberation.startedAt)}
        </span>
      </div>
    </button>;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

async function safeJson<T = any>(res: any, context: string): Promise<T> {
  if (stryMutAct_9fa48("21680") ? false : stryMutAct_9fa48("21679") ? true : stryMutAct_9fa48("21678") ? res : (stryCov_9fa48("21678", "21679", "21680"), !res)) {
    throw new Error(`Empty response for ${context}`);
  }
  if (stryMutAct_9fa48("21685") ? res.success === false || res.error : stryMutAct_9fa48("21684") ? false : stryMutAct_9fa48("21683") ? true : (stryCov_9fa48("21683", "21684", "21685"), (stryMutAct_9fa48("21687") ? res.success !== false : stryMutAct_9fa48("21686") ? true : (stryCov_9fa48("21686", "21687"), res.success === (stryMutAct_9fa48("21688") ? true : (stryCov_9fa48("21688"), false)))) && res.error)) {
    const message = stryMutAct_9fa48("21692") ? (res.error.message || res.error.code) && 'Unknown error' : stryMutAct_9fa48("21691") ? false : stryMutAct_9fa48("21690") ? true : (stryCov_9fa48("21690", "21691", "21692"), (stryMutAct_9fa48("21694") ? res.error.message && res.error.code : stryMutAct_9fa48("21693") ? false : (stryCov_9fa48("21693", "21694"), res.error.message || res.error.code)) || 'Unknown error');
    throw new Error(`Request failed for ${context}: ${message}`);
  }
  if (stryMutAct_9fa48("21699") ? res.data === undefined : stryMutAct_9fa48("21698") ? false : stryMutAct_9fa48("21697") ? true : (stryCov_9fa48("21697", "21698", "21699"), res.data !== undefined)) {
    return res.data as T;
  }
  return res as T;
}

// Mode translation helper
const MODE_TRANSLATIONS: Record<string, Record<string, {
  name: string;
  directive: string;
}>> = stryMutAct_9fa48("21701") ? {} : (stryCov_9fa48("21701"), {
  es: stryMutAct_9fa48("21702") ? {} : (stryCov_9fa48("21702"), {
    'war-room': stryMutAct_9fa48("21703") ? {} : (stryCov_9fa48("21703"), {
      name: 'Sala de Guerra',
      directive: 'Conflicto antes del Consenso'
    }),
    'rapid': stryMutAct_9fa48("21706") ? {} : (stryCov_9fa48("21706"), {
      name: 'Decisión Rápida',
      directive: 'Velocidad con Datos'
    }),
    'due-diligence': stryMutAct_9fa48("21709") ? {} : (stryCov_9fa48("21709"), {
      name: 'Debida Diligencia',
      directive: 'Verificar Todo'
    }),
    'innovation-lab': stryMutAct_9fa48("21712") ? {} : (stryCov_9fa48("21712"), {
      name: 'Laboratorio de Innovación',
      directive: 'Posibilidades antes de Restricciones'
    }),
    'crisis': stryMutAct_9fa48("21715") ? {} : (stryCov_9fa48("21715"), {
      name: 'Crisis',
      directive: 'Contener y Comunicar'
    }),
    'execution': stryMutAct_9fa48("21718") ? {} : (stryCov_9fa48("21718"), {
      name: 'Ejecución',
      directive: 'Plazos son Ley'
    }),
    'governance': stryMutAct_9fa48("21721") ? {} : (stryCov_9fa48("21721"), {
      name: 'Gobernanza',
      directive: 'Proceso Protege'
    }),
    'compliance': stryMutAct_9fa48("21724") ? {} : (stryCov_9fa48("21724"), {
      name: 'Cumplimiento',
      directive: 'Letra de la Ley'
    }),
    'research': stryMutAct_9fa48("21727") ? {} : (stryCov_9fa48("21727"), {
      name: 'Investigación',
      directive: 'Datos Impulsan Decisiones'
    })
  })
});
export const CouncilPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    t,
    language
  } = useLanguage();

  // Helper to get translated mode name
  const getModeName = (modeId: string) => {
    if (stryMutAct_9fa48("21734") ? language !== 'en' || MODE_TRANSLATIONS[language]?.[modeId] : stryMutAct_9fa48("21733") ? false : stryMutAct_9fa48("21732") ? true : (stryCov_9fa48("21732", "21733", "21734"), (stryMutAct_9fa48("21736") ? language === 'en' : stryMutAct_9fa48("21735") ? true : (stryCov_9fa48("21735", "21736"), language !== 'en')) && (stryMutAct_9fa48("21738") ? MODE_TRANSLATIONS[language][modeId] : (stryCov_9fa48("21738"), MODE_TRANSLATIONS[language]?.[modeId])))) {
      return MODE_TRANSLATIONS[language][modeId].name;
    }
    return stryMutAct_9fa48("21742") ? COUNCIL_MODES[modeId]?.name && modeId : stryMutAct_9fa48("21741") ? false : stryMutAct_9fa48("21740") ? true : (stryCov_9fa48("21740", "21741", "21742"), (stryMutAct_9fa48("21743") ? COUNCIL_MODES[modeId].name : (stryCov_9fa48("21743"), COUNCIL_MODES[modeId]?.name)) || modeId);
  };
  const getModeDirective = (modeId: string) => {
    if (stryMutAct_9fa48("21747") ? language !== 'en' || MODE_TRANSLATIONS[language]?.[modeId] : stryMutAct_9fa48("21746") ? false : stryMutAct_9fa48("21745") ? true : (stryCov_9fa48("21745", "21746", "21747"), (stryMutAct_9fa48("21749") ? language === 'en' : stryMutAct_9fa48("21748") ? true : (stryCov_9fa48("21748", "21749"), language !== 'en')) && (stryMutAct_9fa48("21751") ? MODE_TRANSLATIONS[language][modeId] : (stryCov_9fa48("21751"), MODE_TRANSLATIONS[language]?.[modeId])))) {
      return MODE_TRANSLATIONS[language][modeId].directive;
    }
    return stryMutAct_9fa48("21755") ? COUNCIL_MODES[modeId]?.primeDirective && '' : stryMutAct_9fa48("21754") ? false : stryMutAct_9fa48("21753") ? true : (stryCov_9fa48("21753", "21754", "21755"), (stryMutAct_9fa48("21756") ? COUNCIL_MODES[modeId].primeDirective : (stryCov_9fa48("21756"), COUNCIL_MODES[modeId]?.primeDirective)) || '');
  };

  // State
  const [agents, setAgents] = useState<Agent[]>(stryMutAct_9fa48("21758") ? ["Stryker was here"] : (stryCov_9fa48("21758"), []));
  const [deliberations, setDeliberations] = useState<Deliberation[]>(stryMutAct_9fa48("21759") ? ["Stryker was here"] : (stryCov_9fa48("21759"), []));
  const [recentDecisions, setRecentDecisions] = useState<QueryResult[]>(stryMutAct_9fa48("21760") ? ["Stryker was here"] : (stryCov_9fa48("21760"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("21761") ? false : (stryCov_9fa48("21761"), true));
  const [error, setError] = useState<string | null>(null);
  const [queryInput, setQueryInput] = useState(stryMutAct_9fa48("21764") ? searchParams.get('q') && '' : stryMutAct_9fa48("21763") ? false : stryMutAct_9fa48("21762") ? true : (stryCov_9fa48("21762", "21763", "21764"), searchParams.get('q') || ''));
  const [selectedAgents, setSelectedAgents] = useState<string[]>(stryMutAct_9fa48("21767") ? ["Stryker was here"] : (stryCov_9fa48("21767"), []));
  const [isProcessing, setIsProcessing] = useState(stryMutAct_9fa48("21768") ? true : (stryCov_9fa48("21768"), false));
  const [queryMode, setQueryMode] = useState<'quick' | 'deliberation'>('quick');
  const [selectedMode, setSelectedMode] = useState<string>('war-room');
  const [showModesLibrary, setShowModesLibrary] = useState(stryMutAct_9fa48("21771") ? true : (stryCov_9fa48("21771"), false));

  // Document attachments for deliberation
  const [attachedFiles, setAttachedFiles] = useState<File[]>(stryMutAct_9fa48("21772") ? ["Stryker was here"] : (stryCov_9fa48("21772"), []));
  const [extractedContent, setExtractedContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drop to Deliberate - Drag & Drop state
  const [isDragging, setIsDragging] = useState(stryMutAct_9fa48("21774") ? true : (stryCov_9fa48("21774"), false));
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [agentActivations, setAgentActivations] = useState<Record<string, {
    status: string;
    color: string;
  }>>({});
  const [isProcessingDrop, setIsProcessingDrop] = useState(stryMutAct_9fa48("21775") ? true : (stryCov_9fa48("21775"), false));
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Custom Agent Creator
  const [showAgentCreator, setShowAgentCreator] = useState(stryMutAct_9fa48("21776") ? true : (stryCov_9fa48("21776"), false));
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Premium Features Modal & Hook
  const [showPremiumModal, setShowPremiumModal] = useState(stryMutAct_9fa48("21777") ? true : (stryCov_9fa48("21777"), false));
  const premium = usePremiumFeatures();

  // Policy-based permissions (Casbin integration)
  const [canVeto, setCanVeto] = useState(stryMutAct_9fa48("21778") ? true : (stryCov_9fa48("21778"), false));
  const [canApprove, setCanApprove] = useState(stryMutAct_9fa48("21779") ? true : (stryCov_9fa48("21779"), false));
  const [policyReason, setPolicyReason] = useState('');

  // Check user permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const [vetoResult, approveResult] = await Promise.all(stryMutAct_9fa48("21784") ? [] : (stryCov_9fa48("21784"), [enterpriseApi.canVetoDecision('strategic'), enterpriseApi.canApproveDecision('operational')]));
        setCanVeto(vetoResult.allowed);
        setCanApprove(approveResult.allowed);
        setPolicyReason(stryMutAct_9fa48("21789") ? (vetoResult.reason || approveResult.reason) && '' : stryMutAct_9fa48("21788") ? false : stryMutAct_9fa48("21787") ? true : (stryCov_9fa48("21787", "21788", "21789"), (stryMutAct_9fa48("21791") ? vetoResult.reason && approveResult.reason : stryMutAct_9fa48("21790") ? false : (stryCov_9fa48("21790", "21791"), vetoResult.reason || approveResult.reason)) || ''));
      } catch (error) {
        // Default to allowed if policy service unavailable (dev mode)
        setCanVeto(stryMutAct_9fa48("21794") ? false : (stryCov_9fa48("21794"), true));
        setCanApprove(stryMutAct_9fa48("21795") ? false : (stryCov_9fa48("21795"), true));
      }
    };
    checkPermissions();
  }, stryMutAct_9fa48("21796") ? ["Stryker was here"] : (stryCov_9fa48("21796"), []));

  // Handle premium purchase (simulated - would integrate with Stripe in production)
  const handlePremiumPurchase = (itemId: string, type: 'feature' | 'bundle') => {
    if (stryMutAct_9fa48("21800") ? type !== 'feature' : stryMutAct_9fa48("21799") ? false : stryMutAct_9fa48("21798") ? true : (stryCov_9fa48("21798", "21799", "21800"), type === 'feature')) {
      premium.purchaseFeature(itemId);
      alert(`✅ ${itemId} activated! Thank you for your purchase.`);
    } else {
      premium.purchaseBundle(itemId);
      alert(`🎉 Bundle ${itemId} activated! All included features are now available.`);
    }
  };
  const [customAgents, setCustomAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('datacendia_custom_agents');
    return saved ? JSON.parse(saved) : stryMutAct_9fa48("21808") ? ["Stryker was here"] : (stryCov_9fa48("21808"), []);
  });

  // Save custom agents to localStorage
  useEffect(() => {
    localStorage.setItem('datacendia_custom_agents', JSON.stringify(customAgents));
  }, stryMutAct_9fa48("21811") ? [] : (stryCov_9fa48("21811"), [customAgents]));

  // Auto-select relevant agents when mode changes
  useEffect(() => {
    const mode = COUNCIL_MODES[selectedMode];
    if (stryMutAct_9fa48("21815") ? mode.defaultAgents : stryMutAct_9fa48("21814") ? false : stryMutAct_9fa48("21813") ? true : (stryCov_9fa48("21813", "21814", "21815"), mode?.defaultAgents)) {
      // Convert agent codes to agent IDs (e.g., 'chief' -> 'agent-chief')
      const defaultAgentIds = mode.defaultAgents.map(stryMutAct_9fa48("21817") ? () => undefined : (stryCov_9fa48("21817"), code => `agent-${code}`));
      setSelectedAgents(defaultAgentIds);
    }
  }, stryMutAct_9fa48("21819") ? [] : (stryCov_9fa48("21819"), [selectedMode]));

  // Load agents from Ollama service
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("21823") ? false : (stryCov_9fa48("21823"), true));
        setError(null);

        // Check Ollama availability and get agents
        await ollamaService.checkAvailability();
        const ollamaAgents = ollamaService.getAgents();
        setAgents(ollamaAgents.map(stryMutAct_9fa48("21824") ? () => undefined : (stryCov_9fa48("21824"), (a: DomainAgent) => stryMutAct_9fa48("21825") ? {} : (stryCov_9fa48("21825"), {
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
          premiumPrice: a.premiumPrice
        }))));
        const status = ollamaService.getStatus();
        if (stryMutAct_9fa48("21828") ? false : stryMutAct_9fa48("21827") ? true : stryMutAct_9fa48("21826") ? status.available : (stryCov_9fa48("21826", "21827", "21828"), !status.available)) {
          setError('Ollama is not running. Please start Ollama to enable AI agents. Run: ollama serve');
        }
      } catch (err) {
        setError('Failed to connect to Ollama. Please ensure Ollama is running on localhost:11434');
        console.error('Ollama connection error:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("21835") ? true : (stryCov_9fa48("21835"), false));
      }
    };
    loadAgents();

    // Refresh agent status every 10 seconds
    const interval = setInterval(async () => {
      await ollamaService.checkAvailability();
      const ollamaAgents = ollamaService.getAgents();
      setAgents(ollamaAgents.map(stryMutAct_9fa48("21837") ? () => undefined : (stryCov_9fa48("21837"), (a: DomainAgent) => stryMutAct_9fa48("21838") ? {} : (stryCov_9fa48("21838"), {
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
        premiumPrice: a.premiumPrice
      }))));
    }, 10000);
    return stryMutAct_9fa48("21839") ? () => undefined : (stryCov_9fa48("21839"), () => clearInterval(interval));
  }, stryMutAct_9fa48("21840") ? ["Stryker was here"] : (stryCov_9fa48("21840"), []));
  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(stryMutAct_9fa48("21842") ? () => undefined : (stryCov_9fa48("21842"), prev => prev.includes(agentId) ? stryMutAct_9fa48("21843") ? prev : (stryCov_9fa48("21843"), prev.filter(stryMutAct_9fa48("21844") ? () => undefined : (stryCov_9fa48("21844"), id => stryMutAct_9fa48("21847") ? id === agentId : stryMutAct_9fa48("21846") ? false : stryMutAct_9fa48("21845") ? true : (stryCov_9fa48("21845", "21846", "21847"), id !== agentId)))) : stryMutAct_9fa48("21848") ? [] : (stryCov_9fa48("21848"), [...prev, agentId])));
  };
  const selectAllAgents = () => {
    const allAgentsList = stryMutAct_9fa48("21850") ? [] : (stryCov_9fa48("21850"), [...agents, ...customAgents]);
    const onlineAgents = stryMutAct_9fa48("21851") ? allAgentsList.map(a => a.id) : (stryCov_9fa48("21851"), allAgentsList.filter(stryMutAct_9fa48("21852") ? () => undefined : (stryCov_9fa48("21852"), a => stryMutAct_9fa48("21855") ? a.status !== 'online' : stryMutAct_9fa48("21854") ? false : stryMutAct_9fa48("21853") ? true : (stryCov_9fa48("21853", "21854", "21855"), a.status === 'online'))).map(stryMutAct_9fa48("21857") ? () => undefined : (stryCov_9fa48("21857"), a => a.id)));
    setSelectedAgents(onlineAgents);
  };

  // Combined agents list (Ollama agents + Custom agents)
  const allAgents = stryMutAct_9fa48("21858") ? [] : (stryCov_9fa48("21858"), [...agents, ...customAgents]);

  // Custom Agent Management Functions
  const handleSaveCustomAgent = (agent: Agent) => {
    setCustomAgents(prev => {
      const existingIndex = prev.findIndex(stryMutAct_9fa48("21861") ? () => undefined : (stryCov_9fa48("21861"), a => stryMutAct_9fa48("21864") ? a.id !== agent.id : stryMutAct_9fa48("21863") ? false : stryMutAct_9fa48("21862") ? true : (stryCov_9fa48("21862", "21863", "21864"), a.id === agent.id)));
      if (stryMutAct_9fa48("21868") ? existingIndex < 0 : stryMutAct_9fa48("21867") ? existingIndex > 0 : stryMutAct_9fa48("21866") ? false : stryMutAct_9fa48("21865") ? true : (stryCov_9fa48("21865", "21866", "21867", "21868"), existingIndex >= 0)) {
        // Update existing
        const updated = stryMutAct_9fa48("21870") ? [] : (stryCov_9fa48("21870"), [...prev]);
        updated[existingIndex] = agent;
        return updated;
      }
      // Add new
      return stryMutAct_9fa48("21871") ? [] : (stryCov_9fa48("21871"), [...prev, agent]);
    });
  };
  const handleDeleteCustomAgent = (agentId: string) => {
    setCustomAgents(stryMutAct_9fa48("21873") ? () => undefined : (stryCov_9fa48("21873"), prev => stryMutAct_9fa48("21874") ? prev : (stryCov_9fa48("21874"), prev.filter(stryMutAct_9fa48("21875") ? () => undefined : (stryCov_9fa48("21875"), a => stryMutAct_9fa48("21878") ? a.id === agentId : stryMutAct_9fa48("21877") ? false : stryMutAct_9fa48("21876") ? true : (stryCov_9fa48("21876", "21877", "21878"), a.id !== agentId))))));
    setSelectedAgents(stryMutAct_9fa48("21879") ? () => undefined : (stryCov_9fa48("21879"), prev => stryMutAct_9fa48("21880") ? prev : (stryCov_9fa48("21880"), prev.filter(stryMutAct_9fa48("21881") ? () => undefined : (stryCov_9fa48("21881"), id => stryMutAct_9fa48("21884") ? id === agentId : stryMutAct_9fa48("21883") ? false : stryMutAct_9fa48("21882") ? true : (stryCov_9fa48("21882", "21883", "21884"), id !== agentId))))));
  };
  const handleEditCustomAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowAgentCreator(stryMutAct_9fa48("21886") ? false : (stryCov_9fa48("21886"), true));
  };

  // ==========================================================================
  // DROP TO DELIBERATE - File Type Detection & Agent Auto-Wake
  // ==========================================================================

  const detectFileTypeAndWakeAgents = (file: File) => {
    const ext = stryMutAct_9fa48("21890") ? file.name.split('.').pop()?.toLowerCase() && '' : stryMutAct_9fa48("21889") ? false : stryMutAct_9fa48("21888") ? true : (stryCov_9fa48("21888", "21889", "21890"), (stryMutAct_9fa48("21892") ? file.name.split('.').pop().toLowerCase() : stryMutAct_9fa48("21891") ? file.name.split('.').pop()?.toUpperCase() : (stryCov_9fa48("21891", "21892"), file.name.split('.').pop()?.toLowerCase())) || '');
    const mimeType = stryMutAct_9fa48("21895") ? file.type.toUpperCase() : (stryCov_9fa48("21895"), file.type.toLowerCase());

    // Define which agents wake up for which file types
    const activations: Record<string, {
      status: string;
      color: string;
    }> = {};

    // Legal/Contract Documents (PDF, DOCX)
    if (stryMutAct_9fa48("21898") ? (['pdf', 'docx', 'doc'].includes(ext) || mimeType.includes('pdf')) && mimeType.includes('word') : stryMutAct_9fa48("21897") ? false : stryMutAct_9fa48("21896") ? true : (stryCov_9fa48("21896", "21897", "21898"), (stryMutAct_9fa48("21900") ? ['pdf', 'docx', 'doc'].includes(ext) && mimeType.includes('pdf') : stryMutAct_9fa48("21899") ? false : (stryCov_9fa48("21899", "21900"), (stryMutAct_9fa48("21901") ? [] : (stryCov_9fa48("21901"), ['pdf', 'docx', 'doc'])).includes(ext) || mimeType.includes('pdf'))) || mimeType.includes('word'))) {
      activations['risk'] = stryMutAct_9fa48("21909") ? {} : (stryCov_9fa48("21909"), {
        status: 'Analyzing Risk Clauses',
        color: '#F97316'
      });
      activations['ciso'] = stryMutAct_9fa48("21913") ? {} : (stryCov_9fa48("21913"), {
        status: 'Scanning Security Terms',
        color: '#EF4444'
      });
      activations['cfo'] = stryMutAct_9fa48("21917") ? {} : (stryCov_9fa48("21917"), {
        status: 'Reviewing Financial Terms',
        color: '#10B981'
      });
      activations['chief'] = stryMutAct_9fa48("21921") ? {} : (stryCov_9fa48("21921"), {
        status: 'Strategic Assessment',
        color: '#6366F1'
      });
      // Auto-select Deal Room mode for contracts
      setSelectedMode('deal-room');
    }

    // Financial Data (CSV, XLSX, XLS)
    if (stryMutAct_9fa48("21927") ? (['csv', 'xlsx', 'xls'].includes(ext) || mimeType.includes('spreadsheet')) && mimeType.includes('csv') : stryMutAct_9fa48("21926") ? false : stryMutAct_9fa48("21925") ? true : (stryCov_9fa48("21925", "21926", "21927"), (stryMutAct_9fa48("21929") ? ['csv', 'xlsx', 'xls'].includes(ext) && mimeType.includes('spreadsheet') : stryMutAct_9fa48("21928") ? false : (stryCov_9fa48("21928", "21929"), (stryMutAct_9fa48("21930") ? [] : (stryCov_9fa48("21930"), ['csv', 'xlsx', 'xls'])).includes(ext) || mimeType.includes('spreadsheet'))) || mimeType.includes('csv'))) {
      activations['cfo'] = stryMutAct_9fa48("21938") ? {} : (stryCov_9fa48("21938"), {
        status: 'Parsing Financial Data',
        color: '#10B981'
      });
      activations['cdo'] = stryMutAct_9fa48("21942") ? {} : (stryCov_9fa48("21942"), {
        status: 'Analyzing Data Structure',
        color: '#06B6D4'
      });
      activations['cro'] = stryMutAct_9fa48("21946") ? {} : (stryCov_9fa48("21946"), {
        status: 'Revenue Analysis',
        color: '#8B5CF6'
      });
      // Auto-select Due Diligence mode for data
      setSelectedMode('due-diligence');
    }

    // Presentations (PPTX, PPT)
    if (stryMutAct_9fa48("21952") ? ['pptx', 'ppt'].includes(ext) && mimeType.includes('presentation') : stryMutAct_9fa48("21951") ? false : stryMutAct_9fa48("21950") ? true : (stryCov_9fa48("21950", "21951", "21952"), (stryMutAct_9fa48("21953") ? [] : (stryCov_9fa48("21953"), ['pptx', 'ppt'])).includes(ext) || mimeType.includes('presentation'))) {
      activations['cmo'] = stryMutAct_9fa48("21959") ? {} : (stryCov_9fa48("21959"), {
        status: 'Reviewing Messaging',
        color: '#EC4899'
      });
      activations['chief'] = stryMutAct_9fa48("21963") ? {} : (stryCov_9fa48("21963"), {
        status: 'Strategic Alignment',
        color: '#6366F1'
      });
      activations['coo'] = stryMutAct_9fa48("21967") ? {} : (stryCov_9fa48("21967"), {
        status: 'Operational Feasibility',
        color: '#F59E0B'
      });
    }

    // Code/Technical (JSON, MD, TXT)
    if (stryMutAct_9fa48("21971") ? false : stryMutAct_9fa48("21970") ? true : (stryCov_9fa48("21970", "21971"), (stryMutAct_9fa48("21972") ? [] : (stryCov_9fa48("21972"), ['json', 'md', 'txt', 'js', 'ts', 'py'])).includes(ext))) {
      activations['cdo'] = stryMutAct_9fa48("21981") ? {} : (stryCov_9fa48("21981"), {
        status: 'Technical Analysis',
        color: '#06B6D4'
      });
      activations['ciso'] = stryMutAct_9fa48("21985") ? {} : (stryCov_9fa48("21985"), {
        status: 'Security Review',
        color: '#EF4444'
      });
      // Auto-select Innovation Lab mode for technical docs
      setSelectedMode('innovation-lab');
    }
    return activations;
  };
  const handleFileDrop = async (file: File) => {
    setIsProcessingDrop(stryMutAct_9fa48("21990") ? false : (stryCov_9fa48("21990"), true));
    setDroppedFile(file);

    // Detect file type and wake relevant agents
    const activations = detectFileTypeAndWakeAgents(file);
    setAgentActivations(activations);

    // Auto-select the awakened agents
    const agentIds = Object.keys(activations);
    setSelectedAgents(prev => {
      const newSelection = new Set(stryMutAct_9fa48("21992") ? [] : (stryCov_9fa48("21992"), [...prev, ...agentIds]));
      return Array.from(newSelection);
    });

    // Add to attached files
    setAttachedFiles(stryMutAct_9fa48("21993") ? () => undefined : (stryCov_9fa48("21993"), prev => stryMutAct_9fa48("21994") ? [] : (stryCov_9fa48("21994"), [...prev, file])));

    // Upload to CendiaVault (MinIO) - sovereign storage
    let vaultDoc: any = null;
    try {
      vaultDoc = await vaultApi.uploadDocument(file, 'council-documents', stryMutAct_9fa48("21997") ? {} : (stryCov_9fa48("21997"), {
        uploadedBy: 'council-user',
        deliberationType: selectedMode,
        agentsActivated: agentIds
      }));
      console.log('[CendiaVault] Document stored:', stryMutAct_9fa48("22000") ? vaultDoc.path : (stryCov_9fa48("22000"), vaultDoc?.path));
    } catch (err) {
      console.log('[CendiaVault] Upload deferred, continuing with local processing');
    }

    // Extract text content using Tika
    try {
      const mimeType = stryMutAct_9fa48("22006") ? file.type && 'application/octet-stream' : stryMutAct_9fa48("22005") ? false : stryMutAct_9fa48("22004") ? true : (stryCov_9fa48("22004", "22005", "22006"), file.type || 'application/octet-stream');
      let result: any = null;
      if (stryMutAct_9fa48("22010") ? vaultDoc && typeof vaultDoc.id === 'string' || !vaultDoc.id.startsWith('local-') : stryMutAct_9fa48("22009") ? false : stryMutAct_9fa48("22008") ? true : (stryCov_9fa48("22008", "22009", "22010"), (stryMutAct_9fa48("22012") ? vaultDoc || typeof vaultDoc.id === 'string' : stryMutAct_9fa48("22011") ? true : (stryCov_9fa48("22011", "22012"), vaultDoc && (stryMutAct_9fa48("22014") ? typeof vaultDoc.id !== 'string' : stryMutAct_9fa48("22013") ? true : (stryCov_9fa48("22013", "22014"), typeof vaultDoc.id === 'string')))) && (stryMutAct_9fa48("22016") ? vaultDoc.id.startsWith('local-') : (stryCov_9fa48("22016"), !(stryMutAct_9fa48("22017") ? vaultDoc.id.endsWith('local-') : (stryCov_9fa48("22017"), vaultDoc.id.startsWith('local-'))))))) {
        result = await enterpriseApi.extractDocumentFromVault(vaultDoc.bucket, vaultDoc.path, mimeType, file.name);
      } else if (stryMutAct_9fa48("22023") ? file.size > 5 * 1024 * 1024 : stryMutAct_9fa48("22022") ? file.size < 5 * 1024 * 1024 : stryMutAct_9fa48("22021") ? false : stryMutAct_9fa48("22020") ? true : (stryCov_9fa48("22020", "22021", "22022", "22023"), file.size <= (stryMutAct_9fa48("22024") ? 5 * 1024 / 1024 : (stryCov_9fa48("22024"), (stryMutAct_9fa48("22025") ? 5 / 1024 : (stryCov_9fa48("22025"), 5 * 1024)) * 1024)))) {
        const base64 = await new Promise<string>(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const r = reader.result as string;
            resolve(stryMutAct_9fa48("22031") ? r.split(',')[1] && r : stryMutAct_9fa48("22030") ? false : stryMutAct_9fa48("22029") ? true : (stryCov_9fa48("22029", "22030", "22031"), r.split(',')[1] || r));
          };
          reader.readAsDataURL(file);
        });
        result = await enterpriseApi.extractDocument(base64, mimeType, file.name);
      }
      if (stryMutAct_9fa48("22035") ? result.text : stryMutAct_9fa48("22034") ? false : stryMutAct_9fa48("22033") ? true : (stryCov_9fa48("22033", "22034", "22035"), result?.text)) {
        setExtractedContent(stryMutAct_9fa48("22037") ? () => undefined : (stryCov_9fa48("22037"), prev => (stryMutAct_9fa48("22038") ? prev - (prev ? '\n\n---\n\n' : '') : (stryCov_9fa48("22038"), prev + (prev ? '\n\n---\n\n' : ''))) + `[Document: ${file.name}]\n${result.text}`));
      }
    } catch (err) {
      console.log('Document extraction not available, file staged for deliberation');
    }

    // Auto-switch to deliberation mode
    setQueryMode('deliberation');

    // Clear activations after 3 seconds (agents stay selected)
    setTimeout(() => {
      setAgentActivations({});
      setIsProcessingDrop(stryMutAct_9fa48("22046") ? true : (stryCov_9fa48("22046"), false));
    }, 3000);
  };

  // Drag event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(stryMutAct_9fa48("22048") ? false : (stryCov_9fa48("22048"), true));
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (stryMutAct_9fa48("22052") ? dropZoneRef.current || !dropZoneRef.current.contains(e.relatedTarget as Node) : stryMutAct_9fa48("22051") ? false : stryMutAct_9fa48("22050") ? true : (stryCov_9fa48("22050", "22051", "22052"), dropZoneRef.current && (stryMutAct_9fa48("22053") ? dropZoneRef.current.contains(e.relatedTarget as Node) : (stryCov_9fa48("22053"), !dropZoneRef.current.contains(e.relatedTarget as Node))))) {
      setIsDragging(stryMutAct_9fa48("22055") ? true : (stryCov_9fa48("22055"), false));
    }
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(stryMutAct_9fa48("22057") ? true : (stryCov_9fa48("22057"), false));
    const files = Array.from(e.dataTransfer.files);
    if (stryMutAct_9fa48("22061") ? files.length <= 0 : stryMutAct_9fa48("22060") ? files.length >= 0 : stryMutAct_9fa48("22059") ? false : stryMutAct_9fa48("22058") ? true : (stryCov_9fa48("22058", "22059", "22060", "22061"), files.length > 0)) {
      // Process the first file (or could handle multiple)
      await handleFileDrop(files[0]);
    }
  };

  // State for streaming deliberation
  const [streamingDecision, setStreamingDecision] = useState<QueryResult | null>(null);
  const [currentStreamingAgent, setCurrentStreamingAgent] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>('');

  // C) Progressive disclosure - collapsible sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, Record<string, boolean>>>({});
  const toggleSection = (decisionId: string, section: string) => {
    setExpandedSections(stryMutAct_9fa48("22065") ? () => undefined : (stryCov_9fa48("22065"), prev => stryMutAct_9fa48("22066") ? {} : (stryCov_9fa48("22066"), {
      ...prev,
      [decisionId]: stryMutAct_9fa48("22067") ? {} : (stryCov_9fa48("22067"), {
        ...prev[decisionId],
        [section]: stryMutAct_9fa48("22068") ? prev[decisionId]?.[section] : (stryCov_9fa48("22068"), !(stryMutAct_9fa48("22069") ? prev[decisionId][section] : (stryCov_9fa48("22069"), prev[decisionId]?.[section])))
      })
    })));
  };
  const isSectionExpanded = (decisionId: string, section: string) => {
    return stryMutAct_9fa48("22071") ? expandedSections[decisionId]?.[section] && false : (stryCov_9fa48("22071"), (stryMutAct_9fa48("22072") ? expandedSections[decisionId][section] : (stryCov_9fa48("22072"), expandedSections[decisionId]?.[section])) ?? (stryMutAct_9fa48("22073") ? true : (stryCov_9fa48("22073"), false)));
  };

  // D) Agent selection - lock roster for audit
  const [isRosterLocked, setIsRosterLocked] = useState(stryMutAct_9fa48("22074") ? true : (stryCov_9fa48("22074"), false));

  // Get mode selection rationale for "Why these agents?" tooltip
  const getModeRationale = (modeKey: string) => {
    const rationales: Record<string, string> = stryMutAct_9fa48("22076") ? {} : (stryCov_9fa48("22076"), {
      'war-room': 'War Room mode auto-selects CFO, COO, and Risk agents for crisis response scenarios requiring financial, operational, and risk expertise.',
      'deal-room': 'Deal Room mode selects Chief Strategy, CFO, and Legal agents for M&A and contract review requiring strategic, financial, and legal analysis.',
      'board-prep': 'Board Prep mode includes Chief Strategy, CFO, and CMO for executive presentations requiring strategic narrative and financial accuracy.',
      'risk-review': 'Risk Review mode prioritizes CISO, Risk, and COO agents for security and operational risk assessment.',
      'strategy-session': 'Strategy Session selects Chief Strategy, CMO, and CDO agents for market analysis and strategic planning.'
    });
    return stryMutAct_9fa48("22084") ? rationales[modeKey] && 'Agents selected based on current deliberation mode and query context.' : stryMutAct_9fa48("22083") ? false : stryMutAct_9fa48("22082") ? true : (stryCov_9fa48("22082", "22083", "22084"), rationales[modeKey] || 'Agents selected based on current deliberation mode and query context.');
  };
  const handleSubmit = async () => {
    if (stryMutAct_9fa48("22089") ? false : stryMutAct_9fa48("22088") ? true : stryMutAct_9fa48("22087") ? queryInput.trim() : (stryCov_9fa48("22087", "22088", "22089"), !(stryMutAct_9fa48("22090") ? queryInput : (stryCov_9fa48("22090"), queryInput.trim())))) {
      return;
    }
    const onlineAgents = stryMutAct_9fa48("22092") ? agents : (stryCov_9fa48("22092"), agents.filter(stryMutAct_9fa48("22093") ? () => undefined : (stryCov_9fa48("22093"), a => stryMutAct_9fa48("22096") ? a.status !== 'online' : stryMutAct_9fa48("22095") ? false : stryMutAct_9fa48("22094") ? true : (stryCov_9fa48("22094", "22095", "22096"), a.status === 'online'))));
    if (stryMutAct_9fa48("22100") ? onlineAgents.length !== 0 : stryMutAct_9fa48("22099") ? false : stryMutAct_9fa48("22098") ? true : (stryCov_9fa48("22098", "22099", "22100"), onlineAgents.length === 0)) {
      setError('No agents are online. Please start Ollama and ensure you have a model installed (e.g., ollama pull llama3.2)');
      return;
    }
    setIsProcessing(stryMutAct_9fa48("22103") ? false : (stryCov_9fa48("22103"), true));
    setError(null);

    // Build question with document context if files are attached
    let questionAsked = queryInput;
    if (stryMutAct_9fa48("22106") ? extractedContent || attachedFiles.length > 0 : stryMutAct_9fa48("22105") ? false : stryMutAct_9fa48("22104") ? true : (stryCov_9fa48("22104", "22105", "22106"), extractedContent && (stryMutAct_9fa48("22109") ? attachedFiles.length <= 0 : stryMutAct_9fa48("22108") ? attachedFiles.length >= 0 : stryMutAct_9fa48("22107") ? true : (stryCov_9fa48("22107", "22108", "22109"), attachedFiles.length > 0)))) {
      questionAsked = `${queryInput}\n\n--- ATTACHED DOCUMENTS FOR REVIEW ---\n${extractedContent}`;
    }
    setQueryInput('');
    setAttachedFiles(stryMutAct_9fa48("22113") ? ["Stryker was here"] : (stryCov_9fa48("22113"), []));
    setExtractedContent('');
    try {
      if (stryMutAct_9fa48("22118") ? queryMode !== 'deliberation' : stryMutAct_9fa48("22117") ? false : stryMutAct_9fa48("22116") ? true : (stryCov_9fa48("22116", "22117", "22118"), queryMode === 'deliberation')) {
        // Create initial streaming decision
        const decisionId = `decision-${Date.now()}`;
        const agentIds = (stryMutAct_9fa48("22125") ? selectedAgents.length <= 0 : stryMutAct_9fa48("22124") ? selectedAgents.length >= 0 : stryMutAct_9fa48("22123") ? false : stryMutAct_9fa48("22122") ? true : (stryCov_9fa48("22122", "22123", "22124", "22125"), selectedAgents.length > 0)) ? selectedAgents : onlineAgents.map(stryMutAct_9fa48("22126") ? () => undefined : (stryCov_9fa48("22126"), a => a.id));

        // Queue the deliberation job in the sovereign stack (BullMQ)
        try {
          await sovereignApi.queue.queueDeliberation(stryMutAct_9fa48("22128") ? {} : (stryCov_9fa48("22128"), {
            sessionId: decisionId,
            question: questionAsked,
            agents: agentIds,
            context: stryMutAct_9fa48("22129") ? {} : (stryCov_9fa48("22129"), {
              mode: queryMode
            }),
            priority: 'normal'
          }));
          console.log('[Council] Deliberation queued in sovereign stack:', decisionId);
        } catch (queueError) {
          console.warn('[Council] Queue service unavailable, proceeding with direct execution:', queueError);
        }
        const initialDecision: QueryResult = stryMutAct_9fa48("22134") ? {} : (stryCov_9fa48("22134"), {
          id: decisionId,
          query: questionAsked,
          response: '',
          confidence: 0,
          agents: stryMutAct_9fa48("22136") ? ["Stryker was here"] : (stryCov_9fa48("22136"), []),
          agentResponses: stryMutAct_9fa48("22137") ? ["Stryker was here"] : (stryCov_9fa48("22137"), []),
          crossExaminations: stryMutAct_9fa48("22138") ? ["Stryker was here"] : (stryCov_9fa48("22138"), []),
          answeredAt: new Date(),
          mode: 'deliberation',
          currentPhase: 'initial_analysis'
        });
        setStreamingDecision(initialDecision);
        setRecentDecisions(stryMutAct_9fa48("22141") ? () => undefined : (stryCov_9fa48("22141"), prev => stryMutAct_9fa48("22142") ? [initialDecision, ...prev] : (stryCov_9fa48("22142"), (stryMutAct_9fa48("22143") ? [] : (stryCov_9fa48("22143"), [initialDecision, ...prev])).slice(0, 10))));

        // Run deliberation with streaming and cross-examination
        const result = await ollamaService.deliberateWithStreaming(questionAsked, agentIds, stryMutAct_9fa48("22144") ? {} : (stryCov_9fa48("22144"), {
          onPhaseChange: phase => {
            setCurrentPhase(phase);
            setStreamingDecision(stryMutAct_9fa48("22146") ? () => undefined : (stryCov_9fa48("22146"), prev => prev ? stryMutAct_9fa48("22147") ? {} : (stryCov_9fa48("22147"), {
              ...prev,
              currentPhase: phase
            }) : null));
            setRecentDecisions(stryMutAct_9fa48("22148") ? () => undefined : (stryCov_9fa48("22148"), prev => prev.map(stryMutAct_9fa48("22149") ? () => undefined : (stryCov_9fa48("22149"), d => (stryMutAct_9fa48("22152") ? d.id !== decisionId : stryMutAct_9fa48("22151") ? false : stryMutAct_9fa48("22150") ? true : (stryCov_9fa48("22150", "22151", "22152"), d.id === decisionId)) ? stryMutAct_9fa48("22153") ? {} : (stryCov_9fa48("22153"), {
              ...d,
              currentPhase: phase
            }) : d))));
          },
          onAgentStart: agent => {
            setCurrentStreamingAgent(agent.id);
            setRecentDecisions(stryMutAct_9fa48("22155") ? () => undefined : (stryCov_9fa48("22155"), prev => prev.map(d => {
              if (stryMutAct_9fa48("22159") ? d.id === decisionId : stryMutAct_9fa48("22158") ? false : stryMutAct_9fa48("22157") ? true : (stryCov_9fa48("22157", "22158", "22159"), d.id !== decisionId)) {
                return d;
              }
              const existingIdx = d.agentResponses.findIndex(stryMutAct_9fa48("22161") ? () => undefined : (stryCov_9fa48("22161"), ar => stryMutAct_9fa48("22164") ? ar.agentId !== agent.id : stryMutAct_9fa48("22163") ? false : stryMutAct_9fa48("22162") ? true : (stryCov_9fa48("22162", "22163", "22164"), ar.agentId === agent.id)));
              if (stryMutAct_9fa48("22167") ? existingIdx !== -1 : stryMutAct_9fa48("22166") ? false : stryMutAct_9fa48("22165") ? true : (stryCov_9fa48("22165", "22166", "22167"), existingIdx === (stryMutAct_9fa48("22168") ? +1 : (stryCov_9fa48("22168"), -1)))) {
                return stryMutAct_9fa48("22170") ? {} : (stryCov_9fa48("22170"), {
                  ...d,
                  agentResponses: stryMutAct_9fa48("22171") ? [] : (stryCov_9fa48("22171"), [...d.agentResponses, stryMutAct_9fa48("22172") ? {} : (stryCov_9fa48("22172"), {
                    agentId: agent.id,
                    agentName: agent.name,
                    agentAvatar: agent.avatar,
                    agentColor: agent.color,
                    agentRole: agent.role,
                    response: '',
                    duration: 0,
                    isStreaming: stryMutAct_9fa48("22174") ? false : (stryCov_9fa48("22174"), true)
                  })]),
                  agents: stryMutAct_9fa48("22175") ? [] : (stryCov_9fa48("22175"), [...d.agents, stryMutAct_9fa48("22176") ? {} : (stryCov_9fa48("22176"), {
                    id: agent.id,
                    name: agent.name
                  })])
                });
              }
              return d;
            })));
          },
          onToken: (agent, token) => {
            setRecentDecisions(stryMutAct_9fa48("22178") ? () => undefined : (stryCov_9fa48("22178"), prev => prev.map(d => {
              if (stryMutAct_9fa48("22182") ? d.id === decisionId : stryMutAct_9fa48("22181") ? false : stryMutAct_9fa48("22180") ? true : (stryCov_9fa48("22180", "22181", "22182"), d.id !== decisionId)) {
                return d;
              }
              return stryMutAct_9fa48("22184") ? {} : (stryCov_9fa48("22184"), {
                ...d,
                agentResponses: d.agentResponses.map(stryMutAct_9fa48("22185") ? () => undefined : (stryCov_9fa48("22185"), ar => (stryMutAct_9fa48("22188") ? ar.agentId !== agent.id : stryMutAct_9fa48("22187") ? false : stryMutAct_9fa48("22186") ? true : (stryCov_9fa48("22186", "22187", "22188"), ar.agentId === agent.id)) ? stryMutAct_9fa48("22189") ? {} : (stryCov_9fa48("22189"), {
                  ...ar,
                  response: stryMutAct_9fa48("22190") ? ar.response - token : (stryCov_9fa48("22190"), ar.response + token)
                }) : ar))
              });
            })));
          },
          onAgentComplete: (agent, response, duration) => {
            setCurrentStreamingAgent(null);
            setRecentDecisions(stryMutAct_9fa48("22192") ? () => undefined : (stryCov_9fa48("22192"), prev => prev.map(d => {
              if (stryMutAct_9fa48("22196") ? d.id === decisionId : stryMutAct_9fa48("22195") ? false : stryMutAct_9fa48("22194") ? true : (stryCov_9fa48("22194", "22195", "22196"), d.id !== decisionId)) {
                return d;
              }
              return stryMutAct_9fa48("22198") ? {} : (stryCov_9fa48("22198"), {
                ...d,
                agentResponses: d.agentResponses.map(stryMutAct_9fa48("22199") ? () => undefined : (stryCov_9fa48("22199"), ar => (stryMutAct_9fa48("22202") ? ar.agentId !== agent.id : stryMutAct_9fa48("22201") ? false : stryMutAct_9fa48("22200") ? true : (stryCov_9fa48("22200", "22201", "22202"), ar.agentId === agent.id)) ? stryMutAct_9fa48("22203") ? {} : (stryCov_9fa48("22203"), {
                  ...ar,
                  response,
                  duration,
                  isStreaming: stryMutAct_9fa48("22204") ? true : (stryCov_9fa48("22204"), false)
                }) : ar))
              });
            })));
          },
          onChallenge: (challenger, target, challenge) => {
            setRecentDecisions(stryMutAct_9fa48("22206") ? () => undefined : (stryCov_9fa48("22206"), prev => prev.map(d => {
              if (stryMutAct_9fa48("22210") ? d.id === decisionId : stryMutAct_9fa48("22209") ? false : stryMutAct_9fa48("22208") ? true : (stryCov_9fa48("22208", "22209", "22210"), d.id !== decisionId)) {
                return d;
              }
              return stryMutAct_9fa48("22212") ? {} : (stryCov_9fa48("22212"), {
                ...d,
                crossExaminations: stryMutAct_9fa48("22213") ? [] : (stryCov_9fa48("22213"), [...d.crossExaminations, stryMutAct_9fa48("22214") ? {} : (stryCov_9fa48("22214"), {
                  challengerId: challenger.id,
                  challengerName: challenger.name,
                  challengerAvatar: challenger.avatar,
                  challengerColor: challenger.color,
                  targetId: target.id,
                  targetName: target.name,
                  challenge,
                  rebuttal: ''
                })])
              });
            })));
          },
          onRebuttal: (target, rebuttal) => {
            setRecentDecisions(stryMutAct_9fa48("22217") ? () => undefined : (stryCov_9fa48("22217"), prev => prev.map(d => {
              if (stryMutAct_9fa48("22221") ? d.id === decisionId : stryMutAct_9fa48("22220") ? false : stryMutAct_9fa48("22219") ? true : (stryCov_9fa48("22219", "22220", "22221"), d.id !== decisionId)) {
                return d;
              }
              const lastCrossExam = d.crossExaminations[stryMutAct_9fa48("22223") ? d.crossExaminations.length + 1 : (stryCov_9fa48("22223"), d.crossExaminations.length - 1)];
              if (stryMutAct_9fa48("22226") ? lastCrossExam || lastCrossExam.targetId === target.id : stryMutAct_9fa48("22225") ? false : stryMutAct_9fa48("22224") ? true : (stryCov_9fa48("22224", "22225", "22226"), lastCrossExam && (stryMutAct_9fa48("22228") ? lastCrossExam.targetId !== target.id : stryMutAct_9fa48("22227") ? true : (stryCov_9fa48("22227", "22228"), lastCrossExam.targetId === target.id)))) {
                return stryMutAct_9fa48("22230") ? {} : (stryCov_9fa48("22230"), {
                  ...d,
                  crossExaminations: d.crossExaminations.map(stryMutAct_9fa48("22231") ? () => undefined : (stryCov_9fa48("22231"), (ce, i) => (stryMutAct_9fa48("22234") ? i !== d.crossExaminations.length - 1 : stryMutAct_9fa48("22233") ? false : stryMutAct_9fa48("22232") ? true : (stryCov_9fa48("22232", "22233", "22234"), i === (stryMutAct_9fa48("22235") ? d.crossExaminations.length + 1 : (stryCov_9fa48("22235"), d.crossExaminations.length - 1)))) ? stryMutAct_9fa48("22236") ? {} : (stryCov_9fa48("22236"), {
                    ...ce,
                    rebuttal
                  }) : ce))
                });
              }
              return d;
            })));
          },
          onSynthesisStart: () => {
            setCurrentStreamingAgent('synthesis');
          },
          onSynthesisToken: token => {
            setRecentDecisions(stryMutAct_9fa48("22240") ? () => undefined : (stryCov_9fa48("22240"), prev => prev.map(stryMutAct_9fa48("22241") ? () => undefined : (stryCov_9fa48("22241"), d => (stryMutAct_9fa48("22244") ? d.id !== decisionId : stryMutAct_9fa48("22243") ? false : stryMutAct_9fa48("22242") ? true : (stryCov_9fa48("22242", "22243", "22244"), d.id === decisionId)) ? stryMutAct_9fa48("22245") ? {} : (stryCov_9fa48("22245"), {
              ...d,
              response: stryMutAct_9fa48("22246") ? d.response - token : (stryCov_9fa48("22246"), d.response + token)
            }) : d))));
          },
          onComplete: (synthesis, confidence) => {
            setCurrentStreamingAgent(null);
            setCurrentPhase('');
            setStreamingDecision(null);
            setRecentDecisions(stryMutAct_9fa48("22249") ? () => undefined : (stryCov_9fa48("22249"), prev => prev.map(stryMutAct_9fa48("22250") ? () => undefined : (stryCov_9fa48("22250"), d => (stryMutAct_9fa48("22253") ? d.id !== decisionId : stryMutAct_9fa48("22252") ? false : stryMutAct_9fa48("22251") ? true : (stryCov_9fa48("22251", "22252", "22253"), d.id === decisionId)) ? stryMutAct_9fa48("22254") ? {} : (stryCov_9fa48("22254"), {
              ...d,
              response: synthesis,
              confidence,
              currentPhase: 'completed'
            }) : d))));
          }
        }));
      } else {
        // Quick query - use first online agent or Chief Strategy Agent
        const targetAgent = (stryMutAct_9fa48("22260") ? selectedAgents.length <= 0 : stryMutAct_9fa48("22259") ? selectedAgents.length >= 0 : stryMutAct_9fa48("22258") ? false : stryMutAct_9fa48("22257") ? true : (stryCov_9fa48("22257", "22258", "22259", "22260"), selectedAgents.length > 0)) ? stryMutAct_9fa48("22263") ? onlineAgents.find(a => selectedAgents.includes(a.id)) && onlineAgents[0] : stryMutAct_9fa48("22262") ? false : stryMutAct_9fa48("22261") ? true : (stryCov_9fa48("22261", "22262", "22263"), onlineAgents.find(stryMutAct_9fa48("22264") ? () => undefined : (stryCov_9fa48("22264"), a => selectedAgents.includes(a.id))) || onlineAgents[0]) : stryMutAct_9fa48("22267") ? onlineAgents.find(a => a.code === 'chief') && onlineAgents[0] : stryMutAct_9fa48("22266") ? false : stryMutAct_9fa48("22265") ? true : (stryCov_9fa48("22265", "22266", "22267"), onlineAgents.find(stryMutAct_9fa48("22268") ? () => undefined : (stryCov_9fa48("22268"), a => stryMutAct_9fa48("22271") ? a.code !== 'chief' : stryMutAct_9fa48("22270") ? false : stryMutAct_9fa48("22269") ? true : (stryCov_9fa48("22269", "22270", "22271"), a.code === 'chief'))) || onlineAgents[0]);
        if (stryMutAct_9fa48("22275") ? false : stryMutAct_9fa48("22274") ? true : stryMutAct_9fa48("22273") ? targetAgent : (stryCov_9fa48("22273", "22274", "22275"), !targetAgent)) {
          setError('No agents available for query');
          return;
        }
        const result = await ollamaService.queryAgent(targetAgent.id, questionAsked);

        // Add to recent decisions
        const newDecision: QueryResult = stryMutAct_9fa48("22278") ? {} : (stryCov_9fa48("22278"), {
          id: `decision-${Date.now()}`,
          query: questionAsked,
          response: result.response,
          confidence: 85,
          agents: stryMutAct_9fa48("22280") ? [] : (stryCov_9fa48("22280"), [stryMutAct_9fa48("22281") ? {} : (stryCov_9fa48("22281"), {
            id: result.agent.id,
            name: result.agent.name
          })]),
          agentResponses: stryMutAct_9fa48("22282") ? [] : (stryCov_9fa48("22282"), [stryMutAct_9fa48("22283") ? {} : (stryCov_9fa48("22283"), {
            agentId: result.agent.id,
            agentName: result.agent.name,
            agentAvatar: result.agent.avatar,
            agentColor: result.agent.color,
            agentRole: result.agent.role,
            response: result.response,
            duration: result.duration
          })]),
          crossExaminations: stryMutAct_9fa48("22284") ? ["Stryker was here"] : (stryCov_9fa48("22284"), []),
          answeredAt: new Date(),
          mode: 'quick'
        });
        setRecentDecisions(stryMutAct_9fa48("22286") ? () => undefined : (stryCov_9fa48("22286"), prev => stryMutAct_9fa48("22287") ? [newDecision, ...prev] : (stryCov_9fa48("22287"), (stryMutAct_9fa48("22288") ? [] : (stryCov_9fa48("22288"), [newDecision, ...prev])).slice(0, 10))));
      }
    } catch (err: any) {
      setError(stryMutAct_9fa48("22292") ? err.message && 'Failed to process request. Ensure Ollama is running.' : stryMutAct_9fa48("22291") ? false : stryMutAct_9fa48("22290") ? true : (stryCov_9fa48("22290", "22291", "22292"), err.message || 'Failed to process request. Ensure Ollama is running.'));
      console.error('Query error:', err);
    } finally {
      setIsProcessing(stryMutAct_9fa48("22296") ? true : (stryCov_9fa48("22296"), false));

      // Store decision context in vector DB for agent memory (async, non-blocking)
      const latestDecision = recentDecisions[0];
      if (stryMutAct_9fa48("22299") ? latestDecision || latestDecision.response : stryMutAct_9fa48("22298") ? false : stryMutAct_9fa48("22297") ? true : (stryCov_9fa48("22297", "22298", "22299"), latestDecision && latestDecision.response)) {
        sovereignApi.vector.storeDecisionContext(stryMutAct_9fa48("22301") ? {} : (stryCov_9fa48("22301"), {
          decisionId: latestDecision.id,
          title: stryMutAct_9fa48("22302") ? latestDecision.query : (stryCov_9fa48("22302"), latestDecision.query.slice(0, 100)),
          context: latestDecision.query,
          outcome: latestDecision.response,
          confidence: stryMutAct_9fa48("22305") ? latestDecision.confidence && 0 : stryMutAct_9fa48("22304") ? false : stryMutAct_9fa48("22303") ? true : (stryCov_9fa48("22303", "22304", "22305"), latestDecision.confidence || 0),
          participants: stryMutAct_9fa48("22308") ? latestDecision.agents?.map(a => a.name) && [] : stryMutAct_9fa48("22307") ? false : stryMutAct_9fa48("22306") ? true : (stryCov_9fa48("22306", "22307", "22308"), (stryMutAct_9fa48("22309") ? latestDecision.agents.map(a => a.name) : (stryCov_9fa48("22309"), latestDecision.agents?.map(stryMutAct_9fa48("22310") ? () => undefined : (stryCov_9fa48("22310"), a => a.name)))) || (stryMutAct_9fa48("22311") ? ["Stryker was here"] : (stryCov_9fa48("22311"), [])))
        })).catch(stryMutAct_9fa48("22312") ? () => undefined : (stryCov_9fa48("22312"), err => console.warn('[Council] Failed to store decision context:', err)));
      }
    }
  };
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto">
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
            <button onClick={stryMutAct_9fa48("22317") ? () => undefined : (stryCov_9fa48("22317"), () => setShowPremiumModal(stryMutAct_9fa48("22318") ? false : (stryCov_9fa48("22318"), true)))} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg">
              <span>✨</span>
              <span className="font-medium">Premium</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">30 AI Agents</span>
            </button>
            <button onClick={stryMutAct_9fa48("22319") ? () => undefined : (stryCov_9fa48("22319"), () => setShowModesLibrary(stryMutAct_9fa48("22320") ? showModesLibrary : (stryCov_9fa48("22320"), !showModesLibrary)))} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
              <span>📚</span>
              <span className="font-medium">{t('council.modes_library')}</span>
            </button>
            {(stryMutAct_9fa48("22322") ? agents.every(a => a.status === 'online') : (stryCov_9fa48("22322"), agents.some(stryMutAct_9fa48("22323") ? () => undefined : (stryCov_9fa48("22323"), a => stryMutAct_9fa48("22326") ? a.status !== 'online' : stryMutAct_9fa48("22325") ? false : stryMutAct_9fa48("22324") ? true : (stryCov_9fa48("22324", "22325", "22326"), a.status === 'online'))))) ? <div className="flex items-center gap-2 px-3 py-1.5 bg-success-light text-success-dark rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" />
                {t('council.ollama_connected')}
              </div> : <div className="flex items-center gap-2 px-3 py-1.5 bg-error-light text-error-dark rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-error-main" />
                {t('council.ollama_disconnected')}
              </div>}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODES LIBRARY (Expandable) */}
      {/* ================================================================= */}
      {stryMutAct_9fa48("22332") ? showModesLibrary || <div className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{t('council.modes.title')}</h2>
                <p className="text-neutral-600 mt-1">
                  {t('council.modes.subtitle')}
                  <span className="font-semibold text-primary-600 ml-1">{t('council.modes.cultureNote')}</span>
                </p>
              </div>
              <button onClick={() => setShowModesLibrary(false)} className="p-2 hover:bg-white/50 rounded-lg">
                ✕
              </button>
            </div>
          </div>
          
          {/* Quick Reference Table */}
          <div className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">{t('council.modes.quickReference')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">{t('council.modes.mode')}</th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">{t('council.modes.primeDirective')}</th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">{t('council.modes.bestFor')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(COUNCIL_MODES).map(mode => <tr key={mode.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors", selectedMode === mode.id && "bg-primary-50")} onClick={() => {
                setSelectedMode(mode.id);
                setShowModesLibrary(false);
              }}>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-lg">{mode.emoji}</span>
                          <span className="font-medium">{mode.name}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-600 italic">"{mode.primeDirective}"</td>
                      <td className="py-3 px-3 text-neutral-500">{mode.shortDesc}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Mode Details */}
          {selectedMode && <div className="p-6 bg-neutral-50 border-t border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{
            backgroundColor: `${COUNCIL_MODES[selectedMode].color}20`
          }}>
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
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">{t('council.modes.bestFor')}:</h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode].useCases.map((uc, i) => <li key={i} className="flex items-center gap-2">
                            <span className="text-primary-500">•</span> {uc}
                          </li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">{t('council.modes.agentBehavior')}:</h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode].agentBehaviors.slice(0, 4).map((ab, i) => <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">→</span> 
                            <span>{ab}</span>
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div> : stryMutAct_9fa48("22331") ? false : stryMutAct_9fa48("22330") ? true : (stryCov_9fa48("22330", "22331", "22332"), showModesLibrary && <div className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{t('council.modes.title')}</h2>
                <p className="text-neutral-600 mt-1">
                  {t('council.modes.subtitle')}
                  <span className="font-semibold text-primary-600 ml-1">{t('council.modes.cultureNote')}</span>
                </p>
              </div>
              <button onClick={stryMutAct_9fa48("22336") ? () => undefined : (stryCov_9fa48("22336"), () => setShowModesLibrary(stryMutAct_9fa48("22337") ? true : (stryCov_9fa48("22337"), false)))} className="p-2 hover:bg-white/50 rounded-lg">
                ✕
              </button>
            </div>
          </div>
          
          {/* Quick Reference Table */}
          <div className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">{t('council.modes.quickReference')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">{t('council.modes.mode')}</th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">{t('council.modes.primeDirective')}</th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">{t('council.modes.bestFor')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(COUNCIL_MODES).map(stryMutAct_9fa48("22342") ? () => undefined : (stryCov_9fa48("22342"), mode => <tr key={mode.id} className={cn("border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors", stryMutAct_9fa48("22346") ? selectedMode === mode.id || "bg-primary-50" : stryMutAct_9fa48("22345") ? false : stryMutAct_9fa48("22344") ? true : (stryCov_9fa48("22344", "22345", "22346"), (stryMutAct_9fa48("22348") ? selectedMode !== mode.id : stryMutAct_9fa48("22347") ? true : (stryCov_9fa48("22347", "22348"), selectedMode === mode.id)) && "bg-primary-50"))} onClick={() => {
                setSelectedMode(mode.id);
                setShowModesLibrary(stryMutAct_9fa48("22351") ? true : (stryCov_9fa48("22351"), false));
              }}>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-lg">{mode.emoji}</span>
                          <span className="font-medium">{mode.name}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-600 italic">"{mode.primeDirective}"</td>
                      <td className="py-3 px-3 text-neutral-500">{mode.shortDesc}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Mode Details */}
          {stryMutAct_9fa48("22354") ? selectedMode || <div className="p-6 bg-neutral-50 border-t border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{
            backgroundColor: `${COUNCIL_MODES[selectedMode].color}20`
          }}>
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
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">{t('council.modes.bestFor')}:</h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode].useCases.map((uc, i) => <li key={i} className="flex items-center gap-2">
                            <span className="text-primary-500">•</span> {uc}
                          </li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">{t('council.modes.agentBehavior')}:</h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode].agentBehaviors.slice(0, 4).map((ab, i) => <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">→</span> 
                            <span>{ab}</span>
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div> : stryMutAct_9fa48("22353") ? false : stryMutAct_9fa48("22352") ? true : (stryCov_9fa48("22352", "22353", "22354"), selectedMode && <div className="p-6 bg-neutral-50 border-t border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={stryMutAct_9fa48("22355") ? {} : (stryCov_9fa48("22355"), {
            backgroundColor: `${COUNCIL_MODES[selectedMode].color}20`
          })}>
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
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">{t('council.modes.bestFor')}:</h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode].useCases.map(stryMutAct_9fa48("22358") ? () => undefined : (stryCov_9fa48("22358"), (uc, i) => <li key={i} className="flex items-center gap-2">
                            <span className="text-primary-500">•</span> {uc}
                          </li>))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">{t('council.modes.agentBehavior')}:</h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {stryMutAct_9fa48("22360") ? COUNCIL_MODES[selectedMode].agentBehaviors.map((ab, i) => <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">→</span> 
                            <span>{ab}</span>
                          </li>) : (stryCov_9fa48("22360"), COUNCIL_MODES[selectedMode].agentBehaviors.slice(0, 4).map(stryMutAct_9fa48("22361") ? () => undefined : (stryCov_9fa48("22361"), (ab, i) => <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">→</span> 
                            <span>{ab}</span>
                          </li>)))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
        </div>)}

      {/* Error Alert */}
      {stryMutAct_9fa48("22364") ? error || <div className="mb-6 p-4 bg-error-light border border-error-main rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-error-dark">{error}</p>
              <p className="text-sm text-error-dark/80 mt-1">
                To enable AI agents, run: <code className="px-1 py-0.5 bg-white/50 rounded">ollama serve</code> and ensure you have a model: <code className="px-1 py-0.5 bg-white/50 rounded">ollama pull llama3.2</code>
              </p>
            </div>
          </div>
        </div> : stryMutAct_9fa48("22363") ? false : stryMutAct_9fa48("22362") ? true : (stryCov_9fa48("22362", "22363", "22364"), error && <div className="mb-6 p-4 bg-error-light border border-error-main rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-error-dark">{error}</p>
              <p className="text-sm text-error-dark/80 mt-1">
                To enable AI agents, run: <code className="px-1 py-0.5 bg-white/50 rounded">ollama serve</code> and ensure you have a model: <code className="px-1 py-0.5 bg-white/50 rounded">ollama pull llama3.2</code>
              </p>
            </div>
          </div>
        </div>)}

      {/* ================================================================= */}
      {/* AGENT GRID */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">{t('council.agents.domain')}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" /> {t('label.online')}
            </span>
            <span className="flex items-center gap-1 text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-neutral-300" /> {t('label.offline')}
            </span>
          </div>
        </div>
        
        {/* Core C-Suite Agents */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Core C-Suite</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stryMutAct_9fa48("22368") ? allAgents.map(agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={() => toggleAgentSelection(agent.id)} compact />) : (stryCov_9fa48("22368"), allAgents.filter(stryMutAct_9fa48("22369") ? () => undefined : (stryCov_9fa48("22369"), a => stryMutAct_9fa48("22372") ? !a.premium && !a.isCustom || ['chief', 'cfo', 'coo', 'ciso', 'cmo', 'cro', 'cdo', 'risk'].includes(a.code) : stryMutAct_9fa48("22371") ? false : stryMutAct_9fa48("22370") ? true : (stryCov_9fa48("22370", "22371", "22372"), (stryMutAct_9fa48("22374") ? !a.premium || !a.isCustom : stryMutAct_9fa48("22373") ? true : (stryCov_9fa48("22373", "22374"), (stryMutAct_9fa48("22375") ? a.premium : (stryCov_9fa48("22375"), !a.premium)) && (stryMutAct_9fa48("22376") ? a.isCustom : (stryCov_9fa48("22376"), !a.isCustom)))) && (stryMutAct_9fa48("22377") ? [] : (stryCov_9fa48("22377"), ['chief', 'cfo', 'coo', 'ciso', 'cmo', 'cro', 'cdo', 'risk'])).includes(a.code)))).map(stryMutAct_9fa48("22386") ? () => undefined : (stryCov_9fa48("22386"), agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={stryMutAct_9fa48("22387") ? () => undefined : (stryCov_9fa48("22387"), () => toggleAgentSelection(agent.id))} compact />)))}
          </div>
        </div>

        {/* External & Audit Agents - Only show unlocked ones */}
        {stryMutAct_9fa48("22390") ? allAgents.filter(a => a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)).length > 0 || <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">External & Audit Agents</span>
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Premium</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allAgents.filter(a => a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)).map(agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={() => toggleAgentSelection(agent.id)} compact />)}
            </div>
          </div> : stryMutAct_9fa48("22389") ? false : stryMutAct_9fa48("22388") ? true : (stryCov_9fa48("22388", "22389", "22390"), (stryMutAct_9fa48("22393") ? allAgents.filter(a => a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)).length <= 0 : stryMutAct_9fa48("22392") ? allAgents.filter(a => a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)).length >= 0 : stryMutAct_9fa48("22391") ? true : (stryCov_9fa48("22391", "22392", "22393"), (stryMutAct_9fa48("22394") ? allAgents.length : (stryCov_9fa48("22394"), allAgents.filter(stryMutAct_9fa48("22395") ? () => undefined : (stryCov_9fa48("22395"), a => stryMutAct_9fa48("22398") ? a.premium && a.premiumPackage?.includes('Audit') || premium.hasAgentAccess(a.id) : stryMutAct_9fa48("22397") ? false : stryMutAct_9fa48("22396") ? true : (stryCov_9fa48("22396", "22397", "22398"), (stryMutAct_9fa48("22400") ? a.premium || a.premiumPackage?.includes('Audit') : stryMutAct_9fa48("22399") ? true : (stryCov_9fa48("22399", "22400"), a.premium && (stryMutAct_9fa48("22401") ? a.premiumPackage.includes('Audit') : (stryCov_9fa48("22401"), a.premiumPackage?.includes('Audit'))))) && premium.hasAgentAccess(a.id)))).length)) > 0)) && <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">External & Audit Agents</span>
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Premium</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stryMutAct_9fa48("22403") ? allAgents.map(agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={() => toggleAgentSelection(agent.id)} compact />) : (stryCov_9fa48("22403"), allAgents.filter(stryMutAct_9fa48("22404") ? () => undefined : (stryCov_9fa48("22404"), a => stryMutAct_9fa48("22407") ? a.premium && a.premiumPackage?.includes('Audit') || premium.hasAgentAccess(a.id) : stryMutAct_9fa48("22406") ? false : stryMutAct_9fa48("22405") ? true : (stryCov_9fa48("22405", "22406", "22407"), (stryMutAct_9fa48("22409") ? a.premium || a.premiumPackage?.includes('Audit') : stryMutAct_9fa48("22408") ? true : (stryCov_9fa48("22408", "22409"), a.premium && (stryMutAct_9fa48("22410") ? a.premiumPackage.includes('Audit') : (stryCov_9fa48("22410"), a.premiumPackage?.includes('Audit'))))) && premium.hasAgentAccess(a.id)))).map(stryMutAct_9fa48("22412") ? () => undefined : (stryCov_9fa48("22412"), agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={stryMutAct_9fa48("22413") ? () => undefined : (stryCov_9fa48("22413"), () => toggleAgentSelection(agent.id))} compact />)))}
            </div>
          </div>)}

        {/* Clinical / Healthcare Agents - Only show unlocked ones */}
        {stryMutAct_9fa48("22416") ? allAgents.filter(a => a.premium && (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) && premium.hasAgentAccess(a.id)).length > 0 || <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Clinical / Healthcare Agents</span>
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-medium">Healthcare Pack</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allAgents.filter(a => a.premium && (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) && premium.hasAgentAccess(a.id)).map(agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={() => toggleAgentSelection(agent.id)} compact />)}
            </div>
          </div> : stryMutAct_9fa48("22415") ? false : stryMutAct_9fa48("22414") ? true : (stryCov_9fa48("22414", "22415", "22416"), (stryMutAct_9fa48("22419") ? allAgents.filter(a => a.premium && (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) && premium.hasAgentAccess(a.id)).length <= 0 : stryMutAct_9fa48("22418") ? allAgents.filter(a => a.premium && (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) && premium.hasAgentAccess(a.id)).length >= 0 : stryMutAct_9fa48("22417") ? true : (stryCov_9fa48("22417", "22418", "22419"), (stryMutAct_9fa48("22420") ? allAgents.length : (stryCov_9fa48("22420"), allAgents.filter(stryMutAct_9fa48("22421") ? () => undefined : (stryCov_9fa48("22421"), a => stryMutAct_9fa48("22424") ? a.premium && (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) || premium.hasAgentAccess(a.id) : stryMutAct_9fa48("22423") ? false : stryMutAct_9fa48("22422") ? true : (stryCov_9fa48("22422", "22423", "22424"), (stryMutAct_9fa48("22426") ? a.premium || a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical') : stryMutAct_9fa48("22425") ? true : (stryCov_9fa48("22425", "22426"), a.premium && (stryMutAct_9fa48("22428") ? a.premiumPackage?.includes('Healthcare') && a.premiumPackage?.includes('Clinical') : stryMutAct_9fa48("22427") ? true : (stryCov_9fa48("22427", "22428"), (stryMutAct_9fa48("22429") ? a.premiumPackage.includes('Healthcare') : (stryCov_9fa48("22429"), a.premiumPackage?.includes('Healthcare'))) || (stryMutAct_9fa48("22431") ? a.premiumPackage.includes('Clinical') : (stryCov_9fa48("22431"), a.premiumPackage?.includes('Clinical'))))))) && premium.hasAgentAccess(a.id)))).length)) > 0)) && <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Clinical / Healthcare Agents</span>
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-medium">Healthcare Pack</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stryMutAct_9fa48("22433") ? allAgents.map(agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={() => toggleAgentSelection(agent.id)} compact />) : (stryCov_9fa48("22433"), allAgents.filter(stryMutAct_9fa48("22434") ? () => undefined : (stryCov_9fa48("22434"), a => stryMutAct_9fa48("22437") ? a.premium && (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) || premium.hasAgentAccess(a.id) : stryMutAct_9fa48("22436") ? false : stryMutAct_9fa48("22435") ? true : (stryCov_9fa48("22435", "22436", "22437"), (stryMutAct_9fa48("22439") ? a.premium || a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical') : stryMutAct_9fa48("22438") ? true : (stryCov_9fa48("22438", "22439"), a.premium && (stryMutAct_9fa48("22441") ? a.premiumPackage?.includes('Healthcare') && a.premiumPackage?.includes('Clinical') : stryMutAct_9fa48("22440") ? true : (stryCov_9fa48("22440", "22441"), (stryMutAct_9fa48("22442") ? a.premiumPackage.includes('Healthcare') : (stryCov_9fa48("22442"), a.premiumPackage?.includes('Healthcare'))) || (stryMutAct_9fa48("22444") ? a.premiumPackage.includes('Clinical') : (stryCov_9fa48("22444"), a.premiumPackage?.includes('Clinical'))))))) && premium.hasAgentAccess(a.id)))).map(stryMutAct_9fa48("22446") ? () => undefined : (stryCov_9fa48("22446"), agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={stryMutAct_9fa48("22447") ? () => undefined : (stryCov_9fa48("22447"), () => toggleAgentSelection(agent.id))} compact />)))}
            </div>
          </div>)}

        {/* Custom Agents & Unlocked Industry Agents */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Custom Agents</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Show custom agents */}
            {stryMutAct_9fa48("22448") ? allAgents.map(agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={() => toggleAgentSelection(agent.id)} onEdit={() => handleEditCustomAgent(agent)} compact />) : (stryCov_9fa48("22448"), allAgents.filter(stryMutAct_9fa48("22449") ? () => undefined : (stryCov_9fa48("22449"), a => a.isCustom)).map(stryMutAct_9fa48("22450") ? () => undefined : (stryCov_9fa48("22450"), agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={stryMutAct_9fa48("22451") ? () => undefined : (stryCov_9fa48("22451"), () => toggleAgentSelection(agent.id))} onEdit={stryMutAct_9fa48("22452") ? () => undefined : (stryCov_9fa48("22452"), () => handleEditCustomAgent(agent))} compact />)))}
            {/* Show unlocked industry agents */}
            {stryMutAct_9fa48("22453") ? allAgents.map(agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={() => toggleAgentSelection(agent.id)} compact />) : (stryCov_9fa48("22453"), allAgents.filter(a => {
            if (stryMutAct_9fa48("22456") ? false : stryMutAct_9fa48("22455") ? true : (stryCov_9fa48("22455", "22456"), a.isCustom)) return stryMutAct_9fa48("22457") ? true : (stryCov_9fa48("22457"), false);
            if (stryMutAct_9fa48("22460") ? false : stryMutAct_9fa48("22459") ? true : stryMutAct_9fa48("22458") ? a.premium : (stryCov_9fa48("22458", "22459", "22460"), !a.premium)) return stryMutAct_9fa48("22461") ? true : (stryCov_9fa48("22461"), false);
            if (stryMutAct_9fa48("22464") ? a.premiumPackage.includes('Audit') : stryMutAct_9fa48("22463") ? false : stryMutAct_9fa48("22462") ? true : (stryCov_9fa48("22462", "22463", "22464"), a.premiumPackage?.includes('Audit'))) return stryMutAct_9fa48("22466") ? true : (stryCov_9fa48("22466"), false);
            if (stryMutAct_9fa48("22469") ? a.premiumPackage?.includes('Healthcare') && a.premiumPackage?.includes('Clinical') : stryMutAct_9fa48("22468") ? false : stryMutAct_9fa48("22467") ? true : (stryCov_9fa48("22467", "22468", "22469"), (stryMutAct_9fa48("22470") ? a.premiumPackage.includes('Healthcare') : (stryCov_9fa48("22470"), a.premiumPackage?.includes('Healthcare'))) || (stryMutAct_9fa48("22472") ? a.premiumPackage.includes('Clinical') : (stryCov_9fa48("22472"), a.premiumPackage?.includes('Clinical'))))) return stryMutAct_9fa48("22474") ? true : (stryCov_9fa48("22474"), false);
            return premium.hasAgentAccess(a.id);
          }).map(stryMutAct_9fa48("22475") ? () => undefined : (stryCov_9fa48("22475"), agent => <AgentCard key={agent.id} agent={agent} isSelected={selectedAgents.includes(agent.id)} onSelect={stryMutAct_9fa48("22476") ? () => undefined : (stryCov_9fa48("22476"), () => toggleAgentSelection(agent.id))} compact />)))}
          
            {/* Create Custom Agent Button - Premium Feature */}
          <button onClick={() => {
            if (stryMutAct_9fa48("22479") ? false : stryMutAct_9fa48("22478") ? true : (stryCov_9fa48("22478", "22479"), premium.canCreateCustomAgents())) {
              setEditingAgent(null);
              setShowAgentCreator(stryMutAct_9fa48("22481") ? false : (stryCov_9fa48("22481"), true));
            } else {
              setShowPremiumModal(stryMutAct_9fa48("22483") ? false : (stryCov_9fa48("22483"), true));
            }
          }} className={cn("relative p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]", premium.canCreateCustomAgents() ? "border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 hover:shadow-md" : "border-neutral-300 bg-neutral-100 opacity-75 hover:opacity-100 hover:border-amber-400")}>
            {/* Premium/Locked Badge */}
            <div className={cn("absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1", premium.canCreateCustomAgents() ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gradient-to-r from-neutral-400 to-neutral-500")}>
              <span>{premium.canCreateCustomAgents() ? '⭐' : '🔒'}</span>
              <span>{premium.canCreateCustomAgents() ? 'PREMIUM' : 'LOCKED'}</span>
            </div>
            
            {/* Locked Overlay */}
            {stryMutAct_9fa48("22496") ? !premium.canCreateCustomAgents() || <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
                <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                  <span>🔒</span>
                  <span className="text-xs font-semibold text-neutral-700">Unlock</span>
                </div>
              </div> : stryMutAct_9fa48("22495") ? false : stryMutAct_9fa48("22494") ? true : (stryCov_9fa48("22494", "22495", "22496"), (stryMutAct_9fa48("22497") ? premium.canCreateCustomAgents() : (stryCov_9fa48("22497"), !premium.canCreateCustomAgents())) && <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
                <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                  <span>🔒</span>
                  <span className="text-xs font-semibold text-neutral-700">Unlock</span>
                </div>
              </div>)}
            
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl", premium.canCreateCustomAgents() ? "bg-gradient-to-br from-purple-200 to-indigo-200" : "bg-neutral-200")}>
              {premium.canCreateCustomAgents() ? '✨' : '🔒'}
            </div>
            <span className={cn("text-sm font-medium", premium.canCreateCustomAgents() ? "text-purple-700" : "text-neutral-600")}>Create Agent</span>
            <span className={cn("text-xs", premium.canCreateCustomAgents() ? "text-purple-500" : "text-neutral-500")}>Agent Builder Pack</span>
            {stryMutAct_9fa48("22511") ? !premium.canCreateCustomAgents() || <span className="text-[10px] text-amber-600 font-semibold">$199/month</span> : stryMutAct_9fa48("22510") ? false : stryMutAct_9fa48("22509") ? true : (stryCov_9fa48("22509", "22510", "22511"), (stryMutAct_9fa48("22512") ? premium.canCreateCustomAgents() : (stryCov_9fa48("22512"), !premium.canCreateCustomAgents())) && <span className="text-[10px] text-amber-600 font-semibold">$199/month</span>)}
          </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* DROP TO DELIBERATE - Central Council Table */}
      {/* ================================================================= */}
      <div ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={cn("relative mb-6 rounded-2xl border-2 border-dashed transition-all duration-300", isDragging ? "border-amber-400 bg-gradient-to-br from-amber-900/30 to-orange-900/30 scale-[1.02] shadow-2xl shadow-amber-500/20" : droppedFile ? "border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-teal-900/20" : "border-neutral-600/30 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 hover:border-neutral-500/50")}>
        {/* Council Table Visual */}
        <div className="p-6">
          {/* Drop Zone Header */}
          <div className="text-center mb-4">
            <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all", isDragging ? "bg-amber-500/20 text-amber-300 animate-pulse" : droppedFile ? "bg-emerald-500/20 text-emerald-300" : "bg-neutral-700/50 text-neutral-400")}>
              {isDragging ? <>
                  <span className="text-xl animate-bounce">📥</span>
                  <span>Release to analyze with Council</span>
                </> : droppedFile ? <>
                  <span className="text-xl">✅</span>
                  <span>Document staged: {droppedFile.name}</span>
                </> : <>
                  <span className="text-xl">📋</span>
                  <span>Attach Evidence to Deliberation</span>
                </>}
            </div>
          </div>
          
          {/* Circular Council Table with Agent Seats */}
          <div className="relative mx-auto" style={stryMutAct_9fa48("22521") ? {} : (stryCov_9fa48("22521"), {
          width: '320px',
          height: '200px'
        })}>
            {/* Center Table */}
            <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 rounded-full flex items-center justify-center transition-all duration-500", isDragging ? "bg-gradient-to-br from-amber-600/40 to-orange-600/40 shadow-lg shadow-amber-500/30 scale-110" : droppedFile ? "bg-gradient-to-br from-emerald-600/30 to-teal-600/30" : "bg-gradient-to-br from-neutral-700/40 to-neutral-800/40")}>
              {isDragging ? <div className="text-center">
                  <span className="text-3xl animate-bounce">📄</span>
                  <div className="text-xs text-amber-300 font-medium mt-1">Drop Here</div>
                </div> : droppedFile ? <div className="text-center px-2 relative">
                  <span className="text-2xl">📁</span>
                  <div className="text-[10px] text-emerald-300 truncate max-w-[100px]">{droppedFile.name}</div>
                  <button onClick={e => {
                e.stopPropagation();
                setDroppedFile(null);
                setAttachedFiles(stryMutAct_9fa48("22529") ? ["Stryker was here"] : (stryCov_9fa48("22529"), []));
                setExtractedContent('');
              }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center transition-colors" title="Remove document">
                    ✕
                  </button>
                </div> : <div className="text-center">
                  <span className="text-2xl opacity-50">🪑</span>
                  <div className="text-[10px] text-neutral-500">Council Table</div>
                </div>}
            </div>
            
            {/* Agent Seats Around Table */}
            {stryMutAct_9fa48("22532") ? agents.slice(0, 6).map((agent, idx) => {
            const angle = (idx * 60 - 90) * (Math.PI / 180);
            const radius = 90;
            const x = Math.cos(angle) * radius + 160;
            const y = Math.sin(angle) * radius + 100;
            const activation = agentActivations[agent.code];
            return <div key={agent.id} className={cn("absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500", activation && "scale-110 z-10")} style={{
              left: x,
              top: y
            }}>
                  <div className={cn("relative w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300", activation ? "shadow-lg animate-pulse" : selectedAgents.includes(agent.id) ? "opacity-100" : "opacity-50")} style={{
                backgroundColor: activation ? `${activation.color}30` : `${agent.color}20`,
                borderColor: activation ? activation.color : agent.color,
                boxShadow: activation ? `0 0 20px ${activation.color}50` : undefined
              }}>
                    {agent.avatar}
                    
                    {/* Activation Status Badge */}
                    {activation && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-medium animate-fade-in" style={{
                  backgroundColor: `${activation.color}20`,
                  color: activation.color
                }}>
                        {activation.status}
                      </div>}
                  </div>
                  <div className="text-center mt-1">
                    <div className={cn("text-[10px] font-medium", activation ? "text-white" : "text-neutral-500")}>
                      {agent.code.toUpperCase()}
                    </div>
                  </div>
                </div>;
          }) : stryMutAct_9fa48("22531") ? agents.filter(a => ['chief', 'cfo', 'coo', 'ciso', 'risk', 'cdo'].includes(a.code)).map((agent, idx) => {
            const angle = (idx * 60 - 90) * (Math.PI / 180);
            const radius = 90;
            const x = Math.cos(angle) * radius + 160;
            const y = Math.sin(angle) * radius + 100;
            const activation = agentActivations[agent.code];
            return <div key={agent.id} className={cn("absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500", activation && "scale-110 z-10")} style={{
              left: x,
              top: y
            }}>
                  <div className={cn("relative w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300", activation ? "shadow-lg animate-pulse" : selectedAgents.includes(agent.id) ? "opacity-100" : "opacity-50")} style={{
                backgroundColor: activation ? `${activation.color}30` : `${agent.color}20`,
                borderColor: activation ? activation.color : agent.color,
                boxShadow: activation ? `0 0 20px ${activation.color}50` : undefined
              }}>
                    {agent.avatar}
                    
                    {/* Activation Status Badge */}
                    {activation && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-medium animate-fade-in" style={{
                  backgroundColor: `${activation.color}20`,
                  color: activation.color
                }}>
                        {activation.status}
                      </div>}
                  </div>
                  <div className="text-center mt-1">
                    <div className={cn("text-[10px] font-medium", activation ? "text-white" : "text-neutral-500")}>
                      {agent.code.toUpperCase()}
                    </div>
                  </div>
                </div>;
          }) : (stryCov_9fa48("22531", "22532"), agents.filter(stryMutAct_9fa48("22533") ? () => undefined : (stryCov_9fa48("22533"), a => (stryMutAct_9fa48("22534") ? [] : (stryCov_9fa48("22534"), ['chief', 'cfo', 'coo', 'ciso', 'risk', 'cdo'])).includes(a.code))).slice(0, 6).map((agent, idx) => {
            const angle = stryMutAct_9fa48("22542") ? (idx * 60 - 90) / (Math.PI / 180) : (stryCov_9fa48("22542"), (stryMutAct_9fa48("22543") ? idx * 60 + 90 : (stryCov_9fa48("22543"), (stryMutAct_9fa48("22544") ? idx / 60 : (stryCov_9fa48("22544"), idx * 60)) - 90)) * (stryMutAct_9fa48("22545") ? Math.PI * 180 : (stryCov_9fa48("22545"), Math.PI / 180)));
            const radius = 90;
            const x = stryMutAct_9fa48("22546") ? Math.cos(angle) * radius - 160 : (stryCov_9fa48("22546"), (stryMutAct_9fa48("22547") ? Math.cos(angle) / radius : (stryCov_9fa48("22547"), Math.cos(angle) * radius)) + 160);
            const y = stryMutAct_9fa48("22548") ? Math.sin(angle) * radius - 100 : (stryCov_9fa48("22548"), (stryMutAct_9fa48("22549") ? Math.sin(angle) / radius : (stryCov_9fa48("22549"), Math.sin(angle) * radius)) + 100);
            const activation = agentActivations[agent.code];
            return <div key={agent.id} className={cn("absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500", stryMutAct_9fa48("22553") ? activation || "scale-110 z-10" : stryMutAct_9fa48("22552") ? false : stryMutAct_9fa48("22551") ? true : (stryCov_9fa48("22551", "22552", "22553"), activation && "scale-110 z-10"))} style={stryMutAct_9fa48("22555") ? {} : (stryCov_9fa48("22555"), {
              left: x,
              top: y
            })}>
                  <div className={cn("relative w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300", activation ? "shadow-lg animate-pulse" : selectedAgents.includes(agent.id) ? "opacity-100" : "opacity-50")} style={stryMutAct_9fa48("22560") ? {} : (stryCov_9fa48("22560"), {
                backgroundColor: activation ? `${activation.color}30` : `${agent.color}20`,
                borderColor: activation ? activation.color : agent.color,
                boxShadow: activation ? `0 0 20px ${activation.color}50` : undefined
              })}>
                    {agent.avatar}
                    
                    {/* Activation Status Badge */}
                    {stryMutAct_9fa48("22566") ? activation || <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-medium animate-fade-in" style={{
                  backgroundColor: `${activation.color}20`,
                  color: activation.color
                }}>
                        {activation.status}
                      </div> : stryMutAct_9fa48("22565") ? false : stryMutAct_9fa48("22564") ? true : (stryCov_9fa48("22564", "22565", "22566"), activation && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-medium animate-fade-in" style={stryMutAct_9fa48("22567") ? {} : (stryCov_9fa48("22567"), {
                  backgroundColor: `${activation.color}20`,
                  color: activation.color
                })}>
                        {activation.status}
                      </div>)}
                  </div>
                  <div className="text-center mt-1">
                    <div className={cn("text-[10px] font-medium", activation ? "text-white" : "text-neutral-500")}>
                      {stryMutAct_9fa48("22572") ? agent.code.toLowerCase() : (stryCov_9fa48("22572"), agent.code.toUpperCase())}
                    </div>
                  </div>
                </div>;
          }))}
          </div>
          
          {/* Drop Instructions */}
          {stryMutAct_9fa48("22575") ? !droppedFile && !isDragging || <div className="text-center mt-6">
              <p className="text-sm text-neutral-500">
                Drag a <span className="text-amber-400">PDF</span>, <span className="text-emerald-400">Excel</span>, or <span className="text-blue-400">Document</span> here
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                The Council will auto-detect the document type and wake relevant agents
              </p>
            </div> : stryMutAct_9fa48("22574") ? false : stryMutAct_9fa48("22573") ? true : (stryCov_9fa48("22573", "22574", "22575"), (stryMutAct_9fa48("22577") ? !droppedFile || !isDragging : stryMutAct_9fa48("22576") ? true : (stryCov_9fa48("22576", "22577"), (stryMutAct_9fa48("22578") ? droppedFile : (stryCov_9fa48("22578"), !droppedFile)) && (stryMutAct_9fa48("22579") ? isDragging : (stryCov_9fa48("22579"), !isDragging)))) && <div className="text-center mt-6">
              <p className="text-sm text-neutral-500">
                Drag a <span className="text-amber-400">PDF</span>, <span className="text-emerald-400">Excel</span>, or <span className="text-blue-400">Document</span> here
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                The Council will auto-detect the document type and wake relevant agents
              </p>
            </div>)}
          
          {/* Processing Indicator */}
          {stryMutAct_9fa48("22582") ? isProcessingDrop || <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full text-emerald-400 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>Extracting document content...</span>
              </div>
            </div> : stryMutAct_9fa48("22581") ? false : stryMutAct_9fa48("22580") ? true : (stryCov_9fa48("22580", "22581", "22582"), isProcessingDrop && <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full text-emerald-400 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>Extracting document content...</span>
              </div>
            </div>)}
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
                <span className="text-lg">{stryMutAct_9fa48("22585") ? COUNCIL_MODES[selectedMode].emoji : (stryCov_9fa48("22585"), COUNCIL_MODES[selectedMode]?.emoji)}</span>
                <span className="font-medium">{getModeName(selectedMode)}</span>
                <span className="text-white/50">▼</span>
              </button>
              {/* Dropdown Menu - Core modes only, with link to full library */}
              <div className="absolute top-full left-0 mt-1 w-72 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                  Core Modes
                </div>
                {stryMutAct_9fa48("22586") ? Object.values(COUNCIL_MODES).map(mode => <button key={mode.id} onClick={() => setSelectedMode(mode.id)} className={cn("w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-neutral-800 transition-colors", selectedMode === mode.id && "bg-primary-900/50 border-l-2 border-primary-500")}>
                    <span className="text-lg">{mode.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">{getModeName(mode.id)}</div>
                      <div className="text-xs text-neutral-400 truncate">{getModeDirective(mode.id)}</div>
                    </div>
                  </button>) : (stryCov_9fa48("22586"), Object.values(COUNCIL_MODES).filter(stryMutAct_9fa48("22587") ? () => undefined : (stryCov_9fa48("22587"), mode => mode.isCore)).map(stryMutAct_9fa48("22588") ? () => undefined : (stryCov_9fa48("22588"), mode => <button key={mode.id} onClick={stryMutAct_9fa48("22589") ? () => undefined : (stryCov_9fa48("22589"), () => setSelectedMode(mode.id))} className={cn("w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-neutral-800 transition-colors", stryMutAct_9fa48("22593") ? selectedMode === mode.id || "bg-primary-900/50 border-l-2 border-primary-500" : stryMutAct_9fa48("22592") ? false : stryMutAct_9fa48("22591") ? true : (stryCov_9fa48("22591", "22592", "22593"), (stryMutAct_9fa48("22595") ? selectedMode !== mode.id : stryMutAct_9fa48("22594") ? true : (stryCov_9fa48("22594", "22595"), selectedMode === mode.id)) && "bg-primary-900/50 border-l-2 border-primary-500"))}>
                    <span className="text-lg">{mode.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm">{getModeName(mode.id)}</div>
                      <div className="text-xs text-neutral-400 truncate">{getModeDirective(mode.id)}</div>
                    </div>
                  </button>)))}
                <div className="border-t border-neutral-700 p-2">
                  <button onClick={stryMutAct_9fa48("22597") ? () => undefined : (stryCov_9fa48("22597"), () => setShowModesLibrary(stryMutAct_9fa48("22598") ? false : (stryCov_9fa48("22598"), true)))} className="w-full text-center text-xs text-primary-400 hover:text-primary-300 py-1.5 bg-neutral-800/50 rounded">
                    📚 {(stryMutAct_9fa48("22601") ? language !== 'es' : stryMutAct_9fa48("22600") ? false : stryMutAct_9fa48("22599") ? true : (stryCov_9fa48("22599", "22600", "22601"), language === 'es')) ? 'Ver Biblioteca Completa' : 'View Full Modes Library'} ({Object.keys(COUNCIL_MODES).length} modes) →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Mode Info Banner */}
        <div className="mb-4 px-4 py-3 rounded-lg border" style={stryMutAct_9fa48("22605") ? {} : (stryCov_9fa48("22605"), {
        backgroundColor: `${stryMutAct_9fa48("22607") ? COUNCIL_MODES[selectedMode].color : (stryCov_9fa48("22607"), COUNCIL_MODES[selectedMode]?.color)}20`,
        borderColor: `${stryMutAct_9fa48("22609") ? COUNCIL_MODES[selectedMode].color : (stryCov_9fa48("22609"), COUNCIL_MODES[selectedMode]?.color)}40`
      })}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stryMutAct_9fa48("22610") ? COUNCIL_MODES[selectedMode].emoji : (stryCov_9fa48("22610"), COUNCIL_MODES[selectedMode]?.emoji)}</span>
              <div>
                <div className="font-semibold">{getModeName(selectedMode)} {(stryMutAct_9fa48("22613") ? language !== 'es' : stryMutAct_9fa48("22612") ? false : stryMutAct_9fa48("22611") ? true : (stryCov_9fa48("22611", "22612", "22613"), language === 'es')) ? 'Modo' : 'Mode'}</div>
                <div className="text-sm text-white/80 italic">"{getModeDirective(selectedMode)}"</div>
                <div className="text-xs text-white/60 mt-0.5">
                  {(stryMutAct_9fa48("22619") ? language !== 'es' : stryMutAct_9fa48("22618") ? false : stryMutAct_9fa48("22617") ? true : (stryCov_9fa48("22617", "22618", "22619"), language === 'es')) ? 'Ideal para' : 'Best for'}: {stryMutAct_9fa48("22625") ? COUNCIL_MODES[selectedMode]?.shortDesc && 'Strategic decisions' : stryMutAct_9fa48("22624") ? false : stryMutAct_9fa48("22623") ? true : (stryCov_9fa48("22623", "22624", "22625"), (stryMutAct_9fa48("22626") ? COUNCIL_MODES[selectedMode].shortDesc : (stryCov_9fa48("22626"), COUNCIL_MODES[selectedMode]?.shortDesc)) || 'Strategic decisions')}
                </div>
              </div>
            </div>
            <div className="text-sm text-white/60">
              {(stryMutAct_9fa48("22630") ? language !== 'es' : stryMutAct_9fa48("22629") ? false : stryMutAct_9fa48("22628") ? true : (stryCov_9fa48("22628", "22629", "22630"), language === 'es')) ? 'Líder' : 'Lead'}: {stryMutAct_9fa48("22635") ? COUNCIL_MODES[selectedMode].leadAgent.toUpperCase() : stryMutAct_9fa48("22634") ? COUNCIL_MODES[selectedMode]?.leadAgent.toLowerCase() : (stryCov_9fa48("22634", "22635"), COUNCIL_MODES[selectedMode]?.leadAgent.toUpperCase())}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <textarea ref={queryInputRef} value={queryInput} onChange={stryMutAct_9fa48("22636") ? () => undefined : (stryCov_9fa48("22636"), e => setQueryInput(e.target.value))} placeholder={t('council.placeholder')} rows={3} className={cn('w-full px-4 py-3 rounded-lg resize-none', 'bg-white/10 border border-white/20', 'text-white placeholder:text-white/60', 'focus:outline-none focus:ring-2 focus:ring-white/30')} />
          
          {/* Document Attachment Section */}
          <div className="mt-3">
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.pptx,.ppt,.csv,.json,.md" onChange={async e => {
            const files = Array.from(stryMutAct_9fa48("22645") ? e.target.files && [] : stryMutAct_9fa48("22644") ? false : stryMutAct_9fa48("22643") ? true : (stryCov_9fa48("22643", "22644", "22645"), e.target.files || (stryMutAct_9fa48("22646") ? ["Stryker was here"] : (stryCov_9fa48("22646"), []))));
            if (stryMutAct_9fa48("22650") ? files.length <= 0 : stryMutAct_9fa48("22649") ? files.length >= 0 : stryMutAct_9fa48("22648") ? false : stryMutAct_9fa48("22647") ? true : (stryCov_9fa48("22647", "22648", "22649", "22650"), files.length > 0)) {
              setAttachedFiles(stryMutAct_9fa48("22652") ? () => undefined : (stryCov_9fa48("22652"), prev => stryMutAct_9fa48("22653") ? [] : (stryCov_9fa48("22653"), [...prev, ...files])));
              // Extract text content using Tika
              for (const file of files) {
                try {
                  const mimeType = stryMutAct_9fa48("22658") ? file.type && 'application/octet-stream' : stryMutAct_9fa48("22657") ? false : stryMutAct_9fa48("22656") ? true : (stryCov_9fa48("22656", "22657", "22658"), file.type || 'application/octet-stream');
                  let result: any = null;
                  let vaultDoc: any = null;
                  try {
                    vaultDoc = await vaultApi.uploadDocument(file, 'council-documents', stryMutAct_9fa48("22662") ? {} : (stryCov_9fa48("22662"), {
                      uploadedBy: 'council-user',
                      deliberationType: selectedMode
                    }));
                  } catch {
                    vaultDoc = null;
                  }
                  if (stryMutAct_9fa48("22667") ? vaultDoc && typeof vaultDoc.id === 'string' || !vaultDoc.id.startsWith('local-') : stryMutAct_9fa48("22666") ? false : stryMutAct_9fa48("22665") ? true : (stryCov_9fa48("22665", "22666", "22667"), (stryMutAct_9fa48("22669") ? vaultDoc || typeof vaultDoc.id === 'string' : stryMutAct_9fa48("22668") ? true : (stryCov_9fa48("22668", "22669"), vaultDoc && (stryMutAct_9fa48("22671") ? typeof vaultDoc.id !== 'string' : stryMutAct_9fa48("22670") ? true : (stryCov_9fa48("22670", "22671"), typeof vaultDoc.id === 'string')))) && (stryMutAct_9fa48("22673") ? vaultDoc.id.startsWith('local-') : (stryCov_9fa48("22673"), !(stryMutAct_9fa48("22674") ? vaultDoc.id.endsWith('local-') : (stryCov_9fa48("22674"), vaultDoc.id.startsWith('local-'))))))) {
                    result = await enterpriseApi.extractDocumentFromVault(vaultDoc.bucket, vaultDoc.path, mimeType, file.name);
                  } else if (stryMutAct_9fa48("22680") ? file.size > 5 * 1024 * 1024 : stryMutAct_9fa48("22679") ? file.size < 5 * 1024 * 1024 : stryMutAct_9fa48("22678") ? false : stryMutAct_9fa48("22677") ? true : (stryCov_9fa48("22677", "22678", "22679", "22680"), file.size <= (stryMutAct_9fa48("22681") ? 5 * 1024 / 1024 : (stryCov_9fa48("22681"), (stryMutAct_9fa48("22682") ? 5 / 1024 : (stryCov_9fa48("22682"), 5 * 1024)) * 1024)))) {
                    // Convert file to base64 (small files only)
                    const base64 = await new Promise<string>(resolve => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const r = reader.result as string;
                        resolve(stryMutAct_9fa48("22688") ? r.split(',')[1] && r : stryMutAct_9fa48("22687") ? false : stryMutAct_9fa48("22686") ? true : (stryCov_9fa48("22686", "22687", "22688"), r.split(',')[1] || r));
                      };
                      reader.readAsDataURL(file);
                    });
                    result = await enterpriseApi.extractDocument(base64, mimeType, file.name);
                  }
                  if (stryMutAct_9fa48("22692") ? result.text : stryMutAct_9fa48("22691") ? false : stryMutAct_9fa48("22690") ? true : (stryCov_9fa48("22690", "22691", "22692"), result?.text)) {
                    setExtractedContent(stryMutAct_9fa48("22694") ? () => undefined : (stryCov_9fa48("22694"), prev => (stryMutAct_9fa48("22695") ? prev - (prev ? '\n\n---\n\n' : '') : (stryCov_9fa48("22695"), prev + (prev ? '\n\n---\n\n' : ''))) + `[Document: ${file.name}]\n${result.text}`));
                  }
                } catch (err) {
                  console.log('Document extraction not available, using filename only');
                }
              }
            }
            e.target.value = '';
          }} className="hidden" />
            
            <div className="flex items-center gap-3">
              <button type="button" onClick={stryMutAct_9fa48("22702") ? () => undefined : (stryCov_9fa48("22702"), () => stryMutAct_9fa48("22703") ? fileInputRef.current.click() : (stryCov_9fa48("22703"), fileInputRef.current?.click()))} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors">
                <span>📎</span>
                <span>Attach Documents</span>
              </button>
              
              {stryMutAct_9fa48("22706") ? attachedFiles.length > 0 || <div className="flex items-center gap-2 flex-wrap">
                  {attachedFiles.map((file, idx) => <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-white/20 rounded text-xs">
                      <span>📄</span>
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button onClick={() => {
                  setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
                  setExtractedContent('');
                }} className="hover:text-red-300">
                        ✕
                      </button>
                    </div>)}
                </div> : stryMutAct_9fa48("22705") ? false : stryMutAct_9fa48("22704") ? true : (stryCov_9fa48("22704", "22705", "22706"), (stryMutAct_9fa48("22709") ? attachedFiles.length <= 0 : stryMutAct_9fa48("22708") ? attachedFiles.length >= 0 : stryMutAct_9fa48("22707") ? true : (stryCov_9fa48("22707", "22708", "22709"), attachedFiles.length > 0)) && <div className="flex items-center gap-2 flex-wrap">
                  {attachedFiles.map(stryMutAct_9fa48("22710") ? () => undefined : (stryCov_9fa48("22710"), (file, idx) => <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-white/20 rounded text-xs">
                      <span>📄</span>
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button onClick={() => {
                  setAttachedFiles(stryMutAct_9fa48("22712") ? () => undefined : (stryCov_9fa48("22712"), prev => stryMutAct_9fa48("22713") ? prev : (stryCov_9fa48("22713"), prev.filter(stryMutAct_9fa48("22714") ? () => undefined : (stryCov_9fa48("22714"), (_, i) => stryMutAct_9fa48("22717") ? i === idx : stryMutAct_9fa48("22716") ? false : stryMutAct_9fa48("22715") ? true : (stryCov_9fa48("22715", "22716", "22717"), i !== idx))))));
                  setExtractedContent('');
                }} className="hover:text-red-300">
                        ✕
                      </button>
                    </div>))}
                </div>)}
            </div>
            
            {stryMutAct_9fa48("22721") ? attachedFiles.length > 0 || <p className="text-xs text-white/60 mt-2">
                📋 {attachedFiles.length} document{attachedFiles.length > 1 ? 's' : ''} attached. 
                The Council will analyze {attachedFiles.length > 1 ? 'these documents' : 'this document'} during deliberation.
              </p> : stryMutAct_9fa48("22720") ? false : stryMutAct_9fa48("22719") ? true : (stryCov_9fa48("22719", "22720", "22721"), (stryMutAct_9fa48("22724") ? attachedFiles.length <= 0 : stryMutAct_9fa48("22723") ? attachedFiles.length >= 0 : stryMutAct_9fa48("22722") ? true : (stryCov_9fa48("22722", "22723", "22724"), attachedFiles.length > 0)) && <p className="text-xs text-white/60 mt-2">
                📋 {attachedFiles.length} document{(stryMutAct_9fa48("22728") ? attachedFiles.length <= 1 : stryMutAct_9fa48("22727") ? attachedFiles.length >= 1 : stryMutAct_9fa48("22726") ? false : stryMutAct_9fa48("22725") ? true : (stryCov_9fa48("22725", "22726", "22727", "22728"), attachedFiles.length > 1)) ? 's' : ''} attached. 
                The Council will analyze {(stryMutAct_9fa48("22734") ? attachedFiles.length <= 1 : stryMutAct_9fa48("22733") ? attachedFiles.length >= 1 : stryMutAct_9fa48("22732") ? false : stryMutAct_9fa48("22731") ? true : (stryCov_9fa48("22731", "22732", "22733", "22734"), attachedFiles.length > 1)) ? 'these documents' : 'this document'} during deliberation.
              </p>)}
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
                <input type="checkbox" checked={isRosterLocked} onChange={stryMutAct_9fa48("22737") ? () => undefined : (stryCov_9fa48("22737"), e => setIsRosterLocked(e.target.checked))} className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-amber-500 focus:ring-amber-500 focus:ring-offset-0" />
                <span className={isRosterLocked ? 'text-amber-400' : ''}>
                  {isRosterLocked ? '🔒 Roster Locked' : '🔓 Lock for Audit'}
                </span>
              </label>
              <button onClick={selectAllAgents} disabled={isRosterLocked} className={cn("text-xs underline", isRosterLocked ? "text-white/30 cursor-not-allowed" : "text-white/70 hover:text-white")}>
                Select all online
              </button>
            </div>
          </div>
          
          {/* Selected Agents Pill Row */}
          <div className="flex flex-wrap gap-2">
            {(stryMutAct_9fa48("22747") ? selectedAgents.length !== 0 : stryMutAct_9fa48("22746") ? false : stryMutAct_9fa48("22745") ? true : (stryCov_9fa48("22745", "22746", "22747"), selectedAgents.length === 0)) ? <span className="text-sm text-white/50 italic">All available agents will be consulted</span> : selectedAgents.map(id => {
            const agent = agents.find(stryMutAct_9fa48("22749") ? () => undefined : (stryCov_9fa48("22749"), a => stryMutAct_9fa48("22752") ? a.id !== id : stryMutAct_9fa48("22751") ? false : stryMutAct_9fa48("22750") ? true : (stryCov_9fa48("22750", "22751", "22752"), a.id === id)));
            if (stryMutAct_9fa48("22755") ? false : stryMutAct_9fa48("22754") ? true : stryMutAct_9fa48("22753") ? agent : (stryCov_9fa48("22753", "22754", "22755"), !agent)) return null;
            return <div key={id} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all", isRosterLocked ? "bg-amber-900/30 border border-amber-700/50" : "bg-white/10 border border-white/20 hover:border-red-500/50 group")}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={stryMutAct_9fa48("22759") ? {} : (stryCov_9fa48("22759"), {
                backgroundColor: agent.color
              })}>
                      {agent.avatar}
                    </div>
                    <span className="text-white/90">{stryMutAct_9fa48("22760") ? agent.name.replace('Cendia', '').replace(' Agent', '') : (stryCov_9fa48("22760"), agent.name.replace('Cendia', '').replace(' Agent', '').trim())}</span>
                    {stryMutAct_9fa48("22767") ? !isRosterLocked || <button onClick={() => setSelectedAgents(prev => prev.filter(a => a !== id))} className="text-white/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" title="Remove agent">
                        ✕
                      </button> : stryMutAct_9fa48("22766") ? false : stryMutAct_9fa48("22765") ? true : (stryCov_9fa48("22765", "22766", "22767"), (stryMutAct_9fa48("22768") ? isRosterLocked : (stryCov_9fa48("22768"), !isRosterLocked)) && <button onClick={stryMutAct_9fa48("22769") ? () => undefined : (stryCov_9fa48("22769"), () => setSelectedAgents(stryMutAct_9fa48("22770") ? () => undefined : (stryCov_9fa48("22770"), prev => stryMutAct_9fa48("22771") ? prev : (stryCov_9fa48("22771"), prev.filter(stryMutAct_9fa48("22772") ? () => undefined : (stryCov_9fa48("22772"), a => stryMutAct_9fa48("22775") ? a === id : stryMutAct_9fa48("22774") ? false : stryMutAct_9fa48("22773") ? true : (stryCov_9fa48("22773", "22774", "22775"), a !== id)))))))} className="text-white/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" title="Remove agent">
                        ✕
                      </button>)}
                  </div>;
          })}
          </div>
          
          {stryMutAct_9fa48("22778") ? isRosterLocked || <p className="mt-2 text-xs text-amber-400/80">
              🔒 Agent roster is locked for audit compliance. Unlock to modify.
            </p> : stryMutAct_9fa48("22777") ? false : stryMutAct_9fa48("22776") ? true : (stryCov_9fa48("22776", "22777", "22778"), isRosterLocked && <p className="mt-2 text-xs text-amber-400/80">
              🔒 Agent roster is locked for audit compliance. Unlock to modify.
            </p>)}
        </div>
        
        {/* Query mode and submit */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button onClick={stryMutAct_9fa48("22779") ? () => undefined : (stryCov_9fa48("22779"), () => setQueryMode('quick'))} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors', (stryMutAct_9fa48("22784") ? queryMode !== 'quick' : stryMutAct_9fa48("22783") ? false : stryMutAct_9fa48("22782") ? true : (stryCov_9fa48("22782", "22783", "22784"), queryMode === 'quick')) ? 'bg-white text-primary-600' : 'text-white/70 hover:text-white')}>
              ⚡ Quick Brief
            </button>
            <button onClick={stryMutAct_9fa48("22788") ? () => undefined : (stryCov_9fa48("22788"), () => setQueryMode('deliberation'))} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors', (stryMutAct_9fa48("22793") ? queryMode !== 'deliberation' : stryMutAct_9fa48("22792") ? false : stryMutAct_9fa48("22791") ? true : (stryCov_9fa48("22791", "22792", "22793"), queryMode === 'deliberation')) ? 'bg-white text-primary-600' : 'text-white/70 hover:text-white')}>
              ⚖️ Governed Deliberation
            </button>
          </div>
          
          {/* Generate Minutes & Brief toggle - shown for Full Deliberation */}
          {stryMutAct_9fa48("22799") ? queryMode === 'deliberation' || <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
              <input type="checkbox" defaultChecked={true} className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0" />
              <span className="group-hover:text-white transition-colors">📝 Generate Minutes & Brief</span>
            </label> : stryMutAct_9fa48("22798") ? false : stryMutAct_9fa48("22797") ? true : (stryCov_9fa48("22797", "22798", "22799"), (stryMutAct_9fa48("22801") ? queryMode !== 'deliberation' : stryMutAct_9fa48("22800") ? true : (stryCov_9fa48("22800", "22801"), queryMode === 'deliberation')) && <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
              <input type="checkbox" defaultChecked={stryMutAct_9fa48("22803") ? false : (stryCov_9fa48("22803"), true)} className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0" />
              <span className="group-hover:text-white transition-colors">📝 Generate Minutes & Brief</span>
            </label>)}
          
          <button onClick={handleSubmit} disabled={stryMutAct_9fa48("22806") ? !queryInput.trim() && isProcessing : stryMutAct_9fa48("22805") ? false : stryMutAct_9fa48("22804") ? true : (stryCov_9fa48("22804", "22805", "22806"), (stryMutAct_9fa48("22807") ? queryInput.trim() : (stryCov_9fa48("22807"), !(stryMutAct_9fa48("22808") ? queryInput : (stryCov_9fa48("22808"), queryInput.trim())))) || isProcessing)} className={cn('flex-1 lg:flex-none px-8 py-2.5 rounded-lg font-medium transition-colors', 'bg-white text-primary-600 hover:bg-white/90', 'disabled:opacity-50 disabled:cursor-not-allowed')}>
            {isProcessing ? <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                Processing...
              </span> : (stryMutAct_9fa48("22814") ? queryMode !== 'quick' : stryMutAct_9fa48("22813") ? false : stryMutAct_9fa48("22812") ? true : (stryCov_9fa48("22812", "22813", "22814"), queryMode === 'quick')) ? '⚡ Get Quick Brief' : '⚖️ Start Deliberation'}
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
          {(stryMutAct_9fa48("22823") ? recentDecisions.length <= 0 : stryMutAct_9fa48("22822") ? recentDecisions.length >= 0 : stryMutAct_9fa48("22821") ? false : stryMutAct_9fa48("22820") ? true : (stryCov_9fa48("22820", "22821", "22822", "22823"), recentDecisions.length > 0)) ? recentDecisions.map(stryMutAct_9fa48("22824") ? () => undefined : (stryCov_9fa48("22824"), result => <div key={result.id} className="p-6">
              {/* Session Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={cn('px-2 py-1 rounded text-xs font-medium', (stryMutAct_9fa48("22828") ? result.mode !== 'deliberation' : stryMutAct_9fa48("22827") ? false : stryMutAct_9fa48("22826") ? true : (stryCov_9fa48("22826", "22827", "22828"), result.mode === 'deliberation')) ? 'bg-orange-900/50 text-orange-400' : 'bg-blue-900/50 text-blue-400')}>
                    {(stryMutAct_9fa48("22834") ? result.mode !== 'deliberation' : stryMutAct_9fa48("22833") ? false : stryMutAct_9fa48("22832") ? true : (stryCov_9fa48("22832", "22833", "22834"), result.mode === 'deliberation')) ? '⚖️ GOVERNED DELIBERATION' : '⚡ QUICK BRIEF'}
                  </span>
                  <span className={cn('px-2 py-1 rounded text-xs font-medium', (stryMutAct_9fa48("22841") ? !result.confidence && result.confidence === 0 : stryMutAct_9fa48("22840") ? false : stryMutAct_9fa48("22839") ? true : (stryCov_9fa48("22839", "22840", "22841"), (stryMutAct_9fa48("22842") ? result.confidence : (stryCov_9fa48("22842"), !result.confidence)) || (stryMutAct_9fa48("22844") ? result.confidence !== 0 : stryMutAct_9fa48("22843") ? false : (stryCov_9fa48("22843", "22844"), result.confidence === 0)))) ? 'bg-neutral-800 text-neutral-400' : (stryMutAct_9fa48("22849") ? result.confidence < 90 : stryMutAct_9fa48("22848") ? result.confidence > 90 : stryMutAct_9fa48("22847") ? false : stryMutAct_9fa48("22846") ? true : (stryCov_9fa48("22846", "22847", "22848", "22849"), result.confidence >= 90)) ? 'bg-green-900/50 text-green-400' : (stryMutAct_9fa48("22854") ? result.confidence < 70 : stryMutAct_9fa48("22853") ? result.confidence > 70 : stryMutAct_9fa48("22852") ? false : stryMutAct_9fa48("22851") ? true : (stryCov_9fa48("22851", "22852", "22853", "22854"), result.confidence >= 70)) ? 'bg-yellow-900/50 text-yellow-400' : (stryMutAct_9fa48("22859") ? result.confidence < 50 : stryMutAct_9fa48("22858") ? result.confidence > 50 : stryMutAct_9fa48("22857") ? false : stryMutAct_9fa48("22856") ? true : (stryCov_9fa48("22856", "22857", "22858", "22859"), result.confidence >= 50)) ? 'bg-orange-900/50 text-orange-400' : 'bg-neutral-700 text-neutral-300')}>
                    {(stryMutAct_9fa48("22864") ? !result.confidence && result.confidence === 0 : stryMutAct_9fa48("22863") ? false : stryMutAct_9fa48("22862") ? true : (stryCov_9fa48("22862", "22863", "22864"), (stryMutAct_9fa48("22865") ? result.confidence : (stryCov_9fa48("22865"), !result.confidence)) || (stryMutAct_9fa48("22867") ? result.confidence !== 0 : stryMutAct_9fa48("22866") ? false : (stryCov_9fa48("22866", "22867"), result.confidence === 0)))) ? (stryMutAct_9fa48("22870") ? result.currentPhase || result.currentPhase !== 'completed' : stryMutAct_9fa48("22869") ? false : stryMutAct_9fa48("22868") ? true : (stryCov_9fa48("22868", "22869", "22870"), result.currentPhase && (stryMutAct_9fa48("22872") ? result.currentPhase === 'completed' : stryMutAct_9fa48("22871") ? true : (stryCov_9fa48("22871", "22872"), result.currentPhase !== 'completed')))) ? '◐ Calibrating...' : (stryMutAct_9fa48("22877") ? result.agentResponses?.length !== 0 : stryMutAct_9fa48("22876") ? false : stryMutAct_9fa48("22875") ? true : (stryCov_9fa48("22875", "22876", "22877"), (stryMutAct_9fa48("22878") ? result.agentResponses.length : (stryCov_9fa48("22878"), result.agentResponses?.length)) === 0)) ? '○ Pending Evidence' : '—' : (stryMutAct_9fa48("22884") ? result.confidence < 90 : stryMutAct_9fa48("22883") ? result.confidence > 90 : stryMutAct_9fa48("22882") ? false : stryMutAct_9fa48("22881") ? true : (stryCov_9fa48("22881", "22882", "22883", "22884"), result.confidence >= 90)) ? '● High Confidence' : (stryMutAct_9fa48("22889") ? result.confidence < 70 : stryMutAct_9fa48("22888") ? result.confidence > 70 : stryMutAct_9fa48("22887") ? false : stryMutAct_9fa48("22886") ? true : (stryCov_9fa48("22886", "22887", "22888", "22889"), result.confidence >= 70)) ? '◑ Medium Confidence' : '○ Low Confidence'}
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
                      {(stryMutAct_9fa48("22895") ? result.query.length <= 80 : stryMutAct_9fa48("22894") ? result.query.length >= 80 : stryMutAct_9fa48("22893") ? false : stryMutAct_9fa48("22892") ? true : (stryCov_9fa48("22892", "22893", "22894", "22895"), result.query.length > 80)) ? (stryMutAct_9fa48("22896") ? result.query : (stryCov_9fa48("22896"), result.query.slice(0, 80))) + '...' : result.query}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Owner */}
                      <span className="px-2 py-1 bg-neutral-700 rounded text-neutral-300">
                        👤 Owner: <span className="text-white font-medium">Current User</span>
                      </span>
                      {/* Mode */}
                      <span className={cn('px-2 py-1 rounded', (stryMutAct_9fa48("22901") ? result.mode !== 'deliberation' : stryMutAct_9fa48("22900") ? false : stryMutAct_9fa48("22899") ? true : (stryCov_9fa48("22899", "22900", "22901"), result.mode === 'deliberation')) ? 'bg-orange-900/30 text-orange-400' : 'bg-blue-900/30 text-blue-400')}>
                        {(stryMutAct_9fa48("22907") ? result.mode !== 'deliberation' : stryMutAct_9fa48("22906") ? false : stryMutAct_9fa48("22905") ? true : (stryCov_9fa48("22905", "22906", "22907"), result.mode === 'deliberation')) ? '⚖️ Governed Deliberation' : '⚡ Quick Brief'}
                      </span>
                      {/* Inputs */}
                      <span className="px-2 py-1 bg-neutral-700 rounded text-neutral-300">
                        📎 Inputs: <span className="text-white font-medium">{stryMutAct_9fa48("22913") ? result.agentResponses?.length && 0 : stryMutAct_9fa48("22912") ? false : stryMutAct_9fa48("22911") ? true : (stryCov_9fa48("22911", "22912", "22913"), (stryMutAct_9fa48("22914") ? result.agentResponses.length : (stryCov_9fa48("22914"), result.agentResponses?.length)) || 0)} analyses</span>
                      </span>
                    </div>
                  </div>
                  {/* Status */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn('px-3 py-1.5 rounded-full text-xs font-semibold', (stryMutAct_9fa48("22918") ? result.currentPhase === 'completed' && !result.currentPhase : stryMutAct_9fa48("22917") ? false : stryMutAct_9fa48("22916") ? true : (stryCov_9fa48("22916", "22917", "22918"), (stryMutAct_9fa48("22920") ? result.currentPhase !== 'completed' : stryMutAct_9fa48("22919") ? false : (stryCov_9fa48("22919", "22920"), result.currentPhase === 'completed')) || (stryMutAct_9fa48("22922") ? result.currentPhase : (stryCov_9fa48("22922"), !result.currentPhase)))) ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700')}>
                      {(stryMutAct_9fa48("22927") ? result.currentPhase === 'completed' && !result.currentPhase : stryMutAct_9fa48("22926") ? false : stryMutAct_9fa48("22925") ? true : (stryCov_9fa48("22925", "22926", "22927"), (stryMutAct_9fa48("22929") ? result.currentPhase !== 'completed' : stryMutAct_9fa48("22928") ? false : (stryCov_9fa48("22928", "22929"), result.currentPhase === 'completed')) || (stryMutAct_9fa48("22931") ? result.currentPhase : (stryCov_9fa48("22931"), !result.currentPhase)))) ? '✓ Logged' : '◐ In Review'}
                    </span>
                    {/* Impacted Domains */}
                    <div className="flex gap-1">
                      {stryMutAct_9fa48("22934") ? ['Finance', 'Ops', 'Risk'].map((domain, i) => <span key={i} className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400">
                          {domain}
                        </span>) : (stryCov_9fa48("22934"), (stryMutAct_9fa48("22935") ? [] : (stryCov_9fa48("22935"), ['Finance', 'Ops', 'Risk'])).slice(0, stryMutAct_9fa48("22939") ? Math.max(3, result.agents?.length || 1) : (stryCov_9fa48("22939"), Math.min(3, stryMutAct_9fa48("22942") ? result.agents?.length && 1 : stryMutAct_9fa48("22941") ? false : stryMutAct_9fa48("22940") ? true : (stryCov_9fa48("22940", "22941", "22942"), (stryMutAct_9fa48("22943") ? result.agents.length : (stryCov_9fa48("22943"), result.agents?.length)) || 1)))).map(stryMutAct_9fa48("22944") ? () => undefined : (stryCov_9fa48("22944"), (domain, i) => <span key={i} className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400">
                          {domain}
                        </span>)))}
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
              {stryMutAct_9fa48("22947") ? result.currentPhase && result.currentPhase !== 'completed' || <div className="flex items-center gap-2 mb-4 ml-14">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-xs text-orange-400 font-mono uppercase">
                    {result.currentPhase.replace('_', ' ')} in progress...
                  </span>
                </div> : stryMutAct_9fa48("22946") ? false : stryMutAct_9fa48("22945") ? true : (stryCov_9fa48("22945", "22946", "22947"), (stryMutAct_9fa48("22949") ? result.currentPhase || result.currentPhase !== 'completed' : stryMutAct_9fa48("22948") ? true : (stryCov_9fa48("22948", "22949"), result.currentPhase && (stryMutAct_9fa48("22951") ? result.currentPhase === 'completed' : stryMutAct_9fa48("22950") ? true : (stryCov_9fa48("22950", "22951"), result.currentPhase !== 'completed')))) && <div className="flex items-center gap-2 mb-4 ml-14">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-xs text-orange-400 font-mono uppercase">
                    {result.currentPhase.replace('_', ' ')} in progress...
                  </span>
                </div>)}

              {/* C) Progressive Disclosure - Answer First, Then Debate */}
              <div className="space-y-4">
                
                {/* TOP SECTION: Council Recommendation (shown first, always visible) */}
                {stryMutAct_9fa48("22957") ? result.response || <div className="bg-gradient-to-r from-primary-900/30 to-emerald-900/30 rounded-xl p-5 border border-primary-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-xl">
                        🎯
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Council Recommendation</h4>
                        <span className="text-xs text-primary-400">Synthesized from {result.agentResponses?.length || 0} expert analyses</span>
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
                        <div className="text-xs text-amber-400 font-semibold mb-2">⚠️ Risks & Constraints</div>
                        <ul className="text-xs text-neutral-400 space-y-1">
                          <li>• Review assumptions before proceeding</li>
                          <li>• Consider resource availability</li>
                        </ul>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-3">
                        <div className="text-xs text-emerald-400 font-semibold mb-2">✓ Next Actions</div>
                        <ul className="text-xs text-neutral-400 space-y-1">
                          <li>☐ Assign decision owner</li>
                          <li>☐ Set review deadline</li>
                        </ul>
                      </div>
                    </div>
                  </div> : stryMutAct_9fa48("22956") ? false : stryMutAct_9fa48("22955") ? true : (stryCov_9fa48("22955", "22956", "22957"), result.response && <div className="bg-gradient-to-r from-primary-900/30 to-emerald-900/30 rounded-xl p-5 border border-primary-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-xl">
                        🎯
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">Council Recommendation</h4>
                        <span className="text-xs text-primary-400">Synthesized from {stryMutAct_9fa48("22960") ? result.agentResponses?.length && 0 : stryMutAct_9fa48("22959") ? false : stryMutAct_9fa48("22958") ? true : (stryCov_9fa48("22958", "22959", "22960"), (stryMutAct_9fa48("22961") ? result.agentResponses.length : (stryCov_9fa48("22961"), result.agentResponses?.length)) || 0)} expert analyses</span>
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
                        <div className="text-xs text-amber-400 font-semibold mb-2">⚠️ Risks & Constraints</div>
                        <ul className="text-xs text-neutral-400 space-y-1">
                          <li>• Review assumptions before proceeding</li>
                          <li>• Consider resource availability</li>
                        </ul>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-3">
                        <div className="text-xs text-emerald-400 font-semibold mb-2">✓ Next Actions</div>
                        <ul className="text-xs text-neutral-400 space-y-1">
                          <li>☐ Assign decision owner</li>
                          <li>☐ Set review deadline</li>
                        </ul>
                      </div>
                    </div>
                  </div>)}

                {/* COLLAPSIBLE: Agent Analyses */}
                {stryMutAct_9fa48("22964") ? result.agentResponses && result.agentResponses.length > 0 || <div className="border border-neutral-700 rounded-xl overflow-hidden">
                    <button onClick={() => toggleSection(result.id, 'agents')} className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-750 transition-colors">
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
                    {isSectionExpanded(result.id, 'agents') && <div className="p-4 space-y-4 bg-neutral-900/50">
                        {result.agentResponses.map(agentResp => <div key={agentResp.agentId} className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[50px]">
                              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl", agentResp.isStreaming && "ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900")} style={{
                      backgroundColor: agentResp.agentColor
                    }}>
                                {agentResp.agentAvatar}
                              </div>
                              <span className="text-[10px] text-neutral-500 font-medium text-center">
                                {agentResp.agentName.split(' ')[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn("text-xs font-mono", agentResp.isStreaming ? "text-green-400" : "text-neutral-400")}>
                                  {agentResp.agentName} {agentResp.isStreaming ? 'analyzing...' : 'completed'}
                                </span>
                                {agentResp.isStreaming && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                {!agentResp.isStreaming && agentResp.duration > 0 && <span className="text-xs text-neutral-600">
                                    ({Math.round(agentResp.duration / 1000)}s)
                                  </span>}
                              </div>
                              <div className={cn("bg-neutral-800 rounded-lg px-4 py-4 border-l-2", agentResp.isStreaming && "border-green-500")} style={{
                      borderColor: agentResp.isStreaming ? undefined : agentResp.agentColor
                    }}>
                                <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">
                                  {agentResp.response || (agentResp.isStreaming ? '▌' : '')}
                                </p>
                              </div>
                            </div>
                          </div>)}
                      </div>}
                  </div> : stryMutAct_9fa48("22963") ? false : stryMutAct_9fa48("22962") ? true : (stryCov_9fa48("22962", "22963", "22964"), (stryMutAct_9fa48("22966") ? result.agentResponses || result.agentResponses.length > 0 : stryMutAct_9fa48("22965") ? true : (stryCov_9fa48("22965", "22966"), result.agentResponses && (stryMutAct_9fa48("22969") ? result.agentResponses.length <= 0 : stryMutAct_9fa48("22968") ? result.agentResponses.length >= 0 : stryMutAct_9fa48("22967") ? true : (stryCov_9fa48("22967", "22968", "22969"), result.agentResponses.length > 0)))) && <div className="border border-neutral-700 rounded-xl overflow-hidden">
                    <button onClick={stryMutAct_9fa48("22970") ? () => undefined : (stryCov_9fa48("22970"), () => toggleSection(result.id, 'agents'))} className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-750 transition-colors">
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
                    {stryMutAct_9fa48("22977") ? isSectionExpanded(result.id, 'agents') || <div className="p-4 space-y-4 bg-neutral-900/50">
                        {result.agentResponses.map(agentResp => <div key={agentResp.agentId} className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[50px]">
                              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl", agentResp.isStreaming && "ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900")} style={{
                      backgroundColor: agentResp.agentColor
                    }}>
                                {agentResp.agentAvatar}
                              </div>
                              <span className="text-[10px] text-neutral-500 font-medium text-center">
                                {agentResp.agentName.split(' ')[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn("text-xs font-mono", agentResp.isStreaming ? "text-green-400" : "text-neutral-400")}>
                                  {agentResp.agentName} {agentResp.isStreaming ? 'analyzing...' : 'completed'}
                                </span>
                                {agentResp.isStreaming && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                {!agentResp.isStreaming && agentResp.duration > 0 && <span className="text-xs text-neutral-600">
                                    ({Math.round(agentResp.duration / 1000)}s)
                                  </span>}
                              </div>
                              <div className={cn("bg-neutral-800 rounded-lg px-4 py-4 border-l-2", agentResp.isStreaming && "border-green-500")} style={{
                      borderColor: agentResp.isStreaming ? undefined : agentResp.agentColor
                    }}>
                                <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">
                                  {agentResp.response || (agentResp.isStreaming ? '▌' : '')}
                                </p>
                              </div>
                            </div>
                          </div>)}
                      </div> : stryMutAct_9fa48("22976") ? false : stryMutAct_9fa48("22975") ? true : (stryCov_9fa48("22975", "22976", "22977"), isSectionExpanded(result.id, 'agents') && <div className="p-4 space-y-4 bg-neutral-900/50">
                        {result.agentResponses.map(stryMutAct_9fa48("22979") ? () => undefined : (stryCov_9fa48("22979"), agentResp => <div key={agentResp.agentId} className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1 min-w-[50px]">
                              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xl", stryMutAct_9fa48("22983") ? agentResp.isStreaming || "ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900" : stryMutAct_9fa48("22982") ? false : stryMutAct_9fa48("22981") ? true : (stryCov_9fa48("22981", "22982", "22983"), agentResp.isStreaming && "ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900"))} style={stryMutAct_9fa48("22985") ? {} : (stryCov_9fa48("22985"), {
                      backgroundColor: agentResp.agentColor
                    })}>
                                {agentResp.agentAvatar}
                              </div>
                              <span className="text-[10px] text-neutral-500 font-medium text-center">
                                {agentResp.agentName.split(' ')[0]}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn("text-xs font-mono", agentResp.isStreaming ? "text-green-400" : "text-neutral-400")}>
                                  {agentResp.agentName} {agentResp.isStreaming ? 'analyzing...' : 'completed'}
                                </span>
                                {stryMutAct_9fa48("22994") ? agentResp.isStreaming || <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> : stryMutAct_9fa48("22993") ? false : stryMutAct_9fa48("22992") ? true : (stryCov_9fa48("22992", "22993", "22994"), agentResp.isStreaming && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />)}
                                {stryMutAct_9fa48("22997") ? !agentResp.isStreaming && agentResp.duration > 0 || <span className="text-xs text-neutral-600">
                                    ({Math.round(agentResp.duration / 1000)}s)
                                  </span> : stryMutAct_9fa48("22996") ? false : stryMutAct_9fa48("22995") ? true : (stryCov_9fa48("22995", "22996", "22997"), (stryMutAct_9fa48("22999") ? !agentResp.isStreaming || agentResp.duration > 0 : stryMutAct_9fa48("22998") ? true : (stryCov_9fa48("22998", "22999"), (stryMutAct_9fa48("23000") ? agentResp.isStreaming : (stryCov_9fa48("23000"), !agentResp.isStreaming)) && (stryMutAct_9fa48("23003") ? agentResp.duration <= 0 : stryMutAct_9fa48("23002") ? agentResp.duration >= 0 : stryMutAct_9fa48("23001") ? true : (stryCov_9fa48("23001", "23002", "23003"), agentResp.duration > 0)))) && <span className="text-xs text-neutral-600">
                                    ({Math.round(stryMutAct_9fa48("23004") ? agentResp.duration * 1000 : (stryCov_9fa48("23004"), agentResp.duration / 1000))}s)
                                  </span>)}
                              </div>
                              <div className={cn("bg-neutral-800 rounded-lg px-4 py-4 border-l-2", stryMutAct_9fa48("23008") ? agentResp.isStreaming || "border-green-500" : stryMutAct_9fa48("23007") ? false : stryMutAct_9fa48("23006") ? true : (stryCov_9fa48("23006", "23007", "23008"), agentResp.isStreaming && "border-green-500"))} style={stryMutAct_9fa48("23010") ? {} : (stryCov_9fa48("23010"), {
                      borderColor: agentResp.isStreaming ? undefined : agentResp.agentColor
                    })}>
                                <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">
                                  {stryMutAct_9fa48("23013") ? agentResp.response && (agentResp.isStreaming ? '▌' : '') : stryMutAct_9fa48("23012") ? false : stryMutAct_9fa48("23011") ? true : (stryCov_9fa48("23011", "23012", "23013"), agentResp.response || (agentResp.isStreaming ? '▌' : ''))}
                                </p>
                              </div>
                            </div>
                          </div>))}
                      </div>)}
                  </div>)}

                {/* COLLAPSIBLE: Cross-Examination */}
                {stryMutAct_9fa48("23018") ? result.crossExaminations && result.crossExaminations.length > 0 || <div className="border border-neutral-700 rounded-xl overflow-hidden">
                    <button onClick={() => toggleSection(result.id, 'crossExam')} className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-750 transition-colors">
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
                    {isSectionExpanded(result.id, 'crossExam') && <div className="p-4 space-y-4 bg-neutral-900/50">
                        {result.crossExaminations.map((ce, idx) => <div key={idx} className="space-y-3">
                            {/* Challenge */}
                            <div className="flex items-start gap-4 ml-4">
                              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{
                        backgroundColor: ce.challengerColor
                      }}>
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
                            {ce.rebuttal && <div className="flex items-start gap-4 ml-12">
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
                              </div>}
                          </div>)}
                      </div>}
                  </div> : stryMutAct_9fa48("23017") ? false : stryMutAct_9fa48("23016") ? true : (stryCov_9fa48("23016", "23017", "23018"), (stryMutAct_9fa48("23020") ? result.crossExaminations || result.crossExaminations.length > 0 : stryMutAct_9fa48("23019") ? true : (stryCov_9fa48("23019", "23020"), result.crossExaminations && (stryMutAct_9fa48("23023") ? result.crossExaminations.length <= 0 : stryMutAct_9fa48("23022") ? result.crossExaminations.length >= 0 : stryMutAct_9fa48("23021") ? true : (stryCov_9fa48("23021", "23022", "23023"), result.crossExaminations.length > 0)))) && <div className="border border-neutral-700 rounded-xl overflow-hidden">
                    <button onClick={stryMutAct_9fa48("23024") ? () => undefined : (stryCov_9fa48("23024"), () => toggleSection(result.id, 'crossExam'))} className="w-full flex items-center justify-between px-4 py-3 bg-neutral-800 hover:bg-neutral-750 transition-colors">
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
                    {stryMutAct_9fa48("23031") ? isSectionExpanded(result.id, 'crossExam') || <div className="p-4 space-y-4 bg-neutral-900/50">
                        {result.crossExaminations.map((ce, idx) => <div key={idx} className="space-y-3">
                            {/* Challenge */}
                            <div className="flex items-start gap-4 ml-4">
                              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{
                        backgroundColor: ce.challengerColor
                      }}>
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
                            {ce.rebuttal && <div className="flex items-start gap-4 ml-12">
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
                              </div>}
                          </div>)}
                      </div> : stryMutAct_9fa48("23030") ? false : stryMutAct_9fa48("23029") ? true : (stryCov_9fa48("23029", "23030", "23031"), isSectionExpanded(result.id, 'crossExam') && <div className="p-4 space-y-4 bg-neutral-900/50">
                        {result.crossExaminations.map(stryMutAct_9fa48("23033") ? () => undefined : (stryCov_9fa48("23033"), (ce, idx) => <div key={idx} className="space-y-3">
                            {/* Challenge */}
                            <div className="flex items-start gap-4 ml-4">
                              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={stryMutAct_9fa48("23034") ? {} : (stryCov_9fa48("23034"), {
                        backgroundColor: ce.challengerColor
                      })}>
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
                            {stryMutAct_9fa48("23037") ? ce.rebuttal || <div className="flex items-start gap-4 ml-12">
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
                              </div> : stryMutAct_9fa48("23036") ? false : stryMutAct_9fa48("23035") ? true : (stryCov_9fa48("23035", "23036", "23037"), ce.rebuttal && <div className="flex items-start gap-4 ml-12">
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
                              </div>)}
                          </div>))}
                      </div>)}
                  </div>)}

                {/* Document Actions */}
                {stryMutAct_9fa48("23040") ? result.mode === 'deliberation' && result.currentPhase === 'completed' && result.response || <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-700">
                    <button onClick={async () => {
                try {
                  // Save deliberation first
                  const saveRes = await councilApi.saveDeliberation({
                    question: result.query,
                    mode: result.mode,
                    agentResponses: result.agentResponses,
                    crossExaminations: result.crossExaminations,
                    synthesis: result.response,
                    confidence: result.confidence
                  });
                  const saveData = await safeJson<any>(saveRes, 'save deliberation');
                  const deliberationId = (saveData as any).deliberation?.id ?? (saveData as any).id;
                  if (!deliberationId) {
                    throw new Error('Missing deliberation id in save response');
                  }

                  // Generate summary
                  const summaryRes = await councilApi.generateExecutiveSummary(deliberationId);
                  const summaryData = await safeJson<any>(summaryRes, 'generate executive summary');

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
              }} className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                      📋 Executive Summary
                    </button>
                    <button onClick={async () => {
                try {
                  // Save deliberation first
                  const saveRes = await councilApi.saveDeliberation({
                    question: result.query,
                    mode: result.mode,
                    agentResponses: result.agentResponses,
                    crossExaminations: result.crossExaminations,
                    synthesis: result.response,
                    confidence: result.confidence
                  });
                  const saveData = await safeJson<any>(saveRes, 'save deliberation');
                  const deliberationId = (saveData as any).deliberation?.id ?? (saveData as any).id;
                  if (!deliberationId) {
                    throw new Error('Missing deliberation id in save response');
                  }

                  // Generate minutes
                  const minutesRes = await councilApi.generateMinutes(deliberationId);
                  const minutesData = await safeJson<any>(minutesRes, 'generate deliberation minutes');

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
                              ${minutesData.minutes.proceedings.map((p: any) => '<div class="entry ' + p.type + '">' + '<span class="speaker">' + p.speaker + '</span> <span class="time">(' + p.speakerRole + ')</span>' + '<p>' + p.content + '</p></div>').join('')}
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
              }} className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-medium transition-colors">
                      📝 Generate Minutes
                    </button>
                    <button onClick={async () => {
                try {
                  const saveRes = await councilApi.saveDeliberation({
                    question: result.query,
                    mode: result.mode,
                    agentResponses: result.agentResponses,
                    crossExaminations: result.crossExaminations,
                    synthesis: result.response,
                    confidence: result.confidence
                  });
                  const saveData = await safeJson<any>(saveRes, 'save deliberation');
                  const deliberationId = (saveData as any).deliberation?.id ?? (saveData as any).id;
                  alert('Deliberation saved! ID: ' + deliberationId);
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  console.error('[ERROR] Failed to save:', msg);
                  alert(`Failed to save: ${msg}`);
                }
              }} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                      💾 Save
                    </button>
                  </div> : stryMutAct_9fa48("23039") ? false : stryMutAct_9fa48("23038") ? true : (stryCov_9fa48("23038", "23039", "23040"), (stryMutAct_9fa48("23042") ? result.mode === 'deliberation' && result.currentPhase === 'completed' || result.response : stryMutAct_9fa48("23041") ? true : (stryCov_9fa48("23041", "23042"), (stryMutAct_9fa48("23044") ? result.mode === 'deliberation' || result.currentPhase === 'completed' : stryMutAct_9fa48("23043") ? true : (stryCov_9fa48("23043", "23044"), (stryMutAct_9fa48("23046") ? result.mode !== 'deliberation' : stryMutAct_9fa48("23045") ? true : (stryCov_9fa48("23045", "23046"), result.mode === 'deliberation')) && (stryMutAct_9fa48("23049") ? result.currentPhase !== 'completed' : stryMutAct_9fa48("23048") ? true : (stryCov_9fa48("23048", "23049"), result.currentPhase === 'completed')))) && result.response)) && <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-700">
                    <button onClick={async () => {
                try {
                  // Save deliberation first
                  const saveRes = await councilApi.saveDeliberation(stryMutAct_9fa48("23053") ? {} : (stryCov_9fa48("23053"), {
                    question: result.query,
                    mode: result.mode,
                    agentResponses: result.agentResponses,
                    crossExaminations: result.crossExaminations,
                    synthesis: result.response,
                    confidence: result.confidence
                  }));
                  const saveData = await safeJson<any>(saveRes, 'save deliberation');
                  const deliberationId = stryMutAct_9fa48("23055") ? (saveData as any).deliberation?.id && (saveData as any).id : (stryCov_9fa48("23055"), (stryMutAct_9fa48("23056") ? (saveData as any).deliberation.id : (stryCov_9fa48("23056"), (saveData as any).deliberation?.id)) ?? (saveData as any).id);
                  if (stryMutAct_9fa48("23059") ? false : stryMutAct_9fa48("23058") ? true : stryMutAct_9fa48("23057") ? deliberationId : (stryCov_9fa48("23057", "23058", "23059"), !deliberationId)) {
                    throw new Error('Missing deliberation id in save response');
                  }

                  // Generate summary
                  const summaryRes = await councilApi.generateExecutiveSummary(deliberationId);
                  const summaryData = await safeJson<any>(summaryRes, 'generate executive summary');

                  // Show in new window
                  const summaryWindow = window.open('', '_blank');
                  if (stryMutAct_9fa48("23066") ? false : stryMutAct_9fa48("23065") ? true : (stryCov_9fa48("23065", "23066"), summaryWindow)) {
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
                              <h2>Key Findings</h2><ul>${summaryData.summary.keyFindings.map(stryMutAct_9fa48("23069") ? () => undefined : (stryCov_9fa48("23069"), (f: string) => '<li>' + f + '</li>')).join('')}</ul>
                              <h2>Risk Factors</h2><ul>${summaryData.summary.riskFactors.map(stryMutAct_9fa48("23073") ? () => undefined : (stryCov_9fa48("23073"), (r: string) => '<li>' + r + '</li>')).join('')}</ul>
                              <h2>Next Steps</h2><ul>${summaryData.summary.nextSteps.map(stryMutAct_9fa48("23077") ? () => undefined : (stryCov_9fa48("23077"), (s: string) => '<li>' + s + '</li>')).join('')}</ul>
                              </body></html>
                            `);
                  }
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  console.error('[ERROR] Failed to generate summary:', msg);
                  alert(`Failed to generate summary: ${msg}`);
                }
              }} className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                      📋 Executive Summary
                    </button>
                    <button onClick={async () => {
                try {
                  // Save deliberation first
                  const saveRes = await councilApi.saveDeliberation(stryMutAct_9fa48("23086") ? {} : (stryCov_9fa48("23086"), {
                    question: result.query,
                    mode: result.mode,
                    agentResponses: result.agentResponses,
                    crossExaminations: result.crossExaminations,
                    synthesis: result.response,
                    confidence: result.confidence
                  }));
                  const saveData = await safeJson<any>(saveRes, 'save deliberation');
                  const deliberationId = stryMutAct_9fa48("23088") ? (saveData as any).deliberation?.id && (saveData as any).id : (stryCov_9fa48("23088"), (stryMutAct_9fa48("23089") ? (saveData as any).deliberation.id : (stryCov_9fa48("23089"), (saveData as any).deliberation?.id)) ?? (saveData as any).id);
                  if (stryMutAct_9fa48("23092") ? false : stryMutAct_9fa48("23091") ? true : stryMutAct_9fa48("23090") ? deliberationId : (stryCov_9fa48("23090", "23091", "23092"), !deliberationId)) {
                    throw new Error('Missing deliberation id in save response');
                  }

                  // Generate minutes
                  const minutesRes = await councilApi.generateMinutes(deliberationId);
                  const minutesData = await safeJson<any>(minutesRes, 'generate deliberation minutes');

                  // Show in new window
                  const minutesWindow = window.open('', '_blank');
                  if (stryMutAct_9fa48("23099") ? false : stryMutAct_9fa48("23098") ? true : (stryCov_9fa48("23098", "23099"), minutesWindow)) {
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
                              <ul>${minutesData.minutes.attendees.map(stryMutAct_9fa48("23102") ? () => undefined : (stryCov_9fa48("23102"), (a: any) => '<li><strong>' + a.name + '</strong> - ' + a.role + '</li>')).join('')}</ul>
                              <h2>Proceedings</h2>
                              ${minutesData.minutes.proceedings.map(stryMutAct_9fa48("23107") ? () => undefined : (stryCov_9fa48("23107"), (p: any) => '<div class="entry ' + p.type + '">' + '<span class="speaker">' + p.speaker + '</span> <span class="time">(' + p.speakerRole + ')</span>' + '<p>' + p.content + '</p></div>')).join('')}
                              <h2>Resolutions</h2>
                              <ul>${minutesData.minutes.resolutions.map(stryMutAct_9fa48("23116") ? () => undefined : (stryCov_9fa48("23116"), (r: string) => '<li>' + r + '</li>')).join('')}</ul>
                              <h2>Action Items</h2>
                              <ul>${minutesData.minutes.actionItems.map(stryMutAct_9fa48("23120") ? () => undefined : (stryCov_9fa48("23120"), (a: any) => '<li><strong>' + a.action + '</strong> - Owner: ' + a.owner + '</li>')).join('')}</ul>
                              </body></html>
                            `);
                  }
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  console.error('[ERROR] Failed to generate minutes:', msg);
                  alert(`Failed to generate minutes: ${msg}`);
                }
              }} className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-medium transition-colors">
                      📝 Generate Minutes
                    </button>
                    <button onClick={async () => {
                try {
                  const saveRes = await councilApi.saveDeliberation(stryMutAct_9fa48("23130") ? {} : (stryCov_9fa48("23130"), {
                    question: result.query,
                    mode: result.mode,
                    agentResponses: result.agentResponses,
                    crossExaminations: result.crossExaminations,
                    synthesis: result.response,
                    confidence: result.confidence
                  }));
                  const saveData = await safeJson<any>(saveRes, 'save deliberation');
                  const deliberationId = stryMutAct_9fa48("23132") ? (saveData as any).deliberation?.id && (saveData as any).id : (stryCov_9fa48("23132"), (stryMutAct_9fa48("23133") ? (saveData as any).deliberation.id : (stryCov_9fa48("23133"), (saveData as any).deliberation?.id)) ?? (saveData as any).id);
                  alert('Deliberation saved! ID: ' + deliberationId);
                } catch (err) {
                  const msg = err instanceof Error ? err.message : String(err);
                  console.error('[ERROR] Failed to save:', msg);
                  alert(`Failed to save: ${msg}`);
                }
              }} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                      💾 Save
                    </button>
                  </div>)}
              </div>
            </div>)) : <div className="text-center py-12 text-neutral-500">
              <p className="text-4xl mb-2">💭</p>
              <p>{t('council.no_decisions')}</p>
            </div>}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ACTIVE DELIBERATIONS */}
      {/* ================================================================= */}
      {stryMutAct_9fa48("23141") ? deliberations.length > 0 || <div className="bg-white rounded-xl border border-neutral-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Deliberations</h2>
          <div className="space-y-4">
            {deliberations.map(deliberation => <DeliberationCard key={deliberation.id} deliberation={deliberation} agents={allAgents} onClick={() => navigate(`/cortex/council/deliberation/${deliberation.id}`)} />)}
          </div>
        </div> : stryMutAct_9fa48("23140") ? false : stryMutAct_9fa48("23139") ? true : (stryCov_9fa48("23139", "23140", "23141"), (stryMutAct_9fa48("23144") ? deliberations.length <= 0 : stryMutAct_9fa48("23143") ? deliberations.length >= 0 : stryMutAct_9fa48("23142") ? true : (stryCov_9fa48("23142", "23143", "23144"), deliberations.length > 0)) && <div className="bg-white rounded-xl border border-neutral-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Deliberations</h2>
          <div className="space-y-4">
            {deliberations.map(stryMutAct_9fa48("23145") ? () => undefined : (stryCov_9fa48("23145"), deliberation => <DeliberationCard key={deliberation.id} deliberation={deliberation} agents={allAgents} onClick={stryMutAct_9fa48("23146") ? () => undefined : (stryCov_9fa48("23146"), () => navigate(`/cortex/council/deliberation/${deliberation.id}`))} />))}
          </div>
        </div>)}

      {/* ================================================================= */}
      {/* CUSTOM AGENT CREATOR MODAL */}
      {/* ================================================================= */}
      <CustomAgentCreator isOpen={showAgentCreator} onClose={() => {
      setShowAgentCreator(stryMutAct_9fa48("23149") ? true : (stryCov_9fa48("23149"), false));
      setEditingAgent(null);
    }} onSave={handleSaveCustomAgent} onDelete={handleDeleteCustomAgent} editingAgent={editingAgent} t={t} />

      {/* ================================================================= */}
      {/* PREMIUM FEATURES MODAL */}
      {/* ================================================================= */}
      <PremiumFeaturesModal isOpen={showPremiumModal} onClose={stryMutAct_9fa48("23150") ? () => undefined : (stryCov_9fa48("23150"), () => setShowPremiumModal(stryMutAct_9fa48("23151") ? true : (stryCov_9fa48("23151"), false)))} onPurchase={handlePremiumPurchase} currentFeatures={premium.getUnlockedFeatures()} />
      
      {/* Page Guide */}
      <PageGuide {...GUIDES.council} />
    </div>;
};
export default CouncilPage;