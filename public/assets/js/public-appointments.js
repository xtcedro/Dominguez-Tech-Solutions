const API_BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://www.domingueztechsolutions.com';

async function fetchAppointments() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const appointments = await response.json();
    const appointmentsContainer = document.getElementById('appointments-container');
    appointmentsContainer.innerHTML = '';

    if (appointments.length === 0) {
      appointmentsContainer.innerHTML = '<p class="no-appointments">No appointments found. 📅</p>';
      return;
    }

    appointments.forEach((appointment) => {
      const appointmentCard = document.createElement('div');
      appointmentCard.className = 'appointment-card';

      const formattedDate = new Date(appointment.created_at).toLocaleString();

      appointmentCard.innerHTML = `
        <h3>👤 ${appointment.name}</h3>
        <p><strong>📧 Email:</strong> ${appointment.email}</p>
        <p><strong>📞 Phone:</strong> ${appointment.phone}</p>
        <p><strong>📅 Booked On:</strong> ${formattedDate}</p>
        <p><strong>🛠️ Service:</strong> ${appointment.service || 'Service not specified.'}</p>
        <p><strong>💬 Details:</strong> ${appointment.message || 'No additional details provided.'}</p>
        <button class="delete-btn" data-id="${appointment.id}">🗑️ Delete</button>
      `;

      appointmentsContainer.appendChild(appointmentCard);
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await deleteAppointment(id);
      });
    });

  } catch (error) {
    const appointmentsContainer = document.getElementById('appointments-container');
    appointmentsContainer.innerHTML = `<p class="error-message">Error fetching appointments: ${error.message}</p>`;
    console.error('Error fetching appointments:', error);
  }
}



document.addEventListener('DOMContentLoaded', fetchAppointments);