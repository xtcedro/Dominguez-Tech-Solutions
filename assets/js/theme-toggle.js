// assets/js/theme-toggle.js

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  const icon = document.querySelector(".toggle-switch .icon");
  const currentTheme = localStorage.getItem("theme");

  // Initialize theme based on saved preference
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    toggle.checked = true;
    icon.textContent = "🌞";
  } else {
    document.body.classList.remove("light-theme");
    toggle.checked = false;
    icon.textContent = "🌙";
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
      icon.textContent = "🌞";
    } else {
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
      icon.textContent = "🌙";
    }
  });
});