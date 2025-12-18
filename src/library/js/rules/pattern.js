/**
 * Pattern Validation Rules
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Email validation
 */
export const email = {
  message: 'Please enter a valid email address',
  validate(value) {
    if (isEmptyValue(value)) return true;
    // RFC 5322 compliant email regex
    const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return pattern.test(String(value));
  }
};

/**
 * URL validation
 */
export const url = {
  message: 'Please enter a valid URL',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const requireProtocol = params.requireProtocol !== false;
    const allowedProtocols = params.protocols || ['http', 'https'];

    try {
      let urlStr = String(value);

      // Add protocol if missing and not required
      if (!requireProtocol && !/^[a-zA-Z]+:\/\//.test(urlStr)) {
        urlStr = 'https://' + urlStr;
      }

      const url = new URL(urlStr);
      const protocol = url.protocol.replace(':', '');

      return allowedProtocols.includes(protocol);
    } catch {
      return false;
    }
  }
};

/**
 * Phone number validation
 */
export const phone = {
  message: 'Please enter a valid phone number',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const format = params.format || 'international';

    const patterns = {
      // Matches international format: +1234567890 or +1 234 567 890
      international: /^\+?[1-9]\d{1,14}$/,
      // US format: (123) 456-7890 or 123-456-7890
      us: /^(\+1)?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      // UK format
      uk: /^(\+44|0)[-.\s]?[1-9]\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/,
      // Generic: just digits, optionally with + prefix
      generic: /^\+?[\d\s\-().]{7,20}$/
    };

    const pattern = patterns[format] || patterns.generic;
    const cleaned = String(value).replace(/[\s\-().]/g, '');

    return pattern.test(String(value)) || /^\+?[\d]{7,15}$/.test(cleaned);
  }
};

/**
 * Postal/ZIP code validation
 */
export const postalCode = {
  message: 'Please enter a valid postal code',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const country = (params.country || params.value || 'US').toUpperCase();

    const patterns = {
      US: /^\d{5}(-\d{4})?$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
      CA: /^[A-Z]\d[A-Z]\s*\d[A-Z]\d$/i,
      DE: /^\d{5}$/,
      FR: /^\d{5}$/,
      AU: /^\d{4}$/,
      IN: /^\d{6}$/,
      JP: /^\d{3}-?\d{4}$/,
      generic: /^[\w\d\s-]{3,10}$/
    };

    const pattern = patterns[country] || patterns.generic;
    return pattern.test(String(value));
  }
};

/**
 * IP address validation
 */
export const ipAddress = {
  message: 'Please enter a valid IP address',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const version = params.version || 'both';
    const str = String(value);

    // IPv4
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // IPv6 (simplified)
    const ipv6Pattern = /^(?:[A-Fa-f0-9]{1,4}:){7}[A-Fa-f0-9]{1,4}$|^::(?:[A-Fa-f0-9]{1,4}:){0,6}[A-Fa-f0-9]{1,4}$|^(?:[A-Fa-f0-9]{1,4}:){1,7}:$|^(?:[A-Fa-f0-9]{1,4}:){1,6}:[A-Fa-f0-9]{1,4}$/;

    if (version === 'v4' || version === '4') return ipv4Pattern.test(str);
    if (version === 'v6' || version === '6') return ipv6Pattern.test(str);

    return ipv4Pattern.test(str) || ipv6Pattern.test(str);
  }
};

/**
 * Hex color validation
 */
export const hexColor = {
  message: 'Please enter a valid hex color',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const allowShort = params.allowShort !== false;
    const str = String(value);

    if (allowShort) {
      return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
    }
    return /^#?[A-Fa-f0-9]{6}$/.test(str);
  }
};

/**
 * URL slug validation
 */
export const slug = {
  message: 'Must be a valid URL slug (lowercase letters, numbers, and hyphens)',
  validate(value) {
    if (isEmptyValue(value)) return true;
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value));
  }
};

/**
 * Username validation
 */
