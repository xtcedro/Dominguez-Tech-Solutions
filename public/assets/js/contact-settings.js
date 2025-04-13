document.addEventListener("DOMContentLoaded", async () => {
  const contactSection = document.getElementById("contact-data");
  if (!contactSection) return;

  try {
    const response = await fetch("/api/settings?site=domtech");
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    contactSection.innerHTML = `
      <li>Email: <a href="mailto:${data.contact_email}">${data.contact_email}</a></li>
      <li>Phone (text only): <a href="tel:${data.business_phone}">${data.business_phone}</a></li>
      <li>Location: 1611 NW 30th St, Oklahoma City, OK 73118</li>
    `;
  } catch (err) {
    console.error("Error fetching contact settings:", err);
    contactSection.innerHTML = `<li>Unable to load contact information at this time.</li>`;
  }
});