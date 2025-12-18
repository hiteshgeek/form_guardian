/**
 * Comparison Validation Rules
 */

import { isEmptyValue, getFieldValue } from '../utils/dom.js';

/**
 * Get field by selector or name
 * @param {string} selector
 * @param {Element} context
 * @returns {Element|null}
 */
function getCompareField(selector, context) {
  if (!selector) return null;

  // Try as selector first
  let field = document.querySelector(selector);
  if (field) return field;

  // Try as name within form
  const form = context?.closest('form');
  if (form) {
    field = form.querySelector(`[name="${selector}"]`);
    if (field) return field;

    // Try with ID
    field = form.querySelector(`#${selector}`);
    if (field) return field;
  }

  return null;
}

/**
 * Equals - must equal a specific value
 */
export const equals = {
  message: 'Must equal {value}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const expected = params.value;
    return String(value) === String(expected);
  }
};

/**
 * Not equals
 */
export const notEquals = {
  message: 'Must not equal {value}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const expected = params.value;
    return String(value) !== String(expected);
  }
};

/**
 * Confirmed by another field (password confirmation)
 */
export const confirmedBy = {
  message: 'Does not match confirmation field',
  validate(value, params, field) {
    if (isEmptyValue(value)) return true;

    const confirmField = getCompareField(params.field || params.value, field);
    if (!confirmField) return true;

    const confirmValue = getFieldValue(confirmField);
    return String(value) === String(confirmValue);
  }
};

/**
 * Alias for confirmedBy - matches another field
 */
export const matches = {
  message: 'Fields do not match',
  validate(value, params, field) {
    return confirmedBy.validate(value, params, field);
  }
};

/**
 * Less than value or field
 */
export const lessThan = {
  message: 'Must be less than {compareValue}',
  validate(value, params, field) {
    if (isEmptyValue(value)) return true;

    let compareValue;
    if (params.field) {
      const compareField = getCompareField(params.field, field);
      if (!compareField) return true;
      compareValue = getFieldValue(compareField);
    } else {
      compareValue = params.value;
    }

    params.compareValue = compareValue;

    const num = parseFloat(value);
    const compare = parseFloat(compareValue);

    if (isNaN(num) || isNaN(compare)) {
      // String comparison
      return String(value) < String(compareValue);
    }

    return num < compare;
  }
};

/**
 * Greater than value or field
 */
export const greaterThan = {
  message: 'Must be greater than {compareValue}',
  validate(value, params, field) {
    if (isEmptyValue(value)) return true;

    let compareValue;
    if (params.field) {
      const compareField = getCompareField(params.field, field);
      if (!compareField) return true;
      compareValue = getFieldValue(compareField);
    } else {
      compareValue = params.value;
    }

    params.compareValue = compareValue;

    const num = parseFloat(value);
    const compare = parseFloat(compareValue);

    if (isNaN(num) || isNaN(compare)) {
      return String(value) > String(compareValue);
    }

    return num > compare;
  }
};

/**
 * Less than or equal
 */
export const lessThanOrEqual = {
  message: 'Must be less than or equal to {compareValue}',
  validate(value, params, field) {
    if (isEmptyValue(value)) return true;

    let compareValue;
    if (params.field) {
      const compareField = getCompareField(params.field, field);
      if (!compareField) return true;
      compareValue = getFieldValue(compareField);
    } else {
      compareValue = params.value;
    }

    params.compareValue = compareValue;

    const num = parseFloat(value);
    const compare = parseFloat(compareValue);

    if (isNaN(num) || isNaN(compare)) {
      return String(value) <= String(compareValue);
    }

    return num <= compare;
  }
};

/**
 * Greater than or equal
 */
export const greaterThanOrEqual = {
  message: 'Must be greater than or equal to {compareValue}',
  validate(value, params, field) {
    if (isEmptyValue(value)) return true;

    let compareValue;
    if (params.field) {
      const compareField = getCompareField(params.field, field);
      if (!compareField) return true;
      compareValue = getFieldValue(compareField);
    } else {
      compareValue = params.value;
    }

    params.compareValue = compareValue;

    const num = parseFloat(value);
    const compare = parseFloat(compareValue);

    if (isNaN(num) || isNaN(compare)) {
      return String(value) >= String(compareValue);
    }

    return num >= compare;
  }
};

