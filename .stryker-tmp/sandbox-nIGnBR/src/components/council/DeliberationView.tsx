/**
 * Deliberation View Component
 * Real-time display of AI council deliberation with streaming messages
 */
// @ts-nocheck
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
import { cn } from '../../../lib/utils';
import { wsClient } from '../../lib/api/websocket';
import { councilApi } from '../../lib/api';
import type { Deliberation as ApiDeliberation, DeliberationMessage as ApiDeliberationMessage } from '../../lib/api/types';
import AgentCard from './AgentCard';
import { UserInterventionPanel, UserRole, UserIntervention } from './UserInterventionPanel';
interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy';
}
interface DeliberationMessage {
  id: string;
  agentId: string;
  phase: string;
  content: string;
  sources?: Array<{
    entityId: string;
    name: string;
    relevance: number;
  }>;
  confidence?: number;
  timestamp: string;
}
interface Deliberation {
  id: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  phase: string;
  progress: number;
  agents: string[];
  result?: {
    decision: string;
    confidence: number;
    dissent?: string[];
  };
}
interface DeliberationViewProps {
  deliberationId: string;
  agents: Agent[];
  onComplete?: (result: Deliberation['result']) => void;
  onCancel?: () => void;
  enableUserIntervention?: boolean;
}

// Phase display names
const phaseNames: Record<string, string> = stryMutAct_9fa48("3154") ? {} : (stryCov_9fa48("3154"), {
  initial_analysis: 'Initial Analysis',
  cross_examination: 'Cross-Examination',
  synthesis: 'Synthesis',
  ethics_check: 'Ethics Check'
});

