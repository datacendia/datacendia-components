/**
 * Custom Error Classes for Apotheosis Service
 * Provides detailed error information for better debugging and error handling
 */

/**
 * Error categories for Apotheosis operations
 */
export enum ApotheosisErrorCategory {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error codes for specific error scenarios
 */
export enum ApotheosisErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  AUTH_INVALID = 'AUTH_INVALID',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Base class for all Apotheosis-related errors
 * Extends native Error with additional context and categorization
 */
export class ApotheosisError extends Error {
  public readonly code: ApotheosisErrorCode;
  public readonly category: ApotheosisErrorCategory;
  public readonly isRetryable: boolean;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ApotheosisErrorCode,
    category: ApotheosisErrorCategory,
    isRetryable: boolean = false,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApotheosisError';
    this.code = code;
    this.category = category;
    this.isRetryable = isRetryable;
    this.timestamp = new Date();
    this.context = context;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApotheosisError);
    }
  }

  /**
   * Convert error to a plain object for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      category: this.category,
      isRetryable: this.isRetryable,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Network-related errors (connection failures, timeouts)
 */
export class ApotheosisNetworkError extends ApotheosisError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ApotheosisErrorCode.NETWORK_ERROR, ApotheosisErrorCategory.NETWORK, true, context);
    this.name = 'ApotheosisNetworkError';
  }
}

/**
 * Timeout errors
 */
export class ApotheosisTimeoutError extends ApotheosisError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ApotheosisErrorCode.TIMEOUT_ERROR, ApotheosisErrorCategory.TIMEOUT, true, context);
    this.name = 'ApotheosisTimeoutError';
  }
}

/**
 * Authentication errors
 */
export class ApotheosisAuthError extends ApotheosisError {
  constructor(message: string, code: ApotheosisErrorCode, context?: Record<string, unknown>) {
    super(message, code, ApotheosisErrorCategory.AUTHENTICATION, false, context);
    this.name = 'ApotheosisAuthError';
  }
}

/**
 * Server errors (5xx responses)
 */
export class ApotheosisServerError extends ApotheosisError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ApotheosisErrorCode.SERVER_ERROR, ApotheosisErrorCategory.SERVER, true, context);
    this.name = 'ApotheosisServerError';
  }
}

/**
 * Rate limiting errors
 */
export class ApotheosisRateLimitError extends ApotheosisError {
  public readonly retryAfter?: number; // seconds

  constructor(message: string, retryAfter?: number, context?: Record<string, unknown>) {
    super(
      message,
      ApotheosisErrorCode.RATE_LIMIT_EXCEEDED,
      ApotheosisErrorCategory.SERVER,
      true,
      context
    );
    this.name = 'ApotheosisRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Parse an HTTP response error into an appropriate ApotheosisError
 */
export function parseApiError(error: unknown, endpoint: string): ApotheosisError {
  const context = { endpoint };

  // Handle fetch/network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new ApotheosisNetworkError(
      `Network error while fetching ${endpoint}: ${error.message}`,
      context
    );
  }

  // Handle timeout errors
  if (error instanceof Error && error.name === 'AbortError') {
    return new ApotheosisTimeoutError(`Request to ${endpoint} timed out`, context);
  }

  // Handle API response errors
  if (error && typeof error === 'object' && 'error' in error) {
    const apiError = error as { error?: { code?: string; message?: string } };
    const errorCode = apiError.error?.code;
    const errorMessage = apiError.error?.message || 'Unknown API error';

    // Authentication errors
    if (errorCode === 'AUTH_EXPIRED' || errorCode === 'AUTH_INVALID') {
      return new ApotheosisAuthError(
        errorMessage,
        errorCode === 'AUTH_EXPIRED'
          ? ApotheosisErrorCode.AUTH_EXPIRED
          : ApotheosisErrorCode.AUTH_INVALID,
        context
      );
    }

    // Rate limiting
    if (errorCode === 'RATE_LIMIT_EXCEEDED') {
      return new ApotheosisRateLimitError(errorMessage, undefined, context);
    }

    // Server errors
    if (errorCode === 'SERVER_ERROR') {
      return new ApotheosisServerError(errorMessage, context);
    }
  }

  // Default to unknown error
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
  return new ApotheosisError(
    `Error fetching ${endpoint}: ${message}`,
    ApotheosisErrorCode.UNKNOWN_ERROR,
    ApotheosisErrorCategory.UNKNOWN,
    false,
    context
  );
}
