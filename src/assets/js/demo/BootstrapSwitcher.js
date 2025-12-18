/**
 * FormGuardian Bootstrap Version Switcher
 * Handles Bootstrap version switching by reloading the page with new version
 */

export class BootstrapSwitcher {
  /**
   * Create Bootstrap switcher
   * @param {Object} options
   */
  constructor(options = {}) {
    this.currentVersion = options.currentVersion || 5;
    this.selector = document.getElementById('bs-version');

    this.init();
  }

  /**
   * Initialize switcher
   */
  init() {
    if (!this.selector) return;

    // Set current value
    this.selector.value = this.currentVersion.toString();

    // Bind change event
    this.selector.addEventListener('change', (e) => {
      this.switchVersion(parseInt(e.target.value, 10));
    });
  }

  /**
   * Switch Bootstrap version
   * @param {number} version
   */
  switchVersion(version) {
    if (version === this.currentVersion) return;

    // Update URL and reload
    const url = new URL(window.location.href);
    url.searchParams.set('bs', version);

    window.location.href = url.toString();
  }

  /**
   * Get current Bootstrap version
   * @returns {number}
   */
  getVersion() {
    return this.currentVersion;
  }
}

export default BootstrapSwitcher;
