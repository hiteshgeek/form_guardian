/**
 * FormGuardian Input Mask Utility
 * Prevents invalid input in real-time based on validation rules
 */

/**
 * Input mask handlers for different rule types
 */
const maskHandlers = {
  /**
   * Prevent input beyond max length
   */
  maxLength: (field, params) => {
    const max = typeof params === 'number' ? params : (params.max || params.value);
    if (!max) return null;

    return (e) => {
      const value = field.value;
      // Allow control keys (Backspace, Delete, Arrow keys, etc.)
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;

      // Check if adding character would exceed max
      const selectionLength = field.selectionEnd - field.selectionStart;
      const newLength = value.length - selectionLength + 1;

      if (newLength > max) {
        e.preventDefault();
      }
    };
  },

  /**
   * Prevent input beyond exact length
   */
  exactLength: (field, params) => {
    const length = typeof params === 'number' ? params : (params.length || params.value);
    return maskHandlers.maxLength(field, length);
  },

  /**
   * Prevent input beyond range length max
   */
  rangeLength: (field, params) => {
    if (params.max) {
      return maskHandlers.maxLength(field, params.max);
    }
    return null;
  },

  /**
   * Allow only letters (a-zA-Z)
   */
  alpha: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
      }
    };
  },

  /**
   * Allow only letters and numbers
   */
  alphaNumeric: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[a-zA-Z0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    };
  },

  /**
   * Allow letters and spaces
   */
  alphaSpace: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[a-zA-Z\s]$/.test(e.key)) {
        e.preventDefault();
      }
    };
  },

  /**
   * Allow letters, numbers, dashes, underscores
   */
  alphaDash: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[a-zA-Z0-9_-]$/.test(e.key)) {
        e.preventDefault();
      }
    };
  },

  /**
   * Prevent whitespace
   */
  noWhitespace: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (/\s/.test(e.key)) {
        e.preventDefault();
      }
    };
  },

  /**
   * Force lowercase
   */
  lowercase: (field) => {
    // Use input event instead for transformation
    return null;
  },

  /**
   * Force uppercase
   */
  uppercase: (field) => {
    // Use input event instead for transformation
    return null;
  },

  /**
   * Allow only numbers
   */
  numeric: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      // Allow digits, minus, decimal point
      if (!/^[0-9.\-]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      // Only one minus at start
      if (e.key === '-' && (field.selectionStart !== 0 || field.value.includes('-'))) {
        e.preventDefault();
        return;
      }
      // Only one decimal point
      if (e.key === '.' && field.value.includes('.')) {
        e.preventDefault();
      }
    };
  },

  /**
   * Allow only integers
   */
  integer: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      // Allow digits and minus
      if (!/^[0-9\-]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      // Only one minus at start
      if (e.key === '-' && (field.selectionStart !== 0 || field.value.includes('-'))) {
        e.preventDefault();
      }
    };
  },

  /**
   * Allow only positive numbers
   */
  positive: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      // Allow digits and decimal point only
      if (!/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      // Only one decimal point
      if (e.key === '.' && field.value.includes('.')) {
        e.preventDefault();
      }
    };
  },

  /**
   * Limit decimal places
   */
  decimal: (field, params) => {
    const places = typeof params === 'number' ? params : params.places;
    if (!places) return null;

    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;

      // Allow digits, minus, decimal
      if (!/^[0-9.\-]$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      const value = field.value;
      const cursorPos = field.selectionStart;

      // Check decimal places if there's a decimal point
      const decimalIndex = value.indexOf('.');
      if (decimalIndex !== -1 && cursorPos > decimalIndex) {
        const decimals = value.substring(decimalIndex + 1);
        if (decimals.length >= places && e.key !== '.' && field.selectionStart === field.selectionEnd) {
          e.preventDefault();
        }
      }

      // Only one decimal point
      if (e.key === '.' && value.includes('.')) {
        e.preventDefault();
      }

      // Only one minus at start
      if (e.key === '-' && (cursorPos !== 0 || value.includes('-'))) {
        e.preventDefault();
      }
    };
  },

  /**
   * Percentage (0-100)
   */
  percentage: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;

      if (!/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      // Only one decimal point
      if (e.key === '.' && field.value.includes('.')) {
        e.preventDefault();
        return;
      }

      // Simulate what the value would be
      const start = field.selectionStart;
      const end = field.selectionEnd;
      const currentValue = field.value;
      const newValue = currentValue.substring(0, start) + e.key + currentValue.substring(end);
      const numValue = parseFloat(newValue);

      if (!isNaN(numValue) && numValue > 100) {
        e.preventDefault();
      }
    };
  },

  /**
   * URL slug format
   */
  slug: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[a-z0-9\-]$/.test(e.key)) {
        e.preventDefault();
      }
    };
  },

  /**
   * Hex color
   */
  hexColor: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[a-fA-F0-9#]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      // Only one # at start
      if (e.key === '#' && (field.selectionStart !== 0 || field.value.includes('#'))) {
        e.preventDefault();
        return;
      }
      // Max 7 chars (#FFFFFF)
      if (field.value.length >= 7 && field.selectionStart === field.selectionEnd) {
        e.preventDefault();
      }
    };
  },

  /**
   * Phone number - allow digits, spaces, dashes, parentheses, plus
   */
  phone: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[0-9\s\-\(\)\+]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      // Only one + at start
      if (e.key === '+' && (field.selectionStart !== 0 || field.value.includes('+'))) {
        e.preventDefault();
      }
    };
  },

  /**
   * Credit card - digits and spaces only
   */
  creditCard: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      if (!/^[0-9\s]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      // Max 19 chars (16 digits + 3 spaces)
      const digitsOnly = field.value.replace(/\s/g, '');
      if (digitsOnly.length >= 16 && /[0-9]/.test(e.key) && field.selectionStart === field.selectionEnd) {
        e.preventDefault();
      }
    };
  },

  /**
   * IP address
   */
  ipAddress: (field) => {
    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
      // IPv4: digits and dots, IPv6: hex and colons
      if (!/^[0-9a-fA-F.:]$/.test(e.key)) {
        e.preventDefault();
      }
    };
  },

  /**
   * Postal code
   */
  postalCode: (field, params) => {
    const country = params?.country || 'any';

    return (e) => {
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;

      switch (country) {
        case 'us':
          // US: digits only, max 5 or 9 (with dash)
          if (!/^[0-9\-]$/.test(e.key)) {
            e.preventDefault();
          }
          break;
        case 'ca':
          // Canada: alphanumeric and space
          if (!/^[a-zA-Z0-9\s]$/.test(e.key)) {
            e.preventDefault();
          }
          break;
        case 'uk':
          // UK: alphanumeric and space
          if (!/^[a-zA-Z0-9\s]$/.test(e.key)) {
            e.preventDefault();
          }
          break;
        default:
          // Allow alphanumeric, space, dash
          if (!/^[a-zA-Z0-9\s\-]$/.test(e.key)) {
            e.preventDefault();
          }
      }
    };
  },

  /**
   * Word count - prevent entering more than max words
   */
  wordCount: (field, params) => {
    const max = params.max || params.value;
    if (!max) return null;

    return (e) => {
      // Allow control keys
      if (e.ctrlKey || e.metaKey || e.key.length > 1) return;

      // Only check when adding whitespace (which would start a new word)
      if (!/\s/.test(e.key)) return;

      const value = field.value;
      const selectionStart = field.selectionStart;
      const selectionEnd = field.selectionEnd;

      // Get current word count
      const words = value.trim().split(/\s+/).filter(w => w.length > 0);
      const currentWordCount = words.length;

      // Check if we're at the end or middle of text
      const textBeforeCursor = value.substring(0, selectionStart);
      const textAfterCursor = value.substring(selectionEnd);

      // If cursor is after non-whitespace and before non-whitespace or end,
      // adding space would create a new word boundary
      const charBeforeCursor = textBeforeCursor.slice(-1);
      const charAfterCursor = textAfterCursor.charAt(0);

      // If the character before cursor is not whitespace,
      // and we already have max words, prevent adding more spaces
      if (charBeforeCursor && !/\s/.test(charBeforeCursor)) {
        // Check if this space would allow starting a new word
        if (currentWordCount >= max) {
          // Check if there's more text after that could form additional words
          const wordsAfter = textAfterCursor.trim().split(/\s+/).filter(w => w.length > 0);
          if (wordsAfter.length === 0 || (charAfterCursor && !/\s/.test(charAfterCursor))) {
            e.preventDefault();
          }
        }
      }
    };
  }
};

