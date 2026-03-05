/**
 * Hook — useApi
 *
 * Generic data fetching hook with loading, error, and refresh support.
 * Wraps fetch calls with consistent error handling and state management.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

interface UseApiOptions {
  immediate?: boolean;
  headers?: Record<string, string>;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = { immediate: true }
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.immediate !== false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error?.message || body.message || `HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json.data ?? json);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, options.headers]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
    return () => abortRef.current?.abort();
  }, [fetchData, options.immediate]);

  return { data, loading, error, refresh: fetchData };
}

export default useApi;
