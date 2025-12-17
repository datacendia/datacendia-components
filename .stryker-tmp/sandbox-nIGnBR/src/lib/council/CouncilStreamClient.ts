// @ts-nocheck
// =============================================================================
// DATACENDIA COUNCIL STREAMING CLIENT
// Real-time WebSocket Client for AI Deliberations
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
export interface StreamEvent {
  type: 'start' | 'token' | 'complete' | 'error' | 'phase_change' | 'agent_start' | 'agent_complete' | 'challenge' | 'synthesis';
  deliberationId: string;
  agentId?: string;
  content?: string;
  phase?: string;
  metadata?: any;
  timestamp: Date;
}
export interface DeliberationState {
  id: string;
  question: string;
  status: string;
  currentPhase: string;
  participatingAgents: string[];
  responses: Map<string, AgentStreamState>;
  synthesis?: string;
  confidence?: number;
  startedAt?: Date;
  completedAt?: Date;
}
export interface AgentStreamState {
  agentId: string;
  phase: string;
  isStreaming: boolean;
  content: string;
  confidence?: number;
  latency?: number;
  challenges: ChallengeState[];
}
export interface ChallengeState {
  challengerId: string;
  content: string;
  rebuttal?: string;
  resolved: boolean;
}
type EventCallback = (event: StreamEvent) => void;
type StateCallback = (state: DeliberationState) => void;
type ConnectionCallback = (connected: boolean) => void;

// =============================================================================
// COUNCIL STREAM CLIENT
// =============================================================================

