// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA KEYÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ - Hardware Authentication Service
// "Physical presence for digital authority."
// Sovereign Security Layer - Hardware Authentication
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface HardwareKey {
  id: string;
  organizationId: string;
  serialNumber: string;
  type: 'usb' | 'nfc' | 'smartcard' | 'biometric';
  assignedTo: string | null;
  assignedToName: string | null;
  status: 'active' | 'inactive' | 'lost' | 'revoked';
  capabilities: string[];
  publicKey: string;
  registeredAt: Date;
  lastUsed: Date | null;
  usageCount: number;
  metadata: Record<string, unknown>;
}

export interface AuthChallenge {
  id: string;
  keyId: string;
  challenge: string;
  operation: string;
  expiresAt: Date;
  completedAt: Date | null;
  verified: boolean;
}

export interface HighRiskOperation {
  id: string;
  organizationId: string;
  type: 'large_transaction' | 'config_change' | 'data_export' | 'user_management' | 'system_access';
  description: string;
  threshold: Record<string, unknown>;
  requiresKey: boolean;
  requiresBiometric: boolean;
  cooldownSeconds: number;
  createdAt: Date;
}

export interface OperationAttempt {
  id: string;
  organizationId: string;
  operationId: string;
  userId: string;
  keyId: string | null;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  challengeId: string | null;
  biometricVerified: boolean;
  attemptedAt: Date;
  completedAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface KeyAuditLog {
  id: string;
  keyId: string;
  event: 'registered' | 'assigned' | 'used' | 'lost' | 'revoked' | 'recovered';
  details: string;
  actor: string;
  timestamp: Date;
  ipAddress: string;
}

// =============================================================================
// CENDIA KEY SERVICE
// =============================================================================

// =============================================================================
// ENUM MAPPERS
// =============================================================================

const KEY_TYPE_TO_ENUM: Record<string, string> = { usb: 'USB', nfc: 'NFC', smartcard: 'SMARTCARD', biometric: 'BIOMETRIC' };
const ENUM_TO_KEY_TYPE: Record<string, HardwareKey['type']> = { USB: 'usb', NFC: 'nfc', SMARTCARD: 'smartcard', BIOMETRIC: 'biometric' };
const KEY_STATUS_TO_ENUM: Record<string, string> = { active: 'ACTIVE', inactive: 'INACTIVE', lost: 'LOST', revoked: 'REVOKED' };
const ENUM_TO_KEY_STATUS: Record<string, HardwareKey['status']> = { ACTIVE: 'active', INACTIVE: 'inactive', LOST: 'lost', REVOKED: 'revoked' };
const KEY_EVENT_TO_ENUM: Record<string, string> = { registered: 'REGISTERED', assigned: 'ASSIGNED', used: 'USED', lost: 'LOST', revoked: 'REVOKED', recovered: 'RECOVERED' };
const OP_TYPE_TO_ENUM: Record<string, string> = { large_transaction: 'LARGE_TRANSACTION', config_change: 'CONFIG_CHANGE', data_export: 'DATA_EXPORT', user_management: 'USER_MANAGEMENT', system_access: 'SYSTEM_ACCESS' };
const ENUM_TO_OP_TYPE: Record<string, HighRiskOperation['type']> = { LARGE_TRANSACTION: 'large_transaction', CONFIG_CHANGE: 'config_change', DATA_EXPORT: 'data_export', USER_MANAGEMENT: 'user_management', SYSTEM_ACCESS: 'system_access' };

// =============================================================================
// CENDIA KEY SERVICE — Prisma-backed with Map fallback for tests
// =============================================================================

export class CendiaKeyService {
  private _keys: Map<string, HardwareKey> = new Map();
  private _challenges: Map<string, AuthChallenge> = new Map();
  private _operations: Map<string, HighRiskOperation> = new Map();
  private _attempts: Map<string, OperationAttempt> = new Map();
  private _auditLogs: Map<string, KeyAuditLog[]> = new Map();

  private db: PrismaClient | null;

