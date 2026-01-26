/**
 * =============================================================================
 * SALESFORCE CONNECTOR TESTS
 * =============================================================================
 * Tests OAuth2 flow and API operations
 */

import { describe, it, expect } from 'vitest';
import { SalesforceConnector } from '../../src/connectors/enterprise/SalesforceConnector.js';

describe('SalesforceConnector', () => {
  let connector: SalesforceConnector;

  beforeEach(() => {
    connector = new SalesforceConnector({
      id: 'test-salesforce',
      credentials: {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        redirectUri: 'http://localhost:3001/callback',
      },
    });
  });

  describe('Metadata', () => {
    it('should return correct metadata', () => {
      const metadata = connector.getMetadata();
      expect(metadata.id).toBe('salesforce');
      expect(metadata.name).toBe('Salesforce');
      expect(metadata.provider).toBe('Salesforce, Inc.');
      expect(metadata.compatibilityLabel).toBe('native_protocol');
    });

    it('should list required credentials', () => {
      const metadata = connector.getMetadata();
      expect(metadata.requiredCredentials).toContain('clientId');
      expect(metadata.requiredCredentials).toContain('clientSecret');
      expect(metadata.requiredCredentials).toContain('redirectUri');
    });

    it('should list supported data types', () => {
      const metadata = connector.getMetadata();
      expect(metadata.dataTypes).toContain('accounts');
      expect(metadata.dataTypes).toContain('contacts');
      expect(metadata.dataTypes).toContain('opportunities');
    });
  });

  describe('OAuth2 Flow', () => {
    it('should generate authorization URL', () => {
      const { url, state } = connector.getAuthorizationUrl();
      expect(url).toContain('login.salesforce.com');
      expect(url).toContain('oauth2/authorize');
      expect(url).toContain('client_id=test-client-id');
      expect(state).toBeDefined();
      expect(state.length).toBeGreaterThan(10);
    });

    it('should include PKCE parameters', () => {
      const { url } = connector.getAuthorizationUrl();
      expect(url).toContain('code_challenge');
      expect(url).toContain('code_challenge_method=S256');
    });
  });

  describe('Status', () => {
    it('should start disconnected', () => {
      expect(connector.getStatus()).toBe('disconnected');
    });

    it('should return connector ID', () => {
      expect(connector.getId()).toBe('test-salesforce');
    });

    it('should return connector name', () => {
      expect(connector.getName()).toBe('Salesforce');
    });

    it('should be enabled by default', () => {
      expect(connector.isEnabled()).toBe(true);
    });
  });
});
