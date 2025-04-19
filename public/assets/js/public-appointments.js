// /assets/js/public-appointments.js

const API_BASE = window.location.origin.includes("localhost")
  ? "http://localhost:3000"
  : "https://www.domingueztechsolutions.com";

const SITE_KEY = "domtech"; // Or dynamically load this

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
        <button data-id="${appt.id}" class="delete-btn">🗑️ Delete</button>
      `;

      card.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this appointment?")) {
          deleteAppointment(appt.id);
        }
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    document.getElementById("appointments-container").innerHTML =
      "<p>Failed to load appointments.</p>";
  }
}

async function deleteAppointment(id) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("Unauthorized: Please log in to delete appointments.");
    return;
  }

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
    console.error("Delete error:", err);
    alert("Error deleting appointment.");
  }
}
