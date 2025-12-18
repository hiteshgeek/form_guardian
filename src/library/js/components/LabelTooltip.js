/**
 * LabelTooltip - Shows validation rules on field labels
 * A component that displays applied validation rules as tooltips on form field labels
 */

import { getFieldLabel } from '../utils/dom.js';

/**
 * Human-readable rule names mapping
 */
const RULE_LABELS = {
  required: 'Required',
  minLength: 'Min Length',
  maxLength: 'Max Length',
  exactLength: 'Exact Length',
  rangeLength: 'Length Range',
  alpha: 'Letters Only',
  alphaNumeric: 'Letters & Numbers',
  alphaSpace: 'Letters & Spaces',
  alphaDash: 'Letters, Numbers, Dashes',
  noWhitespace: 'No Whitespace',
  trimmed: 'No Leading/Trailing Spaces',
  lowercase: 'Lowercase',
  uppercase: 'Uppercase',
  contains: 'Must Contain',
  notContains: 'Must Not Contain',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  wordCount: 'Word Count',
  email: 'Valid Email',
  url: 'Valid URL',
  phone: 'Valid Phone',
  postalCode: 'Postal Code',
  ipAddress: 'IP Address',
  hexColor: 'Hex Color',
  slug: 'URL Slug',
  username: 'Username Format',
  creditCard: 'Credit Card',
  iban: 'IBAN',
  uuid: 'UUID',
  password: 'Password Strength',
  regex: 'Pattern Match',
  json: 'Valid JSON',
  base64: 'Base64',
  numeric: 'Numbers Only',
  integer: 'Integer',
  float: 'Decimal Number',
  positive: 'Positive Number',
  negative: 'Negative Number',
  min: 'Minimum Value',
  max: 'Maximum Value',
  range: 'Value Range',
  divisibleBy: 'Divisible By',
  even: 'Even Number',
  odd: 'Odd Number',
  decimal: 'Decimal Places',
  percentage: 'Percentage',
  currency: 'Currency',
  date: 'Valid Date',
  time: 'Valid Time',
  datetime: 'Date & Time',
  dateFormat: 'Date Format',
  dateAfter: 'After Date',
  dateBefore: 'Before Date',
  dateBetween: 'Date Range',
  age: 'Minimum Age',
  futureDate: 'Future Date',
  pastDate: 'Past Date',
  weekday: 'Weekday Only',
  weekend: 'Weekend Only',
  fileRequired: 'File Required',
  fileSize: 'Max File Size',
  fileMinSize: 'Min File Size',
  fileType: 'File Type',
  fileExtension: 'File Extension',
  imageOnly: 'Images Only',
  imageDimensions: 'Image Size',
  maxFiles: 'Max Files',
  minFiles: 'Min Files',
  equals: 'Must Equal',
  notEquals: 'Must Not Equal',
  confirmedBy: 'Confirmed By',
  lessThan: 'Less Than',
  greaterThan: 'Greater Than',
  lessThanOrEqual: 'At Most',
  greaterThanOrEqual: 'At Least',
  requiredIf: 'Required If',
  requiredUnless: 'Required Unless',
  requiredWith: 'Required With',
  requiredWithout: 'Required Without',
  inList: 'In List',
  notInList: 'Not In List',
  minSelected: 'Min Selections',
  maxSelected: 'Max Selections',
  exactSelected: 'Exact Selections',
  remote: 'Remote Validation',
  unique: 'Must Be Unique',
  exists: 'Must Exist',
  custom: 'Custom Rule',
  callback: 'Callback'
};

export class LabelTooltip {
  /**
   * Constructor
   * @param {FormGuardian} guardian - Parent FormGuardian instance
   * @param {Object} options - Configuration options
   */
  constructor(guardian, options = {}) {
    this.guardian = guardian;
    this.form = guardian.form;
    this.options = {
      tooltipTitle: options.tooltipTitle || 'Validation Rules',
      formGroupSelector: options.formGroupSelector || '.form-group, .mb-3, .mb-4',
      ...options
    };

    // Track created tooltips for cleanup
    this.tooltips = new Map(); // fieldId -> tooltip element
  }

  /**
   * Update all label tooltips based on current field rules
   */
  update() {
    const fields = this.guardian.fieldManager.getAllFields();

    // Update or create tooltips for fields with rules
    fields.forEach((config, fieldId) => {
      const field = config.element;
      const rules = config.rules;
      const ruleCount = Object.keys(rules).length;

      if (ruleCount > 0) {
        this._updateTooltip(fieldId, field, rules);
      } else {
        this._removeTooltip(fieldId);
      }
    });

    // Clean up tooltips for removed fields
    this.tooltips.forEach((tooltip, fieldId) => {
      if (!fields.has(fieldId)) {
        this._removeTooltip(fieldId);
      }
    });
  }

