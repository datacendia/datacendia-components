import { describe, it, expect } from 'vitest';
import { JiraConnector } from '../../src/connectors/enterprise/JiraConnector.js';

describe('JiraConnector', () => {
  const testConfig = {
    id: 'test-jira',
    name: 'Jira Test',
    description: 'Test connector',
    vertical: 'enterprise',
    category: 'enterprise',
    baseUrl: 'https://jira.com',
    authType: 'oauth2' as const,
  };

  it('should return correct metadata', () => {
    const connector = new JiraConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('jira');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new JiraConnector(testConfig);
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new JiraConnector(testConfig);
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new JiraConnector(testConfig);
    expect(connector.getId()).toBe('test-jira');
  });

  it('should be enabled by default', () => {
    const connector = new JiraConnector(testConfig);
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new JiraConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new JiraConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new JiraConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new JiraConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new JiraConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});

