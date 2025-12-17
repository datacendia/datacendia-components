// @ts-nocheck
// =============================================================================
// DATACENDIA COUNCIL STREAMING HOOKS
// React Hooks for Real-time AI Deliberations
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
import { useState, useEffect, useCallback, useRef } from 'react';
import { CouncilStreamClient, getCouncilStreamClient, DeliberationState, StreamEvent, AgentStreamState } from './CouncilStreamClient';

// =============================================================================
// TYPES
// =============================================================================

export interface UseCouncilStreamOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}
export interface UseDeliberationOptions {
  onPhaseChange?: (phase: string) => void;
  onAgentStart?: (agentId: string) => void;
  onAgentComplete?: (agentId: string, content: string) => void;
  onToken?: (agentId: string, token: string) => void;
  onChallenge?: (challengerId: string, targetId: string) => void;
  onComplete?: (synthesis: string, confidence: number) => void;
  onError?: (error: string) => void;
}

// =============================================================================
// useCouncilConnection - Connection Management
// =============================================================================

export function useCouncilConnection(options: UseCouncilStreamOptions = {}) {
  const {
    autoConnect = stryMutAct_9fa48("14704") ? false : (stryCov_9fa48("14704"), true),
    onConnect,
    onDisconnect,
    onError
  } = options;
  const [isConnected, setIsConnected] = useState(stryMutAct_9fa48("14705") ? true : (stryCov_9fa48("14705"), false));
  const [isConnecting, setIsConnecting] = useState(stryMutAct_9fa48("14706") ? true : (stryCov_9fa48("14706"), false));
  const clientRef = useRef<CouncilStreamClient | null>(null);
  useEffect(() => {
    clientRef.current = getCouncilStreamClient();
    const unsubscribe = clientRef.current.onConnectionChange(connected => {
      setIsConnected(connected);
      setIsConnecting(stryMutAct_9fa48("14709") ? true : (stryCov_9fa48("14709"), false));
      if (stryMutAct_9fa48("14711") ? false : stryMutAct_9fa48("14710") ? true : (stryCov_9fa48("14710", "14711"), connected)) {
        stryMutAct_9fa48("14713") ? onConnect() : (stryCov_9fa48("14713"), onConnect?.());
      } else {
        stryMutAct_9fa48("14715") ? onDisconnect() : (stryCov_9fa48("14715"), onDisconnect?.());
      }
    });
    if (stryMutAct_9fa48("14717") ? false : stryMutAct_9fa48("14716") ? true : (stryCov_9fa48("14716", "14717"), autoConnect)) {
      setIsConnecting(stryMutAct_9fa48("14719") ? false : (stryCov_9fa48("14719"), true));
      clientRef.current.connect().catch(error => {
        setIsConnecting(stryMutAct_9fa48("14721") ? true : (stryCov_9fa48("14721"), false));
        stryMutAct_9fa48("14722") ? onError(error) : (stryCov_9fa48("14722"), onError?.(error));
      });
    }
    return () => {
      unsubscribe();
    };
  }, stryMutAct_9fa48("14724") ? [] : (stryCov_9fa48("14724"), [autoConnect]));
  const connect = useCallback(async () => {
    if (stryMutAct_9fa48("14728") ? false : stryMutAct_9fa48("14727") ? true : stryMutAct_9fa48("14726") ? clientRef.current : (stryCov_9fa48("14726", "14727", "14728"), !clientRef.current)) {
      return;
    }
    setIsConnecting(stryMutAct_9fa48("14730") ? false : (stryCov_9fa48("14730"), true));
    try {
      await clientRef.current.connect();
    } catch (error) {
      stryMutAct_9fa48("14733") ? onError(error) : (stryCov_9fa48("14733"), onError?.(error));
    } finally {
      setIsConnecting(stryMutAct_9fa48("14735") ? true : (stryCov_9fa48("14735"), false));
    }
  }, stryMutAct_9fa48("14736") ? [] : (stryCov_9fa48("14736"), [onError]));
  const disconnect = useCallback(() => {
    stryMutAct_9fa48("14738") ? clientRef.current.disconnect() : (stryCov_9fa48("14738"), clientRef.current?.disconnect());
  }, stryMutAct_9fa48("14739") ? ["Stryker was here"] : (stryCov_9fa48("14739"), []));
  return stryMutAct_9fa48("14740") ? {} : (stryCov_9fa48("14740"), {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    client: clientRef.current
  });
}