  /**
   * Update or create tooltip for a field
   * @private
   * @param {string} fieldId
   * @param {Element} field
   * @param {Object} rules
   */
  _updateTooltip(fieldId, field, rules) {
    // Find the label for this field
    const label = this._getFieldLabel(field);
    if (!label) return;

    // Get or create tooltip element
    let tooltip = this.tooltips.get(fieldId);

    if (!tooltip) {
      tooltip = this._createTooltipElement();
      this.tooltips.set(fieldId, tooltip);
    }

    // Update tooltip content
    this._updateTooltipContent(tooltip, rules);

    // Append to label if not already there
    if (!label.contains(tooltip)) {
      label.appendChild(tooltip);
    }
  }

  /**
   * Remove tooltip for a field
   * @private
   * @param {string} fieldId
   */
  _removeTooltip(fieldId) {
    const tooltip = this.tooltips.get(fieldId);
    if (tooltip) {
      tooltip.remove();
      this.tooltips.delete(fieldId);
    }
  }

  /**
   * Get label element for a field
   * @private
   * @param {Element} field
   * @returns {Element|null}
   */
  _getFieldLabel(field) {
    // Try label[for]
    if (field.id) {
      const label = this.form.querySelector(`label[for="${field.id}"]`);
      if (label) return label;
    }

    // Try form group label
    const formGroup = field.closest(this.options.formGroupSelector);
    if (formGroup) {
      const label = formGroup.querySelector('label');
      if (label) return label;
    }

    return null;
  }

  /**
   * Create tooltip element structure
   * @private
   * @returns {Element}
   */
  _createTooltipElement() {
    const tooltip = document.createElement('span');
    tooltip.className = 'fg-label-tooltip';
    tooltip.setAttribute('tabindex', '0');

    // Badge
    const badge = document.createElement('span');
    badge.className = 'fg-label-tooltip-badge';
    badge.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <span class="fg-label-tooltip-count">0</span>
    `;

    // Content panel
    const content = document.createElement('span');
    content.className = 'fg-label-tooltip-content';

    const title = document.createElement('span');
    title.className = 'fg-label-tooltip-title';
    title.textContent = this.options.tooltipTitle;
    content.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'fg-label-tooltip-list';
    content.appendChild(list);

    tooltip.appendChild(badge);
    tooltip.appendChild(content);

    return tooltip;
  }

  /**
   * Update tooltip content with rules
   * @private
   * @param {Element} tooltip
   * @param {Object} rules
   */
  _updateTooltipContent(tooltip, rules) {
    const ruleNames = Object.keys(rules);
    const count = ruleNames.length;

    // Update count badge
    const countEl = tooltip.querySelector('.fg-label-tooltip-count');
    if (countEl) {
      countEl.textContent = count;
    }

    // Update rule list
    const list = tooltip.querySelector('.fg-label-tooltip-list');
    if (list) {
      list.innerHTML = '';

      ruleNames.forEach(ruleName => {
        const params = rules[ruleName];
        const item = document.createElement('li');

        const label = this._formatRuleName(ruleName);
        const paramStr = this._formatRuleParams(ruleName, params);

        if (paramStr) {
          item.innerHTML = `<strong>${label}</strong>: ${paramStr}`;
        } else {
          item.innerHTML = `<strong>${label}</strong>`;
        }

        list.appendChild(item);
      });
    }
  }

  /**
   * Format rule name to human-readable text
   * @private
   * @param {string} ruleName
   * @returns {string}
   */
  _formatRuleName(ruleName) {
    return RULE_LABELS[ruleName] || ruleName.replace(/([A-Z])/g, ' $1').trim();
  }

  /**
   * Format rule parameters to human-readable text
   * @private
   * @param {string} ruleName
   * @param {Object} params
   * @returns {string}
   */
  _formatRuleParams(ruleName, params) {
    if (!params || typeof params !== 'object') {
      return '';
    }

    // Filter out empty params
    const nonEmpty = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        nonEmpty[key] = value;
      }
    });

    const keys = Object.keys(nonEmpty);
    if (keys.length === 0) return '';

    // Single value
    if (keys.length === 1) {
      const key = keys[0];
      const value = nonEmpty[key];

      if (key === 'value' || key === 'min' || key === 'max' || key === 'length' || key === 'minAge') {
        return String(value);
      }
      if (key === 'maxSize' || key === 'minSize') {
        return this._formatFileSize(value);
      }
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      return String(value);
    }

    // Range
    if (keys.includes('min') && keys.includes('max')) {
      return `${nonEmpty.min} - ${nonEmpty.max}`;
    }

    // Multiple params
    return keys.map(key => {
      const value = nonEmpty[key];
      const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      return `${formattedKey}: ${value}`;
    }).join(', ');
  }

  /**
   * Format file size to human-readable
   * @private
   * @param {number} bytes
   * @returns {string}
   */
  _formatFileSize(bytes) {
    if (typeof bytes !== 'number') return String(bytes);
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Remove all tooltips and cleanup
   */
  destroy() {
    this.tooltips.forEach(tooltip => {
      tooltip.remove();
    });
    this.tooltips.clear();
    this.guardian = null;
    this.form = null;
  }
}

export default LabelTooltip;
