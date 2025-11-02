Absolutely — here’s a clean, well-structured **README.md** for your Chrome Extension project **FocusFlow AI** 👇

---

### 🧘‍♂️ FocusFlow AI — Chrome Extension

> *Stay focused. Beat procrastination. Work smarter.*

---

#### 🚀 Overview

**FocusFlow AI** is an intelligent productivity extension designed to help you stay focused by blocking distracting websites, analyzing your browsing habits, and gently reminding you to refocus when your attention drifts.

With adaptive focus sessions, distraction analytics, and time-based alerts — FocusFlow AI keeps your workflow smooth and your goals on track.

---

#### 🧩 Features

* 🎯 **Focus Mode:** Temporarily blocks distracting sites like YouTube, Instagram, Twitter, etc.
* 🔒 **Smart Whitelisting:** Temporarily allow specific sites during focus sessions.
* 📊 **Productivity Analytics:** Visualize your browsing habits with a daily pie chart.
* ⏰ **Timed Focus Sessions:** Automatically ends when the session duration expires.
* 🔔 **Distraction Alerts:** Sends gentle notifications every 5 minutes when focus mode is off and you’re browsing distracting sites.
* 💾 **Local Storage:** Keeps logs of your focus sessions and productivity data securely on your device.

---

#### ⚙️ Installation

1. **Clone or download** this repository.

   ```bash
   git clone https://github.com/yourusername/focusflow-ai.git
   cd focusflow-ai
   ```
2. Open **Google Chrome** and go to:

   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode** (top right corner).
4. Click **“Load unpacked”** and select your project folder.
5. The FocusFlow AI icon will appear in your Chrome toolbar.

---

#### 📁 Project Structure

```
FocusFlowAI/
│
├── manifest.json                # Chrome extension manifest (v3)
├── background.js                # Core logic for blocking, timers & notifications
├── content.js                   # Optional future content script
├── popup.html                   # Focus control UI
├── popup.js                     # Popup functionality
├── analytics.html               # Full-screen analytics dashboard
├── analytics.js                 # Chart rendering logic using Chart.js
├── blocked.html                 # Displayed when visiting a blocked site
├── libs/
│   └── chart.js                 # Chart.js library
└── icons/
    └── focus.jpeg               # Extension icon
```

---

#### 🧠 How It Works

* When **Focus Mode** starts:

  * All listed distracting sites are blocked instantly.
  * Any attempt to open them redirects to `blocked.html`.
* When **Focus Mode** ends:

  * A notification is displayed.
  * A background timer starts — every **5 minutes**, FocusFlow checks if you’re browsing a blocked site while focus is off.
  * If yes, a reminder notification appears:

    > “⚠️ You’re on a distracting site. Time to refocus!”
* All activity is logged and can be viewed in the **Analytics Dashboard**.

---

#### 📊 Analytics Dashboard

The `analytics.html` file visualizes your daily productivity:

* Productive vs. Distracting site ratio (Pie chart)
* Logs are automatically loaded from local storage.
* Data refreshes each day automatically.

---

#### 🔔 Notifications Used

* **Focus Session Ended**
* **Distraction Reminder (every 5 mins if off-focus)**
* **Blocking On/Off** logs in console for debugging.

---

#### 🧰 Permissions Used

```json
"permissions": [
  "tabs",
  "storage",
  "activeTab",
  "scripting",
  "notifications"
],
"host_permissions": ["<all_urls>"]
```

These allow the extension to:

* Detect the current active tab
* Block or redirect distracting sites
* Store session data
* Display notifications

---

#### 🧑‍💻 Development Notes

* Uses **Manifest v3** for Chrome compatibility.
* Inline scripts are replaced with JS files to comply with CSP.
* Analytics built with **Chart.js** (v4+) via `libs/chart.js`.
* Background logic uses `chrome.declarativeNetRequest` API for blocking.

---

#### 💡 Future Enhancements

* 🕓 Customizable alert intervals (5, 10, 15 mins)
* 🧠 AI-powered productivity suggestions
* 🧾 Weekly productivity reports
* 🌙 Dark mode for analytics page