// =============================================================================
// useDeliberation - Single Deliberation Management
// =============================================================================

export function useDeliberation(deliberationId: string | null, options: UseDeliberationOptions = {}) {
  const {
    onPhaseChange,
    onAgentStart,
    onAgentComplete,
    onToken,
    onChallenge,
    onComplete,
    onError
  } = options;
  const [state, setState] = useState<DeliberationState | null>(null);
  const [agentResponses, setAgentResponses] = useState<Map<string, AgentStreamState>>(new Map());
  const [currentPhase, setCurrentPhase] = useState<string>('pending');
  const [isStreaming, setIsStreaming] = useState(stryMutAct_9fa48("14743") ? true : (stryCov_9fa48("14743"), false));
  const [streamingAgentId, setStreamingAgentId] = useState<string | null>(null);
  const clientRef = useRef<CouncilStreamClient | null>(null);
  useEffect(() => {
    if (stryMutAct_9fa48("14747") ? false : stryMutAct_9fa48("14746") ? true : stryMutAct_9fa48("14745") ? deliberationId : (stryCov_9fa48("14745", "14746", "14747"), !deliberationId)) {
      return;
    }
    clientRef.current = getCouncilStreamClient();

    // Subscribe to deliberation
    clientRef.current.subscribe(deliberationId);

    // Listen for state changes
    const unsubscribeState = clientRef.current.onStateChange(newState => {
      if (stryMutAct_9fa48("14752") ? newState.id !== deliberationId : stryMutAct_9fa48("14751") ? false : stryMutAct_9fa48("14750") ? true : (stryCov_9fa48("14750", "14751", "14752"), newState.id === deliberationId)) {
        setState(newState);
        setAgentResponses(new Map(newState.responses));
        setCurrentPhase(newState.currentPhase);
      }
    });

    // Listen for events
    const unsubscribeEvents = clientRef.current.onEvent(deliberationId, event => {
      switch (event.type) {
        case 'phase_change':
          if (stryMutAct_9fa48("14755")) {} else {
            stryCov_9fa48("14755");
            setCurrentPhase(stryMutAct_9fa48("14759") ? event.phase && 'unknown' : stryMutAct_9fa48("14758") ? false : stryMutAct_9fa48("14757") ? true : (stryCov_9fa48("14757", "14758", "14759"), event.phase || 'unknown'));
            stryMutAct_9fa48("14761") ? onPhaseChange(event.phase || 'unknown') : (stryCov_9fa48("14761"), onPhaseChange?.(stryMutAct_9fa48("14764") ? event.phase && 'unknown' : stryMutAct_9fa48("14763") ? false : stryMutAct_9fa48("14762") ? true : (stryCov_9fa48("14762", "14763", "14764"), event.phase || 'unknown')));
            break;
          }
        case 'agent_start':
          if (stryMutAct_9fa48("14766")) {} else {
            stryCov_9fa48("14766");
            setIsStreaming(stryMutAct_9fa48("14768") ? false : (stryCov_9fa48("14768"), true));
            setStreamingAgentId(stryMutAct_9fa48("14771") ? event.agentId && null : stryMutAct_9fa48("14770") ? false : stryMutAct_9fa48("14769") ? true : (stryCov_9fa48("14769", "14770", "14771"), event.agentId || null));
            if (stryMutAct_9fa48("14773") ? false : stryMutAct_9fa48("14772") ? true : (stryCov_9fa48("14772", "14773"), event.agentId)) {
              stryMutAct_9fa48("14775") ? onAgentStart(event.agentId) : (stryCov_9fa48("14775"), onAgentStart?.(event.agentId));
            }
            break;
          }
        case 'token':
          if (stryMutAct_9fa48("14776")) {} else {
            stryCov_9fa48("14776");
            if (stryMutAct_9fa48("14780") ? event.agentId || event.content : stryMutAct_9fa48("14779") ? false : stryMutAct_9fa48("14778") ? true : (stryCov_9fa48("14778", "14779", "14780"), event.agentId && event.content)) {
              setAgentResponses(prev => {
                const updated = new Map(prev);
                const agentState = stryMutAct_9fa48("14785") ? updated.get(event.agentId!) && {
                  agentId: event.agentId!,
                  phase: currentPhase,
                  isStreaming: true,
                  content: '',
                  challenges: []
                } : stryMutAct_9fa48("14784") ? false : stryMutAct_9fa48("14783") ? true : (stryCov_9fa48("14783", "14784", "14785"), updated.get(event.agentId!) || (stryMutAct_9fa48("14786") ? {} : (stryCov_9fa48("14786"), {
                  agentId: event.agentId!,
                  phase: currentPhase,
                  isStreaming: stryMutAct_9fa48("14787") ? false : (stryCov_9fa48("14787"), true),
                  content: '',
                  challenges: stryMutAct_9fa48("14789") ? ["Stryker was here"] : (stryCov_9fa48("14789"), [])
                })));
                stryMutAct_9fa48("14790") ? agentState.content -= event.content : (stryCov_9fa48("14790"), agentState.content += event.content);
                updated.set(event.agentId!, agentState);
                return updated;
              });
              stryMutAct_9fa48("14791") ? onToken(event.agentId, event.content) : (stryCov_9fa48("14791"), onToken?.(event.agentId, event.content));
            }
            break;
          }
        case 'agent_complete':
          if (stryMutAct_9fa48("14792")) {} else {
            stryCov_9fa48("14792");
            setIsStreaming(stryMutAct_9fa48("14794") ? true : (stryCov_9fa48("14794"), false));
            setStreamingAgentId(null);
            if (stryMutAct_9fa48("14797") ? event.agentId || event.content : stryMutAct_9fa48("14796") ? false : stryMutAct_9fa48("14795") ? true : (stryCov_9fa48("14795", "14796", "14797"), event.agentId && event.content)) {
              stryMutAct_9fa48("14799") ? onAgentComplete(event.agentId, event.content) : (stryCov_9fa48("14799"), onAgentComplete?.(event.agentId, event.content));
            }
            break;
          }
        case 'challenge':
          if (stryMutAct_9fa48("14800")) {} else {
            stryCov_9fa48("14800");
            if (stryMutAct_9fa48("14804") ? event.agentId || event.metadata?.targetAgentId : stryMutAct_9fa48("14803") ? false : stryMutAct_9fa48("14802") ? true : (stryCov_9fa48("14802", "14803", "14804"), event.agentId && (stryMutAct_9fa48("14805") ? event.metadata.targetAgentId : (stryCov_9fa48("14805"), event.metadata?.targetAgentId)))) {
              stryMutAct_9fa48("14807") ? onChallenge(event.agentId, event.metadata.targetAgentId) : (stryCov_9fa48("14807"), onChallenge?.(event.agentId, event.metadata.targetAgentId));
            }
            break;
          }
        case 'complete':
          if (stryMutAct_9fa48("14808")) {} else {
            stryCov_9fa48("14808");
            if (stryMutAct_9fa48("14812") ? event.content || event.metadata?.confidence : stryMutAct_9fa48("14811") ? false : stryMutAct_9fa48("14810") ? true : (stryCov_9fa48("14810", "14811", "14812"), event.content && (stryMutAct_9fa48("14813") ? event.metadata.confidence : (stryCov_9fa48("14813"), event.metadata?.confidence)))) {
              stryMutAct_9fa48("14815") ? onComplete(event.content, event.metadata.confidence) : (stryCov_9fa48("14815"), onComplete?.(event.content, event.metadata.confidence));
            }
            break;
          }
        case 'error':
          if (stryMutAct_9fa48("14816")) {} else {
            stryCov_9fa48("14816");
            stryMutAct_9fa48("14818") ? onError(event.content || 'Unknown error') : (stryCov_9fa48("14818"), onError?.(stryMutAct_9fa48("14821") ? event.content && 'Unknown error' : stryMutAct_9fa48("14820") ? false : stryMutAct_9fa48("14819") ? true : (stryCov_9fa48("14819", "14820", "14821"), event.content || 'Unknown error')));
            break;
          }
      }
    });
    return () => {
      unsubscribeState();
      unsubscribeEvents();
      stryMutAct_9fa48("14824") ? clientRef.current.unsubscribe(deliberationId) : (stryCov_9fa48("14824"), clientRef.current?.unsubscribe(deliberationId));
    };
  }, stryMutAct_9fa48("14825") ? [] : (stryCov_9fa48("14825"), [deliberationId, currentPhase]));
  return stryMutAct_9fa48("14826") ? {} : (stryCov_9fa48("14826"), {
    state,
    agentResponses,
    currentPhase,
    isStreaming,
    streamingAgentId
  });
}

