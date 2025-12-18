/**
 * String Validation Rules
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Required - Value must not be empty
 */
export const required = {
  message: 'This field is required',
  validate(value) {
    if (typeof value === 'boolean') return value === true;
    if (Array.isArray(value)) return value.length > 0;
    if (value instanceof FileList) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return value !== null && value !== undefined;
  }
};

/**
 * Minimum length
 */
export const minLength = {
  message: 'Must be at least {min} characters',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const min = params.min || params.value || 0;
    return String(value).length >= min;
  }
};

/**
 * Maximum length
 */
export const maxLength = {
  message: 'Must be no more than {max} characters',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const max = params.max || params.value || Infinity;
    return String(value).length <= max;
  }
};

/**
 * Exact length
 */
export const exactLength = {
  message: 'Must be exactly {length} characters',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const length = params.length || params.value || 0;
    return String(value).length === length;
  }
};

/**
 * Length range
 */
export const rangeLength = {
  message: 'Must be between {min} and {max} characters',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const min = params.min || 0;
    const max = params.max || Infinity;
    const len = String(value).length;
    return len >= min && len <= max;
  }
};

/**
 * Alpha only (letters)
 */
export const alpha = {
  message: 'Must contain only letters',
  validate(value) {
    if (isEmptyValue(value)) return true;
    return /^[a-zA-Z]+$/.test(String(value));
  }
};

/**
 * Alphanumeric (letters and numbers)
 */
export const alphaNumeric = {
  message: 'Must contain only letters and numbers',
  validate(value) {
    if (isEmptyValue(value)) return true;
    return /^[a-zA-Z0-9]+$/.test(String(value));
  }
};

/**
 * Alpha with spaces
 */
export const alphaSpace = {
  message: 'Must contain only letters and spaces',
  validate(value) {
    if (isEmptyValue(value)) return true;
    return /^[a-zA-Z\s]+$/.test(String(value));
  }
};

/**
 * Alpha dash (letters, numbers, dashes, underscores)
 */
export const alphaDash = {
  message: 'Must contain only letters, numbers, dashes, and underscores',
  validate(value) {
    if (isEmptyValue(value)) return true;
    return /^[a-zA-Z0-9_-]+$/.test(String(value));
  }
};

/**
 * No whitespace
 */
export const noWhitespace = {
  message: 'Must not contain spaces',
  validate(value) {
    if (isEmptyValue(value)) return true;
    return !/\s/.test(String(value));
  }
};

/**
 * Trimmed (no leading/trailing whitespace)
 */
export const trimmed = {
  message: 'Must not have leading or trailing spaces',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const str = String(value);
    return str === str.trim();
  }
};

/**
 * Lowercase only
 */
export const lowercase = {
  message: 'Must be lowercase',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const str = String(value);
    return str === str.toLowerCase();
  }
};

/**
 * Uppercase only
 */
export const uppercase = {
  message: 'Must be uppercase',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const str = String(value);
    return str === str.toUpperCase();
  }
};

/**
 * Contains substring
 */
export const contains = {
  message: 'Must contain "{substring}"',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const substring = params.substring || params.value || '';
    const caseSensitive = params.caseSensitive !== false;

    if (caseSensitive) {
      return String(value).includes(substring);
    }
    return String(value).toLowerCase().includes(substring.toLowerCase());
  }
};

/**
 * Does not contain substring
 */
export const notContains = {
  message: 'Must not contain "{substring}"',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const substring = params.substring || params.value || '';
    const caseSensitive = params.caseSensitive !== false;

    if (caseSensitive) {
      return !String(value).includes(substring);
    }
    return !String(value).toLowerCase().includes(substring.toLowerCase());
  }
};

/**
 * Starts with
 */
export const startsWith = {
  message: 'Must start with "{prefix}"',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const prefix = params.prefix || params.value || '';
    return String(value).startsWith(prefix);
  }
};

/**
 * Ends with
 */
export const endsWith = {
  message: 'Must end with "{suffix}"',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const suffix = params.suffix || params.value || '';
    return String(value).endsWith(suffix);
  }
};

/**
 * Word count validation
 */
export const wordCount = {
  message: 'Must have between {min} and {max} words',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const words = String(value).trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    const min = params.min || 0;
    const max = params.max || Infinity;
    return count >= min && count <= max;
  }
};

export default {
  required,
  minLength,
  maxLength,
  exactLength,
  rangeLength,
  alpha,
  alphaNumeric,
  alphaSpace,
  alphaDash,
  noWhitespace,
  trimmed,
  lowercase,
  uppercase,
  contains,
  notContains,
  startsWith,
  endsWith,
  wordCount
};
