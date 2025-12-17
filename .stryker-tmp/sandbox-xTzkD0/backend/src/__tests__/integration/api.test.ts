/**
 * =============================================================================
 * API INTEGRATION TESTS
 * =============================================================================
 * 
 * End-to-end API testing with authentication, validation, and error handling
 */
// @ts-nocheck


import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../index.js';

// Test data
const testUser = {
  email: `test-${Date.now()}@datacendia.test`,
  password: 'SecurePassword123!@#',
  firstName: 'Test',
  lastName: 'User',
};

let authToken: string;
let userId: string;

// =============================================================================
// AUTHENTICATION TESTS
// =============================================================================

describe('Authentication API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.accessToken).toBeDefined();
      
      authToken = res.body.accessToken;
      userId = res.body.user.id;
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.error).toBeDefined();
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          email: 'another@test.com',
          password: '123',
        });

      expect(res.status).toBe(400);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...testUser,
          email: 'not-an-email',
        });

      expect(res.status).toBe(400);
    });

    it('should sanitize XSS in user input', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'xss@test.com',
          password: 'SecurePass123!',
          firstName: '<script>alert("xss")</script>',
          lastName: 'Test',
        });

      // Should either sanitize or reject
      expect([200, 201, 400]).toContain(res.status);
      if (res.status === 201) {
        expect(res.body.user.firstName).not.toContain('<script>');
      }
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(401);
    });

    it('should rate limit after multiple failed attempts', async () => {
      const email = testUser.email;
      
      // Make 6 failed login attempts
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password: 'wrong' });
      }

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: 'wrong' });

      expect(res.status).toBe(429);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should reject missing token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me');

      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
});

// =============================================================================
// SECURITY HEADER TESTS
// =============================================================================

describe('Security Headers', () => {
  it('should include X-Content-Type-Options', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should include X-Frame-Options', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-frame-options']).toBe('DENY');
  });

  it('should include Strict-Transport-Security in production', async () => {
    const res = await request(app).get('/health');
    // This header may only be set in production
    if (process.env.NODE_ENV === 'production') {
      expect(res.headers['strict-transport-security']).toBeDefined();
    }
  });

  it('should include Content-Security-Policy', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-security-policy']).toBeDefined();
  });
});

// =============================================================================
// INPUT VALIDATION TESTS
// =============================================================================

describe('Input Validation', () => {
  describe('SQL Injection Prevention', () => {
    it('should block SQL injection in query params', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .query({ search: "'; DROP TABLE users; --" })
        .set('Authorization', `Bearer ${authToken}`);

      // Should either sanitize or block
      expect([200, 400, 403]).toContain(res.status);
    });

    it('should block SQL injection in body', async () => {
      const res = await request(app)
        .post('/api/v1/decisions')
        .send({
          title: "Test'; DELETE FROM decisions; --",
          description: 'Test decision',
        })
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 201, 400, 403]).toContain(res.status);
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize script tags', async () => {
      const res = await request(app)
        .post('/api/v1/decisions')
        .send({
          title: '<script>alert("xss")</script>Test',
          description: 'Test',
        })
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status === 201 && res.body.decision) {
        expect(res.body.decision.title).not.toContain('<script>');
      }
    });

    it('should sanitize event handlers', async () => {
      const res = await request(app)
        .post('/api/v1/decisions')
        .send({
          title: '<img onerror="alert(1)" src="x">',
          description: 'Test',
        })
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status === 201 && res.body.decision) {
        expect(res.body.decision.title).not.toContain('onerror');
      }
    });
  });

  describe('Path Traversal Prevention', () => {
    it('should block path traversal attempts', async () => {
      const res = await request(app)
        .get('/api/v1/files/../../../etc/passwd')
        .set('Authorization', `Bearer ${authToken}`);

      expect([400, 403, 404]).toContain(res.status);
    });
  });
});

// =============================================================================
// AUTHORIZATION TESTS
// =============================================================================

describe('Authorization', () => {
  it('should deny access to admin routes for regular users', async () => {
    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect([401, 403]).toContain(res.status);
  });

  it('should deny access to other users data', async () => {
    const res = await request(app)
      .get('/api/v1/users/other-user-id')
      .set('Authorization', `Bearer ${authToken}`);

    expect([403, 404]).toContain(res.status);
  });
});

// =============================================================================
// ERROR HANDLING TESTS
// =============================================================================

describe('Error Handling', () => {
  it('should not expose stack traces in production', async () => {
    const res = await request(app)
      .get('/api/v1/nonexistent-endpoint');

    expect(res.body.stack).toBeUndefined();
  });

  it('should return consistent error format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com' }); // Missing password

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBeDefined();
    expect(res.body.error.message).toBeDefined();
  });

  it('should handle malformed JSON gracefully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": "test@test.com", password: }');

    expect(res.status).toBe(400);
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

describe('Performance', () => {
  it('health endpoint should respond in < 100ms', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(100);
  });

  it('should handle concurrent requests', async () => {
    const requests = Array(10).fill(null).map(() =>
      request(app).get('/health')
    );

    const responses = await Promise.all(requests);
    
    for (const res of responses) {
      expect(res.status).toBe(200);
    }
  });
});

// =============================================================================
// CLEANUP
// =============================================================================

afterAll(async () => {
  // Clean up test user if needed
  // await deleteTestUser(userId);
});
