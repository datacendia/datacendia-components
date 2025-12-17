/**
 * =============================================================================
 * DATACENDIA ENTERPRISE TRANSLATION SERVICE
 * =============================================================================
 * 100% Dynamic AI-Powered Translation System
 * - Translates ALL strings to ALL 24 supported languages
 * - Uses Ollama LLM for real-time translation
 * - Caches translations in Redis and PostgreSQL
 * - Zero manual translation files required
 * - Enterprise-grade, client-ready implementation
 */
// @ts-nocheck


import { prisma } from '../../config/database.js';
import ollamaService from '../ollama.js';
import { logger } from '../../utils/logger.js';
import { redis } from '../../config/redis.js';

// =============================================================================
// SUPPORTED LANGUAGES (24 Languages)
// =============================================================================

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', rtl: false },
  fr: { name: 'French', nativeName: 'Français', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', rtl: false },
  it: { name: 'Italian', nativeName: 'Italiano', rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português', rtl: false },
  nl: { name: 'Dutch', nativeName: 'Nederlands', rtl: false },
  pl: { name: 'Polish', nativeName: 'Polski', rtl: false },
  ru: { name: 'Russian', nativeName: 'Русский', rtl: false },
  uk: { name: 'Ukrainian', nativeName: 'Українська', rtl: false },
  zh: { name: 'Chinese (Simplified)', nativeName: '简体中文', rtl: false },
  'zh-TW': { name: 'Chinese (Traditional)', nativeName: '繁體中文', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', rtl: false },
  ko: { name: 'Korean', nativeName: '한국어', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', rtl: true },
  he: { name: 'Hebrew', nativeName: 'עברית', rtl: true },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
  th: { name: 'Thai', nativeName: 'ไทย', rtl: false },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', rtl: false },
  tr: { name: 'Turkish', nativeName: 'Türkçe', rtl: false },
  sv: { name: 'Swedish', nativeName: 'Svenska', rtl: false },
  da: { name: 'Danish', nativeName: 'Dansk', rtl: false },
  no: { name: 'Norwegian', nativeName: 'Norsk', rtl: false },
  fi: { name: 'Finnish', nativeName: 'Suomi', rtl: false },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// =============================================================================
// COMPLETE BASE TRANSLATIONS (English - Source of Truth)
// =============================================================================

export const BASE_TRANSLATIONS: Record<string, string> = {
  // Application
  'app.name': 'Datacendia',
  'app.tagline': 'Enterprise Intelligence Platform',
  
  // Common Buttons
  'button.save': 'Save',
  'button.cancel': 'Cancel',
  'button.delete': 'Delete',
  'button.edit': 'Edit',
  'button.create': 'Create',
  'button.submit': 'Submit',
  'button.back': 'Back',
  'button.next': 'Next',
  'button.close': 'Close',
  'button.confirm': 'Confirm',
  'button.export': 'Export',
  'button.import': 'Import',
  'button.refresh': 'Refresh',
  'button.download': 'Download',
  'button.share': 'Share',
  'button.view': 'View',
  'button.add': 'Add',
  'button.remove': 'Remove',
  'button.search': 'Search',
  'button.filter': 'Filter',
  'button.sort': 'Sort',
  'button.reset': 'Reset',
  'button.apply': 'Apply',
  'button.start': 'Start',
  'button.stop': 'Stop',
  'button.pause': 'Pause',
  'button.resume': 'Resume',
  'button.retry': 'Retry',
  
  // Common Labels
  'label.loading': 'Loading...',
  'label.processing': 'Processing...',
  'label.success': 'Success',
  'label.error': 'Error',
  'label.warning': 'Warning',
  'label.info': 'Information',
  'label.online': 'Online',
  'label.offline': 'Offline',
  'label.mode': 'Mode',
  'label.lead': 'Lead',
  'label.consulting': 'Consulting',
  'label.select_all': 'Select all',
  'label.none': 'None',
  'label.all': 'All',
  'label.yes': 'Yes',
  'label.no': 'No',
  'label.active': 'Active',
  'label.inactive': 'Inactive',
  'label.enabled': 'Enabled',
  'label.disabled': 'Disabled',
  'label.required': 'Required',
  'label.optional': 'Optional',
  'label.new': 'New',
  'label.updated': 'Updated',
  'label.deleted': 'Deleted',
  'label.status': 'Status',
  'label.type': 'Type',
  'label.name': 'Name',
  'label.description': 'Description',
  'label.date': 'Date',
  'label.time': 'Time',
  'label.actions': 'Actions',
  'label.details': 'Details',
  'label.settings': 'Settings',
  'label.options': 'Options',
  'label.preferences': 'Preferences',
  'label.results': 'Results',
  'label.total': 'Total',
  'label.count': 'Count',
  'label.average': 'Average',
  'label.minimum': 'Minimum',
  'label.maximum': 'Maximum',
  
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.graph': 'The Graph',
  'nav.council': 'The Council',
  'nav.pulse': 'The Pulse',
  'nav.lens': 'The Lens',
  'nav.bridge': 'The Bridge',
  'nav.helm': 'The Helm',
  'nav.lineage': 'The Lineage',
  'nav.predict': 'The Predict',
  'nav.flow': 'The Flow',
  'nav.health': 'The Health',
  'nav.guard': 'The Guard',
  'nav.ethics': 'The Ethics',
  'nav.agents': 'The Agents',
  'nav.settings': 'Settings',
  'nav.help': 'Help',
  'nav.pillars': 'Pillars',
  'nav.system': 'System',
  'nav.data': 'Data',
  'nav.security': 'Security',
  'nav.admin': 'Administration',
  'nav.profile': 'Profile',
  'nav.logout': 'Logout',
  
  // Council
  'council.title': 'The Council',
  'council.subtitle': 'Programmable Organizational Intelligence',
  'council.pre_built_modes': 'Pre-Built Council Modes',
  'council.modes_library': 'Modes Library',
  'council.ollama_connected': 'Ollama Connected',
  'council.ollama_disconnected': 'Ollama Disconnected',
  'council.start': 'Start Deliberation',
  'council.mode.select': 'Select Council Mode',
  'council.agents.active': 'Active Agents',
  'council.agents.domain': 'Domain Agents',
  'council.agents.all': 'All agents (auto-select)',
  'council.ask': 'Ask The Council',
  'council.placeholder': 'What would you like to know?',
  'council.phase.divergent': 'Divergent Analysis',
  'council.phase.challenge': 'Cross-Examination',
  'council.phase.synthesis': 'Synthesis',
  'council.decision.pending': 'Decision Pending',
  'council.decision.complete': 'Deliberation Complete',
  'council.confidence': 'Confidence Score',
  'council.summary': 'Executive Summary',
  'council.minutes': 'Meeting Minutes',
  'council.quick_answer': 'Quick Answer',
  'council.full_deliberation': 'Full Deliberation',
  'council.ask_question': 'Ask Question',
  'council.start_deliberation': 'Start Deliberation',
  
  // Council Modes
  'mode.war_room': 'War Room Mode',
  'mode.war_room.desc': 'Conflict before Consensus',
  'mode.due_diligence': 'Due Diligence Mode',
  'mode.due_diligence.desc': 'Comprehensive analysis',
  'mode.innovation_lab': 'Innovation Lab Mode',
  'mode.innovation_lab.desc': 'Creative exploration',
  'mode.compliance': 'Compliance Mode',
  'mode.compliance.desc': 'Regulatory focus',
  'mode.crisis': 'Crisis Mode',
  'mode.crisis.desc': 'Emergency response',
  'mode.execution': 'Execution Mode',
  'mode.execution.desc': 'Implementation planning',
  'mode.research': 'Research Mode',
  'mode.research.desc': 'Deep investigation',
  'mode.investment': 'Investment Mode',
  'mode.investment.desc': 'Financial decisions',
  'mode.stakeholder': 'Stakeholder Mode',
  'mode.stakeholder.desc': 'Multi-party alignment',
  'mode.rapid': 'Rapid Mode',
  'mode.rapid.desc': 'Quick decisions',
  'mode.advisory': 'Advisory Mode',
  'mode.advisory.desc': 'Expert guidance',
  'mode.governance': 'Governance Mode',
  'mode.governance.desc': 'Policy and oversight',
  
  // Domain Agents
  'agent.chief_strategy': 'Chief Strategy Agent',
  'agent.chief_strategy.desc': 'Strategic Oversight & Synthesis',
  'agent.financial': 'Financial Intelligence Agent',
  'agent.financial.desc': 'Financial Analysis & Risk',
  'agent.operations': 'Operations Intelligence Agent',
  'agent.operations.desc': 'Operational Efficiency',
  'agent.security': 'Security & Compliance Agent',
  'agent.security.desc': 'Security & Risk Management',
  'agent.market': 'Market Intelligence Agent',
  'agent.market.desc': 'Marketing & Customer Insights',
  'agent.revenue': 'Revenue Intelligence Agent',
  'agent.revenue.desc': 'Revenue & Growth',
  'agent.data_quality': 'Data Quality Agent',
  'agent.data_quality.desc': 'Data Governance & Quality',
  'agent.risk': 'Risk Assessment Agent',
  'agent.risk.desc': 'Enterprise Risk Analysis',
  
  // Deliberation
  'deliberation.new': 'New Deliberation',
  'deliberation.history': 'Deliberation History',
  'deliberation.status.pending': 'Pending',
  'deliberation.status.active': 'In Progress',
  'deliberation.status.completed': 'Completed',
  'deliberation.status.failed': 'Failed',
  'deliberation.status.cancelled': 'Cancelled',
  'deliberation.question.placeholder': 'What strategic question should The Council deliberate?',
  'deliberation.agents.participating': 'Participating Agents',
  'deliberation.duration': 'Duration',
  'deliberation.view.details': 'View Details',
  'deliberation.response': 'Response',
  'deliberation.consensus': 'Consensus',
  'deliberation.dissent': 'Dissent',
  
  // Decisions
  'decisions.title': 'Decision Management',
  'decisions.debt': 'Decision Debt',
  'decisions.ghost_board': 'Ghost Board',
  'decisions.pre_mortem': 'Pre-Mortem Analysis',
  'decisions.regulatory': 'Regulatory Absorb',
  'decisions.live_demo': 'Live Demo Mode',
  'decisions.intelligence': 'Decision Intelligence',
  'decisions.intelligence.suite': 'Decision Intelligence Suite',
  'decisions.intelligence.desc': 'Premium executive decision tools',
  'decisions.dna': 'Decision DNA',
  'decisions.dna.desc': 'Full lifecycle tracking & replay',
  'decisions.status.pending': 'Pending',
  'decisions.status.blocked': 'Blocked',
  'decisions.status.approved': 'Approved',
  'decisions.status.rejected': 'Rejected',
  'decisions.priority.low': 'Low',
  'decisions.priority.medium': 'Medium',
  'decisions.priority.high': 'High',
  'decisions.priority.critical': 'Critical',
  'decisions.cost.daily': 'Daily Cost',
  'decisions.cost.total': 'Total Cost Accrued',
  
  // Executive Summary
  'executive.summary': 'Executive Summary',
  'executive.minutes': 'Minutes',
  'executive.key_points': 'Key Points',
  'executive.action_items': 'Action Items',
  'executive.risks': 'Identified Risks',
  'executive.recommendations': 'Recommendations',
  'executive.next_steps': 'Next Steps',
  'executive.participants': 'Participants',
  'executive.generated_by': 'Generated by',
  'executive.download_pdf': 'Download PDF',
  'executive.share': 'Share',
  'executive.date': 'Date',
  'executive.duration': 'Duration',
  
  // Settings
  'settings.title': 'Settings',
  'settings.language': 'Language',
  'settings.language.select': 'Select Language',
  'settings.language.description': 'Choose your preferred language for the interface',
  'settings.timezone': 'Timezone',
  'settings.dateFormat': 'Date Format',
  'settings.timeFormat': 'Time Format',
  'settings.notifications': 'Notifications',
  'settings.theme': 'Theme',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.theme.system': 'System',
  'settings.account': 'Account',
  'settings.security': 'Security',
  'settings.privacy': 'Privacy',
  'settings.api': 'API Settings',
  'settings.integrations': 'Integrations',
  
  // Search
  'search.placeholder': 'Search anything...',
  'search.results': 'Search Results',
  'search.no_results': 'No results found',
  'search.filters': 'Filters',
  'search.clear': 'Clear search',
  
  // Data Source
  'datasource.connect': 'Connect a data source',
  'datasource.select': 'Select data source',
  'datasource.connected': 'Connected',
  'datasource.disconnected': 'Disconnected',
  'datasource.configure': 'Configure',
  'datasource.test': 'Test Connection',
  
  // Actions
  'action.explore': 'Explore',
  'action.ask_council': 'Ask Council',
  'action.monitor': 'Monitor',
  'action.forecast': 'Forecast',
  'action.automate': 'Automate',
  'action.analyze': 'Analyze',
  'action.visualize': 'Visualize',
  'action.report': 'Report',
  
  // Errors
  'error.generic': 'An error occurred. Please try again.',
  'error.network': 'Network error. Please check your connection.',
  'error.unauthorized': 'You are not authorized to perform this action.',
  'error.not_found': 'The requested resource was not found.',
  'error.validation': 'Please check your input and try again.',
  'error.server': 'Server error. Our team has been notified.',
  'error.timeout': 'Request timed out. Please try again.',
  'error.rate_limit': 'Too many requests. Please wait a moment.',
  
  // Success Messages
  'success.saved': 'Successfully saved',
  'success.created': 'Successfully created',
  'success.updated': 'Successfully updated',
  'success.deleted': 'Successfully deleted',
  'success.sent': 'Successfully sent',
  
  // Confirmation
  'confirm.delete': 'Are you sure you want to delete this?',
  'confirm.cancel': 'Are you sure you want to cancel?',
  'confirm.discard': 'Discard unsaved changes?',
  'confirm.logout': 'Are you sure you want to logout?',
  
  // Time
  'time.now': 'Just now',
  'time.minutes_ago': 'minutes ago',
  'time.hours_ago': 'hours ago',
  'time.days_ago': 'days ago',
  'time.today': 'Today',
  'time.yesterday': 'Yesterday',
  'time.this_week': 'This week',
  'time.last_week': 'Last week',
  'time.this_month': 'This month',
  
  // Analytics
  'analytics.title': 'Analytics',
  'analytics.overview': 'Overview',
  'analytics.performance': 'Performance',
  'analytics.trends': 'Trends',
  'analytics.reports': 'Reports',
  'analytics.export': 'Export Data',
  
  // Authentication
  'auth.login': 'Login',
  'auth.logout': 'Logout',
  'auth.register': 'Register',
  'auth.forgot_password': 'Forgot Password',
  'auth.reset_password': 'Reset Password',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.remember_me': 'Remember me',
  'auth.sign_in': 'Sign In',
  'auth.sign_up': 'Sign Up',
  'auth.sign_out': 'Sign Out',
};

// =============================================================================
// TRANSLATION SERVICE CLASS
// =============================================================================

class TranslationService {
  private memoryCache: Map<string, Record<string, string>> = new Map();
  private cachePrefix = 'i18n:translations:';
  private cacheTTL = 86400; // 24 hours
  private translationQueue: Map<string, Promise<Record<string, string>>> = new Map();

  /**
   * Get ALL translations for a language
   * This is the main method - returns complete translation set
   */
  async getAllTranslations(language: SupportedLanguage): Promise<Record<string, string>> {
    // English is the base - return immediately
    if (language === 'en') {
      return { ...BASE_TRANSLATIONS };
    }

    // Check memory cache first (fastest)
    const memoryCached = this.memoryCache.get(language);
    if (memoryCached && Object.keys(memoryCached).length === Object.keys(BASE_TRANSLATIONS).length) {
      return memoryCached;
    }

    // Check if translation is already in progress
    const inProgress = this.translationQueue.get(language);
    if (inProgress) {
      return inProgress;
    }

    // Check Redis cache
    const redisCached = await this.getFromRedis(language);
    if (redisCached && Object.keys(redisCached).length === Object.keys(BASE_TRANSLATIONS).length) {
      this.memoryCache.set(language, redisCached);
      return redisCached;
    }

    // Check database for cached translations
    const dbTranslations = await this.getFromDatabase(language);
    if (dbTranslations && Object.keys(dbTranslations).length === Object.keys(BASE_TRANSLATIONS).length) {
      this.memoryCache.set(language, dbTranslations);
      await this.saveToRedis(language, dbTranslations);
      return dbTranslations;
    }

    // Need to translate - start the translation process
    const translationPromise = this.translateAllStrings(language, dbTranslations || {});
    this.translationQueue.set(language, translationPromise);

    try {
      const translations = await translationPromise;
      this.translationQueue.delete(language);
      return translations;
    } catch (error) {
      this.translationQueue.delete(language);
      logger.error(`Failed to translate to ${language}:`, error);
      // Return partial translations or base
      return dbTranslations || { ...BASE_TRANSLATIONS };
    }
  }

  /**
   * Translate ALL base strings to target language using Ollama
   */
  private async translateAllStrings(
    language: SupportedLanguage,
    existingTranslations: Record<string, string>
  ): Promise<Record<string, string>> {
    const langInfo = SUPPORTED_LANGUAGES[language];
    const translations: Record<string, string> = { ...existingTranslations };
    
    // Find keys that need translation
    const keysToTranslate = Object.keys(BASE_TRANSLATIONS).filter(
      key => !existingTranslations[key]
    );

    if (keysToTranslate.length === 0) {
      return translations;
    }

    logger.info(`Translating ${keysToTranslate.length} strings to ${langInfo.name}`);

    // Batch translate for efficiency (groups of 20)
    const batchSize = 20;
    for (let i = 0; i < keysToTranslate.length; i += batchSize) {
      const batch = keysToTranslate.slice(i, i + batchSize);
      const batchStrings = batch.map(key => `${key}: "${BASE_TRANSLATIONS[key]}"`).join('\n');

      try {
        const prompt = `You are a professional translator. Translate the following English UI strings to ${langInfo.name} (${langInfo.nativeName}).

RULES:
1. Maintain exact meaning and professional tone
2. Use formal language appropriate for enterprise software
3. Keep brand names (Datacendia, Ollama) unchanged
4. Keep technical terms consistent
5. Return ONLY the translations in the exact same format (key: "translated text")
6. Do NOT add any explanations or notes

Strings to translate:
${batchStrings}

Translations to ${langInfo.name}:`;

        const response = await ollamaService.generate(prompt, {
          model: 'llama3.2:3b',
          options: {
            temperature: 0.2,
            num_predict: 2000,
          },
        });

        // Parse the response
        const lines = response.trim().split('\n');
        for (const line of lines) {
          const match = line.match(/^([^:]+):\s*"([^"]+)"$/);
          if (match) {
            const [, key, value] = match;
            const trimmedKey = key.trim();
            if (batch.includes(trimmedKey)) {
              translations[trimmedKey] = value;
            }
          }
        }
      } catch (error) {
        logger.error(`Batch translation failed for ${language}:`, error);
        // Keep untranslated strings as English
        for (const key of batch) {
          if (!translations[key]) {
            translations[key] = BASE_TRANSLATIONS[key];
          }
        }
      }

      // Small delay between batches to avoid overwhelming Ollama
      if (i + batchSize < keysToTranslate.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Save to database and cache
    await this.saveToDatabase(language, translations);
    await this.saveToRedis(language, translations);
    this.memoryCache.set(language, translations);

    logger.info(`Completed translation to ${langInfo.name}: ${Object.keys(translations).length} strings`);

    return translations;
  }

  /**
   * Get single translation
   */
  async translate(
    key: string,
    language: SupportedLanguage = 'en',
    interpolations?: Record<string, string>
  ): Promise<string> {
    const allTranslations = await this.getAllTranslations(language);
    let text = allTranslations[key] || BASE_TRANSLATIONS[key] || key;
    
    if (interpolations) {
      Object.entries(interpolations).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      });
    }
    
    return text;
  }

  /**
   * Translate dynamic content (deliberation responses, etc.)
   */
  async translateContent(
    content: string,
    targetLanguage: SupportedLanguage
  ): Promise<string> {
    if (targetLanguage === 'en') return content;

    const langInfo = SUPPORTED_LANGUAGES[targetLanguage];

    try {
      const prompt = `Translate the following text to ${langInfo.name} (${langInfo.nativeName}).
Keep the meaning and tone. Keep technical terms and proper nouns unchanged.
Return ONLY the translation.

Text:
${content}

Translation:`;

      const response = await ollamaService.generate(prompt, {
        model: 'llama3.2:3b',
        options: {
          temperature: 0.3,
          num_predict: 2000,
        },
      });

      return response.trim();
    } catch (error) {
      logger.error('Content translation failed:', error);
      return content;
    }
  }

  /**
   * Translate deliberation with all its parts
   */
  async translateDeliberation(
    content: {
      question: string;
      messages: Array<{ agent: string; content: string }>;
      decision?: string;
    },
    targetLanguage: SupportedLanguage
  ): Promise<typeof content> {
    if (targetLanguage === 'en') return content;

    try {
      const [question, decision, ...translatedContents] = await Promise.all([
        this.translateContent(content.question, targetLanguage),
        content.decision ? this.translateContent(content.decision, targetLanguage) : Promise.resolve(undefined),
        ...content.messages.map(m => this.translateContent(m.content, targetLanguage)),
      ]);

      return {
        question,
        messages: content.messages.map((m, i) => ({
          agent: m.agent,
          content: translatedContents[i],
        })),
        decision,
      };
    } catch (error) {
      logger.error('Deliberation translation failed:', error);
      return content;
    }
  }

  /**
   * Translate executive summary content
   */
  async translateExecutiveSummary(
    content: {
      title: string;
      content: string;
      keyPoints: string[];
      actionItems: string[];
      recommendations: string[];
    },
    targetLanguage: SupportedLanguage
  ): Promise<typeof content> {
    if (targetLanguage === 'en') return content;

    try {
      const [title, mainContent, ...rest] = await Promise.all([
        this.translateContent(content.title, targetLanguage),
        this.translateContent(content.content, targetLanguage),
        ...content.keyPoints.map(kp => this.translateContent(kp, targetLanguage)),
        ...content.actionItems.map(ai => this.translateContent(ai, targetLanguage)),
        ...content.recommendations.map(r => this.translateContent(r, targetLanguage)),
      ]);

      const keyPointsCount = content.keyPoints.length;
      const actionItemsCount = content.actionItems.length;

      return {
        title,
        content: mainContent,
        keyPoints: rest.slice(0, keyPointsCount),
        actionItems: rest.slice(keyPointsCount, keyPointsCount + actionItemsCount),
        recommendations: rest.slice(keyPointsCount + actionItemsCount),
      };
    } catch (error) {
      logger.error('Executive summary translation failed:', error);
      return content;
    }
  }

  // ==========================================================================
  // CACHE METHODS
  // ==========================================================================

  private async getFromRedis(language: string): Promise<Record<string, string> | null> {
    try {
      if (!redis) return null;
      const cached = await redis.get(`${this.cachePrefix}${language}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.debug('Redis get failed:', error);
      return null;
    }
  }

  private async saveToRedis(language: string, translations: Record<string, string>): Promise<void> {
    try {
      if (!redis) return;
      await redis.setex(
        `${this.cachePrefix}${language}`,
        this.cacheTTL,
        JSON.stringify(translations)
      );
    } catch (error) {
      logger.debug('Redis save failed:', error);
    }
  }

  private async getFromDatabase(language: string): Promise<Record<string, string> | null> {
    try {
      //  - Prisma model may not be generated yet
      const records = await prisma.translation.findMany({
        where: { language },
      });

      if (records.length === 0) return null;

      const translations: Record<string, string> = {};
      for (const r of records) {
        translations[r.key] = r.value;
      }
      return translations;
    } catch (error) {
      logger.debug('Database get failed:', error);
      return null;
    }
  }

  private async saveToDatabase(language: string, translations: Record<string, string>): Promise<void> {
    try {
      // Save each translation
      const operations = Object.entries(translations).map(([key, value]) =>
        //  - Prisma model may not be generated yet
        prisma.translation.upsert({
          where: {
            key_language_namespace: { key, language, namespace: 'common' },
          },
          update: { value },
          create: { key, language, namespace: 'common', value },
        })
      );

      // Execute in batches of 50
      for (let i = 0; i < operations.length; i += 50) {
        await Promise.all(operations.slice(i, i + 50));
      }
    } catch (error) {
      logger.debug('Database save failed:', error);
    }
  }

  /**
   * Clear translation cache for a language
   */
  async clearCache(language?: string): Promise<void> {
    if (language) {
      this.memoryCache.delete(language);
      if (redis) {
        await redis.del(`${this.cachePrefix}${language}`);
      }
    } else {
      this.memoryCache.clear();
      if (redis) {
        const keys = await redis.keys(`${this.cachePrefix}*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    }
  }

  /**
   * Get user language preference
   */
  async getUserPreference(userId: string): Promise<SupportedLanguage> {
    try {
      // 
      const pref = await prisma.userLanguagePreference.findUnique({
        where: { userId },
      });
      return (pref?.language as SupportedLanguage) || 'en';
    } catch (error) {
      return 'en';
    }
  }

  /**
   * Set user language preference
   */
  async setUserPreference(userId: string, language: SupportedLanguage): Promise<void> {
    try {
      // 
      await prisma.userLanguagePreference.upsert({
        where: { userId },
        update: { language },
        create: { userId, language },
      });
    } catch (error) {
      logger.error('Failed to save user preference:', error);
    }
  }

  /**
   * Get translation statistics
   */
  async getStats(): Promise<{
    languages: number;
    totalStrings: number;
    translatedByLanguage: Record<string, number>;
  }> {
    const stats: Record<string, number> = {};
    
    for (const lang of Object.keys(SUPPORTED_LANGUAGES)) {
      if (lang === 'en') {
        stats[lang] = Object.keys(BASE_TRANSLATIONS).length;
      } else {
        const cached = this.memoryCache.get(lang);
        stats[lang] = cached ? Object.keys(cached).length : 0;
      }
    }

    return {
      languages: Object.keys(SUPPORTED_LANGUAGES).length,
      totalStrings: Object.keys(BASE_TRANSLATIONS).length,
      translatedByLanguage: stats,
    };
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export const translationService = new TranslationService();
export default translationService;
