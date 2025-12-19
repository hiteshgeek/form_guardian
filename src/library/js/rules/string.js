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

/**
 * Character display names for human-readable error messages
 */
const CHAR_DISPLAY_NAMES = {
  ' ': 'space',
  '\t': 'tab',
  '\n': 'newline',
  '\r': 'carriage return',
  '-': 'hyphen',
  '_': 'underscore',
  '.': 'period',
  ',': 'comma',
  '!': 'exclamation',
  '?': 'question mark',
  '@': 'at sign',
  '#': 'hash',
  '$': 'dollar sign',
  '%': 'percent',
  '&': 'ampersand',
  '*': 'asterisk',
  '/': 'slash',
  '\\': 'backslash',
  ':': 'colon',
  ';': 'semicolon',
  "'": 'apostrophe',
  '"': 'quote',
  '(': 'opening parenthesis',
  ')': 'closing parenthesis',
  '[': 'opening bracket',
  ']': 'closing bracket',
  '{': 'opening brace',
  '}': 'closing brace',
  '<': 'less than',
  '>': 'greater than',
  '=': 'equals',
  '+': 'plus',
  '|': 'pipe',
  '~': 'tilde',
  '`': 'backtick'
};

/**
 * Get display name for a character
 * @param {string} char
 * @returns {string}
 */
function getCharDisplayName(char) {
  if (CHAR_DISPLAY_NAMES[char]) {
    return CHAR_DISPLAY_NAMES[char];
  }
  // For printable characters, return the character itself in quotes
  if (char.length === 1 && char.charCodeAt(0) >= 33 && char.charCodeAt(0) <= 126) {
    return `"${char}"`;
  }
  // For other characters, show the code point
  return `character (U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')})`;
}

/**
 * Format character list for display
 * @param {string} chars
 * @returns {string}
 */
function formatCharList(chars) {
  const names = chars.split('').map(c => getCharDisplayName(c));
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} or ${names[1]}`;
  return names.slice(0, -1).join(', ') + ', or ' + names[names.length - 1];
}

/**
 * Export character utilities for use in other modules
 */
export { getCharDisplayName, formatCharList, CHAR_DISPLAY_NAMES };

/**
 * No consecutive repeated characters
 * Prevents specified characters from appearing consecutively (e.g., no double spaces)
 */
export const noConsecutive = {
  message: 'No consecutive {chars} allowed',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const str = String(value);

    // Get the character(s) to check - default to space
    const chars = params.chars || params.char || params.value || ' ';

    // Create a regex that matches any of the specified characters repeated
    // Escape special regex characters
    const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`[${escapedChars}]{2,}`);

    const hasConsecutive = pattern.test(str);
    // Debug logging
    console.log('[noConsecutive]', { value: str, chars, escapedChars, pattern: pattern.toString(), hasConsecutive, valid: !hasConsecutive });

    return !hasConsecutive;
  },
  // Custom message formatter to show readable character names
  formatMessage(message, params) {
    const chars = params.chars || params.char || params.value || ' ';
    return message.replace('{chars}', formatCharList(chars));
  }
};

/**
 * Maximum consecutive occurrences of specific characters
 * More flexible version that allows specifying max consecutive count
 */
export const maxConsecutive = {
  message: 'No more than {max} consecutive {chars} allowed',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const str = String(value);

    const chars = params.chars || params.char || params.value || ' ';
    const maxCount = params.max || 1;

    // Escape special regex characters
    const escapedChars = chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`[${escapedChars}]{${maxCount + 1},}`);

    return !pattern.test(str);
  },
  formatMessage(message, params) {
    const chars = params.chars || params.char || params.value || ' ';
    const max = params.max || 1;
    return message
      .replace('{max}', max)
      .replace('{chars}', formatCharList(chars));
  }
};

/**
 * No repeated characters (any character repeated consecutively)
 * Prevents any character from appearing more than once in a row
 */
export const noRepeatedChars = {
  message: 'No repeated characters allowed',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const str = String(value);

    // Match any character followed by itself
    const pattern = /(.)\1+/;

    // If exceptions are provided, only validate outside of those
    const exceptions = params.except || '';
    if (exceptions) {
      // Find all repeated sequences
      const matches = str.match(/(.)\1+/g);
      if (!matches) return true;

      // Check if any match is not in exceptions
      return matches.every(match => exceptions.includes(match[0]));
    }

    return !pattern.test(str);
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
  wordCount,
  noConsecutive,
  maxConsecutive,
  noRepeatedChars
};
