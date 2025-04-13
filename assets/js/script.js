// script.js (module)

import { setupNavigation } from './navigation.js';
import { setupThemeToggle } from './theme-toggle.js';

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupThemeToggle();
});