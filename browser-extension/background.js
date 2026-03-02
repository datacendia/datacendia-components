/**
 * CendiaGateway™ — Browser Extension Background Service Worker
 * 
 * Intercepts AI API requests from browser-based tools (ChatGPT, Claude, Gemini)
 * and routes them through the CendiaGateway for governance, PII detection,
 * and cryptographic audit trails.
 * 
 * Uses Manifest V3 declarativeNetRequest for redirect rules,
 * plus webRequest listeners for header injection and logging.
 */

// Default gateway configuration
const DEFAULT_CONFIG = {
  gatewayUrl: 'http://localhost:3001',
  enabled: true,
  showBanner: true,
  userId: 'browser-user',
  userEmail: 'unknown@company.com',
  department: 'unknown',
  organizationId: 'default-org',
};

// Track intercepted requests for the popup badge
let interceptCount = 0;
let blockedCount = 0;

// Load configuration from storage
async function getConfig() {
  const result = await chrome.storage.sync.get('gatewayConfig');
  return { ...DEFAULT_CONFIG, ...result.gatewayConfig };
}

// Update badge with intercept count
function updateBadge() {
  const text = interceptCount > 0 ? String(interceptCount) : '';
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: blockedCount > 0 ? '#DC2626' : '#D4AF37' });
}

// Listen for rule match events (when a request is redirected)
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((info) => {
  interceptCount++;
  updateBadge();
  console.log(`[CendiaGateway] Intercepted: ${info.request.url} → gateway`);
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_STATS') {
    sendResponse({
      interceptCount,
      blockedCount,
      enabled: true,
    });
    return true;
  }

  if (message.type === 'TOGGLE_GATEWAY') {
    toggleGateway(message.enabled).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'RESET_STATS') {
    interceptCount = 0;
    blockedCount = 0;
    updateBadge();
    sendResponse({ success: true });
    return true;
  }
});

// Enable or disable all redirect rules
async function toggleGateway(enabled) {
  const ruleIds = [1, 2, 3, 4, 5];
  if (enabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ['gateway_redirect'],
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ['gateway_redirect'],
    });
  }
  await chrome.storage.sync.set({
    gatewayConfig: { ...(await getConfig()), enabled },
  });
}

// On install, set default config
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.sync.get('gatewayConfig');
  if (!existing.gatewayConfig) {
    await chrome.storage.sync.set({ gatewayConfig: DEFAULT_CONFIG });
  }
  console.log('[CendiaGateway] Extension installed — AI governance active');
});
