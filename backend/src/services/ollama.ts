/**
 * Service — Ollama
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports ollama
 * @module services/ollama
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// BACKWARD-COMPATIBLE INFERENCE SHIM
//
// This file re-exports the unified InferenceService as `ollama` so that
// all 45+ existing consumers continue to work without any import changes.
//
// The active backend (Ollama / NVIDIA Triton / NVIDIA NIM) is controlled by:
//   INFERENCE_PROVIDER=ollama|triton|nim   (default: ollama)
//   INFERENCE_FAILOVER=true                (auto-fallback to Ollama)
//
// New code should import from './inference/index.js' instead.
// =============================================================================

import { inference } from './inference/InferenceService.js';
import type { IInferenceProvider } from './inference/InferenceProvider.js';

// Re-export the unified service under the original name for backward compat.
// Typed as the public interface to satisfy TS export rules (no private members).
export const ollama: IInferenceProvider = inference;
export default ollama;
