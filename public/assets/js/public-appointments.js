// /assets/js/public-appointments.js

const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:3000"
  : "https://www.domingueztechsolutions.com";

const SITE_KEY = "domtech"; // Adjust this if needed

function showResponse(message, success = true) {
  const msgBox = document.getElementById("response-message");
  msgBox.textContent = message;
  msgBox.style.color = success ? "#10b981" : "#ef4444"; // green or red
  msgBox.style.fontWeight = "600";
  msgBox.style.marginBottom = "1rem";

  setTimeout(() => {
    msgBox.textContent = "";
  }, 4000);
}

async function fetchAppointments() {
  try {
    const res = await fetch(`${API_BASE}/api/appointments?site=${SITE_KEY}`);
    const appointments = await res.json();

    const container = document.getElementById("appointments-container");
    container.innerHTML = "";

    if (!appointments.length) {
      container.innerHTML = "<p>No appointments found.</p>";
      return;
    }

    appointments.forEach((appt) => {
      const card = document.createElement("div");
      card.className = "appointment-card";
      card.innerHTML = `
        <h3>${appt.name}</h3>
        <p><strong>Phone:</strong> ${appt.phone}</p>
        <p><strong>Email:</strong> ${appt.email}</p>
        <p><strong>Service:</strong> ${appt.service}</p>
        <p><strong>Message:</strong> ${appt.message || "—"}</p>
        <p><small>Submitted: ${new Date(appt.created_at).toLocaleString()}</small></p>
      `;

      const token = localStorage.getItem("adminToken");
      if (token) {
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑️ Delete";
        deleteBtn.addEventListener("click", () => {
          deleteAppointment(appt.id, token);
        });
        card.appendChild(deleteBtn);
      }

      container.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    document.getElementById("appointments-container").innerHTML =
      "<p>Failed to load appointments.</p>";
    showResponse("Error loading appointments", false);
  }
}

async function deleteAppointment(id, token) {
  try {
    const res = await fetch(`${API_BASE}/api/appointments/${id}?site=${SITE_KEY}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const result = await res.json();

    if (!res.ok) {
      showResponse(result.error || "Error deleting appointment.", false);
      return;
    }

    showResponse("✅ Appointment deleted successfully.");
    fetchAppointments(); // Refresh list
  } catch (err) {
    console.error("❌ Delete error:", err);
    showResponse("Error deleting appointment.", false);
  }
}

document.addEventListener("DOMContentLoaded", fetchAppointments);