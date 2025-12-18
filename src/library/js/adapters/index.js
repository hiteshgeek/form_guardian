/**
 * Bootstrap Adapter Factory
 * Returns the appropriate adapter based on Bootstrap version
 */

import { Bootstrap3Adapter } from './Bootstrap3Adapter.js';
import { Bootstrap4Adapter } from './Bootstrap4Adapter.js';
import { Bootstrap5Adapter } from './Bootstrap5Adapter.js';

/**
 * Adapter cache by form
 */
const adapterCache = new WeakMap();

/**
 * Get adapter for Bootstrap version
 * @param {number|string} version - Bootstrap version (3, 4, 5, or 'auto')
 * @param {HTMLFormElement} form - Form element
 * @returns {BaseAdapter}
 */
export function getAdapter(version, form) {
  // Check cache
  const cacheKey = `${version}`;
  if (adapterCache.has(form)) {
    const cached = adapterCache.get(form);
    if (cached.version === cacheKey) {
      return cached.adapter;
    }
  }

  let adapter;

  switch (parseInt(version, 10)) {
    case 3:
      adapter = new Bootstrap3Adapter(form);
      break;
    case 4:
      adapter = new Bootstrap4Adapter(form);
      break;
    case 5:
    default:
      adapter = new Bootstrap5Adapter(form);
      break;
  }

  // Cache adapter
  adapterCache.set(form, { version: cacheKey, adapter });

  return adapter;
}

/**
 * Detect Bootstrap version from page
 * @returns {number}
 */
export function detectBootstrapVersion() {
  // Check for Bootstrap 5 specific features
  if (typeof window.bootstrap !== 'undefined') {
    // BS5 uses bootstrap.Modal etc.
    if (window.bootstrap.Modal && !window.jQuery) {
      return 5;
    }
  }

  // Check for visually-hidden class (BS5)
  const testEl = document.createElement('div');
  testEl.className = 'visually-hidden';
  document.body.appendChild(testEl);
  const hasVisuallyHidden = getComputedStyle(testEl).position === 'absolute';
  document.body.removeChild(testEl);

  if (hasVisuallyHidden) return 5;

  // Check for BS4 (uses is-invalid, also has jQuery typically)
  if (typeof window.jQuery !== 'undefined' && typeof window.jQuery.fn.tooltip !== 'undefined') {
    // Check if it's BS4 by testing for BS4-specific features
    if (typeof window.Popper !== 'undefined' || typeof window.jQuery.fn.tooltip.Constructor.VERSION !== 'undefined') {
      const version = window.jQuery.fn.tooltip.Constructor?.VERSION;
      if (version && version.startsWith('4')) return 4;
    }
    // Likely BS3 if no Popper
    return 3;
  }

  // Check for Bootstrap CSS classes
  const style = document.createElement('style');
  style.textContent = '.is-invalid { color: red; }';
  document.head.appendChild(style);

  const testInput = document.createElement('input');
  testInput.className = 'is-invalid';
  document.body.appendChild(testInput);
  const hasIsInvalid = getComputedStyle(testInput).color === 'rgb(255, 0, 0)';
  document.body.removeChild(testInput);
  document.head.removeChild(style);

  // Default to BS5 as most modern
  return 5;
}

/**
 * Clear adapter cache for form
 * @param {HTMLFormElement} form
 */
export function clearAdapterCache(form) {
  adapterCache.delete(form);
}

export { Bootstrap3Adapter, Bootstrap4Adapter, Bootstrap5Adapter };

export default {
  getAdapter,
  detectBootstrapVersion,
  clearAdapterCache,
  Bootstrap3Adapter,
  Bootstrap4Adapter,
  Bootstrap5Adapter
};
