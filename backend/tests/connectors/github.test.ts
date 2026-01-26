import { describe, it, expect } from 'vitest';
import { GithubConnector } from '../../src/connectors/enterprise/GithubConnector.js';

describe('GithubConnector', () => {
  it('should return correct metadata', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    const metadata = connector.getMetadata();
    expect(metadata.id).toBe('github');
    expect(metadata.compatibilityLabel).toBe('native_protocol');
  });

  it('should generate OAuth2 authorization URL', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    const { url, state } = connector.getAuthorizationUrl();
    expect(url).toBeDefined();
    expect(state).toBeDefined();
  });

  it('should start disconnected', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    expect(connector.getStatus()).toBe('disconnected');
  });

  it('should return connector ID', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    expect(connector.getId()).toBe('test-github');
  });

  it('should be enabled by default', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    expect(connector.isEnabled()).toBe(true);
  });

  it('should list required credentials', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    const metadata = connector.getMetadata();
    expect(metadata.requiredCredentials.length).toBeGreaterThan(0);
  });

  it('should list supported data types', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    const metadata = connector.getMetadata();
    expect(metadata.dataTypes.length).toBeGreaterThan(0);
  });

  it('should have provider information', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    const metadata = connector.getMetadata();
    expect(metadata.provider).toBeDefined();
  });

  it('should have documentation URL', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    const metadata = connector.getMetadata();
    expect(metadata.documentationUrl).toBeDefined();
  });

  it('should have compliance frameworks', () => {
    const connector = new GithubConnector({ id: 'test-github' });
    const metadata = connector.getMetadata();
    expect(metadata.complianceFrameworks).toBeDefined();
  });
});
