/**
 * Central type exports for the backend
 */
// @ts-nocheck


// Prisma JSON field types
export * from './prisma-json.types.js';

// Utility types (safer alternatives to 'any')
export * from './utility.types.js';

// Re-export types from files that exist
export type { Result, ServiceError, ServiceErrorCode } from '../services/core/BaseService.js';
