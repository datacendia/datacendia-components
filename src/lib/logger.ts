/**
 * Frontend Logger Utility
 * 
 * Production-safe logging that:
 * - Suppresses debug/info in production builds
 * - Preserves warn/error for monitoring
 * - Provides structured logging with prefixes
 * - Can be extended to send errors to external services (Sentry, DataDog, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const IS_PRODUCTION = import.meta.env.PROD;
const IS_TEST = import.meta.env.MODE === 'test';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// In production, only warn and error are emitted
const MIN_LEVEL: LogLevel = IS_PRODUCTION ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  if (IS_TEST) return false;
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];
}

export const logger = {
  debug(...args: unknown[]): void {
    if (shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug('[Datacendia]', ...args);
    }
  },

  info(...args: unknown[]): void {
    if (shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info('[Datacendia]', ...args);
    }
  },

  warn(...args: unknown[]): void {
    if (shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn('[Datacendia]', ...args);
    }
  },

  error(...args: unknown[]): void {
    if (shouldLog('error')) {
      // eslint-disable-next-line no-console
      console.error('[Datacendia]', ...args);
    }
  },
};

export default logger;
