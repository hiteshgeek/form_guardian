/**
 * FormGuardian Demo Application
 * Main entry point for the demo page
 */

import { DemoApp } from './demo/DemoApp.js';
import { ThemeSwitcher } from './demo/ThemeSwitcher.js';
import { BootstrapSwitcher } from './demo/BootstrapSwitcher.js';
import { Sidebar } from './demo/Sidebar.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Get config from PHP
  const config = window.FG_DEMO_CONFIG || {
    bootstrapVersion: 5,
    theme: 'light'
  };

  // Initialize theme switcher
  const themeSwitcher = new ThemeSwitcher({
    initialTheme: config.theme
  });

  // Initialize Bootstrap version switcher
  const bootstrapSwitcher = new BootstrapSwitcher({
    currentVersion: config.bootstrapVersion
  });

  // Initialize sidebar
  const sidebar = new Sidebar({
    element: document.getElementById('sidebar'),
    resizeHandle: document.getElementById('sidebar-resize'),
    toggleButton: document.getElementById('sidebar-toggle'),
    closeButton: document.getElementById('sidebar-close')
  });

  // Initialize demo application
  const demoApp = new DemoApp({
    formSelector: '#demo-form',
    bootstrapVersion: config.bootstrapVersion,
    sidebar: sidebar,
    fieldSelector: document.getElementById('field-selector'),
    appliedRulesList: document.getElementById('applied-rules-list'),
    ruleAccordion: document.getElementById('rule-accordion'),
    clearRulesButton: document.getElementById('clear-rules')
  });

  // Store globally for debugging
  window.fgDemo = {
    app: demoApp,
    themeSwitcher,
    bootstrapSwitcher,
    sidebar
  };
});
