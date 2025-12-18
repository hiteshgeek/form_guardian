/**
 * FormGuardian Demo Application
 * Main demo controller that manages form, validation rules, and UI interactions
 */

export class DemoApp {
  /**
   * Create demo application
   * @param {Object} options
   */
  constructor(options = {}) {
    this.formSelector = options.formSelector || '#demo-form';
    this.bootstrapVersion = options.bootstrapVersion || 5;
    this.sidebar = options.sidebar;
    this.fieldSelector = options.fieldSelector;
    this.appliedRulesList = options.appliedRulesList;
    this.ruleAccordion = options.ruleAccordion;
    this.clearRulesButton = options.clearRulesButton;

    this.form = document.querySelector(this.formSelector);
    this.formGuardian = null;
    this.currentField = null;
    this.fieldRules = new Map(); // Store rules per field
    this.storageKey = 'fg-demo-rules'; // localStorage key for persisting rules

    // Preview panel elements
    this.previewPanel = document.getElementById('preview-panel');
    this.previewTabs = this.previewPanel?.querySelectorAll('.fg-preview-tab');
    this.previewPanes = this.previewPanel?.querySelectorAll('.fg-preview-pane');
    this.previewFieldWrapper = document.getElementById('preview-field-wrapper');
    this.previewJsConfig = document.getElementById('preview-js-config');
    this.previewHtmlDom = document.getElementById('preview-html-dom');

    this.init();
  }

  /**
   * Initialize the demo application
   */
  init() {
    this.initFormGuardian();
    this.populateFieldSelector();
    this.initFieldIndicators();
    this.bindEvents();
    this.initAccordion();
    this.initPreviewTabs();
    this.updateFieldParamSelectors();
  }

