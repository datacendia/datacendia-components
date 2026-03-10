// Types extracted for maintainability

export type OmniTranslateLanguage = string;

// =============================================================================
// INTERFACES
// =============================================================================

export interface TranslationRequest {
  text: string;
  sourceLanguage?: OmniTranslateLanguage | 'auto';
  targetLanguage: OmniTranslateLanguage;
  context?: 'business' | 'technical' | 'legal' | 'medical' | 'financial' | 'general';
  preserveFormatting?: boolean;
  glossaryId?: string;
  organizationId?: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: OmniTranslateLanguage;
  targetLanguage: OmniTranslateLanguage;
  confidence: number;
  alternatives?: string[];
  detectedContext?: string;
  glossaryTermsApplied: number;
  translationTimeMs: number;
  cached: boolean;
}

export interface BatchTranslationRequest {
  texts: string[];
  sourceLanguage?: OmniTranslateLanguage | 'auto';
  targetLanguage: OmniTranslateLanguage;
  context?: string;
  organizationId?: string;
}

export interface DocumentTranslationRequest {
  documentId: string;
  documentType: 'decision' | 'report' | 'summary' | 'policy' | 'email' | 'general';
  sourceLanguage?: OmniTranslateLanguage | 'auto';
  targetLanguage: OmniTranslateLanguage;
  preserveLayout?: boolean;
  organizationId?: string;
}

export interface GlossaryTerm {
  id: string;
  sourceText: string;
  translations: Record<OmniTranslateLanguage, string>;
  context?: string;
  caseSensitive: boolean;
  organizationId: string;
}

export interface TranslationMemoryEntry {
  id: string;
  sourceText: string;
  sourceLanguage: OmniTranslateLanguage;
  targetText: string;
  targetLanguage: OmniTranslateLanguage;
  context: string;
  quality: number;
  usageCount: number;
  organizationId: string;
  createdAt: Date;
}

export interface LanguageDetectionResult {
  detectedLanguage: OmniTranslateLanguage;
  confidence: number;
  alternatives: Array<{ language: OmniTranslateLanguage; confidence: number }>;
}

// =============================================================================
// CENDIA OMNITRANSLATE SERVICE
// =============================================================================

// =============================================================================
// TRANSLATION MODEL CONFIGURATION
// =============================================================================

// Tiered model selection based on language complexity
export const TRANSLATION_MODELS = {
  // Primary model for all translations - Qwen 2.5 excels at 100+ languages
  primary: process.env.OMNITRANSLATE_MODEL || 'qwen2.5:32b',
  
  // Fallback model if primary unavailable
  fallback: process.env.OMNITRANSLATE_FALLBACK_MODEL || 'qwen2.5:14b',
  
  // Fast model for common language pairs (EN<->ES, EN<->FR, etc.)
  fast: process.env.OMNITRANSLATE_FAST_MODEL || 'qwen2.5:7b',
} as const;

// Tier 1: Common languages - can use fast model
export const TIER1_LANGUAGES = new Set([
  'en', 'es', 'fr', 'de', 'it', 'pt', 'pt-BR', 'nl', 'ru', 'zh', 'zh-TW', 'ja', 'ko', 'ar'
]);

// Tier 2: Less common but well-supported languages - use primary model
export const TIER2_LANGUAGES = new Set([
  'pl', 'uk', 'th', 'vi', 'id', 'ms', 'tl', 'hi', 'bn', 'tr', 'he', 'fa', 'sv', 'da', 
  'no', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'el', 'hr', 'sr'
]);

// Tier 3: Low-resource languages - always use primary model with enhanced prompting
// (Everything not in Tier 1 or 2)

