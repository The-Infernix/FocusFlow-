function classifyWebsite(title, url, description = "") {
  const text = (title + " " + url + " " + description).toLowerCase();

  const productiveKeywords = [
    "docs", "notion", "github", "medium", "research", "study",
    "tutorial", "stack", "leetcode", "coursera", "project", "dev"
  ];

  const distractingKeywords = [
    "instagram", "youtube", "tiktok", "reddit", "netflix",
    "funny", "meme", "stream", "game", "music", "movie", "chat"
  ];

  let score = 0;
  productiveKeywords.forEach(k => text.includes(k) && score++);
  distractingKeywords.forEach(k => text.includes(k) && score--);

  if (score <= -1) return "distracting";
  if (score >= 1) return "productive";
  return "neutral";
}

function injectWarning() {
  const div = document.createElement("div");
  div.id = "focusflow-warning";
  Object.assign(div.style, {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.85)", color: "white", zIndex: "999999",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", fontFamily: "Poppins"
  });
  div.innerHTML = `
    <h1>🚫 Stay Focused!</h1>
    <p>This site seems distracting. Continue?</p>
    <button id="ff-continue" style="padding:8px 16px;">Continue</button>
  `;
  document.body.appendChild(div);
  document.getElementById("ff-continue").onclick = () => div.remove();
}

(async () => {
  const { aiEnabled } = await chrome.storage.sync.get(["aiEnabled"]);
  if (aiEnabled === false) return;

  const title = document.title;
  const url = location.href;
  const description = document.querySelector('meta[name="description"]')?.content || "";
  const classification = classifyWebsite(title, url, description);
  chrome.runtime.sendMessage({ classification, url });
  if (classification === "distracting") injectWarning();
})();
