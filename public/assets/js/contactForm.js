// public/assets/js/contactForm.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  const messageContainer = document.createElement("p");
  messageContainer.id = "contactMessage";
  messageContainer.style.marginTop = "1rem";
  messageContainer.style.fontWeight = "bold";
  form.appendChild(messageContainer);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      displayMessage("❌ Please fill out all required fields.", "error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (res.ok) {
        displayMessage("✅ Your message has been submitted successfully!", "success");
        form.reset();
      } else {
        displayMessage(`❌ ${data.error}`, "error");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      displayMessage("❌ Something went wrong. Please try again later.", "error");
    }
  });

  function displayMessage(text, type) {
    messageContainer.textContent = text;
    messageContainer.style.color = type === "success" ? "gold" : "#ff5e5e";
  }
});