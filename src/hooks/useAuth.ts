/**
 * Hook — useAuth
 *
 * Authentication state hook. Reads token from localStorage,
 * provides login/logout functions, and exposes user info.
 */

import { useState, useCallback, useMemo } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  organizationName?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
}

function parseToken(token: string | null): AuthUser | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
      organizationName: payload.organizationName,
    };
  } catch {
    return null;
  }
}

export function useAuth(): UseAuthReturn {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('accessToken')
  );

  const user = useMemo(() => parseToken(token), [token]);
  const isAuthenticated = !!token && !!user;

  const login = useCallback((accessToken: string, refreshToken: string, _user: AuthUser) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(_user));
    setToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
  }, []);

  return { user, token, isAuthenticated, login, logout };
}

export default useAuth;
