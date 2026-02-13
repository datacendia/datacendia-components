import { describe, it, expect } from 'vitest';
import { OracleConnector } from '../../src/connectors/enterprise/OracleConnector.js';

describe('OracleConnector', () => {
  const testConfig = {
    id: 'test-oracle',
    name: 'Oracle Test',
    description: 'Test connector',
    vertical: 'enterprise',
    category: 'enterprise',
    baseUrl: 'https://oracle.com',
    authType: 'oauth2' as const,
  };

  it('should return correct metadata', () => {
    const connector = new OracleConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('oracle-fusion');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new OracleConnector(testConfig);
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new OracleConnector(testConfig);
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new OracleConnector(testConfig);
    expect(connector.getId()).toBe('test-oracle');
  });

  it('should be enabled by default', () => {
    const connector = new OracleConnector(testConfig);
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new OracleConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new OracleConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new OracleConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new OracleConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new OracleConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});

