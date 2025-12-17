// @ts-nocheck
// =============================================================================
// AUTO-HEAL SERVICE
// Automatic error detection, analysis, and resolution using AI Tech Team
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { ErrorAnalysis, FixSuggestion, TechTeamConfig, DEFAULT_TECH_TEAM_CONFIG, getTechAgent, assignAgentForError, generateFixPrompt } from '../lib/agents/techTeam';

// =============================================================================
// AUTO-HEAL SERVICE CLASS
// =============================================================================

class AutoHealServiceClass {
  private config: TechTeamConfig = DEFAULT_TECH_TEAM_CONFIG;
  private errorQueue: ErrorAnalysis[] = stryMutAct_9fa48("66377") ? ["Stryker was here"] : (stryCov_9fa48("66377"), []);
  private fixHistory: FixSuggestion[] = stryMutAct_9fa48("66378") ? ["Stryker was here"] : (stryCov_9fa48("66378"), []);
  private fixesAppliedThisHour: number = 0;
  private lastHourReset: Date = new Date();
  private listeners: Set<(error: ErrorAnalysis) => void> = new Set();
  private isProcessing: boolean = stryMutAct_9fa48("66379") ? true : (stryCov_9fa48("66379"), false);
  constructor() {
    this.setupErrorInterception();
    this.loadConfig();
    console.log('[AutoHeal] Service initialized');
  }

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  private loadConfig(): void {
    try {
      const saved = localStorage.getItem('autoheal_config');
      if (stryMutAct_9fa48("66386") ? false : stryMutAct_9fa48("66385") ? true : (stryCov_9fa48("66385", "66386"), saved)) {
        this.config = stryMutAct_9fa48("66388") ? {} : (stryCov_9fa48("66388"), {
          ...DEFAULT_TECH_TEAM_CONFIG,
          ...JSON.parse(saved)
        });
      }
    } catch (e) {
      console.warn('[AutoHeal] Failed to load config:', e);
    }
  }
  public updateConfig(updates: Partial<TechTeamConfig>): void {
    this.config = stryMutAct_9fa48("66392") ? {} : (stryCov_9fa48("66392"), {
      ...this.config,
      ...updates
    });
    localStorage.setItem('autoheal_config', JSON.stringify(this.config));
    console.log('[AutoHeal] Config updated:', this.config);
  }
  public getConfig(): TechTeamConfig {
    return stryMutAct_9fa48("66396") ? {} : (stryCov_9fa48("66396"), {
      ...this.config
    });
  }

  // ===========================================================================
  // ERROR INTERCEPTION
  // ===========================================================================

  private setupErrorInterception(): void {
    // Intercept window errors
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError(stryMutAct_9fa48("66399") ? {} : (stryCov_9fa48("66399"), {
        type: 'runtime',
        message: String(message),
        source: stryMutAct_9fa48("66403") ? source && 'unknown' : stryMutAct_9fa48("66402") ? false : stryMutAct_9fa48("66401") ? true : (stryCov_9fa48("66401", "66402", "66403"), source || 'unknown'),
        line: stryMutAct_9fa48("66407") ? lineno && 0 : stryMutAct_9fa48("66406") ? false : stryMutAct_9fa48("66405") ? true : (stryCov_9fa48("66405", "66406", "66407"), lineno || 0),
        column: stryMutAct_9fa48("66410") ? colno && 0 : stryMutAct_9fa48("66409") ? false : stryMutAct_9fa48("66408") ? true : (stryCov_9fa48("66408", "66409", "66410"), colno || 0),
        stack: stryMutAct_9fa48("66413") ? error?.stack && '' : stryMutAct_9fa48("66412") ? false : stryMutAct_9fa48("66411") ? true : (stryCov_9fa48("66411", "66412", "66413"), (stryMutAct_9fa48("66414") ? error.stack : (stryCov_9fa48("66414"), error?.stack)) || '')
      }));
      if (stryMutAct_9fa48("66417") ? false : stryMutAct_9fa48("66416") ? true : (stryCov_9fa48("66416", "66417"), originalOnError)) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return stryMutAct_9fa48("66419") ? true : (stryCov_9fa48("66419"), false);
    };

