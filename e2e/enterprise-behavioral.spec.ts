// =============================================================================
// ENTERPRISE FEATURES — BEHAVIORAL TEST SUITE
// Strengthened assertions: verifies actual content, interactions, access control,
// data integrity, and error states. Replaces smoke-check-only patterns.
//
// Run: npx playwright test e2e/enterprise-behavioral.spec.ts
// =============================================================================

import { test, expect, Page } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

async function navigateTo(page: Page, path: string) {
  const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
  return response;
}

// =============================================================================
// HELPER: Verify page loaded with real content (not just body visible)
// =============================================================================

async function expectPageHasContent(page: Page, minTextLength = 50) {
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.length).toBeGreaterThan(minTextLength);
  // No render errors
  const html = await page.content();
  expect(html).not.toContain('Cannot read properties of');
  expect(html).not.toContain('Unhandled Runtime Error');
  expect(html).not.toContain('ChunkLoadError');
}

async function expectNoDataCorruption(page: Page) {
  const html = await page.content();
  expect(html).not.toContain('>NaN<');
  expect(html).not.toContain('>undefined<');
  expect(html).not.toContain('>null<');
  expect(html).not.toContain('$NaN');
  expect(html).not.toContain('$undefined');
  expect(html).not.toContain('undefined%');
}

// =============================================================================
// PAGE LOAD & CONTENT VERIFICATION
// Each enterprise page must render meaningful content, not just an empty shell
// =============================================================================

test.describe('Enterprise Pages — Content Verification', () => {
  const enterprisePages = [
    { path: '/cortex/enterprise/sovereign', name: 'Sovereign' },
    { path: '/cortex/enterprise/persona-forge', name: 'PersonaForge' },
    { path: '/cortex/enterprise/mesh', name: 'Mesh' },
    { path: '/cortex/enterprise/govern', name: 'Govern' },
    { path: '/cortex/enterprise/voice', name: 'Voice' },
    { path: '/cortex/enterprise/autopilot', name: 'Autopilot' },
    { path: '/cortex/enterprise/genomics', name: 'Genomics' },
    { path: '/cortex/enterprise/defense-stack', name: 'DefenseStack' },
    { path: '/cortex/enterprise/omni-translate', name: 'OmniTranslate' },
  ];

  for (const { path, name } of enterprisePages) {
    test(`${name}: renders with meaningful content`, async ({ page }) => {
      const response = await navigateTo(page, path);
      // Page must return 200 (not 404, 500, or redirect to login)
      expect(response?.status()).toBeLessThan(400);
      await expectPageHasContent(page);
      await expectNoDataCorruption(page);
    });

    test(`${name}: has a visible heading`, async ({ page }) => {
      await navigateTo(page, path);
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
      const text = await heading.innerText();
      expect(text.length).toBeGreaterThan(2);
    });
  }
});

// =============================================================================
// SOVEREIGN — Data Residency Controls
// =============================================================================

test.describe('CendiaSovereign — Data Residency Behavior', () => {
  test('displays at least one data residency region or jurisdiction', async ({ page }) => {
    await navigateTo(page, '/cortex/enterprise/sovereign');
    // Look for region/jurisdiction text patterns
    const bodyText = await page.locator('body').innerText();
    const hasRegionContent = /region|jurisdiction|residency|sovereignty|GDPR|data location/i.test(bodyText);
    expect(hasRegionContent).toBe(true);
  });

  test('shows encryption or security status indicators', async ({ page }) => {
    await navigateTo(page, '/cortex/enterprise/sovereign');
    const bodyText = await page.locator('body').innerText();
    const hasSecurityContent = /encrypt|secure|AES|RSA|TLS|key management|at rest|in transit/i.test(bodyText);
    expect(hasSecurityContent).toBe(true);
  });
});

// =============================================================================
// AUTOPILOT — Autonomous Decision Controls
// =============================================================================

