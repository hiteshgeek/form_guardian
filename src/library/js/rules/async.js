/**
 * Async Validation Rules (AJAX/Server-side)
 */

import { isEmptyValue } from '../utils/dom.js';

/**
 * Cache for async validation results
 */
const asyncCache = new Map();

/**
 * Get cache key for request
 * @param {string} url
 * @param {*} value
 * @returns {string}
 */
function getCacheKey(url, value) {
  return `${url}:${JSON.stringify(value)}`;
}

/**
 * Remote validation via AJAX
 */
export const remote = {
  message: 'Validation failed',
  async validate(value, params) {
    if (isEmptyValue(value)) return true;

    const url = params.url || params.value;
    if (!url) return true;

    const method = (params.method || 'POST').toUpperCase();
    const fieldName = params.name || params.fieldName || 'value';
    const headers = params.headers || {};
    const timeout = params.timeout || 5000;
    const cache = params.cache !== false;

    // Check cache
    if (cache) {
      const cacheKey = getCacheKey(url, value);
      if (asyncCache.has(cacheKey)) {
        const cached = asyncCache.get(cacheKey);
        if (Date.now() - cached.time < 30000) { // 30 second cache
          return cached.valid;
        }
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      let response;

      if (method === 'GET') {
        const urlWithParams = new URL(url, window.location.origin);
        urlWithParams.searchParams.set(fieldName, value);

        response = await fetch(urlWithParams.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            ...headers
          },
          signal: controller.signal
        });
      } else {
        const body = params.asJson
          ? JSON.stringify({ [fieldName]: value, ...params.data })
          : new URLSearchParams({ [fieldName]: value, ...params.data });

        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': params.asJson ? 'application/json' : 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            ...headers
          },
          body,
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn('[FormGuardian] Remote validation request failed:', response.status);
        return true; // Fail open on network error
      }

      const data = await response.json();

      // Determine if valid from response
      let isValid;
      if (params.responseKey) {
        isValid = data[params.responseKey];
      } else if (typeof data === 'boolean') {
        isValid = data;
      } else if (data.valid !== undefined) {
        isValid = data.valid;
      } else if (data.success !== undefined) {
        isValid = data.success;
      } else if (data.error || data.message) {
        isValid = false;
        if (data.message) params.message = data.message;
      } else {
        isValid = true;
      }

      // Cache result
      if (cache) {
        asyncCache.set(getCacheKey(url, value), {
          valid: isValid,
          time: Date.now()
        });
      }

      return isValid;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('[FormGuardian] Remote validation timed out');
      } else {
        console.warn('[FormGuardian] Remote validation error:', error);
      }
      return true; // Fail open on error
    }
  }
};

/**
 * Check if value is unique (not already in use)
 */
export const unique = {
  message: 'This value is already taken',
  async validate(value, params, field, guardian) {
    if (isEmptyValue(value)) return true;

    const url = params.url || '/api/check-unique';
    const fieldName = params.name || field?.name || 'value';
    const type = params.type || fieldName; // e.g., 'email', 'username'

    return remote.validate(value, {
      url,
      name: fieldName,
      data: { type },
      method: params.method || 'POST',
      cache: params.cache !== false,
      timeout: params.timeout || 5000
    });
  }
};

/**
 * Check if value exists in database
 */
export const exists = {
  message: 'This value does not exist',
  async validate(value, params, field) {
    if (isEmptyValue(value)) return true;

    const url = params.url || '/api/check-exists';
    const fieldName = params.name || field?.name || 'value';
    const type = params.type || fieldName;

    return remote.validate(value, {
      url,
      name: fieldName,
      data: { type },
      method: params.method || 'POST',
      cache: params.cache !== false,
      timeout: params.timeout || 5000
    });
  }
};

/**
 * Clear async validation cache
 */
export function clearAsyncCache() {
  asyncCache.clear();
}

export default {
  remote,
  unique,
  exists,
  clearAsyncCache
};
