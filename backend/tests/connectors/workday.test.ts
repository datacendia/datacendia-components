import { describe, it, expect } from 'vitest';
import { WorkdayConnector } from '../../src/connectors/enterprise/WorkdayConnector.js';

describe('WorkdayConnector', () => {
  const testConfig = {
    id: 'test-workday',
    name: 'Workday Test',
    description: 'Test connector',
    vertical: 'enterprise',
    category: 'enterprise',
    baseUrl: 'https://workday.com',
    authType: 'oauth2' as const,
  };

  it('should return correct metadata', () => {
    const connector = new WorkdayConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('workday');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new WorkdayConnector(testConfig);
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new WorkdayConnector(testConfig);
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new WorkdayConnector(testConfig);
    expect(connector.getId()).toBe('test-workday');
  });

  it('should be enabled by default', () => {
    const connector = new WorkdayConnector(testConfig);
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new WorkdayConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new WorkdayConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new WorkdayConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new WorkdayConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new WorkdayConnector(testConfig);
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});

