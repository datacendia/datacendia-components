import { describe, it, expect } from 'vitest';
import { SAPConnector as SapConnector } from '../../src/connectors/enterprise/SapConnector.js';

describe('SapConnector', () => {
  const testConfig = {
    id: 'test-sap',
    name: 'Sap Test',
    description: 'Test connector',
    vertical: 'enterprise',
    category: 'enterprise',
    baseUrl: 'https://sap.com',
    authType: 'oauth2' as const,
  };

  it('should return correct metadata', () => {
    const connector = new SapConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('sap');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new SapConnector(testConfig);
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new SapConnector(testConfig);
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new SapConnector(testConfig);
    expect(connector.getId()).toBe('test-sap');
  });

  it('should be enabled by default', () => {
    const connector = new SapConnector(testConfig);
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new SapConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new SapConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new SapConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new SapConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new SapConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});