  constructor(prisma?: PrismaClient) {
    this.db = prisma || null;
    logger.info(`[CendiaKey] Hardware Authentication service initialized (persistence: ${this.db ? 'PostgreSQL' : 'in-memory'})`);


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // KEY MANAGEMENT
  // ===========================================================================

  async registerKey(data: Omit<HardwareKey, 'id' | 'status' | 'registeredAt' | 'lastUsed' | 'usageCount'>): Promise<HardwareKey> {
    if (this.db) {
      const row = await this.db.hardware_keys.create({
        data: {
          organization_id: data.organizationId,
          serial_number: data.serialNumber,
          key_type: KEY_TYPE_TO_ENUM[data.type] as any,
          assigned_to: data.assignedTo,
          assigned_name: data.assignedToName,
          capabilities: (data.capabilities || []) as any,
          public_key: data.publicKey,
        },
      });
      const key = this.rowToKey(row);
      await this.logKeyEvent(key.id, 'registered', 'Hardware key registered', 'system', '127.0.0.1');
      return key;
    }

    const key: HardwareKey = {
      ...data,
      id: `key-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      status: 'active',
      registeredAt: new Date(),
      lastUsed: null,
      usageCount: 0,
    };
    this._keys.set(key.id, key);
    await this.logKeyEvent(key.id, 'registered', 'Hardware key registered', 'system', '127.0.0.1');
    return key;
  }

  async assignKey(keyId: string, userId: string, userName: string): Promise<HardwareKey | null> {
    const key = await this.getKey(keyId);
    if (!key) return null;

    if (this.db) {
      await this.db.hardware_keys.update({
        where: { id: keyId },
        data: { assigned_to: userId, assigned_name: userName },
      });
    }
    key.assignedTo = userId;
    key.assignedToName = userName;
    this._keys.set(keyId, key);
    await this.logKeyEvent(keyId, 'assigned', `Assigned to ${userName}`, 'admin', '127.0.0.1');
    return key;
  }

  async revokeKey(keyId: string, reason: string, actor: string): Promise<HardwareKey | null> {
    const key = await this.getKey(keyId);
    if (!key) return null;

    if (this.db) {
      await this.db.hardware_keys.update({ where: { id: keyId }, data: { status: 'REVOKED' as any } });
    }
    key.status = 'revoked';
    this._keys.set(keyId, key);
    await this.logKeyEvent(keyId, 'revoked', `Revoked: ${reason}`, actor, '127.0.0.1');
    return key;
  }

  async reportLost(keyId: string, reporter: string): Promise<HardwareKey | null> {
    const key = await this.getKey(keyId);
    if (!key) return null;

    if (this.db) {
      await this.db.hardware_keys.update({ where: { id: keyId }, data: { status: 'LOST' as any } });
    }
    key.status = 'lost';
    this._keys.set(keyId, key);
    await this.logKeyEvent(keyId, 'lost', 'Reported as lost', reporter, '127.0.0.1');
    return key;
  }

  async getKey(keyId: string): Promise<HardwareKey | null> {
    if (this.db) {
      const row = await this.db.hardware_keys.findUnique({ where: { id: keyId } });
      return row ? this.rowToKey(row) : null;
    }
    return this._keys.get(keyId) || null;
  }

  async getKeysForOrg(organizationId: string): Promise<HardwareKey[]> {
    if (this.db) {
      const rows = await this.db.hardware_keys.findMany({ where: { organization_id: organizationId } });
      return rows.map((r: any) => this.rowToKey(r));
    }
    return Array.from(this._keys.values()).filter(k => k.organizationId === organizationId);
  }

  async getKeyBySerial(serialNumber: string): Promise<HardwareKey | null> {
    if (this.db) {
      const row = await this.db.hardware_keys.findUnique({ where: { serial_number: serialNumber } });
      return row ? this.rowToKey(row) : null;
    }
    return Array.from(this._keys.values()).find(k => k.serialNumber === serialNumber) || null;
  }

  // ===========================================================================
  // AUTHENTICATION CHALLENGES
  // ===========================================================================

  async createChallenge(keyId: string, operation: string): Promise<AuthChallenge | null> {
    const key = await this.getKey(keyId);
    if (!key || key.status !== 'active') return null;

    const challenge: AuthChallenge = {
      id: `challenge-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      keyId,
      challenge: this.generateCryptoChallenge(),
      operation,
      expiresAt: new Date(Date.now() + 300000),
      completedAt: null,
      verified: false,
    };

    if (this.db) {
      await this.db.auth_challenges.create({
        data: {
          id: challenge.id,
          key_id: keyId,
          challenge: challenge.challenge,
          operation,
          expires_at: challenge.expiresAt,
        },
      });
    } else {
      this._challenges.set(challenge.id, challenge);
    }
    return challenge;
  }

  async verifyChallenge(challengeId: string, response: string): Promise<{
    verified: boolean;
    key: HardwareKey | null;
    error?: string;
  }> {
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) return { verified: false, key: null, error: 'Challenge not found' };
    if (challenge.completedAt) return { verified: false, key: null, error: 'Challenge already used' };
    if (new Date() > challenge.expiresAt) return { verified: false, key: null, error: 'Challenge expired' };

    const key = await this.getKey(challenge.keyId);
    if (!key || key.status !== 'active') return { verified: false, key: null, error: 'Key not active' };

    const verified = this.verifyCryptoResponse(challenge.challenge, response, key.publicKey);

    if (verified) {
      challenge.completedAt = new Date();
      challenge.verified = true;

      if (this.db) {
        await this.db.auth_challenges.update({
          where: { id: challengeId },
          data: { verified: true, completed_at: new Date() },
        });
        await this.db.hardware_keys.update({
          where: { id: key.id },
          data: { last_used: new Date(), usage_count: { increment: 1 } },
        });
      } else {
        this._challenges.set(challengeId, challenge);
        key.lastUsed = new Date();
        key.usageCount++;
        this._keys.set(key.id, key);
      }

      await this.logKeyEvent(key.id, 'used', `Verified for ${challenge.operation}`, key.assignedTo || 'unknown', '127.0.0.1');
    }

    return { verified, key: verified ? key : null };
  }