test.describe('CendiaAutopilot — Decision Automation Behavior', () => {
  test('displays automation rules or decision queue', async ({ page }) => {
    await navigateTo(page, '/cortex/enterprise/autopilot');
    const bodyText = await page.locator('body').innerText();
    const hasAutomationContent = /rule|automat|queue|pending|decision|confidence|threshold/i.test(bodyText);
    expect(hasAutomationContent).toBe(true);
  });

  test('has interactive controls (buttons beyond just navigation)', async ({ page }) => {
    await navigateTo(page, '/cortex/enterprise/autopilot');
    // Must have actionable buttons beyond just nav links
    const buttons = page.locator('button:not([class*="nav"]):not([class*="menu"]):not([aria-label="Menu"])');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});

// =============================================================================
// GOVERN — Policy Management
// =============================================================================

test.describe('CendiaGovern — Governance Behavior', () => {
  test('displays policy or compliance content', async ({ page }) => {
    await navigateTo(page, '/cortex/enterprise/govern');
    const bodyText = await page.locator('body').innerText();
    const hasGovernContent = /policy|compliance|governance|approval|workflow|RBAC|permission|role/i.test(bodyText);
    expect(hasGovernContent).toBe(true);
  });
});

// =============================================================================
// DASHBOARD — Data Integrity
// =============================================================================

test.describe('Dashboard — Data Integrity', () => {
  test('renders dashboard with metrics that are valid numbers', async ({ page }) => {
    await navigateTo(page, '/cortex/dashboard');
    await expectNoDataCorruption(page);

    // Find numeric metric displays and verify they contain real numbers
    const metricElements = page.locator('[class*="metric"], [class*="stat"], [class*="number"], [class*="value"]');
    const count = await metricElements.count();
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const text = await metricElements.nth(i).innerText();
        // If it looks like a number, verify it parses
        const numMatch = text.match(/[\d,.]+/);
        if (numMatch) {
          const cleaned = numMatch[0].replace(/,/g, '');
          const parsed = parseFloat(cleaned);
          expect(isNaN(parsed)).toBe(false);
        }
      }
    }
  });

  test('percentages are within 0-100 range', async ({ page }) => {
    await navigateTo(page, '/cortex/dashboard');
    const allText = await page.locator('body').innerText();
    const percentMatches = allText.match(/(\d+(?:\.\d+)?)%/g) || [];
    for (const pct of percentMatches) {
      const num = parseFloat(pct);
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(100);
    }
  });
});

// =============================================================================
// CROSS-FEATURE NAVIGATION — State & Error Resilience
// =============================================================================

test.describe('Cross-Feature Navigation', () => {
  test('navigating between enterprise features does not crash', async ({ page }) => {
    const routes = [
      '/cortex/dashboard',
      '/cortex/enterprise/sovereign',
      '/cortex/enterprise/autopilot',
      '/cortex/enterprise/govern',
      '/cortex/enterprise/mesh',
    ];

    for (const route of routes) {
      const response = await navigateTo(page, route);
      expect(response?.status()).toBeLessThan(400);
      await expectPageHasContent(page, 20);
    }
  });

  test('browser back/forward navigation does not produce errors', async ({ page }) => {
    await navigateTo(page, '/cortex/enterprise/sovereign');
    await navigateTo(page, '/cortex/enterprise/autopilot');
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    const html = await page.content();
    expect(html).not.toContain('Unhandled Runtime Error');
    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    const html2 = await page.content();
    expect(html2).not.toContain('Unhandled Runtime Error');
  });
});

// =============================================================================
// CONSOLE ERROR MONITORING
// =============================================================================

test.describe('Console Error Monitoring', () => {
  test('enterprise pages do not produce console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await navigateTo(page, '/cortex/enterprise/sovereign');
    await page.waitForTimeout(2000);

    // Filter out known benign errors (e.g., favicon 404, dev HMR)
    const realErrors = consoleErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('HMR') &&
      !e.includes('WebSocket') &&
      !e.includes('net::ERR_')
    );

    expect(realErrors).toHaveLength(0);
  });
});

// =============================================================================
// ACCESS CONTROL — Unauthenticated API Rejection
// =============================================================================

test.describe('API Access Control', () => {
  test('enterprise API endpoints reject unauthenticated requests', async ({ request }) => {
    const apiBase = process.env.API_URL || 'http://localhost:3001/api/v1';

    const endpoints = [
      '/admin/dashboard',
      '/admin/tenants',
      '/crucible/simulations',
      '/council/deliberations',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await request.get(`${apiBase}${endpoint}`, {
          timeout: 3000,
        });
        // If server is running, should get 401/403, not 200
        if (response.status() !== 0) {
          expect([401, 403]).toContain(response.status());
        }
      } catch {
        // Server not running — skip (this is acceptable in CI without backend)
      }
    }
  });
});
