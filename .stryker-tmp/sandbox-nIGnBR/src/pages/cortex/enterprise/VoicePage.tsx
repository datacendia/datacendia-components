// @ts-nocheck
// =============================================================================
// CENDIA VOICE™ - AI C-SUITE IN REAL-TIME CONVERSATION
// Your AI Executives Speak in Real-Time Through Voice Agents
// "Walk Into a Room and Your Entire AI C-Suite Advises You"
// 
// CAPABILITIES:
// - Real-time voice interaction with AI executives
// - Multi-agent conversations with different perspectives
// - Context-aware responses based on organizational data
// - Meeting mode with multiple AI executives participating
// - Voice synthesis with distinct personalities
// - Real-time transcription and decision logging
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
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterpriseService, voiceSynthesis, AIExecutive, VoiceMessage, ExecutiveRole } from '../../../services/EnterpriseService';
import { ollamaService } from '../../../lib/ollama';

// =============================================================================
// LOCAL TYPES
// =============================================================================

type ConversationMode = 'single' | 'council' | 'meeting';

// Types imported from EnterpriseService

// Mock data removed - using EnterpriseService for real data

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const VoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ConversationMode>('council');
  const [executives, setExecutives] = useState<AIExecutive[]>(stryMutAct_9fa48("35657") ? ["Stryker was here"] : (stryCov_9fa48("35657"), []));
  const [activeExecutives, setActiveExecutives] = useState<ExecutiveRole[]>(stryMutAct_9fa48("35658") ? [] : (stryCov_9fa48("35658"), ['cfo', 'cro', 'ciso', 'chro']));
  const [messages, setMessages] = useState<VoiceMessage[]>(stryMutAct_9fa48("35663") ? ["Stryker was here"] : (stryCov_9fa48("35663"), []));
  const [isListening, setIsListening] = useState(stryMutAct_9fa48("35664") ? true : (stryCov_9fa48("35664"), false));
  const [userInput, setUserInput] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState<ExecutiveRole | null>(null);
  const [isSending, setIsSending] = useState(stryMutAct_9fa48("35666") ? true : (stryCov_9fa48("35666"), false));
  const [ollamaStatus, setOllamaStatus] = useState(stryMutAct_9fa48("35667") ? {} : (stryCov_9fa48("35667"), {
    available: stryMutAct_9fa48("35668") ? true : (stryCov_9fa48("35668"), false)
  }));
  const [voiceEnabled, setVoiceEnabled] = useState(stryMutAct_9fa48("35669") ? false : (stryCov_9fa48("35669"), true));
  const [isSpeaking, setIsSpeaking] = useState(stryMutAct_9fa48("35670") ? true : (stryCov_9fa48("35670"), false));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load executives from service
  useEffect(() => {
    setExecutives(enterpriseService.getExecutives());
    setMessages(enterpriseService.getVoiceMessages());
    setOllamaStatus(ollamaService.getStatus());
  }, stryMutAct_9fa48("35672") ? ["Stryker was here"] : (stryCov_9fa48("35672"), []));

  // Auto-scroll to bottom of messages
  useEffect(() => {
    stryMutAct_9fa48("35674") ? messagesEndRef.current.scrollIntoView({
      behavior: 'smooth'
    }) : (stryCov_9fa48("35674"), messagesEndRef.current?.scrollIntoView(stryMutAct_9fa48("35675") ? {} : (stryCov_9fa48("35675"), {
      behavior: 'smooth'
    })));
  }, stryMutAct_9fa48("35677") ? [] : (stryCov_9fa48("35677"), [messages]));
  const handleSubmit = async () => {
    if (stryMutAct_9fa48("35681") ? !userInput.trim() && isSending : stryMutAct_9fa48("35680") ? false : stryMutAct_9fa48("35679") ? true : (stryCov_9fa48("35679", "35680", "35681"), (stryMutAct_9fa48("35682") ? userInput.trim() : (stryCov_9fa48("35682"), !(stryMutAct_9fa48("35683") ? userInput : (stryCov_9fa48("35683"), userInput.trim())))) || isSending)) {
      return;
    }
    setIsSending(stryMutAct_9fa48("35685") ? false : (stryCov_9fa48("35685"), true));
    setCurrentSpeaker(stryMutAct_9fa48("35688") ? activeExecutives[0] && null : stryMutAct_9fa48("35687") ? false : stryMutAct_9fa48("35686") ? true : (stryCov_9fa48("35686", "35687", "35688"), activeExecutives[0] || null));
    try {
      // Use real Enterprise Service with Ollama integration
      const targetExec = (stryMutAct_9fa48("35692") ? mode !== 'single' : stryMutAct_9fa48("35691") ? false : stryMutAct_9fa48("35690") ? true : (stryCov_9fa48("35690", "35691", "35692"), mode === 'single')) ? activeExecutives[0] : undefined;
      const responses = await enterpriseService.sendVoiceMessage(userInput, targetExec);
      setMessages(enterpriseService.getVoiceMessages());

      // Speak the AI responses if voice is enabled
      if (stryMutAct_9fa48("35696") ? voiceEnabled || voiceSynthesis.isAvailable() : stryMutAct_9fa48("35695") ? false : stryMutAct_9fa48("35694") ? true : (stryCov_9fa48("35694", "35695", "35696"), voiceEnabled && voiceSynthesis.isAvailable())) {
        for (const response of responses) {
          if (stryMutAct_9fa48("35701") ? response.speaker === 'user' : stryMutAct_9fa48("35700") ? false : stryMutAct_9fa48("35699") ? true : (stryCov_9fa48("35699", "35700", "35701"), response.speaker !== 'user')) {
            setIsSpeaking(stryMutAct_9fa48("35704") ? false : (stryCov_9fa48("35704"), true));
            setCurrentSpeaker(response.speaker as ExecutiveRole);
            try {
              await voiceSynthesis.speak(response.content, response.speaker as ExecutiveRole);
            } catch (e) {
              console.warn('Speech failed:', e);
            }
          }
        }
        setIsSpeaking(stryMutAct_9fa48("35708") ? true : (stryCov_9fa48("35708"), false));
      }
    } catch (error) {
      console.error('Voice message error:', error);
    } finally {
      setUserInput('');
      setCurrentSpeaker(null);
      setIsSending(stryMutAct_9fa48("35713") ? true : (stryCov_9fa48("35713"), false));
    }
  };
  const toggleExecutive = (role: ExecutiveRole) => {
    setActiveExecutives(stryMutAct_9fa48("35715") ? () => undefined : (stryCov_9fa48("35715"), prev => prev.includes(role) ? stryMutAct_9fa48("35716") ? prev : (stryCov_9fa48("35716"), prev.filter(stryMutAct_9fa48("35717") ? () => undefined : (stryCov_9fa48("35717"), r => stryMutAct_9fa48("35720") ? r === role : stryMutAct_9fa48("35719") ? false : stryMutAct_9fa48("35718") ? true : (stryCov_9fa48("35718", "35719", "35720"), r !== role)))) : stryMutAct_9fa48("35721") ? [] : (stryCov_9fa48("35721"), [...prev, role])));
  };
  const startVoiceInput = () => {
    setIsListening(stryMutAct_9fa48("35723") ? false : (stryCov_9fa48("35723"), true));
    // In production, this would use Web Speech API
    setTimeout(() => {
      setIsListening(stryMutAct_9fa48("35725") ? true : (stryCov_9fa48("35725"), false));
      setUserInput("What's our current financial outlook for Q4?");
    }, 3000);
  };
  return <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-violet-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("35727") ? () => undefined : (stryCov_9fa48("35727"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🎙️</span>
                  CendiaVoice™
                  <span className="text-xs bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 rounded-full font-medium">
                    VOICE AI
                  </span>
                </h1>
                <p className="text-violet-300 text-sm">AI C-Suite in Real-Time Conversation • Your Digital Boardroom</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mode Selector */}
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                {(stryMutAct_9fa48("35729") ? [] : (stryCov_9fa48("35729"), [stryMutAct_9fa48("35730") ? {} : (stryCov_9fa48("35730"), {
                id: 'single',
                label: '1:1',
                icon: '👤'
              }), stryMutAct_9fa48("35734") ? {} : (stryCov_9fa48("35734"), {
                id: 'council',
                label: 'Council',
                icon: '👥'
              }), stryMutAct_9fa48("35738") ? {} : (stryCov_9fa48("35738"), {
                id: 'meeting',
                label: 'Meeting',
                icon: '🏛️'
              })])).map(stryMutAct_9fa48("35742") ? () => undefined : (stryCov_9fa48("35742"), m => <button key={m.id} onClick={stryMutAct_9fa48("35743") ? () => undefined : (stryCov_9fa48("35743"), () => setMode(m.id as ConversationMode))} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${(stryMutAct_9fa48("35747") ? mode !== m.id : stryMutAct_9fa48("35746") ? false : stryMutAct_9fa48("35745") ? true : (stryCov_9fa48("35745", "35746", "35747"), mode === m.id)) ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'}`}>
                    {m.icon} {m.label}
                  </button>))}
              </div>
              
              {/* Voice Toggle */}
              <button onClick={() => {
              if (stryMutAct_9fa48("35752") ? false : stryMutAct_9fa48("35751") ? true : (stryCov_9fa48("35751", "35752"), isSpeaking)) {
                voiceSynthesis.stop();
              }
              setVoiceEnabled(stryMutAct_9fa48("35754") ? voiceEnabled : (stryCov_9fa48("35754"), !voiceEnabled));
            }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${voiceEnabled ? 'bg-violet-600 text-white' : 'bg-black/30 text-white/60'}`}>
                {voiceEnabled ? '🔊' : '🔇'} Voice {voiceEnabled ? 'On' : 'Off'}
              </button>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : currentSpeaker ? 'bg-amber-400' : 'bg-neutral-500'}`} />
                <span className="text-sm text-white/60">
                  {isSpeaking ? 'Speaking...' : currentSpeaker ? 'Thinking...' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Executive Panel */}
          <div className="bg-black/30 rounded-2xl p-4 border border-violet-800/50 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">AI Executives</h3>
            <div className="space-y-3">
              {executives.map(stryMutAct_9fa48("35769") ? () => undefined : (stryCov_9fa48("35769"), exec => <div key={exec.id} onClick={stryMutAct_9fa48("35770") ? () => undefined : (stryCov_9fa48("35770"), () => toggleExecutive(exec.role))} className={`p-3 rounded-xl cursor-pointer transition-all ${activeExecutives.includes(exec.role) ? 'bg-violet-900/50 border border-violet-600' : 'bg-black/20 border border-transparent hover:bg-black/30'} ${(stryMutAct_9fa48("35776") ? exec.status !== 'speaking' : stryMutAct_9fa48("35775") ? false : stryMutAct_9fa48("35774") ? true : (stryCov_9fa48("35774", "35775", "35776"), exec.status === 'speaking')) ? 'ring-2 ring-green-400' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${(stryMutAct_9fa48("35783") ? exec.status !== 'speaking' : stryMutAct_9fa48("35782") ? false : stryMutAct_9fa48("35781") ? true : (stryCov_9fa48("35781", "35782", "35783"), exec.status === 'speaking')) ? 'bg-green-600 animate-pulse' : activeExecutives.includes(exec.role) ? 'bg-violet-700' : 'bg-neutral-800'}`}>
                      {exec.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{exec.name}</div>
                      <div className="text-xs text-white/50">{exec.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${(stryMutAct_9fa48("35791") ? exec.status !== 'speaking' : stryMutAct_9fa48("35790") ? false : stryMutAct_9fa48("35789") ? true : (stryCov_9fa48("35789", "35790", "35791"), exec.status === 'speaking')) ? 'bg-green-400' : (stryMutAct_9fa48("35796") ? exec.status !== 'thinking' : stryMutAct_9fa48("35795") ? false : stryMutAct_9fa48("35794") ? true : (stryCov_9fa48("35794", "35795", "35796"), exec.status === 'thinking')) ? 'bg-amber-400' : activeExecutives.includes(exec.role) ? 'bg-violet-400' : 'bg-neutral-600'}`} />
                        <span className="text-xs text-white/40 capitalize">{exec.status}</span>
                      </div>
                    </div>
                  </div>
                </div>))}
            </div>

            {/* Active Executives Count */}
            <div className="mt-4 p-3 bg-violet-900/30 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">{activeExecutives.length}</div>
                <div className="text-xs text-white/50">Executives in Session</div>
              </div>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="col-span-2 bg-black/30 rounded-2xl border border-violet-800/50 flex flex-col">
            {/* Conversation Header */}
            <div className="p-4 border-b border-violet-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {(stryMutAct_9fa48("35803") ? mode !== 'single' : stryMutAct_9fa48("35802") ? false : stryMutAct_9fa48("35801") ? true : (stryCov_9fa48("35801", "35802", "35803"), mode === 'single')) ? 'Executive Consultation' : (stryMutAct_9fa48("35808") ? mode !== 'council' : stryMutAct_9fa48("35807") ? false : stryMutAct_9fa48("35806") ? true : (stryCov_9fa48("35806", "35807", "35808"), mode === 'council')) ? 'Executive Council Session' : 'Board Meeting'}
                  </h3>
                  <div className="text-sm text-white/50">
                    {activeExecutives.length} executives • {messages.length} messages
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {stryMutAct_9fa48("35812") ? activeExecutives.map(role => {
                  const exec = executives.find(e => e.role === role);
                  return <div key={role} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentSpeaker === role ? 'bg-green-600 ring-2 ring-green-400' : 'bg-violet-800'}`} title={exec?.name}>
                        {exec?.avatar}
                      </div>;
                }) : (stryCov_9fa48("35812"), activeExecutives.slice(0, 4).map(role => {
                  const exec = executives.find(stryMutAct_9fa48("35814") ? () => undefined : (stryCov_9fa48("35814"), e => stryMutAct_9fa48("35817") ? e.role !== role : stryMutAct_9fa48("35816") ? false : stryMutAct_9fa48("35815") ? true : (stryCov_9fa48("35815", "35816", "35817"), e.role === role)));
                  return <div key={role} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${(stryMutAct_9fa48("35821") ? currentSpeaker !== role : stryMutAct_9fa48("35820") ? false : stryMutAct_9fa48("35819") ? true : (stryCov_9fa48("35819", "35820", "35821"), currentSpeaker === role)) ? 'bg-green-600 ring-2 ring-green-400' : 'bg-violet-800'}`} title={stryMutAct_9fa48("35824") ? exec.name : (stryCov_9fa48("35824"), exec?.name)}>
                        {stryMutAct_9fa48("35825") ? exec.avatar : (stryCov_9fa48("35825"), exec?.avatar)}
                      </div>;
                }))}
                  {stryMutAct_9fa48("35828") ? activeExecutives.length > 4 || <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs">
                      +{activeExecutives.length - 4}
                    </div> : stryMutAct_9fa48("35827") ? false : stryMutAct_9fa48("35826") ? true : (stryCov_9fa48("35826", "35827", "35828"), (stryMutAct_9fa48("35831") ? activeExecutives.length <= 4 : stryMutAct_9fa48("35830") ? activeExecutives.length >= 4 : stryMutAct_9fa48("35829") ? true : (stryCov_9fa48("35829", "35830", "35831"), activeExecutives.length > 4)) && <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs">
                      +{stryMutAct_9fa48("35832") ? activeExecutives.length + 4 : (stryCov_9fa48("35832"), activeExecutives.length - 4)}
                    </div>)}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {(stryMutAct_9fa48("35835") ? messages.length !== 0 : stryMutAct_9fa48("35834") ? false : stryMutAct_9fa48("35833") ? true : (stryCov_9fa48("35833", "35834", "35835"), messages.length === 0)) ? <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎙️</div>
                  <h4 className="text-xl font-semibold mb-2">Start Your Executive Session</h4>
                  <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
                    Speak or type to engage with your AI C-suite. They'll provide real-time insights
                    based on your organization's data and their specialized expertise.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(stryMutAct_9fa48("35836") ? [] : (stryCov_9fa48("35836"), ["What's our Q4 financial outlook?", "Review the security posture", "Analyze employee retention risk"])).map(stryMutAct_9fa48("35840") ? () => undefined : (stryCov_9fa48("35840"), q => <button key={q} onClick={stryMutAct_9fa48("35841") ? () => undefined : (stryCov_9fa48("35841"), () => setUserInput(q))} className="px-4 py-2 bg-violet-900/50 rounded-xl text-sm hover:bg-violet-800/50 transition-colors">
                        {q}
                      </button>))}
                  </div>
                </div> : messages.map(msg => {
              const exec = executives.find(stryMutAct_9fa48("35843") ? () => undefined : (stryCov_9fa48("35843"), e => stryMutAct_9fa48("35846") ? e.role !== msg.speaker : stryMutAct_9fa48("35845") ? false : stryMutAct_9fa48("35844") ? true : (stryCov_9fa48("35844", "35845", "35846"), e.role === msg.speaker)));
              const isUser = stryMutAct_9fa48("35849") ? msg.speaker !== 'user' : stryMutAct_9fa48("35848") ? false : stryMutAct_9fa48("35847") ? true : (stryCov_9fa48("35847", "35848", "35849"), msg.speaker === 'user');
              return <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${isUser ? 'bg-violet-600' : 'bg-black/40'}`}>
                            {isUser ? '👤' : stryMutAct_9fa48("35864") ? exec.avatar : (stryCov_9fa48("35864"), exec?.avatar)}
                          </div>
                          <div className={`p-4 rounded-2xl ${isUser ? 'bg-violet-600 rounded-br-sm' : 'bg-black/40 rounded-bl-sm'}`}>
                            {stryMutAct_9fa48("35870") ? !isUser || <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-sm">{msg.speakerName}</span>
                                {msg.sentiment && <span className={`text-xs px-2 py-0.5 rounded ${msg.sentiment === 'positive' ? 'bg-green-900/50 text-green-300' : msg.sentiment === 'warning' ? 'bg-red-900/50 text-red-300' : msg.sentiment === 'cautious' ? 'bg-amber-900/50 text-amber-300' : 'bg-neutral-800 text-neutral-300'}`}>
                                    {msg.sentiment}
                                  </span>}
                              </div> : stryMutAct_9fa48("35869") ? false : stryMutAct_9fa48("35868") ? true : (stryCov_9fa48("35868", "35869", "35870"), (stryMutAct_9fa48("35871") ? isUser : (stryCov_9fa48("35871"), !isUser)) && <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-sm">{msg.speakerName}</span>
                                {stryMutAct_9fa48("35874") ? msg.sentiment || <span className={`text-xs px-2 py-0.5 rounded ${msg.sentiment === 'positive' ? 'bg-green-900/50 text-green-300' : msg.sentiment === 'warning' ? 'bg-red-900/50 text-red-300' : msg.sentiment === 'cautious' ? 'bg-amber-900/50 text-amber-300' : 'bg-neutral-800 text-neutral-300'}`}>
                                    {msg.sentiment}
                                  </span> : stryMutAct_9fa48("35873") ? false : stryMutAct_9fa48("35872") ? true : (stryCov_9fa48("35872", "35873", "35874"), msg.sentiment && <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("35878") ? msg.sentiment !== 'positive' : stryMutAct_9fa48("35877") ? false : stryMutAct_9fa48("35876") ? true : (stryCov_9fa48("35876", "35877", "35878"), msg.sentiment === 'positive')) ? 'bg-green-900/50 text-green-300' : (stryMutAct_9fa48("35883") ? msg.sentiment !== 'warning' : stryMutAct_9fa48("35882") ? false : stryMutAct_9fa48("35881") ? true : (stryCov_9fa48("35881", "35882", "35883"), msg.sentiment === 'warning')) ? 'bg-red-900/50 text-red-300' : (stryMutAct_9fa48("35888") ? msg.sentiment !== 'cautious' : stryMutAct_9fa48("35887") ? false : stryMutAct_9fa48("35886") ? true : (stryCov_9fa48("35886", "35887", "35888"), msg.sentiment === 'cautious')) ? 'bg-amber-900/50 text-amber-300' : 'bg-neutral-800 text-neutral-300'}`}>
                                    {msg.sentiment}
                                  </span>)}
                              </div>)}
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <div className={`text-xs mt-2 ${isUser ? 'text-violet-200' : 'text-white/40'}`}>
                              {msg.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>;
            })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-violet-800/30">
              <div className="flex gap-3">
                <button onClick={startVoiceInput} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-600 animate-pulse' : 'bg-violet-700 hover:bg-violet-600'}`}>
                  <span className="text-xl">{isListening ? '🔴' : '🎤'}</span>
                </button>
                <input type="text" value={userInput} onChange={stryMutAct_9fa48("35900") ? () => undefined : (stryCov_9fa48("35900"), e => setUserInput(e.target.value))} onKeyDown={stryMutAct_9fa48("35901") ? () => undefined : (stryCov_9fa48("35901"), e => stryMutAct_9fa48("35904") ? e.key === 'Enter' || handleSubmit() : stryMutAct_9fa48("35903") ? false : stryMutAct_9fa48("35902") ? true : (stryCov_9fa48("35902", "35903", "35904"), (stryMutAct_9fa48("35906") ? e.key !== 'Enter' : stryMutAct_9fa48("35905") ? true : (stryCov_9fa48("35905", "35906"), e.key === 'Enter')) && handleSubmit()))} placeholder="Speak or type your question to the executives..." className="flex-1 px-4 py-3 bg-black/30 border border-violet-800/50 rounded-xl focus:outline-none focus:border-violet-500" />
                <button onClick={handleSubmit} disabled={stryMutAct_9fa48("35910") ? !userInput.trim() && currentSpeaker !== null : stryMutAct_9fa48("35909") ? false : stryMutAct_9fa48("35908") ? true : (stryCov_9fa48("35908", "35909", "35910"), (stryMutAct_9fa48("35911") ? userInput.trim() : (stryCov_9fa48("35911"), !(stryMutAct_9fa48("35912") ? userInput : (stryCov_9fa48("35912"), userInput.trim())))) || (stryMutAct_9fa48("35914") ? currentSpeaker === null : stryMutAct_9fa48("35913") ? false : (stryCov_9fa48("35913", "35914"), currentSpeaker !== null)))} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all">
                  Send
                </button>
              </div>
              {stryMutAct_9fa48("35917") ? isListening || <div className="mt-3 text-center text-sm text-violet-300 animate-pulse">
                  🎤 Listening... Speak now
                </div> : stryMutAct_9fa48("35916") ? false : stryMutAct_9fa48("35915") ? true : (stryCov_9fa48("35915", "35916", "35917"), isListening && <div className="mt-3 text-center text-sm text-violet-300 animate-pulse">
                  🎤 Listening... Speak now
                </div>)}
            </div>
          </div>

          {/* Insights Panel */}
          <div className="bg-black/30 rounded-2xl p-4 border border-violet-800/50 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Session Insights</h3>
            
            {/* Live Metrics */}
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-xs text-white/50 mb-1">Session Duration</div>
                <div className="text-xl font-bold text-violet-400">
                  {Math.floor(stryMutAct_9fa48("35918") ? messages.length / 0.5 : (stryCov_9fa48("35918"), messages.length * 0.5))}:00
                </div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-xs text-white/50 mb-1">Messages Exchanged</div>
                <div className="text-xl font-bold text-amber-400">
                  {messages.length}
                </div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-xs text-white/50 mb-1">Consensus Level</div>
                <div className="text-xl font-bold text-green-400">
                  {(stryMutAct_9fa48("35922") ? messages.length <= 0 : stryMutAct_9fa48("35921") ? messages.length >= 0 : stryMutAct_9fa48("35920") ? false : stryMutAct_9fa48("35919") ? true : (stryCov_9fa48("35919", "35920", "35921", "35922"), messages.length > 0)) ? '78%' : '-'}
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Key Points</h4>
              {(stryMutAct_9fa48("35928") ? messages.filter(m => m.speaker !== 'user').length <= 0 : stryMutAct_9fa48("35927") ? messages.filter(m => m.speaker !== 'user').length >= 0 : stryMutAct_9fa48("35926") ? false : stryMutAct_9fa48("35925") ? true : (stryCov_9fa48("35925", "35926", "35927", "35928"), (stryMutAct_9fa48("35929") ? messages.length : (stryCov_9fa48("35929"), messages.filter(stryMutAct_9fa48("35930") ? () => undefined : (stryCov_9fa48("35930"), m => stryMutAct_9fa48("35933") ? m.speaker === 'user' : stryMutAct_9fa48("35932") ? false : stryMutAct_9fa48("35931") ? true : (stryCov_9fa48("35931", "35932", "35933"), m.speaker !== 'user'))).length)) > 0)) ? <div className="space-y-2">
                  {stryMutAct_9fa48("35936") ? messages.slice(-3).map(msg => {
                const exec = executives.find(e => e.role === msg.speaker);
                return <div key={msg.id} className="p-2 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{exec?.avatar}</span>
                          <span className="text-xs font-medium">{exec?.name.split(' ')[0]}</span>
                        </div>
                        <p className="text-xs text-white/70 line-clamp-2">{msg.content}</p>
                      </div>;
              }) : stryMutAct_9fa48("35935") ? messages.filter(m => m.speaker !== 'user').map(msg => {
                const exec = executives.find(e => e.role === msg.speaker);
                return <div key={msg.id} className="p-2 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{exec?.avatar}</span>
                          <span className="text-xs font-medium">{exec?.name.split(' ')[0]}</span>
                        </div>
                        <p className="text-xs text-white/70 line-clamp-2">{msg.content}</p>
                      </div>;
              }) : (stryCov_9fa48("35935", "35936"), messages.filter(stryMutAct_9fa48("35937") ? () => undefined : (stryCov_9fa48("35937"), m => stryMutAct_9fa48("35940") ? m.speaker === 'user' : stryMutAct_9fa48("35939") ? false : stryMutAct_9fa48("35938") ? true : (stryCov_9fa48("35938", "35939", "35940"), m.speaker !== 'user'))).slice(stryMutAct_9fa48("35942") ? +3 : (stryCov_9fa48("35942"), -3)).map(msg => {
                const exec = executives.find(stryMutAct_9fa48("35944") ? () => undefined : (stryCov_9fa48("35944"), e => stryMutAct_9fa48("35947") ? e.role !== msg.speaker : stryMutAct_9fa48("35946") ? false : stryMutAct_9fa48("35945") ? true : (stryCov_9fa48("35945", "35946", "35947"), e.role === msg.speaker)));
                return <div key={msg.id} className="p-2 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{stryMutAct_9fa48("35948") ? exec.avatar : (stryCov_9fa48("35948"), exec?.avatar)}</span>
                          <span className="text-xs font-medium">{stryMutAct_9fa48("35949") ? exec.name.split(' ')[0] : (stryCov_9fa48("35949"), exec?.name.split(' ')[0])}</span>
                        </div>
                        <p className="text-xs text-white/70 line-clamp-2">{msg.content}</p>
                      </div>;
              }))}
                </div> : <div className="text-center py-4 text-white/40 text-sm">
                  Key points will appear here
                </div>}
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  📋 Export Transcript
                </button>
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  📊 Generate Summary
                </button>
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  🎯 Create Action Items
                </button>
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  📅 Schedule Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default VoicePage;