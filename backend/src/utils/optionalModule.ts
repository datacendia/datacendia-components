// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Optional Enterprise Modules
 *
 * Community files must not import enterprise code statically
 * (scripts/check-community-boundary.mjs). They load it through here instead:
 * a module that isn't installed resolves to null, so the community edition
 * builds and runs without it. Any other load error still throws, so a broken
 * enterprise build fails loudly instead of quietly losing a feature.
 *
 * @exports optionalModule, loadSovereignMode
 * @module utils/optionalModule
 */

/** Resolve a dynamic import, or null when the module isn't installed. */
export async function optionalModule<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load();
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw err;
  }
}

type SovereignMode = (typeof import('../services/sovereign/SovereignModeService.js'))['sovereignMode'];

let sovereignMode: Promise<SovereignMode | null> | undefined;

/** Sovereign mode (enterprise edition), or null in the community edition. */
export function loadSovereignMode(): Promise<SovereignMode | null> {
  if (!sovereignMode) {
    sovereignMode = optionalModule(() => import('../services/sovereign/SovereignModeService.js'))
      .then((mod) => mod?.sovereignMode ?? null);
  }
  return sovereignMode;
}
