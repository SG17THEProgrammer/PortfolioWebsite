/**
 * darkmode.js
 * Handles dark/light theme toggling with localStorage persistence
 * and system-preference detection.
 */

const STORAGE_KEY = 'portfolio-theme';
const DARK_CLASS  = 'dark';

/**
 * Apply a theme to the document and persist the choice.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle(DARK_CLASS, isDark);
  localStorage.setItem(STORAGE_KEY, theme);
  updateToggleIcon(isDark);
}

/** Update the toggle button icon to reflect the current theme. */
function updateToggleIcon(isDark) {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  btn.setAttribute('title',      isDark ? 'Switch to light mode' : 'Switch to dark mode');
  const icon = btn.querySelector('i');
  if (!icon) return;
  icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/** Toggle between dark and light. */
function toggleTheme() {
  const isDark = document.documentElement.classList.contains(DARK_CLASS);
  applyTheme(isDark ? 'light' : 'dark');
}

/** Boot: respect localStorage → system preference → default light. */
function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    applyTheme(stored);
    return;
  }
  // Detect OS preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

export { initTheme, toggleTheme };
