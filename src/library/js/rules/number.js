/**
 * Number Validation Rules
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Numeric validation
 */
export const numeric = {
  message: 'Must be a number',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  }
};

/**
 * Integer validation
 */
export const integer = {
  message: 'Must be a whole number',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    return !isNaN(num) && Number.isInteger(num);
  }
};

/**
 * Float validation
 */
export const float = {
  message: 'Must be a decimal number',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && !Number.isInteger(num);
  }
};

/**
 * Positive number
 */
export const positive = {
  message: 'Must be a positive number',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  }
};

/**
 * Negative number
 */
export const negative = {
  message: 'Must be a negative number',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num < 0;
  }
};

/**
 * Minimum value
 */
export const min = {
  message: 'Must be at least {min}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    const minVal = params.min !== undefined ? params.min : params.value;
    return !isNaN(num) && num >= minVal;
  }
};

/**
 * Maximum value
 */
export const max = {
  message: 'Must be no more than {max}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    const maxVal = params.max !== undefined ? params.max : params.value;
    return !isNaN(num) && num <= maxVal;
  }
};

/**
 * Range (between min and max)
 */
export const range = {
  message: 'Must be between {min} and {max}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    const minVal = params.min;
    const maxVal = params.max;
    return !isNaN(num) && num >= minVal && num <= maxVal;
  }
};

/**
 * Divisible by
 */
export const divisibleBy = {
  message: 'Must be divisible by {divisor}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    const divisor = params.divisor || params.value;
    if (isNaN(num) || divisor === 0) return false;
    return num % divisor === 0;
  }
};

/**
 * Even number
 */
export const even = {
  message: 'Must be an even number',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    return !isNaN(num) && Number.isInteger(num) && num % 2 === 0;
  }
};

/**
 * Odd number
 */
export const odd = {
  message: 'Must be an odd number',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    return !isNaN(num) && Number.isInteger(num) && num % 2 !== 0;
  }
};

/**
 * Decimal places validation
 */
export const decimal = {
  message: 'Must have at most {places} decimal places',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const str = String(value);
    const places = params.places || params.value || 2;

    // Check if valid number
    const num = parseFloat(value);
    if (isNaN(num)) return false;

    // Count decimal places
    const parts = str.split('.');
    if (parts.length === 1) return true; // No decimal
    return parts[1].length <= places;
  }
};

/**
 * Percentage (0-100)
 */
export const percentage = {
  message: 'Must be a percentage between 0 and 100',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const num = parseFloat(value);
    const allowDecimals = params.allowDecimals !== false;

    if (isNaN(num)) return false;
    if (!allowDecimals && !Number.isInteger(num)) return false;

    return num >= 0 && num <= 100;
  }
};

/**
 * Currency format
 */
export const currency = {
  message: 'Must be a valid currency amount',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const allowNegative = params.allowNegative || false;
    const maxDecimals = params.decimals || 2;

    // Remove currency symbols and thousands separators
    let cleaned = String(value)
      .replace(/[$€£¥₹]/g, '')
      .replace(/,/g, '')
      .trim();

    // Check for negative
    const isNegative = cleaned.startsWith('-');
    if (isNegative) {
      if (!allowNegative) return false;
      cleaned = cleaned.slice(1);
    }

    // Validate as number with decimal places
    const pattern = new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`);
    return pattern.test(cleaned);
  }
};

export default {
  numeric,
  integer,
  float,
  positive,
  negative,
  min,
  max,
  range,
  divisibleBy,
  even,
  odd,
  decimal,
  percentage,
  currency
};
