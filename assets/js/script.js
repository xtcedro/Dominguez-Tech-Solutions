// script.js (module)
import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { setupThemeToggle } from './theme-toggle.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();
  setupNavigation();
  setupThemeToggle();
});
