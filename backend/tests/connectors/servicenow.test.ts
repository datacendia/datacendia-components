import { describe, it, expect } from 'vitest';
import { ServicenowConnector } from '../../src/connectors/enterprise/ServicenowConnector.js';

describe('ServicenowConnector', () => {
  it('should return correct metadata', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('servicenow');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    expect(connector.getId()).toBe('test-servicenow');
  });

  it('should be enabled by default', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new ServicenowConnector({ id: 'test-servicenow' });
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});
