/**
 * Validator - Core validation engine
 */

import { getAllRules } from '../rules/index.js';
import { isEmptyValue } from '../utils/dom.js';

export class Validator {
  /**
   * Constructor
   * @param {FormGuardian} guardian - Parent FormGuardian instance
   */
  constructor(guardian) {
    this.guardian = guardian;
    this.rules = getAllRules();
  }

  /**
   * Validate a field against its rules
   * @param {Element} field - Field element
   * @param {*} value - Field value
   * @param {Object} rules - Rules to validate against
   * @returns {Promise<{valid: boolean, rule?: string, message?: string, params?: Object}>}
   */
  async validateField(field, value, rules) {
    // Normalize rules to object format
    const normalizedRules = this._normalizeRules(rules);

    // Check required first
    if (normalizedRules.required) {
      const requiredResult = await this._validateRule('required', value, normalizedRules.required, field);
      if (!requiredResult.valid) {
        return requiredResult;
      }
    }

    // If value is empty and not required, skip other validations
    if (isEmptyValue(value) && !normalizedRules.required) {
      return { valid: true };
    }

    // Validate other rules
    for (const [ruleName, ruleConfig] of Object.entries(normalizedRules)) {
      if (ruleName === 'required') continue; // Already validated

      const result = await this._validateRule(ruleName, value, ruleConfig, field);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true };
  }

  /**
   * Validate a single rule
   * @private
   * @param {string} ruleName
   * @param {*} value
   * @param {Object|boolean} config
   * @param {Element} field
   * @returns {Promise<{valid: boolean, rule?: string, message?: string, params?: Object}>}
   */
  async _validateRule(ruleName, value, config, field) {
    const rule = this.rules[ruleName];

    if (!rule) {
      console.warn(`[FormGuardian] Unknown rule: ${ruleName}`);
      return { valid: true };
    }

    // Normalize config
    const params = this._normalizeRuleConfig(config);

    try {
      // Call validate function
      const isValid = await rule.validate(value, params, field, this.guardian);

      if (isValid) {
        return { valid: true };
      }

      // Get error message
      const message = params.message || rule.message || `Validation failed for ${ruleName}`;

      return {
        valid: false,
        rule: ruleName,
        message: this._interpolateMessage(message, params, value),
        params
      };
    } catch (e) {
      console.error(`[FormGuardian] Error in rule ${ruleName}:`, e);
      return {
        valid: false,
        rule: ruleName,
        message: `Validation error: ${e.message}`,
        params
      };
    }
  }

  /**
   * Normalize rules to consistent object format
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
          Object.assign(normalized, rule);
        }
      });
      return normalized;
    }

    // Already object format
    return { ...rules };
  }

  /**
   * Normalize rule config to object
   * @private
   * @param {*} config
   * @returns {Object}
   */
  _normalizeRuleConfig(config) {
    if (config === true) return {};
    if (config === false) return { disabled: true };
    if (typeof config === 'object' && config !== null) return { ...config };
    // Primitive value - use as the main parameter
    return { value: config };
  }

  /**
   * Interpolate message with params
   * @private
   * @param {string} message
   * @param {Object} params
   * @param {*} value
   * @returns {string}
   */
  _interpolateMessage(message, params, value) {
    if (typeof message !== 'string') return String(message);

    // Common placeholder names that should fall back to params.value
    const valueAliases = ['min', 'max', 'length', 'size', 'count', 'places', 'age'];

    return message.replace(/\{(\w+)\}/g, (match, key) => {
      if (key === 'value') return String(value);
      if (params[key] !== undefined) return String(params[key]);
      // Fall back to params.value for common placeholders
      if (valueAliases.includes(key) && params.value !== undefined) {
        return String(params.value);
      }
      return match;
    });
  }

  /**
   * Register a custom rule
   * @param {string} name - Rule name
   * @param {Function} validate - Validation function
   * @param {string} message - Default error message
   */
  registerRule(name, validate, message) {
    this.rules[name] = { validate, message };
  }

  /**
   * Check if a rule exists
   * @param {string} name
   * @returns {boolean}
   */
  hasRule(name) {
    return name in this.rules;
  }
}

export default Validator;