export class CouncilStreamClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: number | null = null;
  private isConnecting = stryMutAct_9fa48("14454") ? true : (stryCov_9fa48("14454"), false);

  // Event handlers
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private stateListeners: Set<StateCallback> = new Set();
  private connectionListeners: Set<ConnectionCallback> = new Set();

  // State
  private deliberationStates: Map<string, DeliberationState> = new Map();
  private subscribedDeliberations: Set<string> = new Set();
  constructor(url?: string) {
    this.url = stryMutAct_9fa48("14458") ? url && this.getDefaultUrl() : stryMutAct_9fa48("14457") ? false : stryMutAct_9fa48("14456") ? true : (stryCov_9fa48("14456", "14457", "14458"), url || this.getDefaultUrl());
  }
  private getDefaultUrl(): string {
    const protocol = (stryMutAct_9fa48("14462") ? window.location.protocol !== 'https:' : stryMutAct_9fa48("14461") ? false : stryMutAct_9fa48("14460") ? true : (stryCov_9fa48("14460", "14461", "14462"), window.location.protocol === 'https:')) ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws/council`;
  }

  // ===========================================================================
  // CONNECTION MANAGEMENT
  // ===========================================================================

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (stryMutAct_9fa48("14471") ? this.ws?.readyState !== WebSocket.OPEN : stryMutAct_9fa48("14470") ? false : stryMutAct_9fa48("14469") ? true : (stryCov_9fa48("14469", "14470", "14471"), (stryMutAct_9fa48("14472") ? this.ws.readyState : (stryCov_9fa48("14472"), this.ws?.readyState)) === WebSocket.OPEN)) {
        resolve();
        return;
      }
      if (stryMutAct_9fa48("14475") ? false : stryMutAct_9fa48("14474") ? true : (stryCov_9fa48("14474", "14475"), this.isConnecting)) {
        reject(new Error('Already connecting'));
        return;
      }
      this.isConnecting = stryMutAct_9fa48("14478") ? false : (stryCov_9fa48("14478"), true);
      try {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
          console.log('[CouncilStream] Connected');
          this.isConnecting = stryMutAct_9fa48("14482") ? true : (stryCov_9fa48("14482"), false);
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyConnectionListeners(stryMutAct_9fa48("14483") ? false : (stryCov_9fa48("14483"), true));

          // Resubscribe to deliberations
          for (const id of this.subscribedDeliberations) {
            this.send(stryMutAct_9fa48("14485") ? {} : (stryCov_9fa48("14485"), {
              type: 'subscribe',
              deliberationId: id
            }));
          }
          resolve();
        };
        this.ws.onclose = event => {
          console.log('[CouncilStream] Disconnected', event.code, event.reason);
          this.isConnecting = stryMutAct_9fa48("14489") ? true : (stryCov_9fa48("14489"), false);
          this.stopHeartbeat();
          this.notifyConnectionListeners(stryMutAct_9fa48("14490") ? true : (stryCov_9fa48("14490"), false));
          this.attemptReconnect();
        };
        this.ws.onerror = error => {
          console.error('[CouncilStream] Error', error);
          this.isConnecting = stryMutAct_9fa48("14493") ? true : (stryCov_9fa48("14493"), false);
          reject(error);
        };
        this.ws.onmessage = event => {
          this.handleMessage(event.data);
        };
      } catch (error) {
        this.isConnecting = stryMutAct_9fa48("14496") ? true : (stryCov_9fa48("14496"), false);
        reject(error);
      }
    });
  }
  disconnect(): void {
    this.stopHeartbeat();
    if (stryMutAct_9fa48("14499") ? false : stryMutAct_9fa48("14498") ? true : (stryCov_9fa48("14498", "14499"), this.ws)) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }
  private attemptReconnect(): void {
    if (stryMutAct_9fa48("14506") ? this.reconnectAttempts < this.maxReconnectAttempts : stryMutAct_9fa48("14505") ? this.reconnectAttempts > this.maxReconnectAttempts : stryMutAct_9fa48("14504") ? false : stryMutAct_9fa48("14503") ? true : (stryCov_9fa48("14503", "14504", "14505", "14506"), this.reconnectAttempts >= this.maxReconnectAttempts)) {
      console.log('[CouncilStream] Max reconnect attempts reached');
      return;
    }
    stryMutAct_9fa48("14509") ? this.reconnectAttempts-- : (stryCov_9fa48("14509"), this.reconnectAttempts++);
    const delay = stryMutAct_9fa48("14510") ? this.reconnectDelay / Math.pow(2, this.reconnectAttempts - 1) : (stryCov_9fa48("14510"), this.reconnectDelay * Math.pow(2, stryMutAct_9fa48("14511") ? this.reconnectAttempts + 1 : (stryCov_9fa48("14511"), this.reconnectAttempts - 1)));
    console.log(`[CouncilStream] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => {
      this.connect().catch(() => {
        // Will trigger another reconnect attempt
      });
    }, delay);
  }
  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      this.send(stryMutAct_9fa48("14516") ? {} : (stryCov_9fa48("14516"), {
        type: 'ping'
      }));
    }, 25000);
  }
  private stopHeartbeat(): void {
    if (stryMutAct_9fa48("14520") ? false : stryMutAct_9fa48("14519") ? true : (stryCov_9fa48("14519", "14520"), this.heartbeatInterval)) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  isConnected(): boolean {
    return stryMutAct_9fa48("14525") ? this.ws?.readyState !== WebSocket.OPEN : stryMutAct_9fa48("14524") ? false : stryMutAct_9fa48("14523") ? true : (stryCov_9fa48("14523", "14524", "14525"), (stryMutAct_9fa48("14526") ? this.ws.readyState : (stryCov_9fa48("14526"), this.ws?.readyState)) === WebSocket.OPEN);
  }

  // ===========================================================================
  // MESSAGE HANDLING
  // ===========================================================================

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      switch (message.type) {
        case 'connected':
          if (stryMutAct_9fa48("14529")) {} else {
            stryCov_9fa48("14529");
            console.log('[CouncilStream] Client ID:', message.clientId);
            break;
          }
        case 'subscribed':
          if (stryMutAct_9fa48("14532")) {} else {
            stryCov_9fa48("14532");
            console.log('[CouncilStream] Subscribed to:', message.deliberationId);
            break;
          }
        case 'deliberation_state':
          if (stryMutAct_9fa48("14535")) {} else {
            stryCov_9fa48("14535");
            this.updateDeliberationState(message.deliberation);
            break;
          }
        case 'deliberation_started':
          if (stryMutAct_9fa48("14537")) {} else {
            stryCov_9fa48("14537");
            console.log('[CouncilStream] Deliberation started:', message.deliberationId);
            this.subscribedDeliberations.add(message.deliberationId);
            break;
          }
        case 'stream_event':
          if (stryMutAct_9fa48("14540")) {} else {
            stryCov_9fa48("14540");
            this.handleStreamEvent(message.event);
            break;
          }
        case 'pong':
          if (stryMutAct_9fa48("14542")) {} else {
            stryCov_9fa48("14542");
            // Heartbeat response
            break;
          }
        case 'error':
          if (stryMutAct_9fa48("14544")) {} else {
            stryCov_9fa48("14544");
            console.error('[CouncilStream] Server error:', message.message);
            break;
          }
        default:
          if (stryMutAct_9fa48("14547")) {} else {
            stryCov_9fa48("14547");
            console.log('[CouncilStream] Unknown message:', message.type);
          }
      }
    } catch (error) {
      console.error('[CouncilStream] Failed to parse message:', error);
    }
  }
  private handleStreamEvent(event: StreamEvent): void {
    const state = this.deliberationStates.get(event.deliberationId);
    if (stryMutAct_9fa48("14553") ? false : stryMutAct_9fa48("14552") ? true : (stryCov_9fa48("14552", "14553"), state)) {
      // Update state based on event
      switch (event.type) {
        case 'phase_change':
          if (stryMutAct_9fa48("14555")) {} else {
            stryCov_9fa48("14555");
            state.currentPhase = stryMutAct_9fa48("14559") ? event.phase && state.currentPhase : stryMutAct_9fa48("14558") ? false : stryMutAct_9fa48("14557") ? true : (stryCov_9fa48("14557", "14558", "14559"), event.phase || state.currentPhase);
            state.status = stryMutAct_9fa48("14562") ? event.phase && state.status : stryMutAct_9fa48("14561") ? false : stryMutAct_9fa48("14560") ? true : (stryCov_9fa48("14560", "14561", "14562"), event.phase || state.status);
            break;
          }
        case 'agent_start':
          if (stryMutAct_9fa48("14563")) {} else {
            stryCov_9fa48("14563");
            if (stryMutAct_9fa48("14566") ? false : stryMutAct_9fa48("14565") ? true : (stryCov_9fa48("14565", "14566"), event.agentId)) {
              const agentState = stryMutAct_9fa48("14570") ? state.responses.get(event.agentId) && {
                agentId: event.agentId,
                phase: state.currentPhase,
                isStreaming: true,
                content: '',
                challenges: []
              } : stryMutAct_9fa48("14569") ? false : stryMutAct_9fa48("14568") ? true : (stryCov_9fa48("14568", "14569", "14570"), state.responses.get(event.agentId) || (stryMutAct_9fa48("14571") ? {} : (stryCov_9fa48("14571"), {
                agentId: event.agentId,
                phase: state.currentPhase,
                isStreaming: stryMutAct_9fa48("14572") ? false : (stryCov_9fa48("14572"), true),
                content: '',
                challenges: stryMutAct_9fa48("14574") ? ["Stryker was here"] : (stryCov_9fa48("14574"), [])
              })));
              agentState.isStreaming = stryMutAct_9fa48("14575") ? false : (stryCov_9fa48("14575"), true);
              agentState.phase = state.currentPhase;
              state.responses.set(event.agentId, agentState);
            }
            break;
          }
        case 'token':
          if (stryMutAct_9fa48("14576")) {} else {
            stryCov_9fa48("14576");
            if (stryMutAct_9fa48("14580") ? event.agentId || event.content : stryMutAct_9fa48("14579") ? false : stryMutAct_9fa48("14578") ? true : (stryCov_9fa48("14578", "14579", "14580"), event.agentId && event.content)) {
              const agentState = state.responses.get(event.agentId);
              if (stryMutAct_9fa48("14583") ? false : stryMutAct_9fa48("14582") ? true : (stryCov_9fa48("14582", "14583"), agentState)) {
                stryMutAct_9fa48("14585") ? agentState.content -= event.content : (stryCov_9fa48("14585"), agentState.content += event.content);
              }
            }
            break;
          }
        case 'agent_complete':
          if (stryMutAct_9fa48("14586")) {} else {
            stryCov_9fa48("14586");
            if (stryMutAct_9fa48("14589") ? false : stryMutAct_9fa48("14588") ? true : (stryCov_9fa48("14588", "14589"), event.agentId)) {
              const agentState = state.responses.get(event.agentId);
              if (stryMutAct_9fa48("14592") ? false : stryMutAct_9fa48("14591") ? true : (stryCov_9fa48("14591", "14592"), agentState)) {
                agentState.isStreaming = stryMutAct_9fa48("14594") ? true : (stryCov_9fa48("14594"), false);
                if (stryMutAct_9fa48("14596") ? false : stryMutAct_9fa48("14595") ? true : (stryCov_9fa48("14595", "14596"), event.content)) {
                  agentState.content = event.content;
                }
                if (stryMutAct_9fa48("14600") ? event.metadata.confidence : stryMutAct_9fa48("14599") ? false : stryMutAct_9fa48("14598") ? true : (stryCov_9fa48("14598", "14599", "14600"), event.metadata?.confidence)) {
                  agentState.confidence = event.metadata.confidence;
                }
                if (stryMutAct_9fa48("14604") ? event.metadata.latency : stryMutAct_9fa48("14603") ? false : stryMutAct_9fa48("14602") ? true : (stryCov_9fa48("14602", "14603", "14604"), event.metadata?.latency)) {
                  agentState.latency = event.metadata.latency;
                }
              }
            }
            break;
          }
        case 'challenge':
          if (stryMutAct_9fa48("14606")) {} else {
            stryCov_9fa48("14606");
            if (stryMutAct_9fa48("14610") ? event.agentId || event.metadata?.targetAgentId : stryMutAct_9fa48("14609") ? false : stryMutAct_9fa48("14608") ? true : (stryCov_9fa48("14608", "14609", "14610"), event.agentId && (stryMutAct_9fa48("14611") ? event.metadata.targetAgentId : (stryCov_9fa48("14611"), event.metadata?.targetAgentId)))) {
              const targetState = state.responses.get(event.metadata.targetAgentId);
              if (stryMutAct_9fa48("14614") ? false : stryMutAct_9fa48("14613") ? true : (stryCov_9fa48("14613", "14614"), targetState)) {
                targetState.challenges.push(stryMutAct_9fa48("14616") ? {} : (stryCov_9fa48("14616"), {
                  challengerId: event.agentId,
                  content: '',
                  resolved: stryMutAct_9fa48("14618") ? true : (stryCov_9fa48("14618"), false)
                }));
              }
            }
            break;
          }
        case 'synthesis':
          if (stryMutAct_9fa48("14619")) {} else {
            stryCov_9fa48("14619");
            state.currentPhase = 'synthesis';
            break;
          }
        case 'complete':
          if (stryMutAct_9fa48("14622")) {} else {
            stryCov_9fa48("14622");
            state.status = 'completed';
            if (stryMutAct_9fa48("14626") ? false : stryMutAct_9fa48("14625") ? true : (stryCov_9fa48("14625", "14626"), event.content)) {
              state.synthesis = event.content;
            }
            if (stryMutAct_9fa48("14630") ? event.metadata.confidence : stryMutAct_9fa48("14629") ? false : stryMutAct_9fa48("14628") ? true : (stryCov_9fa48("14628", "14629", "14630"), event.metadata?.confidence)) {
              state.confidence = event.metadata.confidence;
            }
            state.completedAt = new Date();
            break;
          }
        case 'error':
          if (stryMutAct_9fa48("14632")) {} else {
            stryCov_9fa48("14632");
            state.status = 'error';
            break;
          }
      }
      this.notifyStateListeners(state);
    }

    // Notify event listeners
    this.notifyEventListeners(event.deliberationId, event);
  }
  private updateDeliberationState(deliberation: any): void {
    const state: DeliberationState = stryMutAct_9fa48("14636") ? {} : (stryCov_9fa48("14636"), {
      id: deliberation.id,
      question: deliberation.question,
      status: deliberation.status,
      currentPhase: stryMutAct_9fa48("14639") ? deliberation.currentPhase && deliberation.status : stryMutAct_9fa48("14638") ? false : stryMutAct_9fa48("14637") ? true : (stryCov_9fa48("14637", "14638", "14639"), deliberation.currentPhase || deliberation.status),
      participatingAgents: stryMutAct_9fa48("14642") ? deliberation.participatingAgents && [] : stryMutAct_9fa48("14641") ? false : stryMutAct_9fa48("14640") ? true : (stryCov_9fa48("14640", "14641", "14642"), deliberation.participatingAgents || (stryMutAct_9fa48("14643") ? ["Stryker was here"] : (stryCov_9fa48("14643"), []))),
      responses: new Map(),
      synthesis: deliberation.synthesis,
      confidence: deliberation.confidenceScore,
      startedAt: deliberation.startedAt ? new Date(deliberation.startedAt) : undefined,
      completedAt: deliberation.completedAt ? new Date(deliberation.completedAt) : undefined
    });
    this.deliberationStates.set(deliberation.id, state);
    this.notifyStateListeners(state);
  }

  // ===========================================================================
  // DELIBERATION API
  // ===========================================================================

  subscribe(deliberationId: string): void {
    this.subscribedDeliberations.add(deliberationId);
    if (stryMutAct_9fa48("14647") ? false : stryMutAct_9fa48("14646") ? true : stryMutAct_9fa48("14645") ? this.deliberationStates.has(deliberationId) : (stryCov_9fa48("14645", "14646", "14647"), !this.deliberationStates.has(deliberationId))) {
      this.deliberationStates.set(deliberationId, stryMutAct_9fa48("14649") ? {} : (stryCov_9fa48("14649"), {
        id: deliberationId,
        question: '',
        status: 'pending',
        currentPhase: 'pending',
        participatingAgents: stryMutAct_9fa48("14653") ? ["Stryker was here"] : (stryCov_9fa48("14653"), []),
        responses: new Map()
      }));
    }
    if (stryMutAct_9fa48("14655") ? false : stryMutAct_9fa48("14654") ? true : (stryCov_9fa48("14654", "14655"), this.isConnected())) {
      this.send(stryMutAct_9fa48("14657") ? {} : (stryCov_9fa48("14657"), {
        type: 'subscribe',
        deliberationId
      }));
    }
  }
  unsubscribe(deliberationId: string): void {
    this.subscribedDeliberations.delete(deliberationId);
    this.deliberationStates.delete(deliberationId);
    if (stryMutAct_9fa48("14661") ? false : stryMutAct_9fa48("14660") ? true : (stryCov_9fa48("14660", "14661"), this.isConnected())) {
      this.send(stryMutAct_9fa48("14663") ? {} : (stryCov_9fa48("14663"), {
        type: 'unsubscribe',
        deliberationId
      }));
    }
  }
  startDeliberation(question: string, options: {
    agentIds?: string[];
    context?: string;
    config?: {
      maxDurationSeconds?: number;
      requireConsensus?: boolean;
      enableCrossExamination?: boolean;
      minConfidenceThreshold?: number;
      maxRounds?: number;
    };
  } = {}): void {
    this.send(stryMutAct_9fa48("14666") ? {} : (stryCov_9fa48("14666"), {
      type: 'start_deliberation',
      payload: stryMutAct_9fa48("14668") ? {} : (stryCov_9fa48("14668"), {
        question,
        ...options
      })
    }));
  }
  getDeliberationState(deliberationId: string): DeliberationState | undefined {
    return this.deliberationStates.get(deliberationId);
  }

  // ===========================================================================
  // EVENT LISTENERS
  // ===========================================================================

  onEvent(deliberationId: string, callback: EventCallback): () => void {
    if (stryMutAct_9fa48("14673") ? false : stryMutAct_9fa48("14672") ? true : stryMutAct_9fa48("14671") ? this.eventListeners.has(deliberationId) : (stryCov_9fa48("14671", "14672", "14673"), !this.eventListeners.has(deliberationId))) {
      this.eventListeners.set(deliberationId, new Set());
    }
    this.eventListeners.get(deliberationId)!.add(callback);
    return () => {
      stryMutAct_9fa48("14676") ? this.eventListeners.get(deliberationId).delete(callback) : (stryCov_9fa48("14676"), this.eventListeners.get(deliberationId)?.delete(callback));
    };
  }
  onStateChange(callback: StateCallback): () => void {
    this.stateListeners.add(callback);
    return () => {
      this.stateListeners.delete(callback);
    };
  }
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionListeners.add(callback);
    return () => {
      this.connectionListeners.delete(callback);
    };
  }
  private notifyEventListeners(deliberationId: string, event: StreamEvent): void {
    const listeners = this.eventListeners.get(deliberationId);
    if (stryMutAct_9fa48("14683") ? false : stryMutAct_9fa48("14682") ? true : (stryCov_9fa48("14682", "14683"), listeners)) {
      listeners.forEach(stryMutAct_9fa48("14685") ? () => undefined : (stryCov_9fa48("14685"), callback => callback(event)));
    }
  }
  private notifyStateListeners(state: DeliberationState): void {
    this.stateListeners.forEach(stryMutAct_9fa48("14687") ? () => undefined : (stryCov_9fa48("14687"), callback => callback(state)));
  }
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(stryMutAct_9fa48("14689") ? () => undefined : (stryCov_9fa48("14689"), callback => callback(connected)));
  }

  // ===========================================================================
  // UTILITIES
  // ===========================================================================

  private send(message: any): void {
    if (stryMutAct_9fa48("14693") ? this.ws?.readyState !== WebSocket.OPEN : stryMutAct_9fa48("14692") ? false : stryMutAct_9fa48("14691") ? true : (stryCov_9fa48("14691", "14692", "14693"), (stryMutAct_9fa48("14694") ? this.ws.readyState : (stryCov_9fa48("14694"), this.ws?.readyState)) === WebSocket.OPEN)) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[CouncilStream] Cannot send - not connected');
    }
  }
}

// Singleton instance
let clientInstance: CouncilStreamClient | null = null;
export function getCouncilStreamClient(): CouncilStreamClient {
  if (stryMutAct_9fa48("14701") ? false : stryMutAct_9fa48("14700") ? true : stryMutAct_9fa48("14699") ? clientInstance : (stryCov_9fa48("14699", "14700", "14701"), !clientInstance)) {
    clientInstance = new CouncilStreamClient();
  }
  return clientInstance;
}
export default CouncilStreamClient;