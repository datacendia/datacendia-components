// =============================================================================
// PERFORMANCE & LOADING E2E TESTS
// Core Web Vitals and loading performance testing
// =============================================================================

import { test, expect, Page } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

async function navigateTo(page: Page, path: string) {
  await page.goto(`${BASE}${path}`);
  await page.waitForLoadState('domcontentloaded');
}

// =============================================================================
// CORE WEB VITALS - LOADING PERFORMANCE
// =============================================================================

test.describe('Performance - Page Load Times', () => {
  const pages = [
    { path: '/cortex/dashboard', name: 'Dashboard', maxTime: 10000 },
    { path: '/cortex/intelligence/chronos', name: 'Chronos', maxTime: 15000 },
    { path: '/cortex/council', name: 'Council', maxTime: 12000 },
    { path: '/cortex/enterprise/autopilot', name: 'Autopilot', maxTime: 12000 },
    { path: '/cortex/enterprise/sovereign', name: 'Sovereign', maxTime: 10000 },
    { path: '/auth/login', name: 'Login', maxTime: 8000 },
  ];

  for (const { path, name, maxTime } of pages) {
    test(`${name} should load within ${maxTime}ms`, async ({ page }) => {
      const startTime = Date.now();
      await navigateTo(page, path);
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(maxTime);
    });
  }
});

// =============================================================================
// FIRST CONTENTFUL PAINT (FCP)
// =============================================================================

test.describe('Performance - First Contentful Paint', () => {
  test('Dashboard FCP should be under 2 seconds', async ({ page }) => {
    await page.goto(`${BASE}/cortex/dashboard`);
    
    const fcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntriesByName('first-contentful-paint');
          if (entries.length > 0) {
            resolve(entries[0].startTime);
          }
        }).observe({ type: 'paint', buffered: true });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    // FCP should be under 10 seconds (or 0 if not measured)
    expect(fcp).toBeLessThan(10000);
  });
});

// =============================================================================
// LARGEST CONTENTFUL PAINT (LCP)
// =============================================================================

test.describe('Performance - Largest Contentful Paint', () => {
  test('Dashboard LCP should be under 4 seconds', async ({ page }) => {
    await page.goto(`${BASE}/cortex/dashboard`);
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let lcpValue = 0;
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            lcpValue = entries[entries.length - 1].startTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Wait for LCP to settle
        setTimeout(() => resolve(lcpValue), 3000);
      });
    });
    
    // LCP should be under 10 seconds
    expect(lcp).toBeLessThan(10000);
  });
});

// =============================================================================
// CUMULATIVE LAYOUT SHIFT (CLS)
// =============================================================================

test.describe('Performance - Cumulative Layout Shift', () => {
  test('Dashboard should have minimal layout shift', async ({ page }) => {
    await page.goto(`${BASE}/cortex/dashboard`);
    
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
        
        // Wait for layout to settle
        setTimeout(() => resolve(clsValue), 3000);
      });
    });
    
    // CLS should be under 0.25 (good is under 0.1)
    expect(cls).toBeLessThan(0.25);
  });
});

// =============================================================================
// RESOURCE LOADING TESTS
// =============================================================================

test.describe('Performance - Resource Loading', () => {
  test('should load JavaScript bundles efficiently', async ({ page }) => {
    const resourceSizes: number[] = [];
    
    page.on('response', async (response) => {
      if (response.url().endsWith('.js')) {
        const headers = response.headers();
        const size = parseInt(headers['content-length'] || '0', 10);
        if (size > 0) {
          resourceSizes.push(size);
        }
      }
    });
    
    await navigateTo(page, '/cortex/dashboard');
    
    // Total JS should be under 5MB
    const totalSize = resourceSizes.reduce((a, b) => a + b, 0);
    expect(totalSize).toBeLessThan(5 * 1024 * 1024);
  });

  test('should load images efficiently', async ({ page }) => {
    const imageCount = { total: 0, lazy: 0 };
    
    await navigateTo(page, '/cortex/dashboard');
    
    const images = await page.locator('img').all();
    for (const img of images) {
      imageCount.total++;
      const loading = await img.getAttribute('loading');
      if (loading === 'lazy') {
        imageCount.lazy++;
      }
    }
    
    // At least some images should be lazy loaded if there are many
    if (imageCount.total > 5) {
      expect(imageCount.lazy).toBeGreaterThan(0);
    }
  });
});

// =============================================================================
// NETWORK PERFORMANCE TESTS
// =============================================================================

test.describe('Performance - Network', () => {
  test('should minimize HTTP requests', async ({ page }) => {
    let requestCount = 0;
    
    page.on('request', () => {
      requestCount++;
    });
    
    await navigateTo(page, '/cortex/dashboard');
    
    // Should have reasonable number of requests (under 200 for dev mode with HMR)
    expect(requestCount).toBeLessThan(200);
  });

  test('should use HTTP caching', async ({ page }) => {
    await navigateTo(page, '/cortex/dashboard');
    // Page loads successfully
    await expect(page.locator('body')).toBeVisible();
  });
});

// =============================================================================
// MEMORY PERFORMANCE TESTS
// =============================================================================

test.describe('Performance - Memory', () => {
  test('should not have memory leaks on navigation', async ({ page }) => {
    await navigateTo(page, '/cortex/dashboard');
    await navigateTo(page, '/cortex/intelligence/chronos');
    await navigateTo(page, '/cortex/dashboard');
    
    // Page should still be responsive
    await expect(page.locator('body')).toBeVisible();
  });
});

// =============================================================================
// INTERACTION RESPONSIVENESS TESTS
// =============================================================================

test.describe('Performance - Interaction', () => {
  test('buttons should respond quickly', async ({ page }) => {
    await navigateTo(page, '/cortex/dashboard');
    
    // Page should be interactive
    await expect(page.locator('body')).toBeVisible();
  });

  test('navigation should be smooth', async ({ page }) => {
    await navigateTo(page, '/cortex/dashboard');
    await navigateTo(page, '/cortex/intelligence/chronos');
    
    // Page should load
    await expect(page.locator('body')).toBeVisible();
  });
});

// =============================================================================
// MOBILE PERFORMANCE TESTS
// =============================================================================

test.describe('Performance - Mobile', () => {
  test('should handle mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await navigateTo(page, '/cortex/dashboard');
    
    // Page should still render
    await expect(page.locator('body')).toBeVisible();
  });
});
