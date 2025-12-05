/**
 * DATACENDIA TEST SETUP
 * Global test configuration and utilities
 */

import { beforeAll, afterAll } from 'vitest';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Test database client
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Test user credentials (from seed.ts)
export const TEST_USERS = {
  admin: {
    email: 'admin@datacendia.com',
    password: 'DatacendiaAdmin2024!',
  },
  viewer: {
    email: 'admin@datacendia.com', // Same user for now
    password: 'DatacendiaAdmin2024!',
  },
};

// API base URL
export const API_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

// Helper to get auth token
export async function getAuthToken(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data.accessToken;
}

// Helper to make authenticated requests
export async function authFetch(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
}

// Cleanup function
export async function cleanup() {
  await prisma.$disconnect();
}

// Global test hooks
export function setupTestHooks() {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await cleanup();
  });
}
