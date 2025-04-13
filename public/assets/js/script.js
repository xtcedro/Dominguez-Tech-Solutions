// script.js (module)
import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { initializeChatbot } from './chatbot.js';

document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();
  setupNavigation();
  initializeChatbot();
});
