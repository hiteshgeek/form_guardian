/**
 * Validation Rules Registry
 * Exports all validation rules
 */

import stringRules from './string.js';
import patternRules from './pattern.js';
import numberRules from './number.js';
import dateRules from './date.js';
import fileRules from './file.js';
import comparisonRules from './comparison.js';
import selectionRules from './selection.js';
import asyncRules from './async.js';
import customRules, { registerCallback, unregisterCallback, getCallbacks } from './custom.js';

/**
 * All rules organized by category
 */
export const ruleCategories = {
  string: {
    name: 'String',
    description: 'Text and string validation rules',
    rules: Object.keys(stringRules)
  },
  pattern: {
    name: 'Pattern',
    description: 'Format and pattern validation rules',
    rules: Object.keys(patternRules)
  },
  number: {
    name: 'Number',
    description: 'Numeric validation rules',
    rules: Object.keys(numberRules)
  },
  date: {
    name: 'Date/Time',
    description: 'Date and time validation rules',
    rules: Object.keys(dateRules)
  },
  file: {
    name: 'File',
    description: 'File upload validation rules',
    rules: Object.keys(fileRules)
  },
  comparison: {
    name: 'Comparison',
    description: 'Field comparison and conditional rules',
    rules: Object.keys(comparisonRules)
  },
  selection: {
    name: 'Selection',
    description: 'Select, checkbox, and radio validation rules',
    rules: Object.keys(selectionRules)
  },
  async: {
    name: 'Async',
    description: 'Server-side validation rules',
    rules: Object.keys(asyncRules).filter(k => k !== 'clearAsyncCache')
  },
  custom: {
    name: 'Custom',
    description: 'Custom validation rules',
    rules: ['custom', 'callback', 'when']
  }
};

/**
 * Merged rules object with all rules
 */
const allRules = {
  ...stringRules,
  ...patternRules,
  ...numberRules,
  ...dateRules,
  ...fileRules,
  ...comparisonRules,
  ...selectionRules,
  ...asyncRules,
  ...customRules
};

// Remove non-rule exports
delete allRules.clearAsyncCache;
delete allRules.registerCallback;
delete allRules.unregisterCallback;
delete allRules.getCallbacks;

/**
 * Get all validation rules
 * @returns {Object}
 */
export function getAllRules() {
  return { ...allRules };
}

/**
 * Get rule by name
 * @param {string} name
 * @returns {Object|null}
 */
export function getRule(name) {
  return allRules[name] || null;
}

/**
 * Check if rule exists
 * @param {string} name
 * @returns {boolean}
 */
export function hasRule(name) {
  return name in allRules;
}

/**
 * Register a custom rule
 * @param {string} name
 * @param {Object} rule - { validate: Function, message: string }
 */
export function registerRule(name, rule) {
  if (!rule || typeof rule.validate !== 'function') {
    throw new Error('Rule must have a validate function');
  }
  allRules[name] = rule;
}

/**
 * Unregister a rule
 * @param {string} name
 */
export function unregisterRule(name) {
  delete allRules[name];
}

/**
 * Get rule metadata for UI display
 * @param {string} name
 * @returns {Object}
 */
export function getRuleMetadata(name) {
  const rule = allRules[name];
  if (!rule) return null;

  // Find category
  let category = 'custom';
  for (const [cat, config] of Object.entries(ruleCategories)) {
    if (config.rules.includes(name)) {
      category = cat;
      break;
    }
  }

  return {
    name,
    category,
    message: rule.message || 'Validation failed',
    hasParams: getRuleParams(name).length > 0
  };
}

/**
 * Get rule parameter definitions
 * @param {string} name
 * @returns {Array}
 */
