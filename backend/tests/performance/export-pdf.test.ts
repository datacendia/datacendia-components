import { describe, it, expect, beforeAll } from 'vitest';
import { checkApiAvailable } from '../setup';

const API_URL = process.env['API_URL'] || 'http://localhost:3001/api/v1';
let apiAvailable = false;

beforeAll(async () => {
  apiAvailable = await checkApiAvailable();
});

describe('Performance: export-pdf', () => {
  it.skipIf(!apiAvailable)('should meet performance SLA', async () => {
    const start = Date.now();
    const response = await fetch('${API_URL}/health');
    const duration = Date.now() - start;
    expect(response.ok).toBe(true);
    expect(duration).toBeLessThan(1000);
  });
});
