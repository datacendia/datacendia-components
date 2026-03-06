import { logger } from '../../lib/logger';
/**
 * Library — Index
 *
 * Client-side utility library.
 *
 * @exports detectBrowserLocale, getStoredLocale, storeLocale, useI18n, useTranslation, useLocale, useFormatters, localeConfigs
 * @module lib/i18n/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - INTERNATIONALIZATION (i18n) SYSTEM
// Enterprise-grade multi-language support
// =============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

// Only English is eagerly loaded (fallback language)
import en from './locales/en.json';

// All other locales are lazy-loaded on demand to reduce main bundle size
const localeLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  es: () => import('./locales/es.json').then((m) => m.default as Record<string, unknown>),
  pt: () => import('./locales/pt.json').then((m) => m.default as Record<string, unknown>),
  fr: () => import('./locales/fr.json').then((m) => m.default as Record<string, unknown>),
  de: () => import('./locales/de.json').then((m) => m.default as Record<string, unknown>),
  it: () => import('./locales/it.json').then((m) => m.default as Record<string, unknown>),
  pl: () => import('./locales/pl.json').then((m) => m.default as Record<string, unknown>),
  tr: () => import('./locales/tr.json').then((m) => m.default as Record<string, unknown>),
  ar: () => import('./locales/ar.json').then((m) => m.default as Record<string, unknown>),
  he: () => import('./locales/he.json').then((m) => m.default as Record<string, unknown>),
  sw: () => import('./locales/sw.json').then((m) => m.default as Record<string, unknown>),
  hi: () => import('./locales/hi.json').then((m) => m.default as Record<string, unknown>),
  bn: () => import('./locales/bn.json').then((m) => m.default as Record<string, unknown>),
  ur: () => import('./locales/ur.json').then((m) => m.default as Record<string, unknown>),
  zh: () => import('./locales/zh.json').then((m) => m.default as Record<string, unknown>),
  ja: () => import('./locales/ja.json').then((m) => m.default as Record<string, unknown>),
  ko: () => import('./locales/ko.json').then((m) => m.default as Record<string, unknown>),
  id: () => import('./locales/id.json').then((m) => m.default as Record<string, unknown>),
  vi: () => import('./locales/vi.json').then((m) => m.default as Record<string, unknown>),
  th: () => import('./locales/th.json').then((m) => m.default as Record<string, unknown>),
  tl: () => import('./locales/tl.json').then((m) => m.default as Record<string, unknown>),
};

// =============================================================================
// TYPES
// =============================================================================

export type SupportedLocale =
  // The Americas
  | 'en'
  | 'es'
  | 'pt'
  // Europe
  | 'fr'
  | 'de'
  | 'it'
  | 'pl'
  | 'tr'
  // Middle East & Africa
  | 'ar'
  | 'he'
  | 'sw'
  // South Asia
  | 'hi'
  | 'bn'
  | 'ur'
  // East & Southeast Asia
  | 'zh'
  | 'ja'
  | 'ko'
  | 'id'
  | 'vi'
  | 'th'
  | 'tl';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
}

export interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatRelativeTime: (date: Date | string) => string;
  direction: 'ltr' | 'rtl';
  localeConfig: LocaleConfig;
  availableLocales: LocaleConfig[];
}

// =============================================================================
// LOCALE CONFIGURATIONS
// =============================================================================

export const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'USD' },
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    flag: '🇪🇸',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.', currency: 'EUR' },
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    flag: '🇫🇷',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: ' ', currency: 'EUR' },
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    flag: '🇩🇪',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { decimal: ',', thousands: '.', currency: 'EUR' },
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    flag: '🇯🇵',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: { decimal: '.', thousands: ',', currency: 'JPY' },
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    flag: '🇨🇳',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: { decimal: '.', thousands: ',', currency: 'CNY' },
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    flag: '🇧🇷',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.', currency: 'BRL' },
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    flag: '🇰🇷',
    dateFormat: 'YYYY.MM.DD',
    numberFormat: { decimal: '.', thousands: ',', currency: 'KRW' },
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '٫', thousands: '٬', currency: 'SAR' },
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: 'rtl',
    flag: '🇮🇱',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'ILS' },
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    flag: '🇮🇹',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.', currency: 'EUR' },
  },
  sw: {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    direction: 'ltr',
    flag: '🇰🇪',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'KES' },
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    direction: 'ltr',
    flag: '🇧🇩',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'BDT' },
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    direction: 'rtl',
    flag: '🇵🇰',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'PKR' },
  },
  id: {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    direction: 'ltr',
    flag: '🇮🇩',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.', currency: 'IDR' },
  },
  th: {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    direction: 'ltr',
    flag: '🇹🇭',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'THB' },
  },
  tl: {
    code: 'tl',
    name: 'Tagalog',
    nativeName: 'Tagalog',
    direction: 'ltr',
    flag: '🇵🇭',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'PHP' },
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    flag: '🇮🇳',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: '.', thousands: ',', currency: 'INR' },
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: 'ltr',
    flag: '🇹🇷',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { decimal: ',', thousands: '.', currency: 'TRY' },
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    direction: 'ltr',
    flag: '🇵🇱',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { decimal: ',', thousands: ' ', currency: 'PLN' },
  },
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    direction: 'ltr',
    flag: '🇻🇳',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { decimal: ',', thousands: '.', currency: 'VND' },
  },
};

// =============================================================================
// TRANSLATION DATA
// =============================================================================

// Mutable translations cache — only English is pre-loaded
const translations: Record<string, Record<string, unknown>> = {
  en,
};

/**
 * Load a locale's translations on demand. Returns cached if already loaded.
 */
