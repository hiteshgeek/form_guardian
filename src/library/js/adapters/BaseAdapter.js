/**
 * BaseAdapter - Base class for Bootstrap version adapters
 * Handles showing/hiding validation states on form fields
 */

import { $, closest, insertAfter, remove, createElement, addClass, removeClass } from '../utils/dom.js';

export class BaseAdapter {
  /**
   * Constructor
   * @param {HTMLFormElement} form
   */
  constructor(form) {
    this.form = form;
  }

  /**
   * CSS classes used by this adapter
   * Override in subclasses
   */
  get classes() {
    return {
      formGroup: '.form-group',
      error: 'has-error',
      success: 'has-success',
      errorElement: 'help-block',
      inputError: 'is-invalid',
      inputSuccess: 'is-valid'
    };
  }

  /**
   * Show error on field
   * @param {Element} field
   * @param {string} message
   */
  showError(field, message) {
    // Remove any existing success state
    this.hideError(field);

    // Find form group
    const formGroup = this.getFormGroup(field);

    // Add error class to form group
    if (formGroup) {
      addClass(formGroup, this.classes.error);
      removeClass(formGroup, this.classes.success);
    }

    // Add error class to input
    if (this.classes.inputError) {
      addClass(field, this.classes.inputError);
    }
    removeClass(field, this.classes.inputSuccess);

    // Create error element
    const errorElement = this.createErrorElement(message, field);

    // Insert error element
    this.insertErrorElement(field, errorElement);
  }

  /**
   * Hide error on field
   * @param {Element} field
   */
  hideError(field) {
    const formGroup = this.getFormGroup(field);

    // Remove error classes
    if (formGroup) {
      removeClass(formGroup, this.classes.error);
    }
    if (this.classes.inputError) {
      removeClass(field, this.classes.inputError);
    }

    // Remove error element
    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      remove(errorElement);
    }
  }

  /**
   * Show success state on field
   * @param {Element} field
   */
  showSuccess(field) {
    // Remove error state first
    this.hideError(field);

    const formGroup = this.getFormGroup(field);

    // Add success class
    if (formGroup) {
      addClass(formGroup, this.classes.success);
    }
    if (this.classes.inputSuccess) {
      addClass(field, this.classes.inputSuccess);
    }
  }

  /**
   * Reset field to neutral state
   * @param {Element} field
   */
  resetField(field) {
    const formGroup = this.getFormGroup(field);

    if (formGroup) {
      removeClass(formGroup, this.classes.error, this.classes.success);
    }

    removeClass(field, this.classes.inputError, this.classes.inputSuccess);

    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      remove(errorElement);
    }
  }

  /**
   * Get form group element for field
   * @param {Element} field
   * @returns {Element|null}
   */
  getFormGroup(field) {
    return closest(field, this.classes.formGroup);
  }

  /**
   * Create error message element
   * @param {string} message
   * @param {Element} field
   * @returns {Element}
   */
  createErrorElement(message, field) {
    return createElement('div', {
      className: `${this.classes.errorElement} fg-error-message`,
      'data-fg-error': field.id || field.name || ''
    }, message);
  }

  /**
   * Get existing error element for field
   * @param {Element} field
   * @returns {Element|null}
   */
  getErrorElement(field) {
    const id = field.id || field.name;
    const formGroup = this.getFormGroup(field);
    const context = formGroup || field.parentElement;

    return context ? $(`.fg-error-message[data-fg-error="${id}"]`, context) : null;
  }

  /**
   * Insert error element in correct position
   * @param {Element} field
   * @param {Element} errorElement
   */
  insertErrorElement(field, errorElement) {
    // Default: insert after field
    insertAfter(errorElement, field);
  }

  /**
   * Get field label
   * @param {Element} field
   * @returns {string}
   */
  getFieldLabel(field) {
    const id = field.id;

    // Try label with for attribute
    if (id) {
      const label = this.form.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent.trim();
    }

    // Try parent label
    const parentLabel = closest(field, 'label');
    if (parentLabel) {
      const clone = parentLabel.cloneNode(true);
      clone.querySelectorAll('input, select, textarea').forEach(el => el.remove());
      return clone.textContent.trim();
    }

    // Fallback
    return field.placeholder || field.name || field.id || 'Field';
  }
}

export default BaseAdapter;
