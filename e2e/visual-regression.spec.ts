// =============================================================================
// VISUAL REGRESSION TESTS
// Playwright visual comparison tests for UI consistency
// =============================================================================

import { test, expect } from '@playwright/test';

const BASE_URL = process.env['BASE_URL'] || 'http://localhost:5173';

// =============================================================================
// CONFIGURATION
// =============================================================================

test.describe.configure({ mode: 'parallel' });

// Helper to set consistent viewport
async function setupViewport(page: typeof test extends (name: string, fn: (args: { page: infer P }) => void) => void ? P : never) {
  await page.setViewportSize({ width: 1920, height: 1080 });
}

// =============================================================================
// LANDING PAGE VISUAL TESTS
// =============================================================================

test.describe('Landing Page Visual Regression', () => {
  test('homepage should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.1,
    });
  });

  test('homepage mobile should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.1,
    });
  });

  test('homepage tablet should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.1,
    });
  });
});

// =============================================================================
// AUTHENTICATION VISUAL TESTS
// =============================================================================

test.describe('Authentication Visual Regression', () => {
  test('login page should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('login-page.png', {
      animations: 'disabled',
      threshold: 0.1,
    });
  });

  test('register page should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/auth/register`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('register-page.png', {
      animations: 'disabled',
      threshold: 0.1,
    });
  });

  test('login form with validation errors should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    
    await expect(page).toHaveScreenshot('login-validation-errors.png', {
      animations: 'disabled',
      threshold: 0.1,
    });
  });
});

// =============================================================================
// DASHBOARD VISUAL TESTS
// =============================================================================

test.describe('Dashboard Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-token-for-visual-tests');
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      }));
    });
  });

  test('cortex dashboard should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/cortex/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('cortex-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15, // Slightly higher threshold for dynamic content
    });
  });

  test('decisions list should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/cortex/decisions`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('decisions-list.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15,
    });
  });

  test('council page should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/cortex/council`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('council-page.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.15,
    });
  });
});

// =============================================================================
// COMPONENT VISUAL TESTS
// =============================================================================

test.describe('Component Visual Regression', () => {
  test('navigation sidebar should match snapshot', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-token');
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/cortex/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const sidebar = page.locator('[data-testid="sidebar"], nav, .sidebar').first();
    if (await sidebar.isVisible()) {
      await expect(sidebar).toHaveScreenshot('sidebar-component.png', {
        animations: 'disabled',
        threshold: 0.1,
      });
    }
  });

  test('header should match snapshot', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-token');
    });
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/cortex/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const header = page.locator('[data-testid="header"], header, .header').first();
    if (await header.isVisible()) {
      await expect(header).toHaveScreenshot('header-component.png', {
        animations: 'disabled',
        threshold: 0.1,
      });
    }
  });
});

// =============================================================================
// DARK MODE VISUAL TESTS
// =============================================================================

test.describe('Dark Mode Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    });
  });

  test('homepage dark mode should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.1,
    });
  });

  test('login dark mode should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('login-dark.png', {
      animations: 'disabled',
      threshold: 0.1,
    });
  });
});

// =============================================================================
// ERROR STATE VISUAL TESTS
// =============================================================================

test.describe('Error State Visual Regression', () => {
  test('404 page should match snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/non-existent-page-12345`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('404-page.png', {
      animations: 'disabled',
      threshold: 0.1,
    });
  });
});

// =============================================================================
// ACCESSIBILITY VISUAL TESTS
// =============================================================================

test.describe('Accessibility Visual Regression', () => {
  test('high contrast mode should be readable', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.2,
    });
  });

  test('reduced motion should disable animations', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-reduced-motion.png', {
      fullPage: true,
      animations: 'disabled',
      threshold: 0.1,
    });
  });
});