async function loadLocale(locale: SupportedLocale): Promise<Record<string, unknown>> {
  if (translations[locale]) {
    return translations[locale];
  }
  const loader = localeLoaders[locale];
  if (!loader) {
    return translations.en;
  }
  try {
    const data = await loader();
    translations[locale] = data;
    return data;
  } catch (err) {
    logger.warn(`[i18n] Failed to load locale ${locale}, falling back to English`);
    return translations.en;
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Interpolate parameters into translation string
 */
function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) {
    return str;
  }

  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key]?.toString() ?? `{{${key}}}`;
  });
}

/**
 * Detect user's preferred locale from browser
 */
export function detectBrowserLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const browserLang = navigator.language.split('-')[0];
  const supportedLocales = Object.keys(localeConfigs) as SupportedLocale[];

  if (supportedLocales.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }

  return 'en';
}

/**
 * Get stored locale from localStorage
 */
export function getStoredLocale(): SupportedLocale | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem('datacendia_locale');
  if (stored && Object.keys(localeConfigs).includes(stored)) {
    return stored as SupportedLocale;
  }

  return null;
}

/**
 * Store locale preference
 */
export function storeLocale(locale: SupportedLocale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('datacendia_locale', locale);
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: SupportedLocale;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, defaultLocale }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    // Priority: stored > default > browser detection > 'en'
    return getStoredLocale() || defaultLocale || detectBrowserLocale();
  });
  const [, setLocaleReady] = useState(0);

  const localeConfig = localeConfigs[locale];

  // Lazy-load locale translations when locale changes
  useEffect(() => {
    if (locale !== 'en' && !translations[locale]) {
      loadLocale(locale).then(() => {
        // Force re-render so t() picks up the loaded translations
        setLocaleReady((n) => n + 1);
      });
    }
  }, [locale]);

  // Set HTML dir attribute for RTL support
  useEffect(() => {
    document.documentElement.dir = localeConfig.direction;
    document.documentElement.lang = locale;
  }, [locale, localeConfig.direction]);

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    storeLocale(newLocale);
  }, []);

  /**
   * Translate function
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = getNestedValue(translations[locale], key);

      if (!translation) {
        // Fallback to English
        const fallback = getNestedValue(translations.en, key);
        if (fallback) {
          return interpolate(fallback, params);
        }
        // Return key if no translation found
        logger.warn(`[i18n] Missing translation for key: ${key}`);
        return key;
      }

      return interpolate(translation, params);
    },
    [locale]
  );

  /**
   * Format number according to locale
   */
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions): string => {
      return new Intl.NumberFormat(locale, options).format(value);
    },
    [locale]
  );

  /**
   * Format currency
   */
  const formatCurrency = useCallback(
    (value: number, currency?: string): string => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || localeConfig.numberFormat.currency,
      }).format(value);
    },
    [locale, localeConfig]
  );

  /**
   * Format date
   */
  const formatDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat(locale, options).format(dateObj);
    },
    [locale]
  );

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  const formatRelativeTime = useCallback(
    (date: Date | string): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      const diffWeek = Math.floor(diffDay / 7);

      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

      if (diffSec < 60) {
        return rtf.format(-diffSec, 'second');
      }
      if (diffMin < 60) {
        return rtf.format(-diffMin, 'minute');
      }
      if (diffHour < 24) {
        return rtf.format(-diffHour, 'hour');
      }
      if (diffDay < 7) {
        return rtf.format(-diffDay, 'day');
      }
      if (diffWeek < 4) {
        return rtf.format(-diffWeek, 'week');
      }

      return formatDate(dateObj);
    },
    [locale, formatDate]
  );

  const value: I18nContextType = {
    locale,
    setLocale,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    direction: localeConfig.direction,
    localeConfig,
    availableLocales: Object.values(localeConfigs),
  };

  return React.createElement(I18nContext.Provider, { value }, children);
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access i18n context
 */
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

/**
 * Hook for translation function only
 */
export function useTranslation() {
  const { t, locale } = useI18n();
  return { t, locale };
}

/**
 * Hook for locale management
 */
export function useLocale() {
  const { locale, setLocale, availableLocales, localeConfig } = useI18n();
  return { locale, setLocale, availableLocales, localeConfig };
}

/**
 * Hook for formatting functions
 */
export function useFormatters() {
  const { formatNumber, formatCurrency, formatDate, formatRelativeTime } = useI18n();
  return { formatNumber, formatCurrency, formatDate, formatRelativeTime };
}

// =============================================================================
// EXPORTS
// =============================================================================

export { translations };
export default I18nProvider;
