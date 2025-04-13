// theme-toggle.js

export function setupThemeToggle() {
  const toggleButton = document.getElementById("theme-toggle");
  if (!toggleButton) return;

  // Apply saved theme on load
  applySavedTheme();

  toggleButton.addEventListener("click", () => {
    toggleTheme();
  });
}

export function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
}

export function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";

  document.body.classList.toggle("dark-theme", isDark);
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById("theme-toggle-icon");
  if (!icon) return;

  icon.textContent = isDark ? "🌙" : "☀️";
}