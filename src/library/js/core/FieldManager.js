/**
 * FieldManager - Manages field registration, configuration and state
 */

import { uniqueId, getFieldLabel } from '../utils/dom.js';
import { applyInputMask } from '../utils/inputMask.js';

export class FieldManager {
  /**
   * Constructor
   * @param {FormGuardian} guardian - Parent FormGuardian instance
   */
  constructor(guardian) {
    this.guardian = guardian;
    this.fields = new Map(); // fieldId -> { element, rules, messages, state, maskCleanup }
    this.elementToId = new WeakMap(); // element -> fieldId (for quick lookup)
  }

  /**
   * Get or create field ID
   * @param {Element} field
   * @returns {string}
   */
  getFieldId(field) {
    if (this.elementToId.has(field)) {
      return this.elementToId.get(field);
    }

    // Use existing id or name, or generate one
    const id = field.id || field.name || uniqueId('fg-field');

    // Ensure element has an id for error container linking
    if (!field.id) {
      field.id = id;
    }

    return id;
  }

  /**
   * Add field to validation
   * @param {Element} field
   * @param {Object|Array} rules
   * @param {Object} messages
   */
  addField(field, rules, messages = {}) {
    console.log('[FieldManager] addField called for:', field?.id || field?.name, 'element ref:', field);
    const fieldId = this.getFieldId(field);
    const normalizedRules = this._normalizeRules(rules);

    // Apply input mask if enabled (default: true)
    let maskCleanup = null;
    if (this.guardian.options.inputMasking !== false) {
      maskCleanup = applyInputMask(field, normalizedRules);
    }

    // Capture the label text NOW, before tooltip is appended
    const label = getFieldLabel(field);

    const config = {
      element: field,
      rules: normalizedRules,
      messages: messages,
      maskCleanup: maskCleanup,
      label: label, // Store the clean label text
      state: {
        valid: null, // null = not validated, true/false = validation result
        dirty: false, // User has interacted
        touched: false, // User has focused and blurred
      }
    };

    this.fields.set(fieldId, config);
    this.elementToId.set(field, fieldId);
    console.log('[FieldManager] Field registered:', fieldId, 'in elementToId, verifying:', this.elementToId.get(field));

    // Bind field-level events if needed
    this._bindFieldEvents(field);
  }

  /**
   * Remove field from validation
   * @param {Element} field
   */
  removeField(field) {
    // Try WeakMap lookup first
    let fieldId = this.elementToId.get(field);
    console.log('[FieldManager] removeField called, field:', field?.id || field?.name, 'WeakMap lookup fieldId:', fieldId);

    // Fallback: if WeakMap lookup fails, try to find by id/name in the fields Map
    // This handles cases where element reference may differ
    if (!fieldId) {
      const possibleId = field.id || field.name;
      if (possibleId && this.fields.has(possibleId)) {
        fieldId = possibleId;
        console.log('[FieldManager] Fallback lookup succeeded, found fieldId:', fieldId);
      }
    }

    if (fieldId) {
      const config = this.fields.get(fieldId);
      // Clean up input mask listeners
      if (config && config.maskCleanup) {
        console.log('[FieldManager] Calling maskCleanup for field:', fieldId);
        config.maskCleanup();
      } else {
        console.log('[FieldManager] No maskCleanup found for field:', fieldId, 'config:', config);
      }
      this.fields.delete(fieldId);
      // Also try to clean up WeakMap with the element from config
      if (config && config.element) {
        this.elementToId.delete(config.element);
      }
      this.elementToId.delete(field);
    } else {
      console.log('[FieldManager] Field not registered');
    }
  }

  /**
   * Get field configuration
   * @param {Element} field
   * @returns {Object|null}
   */
  getField(field) {
    const fieldId = this.elementToId.get(field);
    return fieldId ? this.fields.get(fieldId) : null;
  }

  /**
   * Get field by ID
   * @param {string} fieldId
   * @returns {Element|null}
   */
  getFieldById(fieldId) {
    const config = this.fields.get(fieldId);
    return config ? config.element : null;
  }