/**
 * Input transformation handlers (for input event)
 */
const transformHandlers = {
  /**
   * Transform to lowercase
   */
  lowercase: (field) => {
    return () => {
      const start = field.selectionStart;
      const end = field.selectionEnd;
      field.value = field.value.toLowerCase();
      field.setSelectionRange(start, end);
    };
  },

  /**
   * Transform to uppercase
   */
  uppercase: (field) => {
    return () => {
      const start = field.selectionStart;
      const end = field.selectionEnd;
      field.value = field.value.toUpperCase();
      field.setSelectionRange(start, end);
    };
  },

  /**
   * Auto-format credit card (add spaces every 4 digits)
   */
  creditCard: (field) => {
    return () => {
      const start = field.selectionStart;
      const digitsOnly = field.value.replace(/\s/g, '');
      const formatted = digitsOnly.replace(/(.{4})/g, '$1 ').trim();

      if (formatted !== field.value) {
        const diff = formatted.length - field.value.length;
        field.value = formatted;
        field.setSelectionRange(start + diff, start + diff);
      }
    };
  },

  /**
   * Trim whitespace on blur
   */
  trimmed: (field) => {
    return () => {
      field.value = field.value.trim();
    };
  }
};

/**
 * Apply input masks to a field based on rules
 * @param {HTMLElement} field - The input field
 * @param {Object} rules - Validation rules for the field
 * @returns {Function} Cleanup function to remove listeners
 */
