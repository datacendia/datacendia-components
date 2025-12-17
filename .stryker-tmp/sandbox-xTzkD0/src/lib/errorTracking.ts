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
const ENABLE_CONSOLE_LOGGING = stryMutAct_9fa48("104") ? false : (stryCov_9fa48("104"), true);
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Error queue for batching
let errorQueue: ErrorReport[] = stryMutAct_9fa48("105") ? ["Stryker was here"] : (stryCov_9fa48("105"), []);
let flushTimer: NodeJS.Timeout | null = null;

/**
 * Initialize error tracking
 */
export function initErrorTracking(): void {
  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    logError(stryMutAct_9fa48("110") ? error && new Error(String(message)) : stryMutAct_9fa48("109") ? false : stryMutAct_9fa48("108") ? true : (stryCov_9fa48("108", "109", "110"), error || new Error(String(message))), stryMutAct_9fa48("111") ? {} : (stryCov_9fa48("111"), {
      metadata: stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
        source,
        lineno,
        colno
      })
    }));
    return stryMutAct_9fa48("113") ? true : (stryCov_9fa48("113"), false);
  };

  // Unhandled promise rejection handler
  window.onunhandledrejection = event => {
    logError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), stryMutAct_9fa48("115") ? {} : (stryCov_9fa48("115"), {
      metadata: stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
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
  const report: ErrorReport = stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
    message: error.message,
    stack: error.stack,
    severity,
    context: stryMutAct_9fa48("122") ? {} : (stryCov_9fa48("122"), {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      userId: getUserId(),
      ...context
    })
  });

  // Console logging in development
  if (stryMutAct_9fa48("124") ? false : stryMutAct_9fa48("123") ? true : (stryCov_9fa48("123", "124"), ENABLE_CONSOLE_LOGGING)) {
    console.error('[ErrorTracking]', report.message, stryMutAct_9fa48("127") ? {} : (stryCov_9fa48("127"), {
      stack: report.stack,
      context: report.context,
      severity: report.severity
    }));
  }

  // Add to queue
  errorQueue.push(report);

  // Flush if queue is full or critical
  if (stryMutAct_9fa48("130") ? errorQueue.length >= BATCH_SIZE && severity === 'critical' : stryMutAct_9fa48("129") ? false : stryMutAct_9fa48("128") ? true : (stryCov_9fa48("128", "129", "130"), (stryMutAct_9fa48("133") ? errorQueue.length < BATCH_SIZE : stryMutAct_9fa48("132") ? errorQueue.length > BATCH_SIZE : stryMutAct_9fa48("131") ? false : (stryCov_9fa48("131", "132", "133"), errorQueue.length >= BATCH_SIZE)) || (stryMutAct_9fa48("135") ? severity !== 'critical' : stryMutAct_9fa48("134") ? false : (stryCov_9fa48("134", "135"), severity === 'critical')))) {
    flushErrors();
  }
}

/**
 * Log error from React Error Boundary
 */
export function logComponentError(error: Error, errorInfo: {
  componentStack?: string;
}): void {
  logError(error, stryMutAct_9fa48("139") ? {} : (stryCov_9fa48("139"), {
    componentStack: errorInfo.componentStack,
    metadata: stryMutAct_9fa48("140") ? {} : (stryCov_9fa48("140"), {
      source: 'ErrorBoundary'
    })
  }), 'high');
}

/**
 * Flush error queue to backend
 */
async function flushErrors(): Promise<void> {
  if (stryMutAct_9fa48("146") ? errorQueue.length !== 0 : stryMutAct_9fa48("145") ? false : stryMutAct_9fa48("144") ? true : (stryCov_9fa48("144", "145", "146"), errorQueue.length === 0)) {
    return;
  }
  const errors = stryMutAct_9fa48("148") ? [] : (stryCov_9fa48("148"), [...errorQueue]);
  errorQueue = stryMutAct_9fa48("149") ? ["Stryker was here"] : (stryCov_9fa48("149"), []);
  try {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = stryMutAct_9fa48("152") ? {} : (stryCov_9fa48("152"), {
      'Content-Type': 'application/json'
    });
    if (stryMutAct_9fa48("155") ? false : stryMutAct_9fa48("154") ? true : (stryCov_9fa48("154", "155"), token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(ERROR_API_ENDPOINT, stryMutAct_9fa48("159") ? {} : (stryCov_9fa48("159"), {
      method: 'POST',
      headers,
      body: JSON.stringify(stryMutAct_9fa48("161") ? {} : (stryCov_9fa48("161"), {
        errors
      }))
    }));
    if (stryMutAct_9fa48("164") ? false : stryMutAct_9fa48("163") ? true : stryMutAct_9fa48("162") ? response.ok : (stryCov_9fa48("162", "163", "164"), !response.ok)) {
      // Put errors back in queue
      errorQueue = stryMutAct_9fa48("166") ? [] : (stryCov_9fa48("166"), [...errors, ...errorQueue]);
      console.warn('[ErrorTracking] Failed to send errors, will retry');
    } else {
      console.log('[ErrorTracking] Sent', errors.length, 'error(s) to server');
    }
  } catch (err) {
    // Put errors back in queue
    errorQueue = stryMutAct_9fa48("172") ? [] : (stryCov_9fa48("172"), [...errors, ...errorQueue]);
    console.warn('[ErrorTracking] Network error, will retry');
  }
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('datacendia_session_id');
  if (stryMutAct_9fa48("178") ? false : stryMutAct_9fa48("177") ? true : stryMutAct_9fa48("176") ? sessionId : (stryCov_9fa48("176", "177", "178"), !sessionId)) {
    sessionId = `session_${Date.now()}_${stryMutAct_9fa48("181") ? Math.random().toString(36) : (stryCov_9fa48("181"), Math.random().toString(36).substr(2, 9))}`;
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
    if (stryMutAct_9fa48("187") ? false : stryMutAct_9fa48("186") ? true : (stryCov_9fa48("186", "187"), token)) {
      // Decode JWT to get user ID (basic decode, not verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return stryMutAct_9fa48("192") ? payload.sub && payload.userId : stryMutAct_9fa48("191") ? false : stryMutAct_9fa48("190") ? true : (stryCov_9fa48("190", "191", "192"), payload.sub || payload.userId);
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
  if (stryMutAct_9fa48("195") ? false : stryMutAct_9fa48("194") ? true : (stryCov_9fa48("194", "195"), flushTimer)) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  flushErrors(); // Final flush
}

// Export default instance
export default stryMutAct_9fa48("197") ? {} : (stryCov_9fa48("197"), {
  init: initErrorTracking,
  log: logError,
  logComponent: logComponentError,
  cleanup: cleanupErrorTracking
});