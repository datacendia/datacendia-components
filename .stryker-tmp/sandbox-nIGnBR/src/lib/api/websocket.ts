/**
 * WebSocket Client for Real-time Updates
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
import { io, Socket } from 'socket.io-client';
import { tokenManager } from './client';

// WebSocket needs full URL even in dev (no proxy for WS)
const WS_URL = stryMutAct_9fa48("14372") ? import.meta.env.VITE_WS_URL && (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3001` : 'http://localhost:3001') : stryMutAct_9fa48("14371") ? false : stryMutAct_9fa48("14370") ? true : (stryCov_9fa48("14370", "14371", "14372"), import.meta.env.VITE_WS_URL || ((stryMutAct_9fa48("14375") ? typeof window === 'undefined' : stryMutAct_9fa48("14374") ? false : stryMutAct_9fa48("14373") ? true : (stryCov_9fa48("14373", "14374", "14375"), typeof window !== 'undefined')) ? `${window.location.protocol}//${window.location.hostname}:3001` : 'http://localhost:3001'));
type MessageHandler = (data: unknown) => void;
class WebSocketClient {
  private socket: Socket | null = null;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  connect(): void {
    if (stryMutAct_9fa48("14382") ? this.socket.connected : stryMutAct_9fa48("14381") ? false : stryMutAct_9fa48("14380") ? true : (stryCov_9fa48("14380", "14381", "14382"), this.socket?.connected)) {
      return;
    }
    const token = tokenManager.getAccessToken();
    if (stryMutAct_9fa48("14386") ? false : stryMutAct_9fa48("14385") ? true : stryMutAct_9fa48("14384") ? token : (stryCov_9fa48("14384", "14385", "14386"), !token)) {
      console.warn('WebSocket: No auth token available');
      return;
    }
    this.socket = io(WS_URL, stryMutAct_9fa48("14389") ? {} : (stryCov_9fa48("14389"), {
      auth: stryMutAct_9fa48("14390") ? {} : (stryCov_9fa48("14390"), {
        token
      }),
      transports: stryMutAct_9fa48("14391") ? [] : (stryCov_9fa48("14391"), ['websocket', 'polling']),
      reconnection: stryMutAct_9fa48("14394") ? false : (stryCov_9fa48("14394"), true),
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000
    }));
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    });
    this.socket.on('disconnect', reason => {
      console.log('WebSocket disconnected:', reason);
    });
    this.socket.on('error', error => {
      console.error('WebSocket error:', error);
    });

    // Forward all events to handlers
    this.socket.onAny((event: string, data: unknown) => {
      const eventHandlers = this.handlers.get(event);
      if (stryMutAct_9fa48("14406") ? false : stryMutAct_9fa48("14405") ? true : (stryCov_9fa48("14405", "14406"), eventHandlers)) {
        eventHandlers.forEach(stryMutAct_9fa48("14408") ? () => undefined : (stryCov_9fa48("14408"), handler => handler(data)));
      }
    });
  }
  disconnect(): void {
    if (stryMutAct_9fa48("14411") ? false : stryMutAct_9fa48("14410") ? true : (stryCov_9fa48("14410", "14411"), this.socket)) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  on(event: string, handler: MessageHandler): () => void {
    if (stryMutAct_9fa48("14416") ? false : stryMutAct_9fa48("14415") ? true : stryMutAct_9fa48("14414") ? this.handlers.has(event) : (stryCov_9fa48("14414", "14415", "14416"), !this.handlers.has(event))) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      stryMutAct_9fa48("14419") ? this.handlers.get(event).delete(handler) : (stryCov_9fa48("14419"), this.handlers.get(event)?.delete(handler));
    };
  }
  off(event: string, handler?: MessageHandler): void {
    if (stryMutAct_9fa48("14422") ? false : stryMutAct_9fa48("14421") ? true : (stryCov_9fa48("14421", "14422"), handler)) {
      stryMutAct_9fa48("14424") ? this.handlers.get(event).delete(handler) : (stryCov_9fa48("14424"), this.handlers.get(event)?.delete(handler));
    } else {
      this.handlers.delete(event);
    }
  }
  emit(event: string, data?: unknown): void {
    if (stryMutAct_9fa48("14429") ? this.socket.connected : stryMutAct_9fa48("14428") ? false : stryMutAct_9fa48("14427") ? true : (stryCov_9fa48("14427", "14428", "14429"), this.socket?.connected)) {
      this.socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit:', event);
    }
  }

  // Deliberation-specific methods
  subscribeToDeliberation(deliberationId: string): void {
    this.emit('subscribe:deliberation', stryMutAct_9fa48("14435") ? {} : (stryCov_9fa48("14435"), {
      deliberationId
    }));
  }
  unsubscribeFromDeliberation(deliberationId: string): void {
    this.emit('unsubscribe:deliberation', stryMutAct_9fa48("14438") ? {} : (stryCov_9fa48("14438"), {
      deliberationId
    }));
  }

  // Workflow execution updates
  subscribeToWorkflow(executionId: string): void {
    this.emit('subscribe:workflow', stryMutAct_9fa48("14441") ? {} : (stryCov_9fa48("14441"), {
      executionId
    }));
  }
  unsubscribeFromWorkflow(executionId: string): void {
    this.emit('unsubscribe:workflow', stryMutAct_9fa48("14444") ? {} : (stryCov_9fa48("14444"), {
      executionId
    }));
  }

  // Organization-wide alerts
  subscribeToAlerts(): void {
    this.emit('subscribe:alerts');
  }

  // Health score updates
  subscribeToHealth(): void {
    this.emit('subscribe:health');
  }
  isConnected(): boolean {
    return stryMutAct_9fa48("14450") ? this.socket?.connected && false : (stryCov_9fa48("14450"), (stryMutAct_9fa48("14451") ? this.socket.connected : (stryCov_9fa48("14451"), this.socket?.connected)) ?? (stryMutAct_9fa48("14452") ? true : (stryCov_9fa48("14452"), false)));
  }
}
export const wsClient = new WebSocketClient();

// React hook for WebSocket events
export function useWebSocket(event: string, handler: MessageHandler): void {
  // Note: In a real implementation, this would be a proper React hook
  // with useEffect for cleanup. This is a simplified version.
  wsClient.on(event, handler);
}
export default wsClient;