/**
 * Required if another field has specific value
 */
export const requiredIf = {
  message: 'This field is required',
  validate(value, params, field) {
    const conditionField = getCompareField(params.field, field);
    if (!conditionField) return true;

    const conditionValue = getFieldValue(conditionField);
    let expectedValue = params.value;

    // Handle array of possible values
    let shouldBeRequired;
    if (Array.isArray(expectedValue)) {
      shouldBeRequired = expectedValue.some(v => String(conditionValue) === String(v));
    } else if (expectedValue === true || expectedValue === 'true') {
      // Check if field is truthy
      shouldBeRequired = !isEmptyValue(conditionValue);
    } else if (expectedValue !== undefined) {
      shouldBeRequired = String(conditionValue) === String(expectedValue);
    } else {
      // No expected value, just check if condition field is filled
      shouldBeRequired = !isEmptyValue(conditionValue);
    }

    if (!shouldBeRequired) return true;

    // Field is required
    return !isEmptyValue(value);
  }
};

/**
 * Required unless another field has specific value
 */
export const requiredUnless = {
  message: 'This field is required',
  validate(value, params, field) {
    const conditionField = getCompareField(params.field, field);
    if (!conditionField) return !isEmptyValue(value);

    const conditionValue = getFieldValue(conditionField);
    let expectedValue = params.value;

    // Check if condition is met (field NOT required)
    let conditionMet;
    if (Array.isArray(expectedValue)) {
      conditionMet = expectedValue.some(v => String(conditionValue) === String(v));
    } else if (expectedValue !== undefined) {
      conditionMet = String(conditionValue) === String(expectedValue);
    } else {
      conditionMet = !isEmptyValue(conditionValue);
    }

    if (conditionMet) return true; // Not required

    return !isEmptyValue(value);
  }
};

/**
 * Required with another field (if other field is filled)
 */
export const requiredWith = {
  message: 'This field is required',
  validate(value, params, field) {
    let fields = params.fields || params.field || params.value;
    if (typeof fields === 'string') {
      fields = fields.split(',').map(f => f.trim());
    }
    if (!Array.isArray(fields)) fields = [fields];

    const anyFilled = fields.some(f => {
      const otherField = getCompareField(f, field);
      if (!otherField) return false;
      return !isEmptyValue(getFieldValue(otherField));
    });

    if (!anyFilled) return true;

    return !isEmptyValue(value);
  }
};

/**
 * Required without another field (if other field is empty)
 */
export const requiredWithout = {
  message: 'This field is required',
  validate(value, params, field) {
    let fields = params.fields || params.field || params.value;
    if (typeof fields === 'string') {
      fields = fields.split(',').map(f => f.trim());
    }
    if (!Array.isArray(fields)) fields = [fields];

    const anyEmpty = fields.some(f => {
      const otherField = getCompareField(f, field);
      if (!otherField) return true;
      return isEmptyValue(getFieldValue(otherField));
    });

    if (!anyEmpty) return true;

    return !isEmptyValue(value);
  }
};

/**
 * Different from another field
 */
export const different = {
  message: 'Must be different from {fieldName}',
  validate(value, params, field) {
    if (isEmptyValue(value)) return true;

    const compareField = getCompareField(params.field || params.value, field);
    if (!compareField) return true;

    const compareValue = getFieldValue(compareField);
    params.fieldName = params.field || params.value;

    return String(value) !== String(compareValue);
  }
};

export default {
  equals,
  notEquals,
  confirmedBy,
  matches,
  lessThan,
  greaterThan,
  lessThanOrEqual,
  greaterThanOrEqual,
  requiredIf,
  requiredUnless,
  requiredWith,
  requiredWithout,
  different
};
