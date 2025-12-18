/**
 * LocalStorage Wrapper with JSON support and fallback
 */

const STORAGE_PREFIX = 'fg-';

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

const storageAvailable = isStorageAvailable();

// In-memory fallback for when localStorage is not available
const memoryStorage = new Map();

/**
 * Get prefixed key
 * @param {string} key
 * @returns {string}
 */
function getKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Get value from storage
 * @param {string} key - Storage key (without prefix)
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
export function get(key, defaultValue = null) {
  const prefixedKey = getKey(key);

  try {
    if (storageAvailable) {
      const item = localStorage.getItem(prefixedKey);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } else {
      return memoryStorage.has(prefixedKey)
        ? memoryStorage.get(prefixedKey)
        : defaultValue;
    }
  } catch (e) {
    console.warn(`[FormGuardian Storage] Error reading key "${key}":`, e);
    return defaultValue;
  }
}

/**
 * Set value in storage
 * @param {string} key - Storage key (without prefix)
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export function set(key, value) {
  const prefixedKey = getKey(key);

  try {
    if (storageAvailable) {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
    } else {
      memoryStorage.set(prefixedKey, value);
    }
    return true;
  } catch (e) {
    console.warn(`[FormGuardian Storage] Error writing key "${key}":`, e);
    return false;
  }
}

/**
 * Remove value from storage
 * @param {string} key - Storage key (without prefix)
 * @returns {boolean} Success status
 */
export function remove(key) {
  const prefixedKey = getKey(key);

  try {
    if (storageAvailable) {
      localStorage.removeItem(prefixedKey);
    } else {
      memoryStorage.delete(prefixedKey);
    }
    return true;
  } catch (e) {
    console.warn(`[FormGuardian Storage] Error removing key "${key}":`, e);
    return false;
  }
}

/**
 * Check if key exists in storage
 * @param {string} key - Storage key (without prefix)
 * @returns {boolean}
 */
export function has(key) {
  const prefixedKey = getKey(key);

  if (storageAvailable) {
    return localStorage.getItem(prefixedKey) !== null;
  }
  return memoryStorage.has(prefixedKey);
}

/**
 * Clear all FormGuardian storage items
 * @returns {boolean} Success status
 */
export function clear() {
  try {
    if (storageAvailable) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      memoryStorage.clear();
    }
    return true;
  } catch (e) {
    console.warn('[FormGuardian Storage] Error clearing storage:', e);
    return false;
  }
}

/**
 * Storage wrapper object
 */
const storage = {
  get,
  set,
  remove,
  has,
  clear,
  isAvailable: storageAvailable
};

export default storage;
