/**
 * Custom Validation Rules
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Registry for named callback functions
 */
const callbackRegistry = new Map();

/**
 * Custom validation with inline function
 */
export const custom = {
  message: 'Validation failed',
  async validate(value, params, field, guardian) {
    if (isEmptyValue(value) && !params.validateEmpty) return true;

    const fn = params.validate || params.fn || params.value;

    if (typeof fn !== 'function') {
      console.warn('[FormGuardian] Custom rule requires a validate function');
      return true;
    }

    try {
      const result = await fn(value, params, field, guardian);

      // Handle different return types
      if (typeof result === 'boolean') {
        return result;
      }

      if (typeof result === 'object' && result !== null) {
        if (result.valid !== undefined) {
          if (!result.valid && result.message) {
            params.message = result.message;
          }
          return result.valid;
        }
      }

      if (typeof result === 'string') {
        // String return is treated as error message
        params.message = result;
        return false;
      }

      return !!result;
    } catch (error) {
      console.error('[FormGuardian] Custom validation error:', error);
      return false;
    }
  }
};

/**
 * Callback - uses a named registered function
 */
export const callback = {
  message: 'Validation failed',
  async validate(value, params, field, guardian) {
    if (isEmptyValue(value) && !params.validateEmpty) return true;

    const name = params.name || params.callback || params.value;

    if (!name) {
      console.warn('[FormGuardian] Callback rule requires a name');
      return true;
    }

    // Check registry
    let fn = callbackRegistry.get(name);

    // Check global
    if (!fn && typeof window !== 'undefined') {
      fn = window[name];
    }

    if (typeof fn !== 'function') {
      console.warn(`[FormGuardian] Callback "${name}" not found`);
      return true;
    }

    try {
      const result = await fn(value, params, field, guardian);

      if (typeof result === 'boolean') {
        return result;
      }

      if (typeof result === 'object' && result !== null) {
        if (result.valid !== undefined) {
          if (!result.valid && result.message) {
            params.message = result.message;
          }
          return result.valid;
        }
      }

      if (typeof result === 'string') {
        params.message = result;
        return false;
      }

      return !!result;
    } catch (error) {
      console.error(`[FormGuardian] Callback "${name}" error:`, error);
      return false;
    }
  }
};

/**
 * Register a callback function
 * @param {string} name
 * @param {Function} fn
 */
export function registerCallback(name, fn) {
  if (typeof fn === 'function') {
    callbackRegistry.set(name, fn);
  }
}

/**
 * Unregister a callback function
 * @param {string} name
 */
export function unregisterCallback(name) {
  callbackRegistry.delete(name);
}

/**
 * Get all registered callbacks
 * @returns {Map}
 */
export function getCallbacks() {
  return new Map(callbackRegistry);
}

/**
 * Conditional validation - only validate if condition is met
 */
export const when = {
  message: 'Validation failed',
  async validate(value, params, field, guardian) {
    const condition = params.condition || params.when;

    // Evaluate condition
    let shouldValidate = false;

    if (typeof condition === 'function') {
      shouldValidate = await condition(value, params, field, guardian);
    } else if (typeof condition === 'boolean') {
      shouldValidate = condition;
    } else {
      shouldValidate = true;
    }

    if (!shouldValidate) return true;

    // Run the actual validation rule
    const ruleName = params.rule || params.then;
    const ruleParams = params.params || {};

    if (!ruleName) return true;

    // Import and run the rule
    const rules = await import('./index.js').then(m => m.getAllRules());
    const rule = rules[ruleName];

    if (!rule) {
      console.warn(`[FormGuardian] Rule "${ruleName}" not found for conditional validation`);
      return true;
    }

    const result = await rule.validate(value, ruleParams, field, guardian);

    if (!result && rule.message) {
      params.message = rule.message;
    }

    return result;
  }
};

export default {
  custom,
  callback,
  when,
  registerCallback,
  unregisterCallback,
  getCallbacks
};