export const username = {
  message: 'Username must be 3-20 characters, letters, numbers, and underscores only',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const minLength = params.minLength || 3;
    const maxLength = params.maxLength || 20;
    const allowDots = params.allowDots || false;
    const str = String(value);

    const pattern = allowDots
      ? new RegExp(`^[a-zA-Z][a-zA-Z0-9_.]{${minLength - 1},${maxLength - 1}}$`)
      : new RegExp(`^[a-zA-Z][a-zA-Z0-9_]{${minLength - 1},${maxLength - 1}}$`);

    return pattern.test(str);
  }
};

/**
 * Credit card validation with Luhn check
 */
export const creditCard = {
  message: 'Please enter a valid credit card number',
  validate(value) {
    if (isEmptyValue(value)) return true;

    // Remove spaces and dashes
    const cardNumber = String(value).replace(/[\s-]/g, '');

    // Check if all digits
    if (!/^\d+$/.test(cardNumber)) return false;

    // Check length (13-19 digits)
    if (cardNumber.length < 13 || cardNumber.length > 19) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
};

/**
 * IBAN validation
 */
export const iban = {
  message: 'Please enter a valid IBAN',
  validate(value) {
    if (isEmptyValue(value)) return true;

    // Remove spaces and convert to uppercase
    const iban = String(value).replace(/\s/g, '').toUpperCase();

    // Basic format check
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(iban)) return false;

    // Rearrange: move first 4 chars to end
    const rearranged = iban.slice(4) + iban.slice(0, 4);

    // Convert letters to numbers (A=10, B=11, etc.)
    const numeric = rearranged.replace(/[A-Z]/g, char => char.charCodeAt(0) - 55);

    // Mod 97 check (must equal 1)
    let remainder = numeric;
    while (remainder.length > 2) {
      const block = remainder.slice(0, 9);
      remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
    }

    return parseInt(remainder, 10) % 97 === 1;
  }
};

/**
 * UUID validation
 */
export const uuid = {
  message: 'Please enter a valid UUID',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const version = params.version;
    const str = String(value).toLowerCase();

    if (version) {
      const pattern = new RegExp(`^[0-9a-f]{8}-[0-9a-f]{4}-${version}[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);
      return pattern.test(str);
    }

    // Any UUID version
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(str);
  }
};

/**
 * Password strength validation
 */
export const password = {
  message: 'Password does not meet requirements',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const str = String(value);

    const minLength = params.minLength || 8;
    const requireUppercase = params.uppercase !== false;
    const requireLowercase = params.lowercase !== false;
    const requireNumber = params.number !== false;
    const requireSpecial = params.special || false;

    if (str.length < minLength) return false;
    if (requireUppercase && !/[A-Z]/.test(str)) return false;
    if (requireLowercase && !/[a-z]/.test(str)) return false;
    if (requireNumber && !/\d/.test(str)) return false;
    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(str)) return false;

    return true;
  }
};

/**
 * Custom regex pattern
 */
export const regex = {
  message: 'Invalid format',
  validate(value, params) {
    if (isEmptyValue(value)) return true;
    const pattern = params.pattern || params.value;
    if (!pattern) return true;

    const flags = params.flags || '';
    const regexp = pattern instanceof RegExp ? pattern : new RegExp(pattern, flags);

    return regexp.test(String(value));
  }
};

/**
 * Valid JSON
 */
export const json = {
  message: 'Must be valid JSON',
  validate(value) {
    if (isEmptyValue(value)) return true;
    try {
      JSON.parse(String(value));
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Base64 validation
 */
export const base64 = {
  message: 'Must be valid base64',
  validate(value) {
    if (isEmptyValue(value)) return true;
    const str = String(value);

    // Check characters and padding
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) return false;

    // Length must be multiple of 4
    if (str.length % 4 !== 0) return false;

    return true;
  }
};

export default {
  email,
  url,
  phone,
  postalCode,
  ipAddress,
  hexColor,
  slug,
  username,
  creditCard,
  iban,
  uuid,
  password,
  regex,
  json,
  base64
};