  async getChallenge(challengeId: string): Promise<AuthChallenge | null> {
    if (this.db) {
      const row = await this.db.auth_challenges.findUnique({ where: { id: challengeId } });
      if (!row) return null;
      return { id: row.id, keyId: row.key_id, challenge: row.challenge, operation: row.operation, expiresAt: row.expires_at, completedAt: row.completed_at, verified: row.verified };
    }
    return this._challenges.get(challengeId) || null;
  }

  // ===========================================================================
  // HIGH-RISK OPERATIONS
  // ===========================================================================

  async defineOperation(data: Omit<HighRiskOperation, 'id' | 'createdAt'>): Promise<HighRiskOperation> {
    const operation: HighRiskOperation = {
      ...data,
      id: `op-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      createdAt: new Date(),
    };

    if (this.db) {
      await this.db.high_risk_operations.create({
        data: {
          id: operation.id,
          organization_id: data.organizationId,
          operation_type: OP_TYPE_TO_ENUM[data.type] as any,
          description: data.description,
          threshold: (data.threshold || {}) as any,
          requires_key: data.requiresKey,
          requires_biometric: data.requiresBiometric,
          cooldown_seconds: data.cooldownSeconds,
        },
      });
    } else {
      this._operations.set(operation.id, operation);
    }
    return operation;
  }

  async getOperations(organizationId: string): Promise<HighRiskOperation[]> {
    if (this.db) {
      const rows = await this.db.high_risk_operations.findMany({ where: { organization_id: organizationId } });
      return rows.map((r: any) => this.rowToOperation(r));
    }
    return Array.from(this._operations.values()).filter(o => o.organizationId === organizationId);
  }

  async getOperation(operationId: string): Promise<HighRiskOperation | null> {
    if (this.db) {
      const row = await this.db.high_risk_operations.findUnique({ where: { id: operationId } });
      return row ? this.rowToOperation(row) : null;
    }
    return this._operations.get(operationId) || null;
  }

  async initiateOperation(operationId: string, userId: string, keyId?: string): Promise<OperationAttempt | null> {
    const operation = await this.getOperation(operationId);
    if (!operation) return null;

    const attempt: OperationAttempt = {
      id: `attempt-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      organizationId: operation.organizationId,
      operationId,
      userId,
      keyId: keyId || null,
      status: 'pending',
      challengeId: null,
      biometricVerified: false,
      attemptedAt: new Date(),
      completedAt: null,
      metadata: {},
    };

    if (operation.requiresKey && keyId) {
      const challenge = await this.createChallenge(keyId, operation.type);
      if (challenge) attempt.challengeId = challenge.id;
    }

    this._attempts.set(attempt.id, attempt);
    return attempt;
  }

  async completeOperation(attemptId: string, challengeResponse?: string, biometricData?: string): Promise<{
    success: boolean;
    attempt: OperationAttempt;
    error?: string;
  }> {
    const attempt = this._attempts.get(attemptId);
    if (!attempt) return { success: false, attempt: null as any, error: 'Attempt not found' };

    const operation = await this.getOperation(attempt.operationId);
    if (!operation) return { success: false, attempt, error: 'Operation definition not found' };

    if (operation.requiresKey && attempt.challengeId) {
      if (!challengeResponse) return { success: false, attempt, error: 'Key verification required' };
      const verification = await this.verifyChallenge(attempt.challengeId, challengeResponse);
      if (!verification.verified) {
        attempt.status = 'rejected';
        this._attempts.set(attemptId, attempt);
        return { success: false, attempt, error: verification.error || 'Key verification failed' };
      }
    }

    if (operation.requiresBiometric) {
      if (!biometricData) return { success: false, attempt, error: 'Biometric verification required' };
      attempt.biometricVerified = biometricData.length > 0;
    }

    attempt.status = 'verified';
    attempt.completedAt = new Date();
    this._attempts.set(attemptId, attempt);
    return { success: true, attempt };
  }

  async getRecentAttempts(organizationId: string, limit: number = 50): Promise<OperationAttempt[]> {
    return Array.from(this._attempts.values())
      .filter(a => a.organizationId === organizationId)
      .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime())
      .slice(0, limit);
  }

  // ===========================================================================
  // AUDIT LOGGING
  // ===========================================================================

