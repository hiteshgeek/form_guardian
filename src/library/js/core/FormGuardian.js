/**
 * FormGuardian - Main Form Validation Class
 * A vanilla JavaScript form validation library supporting Bootstrap 3, 4, and 5
 */

import { $, getElement, getFieldValue, isEmptyValue, scrollIntoView, focus } from '../utils/dom.js';
import { debounce } from '../utils/debounce.js';
import { Validator } from './Validator.js';
import { FieldManager } from './FieldManager.js';
import { getAdapter } from '../adapters/index.js';
import { ErrorContainer } from '../components/ErrorContainer.js';
import { LabelTooltip } from '../components/LabelTooltip.js';
import { getAllRules } from '../rules/index.js';

/**
 * Default options
 */
const DEFAULTS = {
  bootstrapVersion: 'auto',      // 3, 4, 5, or 'auto'
  validateOn: ['blur', 'submit'], // Events to trigger validation
  liveValidation: true,          // Validate on input with debounce
  debounceMs: 300,               // Debounce delay for live validation
  inputMasking: true,            // Prevent invalid input in real-time
  showErrorContainer: true,      // Show floating error container
  errorContainerPosition: 'left-bottom', // Position of error container
  errorContainerHeight: 200,     // Max height of error container
  showLabelTooltips: false,      // Show validation rules tooltip on field labels
  labelTooltipTitle: 'Validation Rules', // Title for label tooltips
  scrollToError: true,           // Scroll to first error on submit
  focusOnError: true,            // Focus first error field on submit
  stopOnFirstError: false,       // Stop validation on first error
  fieldSelector: 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea',
  formGroupSelector: null,       // Auto-detected based on Bootstrap version
  errorClass: null,              // Auto-detected based on Bootstrap version
  validClass: null,              // Auto-detected based on Bootstrap version
  pendingClass: 'fg-pending',    // Class for async validation pending
  highlightClass: 'fg-field-highlight', // Class for highlighting fields
  onFieldValidated: null,        // Callback: (field, isValid, errors) => {}
  onFormValidated: null,         // Callback: (isValid, errors) => {}
  onError: null,                 // Callback: (field, error) => {}
  onSuccess: null,               // Callback: (field) => {}
};

/**
 * FormGuardian Class
 */
export class FormGuardian {
  /**
   * Static defaults - can be modified globally
   */
  static defaults = { ...DEFAULTS };

  /**
   * Static instances registry
   */
  static instances = new Map();

  /**
   * Constructor
   * @param {string|Element} formSelector - Form element or selector
   * @param {Object} options - Configuration options
   */
  constructor(formSelector, options = {}) {
    this.form = getElement(formSelector);

    if (!this.form || this.form.tagName !== 'FORM') {
      throw new Error('[FormGuardian] Invalid form element or selector');
    }

    // Merge options
    this.options = { ...FormGuardian.defaults, ...options };

    // Core components
    this.validator = new Validator(this);
    this.fieldManager = new FieldManager(this);
    this.adapter = null;
    this.errorContainer = null;
    this.labelTooltip = null;

    // State
    this.isInitialized = false;
    this.isSubmitting = false;
    this.errors = new Map(); // fieldId -> error message

    // Bound handlers
    this._boundHandlers = {
      onSubmit: this._handleSubmit.bind(this),
      onBlur: this._handleBlur.bind(this),
      onInput: debounce(this._handleInput.bind(this), this.options.debounceMs),
      onChange: this._handleChange.bind(this),
      onFocus: this._handleFocus.bind(this),
    };

    // Initialize
    this._init();

    // Register instance
    FormGuardian.instances.set(this.form, this);
  }

  /**
   * Initialize FormGuardian
   * @private
   */
  _init() {
    // Detect and set Bootstrap adapter
    this._initAdapter();

    // Initialize error container if enabled
    if (this.options.showErrorContainer) {
      this._initErrorContainer();
    }

    // Initialize label tooltips if enabled
    if (this.options.showLabelTooltips) {
      this._initLabelTooltips();
    }

    // Bind form events
    this._bindEvents();

    // Initialize fields from data attributes
    this._initFieldsFromDataAttributes();

    // Mark as initialized
    this.isInitialized = true;

    // Disable native validation
    this.form.setAttribute('novalidate', 'true');
  }

