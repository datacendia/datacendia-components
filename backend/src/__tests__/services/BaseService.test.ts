/**
 * BaseService Tests
 * 
 * Tests for the shared service infrastructure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  BaseService, 
  Result, 
  ServiceErrorCodes,
  unwrapResult,
  isSuccess,
  isFailure 
} from '../../services/core/BaseService.js';

// Test implementation of BaseService
class TestService extends BaseService {
  constructor() {
    super('TestService');
  }

  // Expose protected methods for testing
  testSuccess<T>(data: T): Result<T> {
    return this.success(data);
  }

  testFailure<T>(code: string, message: string): Result<T> {
    return this.failure(code as any, message);
  }

  async testSafeExecute<T>(operation: () => Promise<T>): Promise<Result<T>> {
    return this.safeExecute(operation);
  }

  testValidateRequired<T extends Record<string, unknown>>(
    data: T,
    fields: (keyof T)[]
  ): Result<T> {
    return this.validateRequired(data, fields);
  }

  testValidateId(id: string | undefined | null): Result<string> {
    return this.validateId(id);
  }

  testStartTimer() {
    return this.startTimer();
  }
}

describe('BaseService', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
  });

  describe('success()', () => {
    it('should create a successful result with data', () => {
      const result = service.testSuccess({ id: '123', name: 'Test' });
      
      expect(result.success).toBe(true);
      expect(isSuccess(result)).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: '123', name: 'Test' });
      }
    });

    it('should handle null data', () => {
      const result = service.testSuccess(null);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });

    it('should handle array data', () => {
      const result = service.testSuccess([1, 2, 3]);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([1, 2, 3]);
      }
    });
  });

  describe('failure()', () => {
    it('should create a failure result with error', () => {
      const result = service.testFailure<string>(
        ServiceErrorCodes.NOT_FOUND,
        'Resource not found'
      );
      
      expect(result.success).toBe(false);
      expect(isFailure(result)).toBe(true);
      if (!result.success) {
        expect(result.error.code).toBe(ServiceErrorCodes.NOT_FOUND);
        expect(result.error.message).toBe('Resource not found');
      }
    });
  });

  describe('safeExecute()', () => {
    it('should return success for successful operations', async () => {
      const result = await service.testSafeExecute(async () => 'test data');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test data');
      }
    });

    it('should return failure for throwing operations', async () => {
      const result = await service.testSafeExecute(async () => {
        throw new Error('Operation failed');
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ServiceErrorCodes.INTERNAL_ERROR);
      }
    });

    it('should handle non-Error throws', async () => {
      const result = await service.testSafeExecute(async () => {
        throw 'string error';
      });
      
      expect(result.success).toBe(false);
    });
  });

  describe('validateRequired()', () => {
    it('should pass when all required fields are present', () => {
      const data = { name: 'Test', email: 'test@example.com', age: 25 };
      const result = service.testValidateRequired(data, ['name', 'email']);
      
      expect(result.success).toBe(true);
    });

    it('should fail when required fields are missing', () => {
      const data = { name: 'Test', email: '' };
      const result = service.testValidateRequired(data, ['name', 'email']);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ServiceErrorCodes.MISSING_REQUIRED_FIELD);
        expect(result.error.details?.missingFields).toContain('email');
      }
    });

    it('should fail when required fields are null', () => {
      const data = { name: 'Test', email: null };
      const result = service.testValidateRequired(data, ['name', 'email']);
      
      expect(result.success).toBe(false);
    });

    it('should fail when required fields are undefined', () => {
      const data = { name: 'Test' } as { name: string; email?: string };
      const result = service.testValidateRequired(data, ['name', 'email']);
      
      expect(result.success).toBe(false);
    });
  });

  describe('validateId()', () => {
    it('should pass for valid IDs', () => {
      const result = service.testValidateId('abc-123');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('abc-123');
      }
    });

    it('should trim whitespace from IDs', () => {
      const result = service.testValidateId('  abc-123  ');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('abc-123');
      }
    });

    it('should fail for empty strings', () => {
      const result = service.testValidateId('');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ServiceErrorCodes.INVALID_INPUT);
      }
    });

    it('should fail for null', () => {
      const result = service.testValidateId(null);
      
      expect(result.success).toBe(false);
    });

    it('should fail for undefined', () => {
      const result = service.testValidateId(undefined);
      
      expect(result.success).toBe(false);
    });

    it('should fail for whitespace-only strings', () => {
      const result = service.testValidateId('   ');
      
      expect(result.success).toBe(false);
    });
  });

  describe('startTimer()', () => {
    it('should return elapsed time', async () => {
      const getElapsed = service.testStartTimer();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const elapsed = getElapsed();
      expect(elapsed).toBeGreaterThanOrEqual(40);
      expect(elapsed).toBeLessThan(200);
    });
  });
});

describe('unwrapResult()', () => {
  it('should return data for successful results', () => {
    const result: Result<string> = { success: true, data: 'test' };
    const data = unwrapResult(result);
    
    expect(data).toBe('test');
  });

  it('should throw AppError for failed results', () => {
    const result: Result<string> = {
      success: false,
      error: {
        code: ServiceErrorCodes.NOT_FOUND,
        message: 'Not found',
      },
    };
    
    expect(() => unwrapResult(result)).toThrow('Not found');
  });
});

describe('isSuccess() and isFailure()', () => {
  it('should correctly identify success', () => {
    const result: Result<string> = { success: true, data: 'test' };
    
    expect(isSuccess(result)).toBe(true);
    expect(isFailure(result)).toBe(false);
  });

  it('should correctly identify failure', () => {
    const result: Result<string> = {
      success: false,
      error: { code: 'ERROR', message: 'Failed' },
    };
    
    expect(isSuccess(result)).toBe(false);
    expect(isFailure(result)).toBe(true);
  });
});
