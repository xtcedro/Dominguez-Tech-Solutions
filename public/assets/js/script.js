// script.js (module)
import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();
  setupNavigation();
});
