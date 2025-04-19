// /assets/js/public-appointments.js

const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:3000"
  : "https://www.domingueztechsolutions.com";

const SITE_KEY = "domtech"; // Adjust if needed per deployment

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

      // Show delete button if admin token is present
      const token = localStorage.getItem("adminToken");
      if (token) {
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑️ Delete";
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this appointment?")) {
            deleteAppointment(appt.id, token);
          }
        });
        card.appendChild(deleteBtn);
      }

      container.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    document.getElementById("appointments-container").innerHTML =
      "<p>Failed to load appointments.</p>";
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
      alert(result.error || "Error deleting appointment.");
      return;
    }

    alert("✅ Appointment deleted.");
    fetchAppointments(); // Refresh list
  } catch (err) {
    console.error("❌ Delete error:", err);
    alert("Error deleting appointment.");
  }
}

document.addEventListener("DOMContentLoaded", fetchAppointments);