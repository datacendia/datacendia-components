// @ts-nocheck
// =============================================================================
// CENDIA PERSONAFORGE™ - ENTERPRISE-TRAINED DIGITAL TWINS
// AI Agents Trained on Your Organization's DNA
// "Your Digital C-Suite That Never Sleeps"
// 
// REAL OLLAMA LLM INTEGRATION - Enterprise Platinum Ready
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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { personaForgeService, ROLE_CONFIG, DigitalPersona, PersonaRole, ChatMessage } from '../../../services/PersonaForgeService';
import { ollamaService } from '../../../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

interface AgentPack {
  id: string;
  name: string;
  description: string;
  personas: PersonaRole[];
  price: number;
  features: string[];
  industries: string[];
  deploymentTime: string;
  supportLevel: 'standard' | 'premium' | 'enterprise';
}

// =============================================================================
// AGENT PACKS (Static Data)
// =============================================================================

const AGENT_PACKS: AgentPack[] = stryMutAct_9fa48("32939") ? [] : (stryCov_9fa48("32939"), [stryMutAct_9fa48("32940") ? {} : (stryCov_9fa48("32940"), {
  id: 'starter',
  name: 'Executive Starter Pack',
  description: 'Essential C-suite digital twins for core business functions',
  personas: stryMutAct_9fa48("32944") ? [] : (stryCov_9fa48("32944"), ['cfo', 'cio', 'clo']),
  price: 75000,
  features: stryMutAct_9fa48("32948") ? [] : (stryCov_9fa48("32948"), ['3 Digital Executives', 'Basic Training', 'Email & Document Integration', 'Standard Support']),
  industries: stryMutAct_9fa48("32953") ? [] : (stryCov_9fa48("32953"), ['All Industries']),
  deploymentTime: '4-6 weeks',
  supportLevel: 'standard'
}), stryMutAct_9fa48("32957") ? {} : (stryCov_9fa48("32957"), {
  id: 'enterprise',
  name: 'Enterprise Leadership Pack',
  description: 'Complete digital C-suite for enterprise-grade decision support',
  personas: stryMutAct_9fa48("32961") ? [] : (stryCov_9fa48("32961"), ['cfo', 'cio', 'clo', 'chro', 'coo', 'ciso']),
  price: 150000,
  features: stryMutAct_9fa48("32968") ? [] : (stryCov_9fa48("32968"), ['6 Digital Executives', 'Advanced Training', 'Full System Integration', 'Custom Specializations', 'Premium Support', 'Quarterly Updates']),
  industries: stryMutAct_9fa48("32975") ? [] : (stryCov_9fa48("32975"), ['All Industries']),
  deploymentTime: '8-12 weeks',
  supportLevel: 'premium'
}), stryMutAct_9fa48("32979") ? {} : (stryCov_9fa48("32979"), {
  id: 'finance',
  name: 'Finance Excellence Pack',
  description: 'Specialized financial decision support agents',
  personas: stryMutAct_9fa48("32983") ? [] : (stryCov_9fa48("32983"), ['cfo', 'cro']),
  price: 100000,
  features: stryMutAct_9fa48("32986") ? [] : (stryCov_9fa48("32986"), ['2 Finance Executives', 'SOX Compliance Training', 'ERP Deep Integration', 'Financial Modeling', 'Audit Support']),
  industries: stryMutAct_9fa48("32992") ? [] : (stryCov_9fa48("32992"), ['Banking', 'Insurance', 'Investment', 'Corporate Finance']),
  deploymentTime: '6-8 weeks',
  supportLevel: 'premium'
}), stryMutAct_9fa48("32999") ? {} : (stryCov_9fa48("32999"), {
  id: 'tech',
  name: 'Technology Leadership Pack',
  description: 'Digital technology executives for IT transformation',
  personas: stryMutAct_9fa48("33003") ? [] : (stryCov_9fa48("33003"), ['cio', 'ciso', 'cpo']),
  price: 125000,
  features: stryMutAct_9fa48("33007") ? [] : (stryCov_9fa48("33007"), ['3 Tech Executives', 'Security Focus', 'DevOps Integration', 'Cloud Architecture', 'Vendor Management']),
  industries: stryMutAct_9fa48("33013") ? [] : (stryCov_9fa48("33013"), ['Technology', 'SaaS', 'FinTech', 'Healthcare IT']),
  deploymentTime: '6-10 weeks',
  supportLevel: 'premium'
})]);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PersonaForgePage: React.FC = () => {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<DigitalPersona[]>(stryMutAct_9fa48("33021") ? ["Stryker was here"] : (stryCov_9fa48("33021"), []));
  const [selectedPersona, setSelectedPersona] = useState<DigitalPersona | null>(null);
  const [activeTab, setActiveTab] = useState<'gallery' | 'training' | 'interact' | 'marketplace'>('gallery');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(stryMutAct_9fa48("33023") ? ["Stryker was here"] : (stryCov_9fa48("33023"), []));
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("33025") ? true : (stryCov_9fa48("33025"), false));
  const [ollamaStatus, setOllamaStatus] = useState<{
    available: boolean;
    models: string[];
  }>(stryMutAct_9fa48("33026") ? {} : (stryCov_9fa48("33026"), {
    available: stryMutAct_9fa48("33027") ? true : (stryCov_9fa48("33027"), false),
    models: stryMutAct_9fa48("33028") ? ["Stryker was here"] : (stryCov_9fa48("33028"), [])
  }));
  const [showCreateModal, setShowCreateModal] = useState(stryMutAct_9fa48("33029") ? true : (stryCov_9fa48("33029"), false));
  const [newPersonaRole, setNewPersonaRole] = useState<PersonaRole>('custom');
  const [newPersonaName, setNewPersonaName] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load personas from service
  useEffect(() => {
    const loadPersonas = () => {
      setPersonas(personaForgeService.getPersonas());
    };
    loadPersonas();

    // Check Ollama status
    const status = ollamaService.getStatus();
    setOllamaStatus(status);

    // Refresh periodically
    const interval = setInterval(() => {
      loadPersonas();
      setOllamaStatus(ollamaService.getStatus());
    }, 5000);
    return stryMutAct_9fa48("33035") ? () => undefined : (stryCov_9fa48("33035"), () => clearInterval(interval));
  }, stryMutAct_9fa48("33036") ? ["Stryker was here"] : (stryCov_9fa48("33036"), []));

  // Auto-scroll chat
  useEffect(() => {
    if (stryMutAct_9fa48("33039") ? false : stryMutAct_9fa48("33038") ? true : (stryCov_9fa48("33038", "33039"), chatContainerRef.current)) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, stryMutAct_9fa48("33041") ? [] : (stryCov_9fa48("33041"), [chatMessages]));
  const readyPersonas = stryMutAct_9fa48("33042") ? personas : (stryCov_9fa48("33042"), personas.filter(stryMutAct_9fa48("33043") ? () => undefined : (stryCov_9fa48("33043"), p => stryMutAct_9fa48("33046") ? p.status !== 'ready' : stryMutAct_9fa48("33045") ? false : stryMutAct_9fa48("33044") ? true : (stryCov_9fa48("33044", "33045", "33046"), p.status === 'ready'))));
  const trainingPersonas = stryMutAct_9fa48("33048") ? personas : (stryCov_9fa48("33048"), personas.filter(stryMutAct_9fa48("33049") ? () => undefined : (stryCov_9fa48("33049"), p => stryMutAct_9fa48("33052") ? p.status === 'ready' : stryMutAct_9fa48("33051") ? false : stryMutAct_9fa48("33050") ? true : (stryCov_9fa48("33050", "33051", "33052"), p.status !== 'ready'))));

  // Real Ollama-powered chat
  const handleSendMessage = useCallback(async () => {
    if (stryMutAct_9fa48("33057") ? (!inputMessage.trim() || !selectedPersona) && isLoading : stryMutAct_9fa48("33056") ? false : stryMutAct_9fa48("33055") ? true : (stryCov_9fa48("33055", "33056", "33057"), (stryMutAct_9fa48("33059") ? !inputMessage.trim() && !selectedPersona : stryMutAct_9fa48("33058") ? false : (stryCov_9fa48("33058", "33059"), (stryMutAct_9fa48("33060") ? inputMessage.trim() : (stryCov_9fa48("33060"), !(stryMutAct_9fa48("33061") ? inputMessage : (stryCov_9fa48("33061"), inputMessage.trim())))) || (stryMutAct_9fa48("33062") ? selectedPersona : (stryCov_9fa48("33062"), !selectedPersona)))) || isLoading)) {
      return;
    }
    const userMessage = stryMutAct_9fa48("33064") ? inputMessage : (stryCov_9fa48("33064"), inputMessage.trim());
    setInputMessage('');
    setIsLoading(stryMutAct_9fa48("33066") ? false : (stryCov_9fa48("33066"), true));

    // Add user message
    const userMsg: ChatMessage = stryMutAct_9fa48("33067") ? {} : (stryCov_9fa48("33067"), {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });
    setChatMessages(stryMutAct_9fa48("33070") ? () => undefined : (stryCov_9fa48("33070"), prev => stryMutAct_9fa48("33071") ? [] : (stryCov_9fa48("33071"), [...prev, userMsg])));

    // Add placeholder for assistant
    const assistantMsgId = `msg-${Date.now()}-assistant`;
    setChatMessages(stryMutAct_9fa48("33073") ? () => undefined : (stryCov_9fa48("33073"), prev => stryMutAct_9fa48("33074") ? [] : (stryCov_9fa48("33074"), [...prev, stryMutAct_9fa48("33075") ? {} : (stryCov_9fa48("33075"), {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: stryMutAct_9fa48("33078") ? false : (stryCov_9fa48("33078"), true)
    })])));
    try {
      // Use the service to chat with real Ollama
      const {
        response
      } = await personaForgeService.chat(selectedPersona.id, userMessage, token => {
        // Stream tokens in real-time
        setChatMessages(stryMutAct_9fa48("33081") ? () => undefined : (stryCov_9fa48("33081"), prev => prev.map(stryMutAct_9fa48("33082") ? () => undefined : (stryCov_9fa48("33082"), msg => (stryMutAct_9fa48("33085") ? msg.id !== assistantMsgId : stryMutAct_9fa48("33084") ? false : stryMutAct_9fa48("33083") ? true : (stryCov_9fa48("33083", "33084", "33085"), msg.id === assistantMsgId)) ? stryMutAct_9fa48("33086") ? {} : (stryCov_9fa48("33086"), {
          ...msg,
          content: stryMutAct_9fa48("33087") ? msg.content - token : (stryCov_9fa48("33087"), msg.content + token)
        }) : msg))));
      });

      // Mark streaming complete
      setChatMessages(stryMutAct_9fa48("33088") ? () => undefined : (stryCov_9fa48("33088"), prev => prev.map(stryMutAct_9fa48("33089") ? () => undefined : (stryCov_9fa48("33089"), msg => (stryMutAct_9fa48("33092") ? msg.id !== assistantMsgId : stryMutAct_9fa48("33091") ? false : stryMutAct_9fa48("33090") ? true : (stryCov_9fa48("33090", "33091", "33092"), msg.id === assistantMsgId)) ? stryMutAct_9fa48("33093") ? {} : (stryCov_9fa48("33093"), {
        ...msg,
        isStreaming: stryMutAct_9fa48("33094") ? true : (stryCov_9fa48("33094"), false),
        content: response
      }) : msg))));

      // Refresh personas to get updated interaction counts
      setPersonas(personaForgeService.getPersonas());
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(stryMutAct_9fa48("33097") ? () => undefined : (stryCov_9fa48("33097"), prev => prev.map(stryMutAct_9fa48("33098") ? () => undefined : (stryCov_9fa48("33098"), msg => (stryMutAct_9fa48("33101") ? msg.id !== assistantMsgId : stryMutAct_9fa48("33100") ? false : stryMutAct_9fa48("33099") ? true : (stryCov_9fa48("33099", "33100", "33101"), msg.id === assistantMsgId)) ? stryMutAct_9fa48("33102") ? {} : (stryCov_9fa48("33102"), {
        ...msg,
        isStreaming: stryMutAct_9fa48("33103") ? true : (stryCov_9fa48("33103"), false),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}. Please ensure Ollama is running.`
      }) : msg))));
    } finally {
      setIsLoading(stryMutAct_9fa48("33107") ? true : (stryCov_9fa48("33107"), false));
    }
  }, stryMutAct_9fa48("33108") ? [] : (stryCov_9fa48("33108"), [inputMessage, selectedPersona, isLoading]));

  // Create new persona
  const handleCreatePersona = () => {
    if (stryMutAct_9fa48("33112") ? false : stryMutAct_9fa48("33111") ? true : stryMutAct_9fa48("33110") ? newPersonaName.trim() : (stryCov_9fa48("33110", "33111", "33112"), !(stryMutAct_9fa48("33113") ? newPersonaName : (stryCov_9fa48("33113"), newPersonaName.trim())))) {
      return;
    }
    const persona = personaForgeService.createPersona(stryMutAct_9fa48("33115") ? {} : (stryCov_9fa48("33115"), {
      role: newPersonaRole,
      name: newPersonaName,
      status: 'not_started'
    }));
    setPersonas(personaForgeService.getPersonas());
    setShowCreateModal(stryMutAct_9fa48("33117") ? true : (stryCov_9fa48("33117"), false));
    setNewPersonaName('');
    setNewPersonaRole('custom');
    setSelectedPersona(persona);
    setActiveTab('training');
  };

  // Start training a persona
  const handleStartTraining = (personaId: string) => {
    personaForgeService.startTraining(personaId, (progress, status) => {
      setPersonas(personaForgeService.getPersonas());
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("33123") ? () => undefined : (stryCov_9fa48("33123"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🧠</span>
                  CendiaPersonaForge™
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full font-medium">
                    ENTERPRISE
                  </span>
                </h1>
                <p className="text-purple-300 text-sm">Enterprise-Trained Digital Twins • Your AI C-Suite</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-white/60">Active Personas</div>
                <div className="text-xl font-bold text-green-400">{readyPersonas.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Total Interactions</div>
                <div className="text-xl font-bold text-purple-400">
                  {personas.reduce(stryMutAct_9fa48("33125") ? () => undefined : (stryCov_9fa48("33125"), (sum, p) => stryMutAct_9fa48("33126") ? sum - p.totalInteractions : (stryCov_9fa48("33126"), sum + p.totalInteractions)), 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-purple-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("33127") ? [] : (stryCov_9fa48("33127"), [stryMutAct_9fa48("33128") ? {} : (stryCov_9fa48("33128"), {
            id: 'gallery',
            label: 'Persona Gallery',
            icon: '👥'
          }), stryMutAct_9fa48("33132") ? {} : (stryCov_9fa48("33132"), {
            id: 'training',
            label: 'Training Studio',
            icon: '🏋️'
          }), stryMutAct_9fa48("33136") ? {} : (stryCov_9fa48("33136"), {
            id: 'interact',
            label: 'Interact',
            icon: '💬'
          }), stryMutAct_9fa48("33140") ? {} : (stryCov_9fa48("33140"), {
            id: 'marketplace',
            label: 'Agent Packs',
            icon: '🛒'
          })])).map(stryMutAct_9fa48("33144") ? () => undefined : (stryCov_9fa48("33144"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("33145") ? () => undefined : (stryCov_9fa48("33145"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("33149") ? activeTab !== tab.id : stryMutAct_9fa48("33148") ? false : stryMutAct_9fa48("33147") ? true : (stryCov_9fa48("33147", "33148", "33149"), activeTab === tab.id)) ? 'border-purple-400 text-white bg-purple-900/20' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("33154") ? activeTab === 'gallery' || <div className="grid grid-cols-3 gap-6">
            {personas.map(persona => {
          const config = ROLE_CONFIG[persona.role];
          return <div key={persona.id} onClick={() => setSelectedPersona(persona)} className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.02] ${selectedPersona?.id === persona.id ? 'border-purple-400 ring-2 ring-purple-400/20' : 'border-purple-800/50 hover:border-purple-600'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-3xl`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{persona.name}</h3>
                      <div className="text-sm text-white/50">{persona.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${persona.status === 'ready' ? 'bg-green-600' : persona.status === 'training' ? 'bg-blue-600' : persona.status === 'validating' ? 'bg-amber-600' : 'bg-neutral-600'}`}>
                          {persona.status}
                        </span>
                        <span className="text-xs text-white/40">v{persona.version}</span>
                      </div>
                    </div>
                  </div>

                  {persona.status !== 'ready' && <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Training Progress</span>
                        <span>{persona.trainingProgress}%</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{
                  width: `${persona.trainingProgress}%`
                }} />
                      </div>
                    </div>}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">{persona.totalInteractions.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Interactions</div>
                    </div>
                    <div className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-lg font-bold text-amber-400">
                        {persona.avgResponseQuality > 0 ? `${persona.avgResponseQuality}/5` : 'N/A'}
                      </div>
                      <div className="text-xs text-white/50">Quality Score</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {persona.specializations.slice(0, 3).map(spec => <span key={spec} className="text-xs px-2 py-1 bg-purple-900/50 rounded">{spec}</span>)}
                    {persona.specializations.length > 3 && <span className="text-xs px-2 py-1 bg-neutral-800 rounded">+{persona.specializations.length - 3}</span>}
                  </div>
                </div>;
        })}

            {/* Add New Persona Card */}
            <div onClick={() => setShowCreateModal(true)} className="bg-black/20 rounded-2xl p-6 border border-dashed border-purple-800/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/30 hover:border-purple-600 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center text-3xl mb-4">➕</div>
              <h3 className="text-lg font-semibold mb-1">Create New Persona</h3>
              <p className="text-sm text-white/50">Train a custom digital executive</p>
            </div>
          </div> : stryMutAct_9fa48("33153") ? false : stryMutAct_9fa48("33152") ? true : (stryCov_9fa48("33152", "33153", "33154"), (stryMutAct_9fa48("33156") ? activeTab !== 'gallery' : stryMutAct_9fa48("33155") ? true : (stryCov_9fa48("33155", "33156"), activeTab === 'gallery')) && <div className="grid grid-cols-3 gap-6">
            {personas.map(persona => {
          const config = ROLE_CONFIG[persona.role];
          return <div key={persona.id} onClick={stryMutAct_9fa48("33159") ? () => undefined : (stryCov_9fa48("33159"), () => setSelectedPersona(persona))} className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.02] ${(stryMutAct_9fa48("33163") ? selectedPersona?.id !== persona.id : stryMutAct_9fa48("33162") ? false : stryMutAct_9fa48("33161") ? true : (stryCov_9fa48("33161", "33162", "33163"), (stryMutAct_9fa48("33164") ? selectedPersona.id : (stryCov_9fa48("33164"), selectedPersona?.id)) === persona.id)) ? 'border-purple-400 ring-2 ring-purple-400/20' : 'border-purple-800/50 hover:border-purple-600'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-3xl`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{persona.name}</h3>
                      <div className="text-sm text-white/50">{persona.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("33171") ? persona.status !== 'ready' : stryMutAct_9fa48("33170") ? false : stryMutAct_9fa48("33169") ? true : (stryCov_9fa48("33169", "33170", "33171"), persona.status === 'ready')) ? 'bg-green-600' : (stryMutAct_9fa48("33176") ? persona.status !== 'training' : stryMutAct_9fa48("33175") ? false : stryMutAct_9fa48("33174") ? true : (stryCov_9fa48("33174", "33175", "33176"), persona.status === 'training')) ? 'bg-blue-600' : (stryMutAct_9fa48("33181") ? persona.status !== 'validating' : stryMutAct_9fa48("33180") ? false : stryMutAct_9fa48("33179") ? true : (stryCov_9fa48("33179", "33180", "33181"), persona.status === 'validating')) ? 'bg-amber-600' : 'bg-neutral-600'}`}>
                          {persona.status}
                        </span>
                        <span className="text-xs text-white/40">v{persona.version}</span>
                      </div>
                    </div>
                  </div>

                  {stryMutAct_9fa48("33187") ? persona.status !== 'ready' || <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Training Progress</span>
                        <span>{persona.trainingProgress}%</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{
                  width: `${persona.trainingProgress}%`
                }} />
                      </div>
                    </div> : stryMutAct_9fa48("33186") ? false : stryMutAct_9fa48("33185") ? true : (stryCov_9fa48("33185", "33186", "33187"), (stryMutAct_9fa48("33189") ? persona.status === 'ready' : stryMutAct_9fa48("33188") ? true : (stryCov_9fa48("33188", "33189"), persona.status !== 'ready')) && <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Training Progress</span>
                        <span>{persona.trainingProgress}%</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={stryMutAct_9fa48("33191") ? {} : (stryCov_9fa48("33191"), {
                  width: `${persona.trainingProgress}%`
                })} />
                      </div>
                    </div>)}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">{persona.totalInteractions.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Interactions</div>
                    </div>
                    <div className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-lg font-bold text-amber-400">
                        {(stryMutAct_9fa48("33196") ? persona.avgResponseQuality <= 0 : stryMutAct_9fa48("33195") ? persona.avgResponseQuality >= 0 : stryMutAct_9fa48("33194") ? false : stryMutAct_9fa48("33193") ? true : (stryCov_9fa48("33193", "33194", "33195", "33196"), persona.avgResponseQuality > 0)) ? `${persona.avgResponseQuality}/5` : 'N/A'}
                      </div>
                      <div className="text-xs text-white/50">Quality Score</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {stryMutAct_9fa48("33199") ? persona.specializations.map(spec => <span key={spec} className="text-xs px-2 py-1 bg-purple-900/50 rounded">{spec}</span>) : (stryCov_9fa48("33199"), persona.specializations.slice(0, 3).map(stryMutAct_9fa48("33200") ? () => undefined : (stryCov_9fa48("33200"), spec => <span key={spec} className="text-xs px-2 py-1 bg-purple-900/50 rounded">{spec}</span>)))}
                    {stryMutAct_9fa48("33203") ? persona.specializations.length > 3 || <span className="text-xs px-2 py-1 bg-neutral-800 rounded">+{persona.specializations.length - 3}</span> : stryMutAct_9fa48("33202") ? false : stryMutAct_9fa48("33201") ? true : (stryCov_9fa48("33201", "33202", "33203"), (stryMutAct_9fa48("33206") ? persona.specializations.length <= 3 : stryMutAct_9fa48("33205") ? persona.specializations.length >= 3 : stryMutAct_9fa48("33204") ? true : (stryCov_9fa48("33204", "33205", "33206"), persona.specializations.length > 3)) && <span className="text-xs px-2 py-1 bg-neutral-800 rounded">+{stryMutAct_9fa48("33207") ? persona.specializations.length + 3 : (stryCov_9fa48("33207"), persona.specializations.length - 3)}</span>)}
                  </div>
                </div>;
        })}

            {/* Add New Persona Card */}
            <div onClick={stryMutAct_9fa48("33208") ? () => undefined : (stryCov_9fa48("33208"), () => setShowCreateModal(stryMutAct_9fa48("33209") ? false : (stryCov_9fa48("33209"), true)))} className="bg-black/20 rounded-2xl p-6 border border-dashed border-purple-800/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/30 hover:border-purple-600 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center text-3xl mb-4">➕</div>
              <h3 className="text-lg font-semibold mb-1">Create New Persona</h3>
              <p className="text-sm text-white/50">Train a custom digital executive</p>
            </div>
          </div>)}

        {/* Create Persona Modal */}
        {stryMutAct_9fa48("33212") ? showCreateModal || <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 rounded-2xl p-8 border border-purple-700/50 w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-6">Create New Digital Persona</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Persona Name</label>
                  <input type="text" value={newPersonaName} onChange={e => setNewPersonaName(e.target.value)} placeholder="e.g., Digital CMO" className="w-full px-4 py-3 bg-black/30 border border-purple-800/50 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Role Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['cfo', 'cio', 'clo', 'chro', 'ciso', 'coo', 'cro', 'cso', 'cpo', 'custom'] as PersonaRole[]).map(role => {
                  const config = ROLE_CONFIG[role];
                  return <button key={role} onClick={() => setNewPersonaRole(role)} className={`p-3 rounded-xl border transition-all ${newPersonaRole === role ? 'border-purple-400 bg-purple-600/30' : 'border-purple-800/50 bg-black/20 hover:bg-black/40'}`}>
                          <div className="text-2xl mb-1">{config.icon}</div>
                          <div className="text-xs uppercase">{role}</div>
                        </button>;
                })}
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleCreatePersona} disabled={!newPersonaName.trim()} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all">
                    Create Persona
                  </button>
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("33211") ? false : stryMutAct_9fa48("33210") ? true : (stryCov_9fa48("33210", "33211", "33212"), showCreateModal && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 rounded-2xl p-8 border border-purple-700/50 w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-6">Create New Digital Persona</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Persona Name</label>
                  <input type="text" value={newPersonaName} onChange={stryMutAct_9fa48("33213") ? () => undefined : (stryCov_9fa48("33213"), e => setNewPersonaName(e.target.value))} placeholder="e.g., Digital CMO" className="w-full px-4 py-3 bg-black/30 border border-purple-800/50 rounded-xl focus:outline-none focus:border-purple-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Role Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['cfo', 'cio', 'clo', 'chro', 'ciso', 'coo', 'cro', 'cso', 'cpo', 'custom'] as PersonaRole[]).map(role => {
                  const config = ROLE_CONFIG[role];
                  return <button key={role} onClick={stryMutAct_9fa48("33215") ? () => undefined : (stryCov_9fa48("33215"), () => setNewPersonaRole(role))} className={`p-3 rounded-xl border transition-all ${(stryMutAct_9fa48("33219") ? newPersonaRole !== role : stryMutAct_9fa48("33218") ? false : stryMutAct_9fa48("33217") ? true : (stryCov_9fa48("33217", "33218", "33219"), newPersonaRole === role)) ? 'border-purple-400 bg-purple-600/30' : 'border-purple-800/50 bg-black/20 hover:bg-black/40'}`}>
                          <div className="text-2xl mb-1">{config.icon}</div>
                          <div className="text-xs uppercase">{role}</div>
                        </button>;
                })}
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button onClick={stryMutAct_9fa48("33222") ? () => undefined : (stryCov_9fa48("33222"), () => setShowCreateModal(stryMutAct_9fa48("33223") ? true : (stryCov_9fa48("33223"), false)))} className="flex-1 px-4 py-3 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleCreatePersona} disabled={stryMutAct_9fa48("33224") ? newPersonaName.trim() : (stryCov_9fa48("33224"), !(stryMutAct_9fa48("33225") ? newPersonaName : (stryCov_9fa48("33225"), newPersonaName.trim())))} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all">
                    Create Persona
                  </button>
                </div>
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("33228") ? activeTab === 'training' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🏋️ Training Studio</h2>
              <p className="text-white/60">
                Configure data sources, calibrate risk profiles, and fine-tune communication styles for your digital executives.
              </p>
            </div>

            {selectedPersona ? <div className="grid grid-cols-2 gap-6">
                {/* Data Sources */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">📊 Training Data Sources</h3>
                  <div className="space-y-3">
                    {selectedPersona.dataSources.map(ds => <div key={ds.sourceType} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize">{ds.sourceType.replace('_', ' ')}</span>
                          <span className="text-xs text-green-400">Active</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-white/50">Records</span>
                            <div className="font-medium">{ds.recordsProcessed.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-white/50">Tokens</span>
                            <div className="font-medium">{(ds.tokensExtracted / 1000000).toFixed(0)}M</div>
                          </div>
                          <div>
                            <span className="text-white/50">Patterns</span>
                            <div className="font-medium">{ds.patternsIdentified.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Risk Profile */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">⚖️ Risk Profile Calibration</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedPersona.riskProfile).map(([key, value]) => <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-purple-400 capitalize">{value}</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" style={{
                    width: value === 'conservative' || value === 'cautious' || value === 'deliberate' || value === 'strict' ? '25%' : value === 'moderate' || value === 'balanced' || value === 'pragmatic' ? '50%' : '75%'
                  }} />
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">🎯 Capabilities</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedPersona.capabilities.map(cap => <div key={cap.id} className="p-4 bg-black/20 rounded-xl">
                        <h4 className="font-medium mb-1">{cap.name}</h4>
                        <p className="text-xs text-white/50 mb-2">{cap.description}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-400">{cap.accuracy}% accuracy</span>
                          <span className="text-white/40">{cap.usageCount} uses</span>
                        </div>
                      </div>)}
                  </div>
                </div>

                {/* Training Controls */}
                <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">🚀 Training Controls</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-white/60">Training Status</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-lg text-sm ${selectedPersona.status === 'ready' ? 'bg-green-600' : selectedPersona.status === 'training' ? 'bg-blue-600' : selectedPersona.status === 'validating' ? 'bg-amber-600' : 'bg-neutral-600'}`}>
                          {selectedPersona.status}
                        </span>
                        <span className="text-sm text-white/50">{selectedPersona.trainingProgress}% complete</span>
                      </div>
                    </div>
                    
                    {selectedPersona.status !== 'ready' && <button onClick={() => handleStartTraining(selectedPersona.id)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                        {selectedPersona.status === 'not_started' ? 'Start Training' : 'Resume Training'}
                      </button>}
                  </div>

                  <div className="h-3 bg-black/30 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{
                width: `${selectedPersona.trainingProgress}%`
              }} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400">{selectedPersona.totalInteractions.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Total Interactions</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-amber-400">
                        {selectedPersona.avgResponseQuality > 0 ? `${selectedPersona.avgResponseQuality}/5` : 'N/A'}
                      </div>
                      <div className="text-xs text-white/50">Quality Score</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">v{selectedPersona.version}</div>
                      <div className="text-xs text-white/50">Version</div>
                    </div>
                  </div>
                </div>
              </div> : <div className="text-center py-12 text-white/50">
                Select a persona from the gallery to view training details
              </div>}
          </div> : stryMutAct_9fa48("33227") ? false : stryMutAct_9fa48("33226") ? true : (stryCov_9fa48("33226", "33227", "33228"), (stryMutAct_9fa48("33230") ? activeTab !== 'training' : stryMutAct_9fa48("33229") ? true : (stryCov_9fa48("33229", "33230"), activeTab === 'training')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🏋️ Training Studio</h2>
              <p className="text-white/60">
                Configure data sources, calibrate risk profiles, and fine-tune communication styles for your digital executives.
              </p>
            </div>

            {selectedPersona ? <div className="grid grid-cols-2 gap-6">
                {/* Data Sources */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">📊 Training Data Sources</h3>
                  <div className="space-y-3">
                    {selectedPersona.dataSources.map(stryMutAct_9fa48("33232") ? () => undefined : (stryCov_9fa48("33232"), ds => <div key={ds.sourceType} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize">{ds.sourceType.replace('_', ' ')}</span>
                          <span className="text-xs text-green-400">Active</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-white/50">Records</span>
                            <div className="font-medium">{ds.recordsProcessed.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-white/50">Tokens</span>
                            <div className="font-medium">{(stryMutAct_9fa48("33235") ? ds.tokensExtracted * 1000000 : (stryCov_9fa48("33235"), ds.tokensExtracted / 1000000)).toFixed(0)}M</div>
                          </div>
                          <div>
                            <span className="text-white/50">Patterns</span>
                            <div className="font-medium">{ds.patternsIdentified.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>))}
                  </div>
                </div>

                {/* Risk Profile */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">⚖️ Risk Profile Calibration</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedPersona.riskProfile).map(stryMutAct_9fa48("33236") ? () => undefined : (stryCov_9fa48("33236"), ([key, value]) => <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60 capitalize">{key.replace(stryMutAct_9fa48("33237") ? /([^A-Z])/g : (stryCov_9fa48("33237"), /([A-Z])/g), ' $1')}</span>
                          <span className="text-purple-400 capitalize">{value}</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500" style={stryMutAct_9fa48("33239") ? {} : (stryCov_9fa48("33239"), {
                    width: (stryMutAct_9fa48("33242") ? (value === 'conservative' || value === 'cautious' || value === 'deliberate') && value === 'strict' : stryMutAct_9fa48("33241") ? false : stryMutAct_9fa48("33240") ? true : (stryCov_9fa48("33240", "33241", "33242"), (stryMutAct_9fa48("33244") ? (value === 'conservative' || value === 'cautious') && value === 'deliberate' : stryMutAct_9fa48("33243") ? false : (stryCov_9fa48("33243", "33244"), (stryMutAct_9fa48("33246") ? value === 'conservative' && value === 'cautious' : stryMutAct_9fa48("33245") ? false : (stryCov_9fa48("33245", "33246"), (stryMutAct_9fa48("33248") ? value !== 'conservative' : stryMutAct_9fa48("33247") ? false : (stryCov_9fa48("33247", "33248"), value === 'conservative')) || (stryMutAct_9fa48("33251") ? value !== 'cautious' : stryMutAct_9fa48("33250") ? false : (stryCov_9fa48("33250", "33251"), value === 'cautious')))) || (stryMutAct_9fa48("33254") ? value !== 'deliberate' : stryMutAct_9fa48("33253") ? false : (stryCov_9fa48("33253", "33254"), value === 'deliberate')))) || (stryMutAct_9fa48("33257") ? value !== 'strict' : stryMutAct_9fa48("33256") ? false : (stryCov_9fa48("33256", "33257"), value === 'strict')))) ? '25%' : (stryMutAct_9fa48("33262") ? (value === 'moderate' || value === 'balanced') && value === 'pragmatic' : stryMutAct_9fa48("33261") ? false : stryMutAct_9fa48("33260") ? true : (stryCov_9fa48("33260", "33261", "33262"), (stryMutAct_9fa48("33264") ? value === 'moderate' && value === 'balanced' : stryMutAct_9fa48("33263") ? false : (stryCov_9fa48("33263", "33264"), (stryMutAct_9fa48("33266") ? value !== 'moderate' : stryMutAct_9fa48("33265") ? false : (stryCov_9fa48("33265", "33266"), value === 'moderate')) || (stryMutAct_9fa48("33269") ? value !== 'balanced' : stryMutAct_9fa48("33268") ? false : (stryCov_9fa48("33268", "33269"), value === 'balanced')))) || (stryMutAct_9fa48("33272") ? value !== 'pragmatic' : stryMutAct_9fa48("33271") ? false : (stryCov_9fa48("33271", "33272"), value === 'pragmatic')))) ? '50%' : '75%'
                  })} />
                        </div>
                      </div>))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">🎯 Capabilities</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedPersona.capabilities.map(stryMutAct_9fa48("33276") ? () => undefined : (stryCov_9fa48("33276"), cap => <div key={cap.id} className="p-4 bg-black/20 rounded-xl">
                        <h4 className="font-medium mb-1">{cap.name}</h4>
                        <p className="text-xs text-white/50 mb-2">{cap.description}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-400">{cap.accuracy}% accuracy</span>
                          <span className="text-white/40">{cap.usageCount} uses</span>
                        </div>
                      </div>))}
                  </div>
                </div>

                {/* Training Controls */}
                <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">🚀 Training Controls</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-white/60">Training Status</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("33280") ? selectedPersona.status !== 'ready' : stryMutAct_9fa48("33279") ? false : stryMutAct_9fa48("33278") ? true : (stryCov_9fa48("33278", "33279", "33280"), selectedPersona.status === 'ready')) ? 'bg-green-600' : (stryMutAct_9fa48("33285") ? selectedPersona.status !== 'training' : stryMutAct_9fa48("33284") ? false : stryMutAct_9fa48("33283") ? true : (stryCov_9fa48("33283", "33284", "33285"), selectedPersona.status === 'training')) ? 'bg-blue-600' : (stryMutAct_9fa48("33290") ? selectedPersona.status !== 'validating' : stryMutAct_9fa48("33289") ? false : stryMutAct_9fa48("33288") ? true : (stryCov_9fa48("33288", "33289", "33290"), selectedPersona.status === 'validating')) ? 'bg-amber-600' : 'bg-neutral-600'}`}>
                          {selectedPersona.status}
                        </span>
                        <span className="text-sm text-white/50">{selectedPersona.trainingProgress}% complete</span>
                      </div>
                    </div>
                    
                    {stryMutAct_9fa48("33296") ? selectedPersona.status !== 'ready' || <button onClick={() => handleStartTraining(selectedPersona.id)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                        {selectedPersona.status === 'not_started' ? 'Start Training' : 'Resume Training'}
                      </button> : stryMutAct_9fa48("33295") ? false : stryMutAct_9fa48("33294") ? true : (stryCov_9fa48("33294", "33295", "33296"), (stryMutAct_9fa48("33298") ? selectedPersona.status === 'ready' : stryMutAct_9fa48("33297") ? true : (stryCov_9fa48("33297", "33298"), selectedPersona.status !== 'ready')) && <button onClick={stryMutAct_9fa48("33300") ? () => undefined : (stryCov_9fa48("33300"), () => handleStartTraining(selectedPersona.id))} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                        {(stryMutAct_9fa48("33303") ? selectedPersona.status !== 'not_started' : stryMutAct_9fa48("33302") ? false : stryMutAct_9fa48("33301") ? true : (stryCov_9fa48("33301", "33302", "33303"), selectedPersona.status === 'not_started')) ? 'Start Training' : 'Resume Training'}
                      </button>)}
                  </div>

                  <div className="h-3 bg-black/30 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={stryMutAct_9fa48("33307") ? {} : (stryCov_9fa48("33307"), {
                width: `${selectedPersona.trainingProgress}%`
              })} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400">{selectedPersona.totalInteractions.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Total Interactions</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-amber-400">
                        {(stryMutAct_9fa48("33312") ? selectedPersona.avgResponseQuality <= 0 : stryMutAct_9fa48("33311") ? selectedPersona.avgResponseQuality >= 0 : stryMutAct_9fa48("33310") ? false : stryMutAct_9fa48("33309") ? true : (stryCov_9fa48("33309", "33310", "33311", "33312"), selectedPersona.avgResponseQuality > 0)) ? `${selectedPersona.avgResponseQuality}/5` : 'N/A'}
                      </div>
                      <div className="text-xs text-white/50">Quality Score</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">v{selectedPersona.version}</div>
                      <div className="text-xs text-white/50">Version</div>
                    </div>
                  </div>
                </div>
              </div> : <div className="text-center py-12 text-white/50">
                Select a persona from the gallery to view training details
              </div>}
          </div>)}

        {stryMutAct_9fa48("33317") ? activeTab === 'interact' || <div className="grid grid-cols-4 gap-6 h-[calc(100vh-280px)]">
            {/* Persona Selector */}
            <div className="bg-black/30 rounded-2xl p-4 border border-purple-800/50 overflow-y-auto">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Select Persona</h3>
              <div className="space-y-2">
                {readyPersonas.map(persona => {
              const config = ROLE_CONFIG[persona.role];
              return <button key={persona.id} onClick={() => {
                setSelectedPersona(persona);
                setChatMessages([]);
              }} className={`w-full p-3 rounded-xl text-left transition-all ${selectedPersona?.id === persona.id ? 'bg-purple-600 border border-purple-400' : 'bg-black/20 border border-transparent hover:bg-black/40'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{persona.name}</div>
                          <div className="text-xs text-white/50">{persona.department}</div>
                        </div>
                      </div>
                    </button>;
            })}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="col-span-3 bg-black/30 rounded-2xl border border-purple-800/50 flex flex-col">
              {selectedPersona ? <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-purple-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{ROLE_CONFIG[selectedPersona.role].icon}</span>
                        <div>
                          <h3 className="font-semibold">{selectedPersona.name}</h3>
                          <div className="text-sm text-white/50">{selectedPersona.title} • {selectedPersona.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ollamaStatus.available ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-white/50">
                          {ollamaStatus.available ? 'Ollama Connected' : 'Ollama Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 ? <div className="text-center py-12">
                        <div className="text-4xl mb-4">{ROLE_CONFIG[selectedPersona.role].icon}</div>
                        <h4 className="text-lg font-semibold mb-2">Start a conversation with {selectedPersona.name}</h4>
                        <p className="text-white/50 text-sm max-w-md mx-auto">
                          {ollamaStatus.available ? 'This digital executive is powered by real Ollama LLM. Ask questions, seek advice, or request analysis.' : 'Connect Ollama for AI-powered responses. Fallback responses will be used if offline.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {['What are our biggest financial risks?', 'Review the Q4 budget proposal', 'Analyze vendor contract terms'].map(q => <button key={q} onClick={() => setInputMessage(q)} className="px-3 py-1.5 bg-purple-900/50 rounded-lg text-sm hover:bg-purple-800/50 transition-colors">
                              {q}
                            </button>)}
                        </div>
                      </div> : chatMessages.map(msg => <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 rounded-br-sm' : 'bg-black/40 rounded-bl-sm'}`}>
                            {msg.role === 'assistant' && <div className="flex items-center gap-2 mb-2">
                                <span>{ROLE_CONFIG[selectedPersona.role].icon}</span>
                                <span className="text-sm font-medium">{selectedPersona.name}</span>
                                {msg.isStreaming && <span className="text-xs text-purple-400 animate-pulse">thinking...</span>}
                              </div>}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content || (msg.isStreaming ? '...' : '')}
                            </p>
                          </div>
                        </div>)}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-purple-800/30">
                    <div className="flex gap-3">
                      <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()} placeholder={`Ask ${selectedPersona.name} a question...`} disabled={isLoading} className="flex-1 px-4 py-3 bg-black/30 border border-purple-800/50 rounded-xl focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                      <button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
                        {isLoading ? <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Thinking...
                          </> : 'Send'}
                      </button>
                    </div>
                  </div>
                </> : <div className="flex-1 flex items-center justify-center text-white/50">
                  Select a persona to start a conversation
                </div>}
            </div>
          </div> : stryMutAct_9fa48("33316") ? false : stryMutAct_9fa48("33315") ? true : (stryCov_9fa48("33315", "33316", "33317"), (stryMutAct_9fa48("33319") ? activeTab !== 'interact' : stryMutAct_9fa48("33318") ? true : (stryCov_9fa48("33318", "33319"), activeTab === 'interact')) && <div className="grid grid-cols-4 gap-6 h-[calc(100vh-280px)]">
            {/* Persona Selector */}
            <div className="bg-black/30 rounded-2xl p-4 border border-purple-800/50 overflow-y-auto">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Select Persona</h3>
              <div className="space-y-2">
                {readyPersonas.map(persona => {
              const config = ROLE_CONFIG[persona.role];
              return <button key={persona.id} onClick={() => {
                setSelectedPersona(persona);
                setChatMessages(stryMutAct_9fa48("33323") ? ["Stryker was here"] : (stryCov_9fa48("33323"), []));
              }} className={`w-full p-3 rounded-xl text-left transition-all ${(stryMutAct_9fa48("33327") ? selectedPersona?.id !== persona.id : stryMutAct_9fa48("33326") ? false : stryMutAct_9fa48("33325") ? true : (stryCov_9fa48("33325", "33326", "33327"), (stryMutAct_9fa48("33328") ? selectedPersona.id : (stryCov_9fa48("33328"), selectedPersona?.id)) === persona.id)) ? 'bg-purple-600 border border-purple-400' : 'bg-black/20 border border-transparent hover:bg-black/40'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{persona.name}</div>
                          <div className="text-xs text-white/50">{persona.department}</div>
                        </div>
                      </div>
                    </button>;
            })}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="col-span-3 bg-black/30 rounded-2xl border border-purple-800/50 flex flex-col">
              {selectedPersona ? <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-purple-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{ROLE_CONFIG[selectedPersona.role].icon}</span>
                        <div>
                          <h3 className="font-semibold">{selectedPersona.name}</h3>
                          <div className="text-sm text-white/50">{selectedPersona.title} • {selectedPersona.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ollamaStatus.available ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-white/50">
                          {ollamaStatus.available ? 'Ollama Connected' : 'Ollama Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {(stryMutAct_9fa48("33338") ? chatMessages.length !== 0 : stryMutAct_9fa48("33337") ? false : stryMutAct_9fa48("33336") ? true : (stryCov_9fa48("33336", "33337", "33338"), chatMessages.length === 0)) ? <div className="text-center py-12">
                        <div className="text-4xl mb-4">{ROLE_CONFIG[selectedPersona.role].icon}</div>
                        <h4 className="text-lg font-semibold mb-2">Start a conversation with {selectedPersona.name}</h4>
                        <p className="text-white/50 text-sm max-w-md mx-auto">
                          {ollamaStatus.available ? 'This digital executive is powered by real Ollama LLM. Ask questions, seek advice, or request analysis.' : 'Connect Ollama for AI-powered responses. Fallback responses will be used if offline.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {(stryMutAct_9fa48("33341") ? [] : (stryCov_9fa48("33341"), ['What are our biggest financial risks?', 'Review the Q4 budget proposal', 'Analyze vendor contract terms'])).map(stryMutAct_9fa48("33345") ? () => undefined : (stryCov_9fa48("33345"), q => <button key={q} onClick={stryMutAct_9fa48("33346") ? () => undefined : (stryCov_9fa48("33346"), () => setInputMessage(q))} className="px-3 py-1.5 bg-purple-900/50 rounded-lg text-sm hover:bg-purple-800/50 transition-colors">
                              {q}
                            </button>))}
                        </div>
                      </div> : chatMessages.map(stryMutAct_9fa48("33347") ? () => undefined : (stryCov_9fa48("33347"), msg => <div key={msg.id} className={`flex ${(stryMutAct_9fa48("33351") ? msg.role !== 'user' : stryMutAct_9fa48("33350") ? false : stryMutAct_9fa48("33349") ? true : (stryCov_9fa48("33349", "33350", "33351"), msg.role === 'user')) ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl ${(stryMutAct_9fa48("33358") ? msg.role !== 'user' : stryMutAct_9fa48("33357") ? false : stryMutAct_9fa48("33356") ? true : (stryCov_9fa48("33356", "33357", "33358"), msg.role === 'user')) ? 'bg-purple-600 rounded-br-sm' : 'bg-black/40 rounded-bl-sm'}`}>
                            {stryMutAct_9fa48("33364") ? msg.role === 'assistant' || <div className="flex items-center gap-2 mb-2">
                                <span>{ROLE_CONFIG[selectedPersona.role].icon}</span>
                                <span className="text-sm font-medium">{selectedPersona.name}</span>
                                {msg.isStreaming && <span className="text-xs text-purple-400 animate-pulse">thinking...</span>}
                              </div> : stryMutAct_9fa48("33363") ? false : stryMutAct_9fa48("33362") ? true : (stryCov_9fa48("33362", "33363", "33364"), (stryMutAct_9fa48("33366") ? msg.role !== 'assistant' : stryMutAct_9fa48("33365") ? true : (stryCov_9fa48("33365", "33366"), msg.role === 'assistant')) && <div className="flex items-center gap-2 mb-2">
                                <span>{ROLE_CONFIG[selectedPersona.role].icon}</span>
                                <span className="text-sm font-medium">{selectedPersona.name}</span>
                                {stryMutAct_9fa48("33370") ? msg.isStreaming || <span className="text-xs text-purple-400 animate-pulse">thinking...</span> : stryMutAct_9fa48("33369") ? false : stryMutAct_9fa48("33368") ? true : (stryCov_9fa48("33368", "33369", "33370"), msg.isStreaming && <span className="text-xs text-purple-400 animate-pulse">thinking...</span>)}
                              </div>)}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {stryMutAct_9fa48("33373") ? msg.content && (msg.isStreaming ? '...' : '') : stryMutAct_9fa48("33372") ? false : stryMutAct_9fa48("33371") ? true : (stryCov_9fa48("33371", "33372", "33373"), msg.content || (msg.isStreaming ? '...' : ''))}
                            </p>
                          </div>
                        </div>))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-purple-800/30">
                    <div className="flex gap-3">
                      <input type="text" value={inputMessage} onChange={stryMutAct_9fa48("33376") ? () => undefined : (stryCov_9fa48("33376"), e => setInputMessage(e.target.value))} onKeyDown={stryMutAct_9fa48("33377") ? () => undefined : (stryCov_9fa48("33377"), e => stryMutAct_9fa48("33380") ? e.key === 'Enter' && !e.shiftKey || handleSendMessage() : stryMutAct_9fa48("33379") ? false : stryMutAct_9fa48("33378") ? true : (stryCov_9fa48("33378", "33379", "33380"), (stryMutAct_9fa48("33382") ? e.key === 'Enter' || !e.shiftKey : stryMutAct_9fa48("33381") ? true : (stryCov_9fa48("33381", "33382"), (stryMutAct_9fa48("33384") ? e.key !== 'Enter' : stryMutAct_9fa48("33383") ? true : (stryCov_9fa48("33383", "33384"), e.key === 'Enter')) && (stryMutAct_9fa48("33386") ? e.shiftKey : (stryCov_9fa48("33386"), !e.shiftKey)))) && handleSendMessage()))} placeholder={`Ask ${selectedPersona.name} a question...`} disabled={isLoading} className="flex-1 px-4 py-3 bg-black/30 border border-purple-800/50 rounded-xl focus:outline-none focus:border-purple-500 disabled:opacity-50" />
                      <button onClick={handleSendMessage} disabled={stryMutAct_9fa48("33390") ? !inputMessage.trim() && isLoading : stryMutAct_9fa48("33389") ? false : stryMutAct_9fa48("33388") ? true : (stryCov_9fa48("33388", "33389", "33390"), (stryMutAct_9fa48("33391") ? inputMessage.trim() : (stryCov_9fa48("33391"), !(stryMutAct_9fa48("33392") ? inputMessage : (stryCov_9fa48("33392"), inputMessage.trim())))) || isLoading)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2">
                        {isLoading ? <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Thinking...
                          </> : 'Send'}
                      </button>
                    </div>
                  </div>
                </> : <div className="flex-1 flex items-center justify-center text-white/50">
                  Select a persona to start a conversation
                </div>}
            </div>
          </div>)}

        {stryMutAct_9fa48("33396") ? activeTab === 'marketplace' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🛒 Agent Packs Marketplace</h2>
              <p className="text-white/60">
                Pre-configured digital executive packages optimized for specific industries and use cases.
                Each pack includes trained personas, integrations, and dedicated support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {AGENT_PACKS.map(pack => <div key={pack.id} className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{pack.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-sm ${pack.supportLevel === 'enterprise' ? 'bg-amber-600' : pack.supportLevel === 'premium' ? 'bg-purple-600' : 'bg-neutral-600'}`}>
                      {pack.supportLevel}
                    </span>
                  </div>
                  <p className="text-white/60 mb-4">{pack.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pack.personas.map(role => <span key={role} className="flex items-center gap-1 px-2 py-1 bg-purple-900/50 rounded text-sm">
                        {ROLE_CONFIG[role].icon} {ROLE_CONFIG[role].title.split(' ').pop()}
                      </span>)}
                  </div>

                  <div className="space-y-2 mb-4">
                    {pack.features.map(feature => <div key={feature} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-white/80">{feature}</span>
                      </div>)}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-800/30">
                    <div>
                      <div className="text-3xl font-bold">${pack.price.toLocaleString()}</div>
                      <div className="text-xs text-white/50">one-time + training</div>
                    </div>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                      Request Demo
                    </button>
                  </div>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("33395") ? false : stryMutAct_9fa48("33394") ? true : (stryCov_9fa48("33394", "33395", "33396"), (stryMutAct_9fa48("33398") ? activeTab !== 'marketplace' : stryMutAct_9fa48("33397") ? true : (stryCov_9fa48("33397", "33398"), activeTab === 'marketplace')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🛒 Agent Packs Marketplace</h2>
              <p className="text-white/60">
                Pre-configured digital executive packages optimized for specific industries and use cases.
                Each pack includes trained personas, integrations, and dedicated support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {AGENT_PACKS.map(stryMutAct_9fa48("33400") ? () => undefined : (stryCov_9fa48("33400"), pack => <div key={pack.id} className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{pack.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("33404") ? pack.supportLevel !== 'enterprise' : stryMutAct_9fa48("33403") ? false : stryMutAct_9fa48("33402") ? true : (stryCov_9fa48("33402", "33403", "33404"), pack.supportLevel === 'enterprise')) ? 'bg-amber-600' : (stryMutAct_9fa48("33409") ? pack.supportLevel !== 'premium' : stryMutAct_9fa48("33408") ? false : stryMutAct_9fa48("33407") ? true : (stryCov_9fa48("33407", "33408", "33409"), pack.supportLevel === 'premium')) ? 'bg-purple-600' : 'bg-neutral-600'}`}>
                      {pack.supportLevel}
                    </span>
                  </div>
                  <p className="text-white/60 mb-4">{pack.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pack.personas.map(stryMutAct_9fa48("33413") ? () => undefined : (stryCov_9fa48("33413"), role => <span key={role} className="flex items-center gap-1 px-2 py-1 bg-purple-900/50 rounded text-sm">
                        {ROLE_CONFIG[role].icon} {ROLE_CONFIG[role].title.split(' ').pop()}
                      </span>))}
                  </div>

                  <div className="space-y-2 mb-4">
                    {pack.features.map(stryMutAct_9fa48("33415") ? () => undefined : (stryCov_9fa48("33415"), feature => <div key={feature} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-white/80">{feature}</span>
                      </div>))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-800/30">
                    <div>
                      <div className="text-3xl font-bold">${pack.price.toLocaleString()}</div>
                      <div className="text-xs text-white/50">one-time + training</div>
                    </div>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                      Request Demo
                    </button>
                  </div>
                </div>))}
            </div>
          </div>)}
      </main>
    </div>;
};
export default PersonaForgePage;