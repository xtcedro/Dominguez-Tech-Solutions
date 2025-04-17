// assets/js/analytics.js

document.addEventListener("DOMContentLoaded", fetchSiteAnalytics);

async function fetchSiteAnalytics() {
  const API_BASE_URL = window.location.origin.includes("localhost")
    ? "http://localhost:3000"
    : "https://www.domingueztechsolutions.com";

  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics`, {
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    const data = await response.json();

    // Populate metric values
    document.getElementById("total-appointments").textContent = data.totalAppointments ?? "0";
    document.getElementById("total-blogs").textContent = data.totalBlogs ?? "0";
    document.getElementById("total-messages").textContent = data.totalMessages ?? "0";
    document.getElementById("total-transactions").textContent = data.totalTransactions ?? "0";

    // Populate logs if available
    const logsContainer = document.getElementById("activity-logs");
    logsContainer.innerHTML = "";

    if (Array.isArray(data.logs) && data.logs.length > 0) {
      data.logs.forEach((log) => {
        const li = document.createElement("li");
        li.textContent = `📝 ${log}`;
        logsContainer.appendChild(li);
      });
    } else {
      logsContainer.innerHTML = "<li>No recent activity logs found.</li>";
    }

  } catch (err) {
    console.error("❌ Analytics Fetch Error:", err.message);

    document.getElementById("total-appointments").textContent = "❌";
    document.getElementById("total-blogs").textContent = "❌";
    document.getElementById("total-messages").textContent = "❌";
    document.getElementById("total-transactions").textContent = "❌";
    
    const logsContainer = document.getElementById("activity-logs");
    logsContainer.innerHTML = `<li class="error">❌ Failed to load analytics: ${err.message}</li>`;
  }
}