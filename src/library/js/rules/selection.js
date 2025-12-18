/**
 * Selection Validation Rules (for select, checkbox, radio)
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Get selected values from field
 * @param {*} value
 * @returns {string[]}
 */
function getSelectedValues(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value) return [value];
  if (typeof value === 'boolean') return value ? ['true'] : [];
  return [];
}

/**
 * In list - value must be one of the allowed values
 */
export const inList = {
  message: 'Please select a valid option',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    let allowedList = params.list || params.values || params.value;
    if (typeof allowedList === 'string') {
      allowedList = allowedList.split(',').map(v => v.trim());
    }
    if (!Array.isArray(allowedList)) return true;

    const selected = getSelectedValues(value);
    return selected.every(v => allowedList.includes(v));
  }
};

/**
 * Not in list - value must not be one of the forbidden values
 */
export const notInList = {
  message: 'This value is not allowed',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    let forbiddenList = params.list || params.values || params.value;
    if (typeof forbiddenList === 'string') {
      forbiddenList = forbiddenList.split(',').map(v => v.trim());
    }
    if (!Array.isArray(forbiddenList)) return true;

    const selected = getSelectedValues(value);
    return selected.every(v => !forbiddenList.includes(v));
  }
};

/**
 * Minimum selected (for checkboxes or multi-select)
 */
export const minSelected = {
  message: 'Please select at least {min} options',
  validate(value, params) {
    const selected = getSelectedValues(value);
    if (selected.length === 0) return true; // Let required handle empty

    const min = params.min || params.value || 1;
    return selected.length >= min;
  }
};

/**
 * Maximum selected
 */
export const maxSelected = {
  message: 'Please select no more than {max} options',
  validate(value, params) {
    const selected = getSelectedValues(value);
    if (selected.length === 0) return true;

    const max = params.max || params.value || Infinity;
    return selected.length <= max;
  }
};

/**
 * Exact number selected
 */
export const exactSelected = {
  message: 'Please select exactly {count} options',
  validate(value, params) {
    const selected = getSelectedValues(value);
    if (selected.length === 0) return true;

    const count = params.count || params.value || 1;
    return selected.length === count;
  }
};

/**
 * Range of selections
 */
export const rangeSelected = {
  message: 'Please select between {min} and {max} options',
  validate(value, params) {
    const selected = getSelectedValues(value);
    if (selected.length === 0) return true;

    const min = params.min || 1;
    const max = params.max || Infinity;

    return selected.length >= min && selected.length <= max;
  }
};

/**
 * Must include specific values
 */
export const mustInclude = {
  message: 'Must include: {required}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    let requiredValues = params.values || params.value;
    if (typeof requiredValues === 'string') {
      requiredValues = requiredValues.split(',').map(v => v.trim());
    }
    if (!Array.isArray(requiredValues)) return true;

    params.required = requiredValues.join(', ');

    const selected = getSelectedValues(value);
    return requiredValues.every(req => selected.includes(req));
  }
};

/**
 * Must exclude specific values
 */
export const mustExclude = {
  message: 'Must not include: {forbidden}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    let forbiddenValues = params.values || params.value;
    if (typeof forbiddenValues === 'string') {
      forbiddenValues = forbiddenValues.split(',').map(v => v.trim());
    }
    if (!Array.isArray(forbiddenValues)) return true;

    params.forbidden = forbiddenValues.join(', ');

    const selected = getSelectedValues(value);
    return forbiddenValues.every(forbidden => !selected.includes(forbidden));
  }
};

export default {
  inList,
  notInList,
  minSelected,
  maxSelected,
  exactSelected,
  rangeSelected,
  mustInclude,
  mustExclude
};