export function getRuleParams(name) {
  const paramDefs = {
    // String rules
    minLength: [{ name: 'min', type: 'number', label: 'Minimum length', required: true }],
    maxLength: [{ name: 'max', type: 'number', label: 'Maximum length', required: true }],
    exactLength: [{ name: 'length', type: 'number', label: 'Exact length', required: true }],
    rangeLength: [
      { name: 'min', type: 'number', label: 'Minimum', required: true },
      { name: 'max', type: 'number', label: 'Maximum', required: true }
    ],
    contains: [
      { name: 'substring', type: 'text', label: 'Substring', required: true },
      { name: 'caseSensitive', type: 'checkbox', label: 'Case sensitive', default: true }
    ],
    notContains: [
      { name: 'substring', type: 'text', label: 'Substring', required: true }
    ],
    startsWith: [{ name: 'prefix', type: 'text', label: 'Prefix', required: true }],
    endsWith: [{ name: 'suffix', type: 'text', label: 'Suffix', required: true }],
    wordCount: [
      { name: 'min', type: 'number', label: 'Min words' },
      { name: 'max', type: 'number', label: 'Max words' }
    ],

    // Pattern rules
    phone: [{ name: 'format', type: 'select', label: 'Format', options: ['international', 'us', 'uk', 'generic'] }],
    postalCode: [{ name: 'country', type: 'text', label: 'Country code', default: 'US' }],
    ipAddress: [{ name: 'version', type: 'select', label: 'Version', options: ['both', 'v4', 'v6'] }],
    username: [
      { name: 'minLength', type: 'number', label: 'Min length', default: 3 },
      { name: 'maxLength', type: 'number', label: 'Max length', default: 20 }
    ],
    password: [
      { name: 'minLength', type: 'number', label: 'Min length', default: 8 },
      { name: 'uppercase', type: 'checkbox', label: 'Require uppercase', default: true },
      { name: 'lowercase', type: 'checkbox', label: 'Require lowercase', default: true },
      { name: 'number', type: 'checkbox', label: 'Require number', default: true },
      { name: 'special', type: 'checkbox', label: 'Require special char', default: false }
    ],
    regex: [
      { name: 'pattern', type: 'text', label: 'Pattern', required: true },
      { name: 'flags', type: 'text', label: 'Flags' }
    ],

    // Number rules
    min: [{ name: 'min', type: 'number', label: 'Minimum value', required: true }],
    max: [{ name: 'max', type: 'number', label: 'Maximum value', required: true }],
    range: [
      { name: 'min', type: 'number', label: 'Minimum', required: true },
      { name: 'max', type: 'number', label: 'Maximum', required: true }
    ],
    divisibleBy: [{ name: 'divisor', type: 'number', label: 'Divisor', required: true }],
    decimal: [{ name: 'places', type: 'number', label: 'Decimal places', default: 2 }],

    // Date rules
    dateFormat: [{ name: 'format', type: 'text', label: 'Format', default: 'YYYY-MM-DD' }],
    dateAfter: [
      { name: 'date', type: 'date', label: 'After date' },
      { name: 'field', type: 'text', label: 'Or field selector' }
    ],
    dateBefore: [
      { name: 'date', type: 'date', label: 'Before date' },
      { name: 'field', type: 'text', label: 'Or field selector' }
    ],
    dateBetween: [
      { name: 'min', type: 'date', label: 'Start date', required: true },
      { name: 'max', type: 'date', label: 'End date', required: true }
    ],
    age: [{ name: 'min', type: 'number', label: 'Minimum age', default: 18 }],

    // File rules
    fileSize: [{ name: 'max', type: 'text', label: 'Max size (e.g., 5MB)', required: true }],
    fileMinSize: [{ name: 'min', type: 'text', label: 'Min size', required: true }],
    fileType: [{ name: 'types', type: 'text', label: 'MIME types (comma-separated)', required: true }],
    fileExtension: [{ name: 'extensions', type: 'text', label: 'Extensions (comma-separated)', required: true }],
    imageDimensions: [
      { name: 'maxWidth', type: 'number', label: 'Max width' },
      { name: 'maxHeight', type: 'number', label: 'Max height' },
      { name: 'minWidth', type: 'number', label: 'Min width' },
      { name: 'minHeight', type: 'number', label: 'Min height' }
    ],
    maxFiles: [{ name: 'max', type: 'number', label: 'Maximum files', required: true }],
    minFiles: [{ name: 'min', type: 'number', label: 'Minimum files', required: true }],

    // Comparison rules
    equals: [{ name: 'value', type: 'text', label: 'Value', required: true }],
    notEquals: [{ name: 'value', type: 'text', label: 'Value', required: true }],
    confirmedBy: [{ name: 'field', type: 'text', label: 'Confirmation field selector', required: true }],
    matches: [{ name: 'field', type: 'text', label: 'Field to match', required: true }],
    lessThan: [
      { name: 'value', type: 'number', label: 'Value' },
      { name: 'field', type: 'text', label: 'Or field selector' }
    ],
    greaterThan: [
      { name: 'value', type: 'number', label: 'Value' },
      { name: 'field', type: 'text', label: 'Or field selector' }
    ],
    requiredIf: [
      { name: 'field', type: 'text', label: 'Field selector', required: true },
      { name: 'value', type: 'text', label: 'Has value' }
    ],
    requiredUnless: [
      { name: 'field', type: 'text', label: 'Field selector', required: true },
      { name: 'value', type: 'text', label: 'Has value' }
    ],
    requiredWith: [{ name: 'field', type: 'text', label: 'Field selector(s)', required: true }],
    requiredWithout: [{ name: 'field', type: 'text', label: 'Field selector(s)', required: true }],

    // Selection rules
    inList: [{ name: 'list', type: 'text', label: 'Allowed values (comma-separated)', required: true }],
    notInList: [{ name: 'list', type: 'text', label: 'Forbidden values (comma-separated)', required: true }],
    minSelected: [{ name: 'min', type: 'number', label: 'Minimum selections', required: true }],
    maxSelected: [{ name: 'max', type: 'number', label: 'Maximum selections', required: true }],
    exactSelected: [{ name: 'count', type: 'number', label: 'Exact selections', required: true }],

    // Async rules
    remote: [
      { name: 'url', type: 'text', label: 'Validation URL', required: true },
      { name: 'method', type: 'select', label: 'Method', options: ['POST', 'GET'], default: 'POST' }
    ],
    unique: [{ name: 'url', type: 'text', label: 'Check URL', default: '/api/check-unique' }],
    exists: [{ name: 'url', type: 'text', label: 'Check URL', default: '/api/check-exists' }]
  };

  return paramDefs[name] || [];
}

// Re-export utilities
export { registerCallback, unregisterCallback, getCallbacks };

export default {
  getAllRules,
  getRule,
  hasRule,
  registerRule,
  unregisterRule,
  getRuleMetadata,
  getRuleParams,
  ruleCategories
};
