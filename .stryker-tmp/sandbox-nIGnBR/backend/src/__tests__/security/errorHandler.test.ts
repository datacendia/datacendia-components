// @ts-nocheck
// =============================================================================
// ERROR HANDLER SECURITY TESTS
// Critical path coverage for error handling middleware
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

// Mock logger
vi.mock('../../utils/logger.js', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

import { AppError, errors, errorHandler } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TEST HELPERS
// =============================================================================

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    path: '/test',
    method: 'GET',
    ...overrides,
  } as Request;
}

function createMockResponse(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

function createMockNext(): NextFunction {
  return vi.fn();
}

// =============================================================================
// APP ERROR CLASS TESTS
// =============================================================================

describe('AppError class', () => {
  it('should create error with default values', () => {
    const error = new AppError('Test error');
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.isOperational).toBe(true);
    expect(error.details).toBeUndefined();
  });

  it('should create error with custom values', () => {
    const details = { field: 'email', reason: 'invalid' };
    const error = new AppError('Custom error', 400, 'CUSTOM_CODE', false, details);
    
    expect(error.message).toBe('Custom error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('CUSTOM_CODE');
    expect(error.isOperational).toBe(false);
    expect(error.details).toEqual(details);
  });

  it('should be instance of Error', () => {
    const error = new AppError('Test');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should capture stack trace', () => {
    const error = new AppError('Test');
    expect(error.stack).toBeDefined();
  });
});

// =============================================================================
// ERROR FACTORY FUNCTIONS TESTS
// =============================================================================

describe('error factory functions', () => {
  it('should create badRequest error', () => {
    const error = errors.badRequest('Invalid input', { field: 'name' });
    
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('BAD_REQUEST');
    expect(error.message).toBe('Invalid input');
    expect(error.details).toEqual({ field: 'name' });
  });

  it('should create unauthorized error with default message', () => {
    const error = errors.unauthorized();
    
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.message).toBe('Authentication required');
  });

  it('should create unauthorized error with custom message', () => {
    const error = errors.unauthorized('Invalid token');
    
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Invalid token');
  });

  it('should create forbidden error', () => {
    const error = errors.forbidden('Not allowed');
    
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('FORBIDDEN');
    expect(error.message).toBe('Not allowed');
  });

  it('should create notFound error', () => {
    const error = errors.notFound('User');
    
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('User not found');
  });

  it('should create notFound error with default resource', () => {
    const error = errors.notFound();
    
    expect(error.message).toBe('Resource not found');
  });

  it('should create conflict error', () => {
    const error = errors.conflict('Email already exists');
    
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe('CONFLICT');
    expect(error.message).toBe('Email already exists');
  });

  it('should create validationError', () => {
    const details = { email: ['Invalid email format'] };
    const error = errors.validationError(details);
    
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe('Validation failed');
    expect(error.details).toEqual(details);
  });

  it('should create rateLimited error', () => {
    const error = errors.rateLimited();
    
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMITED');
    expect(error.message).toBe('Too many requests');
  });

  it('should create internal error with default message', () => {
    const error = errors.internal();
    
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.message).toBe('Internal server error');
    expect(error.isOperational).toBe(false);
  });

  it('should create internal error with custom message', () => {
    const error = errors.internal('Database connection failed');
    
    expect(error.message).toBe('Database connection failed');
  });
});

// =============================================================================
// ERROR HANDLER MIDDLEWARE TESTS
// =============================================================================

describe('errorHandler middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle operational AppError', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = errors.badRequest('Invalid input');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
      },
    });
    expect(logger.warn).toHaveBeenCalled();
  });

  it('should handle non-operational AppError', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = errors.internal('Critical failure');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(logger.error).toHaveBeenCalled();
  });

  it('should include details in response when present', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = errors.validationError({ email: ['Required'] });

    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { email: ['Required'] },
      },
    });
  });

  it('should handle ZodError', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    
    // Create a real ZodError
    const schema = z.object({ email: z.string().email() });
    let zodError: ZodError;
    try {
      schema.parse({ email: 'invalid' });
    } catch (e) {
      zodError = e as ZodError;
    }

    errorHandler(zodError!, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
        }),
      })
    );
  });

  it('should handle unknown errors', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = new Error('Unknown error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(logger.error).toHaveBeenCalled();
  });

  it('should log request path and method', () => {
    const req = createMockRequest({ path: '/api/users', method: 'POST' });
    const res = createMockResponse();
    const next = createMockNext();
    const error = errors.badRequest('Test');

    errorHandler(error, req, res, next);

    expect(logger.warn).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        path: '/api/users',
        method: 'POST',
      })
    );
  });

  it('should handle error without stack trace', () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = new Error('No stack');
    delete error.stack;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
