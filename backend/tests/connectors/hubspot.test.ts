import { describe, it, expect } from 'vitest';
import { HubspotConnector } from '../../src/connectors/enterprise/HubspotConnector.js';

describe('HubspotConnector', () => {
  it('should return correct metadata', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('hubspot');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    expect(connector.getId()).toBe('test-hubspot');
  });

  it('should be enabled by default', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new HubspotConnector({ id: 'test-hubspot' });
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});