// Phase colors
const phaseColors: Record<string, string> = stryMutAct_9fa48("3159") ? {} : (stryCov_9fa48("3159"), {
  initial_analysis: '#3B82F6',
  cross_examination: '#F59E0B',
  synthesis: '#10B981',
  ethics_check: '#8B5CF6'
});
export const DeliberationView: React.FC<DeliberationViewProps> = ({
  deliberationId,
  agents,
  onComplete,
  onCancel,
  enableUserIntervention = stryMutAct_9fa48("3164") ? false : (stryCov_9fa48("3164"), true)
}) => {
  const [deliberation, setDeliberation] = useState<Deliberation | null>(null);
  const [messages, setMessages] = useState<DeliberationMessage[]>(stryMutAct_9fa48("3166") ? ["Stryker was here"] : (stryCov_9fa48("3166"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("3167") ? false : (stryCov_9fa48("3167"), true));
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(stryMutAct_9fa48("3168") ? true : (stryCov_9fa48("3168"), false));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // User intervention state
  const [showInterventionPanel, setShowInterventionPanel] = useState(stryMutAct_9fa48("3169") ? true : (stryCov_9fa48("3169"), false));
  const [savedUserRole, setSavedUserRole] = useState<UserRole | null>(null);
  const [userInterventions, setUserInterventions] = useState<UserIntervention[]>(stryMutAct_9fa48("3170") ? ["Stryker was here"] : (stryCov_9fa48("3170"), []));

  // Load saved user role
  useEffect(() => {
    const saved = localStorage.getItem('datacendia_user_role');
    if (stryMutAct_9fa48("3174") ? false : stryMutAct_9fa48("3173") ? true : (stryCov_9fa48("3173", "3174"), saved)) {
      try {
        setSavedUserRole(JSON.parse(saved));
      } catch (e) {/* ignore */}
    }
  }, stryMutAct_9fa48("3177") ? ["Stryker was here"] : (stryCov_9fa48("3177"), []));
  const handleSaveUserRole = (role: UserRole) => {
    setSavedUserRole(role);
    localStorage.setItem('datacendia_user_role', JSON.stringify(role));
  };
  const handleUserIntervention = async (intervention: Omit<UserIntervention, 'id' | 'timestamp'>) => {
    const newIntervention: UserIntervention = stryMutAct_9fa48("3181") ? {} : (stryCov_9fa48("3181"), {
      ...intervention,
      id: `intervention-${Date.now()}`,
      timestamp: new Date()
    });
    setUserInterventions(stryMutAct_9fa48("3183") ? () => undefined : (stryCov_9fa48("3183"), prev => stryMutAct_9fa48("3184") ? [] : (stryCov_9fa48("3184"), [...prev, newIntervention])));

    // Add user message to the messages stream
    const userMessage: DeliberationMessage = stryMutAct_9fa48("3185") ? {} : (stryCov_9fa48("3185"), {
      id: `user-msg-${Date.now()}`,
      agentId: 'user',
      phase: stryMutAct_9fa48("3190") ? deliberation?.phase && 'user_intervention' : stryMutAct_9fa48("3189") ? false : stryMutAct_9fa48("3188") ? true : (stryCov_9fa48("3188", "3189", "3190"), (stryMutAct_9fa48("3191") ? deliberation.phase : (stryCov_9fa48("3191"), deliberation?.phase)) || 'user_intervention'),
      content: `**[${intervention.userRole.title} - ${intervention.userRole.department}]**: ${intervention.content}`,
      timestamp: new Date().toISOString()
    });
    setMessages(stryMutAct_9fa48("3194") ? () => undefined : (stryCov_9fa48("3194"), prev => stryMutAct_9fa48("3195") ? [] : (stryCov_9fa48("3195"), [...prev, userMessage])));

    // Send to backend (optional - for real integration)
    try {
      await councilApi.addUserIntervention(deliberationId, stryMutAct_9fa48("3197") ? {} : (stryCov_9fa48("3197"), {
        role: intervention.userRole,
        content: intervention.content,
        type: intervention.type
      }));
    } catch (err) {
      console.log('User intervention sent locally');
    }
    setShowInterventionPanel(stryMutAct_9fa48("3200") ? true : (stryCov_9fa48("3200"), false));
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    stryMutAct_9fa48("3202") ? messagesEndRef.current.scrollIntoView({
      behavior: 'smooth'
    }) : (stryCov_9fa48("3202"), messagesEndRef.current?.scrollIntoView(stryMutAct_9fa48("3203") ? {} : (stryCov_9fa48("3203"), {
      behavior: 'smooth'
    })));
  }, stryMutAct_9fa48("3205") ? ["Stryker was here"] : (stryCov_9fa48("3205"), []));
  useEffect(() => {
    scrollToBottom();
  }, stryMutAct_9fa48("3207") ? [] : (stryCov_9fa48("3207"), [messages, scrollToBottom]));

  // Load initial data and connect to WebSocket
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    const initialize = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("3211") ? false : (stryCov_9fa48("3211"), true));

        // Fetch current deliberation state
        const response = await councilApi.getDeliberation(deliberationId);
        if (stryMutAct_9fa48("3214") ? response.success || response.data : stryMutAct_9fa48("3213") ? false : stryMutAct_9fa48("3212") ? true : (stryCov_9fa48("3212", "3213", "3214"), response.success && response.data)) {
          setDeliberation(response.data);
          if (stryMutAct_9fa48("3218") ? response.data.status === 'completed' || response.data.result : stryMutAct_9fa48("3217") ? false : stryMutAct_9fa48("3216") ? true : (stryCov_9fa48("3216", "3217", "3218"), (stryMutAct_9fa48("3220") ? response.data.status !== 'completed' : stryMutAct_9fa48("3219") ? true : (stryCov_9fa48("3219", "3220"), response.data.status === 'completed')) && response.data.result)) {
            stryMutAct_9fa48("3223") ? onComplete(response.data.result) : (stryCov_9fa48("3223"), onComplete?.(response.data.result));
          }
        }

        // Fetch existing transcript
        const transcriptResponse = await councilApi.getDeliberationTranscript(deliberationId);
        if (stryMutAct_9fa48("3226") ? transcriptResponse.success || transcriptResponse.data : stryMutAct_9fa48("3225") ? false : stryMutAct_9fa48("3224") ? true : (stryCov_9fa48("3224", "3225", "3226"), transcriptResponse.success && transcriptResponse.data)) {
          const allMessages: DeliberationMessage[] = stryMutAct_9fa48("3228") ? ["Stryker was here"] : (stryCov_9fa48("3228"), []);
          transcriptResponse.data.phases.forEach((phase: {
            phase: string;
            messages: DeliberationMessage[];
          }) => {
            allMessages.push(...phase.messages);
          });
          setMessages(allMessages);
        }

        // Connect to WebSocket for real-time updates
        wsClient.connect();
        wsClient.subscribeToDeliberation(deliberationId);
        setIsStreaming(stryMutAct_9fa48("3230") ? false : (stryCov_9fa48("3230"), true));

        // Listen for new messages
        unsubscribe = wsClient.on('deliberation:message', (data: unknown) => {
          const message = data as DeliberationMessage & {
            deliberationId: string;
          };
          if (stryMutAct_9fa48("3235") ? message.deliberationId !== deliberationId : stryMutAct_9fa48("3234") ? false : stryMutAct_9fa48("3233") ? true : (stryCov_9fa48("3233", "3234", "3235"), message.deliberationId === deliberationId)) {
            setMessages(stryMutAct_9fa48("3237") ? () => undefined : (stryCov_9fa48("3237"), prev => stryMutAct_9fa48("3238") ? [] : (stryCov_9fa48("3238"), [...prev, message])));
          }
        });

        // Listen for phase changes
        wsClient.on('deliberation:phase', (data: unknown) => {
          const update = data as {
            deliberationId: string;
            phase: string;
            progress: number;
          };
          if (stryMutAct_9fa48("3243") ? update.deliberationId !== deliberationId : stryMutAct_9fa48("3242") ? false : stryMutAct_9fa48("3241") ? true : (stryCov_9fa48("3241", "3242", "3243"), update.deliberationId === deliberationId)) {
            setDeliberation(stryMutAct_9fa48("3245") ? () => undefined : (stryCov_9fa48("3245"), prev => prev ? stryMutAct_9fa48("3246") ? {} : (stryCov_9fa48("3246"), {
              ...prev,
              phase: update.phase,
              progress: update.progress
            }) : null));
          }
        });

        // Listen for completion
        wsClient.on('deliberation:complete', (data: unknown) => {
          const result = data as {
            deliberationId: string;
            result: Deliberation['result'];
          };
          if (stryMutAct_9fa48("3251") ? result.deliberationId !== deliberationId : stryMutAct_9fa48("3250") ? false : stryMutAct_9fa48("3249") ? true : (stryCov_9fa48("3249", "3250", "3251"), result.deliberationId === deliberationId)) {
            setDeliberation(stryMutAct_9fa48("3253") ? () => undefined : (stryCov_9fa48("3253"), prev => prev ? stryMutAct_9fa48("3254") ? {} : (stryCov_9fa48("3254"), {
              ...prev,
              status: 'completed',
              result: result.result
            }) : null));
            stryMutAct_9fa48("3256") ? onComplete(result.result) : (stryCov_9fa48("3256"), onComplete?.(result.result));
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deliberation');
      } finally {
        setIsLoading(stryMutAct_9fa48("3260") ? true : (stryCov_9fa48("3260"), false));
      }
    };
    initialize();
    return () => {
      stryMutAct_9fa48("3262") ? unsubscribe() : (stryCov_9fa48("3262"), unsubscribe?.());
      wsClient.unsubscribeFromDeliberation(deliberationId);
    };
  }, stryMutAct_9fa48("3263") ? [] : (stryCov_9fa48("3263"), [deliberationId, onComplete]));
  const handleCancel = async () => {
    try {
      await councilApi.controlDeliberation(deliberationId, 'cancel');
      stryMutAct_9fa48("3267") ? onCancel() : (stryCov_9fa48("3267"), onCancel?.());
    } catch (err) {
      setError('Failed to cancel deliberation');
    }
  };
  const handleSkipToSynthesis = async () => {
    try {
      await councilApi.controlDeliberation(deliberationId, 'skip_to_synthesis');
    } catch (err) {
      setError('Failed to skip to synthesis');
    }
  };
  const getAgentById = (agentId: string) => {
    return agents.find(stryMutAct_9fa48("3276") ? () => undefined : (stryCov_9fa48("3276"), a => stryMutAct_9fa48("3279") ? a.id === agentId && a.code === agentId : stryMutAct_9fa48("3278") ? false : stryMutAct_9fa48("3277") ? true : (stryCov_9fa48("3277", "3278", "3279"), (stryMutAct_9fa48("3281") ? a.id !== agentId : stryMutAct_9fa48("3280") ? false : (stryCov_9fa48("3280", "3281"), a.id === agentId)) || (stryMutAct_9fa48("3283") ? a.code !== agentId : stryMutAct_9fa48("3282") ? false : (stryCov_9fa48("3282", "3283"), a.code === agentId)))));
  };
  if (stryMutAct_9fa48("3285") ? false : stryMutAct_9fa48("3284") ? true : (stryCov_9fa48("3284", "3285"), isLoading)) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading deliberation...</p>
        </div>
      </div>;
  }
  if (stryMutAct_9fa48("3288") ? false : stryMutAct_9fa48("3287") ? true : (stryCov_9fa48("3287", "3288"), error)) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>;
  }
  if (stryMutAct_9fa48("3292") ? false : stryMutAct_9fa48("3291") ? true : stryMutAct_9fa48("3290") ? deliberation : (stryCov_9fa48("3290", "3291", "3292"), !deliberation)) {
    return null;
  }
  return <div className="flex flex-col h-full bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-semibold text-neutral-900">Council Deliberation</h2>
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{deliberation.question}</p>
          </div>
          <div className="flex items-center gap-2">
            {stryMutAct_9fa48("3296") ? isStreaming || <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span> : stryMutAct_9fa48("3295") ? false : stryMutAct_9fa48("3294") ? true : (stryCov_9fa48("3294", "3295", "3296"), isStreaming && <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live
              </span>)}
            {stryMutAct_9fa48("3299") ? deliberation.status === 'in_progress' || <>
                <button onClick={handleSkipToSynthesis} className="px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 rounded">
                  Skip to Synthesis
                </button>
                <button onClick={handleCancel} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                  Cancel
                </button>
              </> : stryMutAct_9fa48("3298") ? false : stryMutAct_9fa48("3297") ? true : (stryCov_9fa48("3297", "3298", "3299"), (stryMutAct_9fa48("3301") ? deliberation.status !== 'in_progress' : stryMutAct_9fa48("3300") ? true : (stryCov_9fa48("3300", "3301"), deliberation.status === 'in_progress')) && <>
                <button onClick={handleSkipToSynthesis} className="px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 rounded">
                  Skip to Synthesis
                </button>
                <button onClick={handleCancel} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                  Cancel
                </button>
              </>)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium" style={stryMutAct_9fa48("3303") ? {} : (stryCov_9fa48("3303"), {
            color: phaseColors[deliberation.phase]
          })}>
              {stryMutAct_9fa48("3306") ? phaseNames[deliberation.phase] && deliberation.phase : stryMutAct_9fa48("3305") ? false : stryMutAct_9fa48("3304") ? true : (stryCov_9fa48("3304", "3305", "3306"), phaseNames[deliberation.phase] || deliberation.phase)}
            </span>
            <span className="text-neutral-500">{Math.round(deliberation.progress)}%</span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-500" style={stryMutAct_9fa48("3307") ? {} : (stryCov_9fa48("3307"), {
            width: `${deliberation.progress}%`,
            backgroundColor: stryMutAct_9fa48("3311") ? phaseColors[deliberation.phase] && '#6B7280' : stryMutAct_9fa48("3310") ? false : stryMutAct_9fa48("3309") ? true : (stryCov_9fa48("3309", "3310", "3311"), phaseColors[deliberation.phase] || '#6B7280')
          })} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
        const agent = getAgentById(message.agentId);
        const isNewPhase = stryMutAct_9fa48("3316") ? index === 0 && messages[index - 1].phase !== message.phase : stryMutAct_9fa48("3315") ? false : stryMutAct_9fa48("3314") ? true : (stryCov_9fa48("3314", "3315", "3316"), (stryMutAct_9fa48("3318") ? index !== 0 : stryMutAct_9fa48("3317") ? false : (stryCov_9fa48("3317", "3318"), index === 0)) || (stryMutAct_9fa48("3320") ? messages[index - 1].phase === message.phase : stryMutAct_9fa48("3319") ? false : (stryCov_9fa48("3319", "3320"), messages[stryMutAct_9fa48("3321") ? index + 1 : (stryCov_9fa48("3321"), index - 1)].phase !== message.phase)));
        return <React.Fragment key={stryMutAct_9fa48("3324") ? message.id && index : stryMutAct_9fa48("3323") ? false : stryMutAct_9fa48("3322") ? true : (stryCov_9fa48("3322", "3323", "3324"), message.id || index)}>
              {/* Phase divider */}
              {stryMutAct_9fa48("3327") ? isNewPhase || <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={{
              backgroundColor: `${phaseColors[message.phase]}20`,
              color: phaseColors[message.phase]
            }}>
                    {phaseNames[message.phase] || message.phase}
                  </span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div> : stryMutAct_9fa48("3326") ? false : stryMutAct_9fa48("3325") ? true : (stryCov_9fa48("3325", "3326", "3327"), isNewPhase && <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="px-3 py-1 text-xs font-medium rounded-full" style={stryMutAct_9fa48("3328") ? {} : (stryCov_9fa48("3328"), {
              backgroundColor: `${phaseColors[message.phase]}20`,
              color: phaseColors[message.phase]
            })}>
                    {stryMutAct_9fa48("3332") ? phaseNames[message.phase] && message.phase : stryMutAct_9fa48("3331") ? false : stryMutAct_9fa48("3330") ? true : (stryCov_9fa48("3330", "3331", "3332"), phaseNames[message.phase] || message.phase)}
                  </span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>)}

              {/* Message */}
              <div className="flex gap-3">
                {agent ? <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-700 text-sm">
                    {stryMutAct_9fa48("3333") ? agent.name : (stryCov_9fa48("3333"), agent.name.slice(0, 2))}
                  </div> : <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-200" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-neutral-900">
                      {stryMutAct_9fa48("3336") ? agent?.name && message.agentId : stryMutAct_9fa48("3335") ? false : stryMutAct_9fa48("3334") ? true : (stryCov_9fa48("3334", "3335", "3336"), (stryMutAct_9fa48("3337") ? agent.name : (stryCov_9fa48("3337"), agent?.name)) || message.agentId)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {stryMutAct_9fa48("3340") ? message.confidence || <span className="text-xs text-neutral-500">
                        {Math.round(message.confidence * 100)}% confidence
                      </span> : stryMutAct_9fa48("3339") ? false : stryMutAct_9fa48("3338") ? true : (stryCov_9fa48("3338", "3339", "3340"), message.confidence && <span className="text-xs text-neutral-500">
                        {Math.round(stryMutAct_9fa48("3341") ? message.confidence / 100 : (stryCov_9fa48("3341"), message.confidence * 100))}% confidence
                      </span>)}
                  </div>
                  <div className="text-neutral-700 whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Sources */}
                  {stryMutAct_9fa48("3344") ? message.sources && message.sources.length > 0 || <div className="mt-2 flex flex-wrap gap-1">
                      {message.sources.map((source, i) => <span key={i} className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded">
                          📊 {source.name}
                        </span>)}
                    </div> : stryMutAct_9fa48("3343") ? false : stryMutAct_9fa48("3342") ? true : (stryCov_9fa48("3342", "3343", "3344"), (stryMutAct_9fa48("3346") ? message.sources || message.sources.length > 0 : stryMutAct_9fa48("3345") ? true : (stryCov_9fa48("3345", "3346"), message.sources && (stryMutAct_9fa48("3349") ? message.sources.length <= 0 : stryMutAct_9fa48("3348") ? message.sources.length >= 0 : stryMutAct_9fa48("3347") ? true : (stryCov_9fa48("3347", "3348", "3349"), message.sources.length > 0)))) && <div className="mt-2 flex flex-wrap gap-1">
                      {message.sources.map(stryMutAct_9fa48("3350") ? () => undefined : (stryCov_9fa48("3350"), (source, i) => <span key={i} className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded">
                          📊 {source.name}
                        </span>))}
                    </div>)}
                </div>
              </div>
            </React.Fragment>;
      })}

        {/* Typing indicator */}
        {stryMutAct_9fa48("3353") ? deliberation.status === 'in_progress' || <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{
            animationDelay: '0ms'
          }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{
            animationDelay: '150ms'
          }} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{
            animationDelay: '300ms'
          }} />
            </div>
            <span>Agents are deliberating...</span>
          </div> : stryMutAct_9fa48("3352") ? false : stryMutAct_9fa48("3351") ? true : (stryCov_9fa48("3351", "3352", "3353"), (stryMutAct_9fa48("3355") ? deliberation.status !== 'in_progress' : stryMutAct_9fa48("3354") ? true : (stryCov_9fa48("3354", "3355"), deliberation.status === 'in_progress')) && <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={stryMutAct_9fa48("3357") ? {} : (stryCov_9fa48("3357"), {
            animationDelay: '0ms'
          })} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={stryMutAct_9fa48("3359") ? {} : (stryCov_9fa48("3359"), {
            animationDelay: '150ms'
          })} />
              <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={stryMutAct_9fa48("3361") ? {} : (stryCov_9fa48("3361"), {
            animationDelay: '300ms'
          })} />
            </div>
            <span>Agents are deliberating...</span>
          </div>)}

        <div ref={messagesEndRef} />
      </div>
      
      {/* User Intervention Button */}
      {stryMutAct_9fa48("3365") ? enableUserIntervention && deliberation.status === 'in_progress' || <div className="flex-shrink-0 p-3 border-t border-neutral-200 bg-neutral-50">
          <button onClick={() => setShowInterventionPanel(true)} className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 shadow-sm">
            🎤 Add Your Voice to the Deliberation
          </button>
          <p className="text-xs text-neutral-500 text-center mt-1">
            Share your perspective as a stakeholder
          </p>
        </div> : stryMutAct_9fa48("3364") ? false : stryMutAct_9fa48("3363") ? true : (stryCov_9fa48("3363", "3364", "3365"), (stryMutAct_9fa48("3367") ? enableUserIntervention || deliberation.status === 'in_progress' : stryMutAct_9fa48("3366") ? true : (stryCov_9fa48("3366", "3367"), enableUserIntervention && (stryMutAct_9fa48("3369") ? deliberation.status !== 'in_progress' : stryMutAct_9fa48("3368") ? true : (stryCov_9fa48("3368", "3369"), deliberation.status === 'in_progress')))) && <div className="flex-shrink-0 p-3 border-t border-neutral-200 bg-neutral-50">
          <button onClick={stryMutAct_9fa48("3371") ? () => undefined : (stryCov_9fa48("3371"), () => setShowInterventionPanel(stryMutAct_9fa48("3372") ? false : (stryCov_9fa48("3372"), true)))} className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 shadow-sm">
            🎤 Add Your Voice to the Deliberation
          </button>
          <p className="text-xs text-neutral-500 text-center mt-1">
            Share your perspective as a stakeholder
          </p>
        </div>)}

      {/* Result (if completed) */}
      {stryMutAct_9fa48("3375") ? deliberation.status === 'completed' && deliberation.result || <div className="flex-shrink-0 p-4 border-t border-neutral-200 bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Council Decision
          </h3>
          <p className="text-green-900 mb-2">{deliberation.result.decision}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-700">
              Confidence: {Math.round(deliberation.result.confidence * 100)}%
            </span>
            {deliberation.result.dissent && deliberation.result.dissent.length > 0 && <span className="text-amber-700">
                {deliberation.result.dissent.length} agent(s) dissented
              </span>}
            {userInterventions.length > 0 && <span className="text-primary-700">
                {userInterventions.length} user intervention(s)
              </span>}
          </div>
        </div> : stryMutAct_9fa48("3374") ? false : stryMutAct_9fa48("3373") ? true : (stryCov_9fa48("3373", "3374", "3375"), (stryMutAct_9fa48("3377") ? deliberation.status === 'completed' || deliberation.result : stryMutAct_9fa48("3376") ? true : (stryCov_9fa48("3376", "3377"), (stryMutAct_9fa48("3379") ? deliberation.status !== 'completed' : stryMutAct_9fa48("3378") ? true : (stryCov_9fa48("3378", "3379"), deliberation.status === 'completed')) && deliberation.result)) && <div className="flex-shrink-0 p-4 border-t border-neutral-200 bg-green-50">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Council Decision
          </h3>
          <p className="text-green-900 mb-2">{deliberation.result.decision}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-700">
              Confidence: {Math.round(stryMutAct_9fa48("3381") ? deliberation.result.confidence / 100 : (stryCov_9fa48("3381"), deliberation.result.confidence * 100))}%
            </span>
            {stryMutAct_9fa48("3384") ? deliberation.result.dissent && deliberation.result.dissent.length > 0 || <span className="text-amber-700">
                {deliberation.result.dissent.length} agent(s) dissented
              </span> : stryMutAct_9fa48("3383") ? false : stryMutAct_9fa48("3382") ? true : (stryCov_9fa48("3382", "3383", "3384"), (stryMutAct_9fa48("3386") ? deliberation.result.dissent || deliberation.result.dissent.length > 0 : stryMutAct_9fa48("3385") ? true : (stryCov_9fa48("3385", "3386"), deliberation.result.dissent && (stryMutAct_9fa48("3389") ? deliberation.result.dissent.length <= 0 : stryMutAct_9fa48("3388") ? deliberation.result.dissent.length >= 0 : stryMutAct_9fa48("3387") ? true : (stryCov_9fa48("3387", "3388", "3389"), deliberation.result.dissent.length > 0)))) && <span className="text-amber-700">
                {deliberation.result.dissent.length} agent(s) dissented
              </span>)}
            {stryMutAct_9fa48("3392") ? userInterventions.length > 0 || <span className="text-primary-700">
                {userInterventions.length} user intervention(s)
              </span> : stryMutAct_9fa48("3391") ? false : stryMutAct_9fa48("3390") ? true : (stryCov_9fa48("3390", "3391", "3392"), (stryMutAct_9fa48("3395") ? userInterventions.length <= 0 : stryMutAct_9fa48("3394") ? userInterventions.length >= 0 : stryMutAct_9fa48("3393") ? true : (stryCov_9fa48("3393", "3394", "3395"), userInterventions.length > 0)) && <span className="text-primary-700">
                {userInterventions.length} user intervention(s)
              </span>)}
          </div>
        </div>)}
      
      {/* User Intervention Panel */}
      <UserInterventionPanel isOpen={showInterventionPanel} onClose={stryMutAct_9fa48("3396") ? () => undefined : (stryCov_9fa48("3396"), () => setShowInterventionPanel(stryMutAct_9fa48("3397") ? true : (stryCov_9fa48("3397"), false)))} onSubmit={handleUserIntervention} currentPhase={stryMutAct_9fa48("3400") ? phaseNames[deliberation.phase] && deliberation.phase : stryMutAct_9fa48("3399") ? false : stryMutAct_9fa48("3398") ? true : (stryCov_9fa48("3398", "3399", "3400"), phaseNames[deliberation.phase] || deliberation.phase)} agentMessages={stryMutAct_9fa48("3402") ? messages.slice(-10).map(m => ({
      agentId: m.agentId,
      agentName: getAgentById(m.agentId)?.name || m.agentId,
      content: m.content
    })) : stryMutAct_9fa48("3401") ? messages.filter(m => m.agentId !== 'user').map(m => ({
      agentId: m.agentId,
      agentName: getAgentById(m.agentId)?.name || m.agentId,
      content: m.content
    })) : (stryCov_9fa48("3401", "3402"), messages.filter(stryMutAct_9fa48("3403") ? () => undefined : (stryCov_9fa48("3403"), m => stryMutAct_9fa48("3406") ? m.agentId === 'user' : stryMutAct_9fa48("3405") ? false : stryMutAct_9fa48("3404") ? true : (stryCov_9fa48("3404", "3405", "3406"), m.agentId !== 'user'))).slice(stryMutAct_9fa48("3408") ? +10 : (stryCov_9fa48("3408"), -10)).map(stryMutAct_9fa48("3409") ? () => undefined : (stryCov_9fa48("3409"), m => stryMutAct_9fa48("3410") ? {} : (stryCov_9fa48("3410"), {
      agentId: m.agentId,
      agentName: stryMutAct_9fa48("3413") ? getAgentById(m.agentId)?.name && m.agentId : stryMutAct_9fa48("3412") ? false : stryMutAct_9fa48("3411") ? true : (stryCov_9fa48("3411", "3412", "3413"), (stryMutAct_9fa48("3414") ? getAgentById(m.agentId).name : (stryCov_9fa48("3414"), getAgentById(m.agentId)?.name)) || m.agentId),
      content: m.content
    }))))} savedRole={savedUserRole} onRoleSave={handleSaveUserRole} disabled={stryMutAct_9fa48("3417") ? deliberation.status === 'in_progress' : stryMutAct_9fa48("3416") ? false : stryMutAct_9fa48("3415") ? true : (stryCov_9fa48("3415", "3416", "3417"), deliberation.status !== 'in_progress')} />
    </div>;
};
export default DeliberationView;