/**
 * DOM Utility Functions
 */

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @param {Element|Document} context - Context element
 * @returns {Element|null}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @param {Element|Document} context - Context element
 * @returns {NodeList}
 */
export function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Get element by selector or return element if already an element
 * @param {string|Element} selectorOrElement
 * @param {Element|Document} context
 * @returns {Element|null}
 */
export function getElement(selectorOrElement, context = document) {
  if (typeof selectorOrElement === 'string') {
    return $(selectorOrElement, context);
  }
  return selectorOrElement instanceof Element ? selectorOrElement : null;
}

/**
 * Create element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes object
 * @param {Array|string} children - Child elements or text
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        el.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else {
      el.setAttribute(key, value);
    }
  });

  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
  }

  return el;
}

/**
 * Add class(es) to element
 * @param {Element} el
 * @param {...string} classes
 */
export function addClass(el, ...classes) {
  if (el) {
    el.classList.add(...classes.filter(Boolean));
  }
}

/**
 * Remove class(es) from element
 * @param {Element} el
 * @param {...string} classes
 */
export function removeClass(el, ...classes) {
  if (el) {
    el.classList.remove(...classes.filter(Boolean));
  }
}

/**
 * Toggle class on element
 * @param {Element} el
 * @param {string} className
 * @param {boolean} force
 */
export function toggleClass(el, className, force) {
  if (el) {
    el.classList.toggle(className, force);
  }
}

/**
 * Check if element has class
 * @param {Element} el
 * @param {string} className
 * @returns {boolean}
 */
export function hasClass(el, className) {
  return el ? el.classList.contains(className) : false;
}

/**
 * Get closest ancestor matching selector
 * @param {Element} el
 * @param {string} selector
 * @returns {Element|null}
 */
export function closest(el, selector) {
  return el ? el.closest(selector) : null;
}

/**
 * Get parent element
 * @param {Element} el
 * @returns {Element|null}
 */
export function parent(el) {
  return el ? el.parentElement : null;
}

/**
 * Find siblings matching selector
 * @param {Element} el
 * @param {string} selector
 * @returns {Element[]}
 */
export function siblings(el, selector = '*') {
  if (!el || !el.parentElement) return [];
  return Array.from(el.parentElement.children).filter(
    child => child !== el && child.matches(selector)
  );
}

/**
 * Insert element after reference element
 * @param {Element} newEl
 * @param {Element} refEl
 */
export function insertAfter(newEl, refEl) {
  if (refEl && refEl.parentNode) {
    refEl.parentNode.insertBefore(newEl, refEl.nextSibling);
  }
}

/**
 * Remove element from DOM
 * @param {Element} el
 */
export function remove(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

/**
 * Get or set element attribute
 * @param {Element} el
 * @param {string} name
 * @param {string} value
 * @returns {string|null|void}
 */
export function attr(el, name, value) {
  if (!el) return null;
  if (value === undefined) {
    return el.getAttribute(name);
  }
  el.setAttribute(name, value);
}

/**
 * Get data attribute value
 * @param {Element} el
 * @param {string} key
 * @returns {string|undefined}
 */
export function data(el, key) {
  return el ? el.dataset[key] : undefined;
}

/**
 * Get form field value
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} field
 * @returns {string|string[]|boolean|FileList|null}
 */
export function getFieldValue(field) {
  if (!field) return null;

  const type = field.type?.toLowerCase();
  const tagName = field.tagName?.toLowerCase();

  // Checkbox
  if (type === 'checkbox') {
    // Check if it's part of a group
    const name = field.name;
    if (name && field.form) {
      const checkboxes = field.form.querySelectorAll(`input[name="${name}"][type="checkbox"]`);
      if (checkboxes.length > 1) {
        return Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
      }
    }
    return field.checked;
  }

  // Radio
  if (type === 'radio') {
    const name = field.name;
    if (name && field.form) {
      const checked = field.form.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : '';
    }
    return field.checked ? field.value : '';
  }

  // File
  if (type === 'file') {
    return field.files;
  }

  // Select multiple
  if (tagName === 'select' && field.multiple) {
    return Array.from(field.selectedOptions).map(opt => opt.value);
  }

  // Default: return value
  return field.value;
}

/**
 * Check if field value is empty
 * @param {*} value
 * @returns {boolean}
 */
export function isEmptyValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'boolean') return false; // checkbox checked/unchecked
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof FileList) return value.length === 0;
  return false;
}

/**
 * Get field label text (excludes tooltip content)
 * @param {Element} field
 * @returns {string}
 */
export function getFieldLabel(field) {
  if (!field) return '';

  // Check for associated label
  const id = field.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      // Clone and remove tooltip elements to get just label text
      const clone = label.cloneNode(true);
      const tooltips = clone.querySelectorAll('.fg-label-tooltip');
      tooltips.forEach(t => t.remove());
      return clone.textContent.trim();
    }
  }

  // Check for parent label
  const parentLabel = closest(field, 'label');
  if (parentLabel) {
    // Clone and remove input and tooltip to get just label text
    const clone = parentLabel.cloneNode(true);
    const inputs = clone.querySelectorAll('input, select, textarea');
    inputs.forEach(inp => inp.remove());
    const tooltips = clone.querySelectorAll('.fg-label-tooltip');
    tooltips.forEach(t => t.remove());
    return clone.textContent.trim();
  }

  // Fallback to name or placeholder
  return field.getAttribute('placeholder') ||
         field.getAttribute('name') ||
         field.id ||
         'Field';
}

/**
 * Scroll element into view smoothly
 * @param {Element} el
 * @param {Object} options
 */
export function scrollIntoView(el, options = {}) {
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      ...options
    });
  }
}

/**
 * Focus element
 * @param {Element} el
 */
export function focus(el) {
  if (el && typeof el.focus === 'function') {
    el.focus();
  }
}

/**
 * Generate unique ID
 * @param {string} prefix
 * @returns {string}
 */
export function uniqueId(prefix = 'fg') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