  /**
   * Initialize Bootstrap adapter
   * @private
   */
  _initAdapter() {
    let version = this.options.bootstrapVersion;

    if (version === 'auto') {
      version = this._detectBootstrapVersion();
    }

    this.adapter = getAdapter(version, this.form);
    this.bootstrapVersion = version;
  }

  /**
   * Detect Bootstrap version from loaded CSS/JS
   * @private
   * @returns {number} Bootstrap version (3, 4, or 5)
   */
  _detectBootstrapVersion() {
    // Check for Bootstrap 5 specific classes/features
    const testEl = document.createElement('div');
    testEl.className = 'visually-hidden';
    document.body.appendChild(testEl);
    const isBS5 = getComputedStyle(testEl).position === 'absolute';
    document.body.removeChild(testEl);

    if (isBS5) return 5;

    // Check for Bootstrap 4 (uses is-invalid class)
    const testEl2 = document.createElement('div');
    testEl2.className = 'is-invalid';
    document.body.appendChild(testEl2);
    const hasIsInvalid = getComputedStyle(testEl2).display !== undefined;
    document.body.removeChild(testEl2);

    // Check for jQuery and Bootstrap global
    if (typeof window.bootstrap !== 'undefined') return 5;
    if (typeof window.jQuery !== 'undefined' && typeof window.jQuery.fn.modal !== 'undefined') {
      // BS4 uses Popper, BS3 doesn't
      if (typeof window.Popper !== 'undefined') return 4;
      return 3;
    }

    // Default to BS5 as it's most common now
    return 5;
  }

  /**
   * Initialize error container
   * @private
   */
  _initErrorContainer() {
    this.errorContainer = new ErrorContainer({
      position: this.options.errorContainerPosition,
      maxHeight: this.options.errorContainerHeight,
      onErrorClick: (fieldId) => this._handleErrorClick(fieldId),
    });
  }

  /**
   * Initialize label tooltips
   * @private
   */
  _initLabelTooltips() {
    this.labelTooltip = new LabelTooltip(this, {
      tooltipTitle: this.options.labelTooltipTitle,
      formGroupSelector: this.options.formGroupSelector || '.form-group, .mb-3, .mb-4',
    });
  }

  /**
   * Update label tooltips to reflect current rules
   * Called after adding/removing fields or rules
   */
  updateLabelTooltips() {
    if (this.labelTooltip) {
      this.labelTooltip.update();
    }
  }

  /**
   * Bind form events
   * @private
   */
  _bindEvents() {
    // Submit handler
    this.form.addEventListener('submit', this._boundHandlers.onSubmit);

    // Field events with delegation
    const validateOn = this.options.validateOn;

    if (validateOn.includes('blur')) {
      this.form.addEventListener('blur', this._boundHandlers.onBlur, true);
    }

    if (this.options.liveValidation || validateOn.includes('input')) {
      this.form.addEventListener('input', this._boundHandlers.onInput, true);
    }

    if (validateOn.includes('change')) {
      this.form.addEventListener('change', this._boundHandlers.onChange, true);
    }

    // Focus for highlight sync
    this.form.addEventListener('focus', this._boundHandlers.onFocus, true);
  }

  /**
   * Initialize fields from data attributes
   * @private
   */
  _initFieldsFromDataAttributes() {
    const fields = this.form.querySelectorAll('[data-fg-rules]');

    fields.forEach(field => {
      try {
        const rulesAttr = field.getAttribute('data-fg-rules');
        const messagesAttr = field.getAttribute('data-fg-messages');

        const rules = JSON.parse(rulesAttr);
        const messages = messagesAttr ? JSON.parse(messagesAttr) : {};

        this.addField(field, rules, messages);
      } catch (e) {
        console.warn('[FormGuardian] Error parsing data attributes for field:', field, e);
      }
    });
  }

