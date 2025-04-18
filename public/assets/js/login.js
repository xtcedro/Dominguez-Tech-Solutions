document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  // Auto-redirect if already logged in
  const token = localStorage.getItem("adminToken");
  if (token) {
    window.location.href = "admin-dashboard.html";
    return;
  }

  // Define the site key depending on which site is using this login
  const siteKey = "domtech"; // or "heavenlyroofing", etc.

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.username.value;
    const password = form.password.value;

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, siteKey })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        loginMessage.textContent = "✅ Login successful! Redirecting...";
        setTimeout(() => {
          window.location.href = "admin-dashboard.html";
        }, 1000);
      } else {
        loginMessage.textContent = `❌ ${data.error}`;
      }
    } catch (err) {
      loginMessage.textContent = "❌ Server error. Please try again later.";
      console.error("Login Error:", err.message);
    }
  });
});