// =============================================================================
// useCouncilDeliberation - Full Deliberation with Controls
// =============================================================================

export interface DeliberationConfig {
  maxDurationSeconds?: number;
  requireConsensus?: boolean;
  enableCrossExamination?: boolean;
  minConfidenceThreshold?: number;
  maxRounds?: number;
}
export function useCouncilDeliberation() {
  const [activeDeliberationId, setActiveDeliberationId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(stryMutAct_9fa48("14828") ? true : (stryCov_9fa48("14828"), false));
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<CouncilStreamClient | null>(null);
  useEffect(() => {
    clientRef.current = getCouncilStreamClient();
  }, stryMutAct_9fa48("14830") ? ["Stryker was here"] : (stryCov_9fa48("14830"), []));
  const startDeliberation = useCallback(async (question: string, options: {
    agentIds?: string[];
    context?: string;
    config?: DeliberationConfig;
  } = {}) => {
    if (stryMutAct_9fa48("14834") ? false : stryMutAct_9fa48("14833") ? true : stryMutAct_9fa48("14832") ? clientRef.current : (stryCov_9fa48("14832", "14833", "14834"), !clientRef.current)) {
      setError('Client not initialized');
      return null;
    }
    setIsStarting(stryMutAct_9fa48("14837") ? false : (stryCov_9fa48("14837"), true));
    setError(null);
    try {
      // Connect if not connected
      if (stryMutAct_9fa48("14841") ? false : stryMutAct_9fa48("14840") ? true : stryMutAct_9fa48("14839") ? clientRef.current.isConnected() : (stryCov_9fa48("14839", "14840", "14841"), !clientRef.current.isConnected())) {
        await clientRef.current.connect();
      }

      // Start deliberation via WebSocket
      clientRef.current.startDeliberation(question, options);

      // The deliberation ID will come back via WebSocket message
      // We'll update the activeDeliberationId when we receive it

      return stryMutAct_9fa48("14843") ? false : (stryCov_9fa48("14843"), true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start deliberation');
      return null;
    } finally {
      setIsStarting(stryMutAct_9fa48("14847") ? true : (stryCov_9fa48("14847"), false));
    }
  }, stryMutAct_9fa48("14848") ? ["Stryker was here"] : (stryCov_9fa48("14848"), []));
  const cancelDeliberation = useCallback(() => {
    if (stryMutAct_9fa48("14852") ? activeDeliberationId || clientRef.current : stryMutAct_9fa48("14851") ? false : stryMutAct_9fa48("14850") ? true : (stryCov_9fa48("14850", "14851", "14852"), activeDeliberationId && clientRef.current)) {
      clientRef.current.unsubscribe(activeDeliberationId);
      setActiveDeliberationId(null);
    }
  }, stryMutAct_9fa48("14854") ? [] : (stryCov_9fa48("14854"), [activeDeliberationId]));

  // Listen for new deliberation ID
  useEffect(() => {
    if (stryMutAct_9fa48("14858") ? false : stryMutAct_9fa48("14857") ? true : stryMutAct_9fa48("14856") ? clientRef.current : (stryCov_9fa48("14856", "14857", "14858"), !clientRef.current)) {
      return;
    }
    const unsubscribe = clientRef.current.onStateChange(state => {
      if (stryMutAct_9fa48("14863") ? !activeDeliberationId || state.status === 'initial_analysis' : stryMutAct_9fa48("14862") ? false : stryMutAct_9fa48("14861") ? true : (stryCov_9fa48("14861", "14862", "14863"), (stryMutAct_9fa48("14864") ? activeDeliberationId : (stryCov_9fa48("14864"), !activeDeliberationId)) && (stryMutAct_9fa48("14866") ? state.status !== 'initial_analysis' : stryMutAct_9fa48("14865") ? true : (stryCov_9fa48("14865", "14866"), state.status === 'initial_analysis')))) {
        setActiveDeliberationId(state.id);
      }
    });
    return unsubscribe;
  }, stryMutAct_9fa48("14869") ? [] : (stryCov_9fa48("14869"), [activeDeliberationId]));
  return stryMutAct_9fa48("14870") ? {} : (stryCov_9fa48("14870"), {
    activeDeliberationId,
    isStarting,
    error,
    startDeliberation,
    cancelDeliberation,
    setActiveDeliberationId
  });
}

// =============================================================================
// useAgentStream - Stream Single Agent Response
// =============================================================================

export function useAgentStream(deliberationId: string | null, agentId: string | null) {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(stryMutAct_9fa48("14873") ? true : (stryCov_9fa48("14873"), false));
  const [isComplete, setIsComplete] = useState(stryMutAct_9fa48("14874") ? true : (stryCov_9fa48("14874"), false));
  const [confidence, setConfidence] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  useEffect(() => {
    if (stryMutAct_9fa48("14878") ? !deliberationId && !agentId : stryMutAct_9fa48("14877") ? false : stryMutAct_9fa48("14876") ? true : (stryCov_9fa48("14876", "14877", "14878"), (stryMutAct_9fa48("14879") ? deliberationId : (stryCov_9fa48("14879"), !deliberationId)) || (stryMutAct_9fa48("14880") ? agentId : (stryCov_9fa48("14880"), !agentId)))) {
      return;
    }
    const client = getCouncilStreamClient();
    const unsubscribe = client.onEvent(deliberationId, event => {
      if (stryMutAct_9fa48("14885") ? event.agentId === agentId : stryMutAct_9fa48("14884") ? false : stryMutAct_9fa48("14883") ? true : (stryCov_9fa48("14883", "14884", "14885"), event.agentId !== agentId)) {
        return;
      }
      switch (event.type) {
        case 'agent_start':
          if (stryMutAct_9fa48("14887")) {} else {
            stryCov_9fa48("14887");
            setContent('');
            setIsStreaming(stryMutAct_9fa48("14890") ? false : (stryCov_9fa48("14890"), true));
            setIsComplete(stryMutAct_9fa48("14891") ? true : (stryCov_9fa48("14891"), false));
            break;
          }
        case 'token':
          if (stryMutAct_9fa48("14892")) {} else {
            stryCov_9fa48("14892");
            if (stryMutAct_9fa48("14895") ? false : stryMutAct_9fa48("14894") ? true : (stryCov_9fa48("14894", "14895"), event.content)) {
              setContent(stryMutAct_9fa48("14897") ? () => undefined : (stryCov_9fa48("14897"), prev => stryMutAct_9fa48("14898") ? prev - event.content : (stryCov_9fa48("14898"), prev + event.content)));
            }
            break;
          }
        case 'agent_complete':
          if (stryMutAct_9fa48("14899")) {} else {
            stryCov_9fa48("14899");
            setIsStreaming(stryMutAct_9fa48("14901") ? true : (stryCov_9fa48("14901"), false));
            setIsComplete(stryMutAct_9fa48("14902") ? false : (stryCov_9fa48("14902"), true));
            if (stryMutAct_9fa48("14904") ? false : stryMutAct_9fa48("14903") ? true : (stryCov_9fa48("14903", "14904"), event.content)) {
              setContent(event.content);
            }
            if (stryMutAct_9fa48("14908") ? event.metadata.confidence : stryMutAct_9fa48("14907") ? false : stryMutAct_9fa48("14906") ? true : (stryCov_9fa48("14906", "14907", "14908"), event.metadata?.confidence)) {
              setConfidence(event.metadata.confidence);
            }
            if (stryMutAct_9fa48("14912") ? event.metadata.latency : stryMutAct_9fa48("14911") ? false : stryMutAct_9fa48("14910") ? true : (stryCov_9fa48("14910", "14911", "14912"), event.metadata?.latency)) {
              setLatency(event.metadata.latency);
            }
            break;
          }
      }
    });
    return unsubscribe;
  }, stryMutAct_9fa48("14914") ? [] : (stryCov_9fa48("14914"), [deliberationId, agentId]));
  return stryMutAct_9fa48("14915") ? {} : (stryCov_9fa48("14915"), {
    content,
    isStreaming,
    isComplete,
    confidence,
    latency
  });
}

// =============================================================================
// Export all hooks
// =============================================================================

export default stryMutAct_9fa48("14916") ? {} : (stryCov_9fa48("14916"), {
  useCouncilConnection,
  useDeliberation,
  useCouncilDeliberation,
  useAgentStream
});