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

// API base URL - backend runs on port 3001, not 3000
export const API_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

// Check if API is available
export async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, { 
      signal: AbortSignal.timeout(2000) 
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Cached API availability status
let _apiAvailable: boolean | null = null;
export async function checkApiAvailable(): Promise<boolean> {
  if (_apiAvailable === null) {
    _apiAvailable = await isApiAvailable();
  }
  return _apiAvailable;
}

// Helper to get auth token (returns empty string if API unavailable)
export async function getAuthToken(email: string, password: string): Promise<string> {
  try {
    const available = await checkApiAvailable();
    if (!available) {
      return '';
    }
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) {
      return '';
    }
    
    const data = await response.json();
    return data.data?.accessToken || '';
  } catch {
    return '';
  }
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
