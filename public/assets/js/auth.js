function requireAdminToken(redirectUrl = "login.html") {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("❌ Access denied. Admin login required.");
    window.location.href = redirectUrl;
  }
}

// Immediately check for token when script runs
requireAdminToken();