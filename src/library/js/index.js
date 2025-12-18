/**
 * FormGuardian - Form Validation Library
 * A vanilla JavaScript form validation library supporting Bootstrap 3, 4, and 5
 *
 * @version 1.0.0
 * @license MIT
 */

// Core
export { FormGuardian } from './core/FormGuardian.js';
export { Validator } from './core/Validator.js';
export { FieldManager } from './core/FieldManager.js';

// Components
export { ErrorContainer } from './components/ErrorContainer.js';

// Adapters
export {
  getAdapter,
  detectBootstrapVersion,
  Bootstrap3Adapter,
  Bootstrap4Adapter,
  Bootstrap5Adapter
} from './adapters/index.js';

// Rules
export {
  getAllRules,
  getRule,
  hasRule,
  registerRule,
  unregisterRule,
  getRuleMetadata,
  getRuleParams,
  ruleCategories
} from './rules/index.js';

export { registerCallback, unregisterCallback } from './rules/custom.js';
export { clearAsyncCache } from './rules/async.js';

// Utilities
export { debounce, throttle } from './utils/debounce.js';
export { default as storage } from './utils/storage.js';
export { applyInputMask, supportsMasking } from './utils/inputMask.js';

// Import FormGuardian as the default export
import { FormGuardian } from './core/FormGuardian.js';

// Auto-init on DOM ready if data-formguardian-auto-init is present
if (typeof document !== 'undefined') {
  const autoInit = () => {
    if (document.querySelector('[data-formguardian-auto-init]')) {
      FormGuardian.autoInit();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
}

// Expose globally for IIFE usage
if (typeof window !== 'undefined') {
  window.FormGuardian = FormGuardian;
}