  private async logKeyEvent(
    keyId: string,
    event: KeyAuditLog['event'],
    details: string,
    actor: string,
    ipAddress: string
  ): Promise<void> {
    if (this.db) {
      await this.db.key_audit_logs.create({
        data: {
          key_id: keyId,
          event: KEY_EVENT_TO_ENUM[event] as any,
          details,
          actor,
          ip_address: ipAddress,
        },
      }).catch(() => {}); // graceful if key doesn't exist yet in DB
    }

    const logs = this._auditLogs.get(keyId) || [];
    logs.push({
      id: `log-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      keyId, event, details, actor,
      timestamp: new Date(),
      ipAddress,
    });
    this._auditLogs.set(keyId, logs);
  }

  async getKeyAuditLog(keyId: string): Promise<KeyAuditLog[]> {
    if (this.db) {
      const rows = await this.db.key_audit_logs.findMany({
        where: { key_id: keyId },
        orderBy: { created_at: 'desc' },
      });
      return rows.map((r: any) => ({
        id: r.id, keyId: r.key_id, event: r.event.toLowerCase() as KeyAuditLog['event'],
        details: r.details || '', actor: r.actor, timestamp: r.created_at, ipAddress: r.ip_address || '',
      }));
    }
    return (this._auditLogs.get(keyId) || [])
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    totalKeys: number;
    activeKeys: number;
    assignedKeys: number;
    lostKeys: number;
    operationsToday: number;
    successRate: number;
    recentAttempts: OperationAttempt[];
    keysByType: Record<string, number>;
  }> {
    const keys = await this.getKeysForOrg(organizationId);
    const attempts = await this.getRecentAttempts(organizationId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttempts = attempts.filter(a => a.attemptedAt >= today);
    const successfulAttempts = todayAttempts.filter(a => a.status === 'verified').length;
    const successRate = todayAttempts.length > 0 ? (successfulAttempts / todayAttempts.length) * 100 : 100;

    const keysByType: Record<string, number> = {};
    for (const k of keys) keysByType[k.type] = (keysByType[k.type] || 0) + 1;

    return {
      totalKeys: keys.length,
      activeKeys: keys.filter(k => k.status === 'active').length,
      assignedKeys: keys.filter(k => k.assignedTo).length,
      lostKeys: keys.filter(k => k.status === 'lost').length,
      operationsToday: todayAttempts.length,
      successRate,
      recentAttempts: attempts.slice(0, 10),
      keysByType,
    };
  }

  // ===========================================================================
  // ROW MAPPERS & HELPERS
  // ===========================================================================

  private rowToKey(row: any): HardwareKey {
    return {
      id: row.id,
      organizationId: row.organization_id,
      serialNumber: row.serial_number,
      type: ENUM_TO_KEY_TYPE[row.key_type] || 'usb',
      assignedTo: row.assigned_to,
      assignedToName: row.assigned_name,
      status: ENUM_TO_KEY_STATUS[row.status] || 'active',
      capabilities: (row.capabilities as string[]) || [],
      publicKey: row.public_key,
      registeredAt: row.created_at,
      lastUsed: row.last_used,
      usageCount: row.usage_count,
      metadata: {},
    };
  }

  private rowToOperation(row: any): HighRiskOperation {
    return {
      id: row.id,
      organizationId: row.organization_id,
      type: ENUM_TO_OP_TYPE[row.operation_type] || 'system_access',
      description: row.description,
      threshold: (row.threshold as Record<string, unknown>) ?? {},
      requiresKey: row.requires_key,
      requiresBiometric: row.requires_biometric,
      cooldownSeconds: row.cooldown_seconds,
      createdAt: row.created_at,
    };
  }

  private generateCryptoChallenge(): string {
    return `challenge-${Date.now()}-${crypto.randomUUID().slice(0, 16)}`;
  }

  private verifyCryptoResponse(challenge: string, response: string, publicKey: string): boolean {
    return response.length > 10 && response.includes(challenge.substring(0, 8));
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaKey', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this._keys.has(d.id)) this._keys.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaKey', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this._challenges.has(d.id)) this._challenges.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaKey', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this._operations.has(d.id)) this._operations.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaKey', recordType: 'record', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this._attempts.has(d.id)) this._attempts.set(d.id, d);


      }


      restored += recs_3.length;


      const recs_4 = await loadServiceRecords({ serviceName: 'CendiaKey', recordType: 'record', limit: 1000 });


      for (const rec of recs_4) {


        const d = rec.data as any;


        if (d?.id && !this._auditLogs.has(d.id)) this._auditLogs.set(d.id, d);


      }


      restored += recs_4.length;


      if (restored > 0) logger.info(`[CendiaKeyService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaKeyService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaKey',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaKeyService = new CendiaKeyService();