  /**
   * Handle form submit
   * @private
   * @param {Event} e
   */
  async _handleSubmit(e) {
    e.preventDefault();
    this.isSubmitting = true;

    const isValid = await this.validate();

    if (isValid) {
      // Trigger custom event
      this.form.dispatchEvent(new CustomEvent('fg:valid', {
        bubbles: true,
        detail: { guardian: this }
      }));

      // If no preventDefault in handler, submit form
      if (!e.defaultPrevented) {
        // Allow native submit if needed
        // this.form.submit();
      }
    } else {
      // Handle invalid form
      if (this.options.scrollToError || this.options.focusOnError) {
        const firstErrorField = this._getFirstErrorField();
        if (firstErrorField) {
          if (this.options.scrollToError) {
            scrollIntoView(firstErrorField);
          }
          if (this.options.focusOnError) {
            focus(firstErrorField);
          }
        }
      }

      this.form.dispatchEvent(new CustomEvent('fg:invalid', {
        bubbles: true,
        detail: { guardian: this, errors: this.getErrors() }
      }));
    }

    this.isSubmitting = false;
    return isValid;
  }

  /**
   * Handle blur event
   * @private
   * @param {Event} e
   */
  _handleBlur(e) {
    const field = e.target;
    if (this._isValidatableField(field)) {
      this.validateField(field);
    }
  }

  /**
   * Handle input event (debounced)
   * @private
   * @param {Event} e
   */
  _handleInput(e) {
    const field = e.target;
    if (this._isValidatableField(field)) {
      this.validateField(field);
    }
  }

  /**
   * Handle change event
   * @private
   * @param {Event} e
   */
  _handleChange(e) {
    const field = e.target;
    if (this._isValidatableField(field)) {
      this.validateField(field);
    }
  }

  /**
   * Handle focus event
   * @private
   * @param {Event} e
   */
  _handleFocus(e) {
    const field = e.target;
    if (!this._isValidatableField(field)) return;

    const fieldId = this.fieldManager.getFieldId(field);
    if (this.errors.has(fieldId)) {
      field.classList.add(this.options.highlightClass);
      if (this.errorContainer) {
        this.errorContainer.highlightError(fieldId);
      }
    }
  }

  /**
   * Handle error click in error container
   * @private
   * @param {string} fieldId
   */
  _handleErrorClick(fieldId) {
    const field = this.fieldManager.getFieldById(fieldId);
    if (field) {
      scrollIntoView(field);
      focus(field);
      field.classList.add(this.options.highlightClass);
    }
  }

  /**
   * Check if field should be validated
   * @private
   * @param {Element} field
   * @returns {boolean}
   */
  _isValidatableField(field) {
    if (!field || !field.matches) return false;
    return field.matches(this.options.fieldSelector) &&
           this.fieldManager.hasField(field);
  }

  /**
   * Get first field with error
   * @private
   * @returns {Element|null}
   */
  _getFirstErrorField() {
    for (const [fieldId] of this.errors) {
      const field = this.fieldManager.getFieldById(fieldId);
      if (field) return field;
    }
    return null;
  }

  // ==========================================
  // PUBLIC API
  // ==========================================

  /**
   * Add field with validation rules
   * @param {string|Element} selector - Field selector or element
   * @param {Object|Array} rules - Validation rules
   * @param {Object} messages - Custom error messages
   * @returns {FormGuardian} this (for chaining)
   */
  addField(selector, rules, messages = {}) {
    const field = getElement(selector, this.form);
    if (!field) {
      console.warn('[FormGuardian] Field not found:', selector);
      return this;
    }

    this.fieldManager.addField(field, rules, messages);

    // Update label tooltips if enabled
    this.updateLabelTooltips();

    return this;
  }

  /**
   * Remove field from validation
   * @param {string|Element} selector
   * @returns {FormGuardian} this
   */
  removeField(selector) {
    const field = getElement(selector, this.form);
    if (field) {
      const fieldId = this.fieldManager.getFieldId(field);
      this.fieldManager.removeField(field);

      // Clear any errors
      this._clearFieldError(fieldId, field);

      // Update label tooltips if enabled
      this.updateLabelTooltips();
    }
    return this;
  }

  /**
   * Get field configuration
   * @param {string|Element} selector
   * @returns {Object|null}
   */
  getField(selector) {
    const field = getElement(selector, this.form);
    return field ? this.fieldManager.getField(field) : null;
  }

  /**
   * Add rule to existing field
   * @param {string|Element} selector
   * @param {string} ruleName
   * @param {Object} ruleConfig
   * @returns {FormGuardian} this
   */
  addRule(selector, ruleName, ruleConfig = {}) {
    const field = getElement(selector, this.form);
    if (field) {
      this.fieldManager.addRule(field, ruleName, ruleConfig);
      // Update label tooltips if enabled
      this.updateLabelTooltips();
    }
    return this;
  }

