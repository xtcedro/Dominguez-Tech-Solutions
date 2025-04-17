// assets/js/analytics.js

document.addEventListener("DOMContentLoaded", fetchSiteAnalytics);

async function fetchSiteAnalytics() {
  const API_BASE_URL = window.location.origin.includes("localhost")
    ? "http://localhost:3000"
    : "https://www.domingueztechsolutions.com";

  const container = document.getElementById("analytics-container");
  container.innerHTML = "<p class='loading'>📊 Gathering site analytics...</p>";

  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics`, {
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    container.innerHTML = "";

    const metrics = [
      { label: "Total Appointments", value: data.totalAppointments },
      { label: "Total Messages", value: data.totalMessages },
      { label: "Total Blog Posts", value: data.totalBlogs },
      { label: "Projects (Heavenly Roofing)", value: data.totalProjects }
    ];

    metrics.forEach(metric => {
      const card = document.createElement("div");
      card.className = "analytics-card";
      card.innerHTML = `
        <h3>${metric.label}</h3>
        <p>${metric.value}</p>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error("❌ Analytics Fetch Error:", err.message);
    container.innerHTML = `<p class='error-message'>❌ Failed to load analytics: ${err.message}</p>`;
  }
}