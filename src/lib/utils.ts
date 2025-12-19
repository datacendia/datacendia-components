import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================
// RETRY UTILITY WITH EXPONENTIAL BACKOFF
// =============================================================================

export interface RetryOptions {
  /**
   * Maximum number of retry attempts (default: 3)
   */
  maxAttempts?: number;

  /**
   * Initial delay in milliseconds before first retry (default: 1000ms)
   */
  initialDelay?: number;

  /**
   * Maximum delay in milliseconds between retries (default: 10000ms)
   */
  maxDelay?: number;

  /**
   * Backoff multiplier for exponential backoff (default: 2)
   */
  backoffMultiplier?: number;

  /**
   * Function to determine if an error should trigger a retry
   * @param error - The error that occurred
   * @returns true if the operation should be retried
   */
  shouldRetry?: (error: unknown) => boolean;

  /**
   * Callback invoked before each retry attempt
   * @param attempt - The current attempt number (1-based)
   * @param error - The error that triggered the retry
   * @param delayMs - The delay before the next attempt
   */
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
}

const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  shouldRetry: () => true,
};

/**
 * Execute a function with retry logic and exponential backoff
 *
 * @param fn - The async function to execute
 * @param options - Retry configuration options
 * @returns The result of the function execution
 * @throws The last error if all retry attempts fail
 *
 * @example
 * ```typescript
 * // Retry an API call up to 3 times with exponential backoff
 * const result = await withRetry(
 *   async () => api.get('/endpoint'),
 *   {
 *     maxAttempts: 3,
 *     initialDelay: 1000,
 *     shouldRetry: (error) => error instanceof NetworkError,
 *     onRetry: (attempt, error, delay) => {
 *       console.log(`Retry attempt ${attempt} after ${delay}ms due to:`, error);
 *     }
 *   }
 * );
 * ```
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      const shouldRetry = options.shouldRetry ? options.shouldRetry(error) : opts.shouldRetry(error);

      // If this is the last attempt or we shouldn't retry, throw the error
      if (attempt >= opts.maxAttempts || !shouldRetry) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const currentDelay = Math.min(delay, opts.maxDelay);

      // Notify about retry
      if (options.onRetry) {
        options.onRetry(attempt, error, currentDelay);
      }

      // Wait before retrying
      await sleep(currentDelay);

      // Increase delay for next attempt (exponential backoff)
      delay = delay * opts.backoffMultiplier;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Sleep for a specified duration
 * @param ms - Duration in milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error is retryable based on common patterns
 * @param error - The error to check
 * @returns true if the error appears to be transient/retryable
 */
export function isRetryableError(error: unknown): boolean {
  // Check if error has an isRetryable property
  if (error && typeof error === 'object' && 'isRetryable' in error) {
    return Boolean((error as { isRetryable?: boolean }).isRetryable);
  }

  // Check for network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // Check for timeout errors
  if (error instanceof Error && error.name === 'AbortError') {
    return true;
  }

  // Check for API errors with retryable codes
  if (error && typeof error === 'object' && 'error' in error) {
    const apiError = error as { error?: { code?: string } };
    const errorCode = apiError.error?.code;

    // Network, timeout, and server errors are typically retryable
    const retryableCodes = ['NETWORK_ERROR', 'TIMEOUT_ERROR', 'SERVER_ERROR', 'RATE_LIMIT_EXCEEDED'];
    if (errorCode && retryableCodes.includes(errorCode)) {
      return true;
    }
  }

  // Default to not retryable for unknown errors
  return false;
}