  /**
   * Remove rule from field
   * @param {string|Element} selector
   * @param {string} ruleName
   * @returns {FormGuardian} this
   */
  removeRule(selector, ruleName) {
    const field = getElement(selector, this.form);
    if (field) {
      this.fieldManager.removeRule(field, ruleName);
      // Update label tooltips if enabled
      this.updateLabelTooltips();
    }
    return this;
  }

  /**
   * Validate all registered fields
   * @returns {Promise<boolean>} Is form valid
   */
  async validate() {
    let isValid = true;
    const fields = this.fieldManager.getAllFields();

    for (const [fieldId, config] of fields) {
      const field = config.element;
      const fieldValid = await this.validateField(field);

      if (!fieldValid) {
        isValid = false;
        if (this.options.stopOnFirstError) break;
      }
    }

    // Callback
    if (typeof this.options.onFormValidated === 'function') {
      this.options.onFormValidated(isValid, this.getErrors());
    }

    return isValid;
  }

  /**
   * Validate single field
   * @param {string|Element} selector
   * @returns {Promise<boolean>} Is field valid
   */
  async validateField(selector) {
    const field = getElement(selector, this.form);
    if (!field) return true;

    const config = this.fieldManager.getField(field);
    if (!config) return true;

    const fieldId = this.fieldManager.getFieldId(field);
    const value = getFieldValue(field);

    // Show pending state for async validation
    field.classList.add(this.options.pendingClass);

    try {
      const result = await this.validator.validateField(field, value, config.rules);

      field.classList.remove(this.options.pendingClass);

      if (result.valid) {
        this._clearFieldError(fieldId, field);
        this.adapter.showSuccess(field);

        if (typeof this.options.onSuccess === 'function') {
          this.options.onSuccess(field);
        }
      } else {
        const errorMessage = this._getErrorMessage(result.rule, config.messages, result.params);
        this._setFieldError(fieldId, field, errorMessage);

        if (typeof this.options.onError === 'function') {
          this.options.onError(field, errorMessage);
        }
      }

      // Callback
      if (typeof this.options.onFieldValidated === 'function') {
        this.options.onFieldValidated(field, result.valid, result.valid ? [] : [result.message]);
      }

      return result.valid;
    } catch (e) {
      field.classList.remove(this.options.pendingClass);
      console.error('[FormGuardian] Validation error:', e);
      return false;
    }
  }

  /**
   * Get error message for rule
   * @private
   * @param {string} ruleName
   * @param {Object} customMessages
   * @param {Object} params
   * @returns {string}
   */
  _getErrorMessage(ruleName, customMessages = {}, params = {}) {
    // Check custom messages first
    if (customMessages[ruleName]) {
      return this.validator._interpolateMessage(customMessages[ruleName], params, null);
    }

    // Get default message from rule
    const rules = getAllRules();
    if (rules[ruleName] && rules[ruleName].message) {
      return this.validator._interpolateMessage(rules[ruleName].message, params, null);
    }

    return `Invalid value`;
  }

  /**
   * Set error on field
   * @private
   * @param {string} fieldId
   * @param {Element} field
   * @param {string} message
   */
  _setFieldError(fieldId, field, message) {
    this.errors.set(fieldId, message);
    this.adapter.showError(field, message);

    if (this.errorContainer) {
      const label = this.fieldManager.getLabel(field);
      this.errorContainer.addError(fieldId, label, message);
    }
  }

  /**
   * Clear error from field
   * @private
   * @param {string} fieldId
   * @param {Element} field
   */
  _clearFieldError(fieldId, field) {
    if (this.errors.has(fieldId)) {
      this.errors.delete(fieldId);
      this.adapter.hideError(field);
      field.classList.remove(this.options.highlightClass);

      if (this.errorContainer) {
        this.errorContainer.removeError(fieldId);
      }
    }
  }

  /**
   * Check if form is valid (without triggering validation)
   * @returns {boolean}
   */
  isValid() {
    return this.errors.size === 0;
  }

  /**
   * Get all current errors
   * @returns {Object} { fieldId: message }
   */
  getErrors() {
    return Object.fromEntries(this.errors);
  }

