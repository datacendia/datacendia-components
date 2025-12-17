// @ts-nocheck
// =============================================================================
// ERROR TRACKING SERVICE
// Enterprise-grade error tracking and reporting
// Integrates with backend logging and optional Sentry
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
interface ErrorContext {
  componentStack?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}
interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Configuration
const ERROR_API_ENDPOINT = '/api/v1/errors/report';
const ENABLE_CONSOLE_LOGGING = stryMutAct_9fa48("14918") ? false : (stryCov_9fa48("14918"), true);
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Error queue for batching
let errorQueue: ErrorReport[] = stryMutAct_9fa48("14919") ? ["Stryker was here"] : (stryCov_9fa48("14919"), []);
let flushTimer: NodeJS.Timeout | null = null;

/**
 * Initialize error tracking
 */
export function initErrorTracking(): void {
  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    logError(stryMutAct_9fa48("14924") ? error && new Error(String(message)) : stryMutAct_9fa48("14923") ? false : stryMutAct_9fa48("14922") ? true : (stryCov_9fa48("14922", "14923", "14924"), error || new Error(String(message))), stryMutAct_9fa48("14925") ? {} : (stryCov_9fa48("14925"), {
      metadata: stryMutAct_9fa48("14926") ? {} : (stryCov_9fa48("14926"), {
        source,
        lineno,
        colno
      })
    }));
    return stryMutAct_9fa48("14927") ? true : (stryCov_9fa48("14927"), false);
  };

  // Unhandled promise rejection handler
  window.onunhandledrejection = event => {
    logError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), stryMutAct_9fa48("14929") ? {} : (stryCov_9fa48("14929"), {
      metadata: stryMutAct_9fa48("14930") ? {} : (stryCov_9fa48("14930"), {
        type: 'unhandledrejection'
      })
    }));
  };

  // Start flush timer
  flushTimer = setInterval(flushErrors, FLUSH_INTERVAL);
  console.log('[ErrorTracking] Initialized');
}

/**
 * Log an error to the tracking service
 */
export function logError(error: Error, context: Partial<ErrorContext> = {}, severity: ErrorReport['severity'] = 'medium'): void {
  const report: ErrorReport = stryMutAct_9fa48("14935") ? {} : (stryCov_9fa48("14935"), {
    message: error.message,
    stack: error.stack,
    severity,
    context: stryMutAct_9fa48("14936") ? {} : (stryCov_9fa48("14936"), {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      userId: getUserId(),
      ...context
    })
  });

  // Console logging in development
  if (stryMutAct_9fa48("14938") ? false : stryMutAct_9fa48("14937") ? true : (stryCov_9fa48("14937", "14938"), ENABLE_CONSOLE_LOGGING)) {
    console.error('[ErrorTracking]', report.message, stryMutAct_9fa48("14941") ? {} : (stryCov_9fa48("14941"), {
      stack: report.stack,
      context: report.context,
      severity: report.severity
    }));
  }

  // Add to queue
  errorQueue.push(report);

  // Flush if queue is full or critical
  if (stryMutAct_9fa48("14944") ? errorQueue.length >= BATCH_SIZE && severity === 'critical' : stryMutAct_9fa48("14943") ? false : stryMutAct_9fa48("14942") ? true : (stryCov_9fa48("14942", "14943", "14944"), (stryMutAct_9fa48("14947") ? errorQueue.length < BATCH_SIZE : stryMutAct_9fa48("14946") ? errorQueue.length > BATCH_SIZE : stryMutAct_9fa48("14945") ? false : (stryCov_9fa48("14945", "14946", "14947"), errorQueue.length >= BATCH_SIZE)) || (stryMutAct_9fa48("14949") ? severity !== 'critical' : stryMutAct_9fa48("14948") ? false : (stryCov_9fa48("14948", "14949"), severity === 'critical')))) {
    flushErrors();
  }
}

/**
 * Log error from React Error Boundary
 */
