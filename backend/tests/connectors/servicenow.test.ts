import { describe, it, expect } from 'vitest';
import { ServiceNowConnector } from '../../src/connectors/enterprise/ServiceNowConnector.js';

describe('ServiceNowConnector', () => {
  const testConfig = {
    id: 'test-servicenow',
    name: 'ServiceNow Test',
    description: 'Test connector',
    vertical: 'enterprise',
    category: 'enterprise',
    baseUrl: 'https://servicenow.com',
    authType: 'oauth2' as const,
  };

  it('should return correct metadata', () => {
    const connector = new ServiceNowConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('servicenow');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new ServiceNowConnector(testConfig);
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new ServiceNowConnector(testConfig);
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new ServiceNowConnector(testConfig);
    expect(connector.getId()).toBe('test-servicenow');
  });

  it('should be enabled by default', () => {
    const connector = new ServiceNowConnector(testConfig);
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new ServiceNowConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new ServiceNowConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new ServiceNowConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new ServiceNowConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new ServiceNowConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});