    // Intercept unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.captureError(stryMutAct_9fa48("66422") ? {} : (stryCov_9fa48("66422"), {
        type: 'promise',
        message: stryMutAct_9fa48("66426") ? event.reason?.message && String(event.reason) : stryMutAct_9fa48("66425") ? false : stryMutAct_9fa48("66424") ? true : (stryCov_9fa48("66424", "66425", "66426"), (stryMutAct_9fa48("66427") ? event.reason.message : (stryCov_9fa48("66427"), event.reason?.message)) || String(event.reason)),
        source: 'unhandled-promise',
        line: 0,
        column: 0,
        stack: stryMutAct_9fa48("66431") ? event.reason?.stack && '' : stryMutAct_9fa48("66430") ? false : stryMutAct_9fa48("66429") ? true : (stryCov_9fa48("66429", "66430", "66431"), (stryMutAct_9fa48("66432") ? event.reason.stack : (stryCov_9fa48("66432"), event.reason?.stack)) || '')
      }));
    });

    // Intercept console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if it's a real error (not just a React warning)
      const message = args.map(stryMutAct_9fa48("66435") ? () => undefined : (stryCov_9fa48("66435"), a => String(a))).join(' ');
      const lower = stryMutAct_9fa48("66437") ? message.toUpperCase() : (stryCov_9fa48("66437"), message.toLowerCase());
      const isReactWarning = stryMutAct_9fa48("66438") ? lower.endsWith('warning:') : (stryCov_9fa48("66438"), lower.startsWith('warning:'));
      if (stryMutAct_9fa48("66442") ? !isReactWarning || lower.includes('error:') || lower.includes('typeerror') || lower.includes('uncaught') || lower.includes('cannot read') : stryMutAct_9fa48("66441") ? false : stryMutAct_9fa48("66440") ? true : (stryCov_9fa48("66440", "66441", "66442"), (stryMutAct_9fa48("66443") ? isReactWarning : (stryCov_9fa48("66443"), !isReactWarning)) && (stryMutAct_9fa48("66445") ? (lower.includes('error:') || lower.includes('typeerror') || lower.includes('uncaught')) && lower.includes('cannot read') : stryMutAct_9fa48("66444") ? true : (stryCov_9fa48("66444", "66445"), (stryMutAct_9fa48("66447") ? (lower.includes('error:') || lower.includes('typeerror')) && lower.includes('uncaught') : stryMutAct_9fa48("66446") ? false : (stryCov_9fa48("66446", "66447"), (stryMutAct_9fa48("66449") ? lower.includes('error:') && lower.includes('typeerror') : stryMutAct_9fa48("66448") ? false : (stryCov_9fa48("66448", "66449"), lower.includes('error:') || lower.includes('typeerror'))) || lower.includes('uncaught'))) || lower.includes('cannot read'))))) {
        this.captureError(stryMutAct_9fa48("66455") ? {} : (stryCov_9fa48("66455"), {
          type: 'console',
          message: stryMutAct_9fa48("66457") ? message : (stryCov_9fa48("66457"), message.substring(0, 500)),
          source: 'console.error',
          line: 0,
          column: 0,
          stack: stryMutAct_9fa48("66461") ? new Error().stack && '' : stryMutAct_9fa48("66460") ? false : stryMutAct_9fa48("66459") ? true : (stryCov_9fa48("66459", "66460", "66461"), new Error().stack || '')
        }));
      }
      originalConsoleError.apply(console, args);
    };
    console.log('[AutoHeal] Error interception active');
  }
  private captureError(errorInfo: {
    type: string;
    message: string;
    source: string;
    line: number;
    column: number;
    stack: string;
  }): void {
    // Parse stack trace to get file info
    const {
      file,
      line,
      column
    } = this.parseStackTrace(errorInfo.stack, errorInfo.source, errorInfo.line, errorInfo.column);

    // Determine severity
    const severity = this.determineSeverity(errorInfo.message, errorInfo.type);

    // Create error analysis
    const error: ErrorAnalysis = stryMutAct_9fa48("66465") ? {} : (stryCov_9fa48("66465"), {
      id: `err_${Date.now()}_${stryMutAct_9fa48("66467") ? Math.random().toString(36) : (stryCov_9fa48("66467"), Math.random().toString(36).substr(2, 9))}`,
      timestamp: new Date(),
      errorType: errorInfo.type,
      message: errorInfo.message,
      stackTrace: errorInfo.stack,
      file,
      line,
      column,
      severity,
      assignedAgent: assignAgentForError(stryMutAct_9fa48("66468") ? {} : (stryCov_9fa48("66468"), {
        id: '',
        timestamp: new Date(),
        errorType: errorInfo.type,
        message: errorInfo.message,
        stackTrace: errorInfo.stack,
        file,
        line,
        column,
        severity,
        assignedAgent: '',
        suggestedFix: null,
        fixApplied: stryMutAct_9fa48("66471") ? true : (stryCov_9fa48("66471"), false),
        fixVerified: stryMutAct_9fa48("66472") ? true : (stryCov_9fa48("66472"), false)
      })),
      suggestedFix: null,
      fixApplied: stryMutAct_9fa48("66473") ? true : (stryCov_9fa48("66473"), false),
      fixVerified: stryMutAct_9fa48("66474") ? true : (stryCov_9fa48("66474"), false)
    });

    // Add to queue
    this.errorQueue.push(error);

    // Notify listeners asynchronously to avoid React setState warnings during render
    setTimeout(() => {
      this.listeners.forEach(stryMutAct_9fa48("66476") ? () => undefined : (stryCov_9fa48("66476"), listener => listener(error)));
    }, 0);

    // Process if auto-heal is enabled
    if (stryMutAct_9fa48("66478") ? false : stryMutAct_9fa48("66477") ? true : (stryCov_9fa48("66477", "66478"), this.config.autoHealEnabled)) {
      this.processErrorQueue();
    }
    console.log(`[AutoHeal] Captured ${severity} error:`, stryMutAct_9fa48("66481") ? errorInfo.message : (stryCov_9fa48("66481"), errorInfo.message.substring(0, 100)));
  }
  private parseStackTrace(stack: string, defaultSource: string, defaultLine: number, defaultColumn: number): {
    file: string;
    line: number;
    column: number;
  } {
    if (stryMutAct_9fa48("66485") ? false : stryMutAct_9fa48("66484") ? true : stryMutAct_9fa48("66483") ? stack : (stryCov_9fa48("66483", "66484", "66485"), !stack)) {
      return stryMutAct_9fa48("66487") ? {} : (stryCov_9fa48("66487"), {
        file: defaultSource,
        line: defaultLine,
        column: defaultColumn
      });
    }

    // Parse stack trace to find first app file (not node_modules)
    const lines = stack.split('\n');
    for (const line of lines) {
      // Match patterns like "at Component (file.tsx:123:45)" or "file.tsx:123:45"
      const match = line.match(stryMutAct_9fa48("66505") ? /(?:at\s+)?(?:\w+\s+)?\(?([^:]+):(\d+):(\d+)\)/ : stryMutAct_9fa48("66504") ? /(?:at\s+)?(?:\w+\s+)?\(?([^:]+):(\d+):(\D+)\)?/ : stryMutAct_9fa48("66503") ? /(?:at\s+)?(?:\w+\s+)?\(?([^:]+):(\d+):(\d)\)?/ : stryMutAct_9fa48("66502") ? /(?:at\s+)?(?:\w+\s+)?\(?([^:]+):(\D+):(\d+)\)?/ : stryMutAct_9fa48("66501") ? /(?:at\s+)?(?:\w+\s+)?\(?([^:]+):(\d):(\d+)\)?/ : stryMutAct_9fa48("66500") ? /(?:at\s+)?(?:\w+\s+)?\(?([:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66499") ? /(?:at\s+)?(?:\w+\s+)?\(?([^:]):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66498") ? /(?:at\s+)?(?:\w+\s+)?\(([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66497") ? /(?:at\s+)?(?:\w+\S+)?\(?([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66496") ? /(?:at\s+)?(?:\w+\s)?\(?([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66495") ? /(?:at\s+)?(?:\W+\s+)?\(?([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66494") ? /(?:at\s+)?(?:\w\s+)?\(?([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66493") ? /(?:at\s+)?(?:\w+\s+)\(?([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66492") ? /(?:at\S+)?(?:\w+\s+)?\(?([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66491") ? /(?:at\s)?(?:\w+\s+)?\(?([^:]+):(\d+):(\d+)\)?/ : stryMutAct_9fa48("66490") ? /(?:at\s+)(?:\w+\s+)?\(?([^:]+):(\d+):(\d+)\)?/ : (stryCov_9fa48("66490", "66491", "66492", "66493", "66494", "66495", "66496", "66497", "66498", "66499", "66500", "66501", "66502", "66503", "66504", "66505"), /(?:at\s+)?(?:\w+\s+)?\(?([^:]+):(\d+):(\d+)\)?/));
      if (stryMutAct_9fa48("66507") ? false : stryMutAct_9fa48("66506") ? true : (stryCov_9fa48("66506", "66507"), match)) {
        const [, file, lineNum, colNum] = match;
        if (stryMutAct_9fa48("66511") ? !file.includes('node_modules') || !file.includes('chunk-') : stryMutAct_9fa48("66510") ? false : stryMutAct_9fa48("66509") ? true : (stryCov_9fa48("66509", "66510", "66511"), (stryMutAct_9fa48("66512") ? file.includes('node_modules') : (stryCov_9fa48("66512"), !file.includes('node_modules'))) && (stryMutAct_9fa48("66514") ? file.includes('chunk-') : (stryCov_9fa48("66514"), !file.includes('chunk-'))))) {
          return stryMutAct_9fa48("66517") ? {} : (stryCov_9fa48("66517"), {
            file: file.replace(stryMutAct_9fa48("66519") ? /^.\/src\// : stryMutAct_9fa48("66518") ? /.*\/src\// : (stryCov_9fa48("66518", "66519"), /^.*\/src\//), 'src/'),
            line: parseInt(lineNum, 10),
            column: parseInt(colNum, 10)
          });
        }
      }
    }
    return stryMutAct_9fa48("66521") ? {} : (stryCov_9fa48("66521"), {
      file: defaultSource,
      line: defaultLine,
      column: defaultColumn
    });
  }
  private determineSeverity(message: string, type: string): 'critical' | 'high' | 'medium' | 'low' {
    const lowerMessage = stryMutAct_9fa48("66523") ? message.toUpperCase() : (stryCov_9fa48("66523"), message.toLowerCase());

    // Critical: App crashes, data loss, security
    if (stryMutAct_9fa48("66526") ? (lowerMessage.includes('crash') || lowerMessage.includes('fatal') || lowerMessage.includes('security')) && lowerMessage.includes('data loss') : stryMutAct_9fa48("66525") ? false : stryMutAct_9fa48("66524") ? true : (stryCov_9fa48("66524", "66525", "66526"), (stryMutAct_9fa48("66528") ? (lowerMessage.includes('crash') || lowerMessage.includes('fatal')) && lowerMessage.includes('security') : stryMutAct_9fa48("66527") ? false : (stryCov_9fa48("66527", "66528"), (stryMutAct_9fa48("66530") ? lowerMessage.includes('crash') && lowerMessage.includes('fatal') : stryMutAct_9fa48("66529") ? false : (stryCov_9fa48("66529", "66530"), lowerMessage.includes('crash') || lowerMessage.includes('fatal'))) || lowerMessage.includes('security'))) || lowerMessage.includes('data loss'))) {
      return 'critical';
    }

    // High: Render failures, API failures
    if (stryMutAct_9fa48("66539") ? (type === 'runtime' || lowerMessage.includes('cannot read') || lowerMessage.includes('undefined') || lowerMessage.includes('failed to fetch')) && lowerMessage.includes('network error') : stryMutAct_9fa48("66538") ? false : stryMutAct_9fa48("66537") ? true : (stryCov_9fa48("66537", "66538", "66539"), (stryMutAct_9fa48("66541") ? (type === 'runtime' || lowerMessage.includes('cannot read') || lowerMessage.includes('undefined')) && lowerMessage.includes('failed to fetch') : stryMutAct_9fa48("66540") ? false : (stryCov_9fa48("66540", "66541"), (stryMutAct_9fa48("66543") ? (type === 'runtime' || lowerMessage.includes('cannot read')) && lowerMessage.includes('undefined') : stryMutAct_9fa48("66542") ? false : (stryCov_9fa48("66542", "66543"), (stryMutAct_9fa48("66545") ? type === 'runtime' && lowerMessage.includes('cannot read') : stryMutAct_9fa48("66544") ? false : (stryCov_9fa48("66544", "66545"), (stryMutAct_9fa48("66547") ? type !== 'runtime' : stryMutAct_9fa48("66546") ? false : (stryCov_9fa48("66546", "66547"), type === 'runtime')) || lowerMessage.includes('cannot read'))) || lowerMessage.includes('undefined'))) || lowerMessage.includes('failed to fetch'))) || lowerMessage.includes('network error'))) {
      return 'high';
    }

    // Medium: Warnings, deprecations
    if (stryMutAct_9fa48("66557") ? lowerMessage.includes('warning') && lowerMessage.includes('deprecated') : stryMutAct_9fa48("66556") ? false : stryMutAct_9fa48("66555") ? true : (stryCov_9fa48("66555", "66556", "66557"), lowerMessage.includes('warning') || lowerMessage.includes('deprecated'))) {
      return 'medium';
    }
    return 'low';
  }

  // ===========================================================================
  // ERROR PROCESSING
  // ===========================================================================

  private async processErrorQueue(): Promise<void> {
    if (stryMutAct_9fa48("66566") ? this.isProcessing && this.errorQueue.length === 0 : stryMutAct_9fa48("66565") ? false : stryMutAct_9fa48("66564") ? true : (stryCov_9fa48("66564", "66565", "66566"), this.isProcessing || (stryMutAct_9fa48("66568") ? this.errorQueue.length !== 0 : stryMutAct_9fa48("66567") ? false : (stryCov_9fa48("66567", "66568"), this.errorQueue.length === 0)))) {
      return;
    }

    // Reset hourly counter if needed
    const now = new Date();
    if (stryMutAct_9fa48("66573") ? now.getTime() - this.lastHourReset.getTime() <= 3600000 : stryMutAct_9fa48("66572") ? now.getTime() - this.lastHourReset.getTime() >= 3600000 : stryMutAct_9fa48("66571") ? false : stryMutAct_9fa48("66570") ? true : (stryCov_9fa48("66570", "66571", "66572", "66573"), (stryMutAct_9fa48("66574") ? now.getTime() + this.lastHourReset.getTime() : (stryCov_9fa48("66574"), now.getTime() - this.lastHourReset.getTime())) > 3600000)) {
      this.fixesAppliedThisHour = 0;
      this.lastHourReset = now;
    }

    // Check rate limit
    if (stryMutAct_9fa48("66579") ? this.fixesAppliedThisHour < this.config.maxAutoFixesPerHour : stryMutAct_9fa48("66578") ? this.fixesAppliedThisHour > this.config.maxAutoFixesPerHour : stryMutAct_9fa48("66577") ? false : stryMutAct_9fa48("66576") ? true : (stryCov_9fa48("66576", "66577", "66578", "66579"), this.fixesAppliedThisHour >= this.config.maxAutoFixesPerHour)) {
      console.log('[AutoHeal] Rate limit reached, waiting...');
      return;
    }
    this.isProcessing = stryMutAct_9fa48("66582") ? false : (stryCov_9fa48("66582"), true);
    try {
      // Get next error that matches severity threshold
      const error = this.getNextEligibleError();
      if (stryMutAct_9fa48("66586") ? false : stryMutAct_9fa48("66585") ? true : stryMutAct_9fa48("66584") ? error : (stryCov_9fa48("66584", "66585", "66586"), !error)) {
        this.isProcessing = stryMutAct_9fa48("66588") ? true : (stryCov_9fa48("66588"), false);
        return;
      }
      console.log(`[AutoHeal] Processing error: ${error.id}`);

      // Get assigned agent
      const agent = getTechAgent(error.assignedAgent);
      if (stryMutAct_9fa48("66592") ? false : stryMutAct_9fa48("66591") ? true : stryMutAct_9fa48("66590") ? agent : (stryCov_9fa48("66590", "66591", "66592"), !agent)) {
        console.warn(`[AutoHeal] No agent found for: ${error.assignedAgent}`);
        this.isProcessing = stryMutAct_9fa48("66595") ? true : (stryCov_9fa48("66595"), false);
        return;
      }
      console.log(`[AutoHeal] Assigned to: ${agent.name}`);

      // Generate fix using AI
      const fix = await this.generateFix(error, agent);
      if (stryMutAct_9fa48("66598") ? false : stryMutAct_9fa48("66597") ? true : (stryCov_9fa48("66597", "66598"), fix)) {
        error.suggestedFix = fix.description;
        this.fixHistory.push(fix);
        console.log(`[AutoHeal] Fix suggested by ${agent.name}:`, fix.description);

        // Auto-apply if configured and safe
        if (stryMutAct_9fa48("66603") ? !this.config.requireApproval || fix.riskLevel === 'safe' : stryMutAct_9fa48("66602") ? false : stryMutAct_9fa48("66601") ? true : (stryCov_9fa48("66601", "66602", "66603"), (stryMutAct_9fa48("66604") ? this.config.requireApproval : (stryCov_9fa48("66604"), !this.config.requireApproval)) && (stryMutAct_9fa48("66606") ? fix.riskLevel !== 'safe' : stryMutAct_9fa48("66605") ? true : (stryCov_9fa48("66605", "66606"), fix.riskLevel === 'safe')))) {
          await this.applyFix(fix);
          error.fixApplied = stryMutAct_9fa48("66609") ? false : (stryCov_9fa48("66609"), true);
          stryMutAct_9fa48("66610") ? this.fixesAppliedThisHour-- : (stryCov_9fa48("66610"), this.fixesAppliedThisHour++);
        }
      }

      // Remove from queue
      this.errorQueue = stryMutAct_9fa48("66611") ? this.errorQueue : (stryCov_9fa48("66611"), this.errorQueue.filter(stryMutAct_9fa48("66612") ? () => undefined : (stryCov_9fa48("66612"), e => stryMutAct_9fa48("66615") ? e.id === error.id : stryMutAct_9fa48("66614") ? false : stryMutAct_9fa48("66613") ? true : (stryCov_9fa48("66613", "66614", "66615"), e.id !== error.id))));
    } catch (e) {
      console.error('[AutoHeal] Processing error:', e);
    } finally {
      this.isProcessing = stryMutAct_9fa48("66619") ? true : (stryCov_9fa48("66619"), false);

      // Process next if queue not empty
      if (stryMutAct_9fa48("66623") ? this.errorQueue.length <= 0 : stryMutAct_9fa48("66622") ? this.errorQueue.length >= 0 : stryMutAct_9fa48("66621") ? false : stryMutAct_9fa48("66620") ? true : (stryCov_9fa48("66620", "66621", "66622", "66623"), this.errorQueue.length > 0)) {
        setTimeout(stryMutAct_9fa48("66625") ? () => undefined : (stryCov_9fa48("66625"), () => this.processErrorQueue()), 1000);
      }
    }
  }
  private getNextEligibleError(): ErrorAnalysis | null {
    const severityOrder = stryMutAct_9fa48("66627") ? [] : (stryCov_9fa48("66627"), ['critical', 'high', 'medium', 'low']);
    const thresholdIndex = severityOrder.indexOf(this.config.autoFixSeverity);
    for (const error of this.errorQueue) {
      const errorIndex = severityOrder.indexOf(error.severity);
      if (stryMutAct_9fa48("66636") ? errorIndex > thresholdIndex : stryMutAct_9fa48("66635") ? errorIndex < thresholdIndex : stryMutAct_9fa48("66634") ? false : stryMutAct_9fa48("66633") ? true : (stryCov_9fa48("66633", "66634", "66635", "66636"), errorIndex <= thresholdIndex)) {
        return error;
      }
    }
    return null;
  }
  private async generateFix(error: ErrorAnalysis, agent: any): Promise<FixSuggestion | null> {
    try {
      // Generate prompt
      const prompt = generateFixPrompt(error, agent);

      // Call Ollama
      const response = await fetch('http://localhost:11434/api/generate', stryMutAct_9fa48("66641") ? {} : (stryCov_9fa48("66641"), {
        method: 'POST',
        headers: stryMutAct_9fa48("66643") ? {} : (stryCov_9fa48("66643"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("66645") ? {} : (stryCov_9fa48("66645"), {
          model: agent.model,
          prompt: `${agent.systemPrompt}\n\n${prompt}`,
          stream: stryMutAct_9fa48("66647") ? true : (stryCov_9fa48("66647"), false),
          options: stryMutAct_9fa48("66648") ? {} : (stryCov_9fa48("66648"), {
            temperature: 0.3,
            // Lower for more deterministic fixes
            num_predict: 2000
          })
        }))
      }));
      if (stryMutAct_9fa48("66651") ? false : stryMutAct_9fa48("66650") ? true : stryMutAct_9fa48("66649") ? response.ok : (stryCov_9fa48("66649", "66650", "66651"), !response.ok)) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }
      const data = await response.json();
      const responseText = data.response;

      // Parse the JSON response
      const jsonMatch = responseText.match(stryMutAct_9fa48("66659") ? /```json\n?([\s\S]*?)\n```/ : stryMutAct_9fa48("66658") ? /```json\n?([\s\s]*?)\n?```/ : stryMutAct_9fa48("66657") ? /```json\n?([\S\S]*?)\n?```/ : stryMutAct_9fa48("66656") ? /```json\n?([^\s\S]*?)\n?```/ : stryMutAct_9fa48("66655") ? /```json\n?([\s\S])\n?```/ : stryMutAct_9fa48("66654") ? /```json\n([\s\S]*?)\n?```/ : (stryCov_9fa48("66654", "66655", "66656", "66657", "66658", "66659"), /```json\n?([\s\S]*?)\n?```/));
      if (stryMutAct_9fa48("66661") ? false : stryMutAct_9fa48("66660") ? true : (stryCov_9fa48("66660", "66661"), jsonMatch)) {
        const parsed = JSON.parse(jsonMatch[1]);
        return stryMutAct_9fa48("66663") ? {} : (stryCov_9fa48("66663"), {
          id: `fix_${Date.now()}`,
          errorId: error.id,
          agentCode: agent.code,
          description: parsed.rootCause,
          codeChange: parsed.fix,
          confidence: stryMutAct_9fa48("66667") ? parsed.confidence && 0.8 : stryMutAct_9fa48("66666") ? false : stryMutAct_9fa48("66665") ? true : (stryCov_9fa48("66665", "66666", "66667"), parsed.confidence || 0.8),
          riskLevel: stryMutAct_9fa48("66670") ? parsed.riskLevel && 'moderate' : stryMutAct_9fa48("66669") ? false : stryMutAct_9fa48("66668") ? true : (stryCov_9fa48("66668", "66669", "66670"), parsed.riskLevel || 'moderate'),
          requiresReview: stryMutAct_9fa48("66674") ? parsed.riskLevel === 'safe' : stryMutAct_9fa48("66673") ? false : stryMutAct_9fa48("66672") ? true : (stryCov_9fa48("66672", "66673", "66674"), parsed.riskLevel !== 'safe')
        });
      }

      // Try to extract fix from plain text
      return stryMutAct_9fa48("66676") ? {} : (stryCov_9fa48("66676"), {
        id: `fix_${Date.now()}`,
        errorId: error.id,
        agentCode: agent.code,
        description: stryMutAct_9fa48("66678") ? responseText : (stryCov_9fa48("66678"), responseText.substring(0, 500)),
        codeChange: stryMutAct_9fa48("66679") ? {} : (stryCov_9fa48("66679"), {
          file: error.file,
          oldCode: '',
          newCode: '',
          explanation: responseText
        }),
        confidence: 0.5,
        riskLevel: 'moderate',
        requiresReview: stryMutAct_9fa48("66683") ? false : (stryCov_9fa48("66683"), true)
      });
    } catch (e) {
      console.error('[AutoHeal] Failed to generate fix:', e);
      return null;
    }
  }
  private async applyFix(fix: FixSuggestion): Promise<boolean> {
    // In a real implementation, this would apply the code change
    // For now, we log the suggested fix
    console.log('[AutoHeal] Would apply fix:', fix);
    if (stryMutAct_9fa48("66689") ? false : stryMutAct_9fa48("66688") ? true : (stryCov_9fa48("66688", "66689"), this.config.notifyOnFix)) {
      this.notifyFixApplied(fix);
    }
    return stryMutAct_9fa48("66691") ? false : (stryCov_9fa48("66691"), true);
  }
  private notifyFixApplied(fix: FixSuggestion): void {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('autoheal:fix-applied', stryMutAct_9fa48("66694") ? {} : (stryCov_9fa48("66694"), {
      detail: fix
    })));
  }

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  /**
   * Subscribe to error events
   */
  public onError(callback: (error: ErrorAnalysis) => void): () => void {
    this.listeners.add(callback);
    return stryMutAct_9fa48("66696") ? () => undefined : (stryCov_9fa48("66696"), () => this.listeners.delete(callback));
  }

  /**
   * Get current error queue
   */
  public getErrorQueue(): ErrorAnalysis[] {
    return stryMutAct_9fa48("66698") ? [] : (stryCov_9fa48("66698"), [...this.errorQueue]);
  }

  /**
   * Get fix history
   */
  public getFixHistory(): FixSuggestion[] {
    return stryMutAct_9fa48("66700") ? [] : (stryCov_9fa48("66700"), [...this.fixHistory]);
  }

  /**
   * Manually trigger fix for an error
   */
  public async requestFix(errorId: string): Promise<FixSuggestion | null> {
    const error = this.errorQueue.find(stryMutAct_9fa48("66702") ? () => undefined : (stryCov_9fa48("66702"), e => stryMutAct_9fa48("66705") ? e.id !== errorId : stryMutAct_9fa48("66704") ? false : stryMutAct_9fa48("66703") ? true : (stryCov_9fa48("66703", "66704", "66705"), e.id === errorId)));
    if (stryMutAct_9fa48("66708") ? false : stryMutAct_9fa48("66707") ? true : stryMutAct_9fa48("66706") ? error : (stryCov_9fa48("66706", "66707", "66708"), !error)) {
      console.warn('[AutoHeal] requestFix: Error not found in queue:', errorId);
      return null;
    }
    const agent = getTechAgent(error.assignedAgent);
    if (stryMutAct_9fa48("66713") ? false : stryMutAct_9fa48("66712") ? true : stryMutAct_9fa48("66711") ? agent : (stryCov_9fa48("66711", "66712", "66713"), !agent)) {
      console.warn('[AutoHeal] requestFix: No agent found for:', error.assignedAgent);
      return null;
    }
    console.log(`[AutoHeal] Generating fix for ${errorId} using ${agent.name}...`);
    try {
      const fix = await this.generateFix(error, agent);
      if (stryMutAct_9fa48("66719") ? false : stryMutAct_9fa48("66718") ? true : (stryCov_9fa48("66718", "66719"), fix)) {
        // Store the fix in history
        this.fixHistory.push(fix);

        // Update the error with the suggested fix
        error.suggestedFix = fix.description;

        // Notify listeners of the update
        this.notifyFixGenerated(fix);
        console.log(`[AutoHeal] Fix generated successfully:`, stryMutAct_9fa48("66722") ? fix.description : (stryCov_9fa48("66722"), fix.description.substring(0, 100)));
      } else {
        console.warn('[AutoHeal] No fix generated');
      }
      return fix;
    } catch (e) {
      console.error('[AutoHeal] requestFix failed:', e);
      return null;
    }
  }
  private notifyFixGenerated(fix: FixSuggestion): void {
    window.dispatchEvent(new CustomEvent('autoheal:fix-generated', stryMutAct_9fa48("66729") ? {} : (stryCov_9fa48("66729"), {
      detail: fix
    })));
  }

  /**
   * Approve and apply a fix
   */
  public async approveFix(fixId: string): Promise<boolean> {
    const fix = this.fixHistory.find(stryMutAct_9fa48("66731") ? () => undefined : (stryCov_9fa48("66731"), f => stryMutAct_9fa48("66734") ? f.id !== fixId : stryMutAct_9fa48("66733") ? false : stryMutAct_9fa48("66732") ? true : (stryCov_9fa48("66732", "66733", "66734"), f.id === fixId)));
    if (stryMutAct_9fa48("66737") ? false : stryMutAct_9fa48("66736") ? true : stryMutAct_9fa48("66735") ? fix : (stryCov_9fa48("66735", "66736", "66737"), !fix)) {
      return stryMutAct_9fa48("66739") ? true : (stryCov_9fa48("66739"), false);
    }
    return this.applyFix(fix);
  }

  /**
   * Clear error queue
   */
  public clearQueue(): void {
    this.errorQueue = stryMutAct_9fa48("66741") ? ["Stryker was here"] : (stryCov_9fa48("66741"), []);
  }

  /**
   * Get stats
   */
  public getStats(): {
    errorsInQueue: number;
    fixesApplied: number;
    fixesThisHour: number;
    isProcessing: boolean;
  } {
    return stryMutAct_9fa48("66743") ? {} : (stryCov_9fa48("66743"), {
      errorsInQueue: this.errorQueue.length,
      fixesApplied: stryMutAct_9fa48("66744") ? this.fixHistory.length : (stryCov_9fa48("66744"), this.fixHistory.filter(stryMutAct_9fa48("66745") ? () => undefined : (stryCov_9fa48("66745"), f => stryMutAct_9fa48("66748") ? f.requiresReview !== false : stryMutAct_9fa48("66747") ? false : stryMutAct_9fa48("66746") ? true : (stryCov_9fa48("66746", "66747", "66748"), f.requiresReview === (stryMutAct_9fa48("66749") ? true : (stryCov_9fa48("66749"), false))))).length),
      fixesThisHour: this.fixesAppliedThisHour,
      isProcessing: this.isProcessing
    });
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const AutoHealService = new AutoHealServiceClass();
export default AutoHealService;