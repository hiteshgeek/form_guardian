/**
 * Bootstrap 4 Adapter
 * Handles Bootstrap 4 specific validation display
 */

import { BaseAdapter } from './BaseAdapter.js';
import { $, closest, insertAfter, createElement, addClass, removeClass } from '../utils/dom.js';

export class Bootstrap4Adapter extends BaseAdapter {
  /**
   * Bootstrap 4 specific classes
   */
  get classes() {
    return {
      formGroup: '.form-group',
      error: 'was-validated',
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

    // Show the feedback (BS4 requires display manipulation)
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
   * Create Bootstrap 4 error element
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
   * @param {Element} field
   * @param {Element} errorElement
   */
  insertErrorElement(field, errorElement) {
    // Check for input-group
    const inputGroup = closest(field, '.input-group');

    if (inputGroup) {
      // BS4 needs feedback after input-group for proper display
      insertAfter(errorElement, inputGroup);
    } else {
      // Insert after field
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
    const formGroup = this.getFormGroup(field);
    const context = formGroup || field.parentElement;

    if (context) {
      return $(`.invalid-feedback.fg-error-message[data-fg-error="${id}"]`, context);
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

    // Also remove valid-feedback if present
    const validFeedback = field.parentElement?.querySelector('.valid-feedback.fg-error-message');
    if (validFeedback) {
      validFeedback.remove();
    }
  }

  /**
   * Get form group - BS4 uses .form-group
   * @param {Element} field
   * @returns {Element|null}
   */
  getFormGroup(field) {
    return closest(field, '.form-group') || closest(field, '.mb-3');
  }
}

export default Bootstrap4Adapter;
