let focusActive = false;
let alertInterval = null; // for distraction alerts

const blockedSites = [
  "youtube.com",
  "instagram.com",
  "netflix.com",
  "reddit.com",
  "twitter.com",
  "x.com",
  "tiktok.com"
];

// --- Create blocking rules ---
function createBlockingRules() {
  return blockedSites.map((site, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: "redirect", redirect: { extensionPath: "/blocked.html" } },
    condition: { urlFilter: site, resourceTypes: ["main_frame"] }
  }));
}

// --- Update blocking rules (with whitelist support) ---
async function updateBlockingRules(enable) {
  const rules = [];
  const res = await chrome.storage.local.get(["tempWhitelist"]);
  const whitelist = res.tempWhitelist || [];

  if (enable) {
    blockedSites.forEach((site, i) => {
      if (!whitelist.some((w) => site.includes(w))) {
        rules.push({
          id: i + 1,
          priority: 1,
          action: { type: "redirect", redirect: { extensionPath: "/blocked.html" } },
          condition: { urlFilter: site, resourceTypes: ["main_frame"] }
        });
      }
    });
  }

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map((r) => r.id),
    addRules: rules
  });

  console.log(enable ? "✅ Blocking ON" : "❌ Blocking OFF");
}

// --- Set focus state ---
function setFocusState(value, endTime) {
  focusActive = value;
  chrome.storage.local.set({ focusActive: value, focusEndTime: endTime || null });
  updateBlockingRules(value);

  if (value) {
    if (alertInterval) clearInterval(alertInterval); // stop reminders
  } else {
    startAlertReminder(); // start 5-min alerts
  }
}

// --- Message listener for popup ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "START_FOCUS") {
    setFocusState(true, msg.endTime);
    sendResponse({ ok: true });
    return true;
  }
  if (msg.type === "STOP_FOCUS") {
    setFocusState(false);
    sendResponse({ ok: true });
    return true;
  }
});

// --- Auto end focus session when time expires ---
setInterval(() => {
  chrome.storage.local.get(["focusActive", "focusEndTime"], (res) => {
    if (res.focusActive && Date.now() >= res.focusEndTime) {
      console.log("Focus session auto-ended");
      setFocusState(false);
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/focus.jpeg",
        title: "FocusFlow",
        message: "🎯 Your Focus session has ended!"
      });
    }
  });
}, 5000);

// --- 5-minute alert reminder when focus mode is OFF ---
function startAlertReminder() {
  if (alertInterval) clearInterval(alertInterval);

  alertInterval = setInterval(async () => {
    if (focusActive) return; // skip if focus mode active

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab || !tab.url) return;

    const isDistracting = blockedSites.some(site => tab.url.includes(site));
    if (isDistracting) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/focus.jpeg",
        title: "⚠️ Focus Reminder",
        message: "You’re on a distracting site. Time to refocus!",
        priority: 2
      });
    }
  }, 5 * 60 * 1000); // every 5 minutes
}
