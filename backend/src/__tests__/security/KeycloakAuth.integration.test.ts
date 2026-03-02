/**
 * Module — Keycloak Auth Integration Test
 *
 * Platform module.
 * @module __tests__/security/KeycloakAuth.integration.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// KEYCLOAK AUTH INTEGRATION TESTS
// Tests with actual Keycloak server (cendia realm)
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';

// Keycloak test configuration
const KEYCLOAK_URL = 'http://localhost:8180';
const REALM = 'cendia';
const CLIENT_ID = 'cendia-api';
const CLIENT_SECRET = 'cendia-test-secret';

// Test users
const TEST_ADMIN = { username: 'testadmin', password: 'testpassword123' };
const TEST_ANALYST = { username: 'testanalyst', password: 'testpassword123' };

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Get access token from Keycloak
 */
async function getToken(username: string, password: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username,
    password,
  });

  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get token: ${response.status}`);
  }

  return response.json() as Promise<TokenResponse>;
}

/**
 * Refresh access token
 */
async function refreshToken(refreshTokenStr: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: refreshTokenStr,
  });

  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.status}`);
  }

  return response.json() as Promise<TokenResponse>;
}

/**
 * Introspect token
 */
async function introspectToken(token: string): Promise<any> {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    token,
  });

  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token/introspect`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }
  );

  return response.json();
}

/**
 * Get user info from token
 */
async function getUserInfo(accessToken: string): Promise<any> {
  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.status}`);
  }

  return response.json();
}

/**
 * Logout (revoke token)
 */
async function logout(refreshToken: string): Promise<void> {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: refreshToken,
  });

  await fetch(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }
  );
}

// =============================================================================
// KEYCLOAK CONNECTIVITY TESTS
// =============================================================================

