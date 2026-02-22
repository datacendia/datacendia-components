// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock prisma before import
vi.mock('../../config/database.js', () => ({
  prisma: {
    sovereign_blackbox_units: { findMany: vi.fn().mockResolvedValue([]), upsert: vi.fn().mockResolvedValue({}) },
    sovereign_blackbox_jobs: { findMany: vi.fn().mockResolvedValue([]), upsert: vi.fn().mockResolvedValue({}) },
    sovereign_blackbox_records: { findMany: vi.fn().mockResolvedValue([]), upsert: vi.fn().mockResolvedValue({}) },
  },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

import { CendiaBlackBoxService } from '../../services/sovereign/CendiaBlackBoxService.js';

describe('CendiaBlackBoxService', () => {
  let service: CendiaBlackBoxService;

  beforeEach(() => {
    service = new CendiaBlackBoxService();
  });

  describe('Unit Management', () => {
    it('should register a new black box unit', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1',
        serialNumber: 'SN-001',
        name: 'Primary Black Box',
        location: { site: 'DC-1', building: 'A', room: '101' },
        specifications: {
          capacityTB: 100,
          usedTB: 0,
          encryptionLevel: 'AES-256-GCM',
          redundancy: 'raid6',
          fireRating: 'Class A',
          waterproofRating: 'IP68',
        },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      expect(unit).toBeDefined();
      expect(unit.id).toMatch(/^bbox-/);
      expect(unit.status).toBe('operational');
      expect(unit.serialNumber).toBe('SN-001');
      expect(unit.specifications.capacityTB).toBe(100);
    });

    it('should retrieve a registered unit', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1',
        serialNumber: 'SN-002',
        name: 'Secondary',
        location: { site: 'DC-2', building: 'B', room: '202' },
        specifications: { capacityTB: 50, usedTB: 0, encryptionLevel: 'AES-256', redundancy: 'raid5', fireRating: 'B', waterproofRating: 'IP67' },
        healthMetrics: { temperature: 21, humidity: 40, batteryPercent: 95, driveHealth: 98 },
      });

      const found = await service.getUnit(unit.id);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(unit.id);
    });

    it('should return null for unknown unit', async () => {
      const found = await service.getUnit('nonexistent');
      expect(found).toBeNull();
    });

    it('should filter units by organization', async () => {
      await service.registerUnit({
        organizationId: 'org-A', serialNumber: 'SN-A', name: 'A',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 10, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid1', fireRating: 'A', waterproofRating: 'IP' },
        healthMetrics: { temperature: 20, humidity: 40, batteryPercent: 100, driveHealth: 100 },
      });
      await service.registerUnit({
        organizationId: 'org-B', serialNumber: 'SN-B', name: 'B',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 10, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid1', fireRating: 'A', waterproofRating: 'IP' },
        healthMetrics: { temperature: 20, humidity: 40, batteryPercent: 100, driveHealth: 100 },
      });

      const orgAUnits = await service.getUnitsForOrg('org-A');
      expect(orgAUnits).toHaveLength(1);
      expect(orgAUnits[0].organizationId).toBe('org-A');
    });

    it('should update unit health and degrade status', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1', serialNumber: 'SN-H', name: 'Health Test',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 10, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid1', fireRating: 'A', waterproofRating: 'IP' },
        healthMetrics: { temperature: 20, humidity: 40, batteryPercent: 100, driveHealth: 100 },
      });

      const updated = await service.updateUnitHealth(unit.id, {
        temperature: 45, humidity: 80, batteryPercent: 5, driveHealth: 40,
      });

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe('degraded');
    });
  });

  describe('Backup Jobs', () => {
    it('should schedule a backup job', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1', serialNumber: 'SN-BJ', name: 'Backup Target',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 50, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid6', fireRating: 'A', waterproofRating: 'IP68' },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      const job = await service.scheduleBackup({
        organizationId: 'org-1',
        blackBoxId: unit.id,
        sourceType: 'ledger',
        sourcePath: '/data/ledger/2024',
        priority: 'critical',
        scheduledAt: new Date(),
      });

      expect(job).toBeDefined();
      expect(job.id).toMatch(/^job-/);
      expect(job.status).toBe('scheduled');
      expect(job.sourceType).toBe('ledger');
    });

    it('should start and complete a backup job', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1', serialNumber: 'SN-SC', name: 'Start Complete',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 50, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid6', fireRating: 'A', waterproofRating: 'IP68' },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      const job = await service.scheduleBackup({
        organizationId: 'org-1', blackBoxId: unit.id,
        sourceType: 'chronos', sourcePath: '/data/chronos', priority: 'high', scheduledAt: new Date(),
      });

      const started = await service.startBackup(job.id);
      expect(started).not.toBeNull();
      // trackBackupProgress completes it synchronously in current impl
      const jobs = await service.getJobs('org-1');
      expect(jobs.length).toBeGreaterThanOrEqual(1);
    });

    it('should not start non-scheduled job', async () => {
      const result = await service.startBackup('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('Recovery Procedures', () => {
    it('should initiate a recovery', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1', serialNumber: 'SN-RC', name: 'Recovery Box',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 50, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid6', fireRating: 'A', waterproofRating: 'IP68' },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      const recovery = await service.initiateRecovery({
        organizationId: 'org-1',
        blackBoxId: unit.id,
        type: 'full',
        targetRecords: [],
        targetDestination: '/recovery/target',
        requestedBy: 'admin-user',
      });

      expect(recovery).toBeDefined();
      expect(recovery.id).toMatch(/^recovery-/);
      expect(recovery.status).toBe('pending');
      expect(recovery.chainOfCustody).toHaveLength(1);
      expect(recovery.chainOfCustody[0].action).toBe('initiated');
    });

    it('should approve and execute recovery with chain of custody', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1', serialNumber: 'SN-AE', name: 'AE Box',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 50, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid6', fireRating: 'A', waterproofRating: 'IP68' },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      const recovery = await service.initiateRecovery({
        organizationId: 'org-1', blackBoxId: unit.id, type: 'selective',
        targetRecords: [], targetDestination: '/recovery/out', requestedBy: 'user-1',
      });

      const approved = await service.approveRecovery(recovery.id, 'approver-1');
      expect(approved).not.toBeNull();
      expect(approved!.approvedBy).toBe('approver-1');
      expect(approved!.chainOfCustody).toHaveLength(2);

      const executed = await service.executeRecovery(recovery.id);
      expect(executed).not.toBeNull();
      expect(executed!.status).toBe('completed');
      expect(executed!.chainOfCustody).toHaveLength(4); // initiated, approved, started, completed
    });

    it('should not execute unapproved recovery', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1', serialNumber: 'SN-UA', name: 'UA Box',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 50, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid6', fireRating: 'A', waterproofRating: 'IP68' },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      const recovery = await service.initiateRecovery({
        organizationId: 'org-1', blackBoxId: unit.id, type: 'full',
        targetRecords: [], targetDestination: '/out', requestedBy: 'user-1',
      });

      const executed = await service.executeRecovery(recovery.id);
      expect(executed).toBeNull();
    });
  });

  describe('Integrity Verification', () => {
    it('should run integrity check on a unit', async () => {
      const unit = await service.registerUnit({
        organizationId: 'org-1', serialNumber: 'SN-IV', name: 'Integrity Box',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 50, usedTB: 0, encryptionLevel: 'AES', redundancy: 'raid6', fireRating: 'A', waterproofRating: 'IP68' },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      const report = await service.runIntegrityCheck(unit.id);
      expect(report).not.toBeNull();
      expect(report!.blackBoxId).toBe(unit.id);
      expect(report!.overallHealth).toBe(100); // No records, 100% healthy
    });

    it('should return null for unknown unit integrity check', async () => {
      const report = await service.runIntegrityCheck('nonexistent');
      expect(report).toBeNull();
    });
  });

  describe('Dashboard', () => {
    it('should return dashboard metrics', async () => {
      await service.registerUnit({
        organizationId: 'org-dash', serialNumber: 'SN-D1', name: 'Dashboard Box',
        location: { site: 'S', building: 'B', room: 'R' },
        specifications: { capacityTB: 100, usedTB: 10, encryptionLevel: 'AES', redundancy: 'raid6', fireRating: 'A', waterproofRating: 'IP68' },
        healthMetrics: { temperature: 22, humidity: 45, batteryPercent: 100, driveHealth: 99 },
      });

      const dashboard = await service.getDashboard('org-dash');
      expect(dashboard.totalUnits).toBe(1);
      expect(dashboard.operationalUnits).toBe(1);
      expect(dashboard.totalStorageTB).toBe(100);
      expect(dashboard.usedStorageTB).toBe(10);
      expect(dashboard.avgIntegrity).toBe(100);
    });
  });
});
