/**
 * @license
 * Fusha-Speak Live Coach - Background Service Worker (Manifest V3)
 * Absolute Zero Telemetry. Strict Local Execution.
 */

// Configure side panel behavior on action icon click
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
      .catch((err) => console.log('SidePanel behavior note:', err));
  }

  // Initialize default storage schema if not present
  chrome.storage.local.get(['theme', 'audioSpeed', 'history'], (data) => {
    const defaults = {};
    if (!data.theme) defaults.theme = 'dark';
    if (!data.audioSpeed) defaults.audioSpeed = 1.0;
    if (!data.history) defaults.history = [];
    if (Object.keys(defaults).length > 0) {
      chrome.storage.local.set(defaults);
    }
  });
});

// Listen for messages from popup or sidepanel if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSidePanel') {
    if (chrome.sidePanel && chrome.sidePanel.open) {
      chrome.windows.getCurrent((win) => {
        chrome.sidePanel.open({ windowId: win.id })
          .then(() => sendResponse({ success: true }))
          .catch((err) => sendResponse({ success: false, error: err.message }));
      });
      return true; // Keep message channel open for async response
    } else {
      sendResponse({ success: false, error: 'SidePanel API not supported in this browser version' });
    }
  }
});
