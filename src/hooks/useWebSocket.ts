/**
 * =============================================================================
 * WEBSOCKET HOOK - Real-Time Connection Management
 * =============================================================================
 * Enterprise-grade WebSocket hook with automatic reconnection
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface WebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

export interface WebSocketState {
  socket: Socket | null;
  connected: boolean;
  connecting: boolean;
  error: Error | null;
}

export function useWebSocket(options: WebSocketOptions = {}) {
  const {
    url = 'http://localhost:3001',
    autoConnect = true,
    reconnection = true,
    reconnectionDelay = 1000,
    reconnectionAttempts = 5,
  } = options;

  const [state, setState] = useState<WebSocketState>({
    socket: null,
    connected: false,
    connecting: false,
    error: null,
  });

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!autoConnect) return;

    setState(prev => ({ ...prev, connecting: true }));

    const newSocket = io(url, {
      reconnection,
      reconnectionDelay,
      reconnectionAttempts,
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      setState({
        socket: newSocket,
        connected: true,
        connecting: false,
        error: null,
      });
      console.log('[WebSocket] Connected to server');
    });

    newSocket.on('disconnect', (reason: string) => {
      setState(prev => ({
        ...prev,
        connected: false,
        connecting: false,
      }));
      console.log(`[WebSocket] Disconnected: ${reason}`);
    });

    newSocket.on('connect_error', (error: Error) => {
      setState(prev => ({
        ...prev,
        connected: false,
        connecting: false,
        error,
      }));
      console.error('[WebSocket] Connection error:', error.message);
    });

    newSocket.on('reconnect', (attemptNumber: number) => {
      console.log(`[WebSocket] Reconnected after ${attemptNumber} attempts`);
    });

    newSocket.on('reconnect_attempt', (attemptNumber: number) => {
      setState(prev => ({ ...prev, connecting: true }));
      console.log(`[WebSocket] Reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect_failed', () => {
      setState(prev => ({
        ...prev,
        connecting: false,
        error: new Error('Reconnection failed after maximum attempts'),
      }));
      console.error('[WebSocket] Reconnection failed');
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [url, autoConnect, reconnection, reconnectionDelay, reconnectionAttempts]);

  const connect = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      socketRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn(`[WebSocket] Cannot emit '${event}' - not connected`);
    }
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const off = useCallback((event: string, handler?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

export default useWebSocket;