  /**
   * Initialize field selection indicators on form elements
   */
  initFieldIndicators() {
    if (!this.form) return;

    const fields = this.form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      // Skip hidden fields and buttons
      if (field.type === 'hidden' || field.type === 'submit' || field.type === 'reset' || field.type === 'button') {
        return;
      }

      const id = field.id || field.name;
      if (!id) return;

      // Find the form group wrapper
      const formGroup = field.closest('.form-group, .mb-3, .mb-4');
      if (!formGroup) return;

      // Skip if indicator already exists
      if (formGroup.querySelector('.fg-field-indicator')) return;

      // Make form group position relative for indicator positioning
      formGroup.style.position = 'relative';

      // Create indicator element
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.className = 'fg-field-indicator';
      indicator.dataset.fieldId = id;
      indicator.title = 'Click to configure validation';
      indicator.setAttribute('aria-label', `Configure validation for ${this.getFieldLabel(field)}`);
      indicator.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      `;

      // Add click handler
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectFieldById(id);
      });

      formGroup.appendChild(indicator);
    });
  }

  /**
   * Update field indicators to show selection and rules state
   */
  updateFieldIndicators() {
    if (!this.form) return;

    const indicators = this.form.querySelectorAll('.fg-field-indicator');

    indicators.forEach(indicator => {
      const fieldId = indicator.dataset.fieldId;
      const isSelected = this.currentField && (this.currentField.id === fieldId || this.currentField.name === fieldId);
      const hasRules = this.fieldRules.has(fieldId) && this.fieldRules.get(fieldId).length > 0;

      // Update classes
      indicator.classList.toggle('fg-indicator-selected', isSelected);
      indicator.classList.toggle('fg-indicator-has-rules', hasRules);

      // Update icon based on state
      if (hasRules) {
        indicator.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        `;
      } else {
        indicator.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        `;
      }
    });
  }

  /**
   * Select field by ID
   * @param {string} fieldId
   */
  selectFieldById(fieldId) {
    // Update dropdown to match
    if (this.fieldSelector) {
      this.fieldSelector.value = fieldId;
    }
    this.selectField(fieldId);
  }

  /**
   * Initialize FormGuardian instance
   */
  initFormGuardian() {
    // Wait for FormGuardian to be available (from the library bundle)
    if (typeof FormGuardian !== 'undefined') {
      this.createFormGuardian();
    } else {
      // Wait for global - library is loaded separately
      const checkInterval = setInterval(() => {
        if (typeof FormGuardian !== 'undefined') {
          clearInterval(checkInterval);
          this.createFormGuardian();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!this.formGuardian) {
          console.error('FormGuardian library not loaded');
        }
      }, 10000);
    }
  }

  /**
   * Create FormGuardian instance
   */
  createFormGuardian() {
    this.formGuardian = new FormGuardian(this.formSelector, {
      bootstrapVersion: this.bootstrapVersion,
      validateOn: ['blur', 'change'],
      liveValidation: true,
      debounceMs: 300,
      showErrorContainer: true,
      errorContainerPosition: 'right-bottom',
      scrollToError: true,
      focusOnError: true
    });

    // Store reference globally for debugging
    window.fg = this.formGuardian;

    // Load saved rules from localStorage
    this.loadRulesFromStorage();
  }

  /**
   * Populate field selector dropdown
   */
  populateFieldSelector() {
    if (!this.fieldSelector || !this.form) return;

    const fields = this.form.querySelectorAll('input, select, textarea');
    const groups = {};

    fields.forEach(field => {
      // Skip hidden fields and buttons
      if (field.type === 'hidden' || field.type === 'submit' || field.type === 'reset' || field.type === 'button') {
        return;
      }

      // Get field label
      const label = this.getFieldLabel(field);
      const id = field.id || field.name;

      if (!id) return;

      // Group by fieldset
      const fieldset = field.closest('fieldset');
      const groupName = fieldset?.querySelector('legend')?.textContent || 'Other';

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push({ id, label, type: field.type });
    });

    // Clear existing options
    this.fieldSelector.innerHTML = '<option value="">-- Choose a field --</option>';

    // Add grouped options
    Object.entries(groups).forEach(([groupName, fields]) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = groupName;

      fields.forEach(field => {
        const option = document.createElement('option');
        option.value = field.id;
        option.textContent = `${field.label} (${field.type})`;
        optgroup.appendChild(option);
      });

      this.fieldSelector.appendChild(optgroup);
    });
  }

  /**
   * Get label for a field
   * @param {Element} field
   * @returns {string}
   */
  getFieldLabel(field) {
    // Try label[for]
    if (field.id) {
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (label) {
        return label.textContent.trim();
      }
    }

    // Try parent label
    const parentLabel = field.closest('label');
    if (parentLabel) {
      return parentLabel.textContent.trim();
    }

    // Try previous sibling label
    const prevLabel = field.previousElementSibling;
    if (prevLabel?.tagName === 'LABEL') {
      return prevLabel.textContent.trim();
    }

    // Try form group label
    const formGroup = field.closest('.form-group, .mb-3, .mb-4');
    if (formGroup) {
      const groupLabel = formGroup.querySelector('label');
      if (groupLabel) {
        return groupLabel.textContent.trim();
      }
    }

    // Fallback to name or id
    return field.name || field.id || 'Unnamed Field';
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Field selector change
    this.fieldSelector?.addEventListener('change', (e) => {
      this.selectField(e.target.value);
    });

    // Clear rules button
    this.clearRulesButton?.addEventListener('click', () => {
      this.clearAllRules();
    });

    // Rule add buttons
    this.ruleAccordion?.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.fg-rule-add-btn');
      if (addBtn) {
        const ruleCard = addBtn.closest('.fg-rule-card');
        if (ruleCard) {
          this.addRuleFromCard(ruleCard);
        }
      }
    });

    // Applied rules remove buttons
    this.appliedRulesList?.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.fg-applied-rule-remove');
      if (removeBtn) {
        const ruleItem = removeBtn.closest('.fg-applied-rule');
        if (ruleItem) {
          this.removeAppliedRule(ruleItem.dataset.rule);
        }
      }
    });

    // Form submit
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateForm();
    });

    // Form reset
    this.form?.addEventListener('reset', () => {
      setTimeout(() => {
        if (this.formGuardian) {
          this.formGuardian.clearErrors();
        }
      }, 0);
    });
  }

  /**
   * Initialize accordion behavior
   */
  initAccordion() {
    const headers = this.ruleAccordion?.querySelectorAll('.fg-accordion-header');

    headers?.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.fg-accordion-item');
        const isOpen = item.classList.contains('fg-accordion-open');

        // Close all items
        this.ruleAccordion.querySelectorAll('.fg-accordion-item').forEach(i => {
          i.classList.remove('fg-accordion-open');
          i.querySelector('.fg-accordion-header').setAttribute('aria-expanded', 'false');
        });

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('fg-accordion-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /**
   * Initialize preview tabs
   */
  initPreviewTabs() {
    this.previewTabs?.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchPreviewTab(tabName);
      });
    });

    // Initialize copy buttons
    this.initCopyButtons();
  }

  /**
   * Initialize copy buttons
   */
  initCopyButtons() {
    const copyButtons = this.previewPanel?.querySelectorAll('.fg-copy-btn');

    copyButtons?.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.copyTarget;
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          this.copyToClipboard(targetElement.textContent, btn);
        }
      });
    });
  }

  /**
   * Copy text to clipboard
   * @param {string} text
   * @param {Element} button
   */
  copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback
      button.classList.add('fg-copy-success');

      // Store original icon
      const originalIcon = button.innerHTML;

      // Show checkmark icon
      button.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;

      // Reset after delay
      setTimeout(() => {
        button.classList.remove('fg-copy-success');
        button.innerHTML = originalIcon;
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy:', err);
      this.showNotification('Failed to copy to clipboard', 'error');
    });
  }

  /**
   * Switch preview tab
   * @param {string} tabName
   */
  switchPreviewTab(tabName) {
    // Update tab buttons
    this.previewTabs?.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update panes
    this.previewPanes?.forEach(pane => {
      const paneTab = pane.id.replace('preview-pane-', '');
      pane.classList.toggle('active', paneTab === tabName);
    });
  }

  /**
   * Update preview panel content
   */
  updatePreviewPanel() {
    if (!this.currentField) {
      // No field selected
      if (this.previewFieldWrapper) {
        this.previewFieldWrapper.innerHTML = '<p class="fg-no-field">Select a field to preview</p>';
      }
      if (this.previewJsConfig) {
        this.previewJsConfig.textContent = '// Select a field to see JS configuration';
      }
      if (this.previewHtmlDom) {
        this.previewHtmlDom.textContent = '<!-- Select a field to see HTML -->';
      }
      return;
    }

    // Update Preview tab - clone the field
    this.updatePreviewFieldClone();

    // Update JS Config tab
    this.updatePreviewJsConfig();

    // Update HTML DOM tab
    this.updatePreviewHtmlDom();
  }

  /**
   * Update preview field clone
   */
  updatePreviewFieldClone() {
    if (!this.previewFieldWrapper || !this.currentField) return;

    // Get the form group wrapper for the field
    const formGroup = this.currentField.closest('.form-group, .mb-3, .mb-4');

    if (formGroup) {
      // Clone the form group
      const clone = formGroup.cloneNode(true);
      clone.classList.add('fg-preview-clone');

      // Remove any validation states from the clone
      clone.querySelectorAll('.is-valid, .is-invalid, .has-error, .has-success').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid', 'has-error', 'has-success');
      });

      // Remove feedback elements
      clone.querySelectorAll('.invalid-feedback, .valid-feedback, .help-block').forEach(el => {
        el.remove();
      });

      // Make inputs readonly in preview
      clone.querySelectorAll('input, select, textarea').forEach(el => {
        el.setAttribute('readonly', 'readonly');
        el.setAttribute('tabindex', '-1');
      });

      this.previewFieldWrapper.innerHTML = '';
      this.previewFieldWrapper.appendChild(clone);
    } else {
      // Just clone the field itself
      const clone = this.currentField.cloneNode(true);
      clone.classList.add('fg-preview-clone');
      clone.setAttribute('readonly', 'readonly');
      clone.setAttribute('tabindex', '-1');

      this.previewFieldWrapper.innerHTML = '';
      this.previewFieldWrapper.appendChild(clone);
    }
  }

  /**
   * Update JS config preview
   */
  updatePreviewJsConfig() {
    if (!this.previewJsConfig || !this.currentField) return;

    const fieldId = this.currentField.id || this.currentField.name;
    const rules = this.fieldRules.get(fieldId) || [];

    let jsCode;
    if (rules.length === 0) {
      jsCode = `// No rules applied to #${fieldId}\n\nformGuardian.addField('#${fieldId}', {\n  // Add rules here\n});`;
    } else {
      // Build rules config object
      const rulesConfig = {};
      rules.forEach(rule => {
        if (rule.params && Object.keys(rule.params).length > 0) {
          const paramKeys = Object.keys(rule.params);
          const nonEmptyParams = {};
          paramKeys.forEach(key => {
            if (rule.params[key] !== '' && rule.params[key] !== undefined) {
              nonEmptyParams[key] = rule.params[key];
            }
          });

          if (Object.keys(nonEmptyParams).length === 1) {
            const singleKey = Object.keys(nonEmptyParams)[0];
            if (['min', 'max', 'length', 'value', 'minAge', 'places', 'divisor', 'count', 'maxSize', 'minSize'].includes(singleKey)) {
              rulesConfig[rule.name] = nonEmptyParams[singleKey];
            } else {
              rulesConfig[rule.name] = nonEmptyParams;
            }
          } else if (Object.keys(nonEmptyParams).length > 0) {
            rulesConfig[rule.name] = nonEmptyParams;
          } else {
            rulesConfig[rule.name] = true;
          }
        } else {
          rulesConfig[rule.name] = true;
        }
      });

      // Format the output
      const rulesJson = JSON.stringify(rulesConfig, null, 2);
      jsCode = `formGuardian.addField('#${fieldId}', ${rulesJson});`;
    }