  /**
   * Check if field is registered
   * @param {Element} field
   * @returns {boolean}
   */
  hasField(field) {
    return this.elementToId.has(field);
  }

  /**
   * Get all registered fields
   * @returns {Map}
   */
  getAllFields() {
    return this.fields;
  }

  /**
   * Add rule to field
   * @param {Element} field
   * @param {string} ruleName
   * @param {Object} ruleConfig
   */
  addRule(field, ruleName, ruleConfig = {}) {
    const config = this.getField(field);
    if (config) {
      config.rules[ruleName] = ruleConfig;
      // Re-apply input mask with updated rules
      this._updateInputMask(field, config);
    }
  }

  /**
   * Remove rule from field
   * @param {Element} field
   * @param {string} ruleName
   */
  removeRule(field, ruleName) {
    const config = this.getField(field);
    if (config && config.rules[ruleName]) {
      delete config.rules[ruleName];
      // Re-apply input mask with updated rules
      this._updateInputMask(field, config);
    }
  }

  /**
   * Get field rules
   * @param {Element} field
   * @returns {Object}
   */
  getRules(field) {
    const config = this.getField(field);
    return config ? config.rules : {};
  }

  /**
   * Update field state
   * @param {Element} field
   * @param {Object} state
   */
  updateState(field, state) {
    const config = this.getField(field);
    if (config) {
      Object.assign(config.state, state);
    }
  }

  /**
   * Get field state
   * @param {Element} field
   * @returns {Object|null}
   */
  getState(field) {
    const config = this.getField(field);
    return config ? config.state : null;
  }

  /**
   * Get field label (stored at registration time)
   * @param {Element} field
   * @returns {string}
   */
  getLabel(field) {
    const config = this.getField(field);
    return config ? config.label : getFieldLabel(field);
  }

  /**
   * Normalize rules to object format
   * @private
   * @param {Object|Array} rules
   * @returns {Object}
   */
  _normalizeRules(rules) {
    if (!rules) return {};

    // If array format: ['required', { minLength: 5 }, 'email']
    if (Array.isArray(rules)) {
      const normalized = {};
      rules.forEach(rule => {
        if (typeof rule === 'string') {
          normalized[rule] = {};
        } else if (typeof rule === 'object') {
          Object.entries(rule).forEach(([key, value]) => {
            normalized[key] = typeof value === 'object' ? value : { value };
          });
        }
      });
      return normalized;
    }

    // Object format - normalize values
    const normalized = {};
    Object.entries(rules).forEach(([key, value]) => {
      if (value === true) {
        normalized[key] = {};
      } else if (typeof value === 'object' && value !== null) {
        normalized[key] = value;
      } else if (value !== false) {
        normalized[key] = { value };
      }
    });

    return normalized;
  }

  /**
   * Bind field-specific events
   * @private
   * @param {Element} field
   */
  _bindFieldEvents(field) {
    // Track dirty state on input
    const markDirty = () => {
      this.updateState(field, { dirty: true });
    };

    // Track touched state on blur
    const markTouched = () => {
      this.updateState(field, { touched: true });
    };

    field.addEventListener('input', markDirty, { once: true });
    field.addEventListener('blur', markTouched, { once: true });
  }

  /**
   * Update input mask for field
   * @private
   * @param {Element} field
   * @param {Object} config
   */
  _updateInputMask(field, config) {
    if (this.guardian.options.inputMasking === false) return;

    // Clean up existing mask
    if (config.maskCleanup) {
      config.maskCleanup();
    }

    // Apply new mask
    config.maskCleanup = applyInputMask(field, config.rules);
  }

  /**
   * Clear all fields
   */
  clear() {
    // Clean up all mask listeners
    this.fields.forEach(config => {
      if (config.maskCleanup) {
        config.maskCleanup();
      }
    });
    this.fields.clear();
    // WeakMap doesn't need manual clearing
  }

  /**
   * Get field count
   * @returns {number}
   */
  get count() {
    return this.fields.size;
  }
}

export default FieldManager;
