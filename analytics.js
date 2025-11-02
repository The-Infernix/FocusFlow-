document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("chart");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  const ctx = canvas.getContext("2d");
  const todayKey = new Date().toDateString();

  console.log("Loading analytics for:", todayKey);

  chrome.storage.local.get([todayKey], (res) => {
    const logs = res[todayKey] || [];

    console.log("Retrieved logs:", logs);
    console.log("Chart.js loaded:", typeof Chart !== "undefined");

    // Handle array or object format
    let productive = 0, distracting = 0, neutral = 0;

    if (Array.isArray(logs)) {
      logs.forEach((entry) => {
        if (entry.productive === true) productive++;
        else if (entry.productive === false) distracting++;
        else neutral++;
      });
    } else {
      // Old format fallback
      productive = logs.productive || 0;
      distracting = logs.distracting || 0;
      neutral = logs.neutral || 0;
    }

    console.log("Summarized Data:", { productive, distracting, neutral });

    if (typeof Chart === "undefined") {
      alert("Chart.js not loaded!");
      return;
    }

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Productive", "Distracting", "Neutral"],
        datasets: [
          {
            data: [productive, distracting, neutral],
            backgroundColor: ["#4CAF50", "#F44336", "#9E9E9E"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "FocusFlow Daily Breakdown",
          },
        },
      },
    });

    // Optional: show a short summary below the chart
    const total = productive + distracting + neutral;
    const summary = document.createElement("p");
    summary.style.marginTop = "10px";
    summary.style.fontSize = "16px";
    if (total > 0) {
      const percent = ((productive / total) * 100).toFixed(1);
      summary.textContent = `You were ${percent}% productive today 🎯`;
    } else {
      summary.textContent = "No activity data recorded yet.";
    }
    document.body.appendChild(summary);
  });
});