    this.previewJsConfig.textContent = jsCode;
    this.highlightCode(this.previewJsConfig);
  }

  /**
   * Update HTML DOM preview
   */
  updatePreviewHtmlDom() {
    if (!this.previewHtmlDom || !this.currentField) return;

    // Get the form group wrapper or just the field
    const formGroup = this.currentField.closest('.form-group, .mb-3, .mb-4');
    const element = formGroup || this.currentField;

    // Clone and clean up the HTML
    const clone = element.cloneNode(true);

    // Remove validation classes
    clone.querySelectorAll('.is-valid, .is-invalid, .has-error, .has-success').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid', 'has-error', 'has-success');
    });

    // Remove feedback elements
    clone.querySelectorAll('.invalid-feedback, .valid-feedback, .help-block').forEach(el => {
      el.remove();
    });

    // Add data-fg-rules attribute to the field in the clone
    const fieldId = this.currentField.id || this.currentField.name;
    const rules = this.fieldRules.get(fieldId) || [];

    if (rules.length > 0) {
      // Find the field element in the clone
      const clonedField = clone.querySelector(`#${fieldId}`) ||
                          clone.querySelector(`[name="${fieldId}"]`) ||
                          (clone.id === fieldId ? clone : null);

      if (clonedField) {
        // Build rules config object
        const rulesConfig = {};
        rules.forEach(rule => {
          if (rule.params && Object.keys(rule.params).length > 0) {
            const paramKeys = Object.keys(rule.params);
            const nonEmptyParams = {};
            paramKeys.forEach(key => {
              if (rule.params[key] !== '' && rule.params[key] !== undefined) {
                nonEmptyParams[key] = rule.params[key];
              }
            });

            if (Object.keys(nonEmptyParams).length === 1) {
              const singleKey = Object.keys(nonEmptyParams)[0];
              if (['min', 'max', 'length', 'value', 'minAge', 'places', 'divisor', 'count', 'maxSize', 'minSize'].includes(singleKey)) {
                rulesConfig[rule.name] = nonEmptyParams[singleKey];
              } else {
                rulesConfig[rule.name] = nonEmptyParams;
              }
            } else if (Object.keys(nonEmptyParams).length > 0) {
              rulesConfig[rule.name] = nonEmptyParams;
            } else {
              rulesConfig[rule.name] = true;
            }
          } else {
            rulesConfig[rule.name] = true;
          }
        });

        // Add the data attribute
        clonedField.setAttribute('data-fg-rules', JSON.stringify(rulesConfig));
      }
    }

    // Format the HTML
    let html = clone.outerHTML;

    // Basic HTML formatting
    html = this.formatHtml(html);

    this.previewHtmlDom.textContent = html;
    this.highlightCode(this.previewHtmlDom);
  }

  /**
   * Highlight code using Prism.js
   * @param {Element} codeElement
   */
  highlightCode(codeElement) {
    if (typeof Prism !== 'undefined' && codeElement) {
      Prism.highlightElement(codeElement);
    }
  }

  /**
   * Decode HTML entities
   * @param {string} html
   * @returns {string}
   */
  decodeHtmlEntities(html) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }

  /**
   * Format HTML with indentation
   * @param {string} html
   * @returns {string}
   */
  formatHtml(html) {
    // Decode HTML entities first (e.g., &quot; -> ")
    html = this.decodeHtmlEntities(html);

    // Simple HTML formatter
    let formatted = '';
    let indent = 0;
    const indentSize = 2;

    // Split by tags
    const tokens = html.split(/(<[^>]+>)/g).filter(t => t.trim());

    tokens.forEach(token => {
      if (token.startsWith('</')) {
        // Closing tag - decrease indent first
        indent = Math.max(0, indent - indentSize);
        formatted += ' '.repeat(indent) + token + '\n';
      } else if (token.startsWith('<') && !token.endsWith('/>') && !token.includes('</')) {
        // Opening tag
        formatted += ' '.repeat(indent) + token + '\n';
        // Self-closing tags or void elements don't increase indent
        if (!token.match(/<(input|img|br|hr|meta|link)/i)) {
          indent += indentSize;
        }
      } else if (token.startsWith('<')) {
        // Self-closing or void element
        formatted += ' '.repeat(indent) + token + '\n';
      } else {
        // Text content
        const trimmed = token.trim();
        if (trimmed) {
          formatted += ' '.repeat(indent) + trimmed + '\n';
        }
      }
    });

    return formatted.trim();
  }

  /**
   * Update field parameter selectors with available fields
   */
  updateFieldParamSelectors() {
    const fieldParams = this.ruleAccordion?.querySelectorAll('.fg-field-param');

    fieldParams?.forEach(select => {
      // Get options from main field selector
      const options = this.fieldSelector?.querySelectorAll('option, optgroup option');

      select.innerHTML = '<option value="">-- Select field --</option>';

      options?.forEach(opt => {
        if (opt.value) {
          const newOpt = opt.cloneNode(true);
          select.appendChild(newOpt);
        }
      });
    });
  }

  /**
   * Select a field to configure
   * @param {string} fieldId
   */
  selectField(fieldId) {
    if (!fieldId) {
      this.currentField = null;
      this.updateAppliedRules();
      this.updatePreviewPanel();
      this.updateFieldIndicators();
      this.updateSelectedFieldInfo();
      return;
    }

    this.currentField = document.getElementById(fieldId) ||
                        this.form?.querySelector(`[name="${fieldId}"]`);

    if (!this.currentField) {
      console.warn(`Field not found: ${fieldId}`);
      return;
    }

    this.updateAppliedRules();
    this.updatePreviewPanel();
    this.updateFieldIndicators();
    this.updateSelectedFieldInfo();

    // Open sidebar if on mobile
    if (this.sidebar && window.innerWidth < 768) {
      this.sidebar.open();
    }
  }

  /**
   * Update selected field info display in sidebar
   */
  updateSelectedFieldInfo() {
    const infoContainer = document.getElementById('selected-field-info');
    if (!infoContainer) return;

    if (!this.currentField) {
      infoContainer.innerHTML = `
        <div class="fg-no-field-selected">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12h8"/>
          </svg>
          <span>Click a field indicator to select</span>
        </div>
      `;
      return;
    }

    const fieldId = this.currentField.id || this.currentField.name;
    const label = this.getFieldLabel(this.currentField);
    const type = this.currentField.type || this.currentField.tagName.toLowerCase();
    const rulesCount = this.fieldRules.has(fieldId) ? this.fieldRules.get(fieldId).length : 0;

    infoContainer.innerHTML = `
      <div class="fg-selected-field-card">
        <div class="fg-selected-field-header">
          <div class="fg-selected-field-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              ${rulesCount > 0 ? '<path d="M9 12l2 2 4-4"/>' : ''}
            </svg>
          </div>
          <div class="fg-selected-field-details">
            <span class="fg-selected-field-label">${label}</span>
            <span class="fg-selected-field-type">${type}</span>
          </div>
          <button type="button" class="fg-deselect-field" title="Deselect field" aria-label="Deselect field">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        ${rulesCount > 0 ? `<div class="fg-selected-field-rules">${rulesCount} rule${rulesCount > 1 ? 's' : ''} applied</div>` : ''}
      </div>
    `;

    // Add deselect handler
    const deselectBtn = infoContainer.querySelector('.fg-deselect-field');
    deselectBtn?.addEventListener('click', () => {
      if (this.fieldSelector) {
        this.fieldSelector.value = '';
      }
      this.selectField('');
    });
  }

  /**
   * Update applied rules display
   */
  updateAppliedRules() {
    if (!this.appliedRulesList) return;

    const fieldId = this.currentField?.id || this.currentField?.name;
    const rules = fieldId ? this.fieldRules.get(fieldId) || [] : [];

    if (rules.length === 0) {
      this.appliedRulesList.innerHTML = '<p class="fg-no-rules">No rules applied</p>';
    } else {
      const html = rules.map(rule => `
        <div class="fg-applied-rule" data-rule="${rule.name}">
          <span class="fg-applied-rule-name">${rule.label}</span>
          ${rule.params ? `<span class="fg-applied-rule-params">${this.formatRuleParams(rule.params)}</span>` : ''}
          <button type="button" class="fg-applied-rule-remove" title="Remove rule">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      `).join('');

      this.appliedRulesList.innerHTML = html;
    }

    // Update rule cards to show applied state
    this.updateRuleCardsState();
  }

  /**
   * Update rule cards to show which are applied for current field
   */
  updateRuleCardsState() {
    if (!this.ruleAccordion) return;

    const fieldId = this.currentField?.id || this.currentField?.name;
    const rules = fieldId ? this.fieldRules.get(fieldId) || [] : [];

    // Create a map of applied rules for quick lookup
    const appliedRulesMap = new Map();
    rules.forEach(rule => {
      appliedRulesMap.set(rule.name, rule.params || {});
    });

    // Update all rule cards
    const ruleCards = this.ruleAccordion.querySelectorAll('.fg-rule-card');
    ruleCards.forEach(card => {
      const ruleName = card.dataset.rule;
      const isApplied = appliedRulesMap.has(ruleName);

      // Toggle applied class
      card.classList.toggle('fg-rule-applied', isApplied);

      // If applied, populate parameter inputs with current values
      // Don't clear inputs for non-applied rules to preserve default/user values
      if (isApplied) {
        const params = appliedRulesMap.get(ruleName);
        const paramInputs = card.querySelectorAll('.fg-param-input, .fg-param-checkbox');

        paramInputs.forEach(input => {
          const paramName = input.dataset.param;
          if (params[paramName] !== undefined && params[paramName] !== '') {
            if (input.type === 'checkbox') {
              input.checked = params[paramName];
            } else {
              input.value = params[paramName];
            }
          }
        });
      }
      // Note: We intentionally don't clear inputs for non-applied rules
      // This preserves default values and allows users to configure rules before applying
    });
  }

  /**
   * Format rule parameters for display
   * @param {Object} params
   * @returns {string}
   */
  formatRuleParams(params) {
    return Object.entries(params)
      .filter(([_, value]) => value !== '' && value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }

  /**
   * Add rule from card
   * @param {Element} ruleCard
   */
  addRuleFromCard(ruleCard) {
    if (!this.currentField) {
      alert('Please select a field first');
      return;
    }

    const ruleName = ruleCard.dataset.rule;
    const ruleLabel = ruleCard.querySelector('.fg-rule-name')?.textContent;

    // Get parameters
    const params = {};
    const paramInputs = ruleCard.querySelectorAll('.fg-param-input, .fg-param-checkbox');

    paramInputs.forEach(input => {
      const paramName = input.dataset.param;
      if (input.type === 'checkbox') {
        params[paramName] = input.checked;
      } else if (input.type === 'number') {
        // Convert number inputs to actual numbers
        params[paramName] = input.value !== '' ? Number(input.value) : '';
      } else {
        params[paramName] = input.value;
      }
    });

    this.addRule(ruleName, ruleLabel, params);
  }

  /**
   * Add a validation rule to current field
   * @param {string} ruleName
   * @param {string} ruleLabel
   * @param {Object} params
   */
  addRule(ruleName, ruleLabel, params = {}) {
    if (!this.currentField || !this.formGuardian) return;

    const fieldId = this.currentField.id || this.currentField.name;

    // Initialize field rules array if needed
    if (!this.fieldRules.has(fieldId)) {
      this.fieldRules.set(fieldId, []);
    }

    const rules = this.fieldRules.get(fieldId);

    // Check if rule already exists
    const existingIndex = rules.findIndex(r => r.name === ruleName);
    if (existingIndex >= 0) {
      // Update existing rule
      rules[existingIndex] = { name: ruleName, label: ruleLabel, params };
    } else {
      // Add new rule
      rules.push({ name: ruleName, label: ruleLabel, params });
    }

    // Update FormGuardian
    this.applyRulesToFormGuardian();
    this.updateAppliedRules();
    this.updatePreviewPanel();
    this.updateFieldIndicators();
    this.updateSelectedFieldInfo();

    // Persist to localStorage
    this.saveRulesToStorage();

    // Visual feedback
    this.showNotification(`Added "${ruleLabel}" rule`);
  }

  /**
   * Remove applied rule
   * @param {string} ruleName
   */
  removeAppliedRule(ruleName) {
    if (!this.currentField) return;

    const fieldId = this.currentField.id || this.currentField.name;
    const rules = this.fieldRules.get(fieldId);

    if (rules) {
      const index = rules.findIndex(r => r.name === ruleName);
      if (index >= 0) {
        const removed = rules.splice(index, 1)[0];
        this.applyRulesToFormGuardian();
        this.updateAppliedRules();
        this.updatePreviewPanel();
        this.updateFieldIndicators();
        this.updateSelectedFieldInfo();

        // Persist to localStorage
        this.saveRulesToStorage();

        this.showNotification(`Removed "${removed.label}" rule`);
      }
    }
  }

  /**
   * Apply all rules to FormGuardian
   */
  applyRulesToFormGuardian() {
    if (!this.formGuardian) return;

    this.fieldRules.forEach((rules, fieldId) => {
      const field = document.getElementById(fieldId) ||
                    this.form?.querySelector(`[name="${fieldId}"]`);

      if (!field) return;

      // Remove existing rules for this field
      this.formGuardian.removeField(`#${fieldId}`);

      if (rules.length === 0) return;

      // Build rules object for FormGuardian
      const rulesConfig = {};

      rules.forEach(rule => {
        // Handle rules with parameters
        if (rule.params && Object.keys(rule.params).length > 0) {
          // Check if we need to pass params as object or single value
          const paramKeys = Object.keys(rule.params);
          if (paramKeys.length === 1 && ['min', 'max', 'length', 'value', 'minAge', 'places', 'divisor', 'count', 'maxSize', 'minSize'].includes(paramKeys[0])) {
            rulesConfig[rule.name] = rule.params[paramKeys[0]];
          } else {
            rulesConfig[rule.name] = rule.params;
          }
        } else {
          rulesConfig[rule.name] = true;
        }
      });

      // Add field with rules
      this.formGuardian.addField(`#${fieldId}`, rulesConfig);
    });
  }

  /**
   * Clear all rules from all fields
   */
  clearAllRules() {
    this.fieldRules.clear();

    // Clear from localStorage
    this.clearRulesFromStorage();

    if (this.formGuardian) {
      this.formGuardian.clearErrors();
      // Re-initialize FormGuardian to clear all field registrations
      // Note: We need to avoid loading from storage after clearing
      this.formGuardian = new FormGuardian(this.formSelector, {
        bootstrapVersion: this.bootstrapVersion,
        validateOn: ['blur', 'change'],
        liveValidation: true,
        debounceMs: 300,
        showErrorContainer: true,
        errorContainerPosition: 'right-bottom',
        scrollToError: true,
        focusOnError: true
      });
      window.fg = this.formGuardian;
    }

    this.updateAppliedRules();
    this.updatePreviewPanel();
    this.updateFieldIndicators();
    this.showNotification('All rules cleared');
  }

  /**
   * Validate the entire form
   */
  async validateForm() {
    if (!this.formGuardian) return;

    const isValid = await this.formGuardian.validate();

    // Only show notification for success - errors are shown in the error container
    if (isValid) {
      this.showNotification('Form is valid!', 'success');
    }
  }

  /**
   * Show notification
   * @param {string} message
   * @param {string} type
   */
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.fg-notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `fg-notification fg-notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button type="button" class="fg-notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('fg-notification-show');
    });

    // Close button
    notification.querySelector('.fg-notification-close').addEventListener('click', () => {
      notification.classList.remove('fg-notification-show');
      setTimeout(() => notification.remove(), 200);
    });

    // Auto close
    setTimeout(() => {
      notification.classList.remove('fg-notification-show');
      setTimeout(() => notification.remove(), 200);
    }, 3000);
  }

  /**
   * Save validation rules to localStorage
   */
  saveRulesToStorage() {
    try {
      // Convert Map to array of entries for JSON serialization
      const rulesData = [];
      this.fieldRules.forEach((rules, fieldId) => {
        if (rules.length > 0) {
          rulesData.push({ fieldId, rules });
        }
      });

      localStorage.setItem(this.storageKey, JSON.stringify(rulesData));
    } catch (e) {
      console.warn('Failed to save rules to localStorage:', e);
    }
  }

  /**
   * Load validation rules from localStorage
   */
  loadRulesFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;

      const rulesData = JSON.parse(stored);
      if (!Array.isArray(rulesData)) return;

      // Restore rules to the Map
      rulesData.forEach(({ fieldId, rules }) => {
        if (fieldId && Array.isArray(rules) && rules.length > 0) {
          // Verify the field exists in the form
          const field = document.getElementById(fieldId) ||
                        this.form?.querySelector(`[name="${fieldId}"]`);

          if (field) {
            this.fieldRules.set(fieldId, rules);
          }
        }
      });

      // Apply rules to FormGuardian if available
      if (this.formGuardian) {
        this.applyRulesToFormGuardian();
      }

      // Update UI indicators
      this.updateFieldIndicators();

      // If there are saved rules, show a notification
      const totalRules = Array.from(this.fieldRules.values()).reduce((sum, r) => sum + r.length, 0);
      if (totalRules > 0) {
        this.showNotification(`Restored ${totalRules} saved rule${totalRules > 1 ? 's' : ''}`, 'info');
      }
    } catch (e) {
      console.warn('Failed to load rules from localStorage:', e);
    }
  }

  /**
   * Clear rules from localStorage
   */
  clearRulesFromStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn('Failed to clear rules from localStorage:', e);
    }
  }
}

export default DemoApp;