export function applyInputMask(field, rules) {
  const cleanupFunctions = [];

  // Process each rule
  for (const [ruleName, ruleParams] of Object.entries(rules)) {
    // Skip disabled rules
    if (ruleParams === false) continue;

    // Apply keydown mask handler
    if (maskHandlers[ruleName]) {
      const handler = maskHandlers[ruleName](field, ruleParams);
      if (handler) {
        field.addEventListener('keydown', handler);
        cleanupFunctions.push(() => field.removeEventListener('keydown', handler));
      }
    }

    // Apply input transform handler
    if (transformHandlers[ruleName]) {
      const handler = transformHandlers[ruleName](field, ruleParams);
      if (handler) {
        // For trimmed, apply on blur
        if (ruleName === 'trimmed') {
          field.addEventListener('blur', handler);
          cleanupFunctions.push(() => field.removeEventListener('blur', handler));
        } else {
          field.addEventListener('input', handler);
          cleanupFunctions.push(() => field.removeEventListener('input', handler));
        }
      }
    }
  }

  // Handle paste event - validate pasted content
  const pasteHandler = (e) => {
    const pastedText = e.clipboardData?.getData('text') || '';
    if (!pastedText) return;

    // Get what the value would be after paste
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const currentValue = field.value;
    const newValue = currentValue.substring(0, start) + pastedText + currentValue.substring(end);

    // Check against rules
    let shouldPrevent = false;
    let filteredText = pastedText;

    for (const [ruleName, ruleParams] of Object.entries(rules)) {
      if (ruleParams === false) continue;

      switch (ruleName) {
        case 'maxLength': {
          const max = typeof ruleParams === 'number' ? ruleParams : (ruleParams.max || ruleParams.value);
          if (max && newValue.length > max) {
            // Truncate pasted text to fit
            const available = max - currentValue.length + (end - start);
            filteredText = pastedText.substring(0, Math.max(0, available));
          }
          break;
        }
        case 'alpha':
          filteredText = filteredText.replace(/[^a-zA-Z]/g, '');
          break;
        case 'alphaNumeric':
          filteredText = filteredText.replace(/[^a-zA-Z0-9]/g, '');
          break;
        case 'alphaSpace':
          filteredText = filteredText.replace(/[^a-zA-Z\s]/g, '');
          break;
        case 'alphaDash':
          filteredText = filteredText.replace(/[^a-zA-Z0-9_-]/g, '');
          break;
        case 'noWhitespace':
          filteredText = filteredText.replace(/\s/g, '');
          break;
        case 'numeric':
        case 'integer':
        case 'positive':
          filteredText = filteredText.replace(/[^0-9.\-]/g, '');
          break;
        case 'slug':
          filteredText = filteredText.toLowerCase().replace(/[^a-z0-9\-]/g, '');
          break;
        case 'lowercase':
          filteredText = filteredText.toLowerCase();
          break;
        case 'uppercase':
          filteredText = filteredText.toUpperCase();
          break;
        case 'wordCount': {
          const maxWords = ruleParams.max || ruleParams.value;
          if (maxWords) {
            // Count existing words in current value
            const existingWords = currentValue.trim().split(/\s+/).filter(w => w.length > 0);
            const existingCount = existingWords.length;

            // Count words in pasted text
            const pastedWords = filteredText.trim().split(/\s+/).filter(w => w.length > 0);

            // Calculate how many words we can accept
            const availableSlots = Math.max(0, maxWords - existingCount);

            if (pastedWords.length > availableSlots) {
              // Truncate to allowed number of words
              filteredText = pastedWords.slice(0, availableSlots).join(' ');
            }
          }
          break;
        }
      }
    }

    // If text was modified, prevent default and insert filtered text
    if (filteredText !== pastedText || filteredText.length < pastedText.length) {
      e.preventDefault();
      if (filteredText) {
        document.execCommand('insertText', false, filteredText);
      }
    }
  };

  field.addEventListener('paste', pasteHandler);
  cleanupFunctions.push(() => field.removeEventListener('paste', pasteHandler));

  // Return cleanup function
  return () => {
    cleanupFunctions.forEach(fn => fn());
  };
}

/**
 * Check if a rule supports input masking
 * @param {string} ruleName - The rule name
 * @returns {boolean}
 */
export function supportsMasking(ruleName) {
  return ruleName in maskHandlers || ruleName in transformHandlers;
}

export default {
  applyInputMask,
  supportsMasking,
  maskHandlers,
  transformHandlers
};
