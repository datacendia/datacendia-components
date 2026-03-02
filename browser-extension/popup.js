/**
 * CendiaGateway™ — Browser Extension Popup Controller
 * 
 * Handles the popup UI: displays stats, toggles gateway on/off,
 * and links to the dashboard.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const enableToggle = document.getElementById('enableToggle');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const interceptedEl = document.getElementById('intercepted');
  const blockedEl = document.getElementById('blocked');
  const resetBtn = document.getElementById('resetBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const dashboardLink = document.getElementById('dashboardLink');

  // Load config
  const result = await chrome.storage.sync.get('gatewayConfig');
  const config = result.gatewayConfig || {};
  const gatewayUrl = config.gatewayUrl || 'http://localhost:3001';

  // Set dashboard link
  dashboardLink.href = `${gatewayUrl.replace(/\/api.*/, '')}/cortex/enterprise/gateway`;
  dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: dashboardLink.href });
  });

  // Get stats from background
  chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
    if (response) {
      interceptedEl.textContent = response.interceptCount || 0;
      blockedEl.textContent = response.blockedCount || 0;
      updateStatus(response.enabled !== false);
    }
  });

  // Toggle handler
  enableToggle.addEventListener('change', () => {
    const enabled = enableToggle.checked;
    chrome.runtime.sendMessage({ type: 'TOGGLE_GATEWAY', enabled }, () => {
      updateStatus(enabled);
    });
  });

  // Reset stats
  resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'RESET_STATS' }, () => {
      interceptedEl.textContent = '0';
      blockedEl.textContent = '0';
    });
  });

  // Settings
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  function updateStatus(enabled) {
    enableToggle.checked = enabled;
    statusDot.className = enabled ? 'dot' : 'dot disabled';
    statusText.textContent = enabled
      ? 'Active — Governing AI Traffic'
      : 'Disabled — AI Traffic Unmonitored';
  }
});
