function startCountdown() {
  chrome.storage.local.get(["focusEndTime"], (res) => {
    if (res.focusEndTime) {
      const interval = setInterval(() => {
        const remaining = res.focusEndTime - Date.now();
        const timerEl = document.getElementById("timer");

        if (remaining <= 0) {
          timerEl.textContent = "✅ You can revisit now!";
          clearInterval(interval);
          return;
        }

        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        timerEl.textContent = ` ${mins}m ${secs}s left`;
      }, 1000);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  startCountdown();

  document.getElementById("unblockBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url).hostname;

    chrome.storage.local.get(["tempWhitelist"], (res) => {
      const list = res.tempWhitelist || [];
      if (!list.includes(url)) list.push(url);

      chrome.storage.local.set({ tempWhitelist: list }, () => {
        alert(`${url} unblocked for 5 minutes.`);
        setTimeout(() => {
          chrome.storage.local.get(["tempWhitelist"], (r) => {
            const updated = (r.tempWhitelist || []).filter((u) => u !== url);
            chrome.storage.local.set({ tempWhitelist: updated });
          });
        }, 5 * 60 * 1000);

        window.history.back();
      });
    });
  });
});
