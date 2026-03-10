/**
 * API Client Comprehensive Tests
 * @module lib/api/__tests__/client.comprehensive.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { api, tokenManager, setCurrentDataSourceId, onAuthChange } from '../client';

describe('TokenManager', () => {
  beforeEach(() => {
    localStorage.clear();
    tokenManager.clearTokens();
    vi.clearAllMocks();
  });

  it('should start unauthenticated', () => {
    expect(tokenManager.isAuthenticated()).toBe(false);
    expect(tokenManager.getAccessToken()).toBeNull();
    expect(tokenManager.getRefreshToken()).toBeNull();
  });

  it('should set and retrieve tokens', () => {
    tokenManager.setTokens({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
      expiresIn: 3600,
    });
    expect(tokenManager.isAuthenticated()).toBe(true);
    expect(tokenManager.getAccessToken()).toBe('access-123');
    expect(tokenManager.getRefreshToken()).toBe('refresh-456');
  });

  it('should persist tokens to localStorage', () => {
    tokenManager.setTokens({
      accessToken: 'acc',
      refreshToken: 'ref',
      expiresIn: 3600,
    });
    expect(localStorage.getItem('dc_access_token')).toBe('acc');
    expect(localStorage.getItem('dc_refresh_token')).toBe('ref');
  });

  it('should clear tokens', () => {
    tokenManager.setTokens({
      accessToken: 'acc',
      refreshToken: 'ref',
      expiresIn: 3600,
    });
    tokenManager.clearTokens();
    expect(tokenManager.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('dc_access_token')).toBeNull();
    expect(localStorage.getItem('dc_refresh_token')).toBeNull();
  });

  it('should refresh access token', async () => {
    tokenManager.setTokens({
      accessToken: 'old',
      refreshToken: 'ref-token',
      expiresIn: 3600,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { accessToken: 'new-access', refreshToken: 'new-refresh', expiresIn: 3600 },
      }),
    });

    const result = await tokenManager.refreshAccessToken();
    expect(result).toBe(true);
    expect(tokenManager.getAccessToken()).toBe('new-access');
  });

  it('should clear tokens on failed refresh', async () => {
    tokenManager.setTokens({
      accessToken: 'old',
      refreshToken: 'ref-token',
      expiresIn: 3600,
    });

    mockFetch.mockResolvedValueOnce({ ok: false });

    const result = await tokenManager.refreshAccessToken();
    expect(result).toBe(false);
    expect(tokenManager.isAuthenticated()).toBe(false);
  });

  it('should return false when no refresh token', async () => {
    const result = await tokenManager.refreshAccessToken();
    expect(result).toBe(false);
  });

  it('should handle network error during refresh', async () => {
    tokenManager.setTokens({
      accessToken: 'old',
      refreshToken: 'ref-token',
      expiresIn: 3600,
    });

    mockFetch.mockRejectedValueOnce(new Error('Network fail'));

    const result = await tokenManager.refreshAccessToken();
    expect(result).toBe(false);
    expect(tokenManager.isAuthenticated()).toBe(false);
  });
});

describe('ApiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    tokenManager.clearTokens();
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should make GET request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ success: true, data: { id: 1 } })),
      });

      const result = await api.get('/test');
      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should append query params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      });

      await api.get('/search', { q: 'test', page: 1 });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test'),
        expect.any(Object)
      );
    });

    it('should include auth header when authenticated', async () => {
      tokenManager.setTokens({ accessToken: 'my-token', refreshToken: 'r', expiresIn: 3600 });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      });

      await api.get('/protected');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-token',
          }),
        })
      );
    });
  });

  describe('POST', () => {
    it('should make POST request with body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: () => Promise.resolve(JSON.stringify({ success: true, data: { id: 'new' } })),
      });

      const result = await api.post('/items', { name: 'test' });
      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/items'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        })
      );
    });
  });

  describe('PUT', () => {
    it('should make PUT request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      });

      await api.put('/items/1', { name: 'updated' });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/1'),
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('PATCH', () => {
    it('should make PATCH request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      });

      await api.patch('/items/1', { status: 'active' });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/1'),
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  describe('DELETE', () => {
    it('should make DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      });

      await api.delete('/items/1');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('error handling', () => {
    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve(''),
      });

      const result = await api.get('/fail');
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EMPTY_RESPONSE');
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('not json'),
      });

      const result = await api.get('/bad-json');
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PARSE_ERROR');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failed'));

      const result = await api.get('/offline');
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(result.error?.message).toBe('Network failed');
    });

    it('should handle HTTP error without error body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve(JSON.stringify({ success: false })),
      });

      const result = await api.get('/server-error');
      expect(result.success).toBe(false);
    });
  });
});

describe('setCurrentDataSourceId', () => {
  beforeEach(() => { localStorage.clear(); });

  it('should set data source ID', () => {
    setCurrentDataSourceId('ds-123');
    expect(localStorage.getItem('dc_selected_data_source_id')).toBe('ds-123');
  });

  it('should clear data source ID with null', () => {
    setCurrentDataSourceId('ds-123');
    setCurrentDataSourceId(null);
    expect(localStorage.getItem('dc_selected_data_source_id')).toBeNull();
  });
});

describe('onAuthChange', () => {
  it('should register listener and return unsubscribe function', () => {
    const listener = vi.fn();
    const unsubscribe = onAuthChange(listener);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });
});
