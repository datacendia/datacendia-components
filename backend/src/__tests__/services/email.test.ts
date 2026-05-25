import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendMailMock = vi.fn();
const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));

vi.mock('nodemailer', () => ({
  default: {
    createTransport: createTransportMock,
  },
  createTransport: createTransportMock,
}));

vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/sovereign/SovereignModeService.js', () => ({
  sovereignMode: {
    isExternalNotifyEnabled: true,
  },
}));

const originalEnv = { ...process.env };
const { emailService } = await import('../../services/email.js');

describe('emailService SMTP behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('skips sending when SMTP is disabled', async () => {
    process.env.SMTP_ENABLED = 'false';

    const sent = await emailService.send({
      to: 'pilot@datacendia.com',
      subject: 'Test',
      text: 'Body',
    });

    expect(sent).toBe(true);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('skips sending when SMTP configuration is missing', async () => {
    process.env.SMTP_ENABLED = 'true';
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;

    const sent = await emailService.send({
      to: 'pilot@datacendia.com',
      subject: 'Test',
      text: 'Body',
    });

    expect(sent).toBe(true);
    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('sends using SMTP when enabled and configured', async () => {
    process.env.SMTP_ENABLED = 'true';
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    delete process.env.SMTP_FROM;
    sendMailMock.mockResolvedValueOnce({ messageId: 'msg-1' });

    const sent = await emailService.send({
      to: 'pilot@datacendia.com',
      subject: 'Pilot onboarded',
      text: 'Welcome',
    });

    expect(sent).toBe(true);
    expect(createTransportMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
      from: 'Datacendia <noreply@datacendia.com>',
      to: 'pilot@datacendia.com',
      subject: 'Pilot onboarded',
    }));
  });
});