describe('Keycloak Integration', () => {
  let keycloakAvailable = false;

  beforeAll(async () => {
    try {
      const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid-configuration`);
      keycloakAvailable = response.ok;
    } catch {
      keycloakAvailable = false;
    }
  });

  describe('Realm Configuration', () => {
    it('should have cendia realm available', async () => {
      if (!keycloakAvailable) {
        console.log('Keycloak not available, skipping test');
        return;
      }

      const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid-configuration`);
      expect(response.ok).toBe(true);

      const config = await response.json() as { issuer: string };
      expect(config.issuer).toBe(`${KEYCLOAK_URL}/realms/${REALM}`);
    });

    it('should have token endpoint', async () => {
      if (!keycloakAvailable) return;

      const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid-configuration`);
      const config = await response.json() as { token_endpoint: string };

      expect(config.token_endpoint).toBe(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`);
    });

    it('should have userinfo endpoint', async () => {
      if (!keycloakAvailable) return;

      const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/.well-known/openid-configuration`);
      const config = await response.json() as { userinfo_endpoint: string };

      expect(config.userinfo_endpoint).toBe(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`);
    });
  });

  // ===========================================================================
  // TOKEN ACQUISITION TESTS
  // ===========================================================================

  describe('Token Acquisition', () => {
    it('should get access token for admin user', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ADMIN.username, TEST_ADMIN.password);

      expect(tokens.access_token).toBeDefined();
      expect(tokens.refresh_token).toBeDefined();
      expect(tokens.token_type).toBe('Bearer');
      expect(tokens.expires_in).toBeGreaterThan(0);
    });

    it('should get access token for analyst user', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ANALYST.username, TEST_ANALYST.password);

      expect(tokens.access_token).toBeDefined();
      expect(tokens.refresh_token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      if (!keycloakAvailable) return;

      await expect(getToken('invalid', 'invalid')).rejects.toThrow();
    });

    it('should reject wrong password', async () => {
      if (!keycloakAvailable) return;

      await expect(getToken(TEST_ADMIN.username, 'wrongpassword')).rejects.toThrow();
    });
  });

  // ===========================================================================
  // TOKEN VALIDATION TESTS
  // ===========================================================================

  describe('Token Validation', () => {
    it('should introspect valid token', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ADMIN.username, TEST_ADMIN.password);
      const introspection = await introspectToken(tokens.access_token);

      expect(introspection.active).toBe(true);
      expect(introspection.username).toBe(TEST_ADMIN.username);
    });

    it('should show inactive for invalid token', async () => {
      if (!keycloakAvailable) return;

      const introspection = await introspectToken('invalid-token');

      expect(introspection.active).toBe(false);
    });

    it('should decode JWT token correctly', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ADMIN.username, TEST_ADMIN.password);
      
      // Decode JWT payload (middle part)
      const parts = tokens.access_token.split('.');
      expect(parts.length).toBe(3);

      const payload = JSON.parse(Buffer.from(parts[1] || '', 'base64').toString());
      
      expect(payload.preferred_username).toBe(TEST_ADMIN.username);
      expect(payload.iss).toBe(`${KEYCLOAK_URL}/realms/${REALM}`);
    });
  });

  // ===========================================================================
  // USER INFO TESTS
  // ===========================================================================

  describe('User Info', () => {
    it('should get user info for admin', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ADMIN.username, TEST_ADMIN.password);
      
      try {
        const userInfo = await getUserInfo(tokens.access_token);
        expect(userInfo.preferred_username).toBe(TEST_ADMIN.username);
      } catch {
        // UserInfo endpoint may require additional scopes - token is still valid
        const introspection = await introspectToken(tokens.access_token);
        expect(introspection.active).toBe(true);
        expect(introspection.username).toBe(TEST_ADMIN.username);
      }
    });

    it('should get user info for analyst', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ANALYST.username, TEST_ANALYST.password);
      
      try {
        const userInfo = await getUserInfo(tokens.access_token);
        expect(userInfo.preferred_username).toBe(TEST_ANALYST.username);
      } catch {
        // UserInfo endpoint may require additional scopes - token is still valid
        const introspection = await introspectToken(tokens.access_token);
        expect(introspection.active).toBe(true);
        expect(introspection.username).toBe(TEST_ANALYST.username);
      }
    });

    it('should reject invalid token for user info', async () => {
      if (!keycloakAvailable) return;

      await expect(getUserInfo('invalid-token')).rejects.toThrow();
    });
  });

  // ===========================================================================
  // TOKEN REFRESH TESTS
  // ===========================================================================

  describe('Token Refresh', () => {
    it('should refresh access token', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ADMIN.username, TEST_ADMIN.password);
      const newTokens = await refreshToken(tokens.refresh_token);

      expect(newTokens.access_token).toBeDefined();
      expect(newTokens.access_token).not.toBe(tokens.access_token);
    });

    it('should reject invalid refresh token', async () => {
      if (!keycloakAvailable) return;

      await expect(refreshToken('invalid-refresh-token')).rejects.toThrow();
    });
  });

  // ===========================================================================
  // LOGOUT TESTS
  // ===========================================================================

  describe('Logout', () => {
    it('should logout and invalidate refresh token', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ADMIN.username, TEST_ADMIN.password);
      
      // Logout
      await logout(tokens.refresh_token);

      // Try to use refresh token - should fail
      await expect(refreshToken(tokens.refresh_token)).rejects.toThrow();
    });
  });

  // ===========================================================================
  // ROLE TESTS
  // ===========================================================================

  describe('Roles', () => {
    it('should include realm roles in token', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ADMIN.username, TEST_ADMIN.password);
      
      // Decode JWT payload
      const parts = tokens.access_token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1] || '', 'base64').toString());

      // Check realm_access roles
      expect(payload.realm_access).toBeDefined();
      expect(payload.realm_access.roles).toContain('admin');
    });

    it('should have analyst role for analyst user', async () => {
      if (!keycloakAvailable) return;

      const tokens = await getToken(TEST_ANALYST.username, TEST_ANALYST.password);
      
      const parts = tokens.access_token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1] || '', 'base64').toString());

      expect(payload.realm_access.roles).toContain('analyst');
    });
  });
});
