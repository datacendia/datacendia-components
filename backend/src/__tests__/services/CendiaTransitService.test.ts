/**
 * CendiaTransitService Tests
 * @module __tests__/services/CendiaTransitService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../services/inference/InferenceProvider.js', () => ({
  inferenceProvider: {
    generate: vi.fn().mockResolvedValue('{"riskLevel": "medium", "advisories": []}'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: 'Risk assessment complete' }),
  },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    generate: vi.fn().mockResolvedValue('{"riskLevel": "medium", "advisories": [], "score": 45}'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: 'Risk assessment' }),
    type: 'ollama',
    isAvailable: vi.fn().mockResolvedValue(true),
    resolveModel: vi.fn().mockResolvedValue('llama3.2:3b'),
  },
}));

const mod = await import('../../services/enterprise/CendiaTransitService.js');
const service = (mod as any).cendiaTransitService || (mod as any).default;

describe('CendiaTransitService', () => {
  it('should export an instance', () => {
    expect(service).toBeDefined();
  });

  describe('assessLocationRisk()', () => {
    it('should assess travel risk for a location', async () => {
      const risk = await service.assessLocationRisk('Lagos', 'Nigeria');
      expect(risk).toBeDefined();
    });
  });

  describe('createTravelRequest()', () => {
    it('should create a travel request', async () => {
      const request = await service.createTravelRequest({
        travelerId: 'user-1',
        travelerName: 'Test User',
        destinations: [{ city: 'London', country: 'UK' }],
        departureDate: new Date('2025-03-01'),
        returnDate: new Date('2025-03-07'),
        purpose: 'Client meeting',
      } as any);
      expect(request).toBeDefined();
      expect(request.id).toBeDefined();
      expect(request).toHaveProperty('status');
      expect(request).toHaveProperty('travelerId', 'user-1');
    });
  });

  describe('approveTravelRequest()', () => {
    it('should return null for non-existent request', () => {
      expect(service.approveTravelRequest('not-found', 'admin')).toBeNull();
    });
  });

  describe('getTravelRequest()', () => {
    it('should return null for non-existent request', () => {
      expect(service.getTravelRequest('not-found')).toBeNull();
    });
  });

  describe('getActiveTravelers()', () => {
    it('should return active travelers', () => {
      const travelers = service.getActiveTravelers();
      expect(Array.isArray(travelers)).toBe(true);
    });
  });

  describe('createSecurityPlan()', () => {
    it('should create a security plan for a travel request', async () => {
      const request = await service.createTravelRequest({
        travelerId: 'user-2',
        travelerName: 'Exec',
        destinations: [{ city: 'Dubai', country: 'UAE' }],
        departureDate: new Date('2025-04-01'),
        returnDate: new Date('2025-04-05'),
        purpose: 'Conference',
      } as any);
      const plan = await service.createSecurityPlan(request.id);
      expect(plan).toBeDefined();
      expect(plan).toHaveProperty('travelRequestId', request.id);
    });
  });

  describe('getMissedCheckIns()', () => {
    it('should return missed check-ins', () => {
      const missed = service.getMissedCheckIns();
      expect(Array.isArray(missed)).toBe(true);
    });
  });

  describe('reportIncident()', () => {
    it('should report a travel incident', () => {
      const incident = service.reportIncident({
        travelRequestId: 'req-1',
        type: 'security',
        severity: 'medium',
        description: 'Suspicious activity near hotel',
        location: 'Hotel District',
      } as any);
      expect(incident).toBeDefined();
      expect(incident.id).toBeDefined();
    });
  });

  describe('issueAlert()', () => {
    it('should issue a travel alert', () => {
      const alert = service.issueAlert({
        type: 'security',
        severity: 'high',
        location: 'Country X',
        message: 'Travel advisory issued',
        validUntil: new Date('2025-12-31'),
      } as any);
      expect(alert).toBeDefined();
    });
  });

  describe('getActiveAlerts()', () => {
    it('should return active alerts', () => {
      const alerts = service.getActiveAlerts();
      expect(Array.isArray(alerts)).toBe(true);
    });
  });
});