export function logComponentError(error: Error, errorInfo: {
  componentStack?: string;
}): void {
  logError(error, stryMutAct_9fa48("14953") ? {} : (stryCov_9fa48("14953"), {
    componentStack: errorInfo.componentStack,
    metadata: stryMutAct_9fa48("14954") ? {} : (stryCov_9fa48("14954"), {
      source: 'ErrorBoundary'
    })
  }), 'high');
}

/**
 * Flush error queue to backend
 */
async function flushErrors(): Promise<void> {
  if (stryMutAct_9fa48("14960") ? errorQueue.length !== 0 : stryMutAct_9fa48("14959") ? false : stryMutAct_9fa48("14958") ? true : (stryCov_9fa48("14958", "14959", "14960"), errorQueue.length === 0)) {
    return;
  }
  const errors = stryMutAct_9fa48("14962") ? [] : (stryCov_9fa48("14962"), [...errorQueue]);
  errorQueue = stryMutAct_9fa48("14963") ? ["Stryker was here"] : (stryCov_9fa48("14963"), []);
  try {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = stryMutAct_9fa48("14966") ? {} : (stryCov_9fa48("14966"), {
      'Content-Type': 'application/json'
    });
    if (stryMutAct_9fa48("14969") ? false : stryMutAct_9fa48("14968") ? true : (stryCov_9fa48("14968", "14969"), token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(ERROR_API_ENDPOINT, stryMutAct_9fa48("14973") ? {} : (stryCov_9fa48("14973"), {
      method: 'POST',
      headers,
      body: JSON.stringify(stryMutAct_9fa48("14975") ? {} : (stryCov_9fa48("14975"), {
        errors
      }))
    }));
    if (stryMutAct_9fa48("14978") ? false : stryMutAct_9fa48("14977") ? true : stryMutAct_9fa48("14976") ? response.ok : (stryCov_9fa48("14976", "14977", "14978"), !response.ok)) {
      // Put errors back in queue
      errorQueue = stryMutAct_9fa48("14980") ? [] : (stryCov_9fa48("14980"), [...errors, ...errorQueue]);
      console.warn('[ErrorTracking] Failed to send errors, will retry');
    } else {
      console.log('[ErrorTracking] Sent', errors.length, 'error(s) to server');
    }
  } catch (err) {
    // Put errors back in queue
    errorQueue = stryMutAct_9fa48("14986") ? [] : (stryCov_9fa48("14986"), [...errors, ...errorQueue]);
    console.warn('[ErrorTracking] Network error, will retry');
  }
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('datacendia_session_id');
  if (stryMutAct_9fa48("14992") ? false : stryMutAct_9fa48("14991") ? true : stryMutAct_9fa48("14990") ? sessionId : (stryCov_9fa48("14990", "14991", "14992"), !sessionId)) {
    sessionId = `session_${Date.now()}_${stryMutAct_9fa48("14995") ? Math.random().toString(36) : (stryCov_9fa48("14995"), Math.random().toString(36).substr(2, 9))}`;
    sessionStorage.setItem('datacendia_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get current user ID if logged in
 */
function getUserId(): string | undefined {
  try {
    const token = localStorage.getItem('accessToken');
    if (stryMutAct_9fa48("15001") ? false : stryMutAct_9fa48("15000") ? true : (stryCov_9fa48("15000", "15001"), token)) {
      // Decode JWT to get user ID (basic decode, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return stryMutAct_9fa48("15006") ? payload.sub && payload.userId : stryMutAct_9fa48("15005") ? false : stryMutAct_9fa48("15004") ? true : (stryCov_9fa48("15004", "15005", "15006"), payload.sub || payload.userId);
    }
  } catch {
    // Ignore decode errors
  }
  return undefined;
}

/**
 * Cleanup on unmount
 */
export function cleanupErrorTracking(): void {
  if (stryMutAct_9fa48("15009") ? false : stryMutAct_9fa48("15008") ? true : (stryCov_9fa48("15008", "15009"), flushTimer)) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  flushErrors(); // Final flush
}

// Export default instance
export default stryMutAct_9fa48("15011") ? {} : (stryCov_9fa48("15011"), {
  init: initErrorTracking,
  log: logError,
  logComponent: logComponentError,
  cleanup: cleanupErrorTracking
});