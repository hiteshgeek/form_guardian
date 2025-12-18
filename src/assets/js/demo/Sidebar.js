/**
 * FormGuardian Sidebar
 * Handles sidebar resize, toggle, and responsiveness
 */

export class Sidebar {
  /**
   * Create sidebar
   * @param {Object} options
   */
  constructor(options = {}) {
    this.element = options.element;
    this.resizeHandle = options.resizeHandle;
    this.toggleButton = options.toggleButton;
    this.closeButton = options.closeButton;

    this.storageKey = 'fg-sidebar-width';
    this.minWidth = 280;
    this.maxWidth = 500;
    this.defaultWidth = 340;

    this.isResizing = false;
    this.isOpen = true;

    this.init();
  }

  /**
   * Initialize sidebar
   */
  init() {
    if (!this.element) return;

    // Restore width from storage
    this.restoreWidth();

    // Bind events
    this.bindResizeEvents();
    this.bindToggleEvents();
    this.bindResponsiveEvents();

    // Check initial responsive state
    this.checkResponsive();
  }

  /**
   * Bind resize handle events
   */
  bindResizeEvents() {
    if (!this.resizeHandle) return;

    this.resizeHandle.addEventListener('mousedown', (e) => {
      this.startResize(e);
    });

    // Touch support
    this.resizeHandle.addEventListener('touchstart', (e) => {
      this.startResize(e.touches[0]);
    }, { passive: true });
  }

  /**
   * Start resize operation
   * @param {MouseEvent|Touch} e
   */
  startResize(e) {
    this.isResizing = true;
    this.startX = e.clientX;
    this.startWidth = this.element.offsetWidth;

    document.body.classList.add('fg-resizing');
    document.body.style.cursor = 'ew-resize';

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      this.resize(clientX);
    };

    const handleEnd = () => {
      this.endResize();
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: true });
    document.addEventListener('touchend', handleEnd);
  }

  /**
   * Handle resize
   * @param {number} clientX
   */
  resize(clientX) {
    if (!this.isResizing) return;

    const diff = clientX - this.startX;
    const newWidth = Math.min(this.maxWidth, Math.max(this.minWidth, this.startWidth + diff));

    this.setWidth(newWidth);
  }

  /**
   * Set sidebar width and update CSS variable for main content
   * @param {number} width
   */
  setWidth(width) {
    const widthPx = `${width}px`;

    // Update sidebar element
    this.element.style.width = widthPx;
    this.element.style.flexBasis = widthPx;

    // Update CSS variable so main content margin adjusts
    document.documentElement.style.setProperty('--fg-demo-sidebar-width', widthPx);
  }

  /**
   * End resize operation
   */
  endResize() {
    this.isResizing = false;
    document.body.classList.remove('fg-resizing');
    document.body.style.cursor = '';

    // Save width
    this.saveWidth();
  }

  /**
   * Save width to localStorage
   */
  saveWidth() {
    try {
      localStorage.setItem(this.storageKey, this.element.offsetWidth.toString());
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Restore width from localStorage
   */
  restoreWidth() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const width = parseInt(saved, 10);
        if (width >= this.minWidth && width <= this.maxWidth) {
          this.setWidth(width);
        }
      }
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Bind toggle button events
   */
  bindToggleEvents() {
    this.toggleButton?.addEventListener('click', () => {
      this.toggle();
    });

    this.closeButton?.addEventListener('click', () => {
      this.close();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen && window.innerWidth < 768) {
        this.close();
      }
    });

    // Close on overlay click (mobile)
    this.element?.addEventListener('click', (e) => {
      if (e.target === this.element && window.innerWidth < 768) {
        this.close();
      }
    });
  }

  /**
   * Bind responsive events
   */
  bindResponsiveEvents() {
    let resizeTimeout;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.checkResponsive();
      }, 100);
    });
  }

  /**
   * Check and apply responsive behavior
   */
  checkResponsive() {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      this.element?.classList.add('fg-sidebar-mobile');
      if (!this.element?.classList.contains('fg-sidebar-open')) {
        this.close();
      }
    } else {
      this.element?.classList.remove('fg-sidebar-mobile');
      this.open();
    }
  }

  /**
   * Open sidebar
   */
  open() {
    this.isOpen = true;
    this.element?.classList.add('fg-sidebar-open');
    this.toggleButton?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('fg-sidebar-visible');
  }

  /**
   * Close sidebar
   */
  close() {
    this.isOpen = false;
    this.element?.classList.remove('fg-sidebar-open');
    this.toggleButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('fg-sidebar-visible');
  }

  /**
   * Toggle sidebar
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Get current width
   * @returns {number}
   */
  getWidth() {
    return this.element?.offsetWidth || this.defaultWidth;
  }
}

export default Sidebar;
