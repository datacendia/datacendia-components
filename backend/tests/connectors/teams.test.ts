import { describe, it, expect } from 'vitest';
import { MicrosoftTeamsConnector as TeamsConnector } from '../../src/connectors/enterprise/MicrosoftTeamsConnector.js';

describe('TeamsConnector', () => {
  const testConfig = {
    id: 'test-teams',
    name: 'Teams Test',
    description: 'Test connector',
    vertical: 'enterprise',
    category: 'enterprise',
    baseUrl: 'https://teams.com',
    authType: 'oauth2' as const,
  };

  it.skip('should return correct metadata', () => {
    const connector = new TeamsConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('teams');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it.skip('should generate OAuth2 authorization URL', () => {
    const connector = new TeamsConnector(testConfig);
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it.skip('should start disconnected', () => {
    const connector = new TeamsConnector(testConfig);
    expect(connector.getStatus()).toBe('disconnected');
  });

  it.skip('should return connector ID', () => {
    const connector = new TeamsConnector(testConfig);
    expect(connector.getId()).toBe('test-teams');
  });

  it.skip('should be enabled by default', () => {
    const connector = new TeamsConnector(testConfig);
    expect(connector.isEnabled()).toBe(true);
  });

  it.skip('should list required credentials', () => {
    const connector = new TeamsConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it.skip('should list supported data types', () => {
    const connector = new TeamsConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it.skip('should have provider information', () => {
    const connector = new TeamsConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it.skip('should have documentation URL', () => {
    const connector = new TeamsConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it.skip('should have compliance frameworks', () => {
    const connector = new TeamsConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});
