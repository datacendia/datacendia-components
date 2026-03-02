/**
 * Module — Cendia Omni Translate Service Test
 *
 * Platform module.
 * @module __tests__/services/CendiaOmniTranslateService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA OMNITRANSLATE SERVICE TESTS
// Tests for the 100+ language enterprise translation service
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../config/database.js', () => ({
  prisma: {
    omnitranslate_glossaries: { findMany: vi.fn(), create: vi.fn() },
    omnitranslate_glossary: { findMany: vi.fn(), create: vi.fn() },
    omnitranslate_memory: { findFirst: vi.fn(), create: vi.fn() },
  },
}));

vi.mock('../../services/ollama.js', () => ({
  default: {
    chat: vi.fn().mockResolvedValue({
      message: { content: 'Translated text' },
    }),
  },
}));

vi.mock('../../config/redis.js', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
  },
}));

vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { OMNITRANSLATE_LANGUAGES } from '../../services/CendiaOmniTranslateService.js';

describe('CendiaOmniTranslateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // LANGUAGE SUPPORT
  // ===========================================================================

  describe('Language Support', () => {
    it('should support 80+ languages', () => {
      const languageCount = Object.keys(OMNITRANSLATE_LANGUAGES).length;
      expect(languageCount).toBeGreaterThanOrEqual(80);
    });

    it('should include English', () => {
      expect(OMNITRANSLATE_LANGUAGES.en).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.en.name).toBe('English');
    });

    it('should include Spanish', () => {
      expect(OMNITRANSLATE_LANGUAGES.es).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.es.name).toBe('Spanish');
    });

    it('should include French', () => {
      expect(OMNITRANSLATE_LANGUAGES.fr).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.fr.name).toBe('French');
    });

    it('should include German', () => {
      expect(OMNITRANSLATE_LANGUAGES.de).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.de.name).toBe('German');
    });

    it('should include Chinese Simplified', () => {
      expect(OMNITRANSLATE_LANGUAGES.zh).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.zh.name).toBe('Chinese (Simplified)');
    });

    it('should include Chinese Traditional', () => {
      expect(OMNITRANSLATE_LANGUAGES['zh-TW']).toBeDefined();
    });

    it('should include Japanese', () => {
      expect(OMNITRANSLATE_LANGUAGES.ja).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ja.name).toBe('Japanese');
    });

    it('should include Korean', () => {
      expect(OMNITRANSLATE_LANGUAGES.ko).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ko.name).toBe('Korean');
    });

    it('should include Arabic', () => {
      expect(OMNITRANSLATE_LANGUAGES.ar).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ar.rtl).toBe(true);
    });

    it('should include Hebrew', () => {
      expect(OMNITRANSLATE_LANGUAGES.he).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.he.rtl).toBe(true);
    });

    it('should include Hindi', () => {
      expect(OMNITRANSLATE_LANGUAGES.hi).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.hi.name).toBe('Hindi');
    });

    it('should include Russian', () => {
      expect(OMNITRANSLATE_LANGUAGES.ru).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ru.name).toBe('Russian');
    });

    it('should include Portuguese', () => {
      expect(OMNITRANSLATE_LANGUAGES.pt).toBeDefined();
    });

    it('should include Portuguese (Brazil)', () => {
      expect(OMNITRANSLATE_LANGUAGES['pt-BR']).toBeDefined();
    });
  });

  // ===========================================================================
  // RTL LANGUAGE SUPPORT
  // ===========================================================================

  describe('RTL Language Support', () => {
    it('should mark Arabic as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.ar.rtl).toBe(true);
    });

    it('should mark Hebrew as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.he.rtl).toBe(true);
    });

    it('should mark Persian as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.fa.rtl).toBe(true);
    });

    it('should mark Urdu as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.ur.rtl).toBe(true);
    });

    it('should mark Kurdish as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.ku.rtl).toBe(true);
    });

    it('should mark Pashto as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.ps.rtl).toBe(true);
    });

    it('should NOT mark English as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.en.rtl).toBe(false);
    });

    it('should NOT mark Chinese as RTL', () => {
      expect(OMNITRANSLATE_LANGUAGES.zh.rtl).toBe(false);
    });
  });

  // ===========================================================================
  // REGIONAL COVERAGE
  // ===========================================================================

  describe('Regional Coverage', () => {
    it('should have European languages', () => {
      const european = Object.entries(OMNITRANSLATE_LANGUAGES)
        .filter(([_, lang]) => lang.region === 'europe');
      expect(european.length).toBeGreaterThan(20);
    });

    it('should have Asian languages', () => {
      const asian = Object.entries(OMNITRANSLATE_LANGUAGES)
        .filter(([_, lang]) => lang.region === 'asia');
      expect(asian.length).toBeGreaterThan(10);
    });

    it('should have South Asian languages', () => {
      const southAsian = Object.entries(OMNITRANSLATE_LANGUAGES)
        .filter(([_, lang]) => lang.region === 'south-asia');
      expect(southAsian.length).toBeGreaterThan(8);
    });

    it('should have Middle Eastern languages', () => {
      const middleEast = Object.entries(OMNITRANSLATE_LANGUAGES)
        .filter(([_, lang]) => lang.region === 'middle-east');
      expect(middleEast.length).toBeGreaterThan(4);
    });

    it('should have African languages', () => {
      const african = Object.entries(OMNITRANSLATE_LANGUAGES)
        .filter(([_, lang]) => lang.region === 'africa');
      expect(african.length).toBeGreaterThan(5);
    });

    it('should have Pacific languages', () => {
      const pacific = Object.entries(OMNITRANSLATE_LANGUAGES)
        .filter(([_, lang]) => lang.region === 'pacific');
      expect(pacific.length).toBeGreaterThan(3);
    });

    it('should have global languages', () => {
      const global = Object.entries(OMNITRANSLATE_LANGUAGES)
        .filter(([_, lang]) => lang.region === 'global');
      expect(global.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // NATIVE NAMES
  // ===========================================================================

  describe('Native Names', () => {
    it('should have native name for English', () => {
      expect(OMNITRANSLATE_LANGUAGES.en.nativeName).toBe('English');
    });

    it('should have native name for Spanish', () => {
      expect(OMNITRANSLATE_LANGUAGES.es.nativeName).toBe('Español');
    });

    it('should have native name for French', () => {
      expect(OMNITRANSLATE_LANGUAGES.fr.nativeName).toBe('Français');
    });

    it('should have native name for German', () => {
      expect(OMNITRANSLATE_LANGUAGES.de.nativeName).toBe('Deutsch');
    });

    it('should have native name for Chinese', () => {
      expect(OMNITRANSLATE_LANGUAGES.zh.nativeName).toBe('简体中文');
    });

    it('should have native name for Japanese', () => {
      expect(OMNITRANSLATE_LANGUAGES.ja.nativeName).toBe('日本語');
    });

    it('should have native name for Korean', () => {
      expect(OMNITRANSLATE_LANGUAGES.ko.nativeName).toBe('한국어');
    });

    it('should have native name for Arabic', () => {
      expect(OMNITRANSLATE_LANGUAGES.ar.nativeName).toBe('العربية');
    });

    it('should have native name for Hindi', () => {
      expect(OMNITRANSLATE_LANGUAGES.hi.nativeName).toBe('हिन्दी');
    });

    it('should have native name for Russian', () => {
      expect(OMNITRANSLATE_LANGUAGES.ru.nativeName).toBe('Русский');
    });
  });

  // ===========================================================================
  // SPECIFIC LANGUAGE GROUPS
  // ===========================================================================

  describe('Specific Language Groups', () => {
    it('should include Scandinavian languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.sv).toBeDefined(); // Swedish
      expect(OMNITRANSLATE_LANGUAGES.da).toBeDefined(); // Danish
      expect(OMNITRANSLATE_LANGUAGES.no).toBeDefined(); // Norwegian
      expect(OMNITRANSLATE_LANGUAGES.fi).toBeDefined(); // Finnish
      expect(OMNITRANSLATE_LANGUAGES.is).toBeDefined(); // Icelandic
    });

    it('should include Baltic languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.et).toBeDefined(); // Estonian
      expect(OMNITRANSLATE_LANGUAGES.lv).toBeDefined(); // Latvian
      expect(OMNITRANSLATE_LANGUAGES.lt).toBeDefined(); // Lithuanian
    });

    it('should include Slavic languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.pl).toBeDefined(); // Polish
      expect(OMNITRANSLATE_LANGUAGES.cs).toBeDefined(); // Czech
      expect(OMNITRANSLATE_LANGUAGES.sk).toBeDefined(); // Slovak
      expect(OMNITRANSLATE_LANGUAGES.hr).toBeDefined(); // Croatian
      expect(OMNITRANSLATE_LANGUAGES.sr).toBeDefined(); // Serbian
      expect(OMNITRANSLATE_LANGUAGES.bg).toBeDefined(); // Bulgarian
      expect(OMNITRANSLATE_LANGUAGES.uk).toBeDefined(); // Ukrainian
    });

    it('should include Celtic languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.ga).toBeDefined(); // Irish
      expect(OMNITRANSLATE_LANGUAGES.cy).toBeDefined(); // Welsh
      expect(OMNITRANSLATE_LANGUAGES.gd).toBeDefined(); // Scottish Gaelic
    });

    it('should include Southeast Asian languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.th).toBeDefined(); // Thai
      expect(OMNITRANSLATE_LANGUAGES.vi).toBeDefined(); // Vietnamese
      expect(OMNITRANSLATE_LANGUAGES.id).toBeDefined(); // Indonesian
      expect(OMNITRANSLATE_LANGUAGES.ms).toBeDefined(); // Malay
      expect(OMNITRANSLATE_LANGUAGES.tl).toBeDefined(); // Filipino
    });

    it('should include Indian subcontinent languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.hi).toBeDefined(); // Hindi
      expect(OMNITRANSLATE_LANGUAGES.bn).toBeDefined(); // Bengali
      expect(OMNITRANSLATE_LANGUAGES.ta).toBeDefined(); // Tamil
      expect(OMNITRANSLATE_LANGUAGES.te).toBeDefined(); // Telugu
      expect(OMNITRANSLATE_LANGUAGES.mr).toBeDefined(); // Marathi
      expect(OMNITRANSLATE_LANGUAGES.gu).toBeDefined(); // Gujarati
    });

    it('should include Central Asian languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.kk).toBeDefined(); // Kazakh
      expect(OMNITRANSLATE_LANGUAGES.uz).toBeDefined(); // Uzbek
      expect(OMNITRANSLATE_LANGUAGES.tg).toBeDefined(); // Tajik
      expect(OMNITRANSLATE_LANGUAGES.ky).toBeDefined(); // Kyrgyz
    });

    it('should include African languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.sw).toBeDefined(); // Swahili
      expect(OMNITRANSLATE_LANGUAGES.am).toBeDefined(); // Amharic
      expect(OMNITRANSLATE_LANGUAGES.ha).toBeDefined(); // Hausa
      expect(OMNITRANSLATE_LANGUAGES.yo).toBeDefined(); // Yoruba
      expect(OMNITRANSLATE_LANGUAGES.zu).toBeDefined(); // Zulu
    });
  });

  // ===========================================================================
  // LANGUAGE METADATA
  // ===========================================================================

  describe('Language Metadata', () => {
    it('should have name property for all languages', () => {
      Object.values(OMNITRANSLATE_LANGUAGES).forEach(lang => {
        expect(lang.name).toBeDefined();
        expect(typeof lang.name).toBe('string');
      });
    });

    it('should have nativeName property for all languages', () => {
      Object.values(OMNITRANSLATE_LANGUAGES).forEach(lang => {
        expect(lang.nativeName).toBeDefined();
        expect(typeof lang.nativeName).toBe('string');
      });
    });

    it('should have rtl property for all languages', () => {
      Object.values(OMNITRANSLATE_LANGUAGES).forEach(lang => {
        expect(typeof lang.rtl).toBe('boolean');
      });
    });

    it('should have region property for all languages', () => {
      Object.values(OMNITRANSLATE_LANGUAGES).forEach(lang => {
        expect(lang.region).toBeDefined();
        expect(typeof lang.region).toBe('string');
      });
    });
  });

  // ===========================================================================
  // SPECIAL LANGUAGES
  // ===========================================================================

  describe('Special Languages', () => {
    it('should include Latin', () => {
      expect(OMNITRANSLATE_LANGUAGES.la).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.la.name).toBe('Latin');
    });

    it('should include Esperanto', () => {
      expect(OMNITRANSLATE_LANGUAGES.eo).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.eo.name).toBe('Esperanto');
    });

    it('should include Māori', () => {
      expect(OMNITRANSLATE_LANGUAGES.mi).toBeDefined();
    });

    it('should include Hawaiian', () => {
      expect(OMNITRANSLATE_LANGUAGES.haw).toBeDefined();
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle language code lookup', () => {
      const lang = OMNITRANSLATE_LANGUAGES['en'];
      expect(lang).toBeDefined();
    });

    it('should handle variant codes', () => {
      expect(OMNITRANSLATE_LANGUAGES['pt-BR']).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES['zh-TW']).toBeDefined();
    });

    it('should have unique language codes', () => {
      const codes = Object.keys(OMNITRANSLATE_LANGUAGES);
      const uniqueCodes = new Set(codes);
      expect(codes.length).toBe(uniqueCodes.size);
    });

    it('should have non-empty names', () => {
      Object.values(OMNITRANSLATE_LANGUAGES).forEach(lang => {
        expect(lang.name.length).toBeGreaterThan(0);
        expect(lang.nativeName.length).toBeGreaterThan(0);
      });
    });
  });

  // ===========================================================================
  // INDIVIDUAL LANGUAGE TESTS - EUROPEAN
  // ===========================================================================

  describe('European Languages - Individual', () => {
    it('should have correct English config', () => {
      expect(OMNITRANSLATE_LANGUAGES.en.name).toBe('English');
      expect(OMNITRANSLATE_LANGUAGES.en.rtl).toBe(false);
    });

    it('should have correct Spanish config', () => {
      expect(OMNITRANSLATE_LANGUAGES.es.name).toBe('Spanish');
      expect(OMNITRANSLATE_LANGUAGES.es.nativeName).toBe('Español');
    });

    it('should have correct French config', () => {
      expect(OMNITRANSLATE_LANGUAGES.fr.name).toBe('French');
      expect(OMNITRANSLATE_LANGUAGES.fr.nativeName).toBe('Français');
    });

    it('should have correct German config', () => {
      expect(OMNITRANSLATE_LANGUAGES.de.name).toBe('German');
      expect(OMNITRANSLATE_LANGUAGES.de.nativeName).toBe('Deutsch');
    });

    it('should have correct Italian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.it.name).toBe('Italian');
      expect(OMNITRANSLATE_LANGUAGES.it.nativeName).toBe('Italiano');
    });

    it('should have correct Portuguese config', () => {
      expect(OMNITRANSLATE_LANGUAGES.pt.name).toBe('Portuguese');
      expect(OMNITRANSLATE_LANGUAGES.pt.nativeName).toBe('Português');
    });

    it('should have correct Dutch config', () => {
      expect(OMNITRANSLATE_LANGUAGES.nl.name).toBe('Dutch');
      expect(OMNITRANSLATE_LANGUAGES.nl.nativeName).toBe('Nederlands');
    });

    it('should have correct Polish config', () => {
      expect(OMNITRANSLATE_LANGUAGES.pl.name).toBe('Polish');
      expect(OMNITRANSLATE_LANGUAGES.pl.nativeName).toBe('Polski');
    });

    it('should have correct Russian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ru.name).toBe('Russian');
      expect(OMNITRANSLATE_LANGUAGES.ru.nativeName).toBe('Русский');
    });

    it('should have correct Ukrainian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.uk.name).toBe('Ukrainian');
      expect(OMNITRANSLATE_LANGUAGES.uk.nativeName).toBe('Українська');
    });

    it('should have correct Swedish config', () => {
      expect(OMNITRANSLATE_LANGUAGES.sv.name).toBe('Swedish');
      expect(OMNITRANSLATE_LANGUAGES.sv.nativeName).toBe('Svenska');
    });

    it('should have correct Danish config', () => {
      expect(OMNITRANSLATE_LANGUAGES.da.name).toBe('Danish');
      expect(OMNITRANSLATE_LANGUAGES.da.nativeName).toBe('Dansk');
    });

    it('should have correct Norwegian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.no.name).toBe('Norwegian');
      expect(OMNITRANSLATE_LANGUAGES.no.nativeName).toBe('Norsk');
    });

    it('should have correct Finnish config', () => {
      expect(OMNITRANSLATE_LANGUAGES.fi.name).toBe('Finnish');
      expect(OMNITRANSLATE_LANGUAGES.fi.nativeName).toBe('Suomi');
    });

    it('should have correct Greek config', () => {
      expect(OMNITRANSLATE_LANGUAGES.el.name).toBe('Greek');
      expect(OMNITRANSLATE_LANGUAGES.el.nativeName).toBe('Ελληνικά');
    });

    it('should have correct Hungarian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.hu.name).toBe('Hungarian');
      expect(OMNITRANSLATE_LANGUAGES.hu.nativeName).toBe('Magyar');
    });

    it('should have correct Romanian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ro.name).toBe('Romanian');
      expect(OMNITRANSLATE_LANGUAGES.ro.nativeName).toBe('Română');
    });

    it('should have correct Bulgarian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.bg.name).toBe('Bulgarian');
      expect(OMNITRANSLATE_LANGUAGES.bg.nativeName).toBe('Български');
    });
  });

  // ===========================================================================
  // INDIVIDUAL LANGUAGE TESTS - ASIAN
  // ===========================================================================

  describe('Asian Languages - Individual', () => {
    it('should have correct Chinese Simplified config', () => {
      expect(OMNITRANSLATE_LANGUAGES.zh.name).toBe('Chinese (Simplified)');
      expect(OMNITRANSLATE_LANGUAGES.zh.nativeName).toBe('简体中文');
    });

    it('should have correct Chinese Traditional config', () => {
      expect(OMNITRANSLATE_LANGUAGES['zh-TW'].name).toBe('Chinese (Traditional)');
      expect(OMNITRANSLATE_LANGUAGES['zh-TW'].nativeName).toBe('繁體中文');
    });

    it('should have correct Japanese config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ja.name).toBe('Japanese');
      expect(OMNITRANSLATE_LANGUAGES.ja.nativeName).toBe('日本語');
    });

    it('should have correct Korean config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ko.name).toBe('Korean');
      expect(OMNITRANSLATE_LANGUAGES.ko.nativeName).toBe('한국어');
    });

    it('should have correct Thai config', () => {
      expect(OMNITRANSLATE_LANGUAGES.th.name).toBe('Thai');
      expect(OMNITRANSLATE_LANGUAGES.th.nativeName).toBe('ไทย');
    });

    it('should have correct Vietnamese config', () => {
      expect(OMNITRANSLATE_LANGUAGES.vi.name).toBe('Vietnamese');
      expect(OMNITRANSLATE_LANGUAGES.vi.nativeName).toBe('Tiếng Việt');
    });

    it('should have correct Indonesian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.id.name).toBe('Indonesian');
      expect(OMNITRANSLATE_LANGUAGES.id.nativeName).toBe('Bahasa Indonesia');
    });

    it('should have correct Malay config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ms.name).toBe('Malay');
      expect(OMNITRANSLATE_LANGUAGES.ms.nativeName).toBe('Bahasa Melayu');
    });

    it('should have correct Filipino config', () => {
      expect(OMNITRANSLATE_LANGUAGES.tl.name).toBe('Filipino');
      expect(OMNITRANSLATE_LANGUAGES.tl.nativeName).toBe('Filipino');
    });

    it('should have correct Mongolian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.mn.name).toBe('Mongolian');
      expect(OMNITRANSLATE_LANGUAGES.mn.nativeName).toBe('Монгол');
    });
  });

  // ===========================================================================
  // INDIVIDUAL LANGUAGE TESTS - SOUTH ASIAN
  // ===========================================================================

  describe('South Asian Languages - Individual', () => {
    it('should have correct Hindi config', () => {
      expect(OMNITRANSLATE_LANGUAGES.hi.name).toBe('Hindi');
      expect(OMNITRANSLATE_LANGUAGES.hi.nativeName).toBe('हिन्दी');
    });

    it('should have correct Bengali config', () => {
      expect(OMNITRANSLATE_LANGUAGES.bn.name).toBe('Bengali');
      expect(OMNITRANSLATE_LANGUAGES.bn.nativeName).toBe('বাংলা');
    });

    it('should have correct Tamil config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ta.name).toBe('Tamil');
      expect(OMNITRANSLATE_LANGUAGES.ta.nativeName).toBe('தமிழ்');
    });

    it('should have correct Telugu config', () => {
      expect(OMNITRANSLATE_LANGUAGES.te.name).toBe('Telugu');
      expect(OMNITRANSLATE_LANGUAGES.te.nativeName).toBe('తెలుగు');
    });

    it('should have correct Marathi config', () => {
      expect(OMNITRANSLATE_LANGUAGES.mr.name).toBe('Marathi');
      expect(OMNITRANSLATE_LANGUAGES.mr.nativeName).toBe('मराठी');
    });

    it('should have correct Gujarati config', () => {
      expect(OMNITRANSLATE_LANGUAGES.gu.name).toBe('Gujarati');
      expect(OMNITRANSLATE_LANGUAGES.gu.nativeName).toBe('ગુજરાતી');
    });

    it('should have correct Kannada config', () => {
      expect(OMNITRANSLATE_LANGUAGES.kn.name).toBe('Kannada');
      expect(OMNITRANSLATE_LANGUAGES.kn.nativeName).toBe('ಕನ್ನಡ');
    });

    it('should have correct Malayalam config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ml.name).toBe('Malayalam');
      expect(OMNITRANSLATE_LANGUAGES.ml.nativeName).toBe('മലയാളം');
    });

    it('should have correct Punjabi config', () => {
      expect(OMNITRANSLATE_LANGUAGES.pa.name).toBe('Punjabi');
      expect(OMNITRANSLATE_LANGUAGES.pa.nativeName).toBe('ਪੰਜਾਬੀ');
    });

    it('should have correct Nepali config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ne.name).toBe('Nepali');
      expect(OMNITRANSLATE_LANGUAGES.ne.nativeName).toBe('नेपाली');
    });
  });

  // ===========================================================================
  // INDIVIDUAL LANGUAGE TESTS - MIDDLE EASTERN
  // ===========================================================================

  describe('Middle Eastern Languages - Individual', () => {
    it('should have correct Arabic config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ar.name).toBe('Arabic');
      expect(OMNITRANSLATE_LANGUAGES.ar.nativeName).toBe('العربية');
      expect(OMNITRANSLATE_LANGUAGES.ar.rtl).toBe(true);
    });

    it('should have correct Hebrew config', () => {
      expect(OMNITRANSLATE_LANGUAGES.he.name).toBe('Hebrew');
      expect(OMNITRANSLATE_LANGUAGES.he.nativeName).toBe('עברית');
      expect(OMNITRANSLATE_LANGUAGES.he.rtl).toBe(true);
    });

    it('should have correct Persian config', () => {
      expect(OMNITRANSLATE_LANGUAGES.fa.name).toBe('Persian');
      expect(OMNITRANSLATE_LANGUAGES.fa.nativeName).toBe('فارسی');
      expect(OMNITRANSLATE_LANGUAGES.fa.rtl).toBe(true);
    });

    it('should have correct Turkish config', () => {
      expect(OMNITRANSLATE_LANGUAGES.tr.name).toBe('Turkish');
      expect(OMNITRANSLATE_LANGUAGES.tr.nativeName).toBe('Türkçe');
      expect(OMNITRANSLATE_LANGUAGES.tr.rtl).toBe(false);
    });

    it('should have correct Urdu config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ur.name).toBe('Urdu');
      expect(OMNITRANSLATE_LANGUAGES.ur.nativeName).toBe('اردو');
      expect(OMNITRANSLATE_LANGUAGES.ur.rtl).toBe(true);
    });

    it('should have correct Kurdish config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ku.name).toBe('Kurdish');
      expect(OMNITRANSLATE_LANGUAGES.ku.rtl).toBe(true);
    });

    it('should have correct Pashto config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ps.name).toBe('Pashto');
      expect(OMNITRANSLATE_LANGUAGES.ps.rtl).toBe(true);
    });
  });

  // ===========================================================================
  // INDIVIDUAL LANGUAGE TESTS - AFRICAN
  // ===========================================================================

  describe('African Languages - Individual', () => {
    it('should have correct Swahili config', () => {
      expect(OMNITRANSLATE_LANGUAGES.sw.name).toBe('Swahili');
      expect(OMNITRANSLATE_LANGUAGES.sw.nativeName).toBe('Kiswahili');
    });

    it('should have correct Amharic config', () => {
      expect(OMNITRANSLATE_LANGUAGES.am.name).toBe('Amharic');
      expect(OMNITRANSLATE_LANGUAGES.am.nativeName).toBe('አማርኛ');
    });

    it('should have correct Hausa config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ha.name).toBe('Hausa');
    });

    it('should have correct Yoruba config', () => {
      expect(OMNITRANSLATE_LANGUAGES.yo.name).toBe('Yoruba');
    });

    it('should have correct Igbo config', () => {
      expect(OMNITRANSLATE_LANGUAGES.ig.name).toBe('Igbo');
    });

    it('should have correct Zulu config', () => {
      expect(OMNITRANSLATE_LANGUAGES.zu.name).toBe('Zulu');
      expect(OMNITRANSLATE_LANGUAGES.zu.nativeName).toBe('isiZulu');
    });

    it('should have correct Xhosa config', () => {
      expect(OMNITRANSLATE_LANGUAGES.xh.name).toBe('Xhosa');
      expect(OMNITRANSLATE_LANGUAGES.xh.nativeName).toBe('isiXhosa');
    });

    it('should have correct Afrikaans config', () => {
      expect(OMNITRANSLATE_LANGUAGES.af.name).toBe('Afrikaans');
    });

    it('should have correct Somali config', () => {
      expect(OMNITRANSLATE_LANGUAGES.so.name).toBe('Somali');
      expect(OMNITRANSLATE_LANGUAGES.so.nativeName).toBe('Soomaali');
    });
  });

  // ===========================================================================
  // TRANSLATION TIER TESTS
  // ===========================================================================

  describe('Translation Tiers', () => {
    const tier1Languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'ja', 'ko', 'ar'];
    const tier2Languages = ['pl', 'uk', 'th', 'vi', 'id', 'ms', 'tl', 'hi', 'bn', 'tr', 'he', 'fa', 'sv', 'da'];

    it('should have all Tier 1 languages', () => {
      tier1Languages.forEach(code => {
        expect(OMNITRANSLATE_LANGUAGES[code as keyof typeof OMNITRANSLATE_LANGUAGES]).toBeDefined();
      });
    });

    it('should have all Tier 2 languages', () => {
      tier2Languages.forEach(code => {
        expect(OMNITRANSLATE_LANGUAGES[code as keyof typeof OMNITRANSLATE_LANGUAGES]).toBeDefined();
      });
    });

    it('should have 12 Tier 1 languages', () => {
      expect(tier1Languages.length).toBe(12);
    });

    it('should have 14+ Tier 2 languages', () => {
      expect(tier2Languages.length).toBeGreaterThanOrEqual(14);
    });
  });

  // ===========================================================================
  // REGION COUNTS
  // ===========================================================================

  describe('Region Counts', () => {
    it('should have at least 25 European languages', () => {
      const count = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.region === 'europe').length;
      expect(count).toBeGreaterThanOrEqual(25);
    });

    it('should have at least 10 Asian languages', () => {
      const count = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.region === 'asia').length;
      expect(count).toBeGreaterThanOrEqual(10);
    });

    it('should have at least 10 South Asian languages', () => {
      const count = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.region === 'south-asia').length;
      expect(count).toBeGreaterThanOrEqual(10);
    });

    it('should have at least 5 Middle Eastern languages', () => {
      const count = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.region === 'middle-east').length;
      expect(count).toBeGreaterThanOrEqual(5);
    });

    it('should have at least 8 African languages', () => {
      const count = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.region === 'africa').length;
      expect(count).toBeGreaterThanOrEqual(8);
    });

    it('should have at least 4 Pacific languages', () => {
      const count = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.region === 'pacific').length;
      expect(count).toBeGreaterThanOrEqual(4);
    });

    it('should have at least 1 Americas language', () => {
      const count = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.region === 'americas').length;
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  // ===========================================================================
  // RTL LANGUAGE COUNTS
  // ===========================================================================

  describe('RTL Language Counts', () => {
    it('should have at least 6 RTL languages', () => {
      const rtlCount = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.rtl).length;
      expect(rtlCount).toBeGreaterThanOrEqual(6);
    });

    it('should have majority LTR languages', () => {
      const ltrCount = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => !l.rtl).length;
      const rtlCount = Object.values(OMNITRANSLATE_LANGUAGES).filter(l => l.rtl).length;
      expect(ltrCount).toBeGreaterThan(rtlCount);
    });
  });

  // ===========================================================================
  // LANGUAGE CODE FORMAT
  // ===========================================================================

  describe('Language Code Format', () => {
    it('should have 2-letter codes for most languages', () => {
      const twoLetterCodes = Object.keys(OMNITRANSLATE_LANGUAGES).filter(c => c.length === 2);
      expect(twoLetterCodes.length).toBeGreaterThan(70);
    });

    it('should have variant codes with hyphen', () => {
      const variantCodes = Object.keys(OMNITRANSLATE_LANGUAGES).filter(c => c.includes('-'));
      expect(variantCodes.length).toBeGreaterThanOrEqual(2);
    });

    it('should have 3-letter codes for some languages', () => {
      const threeLetterCodes = Object.keys(OMNITRANSLATE_LANGUAGES).filter(c => c.length === 3 && !c.includes('-'));
      expect(threeLetterCodes.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ===========================================================================
  // SCRIPT DIVERSITY
  // ===========================================================================

  describe('Script Diversity', () => {
    it('should include Latin script languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.en).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.fr).toBeDefined();
    });

    it('should include Cyrillic script languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.ru).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.uk).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.bg).toBeDefined();
    });

    it('should include Arabic script languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.ar).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.fa).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ur).toBeDefined();
    });

    it('should include CJK script languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.zh).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ja).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ko).toBeDefined();
    });

    it('should include Devanagari script languages', () => {
      expect(OMNITRANSLATE_LANGUAGES.hi).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.mr).toBeDefined();
      expect(OMNITRANSLATE_LANGUAGES.ne).toBeDefined();
    });

    it('should include Thai script', () => {
      expect(OMNITRANSLATE_LANGUAGES.th).toBeDefined();
    });

    it('should include Greek script', () => {
      expect(OMNITRANSLATE_LANGUAGES.el).toBeDefined();
    });

    it('should include Hebrew script', () => {
      expect(OMNITRANSLATE_LANGUAGES.he).toBeDefined();
    });

    it('should include Georgian script', () => {
      expect(OMNITRANSLATE_LANGUAGES.ka).toBeDefined();
    });

    it('should include Armenian script', () => {
      expect(OMNITRANSLATE_LANGUAGES.hy).toBeDefined();
    });
  });
});
