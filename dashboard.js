function loadTodayDataAndRender() {
  const key = new Date().toDateString();
  chrome.storage.local.get([key], (res) => {
    const logs = res[key] || [];
    const productive = logs.filter(l => l.productive).length;
    const distracting = logs.length - productive;

    // render chart
    const ctx = document.getElementById("prodChart").getContext("2d");
    // destroy existing chart if re-run
    if (window._focusChart) {
      window._focusChart.destroy();
    }
    window._focusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Productive', 'Distracting'],
        datasets: [{
          data: [productive, distracting],
          backgroundColor: ['#4CAF50', '#F44336']
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // summary text
    document.getElementById("summary").innerHTML = `<p><b>Total events:</b> ${logs.length}</p>`;

    // logs table
    const logsHtml = logs.slice().reverse().map(l => {
      return `<tr>
        <td>${new Date(l.time).toLocaleTimeString()}</td>
        <td>${l.site}</td>
        <td>${l.productive ? 'Productive' : 'Distracting'}</td>
        <td>${l.wasBlocked ? 'Blocked' : ''}</td>
      </tr>`;
    }).join('');

    document.getElementById("logs").innerHTML = `<table>
      <thead><tr><th>Time</th><th>Site</th><th>Type</th><th>Note</th></tr></thead>
      <tbody>${logsHtml}</tbody></table>`;
  });
}

document.addEventListener("DOMContentLoaded", loadTodayDataAndRender);
