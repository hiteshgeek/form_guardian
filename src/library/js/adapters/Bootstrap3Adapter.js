/**
 * Bootstrap 3 Adapter
 * Handles Bootstrap 3 specific validation display
 */

import { BaseAdapter } from './BaseAdapter.js';
import { $, closest, insertAfter, createElement, addClass, removeClass } from '../utils/dom.js';

export class Bootstrap3Adapter extends BaseAdapter {
  /**
   * Bootstrap 3 specific classes
   */
  get classes() {
    return {
      formGroup: '.form-group',
      error: 'has-error',
      success: 'has-success',
      feedback: 'has-feedback',
      errorElement: 'help-block',
      inputError: '', // BS3 doesn't have input-level error class
      inputSuccess: ''
    };
  }

  /**
   * Show error on field
   * @param {Element} field
   * @param {string} message
   */
  showError(field, message) {
    this.hideError(field);

    const formGroup = this.getFormGroup(field);

    if (formGroup) {
      addClass(formGroup, this.classes.error);
      removeClass(formGroup, this.classes.success);
    }

    // Create help-block element
    const errorElement = this.createErrorElement(message, field);
    this.insertErrorElement(field, errorElement);
  }

  /**
   * Create Bootstrap 3 error element
   * @param {string} message
   * @param {Element} field
   * @returns {Element}
   */
  createErrorElement(message, field) {
    return createElement('span', {
      className: `${this.classes.errorElement} fg-error-message`,
      'data-fg-error': field.id || field.name || ''
    }, message);
  }

  /**
   * Insert error element
   * For BS3, insert after input but within form-group
   * @param {Element} field
   * @param {Element} errorElement
   */
  insertErrorElement(field, errorElement) {
    const formGroup = this.getFormGroup(field);

    // Check for input-group
    const inputGroup = closest(field, '.input-group');

    if (inputGroup) {
      // Insert after input-group
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

    if (formGroup) {
      return $(`.help-block.fg-error-message[data-fg-error="${id}"]`, formGroup);
    }

    // Fallback to sibling
    let sibling = field.nextElementSibling;
    while (sibling) {
      if (sibling.classList.contains('fg-error-message') &&
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

    const formGroup = this.getFormGroup(field);

    if (formGroup) {
      addClass(formGroup, this.classes.success);
    }
  }

  /**
   * Reset field
   * @param {Element} field
   */
  resetField(field) {
    const formGroup = this.getFormGroup(field);

    if (formGroup) {
      removeClass(formGroup, this.classes.error, this.classes.success, this.classes.feedback);
    }

    const errorElement = this.getErrorElement(field);
    if (errorElement) {
      errorElement.remove();
    }
  }
}

export default Bootstrap3Adapter;
