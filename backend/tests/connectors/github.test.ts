import { describe, it, expect } from 'vitest';
import { GitHubConnector } from '../../src/connectors/enterprise/GitHubConnector.js';

describe('GitHubConnector', () => {
  const testConfig = {
    id: 'test-github',
    name: 'GitHub Test',
    description: 'Test connector',
    vertical: 'enterprise',
    category: 'development',
    baseUrl: 'https://github.com',
    authType: 'oauth2' as const,
  };

  it('should return correct metadata', () => {
    const connector = new GitHubConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('github');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new GitHubConnector(testConfig);
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new GitHubConnector(testConfig);
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new GitHubConnector(testConfig);
    expect(connector.getId()).toBe('test-github');
  });

  it('should be enabled by default', () => {
    const connector = new GitHubConnector(testConfig);
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new GitHubConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new GitHubConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new GitHubConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new GitHubConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new GitHubConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});
