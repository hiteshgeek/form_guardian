/**
 * Date/Time Validation Rules
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Parse date from various formats
 * @param {*} value
 * @param {string} format
 * @returns {Date|null}
 */
function parseDate(value, format) {
  if (!value) return null;

  // If already a Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  const str = String(value);

  // Try native Date parsing first (handles ISO format, etc.)
  const nativeDate = new Date(str);
  if (!isNaN(nativeDate.getTime())) {
    return nativeDate;
  }

  // Handle common formats
  if (format) {
    return parseDateWithFormat(str, format);
  }

  return null;
}

/**
 * Parse date with specific format
 * @param {string} str
 * @param {string} format
 * @returns {Date|null}
 */
function parseDateWithFormat(str, format) {
  const formatParts = {
    'YYYY': { regex: '(\\d{4})', index: 'year' },
    'YY': { regex: '(\\d{2})', index: 'year', transform: y => 2000 + parseInt(y) },
    'MM': { regex: '(\\d{2})', index: 'month' },
    'M': { regex: '(\\d{1,2})', index: 'month' },
    'DD': { regex: '(\\d{2})', index: 'day' },
    'D': { regex: '(\\d{1,2})', index: 'day' },
    'HH': { regex: '(\\d{2})', index: 'hour' },
    'H': { regex: '(\\d{1,2})', index: 'hour' },
    'mm': { regex: '(\\d{2})', index: 'minute' },
    'm': { regex: '(\\d{1,2})', index: 'minute' },
    'ss': { regex: '(\\d{2})', index: 'second' },
    's': { regex: '(\\d{1,2})', index: 'second' }
  };

  let pattern = format;
  const groups = [];

  // Build regex from format
  Object.entries(formatParts).forEach(([token, config]) => {
    if (pattern.includes(token)) {
      groups.push({ ...config, token });
      pattern = pattern.replace(token, config.regex);
    }
  });

  // Escape remaining characters
  pattern = pattern.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');

  try {
    const regex = new RegExp(`^${pattern}$`);
    const match = str.match(regex);

    if (!match) return null;

    const parts = { year: 1970, month: 1, day: 1, hour: 0, minute: 0, second: 0 };

    groups.forEach((group, i) => {
      let value = parseInt(match[i + 1], 10);
      if (group.transform) value = group.transform(value);
      parts[group.index] = value;
    });

    const date = new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Valid date
 */
export const date = {
  message: 'Please enter a valid date',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const format = params.format;
    const parsed = parseDate(value, format);
    return parsed !== null;
  }
};

/**
 * Valid time
 */
export const time = {
  message: 'Please enter a valid time',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const str = String(value);
    const format24 = params.format24 !== false;

    if (format24) {
      // 24-hour format: HH:MM or HH:MM:SS
      return /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(str);
    }
    // 12-hour format: HH:MM AM/PM
    return /^(0?[1-9]|1[0-2]):[0-5][0-9](\s?[AaPp][Mm])?$/.test(str);
  }
};

/**
 * Valid datetime
 */
export const datetime = {
  message: 'Please enter a valid date and time',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const format = params.format;
    const parsed = parseDate(value, format);
    return parsed !== null;
  }
};

/**
 * Date format validation
 */
export const dateFormat = {
  message: 'Date must be in format {format}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const format = params.format || params.value;
    if (!format) return true;

    const parsed = parseDateWithFormat(String(value), format);
    return parsed !== null;
  }
};

/**
 * Date after
 */
export const dateAfter = {
  message: 'Date must be after {date}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const date = parseDate(value, params.format);
    if (!date) return false;

    let compareDate;
    if (params.date === 'today' || params.date === 'now') {
      compareDate = new Date();
      compareDate.setHours(0, 0, 0, 0);
    } else if (params.field) {
      // Compare with another field
      const otherField = document.querySelector(params.field);
      if (!otherField) return true;
      compareDate = parseDate(otherField.value, params.format);
    } else {
      compareDate = parseDate(params.date || params.value, params.format);
    }

    if (!compareDate) return true;

    return date.getTime() > compareDate.getTime();
  }
};

/**
 * Date before
 */
export const dateBefore = {
  message: 'Date must be before {date}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const date = parseDate(value, params.format);
    if (!date) return false;

    let compareDate;
    if (params.date === 'today' || params.date === 'now') {
      compareDate = new Date();
      compareDate.setHours(23, 59, 59, 999);
    } else if (params.field) {
      const otherField = document.querySelector(params.field);
      if (!otherField) return true;
      compareDate = parseDate(otherField.value, params.format);
    } else {
      compareDate = parseDate(params.date || params.value, params.format);
    }

    if (!compareDate) return true;

    return date.getTime() < compareDate.getTime();
  }
};

/**
 * Date between
 */
export const dateBetween = {
  message: 'Date must be between {min} and {max}',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const date = parseDate(value, params.format);
    if (!date) return false;

    const minDate = parseDate(params.min, params.format);
    const maxDate = parseDate(params.max, params.format);

    if (!minDate || !maxDate) return true;

    const time = date.getTime();
    return time >= minDate.getTime() && time <= maxDate.getTime();
  }
};

/**
 * Minimum age
 */
export const age = {
  message: 'Must be at least {min} years old',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const birthDate = parseDate(value, params.format);
    if (!birthDate) return false;

    const minAge = params.min || params.value || 18;
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= minAge;
    }

    return age >= minAge;
  }
};

/**
 * Future date
 */
export const futureDate = {
  message: 'Date must be in the future',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const date = parseDate(value, params.format);
    if (!date) return false;

    const now = new Date();
    if (params.includeToday) {
      now.setHours(0, 0, 0, 0);
    }

    return date.getTime() > now.getTime();
  }
};

/**
 * Past date
 */
export const pastDate = {
  message: 'Date must be in the past',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const date = parseDate(value, params.format);
    if (!date) return false;

    const now = new Date();
    if (params.includeToday) {
      now.setHours(23, 59, 59, 999);
    }

    return date.getTime() < now.getTime();
  }
};

/**
 * Weekday (Monday-Friday)
 */
export const weekday = {
  message: 'Date must be a weekday',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const date = parseDate(value, params.format);
    if (!date) return false;

    const day = date.getDay();
    return day >= 1 && day <= 5;
  }
};

/**
 * Weekend (Saturday-Sunday)
 */
export const weekend = {
  message: 'Date must be a weekend',
  validate(value, params) {
    if (isEmptyValue(value)) return true;

    const date = parseDate(value, params.format);
    if (!date) return false;

    const day = date.getDay();
    return day === 0 || day === 6;
  }
};

export default {
  date,
  time,
  datetime,
  dateFormat,
  dateAfter,
  dateBefore,
  dateBetween,
  age,
  futureDate,
  pastDate,
  weekday,
  weekend
};
