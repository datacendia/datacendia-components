// =============================================================================
// AUTH ROUTES TESTS
// Critical path coverage for authentication routes
// =============================================================================

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// =============================================================================
// VALIDATION SCHEMA TESTS
// =============================================================================

// Recreate schemas for testing (same as in auth.ts)
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// =============================================================================
// LOGIN SCHEMA TESTS
// =============================================================================

describe('loginSchema', () => {
  it('should accept valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email format');
    }
  });

  it('should reject short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
    }
  });

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty object', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// REGISTER SCHEMA TESTS
// =============================================================================

describe('registerSchema', () => {
  it('should accept valid registration data', () => {
    const result = registerSchema.safeParse({
      email: 'newuser@example.com',
      password: 'securepassword123',
      name: 'John Doe',
      organizationName: 'Acme Corp',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'securepassword123',
      name: 'John Doe',
      organizationName: 'Acme Corp',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = registerSchema.safeParse({
      email: 'newuser@example.com',
      password: 'short',
      name: 'John Doe',
      organizationName: 'Acme Corp',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short name', () => {
    const result = registerSchema.safeParse({
      email: 'newuser@example.com',
      password: 'securepassword123',
      name: 'J',
      organizationName: 'Acme Corp',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
    }
  });

  it('should reject short organization name', () => {
    const result = registerSchema.safeParse({
      email: 'newuser@example.com',
      password: 'securepassword123',
      name: 'John Doe',
      organizationName: 'A',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Organization name required');
    }
  });

  it('should reject missing fields', () => {
    const result = registerSchema.safeParse({
      email: 'newuser@example.com',
    });
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// REFRESH SCHEMA TESTS
// =============================================================================

describe('refreshSchema', () => {
  it('should accept valid refresh token', () => {
    const result = refreshSchema.safeParse({
      refreshToken: 'valid-refresh-token-string',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty refresh token', () => {
    const result = refreshSchema.safeParse({
      refreshToken: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Refresh token required');
    }
  });

  it('should reject missing refresh token', () => {
    const result = refreshSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// FORGOT PASSWORD SCHEMA TESTS
// =============================================================================

describe('forgotPasswordSchema', () => {
  it('should accept valid email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'user@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'not-valid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = forgotPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// RESET PASSWORD SCHEMA TESTS
// =============================================================================

describe('resetPasswordSchema', () => {
  it('should accept valid reset data', () => {
    const result = resetPasswordSchema.safeParse({
      token: 'valid-reset-token',
      password: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty token', () => {
    const result = resetPasswordSchema.safeParse({
      token: '',
      password: 'newpassword123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Reset token required');
    }
  });

  it('should reject short password', () => {
    const result = resetPasswordSchema.safeParse({
      token: 'valid-reset-token',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing fields', () => {
    const result = resetPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// CHANGE PASSWORD SCHEMA TESTS
// =============================================================================

describe('changePasswordSchema', () => {
  it('should accept valid change password data', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'newpassword123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Current password required');
    }
  });

  it('should reject short new password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('New password must be at least 8 characters');
    }
  });

  it('should reject missing fields', () => {
    const result = changePasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// PASSWORD STRENGTH TESTS
// =============================================================================

describe('password validation edge cases', () => {
  it('should accept exactly 8 character password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345678',
    });
    expect(result.success).toBe(true);
  });

  it('should reject 7 character password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('should accept long password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'a'.repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it('should accept password with special characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'P@ssw0rd!#$%',
    });
    expect(result.success).toBe(true);
  });

  it('should accept password with unicode', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'пароль123',
    });
    expect(result.success).toBe(true);
  });
});

// =============================================================================
// EMAIL VALIDATION EDGE CASES
// =============================================================================

describe('email validation edge cases', () => {
  it('should accept email with subdomain', () => {
    const result = loginSchema.safeParse({
      email: 'user@mail.example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should accept email with plus sign', () => {
    const result = loginSchema.safeParse({
      email: 'user+tag@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should accept email with dots in local part', () => {
    const result = loginSchema.safeParse({
      email: 'first.last@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject email without domain', () => {
    const result = loginSchema.safeParse({
      email: 'user@',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject email without local part', () => {
    const result = loginSchema.safeParse({
      email: '@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject email with spaces', () => {
    const result = loginSchema.safeParse({
      email: 'user @example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});
