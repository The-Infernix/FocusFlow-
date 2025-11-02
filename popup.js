const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startFocus");
const stopBtn = document.getElementById("stopFocus");
const timerDisplay = document.getElementById("timerDisplay");
const aiToggle = document.getElementById("toggleAI");
const aiStatus = document.getElementById("aiStatus");
const analyticsBtn = document.getElementById("openAnalytics");

let focusEndTime = null;
let focusTimerInterval = null;

// 🧠 Restore AI toggle state
chrome.storage.sync.get(["aiEnabled"], (data) => {
  const enabled = data.aiEnabled !== false;
  aiToggle.checked = enabled;
  aiStatus.textContent = `AI Detection: ${enabled ? "ON" : "OFF"}`;
});

aiToggle.addEventListener("change", () => {
  const enabled = aiToggle.checked;
  chrome.storage.sync.set({ aiEnabled: enabled });
  aiStatus.textContent = `AI Detection: ${enabled ? "ON" : "OFF"}`;
});

// 🧠 AI classification listener
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0].url;
  chrome.runtime.onMessage.addListener((message) => {
    if (message.url === currentUrl) {
      statusEl.textContent = `AI says: ${message.classification.toUpperCase()}`;
      logClassification(message.classification);
    }
  });
});

// 🎯 Start Focus Session
startBtn.addEventListener("click", () => {
  const hours = parseInt(prompt("Enter hours:"), 10) || 0;
  const minutes = parseInt(prompt("Enter minutes:"), 10) || 0;
  if (hours === 0 && minutes === 0) {
    alert("Enter a valid duration!");
    return;
  }

  const totalMillis = (hours * 60 + minutes) * 60 * 1000;
  focusEndTime = Date.now() + totalMillis;

  chrome.runtime.sendMessage({ type: "START_FOCUS", endTime: focusEndTime });
  localStorage.setItem("focusEndTime", focusEndTime);

  startTimer();
  statusEl.textContent = `Focus for ${hours}h ${minutes}m ⏳`;
});

// 🛑 Stop Focus
stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "STOP_FOCUS" });
  clearInterval(focusTimerInterval);
  localStorage.removeItem("focusEndTime");
  timerDisplay.textContent = "";
  statusEl.textContent = "Focus session ended.";
});

// ⏱️ Timer functions
function startTimer() {
  focusTimerInterval = setInterval(updateTimerDisplay, 1000);
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const remaining = focusEndTime - Date.now();
  if (remaining <= 0) {
    clearInterval(focusTimerInterval);
    timerDisplay.textContent = "✅ Focus session completed!";
    statusEl.textContent = "Session complete!";
    chrome.runtime.sendMessage({ type: "STOP_FOCUS" });
  } else {
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    timerDisplay.textContent = ` ${h}h ${m}m ${s}s left`;
  }
}

// 🔁 Restore timer if popup reopened
window.onload = () => {
  const stored = localStorage.getItem("focusEndTime");
  if (stored && Date.now() < stored) {
    focusEndTime = parseInt(stored);
    startTimer();
  }
};

// 📊 Log AI classification
function logClassification(classification) {
  const key = new Date().toDateString();
  chrome.storage.local.get([key], (res) => {
    const logs = res[key] || { productive: 0, distracting: 0, neutral: 0 };
    logs[classification] = (logs[classification] || 0) + 1;
    chrome.storage.local.set({ [key]: logs });
  });
}

// 📈 Open Analytics Page
analyticsBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("analytics.html") });
});
