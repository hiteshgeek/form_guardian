/**
 * Bootstrap 5 Adapter
 * Handles Bootstrap 5 specific validation display
 */

import { BaseAdapter } from './BaseAdapter.js';
import { $, closest, insertAfter, createElement, addClass, removeClass } from '../utils/dom.js';

export class Bootstrap5Adapter extends BaseAdapter {
  /**
   * Bootstrap 5 specific classes
   */
  get classes() {
    return {
      formGroup: '.mb-3',
      error: '',
      success: '',
      errorElement: 'invalid-feedback',
      validElement: 'valid-feedback',
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
    this.hideError(field);

    // Add is-invalid to input
    addClass(field, this.classes.inputError);
    removeClass(field, this.classes.inputSuccess);

    // Create invalid-feedback element
    const errorElement = this.createErrorElement(message, field);
    this.insertErrorElement(field, errorElement);

    // Ensure visibility (BS5 uses sibling selector, but we force display)
    errorElement.style.display = 'block';
  }

  /**
   * Hide error on field
   * @param {Element} field
   */
  hideError(field) {
    removeClass(field, this.classes.inputError);

    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Create Bootstrap 5 error element
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
   * Insert error element
   * BS5 needs the feedback element to be a sibling of the input
   * for the CSS sibling selector to work
   * @param {Element} field
   * @param {Element} errorElement
   */
  insertErrorElement(field, errorElement) {
    // Check for input-group
    const inputGroup = closest(field, '.input-group');

    if (inputGroup) {
      // BS5 input-group: add feedback after the input-group
      inputGroup.classList.add('has-validation');
      insertAfter(errorElement, inputGroup);
    } else if (field.type === 'checkbox' || field.type === 'radio') {
      // For form-check, insert after the label
      const formCheck = closest(field, '.form-check');
      if (formCheck) {
        formCheck.appendChild(errorElement);
      } else {
        insertAfter(errorElement, field);
      }
    } else {
      // Default: insert right after field
      insertAfter(errorElement, field);
    }
  }

  /**
   * Get error element
   * @param {Element} field
   * @returns {Element|null}
   */
  getErrorElement(field) {
    const id = field.id || field.name;

    // Check within form group first
    const formGroup = this.getFormGroup(field);
    if (formGroup) {
      const el = $(`.invalid-feedback.fg-error-message[data-fg-error="${id}"]`, formGroup);
      if (el) return el;
    }

    // Check input-group
    const inputGroup = closest(field, '.input-group');
    if (inputGroup && inputGroup.nextElementSibling) {
      const next = inputGroup.nextElementSibling;
      if (next.classList.contains('invalid-feedback') && next.dataset.fgError === id) {
        return next;
      }
    }

    // Check immediate sibling
    let sibling = field.nextElementSibling;
    while (sibling) {
      if (sibling.classList.contains('invalid-feedback') &&
          sibling.classList.contains('fg-error-message') &&
          sibling.dataset.fgError === id) {
        return sibling;
      }
      sibling = sibling.nextElementSibling;
    }

    return null;
  }

  /**
   * Show success on field
   * @param {Element} field
   */
  showSuccess(field) {
    this.hideError(field);
    addClass(field, this.classes.inputSuccess);
  }

  /**
   * Reset field
   * @param {Element} field
   */
  resetField(field) {
    removeClass(field, this.classes.inputError, this.classes.inputSuccess);

    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Get form group - BS5 typically uses .mb-3 or other margin utilities
   * @param {Element} field
   * @returns {Element|null}
   */
  getFormGroup(field) {
    // Try common BS5 form group patterns
    return closest(field, '.mb-3') ||
           closest(field, '.mb-4') ||
           closest(field, '.form-floating') ||
           closest(field, '.form-group') ||
           closest(field, '.row');
  }
}

export default Bootstrap5Adapter;
