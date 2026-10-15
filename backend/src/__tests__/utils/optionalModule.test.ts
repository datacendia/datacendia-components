// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Optional Enterprise Modules — Unit Tests
 * Community files load enterprise code through optionalModule(): a module that
 * isn't installed resolves to null, and any other load error still throws.
 */

import { describe, it, expect } from 'vitest';
import { optionalModule, loadSovereignMode } from '../../utils/optionalModule.js';

const notInstalled = () =>
  Object.assign(new Error("Cannot find module '../services/sovereign/SovereignModeService.js'"), {
    code: 'ERR_MODULE_NOT_FOUND',
  });

describe('optionalModule', () => {
  it('returns the module when it loads', async () => {
    await expect(optionalModule(async () => ({ value: 42 }))).resolves.toEqual({ value: 42 });
  });

  it('returns null when the module is not installed', async () => {
    await expect(optionalModule(() => Promise.reject(notInstalled()))).resolves.toBeNull();
  });

  it('rethrows any other load error', async () => {
    const broken = new Error('SyntaxError in an enterprise module');

    await expect(optionalModule(() => Promise.reject(broken))).rejects.toBe(broken);
  });
});

describe('loadSovereignMode', () => {
  it('loads the sovereign service in the enterprise edition, once', async () => {
    const first = await loadSovereignMode();

    expect(first?.getStatus()).toHaveProperty('onlineMode');
    expect(await loadSovereignMode()).toBe(first);
  });
});