  /**
   * Clear all errors
   * @returns {FormGuardian} this
   */
  clearErrors() {
    for (const [fieldId] of this.errors) {
      const field = this.fieldManager.getFieldById(fieldId);
      if (field) {
        this.adapter.resetField(field);
        field.classList.remove(this.options.highlightClass);
      }
    }

    this.errors.clear();

    if (this.errorContainer) {
      this.errorContainer.clearAll();
    }

    return this;
  }

  /**
   * Reset form and clear all validation states
   * @returns {FormGuardian} this
   */
  reset() {
    this.clearErrors();
    this.form.reset();
    return this;
  }

  /**
   * Change Bootstrap version adapter
   * @param {number} version - 3, 4, or 5
   * @returns {FormGuardian} this
   */
  setBootstrapVersion(version) {
    // Clear current states
    this.clearErrors();

    // Switch adapter
    this.adapter = getAdapter(version, this.form);
    this.bootstrapVersion = version;

    return this;
  }

  /**
   * Destroy instance and cleanup
   */
  destroy() {
    // Remove event listeners
    this.form.removeEventListener('submit', this._boundHandlers.onSubmit);
    this.form.removeEventListener('blur', this._boundHandlers.onBlur, true);
    this.form.removeEventListener('input', this._boundHandlers.onInput, true);
    this.form.removeEventListener('change', this._boundHandlers.onChange, true);
    this.form.removeEventListener('focus', this._boundHandlers.onFocus, true);

    // Cancel debounced handler
    if (this._boundHandlers.onInput.cancel) {
      this._boundHandlers.onInput.cancel();
    }

    // Clear errors
    this.clearErrors();

    // Destroy error container
    if (this.errorContainer) {
      this.errorContainer.destroy();
    }

    // Destroy label tooltips
    if (this.labelTooltip) {
      this.labelTooltip.destroy();
    }

    // Remove from instances
    FormGuardian.instances.delete(this.form);

    // Clear references
    this.form = null;
    this.adapter = null;
    this.validator = null;
    this.fieldManager = null;
    this.errorContainer = null;
    this.labelTooltip = null;
  }

  // ==========================================
  // STATIC METHODS
  // ==========================================

  /**
   * Get instance for form
   * @param {string|Element} formSelector
   * @returns {FormGuardian|null}
   */
  static getInstance(formSelector) {
    const form = getElement(formSelector);
    return form ? FormGuardian.instances.get(form) : null;
  }

  /**
   * Initialize from data attributes
   * @param {string|Element} formSelector
   * @param {Object} options
   * @returns {FormGuardian}
   */
  static initFromDataAttributes(formSelector, options = {}) {
    const form = getElement(formSelector);
    if (!form) {
      throw new Error('[FormGuardian] Form not found: ' + formSelector);
    }

    // Parse options from form data attributes
    const dataOptions = {};
    if (form.dataset.fgBootstrap) {
      dataOptions.bootstrapVersion = parseInt(form.dataset.fgBootstrap, 10);
    }
    if (form.dataset.fgValidateOn) {
      dataOptions.validateOn = form.dataset.fgValidateOn.split(',').map(s => s.trim());
    }
    if (form.dataset.fgLive !== undefined) {
      dataOptions.liveValidation = form.dataset.fgLive !== 'false';
    }
    if (form.dataset.fgErrorContainer !== undefined) {
      dataOptions.showErrorContainer = form.dataset.fgErrorContainer !== 'false';
    }
    if (form.dataset.fgLabelTooltips !== undefined) {
      dataOptions.showLabelTooltips = form.dataset.fgLabelTooltips !== 'false';
    }

    return new FormGuardian(form, { ...dataOptions, ...options });
  }

  /**
   * Auto-initialize all forms with data-formguardian attribute
   * @returns {FormGuardian[]}
   */
  static autoInit() {
    const forms = document.querySelectorAll('[data-formguardian]');
    const instances = [];

    forms.forEach(form => {
      if (!FormGuardian.instances.has(form)) {
        instances.push(FormGuardian.initFromDataAttributes(form));
      }
    });

    return instances;
  }

  /**
   * Get all available validation rules
   * @returns {Object}
   */
  static getRules() {
    return getAllRules();
  }
}

export default FormGuardian;
