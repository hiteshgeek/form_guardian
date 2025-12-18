/**
 * FormGuardian Theme Switcher
 * Handles light/dark/system theme switching with localStorage persistence
 */

export class ThemeSwitcher {
  /**
   * Create theme switcher
   * @param {Object} options
   */
  constructor(options = {}) {
    this.storageKey = 'fg-theme';
    this.initialTheme = options.initialTheme || this.getStoredTheme() || 'light';
    this.buttons = document.querySelectorAll('.fg-theme-btn');

    this.init();
  }

  /**
   * Initialize theme switcher
   */
  init() {
    // Apply initial theme
    this.setTheme(this.initialTheme);

    // Bind button events
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        this.setTheme(theme);
      });
    });

    // Watch for system preference changes
    this.watchSystemPreference();
  }

  /**
   * Set theme
   * @param {string} theme - 'light', 'dark', or 'system'
   */
  setTheme(theme) {
    this.currentTheme = theme;

    // Store preference
    this.storeTheme(theme);
    document.cookie = `fg-theme=${theme}; path=/; max-age=31536000`;

    // Apply theme
    this.applyTheme();

    // Update button states
    this.updateButtons();
  }

  /**
   * Apply current theme to document
   */
  applyTheme() {
    const html = document.documentElement;
    let effectiveTheme;

    if (this.currentTheme === 'system') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    } else {
      effectiveTheme = this.currentTheme;
    }

    html.setAttribute('data-theme', effectiveTheme);

    // Update Prism theme
    this.updatePrismTheme(effectiveTheme);
  }

  /**
   * Update Prism syntax highlighting theme
   * @param {string} theme - 'light' or 'dark'
   */
  updatePrismTheme(theme) {
    const lightTheme = document.getElementById('prism-theme-light');
    const darkTheme = document.getElementById('prism-theme-dark');

    if (lightTheme && darkTheme) {
      if (theme === 'dark') {
        lightTheme.disabled = true;
        darkTheme.disabled = false;
      } else {
        lightTheme.disabled = false;
        darkTheme.disabled = true;
      }
    }
  }

  /**
   * Update button active states
   */
  updateButtons() {
    this.buttons.forEach(btn => {
      const isActive = btn.dataset.theme === this.currentTheme;
      btn.classList.toggle('fg-theme-btn-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  /**
   * Watch for system preference changes
   */
  watchSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (this.currentTheme === 'system') {
        this.applyTheme();
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange);
    }
  }

  /**
   * Get stored theme from localStorage
   * @returns {string|null}
   */
  getStoredTheme() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (e) {
      return null;
    }
  }

  /**
   * Store theme in localStorage
   * @param {string} theme
   */
  storeTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Get current effective theme
   * @returns {string}
   */
  getEffectiveTheme() {
    if (this.currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.currentTheme;
  }
}

export default ThemeSwitcher;
