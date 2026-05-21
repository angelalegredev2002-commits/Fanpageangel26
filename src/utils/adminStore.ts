// src/utils/adminStore.ts
// Simple client‑side store for admin UI state (sidebar collapse, theme, language).
// Uses localStorage for persistence across page loads.

export const adminState = {
  // Collapse state of the sidebar. Initialized from localStorage.
  isSidebarCollapsed: JSON.parse(localStorage.getItem('admin_sidebar_collapsed') ?? 'false') as boolean,
};

/**
 * Toggle the collapsed state of the admin sidebar.
 * Updates the reactive object, persists to localStorage and adjusts the DOM.
 */
export function toggleSidebar() {
  adminState.isSidebarCollapsed = !adminState.isSidebarCollapsed;
  localStorage.setItem('admin_sidebar_collapsed', JSON.stringify(adminState.isSidebarCollapsed));
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('collapsed', adminState.isSidebarCollapsed);
  }
}

/**
 * Initialize sidebar collapsed state on page load.
 */
export function initSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;
  const collapsed = JSON.parse(localStorage.getItem('admin_sidebar_collapsed') ?? 'false');
  if (collapsed) {
    sidebar.classList.add('collapsed');
    document.body.setAttribute('data-sidebar-collapsed', 'true');
  }
}

/**
 * Set the theme ("light" | "dark"). Mirrors the existing ThemeBtn logic.
 */
export function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem('hs_theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

/**
 * Set the language (e.g., "en" | "es").
 */
export function setLang(lang: string) {
  localStorage.setItem('lang', lang);
}
