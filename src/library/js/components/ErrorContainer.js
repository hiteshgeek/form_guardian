/**
 * ErrorContainer - Floating error panel component
 * Shows all validation errors with bidirectional highlighting
 */

import { createElement, addClass, removeClass, scrollIntoView, focus, uniqueId } from '../utils/dom.js';

/**
 * SVG Icons
 */
const ICONS = {
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  chevronUp: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

/**
 * ErrorContainer Class
 */
export class ErrorContainer {
  /**
   * Constructor
   * @param {Object} options
   */
  constructor(options = {}) {
    this.options = {
      position: options.position || 'left-bottom',
      maxHeight: options.maxHeight || 200,
      title: options.title || 'Validation Errors',
      collapsed: options.collapsed || false,
      onErrorClick: options.onErrorClick || null,
      ...options
    };

    this.errors = new Map(); // fieldId -> { label, message, element }
    this.isCollapsed = this.options.collapsed;
    this.highlightedErrorId = null;

    this.container = null;
    this.badge = null;
    this.list = null;
    this.body = null;

    this._init();
  }

  /**
   * Initialize container
   * @private
   */
  _init() {
    this._createContainer();
    this._bindEvents();
    this._updateVisibility();
  }

  /**
   * Create container DOM structure
   * @private
   */
  _createContainer() {
    const id = uniqueId('fg-errors');

    // Main container
    this.container = createElement('div', {
      id,
      className: `fg-error-container fg-position-${this.options.position}`,
      'role': 'complementary',
      'aria-label': 'Validation errors'
    });

    // Header
    const header = createElement('div', { className: 'fg-error-header' });

    // Title with icon
    const titleWrapper = createElement('div', { className: 'fg-error-title-wrapper' });
    titleWrapper.innerHTML = ICONS.alertCircle;
    titleWrapper.appendChild(createElement('span', { className: 'fg-error-title' }, this.options.title));

    // Badge
    this.badge = createElement('span', {
      className: 'fg-error-badge',
      'aria-live': 'polite'
    }, '0');

    // Toggle button
    const toggleBtn = createElement('button', {
      className: 'fg-error-toggle',
      'aria-label': 'Toggle error panel',
      'aria-expanded': String(!this.isCollapsed),
      type: 'button'
    });
    toggleBtn.innerHTML = this.isCollapsed ? ICONS.chevronUp : ICONS.chevronDown;
    this.toggleBtn = toggleBtn;

    header.appendChild(titleWrapper);
    header.appendChild(this.badge);
    header.appendChild(toggleBtn);

    // Body
    this.body = createElement('div', {
      className: 'fg-error-body',
      style: { maxHeight: `${this.options.maxHeight}px` }
    });

    if (this.isCollapsed) {
      this.body.style.display = 'none';
    }

    // Error list
    this.list = createElement('ul', {
      className: 'fg-error-list',
      'role': 'list'
    });

    this.body.appendChild(this.list);
    this.container.appendChild(header);
    this.container.appendChild(this.body);

    document.body.appendChild(this.container);
  }

  /**
   * Bind event handlers
   * @private
   */
  _bindEvents() {
    // Toggle collapse - stop propagation to prevent header click handler
    this.toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Header click also toggles
    this.container.querySelector('.fg-error-header').addEventListener('click', (e) => {
      if (e.target.closest('.fg-error-toggle')) return;
      this.toggle();
    });

    // Remove highlight when clicking outside error container and error fields
    this._handleDocumentClick = (e) => {
      if (this.highlightedErrorId === null) return;

      // Check if click is inside error container
      if (this.container.contains(e.target)) return;

      // Check if click is on a field that has an error
      const clickedField = e.target.closest('input, select, textarea');
      if (clickedField && this.errors.has(clickedField.id)) return;

      // Remove highlight
      this.unhighlightAll();
    };
    document.addEventListener('click', this._handleDocumentClick);

    // Remove highlight when focus moves away from error fields
    this._handleDocumentFocusin = (e) => {
      if (this.highlightedErrorId === null) return;

      // Check if focus is inside error container
      if (this.container.contains(e.target)) return;

      // Check if focus is on a field that has an error
      const focusedField = e.target.closest('input, select, textarea');
      if (focusedField && this.errors.has(focusedField.id)) return;

      // Remove highlight
      this.unhighlightAll();
    };
    document.addEventListener('focusin', this._handleDocumentFocusin);
  }

  /**
   * Add error
   * @param {string} fieldId
   * @param {string} label
   * @param {string} message
   */
  addError(fieldId, label, message) {
    // If error already exists, update it in place (preserve order)
    const existingError = this.errors.get(fieldId);
    if (existingError) {
      existingError.label = label;
      existingError.message = message;
      const labelEl = existingError.element.querySelector('.fg-error-item-label');
      const messageEl = existingError.element.querySelector('.fg-error-item-message');
      if (labelEl) {
        labelEl.textContent = label + ':';
      }
      if (messageEl) {
        messageEl.textContent = message;
      }
      return;
    }

    // Create error item
    const item = createElement('li', {
      className: 'fg-error-item',
      'data-field-id': fieldId,
      'role': 'listitem',
      tabindex: '0'
    });

    const labelEl = createElement('strong', { className: 'fg-error-item-label' }, label + ':');
    const messageEl = createElement('span', { className: 'fg-error-item-message' }, message);

    item.appendChild(labelEl);
    item.appendChild(messageEl);

    // Click handler
    item.addEventListener('click', () => this._handleErrorClick(fieldId));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._handleErrorClick(fieldId);
      }
    });

    // Store reference
    this.errors.set(fieldId, {
      label,
      message,
      element: item
    });

    // Add to list
    this.list.appendChild(item);

    // Update
    this._updateBadge();
    this._updateVisibility();
  }

  /**
   * Update error message
   * @param {string} fieldId
   * @param {string} message
   */
  updateError(fieldId, message) {
    const error = this.errors.get(fieldId);
    if (error) {
      error.message = message;
      const messageEl = error.element.querySelector('.fg-error-item-message');
      if (messageEl) {
        messageEl.textContent = message;
      }
    }
  }

  /**
   * Remove error
   * @param {string} fieldId
   */
  removeError(fieldId) {
    const error = this.errors.get(fieldId);
    if (error) {
      error.element.remove();
      this.errors.delete(fieldId);
      this._updateBadge();
      this._updateVisibility();

      if (this.highlightedErrorId === fieldId) {
        this.highlightedErrorId = null;
      }
    }
  }

  /**
   * Clear all errors
   */
  clearAll() {
    this.errors.forEach((error) => {
      error.element.remove();
    });
    this.errors.clear();
    this.highlightedErrorId = null;
    this._updateBadge();
    this._updateVisibility();
  }

  /**
   * Highlight error item
   * @param {string} fieldId
   */
  highlightError(fieldId) {
    // Remove previous highlight
    this.unhighlightAll();

    const error = this.errors.get(fieldId);
    if (error) {
      addClass(error.element, 'fg-error-highlight');
      this.highlightedErrorId = fieldId;

      // Scroll into view within container
      error.element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Unhighlight error item
   * @param {string} fieldId
   */
  unhighlightError(fieldId) {
    const error = this.errors.get(fieldId);
    if (error) {
      removeClass(error.element, 'fg-error-highlight');
      if (this.highlightedErrorId === fieldId) {
        this.highlightedErrorId = null;
      }
    }
  }

  /**
   * Unhighlight all errors
   */
  unhighlightAll() {
    this.errors.forEach((error) => {
      removeClass(error.element, 'fg-error-highlight');
    });
    this.highlightedErrorId = null;
  }

  /**
   * Handle error click
   * @private
   * @param {string} fieldId
   */
  _handleErrorClick(fieldId) {
    this.highlightError(fieldId);

    if (typeof this.options.onErrorClick === 'function') {
      this.options.onErrorClick(fieldId);
    }
  }

  /**
   * Show container
   */
  show() {
    this.container.style.display = '';
    removeClass(this.container, 'fg-hidden');
  }

  /**
   * Hide container
   */
  hide() {
    addClass(this.container, 'fg-hidden');
  }

  /**
   * Toggle collapse state
   */
  toggle() {
    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {
      this.body.style.display = 'none';
      this.toggleBtn.innerHTML = ICONS.chevronUp;
      addClass(this.container, 'fg-collapsed');
    } else {
      this.body.style.display = '';
      this.toggleBtn.innerHTML = ICONS.chevronDown;
      removeClass(this.container, 'fg-collapsed');
    }

    this.toggleBtn.setAttribute('aria-expanded', String(!this.isCollapsed));
  }

  /**
   * Expand container
   */
  expand() {
    if (this.isCollapsed) {
      this.toggle();
    }
  }

  /**
   * Collapse container
   */
  collapse() {
    if (!this.isCollapsed) {
      this.toggle();
    }
  }

  /**
   * Update badge count
   * @private
   */
  _updateBadge() {
    const count = this.errors.size;
    this.badge.textContent = String(count);
    this.badge.setAttribute('aria-label', `${count} error${count !== 1 ? 's' : ''}`);
  }

  /**
   * Update visibility based on error count
   * @private
   */
  _updateVisibility() {
    if (this.errors.size === 0) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Get error count
   * @returns {number}
   */
  get count() {
    return this.errors.size;
  }

  /**
   * Check if has errors
   * @returns {boolean}
   */
  get hasErrors() {
    return this.errors.size > 0;
  }

  /**
   * Get all error field IDs
   * @returns {string[]}
   */
  getFieldIds() {
    return Array.from(this.errors.keys());
  }

  /**
   * Set position
   * @param {string} position - 'left-bottom', 'right-bottom', etc.
   */
  setPosition(position) {
    removeClass(this.container, `fg-position-${this.options.position}`);
    this.options.position = position;
    addClass(this.container, `fg-position-${position}`);
  }

  /**
   * Set max height
   * @param {number} height
   */
  setMaxHeight(height) {
    this.options.maxHeight = height;
    this.body.style.maxHeight = `${height}px`;
  }

  /**
   * Destroy container
   */
  destroy() {
    // Remove document event listeners
    if (this._handleDocumentClick) {
      document.removeEventListener('click', this._handleDocumentClick);
    }
    if (this._handleDocumentFocusin) {
      document.removeEventListener('focusin', this._handleDocumentFocusin);
    }

    this.clearAll();
    this.container.remove();
    this.container = null;
    this.list = null;
    this.body = null;
    this.badge = null;
    this.toggleBtn = null;
  }
}

export default ErrorContainer;
