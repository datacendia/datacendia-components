import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../config/database.js', () => ({
  prisma: {
    dissents: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../../utils/servicePersistence.js', () => ({
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/ChronosEventBus.js', () => ({
  recordChronosEvent: vi.fn(),
}));

const originalEnv = { ...process.env };
const { dissentService } = await import('../../services/CendiaDissentService.js');

describe('CendiaDissentService encryption helpers', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it('encrypts and decrypts identities with AES-256-GCM when key is available', () => {
    process.env.DISSENT_ENCRYPTION_KEY = 'a'.repeat(64);
    const service = dissentService as any;

    const encrypted = service.encryptIdentity('user-123');
    const decrypted = service.decryptIdentity(encrypted);

    expect(encrypted).toContain(':');
    expect(encrypted).not.toContain('user-123');
    expect(decrypted).toBe('user-123');
  });

  it('falls back to base64 when no encryption key is configured', () => {
    delete process.env.DISSENT_ENCRYPTION_KEY;
    delete process.env.JWT_SECRET;
    const service = dissentService as any;

    const encrypted = service.encryptIdentity('user-456');
    const decrypted = service.decryptIdentity(encrypted);

    expect(encrypted.startsWith('b64:')).toBe(true);
    expect(decrypted).toBe('user-456');
  });
});
